"""Project-only W03 presentation checks; no workbench calls or research writes."""
import argparse
import hashlib
import json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--url',required=True);parser.add_argument('--out',required=True);args=parser.parse_args()
    base=args.url.rstrip('/');assert urlsplit(base).scheme=='http' and urlsplit(base).hostname in ('127.0.0.1','localhost')
    out=Path(args.out);out.mkdir(parents=True,exist_ok=True);repo=Path(__file__).resolve().parents[2]
    result={'checks':[],'console':[],'http':[],'posts':[]};contexts=[]
    def save(): (out/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
    with sync_playwright() as pw:
        browser=pw.chromium.launch(channel='chrome',headless=True)
        def opened(width=1440,height=900,reduced=False):
            c=browser.new_context(viewport={'width':width,'height':height},is_mobile=width<=600,has_touch=width<=600,reduced_motion='reduce' if reduced else 'no-preference');contexts.append(c)
            c.route('**/*',lambda q:q.continue_() if q.request.url.startswith(base+'/') else q.abort());p=c.new_page();p.set_default_timeout(7000)
            p.on('pageerror',lambda e:result['console'].append(str(e)));p.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None);p.on('response',lambda r:result['http'].append([r.status,r.url]) if r.status>=400 else None);p.on('request',lambda r:result['posts'].append(r.url) if r.method=='POST' else None)
            p.goto(base+'/',wait_until='networkidle');return c,p
        def visit(p,scene):
            if p.viewport_size['width']>1000:p.locator('#story-'+scene+' .story-step-title').click();p.wait_for_selector('.story-stage[data-scene="'+scene+'"]')
            else:p.locator('[data-story-art="'+scene+'"]').scroll_into_view_if_needed()
        def graph_visible(p):
            view=p.locator('.relationship-viewport');view.scroll_into_view_if_needed();p.wait_for_timeout(100)
            return view.evaluate('el=>{const b=el.getBoundingClientRect(),s=el.closest(".story-stage-body")?.getBoundingClientRect();return {top:b.top,bottom:b.bottom,width:b.width,height:b.height,clipTop:Math.max(70,s?.top??0),clipBottom:Math.min(innerHeight,s?.bottom??innerHeight)}}')
        def shot(p,name):p.wait_for_timeout(1600);p.screenshot(path=str(out/(name+'.png')))
        def check(name,fn):
            print('START',name,flush=True)
            try:result['checks'].append({'name':name,'pass':True,'reading':fn()});print('PASS',name,flush=True)
            except Exception as e:
                result['checks'].append({'name':name,'pass':False,'error':str(e)});print('FAIL',name,str(e),flush=True)
                if contexts and contexts[-1].pages:shot(contexts[-1].pages[0],'failure-'+str(len(result['checks'])))
            finally:
                for c in contexts:c.close()
                contexts.clear();save()
        def desktop():
            rows=[]
            for height in [900,650]:
                _,p=opened(height=height);visit(p,'network')
                assert p.locator('.relationship-selection').count()==1,'Missing readable node caption'
                expect(p.locator('.relationship-settings')).not_to_have_attribute('open','')
                b=graph_visible(p);assert b['top']>=b['clipTop']-2 and b['bottom']<=b['clipBottom']+2,b
                assert p.locator('.story-stage .record-drawing-heading').evaluate_all('es=>es.every(e=>getComputedStyle(e).display==="none")')
                shot(p,'desktop-network-'+str(height));rows.append(b)
            return rows
        check('desktop and short desktop show the complete network before optional settings',desktop)
        def phone():
            _,p=opened(390,844);visit(p,'network');assert p.locator('.relationship-selection').count()==1,'Missing readable phone label'
            font=p.locator('.relationship-selection strong').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)');assert font>=16,font
            p.locator('.relationship-settings summary').tap();p.get_by_label('Network theme',exact=True).select_option(index=1)
            p.get_by_label('Network node',exact=True).select_option(index=0);expected=p.get_by_label('Network node',exact=True).locator('option:checked').inner_text()
            expect(p.locator('.relationship-selection strong')).to_have_text(expected)
            p.locator('.relationship-settings summary').tap();b=graph_visible(p);assert b['bottom']<=b['clipBottom']+2,b
            first=p.locator('[data-network-node][aria-pressed="true"] .force-node-dot');first.tap()
            assert p.locator('.relationship-selection').inner_text().strip();assert p.evaluate('document.documentElement.scrollWidth-innerWidth')==0
            shot(p,'phone-network-readable');return {'font_px':font,'full_name':expected,'frame':b,'native_touch':True}
        check('phone keeps a full-size node label and actual connected graph',phone)
        def input_devices():
            _,p=opened();visit(p,'network');assert p.locator('.relationship-settings').count()==1,'Missing optional network settings'
            summary=p.locator('.relationship-settings summary');summary.focus();p.keyboard.press('Enter');p.get_by_label('Network theme',exact=True).select_option(index=1)
            node=p.locator('[data-network-node][aria-pressed="true"]');node.focus();node.press('ArrowRight')
            active=p.locator('[data-network-node][aria-pressed="true"]');label=active.get_attribute('aria-label').split(': ',1)[1]
            if active.get_attribute('data-network-node').startswith('passage:'):assert label
            else:expect(p.locator('.relationship-selection strong')).to_have_text(label)
            circle=active.locator('.force-node-dot');circle.hover();assert active.get_attribute('aria-pressed')=='true'
            active.press('Enter');assert p.locator('.relationship-force-svg').is_visible();shot(p,'desktop-network-keyboard')
            return {'native_disclosure_Enter':True,'arrow_keys':True,'real_hover':True,'full_label':label}
        check('optional settings, keyboard selection and real hover retain graph interactions',input_devices)
        def import_flow():
            _,p=opened();visit(p,'import');buttons=p.locator('[data-story-art="import"] [data-flow-step]');assert buttons.count()==3,'Import needs file, record and coordinate stages'
            assert p.locator('[data-import-record]').count()==1
            states=[]
            for i in range(3):
                buttons.nth(i).hover();expect(buttons.nth(i)).to_have_attribute('aria-pressed','true');buttons.nth(i).focus();states.append(p.locator('[data-story-art="import"] .sketch-readout').inner_text())
            assert 'Unicode [' in states[-1];assert p.locator('[data-story-art="import"] [data-schematic="import"]').count()==1
            shot(p,'desktop-import-engineering');return {'three_stages':states,'original_schematic_retained':True}
        check('import explains source identity, text record and exact coordinates',import_flow)
        def export_flow():
            _,p=opened();visit(p,'export');assert p.locator('[data-export-record]').count()==1,'Missing common project structure'
            buttons=p.locator('[data-story-art="export"] .export-file');assert buttons.count()==6
            assert buttons.all_text_contents()[:4] and [buttons.nth(i).get_attribute('aria-label') for i in range(4)]==['Project JSON','Codings CSV','Matrix CSV','Methods Markdown']
            for i in range(6):
                buttons.nth(i).hover();expect(buttons.nth(i)).to_have_attribute('aria-pressed','true');buttons.nth(i).press('Enter')
            assert p.locator('[data-story-art="export"] .file-structure').count()==6
            assert p.locator('[data-story-art="export"] [data-schematic="export"]').count()==1
            shot(p,'desktop-export-engineering');return {'formats':6,'original_structures_retained':4,'real_hover_and_keyboard':True}
        check('export retains the four original structures and adds coded HTML and Word',export_flow)
        def responsive():
            rows=[]
            for width,height in [(320,740),(844,390)]:
                _,p=opened(width,height,True)
                for scene in ['import','network','export']:
                    visit(p,scene);assert p.evaluate('document.documentElement.scrollWidth-innerWidth')==0
                assert p.locator('[data-story-art="import"] [data-flow-step]').count()==3
                assert p.locator('.relationship-selection strong').evaluate('e=>parseFloat(getComputedStyle(e).fontSize)')>=16
                shot(p,'reduced-'+str(width));rows.append([width,height])
            return {'narrow_landscape_reduced_motion':rows}
        check('narrow and landscape layouts preserve drawings and readable labels',responsive)
        def retained():
            c,p=opened();manifest=json.loads((repo/'website/public/report/manifest.json').read_text());files=[]
            for f in manifest['files']:
                response=c.request.get(base+'/report/'+f['path']);data=response.body();assert response.ok and hashlib.sha256(data).hexdigest()==f['sha256'];files.append(f['path'])
            assert p.locator('.story-details').count()==5
            for kind in ['import','coding','analysis','plotting','export']:
                for ext in ['png','webm']:
                    file=repo/'website/public/clips'/(kind+'.'+ext);response=c.request.get(base+'/clips/'+file.name);assert response.ok and response.body()==file.read_bytes()
            assert not result['console'] and not result['http'] and not result['posts'],result
            return {'unchanged_report_files':len(files),'recordings_and_stills':10,'workflow_recording_entries':5,'no_workbench_calls_or_POSTs':True}
        check('original report assets, all five recordings and stills remain intact',retained)
        browser.close();save()
    raise SystemExit(0 if all(c['pass'] for c in result['checks']) else 1)

if __name__=='__main__':main()
