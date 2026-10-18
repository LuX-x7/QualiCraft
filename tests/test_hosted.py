import http.cookiejar
import json
from pathlib import Path
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from unittest.mock import patch

from qualicraft.hosted import Accounts, NoRedirect, Workspaces, create_hosted


class HostedTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.origin = self.root / 'origin.txt'
        self.env = patch.dict('os.environ', {'QUALICRAFT_API_KEY': '', 'QUALICRAFT_API_KEY_FILE': ''})
        self.env.start()
        self.start()

    def start(self):
        self.server = create_hosted(self.root / 'runtime', self.origin, port=0, allow_local_test=True)
        self.base = f'http://127.0.0.1:{self.server.server_port}'
        self.origin.write_text(self.base, encoding='utf-8')
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def stop(self):
        self.server.shutdown()
        self.server.workspaces.close()
        self.server.server_close()
        self.thread.join(timeout=5)

    def tearDown(self):
        self.stop()
        self.env.stop()
        self.temporary.cleanup()

    def client(self):
        return urllib.request.build_opener(urllib.request.ProxyHandler({}),
                                          urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()), NoRedirect())

    def request(self, opener, path, body=None, headers=None):
        request = urllib.request.Request(self.base + path,
            data=None if body is None else json.dumps(body).encode(),
            headers={'Content-Type': 'application/json', **(headers or {})})
        try:
            response = opener.open(request)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            return response.status, response.read(), response.headers

    def register(self, name):
        client = self.client()
        invitation = self.server.accounts.invite()
        status, body, headers = self.request(client, '/auth/register',
            {'username': name, 'password': 'test-only-long-password', 'invite': invitation})
        self.assertEqual(status, 200, body)
        status, body, _ = self.request(client, '/w/api/bootstrap')
        self.assertEqual(status, 200, body)
        return client, json.loads(body)

    def test_anonymous_cannot_read_bootstrap_or_mutate_and_cross_site_link_can_reach_login(self):
        client = self.client()
        self.assertEqual(self.request(client, '/w/api/bootstrap')[0], 401)
        self.assertEqual(self.request(client, '/w/api/projects', {'name': 'bad'})[0], 401)
        status, _, headers = self.request(client, '/w?lang=en', headers={
            'Sec-Fetch-Site': 'cross-site', 'Sec-Fetch-Mode': 'navigate', 'Sec-Fetch-Dest': 'document'})
        self.assertEqual(status, 303)
        self.assertEqual(headers['Location'], '/login')
        self.assertEqual(self.request(client, '/w/api/bootstrap', headers={
            'Origin': 'https://other.example', 'Sec-Fetch-Site': 'cross-site'})[0], 403)

    def test_invitation_is_single_use_passwords_hashed_and_sessions_private(self):
        client = self.client()
        invitation = self.server.accounts.invite()
        payload = {'username': 'reviewer', 'password': 'test-only-long-password', 'invite': invitation}
        status, _, headers = self.request(client, '/auth/register', payload)
        self.assertEqual(status, 200)
        self.assertEqual(headers['Referrer-Policy'], 'same-origin')
        self.assertIn('HttpOnly', headers['Set-Cookie'])
        self.assertIn('SameSite=Lax', headers['Set-Cookie'])
        self.assertEqual(self.request(self.client(), '/auth/register', {**payload, 'username': 'another'})[0], 400)
        raw = self.server.accounts.database.read_bytes()
        self.assertNotIn(payload['password'].encode(), raw)
        self.assertNotIn(invitation.encode(), raw)
        self.assertEqual(self.request(self.client(), '/auth/login', {**payload, 'password': 'wrong'})[0], 401)
        self.assertEqual(self.request(client, '/auth/logout', {})[0], 303)
        self.assertEqual(self.request(client, '/w/api/bootstrap')[0], 401)

    def test_independent_full_workspaces_do_not_share_projects_tokens_or_model_settings(self):
        a, boot_a = self.register('researcher-a')
        b, boot_b = self.register('researcher-b')
        self.assertFalse(boot_a['config']['public_demo'])
        self.assertTrue(boot_a['config']['hosted'])
        self.assertEqual(boot_a['projects'], [])
        self.assertNotEqual(boot_a['token'], boot_b['token'])
        headers_a = {'X-QualiCraft-Token': boot_a['token']}
        headers_b = {'X-QualiCraft-Token': boot_b['token']}
        status, body, _ = self.request(a, '/w/api/projects', {'kind': 'empty', 'name': 'Private A'}, headers_a)
        self.assertEqual(status, 200, body)
        project = json.loads(body)
        self.assertEqual(json.loads(self.request(b, '/w/api/projects', headers=headers_b)[1]), [])
        self.assertNotEqual(self.request(b, '/w/api/projects/' + project['id'], headers=headers_b)[0], 200)
        self.assertNotEqual(self.request(b, '/w/api/projects/' + project['id'], headers=headers_a)[0], 200)
        self.assertEqual(len(list((self.root / 'runtime/users').glob('*/qualicraft.sqlite3'))), 2)

    def test_full_bologna_frozen_report_restore_export_and_restart_persist(self):
        client, boot = self.register('bologna-review')
        headers = {'X-QualiCraft-Token': boot['token']}
        original = json.loads((Path(__file__).resolve().parents[1] / 'website/public/worked-example/project.json').read_text(encoding='utf-8'))
        status, body, _ = self.request(client, '/w/api/projects/restore', original, headers)
        self.assertEqual(status, 200, body[:200])
        saved = json.loads(body)
        self.assertEqual(saved['research_report'], original['research_report'])
        self.assertEqual(saved['documents'], original['documents'])
        self.assertEqual(saved['annotations'], original['annotations'])
        project_id = saved['id']
        status, raw, _ = self.request(client, '/w/api/projects/' + project_id + '/export?format=json', headers=headers)
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(raw)['research_report'], original['research_report'])
        # Stop every listener, then reopen the same persistent account directory.
        self.stop()
        self.start()
        # Cookies are host-only and also valid at the newly bound loopback port.
        status, raw, _ = self.request(client, '/w/api/bootstrap')
        self.assertEqual(status, 200)
        restarted = json.loads(raw)
        self.assertEqual(len(restarted['projects']), 1)
        self.assertNotEqual(restarted['token'], boot['token'])
        status, raw, _ = self.request(client, '/w/api/projects/' + project_id, headers={'X-QualiCraft-Token': restarted['token']})
        self.assertEqual(status, 200)
        self.assertEqual(json.loads(raw)['research_report'], original['research_report'])

    def test_wrong_host_and_cross_origin_writes_fail_without_creating_accounts(self):
        client = self.client()
        invite = self.server.accounts.invite()
        data = {'username': 'blocked', 'password': 'test-only-long-password', 'invite': invite}
        self.assertEqual(self.request(client, '/auth/register', data, {'Origin': 'https://foreign.example'})[0], 403)
        self.assertEqual(self.request(client, '/auth/register', data, {'Host': 'wrong.example'})[0], 403)
        with self.server.accounts.connect() as db:
            self.assertEqual(db.execute('SELECT count(*) FROM accounts').fetchone()[0], 0)
        self.assertEqual(self.request(client, '/auth/register', data)[0], 200)

    def test_shared_environment_keys_and_workspace_traversal_are_refused(self):
        with patch.dict('os.environ', {'QUALICRAFT_API_KEY_FILE': '/do-not-open/private-key-file'}):
            with self.assertRaisesRegex(ValueError, 'shared provider key'):
                create_hosted(self.root / 'refused', self.origin, port=0)
        with self.assertRaises(ValueError):
            self.server.workspaces.get('../outside')
        self.assertFalse((self.root / 'outside').exists())


if __name__ == '__main__':
    unittest.main()
