"""Startup and bundled Bologna example regressions; no private guide/data access."""
import contextlib
import hashlib
import json
from pathlib import Path
import sqlite3
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from unittest.mock import patch
from qualicraft import server
from qualicraft.core import Store, new_project

TEMPLATE = Path(__file__).resolve().parents[1] / 'demo-data' / 'qualicraft.sqlite3'

@contextlib.contextmanager
def workspace(data_dir, public=False):
    app = server.create_server(data_dir, Path(data_dir) / 'no-guide', port=0, public_demo=public)
    thread = threading.Thread(target=app.serve_forever, daemon=True)
    thread.start()
    base = f'http://127.0.0.1:{app.server_port}'
    def request(path, body=None, token=''):
        req = urllib.request.Request(base + path, data=json.dumps(body).encode() if body is not None else None,
            headers={'X-QualiCraft-Token': token, 'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=5) as response:
            return json.load(response)
    try:
        yield request
    finally:
        app.shutdown(); app.server_close(); thread.join()

class StartupTests(unittest.TestCase):
    def test_fresh_workspace_does_not_seed_a_project_or_snapshot(self):
        with tempfile.TemporaryDirectory() as tmp, workspace(tmp) as request:
            boot = request('/api/bootstrap')
            self.assertEqual(boot['projects'], [])
            self.assertEqual(Store(Path(tmp) / 'qualicraft.sqlite3').list(), [])
            self.assertEqual(list(Path(tmp).rglob('*.json')), [])
            self.assertTrue(boot['config']['bologna_example_available'])

    def test_bologna_is_an_explicit_independent_copy_and_template_is_unchanged(self):
        digest = hashlib.sha256(TEMPLATE.read_bytes()).hexdigest()
        with sqlite3.connect(TEMPLATE.resolve().as_uri() + '?mode=ro', uri=True) as db:
            original = json.loads(db.execute('select data from projects where id=?', ('a71a0b538c024c3ab23fb4286cfe93e2',)).fetchone()[0])
        from qualicraft.examples import teaching_project
        original=teaching_project()
        with tempfile.TemporaryDirectory() as tmp, workspace(tmp) as request:
            boot = request('/api/bootstrap'); token = boot['token']
            copies = [request('/api/projects', {'kind': 'bologna'}, token) for _ in range(2)]
            self.assertEqual(len({p['id'] for p in copies} | {original['id']}), 3)
            for p in copies:
                self.assertEqual(p['schema_version'], 5)
                self.assertTrue(all(not d['reading_state']['marks'] for d in p['documents']))
                self.assertEqual(p['documents'], original['documents'])
                for key in ['codes', 'annotations', 'suggestions', 'blocks', 'provenance']:
                    self.assertEqual(p[key], original[key], key)
                self.assertEqual(p['audit'][:-1], original['audit'])
                self.assertEqual(p['audit'][-1]['action'], 'example_copy')
                self.assertEqual(p['audit'][-1]['example'], 'bologna')
                self.assertIn('Bologna', p['name'])
        self.assertEqual(hashlib.sha256(TEMPLATE.read_bytes()).hexdigest(), digest)

    def test_missing_example_is_unavailable_and_rejected_without_creating_project(self):
        with tempfile.TemporaryDirectory() as tmp, patch.object(server, 'ROOT', Path(tmp)), workspace(tmp) as request:
            boot = request('/api/bootstrap')
            self.assertFalse(boot['config']['bologna_example_available'])
            with self.assertRaises(urllib.error.HTTPError) as caught:
                request('/api/projects', {'kind': 'bologna'}, boot['token'])
            self.assertEqual(caught.exception.code, 400)
            caught.exception.close()
            self.assertEqual(request('/api/projects', token=boot['token']), [])

    def test_public_demo_does_not_offer_a_writeable_example_copy(self):
        with tempfile.TemporaryDirectory() as tmp, workspace(tmp, public=True) as request:
            boot = request('/api/bootstrap')
            with self.assertRaises(urllib.error.HTTPError) as caught:
                request('/api/projects', {'kind': 'bologna'}, boot['token'])
            self.assertEqual(caught.exception.code, 403)
            caught.exception.close()
            self.assertEqual(request('/api/projects', token=boot['token']), [])

    def test_existing_projects_and_snapshots_survive_startup_unchanged(self):
        with tempfile.TemporaryDirectory() as tmp:
            store = Store(Path(tmp) / 'qualicraft.sqlite3'); p = new_project('Bologna review'); store.create(p)
            before = store.get(p['id']); snapshots = store.backups(p['id'])
            with workspace(tmp) as request:
                boot = request('/api/bootstrap')
                self.assertEqual([p['id']], [p['id'] for p in boot['projects']])
                self.assertEqual(request('/api/projects/' + p['id'], token=boot['token']), before)
            self.assertEqual(store.backups(p['id']), snapshots)
