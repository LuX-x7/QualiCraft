from __future__ import annotations

import csv
import hashlib
import io
import json
import re
import sqlite3
import uuid
import zipfile
from collections import Counter
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

COLORS = ["#427d77", "#ba8650", "#7b77b5", "#5c85b0", "#ba6e85", "#778c51"]


def uid():
    return uuid.uuid4().hex


def now():
    return datetime.now(timezone.utc).isoformat()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def string(value, label, limit=2000):
    require(isinstance(value, str) and bool(value.strip()) and len(value) <= limit, f"{label} is required and must be fewer than {limit} characters")
    return value.strip()


def find(items, item_id):
    item = next((x for x in items if x["id"] == item_id), None)
    require(item is not None, "The requested record could not be found")
    return item


def event(project, action, **details):
    project["audit"].append({"id": uid(), "time": now(), "action": action, **details})


def new_project(name):
    return {"schema_version": 1, "id": uid(), "name": string(name, "Project name", 160),
            "created_at": now(), "updated_at": now(), "documents": [], "codes": [],
            "annotations": [], "suggestions": [], "audit": [], "provenance": ""}


def paragraphs(text):
    """Keep source immutable; offsets are Python Unicode code points, end exclusive."""
    result, speaker, question = [], "unknown", ""
    for match in re.finditer(r"[^\r\n]+", text):
        raw = match.group()
        if not raw.strip():
            continue
        label = re.match(r"^\s*(患者|病人|受访者|Patient|Participant|Answer|P|A|医生|访谈者|采访者|Doctor|Interviewer|D|Q)\s*[:：]\s*", raw, re.I)
        if label:
            speaker = "patient" if label[1].lower() in {"患者", "病人", "受访者", "patient", "participant", "answer", "p", "a"} else "doctor"
        elif re.match(r"^\s*IQ\d+(?:\.\d+)?\s*[:.]", raw, re.I):
            speaker = "doctor"
        if speaker == "doctor":
            question = raw
        result.append({"index": len(result), "start": match.start(), "end": match.end(),
                       "text": raw, "speaker": speaker, "context": question if speaker == "patient" else ""})
    return result


def add_document(project, name, text):
    require(isinstance(text, str) and text.strip() and len(text) <= 500_000, "The document is empty or exceeds 500,000 characters")
    require(len(project["documents"]) < 100, "This release supports up to 100 documents per project")
    doc = {"id": uid(), "name": string(name, "Document name", 200), "text": text,
           "sha256": hashlib.sha256(text.encode("utf-8")).hexdigest(), "created_at": now()}
    project["documents"].append(doc)
    event(project, "document_import", document_id=doc["id"], sha256=doc["sha256"])
    return doc


def add_code(project, name, definition="", color=None):
    name = string(name, "Code name", 160)
    require(not any(c["name"].casefold() == name.casefold() for c in project["codes"]), "A code with this name already exists")
    require(isinstance(definition, str) and len(definition) <= 5000, "The definition is too long")
    color = color or COLORS[len(project["codes"]) % len(COLORS)]
    require(bool(re.fullmatch(r"#[0-9a-fA-F]{6}", color)), "The color must be a six-digit hexadecimal value")
    code = {"id": uid(), "name": name, "definition": definition, "color": color}
    project["codes"].append(code)
    event(project, "code_create", code_id=code["id"], name=name)
    return code


def validate_span(doc, start, end, quote=None):
    require(type(start) is int and type(end) is int and 0 <= start < end <= len(doc["text"]), "The quotation range is invalid")
    require(quote is None or doc["text"][start:end] == quote, "The quotation does not match the source text")
    return doc["text"][start:end]


