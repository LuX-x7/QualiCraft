"""The analysis layer: Project -> one tidy table -> every statistic.

Every figure reads the same table, so a new chart is a new renderer and not a
new traversal. That is the whole reason this module exists; before it, each
chart walked the project on its own and the counting rules drifted apart.

The table has one row per coding (passage-code assignment), with columns
`case, code, parent_code, theme, start, end, text, source, code_id, theme_id,
code_label`. Identity is carried by IDs; labels are only for display. Counts are counts
of these rows. That unit is stated on every figure, because "code X appears 40
times" is a very different claim from "40 participants mentioned X", and only
the first one is what the data supports.

Deliberately standard-library only. `to_frame()` is the single place that
imports pandas, and it is optional.
"""
from __future__ import annotations

import re
from collections import Counter, defaultdict

COLUMNS = ("case", "code", "parent_code", "theme", "start", "end", "text", "source",
           "code_id", "theme_id", "code_label")

# Two defensible definitions of co-occurrence, and they give different numbers.
# `overlap` is the stricter one: the two codings must actually share characters.
# `unit` counts two codings that merely land in the same paragraph. See
# docs/DESIGN.md §4.1 — the choice is surfaced to the reader, never implicit.
COOCCURRENCE_MODES = ("overlap", "unit")


def _code_index(codes):
    return {c["id"]: c for c in codes}


def _code_chain(by_id, code_id):
    """Root-to-leaf codes, guarded against already-damaged parent chains."""
    chain, seen = [], set()
    current = by_id.get(code_id)
    while current and current["id"] not in seen:
        seen.add(current["id"])
        chain.append(current)
        current = by_id.get(current.get("parent_id"))
    return chain[::-1]


def _unique_labels(labels):
    labels = dict(labels)
    while True:
        counts = Counter(label.casefold() for label in labels.values())
        collisions = [key for key, label in labels.items() if counts[label.casefold()] > 1]
        if not collisions:
            return labels
        for key in collisions:
            labels[key] += " [%s]" % key


def code_labels(codes):
    """Unique display labels across the whole codebook, without renaming it."""
    by_id = _code_index(codes)
    names = Counter(c["name"].casefold() for c in codes)
    return _unique_labels({c["id"]: (
        " > ".join(item["name"] for item in _code_chain(by_id, c["id"]))
        if names[c["name"].casefold()] > 1 else c["name"])
        for c in codes})


def _identity(row, by="code"):
    return row[by + "_id"] if by in ("code", "theme") else row[by]


def _label_index(rows, by="code"):
    field = "code_label" if by == "code" else by
    return _unique_labels({_identity(r, by): r[field] for r in rows})


def _frequency_items(rows, by="code"):
    labels = _label_index(rows, by)
    counts = Counter(_identity(r, by) for r in rows if r.get(by))
    return [(key, labels[key], count) for key, count in
            sorted(counts.items(), key=lambda item: (-item[1], labels[item[0]], item[0]))]


def tidy(project):
    """Flatten a project into the tidy table. One dict per coding."""
    by_id = _code_index(project.get("codes", []))
    labels = code_labels(project.get("codes", []))
    doc_name = {d["id"]: d["name"] for d in project.get("documents", [])}
    rows = []
    for a in project.get("annotations", []):
        code = by_id.get(a["code_id"])
        if code is None:
            # A coding whose code was deleted mid-edit; skip rather than crash.
            continue
        parent = by_id.get(code.get("parent_id") or "")
        theme = _code_chain(by_id, code["id"])[0]
        rows.append({
            "case": doc_name.get(a["document_id"], ""),
            "code": code["name"],
            "parent_code": parent["name"] if parent else "",
            "theme": theme["name"],
            "start": int(a["start"]),
            "end": int(a["end"]),
            "text": a.get("quote", ""),
            "source": a.get("source", "manual"),
            "code_id": code["id"],
            "theme_id": theme["id"],
            "code_label": labels[code["id"]],
        })
    return rows


def to_frame(rows):
    """The tidy table as a DataFrame. The only pandas import in this module."""
    import pandas as pd
    return pd.DataFrame(list(rows), columns=list(COLUMNS))


def frequency(rows, by="code"):
    """Counts per identity, descending, with stable display-label ordering."""
    return [{"label": label, "count": count} for _, label, count in _frequency_items(rows, by)]


