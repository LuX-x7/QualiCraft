from pathlib import Path
import json
import os
import subprocess
import sys
import tempfile
import time
import unittest
from unittest.mock import patch

if os.name == 'posix':
    from tools.hosting.qt_service import Child, child_path, commands


@unittest.skipUnless(os.name == 'posix', 'Linux/macOS supervisor; Windows remains unverified')
class QTServiceTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = (Path(self.temporary.name) / 'QT').resolve()
        (self.root / 'release/qualicraft').mkdir(parents=True)
        (self.root / 'release/qualicraft/hosted.py').touch()
        (self.root / 'venv/bin').mkdir(parents=True)
        (self.root / 'venv/bin/python').touch()
        (self.root / 'logs').mkdir()
        self.config = {'release': str(self.root / 'release'), 'origin_file': str(self.root / 'config/origin.txt'), 'port': 12345}

    def tearDown(self):
        self.temporary.cleanup()

    def test_paths_outside_qt_and_symlink_escapes_are_refused(self):
        with self.assertRaises(ValueError):
            child_path(self.root, self.root / '../other')
        (self.root / 'escape').symlink_to(self.root.parent)
        with self.assertRaises(ValueError):
            child_path(self.root, self.root / 'escape/other-project')
        with self.assertRaises(ValueError):
            commands(self.root, {**self.config, 'release': str(self.root.parent)})

    def test_workbench_command_reuses_runtime_and_scopes_all_paths(self):
        argv, cwd = commands(self.root, self.config)['workbench']
        self.assertIn(str(self.root / 'runtime'), argv)
        self.assertEqual(cwd, self.root / 'release')
        self.assertNotIn('sudo', argv)
        self.assertEqual(argv[1:3], ['-m', 'qualicraft.hosted'])

    def test_bad_ports_are_refused_and_tailscale_is_userspace_only(self):
        for port in [True, '12345', 22, 65536]:
            with self.subTest(port=port), self.assertRaises(ValueError):
                commands(self.root, {**self.config, 'port': port})
        binary = self.root / 'tailscaled'
        binary.touch()
        argv, _ = commands(self.root, {**self.config, 'tailscale': str(binary)})['tunnel']
        self.assertIn('--tun=userspace-networking', argv)
        self.assertIn('--socket=' + str(self.root / 'runtime/tailscale/tailscaled.sock'), argv)

    def test_crashed_children_back_off_and_do_not_signal_unrelated_processes(self):
        child = Child('workbench', ['test-child'], self.root, self.root, {})
        with patch('tools.hosting.qt_service.subprocess.Popen') as popen:
            popen.return_value.poll.return_value = None
            child.tick(0)
            child.tick(1)
            self.assertEqual(popen.call_count, 1)
            popen.return_value.poll.return_value = 1
            child.tick(2)
            child.tick(3)
            self.assertEqual(popen.call_count, 1)
            child.tick(4)
            self.assertEqual(popen.call_count, 2)
            popen.return_value.poll.return_value = None
            child.stop()
            popen.return_value.terminate.assert_called_once()
            popen.return_value.kill.assert_not_called()

    def test_real_supervisor_recovers_child_preserves_files_and_refuses_duplicate(self):
        (self.root / 'venv/bin/python').unlink()
        (self.root / 'venv/bin/python').symlink_to(sys.executable)
        (self.root / 'release/qualicraft/__init__.py').touch()
        fixture_source = (
            "from pathlib import Path\nimport os,time\n"
            "root=Path.cwd().parent/'runtime'\n"
            "count=root/'attempts.txt'\n"
            "n=int(count.read_text(encoding='utf-8'))+1 if count.exists() else 1\n"
            "count.write_text(str(n),encoding='utf-8')\n"
            "(root/'child.pid').write_text(str(os.getpid()),encoding='utf-8')\n"
            "if n==1: raise SystemExit(1)\n"
            "time.sleep(30)\n")
        (self.root / 'release/qualicraft/hosted.py').write_text(fixture_source, encoding='utf-8')
        (self.root / 'runtime').mkdir()
        keep = self.root / 'runtime/keep.json'
        keep.write_text('preserve existing research state', encoding='utf-8')
        (self.root / 'config').mkdir()
        config = self.root / 'config/service.json'
        config.write_text(json.dumps(self.config), encoding='utf-8')
        script = Path(__file__).resolve().parents[1] / 'tools/hosting/qt_service.py'
        command = [sys.executable, str(script), '--root', str(self.root), '--config', str(config)]
        with (self.root / 'logs/test.txt').open('wb') as output:
            process = subprocess.Popen(command, stdout=output, stderr=output)
            try:
                deadline = time.monotonic() + 10
                count = self.root / 'runtime/attempts.txt'
                while time.monotonic() < deadline:
                    if count.exists() and count.read_text(encoding='utf-8') == '2':
                        break
                    time.sleep(0.05)
                else:
                    self.fail('Crashed child was not restarted')
                duplicate = subprocess.run(command, stdout=output, stderr=output, timeout=5)
                self.assertNotEqual(duplicate.returncode, 0)
                self.assertIsNone(process.poll())
                child_pid = int((self.root / 'runtime/child.pid').read_text(encoding='utf-8'))
                self.assertEqual(keep.read_text(encoding='utf-8'), 'preserve existing research state')
            finally:
                process.terminate()
                process.wait(timeout=15)
        with self.assertRaises(ProcessLookupError):
            os.kill(child_pid, 0)
