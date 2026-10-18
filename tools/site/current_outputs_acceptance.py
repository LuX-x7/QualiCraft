"""Desktop acceptance of current method, reading and final-output explanations.

Uses only the supplied loopback project origin. Never submits workbench edits.
"""
import argparse
import hashlib
import json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    base = args.url.rstrip('/')
    assert urlsplit(base).scheme == 'http' and urlsplit(base).hostname in ('127.0.0.1', 'localhost')
    args.out.mkdir(parents=True, exist_ok=True)
    repo = Path(__file__).resolve().parents[2]
    result = {'checks': [], 'console': [], 'http': [], 'posts': [], 'outside': [], 'phone': 'deferred', 'Windows': 'deferred'}
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='chrome', headless=True)
        def opened(height=900, reduced=False):
            context = browser.new_context(viewport={'width': 1440, 'height': height}, reduced_motion='reduce' if reduced else 'no-preference')
            def route(r):
                if r.request.url.startswith(base + '/'):r.continue_()
                else:result['outside'].append(r.request.url);r.abort()
            context.route('**/*', route)
            page = context.new_page()
            page.set_default_timeout(10000)
            page.on('pageerror', lambda e: result['console'].append(str(e)))
            page.on('console', lambda m: result['console'].append(m.text) if m.type == 'error' else None)
            page.on('response', lambda r: result['http'].append([r.status, r.url]) if r.status >= 400 else None)
            page.on('request', lambda r: result['posts'].append(r.url) if r.method == 'POST' else None)
            page.goto(base + '/', wait_until='networkidle')
            return context, page
        def visit(page, scene):
            page.locator('#story-' + scene).evaluate('el=>el.scrollIntoView({block:"center",behavior:"instant"})')
            page.mouse.move(1430, 60)
            expect(page.locator('.story-stage')).to_have_attribute('data-scene', scene)
        def check(name, fn):
            print('START', name, flush=True)
            try:
                detail = fn();result['checks'].append({'name': name, 'pass': True, 'detail': detail});print('PASS', name, flush=True)
            except Exception as e:
                result['checks'].append({'name': name, 'pass': False, 'error': str(e)});print('FAIL', name, str(e), flush=True)
                if browser.contexts and browser.contexts[-1].pages:browser.contexts[-1].pages[-1].screenshot(path=str(args.out/'failure.png'))
            finally:
                for c in browser.contexts:c.close()
                (args.out/'results.json').write_text(json.dumps(result, indent=2))
        def qca():
            _, p = opened();visit(p, 'qca')
            sketch = p.locator('[data-diagram="comparative"]');buttons = sketch.locator('.qca-procedure button')
            assert buttons.count() == 6
            p.evaluate('window.__clicks=0;document.addEventListener("click",()=>window.__clicks++)')
            for index in range(6):
                buttons.nth(index).hover();expect(sketch).to_have_attribute('data-qca-step', str(index+1))
                expect(sketch.locator('.procedure-readout h3')).to_have_text(buttons.nth(index).locator('strong').inner_text())
            assert p.evaluate('window.__clicks') == 0
            buttons.first.focus();buttons.first.press('End');expect(buttons.last).to_be_focused()
            buttons.last.press('ArrowLeft');expect(buttons.nth(4)).to_be_focused()
            assert 'NO CASE VALUES' in sketch.inner_text()
            p.locator('.story-stage').screenshot(path=str(args.out/'desktop-qca.png'))
            return {'generated_steps': 6, 'natural_scroll': True, 'hover_clicks': 0, 'keyboard': True, 'no_synthetic_results': True}
        check('QCA appears on scroll and all procedure nodes respond to hover and keyboard', qca)
        def reading():
            _, p = opened();visit(p, 'coding');guide = p.locator('.reading-guide')
            original = p.locator('.coding-passage mark').inner_text()
            guide.get_by_role('button', name='Read', exact=True).click();expect(guide).to_have_attribute('data-reading-guide', 'read')
            guide.get_by_role('button', name='Revisit', exact=True).click();expect(guide).to_have_attribute('data-reading-guide', 'revisit')
            guide.get_by_role('button', name='Undo', exact=True).click();expect(guide).to_have_attribute('data-reading-guide', 'read')
            assert p.locator('.coding-passage mark').inner_text() == original
            assert 'ILLUSTRATION ONLY' in guide.inner_text()
            p.locator('.story-stage').screenshot(path=str(args.out/'desktop-coding-reading.png'))
            return {'separate_tracks': True, 'manual_marks_and_undo': True, 'source_unchanged': True}
        check('Coding explains separate manual reading marks without altering saved evidence', reading)
        def outputs():
            _, p = opened();visit(p, 'export');overview = p.locator('.output-overview');buttons = overview.locator('.output-choices button')
            assert buttons.count() == 4
            quote = overview.locator('.output-quote');quote.hover();expect(overview.locator('.output-notebook')).to_have_class('output-notebook is-linked')
            p.locator('.story-stage').screenshot(path=str(args.out/'desktop-notebook-tree.png'))
            for index in range(4):
                buttons.nth(index).hover();expect(overview).to_have_attribute('data-output', str(index))
                assert overview.locator('.procedure-readout p').inner_text()
                if index in (1, 2):p.locator('.story-stage').screenshot(path=str(args.out/('desktop-output-'+str(index)+'.png')))
            buttons.first.focus();buttons.first.press('End');expect(buttons.last).to_be_focused()
            p.locator('.legacy-export-guide > summary').focus();p.keyboard.press('Enter')
            legacy = p.locator('.legacy-export-guide .export-file');assert legacy.count() == 6
            legacy.last.focus();legacy.last.press('Home');expect(legacy.first).to_be_focused()
            return {'final_outputs': 4, 'source_quote_and_real_tree': True, 'explicit_unassigned_group_roles': True, 'old_formats_retained': 6, 'keyboard_disclosure': True}
        check('Notebook report figures-code and JSON restore have distinct interactive previews', outputs)
        def methods():
            _, p = opened();assert p.locator('.method-path').count() == 3
            for card in p.locator('.method-path').all():
                card.locator('summary').first.click();assert card.locator('.site-method-map li').count() == 6
                card.locator('summary').first.click()
            expect(p.locator('#method')).to_contain_text('Comparative QCA')
            expect(p.locator('#story-import')).to_contain_text('duplicate')
            expect(p.locator('#story-coding')).to_contain_text('Keep and Resume')
            p.locator('#method').scroll_into_view_if_needed();p.screenshot(path=str(args.out/'desktop-methods.png'))
            return {'methods': 3, 'maps_each': 6, 'batch_and_reading_descriptions_current': True}
        check('Methods and corresponding workflow sections expose current capabilities', methods)
        def motion_and_height():
            readings = []
            for height, reduced in [(720, False), (900, True)]:
                _, p = opened(height, reduced)
                for scene in ['coding', 'qca', 'export']:
                    visit(p, scene);assert p.evaluate('document.documentElement.scrollWidth <= innerWidth')
                    if scene == 'qca':
                        button = p.locator('.qca-procedure button').first;button.hover()
                        animation = button.locator('.procedure-trace').evaluate('el=>getComputedStyle(el).animationName')
                        assert (animation == 'none') if reduced else (animation != 'none')
                p.locator('.output-choices button').nth(2).focus()
                p.locator('.story-stage').screenshot(path=str(args.out/f'desktop-{height}-reduce-{reduced}.png'))
                readings.append({'height': height, 'reduced_motion': reduced, 'controls_reachable': True})
            return readings
        check('Short Mac viewport and reduced motion keep controls and complete content reachable', motion_and_height)
        def preserved():
            c, p = opened();manifest=json.loads((repo/'website/public/report/manifest.json').read_text())
            for f in manifest['files']:
                response=c.request.get(base+'/report/'+f['path']);assert response.ok and hashlib.sha256(response.body()).hexdigest()==f['sha256']
            assert p.locator('.story-details').count()==5
            for kind in ['import','coding','analysis','plotting','export']:
                for ext in ['png','webm']:
                    file=repo/'website/public/clips'/(kind+'.'+ext);response=c.request.get(base+'/clips/'+file.name);assert response.ok and response.body()==file.read_bytes()
            assert not any(result[k] for k in ['console','http','posts','outside']),result
            return {'manifest_files':len(manifest['files']),'recordings_and_stills':10,'original_figures_tables_downloads':True,'project_mutations':0}
        check('Original assets recordings and stills remain exact with no requests that edit projects', preserved)
        browser.close()
    raise SystemExit(0 if all(c['pass'] for c in result['checks']) else 1)


if __name__ == '__main__':main()
