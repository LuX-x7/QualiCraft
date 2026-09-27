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
    require(isinstance(value, str) and bool(value.strip()) and len(value) <= limit, f"{label}不能为空，且须少于 {limit} 字符")
    return value.strip()


def find(items, item_id):
    item = next((x for x in items if x["id"] == item_id), None)
    require(item is not None, "找不到指定的记录")
    return item


def event(project, action, **details):
    project["audit"].append({"id": uid(), "time": now(), "action": action, **details})


def new_project(name):
    return {"schema_version": 1, "id": uid(), "name": string(name, "项目名", 160),
            "created_at": now(), "updated_at": now(), "documents": [], "codes": [],
            "annotations": [], "suggestions": [], "audit": [], "provenance": ""}


def paragraphs(text):
    """Keep source immutable; offsets are Python Unicode code points, end exclusive."""
    result, speaker, question = [], "unknown", ""
    for match in re.finditer(r"[^\r\n]+", text):
        raw = match.group()
        if not raw.strip():
            continue
        label = re.match(r"^\s*(患者|病人|受访者|Patient|Participant|P|A|医生|访谈者|采访者|Doctor|Interviewer|D|Q)\s*[:：]\s*", raw, re.I)
        if label:
            speaker = "patient" if label[1].lower() in {"患者", "病人", "受访者", "patient", "participant", "p", "a"} else "doctor"
        if speaker == "doctor":
            question = raw
        result.append({"index": len(result), "start": match.start(), "end": match.end(),
                       "text": raw, "speaker": speaker, "context": question if speaker == "patient" else ""})
    return result


def add_document(project, name, text):
    require(isinstance(text, str) and text.strip() and len(text) <= 500_000, "文本为空或超过 50 万字符")
    require(len(project["documents"]) < 100, "第一版每个项目最多 100 篇文档")
    doc = {"id": uid(), "name": string(name, "文档名", 200), "text": text,
           "sha256": hashlib.sha256(text.encode("utf-8")).hexdigest(), "created_at": now()}
    project["documents"].append(doc)
    event(project, "document_import", document_id=doc["id"], sha256=doc["sha256"])
    return doc


def add_code(project, name, definition="", color=None):
    name = string(name, "代码名", 160)
    require(not any(c["name"].casefold() == name.casefold() for c in project["codes"]), "已存在同名代码")
    require(isinstance(definition, str) and len(definition) <= 5000, "定义过长")
    color = color or COLORS[len(project["codes"]) % len(COLORS)]
    require(bool(re.fullmatch(r"#[0-9a-fA-F]{6}", color)), "颜色必须为十六进制色值")
    code = {"id": uid(), "name": name, "definition": definition, "color": color}
    project["codes"].append(code)
    event(project, "code_create", code_id=code["id"], name=name)
    return code


def validate_span(doc, start, end, quote=None):
    require(type(start) is int and type(end) is int and 0 <= start < end <= len(doc["text"]), "引文字符范围无效")
    require(quote is None or doc["text"][start:end] == quote, "引文与原文不一致")
    return doc["text"][start:end]


def annotate(project, document_id, code_id, start, end, memo="", source="manual", suggestion_id=None):
    doc = find(project["documents"], document_id)
    find(project["codes"], code_id)
    quote = validate_span(doc, start, end)
    require(isinstance(memo, str) and len(memo) <= 5000, "备忘录过长")
    require(not any(a["document_id"] == document_id and a["code_id"] == code_id and a["start"] == start and a["end"] == end for a in project["annotations"]), "这个片段已经使用了该代码")
    ann = {"id": uid(), "document_id": document_id, "code_id": code_id, "start": start, "end": end,
           "quote": quote, "memo": memo, "source": source, "suggestion_id": suggestion_id, "created_at": now()}
    project["annotations"].append(ann)
    event(project, "annotation_create", annotation_id=ann["id"], source=source, suggestion_id=suggestion_id)
    return ann


def review(project, suggestion_id, action):
    suggestion = find(project["suggestions"], suggestion_id)
    require(suggestion["status"] == "pending", "该建议已审核")
    require(action in {"accept", "reject"}, "审核操作无效")
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
    require(len(data) <= 8_000_000, "DOCX 超过 8 MB")
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        info = archive.getinfo("word/document.xml")
        require(info.file_size <= 12_000_000, "DOCX 解压后过大")
        xml = archive.read(info)
    require(b"<!DOCTYPE" not in xml and b"<!ENTITY" not in xml, "不支持含实体声明的文档")
    root = ET.fromstring(xml)
    ns = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    lines = []
    for p in root.iter(ns + "p"):
        lines.append("".join(n.text or "" if n.tag == ns + "t" else "\t" if n.tag == ns + "tab" else "\n" if n.tag in {ns + "br", ns + "cr"} else "" for n in p.iter()))
    return "\n".join(lines)


