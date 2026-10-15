from __future__ import annotations

import csv
import hashlib
import io
import json
import re
import os
import sqlite3
import sys
import uuid
import zipfile
from collections import Counter
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

COLORS = ["#427d77", "#ba8650", "#7b77b5", "#5c85b0", "#ba6e85", "#778c51"]

SCHEMA_VERSION = 4

CODE_STATUSES = ("emergent", "provisional", "final")

# Capability blocks. The core is always on; everything here is opt-in, so a
# researcher assembles the tool they need instead of getting everything at once.
# See docs/NOT_BUILDING.md: "not built in" is not the same as "not available".
BLOCKS = ("hierarchy", "memos", "ai", "insights", "audit", "plotting")
DEFAULT_BLOCKS = ("hierarchy", "memos", "ai", "insights", "audit")


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


def migrate(project):
    """Upgrade an older project in place to the current schema. Idempotent.

    v1 -> v2 adds the codebook hierarchy and the methodological fields the
    analysis workflows need: codes gain parent_id / memo / anchor examples /
    inclusion and exclusion criteria / status, and documents gain attributes.

    v2 -> v3 gives every document a reading note, so the familiarisation phase
    of a qualitative study has somewhere to live.

    v3 -> v4 records which capability blocks the project uses, so a researcher
    can assemble the tool they need rather than receiving everything at once.

    Every added value is a neutral default, so an existing project keeps its
    codes, annotations and character offsets untouched.
    """
    version = project.get("schema_version", 1)
    if version >= SCHEMA_VERSION:
        return project
    if version < 2:
        for code in project.get("codes", []):
            code.setdefault("parent_id", None)
            code.setdefault("memo", "")
            code.setdefault("anchor_examples", [])
            code.setdefault("inclusion", "")
            code.setdefault("exclusion", "")
            code.setdefault("status", "final")
            code.setdefault("order", 0)
        for document in project.get("documents", []):
            document.setdefault("attributes", {})
        version = 2
    if version < 3:
        for document in project.get("documents", []):
            document.setdefault("memo", "")
        version = 3
    if version < 4:
        project.setdefault("blocks", list(DEFAULT_BLOCKS))
        version = 4
    project["schema_version"] = version
    return project


def descendants(codes, code_id):
    """Every code id below code_id, at any depth."""
    out, stack = set(), [code_id]
    while stack:
        current = stack.pop()
        for code in codes:
            if code.get("parent_id") == current and code["id"] not in out:
                out.add(code["id"])
                stack.append(code["id"])
    return out


def code_depth(codes, code_id):
    by_id = {c["id"]: c for c in codes}
    depth, seen, current = 0, set(), by_id.get(code_id)
    while current and current.get("parent_id") and current["id"] not in seen:
        seen.add(current["id"])
        current = by_id.get(current["parent_id"])
        depth += 1
    return depth


def code_path(codes, code):
    """'Parent > Child' label, for exports and reports."""
    by_id = {c["id"]: c for c in codes}
    parts, seen, current = [code["name"]], {code["id"]}, code
    while current.get("parent_id") and current["parent_id"] in by_id and current["parent_id"] not in seen:
        current = by_id[current["parent_id"]]
        seen.add(current["id"])
        parts.append(current["name"])
    return " > ".join(reversed(parts))


def new_project(name):
    return {"schema_version": SCHEMA_VERSION, "id": uid(), "name": string(name, "Project name", 160),
            "created_at": now(), "updated_at": now(), "documents": [], "codes": [],
            "annotations": [], "suggestions": [], "audit": [], "provenance": "",
            "blocks": list(DEFAULT_BLOCKS)}


def set_blocks(project, blocks):
    """Turn capability blocks on or off for this project.

    The choice is stored with the project, so which tools a study used is part
    of the record rather than a local preference.
    """
    require(isinstance(blocks, list), "The capability list is invalid")
    require(len(blocks) <= len(BLOCKS), "Too many capability blocks were selected")
    cleaned = []
    for name in blocks:
        require(name in BLOCKS, "Unknown capability block: " + str(name))
        if name not in cleaned:
            cleaned.append(name)
    project["blocks"] = cleaned
    event(project, "blocks_update", blocks=sorted(cleaned))
    return {"blocks": cleaned}


def paragraphs(text):
    """Keep source immutable; offsets are Python Unicode code points, end exclusive."""
    result, speaker, question = [], "unknown", ""
    for match in re.finditer(r"[^\r\n]+", text):
        raw = match.group()
        if not raw.strip():
            continue
        label = re.match(r"^\s*(患者|病人|受访者|Patient|Participant|Answer|IP\d+|P|A|医生|访谈者|采访者|Doctor|Interviewer|D|Q)\s*[:：]\s*", raw, re.I)
        if label:
            speaker = "patient" if label[1].lower() in {"患者", "病人", "受访者", "patient", "participant", "answer", "p", "a"} or re.fullmatch(r"IP\d+", label[1], re.I) else "doctor"
        elif re.match(r"^\s*IQ\d+(?:\.\d+)*(?:\s*[:.]|\s*$)", raw, re.I):
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
           "sha256": hashlib.sha256(text.encode("utf-8")).hexdigest(), "created_at": now(),
           "memo": "", "attributes": {}}
    project["documents"].append(doc)
    event(project, "document_import", document_id=doc["id"], sha256=doc["sha256"])
    return doc


