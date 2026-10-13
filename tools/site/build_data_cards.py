"""The site's dataset cards, generated from qualicraft/datasets.py.

The brief is that the site must not keep a second copy of the dataset list:
`qualicraft/datasets.py` is the source of truth, so this script reads it and
writes `website/lib/site/data-cards.json`, which is the only thing the page
reads. Run it again after any change to SOURCES.

    python tools/site/build_data_cards.py

The SHA-256 shown on each card is the short form of the file's real hash: the
copy in data/datasets/ is hashed here and checked against the value recorded
in SOURCES, so a card can never claim a hash the bytes do not carry. A file
that is absent locally falls back to the recorded value and is marked as
such rather than silently presented as verified.
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO))

from qualicraft import datasets  # noqa: E402

OUT = REPO / "website" / "lib" / "site" / "data-cards.json"
DATA_DIR = REPO / "data" / "datasets"

# One line per dataset, transcribed from the module docstring of
# qualicraft/datasets.py (each sentence there describes what the file is for).
# Kept here rather than parsed: prose is not a stable interface, and the
# transcription is reviewed against the docstring when SOURCES changes.
PURPOSE = {
    "A": "Coded passages without transcripts — exercises the importer and the figure benchmarks.",
    "B": "Transcripts, a three-level codebook and offsets that verify — the corpus behind the demo and the worked example.",
    "C": "A second coding table in a different exporter's shape — the importer has to survive it.",
    "D": "A frequency report across many theme sheets, no transcript — hierarchy and frequency figures only.",
    "E": "A small category and subcategory table — a fixture for the hierarchy figure.",
}

SHORT = 12


def short_sha(path: Path) -> tuple[str, bool]:
    """(short hash, verified_against_local_file)."""
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    return digest[:SHORT], True


def main() -> int:
    cards = []
    for name, (url, sha, meta) in datasets.SOURCES.items():
        local = DATA_DIR / name
        if local.is_file():
            actual = hashlib.sha256(local.read_bytes()).hexdigest()
            if actual != sha:
                print(f"  HASH MISMATCH {name}: recorded {sha[:SHORT]}…, "
                      f"on disk {actual[:SHORT]}… — refusing to write a card for it")
                return 1
            short, verified = actual[:SHORT], True
        else:
            short, verified = sha[:SHORT], False
            print(f"  note: {name} is not in {DATA_DIR}; the card carries the "
                  f"recorded hash and is marked unverified")
        cards.append({
            "id": meta["id"],
            "file": name,
            "title": meta["title"],
            "author": meta["author"],
            "year": meta["year"],
            "doi": meta.get("doi", ""),
            "licence": meta["licence"],
            "licence_url": meta["licence_url"],
            "share_alike": bool(meta.get("share_alike")),
            "language": meta.get("language", ""),
            "sha256_short": short,
            "sha256_verified": verified,
            "purpose": PURPOSE.get(meta["id"], ""),
        })
    cards.sort(key=lambda c: c["id"])
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"source": "qualicraft/datasets.py",
                               "cards": cards}, indent=1, ensure_ascii=False) + "\n",
                   encoding="utf-8")
    print(f"  wrote {OUT} ({len(cards)} cards)")
    for card in cards:
        print(f"    {card['id']}  {card['title'][:58]}  "
              f"{card['licence']}  sha256:{card['sha256_short']}"
              f"{'' if card['sha256_verified'] else ' (recorded, not on disk)'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