def annotate(project, document_id, code_id, start, end, memo="", source="manual", suggestion_id=None):
    doc = find(project["documents"], document_id)
    find(project["codes"], code_id)
    quote = validate_span(doc, start, end)
    require(isinstance(memo, str) and len(memo) <= 5000, "The memo is too long")
    require(not any(a["document_id"] == document_id and a["code_id"] == code_id and a["start"] == start and a["end"] == end for a in project["annotations"]), "This passage already has that code")
    ann = {"id": uid(), "document_id": document_id, "code_id": code_id, "start": start, "end": end,
           "quote": quote, "memo": memo, "source": source, "suggestion_id": suggestion_id, "created_at": now()}
    project["annotations"].append(ann)
    event(project, "annotation_create", annotation_id=ann["id"], source=source, suggestion_id=suggestion_id)
    return ann


def review(project, suggestion_id, action):
    suggestion = find(project["suggestions"], suggestion_id)
    require(suggestion["status"] == "pending", "This suggestion has already been reviewed")
    require(action in {"accept", "reject"}, "The review action is invalid")
    if action == "accept":
        code = next((c for c in project["codes"] if c["name"].casefold() == suggestion["code_name"].casefold()), None)
        if code is None:
            code = add_code(project, suggestion["code_name"], suggestion.get("definition", ""))
        annotate(project, suggestion["document_id"], code["id"], suggestion["start"], suggestion["end"],
                 suggestion.get("rationale", ""), "ai_reviewed", suggestion_id)
    suggestion["status"] = "accepted" if action == "accept" else "rejected"
    suggestion["reviewed_at"] = now()
    event(project, "suggestion_review", suggestion_id=suggestion_id, decision=action)


def read_docx(data):
    require(len(data) <= 8_000_000, "The DOCX file exceeds 8 MB")
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        info = archive.getinfo("word/document.xml")
        require(info.file_size <= 12_000_000, "The uncompressed DOCX content is too large")
        xml = archive.read(info)
    require(b"<!DOCTYPE" not in xml and b"<!ENTITY" not in xml, "Documents containing entity declarations are not supported")
    root = ET.fromstring(xml)
    ns = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    lines = []
    for p in root.iter(ns + "p"):
        lines.append("".join(n.text or "" if n.tag == ns + "t" else "\t" if n.tag == ns + "tab" else "\n" if n.tag in {ns + "br", ns + "cr"} else "" for n in p.iter()))
    return "\n".join(lines)


def synthetic_project():
    project = new_project("Fictional care interview")
    project["provenance"] = "A wholly fictional care interview for product demonstration. It contains no patient data. The sample suggestions are fixed examples, not model output."
    doc = add_document(project, "P01 · Follow-up experience (fictional)", "Doctor: Thinking about today's appointment, what helped you most?\nPatient: The doctor let me finish my questions and drew a simple diagram of the treatment options. I felt that my concerns were taken seriously.\n\nDoctor: How clear is the medication plan now that you are home?\nPatient: It made sense during the visit, but at home I was unsure how to space the two medicines. A short written schedule would help.\n\nDoctor: Is anything making follow-up difficult?\nPatient: I need to change buses twice and take time away from work. I would prefer video appointments when a physical examination is not needed.\n\nDoctor: How would you like to decide the next step?\nPatient: I want to explain what is realistic in my daily life and then choose a plan with the doctor that I can follow.")
    codes = [add_code(project, n, d) for n, d in [("Feeling heard and respected", "The participant describes being listened to, understood, or treated with respect."), ("Information after the visit", "The participant is uncertain about instructions or how to carry them out after the visit."), ("Access to care", "Travel, time, cost, or other practical conditions affect access to care."), ("Shared decision-making", "The participant wants to take part in choosing or adapting the care plan.")]]
    quote = "The doctor let me finish my questions and drew a simple diagram of the treatment options. I felt that my concerns were taken seriously."
    start = doc["text"].index(quote)
    annotate(project, doc["id"], codes[0]["id"], start, start + len(quote), "Code the observable communication behavior, rather than satisfaction alone.")
    for quote, code, reason in [("at home I was unsure how to space the two medicines", codes[1], "The instructions were not easy to apply once the patient was home."), ("I need to change buses twice and take time away from work", codes[2], "Travel and time away from work create a practical barrier."), ("choose a plan with the doctor that I can follow", codes[3], "The patient wants a feasible plan chosen together with the doctor.")]:
        start = doc["text"].index(quote)
        project["suggestions"].append({"id": uid(), "document_id": doc["id"], "start": start, "end": start + len(quote), "quote": quote, "code_name": code["name"], "definition": code["definition"], "rationale": reason, "status": "pending", "source": "synthetic_demo", "created_at": now()})
    return project


