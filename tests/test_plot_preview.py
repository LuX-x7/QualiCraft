"""Preview uses the same SVG recipe without raster/PDF work or stale reuse."""
import copy
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from qualicraft import plotting
from tests.test_plot_paths import sample


@unittest.skipUnless(plotting.availability()['available'], 'plotting stack unavailable')
class PreviewTests(unittest.TestCase):
    def setUp(self):
        clear = getattr(plotting, 'clear_preview_cache', None)
        if clear:
            clear()

    def test_preview_only_requests_svg_and_bundle_still_has_every_format(self):
        real = plotting.subprocess.run
        calls = []
        def tracked(args, **kwargs):
            result = real(args, **kwargs)
            calls.append((args, {p.suffix for p in Path(kwargs['cwd']).iterdir()}))
            return result
        with patch('qualicraft.plotting.subprocess.run', side_effect=tracked):
            svg, result = plotting.render(sample(), {'dpi':72})
        self.assertIn('--svg-only', calls[0][0])
        self.assertNotIn('.png', calls[0][1])
        self.assertNotIn('.pdf', calls[0][1])
        files, exported = plotting.bundle(sample(), {'dpi':72})
        self.assertEqual(svg.encode(), files['figure_frequency.svg'])
        self.assertEqual(result, exported)
        self.assertEqual(len(files),5)

    def test_cache_reuses_identical_inputs_and_invalidates_changed_codes_or_options(self):
        p = sample()
        real = plotting.subprocess.run
        with patch('qualicraft.plotting.subprocess.run', wraps=real) as run:
            first, result = plotting.render(p, {'dpi':72})
            result['counts'][0]=999
            second, clean = plotting.render(copy.deepcopy(p), {'dpi':72})
            self.assertEqual(run.call_count,1)
            self.assertEqual(first,second)
            self.assertEqual(clean['counts'],[1])
            p['codes'][0]['name']='Changed label'
            changed,_=plotting.render(p, {'dpi':72})
            self.assertNotEqual(changed,first)
            plotting.render(p, {'dpi':72,'title':'Another title'})
            self.assertEqual(run.call_count,3)

    def test_failed_render_is_not_cached(self):
        with patch('qualicraft.plotting.subprocess.run', side_effect=RuntimeError('unavailable')) as run:
            for _ in range(2):
                with self.assertRaisesRegex(RuntimeError,'unavailable'):
                    plotting.render(sample(), {'dpi':72})
            self.assertEqual(run.call_count,2)

    def test_changed_transcript_invalidates_unit_cooccurrence_preview(self):
        p=sample()
        real=plotting.subprocess.run
        with patch('qualicraft.plotting.subprocess.run',wraps=real) as run:
            plotting.render(p,{'dpi':72})
            p['documents'][0]['text']+='\nextra paragraph'
            plotting.render(p,{'dpi':72})
            self.assertEqual(run.call_count,2)

    def test_bounded_cache_evicts_old_output(self):
        produced={'figure_frequency.svg':b'<svg>cached</svg>'}
        with patch('qualicraft.plotting._PREVIEW_CACHE_BYTES',40), patch('qualicraft.plotting._prepare',return_value=(produced,{})) as prepare:
            p=sample()
            plotting.render(p,{'title':'One'})
            plotting.render(p,{'title':'Two'})
            plotting.render(p,{'title':'Three'})
            plotting.render(p,{'title':'One'})
            self.assertEqual(prepare.call_count,4)
