"""
The motion spec, measured frame by frame.
============================================================================
The reference values are the ones in the brief (240 ms indicator travel on
cubic-bezier(0.22, 0.61, 0.36, 1); a 240 ms figure fade; a hero that drifts
continuously and evenly; the pixel mark assembled in 1.2–1.5 s, which is why
QtMark lays its cells down at 50 ms intervals: fourteen cells at 55 ms plus a
620 ms drop measured 1516 ms — outside the window — and 50 ms brings the whole
assembly to about 1350 ms, inside it). This tool
measures the built site against them and prints the comparison table. A
difference beyond ±20 ms or ±10 % has to be explained, not waved at — there
is deliberately no "looks about right" verdict in the output.

    python tools/motion/measure.py --url http://127.0.0.1:4418 \
        --out ~/qualicraft-review/motion

Method
------
A CDP screencast records the page while the measured transition runs. Frames
arrive at the compositor's own rate carrying a true capture timestamp; they
are binned to 24 fps — the reference's rate — for the recording artifact, but
the measurement uses the real timestamps, so nothing is quantised to 40 ms
the way a 24 fps reading alone would be.

Positions come from the pixels, not from the DOM: the indicator is found in
each frame as the accent-coloured blob in a narrow strip beside the chapter
list, located to a fraction of a pixel by intensity weighting. The series is
then fitted to the analytic cubic-bezier over a grid of durations and start
offsets, which yields both the duration and how far the curve itself sits
from the reference easing. Layout probes (where a strip begins, how big a
region is) are reads, taken once, before the motion starts.
"""
from __future__ import annotations

import argparse
import base64
import io
import json
import math
import sys
import time
from pathlib import Path

import numpy as np
from PIL import Image

# ---------------------------------------------------------------------------
# the reference, and the tolerance
# ---------------------------------------------------------------------------

REFERENCE = {
    "indicator": {"duration_ms": 240.0, "easing": (0.22, 0.61, 0.36, 1)},
    "figure_fade": {"duration_ms": 240.0, "easing": (0.0, 0.0, 0.58, 1.0)},
    "hero_mark": {"duration_ms": 1400.0, "window_ms": (1200.0, 1500.0)},
    "hero_ground": {"px_per_second": 24.0 / 26.0, "behaviour": "uniform, low amplitude"},
}
TOLERANCE_MS = 20.0
TOLERANCE_FRACTION = 0.10
FPS = 24
FRAME_MS = 1000.0 / FPS


# ---------------------------------------------------------------------------
# cubic-bezier, solved rather than sampled
# ---------------------------------------------------------------------------

def bezier_axis(t: float, a: float, b: float) -> float:
    """One axis of the cubic with control points 0, a, b, 1 at parameter t."""
    u = 1.0 - t
    return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t


def bezier_axis_prime(t: float, a: float, b: float) -> float:
    u = 1.0 - t
    return 3 * u * u * a + 6 * u * t * (b - a) + 3 * t * t * (1 - b)


def ease(progress: float, curve: tuple[float, float, float, float]) -> float:
    """The CSS timing-function value at progress (0..1)."""
    x1, y1, x2, y2 = curve
    lo, hi = 0.0, 1.0
    t = progress
    for _ in range(60):
        x = bezier_axis(t, x1, x2)
        if abs(x - progress) < 1e-9:
            break
        if x < progress:
            lo = t
        else:
            hi = t
        t = 0.5 * (lo + hi)
    return bezier_axis(t, y1, y2)


# ---------------------------------------------------------------------------
# frame capture
# ---------------------------------------------------------------------------

class Screencast:
    """Frames from the page, each with its true capture timestamp."""

    def __init__(self, page):
        self.page = page
        self.frames: list[tuple[float, bytes]] = []
        self._cdp = page.context.new_cdp_session(page)

    def __enter__(self):
        self._cdp.on("Page.screencastFrame", self._on_frame)
        self._cdp.send("Page.startScreencast",
                       {"format": "jpeg", "quality": 82, "everyFrame": True,
                        "maxWidth": 1440, "maxHeight": 900})
        return self

    def __exit__(self, *exc):
        try:
            self._cdp.send("Page.stopScreencast")
        except Exception:
            pass
        return False

    def _on_frame(self, event: dict):
        # Every frame must be acknowledged or the capture stops after one.
        try:
            self._cdp.send("Page.screencastFrameAck", {"sessionId": event["sessionId"]})
        except Exception:
            return
        # Two clocks, on purpose. The receipt time aligns with the scroll
        # marker the measurements take with time.monotonic(); the capture's own
        # CDP timestamp carries the true interval between frames. Using the
        # receipt clock for the intervals measured one transition at 180 ms and
        # the same page at 288 ms on a neighbouring run: frames delivered in
        # one batch arrive with nearly identical receipt times, and the fit
        # read that compression as the animation's speed.
        self.frames.append((time.monotonic(),
                            event.get("metadata", {}).get("timestamp"),
                            base64.b64decode(event["data"])))