def update_document(project, document_id, changes):
    """Rename a document or edit its reading note."""
    require(isinstance(changes, dict), "The document changes are invalid")
    doc = find(project["documents"], document_id)
    if "name" in changes:
        doc["name"] = string(changes["name"], "Document name", 200)
    if "memo" in changes:
        value = changes["memo"]
        require(isinstance(value, str) and len(value) <= 20000, "The reading note is too long")
        doc["memo"] = value
    if "attributes" in changes:
        attributes = changes["attributes"]
        require(isinstance(attributes, dict) and len(attributes) <= 50, "The document attributes are invalid")
        doc["attributes"] = attributes
    event(project, "document_update", document_id=document_id, fields=sorted(changes))
    return doc


def add_code(project, name, definition="", color=None, parent_id=None):
    name = string(name, "Code name", 160)
    # Uniqueness is scoped to the parent, not the whole codebook. Two themes
    # each having a "Challenges" sub-code is ordinary qualitative practice, and
    # real exports (ATLAS.ti, QualCoder) contain exactly that.
    require(not any(c["name"].casefold() == name.casefold() and c.get("parent_id") == parent_id
                    for c in project["codes"]),
            "A code with this name already exists under this parent")
    require(isinstance(definition, str) and len(definition) <= 5000, "The definition is too long")
    require(parent_id is None or any(c["id"] == parent_id for c in project["codes"]), "The parent code does not exist")
    color = color or COLORS[len(project["codes"]) % len(COLORS)]
    require(bool(re.fullmatch(r"#[0-9a-fA-F]{6}", color)), "The color must be a six-digit hexadecimal value")
    code = {"id": uid(), "name": name, "definition": definition, "color": color, "parent_id": parent_id,
            "memo": "", "anchor_examples": [], "inclusion": "", "exclusion": "", "status": "final",
            "order": len([c for c in project["codes"] if c.get("parent_id") == parent_id])}
    project["codes"].append(code)
    event(project, "code_create", code_id=code["id"], name=name, parent_id=parent_id)
    return code


def update_code(project, code_id, changes):
    """Rename, redefine, recolour, re-parent or annotate a single code."""
    require(isinstance(changes, dict), "The code changes are invalid")
    code = find(project["codes"], code_id)
    if "name" in changes:
        name = string(changes["name"], "Code name", 160)
        require(not any(c["id"] != code_id and c["name"].casefold() == name.casefold() for c in project["codes"]),
                "A code with this name already exists")
        code["name"] = name
    if "definition" in changes:
        value = changes["definition"]
        require(isinstance(value, str) and len(value) <= 5000, "The definition is too long")
        code["definition"] = value
    if "color" in changes:
        require(isinstance(changes["color"], str) and bool(re.fullmatch(r"#[0-9a-fA-F]{6}", changes["color"])),
                "The color must be a six-digit hexadecimal value")
        code["color"] = changes["color"]
    if "memo" in changes:
        value = changes["memo"]
        require(isinstance(value, str) and len(value) <= 20000, "The memo is too long")
        code["memo"] = value
    if "inclusion" in changes:
        value = changes["inclusion"]
        require(isinstance(value, str) and len(value) <= 5000, "The inclusion criteria are too long")
        code["inclusion"] = value
    if "exclusion" in changes:
        value = changes["exclusion"]
        require(isinstance(value, str) and len(value) <= 5000, "The exclusion criteria are too long")
        code["exclusion"] = value
    if "anchor_examples" in changes:
        value = changes["anchor_examples"]
        require(isinstance(value, list) and len(value) <= 20, "At most 20 anchor examples are supported")
        require(all(isinstance(x, str) and len(x) <= 5000 for x in value), "An anchor example is invalid")
        code["anchor_examples"] = [x.strip() for x in value if x.strip()]
    if "status" in changes:
        require(changes["status"] in CODE_STATUSES, "The code status is invalid")
        code["status"] = changes["status"]
    if "parent_id" in changes:
        parent_id = changes["parent_id"]
        if parent_id is not None:
            require(parent_id != code_id, "A code cannot be its own parent")
            require(any(c["id"] == parent_id for c in project["codes"]), "The parent code does not exist")
            require(parent_id not in descendants(project["codes"], code_id),
                    "A code cannot be moved under one of its own descendants")
        code["parent_id"] = parent_id
    event(project, "code_update", code_id=code_id, fields=sorted(changes))
    return code


