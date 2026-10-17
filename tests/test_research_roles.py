"""Explicit codebook research roles; public Bologna fixtures only."""
import copy
import hashlib
import io
import json
import unittest
import zipfile
from xml.etree import ElementTree as ET
from qualicraft import core, analyze, transcript, reporting
from tests.test_transcript_export import example


class ResearchRoleTests(unittest.TestCase):
    def setUp(self):
        self.p=example();self.a=self.p['annotations'][0]
        self.code=next(c for c in self.p['codes'] if c['id']==self.a['code_id'])
    def test_roles_are_explicit_optional_editable_and_json_restorable(self):
        self.assertTrue(all('research_role' not in c for c in self.p['codes']))
        c=core.add_code(self.p,'Bologna role check',research_role='category')
        self.assertEqual(c['research_role'],'category')
        core.update_code(self.p,c['id'],{'research_role':'theme'})
        restored=core.migrate(json.loads(json.dumps(self.p)))
        core.validate_project(restored)
        self.assertEqual(next(x for x in restored['codes'] if x['id']==c['id'])['research_role'],'theme')
        self.assertEqual(restored['schema_version'],5)
        core.update_code(self.p,c['id'],{'research_role':None})
        self.assertNotIn('research_role',c)
        self.assertEqual(self.p['audit'][-1]['research_role_before'],'theme')
        self.assertIsNone(self.p['audit'][-1]['research_role_after'])
    def test_invalid_create_and_update_roles_do_not_mutate_the_project(self):
        for invalid in ['Theme','other','',[],{},0,False]:
            before=copy.deepcopy(self.p)
            with self.assertRaises(ValueError):core.add_code(self.p,'Bologna rejected role',research_role=invalid)
            self.assertEqual(self.p,before)
            with self.assertRaises(ValueError):core.update_code(self.p,self.code['id'],{'name':'Bologna must not rename','research_role':invalid})
            self.assertEqual(self.p,before)
    def test_restore_rejects_invalid_role_without_reclassifying_legacy_nodes(self):
        self.code['research_role']='automatic'
        with self.assertRaises(ValueError):core.validate_project(self.p)
        self.code.pop('research_role');core.validate_project(self.p)
        self.assertTrue(all('research_role' not in c for c in self.p['codes']))
    def test_saved_roles_override_export_preset_and_preserve_real_ancestry(self):
        plain=transcript.freeze(self.p,[self.a['document_id']])
        path=next(a for a in plain['documents'][0]['annotations'] if a['id']==self.a['id'])['path']
        roles=['code','theme','category']
        for i,n in enumerate(path):core.update_code(self.p,n['id'],{'research_role':roles[i%3]})
        for preset in ['saved','theme-category-code']:
            data=transcript.freeze(self.p,[self.a['document_id']],role_labels=preset)
            item=next(a for a in data['documents'][0]['annotations'] if a['id']==self.a['id'])
            self.assertEqual([n['id'] for n in item['path']],[n['id'] for n in path])
            self.assertEqual([n['role'] for n in item['path']],[roles[i%3].title() for i in range(len(path))])
            self.assertEqual(item['quote'],self.a['quote'])
            self.assertEqual(''.join(t['text'] for b in data['documents'][0]['blocks'] for t in b['tokens']),plain['documents'][0]['text'])
            with zipfile.ZipFile(io.BytesIO(transcript.docx_export(data))) as z:
                self.assertEqual(json.loads(ET.fromstring(z.read('customXml/item1.xml')).text),data)
            self.assertIn('Saved researcher roles',transcript.html_export(data).decode())
    def test_roles_leave_all_existing_analysis_results_unchanged(self):
        def outputs():
            rows=analyze.tidy(self.p)
            return [rows,analyze.frequency(rows),analyze.frequency(rows,'theme'),analyze.coverage(rows),analyze.cooccurrence(rows),analyze.cooccurrence(rows,'unit',{d['id']:d['text'] for d in self.p['documents']}),analyze.accumulation(rows),analyze.hierarchy(rows),analyze.network(rows),analyze.summary(self.p)]
        before=outputs()
        for i,c in enumerate(self.p['codes']):c['research_role']=['theme','category','code'][i%3]
        self.assertEqual(outputs(),before)
    def test_legacy_report_fingerprint_stays_identical_and_role_changes_flag_stale(self):
        old=reporting.digest({'documents':[{k:d[k] for k in ('id','name','text')} for d in self.p['documents']], 'codes':[{k:c.get(k) for k in ('id','name','parent_id','definition','memo','inclusion','exclusion','status')} for c in self.p['codes']], 'annotations':self.p['annotations']})
        self.assertEqual(reporting.source_version(self.p),old)
        draft=reporting.blank(self.p,'content');state=reporting.save(self.p,{'revision':0,'source_version':old,'draft':draft});frozen=copy.deepcopy(state)
        core.update_code(self.p,self.code['id'],{'research_role':'code'})
        self.assertTrue(reporting.context(self.p)['stale']);self.assertEqual(state,frozen)
        core.update_code(self.p,self.code['id'],{'research_role':None})
        self.assertEqual(reporting.source_version(self.p),old)
        self.assertFalse(reporting.context(self.p)['stale'])

