# QT Supervisor Review · 18 October 2026

**Status:** local review candidate, not final acceptance. Coding, source notebooks, five reproducible figures and method-specific research reports are available. Binary conservative Comparative QCA is implemented. UX56 fixes commit/snapshot recovery; UX57 adds an explicit duplicate-import choice; UX58 adds a resumable per-file import queue. Method/process presentation remains open. Windows is deferred and unverified. Nothing was pushed or deployed.

**Start:** [Website](http://127.0.0.1:52760/) → [Workbench](http://127.0.0.1:52760/w/?lang=en) → **Bologna · batch import review**. These links require the developer’s computer; hosted/public versions can be older. All reviewer material is public Bologna. Sample QCA memberships are explicit technical test designations, not empirical findings.

## Expected outputs

1. **Coded source notebook:** full text, highlights and actual Code / Category / Theme ancestry; editable Word and self-contained HTML. `tree-notebook` is the sample filename.
2. **Five figure bundles:** SVG, PDF, 300 dpi PNG, count CSV and Python recipe for each existing coding-data figure.
3. **Research report:** the common report family. TA / Content use evidence tables and narrative; Comparative adds calibration, truth tables, configurations and necessity/coverage. `qca-report` is its Comparative sample, not a second report required for every project. Original five-figure report and notebook samples are retained.
4. **Full project JSON:** the workspace recovery file, preserving calibration, retained runs, report versions and frozen assets. Word edits stay in Word.

## Demonstration · about 12 minutes

Select several disposable TXT/DOCX files → inspect progress/failure/retry → repeat a file and choose Cancel or Keep another copy → inspect highlighted coding and its tree → try reading marks and source jumps → inspect relationship evidence and the five figure/count/script bundles → open Insights → QCA workspace → review cases, mapped sources, explicit 0/1 rules, rationale and missing values → inspect frozen configurations/truth table → write and export the method-specific report. Reproduce a QCA ZIP with `python reproduce.py`; in a report ZIP run it inside `qca/`.

## Discuss and decide

Are the case unit, calibration rules and source evidence defensible? Does the report separate computed facts from authored interpretation? Does the source notebook support writing? The requested next presentation improvement is an explicit full method name and method-specific process map inside Method and decisions; the design is documented, not implemented.

**Latest evidence:** UX58 passes 270 Python tests (three existing environment skips), 231 Node tests and 58 desktop/phone-emulated browser checks, with zero normal console/HTTP/external-request errors. A real 100-file selection saves the 81 available slots in a 19-document Bologna copy and reports 19 separate capacity failures. Stop/close preserves saved files; refresh requires original-file reselection and checks extracted text. Lost-receipt retries do not create another copy. Browser queue history stores metadata only and warns if storage is unavailable. Direct Next build passes; statistics, plotting and original Word/ZIP samples are unchanged.

**Before final acceptance:** implement the method/process presentation, rerun the final joint workflow, then obtain current physical-device/accessibility and researcher/supervisor acceptance. Wider maximum-load and physical power-loss claims are not made. See UX-58-BATCH-IMPORT-QUEUE.md and REPORT-METHOD-FLOW-DESIGN.md. Existing notebook and report samples remain unchanged. Local commits only; Windows deferred, no push/deployment or release approval.
