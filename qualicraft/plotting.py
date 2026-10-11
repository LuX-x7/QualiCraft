"""Publication figures, drawn by a script rather than by the browser.

Three decisions shape this module.

**A script draws the figure, and the preview is that script's output.** There is
only one renderer, so "the exported code reproduces the figure" holds by
construction rather than by careful maintenance of two parallel drawing paths.

**Every figure reads the same tidy table.** The counting lives in `analyze`, so
a chart is a renderer and nothing else. Five kinds share one option surface and
one credit block.

**matplotlib is the only hard dependency.** Clustering needs scipy; without it
the figure is drawn unclustered rather than refusing to draw. The rest of
QualiCraft runs on the standard library alone, so this module reports its own
absence instead of failing at import.

The export is a bundle, not just an image: the counts as CSV, the script, and
the finished figure as PNG, SVG and PDF. The CSV is the part that is hard to
reconstruct; the script is short because the counting is already done.
"""
from __future__ import annotations

import csv
import importlib.util
import io
import pprint
import subprocess
import sys
import tempfile
from pathlib import Path

from . import analyze

REQUIRED = ("matplotlib",)
OPTIONAL = ("scipy",)          # clustering only

INSTALL_HINT = "pip install matplotlib"

PLOT_KINDS = ("frequency", "coverage", "cooccurrence", "hierarchy", "accumulation")

KIND_TITLES = {
    "frequency": "Code frequency",
    "coverage": "Code-by-interview matrix",
    "cooccurrence": "Code co-occurrence",
    "hierarchy": "Themes and named subthemes",
    "accumulation": "Code accumulation curve",
}

PALETTES = ("viridis", "YlGnBu", "Blues", "Greens", "magma", "rocket", "mako", "flare", "crest")
CLUSTER_METHODS = ("ward", "complete", "average", "single")
LEVELS = ("code", "theme")      # what a frequency figure counts

# Okabe–Ito: distinguishable in greyscale and for the common colour-vision
# deficiencies, which matters when a figure is printed.
OKABE_ITO = ("#0072B2", "#D55E00", "#009E73", "#CC79A7",
             "#E69F00", "#56B4E9", "#8C564B", "#4B4B4B")

DEFAULT_OPTIONS = {
    "kind": "frequency",
    "name": "",
    # Which column a frequency figure counts. `analyze.frequency` has always
    # accepted this; the option surface simply never reached it, so "group by
    # theme" silently drew the code-level chart instead.
    "level": "code",
    "top": 15,
    # YlGnBu is the conventional sequential ramp for a count heatmap and is
    # what the reviewed examples use; viridis stays available.
    "palette": "YlGnBu",
    "color": "#73a89a",
    "cluster": False,
    "method": "ward",
    "annotate": True,
    "fontsize": 10,
    "figsize": 11.0,
    "dpi": 300,
    "title": "",
    "subtitle": "",
    "credit": "",
    "mode": "overlap",          # co-occurrence definition; see analyze
    "font": "",
}

# The script writes <name>.<ext>; these two carry the data and the recipe.
SIDECAR_FILES = ("figure_data.csv", "figure.py")
FIGURE_EXTENSIONS = ("png", "svg", "pdf")

# Fonts with CJK coverage, in preference order. Resolved at render time so a
# Chinese codebook does not come out as a row of empty boxes.
CJK_FONTS = ("PingFang SC", "Hiragino Sans GB", "Heiti SC", "Songti SC",
             "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC",
             "WenQuanYi Micro Hei", "SimHei", "Arial Unicode MS")


def _as_bool(value, default=False):
    if isinstance(value, bool):
        return value
    if value is None:
        return default
    if isinstance(value, str):
        return value.strip().lower() not in ("", "0", "false", "no", "off")
    return bool(value)


def _as_int(value, default, low, high):
    try:
        return max(low, min(high, int(float(value))))
    except (TypeError, ValueError):
        return default


def _as_float(value, default, low, high):
    try:
        return max(low, min(high, float(value)))
    except (TypeError, ValueError):
        return default


def available_font():
    """A font family that can render the labels, preferring a CJK one."""
    try:
        from matplotlib import font_manager
        installed = {f.name for f in font_manager.fontManager.ttflist}
    except Exception:
        return "DejaVu Sans"
    for name in CJK_FONTS:
        if name in installed:
            return name
    return "DejaVu Sans"


