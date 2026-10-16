# QT | Supervisor review

16 October 2026 · Local candidate UX-26 · 10–15 minutes

**Status:** the workbench now starts with explicit choices: import into a new empty project, try a separate editable Bologna example, or open existing work. This browser remembers the project you actually opened and its document/paragraph position. An optional three-step guide supports Skip, close, Done and Help; existing/restored work is not forced through it. Bologna CC0 only. Overall visual and physical-device sign-off remains open. Windows deferred and unverified; no push or deployment.

## Demonstration order

1. **Website (2 min):** scroll from Import through Coding and Analysis. The fixed left window follows the text. Compare assigning a code with exploring saved relationships; select a node and inspect its exact source. Original diagrams and all five figures remain.
2. **Start and code (5 min):** open the workbench in a fresh browser context. Create a named empty project, import a Bologna document, select a passage and apply a code. Watch the guide advance, then Skip or finish; reopen it from Help. Inspect Themes & codes, overlapping assignments and the exact source. On phone, use the direct document switcher. Refresh to continue the explicitly selected project and paragraph; newer projects do not replace that choice. Remembered positions are not read marks and are outside project exports.
3. **Inspect and export (4 min):** use the relationship map to return to a saved quotation; download JSON/CSV/methods and inspect an actual file. Review all five figures, the original-size phone viewer and the heatmap magnifier. On `/report`, match selected CSV values with table rows and saved examples. The report is a fixed 19-document/874-coding snapshot; workbench edits do not update it automatically.
4. **Bologna example (1 min):** choose Try Bologna to create an independent editable copy; compare it with the explicitly labelled public read-only sample. Start your own project or restore JSON without replacing existing work.

## Evidence and discussion

UX-26: **155 Python tests (3 skipped), 108 Node tests, 12 startup checks, 10 reading-navigation checks and 11 Coding regressions pass**, as do syntax and production build. Checks cover desktop, simulated phone touch, keyboard/focus, real import/coding/source navigation/download, Skip/reopen, browser storage failures, reduced motion, copy/restore and resume. Console and normal-path HTTP errors are empty. Original Bologna records/audit/snapshots and eight analyses are unchanged; writes use disposable projects. Statistics, plotting, CSV, default tools, website and report assets are untouched. npm is unavailable; the direct production build passes.

- Are new/empty, continued, editable-example and read-only states easy to distinguish?
- Are source ancestry and exact evidence clear during reading, and is the guide brief enough to skip or revisit? Counts do not establish importance, agreement or saturation; two analytic approaches do not require two full analyses by default.
- Remaining: explicit read marks/range overview, further workbench/website visual unity, old recordings (UX17-04), startup probe messaging (UX17-05), fresh physical-device/VoiceOver/OS-motion/download checks and release gates. T01/T05 are technically complete; the overall plan is not yet complete.

Local review links: [Website](http://127.0.0.1:4445/) · [Report](http://127.0.0.1:4445/report) · [Workbench](http://127.0.0.1:4445/w?lang=en). See UX-26-STARTUP-GUIDE.md and package COMMITS.md for evidence/full hashes. Earlier PDFs are historical; this Markdown handout is current.
