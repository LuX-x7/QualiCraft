import io
import json
import tempfile
import unittest
import zipfile
from pathlib import Path

from qualicraft.ai import grounded_suggestions, make_payload, validate_config, Analyzer
from qualicraft.core import Store, add_code, add_document, annotate, benchmark_project, csv_export, new_project, paragraphs, read_docx, review, synthetic_project, validate_project
from qualicraft.evaluate import evaluate, from_project


class CoreTests(unittest.TestCase):
    def test_offsets_preserve_unicode_and_crlf(self):
        p = new_project("Test")
        d = add_document(p, "emoji", "医生：好吗？\r\n患者：🙂好多了。\r\n")
        c = add_code(p, "体验")
        start = d["text"].index("🙂")
        a = annotate(p, d["id"], c["id"], start, start + 4)
        self.assertEqual(a["quote"], "🙂好多了")
        self.assertEqual(paragraphs(d["text"])[1]["speaker"], "patient")
        self.assertEqual(paragraphs(d["text"])[1]["start"], d["text"].index("患者"))
        validate_project(p)

    def test_overlap_and_duplicate(self):
        p = synthetic_project()
        a = p["annotations"][0]
        with self.assertRaises(ValueError):
            annotate(p, a["document_id"], a["code_id"], a["start"], a["end"])
        annotate(p, a["document_id"], p["codes"][1]["id"], a["start"], a["end"] - 1)
        self.assertEqual(len(p["annotations"]), 2)

    def test_researcher_acceptance_and_restore(self):
        p = synthetic_project()
        self.assertEqual(len(p["annotations"]), 1)
        review(p, p["suggestions"][0]["id"], "accept")
        self.assertEqual(len(p["annotations"]), 2)
        self.assertEqual(p["annotations"][-1]["source"], "ai_reviewed")
        review(p, p["suggestions"][1]["id"], "reject")
        self.assertEqual(len(p["annotations"]), 2)
        validate_project(json.loads(json.dumps(p)))
        p["annotations"][0]["quote"] = "invented"
        with self.assertRaises(ValueError):
            validate_project(p)

    def test_hallucination_ambiguity_and_deductive_labels(self):
        seg = {"start": 9, "text": "相同相同🙂真实"}
        rows = [{"code_name": "体验", "quote": q, "start": -1, "rationale": "依据原文"} for q in ["不存在", "相同", "🙂真实"]]
        valid, invalid = grounded_suggestions({"suggestions": rows}, seg, [{"name": "体验"}], "deductive", "doc", "run")
        self.assertEqual(len(valid), 1)
        self.assertEqual(len(invalid), 2)
        self.assertEqual(valid[0]["start"], 13)
        valid, invalid = grounded_suggestions({"suggestions": [{"code_name": "码表外", "quote": "真实", "rationale": "依据"}]}, seg, [{"name": "体验"}], "deductive", "doc", "run")
        self.assertFalse(valid)
        self.assertEqual(len(invalid), 1)

    def test_docx_without_dependency(self):
        data = io.BytesIO()
        with zipfile.ZipFile(data, "w") as z:
            z.writestr("word/document.xml", '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>患者：🙂</w:t><w:tab/><w:t>很好</w:t></w:r></w:p><w:p><w:r><w:t>下一段</w:t></w:r></w:p></w:body></w:document>')
        self.assertEqual(read_docx(data.getvalue()), "患者：🙂\t很好\n下一段")

    def test_csv_formula_injection(self):
        p = new_project("test")
        d = add_document(p, "=HYPERLINK()", "=1+1")
        c = add_code(p, "+BAD")
        annotate(p, d["id"], c["id"], 0, 4)
        self.assertIn("'=1+1", csv_export(p).decode("utf-8-sig"))
        self.assertIn("'+BAD", csv_export(p, True).decode("utf-8-sig"))

    def test_one_to_one_scoring(self):
        row = {"interview_id": "I1", "code_name": "C", "start": 0, "end": 10}
        result = evaluate([row, row], [row])
        self.assertEqual(result["matched"], 1)
        self.assertEqual(result["precision"], .5)
        self.assertEqual(result["recall"], 1)
        self.assertEqual(from_project(synthetic_project(), "model", "I1"), [])

    def test_storage_transaction_rolls_back(self):
        with tempfile.TemporaryDirectory() as tmp:
            store = Store(Path(tmp) / "test.sqlite3")
            p = store.create(synthetic_project())
            def broken(project):
                project["name"] = "changed"
                raise ValueError("rollback")
            with self.assertRaises(ValueError):
                store.change(p["id"], broken)
            self.assertEqual(store.get(p["id"])["name"], p["name"])

    def test_cloud_url_validation_and_preview_no_secret(self):
        for url in ["http://example.com", "https://user:password@example.com", "https://example.com?api_key=secret"]:
            with self.assertRaises(ValueError):
                validate_config({"base_url": url, "model": "model"})
        with tempfile.TemporaryDirectory() as tmp:
            store = Store(Path(tmp) / "test.sqlite3")
            p = store.create(synthetic_project())
            analyzer = Analyzer(store)
            analyzer.configure({"base_url": "https://example.com", "model": "qwen3.8-flash", "api_key": "secret-value"})
            preview = analyzer.preview(p["id"], {"document_id": p["documents"][0]["id"], "scope": "patient"})
            self.assertEqual(len(preview["requests"]), 4)
            self.assertNotIn("secret-value", json.dumps(preview))
            self.assertFalse(preview["requests"][0]["enable_thinking"])
            self.assertNotIn("annotations", preview["requests"][0]["messages"][1]["content"])

    @unittest.skipUnless(Path("E:/Software/Guide/Paired_Qualitative_Transcripts_TU_Delft").is_dir(), "Local optional benchmark unavailable")
    def test_real_reference_has_exact_quotes(self):
        p = benchmark_project("E:/Software/Guide", reference=True)
        self.assertEqual((len(p["documents"]), len(p["codes"]), len(p["annotations"])), (7, 54, 377))
        validate_project(p)
        blind = benchmark_project("E:/Software/Guide", reference=False)
        self.assertEqual(len(blind["annotations"]), 0)


if __name__ == "__main__":
    unittest.main()
