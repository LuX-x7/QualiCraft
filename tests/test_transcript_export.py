"""Coded transcript contracts. Bundled CC0 Bologna text only."""
import copy
from contextlib import closing
import hashlib
import io
import json
import sqlite3
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from qualicraft import core, transcript
from qualicraft.server import create_server


def example():
    with closing(sqlite3.connect('file:demo-data/qualicraft.sqlite3?mode=ro', uri=True)) as db:
        return core.migrate(json.loads(db.execute('SELECT data FROM projects').fetchone()[0]))


class TranscriptTests(unittest.TestCase):
    def setUp(self):
        self.p = example()
        self.d = self.p['documents'][0]

    def test_full_text_scope_order_and_no_mutation(self):
        before = copy.deepcopy(self.p)
        data = transcript.freeze(self.p)
        self.assertEqual([d['text'] for d in data['documents']], [d['text'] for d in self.p['documents']])
        self.assertEqual(data['association_count'], 874)
        self.assertEqual(self.p, before)
        ids = [d['id'] for d in self.p['documents'][:2]]
        selected = transcript.freeze(self.p, ids[::-1])
        self.assertEqual([d['id'] for d in selected['documents']], ids)
        for invalid in [[], ['missing'], ids + ids[:1]]:
            with self.assertRaises(ValueError):
                transcript.freeze(self.p, invalid)

    def test_unicode_overlaps_nested_cross_paragraph_and_every_character(self):
        # Technical Unicode prefix; the research text remains Bologna.
        self.d['text'] = '🧪 e\u0301\r\n\r\n' + self.d['text']
        self.p['annotations'] = []
        codes = self.p['codes'][:4]
        for start, end, c in [(0, 6, codes[0]), (0, 6, codes[1]), (2, 4, codes[2]), (4, 35, codes[3])]:
            core.annotate(self.p, self.d['id'], c['id'], start, end)
        data = transcript.freeze(self.p, [self.d['id']])
        doc = data['documents'][0]
        self.assertEqual(''.join(t['text'] for b in doc['blocks'] for t in b['tokens']), self.d['text'])
        self.assertEqual(data['association_count'], 4)
        self.assertEqual(data['range_count'], 3)
        for a in doc['annotations']:
            visible = ''.join(t['text'] for b in doc['blocks'] for t in b['tokens'] if a['key'] in t['keys'])
            self.assertEqual(visible, self.d['text'][a['start']:a['end']])

    def test_tree_ids_parent_coding_and_no_invented_roles(self):
        root = core.add_code(self.p, 'UX44 root', '')
        middle = core.add_code(self.p, 'UX44 middle', '', parent_id=root['id'])
        leaf = core.add_code(self.p, 'UX44 leaf', '', parent_id=middle['id'])
        deep = core.add_code(self.p, 'UX44 deep', '', parent_id=leaf['id'])
        self.p['annotations'] = []
        for c in [root, middle, leaf, deep]:
            core.annotate(self.p, self.d['id'], c['id'], 0, 5)
        doc = transcript.freeze(self.p, [self.d['id']])['documents'][0]
        self.assertEqual([n['id'] for n in doc['annotations'][-1]['path']], [root['id'], middle['id'], leaf['id'], deep['id']])
        self.assertEqual([n['role'] for n in doc['annotations'][-1]['path']], ['Group', 'Group', 'Group', 'Code'])
        self.assertEqual(doc['annotations'][0]['code_id'], root['id'])

    def test_duplicate_display_paths_keep_full_identity(self):
        leaf = next(c for c in self.p['codes'] if c['name'] == 'ancient manuscripts')
        a = core.annotate(self.p, self.d['id'], leaf['id'], 0, 5)
        path = transcript.freeze(self.p, [self.d['id']])['documents'][0]['annotations'][-1]['label']
        other = core.add_code(self.p, path, '')
        core.annotate(self.p, self.d['id'], other['id'], 0, 5)
        anns = transcript.freeze(self.p, [self.d['id']])['documents'][0]['annotations']
        chosen = [x for x in anns if x['id'] == a['id'] or x['code_id'] == other['id']]
        self.assertEqual(len({a['label'] for a in chosen}), 2)
        self.assertTrue(all(a['code_id'] in a['label'] for a in chosen))

    def test_version_notes_exclusion_and_stale_evidence(self):
        self.d['memo'] = 'PRIVATE_NOTE_SENTINEL'
        data = transcript.freeze(self.p, [self.d['id']])
        self.assertNotIn('PRIVATE_NOTE_SENTINEL', json.dumps(data))
        self.assertNotIn('reading_state', json.dumps(data))
        self.assertNotIn('suggestions', data)
        version = data['version']
        self.d['reading_state']['revision'] += 1
        self.assertEqual(transcript.freeze(self.p, [self.d['id']])['version'], version)
        with_notes = transcript.freeze(self.p, [self.d['id']], True)
        self.assertIn('PRIVATE_NOTE_SENTINEL', json.dumps(with_notes))
        self.assertNotEqual(with_notes['version'], version)
        self.p['codes'][0]['name'] += ' updated'
        self.assertNotEqual(transcript.freeze(self.p, [self.d['id']])['version'], version)

    def test_html_is_escaped_self_contained_and_preserves_cr(self):
        self.d['text'] = '<script>alert(1)</script>\r\n' + self.d['text']
        self.p['annotations'] = []
        data = transcript.freeze(self.p, [self.d['id']])
        output = transcript.html_export(data).decode()
        self.assertIn('&lt;script&gt;alert(1)&lt;/script&gt;&#13;', output)
        self.assertNotIn('<script>alert(1)', output)
        self.assertIn('default-src', output)
        self.assertNotIn('<script src=', output)
        self.assertNotIn('fetch(', output)
        self.assertIn('No saved codings', output)

    def test_empty_project_and_invalid_saved_evidence_fail_explicitly(self):
        p = core.new_project('Bologna empty workflow check')
        self.assertIn('No documents', transcript.html_export(transcript.freeze(p)).decode())
        self.p['annotations'][0]['quote'] = 'wrong'
        with self.assertRaises(ValueError):
            transcript.freeze(self.p)

    def test_docx_editable_text_highlights_and_shared_frozen_manifest(self):
        data = transcript.freeze(self.p, [self.d['id']])
        with zipfile.ZipFile(io.BytesIO(transcript.docx_export(data))) as z:
            xml = ET.fromstring(z.read('word/document.xml'))
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            self.assertTrue(xml.findall('.//w:shd', ns))
            self.assertFalse(xml.findall('.//w:drawing', ns))
            sources = xml.findall('.//w:tc[1]//w:p[@w:rsidR="00000001"]', ns)
            plain = ''.join(transcript.word_plain(p) for p in sources)
            self.assertEqual(plain, self.d['text'])
            saved = json.loads(ET.fromstring(z.read('customXml/item1.xml')).text)
            self.assertEqual(saved, data)
            self.assertNotIn(b'TargetMode="External"', b''.join(z.read(n) for n in z.namelist() if n.endswith('.rels')))

    def test_explicit_display_roles_preserve_ancestry_evidence_and_source(self):
        before = copy.deepcopy(self.p)
        plain = transcript.freeze(self.p, [self.d['id']])
        named = transcript.freeze(self.p, [self.d['id']], role_labels='theme-category-code')
        self.assertEqual(self.p, before)
        self.assertNotEqual(plain['version'], named['version'])
        self.assertEqual(plain['association_count'], named['association_count'])
        for a, b in zip(plain['documents'][0]['annotations'], named['documents'][0]['annotations']):
            self.assertEqual(a['id'], b['id'])
            self.assertEqual([n['id'] for n in a['path']], [n['id'] for n in b['path']])
            self.assertEqual(a['quote'], b['quote'])
        self.assertEqual({n['role'] for a in named['documents'][0]['annotations'] for n in a['path']}, {'Theme', 'Category', 'Code'})
        with self.assertRaises(ValueError):
            transcript.freeze(self.p, role_labels='automatic-analysis')

    def test_notebook_layout_has_clear_roles_and_separate_record_details(self):
        data = transcript.freeze(self.p, [self.d['id']], role_labels='theme-category-code')
        output = transcript.html_export(data).decode()
        self.assertIn('class="node-heading" data-role="Category"', output)
        self.assertIn('<details class="evidence-meta">', output)
        self.assertNotIn('<table', output)
        with zipfile.ZipFile(io.BytesIO(transcript.docx_export(data))) as z:
            xml = ET.fromstring(z.read('word/document.xml'))
            ns = {'w': transcript.W}
            borders = xml.findall('.//w:tblBorders/*', ns)
            self.assertTrue(borders)
            self.assertTrue(all(b.get('{'+transcript.W+'}val') == 'nil' for b in borders))
            self.assertIn('Record details', transcript.word_plain(xml))
            self.assertNotIn('└─', transcript.word_plain(xml))


