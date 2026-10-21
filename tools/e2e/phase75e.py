"""75E current English first-visit workflow. Audit only; disposable local Bologna."""
from pathlib import Path
import argparse,copy,csv,hashlib,io,json,os,sys,time,traceback,zipfile
from xml.etree import ElementTree as ET
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT))
from playwright.sync_api import sync_playwright,expect
from qualicraft import analyze,core,plotting,reporting
from qualicraft.examples import teaching_project
sha=lambda raw:hashlib.sha256(raw).hexdigest()
KINDS=['frequency','coverage','cooccurrence','hierarchy','accumulation']

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--config',type=Path,required=True);ap.add_argument('--out',type=Path,required=True);args=ap.parse_args();c=json.loads(args.config.read_text(encoding='utf-8'));base=c['origin'];assert base.startswith('http://127.0.0.1:');out=args.out;out.mkdir(parents=True,exist_ok=True);result={'checks':[],'issues':[],'console':[],'page_errors':[],'http':[],'timings':{}};seed=teaching_project()
 def dump(name,value):(out/name).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
 with sync_playwright() as pw:
  browser=pw.chromium.launch(channel='chrome');ctx=browser.new_context(viewport={'width':1440,'height':1000},accept_downloads=True);page=ctx.new_page();page.set_default_timeout(20000);page.on('pageerror',lambda e:result['page_errors'].append(str(e)));page.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None);page.on('response',lambda r:result['http'].append([r.status,r.url]) if r.status>=400 else None)
  def shot(name):page.screenshot(path=str(out/(name+'.png')))
  def check(name,fn,target=None):
   print('START '+name,flush=True);t=time.monotonic()
   try:
    detail=fn();result['checks'].append({'name':name,'pass':True,'seconds':round(time.monotonic()-t,3),'detail':detail});print('PASS '+name,flush=True)
   except Exception as e:
    result['checks'].append({'name':name,'pass':False,'error':(str(e).splitlines() or [type(e).__name__])[0],'frames':[f'{f.filename}:{f.lineno}' for f in traceback.extract_tb(e.__traceback__)[-5:]]});result['issues'].append({'id':'UX86-'+str(len(result['issues'])+1).zfill(2),'stage':name,'message':(str(e).splitlines() or [type(e).__name__])[0]});shot('failure');dump('failure-body.json',page.locator('body').inner_text());
    if name.startswith('manual marks'):return None
    raise
   finally:dump('results.json',result)
  def skip():
   if page.locator('[data-action="guide-dismiss"]').count():page.locator('[data-action="guide-dismiss"]').last.click()
  def close(*args):page.locator('#dialog .modal-head [data-action="close"]').click()
  def save_download(button,name):
   with page.expect_download(timeout=120000) as event:button.press('Enter')
   event.value.save_as(out/name);assert (out/name).stat().st_size>0
  def download(*args):
   if len(args)==2:return save_download(args[0],args[1])
   return save_download(args[1],Path(args[2]).name)
  phone=False;mode='desktop';folder=out;activate=lambda p,loc,phone=False:loc.press('Enter');snap=shot
  def api(path):
   r=ctx.request.get(base+'/w/api'+path,headers=headers,timeout=180000);assert r.ok,(r.status,r.text()[:120]);return r.json()
  def select_real():
   el=page.locator('#reader .passage').first;el.scroll_into_view_if_needed();boxes=el.evaluate('''el=>{const nodes=[],w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);while(w.nextNode())nodes.push(w.currentNode);function at(cp){for(const n of nodes){const a=Array.from(n.textContent);if(cp<=a.length)return[n,a.slice(0,cp).join('').length];cp-=a.length;}throw Error('No text')}function box(a,b){const r=document.createRange();r.setStart(...at(a));r.setEnd(...at(b));return r.getBoundingClientRect().toJSON()}return[box(5,6),box(27,28)]}''');a,z=boxes;page.mouse.move(a['x']+.2,a['y']+a['height']/2);page.mouse.down();page.mouse.move(z['x']+z['width']-.2,z['y']+z['height']/2,steps=14);page.mouse.up();page.wait_for_timeout(150)
   if not page.locator('#code-search').is_visible():
    shot('selection-forward-no-popup');result['issues'].append({'id':'UX86-01','severity':'P2','stage':'reselect coded passage','message':'Forward mouse selection of the existing highlighted range produces no candidate popup; reverse drag used as an explicit workaround','research_data_changed':False});page.mouse.move(z['x']+z['width']-.2,z['y']+z['height']/2);page.mouse.down();page.mouse.move(a['x']+.2,a['y']+a['height']/2,steps=14);page.mouse.up()
   expect(page.locator('#code-search')).to_be_visible();return page.evaluate('({...state.selection})')
  def registration():
   page.goto(base+'/login');page.locator('details:has(form[data-auth="register"])>summary').click();page.locator('#register-invite').fill(c['invite']);page.locator('#register-name').fill(c['username']);page.locator('#register-password').fill(c['password']);page.locator('form[data-auth="register"] button').click();page.locator('[data-action="start-project"]').wait_for();assert page.locator('#reader').count()==0;assert 'English' in page.locator('[data-action="bologna-project"]').inner_text();shot('01-new-account-start');return {'direct_registration_to_start':True,'reader_not_forced':True,'english_example_visible':True}
  check('fresh invited registration enters project start',registration);headers={'X-QualiCraft-Token':ctx.request.get(base+'/w/api/bootstrap').json()['token']}
  def empty_start():
   page.locator('[data-action="start-project"]').click();page.locator('#new-project-name').fill('Bologna 75E empty-start audit');page.locator('[data-action="start-create"]').click();close();skip();assert page.evaluate('()=>state.project.documents.length')==0;page.locator('.empty-project>[data-action="import"]').click()
   with page.expect_file_chooser() as fc:page.locator('#import-file').click()
   fc.value.set_files({'name':'Bologna-English-teaching-upload.txt','mimeType':'text/plain','buffer':seed['documents'][0]['text'].encode()});page.locator('[data-action="save-document"]').click();page.locator('#reader').wait_for();skip();sel=select_real();page.locator('#code-search').fill('Teaching material');page.locator('#code-search').press('Enter');page.wait_for_function('()=>state.project.annotations.length===1');p=page.evaluate('()=>state.project');assert len(p['codes'])==1 and p['documents'][0]['text']==seed['documents'][0]['text'];assert p['annotations'][0]['quote']==p['documents'][0]['text'][sel['start']:sel['end']];result['empty_project_id']=p['id'];shot('02-own-upload-first-coding');page.locator('.qt-home').click();page.locator('[data-action="bologna-project"]').click();page.locator('#reader').wait_for();skip();p=page.evaluate('()=>state.project');assert (len(p['documents']),len(p['codes']),len(p['annotations']))==(3,25,11);assert p['documents']==seed['documents'];assert 'translation teaching excerpts' in p['provenance'];shot('03-english-example');return {'empty_import_and_manual_code':True,'english_example_independent':True,'source_texts_exact':True}
  check('empty upload and English example both remain usable',empty_start);p=page.evaluate('()=>state.project');pid=p['id'];root='/projects/'+pid;result['project_id']=pid
  def get():return api(root)
  def batch():
   before=get();page.locator('.coding-project-menu>summary').click();page.locator('.project-strip [data-action="import"]').click();inputs=[{'name':'Bologna-English-A.txt','mimeType':'text/plain','buffer':p['documents'][0]['text'].encode()},{'name':'Bologna-English-B.txt','mimeType':'text/plain','buffer':p['documents'][1]['text'].encode()}]
   with page.expect_file_chooser() as fc:page.locator('#import-file').click()
   fc.value.set_files(inputs);expect(page.locator('.io-queue-row')).to_have_count(2);assert get()==before;page.locator('[data-action="queue-start"]').click();expect(page.locator('.is-saved')).to_have_count(2,timeout=90000);after=get();assert len(after['documents'])==5;assert after['documents'][:3]==before['documents'];assert after['codes']==before['codes'] and after['annotations']==before['annotations'];shot('04-batch-import');page.locator('#queue-add-files').set_input_files([inputs[0]]);page.locator('[data-action="queue-start"]').click();expect(page.locator('.is-duplicate')).to_have_count(1);stable=get();page.locator('.is-duplicate [data-action="queue-cancel"]').click();assert get()==stable;shot('05-duplicate-cancel');page.locator('.is-saved [data-action="queue-view"]').first.click();return {'documents':5,'two_texts_exact':True,'duplicate_cancel_no_write':True}
  check('batch English import and explicit duplicate cancellation',batch);source=get()['documents'][-2];otherdoc=get()['documents'][-1];page.locator('#reading-document').select_option(source['id']);leaf=next(c for c in p['codes'] if c['name']=='printed books and manuscripts from the Renaissance');second=next(c for c in p['codes'] if c['name']=='critically-reconstructed text');added=[]
  def coding():
   for code in [leaf,second]:
    before=get();sel=select_real();assert [sel['start'],sel['end']]==[5,28];page.locator('#code-search').fill(code['name']);t=time.monotonic();page.locator('#code-search').press('Enter');page.wait_for_function('(n)=>state.project.annotations.length===n+1',arg=len(before['annotations']));result['timings']['save_'+code['id']]=round(time.monotonic()-t,3);a=next(a for a in get()['annotations'] if a['id'] not in {a['id'] for a in before['annotations']});assert a['document_id']==source['id'] and a['code_id']==code['id'];assert a['quote']==source['text'][5:28];added.append(a)
   assert len(get()['annotations'])==13;shot('06-exact-overlap-coding');return {'annotations':13,'new_exact_links':added,'real_mouse_selection':True}
  check('manual exact leaf Enter and overlapping code identities',coding)
  def overview(index):
   if page.locator('[data-action="reading-overview"]').get_attribute('aria-expanded')!='true':page.locator('[data-action="reading-overview"]').click()
   if page.locator('#overview-paragraph-list').get_attribute('open') is None:page.locator('#overview-paragraph-list summary').click()
   page.locator('#overview-paragraph-number').fill(str(index+1));page.locator('[data-action="overview-find-paragraph"]').click()
  def memory():return page.evaluate('()=>readReadingPosition(state.project,doc())')
  def reading():
   observations=[]
   def observe(step):observations.append({'step':step,'memory':memory(),'mounted':page.evaluate('()=>readingMounted.start')})
   overview(0);page.locator('[data-action="overview-jump-paragraph"]').click();page.locator('.reading-mark-menu>summary').click();page.locator('[data-action="reading-mark-read"]').click();expect(page.locator('#reading-mark-status')).to_have_value('read');page.locator('#reading-mark-status').select_option('revisit');page.locator('[data-action="reading-mark-undo"]').click();expect(page.locator('#reading-mark-status')).to_have_value('read');page.locator('.reading-mark-menu>summary').click()
   overview(1);page.locator('[data-action="overview-jump-paragraph"]').click();page.locator('.reading-mark-menu>summary').click();page.locator('#reading-mark-status').select_option('revisit');page.locator('.reading-mark-menu>summary').click();overview(1);page.locator('[data-action="overview-keep"]').click();anchor=memory()['start'];expected=page.evaluate('()=>segments(doc().text)[1].start');assert anchor==expected,('Keep target',anchor,expected);data=page.evaluate('()=>readingOverviewData(state.project,doc())');assert data['codingCount']==2 and len(data['ranges'])==1;shot('07-reading-dual-track');observe('Keep paragraph2')
   page.locator('[data-action="reading-resume"]').click();observe('Resume');page.locator('#search').focus();observe('search focus');page.locator('#search').fill('75E_NO_MATCH');expect(page.locator('.paragraph')).to_have_count(0);observe('search filter');page.locator('[data-action="clear-filter"]').first.click();page.locator('[data-action="reading-resume"]').click();observe('clear and Resume');shot('08-resume-short-source')
   page.locator('#reading-document').select_option(otherdoc['id']);page.locator('#reading-document').select_option(source['id']);observe('document return');page.locator('.qt-home').press('Enter');page.reload();page.locator('#start-project-select').select_option(pid);page.locator('[data-action="start-open"]').click();page.locator('#reader').wait_for();assert page.locator('#reading-document').input_value()==source['id'];observe('start and refresh return')
   marks=[m['status'] for m in next(d for d in get()['documents'] if d['id']==source['id'])['reading_state']['marks']];assert marks==['read','revisit'],marks;dump('reading-observations.json',{'expected_start':anchor,'observations':observations,'marks':marks,'coding_links':2,'source_paragraphs':3});shot('08-resume-after-refresh');assert all(o['memory']['start']==anchor for o in observations),('short-source return position',anchor,observations)
   return {'marks':marks,'undo':True,'exact_ranges':1,'coding_links':2,'resume_start':anchor,'search_switch_refresh':True}
  check('manual marks overview Keep Resume search and start/reload recovery',reading)
  def tree():
   before=get();anchor=memory();parent=page.evaluate('(id)=>themeOf(state.project.codes.find(c=>c.id===id)).id',leaf['id']);page.locator('[data-action="inspect-code"][data-id="'+parent+'"]').click();assert page.evaluate('()=>state.codeFilter') is None;assert '0 direct' in page.locator('.code-count-summary').inner_text();page.locator('[data-action="inspect-filter"]').click();assert page.evaluate('()=>state.codeFilter')==parent;assert len(page.locator('#reader mark').all())>0;shot('09-parent-filter');page.locator('[data-action="inspect-return"]').click();page.locator('[data-action="reading-resume"]').click();assert memory()==anchor;assert get()==before;return {'tree_once':page.locator('.codebook-tree').count()==1,'click_not_filter':True,'explicit_filter_and_return':True,'project_equal':True}
  check('single tree descendant scope counts and return preserve research state',tree)
  def network():
   before=get();page.locator('[data-action="view"][data-view="insights"]').click();expect(page.locator('#network-select')).to_be_enabled();g=api(root+'/network');ids={n['id'] for n in g['nodes']};assert all(e['source'] in ids and e['target'] in ids for e in g['links']);page.locator('#network-select').select_option('code:'+leaf['id']);page.locator('[data-action="net-evidence"][data-id="'+added[0]['id']+'"]').click();shot('10-network-evidence');page.locator('[data-action="net-locate"]').click();expect(page.locator('.source-target').first).to_be_focused();page.locator('[data-action="net-return"]').click();expect(page.locator('#network-select')).to_have_value('code:'+leaf['id']);assert get()==before;return {'nodes':len(ids),'links':len(g['links']),'no_dangling_links':True,'source_roundtrip':True}
  check('relationship graph evidence and source roundtrip',network)
  def open_report():page.locator('.top-actions [data-action="export"]').click();page.locator('[data-action="write-report"]').click();expect(page.locator('#report-save-state')).to_be_visible()
  def rtab(id):page.locator('[data-report-tab="'+id+'"]').click()
  def rsave():
   rev=get().get('research_report',{}).get('revision',0);page.locator('[data-report-action="save"]').press('Enter');expect(page.locator('#report-save-state')).to_have_text('Saved locally · version '+str(rev+1),timeout=120000)
  settings={};plot_files={}
  def figures():
   page.locator('[data-action="view"][data-view="plotting"]').click();assert page.locator('[data-plot="kind"]').count()==5
   if page.locator('[data-action="enable-figures"]').count():page.locator('[data-action="enable-figures"]').click();expect(page.locator('[data-action="enable-figures"]')).to_have_count(0)
   page.locator('[data-plot="kind"][value="cooccurrence"]').check();page.locator('.plot-options>summary').click();page.locator('[data-plot="cluster"]').select_option('0');page.locator('[data-plot="fontsize"]').select_option('10');page.locator('.plot-options>summary').click()
   for kind in KINDS:
    page.locator('[data-plot="kind"][value="'+kind+'"]').check();page.locator('[data-action="plot-generate"]').click();page.wait_for_function('()=>{const i=document.querySelector("#plot-preview");return i&&i.complete&&i.naturalWidth>0}',timeout=120000);settings[kind]=page.evaluate('()=>({...state.plotOptions})');page.locator('[data-action="plot-view"]').click();expect(page.locator('.plot-viewer-viewport')).to_be_focused();page.wait_for_function('()=>document.querySelector("#plot-viewer img").naturalWidth>0');geometry=page.locator('#plot-viewer img').evaluate('e=>{const b=e.getBoundingClientRect();return[b.width,b.height,e.naturalWidth,e.naturalHeight]}');assert abs(geometry[0]/geometry[1]-geometry[2]/geometry[3])<.002;shot('11-'+kind+'-original-size');page.get_by_role('button',name='Close figure',exact=True).click();download(page.locator('[data-action="plot-export"]'),kind+'.zip')
    with zipfile.ZipFile(out/(kind+'.zip')) as z:
     assert len(z.namelist())==5;plot_files[kind]={n:hashlib.sha256(z.read(n)).hexdigest() for n in z.namelist()};current=get();assert z.read('figure_data.csv')==plotting._dataset(analyze.tidy(current),plotting.normalise(settings[kind]),{d['name']:d['text'] for d in current['documents']}).encode()
   dump('plot-records.json',{'settings':settings,'members':plot_files});return {'five_types':True,'all_25_members':True,'native_proportions':True,'manual_generate_and_download':True}
  check('all five figure choices generate preview viewer CSV and code bundles',figures)
  def counts():
   rows=analyze.tidy(get());old=analyze.tidy(p);labels=analyze.code_labels(get()['codes']);freq={r['label']:r['count'] for r in analyze.frequency(rows)};original={r['label']:r['count'] for r in analyze.frequency(old)}
   for code in [leaf,second]:assert freq[labels[code['id']]]==original[labels[code['id']]]+1
   a,b=labels[leaf['id']],labels[second['id']];co=analyze.cooccurrence(rows);prev=analyze.cooccurrence(old);assert co['matrix'][co['labels'].index(a)][co['labels'].index(b)]==prev['matrix'][prev['labels'].index(a)][prev['labels'].index(b)]+1;assert analyze.accumulation(rows)['cumulative'][-1]==len({a['code_id'] for a in get()['annotations']});return {'manual_frequency_each_plus_one':True,'manual_overlap_pair_plus_one':True,'distinct_codes':len({a['code_id'] for a in get()['annotations']})}
  check('manual expected counts and original counting definitions agree',counts)
  def bind_figures():
   open_report()
   for key,val in {'title':'Bologna English evidence audit','research_question':'Can the English teaching record be followed from import to recoverable output?','case_unit':'Three translated source excerpts plus two technical imported copies, not five independent participants.','analysis_unit':'Saved passage-code assignments with exact English character ranges.','method_notes':'Technical acceptance only. These teaching associations do not establish a new substantive study.'}.items():page.locator('[data-report-field="'+key+'"]').fill(val)
   rtab('figures')
   for kind in KINDS:
    page.locator('#report-figure-kind').select_option(kind);page.locator('[data-report-action="add-figure"]').click();page.locator('[data-report-caption]').last.fill('English Bologna teaching subset. Descriptive saved coding, not an empirical finding.')
   rsave();saved=get()['research_report'];assert len(saved['assets'])==5
   for fig in saved['current']['draft']['figures']:
    asset=saved['assets'][saved['current']['bindings']['figures'][fig['id']]['asset_id']];assert {n:hashlib.sha256(v).hexdigest() for n,v in reporting.report_figures.files(asset).items()}==plot_files[fig['options']['kind']]
   result['storage_labels']={'hosted':page.evaluate('()=>!!window.QT_HOSTED'),'header':page.locator('.save-state').inner_text(),'report':page.locator('#report-save-state').inner_text()};
   if result['storage_labels']['hosted'] and 'Saved locally' in result['storage_labels']['report']:result['issues'].append({'id':'UX86-04','severity':'P2','stage':'hosted storage wording','message':'Hosted report editor says Saved locally while workspace header says Saved on server; import receipt and QCA wording also require alignment','data_loss':False})
   shot('12-five-frozen-report-figures');close();return {'five_saved_assets':True,'all_25_workbench_export_members_equal':True}
  check('research report freezes the five selected figure outputs',bind_figures)
  def qca():
      page.locator('[data-action="view"][data-view="insights"]').click();activate(page,page.locator('[data-action="open-qca"]'),phone)
      page.locator('[data-qca-design="question"]').fill('Known-answer technical verification on two public source records.');page.locator('[data-qca-design="case_unit"]').fill('One explicitly mapped public source record is one technical case, not an empirical participant claim.')
      activate(page,page.locator('[data-qca-action="add-set"]'),phone)
      for id in ['A','B','Y']:
          for key,val in {'label':'Technical '+id,'definition':'Explicit binary acceptance designation','zero_rule':'Designated outside the set','one_rule':'Designated inside the set','basis':'Known-answer technical fixture; not derived automatically from coding counts'}.items():page.locator('[data-qca-set="'+id+'"][data-key="'+key+'"]').fill(val)
      page.locator('[data-qca-tab="cases"]').click()
      for i,d in enumerate([source,otherdoc]):activate(page,page.locator('[data-qca-action="add-case"]'),phone);page.locator('#qca-case-label').fill('Bologna technical '+str(i+1));page.locator('#qca-case-docs').select_option([d['id']])
      page.locator('[data-qca-tab="calibration"]').click();ids=page.locator('#qca-case-select option').evaluate_all('(es)=>es.map(e=>e.value)')
      for i,id in enumerate(ids):
          page.locator('#qca-case-select').select_option(id)
          for name,val in zip(['A','B','Y'],[(1,0,1),(0,1,0)][i]):page.locator('[data-qca-value="'+name+'"]').select_option(str(val));page.locator('[data-qca-rationale="'+name+'"]').fill('Explicit known-answer designation '+str(val)+' for a technical audit only.')
          if i==0:activate(page,page.locator('[data-qca-action="evidence"][data-set="A"]'),phone);page.locator('[data-qca-evidence="'+added[0]['id']+'"]').check()
      activate(page,page.locator('[data-qca-action="save"]'),phone);expect(page.locator('#qca-save-state')).to_have_text('Saved locally · revision 1');activate(page,page.locator('[data-qca-action="run"]'),phone);expect(page.locator('#qca-save-state')).to_have_text('Saved locally · revision 2');run=get()['comparative_qca']['current'];assert run['result']['solutions'][0]['expression']=='A*~B';assert len(run['result']['truth_table'])==4
      snap('11-frozen-qca-result');page.locator('[data-qca-tab="versions"]').click();download(page,page.locator('[data-qca-action="download"][data-format="zip"]'),folder/'qca-code.zip',phone);close(page);return {'calibrated_cases':2,'conditions':2,'truth_table_rows':4,'expected_solution':'A*~B','run_id':run['id'],'explicit_calibration_evidence':added[0]['id']}
  check(mode+' explicit QCA calibration frozen known-answer result and code export',qca,page)
  saved_reports={}
  def reports():
      open_report();rtab('table');page.locator('#report-add-code').select_option(leaf['id']);page.locator('#report-start-labels').check();activate(page,page.locator('[data-report-action="add"]'),phone);page.locator('[data-report-cell="code_ids"]').select_option([leaf['id'],second['id']]);page.locator('[data-report-cell="interpretation"]').fill('Two explicit code links share one saved range. This audit verifies provenance, not substantive meaning.');activate(page,page.locator('[data-report-action="row-evidence"]'),phone)
      for a in added:page.locator('[data-report-evidence="'+a['id']+'"]').check()
      rtab('narrative');page.locator('[data-report-field="narrative"]').fill('Two code links refer to the same precisely saved quotation. Counts remain descriptive. This is a technical acceptance record. '+''.join('[E:'+a['id']+'] ' for a in added));page.locator('[data-report-field="limitations"]').fill('Only public Bologna technical inputs were used. Selected method maps do not certify completed research or agreement with a human analysis.')
      rsave();first=get()['research_report']['current'];assets=copy.deepcopy(get()['research_report']['assets'])
      for method in ['content','ta','comparative']:
          rtab('setup');page.locator('#report-method').select_option(method);rsave();entry=get()['research_report']['current'];saved_reports[method]=entry
          assert entry['method_map']['method']==method and entry['draft']['narrative']==first['draft']['narrative'];assert get()['research_report']['assets']==assets
          rtab('preview');frame=page.frame_locator('#report-preview');expect(frame.locator('.method-map li')).to_have_count(6);expect(frame.locator('.method-decisions')).to_contain_text(entry['method_map']['name']);assert frame.locator('figure img').count()==5;frame.locator('.method-map').scroll_into_view_if_needed();snap('12-'+method+'-saved-method-map')
          for fmt in ['html','docx','json','zip']:download(page,page.locator('[data-report-action="download"][data-format="'+fmt+'"]'),folder/(method+'-report.'+fmt),phone)
          record=json.loads((folder/(method+'-report.json')).read_text());assert record['report']==entry and record['figure_assets']==assets
          with zipfile.ZipFile(folder/(method+'-report.zip')) as z:
              assert json.loads(z.read('report.json'))==record
              for f in entry['draft']['figures']:
                  for n,h in plot_files[f['options']['kind']].items():assert sha(z.read('figures/'+f['id']+'/'+n))==h
              if method=='comparative':assert json.loads(z.read('qca/qca-run.json'))==get()['comparative_qca']['current']
          with zipfile.ZipFile(folder/(method+'-report.docx')) as z:assert json.loads(ET.fromstring(z.read('customXml/item1.xml')).text)==entry
      # Restore a different saved method, then return to the frozen Comparative version.
      rtab('versions');restore_rev=get()['research_report']['revision'];page.locator('#report-history').select_option(saved_reports['content']['id']);activate(page,page.locator('[data-report-action="restore"]'),phone);expect(page.locator('#report-save-state')).to_have_text('Saved locally · version '+str(restore_rev+1));assert get()['research_report']['current']['method_map']==saved_reports['content']['method_map']
      restore_rev=get()['research_report']['revision'];page.locator('#report-history').select_option(saved_reports['comparative']['id']);activate(page,page.locator('[data-report-action="restore"]'),phone);expect(page.locator('#report-save-state')).to_have_text('Saved locally · version '+str(restore_rev+1));assert get()['research_report']['current']['bindings']==saved_reports['comparative']['bindings'];close(page)
      return {'methods':3,'formats_each':4,'maps_frozen_and_six_readable_steps':True,'all_25_original_figure_members_equal':True,'Word_native_metadata_exact':True,'restore_and_frozen_QCA_equal':True}
  check(mode+' saved research reports method maps Word ZIP and version restoration',reports,page)
  def notebook():
   page.locator('[data-action="view"][data-view="coding"]').click();page.locator('#reading-document').select_option(source['id']);page.locator('#search').fill('75E_EXPORT_NO_MATCH');expect(page.locator('.paragraph')).to_have_count(0);before=get();page.locator('.top-actions [data-action="export"]').click()
   for fmt in ['html','docx']:download(page.locator('[data-action="download-coded"][data-format="coded-'+fmt+'"]'),'notebook.'+fmt)
   with zipfile.ZipFile(out/'notebook.docx') as z:
    frozen=json.loads(ET.fromstring(z.read('customXml/item1.xml')).text);assert frozen['documents'][0]['text']==source['text'];assert frozen['association_count']==2;assert b'<w:drawing' not in z.read('word/document.xml')
   offline=ctx.new_page();offline.goto((out/'notebook.html').resolve().as_uri());assert offline.locator('.source-text').evaluate_all('(es)=>es.map(e=>e.textContent).join("")')==source['text'];mark=offline.locator('mark').first;mark.hover();assert 'active' in mark.get_attribute('class');mark.focus();mark.press('Enter');assert offline.evaluate('()=>document.activeElement.dataset.locate') in {a['key'] for a in frozen['documents'][0]['annotations']};offline.keyboard.press('Enter');assert offline.evaluate('()=>document.activeElement.tagName')=='MARK';offline.screenshot(path=str(out/'13-notebook-linked-tree.png'));offline.close();assert get()==before
   for fmt in ['csv','matrix','methods','json']:download(page.locator('[data-action="download"][data-format="'+fmt+'"]'),'project-'+fmt+('.json' if fmt=='json' else '.txt'))
   shot('14-export-complete');close();page.locator('#search').fill('');return {'full_source_characters':len(source['text']),'exact_associations':2,'native_editable_word':True,'offline_mouse_keyboard_roundtrip':True,'filter_not_export_scope':True,'all_original_downloads':True}
  check('full Notebook editable Word and project exports despite filtered reader',notebook)
  def recovery():
   exported=json.loads((out/'project-json.json').read_text(encoding='utf-8'));assert exported==get();page.locator('[data-action="projects"]').first.click()
   with page.expect_file_chooser() as event:page.locator('[data-action="restore-pick"]').click()
   with page.expect_response(lambda r:r.url.endswith('/w/api/projects/restore') and r.request.method=='POST') as response:event.value.set_files(out/'project-json.json')
   assert response.value.ok,(response.value.status,response.value.text()[:120]);page.wait_for_function('(id)=>state.project?.id&&state.project.id!==id',arg=pid);rid=page.evaluate('()=>state.project.id');restored=api('/projects/'+rid)
   for k in ['documents','codes','annotations','blocks','comparative_qca','research_report']:assert restored[k]==exported[k],k
   assert api(root)==exported;result['restored_id']=rid;page.locator('#reading-document').select_option(source['id']);overview(1);assert page.evaluate('()=>readingOverviewData(state.project,doc()).codingCount')==2;shot('15-restored-reading-and-source');page.locator('[data-action="reading-overview"]').click();open_report();rtab('preview');expect(page.frame_locator('#report-preview').locator('.method-map li')).to_have_count(6);shot('16-restored-method-report');close();dump('final-project.json',exported);dump('restored-project.json',restored);return {'normal_file_restore':True,'all_frozen_versions_and_assets_equal':True,'reading_marks_and_sources_equal':True,'original_project_unchanged':True}
  check('normal JSON file recovery preserves source coding reading frozen QCA and report',recovery)
  def narrow():
   before=api('/projects/'+result['restored_id']);page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(300);page.locator('[data-action="coding-codebook"]').click();expect(page.locator('.codebook-tree')).to_have_count(1);page.locator('.code-count-help>summary').click();shot('17-narrow-tree-count-help');page.locator('[data-action="inspect-close"]').click();page.locator('.qt-home').click();page.locator('#start-project-select').wait_for();shot('18-narrow-project-start');assert page.evaluate('()=>document.documentElement.scrollWidth<=innerWidth');page.locator('#start-project-select').select_option(result['restored_id']);page.locator('[data-action="start-open"]').click();page.locator('#reader').wait_for();assert api('/projects/'+result['restored_id'])==before;return {'390px_no_overflow':True,'one_tree':True,'home_and_reopen':True,'no_writes':True,'physical_touch_not_claimed':True}
  check('narrow first-visit controls and single tree remain reachable',narrow)
  if any('Pattern attribute value' in line for line in result['console']):result['issues'].append({'id':'UX86-03','severity':'P2','stage':'first registration','message':'Chrome rejects the HTML username pattern under the v flag; valid registration succeeds but client pattern validation and zero-console gate fail. Server validation remains separate.'})
  result['complete']=True;result['acceptance_pass']=all(x['pass'] for x in result['checks']) and not result['issues'] and not result['console'] and not result['page_errors'] and not result['http'];dump('results.json',result);browser.close();print(json.dumps({'checks':len(result['checks']),'passed':sum(x['pass'] for x in result['checks']),'issues':len(result['issues']),'console_errors':len(result['console']),'completed':True,'acceptance_pass':result['acceptance_pass']}),flush=True);raise SystemExit(0 if result['acceptance_pass'] else 1)

if __name__=='__main__':main()
