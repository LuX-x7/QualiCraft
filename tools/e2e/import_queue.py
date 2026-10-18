"""UX58: project-only Chrome multi-file queue, interruption and reselection acceptance."""
import argparse,copy,io,json,os,subprocess,sys,time,urllib.request,zipfile
from pathlib import Path
from xml.sax.saxutils import escape
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from tools.e2e.recovery_boundaries import Service,dump,backup_manifest,validate
from qualicraft import core
from qualicraft.server import bologna_example
from playwright.sync_api import sync_playwright,expect
NODE='/Users/chehaijun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--seed',type=Path,required=True);parser.add_argument('--out',type=Path,required=True);parser.add_argument('--site-build',type=Path,required=True);parser.add_argument('--port',type=int,default=52760);args=parser.parse_args();out=args.out;out.mkdir(parents=True,exist_ok=True)
    seed=json.loads(args.seed.read_text());public=bologna_example()
    for k in ['documents','codes','annotations']:assert seed[k]==public[k]
    seed['id']=core.uid();seed['name']='Bologna · batch queue acceptance';s=Service(out/'service',seed);site='http://127.0.0.1:'+str(args.port);log=(out/'site.txt').open('w');proc=subprocess.Popen([NODE,'start.js'],cwd=args.site_build,env={**os.environ,'PORT':str(args.port),'HOST':'127.0.0.1','QT_WORKBENCH_URL':s.base},stdout=log,stderr=log,start_new_session=True)
    result={'checks':[],'console':[],'http':[],'outside':[],'device':'Chrome desktop and phone touch emulation; no physical-device or VoiceOver claim'}
    def check(name,detail):result['checks'].append({'name':name,'pass':True,'detail':detail});dump(out/'results.json',result);print(name+': PASS',flush=True)
    def snapshot(pid):return s.json('/projects/'+pid),backup_manifest(s.folder,pid)
    def payload(name,text=None,blob=None):return {'name':name,'mimeType':'text/plain' if name.endswith('.txt') else 'application/vnd.openxmlformats-officedocument.wordprocessingml.document','buffer':blob if blob is not None else text.encode()}
    source=seed['documents'][0]['text'];other=seed['documents'][1]['text'];docx=io.BytesIO()
    with zipfile.ZipFile(docx,'w') as z:z.writestr('word/document.xml','<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>'+escape(source)+'</w:t></w:r></w:p></w:body></w:document>')
    page=None
    try:
        for _ in range(150):
            try:
                with urllib.request.urlopen(site+'/w/api/bootstrap',timeout=2) as r:assert json.load(r)['token']==s.token
                break
            except Exception:time.sleep(.2)
        else:raise TimeoutError('production site not ready')
        with sync_playwright() as pw:
            browser=pw.chromium.launch(channel='chrome',headless=True)
            for width in [1440,390]:
                p=s.json('/projects',{'kind':'restore','project':seed});pid=p['id'];root='/projects/'+pid;phone=width==390;kind='phone' if phone else 'desktop';prefix='UX58-'+kind
                context=browser.new_context(viewport={'width':width,'height':1000 if not phone else 844},has_touch=phone,is_mobile=phone,accept_downloads=True)
                context.route('**/*',lambda route:route.continue_() if route.request.url.startswith(site+'/') or route.request.url.startswith('blob:') else (result['outside'].append(route.request.url),route.abort()))
                page=context.new_page();page.on('pageerror',lambda e:result['console'].append(str(e)));page.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None);page.on('response',lambda r:result['http'].append([r.status,r.url]) if r.status>=400 else None)
                held=[];posts=[];control={'hold':True}
                def intercept(route):
                    if route.request.method!='POST':route.continue_();return
                    body=route.request.post_data_json;posts.append(body)
                    if control['hold']:
                        control['hold']=False;response=route.fetch();held.append((route,response,body));return
                    route.continue_()
                def wait_held():
                    deadline=time.monotonic()+10
                    while not held and time.monotonic()<deadline:page.wait_for_timeout(20)
                    assert len(held)==1,'Expected one completed backend save with its UI receipt held'
                page.route('**/documents',intercept)
                page.goto(site+'/w/?lang=en',wait_until='networkidle');page.locator('#start-project-select').select_option(pid);page.locator('[data-action="start-open"]').click()
                page.locator('[data-action="import"]:visible').first.click();assert page.locator('#import-file').evaluate('(el)=>el.multiple');before=snapshot(pid)
                a=payload(prefix+'-A.txt',source);adocx=payload(prefix+'-A.docx',blob=docx.getvalue());bad=payload(prefix+'-bad-UTF8.txt',blob=b'\xff');corrupt=payload(prefix+'-bad.docx',blob=source.encode());b=payload(prefix+'-B.txt',other)
                with page.expect_file_chooser() as chosen:
                    if phone:page.locator('#import-file').tap()
                    else:page.locator('#import-file').focus();page.locator('#import-file').press('Enter')
                chosen.value.set_files([a,adocx,bad,corrupt,b]);expect(page.locator('#dialog')).to_have_attribute('data-workflow','import-queue');expect(page.locator('.io-queue-row')).to_have_count(5);assert snapshot(pid)==before
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert page.locator('#dialog').evaluate('(el)=>el.scrollWidth<=el.clientWidth');page.screenshot(path=str(out/(kind+'-queue-ready.png')));check(kind+' actual five-file selection is queued without importing',{'files':5,'all_state_and_snapshots_equal':True,'no_overflow':True})
                start=page.locator('[data-action="queue-start"]');start.focus();start.press('Enter') if not phone else start.tap();expect(page.locator('.is-saving')).to_have_count(1);page.screenshot(path=str(out/(kind+'-queue-progress.png')))
                page.locator('[data-action="queue-pause"]').click();expect(page.locator('#queue-summary')).to_contain_text('Stopping after current');wait_held()
                page.locator('.modal-footer [data-action="close"]').click();expect(page.locator('#dialog')).not_to_be_visible()
                route,response,body=held.pop(0);route.fulfill(response=response)
                expect(page.locator('#reading-document option')).to_have_count(20)
                page.locator('[data-action="import"]:visible').first.click();page.locator('[data-action="queue-open"]').click()
                expect(page.locator('[data-action="queue-start"]')).to_be_enabled();expect(page.locator('.is-saved')).to_have_count(1);assert len(posts)==1 and len(s.json(root)['documents'])==20
                page.screenshot(path=str(out/(kind+'-queue-stopped.png')));check(kind+' close during save retains the current receipt and pauses the rest',{'documents_in_workspace':20,'queued_files_preserved':4});check(kind+' stop waits for current receipt and sends no next file',{'document_count':20,'POST_count':1})
                page.locator('[data-action="queue-start"]').click();expect(page.locator('.is-saved')).to_have_count(2);expect(page.locator('.is-failed')).to_have_count(2);expect(page.locator('.is-duplicate')).to_have_count(1);assert len(s.json(root)['documents'])==21
                expect(page.locator('.is-failed').first).to_contain_text('UTF-8');expect(page.locator('.is-failed').last).to_contain_text('DOCX');assert page.locator('[data-action="queue-start"]').is_disabled();page.screenshot(path=str(out/(kind+'-queue-mixed-results.png')));check(kind+' failures are per-file and duplicate waits while valid files finish',{'saved':2,'failed':2,'decisions':1,'documents':21})
                failed=page.locator('.is-failed').first;prior=snapshot(pid);failed.locator('[data-action="queue-retry"]').press('Enter');expect(page.locator('.is-failed')).to_have_count(2);assert snapshot(pid)==prior;check(kind+' retry exposes the same parsing reason without duplicate writes',{'project_and_snapshots_equal':True})
                duplicate=page.locator('.is-duplicate');duplicate.scroll_into_view_if_needed();assert page.locator('.modal-head').bounding_box()['y']>=0;assert page.locator('.modal-footer').bounding_box()['y']+page.locator('.modal-footer').bounding_box()['height']<=page.viewport_size['height'];page.screenshot(path=str(out/(kind+'-duplicate-choice.png')));before=snapshot(pid);duplicate.locator('[data-action="queue-cancel"]').press('Enter') if not phone else duplicate.locator('[data-action="queue-cancel"]').tap();expect(page.locator('.is-cancelled')).to_have_count(1);assert snapshot(pid)==before;check(kind+' cancel duplicate leaves documents and recovery points equal',{'all_state_equal':True})
                c=payload(prefix+'-C.txt',other);page.locator('#queue-add-files').set_input_files([a,c]);page.locator('[data-action="queue-start"]').click();expect(page.locator('.is-duplicate')).to_have_count(1);expect(page.locator('.is-saved')).to_have_count(3);before=snapshot(pid);duplicate=page.locator('.is-duplicate');cancel=duplicate.locator('[data-action="queue-cancel"]');keep=duplicate.locator('[data-action="queue-keep"]')
                if phone:keep.tap()
                else:cancel.focus();cancel.press('Tab');expect(keep).to_be_focused();keep.press('Enter')
                expect(page.locator('.is-saved')).to_have_count(4);after=snapshot(pid);assert len(after[0]['documents'])==23;assert len(after[0]['audit'])==len(before[0]['audit'])+1;assert len(after[1])==len(before[1])+1
                matching=[d for d in after[0]['documents'] if d['name']==prefix+'-A'];assert len(matching)==2 and len({d['id'] for d in matching})==2;page.screenshot(path=str(out/(kind+'-kept-copy.png')));check(kind+' keyboard or touch Keep creates exactly one independent copy',{'matching_source_ids':[d['id'] for d in matching],'new_audit':1,'new_snapshot':1})
                page.locator('[data-action="queue-clear"]').click();expect(page.locator('.io-queue-row')).to_have_count(2);assert s.json(root)==after[0];check(kind+' clearing finished queue items retains documents and failures',{'remaining_rows':2,'saved_project_equal':True})
                # Hold an acknowledged backend save before delivering the browser receipt.
                d=payload(prefix+'-D.txt',source);e=payload(prefix+'-E.txt',other);page.locator('#queue-add-files').set_input_files([d,e]);control['hold']=True;page.locator('[data-action="queue-start"]').click();expect(page.locator('.is-saving')).to_have_count(1);wait_held();lost=held.pop(0);lost_id=lost[2]['request_id'];assert len(s.json(root)['documents'])==24
                page.reload(wait_until='networkidle');lost[0].fulfill(response=lost[1]);page.locator('[data-action="import"]:visible').first.click();page.locator('[data-action="queue-open"]').click();expect(page.locator('.is-needs-file')).to_have_count(4)
                key='qt.importQueue.v1:'+pid;metadata=page.evaluate('(key)=>localStorage.getItem(key)',key);assert source[:180] not in metadata and 'docx_base64' not in metadata and '"text"' not in metadata
                wrong=payload(prefix+'-D.txt',other);page.locator('#queue-reselect-files').set_input_files([wrong,e]);page.locator('[data-action="queue-start"]').click();expect(page.locator('.is-failed')).to_have_count(1);expect(page.locator('.is-saved')).to_have_count(1);expect(page.locator('.is-failed')).to_contain_text('source changed');assert len(s.json(root)['documents'])==25
                page.screenshot(path=str(out/(kind+'-changed-file-refused.png')));check(kind+' refresh requires reselection and refuses changed extracted text',{'metadata_has_no_text_or_file_bytes':True,'document_count_after_other_valid_file':25})
                before=snapshot(pid);page.locator('#queue-reselect-files').set_input_files([d]);page.locator('[data-action="queue-start"]').click();expect(page.locator('.is-saved')).to_have_count(2);assert snapshot(pid)==before;assert posts[-1]['request_id']==lost_id;page.screenshot(path=str(out/(kind+'-queue-recovered.png')));check(kind+' reselecting original file reconciles lost receipt without new copy or snapshot',{'request_id_reused':True,'all_state_equal':True,'documents':25})
                final=s.json(root);validate(final)
                for k in ['codes','annotations','comparative_qca','research_report']:assert final[k]==p[k],k
                assert final['documents'][:19]==p['documents'];assert len(final['audit'])==len(p['audit'])+6;check(kind+' source records and frozen QCA/report survive six deliberate imports',{'original_documents':19,'new_documents':6,'codings':874,'original_sources_and_frozen_records_equal':True})
                page.locator('.is-saved').last.locator('[data-action="queue-view"]').click();expect(page.locator('#dialog')).not_to_be_visible();expect(page.locator('.import-receipt')).to_be_visible();assert page.locator('#reading-document').input_value() in {d['id'] for d in final['documents'][-2:]};check(kind+' result opens the saved document in Coding',{'source_id_exact':True})
                page.locator('[data-action="export"]').first.click()
                with page.expect_download() as dl:page.locator('[data-action="download"][data-format="json"]').click()
                export=out/(kind+'-project.json');dl.value.save_as(export);assert json.loads(export.read_text())==final;page.screenshot(path=str(out/(kind+'-project-export.png')));page.locator('[data-action="close"]').first.click();check(kind+' downloaded project contains all queue results and frozen analyses',{'documents':25,'exact_project_equal':True})
                # Local UI-only 101-file rejection: no request or queue truncation.
                page.locator('[data-action="import"]:visible').first.click();before=snapshot(pid);page.locator('#import-file').set_input_files([payload(prefix+'-limit-'+str(i)+'.txt',source) for i in range(101)]);expect(page.locator('#modal-error')).to_contain_text('100');expect(page.locator('#dialog')).to_have_attribute('data-workflow','import');assert snapshot(pid)==before;page.locator('[data-action="close"]').first.click();check(kind+' 101-file selection is rejected without truncation or writes',{'all_state_equal':True})
                for url in ['/','/report']:
                    page.goto(site+url,wait_until='networkidle');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');check(kind+' '+url+' smoke check',{'HTTP':200,'no_overflow':True})
                context.close()
            capacity=s.json('/projects',{'kind':'restore','project':seed});cpid=capacity['id'];croot='/projects/'+cpid
            c=browser.new_context(viewport={'width':1440,'height':1000});c.route('**/*',lambda route:route.continue_() if route.request.url.startswith(site+'/') else (result['outside'].append(route.request.url),route.abort()));page=c.new_page();page.on('pageerror',lambda e:result['console'].append(str(e)));page.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None);page.on('response',lambda r:result['http'].append([r.status,r.url]) if r.status>=400 else None)
            page.goto(site+'/w/?lang=en',wait_until='networkidle');page.locator('#start-project-select').select_option(cpid);page.locator('[data-action="start-open"]').click();page.locator('[data-action="import"]:visible').first.click();before=snapshot(cpid)
            page.locator('#import-file').set_input_files([payload('Bologna-capacity-'+str(i).zfill(3)+'.txt',source) for i in range(100)]);expect(page.locator('.io-queue-row')).to_have_count(100);assert snapshot(cpid)==before;check('desktop actual 100-file selection stays intact before Start',{'queued_files':100,'no_mutation':True})
            began=time.perf_counter();page.locator('[data-action="queue-start"]').click();expect(page.locator('#queue-summary')).to_contain_text('81 saved',timeout=180000);expect(page.locator('.is-failed')).to_have_count(19,timeout=30000);assert page.locator('[data-action="queue-start"]').is_disabled();full=s.json(croot);validate(full);assert len(full['documents'])==100 and len(full['audit'])==len(capacity['audit'])+81
            for k in ['codes','annotations','comparative_qca','research_report']:assert full[k]==capacity[k]
            assert full['documents'][:19]==capacity['documents'];expect(page.locator('.is-failed').first).to_contain_text('100 documents');page.locator('.modal-body').evaluate('(el)=>el.scrollTop=0');page.screenshot(path=str(out/'desktop-100-file-results.png'));check('desktop queue imports 81 available slots and reports each of 19 capacity failures',{'documents':100,'saved':81,'failed':19,'seconds':time.perf_counter()-began,'technical_copies_not_independent_participants':True,'frozen_QCA_report_equal':True})
            metadata=page.evaluate('(key)=>localStorage.getItem(key)','qt.importQueue.v1:'+cpid);assert len(json.loads(metadata)['rows'])==100 and source[:180] not in metadata;dump(out/'capacity-summary.json',{'project_id':cpid,'documents':100,'queue_rows':100,'saved':81,'failed':19,'metadata_bytes':len(metadata.encode()),'no_source_text':True});c.close()
            browser.close()
        assert snapshot(seed['id'])[0]==seed;assert not any(result[k] for k in ['console','http','outside']),result
        result.update(completed=True,original_project_equal=True);dump(out/'results.json',result);print(json.dumps({'checks':len(result['checks']),'console':0,'http':0,'outside':0,'original_project_equal':True}))
    except Exception:
        if page and not page.is_closed():
            try:page.screenshot(path=str(out/'failure.png'));dump(out/'failure-state.json',{'url':page.url,'dialog':page.locator('#dialog').inner_text()})
            except Exception:pass
        dump(out/'results.json',result);raise
    finally:os.killpg(proc.pid,15);proc.wait(timeout=15);log.close();s.stop()
if __name__=='__main__':main()
