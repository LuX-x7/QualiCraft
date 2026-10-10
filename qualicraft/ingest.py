"""Importers for other tools' coding exports.

Every exporter names its columns differently, so each importer here is a thin
adapter: read the table, work out the column roles, and hand a `Project` to the
rest of the app. The analysis layer never sees a CSV.

One awkward fact shapes all of this. An export gives the character offsets of
each coding but usually *not* the transcript. In the Open Science export the
selection length equals `end - start` for only 73% of rows — line endings and
normalisation account for the rest. So a document is rebuilt as a buffer with
each selection written at its recorded offset:

* offsets are preserved exactly, which is what the co-occurrence calculation
  depends on, so the figures match the reviewed examples;
* the reconstructed text is faithful inside every coded span and is padding
  elsewhere, and `provenance` says so plainly. It is not presented as a
  transcript.

The alternative — shifting each span to match its selection — would make the
text tidy and the statistics wrong. Offsets win.

Documents are assembled before they are added, so the project's own size limits
and integrity hashing still apply. The NVivo export is split by report section,
which keeps each document well inside the 500,000-character ceiling and gives
the faceted figure a natural grouping.
"""
from __future__ import annotations

import csv
import sqlite3
import tempfile
import zipfile
from pathlib import Path

from .core import add_code, add_document, event, new_project, now, uid

# Okabe–Ito, the standard colour-blind-safe qualitative palette. Imported codes
# use it so a figure's categories stay distinguishable in print.
OKABE_ITO = ("#0072B2", "#D55E00", "#009E73", "#CC79A7",
             "#E69F00", "#56B4E9", "#8C564B", "#4B4B4B")

IMPORT_SOURCE = "imported"


def _read_table(path, encoding="utf-8", delimiter=None):
    """Read a CSV into (fieldnames, rows) without pulling in pandas."""
    with open(path, "r", encoding=encoding, newline="") as handle:
        sample = handle.read(8192)
        handle.seek(0)
        if delimiter is None:
            try:
                delimiter = csv.Sniffer().sniff(sample, delimiters=",;\t").delimiter
            except csv.Error:
                delimiter = ","
        reader = csv.DictReader(handle, delimiter=delimiter)
        return reader.fieldnames or [], [dict(row) for row in reader]


def _pick(fieldnames, *candidates):
    """First column whose name matches, case- and space-insensitively."""
    normalised = {name.strip().casefold().replace("_", " "): name for name in fieldnames}
    for candidate in candidates:
        key = candidate.strip().casefold().replace("_", " ")
        if key in normalised:
            return normalised[key]
    return None


def _buffer(spans, total):
    """A text buffer with each (start, end, text) written at its offset.

    Overlaps are written in order, so the last writer wins — but two codings on
    the same span always carry the same selection, so this is not lossy in
    practice. Text outside every span is padding.
    """
    buf = [" "] * max(total, 1)
    for start, end, text in spans:
        span = end - start
        if span <= 0:
            continue
        chunk = text[:span] if len(text) >= span else text.ljust(span)
        buf[start:end] = list(chunk)
    return "".join(buf)


def _code_id(project, name, parent_id=None, definition=""):
    """Get or create a code by name, under a given parent."""
    existing = next((c for c in project["codes"]
                     if c["name"].casefold() == name.casefold() and c.get("parent_id") == parent_id), None)
    if existing:
        return existing["id"]
    color = OKABE_ITO[len(project["codes"]) % len(OKABE_ITO)]
    return add_code(project, name, definition, color=color, parent_id=parent_id)["id"]


def _attach(project, document, code_id, start, end, memo="", source=IMPORT_SOURCE):
    """Append a coding, bypassing the interactive duplicate check.

    An export can legitimately carry the same code twice on the same span when
    a coder re-applied it; the importer keeps both rather than silently
    dropping one, because the row count is part of what the figures report.
    """
    project["annotations"].append({
        "id": uid(), "document_id": document["id"], "code_id": code_id,
        "start": start, "end": end, "quote": document["text"][start:end],
        "memo": memo, "source": source, "suggestion_id": None,
        "created_at": now(),
    })


def _spans_of(group, col_start, col_end, col_text):
    return [(int(r[col_start]), int(r[col_end]), str(r[col_text] or "")) for r in group]