def decode(jpeg: bytes) -> np.ndarray:
    return np.asarray(Image.open(io.BytesIO(jpeg)).convert("RGB"), dtype=np.int16)


def save(frame: bytes, path: Path):
    path.write_bytes(frame)


# ---------------------------------------------------------------------------
# measurement helpers
# ---------------------------------------------------------------------------

def normalise(frames):
    """Decode every frame and crop to the smallest common size.

    A screencast's first frames can be smaller than the viewport while the
    page is still laying out; cropping all frames to the same top-left box
    keeps the regions comparable without resampling.
    """
    arrays = [decode(row[2]) for row in frames]
    height = min(a.shape[0] for a in arrays)
    width = min(a.shape[1] for a in arrays)
    return [(row[0], row[1], a[:height, :width, :]) for row, a in zip(frames, arrays)]


def accent_strip_centroid(arr: np.ndarray, x0: int, x1: int,
                          near: float | None) -> tuple[float, float] | None:
    """The y of the accent-coloured blob in the strip [x0, x1).

    Returns (y, strength). `near` biases the choice towards the blob closest
    to the previous detection, so a stray accent pixel cannot steal the
    track. Sub-pixel by intensity weighting inside the blob's rows.
    """
    region = arr[:, x0:x1, :]
    distance = (np.abs(region[:, :, 0] - 0x4B)
                + np.abs(region[:, :, 1] - 0x60)
                + np.abs(region[:, :, 2] - 0x7C))
    # The grey of the TOC's own 'Contents' kicker sits close to the accent in
    # absolute terms and would otherwise be tracked instead of the indicator:
    # the accent is the bluer of the two, so blueness is required as well as
    # nearness.
    blue = region[:, :, 2] - region[:, :, 1]
    mask = (distance < 110) & (blue > 15)
    if not mask.any():
        return None
    weight = (110 - distance) * mask
    rows = weight.sum(axis=1)
    ys = np.nonzero(rows > 6)[0]
    if not len(ys):
        return None
    # group rows into runs, keep the run nearest the prediction
    groups: list[list[int]] = []
    for y in ys:
        if groups and y - groups[-1][-1] <= 2:
            groups[-1].append(y)
        else:
            groups.append([y])
    best, best_key = None, None
    for group in groups:
        total = rows[group].sum()
        centre = float((np.array(group) * rows[group]).sum() / total)
        key = abs(centre - near) if near is not None else -total
        if best_key is None or key < best_key:
            best_key, best = key, (centre, total)
    return best


def longest_monotonic_run(values: list[float]) -> tuple[int, int]:
    """The longest contiguous run that moves one way.

    A scroll jumps the whole viewport before the transition runs, so the
    measured series is a step followed by a ramp: the ramp is the transition,
    the step is the scroll. The step would otherwise be fitted as part of the
    travel and the duration would come out short. Returns [start, end).
    """
    best_start = best_end = 0
    start = 0
    rising = None
    for i in range(1, len(values)):
        if values[i] == values[i - 1]:
            continue
        direction = values[i] > values[i - 1]
        if rising is None or direction != rising:
            rising, start = direction, i - 1
        if i + 1 - start > best_end - best_start:
            best_start, best_end = start, i + 1
    if best_end - best_start < 3:
        return 0, len(values)
    return best_start, best_end


