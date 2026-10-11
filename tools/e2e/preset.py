"""
The "all five modules" preset, checked as behaviour rather than as markup.

Two assertions, and they pull in opposite directions on purpose:

  test_preset_turns_figures_on      the button does what it says
  test_a_new_project_still_has_them_off   the default was not changed

The second is the one that matters most. A preset is easy to add and easy to
add wrongly — by turning it into the default, which would remove the choice the
capability blocks exist to offer. Both run in one browser session because the
second is only meaningful after the first has happened.

    python tools/e2e/preset.py
"""
from __future__ import annotations

import os
import socket
import sys
import tempfile
import threading
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO))

NAV = "() => [...document.querySelectorAll('[data-action=\"view\"]')].map((e) => e.dataset.view)"


def free_port() -> int:
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        return probe.getsockname()[1]


def main() -> int:
    from qualicraft.server import create_server
    from playwright.sync_api import sync_playwright

    port = free_port()
    server = create_server(str(Path(tempfile.mkdtemp(prefix="qc-preset-"))), str(REPO),
                           port, "", "127.0.0.1", public_demo=False)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{port}"
    results = []

    def check(name, passed, detail):
        results.append((name, passed, detail))
        print(f"  {'PASS' if passed else 'FAIL'}  {name}\n        {detail}")

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(channel="chrome", headless=True)
            page = browser.new_context(locale="en-US",
                                       viewport={"width": 1440, "height": 900}).new_page()
            page.goto(base + "/?lang=en", wait_until="load", timeout=45000)
            page.wait_for_timeout(3200)

            def new_project(name):
                page.click('[data-action="projects"]'); page.wait_for_timeout(700)
                page.fill("#new-project-name", name)
                page.click('[data-action="new-project"]'); page.wait_for_timeout(2500)
                return page.evaluate(NAV)

            # The state before anything is pressed.
            before = new_project("Preset target")
            check("test_a_new_project_still_has_them_off",
                  "plotting" not in before,
                  f"a project nobody has configured shows {before}")

            # The preset itself.
            page.click('[data-action="enable-all-blocks"]')
            page.wait_for_timeout(2600)
            after = page.evaluate(NAV)
            check("test_preset_turns_figures_on",
                  "plotting" in after,
                  f"after pressing the preset the navigation shows {after}")

            # ...and that it did not become the default for the next project.
            second = new_project("Preset control")
            check("test_the_preset_is_not_a_new_default",
                  "plotting" not in second,
                  f"the next project shows {second}")

            # The codebook is collapsed by default and stays that way. What is
            # checked here is that the collapsed state says so: a twisty and a
            # count read as a label, not as a control, so the word matters.
            page.click('[data-action="code"]'); page.wait_for_timeout(700)
            page.fill("#code-name", "Isolation")
            page.click('[data-action="save-code"]'); page.wait_for_timeout(1200)

            collapsed = page.evaluate("""() => {
              const b = document.querySelector('[data-action="toggle-codebook"]');
              return {expanded: b.getAttribute('aria-expanded'),
                      hint: (b.querySelector('.side-hint') || {}).textContent || '',
                      rows: document.querySelectorAll('.code-row').length};
            }""")
            check("test_the_collapsed_codebook_says_it_can_be_opened",
                  collapsed["expanded"] == "false" and collapsed["hint"].strip() != ""
                  and collapsed["rows"] == 0,
                  f"collapsed: {collapsed}")

            page.click('[data-action="toggle-codebook"]'); page.wait_for_timeout(800)
            opened = page.evaluate("""() => ({
              expanded: document.querySelector('[data-action="toggle-codebook"]').getAttribute('aria-expanded'),
              rows: document.querySelectorAll('.code-row').length,
            })""")
            check("test_the_codebook_opens_and_shows_the_code",
                  opened["expanded"] == "true" and opened["rows"] >= 1,
                  f"opened: {opened}")

            browser.close()
    finally:
        server.shutdown()

    failed = [name for name, ok, _ in results if not ok]
    print(f"\n  {len(results) - len(failed)}/{len(results)} passed")
    return 0 if not failed else 1


if __name__ == "__main__":
    raise SystemExit(main())