def benchmark_project(guide, reference=False):
    root = Path(guide) / "Paired_Qualitative_Transcripts_TU_Delft"
    require(root.is_dir(), "TU Delft data was not found. Set QUALICRAFT_GUIDE to the Guide directory")
    project = new_project("TU Delft · " + ("researcher reference" if reference else "blind workspace"))
    project["provenance"] = "Thijmen van Gend & Anneke Zuiderwijk (2022), DOI:10.4121/19635147.v1, CC BY 4.0. The original researchers' coding is an interpretive reference, not a single correct answer."
    code_map, doc_map = {}, {}
    for c in json.loads((root / "derived/codebook.json").read_text(encoding="utf-8")):
        code_map[c["code_guid"]] = add_code(project, c["code_name"], c["definition"])["id"]
    for path in sorted((root / "derived/transcripts").glob("*.txt")):
        # read_bytes avoids universal-newline conversion that would shift offsets.
        doc = add_document(project, path.stem, path.read_bytes().decode("utf-8"))
        doc["interview_id"] = path.stem
        doc_map[path.stem] = doc
    if reference:
        for line in (root / "derived/code_applications.jsonl").read_text(encoding="utf-8").splitlines():
            row = json.loads(line)
            doc = doc_map[row["interview_id"]]
            validate_span(doc, row["start"], row["end"], row["quote"])
            annotate(project, doc["id"], code_map[row["code_guid"]], row["start"], row["end"], source="researcher_reference")
    event(project, "benchmark_import", reference=reference)
    return project


def grounded_theory_examples_project(guide):
    root = Path(guide) / "Grounded_Theory_Interview_Examples_Tian_2021" / "Complementary_Material" / "Interview Transcripts"
    require(root.is_dir(), "The grounded theory interview examples were not found in the Guide directory")
    project = new_project("Grounded theory interview examples · Tian 2021")
    project["provenance"] = "Eight English interview transcripts from Tian et al. (2021), supplied in the local Guide materials. Imported as an uncoded workspace for grounded theory practice; no source coding is treated as a single correct interpretation."
    paths = sorted(root.glob("*.docx"))
    require(bool(paths), "No DOCX interview transcripts were found in the grounded theory example directory")
    for path in paths:
        add_document(project, path.stem.replace("Interview Transcript_", "Interview "), read_docx(path.read_bytes()))
    event(project, "guide_examples_import", collection="Grounded_Theory_Interview_Examples_Tian_2021", documents=len(paths))
    return project


def validate_project(project):
    require(isinstance(project, dict) and project.get("schema_version") == 1, "This project format is not supported")
    string(project.get("name"), "Project name", 160)
    for key, limit in [("documents", 100), ("codes", 2000), ("annotations", 50000), ("suggestions", 50000), ("audit", 100000)]:
        require(isinstance(project.get(key), list) and len(project[key]) <= limit, f"{key} has an invalid format or item count")
        ids = [string(x.get("id"), "Record ID", 100) for x in project[key]]
        require(all(re.fullmatch(r"[a-zA-Z0-9_-]+", item_id) for item_id in ids), "A record ID contains unsupported characters")
        require(len(ids) == len(set(ids)), f"{key} contains duplicate IDs")
    for d in project["documents"]:
        string(d.get("name"), "Document name", 200)
        require(isinstance(d.get("text"), str) and 0 < len(d["text"]) <= 500000, "The document text is invalid")
        require(d.get("sha256") == hashlib.sha256(d["text"].encode()).hexdigest(), "Document integrity validation failed")
    names = set()
    for c in project["codes"]:
        name = string(c.get("name"), "Code name", 160).casefold()
        require(name not in names, "The codebook contains duplicate names")
        names.add(name)
        require(isinstance(c.get("color"), str) and bool(re.fullmatch(r"#[0-9a-fA-F]{6}", c["color"])), "The code color is invalid")
        require(isinstance(c.get("definition"), str) and len(c["definition"]) <= 5000, "The code definition is invalid")
    for a in project["annotations"] + project["suggestions"]:
        require(isinstance(a.get("quote"), str), "The source quotation is missing")
        validate_span(find(project["documents"], a.get("document_id")), a.get("start"), a.get("end"), a.get("quote"))
        if "code_id" in a:
            find(project["codes"], a["code_id"])
        else:
            string(a.get("code_name"), "Suggested code", 160)
            require(a.get("status") in {"pending", "accepted", "rejected"}, "The suggestion status is invalid")
    return project