def fit_motion(times: list[float], positions: list[float],
               curve: tuple[float, float, float, float],
               search_ms: int = 450) -> dict:
    """Fit the analytic curve to the measured series.

    The fit is made on the longest monotonic run — the transition itself —
    with that run's own endpoints, and the jump a scroll makes in the
    viewport is left out of it. Returns the duration, the start offset, the
    residual and the largest per-frame deviation, all in the units the table
    prints.
    """
    t_all = np.asarray(times, dtype=float)
    p_all = np.asarray(positions, dtype=float)
    if len(p_all) < 4:
        return {"duration_ms": None, "reason": "too few frames tracked"}
    a, b = longest_monotonic_run(positions)
    t, p = t_all[a:b], p_all[a:b]
    p0, p1 = float(p[0]), float(p[-1])
    span = p1 - p0
    if abs(span) < 2:
        return {"duration_ms": None, "reason": "the indicator did not travel"}
    progress = (p - p0) / span
    best = None
    # The grid has to be wider than the answer: an earlier version searched
    # 180-450 ms, and a 240 ms transition then reported 180 ms because the
    # optimum sat on the grid's own lower edge.
    for duration in np.arange(40.0, 600.0, 0.5):
        for start in np.arange(t[0] - 4 * FRAME_MS, t[0] + 4 * FRAME_MS, FRAME_MS / 4):
            expected = np.array([ease(max(0.0, min(1.0, (ti - start) / (duration / 1000.0))), curve)
                                 for ti in t])
            residual = float(np.sqrt(((expected - progress) ** 2).mean()))
            if best is None or residual < best["residual"]:
                best = {"duration_ms": float(duration), "start_ms": float(start),
                        "residual": residual,
                        "max_dev_px": float(np.max(np.abs(expected - progress)) * abs(span))}
    # the observed travel, from the run the fit used: the first frame that has
    # left the start to the last that has not quite reached the end, and the
    # 10-90% rise that needs no curve at all
    left = next((i for i in range(len(p)) if abs(p[i] - p0) > 0.5), 0)
    arrived = next((i for i in range(len(p) - 1, -1, -1) if abs(p[i] - p1) > 0.5), len(p) - 1)
    lo = next((i for i in range(len(p)) if abs(p[i] - p0) > 0.1 * abs(span)), 0)
    hi = next((i for i in range(len(p) - 1, -1, -1) if abs(p[i] - p1) > 0.1 * abs(span)), len(p) - 1)
    best["observed_travel_ms"] = (t[arrived] - t[left]) * 1000.0
    best["rise_10_90_ms"] = (t[hi] - t[lo]) * 1000.0
    best["travel_px"] = abs(span)
    best["run"] = {"frames": int(b - a), "of": int(len(p_all)),
                   "t_ms": [round((x - t[0]) * 1000, 1) for x in t],
                   "y_px": [round(v, 2) for v in p]}
    return best


def luminance_trace(frames: list[tuple[float, np.ndarray]], box: tuple[int, int, int, int]):
    """Mean luminance inside a region, per frame."""
    x, y, w, h = box
    return [(row[1], float(row[2][y:y + h, x:x + w, :].mean())) for row in frames
            if isinstance(row[1], (int, float))]


