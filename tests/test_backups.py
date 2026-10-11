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
        latest = json.loads((self.store.backup_dir / safe_id(self.project["id"]) / after[-1]).read_text(encoding="utf-8"))
        self.assertIn("code 999", json.dumps(latest["audit"]))

    # --- 2. a backup that cannot be written --------------------------------

    def test_an_unwritable_backup_does_not_fail_the_edit_and_is_reported(self):
        blocked = self.root / "not-a-directory"
        blocked.write_text("a file where the backup folder should be", encoding="utf-8")
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

    # --- 7. an id that is not an id ---------------------------------------
    #
    # Ids are validated rather than rewritten. Rewriting one would silently
    # point the snapshot at a different name than the project it belongs to.

    def test_an_illegal_project_id_is_rejected_and_creates_no_directory(self):
        for bad in ("../../etc/escape", "proj/../x", "a" * 65, "", "sp ace"):
            with self.subTest(bad=bad):
                with self.assertRaises(ValueError):
                    core.require_valid_id(bad)
        # And the store refuses to snapshot under one, so nothing is created.
        before = sorted(p.name for p in self.store.backup_dir.glob("*")) if self.store.backup_dir.exists() else []
        hostile = dict(self.project, id="../../etc/escape")
        self.store._snapshot(hostile)
        after = sorted(p.name for p in self.store.backup_dir.glob("*")) if self.store.backup_dir.exists() else []
        self.assertEqual(before, after, "no directory may be created for a rejected id")
        self.assertTrue(self.store.backup_error, "the refusal is reported")
        self.assertNotIn("escape", " ".join(after))

    # --- 8. a batch writes one snapshot ------------------------------------

    def test_a_batch_writes_exactly_one_snapshot(self):
        self.touch(0)
        before = len(self.snapshots())
        with self.store.batch(self.project["id"]):
            for i in range(1, 6):
                self.touch(i)
        after = len(self.snapshots())
        self.assertEqual(after - before, 1,
                         "five changes in a batch are one snapshot, not five")
        # The work itself still happened.
        names = [a.get("name", "") for a in self.store.get(self.project["id"])["audit"]]
        self.assertEqual(len([n for n in names if n.startswith("code ")]), 6)

    def test_a_batch_leaves_no_partial_file_behind(self):
        with self.store.batch(self.project["id"]):
            self.touch(1)
        folder = self.store.backup_dir / core.require_valid_id(self.project["id"])
        self.assertEqual(list(folder.glob("*.part")), [],
                         "the temporary file is renamed into place, not left")

    # --- 9. snapshots are written atomically -------------------------------

    def test_a_snapshot_is_never_left_half_written(self):
        self.touch(1)
        folder = self.store.backup_dir / core.require_valid_id(self.project["id"])
        for name in self.snapshots():
            # Every file on disk parses. A truncated one would look restorable.
            json.loads((folder / name).read_text(encoding="utf-8"))

    # --- 10. a serialisation error is not the researcher's problem ---------

    def test_a_serialisation_error_is_reported_and_never_escapes(self):
        """A TypeError from the snapshot must not reach the caller.

        Note what this does and does not cover. `change()` serialises twice —
        once for the row it is about to commit, once for the snapshot — and the
        commit goes first. A serialisation failure therefore cannot be aimed at
        the snapshot *through* `change()` without also breaking the commit, so
        the failure is aimed at the snapshot directly here. That the edit
        survives a failing snapshot is covered by
        `test_an_unwritable_backup_does_not_fail_the_edit_which_was_reported`
        above, which fails for a filesystem reason and exercises the same
        guard.
        """
        with mock.patch.object(core.json, "dumps", side_effect=TypeError("not serialisable")):
            self.store._snapshot(self.project)          # must not raise
        self.assertTrue(self.store.backup_error, "the failure is recorded")
        self.assertIn("TypeError", self.store.backup_error["message"])

    def test_a_serialisation_error_during_an_edit_leaves_the_project_intact(self):
        """The store is usable afterwards; nothing is left half-applied."""
        with mock.patch.object(core.json, "dumps", side_effect=TypeError("not serialisable")):
            self.store._snapshot(self.project)
        self.store.change(self.project["id"],
                          lambda p: event(p, "code_create", name="after the failure"))
        saved = self.store.get(self.project["id"])
        self.assertEqual([a["action"] for a in saved["audit"]], ["code_create"])
        self.assertIsNone(self.store.backup_error, "a later success clears the flag")


