# QT · Supervisor review — 16 October 2026

**Local candidate: UX-32A.** Manual paragraph marks now work in Coding and travel with JSON format 5. Windows remains deferred and unverified. Nothing has been pushed or deployed.

## Demonstration order · about 12 minutes

1. **Website → report (2 min):** inspect the five modules, permanent passage–code–theme network, exact CSV/table readings and movable heatmap lens. Report data is the fixed Bologna example, not live workbench edits.
2. **Import → Coding (4 min):** use an editable Bologna copy. Show the imported document, calm highlights and Theme › Code hierarchy. Select a paragraph and demonstrate Unmarked → Read → Revisit, Clear (Unmarked) and Undo. Scrolling and coding do not mark reading. Resume remembers browser position separately.
3. **Save → recover (2 min):** refresh or switch documents to confirm saved project marks. Download JSON and restore it as a new project; marks survive. A stale tab must review the latest state after a conflict.
4. **Relationships → figures → export (4 min):** expand a source node, return to its quotation, inspect the five figures and phone original-size view, then download JSON/CSV/matrix/methods. Confirm the actual file download. Website clips are the prior UX-29 demonstration; current reading controls are shown live and in UX-32A screenshots.

## Important rules and discussion

- Marks are manual, shared project workflow metadata. Unmarked does not mean unread; timestamps do not establish reading duration, comprehension or familiarisation before coding.
- JSON is now **format 5**. Older QT versions cannot open it. Loading format 4 is neutral and read-only; its first write requires a verified recovery snapshot of the original stored format 4 project.
- Marks save immediately to SQLite. Reading-only actions do not rotate research-edit snapshots; the next research edit includes them. **Export JSON to preserve the current state now.** Restoring an older snapshot restores only that snapshot’s marks.
- Coding CSV, matrix, statistics, figures and source text keep their meanings. Methods adds only a separate workflow caveat and truthful audit information.

Discuss whether manual whole-paragraph marks and this snapshot policy fit the research workflow, and whether the compact desktop/phone controls are clear enough. The underlying unit is each nonempty physical line, not an arbitrary selected quotation.

## Remaining work and review boundary

**Next planned slice: 32B**, the optional two-track reading/coding overview, exact paragraph/source-range list and accessible jumps. No overview or completion percentage is included yet. Remaining W03 visual refinements, owner/supervisor acceptance, current-feature VoiceOver and physical-device checks, and release gates remain open. Earlier device checks are historical. Windows remains unverified.

Evidence: UX-32A-READING-MARKS.md, screenshots and raw/ux-32a in this package. Current technical checks pass: 163 Python tests (3 skipped), 129 Node tests, 10 main Chrome cases, compatibility checks and a direct Next build. npm is unavailable; its exit 127 is retained alongside the successful equivalent build.

Local entries: [Website](http://127.0.0.1:4445/), [Report](http://127.0.0.1:4445/report), [Workbench](http://127.0.0.1:4445/w?lang=en). Use a disposable copy when editing; these loopback links are not a public deployment.
