"""Public qualitative-coding datasets, downloaded once and verified by hash.

Five datasets, each answering a different question:

* A (OpenQDA CSV) and C (NVivo CSV) are coding tables without transcripts —
  parser tests and figure benchmarks.
* B (QualCoder) is the only one that ships real transcripts *and* a three-level
  codebook *and* 903 codings whose offsets verify against the text. It is the
  dataset that can carry a genuine coding walkthrough, so it is the one the
  usability scenarios use.
* D (ATLAS.ti) is a frequency report across 73 theme sheets, with no transcript.
* E (FAIRqual) is a small category/subcategory/code table, useful as a fixture.

Data quality differs, and that is the point of collecting them: the importers
have to survive all of it, not just the tidy cases.

Why a checksum and not just a download: these files are the ground truth for
the plotting tests. If an upstream record is re-uploaded and the numbers shift,
a silent download would make the figures disagree with the reviewed examples
without anyone noticing. A hash mismatch fails loudly instead.

Licences travel with the data. Every figure that uses a dataset writes the
attribution from here into its credit line, so the two cannot drift apart.

Source A is CC BY-SA 4.0 — ShareAlike. Anything derived from it must carry the
same licence; that is recorded in `share_alike` so callers can warn.
"""
from __future__ import annotations

import hashlib
import shutil
import subprocess
from pathlib import Path
from urllib.request import urlopen

DATA_DIR = Path(__file__).resolve().parent.parent / "data" / "datasets"

# name -> (url, sha256, metadata)
SOURCES = {
    "open_science.csv": (
        "https://zenodo.org/api/records/17588655/files/"
        "OS_Interviews_Coded_Passages_OpenQDA_12_11_2025.csv/content",
        "e4c5774b3703c5155491c3113e4607b543d7f204c22e8b84b05562388c5b86c9",
        {
            "id": "A",
            "title": "Semi-structured interviews with linguists about Open Science",
            "author": "Elen Le Foll",
            "year": 2025,
            "doi": "10.5281/zenodo.17588655",
            "licence": "CC BY-SA 4.0",
            "licence_url": "https://creativecommons.org/licenses/by-sa/4.0/",
            "share_alike": True,
            "language": "English (25 files) + German (1)",
            "expected_rows": 837,
            "expected_codes": 39,
            "expected_files": 26,
        },
    ),
    "nvivo.csv": (
        "https://zenodo.org/api/records/5512420/files/"
        "Interview%20coding%20summary%20anonymised.csv/content",
        "1203623209318d3c35111a29b804e0103313a9a291a44bc418e7d0d46d619fba",
        {
            "id": "C",
            "title": "Publishing Reproducible Research Outputs — thematic coding",
            "author": "Lucia Loffreda & Andrea Chiarelli",
            "year": 2021,
            "doi": "10.5281/zenodo.5512420",
            "licence": "CC BY 4.0",
            "licence_url": "https://creativecommons.org/licenses/by/4.0/",
            "share_alike": False,
            "language": "English",
            "expected_rows": 1008,
            "expected_codes": None,
            "expected_files": None,
            "encoding": "cp1252",
        },
    ),
    "bologna_qda.zip": (
        "https://zenodo.org/api/records/6123290/files/Analysis_GTM.qda.zip/content",
        "b41044d9801ba854ea68893f3a1b17678ee6c8500f2ea7e3d811fca2ceedc3c6",
        {
            "id": "B",
            "title": "What do we mean by 'data' in the arts and humanities? "
                     "Interview transcripts (University of Bologna)",
            "author": "Gualandi, Bianca; Pareschi, Luca; Peroni, Silvio",
            "year": 2022,
            "doi": "10.5281/zenodo.6123290",
            "licence": "CC0 1.0",
            "licence_url": "https://creativecommons.org/publicdomain/zero/1.0/",
            "share_alike": False,
            "language": "Italian",
            "archive": "zip",
            # The only dataset with transcripts, a three-level codebook and
            # offsets that verify against the text.
            "expected_documents": 19,
            "expected_codings": 903,
            "expected_codes": 263,
            "expected_categories": 54,
        },
    ),
    "atlas_report.xlsx": (
        "https://zenodo.org/api/records/10116088/files/"
        "2023.11_InterviewCodeAnalysis.xlsx/content",
        "51811fd65faef0766526762a17f9cb8f52ef409d34ad5a9d38137f82204567dc",
        {
            "id": "D",
            "title": "Interview Code Analysis (healthcare professionals)",
            "author": "Wosny, Marie",
            "year": 2023,
            "doi": "10.5281/zenodo.10116088",
            "licence": "CC BY 4.0",
            "licence_url": "https://creativecommons.org/licenses/by/4.0/",
            "share_alike": False,
            "language": "English",
            "spreadsheet": True,
            "note": "A frequency report across 73 theme sheets. No transcript is "
                    "included, so it supports the hierarchy and frequency figures "
                    "only, not coding walkthroughs.",
        },
    ),
    "fairqual_codebook.xlsx": (
        "https://raw.githubusercontent.com/fairqual/dataitd24/0.1.0/data-raw/"
        "codebook_fairqual_workshop_itd24.xlsx",
        "34cde62787d33847500fece23e6498c425eb920145ace9d3a7482c377178fbc7",
        {
            "id": "E",
            "title": "FAIRqual workshop codebook",
            "author": "FAIRqual project",
            "year": 2024,
            "doi": "github.com/fairqual/dataitd24",
            "licence": "CC BY 4.0",
            "licence_url": "https://creativecommons.org/licenses/by/4.0/",
            "share_alike": False,
            "language": "English",
            "spreadsheet": True,
            "note": "A category/subcategory/code table used as a small fixture "
                    "for the hierarchy and frequency figures.",
        },
    ),
}


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def _download(url, path, timeout=60, attempts=3):
    """Fetch `url` to `path`.

    curl is tried first because it honours the same proxy configuration as the
    rest of the machine and retries a flaky gateway cleanly. `--fail` matters:
    without it a 504 body would be written to disk as if it were the dataset,
    and the hash check would report a confusing mismatch instead of a network
    problem. urllib is the fallback for environments without curl.
    """
    curl = shutil.which("curl")
    if curl:
        last = ""
        for _ in range(attempts):
            done = subprocess.run(
                [curl, "-sL", "--fail", "--retry", "2", "--retry-delay", "2",
                 "--max-time", str(timeout), "-o", str(path), url],
                capture_output=True, text=True,
            )
            if done.returncode == 0 and path.exists() and path.stat().st_size > 0:
                return
            last = (done.stderr or "").strip() or "exit %d" % done.returncode
        raise RuntimeError("Could not download %s (%s)" % (url, last))
    with urlopen(url, timeout=timeout) as response:
        path.write_bytes(response.read())


