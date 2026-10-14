import copy
import json
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path

from qualicraft.core import Store, add_code, add_document, annotate, merge_codes, new_project, validate_project
from qualicraft.server import create_server


def tree():
    project = new_project('Merge regression')
    doc = add_document(project, 'I1', 'abcdefgh')
    source = add_code(project, 'Source')
    child = add_code(project, 'Child', parent_id=source['id'])
    leaf = add_code(project, 'Leaf', parent_id=child['id'])
    target = add_code(project, 'Target')
    annotate(project, doc['id'], source['id'], 0, 4)
    annotate(project, doc['id'], source['id'], 4, 8)
    annotate(project, doc['id'], target['id'], 0, 4)
    return project, source, child, leaf, target


class MergeSafetyTests(unittest.TestCase):
    def test_self_child_and_deep_descendant_leave_everything_unchanged(self):
        for index in (1, 2, 3):
            project, source, *rest = tree()
            target = [source, *rest][index - 1]
            before = copy.deepcopy(project)
            with self.subTest(depth=index - 1):
                with self.assertRaises(ValueError):
                    merge_codes(project, source['id'], target['id'])
                self.assertEqual(project, before)

    def test_cross_tree_merge_keeps_moves_deduplication_children_and_audit(self):
        project, source, child, leaf, target = tree()
        audit_count = len(project['audit'])
        result = merge_codes(project, source['id'], target['id'])
        self.assertEqual(result['codings_moved'], 1)
        self.assertEqual(result['duplicates_collapsed'], 1)
        self.assertEqual(len(project['annotations']), 2)
        self.assertEqual({a['code_id'] for a in project['annotations']}, {target['id']})
        self.assertEqual(child['parent_id'], target['id'])
        self.assertEqual(leaf['parent_id'], child['id'])
        self.assertEqual(len(project['audit']), audit_count + 1)
        self.assertEqual(project['audit'][-1]['action'], 'code_merge')
        validate_project(project)

    def test_http_rejections_preserve_database_audit_and_snapshots(self):
        with tempfile.TemporaryDirectory() as tmp:
            store = Store(Path(tmp) / 'qualicraft.sqlite3')
            project, source, child, leaf, _ = tree()
            store.create(project)
            server = create_server(tmp, tmp, port=0)
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            base = f'http://127.0.0.1:{server.server_port}'
            try:
                with urllib.request.urlopen(base + '/api/bootstrap') as response:
                    token = json.load(response)['token']
                before = store.get(project['id'])
                snapshots = store.backups(project['id'])
                with store.connect() as conn:
                    db_before = conn.execute('SELECT * FROM projects ORDER BY id').fetchall()
                for target in (source, child, leaf):
                    with self.subTest(target=target['name']):
                        req = urllib.request.Request(base + '/api/projects/' + project['id'] + '/code-merge',
                            data=json.dumps({'source_id': source['id'], 'target_id': target['id']}).encode(),
                            headers={'Content-Type': 'application/json', 'X-QualiCraft-Token': token})
                        with self.assertRaises(urllib.error.HTTPError) as caught:
                            urllib.request.urlopen(req, timeout=3)
                        self.assertEqual(caught.exception.code, 400)
                        self.assertEqual(store.get(project['id']), before)
                        self.assertEqual(store.backups(project['id']), snapshots)
                        with store.connect() as conn:
                            self.assertEqual(conn.execute('SELECT * FROM projects ORDER BY id').fetchall(), db_before)
            finally:
                server.shutdown()
                server.server_close()
                thread.join()
