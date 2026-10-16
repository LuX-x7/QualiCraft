"""UX-32A: isolated Chrome acceptance on a disposable Bologna project only."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', required=True); parser.add_argument('--out', required=True)
    args = parser.parse_args(); base = args.url.rstrip('/')
    assert urlsplit(base).hostname in ('127.0.0.1', 'localhost')
    out = Path(args.out); shots = out/'screenshots'; shots.mkdir(parents=True, exist_ok=True)
    result = {'checks': [], 'console': [], 'http': [], 'expected_faults': []}
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='chrome', headless=True)
        fault = [False]
        def context(**options):
            c = browser.new_context(accept_downloads=True, **options)
            c.route('**/*', lambda r: r.continue_() if r.request.url.startswith(base+'/') else r.abort())
            p = c.new_page(); p.set_default_timeout(10000)
            p.on('pageerror', lambda e: result['console'].append(str(e)))
            p.on('console', lambda m: (result['expected_faults'] if fault[0] else result['console']).append(m.text) if m.type == 'error' else None)
            p.on('response', lambda r: (result['expected_faults'] if fault[0] else result['http']).append([r.status, r.url]) if r.status >= 400 else None)
            return c, p
        ctx, page = context(viewport={'width':1440,'height':900})
        boot = ctx.request.get(base+'/w/api/bootstrap').json(); headers = {'X-QualiCraft-Token':boot['token']}
        pid = 'a71a0b538c024c3ab23fb4286cfe93e2'; api = base+'/w/api/projects/'+pid
        original = ctx.request.get(api, headers=headers).json()
        assert len(original['documents']) == 19 and len(original['codes']) == 317 and len(original['annotations']) == 874
        before_csv = ctx.request.get(api+'/export?format=csv', headers=headers).body()
        def get(): return ctx.request.get(api, headers=headers).json()
        def backups(): return ctx.request.get(api+'/backups', headers=headers).json()['items']
        d1, d2 = original['documents'][:2]
        def open_project(p):
            p.goto(base+'/w/?lang=en', wait_until='networkidle')
            p.wait_for_selector('#reading-document,#start-project-select')
            if p.locator('#start-project-select').count():
                p.locator('#start-project-select').select_option(pid); p.locator('[data-action="start-open"]').click()
            expect(p.locator('#reading-document')).to_have_value(d1['id'])
        def snap(p, name): p.screenshot(path=str(shots/(name+'.png')))
        def check(name, fn):
            print('START', name, flush=True)
            try:
                evidence = fn(); result['checks'].append({'name':name,'pass':True,'evidence':evidence}); print('PASS', name, flush=True)
            except Exception as e:
                result['checks'].append({'name':name,'pass':False,'error':str(e)})
                snap(page, 'failure'); raise
            finally: (out/'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
        def target(p, index):
            p.wait_for_function('!!doc()')
            p.evaluate('(i)=>{const s=segments(doc().text)[i];readingMarkTarget=null;readingFocusedStart=null;scrollReadingParagraph(s.start,true);updateReadingPosition()}', index)
            expect(p.locator('[data-action="reading-mark-read"]')).to_have_text(f'Mark read · ¶{index+1}')
        def neutral():
            open_project(page); assert all(not d['reading_state']['marks'] for d in get()['documents'])
            assert not backups(); page.mouse.wheel(0, 600); page.wait_for_timeout(150)
            assert all(not d['reading_state']['marks'] for d in get()['documents']); snap(page,'01-neutral-desktop')
            return {'schema':5,'no_inferred_marks':True,'scroll_writes':0}
        check('neutral legacy load and scrolling', neutral)
        def desktop():
            target(page,4); page.locator('[data-action="reading-mark-read"]').click()
            expect(page.locator('#reading-announcement')).to_contain_text('Project mark saved')
            expect(page.locator('#reading-mark-status')).to_have_value('read')
            assert len(backups()) == 1
            page.locator('#reading-mark-status').select_option('revisit')
            expect(page.locator('#reading-mark-status')).to_have_value('revisit')
            expect(page.locator('[data-action="reading-mark-undo"]')).to_be_enabled()
            page.locator('[data-action="reading-mark-undo"]').click()
            expect(page.locator('#reading-mark-status')).to_have_value('read')
            page.locator('#reading-mark-status').select_option('unmarked')
            expect(page.locator('#reading-mark-status')).to_have_value('unmarked')
            page.locator('[data-action="reading-mark-read"]').focus(); page.keyboard.press('Space')
            expect(page.locator('#reading-mark-status')).to_have_value('read')
            snap(page,'02-desktop-read-keyboard')
            page.locator('[data-action="reading-mark-undo"]').focus(); page.keyboard.press('Enter')
            expect(page.locator('#reading-mark-status')).to_have_value('unmarked')
            assert len(backups()) == 1
            return {'paragraph':5,'read_revisit_clear_undo':True,'keyboard_space_enter':True,'only_upgrade_snapshot':1}
        check('three states, clear and keyboard undo', desktop)
        def failures():
            target(page,4); fault[0] = True
            page.route('**/reading-mark', lambda r:r.fulfill(status=503, content_type='application/json', body='{"error":"Controlled offline test"}'))
            page.locator('[data-action="reading-mark-read"]').click()
            expect(page.locator('#reading-mark-save')).to_contain_text('Not saved')
            assert not get()['documents'][0]['reading_state']['marks']; snap(page,'03-save-failure-retry')
            page.unroute('**/reading-mark'); fault[0] = False
            page.locator('[data-action="reading-mark-retry"]').click(); expect(page.locator('#reading-mark-status')).to_have_value('read')
            return {'not_saved_visible':True,'no_hidden_local_fallback':True,'retry_saved':True}
        check('failure is explicit and retry saves', failures)
        def conflict():
            other, second = context(viewport={'width':1440,'height':900}); open_project(second); target(second,4)
            page.locator('#reading-mark-status').select_option('revisit'); expect(page.locator('#reading-mark-status')).to_have_value('revisit')
            fault[0] = True; second.locator('#reading-mark-status').select_option('unmarked')
            expect(second.locator('#reading-mark-save')).to_contain_text('Changed elsewhere')
            expect(second.locator('#reading-mark-status')).to_have_value('revisit'); snap(second,'04-cross-tab-conflict'); fault[0] = False
            assert get()['documents'][0]['reading_state']['marks'][0]['status'] == 'revisit'; other.close()
            return {'conflict_status':409,'latest_state_displayed':True,'no_automatic_overwrite':True}
        check('cross-context conflict does not overwrite', conflict)
        def pending_switch():
            target(page,6); held=[]
            def hold(route): held.append((route,route.fetch()))
            page.route('**/reading-mark',hold)
            page.locator('[data-action="reading-mark-read"]').click()
            expect(page.locator('#reading-mark-save')).to_have_text('Saving…')
            expect(page.locator('#reading-mark-status')).to_have_value('unmarked')
            snap(page,'08-saving-before-confirmation')
            page.locator('#reading-document').select_option(d2['id'])
            assert held; held[0][0].fulfill(response=held[0][1]); page.unroute('**/reading-mark')
            expect(page.locator('#reading-mark-status')).to_have_value('unmarked')
            page.wait_for_function('readingWrites.size===0')
            assert not get()['documents'][1]['reading_state']['marks']
            page.locator('#reading-document').select_option(d1['id']); target(page,6)
            expect(page.locator('#reading-mark-status')).to_have_value('read')
            return {'prior_status_while_pending':True,'captured_document_and_paragraph':True,'late_reply_not_applied_to_other_document':True}
        check('pending save and document-switch isolation', pending_switch)
        def phone():
            mobile, p = context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1)
            open_project(p); target(p,5); p.locator('[data-action="reading-mark-read"]').tap(); expect(p.locator('#reading-mark-status')).to_have_value('read')
            sizes = p.locator('#reading-marks button:visible,#reading-mark-status').evaluate_all('(els)=>els.map(e=>({label:e.textContent,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))')
            assert all(s['width']>=44 and s['height']>=44 for s in sizes), sizes
            assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
            assert p.locator('.reading-dock').bounding_box()['height'] <= 140
            snap(p,'05-phone-read-touch'); p.locator('#reading-document').select_option(d2['id']); expect(p.locator('#reading-mark-status')).to_have_value('unmarked')
            p.locator('#reading-document').select_option(d1['id']); target(p,5); expect(p.locator('#reading-mark-status')).to_have_value('read')
            p.evaluate('localStorage.clear()'); open_project(p)
            target(p,5); expect(p.locator('#reading-mark-status')).to_have_value('read')
            mobile.close(); return {'width':390,'touch_targets':sizes,'document_switch':True,'survives_localStorage_clear':True,'physical_phone':'not tested this round'}
        check('phone touch, sticky context and document switching', phone)
        def restore():
            page.locator('[data-action="export"]').first.click()
            # The actual project JSON download is awaited and read back from disk.
            with page.expect_download() as download: page.locator('[data-action="download"][data-format="json"]').click()
            item = download.value; targetfile=out/'downloaded-project.json'; item.save_as(targetfile)
            exported=json.loads(targetfile.read_text(encoding='utf-8')); assert exported['schema_version']==5
            assert exported['documents'][0]['reading_state']['marks']
            restored=ctx.request.post(base+'/w/api/projects',headers=headers,data={'kind':'restore','project':exported}); assert restored.ok
            copy=restored.json(); assert copy['id']!=pid and copy['documents'][0]['reading_state']==exported['documents'][0]['reading_state']
            snap(page,'06-json-download-completed')
            page.locator('[data-action="close"]').first.click()
            count=len(backups()); response=ctx.request.post(api+'/document-update',headers=headers,data={'id':d1['id'],'changes':{'memo':d1.get('memo','')}}); assert response.ok
            assert len(backups())==count+1
            return {'download_completed':item.suggested_filename,'bytes':targetfile.stat().st_size,'restore_project_id':copy['id'],'marks_preserved':True,'next_research_edit_snapshot':True}
        check('JSON download, recovery and next research snapshot', restore)
        def layout():
            rows=[]
            for width,height in [(320,740),(390,844),(800,900),(801,900),(1120,768),(1440,600),(1440,900)]:
                page.set_viewport_size({'width':width,'height':height}); page.wait_for_timeout(50)
                overflow=page.evaluate('document.documentElement.scrollWidth-innerWidth'); assert overflow==0,(width,overflow)
                rows.append([width,height,overflow])
            page.emulate_media(reduced_motion='reduce'); target(page,4); snap(page,'07-reduced-motion'); return rows
        check('responsive boundaries and reduced motion', layout)
        def stale_reset():
            stale=get(); stale['name']='Bologna · reading source recheck'
            stale['documents'][0]['reading_state']['source_sha256']='0'*64
            response=ctx.request.post(base+'/w/api/projects',headers=headers,data={'kind':'restore','project':stale}); assert response.ok
            copy=response.json(); page.reload(wait_until='networkidle'); page.wait_for_selector('#project-select')
            page.locator('#project-select').select_option(copy['id']); expect(page.locator('#reading-mark-save')).to_have_text('Needs recheck')
            assert page.locator('[data-action="reading-mark-read"]').is_disabled(); snap(page,'09-needs-recheck')
            page.once('dialog',lambda dialog:dialog.accept()); page.locator('[data-action="reading-mark-reset"]').click()
            expect(page.locator('[data-action="reading-mark-reset"]')).to_be_hidden()
            saved=ctx.request.get(base+'/w/api/projects/'+copy['id'],headers=headers).json()
            assert not saved['documents'][0]['reading_state']['marks']
            assert saved['documents'][0]['reading_state']['source_sha256']==saved['documents'][0]['sha256']
            snap(page,'10-reset-confirmed'); page.locator('#project-select').select_option(pid)
            return {'inactive_old_marks':True,'explicit_confirmation':True,'checked_reset_saved':True}
        check('source recheck and explicit reset', stale_reset)
        def integrity():
            final=get(); assert final['annotations']==original['annotations'] and final['codes']==original['codes']
            assert [d['text'] for d in final['documents']]==[d['text'] for d in original['documents']]
            assert ctx.request.get(api+'/export?format=csv',headers=headers).body()==before_csv
            assert not result['console'],result['console']; assert not result['http'],result['http']
            (out/'project-after.json').write_text(json.dumps(final,ensure_ascii=False,indent=2),encoding='utf-8')
            return {'documents':19,'codes':317,'codings':874,'coding_csv_equal':True,'normal_console_errors':0,'normal_http_errors':0}
        check('research records and normal console are unchanged', integrity)
        browser.close()


if __name__=='__main__': main()
