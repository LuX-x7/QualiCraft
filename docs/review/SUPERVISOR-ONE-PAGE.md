# QT Supervisor Review · 18 October 2026

**Status:** local review candidate, not final acceptance. Coding, source notebooks, five reproducible figures and method-specific research reports are available. Binary conservative Comparative QCA is implemented. The latest boundary audit found two unresolved P2 issues and a batch-upload gap. Windows is deferred and unverified. Nothing was pushed or deployed.

**Start:** [Website](http://127.0.0.1:52756/) → [Workbench](http://127.0.0.1:52756/w/?lang=en) → **Bologna · Comparative QCA review**. These links require the developer’s computer; hosted/public versions can be older. All reviewer material is public Bologna. Sample QCA memberships are explicit technical test designations, not empirical findings.

## Expected outputs

1. **Coded source notebook:** full text, highlights and actual Code / Category / Theme ancestry; editable Word and self-contained HTML. `tree-notebook` is the sample filename.
2. **Five figure bundles:** SVG, PDF, 300 dpi PNG, count CSV and Python recipe for each existing coding-data figure.
3. **Research report:** the common report family. TA / Content use evidence tables and narrative; Comparative adds calibration, truth tables, configurations and necessity/coverage. `qca-report` is its Comparative sample, not a second report required for every project. Original five-figure report and notebook samples are retained.
4. **Full project JSON:** the workspace recovery file, preserving calibration, retained runs, report versions and frozen assets. Word edits stay in Word.

## Demonstration · about 12 minutes

Import a disposable source → inspect highlighted coding and its tree → try reading marks and source jumps → inspect relationship evidence and the five figure/count/script bundles → open Insights → QCA workspace → review cases, mapped sources, explicit 0/1 rules, rationale and missing values → inspect frozen configurations/truth table → write and export the method-specific report. Reproduce a QCA ZIP with `python reproduce.py`; in a report ZIP run it inside `qca/`.

## Discuss and decide

Are the case unit, calibration rules and source evidence defensible? Does the report separate computed facts from authored interpretation? Does the source notebook support writing? The requested next presentation improvement is an explicit full method name and method-specific process map inside Method and decisions; the design is documented, not implemented.

**Latest evidence:** UX55 completed 42 boundary/browser checks, including forced process termination, 100-document sequential imports, missing-calibration recovery, project/snapshot restoration and independent execution of QCA plus five figure scripts. Desktop/phone-emulated normal console errors were zero. This is bounded technical evidence, not research or physical-device sign-off.

**Before final acceptance:** fix a snapshot that can be published before the SQLite commit, and add an explicit duplicate-import choice. Genuine multi-file upload remains unavailable. Implement the method/process presentation, rerun the final joint workflow, then obtain current physical-device/accessibility and researcher/supervisor acceptance. Wider maximum-load and power-loss claims are not made. See UX-55-INPUT-RECOVERY-ACCEPTANCE.md and REPORT-METHOD-FLOW-DESIGN.md. Local commits only; no release approval is implied.
