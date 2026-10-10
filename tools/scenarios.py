#!/usr/bin/env python3
"""Run the five TESTING.md scenarios end to end and report what happened.

This is a walkthrough, not a unit test: it drives the app the way a researcher
would, and it prints what it observed so the findings can be written up rather
than guessed at.
"""
from __future__ import annotations

import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from qualicraft import analyze, core, datasets, evaluate, ingest, plotting  # noqa: E402

DOCX_DIR = Path("/Users/chehaijun/Documents/Erasmus mundus public health in disaster/"
                "Qualitative research tool")

FINDINGS = []


def note(scenario, kind, text):
    FINDINGS.append((scenario, kind, text))
    print("      [%s] %s" % (kind, text))


def header(name):
    print("\n" + "=" * 72)
    print(name)
    print("=" * 72)


# ---------------------------------------------------------------------------
def s1_start_from_scratch():
    header("S1. Start a study from scratch: import transcripts, code, export")
    project = core.new_project("Outpatient experience")
    sources = sorted(DOCX_DIR.glob("*Interview_Transcript.docx"))
    if not sources:
        note("S1", "SKIP", "no DOCX transcripts found at %s" % DOCX_DIR)
        return project
    for path in sources:
        text = core.read_docx(path.read_bytes())
        doc = core.add_document(project, path.name, text)
        print("      imported %-28s %6d chars" % (path.name, len(text)))
    codes = [core.add_code(project, name, definition)
             for name, definition in [
                 ("Access and logistics", "Travel, time or cost affects attending care."),
                 ("Being heard", "The participant describes being listened to."),
                 ("Information after the visit", "Uncertainty about instructions at home."),
             ]]
    doc = project["documents"][0]
    segments = core.paragraphs(doc["text"])
    print("      %d segments in the first transcript" % len(segments))
    coded = 0
    for segment in segments[:6]:
        if segment["text"].strip():
            core.annotate(project, doc["id"], codes[coded % len(codes)]["id"],
                          segment["start"], segment["end"])
            coded += 1
    note("S1", "info", "coded %d passages by hand" % coded)
    core.validate_project(project)
    rows = analyze.tidy(project)
    note("S1", "info", "tidy table has %d rows across %d cases"
         % (len(rows), len({r["case"] for r in rows})))
    report = core.methods_narrative(project)
    note("S1", "info", "methods narrative is %d chars" % len(report))
    return project


# ---------------------------------------------------------------------------
def s2_import_someone_elses_codebook():
    header("S2. Take over someone else's coding table and chart it")
    project = ingest.from_openqda_csv(datasets.ensure("open_science.csv"))
    core.validate_project(project)
    rows = analyze.tidy(project)
    note("S2", "info", "%d files / %d codes / %d codings"
         % (len(project["documents"]), len(project["codes"]), len(rows)))

    # The reconstructed document is padding outside coded spans. A reader who
    # scrolls the transcript should be told that.
    doc = project["documents"][0]
    blank = sum(1 for ch in doc["text"] if ch == " ")
    note("S2", "info", "first document is %d chars, %d of them padding (%.0f%%)"
         % (len(doc["text"]), blank, 100.0 * blank / max(len(doc["text"]), 1)))

    for kind, top in (("frequency", 15), ("cooccurrence", 12)):
        result = plotting._result(rows, plotting.normalise({"kind": kind, "top": top}))
        note("S2", "info", "%s -> %d labels" % (kind, len(result["labels"])))

    files, _result = plotting.bundle(project, {"kind": "frequency", "top": 15,
                                               "name": "s2_frequency"})
    note("S2", "info", "bundle contains %s" % ", ".join(sorted(files)))
    return project


# ---------------------------------------------------------------------------
def s3_ai_suggestions():
    header("S3. Ask a model for suggestions, then review them")
    project = core.synthetic_project()
    before = len(project["annotations"])
    suggestions = [s for s in project["suggestions"] if s["status"] == "pending"]
    note("S3", "info", "synthetic project ships %d pending suggestions" % len(suggestions))
    if suggestions:
        core.review(project, suggestions[0]["id"], "accept")
        core.review(project, suggestions[1]["id"], "reject") if len(suggestions) > 1 else None
        after = len(project["annotations"])
        note("S3", "info", "accepting one suggestion added %d coding(s)" % (after - before))
    audit = project["audit"]
    note("S3", "info", "%d audit entries recorded" % len(audit))
    kinds = sorted({entry["action"] for entry in audit})
    note("S3", "info", "audit actions: %s" % ", ".join(kinds))
    # Provenance is the promise; check the model call is actually recorded.
    if not any("suggestion" in entry["action"] for entry in audit):
        note("S3", "GAP", "no audit entry for the suggestion review")
    return project


