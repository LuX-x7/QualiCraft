"""UX81: deliberate removal of public Bologna sources, with recovery."""
import copy,json,tempfile,unittest,threading,urllib.request,urllib.error,contextlib
from pathlib import Path
from unittest.mock import patch
from qualicraft import core,document_management as dm,qca_state,reporting
from qualicraft.server import bologna_example
from tools.e2e.recovery_boundaries import Service,backup_manifest,public_seed

class DocumentManagementTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.p=bologna_example();self.s=Service(Path(self.tmp.name),self.p);self.root='/projects/'+self.p['id'];self.doc=self.p['documents'][0]
 def tearDown(self):self.s.stop();self.tmp.cleanup()
 def state(self):return self.s.json(self.root),backup_manifest(self.s.folder,self.p['id'])
 def preview(self,id=None):return self.s.json(self.root+'/document-removal?id='+(id or self.doc['id']))
 def test_preview_is_read_only_and_exact_about_cascades(self):
  before=self.state();r=self.preview();self.assertEqual(r['document']['id'],self.doc['id']);self.assertEqual(r['codings'],sum(a['document_id']==self.doc['id'] for a in self.p['annotations']));self.assertTrue(r['confirmation']);self.assertEqual(self.state(),before)
 def test_missing_confirmation_and_stale_confirmation_do_not_write(self):
  before=self.state();status,_=self.s.request(self.root+'/document-delete',{'id':self.doc['id']});self.assertEqual(status,400);self.assertEqual(self.state(),before)
  r=self.preview();self.s.json(self.root+'/document-update',{'id':self.doc['id'],'changes':{'memo':'Public Bologna QA note'}});before=self.state();status,payload=self.s.request(self.root+'/document-delete',{'id':self.doc['id'],'confirmation':r['confirmation']});self.assertEqual(status,400);self.assertIn('changed',json.loads(payload)['error']);self.assertEqual(self.state(),before)
 def test_remove_only_selected_identity_and_restore_exact_predelete_state(self):
  before=self.s.json(self.root);r=self.preview();self.s.json(self.root+'/document-delete',{'id':self.doc['id'],'confirmation':r['confirmation']});after=self.s.json(self.root)
  self.assertEqual(after['documents'],[d for d in before['documents'] if d['id']!=self.doc['id']]);self.assertEqual(after['codes'],before['codes']);self.assertEqual(after['annotations'],[a for a in before['annotations'] if a['document_id']!=self.doc['id']]);self.assertEqual(after['suggestions'],[a for a in before['suggestions'] if a['document_id']!=self.doc['id']]);core.validate_project(copy.deepcopy(after));self.assertEqual(after['audit'][-1]['action'],'document_remove')
  snapshots=self.s.json(self.root+'/backups')['items'];folder=self.s.folder/'backups'/self.p['id'];matches=[]
  for row in snapshots:
   path=next(self.s.folder.rglob(row['name']));saved=json.loads(path.read_text(encoding='utf-8'));
   if saved==before:matches.append(row['name'])
  self.assertTrue(matches,'No exact pre-removal recovery point');restored=self.s.json(self.root+'/restore-snapshot',{'name':matches[0]});self.assertNotEqual(restored['id'],before['id']);self.assertEqual(restored['documents'],before['documents']);self.assertEqual(restored['annotations'],before['annotations']);self.assertEqual(self.s.json(self.root),after)
 def test_same_name_and_content_still_remove_by_id_and_last_document_is_allowed(self):
  p=copy.deepcopy(self.p);p['documents']=[copy.deepcopy(self.doc),copy.deepcopy(self.doc)];p['documents'][1]['id']='bologna_duplicate';p['annotations']=[];p['suggestions']=[]
  target=p['documents'][1]['id'];r=dm.removal_info(p,target);dm.remove_document(p,{'id':target,'confirmation':r['confirmation']});self.assertEqual(p['documents'][0]['id'],self.doc['id']);dm.remove_document(p,{'id':self.doc['id'],'confirmation':dm.removal_info(p,self.doc['id'])['confirmation']});self.assertEqual(p['documents'],[]);core.validate_project(p)
 def test_current_qca_mapping_blocks_without_changing_calibration_or_frozen_reports(self):
  p=public_seed();before=copy.deepcopy(p);id=p['documents'][0]['id'];r=dm.removal_info(p,id);self.assertTrue(r['blocked']);self.assertTrue(r['qca_cases'])
  with self.assertRaisesRegex(ValueError,'QCA'):dm.remove_document(p,{'id':id,'confirmation':r['confirmation']})
  self.assertEqual(p,before)
 def test_unmapped_document_removal_preserves_all_frozen_versions(self):
  p=public_seed();id=p['documents'][-1]['id'];before=copy.deepcopy(p);dm.remove_document(p,{'id':id,'confirmation':dm.removal_info(p,id)['confirmation']});self.assertEqual(p['comparative_qca'],before['comparative_qca']);self.assertEqual(p['research_report'],before['research_report']);core.validate_project(p);self.assertTrue(qca_state.is_stale(p));self.assertTrue(reporting.entry_stale(p,p['research_report']['current']))
 def test_recovery_failure_aborts_removal_and_preserves_existing_recovery_points(self):
  store=core.Store(Path(self.tmp.name)/'direct.sqlite3');store.create(copy.deepcopy(self.p));before=store.get(self.p['id']);backups=store.backups(self.p['id']);body={'id':self.doc['id'],'confirmation':dm.removal_info(before,self.doc['id'])['confirmation']}
  with patch.object(store,'_checked_snapshot',side_effect=ValueError('Recovery unavailable')):
   with self.assertRaisesRegex(ValueError,'Recovery unavailable'):store.change(self.p['id'],lambda p:dm.remove_document(p,body),preserve_before=True)
  self.assertEqual(store.get(self.p['id']),before);self.assertEqual(store.backups(self.p['id']),backups)
 def test_unknown_id_and_repeat_removal_are_rejected_without_mutation(self):
  before=self.state();status,_=self.s.request(self.root+'/document-delete',{'id':'missing','confirmation':'x'});self.assertEqual(status,400);self.assertEqual(self.state(),before)
  r=self.preview();body={'id':self.doc['id'],'confirmation':r['confirmation']};self.s.json(self.root+'/document-delete',body);after=self.state();status,_=self.s.request(self.root+'/document-delete',body);self.assertEqual(status,400);self.assertEqual(self.state(),after)

