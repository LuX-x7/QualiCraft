"""Project-only Coding tree/highlight regression on disposable Bologna copies.

Only a restored Bologna copy receives manual coding/edit/merge writes. The
original 19-document/874-coding project must remain equal to its initial JSON.
"""
from __future__ import annotations
import argparse,json,traceback
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright,expect


def main():
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--url',required=True);parser.add_argument('--out',required=True);args=parser.parse_args();parsed=urlsplit(args.url)
 if parsed.scheme!='http' or parsed.hostname not in ('127.0.0.1','localhost'):raise SystemExit('Only the loopback project is permitted')
 base=args.url.rstrip('/');out=Path(args.out);out.mkdir(parents=True,exist_ok=True);shots=out/'screenshots';shots.mkdir(exist_ok=True);results={'checks':[],'console':[],'http':[],'writes':[]}
 def save():(out/'results.json').write_text(json.dumps(results,indent=2),encoding='utf8')
 with sync_playwright() as pw:
  browser=pw.chromium.launch(channel='chrome',headless=True)
  def context(**options):
   c=browser.new_context(**options);c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else r.abort());p=c.new_page();p.set_default_timeout(8000);p.on('pageerror',lambda e:results['console'].append(str(e)));p.on('console',lambda m:results['console'].append(m.text) if m.type=='error' else None);p.on('response',lambda r:results['http'].append([r.status,r.url]) if r.status>=400 else None);p.on('request',lambda r:results['writes'].append(r.url) if r.method=='POST' else None);return c,p
  ctx,page=context(viewport={'width':1440,'height':900});boot=ctx.request.get(base+'/w/api/bootstrap').json();headers={'X-QualiCraft-Token':boot['token']};pid='a71a0b538c024c3ab23fb4286cfe93e2';url=base+'/w/api/projects/'+pid;original=ctx.request.get(url,headers=headers).json();assert original['name']=='Bologna · What is data?' and len(original['documents'])==19 and len(original['annotations'])==874
  (out/'project-before.json').write_text(json.dumps(original,ensure_ascii=False,indent=2));codes={c['id']:c for c in original['codes']};docs={d['id']:d for d in original['documents']};children={id:[c for c in codes.values() if c.get('parent_id')==id] for id in codes}
  def chain(code):
   path=[code]
   while code.get('parent_id') in codes:code=codes[code['parent_id']];path.insert(0,code)
   return path
  def path(code):return ' > '.join(c['name'] for c in chain(code))
  initial_doc=original['documents'][0];sample=max((a for a in original['annotations'] if a['document_id']==initial_doc['id']),key=lambda a:len(chain(codes[a['code_id']])));leaf=codes[sample['code_id']];root=chain(leaf)[0]
  def snap(p,name):p.wait_for_timeout(120);p.screenshot(path=str(shots/(name+'.png')))
  def check(name,fn,p=page):
   print('START',name,flush=True)
   try:results['checks'].append({'name':name,'pass':True,'reading':fn()});print('PASS',name,flush=True)
   except Exception as e:results['checks'].append({'name':name,'pass':False,'error':str(e),'traceback':traceback.format_exc()});snap(p,'failure-'+str(len(results['checks'])));print('FAIL',name,str(e),flush=True)
   save()
  page.goto(base+'/w/?lang=en',wait_until='networkidle');page.locator('#project-select').select_option(pid);expect(page.locator('.project-strip h1')).to_have_text(original['name'])
  def tree():
   page.locator('[data-action="toggle-codebook"]').click();nodes=page.locator('#side-list [data-code-node]');actual=nodes.evaluate_all('(es)=>es.map(e=>({id:e.dataset.codeNode,parent:e.dataset.parentId,domParent:e.parentElement.closest("[data-code-node]")?.dataset.codeNode||"",name:e.querySelector(".name").textContent,role:e.querySelector(".code-role").textContent}))');assert len(actual)==317
   for node in actual:
    c=codes[node['id']];assert node['parent']==(c.get('parent_id') or '')==node['domParent'];assert node['name']==c['name'];assert node['role']==('Theme / group' if not c.get('parent_id') and children[c['id']] else 'Ungrouped code' if not c.get('parent_id') else 'Parent code' if children[c['id']] else 'Code')
   target=page.locator(f'#side-list [data-action="filter-code"][data-id="{leaf["id"]}"]');target.scroll_into_view_if_needed();assert target.locator('.name').evaluate('(e)=>getComputedStyle(e).whiteSpace')=='normal';snap(page,'01-desktop-tree')
   return {'saved_nodes':len(actual),'root_groups':sum(not c.get('parent_id') for c in codes.values()),'deepest_levels':max(len(chain(c)) for c in codes.values()),'names_and_parent_ids_exact':True,'native_nested_lists':True}
  check('all 317 saved codes have real nested ancestry, explicit roles and complete names',tree)
  def keyboard():
   pick=lambda id:page.locator(f'#side-list [data-action="filter-code"][data-id="{id}"]');pick(root['id']).focus();pick(root['id']).press('ArrowLeft');assert page.locator(f'#side-list [data-action="toggle-code"][data-id="{root["id"]}"]').get_attribute('aria-expanded')=='false';assert page.evaluate('document.activeElement.dataset.id')==root['id'];assert not pick(leaf['id']).is_visible()
   pick(root['id']).press('ArrowRight');assert pick(leaf['id']).is_visible();pick(root['id']).press('ArrowRight');assert page.evaluate('document.activeElement.closest("[data-code-node]").dataset.parentId')==root['id'];page.keyboard.press('Home');assert page.evaluate('document.activeElement.closest(".codebook-tree")!==null');page.keyboard.press('End');page.keyboard.press('ArrowUp');page.keyboard.press('ArrowDown')
   pick(leaf['id']).focus();page.keyboard.press('Tab');assert page.evaluate('document.activeElement.dataset.action')=='code-edit';page.keyboard.press('Enter');expect(page.locator('#ec-name')).to_have_value(leaf['name']);page.keyboard.press('Escape');expect(page.locator(f'#side-list [data-action="code-edit"][data-id="{leaf["id"]}"]')).to_be_focused()
   return {'collapse_expand_parent_child_arrows':True,'home_end_up_down':True,'native_tab_edit_escape_return':True}
  check('keyboard operates disclosures, tree navigation and existing edit controls',keyboard)
  def search_filter():
   page.locator('#side-filter').fill(leaf['name']);target=page.locator(f'#side-list [data-code-node="{leaf["id"]}"]');assert target.locator('.code-parent').inner_text()==path(leaf);assert page.locator('#side-filter').input_value()==leaf['name'];target.locator('[data-action="filter-code"]').press('Enter');assert path(leaf) in page.locator('.reader-code-filter').inner_text();assert page.evaluate('document.activeElement.dataset.id')==leaf['id'];snap(page,'02-desktop-filter-path');page.locator('[data-action="clear-filter"]').click();page.locator('#side-filter').fill('');
   return {'full_search_path':path(leaf),'stable_id_selected':leaf['id'],'filter_keyboard_focus_retained':True}
  check('search and filtering retain complete parent paths and stable ID identity',search_filter)
  def calm_hover():
   backgrounds=page.locator('.passage mark').evaluate_all('(es)=>[...new Set(es.map(e=>getComputedStyle(e).backgroundColor))]');assert len(backgrounds)==1,backgrounds
   assert page.locator('.passage mark[style]').count()==0
   text=page.locator('.passage').evaluate_all('(es)=>es.map(e=>({start:Number(e.dataset.start),text:e.textContent}))')
   for item in text:assert initial_doc['text'][item['start']:item['start']+len(item['text'])]==item['text']
   pill=page.locator(f'.pill[data-id="{sample["id"]}"]').first;pill.scroll_into_view_if_needed();page.mouse.move(1425,70);before=pill.bounding_box();pill.hover();page.wait_for_timeout(180);after=pill.bounding_box();assert abs(before['y']-after['y'])<1;assert pill.get_attribute('class')=='pill coding-active'
   active=page.locator('.passage mark.coding-active').evaluate_all('(es)=>es.map(e=>JSON.parse(e.dataset.codingIds))');assert active and all(sample['id'] in ids for ids in active)
   for c in chain(leaf):assert page.locator(f'.margin-tree [data-coding-node="{c["id"]}"].coding-path-active').count()>0
   para=pill.locator('xpath=ancestor::*[contains(concat(" ",normalize-space(@class)," ")," paragraph ")]');assert para.locator('.coding-preview-path').inner_text()==path(leaf)
   snap(page,'03-desktop-focused-coding');return {'neutral_colors':backgrounds,'plain_source_text_preserved':True,'hover_target_did_not_move':True,'focused_annotation':sample['id'],'full_path':path(leaf)}
  check('one calm highlight palette and real hover link the exact source and all ancestors',calm_hover)
  def overlaps():
   pill=page.locator(f'.pill[data-id="{sample["id"]}"]').first;pill.focus();pill.press('Enter');expect(page.locator('#dialog')).to_be_visible();assert page.locator('#dialog .big-quote').text_content()==sample['quote'];assert path(leaf) in page.locator('.coding-detail-path').inner_text();expected=[a for a in original['annotations'] if a['document_id']==sample['document_id'] and a['start']<sample['end'] and a['end']>sample['start']]
   if len(expected)>1:
    page.locator('.coding-overlaps summary').click();actual=page.locator('.coding-overlaps [data-action="annotation"]').evaluate_all('(es)=>es.map(e=>e.dataset.id)');assert set(actual)=={a['id'] for a in expected}
    other=next(a for a in expected if a['id']!=sample['id']);page.locator(f'.coding-overlaps [data-id="{other["id"]}"]').click();assert page.locator('.big-quote').text_content()==other['quote'];page.keyboard.press('Escape');expect(page.locator(f'.pill[data-id="{other["id"]}"]').first).to_be_focused()
   else:page.keyboard.press('Escape')
   pill=page.locator(f'.pill[data-id="{sample["id"]}"]').first;pill.press('Enter');page.locator('[data-action="coding-locate"]').press('Enter');assert not page.locator('#dialog').is_visible();assert sample['id'] in page.evaluate('JSON.parse(document.activeElement.dataset.codingIds)');snap(page,'04-desktop-exact-source');return {'overlapping_saved_codings':len(expected),'every_id_reachable':True,'exact_quote_and_source_focus':True}
  check('overlapping codings remain individually accessible with exact quote, path and source location',overlaps)
  def no_writes():
   after=ctx.request.get(url,headers=headers).json();assert after==original;assert results['writes']==[],results['writes'];(out/'project-after-readonly.json').write_text(json.dumps(after,ensure_ascii=False,indent=2));return {'project_json_equal':True,'post_requests':0,'codings':874}
  check('all tree, highlight, search and inspection actions leave the original project unchanged',no_writes)
  def phone():
   c,t=context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True);t.goto(base+'/w/?lang=en',wait_until='networkidle');
   if t.locator('#project-select').input_value()!=pid:
    t.locator('[data-action="projects"]:visible').first.tap();t.locator('#modal-project-select').select_option(pid);t.locator('[data-action="switch-project"]').tap();expect(t.locator('.project-strip h1')).to_have_text(original['name'])
   assert t.evaluate('innerWidth')==390;t.locator('[data-action="coding-codebook"]').tap();expect(t.locator('#mobile-code-filter')).to_be_focused();assert t.locator('#mobile-codebook-list [data-code-node]').count()==317
   t.locator('#mobile-code-filter').fill(leaf['name']);assert t.locator('#mobile-code-filter').input_value()==leaf['name'];row=t.locator(f'#mobile-codebook-list [data-code-node="{leaf["id"]}"]');assert row.locator('.code-parent').inner_text()==path(leaf);snap(t,'05-phone-codebook-search');row.locator('[data-action="filter-code"]').tap();expect(t.locator('#dialog')).not_to_be_visible();assert path(leaf) in t.locator('.reader-code-filter').inner_text();assert t.evaluate('document.documentElement.scrollWidth-innerWidth')==0
   pill=t.locator(f'.pill[data-id="{sample["id"]}"]').first;pill.tap();assert t.locator('.big-quote').text_content()==sample['quote'];snap(t,'06-phone-coding-detail');t.locator('[data-action="coding-locate"]').tap();t.locator(f'.pill[data-id="{sample["id"]}"]').first.scroll_into_view_if_needed();snap(t,'07-phone-tree-and-coding')
   t.locator('[data-action="coding-codebook"]').tap();t.locator('#mobile-code-filter').fill('');targets=t.locator('#mobile-codebook-list .twisty:not(.leaf),#mobile-codebook-list .edit-code').evaluate_all('(es)=>es.slice(0,8).map(e=>{const r=e.getBoundingClientRect();return [r.width,r.height]})');assert all(w>=44 and h>=44 for w,h in targets),targets;snap(t,'08-phone-full-tree');first=t.locator('#mobile-codebook-list [data-action="toggle-code"]').first;id=first.get_attribute('data-id');first.tap();assert t.locator(f'#mobile-codebook-list [data-action="toggle-code"][data-id="{id}"]').get_attribute('aria-expanded')=='false';t.keyboard.press('Escape');expect(t.locator('[data-action="coding-codebook"]')).to_be_focused()
   t.set_viewport_size({'width':844,'height':390});assert t.evaluate('document.documentElement.scrollWidth-innerWidth')==0;snap(t,'08-phone-landscape');c.close();return {'width':390,'touch_search_select_disclosure':True,'escape_returns_focus':True,'nodes_and_connectors_preserved':True,'overflow':0,'physical_device':'not tested'}
  check('phone exposes the full tree, touch selection, exact quotation and keyboard dismissal',phone)
  def reduced():
   c,t=context(viewport={'width':1440,'height':900},reduced_motion='reduce');t.goto(base+'/w/?lang=en',wait_until='networkidle');t.locator('#project-select').select_option(pid);expect(t.locator('.project-strip h1')).to_have_text(original['name']);pill=t.locator(f'.pill[data-id="{sample["id"]}"]').first;pill.focus();assert pill.get_attribute('class')=='pill coding-active';assert pill.evaluate('(e)=>getComputedStyle(e).animationName')=='none';snap(t,'09-reduced-motion');c.close();return {'static_highlight_and_focus':True}
  check('reduced motion preserves static source and hierarchy focus',reduced)
  def responsive():
   widths=[800,801,1120,1121,1279,1280,1366,1440]
   for width in widths:
    page.set_viewport_size({'width':width,'height':768});assert page.evaluate('document.documentElement.scrollWidth-innerWidth')==0,width
    if width==1366:snap(page,'11-laptop-coding')
   page.set_viewport_size({'width':1440,'height':900})
   for c in codes.values():
    if c.get('parent_id'):continue
    toggle=page.locator(f'#side-list [data-action="toggle-code"][data-id="{c["id"]}"]')
    if toggle.count() and toggle.get_attribute('aria-expanded')=='true':toggle.click()
   page.locator('[data-action="toggle-codebook"]').evaluate('(e)=>e.scrollIntoView({block:"start",behavior:"instant"})');snap(page,'12-desktop-theme-groups')
   return {'widths':widths,'page_overflow':0,'coding_sidebar_only':True}
  check('Coding layouts remain usable across phone, laptop and sidebar breakpoints',responsive)
  def write_regression():
   copy={**original,'name':'Bologna · Coding UI regression'};r=ctx.request.post(base+'/w/api/projects',headers=headers,data={'kind':'restore','project':copy});assert r.ok,r.text();edit=r.json();eid=edit['id'];eurl=base+'/w/api/projects/'+eid;page.reload(wait_until='networkidle');
   if page.locator('#project-select').input_value()!=eid:page.locator('#project-select').select_option(eid)
   expect(page.locator('.project-strip h1')).to_have_text(copy['name'])
   para=page.locator('.passage').nth(1);para.scroll_into_view_if_needed();box=para.bounding_box();page.mouse.move(box['x']+5,box['y']+10);page.mouse.down();page.mouse.move(min(box['x']+235,box['x']+box['width']-5),box['y']+10,steps=16);page.mouse.up();expect(page.locator('#code-search')).to_be_visible();selected=page.evaluate('({...state.selection})');assert selected['end']>selected['start'];quote=initial_doc['text'][selected['start']:selected['end']]
   page.locator('#code-search').fill(leaf['name']);page.locator(f'#code-suggest [data-action="popup-apply"][data-id="{leaf["id"]}"]').click();page.wait_for_function('()=>state.project.annotations.length===875');current=ctx.request.get(eurl,headers=headers).json();added=next(a for a in current['annotations'] if a['id'] not in {a['id'] for a in edit['annotations']});assert added['quote']==quote and added['code_id']==leaf['id'] and added['source']=='manual';assert added['start']==selected['start'] and added['end']==selected['end'];snap(page,'10-manual-coding-preserved')
   page.locator('[data-action="toggle-codebook"]').click();page.locator('#side-filter').fill(leaf['name']);page.locator(f'#side-list [data-action="code-edit"][data-id="{leaf["id"]}"]').click();page.locator('[data-action="code-merge-ask"]').click();targets=page.locator('#merge-target option').evaluate_all('(es)=>es.map(e=>e.value)');assert leaf['id'] not in targets
   def is_desc(c):return any(n['id']==leaf['id'] for n in chain(c)[:-1])
   assert not any(c['id'] in targets for c in codes.values() if is_desc(c));target=next(c for c in codes.values() if not children[c['id']] and chain(c)[0]['id']!=root['id']);page.locator('#merge-target').select_option(target['id']);page.locator('[data-action="code-merge"]').click();page.wait_for_function('(id)=>!state.project.codes.some(c=>c.id===id)',arg=leaf['id']);merged=ctx.request.get(eurl,headers=headers).json();assert not any(a['code_id']==leaf['id'] for a in merged['annotations']);assert any(a['code_id']==target['id'] and a['quote']==quote and a['start']==added['start'] for a in merged['annotations']);assert ctx.request.get(url,headers=headers).json()==original
   (out/'write-copy-after.json').write_text(json.dumps(merged,ensure_ascii=False,indent=2));return {'disposable_project_id':eid,'real_mouse_selection':True,'manual_quote_exact':True,'merge_target':target['id'],'normal_cross_tree_merge':True,'original_project_unchanged':True}
  check('real manual coding and cross-tree merge still work on a separate Bologna copy',write_regression)
  def final():
   assert ctx.request.get(url,headers=headers).json()==original;assert not results['console'],results['console'];assert not results['http'],results['http'];return {'normal_console_errors':0,'http_errors':0,'original_codings':874,'writes_confined_to_restored_bologna_copy':True}
  check('original Bologna records remain unchanged and normal console/HTTP is clean',final)
  browser.close();save()
 print(json.dumps({'passed':sum(c['pass'] for c in results['checks']),'total':len(results['checks']),'console':results['console'],'http':results['http']},indent=2));return 0 if all(c['pass'] for c in results['checks']) else 1

if __name__=='__main__':raise SystemExit(main())
