"""UX33-01: preserve a Bologna reading position across native search focus."""
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
    args=parser.parse_args();base=args.url.rstrip('/')
    assert urlsplit(base).scheme=='http' and urlsplit(base).hostname in ('localhost','127.0.0.1')
    out=Path(args.out);shots=out/'screenshots';shots.mkdir(parents=True,exist_ok=True)
    result={'checks':[],'console':[],'http':[],'ui_posts':[]};contexts=[]
    def save(): (out/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    with sync_playwright() as pw:
        browser=pw.chromium.launch(channel='chrome',headless=True);api_context=browser.new_context()
        boot=api_context.request.get(base+'/w/api/bootstrap').json();headers={'X-QualiCraft-Token':boot['token']}
        def get(url):
            response=api_context.request.get(url,headers=headers);assert response.ok;return response.json()
        def post(url,data):
            response=api_context.request.post(url,headers=headers,data=data);assert response.ok,(response.status,response.text());return response.json()
        original_url=base+'/w/api/projects/'+PID;original=get(original_url)
        assert [len(original[k]) for k in ['documents','codes','annotations']]==[19,317,874]
        path=out/'fixture.json'
        if path.exists():
            fixture=json.loads(path.read_text(encoding='utf-8'));assert fixture['origin']==base
        else:
            copy=post(base+'/w/api/projects',{'kind':'restore','project':{**original,'name':'Bologna · UX35 search review'}})
            api=base+'/w/api/projects/'+copy['id'];d=copy['documents'][0]
            paragraphs=[(m.start(),m.end()) for m in re.finditer(r'[^\r\n]+',d['text']) if m.group().strip()]
            for index,status in [(3,'read'),(4,'revisit')]:
                state=get(api)['documents'][0]['reading_state'];start,end=paragraphs[index]
                post(api+'/reading-mark',{'document_id':d['id'],'source_sha256':d['sha256'],'start':start,'end':end,'status':status,'expected_revision':state['revision'],'request_id':uuid.uuid4().hex})
            fixture={'origin':base,'project_id':copy['id']};path.write_text(json.dumps(fixture,indent=2),encoding='utf-8')
        api=base+'/w/api/projects/'+fixture['project_id'];baseline=get(api);snapshots=get(api+'/backups')['items'];original_snapshots=get(original_url+'/backups')['items']
        (out/'project-before.json').write_text(json.dumps(baseline,ensure_ascii=False,indent=2),encoding='utf-8')
        first=baseline['documents'][0];offsets=[m.start() for m in re.finditer(r'[^\r\n]+',first['text']) if m.group().strip()]
        def context(width=390,height=844,blocked=False):
            c=browser.new_context(viewport={'width':width,'height':height},is_mobile=width<=390,has_touch=width<=390)
            c.route('**/*',lambda q:q.continue_() if q.request.url.startswith(base+'/') else q.abort())
            if blocked:c.add_init_script("Object.defineProperty(window,'localStorage',{get(){throw Error('blocked')}})")
            p=c.new_page();p.set_default_timeout(10000);contexts.append(c)
            p.on('pageerror',lambda e:result['console'].append(str(e)))
            p.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None)
            p.on('response',lambda r:result['http'].append([r.status,r.url]) if r.status>=400 else None)
            p.on('request',lambda r:result['ui_posts'].append(r.url) if r.method=='POST' else None)
            return c,p
        def opened(p):
            p.goto(base+'/w/?lang=en',wait_until='networkidle')
            p.locator('#start-project-select').select_option(fixture['project_id']);p.locator('[data-action="start-open"]').click()
            expect(p.locator('#reading-document')).to_be_visible();p.locator('#reading-document').select_option(first['id'])
            p.evaluate('scrollReadingParagraph(segments(doc().text)[3].start,true);updateReadingPosition()')
        def memory(p):return p.evaluate('readReadingPosition(state.project,doc())?.start??null')
        def snap(p,name):p.screenshot(path=str(shots/(name+'.png')))
        def focus(p,method='tab',expected=872):
            if method=='tab':
                p.locator('[data-action="reading-overview"]').focus()
                for _ in range(12):
                    p.keyboard.press('Tab');p.wait_for_timeout(70)
                    if p.evaluate('document.activeElement.id')=='search':break
            elif method=='tap':p.locator('#search').tap()
            else:p.locator('#search').click()
            expect(p.locator('#search')).to_be_focused();p.wait_for_timeout(100)
            assert memory(p)==expected,{'expected':expected,'actual':memory(p),'input':method}
        def returned(p,start=872,focused=False,stored=True):
            p.wait_for_timeout(120);assert p.evaluate('readingMounted.start')==start,(start,p.evaluate('readingMounted.start'))
            assert memory(p)==(start if stored else None)
            if focused:expect(p.locator(f'.paragraph[data-start="{start}"]')).to_be_focused()
            assert p.evaluate('document.documentElement.scrollWidth-innerWidth')==0
        def clear(p):p.locator('#search').fill('')
        def check(name,fn):
            print('START',name,flush=True)
            try:result['checks'].append({'name':name,'pass':True,'evidence':fn()});print('PASS',name,flush=True)
            except Exception as e:
                result['checks'].append({'name':name,'pass':False,'error':str(e)});print('FAIL',name,str(e),flush=True)
                if contexts:contexts[-1].pages[0].screenshot(path=str(shots/('failure-'+str(len(result['checks']))+'.png')))
            finally:
                for c in contexts:c.close()
                contexts.clear();save()
        def tab_only():
            _,p=context();opened(p);snap(p,'01-phone-before-focus');focus(p);snap(p,'02-phone-search-focused')
            p.keyboard.press('Tab');p.wait_for_timeout(100);assert memory(p)==872
            p.locator('[data-action="reading-resume"]').press('Enter');returned(p,focused=True);snap(p,'03-phone-focus-only-resume')
            return {'native_Tab_before_typing':872,'blur_without_query':872,'resume':872}
        check('native phone Tab focus and blur preserve the pre-search anchor',tab_only)
        def matching():
            _,p=context();opened(p);focus(p,'tap');p.keyboard.type('trascrizione');assert memory(p)==872
            assert p.locator('.paragraph').count()>0;clear(p);returned(p);snap(p,'04-phone-query-cleared')
            p.locator('[data-action="reading-resume"]').tap();returned(p,focused=True)
            return {'touch_focus':872,'matching_query_clear_and_Resume':872}
        check('phone touch search, matching query, clear input and Resume return accurately',matching)
        def no_match():
            _,p=context();opened(p);focus(p,'tap');p.keyboard.type('UX35_NO_MATCH');expect(p.locator('.paragraph')).to_have_count(0)
            assert memory(p)==872;snap(p,'05-phone-no-match');p.locator('[data-action="clear-filter"]').first.tap();returned(p)
            p.locator('[data-action="reading-resume"]').tap();returned(p,focused=True);snap(p,'06-phone-clear-filters-return')
            return {'no_match_does_not_save_zero':True,'clear_filters_and_Resume':872}
        check('no-match results and Clear filters retain the full-document position',no_match)
        def theme():
            _,p=context();opened(p);focus(p,'tap');p.keyboard.type('UX35_NO_MATCH')
            p.locator('[data-action="coding-codebook"]').tap();root=next(c for c in baseline['codes'] if not c.get('parent_id'))
            p.locator(f'#mobile-codebook-list [data-action="filter-code"][data-id="{root["id"]}"]').tap();assert memory(p)==872
            assert p.evaluate('state.codeFilter')==root['id'] and p.locator('#search').input_value()=='UX35_NO_MATCH'
            p.locator('[data-action="clear-filter"]').first.tap();returned(p);assert p.evaluate('state.codeFilter') is None
            snap(p,'07-phone-combined-filter-return');return {'theme_id':root['id'],'combined_filters_clear_to':872}
        check('combined theme and text filters keep their meanings and original anchor',theme)
        def overview(keep=False):
            _,p=context();opened(p);focus(p,'tap');p.keyboard.type('UX35_NO_MATCH');p.locator('[data-action="reading-overview"]').tap()
            p.locator('#overview-paragraph-list summary').tap();p.locator('#overview-paragraph-number').fill('6');p.locator('[data-action="overview-find-paragraph"]').tap()
            p.locator('[data-action="overview-show-full"]').tap();assert memory(p)==872
            if keep:
                p.locator('[data-action="overview-keep"]').tap();returned(p,offsets[5],focused=True)
                p.reload(wait_until='networkidle');returned(p,offsets[5]);snap(p,'09-phone-explicit-Keep-replaces-search-return')
            else:
                p.locator('[data-action="reading-resume"]').tap();returned(p,focused=True);snap(p,'08-phone-preview-Resume')
            return {'preview_does_not_replace_search_anchor':True,'explicit_choice':'Keep' if keep else 'Resume','saved_start':memory(p)}
        check('filtered overview source jump preserves the original Resume position',lambda:overview(False))
        check('explicit Keep overrides the old search return without regressing UX33-02',lambda:overview(True))
        def real_reading():
            c,p=context();opened(p);focus(p,'tap');p.keyboard.type('trascrizione');clear(p);returned(p)
            p.evaluate('scrollReadingParagraph(segments(doc().text)[4].start,true);updateReadingPosition()')
            s=c.new_cdp_session(p)
            for _ in range(3):
                s.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':75,'y':760}]})
                for y in [660,560,460,360,260]:
                    s.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':75,'y':y}]});p.wait_for_timeout(25)
                s.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});p.wait_for_timeout(150)
            s.detach();now=memory(p);assert now>offsets[4],now
            focus(p,'tap',now);p.keyboard.type('UX35_NO_MATCH');clear(p);returned(p,now);snap(p,'10-phone-real-reading-next-search')
            return {'actual_reading_advances_to':now,'next_search_returns_there':True}
        check('real touch reading after search advances the next search anchor',real_reading)
        def first_paragraph():
            _,p=context();opened(p);box=p.locator('.paragraph').nth(3).bounding_box();p.mouse.move(box['x']+50,400);p.mouse.wheel(0,-10000);p.wait_for_timeout(250)
            assert memory(p)==0;focus(p,'tap',0);p.keyboard.type('UX35_NO_MATCH');clear(p);returned(p,0)
            return {'intentional_wheel_to_beginning_updates_anchor':0}
        check('deliberately reading back at the beginning does not restore a stale later anchor',first_paragraph)
        def desktop():
            for method in ['tab','click']:
                _,p=context(1440,900);opened(p);focus(p,method);p.keyboard.type('UX35_NO_MATCH');clear(p);returned(p)
                p.locator('[data-action="reading-resume"]').press('Enter');returned(p,focused=True);snap(p,'11-desktop-'+method)
            return {'desktop_native_Tab_and_mouse':True,'saved_start':872}
        check('desktop keyboard and mouse searches preserve the same paragraph',desktop)
        def responsive():
            rows=[]
            for width,height in [(320,740),(390,600),(390,844)]:
                _,p=context(width,height);opened(p);focus(p,'tap');p.keyboard.type('UX35_NO_MATCH')
                if height==844:p.set_viewport_size({'width':844,'height':390})
                clear(p);returned(p);rows.append([width,height,memory(p)]);snap(p,f'12-responsive-{width}-{height}')
            return rows
        check('narrow, short and rotated phone layouts retain search return and full content',responsive)
        def isolation():
            _,p=context();opened(p);focus(p,'tap');p.keyboard.type('UX35_NO_MATCH');p.locator('#reading-document').select_option(baseline['documents'][1]['id'])
            p.evaluate('scrollReadingParagraph(segments(doc().text)[3].start,true);updateReadingPosition()');other=memory(p)
            p.locator('#reading-document').select_option(first['id']);returned(p);p.locator('#reading-document').select_option(baseline['documents'][1]['id']);assert memory(p)==other
            p.locator('#reading-document').select_option(first['id']);focus(p,'tap');p.keyboard.type('UX35_NO_MATCH')
            def switch(pid):
                if p.locator('#project-select').is_visible():p.locator('#project-select').select_option(pid)
                else:
                    p.locator('[data-action="projects"]:visible').first.tap();p.locator('#modal-project-select').select_option(pid);p.locator('[data-action="switch-project"]').tap()
                p.wait_for_function('(pid)=>state.project?.id===pid&&readingMounted?.projectId===pid',arg=pid)
            switch(PID)
            p.evaluate('scrollReadingParagraph(segments(doc().text)[5].start,true);updateReadingPosition()');original_anchor=memory(p)
            switch(fixture['project_id']);returned(p)
            p.reload(wait_until='networkidle');returned(p);snap(p,'13-project-document-reload-return')
            return {'other_document':other,'other_project':original_anchor,'original_copy_return':872,'reload':True}
        check('document and project changes discard stale search state while preserving independent anchors',isolation)
        def blocked():
            _,p=context(blocked=True);opened(p);p.locator('#search').tap();p.keyboard.type('UX35_NO_MATCH');clear(p);returned(p,stored=False)
            expect(p.locator('[data-action="reading-resume"]')).to_be_disabled();snap(p,'14-blocked-storage-temporary-return')
            return {'temporary_return':872,'persisted_memory':None,'Resume_honestly_disabled':True}
        check('blocked browser storage allows temporary return without claiming saved memory',blocked)
        def unchanged():
            assert get(api)==baseline and get(api+'/backups')['items']==snapshots
            assert get(original_url)==original and get(original_url+'/backups')['items']==original_snapshots
            assert not result['console'] and not result['http'] and not result['ui_posts'],result
            (out/'project-after.json').write_text(json.dumps(get(api),ensure_ascii=False,indent=2),encoding='utf-8')
            return {'project_and_original_JSON_equal':True,'snapshots_equal':True,'ui_POSTs':0,'console':0,'HTTP':0,'source_counts':[19,317,874]}
        check('search navigation never changes source, codes, marks, audit or snapshots',unchanged)
        browser.close();save()
    raise SystemExit(0 if all(c['pass'] for c in result['checks']) else 1)


if __name__=='__main__':main()
