"""UX-12: actual Bologna import/download results in a fresh project-only Chrome.

Requires a disposable writable Bologna copy, never an original research project.
Example: python tools/e2e/import_export.py --url http://127.0.0.1:8842/w --out /tmp/qc-io
The script only requests the supplied loopback origin and uses Bologna DB text.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import sqlite3
import traceback
import zipfile
from pathlib import Path
from urllib.parse import urlsplit
from xml.sax.saxutils import escape
from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', required=True)
    parser.add_argument('--out', required=True)
    args = parser.parse_args()
    u = urlsplit(args.url)
    if u.scheme != 'http' or u.hostname not in ('127.0.0.1', 'localhost'):
        raise SystemExit('Only the loopback project is permitted')
    base = args.url.rstrip('/')
    origin = f'{u.scheme}://{u.netloc}'
    out = Path(args.out); out.mkdir(parents=True, exist_ok=True)
    repo = Path(__file__).resolve().parents[2]
    source = repo/'demo-data/qualicraft.sqlite3'
    with sqlite3.connect(source.resolve().as_uri()+'?mode=ro', uri=True) as db:
        original = json.loads(db.execute('select data from projects').fetchone()[0])
    assert 'Bologna' in original['name']
    source_hash=hashlib.sha256(source.read_bytes()).hexdigest()
    transcript = next(d['text'] for d in original['documents'] if d['name']=='interview02.txt')
    txt = out/'interview02.txt'; txt.write_text(transcript, encoding='utf-8')
    docx = out/'interview02.docx'
    with zipfile.ZipFile(docx, 'w') as z:
        z.writestr('[Content_Types].xml', '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/></Types>')
        z.writestr('word/document.xml', '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+''.join('<w:p><w:r><w:t xml:space="preserve">'+escape(line)+'</w:t></w:r></w:p>' for line in transcript.splitlines())+'</w:body></w:document>')
    results, errors, expected_errors = [], [], []
    in_error_test = False
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='chrome', headless=True)
        def context(**kwargs):
            c = browser.new_context(accept_downloads=True, **kwargs)
            c.route('**/*', lambda r:r.continue_() if r.request.url.startswith(origin+'/') else r.abort())
            p = c.new_page()
            p.on('pageerror', lambda e:errors.append(str(e)))
            p.on('console', lambda m:(expected_errors if in_error_test else errors).append(m.text) if m.type in ('warning','error') else None)
            p.goto(base+'/?lang=en', wait_until='networkidle'); p.wait_for_selector('.reader-heading')
            return c, p
        c, page = context(viewport={'width':1440,'height':900}, device_scale_factor=2)
        boot = c.request.get(base+'/api/bootstrap').json(); token = boot['token']
        def project():
            return c.request.get(base+'/api/projects/'+original['id'], headers={'X-QualiCraft-Token':token}).json()
        before = project()
        # Refuse to mutate an unrelated or non-disposable URL/project.
        assert 'Bologna' in before['name'] and before['id']==original['id']
        def check(name, fn):
            try:
                reading=fn();results.append({'name':name,'pass':True,'reading':reading})
            except Exception as e:
                results.append({'name':name,'pass':False,'error':str(e),'traceback':traceback.format_exc()})
                page.screenshot(path=str(out/f'failure-{len(results)}.png'))
                if page.locator('#dialog[open]').count():page.keyboard.press('Escape')
        def open_import(p=page):p.locator('[data-action="import"]:visible').first.click()
        def closed(p=page):expect(p.locator('#dialog')).not_to_be_visible()
        def compact():
            open_import()
            assert page.locator('[data-action="import-mode"]').count()==2
            assert page.locator('#import-file').is_visible() and not page.locator('#document-text').is_visible()
            words=len(page.locator('#dialog').inner_text().split()); assert words < 68, words
            assert not page.locator('.io-help').get_attribute('open')
            page.screenshot(path=str(out/'import-desktop.png'))
            page.keyboard.press('Escape');closed()
            return {'default_visible_words':words,'baseline_words':68}
        check('compact File/Paste entry with optional format help',compact)
        def file_import():
            # Import from Insights must land in the actual document, not stay on a chart.
            page.locator('[data-action="view"][data-view="insights"]').click()
            open_import(); page.locator('#import-file').set_input_files(txt)
            expect(page.locator('#import-preview pre')).to_be_visible()
            assert page.locator('#import-preview pre').inner_text()==transcript[:800]
            page.locator('#document-name').fill('Bologna · TXT review')
            page.screenshot(path=str(out/'import-preview-desktop.png'))
            page.locator('[data-action="save-document"]').click();closed()
            expect(page.locator('.reader-heading')).to_have_text('Bologna · TXT review')
            assert page.locator('.import-receipt').is_visible()
            assert page.locator('.reader-heading').evaluate('(e)=>e===document.activeElement')
            d=project()['documents'][-1];assert d['text']==transcript
            assert page.locator('.passage').first.inner_text() in transcript
            page.screenshot(path=str(out/'import-result-desktop.png'))
            return {'text_sha256':hashlib.sha256(d['text'].encode()).hexdigest(),'document_id':d['id'],'focused':True}
        check('TXT preview and imported document are exact and focused',file_import)
        def paste_import():
            open_import();page.locator('#import-file').set_input_files(txt)
            page.locator('[data-action="import-mode"][data-mode="paste"]').press('Enter')
            assert page.locator('#import-file').is_disabled() and page.locator('#document-text').is_visible()
            text=transcript[:1800]
            page.locator('#document-name').fill('Bologna · pasted review');page.locator('#document-text').fill(text)
            page.locator('[data-action="save-document"]').press('Enter');closed()
            assert project()['documents'][-1]['text']==text
            expect(page.locator('.reader-heading')).to_have_text('Bologna · pasted review')
            return {'characters':len(text),'inactive_selected_file_ignored':True}
        check('keyboard Paste mode imports only the chosen text',paste_import)
        def docx_import():
            open_import();page.locator('#import-file').set_input_files(docx)
            expect(page.locator('#import-preview')).to_contain_text('Text opens after import.')
            assert page.locator('#import-preview pre').count()==0
            page.locator('#document-name').fill('Bologna · DOCX review');page.locator('[data-action="save-document"]').click();closed()
            d=project()['documents'][-1]
            assert d['text']=='\n'.join(transcript.splitlines())
            expect(page.locator('.reader-heading')).to_have_text('Bologna · DOCX review')
            return {'characters':len(d['text']),'document_id':d['id']}
        check('DOCX uses existing server parser and displays its saved text',docx_import)
        def export_files(p=page, prefix='desktop'):
            p.locator('[data-action="export"]:visible').first.click()
            assert p.locator('[data-action="download"]').count()==4
            p.screenshot(path=str(out/f'export-{prefix}.png'))
            files=[]
            for fmt in ('json','csv','matrix','methods'):
                button=p.locator(f'[data-action="download"][data-format="{fmt}"]')
                with p.expect_download(timeout=30000) as event:button.press('Enter')
                dl=event.value; dest=out/f'{prefix}-{dl.suggested_filename}';dl.save_as(dest)
                expect(p.locator('[data-export-filename]')).to_have_text(dl.suggested_filename)
                payload=dest.read_bytes()
                response=c.request.get(base+'/api/projects/'+original['id']+'/export?format='+fmt,headers={'X-QualiCraft-Token':token})
                assert response.ok and payload==response.body()
                assert f'{len(payload):,} B' in p.locator('#export-result').inner_text()
                details=p.locator('.io-export-preview');details.locator('summary').press('Enter')
                excerpt='\n'.join(payload.decode('utf-8-sig').split('\n')[:8])[:1000].replace('\r\n','\n').replace('\r','\n')
                assert details.locator('pre').text_content()==excerpt, (fmt,repr(details.locator('pre').text_content()[:80]),repr(excerpt[:80]))
                assert 'Check your browser' in p.locator('#export-result').inner_text()
                files.append({'format':fmt,'filename':dl.suggested_filename,'bytes':len(payload),'sha256':hashlib.sha256(payload).hexdigest()})
                if fmt=='csv':p.screenshot(path=str(out/f'export-result-{prefix}.png'))
            p.keyboard.press('Escape');closed(p)
            return files
        check('four real downloads match API bytes and visible file previews',export_files)
        def error_recovery():
            nonlocal in_error_test
            open_import();count=len(project()['documents'])
            page.locator('[data-action="save-document"]').click()
            expect(page.locator('#modal-error')).to_contain_text('Choose a TXT or DOCX')
            assert len(project()['documents'])==count
            page.keyboard.press('Escape')
            page.locator('[data-action="export"]:visible').first.click()
            in_error_test=True
            page.route('**/export?format=csv',lambda r:r.fulfill(status=503,content_type='application/json',body='{"error":"review failure"}'))
            page.locator('[data-action="download"][data-format="csv"]').click()
            expect(page.locator('#modal-error')).to_have_text('Export failed.')
            assert page.locator('[data-export-filename]').count()==0
            assert page.locator('#export-result').inner_text()==''
            assert page.locator('[data-action="download"][data-format="csv"]').is_enabled()
            page.unroute('**/export?format=csv');in_error_test=False
            with page.expect_download() as event:page.locator('[data-action="download"][data-format="csv"]').click()
            event.value.save_as(out/'retry.csv')
            expect(page.locator('[data-export-filename]')).to_have_text('qualicraft-csv.csv')
            page.keyboard.press('Escape')
            return {'no_empty_import':True,'failed_export_no_success_receipt':True,'retry_succeeded':True}
        check('validation and failed export remain recoverable without false success',error_recovery)
        def phone():
            mobile,tab=context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2)
            open_import(tab)
            tab.locator('[data-action="import-mode"][data-mode="paste"]').tap()
            tab.locator('#document-name').fill('Bologna · mobile review');tab.locator('#document-text').fill(transcript[:900])
            tab.screenshot(path=str(out/'import-phone.png'))
            box=tab.locator('#dialog').bounding_box();assert box and box['x']>=0 and box['x']+box['width']<=390
            tab.locator('[data-action="save-document"]').tap();closed(tab)
            expect(tab.locator('.reader-heading')).to_have_text('Bologna · mobile review')
            tab.screenshot(path=str(out/'import-result-phone.png'))
            assert tab.evaluate('()=>document.documentElement.scrollWidth<=innerWidth')
            tab.locator('[data-action="export"]:visible').first.tap()
            for button in tab.locator('[data-action="download"]').all():
                assert button.bounding_box()['height']>=44
            with tab.expect_download() as event:tab.locator('[data-action="download"][data-format="csv"]').tap()
            event.value.save_as(out/'mobile-codings.csv')
            expect(tab.locator('[data-export-filename]')).to_have_text('qualicraft-csv.csv')
            tab.locator('.io-export-preview summary').tap()
            tab.locator('#export-result').scroll_into_view_if_needed()
            tab.screenshot(path=str(out/'export-result-phone.png'))
            extent=tab.locator('#dialog').evaluate('(e)=>({client:e.clientWidth,scroll:e.scrollWidth})')
            assert extent['scroll']<=extent['client']
            tab.keyboard.press('Escape');mobile.close()
            return {'viewport':[390,844],'dialog':box,'export_extent':extent,'touch_import_download':True}
        check('mobile touch imports, reads results and downloads without overflow',phone)
        def keyboard():
            open_import();page.keyboard.press('Tab');assert page.locator('#dialog').evaluate('(e)=>document.activeElement===document.body||e.contains(document.activeElement)')
            page.locator('[data-action="import-mode"][data-mode="paste"]').press('Space')
            assert page.locator('#document-text').evaluate('(e)=>e===document.activeElement')
            page.keyboard.press('Escape');closed()
            page.locator('[data-action="export"]:visible').first.press('Enter')
            for _ in range(9):
                page.keyboard.press('Tab');assert page.locator('#dialog').evaluate('(e)=>document.activeElement===document.body||e.contains(document.activeElement)')
            page.keyboard.press('Escape');closed()
            expect(page.locator('[data-action="export"]:visible').first).to_be_focused()
            return {'no_background_control_focused':True,'escape_and_focus_return':True}
        check('keyboard mode selection, dialog focus and Escape work',keyboard)
        after=project()
        unchanged=all(after[k]==before[k] for k in ('codes','annotations','suggestions','blocks'))
        assert unchanged
        assert after['documents'][:len(before['documents'])]==before['documents']
        original_hash=hashlib.sha256(source.read_bytes()).hexdigest();assert original_hash==source_hash
        check('source data and existing coding/analysis inputs are unchanged',lambda:{'original_db_sha256':original_hash,'existing_documents':len(before['documents']),'codes':len(after['codes']),'annotations':len(after['annotations']),'new_uncoded_documents':len(after['documents'])-len(before['documents']),'unchanged':unchanged})
        c.close();browser.close()
    report={'results':results,'console':errors,'expected_error_response_console':expected_errors}
    (out/'results.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
    return 0 if all(r['pass'] for r in results) and not errors else 1

if __name__=='__main__':raise SystemExit(main())
