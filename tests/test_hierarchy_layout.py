"""Check the final exported renderer's text geometry, without dropping CSV rows."""
import csv
import io
from pathlib import Path
import runpy
import tempfile
import unittest
from unittest.mock import patch

from qualicraft import plotting


@unittest.skipUnless(plotting.availability()['available'], 'plotting stack unavailable')
class HierarchyLayoutTests(unittest.TestCase):
    def draw(self, rows, **options):
        import matplotlib
        matplotlib.use('Agg')
        import matplotlib.pyplot as plt
        from matplotlib.figure import Figure

        measured = []

        def inspect(figure, path, **_kwargs):
            if measured:
                return
            figure.canvas.draw()
            renderer = figure.canvas.get_renderer()
            panels = []
            for axis in figure.axes:
                if not axis.axison:
                    continue
                labels = axis.get_yticklabels()
                panels.append({
                    'labels': [label.get_text() for label in labels],
                    'boxes': [label.get_window_extent(renderer).frozen() for label in labels],
                    'values': [bar.get_width() for bar in axis.patches],
                    'counts': [text.get_text() for text in axis.texts],
                    'count_boxes': [text.get_window_extent(renderer).frozen() for text in axis.texts],
                    'title': axis._left_title.get_window_extent(renderer).frozen(),
                    'xlabel': axis.xaxis.label.get_window_extent(renderer).frozen(),
                })
            measured.append((figure.bbox.frozen(), panels))

        with tempfile.TemporaryDirectory(prefix='qc-hierarchy-layout-') as workdir:
            root = Path(workdir)
            stream = io.StringIO(newline='')
            csv.writer(stream).writerows([['section', 'subsection', 'count'], *rows])
            (root/'figure_data.csv').write_text(stream.getvalue(), encoding='utf-8')
            script = plotting.build_script({'kind': 'hierarchy', 'font': 'DejaVu Sans', **options})
            (root/'figure.py').write_text(script, encoding='utf-8')
            with plt.rc_context(), patch.object(Figure, 'savefig', inspect):
                runpy.run_path(str(root/'figure.py'), run_name='__main__')
        self.assertEqual(len(measured), 1)
        bounds, panels = measured[0]
        self.assertEqual(sum(len(p['labels']) for p in panels), len(rows))
        for panel, section in zip(panels, sorted({row[0] for row in rows})):
            expected = sorted([row for row in rows if row[0] == section], key=lambda row: int(row[2]))
            # Wrapping can introduce spaces inside long words, but never lose text.
            compact = lambda label: ''.join(label.split())
            self.assertEqual([compact(label) for label in panel['labels']],
                             [compact(row[1]) for row in expected])
            self.assertEqual(panel['values'], [int(row[2]) for row in expected])
            self.assertEqual(panel['counts'], [row[2] for row in expected])
            boxes = sorted(panel['boxes'], key=lambda box: box.y0)
            for first, second in zip(boxes, boxes[1:]):
                self.assertGreaterEqual(second.y0 - first.y1, 2,
                                        f'Overlapping labels in {section}: {first}, {second}')
            for box in [*boxes, *panel['count_boxes'], panel['title'], panel['xlabel']]:
                self.assertGreaterEqual(box.x0, bounds.x0)
                self.assertLessEqual(box.x1, bounds.x1)
                self.assertGreaterEqual(box.y0, bounds.y0)
                self.assertLessEqual(box.y1, bounds.y1)
            self.assertLess(boxes[-1].y1, panel['title'].y0)
            self.assertGreater(boxes[0].y0, panel['xlabel'].y1)
        # No panel's label/title rectangle may collide with another panel's text.
        for i, first in enumerate(panels):
            for second in panels[i+1:]:
                for a in [*first['boxes'], *first['count_boxes'], first['title'], first['xlabel']]:
                    for b in [*second['boxes'], *second['count_boxes'], second['title'], second['xlabel']]:
                        self.assertFalse(a.overlaps(b), 'Text from different themes overlaps')

    def test_complete_bologna_hierarchy_at_workbench_and_report_font_sizes(self):
        path = Path(__file__).resolve().parents[1]/'website/public/original-bologna/report/figures/hierarchy.csv'
        with path.open(encoding='utf-8', newline='') as handle:
            rows = list(csv.reader(handle))[1:]
        self.assertEqual(len(rows), 259)
        for fontsize in (9, 10):
            with self.subTest(fontsize=fontsize):
                self.draw(rows, fontsize=fontsize)

    def test_long_multiline_labels_ties_and_zero_counts_in_narrow_large_type(self):
        rows = [('A theme with a long technical title',
                 f'Row {i}: a long named code with several nested concepts and a precise qualification',
                 str(i//2)) for i in range(24)]
        rows += [('B single row', 'One code', '0')]
        self.draw(rows, fontsize=20, figsize=3)