class TranscriptHTTPTests(unittest.TestCase):
    def test_download_auth_scope_headers_and_original_exports_unchanged(self):
        with tempfile.TemporaryDirectory() as temp:
            server = create_server(temp, temp, port=0)
            thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
            try:
                base = f'http://127.0.0.1:{server.server_port}'
                token = json.load(urllib.request.urlopen(base+'/api/bootstrap'))['token']
                p = example(); store = core.Store(Path(temp)/'qualicraft.sqlite3'); store.create(p)
                before = (Path(temp)/'qualicraft.sqlite3').read_bytes()
                root = base+'/api/projects/'+p['id']+'/export?format='
                for fmt in ['coded-html', 'coded-docx', 'coded-version']:
                    req = urllib.request.Request(root+fmt+'&document_id='+p['documents'][0]['id'], headers={'X-QualiCraft-Token': token})
                    with urllib.request.urlopen(req) as response:
                        self.assertEqual(response.status, 200)
                        self.assertEqual(len(response.headers['X-QT-Evidence-Version']), 64)
                        if fmt != 'coded-version': self.assertIn('attachment', response.headers['Content-Disposition'])
                for suffix in ['coded-html&document_id=missing', 'coded-docx&memos=invalid', 'coded-html&document_id=', 'coded-html&role_labels=invalid', 'coded-html&role_labels=saved&role_labels=saved']:
                    with self.assertRaises(urllib.error.HTTPError) as caught:
                        urllib.request.urlopen(urllib.request.Request(root+suffix, headers={'X-QualiCraft-Token': token}))
                    self.assertEqual(caught.exception.code, 400)
                with self.assertRaises(urllib.error.HTTPError):
                    urllib.request.urlopen(root+'coded-html')
                for fmt, expected in [('csv', core.csv_export(p)), ('matrix', core.csv_export(p, True)), ('methods', core.methods_narrative(p).encode())]:
                    response = urllib.request.urlopen(urllib.request.Request(root+fmt, headers={'X-QualiCraft-Token': token}))
                    self.assertEqual(response.read(), expected)
                self.assertEqual(store.get(p['id']), p)
                self.assertEqual((Path(temp)/'qualicraft.sqlite3').read_bytes(), before)
            finally:
                server.shutdown(); server.server_close(); thread.join()
