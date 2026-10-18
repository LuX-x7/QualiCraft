# UX58 · Bounded, resumable multi-file import queue

18 October 2026. **Closes UX55-03 only**, from `1b80d656bf8999ca80c745e5b22d5df2286f95ab`. Only public Bologna disposable projects are used. UX55-01 duplicate decisions and UX55-02 committed snapshots remain intact. Statistics, plotting, QCA mathematics, reports, original data and website assets are unchanged. Windows deferred and unverified; local commit only, no push/deployment.

## What the user sees

Choose several TXT / DOCX files in Import interview to open a queue. Each row shows its source filename, document name, actual Reading / Checking / Saving / Saved stage, failure reason, or duplicate decision. The summary distinguishes saved, failed, cancelled and awaiting-decision items. Progress means processed files, including explicit failures/cancellations; it is not a fabricated byte-upload percentage or a claim that every file succeeded.

Files are processed one at a time. A failed file does not block other valid files or roll back previously saved documents. Retry this file acts on that row; successful rows are not sent again. Source names can be edited before a save has been attempted. Afterwards they stay fixed so a lost receipt cannot be retried under a different identity. Corrected or changed source material can be added as a new item; original-source retries must match the saved extracted-text fingerprint.

Same saved name and exact decoded text uses UX57's **Keep another copy / Cancel this file** decision. Waiting duplicates do not block unrelated rows. A refreshed/stale duplicate fingerprint requires another explicit choice; there is no automatic merge, overwrite or keep-all default. Kept copies have separate document IDs and count separately under the existing definitions.

**Stop after current file** and Close finish an already-started file, then stop sending subsequent files. Saved rows remain saved. Closing during a pending response updates the workspace count after receipt; keyboard focus returns to Import after that refresh. View document opens the exact saved source in Coding. Clear finished items removes saved/cancelled queue rows without deleting project documents or failures.

The queue header/footer stay visible on phone; the body scrolls. Disabled actions are visibly disabled. Native file selection, buttons, duplicate choices and result opening support keyboard and touch. Single-file preview/name editing and paste import retain their previous paths.

## Bounds and recovery

- At most **100 files per queue**, each at most **8 MB**, TXT / DOCX only. Over-100 selection is rejected before changing the queue, without silently truncating the selection.
- The existing limit of **100 documents per project** is unchanged. The full Bologna example already has 19; the real 100-file test saves 81 and reports 19 separate capacity failures. These are technical public-source copies, not 100 independent participants.
- The existing 500,000-character document and request/DOCX limits remain enforced. Failed parsing or invalid input is reported per file.
- Each successful file uses the existing independent database transaction, import audit event and committed-snapshot protocol. The batch is not an all-or-nothing transaction. Queue preparation/duplicate warnings/cancellation do not create research edits or recovery points.
- Browser storage keeps one bounded queue history per project: filenames, names, extracted-text SHA256, request IDs, decisions, stages and receipts. **No transcript text, file bytes, DOCX base64 or request body is stored there.** Unparsed files are not persisted as file handles.
- After refresh/reopen, unsaved rows require explicit **Reselect original files**, followed by Start / resume. The extracted text is checked again; an altered source is refused. A server commit whose browser receipt was lost reuses its persisted request ID and returns the same document without another audit/snapshot.
- Queue history belongs to this browser/project; it is operational state, not a new project schema field or an item in project JSON. JSON contains all successfully saved documents and existing research data. Pending/unselected files have not become project documents.
- If browser storage is blocked/full, the queue remains usable in memory and displays an explicit warning that refresh recovery is unavailable. Saved project documents remain on the server. Clearing browser data likewise does not preserve that browser's pending queue. Concurrent server imports continue to use UX57's transactional duplicate checks; this does not claim a distributed browser queue scheduler.

Preparation uses an authenticated, read-only `document-check` endpoint. Valid preparation returns normalized name, extracted-text hash/length and available document slots; expected parse failures return a normal validation result with a reason. Actual imports still enforce validation, expected source hash, duplicate decision, capacity and idempotent receipt under the writer transaction. No analysis method is called by this endpoint.

