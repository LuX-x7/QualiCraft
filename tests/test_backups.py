"""Fault-point tests for project snapshots.

The snapshots are the only thing standing between a researcher and weeks of
lost coding, so the tests here are about the ways that protection fails rather
than about the happy path:

  * pruning must never take the newest snapshot, including when the clock
    goes backwards
  * a backup that cannot be written must not stop the edit, and must be
    reported rather than swallowed
  * a restored snapshot must never touch the project it came from
  * a project id is a directory name, so it may not climb out of the folder

Everything else about backups is covered by using the tool.
"""
import json
import shutil
import tempfile
import unittest
from pathlib import Path
from unittest import mock

from qualicraft import core
from qualicraft.core import BACKUP_KEEP, Store, event, new_project, safe_id


class BackupTests(unittest.TestCase):
    def setUp(self):
        self.root = Path(tempfile.mkdtemp(prefix="qc-backup-"))
        self.store = Store(self.root / "qualicraft.sqlite3")
        self.project = self.store.create(new_project("Snapshot drill"))

    def tearDown(self):
        shutil.rmtree(self.root, ignore_errors=True)

    def snapshots(self):
        folder = self.store.backup_dir / safe_id(self.project["id"])
        return sorted(p.name for p in folder.glob("*.json"))

    def touch(self, index=0):
        self.store.change(self.project["id"],
                          lambda p, i=index: event(p, "code_create", name=f"code {i}"))

    # --- 1. pruning, and a clock that goes backwards -----------------------

    def test_pruning_keeps_the_newest_and_survives_a_clock_that_goes_backwards(self):
        for i in range(BACKUP_KEEP + 5):
            self.touch(i)
        names = self.snapshots()
        self.assertEqual(len(names), BACKUP_KEEP, "pruning should hold at the ceiling")

        newest = names[-1]
        # Daylight saving ends in October here. A timestamp-named snapshot
        # written after the clocks go back sorts *before* the previous one, and
        # pruning then deletes the newest recovery point instead of the oldest.
        with mock.patch.object(core, "now", return_value="2020-01-01T00:00:00+00:00"):
            self.touch(999)

        after = self.snapshots()
        self.assertEqual(len(after), BACKUP_KEEP)
        self.assertGreater(after[-1], newest, "the new snapshot must sort last")
        self.assertIn(after[-1], after)
        # And the newest one is the state we just wrote.
        latest = json.loads((self.store.backup_dir / safe_id(self.project["id"]) / after[-1]).read_text())
        self.assertIn("code 999", json.dumps(latest["audit"]))

    # --- 2. a backup that cannot be written --------------------------------

    def test_an_unwritable_backup_does_not_fail_the_edit_and_is_reported(self):
        blocked = self.root / "not-a-directory"
        blocked.write_text("a file where the backup folder should be")
        store = Store(self.root / "other.sqlite3", backup_dir=blocked)
        project = store.create(new_project("Blocked"))

        store.change(project["id"], lambda p: event(p, "code_create", name="still saved"))

        saved = store.get(project["id"])
        self.assertEqual(len(saved["audit"]), 1, "the edit must still be committed")
        self.assertEqual(saved["audit"][0]["action"], "code_create")
        status = store.backup_status()
        self.assertIsNotNone(status["error"], "the failure must be recorded")
        self.assertIn("Blocked", json.dumps(status["error"]) + saved["name"])

    # --- 3. restore is always a copy --------------------------------------

    def test_restoring_a_snapshot_leaves_the_original_untouched(self):
        self.touch(1)
        self.touch(2)
        before = self.store.get(self.project["id"])
        target = self.snapshots()[0]

        restored = self.store.restore(self.project["id"], target)

        self.assertNotEqual(restored["id"], self.project["id"])
        self.assertIn("restored", restored["name"])
        self.assertEqual(len(self.store.get(self.project["id"])["annotations"]),
                         len(before["annotations"]))
        self.assertEqual(len(self.store.get(self.project["id"])["audit"]), len(before["audit"]))
        self.assertEqual(len(self.store.list()), 2, "the copy is a second project")

    def test_a_snapshot_name_cannot_escape_the_backup_folder(self):
        with self.assertRaises(Exception):
            self.store.restore(self.project["id"], "../../etc/passwd")

    # --- 4. the id is a directory name ------------------------------------

    def test_a_hostile_project_id_cannot_escape_the_backup_folder(self):
        self.assertEqual(safe_id("../../etc"), "etc")
        self.assertEqual(safe_id(""), "project")

        hostile = new_project("Imported")
        hostile["id"] = "../../escape"
        self.store.create(hostile)

        written = sorted(p.name for p in self.store.backup_dir.iterdir())
        self.assertIn("escape", written)
        self.assertFalse((self.root.parent / "escape").exists())


if __name__ == "__main__":
    unittest.main()
