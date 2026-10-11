"""Tests for the plotting module.

The drawing itself needs matplotlib, which is optional, so these tests cover
the parts that decide *what* to draw: the data each figure is handed, the CSV,
the exported script, and option handling. The render step is exercised only
when the stack happens to be present.
"""
import unittest

from qualicraft import analyze, plotting
from qualicraft.core import add_code, add_document, annotate, new_project


def project_with(text, codes, spans):
    """Build a project whose annotations sit at the given spans."""
    p = new_project("Plot")
    d = add_document(p, "I1", text)
    made = {name: add_code(p, name) for name in codes}
    for name, start, end in spans:
        annotate(p, d["id"], made[name]["id"], start, end)
    return p


class AvailabilityTests(unittest.TestCase):
    def test_availability_reports_the_optional_stack(self):
        state = plotting.availability()
        self.assertIn("available", state)
        self.assertIn("missing", state)
        self.assertIsInstance(state["available"], bool)
        if not state["available"]:
            self.assertTrue(state["missing"])
            self.assertIn("pip install", state["install"])

    def test_render_says_which_pieces_are_missing(self):
        state = plotting.availability()
        if state["available"]:
            self.skipTest("the plotting stack is installed")
        with self.assertRaises(RuntimeError) as caught:
            plotting.render(new_project("Empty"))
        message = str(caught.exception)
        for name in state["missing"]:
            self.assertIn(name, message)
        self.assertIn("pip install", message)


class OptionTests(unittest.TestCase):
    def test_unknown_values_fall_back_to_the_defaults(self):
        o = plotting.normalise({"kind": "nonsense", "palette": "nope", "method": "???",
                                "mode": "sideways", "fontsize": 999, "figsize": -4,
                                "dpi": 1, "top": 900})
        self.assertEqual(o["kind"], plotting.DEFAULT_OPTIONS["kind"])
        self.assertEqual(o["palette"], plotting.DEFAULT_OPTIONS["palette"])
        self.assertEqual(o["method"], "ward")
        self.assertEqual(o["mode"], "overlap")
        self.assertEqual(o["fontsize"], 20)
        self.assertEqual(o["figsize"], 3.0)
        self.assertEqual(o["dpi"], 72)
        self.assertEqual(o["top"], 60)

    def test_query_string_values_are_parsed_not_trusted(self):
        o = plotting.normalise({"cluster": "true", "annotate": "0", "top": "12"})
        self.assertTrue(o["cluster"])
        self.assertFalse(o["annotate"])
        self.assertEqual(o["top"], 12)

    def test_a_name_defaults_to_the_kind(self):
        self.assertEqual(plotting.normalise({"kind": "coverage"})["name"], "figure_coverage")

    def test_every_kind_gets_a_default_title(self):
        for kind in plotting.PLOT_KINDS:
            self.assertTrue(plotting.normalise({"kind": kind})["title"])


