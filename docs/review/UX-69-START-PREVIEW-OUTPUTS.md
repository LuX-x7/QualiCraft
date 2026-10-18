# UX69 Start page preview speed and worked outputs

Date: 2026-10-18. Owner authorized these three changes, direct push to main and manual deployment of the existing free services. Automatic deployment stays Off; Windows and phone follow-up remain deferred. Bologna only.

## Implemented scope

1. Every public workbench visit starts at an explicit Bologna read-only choice, including browsers remembering the sample. No upload/create/restore mutation is exposed there. Local startup retains empty project/import, editable Bologna, JSON restore and stable-ID continuation. QT satellite and Pause are retained.
2. The existing exported recipe accepts `--svg-only` for preview. No CSV, drawing, options, layout, fonts, resolution or statistics change. Full downloads still produce SVG, PDF, 300 dpi PNG, CSV and Python. A process-local LRU retains at most 12 previews / 8 MiB encoded output, keyed by source documents, codes, annotations, normalized options and exact recipe. Failures are not cached; result objects are copied; previews serialize/coalesce. Late responses cannot replace a newer visible stage. Cache vanishes on restart and stores no input transcripts on disk.
3. The homepage and navigation link to `/report#sec-outputs`. The report adds a native output shelf, then preserves all five original figure chapters, readouts, counts and downloads. Downloads are created by the existing exporters from an isolated copy: one full interview02 Notebook (18,239 characters, 53 links, 52 ranges), a Content Analysis illustration with 3 evidence rows and method map, editable Word, all five figure/CSV/Python bundles, and restorable 19-document/317-code/874-coding project JSON. The report is illustrative writing, not a newly validated empirical study or Comparative QCA calibration. Word edits stay outside QT. Tree roles use an explicitly disclosed structural display convention; saved names and links are untouched.

## Local evidence

Evidence root: `~/qualicraft-review/ux-69/`; working output: `/tmp/qualicraft-ux69/`. Raw records include argv, cwd, elapsed time and exit status. Screenshots and Word page renders are external to Git; the public page thumbnails are deliberate derived Bologna website assets.

- `startup-before` fails on the old automatic selection. `startup-after`: 10/10 Node startup tests pass. Public no-mutation and remembered-project behavior are checked.
- `preview-before` fails two of three new regressions. Final preview tests also cover source-text invalidation and bounded eviction. Failed renders remain retryable. Existing path safety/memory tests remain in the full suite.
- `five-baselines`, `five-parity`: all five preview SVGs and every full CSV/SVG/PDF/PNG are byte-identical to the pre-change same-font/runtime baseline; result objects equal. Full hierarchy preview locally 1.466s versus old all-format 5.308s; cache 0.006s. These are local sequential observations, not a hosted SLA.
- `local-http`: five exact SVGs through the production proxy, first requests 0.52–2.28s and repeat requests 0.017–0.021s; all 11 output files match the manifest, source project unchanged, public write probe 403. The 7.7MB project restores as a new isolated local project with report revision 2 and all frozen figures intact.
- `full-python-final`: **298 tests, OK, 3 existing skips**. `node-complete`: **247 pass**. `syntax`: exit0. `site-build-release`: Next production build exit0. Banned-phrase scan has exit1 and no matches; node_modules/.next excluded. Original report SVGs/CSVs/manifest, source SQLite, statistics, report/notebook exporters, OrbitMark and render.yaml: **18 protected files unchanged**.
- `scripts-reproduced`: extract and run each of the five downloaded recipes separately; all 15 rendered SVG/PDF/PNG files equal the packaged outputs byte-for-byte.
- Native project-only Chrome: homepage links, keyboard Enter into public Bologna, read-only disabled uploads, frequency/hierarchy preview, local empty project→complete Bologna paste import→refresh/continue, output shelf→actual Notebook/report HTML, report chapter keyboard navigation, and real Notebook Word download pass. The actual Chrome download matches SHA256 `82254e94ff7ad0f0a94b99c967bf7109739c79b539af1907687b1875b7150a42`. Console errors/warnings: empty for both project tabs.
- Chrome extension file chooser upload was unavailable without expanding file-URL access; permission was not changed. Native paste import passes; TXT/DOCX parsing and import queues remain covered by the full regression suite. This does not claim a native file-picker upload passed.
- Bundled LibreOffice rendered Notebook **16 pages** and final report **16 pages**. Page review: no clipping/overlap or broken trees; full hierarchy retains its existing five continuation views. A short illustrative paragraph was shortened to remove an orphaned metadata-only page; no exporter layout was changed. Thumbnails derive from the actual page2 renders.

## Preserved failures and limits

The first example builder used text output for a bytes-returning exporter; fixed to write_bytes. Initial sample tests compared volatile export timestamps and DOCX ZIP wrapper timestamps; corrected to compare source/version content and every unpacked Word member. The first isolated Next build rejected dependencies symlinked outside its root; copied dependencies fix this without changing product config. A sample prose revision initially mutated a frozen draft in the test helper and correctly failed integrity validation; the helper now edits a deep copy through normal report save. Direct cross-site browser entry into the isolated Python service was correctly rejected; the normal website proxy passed with all original host/origin checks retained. Raw failures are preserved.

Free-host cold starts remain. Full image bundles still generate raster/PDF on download; preview speed is a separate path. Cache is bounded and temporary, not durable storage. No new parallel-export capacity claim. Native VoiceOver/system-motion feedback, researcher judgement and supervisor acceptance are not signed on the user's behalf. Windows remains unverified.

## Release status

Local implementation and targeted acceptance complete. Remote CI, manual deployments and post-deploy receipts are recorded below after completion.
