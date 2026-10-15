"""Source references are response metadata; graph counts and saved data stay fixed."""
import copy
import json
import tempfile
import threading
import unittest
import urllib.request

from qualicraft import analyze, server
from qualicraft.core import Store, add_code, add_document, annotate, new_project


def evidence_project():
    project = new_project('Source reference regression')
    text = '😀 prefix ' + 'source marker ' * 12
    # Identical names and text cannot be used as source identity.
    first = add_document(project, 'Same document', text)
    second = add_document(project, 'Same document', text)
    left = add_code(project, 'Left')
    right = add_code(project, 'Right')
    one = add_code(project, 'Shared', parent_id=left['id'])
    two = add_code(project, 'Shared', parent_id=right['id'])
    annotate(project, first['id'], one['id'], 0, 120)
    annotate(project, first['id'], two['id'], 0, 120)
    annotate(project, second['id'], one['id'], 0, 120)
    return project


class NetworkEvidenceTests(unittest.TestCase):
    def test_references_use_annotation_and_document_ids_with_unicode_ranges(self):
        project = evidence_project()
        graph = server.network_response(project)
        passages = [n for n in graph['nodes'] if n['kind'] == 'passage']
        self.assertEqual(len(passages), 3)
        for node, annotation in zip(passages, project['annotations']):
            self.assertEqual(node['annotation_id'], annotation['id'])
            self.assertEqual(node['document_id'], annotation['document_id'])
            self.assertEqual((node['start'], node['end']), (0, 120))
            doc = next(d for d in project['documents'] if d['id'] == node['document_id'])
            self.assertEqual(doc['text'][node['start']:node['end']], annotation['quote'])
            self.assertEqual(node['label'], annotation['quote'][:80])
        self.assertNotEqual(passages[0]['document_id'], passages[2]['document_id'])

    def test_metadata_preserves_graph_units_links_ids_and_project(self):
        project = evidence_project()
        before = copy.deepcopy(project)
        expected = analyze.network(analyze.tidy(project))
        actual = server.network_response(project)
        for node in actual['nodes']:
            for key in ('annotation_id', 'document_id', 'start', 'end'):
                node.pop(key, None)
        self.assertEqual(actual, expected)
        self.assertEqual(project, before)
        self.assertEqual(project['schema_version'], 4)

    def test_deleted_code_rows_do_not_shift_source_references(self):
        project = evidence_project()
        project['annotations'].insert(0, {**project['annotations'][0], 'id': 'orphan', 'code_id': 'removed'})
        graph = server.network_response(project)
        refs = [n['annotation_id'] for n in graph['nodes'] if n['kind'] == 'passage']
        self.assertEqual(refs, [a['id'] for a in project['annotations'][1:]])

    def test_without_passages_keeps_existing_response(self):
        project = evidence_project()
        self.assertEqual(server.network_response(project, passages=False),
                         analyze.network(analyze.tidy(project), passages=False))

    def test_http_response_exposes_refs_without_writing_audit_or_snapshots(self):
        with tempfile.TemporaryDirectory() as tmp:
            store = Store(tmp + '/qualicraft.sqlite3')
            project = evidence_project()
            store.create(project)
            app = server.create_server(tmp, tmp, port=0)
            thread = threading.Thread(target=app.serve_forever, daemon=True)
            thread.start()
            base = f'http://127.0.0.1:{app.server_port}'
            try:
                with urllib.request.urlopen(base + '/api/bootstrap') as r:
                    token = json.load(r)['token']
                before = store.get(project['id'])
                snapshots = store.backups(project['id'])
                req = urllib.request.Request(base + '/api/projects/' + project['id'] + '/network',
                                             headers={'X-QualiCraft-Token': token})
                with urllib.request.urlopen(req) as r:
                    result = json.load(r)
                refs = [n for n in result['nodes'] if n['kind'] == 'passage']
                self.assertEqual({n['annotation_id'] for n in refs}, {a['id'] for a in project['annotations']})
                self.assertEqual(store.get(project['id']), before)
                self.assertEqual(store.backups(project['id']), snapshots)
            finally:
                app.shutdown()
                app.server_close()
                thread.join()