def _paragraph_ranges(text):
    """Character spans of non-empty lines — the same unit the reader shows."""
    return [(m.start(), m.end()) for m in re.finditer(r"[^\r\n]+", text) if m.group().strip()]


def cooccurrence(rows, mode="overlap", case_text=None, limit=None):
    """How often each pair of codes shares a position.

    mode="overlap": within one case, the two codings' character ranges must
        actually intersect. This is the definition used by the reference
        figures.
    mode="unit": the two codings need only fall in the same paragraph. Needs
        `case_text`, a {case: full transcript text} mapping.

    `limit` keeps only the most frequent N codes. A 39×39 matrix is unreadable
    as a figure, and the reference examples show the top 12.

    The diagonal counts positions the code appears in (cases for `overlap`,
    paragraphs for `unit`). It is a different unit from the off-diagonal cells
    and figures must say so.
    """
    if mode not in COOCCURRENCE_MODES:
        raise ValueError("Unknown co-occurrence mode: %r" % (mode,))

    # Frequency order, not alphabetical: a reader scans a co-occurrence matrix
    # for the busiest codes first, and the reference figures order it this way.
    items = _frequency_items(rows)
    if limit is not None:
        items = items[:limit]
    ids = [key for key, _, _ in items]
    labels = [label for _, label, _ in items]
    index = {key: i for i, key in enumerate(ids)}
    size = len(labels)
    matrix = [[0] * size for _ in range(size)]
    diagonal = [0] * size

    if mode == "overlap":
        by_case = defaultdict(list)
        for r in rows:
            if r["code_id"] in index:
                by_case[r["case"]].append(r)
        for _case, group in by_case.items():
            for i, a in enumerate(group):
                diagonal[index[a["code_id"]]] += 1
                for b in group[i + 1:]:
                    if a["code_id"] != b["code_id"] and a["start"] < b["end"] and b["start"] < a["end"]:
                        matrix[index[a["code_id"]]][index[b["code_id"]]] += 1
                        matrix[index[b["code_id"]]][index[a["code_id"]]] += 1
    else:
        if case_text is None:
            raise ValueError("mode='unit' needs case_text: {case: transcript}")
        for case, text in case_text.items():
            group = [r for r in rows if r["case"] == case and r["code_id"] in index]
            if not group:
                continue
            for start, end in _paragraph_ranges(text):
                present = {r["code_id"] for r in group if r["end"] > start and r["start"] < end}
                for name in present:
                    diagonal[index[name]] += 1
                for left in present:
                    for right in present:
                        matrix[index[left]][index[right]] += 1

    for i in range(size):
        matrix[i][i] = diagonal[i]

    return {"labels": labels, "matrix": matrix, "mode": mode, "code_ids": ids}


def coverage(rows, top=None):
    """Case × code counts, codes ordered by overall frequency."""
    cases = sorted({r["case"] for r in rows})
    items = _frequency_items(rows)
    if top:
        items = items[:top]
    ids = [key for key, _, _ in items]
    counts = Counter((r["case"], r["code_id"]) for r in rows)
    matrix = [[counts[(case, key)] for key in ids] for case in cases]
    return {"cases": cases, "codes": [label for _, label, _ in items], "matrix": matrix, "code_ids": ids}


def accumulation(rows, order=None):
    """Distinct codes seen so far, as cases are added one at a time.

    `order` defaults to sorted case names. That is filename order, not
    interview chronology — a plateau here is not evidence of saturation, and
    the figure must say so.
    """
    cases = list(order) if order else sorted({r["case"] for r in rows})
    seen, cumulative, added = set(), [], []
    by_case = defaultdict(set)
    for r in rows:
        by_case[r["case"]].add(r["code_id"])
    for case in cases:
        before = len(seen)
        seen |= by_case[case]
        cumulative.append(len(seen))
        added.append(len(seen) - before)
    return {"cases": cases, "cumulative": cumulative, "new": added}


def hierarchy(rows):
    """Section -> subsection counts, for the faceted theme figure.

    Falls back to the theme column when the project has no two-level
    structure, so the same figure works for both shapes of codebook.
    """
    sections = defaultdict(Counter)
    themes, codes = _label_index(rows, "theme"), _label_index(rows)
    for r in rows:
        section = r["theme_id"]
        subsection = r["code_id"]
        sections[section][subsection] += 1
    return {themes[section]: {codes[key]: count for key, count in counts.items()}
            for section, counts in sections.items()}


