# UX86 — 75E English first-visit joint acceptance

Date: 2026-10-21. Baseline: `0d8a13496b43c159daea83ac844e6bb487cc9920` (UX85).

## Conclusion

**75E is not fully passed.** The complete route was exercised, including final downloads and normal file-chooser JSON recovery, but five P2 findings remain. A second code on the same highlight required an explicitly recorded reverse-drag workaround; the reading-position gate failed for a short English source. Do not describe this as a clean end-to-end pass or as supervisor/newcomer acceptance. No research-data loss was observed in the checked exports/restoration.

This is audit only. Product sources, statistics, plotting, Bologna/translation assets, site assets and deployment configuration are unchanged: 191 tracked files match the baseline byte for byte (`protected-files.json`). Only this audit harness and review documentation are committed. Nothing was pushed, deployed or restarted online. Windows remains deferred.

## Scope and method

- Local disposable **hosted-mode** server `http://127.0.0.1:52916`, fresh invited QA accounts and independent Bologna teaching projects. No other accounts or research projects were read. Local server saving/registration are real hosted code paths, not a mock.
- Actual public site `https://qt-review.taila524d0.ts.net/QualiCraft/`: workflow, relationship map, methods, report CSV selection and downloadable assets. This round did **not** repeat the whole workbench route on the remote server; local timings below are not online latency promises. Previous UX85 online evidence remains historical.
- Controlled Chrome, mouse gestures, keyboard and file choosers; 1440×1000 and 390×844 viewport. Narrow-layout simulation is not physical phone, VoiceOver or Windows verification.
- Default English teaching example is **3 translated excerpt documents / 25 nodes / 11 saved associations**, not a full translation of the 19 original Italian interviews. Source text matches the teaching fixture. Italian originals remain a labelled archive.
- Upload two translated excerpt copies, producing 5 documents, then manually assign two existing stable code IDs to the same `[5,28)` range: 13 associations. These are technical test annotations, not substantive research findings. No real participant interviews or LLM requests.
- Comparative QCA uses two expressly artificial Bologna-linked cases, binary A/B/Y memberships `(1,0,1)` and `(0,1,0)`, expected solution `A*~B`. It verifies the implemented crisp-set path, not empirical validity or all possible QCA designs.

## Remaining issues

| ID | Priority | Reproduction and observed behavior | Acceptance needed |
| --- | --- | --- | --- |
| UX86-01 | P2 | First fresh-text selection works; left-to-right re-selection of the same existing highlight opens no candidate picker. Right-to-left drag works and was explicitly used to continue the audit. Real mouse gestures; saved boundaries remain exact. | Both drag directions on existing/overlapping highlights open the correct picker without losing the selection. |
| UX86-02 | P2 | On the 894-character, three-paragraph English source fitting the desktop reader, Keep paragraph 2 initially records offset 99; the next viewport sample replaces it with 0. Resume, clear search, document return and refresh return to 0. Read/Revisit data survives. | Explicit Keep survives viewport sampling and all return routes, including short documents; ordinary reading scroll can still update its own position. |
| UX86-03 | P2 | Fresh registration emits Chrome's invalid HTML pattern error for `[a-zA-Z0-9][a-zA-Z0-9_.-]{2,47}` under the `v` flag. Valid registration succeeds. Server-side validation is separate and remains present. | Valid browser pattern, tested invalid/valid names, no normal console error. |
| UX86-04 | P2 | Hosted header says `Saved on server`; saved report says `Saved locally`. Import receipt also says saved locally; QCA editor wording needs the same audit. Persistence itself passed. | Accurate local/hosted wording in every save receipt and report/QCA state. |
| UX86-05 | P2 | Live website hierarchy story says 259 rows and accumulation story 19 interviews, while current English CSVs contain 10 hierarchy rows and 3 accumulation steps. Actual report data and downloads are correct. | Story scale agrees with the active teaching manifest/CSV, retaining separate original-archive provenance. |

Recommended sequence: UX86-01 and UX86-02, then registration and storage wording, then site scope wording, followed by a fresh 75E rerun. None is silently fixed in this audit. Existing 75D implementation history remains intact; these are new integrated-boundary findings.

## Route results and evidence

Final workbench run: `joint-d/results.json`, complete=true, acceptance_pass=false, exit **1**. Fifteen stage records: fourteen marked pass, one reading-position failure. Coding's pass includes the UX86-01 workaround and is not counted as a clean novice pass. Normal console: **1**, uncaught page errors: **0**, HTTP errors: **0**.

