"""Tests for the plotting module.

The drawing itself needs matplotlib / seaborn / scipy, which are optional and may
not be installed, so these tests cover the parts that decide *what* to draw: the
co-occurrence counts, the CSV, the exported script, and option handling. The
render step is exercised only when the stack happens to be present.
"""
import unittest

from qualicraft import plotting
from qualicraft.core import add_code, add_document, annotate, new_project, set_blocks


def project_with(text, codes, spans):
    """Build a project whose annotations sit at the given spans."""
    p = new_project("Plot")
    d = add_document(p, "I1", text)
    made = {name: add_code(p, name) for name in codes}
    for name, start, end in spans:
        annotate(p, d["id"], made[name]["id"], start, end)
    return p


class PlottingTests(unittest.TestCase):
    def test_availability_reports_the_optional_stack(self):
        state = plotting.availability()
        self.assertIn("available", state)
        self.assertIn("missing", state)
        self.assertIsInstance(state["available"], bool)
        if not state["available"]:
            self.assertTrue(state["missing"])
            self.assertIn("pip install", state["install"])

    def test_options_are_clamped_to_supported_values(self):
        o = plotting.normalise({"level": "nonsense", "palette": "nope", "method": "???",
                                "fontsize": 999, "figsize": -4, "dpi": 1, "title": "x" * 500})
        self.assertEqual(o["level"], "theme")
        self.assertEqual(o["palette"], "viridis")
        self.assertEqual(o["method"], "ward")
        self.assertEqual(o["fontsize"], 20)
        self.assertEqual(o["figsize"], 3.0)
        self.assertEqual(o["dpi"], 72)
        self.assertEqual(len(o["title"]), 200)

    def test_cooccurrence_counts_shared_passages(self):
        # Three lines; A and B share the first, C appears alone on the second.
        text = "A and B here\nonly C here\nnothing"
        p = project_with(text, ["A", "B", "C"],
                         [("A", 0, 1), ("B", 6, 7), ("C", 19, 20)])
        result = plotting.cooccurrence(p, {"level": "code", "unit": "paragraph"})
        self.assertEqual(result["units"], 3)
        index = {name: i for i, name in enumerate(result["labels"])}
        matrix = result["matrix"]
        self.assertEqual(matrix[index["A"]][index["B"]], 1)   # same line
        self.assertEqual(matrix[index["A"]][index["C"]], 0)   # different lines
        self.assertEqual(matrix[index["A"]][index["A"]], 1)   # diagonal = own count

    def test_cooccurrence_rolls_codes_up_to_their_theme(self):
        p = new_project("Plot")
        d = add_document(p, "I1", "one line of text")
        theme = add_code(p, "Theme")
        child = add_code(p, "Child", parent_id=theme["id"])
        annotate(p, d["id"], child["id"], 0, 3)
        at_theme = plotting.cooccurrence(p, {"level": "theme"})
        at_code = plotting.cooccurrence(p, {"level": "code"})
        self.assertEqual(at_theme["labels"], ["Theme"])
        self.assertEqual(sorted(at_code["labels"]), ["Child", "Theme"])

    def test_document_unit_is_coarser_than_paragraph(self):
        text = "A here\nB here"
        p = project_with(text, ["A", "B"], [("A", 0, 1), ("B", 7, 8)])
        by_paragraph = plotting.cooccurrence(p, {"unit": "paragraph"})
        by_document = plotting.cooccurrence(p, {"unit": "document"})
        index = {name: i for i, name in enumerate(by_paragraph["labels"])}
        self.assertEqual(by_paragraph["matrix"][index["A"]][index["B"]], 0)
        self.assertEqual(by_document["matrix"][index["A"]][index["B"]], 1)

    def test_matrix_csv_is_readable_on_its_own(self):
        p = project_with("A and B", ["A", "B"], [("A", 0, 1), ("B", 6, 7)])
        text = plotting.matrix_csv(plotting.cooccurrence(p, {"level": "code"}))
        lines = text.strip().splitlines()
        self.assertEqual(len(lines), 3)          # header + two codes
        self.assertTrue(lines[0].startswith(","))
        self.assertIn("A", lines[0])

    def test_exported_script_is_valid_python_and_carries_the_settings(self):
        script = plotting.build_script({"level": "code", "palette": "rocket", "annotate": False})
        compile(script, "figure.py", "exec")     # raises if the script is not valid Python
        self.assertIn("'level': 'code'", script)
        self.assertIn("'palette': 'rocket'", script)
        self.assertIn("'annotate': False", script)   # Python literal, not JSON
        self.assertIn("figure_data.csv", script)

    def test_empty_project_reports_no_data_instead_of_failing_oddly(self):
        result = plotting.cooccurrence(new_project("Empty"), {})
        self.assertEqual(result["labels"], [])
        self.assertEqual(result["matrix"], [])
        self.assertEqual(result["units"], 0)

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


if __name__ == "__main__":
    unittest.main()
