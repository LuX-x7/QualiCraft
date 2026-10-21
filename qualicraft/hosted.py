"""Authenticated hosting boundary for the unchanged full local workbench.

Each invited account gets its own Store, Analyzer, loopback workbench and
snapshot directory. Nothing is stored in the public website or source tree.
"""
from __future__ import annotations

import argparse
import base64
from contextlib import contextmanager
import hashlib
import hmac
import gzip
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import mimetypes
import os
from pathlib import Path
import re
import secrets
import sqlite3
import threading
import time
import urllib.error
import urllib.parse
import urllib.request

from .server import create_server

MAX_BODY = 20_000_000
SESSION_SECONDS = 12 * 3600
NAME = re.compile(r'[a-zA-Z0-9][a-zA-Z0-9_.-]{2,47}\Z')
AUTH_HTML = '''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>QT · Sign in</title>
<style>*{box-sizing:border-box}body{margin:0;background:#faf8f4;color:#1f2836;font:17px/1.5 system-ui,sans-serif;background-image:linear-gradient(#4b607c0c 1px,transparent 1px),linear-gradient(90deg,#4b607c0c 1px,transparent 1px);background-size:24px 24px}main{max-width:520px;margin:7vh auto;padding:28px}h1{font:normal 38px/1.1 Georgia,serif}label{display:block;margin:18px 0 6px}input,button{font:inherit;padding:12px;border:1px solid #4b607c;min-height:44px;width:100%}button{margin-top:22px;background:#1f2836;color:white;cursor:pointer}input{background:white}input:focus-visible,button:focus-visible{outline:3px solid #ad6743;outline-offset:3px}small{display:block;color:#4b607c}#auth-status{min-height:26px}summary{cursor:pointer;padding:16px 0}details{margin-top:20px}details button{background:#4b607c}[hidden]{display:none!important}@media(max-width:560px){main{margin:2vh auto;padding:24px}}</style>
<script src="/auth.js" defer></script></head><body><main><small>QT / YOUR RESEARCH WORKSPACE</small>
<h1>Continue your research.</h1><p>Upload, code, save and export in your browser. Your projects are saved privately on this QT server.</p>
<form data-auth="login"><label for="login-name">Username</label><input id="login-name" name="username" autocomplete="username" required maxlength="48"><label for="login-password">Password</label><input id="login-password" name="password" type="password" autocomplete="current-password" required maxlength="256"><button>Sign in →</button></form>
<p id="auth-status" role="status" aria-live="polite"></p>
<details><summary>First visit? Create your invited account</summary><form data-auth="register"><label for="register-invite">Invitation code</label><input id="register-invite" name="invite" autocomplete="off" required><label for="register-name">Choose a username</label><input id="register-name" name="username" autocomplete="username" required minlength="3" maxlength="48" pattern="[a-zA-Z0-9][a-zA-Z0-9_.\\-]{2,47}"><small>3–48 letters, numbers, dots, underscores or hyphens.</small><label for="register-password">Choose a password</label><input id="register-password" name="password" type="password" autocomplete="new-password" required minlength="6" maxlength="256"><small>At least 6 characters. Keep your password private.</small><button>Create account →</button></form></details>
<p><small>All workbench features are available. AI requests still require your model configuration and explicit confirmation.</small></p></main></body></html>'''


def digest(value):
    return hashlib.sha256(value.encode('utf-8')).hexdigest()


def accepts_gzip(header):
    for entry in header.lower().split(','):
        coding, *parameters = entry.strip().split(';')
        if coding.strip() == 'gzip':
            quality = next((part.split('=', 1)[1].strip() for part in parameters
                            if part.strip().startswith('q=')), '1')
            try:
                return 0 < float(quality) <= 1
            except ValueError:
                return False
    return False


