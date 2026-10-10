#!/usr/bin/env python3
"""Generate the five reference figures from the two public datasets.

Run:  python tools/make_examples.py [output-dir]

Each figure lands in its own folder with the counts as CSV, the reproduction
script, and PNG / SVG / PDF output. The figure titles, subtitles and credit
lines mirror the reviewed examples so the two can be compared side by side.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from qualicraft import datasets, ingest, plotting  # noqa: E402

DEFAULT_OUT = ROOT / "examples"


def _credit(name, adapted=True):
    return datasets.credit(name, adapted=adapted)


def build(out_dir):
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    print("Importing datasets ...")
    project_a = ingest.from_openqda_csv(datasets.ensure("open_science.csv"))
    project_c = ingest.from_nvivo_csv(datasets.ensure("nvivo.csv"))
    print("  A: %d files, %d codes, %d codings"
          % (len(project_a["documents"]), len(project_a["codes"]), len(project_a["annotations"])))
    print("  C: %d sections, %d codes, %d codings"
          % (len(project_c["documents"]), len(project_c["codes"]), len(project_c["annotations"])))

    jobs = [
        ("fig1_code_frequency", project_a, {
            "kind": "frequency", "top": 15,
            "title": "Fig 1. Top 15 codes by frequency",
            "subtitle": "Open Science interviews: 26 files, 837 assignments, 39 distinct codes. "
                        "Counts are coding rows, not participants.",
            "credit": _credit("open_science.csv"),
        }),
        ("fig2_code_by_case_heatmap", project_a, {
            "kind": "coverage", "top": 12,
            "title": "Fig 2. Code-by-interview matrix",
            "subtitle": "Top 12 codes. Zero means no assignment in this exported coding table. "
                        "Column order is filename order, not interview chronology.",
            "credit": _credit("open_science.csv"),
        }),
        ("fig3_code_cooccurrence", project_a, {
            "kind": "cooccurrence", "top": 12, "mode": "overlap",
            "title": "Fig 3. Code co-occurrence",
            "subtitle": "Top 12 codes. Co-occurrence = overlapping character ranges "
                        "within the same interview. Diagonal = codings of that code.",
            "credit": _credit("open_science.csv"),
        }),
        ("fig4_theme_hierarchy", project_c, {
            "kind": "hierarchy",
            "title": "Fig 4. Themes and named subthemes",
            "subtitle": "One panel per report section; one bar per report subsection. "
                        "Total: 1,008 coded extracts.",
            "credit": _credit("nvivo.csv"),
        }),
        ("fig5_saturation", project_a, {
            "kind": "accumulation",
            "title": "Fig 5. Code accumulation curve",
            "subtitle": "Illustration only: file order is not interview chronology; "
                        "a plateau does not prove thematic saturation.",
            "credit": _credit("open_science.csv"),
        }),
    ]

    made = []
    for name, project, options in jobs:
        options = dict(options, name=name)
        folder = out_dir / name
        folder.mkdir(parents=True, exist_ok=True)
        files, result = plotting.bundle(project, options)
        for filename, payload in files.items():
            (folder / filename).write_bytes(payload)
        made.append(name)
        print("  %-28s -> %s" % (name, folder.relative_to(out_dir.parent)))
    return made


if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_OUT
    names = build(target)
    print("\nGenerated %d figures in %s" % (len(names), target))
