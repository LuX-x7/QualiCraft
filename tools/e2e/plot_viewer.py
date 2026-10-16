"""Project-only regression for the workbench's original-SVG figure viewer.

Run against a disposable Bologna copy, never a research project:
python tools/e2e/plot_viewer.py --url http://127.0.0.1:4452 --out /tmp/qc-viewer
Optionally compare all downloaded bundle members with --baseline-dir DIR.
"""
import argparse
import json
import math
from pathlib import Path
import time
import traceback
from urllib.parse import urlsplit
import zipfile

from playwright.sync_api import sync_playwright, expect

KINDS = ['frequency', 'coverage', 'cooccurrence', 'hierarchy', 'accumulation']


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', required=True)
    parser.add_argument('--out', required=True)
    parser.add_argument('--baseline-dir')
    args = parser.parse_args()
    target = urlsplit(args.url)
    if target.scheme != 'http' or target.hostname not in ('127.0.0.1', 'localhost'):
        raise SystemExit('Only the loopback project is permitted')
    base = args.url.rstrip('/')
    out = Path(args.out); out.mkdir(parents=True, exist_ok=True)
    for name in ['screenshots', 'downloads']: (out/name).mkdir(exist_ok=True)
    repo = Path(__file__).resolve().parents[2]
    results = {'checks': [], 'console': [], 'http_errors': [], 'plot_requests': []}
    def save(): (out/'results.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
    def snap(page, name):
        page.wait_for_timeout(200)
        page.screenshot(path=str(out/'screenshots'/(name+'.png')))
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='chrome', headless=True)
        def context(**options):
            ctx = browser.new_context(accept_downloads=True, device_scale_factor=2, **options)
            ctx.route('**/*', lambda route: route.continue_() if route.request.url.startswith(base+'/') else route.abort())
            page = ctx.new_page(); page.set_default_timeout(10000)
            # Observe the original image Blob without a forbidden CSP fetch.
            page.add_init_script('const qcCreate=URL.createObjectURL;window.__qcSvg={};URL.createObjectURL=function(blob){const url=qcCreate.call(this,blob);if(blob.type.includes("svg"))blob.text().then(text=>window.__qcSvg[url]=text);return url};')
            page.on('pageerror', lambda e: results['console'].append(str(e)))
            page.on('console', lambda msg: results['console'].append(msg.text) if msg.type in ('error','warning') else None)
            page.on('response', lambda r: results['http_errors'].append({'url':r.url,'status':r.status}) if r.status>=400 else None)
            page.on('request', lambda r: results['plot_requests'].append(r.url) if '/plot?' in r.url else None)
            return ctx, page
        mobile, page = context(viewport={'width':390,'height':844}, is_mobile=True, has_touch=True)
        boot = mobile.request.get(base+'/w/api/bootstrap').json()
        project_id = 'a71a0b538c024c3ab23fb4286cfe93e2'
        project_url = base+'/w/api/projects/'+project_id
        headers = {'X-QualiCraft-Token': boot['token']}
        original = mobile.request.get(project_url, headers=headers).json()
        assert original['name']=='Bologna · What is data?' and len(original['annotations'])==874
        def check(name, fn, screen=None):
            print('START',name,flush=True)
            try: reading=fn(); results['checks'].append({'name':name,'pass':True,'reading':reading});print('PASS',name,flush=True)
            except Exception as e:
                results['checks'].append({'name':name,'pass':False,'error':str(e),'traceback':traceback.format_exc()});snap(screen or page,'failure-'+str(len(results['checks'])));print('FAIL',name,str(e),flush=True)
            save()
        def ready(p):
            p.wait_for_function('()=>{const i=document.querySelector("#plot-preview");return i&&i.complete&&i.naturalWidth>0&&!i.classList.contains("loading")}',timeout=120000)
        def geometry(p):
            return p.locator('#plot-viewer').evaluate('d=>{const i=d.querySelector("img"),v=d.querySelector(".plot-viewer-viewport"),r=i.getBoundingClientRect();return {natural:[i.naturalWidth,i.naturalHeight],image:[r.width,r.height],client:[v.clientWidth,v.clientHeight],scroll:[v.scrollWidth,v.scrollHeight],offset:[v.scrollLeft,v.scrollTop],overflow:document.documentElement.scrollWidth-innerWidth}}')
        def open_view(p, touch=False):
            button=p.get_by_role('button',name='Enlarge figure',exact=True)
            expect(button).to_be_enabled(timeout=120000)
            button.tap() if touch else button.press('Enter')
            expect(p.locator('#plot-viewer')).to_be_visible()
            p.wait_for_function('()=>{const i=document.querySelector("#plot-viewer img");return i.complete&&i.naturalWidth>0}')
        def actual(p):
            g=geometry(p);assert abs(g['image'][0]-g['natural'][0])<1
            assert abs(g['image'][0]/g['image'][1]-g['natural'][0]/g['natural'][1])<.002
            assert g['overflow']==0
            return g
        def mobile_entry():
            page.goto(base+'/w/?lang=en',wait_until='networkidle');page.locator('[data-action="view"][data-view="plotting"]').tap()
            button=page.get_by_role('button',name='Enlarge figure',exact=True)
            if not button.count():
                ready(page);snap(page,'00-before-phone');raise AssertionError('No accessible enlarge/original-size entry above the mobile figure')
            expect(button).to_be_disabled();ready(page);open_view(page,True)
            expect(page.locator('.plot-viewer-viewport')).to_be_focused();snap(page,'01-phone-actual-size')
            return actual(page)
        check('phone entry, initial loading state and actual-size readable image',mobile_entry)
        if not results['checks'][-1]['pass']:
            browser.close();save();return 1
        def touch_zoom():
            d=page.locator('#plot-viewer');before=len(results['plot_requests'])
            d.get_by_role('button',name='Zoom in',exact=True).tap();g=geometry(page);assert g['image'][0]>g['natural'][0]
            d.get_by_role('button',name='Fit width',exact=True).tap();g=geometry(page);assert abs(g['image'][0]-g['client'][0])<2
            d.get_by_role('button',name='Actual size (100%)',exact=True).tap();actual(page)
            session=mobile.new_cdp_session(page)
            def swipe(dx,dy):
                box=page.locator('.plot-viewer-viewport').bounding_box();x=box['x']+box['width']*.8;y=box['y']+box['height']*.7
                session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
                for step in range(1,11):
                    session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+dx*step/10,'y':y+dy*step/10}]});time.sleep(.02)
                session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(250)
            swipe(-160,0);swipe(0,-170);g=geometry(page);assert g['offset'][0]>20 and g['offset'][1]>20,g
            snap(page,'02-phone-touch-pan');assert len(results['plot_requests'])==before
            d.get_by_role('button',name='Fit width',exact=True).tap();page.set_viewport_size({'width':844,'height':390});page.wait_for_timeout(200)
            g=geometry(page);assert abs(g['image'][0]-g['client'][0])<2 and g['overflow']==0
            snap(page,'03-phone-landscape-fit');page.set_viewport_size({'width':390,'height':844})
            d.get_by_role('button',name='Close figure',exact=True).tap();expect(page.get_by_role('button',name='Enlarge figure',exact=True)).to_be_focused()
            expect(page.locator('#plot-viewer')).to_have_count(0)
            assert not page.evaluate('document.documentElement.classList.contains("plot-viewer-open")')
            return {'real_touch_scroll':True,'resize_fit':True,'no_rerender_on_view_changes':True}
        check('touch zoom, native two-axis swipe, orientation and focus return',touch_zoom)
        def five_figures():
            readings=[]
            for kind in KINDS:
                if page.locator('[data-plot="kind"]').input_value()!=kind:
                    with page.expect_response(lambda r:'/plot?' in r.url and 'kind='+kind in r.url,timeout=120000):page.locator('[data-plot="kind"]').select_option(kind)
                ready(page);open_view(page,True);g=actual(page)
                svg=page.locator('#plot-viewer img').evaluate('(e)=>window.__qcSvg[e.src]');assert svg and '<svg' in svg
                with page.expect_download() as event:page.locator('#plot-viewer').get_by_role('link',name='Download SVG',exact=True).tap()
                svg_path=out/'downloads'/(kind+'.svg');event.value.save_as(svg_path);assert svg_path.read_bytes()==svg.encode('utf-8')
                if kind in ('coverage','hierarchy'):snap(page,'04-phone-'+kind+'-actual')
                page.locator('#plot-viewer').get_by_role('button',name='Close figure',exact=True).tap()
                with page.expect_download(timeout=120000) as event:page.locator('[data-action="plot-export"]').tap()
                dest=out/'downloads'/(kind+'.zip');event.value.save_as(dest)
                with zipfile.ZipFile(dest) as z:
                    assert z.testzip() is None
                    assert {'.svg','.pdf','.png','.csv','.py'}<={Path(n).suffix for n in z.namelist()}
                    assert z.read('figure_data.csv')==(repo/f'website/public/report/figures/{kind}.csv').read_bytes()
                    assert z.read(next(n for n in z.namelist() if n.endswith('.svg')))==svg_path.read_bytes()
                    if args.baseline_dir:
                        with zipfile.ZipFile(Path(args.baseline_dir)/(kind+'.zip')) as old:
                            assert set(old.namelist())==set(z.namelist())
                            assert all(old.read(name)==z.read(name) for name in z.namelist()),kind
                readings.append({'kind':kind,'actual_size':g,'csv_and_original_svg_verified':True,'all_bundle_members_match_baseline':bool(args.baseline_dir)})
            return readings
        check('all five original figures, SVG download and unchanged full bundles',five_figures)
        desktop,p=context(viewport={'width':1440,'height':900})
        def keyboard():
            p.goto(base+'/w/?lang=en',wait_until='networkidle');p.locator('[data-action="view"][data-view="plotting"]').press('Enter')
            with p.expect_response(lambda r:'/plot?' in r.url and 'kind=hierarchy' in r.url,timeout=120000):p.locator('[data-plot="kind"]').select_option('hierarchy')
            ready(p);open_view(p);v=p.locator('.plot-viewer-viewport');actual(p);snap(p,'05-desktop-actual-size')
            v.press('+');assert geometry(p)['image'][0]>geometry(p)['natural'][0]
            v.press('0');actual(p);v.press('+');v.press('End');p.wait_for_function('()=>{const v=document.querySelector(".plot-viewer-viewport");return v.scrollTop>=v.scrollHeight-v.clientHeight-2}')
            maximum=geometry(p)['scroll'][0]-geometry(p)['client'][0]
            for _ in range(math.ceil(maximum/30)+3):v.press('ArrowRight');p.wait_for_timeout(35)
            g=geometry(p);assert g['offset'][0]>=maximum-2,g
            snap(p,'06-desktop-keyboard-bottom-right');v.press('Home');p.wait_for_function('()=>document.querySelector(".plot-viewer-viewport").scrollTop<2')
            for _ in range(10):v.press('+')
            expect(p.get_by_role('button',name='Zoom in',exact=True)).to_be_disabled()
            for _ in range(10):v.press('-')
            expect(p.get_by_role('button',name='Zoom out',exact=True)).to_be_disabled()
            v.press('0');actual(p)
            for _ in range(10):
                p.keyboard.press('Tab');assert p.evaluate('document.querySelector("#plot-viewer").contains(document.activeElement)')
            p.keyboard.press('Escape');expect(p.locator('#plot-viewer')).to_have_count(0);expect(p.get_by_role('button',name='Enlarge figure',exact=True)).to_be_focused()
            p.get_by_role('button',name='Enlarge figure',exact=True).press('Enter');p.keyboard.press('Escape');expect(p.locator('#plot-viewer')).to_have_count(0)
            return {'zoom_keys':True,'bottom_and_right_edge_reachable':True,'tab_stays_in_dialog':True,'escape_focus_and_reopen':True}
        check('desktop keyboard zoom, full extent, modal focus and Escape',keyboard,p)
        def unchanged():
            current=mobile.request.get(project_url,headers=headers).json();assert current==original
            assert not results['console'] and not results['http_errors'],results
            return {'project_records_unchanged':True,'documents':len(current['documents']),'codings':len(current['annotations']),'normal_console_http_errors':0}
        check('project remains unchanged and normal console/HTTP is clean',unchanged)
        desktop.close();mobile.close();browser.close();save()
    print(json.dumps({'passed':sum(c['pass'] for c in results['checks']),'total':len(results['checks']),'console':results['console'],'http_errors':results['http_errors']},indent=2))
    return 0 if all(c['pass'] for c in results['checks']) else 1


if __name__=='__main__': raise SystemExit(main())
