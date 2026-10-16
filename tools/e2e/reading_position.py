"""UX-25 isolated Bologna reading/navigation acceptance (project origin only)."""
import argparse,json,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright,expect

def main():
 parser=argparse.ArgumentParser();parser.add_argument('--url',required=True);parser.add_argument('--out',required=True);a=parser.parse_args();base=a.url.rstrip('/');assert base.startswith(('http://127.0.0.1:','http://localhost:'));out=Path(a.out);out.mkdir(parents=True,exist_ok=True);shots=out/'screenshots';shots.mkdir(exist_ok=True);result={'checks':[],'console':[],'http':[],'writes':[]}
 with sync_playwright() as pw:
  browser=pw.chromium.launch(channel='chrome',headless=True)
  def context(**options):
   c=browser.new_context(**options);c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else r.abort());p=c.new_page();p.set_default_timeout(7000);p.on('pageerror',lambda e:result['console'].append(str(e)));p.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None);p.on('response',lambda r:result['http'].append([r.status,r.url]) if r.status>=400 else None);p.on('request',lambda r:result['writes'].append(r.url) if r.method=='POST' else None);return c,p
  ctx,page=context(viewport={'width':1440,'height':900});boot=ctx.request.get(base+'/w/api/bootstrap').json();headers={'X-QualiCraft-Token':boot['token']};pid='a71a0b538c024c3ab23fb4286cfe93e2';url=base+'/w/api/projects/'+pid;original=ctx.request.get(url,headers=headers).json();assert original['name']=='Bologna · What is data?' and len(original['documents'])==19 and len(original['annotations'])==874;(out/'project-before.json').write_text(json.dumps(original,ensure_ascii=False,indent=2));snapshots=ctx.request.get(url+'/backups',headers=headers).json()['items'];documents=original['documents'];d1,d2=documents[:2]
  def open_original(p):
   p.goto(base+'/w/?lang=en',wait_until='networkidle')
   if p.locator('#project-select').input_value()!=pid:
    if p.locator('#project-select').is_visible():p.locator('#project-select').select_option(pid)
    else:p.locator('[data-action="projects"]:visible').first.click();p.locator('#modal-project-select').select_option(pid);p.locator('[data-action="switch-project"]').click()
   expect(p.locator('.project-strip h1')).to_have_text(original['name'])
  def snap(p,name):p.wait_for_timeout(100);p.screenshot(path=str(shots/(name+'.png')))
  def check(name,fn,p=page):
   print('START',name,flush=True)
   try:result['checks'].append({'name':name,'pass':True,'evidence':fn()});print('PASS',name,flush=True)
   except Exception as e:result['checks'].append({'name':name,'pass':False,'error':str(e),'traceback':traceback.format_exc()});snap(p,'failure-'+str(len(result['checks'])));print('FAIL',name,str(e),flush=True)
   (out/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
  def swipe(c,p):
   session=c.new_cdp_session(p)
   for _ in range(3):
    session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':75,'y':730}]})
    for y in [650,570,490,410,330,250]:session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':75,'y':y}]});p.wait_for_timeout(20)
    session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});p.wait_for_timeout(100)
   session.detach();p.wait_for_timeout(180)
  def current(p):return p.evaluate('({start:readingMounted.start,document:state.docId,label:document.querySelector("#reading-position").textContent})')
  def stored(p):return p.evaluate('readReadingPosition(state.project,doc())')
  def wheel(p,y):
   p.mouse.move(p.locator('#document-pane').bounding_box()['x']+10,p.viewport_size['height']-70);p.mouse.wheel(0,y);p.wait_for_timeout(220)
  open_original(page)
  def compact():
   assert page.locator('#reading-document option').count()==19;assert not page.locator('.reading-details').get_attribute('open');assert not page.locator('#doc-memo').is_visible();assert page.locator('.tabs-bar').count()==0
   top=page.locator('.paragraph').first.bounding_box()['y'];assert top<360,top;snap(page,'01-desktop-compact');return {'first_paragraph_top':top,'before':416.375,'documents':19,'details_initially_folded':True}
  check('desktop compact header retains tools and folds document metadata/notes',compact)
  saved={}
  def desktop_memory():
   wheel(page,2100);saved['d1']=current(page);assert saved['d1']['start']>0;assert stored(page)['start']==saved['d1']['start'];assert page.locator('.reading-dock').bounding_box()['y']>=0
   page.locator('#reading-document').select_option(d2['id']);assert current(page)['document']==d2['id'];wheel(page,3200);saved['d2']=current(page);assert saved['d2']['start']>0
   page.locator('#reading-document').select_option(d1['id']);assert current(page)['start']==saved['d1']['start'];page.locator('#reading-document').select_option(d2['id']);page.reload(wait_until='networkidle');assert current(page)['document']==d2['id'] and current(page)['start']==saved['d2']['start'];snap(page,'02-desktop-restored');return saved
  check('real wheel, document switching and reload restore independent paragraph anchors',desktop_memory)
  def keyboard():
   select=page.locator('#reading-document');select.focus();select.press('Home');select.press('ArrowDown');select.press('Enter');assert page.locator('#reading-document').evaluate('(e)=>e===document.activeElement');page.locator('[data-action="reading-resume"]').focus();page.keyboard.press('Enter');assert page.evaluate('document.activeElement.classList.contains("paragraph")');r=page.evaluate('({p:document.activeElement.getBoundingClientRect().top,d:document.querySelector(".reading-dock").getBoundingClientRect().bottom})');assert r['p']>=r['d']-2
   page.locator('.reading-details summary').focus();page.keyboard.press('Enter');expect(page.locator('#doc-memo')).to_be_visible();assert 'does not mark' in page.locator('.reading-memory-note').inner_text();page.keyboard.press('Enter');page.locator('.reading-context').focus();assert page.locator('.reading-context').evaluate('(e)=>e===document.activeElement');snap(page,'03-keyboard-resume');return {'native_select':True,'resume_focuses_unobscured_paragraph':r,'details_notes_retained':True,'path_keyboard_scrollable':True}
  check('keyboard switches documents, resumes without obstruction and opens details',keyboard)
  def filters():
   page.locator('#reading-document').select_option(d1['id']);wheel(page,1200);anchor=stored(page)['start'];page.locator('#search').fill('NO_MATCH_TECHNICAL_MARKER');expect(page.locator('#reading-position')).to_have_text('No matching paragraph');assert stored(page)['start']==anchor,{'saved':stored(page),'expected':anchor};page.locator('#search').fill('');assert current(page)['start']==anchor,{'current':current(page),'expected':anchor}
   page.locator('[data-action="toggle-codebook"]').click();root=next(c for c in original['codes'] if not c.get('parent_id'));page.locator(f'#side-list [data-action="filter-code"][data-id="{root["id"]}"]').click();assert stored(page)['start']==anchor;assert root['name'] in page.locator('#reading-code-path').inner_text();page.locator('[data-action="clear-filter"]').click();assert current(page)['start']==anchor;return {'search_and_code_filter_preserve_unfiltered_anchor':True,'anchor':anchor}
  check('search and theme filters do not overwrite the full-document reading position',filters)
  def source():
   sample=next(a for a in original['annotations'] if a['document_id']==d1['id']);pill=page.locator(f'.pill[data-id="{sample["id"]}"]').first;pill.scroll_into_view_if_needed();pill.hover();assert original['codes'];code=next(c for c in original['codes'] if c['id']==sample['code_id']);assert code['name'] in page.locator('#reading-code-path').inner_text();assert page.locator('#reading-path-label').inner_text()=='Focused coding';pill.focus();assert code['name'] in page.locator('#reading-code-path').inner_text();snap(page,'04-desktop-coding-path');page.mouse.move(1420,50)
   page.locator('[data-action="view"][data-view="insights"]').click();expect(page.locator('#network-select')).to_be_enabled();nodes=page.locator('#network-select option').evaluate_all('(es)=>es.map(e=>e.value).filter(Boolean)');node='code:'+sample['code_id'];assert node in nodes;page.locator('#network-select').select_option(node);page.locator('[data-action="net-evidence"]').first.click();page.locator('[data-action="net-locate"]').first.click();expect(page.locator('.source-target').first).to_be_focused();target=page.evaluate('state.sourceFocus');assert target in page.locator('.source-target').first.evaluate('(e)=>JSON.parse(e.dataset.codingIds)');assert page.locator('#reading-document').input_value()==next(a['document_id'] for a in original['annotations'] if a['id']==target);page.locator('[data-action="net-return"]').click();expect(page.locator('#network-stage')).to_be_visible();page.locator('[data-action="view"][data-view="coding"]').click();return {'hover_and_focus_exact_path':True,'network_source_id':target,'explicit_source_jump_and_return':True}
  check('hover/focus reports the real coding path; network source location beats saved memory',source)
  def phone():
   c,t=context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);open_original(t);top=t.locator('.paragraph').first.bounding_box()['y'];assert top<600,top;assert t.locator('#reading-document option').count()==19;assert not t.locator('#reading-coding-tools').is_visible();t.locator('[data-action="reading-tools"]').tap();expect(t.locator('#reading-coding-tools')).to_be_visible();t.locator('[data-action="reading-tools"]').tap();snap(t,'05-phone-compact');swipe(c,t);first=current(t);assert first['start']>0,{'current':first,'scroll':t.evaluate('scrollY'),'pane':t.locator('#document-pane').evaluate('(e)=>({top:e.scrollTop,style:getComputedStyle(e).overflowY})')};dock=t.locator('.reading-dock').bounding_box();assert abs(dock['y'])<1,dock;snap(t,'06-phone-sticky-reading')
   t.locator('#reading-document').select_option(d2['id']);wheel(t,2300);second=current(t);t.locator('#reading-document').select_option(d1['id']);assert current(t)['start']==first['start'];t.locator('#reading-document').select_option(d2['id']);t.reload(wait_until='networkidle');assert current(t)['start']==second['start'],{'expected':second,'actual':current(t),'saved':stored(t)};assert t.locator('#reading-document').input_value()==d2['id'];snap(t,'07-phone-restored')
   t.locator('[data-action="coding-codebook"]').tap();expect(t.locator('#mobile-code-filter')).to_be_focused();assert t.locator('#mobile-codebook-list [data-code-node]').count()==317;t.keyboard.press('Escape');expect(t.locator('[data-action="coding-codebook"]')).to_be_focused();assert t.evaluate('document.documentElement.scrollWidth-innerWidth')==0;targets=t.locator('.reading-primary select,.reading-primary button').evaluate_all('(es)=>es.map(e=>e.getBoundingClientRect().height)');assert all(h>=44 for h in targets),targets
   before=current(t)['start'];t.set_viewport_size({'width':844,'height':390});t.wait_for_timeout(160);assert current(t)['start']==before;assert t.evaluate('document.documentElement.scrollWidth-innerWidth')==0;snap(t,'08-phone-landscape');c.close();return {'first_paragraph_top':top,'before':628.375,'sticky_top':dock['y'],'independent_anchors':[first,second],'touch_controls_at_least_44px':True,'orientation_retains_anchor':True,'physical_device':'not tested'}
  check('phone has direct document switching, sticky context, touch tools and independent restore',phone)
  def resize():
   rows=[]
   for w in [320,390,800,801,1120,1121,1279,1280,1366,1440]:
    page.set_viewport_size({'width':w,'height':900});page.wait_for_timeout(80);rows.append({'width':w,'overflow':page.evaluate('document.documentElement.scrollWidth-innerWidth')});assert rows[-1]['overflow']==0,rows[-1]
   return rows
  check('responsive boundaries retain all content without horizontal page overflow',resize)
  def blocked():
   c,t=context(viewport={'width':1440,'height':900},reduced_motion='reduce');c.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw Error('storage disabled')}})");open_original(t);wheel(t,1200);assert current(t)['start']>0;assert t.locator('[data-action="reading-resume"]').is_disabled();t.locator('#reading-document').select_option(d2['id']);assert current(t)['document']==d2['id'];snap(t,'09-storage-unavailable-reduced-motion');c.close();return {'blocked_storage_no_crash':True,'resume_disabled_without_saved_anchor':True,'reduced_motion':True}
  check('blocked storage and reduced motion retain navigation without claiming a saved position',blocked)
  def no_write():
   final=ctx.request.get(url,headers=headers).json();assert final==original;assert ctx.request.get(url+'/backups',headers=headers).json()['items']==snapshots;assert result['writes']==[],result['writes'];assert result['console']==[],result['console'];assert result['http']==[],result['http'];(out/'project-after-readonly.json').write_text(json.dumps(final,ensure_ascii=False,indent=2));return {'project_json_equal':True,'post_requests':0,'snapshot_list_equal':True,'console_errors':0,'http_errors':0,'documents':19,'codes':317,'codings':874}
  check('reading-only acceptance leaves project, audit, snapshots and source records unchanged',no_write)
  def pending_notes():
   copy=json.loads(json.dumps(original));copy['name']='Bologna · UX25 navigation regression';restored=ctx.request.post(base+'/w/api/projects',headers=headers,data={'kind':'restore','project':copy});assert restored.ok;extra=restored.json();extra_url=base+'/w/api/projects/'+extra['id'];page.reload(wait_until='networkidle');page.locator('#project-select').select_option(extra['id']);expect(page.locator('.project-strip h1')).to_have_text(copy['name']);page.locator('.reading-details summary').click()
   with page.expect_response(lambda r:r.url.endswith('/document-update')) as first:
    page.locator('#doc-memo').fill('Bologna · '+d1['name']);page.locator('#reading-document').select_option(d2['id'])
   assert first.value.request.post_data_json['id']==d1['id'];page.locator('.reading-details summary').click()
   with page.expect_response(lambda r:r.url.endswith('/document-update')) as second:
    page.locator('#doc-memo').fill('Bologna · '+d2['name']);page.locator('#project-select').select_option(pid)
   assert second.value.request.url==extra_url+'/document-update' and second.value.request.post_data_json['id']==d2['id'];updated=ctx.request.get(extra_url,headers=headers).json();assert next(d for d in updated['documents'] if d['id']==d1['id'])['memo']=='Bologna · '+d1['name'];assert next(d for d in updated['documents'] if d['id']==d2['id'])['memo']=='Bologna · '+d2['name'];assert ctx.request.get(url,headers=headers).json()==original;snap(page,'10-original-after-notes-regression');return {'extra_bologna_copy':extra['id'],'both_notes_saved_to_correct_document_and_project':True,'original_project_equal':True}
  check('rapid document/project switches keep pending notes on an extra Bologna copy',pending_notes)
  browser.close()
 (out/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));assert all(c['pass'] for c in result['checks'])
if __name__=='__main__':main()