def availability():
    """Whether the drawing stack is importable, and what is missing."""
    missing = [name for name in REQUIRED if importlib.util.find_spec(name) is None]
    optional = [name for name in OPTIONAL if importlib.util.find_spec(name) is None]
    return {
        "available": not missing,
        "missing": missing,
        "optional_missing": optional,
        "install": INSTALL_HINT if missing else "",
    }


def normalise(options):
    """Coerce incoming options into the supported range.

    Query strings arrive as text, so booleans and numbers are parsed rather
    than trusted; anything unrecognised falls back to the default instead of
    raising, because a bad URL should not break the preview.
    """
    merged = dict(DEFAULT_OPTIONS)
    for key, value in (options or {}).items():
        if key in merged and value is not None:
            merged[key] = value

    if merged["kind"] not in PLOT_KINDS:
        merged["kind"] = DEFAULT_OPTIONS["kind"]
    if merged["palette"] not in PALETTES:
        merged["palette"] = DEFAULT_OPTIONS["palette"]
    if merged["method"] not in CLUSTER_METHODS:
        merged["method"] = DEFAULT_OPTIONS["method"]
    if merged["level"] not in LEVELS:
        merged["level"] = DEFAULT_OPTIONS["level"]
    if merged["mode"] not in analyze.COOCCURRENCE_MODES:
        merged["mode"] = DEFAULT_OPTIONS["mode"]

    merged["cluster"] = _as_bool(merged["cluster"])
    merged["annotate"] = _as_bool(merged["annotate"], True)
    merged["top"] = _as_int(merged["top"], DEFAULT_OPTIONS["top"], 1, 60)
    merged["fontsize"] = _as_int(merged["fontsize"], DEFAULT_OPTIONS["fontsize"], 5, 20)
    merged["figsize"] = _as_float(merged["figsize"], DEFAULT_OPTIONS["figsize"], 3.0, 24.0)
    merged["dpi"] = _as_int(merged["dpi"], DEFAULT_OPTIONS["dpi"], 72, 1200)
    merged["name"] = str(merged["name"] or ("figure_" + merged["kind"]))[:80]
    for field in ("title", "subtitle", "credit", "color", "font"):
        merged[field] = str(merged[field] or "")[:400]
    if not merged["color"].startswith("#"):
        merged["color"] = DEFAULT_OPTIONS["color"]
    if not merged["title"]:
        merged["title"] = KIND_TITLES[merged["kind"]]
        # A frequency figure counts either codes or themes, and the default
        # title names only one of them.
        if merged["kind"] == "frequency" and merged["level"] == "theme":
            merged["title"] = "Theme frequency"
    return merged


# ---------------------------------------------------------------------------
# Data: one long-form CSV per figure, so the generated script never needs the
# project — only the file sitting next to it.
# ---------------------------------------------------------------------------

def _write_csv(fieldnames, rows):
    stream = io.StringIO(newline="")
    writer = csv.writer(stream)
    writer.writerow(fieldnames)
    writer.writerows(rows)
    return stream.getvalue()


def _dataset(rows, options, case_text=None):
    kind = options["kind"]
    if kind == "frequency":
        data = analyze.frequency(rows, by=options["level"])[:options["top"]]
        return _write_csv([options["level"], "count"],
                          [[d["label"], d["count"]] for d in data])
    if kind == "coverage":
        cov = analyze.coverage(rows, top=options["top"])
        out = []
        for case, line in zip(cov["cases"], cov["matrix"]):
            for code, count in zip(cov["codes"], line):
                out.append([case, code, count])
        return _write_csv(["case", "code", "count"], out)
    if kind == "cooccurrence":
        co = analyze.cooccurrence(rows, mode=options["mode"], limit=options["top"],
                                  case_text=case_text)
        labels = co["labels"]
        out = []
        for i, left in enumerate(labels):
            for j, right in enumerate(labels):
                if i != j and co["matrix"][i][j]:
                    out.append([left, right, co["matrix"][i][j]])
        return _write_csv(["code_a", "code_b", "count"], out)
    if kind == "hierarchy":
        h = analyze.hierarchy(rows)
        out = []
        for section in sorted(h, key=lambda s: -sum(h[s].values())):
            for subsection, count in sorted(h[section].items(), key=lambda kv: -kv[1]):
                out.append([section, subsection, count])
        return _write_csv(["section", "subsection", "count"], out)
    acc = analyze.accumulation(rows)
    out = [[i + 1, case, cum, new]
           for i, (case, cum, new) in enumerate(zip(acc["cases"], acc["cumulative"], acc["new"]))]
    return _write_csv(["step", "case", "cumulative", "new"], out)


