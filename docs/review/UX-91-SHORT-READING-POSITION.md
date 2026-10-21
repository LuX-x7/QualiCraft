# UX91 / UX86-02 — short-document Keep and Resume

21 October 2026. **Implemented and tested locally; not deployed or pushed.** Only disposable Bologna teaching/original copies were used. Windows remains deferred.

## Change and boundary

Short documents and final paragraphs cannot always scroll to the reading line. An explicit navigation target now survives viewport sampling when that alignment is clamped. The source-bound target stays only in the mounted reader's memory; the existing browser record continues to contain IDs, offsets and fingerprints, never interview text. Keep, Resume and a refreshed mount report the selected paragraph even when paragraph 1 remains visible above it. Deliberate source navigation releases that target, so normal reading continues to update its saved position.

Document switching captures the outgoing position before changing identity. A later sample for the previous mounted document cannot overwrite that document's position using another document's current state. Existing filter, preview, Keep/Resume and manual reading-mark meanings remain intact. Preview without Keep does not replace Resume.

Only `web/app.js` behavior changed. No schema, API, statistics, CSV, plotting, report, export, database or snapshot rule changed. The pre-existing compact-header change in `web/style.css` is preserved outside this commit.

## Reproducible evidence

Evidence: `~/qualicraft-review/ux91-short-reading-position/`. Test runtime: bundled Node and `/tmp/qt-77-env/bin/python`, with `MPLCONFIGDIR=/private/tmp/qt91/mpl`.

| Check | Command / raw output | Result |
| --- | --- | --- |
| Fail before | Run the same seven regressions against `git show 30c092da53ff200dd10c113f836af2b31923eab8:web/app.js`; `regression-before-final.txt` | 4 fail, 3 pass; exit 1 |
| Pass after | `node --test tests/short_reading_position.test.mjs`; `regression-after-final.txt` | 7 pass; exit 0 |
| Frontend | `node --test tests/*.test.mjs`; `node-tests.txt` | 331 pass, 0 fail; exit 0 |
| Python | `python -m unittest discover -s tests -v`; `python-tests.txt` | 345 tests, 3 existing skips; exit 0; 104.391s |
| Syntax | `node --check web/app.js`; `js-syntax.txt` | exit 0 |
| Production | `node node_modules/next/dist/bin/next build`, cwd `website`; `build.txt` | exit 0 |
| Chrome | `python tools/e2e/short_reading_position.py --out /private/tmp/qt91/browser-final-2`; `browser-final-2.txt`, `browser/results.json` | 22/22; console / HTTP / outside requests 0; exit 0 |
| Scope | `git diff --quiet HEAD -- qualicraft demo-data website render.yaml .github` before commit | exit 0; source whitespace check also exit 0 |

Chrome covers 1440×1000 keyboard, 1024×768 mouse and 390×844 touch emulation: paragraph 2 Keep, Resume, reload, document switching, no-match search/clear, explicit code filter/clear, and genuine End/Home reading in a long original Bologna source. Project JSON, audit and snapshot manifest remain equal before/after navigation. This is controlled browser testing, not physical-phone or novice acceptance.

Desktop observed UI sequences: jump + Keep 0.390s, Resume including settle wait 0.198s, refresh 0.658s, two document switches 0.204s. Timings include automation and explicit settling; they are not server latency or a performance distribution.

Initial sandbox socket denial is retained. The first real-browser pass exposed an outgoing-document capture overwrite and the test's duplicate Clear filters selector; both were corrected. A later test wait used a string rejected by the existing CSP; the harness now polls through the existing browser evaluation channel without changing CSP. All earlier logs remain beside the final passing run.

## Remaining gate

UX86-02 is closed locally. UX86-03 registration pattern and UX86-04 local/server save wording are next. A fresh joint acceptance is still required before the conditionally authorized GitHub push. No online closure, final release, Windows result, system-start registration or GitHub Pages automation is implied.
