"""
End-to-end smoke test: a fresh transcript with no coding history, through all
five modules.

Phase 1 of the brief — this runs the tool and records what happens. It fixes
nothing. Every step takes a screenshot, times itself, counts clicks, and watches
the console and the network; a step whose assertion fails is recorded and the
run continues, so one broken step does not hide the state of the ones after it.
The process exits non-zero if any step failed.

Playwright is used only as a driver and lives in tools/, not in the package's
runtime dependencies. It drives the system Chrome (`channel="chrome"`), so no
browser download is needed.

    python tools/e2e/smoke.py [--headless false] [--port 8890]

Output: ~/qualicraft-review/e2e/run-<timestamp>/  (screenshots + results.json)
        ~/qualicraft-review/e2e/friction-log.md   (written by --log, see README)
"""
from __future__ import annotations

import argparse
import json
import os
import re
import socket
import sys
import threading
import time
from datetime import datetime
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
FIXTURE = Path(__file__).resolve().parent / "fixtures" / "synthetic_interview.txt"
OUT_ROOT = Path(os.path.expanduser("~/qualicraft-review/e2e"))

sys.path.insert(0, str(REPO))

# Visible text that is not English. The language toggle shows "ZH" on the
# English site and nothing else may be non-ASCII.
CJK = re.compile(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3000-\u303f]")


def free_port(preferred: int) -> int:
    with socket.socket() as probe:
        try:
            probe.bind(("127.0.0.1", preferred))
            return preferred
        except OSError:
            probe.bind(("127.0.0.1", 0))
            return probe.getsockname()[1]


class Recorder:
    """One row per step, plus the raw material for the friction log."""

    def __init__(self, out: Path):
        self.out = out
        self.rows: list[dict] = []
        self.non_ascii: list[dict] = []

    def add(self, step, title, ok, detail, seconds, clicks, console, http):
        self.rows.append({
            "step": step, "title": title, "pass": bool(ok), "detail": detail,
            "seconds": round(seconds, 2), "clicks": clicks,
            "console_errors": console, "http_errors": http,
            "screenshot": f"S{step:02d}.png",
        })

    def summary(self):
        failed = [r for r in self.rows if not r["pass"]]
        return {
            "steps": len(self.rows), "passed": len(self.rows) - len(failed),
            "failed": len(failed), "failed_steps": [r["step"] for r in failed],
            "seconds": round(sum(r["seconds"] for r in self.rows), 1),
            "clicks": sum(r["clicks"] for r in self.rows),
            "console_errors": sum(len(r["console_errors"]) for r in self.rows),
            "http_errors": sum(len(r["http_errors"]) for r in self.rows),
        }


# Attributes that put text on screen without being textContent. The Chinese
# this scan originally missed was a placeholder, so leaving these out made the
# check report a pass while the string was still visible.
TEXT_ATTRS = ("placeholder", "title", "aria-label", "aria-description")


def scan_non_ascii(page, step):
    """Every string a renderer can draw, with the element each one came from.

    Leaf textContent alone is not enough: a placeholder is drawn, is not in
    textContent, and is exactly where Chinese has appeared before. Options are
    collected separately because their text is drawn in the dropdown rather
    than in the page flow.
    """
    hits = page.evaluate("""(attrs) => {
      const out = [];
      const visit = (el, where, text) => {
        if (!text) return;
        if (!/[^\\x00-\\x7f]/.test(text)) return;
        const cs = getComputedStyle(el);
        out.push({where, text: text.slice(0, 120), tag: el.tagName.toLowerCase(),
                  cls: (el.className || '').toString().slice(0, 40),
                  visible: cs.display !== 'none' && cs.visibility !== 'hidden'
                           && el.getBoundingClientRect().width > 0});
      };
      document.querySelectorAll('body *').forEach((e) => {
        if (!e.children.length) visit(e, 'textContent', (e.textContent || '').trim());
        attrs.forEach((a) => { if (e.hasAttribute(a)) visit(e, a, e.getAttribute(a)); });
      });
      document.querySelectorAll('option').forEach((o) => visit(o, 'option', (o.textContent || '').trim()));
      return out;
    }""", list(TEXT_ATTRS))
    cjk_hits = [h for h in hits if CJK.search(h["text"])]
    other = [h for h in hits if not CJK.search(h["text"])]
    return {"step": step,
            "cjk": sorted({m for h in cjk_hits for m in CJK.findall(h["text"])}),
            "cjk_hits": cjk_hits[:12],
            "other": sorted({c for h in other for c in h["text"] if ord(c) > 127})}


