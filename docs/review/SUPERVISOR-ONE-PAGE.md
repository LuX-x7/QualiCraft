# QT | Supervisor review

16 October 2026 · Running product UX-30 · Design note UX-31 · 10–15 minutes

**Status:** UX17-01–05 have closure evidence. This round reviews and proposes reading marks/range overview; it implements no feature. The workbench remains format 4 with browser-only position memory. Current-QT recordings and original diagrams/figures remain. Broader visual/device acceptance and release gates are open. Bologna CC0 only. Windows deferred and unverified; no push/deployment.

## Demonstration order

1. **Website (2 min):** scroll the five steps and circular network; hover/focus saved evidence. Optional current-QT recordings and authentic stills remain under “Workbench recording & steps”.
2. **Coding (3 min):** explicitly open an editable Bologna copy. Inspect Themes & codes ancestry, code a source passage, locate it through the relationship map and return. Switch documents and resume. **Resume remembers position; it does not mark reading.** Current interview02 has 31 paragraphs, 53 codings and 52 distinct source ranges.
3. **Figures/report/export (4 min):** inspect the five figures, phone original-size viewer, exact CSV/table selection and heatmap lens; inspect actual JSON/CSV/matrix/methods downloads. The report is a fixed 19-document/874-coding example, not live edits. “Sent to browser” alone is not OS completion.
4. **Proposed interface (3 min):** open UX-31-READING-MOCKUP.html and compare Compact (default) with Overview expanded. These are labelled design sketches, not working reading controls. Read/Revisit examples are hypothetical; Bologna source and coding ranges are real.

## Recommended design and decisions

Keep three meanings independent: current browser position; manually Unmarked/Read/Revisit paragraphs; and saved coding ranges. Scrolling, coding or AI suggestions never mark Read. Unmarked does not mean unread. A mark timestamp records a button action, not reading duration, comprehension or familiarisation before coding.

The compact dock retains document/paragraph, read action and existing code path. An optional non-sticky overview has two aligned tracks—manual marks and saved coding—with an accessible paragraph/range list. No completion percentage or new analysis. Two codes on the same span remain two codings/one source range.

Recommend project-level marks in future JSON format 5, independent of browser memory and memos. JSON/restore carries marks; current coding/matrix CSVs and figures keep their meanings. Old applications reject format 5, so neutral migration and a verified format 4 recovery point are required. These are proposed rules; current projects remain format 4.

Reading-only changes should commit immediately to SQLite but enter the next ordinary research snapshot, avoiding 31 clicks displacing the 30 retained research recovery points. Export JSON preserves current marks now; this snapshot lag must be stated clearly. Source mismatch, conflicts and save failures must never look like success.

- Are the three meanings and compact/expanded layouts clear?
- Accept project-level portable marks and format 5 compatibility cost, or revise before implementation?
- Accept the explicit snapshot lag, or require a separate backup policy before implementation?

## Evidence and remaining work

This review uses unchanged 19/317/874 Bologna copies: 31 DOM anchors match the source; no mutating requests or normal console/HTTP errors at desktop/390px. Static sketches render without overflow. All 251 non-document files and ten manifest assets match baseline. No functional test/build rerun; UX-30’s 155 Python (3 skipped), 122 Node and direct production build remain prior evidence.

T03 implementation and all 18 proposed acceptance gates remain open. Next suggested slice: reliable marks/storage/JSON/snapshot rules; then range overview/navigation. Remaining W03, owner/physical-device/VoiceOver/system-motion/download and release gates remain open. Windows stays deferred.

[Website](http://127.0.0.1:4445/) · [Report](http://127.0.0.1:4445/report) · [Workbench](http://127.0.0.1:4445/w?lang=en). Review UX-31-READING-STATE-DESIGN.md and package COMMITS.md. Earlier candidates/PDFs are historical.
