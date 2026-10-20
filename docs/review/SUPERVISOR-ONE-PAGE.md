# QT — supervisor review

Start at **https://qt-review.taila524d0.ts.net/**. Allow 10–15 minutes. The website is public; the full online workbench uses the separate invitation supplied privately. No installation or Tailscale account is needed for visitors.

## Suggested demonstration

1. **See the workflow.** Explore the five modules and the passage–code–theme connections. Compare Content Analysis, Thematic Analysis and the separate Comparative QCA workflow.
2. **Inspect real outputs.** Open [Worked example](https://qt-review.taila524d0.ts.net/QualiCraft/report/#sec-outputs): coded Notebook, editable Word, Research report with selected method and method map, five figures, exact CSVs and standalone Python scripts. These are public Bologna examples, not new empirical findings. The figures cover 19 documents, 317 codes and 874 codings; the Notebook contains one complete interview.
3. **Try the full workbench.** Open https://qt-review.taila524d0.ts.net/login . Expand “First visit” and use the private invitation to choose your own username/password. Start empty and import an approved document, or choose an editable Bologna copy. Inspect coding paths, reading marks/overview and evidence links. In Figures, choose one of the five visible types and select Generate preview. An empty co-occurrence has its own explanation; real errors offer a retry.
4. **Review an unwanted import.** Open Manage documents, find the source by name and inspect its ID/counts. View it first; Remove requires a separate review and checkbox. Cancel is the default. Recovery points restore a separate project. Current QCA mappings block removal until explicitly revised; frozen outputs keep their original evidence.
5. **Save and recover.** Download Notebook/Word, a report, figure/code bundles and project JSON. Refresh or sign in again to check server saving; restore JSON as a new project. Word is editable, but edits in Word do not update QT.

## Discussion

- Are the source quotations, tree paths and selected method clear enough to support interpretation?
- Does the report help develop a narrative while keeping evidence and researcher judgement visible?
- Which steps are confusing, missing or unnecessary for a small interview study?

Comparative QCA uses explicit case/condition/outcome calibration and configuration analysis. Coding frequencies are not set memberships. The public worked report illustrates **Content Analysis** and does not claim an empirical Comparative QCA result. Agreement with one hand-coded analysis alone does not establish general methodological validity.

## Status and remaining work

Fixed-origin website/workbench and full Bologna exports passed online checks. QT web/tunnel process restarts retained the hostname, saved coding and frozen report. **OS boot registration requires the server administrator; the shared server has not been rebooted.** Funnel is a free-plan candidate with provider limits, not a production SLA.

Online projects are stored privately on the QT server. Use only material approved for that hosting arrangement. Local use remains available. Current technical regressions: 341 Python tests (3 existing skips), 303 JavaScript tests. Normal manual coding now returns a committed change receipt and real recovery status in one request. Three paired online saves measured 1.56–1.62 seconds, versus 16.39–24.81 seconds before this change. Stale baselines safely reload full state and can take longer; these timings are not a service guarantee. Researcher/supervisor acceptance and current native accessibility checks remain separate. Phone follow-up and Windows are deferred, not recorded as passed. Five-figure outputs match the previous counts and SVGs; large hierarchy previews can still take longer. Details: [current figure evidence](UX-80-FIVE-FIGURE-FLOW.md) and [save/recovery evidence](UX-79-CODING-SAVE-RECEIPTS.md).

UX81 (20 October): document management tested locally and online using isolated Bologna copies. All 295 front-end tests and 341 Python tests (3 existing skips) complete successfully; production build passes. No independent novice sign-off or Windows certification is claimed. Other 75D items remain open.

UX82 (20 October): complete candidate browsing and full-path selection are now live in QT. All 303 front-end tests, 341 Python tests (3 existing skips), and 14 local plus 14 online Bologna walkthrough groups pass. The picker exposes all 317 codes and full paths; empty Enter cannot silently choose the first parent. Online sample saves took 1.54–1.57 seconds. Only two UI files were synced with rollback, without restarting services. Physical-phone, native accessibility and independent novice acceptance are not claimed.
