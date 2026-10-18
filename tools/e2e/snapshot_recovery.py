"""Project-only desktop/phone snapshot UI and full QCA/report recovery checks."""
import argparse,copy,json,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from tools.e2e.recovery_boundaries import Service,dump,validate
from qualicraft import core,qca_state
from playwright.sync_api import sync_playwright,expect

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--seed',type=Path,required=True);parser.add_argument('--out',type=Path,required=True);args=parser.parse_args();out=args.out;out.mkdir(parents=True,exist_ok=True);seed=json.loads(args.seed.read_text(encoding='utf-8'));seed['id']=core.uid();seed['name']='Bologna · snapshot commit review';s=Service(out/'service',seed);root='/projects/'+seed['id'];base=s.base;results={'checks':[],'console':[],'http':[],'outside':[],'phone':'Chrome touch emulation, not physical-device acceptance'}
    def check(name,detail):results['checks'].append({'name':name,'pass':True,'detail':detail});dump(out/'results.json',results);print(name+': PASS',flush=True)
    try:
        context=s.json(root+'/qca');s.json(root+'/qca-run',{'revision':context['state']['revision'],'source_version':context['source_version']});saved=s.json(root);validate(saved);items=s.json(root+'/backups')['items'];assert len(items)==2
        with sync_playwright() as pw:
            browser=pw.chromium.launch(channel='chrome',headless=True)
            def page_for(width,id):
                c=browser.new_context(viewport={'width':width,'height':1000 if width==1440 else 844},has_touch=width==390,is_mobile=width==390);c.route('**/*',lambda route:route.continue_() if route.request.url.startswith(base+'/') else (results['outside'].append(route.request.url),route.abort()));page=c.new_page();page.on('pageerror',lambda e:results['console'].append(str(e)));page.on('console',lambda m:results['console'].append(m.text) if m.type=='error' else None);page.on('response',lambda r:results['http'].append([r.status,r.url]) if r.status>=400 else None);page.goto(base+'/w/?lang=en',wait_until='networkidle');page.locator('#start-project-select').select_option(id);page.locator('[data-action="start-open"]').click();return c,page
            c,page=page_for(1440,seed['id']);button=page.locator('[data-action="snapshots"]');expect(button).to_contain_text('2 snapshots');button.focus();button.press('Enter');expect(page.locator('.snap-row')).to_have_count(2);page.screenshot(path=str(out/'desktop-committed-snapshots.png'));check('Desktop keyboard opens committed snapshot list',{'snapshots':2,'current_QCA_revision':saved['comparative_qca']['revision']})
            page.once('dialog',lambda dialog:dialog.accept())
            with page.expect_response(lambda r:'/restore-snapshot' in r.url and r.request.method=='POST') as response:page.locator('[data-action="restore-snapshot"]').last.press('Enter')
            restored=response.value.json();assert response.value.ok;validate(restored)
            for k in ['documents','codes','annotations','comparative_qca','research_report']:assert restored[k]==seed[k]
            assert s.json(root)==saved;page.screenshot(path=str(out/'desktop-restored-copy.png'));check('Keyboard snapshot restore creates a complete separate project',{'new_project_id':restored['id'],'old_project_equal':True,'QCA_and_report_history_assets_equal':True})
            c.close();c,page=page_for(390,restored['id']);expect(page.locator('[data-action="snapshots"]')).not_to_be_visible();page.locator('[data-action="export"]').first.tap();page.locator('[data-action="write-report"]').tap();expect(page.locator('#report-save-state')).to_be_visible();page.locator('[data-report-tab="narrative"]').tap();field=page.locator('[data-report-field="narrative"]');field.fill(field.input_value()+'\nTechnical phone snapshot acceptance note.');page.locator('[data-report-action="save"]').press('Enter');expect(page.locator('#report-save-state')).to_contain_text('Saved locally');page.screenshot(path=str(out/'phone-report-saved-snapshot.png'));updated=s.json('/projects/'+restored['id']);validate(updated)
            latest=s.json('/projects/'+restored['id']+'/backups')['items'][0]['name'];snapshot=json.loads((s.folder/'backups'/restored['id']/latest).read_text(encoding='utf-8'));assert snapshot==updated
            check('Phone report save creates a full committed recovery point',{'snapshot':latest,'full_state_equal':True,'phone_snapshot_entry_still_hidden_by_existing_scope':True})
            page.locator('[data-action="close"]').first.tap();page.reload(wait_until='networkidle');page.locator('[data-action="view"][data-view="insights"]').tap();page.locator('[data-action="open-qca"]').tap();expect(page.locator('#qca-save-state')).to_be_visible();page.locator('[data-qca-tab="calibration"]').focus();page.locator('[data-qca-tab="calibration"]').press('Enter');expect(page.locator('[data-qca-value="A"]')).to_have_value(str(updated['comparative_qca']['design']['cases'][0]['cells']['A']['value']));assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path=str(out/'phone-calibration-after-reload.png'));page.locator('[data-action="close"]').first.tap();check('Phone reload retains exact calibration and keyboard navigation',{'no_overflow':True,'saved_membership_equal':True})
            page.locator('[data-action="export"]').first.tap()
            with page.expect_download() as download:page.locator('[data-action="download"][data-format="json"]').tap()
            path=out/'phone-full-project.json';download.value.save_as(path);payload=json.loads(path.read_text(encoding='utf-8'));assert payload==updated
            recovered=s.json('/projects',{'kind':'restore','project':payload});validate(recovered)
            for k in ['documents','codes','annotations','comparative_qca','research_report']:assert recovered[k]==updated[k]
            page.screenshot(path=str(out/'phone-project-download.png'));check('Phone project download and JSON recovery retain frozen records',{'filename':download.value.suggested_filename,'all_sources_calibration_runs_reports_assets_equal':True});c.close();browser.close()
        assert not any(results[k] for k in ['console','http','outside']);results['completed']=True;dump(out/'results.json',results);print(json.dumps({'checks':len(results['checks']),'console':0,'http':0,'outside':0}))
    finally:s.stop()
if __name__=='__main__':main()