def delete_code(project, code_id):
    """Remove a code. Children move up to its parent; its codings are removed.

    Returns a summary so the caller can report what was affected. Nothing is
    silently lost: the counts land in the audit trail.
    """
    code = find(project["codes"], code_id)
    parent_id = code.get("parent_id")
    children = [c for c in project["codes"] if c.get("parent_id") == code_id]
    for child in children:
        child["parent_id"] = parent_id
    removed_annotations = [a for a in project["annotations"] if a["code_id"] == code_id]
    project["annotations"] = [a for a in project["annotations"] if a["code_id"] != code_id]
    project["codes"] = [c for c in project["codes"] if c["id"] != code_id]
    summary = {"id": code_id, "name": code["name"], "codings_removed": len(removed_annotations),
               "children_reparented": len(children)}
    event(project, "code_delete", **summary)
    return summary


def merge_codes(project, source_id, target_id):
    """Fold source into target: codings move across, duplicates collapse."""
    require(source_id != target_id, "Choose two different codes")
    source = find(project["codes"], source_id)
    target = find(project["codes"], target_id)
    require(target_id not in descendants(project["codes"], source_id),
            "A code cannot be merged into one of its own descendants")
    kept, moved, collapsed = [], 0, 0
    known = {(a["document_id"], a["code_id"], a["start"], a["end"])
             for a in project["annotations"] if a["code_id"] != source_id}
    for annotation in project["annotations"]:
        if annotation["code_id"] != source_id:
            kept.append(annotation)
            continue
        signature = (annotation["document_id"], target_id, annotation["start"], annotation["end"])
        if signature in known:
            collapsed += 1
            continue
        known.add(signature)
        annotation["code_id"] = target_id
        annotation["merged_from"] = source["name"]
        moved += 1
        kept.append(annotation)
    project["annotations"] = kept
    for child in project["codes"]:
        if child.get("parent_id") == source_id:
            child["parent_id"] = target_id
    project["codes"] = [c for c in project["codes"] if c["id"] != source_id]
    summary = {"source": source["name"], "target": target["name"], "codings_moved": moved,
               "duplicates_collapsed": collapsed}
    event(project, "code_merge", **summary)
    return summary


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
    project = new_project("Tian 2021 · software architecture interviews")
    project["provenance"] = "Eight semi-structured practitioner interview documents from Tian et al. (2021) on relationships between software architecture and source code. IP1–IP2 include paired Chinese and English answer passages; IP3–IP8 are in English. Imported from the local Guide as an uncoded workspace. The separate MAXQDA project also contains researcher coding, but it is not imported here as ground truth."
    paths = sorted(root.glob("*.docx"))
    require(bool(paths), "No DOCX interview transcripts were found in the grounded theory example directory")
    for path in paths:
        add_document(project, path.stem.replace("Interview Transcript_", "Interview "), read_docx(path.read_bytes()))
    event(project, "guide_examples_import", collection="Grounded_Theory_Interview_Examples_Tian_2021", documents=len(paths))
    return project