class Accounts:
    def __init__(self, root):
        self.root = Path(root).resolve()
        self.root.mkdir(parents=True, exist_ok=True, mode=0o700)
        self.database = self.root / 'accounts.sqlite3'
        with self.connect() as db:
            db.executescript('''CREATE TABLE IF NOT EXISTS accounts
                (id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, salt BLOB NOT NULL, password BLOB NOT NULL);
                CREATE TABLE IF NOT EXISTS invitations (hash TEXT PRIMARY KEY, expires REAL NOT NULL, used INTEGER NOT NULL DEFAULT 0);
                CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, account TEXT NOT NULL, expires REAL NOT NULL);''')
        self.database.chmod(0o600)

    @contextmanager
    def connect(self):
        db = sqlite3.connect(self.database, timeout=20)
        try:
            with db:
                yield db
        finally:
            db.close()

    def invite(self):
        value = secrets.token_urlsafe(24)
        with self.connect() as db:
            db.execute('INSERT INTO invitations(hash,expires) VALUES (?,?)', (digest(value), time.time() + 7 * 86400))
        return value

    def register(self, name, password, invite):
        if not isinstance(name, str) or not NAME.fullmatch(name) or not isinstance(password, str) or not 6 <= len(password) <= 256:
            raise ValueError('Choose a valid username and a password of at least 6 characters.')
        if not isinstance(invite, str) or len(invite) > 200:
            raise ValueError('The invitation is unavailable or has expired.')
        account = secrets.token_hex(16)
        with self.connect() as db:
            db.execute('BEGIN IMMEDIATE')
            invitation = db.execute('SELECT used,expires FROM invitations WHERE hash=?', (digest(invite),)).fetchone()
            if not invitation or invitation[0] or invitation[1] < time.time():
                raise ValueError('The invitation is unavailable or has expired.')
            salt = secrets.token_bytes(16)
            hashed = hashlib.scrypt(password.encode('utf-8'), salt=salt, n=16384, r=8, p=1)
            try:
                db.execute('INSERT INTO accounts VALUES (?,?,?,?)', (account, name.lower(), salt, hashed))
            except sqlite3.IntegrityError:
                raise ValueError('This username is unavailable.') from None
            db.execute('UPDATE invitations SET used=1 WHERE hash=?', (digest(invite),))
        return account

    def login(self, name, password):
        if not isinstance(name, str) or not isinstance(password, str) or len(name) > 48 or len(password) > 256:
            return None
        with self.connect() as db:
            row = db.execute('SELECT id,salt,password FROM accounts WHERE name=?', (name.lower(),)).fetchone()
        salt, expected = (row[1], row[2]) if row else (b'qt-unknown-user!', b'0' * 64)
        actual = hashlib.scrypt(password.encode('utf-8'), salt=salt, n=16384, r=8, p=1)
        return row[0] if row and hmac.compare_digest(actual, expected) else None

    def session(self, account):
        value = secrets.token_urlsafe(32)
        with self.connect() as db:
            db.execute('DELETE FROM sessions WHERE expires < ?', (time.time(),))
            db.execute('INSERT INTO sessions VALUES (?,?,?)', (digest(value), account, time.time() + SESSION_SECONDS))
        return value

    def identify(self, value):
        if not value or len(value) > 100:
            return None
        with self.connect() as db:
            row = db.execute('SELECT a.id,a.name FROM sessions s JOIN accounts a ON a.id=s.account WHERE s.hash=? AND s.expires>?', (digest(value), time.time())).fetchone()
        return row

    def logout(self, value):
        with self.connect() as db:
            db.execute('DELETE FROM sessions WHERE hash=?', (digest(value),))


class Workspaces:
    def __init__(self, root):
        self.root = Path(root).resolve()
        self.root.mkdir(parents=True, exist_ok=True, mode=0o700)
        self.items = {}
        self.lock = threading.RLock()

    def get(self, account):
        if not re.fullmatch(r'[0-9a-f]{32}', account):
            raise ValueError('Invalid workspace identity')
        with self.lock:
            if account not in self.items:
                home = self.root / account
                if home.is_symlink():
                    raise ValueError('Workspace must not be a symlink')
                home.mkdir(mode=0o700, exist_ok=True)
                server = create_server(home, home / 'no-external-guide', port=0, base_path='/w',
                                       host='127.0.0.1', public_demo=False, backup_dir=home / 'backups')
                thread = threading.Thread(target=server.serve_forever, daemon=True)
                thread.start()
                self.items[account] = (server, thread)
            return self.items[account][0]

    def close(self):
        with self.lock:
            for server, thread in self.items.values():
                server.shutdown()
                server.server_close()
                thread.join(timeout=5)
            self.items.clear()


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