class RemovalConcurrencyTests(unittest.TestCase):
 def setUp(self):
  from qualicraft.server import create_server
  self.tmp=tempfile.TemporaryDirectory();self.server=create_server(self.tmp.name,Path(self.tmp.name)/'no-guide',port=0);self.p=bologna_example();self.server.store.create(self.p);self.thread=threading.Thread(target=self.server.serve_forever,daemon=True);self.thread.start();self.base='http://127.0.0.1:'+str(self.server.server_port)
  self.token=json.loads(urllib.request.urlopen(self.base+'/api/bootstrap').read())['token']
 def tearDown(self):self.server.shutdown();self.thread.join();self.server.server_close();self.tmp.cleanup()
 def post(self,body):
  req=urllib.request.Request(self.base+'/api/projects/'+self.p['id']+'/document-delete',data=json.dumps(body).encode(),headers={'X-QualiCraft-Token':self.token,'Content-Type':'application/json'})
  try:
   with urllib.request.urlopen(req) as r:return r.status,json.load(r)
  except urllib.error.HTTPError as e:return e.code,json.load(e)
 def test_running_analysis_blocks_removal_and_discards_no_preview(self):
  a=self.server.analyzer;id=self.p['documents'][0]['id'];a.jobs['test']={'project_id':self.p['id'],'document_id':id,'status':'running'};a.previews['preview']={'project_id':self.p['id'],'document_id':id};before=self.server.store.get(self.p['id']);body={'id':id,'confirmation':dm.removal_info(before,id)['confirmation']}
  status,data=self.post(body);self.assertEqual(status,400);self.assertIn('running',data['error']);self.assertEqual(self.server.store.get(self.p['id']),before);self.assertIn('preview',a.previews)
  a.jobs['test']['status']='cancelled';status,data=self.post(body);self.assertEqual(status,200);self.assertNotIn('preview',a.previews)
 def test_ai_preview_of_removed_source_cannot_start_a_job(self):
  a=self.server.analyzer;d=self.p['documents'][0];a.previews['stale']={'project_id':self.p['id'],'document_id':d['id'],'document_sha256':d['sha256']}
  self.server.store.change(self.p['id'],lambda p:dm.remove_document(p,{'id':d['id'],'confirmation':dm.removal_info(p,d['id'])['confirmation']}),preserve_before=True)
  with self.assertRaises(ValueError):a.start('stale')
  self.assertEqual(a.jobs,{})
 def test_commit_interruption_keeps_only_committed_recovery_content(self):
  store=self.server.store;pid=self.p['id'];before=store.get(pid);connect=store.connect
  body={'id':before['documents'][0]['id'],'confirmation':dm.removal_info(before,before['documents'][0]['id'])['confirmation']}
  with patch.object(store,'_queue_snapshot',side_effect=RuntimeError('Injected before commit')):
   with self.assertRaises(RuntimeError):store.change(pid,lambda p:dm.remove_document(p,body),preserve_before=True)
  self.assertEqual(store.get(pid),before)
  for row in store.backups(pid):self.assertEqual(json.loads((store.backup_dir/pid/row['name']).read_text(encoding='utf-8')),before)
  store.change(pid,lambda p:dm.remove_document(p,body),preserve_before=True);self.assertEqual(len(store.get(pid)['documents']),18)

if __name__=='__main__':unittest.main()
