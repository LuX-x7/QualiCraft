"""
Prepare the site's self-hosted fonts: download, subset to Latin, write WOFF2.

The design system requires the fonts to travel with the repository — no
runtime request to a font CDN, and no font whose licence is not on disk.
Both fonts are SIL Open Font License 1.1; the licence text is copied next
to the binaries so the two cannot drift apart.

Subsetting is Latin plus the punctuation the site actually sets (dashes,
quotes, bullet, middot, arrows, comparison signs, multiplication sign).
The subset keeps the variable-weight axis, so one file per family covers
the whole weight range through `font-weight` in the @font-face rule.

    python tools/site/prepare_fonts.py

Output: website/public/fonts/<Family>-latin.woff2 + the two OFL.txt files.
"""
from __future__ import annotations

import hashlib
import subprocess
import sys
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "website" / "public" / "fonts"
CACHE = Path.home() / "qualicraft-review" / "fonts-cache"

# (file, url, licence url, licence file). Google Fonts' repository is the
# upstream both families are published from; the OFL.txt beside each family
# is the licence that applies to what we ship.
FONTS = [
    ("SourceSerif4-latin.woff2",
     "https://raw.githubusercontent.com/google/fonts/main/ofl/sourceserif4/"
     "SourceSerif4%5Bopsz%2Cwght%5D.ttf",
     "https://raw.githubusercontent.com/google/fonts/main/ofl/sourceserif4/OFL.txt",
     "OFL-SourceSerif4.txt"),
    ("JetBrainsMono-latin.woff2",
     "https://raw.githubusercontent.com/google/fonts/main/ofl/jetbrainsmono/"
     "JetBrainsMono%5Bwght%5D.ttf",
     "https://raw.githubusercontent.com/google/fonts/main/ofl/jetbrainsmono/OFL.txt",
     "OFL-JetBrainsMono.txt"),
]

UNICODES = ("U+0000-00FF,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,"
            "U+2026,U+00B7,U+2192,U+2264,U+2265,U+00D7,U+2212")


def fetch(url: str, path: Path) -> None:
    if path.exists() and path.stat().st_size > 0:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=60) as response:
        path.write_bytes(response.read())


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, url, licence_url, licence_file in FONTS:
        source = CACHE / Path(url).name.replace("%5B", "[").replace("%5D", "]")
        source = CACHE / f"{name.split('-')[0]}.ttf"
        fetch(url, source)
        target = OUT / name
        cmd = [sys.executable, "-m", "fontTools.subset", str(source),
               "--output-file", str(target), "--flavor=woff2",
               f"--unicodes={UNICODES}",
               "--layout-features=kern,liga",
               "--name-IDs=1,2,3,4,5,6"]
        done = subprocess.run(cmd, capture_output=True, text=True)
        if done.returncode != 0:
            print(f"  FAIL subsetting {source.name}: {done.stderr.strip()[:200]}")
            return 1
        licence = OUT / licence_file
        fetch(licence_url, licence)
        print(f"  {name:28s} {target.stat().st_size:>7,d} B   "
              f"source sha256 {hashlib.sha256(source.read_bytes()).hexdigest()[:12]}…")
        print(f"  {licence_file:28s} {licence.stat().st_size:>7,d} B   (OFL 1.1)")
    print(f"  wrote {len(FONTS) * 2} files to {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
