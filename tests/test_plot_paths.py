"""Output names are data, never paths, in the host and standalone recipe."""
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from qualicraft import plotting
from qualicraft.core import add_code, add_document, annotate, new_project


BAD_NAMES = ('/tmp/escape', 'C:\\escape', 'C:escape', '\\\\host\\share',
             '../escape', 'a/b', 'a\\b', '.', '..', 'CON', 'nul.txt', 'COM1',
             'LPT9.data', 'ends.', 'ends ', 'a\nname', 'a\x00name', 'a\x85name',
             'a' * 81)


def sample():
    project = new_project('Path regression')
    doc = add_document(project, 'I1', 'abcd')
    code = add_code(project, 'Code')
    annotate(project, doc['id'], code['id'], 0, 4)
    return project


class PlotPathTests(unittest.TestCase):
    def test_invalid_names_fail_before_subprocess_or_artifact_writes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / 'plot'
            root.mkdir()
            sentinel = Path(tmp) / 'sentinel.svg'
            sentinel.write_bytes(b'unchanged')
            for name in (*BAD_NAMES, str(sentinel.with_suffix(''))):
                with self.subTest(name=name), patch('qualicraft.plotting.subprocess.run') as run:
                    with self.assertRaises(ValueError):
                        plotting._prepare(sample(), {'name': name}, root)
                    run.assert_not_called()
                    self.assertEqual(list(root.iterdir()), [])
                    self.assertEqual(sentinel.read_bytes(), b'unchanged')

    def test_existing_output_symlink_cannot_escape_before_process(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / 'plot'
            root.mkdir()
            sentinel = Path(tmp) / 'sentinel'
            sentinel.write_bytes(b'unchanged')
            (root / 'safe.svg').symlink_to(sentinel)
            with patch('qualicraft.plotting.subprocess.run') as run:
                with self.assertRaises(ValueError):
                    plotting._prepare(sample(), {'name': 'safe'}, root)
                run.assert_not_called()
            self.assertEqual(sentinel.read_bytes(), b'unchanged')
            self.assertEqual({p.name for p in root.iterdir()}, {'safe.svg'})

    def test_name_defaults_and_unicode_are_preserved(self):
        for options in ({}, {'name': ''}, {'name': None}):
            self.assertEqual(plotting.normalise(options)['name'], 'figure_frequency')
        for name in ('图表 α', 'a' * 80, 'figure.v2'):
            self.assertEqual(plotting.normalise({'name': name})['name'], name)

    @unittest.skipUnless(plotting.availability()['available'], 'matplotlib unavailable')
    def test_valid_preview_bundle_and_standalone_recipe(self):
        options = {'name': '图表 α', 'dpi': 72}
        svg, _ = plotting.render(sample(), options)
        self.assertIn('<svg', svg)
        files, _ = plotting.bundle(sample(), options)
        self.assertEqual(set(files), {'figure.py', 'figure_data.csv', '图表 α.png', '图表 α.svg', '图表 α.pdf'})
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for name in ('figure.py', 'figure_data.csv'):
                (root / name).write_bytes(files[name])
            result = subprocess.run([sys.executable, str(root / 'figure.py')], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            for ext in plotting.FIGURE_EXTENSIONS:
                self.assertTrue((root / ('图表 α.' + ext)).is_file())

    @unittest.skipUnless(plotting.availability()['available'], 'matplotlib unavailable')
    def test_standalone_recipe_rejects_edited_name_and_output_symlink(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp) / 'plot'
            root.mkdir()
            sentinel = Path(tmp) / 'outside.svg'
            sentinel.write_bytes(b'unchanged')
            (root / 'figure_data.csv').write_text('code,count\nCode,1\n', encoding='utf-8')
            for name in ('../outside', 'C:\\escape', 'safe'):
                with self.subTest(name=name):
                    script = plotting.build_script({'name': 'placeholder', 'dpi': 72})
                    script = script.replace("'placeholder'", repr(name))
                    (root / 'figure.py').write_text(script, encoding='utf-8')
                    if name == 'safe':
                        (root / 'safe.svg').symlink_to(sentinel)
                    result = subprocess.run([sys.executable, str(root / 'figure.py')], capture_output=True, text=True)
                    self.assertNotEqual(result.returncode, 0)
                    self.assertEqual(sentinel.read_bytes(), b'unchanged')
                    self.assertFalse((root / 'safe.png').exists())
