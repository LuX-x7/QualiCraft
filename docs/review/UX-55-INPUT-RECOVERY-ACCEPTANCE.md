# UX55 · Input, sequential import and interruption recovery

18 October 2026. Baseline `2e2dca205d04f4d952c17932f879fa492c7f586f`. **Acceptance only: no product, website, statistics or plotting changes.** Public Bologna disposable projects only. All memberships are labelled technical designations, not research findings. No private transcript was opened. Windows remains deferred and unverified; no push or deployment.

## Decision

The bounded database recovery path works in the exercised scenarios. The **overall final acceptance remains open**: two P2 findings, a genuine batch-upload gap and the newly requested method-diagram presentation remain unresolved. Completing an audit is not closing the defects it discovers.

There are **42 completed checks**: 16 input/recovery observations, 10 byte/shape guard checks, 2 missing-calibration recovery checks and 14 Chrome workflows. Their executable assertions completed, while the observations explicitly record failures of the wider product goals. This is not “42 final gates all green.” Phone tests are Chrome touch emulation. No current physical-device / VoiceOver sign-off is inferred.

## Final deliverables, with clearer names

| Deliverable | What it contains | Current availability |
| --- | --- | --- |
| Coded source notebook | Full source, exact highlights and actual Code / Category / Theme ancestry, including uncoded context; HTML and native editable Word | Available. `tree-notebook.docx` is a sample name, not another analysis method. Word edits stay in Word. |
| Five figure bundles | Frequency, document × code coverage, co-occurrence, hierarchy and accumulation; each includes SVG, PDF, 300 dpi PNG, count CSV and its Python recipe | Available. These describe coding data; they are not five different QCA configuration charts. |
| Research report | Method-specific research design, findings, Narrative Analysis, review/limitations, selected evidence and optional five frozen figures; editable Word / HTML and data/code ZIP | Available. `research-report` is the umbrella deliverable. `qca-report` is the Comparative QCA example of the same report workflow. TA / Content use evidence tables; Comparative adds calibration, truth table, configurations and set-relation metrics. |
| Recoverable project JSON | Documents, codebook, codings, reading marks, calibration, retained QCA runs, report versions and frozen assets | Available and essential for resuming work in QT. It is distinct from a Word report or frozen QCA run JSON. |

The exported report header already carries the saved full method name. Empty Method and decisions notes currently disappear, and no method process diagram is generated. The owner’s requested improvement is specified in [Report method-flow design](REPORT-METHOD-FLOW-DESIGN.md), **not implemented in this audit**. Existing website three-method cards and workbench selection remain as UX54; the new diagram has not been silently advertised as shipped.

## Open issues and scope gaps

| ID | Priority | Observation and consequence | Evidence / next acceptance |
| --- | --- | --- | --- |
| UX55-02 | P2, fix first | `_snapshot()` publishes a valid candidate inside the still-uncommitted SQLite write. SIGKILL after file publication rolls the database back to QCA revision **2**, but `000002.json` retains revision **3**. Both records are internally complete; the snapshot is an unacknowledged run ahead of live state. The UI does not distinguish that commit status. No acknowledged source data loss was observed. | `accepted/results.json`, scenario `QCA-snapshot-before-commit`, exact before/after hashes; `accepted/faults/QCA-snapshot-before-commit/recovered-summary.json`. Fix must prevent an uncommitted snapshot being listed as committed, preserve old recovery points, and reconcile a crash after DB commit but before snapshot publication. Repeat the same kill windows and full JSON/report/asset recovery. |
| UX55-01 | P2, import safeguard | The same name and exact source SHA can be imported twice with different document IDs and no duplicate warning. This can accidentally increase document counts. Intentional duplicate documents may be legitimate and must not be silently merged. | `accepted/results.json`, duplicate import IDs and equal SHA. Before mutation, offer an explicit choice to keep another copy or cancel; preserve every original record and its mappings. Add browser and API/concurrency checks without changing counting definitions. |
| UX55-03 | F09 scope gap | The real file input has `multiple=false`; a controlled two-file selection is refused. Sequentially reaching 100 documents is not genuine batch upload or a resumable upload queue. | `ui-final/results.json`; `desktop-single-file-boundary.png`. A later bounded queue must show per-file saved/failed/cancelled state, stop remaining work, retain acknowledged items and support explicit re-selection/retry after interruption without silent double import. |
| UX55-04 | New presentation requirement | Full method name exists in the report header, but Method and decisions lacks an explicit saved-method block and method-specific flow diagram. With empty notes, that heading is absent. | `raw/methods-presentation.json`, `raw/scope.json` source scan and current export functions. See the linked design and its acceptance criteria. No method-completion claim may be inferred from a decorative diagram. |

