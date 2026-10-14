"""Encode timestamped CUA result captures into a three-second WebM and still.

Requires an explicit FFmpeg executable; uses only the Python standard library.
The recorder's JPEG hashes are checked before encoding. QA captures and the
receipt stay outside the repository; only accepted production media is copied
into website/public/clips/.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--ffmpeg", required=True)
    parser.add_argument("--receipt", type=Path, required=True)
    args = parser.parse_args()
    source = args.input.resolve()
    output = args.output.resolve()
    trace = json.loads((source / "trace.json").read_text(encoding="utf-8"))
    if trace["durationMs"] < 3000:
        raise ValueError("The real capture must cover at least three seconds")
    for state in (trace["before"], trace["after"]):
        if state["dialogs"] or state["han"] or state["blocked"]:
            raise ValueError("The recorded result has not passed its DOM checks")
    frames = trace["frames"]
    if len(frames) < 2:
        raise ValueError("A recording requires consecutive captures")
    lines = ["ffconcat version 1.0"]
    for index, frame in enumerate(frames):
        name = frame["file"]
        if not re.fullmatch(r"frame-\d{4}\.jpg", name) or sha256(source / name) != frame["sha256"]:
            raise ValueError("Source frame name or SHA-256 mismatch")
        end = frames[index + 1]["capturedAtMs"] if index + 1 < len(frames) else trace["durationMs"]
        duration = (end - frame["capturedAtMs"]) / 1000
        if duration <= 0:
            raise ValueError("Capture timestamps must increase")
        lines += [f"file '{name}'", f"duration {duration:.9f}"]
    lines.append(f"file '{frames[-1]['file']}'")
    concat = source / "frames.ffconcat"
    concat.write_text("\n".join(lines) + "\n", encoding="utf-8")
    output.parent.mkdir(parents=True, exist_ok=True)
    commands = [
        [args.ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-safe", "1",
         "-f", "concat", "-i", str(concat), "-vf", "fps=12,trim=duration=3,setpts=PTS-STARTPTS",
         "-an", "-pix_fmt", "yuv420p", "-c:v", "libvpx-vp9", "-lossless", "1", str(output)],
        [args.ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(output),
         "-frames:v", "1", str(output.with_suffix(".png"))],
    ]
    for command in commands:
        print("COMMAND:", json.dumps(command), flush=True)
        subprocess.run(command, check=True)
        print("EXIT_CODE: 0", flush=True)
    if output.stat().st_size > 1_500_000:
        raise ValueError("The accepted recording must be smaller than 1.5 MB")
    receipt = {
        "source_trace_sha256": sha256(source / "trace.json"),
        "source_frames": len(frames),
        "source_duration_ms": trace["durationMs"],
        "commands": commands,
        "outputs": [{"file": file.name, "bytes": file.stat().st_size, "sha256": sha256(file)}
                    for file in (output, output.with_suffix(".png"))],
    }
    args.receipt.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(receipt, indent=2))


if __name__ == "__main__":
    main()
