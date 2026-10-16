"""Exercise real Next startup diagnostics using only loopback and Bologna copies.

Keeps normal and intentionally faulty HTTP/console records separate. Never
attaches to existing tabs. The delayed backend is a real disposable workbench;
other fault cases are explicit local protocol fixtures, with no interview data.
"""
import argparse
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
import shutil
import signal
import socket
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect


def free_port():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        return sock.getsockname()[1]


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--backend', required=True)
    ap.add_argument('--node', required=True)
    ap.add_argument('--out', type=Path, required=True)
    args = ap.parse_args()
    parsed = urlsplit(args.backend)
    assert parsed.hostname in ('127.0.0.1', 'localhost') and parsed.scheme == 'http'
    backend = args.backend.rstrip('/')
    repo = Path(__file__).resolve().parents[2]; root = args.out.resolve()
    root.mkdir(parents=True, exist_ok=True)
    for name in ['raw', 'screenshots', 'delayed-data']: (root/name).mkdir(exist_ok=True)
    source = repo/'demo-data/qualicraft.sqlite3'
    digest = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
    source_hash = digest(source)
    delayed_db = root/'delayed-data/qualicraft.sqlite3'; shutil.copyfile(source, delayed_db)
    with urllib.request.urlopen(backend+'/w/api/bootstrap', timeout=10) as r: boot = json.load(r)
    assert len(boot['projects']) == 1 and not boot['config']['has_key']
    token = boot['token']; results = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='chrome', headless=True)
        for name in ['ready', 'delayed', 'http503', 'refused', 'timeout', 'http404', 'redirect', 'wrong200', 'invalid-json']:
            start = time.monotonic(); front = None; fixture = None; delayed = []; timer = None
            requests = []; origin = f'http://127.0.0.1:{free_port()}'
            target = backend if name == 'ready' else f'http://127.0.0.1:{free_port()}'
            fixture_port = urlsplit(target).port
            log_path = root/'raw'/f'start-{name}.txt'
            stop_waiting = threading.Event()
            ctx = None
            try:
                if name not in ('ready', 'delayed', 'refused'):
                    class Handler(BaseHTTPRequestHandler):
                        def log_message(self, *args): pass
                        def do_GET(self):
                            requests.append({'method': 'GET', 'path': self.path, 'ms': round((time.monotonic()-start)*1000)})
                            if name == 'timeout':
                                stop_waiting.wait(30); return
                            status = {'http503': 503, 'http404': 404, 'redirect': 302}.get(name, 200)
                            payload = b'<html>Intentional invalid bootstrap fixture</html>' if name == 'invalid-json' else json.dumps({'ok': True, 'service': 'qualicraft-website'} if name == 'wrong200' else {'error': 'Intentional '+name+' acceptance fixture'}).encode()
                            self.send_response(status)
                            self.send_header('Content-Type', 'text/html' if name == 'invalid-json' else 'application/json')
                            if name == 'redirect': self.send_header('Location', '/unexpected-redirect-target')
                            self.send_header('Content-Length', str(len(payload))); self.end_headers()
                            self.wfile.write(payload)
                    fixture = ThreadingHTTPServer(('127.0.0.1', fixture_port), Handler)
                    fixture.daemon_threads = True
                    threading.Thread(target=fixture.serve_forever, daemon=True).start()
                if name == 'delayed':
                    def start_delayed():
                        code = ('import os,sys; from pathlib import Path; '
                                'sys.path.insert(0,sys.argv[1]); '
                                'from qualicraft.server import create_server; '
                                'create_server(sys.argv[2],sys.argv[3],port=int(sys.argv[4]),host="127.0.0.1",base_path="/w",backup_dir=sys.argv[5]).serve_forever()')
                        env = {k: v for k, v in os.environ.items() if k not in ('QUALICRAFT_API_KEY', 'QUALICRAFT_API_KEY_FILE')}
                        env['QUALICRAFT_API_BASE'] = 'http://127.0.0.1:1'
                        log = (root/'raw/delayed-backend.txt').open('w')
                        delayed.append(subprocess.Popen([sys.executable, '-c', code, str(repo), str(root/'delayed-data'), str(root/'no-guide'), str(fixture_port), str(root/'delayed-backups')], cwd=repo, env=env, stdout=log, stderr=subprocess.STDOUT, start_new_session=True))
                    timer = threading.Timer(1.4, start_delayed); timer.start()
                env = {**os.environ, 'PORT': str(urlsplit(origin).port), 'HOST': '127.0.0.1', 'QT_WORKBENCH_URL': target}
                log = log_path.open('w')
                front = subprocess.Popen([args.node, 'start.js'], cwd=repo/'website', env=env, stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
                frontend_ready_ms = None
                deadline = time.monotonic()+24
                while time.monotonic() < deadline:
                    if frontend_ready_ms is None:
                        try:
                            with urllib.request.urlopen(origin+'/api/health', timeout=.4) as r: health = json.load(r)
                            assert health['service'] == 'qualicraft-website'
                            frontend_ready_ms = round((time.monotonic()-start)*1000)
                        except (urllib.error.URLError, TimeoutError): pass
                    text = log_path.read_text(encoding='utf8')
                    if re.search(r'health\s+(ready|failed)', text) and frontend_ready_ms is not None: break
                    if front.poll() is not None: raise RuntimeError('Next startup exited: '+text)
                    time.sleep(.08)
                else: raise AssertionError('Startup diagnostic exceeded its bound: '+text)
                elapsed_ms = round((time.monotonic()-start)*1000)
                expected = name in ('ready', 'delayed')
                assert bool(re.search(r'health\s+ready', text)) == expected, text
                assert bool(re.search(r'health\s+failed', text)) != expected, text
                assert token not in text and 'Bologna' not in text, 'Bootstrap payload leaked into logs'
                assert '/w/api/bootstrap' in text and '/api/health' not in text, text
                if name == 'ready': assert 'waiting (' not in text and 'attempt 1/3' in text
                elif name == 'delayed':
                    assert 'waiting (' in text and frontend_ready_ms < 1400 and 'attempt 3/3' in text, text
                else:
                    assert len(re.findall(r'health\s+waiting', text)) == 2
                    assert 'failed after 3 attempts' in text and 'QT_WORKBENCH_URL' in text
                    detail = {'http503': 'HTTP 503', 'refused': 'unreachable', 'timeout': 'timed out (5000ms)', 'http404': 'HTTP 404', 'redirect': 'HTTP 302', 'wrong200': 'unexpected bootstrap response', 'invalid-json': 'invalid bootstrap JSON'}[name]
                    assert detail in text
                if name == 'timeout': assert 15000 <= elapsed_ms < 23000 and frontend_ready_ms < 5000
                if fixture: assert len(requests) == 3 and all(r['path'] == '/w/api/bootstrap' for r in requests)
                console = []; http = []; expected_faults = []
                ctx = browser.new_context(viewport={'width': 1440, 'height': 1000})
                ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith(origin+'/') else r.abort())
                page = ctx.new_page()
                page.on('pageerror', lambda e: console.append(str(e)))
                page.on('console', lambda m: console.append(m.text) if m.type == 'error' else None)
                page.on('response', lambda r: http.append([r.status, r.url]) if r.status >= 400 else None)
                response = page.goto(origin+'/', wait_until='networkidle'); assert response.status == 200
                assert not console and not http, [console, http]
                if expected:
                    response = page.goto(origin+'/w?lang=en', wait_until='networkidle'); assert response.status == 200
                    page.locator('#start-project-select').select_option('a71a0b538c024c3ab23fb4286cfe93e2')
                    page.locator('[data-action="start-open"]').click(); expect(page.locator('#reading-document')).to_be_visible()
                    page.screenshot(path=str(root/'screenshots'/f'{name}-workbench.png'))
                    assert not console and not http, [console, http]
                elif name == 'http503':
                    response = page.goto(origin+'/w/api/bootstrap', wait_until='networkidle'); assert response.status == 503
                    expected_faults = {'console': list(console), 'http': list(http)}
                    page.screenshot(path=str(root/'screenshots/http503-proxy-response.png'))
                results.append({'case': name, 'pass': True, 'origin': origin, 'backend': target, 'frontend_liveness_ms': frontend_ready_ms, 'diagnostic_ms': elapsed_ms, 'diagnostic': [line for line in text.splitlines() if 'health' in line], 'fixture_requests_before_browser': list(requests[:3]), 'normal_console': [] if name == 'http503' else console, 'normal_http': [] if name == 'http503' else http, 'expected_fault_browser': expected_faults, 'log': str(log_path.relative_to(root))})
                print('PASS', name, 'frontend ready', frontend_ready_ms, 'ms; diagnostic', elapsed_ms, 'ms', flush=True)
            finally:
                if ctx: ctx.close()
                if front and front.poll() is None:
                    os.killpg(front.pid, signal.SIGTERM); front.wait(timeout=10)
                if timer: timer.cancel(); timer.join()
                for process in delayed:
                    if process.poll() is None: os.killpg(process.pid, signal.SIGTERM); process.wait(timeout=10)
                stop_waiting.set()
                if fixture: fixture.shutdown(); fixture.server_close()
                (root/'results.json').write_text(json.dumps({'results': results, 'source_sha256': source_hash, 'no_existing_windows_read': True, 'physical_device': False}, indent=2), encoding='utf8')
        browser.close()
    assert digest(source) == source_hash and digest(delayed_db) == source_hash
    print('PASS 9/9 real Next startup cases; genuine faults retained; normal console/HTTP clean; source/delayed Bologna database bytes unchanged')


if __name__ == '__main__': main()
