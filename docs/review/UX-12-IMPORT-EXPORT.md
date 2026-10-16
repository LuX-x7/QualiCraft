# UX-12 · Workbench import and export results

16 October 2026. Baseline `5d0cbc7f5dfcfc99d54fd8e2060b6df3884a59e1`. The user explicitly authorized workbench import/export UI changes for this round, overriding the earlier website-only restriction for this workflow. Analysis, coding definitions, backend import/export formats and plotting paths remain unchanged. No push or deployment; Windows deferred and unverified.

## What changed

**Import:** two explicit choices, File or Paste text. The inactive input is hidden and disabled, so a previously selected file cannot silently replace pasted text. Format explanations sit in native details. The default English dialog has 43 visible words versus 68 at baseline (about 37% fewer). A selected file displays its real name and byte size; TXT shows up to 800 existing Unicode characters, while DOCX accurately states that its parsed text appears after import. DOCX still uses the original server parser.

After successful import, the actual saved document opens in Coding, with a persistent “Imported · saved locally” receipt, document title, existing character/segment metadata and original text. Obstructing reading filters clear and keyboard focus moves to the title. The coding-table importer also opens the first actual document of the newly created project. These are navigation/presentation changes, not an analysis operation. The document request uses the stable `documents` endpoint in both languages instead of a translated UI label.

**Export:** four compact file cards retain the existing one-click JSON / codings CSV / matrix CSV / methods Markdown downloads and original filenames. The result panel displays the actual filename and Blob byte size after preparation, plus an optional first-eight-line excerpt (maximum 1,000 Unicode characters) from that same response. Browser text decoding removes an initial BOM and HTML normalizes line endings in the displayed excerpt; the downloaded bytes are unchanged. Source text is escaped before display.

The receipt says **“Sent to browser”**, with a reminder to check browser downloads for completion. It does not claim the operating system has saved a file. Failure clears the preparing/success result, displays the error and allows retry. Import/export dialog cancellation and Escape return focus to their original trigger when it still exists; successful import instead focuses the new document. No extra export formats, statistics or figure actions were added.

## Acceptance and raw evidence

Evidence: `~/qualicraft-review/ux-12/`. Use `accepted/` screenshots/results; `before/`, `final/` and `final-second/` retain the baseline and intermediate attempts. Final isolated service: `http://127.0.0.1:8844/w/`; normal user entry remains `http://127.0.0.1:4445/w?lang=en`. The 4445 proxy was checked in the existing project Chrome tab, with no access to other windows. Existing site services were restarted after the production build.

| Check / command | Actual outcome |
| --- | --- |
| Baseline UI regression | Three targeted failures: no explicit File/Paste choice, no persistent import receipt/focus, no named export result/preview. Original UI served verbatim from baseline Git into an isolated local service. `raw/browser-before.txt`, `raw/baseline-command.json`, `before/results.json`. |
| `python tools/e2e/import_export.py --url http://127.0.0.1:8844/w --out /tmp/qualicraft-ux12/accepted` | **9 checks pass, exit 0**. Fresh controlled Chrome, project loopback origin only. Actual TXT, paste and DOCX import; four complete downloads; failure/retry; desktop, phone touch context and keyboard; data integrity. `raw/browser-final.txt`, `accepted/results.json`. |
| Actual downloads | All four saved files byte-identical to independent current export API responses. JSON 1,175,793 B; codings CSV 463,850 B; matrix CSV 26,158 B; methods Markdown 62,780 B at that test state (three new uncoded documents). SHA-256 values in browser results. Later test-state files can differ because imports update project documents/audit. |
| Desktop / phone | Desktop 1440 × 900 and phone touch context 390 × 844. Phone dialog width 356 px, x=17; export scroll/client width both 354 px; page horizontal overflow 0; native touch import and real download work; export targets at least 44 px high. This is browser emulation, not physical-device certification. |
| Keyboard | Enter / Space switch modes and submit; inactive file is ignored in Paste mode; modal does not focus background controls; Escape closes and returns to Export. Native browser chrome may briefly own focus in a Tab cycle; that is not reported as a background-page focus leak. |
| Console / failures | Normal acceptance and actual 4445 project-tab warnings/errors empty. One deliberately injected HTTP 503 is separately recorded in `expected_error_response_console`; no success receipt appears for it and retry downloads successfully. |
| Supplementary import checks | English/Chinese import uses the stable endpoint; a one-row OpenQDA-format fixture derived only from an existing Bologna annotation opens the new project and exact quote. Both pass, console empty. `raw/browser-extra-final.txt`, `accepted/extra-results.json`. |
| `python -m unittest discover -s tests -v` | 148 tests, 3 skipped, exit 0. `raw/unittest.txt`. No test-entry changes. |
| `node --test tests/*.test.mjs tools/report/*.test.mjs` | 74 pass, exit 0. Existing Node module-type warnings retained. `raw/node-all.txt`. |
| `node --check web/app.js` | Exit 0. `raw/syntax.txt`. |
| Existing `python tools/e2e/dialogs.py` | 390 px Import/Create/Export all 356 px wide and fit; intentionally forced 500 px overflow is detected. Snapshots restore entry remains desktop only. This secondary geometry check uses an empty technical project; all content import/download acceptance uses Bologna. `raw/dialogs.txt`. |
| Website build | `npm run build` cannot run because npm is unavailable (exit 127, retained). The same existing build target, bundled `node node_modules/next/dist/bin/next build`, passes, exit 0. No install/dependency change. `raw/npm-build.txt`, `raw/build.txt`. |
| Website copy scan | Required full grep has no matches, exit 1. `raw/copy-scan.txt`. |
| Scope / source | Backend `qualicraft/`, all website source/assets/manifest, demo-data, dependencies and deployment configuration have empty diff. Original DB SHA-256 remains `b8b44b814f2fa6286decf877364665ad8276977c08913d02d7b8a90db62a755d`. Existing documents, 317 codes, 874 annotations, suggestions and blocks are unchanged in the final isolated-copy check; only four uncoded test documents were added. `raw/scope.json`, `accepted/results.json`. |

The committed regression script reads only the repository's Bologna CC0 example and targets a separately prepared writable temporary copy. It never attaches to another Chrome profile. The final accepted copy starts with the original 19 documents; earlier trials have their own preserved output. No model key is loaded. Source database and reference figure assets are not overwritten.

Retained unsuccessful attempts: an initial baseline harness wait conflicted with CSP; first DOCX/CSV expectations incorrectly stripped empty lines or retained a hidden BOM/CRLF in DOM text; keyboard checking initially rejected browser-chrome focus as if it were page focus. The import/export focus-return issue found during that run was fixed. The corrected full script passes. Supplementary coding-table testing waits for the new project name/dialog closure because its first document can share the old document's name. Original failures remain in raw evidence, not counted as passes.

## Completion boundary and next step

UX-12 implementation and local technical acceptance are complete; owner visual acceptance and actual QT/device trial remain open. Windows stays deferred. The current website demonstrations and recordings are unchanged; recordings still show the earlier interface and are historical walkthroughs, not proof of this exact UI version. Next: review the integrated local website/report/workbench candidate with the supervisor, record visual/device feedback, and make any further changes in their own workflow. No remote action is authorized by this round.
