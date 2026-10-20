"""Public outputs must be real, intact Bologna exports with stated scope."""
from pathlib import Path
import hashlib
import io
import json
import unittest
import zipfile
from xml.etree import ElementTree as ET
from qualicraft import core, reporting, transcript
from qualicraft.examples import teaching_project

ROOT=Path(__file__).resolve().parents[1]/'website/public/worked-example'


class WorkedExampleTests(unittest.TestCase):
    def test_every_published_member_matches_its_manifest(self):
        manifest=json.loads((ROOT/'manifest.json').read_text(encoding='utf-8'))
        self.assertEqual(manifest['source'],'demo-data/qualicraft.sqlite3')
        self.assertEqual({f['path'] for f in manifest['files']},{p.name for p in ROOT.iterdir() if p.is_file() and p.name!='manifest.json'})
        for member in manifest['files']:
            payload=(ROOT/member['path']).read_bytes()
            self.assertEqual(len(payload),member['bytes'])
            self.assertEqual(hashlib.sha256(payload).hexdigest(),member['sha256'])

    def test_restore_contains_original_corpus_and_saved_content_method(self):
        p=core.validate_project(json.loads((ROOT/'project.json').read_text(encoding='utf-8')))
        original=teaching_project()
        for field in ('documents','codes','annotations'):
            self.assertEqual(p[field],original[field])
        entry=p['research_report']['current']
        self.assertEqual(entry['draft']['method'],'content')
        self.assertIn('method_map',entry)
        self.assertEqual(len(entry['draft']['figures']),5)
        self.assertEqual(len(entry['draft']['rows']),3)
        self.assertFalse(all(entry['draft']['checks'].values()))
        self.assertNotIn('qca',entry['bindings'])

    def test_notebook_preserves_one_complete_document_and_all_saved_links(self):
        p=json.loads((ROOT/'project.json').read_text(encoding='utf-8'))
        record=json.loads((ROOT/'notebook-record.json').read_text(encoding='utf-8'))
        doc=next(d for d in p['documents'] if d['name']=='interview02-english-excerpts.txt')
        expected=transcript.freeze(p,[doc['id']],role_labels='theme-category-code')
        expected['generated_at']=record['generated_at']
        self.assertEqual(record,expected)
        self.assertEqual((ROOT/'notebook.html').read_bytes(),transcript.html_export(record))
        with zipfile.ZipFile(ROOT/'notebook.docx') as z:
            xml=ET.fromstring(z.read('word/document.xml'))
            text=''.join(xml.itertext())
            self.assertIn(doc['text'].split('\n\n')[0],text)
            self.assertIn('CATEGORY',text)
            self.assertNotIn('word/documentProtection',z.namelist())

    def test_downloads_have_all_five_complete_reproducible_bundles(self):
        p=json.loads((ROOT/'project.json').read_text(encoding='utf-8'));state=p['research_report'];entry=state['current']
        with zipfile.ZipFile(ROOT/'figures-and-code.zip') as z:
            self.assertIsNone(z.testzip())
            for figure in entry['draft']['figures']:
                from qualicraft import report_figures
                asset=state['assets'][entry['bindings']['figures'][figure['id']]['asset_id']]
                for name,payload in report_figures.files(asset).items():
                    self.assertEqual(z.read(figure['options']['kind']+'/'+name),payload)
        with zipfile.ZipFile(ROOT/'research-report.zip') as z:
            self.assertIsNone(z.testzip())
            self.assertEqual(z.read('report.html'),(ROOT/'research-report.html').read_bytes())
            with zipfile.ZipFile(io.BytesIO(z.read('report.docx'))) as packaged, zipfile.ZipFile(ROOT/'research-report.docx') as direct:
                self.assertEqual({n:packaged.read(n) for n in packaged.namelist()},{n:direct.read(n) for n in direct.namelist()})
        self.assertEqual((ROOT/'research-report.html').read_bytes(),reporting.html_export(entry,assets=state['assets']))