1. Fresh registration opens project selection, not an existing Coding document. Empty import and first manual create/assign work; English example creates an independent editable project.
2. Real batch file selection imports exact English text; same-name/content duplicate dialog cancels without a write. Target leaf name + Enter selects its saved ID; two assignments on one range remain separate. `01`–`06` screenshots and `selection-forward-no-popup.png`.
3. Read → Revisit → Undo → Read, second paragraph Revisit, and the two-track overview preserve states. Keep/Resume boundary fails as above: `reading-observations.json`, `07`/`08` screenshots. Tree scope/explicit filtering and return preserve research data.
4. Relationship map: 25 nodes, 27 links; every endpoint exists. Selecting the new coding reaches the correct source and returns without a project write. `10-network-evidence.png`.
5. All five figure choices are discoverable after explicitly enabling Figures, generate previews, preserve original proportions, and download SVG/PDF/PNG/CSV/Python. Manual expected frequency increments, overlapping pair=1 and distinct-code count=10 agree with unchanged analysis definitions. `plot-records.json`, five ZIPs, `11-*-original-size.png`.
6. Research report freezes all five figures; all 25 corresponding bundle members match the workbench exports. Content Analysis, TA and separate Comparative QCA each retain a six-step frozen method map and HTML/Word/JSON/ZIP exports; restoring previous report versions retains assets and QCA binding. `12-*` screenshots.
7. Notebook exported while the reader has a no-match filter still contains all 894 source characters and both coding paths. HTML mouse/keyboard links work; Word contains editable native text/tree, not a screenshot. `13-notebook-linked-tree.png`, `notebook.html`, `notebook.docx`.
8. All five standalone figure scripts reproduce **all five bundle members byte for byte** in the font-accessible Mac environment; QCA script reproduces frozen result JSON exactly. `reproduction-font-access/results.json` and per-script `execution.txt`. Installed font availability is required for byte-identical graphics; the sandbox's missing PingFang run is retained as an environment failure, not hidden.
9. Normal raw JSON via actual file chooser restores as a new project. Full documents, codes, annotations, blocks, QCA runs and all report versions/assets match; source project unchanged. Reading marks retained. This does not erase UX86-02's separate local reading-position failure. `final-project.json`, `restored-project.json`, `15`/`16` screenshots.
10. Public website: all **59** table rows match published CSVs; first/middle/last row choices in all five sections and frequency/accumulation mouse/End-key interaction align. All report and worked-example manifest file SHA-256 values match downloads. Relationship map retains nodes/30 links at 390px, no page overflow; Help/Sources reachable. Console/page/HTTP errors **0**. `website-complete/results.json`, exit **1** because UX86-05 remains.

## Observed timings

Single final local run; includes UI actions, not a benchmark or p95. Registration-to-start 0.310s; empty upload plus first coding/example checks 1.134s; two-file import/duplicate cancellation 0.463s; the two existing-code save operations 0.031s and 0.035s; five previews/download bundles together 8.526s; freezing five report assets 5.800s; three report methods/formats/version checks together 10.132s; Notebook/project exports 0.804s; normal JSON restoration and comparison 1.279s. Detailed stage boundaries and raw values are in `joint-d/results.json`.

## Word/layout inspection

Rendered actual downloaded Notebook and Content/TA/Comparative reports: **3 + 12 + 12 + 14 = 41 pages**. Inspected every page on contact sheets plus full-size Notebook tree, method map and heatmap pages. No observed overlap/cropping; explicit method names, italic source and tree paths remain readable. Some evidence-heavy reports leave generous whitespace and spill audit metadata onto a final page: possible later presentation refinement, not a new data-integrity failure. This is LibreOffice rendering QA on Mac, not native Microsoft Word/Windows acceptance. `word/*/page-*.png`, PDF and contact sheets.

## Reproducibility and retained failures

See `commands.txt` and `raw/` in the evidence package for exact commands and exits. The checked-in harness is `tools/e2e/phase75e.py`, constrained to localhost; provide a private config with a fresh disposable invited username and server URL. It exits nonzero on open findings. Credentials, cookies, accounts databases, private runtime/config and original participant documents are excluded from the package.

Early `joint`, `joint-b`, `joint-c` runs and their logs remain. The forward-selection finding is genuine. Two later failures were harness reporting/preparation issues, corrected only in the audit harness, never product code. Final `joint-d` starts fresh and exercises every stage. Website preparation originally checked only h1 on a page using h2; explicit graph readiness and the proper heading check fixed that harness assumption. The final live site still correctly fails its scale-copy gate.

Build/check results are recorded below. Review artifacts live outside Git at `~/qualicraft-review/ux-86/`; archive `~/qualicraft-review/ux-86-supervisor-review.zip`. This audit is not an authorization to fix/deploy remaining items.

## Completed regression/build checks

- `node --test tests/*.test.mjs`: **322 passed**, exit 0; `node --check web/app.js` and audit-harness `py_compile`: exit 0.
- `MPLCONFIGDIR=/tmp/qt-84/mpl /tmp/qt-77-env/bin/python -m unittest discover -s tests -v`: **345 tests, 3 existing skips**, 94.732s, exit 0 with authorized localhost socket access. Initial sandbox execution had 82 socket-bind errors (345 tests / 3 skips); retained in `raw/python-tests.txt`. It is an environment failure, not 82 product defects. Existing SQLite ResourceWarnings are retained.
- Production build via the bundled Node executable and `node_modules/next/dist/bin/next build`: exit 0; existing middleware deprecation warning retained. Initial `npm run build` attempt exited 127 because npm is absent from this shell; `raw/site-build.txt` retained. The actual Next build completed successfully in `raw/site-build-direct.txt`; no npm installation or product edit.
- `git diff --check`: exit 0; 191 protected tracked files byte-identical to baseline. No statistical or visual output code/data changes. Previous `-t .` collection limitation is outside this audit and is not concealed by changing the test entry point.

Status: 75E execution/evidence **completed**; 75E acceptance **not passed**; UX86-01–05 **pending**, no implementations or online fixes claimed. Prior 75D fixes remain implemented/tested/online within their recorded scopes.


## Follow-up UX87 (21 October 2026)

UX86-01 was fixed and the browser regression now passes locally; see UX-87-HIGHLIGHT-RESELECT.md. It is no longer an open product issue; the active QT server file is synchronized and hash-verified. Authenticated online interaction remains unverified. UX86-02 through UX86-05 remain open. The historical 75E result above remains “not passed.”
