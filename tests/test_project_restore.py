"""UX60-01: raw browser uploads preserve public Bologna frozen records."""
import copy,io,json,tempfile,threading,unittest,urllib.error,urllib.request,zipfile
from pathlib import Path
from qualicraft import core,qca_state,reporting,transcript
from qualicraft.server import create_server
from tests.test_transcript_export import example
from tests.test_qca_state import design

class ProjectRestoreTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        p=example();qca_state.save(p,{'revision':0,'source_version':qca_state.source_version(p),'design':design(p),'options':{}})
        for _ in range(2):qca_state.run(p,{'revision':p['comparative_qca']['revision'],'source_version':qca_state.source_version(p)})
        for method in ['content','ta','comparative']:
            d=reporting.blank(p,method);d['narrative']='Public Bologna preservation fixture.'
            if method!='content':d['figures']=[{'id':'frequency','options':{'kind':'frequency','top':3},'caption':'Technical test only.'}]
            reporting.save(p,{'revision':p.get('research_report',{}).get('revision',0),'source_version':reporting.source_version(p),'draft':d})
            if method=='content':
                legacy=p['research_report']['current'];legacy.pop('method_map');legacy['content_hash']=reporting.digest({k:v for k,v in legacy.items() if k!='content_hash'})
        core.validate_project(copy.deepcopy(p));cls.fixture=p
    def setUp(self):
        self.folder=tempfile.TemporaryDirectory();self.addCleanup(self.folder.cleanup);self.home=Path(self.folder.name)
        self.store=core.Store(self.home/'qualicraft.sqlite3');self.p=copy.deepcopy(self.fixture);self.store.create(self.p)
        self.server=create_server(self.home,self.home,port=0);self.thread=threading.Thread(target=self.server.serve_forever,daemon=True);self.thread.start();self.addCleanup(self.stop)
        self.base='http://127.0.0.1:'+str(self.server.server_port);self.token=json.load(urllib.request.urlopen(self.base+'/api/bootstrap'))['token']
    def stop(self):self.server.shutdown();self.server.server_close();self.thread.join()
    def request(self,payload,path='/api/projects/restore',**headers):
        if isinstance(payload,dict):payload=json.dumps(payload,ensure_ascii=False).encode()
        request=urllib.request.Request(self.base+path,data=payload,headers={'Content-Type':'application/json','X-QualiCraft-Token':self.token,**headers})
        try:
            with urllib.request.urlopen(request,timeout=20) as response:return response.status,response.read()
        except urllib.error.HTTPError as e:return e.code,e.read()
    def state(self):
        return (self.store.list(),self.store.get(self.p['id']),{str(p.relative_to(self.home)):p.read_bytes() for p in (self.home/'backups').rglob('*.json')})
    def assertFrozen(self,restored):
        self.assertNotEqual(restored['id'],self.p['id'])
        for key in ['documents','codes','annotations','blocks','comparative_qca','research_report']:
            self.assertEqual(transcript.canonical(restored[key]),transcript.canonical(self.p[key]),key)
        core.validate_project(copy.deepcopy(restored))
        self.assertNotIn('method_map',restored['research_report']['history'][0])
    def test_raw_export_restores_all_versions_hashes_numeric_types_and_original_points(self):
        original=self.state();payload=json.dumps(self.p,ensure_ascii=False,indent=2).encode();status,data=self.request(payload);self.assertEqual(status,200,data)
        restored=json.loads(data);self.assertFrozen(restored);self.assertEqual(self.store.get(self.p['id']),original[1])
        for path,blob in original[2].items():self.assertEqual((self.home/path).read_bytes(),blob)
        self.assertEqual(len(self.store.list()),len(original[0])+1)
        snap=self.store.restore(restored['id'],self.store.backups(restored['id'])[0]['name']);self.assertFrozen(snap)
    def test_old_object_protocol_remains_compatible(self):
        status,data=self.request({'kind':'restore','project':self.p},path='/api/projects');self.assertEqual(status,200,data);self.assertFrozen(json.loads(data))
    def test_restored_report_and_qca_exports_keep_exact_frozen_metadata(self):
        status,data=self.request(json.dumps(self.p).encode());self.assertEqual(status,200,data);p=json.loads(data);url=self.base+'/api/projects/'+p['id']+'/export?format='
        for fmt,key in [('qca-json','comparative_qca'),('report-json','research_report')]:
            with urllib.request.urlopen(urllib.request.Request(url+fmt,headers={'X-QualiCraft-Token':self.token})) as r:record=json.load(r)
            actual=record if key=='comparative_qca' else record['report'];expected=p[key]['current'];self.assertEqual(transcript.canonical(actual),transcript.canonical(expected))
    def test_tampered_frozen_records_fail_without_creating_or_overwriting_anything(self):
        before=self.state()
        for target in ['qca','report','rehashed-calculation']:
            bad=copy.deepcopy(self.p)
            if target=='report':bad['research_report']['history'][0]['draft']['narrative']='Changed without a matching saved hash'
            else:
                r=bad['comparative_qca']['current'];r['result']['truth_table'][0]['n']+=1
                if target=='rehashed-calculation':r['content_hash']=qca_state.digest({k:v for k,v in r.items() if k!='content_hash'})
            with self.subTest(target=target):self.assertEqual(self.request(json.dumps(bad).encode())[0],400);self.assertEqual(self.state(),before)
    def test_invalid_source_auth_and_content_type_rejections_are_atomic(self):
        before=self.state()
        for blob in [b'',b'{broken',b'[]',b'null',b'{}',b'\xff']:
            with self.subTest(blob=blob):self.assertEqual(self.request(blob)[0],400);self.assertEqual(self.state(),before)
        for headers in [{'X-QualiCraft-Token':'wrong'},{'Content-Type':'text/plain'}]:
            self.assertEqual(self.request(b'{}',**headers)[0],400);self.assertEqual(self.state(),before)
    def test_twenty_MB_raw_request_limit_is_unchanged(self):
        payload=json.dumps(self.p,ensure_ascii=False).encode();payload+=b' '*(20_000_000-len(payload));status,data=self.request(payload);self.assertEqual(status,200,data);self.assertFrozen(json.loads(data));before=self.state()
        self.assertEqual(self.request(b'{}',**{'Content-Length':'20000001'})[0],400);self.assertEqual(self.state(),before)
    def test_read_only_server_refuses_new_restore_protocol(self):
        other=create_server(self.home,self.home,port=0,public_demo=True);thread=threading.Thread(target=other.serve_forever,daemon=True);thread.start();before=self.state()
        try:
            base='http://127.0.0.1:'+str(other.server_port);token=json.load(urllib.request.urlopen(base+'/api/bootstrap'))['token']
            with self.assertRaises(urllib.error.HTTPError) as error:urllib.request.urlopen(urllib.request.Request(base+'/api/projects/restore',data=b'{}',headers={'Content-Type':'application/json','X-QualiCraft-Token':token}))
            self.assertEqual(error.exception.code,403);self.assertEqual(self.state(),before)
        finally:other.shutdown();other.server_close();thread.join()

if __name__=='__main__':unittest.main()