def from_openqda_csv(path, name="Open Science interviews", encoding="utf-8"):
    """OpenQDA passage–code export.

    Columns: `file; code category; created by; created at; last update;
    start pos; end pos; selection`. One row per coding; a passage carrying
    several codes appears several times.
    """
    fieldnames, rows = _read_table(path, encoding=encoding, delimiter=";")
    col_file = _pick(fieldnames, "file")
    col_code = _pick(fieldnames, "code category", "code", "code name")
    col_start = _pick(fieldnames, "start pos", "start")
    col_end = _pick(fieldnames, "end pos", "end")
    col_text = _pick(fieldnames, "selection", "text", "coded text")
    missing = [label for label, col in
               (("file", col_file), ("code", col_code), ("start", col_start),
                ("end", col_end), ("selection", col_text)) if col is None]
    if missing:
        raise ValueError("This CSV is missing the columns: " + ", ".join(missing))

    project = new_project(name)
    by_file = {}
    for row in rows:
        by_file.setdefault(row[col_file], []).append(row)

    for filename, group in by_file.items():
        spans = _spans_of(group, col_start, col_end, col_text)
        total = max(end for _s, end, _t in spans) if spans else 1
        document = add_document(project, filename, _buffer(spans, total))
        for row in group:
            code_id = _code_id(project, str(row[col_code]))
            _attach(project, document, code_id, int(row[col_start]), int(row[col_end]))

    project["provenance"] = (
        "Imported from an OpenQDA passage-code export. Character offsets are "
        "preserved exactly; text outside the coded spans is padding, not the "
        "original transcript."
    )
    event(project, "project_import", format="openqda", rows=len(rows),
          documents=len(project["documents"]), codes=len(project["codes"]))
    return project


def from_nvivo_csv(path, name="Publishing reproducible research outputs", encoding="cp1252"):
    """NVivo thematic-coding export.

    Columns: `Report section; Report subsection; Thematic code; Coded Text`.
    One document per report section. The hierarchy is section -> subsection,
    which is what the faceted theme figure draws; the thematic code has no
    place in that two-level shape, so it is kept on each coding's memo rather
    than discarded.
    """
    fieldnames, rows = _read_table(path, encoding=encoding)
    col_section = _pick(fieldnames, "report section", "section")
    col_sub = _pick(fieldnames, "report subsection", "subsection")
    col_theme = _pick(fieldnames, "thematic code", "code")
    col_text = _pick(fieldnames, "coded text", "text", "quote")
    missing = [label for label, col in
               (("Report section", col_section), ("Report subsection", col_sub),
                ("Coded Text", col_text)) if col is None]
    if missing:
        raise ValueError("This CSV is missing the columns: " + ", ".join(missing))

    project = new_project(name)
    sections = {}
    for row in rows:
        sections.setdefault(str(row[col_section] or "").strip(), []).append(row)

    for section, group in sections.items():
        spans, payload, cursor = [], [], 0
        for row in group:
            text = str(row[col_text] or "")
            subsection = str(row[col_sub] or "").strip()
            theme = str(row[col_theme] or "").strip() if col_theme else ""
            parent_id = _code_id(project, section) if section else None
            code_id = _code_id(project, subsection or section, parent_id=parent_id)
            spans.append((cursor, cursor + len(text), text))
            payload.append((code_id, cursor, cursor + len(text), theme))
            cursor += len(text) + 1  # +1 keeps consecutive extracts separate
        document = add_document(project, section or "Coded extracts", _buffer(spans, cursor))
        for code_id, start, end, theme in payload:
            _attach(project, document, code_id, start, end, memo=theme)

    project["provenance"] = (
        "Imported from an NVivo thematic-coding export. Each row is one coded "
        "extract; extracts are placed at their own offsets within their report "
        "section, and the thematic code is recorded on the coding's memo."
    )
    event(project, "project_import", format="nvivo", rows=len(rows),
          documents=len(project["documents"]), codes=len(project["codes"]))
    return project


# ---------------------------------------------------------------------------
# QualCoder, ATLAS.ti and FAIRqual
# ---------------------------------------------------------------------------

def _open_qda(path):
    """Locate `data.qda` from a .qda directory, a parent directory, or a zip."""
    path = Path(path)
    if path.is_file() and path.suffix == ".zip":
        target = Path(tempfile.mkdtemp(prefix="qualicraft-qda-"))
        with zipfile.ZipFile(path) as archive:
            for member in archive.namelist():
                if member.startswith("/") or ".." in Path(member).parts:
                    raise ValueError("Refusing to extract %r from %s" % (member, path))
            archive.extractall(target)
        path = target
    if path.is_dir():
        if (path / "data.qda").exists():
            return path / "data.qda"
        for candidate in sorted(path.rglob("data.qda")):
            return candidate
    if path.is_file():
        return path
    raise ValueError("No data.qda found under %s" % path)


