"""Saved report state and frozen evidence contracts; only bundled Bologna."""
import copy
import io
import json
import tempfile
import unittest
import zipfile
import threading
import urllib.request
import urllib.error
from pathlib import Path
from xml.etree import ElementTree as ET
from qualicraft import core, reporting
from tests.test_transcript_export import example
from qualicraft.server import create_server


class ReportTests(unittest.TestCase):
    def setUp(self):
        self.p=example();self.a=self.p['annotations'][0]
        self.d=reporting.blank(self.p,'content');self.d['research_question']='How is data described in this Bologna example?'
        self.d['rows']=[{'id':core.uid(),'theme':'Researcher label','category':'Example category','code_ids':[self.a['code_id']],'evidence_ids':[self.a['id']],'interpretation':'Bologna evidence review'}]
        self.d['narrative']='Test narrative [E:'+self.a['id']+']'
    def save(self,**kw):
        body={'revision':self.p.get('research_report',{}).get('revision',0),'source_version':reporting.source_version(self.p),'draft':self.d};body.update(kw)
        return reporting.save(self.p,body)
    def test_save_is_explicit_source_bound_and_never_infers_narrative(self):
        before=copy.deepcopy(self.p);state=self.save()
        self.assertEqual(self.p['documents'],before['documents']);self.assertEqual(self.p['codes'],before['codes']);self.assertEqual(self.p['annotations'],before['annotations'])
        self.assertEqual(state['current']['draft'],self.d);self.assertEqual(state['current']['bindings']['evidence'][self.a['id']]['quote'],self.a['quote'])
        self.assertEqual(len(self.p['audit']),len(before['audit'])+1)
    def test_conflicts_and_bad_references_leave_everything_unchanged(self):
        self.save();before=copy.deepcopy(self.p)
        with self.assertRaises(reporting.ReportConflict):self.save(revision=0)
        self.assertEqual(self.p,before)
        self.d['rows'][0]['evidence_ids']=['missing']
        with self.assertRaises(ValueError):self.save()
        self.assertEqual(self.p,before)
    def test_narrative_cannot_cite_unselected_or_fabricated_evidence(self):
        self.d['narrative']='[E:missing]'
        with self.assertRaises(ValueError):self.save()
        self.assertNotIn('research_report',self.p)
        self.d['narrative']='';self.d['rows'][0]['code_ids']=[next(c['id'] for c in self.p['codes'] if c['id']!=self.a['code_id'])]
        with self.assertRaises(ValueError):self.save()
    def test_stale_writing_keeps_frozen_quotes_until_explicit_refresh(self):
        old=self.save()['current'];self.p['codes'][0]['name']+=' revised'
        self.d['narrative']+=' Further researcher writing.'
        current=self.save()['current']
        self.assertEqual(current['source_version'],old['source_version']);self.assertEqual(current['bindings'],old['bindings']);self.assertTrue(reporting.context(self.p)['stale'])
        self.save(refresh_evidence=True);self.assertFalse(reporting.context(self.p)['stale'])
    def test_fresh_source_guard_rejects_concurrent_coding_change(self):
        stamp=reporting.source_version(self.p);self.p['codes'][0]['name']+=' revised'
        with self.assertRaises(reporting.ReportConflict):self.save(source_version=stamp)
    def test_old_versions_restore_as_new_versions_and_compare_without_loss(self):
        first=self.save()['current'];self.d['narrative']='Revised';second=self.save()['current']
        state=reporting.save(self.p,{'revision':2,'version_id':first['id']},restore=True)
        self.assertEqual(state['current']['draft'],first['draft']);self.assertEqual(state['current']['restored_from'],first['id']);self.assertNotEqual(state['current']['id'],first['id'])
        self.assertEqual(state['history'][-1],second);self.assertEqual(reporting.selected(self.p,second['id'])[0],second)
    def test_json_roundtrip_and_snapshot_recovery_keep_reports(self):
        with tempfile.TemporaryDirectory() as folder:
            store=core.Store(Path(folder)/'p.sqlite3');store.create(self.p)
            store.change(self.p['id'],lambda p:reporting.save(p,{'revision':0,'source_version':reporting.source_version(p),'draft':self.d}))
            saved=store.get(self.p['id']);restored=core.validate_project(json.loads(json.dumps(saved)))
            restored['id']=core.uid();self.assertFalse(reporting.context(restored)['stale'])
            copy_=store.restore(saved['id'],store.backups(saved['id'])[0]['name']);self.assertEqual(copy_['research_report'],saved['research_report'])
            corrupt=copy.deepcopy(saved);corrupt['research_report']['current']['draft']['narrative']='changed outside saved version'
            with self.assertRaises(ValueError):core.validate_project(corrupt)
    def test_reading_and_report_edits_do_not_make_coding_evidence_stale(self):
        self.save();stamp=reporting.source_version(self.p);self.p['documents'][0]['reading_state']['revision']+=1;self.d['limitations']='Demo only';self.save()
        self.assertEqual(reporting.source_version(self.p),stamp)
    def test_history_limit_preserves_first_and_recent_versions(self):
        first=self.save()['current']
        for i in range(14):self.d['narrative']=str(i);self.save()
        state=self.p['research_report'];self.assertEqual(len(state['history']),10);self.assertEqual(state['history'][0],first);reporting.validate_state(state)
    def test_html_and_editable_word_share_report_and_frozen_quotes(self):
        self.d['title']='<script>window.BAD=1</script>'
        entry=self.save()['current'];html=reporting.html_export(entry).decode()
        self.assertIn('&lt;script&gt;',html);self.assertNotIn('<script>',html);self.assertIn('Narrative Analysis',html)
        self.assertIn('Test narrative [E1]',html)
        with zipfile.ZipFile(io.BytesIO(reporting.docx_export(entry))) as z:
            tree=ET.fromstring(z.read('word/document.xml'));plain=''.join(tree.itertext());self.assertIn(self.a['quote'],plain)
            self.assertEqual(json.loads(ET.fromstring(z.read('customXml/item1.xml')).text),entry)
            self.assertNotIn(b'<w:drawing',z.read('word/document.xml'))

    def test_word_hierarchy_effectively_changes_sizes_and_separates_verbatim_evidence(self):
        entry=self.save()['current'];ns={'w':reporting.transcript.W};W='{'+reporting.transcript.W+'}'
        with zipfile.ZipFile(io.BytesIO(reporting.docx_export(entry))) as z:
            styles=ET.fromstring(z.read('word/styles.xml'));doc=ET.fromstring(z.read('word/document.xml'))
            def size(name):
                s=styles.find("w:style[@w:styleId='"+name+"']/w:rPr/w:sz",ns)
                return int(s.get(W+'val'))
            self.assertGreater(size('Title'),size('Heading1'));self.assertGreater(size('Heading1'),size('Heading2'));self.assertGreater(size('Heading2'),size('Normal'))
            h1=[p for p in doc.findall('.//w:p',ns) if p.find("w:pPr/w:pStyle[@w:val='Heading1']",ns) is not None]
            self.assertTrue(h1)
            for p in h1:self.assertFalse(p.findall('w:r/w:rPr/w:sz',ns),'A direct run size must not flatten a semantic heading')
            quotes=[p for p in doc.findall('.//w:p',ns) if p.find("w:pPr/w:pStyle[@w:val='EvidenceQuote']",ns) is not None]
            self.assertEqual([reporting.transcript.word_plain(p) for p in quotes],[self.a['quote']])
            quote_style=styles.find("w:style[@w:styleId='EvidenceQuote']/w:rPr",ns);self.assertIsNotNone(quote_style.find('w:i',ns))
            self.assertNotIn(self.d['narrative'],[reporting.transcript.word_plain(p) for p in quotes])
    def test_reading_capacity_failure_is_atomic(self):
        before=copy.deepcopy(self.p)
        from unittest.mock import patch
        with patch.object(reporting,'validate_reading_capacity',side_effect=ValueError('capacity')):
            with self.assertRaises(ValueError):self.save()
        self.assertEqual(self.p,before)

    def test_unrepresentable_word_text_is_rejected_before_saving(self):
        for bad in ['\0','\ud800','\ufffe']:
            self.d['narrative']=bad
            with self.assertRaises(ValueError):self.save()
            self.assertNotIn('research_report',self.p)


