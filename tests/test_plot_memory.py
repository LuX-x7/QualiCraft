"""Full Bologna export must leave room for the server on a 512 MiB host."""
import csv
import io
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET
from unittest.mock import patch

from qualicraft import plotting


@unittest.skipUnless(sys.platform in ('darwin', 'linux') and plotting.availability()['available'],
                     'requires the plotting stack and Unix process high-water measurement')
class FullHierarchyMemoryTests(unittest.TestCase):
    def test_png_matches_standard_tight_save_at_requested_dpi(self):
        import runpy
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        from matplotlib.figure import Figure
        original = Figure.savefig
        with tempfile.TemporaryDirectory(prefix='qc-hierarchy-pixels-') as workdir:
            root = Path(workdir)
            data = ('section,subsection,count\nA,A long code label wrapping onto more than one line for checking text geometry,12\n'
                    'A,Another code,0\nB,Third code,7\n')
            (root / 'figure_data.csv').write_text(data, encoding='utf-8')
            for dpi in (72, 300, 600):
                with self.subTest(dpi=dpi), plt.rc_context():
                    script = plotting.build_script({'kind': 'hierarchy', 'font': 'DejaVu Sans',
                                                    'dpi': dpi, 'fontsize': 14, 'figsize': 3})
                    (root / 'figure.py').write_text(script, encoding='utf-8')
                    runpy.run_path(str(root / 'figure.py'))
                    actual = (root / 'figure_hierarchy.png').read_bytes()

                    def standard_tight(figure, filename, **kwargs):
                        if str(filename).endswith('.png'):
                            kwargs['bbox_inches'] = 'tight'
                        return original(figure, filename, **kwargs)

                    # Independent reference: Matplotlib's ordinary tight-save
                    # path, on a small figure where its extra buffer fits.
                    with patch.object(Figure, 'savefig', standard_tight):
                        runpy.run_path(str(root / 'figure.py'))
                    self.assertEqual(actual, (root / 'figure_hierarchy.png').read_bytes())

    def test_complete_bologna_script_exports_all_rows_below_memory_budget(self):
        # Use the public count fixture directly: no project database is touched.
        source = Path(__file__).resolve().parents[1] / 'website/public/original-bologna/report/figures/hierarchy.csv'
        data = source.read_bytes()
        rows = list(csv.DictReader(io.StringIO(data.decode('utf-8'))))
        self.assertEqual(len(rows), 259)
        script = plotting.build_script({'kind': 'hierarchy', 'font': 'DejaVu Sans'})
        with tempfile.TemporaryDirectory(prefix='qc-hierarchy-memory-') as workdir:
            root = Path(workdir)
            (root / 'figure_data.csv').write_bytes(data)
            (root / 'figure.py').write_text(script, encoding='utf-8')
            # Measure the independent exported script, including imports and
            # all three output backends, rather than the test runner's RSS.
            probe = ('import json,resource,runpy,sys; '
                     'initial=resource.getrusage(resource.RUSAGE_SELF).ru_maxrss; '
                     'runpy.run_path(sys.argv[1]); '
                     'print(json.dumps({"initial":initial,"peak":resource.getrusage(resource.RUSAGE_SELF).ru_maxrss}))')
            # On Linux, fork/exec can retain the test runner's high-water
            # counter. Spawn from a fresh, small interpreter so the measured
            # script cannot inherit earlier tests' large canvas allocation.
            launcher = 'import subprocess,sys; raise SystemExit(subprocess.call([sys.executable,"-c",sys.argv[1],sys.argv[2]]))'
            run = subprocess.run([sys.executable, '-c', launcher, probe, str(root / 'figure.py')],
                                 capture_output=True, text=True, timeout=120)
            self.assertEqual(run.returncode, 0, run.stderr)
            measurement = json.loads(run.stdout)
            scale = 1 if sys.platform == 'darwin' else 1024
            self.assertLess(measurement['initial'] * scale, 100 * 1024**2,
                            'Memory probe inherited its parent high-water counter')
            peak = measurement['peak'] * scale
            self.assertLess(peak, 430 * 1024**2,
                            f'Full hierarchy used {peak / 1024**2:.1f} MiB; must leave server headroom')
            self.assertEqual((root / 'figure_data.csv').read_bytes(), data)
            for extension in plotting.FIGURE_EXTENSIONS:
                self.assertGreater((root / ('figure_hierarchy.' + extension)).stat().st_size, 1000)
            svg = ET.fromstring((root / 'figure_hierarchy.svg').read_text(encoding='utf-8'))
            text = ''.join(''.join(svg.itertext()).split())
            for row in rows:
                self.assertIn(''.join(row['subsection'].split()), text)
            from PIL import Image
            with Image.open(io.BytesIO((root / 'figure_hierarchy.png').read_bytes())) as image:
                self.assertGreater(image.width, 3000)
                self.assertGreater(image.height, 14000)
                self.assertAlmostEqual(image.info['dpi'][0], 300, places=2)


if __name__ == '__main__':
    unittest.main()