def from_qualcoder_qda(path, name="Bologna · what is 'data' in the arts and humanities"):
    """QualCoder project (`.qda`).

    This is the richest of the public datasets: real transcripts, a three-level
    codebook, and 903 codings whose offsets verify against the text. Everything
    the reader sees is the researcher's own material.

    Layout: `source` holds documents with full text, `code_cat` the category
    tree, `code_name` the codes, `code_text` the codings. Categories are turned
    into parent codes so the hierarchy survives into the analysis layer.
    """
    db = sqlite3.connect(str(_open_qda(path)))
    db.row_factory = sqlite3.Row
    project = new_project(name)

    documents = {}
    for row in db.execute("SELECT id, name, fulltext FROM source ORDER BY id"):
        text = row["fulltext"] or ""
        if not text.strip():
            continue
        document = add_document(project, Path(str(row["name"])).name or ("source-%s" % row["id"]), text)
        documents[row["id"]] = document

    # Categories become codes too, so a code can sit under a category and a
    # category under its super-category. Resolved depth-first with a cycle guard.
    categories = {r["catid"]: r for r in db.execute("SELECT catid, name, supercatid FROM code_cat")}
    category_code = {}

    def category_id(catid, seen):
        if catid in category_code:
            return category_code[catid]
        if catid in seen or catid not in categories:
            return None
        seen = seen | {catid}
        row = categories[catid]
        parent = category_id(row["supercatid"], seen) if row["supercatid"] else None
        category_code[catid] = _code_id(project, str(row["name"]).strip(), parent_id=parent)
        return category_code[catid]

    for catid in categories:
        category_id(catid, set())

    code_parent = {}
    for row in db.execute("SELECT cid, name, catid FROM code_name"):
        parent = category_id(row["catid"], set()) if row["catid"] else None
        code_parent[row["cid"]] = _code_id(project, str(row["name"]).strip(), parent_id=parent)

    skipped, attached = 0, 0
    for row in db.execute("SELECT cid, fid, pos0, pos1 FROM code_text ORDER BY ctid"):
        document = documents.get(row["fid"])
        code_id = code_parent.get(row["cid"])
        if document is None or code_id is None:
            # 27 of 903 rows point at a code that is not in code_name; the
            # export keeps the application but drops the definition.
            skipped += 1
            continue
        start, end = int(row["pos0"]), int(row["pos1"])
        if not (0 <= start < end <= len(document["text"])):
            skipped += 1
            continue
        _attach(project, document, code_id, start, end)
        attached += 1

    project["provenance"] = (
        "Imported from a QualCoder project. Documents, codebook and codings are "
        "the researchers' own material; character offsets verify against the "
        "transcript text. %d codings were skipped because the export references "
        "a code definition it does not contain." % skipped
    )
    event(project, "project_import", format="qualcoder", codings=attached, skipped=skipped,
          documents=len(project["documents"]), codes=len(project["codes"]))
    db.close()
    return project


def _read_sheets(path):
    """Read an .xlsx into {sheet: [row tuples]}. openpyxl only, no pandas."""
    try:
        from openpyxl import load_workbook
    except ImportError:  # pragma: no cover - depends on the environment
        raise RuntimeError(
            "Reading .xlsx needs openpyxl. Install it with: pip install openpyxl"
        ) from None
    book = load_workbook(path, read_only=True, data_only=True)
    try:
        return {name: list(book[name].iter_rows(values_only=True)) for name in book.sheetnames}
    finally:
        book.close()


def _layout(payload):
    """(code_id, label, count) rows -> (document text, codings).

    A frequency report ships counts but no transcript, so the document is built
    from the code labels themselves: one line per counted extract. Frequency
    and hierarchy come out right, and co-occurrence comes out empty — the
    honest answer for an export that never recorded which passages shared a
    code.
    """
    cursor, spans, attachments = 0, [], []
    for code_id, label, count in payload:
        for _ in range(count):
            spans.append((cursor, cursor + len(label), label))
            attachments.append((code_id, cursor, cursor + len(label)))
            cursor += len(label) + 1
    return (_buffer(spans, cursor) if spans else " "), attachments


def _atlas_path(full_code):
    """'● A - B: C' -> (A, B, C);  '● A: C' -> (A, None, C)."""
    body = str(full_code).lstrip("● ").strip()
    head, _, code = body.partition(": ")
    if " - " in head:
        top, _, second = head.partition(" - ")
        return top.strip(), second.strip(), (code or second).strip()
    return head.strip(), None, (code or head).strip()