## Acceptance and raw evidence

Evidence: `~/qualicraft-review/ux-58/`. Commands/exit codes are in `COMMANDS.json`; final commit in `COMMIT.txt`. All screenshots/raw outputs remain outside Git.

| Check | Final result | Evidence |
| --- | --- | --- |
| Initial regressions on the previous implementation | Three fail, exit 1 | `raw/red.txt` |
| New API regressions | Seven pass, included below | `raw/python-final.txt`, `tests/test_import_queue.py` |
| New queue state/recovery regressions | 22 pass, included below | `raw/node-final.txt`, `tests/import_queue.test.mjs` |
| Full Python discover | 270 tests; OK, three existing environment skips | `raw/python-final.txt` |
| Full Node, including report readers | 231 pass | `raw/node-final.txt` |
| Production-proxy queue UI / native picker / 100-file case | 34 pass | `ui/results.json`, `raw/ui-final.txt` |
| Keyboard focus / unavailable storage / plain-HTTP IDs | Six pass | `controls/results.json`, `raw/controls.txt` |
| Previous single-file / duplicate / export / home-report flows | 18 pass | `single-import/results.json`, `raw/single-import.txt` |
| Browser errors | Normal console / HTTP / project-external requests all zero | The three browser result JSON files |
| Production build | Direct Next exit 0; npm unavailable/127 retained | `raw/build.txt`, `raw/npm-build.txt` |
| Syntax / scope | Both JS files pass; 129 protected paths and 108 built website sources unchanged | `raw/syntax.txt`, `raw/scope.json` |

The **58 browser checks** use 1440px desktop and 390px touch emulation. The main flow mixes valid TXT, equivalent DOCX, invalid UTF-8 and corrupt DOCX; it checks per-row progress/failure/retry, deferred duplicate decisions, stop/close after the current response, keeping a separate copy, clearing finished rows, refresh/reselection, refusal of changed extracted text, reconciliation of a lost receipt, exact source opening, JSON download and 101-file rejection. The 100-file run preserves the original 19 sources / 317 codes / 874 links and full frozen QCA/report state; only 81 deliberate document-import events are added. Metadata is 43,529 bytes in that run, with no transcript body. Phone tests are emulation, not current physical-device or VoiceOver approval.

A first production run caught a missing `/w` prefix on the new queue script; it is fixed and guarded by a real script-content regression. The second run exposed a test-harness race that checked for a held backend receipt before it existed; the final harness waits for the actual completed save before withholding the response. The intermediate 30-check run left a held route outstanding on teardown; the final harness explicitly releases that stale response after refresh. Initial failures and intermediate outputs remain in `raw/ui-first.txt`, `raw/ui-second.txt` and `raw/ui-third.txt`; they are not described as final passes. Final controls, single-file compatibility and queue runs complete without those teardown errors. Existing optional-fixture ResourceWarnings remain in Python output.

The successful Next build uses an isolated physical dependency copy. All 108 website sources match it; production proxy tests and the new review entry are started afterwards. The known `-t .` collection issue is not changed or presented as fixed. Windows remains deferred.

## Current review entry and next gate

**http://127.0.0.1:52760/** → Workbench → **Bologna · batch import review**. This is a fresh editable 19-document copy with technical QCA/report examples; earlier project data is preserved. The entry's current app, queue JS, CSS, prefixed script and nonmutating preparation are verified. Two public TXT inputs are in the evidence package's `sample-inputs/`: select both to try the queue, then re-add one to exercise a duplicate choice. These links need the developer's local services.

Only UX55-03 is closed here. **UX55-04**, the report's explicit method/process presentation, remains untouched. Final joint workflow, current physical-device/accessibility and researcher/supervisor acceptance remain open. Existing Word/ZIP samples are preserved and hash checked. This is a review candidate, not final product acceptance or permission to release.
