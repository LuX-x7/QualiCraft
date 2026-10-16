"""UX-27: compare the live site/report/workbench identity on disposable Bologna.

Only the supplied loopback origin is visited; unrelated tabs are never attached.
"""
import argparse
import json
import traceback
from pathlib import Path
from urllib.parse import urlsplit, unquote

from playwright.sync_api import sync_playwright, expect

PID = 'a71a0b538c024c3ab23fb4286cfe93e2'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', required=True)
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    base = args.url.rstrip('/')
    assert urlsplit(base).hostname in ('127.0.0.1', 'localhost') and urlsplit(base).scheme == 'http'
    out = Path(args.out); (out/'screenshots').mkdir(parents=True, exist_ok=True)
    results = {'checks': [], 'console': [], 'http': [], 'posts': []}

    def save():
        (out/'results.json').write_text(json.dumps(results, ensure_ascii=False, indent=2))

    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='chrome', headless=True)

        def context(**options):
            ctx = browser.new_context(accept_downloads=True, **options)
            ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith(base+'/') else r.abort())
            page = ctx.new_page(); page.set_default_timeout(10000)
            page.on('pageerror', lambda e: results['console'].append(str(e)))
            page.on('console', lambda m: results['console'].append(m.text) if m.type == 'error' else None)
            page.on('response', lambda r: results['http'].append([r.status, r.url]) if r.status >= 400 else None)
            page.on('request', lambda r: results['posts'].append(r.url) if r.method == 'POST' else None)
            return ctx, page

        ctx, page = context(viewport={'width': 1440, 'height': 900})
        boot = ctx.request.get(base+'/w/api/bootstrap').json()
        headers = {'X-QualiCraft-Token': boot['token']}
        project_url = base+'/w/api/projects/'+PID
        original = ctx.request.get(project_url, headers=headers).json()
        assert original['name'] == 'Bologna · What is data?' and len(original['annotations']) == 874
        snapshots = ctx.request.get(project_url+'/backups', headers=headers).json()['items']

        def snap(p, name):
            p.screenshot(path=str(out/'screenshots'/(name+'.png')))

        def check(name, fn):
            print('START', name, flush=True)
            try:
                results['checks'].append({'name': name, 'pass': True, 'evidence': fn()})
                print('PASS', name, flush=True)
            except Exception as exc:
                results['checks'].append({'name': name, 'pass': False, 'error': str(exc), 'traceback': traceback.format_exc()})
                snap(page, 'failure-'+str(len(results['checks'])))
                print('FAIL', name, str(exc), flush=True)
            save()

        def open_original(p):
            p.goto(base+'/w?lang=en', wait_until='networkidle')
            if p.locator('#start-project-select').count():
                p.locator('#start-project-select').select_option(PID)
                p.locator('[data-action="start-open"]').click()
            expect(p.locator('#reading-document')).to_be_visible()
            assert p.locator('#project-select').input_value() == PID

        def mark(p, selector, svg=False):
            return p.locator(selector).evaluate('''(el,svg)=>{
                const box=el.getBoundingClientRect();
                return [...el.querySelectorAll(svg?'rect':'[class*="qtmark__cell--"]')].map(cell=>{
                    const r=cell.getBoundingClientRect(),s=getComputedStyle(cell);
                    return [Math.round((r.x-box.x)*55/box.width),Math.round((r.y-box.y)*31/box.height),svg?s.fill:s.backgroundColor];
                }).sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
            }''', svg)

        def button_style(locator):
            return locator.evaluate('(e)=>{const s=getComputedStyle(e);return {ink:s.color,paper:s.backgroundColor,border:s.borderTopColor,radius:s.borderRadius}}')

        identity = {}

        def parity():
            page.goto(base+'/', wait_until='networkidle')
            identity['site'] = mark(page, '.site-header .qtmark')
            primary = page.locator('.hero__actions .btn--primary')
            identity['primary'] = button_style(primary)
            primary.hover(); identity['hover'] = button_style(primary)
            # Site button colour transitions use the existing 240ms duration.
            page.wait_for_timeout(300); identity['hover'] = button_style(primary)
            snap(page, '01-website-desktop')
            page.goto(base+'/report', wait_until='networkidle')
            assert mark(page, '.site-header .qtmark') == identity['site']
            snap(page, '02-report-desktop')
            page.goto(base+'/w?lang=en', wait_until='networkidle')
            assert mark(page, '.welcome-header .qtmark', True) == identity['site']
            icon = ctx.request.get(base+'/icon.svg')
            assert icon.ok and b'ISC' not in icon.body()
            href = page.locator('link[rel="icon"]').get_attribute('href')
            assert href.startswith('data:image/svg+xml,') and unquote(href.split(',',1)[1]).encode() == icon.body()
            identity['favicon'] = 'identical SVG; site URL and standalone workbench data URI' 
            assert button_style(page.locator('[data-action="start-project"]')) == identity['primary']
            snap(page, '03-workbench-start')
            open_original(page)
            assert mark(page, '.brand .qtmark', True) == identity['site'] and len(identity['site']) == 14
            primary = page.locator('.project-strip .primary')
            assert button_style(primary) == identity['primary']
            primary.hover(); assert button_style(primary) == identity['hover']
            assert page.title() == 'QT · Local research workbench'
            assert page.locator('.brand-name,.brand-icon,.avatar').count() == 0
            page.mouse.move(1430, 20); snap(page, '04-workbench-desktop')
            return identity

        check('site, report, startup and workbench share fourteen QT cells, colours and primary controls', parity)

        def reader():
            open_original(page)
            data = page.locator('.passage').evaluate_all('''es=>es.map(e=>({start:Number(e.dataset.start),text:e.textContent,ink:getComputedStyle(e).color,image:getComputedStyle(e).backgroundImage}))''')
            source = original['documents'][0]['text']
            for row in data:
                assert source[row['start']:row['start']+len(row['text'])] == row['text']
                assert row['image'] == 'none'
            # WCAG relative luminance, measured from real rendered colours.
            values = page.locator('.passage').first.evaluate('e=>({ink:getComputedStyle(e).color,paper:getComputedStyle(document.querySelector(".document-pane")).backgroundColor})')
            import re
            def lum(rgb):
                c = [int(v)/255 for v in re.findall(r'\d+', rgb)[:3]]
                c = [v/12.92 if v <= .04045 else ((v+.055)/1.055)**2.4 for v in c]
                return sum(v*w for v,w in zip(c, [.2126,.7152,.0722]))
            ratio = (lum(values['paper'])+.05)/(lum(values['ink'])+.05)
            assert ratio >= 7
            assert page.locator('.sidebar').evaluate('e=>getComputedStyle(e).backgroundImage') == 'none'
            snap(page, '05-reader-clean')
            return {'exact_source_paragraphs': len(data), 'text_contrast': round(ratio, 2), 'colours': values, 'reader_and_sidebar_grid': 'none'}

        check('transcript remains exact source text on a plain, high-contrast reading surface', reader)

        def keyboard():
            open_original(page)
            for view, title in [('insights', 'Insights'), ('audit', 'Audit trail'), ('coding', 'Coding workspace')]:
                nav = page.get_by_role('button', name=title, exact=True)
                nav.focus(); assert nav.evaluate('e=>getComputedStyle(e).outlineStyle') == 'solid'
                page.keyboard.press('Enter')
                expect(page.locator('.nav [aria-current="page"]')).to_have_attribute('data-view', view)
                assert page.locator('.nav [aria-current]').count() == 1
            page.locator('#reading-document').focus(); page.keyboard.press('Tab')
            expect(page.locator('[data-action="reading-resume"]')).to_be_focused()
            page.locator('[data-action="export"]').focus(); page.keyboard.press('Enter')
            expect(page.locator('#dialog')).to_be_visible(); snap(page, '06-keyboard-export')
            page.keyboard.press('Escape'); expect(page.locator('#dialog')).not_to_be_visible()
            return {'views': 3, 'single_current_item': True, 'visible_focus': True, 'native_document_tab_order': True, 'export_escape': True}

        check('navigation has accessible names, visible keyboard focus and one current view', keyboard)

        def figures():
            open_original(page)
            import hashlib
            sizes = []
            page.get_by_role('button', name='Figures', exact=True).click()
            for kind in ['frequency', 'coverage', 'cooccurrence', 'hierarchy', 'accumulation']:
                page.locator('[data-plot="kind"]').select_option(kind)
                page.wait_for_function('()=>{const i=document.querySelector("#plot-preview");return i&&i.complete&&i.naturalWidth>0&&!i.classList.contains("loading")}', timeout=120000)
                image = page.locator('#plot-preview')
                size = image.evaluate('e=>({width:e.naturalWidth,height:e.naturalHeight,shown:[e.width,e.height]})')
                assert abs(size['shown'][0]/size['shown'][1]-size['width']/size['height']) < .02
                sizes.append({'kind': kind, **size})
            page.get_by_role('button', name='Enlarge figure', exact=True).press('Enter')
            expect(page.locator('.plot-viewer-viewport')).to_be_focused()
            page.wait_for_function('()=>{const i=document.querySelector("#plot-viewer img");return i&&i.complete&&i.naturalWidth>0}')
            page.keyboard.press('+'); page.keyboard.press('0')
            viewer = page.locator('#plot-viewer img').evaluate('e=>({w:e.width,h:e.height,nw:e.naturalWidth,nh:e.naturalHeight})')
            assert viewer['w'] == viewer['nw'] and viewer['h'] == viewer['nh']
            with page.expect_download() as event:
                page.locator('#plot-viewer a[download]').click()
            download = event.value; path = out/download.suggested_filename; download.save_as(path)
            assert path.read_bytes().lstrip().startswith(b'<')
            snap(page, '07-original-figure-viewer'); page.keyboard.press('Escape')
            expect(page.get_by_role('button', name='Enlarge figure', exact=True)).to_be_focused()
            return {'five_previews': sizes, 'actual_size': viewer, 'svg_download': download.suggested_filename, 'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}

        check('five figures preserve aspect ratios and original-size viewing, keyboard and SVG download', figures)

        def phone():
            c, p = context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
            p.goto(base+'/', wait_until='networkidle')
            p.locator('.site-nav-disclosure summary').tap()
            expect(p.locator('.site-nav-disclosure__list')).to_be_visible(); snap(p, '08-website-phone-menu')
            open_original(p)
            assert mark(p, '.brand .qtmark', True) == identity['site']
            for view, name in [('insights','Insights'), ('coding','Coding workspace')]:
                nav = p.get_by_role('button', name=name, exact=True)
                box = nav.bounding_box(); assert box['width'] >= 44 and box['height'] >= 44
                nav.tap(); expect(p.locator('.nav [aria-current="page"]')).to_have_attribute('data-view', view)
            select = p.locator('#reading-document'); select.select_option(original['documents'][1]['id'])
            assert select.input_value() == original['documents'][1]['id']
            p.get_by_role('button', name='Themes & codes', exact=True).tap()
            expect(p.locator('#dialog')).to_be_visible(); snap(p, '09-phone-codebook')
            p.keyboard.press('Escape'); expect(p.locator('#reading-document')).to_be_visible()
            p.mouse.move(0, 0); snap(p, '10-workbench-phone')
            assert p.evaluate('document.documentElement.scrollWidth-innerWidth') == 0
            p.get_by_role('button', name='Figures', exact=True).tap()
            p.wait_for_function('()=>{const i=document.querySelector("#plot-preview");return i&&i.complete&&i.naturalWidth>0&&!i.classList.contains("loading")}', timeout=120000)
            p.get_by_role('button', name='Enlarge figure', exact=True).tap()
            p.get_by_role('button', name='Fit width', exact=True).tap()
            snap(p, '11-phone-figure-viewer'); p.keyboard.press('Escape'); c.close()
            return {'QT_cells_equal': True, 'navigation_targets': '44 × 44 minimum', 'native_document_switch': True, 'tree_and_figure_viewer': True, 'overflow': 0, 'physical_device': 'not tested'}

        check('phone retains QT, named touch navigation, documents, code tree and figure viewing', phone)

        def boundaries():
            rows = []
            for width in [320, 390, 800, 801, 1120, 1440]:
                c,p = context(viewport={'width': width, 'height': 900}, reduced_motion='reduce')
                open_original(p)
                assert p.evaluate('document.documentElement.scrollWidth-innerWidth') == 0
                assert p.locator('.qtmark').evaluate('e=>getComputedStyle(e).animationName') == 'none'
                assert p.locator('.nav [aria-current="page"]').get_attribute('aria-label')
                rows.append({'width': width, 'overflow': 0}); c.close()
            return {'workbench_boundaries': rows, 'reduced_motion': 'static mark and usable controls'}

        check('compact and breakpoint layouts retain controls without overflow under reduced motion', boundaries)

        def immutable():
            assert ctx.request.get(project_url, headers=headers).json() == original
            assert ctx.request.get(project_url+'/backups', headers=headers).json()['items'] == snapshots
            assert not results['posts'] and not results['console'] and not results['http']
            return {'Bologna_records_audit_snapshots_unchanged': True, 'POSTs': 0, 'console_errors': [], 'http_errors': []}

        check('all inspection leaves source project, audit and snapshots unchanged with no console errors', immutable)
        browser.close()
    save()
    assert all(c['pass'] for c in results['checks']), str(out/'results.json')


if __name__ == '__main__':
    main()