class CooccurrenceTests(unittest.TestCase):
    def test_overlap_counts_only_intersecting_ranges(self):
        text = "abcdefghij"
        p = project_with(text, ["A", "B", "C"],
                         [("A", 0, 4), ("B", 3, 7), ("C", 8, 10)])
        result = plotting.cooccurrence(p, {"mode": "overlap"})
        index = {name: i for i, name in enumerate(result["labels"])}
        matrix = result["matrix"]
        self.assertEqual(matrix[index["A"]][index["B"]], 1)   # 0-4 and 3-7 overlap
        self.assertEqual(matrix[index["A"]][index["C"]], 0)   # 0-4 and 8-10 do not
        self.assertEqual(matrix[index["A"]][index["A"]], 1)   # diagonal = own count

    def test_unit_mode_is_coarser_than_overlap(self):
        # Two codings on one line, but not overlapping each other.
        text = "A here then B here"
        p = project_with(text, ["A", "B"], [("A", 0, 1), ("B", 13, 14)])
        by_overlap = plotting.cooccurrence(p, {"mode": "overlap"})
        by_unit = plotting.cooccurrence(p, {"mode": "unit"})
        index = {name: i for i, name in enumerate(by_overlap["labels"])}
        self.assertEqual(by_overlap["matrix"][index["A"]][index["B"]], 0)
        self.assertEqual(by_unit["matrix"][index["A"]][index["B"]], 1)

    def test_labels_come_back_in_frequency_order(self):
        text = "a b c d e f"
        p = project_with(text, ["Rare", "Common"],
                         [("Rare", 0, 1), ("Common", 2, 3),
                          ("Common", 4, 5), ("Common", 6, 7)])
        self.assertEqual(plotting.cooccurrence(p, {})["labels"][0], "Common")

    def test_limit_keeps_the_most_frequent_codes(self):
        text = "a b c d e f g h"
        p = project_with(text, ["One", "Two", "Three"],
                         [("One", 0, 1), ("One", 2, 3), ("Two", 4, 5), ("Three", 6, 7)])
        result = plotting.cooccurrence(p, {"top": 2})
        self.assertEqual(len(result["labels"]), 2)
        self.assertIn("One", result["labels"])          # two codings, keeps its place
        # Two and Three tie on one coding each, so the name breaks the tie and
        # Three survives. Asserting on the tie is the point of this test.
        self.assertEqual(result["labels"], ["One", "Three"])

    def test_matrix_csv_is_readable_on_its_own(self):
        p = project_with("A and B", ["A", "B"], [("A", 0, 1), ("B", 6, 7)])
        text = plotting.matrix_csv(plotting.cooccurrence(p, {"mode": "overlap"}))
        lines = text.strip().splitlines()
        self.assertEqual(len(lines), 3)          # header + two codes
        self.assertTrue(lines[0].startswith(","))
        self.assertIn("A", lines[0])


class ScriptTests(unittest.TestCase):
    def test_every_kind_exports_valid_python(self):
        for kind in plotting.PLOT_KINDS:
            script = plotting.build_script({"kind": kind, "palette": "rocket",
                                            "annotate": False, "top": 12})
            compile(script, "figure.py", "exec")     # raises if not valid Python
            self.assertIn("'palette': 'rocket'", script)
            self.assertIn("'annotate': False", script)   # Python literal, not JSON
            self.assertIn("'kind': '%s'" % kind, script)
            self.assertIn("figure_data.csv", script)

    def test_script_carries_a_resolved_font(self):
        script = plotting.build_script({"kind": "frequency"})
        self.assertIn("'font':", script)
        self.assertNotIn("'font': ''", script)

    def test_script_writes_png_svg_and_pdf(self):
        script = plotting.build_script({"kind": "frequency"})
        for ext in ("png", "svg", "pdf"):
            self.assertIn('"%s"' % ext, script)


class DatasetTests(unittest.TestCase):
    def test_each_kind_produces_a_csv_with_a_header_and_rows(self):
        # B deliberately overlaps A, so the co-occurrence figure has a pair.
        p = project_with("alpha beta gamma delta",
                         ["A", "B"],
                         [("A", 0, 8), ("B", 6, 16), ("A", 11, 16)])
        for kind in plotting.PLOT_KINDS:
            options = plotting.normalise({"kind": kind, "top": 10})
            data = plotting._dataset(analyze.tidy(p), options)
            lines = [line for line in data.strip().splitlines() if line]
            self.assertGreaterEqual(len(lines), 2, "%s produced no rows" % kind)

    def test_result_reports_the_numbers_behind_the_figure(self):
        p = project_with("alpha beta", ["A", "B"], [("A", 0, 5), ("B", 6, 10)])
        result = plotting._result(analyze.tidy(p), plotting.normalise({"kind": "frequency"}))
        self.assertEqual(result["kind"], "frequency")
        self.assertEqual(sorted(result["labels"]), ["A", "B"])
        self.assertEqual(result["codings"], 2)


if __name__ == "__main__":
    unittest.main()