def from_atlas_report(path, name="ATLAS.ti interview code analysis"):
    """ATLAS.ti frequency report.

    73 sheets; 43 carry a `Full code | Totals | Code | Final count` table whose
    `Full code` column is a path such as
    '● Digital Tools - Data & Information: More and better access to information'.

    This export contains **no transcript**. Frequency is therefore rebuilt by
    creating `Totals` codings per code: the frequency and hierarchy figures come
    out right, and the co-occurrence figure comes out empty — which is honest,
    because the export cannot say which passages shared a code.
    """
    sheets = _read_sheets(path)
    project = new_project(name)
    payload, rows_seen = [], 0

    for sheet, rows in sheets.items():
        if "->>" in sheet or not rows:
            continue
        header = [str(c).strip() if c is not None else "" for c in rows[0]]
        if "Full code" not in header or "Totals" not in header:
            continue
        i_code, i_totals = header.index("Full code"), header.index("Totals")
        for row in rows[1:]:
            if not row or row[i_code] is None:
                continue
            top, second, code = _atlas_path(row[i_code])
            try:
                count = int(row[i_totals])
            except (TypeError, ValueError):
                continue
            if count <= 0 or not code:
                continue
            parent = _code_id(project, top)
            if second and second != top:
                parent = _code_id(project, second, parent_id=parent)
            payload.append((_code_id(project, code, parent_id=parent), code, count))
            rows_seen += 1

    text, attachments = _layout(payload)
    document = add_document(project, "Frequency report", text)
    for code_id, start, end in attachments:
        _attach(project, document, code_id, start, end)

    project["provenance"] = (
        "Imported from an ATLAS.ti frequency report. This export has no "
        "transcript: frequency is rebuilt from the report's own counts, so the "
        "frequency and hierarchy figures are meaningful and the co-occurrence "
        "figure is not."
    )
    event(project, "project_import", format="atlas_ti", rows=rows_seen,
          codings=len(project["annotations"]), codes=len(project["codes"]))
    return project


def from_fairqual_codebook(path, name="FAIRqual workshop codebook", sheet="Sheet2"):
    """FAIRqual category/subcategory/code/frequency table.

    Small by design — a fixture for the hierarchy and frequency figures. Like
    the ATLAS.ti export it has no transcript, so frequency is rebuilt from the
    `frequency` column.
    """
    sheets = _read_sheets(path)
    if sheet not in sheets:
        # Fall back to whichever sheet actually has the four columns.
        for candidate, rows in sheets.items():
            if rows and [str(c).strip() if c else "" for c in rows[0]][:4] == \
                    ["category", "subcategory", "code", "frequency"]:
                sheet = candidate
                break
        else:
            raise ValueError("No category/subcategory/code/frequency sheet found in %s" % path)

    rows = sheets[sheet]
    header = [str(c).strip() if c is not None else "" for c in rows[0]]
    for required in ("category", "subcategory", "code", "frequency"):
        if required not in header:
            raise ValueError("This sheet is missing the column: " + required)
    i_cat, i_sub, i_code, i_freq = (header.index(k) for k in
                                    ("category", "subcategory", "code", "frequency"))

    project = new_project(name)
    payload = []
    for row in rows[1:]:
        if not row or row[i_code] is None:
            continue
        try:
            count = int(float(row[i_freq]))
        except (TypeError, ValueError):
            continue
        if count <= 0:
            continue
        top = _code_id(project, str(row[i_cat]).strip())
        parent = _code_id(project, str(row[i_sub]).strip(), parent_id=top)
        code_id = _code_id(project, str(row[i_code]).strip(), parent_id=parent)
        payload.append((code_id, str(row[i_code]).strip(), count))

    text, attachments = _layout(payload)
    document = add_document(project, "Workshop codebook", text)
    for code_id, start, end in attachments:
        _attach(project, document, code_id, start, end)

    project["provenance"] = (
        "Imported from the FAIRqual workshop codebook. A category/subcategory/"
        "code table with frequencies and no transcript; frequency is rebuilt "
        "from the table's own counts."
    )
    event(project, "project_import", format="fairqual", codes=len(project["codes"]),
          codings=len(project["annotations"]))
    return project


def verify(project, expected):
    """Assert the imported shape matches what the dataset is documented to be."""
    problems = []
    if "rows" in expected and len(project["annotations"]) != expected["rows"]:
        problems.append("codings %d != %d" % (len(project["annotations"]), expected["rows"]))
    if expected.get("codes") is not None and len(project["codes"]) != expected["codes"]:
        problems.append("codes %d != %d" % (len(project["codes"]), expected["codes"]))
    if expected.get("documents") is not None and len(project["documents"]) != expected["documents"]:
        problems.append("documents %d != %d" % (len(project["documents"]), expected["documents"]))
    if problems:
        raise ValueError("Import does not match the documented dataset: " + "; ".join(problems))
    return True
