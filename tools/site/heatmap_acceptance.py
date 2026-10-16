"""Project-only Chrome checks of the original-SVG heatmap magnifier.

Coordinates are independently read from the saved SVG XML; values come from
unchanged CSV files. No browser attachment, workbench request or data mutation.
"""
from __future__ import annotations
import argparse,csv,hashlib,json,traceback,xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright


def main():
 parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4445');parser.add_argument('--out',required=True);args=parser.parse_args();parsed=urlsplit(args.url)
 if parsed.scheme!='http' or parsed.hostname not in ('127.0.0.1','localhost'):raise SystemExit('Local project only')
 origin=f'{parsed.scheme}://{parsed.netloc}';repo=Path(__file__).resolve().parents[2];out=Path(args.out);out.mkdir(parents=True,exist_ok=True);results=[];errors=[];http=[];ns={'s':'http://www.w3.org/2000/svg'}
 manifest=json.loads((repo/'website/public/report/manifest.json').read_text());sources={}
 for kind in ['coverage','cooccurrence']:
  root=ET.parse(repo/f'website/public/report/figures/{kind}.svg').getroot();axes=root.find('.//s:g[@id="axes_1"]',ns);clipped=next(g for g in axes.findall('.//s:g',ns) if g.get('clip-path') and g.find('s:image',ns) is not None);cid=clipped.get('clip-path')[5:-1];rect=root.find(f'.//s:clipPath[@id="{cid}"]/s:rect',ns);plot={k:float(rect.get(k)) for k in ['x','y','width','height']}
  def ticks(axis,coord):
   g=axes.find(f'.//s:g[@id="matplotlib.axis_{axis}"]',ns);found=[]
   for tick in g:
    if not tick.get('id','').startswith(coord+'tick_'):continue
    use=tick.find('.//s:use',ns);label=' '.join(''.join(t.itertext()) for t in tick.findall('.//s:text',ns));found.append((float(use.get(coord)),label))
   return [s for _,s in sorted(found)]
  sources[kind]={'plot':plot,'x':ticks(1,'x'),'y':ticks(2,'y'),'rows':list(csv.DictReader((repo/f'website/public/report/figures/{kind}.csv').open(encoding='utf8')))}
 def check(name,fn):
  try:results.append({'name':name,'pass':True,'reading':fn()})
  except Exception as e:results.append({'name':name,'pass':False,'error':str(e),'traceback':traceback.format_exc()})
 with sync_playwright() as pw:
  browser=pw.chromium.launch(channel='chrome',headless=True)
  def context(**kwargs):
   c=browser.new_context(**kwargs);c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(origin+'/') else r.abort());c.on('page',lambda p:(p.on('pageerror',lambda e:errors.append(str(e))),p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None),p.on('response',lambda r:http.append([r.status,r.url]) if r.status>=400 else None)));return c
  ctx=context(viewport={'width':1440,'height':900});page=ctx.new_page();page.goto(origin+'/',wait_until='networkidle');page.set_default_timeout(6000)
  def visit(kind,tab=page):
   tab.locator('#story-plotting-'+kind+' .story-step-title').click()
   panel=tab.locator('[data-story-art="plotting-'+kind+'"]');panel.get_by_role('button',name='Magnify original',exact=True).click();return panel
  def point(svg,kind,x,y):
   s=sources[kind];p=s['plot'];return svg.evaluate('(e,p)=>{const q=new DOMPoint(p.x,p.y).matrixTransform(e.getScreenCTM());return {x:q.x,y:q.y}}',{'x':p['x']+(x+.5)*p['width']/len(s['x']),'y':p['y']+(y+.5)*p['height']/len(s['y'])})
  def hover(panel,kind,x,y):
   svg=panel.locator('.lens-original-svg');svg.scroll_into_view_if_needed();p=point(svg,kind,x,y);page.mouse.move(p['x'],p['y']);page.wait_for_timeout(40)
  def cell(panel):return tuple(int(panel.locator('[data-heatmap-lens]').get_attribute('data-cell-'+a)) for a in ['x','y'])
  def mapping():
   total=0
   for kind,s in sources.items():
    panel=visit(kind);select=panel.locator('.home-plot-controls select');norm=lambda s:''.join(s.split()).removesuffix('.txt')
    for i,row in enumerate(s['rows']):
     select.select_option(str(i));page.wait_for_function('([sel,i])=>document.querySelector(sel+" [data-lens-row]")?.dataset.lensRow===String(i)',arg=[f'[data-story-art="plotting-{kind}"]',i]);x,y=cell(panel);ex=row['case'] if kind=='coverage' else row['code_b'];ey=row['code'] if kind=='coverage' else row['code_a'];assert norm(s['x'][x])==norm(ex) and norm(s['y'][y])==norm(ey),(kind,i,x,y)
     assert panel.locator('.lens-csv-value').inner_text()=='CSV count: '+row['count'];total+=1
    images=panel.locator('svg image');assert images.count()==2;assert images.evaluate_all('(es)=>es.every(e=>e.getAttribute("href")==="/report/figures/'+kind+'.svg")')
    expected=next(f['sha256'] for f in manifest['files'] if f['path']==f'figures/{kind}.svg');assert panel.locator('[data-heatmap-lens]').get_attribute('data-original-sha256')==expected
   return {'exact_rows':total,'coverage':285,'cooccurrence':16,'axes_match_original_labels':True,'both_images_are_original_svg':True}
  check('all 301 CSV rows locate their true original cells with exact values',mapping)
  def hovering():
   page.evaluate('window.__clicks=0;document.addEventListener("click",()=>window.__clicks++)');readings=[]
   for kind in sources:
    panel=visit(kind);page.evaluate('window.__clicks=0');hover(panel,kind,1,0);assert cell(panel)==(1,0);assert page.evaluate('window.__clicks')==0
    s=sources[kind];row=next((r for r in s['rows'] if (r['case'].removesuffix('.txt') if kind=='coverage' else r['code_b'])==s['x'][1] and (r['code'] if kind=='coverage' else r['code_a'])==s['y'][0]),None);assert row
    assert panel.locator('.lens-csv-value').inner_text()=='CSV count: '+row['count']
    hover(panel,kind,len(s['x'])-1,len(s['y'])-1);assert cell(panel)==(len(s['x'])-1,len(s['y'])-1)
    lens=panel.locator('[data-heatmap-lens]');before=(lens.get_attribute('data-window-x'),lens.get_attribute('data-window-y'));detail=panel.locator('.lens-detail-svg');x=int(before[0]);y=int(before[1]);p=point(detail,kind,x,y);page.mouse.move(p['x'],p['y']);page.wait_for_timeout(50);assert cell(panel)==(x,y);assert before==(lens.get_attribute('data-window-x'),lens.get_attribute('data-window-y'))
    if kind=='cooccurrence':
     box=detail.bounding_box();page.mouse.move(box['x']+3,box['y']+box['height']/2);page.wait_for_timeout(50);assert cell(panel)==(x,y)
    hover(panel,kind,1,0)
    readings.append({'kind':kind,'last_cell':True,'detail_hover_keeps_frame':True,'first_pair_count':row['count']})
    page.locator('.story-stage').screenshot(path=str(out/f'{kind}-desktop.png'))
   panel=visit('cooccurrence');hover(panel,'cooccurrence',0,0);assert 'No exported CSV row' in panel.locator('.lens-csv-value').inner_text();assert panel.locator('.home-plot-controls select').input_value()==''
   return {'mouse_clicks':0,'readings':readings,'missing_pairs_not_zero':True}
  check('real hover moves the original frame; detail hover reads cells without moving it',hovering)
  def keys():
   panel=visit('coverage');svg=panel.locator('.lens-original-svg');svg.focus();svg.press('Home');assert cell(panel)==(0,0);svg.press('ArrowRight');assert cell(panel)==(1,0);svg.press('ArrowDown');assert cell(panel)==(1,1);svg.press('End');assert cell(panel)==(18,14)
   svg.press('Enter');assert panel.locator('.lens-freeze').get_attribute('aria-pressed')=='true';hover(panel,'coverage',0,0);assert cell(panel)==(18,14)
   svg.press('Home');assert cell(panel)==(0,0);svg.press('Escape');hover(panel,'coverage',3,3);assert cell(panel)==(3,3);svg.focus();svg.press('Tab');assert page.evaluate('document.activeElement.classList.contains("lens-freeze")');page.keyboard.press('Space');assert panel.locator('.lens-freeze').get_attribute('aria-pressed')=='true';page.keyboard.press('Space')
   page.locator('.story-stage').screenshot(path=str(out/'keyboard-coverage.png'));return {'arrows_home_end':True,'freeze_and_resume':True,'native_tab_and_space':True}
  check('keyboard reaches every boundary, freezes hover and preserves native Tab',keys)
  def assets():
   for f in manifest['files']:
    r=ctx.request.get(origin+'/report/'+f['path']);assert r.status==200;assert hashlib.sha256(r.body()).hexdigest()==f['sha256']
   for kind in ['coverage','cooccurrence']:
    panel=visit(kind);panel.get_by_role('button',name='Original figure',exact=True).click();img=panel.locator('.home-original-figure img');assert img.is_visible();assert img.get_attribute('src')==f'/report/figures/{kind}.svg'
    for suffix in ['csv','svg']:
     with page.expect_download() as download:panel.locator(f'a[download][href="/report/figures/{kind}.{suffix}"]').click()
     d=download.value;target=out/d.suggested_filename;d.save_as(target);assert target.read_bytes()==(repo/f'website/public/report/figures/{kind}.{suffix}').read_bytes()
    assert panel.locator(f'a[href="/report#table-{kind}"]').count()==1
   return {'manifest_files_verified':len(manifest['files']),'download_bytes_verified':4,'original_and_full_table_links_preserved':True}
  check('original views, complete table links and four downloads retain their exact bytes',assets)
  def phone():
   c=context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);tab=c.new_page();tab.goto(origin+'/',wait_until='networkidle');tab.wait_for_selector('.story-inline');cdp=c.new_cdp_session(tab);readings=[]
   for kind,s in sources.items():
    panel=visit(kind,tab);svg=panel.locator('.lens-original-svg');svg.scroll_into_view_if_needed();before_top=svg.bounding_box()['y'];a=point(svg,kind,0,0);z=point(svg,kind,len(s['x'])-1,len(s['y'])-1)
    for typ,p in [('touchStart',a),('touchMove',{'x':(a['x']+z['x'])/2,'y':(a['y']+z['y'])/2}),('touchMove',z),('touchEnd',None)]:
     cdp.send('Input.dispatchTouchEvent',{'type':typ,'touchPoints':[] if p is None else [p]});tab.wait_for_timeout(50)
    assert cell(panel)==(len(s['x'])-1,len(s['y'])-1),(kind,cell(panel));assert abs(svg.bounding_box()['y']-before_top)<1;assert tab.evaluate('innerWidth')==390;assert tab.evaluate('document.documentElement.scrollWidth-innerWidth')==0
    panel.locator('[data-heatmap-lens]').screenshot(path=str(out/f'{kind}-phone-full.png'));svg.scroll_into_view_if_needed();tab.screenshot(path=str(out/f'{kind}-phone.png'));readings.append({'kind':kind,'touch_last_cell':cell(panel)})
   before=tab.evaluate('scrollY');cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':8,'y':650}]});cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':8,'y':250}]});cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});tab.wait_for_timeout(150);assert tab.evaluate('scrollY')>before
   tab.set_viewport_size({'width':844,'height':390});assert tab.evaluate('document.documentElement.scrollWidth-innerWidth')==0;tab.screenshot(path=str(out/'phone-landscape.png'));c.close();return {'readings':readings,'outside_plot_native_scroll':True,'overflow':0,'landscape':True,'physical_device':'not tested'}
  check('phone touch drags both frames while page scrolling and full originals remain usable',phone)
  def short():
   page.set_viewport_size({'width':1366,'height':768});panel=visit('cooccurrence');svg=panel.locator('.lens-original-svg');ratio=svg.evaluate('(e)=>{const r=e.getBoundingClientRect(),v=e.viewBox.baseVal;return [r.width/r.height,v.width/v.height]}');assert abs(ratio[0]-ratio[1])<.01
   box=page.locator('.story-stage').bounding_box();assert box['y']>=55 and box['y']+box['height']<=768
   panel.locator('.home-plot-controls select').focus();assert page.evaluate('document.activeElement.tagName')=='SELECT';page.screenshot(path=str(out/'cooccurrence-laptop-keyboard.png'));page.set_viewport_size({'width':1440,'height':900});return {'viewport':[1366,768],'stage_fits':True,'original_ratio':ratio,'lower_controls_keyboard_reachable':True}
  check('short desktop preserves original proportions and reachable controls in its fixed stage',short)
  def reduced():
   c=context(viewport={'width':1440,'height':900},reduced_motion='reduce');tab=c.new_page();tab.goto(origin+'/',wait_until='networkidle');panel=visit('coverage',tab);svg=panel.locator('.lens-original-svg');svg.focus();svg.press('End');assert cell(panel)==(18,14);tab.locator('.story-stage').screenshot(path=str(out/'reduced-motion.png'));c.close();assert not errors,errors;assert not http,http;return {'static_original_interactive':True,'console_errors':errors,'http_errors':http}
  check('reduced motion retains interaction; normal console and HTTP responses are clean',reduced)
  browser.close()
 (out/'results.json').write_text(json.dumps({'checks':results,'console':errors,'http':http},indent=2));print(json.dumps(results,indent=2));return 0 if all(r['pass'] for r in results) else 1

if __name__=='__main__':raise SystemExit(main())