No P1 data-corruption failure was observed in these defined scenarios. That is a bounded observation, not proof against all storage failures.

## Exercised input boundaries

- Browser imports preserve UTF-8 BOM-decoded text, CRLF and source-only DOCX text exactly. DOCX is text extraction, not faithful page-layout ingestion. Invalid UTF-8, unsupported PDF and over-8 MB input give visible feedback without changing the project; the tested negative browser cases make no HTTP error requests.
- The server accepts exactly **500,000 characters** of repeated public Bologna text and rejects 500,001, whitespace-only text and corrupt DOCX. Missing main XML, entity declarations, XML larger than 12 MB and containers larger than 8 MB are rejected atomically. This does not add native PDF/scanned-page import.
- Seventh condition, 101st case, narrative over 100,000 characters, fractional membership, tampered frozen results / report hashes and missing figure assets are rejected. Existing project, audit, project list and snapshot member hashes remain equal.
- An HTTP header over 20,000,000 bytes is rejected before the body is read. A real project body between the 19 MB state guard and 20 MB request ceiling is independently rejected without creating a project.
- A real 100-case / six-condition design with 2,000-character technical rationales reaches **4,551,504 bytes** after two large runs. The next run would exceed 6 MB, so it is refused. All previous runs, history, report, audit and snapshots remain intact. Thus the history count is an upper bound, not a promise that every maximal-size design can retain all versions within the byte guard.

## Interruption and recovery results

All kills use SIGKILL on a subprocess created by the harness, never another service. Test-only hooks pause at exact production boundaries; product sources are untouched. Each process is restarted against its own original database, and `PRAGMA integrity_check` returns `ok`.

| Window | Observed result |
| --- | --- |
| Calibration SQL update before snapshot/commit | Entire old project restored; no partial calibration or audit persisted. |
| Detached QCA computation complete, before writer | Old calibration/run/report retained. |
| QCA SQL update before commit | Entire old state restored. |
| QCA snapshot published, before commit | Database restored old state; ahead snapshot exposed UX55-02. |
| QCA committed, response not delivered | New run fully recoverable, old run in history, old report retained and visibly stale; retrying the old revision returns 409. |
| Detached report preparation or report SQL update before commit | Old report, all frozen assets and QCA state retained. |
| Report committed, response not delivered | New complete report recoverable; old revision retry returns 409. |
| ZIP transfer killed after one-third of bytes | Client reports `IncompleteRead`; no state mutation; complete retry succeeds. Partial network bytes are not called a completed export. |
| Missing membership saved, receipt lost | Restart, JSON and snapshot copy retain `null`, rationale and old frozen run/report. Missing stays missing, rerun is refused atomically, and old exports remain available. |

Unsaved browser calibration is a separate boundary: closing the QCA dialog presents a guard and permits a draft JSON download. Explicit discard and reload return to the saved calibration. This is not automatic persistence or one-click restoration of an unsaved browser draft; the project recovery claims apply to saved state.

## Continuous import and independent exports

Starting from 19 public documents, 12 real document API imports are acknowledged. The next import is killed after SQL update and before commit. Restart retains exactly **31** documents. Another 69 imports reach **100** distinct document IDs; the 101st is refused with project/audit/snapshots unchanged. This is 81 sequential imports, not a 100-file browser upload.

The whole import/restart/restore sequence takes **17.461s** in this run; individual imports take **0.121–0.187s**. These are single-machine measurements, not cross-device promises. The final project export is **8,067,126 bytes**. The existing 317 codes / 874 coding links, entire QCA state, report versions and all five frozen assets remain unchanged. New source documents correctly make old results/reports stale without rewriting their evidence.

