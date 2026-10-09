"""Publication figures, drawn by a script rather than by the browser.

Two decisions shape this module.

**A script draws the figure, and the preview is that script's output.** There is
only one renderer, so "the exported code reproduces the figure" holds by
construction rather than by careful maintenance of two parallel drawing paths.

**matplotlib / seaborn / scipy are optional.** The rest of QualiCraft runs on the
standard library alone. This module reports its own absence instead of failing,
so the plotting block stays switched off until the researcher installs them.

The export is a bundle, not just an image: the matrix as CSV, the script, and the
finished figures. The CSV is the part that is hard to reconstruct; the script is
short because the counting is already done.
"""
import csv
import importlib.util
import io
import pprint
import re
import subprocess
import sys
import tempfile
from pathlib import Path

REQUIRED = ("matplotlib", "seaborn", "scipy")

INSTALL_HINT = "pip install matplotlib seaborn scipy"

PLOT_KINDS = ("cooccurrence",)

PALETTES = ("viridis", "rocket", "mako", "flare", "crest", "Blues", "Reds")

CLUSTER_METHODS = ("ward", "complete", "average", "single")

DEFAULT_OPTIONS = {
    "level": "theme",
    "unit": "paragraph",
    "palette": "viridis",
    "cluster": True,
    "method": "ward",
    "annotate": True,
    "fontsize": 9,
    "figsize": 8.0,
    "title": "",
    "dpi": 300,
}

BUNDLE_FILES = ("figure_data.csv", "figure.py", "figure.svg", "figure.pdf", "figure.png")


def availability():
    """Whether the optional plotting stack is importable."""
    missing = [name for name in REQUIRED if importlib.util.find_spec(name) is None]
    return {
        "available": not missing,
        "missing": missing,
        "install": INSTALL_HINT if missing else "",
    }


def normalise(options):
    """Coerce incoming options into the supported range."""
    merged = dict(DEFAULT_OPTIONS)
    for key, value in (options or {}).items():
        if key in merged and value is not None:
            merged[key] = value
    if merged["level"] not in ("theme", "code"):
        merged["level"] = "theme"
    if merged["unit"] not in ("paragraph", "document"):
        merged["unit"] = "paragraph"
    if merged["palette"] not in PALETTES:
        merged["palette"] = "viridis"
    if merged["method"] not in CLUSTER_METHODS:
        merged["method"] = "ward"
    merged["cluster"] = bool(merged["cluster"])
    merged["annotate"] = bool(merged["annotate"])
    try:
        merged["fontsize"] = max(5, min(20, int(merged["fontsize"])))
    except (TypeError, ValueError):
        merged["fontsize"] = DEFAULT_OPTIONS["fontsize"]
    try:
        merged["figsize"] = max(3.0, min(20.0, float(merged["figsize"])))
    except (TypeError, ValueError):
        merged["figsize"] = DEFAULT_OPTIONS["figsize"]
    try:
        merged["dpi"] = max(72, min(1200, int(merged["dpi"])))
    except (TypeError, ValueError):
        merged["dpi"] = DEFAULT_OPTIONS["dpi"]
    merged["title"] = str(merged["title"] or "")[:200]
    return merged


def _paragraph_ranges(text):
    """Character ranges of the transcript's segments.

    Splits on non-empty lines, which is how the reader and the model prompts cut a
    transcript up. Counting over the same units the researcher sees on screen
    matters: a blank-line split would put a whole interview in one unit and every
    pair would co-occur exactly once.
    """
    return [(m.start(), m.end()) for m in re.finditer(r"[^\r\n]+", text) if m.group().strip()]


def _units(project, unit):
    """A unit is what two codes have to share in order to count as co-occurring."""
    units = []
    for document in project["documents"]:
        if unit == "document":
            units.append((document["id"], 0, len(document["text"])))
        else:
            for start, end in _paragraph_ranges(document["text"]):
                units.append((document["id"], start, end))
    return units


def _theme_of(project, code_id):
    """The top-level theme a code belongs to, or the code itself when it has no parent."""
    by_id = {c["id"]: c for c in project["codes"]}
    seen, current = {code_id}, by_id.get(code_id)
    while current and current.get("parent_id") and current["parent_id"] in by_id:
        if current["parent_id"] in seen:
            break
        seen.add(current["parent_id"])
        current = by_id[current["parent_id"]]
    return current["id"] if current else code_id


def cooccurrence(project, options=None):
    """How often each pair of codes (or themes) shares a unit.

    The diagonal is the number of units the code appears in, so the matrix is
    informative on its own and not only as a heatmap.
    """
    options = normalise(options)
    level, unit = options["level"], options["unit"]
    by_id = {c["id"]: c for c in project["codes"]}

    target = {}
    for code in project["codes"]:
        target[code["id"]] = _theme_of(project, code["id"]) if level == "theme" else code["id"]

    labels = sorted({by_id[cid]["name"] for cid in target.values() if cid in by_id})
    index = {name: i for i, name in enumerate(labels)}
    size = len(labels)
    matrix = [[0] * size for _ in range(size)]

    units = _units(project, unit)
    for document_id, start, end in units:
        present = set()
        for annotation in project["annotations"]:
            if annotation["document_id"] != document_id:
                continue
            if annotation["end"] <= start or annotation["start"] >= end:
                continue
            name = by_id.get(target.get(annotation["code_id"], ""), {}).get("name")
            if name in index:
                present.add(name)
        for left in present:
            for right in present:
                matrix[index[left]][index[right]] += 1

    return {"labels": labels, "matrix": matrix, "level": level, "unit": unit, "units": len(units)}


