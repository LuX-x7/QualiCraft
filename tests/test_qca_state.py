"""Public Bologna persistence, exact evidence, reports and independent exports."""
import copy,io,json,subprocess,sys,tempfile,unittest,zipfile
from pathlib import Path
from unittest.mock import patch
from qualicraft import core,qca,qca_state,reporting
from tests.test_transcript_export import example


def design(project):
    d=qca_state.blank();d['question']='Technical QCA software acceptance, not a new research claim';d['case_unit']='Explicit technical case IDs mapped to the public Bologna fixture'
    for node in d['conditions']+[d['outcome']]:node.update(label=node['id']+' technical set',definition='Explicit binary technical test condition',zero_rule='Researcher test designation absent',one_rule='Researcher test designation present',basis='Known-answer acceptance fixture only')
    doc=project['documents'][0]['id'];a=project['annotations'][0]['id']
    d['cases']=[{'id':'case'+str(i),'label':'Technical case '+str(i),'document_ids':[doc],'cells':{'A':{'value':i//2,'rationale':'Explicit technical fixture membership; not inferred from coding counts','evidence_ids':[a] if i==3 else []},'Y':{'value':i//2,'rationale':'Explicit outcome test designation','evidence_ids':[]}}} for i in range(4)]
    return d

class QCAStateTests(unittest.TestCase):
    def setUp(self):self.p=example();self.d=design(self.p)
    def save(self,**kw):
        body={'revision':self.p.get('comparative_qca',{}).get('revision',0),'source_version':qca_state.source_version(self.p),'design':self.d,'options':{}};body.update(kw);return qca_state.save(self.p,body)
    def execute(self,**kw):return qca_state.run(self.p,{'revision':self.p['comparative_qca']['revision'],'source_version':qca_state.source_version(self.p)},**kw)
    def test_partial_calibration_saves_but_missing_never_runs(self):
        self.d['cases'][0]['cells']['A']['value']=None;state=self.save();before=copy.deepcopy(self.p)
        self.assertIsNone(state['current'])
        with self.assertRaises(ValueError):self.execute()
        self.assertEqual(self.p,before)
    def test_frozen_run_keeps_source_mapping_rationales_and_json_restore(self):
        self.save();state=self.execute();run=state['current'];self.assertFalse(qca_state.is_stale(self.p));self.assertEqual(run['design'],self.d)
        self.assertEqual(run['bindings']['evidence'][self.p['annotations'][0]['id']]['quote'],self.p['annotations'][0]['quote'])
        restored=core.validate_project(json.loads(json.dumps(self.p)));restored['id']=core.uid();self.assertEqual(restored['comparative_qca'],state);self.assertFalse(qca_state.is_stale(restored));self.assertEqual(restored['schema_version'],5)
        self.assertIn('engine_sha256',run['environment'])
    def test_one_case_can_map_multiple_documents_without_becoming_multiple_cases(self):
        extra=core.add_document(self.p,'Bologna additional technical source.txt',self.p['documents'][0]['text'][:1000])
        self.d['cases'][0]['document_ids'].append(extra['id']);self.save();run=self.execute()['current']
        self.assertEqual(len(run['matrix']['cases']),4);self.assertEqual(len(run['bindings']['documents']),2)
    def test_calibration_edits_keep_old_result_and_failures_are_atomic(self):
        self.save();first=copy.deepcopy(self.execute()['current']);self.d['cases'][0]['cells']['A']['value']=1;self.save();self.assertTrue(qca_state.is_stale(self.p));self.assertEqual(self.p['comparative_qca']['current'],first);before=copy.deepcopy(self.p)
        with self.assertRaises(qca.ComplexityError):self.execute(budget=1)
        with self.assertRaises(InterruptedError):self.execute(cancel=lambda:True)
        self.assertEqual(self.p,before)
        second=self.execute();self.assertEqual(second['history'],[first]);self.assertFalse(qca_state.is_stale(self.p))
    def test_bad_evidence_and_wrong_case_source_are_rejected_without_changes(self):
        before=copy.deepcopy(self.p);self.d['cases'][0]['cells']['A']['evidence_ids']=['missing']
        with self.assertRaises(ValueError):self.save()
        self.assertEqual(self.p,before);self.d=design(self.p);self.d['cases'][3]['document_ids']=[]
        with self.assertRaises(ValueError):self.save()
        self.assertEqual(self.p,before)
    def test_prepared_guard_preserves_concurrent_reading_and_rejects_calibration_or_source_change(self):
        self.save();stamp=qca_state.source_version(self.p);revision=self.p['comparative_qca']['revision'];candidate=copy.deepcopy(self.p);state=qca_state.run(candidate,{'revision':revision,'source_version':stamp})
        self.p['documents'][0]['reading_state']['revision']+=1;qca_state.install_prepared(self.p,state,revision,stamp);self.assertEqual(self.p['documents'][0]['reading_state']['revision'],1)
        before=copy.deepcopy(self.p)
        with self.assertRaises(qca_state.QCAConflict):qca_state.install_prepared(self.p,state,revision,stamp)
        self.assertEqual(self.p,before)
        self.p['codes'][0]['name']+=' changed';before=copy.deepcopy(self.p)
        with self.assertRaises(qca_state.QCAConflict):qca_state.install_prepared(self.p,state,self.p['comparative_qca']['revision'],stamp)
        self.assertEqual(self.p,before)
    def test_restored_computed_values_and_recipes_cannot_be_silently_edited(self):
        self.save();self.execute();bad=copy.deepcopy(self.p);r=bad['comparative_qca']['current'];r['result']['truth_table'][0]['n']=999;r['content_hash']=qca_state.digest({k:v for k,v in r.items() if k!='content_hash'})
        with self.assertRaises(ValueError):core.validate_project(bad)
        bad=copy.deepcopy(self.p);bad['comparative_qca']['current']['engine_source']='raise RuntimeError("must never execute")'
        with self.assertRaises(ValueError):core.validate_project(bad)
    def test_history_capacity_and_project_snapshots(self):
        self.save()
        for _ in range(7):self.execute()
        state=self.p['comparative_qca'];self.assertEqual(len(state['history']),4);self.assertEqual(state['history'][0]['input_revision'],2)
        with tempfile.TemporaryDirectory() as folder:
            store=core.Store(Path(folder)/'project.sqlite3');store.create(self.p);restored=store.restore(self.p['id'],store.backups(self.p['id'])[0]['name']);self.assertEqual(restored['comparative_qca'],state)
        before=copy.deepcopy(self.p)
        with patch.object(qca_state,'validate_reading_capacity',side_effect=ValueError('capacity')):
            with self.assertRaises(ValueError):self.save()
        self.assertEqual(self.p,before)
    def test_exact_independent_export_and_csv_identity(self):
        self.save();run=self.execute()['current'];payload=qca_state.bundle_export(run)
        with tempfile.TemporaryDirectory() as folder:
            with zipfile.ZipFile(io.BytesIO(payload)) as z:z.extractall(folder)
            result=subprocess.run([sys.executable,str(Path(folder)/'reproduce.py')],capture_output=True,text=True,timeout=10)
            self.assertEqual(result.returncode,0,result.stderr);self.assertEqual(json.loads((Path(folder)/'reproduced-result.json').read_text(encoding='utf-8')),run['result'])
            self.assertIn('case3',(Path(folder)/'calibration.csv').read_text(encoding='utf-8-sig'))
            manifest=json.loads((Path(folder)/'MANIFEST.json').read_text(encoding='utf-8'))
            for name,sha in manifest.items():self.assertEqual(qca_state.hashlib.sha256((Path(folder)/name).read_bytes()).hexdigest(),sha)
    def test_report_freezes_qca_and_refresh_is_explicit(self):
        self.save();first=copy.deepcopy(self.execute()['current']);draft=reporting.blank(self.p,'comparative');draft['narrative']='Researcher technical interpretation [E:'+self.p['annotations'][0]['id']+']'
        def save_report(refresh=False):return reporting.save(self.p,{'revision':self.p.get('research_report',{}).get('revision',0),'source_version':reporting.source_version(self.p),'draft':draft,'refresh_evidence':refresh})
        state=save_report();self.assertEqual(state['current']['bindings']['qca'],first)
        self.d['cases'][0]['cells']['Y']['value']=1;self.save();second=self.execute()['current'];self.assertTrue(reporting.context(self.p)['stale'])
        frozen=save_report();self.assertEqual(frozen['current']['bindings']['qca'],first)
        refreshed=save_report(True);self.assertEqual(refreshed['current']['bindings']['qca'],second);self.assertFalse(reporting.context(self.p)['stale'])
        entry=refreshed['current'];html=reporting.html_export(entry).decode();self.assertIn('Configuration solutions',html);self.assertIn('Truth table',html);self.assertNotIn('Analysis Table — Themes',html)
        with zipfile.ZipFile(io.BytesIO(reporting.bundle_export(entry,{}))) as z:self.assertEqual(json.loads(z.read('qca/qca-run.json')),second);self.assertIn('qca/reproduce.py',z.namelist())
        with zipfile.ZipFile(io.BytesIO(reporting.docx_export(entry))) as z:self.assertIn(b'Configuration solutions',z.read('word/document.xml'));self.assertIn(b'Comparative',z.read('word/document.xml'))
    def test_report_preparation_rejects_concurrent_qca_calibration(self):
        self.save();self.execute();draft=reporting.blank(self.p,'comparative');candidate=copy.deepcopy(self.p);state=reporting.save(candidate,{'revision':0,'source_version':reporting.source_version(candidate),'draft':draft});stamp=reporting.digest(self.p['comparative_qca'])
        self.d['cases'][0]['cells']['A']['rationale']='Revised calibration reason';self.save();before=copy.deepcopy(self.p)
        with self.assertRaises(reporting.ReportConflict):reporting.install_prepared(self.p,state,0,reporting.source_version(self.p),stamp)
        self.assertEqual(self.p,before)
    def test_comparative_report_without_current_calibrated_run_is_rejected_atomically(self):
        draft=reporting.blank(self.p,'comparative');before=copy.deepcopy(self.p)
        with self.assertRaises(ValueError):reporting.save(self.p,{'revision':0,'source_version':reporting.source_version(self.p),'draft':draft})
        self.assertEqual(self.p,before)
    def test_comparative_report_keeps_existing_descriptive_figures_and_their_recipes(self):
        from xml.etree import ElementTree as ET
        from qualicraft import transcript,report_figures
        self.save();self.execute();draft=reporting.blank(self.p,'comparative');draft['narrative']='Figures'
        draft['figures']=[{'id':'f1','caption':'Existing descriptive coding counts, separate from calibrated cases','options':{'kind':'frequency','top':3}}]
        state=reporting.save(self.p,{'revision':0,'source_version':reporting.source_version(self.p),'draft':draft});entry=state['current'];asset=state['assets'][entry['bindings']['figures']['f1']['asset_id']]
        with zipfile.ZipFile(io.BytesIO(reporting.docx_export(entry,assets=state['assets']))) as z:
            root=ET.fromstring(z.read('word/document.xml'));W='{'+transcript.W+'}';paras=root.findall('./'+W+'body/'+W+'p')
            self.assertEqual(sum(transcript.word_plain(p)=='Research design' for p in paras),1)
            self.assertEqual(sum(transcript.word_plain(p)=='Figures' for p in paras),2)
            self.assertEqual(json.loads(ET.fromstring(z.read('customXml/item1.xml')).text),entry)
            self.assertEqual([z.read(n) for n in z.namelist() if n.startswith('word/media/')],[report_figures.files(asset)[asset['options']['name']+'.png']])
        with zipfile.ZipFile(io.BytesIO(reporting.bundle_export(entry,state['assets']))) as z:
            self.assertIn('qca/reproduce.py',z.namelist());self.assertIn('figures/f1/figure.py',z.namelist())
    def test_many_case_calibration_evidence_is_not_limited_by_the_TA_row_picker(self):
        source=self.p['documents'][0];template=self.p['annotations'][0];extra=[]
        for i in range(201):
            extra.append({**template,'id':'technicalEvidence'+str(i),'start':i,'end':i+1,'quote':source['text'][i:i+1]})
        self.p['annotations'].extend(extra)
        self.d['cases']=[copy.deepcopy(self.d['cases'][i%4]) for i in range(6)]
        for i,c in enumerate(self.d['cases']):
            c['id']='technicalCase'+str(i);c['label']='Technical evidence capacity '+str(i)
            for j,cell in enumerate(c['cells'].values()):cell['evidence_ids']=[a['id'] for a in extra[(i*2+j)*20:(i*2+j+1)*20]]
        self.save();self.execute();draft=reporting.blank(self.p,'comparative')
        entry=reporting.save(self.p,{'revision':0,'source_version':reporting.source_version(self.p),'draft':draft})['current']
        self.assertEqual(len(entry['bindings']['evidence']),201);reporting.validate_entry(entry)

if __name__=='__main__':unittest.main()
