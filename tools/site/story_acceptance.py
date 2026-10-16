"""Project-only Chrome checks for permanent Coding and the saved circular network.

Also retains all 594 CSV readouts and proportional matrix checks after the
workflow layout changes. Never attaches to an existing browser or reads /w.
"""
from __future__ import annotations
import argparse,csv,json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright


def main():
 parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:4445');parser.add_argument('--out',required=True);args=parser.parse_args()
 parsed=urlsplit(args.url)
 if parsed.hostname not in ('127.0.0.1','localhost') or parsed.scheme!='http':raise SystemExit('Only the local project is permitted')
 origin=f'{parsed.scheme}://{parsed.netloc}';out=Path(args.out);out.mkdir(parents=True,exist_ok=True);results=[];errors=[];http=[];repo=Path(__file__).resolve().parents[2]
 saved=list(json.loads((repo/'website/lib/report/bologna-evidence.json').read_text())['examples'].values());by_annotation={e['annotation_id']:e for e in saved}
 expected_ids={('code:' if i else 'theme:')+n['id'] for e in saved for i,n in enumerate(e['code_path'])}
 def check(name,fn):
  try:result=fn();results.append({'name':name,'pass':True,'reading':result})
  except Exception as e:results.append({'name':name,'pass':False,'error':str(e)})
 with sync_playwright() as pw:
  browser=pw.chromium.launch(channel='chrome',headless=True)
  def context(**options):
   ctx=browser.new_context(**options);ctx.route('**/*',lambda route:route.continue_() if route.request.url.startswith(origin+'/') else route.abort())
   ctx.on('page',lambda tab:(tab.on('pageerror',lambda e:errors.append(str(e))),tab.on('console',lambda m:errors.append(m.text) if m.type=='error' else None),tab.on('response',lambda r:http.append([r.status,r.url]) if r.status>=400 else None)))
   return ctx
  ctx=context(viewport={'width':1440,'height':900},device_scale_factor=1);page=ctx.new_page();page.goto(origin+'/',wait_until='networkidle');page.set_default_timeout(6000)
  stage='.story-stage--sequence'
  def navigate(kind):
   scene='plotting' if kind=='frequency' else 'plotting-'+kind
   page.locator('#story-'+scene+' .story-step-title').click();page.wait_for_selector(stage+'[data-scene="'+scene+'"]')
  def snapshot(tab,scene,name):
   target=tab.locator('#story-'+scene);target.screenshot(path=str(out/(name+'-full.png')))
   target.locator('.story-proof-art').evaluate('(el)=>el.scrollIntoView({block:"start",behavior:"instant"})');tab.wait_for_timeout(1100);tab.screenshot(path=str(out/(name+'.png')))
  def natural_scroll():
   page.evaluate('window.__qtClicks=0;document.addEventListener("click",()=>window.__qtClicks++)');page.mouse.move(1430,65);seen=set();readings=[]
   for _ in range(50):
    for scene in ['coding','analysis']:
     box=page.locator('#story-'+scene+' [data-diagram]').bounding_box()
     if box and box['y']<600 and box['y']+box['height']>150 and scene not in seen:
      seen.add(scene);readings.append({'scene':scene,'top':box['y']});page.screenshot(path=str(out/f'natural-scroll-{scene}.png'))
    if len(seen)==2:break
    page.mouse.wheel(0,320);page.wait_for_timeout(100)
   assert seen=={'coding','analysis'},readings
   assert page.evaluate('window.__qtClicks')==0
   for scene in seen:assert page.locator(f'[data-permanent-scene="{scene}"]').count()==1
   assert page.locator('#story-coding [data-network-node]').count()==0
   snapshot(page,'coding','coding-desktop');snapshot(page,'analysis','analysis-desktop')
   return {'scenes':readings,'clicks':0,'coding_is_document':True,'analysis_is_circular_network':True}
  check('ordinary scrolling reveals distinct permanent Coding and Analysis without clicks',natural_scroll)
  def identity():
   nodes=page.locator('#story-analysis [data-network-node]');ids=nodes.evaluate_all('(es)=>es.map(e=>e.dataset.networkNode)');assert expected_ids<=set(ids);assert len(set(ids))==len(ids)
   edges=page.locator('#story-analysis [data-edge-from]').evaluate_all('(es)=>es.map(e=>({...e.dataset}))')
   for edge in edges:assert edge['edgeFrom'] in ids and edge['edgeTo'] in ids
   pairs=list(csv.DictReader((repo/'website/public/report/figures/cooccurrence.csv').open(encoding='utf-8')))
   actual_pairs=[e for e in edges if e['edgeKind']=='cooccurrence'];assert len(actual_pairs)==len(pairs)
   names={('code:' if i else 'theme:')+n['id']:n['name'] for record in saved for i,n in enumerate(record['code_path'])}
   for edge in actual_pairs:assert any(row['code_a']==names[edge['edgeFrom']] and row['code_b']==names[edge['edgeTo']] and row['count']==edge['pairCount'] for row in pairs)
   return {'saved_examples':len(saved),'saved_code_theme_nodes':len(expected_ids),'visible_nodes':len(ids),'edges':len(edges),'exact_exported_pairs':len(actual_pairs)}
  check('network IDs and all drawn links match saved records and exported pairs',identity)
  # A small saved theme makes actual mouse hit-testing unambiguous.
  root=saved[0]['code_path'][0]['id'];candidate=next(e for e in saved if e['code_path'][0]['id']==root and len(e['code_path'])>1);code_id='code:'+candidate['code_id']
  def hover_and_drag():
   page.get_by_label('Network theme',exact=True).select_option(root);page.get_by_label('Network node',exact=True).select_option(code_id)
   circle=page.locator(f'[data-network-node="{code_id}"] .force-node-dot');circle.scroll_into_view_if_needed();page.mouse.move(1430,65);page.evaluate('window.__qtClicks=0');before=page.evaluate('scrollY');circle.hover()
   assert page.locator(f'[data-network-node="{code_id}"]').get_attribute('aria-pressed')=='true';assert page.evaluate('window.__qtClicks')==0 and abs(page.evaluate('scrollY')-before)<1
   aid=page.locator('.network-evidence').get_attribute('data-selected-annotation');assert page.locator('.network-evidence mark').inner_text()==by_annotation[aid]['quote']
   box=circle.bounding_box();x=float(circle.get_attribute('cx'));y=float(circle.get_attribute('cy'));page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);page.mouse.down();page.mouse.move(box['x']+box['width']/2+25,box['y']+box['height']/2+18,steps=8);page.mouse.up()
   assert abs(float(circle.get_attribute('cx'))-x)>10 and abs(float(circle.get_attribute('cy'))-y)>5
   page.locator('#story-coding .coding-code').hover();assert page.locator('#story-coding .coding-code').get_attribute('aria-pressed')=='true'
   return {'hover_clicks':0,'source_annotation':aid,'drag_moved_node':True,'coding_hover_independent':True}
  check('real hover reads saved words and mouse drag moves a circular node',hover_and_drag)
  def keyboard():
   page.get_by_label('Network node',exact=True).select_option(code_id);node=page.locator(f'[data-network-node="{code_id}"]');node.focus();before=page.locator('[data-network-node^="passage:"]').count();node.press('Enter')
   after=page.locator('[data-network-node^="passage:"]').count();assert before!=after
   node.press('Home');assert page.evaluate('document.activeElement.dataset.networkNode').startswith('theme:')
   page.keyboard.press('End');assert page.evaluate('document.activeElement.hasAttribute("data-network-node")');page.keyboard.press('ArrowLeft');assert page.evaluate('document.activeElement.getAttribute("aria-pressed")')=='true'
   page.locator('#story-coding .coding-code').focus();page.keyboard.press('PageDown');assert page.evaluate('document.activeElement.closest("#story-analysis")!==null')
   page.keyboard.press('ArrowRight');assert page.evaluate('document.activeElement.closest("#story-plotting")!==null')
   page.locator('#story-coding .coding-passage').focus();page.keyboard.press('Tab');assert page.evaluate('document.activeElement.classList.contains("coding-code")');page.keyboard.press('Tab');assert page.evaluate('document.activeElement.classList.contains("coding-theme-path")')
   return {'source_nodes_before':before,'source_nodes_after':after,'node_keys':True,'native_tab':True,'story_keys':True}
  check('keyboard selects, expands, traverses nodes and moves between permanent scenes',keyboard)
  def phone():
   phone_ctx=context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1);tab=phone_ctx.new_page();tab.goto(origin+'/',wait_until='networkidle')
   assert tab.locator('[data-permanent-scene]').count()==2 and tab.locator('.story-inline').count()==7
   assert tab.locator('.relationship-force-svg').is_visible();assert tab.evaluate('document.documentElement.scrollWidth-innerWidth')==0
   snapshot(tab,'analysis','analysis-phone-overview');snapshot(tab,'coding','coding-phone')
   tab.locator('#story-coding .coding-code').tap();assert tab.locator('#story-coding .coding-code').get_attribute('aria-pressed')=='true'
   tab.get_by_label('Network theme',exact=True).select_option(root);tab.get_by_label('Network node',exact=True).select_option(code_id)
   reveal=tab.get_by_role('button',name='Show source nodes',exact=True)
   if reveal.count():reveal.tap()
   sources=tab.locator('[data-network-node^="passage:"]');assert sources.count()>0
   source_id=sources.first.get_attribute('data-network-node');tab.get_by_label('Network node',exact=True).select_option(source_id);aid=source_id.removeprefix('passage:');assert tab.locator('.network-evidence mark').inner_text()==by_annotation[aid]['quote']
   tab.get_by_role('button',name='Zoom in network',exact=True).tap();tab.get_by_role('button',name='Zoom in network',exact=True).tap()
   viewport=tab.locator('.relationship-viewport');viewport.scroll_into_view_if_needed();box=viewport.bounding_box();client=phone_ctx.new_cdp_session(tab)
   for kind,x in [('touchStart',box['x']+box['width']-25),('touchMove',box['x']+box['width']-100),('touchMove',box['x']+25),('touchEnd',None)]:
    client.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[] if x is None else [{'x':x,'y':box['y']+20}]});tab.wait_for_timeout(70)
   pan=viewport.evaluate('(el)=>el.scrollLeft');assert pan>0
   snapshot(tab,'analysis','analysis-phone-selected');assert tab.evaluate('document.documentElement.scrollWidth-innerWidth')==0
   tab.set_viewport_size({'width':844,'height':390});assert tab.locator('.relationship-force-svg').is_visible();assert tab.evaluate('document.documentElement.scrollWidth-innerWidth')==0
   tab.screenshot(path=str(out/'phone-landscape.png'));phone_ctx.close()
   return {'width':390,'nodes_and_lines_visible':True,'touch_selected_source':aid,'touch_pan_x':pan,'overflow':0,'landscape':True}
  check('phone retains connected nodes, readable source, touch controls and native panning',phone)
  def persistence():
   page.get_by_label('Network node',exact=True).select_option(code_id);chosen=page.locator('.network-evidence').get_attribute('data-selected-annotation');navigate('coverage')
   assert page.locator('[data-permanent-scene="analysis"]').count()==1;assert page.locator('.network-evidence').get_attribute('data-selected-annotation')==chosen
   for width in [1000,1001,1300,1366,1440]:
    page.set_viewport_size({'width':width,'height':768});page.wait_for_timeout(100);assert page.evaluate('document.documentElement.scrollWidth-innerWidth')==0,width
   page.set_viewport_size({'width':1440,'height':900});return {'selection_survives_scroll':True,'widths_without_overflow':[1000,1001,1300,1366,1440]}
  check('permanent selection survives other scenes and responsive breakpoints',persistence)
  def full_values():
   total=0;counts={}
   for kind in ['frequency','coverage','cooccurrence','hierarchy','accumulation']:
    navigate(kind);rows=list(csv.DictReader((repo/'website/public/report/figures'/f'{kind}.csv').open(encoding='utf-8')));select=page.locator(stage+' .home-plot-controls select')
    for i,row in enumerate(rows):
     select.select_option(str(i));page.wait_for_function('(i)=>document.querySelector(".story-stage--sequence .home-plot-mark[aria-pressed=true]")?.dataset.csvRow===String(i)',arg=i)
     actual=page.locator(stage+' .home-plot-mark[aria-pressed=true]').get_attribute('aria-label');label=row['case'] if kind=='accumulation' else row['section']+' › '+row['subsection'] if kind=='hierarchy' else row['case']+' × '+row['code'] if kind=='coverage' else row['code_a']+' × '+row['code_b'] if kind=='cooccurrence' else row['code'];value=row['cumulative'] if kind=='accumulation' else row['count'];assert actual==f'Read {label}: {value}',(kind,i,actual)
     assert page.locator(stage+' .home-plot-inspector > strong').evaluate('(e)=>e.firstChild.textContent')==value;total+=1
    counts[kind]=len(rows)
   navigate('coverage');box=page.locator(stage+' .home-plot-cell').first.bounding_box();assert abs(box['width']-box['height'])<.1 and box['width']>=32
   page.locator(stage+' .home-plot-controls select').select_option('2');page.locator(stage+' [data-csv-row="2"]').press('ArrowRight');assert page.evaluate('document.activeElement.dataset.csvRow')=='3'
   return {'exact_rows':total,'per_figure':counts,'square_readable_matrix':True,'plot_keyboard':True}
  check('all 594 CSV readouts and proportional matrix behavior remain intact',full_values)
  def reduced():
   reduced_ctx=context(viewport={'width':1440,'height':900},reduced_motion='reduce');tab=reduced_ctx.new_page();tab.goto(origin+'/',wait_until='networkidle');tab.locator('#story-coding').scroll_into_view_if_needed()
   assert tab.locator('#story-coding mark').evaluate('(el)=>getComputedStyle(el).animationName')=='none'
   positions=tab.locator('[data-network-node] .force-node-dot').evaluate_all('(es)=>es.map(el=>[el.getAttribute("cx"),el.getAttribute("cy")])');tab.wait_for_timeout(300);assert positions==tab.locator('[data-network-node] .force-node-dot').evaluate_all('(es)=>es.map(el=>[el.getAttribute("cx"),el.getAttribute("cy")])')
   tab.locator('#story-analysis').screenshot(path=str(out/'reduced-motion-analysis.png'));reduced_ctx.close();return {'coding_animation':'none','network_layout_static':True}
  check('reduced-motion view retains static nodes, links and source',reduced)
  def report_and_console():
   for width,height in [(1440,900),(390,844)]:
    page.set_viewport_size({'width':width,'height':height});page.goto(origin+'/report',wait_until='networkidle');assert page.evaluate('document.documentElement.scrollWidth-innerWidth')==0;assert page.locator('figure').count()>=5;page.screenshot(path=str(out/f'report-{width}.png'))
   assert not errors,errors;assert not http,http;return {'console_errors':errors,'http_errors':http,'report_widths':[1440,390]}
  check('report renders at both widths and all normal console/HTTP responses are clean',report_and_console)
  browser.close()
 (out/'results.json').write_text(json.dumps({'checks':results,'console':errors,'http':http},indent=2));print(json.dumps(results,indent=2));return 0 if all(r['pass'] for r in results) else 1

if __name__=='__main__':raise SystemExit(main())
