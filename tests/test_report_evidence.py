"""Report examples follow actual codings and their exact source identities."""
import copy
import importlib.util
import json
from pathlib import Path
import unittest
from qualicraft.core import new_project,add_document,add_code,annotate

class ReportEvidenceTests(unittest.TestCase):
    def setUp(self):
        spec=importlib.util.spec_from_file_location('report_evidence',Path(__file__).resolve().parents[1]/'tools/report/build_evidence.py')
        self.module=importlib.util.module_from_spec(spec);spec.loader.exec_module(self.module)
        self.p=new_project('Technical source contract')
        self.d=add_document(self.p,'Marker.txt','😀 technical source marker')
        self.t=add_code(self.p,'Theme');self.a=add_code(self.p,'A',parent_id=self.t['id']);self.b=add_code(self.p,'B',parent_id=self.t['id'])
        self.aa=annotate(self.p,self.d['id'],self.a['id'],0,12);self.bb=annotate(self.p,self.d['id'],self.b['id'],5,16)
        self.manifest=json.dumps({'project':{'documents':1,'codes':3,'codings':2},'files':[]}).encode()
        self.tables={'frequency':[['code','count'],['A','1']], 'coverage':[['case','code','count'],['Marker.txt','A','1'],['Marker.txt','B','0']], 'cooccurrence':[['code_a','code_b','count'],['A','B','1']], 'hierarchy':[['section','subsection','count'],['Theme','A','1']], 'accumulation':[['step','case','cumulative','new'],['1','Marker.txt','2','2']]}
    def build(self): return self.module.build_report_evidence(self.p,'a'*64,self.manifest,self.tables)
    def test_examples_preserve_exact_unicode_ranges_paths_and_do_not_mutate(self):
        before=copy.deepcopy(self.p);result=self.build();e=result['examples'][self.aa['id']]
        self.assertEqual(e['quote'],self.d['text'][0:12]);self.assertEqual(e['code_id'],self.a['id']);self.assertEqual([c['name'] for c in e['code_path']],['Theme','A'])
        self.assertEqual(result['rows']['coverage'][1]['annotation_ids'],[]);self.assertEqual(self.p,before)
        self.assertEqual(result['rows']['cooccurrence'][0]['annotation_ids'],[self.aa['id'],self.bb['id']])
    def test_missing_or_ambiguous_csv_identities_are_rejected(self):
        self.tables['frequency'][1][0]='not a code'
        with self.assertRaises(ValueError): self.build()
    def test_non_overlapping_pairs_cannot_claim_to_be_cooccurrence_examples(self):
        self.bb['start']=12;self.bb['end']=16;self.bb['quote']=self.d['text'][12:16]
        with self.assertRaises(ValueError): self.build()
    def test_stale_source_quote_or_manifest_counts_are_rejected(self):
        self.aa['quote']='stale'
        with self.assertRaises(ValueError): self.build()
        self.aa['quote']=self.d['text'][0:12];self.manifest=json.dumps({'project':{'documents':1,'codes':3,'codings':9}}).encode()
        with self.assertRaises(ValueError): self.build()
