# QT | Supervisor review

16 October 2026 · Local candidate UX-28 · 10–15 minutes

**Status:** the website, report and workbench now pass joint acceptance after visual unification: **8 ordered stages and 37 browser checks**. No new P1/P2 blocker was found in the exercised paths. Two known P3 issues remain: older embedded recordings and a misleading startup health probe. This round changes review documents only. Bologna CC0 only; overall visual/device acceptance and release gates remain open. Windows deferred and unverified. No push or deployment.

## Demonstration order

1. **Website (2 min):** scroll through Import, Coding, Analysis and the circular network. The left window remains fixed. Hover/focus nodes and inspect saved quotations. Original diagrams and all five figures remain.
2. **Import → code → evidence (4 min):** open the workbench and explicitly choose a project or create an editable Bologna copy. Import a Bologna document, select a passage and apply two existing codes. Inspect the Themes & codes tree and use the relationship map to locate the exact quotation, then return. On phone, switch documents directly; refresh to resume. The brief guide can be skipped/reopened. Remembered positions are not read marks.
3. **Five figures → report (4 min):** inspect frequency, coverage, co-occurrence, hierarchy and accumulation. On phone, use Enlarge figure, original size/Fit and SVG download. Open `/report`, select CSV values, locate table rows and move the heatmap lens. **The report is a fixed 19-document/874-coding example, not a live report of workbench edits.** The QA copy contains 20 documents/876 codings; its two new assignments are test actions, not research findings.
4. **Export (2 min):** download JSON, coding CSV, matrix CSV and methods Markdown. Inspect the actual file and receipt; original records and QA assignments remain. “Sent to browser” does not confirm OS download completion.

## Evidence and discussion

The 37 checks cover desktop, simulated phone touch, keyboard/focus, hover, native scrolling, breakpoints, reduced motion and static report fallback. All 594 report table rows, 15 sampled selections and 594 website readouts match existing CSV; five complete bundles and four project exports were downloaded. Phone checks open all 20 documents and all five original-size viewers. Actual hierarchy CSV geometry retains 259 labels/counts at 9/10 pt without text overlap/clipping. QT identity/controls match, body contrast is 14.84:1, and normal console/HTTP errors are empty. All 123 protected product/data files and ten manifest assets remain unchanged; the original Bologna seed/audit is intact.

No full unit/build rerun: unchanged products retain UX-27’s baseline of 155 Python tests (3 skipped), 108 Node tests and a successful direct Next production build; npm was unavailable.

- Are the visual hierarchy, source ancestry, empty/continued/example states and reading controls clear enough for independent use?
- Next small fixes: update or version-label old recordings (UX17-04); align the startup probe with the real healthy endpoint (UX17-05). Neither breaks the normal demonstrated path.
- Still open: explicit read marks/range overview, remaining W03 visual refinement, fresh owner/physical-device/VoiceOver/OS-motion/download sign-off and release gates. Counts do not establish importance, agreement or saturation. Windows stays deferred.

[Website](http://127.0.0.1:4445/) · [Report](http://127.0.0.1:4445/report) · [Workbench](http://127.0.0.1:4445/w?lang=en). Evidence: UX-28-JOINT-ACCEPTANCE.md and package COMMITS.md. Earlier PDFs/candidates are historical; this Markdown brief is current.