def fit_fade(trace: list[tuple[float, float]], curve) -> dict:
    """Fit an opacity ramp (luminance) the same way the indicator is fitted."""
    t = np.array([row[0] for row in trace], dtype=float)
    v = np.array([row[1] for row in trace], dtype=float)
    v0, v1 = float(np.percentile(v, 5)), float(np.percentile(v, 95))
    if v1 - v0 < 1.0:
        return {"duration_ms": None, "reason": "no visible change in the region"}
    # The ramp runs whichever way the region's brightness runs: a figure that
    # is darker than the paper it fades in over makes the luminance fall, and
    # the progress has to rise all the same. Without this the curve would be
    # fitted to a mirror of itself and the duration would come out nonsense.
    falling = float(np.mean(v[: max(2, len(v) // 6)])) > float(np.mean(v[-max(2, len(v) // 6):]))
    opacity = np.clip(((v1 - v) if falling else (v - v0)) / (v1 - v0), 0, 1)
    best = None
    for duration in np.arange(40.0, 600.0, 0.5):
        for start in np.arange(t[0] - 0.1, t[0] + 0.15, FRAME_MS / 4 / 1000.0):
            expected = np.array([ease(max(0.0, min(1.0, (ti - start) / (duration / 1000.0))), curve)
                                 for ti in t])
            residual = float(np.sqrt(((expected - opacity) ** 2).mean()))
            if best is None or residual < best["residual"]:
                best = {"duration_ms": float(duration), "residual": residual}
    # The 10-90% rise is the reading that does not depend on the curve: how
    # long the region took to get from a tenth of the way to nine tenths of
    # the way between its two plateaus. Reported beside the fit, not instead
    # of it.
    lo = next((i for i in range(len(v)) if opacity[i] > 0.10), 0)
    hi = next((i for i in range(len(v) - 1, -1, -1) if opacity[i] < 0.90), len(v) - 1)
    best["rise_10_90_ms"] = (t[hi] - t[lo]) * 1000.0
    best["contrast"] = v1 - v0
    return best


def drift_shift(frames: list[tuple[float, np.ndarray]], box: tuple[int, int, int, int],
                search: int = 8) -> list[tuple[float, float, float]]:
    """The ground's drift, measured as a pixel shift per frame.

    Each settled frame is matched against the first by the whole-pixel shift
    that makes them agree best, refined to a fraction of a pixel by a
    parabola through the three shifts around the best one. A grid drifting
    at a constant rate shows up as a straight line of shifts against time;
    anything else — a jump, a stall, an easing — shows up as a bend. Returns
    (seconds, shift_x, shift_y) per frame.
    """
    if len(frames) < 3:
        return []
    x, y, w, h = box
    t0 = frames[0][0]
    ref = frames[0][1][y:y + h, x:x + w, :].astype(np.float32)
    rows: list[tuple[float, float, float]] = [(0.0, 0.0, 0.0)]

    def cost(dx: int, dy: int) -> float:
        # the overlap when ref is moved by (dx, dy) against cur, in ref's
        # own coordinates; cur's matching window is that box moved back
        x0, x1 = max(0, dx), min(w, w + dx)
        y0, y1 = max(0, dy), min(h, h + dy)
        a = ref[y0:y1, x0:x1, :]
        b = cur[y0 - dy:y1 - dy, x0 - dx:x1 - dx, :]
        if a.size == 0 or a.shape != b.shape:
            return 1e9
        return float(np.abs(a - b).mean())

    for i in range(1, len(frames)):
        cur = frames[i][1][y:y + h, x:x + w, :].astype(np.float32)
        scores = {}
        for dy in range(-search, search + 1):
            for dx in range(-search, search + 1):
                scores[(dx, dy)] = cost(dx, dy)
        (bx, by) = min(scores, key=scores.get)
        # sub-pixel: a parabola through the best and its two neighbours on
        # each axis, which is where the minimum of a smooth cost surface sits
        def refine(axis: str) -> float:
            centre = scores[(bx, by)]
            if axis == "x":
                left, right = scores.get((bx - 1, by), centre), scores.get((bx + 1, by), centre)
                base = bx
            else:
                left, right = scores.get((bx, by - 1), centre), scores.get((bx, by + 1), centre)
                base = by
            denom = left - 2 * centre + right
            if denom == 0:
                return float(base)
            return base + 0.5 * (left - right) / denom

        rows.append((frames[i][0] - t0, refine("x"), refine("y")))
    return rows


def drift_trace(frames: list[tuple[float, np.ndarray]], box: tuple[int, int, int, int]):
    """Per-second change of a region: continuity and amplitude in one series.

    Kept for the record: a screencast delivers frames when the page changes
    and not on a fixed clock, so an unnormalised per-frame delta measures the
    frame cadence alongside the motion. The shift measurement above is the
    one the table reads.
    """
    x, y, w, h = box
    values = []
    for row in frames:
        values.append((row[1], row[2][y:y + h, x:x + w, :].astype(np.float32)))
    deltas = []
    for (t_prev, prev), (t_now, now) in zip(values, values[1:]):
        dt = max(t_now - t_prev, 1e-6)
        deltas.append((dt, float(np.abs(now - prev).mean()) / dt,
                       float(np.abs(now - prev).max()) / dt))
    return deltas


# ---------------------------------------------------------------------------
# the four measurements
# ---------------------------------------------------------------------------

def measure_indicator(page, out: Path) -> dict:
    """The chapter indicator's travel: duration and easing, from pixels."""
    page.goto(page_url + "/report", wait_until="load", timeout=60000)
    page.wait_for_timeout(1200)
    layout = page.evaluate("""() => {
      const inner = document.querySelector('.report-toc-inner')
      const ind = document.querySelector('.toc-indicator')
      const items = [...document.querySelectorAll('.toc-item')]
      const rect = (el) => { const r = el.getBoundingClientRect(); return {left: r.left, top: r.top, width: r.width, height: r.height} }
      const box = rect(inner)
      return { strip: [Math.round(box.left), Math.round(box.left) + 18],
               last_id: items[items.length - 1]?.querySelector('a')?.getAttribute('href'),
               travel_expect: Math.abs(rect(ind).top - rect(items[items.length - 1]).top) }
    }""")
    x0, x1 = layout["strip"]
    target = layout["last_id"].lstrip("#")
    dom_before = page.evaluate(
        "() => { const ind = document.querySelector('.toc-indicator');"
        " window.__motion = { start: null, end: null };"
        " ind.addEventListener('transitionstart', () => {"
        "   if (window.__motion.start === null) window.__motion.start = performance.now(); },"
        "   { once: true });"
        " ind.addEventListener('transitionend', () => { window.__motion.end = performance.now(); },"
        "   { once: true });"
        " return { top: ind.style.top, rect: ind.getBoundingClientRect().top,"
        "          current: document.querySelector('.toc-item.is-current .toc-title')?.textContent }; }")
    with Screencast(page) as cap:
        page.wait_for_timeout(700)
        scrolled_at = time.monotonic()
        page.evaluate("(id) => document.getElementById(id).scrollIntoView({block:'start'})", target)
        page.wait_for_timeout(900)
    frames = list(cap.frames)
    dom_after = page.evaluate(
        "() => { const ind = document.querySelector('.toc-indicator');"
        " const m = window.__motion || {};"
        " return { top: ind.style.top, rect: ind.getBoundingClientRect().top,"
        "          current: document.querySelector('.toc-item.is-current .toc-title')?.textContent,"
        "          transition_ms: (m.start !== null && m.end !== null) ? m.end - m.start : null }; }")
    times: list[float] = []
    positions: list[float] = []
    near = None
    rows = normalise(frames)
    stamps = [row[1] for row in rows if isinstance(row[1], (int, float))]
    base_capture = min(stamps) if stamps else None
    for receipt, capture, arr in rows:
        found = accent_strip_centroid(arr, x0, x1, near)
        if found:
            near = found[0]
            times.append((capture - base_capture) if base_capture is not None else receipt)
            positions.append(found[0])
    if len(times) < 4:
        return {"name": "indicator", "ok": False, "reason": "the blob was not tracked"}
    fit = fit_motion(times, positions, REFERENCE["indicator"]["easing"])
    fit["series"] = {"t_ms": [round((t - times[0]) * 1000, 1) for t in times],
                     "y_px": [round(v, 2) for v in positions]}
    fit.update({
        "name": "indicator",
        "ok": True,
        "reference_ms": REFERENCE["indicator"]["duration_ms"],
        "easing": list(REFERENCE["indicator"]["easing"]),
        "frames_tracked": len(times),
        "strip": [x0, x1],
        "expected_travel_px": round(layout["travel_expect"], 1),
        "dom_before": dom_before,
        "dom_after": dom_after,
        "transition_ms": (dom_after or {}).get("transition_ms"),
    })
    for label, index in (("first", 0), ("mid", len(frames) // 2), ("last", len(frames) - 1)):
        save(frames[index][2], out / f"indicator-{label}.jpg")
    return fit


def measure_figure_fade(page, out: Path) -> dict:
    """The figure's fade: a single 240 ms ease-out, from the pixels.

    The figure's document offset is read first, so the scroll that brings it
    into view can be an exact jump: the figure lands at a known place in the
    viewport, the box is measured after the fade has settled, and the trace
    is fitted from the frames that follow the scroll.
    """
    offset = page.evaluate("""() => {
      const figs = [...document.querySelectorAll('figure.fig')]
      const fig = figs.find(f => f.getBoundingClientRect().top > window.innerHeight)
      if (!fig) return null
      const img = fig.querySelector('img')
      // Decode the image before the capture. A lazy image decodes as it
      // enters the viewport, and its arrival would be measured as part of the
      // fade; the fade is the only thing this reading is about, so the image
      // is already there when the fade starts.
      if (img) img.loading = 'eager'
      return { id: fig.id, offset_top: fig.offsetTop, eager: Boolean(img) }
    }""")
    if not offset:
        return {"name": "figure_fade", "ok": False, "reason": "no figure below the fold"}
    page.wait_for_timeout(900)
    with Screencast(page) as cap:
        page.wait_for_timeout(400)
        scrolled_at = time.monotonic()
        page.evaluate("(o) => window.scrollTo(0, o)", offset["offset_top"] - 520)
        page.wait_for_timeout(1200)
    frames = list(cap.frames)
    # The image region, now that the image is decoded: the fade is the
    # element's opacity going 0 to 1, so the region's luminance walks from the
    # paper colour to the figure's, and nothing else arrives to bend it.
    box = page.evaluate("""(o) => {
      const fig = document.getElementById(o.id)
      const img = fig.querySelector('img')
      const r = img.getBoundingClientRect()
      return [Math.round(r.left) + 60, Math.round(r.top) + 60,
              Math.max(120, Math.round(r.width) - 120), Math.max(80, Math.round(r.height) - 120)]
    }""", offset)
    rows = normalise(frames)
    # the receipt clock decides which frames belong to the fade; the capture
    # clock is the time axis the fit is made on
    measured = luminance_trace(rows, tuple(box))
    trace = [(capture, value)
             for (receipt, capture, _arr), (_c, value) in zip(rows, measured)
             if receipt >= scrolled_at - 0.05]
    fit = fit_fade(trace, REFERENCE["figure_fade"]["easing"])
    fit["series"] = {"t_ms": [round((t - trace[0][0]) * 1000, 1) for t, _ in trace],
                     "luminance": [round(v, 2) for _, v in trace]}
    fit.update({"name": "figure_fade", "ok": True,
                "reference_ms": REFERENCE["figure_fade"]["duration_ms"],
                "easing": list(REFERENCE["figure_fade"]["easing"]),
                "box": box, "figure": offset["id"], "region": "the image, decoded first"})
    save(frames[len(frames) // 2][2], out / "figure-fade-mid.jpg")
    return fit


def measure_hero(page, out: Path) -> tuple[dict, dict]:
    """The hero in one recording: the mark assembling, the ground drifting.

    The capture starts before the navigation, because the mark's assembly is
    part of the page load and a later start would find it already built.
    """
    with Screencast(page) as cap:
        page.goto(page_url + "/?lang=en", wait_until="load", timeout=60000)
        page.wait_for_timeout(2800)
    frames = list(cap.frames)
    arrays = normalise(frames)
    # the ground's motion is measured only after the page has settled: the
    # opening frames are the page painting (fonts swapping, the mark dropping
    # in), which is loading, not drifting
    # Seconds, not milliseconds: over a span this long the capture clock
    # proved unreliable — it read 0.48 px/s for an animation that moves
    # 0.92 px/s, exactly half, while the receipt clock read 0.93, 0.94 and
    # 0.96 on three runs. The drift is therefore measured on the receipt
    # clock; the sub-second fits use the capture clock, where the receipt
    # clock was the unreliable one.
    drifting = [(row[0], row[2]) for row in arrays if row[0] >= arrays[0][0] + 1.8]

    box = page.evaluate("""() => {
      const mark = document.querySelector('.hero__title .qtmark') || document.querySelector('.qtmark')
      if (!mark) return null
      const r = mark.getBoundingClientRect()
      return [Math.round(r.left) - 2, Math.round(r.top) - 2, Math.round(r.width) + 4, Math.round(r.height) + 4]
    }""")
    x, y, w, h = box
    counts, times = [], []
    for receipt, capture, arr in arrays:
        # a screencast's first frames are the blank page before first paint;
        # they carry no mark, and counting them would make the assembly look
        # instantaneous
        if arr.mean() < 200:
            continue
        counts.append(int((arr[y:y + h, x:x + w, :].sum(axis=2) < 380).sum()))
        times.append(capture if isinstance(capture, (int, float)) else receipt)
    counts = np.array(counts, dtype=float)
    if counts.max() <= 0:
        mark = {"name": "hero_mark", "ok": False, "reason": "no mark pixels seen"}
    else:
        filled = counts >= counts.max() * 0.98
        first = int(np.argmax(counts > counts.max() * 0.05))
        settled_at = int(np.argmax(filled))
        duration_ms = (times[settled_at] - times[first]) * 1000.0 if settled_at > first else None
        mark = {"name": "hero_mark", "ok": duration_ms is not None,
                "reference_ms": REFERENCE["hero_mark"]["duration_ms"],
                "window_ms": list(REFERENCE["hero_mark"]["window_ms"]),
                "measured_ms": duration_ms,
                "blocks_seen": int(counts.max()),
                "first_to_settled_frames": settled_at - first,
                "total_frames": len(frames)}
        mark["series"] = {"t_ms": [round((t - times[0]) * 1000, 1) for t in times],
                          "dark_px": [int(c) for c in counts]}
        save(frames[min(first + 2, len(frames) - 1)][2], out / "hero-mark-early.jpg")
        save(frames[-1][2], out / "hero-mark-done.jpg")

    # The element's transform, read over a longer window than the frames can
    # cover: see the printer for why both readings are kept.
    transform = page.evaluate(
        "async () => { const g = document.querySelector('.hero__ground');"
        " if (!g) return null;"
        " const read = () => new DOMMatrixReadOnly(getComputedStyle(g).transform).m41;"
        " const a = read(); const t0 = performance.now();"
        " await new Promise(r => setTimeout(r, 4000));"
        " const b = read(); const t1 = performance.now();"
        " return { rate_px_per_s: (b - a) / ((t1 - t0) / 1000), window_s: (t1 - t0) / 1000 }; }")

    ground_box = (1000, 120, 400, 300)
    shifts = drift_shift(drifting, ground_box)
    if len(shifts) >= 4:
        ts = np.array([row[0] for row in shifts])
        sx = np.array([row[1] for row in shifts])
        sy = np.array([row[2] for row in shifts])
        # a straight line through the shifts is what a constant rate is
        # the shifts say how far the first frame must move to match a later
        # one; the content itself moves the other way, so the reported rate is
        # the content's
        rate_x = -float(np.polyfit(ts, sx, 1)[0])
        rate_y = -float(np.polyfit(ts, sy, 1)[0])
        resid_x = float(np.std(sx - np.polyval(np.polyfit(ts, sx, 1), ts)))
        resid_y = float(np.std(sy - np.polyval(np.polyfit(ts, sy, 1), ts)))
        ground = {
            "name": "hero_ground", "ok": True,
            "reference_px_per_s": REFERENCE["hero_ground"]["px_per_second"],
            "rate_x_px_per_s": round(rate_x, 3),
            "rate_y_px_per_s": round(rate_y, 3),
            "rate_px_per_s": round((rate_x + rate_y) / 2, 3),
            "transform_rate_px_per_s": round((transform or {}).get("rate_px_per_s") or 0.0, 3),
            "transform_window_s": round((transform or {}).get("window_s") or 0.0, 1),
            "linearity_resid_px": round(max(resid_x, resid_y), 3),
            "seconds_measured": round(float(ts[-1] - ts[0]), 2),
            "frames": len(shifts),
            "series": {"t_s": [round(float(t), 2) for t in ts],
                       "shift_x": [round(float(v), 2) for v in sx],
                       "shift_y": [round(float(v), 2) for v in sy]},
        }
    else:
        ground = {"name": "hero_ground", "ok": False,
                  "reason": f"only {len(shifts)} settled frames"}
    save(frames[0][2], out / "hero-ground-first.jpg")
    save(frames[-1][2], out / "hero-ground-last.jpg")
    return mark, ground


# ---------------------------------------------------------------------------
# the table
# ---------------------------------------------------------------------------

def verdict(measured: float | None, reference: float, tolerance_ms: float,
            tolerance_fraction: float) -> str:
    if measured is None:
        return "EXPLAIN"
    allowed = max(tolerance_ms, abs(reference) * tolerance_fraction)
    return "PASS" if abs(measured - reference) <= allowed else "EXPLAIN"


def print_table(rows: list[dict]) -> None:
    print()
    print(f"{'measurement':<16}{'reference':<22}{'measured':<24}{'difference':<14}verdict")
    print("-" * 92)
    for row in rows:
        if not row.get("ok", True) and "reason" in row:
            print(f"{row['name']:<16}{'—':<22}{row['reason']:<24}{'—':<14}EXPLAIN")
            continue
        if row["name"] == "indicator":
            # Three readings of one transition. The fit is the curve-shape
            # check and is the noisiest of the three (its optimum runs along a
            # flat valley: a slightly longer duration starting slightly later
            # fits almost as well); the page's own transitionstart/end pair is
            # exact; the frames' observed travel is what a person sees. The
            # verdict uses the page's reading and prints the other two beside
            # it, so the spread is visible rather than smoothed over.
            exact = row.get("transition_ms")
            measured = (f"{row['duration_ms']:.0f} ms fit, "
                        f"{row.get('observed_travel_ms', 0):.0f} ms travel, "
                        f"{(f'{exact:.0f} ms page' if exact else 'page n/a')}")
            if exact:
                difference = f"{exact - row['reference_ms']:+.0f} ms"
                ok = verdict(exact, row["reference_ms"], TOLERANCE_MS, TOLERANCE_FRACTION)
            else:
                difference = f"{row['duration_ms'] - row['reference_ms']:+.0f} ms"
                ok = verdict(row["duration_ms"], row["reference_ms"],
                             TOLERANCE_MS, TOLERANCE_FRACTION)
        elif row["name"] == "figure_fade":
            measured = (f"{row['duration_ms']:.0f} ms fit, "
                        f"{row.get('rise_10_90_ms', 0):.0f} ms 10–90%")
            difference = f"{row['duration_ms'] - row['reference_ms']:+.0f} ms"
            ok = verdict(row["duration_ms"], row["reference_ms"],
                         TOLERANCE_MS, TOLERANCE_FRACTION)
        elif row["name"] == "hero_mark":
            if row.get("measured_ms") is None:
                measured = f"not settled ({row.get('reason', 'no reason recorded')})"
                ok, difference = "EXPLAIN", "—"
            else:
                measured = f"{row['measured_ms']:.0f} ms"
                window = row["window_ms"]
                ok = "PASS" if window[0] <= row["measured_ms"] <= window[1] else "EXPLAIN"
                difference = f"{row['measured_ms'] - row['reference_ms']:+.0f} ms"
        else:  # hero_ground
            # Two readings, because they disagree and the disagreement is the
            # pixel method's, not the page's: the pattern is faint and
            # periodic, and a couple of seconds of drift is under two pixels,
            # which is at the edge of what whole-pixel correlation can
            # resolve. The element's transform is read over a longer window
            # and is the reading the verdict uses; the pixel rate is printed
            # beside it as the method's error bar.
            rate = row.get("transform_rate_px_per_s") or 0.0
            measured = (f"transform {rate:.3f} px/s, pixels "
                        f"{row['rate_px_per_s']:.2f} px/s, "
                        f"linear ±{row['linearity_resid_px']:.2f} px")
            reference = row["reference_px_per_s"]
            ok = ("PASS" if abs(rate - reference) <= max(0.2, reference * 0.1)
                  and row["linearity_resid_px"] <= 0.5 else "EXPLAIN")
            difference = f"{rate - reference:+.3f} px/s"
        reference = (round(row.get('reference_ms', 0)) if 'reference_ms' in row
                     else round(row.get('reference_px_per_s', 0), 2))
        print(f"{row['name']:<16}{str(reference):<22}"
              f"{measured:<24}{difference:<14}{ok}")


def main() -> int:
    global page_url
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="http://127.0.0.1:4418")
    parser.add_argument("--out", default=str(Path.home() / "qualicraft-review" / "motion"))
    args = parser.parse_args()
    page_url = args.url.rstrip("/")
    out = Path(args.out).expanduser()
    out.mkdir(parents=True, exist_ok=True)

    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="chrome", headless=True)
        page = browser.new_context(viewport={"width": 1440, "height": 900},
                                   locale="en-US").new_page()

        mark, ground = measure_hero(page, out)
        indicator = measure_indicator(page, out)
        fade = measure_figure_fade(page, out)
        browser.close()

    rows = [indicator, fade, mark, ground]
    print_table(rows)
    (out / "measurements.json").write_text(json.dumps(rows, indent=1, default=str),
                                           encoding="utf-8")
    print(f"\n  frames and readings: {out}")
    return 0


page_url = "http://127.0.0.1:4418"

if __name__ == "__main__":
    sys.exit(main())
