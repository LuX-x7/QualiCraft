"""UX55 project-only Chrome checks on a recovered public Bologna copy."""
import argparse,base64,copy,io,json,sys,zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from tools.e2e.recovery_boundaries import Service,dump,sha
from playwright.sync_api import sync_playwright,expect

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--project',required=True,type=Path);parser.add_argument('--out',required=True,type=Path);args=parser.parse_args();out=args.out;out.mkdir(parents=True,exist_ok=True)
    project=json.loads(args.project.read_text(encoding='utf-8'));project['name']='Bologna · recovered QCA review';s=Service(out/'service',project);base=s.base;result={'checks':[],'console':[],'HTTP':[],'outside':[],'findings':[],'phone':'Chrome touch emulation; physical device not claimed'}
    def check(name,detail):result['checks'].append({'name':name,'pass':True,'detail':detail});dump(out/'results.json',result);print(name+': PASS',flush=True)
    def open_project(page,id):
        page.goto(base+'/w/?lang=en',wait_until='networkidle');page.locator('#start-project-select').select_option(id);page.locator('[data-action="start-open"]').click()
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(channel='chrome',headless=True)
            for width in [1440,390]:
                c=browser.new_context(viewport={'width':width,'height':1000 if width==1440 else 844},has_touch=width==390,is_mobile=width==390)
                c.route('**/*',lambda route:route.continue_() if route.request.url.startswith(base+'/') else (result['outside'].append(route.request.url),route.abort()))
                page=c.new_page();page.on('pageerror',lambda e:result['console'].append(str(e)));page.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None);page.on('response',lambda r:result['HTTP'].append([r.status,r.url]) if r.status>=400 else None)
                open_project(page,project['id']);expect(page.locator('#reading-document option')).to_have_count(100);page.locator('#reading-document').select_option(project['documents'][-1]['id']);page.locator('#reading-document').focus();page.locator('#reading-document').press('Home');page.locator('#reading-document').press('Enter')
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path=str(out/(str(width)+'-100-documents.png')));check(str(width)+' recovered 100-document switching and keyboard',{'document_options':100,'no_overflow':True})
                page.locator('[data-action="view"][data-view="insights"]').click();page.locator('[data-action="open-qca"]').click();expect(page.locator('#qca-save-state')).to_be_visible();page.locator('[data-qca-tab="calibration"]').click();expect(page.locator('#qca-case-select option')).to_have_count(len(project['comparative_qca']['design']['cases']));assert page.locator('[data-qca-value="A"]').input_value()==str(project['comparative_qca']['design']['cases'][0]['cells']['A']['value'])
                page.screenshot(path=str(out/(str(width)+'-recovered-calibration.png')))
                page.locator('[data-qca-tab="results"]').focus();page.locator('[data-qca-tab="results"]').press('Enter');expect(page.locator('#qca-panel > .notice')).to_be_visible();expect(page.get_by_role('region',name='Complete QCA truth table').locator('tbody tr')).to_have_count(2**len(project['comparative_qca']['design']['conditions']));page.screenshot(path=str(out/(str(width)+'-frozen-result-stale.png')))
                check(str(width)+' restored exact calibration, frozen result and stale notice',{'live_revision':project['comparative_qca']['revision'],'run_id':project['comparative_qca']['current']['id'],'source_imports_did_not_rewrite_result':True})
                page.locator('[data-qca-tab="versions"]').click()
                with page.expect_download() as d:page.locator('[data-qca-action="download"][data-format="zip"]').tap() if width==390 else page.locator('[data-qca-action="download"][data-format="zip"]').press('Enter')
                path=out/(str(width)+'-recovered-qca.zip');d.value.save_as(path)
                with zipfile.ZipFile(path) as z:assert json.loads(z.read('qca-run.json'))==project['comparative_qca']['current']
                page.locator('[data-qca-action="report"]').click();expect(page.locator('#report-save-state')).to_be_visible();expect(page.locator('#report-method')).to_have_value('comparative');page.locator('[data-report-tab="preview"]').click();frame=page.frame_locator('#report-preview');expect(frame.get_by_role('heading',name='Configuration solutions',exact=True)).to_be_visible();expect(frame.locator('figure')).to_have_count(5);expect(frame.locator('header')).to_contain_text('Qualitative Comparative Analysis');page.screenshot(path=str(out/(str(width)+'-recovered-report.png')))
                with page.expect_download() as d:page.locator('[data-report-action="download"][data-format="zip"]').tap() if width==390 else page.locator('[data-report-action="download"][data-format="zip"]').press('Enter')
                path=out/(str(width)+'-recovered-report.zip');d.value.save_as(path)
                with zipfile.ZipFile(path) as z:
                    assert json.loads(z.read('qca/qca-run.json'))==project['research_report']['current']['bindings']['qca'];assert len([n for n in z.namelist() if n.startswith('figures/') and n.endswith('/figure.py')])==5
                expect(page.locator('#report-download-status')).to_contain_text(d.value.suggested_filename);check(str(width)+' report preview and actual frozen ZIP downloads',{'five_figures':True,'QCA_record_equal':True,'download_status_visible':True})
                page.locator('[data-action="close"]').first.click()
                if width==1440:
                    page.locator('[data-action="open-qca"]').click();expect(page.locator('#qca-save-state')).to_be_visible();page.locator('[data-qca-tab="calibration"]').click();previous=page.locator('[data-qca-rationale="A"]').input_value();page.locator('[data-qca-rationale="A"]').fill('Technical unsaved recovery draft only.');page.locator('[data-action="close"]').first.click();expect(page.locator('#qca-discard')).to_be_visible()
                    with page.expect_download() as d:page.locator('[data-qca-action="draft-download"]').press('Enter')
                    target=out/'unsaved-calibration-draft.json';d.value.save_as(target);assert json.loads(target.read_text(encoding='utf-8'))['design']['cases'][0]['cells']['A']['rationale']=='Technical unsaved recovery draft only.'
                    page.locator('[data-qca-action="discard"]').click();page.reload(wait_until='networkidle');page.locator('[data-action="view"][data-view="insights"]').click();page.locator('[data-action="open-qca"]').click();expect(page.locator('#qca-save-state')).to_be_visible();page.locator('[data-qca-tab="calibration"]').click();expect(page.locator('[data-qca-rationale="A"]')).to_have_value(previous);page.locator('[data-action="close"]').first.click();check('Unsaved calibration close guard, draft download and explicit discard',{'saved_project_unchanged':True,'draft_file_retains_edit':True,'unsaved_edits_not_claimed_as_saved_recovery':True})
                c.close()

            # A separate import copy leaves the recovered project above untouched.
            imported=s.json('/projects',{'kind':'bologna'});source=imported['documents'][0]['text'];root='/projects/'+imported['id'];c=browser.new_context(viewport={'width':1440,'height':1000});c.route('**/*',lambda route:route.continue_() if route.request.url.startswith(base+'/') else (result['outside'].append(route.request.url),route.abort()));page=c.new_page();page.on('pageerror',lambda e:result['console'].append(str(e)));page.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None);page.on('response',lambda r:result['HTTP'].append([r.status,r.url]) if r.status>=400 else None);open_project(page,imported['id']);page.locator('[data-action="import"]').first.click();expect(page.locator('#import-file')).to_be_visible()
            multiple=page.locator('#import-file').evaluate('(n)=>n.multiple');assert multiple is False
            batch_error=''
            try:page.locator('#import-file').set_input_files([{'name':'Bologna-1.txt','mimeType':'text/plain','buffer':source.encode()},{'name':'Bologna-2.txt','mimeType':'text/plain','buffer':source.encode()}])
            except Exception as e:batch_error=str(e).splitlines()[0]
            assert batch_error;page.screenshot(path=str(out/'desktop-single-file-boundary.png'));result['findings'].append({'id':'UX55-03','severity':'scope gap','title':'Genuine multiple-file upload is unavailable; the file input accepts one document','input_multiple':False,'controlled_two_file_attempt':batch_error})
            page.locator('[data-action="close"]').first.click();check('Multiple-file UI boundary explicitly observed',{'multiple':multiple,'two_file_attempt_refused':True,'documents_unchanged':len(s.json(root)['documents'])==19})
            for name,blob,expected in [('Bologna-BOM.txt',b'\xef\xbb\xbf'+source.encode(),source),('Bologna-CRLF.txt',source.replace('\n','\r\n').encode(),source.replace('\n','\r\n'))]:
                page.locator('[data-action="import"]').first.click();page.locator('#import-file').set_input_files({'name':name,'mimeType':'text/plain','buffer':blob});page.locator('[data-action="save-document"]').click();expect(page.locator('#dialog')).not_to_be_visible();saved=s.json(root)['documents'][-1];assert saved['text']==expected;check(name+' browser import preserves decoded source',{'characters':len(expected),'text_sha256':saved['sha256']})
            # OOXML test fixture contains exactly public Bologna text, without rendered artifact delivery.
            W='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}';document=ET.Element(W+'document');body=ET.SubElement(document,W+'body')
            for line in source.split('\n'):ET.SubElement(ET.SubElement(ET.SubElement(body,W+'p'),W+'r'),W+'t').text=line
            payload=io.BytesIO()
            with zipfile.ZipFile(payload,'w',zipfile.ZIP_DEFLATED) as z:z.writestr('word/document.xml',ET.tostring(document))
            page.locator('[data-action="import"]').first.click();page.locator('#import-file').set_input_files({'name':'Bologna-native.docx','mimeType':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','buffer':payload.getvalue()});page.locator('[data-action="save-document"]').click();expect(page.locator('#dialog')).not_to_be_visible();assert s.json(root)['documents'][-1]['text']==source;check('DOCX source-only import preserves public text',{'text_equal':True,'not_a_layout_preservation_claim':True})
            for name,blob in [('Bologna-invalid-utf8.txt',b'\xff'+source[:200].encode()),('Bologna-unsupported.pdf',b'%PDF-1.4\n'),('Bologna-over-8MB.txt',(source.encode()*500)[:8000001])]:
                before=s.json(root);page.locator('[data-action="import"]').first.click();page.locator('#import-file').set_input_files({'name':name,'mimeType':'application/octet-stream','buffer':blob});page.locator('[data-action="save-document"]').click();expect(page.locator('#modal-error')).not_to_be_empty();assert s.json(root)==before;page.screenshot(path=str(out/(name.replace('.','-')+'.png')));check(name+' browser refusal preserves project',{'message':page.locator('#modal-error').inner_text(),'no_change':True});page.locator('[data-action="close"]').first.click()
            assert s.json('/projects/'+project['id'])==project
            c.close();browser.close()
        assert not any(result[k] for k in ['console','HTTP','outside']);result['completed']=True;result['unchanged_recovered_project']=True;dump(out/'results.json',result);print(json.dumps({'checks':len(result['checks']),'console':len(result['console']),'HTTP':len(result['HTTP']),'outside':len(result['outside']),'findings':result['findings']}))
    finally:s.stop()
if __name__=='__main__':main()
