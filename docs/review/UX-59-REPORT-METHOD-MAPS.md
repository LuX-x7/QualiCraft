# UX59 · Saved method names and process maps

18 October 2026. **Closes UX55-04**, against `335f23881a2809e091c07b75d707fddd59b95926`. This round explicitly authorises report/editor/website/export presentation changes. Public Bologna temporary copies only; statistics, plotting and QCA mathematics are unchanged. Windows remains deferred and unverified. Local commit only; no push, deployment or deployment-setting change.

## Delivered behaviour

Research report remains one report family. Its selected, saved method is shown in **Method and decisions**, even when the authored approach, unit and notes are blank; blank fields explicitly say “Not documented yet.” The three full names are Thematic Analysis, Qualitative Content Analysis and Qualitative Comparative Analysis. The latter also states binary crisp-set, conservative, no logical remainders.

Each new deliberate save freezes an original **Method map M1**, with six distinct readable stages, sequential connections, explicit revisit paths, methodological qualifications and primary-source links. It is a procedure orientation, not an assertion that stages are complete. TA subtype is not inferred; Content Analysis is a complete method, with condensation/themes dependent on design. Comparative shows the actual frozen run ID, source/run hashes, outcome direction and cutoffs. No reading mark, count or tree is treated as evidence of method completion.

The editor distinguishes the next-save map from the saved method/version. A dirty method selection cannot relabel the saved preview or be downloaded. Focus remains on the method selector after a change; tabs, source disclosure and downloads work with keyboard. Phone nodes retain readable text and full arrows, with native scrolling. The new maps are static under both motion preferences.

HTML, native editable Word, report JSON, ZIP and full project JSON preserve the same saved map. Website method cards progressively disclose maps generated from the canonical source; the worked report explains how to obtain a method-specific report without declaring its existing counts to be a completed analysis. Existing sketches, figures, videos, count tables and downloads remain.

## Compatibility and the discovered citation case

`qualicraft/method_maps.json` is the catalogue; `tools/site/build_method_maps.py` materialises the static website copy, checked for exact semantic equality. A new optional `method_map` in each saved entry has its own v1 schema and participates in the existing integrity hash. Project JSON remains v5 and report state remains format 1; there is no database migration. Validation accepts historical entries without the field. This is a new-reader/old-record compatibility guarantee, not a claim that older application binaries accept newly extended entries.

Opening/exporting a legacy entry does not insert a map. It displays its saved full method and an explicit absent-map notice. Restore copies that original absence, writing and bindings into a new version. An explicit ordinary save adds the current map, while old entries and their hashes remain intact. A saved map does not follow future catalogue edits.

The browser run found a pre-existing switch case: a QCA narrative could cite automatically bound evidence but have no analysis-table row; switching to TA/Content retained the text yet failed to save. Saves now retain **only previously selected, still-cited evidence** from the saved report, using the established source/refresh rules. Typing a new unselected or fabricated evidence ID still fails atomically. No source, coding or calibration is changed. The added regression fails on the baseline and passes after the fix.

Word uses editable native paragraphs, shading, border strokes and text arrows; no floating objects or rasterised method text. Editing Word remains external and does not change QT or its frozen metadata.

## Commands and evidence

Evidence root: `~/qualicraft-review/ux-59/`. `COMMANDS.json` records commands, working directories, exit codes and raw-log paths. Full commit and final scope are in `COMMIT.txt` / `raw/final-git.json` after commit. Screenshots and recordings are outside Git.

| Check | Command / raw output | Result |
| --- | --- | --- |
| Red control | `raw/red-confirmed.command.json` / `.txt`; baseline modules from full hash above, current four regression cases | exit 1; 4 tests fail, including empty method block/map and saved citation switch |
| Targeted methods | `python -m unittest tests.test_report_methods -v`; `raw/method-complete.*` | 10 pass, exit 0 |
| Full Python | `python -m unittest discover -s tests -v`; `raw/python-complete.*` | 280 tests, 3 existing environment skips, exit 0 |
| Full Node | `node --test tests/*.test.mjs tools/report/*.test.mjs`; `raw/node-complete.*` | 231 pass, exit 0 |
| JS syntax | `node --check web/app.js` and `web/report-editor.js`; `raw/*syntax-final.*` | both exit 0 |
| Production build | isolated physical website copy, `node node_modules/next/dist/bin/next build`; `raw/build.*` | exit 0; all 110 build sources match the final website sources |
| Requested npm command | `npm run build`; `raw/npm-build.*` | exit 127: npm unavailable; direct Next build above succeeds |
| Project-only Chrome | `tools/e2e/report_methods.py --seed …public-seed.project.json --site-build … --out …`; `raw/browser-third.*`, `ui/results.json` | 28 desktop/touch-emulated-phone/keyboard/hover/download/restore/site checks pass; console/HTTP/outside requests all 0 |
| Word render | bundled documents `render_docx.py`, bundled LibreOffice only; `raw/render-{content,ta,comparative}.*` | 15 + 15 + 18 = 48 pages rendered |
| Word layout review | `word/visual-index.json`, `word/geometry.json`, `word/footers.png` | every page accounted for: all 26 distinct unscaled body views visually checked; identical page bodies matched by pixel hash; all 48 footers checked. All text in bounds; complete M1 on page 2 in each sample |
| Word editing | `raw/word-edit.*`, `raw/render-edited.*`, `word/edit-roundtrip.json`, `word/edit-render-comparison.json` | native step text edited/save/reopened; all five native arrows, frozen metadata and images retained. Edited page 2 checked; other 14 rendered pages byte-identical |
| Scope | `raw/scope.*` / `raw/scope.json` | 127 protected tracked product/data/deploy paths unchanged; all 25 members of five frozen figure bundles equal on desktop and phone; QCA/source records equal |
| Website copy scan | exact AGENTS grep, `raw/forbidden-copy.*` | no matches, exit 1 |

Early outputs remain: the initial red cases, a sandbox run unable to bind loopback, a macOS native-select test assumption, the genuine citation save rejection, an ineffective baseline-import control subsequently corrected, unavailable optional PDF parser and wrong-directory syntax commands. They are not counted as passing runs. The final parser uses the available bundled pdfplumber. Existing `-t .` collection failure is retained in prior evidence and has not been “fixed” by changing the test entry point.

Current implementation evidence is technical, not researcher method approval. The TA/Content switch samples deliberately retain the original QCA technical fixture's writing to prove no loss; they are not newly claimed substantive TA/Content studies. Original six Word/ZIP samples remain unchanged. The new samples are an additional method-presentation set.

## Review entry and what remains

Start at **http://127.0.0.1:52761/** → **http://127.0.0.1:52761/w/?lang=en** → **Bologna · method report review**. This is a new isolated editable database, 19 public documents / 317 codes / 874 codings, with legacy plus three saved method versions. Existing projects/services were not reset. Hosted sites may be older.

1. UX55-01 duplicate choices, UX55-02 committed snapshots, UX55-03 multi-file queue and UX55-04 method presentation are now technically closed.
2. Next: final joint acceptance, import/batch → Coding → reading marks/ranges/filter/jump/Resume → relationships → five figures → report readouts/methods → notebook/report/data/code export → JSON/recovery. Record any new remaining issues before final acceptance.
3. Obtain current physical-device/accessibility, researcher and supervisor acceptance. Prior manual reports are retained but not upgraded to new-version passes. Windows stays deferred. No push/deployment/release approval is implied.
