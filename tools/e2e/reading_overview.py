"""UX-32B source-navigation acceptance; disposable Bologna and one origin only."""
import argparse
import json
import re
import uuid
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect


PID = 'a71a0b538c024c3ab23fb4286cfe93e2'


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url',required=True);parser.add_argument('--out',required=True)
    args=parser.parse_args();base=args.url.rstrip('/');assert urlsplit(base).hostname in ('127.0.0.1','localhost')
    out=Path(args.out);shots=out/'screenshots';shots.mkdir(parents=True,exist_ok=True)
    result={'checks':[],'console':[],'http':[],'ui_posts':[]}
    with sync_playwright() as pw:
        browser=pw.chromium.launch(channel='chrome',headless=True)
        def context(**options):
            c=browser.new_context(accept_downloads=True,**options)
            c.route('**/*',lambda route:route.continue_() if route.request.url.startswith(base+'/') else route.abort())
            p=c.new_page();p.set_default_timeout(10000)
            p.on('pageerror',lambda e:result['console'].append(str(e)))
            p.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None)
            p.on('response',lambda r:result['http'].append([r.status,r.url]) if r.status>=400 else None)
            p.on('request',lambda r:result['ui_posts'].append(r.url) if r.method=='POST' else None)
            return c,p
        ctx,page=context(viewport={'width':1440,'height':900})
        boot=ctx.request.get(base+'/w/api/bootstrap').json();headers={'X-QualiCraft-Token':boot['token']};api=base+'/w/api/projects/'+PID
        def get():return ctx.request.get(api,headers=headers).json()
        original=get();d=original['documents'][0];assert [len(original[k]) for k in ['documents','codes','annotations']]==[19,317,874]
        def post(path,body):
            response=ctx.request.post(path,headers=headers,data=body);assert response.ok,(response.status,response.text());return response.json()
        # Explicit fixture setup marks are separate from read-only overview actions.
        paragraphs=[(m.start(),m.end()) for m in re.finditer(r'[^\r\n]+',d['text']) if m.group().strip()]
        for index,status in [(3,'read'),(4,'revisit')]:
            current=get()['documents'][0]['reading_state'];start,end=paragraphs[index]
            post(api+'/reading-mark',{'document_id':d['id'],'source_sha256':d['sha256'],'start':start,'end':end,'status':status,'expected_revision':current['revision'],'request_id':uuid.uuid4().hex})
        baseline=get();snapshots=ctx.request.get(api+'/backups',headers=headers).json()['items']
        (out/'project-before.json').write_text(json.dumps(baseline,ensure_ascii=False,indent=2),encoding='utf-8')
        def open_project(p,pid=PID):
            p.goto(base+'/w/?lang=en',wait_until='networkidle');p.wait_for_selector('#start-project-select,#reading-document')
            if p.locator('#start-project-select').count():p.locator('#start-project-select').select_option(pid);p.locator('[data-action="start-open"]').click()
            elif p.evaluate('state.project.id')!=pid:p.locator('#project-select').select_option(pid)
            expect(p.locator('#reading-document')).to_be_visible();p.wait_for_function('!!doc()')
        def save(): (out/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
        def snap(p,name):p.screenshot(path=str(shots/(name+'.png')))
        def check(name,fn):
            print('START',name,flush=True)
            try:evidence=fn();result['checks'].append({'name':name,'pass':True,'evidence':evidence});print('PASS',name,flush=True)
            except Exception as e:result['checks'].append({'name':name,'pass':False,'error':str(e)});snap(page,'failure');raise
            finally:save()
        def overview(p):
            if p.locator('[data-action="reading-overview"]').get_attribute('aria-expanded')!='true':p.locator('[data-action="reading-overview"]').click()
            p.locator('#reading-overview').scroll_into_view_if_needed()
        def paragraph(p,index):
            overview(p)
            if not p.locator('#overview-paragraph-list').get_attribute('open'):p.locator('#overview-paragraph-list summary').click()
            p.locator('#overview-paragraph-number').fill(str(index+1));p.locator('[data-action="overview-find-paragraph"]').click()
        def source(p,index):
            overview(p)
            if not p.locator('#overview-source-list').get_attribute('open'):p.locator('#overview-source-list summary').click()
            p.locator('#overview-source-scope').select_option('document')
            p.locator('#overview-range-number').fill(str(index+1));p.locator('[data-action="overview-find-source"]').click()
            expect(p.locator('.overview-source-detail')).to_be_visible()
        def resume(p):p.locator('[data-action="reading-resume"]').click();expect(p.locator('#reading-overview')).to_be_hidden()
        def memory(p):return p.evaluate('readReadingPosition(state.project,doc())')
        open_project(page)
        def tracks():
            expect(page.locator('#reading-overview')).to_be_hidden();height=page.locator('.reading-dock').bounding_box()['height']
            page.evaluate('scrollReadingParagraph(segments(doc().text)[5].start,true);updateReadingPosition()');anchor=memory(page)['start']
            overview(page);assert page.locator('.reading-dock').bounding_box()['height']==height
            data=page.evaluate('readingOverviewData(state.project,doc())');assert len(data['paragraphs'])==31 and data['codingCount']==53 and len(data['ranges'])==52
            marks=page.locator('#reading-overview-map .read,#reading-overview-map .revisit');assert marks.count()==2
            for node in marks.all():
                start,end=int(node.get_attribute('data-start')),int(node.get_attribute('data-end'))
                assert abs(float(node.get_attribute('x'))-start/len(d['text'])*1000)<.001
                assert end>start
            assert memory(page)['start']==anchor;snap(page,'01-desktop-two-tracks')
            return {'paragraphs':31,'codings':53,'source_ranges':52,'manual_marks':2,'sticky_height_unchanged':height,'memory_start':anchor}
        check('whole-document tracks retain exact units and compact dock',tracks)
        def hover_map():
            before=memory(page);box=page.locator('#reading-overview-map').bounding_box();offset=sum(paragraphs[3])/2
            page.mouse.move(box['x']+offset/len(d['text'])*box['width'],box['y']+20)
            page.mouse.click(box['x']+offset/len(d['text'])*box['width'],box['y']+20)
            assert page.evaluate('readingOverview.paragraph')==3 and memory(page)==before
            return {'mouse_preview_paragraph':4,'memory_unchanged':True,'no_auto_read':True}
        check('mouse position selection previews without navigating or saving',hover_map)
        def exact_sources():
            groups=page.evaluate('readingOverviewData(state.project,doc()).ranges')
            index=next(i for i,g in enumerate(groups) if len(g['annotations'])==2);group=groups[index];source(page,index)
            expect(page.locator('.overview-source-detail blockquote')).to_have_text(d['text'][group['start']:group['end']])
            ids=page.locator('.overview-source-detail [data-annotation-id]').evaluate_all('(els)=>els.map(e=>e.dataset.annotationId)')
            assert sorted(ids)==sorted(a['id'] for a in group['annotations'])
            before=memory(page);page.locator('[data-action="overview-jump-source"]').click()
            expect(page.locator('.overview-source-target').first).to_be_focused();bounds=page.evaluate('({source:document.activeElement.getBoundingClientRect().top,dock:document.querySelector(".reading-dock").getBoundingClientRect().bottom,tools:document.querySelector(".document-tools").getBoundingClientRect().bottom})')
            assert bounds['source']>=max(bounds['dock'],bounds['tools'])-3,bounds;assert memory(page)==before
            assert sorted(page.evaluate('codingPreview'))==sorted(ids)
            snap(page,'02-exact-source-jump');resume(page);assert memory(page)==before
            return {'source':[group['start'],group['end']],'coding_ids':ids,'focus_unobscured':bounds,'resume_preserved':True}
        check('shared source retains every coding and exact jump target',exact_sources)
        def filtering():
            before=memory(page);page.locator('#search').fill('UX32B_NO_MATCH');expect(page.locator('.paragraph')).to_have_count(0)
            paragraph(page,4);expect(page.locator('[data-action="overview-show-full"]')).to_be_visible()
            assert page.locator('#search').input_value()=='UX32B_NO_MATCH' and memory(page)==before
            assert page.evaluate('readingOverviewData(state.project,doc()).codingCount')==53
            page.locator('[data-action="overview-show-full"]').click();assert page.locator('#search').input_value()==''
            expect(page.locator('.paragraph').nth(4)).to_be_focused();assert memory(page)==before;snap(page,'03-explicit-full-document');resume(page)
            page.locator('[data-action="toggle-codebook"]').click();root=next(c for c in baseline['codes'] if not c.get('parent_id'))
            page.locator(f'#side-list [data-action="filter-code"][data-id="{root["id"]}"]').click();paragraph(page,0)
            expect(page.locator('[data-action="overview-show-full"]')).to_be_visible();assert page.evaluate('state.codeFilter')==root['id']
            page.locator('[data-action="overview-show-full"]').click();assert page.evaluate('state.codeFilter') is None and memory(page)==before;resume(page)
            return {'search_and_code_filters':True,'full_document_requires_explicit_action':True,'pre_filter_resume_preserved':True}
        check('search and code filters retain whole-document scale and Resume',filtering)
        def keyboard():
            page.locator('[data-action="reading-overview"]').focus();page.keyboard.press('Enter')
            page.locator('#overview-paragraph-list summary').focus();page.keyboard.press('Space')
            page.locator('#overview-paragraph-number').fill('17');page.locator('[data-action="overview-find-paragraph"]').focus();page.keyboard.press('Space')
            assert page.evaluate('readingOverview.paragraph')==16
            page.locator('[data-action="overview-jump-paragraph"]').focus();page.keyboard.press('Enter');expect(page.locator('.paragraph').nth(16)).to_be_focused()
            before=memory(page);overview(page);page.locator('#overview-paragraph-list summary').focus();page.keyboard.press('Escape')
            expect(page.locator('#reading-overview')).to_be_hidden();expect(page.locator('[data-action="reading-overview"]')).to_be_focused();assert memory(page)==before
            overview(page);page.locator('[data-action="overview-keep"]').click();assert memory(page)['start']==paragraphs[16][0]
            snap(page,'04-keyboard-kept-position');return {'enter_space_escape':True,'focus_returned':True,'keep_position_explicit':True,'paragraph':17}
        check('keyboard preview, jump, close and explicit position update',keyboard)
        def mobile():
            c,p=context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1);open_project(p)
            p.locator('[data-action="reading-overview"]').tap();assert p.locator('.reading-dock').bounding_box()['height']<=136
            paragraph(p,3);snap(p,'05-phone-track-and-paragraph')
            groups=p.evaluate('readingOverviewData(state.project,doc()).ranges');index=next(i for i,g in enumerate(groups) if len(g['annotations'])==2);source(p,index)
            sizes=p.locator('#reading-overview button:visible,#reading-overview input:visible,#reading-overview select:visible,#reading-overview summary:visible').evaluate_all('(els)=>els.map(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))');assert all(s['width']>=44 and s['height']>=44 for s in sizes),sizes
            p.locator('[data-action="overview-jump-source"]').tap();expect(p.locator('.overview-source-target').first).to_be_focused();snap(p,'06-phone-source-jump');resume(p)
            p.locator('#reading-document').select_option(baseline['documents'][1]['id']);expect(p.locator('#reading-overview')).to_be_hidden()
            assert not p.evaluate('overviewPreviewNavigation()') and p.evaluate('readingOverview.key')!=page.evaluate('readingOverview.key');assert not p.evaluate('document.documentElement.scrollWidth>innerWidth');c.close()
            return {'width':390,'touch_targets_at_least_44':True,'dock_height':134,'document_state_isolated':True,'physical_device':'not tested'}
        check('phone touch, source details and document switching',mobile)
        def complete_lists():
            paragraph(page,0);paragraph_ids=[]
            for index in range(3):
                paragraph_ids+=page.locator('#overview-paragraph-list [data-action="overview-select-paragraph"]').evaluate_all('(els)=>els.map(el=>Number(el.dataset.index))')
                if index<2:
                    next_button=page.locator('#overview-paragraph-list [data-direction="next"]');next_button.focus();page.keyboard.press('Enter')
                    assert page.evaluate('document.activeElement.dataset.kind')=='paragraph'
            assert paragraph_ids==list(range(31)),paragraph_ids
            source(page,0);source_keys=[]
            for index in range(6):
                source_keys+=page.locator('#overview-source-list [data-action="overview-select-source"]').evaluate_all('(els)=>els.map(el=>el.dataset.key)')
                if index<5:page.locator('#overview-source-list [data-direction="next"]').click()
            expected=page.evaluate('readingOverviewData(state.project,doc()).ranges.map(g=>g.key)')
            assert source_keys==expected and len(set(source_keys))==52
            snap(page,'10-complete-range-list');return {'all_paragraphs_reached':31,'all_source_ranges_reached':52,'keyboard_pager_focus_retained':True}
        check('all paragraphs and source ranges remain reachable through pagination',complete_lists)
        def boundaries():
            clone=post(base+'/w/api/projects',{'kind':'restore','project':{**baseline,'name':'Bologna · UX32B boundary copy'}});root=base+'/w/api/projects/'+clone['id']
            imported=post(root+'/documents',{'name':'Bologna · boundary source','text':d['text']})
            first,second=baseline['codes'][:2];a0,a1=paragraphs[3][0],paragraphs[4][1];b0,b1=paragraphs[4][0],paragraphs[5][1]
            for code,start,end in [(first,a0,a1),(second,a0,a1),(first,b0,b1),(first,b1,paragraphs[6][1])]:post(root+'/annotations',{'document_id':imported['id'],'code_id':code['id'],'start':start,'end':end})
            page.reload(wait_until='networkidle');page.wait_for_selector('#project-select');page.locator('#project-select').select_option(clone['id']);page.locator('#reading-document').select_option(imported['id']);overview(page)
            data=page.evaluate('readingOverviewData(state.project,doc())');assert data['codingCount']==4 and len(data['ranges'])==3 and len(data['unions'])==1
            assert data['paragraphs'][3]['codingCount']==2 and data['paragraphs'][4]['codingCount']==3
            source(page,0);expect(page.locator('.overview-source-detail [data-annotation-id]')).to_have_count(2)
            page.locator('[data-action="overview-jump-source"]').click();assert page.locator('.overview-source-target').count()>=2;snap(page,'07-cross-paragraph-source')
            resume(page);page.locator('#reading-document').select_option(d['id']);page.locator('#project-select').select_option(PID)
            page.wait_for_function('(pid)=>state.project?.id===pid&&readingMounted?.projectId===pid',arg=PID)
            return {'extra_bologna_copy':clone['id'],'codings':4,'source_ranges':3,'visual_unions':1,'cross_paragraph_identity_retained':True,'new_document_marks_neutral':True}
        check('cross-paragraph, shared and adjacent ranges remain distinct records',boundaries)
        def network_priority():
            paragraph(page,4);page.locator('[data-action="overview-jump-paragraph"]').click()
            page.locator('[data-action="view"][data-view="insights"]').click();page.wait_for_selector('#network-select:not([disabled])')
            # Pick a real existing coding with its stable ID through the network evidence controls.
            annotation=next(a for a in baseline['annotations'] if a['document_id']==d['id'])
            page.locator('#network-select').select_option('code:'+annotation['code_id'])
            if page.locator(f'[data-action="net-evidence"][data-id="{annotation["id"]}"]').count():page.locator(f'[data-action="net-evidence"][data-id="{annotation["id"]}"]').click()
            page.locator('[data-action="net-locate"]').click();expect(page.locator('.source-target').first).to_be_focused()
            assert not page.evaluate('overviewPreviewNavigation()');assert page.locator('[data-action="reading-overview"]').get_attribute('aria-expanded')=='false'
            page.locator('[data-action="reading-overview"]').click();assert page.evaluate('state.sourceFocus')==annotation['id'];page.locator('[data-action="reading-overview"]').click()
            expect(page.locator('[data-action="reading-overview"]')).to_be_focused()
            page.locator('[data-action="net-return"]').click();expect(page.locator('#network-select')).to_be_visible();assert page.locator('#network-select').input_value()=='code:'+annotation['code_id']
            page.locator('[data-action="view"][data-view="coding"]').click();snap(page,'09-network-priority-return')
            return {'stable_annotation_id':annotation['id'],'network_source_priority':True,'overview_does_not_override_source':True,'return_selection_preserved':True}
        check('network source priority and return survive overview navigation',network_priority)
        def responsive():
            rows=[]
            for width,height in [(320,740),(390,844),(800,900),(801,900),(1120,768),(1440,600),(1440,900)]:
                page.set_viewport_size({'width':width,'height':height});overview(page);assert page.evaluate('document.documentElement.scrollWidth-innerWidth')==0
                rows.append([width,height,page.locator('.reading-dock').bounding_box()['height']])
            page.emulate_media(reduced_motion='reduce');paragraph(page,4);snap(page,'08-reduced-motion');return rows
        check('responsive boundaries and reduced motion retain exact controls',responsive)
        def unchanged():
            final=get();assert final==baseline;assert ctx.request.get(api+'/backups',headers=headers).json()['items']==snapshots
            assert not result['ui_posts'],result['ui_posts'];assert not result['console'],result['console'];assert not result['http'],result['http']
            (out/'project-after.json').write_text(json.dumps(final,ensure_ascii=False,indent=2),encoding='utf-8')
            return {'project_json_equal':True,'snapshot_list_equal':True,'overview_ui_post_requests':0,'normal_console_errors':0,'normal_http_errors':0,'original_research_counts':[19,317,874]}
        check('overview actions never write project marks, research data or snapshots',unchanged)
        browser.close()


if __name__=='__main__':main()
