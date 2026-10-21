# UX92 — registration, storage wording and joint gate

21 October 2026. Follow-up to [UX91 / UX86-02](UX-91-SHORT-READING-POSITION.md). Only fresh isolated Bologna accounts/copies; Windows remains deferred. No shared server, account, statistical or plotting implementation was touched.

## Fixes

- **UX86-03:** escape the literal hyphen in the HTML username pattern for Chrome's current pattern syntax. Allowed names, the independent server regex, invitation requirement and six-character password minimum remain unchanged.
- **UX86-04:** import receipts and both report/QCA saved-state labels distinguish local storage from a private QT server workspace in English and Chinese. Unsaved writing/calibration still says unsaved. Browser reading positions continue to belong to the browser, including online use. These are display changes, not a new storage mechanism.

`qualicraft/hosted.py` changes only the HTML pattern. `web/app.js` passes the existing hosted flag to the two editors and supplies the hosted import receipt. The editors change only their saved-state text. No database, authentication policy, API, project format, frozen result, snapshot, statistic, CSV or rendering path changes.

## Evidence and measured result

Evidence root: `~/qualicraft-review/ux92-joint-gate/`. Secrets, account stores, cookies and private runtime/config files are excluded.

| Check | Raw output / command | Result |
| --- | --- | --- |
| Storage regression before | `node --test tests/storage_copy.test.mjs`; `regression-before.txt` | 6 fail, 8 pass; exit 1 |
| Storage regression after | same command; `regression-after.txt` | 14 pass; exit 0 |
| Registration old HTML | `tools/e2e/hosted_ui_copy.py --baseline-auth ...`; `auth-before-final.txt` | Reproduces invalid-pattern console error and invalid names incorrectly accepted; exit 1 |
| Registration fixed | same harness without baseline override; `auth-final.txt`, `auth-final/results.json` | 9/9; valid/invalid/48–49-character boundaries, direct registration to project start; console/HTTP/outside requests 0; exit 0 |
| Frontend | `node --test tests/*.test.mjs`; `node-tests.txt` | 345 pass; exit 0 |
| Python | `MPLCONFIGDIR=/private/tmp/qt92/mpl /tmp/qt-77-env/bin/python -m unittest discover -s tests -v`; `python-tests.txt` | 346 tests, 3 existing skips; exit 0; 137.679s |
| Workbench joint route | `tools/e2e/phase75e.py --config <private config> --out ...`; `joint-final.txt`, `joint-final/results.json` | 15/15; no issues, console/page/HTTP errors 0; exit 0 |
| Website + report | project-only `site-joint.py`; `site-joint-final.txt`, `site-joint/results.json` | 14/14 across 1440 and 390; all 11 scenes, methods, relationship endpoints, 594 CSV rows, manifest downloads, Help/Sources; errors 0; exit 0 |
| Original heatmap | `tools/site/heatmap_acceptance.py --url http://127.0.0.1:4425 --out ...`; `heatmap.txt`, `heatmap/results.json` | 7/7; exact 301 matrix rows, hover, keyboard, touch emulation, original SVGs and downloads; errors 0 |
| Production | UX91 `build.txt`, same unchanged website source | exit 0; preview restarted after build |
| Syntax and boundary | three changed JS files checked with `node --check`; `scope.txt` | exit 0; core/analyze/plotting, demo data, website, Render and workflows unchanged relative to UX91 |

The workbench route starts with a fresh invited account and checks empty upload, batch import/duplicate cancellation, exact leaf Enter, forward reselect and overlapping assignments, Read/Revisit/Undo, short-source Keep/Resume/search/document/refresh, single-tree filtering and return, network source return, all five figures with original ratios/CSV and 25 bundle members, manually expected counts, frozen report assets, known-answer crisp-set QCA, three report methods with six-step maps, Notebook/Word/code exports, normal JSON restore, and narrow single-tree/start navigation.

The first complete pass took **40.945s summed stage time** in this local controlled run, including all generated figures and reports. Keep/Resume/search/switch/refresh stage: 1.048s. All five preview/download bundles: 11.697s. JSON restore/integrity: 1.547s. These are end-to-end UI timings on this Mac, not online latency promises.

The local compact-header `web/style.css` patch predates this task and remains outside the changes. An additional complete run with the committed CSS passed **15/15** with zero normal console/page/HTTP errors (`joint-committed/results.json`; CSS SHA-256 `47c7ff26e197621e36ff447c6e8475163af237655bb6cf8c1b558c3b1619fa4a`), so the GitHub candidate does not depend on that uncommitted patch. The harness supports this verification without overwriting local files. No public claim of physical-phone, VoiceOver, researcher or supervisor acceptance is made.

Initial registration harness input was capped by browser maxlength; the corrected harness separately checks typing caps and the regex beyond that cap. One initial joint run retained an obsolete `Saved locally · revision 2` assertion; it correctly failed on the new server wording. One site harness used a nonexistent frequency scene ID; it was corrected to the existing `plotting` scene. Earlier failures are retained; no production workaround or validation weakening was introduced.

## Gate and publication boundary

UX86-01/02/03/04 now pass the fresh local joint route; UX86-05's original-vs-English presentation correction passes the current local website checks. **Local technical joint acceptance passes.** This is not proof that the private production service has been updated. Current online file verification/deployment is separate. GitHub push is authorized by the user only after this gate and is recorded with complete hashes in the evidence package after execution.

Server OS-boot registration, GitHub Pages automatic publication, Windows, physical-device/system-accessibility follow-up and independent novice/supervisor acceptance remain separate items. No system service, other server project, Render option or repository visibility was changed.

## GitHub source publication

Normal fast-forward push to `LuX-x7/QualiCraft` **main succeeded**. Application commit: `289b7cf173951669c3327fd0bf08286c32107ce7`; short-document fix: `449c00147f2ae9aa95a87762c2879561622035fb`. Remote `refs/heads/main` was read back at the exact application commit. No force push, visibility change, deployment, automatic-publication setting or server update. The extra CI command `node --test tests/*.test.mjs tools/report/*.test.mjs` also passes **366/366**. A GitHub API query returned no workflow runs for this SHA at the time checked; remote Actions success is not claimed. Publication logs and final documentation hash are stored in the external evidence package.
