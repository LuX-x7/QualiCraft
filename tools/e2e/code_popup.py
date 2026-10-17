"""UX40-01: real code-popup saves on isolated editable Bologna copies only."""
from __future__ import annotations
import argparse,json,traceback
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright,expect

PID='a71a0b538c024c3ab23fb4286cfe93e2'

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--url',required=True);parser.add_argument('--out',required=True);parser.add_argument('--reproduce-only',action='store_true');args=parser.parse_args();base=args.url.rstrip('/')
    assert urlsplit(base).scheme=='http' and urlsplit(base).hostname in ('127.0.0.1','localhost')
    out=Path(args.out);shots=out/'screenshots';shots.mkdir(parents=True,exist_ok=True);result={'checks':[],'console':[],'http':[],'outside':[],'writes':[]};contexts=[]
    def save():(out/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    with sync_playwright() as pw:
        browser=pw.chromium.launch(channel='chrome',headless=True);client=browser.new_context();boot=client.request.get(base+'/w/api/bootstrap').json();headers={'X-QualiCraft-Token':boot['token']};original_url=base+'/w/api/projects/'+PID
        def get(url):
            response=client.request.get(url,headers=headers);assert response.ok,(response.status,url);return response.json()
        def post(url,data):
            response=client.request.post(url,headers=headers,data=data);assert response.ok,(response.status,response.text());return response.json()
        original=get(original_url);assert original['name']=='Bologna · What is data?' and [len(original[k]) for k in ['documents','codes','annotations']]==[19,317,874]
        by={c['id']:c for c in original['codes']};leaf=next(c for c in by.values() if c['name']=='ancient manuscripts');parent=by[leaf['parent_id']];assert leaf['name'] in parent['name'] and leaf['name']!=parent['name'];other=next(c for c in by.values() if not c.get('parent_id') and c['id']!=parent['id'])
        (out/'original-before.json').write_text(json.dumps(original,ensure_ascii=False,indent=2),encoding='utf-8')
        def path(code,project=original):
            codes={c['id']:c for c in project['codes']};parts=[code['name']]
            while code.get('parent_id') in codes:code=codes[code['parent_id']];parts.insert(0,code['name'])
            return ' > '.join(parts)
        def start(width=1440,change=None):
            project=post(base+'/w/api/projects',{'kind':'restore','project':{**original,'name':'Bologna · UX43 '+str(len(result['checks'])+1)}});url=base+'/w/api/projects/'+project['id']
            if change:change(url,project)
            c=browser.new_context(viewport={'width':width,'height':844 if width==390 else 1000},is_mobile=width==390,has_touch=width==390);contexts.append(c)
            def route(q):
                if q.request.url.startswith(base+'/'):q.continue_()
                else:result['outside'].append(q.request.url);q.abort()
            c.route('**/*',route);p=c.new_page();p.set_default_timeout(12000);p.on('pageerror',lambda e:result['console'].append(str(e)));p.on('console',lambda m:result['console'].append(m.text) if m.type=='error' else None);p.on('response',lambda response:result['http'].append([response.status,response.url]) if response.status>=400 else None);p.on('request',lambda req:result['writes'].append(req.url) if req.method=='POST' else None)
            p.goto(base+'/w/?lang=en',wait_until='networkidle');p.locator('#start-project-select').select_option(project['id']);p.locator('[data-action="start-open"]').click();expect(p.locator('#reading-document')).to_be_visible()
            return c,p,url,get(url)
        def select(p):
            segment=p.evaluate('segments(doc().text).find(s=>s.text.length>=80&&s.text.length<=600)');assert segment
            p.evaluate('(start)=>scrollReadingParagraph(start)',segment['start']);passage=p.locator('.passage[data-start="'+str(segment['start'])+'"]');passage.scroll_into_view_if_needed()
            def boxes():
                return passage.evaluate('''(el)=>{const points=[5,6,28],nodes=[];const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);while(walker.nextNode())nodes.push(walker.currentNode);function at(cp){for(const n of nodes){const chars=Array.from(n.textContent);if(cp<=chars.length)return [n,chars.slice(0,cp).join('').length];cp-=chars.length;}throw Error('range outside source')}const a=at(5),b=at(6),z=at(28);const first=document.createRange(),last=document.createRange();first.setStart(...a);first.setEnd(...b);last.setStart(...at(27));last.setEnd(...z);return {a:first.getBoundingClientRect().toJSON(),z:last.getBoundingClientRect().toJSON()}}''')
            g=boxes();a,z=g['a'],g['z'];p.mouse.move(a['x']+.2,a['y']+a['height']/2);p.mouse.down();p.mouse.move(z['x']+z['width']-.2,z['y']+z['height']/2,steps=14);p.mouse.up()
            expect(p.locator('#code-search')).to_be_visible();selection=p.evaluate('({...state.selection})');assert selection['end']>selection['start'];text=original['documents'][0]['text'];return {**selection,'quote':text[selection['start']:selection['end']]}
        def snapshot(p,name):p.screenshot(path=str(shots/(str(len(result['checks'])+1).zfill(2)+'-'+name+'.png')))
        def geometry(p):
            rect=p.locator('#code-popup').bounding_box();assert rect and rect['x']>=0 and rect['y']>=0 and rect['x']+rect['width']<=p.evaluate('innerWidth')+1 and rect['y']+rect['height']<=p.evaluate('innerHeight')+1,rect
            assert p.locator('.suggest-name').first.evaluate('(e)=>getComputedStyle(e).whiteSpace')=='normal'
        def submit(p,url,before,selection,expected_id):
            p.locator('#code-search').press('Enter');expect(p.locator('#code-popup')).not_to_be_visible();after=get(url);added=[a for a in after['annotations'] if a['id'] not in {x['id'] for x in before['annotations']}];assert len(added)==1,added;a=added[0]
            evidence={'expected_code_id':expected_id,'actual_code_id':a['code_id'],'expected_name':next(c['name'] for c in after['codes'] if c['id']==expected_id),'actual_name':next(c['name'] for c in after['codes'] if c['id']==a['code_id']),'range': [a['start'],a['end']],'quote_exact':a['quote']==selection['quote'],'annotation_id':a['id'],'audit_annotation_id':after['audit'][-1]['annotation_id']}
            result['last_saved']=evidence;save();assert a['code_id']==expected_id,evidence;assert (a['start'],a['end'],a['document_id'],a['quote'])==(selection['start'],selection['end'],selection['document_id'],selection['quote']);assert len(after['codes'])==len(before['codes']);assert after['audit'][-1]['action']=='annotation_create' and after['audit'][-1]['annotation_id']==a['id'];assert len(after['audit'])==len(before['audit'])+1
            assert after['documents']==before['documents'];return evidence
        def check(name,fn):
            print('START '+name,flush=True)
            try:result['checks'].append({'name':name,'pass':True,'details':fn()});print('PASS '+name,flush=True)
            except Exception as error:
                result['checks'].append({'name':name,'pass':False,'error':str(error),'traceback':traceback.format_exc()});print('FAIL '+name+': '+str(error),flush=True)
                if contexts and contexts[-1].pages:snapshot(contexts[-1].pages[0],'failure-'+str(len(result['checks'])))
            finally:
                for c in contexts:c.close()
                contexts.clear();save()
        def exact(width=1440,query=None,keyboard=False):
            _,p,url,before=start(width);s=select(p)
            if keyboard:p.keyboard.type(query or leaf['name'])
            else:p.locator('#code-search').fill(query or leaf['name'])
            snapshot(p,'desktop-exact-candidate' if width==1440 else 'phone-exact-candidate')
            if not args.reproduce_only:geometry(p)
            e=submit(p,url,before,s,leaf['id']);snapshot(p,'desktop-exact-saved' if width==1440 else 'phone-exact-saved');return {**e,'width':width,'native_keyboard_typing':keyboard,'source_selection':'real mouse drag'}
        check('complete Bologna leaf name plus Enter saves the leaf, not its containing parent',lambda:exact())
        if not args.reproduce_only:
            check('case and whitespace match the complete leaf name',lambda:exact(query='  '+leaf['name'].upper()+'  '))
            check('native keyboard typing and Enter preserve exact code and source range',lambda:exact(keyboard=True))
            def full_path():
                _,p,url,before=start();s=select(p);p.locator('#code-search').fill(path(leaf));return submit(p,url,before,s,leaf['id'])
            check('complete saved path selects the intended existing leaf',full_path)
            def capped():
                late={};query=leaf['name']+' 0'
                def setup(url,pr):
                    for n in range(9):post(url+'/codes',{'name':query+' '+str(n),'definition':'','parent_id':parent['id']})
                    late.update(post(url+'/codes',{'name':query,'definition':'','parent_id':parent['id']}))
                _,p,url,before=start(change=setup);s=select(p);p.locator('#code-search').fill(query);assert p.locator('#code-suggest [data-action="popup-apply"]').count()==8;snapshot(p,'eight-row-cap-exact-first');return submit(p,url,before,s,late['id'])
            check('late exact candidate remains reachable before the eight-row cap',capped)
            def duplicate(width=1440,method='arrow',same_path=False):
                duplicate_id={}
                def setup(url,pr):duplicate_id.update(post(url+'/codes',{'name':path(leaf) if same_path else leaf['name'],'definition':leaf.get('definition',''),'parent_id':None if same_path else other['id']}))
                _,p,url,before=start(width,setup);s=select(p);p.locator('#code-search').fill(path(leaf) if same_path else leaf['name']);count=len(before['annotations']);audit=len(before['audit']);backups=len(get(url+'/backups')['items']);p.locator('#code-search').press('Enter');expect(p.locator('#code-popup')).to_be_visible();after=get(url);assert after==before;assert len(get(url+'/backups')['items'])==backups
                exact=p.locator('#code-suggest [data-action="popup-apply"][data-id="'+duplicate_id['id']+'"]');assert exact.count()==1
                if same_path:assert duplicate_id['id'] in exact.inner_text()
                geometry(p);snapshot(p,'desktop-ambiguous-paths' if width==1440 else 'phone-ambiguous-paths')
                if method=='arrow':
                    index=p.locator('#code-suggest .suggest-row').evaluate_all('(rows,id)=>rows.findIndex(r=>r.dataset.id===id)',duplicate_id['id'])
                    for _ in range(index):p.locator('#code-search').press('ArrowDown')
                    if not index:p.locator('#code-search').press('ArrowUp')
                    e=submit(p,url,before,s,duplicate_id['id'])
                elif method=='path':
                    candidate=next(c for c in before['codes'] if c['id']==duplicate_id['id']);p.locator('#code-search').fill(path(candidate,before)+(' · '+duplicate_id['id'] if same_path else ''));e=submit(p,url,before,s,duplicate_id['id'])
                else:
                    exact.tap() if width==390 else exact.click();expect(p.locator('#code-popup')).not_to_be_visible();after=get(url);a=after['annotations'][-1];assert a['code_id']==duplicate_id['id'] and (a['start'],a['end'],a['document_id'],a['quote'])==(s['start'],s['end'],s['document_id'],s['quote']);assert len(after['codes'])==len(before['codes']);assert after['audit'][-1]['action']=='annotation_create' and after['audit'][-1]['annotation_id']==a['id'];e={'actual_code_id':a['code_id'],'quote_exact':True,'annotation_id':a['id'],'audit_annotation_id':after['audit'][-1]['annotation_id']}
                return {**e,'ambiguous_Enter_no_write':True,'same_path':same_path,'method':method,'width':width,'snapshots_unchanged_on_ambiguous_Enter':backups,'codings_before':count,'audit_before':audit}
            check('duplicate exact names need explicit arrow choice; plain Enter changes no data or snapshots',lambda:duplicate())
            check('full path disambiguates equal leaf names across themes',lambda:duplicate(method='path'))
            check('duplicate display paths show IDs and allow an explicit mouse choice',lambda:duplicate(method='mouse',same_path=True))
            check('complete stable identity selects the intended identical display path',lambda:duplicate(method='path',same_path=True))
            check('phone Enter saves the complete leaf name and exact selected source',lambda:exact(width=390))
            check('phone touch resolves same-name paths without an implicit Enter save',lambda:duplicate(width=390,method='touch'))
            def override():
                _,p,url,before=start();s=select(p);p.locator('#code-search').fill(path(parent));rows=p.locator('#code-suggest [data-action="popup-apply"]').evaluate_all('(es)=>es.map(e=>e.dataset.id)');assert len(rows)>1 and rows[0]==parent['id'];p.locator('#code-search').press('ArrowDown');return submit(p,url,before,s,rows[1])
            check('an explicit arrow choice takes precedence over an exact complete-path query',override)
            def parent_save():
                _,p,url,before=start();s=select(p);p.locator('#code-search').fill(parent['name']);return submit(p,url,before,s,parent['id'])
            check('intentional direct parent coding remains available',parent_save)
            def cancel():
                _,p,url,before=start(390);select(p);p.locator('#code-search').fill(leaf['name']);p.locator('#code-search').press('Escape');expect(p.locator('#code-popup')).not_to_be_visible();assert get(url)==before;assert p.evaluate('document.documentElement.scrollWidth<=innerWidth');return {'Escape_no_write':True,'page_no_horizontal_overflow':True}
            check('phone Escape cancels without saving or changing source records',cancel)
        assert get(original_url)==original
        result['original_unchanged']=True;result['original_counts']=[19,317,874];result['physical_phone']='not tested; Chrome390px touch emulation';assert not result['console'] and not result['http'] and not result['outside'];assert all(PID+'/' not in url for url in result['writes']);save();client.close();browser.close()
    passed=sum(c['pass'] for c in result['checks']);print(json.dumps({'passed':passed,'total':len(result['checks']),'console_errors':len(result['console']),'HTTP_errors':len(result['http']),'outside_requests':len(result['outside']),'original_unchanged':True}));return 0 if passed==len(result['checks']) else 1

if __name__=='__main__':raise SystemExit(main())
