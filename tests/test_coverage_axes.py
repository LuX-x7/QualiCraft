"""Exercise the exported renderer with asymmetric, non-square CSV matrices."""
import csv
import base64
import io
import json
from pathlib import Path
import runpy
import tempfile
import sqlite3
import textwrap
import xml.etree.ElementTree as ET
import unittest
from unittest.mock import patch

from qualicraft import plotting


@unittest.skipUnless(plotting.availability()['available'], 'plotting stack unavailable')
class CoverageAxesTests(unittest.TestCase):
    def draw(self, rows):
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        from matplotlib.axes import Axes

        captured = []
        original = Axes.imshow

        def observe(axis, matrix, *args, **kwargs):
            image = original(axis, matrix, *args, **kwargs)
            captured.append((axis, image))
            return image

        with tempfile.TemporaryDirectory(prefix='qc-coverage-axes-') as workdir:
            root = Path(workdir)
            stream = io.StringIO(newline='')
            csv.writer(stream).writerows([['case', 'code', 'count'], *rows])
            (root/'figure_data.csv').write_text(stream.getvalue(), encoding='utf-8')
            (root/'figure.py').write_text(plotting.build_script({'kind':'coverage', 'font':'DejaVu Sans'}), encoding='utf-8')
            with plt.rc_context(), patch.object(Axes, 'imshow', observe):
                runpy.run_path(str(root/'figure.py'), run_name='__main__')
            self.assertEqual(len(captured), 1)
            self.assertTrue(all((root/f'figure_coverage.{ext}').is_file() for ext in ['svg','png','pdf']))
        return captured[0]

    def assert_axis_cells(self, rows, cases, codes, expected):
        axis, image = self.draw(rows)
        self.assertEqual(image.get_array().tolist(), expected)
        self.assertEqual([t.get_text() for t in axis.get_xticklabels()], [c.replace('.txt','') for c in cases])
        self.assertEqual([t.get_text() for t in axis.get_yticklabels()],
                         ['\n'.join(textwrap.wrap(code,32)) or code for code in codes])
        self.assertEqual(axis.get_xlabel(), 'Interview file')
        self.assertEqual(axis.get_ylabel(), 'Code')
        self.assertEqual(list(axis.get_xticks()), list(range(len(cases))))
        self.assertEqual(list(axis.get_yticks()), list(range(len(codes))))
        self.assertEqual(tuple(image.get_extent()), (-.5,len(cases)-.5,len(codes)-.5,-.5))
        lookup={(case,code):int(value) for case,code,value in rows}
        for y, code in enumerate(codes):
            for x, case in enumerate(cases):
                self.assertEqual(image.get_array()[y,x], lookup[(case,code)])

    def test_each_cell_has_interview_x_and_code_y_with_unsorted_csv_and_zeros(self):
        self.assert_axis_cells(
            [('case-C.txt','Alpha',5),('case-C.txt','Beta',6),
             ('case-A.txt','Alpha',1),('case-A.txt','Beta',7),
             ('case-B.txt','Alpha',4),('case-B.txt','Beta',0)],
            ['case-A.txt','case-B.txt','case-C.txt'], ['Beta','Alpha'],
            [[7,0,6],[1,4,5]])

    def test_single_interview_retains_all_code_rows(self):
        self.assert_axis_cells([('case-A.txt','Alpha',1),('case-A.txt','Beta',3),('case-A.txt','Gamma',2)],
                               ['case-A.txt'],['Beta','Gamma','Alpha'],[[3],[2],[1]])

    def test_single_code_retains_all_interview_columns(self):
        self.assert_axis_cells([('case-B.txt','Alpha',4),('case-A.txt','Alpha',2)],
                               ['case-A.txt','case-B.txt'],['Alpha'],[[2,4]])

    def test_bologna_csv_and_analysis_stay_case_by_code_while_all_cells_align(self):
        from qualicraft import analyze
        repo = Path(__file__).resolve().parents[1]
        with sqlite3.connect((repo/'demo-data/qualicraft.sqlite3').as_uri()+'?mode=ro', uri=True) as conn:
            project = json.loads(conn.execute('SELECT data FROM projects WHERE id=?',
                ('a71a0b538c024c3ab23fb4286cfe93e2',)).fetchone()[0])
        root = repo/'website/public/report'
        figure = next(f for f in json.loads((root/'manifest.json').read_text(encoding='utf-8'))['figures']
                      if f['kind']=='coverage')
        options = plotting.normalise({'kind':'coverage'})
        tidy = analyze.tidy(project)
        result = plotting._result(tidy, options)
        self.assertEqual(result, figure['numbers'])
        self.assertEqual(plotting._dataset(tidy, options).encode('utf-8'), (root/figure['csv']).read_bytes())
        with (root/figure['csv']).open(encoding='utf-8', newline='') as handle:
            rows = list(csv.reader(handle))[1:]
        expected = [[line[column] for line in result['matrix']] for column in range(len(result['labels']))]
        self.assert_axis_cells(rows, result['cases'], result['labels'], expected)
        # Independently inspect the report's actual embedded heatmap pixels,
        # not just the matrix handed to imshow. Every labelled cell must carry
        # the colour for its original CSV value, including zero cells.
        import matplotlib
        from matplotlib.image import imread
        ns = {'s':'http://www.w3.org/2000/svg'}
        svg = ET.parse(root/figure['svg']).getroot()
        axes = next(g for g in svg.iter() if g.get('id')=='axes_1')
        images = axes.findall('.//s:image', ns)
        self.assertEqual(len(images), 1)
        png = images[0].get('{http://www.w3.org/1999/xlink}href').split(',',1)[1]
        pixels = imread(io.BytesIO(base64.b64decode(png)), format='png')
        height, width = pixels.shape[:2]
        # The SVG image transform flips its stored PNG vertically. Sample in
        # displayed (top-to-bottom code) order after applying that transform.
        self.assertTrue(images[0].get('transform','').startswith('scale(1 -1) '))
        cmap = matplotlib.colormaps[options['palette']]
        peak = max(int(row[2]) for row in rows)
        lookup = {(case,code):int(count) for case,code,count in rows}
        for y, code in enumerate(result['labels']):
            for x, case in enumerate(result['cases']):
                actual = [int(c*255) for c in pixels[
                    height-1-int((y+.5)*height/len(result['labels'])),
                    int((x+.5)*width/len(result['cases'])), :3]]
                wanted = [int(c*255) for c in cmap(lookup[(case,code)]/peak)[:3]]
                self.assertTrue(all(abs(a-b)<=1 for a,b in zip(actual,wanted)),
                                (case,code,lookup[(case,code)],actual,wanted))
