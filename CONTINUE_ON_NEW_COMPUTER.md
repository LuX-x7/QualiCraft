# Continue QualiCraft on another computer

The public repository is:

https://github.com/LuX-x7/QualiCraft

## First setup

Install Python 3.11 or newer and Git, then run:

```powershell
git clone https://github.com/LuX-x7/QualiCraft.git
cd QualiCraft
```

The MVP uses Python's standard library. No `pip install` step is required for the core application.

## Start the local workspace

If the Guide folder and key file are available at the same paths:

```powershell
.\run.ps1 -Open
```

Otherwise provide the paths explicitly:

```powershell
python run.py --open `
  --guide-dir "D:\Research\Guide" `
  --api-key-file "D:\Secrets\API_key.txt" `
  --api-base "https://dashscope.aliyuncs.com/compatible-mode/v1" `
  --model "qwen3.8-flash"
```

Then open `http://127.0.0.1:8765`.

## What is intentionally not in GitHub

- `data/` and `*.sqlite3`: local projects, imported transcripts, memos, and review decisions.
- `reports/`: local model smoke-test outputs.
- API keys and `.env` files.
- The source Guide datasets, because their licenses and research-data handling must be reviewed before redistribution.

The server creates a fictional English demo project automatically when the local database is empty. Use the project dialog to import the TU Delft or Tian 2021 materials from a local Guide directory.

## Verification

```powershell
python -m unittest discover -s tests -v
node --check web/app.js
```

The Tian import creates an uncoded workspace for eight software-architecture practitioner interviews. IP1–IP2 pair Chinese answer passages with English translations; IP3–IP8 are in English. The parser recognizes `IQ...`, `Answer:`, and `IP1:`–`IP8:` labels.

## Current development state

The MVP includes the English three-panel coding workspace, exact Unicode source offsets, manual coding and memos, an AI suggestion review queue, Qwen-compatible cloud analysis with an explicit preview confirmation, JSON/CSV export, and TU Delft benchmark tooling. The next research-data task is a read-only importer for the Tian MAXQDA SQLite project, with researcher coding clearly separated from model suggestions.
