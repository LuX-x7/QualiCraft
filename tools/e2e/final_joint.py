"""UX60 final cross-module audit, not a feature patch. Disposable Bologna only."""
import argparse,copy,csv,hashlib,io,json,os,re,shutil,subprocess,sys,time,traceback,zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from tools.e2e.recovery_boundaries import Service,dump,backup_manifest,sha
from qualicraft import core,analyze,plotting,reporting,qca_state,transcript
from qualicraft.server import bologna_example
from playwright.sync_api import sync_playwright,expect
NODE='/Users/chehaijun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
KINDS=['frequency','coverage','cooccurrence','hierarchy','accumulation']
ROOT=Path(__file__).resolve().parents[2]

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--out',type=Path,required=True);ap.add_argument('--site-build',type=Path,required=True);ap.add_argument('--port',type=int,default=52762);ap.add_argument('--continue-from',type=Path);args=ap.parse_args();out=args.out;out.mkdir(parents=True,exist_ok=True)
    prior=json.loads((args.continue_from/'results.json').read_text()) if args.continue_from else None
    if prior:
        shutil.copytree(args.continue_from/'service',out/'service');store=core.Store(out/'service/qualicraft.sqlite3');seed=store.get(next(p['id'] for p in store.list() if p['name']=='Bologna · final joint audit baseline'));s=Service(out/'service')
    else:
        seed=bologna_example();seed['id']=core.uid();seed['name']='Bologna · final joint audit baseline';s=Service(out/'service',seed)
    site='http://127.0.0.1:'+str(args.port);log=(out/'site.txt').open('w');proc=subprocess.Popen([NODE,'start.js'],cwd=args.site_build,env={**os.environ,'PORT':str(args.port),'HOST':'127.0.0.1','QT_WORKBENCH_URL':s.base},stdout=log,stderr=log,start_new_session=True)
    result={'checks':[],'console':[],'http':[],'outside':[],'issues':[],'projects':{},'expected_http':[],'runtime':'Chrome desktop and touch emulation; no physical-device or VoiceOver claim'}
    def check(name,fn,page=None):
        if prior:
            previous=next((c for c in prior['checks'] if c['name']==name and c['pass']),None)
            if previous:
                detail=copy.deepcopy(previous);detail['carried_evidence']=str(args.continue_from);result['checks'].append(detail);dump(out/'results.json',result);print('RETAINED PASS '+name,flush=True);return previous['detail']
        print('START '+name,flush=True)
        try:
            detail=fn();passed=detail.get('gate_pass',True) if isinstance(detail,dict) else True;result['checks'].append({'name':name,'pass':passed,'detail':detail});print(('PASS ' if passed else 'OBSERVED FAILURE ')+name,flush=True);return detail
        except Exception as e:
            result['checks'].append({'name':name,'pass':False,'error':str(e),'traceback':traceback.format_exc()})
            if page:
                try:page.screenshot(path=str(out/'failure.png'));dump(out/'failure-state.json',{'url':page.url,'body':page.locator('body').inner_text()})
                except Exception:pass
            raise
        finally:dump(out/'results.json',result)
    def png(page,name):page.screenshot(path=str(out/(name+'.png')))
    def activate(page,locator,phone=False):locator.tap() if phone else locator.press('Enter')
    def close(page):page.locator('[data-action="close"]').first.click()
    def download(page,locator,path,phone=False):
        with page.expect_download(timeout=120000) as event:activate(page,locator,phone)
        event.value.save_as(path);assert path.stat().st_size>0;return event.value.suggested_filename
    try:
        for _ in range(150):
            try:
                with __import__('urllib.request',fromlist=['urlopen']).urlopen(site+'/w/api/bootstrap',timeout=2) as r:assert json.load(r)['token']==s.token
                break
            except Exception:time.sleep(.2)
        else:raise TimeoutError('local site not ready')
        with sync_playwright() as pw:
            browser=pw.chromium.launch(channel='chrome',headless=True)
            for phone in [False,True]:
                mode='phone' if phone else 'desktop';folder=out/mode
                if prior and mode in prior['projects']:
                    shutil.copytree(args.continue_from/mode,folder);pid=prior['projects'][mode];p=s.json('/projects/'+pid)
                else:
                    folder.mkdir();p=s.json('/projects',{'kind':'restore','project':{**seed,'name':'Bologna · final '+mode+' workflow'}});pid=p['id']
                root='/projects/'+pid;result['projects'][mode]=pid
                ctx=browser.new_context(viewport={'width':390 if phone else 1440,'height':844 if phone else 1000},has_touch=phone,is_mobile=phone,accept_downloads=True,reduced_motion='reduce' if phone else 'no-preference')
                ctx.route('**/*',lambda route:route.continue_() if route.request.url.startswith(site+'/') or route.request.url.startswith(out.resolve().as_uri()+'/') or route.request.url.startswith('blob:') else (result['outside'].append(route.request.url),route.abort()))
                page=ctx.new_page();page.set_default_timeout(15000);page.on('pageerror',lambda e:result['console'].append(str(e)));page.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None);page.on('response',lambda r:result['http'].append([r.status,r.url]) if r.status>=400 else None)
                def get():return s.json(root)
                def snap(name):png(page,mode+'/'+name)
                def go_coding():page.locator('[data-action="view"][data-view="coding"]').click()
                def open_project():
                    page.goto(site+'/w/?lang=en',wait_until='networkidle')
                    if page.locator('#start-project-select').count():page.locator('#start-project-select').select_option(pid);activate(page,page.locator('[data-action="start-open"]'),phone)
                    expect(page.locator('#reading-document')).to_be_visible()
                open_project()
                def batch():
                    page.locator('[data-action="import"]:visible').first.click();inputs=[{'name':'Bologna-joint-A.txt','mimeType':'text/plain','buffer':p['documents'][0]['text'].encode()},{'name':'Bologna-joint-B.txt','mimeType':'text/plain','buffer':p['documents'][1]['text'].encode()}]
                    with page.expect_file_chooser() as event:activate(page,page.locator('#import-file'),phone)
                    event.value.set_files(inputs);expect(page.locator('.io-queue-row')).to_have_count(2);assert get()==p
                    activate(page,page.locator('[data-action="queue-start"]'),phone);expect(page.locator('.is-saved')).to_have_count(2,timeout=30000);after=get();assert len(after['documents'])==21
                    assert after['documents'][:19]==p['documents'];assert after['codes']==p['codes'] and after['annotations']==p['annotations']
                    for d,source in zip(after['documents'][-2:],p['documents'][:2]):assert d['text']==source['text']
                    snap('01-batch-import-results');before=get();page.locator('#queue-add-files').set_input_files([inputs[0]]);activate(page,page.locator('[data-action="queue-start"]'),phone);expect(page.locator('.is-duplicate')).to_have_count(1);assert get()==before
                    activate(page,page.locator('.is-duplicate [data-action="queue-cancel"]'),phone);expect(page.locator('.is-cancelled')).to_have_count(1);assert get()==before;snap('02-duplicate-cancel');page.locator('.is-saved').first.locator('[data-action="queue-view"]').click();expect(page.locator('#dialog')).not_to_be_visible();return {'documents':21,'original_sources_equal':True,'two_extracted_texts_exact':True,'duplicate_cancel_nonmutating':True}
                check(mode+' batch import and explicit duplicate cancellation',batch,page)
                source=get()['documents'][-2];otherdoc=get()['documents'][-1];page.locator('#reading-document').select_option(source['id'])
                leaf=next(c for c in p['codes'] if c['name']=='printed books and manuscripts from the Renaissance');by={c['id']:c for c in p['codes']};category=by[leaf['parent_id']];theme=by[category['parent_id']];second=next(c for c in p['codes'] if c['name']=='journal articles')
                added=[a for a in get()['annotations'] if a['document_id']==source['id']] if prior and mode in prior['projects'] else []
                def select_real():
                    seg=page.evaluate('segments(doc().text).find(s=>s.text.length>=80&&s.text.length<=600)');page.evaluate('(n)=>scrollReadingParagraph(n)',seg['start']);page.wait_for_timeout(150);target=page.locator('.passage[data-start="'+str(seg['start'])+'"]');target.scroll_into_view_if_needed()
                    boxes=target.evaluate('''el=>{const nodes=[],w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);while(w.nextNode())nodes.push(w.currentNode);function at(cp){for(const n of nodes){const a=Array.from(n.textContent);if(cp<=a.length)return [n,a.slice(0,cp).join('').length];cp-=a.length;}throw Error('No text')}function box(a,b){const r=document.createRange();r.setStart(...at(a));r.setEnd(...at(b));return r.getBoundingClientRect().toJSON()}return [box(5,6),box(27,28)]}''')
                    a,z=boxes;page.mouse.move(a['x']+.2,a['y']+a['height']/2);page.mouse.down();page.mouse.move(z['x']+z['width']-.2,z['y']+z['height']/2,steps=14);page.mouse.up();expect(page.locator('#code-search')).to_be_visible();return page.evaluate('({...state.selection})')
                def coding():
                    for code in [leaf,second]:
                        before=get();sel=select_real();page.locator('#code-search').fill(code['name']);activate(page,page.locator('#code-search'),phone=False);expect(page.locator('#code-popup')).not_to_be_visible();after=get();new=[a for a in after['annotations'] if a['id'] not in {x['id'] for x in before['annotations']}];assert len(new)==1
                        a=new[0];assert a['code_id']==code['id'] and a['document_id']==source['id'];assert a['quote']==source['text'][sel['start']:sel['end']];assert [a['start'],a['end']]==[sel['start'],sel['end']];added.append(a)
                    assert added[0]['start']==added[1]['start'] and added[0]['end']==added[1]['end'];assert len(get()['annotations'])==876
                    if phone:page.locator('[data-action="coding-codebook"]').tap();scope='#mobile-codebook-list'
                    else:page.locator('[data-action="toggle-codebook"]').click();scope='#side-list'
                    for node,role in [(theme,'theme'),(category,'category'),(leaf,'code')]:
                        page.locator(scope+' [data-action="code-edit"][data-id="'+node['id']+'"]').click();page.locator('#ec-role').select_option(role);activate(page,page.locator('[data-action="code-save"]'),phone);expect(page.locator('#ec-role')).to_have_count(0)
                        if phone:page.locator('[data-action="coding-codebook"]').tap()
                    if phone:close(page)
                    snap('03-coding-highlight-tree');return {'codings':876,'exact_saved_annotations':added,'roles_explicit_on_temporary_copy':True,'source_selection':'real mouse in both viewports; phone code controls use touch, OS text handles untested'}
                check(mode+' coding exact leaf Enter overlapping evidence and explicit tree roles',coding,page)
                def overview(index):
                    if page.locator('[data-action="reading-overview"]').get_attribute('aria-expanded')!='true':activate(page,page.locator('[data-action="reading-overview"]'),phone)
                    if page.locator('#overview-paragraph-list').get_attribute('open') is None:activate(page,page.locator('#overview-paragraph-list summary'),phone)
                    page.locator('#overview-paragraph-number').fill(str(index+1));activate(page,page.locator('[data-action="overview-find-paragraph"]'),phone)
                def memory():return page.evaluate('readReadingPosition(state.project,doc())')
                def reading():
                    overview(4);activate(page,page.locator('[data-action="overview-jump-paragraph"]'),phone);activate(page,page.locator('[data-action="reading-mark-read"]'),phone);expect(page.locator('#reading-mark-status')).to_have_value('read')
                    page.locator('#reading-mark-status').select_option('revisit');expect(page.locator('#reading-mark-status')).to_have_value('revisit');activate(page,page.locator('[data-action="reading-mark-undo"]'),phone);expect(page.locator('#reading-mark-status')).to_have_value('read')
                    overview(5);activate(page,page.locator('[data-action="overview-jump-paragraph"]'),phone);page.locator('#reading-mark-status').select_option('revisit');expect(page.locator('#reading-mark-status')).to_have_value('revisit')
                    overview(16);activate(page,page.locator('[data-action="overview-jump-paragraph"]'),phone);overview(16);activate(page,page.locator('[data-action="overview-keep"]'),phone);anchor=memory()['start'];assert anchor==page.evaluate('segments(doc().text)[16].start')
                    overview(16);assert page.locator('#reading-overview-map .read,#reading-overview-map .revisit').count()==2
                    data=page.evaluate('readingOverviewData(state.project,doc())');assert data['codingCount']==2 and len(data['ranges'])==1
                    snap('04-reading-dual-tracks');activate(page,page.locator('[data-action="reading-resume"]'),phone);expect(page.locator('#reading-overview')).to_be_hidden();assert memory()['start']==anchor
                    if phone:page.locator('#search').tap()
                    else:page.locator('#search').focus()
                    assert memory()['start']==anchor;page.locator('#search').fill('UX60_NO_MATCH');expect(page.locator('.paragraph')).to_have_count(0);assert memory()['start']==anchor
                    activate(page,page.locator('[data-action="clear-filter"]').first,phone);activate(page,page.locator('[data-action="reading-resume"]'),phone);assert page.evaluate('readingMounted.start')==anchor;assert memory()['start']==anchor
                    page.locator('#reading-document').select_option(otherdoc['id']);page.locator('#reading-document').select_option(source['id']);page.reload(wait_until='networkidle');expect(page.locator('#reading-document')).to_have_value(source['id']);assert memory()['start']==anchor
                    current=next(d for d in get()['documents'] if d['id']==source['id']);assert [m['status'] for m in current['reading_state']['marks']]==['read','revisit'];snap('05-resume-after-filter-refresh')
                    return {'manual_marks':['read','revisit'],'undo':True,'paragraphs':len(data['paragraphs']),'distinct_ranges':1,'codings':2,'Keep_Resume_start':anchor,'search_focus_filter_clear_document_switch_and_refresh_preserved':True}
                check(mode+' reading marks dual tracks Keep Resume search and document persistence',reading,page)
                def filtering():
                    before=get();anchor=memory();positions=[{'step':'before codebook','memory':anchor}]
                    if phone:page.locator('[data-action="coding-codebook"]').tap();scope='#mobile-codebook-list'
                    else:
                        if not page.locator('#side-list [data-code-node]').count():page.locator('[data-action="toggle-codebook"]').click()
                        scope='#side-list'
                    positions.append({'step':'codebook open','memory':memory()});button=page.locator(scope+' [data-action="filter-code"][data-id="'+theme['id']+'"]');desc=set(page.evaluate('(id)=>[...codeDescendants(id)]',theme['id']));expected=sum(a['code_id'] in desc for a in before['annotations']);assert int(button.locator('.count').inner_text())==expected
                    activate(page,button,phone);assert page.evaluate('state.codeFilter')==theme['id'];positions.append({'step':'theme filter','memory':memory()});ids=page.locator('.pill').evaluate_all('(els)=>els.map(e=>e.dataset.id)');assert set(ids)=={a['id'] for a in added};snap('06-theme-descendant-filter');activate(page,page.locator('[data-action="clear-filter"]').first,phone);positions.append({'step':'clear filter','memory':memory()});activate(page,page.locator('[data-action="reading-resume"]'),phone);positions.append({'step':'Resume','memory':memory(),'mounted_start':page.evaluate('readingMounted.start')});preserved=memory()==anchor;assert get()==before
                    dump(folder/'theme-filter-memory.json',{'positions':positions,'project_equal':True,'resume_preserved':preserved})
                    if not preserved:result['issues'].append({'id':'UX60-02','severity':'P2','viewport':mode,'message':'Theme filter interaction loses the previously kept reading position','positions':positions,'project_unchanged':True});snap('06-theme-filter-lost-Resume')
                    return {'gate_pass':preserved,'theme_id':theme['id'],'sidebar_global_count':expected,'current_source_codings':2,'filter_contains_descendants':True,'project_unchanged':True,'Resume_unchanged':preserved,'positions':positions}
                check(mode+' theme filter agrees with descendant counts without changing reading memory',filtering,page)
                def network():
                    before=get();page.locator('[data-action="view"][data-view="insights"]').click();expect(page.locator('#network-select')).to_be_enabled();graph=s.json(root+'/network');nodeids={n['id'] for n in graph['nodes']};assert all(e['source'] in nodeids and e['target'] in nodeids for e in graph['links'])
                    page.locator('#network-select').select_option('code:'+leaf['id']);target=page.locator('[data-action="net-evidence"][data-id="'+added[0]['id']+'"]');target.click();snap('07-network-evidence');activate(page,page.locator('[data-action="net-locate"]'),phone);expect(page.locator('#reading-document')).to_have_value(source['id']);expect(page.locator('.source-target').first).to_be_focused();snap('08-network-source');activate(page,page.locator('[data-action="net-return"]'),phone);expect(page.locator('#network-select')).to_have_value('code:'+leaf['id']);assert get()==before
                    return {'nodes':len(graph['nodes']),'links':len(graph['links']),'no_dangling_links':True,'exact_annotation':added[0]['id'],'source_and_return':True,'project_unchanged':True}
                check(mode+' relationship map exact source roundtrip and connected identities',network,page)
                def open_report():page.locator('[data-action="export"]').first.click();page.locator('[data-action="write-report"]').click();expect(page.locator('#report-save-state')).to_be_visible()
                def rtab(id):page.locator('[data-report-tab="'+id+'"]').click()
                def rsave(refresh=False):
                    rev=get().get('research_report',{}).get('revision',0);activate(page,page.locator('[data-report-action="'+('refresh' if refresh else 'save')+'"]'),phone);expect(page.locator('#report-save-state')).to_have_text('Saved locally · version '+str(rev+1),timeout=120000)
                settings={};plot_files={}
                def figures():
                    page.locator('[data-action="view"][data-view="plotting"]').click()
                    # Existing controls: these are declared test parameters, not code changes.
                    for i,kind in enumerate(KINDS):
                        if page.locator('[data-plot="kind"]').input_value()!=kind:page.locator('[data-plot="kind"]').select_option(kind)
                        page.wait_for_function('()=>{const i=document.querySelector("#plot-preview");return i&&i.complete&&i.naturalWidth>0&&!i.classList.contains("loading")}',timeout=120000)
                        settings[kind]=page.evaluate('({...state.plotOptions})');button=page.get_by_role('button',name='Enlarge figure',exact=True);expect(button).to_be_enabled();activate(page,button,phone);expect(page.locator('.plot-viewer-viewport')).to_be_focused();page.wait_for_function('()=>document.querySelector("#plot-viewer img").naturalWidth>0')
                        g=page.locator('#plot-viewer img').evaluate('e=>{const r=e.getBoundingClientRect();return {width:r.width,height:r.height,natural:[e.naturalWidth,e.naturalHeight]}}');assert abs(g['width']-g['natural'][0])<1 and abs(g['width']/g['height']-g['natural'][0]/g['natural'][1])<.002
                        if kind in ['coverage','hierarchy']:
                            activate(page,page.get_by_role('button',name='Fit width',exact=True),phone);activate(page,page.get_by_role('button',name='Actual size (100%)',exact=True),phone);snap('09-'+kind+'-actual-size')
                        activate(page,page.get_by_role('button',name='Close figure',exact=True),phone);expect(button).to_be_focused()
                        path=folder/(kind+'.zip');download(page,page.locator('[data-action="plot-export"]'),path,phone)
                        with zipfile.ZipFile(path) as z:
                            assert len(z.namelist())==5;plot_files[kind]={n:sha(z.read(n)) for n in z.namelist()};options=plotting.normalise(settings[kind]);current=get();rows=analyze.tidy(current);assert z.read('figure_data.csv')==plotting._dataset(rows,options,{d['name']:d['text'] for d in current['documents']}).encode('utf-8')
                        # Attach exactly these user-selected parameters through the existing UI.
                        open_report()
                        if i==0:
                            page.locator('#report-method').select_option('content')
                            for key,val in {'title':'Bologna · final joint report','research_question':'Can this public coding record be followed from import to recoverable evidence outputs?','case_unit':'Public source records used as technical test cases; not independent research findings.','analysis_unit':'Exact source ranges and their explicitly selected code links.','approach':'Technical acceptance with explicit researcher review; no substantive method-completion claim.','method_notes':'Method selection and map are versioned. Interpretations and confirmations remain researcher decisions.'}.items():page.locator('[data-report-field="'+key+'"]').fill(val)
                        rtab('figures');activate(page,page.locator('[data-report-action="current-figure"]'),phone);page.locator('[data-report-caption]').last.fill('Public Bologna technical audit. Original figure and counts; not a causal or saturation claim.');rsave();close(page)
                    saved=get()['research_report'];assert len(saved['assets'])==5
                    for fig in saved['current']['draft']['figures']:
                        asset=saved['assets'][saved['current']['bindings']['figures'][fig['id']]['asset_id']]
                        actual=reporting.report_figures.files(asset);assert {n:sha(v) for n,v in actual.items()}==plot_files[fig['options']['kind']]
                    dump(folder/'plot-records.json',{'settings':settings,'members':plot_files});snap('10-five-figure-workspace')
                    return {'figure_types':5,'25_members_verified':True,'report_assets_byte_match_selected_GUI_bundles':True,'aspect_ratio_and_original_size':True,'phone_uses_actual_size_and_download':phone}
                check(mode+' five real figures original-size viewer counts scripts and report binding',figures,page)
                def counts_oracle():
                    current=get();rows=analyze.tidy(current);old=analyze.tidy(p);freq={r['label']:r['count'] for r in analyze.frequency(rows)};oldfreq={r['label']:r['count'] for r in analyze.frequency(old)};labels=analyze.code_labels(current['codes'])
                    for code in [leaf,second]:assert freq[labels[code['id']]]==oldfreq[labels[code['id']]]+1
                    co=analyze.cooccurrence(rows);oldco=analyze.cooccurrence(old);labels=analyze.code_labels(current['codes']);a=co['labels'].index(labels[leaf['id']]);b=co['labels'].index(labels[second['id']]);oa=oldco['labels'].index(labels[leaf['id']]);ob=oldco['labels'].index(labels[second['id']]);assert co['matrix'][a][b]==oldco['matrix'][oa][ob]+1
                    assert analyze.accumulation(rows)['cumulative'][-1]==len({a['code_id'] for a in current['annotations']});return {'two_target_code_counts_incremented_by_one':True,'same_range_pair_incremented_by_one':True,'cumulative_distinct_count':len({a['code_id'] for a in current['annotations']}),'codings':876}
                check(mode+' manual count expectations agree with the unchanged analysis definitions',counts_oracle,page)
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
                    go_coding();page.locator('#reading-document').select_option(source['id']);page.locator('#search').fill('UX60_FILTERED_EXPORT');expect(page.locator('.paragraph')).to_have_count(0);before=get();page.locator('[data-action="export"]').first.click();expect(page.locator('#coded-scope')).to_have_value('current')
                    for fmt in ['html','docx']:download(page,page.locator('[data-action="download-coded"][data-format="coded-'+fmt+'"]'),folder/('notebook.'+fmt),phone)
                    with zipfile.ZipFile(folder/'notebook.docx') as z:
                        frozen=json.loads(ET.fromstring(z.read('customXml/item1.xml')).text);assert frozen['documents'][0]['text']==source['text'];assert frozen['association_count']==2;assert all(label in ''.join(ET.fromstring(z.read('word/document.xml')).itertext()).upper() for label in ['THEME','CATEGORY','CODE']);assert b'<w:drawing' not in z.read('word/document.xml')
                    offline=ctx.new_page();offline.goto((folder/'notebook.html').resolve().as_uri());saved=offline.locator('#frozen-evidence').evaluate('(t)=>JSON.parse(t.content.textContent)');assert saved['documents']==frozen['documents'];assert offline.locator('.source-text').evaluate_all('(es)=>es.map(e=>e.textContent).join("")')==source['text'];mark=offline.locator('mark').first
                    if phone:mark.tap()
                    else:mark.hover()
                    assert 'active' in mark.get_attribute('class');mark.focus();mark.press('Enter');assert offline.evaluate('document.activeElement.dataset.locate') in {a['key'] for a in frozen['documents'][0]['annotations']};offline.keyboard.press('Enter');assert offline.evaluate('document.activeElement.tagName')=='MARK';png(offline,mode+'/13-notebook-source-tree');assert not offline.evaluate('document.documentElement.scrollWidth>innerWidth');offline.close();assert get()==before
                    for fmt in ['csv','matrix','methods','json']:download(page,page.locator('[data-action="download"][data-format="'+fmt+'"]'),folder/('project-'+fmt+('.json' if fmt=='json' else '.txt')),phone)
                    snap('14-export-completion');close(page);page.locator('#search').fill('');return {'full_source_characters':len(source['text']),'two_exact_highlight_associations':True,'native_editable_tree':True,'offline_hover_touch_keyboard_links':True,'filter_did_not_crop_export':True,'four_original_exports':True,'project_equal_after_exports':True}
                check(mode+' full coded notebook native Word source-tree links and all original exports',notebook,page)
                def recovery():
                    exported=json.loads((folder/'project-json.json').read_text());assert exported==get()
                    page.locator('[data-action="projects"]:visible').first.click()
                    with page.expect_file_chooser() as event:activate(page,page.locator('[data-action="restore-pick"]'),phone)
                    before_projects=s.json('/projects');before_backups=backup_manifest(s.folder,pid)
                    with page.expect_response(lambda r:r.url==site+'/w/api/projects' and r.request.method=='POST') as response:event.value.set_files(folder/'project-json.json')
                    resp=response.value;ui_pass=resp.status==200
                    if not ui_pass:
                        assert resp.status==400 and 'QCA integrity validation failed' in resp.text();expect(page.locator('#dialog')).to_contain_text('QCA integrity validation failed');snap('15-json-restore-integrity-error')
                        assert get()==exported and s.json('/projects')==before_projects and backup_manifest(s.folder,pid)==before_backups
                        dump(folder/'json-restore-failure.json',{'status':400,'message':resp.text(),'original_project_equal':True,'project_list_equal':True,'backups_equal':True,'file_bytes':(folder/'project-json.json').stat().st_size})
                        result['issues'].append({'id':'UX60-01','severity':'P1','viewport':mode,'message':'Own QCA project JSON rejected by browser restore: QCA integrity validation failed','original_project_preserved':True})
                        result['expected_http'].append([resp.status,resp.url]);result['http']=[item for item in result['http'] if item!=[resp.status,resp.url]]
                        # Diagnostic recovery only: preserve Python JSON numeric types. This does not pass the UI gate.
                        restored=s.json('/projects',{'kind':'restore','project':exported});rid=restored['id'];close(page);page.reload(wait_until='networkidle');page.locator('[data-action="projects"]:visible').first.click();page.locator('#modal-project-select').select_option(rid);activate(page,page.locator('[data-action="switch-project"]'),phone)
                    page.wait_for_function('(id)=>state.project?.id&&state.project.id!==id',arg=pid);rid=page.evaluate('state.project.id');restored=s.json('/projects/'+rid);assert rid!=pid
                    for k in ['documents','codes','annotations','blocks','comparative_qca','research_report']:assert restored[k]==exported[k],k
                    assert next(d for d in restored['documents'] if d['id']==source['id'])['reading_state']==next(d for d in exported['documents'] if d['id']==source['id'])['reading_state']
                    page.locator('#reading-document').select_option(source['id']);assert page.evaluate('state.project.id')==rid;restored_memory=memory()
                    overview(4);assert page.locator('#reading-overview-map .read,#reading-overview-map .revisit').count()==2;assert page.evaluate('readingOverviewData(state.project,doc()).codingCount')==2;snap('15-restored-reading-tracks');activate(page,page.locator('[data-action="reading-resume"]'),phone) if page.locator('[data-action="reading-resume"]').is_enabled() else activate(page,page.locator('[data-action="reading-overview"]'),phone)
                    open_report();rtab('preview');expect(page.frame_locator('#report-preview').locator('.method-map li')).to_have_count(6);snap('16-restored-method-map');close(page)
                    snapshots=s.json('/projects/'+rid+'/backups')['items'];assert snapshots;recovered=s.json('/projects/'+rid+'/restore-snapshot',{'name':snapshots[0]['name']})
                    for k in ['documents','codes','annotations','comparative_qca','research_report']:assert recovered[k]==restored[k],k
                    dump(folder/'final-project.json',exported);dump(folder/'restored-project.json',restored);return {'gate_pass':ui_pass,'browser_JSON_restore_pass':ui_pass,'diagnostic_API_preserves_numeric_types_and_all_source_roles_marks_QCA_report_versions_assets':True,'snapshot_copy_equal':True,'restored_project_id':rid,'Resume_is_browser_project_local_not_exported':True,'original_project_untouched':s.json(root)==exported}
                check(mode+' full JSON recovery and committed snapshot restore',recovery,page)
                def website():
                    page.goto(site+'/',wait_until='networkidle');assert not page.evaluate('document.documentElement.scrollWidth>innerWidth');page.locator('#workflow').scroll_into_view_if_needed();snap('17-website-workflow')
                    assert page.locator('.method-path').count()==3
                    for i in range(3):card=page.locator('.method-path').nth(i);activate(page,card.locator('summary').first,phone);assert card.locator('.site-method-map li').count()==6;activate(page,card.locator('summary').first,phone)
                    page.goto(site+'/report',wait_until='networkidle');total=0;readouts=[]
                    for kind in KINDS:
                        data=list(csv.reader((ROOT/'website/public/report/figures'/f'{kind}.csv').read_text().splitlines()));expected=data[1:];section=page.locator('#sec-'+kind);section.scroll_into_view_if_needed();tools=section.locator('.reader-tools');activate(page,tools.locator('summary'),phone);select=page.locator('#reader-select-'+kind)
                        for i in sorted({0,len(expected)//2,len(expected)-1}):
                            select.select_option(str(i));row=page.locator('#row-'+kind+'-'+str(i));assert row.locator('td').all_text_contents()==expected[i];assert 'is-selected' in row.get_attribute('class');readouts.append({'kind':kind,'row':i,'cells':expected[i]})
                        table=page.locator('#table-'+kind);actual=table.locator('tbody tr').evaluate_all('(rs)=>rs.map(r=>[...r.querySelectorAll("td")].map(c=>c.textContent))');assert actual==expected,(kind,len(actual),len(expected));total+=len(actual)
                        if kind in ['frequency','accumulation'] and not phone:
                            marks=section.locator('[data-csv-row]');marks.first.focus();marks.first.press('End');assert select.input_value()==str(len(expected)-1);page.mouse.move(2,2);hit=marks.first.locator('.plot-dot' if kind=='accumulation' else '.plot-bar');hit.evaluate('e=>e.scrollIntoView({block:"center",behavior:"instant"})');hit.hover();assert select.input_value()=='0';marks.first.press('Enter')
                        if kind in ['frequency','coverage','accumulation']:snap('18-report-'+kind)
                    assert total==594;assert not page.evaluate('document.documentElement.scrollWidth>innerWidth');page.locator('#sec-methods').scroll_into_view_if_needed();expect(page.locator('#sec-methods')).to_contain_text('saved name and process map');snap('19-report-method-export-record');dump(folder/'website-readouts.json',readouts);return {'website_fixed_snapshot_documents':19,'workbench_temporary_project_documents':21,'count_table_rows_exact':total,'selected_readouts':len(readouts),'three_method_maps':True,'original_figures_tables_downloads_retained':True,'no_horizontal_overflow':True,'touch_or_mouse_and_keyboard':True}
                check(mode+' website original report CSV readouts linked rows and method maps',website,page)
                dump(folder/'checkpoint-project.json',get());ctx.close()
            browser.close()
        assert s.json('/projects/'+seed['id'])==seed;assert not result['http'] and not result['outside'];assert len(result['console'])==len(result['expected_http']) and all('status of 400' in line for line in result['console']),result['console'];result['completed']=True;result['acceptance_pass']=all(c['pass'] for c in result['checks']);dump(out/'results.json',result);print(json.dumps({'checks':len(result['checks']),'passed':sum(c['pass'] for c in result['checks']),'issues':len(result['issues']),'console':len(result['console']),'http':len(result['http']),'outside':len(result['outside'])}));sys.exit(0 if result['acceptance_pass'] else 1)
    finally:os.killpg(proc.pid,15);proc.wait(timeout=15);log.close();s.stop()
if __name__=='__main__':main()
