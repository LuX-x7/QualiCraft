"""UX55-04 saved method maps, legacy compatibility and unchanged Bologna evidence."""
import copy, io, json, tempfile, unittest, zipfile
from pathlib import Path
from unittest.mock import patch
from xml.etree import ElementTree as ET
from qualicraft import core, reporting, qca_state
from tests.test_transcript_export import example
from tests.test_qca_state import design

class ReportMethodTests(unittest.TestCase):
    def setUp(self):
        self.p=example()
        qca_state.save(self.p,{'revision':0,'source_version':qca_state.source_version(self.p),'design':design(self.p),'options':{}})
        qca_state.run(self.p,{'revision':1,'source_version':qca_state.source_version(self.p)})
    def save(self,method='content'):
        d=reporting.blank(self.p,method);d['narrative']='Researcher writing remains intact.'
        return reporting.save(self.p,{'revision':self.p.get('research_report',{}).get('revision',0),'source_version':reporting.source_version(self.p),'draft':d})['current']
    def test_empty_notes_always_show_full_method_and_decisions(self):
        for method,name in [('ta','Thematic Analysis'),('content','Qualitative Content Analysis'),('comparative','Qualitative Comparative Analysis')]:
            with self.subTest(method=method):
                entry=self.save(method);html=reporting.html_export(entry).decode()
                self.assertIn('Method and decisions',html);self.assertIn('Method used',html);self.assertIn(name,html)
                self.assertIn('Not documented yet.',html);self.assertIn('Method map M1',html)
    def test_map_saved_with_hash_and_does_not_mutate_evidence_or_qca(self):
        before=copy.deepcopy(self.p);entry=self.save()
        self.assertEqual(entry['method_map']['method'],'content');self.assertEqual(entry['method_map']['version'],1)
        for k in ['documents','codes','annotations','comparative_qca']:self.assertEqual(self.p[k],before[k])
        broken=copy.deepcopy(entry);broken['method_map']['steps'][0]['title']='Changed'
        with self.assertRaises(ValueError):reporting.validate_entry(broken)
    def test_html_word_and_zip_have_editable_native_map_and_same_saved_entry(self):
        for method in ['ta','content','comparative']:
            entry=self.save(method)
            with zipfile.ZipFile(io.BytesIO(reporting.bundle_export(entry,{}))) as z:
                self.assertEqual(json.loads(z.read('report.json')),entry)
                self.assertIn(b'Method map M1',z.read('report.html'))
                with zipfile.ZipFile(io.BytesIO(z.read('report.docx'))) as word:
                    xml=word.read('word/document.xml');root=ET.fromstring(xml);plain=''.join(root.itertext())
                    for step in entry['method_map']['steps']:self.assertIn(step['title'],plain)
                    self.assertIn('Revisit',plain);self.assertNotIn(b'<w:drawing',xml)
                    self.assertEqual(json.loads(ET.fromstring(word.read('customXml/item1.xml')).text),entry)
                if method=='comparative':self.assertEqual(json.loads(z.read('qca/qca-run.json')),entry['bindings']['qca'])
    def test_legacy_omission_stays_absent_through_export_restore_and_json(self):
        first=self.save();first.pop('method_map',None);first['content_hash']=reporting.digest({k:v for k,v in first.items() if k!='content_hash'})
        reporting.validate_state(self.p['research_report']);before=copy.deepcopy(first)
        html=reporting.html_export(first).decode();self.assertIn('No method map was saved',html)
        self.assertNotIn('class="method-map"',html);self.assertEqual(first,before)
        self.save('ta');restored=reporting.save(self.p,{'revision':2,'version_id':first['id']},restore=True)['current']
        self.assertNotIn('method_map',restored);self.assertEqual(restored['draft'],first['draft'])
        roundtrip=core.validate_project(json.loads(json.dumps(self.p)));self.assertEqual(roundtrip['research_report'],self.p['research_report'])
    def test_saved_map_does_not_follow_future_definition_changes(self):
        from qualicraft import method_maps
        first=copy.deepcopy(self.save());changed=method_maps.freeze('content');changed['steps'][0]['title']='Future map revision'
        with patch.object(method_maps,'freeze',return_value=changed):
            self.assertNotIn('Future map revision',reporting.html_export(first).decode())
            second=self.save();self.assertEqual(second['method_map'],changed)
        self.assertEqual(self.p['research_report']['history'][0],first)
    def test_mismatched_method_and_invalid_graph_rejected_even_when_rehashed(self):
        entry=self.save()
        for mutate in [lambda m:m.update(method='ta'),lambda m:m['links'].append([99,1]),lambda m:m.update(version=True),lambda m:m['references'][0].update(url='javascript:alert(1)')]:
            bad=copy.deepcopy(entry);mutate(bad['method_map']);bad['content_hash']=reporting.digest({k:v for k,v in bad.items() if k!='content_hash'})
            with self.assertRaises(ValueError):reporting.validate_entry(bad)
    def test_changed_method_retains_writing_and_frozen_figures_without_running_qca(self):
        from qualicraft import report_figures
        d=reporting.blank(self.p,'content');d['narrative']='Existing interpretation';d['figures']=[{'id':'frequency','options':{'kind':'frequency'},'caption':'Original caption'}]
        reporting.save(self.p,{'revision':0,'source_version':reporting.source_version(self.p),'draft':d});first=copy.deepcopy(self.p['research_report'])
        d=copy.deepcopy(first['current']['draft']);d['method']='comparative';d['checks']={k:False for k in reporting.CHECKS['comparative']}
        with patch.object(qca_state,'run',side_effect=AssertionError('must not run')),patch.object(report_figures,'freeze',side_effect=AssertionError('must not draw')):
            state=reporting.save(self.p,{'revision':1,'source_version':reporting.source_version(self.p),'draft':d})
        self.assertEqual(state['assets'],first['assets']);self.assertEqual(state['current']['bindings']['figures'],first['current']['bindings']['figures'])
        self.assertEqual(state['current']['draft']['narrative'],'Existing interpretation')
        self.assertEqual(state['current']['bindings']['qca'],self.p['comparative_qca']['current'])
    def test_switch_from_qca_keeps_previously_selected_citations_without_inventing_evidence(self):
        first=self.save('comparative');a=next(iter(first['bindings']['evidence']))
        d=copy.deepcopy(first['draft']);d['narrative']='Preserved quotation [E:'+a+']';d['method']='content';d['checks']={k:False for k in reporting.CHECKS['content']}
        for _ in range(2):
            current=reporting.save(self.p,{'revision':self.p['research_report']['revision'],'source_version':reporting.source_version(self.p),'draft':d})['current']
            self.assertEqual(current['bindings']['evidence'][a],first['bindings']['evidence'][a]);self.assertEqual(current['draft']['narrative'],d['narrative'])
        self.assertIn('[E1]',reporting.html_export(current).decode())
        unknown=next(x['id'] for x in self.p['annotations'] if x['id']!=a)
        d['narrative']+=' [E:'+unknown+']';before=copy.deepcopy(self.p)
        with self.assertRaises(ValueError):reporting.save(self.p,{'revision':self.p['research_report']['revision'],'source_version':reporting.source_version(self.p),'draft':d})
        self.assertEqual(self.p,before)
    def test_snapshot_keeps_new_and_legacy_map_versions(self):
        legacy=self.save();legacy.pop('method_map');legacy['content_hash']=reporting.digest({k:v for k,v in legacy.items() if k!='content_hash'});self.save('ta')
        with tempfile.TemporaryDirectory() as folder:
            store=core.Store(Path(folder)/'b.sqlite3');store.create(self.p)
            restored=store.restore(self.p['id'],store.backups(self.p['id'])[0]['name'])
            self.assertEqual(restored['research_report'],self.p['research_report'])
    def test_website_maps_are_exact_generated_source_not_another_method_definition(self):
        from qualicraft import method_maps
        target=Path(__file__).resolve().parents[1]/'website/lib/site/method-maps.json'
        self.assertEqual(json.loads(target.read_text(encoding='utf-8')),method_maps.MAPS)