class Session:
    """A page with the console and network listeners the brief asks for."""

    def __init__(self, browser, base, recorder):
        self.console: list[str] = []
        self.http: list[str] = []
        self.clicks = 0
        self.ctx = browser.new_context(viewport={"width": 1440, "height": 900},
                                       locale="en-US",
                                       accept_downloads=True)
        self.page = self.ctx.new_page()
        self.page.on("console", lambda m: self.console.append(f"{m.type}: {m.text}")
                     if m.type in ("error", "warning") else None)
        self.page.on("pageerror", lambda e: self.console.append(f"pageerror: {e}"))
        self.page.on("response", lambda r: self.http.append(f"{r.status} {r.url}")
                     if r.status >= 400 else None)
        self.base = base
        self.recorder = recorder

    def goto(self, path="/"):
        self.page.goto(self.base + path, wait_until="load", timeout=45000)
        self.page.wait_for_timeout(2500)

    def click(self, selector, **kwargs):
        self.clicks += 1
        self.page.click(selector, **kwargs)

    def dismiss_dialog(self):
        """Close anything left open by the previous step.

        Without this, one failed step cascades: the dialog it opened stays up,
        its backdrop swallows every later click, and every remaining step fails
        with a 30s timeout that says nothing about the tool.
        """
        for _ in range(3):
            open_now = self.page.evaluate(
                "!!document.getElementById('dialog')?.hasAttribute('open')")
            if not open_now:
                return True
            self.page.keyboard.press("Escape")
            self.page.wait_for_timeout(350)
        return not self.page.evaluate(
            "!!document.getElementById('dialog')?.hasAttribute('open')")

    def step(self, number, title, body):
        carried = self.dismiss_dialog()
        self.console.clear()
        self.http.clear()
        self.clicks = 0
        if not carried:
            self.page.screenshot(path=str(self.recorder.out / f"S{number:02d}.png"))
            self.recorder.add(number, title, False,
                              "a dialog from the previous step could not be dismissed",
                              0.0, 0, [], [])
            print(f"  S{number:<2} FAIL  a dialog blocked this step")
            return False
        started = time.monotonic()
        ok, detail = False, ""
        try:
            ok, detail = body()
        except Exception as exc:                       # a broken step is data
            detail = f"{type(exc).__name__}: {str(exc)[:220]}"
        seconds = time.monotonic() - started
        self.page.screenshot(path=str(self.recorder.out / f"S{number:02d}.png"))
        self.recorder.non_ascii.append(scan_non_ascii(self.page, number))
        self.recorder.add(number, title, ok, detail, seconds, self.clicks,
                          list(self.console), list(self.http))
        mark = "PASS" if ok else "FAIL"
        print(f"  S{number:<2} {mark}  {seconds:5.1f}s  {self.clicks:>2} clicks  {title}"
              + ("" if ok else f"\n        ↳ {detail}"))
        return ok

    def close(self):
        self.ctx.close()


