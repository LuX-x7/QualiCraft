"""
Control experiment for the smoke harness.

A passing test proves nothing unless the harness can also fail. This runs the
same S5 logic twice: once against the repository as it is, and once against a
deliberately broken copy in which `save-code` does not persist anything. The
harness is trustworthy only if it reports PASS on the first and FAIL on the
second.

The product is never modified. The broken build is a throwaway copy under a
temporary directory, served on its own port and discarded afterwards.

    python tools/e2e/control.py
    → ~/qualicraft-review/e2e/controls/{normal,broken}.json
"""
from __future__ import annotations

import json
import os
import re
import shutil
import socket
import sys
import tempfile
import threading
from datetime import datetime
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
FIXTURE = Path(__file__).resolve().parent / "fixtures" / "synthetic_interview.txt"
OUT = Path(os.path.expanduser("~/qualicraft-review/e2e/controls"))

sys.path.insert(0, str(REPO))

# The break: make the create-code handler return without calling the API. The
# dialog still closes and still shows no error, so the failure is silent to a
# user — which is exactly the shape a harness has to be able to catch.
BREAK_FROM = "if(a==='save-code'){await api(projectUrl(QT('codeCount','codes'))"
BREAK_TO = "if(a==='save-code'){closeModal();return;/* control: never persists */}if(0){await api(projectUrl(QT('codeCount','codes'))"


# A second break, for the answer P2-4 added: the collapsed codebook is supposed
# to carry a visible hint. Removing it must make the P2-4 assertion fail, or the
# assertion is not measuring anything.
HINT_FROM = '${total?`<span class="side-hint">${open?QT(\'codebookHide\',\'hide codes\'):QT(\'codebookShow\',\'show codes\')}</span>`:\'\'}'
HINT_TO = ''


def broken_copy(break_kind: str = "save-code") -> Path:
    root = Path(tempfile.mkdtemp(prefix="qc-control-"))
    for item in ("qualicraft", "web", "tests", "run.py", "run_demo.py"):
        src = REPO / item
        if src.is_dir():
            shutil.copytree(src, root / item)
        elif src.exists():
            shutil.copy2(src, root / item)
    target = root / "web" / "app.js"
    text = target.read_text(encoding="utf-8")
    if break_kind == "save-code":
        if BREAK_FROM not in text:
            raise SystemExit("control: the save-code handler moved; update BREAK_FROM")
        text = text.replace(BREAK_FROM, BREAK_TO, 1)
    elif break_kind == "codebook-hint":
        if HINT_FROM not in text:
            raise SystemExit("control: the codebook hint moved; update HINT_FROM")
        text = text.replace(HINT_FROM, HINT_TO, 1)
    else:
        raise SystemExit(f"control: unknown break kind {break_kind!r}")
    target.write_text(text, encoding="utf-8")
    return root


def free_port() -> int:
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        return probe.getsockname()[1]


def serve(repo_root: Path):
    """Start the workbench out of `repo_root` and return (server, base)."""
    for name in list(sys.modules):
        if name.startswith("qualicraft"):
            del sys.modules[name]
    sys.path.insert(0, str(repo_root))
    import importlib
    server_mod = importlib.import_module("qualicraft.server")
    port = free_port()
    server = server_mod.create_server(
        str(Path(tempfile.mkdtemp(prefix="qc-control-data-"))), str(repo_root),
        port, "", "127.0.0.1", public_demo=False)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server, f"http://127.0.0.1:{port}"


def s5_logic(page, base) -> dict:
    """S5's assertion, isolated so both builds run exactly the same thing."""
    page.goto(base + "/?lang=en", wait_until="load", timeout=45000)
    page.wait_for_timeout(3200)
    page.click('[data-action="projects"]'); page.wait_for_timeout(600)
    page.fill("#new-project-name", "Control"); page.click('[data-action="new-project"]')
    page.wait_for_timeout(2400)

    made = []
    for name in ("Barriers", "Schedule"):
        page.click('[data-action="code"]'); page.wait_for_timeout(600)
        page.fill("#code-name", name)
        page.click('[data-action="save-code"]'); page.wait_for_timeout(900)
        made.append(name)

    open_toggle = page.evaluate(
        "!!document.querySelector('[data-action=\"toggle-codebook\"][aria-expanded=\"false\"]')")
    if open_toggle:
        page.click('[data-action="toggle-codebook"]'); page.wait_for_timeout(700)
    listed = page.evaluate(
        """() => [...document.querySelectorAll('.code-row .side-item .name')]
             .map((e) => e.textContent.trim())""")
    seen = {n: any(got == n or got.startswith(n) for got in listed) for n in made}
    return {"created": made, "codebook_rows": listed, "visible": seen,
            "pass": all(seen.values())}