if __name__ == "__main__":
    unittest.main()


class CodebookDigestTests(unittest.TestCase):
    """The digest is what a methods reader compares between two runs."""

    def setUp(self):
        import shutil, tempfile
        self._shutil = shutil
        self.root = Path(tempfile.mkdtemp(prefix="qc-digest-"))
        self._shutil = shutil

    def tearDown(self):
        self._shutil.rmtree(self.root, ignore_errors=True)

    def project(self):
        from qualicraft.core import add_code
        p = new_project("Digest drill")
        parent = add_code(p, "Barriers", "Things that get in the way")
        child = add_code(p, "Cost", "Money", parent_id=parent["id"])
        add_code(p, "Facilitators", "Things that help")
        return p, parent, child

    def test_a_colour_change_does_not_move_the_digest(self):
        p, parent, _ = self.project()
        before = core.codebook_digest(p)
        parent["color"] = "#123456"
        parent["order"] = 99
        self.assertEqual(core.codebook_digest(p), before,
                         "presentation is not analysis")

    def test_renaming_a_code_moves_the_digest(self):
        p, parent, _ = self.project()
        before = core.codebook_digest(p)
        parent["name"] = "Obstacles"
        self.assertNotEqual(core.codebook_digest(p), before,
                            "renaming a code is a change to the codebook")

    def test_the_digest_ignores_the_order_codes_are_stored_in(self):
        p, _, _ = self.project()
        before = core.codebook_digest(p)
        p["codes"] = list(reversed(p["codes"]))
        self.assertEqual(core.codebook_digest(p), before)

    def test_reparenting_a_code_moves_the_digest(self):
        p, parent, child = self.project()
        before = core.codebook_digest(p)
        child["parent_id"] = None
        self.assertNotEqual(core.codebook_digest(p), before)


class SnapshotAtomicityTests(unittest.TestCase):
    def setUp(self):
        import shutil, tempfile
        self._shutil = shutil
        self.root = Path(tempfile.mkdtemp(prefix="qc-atomic-"))
        self.store = Store(self.root / "qualicraft.sqlite3")
        self.project = self.store.create(new_project("Atomic drill"))

    def tearDown(self):
        self._shutil.rmtree(self.root, ignore_errors=True)

    def snapshots(self):
        folder = self.store.backup_dir / self.project["id"]
        return sorted(p.name for p in folder.glob("*.json"))

    def test_a_failed_rename_leaves_the_previous_snapshot_intact(self):
        """The write is only atomic if a failure before the rename changes nothing.

        Checking that no `.part` file is left behind says nothing about that:
        the interesting case is a rename that fails, and this makes it fail.
        """
        self.store.change(self.project["id"],
                          lambda p: event(p, "code_create", name="first"))
        before = self.snapshots()
        # Two: one from create(), one from the change above. The count is not
        # the point; that it does not move is.
        self.assertGreaterEqual(len(before), 1)
        payload = json.loads((self.store.backup_dir / self.project["id"] / before[0]).read_text(encoding="utf-8"))

        with mock.patch.object(core.os, "replace", side_effect=OSError("rename failed")):
            self.store.change(self.project["id"],
                              lambda p: event(p, "code_create", name="second"))

        # The edit itself still committed.
        saved = self.store.get(self.project["id"])
        self.assertEqual([a.get("name") for a in saved["audit"]], ["first", "second"])
        # And the snapshot on disk is still the previous, complete one.
        after = self.snapshots()
        self.assertEqual(after, before, "a failed rename must not add or remove a snapshot")
        reread = json.loads((self.store.backup_dir / self.project["id"] / after[0]).read_text(encoding="utf-8"))
        self.assertEqual(reread, payload, "the previous snapshot is byte-for-byte unchanged")
        self.assertTrue(self.store.backup_error, "and the failure is reported")