Both full project JSON and snapshot restoration create independent projects with equal documents, codes, annotations, calibration, runs, report/history/assets and stale semantics. The recovered report ZIP contains the same frozen QCA record and five existing figure recipes. All **six** scripts are actually executed: QCA reproduces all values/IDs, and each of the five figures preserves every frozen member byte-for-byte. Nested Word ZIP container timestamps are excluded from archive identity; every actual OOXML/image member is compared instead. No original data or SVG/CSV is replaced to make a check pass.

## Commands and evidence

Evidence root: `~/qualicraft-review/ux-55/`. Command output, exit codes, check JSON, screenshot index and member hashes are in its `COMMANDS.json`, `ACCEPTANCE.json`, `raw/`, `ui-final/` and `MANIFEST.json`. The full local commit is in `COMMIT.txt` and the updated supervisor pack’s `COMMITS.md`.

| Command (repository root; Python runtime recorded in COMMANDS.json) | Exit / result | Raw |
| --- | --- | --- |
| `python tools/e2e/recovery_boundaries.py --out /tmp/qualicraft-ux55/accepted --seed /tmp/qualicraft-ux55/second/public-seed.project.json` | 0; 16 observations and two P2 findings | `raw/boundaries-accepted.txt`, `accepted/results.json` |
| `python tools/e2e/recovery_input_limits.py --project /tmp/qualicraft-ux55/second/public-seed.project.json --out /tmp/qualicraft-ux55/limits` | 0; 10 checks | `raw/limits.txt`, `limits/results.json` |
| `python tools/e2e/recovery_partial.py --project /tmp/qualicraft-ux55/second/public-seed.project.json --out /tmp/qualicraft-ux55/partial-final` | 0; 2 checks | `raw/partial-final.txt`, `partial-final/results.json` |
| `python tools/e2e/recovery_ui.py --project /tmp/qualicraft-ux55/accepted/recovered-100.project.json --out /tmp/qualicraft-ux55/ui-final` | 0; 14 workflows; console / HTTP / outside-project errors 0 | `raw/ui-final.txt`, `ui-final/results.json`, 12 screenshots |
| Scope / syntax checker | 0; **136** protected product/data/deployment paths equal baseline; **108** website files equal the already successful UX54 build; four new scripts parse | `raw/scope.json`, `raw/scope.txt` |

`--seed` reuses validated public frozen figure assets for this run; omitting it constructs the technical QCA seed from bundled Bologna. Every supplied seed is compared against the bundled source/code/coding records. No external service or model is used. The new scripts are acceptance assets, not user-facing features.

Earlier failures remain raw evidence: the first sandbox could not bind loopback; the initial archive comparison treated a nested Word ZIP timestamp as content; an early UI script used an ambiguous Close selector and then a malformed screenshot path; the partial-state script first used `entry` instead of the existing package key `report`. Only the harness was corrected. The successful runs retain their own logs and results. No failed attempt is presented as a product pass.

Because no application or website source changed, the full Python/Node suites and website build were **not rerun**. UX54’s 239 Python / three skips, 200 Node and production build remain explicitly historical evidence. This round exercises the new acceptance harness against that unchanged product. No assertion of physical power-loss, disk corruption, all possible concurrent schedules or maximum 50,000-coding stress is made.

## Remaining order

1. Fix UX55-02 commit/snapshot correspondence; then UX55-01 duplicate-import choice. Repeat the exact reproductions and normal source/plot checks.
2. Implement an explicitly bounded, cancelable/resumable multi-file queue for UX55-03. Preserve each acknowledged file and require a deliberate duplicate choice.
3. Implement the report method-name/process design, using the same saved model in the workbench, HTML, editable Word and website explanation. This changes presentation, not statistics.
4. Joint regression of the final candidate, current physical-device / VoiceOver / reduced-motion / download feedback, researcher interpretation and supervisor acceptance. Windows remains deferred by the owner.

No feature was fixed in this audit. No push or deployment occurred. The remaining work is visible and finite; the product is still a review candidate rather than the completed final target.