def ensure(name, directory=None, timeout=60):
    """Download `name` if absent and return its path. Raises on hash mismatch.

    An existing file is still re-hashed on every call: a corrupted cache should
    surface at the point of use, not silently feed the figures.
    """
    if name not in SOURCES:
        raise KeyError("Unknown dataset: " + name)
    url, digest, _meta = SOURCES[name]
    root = Path(directory) if directory else DATA_DIR
    root.mkdir(parents=True, exist_ok=True)
    path = root / name
    if not path.exists():
        _download(url, path, timeout)
    actual = sha256(path)
    if actual != digest:
        raise ValueError(
            "%s: checksum differs from the reviewed data "
            "(expected %s, got %s). Delete %s and re-download, or review the "
            "upstream record before use." % (name, digest[:12], actual[:12], path)
        )
    return path


def meta(name):
    """Licence and provenance metadata for a dataset."""
    return dict(SOURCES[name][2])


def credit(name, adapted=True):
    """The one-line attribution that goes into a figure's credit field."""
    m = meta(name)
    suffix = " Adapted for this example; not a study conclusion." if adapted else ""
    # A Zenodo DOI reads better as the record number; a GitHub path reads
    # better as it stands.
    where = ("Zenodo %s" % m["doi"].split(".")[-1]) if m["doi"].startswith("10.") else m["doi"]
    return "Source: %s (%d), %s, %s.%s" % (m["author"], m["year"], where, m["licence"], suffix)


def extract(name, directory=None):
    """Unpack an archive dataset and return the directory it unpacked into.

    Extraction is verified the same way the download is: the archive's hash is
    checked first, so a corrupted cache cannot quietly produce a different
    corpus.
    """
    import zipfile
    archive = ensure(name, directory)
    root = Path(directory) if directory else DATA_DIR
    target = root / (Path(name).stem + "_unpacked")
    marker = target / ".complete"
    if not marker.exists():
        target.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(archive) as zf:
            for member in zf.namelist():
                # Refuse absolute paths and parent traversal in the archive.
                if member.startswith("/") or ".." in Path(member).parts:
                    raise ValueError("Refusing to extract %r from %s" % (member, name))
            zf.extractall(target)
        marker.write_text(sha256(archive), encoding="utf-8")
    return target


def fetch_all(directory=None):
    """Download every dataset. Returns {name: path}."""
    return {name: ensure(name, directory) for name in SOURCES}


if __name__ == "__main__":
    for name, path in fetch_all().items():
        m = meta(name)
        print("%-18s %s  [%s %s]" % (name, path, m["id"], m["licence"]))
