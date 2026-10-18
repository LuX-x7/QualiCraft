"""UX55 local-only Bologna input, sequential import and SIGKILL recovery audit.

This is a test harness, not application instrumentation. Fault hooks exist only
inside owned subprocesses. An observation is retained even when a gate fails.
"""
from __future__ import annotations
import argparse,base64,concurrent.futures,copy,hashlib,http.client,io,json,os,signal,sqlite3,subprocess,sys,time,urllib.error,urllib.request,zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT))
from qualicraft import core,qca_state,reporting,report_figures,transcript
from qualicraft.server import create_server,bologna_example

def sha(value):return hashlib.sha256(value if isinstance(value,bytes) else transcript.canonical(value).encode()).hexdigest()
def dump(path,value):path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
def package_members(payload):
    # Nested DOCX ZIP timestamps can differ on export; compare every actual member.
    with zipfile.ZipFile(io.BytesIO(payload)) as z:
        return {n:package_members(z.read(n)) if n.endswith(('.docx','.zip')) else sha(z.read(n)) for n in z.namelist()}

def public_seed():
    p=bologna_example();d=qca_state.blank();d['question']='Explicit technical QCA acceptance designations';d['case_unit']='Public source records for software acceptance, not independent research findings'
    for node in d['conditions']+[d['outcome']]:node.update(label=node['id']+' technical set',definition='Explicit binary software test designation',zero_rule='Assigned outside the technical set',one_rule='Assigned inside the technical set',basis='Software acceptance fixture; no empirical claim')
    for i,doc in enumerate(p['documents'][:2]):
        d['cases'].append({'id':'technical'+str(i),'label':'Bologna technical case '+str(i+1),'document_ids':[doc['id']],'cells':{k:{'value':1-i,'rationale':'Explicit technical test membership, not inferred from frequency','evidence_ids':[]} for k in ['A','Y']}})
    qca_state.save(p,{'revision':0,'source_version':qca_state.source_version(p),'design':d,'options':{}});qca_state.run(p,{'revision':1,'source_version':qca_state.source_version(p)})
    draft=reporting.blank(p,'comparative');draft['research_question']=d['question'];draft['case_unit']=d['case_unit'];draft['narrative']='Technical software acceptance example only; not substantive Bologna research findings.'
    reporting.save(p,{'revision':0,'source_version':reporting.source_version(p),'draft':draft});return p