def network(rows, passages=True):
    """Themes, codes and passages as one graph.

    Three levels, sized by how much material sits under them: a theme is the
    largest node, the codes inside it come next, and the passages themselves
    are the smallest. That ordering is the point — it lets a reader see at a
    glance which theme carries the study and which code is a footnote.

    Edges carry three different relationships, and they mean different things:

      hierarchy     theme -> code          the codebook's own structure
      coding        code  -> passage       the evidence behind a code
      cooccurrence  code <-> code          overlapping spans in one interview

    Co-occurrence edges are the interesting ones: they are the relationships
    the codebook does not record, and the reason this view exists at all.

    Passages are included by default because they are what makes the graph
    evidence rather than decoration, but the UI keeps them hidden until a code
    is opened — several hundred passage nodes on screen at once is noise.
    """
    # Keyed by node id, not by label: a code and a theme can share a name, and
    # keying by label silently merges them.
    nodes = {}
    links = []
    code_id = lambda key: "code:" + key
    theme_id = lambda key: "theme:" + key
    code_labels_by_id = _label_index(rows)
    theme_labels = _label_index(rows, "theme")

    counts = Counter(r["code_id"] for r in rows)
    theme_weight = Counter()
    code_theme = {}
    for row in rows:
        code, theme = row["code_id"], row["theme_id"]
        code_theme[code] = theme
        theme_weight[theme] += 1

    for theme, weight in theme_weight.items():
        nodes[theme_id(theme)] = {"id": theme_id(theme), "kind": "theme", "label": theme_labels[theme],
                                  "weight": weight, "theme": theme_labels[theme], "theme_id": theme}
    for code, weight in counts.items():
        theme = code_theme[code]
        nodes[code_id(code)] = {"id": code_id(code), "kind": "code", "label": code_labels_by_id[code],
                                "weight": weight, "theme": theme_labels[theme], "theme_id": theme, "code_id": code}
        # A code that is its own theme has no hierarchy edge to draw.
        if theme_id(theme) != code_id(code) and theme_id(theme) in nodes:
            links.append({"source": theme_id(theme), "target": code_id(code),
                          "kind": "hierarchy", "weight": 1})

    # Passages, and the coding edges that tie them to their code.
    if passages:
        for index, row in enumerate(rows):
            pid = "p:%d" % index
            nodes[pid] = {"id": pid, "kind": "passage", "label": row["text"][:80],
                          "weight": 1, "theme": row["theme"], "case": row["case"],
                          "code": row["code"], "code_id": row["code_id"], "theme_id": row["theme_id"]}
            links.append({"source": code_id(row["code_id"]), "target": pid,
                          "kind": "coding", "weight": 1})

    # Co-occurrence: codes whose spans actually overlap in one interview. This
    # is the stricter definition from docs/DESIGN.md, and the one worth
    # drawing, because it shows relationships the codebook does not contain.
    by_case = defaultdict(list)
    for row in rows:
        by_case[row["case"]].append(row)
    pairs = Counter()
    for group in by_case.values():
        for i, a in enumerate(group):
            for b in group[i + 1:]:
                if a["code_id"] != b["code_id"] and a["start"] < b["end"] and b["start"] < a["end"]:
                    pairs[tuple(sorted((a["code_id"], b["code_id"])))] += 1
    for (left, right), weight in pairs.items():
        links.append({"source": code_id(left), "target": code_id(right),
                      "kind": "cooccurrence", "weight": weight})

    return {
        "nodes": list(nodes.values()),
        "links": links,
        "levels": {
            "themes": len(theme_weight),
            "codes": len(counts),
            "passages": len(rows) if passages else 0,
        },
        "definition": "overlap",
    }


def summary(project, rows=None):
    """Headline numbers, for a figure subtitle or a report header."""
    rows = tidy(project) if rows is None else rows
    return {
        "cases": len({r["case"] for r in rows}),
        "codes": len({r["code_id"] for r in rows}),
        "codings": len(rows),
        "themes": len({r["theme_id"] for r in rows if r["theme_id"]}),
    }
