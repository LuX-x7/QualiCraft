"""Explicit research-role acceptance; project-only public Bologna copies."""
import argparse,json,traceback,zipfile,io,hashlib
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET
from playwright.sync_api import sync_playwright,expect


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--url',required=True);parser.add_argument('--out',required=True);args=parser.parse_args()
    base=args.url.rstrip('/');assert urlsplit(base).hostname in ('127.0.0.1','localhost')
    out=Path(args.out);shots=out/'screenshots';shots.mkdir(parents=True,exist_ok=True)
    result={'checks':[],'console':[],'http':[],'outside':[]};contexts=[]
    with sync_playwright() as pw:
        browser=pw.chromium.launch(channel='chrome',headless=True);client=browser.new_context();token=client.request.get(base+'/w/api/bootstrap').json()['token'];headers={'X-QualiCraft-Token':token}
        def get(path):
            r=client.request.get(base+'/w/api/projects/'+path,headers=headers);assert r.ok,(r.status,r.text());return r.json()
        def post(path,data):
            r=client.request.post(base+'/w/api/projects/'+path,data=data,headers=headers);assert r.ok,(r.status,r.text());return r.json()
        def export(pid,fmt):
            r=client.request.get(base+'/w/api/projects/'+pid+'/export?format='+fmt,headers=headers);assert r.ok;return r.body()
        original=get('a71a0b538c024c3ab23fb4286cfe93e2');p0=post('',{'kind':'restore','project':{**original,'name':'Bologna · explicit research roles'}});pid=p0['id'];a=p0['annotations'][0];by={c['id']:c for c in p0['codes']};path=[];n=by[a['code_id']]
        while n:path.insert(0,n);n=by.get(n.get('parent_id'))
        assert len(path)==3
        result['project_id']=pid
        baseline={fmt:export(pid,fmt) for fmt in ['csv','matrix']}
        def page(width=1440,lang='en'):
            c=browser.new_context(viewport={'width':width,'height':1000 if width>700 else 844},is_mobile=width==390,has_touch=width==390);contexts.append(c)
            c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else (result['outside'].append(r.request.url),r.abort()))
            p=c.new_page();p.set_default_timeout(30000);p.on('pageerror',lambda e:result['console'].append(str(e)));p.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None);p.on('response',lambda r:result['http'].append([r.status,r.url]) if r.status>=400 else None)
            p.goto(base+'/w/?lang='+lang,wait_until='domcontentloaded');p.locator('#start-project-select').select_option(pid)
            with p.expect_response(lambda r:r.url==base+'/w/api/projects/'+pid and r.request.method=='GET'):p.locator('[data-action="start-open"]').click()
            expect(p.locator('#reading-document')).to_be_visible(timeout=30000);return p
        def check(name,fn):
            try:detail=fn();result['checks'].append({'name':name,'pass':True,'detail':detail});print('PASS '+name,flush=True)
            except Exception as e:result['checks'].append({'name':name,'pass':False,'error':str(e),'traceback':traceback.format_exc()});print('FAIL '+name+': '+str(e),flush=True)
            (out/'results.json').write_text(json.dumps(result,indent=2))
        p=page()
        def edit(q,id,role,phone=False):
            if phone:q.locator('[data-action="coding-codebook"]').tap();q.locator('#mobile-code-filter').fill(by[id]['name']);host='#mobile-codebook-list'
            else:
                if not q.locator('#side-filter').is_visible():q.locator('[data-action="toggle-codebook"]').click()
                q.locator('#side-filter').fill(by[id]['name']);host='#side-list'
            q.locator(host+' [data-action="code-edit"][data-id="'+id+'"]').press('Enter') if not phone else q.locator(host+' [data-action="code-edit"][data-id="'+id+'"]').tap()
            q.locator('#ec-role').select_option(role);q.locator('[data-action="code-save"]').press('Enter') if not phone else q.locator('[data-action="code-save"]').tap();expect(q.locator('#dialog')).not_to_be_visible()
            q.wait_for_function("([id,role])=>state.project.codes.find(c=>c.id===id)?.research_role===(role||undefined)",arg=[id,role])
        def desktop():
            for c,role in zip(path,['theme','category','code']):edit(p,c['id'],role)
            current=get(pid);assert current['annotations']==p0['annotations'] and current['documents']==p0['documents']
            for old,new in zip(p0['codes'],current['codes']):assert {k:v for k,v in new.items() if k!='research_role'}==old
            p.locator('#side-filter').fill('')
            if p.locator('[data-action="toggle-codebook"]').get_attribute('aria-expanded')!='true':p.locator('[data-action="toggle-codebook"]').click()
            p.locator('#side-list [data-code-node="'+path[1]['id']+'"] > .code-row .side-item').hover()
            expect(p.locator('#side-list [data-code-node="'+path[1]['id']+'"] > .code-row .code-role')).to_have_text('Category')
            p.locator('#side-list [data-code-node="'+path[1]['id']+'"] > .code-row .code-role').scroll_into_view_if_needed();p.screenshot(path=str(shots/'01-desktop-saved-roles.png'))
            return {'explicit_roles':['theme','category','code'],'original_annotations_and_text_equal':True,'hover':True}
        check('desktop keyboard saves explicit roles while ancestry, source and codings stay exact',desktop)
        def downloads():
            p.locator('[data-action="export"]').click();p.locator('#coded-scope').select_option('current')
            for fmt in ['coded-html','coded-docx']:
                with p.expect_download() as event:p.locator('[data-action="download-coded"][data-format="'+fmt+'"]').press('Enter')
                download=event.value;target=out/download.suggested_filename;download.save_as(target)
                if fmt=='coded-html':
                    html=target.read_text();assert 'Saved researcher roles take precedence' in html
                    for role in ['Theme','Category','Code']:assert 'data-role="'+role+'"' in html
                else:
                    with zipfile.ZipFile(target) as z:frozen=json.loads(ET.fromstring(z.read('customXml/item1.xml')).text)
                    chosen=next(x for x in frozen['documents'][0]['annotations'] if x['id']==a['id']);assert [n['research_role'] for n in chosen['path']]==['theme','category','code']
            p.screenshot(path=str(shots/'02-desktop-export-saved-roles.png'));p.locator('[data-action="close"]').first.click()
            return {'HTML_and_native_Word_download':True,'roles_and_full_ID_path_exact':True}
        check('actual HTML and Word downloads retain explicitly saved role paths',downloads)
        def writing():
            p.locator('[data-action="export"]').click();p.locator('[data-action="write-report"]').click();p.locator('[data-report-tab="table"]').click();p.locator('#report-start-labels').check();p.locator('#report-add-code').select_option(a['code_id']);p.locator('[data-report-action="add"]').click()
            expect(p.locator('[data-report-cell="theme"]')).to_have_value(path[0]['name']);expect(p.locator('[data-report-cell="category"]')).to_have_value(path[1]['name']);p.locator('[data-report-action="save"]').click();expect(p.locator('#report-save-state')).to_have_text('Saved locally · version 1');p.screenshot(path=str(shots/'03-report-starting-roles.png'));p.locator('[data-action="close"]').first.click()
            return {'starting_labels_from_saved_roles':True,'report_version':1}
        check('research report starting labels use explicit roles and remain editable',writing)
        def phone():
            q=page(390);edit(q,path[-1]['id'],'category',True)
            assert next(c for c in get(pid)['codes'] if c['id']==path[-1]['id'])['research_role']=='category'
            q.reload(wait_until='domcontentloaded');expect(q.locator('#reading-document')).to_be_visible(timeout=30000);q.locator('[data-action="coding-codebook"]').tap();q.locator('#mobile-code-filter').fill(path[-1]['name']);expect(q.locator('#mobile-codebook-list [data-code-node="'+path[-1]['id']+'"] .code-role')).to_have_text('Category');q.screenshot(path=str(shots/'04-phone-role-reload.png'))
            assert q.evaluate('document.documentElement.scrollWidth<=innerWidth');q.locator('#mobile-codebook-list [data-action="code-edit"][data-id="'+path[-1]['id']+'"]').tap();q.locator('#ec-role').select_option('');q.screenshot(path=str(shots/'05-phone-role-editor.png'));q.locator('[data-action="code-save"]').tap();expect(q.locator('#dialog')).not_to_be_visible();assert 'research_role' not in next(c for c in get(pid)['codes'] if c['id']==path[-1]['id'])
            return {'touch_save_clear_reload':True,'no_horizontal_overflow':True,'physical_phone':'not tested; Chrome emulation'}
        check('phone touch edits, clears and retains roles through refresh',phone)
        def stale():
            p.reload(wait_until='domcontentloaded');expect(p.locator('#reading-document')).to_be_visible(timeout=30000);p.locator('[data-action="export"]').click();p.locator('[data-action="write-report"]').click();expect(p.locator('#dialog .notice:visible').first).to_contain_text('Coding evidence changed');p.screenshot(path=str(shots/'06-role-change-stale-report.png'));p.locator('[data-action="close"]').first.click()
            for fmt,body in baseline.items():assert export(pid,fmt)==body
            current=get(pid);assert current['documents']==p0['documents'] and current['annotations']==p0['annotations']
            restored=post('',{'kind':'restore','project':json.loads(export(pid,'json'))});assert restored['codes']==current['codes'];assert restored['research_report']==current['research_report']
            return {'stale_report':True,'frozen_report_retained':True,'count_CSV_and_matrix_bytes_equal':True,'project_JSON_restore_exact':True}
        check('role edits flag stale reports and preserve count CSVs, matrices and restored roles',stale)
        def create():
            q=page(1440,'zh');q.locator('[data-action="code"]').first.click();q.locator('#code-name').fill('Bologna role creation check');q.locator('#code-role').select_option('category');q.screenshot(path=str(shots/'07-create-role-zh.png'));q.locator('[data-action="save-code"]').press('Enter');expect(q.locator('#dialog')).not_to_be_visible();assert next(c for c in get(pid)['codes'] if c['name']=='Bologna role creation check')['research_role']=='category'
            return {'native_create_role_saved':True,'language_independent_endpoint':True}
        check('new-code role selection saves through the same stable API in Chinese UI',create)
        assert get(original['id'])==original;result['original_unchanged']=True;result['project_id']=pid
        (out/'results.json').write_text(json.dumps(result,indent=2))
        for c in contexts:c.close()
        client.close();browser.close();assert not result['console'] and not result['http'] and not result['outside'],result
    total=len(result['checks']);passed=sum(c['pass'] for c in result['checks']);print(json.dumps({'passed':passed,'total':total,'console':len(result['console']),'http':len(result['http']),'outside':len(result['outside'])}));return 0 if total==passed else 1

if __name__=='__main__':raise SystemExit(main())
