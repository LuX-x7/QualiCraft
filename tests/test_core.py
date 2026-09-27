import io
import json
import tempfile
import unittest
import zipfile
from pathlib import Path

from qualicraft.ai import grounded_suggestions, make_payload, validate_config, Analyzer
from qualicraft.core import Store, add_code, add_document, annotate, benchmark_project, code_path, csv_export, delete_code, grounded_theory_examples_project, merge_codes, migrate, new_project, paragraphs, read_docx, review, synthetic_project, update_code, validate_project
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

    def test_tian_interview_labels_distinguish_questions_and_answers(self):
        rows = paragraphs("IQ2.1\nContext for the question\nIQ2.1.1: How do you work?\nIP1: A detailed answer\nIQ3.1: Another question\nIP1：另一个回答")
        self.assertEqual([row["speaker"] for row in rows], ["doctor", "doctor", "doctor", "patient", "doctor", "patient"])

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

    def test_legacy_fixture_migration_preserves_unknown_projects(self):
        with tempfile.TemporaryDirectory() as tmp:
            store = Store(Path(tmp) / "test.sqlite3")
            legacy = synthetic_project()
            legacy["name"] = "医患沟通 · 合成演示"
            user = store.create(new_project("My study"))
            store.create(legacy)
            store.migrate_legacy_demo_projects()
            self.assertEqual(store.get(user["id"])["name"], "My study")
            migrated = store.get(legacy["id"])
            self.assertEqual(migrated["name"], "Fictional care interview")
            self.assertTrue(all(ord(char) < 128 for char in migrated["documents"][0]["text"]))

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

    @unittest.skipUnless(Path("E:/Software/Guide/Grounded_Theory_Interview_Examples_Tian_2021").is_dir(), "Local grounded theory examples unavailable")
    def test_grounded_theory_examples_import(self):
        p = grounded_theory_examples_project("E:/Software/Guide")
        self.assertEqual(p["name"], "Tian 2021 · software architecture interviews")
        self.assertEqual(len(p["documents"]), 8)
        self.assertEqual(len(p["annotations"]), 0)
        answer = next(x for x in paragraphs(p["documents"][0]["text"]) if x["text"].startswith("Answer:"))
        self.assertEqual(answer["speaker"], "patient")
        interview_answer = next(x for x in paragraphs(p["documents"][0]["text"]) if x["text"].startswith("IP1:"))
        self.assertEqual(interview_answer["speaker"], "patient")
        validate_project(p)

    def test_schema_v1_migrates_to_v2_without_data_loss(self):
        p = new_project("Legacy")
        quote = "the doctor explained things clearly and I felt heard."
        d = add_document(p, "I1", "Patient: " + quote)
        c = add_code(p, "Legacy code", "old definition")
        start = d["text"].index(quote)
        annotate(p, d["id"], c["id"], start, start + len(quote))
        for code in p["codes"]:
            for key in ("parent_id", "memo", "anchor_examples", "inclusion", "exclusion", "status", "order"):
                code.pop(key, None)
        for document in p["documents"]:
            document.pop("attributes", None)
        p["schema_version"] = 1
        validate_project(p)
        self.assertEqual(p["schema_version"], 2)
        self.assertEqual(len(p["annotations"]), 1)
        self.assertEqual(p["annotations"][0]["quote"], quote)
        self.assertIsNone(p["codes"][0]["parent_id"])
        self.assertEqual(p["codes"][0]["status"], "final")
        self.assertEqual(migrate(json.loads(json.dumps(p)))["schema_version"], 2)

    def test_code_hierarchy_and_paths(self):
        p = new_project("Hierarchy")
        theme = add_code(p, "Experience with RDM")
        researcher = add_code(p, "Experience with RDM [R]", parent_id=theme["id"])
        policy = add_code(p, "Experience with RDM [PM/SP]", parent_id=theme["id"])
        self.assertIsNone(theme["parent_id"])
        self.assertEqual(researcher["parent_id"], theme["id"])
        self.assertEqual(code_path(p["codes"], researcher), "Experience with RDM > Experience with RDM [R]")
        with self.assertRaises(ValueError):
            add_code(p, "Orphan", parent_id="missing")
        validate_project(p)

    def test_update_code_rejects_cycles_duplicates_and_bad_status(self):
        p = new_project("Update")
        theme = add_code(p, "Theme")
        child = add_code(p, "Child", parent_id=theme["id"])
        update_code(p, child["id"], {"name": "Renamed child", "memo": "note", "inclusion": "when x",
                                     "exclusion": "when y", "anchor_examples": ["a quote"], "status": "provisional"})
        self.assertEqual(child["name"], "Renamed child")
        self.assertEqual(child["status"], "provisional")
        self.assertEqual(child["anchor_examples"], ["a quote"])
        with self.assertRaises(ValueError):
            update_code(p, child["id"], {"name": "Theme"})
        with self.assertRaises(ValueError):
            update_code(p, theme["id"], {"parent_id": child["id"]})
        with self.assertRaises(ValueError):
            update_code(p, theme["id"], {"parent_id": theme["id"]})
        with self.assertRaises(ValueError):
            update_code(p, theme["id"], {"status": "invented"})
        validate_project(p)

    def test_delete_code_reparents_children_and_removes_codings(self):
        p = new_project("Delete")
        d = add_document(p, "I1", "Patient: " + "Some analysable content here. " * 6)
        top = add_code(p, "Top")
        middle = add_code(p, "Middle", parent_id=top["id"])
        leaf = add_code(p, "Leaf", parent_id=middle["id"])
        annotate(p, d["id"], middle["id"], 9, 40)
        annotate(p, d["id"], leaf["id"], 45, 70)
        result = delete_code(p, middle["id"])
        self.assertEqual(result["codings_removed"], 1)
        self.assertEqual(result["children_reparented"], 1)
        self.assertEqual(next(c for c in p["codes"] if c["id"] == leaf["id"])["parent_id"], top["id"])
        self.assertEqual(len(p["annotations"]), 1)
        self.assertTrue(any(a["action"] == "code_delete" for a in p["audit"]))
        validate_project(p)

    def test_merge_codes_moves_codings_and_collapses_duplicates(self):
        p = new_project("Merge")
        d = add_document(p, "I1", "Patient: " + "Some analysable content here. " * 6)
        source = add_code(p, "Source")
        target = add_code(p, "Target")
        annotate(p, d["id"], source["id"], 9, 40)
        annotate(p, d["id"], source["id"], 45, 70)
        annotate(p, d["id"], target["id"], 9, 40)   # same span as the first source coding
        result = merge_codes(p, source["id"], target["id"])
        self.assertEqual(result["codings_moved"], 1)
        self.assertEqual(result["duplicates_collapsed"], 1)
        self.assertEqual(len(p["annotations"]), 2)
        self.assertTrue(all(c["id"] != source["id"] for c in p["codes"]))
        with self.assertRaises(ValueError):
            merge_codes(p, target["id"], target["id"])
        validate_project(p)

    def test_codings_csv_carries_the_code_path(self):
        p = new_project("Export")
        d = add_document(p, "I1", "Patient: " + "Some analysable content here. " * 6)
        theme = add_code(p, "Theme")
        child = add_code(p, "Child", parent_id=theme["id"])
        annotate(p, d["id"], child["id"], 9, 40)
        text = csv_export(p).decode("utf-8-sig")
        self.assertIn("code_path", text.splitlines()[0])
        self.assertIn("Theme > Child", text)


if __name__ == "__main__":
    unittest.main()
