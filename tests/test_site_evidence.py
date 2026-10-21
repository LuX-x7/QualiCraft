"""Site illustrations must be grounded in exact saved records, never previews."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import unittest
from qualicraft.core import add_code, add_document, annotate, new_project


class SiteEvidenceTests(unittest.TestCase):
    def setUp(self):
        spec = importlib.util.spec_from_file_location('build_evidence', Path(__file__).resolve().parents[1] / 'tools/site/build_evidence.py')
        self.module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.module)
        self.p = new_project('Technical source contract')
        d = add_document(self.p, 'Marker.txt', '😀 technical source marker')
        theme = add_code(self.p, 'Theme', research_role='theme')
        parent = add_code(self.p, 'Parent', parent_id=theme['id'], research_role='category')
        leaf = add_code(self.p, 'Code', 'Saved definition', parent_id=parent['id'], research_role='code')
        self.a = annotate(self.p, d['id'], leaf['id'], 0, 12)
        self.raw = json.dumps({'project': {'documents':1,'codes':3,'codings':1}}).encode()

    def build(self):
        return self.module.build_evidence(self.p, 'a'*64, self.raw, self.a['id'])

    def test_exact_unicode_source_ids_hash_and_full_tree_survive(self):
        before = copy.deepcopy(self.p)
        result = self.build()
        e = result['example']
        self.assertEqual(e['quote'], self.p['documents'][0]['text'][:12])
        self.assertEqual(e['annotation_id'], self.a['id'])
        self.assertEqual(e['document_sha256'], hashlib.sha256(self.p['documents'][0]['text'].encode()).hexdigest())
        self.assertEqual([c['name'] for c in e['code_path']], ['Theme','Parent','Code'])
        self.assertEqual([c['research_role'] for c in e['code_path']], ['theme','category','code'])
        self.assertEqual(e['code_path'][-1]['definition'], 'Saved definition')
        self.assertEqual(result['provenance']['manifest_sha256'], hashlib.sha256(self.raw).hexdigest())
        self.assertEqual(self.p, before)

    def test_a_mismatched_quote_is_rejected(self):
        self.a['quote'] = 'wrong source'
        with self.assertRaises(ValueError): self.build()

    def test_a_cyclic_or_missing_parent_is_rejected(self):
        self.p['codes'][0]['parent_id'] = self.p['codes'][-1]['id']
        with self.assertRaises(ValueError): self.build()
        self.p['codes'][0]['parent_id'] = 'missing'
        with self.assertRaises(ValueError): self.build()

    def test_another_manifest_cannot_silently_bind_to_the_example(self):
        self.raw = json.dumps({'project': {'documents':1,'codes':3,'codings':99}}).encode()
        with self.assertRaises(ValueError): self.build()
