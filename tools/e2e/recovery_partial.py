"""UX55 acknowledged persistence versus missing calibration after a lost receipt."""
import argparse,concurrent.futures,copy,json,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from tools.e2e.recovery_boundaries import Service,dump,backup_manifest,validate
from qualicraft import core,qca_state,reporting

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--project',required=True,type=Path);parser.add_argument('--out',required=True,type=Path);a=parser.parse_args();a.out.mkdir(parents=True,exist_ok=True);p=json.loads(a.project.read_text(encoding='utf-8'));p['id']=core.uid();p['name']='Bologna · partial calibration recovery';folder=a.out/'service';root='/projects/'+p['id'];s=Service(folder,p,'committed-no-ack','qca-save');d=copy.deepcopy(p['comparative_qca']['design']);d['cases'][0]['cells']['A']['value']=None;body={'revision':p['comparative_qca']['revision'],'source_version':qca_state.source_version(p),'design':d,'options':p['comparative_qca']['options']}
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
        request=pool.submit(s.request,root+'/qca-save',body);s.wait('paused.json');exit_code=s.stop(kill=True)
        try:request.result(timeout=10)
        except Exception:pass
    s=Service(folder);result={'checks':[]}
    try:
        saved=s.json(root);validate(saved);assert saved['comparative_qca']['design']==d;assert saved['comparative_qca']['current']==p['comparative_qca']['current'] and saved['research_report']==p['research_report'];assert qca_state.is_stale(saved) and reporting.context(saved)['stale']
        restored=s.json('/projects',{'kind':'restore','project':saved});snapshot=s.json(root+'/backups')['items'][0]['name'];snap=s.json(root+'/restore-snapshot',{'name':snapshot})
        for project in [restored,snap]:
            for key in ['documents','codes','annotations','comparative_qca','research_report']:assert project[key]==saved[key]
        result['checks'].append({'name':'Missing calibration committed without receipt survives restart, JSON and snapshot copy','pass':True,'detail':{'owned_exit':exit_code,'membership':None,'missing_not_zero':True,'old_run_and_report_equal':True,'stale':True,'revision':saved['comparative_qca']['revision']}})
        before=s.json(root);backups=backup_manifest(folder,p['id']);code,error=s.request(root+'/qca-run',{'revision':before['comparative_qca']['revision'],'source_version':qca_state.source_version(before)});assert code==400 and s.json(root)==before and backup_manifest(folder,p['id'])==backups
        code,payload=s.request(root+'/export?format=qca-json');assert code==200 and json.loads(payload)==p['comparative_qca']['current'];code,payload=s.request(root+'/export?format=report-json');assert code==200 and json.loads(payload)['report']==p['research_report']['current']
        result['checks'].append({'name':'Missing recovered membership blocks rerun without overwriting frozen exports','pass':True,'detail':{'HTTP':400,'message':json.loads(error)['error'],'DB_audit_snapshots_equal':True,'old_QCA_and_report_exports_equal':True}});result['completed']=True;dump(a.out/'results.json',result);print(json.dumps(result,indent=2))
    finally:s.stop()
if __name__=='__main__':main()