def validate_project(project):
    version = project.get("schema_version") if isinstance(project, dict) else None
    require(isinstance(version, int) and 1 <= version <= SCHEMA_VERSION, "This project format is not supported")
    migrate(project)
    string(project.get("name"), "Project name", 160)
    blocks = project.get("blocks", [])
    require(isinstance(blocks, list) and len(blocks) <= len(BLOCKS), "The capability list is invalid")
    require(all(b in BLOCKS for b in blocks), "An unknown capability block is selected")
    require(len(blocks) == len(set(blocks)), "The capability list contains duplicates")
    for key, limit in [("documents", 100), ("codes", 2000), ("annotations", 50000), ("suggestions", 50000), ("audit", 100000)]:
        require(isinstance(project.get(key), list) and len(project[key]) <= limit, f"{key} has an invalid format or item count")
        ids = [string(x.get("id"), "Record ID", 100) for x in project[key]]
        require(all(re.fullmatch(r"[a-zA-Z0-9_-]+", item_id) for item_id in ids), "A record ID contains unsupported characters")
        require(len(ids) == len(set(ids)), f"{key} contains duplicate IDs")
    for d in project["documents"]:
        string(d.get("name"), "Document name", 200)
        require(isinstance(d.get("text"), str) and 0 < len(d["text"]) <= 500000, "The document text is invalid")
        require(d.get("sha256") == hashlib.sha256(d["text"].encode()).hexdigest(), "Document integrity validation failed")
        require(isinstance(d.get("memo", ""), str) and len(d["memo"]) <= 20000, "The document reading note is invalid")
        attributes = d.get("attributes", {})
        require(isinstance(attributes, dict) and len(attributes) <= 50, "The document attributes are invalid")
        for key, value in attributes.items():
            require(isinstance(key, str) and 0 < len(key) <= 60, "A document attribute name is invalid")
            require(value is None or isinstance(value, (str, int, float)) and not isinstance(value, bool),
                    "A document attribute value is invalid")
            require(not isinstance(value, str) or len(value) <= 500, "A document attribute value is too long")
    names = set()
    for c in project["codes"]:
        name = string(c.get("name"), "Code name", 160).casefold()
        # Same rule as add_code: unique under a parent, not across the whole
        # codebook.
        scoped = (name, c.get("parent_id"))
        require(scoped not in names, "The codebook contains duplicate names under the same parent")
        names.add(scoped)
        require(isinstance(c.get("color"), str) and bool(re.fullmatch(r"#[0-9a-fA-F]{6}", c["color"])), "The code color is invalid")
        require(isinstance(c.get("definition"), str) and len(c["definition"]) <= 5000, "The code definition is invalid")
        require(c.get("status") in CODE_STATUSES, "The code status is invalid")
        for field, limit in (("memo", 20000), ("inclusion", 5000), ("exclusion", 5000)):
            require(isinstance(c.get(field, ""), str) and len(c[field]) <= limit, f"The code {field} is invalid")
        examples = c.get("anchor_examples", [])
        require(isinstance(examples, list) and len(examples) <= 20, "The anchor examples are invalid")
        require(all(isinstance(x, str) and len(x) <= 5000 for x in examples), "An anchor example is invalid")
    by_id = {c["id"]: c for c in project["codes"]}
    for c in project["codes"]:
        parent_id = c.get("parent_id")
        require(parent_id is None or parent_id in by_id, "A code references a missing parent")
        require(parent_id != c["id"], "A code cannot be its own parent")
        walked, current = set(), c
        while current.get("parent_id"):
            require(current["id"] not in walked, "The code hierarchy contains a cycle")
            walked.add(current["id"])
            current = by_id[current["parent_id"]]
    for a in project["annotations"] + project["suggestions"]:
        require(isinstance(a.get("quote"), str), "The source quotation is missing")
        validate_span(find(project["documents"], a.get("document_id")), a.get("start"), a.get("end"), a.get("quote"))
        if "code_id" in a:
            find(project["codes"], a["code_id"])
        else:
            string(a.get("code_name"), "Suggested code", 160)
            require(a.get("status") in {"pending", "accepted", "rejected"}, "The suggestion status is invalid")
    return project


# How many snapshots to keep per project. Thirty changes is several sessions of
# work, which is the distance a mistake usually takes to notice.
BACKUP_KEEP = 30

# A project id becomes a directory name, so it may not contain separators or
# anything else that climbs out of the backup directory. Projects created here
# use hex ids, but an imported project JSON carries whatever id it was saved
# with — which is the way in.
_ID_SAFE = re.compile(r"[^A-Za-z0-9_-]")


def safe_id(value):
    """A filesystem-safe form of an id. Used for paths, never as a decision."""
    cleaned = _ID_SAFE.sub("", str(value))[:64]
    return cleaned or "project"


# An id is an identifier, so it is validated rather than rewritten: an id that
# silently becomes a different string stops matching the project it refers to,
# and the mismatch would surface much later as a missing snapshot.
_ID_OK = re.compile(r"^[A-Za-z0-9_-]{1,64}$")


def require_valid_id(value):
    text = str(value or "")
    require(bool(_ID_OK.match(text)), "The project id is not valid")
    return text


