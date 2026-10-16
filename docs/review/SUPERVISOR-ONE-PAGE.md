# QT | Supervisor review

16 October 2026 · Local candidate UX-30 · 10–15 minutes

**Status:** the startup health-check mismatch (UX17-05) is fixed, with real failure reporting retained. All five current-QT recordings and authentic still alternatives from UX-29 remain. UX17-01–05 are closed by their respective acceptance records; broader visual/device acceptance, read marks/range design and release gates remain open. Bologna CC0 only. Windows deferred and unverified; no push or deployment.

## Demonstration order

1. **Website (2 min):** scroll through Import, Coding, Analysis and the circular network. The left illustration stays fixed. Hover/focus saved relationships. Open “Workbench recording & steps” → “Real workspace recording” to inspect current QT clips, or choose a recorded/full-size still. Original diagrams and all five figures remain.
2. **Import → code → evidence (4 min):** explicitly create an editable Bologna copy. Import a Bologna document and assign existing codes to a passage. Inspect Themes & codes ancestry, locate the exact quotation through the relationship map and return. On phone, switch documents; refresh to resume. The guide can be skipped/reopened. Position memory does not mark text as read.
3. **Five figures → report (4 min):** inspect frequency, coverage, co-occurrence, hierarchy and accumulation; try the original-size phone viewer. Open `/report`, select exact CSV values/table rows and move the heatmap lens. **The report is a fixed 19-document/874-coding example, not a live report of workbench edits.** This startup test uses unchanged 19/317/874 copies. The separate UX-29 recording copy has 20 documents/875 codings; its added assignment is a UI test, not a research finding.
4. **Export (2 min):** download JSON, coding CSV, matrix CSV and methods Markdown. Inspect actual files and QT’s filename/size/content preview. The Export recording shows the native panel after a verified JSON download; “Sent to browser” alone does not prove OS completion.

## Evidence and discussion

The revised startup diagnostic checks the same `/w/api/bootstrap` as the existing proxy, including JSON shape. It waits at most three attempts, each limited to five seconds, with one-second intervals. A waking backend logs waiting then ready; persistent connection, HTTP, timeout or malformed responses log failed. Next starts independently. Redirects are not followed; bootstrap tokens/project metadata are not logged. This is a bounded startup check, not continuous monitoring. The website’s own `/api/health` remains its liveness endpoint, not a combined backend-status API.

Fourteen targeted regressions fail before and pass after; nine real Next startup cases pass. Delayed Bologna startup recovers on attempt 3; a persistent timeout reports failure after about 17 seconds. Normal console/HTTP are clean. 155 Python tests (3 skipped), 122 Node, syntax and direct Next production build pass; npm was unavailable. All 16 registered fronts report ready on their first probe, including normal 4445. Only startup diagnostics change product behaviour; workbench/statistics/rendering, media, report assets and Bologna database bytes remain unchanged. Earlier UX-28/29 route and media evidence remains available.

- Is source ancestry and the five-step presentation clear enough for independent use?
- Decide explicit read-mark/range states and storage/export semantics before implementing them.
- Still open: remaining W03 visual refinement, fresh owner/physical-device/VoiceOver/OS-motion/download sign-off and release gates. Counts do not establish importance, agreement or saturation. Windows remains deferred.

[Website](http://127.0.0.1:4445/) · [Report](http://127.0.0.1:4445/report) · [Workbench](http://127.0.0.1:4445/w?lang=en). Current evidence: UX-30-STARTUP-HEALTH.md and package COMMITS.md. Earlier PDFs/candidates are historical.