def run_one(label: str, repo_root: Path, broken: bool) -> dict:
    from playwright.sync_api import sync_playwright
    server, base = serve(repo_root)
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(channel="chrome", headless=True)
            page = browser.new_context(locale="en-US",
                                       viewport={"width": 1440, "height": 900}).new_page()
            try:
                result = s5_logic(page, base)
            finally:
                browser.close()
    finally:
        server.shutdown()
    result.update(label=label, broken=broken, base=base,
                  at=datetime.now().isoformat(timespec="seconds"))
    print(f"  {label:8s} broken={str(broken):5s} S5 {'PASS' if result['pass'] else 'FAIL'}  "
          f"rows={result['codebook_rows']}")
    return result


def hint_logic(page, base) -> dict:
    """P2-4's assertion, isolated the same way S5's is."""
    page.goto(base + "/?lang=en", wait_until="load", timeout=45000)
    page.wait_for_timeout(3200)
    page.click('[data-action="projects"]'); page.wait_for_timeout(700)
    page.fill("#new-project-name", "Hint control")
    page.click('[data-action="new-project"]'); page.wait_for_timeout(2500)
    page.click('[data-action="code"]'); page.wait_for_timeout(700)
    page.fill("#code-name", "Isolation")
    page.click('[data-action="save-code"]'); page.wait_for_timeout(1200)
    state = page.evaluate("""() => {
      const b = document.querySelector('[data-action="toggle-codebook"]');
      return {expanded: b.getAttribute('aria-expanded'),
              hint: (b.querySelector('.side-hint') || {}).textContent || '',
              rows: document.querySelectorAll('.code-row').length};
    }""")
    return {"state": state,
            "pass": state["expanded"] == "false" and state["hint"].strip() != ""
                    and state["rows"] == 0}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    print("Control experiment — each assertion must pass on the real build and fail on its broken copy.\n")

    print("  S5: a code that is created but never persisted")
    normal = run_one("normal", REPO, False)
    broken_root = broken_copy("save-code")
    try:
        broken = run_one("broken", broken_root, True)
    finally:
        shutil.rmtree(broken_root, ignore_errors=True)

    print("\n  P2-4: the collapsed codebook with its hint removed")
    from playwright.sync_api import sync_playwright

    def run_hint(label, root, is_broken):
        server, base = serve(root)
        try:
            with sync_playwright() as pw:
                browser = pw.chromium.launch(channel="chrome", headless=True)
                page = browser.new_context(locale="en-US",
                                           viewport={"width": 1440, "height": 900}).new_page()
                try:
                    result = hint_logic(page, base)
                finally:
                    browser.close()
        finally:
            server.shutdown()
        result.update(label=label, broken=is_broken, at=datetime.now().isoformat(timespec="seconds"))
        print(f"    {label:8s} broken={str(is_broken):5s} hint {'PASS' if result['pass'] else 'FAIL'}  "
              f"{result['state']}")
        return result

    hint_normal = run_hint("normal", REPO, False)
    hint_root = broken_copy("codebook-hint")
    try:
        hint_broken = run_hint("broken", hint_root, True)
    finally:
        shutil.rmtree(hint_root, ignore_errors=True)

    (OUT / "normal.json").write_text(json.dumps(normal, indent=1, ensure_ascii=False), encoding="utf-8")
    (OUT / "broken.json").write_text(json.dumps(broken, indent=1, ensure_ascii=False), encoding="utf-8")
    (OUT / "hint-normal.json").write_text(json.dumps(hint_normal, indent=1, ensure_ascii=False), encoding="utf-8")
    (OUT / "hint-broken.json").write_text(json.dumps(hint_broken, indent=1, ensure_ascii=False), encoding="utf-8")

    s5_ok = normal["pass"] and not broken["pass"]
    hint_ok = hint_normal["pass"] and not hint_broken["pass"]
    print(f"\n  S5      normal={normal['pass']}  broken={broken['pass']}  discriminates={s5_ok}")
    print(f"  hint    normal={hint_normal['pass']}  broken={hint_broken['pass']}  discriminates={hint_ok}")
    print(f"  both discriminate: {'YES' if (s5_ok and hint_ok) else 'NO'}")
    return 0 if (s5_ok and hint_ok) else 1


if __name__ == "__main__":
    raise SystemExit(main())
