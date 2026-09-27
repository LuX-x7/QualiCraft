"""Explicit paid integration test using only fictional dialogue; never print credentials."""
import argparse
import json
import os
from pathlib import Path
import sys
import time

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from qualicraft.ai import Analyzer
from qualicraft.core import Store, synthetic_project, now


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--key-file", required=True)
    parser.add_argument("--base-url", required=True)
    parser.add_argument("--model", default="qwen3.8-flash")
    parser.add_argument("--output-dir", default="reports")
    parser.add_argument("--data-dir", default="data")
    args = parser.parse_args()
    os.environ["QUALICRAFT_API_KEY_FILE"] = args.key_file
    os.environ["QUALICRAFT_API_BASE"] = args.base_url
    os.environ["QUALICRAFT_MODEL"] = args.model
    store = Store(Path(args.data_dir) / "qualicraft.sqlite3")
    if not store.list():
        store.create(synthetic_project())
    p = synthetic_project()
    p["name"] = "Qwen 实测 · 虚构医患访谈"
    p["annotations"], p["suggestions"], p["audit"] = [], [], []
    p["provenance"] = "完全虚构的医患对话。此项目建议来自真实云模型调用；未发送患者或基准访谈数据。"
    store.create(p)
    analyzer = Analyzer(store)
    preview = analyzer.preview(p["id"], {"document_id": p["documents"][0]["id"], "scope": "patient", "mode": "deductive"})
    print(f"Starting {len(preview['requests'])} synthetic-only requests to {args.base_url}; model={args.model}", flush=True)
    job = analyzer.start(preview["id"])
    previous = -1
    while True:
        current = next(j for j in analyzer.list_jobs() if j["id"] == job["id"])
        if current["done"] != previous:
            print(f"Progress {current['done']}/{current['total']}; saved={current['saved']}; discarded={current['discarded']}", flush=True)
            previous = current["done"]
        if current["status"] != "running":
            break
        time.sleep(.5)
    # The worker records completion immediately after setting its terminal status.
    time.sleep(.2)
    result = store.get(p["id"])
    output = Path(args.output_dir)
    output.mkdir(parents=True, exist_ok=True)
    (output / "qwen-smoke-project.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    report = {"time": now(), "test": "fictional dialogue, four patient turns, deductive coding", "endpoint": args.base_url,
              "model": args.model, "job": current,
              "usage": [a["usage"] for a in result["audit"] if a["action"] == "analysis_segment"],
              "all_quotes_match": all(s["quote"] == p["documents"][0]["text"][s["start"]:s["end"]] for s in result["suggestions"]),
              "not_a_quality_benchmark": True}
    (output / "qwen-smoke-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"status": current["status"], "completed": current["done"], "suggestions": current["saved"], "error": current["error"], "all_quotes_match": report["all_quotes_match"]}, ensure_ascii=True), flush=True)
    return 0 if current["status"] == "completed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
