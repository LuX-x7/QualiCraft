# UX-47 · Saved research report writing

2026-10-17. Baseline `67ca022045deb5d011058f6e119cc4b64e51a3dc`. The owner asked to continue the final-product plan. This implements the previously missing Analysis Table / Narrative Analysis editor inside Export, alongside the UX-46 native editable coded-source Word tree. Only disposable Bologna projects were used. No private interview or manual-answer file was opened in this workflow. No push or deployment; Windows remains deferred and unverified.

## Available now

Open [the local review workbench](http://127.0.0.1:52755/w/?lang=en), choose **Bologna · supervisor report sample**, then **Export → Write / edit research report**. These URLs require this computer and its running local services. [Website](http://127.0.0.1:52755/) and [original report](http://127.0.0.1:52755/report) use the same production build and proxy.

- Choose the full name Thematic Analysis or Qualitative Content Analysis. Each has its own manual review checklist. Changing method keeps writing and rows, resets confirmations and is recorded on Save. These checks record researcher decisions, not automatic method certification. Comparative QCA remains a separate unavailable workflow.
- Write the research question, case / analysis unit, analytic approach, method decisions, reflexivity, quality notes, narrative, counterexamples, limitations and disclosure. There is no generated interpretation or model request.
- Add and reorder Analysis Table rows; edit their Theme / Category labels and interpretation; select saved codes and exact saved quotations. Starting labels from the saved hierarchy require an explicit choice. Report labels do not rename the saved codebook or establish persistent codebook roles. Rows paginate ten per view; evidence lists paginate twenty.
- Insert a checked quotation reference into the narrative. The server binds it to a real saved annotation, document SHA and Unicode range. It rejects fabricated citations and evidence from a different selected code. Read-only source quotations cannot be rewritten by editing report prose. Output shows short E1-style references; frozen records retain full IDs. Locate in source checks live identity and range before opening the original coding.
- Explicit **Save version**, compare and restore. Restore creates a new version, retaining the former current version. The first and nine most recent historical versions are kept, plus the current version. Project JSON and project-edit snapshots include them. Closing unsaved writing needs an explicit discard; save / restore lock controls while pending; concurrent stale revisions fail without mutation.
- Coding changes mark the report stale. Further writing keeps the saved frozen quotations. **Refresh evidence and save** deliberately binds current evidence; missing references need explicit resolution. Reading-only edits do not falsely mark the coding evidence stale.
- Saved preview and downloads: self-contained HTML, native editable Word and the frozen report JSON. Project JSON is the supported route for restoring report versions; a standalone report JSON is a record, not a separate project import format. External Word edits stay in Word. Existing four exports and coded-source HTML / Word remain.
- The website Export guide and method availability text match the workbench. The five modules, all original diagrams, CSV tables, downloads, clips and static replacements remain.

## Persistence and limits

An optional `research_report` extension uses project schema v5; existing projects are not migrated or given a report automatically. Saved entries have an integrity fingerprint, evidence fingerprint and immutable frozen bindings. Unsupported / corrupted report states are rejected during project restoration. Authentication, public-demo write refusal and existing request limits apply.

Limits are explicit: 2,000 table rows, 20 codes / 100 evidence links per row, 200 unique selected quotations, 1.5 MB per report version, and the existing 19 MB project limit. Capacity failure is checked before audit, snapshot or report mutation. The limits are guards, not a claim that a 100-interview project has been benchmarked. One current report per project is supported. Dedicated transcript PDF, embedding figure assets inside the research report, persistent semantic codebook roles and broader method / capacity work remain separate tasks.

## Verification

Raw outputs and screenshots: `~/qualicraft-review/ux-47/`. The original seed is still 19 documents / 317 codes / 874 codings. A report test changes one code name only in its disposable copy to exercise stale-evidence handling.

| Command / check | Result | Evidence |
| --- | --- | --- |
| `python -m unittest discover -s tests -p test_reporting.py -v` | 14 tests, OK; actual HTTP auth, conflict, read-only save / restore, capacity and recovery | `raw/report-final.txt` |
| `python -m unittest discover -s tests -v` | 189 tests, OK, 3 environment skips | `raw/python-final.txt` |
| `node --test tests/*.test.mjs tools/report/*.test.mjs` | 181 / 181 | `raw/node-final.txt` |
| `node --check web/app.js` and `web/report-editor.js` | Exit 0 | syntax executed before `raw/node-final.txt` |
| `npm run build` | npm unavailable, exit 127; recorded rather than hidden | `raw/npm-build.txt` |
| Isolated tracked-source `node node_modules/next/dist/bin/next build` | Exit 0; physical existing dependencies; no installation or ignored configuration | `raw/build-final.txt` |
| Fresh production startup / proxy token identity | Verified, 52755 → 51558 | `raw/start-site.txt` |
| `tools/e2e/research_report.py --url http://127.0.0.1:52755 --out …` | 11 / 11: method switching, editing, Ctrl-S / in-flight lock, restore, stale / refresh, downloads, phone touch, keyboard, source jump, late preview race, JSON recovery | `raw/browser-final.txt`, `browser-final/results.json` |
| `tools/e2e/transcript_export.py --url … --out …` | 14 / 14; full source, all 874 links, native Word, offline HTML and four legacy downloads | `raw/transcript.txt`, `transcript/results.json` |
| `tools/site/story_acceptance.py --url … --out …` | 10 / 10; original five figures / readouts and desktop / phone report | `raw/story.txt`, `story/results.json` |
| `tools/site/w03_acceptance.py --url … --out …` | 7 / 7; graph, hover / keyboard, engineering plates, preserved assets | `raw/w03.txt`, `w03/results.json` |
| `tools/e2e/review_finish.py --url … --out …` | 7 / 7; desktop / phone entry, reduced-motion simulation, notebook, website availability | `raw/review-finish.txt`, `review-finish/results.json` |
| Word renderer on the actual report download | 2 pages, both visually checked; native table edit / save / reopen succeeds | `raw/word-render.txt`, `word-final/`, `raw/native-word-edit.json` |
| Protected paths vs UX-45R | 32 equal: statistics, plotting, seed, original report model / 10 assets, 10 media, CI and deployment configuration | `raw/scope.json` |
| Website prohibited-copy sweep | Exit 1, zero matches | `raw/forbidden-copy.txt` |

All 49 production-proxy browser checks pass; normal console / HTTP / outside-project request errors are zero. Screenshots include desktop table / version comparison, phone writing / preview, the actual source jump and the two-page Word report. The Word narrative is explicitly an assistant-entered technical acceptance example, not a new research finding. Native Microsoft Word, VoiceOver and OS download completion still require human checks; Chrome mobile / reduced-motion emulation cannot close them.

## Remaining final-product work

1. Persistent semantic Theme / Category / Code roles, separate from export display presets and report-only labels.
2. Actual Comparative QCA: explicit cases, conditions / outcome, calibration, truth tables, conservative configuration analysis and independent known-answer / reproduction tests. Primary-source checks are recorded in `UX-48-QCA-IMPLEMENTATION-BRIEF.md`; this workflow does not claim that engine is implemented.
3. Defined 1 / 2 / 100-document input, capacity, interruption / recovery and UI checks. Current input supports TXT / DOCX / paste; arbitrary PDF / scanned input is not promised.
4. Current physical-device / VoiceOver / system-motion / download feedback, researcher interpretation and supervisor acceptance. GitHub remains local-only by the owner's latest decision after the earlier workflow-permission rejection.

This closes the product's saved table / narrative editor gap, not the complete final acceptance standard. Existing statistics and plotting definitions / outputs are unchanged.

## UX-47A source identity follow-up

Final review found that a frozen report quotation could still jump to a live annotation after that annotation was reassigned to another code or document with the same text / range. The jump now checks both document ID and code ID before closing the report or changing filters. Six meaningful Node regressions cover reassignment, document movement, quotation / fingerprint / range changes and deletion. Before the fix, two failed and four passed; after it all six pass and the full Node suite is 187 / 187. Raw outputs: `raw/report-evidence-red.txt`, `raw/node-evidence-final.txt`. The report Chrome workflow was rerun in `browser-evidence/`; normal editing and source jumps remain valid. Python, report output formats, website source and the previously successful production build are unchanged by this narrow browser guard.

Clean reviewer sample: `ux-47/samples/research-report.docx` and `word-sample/` are the final 2-page sample, with the unmodified original Bologna codebook and an explicitly authored technical narrative. Browser regression downloads remain separate historical test versions. See `raw/curated-sample.json`.
