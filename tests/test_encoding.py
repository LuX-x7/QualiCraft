"""UTF-8 round-trips, because the trial machines are not this one.

Every read and write in the package passes encoding="utf-8" explicitly rather
than relying on the platform default. On macOS and Linux that default is UTF-8
already, so a missing encoding argument cannot be caught here; on Windows it is
the ANSI code page, and a corpus with accented Italian or any Chinese codebook
name would come back mangled. These tests pin the behaviour that the explicit
argument buys, and the static check below catches a future call site that
forgets it.

Windows itself has not been tested — this file does not change that.
"""
import re
import unittest
from pathlib import Path

from qualicraft.core import Store, csv_export, new_project
from qualicraft import plotting

REPO = Path(__file__).resolve().parent.parent

# Accented Italian, because the demonstration corpus is Italian; CJK, because
# the interface and the codebook can both be Chinese.
SAMPLE = "Perché è così, però — à è é ì ò ù. 编码本：关于数据共享的引文。"


def text_calls_without_encoding(source):
    """Text-mode open()/read_text()/write_text() with no encoding argument."""
    offenders = []
    for number, line in enumerate(source.splitlines(), 1):
        if re.search(r"(open\(|read_text\(|write_text\()", line) and "encoding" not in line:
            # Binary mode has no encoding to give, and neither do the network
            # helpers, which take their own text handling.
            if re.search(r"""['"](rb|wb|ab)['"]""", line):
                continue
            if re.search(r"(urlopen|opener\.open|webbrowser|os\.open|Image\.open\(io\.BytesIO)", line):
                continue
            offenders.append((number, line.strip()))
    return offenders


class EncodingTests(unittest.TestCase):
    def setUp(self):
        import shutil, tempfile
        self.root = Path(tempfile.mkdtemp(prefix="qc-utf8-"))
        self._shutil = shutil

    def tearDown(self):
        self._shutil.rmtree(self.root, ignore_errors=True)

    def test_a_project_round_trips_through_disk(self):
        store = Store(self.root / "qualicraft.sqlite3")
        project = new_project("编码本 · perché")
        project["documents"].append({
            "id": "d1", "name": "intervista à è é.txt", "text": SAMPLE,
            "created_at": project["created_at"], "memo": "",
        })
        store.create(project)
        back = store.get(project["id"])
        self.assertEqual(back["name"], "编码本 · perché")
        self.assertEqual(back["documents"][0]["text"], SAMPLE)

    def test_a_snapshot_round_trips(self):
        import json
        store = Store(self.root / "qualicraft.sqlite3")
        project = new_project("编码本")
        project["documents"].append({
            "id": "d1", "name": "a.txt", "text": SAMPLE,
            "created_at": project["created_at"], "memo": "",
        })
        store.create(project)
        folder = store.backup_dir / project["id"]
        newest = sorted(folder.glob("*.json"))[-1]
        restored = json.loads(newest.read_text(encoding="utf-8"))
        self.assertEqual(restored["documents"][0]["text"], SAMPLE)

    def test_the_coding_export_round_trips(self):
        from qualicraft.core import add_code, annotate
        store = Store(self.root / "qualicraft.sqlite3")
        project = new_project("导出")
        project["documents"].append({
            "id": "d1", "name": "a.txt", "text": SAMPLE,
            "created_at": project["created_at"], "memo": "",
        })
        code = add_code(project, "共享 · condivisione", "定义：关于数据共享。")
        annotate(project, "d1", code["id"], 0, 24, "memo à è", "manual")
        store.create(project)
        # csv_export returns bytes: it is written to a file on disk, and the
        # BOM decision belongs to the caller rather than to the encoder.
        raw = csv_export(store.get(project["id"]))
        text = raw.decode("utf-8") if isinstance(raw, bytes) else raw
        # The columns are document, code, code_path, start, end, quote, memo,
        # source — a code's definition is not among them, so the definition is
        # not asserted here.
        self.assertIn("共享 · condivisione", text)
        self.assertIn("memo à è", text)
        self.assertIn(SAMPLE[:20], text)

    def test_binary_image_decoding_does_not_disable_text_encoding_checks(self):
        self.assertEqual(text_calls_without_encoding('with Image.open(io.BytesIO(payload)) as image:'), [])
        self.assertTrue(text_calls_without_encoding('with open("interview.txt") as source:'))
        self.assertEqual(text_calls_without_encoding('with open("interview.txt", encoding="utf-8") as source:'), [])

    def test_no_text_call_site_is_missing_its_encoding(self):
        offenders = []
        for path in sorted((REPO / "qualicraft").glob("*.py")) + sorted((REPO / "tests").glob("*.py")):
            offenders += [(path.name, n, line) for n, line in text_calls_without_encoding(path.read_text(encoding="utf-8"))]
        self.assertEqual(offenders, [],
                         "every text read/write must pass encoding=\"utf-8\"")


if __name__ == "__main__":
    unittest.main()
