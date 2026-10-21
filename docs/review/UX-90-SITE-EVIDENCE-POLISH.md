# UX90 · Evidence presentation and whole-site review

21 October 2026. Local candidate on `t7-site`; not pushed or deployed. Consolidates the preceding uncommitted website corrections with this visual pass. Source base: `9658c3c136d21c4d62d1bf523b6c1d94ac376aca`.

## Result

The Analysis illustration now shows a source sheet and a thin, indented codebook tree. The quote leads; source selection, identifiers and methodological notes are secondary. Previous/next controls, source dropdown, hover/focus and arrow-key tree navigation retain exact saved identities. The independent circular network remains, with a focused saved family, all-family selection, source expansion, keyboard selection, drag and zoom. Its layout is deterministic display geometry only. English teaching excerpts are the default; Original Bologna remains an explicit switch. The teaching network retains all 11 associations; the original overview includes all eight saved families, up to three distinct code examples per family. The complete project is still available in the workbench.

The website preserves explicitly assigned Theme/Category/Code roles. Legacy Bologna has no saved research-role assignments; its ancestors display Group. Tree depth does not manufacture a research role. TA does not mandate Category; Comparative QCA retains its separate case/condition/outcome workflow. No project records, research methods, statistics or drawing scripts were edited.

Other findings and fixes:

- All four home-section headings use the same centered title, short introduction, serif scale and spacing. Section numbers are secondary. The five module buttons reveal one short introduction; selection brings it into view if necessary.
- TA/QCA/CA acronyms are prominent and share a baseline. The selected method opens one white detail surface; the long process map remains collapsed. Native button semantics are retained for keyboard and accessibility APIs.
- Import/Coding and the Notebook illustration retain English teaching source choices. The full original figure dataset is separate: 19 documents, 317 codes, 874 codings, 594 CSV rows, 259 hierarchy rows and 19 accumulation steps. Frequency starts 23/21/19. The manifest and all ten original SVG/CSV assets exactly match the preserved original archive; no figures were regenerated.
- Worked outputs distinguish the complete original figures/code bundle from the English teaching bundle. The teaching report and editable Word still describe the selected translated subset; they are not relabelled as a full-corpus report.
- Sources now has a single primary title and accurate full-corpus/translation scope. Help no longer calls the English example planned. Source cards remain generated dataset content.
- QT home links to the hero anchor; the hero summary avoids an orphaned last word. The last home section is **What QT does not do**, explicitly product choices.
- At 1024px, evidence remains side by side. At 390px it stacks; the connector remains in its gap rather than crossing text. Secondary pages retain a consistent editorial heading.

## Evidence

Evidence root: `~/qualicraft-review/ux90-site-review/` (screenshots and raw outputs are outside Git). The temporary workbench was created only under `/private/tmp/qt90/workbench` from `teaching_project()` and `bologna_example()`; no other account, source database or real interview was opened.

| Check | Command / evidence | Result |
|---|---|---|
| Frontend regressions | bundled Node `--test tests/*.test.mjs`; `node-tests.txt` | 324 passed, 0 failed |
| Python regressions | `MPLCONFIGDIR=/private/tmp/qt90/mpl /tmp/qt-77-env/bin/python -m unittest discover -s tests -v`; `python-tests.txt` | 345 tests, 3 existing skips; exit 0; 105.904s |
| Production/TypeScript | bundled Node `website/node_modules/next/dist/bin/next build`, cwd `website`; `build.txt` | exit 0; 7 static pages |
| Original magnifier | `tools/site/heatmap_acceptance.py --url http://127.0.0.1:4425 --out /private/tmp/qt90/heatmaps`; `heatmap-check.txt`, `heatmaps/` | all recorded checks pass; all 301 matrix CSV rows; real mouse hover, keyboard, touch emulation, downloads and reduced motion; console/HTTP errors 0 |
| Website UI | project-only browser checks; `ui-checks.json`, `screenshots/` | 37 checks passed; 1440×1000, 1024×768, 390×844; all 11 scenes, exact source switching, all eight original families, connected endpoints, method alignment, 594 report rows, Help/Sources/navigation; normal console warning/error 0 |
| Original asset integrity | compare archive bytes and manifest SHA-256; `scope-and-integrity.txt` | 10 SVG/CSV files plus manifest exactly unchanged from original archive |
| JS syntax / copy / whitespace | `scope-and-integrity.txt` | JS syntax exit 0; prohibited-copy scan no match (rg exit 1); source diff whitespace exit 0 |

The original matplotlib SVGs contain path whitespace and the CSVs retain their original CRLF endings. Whole-diff whitespace warnings for these byte-preserved assets are not normalized away; source files are checked separately. An initial Node PATH miss, socket sandbox denial from the preceding pass, and a wrong-working-directory build attempt are environmental invocation failures, not passing product checks. The final commands above use the available runtimes and authorized isolated localhost ports. The old test expectation of 59 teaching rows was updated to the restored 594 original rows and exact archive-byte checks. Legacy root-role expectations now assert unassigned Group instead of an inferred Theme; complete family reachability and same-name identity remain required.

## Release decision and remaining work

**Do not label this a final release or push on the premise that the workbench is clear.** The current request conditions publication on the workbench having no outstanding problems. In the 894-character English Bologna temporary document at 1440×1000, Overview → exact paragraph 2 → Go to source → Keep → Resume still shows **Paragraph 1 / 3**. UX86-02 is reproduced: `workbench-release-check.json`, `screenshots/workbench-keep-resume-open.png`. This local position problem does not mean source text or codings were lost. No research edit was made during this check.

Next sequence, integrated with 75E:

1. Fix UX86-02 with a short-document regression, then verify Keep, Resume, source inspection, search clearing, switching and refresh. This round did not change workbench behavior.
2. Close UX86-03 registration-pattern console error and UX86-04 hosted-save wording, both still open from UX86/87; they were not revalidated on the private production service in this round.
3. Rerun the joint workbench route and compare local/online file hashes. UX86-05 is corrected in this **local website candidate** by restoring the original corpus and separating the teaching example; it is not yet an online closure.
4. On a clean gate, publish the reviewed source to the existing GitHub repository using the authorized release route. Any website deployment is a separate verified step; a Git push is not evidence of a live update.

Windows remains deferred. Physical phone, VoiceOver, supervisor aesthetics and independent novice acceptance are not claimed. Automatic Pages publication and server OS-boot registration remain separate unresolved deployment items. No shared server service, other project, Render setting or GitHub permission was changed. The pre-existing uncommitted `web/style.css` compact-header patch is deliberately left outside this website commit.
