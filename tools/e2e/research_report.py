"""Project-only report authoring acceptance on disposable Bologna copies."""
import argparse
import json
import traceback
import zipfile
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET
from playwright.sync_api import sync_playwright, expect


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--url',required=True);parser.add_argument('--out',required=True);args=parser.parse_args()
    base=args.url.rstrip('/');assert urlsplit(base).hostname in ('127.0.0.1','localhost')
    out=Path(args.out).resolve();shots=out/'screenshots';shots.mkdir(parents=True,exist_ok=True)
    results={'checks':[],'console':[],'http':[],'outside':[]};contexts=[]
    with sync_playwright() as pw:
        browser=pw.chromium.launch(channel='chrome',headless=True);client=browser.new_context()
        token=client.request.get(base+'/w/api/bootstrap').json()['token'];headers={'X-QualiCraft-Token':token}
        def get(url):
            r=client.request.get(url,headers=headers);assert r.ok,(r.status,r.text());return r.json()
        def post(url,data):
            r=client.request.post(url,data=data,headers=headers);assert r.ok,(r.status,r.text());return r.json()
        original_url=base+'/w/api/projects/a71a0b538c024c3ab23fb4286cfe93e2';original=get(original_url)
        copy=post(base+'/w/api/projects',{'kind':'restore','project':{**original,'name':'Bologna · editable report review'}})
        root=base+'/w/api/projects/'+copy['id'];a=copy['annotations'][0]
        def page(width=1440):
            c=browser.new_context(viewport={'width':width,'height':1000 if width>700 else 844},is_mobile=width==390,has_touch=width==390);contexts.append(c)
            c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') or r.request.url.startswith(out.as_uri()+'/') else (results['outside'].append(r.request.url),r.abort()))
            p=c.new_page();p.set_default_timeout(12000)
            p.on('pageerror',lambda e:results['console'].append(str(e)));p.on('console',lambda m:results['console'].append(m.text) if m.type=='error' else None);p.on('response',lambda r:results['http'].append([r.status,r.url]) if r.status>=400 else None)
            p.goto(base+'/w/?lang=en',wait_until='networkidle');p.locator('#start-project-select').select_option(copy['id']);p.locator('[data-action="start-open"]').click();expect(p.locator('#reading-document')).to_be_visible();return p
        def opened(p):p.locator('[data-action="export"]').click();p.locator('[data-action="write-report"]').click();expect(p.locator('#report-save-state')).to_be_visible()
        def tab(p,name):p.locator('[data-report-tab="'+name+'"]').click()
        def field(p,key,value):p.locator('[data-report-field="'+key+'"]').fill(value)
        def save(p,revision):p.locator('[data-report-action="save"]').click();expect(p.locator('#report-save-state')).to_have_text('Saved locally · version '+str(revision))
        def check(name,fn):
            try:detail=fn();results['checks'].append({'name':name,'pass':True,'detail':detail});print('PASS '+name,flush=True)
            except Exception as e:results['checks'].append({'name':name,'pass':False,'error':str(e),'traceback':traceback.format_exc()});print('FAIL '+name+': '+str(e),flush=True)
            (out/'results.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
        p=page();opened(p)
        def setup():
            field(p,'title','Bologna coding evidence review');field(p,'research_question','How does this saved Bologna passage describe research materials?')
            field(p,'case_unit','This is a technical review of one public transcript, not an independent participant study.')
            field(p,'analysis_unit','A saved quotation–code link with its surrounding source document.')
            field(p,'approach','Qualitative content analysis with researcher-reviewed categories.')
            field(p,'method_notes','This acceptance sample uses previously coded CC0 Bologna material. It does not claim a new content analysis.')
            p.locator('[data-report-check="units"]').check();p.screenshot(path=str(shots/'01-desktop-method.png'))
            assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
            return {'explicit_writing':True,'method_review_manual':True}
        check('desktop method setup and manual review remain distinct from coding',setup)
        def methods():
            p.locator('#report-method').select_option('ta')
            expect(p.locator('[data-report-check="reflexivity"]')).not_to_be_checked()
            expect(p.locator('[data-report-field="research_question"]')).to_have_value('How does this saved Bologna passage describe research materials?')
            p.locator('[data-report-check="theme-review"]').check()
            p.locator('#report-method').select_option('content')
            expect(p.locator('[data-report-check="units"]')).not_to_be_checked()
            p.locator('[data-report-check="units"]').check()
            return {'method_specific_review':True,'writing_retained':True,'confirmation_reset':True}
        check('TA and content analysis use distinct review states while retaining writing',methods)
        def table():
            tab(p,'table');p.locator('#report-add-code').select_option(a['code_id']);p.locator('#report-start-labels').check();p.locator('[data-report-action="add"]').click()
            p.locator('[data-report-cell="theme"]').fill('Research materials');p.locator('[data-report-cell="category"]').fill('Document forms')
            p.locator('[data-report-cell="interpretation"]').fill('The saved code identifies a material form in this passage. This is an illustrative report row.')
            p.screenshot(path=str(shots/'02-desktop-table-editor.png'))
            p.locator('[data-report-action="row-evidence"]').click();p.locator('[data-report-evidence="'+a['id']+'"]').check()
            p.locator('[data-report-action="insert-reference"][data-evidence="'+a['id']+'"]').click()
            expect(p.locator('[data-report-field="narrative"]')).to_contain_text('[E:'+a['id']+']')
            field(p,'narrative','This public Bologna example links a saved material code to a precisely located quotation. The interpretation is limited to this selected evidence; the coding frequency does not measure importance. [E:'+a['id']+']')
            field(p,'reflexivity','These labels were entered for a software acceptance sample; they are not claims of independent research findings.')
            field(p,'quality_notes','The quotation, saved code ID, document SHA and exact range were checked.')
            field(p,'counterexamples','No cross-case claim is made. Broader variation requires deliberate review of other transcripts.')
            field(p,'limitations','A one-row acceptance example does not establish completeness, saturation or method validity.')
            field(p,'disclosure','An assistant entered this acceptance sample. The software did not infer the interpretation or send model requests.')
            locked=[]
            def inspect_pending(route):
                locked.append(p.locator('[data-report-field="narrative"]').is_disabled())
                route.continue_()
            p.route('**/report-save',inspect_pending);p.keyboard.press('Control+s')
            expect(p.locator('#report-save-state')).to_have_text('Saved locally · version 1');p.unroute('**/report-save',inspect_pending)
            assert locked==[True], 'Writing must be locked during the pending save'
            entry=get(root+'/report')['state']['current'];results['version1']=entry
            assert entry['bindings']['evidence'][a['id']]['quote']==a['quote']
            current=get(root);assert current['codes']==copy['codes'] and current['annotations']==copy['annotations'] and current['documents']==copy['documents']
            return {'saved_rows':1,'quote_matches':True,'codebook_and_source_unchanged':True}
        check('editable analysis row, selected original quotation and narrative save together',table)
        def reload_versions():
            p.locator('[data-action="close"]').click();p.reload(wait_until='networkidle');expect(p.locator('#reading-document')).to_be_visible();opened(p);tab(p,'narrative')
            expect(p.locator('[data-report-field="narrative"]')).to_have_value(results['version1']['draft']['narrative'])
            field(p,'narrative','Second saved researcher draft.');save(p,2);tab(p,'versions');p.locator('#report-history').select_option(results['version1']['id'])
            expect(p.locator('#report-comparison')).to_contain_text('narrative');p.screenshot(path=str(shots/'03-desktop-version-compare.png'))
            locked=[]
            def inspect_restore(route):
                locked.append(p.locator('[data-report-tab="narrative"]').is_disabled());route.continue_()
            p.route('**/report-restore',inspect_restore)
            p.locator('[data-report-action="restore"]').click();expect(p.locator('#report-save-state')).to_have_text('Saved locally · version 3');p.unroute('**/report-restore',inspect_restore)
            assert locked==[True], 'Restoring must lock navigation until the saved version is loaded'
            report=get(root+'/report')['state'];assert report['current']['draft']==results['version1']['draft'] and len(report['history'])==2
            return {'refresh_keeps_writing':True,'restored_as_new_version':3,'old_versions_retained':2}
        check('refresh, compare and restore preserve the current and historical writing',reload_versions)
        def stale():
            p.locator('[data-action="close"]').click();post(root+'/code-update',{'id':copy['codes'][0]['id'],'changes':{'name':copy['codes'][0]['name']+' review copy'}})
            opened(p);expect(p.locator('.notice').first).to_contain_text('Coding evidence changed')
            tab(p,'narrative');field(p,'narrative',results['version1']['draft']['narrative']+' This sentence was revised after the codebook change.');save(p,4)
            state=get(root+'/report');assert state['stale'] and state['state']['current']['bindings']==results['version1']['bindings']
            p.screenshot(path=str(shots/'04-desktop-stale-evidence.png'));p.locator('[data-report-action="refresh"]').click();expect(p.locator('#report-save-state')).to_have_text('Saved locally · version 5')
            assert not get(root+'/report')['stale'];return {'stale_writing_preserves_frozen_quotes':True,'explicit_refresh':True}
        check('writing can continue against frozen evidence until an explicit refresh',stale)
        def download():
            tab(p,'preview');expect(p.frame_locator('#report-preview').get_by_role('heading',name='Bologna coding evidence review',exact=True)).to_be_visible()
            p.screenshot(path=str(shots/'05-desktop-report-preview.png'));files={}
            for fmt in ['html','docx','json']:
                with p.expect_download() as ev:p.locator('[data-report-action="download"][data-format="'+fmt+'"]').press('Enter')
                dl=ev.value;target=out/('research-report.'+fmt);dl.save_as(target);files[fmt]=target
                expect(p.locator('#report-download-status')).to_contain_text(dl.suggested_filename)
            data=json.loads(files['json'].read_text());assert data==get(root+'/report')['state']['current']
            with zipfile.ZipFile(files['docx']) as z:
                assert json.loads(ET.fromstring(z.read('customXml/item1.xml')).text)==data
                assert b'<w:drawing' not in z.read('word/document.xml')
            html=files['html'].read_text();assert 'Narrative Analysis' in html and 'Research materials' in html
            return {'formats':3,'frozen_versions_equal':True,'download_receipt':True}
        check('HTML, editable Word and report JSON agree with the saved version',download)
        def phone():
            q=page(390);opened(q);tab(q,'narrative');field(q,'narrative','Phone-edited acceptance narrative. [E:'+a['id']+']');save(q,6)
            q.locator('[data-action="close"]').tap();q.reload(wait_until='networkidle');opened(q);tab(q,'narrative');expect(q.locator('[data-report-field="narrative"]')).to_have_value('Phone-edited acceptance narrative. [E:'+a['id']+']')
            q.screenshot(path=str(shots/'06-phone-writing.png'));assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
            tabs=q.locator('[role="tab"]');tabs.first.focus();tabs.first.press('End');expect(tabs.last).to_be_focused()
            expect(q.frame_locator('#report-preview').get_by_role('heading',name='Bologna coding evidence review',exact=True)).to_be_visible()
            q.screenshot(path=str(shots/'07-phone-preview.png'))
            with q.expect_download() as ev:q.locator('[data-report-action="download"][data-format="docx"]').tap()
            ev.value.save_as(out/'phone-report.docx');expect(q.locator('#report-download-status')).to_contain_text('.docx')
            q.locator('[data-action="close"]').tap();return {'touch_edit_save_refresh':True,'touch_Word_download':True,'keyboard_tab_navigation':True,'physical_phone':'not tested; Chrome emulation'}
        check('phone touch saves and restores writing with keyboard-accessible sections',phone)
        def pagination_and_discard():
            p.locator('[data-action="close"]').click();opened(p);tab(p,'table');p.locator('[data-report-action="add-coded"]').click()
            assert p.locator('.report-row').count()==10;p.locator('[data-report-action="next"]').click();assert p.locator('.report-row').count()==10
            p.locator('[data-action="close"]').click();expect(p.locator('#report-discard')).to_be_visible();expect(p.locator('#dialog')).to_be_visible()
            p.locator('[data-report-action="discard"]').click();expect(p.locator('#dialog')).not_to_be_visible();assert len(get(root+'/report')['state']['current']['draft']['rows'])==1
            return {'paginated_rows':True,'unsaved_close_guard':True,'discard_does_not_write':True}
        check('large codebooks paginate and unsaved writing requires explicit discard',pagination_and_discard)
        def source_jump():
            opened(p);tab(p,'evidence');p.locator('[data-report-action="locate-source"][data-evidence="'+a['id']+'"]').click()
            expect(p.locator('#dialog')).not_to_be_visible()
            mark=p.locator('mark[data-coding-ids]').filter(has_text=a['quote'][:20]).first
            expect(mark).to_be_focused();p.screenshot(path=str(shots/'08-report-source-jump.png'))
            return {'verified_source_range_focused':True}
        check('saved report evidence locates the verified original coding range',source_jump)
        def preview_race():
            opened(p);pending=[]
            p.route('**/export?format=report-html*',lambda route:pending.append(route))
            tab(p,'preview');p.wait_for_timeout(100);assert len(pending)==1
            tab(p,'narrative');tab(p,'preview');p.wait_for_timeout(100);assert len(pending)==2
            pending[1].fulfill(status=200,content_type='text/html',body='<h1>Current preview</h1>')
            expect(p.frame_locator('#report-preview').get_by_role('heading',name='Current preview')).to_be_visible()
            pending[0].fulfill(status=200,content_type='text/html',body='<h1>Old detached preview</h1>')
            p.wait_for_timeout(100)
            expect(p.frame_locator('#report-preview').get_by_role('heading',name='Current preview')).to_be_visible()
            p.unroute('**/export?format=report-html*');p.locator('[data-action="close"]').click()
            return {'detached_async_preview_cannot_replace_current':True}
        check('late preview responses cannot overwrite a newly opened preview',preview_race)
        def project_recovery():
            saved=get(root);restored=post(base+'/w/api/projects',{'kind':'restore','project':saved});context=get(base+'/w/api/projects/'+restored['id']+'/report')
            assert not context['stale'] and context['state']==saved['research_report'];assert get(original_url)==original
            return {'project_JSON_report_recovered':True,'original_unchanged':True,'restored_as_separate_project':True}
        check('project JSON restores the report and versions without stale identity or source loss',project_recovery)
        results['original_unchanged']=get(original_url)==original;results['copy_id']=copy['id']
        results['pass']=all(c['pass'] for c in results['checks']) and not any(results[k] for k in ['console','http','outside'])
        (out/'results.json').write_text(json.dumps(results,indent=2));print(json.dumps({'pass':results['pass'],'passed':sum(c['pass'] for c in results['checks']),'total':len(results['checks']),'console':len(results['console']),'http':len(results['http']),'outside':len(results['outside'])}))
        browser.close()
    return 0 if results['pass'] else 1


if __name__=='__main__':raise SystemExit(main())
