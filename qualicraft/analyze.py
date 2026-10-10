"""The analysis layer: Project -> one tidy table -> every statistic.

Every figure reads the same table, so a new chart is a new renderer and not a
new traversal. That is the whole reason this module exists; before it, each
chart walked the project on its own and the counting rules drifted apart.

The table has one row per coding (passage-code assignment), with columns
`case, code, parent_code, theme, start, end, text, source`. Counts are counts
of these rows. That unit is stated on every figure, because "code X appears 40
times" is a very different claim from "40 participants mentioned X", and only
the first one is what the data supports.

Deliberately standard-library only. `to_frame()` is the single place that
imports pandas, and it is optional.
"""
from __future__ import annotations

import re
from collections import Counter, defaultdict

COLUMNS = ("case", "code", "parent_code", "theme", "start", "end", "text", "source")

# Two defensible definitions of co-occurrence, and they give different numbers.
# `overlap` is the stricter one: the two codings must actually share characters.
# `unit` counts two codings that merely land in the same paragraph. See
# docs/DESIGN.md §4.1 — the choice is surfaced to the reader, never implicit.
COOCCURRENCE_MODES = ("overlap", "unit")


def _code_index(codes):
    return {c["id"]: c for c in codes}


def _ancestor_name(by_id, code_id):
    """Name of the top-level ancestor; the code's own name when it has none."""
    seen, current = set(), by_id.get(code_id)
    while current and current.get("parent_id") and current["parent_id"] in by_id:
        if current["id"] in seen:
            break
        seen.add(current["id"])
        current = by_id[current["parent_id"]]
    return current["name"] if current else ""


def tidy(project):
    """Flatten a project into the tidy table. One dict per coding."""
    by_id = _code_index(project.get("codes", []))
    doc_name = {d["id"]: d["name"] for d in project.get("documents", [])}
    rows = []
    for a in project.get("annotations", []):
        code = by_id.get(a["code_id"])
        if code is None:
            # A coding whose code was deleted mid-edit; skip rather than crash.
            continue
        parent = by_id.get(code.get("parent_id") or "")
        rows.append({
            "case": doc_name.get(a["document_id"], ""),
            "code": code["name"],
            "parent_code": parent["name"] if parent else "",
            "theme": _ancestor_name(by_id, code["id"]),
            "start": int(a["start"]),
            "end": int(a["end"]),
            "text": a.get("quote", ""),
            "source": a.get("source", "manual"),
        })
    return rows


def to_frame(rows):
    """The tidy table as a DataFrame. The only pandas import in this module."""
    import pandas as pd
    return pd.DataFrame(list(rows), columns=list(COLUMNS))


def frequency(rows, by="code"):
    """Counts per label, descending. Ties broken by name so runs are stable."""
    counts = Counter(r[by] for r in rows if r.get(by))
    return [{"label": k, "count": v}
            for k, v in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))]


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
    labels = [f["label"] for f in frequency(rows)]
    if limit is not None:
        labels = labels[:limit]
    index = {name: i for i, name in enumerate(labels)}
    size = len(labels)
    matrix = [[0] * size for _ in range(size)]
    diagonal = [0] * size

    if mode == "overlap":
        by_case = defaultdict(list)
        for r in rows:
            if r["code"] in index:
                by_case[r["case"]].append(r)
        for _case, group in by_case.items():
            for i, a in enumerate(group):
                diagonal[index[a["code"]]] += 1
                for b in group[i + 1:]:
                    if a["code"] != b["code"] and a["start"] < b["end"] and b["start"] < a["end"]:
                        matrix[index[a["code"]]][index[b["code"]]] += 1
                        matrix[index[b["code"]]][index[a["code"]]] += 1
    else:
        if case_text is None:
            raise ValueError("mode='unit' needs case_text: {case: transcript}")
        for case, text in case_text.items():
            group = [r for r in rows if r["case"] == case and r["code"] in index]
            if not group:
                continue
            for start, end in _paragraph_ranges(text):
                present = {r["code"] for r in group if r["end"] > start and r["start"] < end}
                for name in present:
                    diagonal[index[name]] += 1
                for left in present:
                    for right in present:
                        matrix[index[left]][index[right]] += 1

    for i in range(size):
        matrix[i][i] = diagonal[i]

    return {"labels": labels, "matrix": matrix, "mode": mode}


def coverage(rows, top=None):
    """Case × code counts, codes ordered by overall frequency."""
    cases = sorted({r["case"] for r in rows})
    order = [f["label"] for f in frequency(rows)]
    if top:
        order = order[:top]
    index = {name: i for i, name in enumerate(order)}
    counts = Counter((r["case"], r["code"]) for r in rows)
    matrix = [[counts[(case, code)] for code in order] for case in cases]
    return {"cases": cases, "codes": order, "matrix": matrix}


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
        by_case[r["case"]].add(r["code"])
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
    for r in rows:
        section = r.get("theme") or r["code"]
        subsection = r["code"]
        sections[section][subsection] += 1
    return {section: dict(counts) for section, counts in sections.items()}


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
    code_id = lambda name: "code:" + name
    theme_id = lambda name: "theme:" + name

    counts = Counter(r["code"] for r in rows)
    theme_weight = Counter()
    code_theme = {}
    for row in rows:
        code, theme = row["code"], row["theme"] or row["code"]
        code_theme[code] = theme
        theme_weight[theme] += 1

    for theme, weight in theme_weight.items():
        nodes[theme_id(theme)] = {"id": theme_id(theme), "kind": "theme", "label": theme,
                                  "weight": weight, "theme": theme}
    for code, weight in counts.items():
        theme = code_theme[code]
        nodes[code_id(code)] = {"id": code_id(code), "kind": "code", "label": code,
                                "weight": weight, "theme": theme}
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
                          "code": row["code"]}
            links.append({"source": code_id(row["code"]), "target": pid,
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
                if a["code"] != b["code"] and a["start"] < b["end"] and b["start"] < a["end"]:
                    pairs[tuple(sorted((a["code"], b["code"])))] += 1
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
        "codes": len({r["code"] for r in rows}),
        "codings": len(rows),
        "themes": len({r["theme"] for r in rows if r["theme"]}),
    }
