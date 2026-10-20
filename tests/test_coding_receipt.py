"""Bologna coding receipts: committed state, no source re-download, safe fallback."""
import copy,json,tempfile,threading,unittest,urllib.request,urllib.error
from pathlib import Path
from unittest.mock import patch
from qualicraft.server import create_server,bologna_example

class CodingReceiptTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.server=create_server(self.tmp.name,self.tmp.name,port=0)
        self.project=bologna_example();self.server.store.create(self.project)
        self.thread=threading.Thread(target=self.server.serve_forever,daemon=True);self.thread.start();self.addCleanup(self.stop)
        self.base='http://127.0.0.1:'+str(self.server.server_port)
        with urllib.request.urlopen(self.base+'/api/bootstrap') as r:self.token=json.loads(r.read())['token']
        self.path='/api/projects/'+self.project['id']
    def stop(self):
        self.server.shutdown();self.server.server_close();self.thread.join()
    def request(self,action='',body=None,headers=None):
        req=urllib.request.Request(self.base+self.path+('/'+action if action else ''),data=None if body is None else json.dumps(body).encode(),headers={'X-QualiCraft-Token':self.token,'Content-Type':'application/json',**(headers or {})})
        try:response=urllib.request.urlopen(req,timeout=15)
        except urllib.error.HTTPError as e:response=e
        with response:return response.status,json.loads(response.read()),response.headers
    def apply(self,project,receipt):
        result=copy.deepcopy(project)
        for key,change in receipt['patch'].items():
            if change['op']=='splice':result[key][change['start']:change['start']+change['delete']]=change['items']
            elif change['op']=='set':result[key]=change['value']
            else:del result[key]
        return result
    def test_add_receipt_exactly_reconstructs_committed_project_and_snapshot(self):
        _,before,headers=self.request();version=headers.get('X-QT-Project-Version');self.assertIsNotNone(version)
        status,r,_=self.request('codes',{'name':'Bologna receipt check'}, {'X-QT-Save-Response':'compact-v1','X-QT-Project-Version':version})
        self.assertEqual(status,200);self.assertEqual(r['format'],'qt-save-v1');self.assertNotIn('project',r)
        self.assertEqual(r['base_version'],version);actual=self.server.store.get(before['id']);self.assertEqual(self.apply(before,r),actual)
        self.assertNotIn('documents',r['patch']);self.assertLess(len(json.dumps(r).encode()),12000)
        self.assertTrue(r['backups']);self.assertIsNone(r['backup_status']['error'])
        snap=Path(self.server.store.backup_dir)/before['id']/r['backups'][0]['name'];self.assertEqual(json.loads(snap.read_text(encoding='utf-8')),actual)
        self.assertEqual(self.request()[2]['X-QT-Project-Version'],r['version'])
    def test_stale_baseline_falls_back_to_full_committed_state_without_replaying_write(self):
        _,before,h=self.request();self.request('codes',{'name':'Other window code'})
        status,r,_=self.request('codes',{'name':'Current window code'},{'X-QT-Save-Response':'compact-v1','X-QT-Project-Version':h.get('X-QT-Project-Version','missing')})
        self.assertEqual(status,200);self.assertEqual(r['format'],'qt-save-v1');self.assertEqual(r['project'],self.server.store.get(before['id']))
        self.assertEqual(sum(c['name']=='Current window code' for c in r['project']['codes']),1)
    def test_legacy_response_and_commit_failure_preserve_existing_rules(self):
        _,code,_=self.request('codes',{'name':'Legacy code'});self.assertEqual(code['name'],'Legacy code');self.assertNotIn('format',code)
        before=self.server.store.get(self.project['id']);points=self.server.store.backups(self.project['id'])
        with patch.object(self.server.store,'_queue_snapshot',side_effect=RuntimeError('technical transaction failure')):
            status,_,_=self.request('codes',{'name':'Must roll back'},{'X-QT-Save-Response':'compact-v1'})
        self.assertEqual(status,500);self.assertEqual(self.server.store.get(before['id']),before);self.assertEqual(self.server.store.backups(before['id']),points)

    def test_annotation_edit_remove_preserve_all_frozen_versions_and_original_points(self):
        from tests.test_project_restore import ProjectRestoreTests
        from qualicraft.core import uid
        from qualicraft.transcript import canonical
        ProjectRestoreTests.setUpClass()
        frozen=copy.deepcopy(ProjectRestoreTests.fixture);frozen['id']=uid();self.server.store.create(frozen)
        self.path='/api/projects/'+frozen['id']
        _,before,h=self.request();old_points=self.server.store.backups(frozen['id'])
        points={p['name']:(Path(self.server.store.backup_dir)/frozen['id']/p['name']).read_bytes() for p in old_points}
        status,r,_=self.request('annotations',{'document_id':frozen['documents'][0]['id'],'code_id':frozen['codes'][0]['id'],'start':0,'end':8,'memo':'Bologna exact range'}, {'X-QT-Save-Response':'compact-v1','X-QT-Project-Version':h['X-QT-Project-Version']})
        self.assertEqual(status,200);actual=self.server.store.get(frozen['id']);self.assertEqual(self.apply(before,r),actual)
        self.assertNotIn('documents',r['patch']);self.assertNotIn('research_report',r['patch']);self.assertNotIn('comparative_qca',r['patch'])
        annotation=r['result'];self.assertEqual(annotation['quote'],frozen['documents'][0]['text'][:8])
        for action,body in [('memo',{'id':annotation['id'],'memo':'Updated technical memo'}),('remove-annotation',{'id':annotation['id']})]:
            before=actual
            status,new,_=self.request(action,body,{'X-QT-Save-Response':'compact-v1','X-QT-Project-Version':r['version']})
            self.assertEqual(status,200);actual=self.server.store.get(frozen['id']);self.assertEqual(self.apply(before,new),actual);r=new
        for key in ['documents','comparative_qca','research_report']:self.assertEqual(canonical(actual[key]),canonical(frozen[key]))
        for name,data in points.items():self.assertEqual((Path(self.server.store.backup_dir)/frozen['id']/name).read_bytes(),data)

    def test_snapshot_failure_is_reported_after_real_commit_not_hidden_by_fast_receipt(self):
        _,before,h=self.request()
        with patch.object(self.server.store,'_write_snapshot',side_effect=OSError('technical backup failure')):
            status,r,_=self.request('codes',{'name':'Committed with backup warning'},{'X-QT-Save-Response':'compact-v1','X-QT-Project-Version':h['X-QT-Project-Version']})
        self.assertEqual(status,200);self.assertTrue(r['backup_status']['error']);self.assertEqual(self.apply(before,r),self.server.store.get(before['id']))
