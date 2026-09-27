# Guide data audit

This note records what is actually present under `E:\Software\Guide` and how QualiCraft should use it. It is based on direct inspection of every file type in the directory, with particular attention to the three Markdown files.

## Inventory

The Guide contains 29 files: 3 Markdown files, 10 DOCX files, 7 TXT transcripts, 2 JSON files, 2 JSONL files, and one each of CSV, XLSX, QDPX, MX18, and Python.

The three Markdown files serve different purposes:

- `研究计划.md` is a product requirements document. It describes an intended local-first architecture, an ATLAS.ti-style three-panel coding workspace, AI suggestion review, QDA interchange, and a later scientific plotting workbench.
- `两份压缩文件情况说明.md` is an informal explanation of the two example collections. It is useful for product direction, but several dataset descriptions are simplified and should not be treated as verified metadata.
- `Paired_Qualitative_Transcripts_TU_Delft\README.md` is the most precise dataset documentation. It includes provenance, license, exact offset rules, verified counts, and methodological limitations.

## TU Delft collection

`Paired_Qualitative_Transcripts_TU_Delft` is a verified qualitative coding comparison package derived from van Gend and Zuiderwijk (2022), DOI `10.4121/19635147.v1`, under CC BY 4.0.

- Seven interview transcripts are available as exact UTF-8 text.
- The codebook contains 54 researcher codes.
- There are 226 selected passages and 377 passage-code applications.
- Two selected passages have no code.
- Offsets use zero-based Python Unicode positions with an exclusive `end`; the actual fields are `start` and `end`, not `start_char` and `end_char`.
- Researcher coding is an interpretive reference. It is not a unique answer key, and unselected text is not a negative label.
- The accompanying study combines theory-driven labels with open, axial, and focused coding. It should not be described as a purely inductive grounded-theory dataset.

This collection is suitable for exact-offset validation, controlled-codebook experiments, reviewer comparison, and UI demonstrations. Its small size and single setting do not establish general model quality.

## Tian 2021 collection

`Grounded_Theory_Interview_Examples_Tian_2021` concerns practitioners' views of relationships between software architecture and source code. It is not a healthcare interview collection.

### Interview documents

The `Interview Transcripts` directory contains eight semi-structured interview documents, IP1 through IP8. The documents combine an interview instrument, demographic answers, prompts, and substantive participant responses.

- IP1 and IP2 contain 16 Chinese answer passages paired with 15–16 English translation passages.
- IP3 through IP8 contain English substantive responses.
- Questions use labels such as `IQ2.1.1:` and answers use labels such as `IP1:`. The demographic section also uses `Answer:`.
- These labels must be recognized when limiting model analysis to participant responses.

The documents are valid for DOCX import and multilingual qualitative-coding tests. They are not clinical or patient materials.

### Questionnaire workbook

`Valid Responses of the Questionnaire.xlsx` has one worksheet, 87 respondent rows, and 20 populated columns. It covers demographics and practitioner views about software architecture and source code. It includes free-text questions, an importance rating, and a contact-email column.

The workbook does not contain a general satisfaction score. It is not an eight-row table directly keyed to IP1–IP8. A case-level mixed-methods join must therefore use a documented linkage rather than row order or an assumed `IP` identifier. Contact emails must be excluded from application imports, model prompts, examples, logs, and exports unless a researcher explicitly needs and authorizes them.

### MAXQDA project

`Data Labeling & Encoding.mx18` has a SQLite 3 file signature and can be inspected programmatically in read-only mode. Its current logical contents include:

- 87 survey-response documents;
- 8 interview documents;
- 239 code nodes, of which 217 have at least one coding according to the current code table;
- 744 coding records: 597 on survey responses and 147 on the eight interview documents.

The file is therefore a useful researcher-coded source rather than an opaque binary that must be ignored. Importing it safely still requires a dedicated MAXQDA parser that reconstructs current-version rows, document text, code hierarchy, and segment positions. Its coding should remain a researcher reference, not be labeled ground truth.

## Corrections to simplified Guide claims

The following claims in the informal Markdown and PRD need qualification:

1. Tian's XLSX contains 87 survey responses, not a simple set of quantitative scores for eight interview participants.
2. The workbook has an importance item but no generic satisfaction variable.
3. IP1–IP8 cannot be joined to spreadsheet rows solely from the visible identifiers.
4. The MX18 project is readable as SQLite and contains extensive coding; it is not technically inaccessible to Python.
5. TU Delft JSONL uses `start` and `end` fields, with `end` exclusive.
6. Human coding in both collections is an interpretive reference rather than a “full-score answer.”
7. Claims such as GDPR-ready, zero data export, publication-ready figures, or automatic high-quality coding describe goals. They require implementation and validation before they can be presented as current product properties.

## Product use

QualiCraft currently uses the TU Delft collection for exact-offset reference and blind workspaces. It imports the eight Tian interview DOCX files as an uncoded multilingual workspace. The next data-integration step should be a read-only MX18 importer with explicit provenance, followed by a separately reviewed method for linking questionnaire cases to interview cases before any mixed-methods visualization is presented.
