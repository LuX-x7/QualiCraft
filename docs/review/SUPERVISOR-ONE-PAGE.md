# QT · Supervisor review — 16 October 2026

**UX-33: joint review of the UX-32B product.** The main demonstration completes, but acceptance remains open: 44 of 46 browser checks pass, with two mobile position-memory findings. This round changes documentation only. Windows is deferred and unverified; no push or deployment.

## Demonstration order · about 12–15 minutes

1. **Website → import:** inspect five modules, distinct Coding/Analysis illustrations and the permanent passage–code–theme map. Open an editable Bologna copy, import interview02.txt and inspect the saved document.
2. **Coding → reading:** select one passage and assign two existing codes. Check Theme › Code ownership, then manually save Read/Revisit and Undo. Scrolling and coding do not mark reading.
3. **Overview → source:** compare whole-document reading and coding tracks. Two codes on one range remain two codings/one source. Inspect exact quotations, IDs and paths; filter by a theme and search; explicitly reveal hidden source text before jumping. Demonstrate Resume, document switching and reload. See the mobile exceptions below before demonstrating Keep.
4. **Relationship map → figures:** select a saved coding, open its exact source and return with selection and filter context preserved. Inspect all five figures and the phone original-size viewer.
5. **Report → export/recover:** select exact CSV values and locate table rows; move the original-heatmap lens. Download JSON, coding CSV, matrix and methods; restore JSON as a new project. The report is a fixed 19-document/874-coding example. The edited review copy has 20 documents/876 codings; these are separate snapshots.

## Findings and discussion

- **UX33-02 / P2:** on a 390px touch viewport, jump to paragraph 4, then tap Keep. Bringing its control into view can change the tracked position to paragraph 1, which is saved instead. Independently reproduced; desktop click and phone keyboard controls pass. Prioritise this before mobile sign-off.
- **UX33-01 / P3:** keyboard focus on the phone’s upper search field scrolls the page and replaces the pre-search anchor before typing. Resume subsequently returns to paragraph 1. Decide how entering search should preserve the previous reading context.

Neither finding loses source text, codings or manual project marks. Discuss the compact controls and visual density, and whether manual whole-line marks and the preview/Resume distinction fit the research workflow. Marks do not establish comprehension or completion; visual coding unions do not add statistics.

## Evidence and remaining work

This round: 163 Python tests (3 skipped), 139 Node tests and syntax pass; 594 report rows, 25 figure-bundle members, four real downloads and v5 restoration checked. Normal console/HTTP errors: 0. Product files and report assets are unchanged. No new production build; the passing UX-32B build is historical evidence.

Fix/retest the two findings, then review remaining W03 visuals and obtain owner/supervisor acceptance. Current-feature physical-device/VoiceOver checks and release gates remain open. JSON v5 carries manual marks and requires current QT; browser positions are separate. Marks save immediately and enter the next research-edit snapshot. UX-29 website clips predate the reading controls; use live views/current screenshots.

Evidence: UX-33-JOINT-ACCEPTANCE.md, screenshots/ux33-*, raw/ux-33. Local [Website](http://127.0.0.1:4445/) · [Report](http://127.0.0.1:4445/report) · [review workbench](http://127.0.0.1:4466/w?lang=en). Loopback links require this computer.
