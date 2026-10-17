"""Read-only browser follow-up for an existing disposable 100-document workload."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright,expect


def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--url',required=True);ap.add_argument('--project',required=True);ap.add_argument('--out',required=True);args=ap.parse_args()
    base=args.url.rstrip('/');assert urlsplit(base).hostname in ('127.0.0.1','localhost')
    out=Path(args.out);out.mkdir(parents=True,exist_ok=True);results={'console':[],'http':[],'outside':[]}
    with sync_playwright() as pw:
        browser=pw.chromium.launch(channel='chrome',headless=True);ctx=browser.new_context(viewport={'width':1440,'height':1000})
        ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else (results['outside'].append(r.request.url),r.abort()))
        p=ctx.new_page();p.set_default_timeout(20000);p.on('pageerror',lambda e:results['console'].append(str(e)));p.on('console',lambda m:results['console'].append(m.text) if m.type=='error' else None);p.on('response',lambda r:results['http'].append([r.status,r.url]) if r.status>=400 else None)
        token=ctx.request.get(base+'/w/api/bootstrap').json()['token'];root=base+'/w/api/projects/'+args.project;headers={'X-QualiCraft-Token':token}
        response=ctx.request.get(root,headers=headers);assert response.ok;before=response.json()
        assert len(before['documents'])==100 and before['name']=='Bologna · technical capacity test'
        a=before['annotations'][-1]
        p.goto(base+'/w/?lang=en',wait_until='networkidle');p.locator('#start-project-select').select_option(args.project);p.locator('[data-action="start-open"]').click()
        p.locator('[data-action="view"][data-view="insights"]').click();expect(p.locator('#network-select')).to_be_enabled();p.locator('#network-select').select_option('code:'+a['code_id'])
        p.locator('[data-action="net-evidence"][data-id="'+a['id']+'"]').click();p.screenshot(path=str(out/'100-doc-network.png'))
        p.locator('[data-action="net-locate"]').click();expect(p.locator('.source-target').first).to_be_focused();expect(p.locator('#reading-document')).to_have_value(a['document_id'])
        p.screenshot(path=str(out/'100-doc-network-source.png'));p.locator('[data-action="net-return"]').press('Enter');expect(p.locator('#network-select')).to_have_value('code:'+a['code_id'])
        assert ctx.request.get(root,headers=headers).json()==before
        results.update(pass_=not any(results.values()),source_annotation_id=a['id'],source_document_id=a['document_id'],project_unchanged=True)
        (out/'results.json').write_text(json.dumps(results,indent=2));browser.close()
    print(json.dumps(results));return 0 if results['pass_'] else 1


if __name__=='__main__':raise SystemExit(main())
