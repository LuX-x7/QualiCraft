# UX56 · Committed snapshots and restart recovery

18 October 2026. Baseline `8417cb595f55858c3b5818b1328648f981beaa84`. The owner authorised **UX55-02 only**. This round changes snapshot persistence inside `Store`, adds regression/fault tests and updates review records. Statistics, plotting, QCA mathematics, report rendering, website/workbench UI and public source assets are unchanged. New acceptance projects use disposable public Bologna copies; no private interview was opened. Windows deferred and unverified; no push or deployment.

## Result

**UX55-02 is closed for the exercised commit/crash windows.** An uncommitted candidate is no longer published as a recovery point. Committed changes whose publication is interrupted retain a durable obligation that is retried on restart. Existing recovery files are preserved, and normal retention keeps the original first point plus the latest points, at the existing 30-file ceiling.

The initial four new regressions all failed on the baseline and pass after the fix. The final suite includes **12 new snapshot tests**, **251 Python tests / OK / three environment skips**, **200 Node tests**, and **46 acceptance checks**: 21 recovery observations, two missing-calibration recovery checks, five snapshot UI flows, 14 recovered-project Chrome flows and four new-site checks. The 23 browser flows have zero normal console / HTTP / outside-project errors. Phone checks are Chrome touch emulation, not current physical-device sign-off. Other known issues observed during these checks remain open rather than being counted as final acceptance passes.

## Persistence contract

- `create()` and ordinary research `change()` enqueue the complete snapshot payload and reserve its sequence number **inside the same SQLite transaction as the project row**. Rollback removes the candidate, queue entry and reservation together; no candidate file is created or old point pruned.
- Only after the project transaction commits does the publisher read the durable outbox, write a sibling `.part`, atomically rename and verify the complete JSON. It checks the independently committed outbox/live record before publishing. It rotates old files only after a verified committed replacement exists.
- Reserved filenames are persisted. A crash after rename but before queue acknowledgement replays the same name and verifies its exact content; it does not generate a duplicate. A different existing file is preserved and reported, never overwritten to make a replay succeed.
- Restart drains committed pending jobs before normal use. A crash while writing `.part` leaves no listed recovery point; replay finishes the committed payload and removes that partial file by rename. A committed write is not lost merely because its reply or snapshot publication was interrupted.
- Filesystem failure still does not undo an already committed edit. The pending job remains, the existing backup-error path reports the problem, and later restart retries it. One blocked project does not prevent other projects’ jobs from being published; its error remains reported even when another project succeeds.
- Old-format upgrade / reading-mark reset guards still verify a recovery point for the **old committed state before editing**. A candidate from the open transaction cannot pass that committed-state check. Normal reading-only edits keep the existing snapshot timing; batch coalescing and restore-as-copy behavior remain.

Two additive internal SQLite tables, `snapshot_outbox` and `snapshot_sequences`, provide that journal/sequence state. **Project JSON remains schema v5**, with no new report, calibration or analysis fields. Old databases acquire the internal tables automatically; existing snapshot bytes/names are not rewritten, renumbered or retrospectively classified as transaction-certified. The new guarantees apply to writes using this implementation. No historical recovery point is deleted as a migration shortcut.

This is a recoverable commit/publication protocol, not a claim that a filesystem file and SQLite can be changed at the same physical instant. SIGKILL/process-restart behavior is tested; physical power loss, disk corruption and every filesystem/concurrency schedule are not claimed.

## Regression evidence

`tests/test_snapshot_commits.py` uses public Bologna temporary databases. It checks publication against a separate committed SQLite reader; rollback at the 30-point retention ceiling; retry after publication failure; rename/receipt replay; refusal of a direct uncommitted candidate; immutable ordered pending states; four-worker/two-Store concurrent edits; create rollback; legacy file/number preservation; commit before publisher entry; preservation/reporting of a filename collision; and isolation of another project’s publication failure.

The first four fail on old code (`raw/regression-red.txt`, exit 1). All final 12 pass (`raw/regression-final.txt`, exit 0). During implementation a focused failure exposed a global queue stopping at one blocked project; the final publisher preserves per-project order while continuing other projects. That first failure remains in `raw/blocked-project-first.txt`. No test or output was removed to conceal it.

## Forced interruption results

Only owned test subprocesses are killed; no previous project service or window is read/reset. The test hooks are in the acceptance harness, not in application code. The old “after snapshot, before SQLite commit” window cannot exist in the repaired write order; tests explicitly exercise both the pre-commit queued state and the post-commit publication state instead.

| Window | Verified result after restart |
| --- | --- |
| Calibration or QCA/report SQL write before enqueue/commit | Exact old live state and old recovery-point hashes remain; no pending candidate survives. |
| QCA enqueued, before SQLite commit | Project and outbox both roll back; no candidate file or pruning. |
| QCA/report committed, publisher not entered | Committed state survives and its queued snapshot is written on startup. |
| QCA snapshot only one-third written | Only `.part` exists before restart; old listed points remain. Replay publishes the complete committed JSON, with no remaining partial. |
| QCA/report rename complete, queue/reply not acknowledged | Live state and file agree; retry verifies that reserved filename, with no duplicate. |
| QCA/report committed, HTTP reply not delivered | The full new version survives; old versions/bindings remain, and retrying the old revision returns 409. |
| Report ZIP transfer interrupted | Client reports an incomplete read; retry produces the complete frozen package without changing the project. |
| Missing calibration saved, reply lost | Restart, project JSON and snapshot copy retain `null` rather than zero; rerun is refused without changing the old frozen result, report, audit or recovery points. |

