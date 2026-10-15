# UX-15 · Hand-drawn record schematics

2026-10-15. Local website candidate after UX-13 and UX-14, in the user's requested sequence. The user asked for drawings that explain the professional underlying design instead of just showing a file or box, and reported that the relationship graph was still absent during normal scrolling. User visual acceptance remains open.

## What changed

All drawings are original repo-native SVG paths. No external images, fonts, icons, copied code or assets. Stroke echoes, incomplete construction arcs, datum lines, paper edges, range brackets and differentiated line weight provide the notebook character; motion follows record relationships rather than adding decorative motion everywhere.

- **Five modules:** file → preserved text/range → local record; selected passage → coding record → theme enclosure; source fragments → linked code nodes → theme; matrix → figure → script; local record → four file structures. Labels below each block explain the input/output, and existing route composition remains an illustrative choice, not a claim that core document/coding features can be disabled.
- **Import:** the actual existing Bologna excerpt remains readable; a native third control exposes its saved Unicode `[26013, 26090)` range. The bracket endpoints align with the two displayed coordinates. The range comes from the existing evidence export, not a new parsing or coding action.
- **Export:** the selected format shows a project structure, coding rows, document-by-code matrix or methods outline. Hover, click and focus update the existing format description. No demonstration download is fabricated; real download actions remain in the workbench.
- **Data/methods/boundaries:** the archive/record/check path and the two approaches now use explicit relationship and matrix structures. Boundary drawings show human review, local files, portable handoff and exact source matching. The local-files drawing makes no encryption claim.
- **Relationship visibility:** no additional graph generation or analysis was needed. The current site has the real four-node Bologna subgraph in both Coding and Analysis. It is shown by normal scroll, with native buttons for the quote, code and two saved ancestors. The saved IDs and source range remain inspectable. A short-desktop spacing adjustment keeps the entire closed graph frame in the viewport.

## Actual checks

Evidence: `~/qualicraft-review/ux-15/`. The current build is served at `http://127.0.0.1:4445/`; report `/report`; workbench `/w?lang=en`. This is a local address. Existing 4446 phone preview remains connected to the isolated read-only workbench.

- `node --test tests/*.test.mjs tools/report/*.test.mjs`: **70 pass**, including geometry, keyboard scene navigation, saved relationship identity and all 594 original CSV rows. No implementation-mirroring tests were added just for reversible SVG edits.
- Production Next build exits 0; `node --check web/app.js` exits 0. No Python/workbench changes; latest full Python result remains UX-13's **148 tests, 3 skipped, exit 0**.
- **Normal scroll:** from the actual homepage top, native wheel down four pages reached Coding at scrollY 3204, with four graph nodes; one further page reached Analysis at scrollY 4005. No module heading was clicked for this check. `browser/natural-scroll-relationship.json` and `relationship-natural-scroll.jpg` retain the observations. Final 1512×801 frame: top 78, bottom 798.453; all four stable IDs in `relationship-final.json`. This proves the graph is present on this tested candidate; it does not establish which URL/build the user previously viewed.
- **Desktop:** five module schematics visible; Import exact range selection works; all four export format structures visible and Matrix keyboard selection reads the correct purpose; two method schematics retain complete connections after animation, and native Enter expands method/boundary explanations. Screenshots show surrounding page context.
- **390×844 viewport:** all nine inline scenes remain, horizontal overflow 0; quote click selects its range, root-theme Enter selects its full name. Actual mobile touch/VoiceOver and owner QT trial remain separate from this viewport check.
- **Reduced motion:** explicit in-page Reduce motion reports pencil animation `none` and record transition `0s`; selection continues working. Restored Follow system and native viewport before leaving the project tab open.
- `browser/console-final.json`: warnings/errors empty. Required complete website forbidden-phrase scan and protected-path diff are saved with exact command, exit status and raw stdout/stderr in `raw/scope.json`. Original report assets, manifest, evidence exports, data cards, workbench, demo data, clips and deployment configuration remain unchanged.

The rendering tool can capture before native scrolling/layout settles. Intermediate misframes are not used as acceptance evidence; named final screenshots were checked against visible DOM positions. UX-14's initial geometry capture was replaced after CSS finished loading; native SVG fit was verified after image completion.

## Still open

The scientific clarity and hand-drawn visual direction require the user's review. UX-14 keeps a clear original-SVG view and replaces the over-simplified hierarchy dots with named bars, but this does not claim that the user has accepted the result. Workbench Import/Export UX-12 remains a separate scope, actual QT trial/device information remains outstanding, and Windows is deferred/unverified. No push, deploy or auto-deploy configuration change.