def matrix_csv(result):
    """The matrix as CSV, so the exported script needs nothing but the file."""
    stream = io.StringIO(newline="")
    writer = csv.writer(stream)
    writer.writerow([""] + result["labels"])
    for name, row in zip(result["labels"], result["matrix"]):
        writer.writerow([name] + row)
    return stream.getvalue()


def build_script(options=None):
    """The exact script that draws the figure, exported verbatim."""
    settings = pprint.pformat(normalise(options), indent=4, width=88, sort_dicts=True)
    return '''#!/usr/bin/env python3
"""Theme co-occurrence heatmap for a QualiCraft project.

This is the script that drew the figure you were looking at, exported unchanged.

    pip install matplotlib seaborn scipy
    python figure.py        # writes figure.svg, figure.pdf and figure.png

figure_data.csv holds the counts; nothing else about the project is needed, so
this folder can be handed to a co-author as it stands. Edit SETTINGS and re-run
to change the figure.
"""
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from scipy.cluster.hierarchy import linkage
from scipy.spatial.distance import squareform

SETTINGS = ''' + settings + '''

HERE = Path(__file__).resolve().parent


def main():
    counts = pd.read_csv(HERE / "figure_data.csv", index_col=0)
    counts = counts.astype(float)

    # The diagonal counts passages a code appears in, which is always the largest
    # number in its row. Left as is it would dominate the colour scale, so the
    # diagonal is lifted to the maximum and the rest of the matrix drives the ramp.
    square = counts.values.copy()
    peak = square.max() if square.size else 1.0
    np.fill_diagonal(square, peak)

    order = None
    if SETTINGS["cluster"] and len(counts) > 1:
        distance = peak - square
        np.fill_diagonal(distance, 0.0)
        distance = (distance + distance.T) / 2.0
        order = linkage(squareform(distance, checks=False), method=SETTINGS["method"])

    sns.set_theme(style="white", font_scale=SETTINGS["fontsize"] / 9.0)
    grid = sns.clustermap(
        pd.DataFrame(square, index=counts.index, columns=counts.columns),
        row_linkage=order,
        col_linkage=order,
        cmap=SETTINGS["palette"],
        annot=SETTINGS["annotate"],
        fmt=".0f",
        linewidths=0.5,
        linecolor="white",
        figsize=(SETTINGS["figsize"], SETTINGS["figsize"] * 0.88),
        cbar_kws={"label": "passages in common"},
        dendrogram_ratio=0.14 if SETTINGS["cluster"] else 0.0,
    )
    grid.ax_heatmap.set_xlabel("")
    grid.ax_heatmap.set_ylabel("")
    plt.setp(grid.ax_heatmap.get_xticklabels(), rotation=45, ha="right", rotation_mode="anchor")

    if SETTINGS["title"]:
        grid.figure.suptitle(SETTINGS["title"], y=1.02)

    grid.figure.savefig(HERE / "figure.svg", bbox_inches="tight")
    grid.figure.savefig(HERE / "figure.pdf", bbox_inches="tight")
    grid.figure.savefig(HERE / "figure.png", dpi=SETTINGS["dpi"], bbox_inches="tight")
    print(json.dumps({"ok": True, "codes": int(len(counts))}))


if __name__ == "__main__":
    main()
'''


def _require_stack():
    state = availability()
    if not state["available"]:
        raise RuntimeError("The plotting workbench needs " + ", ".join(state["missing"])
                           + ". Install it with: " + state["install"])


def _produce(project, options, root):
    """Write the data and the script into root and run it. One path for preview and export."""
    options = normalise(options)
    result = cooccurrence(project, options)
    if not result["labels"]:
        raise ValueError("There is nothing to plot yet: code a few passages first.")

    (root / "figure_data.csv").write_text(matrix_csv(result), encoding="utf-8")
    (root / "figure.py").write_text(build_script(options), encoding="utf-8")

    finished = subprocess.run([sys.executable, str(root / "figure.py")],
                              capture_output=True, text=True, timeout=300, cwd=str(root))
    if finished.returncode != 0:
        tail = (finished.stderr or "").strip().splitlines()
        raise RuntimeError("The figure script failed: " + (tail[-1] if tail else "no output"))
    if not (root / "figure.svg").exists():
        raise RuntimeError("The figure script produced no output.")
    return result


def render(project, options=None):
    """The preview: the figure that the exported script produces."""
    _require_stack()
    with tempfile.TemporaryDirectory(prefix="qualicraft-plot-") as workdir:
        root = Path(workdir)
        result = _produce(project, options, root)
        return (root / "figure.svg").read_text(encoding="utf-8"), result


def bundle(project, options=None):
    """The export: data, script and finished figures, ready for a co-author."""
    _require_stack()
    with tempfile.TemporaryDirectory(prefix="qualicraft-plot-") as workdir:
        root = Path(workdir)
        result = _produce(project, options, root)
        files = {name: (root / name).read_bytes() for name in BUNDLE_FILES}
        return files, result