class ReportHTTPTests(unittest.TestCase):
    def test_auth_conflicts_downloads_and_no_side_effects_on_rejection(self):
        with tempfile.TemporaryDirectory() as folder:
            server=create_server(folder,folder,port=0);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
            base=f'http://127.0.0.1:{server.server_port}';token=json.load(urllib.request.urlopen(base+'/api/bootstrap'))['token']
            p=example();store=core.Store(Path(folder)/'qualicraft.sqlite3');store.create(p);root=base+'/api/projects/'+p['id']
            def request(path,body=None,auth=True):
                return urllib.request.urlopen(urllib.request.Request(root+path,data=json.dumps(body).encode() if body is not None else None,headers={'X-QualiCraft-Token':token if auth else '', 'Content-Type':'application/json'}))
            try:
                with self.assertRaises(urllib.error.HTTPError):request('/report',auth=False)
                c=json.load(request('/report'));d=reporting.blank(p,'content')
                state=json.load(request('/report-save',{'revision':0,'source_version':c['source_version'],'draft':d}));self.assertEqual(state['revision'],1)
                before=store.get(p['id']);backups=store.backups(p['id'])
                for payload,status in [({'revision':0,'draft':d},409),({'revision':1,'draft':{**d,'method':'comparative'}},400)]:
                    with self.assertRaises(urllib.error.HTTPError) as caught:request('/report-save',payload)
                    self.assertEqual(caught.exception.code,status)
                    self.assertEqual(store.get(p['id']),before);self.assertEqual(store.backups(p['id']),backups)
                for fmt in ['report-html','report-docx','report-json']:
                    with request('/export?format='+fmt) as response:self.assertEqual(response.status,200);self.assertIn('attachment',response.headers['Content-Disposition']);self.assertTrue(response.read())
                self.assertEqual(store.get(p['id']),before);self.assertEqual(store.backups(p['id']),backups)
            finally:server.shutdown();server.server_close();thread.join()

    def test_readonly_server_refuses_report_save_and_restore_without_mutation(self):
        with tempfile.TemporaryDirectory() as folder:
            p=example();draft=reporting.blank(p,'content')
            reporting.save(p,{'revision':0,'source_version':reporting.source_version(p),'draft':draft})
            store=core.Store(Path(folder)/'qualicraft.sqlite3');store.create(p)
            server=create_server(folder,folder,port=0,public_demo=True)
            thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
            root=f'http://127.0.0.1:{server.server_port}/api/projects/'+p['id']
            before=store.get(p['id']);backups=store.backups(p['id'])
            try:
                for path in ['/report-save','/report-restore']:
                    request=urllib.request.Request(root+path,data=b'{}',headers={'Content-Type':'application/json'})
                    with self.assertRaises(urllib.error.HTTPError) as caught:urllib.request.urlopen(request)
                    self.assertEqual(caught.exception.code,403)
                self.assertEqual(store.get(p['id']),before);self.assertEqual(store.backups(p['id']),backups)
            finally:server.shutdown();server.server_close();thread.join()


if __name__=='__main__':unittest.main()
