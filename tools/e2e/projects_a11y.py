"""
The duplicate `projects` control, seen by a screen reader rather than by DOM
order.

At phone width the sidebar's "+ New / import project" button and the mobile
"Switch / create project" button share `data-action="projects"`, and the
stylesheet shows exactly one of them. DOM order alone says nothing about
which one a screen reader reaches — that is what the accessibility tree is
for. Playwright's locator engine takes the first match in DOM order, which
at this width is the hidden one, so a harness that clicks blindly hits a
button with no box; the harness answers that with `:visible`. What is
measured here is the other question: is the hidden one also hidden from
assistive technology?

Three facts per control, none of them inferred:

  computed style        getComputedStyle().display — display:none removes a
                        node from the accessibility tree, not just from the
                        screen
  aria-hidden           the attribute, if any, since that is the other way
                        a node can be removed
  the tree itself       Chromium's own AX tree over CDP, with each node's
                        role, name and ignored flags

Both widths are read, because the pair is symmetric: at 1440px the mobile
button is the hidden one. The two controls then force each hiding mechanism
onto the visible control and check the tree loses it — an AX-tree read that
lists the name either way is measuring nothing, and cannot be believed for
the natural-state reads.

    python tools/e2e/projects_a11y.py
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
OUT = Path.home() / "qualicraft-review/e2e/p2-9"

sys.path.insert(0, str(REPO))

# Per element: the computed style, the attribute, and whether focus takes.
# `focus_took` is the behavioural form of the same question — a node with
# display:none is not focusable, so el.focus() leaves activeElement alone.
ELEMENTS = """
() => [...document.querySelectorAll('[data-action="projects"]')].map((el) => {
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  const focused = document.activeElement === el;
  el.focus();
  const focus_took = document.activeElement === el;
  if (!focused) el.blur();
  return {
    where: el.classList.contains('mobile-only') ? 'mobile' : 'sidebar',
    text: (el.textContent || '').trim(),
    display: cs.display,
    visibility: cs.visibility,
    aria_hidden: el.getAttribute('aria-hidden'),
    width: Math.round(r.width), height: Math.round(r.height),
    tabindex: el.tabIndex,
    focus_took: focus_took,
  };
})"""


def free_port() -> int:
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        return probe.getsockname()[1]


def ax_tree(cdp, wanted):
    """(role, name, ignored) for every tree node whose name is wanted.

    `Accessibility.getFullAXTree` is Chromium's own view of the page, the
    same tree a screen reader consumes. `ignored` is the flag that matters:
    an ignored node exists in the DOM but is not exposed.
    """
    cdp.send("Accessibility.enable")
    tree = cdp.send("Accessibility.getFullAXTree")
    seen = []
    for node in tree.get("nodes", []):
        name = node.get("name", {}).get("value", "")
        if name in wanted:
            seen.append({
                "role": node.get("role", {}).get("value", ""),
                "name": name,
                "ignored": bool(node.get("ignored")),
                "reasons": [r.get("name", {}).get("value", "")
                            for r in node.get("ignoredReasons", [])],
            })
    return seen


def main() -> int:
    from qualicraft.server import create_server
    from playwright.sync_api import sync_playwright

    port = free_port()
    server = create_server(str(Path(tempfile.mkdtemp(prefix="qc-a11y-"))), str(REPO),
                           port, "", "127.0.0.1", public_demo=False)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{port}"
    OUT.mkdir(parents=True, exist_ok=True)

    results = {}
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(channel="chrome", headless=True)
            page = browser.new_context(locale="en-US",
                                       viewport={"width": 1440, "height": 900}).new_page()
            page.goto(base + "/?lang=en", wait_until="load", timeout=45000)
            page.wait_for_timeout(3200)
            page.locator('[data-action="projects"]:visible').first.click()
            page.wait_for_timeout(700)
            page.fill("#new-project-name", "A11y check")
            page.click('[data-action="new-project"]')
            page.wait_for_timeout(2500)

            cdp = page.context.new_cdp_session(page)

            def record(label, width, prep=None):
                page.set_viewport_size({"width": width, "height": 900})
                page.wait_for_timeout(500)
                if prep:
                    prep()
                    page.wait_for_timeout(300)
                elements = page.evaluate(ELEMENTS)
                tree = ax_tree(cdp, {e["text"] for e in elements})
                results[label] = {"viewport": width, "elements": elements, "tree": tree}
                for e in elements:
                    print(f"  {label:32s} {e['where']:8s} display={e['display']:6s} "
                          f"aria_hidden={str(e['aria_hidden']):5s} "
                          f"box={e['width']}x{e['height']} focus_took={e['focus_took']}")
                for t in tree:
                    print(f"      tree: role={t['role']:8s} name={t['name']!r} "
                          f"ignored={t['ignored']} {t['reasons'] or ''}")
                if not tree:
                    print("      tree: (no node for either control)")

            record("natural-1440", 1440)
            record("natural-390", 390)

            # The controls. Each forces one hiding mechanism onto the
            # control that is VISIBLE at that width, and the tree must lose
            # it. Hide the already-hidden one and the control proves
            # nothing — which is the same trap as the broken 500px dialog
            # control earlier: a control is subject to the same conditions
            # as the thing it controls. The reset matters too: the previous
            # control's attribute would otherwise still be on the element,
            # and the second control would be measuring both mechanisms at
            # once while believing it is measuring one.
            def force_hide(mechanism, visible_selector):
                def prep():
                    page.evaluate(
                        """([mechanism, selector]) => {
                           const el = [...document.querySelectorAll(
                             '[data-action="projects"]')].find(
                             (e) => e.matches(selector));
                           if (!el) throw new Error('no element matches ' + selector);
                           el.removeAttribute('aria-hidden');
                           el.style.display = '';
                           if (mechanism === 'aria') el.setAttribute('aria-hidden', 'true');
                           else el.style.display = 'none';
                         }""", [mechanism, visible_selector])
                return prep

            record("control-390-aria-hidden-mobile", 390,
                   force_hide("aria", ".mobile-only"))
            record("control-390-display-none-mobile", 390,
                   force_hide("style", ".mobile-only"))
            browser.close()
    finally:
        server.shutdown()

    def tree_names(label):
        return {t["name"] for t in results[label]["tree"] if not t["ignored"]}

    summary = {}
    for label, row in results.items():
        width = row["viewport"]
        elements = row["elements"]
        hidden = [e for e in elements if e["display"] == "none"]
        shown = [e for e in elements if e["display"] != "none"]
        names = tree_names(label)
        summary[label] = {
            "viewport": width,
            "elements": len(elements),
            "hidden": [e["where"] for e in hidden],
            "shown": [e["where"] for e in shown],
            "hidden_focus_took": [e["focus_took"] for e in hidden],
            "shown_in_tree": [bool(names & {e["text"]}) for e in shown],
            "hidden_in_tree": [bool(names & {e["text"]}) for e in hidden],
        }

    # The controls must discriminate: after forcing the mobile control out
    # of the tree, its name must be gone from the natural-390 read.
    mobile_name = "Switch / create project"
    controls_ok = all(
        mobile_name not in tree_names(label)
        for label in results if label.startswith("control-"))
    # And the natural reads must have been able to see the visible control,
    # while the hidden one stayed out of the tree. Without this half, a tree
    # read that returns nothing at all would pass the controls.
    natural_ok = (mobile_name in tree_names("natural-390")
                  and not any(summary["natural-390"]["hidden_in_tree"])
                  and all(summary["natural-390"]["shown_in_tree"]))

    payload = {"at": datetime.now().isoformat(timespec="seconds"),
               "runs": results, "summary": summary,
               "controls_ok": controls_ok, "natural_ok": natural_ok}
    (OUT / "projects-a11y.json").write_text(json.dumps(payload, indent=1, ensure_ascii=False),
                                            encoding="utf-8")
    print(f"\n  controls behaved: {controls_ok}   natural reads sound: {natural_ok}")
    for label in ("natural-1440", "natural-390"):
        s = summary[label]
        print(f"  {label}: hidden={s['hidden']} shown={s['shown']} "
              f"hidden_in_tree={s['hidden_in_tree']} shown_in_tree={s['shown_in_tree']}")
    print(f"  wrote {OUT}/projects-a11y.json")
    if not controls_ok:
        print("  CONTROL FAILED: the tree read did not notice a forced hide")
        return 1
    if not natural_ok:
        print("  READ FAILED: the visible control was not in its own tree")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
