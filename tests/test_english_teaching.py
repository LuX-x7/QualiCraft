"""English teaching excerpts must stay exact and traceable, never replace the original."""
import copy,hashlib,json,unittest
from pathlib import Path
from qualicraft.examples import teaching_project
from qualicraft.server import bologna_example
from qualicraft import core,analyze,plotting

class EnglishTeachingTests(unittest.TestCase):
 def test_repeatable_source_and_all_translated_ranges(self):
  a,b=teaching_project(),teaching_project();self.assertEqual(a,b)
  self.assertEqual((len(a['documents']),len(a['codes']),len(a['annotations'])),(3,25,11))
  self.assertIn('not complete interviews',a['provenance'])
  docs={d['id']:d for d in a['documents']}
  for item in a['annotations']:
   self.assertEqual(docs[item['document_id']]['text'][item['start']:item['end']],item['quote'])
   self.assertIn('original annotation',item['memo'])
  self.assertTrue(all(d['attributes']['language']=='en' for d in a['documents']))
 def test_api_copy_is_english_and_original_is_unchanged(self):
  path=Path('demo-data/qualicraft.sqlite3');before=hashlib.sha256(path.read_bytes()).hexdigest()
  a,b=bologna_example(english=True),bologna_example(english=True)
  self.assertNotEqual(a['id'],b['id']);self.assertEqual(a['documents'],b['documents'])
  original=bologna_example();self.assertEqual(len(original['documents']),19);self.assertEqual(len(original['annotations']),874)
  self.assertEqual(before,hashlib.sha256(path.read_bytes()).hexdigest())
 def test_overlaps_and_all_five_figure_inputs_are_nonempty(self):
  p=teaching_project();before=copy.deepcopy(p);rows=analyze.tidy(p)
  for kind in ['frequency','coverage','cooccurrence','hierarchy','accumulation']:
   self.assertGreater(len(plotting._dataset(rows,plotting.normalise({'kind':kind}),{d['name']:d['text'] for d in p['documents']}).splitlines()),1)
  self.assertTrue(any(a['document_id']==b['document_id'] and a['id']!=b['id'] and a['start']<b['end'] and b['start']<a['end'] for a in p['annotations'] for b in p['annotations']))
  self.assertTrue(rows);self.assertEqual(p,before)
 def test_original_public_downloads_remain_byte_identical(self):
  root=Path('website/public/original-bologna')
  for name in ['report','worked-example']:
   m=json.loads((root/name/'manifest.json').read_text(encoding='utf-8'))
   for f in m['files']:self.assertEqual(hashlib.sha256((root/name/f['path']).read_bytes()).hexdigest(),f['sha256'])
