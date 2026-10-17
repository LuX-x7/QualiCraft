# QT · Supervisor review — 17 October 2026

**UX-34 closes UX33-02 only.** Phone touch Keep now saves the paragraph reached through source navigation. The upper-search position issue, UX33-01, remains open by scope. Windows is deferred and unverified; no push or deployment.

## Demonstration order · about 12–15 minutes

1. **Website → import:** inspect five modules, distinct Coding/Analysis illustrations and the permanent passage–code–theme map. Open an editable Bologna copy, import interview02.txt and inspect the saved document.
2. **Coding → reading:** assign two existing codes to one passage. Inspect Theme › Code ownership, then manually save Read/Revisit and Undo. Scrolling and coding do not mark reading.
3. **Overview → source:** compare whole-document reading/coding tracks and exact quotations, IDs and paths. Use a theme filter and explicitly reveal hidden source text before jumping. Jump to paragraph 4, tap Keep, reload and switch documents: its saved anchor remains 872. A real reading swipe can advance the target; bringing the Keep control into view cannot replace it with paragraph 1. Preview and Resume remain separate.
4. **Relationship map → figures:** locate a saved coding’s exact source and return with selection/filter context. Inspect all five figures and the phone original-size viewer.
5. **Report → export/recover:** select CSV values and matching rows, move the original-heatmap lens, download JSON/CSV/matrix/methods and restore JSON as a new project. The report is a fixed 19-document/874-coding example, separate from edits in the review copy.

## Findings and discussion

**UX33-02 is closed in local Chrome acceptance.** Long/short paragraphs, 320px and 390px touch layouts, a short screen, keyboard and desktop pass. Both whole-paragraph and exact coding-source jumps are covered. Saved position, refresh and document switching agree. No source text, coding or project read mark changes during Keep.

**UX33-01 / P3 remains:** keyboard focus on the upper phone search field moves the viewport and replaces the previous reading anchor before typing. Resume can return to paragraph 1. This was explicitly re-observed, not fixed or accepted as final behaviour. Discuss the intended pre-search position semantics, compact controls and remaining W03 visual density.

## Evidence and remaining work

This round: 144 Node tests (5 new), 163 Python tests (3 skipped), syntax and direct Next production build pass. npm is unavailable (exit 127 retained). Chrome: 12 dedicated checks, including one observation that UX33-01 stays open; 11 overview regressions; 2 read-only/storage cases. Normal console/HTTP errors: 0. All 20 registered fronts serve current JS/CSS. Statistics, plotting, project format v5 and report assets are unchanged.

Resolve UX33-01 separately, review remaining W03 visuals, and obtain owner/supervisor acceptance. Current-feature physical-phone/VoiceOver and release gates remain open; browser simulation is not physical-device verification. JSON carries manual marks; browser positions remain separate. UX-29 clips predate reading controls, so show these live/current screenshots.

Evidence: UX-34-KEEP-POSITION.md, screenshots/ux34-* and raw/ux-34. Local [Website](http://127.0.0.1:4445/) · [Report](http://127.0.0.1:4445/report) · [Keep QA](http://127.0.0.1:4467/w?lang=en). Loopback links require this computer.
