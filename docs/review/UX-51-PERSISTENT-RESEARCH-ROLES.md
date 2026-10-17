# UX-51 · Persistent researcher-chosen roles

2026-10-17. Baseline `3f03fc3614780b4173e0ba411b5c165d7ec50019` (UX-50). Following the owner's request to continue the remaining scope, this implements the first remaining item in UX-50: explicit Theme / Category / Code roles, separate from saved ancestry and statistical identity. Only disposable public Bologna projects were used. No private interview files were read. No push, deployment or Windows verification.

## Result and contract

Create / Edit code now offers Not assigned, Theme, Category and Code. The researcher assigns or clears a role; moving a node keeps its role. Codebook and coding-margin labels prefer the saved role. Unassigned legacy nodes retain the structural labels; there is no depth-based migration or inferred research classification. The optional `research_role` key is retained by schema-v5 project JSON, validation, audit and ordinary research-edit snapshots. Invalid role values fail before mutation, including requests containing other edits.

Both coded HTML and editable Word prefer the saved role over optional display presets. Their frozen paths include the explicit role and unchanged IDs / ancestry / source ranges. The report editor uses explicit roles for optional starting labels; authors can still edit report labels independently. Changing a role changes the report evidence fingerprint, flags the saved report stale and leaves its frozen version intact. Projects with no roles preserve the exact prior fingerprint algorithm. The website Coding explanation is synchronised with the shipped capability. Comparative QCA remains explicitly unavailable.

Editing a code now submits only touched form fields. Browser acceptance found that a role-only save otherwise normalised an existing uppercase colour value; this was corrected and the final test compares every other field exactly. This also avoids resubmitting an unchanged duplicate name. Existing name-change policy, statistical grouping, tree parentage, counts and plotting remain untouched. Chinese-language code creation uses the same stable API route as English instead of a translated route segment.

## Acceptance and evidence

Raw evidence and screenshots: `~/qualicraft-review/ux-51/`. Failed attempts are retained alongside successful runs; they are not counted as passes.

- `python -m unittest tests.test_research_roles -v`: seven new tests. Six pre-implementation cases originally produced five failures (`raw/roles-red.txt`); the completed suite passes (`raw/roles-http-final.txt`). It covers explicit create / edit / clear, atomic invalid requests, audit, JSON and snapshot recovery, saved-role export precedence, exact source / IDs, legacy fingerprints and stale reports. Optional fields do not alter any existing analysis result.
- `python -m unittest discover -s tests -v`: **198 tests, OK, three environment skips**, exit 0 (`raw/python-full.txt`).
- `node --test tests/*.test.mjs tools/report/*.test.mjs`: **193 pass**, exit 0 (`raw/node-shipping.txt`). New checks cover role labels / immutability, role-only dirty fields and report starting labels. App / report-editor syntax checks pass.
- `tools/e2e/research_roles.py --url http://127.0.0.1:52755`: **6 / 6** grouped checks (`browser-source-final/results.json`). Desktop keyboard and hover, phone-touch emulation / reload / clear, HTML and Word downloads, report labels / stale versions, JSON restoration, exact other fields and Chinese creation pass. Normal console, HTTP and outside-project requests: zero.
- Existing `coding_hierarchy.py`: **11 / 11**; `research_report.py`: **11 / 11**; final `transcript_export.py`: **14 / 14**. The latter verifies complete 19-document / 874-coding export, Unicode / overlaps / cross-paragraph links, offline HTML without scripts, all four old downloads, stale export detection and unchanged original project / snapshots. Corresponding directories: `legacy-coding/`, `report-regression/`, `transcript-final/`.
- Project-only desktop / phone website and `/report` smoke checks: **4 / 4**, no horizontal overflow or console / HTTP / outside-project errors (`site/results.json`). These 46 checks are distinct across the five scripts; phone checks are Chrome emulation, not new physical-device acceptance.
- `plot_identity.py`: all **five figure bundles × five members = 25 members byte-identical**, including PNG, SVG, PDF, CSV and standalone code, after assigning roles to all 317 Bologna nodes. Numeric result objects also match (`raw/five-figure-identity.json`). Original seed data remain unchanged.
- Direct bundled Node + Next production build passes from an isolated physical copy of all **108 website source files**, with existing local dependencies (`raw/next-build-final.txt`). npm is absent; its UX-50 exit-127 record remains available. No deployment. The preview was restarted after building.
- `check_scope.py`: **32 protected paths** (statistics, plotting, datasets, seed, existing website figures / clips, CI and deployment configuration) equal the UX-50 baseline; website copy equals the final successful build (`raw/scope.json`). `git diff --check` passes.

Earlier browser runs exposed the colour normalisation issue above, several acceptance-selector / wait errors, and transient startup timeouts while builds and browser runs overlapped. Final regressions ran sequentially after the final build and server restart. Original logs are preserved; no product timeout was changed, no general performance guarantee is inferred, and no failing output is presented as a pass. New Word deliverables were not substituted in UX-51: the UX-50 final 15-page source notebook and 3-page research-report samples remain frozen, rendered and inspected.

## Remaining order

1. Bind existing figure / CSV / parameters / standalone code to saved report versions, with editable captions and reproducible downloads.
2. Implement and independently validate actual Comparative QCA in its own workflow; [UX-48](UX-48-QCA-IMPLEMENTATION-BRIEF.md) remains a proposal, not an available engine.
3. Broader input / batch / maximum-load / crash checks, followed by the complete integrated flow and current researcher / physical-device / supervisor acceptance.

Roles close this metadata capability, not the complete final-product standard. External Word edits do not update QT. Windows remains deferred and unverified; commits remain local by the owner's latest decision.
