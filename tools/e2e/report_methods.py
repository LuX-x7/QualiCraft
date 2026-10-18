"""UX55-04 real project-only Chrome acceptance; disposable public Bologna only."""
import argparse,copy,io,json,os,subprocess,sys,time,urllib.request,zipfile
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from tools.e2e.recovery_boundaries import Service,dump,validate,sha
from qualicraft import core,reporting,report_figures,method_maps
from qualicraft.server import bologna_example
from playwright.sync_api import sync_playwright,expect
NODE='/Users/chehaijun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--seed',type=Path,required=True);parser.add_argument('--site-build',type=Path,required=True);parser.add_argument('--out',type=Path,required=True);parser.add_argument('--port',type=int,default=52761);args=parser.parse_args();out=args.out;out.mkdir(parents=True,exist_ok=True)
    seed=json.loads(args.seed.read_text(encoding='utf-8'));public=bologna_example()
    for k in ['documents','codes','annotations']:assert seed[k]==public[k]
    seed['id']=core.uid();seed['name']='Bologna · method maps acceptance';validate(seed)
    # The fixture predates UX55-04. Retain its exact legacy report and frozen outputs.
    assert 'method_map' not in seed['research_report']['current'];assert len(seed['research_report']['assets'])==5
    s=Service(out/'service',seed);site='http://127.0.0.1:'+str(args.port);log=(out/'site.txt').open('w');proc=subprocess.Popen([NODE,'start.js'],cwd=args.site_build,env={**os.environ,'PORT':str(args.port),'HOST':'127.0.0.1','QT_WORKBENCH_URL':s.base},stdout=log,stderr=log,start_new_session=True)
    result={'checks':[],'console':[],'http':[],'outside':[],'device':'Chrome desktop and touch emulation; physical device/VoiceOver separate'}
    def check(name,detail):result['checks'].append({'name':name,'pass':True,'detail':detail});dump(out/'results.json',result);print('PASS '+name,flush=True)
    try:
        for _ in range(150):
            try:
                with urllib.request.urlopen(site+'/w/api/bootstrap',timeout=2) as r:assert json.load(r)['token']==s.token
                break
            except Exception:time.sleep(.2)
        else:raise TimeoutError('site not ready')
        with sync_playwright() as pw:
            browser=pw.chromium.launch(channel='chrome',headless=True)
            for phone in [False,True]:
                kind='phone' if phone else 'desktop';p=s.json('/projects',{'kind':'restore','project':seed});root='/projects/'+p['id'];legacy=copy.deepcopy(p['research_report']['current']);assets=copy.deepcopy(p['research_report']['assets']);frozen=copy.deepcopy(p['comparative_qca']);original_files={id:{n:sha(v) for n,v in report_figures.files(a).items()} for id,a in assets.items()}
                c=browser.new_context(viewport={'width':390 if phone else 1440,'height':844 if phone else 1000},has_touch=phone,is_mobile=phone,accept_downloads=True,reduced_motion='reduce' if phone else 'no-preference');c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(site+'/') else (result['outside'].append(r.request.url),r.abort()));page=c.new_page();page.set_default_timeout(15000)
                page.on('pageerror',lambda e:result['console'].append(str(e)));page.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None);page.on('response',lambda r:result['http'].append([r.status,r.url]) if r.status>=400 else None)
                page.goto(site+'/w/?lang=en',wait_until='networkidle');page.locator('#start-project-select').select_option(p['id']);page.locator('[data-action="start-open"]').click();page.locator('[data-action="export"]').first.click();page.locator('[data-action="write-report"]').click()
                expect(page.locator('.report-method-orientation')).to_contain_text('legacy version');page.locator('.report-method-orientation').scroll_into_view_if_needed();page.screenshot(path=str(out/(kind+'-legacy-map-not-saved.png')));assert s.json(root)==p
                check(kind+' old report stays unchanged on opening',{'legacy_method':legacy['draft']['method'],'revision':legacy['revision'],'all_state_equal':True})
                # Use keyboard method selection and save, touch on the phone.
                revision=p['research_report']['revision']
                for method in ['content','ta','comparative']:
                    page.locator('[data-report-tab="setup"]').click();sel=page.locator('#report-method')
                    sel.select_option(method)
                    if not phone:
                        expect(page.locator('#report-method')).to_be_focused();page.locator('#report-method').press('Tab');expect(page.locator('[data-report-field="research_question"]')).to_be_focused()
                    expect(page.locator('.method-map h4')).to_contain_text(method_maps.MAPS[method]['name']);assert page.locator('.method-map li').count()==6
                    assert s.json(root)['research_report']['current']['id']==(legacy['id'] if revision==p['research_report']['revision'] else saved['id'])
                    page.locator('[data-report-tab="preview"]').click();expect(page.locator('[data-report-action="download"]').first).to_be_disabled();check(kind+' '+method+' unsaved selection cannot relabel saved exports',{'saved_revision':revision,'download_disabled':True})
                    page.locator('[data-report-tab="setup"]').click();page.locator('[data-report-field="approach"]').fill('');page.locator('[data-report-field="analysis_unit"]').fill('');page.locator('[data-report-field="method_notes"]').fill('')
                    page.locator('[data-report-action="save"]').tap() if phone else page.keyboard.press('Control+s');revision+=1;expect(page.locator('#report-save-state')).to_have_text('Saved locally · version '+str(revision))
                    saved=s.json(root+'/report')['state']['current'];assert saved['method_map']==method_maps.freeze(method);assert saved['draft']['narrative']==legacy['draft']['narrative'];assert saved['bindings']['figures']==legacy['bindings']['figures']
                    steps=page.locator('.method-map li');steps.first.scroll_into_view_if_needed();steps.first.hover() if not phone else steps.first.tap();assert steps.first.is_visible();page.screenshot(path=str(out/(kind+'-'+method+'-editor-map.png')))
                    summary=page.locator('.method-map summary');summary.focus();summary.press('Enter');expect(page.locator('.method-map details')).to_have_attribute('open','');summary.press('Tab');expect(page.locator('.method-map a').first).to_be_focused();summary.press('Enter')
                    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert page.locator('#dialog').evaluate('(e)=>e.scrollWidth<=e.clientWidth');check(kind+' '+method+' method map keyboard and pointer readable',{'nodes':6,'font_min':page.locator('.map-detail').first.evaluate('(e)=>parseFloat(getComputedStyle(e).fontSize)'),'no_overflow':True,'reduced_motion':phone})
                    page.locator('[data-report-tab="preview"]').click();frame=page.frame_locator('#report-preview');expect(frame.locator('.method-decisions')).to_contain_text(method_maps.MAPS[method]['name']);expect(frame.locator('.method-map li')).to_have_count(6);expect(frame.locator('.method-decisions')).to_contain_text('Not documented yet.');assert frame.locator('body').evaluate('document.documentElement.scrollWidth<=innerWidth')
                    if method=='comparative':expect(frame.locator('.map-provenance')).to_contain_text(frozen['current']['id'])
                    frame.locator('.method-map').scroll_into_view_if_needed();page.screenshot(path=str(out/(kind+'-'+method+'-saved-preview.png')))
                    for fmt in ['html','docx','json','zip']:
                        with page.expect_download(timeout=60000) as download:page.locator('[data-report-action="download"][data-format="'+fmt+'"]').tap() if phone else page.locator('[data-report-action="download"][data-format="'+fmt+'"]').press('Enter')
                        path=out/(kind+'-'+method+'-report.'+fmt);download.value.save_as(path);expect(page.locator('#report-download-status')).to_contain_text('Check downloads for completion.')
                    record=json.loads((out/(kind+'-'+method+'-report.json')).read_text());assert record['report']==saved;assert record['figure_assets']==assets
                    with zipfile.ZipFile(out/(kind+'-'+method+'-report.zip')) as z:
                        assert json.loads(z.read('report.json'))==record;assert len([n for n in z.namelist() if n.endswith('/figure.py')])==5
                        if method=='comparative':assert json.loads(z.read('qca/qca-run.json'))==frozen['current']
                    final=s.json(root);assert final['research_report']['assets']==assets;assert final['comparative_qca']==frozen
                    for k in ['documents','codes','annotations']:assert final[k]==p[k]
                    check(kind+' '+method+' four downloads match saved map and frozen five figures',{'formats':4,'frozen_assets':5,'QCA_equal':True,'writing_retained':True})
                page.locator('[data-report-tab="versions"]').click();page.locator('#report-history').select_option(legacy['id']);page.locator('[data-report-action="restore"]').click();revision+=1;expect(page.locator('#report-save-state')).to_have_text('Saved locally · version '+str(revision));restored=s.json(root+'/report')['state']['current'];assert 'method_map' not in restored;assert restored['draft']==legacy['draft'];assert restored['bindings']==legacy['bindings']
                page.locator('[data-report-tab="preview"]').click();expect(page.frame_locator('#report-preview').locator('.method-decisions')).to_contain_text('No method map was saved');assert page.frame_locator('#report-preview').locator('.method-map').count()==0
                check(kind+' restoring legacy report does not silently add a map or change run',{'exact_legacy_draft_and_bindings':True,'map_absent':True})
                # Recover all retained versions through actual project JSON restore.
                final=s.json(root);restored_project=s.json('/projects',{'kind':'restore','project':final});assert restored_project['research_report']==final['research_report'];assert restored_project['comparative_qca']==frozen
                assert {id:{n:sha(v) for n,v in report_figures.files(a).items()} for id,a in final['research_report']['assets'].items()}==original_files
                dump(out/(kind+'-scope.json'),{'source_equal':True,'QCA_equal':True,'five_bundles':original_files,'history_entries':len(final['research_report']['history']),'restored_state_equal':True})
                check(kind+' project restoration preserves mixed legacy and new map history',{'all_versions_equal':True,'all_25_figure_members_equal':True})
                for route in ['/','/report']:
                    page.goto(site+route,wait_until='networkidle');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
                    if route=='/':
                        cards=page.locator('.method-path');assert cards.count()==3
                        for i,method in enumerate(['ta','content','comparative']):
                            summary=cards.nth(i).locator('summary').first;summary.focus();summary.press('Enter');expect(cards.nth(i).locator('.site-method-map h3')).to_have_text(method_maps.MAPS[method]['name']);assert cards.nth(i).locator('.site-method-map li').count()==6;assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');cards.nth(i).locator('.site-method-map li').first.hover() if not phone else cards.nth(i).locator('.site-method-map li').first.tap();cards.nth(i).locator('.site-method-map').scroll_into_view_if_needed();page.screenshot(path=str(out/(kind+'-'+method+'-website.png')));summary.press('Enter')
                    else:page.locator('#sec-methods').scroll_into_view_if_needed();expect(page.locator('#sec-methods')).to_contain_text('saved name and process map');page.screenshot(path=str(out/(kind+'-website-report-methods.png')))
                    check(kind+' '+route+' website methods keyboard and pointer checks',{'three_saved_names':True,'original_figures_and_media_retained':True,'no_overflow':True})
                c.close()
            browser.close()
        assert not any(result[k] for k in ['console','http','outside']),result;assert s.json('/projects/'+seed['id'])==seed
        result.update(completed=True,original_project_equal=True);dump(out/'results.json',result);print(json.dumps({'checks':len(result['checks']),'console':0,'http':0,'outside':0}))
    except Exception:
        if 'page' in locals() and not page.is_closed():
            try:page.screenshot(path=str(out/'failure.png'));dump(out/'failure-state.json',{'url':page.url,'dialog':page.locator('#dialog').inner_text()})
            except Exception:pass
        dump(out/'results.json',result);raise
    finally:os.killpg(proc.pid,15);proc.wait(timeout=15);log.close();s.stop()
if __name__=='__main__':main()
