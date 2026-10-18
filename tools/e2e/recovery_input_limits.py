"""UX55 real HTTP input guards and QCA history-byte capacity, public sources only."""
import argparse,base64,copy,io,itertools,json,sys,zipfile
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from tools.e2e.recovery_boundaries import Service,dump,backup_manifest
from qualicraft import core,qca_state,transcript

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--project',required=True,type=Path);parser.add_argument('--out',required=True,type=Path);args=parser.parse_args();out=args.out;out.mkdir(parents=True,exist_ok=True);p=json.loads(args.project.read_text(encoding='utf-8'));p['id']=core.uid();p['name']='Bologna · HTTP byte limits';s=Service(out/'service',p);root='/projects/'+p['id'];result={'checks':[]}
    def record(name,detail):result['checks'].append({'name':name,'pass':True,'detail':detail});dump(out/'results.json',result);print(name+': PASS',flush=True)
    def reject(name,path,body):
        before=s.json(root);projects=s.json('/projects');snapshots=backup_manifest(s.folder,p['id']);code,payload=s.request(path,body);assert code==400,(name,code,payload[:200]);assert s.json(root)==before and s.json('/projects')==projects and backup_manifest(s.folder,p['id'])==snapshots;record(name,{'HTTP':code,'no_DB_audit_snapshot_side_effect':True,'message':json.loads(payload)['error']})
    try:
        source=p['documents'][0]['text']
        for name,xml in [('missing main XML',None),('entity declaration',b'<!DOCTYPE x [<!ENTITY custom "Bologna">]><document/>'),('over-12MB XML',(source.encode()*1000)[:12000001])]:
            blob=io.BytesIO()
            with zipfile.ZipFile(blob,'w',zipfile.ZIP_DEFLATED) as z:z.writestr('other.xml' if xml is None else 'word/document.xml',b'Bologna' if xml is None else xml)
            reject('DOCX '+name,root+'/documents',{'name':'Bologna DOCX boundary','docx_base64':base64.b64encode(blob.getvalue()).decode()})
        reject('DOCX over 8MB container',root+'/documents',{'name':'Bologna DOCX bytes','docx_base64':base64.b64encode((source.encode()*1000)[:8000001]).decode()})
        state=p['comparative_qca'];body={'revision':state['revision'],'source_version':qca_state.source_version(p),'design':copy.deepcopy(state['design']),'options':state['options']}
        body['design']['conditions']=[qca_state.definition(c) for c in 'ABCDEFG'];reject('Seventh QCA condition',root+'/qca-save',body)
        body['design']=copy.deepcopy(state['design']);template=body['design']['cases'][0];body['design']['cases']=[{**copy.deepcopy(template),'id':'technical'+str(i)} for i in range(101)];reject('101st QCA case',root+'/qca-save',body)
        draft=copy.deepcopy(p['research_report']['current']['draft']);draft['narrative']=(source*20)[:100001];reject('Narrative over 100000 characters',root+'/report-save',{'revision':p['research_report']['revision'],'source_version':qca_state.source_version(p),'draft':draft})
        large=copy.deepcopy(p);text=(source*40)[:500000]
        while len(json.dumps(large,ensure_ascii=False).encode())<=19000000:core.add_document(large,'Bologna capacity technical repetition '+str(len(large['documents'])),text)
        bytes_=len(json.dumps({'kind':'restore','project':large},ensure_ascii=False).encode());assert 19000000<bytes_<20000000
        reject('Project over 19MB within HTTP request limit','/projects',{'kind':'restore','project':large});record('Explicit project-byte test load',{'request_bytes':bytes_,'documents':len(large['documents']),'technical_repetition_not_participants':True})
        d=qca_state.blank();d['question']='HTTP byte-capacity acceptance only';d['case_unit']='Public-source technical copies, not research participants';d['conditions']=[qca_state.definition(id) for id in 'ABCDEF']
        for n in d['conditions']+[d['outcome']]:n.update(label=n['id']+' technical test set',definition='Software acceptance designation',zero_rule='Explicit test assignment zero',one_rule='Explicit test assignment one',basis='Known Boolean test pattern, not coding frequency')
        for i in range(100):
            bits=list(itertools.product([0,1],repeat=6))[i%64];values=dict(zip(list('ABCDEF')+['Y'],[*bits,int(bits[0] and (bits[1] or bits[2]))]));d['cases'].append({'id':'technical'+str(i),'label':'Technical source record '+str(i+1),'document_ids':[p['documents'][0]['id']],'cells':{k:{'value':v,'rationale':('Technical acceptance only. '+source*2)[:2000],'evidence_ids':[]} for k,v in values.items()}})
        c=s.json(root+'/qca');s.json(root+'/qca-save',{'revision':c['state']['revision'],'source_version':c['source_version'],'design':d,'options':{}});successful=[]
        for i in range(8):
            before=s.json(root);c=s.json(root+'/qca');snapshots=backup_manifest(s.folder,p['id']);code,payload=s.request(root+'/qca-run',{'revision':c['state']['revision'],'source_version':c['source_version']})
            if code==400:
                assert '6 MB' in json.loads(payload)['error'];assert s.json(root)==before and backup_manifest(s.folder,p['id'])==snapshots;record('Actual QCA 6MB history rejection retains all prior runs',{'successful_large_runs':successful,'rejected_attempt':i+1,'HTTP':400,'state_bytes':len(transcript.canonical(before['comparative_qca']).encode()),'current_run_and_history_audit_snapshots_unchanged':True,'message':json.loads(payload)['error']});break
            assert code==200,(code,payload[:100]);value=json.loads(payload);successful.append({'revision':value['revision'],'history':len(value['history']),'state_bytes':len(transcript.canonical(value).encode())})
        else:raise AssertionError('Expected actual history-byte rejection was not reached')
        result['completed']=True;dump(out/'results.json',result)
    finally:s.stop()
if __name__=='__main__':main()