class ResearchRoleHTTPTests(unittest.TestCase):
    def test_role_write_recovery_and_atomic_http_rejection(self):
        import tempfile,threading,urllib.request,urllib.error
        from qualicraft.server import create_server
        with tempfile.TemporaryDirectory() as temp:
            server=create_server(temp,temp,port=0);thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
            try:
                base=f'http://127.0.0.1:{server.server_port}';token=json.load(urllib.request.urlopen(base+'/api/bootstrap'))['token']
                def get(path):return json.load(urllib.request.urlopen(urllib.request.Request(base+path,headers={'X-QualiCraft-Token':token})))
                def post(path,data):
                    req=urllib.request.Request(base+path,data=json.dumps(data).encode(),headers={'Content-Type':'application/json','X-QualiCraft-Token':token})
                    return json.load(urllib.request.urlopen(req))
                p=post('/api/projects',{'kind':'restore','project':example()});root='/api/projects/'+p['id'];id=p['codes'][0]['id']
                before=get(root);snapshots=get(root+'/backups')['items']
                for changes in [{'name':'must not rename','research_role':'bad'},{'research_role':[]},{'research_role':False}]:
                    with self.assertRaises(urllib.error.HTTPError) as error:post(root+'/code-update',{'id':id,'changes':changes})
                    self.assertEqual(error.exception.code,400);self.assertEqual(get(root),before);self.assertEqual(get(root+'/backups')['items'],snapshots)
                c=post(root+'/codes',{'name':'Bologna saved role','research_role':'category'})
                self.assertEqual(c['research_role'],'category')
                post(root+'/code-update',{'id':id,'changes':{'research_role':'theme'}})
                saved=get(root);self.assertEqual(saved['codes'][0]['research_role'],'theme')
                self.assertEqual(saved['audit'][-1]['research_role_after'],'theme')
                latest=get(root+'/backups')['items'][0]['name']
                snapshot=post(root+'/restore-snapshot',{'name':latest})
                self.assertEqual(snapshot['codes'],saved['codes']);self.assertEqual(get(root),saved)
                exported=get(root+'/export?format=json')
                restored=post('/api/projects',{'kind':'restore','project':exported})
                self.assertEqual(restored['codes'],saved['codes'])
                bad=copy.deepcopy(exported);bad['codes'][0]['research_role']=None
                with self.assertRaises(urllib.error.HTTPError) as error:post('/api/projects',{'kind':'restore','project':bad})
                self.assertEqual(error.exception.code,400);self.assertEqual(get(root),saved)
                post(root+'/code-update',{'id':id,'changes':{'research_role':None}})
                self.assertNotIn('research_role',get(root)['codes'][0])
            finally:server.shutdown();server.server_close();thread.join()