class StaticSite:
    """Serve only a verified export directory, never the hosting runtime."""
    def __init__(self, root):
        self.root = Path(root).resolve()
        if not (self.root / '.qt-pages-artifact').is_file():
            raise ValueError('Use a QT static export artifact')
        metadata = json.loads((self.root / 'qt-release.json').read_text(encoding='utf-8'))
        self.prefix = metadata['prefix']
        if (metadata.get('test_only') or not re.fullmatch(r'/[A-Za-z0-9_-]+', self.prefix)
                or not (self.root / 'index.html').is_file()):
            raise ValueError('Use a deployable static export')

    def response(self, path):
        path = urllib.parse.unquote(path)
        if not path.startswith(self.prefix + '/'):
            return None
        relative = Path(path[len(self.prefix) + 1:])
        if any(part.startswith('.') for part in relative.parts):
            return None
        file = (self.root / relative).resolve()
        if file.is_dir():
            file = (file / 'index.html').resolve()
        if self.root not in file.parents or not file.is_file():
            return None
        payload = file.read_bytes()
        mime = mimetypes.guess_type(file.name)[0] or 'application/octet-stream'
        csp = None
        if mime == 'text/html':
            # Next static exports contain inline hydration scripts. Permit only
            # their exact hashes, rather than allowing arbitrary inline JS.
            scripts = re.findall(rb'<script\b[^>]*>(.*?)</script\s*>', payload, re.I | re.S)
            hashes = sorted({"'sha256-" + base64.b64encode(hashlib.sha256(script).digest()).decode() + "'"
                             for script in scripts if script.strip()})
            csp = ("default-src 'self'; script-src 'self' " + ' '.join(hashes) +
                   "; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; "
                   "font-src 'self'; media-src 'self'; connect-src 'self'; "
                   "frame-ancestors 'none'; base-uri 'none'; form-action 'self'")
        return payload, mime, csp