def _result(rows, options, case_text=None):
    """The numbers behind the figure, for the caller and for the tests."""
    kind = options["kind"]
    if kind == "frequency":
        data = analyze.frequency(rows, by=options["level"])[:options["top"]]
        return {"kind": kind, "level": options["level"],
                "labels": [d["label"] for d in data],
                "counts": [d["count"] for d in data], "codings": len(rows)}
    if kind == "coverage":
        cov = analyze.coverage(rows, top=options["top"])
        return {"kind": kind, "labels": cov["codes"], "cases": cov["cases"],
                "matrix": cov["matrix"], "codings": len(rows)}
    if kind == "cooccurrence":
        co = analyze.cooccurrence(rows, mode=options["mode"], limit=options["top"],
                                  case_text=case_text)
        return {"kind": kind, "labels": co["labels"], "matrix": co["matrix"],
                "mode": co["mode"], "codings": len(rows)}
    if kind == "hierarchy":
        return {"kind": kind, "hierarchy": analyze.hierarchy(rows), "codings": len(rows)}
    acc = analyze.accumulation(rows)
    return {"kind": kind, "cumulative": acc["cumulative"], "cases": acc["cases"],
            "codings": len(rows)}


# ---------------------------------------------------------------------------
# The exported script. Generated once, used twice: it draws the preview and it
# is what the co-author receives. That is what makes the two agree.
# ---------------------------------------------------------------------------

_SCRIPT_PRELUDE = '''#!/usr/bin/env python3
"""Publication figure generated by QualiCraft.

This is the script that drew the figure you were looking at, exported
unchanged. It reads figure_data.csv from its own folder, so the folder can be
handed to a co-author as it stands.

    pip install matplotlib
    python figure.py       # writes figure.png, figure.svg and figure.pdf
"""
import csv
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

HERE = Path(__file__).resolve().parent

SETTINGS = '''

_SCRIPT_HELPERS = '''

GRID = "#eae9ea"
INK = "#251f21"
MUTED = "#585254"

plt.rcParams.update({
    "font.family": SETTINGS["font"],
    "font.size": SETTINGS["fontsize"],
    "axes.spines.top": False,
    "axes.spines.right": False,
    "text.color": INK,
    "axes.labelcolor": INK,
    "xtick.color": INK,
    "ytick.color": INK,
    "figure.facecolor": "white",
    "savefig.facecolor": "white",
    # Without a fixed salt matplotlib mints a random element id per run, so
    # two runs of this same script would produce different bytes. Pinning it
    # keeps the export byte-reproducible.
    "svg.hashsalt": "qualicraft",
})


def wrap(text, width=34):
    import textwrap
    return "\\n".join(textwrap.wrap(str(text), width)) or str(text)


def read_data():
    with open(HERE / "figure_data.csv", encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle))


def finish(fig, title, subtitle, credit, rect=(0, 0.075, 1, 0.88)):
    """The fixed header and footer every figure in this project carries."""
    if title:
        fig.text(.025, .975, title, ha="left", va="top", fontsize=16, fontweight="bold")
    if subtitle:
        fig.text(.025, .934, subtitle, ha="left", va="top", fontsize=10, color=MUTED)
    if credit:
        fig.text(.025, .018, credit, ha="left", va="bottom", fontsize=8, color=MUTED)
    fig.tight_layout(rect=rect, pad=1.8)
    # A wall-clock stamp would make the same data export different bytes on
    # every run, which breaks "the export reproduces the preview". The key
    # differs per backend: SVG uses Date, PDF uses CreationDate and ModDate.
    for ext, meta in (("png", None),
                      ("svg", {"Date": None}),
                      ("pdf", {"CreationDate": None, "ModDate": None})):
        fig.savefig(HERE / (SETTINGS["name"] + "." + ext),
                    dpi=SETTINGS["dpi"], bbox_inches="tight", pad_inches=.2,
                    metadata=meta)
    plt.close(fig)
'''

