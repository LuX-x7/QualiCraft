"""QT entry, notebook output and website status checks; disposable Bologna only."""
import argparse
import json
import traceback
import zipfile
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET
from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', required=True)
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    base = args.url.rstrip('/')
    assert urlsplit(base).hostname in ('localhost', '127.0.0.1')
    out = Path(args.out).resolve()
    shots = out/'screenshots'
    shots.mkdir(parents=True, exist_ok=True)
    results = {'checks': [], 'console': [], 'http': [], 'outside': []}
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='chrome', headless=True)
        client = browser.new_context()
        token = client.request.get(base+'/w/api/bootstrap').json()['token']
        headers = {'X-QualiCraft-Token': token}
        original_url = base+'/w/api/projects/a71a0b538c024c3ab23fb4286cfe93e2'
        original = client.request.get(original_url, headers=headers).json()
        assert [len(original[k]) for k in ('documents','codes','annotations')] == [19,317,874]
        r = client.request.post(base+'/w/api/projects', headers=headers,
            data={'kind':'restore','project':{**original,'name':'Bologna · QT notebook review'}})
        assert r.ok
        copy = r.json()
        root = base+'/w/api/projects/'+copy['id']
        def ctx(width=1440, reduced=False):
            c = browser.new_context(viewport={'width':width,'height':1000 if width>700 else 844},
                is_mobile=width==390, has_touch=width==390, reduced_motion='reduce' if reduced else 'no-preference')
            c.add_init_script("""window.qtDraws=0;const clear=CanvasRenderingContext2D.prototype.clearRect;
                CanvasRenderingContext2D.prototype.clearRect=function(...a){window.qtDraws++;return clear.apply(this,a)}""")
            def route(r):
                if r.request.url.startswith(base+'/') or r.request.url.startswith(out.as_uri()+'/'):r.continue_()
                else:results['outside'].append(r.request.url);r.abort()
            c.route('**/*',route)
            p = c.new_page()
            p.on('pageerror', lambda e:results['console'].append(str(e)))
            p.on('console',lambda m:results['console'].append(m.text) if m.type=='error' else None)
            p.on('response',lambda r:results['http'].append([r.status,r.url]) if r.status>=400 else None)
            return c,p
        def overflow(p):assert p.evaluate('document.documentElement.scrollWidth<=innerWidth')
        def check(name,fn):
            try:
                fn();results['checks'].append({'name':name,'pass':True});print('PASS '+name,flush=True)
            except Exception as e:
                results['checks'].append({'name':name,'pass':False,'error':str(e),'traceback':traceback.format_exc()});print('FAIL '+name,flush=True)
            (out/'results.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
        def entry(width,reduced=False):
            c,p=ctx(width,reduced);p.goto(base+'/w/?lang=en',wait_until='networkidle')
            expect(p.locator('#welcome-orbit canvas')).to_be_visible()
            assert p.locator('[data-satellite]').count()==5
            overflow(p)
            button=p.locator('#welcome-orbit>button')
            if reduced:
                expect(button).to_be_disabled();before=p.evaluate('qtDraws');p.wait_for_timeout(300)
                assert p.evaluate('qtDraws')==before
                p.set_viewport_size({'width':1200,'height':900})
                p.wait_for_function('(n)=>qtDraws>n',arg=before)
                p.wait_for_timeout(80);before=p.evaluate('qtDraws');p.wait_for_timeout(200)
                assert p.evaluate('qtDraws')==before
                p.set_viewport_size({'width':width,'height':1000})
            else:
                p.wait_for_function('qtDraws>2')
                button.focus();button.press('Enter');expect(button).to_have_text('Play motion')
                p.wait_for_timeout(80);before=p.evaluate('qtDraws');p.wait_for_timeout(200)
                assert p.evaluate('qtDraws')==before
                button.press('Enter');expect(button).to_have_text('Pause motion')
            p.screenshot(path=str(shots/f'entry-{width}-reduced-{reduced}.png'))
            p.locator('#start-project-select').select_option(copy['id'])
            p.locator('[data-action="start-open"]').click()
            expect(p.locator('#reading-document')).to_be_visible()
            expect(p.locator('#welcome-orbit')).to_have_count(0)
            p.wait_for_timeout(80);before=p.evaluate('qtDraws');p.wait_for_timeout(200)
            assert p.evaluate('qtDraws')==before
            c.close()
        check('desktop entry orbit, keyboard pause and disposal',lambda:entry(1440))
        check('phone entry retains all start actions without overflow',lambda:entry(390))
        check('system reduced motion renders a stationary entry sketch',lambda:entry(1440,True))
        def notebook(width):
            c,p=ctx(width);p.goto(base+'/w/?lang=en',wait_until='networkidle')
            p.locator('#start-project-select').select_option(copy['id']);p.locator('[data-action="start-open"]').click()
            p.locator('[data-action="export"]').click();p.locator('#coded-roles').select_option('theme-category-code')
            p.locator('.report-status summary').click();expect(p.locator('.report-status')).to_contain_text('not available in this version')
            p.screenshot(path=str(shots/f'export-{width}.png'))
            files={}
            for fmt in ['coded-html','coded-docx']:
                with p.expect_download() as ev:p.locator(f'[data-action="download-coded"][data-format="{fmt}"]').press('Enter')
                dl=ev.value;file=out/(f'notebook-{width}'+Path(dl.suggested_filename).suffix);dl.save_as(file);files[fmt]=file
                expect(p.locator('[data-export-filename]')).to_have_text(dl.suggested_filename)
            p.goto(files['coded-html'].as_uri(),wait_until='load')
            data=p.locator('#frozen-evidence').evaluate('(t)=>JSON.parse(t.content.textContent)')
            assert data['role_labels']=='theme-category-code'
            assert ''.join(p.locator('.source-text').all_text_contents())==copy['documents'][0]['text']
            assert p.locator('table').count()==0
            tree_text=' '.join(p.locator('.tree').all_text_contents()).lower()
            for role in ['Theme','Category','Code']:assert role.lower() in tree_text
            p.locator('.row').filter(has=p.locator('mark')).first.scroll_into_view_if_needed()
            mark=p.locator('mark').first
            if width==390:mark.tap()
            else:mark.hover();mark.focus();mark.press('Enter')
            expect(p.locator('[data-locate]:focus')).to_have_count(1)
            p.keyboard.press('Enter');assert p.evaluate('document.activeElement.tagName')=='MARK'
            overflow(p);p.screenshot(path=str(shots/f'notebook-{width}.png'))
            p.locator('.tree').filter(has=p.locator('[data-association]')).first.scroll_into_view_if_needed()
            p.screenshot(path=str(shots/f'notebook-tree-{width}.png'))
            with zipfile.ZipFile(files['coded-docx']) as z:
                word=json.loads(ET.fromstring(z.read('customXml/item1.xml')).text)
                assert word['documents']==data['documents'] and word['version']==data['version']
                xml=z.read('word/document.xml').decode();assert 'Record details' in xml and '└' not in xml
            assert client.request.get(root,headers=headers).json()==copy
            c.close()
        check('desktop explicit three-role notebook downloads, source and hover/keyboard trace',lambda:notebook(1440))
        check('phone explicit three-role notebook downloads, complete tree and touch trace',lambda:notebook(390))
        def site(width):
            c,p=ctx(width);p.goto(base+'/',wait_until='networkidle')
            p.locator('#story-export').scroll_into_view_if_needed()
            if width>700:expect(p.locator('.story-stage')).to_have_attribute('data-scene','export')
            panel=p.locator('[data-story-art="export"]:visible')
            buttons=panel.locator('.export-files button');expect(buttons).to_have_count(6)
            buttons.first.hover();expect(buttons.first).to_have_attribute('aria-pressed','true')
            buttons.first.focus();buttons.first.press('End');expect(buttons.last).to_be_focused()
            expect(buttons.last).to_have_attribute('aria-pressed','true')
            expect(panel.locator('.sketch-readout')).to_contain_text('Editable full text')
            overflow(p);p.screenshot(path=str(shots/f'site-six-outputs-{width}.png'))
            p.locator('#method .home-details').first.locator('summary').click()
            expect(p.locator('.method-plans')).to_contain_text('planned and unavailable')
            p.locator('#method').scroll_into_view_if_needed();overflow(p)
            p.screenshot(path=str(shots/f'site-method-status-{width}.png'))
            c.close()
        check('desktop website six-format hover and keyboard guide with truthful planned status',lambda:site(1440))
        check('phone website six-format guide and method status retain readable layout',lambda:site(390))
        assert client.request.get(original_url,headers=headers).json()==original
        results['original_unchanged']=True
        results['physical_phone']='not tested; Chrome touch emulation'
        results['pass']=all(c['pass'] for c in results['checks']) and not any(results[k] for k in ['console','http','outside'])
        (out/'results.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
        print(json.dumps({'passed':sum(c['pass'] for c in results['checks']),'total':len(results['checks']),'console':len(results['console']),'http':len(results['http']),'outside':len(results['outside'])}))
        browser.close()
    return 0 if results['pass'] else 1


if __name__=='__main__':raise SystemExit(main())
