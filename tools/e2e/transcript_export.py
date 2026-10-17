"""Project-only coded-transcript acceptance on disposable Bologna copies."""
from __future__ import annotations
import argparse
import hashlib
import json
import traceback
import zipfile
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET

from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', required=True); parser.add_argument('--out', required=True)
    args = parser.parse_args(); base = args.url.rstrip('/')
    assert urlsplit(base).hostname in ('127.0.0.1', 'localhost')
    out = Path(args.out).resolve(); out.mkdir(parents=True, exist_ok=True)
    shots = out/'screenshots'; shots.mkdir(exist_ok=True)
    results = {'checks': [], 'console': [], 'http': [], 'outside': []}
    def save(): (out/'results.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='chrome', headless=True)
        client = browser.new_context()
        boot = client.request.get(base+'/w/api/bootstrap').json(); headers = {'X-QualiCraft-Token': boot['token']}
        def get(url):
            r = client.request.get(url, headers=headers); assert r.ok, (r.status, url); return r.json()
        def post(url, data):
            r = client.request.post(url, headers=headers, data=data); assert r.ok, (r.status, r.text()); return r.json()
        original_url = base+'/w/api/projects/a71a0b538c024c3ab23fb4286cfe93e2'
        original = get(original_url); assert [len(original[k]) for k in ('documents', 'codes', 'annotations')] == [19, 317, 874]
        copy = post(base+'/w/api/projects', {'kind': 'restore', 'project': {**original, 'name': 'Bologna · UX44 coded export review'}})
        root = base+'/w/api/projects/'+copy['id']; doc = copy['documents'][0]
        contexts = []
        def context(width=1440, js=True):
            c = browser.new_context(viewport={'width': width, 'height': 1000 if width > 700 else 844}, is_mobile=width==390, has_touch=width==390, java_script_enabled=js, accept_downloads=True)
            contexts.append(c)
            def route(r):
                if r.request.url.startswith(base+'/') or r.request.url.startswith(out.as_uri()+'/'): r.continue_()
                else: results['outside'].append(r.request.url); r.abort()
            c.route('**/*', route)
            p = c.new_page(); p.set_default_timeout(15000)
            p.on('pageerror', lambda e: results['console'].append(str(e)))
            p.on('console', lambda m: results['console'].append(m.text) if m.type=='error' else None)
            p.on('response', lambda r: results['http'].append([r.status, r.url]) if r.status>=400 else None)
            return c, p
        def workspace(width=1440):
            c, p = context(width); p.goto(base+'/w/?lang=en', wait_until='networkidle')
            p.locator('#start-project-select').select_option(copy['id']); p.locator('[data-action="start-open"]').click()
            expect(p.locator('#reading-document')).to_be_visible()
            return c, p
        def export(p, fmt, name):
            button=p.locator('[data-action="download-coded"][data-format="'+fmt+'"]')
            with p.expect_download() as event: button.press('Enter')
            download=event.value; target=out/(name+Path(download.suggested_filename).suffix); download.save_as(target)
            expect(p.locator('[data-export-filename]')).to_have_text(download.suggested_filename)
            assert target.stat().st_size > 1000
            return target
        def read_html(p, file):
            p.goto(file.as_uri(), wait_until='load')
            return p.locator('#frozen-evidence').evaluate('(t)=>JSON.parse(t.content.textContent)')
        def compare(p, data):
            for d in data['documents']:
                article=p.locator('#'+d['key'])
                text=article.locator('.source-text').evaluate_all('(els)=>els.map(e=>e.textContent).join("")')
                assert text==d['text']
                anns={a['key']: a for a in d['annotations']}
                marks=article.locator('mark').evaluate_all('(els)=>els.map(e=>({text:e.textContent,start:+e.dataset.start,end:+e.dataset.end,keys:e.dataset.keys.split(" ")}))')
                for m in marks:
                    assert m['text']==d['text'][m['start']:m['end']]
                    assert set(m['keys'])=={a['key'] for a in anns.values() if a['start']<m['end'] and a['end']>m['start']}
                assert set(article.locator('[data-association]').evaluate_all('(els)=>els.map(e=>e.dataset.association)'))==set(anns)
            assert p.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'horizontal overflow'
        def check(name, fn):
            try:
                detail=fn(); results['checks'].append({'name': name, 'pass': True, 'detail': detail}); print('PASS '+name, flush=True)
            except Exception as e:
                results['checks'].append({'name': name, 'pass': False, 'error': str(e), 'traceback': traceback.format_exc()}); print('FAIL '+name+': '+str(e), flush=True)
                for c in contexts[-1:]:
                    if c.pages: c.pages[-1].screenshot(path=str(shots/('failure-'+str(len(results['checks']))+'.png')))
            save()
        _, p=workspace()
        before=get(root); before_backups=get(root+'/backups')
        def desktop_download():
            p.locator('[data-action="export"]').click(); expect(p.locator('#coded-scope')).to_have_value('current')
            assert doc['name'] in p.locator('#coded-scope-summary').inner_text()
            p.screenshot(path=str(shots/'01-desktop-export-scope.png'))
            htmlfile=export(p,'coded-html','desktop-current');wordfile=export(p,'coded-docx','desktop-current')
            results['html']=str(htmlfile);results['docx']=str(wordfile)
            return {'HTML_bytes':htmlfile.stat().st_size,'DOCX_bytes':wordfile.stat().st_size}
        check('desktop keyboard downloads HTML and editable Word with exact filenames and bytes',desktop_download)
        _, hp=context()
        check('desktop saved HTML preserves all source characters, exact highlights and every association',lambda:(compare(hp,read_html(hp,Path(results['html']))),hp.screenshot(path=str(shots/'02-desktop-source-tree.png')))[0])
        def hover_keyboard():
            mark=hp.locator('mark').first;mark.hover();assert 'active' in mark.get_attribute('class');assert hp.locator('#selected-path').inner_text()
            key=mark.get_attribute('data-keys').split()[0];mark.focus();mark.press('Enter')
            assert hp.evaluate('document.activeElement.dataset.locate')==key
            hp.keyboard.press('Enter');assert hp.evaluate('document.activeElement.tagName')=='MARK'
            hp.screenshot(path=str(shots/'03-desktop-linked-selection.png'))
            hp.locator('.row').filter(has=hp.locator('mark')).first.scroll_into_view_if_needed()
            hp.screenshot(path=str(shots/'03b-desktop-complete-source-tree.png'))
            return {'key':key,'hover_and_keyboard_roundtrip':True}
        check('hover and keyboard trace highlight to saved tree and back',hover_keyboard)
        def word_contract():
            with zipfile.ZipFile(results['docx']) as z:
                data=json.loads(ET.fromstring(z.read('customXml/item1.xml')).text)
                html=read_html(hp,Path(results['html']))
                assert data['version']==html['version']
                assert data['documents']==html['documents']
                assert b'<w:drawing' not in z.read('word/document.xml')
            return {'same_frozen_version':data['version'],'editable_text':True}
        check('Word and HTML use identical frozen source, paths and ranges',word_contract)
        def filtered():
            p.locator('[data-action="close"]').first.click()
            p.locator('#search').fill('unmatched-UX44-source-filter');p.locator('[data-action="export"]').click()
            target=export(p,'coded-html','filtered-current');data=read_html(hp,target);assert data['documents'][0]['text']==doc['text'];assert data['association_count']==53
            return {'full_characters':len(doc['text']),'associations':53}
        check('search with no visible source does not shorten the export',filtered)
        def code_filtered():
            p.locator('[data-action="close"]').first.click();p.locator('#search').fill('')
            p.locator('[data-action="filter-code"]').first.click()
            p.locator('.passage').last.scroll_into_view_if_needed()
            p.locator('[data-action="export"]').click()
            data=read_html(hp,export(p,'coded-html','code-filtered-current'))
            assert data['documents'][0]['text']==doc['text'] and data['association_count']==53
            return {'code_filter_and_scroll_do_not_shorten_text':True}
        check('code filtering and source scrolling do not change full-document export scope',code_filtered)
        def selected():
            p.locator('#coded-scope').select_option('selected')
            
            for box in p.locator('[name="coded-document"]').all(): box.uncheck()
            expect(p.locator('[data-action="download-coded"]').first).to_be_disabled()
            ids=[d['id'] for d in copy['documents'][:2]]
            for id in ids:p.locator('[name="coded-document"][value="'+id+'"]').check()
            data=read_html(hp,export(p,'coded-html','selected-two'));compare(hp,data)
            assert [d['id'] for d in data['documents']]==ids
            return {'documents':2,'full_text':True}
        check('explicit multiple-document scope rejects empty choice and preserves case boundaries',selected)
        def all_documents():
            p.locator('#coded-scope').select_option('all');data=read_html(hp,export(p,'coded-html','all-documents'));compare(hp,data)
            assert len(data['documents'])==19 and data['association_count']==874
            target=export(p,'coded-docx','all-documents')
            with zipfile.ZipFile(target) as z:
                word=json.loads(ET.fromstring(z.read('customXml/item1.xml')).text)
                assert word['documents']==data['documents']
            return {'documents':19,'associations':874,'all_format_source_equal':True}
        check('all 19 Bologna documents and 874 codings remain complete in both formats',all_documents)
        def nojs():
            _,q=context(390,False);q.goto(Path(results['html']).as_uri())
            assert q.locator('.source-text').all_text_contents()
            assert ''.join(q.locator('.source-text').all_text_contents())==doc['text']
            assert q.locator('[data-association]').count()>=53
            q.screenshot(path=str(shots/'04-phone-no-script.png'))
            return {'full_text_and_tree_without_script':True}
        check('offline phone HTML stays fully readable with JavaScript disabled',nojs)
        def phone():
            _,q=workspace(390);q.locator('[data-action="export"]').tap();q.locator('#coded-scope').select_option('current')
            q.screenshot(path=str(shots/'05-phone-export-scope.png'));file=export(q,'coded-html','phone-current')
            _,view=context(390);data=read_html(view,file);compare(view,data)
            mark=view.locator('mark').first;mark.tap();key=mark.get_attribute('data-keys').split()[0]
            link=view.locator('.row').filter(has=mark).locator('[data-locate="'+key+'"]').first;expect(link).to_be_focused();link.tap();assert view.evaluate('document.activeElement.tagName')=='MARK'
            view.screenshot(path=str(shots/'06-phone-linked-source-tree.png'))
            view.locator('.tree').filter(has=view.locator('[data-association]')).first.scroll_into_view_if_needed()
            view.screenshot(path=str(shots/'06b-phone-complete-tree.png'))
            return {'touch_roundtrip':True,'overflow':False,'physical_phone':'not tested; Chrome touch emulation'}
        check('phone touch downloads and traces source and tree without lost entries',phone)
        def legacy():
            evidence={}
            for fmt in ('json','csv','matrix','methods'):
                button=p.locator('[data-action="download"][data-format="'+fmt+'"]')
                response=client.request.get(root+'/export?format='+fmt,headers=headers)
                with p.expect_download() as event:button.press('Enter')
                dl=event.value;target=out/dl.suggested_filename;dl.save_as(target);assert target.read_bytes()==response.body();evidence[fmt]=len(response.body())
            return evidence
        check('all four original export downloads remain byte-identical to their endpoints',legacy)
        check('exporting does not mutate project audit, snapshots, text or reading state',lambda: {'project_unchanged':get(root)==before,'backups_unchanged':get(root+'/backups')==before_backups} if get(root)==before and get(root+'/backups')==before_backups else (_ for _ in ()).throw(AssertionError('project mutated')))
        def stale():
            # Frozen file remains unchanged when one codebook name changes in this copy.
            old=Path(results['html']);digest=hashlib.sha256(old.read_bytes()).hexdigest()
            post(root+'/code-update',{'id':copy['codes'][0]['id'],'changes':{'name':copy['codes'][0]['name']+' UX44 version check'}})
            p.locator('[data-action="close"]').first.click();p.locator('[data-action="export"]').click()
            expect(p.locator('#coded-version-status')).to_contain_text('Evidence changed')
            assert hashlib.sha256(old.read_bytes()).hexdigest()==digest
            p.screenshot(path=str(shots/'07-stale-version-warning.png'))
            return {'stale_warning':True,'old_file_unchanged':True}
        check('reopening Export detects changed evidence and preserves the old file',stale)
        def adversarial():
            text='🧪 e\u0301 <script>window.BAD=1</script>\r\n\r\n'+doc['text'][:700]
            d=post(root+'/documents',{'name':'Bologna Unicode export check','text':text})
            codes=copy['codes'][:3]
            for start,end,code in [(0,20,codes[0]),(0,20,codes[1]),(2,5,codes[2]),(18,70,codes[2])]:
                post(root+'/annotations',{'document_id':d['id'],'code_id':code['id'],'start':start,'end':end})
            r=client.request.get(root+'/export?format=coded-html&document_id='+d['id'],headers=headers);assert r.ok
            target=out/'unicode-overlap.html';target.write_bytes(r.body());data=read_html(hp,target);compare(hp,data)
            assert hp.evaluate('typeof window.BAD')=='undefined'
            assert data['association_count']==4 and data['range_count']==3
            return {'Unicode_CRLF_full_text':True,'overlap_nested_cross_paragraph':True,'script_executed':False}
        check('Unicode overlaps, nested and cross-paragraph links survive escaped offline HTML',adversarial)
        assert get(original_url)==original
        results['original_unchanged']=True;results['review_project_id']=copy['id']
        assert not results['console'] and not results['http'] and not results['outside'], results
        for c in contexts:c.close()
        client.close();browser.close();save()
    passed=sum(c['pass'] for c in results['checks']);print(json.dumps({'passed':passed,'total':len(results['checks']),'console':len(results['console']),'http':len(results['http']),'outside':len(results['outside'])}));return 0 if passed==len(results['checks']) else 1


if __name__=='__main__':raise SystemExit(main())