_BODY_FREQUENCY = '''

def main():
    rows = read_data()
    if not rows:
        raise SystemExit("figure_data.csv is empty")
    rows = rows[::-1]
    # The column is named after what is being counted: `code` or `theme`. Read
    # the name from the settings rather than assuming, because a frequency
    # figure can be drawn at either level.
    key = SETTINGS["level"]
    labels = [wrap(r[key], 34) for r in rows]
    values = [int(r["count"]) for r in rows]
    height = max(3.0, 0.52 * len(values) + 1.7)
    fig, ax = plt.subplots(figsize=(SETTINGS["figsize"], height))
    ax.barh(range(len(values)), values, color=SETTINGS["color"], height=0.72)
    ax.set_yticks(range(len(labels)), labels)
    ax.set_xlabel("Passage-code assignments")
    peak = max(values) or 1
    ax.set_xlim(0, peak * 1.15)
    for i, value in enumerate(values):
        ax.text(value + peak * 0.012, i, str(value), va="center", fontsize=9)
    ax.xaxis.grid(True, color=GRID)
    ax.set_axisbelow(True)
    finish(fig, SETTINGS["title"], SETTINGS["subtitle"], SETTINGS["credit"])


main()
'''

_BODY_COVERAGE = '''

def main():
    rows = read_data()
    if not rows:
        raise SystemExit("figure_data.csv is empty")
    cases = sorted({r["case"] for r in rows})
    order = {}
    for r in rows:
        order[r["code"]] = order.get(r["code"], 0) + int(r["count"])
    codes = sorted(order, key=lambda c: (-order[c], c))[:SETTINGS["top"]]
    counts = {(r["case"], r["code"]): int(r["count"]) for r in rows}
    matrix = [[counts.get((case, code), 0) for code in codes] for case in cases]

    fig, ax = plt.subplots(figsize=(max(SETTINGS["figsize"], 0.42 * len(cases) + 5),
                                    max(6.0, 0.46 * len(codes) + 3)))
    image = ax.imshow(matrix, cmap=SETTINGS["palette"], aspect="auto", vmin=0)
    ax.set_xticks(range(len(cases)), [str(c).replace(".txt", "") for c in cases],
                  rotation=90, fontsize=9)
    ax.set_yticks(range(len(codes)), [wrap(c, 32) for c in codes], fontsize=9)
    ax.set_xlabel("Interview file")
    ax.set_ylabel("Code")
    ax.grid(False)
    fig.colorbar(image, ax=ax, label="Passage-code assignments", shrink=.85)
    finish(fig, SETTINGS["title"], SETTINGS["subtitle"], SETTINGS["credit"])


main()
'''

_BODY_COOCCURRENCE = '''

def main():
    rows = read_data()
    if not rows:
        raise SystemExit("figure_data.csv is empty")
    # Keep the order the rows arrive in: the CSV is written most-frequent
    # first, and re-sorting here would silently turn the matrix back into
    # alphabetical order.
    labels = []
    for r in rows:
        for key in ("code_a", "code_b"):
            if r[key] not in labels:
                labels.append(r[key])
    index = {name: i for i, name in enumerate(labels)}
    size = len(labels)
    matrix = [[0] * size for _ in range(size)]
    for r in rows:
        matrix[index[r["code_a"]]][index[r["code_b"]]] = int(r["count"])

    order = None
    if SETTINGS["cluster"] and size > 2:
        try:
            import numpy as np
            from scipy.cluster.hierarchy import leaves_list, linkage
            from scipy.spatial.distance import squareform
            peak = max(max(row) for row in matrix) or 1
            distance = [[float(peak - matrix[i][j]) for j in range(size)] for i in range(size)]
            condensed = squareform(np.array(distance), checks=False)
            # leaves_list is the leaf ordering. Sorting the linkage matrix
            # itself does not give one: it is a table of merges, so argsort
            # returns a row of column indices and the labels cannot be indexed
            # with it.
            order = [int(i) for i in leaves_list(linkage(condensed, method=SETTINGS["method"]))]
        except Exception:
            order = None
    # A partial or repeated ordering would silently drop rows, so anything that
    # is not a permutation of the labels falls back to the unclustered figure.
    if order and sorted(order) == list(range(size)):
        labels = [labels[i] for i in order]
        matrix = [[matrix[i][j] for j in order] for i in order]
        size = len(labels)

    fig, ax = plt.subplots(figsize=(SETTINGS["figsize"], SETTINGS["figsize"] * 0.92))
    peak = max((max(row) for row in matrix), default=0)
    image = ax.imshow(matrix, cmap=SETTINGS["palette"], vmin=0)
    ax.set_xticks(range(size), [wrap(c, 20) for c in labels], rotation=90, fontsize=9)
    ax.set_yticks(range(size), [wrap(c, 28) for c in labels], fontsize=9)
    ax.grid(False)
    if SETTINGS["annotate"] and size <= 30:
        for i in range(size):
            for j in range(size):
                ax.text(j, i, "-" if i == j else str(matrix[i][j]),
                        ha="center", va="center", fontsize=9,
                        color="white" if matrix[i][j] > peak * .55 else INK)
    fig.colorbar(image, ax=ax, label="Co-occurring coding pairs", shrink=.6)
    finish(fig, SETTINGS["title"], SETTINGS["subtitle"], SETTINGS["credit"],
           rect=(0, .055, 1, .90))


main()
'''

