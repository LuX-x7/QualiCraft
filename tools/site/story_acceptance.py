"""Project-only Chrome regression: true hover, distinct evidence views, legible matrices.

Starts a fresh controlled Chrome, never attaches to other windows or profiles.
All network requests are restricted to the supplied loopback project origin.
"""
from __future__ import annotations
import argparse,json,csv
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright


def main():
 p=argparse.ArgumentParser();p.add_argument('--url',default='http://127.0.0.1:4445');p.add_argument('--out',required=True);a=p.parse_args()
 u=urlsplit(a.url)
 if u.hostname not in ('127.0.0.1','localhost') or u.scheme!='http':raise SystemExit('Only the local project is permitted')
 origin=f'{u.scheme}://{u.netloc}';out=Path(a.out);out.mkdir(parents=True,exist_ok=True);results=[];errors=[]
 with sync_playwright() as pw:
  browser=pw.chromium.launch(channel='chrome',headless=True)
  context=browser.new_context(viewport={'width':1512,'height':801},device_scale_factor=2)
  context.route('**/*',lambda route:route.continue_() if route.request.url.startswith(origin+'/') else route.abort())
  page=context.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('console',lambda m:errors.append(m.text) if m.type in ('error','warning') else None)
  page.goto(origin+'/',wait_until='networkidle')
  def check(name,fn):
   try: reading=fn();results.append({'name':name,'pass':True,'reading':reading})
   except Exception as e:results.append({'name':name,'pass':False,'error':str(e)})
  def hover():
   page.mouse.move(1500,60)
   title=page.locator('#story-analysis .story-step-title')
   y=title.evaluate('(e)=>e.getBoundingClientRect().top+scrollY-innerHeight*.8')
   page.evaluate('(y)=>window.scrollTo(0,y)',y)
   page.wait_for_function("document.querySelector('.story-stage').dataset.scene==='coding'")
   before=page.evaluate('scrollY');box=title.bounding_box();assert box
   page.evaluate("window.__qtTestClicks=0;document.addEventListener('click',()=>window.__qtTestClicks++)")
   page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2)
   page.wait_for_function("document.querySelector('.story-stage').dataset.scene==='analysis'",timeout=1500)
   result=page.evaluate('({y:scrollY,clicks:window.__qtTestClicks,scene:document.querySelector(".story-stage").dataset.scene})')
   assert abs(result['y']-before)<1 and result['clicks']==0
   return result
  check('hover heading changes illustration without click or scroll',hover)
  def evidence():
   page.locator('#story-coding .story-step-title').click();page.wait_for_selector('.story-stage[data-scene="coding"]')
   assert page.locator('.story-stage .coding-document mark').count()==1,'Coding must show the selected passage in a document'
   page.locator('#story-analysis .story-step-title').click();page.wait_for_selector('.story-stage[data-scene="analysis"]')
   graph=page.get_by_role('group',name='Theme-code-passage network',exact=True);assert graph.count()==1,'Analysis must have its own explorable network'
   nodes=graph.locator('[data-network-node]');assert nodes.count()>=5
   ids=nodes.evaluate_all('(es)=>es.map(e=>e.dataset.networkNode)');assert len(set(ids))==len(ids)
   return {'unique_nodes':len(ids)}
  check('Coding document and Analysis network are distinct',evidence)
  def heatmap():
   page.locator('#story-plotting-coverage .story-step-title').click();page.wait_for_selector('.story-stage[data-scene="plotting-coverage"]')
   cell=page.locator('.story-stage .home-plot-cell').first;box=cell.bounding_box();assert box
   font=page.locator('.story-stage .home-cell-number').first.evaluate('(e)=>{let m=e.getScreenCTM();return parseFloat(getComputedStyle(e).fontSize)*Math.hypot(m.a,m.b)}')
   assert abs(box['width']-box['height'])<.1
   assert box['width']>=32,f'Cell is only {box["width"]:.2f}px'
   assert font>=14,f'Rendered count font is only {font:.2f}px'
   return {'cell':box,'count_font_px':font}
  check('normal-window matrix cells and counts are readable',heatmap)
  def network_hover():
   page.mouse.move(1500,60)
   page.locator('#story-analysis .story-step-title').click();page.wait_for_selector('.story-stage[data-scene="analysis"]')
   svg=page.locator('.story-stage .record-network-svg')
   sources=svg.locator('[data-network-node^="passage:"]')
   target=sources.nth(sources.count()-1);aid=target.get_attribute('data-source-id')
   before=page.evaluate('scrollY');page.evaluate('window.__qtTestClicks=0')
   target.hover();page.wait_for_function('(id)=>document.querySelector(".story-stage .network-evidence").dataset.selectedAnnotation===id',arg=aid)
   reading=page.evaluate('({y:scrollY,clicks:window.__qtTestClicks,quote:document.querySelector(".story-stage .network-evidence mark").textContent,id:document.querySelector(".story-stage .network-evidence").dataset.selectedAnnotation})')
   assert reading['clicks']==0 and abs(reading['y']-before)<1
   assert reading['quote']
   page.screenshot(path=str(out/'analysis-network-desktop.png'))
   return reading
  check('network node hover reads its real passage without clicking',network_hover)
  def coding_hover():
   page.mouse.move(1500,60)
   page.locator('#story-coding .story-step-title').click();page.wait_for_selector('.story-stage[data-scene="coding"]')
   page.evaluate('window.__qtTestClicks=0')
   page.locator('.story-stage .coding-code').hover()
   page.wait_for_function('document.querySelector(".story-stage .coding-sketch").classList.contains("coding-part-1")')
   reading=page.evaluate('({clicks:window.__qtTestClicks,text:document.querySelector(".story-stage .record-readout").textContent})')
   assert reading['clicks']==0
   page.screenshot(path=str(out/'coding-document-desktop.png'))
   return reading
  check('coding code hover is independent from network exploration',coding_hover)
  def full_values():
   repo=Path(__file__).resolve().parents[2];total=0;counts={}
   for kind in ['frequency','coverage','cooccurrence','hierarchy','accumulation']:
    scene='plotting' if kind=='frequency' else 'plotting-'+kind
    page.mouse.move(1500,60);page.locator('#story-'+scene+' .story-step-title').click()
    page.wait_for_selector('.story-stage[data-scene="'+scene+'"]')
    rows=list(csv.DictReader((repo/'website/public/report/figures'/f'{kind}.csv').open(encoding='utf-8')))
    select=page.locator('.story-stage .home-plot-controls select')
    for i,row in enumerate(rows):
     select.select_option(str(i))
     page.wait_for_function('(i)=>document.querySelector(".story-stage .home-plot-mark[aria-pressed=true]")?.dataset.csvRow===String(i)',arg=i)
     actual=page.locator('.story-stage .home-plot-mark[aria-pressed=true]').get_attribute('aria-label')
     label=row['case'] if kind=='accumulation' else row['section']+' › '+row['subsection'] if kind=='hierarchy' else row['case']+' × '+row['code'] if kind=='coverage' else row['code_a']+' × '+row['code_b'] if kind=='cooccurrence' else row['code']
     value=row['cumulative'] if kind=='accumulation' else row['count']
     assert actual==f'Read {label}: {value}',(kind,i,actual)
     numeric=page.locator('.story-stage .home-plot-inspector > strong').evaluate('(e)=>e.firstChild.textContent')
     assert numeric==value,(kind,i,numeric,value)
     total+=1
    counts[kind]=len(rows)
    select.select_option('0')
    page.screenshot(path=str(out/f'{kind}-desktop.png'))
   return {'rows_checked':total,'per_figure':counts}
  check('all 594 actual CSV rows remain selectable and exact in the UI',full_values)
  def keyboard():
   page.set_viewport_size({'width':1366,'height':768});page.mouse.move(1355,60)
   page.locator('#story-coding .story-step-title').click();page.wait_for_selector('.story-stage[data-scene="coding"]')
   page.locator('.story-stage .coding-code').press('PageDown');page.wait_for_selector('.story-stage[data-scene="analysis"]')
   selected=page.locator('.story-stage [data-network-node][aria-pressed=true]');selected.press('ArrowRight')
   assert page.evaluate('document.activeElement.hasAttribute("data-network-node")')
   edge=page.locator('.story-stage .record-network-edge').first
   assert edge.evaluate('(e)=>getComputedStyle(e).strokeDasharray')=='none','Network base links must remain visible before any animation'
   page.get_by_label('Network theme',exact=True).select_option(index=2)
   page.screenshot(path=str(out/'analysis-short-desktop.png'))
   page.locator('#story-plotting-coverage .story-step-title').click();page.wait_for_selector('.story-stage[data-scene="plotting-coverage"]')
   page.locator('.story-stage .home-plot-controls select').select_option('2')
   page.locator('.story-stage .home-plot-mark[data-csv-row="2"]').press('ArrowRight')
   page.wait_for_function('document.activeElement?.dataset.csvRow==="3"')
   box=page.locator('.story-stage').bounding_box();assert box
   assert box['y']+box['height']<=769,box
   return {'focused_csv_row':page.evaluate('document.activeElement.dataset.csvRow'),'frame':box}
  check('keyboard enters network and crosses matrix windows at short desktop height',keyboard)
  def normal_scroll():
   page.set_viewport_size({'width':1512,'height':801});page.mouse.move(1500,60);page.evaluate('window.scrollTo(0,0)')
   page.wait_for_function('scrollY===0')
   visited=[]
   for _ in range(14):
    page.mouse.wheel(0,420)
    page.wait_for_timeout(140)
    state=page.evaluate('({y:scrollY,scene:document.querySelector(".story-stage").dataset.scene,diagram:document.querySelector(".story-stage [data-diagram]")?.dataset.diagram})')
    if state['scene'] in ('coding','analysis'):
     box=page.locator('.story-stage').bounding_box();assert box and box['y']<150
     if state['scene'] not in [r['scene'] for r in visited]:
      page.screenshot(path=str(out/f'natural-scroll-{state["scene"]}.png'));visited.append(state)
   assert {'coding','analysis'}<=set(r['scene'] for r in visited),visited
   return visited
  check('ordinary wheel scrolling reveals both distinct evidence illustrations',normal_scroll)
  def phone():
   mobile=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
   mobile.route('**/*',lambda route:route.continue_() if route.request.url.startswith(origin+'/') else route.abort())
   tab=mobile.new_page();tab.on('pageerror',lambda e:errors.append(str(e)));tab.goto(origin+'/',wait_until='networkidle')
   tab.wait_for_selector('.story-inline');assert tab.locator('.story-inline').count()==9
   assert tab.evaluate('document.documentElement.scrollWidth-innerWidth')==0
   tab.locator('#story-coding .coding-code').tap();assert tab.locator('#story-coding .coding-code').get_attribute('aria-pressed')=='true'
   tab.locator('#story-coding .story-inline').screenshot(path=str(out/'coding-phone.png'))
   tab.locator('#story-analysis [aria-label="Network source example"]').select_option(index=2)
   tab.locator('#story-analysis .network-mobile-path button').last.tap()
   aid=tab.locator('#story-analysis .network-evidence').get_attribute('data-selected-annotation');assert aid
   tab.locator('#story-analysis .story-inline').screenshot(path=str(out/'analysis-phone.png'))
   tab.locator('#story-plotting-coverage .home-plot-controls select').select_option('284')
   tab.wait_for_function('document.querySelector("#story-plotting-coverage .home-plot-mark[aria-pressed=true]")?.dataset.csvRow==="284"')
   cell=tab.locator('#story-plotting-coverage .home-plot-cell').first.bounding_box();assert cell and cell['width']>=32
   tab.locator('#story-plotting-coverage .story-inline').screenshot(path=str(out/'coverage-phone.png'))
   reading={'inline_scenes':9,'horizontal_overflow':tab.evaluate('document.documentElement.scrollWidth-innerWidth'),'cell_width':cell['width'],'selected_annotation':aid}
   mobile.close();return reading
  check('touch-context phone view has readable diagrams and all matrix rows',phone)
  def reduced():
   reduced=browser.new_context(viewport={'width':1512,'height':801},reduced_motion='reduce')
   reduced.route('**/*',lambda route:route.continue_() if route.request.url.startswith(origin+'/') else route.abort())
   tab=reduced.new_page();tab.goto(origin+'/',wait_until='networkidle')
   tab.locator('#story-analysis .story-step-title').click();tab.wait_for_selector('.story-stage .record-network-edge')
   reading=tab.locator('.story-stage .record-network-edge').first.evaluate('(e)=>({animation:getComputedStyle(e).animationName,dash:getComputedStyle(e).strokeDasharray})')
   assert reading=={'animation':'none','dash':'none'},reading
   tab.locator('#story-coding .story-step-title').click();tab.wait_for_selector('.story-stage .coding-document mark')
   assert tab.locator('.story-stage .coding-document mark').evaluate('(e)=>getComputedStyle(e).animationName')=='none'
   reduced.close();return reading
  check('reduced motion preserves complete network links and coding text',reduced)
  page.screenshot(path=str(out/'last-view.png'))
  context.close();browser.close()
 report={'results':results,'console':errors};(out/'results.json').write_text(json.dumps(report,indent=2))
 print(json.dumps(report,indent=2));return 0 if all(r['pass'] for r in results) and not errors else 1
if __name__=='__main__':raise SystemExit(main())