All restart checks report SQLite integrity `ok`, zero pending jobs after successful replay, no ahead-of-live snapshot and exact old recovery-point hashes. Full QCA definitions/rationales/evidence, frozen run/history, report versions and all five assets are validated. No change to the independent engine is used to make stored results match.

The original sequential-import scenario also passes: 19 documents → 31 acknowledged → interrupted next write → restart retains 31 → continue to 100. The 101st is still refused. JSON and snapshot restoration retain the full QCA/report state and deliberately stale flags after source imports. These are technical public-source copies, not 100 independent participants, and this does not implement multiple-file upload.

The recovered QCA script and five original figure scripts are actually run again. Every QCA value and case ID matches; all 25 original figure members match their frozen bytes. Nested Word ZIP timestamps are not treated as changed OOXML content; actual member content is compared. Existing notebooks and report samples are retained rather than replaced.

## UI and build acceptance

Desktop keyboard opens the normal Snapshots dialog and restores the earlier point into a complete separate project; the original project remains equal. Phone report Save creates a complete committed snapshot, refresh retains calibration, and actual project JSON download restores all sources/calibration/runs/reports/assets. The existing phone scope still hides the snapshot-restore entry; it was not silently enabled. Current human phone/VoiceOver/reduced-motion/download acceptance remains separate.

The new isolated production site is **http://127.0.0.1:52757/** → workbench → **Bologna · committed snapshot review**. It contains the public 19 documents / 317 codes / 874 coding links and a saved technical QCA/report example. Its proxy token identity is verified against its newly started backend; no token is included in evidence. Previous 4445/52755/52756 services and their projects remain untouched.

`npm run build` is unavailable in this environment (127, retained). The bundled Node / existing Next production build succeeds (0) in an isolated physical dependency copy, with no package installation or configuration change. All **108** website source files match that successful build; the new site is started afterwards. Original middleware/module warnings are retained. No deployment occurred.

## Commands, raw outputs and scope

Evidence: `~/qualicraft-review/ux-56/`, with full commands/exit codes in `COMMANDS.json`, screenshots in `ui-snapshots/`, `ui-recovery/`, `site/`, and state/member hashes in `raw/scope.json` and the manifest. Local commit is recorded in `COMMIT.txt` and the supervisor pack’s `COMMITS.md`.

| Check | Result | Raw |
| --- | --- | --- |
| New regression before fix | 4 failures, exit 1 | `raw/regression-red.txt` |
| Final snapshot regression | 12 pass, exit 0 | `raw/regression-final.txt` |
| `python -m unittest discover -s tests -v` | 251 tests, OK, three environment skips; exit 0 | `raw/python-final.txt` |
| `node --test tests/*.test.mjs tools/report/*.test.mjs` | 200 pass, exit 0 | `raw/node-final.txt` |
| Recovery harness, expanded to publication windows | 21 completed observations; UX55-02 absent, UX55-01 deliberately remains | `raw/recovery-final.txt`, `recovery-final/results.json` |
| Missing calibration receipt/recovery | 2 pass | `raw/partial.txt`, `partial/results.json` |
| Desktop/phone snapshot UI | 5 pass, console/HTTP/outside errors 0 | `raw/ui-snapshots.txt`, `ui-snapshots/results.json` |
| Recovered 100-document UI | 14 pass, console/HTTP/outside errors 0 | `raw/ui-recovery.txt`, `ui-recovery/results.json` |
| New production site home/report | 4 pass at 1440/390; no overflow or console/HTTP/outside errors | `raw/site.txt`, `site/results.json` |
| Build | Direct Next 0; npm 127 retained | `raw/build.txt`, `raw/npm-build.txt`, `raw/build-proof.json` |
| Scope/syntax/diff/links | 135 protected paths equal; core outside Store AST equal; JS syntax and documentation targets checked | `raw/scope.json`, `raw/short-checks.json` |

Only `Store` persistence behavior changes in product code. Core functions/constants outside that class, the complete analysis/plotting/QCA/report modules, all web/website assets, dataset and deployment paths are byte/AST checked. Acceptance harness hooks are updated for the new commit order. Earlier intermediate logs remain, including an initial Node invocation collecting only `tests/` (179); the final explicit command includes `tools/report/` and collects all 200. Existing Python fixture ResourceWarnings are retained without being called browser errors or filtered out.

## What stays open

UX55-01 duplicate-import choice, UX55-03 actual multiple-file queue, UX55-04 explicit report method/process map, current physical-device/accessibility and researcher/supervisor acceptance. No unrelated feature is implemented in this round. Windows remains deferred. The entire project is still a review candidate; closing UX55-02 does not close the final product target or authorise a push/deployment.
