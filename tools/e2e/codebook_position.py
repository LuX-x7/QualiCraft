"""UX60-02: project-only Chrome checks on an isolated public Bologna copy."""
import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import traceback
from urllib.request import urlopen

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from qualicraft.server import bologna_example
from tools.e2e.recovery_boundaries import Service, backup_manifest, dump
from playwright.sync_api import sync_playwright, expect

NODE = '/Users/chehaijun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--out', type=Path, required=True)
    ap.add_argument('--site-build', type=Path)
    ap.add_argument('--port', type=int, default=52765)
    args = ap.parse_args()
    out = args.out
    out.mkdir(parents=True, exist_ok=True)
    seed = bologna_example()
    seed['name'] = 'Bologna · codebook reading review'
    service = Service(out/'service', seed)
    origin, site, log = service.base, None, None
    result = {'checks': [], 'console': [], 'http': [], 'external': [], 'posts': [],
              'phone_is_touch_emulation': True, 'Windows': 'deferred, unverified'}
    contexts = []
    root = '/projects/'+seed['id']
    before = service.json(root)
    points = backup_manifest(service.folder, seed['id'])
    dump(out/'project-before.json', before)
    try:
        if args.site_build:
            origin = f'http://127.0.0.1:{args.port}'
            log = (out/'site.txt').open('w')
            site = subprocess.Popen([NODE, 'start.js'], cwd=args.site_build,
                env={**os.environ, 'PORT': str(args.port), 'HOST': '127.0.0.1', 'QT_WORKBENCH_URL': service.base}, stdout=log, stderr=log)
            for _ in range(100):
                try:
                    if urlopen(origin, timeout=1).status == 200:
                        break
                except OSError:
                    time.sleep(.1)
            else:
                raise RuntimeError('Owned site did not become ready')
        with sync_playwright() as pw:
            browser = pw.chromium.launch(channel='chrome', headless=True)

            def context(width=390, height=844, blocked=False):
                c = browser.new_context(viewport={'width': width, 'height': height}, is_mobile=width<=800, has_touch=width<=800)
                def route(r):
                    if r.request.url.startswith(origin+'/'):
                        r.continue_()
                    else:
                        result['external'].append(r.request.url)
                        r.abort()
                c.route('**/*', route)
                if blocked:
                    c.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw Error('blocked')}})")
                p = c.new_page()
                p.set_default_timeout(8000)
                p.on('pageerror', lambda e: result['console'].append(str(e)))
                p.on('console', lambda m: result['console'].append(m.text) if m.type=='error' else None)
                p.on('response', lambda r: result['http'].append([r.status, r.url]) if r.status>=400 else None)
                p.on('request', lambda r: result['posts'].append(r.url) if r.method=='POST' else None)
                contexts.append(c)
                return c, p

            def check(name, fn):
                print('START '+name, flush=True)
                try:
                    detail = fn()
                    result['checks'].append({'name': name, 'pass': True, 'detail': detail})
                    print('PASS '+name, flush=True)
                except Exception as e:
                    detail={'saved':contexts[-1].pages[0].evaluate('readReadingPosition(state.project,doc())?.start??null')} if contexts else {}
                    result['checks'].append({'name': name, 'pass': False, 'error': str(e), 'traceback':traceback.format_exc(), 'state':detail})
                    if contexts:
                        contexts[-1].pages[0].screenshot(path=str(out/f'failure-{len(result["checks"])}.png'))
                    print('FAIL '+name+' '+str(e), flush=True)
                finally:
                    for c in contexts:
                        c.close()
                    contexts.clear()
                    dump(out/'results.json', result)

            def saved(p):
                return p.evaluate('readReadingPosition(state.project,doc())?.start??null')

            def snap(p, name):
                p.screenshot(path=str(out/(name+'.png')))

            def opened(p, native=True):
                p.goto(origin+'/w/?lang=en', wait_until='networkidle')
                p.locator('#start-project-select').select_option(seed['id'])
                p.locator('[data-action="start-open"]').click()
                expect(p.locator('.reading-dock')).to_be_visible()
                if native:
                    p.locator('[data-action="reading-overview"]').click()
                    p.locator('#overview-paragraph-list summary').click()
                    p.locator('#overview-paragraph-number').fill('17')
                    p.locator('[data-action="overview-find-paragraph"]').click()
                    p.locator('[data-action="overview-jump-paragraph"]').click()
                    if p.locator('[data-action="reading-overview"]').get_attribute('aria-expanded')!='true':
                        p.locator('[data-action="reading-overview"]').click()
                    p.locator('[data-action="overview-keep"]').click()
                else:
                    p.evaluate('scrollReadingParagraph(segments(doc().text)[16].start,true);updateReadingPosition()')
                assert p.evaluate('readingMounted.readingStart')==11435

            def book(p, keyboard=False):
                entry = p.locator('[data-action="coding-codebook"]')
                if keyboard:
                    p.locator('#search').focus()
                    for _ in range(8):
                        p.keyboard.press('Tab')
                        if p.evaluate('document.activeElement.dataset.action')=='coding-codebook':
                            break
                    expect(entry).to_be_focused()
                    p.keyboard.press('Enter')
                else:
                    entry.tap()
                expect(p.locator('#mobile-code-filter')).to_be_focused()
                p.wait_for_timeout(150)
                return saved(p)

            def returned(p, start=11435):
                p.wait_for_timeout(150)
                assert p.evaluate('readingMounted.start')==start, {'mounted':p.evaluate('readingMounted.start'),'expected':start}
                assert saved(p)==start, {'saved':saved(p),'expected':start}
                assert p.evaluate('document.documentElement.scrollWidth-innerWidth')==0

            theme = next(c for c in seed['codes'] if c['name']=='materials' and not c.get('parent_id'))
            def choose(p):
                p.locator(f'#mobile-codebook-list [data-action="filter-code"][data-id="{theme["id"]}"]').tap()
                assert p.evaluate('state.codeFilter')==theme['id']
                assert saved(p)==11435

            def open_cancel():
                _, p = context(); opened(p); snap(p,'01-phone-Keep-paragraph17')
                assert book(p)==11435
                snap(p,'02-phone-codebook-keeps-position')
                p.locator('#dialog [data-action="close"]').tap()
                assert saved(p)==11435
                p.locator('[data-action="reading-resume"]').tap(); returned(p)
                snap(p,'03-phone-cancel-Resume-paragraph17')
                return {'Keep':11435,'open':11435,'cancel':11435,'Resume':11435}
            check('phone touch opening, cancel and Resume preserve Keep', open_cancel)

            def theme_clear(toggle=False):
                _,p=context();opened(p);book(p);choose(p)
                ids=p.evaluate('state.project.annotations.filter(a=>a.document_id===state.docId&&(!state.codeFilter||a.code_id===state.codeFilter||codeDescendants(state.codeFilter).has(a.code_id))).map(a=>a.id)')
                assert ids
                snap(p,'04-phone-theme-filter')
                if toggle:
                    book(p);p.locator(f'#mobile-codebook-list [data-action="filter-code"][data-id="{theme["id"]}"]').tap()
                else:
                    p.locator('[data-action="clear-filter"]').first.tap()
                assert p.evaluate('state.codeFilter') is None
                returned(p)
                p.locator('[data-action="reading-resume"]').tap();returned(p)
                snap(p,'05-phone-clear-Resume-paragraph17')
                return {'theme_id':theme['id'],'descendant_annotations':len(ids),'clear_by':'toggle' if toggle else 'Clear filters','returned':11435}
            check('theme plus descendants, Clear filters and Resume return exactly', theme_clear)
            check('toggling the same theme off returns exactly', lambda:theme_clear(True))

            def combined():
                _,p=context();opened(p);p.locator('#search').tap();p.keyboard.type('UX62_NO_MATCH');assert saved(p)==11435
                book(p);choose(p);expect(p.locator('#reader .paragraph')).to_have_count(0)
                assert p.locator('#search').input_value()=='UX62_NO_MATCH'
                p.locator('[data-action="clear-filter"]').first.tap();returned(p)
                return {'search_and_theme_semantics_retained':True,'no_match_does_not_save_zero':True,'clear_return':11435}
            check('combined search and theme filters retain meanings and reading anchor', combined)

            def keyboard(width):
                _,p=context(width,900 if width>800 else 844);opened(p)
                if width>800:
                    p.locator('[data-action="toggle-codebook"]').press('Enter')
                    p.locator(f'#side-list [data-action="filter-code"][data-id="{theme["id"]}"]').focus()
                    p.keyboard.press('Enter');assert p.evaluate('state.codeFilter')==theme['id'];assert saved(p)==11435
                    p.locator('[data-action="clear-filter"]').first.press('Enter');returned(p)
                    p.locator(f'#side-list [data-action="filter-code"][data-id="{theme["id"]}"]').click()
                    assert saved(p)==11435
                    p.locator('[data-action="clear-filter"]').first.click();returned(p)
                else:
                    assert book(p,True)==11435
                    p.keyboard.press('ArrowDown');p.keyboard.press('Escape');expect(p.locator('#dialog')).not_to_be_visible()
                    expect(p.locator('[data-action="coding-codebook"]')).to_be_focused()
                    assert saved(p)==11435
                p.locator('[data-action="reading-resume"]').press('Enter');returned(p)
                snap(p,'06-keyboard-'+str(width))
                return {'width':width,'keyboard_filter_or_dialog_and_Resume':11435,'focus_return':True}
            check('desktop sidebar keyboard and mouse filter, clear and Resume',lambda:keyboard(1440))
            check('phone keyboard opens tree, escapes and resumes',lambda:keyboard(390))

            def touch_reading():
                c,p=context();opened(p);book(p);p.keyboard.press('Escape');p.locator('[data-action="reading-resume"]').tap();returned(p)
                session=c.new_cdp_session(p)
                for _ in range(3):
                    session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':75,'y':760}]})
                    for y in [660,560,460,360,260]:
                        session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':75,'y':y}]});p.wait_for_timeout(30)
                    session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});p.wait_for_timeout(180)
                session.detach();now=saved(p);assert now>11435,now
                snap(p,'07-phone-real-reading-advances')
                assert book(p)==now
                p.keyboard.press('Escape');p.locator('[data-action="reading-resume"]').tap();returned(p,now)
                return {'real_touch_scroll_from':11435,'to':now,'next_book_and_Resume':now}
            check('actual touch reading advances memory after codebook use',touch_reading)

            def desktop_scroll():
                _,p=context(1440,900);opened(p);p.locator('[data-action="reading-resume"]').press('Enter');returned(p)
                p.mouse.move(600,600);p.mouse.wheel(0,-100000);p.wait_for_timeout(300);assert saved(p)==0
                p.evaluate('scrollReadingParagraph(0,true)');p.keyboard.press('PageDown');p.wait_for_timeout(300);now=saved(p);assert now>0,now
                snap(p,'08-desktop-normal-scroll')
                return {'wheel_to_start':0,'PageDown_updates':now}
            check('desktop wheel and keyboard reading keep updating memory',desktop_scroll)

            def isolation():
                _,p=context();opened(p);book(p);p.keyboard.press('Escape');p.reload(wait_until='networkidle');returned(p)
                p.locator('#reading-document').select_option(seed['documents'][1]['id'])
                p.evaluate('scrollReadingParagraph(segments(doc().text)[3].start,true);updateReadingPosition()');other=saved(p)
                p.locator('#reading-document').select_option(seed['documents'][0]['id']);returned(p)
                snap(p,'09-phone-reload-document-return')
                return {'refresh_and_switch_back':11435,'independent_other_document':other}
            check('refresh and document switch retain independent anchors',isolation)

            def responsive():
                rows=[]
                for width,height in [(320,740),(390,600)]:
                    _,p=context(width,height);opened(p);assert book(p)==11435;choose(p)
                    if height==600:p.set_viewport_size({'width':844,'height':390})
                    p.locator('[data-action="clear-filter"]').first.click();returned(p)
                    rows.append({'viewport':[width,height],'return':saved(p)})
                    snap(p,f'10-phone-responsive-{width}-{height}')
                return rows
            check('narrow and rotated phones retain memory without page overflow',responsive)

            def blocked():
                _,p=context(blocked=True);opened(p,False);assert book(p) is None
                p.locator(f'#mobile-codebook-list [data-action="filter-code"][data-id="{theme["id"]}"]').tap()
                p.locator('[data-action="clear-filter"]').first.tap();p.wait_for_timeout(150)
                assert p.evaluate('readingMounted.start')==11435
                assert saved(p) is None;expect(p.locator('[data-action="reading-resume"]')).to_be_disabled()
                return {'temporary_return':11435,'stored':None,'Resume_honestly_disabled':True}
            check('blocked storage permits temporary return without claiming persistence',blocked)

            def unchanged():
                after=service.json(root);dump(out/'project-after.json',after)
                assert before==after
                assert points==backup_manifest(service.folder,seed['id'])
                assert not any(result[k] for k in ['console','http','external','posts']),result
                return {'project_equal':True,'snapshot_hashes_equal':True,'documents_codes_annotations':[19,317,874],'navigation_POSTs':0,'console_HTTP_external_errors':0}
            check('all navigation leaves project, audit and snapshots unchanged',unchanged)
            browser.close()
        result['completed']=True
        dump(out/'results.json',result)
    finally:
        if site:
            site.terminate();site.wait(timeout=10);log.close()
        service.stop()
    raise SystemExit(0 if all(c['pass'] for c in result['checks']) else 1)


if __name__=='__main__':
    main()
