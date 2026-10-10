"""Tests for the CSV importers.

The end-to-end tests run against the two public datasets, which are downloaded
on demand and verified by hash. When they are absent — an offline checkout, a
first run with no network — those tests skip rather than fail, because the
importer logic is covered by the synthetic fixtures above them either way.
"""
import tempfile
import unittest
from pathlib import Path

from qualicraft import analyze, core, datasets, ingest

OPEN_QDA = (
    "file;code category;created by;created at;last update;start pos;end pos;selection\n"
    "A01.txt;open data;r1;2025-01-01;2025-01-02;0;5;hello\n"
    "A01.txt;open data;r1;2025-01-01;2025-01-02;20;25;world\n"
    "A01.txt;barriers;r1;2025-01-01;2025-01-02;4;9;lo wo\n"
    "A02.txt;open data;r1;2025-01-01;2025-01-02;0;3;abc\n"
)

NVIVO = (
    "Report section,Report subsection,Thematic code,Coded Text\n"
    "Intro,Background,Reproducibility,alpha text\n"
    "Intro,Background,Reproducibility,beta text\n"
    "Intro,Methods,Tools,gamma\n"
    "Discussion,Limits,Scope,delta\n"
)


def write(tmp, name, text, encoding="utf-8"):
    path = Path(tmp) / name
    path.write_text(text, encoding=encoding)
    return path


class OpenQdaTests(unittest.TestCase):
    def test_columns_are_found_and_offsets_are_kept(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = ingest.from_openqda_csv(write(tmp, "a.csv", OPEN_QDA))
            core.validate_project(project)          # spans must satisfy the quote
            self.assertEqual(len(project["documents"]), 2)
            self.assertEqual(len(project["annotations"]), 4)
            self.assertEqual({c["name"] for c in project["codes"]}, {"open data", "barriers"})
            first = project["documents"][0]
            span = next(a for a in project["annotations"] if a["start"] == 4)
            self.assertEqual(first["text"][span["start"]:span["end"]], span["quote"])

    def test_the_same_span_can_carry_two_codes(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = ingest.from_openqda_csv(write(tmp, "a.csv", OPEN_QDA))
            overlapping = [a for a in project["annotations"] if a["start"] < 9 and a["end"] > 4]
            self.assertGreaterEqual(len(overlapping), 2)

    def test_a_missing_column_is_named_in_the_error(self):
        broken = "file;code category;start pos;end pos\nA01.txt;x;0;5\n"
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaises(ValueError) as caught:
                ingest.from_openqda_csv(write(tmp, "a.csv", broken))
            self.assertIn("selection", str(caught.exception))


class NvivoTests(unittest.TestCase):
    def test_sections_become_documents_and_subsections_become_codes(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = ingest.from_nvivo_csv(write(tmp, "n.csv", NVIVO))
            core.validate_project(project)
            self.assertEqual(len(project["documents"]), 2)
            self.assertEqual(len(project["annotations"]), 4)
            themes = {c["name"] for c in project["codes"] if c["parent_id"] is None}
            self.assertEqual(themes, {"Intro", "Discussion"})

    def test_the_thematic_code_is_kept_on_the_memo(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = ingest.from_nvivo_csv(write(tmp, "n.csv", NVIVO))
            memos = {a["memo"] for a in project["annotations"]}
            self.assertIn("Reproducibility", memos)

    def test_the_hierarchy_survives_into_the_analysis_layer(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = ingest.from_nvivo_csv(write(tmp, "n.csv", NVIVO))
            rows = analyze.tidy(project)
            themes = {r["theme"] for r in rows}
            self.assertEqual(themes, {"Intro", "Discussion"})


class VerifyTests(unittest.TestCase):
    def test_a_shape_mismatch_is_reported(self):
        with tempfile.TemporaryDirectory() as tmp:
            project = ingest.from_openqda_csv(write(tmp, "a.csv", OPEN_QDA))
            self.assertTrue(ingest.verify(project, {"rows": 4}))
            with self.assertRaises(ValueError) as caught:
                ingest.verify(project, {"rows": 999})
            self.assertIn("999", str(caught.exception))


class PublicDatasetTests(unittest.TestCase):
    """End to end against the reviewed data, when it is available."""

    def setUp(self):
        try:
            self.a_path = datasets.ensure("open_science.csv")
            self.c_path = datasets.ensure("nvivo.csv")
        except Exception as exc:                 # offline, or hash mismatch
            self.skipTest("datasets unavailable: %s" % exc)

    def test_dataset_a_matches_its_documented_shape(self):
        project = ingest.from_openqda_csv(self.a_path)
        core.validate_project(project)
        ingest.verify(project, {"rows": 837, "codes": 39, "documents": 26})
        rows = analyze.tidy(project)
        self.assertEqual(len(rows), 837)
        self.assertEqual(len({r["case"] for r in rows}), 26)

    def test_dataset_c_matches_its_documented_shape(self):
        project = ingest.from_nvivo_csv(self.c_path)
        core.validate_project(project)
        ingest.verify(project, {"rows": 1008})
        rows = analyze.tidy(project)
        hierarchy = analyze.hierarchy(rows)
        self.assertEqual(len(hierarchy), 6)
        self.assertEqual(sum(len(v) for v in hierarchy.values()), 28)

    def test_dataset_a_cooccurrence_is_not_empty(self):
        rows = analyze.tidy(ingest.from_openqda_csv(self.a_path))
        result = analyze.cooccurrence(rows, mode="overlap", limit=12)
        self.assertEqual(len(result["labels"]), 12)
        off_diagonal = sum(v for i, row in enumerate(result["matrix"])
                           for j, v in enumerate(row) if i != j)
        self.assertGreater(off_diagonal, 0)


if __name__ == "__main__":
    unittest.main()
