"""The e2e harness is pinned against the page it drives.

A guard that reports "unreachable" while looking for a selector that has
never existed is worse than no guard: it reads exactly like a finding. That
happened once already. dialogs.py derived the action from the display label,
"Create" became `data-action="create"`, the real action is `code`, and a
dialog that opens perfectly well at 390px was reported unreachable. The fix
passed the action in explicitly — a label is prose, a selector is not — but a
comment can be edited away. So the actions the guard uses are checked here,
against web/app.js, the file that renders them.

The checker, applied to the real files:

  every measure() call must name an action that app.js renders as
      data-action="<action>"
  ...and the opener it is handed must click that same action, because a
  guard that checks one selector while opening another is the same class of
  bug wearing a different symptom.

The controls below replay the original bug against a one-line fake page, so a
future refactor that makes the real assertion pass everything cannot pass
unnoticed.

What this covers, and what it does not:

  covered    every measure() call in tools/e2e/dialogs.py
  not covered the selectors inside smoke.py, control.py and preset.py. They
             drive a live page and fail loudly when a selector is wrong. Only
             the dialog guard had a branch that turned a wrong selector into
             a quiet "unreachable" verdict, so only it is pinned here.

This test reads files. It starts no browser, and Playwright stays outside the
package's runtime dependencies.
"""
import importlib.util
import re
import sys
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DIALOGS = REPO / "tools" / "e2e" / "dialogs.py"
APP = REPO / "web" / "app.js"

# measure("Snapshots", "snapshots", opener("snapshots")) — the shape the
# guard was corrected into. `\s` so the call may wrap lines.
CALL = re.compile(
    r'measure\(\s*"([^"]*)"\s*,\s*"([^"]*)"\s*,\s*'
    r'opener\(\s*"([^"]*)"\s*\)\s*\)')


def check_actions(harness_source, app_source):
    """(actions, problems) for one harness source against one app source.

    actions is a list of (label, checked_action, opened_action). problems is
    a list of strings; an empty list is the only passing state, and it means
    all four of these held:

      every measure() call has the string-literal shape above
      every guard action equals the action its opener clicks
      every guard action is rendered by some element as data-action="..."
      at least one measure() call was found at all

    The last rule is what keeps the first three from passing vacuously.
    """
    actions, problems = [], []
    # `(?<!def )` keeps the function definition out of the scan; only the
    # calls matter.
    for match in re.finditer(r"(?<!def )measure\(", harness_source):
        line = harness_source.count("\n", 0, match.start()) + 1
        call = CALL.match(harness_source, match.start())
        if not call:
            problems.append(
                f"line {line}: a measure() call does not pass its action as a "
                f"string literal with a matching opener — if the harness "
                f"changed shape, update this test on purpose")
            continue
        label, action, opened = call.groups()
        actions.append((label, action, opened))
        if action != opened:
            problems.append(
                f"{label}: the guard checks {action!r} but the opener clicks "
                f"{opened!r} — they must be the same control")
        if f'data-action="{action}"' not in app_source:
            problems.append(
                f"{label}: no element renders data-action=\"{action}\" in "
                f"app.js — a label is prose; this is where selectors come from")
    if not actions:
        problems.append(
            "no measure() call found in the harness — the extraction matches "
            "nothing, so the assertions above would pass without looking")
    return actions, problems


class DialogGuardActions(unittest.TestCase):
    def test_every_dialog_action_exists_in_app_js(self):
        actions, problems = check_actions(
            DIALOGS.read_text(encoding="utf-8"),
            APP.read_text(encoding="utf-8"))
        self.assertEqual(problems, [])
        measured = {action for _, action, _ in actions}
        # The corrected P2-5 set. Adding a dialog grows this; dropping one
        # of them loses a measurement the review established, which is a
        # decision to make in the open, not by deletion.
        self.assertTrue(
            {"snapshots", "import", "code", "export"} <= measured,
            f"the corrected measurement set is incomplete: {sorted(measured)}")


class TheCheckerCanFail(unittest.TestCase):
    """A check that cannot fail proves nothing. These are its controls.

    The original bug is replayed here against a page the size of a string:
    the action derived from the label, against an app that defines only the
    real action. If a future edit makes these pass, the assertion above has
    stopped meaning anything.
    """

    def test_a_label_derived_action_is_flagged(self):
        broken = 'measure("Create", "create", opener("create"))'
        app = '<button data-action="code">Create code</button>'
        actions, problems = check_actions(broken, app)
        self.assertEqual(actions, [("Create", "create", "create")])
        self.assertTrue(any("create" in p for p in problems), problems)

    def test_a_guard_and_opener_disagreeing_are_flagged(self):
        broken = 'measure("Export", "export", opener("download"))'
        app = '<button data-action="export">Export</button>'
        _, problems = check_actions(broken, app)
        self.assertTrue(any("download" in p for p in problems), problems)

    def test_a_changed_shape_is_flagged_rather_than_skipped(self):
        drifted = 'measure("Export", "export")'  # the opener was forgotten
        app = '<button data-action="export">Export</button>'
        actions, problems = check_actions(drifted, app)
        self.assertEqual(actions, [])
        self.assertTrue(problems)

    def test_an_empty_harness_is_flagged_rather_than_passed(self):
        empty = "# every measure() call was refactored away\n"
        _, problems = check_actions(empty, "<button data-action=\"code\"></button>")
        self.assertTrue(problems)


class PresetScriptTests(unittest.TestCase):
    """The close-out item: preset.py must stay there, and stay importable.

    preset.py is the only check of the one-click "all five modules" preset
    (P2-3), and it is not part of the unittest suite — it is run by hand.
    A script nobody runs is a script nobody notices the absence of, so the
    suite asserts the file exists and still imports.

    Importing is the point, and it is also the danger: an e2e script without
    the `__main__` guard would execute its whole run on import — server,
    browser, everything. So the two facts that make an import safe are
    checked statically first, and only then is the module actually loaded.
    """

    PRESET = REPO / "tools" / "e2e" / "preset.py"

    def test_preset_py_exists(self):
        self.assertTrue(
            self.PRESET.is_file(),
            "tools/e2e/preset.py is gone — the preset check for P2-3 is "
            "no longer runnable at all")

    def test_preset_py_imports_and_exposes_main(self):
        source = self.PRESET.read_text(encoding="utf-8")
        # Static first: a missing guard means importing would RUN it.
        self.assertIn(
            'if __name__ == "__main__"', source,
            "preset.py lost its __main__ guard; importing it from a test "
            "would start a server and a browser")
        # The e2e convention: the driver stays in tools/, so importing the
        # script must not drag Playwright in with it.
        head = source[:source.index("def main")]
        self.assertNotIn("playwright", head,
                         "preset.py imports Playwright at module level; keep "
                         "it inside main()")
        import importlib.util
        before = list(sys.path)
        try:
            spec = importlib.util.spec_from_file_location("qc_e2e_preset", self.PRESET)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
        finally:
            sys.path[:] = before
        self.assertTrue(callable(getattr(module, "main", None)),
                        "preset.py must expose main()")


if __name__ == "__main__":
    unittest.main()
