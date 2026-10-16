# UX-16 · Hover, saved relationships and readable matrices

16 October 2026. Baseline: `53d52911680226819457f52503936724289677e8`. Local website implementation and technical acceptance completed; owner visual acceptance remains open. The user confirmed the actual Chrome URL as `http://127.0.0.1:4445/` and explicitly allowed a fresh project-only controlled Chrome test. The reported behavior was reproduced on that candidate; it was not attributed to a stale URL.

## Changes and evidence

- **Hover without clicking:** right-hand story headings now change the left illustration on mouse hover and keyboard focus without scrolling the document. Native click, keyboard scene navigation and ordinary scroll-follow behavior remain. Each of the five module drawings also has a separate Explore link, available even when its illustrative route block is undocked.
- **Coding and Analysis are different:** Coding is a document with the exact saved Bologna highlighted passage, Unicode range, attached code and codebook position. Analysis is a branching Theme ↔ Code ↔ Highlighted passage network. Hover/focus selects a real path and exposes its exact quote and IDs. The initial family has 10 nodes and 9 links; eight saved root families can be selected. Up to three existing distinct-code examples per family are shown, with this limited sample disclosed. This is a diagram of saved relationships, not a new statistical network analysis or a representation of every coding.
- **Visible connections:** structural network curves are solid and present from the first frame; drawing motion is a separate overlay. Reduced motion retains the entire network and readable highlighted text. Mobile uses full-size path controls and quotation text rather than shrinking the desktop graph.
- **Readable matrix detail:** coverage shows a 6-interview × 3-code detail window on desktop, co-occurrence a 4 × 4 window, and mobile a 3 × 3 window. Square cells, native row/column paging and a full-matrix context view replace the tiny full-density display. The complete CSV selector automatically locates any selected value. Blank sparse cells remain unexported values, not inferred zeros. All original SVGs, full report tables and downloads remain available; no statistical or export asset was regenerated.
- **Method explanation:** the methods section now states “Shared tools. Different analytic decisions.” Reflexive TA is identified as one TA approach; qualitative content analysis also interprets meaning. The comparison no longer treats all TA as exclusively inductive or all content analysis as requiring an agreement coefficient.

The original sketch vectors use the existing QT paper/ink language. The Sites skill was applied to this existing local checkout with no cloud registration or publish. The official StepFun report was inspected for interaction patterns: focused mark/readout, detail with context, and inspectable links. Its code, illustrations, fonts, text and data were not copied into the project. Unrelated report statistics/figures were not transplanted.

## Reproduction and acceptance

Evidence folder: `~/qualicraft-review/ux-16/`; before/final screenshots and raw command outputs are retained there. The controlled browser script is `tools/site/story_acceptance.py`: fresh Chrome profile, loopback project origin only, no attachment to other windows/tabs. It uses actual mouse movement, keyboard and a mobile touch context.