def build_server(port, data_dir):
    from qualicraft.server import create_server
    server = create_server(str(data_dir), str(REPO), port, "", "127.0.0.1", public_demo=False)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def run(args):
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    out = OUT_ROOT / f"run-{stamp}"
    out.mkdir(parents=True, exist_ok=True)

    import tempfile
    data_dir = Path(tempfile.mkdtemp(prefix="qc-e2e-"))
    port = free_port(args.port)
    server = build_server(port, data_dir)
    # No trailing slash: goto() supplies the path, and doubling it 404s.
    base = f"http://127.0.0.1:{port}"
    recorder = Recorder(out)
    print(f"QualiCraft e2e | {base} | data {data_dir}")
    print(f"output         | {out}\n")

    from playwright.sync_api import sync_playwright

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(channel="chrome", headless=args.headless)
            s = Session(browser, base, recorder)
            text = FIXTURE.read_text(encoding="utf-8")

            # ---- S1 · a fresh project ------------------------------------
            def block_state():
                """Which blocks are on, read from the panel's own class list."""
                return s.page.evaluate(
                    """() => Object.fromEntries([...document.querySelectorAll('#dialog [data-block]')]
                         .map((e) => [e.dataset.block, e.classList.contains('on')]))""")

            def enable_blocks(names):
                """Turn the needed blocks on — and only turn them on.

                The first version clicked every named block unconditionally. Most
                blocks are already on, so that switched them *off*: the codebook
                disappeared, the codes then appeared nowhere on the page, and the
                run reported a product defect that was in fact the harness
                disabling the feature. Read the state first, click only what is
                off, then assert the result — never assume the click worked.
                """
                s.click('[data-action="tools"]')
                s.page.wait_for_timeout(800)
                before = block_state()
                clicked = [b for b in names if not before.get(b, True)]
                for block in clicked:
                    s.page.click(f'[data-block="{block}"]')
                s.click('[data-action="save-blocks"]')
                s.page.wait_for_timeout(2000)
                after = {}
                nav = s.page.evaluate(
                    "() => [...document.querySelectorAll('[data-action=\"view\"]')].map(e => e.dataset.view)")
                return {"before": before, "clicked": clicked, "nav": nav,
                        # There is no `.codebook` element. The codebook is a
                        # collapsible section: a button with
                        # data-action="toggle-codebook", and the tree is only
                        # rendered after it. Asserting on the toggle is the
                        # closest thing to "the codebook is reachable".
                        "codebook_toggle": s.page.evaluate(
                            "!!document.querySelector('[data-action=\"toggle-codebook\"]')")}

            def s1():
                s.goto("/?lang=en")
                s.click('[data-action="projects"]')
                s.page.fill("#new-project-name", "Smoke – synthetic interview")
                s.click('[data-action="new-project"]')
                s.page.wait_for_timeout(2500)
                blocks = enable_blocks(["hierarchy", "insights", "plotting"])
                # Assert the blocks took effect. Without this, every later step
                # is tested against a configuration nobody checked — which is
                # how the previous run reported a product defect that was this
                # harness switching the codebook off.
                blocks_ok = ("plotting" in blocks["nav"] and "insights" in blocks["nav"]
                             and blocks["codebook_toggle"])
                name = s.page.evaluate(
                    "document.querySelector('.project-select, .breadcrumb, h1')?.textContent || ''")
                shape = check_fixture_shape()
                if not blocks_ok:
                    return False, f"capability blocks did not take effect: {blocks}"
                if not shape["ok"]:
                    return False, f"fixture out of shape: {shape}"
                return "synthetic" in name.lower() or "Smoke" in name, (
                    f"header={name[:44]!r} before={blocks['before']} "
                    f"clicked={blocks['clicked']} nav={blocks['nav']} "
                    f"codebook_toggle={blocks['codebook_toggle']}")

            def check_fixture_shape():
                """The fixture README promises the harness checks this.

                It did not, which made the README a claim about a check that
                did not exist. The promise is kept here instead of deleted: a
                fixture that drifts out of range would quietly stop exercising
                what the walkthrough assumes.
                """
                text = FIXTURE.read_text(encoding="utf-8")
                words = len(re.findall(r"[A-Za-z']+", text))
                paras = [l for l in text.split("\n") if l.strip()]
                labelled = [l for l in paras if re.match(r"(Interviewer|Participant):", l)]
                marks = text.count("**")
                return {"words": words, "paragraphs": len(labelled),
                        "markdown_markers": marks,
                        "ok": 1000 <= words <= 1400 and 20 <= len(labelled) <= 30 and marks == 0}

            # ---- S2 · import ---------------------------------------------
            def s2():
                s.click('[data-action="import"]')
                s.page.wait_for_timeout(600)
                s.page.set_input_files("#import-file", str(FIXTURE))
                s.page.wait_for_timeout(900)
                s.page.fill("#document-name", "Synthetic interview")
                s.click('[data-action="save-document"]')
                s.page.wait_for_timeout(3000)
                n = s.page.evaluate("document.querySelectorAll('.side-item').length")
                reader = s.page.evaluate(
                    "document.querySelector('.document-pane')?.innerText || ''")
                numbered = bool(re.search(r"^\s*1[\.\)]?\s", reader, re.M)) or "1" in reader[:200]
                marks = reader.count("**")
                return (n >= 1 and marks == 0), f"documents={n} markdown_markers={marks} numbered={numbered}"

            # ---- S3 · code one passage -----------------------------------
            def code_passage(index=0):
                s.page.evaluate("""(i) => {
                  const ps = [...document.querySelectorAll('.paragraph')]
                    .filter((x) => x.querySelector('.passage'));
                  const p = ps[i];
                  if (p) p.scrollIntoView({ block: 'center' });
                }""", index)
                s.page.wait_for_timeout(400)
                picked = s.page.evaluate("""(i) => {
                  const ps = [...document.querySelectorAll('.paragraph')]
                    .filter((x) => x.querySelector('.passage'));
                  const p = ps[i];
                  if (!p) return 0;
                  const holder = p.querySelector('.passage');
                  const node = [...holder.childNodes]
                    .find((n) => n.nodeType === 3 && n.textContent.trim().length > 40);
                  if (!node) return 0;
                  const r = document.createRange();
                  r.setStart(node, 0); r.setEnd(node, Math.min(70, node.textContent.length));
                  const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
                  holder.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                  return 1;
                }""", index)
                s.page.wait_for_timeout(700)
                return picked

            def s3():
                picked = code_passage(0)
                s.page.fill("#code-search", "Isolation")
                s.page.keyboard.press("Enter")
                s.page.wait_for_timeout(1400)
                pills = s.page.evaluate("document.querySelectorAll('.margin-tags .pill').length")
                return pills >= 1, f"selection={picked} margin_pills={pills}"

            # ---- S4 · ten passages --------------------------------------
            def s4():
                made = 0
                for i in range(1, 10):
                    if code_passage(i):
                        s.page.fill("#code-search", "Isolation")
                        s.page.keyboard.press("Enter")
                        s.page.wait_for_timeout(700)
                        made += 1
                pills = s.page.evaluate("document.querySelectorAll('.margin-tags .pill').length")
                return pills >= 9, f"attempted={made} margin_pills={pills}"

            # ---- S5 · a parent code -------------------------------------
            def expand_codebook():
                """Open the CODEBOOK section.

                It is collapsed by default (`codebookOpen:false`), and the tree
                is only rendered when open. Searching for a `.codebook` element
                therefore found nothing even though codes existed — the whole
                "codes appear nowhere" finding was this collapsed section, not
                a rendering defect.
                """
                if s.page.evaluate("!!document.querySelector('[data-action=\"toggle-codebook\"][aria-expanded=\"false\"]')"):
                    s.click('[data-action="toggle-codebook"]')
                    s.page.wait_for_timeout(700)

            def code_names_on_screen():
                return s.page.evaluate(
                    """() => [...document.querySelectorAll('.code-row .side-item .name')]
                         .map((e) => e.textContent.trim())""")

            def s5():
                # The create dialog offers a name, definition and colour. A
                # parent selector appears only from the second code onwards and
                # only with the hierarchy block on — so the first code has none
                # by design, which is the opposite of what the first version of
                # this step claimed.
                made = []
                for name in ("Barriers", "Schedule", "Feedback"):
                    s.click('[data-action="code"]')
                    s.page.wait_for_timeout(600)
                    s.page.fill("#code-name", name)
                    s.click('[data-action="save-code"]')
                    s.page.wait_for_timeout(800)
                    made.append(name)
                expand_codebook()
                listed = code_names_on_screen()
                seen = {n: any(n == got or got.startswith(n) for got in listed) for n in made}
                return all(seen.values()), (
                    f"created={made} codebook_rows={listed} visible={seen}")

            # ---- S6 · themes --------------------------------------------
            def s6():
                """Actually group: put two codes under a parent and check the tree.

                The previous version only asked whether a string appeared in a
                container that never existed, so it tested nothing at all.
                """
                grouped = []
                for name in ("Isolation under Barriers", "Feedback under Barriers"):
                    s.click('[data-action="code"]')
                    s.page.wait_for_timeout(600)
                    s.page.fill("#code-name", name)
                    offers_parent = s.page.evaluate("!!document.querySelector('#code-parent')")
                    if offers_parent:
                        s.page.select_option("#code-parent", label="Barriers")
                    s.click('[data-action="save-code"]')
                    s.page.wait_for_timeout(800)
                    grouped.append({"name": name, "parent_offered": offers_parent})
                expand_codebook()
                tree = s.page.evaluate("""() => ({
                  rows: [...document.querySelectorAll('.code-row')].map((r) => ({
                    depth: (getComputedStyle(r).getPropertyValue('--depth') || '').trim(),
                    name: (r.querySelector('.name')?.textContent || '').trim(),
                  })),
                })""")
                nested = [r for r in tree["rows"] if r["depth"] not in ("", "0")]
                ok = len(grouped) == 2 and all(g["parent_offered"] for g in grouped) and len(nested) >= 2
                return ok, f"grouped={grouped} rows={tree['rows']} nested={len(nested)}"

            # ---- S7 · the three analysis views --------------------------
            def s7():
                """The analysis views, each matched against its own unit sentence.

                The old regex accepted "count" or "unit" anywhere, which any
                paragraph would satisfy, and it included the coding view, which
                is not an analysis view. The sentences below are the ones the
                application actually prints (qualicraft/plotting.py
                CREDIT_DEFAULTS and the frequency description).
                """
                # The exact sentences each view prints. The Insights view uses
                # its own wording — measured, not assumed: it says "Frequency is
                # not importance or a count of participants". The figure credit
                # text is different again and belongs to the figures.
                UNITS = {
                    "insights": "frequency is not importance or a count of participants",
                    "plotting": "not participants",
                }
                found = []
                for view, sentence in UNITS.items():
                    s.click(f'[data-action="view"][data-view="{view}"]')
                    s.page.wait_for_timeout(2000)
                    body = s.page.evaluate(
                        "document.querySelector('.view-body')?.innerText || document.body.innerText")
                    hit = sentence.lower() in body.lower()
                    # The project has been removing "publication-ready" claims.
                    # This view still carries one, so it is recorded wherever it
                    # appears rather than only on the step that looks for it.
                    paper = "put in a paper" in body.lower()
                    found.append(f"{view}:{'unit-stated' if hit else 'UNIT-NOT-STATED'}"
                                 + ("/claims-paper" if paper else ""))
                return all("NOT-STATED" not in f for f in found), "; ".join(found)

            # ---- S8 · five figure kinds ---------------------------------
            def s8():
                """Every figure kind draws, and states its counting unit.

                The control's option values are opaque ids, so the visible label
                is read alongside them: a log line reading
                "297d6bb8...:MISSING" tells a reader nothing about which figure
                failed.
                """
                s.click('[data-action="view"][data-view="plotting"]')
                s.page.wait_for_timeout(2400)
                pairs = s.page.evaluate("""() => {
                  // By option content, never by index: index 0 is the
                  // project switcher, which is how the previous run selected
                  // the wrong control entirely.
                  const sel = [...document.querySelectorAll('select')].find(
                    (x) => [...x.options].filter((o) => /code frequency|co-occurrence|accumulation/i.test(o.textContent)).length >= 3);
                  if (!sel) return [];
                  sel.id = 'e2e-figure-kind';
                  return [...sel.options].map((o) => ({ value: o.value, label: o.textContent.trim() }));
                }""")
                results = []
                for pair in pairs[:5]:
                    s.page.select_option("#e2e-figure-kind", pair["value"])
                    s.page.wait_for_timeout(2800)
                    drawn = s.page.evaluate(
                        "!!document.querySelector('.plot-stage svg, .plot-stage img, .plot-preview svg, .plot-preview img')")
                    credit = s.page.evaluate("""() => {
                      const t = document.querySelector('.plot-stage, .plot-preview')?.innerText || '';
                      return /not participants|not correlation|not saturation|descriptive/i.test(t);
                    }""")
                    results.append(f"{pair['label']}:{'drawn' if drawn else 'NOT-DRAWN'}"
                                   f"{'/unit-stated' if credit else '/NO-UNIT-STATEMENT'}")
                ok = (len(results) >= 5
                      and all("NOT-DRAWN" not in r for r in results)
                      and all("NO-UNIT-STATEMENT" not in r for r in results))
                return ok, "; ".join(results) or "no figure-kind control found"

            # ---- S9 · exports -------------------------------------------
            def s9():
                """Export each file, selecting the row by its own attributes.

                The old version clicked `text=CSV`, which is a substring match
                across the whole page and very likely hit something else — a
                plausible explanation for the timeout, and one this version
                settles by recording the element it actually clicked.
                """
                s.click('[data-action="export"]')
                s.page.wait_for_timeout(1000)
                buttons = s.page.evaluate("""() => [...document.querySelectorAll('#dialog [data-action="download"]')]
                     .map((b) => ({ html: b.outerHTML.slice(0, 160), text: (b.textContent || '').trim().slice(0, 40) }))""")
                got = []
                for index, meta in enumerate(buttons):
                    try:
                        with s.page.expect_download(timeout=20000) as dl:
                            s.page.evaluate(
                                "(i) => document.querySelectorAll('#dialog [data-action=\"download\"]')[i].click()",
                                index)
                        path = out / f"export-{dl.value.suggested_filename}"
                        dl.value.save_as(str(path))
                        got.append(f"{meta['text']}={path.stat().st_size}B")
                    except Exception as exc:
                        got.append(f"{meta['text']}: {type(exc).__name__}")
                    s.page.wait_for_timeout(500)
                ok = bool(buttons) and all("=" in g for g in got)
                return ok, f"clicked={[b['html'][:70] for b in buttons]} results={got}"

            def s10():
                """Restore a snapshot and check a *new* project exists.

                The old condition was `documents_after >= 1`, which is true the
                moment S2 imports anything and therefore proved nothing at all.
                """
                # `window.state` is not exposed, so the previous version read
                # empty strings and zeroes and could never pass. Read the name
                # from the DOM and the counts from the API the page itself uses.
                def snapshot():
                    return {"name": s.page.evaluate(
                                "document.querySelector('.project-select, .breadcrumb h1, h1')?.textContent.trim() || ''"),
                            "projects": s.page.evaluate(
                                "document.querySelectorAll('.side-item[data-action=\"doc\"]').length > 0"
                                " ? document.querySelector('#project-select, .project-select')?.options.length || 0"
                                " : 0"),
                            "code_count": s.page.evaluate(
                                "document.querySelector('[data-action=\"toggle-codebook\"] .count')?.textContent.trim() || ''")}
                project_before = snapshot()
                s.click('[data-action="snapshots"]')
                s.page.wait_for_timeout(1200)
                rows = s.page.query_selector_all(".snap-row button")
                if not rows:
                    return False, "no snapshot rows offered"
                rows[0].click()
                s.page.wait_for_timeout(3000)
                after = snapshot()
                ok = ("restored" in after["name"].lower()
                      and after["projects"] == project_before["projects"] + 1)
                return ok, f"before={project_before} | after={after}"

            for number, title, body in [
                (1, "new project", s1), (2, "import transcript", s2),
                (3, "code one passage", s3), (4, "code ten passages", s4),
                (5, "parent code", s5), (6, "themes", s6),
                (7, "analysis views state their units", s7),
                (8, "five figure kinds", s8), (9, "exports", s9),
                (10, "snapshot and restore", s10),
            ]:
                s.step(number, title, body)

            s.close()
            browser.close()
    finally:
        server.shutdown()

    payload = {"run": stamp, "base": base, "summary": recorder.summary(),
               "steps": recorder.rows, "non_ascii": recorder.non_ascii}
    (out / "results.json").write_text(json.dumps(payload, indent=1, ensure_ascii=False),
                                      encoding="utf-8")
    summary = recorder.summary()
    print(f"\n  {summary['passed']}/{summary['steps']} steps passed, "
          f"{summary['seconds']}s total, {summary['console_errors']} console errors, "
          f"{summary['http_errors']} http errors")
    print(f"  wrote {out}/results.json")
    cjk_steps = [n["step"] for n in recorder.non_ascii if n["cjk"]]
    print(f"  steps with CJK on screen: {cjk_steps or 'none'}")
    return 0 if summary["failed"] == 0 else 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8890)
    ap.add_argument("--headless", default="true")
    args = ap.parse_args()
    args.headless = str(args.headless).lower() not in ("false", "0", "no")
    return run(args)


if __name__ == "__main__":
    raise SystemExit(main())
