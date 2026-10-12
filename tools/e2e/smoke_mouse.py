"""
Real mouse selection, through the browser's own input pipeline.

smoke.py codes a passage by building a Range in JavaScript and dispatching a
synthetic mouseup on the passage holder. That exercises the offset
arithmetic, not the gesture: the app listens for `mouseup` inside #reader
and then reads window.getSelection(), so a script could satisfy the handler
while a person's drag still fails — the handler chain, the popup, the focus
in the popup's input all get skipped when the event is manufactured. This
script moves the mouse the way a person does and checks the same landing:
a selection exists, the coding popup appeared, Enter created a code, and
the annotation is on the server carrying the quote the drag actually chose.

The control is a mouse-down and up with no drag, inside the reader. If any
mouseup produced a popup, the main check would be measuring nothing, so the
control runs last and the popup is confirmed closed first: a popup left
open by an earlier step is otherwise indistinguishable from a popup the
control just opened. The control also asserts the negative state of the
main check — that a drag on the sidebar opens nothing either.

    python tools/e2e/smoke_mouse.py
"""
from __future__ import annotations

import json
import os
import socket
import sys
import tempfile
import threading
from datetime import datetime
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
FIXTURE = Path(__file__).resolve().parent / "fixtures" / "synthetic_interview.txt"
OUT_ROOT = Path(os.path.expanduser("~/qualicraft-review/e2e"))
OUT = OUT_ROOT / "p2-7"

sys.path.insert(0, str(REPO))

CODE = "Mouse drag"


def free_port(preferred: int) -> int:
    with socket.socket() as probe:
        try:
            probe.bind(("127.0.0.1", preferred))
            return preferred
        except OSError:
            probe.bind(("127.0.0.1", 0))
            return probe.getsockname()[1]


