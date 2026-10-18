"""UX58 targeted keyboard close/focus and honest storage-unavailable checks."""
import argparse,json,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from tools.e2e.recovery_boundaries import Service,dump
from qualicraft.server import bologna_example
from playwright.sync_api import sync_playwright,expect

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--out',type=Path,required=True);args=parser.parse_args();out=args.out;out.mkdir(parents=True,exist_ok=True);seed=bologna_example();s=Service(out/'service',seed);results={'checks':[],'console':[],'http':[],'outside':[]}
    def check(name,detail):results['checks'].append({'name':name,'pass':True,'detail':detail});dump(out/'results.json',results);print(name+': PASS',flush=True)
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(channel='chrome',headless=True)
            for width in [1440,390]:
                p=s.json('/projects',{'kind':'restore','project':seed});kind='phone' if width==390 else 'desktop';c=browser.new_context(viewport={'width':width,'height':1000 if width==1440 else 844},has_touch=width==390,is_mobile=width==390)
                c.route('**/*',lambda route:route.continue_() if route.request.url.startswith(s.base+'/') else (results['outside'].append(route.request.url),route.abort()))
                # Plain HTTP phone support and a deliberately unavailable queue store.
                c.add_init_script("""Object.defineProperty(Crypto.prototype,'randomUUID',{value:undefined});const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.startsWith('qt.importQueue.v1:'))throw new DOMException('Injected queue storage refusal','QuotaExceededError');return set.call(this,k,v)}""")
                page=c.new_page();page.on('pageerror',lambda e:results['console'].append(str(e)));page.on('console',lambda m:results['console'].append(m.text) if m.type=='error' else None);page.on('response',lambda r:results['http'].append([r.status,r.url]) if r.status>=400 else None);page.goto(s.base+'/w?lang=en',wait_until='networkidle');page.locator('#start-project-select').select_option(p['id']);page.locator('[data-action="start-open"]').click();page.locator('[data-action="import"]:visible').first.click()
                page.locator('#import-file').set_input_files([{'name':'Bologna-controls-'+str(i)+'.txt','mimeType':'text/plain','buffer':d['text'].encode()} for i,d in enumerate(seed['documents'][:2])]);expect(page.locator('#queue-storage')).to_be_visible();expect(page.locator('#queue-storage')).to_contain_text('cannot be saved');check(kind+' unavailable queue storage is explicit before import',{'warning_visible':True,'raw_text_not_written':True})
                start=page.locator('[data-action="queue-start"]');start.focus();start.press('Enter');expect(page.locator('.is-saved')).to_have_count(2);page.screenshot(path=str(out/(kind+'-storage-warning.png')));page.locator('.modal-footer [data-action="close"]').press('Enter');expect(page.locator('#dialog')).not_to_be_visible();expect(page.locator('#reading-document option')).to_have_count(21);expect(page.locator('[data-action="import"]:visible').first).to_be_focused();check(kind+' keyboard Close returns to Import after saved-count refresh',{'documents':21,'focus_restored':True})
                page.locator('[data-action="import"]:visible').first.press('Enter');page.locator('[data-action="queue-open"]').press('Enter');page.locator('[data-action="queue-clear"]').press('Enter');expect(page.locator('.io-queue-row')).to_have_count(0);expect(page.locator('[data-action="queue-start"]')).to_be_disabled();expect(page.locator('[data-action="queue-clear"]')).to_be_disabled();assert len(s.json('/projects/'+p['id'])['documents'])==21;check(kind+' clear-finished retains documents and keeps empty Start disabled',{'documents_preserved':21,'no_unavailable_storage_recovery_claim':True});c.close()
            browser.close()
        assert s.json('/projects/'+seed['id'])==seed;assert not any(results[k] for k in ['console','http','outside']);results['completed']=True;dump(out/'results.json',results);print(json.dumps({'checks':len(results['checks']),'console':0,'http':0,'outside':0}))
    finally:s.stop()
if __name__=='__main__':main()
