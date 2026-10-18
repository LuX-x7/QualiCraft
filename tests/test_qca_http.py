"""Loopback-only QCA API atomicity and project restoration."""
import copy,json,tempfile,threading,unittest,urllib.request,urllib.error
from pathlib import Path
from unittest.mock import patch
from qualicraft import core,qca_state,reporting
from qualicraft.server import create_server
from tests.test_transcript_export import example
from tests.test_qca_state import design

class QCAHTTPTests(unittest.TestCase):
    def test_conflict_missing_run_auth_exports_and_failure_atomicity(self):
        with tempfile.TemporaryDirectory() as folder:
            p=example();store=core.Store(Path(folder)/'qualicraft.sqlite3');store.create(p);server=create_server(folder,folder,port=0);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start();base='http://127.0.0.1:'+str(server.server_port)
            token=json.load(urllib.request.urlopen(base+'/api/bootstrap'))['token'];root=base+'/api/projects/'+p['id'];headers={'Content-Type':'application/json','X-QualiCraft-Token':token}
            def request(path,body=None,auth=True):
                try:
                    response=urllib.request.urlopen(urllib.request.Request(root+path,data=json.dumps(body).encode() if body is not None else None,headers=headers if auth else {'Content-Type':'application/json'}),timeout=10)
                    return response.status,response.read()
                except urllib.error.HTTPError as e:return e.code,e.read()
            try:
                code,body=request('/qca');self.assertEqual(code,200);context=json.loads(body);self.assertIsNone(context['state']);self.assertEqual(request('/qca-save',{},False)[0],400)
                body={'revision':0,'source_version':context['source_version'],'design':design(p),'options':{}};self.assertEqual(request('/qca-save',body)[0],200);before=store.get(p['id']);backups=store.backups(p['id'])
                self.assertEqual(request('/qca-save',body)[0],409);self.assertEqual(store.get(p['id']),before);self.assertEqual(store.backups(p['id']),backups)
                running={'revision':1,'source_version':context['source_version']}
                with patch.object(qca_state.qca,'analyze',side_effect=qca_state.qca.ComplexityError('complexity')):self.assertEqual(request('/qca-run',running)[0],400)
                self.assertEqual(store.get(p['id']),before);self.assertEqual(store.backups(p['id']),backups)
                self.assertEqual(request('/qca-run',running)[0],200);self.assertEqual(request('/export?format=qca-zip')[0],200);self.assertEqual(request('/export?format=qca-json')[0],200)
                saved=store.get(p['id']);self.assertEqual(saved['documents'],p['documents']);self.assertEqual(saved['codes'],p['codes']);self.assertEqual(saved['annotations'],p['annotations'])
                self.assertEqual(core.validate_project(json.loads(json.dumps(saved)))['comparative_qca'],saved['comparative_qca'])
                self.assertEqual(request('/export?format=qca-json&run_id=missing')[0],400)
                draft=reporting.blank(saved,'comparative');code,payload=request('/report-save',{'revision':0,'source_version':reporting.source_version(saved),'draft':draft});self.assertEqual(code,200,payload)
                self.assertEqual(request('/export?format=report-docx')[0],200);self.assertEqual(request('/export?format=report-zip')[0],200)
            finally:server.shutdown();server.server_close();thread.join()
    def test_prepared_run_cannot_overwrite_concurrent_calibration(self):
        with tempfile.TemporaryDirectory() as folder:
            p=example();store=core.Store(Path(folder)/'p.sqlite3');store.create(p);d=design(p);body={'revision':0,'source_version':qca_state.source_version(p),'design':d,'options':{}}
            store.change(p['id'],lambda p:qca_state.save(p,body));candidate=store.get(p['id']);prepared=qca_state.run(candidate,{'revision':1,'source_version':body['source_version']})
            d=copy.deepcopy(d);d['question']='Concurrent research question';store.change(p['id'],lambda p:qca_state.save(p,{**body,'revision':1,'design':d}));before=store.get(p['id']);backups=store.backups(p['id'])
            with self.assertRaises(qca_state.QCAConflict):store.change(p['id'],lambda p:qca_state.install_prepared(p,prepared,1,body['source_version']))
            self.assertEqual(store.get(p['id']),before);self.assertEqual(store.backups(p['id']),backups)
    def test_public_demo_refuses_qca_writes(self):
        with tempfile.TemporaryDirectory() as folder:
            p=example();store=core.Store(Path(folder)/'qualicraft.sqlite3');store.create(p);server=create_server(folder,folder,port=0,public_demo=True);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start();base='http://127.0.0.1:'+str(server.server_port);token=json.load(urllib.request.urlopen(base+'/api/bootstrap'))['token']
            try:
                with self.assertRaises(urllib.error.HTTPError) as error:urllib.request.urlopen(urllib.request.Request(base+'/api/projects/'+p['id']+'/qca-save',data=b'{}',headers={'Content-Type':'application/json','X-QualiCraft-Token':token}))
                self.assertEqual(error.exception.code,403);self.assertEqual(store.get(p['id']),p)
            finally:server.shutdown();server.server_close();thread.join()

if __name__=='__main__':unittest.main()
