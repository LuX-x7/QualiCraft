# UX-46 · Native editable Word tree

2026-10-17. Baseline `7c10c18e5db2871f3acb8d74970e77c19ef47827`. The owner requested the source-plus-tree screenshot layout in the actual editable Word output. This workflow changes only coded-transcript DOCX presentation and its regression test. Other uncommitted report-editor work is a separate UX-47 workflow.

The DOCX now uses native Word text, nested borderless layout cells and editable branch borders. Small Theme / Category / Code role labels sit above the node names; the default Saved Group / Code display remains available. The full saved ancestry is retained, with adaptive spacing for deep paths. Source text uses a serif face, source highlights remain exact, and short leaf labels and their A references stay together across pages. Full IDs and ranges remain in Record details and the frozen data record. This is not a screenshot embedded in Word. Word edits remain external edits and do not write back to QT. Display roles do not establish persistent research semantics.

## Evidence

Only a Bologna temporary copy was used. Evidence directory: `~/qualicraft-review/ux-46/`.

| Command / inspection | Result | Raw evidence |
| --- | --- | --- |
| New native-branch regression against the previous implementation | Failed as expected | `raw/word-red.txt` |
| `python -m unittest discover -s tests -p test_transcript_export.py -v` with localhost permission | 12 tests, OK | `raw/transcript-final-network.txt` |
| Same command inside the restricted socket sandbox | 11 pass, HTTP socket PermissionError; retained environment attempt | `raw/transcript-final.txt` |
| `tools/e2e/transcript_export.py --url http://127.0.0.1:51558 --out …` | 14/14, console / HTTP / outside requests zero | `raw/browser.txt`, `browser/results.json` |
| documents renderer on `samples/tree-notebook.docx` | 15 final pages inspected; full source plus clear native branches | `raw/final-render.txt`, `final/page-*.png` |
| Native Word text edited, saved and reopened in memory | Editable text and branch borders retained; source data unchanged | `raw/edit-proof.json` |

The Word sample contains the first public Bologna document: 18,239 characters, 53 coding associations and 52 unique ranges. The three-role display preset is explicit. The original 19-document / 317-code / 874-association seed is not modified. Windows, native Microsoft Word rendering and current device / VoiceOver sign-off remain unverified; rendering uses the local documents renderer. No push or deployment.

This completes the requested Word-tree implementation; full method workflows, Comparative QCA, capacity and researcher acceptance are separate final-product gates. UX-47 report writing is being validated separately.
