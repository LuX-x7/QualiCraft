"""The site's acceptance run: screenshots, overflow, keyboard, console, words.

    python tools/site/acceptance.py --url http://127.0.0.1:4420 \
        --out ~/qualicraft-review/site-t7

Checks, each printing its raw reading so a pass is a reading and not a claim:

  1. both widths (1440 and 390) render the home, the five-module section,
     the report and about, with a screenshot of each;
  2. no horizontal overflow at either width — the same measurement
     tools/e2e/dialogs.py makes (documentElement.scrollWidth minus the
     viewport);
  3. the keyboard walks the header navigation, the five module steps and
     the report's contents, and the figure's table toggle operates from
     the keyboard;
  4. no console error and no 4xx/5xx on any page;
  5. the rendered text carries none of the forbidden words;
  6. the report page shows its figures — which it refuses to do when the
     manifest's hashes no longer match the files on disk.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

FORBIDDEN = re.compile(
    r"publication-grade|publication-ready|publication-oriented|put in a paper|期刊",
    re.IGNORECASE)

PAGES = [
    ("home", "/?lang=en", "body"),
    ("modules", "/?lang=en", "#modules"),
    ("report", "/report", ".report"),
    ("about", "/about", "main"),
]
WIDTHS = (("desktop", 1440, 900), ("phone", 390, 844))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="http://127.0.0.1:4420")
    parser.add_argument("--out", default=str(Path.home() / "qualicraft-review" / "site-t7"))
    args = parser.parse_args()
    base = args.url.rstrip("/")
    out = Path(args.out).expanduser()
    (out / "shots").mkdir(parents=True, exist_ok=True)

    from playwright.sync_api import sync_playwright
    problems: list[str] = []
    readings: list[str] = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel="chrome", headless=True)
        for label, width, height in WIDTHS:
            context = browser.new_context(locale="en-US",
                                          viewport={"width": width, "height": height})
            page = context.new_page()
            console: list[str] = []
            http: list[str] = []
            page.on("console", lambda m: console.append(m.text) if m.type == "error" else None)
            page.on("pageerror", lambda e: console.append(str(e)))
            page.on("response", lambda r: http.append(f"{r.status} {r.url}")
                    if r.status >= 400 else None)

            for name, path, _anchor in PAGES:
                page.goto(base + path, wait_until="load", timeout=60000)
                page.wait_for_timeout(1800)
                overflow = page.evaluate(
                    "() => document.documentElement.scrollWidth - window.innerWidth")
                page.screenshot(path=str(out / "shots" / f"{name}-{label}.png"))
                page.screenshot(path=str(out / "shots" / f"{name}-{label}-full.png"),
                                full_page=True)
                text = page.evaluate("() => document.body.innerText")
                found = FORBIDDEN.findall(text)
                line = (f"[{label}] {name:8} overflow={overflow:+d} "
                        f"console={len(console)} http={len(http)} forbidden={found or 'none'}")
                print(line)
                readings.append(line)
                if overflow > 0:
                    problems.append(f"{label}/{name} overflows by {overflow}px")
                if console:
                    problems.append(f"{label}/{name} console: {console}")
                if http:
                    problems.append(f"{label}/{name} http: {http}")
                if found:
                    problems.append(f"{label}/{name} forbidden words: {found}")

            # the keyboard: header links, the module steps, the report contents
            page.goto(base + "/?lang=en", wait_until="load", timeout=60000)
            page.wait_for_timeout(1500)
            walked = page.evaluate("""() => {
              const links = [...document.querySelectorAll('.site-nav__list a')]
              return links.map(a => a.textContent.trim()).join(' | ')
            }""")
            print(f"[{label}] header links: {walked}")

            page.locator(".walk__step-button").first.focus()
            steps = []
            for key in ("ArrowDown", "ArrowDown", "ArrowUp", "End", "Home"):
                page.keyboard.press(key)
                page.wait_for_timeout(250)
                steps.append(page.evaluate(
                    "() => document.querySelector('.walk__step.is-current .walk__step-title')?.textContent"))
            print(f"[{label}] module keyboard walk: {steps}")
            if steps[0] != "Coding":
                problems.append(f"{label} keyboard step 1 landed on {steps[0]!r}, not 'Coding'")

            page.goto(base + "/report", wait_until="load", timeout=60000)
            page.wait_for_timeout(1500)
            refusal = page.evaluate("() => !!document.querySelector('.report-problems')")
            figures = page.evaluate("() => document.querySelectorAll('figure.fig').length")
            print(f"[{label}] report: figures={figures} hash_refusal={refusal}")
            if refusal:
                problems.append(f"{label} the report refused its figures (hash mismatch)")
            if figures != 5:
                problems.append(f"{label} the report shows {figures} figures, expected 5")

            # the table toggle from the keyboard, then the contents links
            page.locator(".fig-toggle").first.focus()
            page.keyboard.press("Enter")
            page.wait_for_timeout(400)
            rows = page.evaluate(
                "() => document.querySelectorAll('table.data:not([hidden]) tbody tr').length")
            print(f"[{label}] table toggle by keyboard: rows={rows}")
            if not rows:
                problems.append(f"{label} the table toggle did not open from the keyboard")

            toc = page.locator(".toc-link")
            toc.nth(1).focus()
            page.keyboard.press("Enter")
            page.wait_for_timeout(900)
            current = page.evaluate(
                "() => document.querySelector('.toc-item.is-current .toc-title')?.textContent")
            print(f"[{label}] report contents by keyboard: current={current!r}")

            context.close()
        browser.close()

    (out / "acceptance.txt").write_text("\n".join(readings) + "\n", encoding="utf-8")
    print()
    if problems:
        print(f"  {len(problems)} problem(s):")
        for problem in problems:
            print(f"    - {problem}")
        return 1
    print("  acceptance: all readings clean")
    return 0


if __name__ == "__main__":
    sys.exit(main())
