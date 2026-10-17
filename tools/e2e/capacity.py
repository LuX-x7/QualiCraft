"""Bounded 1/2/100-document capacity checks using labelled public Bologna replicas.

This is a technical workload, never a claim about independent participants.
Uses only the supplied loopback origin and the explicitly supplied owned backend PID.
"""
from __future__ import annotations
import argparse
from collections import Counter
import copy
import csv
import hashlib
import io
import json
import platform
import subprocess
import sys
import threading
import time
import traceback
import zipfile
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect


def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--url',required=True);ap.add_argument('--out',required=True);ap.add_argument('--backend-pid',type=int,required=True);args=ap.parse_args()
    base=args.url.rstrip('/');assert urlsplit(base).hostname in ('127.0.0.1','localhost')
    out=Path(args.out).resolve();(out/'screenshots').mkdir(parents=True,exist_ok=True)
    # Freeze these bounds before running; measured on this one machine only.
    bounds={'restore_seconds':30,'open_seconds':10,'switch_seconds':5,'import_seconds':120,'plot_bundle_seconds':120,'download_seconds':30,'backend_rss_MB':1024,'browser_JS_heap_MB':256}
    results={'workload':'Public Bologna technical replicas; not independent research cases','bounds':bounds,'checks':[],'console':[],'http':[],'outside':[],'timings':[],'stages':{}}
    def hardware(name):
        r=subprocess.run(['/usr/sbin/sysctl','-n',name],capture_output=True,text=True);return r.stdout.strip() if r.returncode==0 else 'unavailable'
    results['environment']={'OS':platform.platform(),'architecture':platform.machine(),'processor':hardware('machdep.cpu.brand_string'),'RAM_bytes':hardware('hw.memsize'),'Python':platform.python_version()}
    rss=[];stop=threading.Event()
    def memory():
        while not stop.is_set():
            r=subprocess.run(['/bin/ps','-p',str(args.backend_pid),'-o','rss='],capture_output=True,text=True)
            if r.returncode==0 and r.stdout.strip():rss.append(int(r.stdout.strip())/1024)
            stop.wait(.15)
    monitor=threading.Thread(target=memory,daemon=True);monitor.start()
    def save():
        results['backend_peak_polled_rss_MB']=max(rss,default=None)
        (out/'results.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
    def timed(name,limit,fn):
        start=time.perf_counter();value=fn();elapsed=time.perf_counter()-start
        results['timings'].append({'name':name,'seconds':round(elapsed,4),'limit_seconds':limit});assert elapsed<=limit,(name,elapsed,limit);return value
    def check(name,fn):
        print('START '+name,flush=True)
        try:detail=fn();results['checks'].append({'name':name,'pass':True,'detail':detail});print('PASS '+name,flush=True)
        except Exception as exc:results['checks'].append({'name':name,'pass':False,'error':str(exc),'traceback':traceback.format_exc()});print('FAIL '+name+': '+str(exc),flush=True)
        save()
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(channel='chrome',headless=True);client=browser.new_context()
            results['environment']['Chrome']=browser.version
            token=client.request.get(base+'/w/api/bootstrap').json()['token'];headers={'X-QualiCraft-Token':token}
            projects=base+'/w/api/projects'
            def get(url):
                r=client.request.get(url,headers=headers,timeout=120000);assert r.ok,(r.status,r.text());return r.json()
            def post(url,data):
                r=client.request.post(url,data=data,headers=headers,timeout=120000);assert r.ok,(r.status,r.text());return r.json()
            original=get(projects+'/a71a0b538c024c3ab23fb4286cfe93e2');original_backups=get(projects+'/'+original['id']+'/backups')['items']
            assert [len(original[k]) for k in ['documents','codes','annotations']]==[19,317,874]
            source_by_doc={d['id']:[a for a in original['annotations'] if a['document_id']==d['id']] for d in original['documents']}
            def fixture(n):
                p=copy.deepcopy(original);p['id']='capacity-'+str(n);p['name']='Bologna · technical capacity test';p['documents']=[];p['annotations']=[];p['suggestions']=[];p['audit']=[]
                p.pop('research_report',None)
                if 'plotting' not in p['blocks']:p['blocks'].append('plotting')
                for i in range(n):
                    src=original['documents'][i%19];d=copy.deepcopy(src);d['id']=f'capacity-{i:03d}';d['name']=f'Technical-replica-{i+1:03d}-{src["name"]}'
                    d['reading_state']['marks']=[];d['reading_state']['revision']=0;p['documents'].append(d)
                    for a in source_by_doc[src['id']]:
                        a=copy.deepcopy(a);a['id']=f'capacity-{i:03d}-'+a['id'];a['document_id']=d['id'];p['annotations'].append(a)
                return p
            def matrix(p):
                root=projects+'/'+p['id'];r=client.request.get(root+'/export?format=matrix',headers=headers);assert r.ok
                rows=list(csv.reader(io.StringIO(r.body().decode('utf-8-sig'))));assert len(rows)==len(p['documents'])+1 and len(rows[0])==318
                expected=Counter((a['document_id'],a['code_id']) for a in p['annotations'])
                for d,row in zip(p['documents'],rows[1:]):assert row[0]==d['name'] and list(map(int,row[1:]))==[expected[d['id'],c['id']] for c in p['codes']]
                return len(rows)-1,len(rows[0])-1
            def open_page(p,width=1440):
                c=browser.new_context(viewport={'width':width,'height':1000 if width>700 else 844},is_mobile=width==390,has_touch=width==390)
                c.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else (results['outside'].append(r.request.url),r.abort()))
                page=c.new_page();page.set_default_timeout(15000)
                page.on('pageerror',lambda e:results['console'].append(str(e)));page.on('console',lambda m:results['console'].append(m.text) if m.type=='error' else None);page.on('response',lambda r:results['http'].append([r.status,r.url]) if r.status>=400 else None)
                def enter():
                    page.goto(base+'/w/?lang=en',wait_until='networkidle');page.locator('#start-project-select').select_option(p['id']);page.locator('[data-action="start-open"]').click();expect(page.locator('#reading-document')).to_be_visible()
                timed(f'{len(p["documents"])}-doc open {width}',bounds['open_seconds'],enter)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
                return c,page
            def stages():
                for n in [1,2]:
                    p=timed(f'{n}-doc restore',bounds['restore_seconds'],lambda:post(projects,{'kind':'restore','project':fixture(n)}));shape=matrix(p)
                    c,page=open_page(p);expect(page.locator('#reading-document option')).to_have_count(n)
                    page.screenshot(path=str(out/'screenshots'/f'{n}-doc-desktop.png'));c.close()
                    results['stages'][str(n)]={'project_id':p['id'],'documents':n,'characters':sum(len(d['text']) for d in p['documents']),'codings':len(p['annotations']),'matrix_shape':shape,'bytes':len(json.dumps(p,ensure_ascii=False).encode())}
                return results['stages']
            check('one and two documents restore and render with exact matrix cells',stages)
            hundred=timed('99-doc setup restore',bounds['restore_seconds'],lambda:post(projects,{'kind':'restore','project':fixture(99)}));root=projects+'/'+hundred['id']
            c,page=open_page(hundred)
            def import_cancel():
                page.locator('[data-action="import"]').first.click();source=original['documents'][99%19]
                page.locator('#import-file').set_input_files({'name':'Technical-replica-100.txt','mimeType':'text/plain','buffer':source['text'].encode()})
                page.get_by_role('button',name='Cancel',exact=True).click();assert len(get(root)['documents'])==99
                return {'cancel_before_submit_keeps_99':True}
            check('cancelled source-file choice does not add a document',import_cancel)
            def import_last():
                source=original['documents'][99%19]
                page.locator('[data-action="import"]').first.click();page.locator('#import-file').set_input_files({'name':'Technical-replica-100.txt','mimeType':'text/plain','buffer':source['text'].encode()})
                timed('100th TXT actual UI import',bounds['import_seconds'],lambda:(page.locator('[data-action="save-document"]').click(),expect(page.locator('#dialog')).not_to_be_visible(),expect(page.locator('#reading-document option')).to_have_count(100)))
                saved=get(root);last=saved['documents'][-1];assert last['text']==source['text'] and last['sha256']==source['sha256']
                a=source_by_doc[source['id']][0];post(root+'/annotations',{'document_id':last['id'],'code_id':a['code_id'],'start':a['start'],'end':a['end']})
                saved=get(root);hundred.update(saved);matrix(saved)
                page.reload(wait_until='networkidle');expect(page.locator('#reading-document option')).to_have_count(100)
                page.screenshot(path=str(out/'screenshots'/'100-doc-import.png'))
                results['stages']['100']={'project_id':saved['id'],'documents':100,'characters':sum(len(d['text']) for d in saved['documents']),'codings':len(saved['annotations']),'matrix_shape':[100,317],'bytes':len(json.dumps(saved,ensure_ascii=False).encode()),'last_document_codings':1}
                return results['stages']['100']
            check('100th actual TXT import and saved coding preserve the complete project',import_last)
            def boundaries():
                before=get(root);backups=get(root+'/backups');ids={p['id'] for p in get(projects)}
                r=client.request.post(root+'/documents',headers=headers,data={'name':'excess.txt','text':original['documents'][0]['text']});assert r.status==400 and '100 documents' in r.text()
                bad=copy.deepcopy(before);bad['documents'][0]['sha256']='0'*64
                r=client.request.post(projects,headers=headers,data={'kind':'restore','project':bad});assert r.status==400
                assert get(root)==before and get(root+'/backups')==backups and {p['id'] for p in get(projects)}==ids
                return {'101st_refused':True,'corrupt_restore_refused':True,'audit_snapshots_source_unchanged':True}
            check('document-limit and corrupt-restore rejections are atomic',boundaries)
            def phone():
                mobile,q=open_page(hundred,390)
                for d in [hundred['documents'][0],hundred['documents'][49],hundred['documents'][99]]:
                    def switch():q.locator('#reading-document').select_option(d['id']);expect(q.locator('#reading-document')).to_have_value(d['id']);expect(q.locator('.passage').first).to_be_visible()
                    timed('phone switch '+d['name'],bounds['switch_seconds'],switch)
                q.locator('#reading-document').focus();q.locator('#reading-document').press('Home');q.locator('#reading-document').press('End')
                q.locator('[data-action="reading-overview"]').click();expect(q.locator('#reading-overview')).to_be_visible();q.locator('[data-action="reading-overview"]').press('Escape');expect(q.locator('#reading-overview')).not_to_be_visible()
                q.screenshot(path=str(out/'screenshots'/'100-doc-phone.png'));assert q.evaluate('document.documentElement.scrollWidth<=innerWidth')
                q.reload(wait_until='networkidle');expect(q.locator('#reading-document option')).to_have_count(100);mobile.close()
                return {'touch_document_switch_and_reload':True,'keyboard_select_and_overview':True,'device':'Chrome 390px emulation'}
            check('100-document phone switching, overview, keyboard and reload remain usable',phone)
            def exports():
                saved=get(root)
                for fmt in ['json','csv','matrix','methods']:
                    def download():
                        r=client.request.get(root+'/export?format='+fmt,headers=headers,timeout=120000);assert r.ok;return r.body()
                    blob=timed('100-doc '+fmt+' download',bounds['download_seconds'],download);(out/('100-doc.'+{'json':'json','csv':'csv','matrix':'matrix.csv','methods':'md'}[fmt])).write_bytes(blob)
                    if fmt=='csv':assert len(list(csv.DictReader(io.StringIO(blob.decode('utf-8-sig')))))==len(saved['annotations'])
                    if fmt=='json':assert json.loads(blob)==saved
                restored=timed('100-doc JSON recovery',bounds['restore_seconds'],lambda:post(projects,{'kind':'restore','project':saved}))
                for k in ['documents','codes','annotations']:assert restored[k]==saved[k]
                matrix(restored)
                return {'formats':4,'all_codings_exported':len(saved['annotations']),'restored_project_id':restored['id'],'exact_matrix_cells':31700}
            check('100-document complete exports and independent JSON recovery retain every record',exports)
            def graphs_figures():
                saved=get(root);graph=timed('100-doc network',bounds['download_seconds'],lambda:get(root+'/network'))
                nodes={n['id'] for n in graph['nodes']}
                for edge in graph['links']:assert edge['source'] in nodes and edge['target'] in nodes
                figures=[]
                for kind in ['frequency','coverage','cooccurrence','hierarchy','accumulation']:
                    def bundle():
                        r=client.request.get(root+'/plot-bundle?kind='+kind+'&top=20',headers=headers,timeout=120000);assert r.ok,(kind,r.status,r.text()[:200] if not r.ok else '');return r.body()
                    blob=timed('100-doc '+kind+' bundle',bounds['plot_bundle_seconds'],bundle);(out/(kind+'.zip')).write_bytes(blob)
                    with zipfile.ZipFile(io.BytesIO(blob)) as z:
                        assert len(z.namelist())==5
                        data=list(csv.DictReader(io.StringIO(z.read('figure_data.csv').decode())))
                        assert data
                        if kind=='frequency':
                            by_id=Counter(a['code_id'] for a in saved['annotations']);by_name={code['name']:by_id[code['id']] for code in saved['codes']};assert all(int(r['count'])==by_name[r['code']] for r in data)
                        if kind=='accumulation':assert len(data)==100 and int(data[-1]['cumulative'])==len({a['code_id'] for a in saved['annotations']})
                        if kind=='coverage':assert len({r['case'] for r in data})==100
                        target=out/'reproduction'/kind;target.mkdir(parents=True,exist_ok=True)
                        assert all('/' not in name and '\\' not in name for name in z.namelist())
                        originals={name:z.read(name) for name in z.namelist()}
                        for name,payload in originals.items():(target/name).write_bytes(payload)
                        def reproduce():
                            run=subprocess.run([sys.executable,'figure.py'],cwd=target,capture_output=True,timeout=120)
                            (target/'rerun.log').write_bytes(run.stdout+run.stderr);assert run.returncode==0
                            for name,payload in originals.items():assert (target/name).read_bytes()==payload,(kind,name)
                        timed('100-doc '+kind+' standalone reproduction',bounds['plot_bundle_seconds'],reproduce)
                        figures.append({'kind':kind,'CSV_rows':len(data),'bytes':len(blob),'sha256':hashlib.sha256(blob).hexdigest()})
                page.get_by_role('button',name='Figures',exact=True).click();page.wait_for_function('()=>{let i=document.querySelector("#plot-preview");return i?.complete&&i.naturalWidth>0&&!i.classList.contains("loading")}',timeout=120000)
                page.screenshot(path=str(out/'screenshots'/'100-doc-figure.png'))
                return {'network_nodes':len(nodes),'network_edges':len(graph['links']),'all_endpoints_exist':True,'figure_bundles':figures}
            check('100-document network and all five real figure bundles remain complete',graphs_figures)
            def report_and_memory():
                page.locator('[data-action="export"]').click();page.locator('[data-action="write-report"]').click();expect(page.locator('#report-save-state')).to_be_visible()
                page.locator('[data-report-field="title"]').fill('Bologna 100 document technical capacity check');page.locator('[data-report-action="save"]').click();expect(page.locator('#report-save-state')).to_have_text('Saved locally · version 1')
                report=get(root+'/report');assert report['state']['revision']==1 and not report['stale']
                page.locator('[data-action="close"]').click();page.reload(wait_until='networkidle');expect(page.locator('#reading-document option')).to_have_count(100)
                cdp=c.new_cdp_session(page);cdp.send('Performance.enable');metrics={m['name']:m['value'] for m in cdp.send('Performance.getMetrics')['metrics']};heap=metrics['JSHeapUsedSize']/1024/1024
                results['memory']={'browser_JS_heap_MB':heap,'backend_peak_polled_rss_MB':max(rss),'DOM_nodes':metrics.get('Nodes')};save()
                assert heap<bounds['browser_JS_heap_MB'];assert max(rss)<bounds['backend_rss_MB']
                assert get(projects+'/'+original['id'])==original
                # backup_status.last is service-wide; only the seed's snapshot
                # items belong to this unchanged-project assertion.
                assert get(projects+'/'+original['id']+'/backups')['items']==original_backups
                return {'report_saved_and_reloaded':True,'browser_JS_heap_MB':heap,'DOM_nodes':metrics.get('Nodes'),'backend_peak_polled_rss_MB':max(rss),'original_project_and_snapshots_unchanged':True,'memory_scope':'One owned backend process RSS sampled every 150ms; excludes plotting child RSS. Browser JS heap at final reload, not a process peak.'}
            check('100-document report saving and bounded memory leave the original seed untouched',report_and_memory)
            c.close();browser.close()
    finally:stop.set();monitor.join();save()
    results['pass']=all(c['pass'] for c in results['checks']) and not any(results[k] for k in ['console','http','outside']);save()
    print(json.dumps({'pass':results['pass'],'passed':sum(c['pass'] for c in results['checks']),'total':len(results['checks']),'console':len(results['console']),'http':len(results['http']),'outside':len(results['outside'])}));return 0 if results['pass'] else 1


if __name__=='__main__':raise SystemExit(main())
