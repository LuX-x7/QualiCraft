"""UX55-01: importing a second public Bologna copy needs an explicit decision."""
import concurrent.futures, contextlib, copy, json, sqlite3, tempfile, unittest
from pathlib import Path
from tools.e2e.recovery_boundaries import Service, backup_manifest
from qualicraft.server import bologna_example


class DuplicateImportTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.p=bologna_example()
        self.s=Service(Path(self.tmp.name),self.p);self.root='/projects/'+self.p['id'];self.doc=self.p['documents'][0]
        self.body={'name':self.doc['name'],'text':self.doc['text'],'request_id':'bologna-import-request-001'}
    def tearDown(self):self.s.stop();self.tmp.cleanup()
    def send(self,body=None):return self.s.json(self.root+'/documents',body or self.body)
    def state(self):
        with contextlib.closing(sqlite3.connect(self.s.folder/'qualicraft.sqlite3')) as db:
            return (db.execute('SELECT data FROM projects ORDER BY id').fetchall(),db.execute('SELECT * FROM snapshot_sequences').fetchall(),db.execute('SELECT * FROM snapshot_outbox').fetchall(),backup_manifest(self.s.folder,self.p['id']))
    def challenge(self,body=None):
        r=self.send(body);self.assertTrue(r.get('requires_confirmation'),r.keys());return r['duplicate']['confirmation']
    def test_warning_and_cancel_do_not_change_any_persisted_state(self):
        before=self.state();r=self.send();self.assertTrue(r.get('requires_confirmation'))
        self.assertEqual(r['duplicate']['document_ids'],[self.doc['id']]);self.assertEqual(self.state(),before)
    def test_keep_creates_a_separate_document_and_retry_is_idempotent(self):
        token=self.challenge();before=self.s.json(self.root);b={**self.body,'duplicate_confirmation':token};r=self.send(b)
        self.assertNotEqual(r['id'],self.doc['id']);self.assertEqual(r['text'],self.doc['text']);saved=self.state()
        self.assertEqual(self.send(b)['id'],r['id']);self.assertEqual(self.state(),saved)
        after=self.s.json(self.root);self.assertEqual(after['documents'][:-1],before['documents']);self.assertEqual(after['annotations'],before['annotations'])
        self.assertEqual(len(after['audit']),len(before['audit'])+1);self.assertEqual(after['audit'][-1]['action'],'document_import')
    def test_cannot_bypass_with_a_boolean_or_stale_confirmation(self):
        token=self.challenge();before=self.state();self.assertTrue(self.send({**self.body,'duplicate_confirmation':True})['requires_confirmation']);self.assertEqual(self.state(),before)
        self.send({**self.body,'duplicate_confirmation':token});saved=self.state()
        r=self.send({**self.body,'request_id':'bologna-import-request-002','duplicate_confirmation':token});self.assertTrue(r['requires_confirmation']);self.assertEqual(self.state(),saved)
    def test_same_name_different_content_and_other_name_same_content_import_normally(self):
        source=self.p['documents'][1]['text']
        a=self.send({**self.body,'text':source});b=self.send({**self.body,'name':'Another Bologna copy','request_id':'another-public-copy'})
        self.assertIn('id',a);self.assertIn('id',b);self.assertNotEqual(a['id'],b['id'])
    def test_concurrent_first_imports_create_one_copy_and_one_challenge(self):
        b={**self.body,'name':'Bologna concurrent copy'}
        with concurrent.futures.ThreadPoolExecutor(2) as pool:r=list(pool.map(lambda i:self.send({**b,'request_id':'concurrent-copy-'+str(i)}),range(2)))
        self.assertEqual(sum('id'in x for x in r),1);self.assertEqual(sum(bool(x.get('requires_confirmation')) for x in r),1)
    def test_concurrent_confirmed_retry_creates_one_copy(self):
        token=self.challenge();b={**self.body,'duplicate_confirmation':token}
        with concurrent.futures.ThreadPoolExecutor(2) as pool:r=list(pool.map(lambda _:self.send(b),range(2)))
        self.assertEqual(r[0]['id'],r[1]['id']);self.assertEqual(len(self.s.json(self.root)['documents']),20)
    def test_request_id_cannot_be_reused_for_changed_text(self):
        b={**self.body,'name':'Bologna retry safety'};self.send(b);before=self.state()
        status,_=self.s.request(self.root+'/documents',{**b,'text':self.p['documents'][1]['text']});self.assertEqual(status,400);self.assertEqual(self.state(),before)
    def test_docx_and_pasted_text_share_the_same_confirmation(self):
        import base64,io,zipfile
        from xml.sax.saxutils import escape
        # Use public Bologna source unchanged, as a single Word paragraph.
        out=io.BytesIO()
        with zipfile.ZipFile(out,'w') as z:z.writestr('word/document.xml','<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>'+escape(self.doc['text'])+'</w:t></w:r></w:p></w:body></w:document>')
        b={'name':self.doc['name'],'docx_base64':base64.b64encode(out.getvalue()).decode()};before=self.state();self.challenge(b);self.assertEqual(self.state(),before)
    def test_trimmed_names_warn_but_case_and_line_breaks_are_preserved(self):
        self.challenge({**self.body,'name':'  '+self.doc['name']+'  '})
        self.assertIn('id',self.send({**self.body,'name':self.doc['name'].upper()}))
        self.assertIn('id',self.send({**self.body,'text':self.doc['text'].replace('\n','\r\n'),'request_id':'line-break-copy'}))
    def interrupt_import(self,mode):
        token=self.challenge();before=self.state();body={**self.body,'duplicate_confirmation':token};self.s.stop();self.s=Service(Path(self.tmp.name),mode=mode,action='documents')
        with concurrent.futures.ThreadPoolExecutor(1) as pool:
            future=pool.submit(self.s.request,self.root+'/documents',body);self.s.wait('paused.json');self.s.stop(kill=True)
            try:future.result()
            except Exception:pass  # The deliberately killed server cannot return a receipt.
        self.s=Service(Path(self.tmp.name))
        return before,body
    def test_interruption_before_commit_preserves_original_state_and_recovery_points(self):
        before,body=self.interrupt_import('after-queue');self.assertEqual(self.state(),before)
        r=self.send(body);self.assertIn('id',r);self.assertEqual(len(self.s.json(self.root)['documents']),20)
    def test_lost_receipt_after_commit_retries_without_another_copy_or_snapshot(self):
        before,body=self.interrupt_import('committed-no-ack');saved=self.state();self.assertNotEqual(saved,before)
        r=self.send(body);self.assertEqual(len(self.s.json(self.root)['documents']),20);self.assertEqual(self.state(),saved)
        self.assertNotEqual(r['id'],self.doc['id'])

    def test_cancel_then_new_request_still_warns(self):
        self.challenge();before=self.state();self.challenge({**self.body,'request_id':'new-attempt'});self.assertEqual(self.state(),before)

if __name__=='__main__':unittest.main()
