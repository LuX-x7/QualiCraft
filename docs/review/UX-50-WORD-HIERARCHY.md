# UX-50 · Structured editable Word exports

2026-10-17. Baseline `dc2a4cc4d7089ccb0618d54ca3cfc4293e072121`. The owner requested clearer hierarchy in the two editable Word outputs and continued completion of the remaining product scope. This workflow changes Word presentation and its regression / acceptance checks. Only public Bologna copies are used. No statistics, plotting, source data, project schema, website assets, CI or deployment settings change. Windows remains deferred; no push or deployment.

## Result

The report no longer overrides every heading with the 11 pt body size. Shared native paragraph styles distinguish Title (24 pt), Heading 1 (17 pt), Heading 2 (13 pt), Heading 3 (11.5 pt), upright Georgia body (11 pt), italic verbatim quotations (11 pt) and secondary metadata (8.5 pt). Heading levels participate in Word navigation and can be edited through Word styles. The research design, analysis table, narrative, row interpretation, method review, quotations and technical appendix have explicit levels and spacing. Quotations remain exact saved text; styling does not infer speakers or generate interpretations.

The source notebook preserves the full transcript, highlighted ranges, original paragraph order and native editable branch guides. Source prose is italic, explicit whole-paragraph `**…**` questions are bold italic, paragraph labels separate source blocks, and the right tree remains upright. This recognises existing question markers only, without assuming who spoke unmarked material. Original markers are retained. Redundant terminal line breaks stay in the editable XML and frozen record; native paragraph spacing supplies their visible separation. No source words are hidden. Short uncoded blocks and bounded short branches stay together; arbitrarily long source and trees can continue with their references. Full IDs and SHA records are in a separate appendix. External Word edits do not write back to QT.

The final full-source example has **15 inspected pages**, 18,239 source characters, 53 associations and 52 distinct ranges. The report example has **3 inspected pages** and is an explicitly labelled software acceptance draft, not an independent research finding. Both remain native editable DOCX, with no raster replacement for source or tree. Python-docx edit / save / reopen retains frozen evidence; this is not manual Microsoft Word or Windows acceptance.

## Verification and raw evidence

Evidence: `~/qualicraft-review/ux-50/` (raw outputs, final samples, all page images and project-only browser screenshots). Every final page was rendered with the bundled `render_docx.py` and inspected. Earlier iterations and failures are retained separately in the task evidence.

- Two new structural regressions fail on the baseline styles (`raw/style-red.txt`), then pass. They check effective heading sizes rather than style names alone, distinguish exact quotations from interpretations, and retain every source character. Final tests also ensure only terminal newline characters can use hidden runs and short unannotated source rows can stay together.
- `python -m unittest discover -s tests -v` → 191 tests, OK, 3 environment skips, exit 0 (`raw/python-final.txt`). After the final pagination adjustment, the 13 transcript-export tests and 19 report-related tests pass (`raw/transcript-final-tests.txt`, `raw/report-final-tests.txt`).
- `python tools/e2e/transcript_export.py --url http://127.0.0.1:52755 --out …` → 14 / 14. Report editing checks → 11 / 11. These cover desktop, Chrome phone-touch emulation, keyboard, actual download bytes, original exports, save / reload / restore, source identity, offline HTML and stale evidence. Normal console / HTTP / outside-project errors: zero. Physical devices and OS download notifications are not newly signed off here.
- `npm run build` → 127: npm is absent. Direct bundled Node + Next build of all 108 tracked website sources succeeds in a separate directory (`raw/next-build.txt`). The first isolated build attempt used an external node_modules symlink, which Turbopack refused; the retained log is `raw/next-build-symlink-failure.txt`. A physical local copy of the existing dependencies resolves it; no source change or download was needed.
- `check_scope.py` → all 32 protected source / asset / seed / CI / deployment hashes equal baseline; all 108 website sources also equal the successful prior build (`raw/scope.json`). Workbench JS / CSS are unchanged, so the prior 187 Node tests remain historical evidence rather than a newly claimed run.
- Frozen JSON embedded in each final DOCX is equal to the input record (`raw/final-frozen-equality.json`). Original full-text / range and editable-tree regressions pass. Final render and edit proof record the output hashes independently.

One initial transcript browser assertion falsely compared service-wide latest-backup status while a second isolated project was saved concurrently. The fix compares the current project's snapshot items and still requires the complete project / audit / reading state to remain equal. The original failure is retained; product backup behavior is untouched.

## Remaining work, in order

1. **Persistent researcher-chosen roles:** explicitly save Theme / Category / Code per node; retain unset legacy labels, exact parent IDs, JSON recovery and export consistency. Roles must not change existing count / figure definitions or be inferred from depth.
2. **Report figure assets:** bind chosen existing figure / CSV / parameters / code to a frozen report version, with editable captions, stale checks and reproducible exports. Existing figures and downloads stay available.
3. **Separate Comparative QCA:** implement and independently verify calibration, truth tables, conservative configurations and actual outputs, following [UX-48](UX-48-QCA-IMPLEMENTATION-BRIEF.md). A method option or count table is not completion.
4. **Final integration and acceptance:** broader batch / interruption cases beyond UX-49, researcher interpretation and current physical-device / supervisor checks; review the site capability statements against actual shipped functions. GitHub stays local by the owner's latest choice; no push retry until instructed.

Acceptance is milestone-based; this styling workflow does not close the full final-product standard. A firm final date for the expanded QCA / report-asset scope has not been established. Do not reuse the earlier expired Friday target as a guarantee.