| Check | Actual result / raw output |
| --- | --- |
| Before-change browser regression | Exit 1; all three targeted checks failed: heading hover timed out, Coding lacked a distinct document, matrix cell width 16.15 px. `raw/browser-before.txt` |
| Node regressions | `node --test tests/*.test.mjs tools/report/*.test.mjs`: 74 pass, 0 fail. Four added tests cover saved IDs/links/sample selection and reachable square detail windows. `raw/node-all.txt` |
| Python suite | `/private/tmp/qualicraft-read-values-venv/bin/python -m unittest discover -s tests -v`: 148 tests, 3 skipped, exit 0. `raw/unittest.txt` |
| Workbench JavaScript syntax | `node --check web/app.js`: exit 0. `raw/scope.json` |
| Production build | Bundled Node executes the existing package target directly: `node node_modules/next/dist/bin/next build`, from `website/`; final exit 0. `raw/build-final.txt` |
| Controlled Chrome | `python tools/site/story_acceptance.py --out /tmp/qualicraft-ux16/final`: 10 checks pass, exit 0, warning/error collection empty. `raw/browser-final.txt`, `final/results.json` |
| Exact UI readouts | All 594 existing CSV rows selected in the actual UI: frequency 15, coverage 285, co-occurrence 16, hierarchy 259, accumulation 19. Every selected label and numeric readout equals the independently read CSV row. No new metrics. |
| Desktop readability | At 1512 × 801, matrix cells 55.59 × 55.59 CSS px and rendered count font 22.83 px. At 1366 × 768, full closed stage bottom 725.55 px; keyboard moves between scenes and across matrix windows. |
| Natural scroll / hover | Ordinary wheel reaches the distinct Coding document and Analysis network. Heading hover and source-node hover each require 0 clicks and leave scrollY unchanged. |
| Mobile / reduced motion | 390 × 844 mobile touch context: nine inline scenes, horizontal overflow 0, native tap path selection, final CSV row reachable, cell width 59.53 px. Reduced-motion structural lines: animation none, dash none. This is browser emulation, not a physical-device acceptance claim. |
| Original assets | All ten original figure SVG/CSV responses HTTP 200 and byte/hash equal to manifest. `raw/assets-http.json`. Final user-tab original SVG is complete with `object-fit: contain`; `raw/final-live-original.json`. |
| Scope / copy scan | Protected-path diff empty, exit 0; required complete website phrase grep has no matches, exit 1; exact commands/status/stdout/stderr in `raw/scope.json` and `raw/final-git.json`. |

Final browser automation preceded only the final methods wording clarification; the final production build, copy scan and user-tab inspection followed that clarification. There was no subsequent interaction-code change. `final/methods-desktop.png` records the final methods header; the final user-tab network screenshot records the restarted build.

### Retained failures and environment limits

`npm` is unavailable in this execution environment (exit 127). A bundled pnpm attempt unexpectedly rearranged existing dependencies and attempted network access; it was stopped (exit 130), the original directories were restored, and no dependency/package/lock changes remain. The existing Next build target then passed directly through bundled Node. These are retained in `raw/npm-unavailable.txt` and `raw/pnpm-interrupted.txt`; literal `npm run build` is not claimed as passed.

An initial browser-harness API typo, a first TypeScript build error and sandbox HTTP-bind test failures are retained separately. The harness typo and TypeScript shadowed-variable error were fixed; the same Python suite passed with local bind permission. No test discovery change was made in this round. Earlier `-t .` history remains in earlier review records, not rewritten by this acceptance.

## Methods question for supervisor

A shared software workflow does not make two research methods identical. QT can retain documents, code passages, organize a codebook, write memos, inspect evidence and export results for either approach. A study would normally choose and justify the approach that answers its research question; it is not automatically necessary to analyze the same dataset twice.

For **reflexive thematic analysis**, the researcher recursively develops patterns of shared meaning through coding, interpretation and writing; a software parent node or frequent code is not automatically an analytical theme. See the authors’ [reflexive TA guidance](https://www.thematicanalysis.net/doing-reflexive-ta/) and [approach distinctions](https://www.thematicanalysis.net/faqs/).

For **qualitative content analysis**, categories and their contextual meaning remain central. Conventional, directed and summative approaches differ in how categories start and how counting is used; summative analysis continues from counts to contextual interpretation. See [Hsieh & Shannon (2005)](https://pubmed.ncbi.nlm.nih.gov/16204405/). A combined design is possible when the research question warrants it, with each method’s role and integration explained. This clarification adds no method mode, analysis feature or workbench behavior.

## Remaining and scope

Owner visual review and actual QT trial are still open. UX-12 workbench Import/Export interface improvement remains a separate planned workflow. Physical touch, VoiceOver, OS motion/download feedback require fresh device details/confirmation for this candidate. Windows stays deferred and unverified. No push or deployment.

Unchanged: `qualicraft/`, `web/`, Bologna data, schema, statistics, plotting paths, report SVG/CSV/manifest, original evidence JSON, data cards, recordings, dependency manifests and deployment configuration. Current review links: [home](http://127.0.0.1:4445/), [relationship network](http://127.0.0.1:4445/#story-analysis), [report](http://127.0.0.1:4445/report), [workbench](http://127.0.0.1:4445/w?lang=en). These are local-machine links.
