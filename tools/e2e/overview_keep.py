"""UX33-02: Keep a source position across control scrolling, on Bologna copies only."""
import argparse
import json
import re
import uuid
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect


PID = 'a71a0b538c024c3ab23fb4286cfe93e2'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', required=True)
    parser.add_argument('--out', required=True)
    args = parser.parse_args(); base = args.url.rstrip('/')
    assert urlsplit(base).hostname in ('127.0.0.1', 'localhost') and urlsplit(base).scheme == 'http'
    out = Path(args.out); shots = out/'screenshots'; shots.mkdir(parents=True, exist_ok=True)
    result = {'checks': [], 'console': [], 'http': [], 'ui_posts': [], 'known_open': []}
    def save():
        (out/'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='chrome', headless=True)
        def context(width=390, height=844):
            c = browser.new_context(viewport={'width': width, 'height': height}, is_mobile=width<=390, has_touch=width<=390)
            c.route('**/*', lambda q: q.continue_() if q.request.url.startswith(base+'/') else q.abort())
            p = c.new_page(); p.set_default_timeout(12000)
            p.on('pageerror', lambda e: result['console'].append(str(e)))
            p.on('console', lambda m: result['console'].append(m.text) if m.type=='error' else None)
            p.on('response', lambda r: result['http'].append([r.status, r.url]) if r.status>=400 else None)
            p.on('request', lambda r: result['ui_posts'].append(r.url) if r.method=='POST' else None)
            return c, p
        api_context = browser.new_context()
        boot = api_context.request.get(base+'/w/api/bootstrap').json()
        headers = {'X-QualiCraft-Token': boot['token']}
        def get(url):
            response = api_context.request.get(url, headers=headers); assert response.ok; return response.json()
        def post(url, data):
            response = api_context.request.post(url, headers=headers, data=data)
            assert response.ok, (response.status, response.text()); return response.json()
        source = get(base+'/w/api/projects/'+PID)
        assert [len(source[k]) for k in ['documents', 'codes', 'annotations']]==[19, 317, 874]
        fixture_path = out/'fixture.json'
        if fixture_path.exists():
            fixture = json.loads(fixture_path.read_text(encoding='utf-8')); assert fixture['origin']==base
        else:
            # Explicit preparation writes are separate from the read-only UI checks.
            copy = post(base+'/w/api/projects', {'kind': 'restore', 'project': {**source, 'name': 'Bologna · UX34 Keep review'}})
            api = base+'/w/api/projects/'+copy['id']
            d = post(api+'/documents', {'name': 'Bologna · Keep review', 'text': source['documents'][0]['text']})
            for name in ['keeping working materials after the end of the project', 'working with others as part of a team']:
                code = next(c for c in copy['codes'] if c['name']==name)
                post(api+'/annotations', {'document_id': d['id'], 'code_id': code['id'], 'start': 2, 'end': 38})
            paragraphs = [(m.start(), m.end()) for m in re.finditer(r'[^\r\n]+', d['text']) if m.group().strip()]
            for index, status in [(3, 'read'), (4, 'revisit')]:
                current = next(row for row in get(api)['documents'] if row['id']==d['id'])['reading_state']
                start, end = paragraphs[index]
                post(api+'/reading-mark', {'document_id': d['id'], 'source_sha256': d['sha256'], 'start': start, 'end': end, 'status': status, 'expected_revision': current['revision'], 'request_id': uuid.uuid4().hex})
            fixture = {'origin': base, 'project_id': copy['id'], 'document_id': d['id']}
            fixture_path.write_text(json.dumps(fixture, indent=2), encoding='utf-8')
        api = base+'/w/api/projects/'+fixture['project_id']; baseline = get(api); snapshots = get(api+'/backups')['items']
        (out/'project-before.json').write_text(json.dumps(baseline, ensure_ascii=False, indent=2), encoding='utf-8')
        d = next(d for d in baseline['documents'] if d['id']==fixture['document_id'])
        paragraphs = [(m.start(), m.end()) for m in re.finditer(r'[^\r\n]+', d['text']) if m.group().strip()]
        def open_project(p):
            p.goto(base+'/w/?lang=en', wait_until='networkidle')
            p.locator('#start-project-select').select_option(fixture['project_id'])
            p.locator('[data-action="start-open"]').click(); expect(p.locator('#reading-document')).to_be_visible()
            p.locator('#reading-document').select_option(d['id'])
            p.evaluate('scrollReadingParagraph(segments(doc().text)[16].start,true);updateReadingPosition()')
        def jump(p, index):
            p.locator('[data-action="reading-overview"]').click()
            p.locator('#overview-paragraph-list summary').click()
            p.locator('#overview-paragraph-number').fill(str(index+1))
            p.locator('[data-action="overview-find-paragraph"]').click()
            p.locator('[data-action="overview-jump-paragraph"]').click()
            expect(p.locator('.paragraph').nth(index)).to_be_focused()
        def check(name, fn):
            print('START', name, flush=True)
            try:
                evidence = fn(); result['checks'].append({'name': name, 'pass': True, 'evidence': evidence}); print('PASS', name, flush=True)
            except Exception as e:
                result['checks'].append({'name': name, 'pass': False, 'error': str(e)}); print('FAIL', name, str(e), flush=True)
            save()
        def keep_case(width, height, method, index):
            c, p = context(width, height); open_project(p)
            old = p.evaluate('readReadingPosition(state.project,doc()).start'); jump(p, index)
            expected = paragraphs[index][0]; assert p.evaluate('readReadingPosition(state.project,doc()).start')==old
            p.screenshot(path=str(shots/f'{width}-{height}-{method}-p{index+1}-before.png'))
            button = p.locator('[data-action="overview-keep"]')
            if method=='keyboard': button.focus(); p.keyboard.press('Enter')
            elif method=='tap': button.tap()
            else: button.click()
            p.wait_for_timeout(120)
            actual = p.evaluate('readReadingPosition(state.project,doc()).start')
            p.screenshot(path=str(shots/f'{width}-{height}-{method}-p{index+1}-after.png'))
            assert actual==expected, {'expected': expected, 'actual': actual, 'paragraph': index+1}
            assert p.evaluate('document.activeElement.classList.contains("paragraph")')
            p.reload(wait_until='networkidle'); assert p.evaluate('readReadingPosition(state.project,doc()).start')==expected
            assert p.locator('#reading-document').input_value()==d['id']
            p.locator('#reading-document').select_option(source['documents'][0]['id'])
            p.locator('#reading-document').select_option(d['id']); assert p.evaluate('readReadingPosition(state.project,doc()).start')==expected
            assert p.evaluate('document.documentElement.scrollWidth-innerWidth')==0
            c.close(); return {'width': width, 'height': height, 'input': method, 'paragraph': index+1, 'saved_start': actual, 'reload_and_switch': True}
        for width, height, method, index in [(390,844,'tap',3),(390,844,'tap',4),(390,844,'tap',5),(390,844,'keyboard',3),(1440,900,'click',3),(1440,600,'click',5),(320,740,'tap',3),(390,600,'tap',3)]:
            check(f'{width}x{height} {method} keeps paragraph {index+1}', lambda w=width,h=height,m=method,i=index: keep_case(w,h,m,i))
        def real_scroll():
            c,p=context();open_project(p);jump(p,4);old=p.evaluate('readReadingPosition(state.project,doc()).start')
            session=c.new_cdp_session(p)
            for _ in range(3):
                session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':106,'y':760}]})
                for y in [660,560,460,360,260]:
                    session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':106,'y':y}]});p.wait_for_timeout(25)
                session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});p.wait_for_timeout(150)
            session.detach();expected=p.evaluate('readingOverviewNav.start');assert expected>paragraphs[4][0], expected
            assert p.evaluate('readReadingPosition(state.project,doc()).start')==old
            p.locator('[data-action="overview-keep"]').tap();p.wait_for_timeout(120)
            actual=p.evaluate('readReadingPosition(state.project,doc()).start');assert actual==expected,(expected,actual)
            p.screenshot(path=str(shots/'phone-real-reading-scroll-kept.png'));c.close()
            return {'real_touch_scroll':True,'new_reading_start':actual,'not_frozen_to_jump':True}
        check('real touch reading after the jump advances the Keep target',real_scroll)
        def exact_source():
            c,p=context();open_project(p);original=source['documents'][0]
            p.locator('#reading-document').select_option(original['id'])
            p.evaluate('scrollReadingParagraph(segments(doc().text)[16].start,true);updateReadingPosition()')
            p.locator('[data-action="reading-overview"]').tap()
            p.locator('#overview-source-list summary').tap()
            p.locator('#overview-source-scope').select_option('document')
            groups=p.evaluate('readingOverviewData(state.project,doc()).ranges')
            index=next(i for i,g in enumerate(groups) if paragraphs[3][0]<=g['start']<g['end']<=paragraphs[3][1])
            group=groups[index];p.locator('#overview-range-number').fill(str(index+1))
            p.locator('[data-action="overview-find-source"]').tap()
            expect(p.locator('.overview-source-detail blockquote')).to_have_text(original['text'][group['start']:group['end']])
            p.locator('[data-action="overview-jump-source"]').tap()
            expect(p.locator('.overview-source-target').first).to_be_focused()
            p.locator('[data-action="overview-keep"]').tap();p.wait_for_timeout(120)
            actual=p.evaluate('readReadingPosition(state.project,doc()).start');assert actual==paragraphs[3][0],actual
            p.screenshot(path=str(shots/'phone-exact-source-kept.png'))
            p.reload(wait_until='networkidle');assert p.evaluate('readReadingPosition(state.project,doc()).start')==actual
            c.close();return {'exact_quote':[group['start'],group['end']],'kept_paragraph':4,'saved_start':actual,'reload':True}
        check('phone Keep also retains the paragraph of an exact coding source',exact_source)
        def search_gap():
            c,p=context();open_project(p);p.evaluate('scrollReadingParagraph(segments(doc().text)[3].start,true);updateReadingPosition()')
            before=p.evaluate('readReadingPosition(state.project,doc()).start');p.locator('[data-action="reading-overview"]').focus()
            for _ in range(12):
                p.keyboard.press('Tab');p.wait_for_timeout(60)
                if p.evaluate('document.activeElement.id')=='search':break
            assert p.evaluate('document.activeElement.id')=='search'
            after=p.evaluate('readReadingPosition(state.project,doc()).start')
            assert before==872 and after==872,(before,after)
            c.close();return {'search_focus_preserves_anchor':872,'UX33_01_regression':True}
        check('phone search focus preserves the saved anchor alongside Keep',search_gap)
        def unchanged():
            assert get(api)==baseline and get(api+'/backups')['items']==snapshots
            assert not result['ui_posts'] and not result['console'] and not result['http'],result
            (out/'project-after.json').write_text(json.dumps(get(api),ensure_ascii=False,indent=2),encoding='utf-8')
            return {'project_and_snapshots_equal':True,'ui_posts':0,'console_errors':0,'http_errors':0,'counts':[len(baseline[k]) for k in ['documents','codes','annotations']]}
        check('Keep actions preserve marks, source, coding, audit and snapshots',unchanged)
        browser.close();save()
    raise SystemExit(0 if all(c['pass'] for c in result['checks']) else 1)


if __name__=='__main__':main()
