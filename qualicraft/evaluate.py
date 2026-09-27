"""Reference agreement, never a claim of clinical validity or unique correct coding."""
import argparse
import json
from pathlib import Path

from .core import require


def iou(a, b):
    intersection = max(0, min(a["end"], b["end"]) - max(a["start"], b["start"]))
    union = a["end"] - a["start"] + b["end"] - b["start"] - intersection
    return intersection / union if union else 0.0


def evaluate(predictions, reference, threshold=0.5):
    require(0 < threshold <= 1, "IoU threshold must be in (0, 1]")
    def label(row):
        return (row["interview_id"], row["code_name"])
    edges = {i: sorted((j for j, r in enumerate(reference) if label(p) == label(r) and iou(p, r) >= threshold),
                       key=lambda j: iou(p, reference[j]), reverse=True) for i, p in enumerate(predictions)}
    # Maximum-cardinality bipartite matching: each reference/prediction counts at most once.
    owners = {}
    def match(i, seen):
        for j in edges[i]:
            if j in seen:
                continue
            seen.add(j)
            if j not in owners or match(owners[j], seen):
                owners[j] = i
                return True
        return False
    for i in edges:
        match(i, set())
    tp = len(owners)
    precision = tp / len(predictions) if predictions else 0.0
    recall = tp / len(reference) if reference else 0.0
    return {"predictions": len(predictions), "reference_applications": len(reference), "matched": tp,
            "precision": precision, "recall": recall, "f1": 2 * precision * recall / (precision + recall) if precision + recall else 0.0,
            "iou_threshold": threshold, "mean_iou_of_matching": sum(iou(predictions[i], reference[j]) for j, i in owners.items()) / tp if tp else None,
            "matching": "Maximum number of one-to-one matches; not a maximum-total-IoU optimization.",
            "unmatched_predictions": [p for i, p in enumerate(predictions) if i not in owners.values()],
            "unmatched_reference": [r for j, r in enumerate(reference) if j not in owners],
            "interpretation": "Agreement with one interpretive coding reference, not objective accuracy. Unselected source text is not a negative label."}


def from_project(project, source, interview):
    docs = {d["id"]: d.get("interview_id", d["name"]) for d in project["documents"]}
    codes = {c["id"]: c["name"] for c in project["codes"]}
    rows = project["suggestions"] if source == "model" else project["annotations"]
    rows = [r for r in rows if (r.get("source") == "model" if source == "model" else r.get("source") == "ai_reviewed")]
    return [{"interview_id": docs[r["document_id"]], "code_name": r["code_name"] if source == "model" else codes[r["code_id"]],
             "start": r["start"], "end": r["end"], "quote": r["quote"]} for r in rows if docs[r["document_id"]] == interview]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project", type=Path, required=True)
    parser.add_argument("--reference", type=Path, required=True)
    parser.add_argument("--interview", required=True, help="Explicitly scoped interview, e.g. I1")
    parser.add_argument("--source", choices=["model", "reviewed"], default="model")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    project = json.loads(args.project.read_text(encoding="utf-8-sig"))
    reference = [json.loads(line) for line in args.reference.read_text(encoding="utf-8").splitlines() if line.strip()]
    reference = [r for r in reference if r["interview_id"] == args.interview]
    require(reference, "No reference data found for this interview")
    predictions = from_project(project, args.source, args.interview)
    require(predictions, "No model predictions found; reference/demo/manual annotations are deliberately excluded")
    report = {"interview": args.interview, "source": args.source,
              "exact": evaluate(predictions, reference, 1.0), "overlap": evaluate(predictions, reference, 0.5)}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({k: {m: report[k][m] for m in ["precision", "recall", "f1", "matched"]} for k in ["exact", "overlap"]}, indent=2))


if __name__ == "__main__":
    main()
