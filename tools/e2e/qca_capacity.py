"""Bounded QCA UI load using explicit Boolean designations on public source copies."""
import argparse,itertools,json,time
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright,expect
from qualicraft import qca_state


def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--url',required=True);parser.add_argument('--out',required=True);args=parser.parse_args();base=args.url.rstrip('/');assert urlsplit(base).hostname in ('127.0.0.1','localhost');out=Path(args.out);out.mkdir(parents=True,exist_ok=True);result={'checks':[],'console':[],'http':[],'outside':[]}
    with sync_playwright() as pw:
        browser=pw.chromium.launch(channel='chrome',headless=True);client=browser.new_context();token=client.request.get(base+'/w/api/bootstrap').json()['token'];headers={'X-QualiCraft-Token':token}
        def request(path,body=None):
            r=client.request.post(base+'/w/api'+path,data=body,headers=headers) if body is not None else client.request.get(base+'/w/api'+path,headers=headers);assert r.ok,(r.status,r.text());return r.json()
        p=request('/projects/a71a0b538c024c3ab23fb4286cfe93e2');p=request('/projects',{'kind':'restore','project':{**p,'name':'Bologna · 100 technical QCA cases'}});root='/projects/'+p['id'];d=qca_state.blank();d['question']='Known Boolean function for upper-bound UI acceptance only';d['case_unit']='Technical source copies, not independent participants or empirical QCA findings'
        d['conditions']=[qca_state.definition(id) for id in 'ABCDEF']
        for n in d['conditions']+[d['outcome']]:n.update(label=n['id']+' test set',definition='Explicit Boolean test designation',zero_rule='Assigned zero in the known-answer fixture',one_rule='Assigned one in the known-answer fixture',basis='Software acceptance mathematics; not an empirical claim')
        combos=list(itertools.product([0,1],repeat=6));d['cases']=[]
        for i in range(100):
            bits=combos[i%64];values=dict(zip(list('ABCDEF')+['Y'],[*bits,int(bits[0] and (bits[1] or bits[2]))]));d['cases'].append({'id':'technical'+str(i),'label':'Technical public-source copy '+str(i+1),'document_ids':[p['documents'][0]['id']],'cells':{k:{'value':v,'rationale':'Explicit known-answer designation for software verification','evidence_ids':[]} for k,v in values.items()}})
        c=request(root+'/qca');request(root+'/qca-save',{'revision':0,'source_version':c['source_version'],'design':d,'options':{}});s=request(root+'/qca-run',{'revision':1,'source_version':c['source_version']});assert s['current']['result']['solutions'][0]['terms']==['1-1---','11----']
        for width in [1440,390]:
            context=browser.new_context(viewport={'width':width,'height':1000 if width==1440 else 844},has_touch=width==390,is_mobile=width==390);context.route('**/*',lambda route:route.continue_() if route.request.url.startswith(base+'/') else (result['outside'].append(route.request.url),route.abort()))
            page=context.new_page();page.on('pageerror',lambda e:result['console'].append(str(e)));page.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None);page.on('response',lambda r:result['http'].append([r.status,r.url]) if r.status>=400 else None)
            page.goto(base+'/w/?lang=en',wait_until='domcontentloaded');page.locator('#start-project-select').select_option(p['id']);page.locator('[data-action="start-open"]').click();page.locator('[data-action="view"][data-view="insights"]').click();start=time.perf_counter();page.locator('[data-action="open-qca"]').click();expect(page.locator('#qca-save-state')).to_be_visible(timeout=30000);opened=time.perf_counter()-start;expect(page.locator('[data-qca-action="add-set"]')).to_be_disabled()
            page.locator('[data-qca-tab="cases"]').click();expect(page.locator('[data-qca-action="add-case"]')).to_be_disabled();expect(page.locator('#qca-case-select option')).to_have_count(100);page.locator('#qca-case-select').select_option('technical99');page.locator('[data-qca-tab="calibration"]').click();expect(page.locator('[data-qca-value]')).to_have_count(7);expect(page.locator('#qca-case-select')).to_have_value('technical99')
            page.locator('[data-qca-tab="results"]').click();expect(page.get_by_role('region',name='Complete QCA truth table').locator('tbody tr')).to_have_count(64);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path=str(out/(str(width)+'-100-cases.png')));result['checks'].append({'width':width,'pass':True,'case_options':100,'calibrated_sets':7,'truth_rows':64,'no_overflow':True,'open_seconds':opened});context.close()
        saved=request(root);assert saved['documents']==p['documents'] and saved['codes']==p['codes'] and saved['annotations']==p['annotations'];result['project_id']=p['id'];result['not_independent_research_cases']=True;assert not any(result[k] for k in ['console','http','outside']);(out/'results.json').write_text(json.dumps(result,indent=2),encoding='utf-8');browser.close()
    print(json.dumps(result))

if __name__=='__main__':main()
