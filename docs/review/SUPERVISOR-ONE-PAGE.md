# QT Supervisor Review · 18 October 2026

**Status:** local review candidate, not final acceptance. Coding, source notebooks, five reproducible figures and method-specific research reports are available. Binary conservative Comparative QCA is implemented. UX56 fixes commit/snapshot recovery; UX57 adds an explicit duplicate-import choice. True batch upload and method/process presentation remain open. Windows is deferred and unverified. Nothing was pushed or deployed.

**Start:** [Website](http://127.0.0.1:52758/) → [Workbench](http://127.0.0.1:52758/w/?lang=en) → **Bologna · duplicate import review**. These links require the developer’s computer; hosted/public versions can be older. All reviewer material is public Bologna. Sample QCA memberships are explicit technical test designations, not empirical findings.

## Expected outputs

1. **Coded source notebook:** full text, highlights and actual Code / Category / Theme ancestry; editable Word and self-contained HTML. `tree-notebook` is the sample filename.
2. **Five figure bundles:** SVG, PDF, 300 dpi PNG, count CSV and Python recipe for each existing coding-data figure.
3. **Research report:** the common report family. TA / Content use evidence tables and narrative; Comparative adds calibration, truth tables, configurations and necessity/coverage. `qca-report` is its Comparative sample, not a second report required for every project. Original five-figure report and notebook samples are retained.
4. **Full project JSON:** the workspace recovery file, preserving calibration, retained runs, report versions and frozen assets. Word edits stay in Word.

## Demonstration · about 12 minutes

Import a disposable source; repeat it and choose Cancel or Keep another copy → inspect highlighted coding and its tree → try reading marks and source jumps → inspect relationship evidence and the five figure/count/script bundles → open Insights → QCA workspace → review cases, mapped sources, explicit 0/1 rules, rationale and missing values → inspect frozen configurations/truth table → write and export the method-specific report. Reproduce a QCA ZIP with `python reproduce.py`; in a report ZIP run it inside `qca/`.

## Discuss and decide

Are the case unit, calibration rules and source evidence defensible? Does the report separate computed facts from authored interpretation? Does the source notebook support writing? The requested next presentation improvement is an explicit full method name and method-specific process map inside Method and decisions; the design is documented, not implemented.

**Latest evidence:** UX57 passes 263 Python tests (three existing environment skips), 209 Node tests, 18 desktop/phone-emulated import and site checks, five snapshot interface checks and an isolated production build. Duplicate warnings/cancel leave the saved project and snapshots unchanged; Keep creates one independent document. Concurrent submissions and lost-receipt retries do not create unintended copies. Normal browser console errors are zero. Statistics, plotting and original notebook/report samples are unchanged; phone checks are emulation.

**Before final acceptance:** implement the bounded multiple-file queue and the method/process presentation, rerun the final joint workflow, then obtain current physical-device/accessibility and researcher/supervisor acceptance. Wider maximum-load and physical power-loss claims are not made. See UX-57-DUPLICATE-IMPORT.md and REPORT-METHOD-FLOW-DESIGN.md. Existing notebook and report samples remain unchanged. Local commits only; Windows deferred, no push/deployment or release approval.
