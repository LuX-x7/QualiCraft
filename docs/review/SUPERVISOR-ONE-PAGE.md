# QT | Supervisor review

16 October 2026 · Local candidate UX-18 · 10–15 minutes

**Status:** the main workflow passed joint review. UX-18 fixes overlapping hierarchy labels; two mobile usability findings remain open. This candidate is suitable for discussion, with owner visual acceptance still pending. Bologna CC0 only; no AI service is required. No push or deployment. Windows remains deferred and unverified.

## Demonstration order

1. **Website (2 min):** explore the five modules; compare Coding's highlighted document with Analysis's saved Theme ↔ Code ↔ Passage network.
2. **Workbench (4 min):** import a Bologna document into a disposable copy, inspect the saved document, apply existing codes, then use Insights to locate a full quotation and return to the map.
3. **Figures and report (4 min):** generate the five figure types. Inspect the repaired hierarchy at native size and its count/script bundle. On `/report`, select values, locate their exact CSV rows and inspect a saved source example. The report remains a fixed 19-document/874-coding example; it does not automatically absorb workbench edits.
4. **Export (2 min):** compare project JSON, codings CSV, matrix CSV and methods Markdown. Open a real download and the standalone figure script.

## What changed and was checked

Hierarchy rows now reserve space for their full labels. All 259 hierarchy rows, five CSVs, existing statistics/credits and the other four original SVGs are unchanged. Actual 9/10 pt PDF labels have no collisions or clipping. The downloaded standalone script reproduces SVG, PDF and PNG byte-for-byte.

Current checks: **150 Python tests (3 skipped), 74 Node tests, five controlled Chrome checks**, desktop/390px touch context, keyboard, actual downloads and empty normal console/HTTP errors. The Next production build passes; the literal npm command is unavailable on this machine and its failure is retained. Mobile simulation does not establish physical-device acceptance.

## Questions for discussion

- Is the passage–code–theme relationship clear, and is returning to the exact source straightforward?
- Does the current homepage/report achieve the intended visual balance? Which information should remain visible by default?
- Which analytic method fits the study? Shared tools support different analytic decisions; the dataset need not be analyzed twice by default. Counts do not establish importance, agreement or saturation.

## Remaining work

- **UX17-02/03:** phone plots still shrink too far; direct mobile document switching is missing. This round fixes label collisions, not those two interfaces.
- **UX17-04/05:** recordings show earlier UI; the startup health probe can misleadingly report 404 while actual endpoints work.
- Owner QT trial/visual approval and fresh physical-phone, VoiceOver, OS motion/download confirmation with device details remain open. Windows is deferred. Public release/hosting gates remain separate.

Local links on this Mac: [website](http://127.0.0.1:4445/) · [report](http://127.0.0.1:4445/report) · [workbench](http://127.0.0.1:4445/w?lang=en). UX-18's isolated copy is on port 4451 (19 documents/874 codings). These are not public sharing links. The evidence package requires the checkout; it is not an installer. See UX-18-HIERARCHY-LAYOUT.md and the package's COMMITS.md for scope, original outputs, screenshots and complete commit hashes. Earlier PDFs are historical.
