# UX-14 · Figure proportions and scientific legibility

2026-10-15. Follows UX-13 per the user's requested order. Website only; no workbench, analysis, CSV, manifest or original SVG changes. No push or deployment. Windows deferred.

The homepage previously calculated horizontal and vertical heatmap spacing independently. Both now use one cell size. Co-occurrence keeps a square grid; coverage keeps 19 interview columns × 15 code rows. Numbered columns retain CSV order, desktop row labels identify codes, and the large inspector/native selector provides complete names and exact counts. Full tables and downloads remain available.

A prominent **Original figure** control displays the existing workbench SVG with `object-fit: contain`, using its native proportions. The default **Explore counts** is explicitly labelled as a frontend CSV view, not the original image. Opening the original gives full-size labels; the tall hierarchy original necessarily becomes small in a finite preview. No claim is made that every label is readable in its fitted thumbnail.

Following the user's additional feedback that the earlier example felt more rigorous, the hierarchy overview now uses named count bars under the saved themes, as in the report's interaction vocabulary. Eight rows per page avoid shrinking 259 dots into an illegible overview. All 259 original CSV rows remain selectable; paging, theme selection and cross-page arrow focus preserve row identity and CSV order. No counts are summed or redefined. The report page itself is unchanged.

Evidence: `~/qualicraft-review/ux-14/`. `raw/geometry-before.txt` records the expected missing geometry-helper failure (exit 1). Three new tests verify square cells/bounds at two frame heights, grid ratios, and original-order theme paging. `node --test tests/*.test.mjs tools/report/*.test.mjs`: **70 tests pass**, including the existing 594-row CSV model verification. Production build passes. Browser JSON records actual rendered cell widths/heights (within subpixel rounding), square co-occurrence, native original image loading and `contain`, keyboard row 7→8 focus across pages, nine mobile scenes and zero horizontal overflow. Browser warnings/errors are saved separately. The UX-13 Python suite (148 tests, 3 skipped) remains the most recent workbench check; no Python changes here.

These are local technical checks, not the user's visual acceptance. The next task is UX-15: richer original hand-drawn diagrams that explain the tool's underlying record and relationships, plus a fresh normal-scroll relationship-graph check.