def create_hosted(root, origin_file, *, port=8789, allow_local_test=False, site_root=None):
    # A hosted process must never inherit an operator's global provider key or
    # read an unrelated API-key file from outside the dedicated QT directory.
    if os.getenv('QUALICRAFT_API_KEY') or os.getenv('QUALICRAFT_API_KEY_FILE'):
        raise ValueError('Do not supply a shared provider key to the hosted process')
    root = Path(root).resolve()
    accounts = Accounts(root / 'accounts')
    workspaces = Workspaces(root / 'users')
    failure_lock = threading.Lock()
    failures = []
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect())
    site = StaticSite(site_root) if site_root else None
    auth_js = Path(__file__).resolve().parent.parent / 'web/hosted-auth.js'

    class Handler(BaseHTTPRequestHandler):
        server_version = 'QT'

        def log_message(self, *_args):
            pass

        def send(self, payload, *, status=200, content_type='application/json', headers=(), csp=None, cache_control='no-store'):
            if not isinstance(payload, bytes):
                payload = json.dumps(payload).encode('utf-8')
            self.send_response(status)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(payload)))
            self.send_header('Cache-Control', cache_control)
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.send_header('Referrer-Policy', 'same-origin')
            self.send_header('Content-Security-Policy', csp or "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'")
            for key, value in headers:
                if key.lower() not in {'content-type', 'content-length', 'connection', 'transfer-encoding', 'cache-control', 'server', 'date', 'content-security-policy', 'referrer-policy'}:
                    self.send_header(key, value)
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(payload)

        def redirect(self, target, cookie=None):
            headers = [('Location', target)]
            if cookie:
                headers.append(('Set-Cookie', cookie))
            self.send(b'', status=303, headers=headers)

        def session_value(self):
            try:
                cookie = SimpleCookie(self.headers.get('Cookie', ''))
                return cookie['qt_session'].value if 'qt_session' in cookie else ''
            except Exception:
                return ''

        def cookie(self, value, age=SESSION_SECONDS):
            return f'qt_session={value}; Path=/; HttpOnly; SameSite=Lax; Max-Age={age}' + ('' if allow_local_test else '; Secure')

        def valid_request(self):
            try:
                origin = Path(origin_file).read_text(encoding='utf-8').strip().rstrip('/')
                parsed = urllib.parse.urlsplit(origin)
                valid_scheme = parsed.scheme == 'https' or (allow_local_test and parsed.scheme == 'http' and parsed.hostname in {'127.0.0.1', 'localhost'})
                navigation = (self.command == 'GET' and
                              self.headers.get('Sec-Fetch-Mode') == 'navigate' and
                              self.headers.get('Sec-Fetch-Dest') == 'document')
                return (valid_scheme and bool(parsed.netloc) and not parsed.path and
                        not parsed.username and not parsed.password and not parsed.query and not parsed.fragment and
                        self.headers.get('Host', '').lower() == parsed.netloc.lower() and
                        self.headers.get('Origin', origin).rstrip('/') == origin and
                        (self.headers.get('Sec-Fetch-Site') != 'cross-site' or navigation))
            except OSError:
                return False

        def handle_request(self):
            path = urllib.parse.urlsplit(self.path).path
            if path == '/health' and self.command in {'GET', 'HEAD'}:
                return self.send({'service': 'QT', 'ready': True})
            if not self.valid_request():
                return self.send({'error': 'This request origin is not allowed.'}, status=403)
            length = self.headers.get('Content-Length', '0')
            if self.headers.get('Transfer-Encoding') or not length.isdigit() or int(length) > MAX_BODY:
                return self.send({'error': 'Request exceeds the supported size.'}, status=413)
            body = self.rfile.read(int(length))
            if site and (path in {'/', site.prefix} or path.startswith(site.prefix + '/')):
                if self.command not in {'GET', 'HEAD'}:
                    return self.send({'error': 'Method not allowed'}, status=405)
                if path in {'/', site.prefix}:
                    return self.redirect(site.prefix + '/')
                asset = site.response(path)
                if asset is None:
                    return self.send({'error': 'Not found'}, status=404)
                payload, mime, csp = asset
                headers = [('Vary', 'Accept-Encoding')]
                # Compression is limited to public static assets. Credentials,
                # project APIs and private exports keep the unchanged route.
                text = mime.startswith('text/') or mime in {'application/javascript', 'application/json', 'image/svg+xml'}
                if text and len(payload) > 1024 and accepts_gzip(self.headers.get('Accept-Encoding', '')):
                    payload = gzip.compress(payload, compresslevel=5, mtime=0)
                    headers.append(('Content-Encoding', 'gzip'))
                immutable = path.startswith(site.prefix + '/_next/static/')
                cache = 'public, max-age=31536000, immutable' if immutable else 'no-cache'
                return self.send(payload, content_type=mime, csp=csp, headers=headers, cache_control=cache)
            if path in {'/', '/login'} and self.command in {'GET', 'HEAD'}:
                return self.send(AUTH_HTML.encode(), content_type='text/html; charset=utf-8')
            if path == '/auth.js' and self.command in {'GET', 'HEAD'}:
                return self.send(auth_js.read_bytes(), content_type='application/javascript; charset=utf-8')
            if path in {'/auth/login', '/auth/register'} and self.command == 'POST':
                if self.headers.get('Content-Type', '').split(';')[0] != 'application/json' or len(body) > 4096:
                    return self.send({'error': 'Use the sign-in form.'}, status=400)
                with failure_lock:
                    failures[:] = [stamp for stamp in failures if stamp > time.time() - 60]
                    if len(failures) >= 20:
                        return self.send({'error': 'Too many attempts. Wait a minute and try again.'}, status=429)
                    failures.append(time.time())
                data = json.loads(body)
                if not isinstance(data, dict):
                    raise ValueError('Use the sign-in form.')
                if path == '/auth/register':
                    account = accounts.register(data.get('username'), data.get('password'), data.get('invite'))
                else:
                    account = accounts.login(data.get('username'), data.get('password'))
                if not account:
                    return self.send({'error': 'The username or password is incorrect.'}, status=401)
                accounts.logout(self.session_value())
                return self.send({'ok': True}, headers=[('Set-Cookie', self.cookie(accounts.session(account)))])
            identity = accounts.identify(self.session_value())
            if not identity:
                if path.startswith('/w/api/') or self.command != 'GET':
                    return self.send({'error': 'Sign in to continue.'}, status=401)
                return self.redirect('/login')
            if path == '/auth/logout' and self.command == 'POST':
                accounts.logout(self.session_value())
                return self.redirect('/login', self.cookie('', age=0))
            if not (path == '/w' or path.startswith('/w/')):
                return self.send({'error': 'Not found'}, status=404)
            server = workspaces.get(identity[0])
            target = f'http://127.0.0.1:{server.server_port}' + self.path
            headers = {k: v for k, v in self.headers.items() if k.lower() not in {
                'host', 'origin', 'referer', 'cookie', 'connection', 'content-length', 'accept-encoding',
                'sec-fetch-site', 'sec-fetch-mode', 'sec-fetch-dest', 'sec-fetch-user',
            }}
            request = urllib.request.Request(target, data=body if self.command not in {'GET', 'HEAD'} else None,
                                             headers=headers, method=self.command)
            try:
                upstream = opener.open(request, timeout=300)
            except urllib.error.HTTPError as error:
                upstream = error
            with upstream:
                payload = upstream.read()
                if path == '/w/api/bootstrap' and upstream.status == 200:
                    value = json.loads(payload)
                    value['config'].update(hosted=True, account=identity[1])
                    payload = json.dumps(value, ensure_ascii=False).encode('utf-8')
                elif path == '/w/config.js' and upstream.status == 200:
                    payload = b'window.QT_HOSTED=true;' + payload
                response_headers = list(upstream.headers.items())
                content_type = upstream.headers.get('Content-Type', 'application/octet-stream')
                # Compress only authenticated project JSON, never auth/bootstrap
                # tokens. Keep private no-store semantics and exact decoded bytes.
                if (upstream.status == 200 and path.startswith('/w/api/projects/') and
                        content_type.startswith('application/json')):
                    response_headers.append(('Vary', 'Accept-Encoding'))
                    if len(payload) > 1024 and accepts_gzip(self.headers.get('Accept-Encoding', '')):
                        payload = gzip.compress(payload, compresslevel=5, mtime=0)
                        response_headers.append(('Content-Encoding', 'gzip'))
                self.send(payload, status=upstream.status, content_type=content_type,
                          headers=response_headers)

        def safe_handle(self):
            try:
                self.handle_request()
            except (ValueError, TypeError, KeyError):
                self.send({'error': 'The request is invalid.'}, status=400)
            except (BrokenPipeError, ConnectionResetError):
                pass
            except Exception:
                self.send({'error': 'The workspace request could not complete. Please retry.'}, status=503)

        do_GET = do_HEAD = do_POST = do_PUT = do_PATCH = do_DELETE = safe_handle

    server = ThreadingHTTPServer(('127.0.0.1', port), Handler)
    server.daemon_threads = True
    server.accounts, server.workspaces = accounts, workspaces
    return server


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('operation', choices=['serve', 'invite'])
    parser.add_argument('--root', required=True)
    parser.add_argument('--origin-file')
    parser.add_argument('--site-root', help='Optional verified static export; never the runtime directory')
    parser.add_argument('--port', type=int, default=8789)
    parser.add_argument('--out')
    parser.add_argument('--count', type=int, default=2)
    args = parser.parse_args()
    root = Path(args.root).resolve()
    root.mkdir(parents=True, exist_ok=True, mode=0o700)
    if args.operation == 'invite':
        if not args.out or not 1 <= args.count <= 20:
            parser.error('Choose a private output file and 1–20 invitations')
        target = Path(args.out).resolve()
        if root not in target.parents or target.exists():
            parser.error('Invitations need a new file inside the QT runtime directory')
        accounts = Accounts(root / 'accounts')
        fd = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, 'w', encoding='utf-8') as stream:
            json.dump({'invitation_codes': [accounts.invite() for _ in range(args.count)]}, stream, indent=2)
        print('Invitation file created. Its contents are private; do not commit them.')
        return
    if not args.origin_file:
        parser.error('--origin-file is required')
    server = create_hosted(root, args.origin_file, port=args.port, site_root=args.site_root)
    print(f'QT private workspaces listening on 127.0.0.1:{server.server_port}', flush=True)
    try:
        server.serve_forever()
    finally:
        server.workspaces.close()
        server.server_close()


if __name__ == '__main__':
    main()
