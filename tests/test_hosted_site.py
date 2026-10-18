import base64
import hashlib
import gzip
import json
from pathlib import Path
import tempfile
import threading
import unittest
import urllib.request
import urllib.error
from unittest.mock import patch

from qualicraft.hosted import StaticSite, create_hosted


class HostedSiteTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.site = self.root / 'public'
        self.site.mkdir()
        (self.site / '.qt-pages-artifact').write_text('QT static website', encoding='utf-8')
        (self.site / 'qt-release.json').write_text(json.dumps({'prefix': '/QualiCraft', 'test_only': False}), encoding='utf-8')
        self.script = b'window.testReady=true;'
        self.html = b'<!doctype html><script>' + self.script + b'</script><h1>QT</h1>'
        (self.site / 'index.html').write_bytes(self.html)
        (self.site / 'report').mkdir()
        (self.site / 'report/index.html').write_bytes(self.html)
        (self.root / 'private.txt').write_text('not public', encoding='utf-8')
        self.env = patch.dict('os.environ', {'QUALICRAFT_API_KEY': '', 'QUALICRAFT_API_KEY_FILE': ''})
        self.env.start()
        origin = self.root / 'origin.txt'
        self.server = create_hosted(self.root / 'runtime', origin, port=0, allow_local_test=True, site_root=self.site)
        self.base = 'http://127.0.0.1:' + str(self.server.server_port)
        origin.write_text(self.base, encoding='utf-8')
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.workspaces.close()
        self.server.server_close()
        self.thread.join(timeout=5)
        self.env.stop()
        self.temporary.cleanup()

    def request(self, path, data=None, headers=None):
        try:
            request = urllib.request.Request(self.base + path, data=data, headers=headers or {})
            response = urllib.request.urlopen(request)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            return response.status, response.read(), response.headers

    def test_public_home_and_report_do_not_require_login_but_workbench_does(self):
        self.assertEqual(self.request('/')[1], self.html)
        self.assertEqual(self.request('/QualiCraft/report/')[1], self.html)
        self.assertEqual(self.request('/w/api/bootstrap')[0], 401)
        self.assertIn(b'Continue your research', self.request('/login')[1])
        self.assertEqual(self.request('/QualiCraft/missing')[0], 404)
        self.assertEqual(self.request('/QualiCraft/', b'not a write route')[0], 405)

    def test_inline_hydration_uses_exact_hashes_without_unsafe_inline_scripts(self):
        status, body, headers = self.request('/QualiCraft/')
        self.assertEqual(status, 200)
        self.assertEqual(body, self.html)
        expected = base64.b64encode(hashlib.sha256(self.script).digest()).decode()
        csp = headers['Content-Security-Policy']
        self.assertIn("'sha256-" + expected + "'", csp)
        self.assertNotIn('unsafe-inline', csp.split('script-src')[1].split(';')[0])

    def test_head_probe_returns_metadata_without_html_or_login_body(self):
        for path in ['/QualiCraft/', '/login']:
            request = urllib.request.Request(self.base + path, method='HEAD')
            with urllib.request.urlopen(request) as response:
                self.assertEqual(response.status, 200)
                self.assertGreater(int(response.headers['Content-Length']), 0)
                self.assertEqual(response.read(), b'')

    def test_public_compression_preserves_exact_original_html_and_csp(self):
        payload = self.html + b'<p>Public QT website.</p>' * 100
        (self.site / 'index.html').write_bytes(payload)
        status, body, headers = self.request('/QualiCraft/', headers={'Accept-Encoding': 'br, gzip'})
        self.assertEqual(status, 200)
        self.assertEqual(headers['Content-Encoding'], 'gzip')
        self.assertEqual(headers['Vary'], 'Accept-Encoding')
        self.assertLess(len(body), len(payload))
        self.assertEqual(gzip.decompress(body), payload)
        expected = base64.b64encode(hashlib.sha256(self.script).digest()).decode()
        self.assertIn("'sha256-" + expected + "'", headers['Content-Security-Policy'])
        _, plain, plain_headers = self.request('/QualiCraft/', headers={'Accept-Encoding': 'gzip;q=0'})
        self.assertEqual(plain, payload)
        self.assertIsNone(plain_headers.get('Content-Encoding'))

    def test_only_hashed_next_assets_are_immutable_and_private_apis_stay_uncached(self):
        assets = self.site / '_next/static/chunks'
        assets.mkdir(parents=True)
        (assets / 'sample-abc123.js').write_text('window.qt=true;', encoding='utf-8')
        _, _, headers = self.request('/QualiCraft/_next/static/chunks/sample-abc123.js')
        self.assertIn('immutable', headers['Cache-Control'])
        _, _, html_headers = self.request('/QualiCraft/')
        self.assertEqual(html_headers['Cache-Control'], 'no-cache')
        status, _, private = self.request('/w/api/bootstrap', headers={'Accept-Encoding': 'gzip'})
        self.assertEqual(status, 401)
        self.assertEqual(private['Cache-Control'], 'no-store')
        self.assertIsNone(private.get('Content-Encoding'))

    def test_traversal_hidden_files_and_symlink_escapes_are_not_public(self):
        (self.site / 'escape.txt').symlink_to(self.root / 'private.txt')
        (self.site / 'report/index.html').unlink()
        (self.site / 'report/index.html').symlink_to(self.root / 'private.txt')
        for path in ['/QualiCraft/%2e%2e/private.txt', '/QualiCraft/.qt-pages-artifact',
                     '/QualiCraft/escape.txt', '/QualiCraft/report/']:
            with self.subTest(path=path):
                status, body, _ = self.request(path)
                self.assertEqual(status, 404)
                self.assertNotIn(b'not public', body)

    def test_test_only_artifacts_and_runtime_directories_are_refused(self):
        with self.assertRaises(ValueError):
            StaticSite(self.root / 'runtime')
        (self.site / 'qt-release.json').write_text(json.dumps({'prefix': '/QualiCraft', 'test_only': True}), encoding='utf-8')
        with self.assertRaises(ValueError):
            StaticSite(self.site)
