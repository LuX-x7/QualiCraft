# UX-49 · Bounded Bologna capacity acceptance

2026-10-17. Product baseline after report identity follow-up: `c5cc80b5ce2ce83dadc581d4a094f889e2cce841`. This workflow adds acceptance scripts and records, not application features. Only labelled technical replicas of the public Bologna corpus are used; they are not 100 independent participants. Statistics, plotting, source seed and deployment configuration remain unchanged. Windows deferred; no push or deployment.

## Workload and results

Environment: macOS 15.3.1, Apple M2 Pro, 16 GiB RAM, Python 3.14.6, controlled Chrome 155.0.8059.82. All requests target the current local website / disposable backend. No unrelated windows or tabs are attached.

| Documents | Text characters | Saved coding associations | Matrix | Project bytes before report save |
| --- | ---: | ---: | --- | ---: |
| 1 | 18,239 | 53 | 1 × 317 | 142,763 |
| 2 | 49,328 | 149 | 2 × 317 | 235,730 |
| 100 | 1,565,190 | 4,615 | 100 × 317 | 4,633,658 |

One and two document projects restore their saved Bologna coding. For the 100-document workload, 99 records with their existing annotations are restored through the actual project API, the last TXT is imported through the real browser file chooser and Import button, and one real annotation is saved through the normal API. This tests a 100-document project and the actual 100th import; **it is not a 100-file bulk-import throughput test**. QT currently imports one TXT / DOCX at a time and limits a project to 100 documents. The 101st document and a corrupt JSON restore are refused without changing the project, audit or snapshots.

Eight grouped checks pass: exact 1 / 2 matrices; cancel before submission; actual 100th import / coding; atomic rejection; phone document switching / keyboard overview / refresh; four complete exports and independent JSON recovery; network and all five figure bundles; report save / reload and bounded memory. A separate ninth browser check follows the 100-document graph to the exact source and returns with the selected code intact. Normal console / HTTP / outside-project request errors are zero.

Every one of 31,700 matrix cells is checked against an independent annotation counter. Export CSV preserves all 4,615 associations; recovery preserves all documents, codes and annotations. Network has 4,882 nodes / 5,159 edges, all endpoints valid. Five bundle CSV row counts are frequency 20, coverage 2,000, co-occurrence 28, hierarchy 259 and accumulation 100. Every standalone exported script is actually rerun; all five members of each bundle remain byte-identical, including SVG / PDF / PNG and count CSV. The original 19 / 317 / 874 project and its own snapshot items remain equal.

| Measured operation | Seconds in this run |
| --- | ---: |
| 100th actual TXT import | 0.541 |
| 100-document phone open | 2.347 |
| Three phone document switches | 0.054–1.221 |
| Four export requests | 0.040–0.293 |
| 100-document JSON recovery | 0.520 |
| Five figure bundles individually | 1.090–10.132 |
| Exported scripts individually | 0.984–9.825 |

The script freezes pass bounds before execution: restore / download 30 s, open 10 s, switch 5 s, import / each figure 120 s, owned-backend RSS 1,024 MB and final browser JS heap 256 MB. Observed backend peak polled RSS is 252.688 MB; final browser JS heap 11.639 MB / 2,597 DOM nodes. RSS samples only the explicitly owned backend process every 150 ms, excluding plotting children; JS heap is one final reading, not a browser-process peak. These are single-run local observations, not cross-device performance guarantees.

## Commands and retained evidence

Evidence directory: `~/qualicraft-review/ux-49/`. Screenshots cover 1 / 2 / 100 desktop, 100-document phone, real figure and relationship-source round trip.

- `python tools/e2e/capacity.py --url http://127.0.0.1:52755 --out /tmp/qualicraft-ux49/verified --backend-pid 60392` → 8 / 8, exit 0; `raw/capacity-verified.txt`, `verified/results.json`, `verified/reproduction/`.
- `python tools/e2e/capacity_network.py --url http://127.0.0.1:52755 --project 6024344e7925409a9ac319d7d8f0b4f3 --out /tmp/qualicraft-ux49/network` → source / return / unchanged project, exit 0; `raw/network.txt`, `network/results.json`.
- All 108 tracked website source files match the successful UX-47 isolated build; `raw/build-source-identity.json`. The workbench JS is served dynamically by the verified backend proxy. No application change in this capacity workflow justifies repeating the unchanged Python suite or rebuilding that same website source.

Early runs are retained. The first harness used ambiguous Cancel / Close selectors, assumed the inline overview was a modal, and read network `edges` instead of `links`. The second mistakenly compared the service-wide latest-backup indicator while checking an unchanged seed. Corrected checks compare the seed's snapshot **items**. These are harness errors, not product defects or a reason to change backup behavior. Final verification also reruns the five exported scripts and uses a neutral workload project name. No failure is silently deleted.

## Review entry and remaining scope

The clean demonstration project is **Bologna · supervisor report sample**, separate from technical load copies. It preserves all original source, codes and annotations and contains the explicit assistant-entered report acceptance draft. A final two-page Word sample is rendered and inspected; `ux-47/samples/research-report.docx`, `ux-47/word-sample/`, `ux-47/raw/curated-sample.json`. Open [the workbench](http://127.0.0.1:52755/w/?lang=en) → Export → Write / edit research report. Word edits remain external edits.

This supplies a bounded 1 / 2 / 100 load and recovery record. F09 is still broader: maximum-size / 50,000-coding stress, genuine bulk import, interruption during an in-flight write, process-crash recovery and real-device load are not tested here. It does not prove an unrestricted number of arbitrary interviews, native PDF / scanned input, scientific validity or research sufficiency. Comparative QCA implementation, persistent semantic codebook roles, figure embedding in the editable report, human / supervisor acceptance and publication gates remain open. The QCA brief is an implementation plan, not an available engine.