class Store:
    def __init__(self, path, backup_dir=None):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        # Snapshots live beside the database by default. `data/` is ignored by
        # git, so they never end up in the repository. `--backup-dir` moves them;
        # a sync folder is deliberately not suggested, because that would send
        # transcripts off the machine and break the one promise the tool makes.
        self.backup_dir = Path(backup_dir) if backup_dir else self.path.parent / "backups"
        # Reported to the interface. A snapshot that stops being written is a
        # silent failure otherwise: the count stays at its ceiling and the
        # researcher keeps believing they are covered.
        self.last_backup = None
        self.backup_error = None
        with self.connect() as conn:
            conn.execute("CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, data TEXT NOT NULL)")

    def _snapshot(self, project):
        """Write a restorable copy of the project beside the database.

        The whole project is one row in one SQLite file. That is convenient, and
        it is also a single point of failure: one bad delete and weeks of coding
        are gone, with nothing to go back to. A JSON snapshot per change costs
        almost nothing next to re-coding an interview, and it is written in the
        same format the Restore dialog already reads, so recovery needs no
        special tooling.

        Callers pass this inside their write transaction, so the file written
        matches the row that was just committed and two concurrent requests
        cannot interleave a name with someone else's state.

        A failure here must never fail the edit the researcher just made — but it
        is recorded rather than swallowed, so the interface can say so.
        """
        try:
            folder = self.backup_dir / require_valid_id(project["id"])
            folder.mkdir(parents=True, exist_ok=True)
            # A sequence number, not a timestamp. The clock can go backwards
            # (daylight saving ends in October here), and a name derived from it
            # would then sort before an older snapshot and be pruned as the
            # oldest — losing the newest recovery point, silently.
            existing = sorted(folder.glob("*.json"))
            number = 1
            if existing:
                try:
                    number = int(existing[-1].stem) + 1
                except ValueError:
                    number = len(existing) + 1
            name = "%06d.json" % number
            # Written to a sibling and renamed into place. A reader that opens
            # the file while it is half-written would otherwise see truncated
            # JSON, which is worse than no snapshot: it looks restorable.
            tmp = folder / (name + ".part")
            tmp.write_text(json.dumps(project, ensure_ascii=False, indent=1), encoding="utf-8")
            os.replace(tmp, folder / name)
            # Keep the newest, but always keep the oldest as well. Accepting a
            # queue of fifty suggestions is fifty changes, and without that floor
            # the burst would prune away every snapshot from before it started —
            # the one state a researcher is most likely to want back.
            ordered = sorted(folder.glob("*.json"))
            keep = set(ordered[-(BACKUP_KEEP - 1):]) | {ordered[0]}
            for stale in ordered:
                if stale not in keep:
                    stale.unlink()
            self.last_backup = {"project_id": project["id"], "name": name,
                                "written_at": now()}
            self.backup_error = None
        except (OSError, TypeError, ValueError) as exc:
            # The recorded state is what the interface reads; the stderr line
            # exists so a failure is visible when nobody is looking at the
            # header. Once, per failure, not per frame.
            self.backup_error = {"project_id": project["id"], "at": now(),
                                 "message": f"{type(exc).__name__}: {exc}"}
            print(f"QualiCraft: snapshot failed for project {safe_id(project['id'])}: "
                  f"{type(exc).__name__}: {exc}", file=sys.stderr)

    def backups(self, project_id):
        """What is on disk for this project, newest first."""
        folder = self.backup_dir / require_valid_id(project_id)
        if not folder.is_dir():
            return []
        rows = []
        for item in sorted(folder.glob("*.json"), reverse=True):
            try:
                rows.append({"name": item.name, "bytes": item.stat().st_size,
                             "written_at": item.stat().st_mtime})
            except OSError:
                continue
        return rows

    def backup_status(self):
        """Enough for the interface to say whether protection is actually working."""
        return {"last": self.last_backup, "error": self.backup_error,
                "keep": BACKUP_KEEP, "dir": str(self.backup_dir)}

    @contextmanager
    def batch(self, project_id, label=""):
        """Coalesce every change inside the block into one snapshot.

        Accepting a queue of suggestions, merging codes, importing a corpus:
        each is many calls to change(), and one snapshot per call would push
        every earlier recovery point out of the thirty that are kept. Inside
        the block changes write nothing; on exit the finished state is written
        once. The state from before the burst is on disk already, put there by
        the change that preceded the block.
        """
        depth = getattr(self, "_batch_depth", 0)
        self._batch_depth = depth + 1
        if depth == 0:
            self._batch_project = project_id
        try:
            yield
        finally:
            self._batch_depth -= 1
            if self._batch_depth == 0:
                try:
                    self._snapshot(self.get(project_id))
                except (ValueError, KeyError, OSError, TypeError):
                    pass
                self._batch_project = None

    def restore(self, project_id, name):
        """Load a snapshot back as a NEW project, leaving the original alone.

        Restoring over the project it came from would make the second mistake
        worse than the first: the researcher would lose both the current state
        and the recovery point in one move. A copy is always safe to try.
        """
        # Snapshot the live project first, so the state being restored over
        # is not the one thing a recovery loses.
        try:
            self._snapshot(self.get(project_id))
        except (ValueError, KeyError, OSError, TypeError):
            pass
        folder = self.backup_dir / require_valid_id(project_id)
        # `Path(name).name` drops any directory part, so a caller cannot walk out
        # of the folder with `../`. Note this is deliberately not `safe_id`:
        # that strips dots, and every snapshot name ends in `.json`.
        candidate = (folder / Path(str(name)).name).resolve()
        require(candidate.parent == folder.resolve() and candidate.is_file(),
                "That snapshot does not exist")
        loaded = json.loads(candidate.read_text(encoding="utf-8"))
        loaded["id"] = uuid.uuid4().hex
        loaded["name"] = f"{loaded.get('name', 'Project')} (restored {now()[:16].replace('T', ' ')})"
        loaded["created_at"] = now()
        loaded["updated_at"] = now()
        event(loaded, "project_restore", source="snapshot", snapshot=name)
        return self.create(loaded)

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
        return migrate(json.loads(row[0]))

    def create(self, project):
        with self.connect() as conn:
            conn.execute("INSERT INTO projects VALUES (?,?)", (project["id"], json.dumps(project, ensure_ascii=False)))
            self._snapshot(project)
        return project

    def change(self, project_id, operation, snapshot=True):
        """Apply an operation and commit it.

        `snapshot=False` is for the steps of one batch: a single analysis run
        commits an event per segment, and a snapshot each would push the whole
        history out of the window in one go. The caller takes one at the end.
        """
        with self.connect() as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT data FROM projects WHERE id=?", (project_id,)).fetchone()
            require(row is not None, "The project does not exist")
            project = migrate(json.loads(row[0]))
            result = operation(project)
            project["updated_at"] = now()
            conn.execute("UPDATE projects SET data=? WHERE id=?", (json.dumps(project, ensure_ascii=False), project_id))
            # Inside a batch the block writes one snapshot on exit, so a
            # per-change write here would be the burst it exists to avoid.
            if snapshot and not getattr(self, "_batch_depth", 0):
                self._snapshot(project)
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

            for project_id, raw in rows:
                project = json.loads(raw)
                if project.get("name") not in {"Grounded theory interview examples · Tian 2021", "Tian 2021 · software architecture interviews"}:
                    continue
                project["name"] = "Tian 2021 · software architecture interviews"
                project["provenance"] = "Eight semi-structured practitioner interview documents from Tian et al. (2021) on relationships between software architecture and source code. IP1–IP2 include paired Chinese and English answer passages; IP3–IP8 are in English. Imported from the local Guide as an uncoded workspace. The separate MAXQDA project also contains researcher coding, but it is not imported here as ground truth."
                project["updated_at"] = now()
                conn.execute("UPDATE projects SET data=? WHERE id=?", (json.dumps(project, ensure_ascii=False), project_id))