def main() -> int:
    from qualicraft.server import create_server
    from playwright.sync_api import sync_playwright

    OUT.mkdir(parents=True, exist_ok=True)
    port = free_port(8891)
    data_dir = Path(tempfile.mkdtemp(prefix="qc-mouse-"))
    server = create_server(str(data_dir), str(REPO), port, "", "127.0.0.1",
                           public_demo=False)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{port}"

    results = []

    def check(name, passed, detail):
        results.append((name, bool(passed), detail))
        print(f"  {'PASS' if passed else 'FAIL'}  {name}\n        {detail}")

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(channel="chrome", headless=True)
            page = browser.new_context(locale="en-US",
                                       viewport={"width": 1440, "height": 900}).new_page()
            page.goto(base + "/?lang=en", wait_until="load", timeout=45000)
            page.wait_for_timeout(3200)

            # ---- a project with the fixture imported ---------------------
            page.locator('[data-action="projects"]:visible').first.click()
            page.wait_for_timeout(700)
            page.fill("#new-project-name", "Mouse – real drag")
            page.click('[data-action="new-project"]')
            page.wait_for_timeout(2500)
            page.click('[data-action="import"]')
            page.wait_for_timeout(600)
            page.set_input_files("#import-file", str(FIXTURE))
            page.wait_for_timeout(900)
            page.fill("#document-name", "Synthetic interview")
            page.click('[data-action="save-document"]')
            page.wait_for_timeout(3000)

            paragraphs = page.evaluate(
                "document.querySelectorAll('.paragraph .passage').length")
            check("M0 fixture imported", paragraphs >= 20,
                  f"{paragraphs} passages rendered")

            # ---- the gesture ---------------------------------------------
            def arm_selection_recorder():
                """Record what the drag actually selected, as it selected it.

                The popup's input takes focus the moment it opens, and focus
                clears the document selection — so reading getSelection()
                after the drag finds an empty string even when the drag
                worked. A selectionchange listener records the selections
                while they exist; the collapse-to-empty pushes nothing.
                """
                page.evaluate("""() => {
                  window.__dragSelections = [];
                  if (window.__dragSelListener)
                    document.removeEventListener('selectionchange', window.__dragSelListener);
                  window.__dragSelListener = () => {
                    const s = (window.getSelection() || '').toString();
                    if (s) window.__dragSelections.push(s);
                  };
                  document.addEventListener('selectionchange', window.__dragSelListener);
                }""")

            def drag_across(nth, drag_px=220):
                """One real drag over the nth passage's first line.

                page.mouse is the browser's own input: mousedown on the
                text, mousemove in steps, mouseup inside #reader — which is
                exactly what the app's listener waits for. A single jump
                from start to end can be coalesced by the input pipeline
                into a click, so the move is broken into steps the way a
                slow hand would produce.
                """
                arm_selection_recorder()
                box = page.evaluate("""(n) => {
                  const ps = [...document.querySelectorAll('.paragraph .passage')];
                  const p = ps[n];
                  if (!p) return null;
                  p.scrollIntoView({ block: 'center' });
                  const r = p.getBoundingClientRect();
                  return { left: r.left, top: r.top, width: r.width,
                           height: r.height, text: (p.textContent || '').length };
                }""", nth)
                page.wait_for_timeout(400)
                if not box or box["width"] == 0:
                    return None
                # The first line: near the top of the box, where text is.
                y = box["top"] + 10
                x1 = box["left"] + 12
                x2 = min(box["left"] + 12 + drag_px, box["left"] + box["width"] - 8)
                page.mouse.move(x1, y)
                page.mouse.down()
                page.mouse.move(x2, y, steps=15)
                page.mouse.up()
                page.wait_for_timeout(600)
                selected = page.evaluate(
                    "() => (window.__dragSelections || []).join(' | ')")
                popup = page.evaluate("""() => {
                  const h = document.getElementById('code-popup');
                  if (!h) return null;
                  const r = h.getBoundingClientRect();
                  return { chars: (h.querySelector('.code-popup-count') || {}).textContent || '',
                           box: Math.round(r.width) + 'x' + Math.round(r.height) };
                }""")
                return {"selected": selected, "popup": popup}

            def code_selection(name):
                page.fill("#code-search", name)
                page.keyboard.press("Enter")
                page.wait_for_timeout(1800)
                closed = page.evaluate("!document.getElementById('code-popup')")
                page.keyboard.press("Escape")
                page.wait_for_timeout(300)
                return closed

            def pills():
                return page.evaluate(
                    "document.querySelectorAll('.margin-tags .pill').length")

            # M1: the first drag creates the code and the coding.
            first = drag_across(0)
            if not first:
                check("M1 real drag selects a passage", False, "no passage box")
            else:
                popup_ok = first["popup"] is not None
                check("M1 real drag selects a passage",
                      bool(first["selected"].strip()) and popup_ok,
                      f"selection={first['selected'][:60]!r} popup={first['popup']}")
                closed = code_selection(CODE) if popup_ok else False
                n = pills()
                check("M1 Enter codes the dragged selection", closed and n >= 1,
                      f"popup_closed={closed} margin_pills={n}")

            # M2: a second drag applies the existing code — the exact-match
            # path rather than the create path, because that is the one a
            # researcher uses the second time.
            second = drag_across(3)
            if not second or not second["popup"]:
                check("M2 second drag opens the popup", False, f"result={second}")
            else:
                closed = code_selection(CODE)
                n = pills()
                check("M2 second drag applies the existing code", closed and n >= 2,
                      f"selection={second['selected'][:40]!r} popup_closed={closed} "
                      f"margin_pills={n}")

            # M3: server-side truth. The pills are the page's own reading;
            # this asks the server what it stored, and checks each stored
            # quote is really a substring of the document the server holds
            # — not of one paragraph on screen, which is where the first
            # version of this check went wrong: the second coding's quote
            # comes from a different paragraph, so comparing against the
            # first passage alone reports a false failure. The path is the
            # one the page itself uses (`/api/projects/<id>`, plural);
            # the singular read a 404 as "no codings stored".
            stored = page.evaluate("""() => fetch(`/api/projects/${state.project.id}`,
                { headers: { 'X-QualiCraft-Token': state.token } })
                  .then((r) => r.ok ? r.json() : { error: r.status })""")
            annotations = (stored or {}).get("annotations", [])
            codes = {c["id"]: c["name"] for c in (stored or {}).get("codes", [])}
            ours = [a for a in annotations if codes.get(a.get("code_id")) == CODE]
            docs = (stored or {}).get("documents", [])
            quotes_ok = bool(docs) and all(
                any((a.get("quote") or "") in d.get("text", "") for d in docs)
                for a in ours)
            offsets_ok = all(a.get("start", -1) < a.get("end", -1) for a in ours)
            check("M3 the server stored both codings with the dragged quote",
                  len(ours) == 2 and quotes_ok and offsets_ok,
                  f"codings_for_{CODE!r}={len(ours)} quotes_in_document={quotes_ok} "
                  f"offsets_in_order={offsets_ok} "
                  f"first={(ours[0].get('quote') if ours else '')[:50]!r}")

            # C1: the control. A click with no drag, inside the reader: the
            # mouseup fires, the selection stays collapsed, and nothing may
            # open. Run only with the popup confirmed closed, so a popup
            # left by a failed step cannot be mistaken for the result. The
            # recorder is re-armed so the negative has something to be
            # negative in: if any selection had been made, it would be in
            # the list.
            before = page.evaluate("!document.getElementById('code-popup')")
            if before:
                arm_selection_recorder()
                box = page.evaluate("""() => {
                  const p = document.querySelector('.paragraph .passage');
                  const r = p.getBoundingClientRect();
                  return { left: r.left, top: r.top, width: r.width };
                }""")
                page.mouse.move(box["left"] + 20, box["top"] + 10)
                page.mouse.down()
                page.mouse.up()
                page.wait_for_timeout(500)
                after = page.evaluate("!document.getElementById('code-popup')")
                collapsed = page.evaluate("() => window.getSelection().isCollapsed")
                nothing_selected = page.evaluate(
                    "() => (window.__dragSelections || []).length === 0")
                check("C1 a click with no drag opens no popup",
                      after and collapsed and nothing_selected,
                      f"popup_absent={after} selection_collapsed={collapsed} "
                      f"selections_recorded={nothing_selected}")
            else:
                check("C1 a click with no drag opens no popup", False,
                      "a popup was already open; the control would measure it, "
                      "not the click")

            # C2: the other half of the scoping. The same drag, outside
            # the reader: the app's mouseup listener is scoped to #reader,
            # so a drag that selects sidebar text may select all it likes
            # and must still open no coding popup. Without this, a popup
            # that appeared for any selection anywhere would pass C1.
            arm_selection_recorder()
            side = page.evaluate("""() => {
              const el = document.querySelector('.brand-name') ||
                         document.querySelector('.sidebar');
              const r = el.getBoundingClientRect();
              return { left: r.left, top: r.top, width: r.width, height: r.height };
            }""")
            page.mouse.move(side["left"] + 8, side["top"] + 8)
            page.mouse.down()
            page.mouse.move(side["left"] + side["width"] - 8, side["top"] + 8,
                            steps=10)
            page.mouse.up()
            page.wait_for_timeout(500)
            no_popup = page.evaluate("!document.getElementById('code-popup')")
            check("C2 a drag outside the reader opens no popup", no_popup,
                  f"popup_absent={no_popup} "
                  f"selections_recorded={page.evaluate('() => (window.__dragSelections || []).length')}")

            browser.close()
    finally:
        server.shutdown()

    payload = {"at": datetime.now().isoformat(timespec="seconds"),
               "code": CODE, "results": [{"name": n, "pass": ok, "detail": d}
                                          for n, ok, d in results]}
    (OUT / "smoke-mouse.json").write_text(json.dumps(payload, indent=1, ensure_ascii=False),
                                          encoding="utf-8")
    failed = [n for n, ok, _ in results if not ok]
    print(f"\n  {len(results) - len(failed)}/{len(results)} passed"
          + (f"; failed: {failed}" if failed else ""))
    print(f"  wrote {OUT}/smoke-mouse.json")
    return 0 if not failed else 1


if __name__ == "__main__":
    raise SystemExit(main())