class Store:
    def __init__(self, path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.connect() as conn:
            conn.execute("CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, data TEXT NOT NULL)")

    @contextmanager
    def connect(self):
        conn = sqlite3.connect(self.path, timeout=30)
        try:
            with conn:
                yield conn
        finally:
            conn.close()

    def list(self):
        with self.connect() as conn:
            rows = [json.loads(x[0]) for x in conn.execute("SELECT data FROM projects")]
        return [{k: p[k] for k in ("id", "name", "updated_at")} for p in sorted(rows, key=lambda p: p["updated_at"], reverse=True)]

    def get(self, project_id):
        with self.connect() as conn:
            row = conn.execute("SELECT data FROM projects WHERE id=?", (project_id,)).fetchone()
        require(row is not None, "The project does not exist")
        return json.loads(row[0])

    def create(self, project):
        with self.connect() as conn:
            conn.execute("INSERT INTO projects VALUES (?,?)", (project["id"], json.dumps(project, ensure_ascii=False)))
        return project

    def change(self, project_id, operation):
        with self.connect() as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT data FROM projects WHERE id=?", (project_id,)).fetchone()
            require(row is not None, "The project does not exist")
            project = json.loads(row[0])
            result = operation(project)
            project["updated_at"] = now()
            conn.execute("UPDATE projects SET data=? WHERE id=?", (json.dumps(project, ensure_ascii=False), project_id))
        return result

    def migrate_legacy_demo_projects(self):
        """Replace only QualiCraft's known Chinese fixtures; preserve all user projects."""
        known = {
            "医患沟通 · 合成演示": "Fictional care interview",
            "Qwen 实测 · 虚构医患访谈": "Qwen smoke test · fictional interview",
        }
        with self.connect() as conn:
            rows = conn.execute("SELECT id, data FROM projects").fetchall()
            for project_id, raw in rows:
                old = json.loads(raw)
                if old.get("name") not in known:
                    continue
                replacement = synthetic_project()
                replacement["id"] = project_id
                replacement["name"] = known[old["name"]]
                replacement["created_at"] = old.get("created_at", replacement["created_at"])
                replacement["updated_at"] = now()
                conn.execute("UPDATE projects SET data=? WHERE id=?", (json.dumps(replacement, ensure_ascii=False), project_id))


def csv_export(project, matrix=False):
    stream = io.StringIO(newline="")
    writer = csv.writer(stream)
    def safe(value):
        value = str(value)
        return "'" + value if value.lstrip().startswith(("=", "+", "-", "@")) or value.startswith(("\t", "\r", "\n")) else value
    if matrix:
        writer.writerow(["document"] + [safe(c["name"]) for c in project["codes"]])
        counts = Counter((a["document_id"], a["code_id"]) for a in project["annotations"])
        for d in project["documents"]:
            writer.writerow([safe(d["name"])] + [counts[d["id"], c["id"]] for c in project["codes"]])
    else:
        writer.writerow(["document", "code", "start", "end", "quote", "memo", "source"])
        for a in project["annotations"]:
            writer.writerow([safe(find(project["documents"], a["document_id"])["name"]), safe(find(project["codes"], a["code_id"])["name"]), a["start"], a["end"], safe(a["quote"]), safe(a.get("memo", "")), safe(a["source"])])
    return ("\ufeff" + stream.getvalue()).encode("utf-8")
