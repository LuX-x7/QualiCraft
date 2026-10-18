"""QT-only process supervisor. This is NOT an operating-system boot hook.

Run via an approved platform startup command or user service. All persistent
files live under --root; the script never registers services or edits cron.
"""
from __future__ import annotations

import argparse
import fcntl
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import time


def child_path(root, value):
    root = Path(root).resolve()
    path = Path(value).resolve()
    if root not in path.parents:
        raise ValueError('Every managed path must remain inside QT')
    return path


def commands(root, configuration):
    root = Path(root).resolve()
    release = child_path(root, configuration['release'])
    origin = child_path(root, configuration['origin_file'])
    python = root / 'venv/bin/python'
    if not python.is_file() or not (release / 'qualicraft/hosted.py').is_file():
        raise ValueError('QT Python environment or source release is unavailable')
    port = configuration['port']
    if isinstance(port, bool) or not isinstance(port, int) or not 1024 <= port <= 65535:
        raise ValueError('Use one unprivileged loopback port')
    app = [str(python), '-m', 'qualicraft.hosted', 'serve', '--root', str(root / 'runtime'),
           '--origin-file', str(origin), '--port', str(port)]
    if configuration.get('site_root'):
        app += ['--site-root', str(child_path(root, configuration['site_root']))]
    children = {'workbench': (app, release)}
    if configuration.get('tailscale'):
        # Dedicated userspace instance: no system interface, routing changes,
        # existing daemon socket, SSH feature, exit node or subnet advertisement.
        daemon = child_path(root, configuration['tailscale'])
        if not daemon.is_file():
            raise ValueError('QT-scoped tailscaled binary is unavailable')
        state = root / 'runtime/tailscale'
        state.mkdir(mode=0o700, parents=True, exist_ok=True)
        children['tunnel'] = ([str(daemon), '--tun=userspace-networking', '--port=0',
                              '--statedir=' + str(state), '--socket=' + str(state / 'tailscaled.sock')], root)
    return children


class Child:
    def __init__(self, name, command, cwd, root, environment):
        self.name, self.command, self.cwd = name, command, cwd
        self.root, self.environment = root, environment
        self.process = None
        self.next_start, self.failures, self.started = 0, 0, 0

    def tick(self, now):
        if self.process is not None:
            if self.process.poll() is None:
                return
            duration = now - self.started
            self.failures = 1 if duration >= 60 else self.failures + 1
            self.next_start = now + min(60, 2 ** min(self.failures, 6))
            self.process = None
            return
        if now < self.next_start:
            return
        log = self.root / 'logs' / (self.name + '-supervised.txt')
        if log.exists() and log.stat().st_size > 10_000_000:
            log.replace(log.with_suffix('.previous.txt'))
        with log.open('ab') as output:
            self.process = subprocess.Popen(self.command, cwd=self.cwd, env=self.environment,
                                            stdin=subprocess.DEVNULL, stdout=output,
                                            stderr=output, start_new_session=True)
        self.started = now

    def stop(self):
        # Signal only a child Popen object created by this supervisor. Never use
        # an arbitrary PID read from an old file or kill a conflicting listener.
        if self.process is not None and self.process.poll() is None:
            self.process.terminate()
            try:
                self.process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                self.process.kill()
                self.process.wait(timeout=5)


def run(root, configuration):
    root = Path(root).resolve()
    if root.name != 'QT':
        raise ValueError('The dedicated installation directory must be named QT')
    os.umask(0o077)
    for name in ['logs', 'config', 'runtime', 'cache/mpl', 'tmp']:
        child_path(root, root / name).mkdir(parents=True, exist_ok=True, mode=0o700)
    with (root / 'runtime/supervisor.lock').open('a', encoding='utf-8') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise ValueError('QT supervisor is already running') from None
        plan = commands(root, configuration)
        environment = dict(os.environ)
        for key in ['QUALICRAFT_API_KEY', 'QUALICRAFT_API_KEY_FILE']:
            environment.pop(key, None)
        environment.update(MPLCONFIGDIR=str(root / 'cache/mpl'), TMPDIR=str(root / 'tmp'),
                           PYTHONDONTWRITEBYTECODE='1', PYTHONNOUSERSITE='1')
        children = [Child(name, command, cwd, root, environment) for name, (command, cwd) in plan.items()]
        stopping = False

        def stop(_signum, _frame):
            nonlocal stopping
            stopping = True

        for signum in [signal.SIGTERM, signal.SIGINT]:
            signal.signal(signum, stop)
        print('QT supervisor started. OS boot registration is separate.', flush=True)
        try:
            while not stopping:
                for child in children:
                    child.tick(time.monotonic())
                time.sleep(0.5)
        finally:
            for child in reversed(children):
                child.stop()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', required=True)
    parser.add_argument('--config', required=True)
    args = parser.parse_args()
    root = Path(args.root).resolve()
    config = child_path(root, args.config)
    run(root, json.loads(config.read_text(encoding='utf-8')))


if __name__ == '__main__':
    main()
