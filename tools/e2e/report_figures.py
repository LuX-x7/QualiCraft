"""Report figure acceptance; loopback only and disposable public Bologna."""
import argparse,copy,io,json,traceback,zipfile
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright,expect


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--url',required=True);parser.add_argument('--out',required=True);args=parser.parse_args()
    base=args.url.rstrip('/');assert urlsplit(base).hostname in ('127.0.0.1','localhost')
    out=Path(args.out);shots=out/'screenshots';shots.mkdir(parents=True,exist_ok=True)
    result={'checks':[],'console':[],'http':[],'outside':[]}
    with sync_playwright() as pw:
        b=pw.chromium.launch(channel='chrome',headless=True);client=b.new_context()
        token=client.request.get(base+'/w/api/bootstrap').json()['token'];headers={'X-QualiCraft-Token':token}
        def get(url):
            r=client.request.get(url,headers=headers);assert r.ok,(r.status,r.text());return r.json()
        def post(url,data):
            r=client.request.post(url,data=data,headers=headers,timeout=120000);assert r.ok,(r.status,r.text());return r.json()
        source=base+'/w/api/projects/a71a0b538c024c3ab23fb4286cfe93e2';original=get(source)
        project=post(base+'/w/api/projects',{'kind':'restore','project':{**original,'name':'Bologna · frozen report figures'}});root=base+'/w/api/projects/'+project['id'];result['project_id']=project['id'];(out/'results.json').write_text(json.dumps(result,indent=2))
        def page(width):
            c=b.new_context(viewport={'width':width,'height':1000 if width>700 else 844},is_mobile=width==390,has_touch=width==390)
            c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') or r.request.url.startswith(out.resolve().as_uri()+'/') else (result['outside'].append(r.request.url),r.abort()))
            p=c.new_page();p.set_default_timeout(30000);p.on('pageerror',lambda e:result['console'].append(str(e)));p.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None);p.on('response',lambda r:result['http'].append([r.status,r.url]) if r.status>=400 else None)
            p.goto(base+'/w/?lang=en',wait_until='domcontentloaded');p.locator('#start-project-select').select_option(project['id']);p.locator('[data-action="start-open"]').click();expect(p.locator('#reading-document')).to_be_visible();return p
        def open_report(p):p.locator('[data-action="export"]').click();p.locator('[data-action="write-report"]').click();expect(p.locator('#report-save-state')).to_be_visible()
        def tab(p,id):p.locator('[data-report-tab="'+id+'"]').click()
        def save(p,revision):
            p.locator('[data-report-action="save"]').press('Enter');expect(p.locator('#report-save-state')).to_have_text('Saved locally · version '+str(revision),timeout=120000)
        def check(name,fn):
            try:detail=fn();result['checks'].append({'name':name,'pass':True,'detail':detail});print('PASS '+name,flush=True)
            except Exception as e:result['checks'].append({'name':name,'pass':False,'error':str(e),'traceback':traceback.format_exc()});print('FAIL '+name+': '+str(e),flush=True)
            (out/'results.json').write_text(json.dumps(result,indent=2))
        p=page(1440);open_report(p)
        def five():
            p.locator('[data-report-field="title"]').fill('Bologna frozen figure review')
            p.locator('[data-report-field="research_question"]').fill('How do the saved coding counts vary across this public Bologna example?')
            p.locator('[data-report-field="case_unit"]').fill('Public transcripts used for software acceptance, not independent new research.')
            p.locator('[data-report-field="analysis_unit"]').fill('Saved passage-code assignments; definitions remain those printed on each figure.')
            tab(p,'narrative');p.locator('[data-report-field="narrative"]').fill('This technical example preserves five existing descriptive figures with the same saved coding record. Counts do not establish importance, association or saturation. Captions remain researcher-authored.')
            tab(p,'figures')
            for kind in ['frequency','coverage','cooccurrence','hierarchy','accumulation']:
                p.locator('#report-figure-kind').select_option(kind);p.locator('[data-report-action="add-figure"]').press('Enter');p.locator('[data-report-caption]').last.fill('Bologna '+kind+' — technical acceptance of saved outputs, not a new research finding.')
            expect(p.locator('[data-report-action="add-figure"]')).to_be_disabled();save(p,1)
            s=get(root+'/report')['state'];assert len(s['assets'])==5 and len(s['current']['bindings']['figures'])==5
            p.locator('.report-figure').first.hover();expect(p.locator('.report-figure img').first).to_be_visible();p.screenshot(path=str(shots/'01-desktop-frozen-figures.png'))
            result['version1']=s['current'];result['assets1']=s['assets']
            return {'figures':5,'shared_assets':5,'keyboard_add_save':True}
        check('desktop keyboard saves five existing figures with editable captions',five)
        def caption():
            p.locator('[data-report-caption]').first.fill('Edited caption — the saved CSV and figure are unchanged.');save(p,2)
            s=get(root+'/report')['state'];assert s['assets']==result['assets1'];assert s['current']['bindings']==result['version1']['bindings']
            p.locator('[data-action="close"]').click();p.reload(wait_until='domcontentloaded');expect(p.locator('#reading-document')).to_be_visible();open_report(p);tab(p,'figures');expect(p.locator('[data-report-caption]').first).to_have_value('Edited caption — the saved CSV and figure are unchanged.')
            return {'reload_retained':True,'assets_byte_equal':True,'captions_separate':True}
        check('caption-only save and reload reuse all five frozen assets',caption)
        def downloads():
            tab(p,'preview');expect(p.frame_locator('#report-preview').get_by_role('heading',name='Figures',exact=True)).to_be_visible();assert p.frame_locator('#report-preview').locator('figure img').count()==5
            for fmt in ['html','docx','json','zip']:
                with p.expect_download(timeout=60000) as d:p.locator('[data-report-action="download"][data-format="'+fmt+'"]').press('Enter')
                d.value.save_as(out/('research-report.'+fmt));expect(p.locator('#report-download-status')).to_contain_text(d.value.suggested_filename)
            record=json.loads((out/'research-report.json').read_text());assert record['report']==get(root+'/report')['state']['current']
            with zipfile.ZipFile(out/'research-report.zip') as z:
                assert json.loads(z.read('report.json'))==record
                assert len([n for n in z.namelist() if n.endswith('/figure.py')])==5
            return {'formats':4,'JSON_and_ZIP_agree':True,'five_recipes':True}
        check('saved report HTML Word JSON and ZIP contain the same five figure records',downloads)
        def offline():
            q=p.context.new_page();q.goto((out/'research-report.html').resolve().as_uri());expect(q.locator('figure img')).to_have_count(5)
            assert q.locator('figure img').evaluate_all('(images)=>images.every(i=>i.complete&&i.naturalWidth>0)')
            assert q.evaluate('document.documentElement.scrollWidth<=innerWidth');q.locator('figure').first.scroll_into_view_if_needed();q.screenshot(path=str(shots/'02-offline-report-figure.png'));q.close()
            return {'offline_images':5,'network_required':False}
        check('downloaded report shows all five figures offline',offline)
        def phone():
            q=page(390);open_report(q);tab(q,'figures');q.locator('[data-report-caption]').first.fill('Phone-edited caption; saved figure unchanged.');save(q,3)
            q.locator('.report-figure').first.scroll_into_view_if_needed();assert q.locator('.report-figure img').evaluate_all('(images)=>images.every(i=>Math.abs(i.getBoundingClientRect().width/i.getBoundingClientRect().height-i.naturalWidth/i.naturalHeight)<0.01)');q.screenshot(path=str(shots/'03-phone-figure-caption.png'));assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
            q.locator('[data-action="close"]').tap();q.reload(wait_until='domcontentloaded');expect(q.locator('#reading-document')).to_be_visible();open_report(q);tab(q,'figures');expect(q.locator('[data-report-caption]').first).to_have_value('Phone-edited caption; saved figure unchanged.')
            tabs=q.locator('[role="tab"]');tabs.first.focus();tabs.first.press('End');expect(tabs.last).to_be_focused()
            with q.expect_download() as d:q.locator('[data-report-action="download"][data-format="zip"]').tap()
            d.value.save_as(out/'phone-report.zip');q.locator('[data-action="close"]').tap()
            return {'touch_caption_save_reload_download':True,'keyboard_sections':True,'physical_phone':'not tested; Chrome emulation'}
        check('phone touch preserves aspect ratio captions refresh and complete ZIP download',phone)
        def restore():
            tab(p,'versions');p.locator('#report-history').select_option(result['version1']['id']);p.locator('[data-report-action="restore"]').click();expect(p.locator('#report-save-state')).to_have_text('Saved locally · version 4')
            s=get(root+'/report')['state'];assert s['current']['draft']==result['version1']['draft'] and s['assets']==result['assets1']
            return {'restored_as_new_version':4,'all_assets_retained':True,'no_rerender_needed':True}
        # Desktop context must reload after the independent phone save.
        p.locator('[data-action="close"]').click();open_report(p)
        check('restoring an earlier report restores exact figure captions and assets',restore)
        def stale():
            p.locator('[data-action="close"]').click();post(root+'/code-update',{'id':project['codes'][0]['id'],'changes':{'name':project['codes'][0]['name']+' acceptance'}})
            open_report(p);expect(p.locator('.notice:visible')).to_contain_text('Coding evidence changed');tab(p,'figures');p.locator('[data-report-caption]').first.fill('Writing against the frozen pre-edit figure.');save(p,5)
            c=get(root+'/report');assert c['stale'] and c['state']['assets']==result['assets1'];p.screenshot(path=str(shots/'04-stale-figure-evidence.png'))
            p.locator('[data-report-action="refresh"]').click();expect(p.locator('#report-save-state')).to_have_text('Saved locally · version 6',timeout=120000)
            c=get(root+'/report');assert not c['stale'] and c['state']['history'][0]['bindings']==result['version1']['bindings']
            return {'stale_assets_retained':True,'explicit_refresh_new_bindings':True,'history_unchanged':True}
        check('stale figures stay frozen until deliberate evidence refresh',stale)
        def recovery():
            saved=get(root);restored=post(base+'/w/api/projects',{'kind':'restore','project':saved});c=get(base+'/w/api/projects/'+restored['id']+'/report');assert c['state']==saved['research_report'] and not c['stale'];assert get(source)==original
            assert saved['documents']==project['documents'] and saved['annotations']==project['annotations']
            return {'JSON_recovery':True,'all_versions_assets_equal':True,'original_Bologna_unchanged':True}
        check('project JSON restores all shared assets versions and exact source',recovery)
        def current_settings():
            p.locator('[data-action="close"]').click();p.locator('[data-action="view"][data-view="plotting"]').click()
            p.locator('[data-plot="kind"]').select_option('frequency');p.locator('[data-plot="level"]').select_option('theme');open_report(p);tab(p,'figures')
            p.locator('[data-report-action="figure-remove"]').first.click();p.locator('[data-report-action="current-figure"]').click();p.locator('[data-report-caption]').last.fill('Current theme-frequency settings retained from Figures.');save(p,7)
            s=get(root+'/report')['state'];f=s['current']['draft']['figures'][-1];a=s['assets'][s['current']['bindings']['figures'][f['id']]['asset_id']]
            assert f['options']['kind']=='frequency' and f['options']['level']=='theme' and a['result']['level']=='theme'
            return {'current_Figures_parameters_saved':True,'original_figures_view_retained':True}
        check('report can add the existing Figures view parameters without changing them',current_settings)
        result.pop('assets1',None);result['version1_id']=result.pop('version1')['id']
        result['pass']=all(c['pass'] for c in result['checks']) and not any(result[k] for k in ['console','http','outside']);(out/'results.json').write_text(json.dumps(result,indent=2));print(json.dumps({'pass':result['pass'],'passed':sum(c['pass'] for c in result['checks']),'total':len(result['checks']),'console':len(result['console']),'http':len(result['http']),'outside':len(result['outside'])}))
        b.close()
    return 0 if result['pass'] else 1

if __name__=='__main__':raise SystemExit(main())