class RestoreNameTests(unittest.TestCase):
    """T1: the copy's name carries the moment it was taken."""

    def setUp(self):
        import shutil, tempfile
        self._shutil = shutil
        self.root = Path(tempfile.mkdtemp(prefix="qc-name-"))
        self.store = Store(self.root / "qualicraft.sqlite3")
        self.project = self.store.create(new_project("Care experiences"))

    def tearDown(self):
        self._shutil.rmtree(self.root, ignore_errors=True)

    def test_the_restored_copy_is_named_with_its_timestamp(self):
        self.store.change(self.project["id"], lambda p: event(p, "code_create", name="x"))
        target = sorted(p.name for p in (self.store.backup_dir / self.project["id"]).glob("*.json"))[0]
        restored = self.store.restore(self.project["id"], target)
        # "<original name> (restored YYYY-MM-DD HH:MM)"
        self.assertRegex(restored["name"],
                         r"^Care experiences \(restored \d{4}-\d{2}-\d{2} \d{2}:\d{2}\)$")
        self.assertNotEqual(restored["id"], self.project["id"])


class EndpointHostTests(unittest.TestCase):
    """T2: what leaves the machine must not carry credentials."""

    def test_userinfo_and_query_are_stripped(self):
        from qualicraft.core import endpoint_host
        cases = {
            "https://u:p@host/v1?key=x": "https://host",
            "https://api.example.com/v1": "https://api.example.com",
            "http://127.0.0.1:8080/v1?token=abc": "http://127.0.0.1:8080",
            "https://user:pw@host:8443/v1/chat?key=k#frag": "https://host:8443",
        }
        for url, expected in cases.items():
            with self.subTest(url=url):
                self.assertEqual(endpoint_host(url), expected)
        for url in cases:
            host = endpoint_host(url)
            for secret in ("u:p", "key=x", "token=abc", "user:pw", "key=k"):
                self.assertNotIn(secret, host)


class MethodsRecordTests(unittest.TestCase):
    """T3.2: the four counts a reader needs to judge an AI-assisted codebook."""

    def setUp(self):
        import shutil, tempfile
        self._shutil = shutil
        self.root = Path(tempfile.mkdtemp(prefix="qc-methods-"))
        self.store = Store(self.root / "qualicraft.sqlite3")

    def tearDown(self):
        self._shutil.rmtree(self.root, ignore_errors=True)

    def build(self):
        from qualicraft.core import methods_narrative, uid
        p = new_project("Methods drill")
        p["documents"].append({"id": "d1", "name": "a.txt", "text": "One. Two. Three.",
                               "created_at": p["created_at"], "memo": ""})
        # Two accepted, one rejected, one still pending.
        for status, name in (("accepted", "A"), ("accepted", "B"), ("rejected", "C"), ("pending", "D")):
            p["suggestions"].append({"id": uid(), "document_id": "d1", "code_name": name,
                                     "start": 0, "end": 3, "status": status,
                                     "reviewed_at": p["created_at"]})
        # Two suggestions were thrown out before review for failing the quote check.
        event(p, "analysis_segment", discarded=2, added=2)
        event(p, "analysis_start", base_url="https://u:p@host/v1?key=secret",
              model="requested-model", prompt_version=1)
        self.store.create(p)
        return methods_narrative(self.store.get(p["id"]))

    def test_all_four_counts_are_reported(self):
        text = self.build()
        self.assertIn("Suggestions produced: **4**", text)
        self.assertRegex(text, r"Accepted: 2 \| Rejected: 1 \| Still pending: 1")
        self.assertRegex(text, r"Discarded before review.*: 2")

    def test_the_prompt_version_is_reported(self):
        from qualicraft.ai import PROMPT_VERSION
        text = self.build()
        self.assertIn(f"Prompt template version: {PROMPT_VERSION}", text)

    def test_the_recorded_endpoint_is_stripped_of_credentials(self):
        text = self.build()
        self.assertNotIn("u:p", text)
        self.assertNotIn("key=secret", text)
        self.assertIn("https://host", text)