def serve(folder,mode,action):
    folder=Path(folder);server=create_server(folder,folder/'no-guide',port=0,base_path='/w')
    def pause(stage):
        dump(folder/'paused.json',{'stage':stage,'pid':os.getpid()})
        while True:time.sleep(.05)
    if mode in ('before-snapshot','after-snapshot'):
        original=server.store._snapshot
        def snapshot(project):
            if mode=='before-snapshot':pause(mode)
            result=original(project)
            if mode=='after-snapshot':pause(mode)
            return result
        server.store._snapshot=snapshot
    if mode=='qca-prepared':
        original=qca_state.run
        def compute(*args,**kwargs):
            result=original(*args,**kwargs);pause(mode);return result
        qca_state.run=compute
    if mode=='report-prepared':
        original=reporting.save
        def prepare(*args,**kwargs):
            result=original(*args,**kwargs);pause(mode);return result
        reporting.save=prepare
    if mode in ('committed-no-ack','partial-export'):
        handler=server.RequestHandlerClass;original=handler.send
        def send(self,data,*args,**kwargs):
            if action in self.path and kwargs.get('status',200)==200:
                if mode=='committed-no-ack':pause(mode)
                if mode=='partial-export' and isinstance(data,bytes):
                    self.send_response(200);self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data[:max(1,len(data)//3)]);self.wfile.flush();pause(mode)
            return original(self,data,*args,**kwargs)
        handler.send=send
    dump(folder/'ready.json',{'pid':os.getpid(),'url':'http://127.0.0.1:'+str(server.server_port),'mode':mode})
    server.serve_forever()

class Service:
    def __init__(self,folder,project=None,mode='normal',action=''):
        self.folder=folder;folder.mkdir(parents=True,exist_ok=True)
        if project is not None:core.Store(folder/'qualicraft.sqlite3').create(copy.deepcopy(project))
        for name in ['ready.json','paused.json']:(folder/name).unlink(missing_ok=True)
        self.log=(folder/'process.txt').open('ab')
        self.process=subprocess.Popen([sys.executable,str(Path(__file__).resolve()),'--serve',str(folder),'--mode',mode,'--action',action],cwd=ROOT,stdout=self.log,stderr=self.log)
        self.wait('ready.json');self.base=json.loads((folder/'ready.json').read_text(encoding='utf-8'))['url']
        self.token=json.loads(urllib.request.urlopen(self.base+'/w/api/bootstrap',timeout=10).read())['token']
    def wait(self,name):
        deadline=time.monotonic()+15
        while time.monotonic()<deadline:
            if (self.folder/name).is_file():return
            if self.process.poll() is not None:raise RuntimeError('Owned backend exited: '+str(self.process.returncode))
            time.sleep(.02)
        raise TimeoutError('Owned backend did not reach '+name)
    def request(self,path,body=None):
        data=json.dumps(body,ensure_ascii=False).encode() if body is not None else None
        try:
            r=urllib.request.urlopen(urllib.request.Request(self.base+'/w/api'+path,data=data,headers={'Content-Type':'application/json','X-QualiCraft-Token':self.token}),timeout=30)
            return r.status,r.read()
        except urllib.error.HTTPError as e:return e.code,e.read()
    def json(self,path,body=None):
        status,payload=self.request(path,body);assert status==200,(status,payload[:300]);return json.loads(payload)
    def stop(self,kill=False):
        if self.process.poll() is None:self.process.kill() if kill else self.process.terminate()
        self.process.wait(timeout=10);self.log.close();return self.process.returncode

def backup_manifest(folder,id):
    return {p.name:sha(p.read_bytes()) for p in sorted((folder/'backups'/id).glob('*.json'))}
def evidence_state(project):
    return {k:sha(project.get(k)) for k in ['documents','codes','annotations','comparative_qca','research_report','audit']}
def validate(project):
    core.validate_project(copy.deepcopy(project));qca_state.validate_state(project['comparative_qca']);reporting.validate_state(project['research_report'])
    run=project['comparative_qca']['current'];assert run['result']==qca_state.qca.analyze(run['matrix'],run['options'])
    assert set(project['research_report']['assets'])>=report_figures.referenced(project['research_report']['current'])

def audit(out,seed_path=None):
    out.mkdir(parents=True,exist_ok=True);result={'baseline':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'checks':[],'findings':[],'scope':'public Bologna only; owned loopback subprocesses; no feature edits','bounds':{'ready_seconds':15,'request_seconds':30,'sequential_import_seconds':120,'cases':100,'conditions':6,'documents':100}}
    def record(name,detail,passed=True):
        result['checks'].append({'name':name,'pass':passed,'detail':detail});dump(out/'results.json',result);print(name+': '+('PASS' if passed else 'FAIL'),flush=True)
    # Read only the explicitly public UX54 sample and verify its source records.
    seed=json.loads(seed_path.read_text(encoding='utf-8')) if seed_path else public_seed();public=bologna_example()
    for k in ['documents','codes','annotations']:assert seed[k]==public[k]
    seed['id']=core.uid();seed['name']='Bologna · UX55 boundary seed'
    service=Service(out/'seed-service',seed);root='/projects/'+seed['id']
    try:
        draft=copy.deepcopy(seed['research_report']['current']['draft']);draft['title']='Bologna · QCA recovery acceptance'
        draft['figures']=[{'id':'f'+str(i),'options':{'kind':kind,'top':3},'caption':'Original descriptive coding figure; independent of QCA calibration.'} for i,kind in enumerate(['frequency','coverage','cooccurrence','hierarchy','accumulation'],1)]
        service.json(root+'/report-save',{'revision':seed['research_report']['revision'],'source_version':reporting.source_version(seed),'draft':draft})
        seed=service.json(root);validate(seed);dump(out/'public-seed.project.json',seed)
        files={}
        for fmt in ['json','qca-json','qca-zip','report-json','report-html','report-docx','report-zip']:
            code,payload=service.request(root+'/export?format='+fmt);assert code==200,(fmt,code,payload[:200]);files[fmt]=payload;(out/'exports-before').mkdir(exist_ok=True);(out/'exports-before'/fmt).write_bytes(payload)
        record('Complete frozen QCA and five-figure report seed',{'documents':len(seed['documents']),'codes':len(seed['codes']),'codings':len(seed['annotations']),'QCA_run':seed['comparative_qca']['current']['id'],'frozen_figures':len(seed['research_report']['assets']),'export_formats':len(files)})
    finally:service.stop()

    # Input refusals must leave the existing project, audit and snapshots equal.
    s=Service(out/'input-service',seed);root='/projects/'+seed['id'];source=seed['documents'][0]['text'];input_rows=[]
    def refuse(label,path,body):
        before=s.json(root);projects=s.json('/projects');backups=backup_manifest(s.folder,seed['id']);status,payload=s.request(path,body)
        same=s.json(root)==before and s.json('/projects')==projects and backup_manifest(s.folder,seed['id'])==backups
        row={'name':label,'HTTP':status,'unchanged':same,'message':json.loads(payload).get('error')};input_rows.append(row)
        assert status==400 and same,row
    try:
        for label,body in [('empty',{'name':'empty','text':' \n '}),('500001 characters',{'name':'Bologna repeated boundary','text':(source*40)[:500001]}),('corrupt DOCX',{'name':'bad','docx_base64':base64.b64encode(b'not a ZIP').decode()})]:refuse(label,root+'/documents',body)
        for label,change in [('fractional membership',lambda p:p['comparative_qca']['design']['cases'][0]['cells']['A'].__setitem__('value',.5)),('tampered frozen result',lambda p:p['comparative_qca']['current']['result']['truth_table'][0].__setitem__('n',999)),('missing report figure',lambda p:p['research_report']['assets'].clear()),('tampered report hash',lambda p:p['research_report']['current'].__setitem__('content_hash','0'*64))]:
            bad=copy.deepcopy(seed);change(bad);refuse(label,'/projects',{'kind':'restore','project':bad})
        for suffix,blob in [('.pdf',b'%PDF-1.4\n'),('.bin',source.encode())]:refuse('unsupported '+suffix,'/import',{'filename':'Bologna'+suffix,'data':base64.b64encode(blob).decode()})
        refused=s.json(root);record('Invalid inputs and corrupted QCA/report recovery are atomic',input_rows)
        exact=(source*40)[:500000];start=time.perf_counter();doc=s.json(root+'/documents',{'name':'Bologna exact 500000 technical repetition','text':exact});assert doc['text']==exact
        record('Exact 500000-character accepted boundary',{'characters':len(doc['text']),'sha256':sha(exact.encode()),'seconds':time.perf_counter()-start,'technical_repetition':True})
        name='Bologna duplicate technical import';a=s.json(root+'/documents',{'name':name,'text':source});b=s.json(root+'/documents',{'name':name,'text':source});assert a['id']!=b['id'] and a['sha256']==b['sha256']
        result['findings'].append({'id':'UX55-01','severity':'P2','kind':'input UX','title':'Duplicate name and identical text are accepted as distinct documents without a duplicate warning','evidence':{'first_id':a['id'],'second_id':b['id'],'same_source_sha256':a['sha256']}})
        record('Duplicate import behavior observed',{'two_distinct_IDs':True,'same_content':True,'warning_returned':False})
        # Real request-size header rejection occurs before reading any body.
        conn=http.client.HTTPConnection(s.base.split('://')[1],timeout=10);conn.request('POST','/w/api/projects',body=None,headers={'Content-Type':'application/json','Content-Length':'20000001','X-QualiCraft-Token':s.token});response=conn.getresponse();payload=response.read();assert response.status==400;conn.close();assert s.json(root)['comparative_qca']==seed['comparative_qca'];record('Over-20MB request header refused before body read',{'HTTP':400,'message':json.loads(payload)['error']})
    finally:s.stop()

    # Kill at precise production boundaries. No application source is changed.
    faults=[('calibration-before-write','before-snapshot','qca-save'),('QCA-detached-prepared','qca-prepared','qca-run'),('QCA-before-commit','before-snapshot','qca-run'),('QCA-snapshot-before-commit','after-snapshot','qca-run'),('QCA-committed-before-receipt','committed-no-ack','qca-run'),('report-detached-prepared','report-prepared','report-save'),('report-before-commit','before-snapshot','report-save'),('report-committed-before-receipt','committed-no-ack','report-save'),('report-ZIP-download','partial-export','export?format=report-zip')]
    for label,mode,action in faults:
        folder=out/'faults'/label;s=Service(folder,seed,mode,action);root='/projects/'+seed['id'];before=s.json(root);initial_backups=backup_manifest(folder,seed['id'])
        if action=='qca-save':
            d=copy.deepcopy(seed['comparative_qca']['design']);d['cases'][0]['cells']['A']['rationale']+=' Reviewed at interruption boundary.';body={'revision':seed['comparative_qca']['revision'],'source_version':qca_state.source_version(seed),'design':d,'options':seed['comparative_qca']['options']}
        elif action=='qca-run':body={'revision':seed['comparative_qca']['revision'],'source_version':qca_state.source_version(seed)}
        elif action=='report-save':
            d=copy.deepcopy(seed['research_report']['current']['draft']);d['narrative']+='\nRecovery boundary technical note.';body={'revision':seed['research_report']['revision'],'source_version':reporting.source_version(seed),'draft':d}
        else:body=None
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
            pending=pool.submit(s.request,root+'/'+action,body);s.wait('paused.json');exit_code=s.stop(kill=True)
            try:network=pending.result(timeout=10);network={'HTTP':network[0],'bytes':len(network[1])}
            except Exception as e:network={'transport_error':type(e).__name__}
        s=Service(folder)
        try:
            after=s.json(root);validate(after)
            with sqlite3.connect(folder/'qualicraft.sqlite3') as db:integrity=db.execute('PRAGMA integrity_check').fetchone()[0]
            assert integrity=='ok'
            committed=mode=='committed-no-ack'
            if not committed:assert after==before,(label,evidence_state(after),evidence_state(before))
            elif action=='qca-run':assert after['comparative_qca']['revision']==before['comparative_qca']['revision']+1 and after['research_report']==before['research_report'] and after['comparative_qca']['history'][-1]==before['comparative_qca']['current']
            else:assert after['research_report']['revision']==before['research_report']['revision']+1 and after['comparative_qca']==before['comparative_qca']
            for k in ['documents','codes','annotations']:assert after[k]==before[k]
            retry=None
            if committed:retry=s.request(root+'/'+action,body)[0];assert retry==409
            for fmt in ['qca-json','report-json','report-docx','report-zip']:
                code,payload=s.request(root+'/export?format='+fmt);assert code==200
                if not committed:
                    if fmt.endswith('zip') or fmt=='report-docx':
                        assert package_members(payload)==package_members(files[fmt]),(label,fmt)
                    else:assert json.loads(payload)==json.loads(files[fmt])
            latest=sorted((folder/'backups'/seed['id']).glob('*.json'))[-1];snapshot=json.loads(latest.read_text(encoding='utf-8'));validate(snapshot)
            ahead=snapshot.get('comparative_qca')!=after.get('comparative_qca') or snapshot.get('research_report')!=after.get('research_report')
            if ahead:result['findings'].append({'id':'UX55-02','severity':'P2','kind':'interruption recovery','title':'An atomic snapshot is visible before the enclosing SQLite transaction commits; killing here leaves a snapshot of an unacknowledged run ahead of the live database','evidence':{'scenario':label,'live_QCA_revision':after['comparative_qca']['revision'],'snapshot_QCA_revision':snapshot['comparative_qca']['revision'],'snapshot_valid':True,'live_DB_rolled_back':True,'snapshot_name':latest.name}})
            detail={'mode':mode,'owned_child_exit':exit_code,'network':network,'committed':committed,'DB_integrity':integrity,'full_live_state_restored':not committed,'all_frozen_records_valid':True,'original_source_unchanged':True,'repeated_old_revision_HTTP':retry,'snapshot_ahead_of_live':ahead,'before_hashes':evidence_state(before),'after_hashes':evidence_state(after),'initial_backups':initial_backups,'final_backups':backup_manifest(folder,seed['id'])}
            record(label,detail);dump(folder/'recovered-summary.json',detail)
        finally:s.stop()

    # Actual sequential document writes, interrupted between acknowledged items.
    folder=out/'sequential';s=Service(folder,seed);root='/projects/'+seed['id'];start=time.perf_counter();seconds=[]
    try:
        for i in range(12):
            t=time.perf_counter();s.json(root+'/documents',{'name':'Bologna sequential technical '+str(i),'text':source});seconds.append(time.perf_counter()-t)
        acknowledged=s.json(root);assert len(acknowledged['documents'])==31
    finally:s.stop()
    s=Service(folder,mode='before-snapshot',action='documents')
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
        pending=pool.submit(s.request,root+'/documents',{'name':'Bologna unacknowledged item','text':source});s.wait('paused.json');exit_code=s.stop(kill=True)
        try:pending.result(timeout=10)
        except Exception:pass
    s=Service(folder)
    try:
        assert s.json(root)==acknowledged
        for i in range(69):
            t=time.perf_counter();s.json(root+'/documents',{'name':'Bologna resumed technical '+str(i),'text':source});seconds.append(time.perf_counter()-t)
        final=s.json(root);assert len(final['documents'])==100;assert len({d['id'] for d in final['documents']})==100;assert final['comparative_qca']==seed['comparative_qca'] and final['research_report']==seed['research_report'];assert qca_state.is_stale(final) and reporting.context(final)['stale']
        backups=backup_manifest(folder,seed['id']);code,payload=s.request(root+'/documents',{'name':'Bologna 101st technical','text':source});assert code==400 and s.json(root)==final and backup_manifest(folder,seed['id'])==backups
        code,payload=s.request(root+'/export?format=json');assert code==200 and json.loads(payload)==final
        project_bytes=len(payload)
        restored=s.json('/projects',{'kind':'restore','project':json.loads(payload)});validate(restored)
        for k in ['documents','codes','annotations','comparative_qca','research_report']:assert restored[k]==final[k]
        snapshot=s.json(root+'/backups')['items'][0]['name'];recovered=s.json(root+'/restore-snapshot',{'name':snapshot});validate(recovered)
        for k in ['documents','codes','annotations','comparative_qca','research_report']:assert recovered[k]==final[k]
        dump(out/'recovered-100.project.json',restored)
        for fmt in ['qca-zip','report-zip']:
            code,payload=s.request('/projects/'+restored['id']+'/export?format='+fmt);assert code==200;(out/('recovered-'+fmt+'.zip')).write_bytes(payload)
        elapsed=time.perf_counter()-start;assert elapsed<120
        record('Sequential 100-document import, interrupted write, JSON and snapshot recovery',{'start_documents':19,'acknowledged_before_kill':31,'after_restart_documents':31,'final_documents':100,'new_imports':81,'not_bulk_upload':True,'101st_HTTP':400,'QCA_and_report_exactly_preserved':True,'stale_flags_preserved':True,'snapshot_and_JSON_full_recovery':True,'total_seconds':elapsed,'import_seconds_min':min(seconds),'import_seconds_max':max(seconds),'final_project_bytes':project_bytes,'owned_child_exit':exit_code})
    finally:s.stop()
    # Independent frozen QCA and five figure recipe reproduction after crash/recovery.
    reproduction=[]
    with zipfile.ZipFile(out/'recovered-report-zip.zip') as z:
        folder=out/'reproduction';folder.mkdir(exist_ok=True)
        for name in z.namelist():
            assert '..' not in Path(name).parts and not Path(name).is_absolute()
            target=folder/name;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(z.read(name))
        scripts=[folder/'qca/reproduce.py',*sorted(folder.glob('figures/*/figure.py'))];assert len(scripts)==6
        for script in scripts:
            frozen={p.name:sha(p.read_bytes()) for p in script.parent.iterdir() if p.is_file()};run=subprocess.run([sys.executable,script.name],cwd=script.parent,capture_output=True,text=True,timeout=120);(script.parent/'rerun.txt').write_text(run.stdout+run.stderr,encoding='utf-8');assert run.returncode==0,run.stderr
            if script.name=='figure.py':assert frozen=={n:sha((script.parent/n).read_bytes()) for n in frozen}
            else:assert json.loads((script.parent/'reproduced-result.json').read_text(encoding='utf-8'))==seed['comparative_qca']['current']['result']
            reproduction.append({'script':str(script.relative_to(folder)),'exit_code':run.returncode,'frozen_values_and_members_equal':True})
    record('Recovered QCA engine and all five frozen figure scripts independently reproduce',reproduction)
    result['completed']=True;result['all_executed_checks_pass']=all(c['pass'] for c in result['checks']);dump(out/'results.json',result);print(json.dumps({'checks':len(result['checks']),'findings':result['findings'],'completed':True}),flush=True)

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--out',type=Path);parser.add_argument('--seed',type=Path);parser.add_argument('--serve');parser.add_argument('--mode',default='normal');parser.add_argument('--action',default='');args=parser.parse_args()
    if args.serve:return serve(args.serve,args.mode,args.action)
    assert args.out is not None;return audit(args.out.resolve(),args.seed)
if __name__=='__main__':main()