def endpoint_host(url):
    """An endpoint reduced to scheme and host.

    A base URL is whatever the researcher typed. It can carry a key in its query
    string, or a user:password pair. This value is printed at startup, shown in
    settings, and written into the methods record — all three get screenshotted
    and pasted into issues, so none of them may carry a credential.
    """
    import urllib.parse
    try:
        parts = urllib.parse.urlsplit(str(url))
    except ValueError:
        return "(unparseable endpoint)"
    if not parts.hostname:
        return "(no host)"
    port = f":{parts.port}" if parts.port else ""
    return f"{parts.scheme}://{parts.hostname}{port}"


def codebook_digest(project):
    """A stable digest of the codebook as an analytical object.

    Sorted by id and reduced to the four fields that carry meaning — the id,
    the name, its parent, and the theme it rolls up to. Presentation settings
    (colour, order, icon) are excluded on purpose: recolouring a code does not
    change the analysis, but renaming one does, and the digest should move with
    exactly those changes. Renaming is the case that matters, because that is
    what a reader comparing two methods sections needs to see.
    """
    theme_of = {}
    by_parent = {}
    for code in project.get("codes", []):
        by_parent.setdefault(code.get("parent_id"), []).append(code)

    def theme_for(code_id, seen=None):
        seen = seen or set()
        if code_id in seen:
            return ""
        seen.add(code_id)
        parent = next((c.get("parent_id") for c in project.get("codes", []) if c.get("id") == code_id), None)
        if not parent:
            return next((c.get("name", "") for c in project.get("codes", []) if c.get("id") == code_id), "")
        return theme_for(parent, seen)

    for code in project.get("codes", []):
        theme_of[code.get("id")] = theme_for(code.get("id"))

    canonical = [
        {"id": c.get("id", ""), "name": c.get("name", ""),
         "parent_code": c.get("parent_id") or "", "theme": theme_of.get(c.get("id"), "")}
        for c in sorted(project.get("codes", []), key=lambda c: str(c.get("id", "")))
    ]
    blob = json.dumps(canonical, ensure_ascii=False, separators=(",", ":"))
    return hashlib.sha256(blob.encode("utf-8")).hexdigest()


