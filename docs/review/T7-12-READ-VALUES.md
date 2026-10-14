# T7-12 · Report value reading and count-row selection

Scope: `/report` frequency and accumulation only. Baseline:
`f66bda6291412949a7475caf92c51ecee745c208`.

The original workbench SVG stays an image. A transparent selection layer uses
its existing rectangles and marker coordinates; CSV rows supply every displayed
label and value. Geometry is enabled only when the CSV identity/order/values
agree with the manifest and the SVG shape, labels and coordinates agree with
that order. Unsupported or transformed SVG layouts retain the CSV selector,
static figure, complete table and download, with no guessed overlay.

On desktop, pointing to or focusing a mark shows an immediate value hint.
Click or Enter opens the counts; arrow keys, Home and End move between marks,
Tab leaves the figure, and Escape clears selection. The native selector and
Previous/Next controls work at both widths. At 640px and below, the dense mark
layer is hidden and the selector/buttons provide targets at least 44px high.
The selected table row is highlighted and revealed inside its scroll region;
only **View selected row** changes the page position and moves focus to that
row. Table buttons also select the figure item, and a native anchor returns to
the figure. Existing table disclosures, count order and CSV links remain.

No workbench code, analysis, graph rendering, report assets, manifest, data
cards, homepage, clips, dependencies or deployment configuration changed.
There are no new counts, filters, statistics or interpretive claims. Existing
unit statements continue to come from the manifest.

## Validation

Raw commands and exit codes:
`~/qualicraft-review/report-read-values/raw/`.

- `node --test tools/report/read_values.test.mjs`: 8/8 pass (exit 0).
  Covers all 34 marks, tied counts, label/row/value/order disagreement,
  unsupported transforms/geometry and out-of-bounds shapes.
- `python -m unittest discover -s tests`, with the temporary environment's
  matplotlib/pandas/numpy installed: 129 tests, OK, skipped 3, exit 0.
  The first run with default Python lacked matplotlib and reported 11 errors;
  that output is preserved in `baseline-unit.txt`. Dependency setup and the
  successful baseline and final runs are separate raw records. Test files and
  the known `-t .` collection issue were not changed.
- `node --check web/app.js`: exit 0. Existing workbench CSS and report CSS
  braces balanced. No workbench source modification.
- `npm run build`: exit 0, including TypeScript checks. The existing middleware
  deprecation notice remains. The service was restarted after the final build.
- Required prohibited-word grep: no matches, exit 1 (`raw/wording.txt`).
- CUA Chrome browser: target desktop 1440×900 and phone 390×844.
  `browser/checks.json` has 103 observations, including 96 CSV selection
  comparisons. All 15 frequency rows and all 19 accumulation rows were selected
  at both widths. Mouse, keyboard boundaries and Tab, native selectors,
  Previous/Next, table-to-figure selection and focused row positioning passed.
  Both widths have zero horizontal page overflow; console warnings/errors: 0.
- Two actual browser downloads match the original CSV bytes and SHA-256.
  All ten figure/CSV files match their manifest and baseline, both on disk and
  over HTTP. Manifest and data cards are unchanged. Home/about/report: HTTP 200.
- Server HTML preserves all five original image references, all 594 count rows
  and five CSV download links before JavaScript. This is a server-output check;
  JavaScript-disabled browser execution was not emulated.

The early in-app browser attempts changed viewport or lost their tabs; an
initial comparison also encountered cross-realm Array prototypes, and one
native off-screen point click did not select its intended point. Those records
are retained under `preflight/`. Final acceptance used a separate Chrome task
tab, serialised observations and visible chart navigation before clicking.

Phone acceptance uses a browser viewport and native controls, not a physical
touchscreen. Windows, physical-touch hardware and reduced-motion runtime
emulation remain unverified. No new hint or selection transition is added.

## Screenshots and evidence

Ten unedited JPEGs under
`~/qualicraft-review/report-read-values/browser/`:

- `desktop-frequency-hint.jpg`, `desktop-frequency-readout.jpg`,
  `desktop-frequency-row.jpg`
- `desktop-accumulation-hint.jpg`, `desktop-accumulation-readout.jpg`,
  `desktop-accumulation-row.jpg`
- `phone-frequency-readout.jpg`, `phone-frequency-row.jpg`
- `phone-accumulation-readout.jpg`, `phone-accumulation-row.jpg`

The DOM content viewport is 1425×900 / 375×844 after the scrollbar gutter.
The browser screenshot provider returned 1425×755 / 375×812 pixels; no images
were resized, cropped or retouched. Chrome's existing translation-extension
badge appears in some screenshots and is not site content.

`tools/report/accept_read_values.mjs` is the repeatable CUA acceptance helper:
bind a tab in `cua_repl`, import the helper, then call `sweep`, `keyboard`,
`mouse`, `controls`, `locate`, `screenshot` and `save`. Its page evaluations
only observe DOM state; all actions use the documented browser API. Evidence,
downloads, console records and screenshots stay outside Git. One local commit;
no push or deployment.
