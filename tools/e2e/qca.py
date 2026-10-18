"""Comparative QCA acceptance: project-only Chrome and disposable public Bologna."""
import argparse,copy,io,json,traceback,zipfile
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright,expect


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--url',required=True);parser.add_argument('--out',required=True);args=parser.parse_args();base=args.url.rstrip('/');assert urlsplit(base).hostname in ('127.0.0.1','localhost');out=Path(args.out).resolve();shots=out/'screenshots';shots.mkdir(parents=True,exist_ok=True)
    result={'checks':[],'console':[],'http':[],'outside':[],'expected_http':[]}
    with sync_playwright() as pw:
        browser=pw.chromium.launch(channel='chrome',headless=True);client=browser.new_context();token=client.request.get(base+'/w/api/bootstrap').json()['token'];headers={'X-QualiCraft-Token':token}
        def get(path):
            response=client.request.get(base+'/w/api'+path,headers=headers);assert response.ok,(response.status,response.text());return response.json()
        def post(path,body):
            response=client.request.post(base+'/w/api'+path,data=body,headers=headers,timeout=120000);assert response.ok,(response.status,response.text());return response.json()
        seed=get('/projects/a71a0b538c024c3ab23fb4286cfe93e2');project=post('/projects',{'kind':'restore','project':{**seed,'name':'Bologna · QCA workflow acceptance'}});root='/projects/'+project['id'];result['project_id']=project['id']
        def persist(): (out/'results.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
        def check(name,fn):
            try:detail=fn();result['checks'].append({'name':name,'pass':True,'detail':detail});print('PASS '+name,flush=True)
            except Exception as e:result['checks'].append({'name':name,'pass':False,'error':str(e),'traceback':traceback.format_exc()});persist();raise
            persist()
        def page(width):
            context=browser.new_context(viewport={'width':width,'height':1000 if width>700 else 844},is_mobile=width==390,has_touch=width==390)
            context.route('**/*',lambda route:route.continue_() if route.request.url.startswith(base+'/') or route.request.url.startswith(out.as_uri()+'/') else (result['outside'].append(route.request.url),route.abort()))
            p=context.new_page();p.set_default_timeout(30000);p.on('pageerror',lambda e:result['console'].append(str(e)));p.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None)
            def response(r):
                if r.status>=400:(result['expected_http'] if r.status==400 and r.url.endswith('/qca-run') else result['http']).append([r.status,r.url])
            p.on('response',response);p.goto(base+'/w/?lang=en',wait_until='domcontentloaded');p.locator('#start-project-select').select_option(project['id']);p.locator('[data-action="start-open"]').click();expect(p.locator('#reading-document')).to_be_visible();return p
        def open_qca(p):p.locator('[data-action="view"][data-view="insights"]').click();p.locator('[data-action="open-qca"]').click();expect(p.locator('#qca-save-state')).to_be_visible()
        def tab(p,id):p.locator('[data-qca-tab="'+id+'"]').click()
        def save(p):
            revision=get(root+'/qca')['state']['revision'] if get(root+'/qca')['state'] else 0
            p.locator('[data-qca-action="save"]').press('Enter');expect(p.locator('#qca-save-state')).to_have_text('Saved locally · revision '+str(revision+1))
        def run(p):
            before=get(root+'/qca')['state']['revision'];p.locator('[data-qca-action="run"]').press('Enter');expect(p.locator('#qca-save-state')).to_have_text('Saved locally · revision '+str(before+1));expect(p.locator('#qca-panel')).to_contain_text('Configuration solutions')
        p=page(1440);open_qca(p)
        def setup():
            p.locator('[data-qca-design="question"]').fill('Technical validation of explicitly calibrated public Bologna case records')
            p.locator('[data-qca-design="case_unit"]').fill('Two distinct public transcript records used only for software acceptance, not causal research findings')
            p.locator('[data-qca-action="add-set"]').press('Enter')
            for id in ['A','B','Y']:
                values={'label':{'A':'Technical set A','B':'Technical set B','Y':'Technical outcome Y'}[id],'definition':'An explicit binary designation for the acceptance workflow; not an empirical causal claim','zero_rule':'Outside this technical test set, explicitly designated 0','one_rule':'Inside this technical test set, explicitly designated 1','basis':'Researcher test designation only; original coding is retained as inspectable context'}
                for key,value in values.items():p.locator('[data-qca-set="'+id+'"][data-key="'+key+'"]').fill(value)
            tab(p,'cases')
            for i,d in enumerate(project['documents'][:2]):
                p.locator('[data-qca-action="add-case"]').press('Enter');p.locator('#qca-case-label').fill('Bologna technical case '+str(i+1));p.locator('#qca-case-docs').select_option([d['id']])
            tab(p,'calibration');ids=p.locator('#qca-case-select option').evaluate_all('(items)=>items.map(o=>o.value)');result['case_ids']=ids
            for i,id in enumerate(ids):
                p.locator('#qca-case-select').select_option(id)
                for name,value in zip(['A','B','Y'],[(1,0,1),(0,1,0)][i]):
                    p.locator('[data-qca-value="'+name+'"]').select_option(str(value));p.locator('[data-qca-rationale="'+name+'"]').fill('Explicit technical membership '+str(value)+' for workflow acceptance; not inferred from code frequency')
                if i==0:
                    p.locator('[data-qca-action="evidence"][data-set="A"]').click();p.locator('[data-qca-evidence]').first.check()
            save(p);state=get(root+'/qca')['state'];assert len(state['design']['conditions'])==2 and len(state['design']['cases'])==2 and state['current'] is None
            assert state['design']['cases'][0]['cells']['A']['evidence_ids'];assert get(root)['annotations']==project['annotations']
            p.screenshot(path=str(shots/'01-desktop-calibration.png'));return {'cases':2,'conditions':2,'exact_selected_evidence':True,'keyboard_save':True}
        check('desktop defines cases sets explicit memberships and exact evidence without changing coding',setup)
        def first_run():
            run(p);state=get(root+'/qca')['state'];result['first_run']=state['current'];assert len(state['current']['result']['truth_table'])==4;assert state['current']['result']['solutions'][0]['terms']==['10']
            expect(p.locator('.qca-solution')).to_contain_text('A*~B');p.locator('.qca-solution').hover();p.screenshot(path=str(shots/'02-desktop-configurations.png'))
            p.locator('[data-qca-action="inspect"]').first.click();expect(p.locator('#qca-inspected')).to_contain_text('Frozen case');p.screenshot(path=str(shots/'03-frozen-case-evidence.png'));return {'complete_configurations':4,'conservative_solution':'A*~B','all_minimal':True,'frozen_case_inspection':True}
        check('desktop run shows complete truth table conservative configuration and frozen case evidence',first_run)
        def exports():
            tab(p,'versions')
            for fmt in ['zip','json']:
                with p.expect_download() as download:p.locator('[data-qca-action="download"][data-format="'+fmt+'"]').press('Enter')
                download.value.save_as(out/('qca-first.'+fmt));expect(p.locator('#qca-download-status')).to_contain_text(download.value.suggested_filename)
            record=json.loads((out/'qca-first.json').read_text(encoding='utf-8'));assert record==result['first_run']
            with zipfile.ZipFile(out/'qca-first.zip') as z:assert json.loads(z.read('qca-run.json'))==record;assert 'qca_engine.py' in z.namelist()
            p.screenshot(path=str(shots/'04-QCA-download-status.png'));return {'ZIP_and_JSON_equal_frozen_run':True,'native_download_status':True}
        check('QCA ZIP and JSON downloads retain calibrated identities definitions thresholds and code',exports)
        def report():
            p.locator('[data-qca-action="report"]').click();expect(p.locator('#report-method')).to_have_value('comparative');p.locator('[data-report-field="title"]').fill('Bologna Comparative QCA workflow review')
            p.locator('[data-report-tab="narrative"]').click();p.locator('[data-report-field="narrative"]').fill('This technical example demonstrates the calibrated case workflow and frozen configuration output. The binary assignments are acceptance designations, not independent research findings or causal conclusions.')
            p.locator('[data-report-field="limitations"]').fill('Two public records and test-designated memberships only. This sample does not establish a substantive QCA research finding.')
            p.locator('[data-report-tab="evidence"]').click();p.locator('[data-report-action="insert-reference"]').first.click();p.locator('[data-report-action="save"]').press('Enter');expect(p.locator('#report-save-state')).to_have_text('Saved locally · version 1')
            p.locator('[data-report-tab="table"]').click();expect(p.locator('#report-panel')).to_contain_text('Configuration solutions');assert p.locator('[data-report-action="add"]').count()==0
            p.screenshot(path=str(shots/'05-report-QCA-results.png'));p.locator('[data-report-tab="preview"]').click();expect(p.frame_locator('#report-preview').get_by_role('heading',name='Configuration solutions',exact=True)).to_be_visible()
            for fmt in ['html','docx','json','zip']:
                with p.expect_download() as download:p.locator('[data-report-action="download"][data-format="'+fmt+'"]').press('Enter')
                download.value.save_as(out/('qca-report.'+fmt))
            with zipfile.ZipFile(out/'qca-report.zip') as z:assert json.loads(z.read('qca/qca-run.json'))==result['first_run']
            p.screenshot(path=str(shots/'06-QCA-report-preview.png'));return {'method_specific_report':True,'read_only_calculations':True,'researcher_narrative':True,'four_downloads':True,'QCA_reproduction_in_report_ZIP':True}
        check('report binds frozen QCA results evidence researcher writing and reproducible files',report)
        def phone():
            q=page(390);open_qca(q);tab(q,'calibration');q.locator('#qca-case-select').select_option(result['case_ids'][1]);q.locator('[data-qca-value="A"]').select_option('');save(q)
            before=get(root);backups=get(root+'/backups');q.locator('[data-qca-action="run"]').tap();expect(q.locator('#modal-error')).to_contain_text('missing');assert get(root)==before and get(root+'/backups')==backups
            tab(q,'results');expect(q.locator('.notice:visible')).to_contain_text('older');assert get(root+'/qca')['state']['current']==result['first_run'];q.screenshot(path=str(shots/'07-phone-stale-frozen-result.png'))
            tab(q,'calibration');q.locator('[data-qca-value="A"]').select_option('0');q.locator('[data-qca-rationale="A"]').fill('Phone-confirmed technical membership zero; saved source coding is unchanged');save(q);run(q)
            table=q.get_by_role('region',name='Complete QCA truth table');table.focus();expect(table).to_be_focused();table.press('ArrowRight');q.wait_for_timeout(200);assert table.evaluate('(el)=>el.scrollLeft')>0;assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
            q.screenshot(path=str(shots/'08-phone-truth-table.png'));assert len(get(root+'/qca')['state']['history'])==1
            q.locator('[data-action="close"]').tap();q.reload(wait_until='domcontentloaded');expect(q.locator('#reading-document')).to_be_visible();open_qca(q);tab(q,'calibration');q.locator('#qca-case-select').select_option(result['case_ids'][1]);expect(q.locator('[data-qca-rationale="A"]')).to_have_value('Phone-confirmed technical membership zero; saved source coding is unchanged')
            tabs=q.get_by_role('tab');tabs.first.focus();tabs.first.press('End');expect(tabs.last).to_be_focused()
            with q.expect_download() as download:q.locator('[data-qca-action="download"][data-format="zip"]').tap()
            download.value.save_as(out/'phone-qca.zip');q.screenshot(path=str(shots/'09-phone-download.png'));q.locator('[data-action="close"]').tap();return {'physical_phone':False,'Chrome_touch':True,'missing_rejected_atomically':True,'old_result_retained':True,'refresh_retained_calibration':True,'keyboard_tabs_and_table':True,'touch_download':True}
        check('phone touch missing guard frozen results revision history refresh keyboard and download',phone)
        def report_refresh():
            p.locator('[data-action="close"]').click();p.locator('[data-action="export"]').click();p.locator('[data-action="write-report"]').click();expect(p.locator('.notice:visible')).to_be_visible()
            p.locator('[data-report-tab="narrative"]').click();p.locator('[data-report-field="quality_notes"]').fill('Old frozen run retained until explicit refresh.');p.locator('[data-report-action="save"]').press('Enter');expect(p.locator('#report-save-state')).to_have_text('Saved locally · version 2')
            assert get(root+'/report')['state']['current']['bindings']['qca']==result['first_run']
            p.locator('[data-report-action="refresh"]').press('Enter');expect(p.locator('#report-save-state')).to_have_text('Saved locally · version 3');assert not get(root+'/report')['stale'];assert get(root+'/report')['state']['current']['bindings']['qca']['id']==get(root+'/qca')['state']['current']['id']
            p.locator('[data-action="close"]').click();return {'stale_writing_keeps_old_run':True,'explicit_refresh_binds_new_run':True}
        check('report preserves old computations until an explicit QCA evidence refresh',report_refresh)
        def restore_and_recovery():
            open_qca(p);tab(p,'versions');p.locator('#qca-run-select').select_option(result['first_run']['id']);p.locator('[data-qca-action="restore"]').press('Enter');save(p);run(p);s=get(root+'/qca')['state'];assert s['current']['design']==result['first_run']['design'];assert len(s['history'])==2
            saved=get(root);restored=post('/projects',{'kind':'restore','project':saved});assert restored['comparative_qca']==saved['comparative_qca'];assert restored['research_report']==saved['research_report']
            assert saved['documents']==project['documents'] and saved['codes']==project['codes'] and saved['annotations']==project['annotations'];assert get('/projects/'+seed['id'])==seed
            result['final_revision']=s['revision'];return {'restored_as_new_run':True,'JSON_retains_runs_and_reports':True,'source_codebook_annotations_and_seed_unchanged':True}
        check('historical calibration restores as a new run and full project JSON recovers exact records',restore_and_recovery)
        def unsaved():
            tab(p,'design');p.locator('[data-qca-design="question"]').fill('Unsaved test edit');p.locator('[data-action="close"]').click();expect(p.locator('#qca-discard')).to_be_visible();expect(p.locator('[data-qca-design="question"]')).to_have_value('Unsaved test edit');p.locator('[data-qca-action="discard"]').press('Enter');expect(p.locator('#dialog')).not_to_be_visible();return {'explicit_discard_required':True}
        check('unsaved calibration survives a close attempt until explicit discard',unsaved)
        assert not result['console'] and not result['http'] and not result['outside'];persist();browser.close()
    print(json.dumps({'pass':True,'checks':len(result['checks']),'console':len(result['console']),'unexpected_http':len(result['http']),'outside':len(result['outside'])}),flush=True)

if __name__=='__main__':main()