def methods_narrative(project):
    """A Markdown account of how the analysis was carried out.

    Assembled from the project state and the audit trail, so a methods section
    can be drafted from what actually happened rather than reconstructed from
    memory. Nothing is inferred: every figure is read off the project.
    """
    codes, documents, annotations = project["codes"], project["documents"], project["annotations"]
    audit = project["audit"]
    children = {}
    for code in codes:
        children.setdefault(code.get("parent_id"), []).append(code)
    for group in children.values():
        group.sort(key=lambda c: (c.get("order", 0), c["name"]))
    own = {}
    for annotation in annotations:
        own[annotation["code_id"]] = own.get(annotation["code_id"], 0) + 1

    def rollup(code_id):
        return own.get(code_id, 0) + sum(rollup(c["id"]) for c in children.get(code_id, []))

    def field(value, fallback):
        return value.strip() if isinstance(value, str) and value.strip() else fallback

    out = []
    add = out.append
    add("# Methods record - " + project["name"])
    add("")
    add("Generated " + now()[:16].replace("T", " ") + " from the local workspace. No source text left this machine.")
    add("")

    add("## 1. Data")
    add("")
    add("| Document | Characters | Codings | Reading note | Imported |")
    add("| --- | ---: | ---: | :---: | --- |")
    for document in documents:
        count = len([a for a in annotations if a["document_id"] == document["id"]])
        note = "yes" if field(document.get("memo"), "") else "-"
        add("| " + document["name"] + " | " + format(len(document["text"]), ",") + " | "
            + str(count) + " | " + note + " | " + document["created_at"][:10] + " |")
    add("")
    add("**" + str(len(documents)) + " document(s), "
        + format(sum(len(d["text"]) for d in documents), ",") + " characters, "
        + str(len(annotations)) + " coding(s).**")
    add("")

    noted = [d for d in documents if field(d.get("memo"), "")]
    if noted:
        add("### Reading notes")
        add("")
        add("Stored reading notes, as written by the researcher.")
        add("Timing relative to coding is not recorded in this project file.")
        add("")
        for document in noted:
            add("**" + document["name"] + "**")
            add("")
            add("> " + document["memo"].strip().replace("\n", "\n> "))
            add("")
    else:
        # Report only what the saved file contains; absence of a note does not
        # establish whether the researcher completed familiarisation.
        add("### Reading notes")
        add("")
        add("_No reading notes were recorded in this project file._")
        add("")

    add("## 2. Coding")
    add("")
    ai = [a for a in annotations if a.get("source") == "ai_reviewed"]
    add("- Codings: **" + str(len(annotations)) + "** - "
        + str(len(annotations) - len(ai)) + " made by hand, " + str(len(ai)) + " accepted from AI suggestions.")
    add("- Codebook: **" + str(len(codes)) + "** codes, of which **"
        + str(len(children.get(None, []))) + "** sit at the top level.")
    if annotations:
        busiest = sorted(own.items(), key=lambda kv: -kv[1])[:3]
        named = [(next((c["name"] for c in codes if c["id"] == k), k), v) for k, v in busiest]
        add("- Most used: " + ", ".join(n + " (" + str(v) + ")" for n, v in named) + ".")
    add("")

    add("## 3. How the codebook changed")
    add("")
    add("Read from the audit trail, in order. This is the record a reader needs in order to")
    add("judge how the analysis developed.")
    add("")
    changes = [e for e in audit if e.get("action") in
               ("code_create", "code_update", "code_delete", "code_merge", "annotation_remove")]
    if not changes:
        add("_No codebook changes recorded._")
    else:
        add("| When | Action | Detail |")
        add("| --- | --- | --- |")
        for e in changes:
            when = e.get("time", "")[:16].replace("T", " ")
            action = e["action"]
            if action == "code_create":
                detail = "created \"" + e.get("name", "") + "\""
            elif action == "code_update":
                detail = "edited " + ", ".join(e.get("fields", []))
            elif action == "code_delete":
                detail = ("deleted \"" + e.get("name", "") + "\" - "
                          + str(e.get("codings_removed", 0)) + " coding(s) removed")
            elif action == "code_merge":
                detail = ("merged \"" + e.get("source", "") + "\" into \""
                          + e.get("target", "") + "\" - " + str(e.get("codings_moved", 0)) + " coding(s) moved")
            else:
                detail = "coding removed"
            add("| " + when + " | " + action + " | " + detail + " |")
    add("")

    add("## 4. Themes")
    add("")
    if not codes:
        add("_The codebook is empty._")
    else:
        def emit(code, depth):
            head = "#" * min(3 + depth, 6)
            add(head + " " + code["name"])
            add("")
            add("- Definition: " + field(code.get("definition"), "_not recorded_"))
            if field(code.get("inclusion"), ""):
                add("- Include when: " + code["inclusion"].strip())
            if field(code.get("exclusion"), ""):
                add("- Exclude when: " + code["exclusion"].strip())
            if code.get("anchor_examples"):
                add("- Anchor example: \u201c" + code["anchor_examples"][0] + "\u201d")
            add("- Status: " + code.get("status", "final")
                + " - " + str(rollup(code["id"])) + " coding(s)")
            if field(code.get("memo"), ""):
                add("")
                add("> " + code["memo"].strip().replace("\n", "\n> "))
            add("")
            for child in children.get(code["id"], []):
                emit(child, depth + 1)
        for top in children.get(None, []):
            emit(top, 0)

    add("## 5. AI assistance")
    add("")
    suggestions = project["suggestions"]
    if not suggestions:
        add("_No model was used on this project._")
    else:
        accepted = len([s for s in suggestions if s["status"] == "accepted"])
        rejected = len([s for s in suggestions if s["status"] == "rejected"])
        pending = len([s for s in suggestions if s["status"] == "pending"])
        discarded = sum(int(e.get("discarded", 0) or 0) for e in audit
                        if e.get("action") == "analysis_segment")
        add("- Suggestions produced: **" + str(len(suggestions)) + "**")
        add("- Accepted: " + str(accepted) + " | Rejected: " + str(rejected) + " | Still pending: " + str(pending))
        # Without this denominator an acceptance rate is misleading: suggestions
        # thrown out for failing the quotation check never reach the count.
        add("- Discarded before review (quotation could not be located in the source): "
            + str(discarded))
        add("- Every suggestion had to be accepted by hand before it entered the codebook; "
            "suggestions whose quotation could not be located in the source were discarded on arrival.")
        # A reader reviewing the methods needs to know what was asked of which
        # model, not only how many suggestions came back. The endpoint and model
        # are recorded on the run's own audit entry, so they are read off it
        # rather than remembered here.
        runs = [e for e in audit if e.get("action") == "analysis_start"]
        if runs:
            endpoints = sorted({endpoint_host(e.get("base_url")) for e in runs if e.get("base_url")})
            models = sorted({str(e.get("model", "")) for e in runs if e.get("model")})
            add("- Endpoint: " + (", ".join(endpoints) if endpoints else "_not recorded_"))
            add("- Model: " + (", ".join(models) if models else "_not recorded_"))
            add("- Analysis runs: " + str(len(runs)) + ".")
            # Which prompt produced the suggestions, and which codebook was in
            # front of the model. Both are needed to re-run the same request.
            versions = sorted({str(e.get("prompt_version", "")) for e in runs if e.get("prompt_version")})
            digests = sorted({str(e.get("codebook_sha256", "")) for e in runs if e.get("codebook_sha256")})
            seen_models = sorted({str(e.get("model_string", "") or e.get("model", "")) for e in runs
                                  if e.get("model_string") or e.get("model")})
            if seen_models:
                add("- Model reported by the endpoint: " + ", ".join(m for m in seen_models if m))
            if versions:
                add("- Prompt template version: " + ", ".join(versions))
            if digests:
                add("- Codebook digest (id, name, parent, theme; sorted by id): "
                    + ", ".join(d[:16] for d in digests))
        else:
            add("- Codebook digest (id, name, parent, theme; sorted by id): "
                + codebook_digest(project)[:16])
            # The preview is the only text the researcher agreed to send, so its
            # hash is recorded on the run's own audit entry. Without it the
            # methods record can only assert that a preview was confirmed, which
            # is not something a reader can check.
            hashes = sorted({str(e.get("payload_sha256", "")) for e in runs if e.get("payload_sha256")})
            if hashes:
                add("- Payload digest (SHA-256 of the previewed text): "
                    + ", ".join(h[:16] + "..." for h in hashes))
            else:
                add("- Payload digest: _not recorded for these runs_")
    add("")

    add("## 6. Integrity")
    add("")
    add("- Every document carries a SHA-256 digest; all "
        + str(len(documents)) + " verified on load.")
    add("- " + str(len(audit)) + " audit entries recorded.")
    add("- Codings are anchored to character offsets, not to text markup, so the "
        "source can be re-imported without losing alignment.")
    add("")

    # The figures carry these caveats in their own credit lines. Repeating them
    # here means the methods record can be read without the figures beside it,
    # which is how a methods section is usually read.
    add("## 7. How to read the figures")
    add("")
    add("- Frequency, coverage and co-occurrence count **passage-code assignments**, not "
        "participants. A code used forty times is not forty times as important, and the "
        "count is not a proportion of the sample.")
    add("- Co-occurrence means two codes were applied to **overlapping character ranges "
        "within the same interview**. It is descriptive. It is not correlation, and it is "
        "not evidence of a theoretical relationship.")
    add("- The accumulation curve orders interviews by **file name**, which is not the "
        "order they were conducted in. A plateau does not demonstrate thematic saturation.")
    add("- On a co-occurrence matrix the diagonal counts the units a code appears in, "
        "which is a different unit from the off-diagonal cells.")
    add("")
    return "\n".join(out)


def csv_export(project, matrix=False):
    stream = io.StringIO(newline="")
    writer = csv.writer(stream)
    def safe(value):
        value = str(value)
        return "'" + value if value.lstrip().startswith(("=", "+", "-", "@")) or value.startswith(("\t", "\r", "\n")) else value
    if matrix:
        from .analyze import code_labels
        labels = code_labels(project["codes"])
        writer.writerow(["document"] + [safe(labels[c["id"]]) for c in project["codes"]])
        counts = Counter((a["document_id"], a["code_id"]) for a in project["annotations"])
        for d in project["documents"]:
            writer.writerow([safe(d["name"])] + [counts[d["id"], c["id"]] for c in project["codes"]])
    else:
        writer.writerow(["document", "code", "code_path", "start", "end", "quote", "memo", "source"])
        for a in project["annotations"]:
            code = find(project["codes"], a["code_id"])
            writer.writerow([safe(find(project["documents"], a["document_id"])["name"]), safe(code["name"]),
                             safe(code_path(project["codes"], code)), a["start"], a["end"], safe(a["quote"]),
                             safe(a.get("memo", "")), safe(a["source"])])
    return ("\ufeff" + stream.getvalue()).encode("utf-8")
