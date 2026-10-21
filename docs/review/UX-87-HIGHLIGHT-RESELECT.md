# UX87 — forward re-selection on a saved highlight

Date: 2026-10-21. Parent acceptance: UX86-75E-JOINT-ACCEPTANCE.md.

## Result

UX86-01 is fixed locally and verified with real Chrome on a disposable Bologna English teaching project. Before the change, a left-to-right drag starting at codepoint 5 inside the saved [5,28) highlight ended with no browser selection and no picker. The focused regression failed first with popup false and range null, and saved its screenshot.

The reader now records caret endpoints for mouse gestures that start on an existing coded mark. If Chrome ends the moved gesture with a collapsed selection, QT restores that exact native range and opens the existing code picker. If Chrome supplies a normal selection, the existing path handles it. Simple clicks, touch, ordinary text selection, keyboard navigation, code identity and save APIs are not changed. The selected source remains [5,28); picker navigation and Escape do not write annotations.

Implementation: web/app.js, caretAtPoint and markedTextDrag listeners near selectionUpdate. Regression: tools/e2e/test_forward_reselect.py, actual Chrome UI against a disposable local hosted server. It asserts forward/reverse selection, exact source offsets, picker presence, arrow-key candidate navigation, Escape and unchanged saved annotation count. It failed against the previous implementation and passes after the fix. No changes to analysis, counts, CSV, plotting or project format.

## Verification

- UX86-01 browser test: pre-fix exit 1; post-fix exit 0, exact [5,28), no page errors, both directions and keyboard pass. Screenshots and JSON under ~/qualicraft-review/ux-87/.
- Node: 322 pass, 0 fail. Python: 345 tests, 3 existing skips, exit 0. node --check web/app.js, Python compile for the regression script and git diff --check: exit 0.
- Production Next build: exit 0 using bundled Node directly. Existing middleware deprecation warning remains.
- Full 75E walk-through was run after the change; its final route result and known outstanding findings are recorded in the evidence package. A separate disposable server setup first reused an already registered QA name and was correctly rejected; that run is retained as setup failure, then rerun with a unique disposable name.
- Online sync completed after SSH was re-established. The active QT file is `/mnt/data/xiaolu/LMIC-ILI-EarlyWarning/QT/releases/ux72/web/app.js`; its SHA-256 is `2ab79ecdc4b4c705b4cc77a00fd6ad05885d9cbb76402955e17d41ad7a9929ef`, matching the committed local file. The previous version is preserved at `QT/config/backup-ux87-20261021/app.js` (SHA-256 `cf692c0aa2cc57acdaa3b30b85d7f8f954a6f97548138cde309b04f1e14ce6d7`). The public QT site and workbench sign-in page respond, but authenticated online drag regression was not run. No service restart or system-wide/non-QT operation was attempted.

## Acceptance state

UX86-01: fixed / local verification passed / QT file synchronized and hash-verified. Authenticated online interaction remains unverified. UX86-02–05 remain open. Overall 75E remains not fully accepted until those are fixed and the integrated route passes. Windows stays deferred. Changes remain local; no push.

The post-fix full local 75E route also completed its 15 recorded stages: 14 passed, with the pre-existing short-document Keep/Resume issue still failing. The coding stage passed without using the reverse-drag workaround. The run reproduced the registration console warning and hosted storage wording mismatch; the current public website scale-copy issue UX86-05 remains from the earlier public site run. Therefore four earlier findings remain overall, and the full acceptance is still open. The setup retry with a fresh unique Bologna QA username avoided the initial disposable-account collision.
