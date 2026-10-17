# QT Supervisor review 17 October 2026

Current samples (UX53, 18 October): the editable source notebook and research report now have clearer native heading levels, italic verbatim text, page numbers and controlled figure pages. Existing figures, exact quotations, counts and code are unchanged. Start locally at http://127.0.0.1:52755/ → workbench → Bologna · supervisor report sample → Export. The two Word files in samples/ are refreshed. Actual Comparative QCA, wider input/interruption checks and current researcher/device acceptance remain open; this is a review build. Windows is deferred. Local only; no push or deployment.

**Status:** Local review candidate. Editable source trees and saved research reports are available; the full final-product scope is still open. The owner chose to keep commits local after GitHub rejected the earlier push for missing workflow permission. No push retry or deployment; Windows remains deferred and unverified.

**Start here:** [Website](http://127.0.0.1:52755/) → [Workbench](http://127.0.0.1:52755/w/?lang=en) → **Bologna · supervisor report sample**. Local services require the developer’s computer. The [public repository](https://github.com/LuX-x7/QualiCraft) and hosted demos do not yet contain this local candidate.

## Demonstration about 12 minutes

1. **Start and import.** Inspect QT’s satellite entry, Pause, empty project and independent Bologna example. Import public text and confirm the saved document.
2. **Code and return.** Save a full leaf-code selection. Try Read / Revisit, Undo, dual-track overview, filtered jumps, Keep and Resume.
3. **Trace and count.** Follow a relationship node to its source. Inspect five figures, count CSVs and scripts; check the [report](http://127.0.0.1:52755/report) readouts and heatmap lens.
4. **Read the source notebook.** Export coded HTML or Word. Word has native editable tree branches beside full highlighted, italic source, with explicit paragraph labels. Assign Theme / Category / Code explicitly in Edit code. Saved roles take precedence over optional display presets; unassigned legacy nodes stay unassigned.
5. **Write and keep the report.** Export → **Write / edit research report**. Select TA or Qualitative Content Analysis; edit Analysis Table and Narrative Analysis; select exact saved quotations. Save, compare and restore versions. Add up to five existing figures with editable captions. Download HTML / editable Word with clear section headings, upright interpretation and italic quotations, or a complete ZIP with the frozen figures, count CSVs and code; restore project JSON separately. Coding changes flag stale evidence and require deliberate refresh. Word edits do not update QT.

## Discuss and decide

Are the editable source tree and report editor useful for writing? Do quotation traceability, negative cases, method decisions and reflexivity give enough review context? Do the explicit codebook roles fit the research design, and which Comparative QCA scope is required?

**Remaining:** actual separately tested Comparative QCA; broader batch import, maximum-load and process-interruption checks beyond the passed bounded 1 / 2 / 100-document test; dedicated transcript PDF as a separate follow-up. Researcher interpretation, current physical-device / VoiceOver / OS-motion / download feedback, and supervisor acceptance remain open.

**Current update (UX-52):** Saved reports now share frozen figure assets across retained versions. Caption edits do not regenerate figures; stale additions require explicit refresh. Concurrent coding changes reject the prepared report rather than overwriting evidence. 208 Python tests (3 environment skips), 193 Node tests and the direct Next build pass. Forty distinct Chrome workflow / final-download checks pass with no normal console / HTTP / outside errors; the 13-page report Word was rendered and every page inspected, alongside the retained 15-page source tree. All five figure bundles and independently rerun code reproduce exactly. Evidence: [UX-52](UX-52-FROZEN-REPORT-FIGURES.md).

**Research roles (UX-51):** Explicit research roles persist through JSON / snapshots and appear in source exports and report starting labels. 198 Python tests (3 environment skips) and 193 Node tests pass. All 25 members of the five original figure bundles and their numeric result objects remain equal after role edits; 32 protected paths remain unchanged. Direct Next build passes. [UX-51](UX-51-PERSISTENT-RESEARCH-ROLES.md).

**Word acceptance (UX-50):** 191 Python tests (3 environment skips); final 13 transcript and 19 report-related regressions, 14 transcript-export and 11 report-editor Chrome checks, and direct Next production build pass. Normal console / HTTP / outside-project errors are zero. The 15-page full-source Word and 3-page report sample were rendered and inspected; exact evidence and native edit / save / reopen remain intact. npm is unavailable (127); the successful direct build uses existing local dependencies. Thirty-two protected paths are unchanged. Prior 187 Node tests and UX-49's bounded 100-document / five-script capacity results remain valid historical evidence; no unrestricted-load or device claim is made. Only public Bologna content is included. Details: [UX-50](UX-50-WORD-HIERARCHY.md), [UX-47](UX-47-RESEARCH-REPORT-EDITOR.md), [UX-49](UX-49-BOLOGNA-CAPACITY.md).
