"""
Build the data behind /report: figures and counts, exported from the
workbench's own plotting path into website/public/report/.

The report page does not draw anything itself. Every figure is produced by
`qualicraft.plotting.bundle()` — the same code path the workbench's export
button uses — so the site cannot drift from the tool. The unit sentence in
each caption is read from plotting's CREDIT constants here, once, and
carried in the manifest; the page renders what the manifest says.

A manifest.json travels with the files: the commit, the time, the command,
the project it came from, and the SHA-256 of every file written. The site's
tests re-hash the files on disk and fail on a mismatch, so a stale figure
cannot pass for a current one.

    python tools/report/build_assets.py

Reads:  demo-data/qualicraft.sqlite3 (the public Bologna corpus, CC0)
Writes: website/public/report/figures/*.svg, *.csv, manifest.json
"""
from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO))

DEMO_DB = REPO / "demo-data" / "qualicraft.sqlite3"
OUT = REPO / "website" / "public" / "report"
FIGURES = OUT / "figures"

# The five figure kinds, in the order the report shows them.
KINDS = [
    ("frequency", "Code frequency"),
    ("coverage", "Code × interview"),
    ("cooccurrence", "Co-occurrence heatmap"),
    ("hierarchy", "Theme hierarchy"),
    ("accumulation", "Code accumulation"),
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def credit_for(kind: str, mode: str, plotting) -> str:
    """The unit sentence from the workbench's own constants — never written
    a second time on the site."""
    if kind == "cooccurrence":
        return plotting.CREDIT_COOCCURRENCE[mode]
    return plotting.CREDIT_DEFAULTS[kind]


def main() -> int:
    from qualicraft import plotting
    from qualicraft.core import Store

    if not DEMO_DB.exists():
        print(f"  FAIL {DEMO_DB} is missing — the demo corpus ships it")
        return 1
    store = Store(str(DEMO_DB))
    projects = store.list()
    if not projects:
        print("  FAIL the demo database holds no project")
        return 1
    project = store.get(projects[0]["id"])
    print(f"  project {project['name']!r}: {len(project['documents'])} documents, "
          f"{len(project['codes'])} codes, {len(project['annotations'])} codings")

    FIGURES.mkdir(parents=True, exist_ok=True)
    for stale in FIGURES.glob("*"):
        stale.unlink()
    if (OUT / "manifest.json").exists():
        (OUT / "manifest.json").unlink()

    commit = subprocess.run(["git", "rev-parse", "HEAD"], cwd=REPO,
                            capture_output=True, text=True).stdout.strip()
    source_paths = ["qualicraft/plotting.py", "qualicraft/analyze.py", "tools/report/build_assets.py"]
    dirty = subprocess.run(["git", "status", "--porcelain", "--", *source_paths], cwd=REPO,
                           capture_output=True, text=True, check=True).stdout
    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "commit": commit,
        # Generated before the workflow's local commit. Hash the exact sources
        # rather than implying HEAD already contains any uncommitted fix.
        "working_tree_dirty": bool(dirty),
        "source_files": {name: sha256(REPO / name) for name in source_paths},
        "command": "python tools/report/build_assets.py",
        "source": "demo-data/qualicraft.sqlite3",
        "project": {
            "name": project["name"],
            "documents": len(project["documents"]),
            "codes": len(project["codes"]),
            "codings": len(project["annotations"]),
        },
        "figures": [],
        "files": [],
    }

    for kind, label in KINDS:
        options = {"kind": kind}
        try:
            files, numbers = plotting.bundle(project, options)
        except (ValueError, RuntimeError) as exc:
            # A figure with no data at its default setting is recorded as
            # absent rather than quietly dropped: the report page must show
            # the same set the export produced.
            manifest["figures"].append({"kind": kind, "label": label,
                                        "error": str(exc)})
            print(f"  {kind:14s} not drawn — {exc}")
            continue
        svg_name = next(n for n in files if n.endswith(".svg"))
        csv_name = next(n for n in files if n.endswith(".csv"))
        mode = numbers.get("mode", "overlap")
        (FIGURES / f"{kind}.svg").write_bytes(files[svg_name])
        (FIGURES / f"{kind}.csv").write_bytes(files[csv_name])
        manifest["figures"].append({
            "kind": kind, "label": label,
            "credit": credit_for(kind, mode, plotting),
            "svg": f"figures/{kind}.svg", "csv": f"figures/{kind}.csv",
            "numbers": numbers,
        })
        print(f"  {kind:14s} {svg_name} + {csv_name} — {numbers.get('codings')} codings")

    for path in sorted(FIGURES.glob("*")):
        manifest["files"].append({"path": f"figures/{path.name}",
                                  "bytes": path.stat().st_size,
                                  "sha256": sha256(path)})
    manifest_path = OUT / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=1, ensure_ascii=False),
                             encoding="utf-8")
    print(f"  wrote {manifest_path}")
    print(f"  {len(manifest['files'])} files, manifest at commit {commit[:12]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
