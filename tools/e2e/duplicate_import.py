"""UX57 project-only Chrome duplicate-import decisions on public Bologna copies."""
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
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--seed',type=Path,required=True);parser.add_argument('--out',type=Path,required=True);parser.add_argument('--site-build',type=Path,required=True);parser.add_argument('--port',type=int,default=52758);args=parser.parse_args();out=args.out;out.mkdir(parents=True,exist_ok=True)
    seed=json.loads(args.seed.read_text());public=bologna_example()
    for k in ['documents','codes','annotations']:assert seed[k]==public[k],k
    seed['id']=core.uid();seed['name']='Bologna · duplicate import acceptance';s=Service(out/'service',seed);site='http://127.0.0.1:'+str(args.port);log=(out/'site.txt').open('w');env={**os.environ,'PORT':str(args.port),'HOST':'127.0.0.1','QT_WORKBENCH_URL':s.base};proc=subprocess.Popen([NODE,'start.js'],cwd=args.site_build,env=env,stdout=log,stderr=log,start_new_session=True)
    result={'checks':[],'console':[],'http':[],'outside':[],'device':'Chrome touch emulation; physical-device/VoiceOver acceptance separate'}
    def check(name,detail):result['checks'].append({'name':name,'pass':True,'detail':detail});dump(out/'results.json',result);print(name+': PASS',flush=True)
    def state(pid):return s.json('/projects/'+pid),backup_manifest(s.folder,pid)
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
                p=s.json('/projects',{'kind':'restore','project':seed});pid=p['id'];root='/projects/'+pid;original=state(pid);d=p['documents'][0];text=d['text'];name=d['name'];phone=width==390;kind='phone' if phone else 'desktop'
                context=browser.new_context(viewport={'width':width,'height':1000 if not phone else 844},has_touch=phone,is_mobile=phone,accept_downloads=True);context.route('**/*',lambda route:route.continue_() if route.request.url.startswith(site+'/') or route.request.url.startswith('blob:') else (result['outside'].append(route.request.url),route.abort()));page=context.new_page();
                if phone:page.add_init_script("Object.defineProperty(Crypto.prototype,'randomUUID',{value:undefined})")
                page.on('pageerror',lambda e:result['console'].append(str(e)));page.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None);page.on('response',lambda r:result['http'].append([r.status,r.url]) if r.status>=400 else None)
                page.goto(site+'/w/?lang=en',wait_until='networkidle');page.locator('#start-project-select').select_option(pid);page.locator('[data-action="start-open"]').click()
                def open_import(mode='paste'):
                    page.locator('[data-action="import"]:visible').first.click()
                    if mode=='paste':page.locator('[data-action="import-mode"][data-mode="paste"]').click();page.locator('#document-text').fill(text)
                    else:page.locator('#import-file').set_input_files({'name':'Bologna.txt','mimeType':'text/plain','buffer':text.encode()})
                    page.locator('#document-name').fill(name)
                def warn():
                    page.locator('[data-action="save-document"]').press('Enter') if not phone else page.locator('[data-action="save-document"]').tap()
                    expect(page.locator('#import-duplicate')).to_be_visible();expect(page.locator('[data-action="keep-document"]')).to_be_visible();expect(page.locator('[data-import-cancel]')).to_be_focused();expect(page.locator('[data-action="save-document"]')).not_to_be_visible();assert page.locator('#import-duplicate').evaluate('(el)=>{const r=el.getBoundingClientRect(),body=el.closest(".modal-body").getBoundingClientRect();return r.top>=body.top-1&&r.bottom<=body.bottom+1}')
                open_import('file');warn();assert state(pid)==original
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert page.locator('#dialog').evaluate('(el)=>el.scrollWidth<=el.clientWidth')
                page.screenshot(path=str(out/(kind+'-duplicate-choice.png')));check(kind+' TXT warning is nonmutating and offers explicit choices',{'documents':19,'audit_and_snapshot_hashes_equal':True,'no_overflow':True,'safe_focus':'Cancel import'})
                if phone:page.locator('[data-import-cancel]').tap()
                else:page.locator('[data-import-cancel]').press('Escape')
                expect(page.locator('#dialog')).not_to_be_visible();assert state(pid)==original;check(kind+' cancel or Escape leaves source and recovery points unchanged',{'all_state_equal':True})
                open_import();warn();keep=page.locator('[data-action="keep-document"]')
                if phone:keep.tap()
                else:page.locator('[data-import-cancel]').press('Tab');expect(keep).to_be_focused();keep.press('Enter')
                expect(page.locator('#dialog')).not_to_be_visible();expect(page.locator('.import-receipt')).to_be_visible()
                after=s.json(root);assert len(after['documents'])==20 and after['documents'][:-1]==p['documents'] and after['annotations']==p['annotations'];assert after['codes']==p['codes'];assert after['comparative_qca']==p['comparative_qca'] and after['research_report']==p['research_report'];validate(after)
                assert len(after['audit'])==len(p['audit'])+1;assert len(backup_manifest(s.folder,pid))==len(original[1])+1;page.screenshot(path=str(out/(kind+'-separate-copy-result.png')));check(kind+' explicit keep creates one independent source',{'documents':20,'originals_codes_codings_QCA_report_equal':True,'new_audit':1,'new_snapshot':1})
                open_import();warn();page.locator('#document-name').fill('Bologna renamed copy');expect(page.locator('#import-duplicate')).not_to_be_visible();expect(page.locator('[data-action="save-document"]')).to_be_visible();page.locator('[data-action="save-document"]').click();expect(page.locator('#dialog')).not_to_be_visible();assert len(s.json(root)['documents'])==21;check(kind+' changing name clears stale confirmation and imports normally',{'documents':21})
                # Verify the parsed DOCX path shares exact-text detection.
                page.locator('[data-action="import"]:visible').first.click();outdoc=io.BytesIO()
                with zipfile.ZipFile(outdoc,'w') as z:z.writestr('word/document.xml','<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>'+escape(text)+'</w:t></w:r></w:p></w:body></w:document>')
                page.locator('#import-file').set_input_files({'name':'Bologna.docx','mimeType':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','buffer':outdoc.getvalue()});page.locator('#document-name').fill(name);before=state(pid);warn();page.screenshot(path=str(out/(kind+'-docx-duplicate.png')));page.locator('#import-file').set_input_files([]);expect(page.locator('#import-duplicate')).not_to_be_visible();expect(page.locator('[data-action="keep-document"]')).not_to_be_visible();expect(page.locator('[data-action="save-document"]')).to_be_visible();assert state(pid)==before;check(kind+' clearing a file invalidates its previous decision',{'all_state_equal':True});page.locator('[data-import-cancel]').click();assert state(pid)==before;check(kind+' DOCX and pasted text share the same duplicate rule',{'matching_documents':2,'cancel_state_equal':True})
                # Retain all existing export and stored-analysis paths.
                page.locator('[data-action="export"]').first.click()
                with page.expect_download() as dl:page.locator('[data-action="download"][data-format="json"]').click()
                path=out/(kind+'-project.json');dl.value.save_as(path);payload=json.loads(path.read_text());assert payload==s.json(root);validate(payload);page.screenshot(path=str(out/(kind+'-export-result.png')));check(kind+' full project download retains separate documents and frozen records',{'download':dl.value.suggested_filename,'documents':21});page.locator('[data-action="close"]').first.click()
                for route in ['/','/report']:
                    page.goto(site+route,wait_until='networkidle');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path=str(out/(kind+('-home.png' if route=='/' else '-report.png'))));check(kind+' '+route+' smoke check',{'HTTP':200,'no_overflow':True})
                context.close()
            browser.close()
        assert not any(result[k] for k in ['console','http','outside']),result
        assert state(seed['id'])[0]==seed;result['completed']=True;result['original_project_equal']=True;dump(out/'results.json',result);print(json.dumps({'checks':len(result['checks']),'console':0,'http':0,'outside':0,'original_project_equal':True}))
    finally:
        os.killpg(proc.pid,15);proc.wait(timeout=15);log.close();s.stop()
if __name__=='__main__':main()
