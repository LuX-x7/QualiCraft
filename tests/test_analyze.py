"""Tests for the analysis layer: Project -> tidy table -> statistics.

These run on the standard library alone, which is the point of keeping pandas
out of `analyze`.
"""
import unittest

from qualicraft import analyze
from qualicraft.core import add_code, add_document, annotate, new_project


def build():
    """Two cases, a two-level codebook, and a deliberate overlap."""
    p = new_project("Analyse")
    first = add_document(p, "I1", "alpha beta gamma delta")
    second = add_document(p, "I2", "epsilon zeta")
    theme = add_code(p, "Theme")
    child = add_code(p, "Child", parent_id=theme["id"])
    other = add_code(p, "Other")
    annotate(p, first["id"], child["id"], 0, 10)      # alpha beta
    annotate(p, first["id"], other["id"], 6, 16)      # overlaps the above
    annotate(p, second["id"], other["id"], 0, 7)
    return p


class TidyTests(unittest.TestCase):
    def test_one_row_per_coding_with_the_documented_columns(self):
        rows = analyze.tidy(build())
        self.assertEqual(len(rows), 3)
        self.assertEqual(tuple(rows[0].keys()), analyze.COLUMNS)

    def test_theme_is_the_top_level_ancestor(self):
        rows = analyze.tidy(build())
        child_row = next(r for r in rows if r["code"] == "Child")
        self.assertEqual(child_row["parent_code"], "Theme")
        self.assertEqual(child_row["theme"], "Theme")

    def test_a_top_level_code_is_its_own_theme(self):
        rows = analyze.tidy(build())
        other = next(r for r in rows if r["code"] == "Other")
        self.assertEqual(other["parent_code"], "")
        self.assertEqual(other["theme"], "Other")

    def test_a_coding_whose_code_vanished_is_skipped_not_fatal(self):
        p = build()
        p["codes"] = [c for c in p["codes"] if c["name"] != "Other"]
        rows = analyze.tidy(p)
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["code"], "Child")


class StatisticTests(unittest.TestCase):
    def test_frequency_is_descending_with_a_stable_tie_break(self):
        rows = analyze.tidy(build())
        counts = {d["label"]: d["count"] for d in analyze.frequency(rows)}
        self.assertEqual(counts, {"Other": 2, "Child": 1})
        self.assertEqual(analyze.frequency(rows)[0]["label"], "Other")

    def test_overlap_finds_the_intersecting_pair(self):
        rows = analyze.tidy(build())
        result = analyze.cooccurrence(rows, mode="overlap")
        index = {name: i for i, name in enumerate(result["labels"])}
        self.assertEqual(result["matrix"][index["Child"]][index["Other"]], 1)
        self.assertEqual(result["mode"], "overlap")

    def test_unit_mode_needs_the_transcripts(self):
        rows = analyze.tidy(build())
        with self.assertRaises(ValueError):
            analyze.cooccurrence(rows, mode="unit")

    def test_an_unknown_mode_is_rejected_rather_than_guessed(self):
        rows = analyze.tidy(build())
        with self.assertRaises(ValueError):
            analyze.cooccurrence(rows, mode="vibes")

    def test_coverage_is_case_by_code(self):
        rows = analyze.tidy(build())
        cov = analyze.coverage(rows)
        self.assertEqual(cov["cases"], ["I1", "I2"])
        self.assertEqual(cov["codes"][0], "Other")      # most frequent first
        self.assertEqual(len(cov["matrix"]), 2)

    def test_accumulation_counts_distinct_codes_as_cases_arrive(self):
        rows = analyze.tidy(build())
        acc = analyze.accumulation(rows)
        self.assertEqual(acc["cases"], ["I1", "I2"])
        self.assertEqual(acc["cumulative"], [2, 2])     # I2 adds no new code
        self.assertEqual(acc["new"], [2, 0])

    def test_accumulation_respects_an_explicit_case_order(self):
        rows = analyze.tidy(build())
        acc = analyze.accumulation(rows, order=["I2", "I1"])
        self.assertEqual(acc["cumulative"], [1, 2])

    def test_hierarchy_groups_codes_under_their_theme(self):
        rows = analyze.tidy(build())
        h = analyze.hierarchy(rows)
        self.assertEqual(h["Theme"], {"Child": 1})
        self.assertEqual(h["Other"], {"Other": 2})

    def test_summary_counts_cases_codes_codings_themes(self):
        summary = analyze.summary(build())
        self.assertEqual(summary["cases"], 2)
        self.assertEqual(summary["codes"], 2)
        self.assertEqual(summary["codings"], 3)
        self.assertEqual(summary["themes"], 2)


class EmptyProjectTests(unittest.TestCase):
    def test_everything_returns_empty_rather_than_raising(self):
        empty = new_project("Empty")
        rows = analyze.tidy(empty)
        self.assertEqual(rows, [])
        self.assertEqual(analyze.frequency(rows), [])
        self.assertEqual(analyze.cooccurrence(rows)["labels"], [])
        self.assertEqual(analyze.coverage(rows)["cases"], [])
        self.assertEqual(analyze.accumulation(rows)["cumulative"], [])
        self.assertEqual(analyze.summary(empty)["codings"], 0)


if __name__ == "__main__":
    unittest.main()