# ---------------------------------------------------------------------------
def s4_evaluate_against_reference():
    header("S4. Score automatic coding against a researcher reference")
    guide = Path("/Users/chehaijun/WorkBuddy AI/2026-09-27-11-30-14/Guide")
    if not (guide / "Paired_Qualitative_Transcripts_TU_Delft").is_dir():
        note("S4", "SKIP", "guide corpus not present at %s" % guide)
        return
    reference = core.benchmark_project(str(guide), reference=True)
    blind = core.benchmark_project(str(guide), reference=False)
    note("S4", "info", "reference project: %d documents, %d codings"
         % (len(reference["documents"]), len(reference["annotations"])))
    note("S4", "info", "blind workspace: %d documents, %d codings"
         % (len(blind["documents"]), len(blind["annotations"])))
    if not blind["annotations"]:
        note("S4", "GAP", "the blind workspace ships no codings, so scoring needs a "
                          "model run first — which needs a configured API key")

    # Scoring needs predictions. Without a key there are none, so synthesise a
    # deliberately imperfect coder: it misses every fifth coding, drifts on
    # boundaries, and invents a few. That exercises the matcher rather than
    # asserting a number that would only reflect a perfect copy of the truth.
    codes = {c["id"]: c["name"] for c in reference["codes"]}
    docs = {d["id"]: d.get("interview_id", d["name"]) for d in reference["documents"]}
    truth = [{"interview_id": docs[a["document_id"]], "code_name": codes[a["code_id"]],
              "start": a["start"], "end": a["end"]} for a in reference["annotations"]]
    predictions = []
    for i, row in enumerate(truth):
        if i % 5 == 0:
            continue                                   # recall loss
        drift = 3 if i % 3 == 0 else 0
        predictions.append(dict(row, end=row["end"] + drift))
    for row in truth[:6]:                              # precision loss
        predictions.append(dict(row, start=max(0, row["start"] - 30), end=row["end"] + 30))

    per_interview = {}
    for interview in sorted({r["interview_id"] for r in truth}):
        preds = [p for p in predictions if p["interview_id"] == interview]
        refs = [r for r in truth if r["interview_id"] == interview]
        if preds and refs:
            per_interview[interview] = evaluate.evaluate(preds, refs)
    if per_interview:
        macro = sum(s["f1"] for s in per_interview.values()) / len(per_interview)
        note("S4", "info", "scored %d interviews separately (leave-interviews-out)"
             % len(per_interview))
        note("S4", "info", "macro-average F1: %.3f" % macro)
        first = sorted(per_interview)[0]
        s = per_interview[first]
        note("S4", "info", "%s: precision %.2f / recall %.2f / matched %d"
             % (first, s["precision"], s["recall"], s["matched"]))
    else:
        note("S4", "info", "no interview had both predictions and reference codings")


# ---------------------------------------------------------------------------
def s5_hand_the_figure_to_a_coauthor():
    header("S5. Hand a figure to a co-author who only has the exported folder")
    project = ingest.from_openqda_csv(datasets.ensure("open_science.csv"))
    files, _result = plotting.bundle(project, {
        "kind": "cooccurrence", "top": 12, "mode": "overlap",
        "name": "s5_cooccurrence",
        "title": "Fig. Co-occurrence",
        "credit": datasets.credit("open_science.csv"),
    })
    with tempfile.TemporaryDirectory(prefix="coauthor-") as workdir:
        root = Path(workdir)
        for name, payload in files.items():
            (root / name).write_bytes(payload)
        note("S5", "info", "folder handed over: %s" % ", ".join(sorted(files)))
        import subprocess
        done = subprocess.run([sys.executable, str(root / "figure.py")],
                              capture_output=True, text=True, cwd=str(root))
        if done.returncode != 0:
            note("S5", "BUG", "the exported script failed to re-run: %s"
                 % (done.stderr.strip().splitlines() or ["no output"])[-1])
            return
        produced = sorted(p.name for p in root.glob("s5_cooccurrence.*"))
        note("S5", "info", "re-ran the script standalone -> %s" % ", ".join(produced))
        same = (root / "s5_cooccurrence.svg").read_bytes() == files["s5_cooccurrence.svg"]
        note("S5", "info", "re-run output is byte-identical: %s" % same)
        if not same:
            note("S5", "GAP", "re-running the script produced a different figure")


if __name__ == "__main__":
    s1_start_from_scratch()
    s2_import_someone_elses_codebook()
    s3_ai_suggestions()
    s4_evaluate_against_reference()
    s5_hand_the_figure_to_a_coauthor()

    print("\n" + "=" * 72)
    print("SUMMARY")
    print("=" * 72)
    bugs = [f for f in FINDINGS if f[1] in ("BUG", "GAP")]
    skips = [f for f in FINDINGS if f[1] == "SKIP"]
    print("  observations: %d" % len(FINDINGS))
    print("  bugs/gaps   : %d" % len(bugs))
    for scenario, kind, text in bugs:
        print("    %s %s: %s" % (scenario, kind, text))
    for scenario, _kind, text in skips:
        print("    %s SKIP: %s" % (scenario, text))