_BODY_HIERARCHY = '''

def main():
    rows = read_data()
    if not rows:
        raise SystemExit("figure_data.csv is empty")
    sections = {}
    for r in rows:
        sections.setdefault(r["section"], []).append((r["subsection"], int(r["count"])))
    names = sorted(sections)
    columns = 2 if len(names) > 4 else 1
    grid_rows = -(-len(names) // columns)
    fig, axes = plt.subplots(grid_rows, columns,
                             figsize=(SETTINGS["figsize"] * columns / 2.0,
                                      max(5.0, 4.6 * grid_rows)),
                             squeeze=False)
    for ax, section in zip(axes.flat, names):
        pairs = sorted(sections[section], key=lambda p: p[1])
        labels = [wrap(n, 42) for n, _c in pairs]
        values = [c for _n, c in pairs]
        ax.barh(range(len(values)), values, color=SETTINGS["color"], height=0.7)
        ax.set_yticks(range(len(labels)), labels, fontsize=9)
        ax.set_xlim(0, max(max(values) * 1.23, 20))
        ax.set_title(wrap(section, 48) + "\\n%d coded extracts" % sum(values),
                     fontsize=11, loc="left", pad=12)
        for i, value in enumerate(values):
            ax.text(value + max(max(values) * .02, .4), i, str(value),
                    va="center", fontsize=9)
        ax.set_xlabel("Coded extracts")
        ax.xaxis.grid(True, color=GRID)
        ax.set_axisbelow(True)
    for ax in axes.flat[len(names):]:
        ax.axis("off")
    finish(fig, SETTINGS["title"], SETTINGS["subtitle"], SETTINGS["credit"],
           rect=(0, .04, 1, .92))


main()
'''

_BODY_ACCUMULATION = '''

def main():
    rows = read_data()
    if not rows:
        raise SystemExit("figure_data.csv is empty")
    steps = [int(r["step"]) for r in rows]
    values = [int(r["cumulative"]) for r in rows]
    fig, ax = plt.subplots(figsize=(SETTINGS["figsize"] * 0.9, 6))
    ax.plot(steps, values, marker="o", color=SETTINGS["color"], ms=4)
    ax.set_xlabel("Interviews included (alphabetical filename order)")
    ax.set_ylabel("Cumulative distinct codes")
    ax.set_ylim(0, max(values) * 1.12 if values else 1)
    ax.set_xticks([s for s in steps if s == 1 or s % 5 == 0 or s == steps[-1]])
    ax.grid(color=GRID)
    ax.annotate("%d codes" % values[-1], (steps[-1], values[-1]),
                xytext=(-55, -22), textcoords="offset points")
    finish(fig, SETTINGS["title"], SETTINGS["subtitle"], SETTINGS["credit"])


main()
'''

_BODIES = {
    "frequency": _BODY_FREQUENCY,
    "coverage": _BODY_COVERAGE,
    "cooccurrence": _BODY_COOCCURRENCE,
    "hierarchy": _BODY_HIERARCHY,
    "accumulation": _BODY_ACCUMULATION,
}


