# QualiCraft

QualiCraft is a small, English-language, researcher-led qualitative coding workspace. It runs as a local web application and stores projects in a local SQLite database. It is designed for interview and open-ended response work that needs traceable excerpts, a codebook, memos, reviewable AI suggestions, and simple document-by-code summaries.

The current release is a practical MVP. It is not a hosted multi-user service, a clinical decision tool, or a replacement for methodological judgment. Human researchers accept or reject every model suggestion before it becomes a formal coding.

## What is included

- Read-only transcript view with Unicode-safe character offsets.
- Manual coding by selecting a source passage, applying a code, and recording a memo.
- TXT and DOCX import without third-party Python packages.
- Deductive and inductive AI-assisted coding through an OpenAI-compatible chat endpoint.
- Qwen3.8-Flash defaults for Alibaba Cloud Model Studio (Beijing); other compatible endpoints can be configured.
- Exact quote validation: a model suggestion is discarded if its quote cannot be located unambiguously in the source.
- A review queue, accept/reject decisions, source highlighting, activity trail, and JSON/CSV export.
- A TU Delft QDA benchmark importer and a deliberately separate agreement evaluator.
- A Guide importer for eight Tian et al. (2021) semi-structured software-architecture interviews in Chinese and English.
- A fully fictional demonstration project that never calls a model.

## Quick start on Windows

The application uses Python's standard library. Python 3.11 or newer is recommended.

```powershell
cd QualiCraft
python run.py --open --guide-dir E:\Software\Guide
```

Open `http://127.0.0.1:8765`. The first launch creates a fictional demonstration project under `data/`. No network call is made at startup.

To use Qwen through Alibaba Cloud Model Studio, either configure it in **Model settings** or set environment variables before launch:

```powershell
$env:QUALICRAFT_API_BASE = "https://dashscope.aliyuncs.com/compatible-mode/v1"
$env:QUALICRAFT_MODEL = "qwen3.8-flash"
$env:QUALICRAFT_API_KEY_FILE = "E:\Software\API_key.txt"
python run.py --open --guide-dir E:\Software\Guide
```

The API key is read into server memory only. It is never placed in a project, browser storage, request preview, audit entry, or export. Do not commit `API_key.txt`.

The first model request is deliberately gated: the UI displays the exact text, context, codebook, endpoint, and model, and requires an explicit confirmation. Use de-identified material and follow your institution's ethics and data-processing requirements before sending any real patient or participant data to a cloud provider.

## Tests

```powershell
python -m unittest discover -s tests -v
node --check web/app.js
```

The tests cover Unicode offsets, CRLF text, overlapping codes, DOCX extraction, CSV formula injection, SQLite transaction rollback, request authentication, quote validation, project restore, and an OpenAI-compatible fake model server. Optional Guide tests read the TU Delft benchmark and Tian et al. grounded-theory examples when those folders exist.

For an explicit paid integration smoke test using only the fictional demo transcript:

```powershell
python tools/live_smoke.py `
  --key-file E:\Software\API_key.txt `
  --base-url https://dashscope.aliyuncs.com/compatible-mode/v1 `
  --model qwen3.8-flash
```

This writes only ignored local files under `reports/`. It is an interface smoke test, not a measure of coding quality.

## Benchmark and data provenance

The TU Delft material is not bundled in this repository. Point `--guide-dir` to the local Guide folder to create either a blind workspace (transcripts and codebook only) or a researcher-reference workspace (the exported researcher annotations). The source README identifies the dataset as van Gend and Zuiderwijk (2022), DOI `10.4121/19635147.v1`, CC BY 4.0.

The same project dialog can import `Grounded_Theory_Interview_Examples_Tian_2021` from the Guide directory. QualiCraft reads its eight DOCX interviews into an uncoded practice workspace and recognizes the collection's `IQ...`, `Answer:`, and `IP1:`–`IP8:` dialogue structure. These are practitioner interviews about relationships between software architecture and source code; IP1–IP2 pair Chinese answer passages with English translations, while IP3–IP8 are in English. The accompanying MAXQDA project is not automatically treated as ground truth.

The reference annotations are an interpretive comparison point, not a unique ground truth. Unselected text is not a negative label. Use interview-level holdouts and report agreement cautiously. The evaluator reports exact and overlap-based precision, recall, F1, and IoU matching; it does not establish clinical validity.

## Security boundaries

The local server binds to `127.0.0.1`, uses a per-process session token, rejects cross-site requests, does not log transcript content, and keeps model calls explicit. These protections are appropriate for a local prototype, not for exposing the process directly to the public internet.

Do not deploy the current server as a public website. A hosted edition needs a real identity provider, encrypted per-user storage, CSRF/session management, rate limits, provider key handling, audit retention, deletion/export workflows, backups, and a reviewed GDPR/ethics process. GitHub Pages can host documentation or a static demo, but it cannot safely run this Python backend or store private research projects.

## License

Code is released under the MIT License. Dataset rights and attribution remain with the respective source datasets; the TU Delft source is CC BY 4.0. Do not redistribute private interview material or API keys.
