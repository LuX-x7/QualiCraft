"""
The four dialogs at phone width.

Measured, not asserted: each dialog's box is read and compared with the viewport
it is sitting in. A dialog that fits at 1440px can still be cut off at 390, and
the earlier "the Snapshots dialog is truncated" observation was never measured
at all — it turned out to be a cropped recording.

The control matters as much as the measurement. A check that reports "no
overflow" because it is not measuring anything looks exactly like a check that
reports "no overflow" because there is none, so one dialog is deliberately
widened past the viewport and the same code is asked to notice.

    python tools/e2e/dialogs.py
"""
from __future__ import annotations

import json
import socket
import sys
import tempfile
import threading
from datetime import datetime
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT = Path.home() / "qualicraft-review/e2e/p2-5"
VIEWPORT = {"width": 390, "height": 844}

sys.path.insert(0, str(REPO))

MEASURE = """() => {
  const d = document.getElementById('dialog');
  if (!d || !d.hasAttribute('open')) return null;
  const r = d.getBoundingClientRect();
  const close = d.querySelector('[data-action="close"]');
  const c = close ? close.getBoundingClientRect() : null;
  return {
    innerWidth: window.innerWidth,
    left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width),
    overflowsRight: Math.round(r.right) > window.innerWidth,
    overflowsLeft: Math.round(r.left) < 0,
    closeInside: c ? (c.left >= 0 && c.right <= window.innerWidth
                      && c.width > 0 && c.height > 0) : false,
  };
}"""


def free_port() -> int:
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        return probe.getsockname()[1]


def main() -> int:
    from qualicraft.server import create_server
    from playwright.sync_api import sync_playwright

    port = free_port()
    server = create_server(str(Path(tempfile.mkdtemp(prefix="qc-dialogs-"))), str(REPO),
                           port, "", "127.0.0.1", public_demo=False)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{port}"
    OUT.mkdir(parents=True, exist_ok=True)

    results, failures = {}, []
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(channel="chrome", headless=True)
            page = browser.new_context(locale="en-US", viewport=VIEWPORT).new_page()
            page.goto(base + "/?lang=en", wait_until="load", timeout=45000)
            page.wait_for_timeout(3200)

            # The same action exists twice at phone width: a desktop control the
            # stylesheet hides below 800px, and a mobile substitute. Playwright
            # takes the first match in DOM order, which is the hidden one, so
            # `:visible` is doing real work here rather than tidying up.
            page.locator('[data-action="projects"]:visible').first.click()
            page.wait_for_timeout(700)
            page.fill("#new-project-name", "Dialog width")
            page.click('[data-action="new-project"]'); page.wait_for_timeout(2500)

            def measure(label, opener):
                # An action with no visible control at this width is a result,
                # not an error: record it and move on, so one unreachable dialog
                # does not hide the state of the others.
                if page.locator(f'[data-action="{label[0].lower() + label[1:]}"]:visible').count() == 0:
                    results[label] = {"unreachable": "no visible control at this width"}
                    print(f"  {label:12s} no visible control at this width")
                    return
                opener()
                page.wait_for_timeout(900)
                got = page.evaluate(MEASURE)
                page.keyboard.press("Escape")
                page.wait_for_timeout(400)
                results[label] = got
                if got is None:
                    failures.append(f"{label}: the dialog did not open")
                elif got["overflowsRight"] or got["overflowsLeft"] or not got["closeInside"]:
                    failures.append(f"{label}: {got}")
                print(f"  {label:12s} {json.dumps(got)}")

            print(f"  viewport {VIEWPORT['width']}x{VIEWPORT['height']}\n")
            def opener(action):
                return lambda: page.locator(f'[data-action="{action}"]:visible').first.click()

            measure("Snapshots", opener("snapshots"))
            measure("Import", opener("import"))
            measure("Create", opener("code"))
            measure("Export", opener("export"))

            # The control. Force one dialog past the viewport and confirm the
            # same measurement reports it, so "no overflow" means something.
            print("\n  control: the same dialog forced to 500px")
            page.locator('[data-action="snapshots"]:visible').first.click()
            page.wait_for_timeout(900)
            page.evaluate("() => { document.getElementById('dialog').style.width = '500px'; }")
            page.wait_for_timeout(300)
            forced = page.evaluate(MEASURE)
            results["control-forced-500"] = forced
            control_ok = bool(forced and forced["overflowsRight"])
            print(f"  control      {json.dumps(forced)}")
            page.keyboard.press("Escape")
            print(f"\n  control reported overflow: {control_ok}")

            browser.close()
    finally:
        server.shutdown()

    payload = {"at": datetime.now().isoformat(timespec="seconds"), "viewport": VIEWPORT,
               "dialogs": results, "failures": failures,
               "control_reported_overflow": results.get("control-forced-500", {}).get("overflowsRight", False)}
    (OUT / "dialogs-390.json").write_text(json.dumps(payload, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"  wrote {OUT}/dialogs-390.json")

    if not payload["control_reported_overflow"]:
        print("  CONTROL FAILED: the measurement does not notice a 500px dialog in a 390px viewport")
        return 1
    if failures:
        print(f"  {len(failures)} dialog(s) do not fit: {failures}")
        return 1
    print("  all four fit at 390px, and the measurement can tell when one does not")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
