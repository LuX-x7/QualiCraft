"""Manual workflow marks use Bologna only, independent of research codings."""
import copy
from contextlib import closing
import hashlib
import json
import sqlite3
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
import uuid
from pathlib import Path
from unittest.mock import patch

from qualicraft import core
from qualicraft.server import create_server


def example():
    with closing(sqlite3.connect('file:demo-data/qualicraft.sqlite3?mode=ro', uri=True)) as db:
        return json.loads(db.execute('SELECT data FROM projects').fetchone()[0])


class ReadingMarksTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.store = core.Store(Path(self.tmp.name) / 'qualicraft.sqlite3')
        self.old = example()
        # Insert the original v4 row without upgrading or seeding a snapshot.
        with self.store.connect() as db:
            db.execute('INSERT INTO projects VALUES (?,?)', (self.old['id'], json.dumps(self.old)))
        self.pid = self.old['id']
        self.doc = self.old['documents'][0]
        self.para = core.paragraphs(self.doc['text'])[4]  # no coding required

    def request(self, status='read', revision=0, **changes):
        return dict(document_id=self.doc['id'], source_sha256=self.doc['sha256'],
                    start=self.para['start'], end=self.para['end'], status=status,
                    expected_revision=revision, request_id=uuid.uuid4().hex, **changes)

    def mark(self, body):
        return self.store.change_reading(self.pid, body)

    def raw(self):
        with self.store.connect() as db:
            return db.execute('SELECT data FROM projects WHERE id=?', (self.pid,)).fetchone()[0]

    def test_neutral_migration_get_and_import_identity(self):
        before = self.raw()
        project = self.store.get(self.pid)
        self.assertEqual(project['schema_version'], 5)
        self.assertTrue(all(not d['reading_state']['marks'] for d in project['documents']))
        self.assertEqual(self.raw(), before)
        self.assertEqual(self.store.backups(self.pid), [])
        imported = core.add_document(project, self.doc['name'], self.doc['text'])
        self.assertNotEqual(imported['id'], self.doc['id'])
        self.assertEqual(imported['reading_state']['marks'], [])

    def test_set_clear_undo_idempotency_and_snapshot_timing(self):
        before_csv = core.csv_export(self.store.get(self.pid))
        body = self.request()
        result = self.mark(body)
        self.assertEqual(result['reading_state']['marks'][0]['status'], 'read')
        snapshots = self.store.backups(self.pid)
        self.assertEqual(len(snapshots), 1)
        saved = json.loads((self.store.backup_dir / self.pid / snapshots[0]['name']).read_text(encoding="utf-8"))
        self.assertEqual(saved, self.old)  # persisted v4, not migrated v5
        before = self.raw()
        self.mark(body)
        self.assertEqual(self.raw(), before)
        self.mark(self.request(revision=1))  # same status is a no-op too
        self.assertEqual(self.raw(), before)
        self.mark(self.request('revisit', 1))
        self.mark(self.request('unmarked', 2))
        self.mark(self.request('revisit', 3))  # explicit undo
        self.assertEqual(len(self.store.backups(self.pid)), 1)
        current = self.store.get(self.pid)
        self.assertEqual(current['documents'][0]['reading_state']['revision'], 4)
        self.assertEqual(core.csv_export(current), before_csv)
        self.assertEqual(current['annotations'], self.old['annotations'])
        self.assertNotIn('quote', current['audit'][-1])
        self.store.change(self.pid, lambda p: core.update_document(p, self.doc['id'], {'memo': 'Bologna workflow check'}))
        latest = self.store.backups(self.pid)[0]
        saved = json.loads((self.store.backup_dir / self.pid / latest['name']).read_text(encoding="utf-8"))
        self.assertEqual(saved['documents'][0]['reading_state'], current['documents'][0]['reading_state'])
        restored = self.store.restore(self.pid, snapshots[0]['name'])
        self.assertNotEqual(restored['id'], self.pid)
        self.assertEqual(restored['documents'][0]['reading_state']['marks'], [])

    def test_rejections_conflict_and_failed_checkpoint_are_atomic(self):
        original = self.raw()
        for key, value in [('start', True), ('end', self.para['end']-1), ('status', 'complete'),
                           ('source_sha256', '0'*64), ('expected_revision', 1), ('request_id', '../bad')]:
            body = self.request(); body[key] = value
            with self.subTest(key=key), self.assertRaises(ValueError):
                self.mark(body)
            self.assertEqual(self.raw(), original)
            self.assertEqual(self.store.backups(self.pid), [])
        with patch.object(core.os, 'replace', side_effect=OSError('checkpoint unavailable')):
            with self.assertRaises(ValueError):
                self.mark(self.request())
        self.assertEqual(self.raw(), original)
        self.mark(self.request())
        before = self.raw()
        with self.assertRaises(core.ReadingConflict):
            self.mark(self.request('unmarked', 0))
        self.assertEqual(self.raw(), before)

    def test_31_reading_writes_replay_and_research_upgrade_checkpoint(self):
        for index, para in enumerate(core.paragraphs(self.doc['text'])):
            body = self.request(revision=index); body.update(start=para['start'], end=para['end'])
            self.mark(body)
            if index == 0: first = body
        self.assertEqual(len(self.store.backups(self.pid)), 1)
        before = self.raw(); self.mark(first)
        self.assertEqual(self.raw(), before)
        bad = {**first, 'status':'revisit'}
        with self.assertRaises(ValueError): self.mark(bad)
        self.assertEqual(self.raw(), before)
        # An ordinary research edit must also checkpoint a persisted v4 row.
        with self.store.connect() as db:
            db.execute('UPDATE projects SET data=? WHERE id=?', (json.dumps(self.old), self.pid))
        original = self.raw()
        with patch.object(core.os, 'replace', side_effect=OSError('upgrade unavailable')):
            with self.assertRaises(ValueError):
                self.store.change(self.pid, lambda p: core.update_document(p, self.doc['id'], {'memo':'Bologna check'}))
        self.assertEqual(self.raw(), original)
        with patch.object(core, 'SCHEMA_VERSION', 4), self.assertRaises(ValueError):
            core.validate_project(core.migrate(copy.deepcopy(self.old)) | {'schema_version':5})

    def test_unicode_boundaries_and_independent_research_edits(self):
        project = self.store.get(self.pid)
        text = core.paragraphs(self.doc['text'])[0]['text']+'😀\r\n  \r\n'+self.para['text']
        document = core.add_document(project, 'Bologna CP boundary fixture', text)
        project['id'] = core.uid(); self.store.create(project)
        para = core.paragraphs(text)[1]
        body = self.request(); body.update(document_id=document['id'], source_sha256=document['sha256'], start=para['start'], end=para['end'])
        self.store.change_reading(project['id'], body)
        saved = self.store.get(project['id'])['documents'][-1]['reading_state']
        self.assertEqual(saved['marks'][0], {'start':para['start'],'end':para['end'],'status':'read'})
        self.store.change(project['id'], lambda p: core.update_document(p,document['id'],{'name':'Renamed Bologna fixture'}))
        self.assertEqual(self.store.get(project['id'])['documents'][-1]['reading_state'], saved)
        self.store.change(project['id'], lambda p: p['annotations'].clear())
        self.assertEqual(self.store.get(project['id'])['documents'][-1]['reading_state'], saved)

    def test_restore_validation_stale_source_and_checked_reset(self):
        self.mark(self.request())
        project = self.store.get(self.pid)
        state = project['documents'][0]['reading_state']
        for field, value in [('status', 'unknown'), ('start', 1.5), ('start', True), ('end', self.para['end']-1)]:
            bad = copy.deepcopy(project); bad['documents'][0]['reading_state']['marks'][0][field] = value
            with self.subTest(field=field), self.assertRaises(ValueError): core.validate_project(bad)
        bad = copy.deepcopy(project); bad['documents'][0]['reading_state']['marks'] *= 2
        with self.assertRaises(ValueError): core.validate_project(bad)
        broken = self.store.backup_dir / self.pid / '000002.json'
        broken.write_text(json.dumps(bad), encoding='utf-8')
        before, snapshots = self.raw(), self.store.backups(self.pid)
        with self.assertRaises(ValueError): self.store.restore(self.pid, broken.name)
        self.assertEqual(self.raw(), before)
        self.assertEqual(self.store.backups(self.pid), snapshots)
        # Structurally valid old-source marks are retained but cannot be applied.
        state['source_sha256'] = '0'*64
        core.validate_project(project)
        with self.store.connect() as db:
            db.execute('UPDATE projects SET data=? WHERE id=?', (json.dumps(project), self.pid))
        before = self.raw()
        with self.assertRaises(core.ReadingConflict): self.mark(self.request(revision=1))
        reset = self.request(revision=1); reset['confirmed'] = True
        with patch.object(core.os, 'replace', side_effect=OSError('reset checkpoint unavailable')):
            with self.assertRaises(ValueError): self.store.change_reading(self.pid, reset, reset=True)
        self.assertEqual(self.raw(), before)
        self.store.change_reading(self.pid, reset, reset=True)
        self.assertEqual(self.store.get(self.pid)['documents'][0]['reading_state']['marks'], [])

    def test_capacity_rejection_and_unicode_whole_line_ranges(self):
        project = self.store.get(self.pid)
        # This Bologna line, with a supplementary Unicode fixture suffix, proves CP != UTF16.
        text = core.paragraphs(self.doc['text'])[0]['text'] + '😀\r\n  \r\n' + self.para['text']
        d = core.add_document(project, 'Bologna Unicode boundary fixture', text)
        self.store.create({**project, 'id': core.uid()})
        paras = core.paragraphs(text)
        self.assertEqual(paras[1]['start'], len(paras[0]['text'])+6)
        for cap in ('READING_MAX_MARKS', 'READING_MAX_BYTES'):
            before = self.raw()
            with patch.object(core, cap, 0), self.assertRaises(ValueError): self.mark(self.request())
            self.assertEqual(self.raw(), before)
        project['audit'] = [{'id': str(i)} for i in range(100000)]
        with self.store.connect() as db: db.execute('UPDATE projects SET data=? WHERE id=?', (json.dumps(project), self.pid))
        before = self.raw()
        with self.assertRaises(ValueError): self.mark(self.request())
        self.assertEqual(self.raw(), before)

    def test_http_roundtrip_conflict_restore_and_readonly(self):
        server = create_server(self.tmp.name, self.tmp.name, port=0)
        thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
        self.addCleanup(server.server_close); self.addCleanup(server.shutdown)
        base = f'http://127.0.0.1:{server.server_port}'
        token = json.load(urllib.request.urlopen(base+'/api/bootstrap'))['token']
        def post(path, body, auth=token):
            return urllib.request.urlopen(urllib.request.Request(base+path, json.dumps(body).encode(),
                headers={'Content-Type':'application/json', 'X-QualiCraft-Token':auth}))
        path = '/api/projects/'+self.pid+'/reading-mark'
        with self.assertRaises(urllib.error.HTTPError) as denied: post(path, self.request(), 'wrong')
        denied.exception.close()
        json.load(post(path, self.request()))
        with self.assertRaises(urllib.error.HTTPError) as caught: post(path, self.request('revisit'))
        self.assertEqual(caught.exception.code, 409)
        caught.exception.close()
        exported = json.load(urllib.request.urlopen(urllib.request.Request(base+'/api/projects/'+self.pid+'/export?format=json', headers={'X-QualiCraft-Token': token})))
        restored = json.load(post('/api/projects', {'kind':'restore','project':exported}))
        self.assertNotEqual(restored['id'], self.pid)
        self.assertEqual(restored['documents'][0]['reading_state'], exported['documents'][0]['reading_state'])
        self.assertEqual(restored['schema_version'], 5)
        over_limit = copy.deepcopy(exported)
        over_limit['audit'] = [{'id':str(i)} for i in range(100000)]
        before_projects = server.store.list()
        with self.assertRaises(urllib.error.HTTPError) as caught:
            post('/api/projects', {'kind':'restore','project':over_limit})
        self.assertEqual(caught.exception.code, 400); caught.exception.close()
        self.assertEqual(server.store.list(), before_projects)
        server.shutdown(); thread.join()
        readonly = create_server(self.tmp.name, self.tmp.name, port=0, public_demo=True)
        t = threading.Thread(target=readonly.serve_forever, daemon=True); t.start()
        self.addCleanup(readonly.server_close); self.addCleanup(readonly.shutdown)
        base = f'http://127.0.0.1:{readonly.server_port}'
        before = self.raw()
        with self.assertRaises(urllib.error.HTTPError) as caught: post(path, self.request('revisit', 1))
        self.assertEqual(caught.exception.code, 403)
        caught.exception.close()
        self.assertEqual(self.raw(), before)


if __name__ == '__main__': unittest.main()