class ExportedSvgTextTests(unittest.TestCase):
    """The SVG has to be editable, which means its text has to be text.

    matplotlib's default `svg.fonttype` is `path`: labels are written as glyph
    outlines that render correctly and cannot be re-lettered in Inkscape or
    Illustrator. This project promises figures that can be edited, and journals
    increasingly ask for it, so the export sets `fonttype='none'` for the save.
    Without that setting these tests fail — the file is still valid, still
    looks right, and the strings are simply not in it.

    A side effect worth knowing: paths are far larger than text. The same
    frequency figure is about 9 KB as text and about 98 KB as outlines.
    """

    def setUp(self):
        import shutil, tempfile
        from pathlib import Path
        self._shutil = shutil
        self.root = Path(tempfile.mkdtemp(prefix="qc-svgtext-"))
        from qualicraft.core import Store, new_project, add_code, annotate
        store = Store(self.root / "q.sqlite3")
        project = new_project("SVG text")
        text = (Path(__file__).resolve().parents[1] / "tools" / "e2e" / "fixtures"
                / "synthetic_interview.txt")
        body = text.read_text(encoding="utf-8")
        project["documents"].append({"id": "d1", "name": "a.txt", "text": body,
                                     "created_at": project["created_at"], "memo": ""})
        codes = [add_code(project, name) for name in ("Isolation", "Schedule", "Feedback")]
        annotate(project, "d1", codes[0]["id"], 0, 60, "", "manual")
        annotate(project, "d1", codes[1]["id"], 30, 90, "", "manual")
        annotate(project, "d1", codes[2]["id"], 10, 120, "", "manual")
        store.create(project)
        self.project = store.get(project["id"])

    def tearDown(self):
        self._shutil.rmtree(self.root, ignore_errors=True)

    def svg(self, kind):
        from pathlib import Path
        from qualicraft import plotting
        markup, _ = plotting.render(self.project, {"kind": kind})
        return markup

    def test_every_figure_carries_searchable_text(self):
        import re
        for kind in ("frequency", "coverage", "hierarchy", "accumulation", "cooccurrence"):
            with self.subTest(kind=kind):
                markup = self.svg(kind)
                nodes = re.findall(r"<text[^>]*>(.*?)</text>", markup, re.S)
                self.assertGreater(len(nodes), 0,
                                   "text is exported as outlines, so the figure cannot be edited")

    def test_the_counting_unit_is_searchable_in_the_svg(self):
        import re
        for kind in ("frequency", "coverage", "hierarchy", "accumulation", "cooccurrence"):
            with self.subTest(kind=kind):
                markup = self.svg(kind)
                body = " ".join(re.findall(r"<text[^>]*>(.*?)</text>", markup, re.S))
                self.assertTrue(
                    any(phrase in body for phrase in
                        ("not participants", "not correlation", "not saturation")),
                    "the figure does not state its counting unit in searchable text")


class EmptyFigureMessageTests(unittest.TestCase):
    """What a reader is told when a figure has nothing to draw.

    Co-occurrence is the one figure that can be empty while the project has
    codings to spare: it counts pairs of codes whose character ranges overlap
    inside one interview, and codes placed on separate passages never form a
    pair. "Widen the filter" is the generic message and it points at the wrong
    control, so this figure gets its own.
    """

    def setUp(self):
        import shutil, tempfile
        from pathlib import Path
        self._shutil = shutil
        self.root = Path(tempfile.mkdtemp(prefix="qc-empty-"))
        from qualicraft.core import Store, new_project, add_code, annotate
        store = Store(self.root / "q.sqlite3")
        project = new_project("Empty figures")
        project["documents"].append({"id": "d1", "name": "a.txt",
                                     "text": "One two three four five six seven eight.",
                                     "created_at": project["created_at"], "memo": ""})
        left = add_code(project, "Isolation")
        right = add_code(project, "Schedule")
        # Two codes, plenty of codings, and deliberately no overlap.
        annotate(project, "d1", left["id"], 0, 8, "", "manual")
        annotate(project, "d1", right["id"], 20, 30, "", "manual")
        store.create(project)
        self.project = store.get(project["id"])

    def tearDown(self):
        self._shutil.rmtree(self.root, ignore_errors=True)

    def test_cooccurrence_says_what_is_missing_not_to_widen_a_filter(self):
        from qualicraft import plotting
        with self.assertRaises(ValueError) as caught:
            plotting.render(self.project, {"kind": "cooccurrence", "mode": "overlap"})
        message = str(caught.exception)
        self.assertIn("overlapping", message,
                      "the message must name the requirement this figure has")
        self.assertNotIn("widen the filter", message,
                         "the generic hint points at the wrong control here")

