"""UX61 project-only Chrome acceptance of exact frozen JSON restoration."""
import argparse,copy,json,os,subprocess,time,zipfile
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from qualicraft import core,reporting,transcript
from qualicraft.server import bologna_example
from tools.e2e.recovery_boundaries import Service,dump,backup_manifest,sha
from playwright.sync_api import sync_playwright,expect
NODE='/Users/chehaijun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
KEYS=['documents','codes','annotations','blocks','comparative_qca','research_report']

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--out',type=Path,required=True);ap.add_argument('--seed',type=Path,required=True);ap.add_argument('--legacy',type=Path,required=True);ap.add_argument('--site-build',type=Path,required=True);ap.add_argument('--port',type=int,default=52764);args=ap.parse_args()
    out=args.out;out.mkdir(parents=True,exist_ok=True);source=json.loads(args.seed.read_text());legacy=json.loads(args.legacy.read_text());public=bologna_example()
    for p in [source,legacy]:
        assert [d['text'] for d in p['documents'][:19]]==[d['text'] for d in public['documents']]
        assert p['annotations'][:874]==public['annotations']
        assert all(d['text'] in [x['text'] for x in public['documents']] for d in p['documents'])
        core.validate_project(copy.deepcopy(p))
    assert 'method_map' not in legacy['research_report']['current']
    service=Service(out/'service',source);origin=f'http://127.0.0.1:{args.port}';log=(out/'site.txt').open('w');site=subprocess.Popen([NODE,'start.js'],cwd=args.site_build,env={**os.environ,'PORT':str(args.port),'HOST':'127.0.0.1','QT_WORKBENCH_URL':service.base},stdout=log,stderr=log,start_new_session=True)
    result={'checks':[],'console':[],'http':[],'external':[],'intentional_rejections':[],'known_deferred':[],'source_project':source['id']};original_points=backup_manifest(service.folder,source['id']);expected_error=[False]
    def save():dump(out/'results.json',result)
    def check(name,fn,page):
        print('START '+name,flush=True)
        try:detail=fn();result['checks'].append({'name':name,'pass':True,'detail':detail});print('PASS '+name,flush=True)
        except Exception as e:
            result['checks'].append({'name':name,'pass':False,'error':str(e)});page.screenshot(path=str(out/'failure.png'));dump(out/'failure-state.json',{'url':page.url,'body':page.locator('body').inner_text()});raise
        finally:save()
    try:
        import urllib.request
        for _ in range(100):
            try:
                with urllib.request.urlopen(origin+'/w/api/bootstrap',timeout=2) as r:assert json.load(r)['token']==service.token
                break
            except Exception:time.sleep(.15)
        else:raise TimeoutError('Owned site not ready')
        with sync_playwright() as pw:
            browser=pw.chromium.launch(channel='chrome',headless=True)
            for phone in [False,True]:
                mode='phone' if phone else 'desktop';folder=out/mode;folder.mkdir();context=browser.new_context(viewport={'width':390 if phone else 1440,'height':844 if phone else 1000},has_touch=phone,is_mobile=phone,accept_downloads=True)
                context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(origin+'/') else (result['external'].append(r.request.url),r.abort()));page=context.new_page();page.set_default_timeout(15000)
                page.on('pageerror',lambda e:result['console'].append(str(e)))
                page.on('console',lambda m:result['intentional_rejections'].append({'console':m.text}) if expected_error[0] and m.type=='error' else result['console'].append(m.text) if m.type=='error' else None)
                page.on('response',lambda r:result['intentional_rejections'].append({'status':r.status,'url':r.url}) if expected_error[0] and r.status>=400 else result['http'].append([r.status,r.url]) if r.status>=400 else None)
                page.goto(origin+'/w/?lang=en',wait_until='networkidle');current=[None]
                def use(locator):locator.tap() if phone else locator.press('Enter')
                def shot(name):page.screenshot(path=str(folder/(name+'.png')))
                def close():use(page.locator('[data-action="close"]').first)
                def projects():use(page.locator('[data-action="projects"]:visible').first)
                def equal(p,expected):
                    assert p['id']!=expected['id']
                    for key in KEYS:assert transcript.canonical(p[key])==transcript.canonical(expected[key]),key
                    core.validate_project(copy.deepcopy(p))
                def upload(path,expected,name,start=False):
                    if not start:projects()
                    with page.expect_file_chooser() as event:use(page.locator('[data-action="restore-pick"]'))
                    with page.expect_response(lambda r:r.url==origin+'/w/api/projects/restore' and r.request.method=='POST') as response:event.value.set_files(path)
                    r=response.value;assert r.status==200,r.text();assert r.request.post_data.encode('utf-8')==path.read_bytes();new=json.loads(r.body());equal(new,expected)
                    expect(page.locator('#reading-document')).to_be_visible();page.wait_for_function('(id)=>state.project?.id===id',arg=new['id']);assert page.evaluate('state.view')=='coding';current[0]=new
                    assert service.json('/projects/'+source['id'])==source;assert backup_manifest(service.folder,source['id'])==original_points
                    shot(name);return new
                check(mode+' original UX60 artifact restores through native file chooser without numeric rewriting',lambda:{'id':upload(args.seed,source,'01-old-project-restored',True)['id'],'all_saved_records_exact':True,'raw_request_bytes_equal':True},page)
                def inspect():
                    p=current[0];page.locator('#reading-document').select_option(p['documents'][-2]['id']);use(page.locator('[data-action="reading-overview"]'));assert page.locator('#reading-overview-map .read,#reading-overview-map .revisit').count()==2;shot('02-restored-reading-and-coding-tracks');use(page.locator('[data-action="reading-overview"]'))
                    use(page.locator('[data-action="export"]').first);use(page.locator('[data-action="write-report"]'));use(page.locator('[data-report-tab="versions"]'));history=p['research_report']['history'];assert page.locator('#report-history option').count()==len(history)+1
                    for entry in history:page.locator('#report-history').select_option(entry['id']);expect(page.locator('#report-comparison')).to_contain_text(entry['draft']['narrative'].strip())
                    shot('03-all-retained-report-versions');use(page.locator('[data-report-tab="preview"]'));frame=page.frame_locator('#report-preview');expect(frame.locator('.method-map li')).to_have_count(6);assert frame.locator('figure img').count()==5;shot('04-restored-frozen-method-map')
                    with page.expect_download(timeout=60000) as event:use(page.locator('[data-report-action="download"][data-format="zip"]'))
                    package=folder/'restored-report.zip';event.value.save_as(package)
                    with zipfile.ZipFile(package) as z:
                        record=json.loads(z.read('report.json'));assert transcript.canonical(record['report'])==transcript.canonical(p['research_report']['current']);assert record['figure_assets']==p['research_report']['assets'];assert json.loads(z.read('qca/qca-run.json'))==p['comparative_qca']['current']
                    close();assert service.json('/projects/'+p['id'])==p
                    points=service.json('/projects/'+p['id']+'/backups')['items'];restored=service.json('/projects/'+p['id']+'/restore-snapshot',{'name':points[0]['name']});equal(restored,p)
                    return {'reading_marks':2,'report_history':len(history),'five_frozen_assets':5,'exact_report_QCA_and_figure_payloads':True,'snapshot_recovery_equal':True,'original_recovery_points_retained':True}
                check(mode+' retained reading marks versions method map figures report ZIP and committed snapshots',inspect,page)
                def roundtrip():
                    p=current[0];use(page.locator('[data-action="export"]').first)
                    with page.expect_download() as event:use(page.locator('[data-action="download"][data-format="json"]'))
                    path=folder/'reexported-project.json';event.value.save_as(path);exported=json.loads(path.read_text());assert exported==p;close();upload(path,p,'05-reexport-restored');return {'same_freezes_after_two_UI_restores':True,'download_bytes':path.stat().st_size}
                check(mode+' newly reexported JSON restores again with keyboard or touch',roundtrip,page)
                def reject():
                    p=current[0];before_projects=service.json('/projects');before_points=backup_manifest(service.folder,p['id']);details=[]
                    for kind in ['qca','report']:
                        bad=copy.deepcopy(p)
                        if kind=='qca':bad['comparative_qca']['current']['result']['truth_table'][0]['n']+=1
                        else:bad['research_report']['current']['draft']['narrative']='Changed without a saved hash'
                        path=folder/('tampered-'+kind+'.json');path.write_text(json.dumps(bad,ensure_ascii=False));projects()
                        with page.expect_file_chooser() as event:use(page.locator('[data-action="restore-pick"]'))
                        expected_error[0]=True
                        with page.expect_response(lambda r:r.url.endswith('/api/projects/restore')) as response:event.value.set_files(path)
                        assert response.value.status==400;expect(page.locator('#dialog')).to_contain_text('integrity validation failed');page.wait_for_timeout(100);shot('06-tampered-'+kind+'-rejected');expected_error[0]=False
                        assert service.json('/projects')==before_projects;assert service.json('/projects/'+p['id'])==p;assert backup_manifest(service.folder,p['id'])==before_points;details.append(kind);close()
                    return {'rejected':details,'project_list_project_and_points_exact':True,'no_silent_rehash':True}
                check(mode+' corrupted frozen QCA and report reject without changing projects or recovery points',reject,page)
                def old_legacy():
                    p=upload(args.legacy,legacy,'07-legacy-project-restored');assert 'method_map' not in p['research_report']['current'];use(page.locator('[data-action="export"]').first);use(page.locator('[data-action="write-report"]'));use(page.locator('[data-report-tab="preview"]'));frame=page.frame_locator('#report-preview');expect(frame.locator('body')).to_contain_text('No method map was saved');assert frame.locator('.method-map').count()==0;shot('08-legacy-map-remains-absent');close();return {'old_map_omission_preserved':True,'QCA_and_figures_unmodified':True}
                check(mode+' historical pre-M1 project restores without rewriting old versions',old_legacy,page)
                if phone:
                    # Scope observation only, not a UX61 fix or acceptance claim.
                    page.locator('#reading-document').select_option(source['documents'][0]['id']);use(page.locator('[data-action="reading-overview"]'))
                    if page.locator('#overview-paragraph-list').get_attribute('open') is None:use(page.locator('#overview-paragraph-list summary'))
                    page.locator('#overview-paragraph-number').fill('17');use(page.locator('[data-action="overview-find-paragraph"]'));use(page.locator('[data-action="overview-jump-paragraph"]'))
                    if page.locator('[data-action="reading-overview"]').get_attribute('aria-expanded')!='true':use(page.locator('[data-action="reading-overview"]'))
                    use(page.locator('[data-action="overview-keep"]'));before=page.evaluate('readReadingPosition(state.project,doc())');use(page.locator('[data-action="coding-codebook"]'));after=page.evaluate('readReadingPosition(state.project,doc())');assert before['start']==11435 and after['start']==0;result['known_deferred'].append({'id':'UX60-02','before':before,'after':after,'still_open':True});shot('09-UX60-02-remains-open');close()
                assert not page.evaluate('document.documentElement.scrollWidth>innerWidth');context.close()
            browser.close()
        assert service.json('/projects/'+source['id'])==source;assert backup_manifest(service.folder,source['id'])==original_points;assert not result['console'] and not result['http'] and not result['external'];result['completed']=True;save();print(json.dumps({'checks':len(result['checks']),'normal_errors':0,'deferred':'UX60-02'}))
    finally:os.killpg(site.pid,15);site.wait(timeout=15);log.close();service.stop()
if __name__=='__main__':main()
