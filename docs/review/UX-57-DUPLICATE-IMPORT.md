# UX57 · Explicit duplicate-import decision

18 October 2026. Fix **UX55-01 only**, from baseline `469987bd8fda977f51d1199b1660c3babb85879f`. Public Bologna disposable projects only; original projects are not reset. Windows deferred and unverified. Local commit only; no push or deployment.

## Result and decision rules

TXT, parsed DOCX and pasted text use one server-side rule: the saved document name and exact decoded text must both match an existing document in this project. Names retain the existing outer-whitespace trimming; case and text line breaks are not normalized. The same text with another name, or the same name with different text, imports normally. No automatic merging or overwriting is introduced.

Before a duplicate is written, the dialog says **This document is already here**, identifies the name, and explains that another copy counts separately. It offers **Keep another copy** and **Cancel import**; cancellation has the initial focus. Escape and the close button cancel the decision too. The full warning scrolls above the fixed footer on desktop and phone. Editing the name, file, text or input mode clears the old decision and checks the new candidate.

Keep creates one new document ID with its own empty coding/reading state. Existing text, coding links, notes and ancestry are not moved or replaced. The normal document-import audit and committed snapshot are created once. Intentional copies remain separate records; statistics and plotting definitions are unchanged.

The duplicate decision is checked under the existing SQLite writer lock. An unchanged challenge or a replay exits before Store.change can update a timestamp, audit, project JSON, snapshot sequence or outbox. The confirmation fingerprint binds the project, candidate name/text identity and current matching document IDs; a newly arrived matching copy requires a fresh decision. A boolean cannot stand in for that fingerprint. No new database table or project schema is needed; project JSON remains v5.

The browser retains one request identity for a candidate across interrupted responses. Its successful import audit records that identity, so a repeated/double/concurrent request returns the committed document without another write. A changed source cannot reuse that request. The dialog locks source controls while sending and ignores late replies after closing, reopening or switching projects. Plain-HTTP phone browsers without randomUUID use getRandomValues for the import request identity. Internal corpus importers and whole-project restore retain their existing APIs; this is the normal document-import flow.

## Regression and browser evidence

Evidence root: `~/qualicraft-review/ux-57/`. `COMMANDS.json` records commands, exit codes and raw output. Full commit is in `COMMIT.txt` and the supervisor package's `COMMITS.md`.

| Check | Result | Evidence |
| --- | --- | --- |
| Three initial API regressions on old code | All fail, exit 1 | `raw/red.txt` |
| Final duplicate API/recovery regressions | 12 pass | `raw/target-python-final.txt` |
| Browser-state regressions | 9 pass, included in 209 Node tests | `raw/node-final.txt` |
| Full Python suite | 263 tests; OK, 3 existing environment skips | `raw/python-final.txt` |
| Full Node command, including report readers | 209 pass | `raw/node-final.txt` |
| Desktop / phone import, keyboard, download, home/report | 18 checks pass | `raw/ui-verified.txt`, `ui/results.json` |
| Prior snapshot desktop / phone restore/report/download | 5 checks pass | `raw/snapshot-ui.txt`, `snapshot-ui/results.json` |
| Full input / interruption / recovery harness | 21 checks pass; no findings | `raw/recovery.txt`, `recovery/results.json` |
| JavaScript syntax | Exit 0 | `raw/syntax.txt` |
| Production build | Direct Next exit 0; npm unavailable, exit 127 retained | `raw/build-final.txt`, `raw/npm-build.txt` |
| Protected sources and successful build copy | 130 tracked files unchanged; all 108 website sources match the build | `raw/scope.json` |

The 12 API tests cover nonmutating warnings/cancellation; independent copies and idempotent receipts; stale/boolean confirmation; same-name/different-text and different-name/same-text; simultaneous first imports and repeated confirmed requests; changed-source request reuse; DOCX/paste equivalence; trimming/case/line-break boundaries; a fresh canceled attempt; a killed pre-commit import; and a committed import whose HTTP receipt was lost. The last two kill only owned disposable test servers and verify restart/retry state and recovery-point hashes.

The 18 production-proxy Chrome checks use 1440px desktop and 390px touch emulation. They verify a warning before mutation, Escape/touch cancellation, keyboard Tab/Enter or touch Keep, exactly one new audit/snapshot and independent source, source edits and clearing the file invalidating the decision, DOCX/paste equivalence, full JSON download, and home/report smoke checks. Original 19-document/317-code/874-link project, saved QCA and frozen report/assets remain exact; normal console, HTTP errors and project-external requests are zero. Phone runs also omit randomUUID deliberately. This is browser emulation, not current physical-device or VoiceOver acceptance.

Visual QA caught a new warning initially below the fixed footer; the final version scrolls the whole warning into the body viewport, with an explicit bounding-box assertion. Final screenshots are `ui/desktop-duplicate-choice.png`, `ui/phone-duplicate-choice.png`, the two separate-copy result screenshots and DOCX/download/home/report views. The first harness selected a hidden desktop-only import control at phone width and timed out; that raw failure remains in `raw/ui.txt`. The corrected harness selects the visible entry. Two additional frontend tests guard a queued old close event after reopening, and clearing the selected file after confirmation. No failing output was deleted or called a product pass.

The build runs in a physical isolated dependency copy, without installing packages. An initial command accidentally rebuilt the identical previous source copy; its output is retained as `raw/build.txt` and is not the final build proof. `raw/build-final.txt` is the subsequent build in this round's own directory. Source hashes match all 108 website files. Earlier optional-fixture ResourceWarnings are retained. The known `-t .` collection issue is not changed or presented as fixed.

## Review entry and remaining work

Use **http://127.0.0.1:52758/** → Workbench → **Bologna · duplicate import review**. This is a fresh editable local review copy with the final backend and byte-verified current JS/CSS. It requires this computer's local services. Older project data is preserved; old links can still run older backend code.

UX55-01 is closed by this workflow; UX55-02 stays closed. **UX55-03** actual multiple-file upload/queue and **UX55-04** explicit method/process presentation remain open, as do current human-device/accessibility and researcher/supervisor acceptance. No new statistics, plot renderers, QCA mathematics, report formatting, website assets or source datasets are changed. Closing this fix is not final product acceptance or release approval.