def synthetic_project():
    project = new_project("医患沟通 · 合成演示")
    project["provenance"] = "完全虚构的医患沟通文本，仅用于功能演示，不含真实患者数据。演示建议由固定样例生成，不是模型输出。"
    doc = add_document(project, "P01 · 复诊体验（虚构）", "医生：这次复诊，您觉得哪些地方对您有帮助？\n患者：医生愿意等我把问题说完，还画了一张图解释治疗方案。我觉得自己被认真对待了。\n\n医生：回家以后，您对用药安排清楚吗？\n患者：当时听懂了，可回家后又不确定两种药应该怎么分开吃。如果能有一张简单的说明就好了。\n\n医生：您还有其他顾虑吗？\n患者：来医院要换两次车，每次请假也不方便。我希望有些复诊可以通过视频完成。\n\n医生：您愿意一起讨论下一步的安排吗？\n患者：愿意。我想先说说自己的生活安排，再和医生一起选一个能坚持的方案。")
    codes = [add_code(project, n, d) for n, d in [("被倾听与尊重", "患者描述被倾听、理解或尊重的经历。"), ("信息理解障碍", "患者对说明或执行安排存在不确定。"), ("就医可及性", "时间、交通等影响就医的条件。"), ("共同决策", "患者希望参与方案选择和安排。")]]
    quote = "医生愿意等我把问题说完，还画了一张图解释治疗方案。我觉得自己被认真对待了。"
    start = doc["text"].index(quote)
    annotate(project, doc["id"], codes[0]["id"], start, start + len(quote), "留意具体的沟通行为，而非只归为满意度。")
    for quote, code, reason in [("可回家后又不确定两种药应该怎么分开吃", codes[1], "说明在离院后难以准确回忆。"), ("来医院要换两次车，每次请假也不方便", codes[2], "交通和请假构成就医负担。")]:
        start = doc["text"].index(quote)
        project["suggestions"].append({"id": uid(), "document_id": doc["id"], "start": start, "end": start + len(quote), "quote": quote, "code_name": code["name"], "definition": code["definition"], "rationale": reason, "status": "pending", "source": "synthetic_demo", "created_at": now()})
    return project


def benchmark_project(guide, reference=False):
    root = Path(guide) / "Paired_Qualitative_Transcripts_TU_Delft"
    require(root.is_dir(), "未找到 TU Delft 数据，请设置 QUALICRAFT_GUIDE")
    project = new_project("TU Delft · " + ("人工参考编码" if reference else "盲测工作副本"))
    project["provenance"] = "Thijmen van Gend & Anneke Zuiderwijk (2022), DOI:10.4121/19635147.v1, CC BY 4.0。编码属于原研究作者，是解释性参考，不是唯一正确答案。"
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


def validate_project(project):
    require(isinstance(project, dict) and project.get("schema_version") == 1, "不支持的项目格式")
    string(project.get("name"), "项目名", 160)
    for key, limit in [("documents", 100), ("codes", 2000), ("annotations", 50000), ("suggestions", 50000), ("audit", 100000)]:
        require(isinstance(project.get(key), list) and len(project[key]) <= limit, f"{key} 格式或数量无效")
        ids = [string(x.get("id"), "记录 ID", 100) for x in project[key]]
        require(all(re.fullmatch(r"[a-zA-Z0-9_-]+", item_id) for item_id in ids), "记录 ID 含不支持的字符")
        require(len(ids) == len(set(ids)), f"{key} 存在重复 ID")
    for d in project["documents"]:
        string(d.get("name"), "文档名", 200)
        require(isinstance(d.get("text"), str) and 0 < len(d["text"]) <= 500000, "文档文本无效")
        require(d.get("sha256") == hashlib.sha256(d["text"].encode()).hexdigest(), "文档校验失败")
    names = set()
    for c in project["codes"]:
        name = string(c.get("name"), "代码名", 160).casefold()
        require(name not in names, "码表存在重复名称")
        names.add(name)
        require(isinstance(c.get("color"), str) and bool(re.fullmatch(r"#[0-9a-fA-F]{6}", c["color"])), "无效的代码颜色")
        require(isinstance(c.get("definition"), str) and len(c["definition"]) <= 5000, "代码定义无效")
    for a in project["annotations"] + project["suggestions"]:
        require(isinstance(a.get("quote"), str), "缺少原文引文")
        validate_span(find(project["documents"], a.get("document_id")), a.get("start"), a.get("end"), a.get("quote"))
        if "code_id" in a:
            find(project["codes"], a["code_id"])
        else:
            string(a.get("code_name"), "建议代码", 160)
            require(a.get("status") in {"pending", "accepted", "rejected"}, "建议状态无效")
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
        require(row is not None, "项目不存在")
        return json.loads(row[0])

    def create(self, project):
        with self.connect() as conn:
            conn.execute("INSERT INTO projects VALUES (?,?)", (project["id"], json.dumps(project, ensure_ascii=False)))
        return project

    def change(self, project_id, operation):
        with self.connect() as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT data FROM projects WHERE id=?", (project_id,)).fetchone()
            require(row is not None, "项目不存在")
            project = json.loads(row[0])
            result = operation(project)
            project["updated_at"] = now()
            conn.execute("UPDATE projects SET data=? WHERE id=?", (json.dumps(project, ensure_ascii=False), project_id))
        return result


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
