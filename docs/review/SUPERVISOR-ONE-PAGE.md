# QT · Supervisor review — 16 October 2026

**Local candidate: UX-32B.** Coding now has a two-track overview and exact source navigation, alongside the manual paragraph marks from 32A. Windows remains deferred and unverified. Nothing has been pushed or deployed.

## Demonstration order · about 12 minutes

1. **Website → report (2 min):** inspect the five modules, permanent passage–code–theme network, CSV/table readings and movable heatmap lens. The report is a fixed Bologna example, separate from live edits.
2. **Import → Coding (3 min):** open an editable Bologna copy, its document, calm highlights and Theme › Code hierarchy. Demonstrate Unmarked → Read → Revisit, Clear and Undo. Resume remembers browser position separately; scrolling and coding do not mark reading.
3. **Overview → evidence (4 min):** open Overview. The two tracks use full-document Unicode character coordinates: manual marks above, saved coding ranges below. Interview02 has31 paragraphs,53 codings and52 source ranges. Preview a paragraph; inspect a shared range’s complete quotation and both coding IDs/paths; jump to the exact source. Demonstrate keyboard pagination, phone controls and an explicit Show full document & jump when filters hide the source. Resume returns to the previous position; Keep this reading position explicitly replaces browser memory. Return from a network quotation without losing its selection.
4. **Figures → export/recover (3 min):** inspect the five figures and phone original-size viewer, download JSON/CSV/matrix/methods, then restore JSON as a new project. Confirm the actual downloaded file. Website UX-29 clips predate the new reading controls; demonstrate those live or with the new screenshots.

## Rules and discussion

Marks are manual, shared project metadata. Unmarked does not mean unread; timestamps do not prove reading duration, comprehension or familiarisation before coding. A continuous coding stroke is a visual union. Two codes on one range remain two codings/one source range; paragraph touching counts cannot be summed.

JSON remains **format5** and older QT versions cannot open it. Marks save immediately to SQLite, without rotating research-edit snapshots; the next research edit includes them. **Export JSON to preserve the current marks now.** An older stored format is checkpointed before its first write. Overview preview/navigation does not write project data or create snapshots.

Discuss whether the compact controls, whole-line paragraph unit, exact source lists and preview/Resume distinction fit the research workflow. Counts, statistics, figure definitions and source text remain unchanged.

## Remaining work and acceptance boundary

The planned T03 technical slices are implemented. Joint website/report/workbench acceptance, remaining W03 visual refinement, owner/supervisor acceptance, current-feature physical-device/VoiceOver checks and release gates remain open. Earlier device evidence is historical; Windows remains unverified.

Evidence: UX-32B-READING-OVERVIEW.md, screenshots and raw/ux-32b in this package. 163 Python tests (3 skipped),139 Node tests,11 overview +10 existing-mark +2 read-only/storage cases and direct Next build pass. npm is unavailable (exit127 retained).

Local entries: [Website](http://127.0.0.1:4445/), [Report](http://127.0.0.1:4445/report), [Workbench](http://127.0.0.1:4445/w?lang=en); marked [32B QA copy](http://127.0.0.1:4465/w?lang=en). These are loopback previews, not public hosting.