def build_script(options=None):
    """The exact script that draws the figure, exported verbatim."""
    settings = normalise(options)
    settings["font"] = settings["font"] or available_font()
    return (_SCRIPT_PRELUDE
            + pprint.pformat(settings, indent=4, width=88, sort_dicts=True)
            + _SCRIPT_HELPERS
            + _BODIES[settings["kind"]])


# ---------------------------------------------------------------------------
# Backwards-compatible helpers. `cooccurrence` is kept because callers and
# tests use it directly, but the counting now lives in `analyze`.
# ---------------------------------------------------------------------------

def cooccurrence(project, options=None):
    """Co-occurrence over a project, in the shape callers already expect."""
    options = options or {}
    mode = options.get("mode")
    if mode not in analyze.COOCCURRENCE_MODES:
        # The old surface called this "unit"; paragraph units map onto it.
        mode = "unit" if options.get("unit") == "paragraph" else "overlap"
    rows = analyze.tidy(project)
    case_text = {d["name"]: d["text"] for d in project.get("documents", [])}
    limit = options.get("top")
    result = analyze.cooccurrence(rows, mode=mode, case_text=case_text,
                                  limit=int(limit) if limit else None)
    result["units"] = len({r["case"] for r in rows})
    return result


def matrix_csv(result):
    """A square matrix as CSV, header row included."""
    stream = io.StringIO(newline="")
    writer = csv.writer(stream)
    writer.writerow([""] + result["labels"])
    for name, row in zip(result["labels"], result["matrix"]):
        writer.writerow([name] + row)
    return stream.getvalue()


# ---------------------------------------------------------------------------
# Render and bundle
# ---------------------------------------------------------------------------

def _require_stack():
    state = availability()
    if not state["available"]:
        raise RuntimeError("The plotting workbench needs " + ", ".join(state["missing"])
                           + ". Install it with: " + state["install"])


def _prepare(project, options, root):
    """Write the data and the script into root, then run the script.

    One path for preview and export: they cannot disagree, because they are the
    same file. Returns the produced files keyed by filename.
    """
    options = normalise(options)
    rows = analyze.tidy(project)
    if not rows:
        raise ValueError("There is nothing to plot yet: code a few passages first.")

    # Co-occurrence by paragraph needs the transcripts; by overlap does not.
    # Supplying it either way keeps `mode` an honest choice rather than one that
    # fails on a missing argument.
    case_text = {d["name"]: d["text"] for d in project.get("documents", [])}

    data = _dataset(rows, options, case_text)
    if len(data.strip().splitlines()) < 2:
        raise ValueError("This figure has no data at this setting; widen the filter.")

    (root / "figure_data.csv").write_text(data, encoding="utf-8")
    (root / "figure.py").write_text(build_script(options), encoding="utf-8")

    finished = subprocess.run([sys.executable, str(root / "figure.py")],
                              capture_output=True, text=True, timeout=300, cwd=str(root))
    if finished.returncode != 0:
        tail = (finished.stderr or "").strip().splitlines()
        raise RuntimeError("The figure script failed: " + (tail[-1] if tail else "no output"))

    produced = {}
    for ext in FIGURE_EXTENSIONS:
        path = root / ("%s.%s" % (options["name"], ext))
        if not path.exists():
            raise RuntimeError("The figure script produced no %s output." % ext)
        produced[path.name] = path.read_bytes()
    for name in SIDECAR_FILES:
        produced[name] = (root / name).read_bytes()
    return produced, _result(rows, options, case_text)


def render(project, options=None):
    """The preview: the figure that the exported script produces."""
    _require_stack()
    with tempfile.TemporaryDirectory(prefix="qualicraft-plot-") as workdir:
        root = Path(workdir)
        produced, result = _prepare(project, options, root)
        options = normalise(options)
        return produced["%s.svg" % options["name"]].decode("utf-8"), result


def bundle(project, options=None):
    """The export: data, script and finished figures, ready for a co-author."""
    _require_stack()
    with tempfile.TemporaryDirectory(prefix="qualicraft-plot-") as workdir:
        root = Path(workdir)
        return _prepare(project, options, root)
