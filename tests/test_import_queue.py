"""UX55-03: read-only preparation for resumable public Bologna file queues."""
import base64,concurrent.futures,contextlib,copy,hashlib,io,json,sqlite3,tempfile,unittest,zipfile
from pathlib import Path
from xml.sax.saxutils import escape
from qualicraft.server import bologna_example
from tools.e2e.recovery_boundaries import Service,backup_manifest

class ImportQueueTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.p=bologna_example();self.s=Service(Path(self.tmp.name),self.p);self.root='/projects/'+self.p['id'];self.d=self.p['documents'][0]
    def tearDown(self):self.s.stop();self.tmp.cleanup()
    def state(self):
        with contextlib.closing(sqlite3.connect(self.s.folder/'qualicraft.sqlite3')) as db:return (db.execute('SELECT data FROM projects').fetchall(),db.execute('SELECT * FROM snapshot_sequences').fetchall(),db.execute('SELECT * FROM snapshot_outbox').fetchall(),backup_manifest(self.s.folder,self.p['id']))
    def test_prepare_valid_file_returns_fingerprint_without_writes(self):
        before=self.state();r=self.s.json(self.root+'/document-check',{'name':self.d['name'],'text':self.d['text']})
        self.assertTrue(r['valid']);self.assertEqual(r['sha256'],self.d['sha256']);self.assertEqual(r['characters'],len(self.d['text']));self.assertNotIn('text',r);self.assertEqual(self.state(),before)
    def test_prepare_failure_has_a_per_file_reason_without_writes(self):
        before=self.state()
        for body in [{'name':'Bologna','text':' '},{'name':'Bologna','docx_base64':base64.b64encode(b'not a Word file').decode()}]:
            r=self.s.json(self.root+'/document-check',body);self.assertFalse(r['valid']);self.assertTrue(r['error']);self.assertEqual(self.state(),before)
    def test_reselected_changed_source_cannot_use_a_saved_fingerprint(self):
        before=self.state();body={'name':'Bologna queue copy','text':self.d['text'],'expected_sha256':self.p['documents'][1]['sha256'],'request_id':'bologna-changed-selection'}
        status,payload=self.s.request(self.root+'/documents',body);self.assertEqual(status,400);self.assertIn('changed',json.loads(payload)['error']);self.assertEqual(self.state(),before)
    def test_docx_and_text_preparation_have_identical_source_identity(self):
        stream=io.BytesIO()
        with zipfile.ZipFile(stream,'w') as z:z.writestr('word/document.xml','<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>'+escape(self.d['text'])+'</w:t></w:r></w:p></w:body></w:document>')
        r=self.s.json(self.root+'/document-check',{'name':self.d['name'],'docx_base64':base64.b64encode(stream.getvalue()).decode()});self.assertTrue(r['valid']);self.assertEqual(r['sha256'],self.d['sha256'])
    def test_queue_retries_and_duplicate_decisions_preserve_frozen_state(self):
        p=self.s.json(self.root);body={'name':'Bologna queue repeat','text':self.d['text'],'request_id':'queue-file-001','expected_sha256':self.d['sha256']};a=self.s.json(self.root+'/documents',body);before=self.state()
        self.assertEqual(self.s.json(self.root+'/documents',body)['id'],a['id']);self.assertEqual(self.state(),before)
        body['request_id']='queue-file-002';r=self.s.json(self.root+'/documents',body);self.assertTrue(r['requires_confirmation']);self.assertEqual(self.state(),before)
        b=self.s.json(self.root+'/documents',{**body,'duplicate_confirmation':r['duplicate']['confirmation']});after=self.s.json(self.root)
        self.assertNotEqual(a['id'],b['id']);self.assertEqual(len(after['documents']),21)
        for k in ['codes','annotations','comparative_qca','research_report']:
            self.assertEqual(after.get(k),p.get(k))
    def test_prefixed_workbench_loads_the_actual_queue_script(self):
        import urllib.request
        with urllib.request.urlopen(self.s.base+'/w') as r:html=r.read().decode()
        self.assertIn('src="/w/import-queue.js"',html)
        with urllib.request.urlopen(self.s.base+'/w/import-queue.js') as r:
            self.assertIn('javascript',r.headers['Content-Type']);self.assertEqual(r.read(),Path('web/import-queue.js').read_bytes())

    def test_capacity_failure_is_atomic_and_prior_queue_items_remain(self):
        p=copy.deepcopy(self.p)
        while len(p['documents'])<100:
            d=copy.deepcopy(self.d);d['id']=str(len(p['documents'])).zfill(32);d['name']='Bologna capacity '+str(len(p['documents']));p['documents'].append(d)
        p=self.s.json('/projects',{'kind':'restore','project':p});root='/projects/'+p['id'];before=self.s.json(root);backups=backup_manifest(self.s.folder,p['id'])
        status,_=self.s.request(root+'/documents',{'name':'Bologna item 101','text':self.d['text'],'expected_sha256':self.d['sha256'],'request_id':'capacity-101'})
        self.assertEqual(status,400);self.assertEqual(self.s.json(root),before);self.assertEqual(backup_manifest(self.s.folder,p['id']),backups)

if __name__=='__main__':unittest.main()
