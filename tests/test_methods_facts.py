"""A saved note is evidence of its text, not when the researcher wrote it."""
import copy
import unittest
from qualicraft.core import add_code, add_document, annotate, methods_narrative, new_project, update_document


class MethodsFactsTests(unittest.TestCase):
    def test_reading_notes_do_not_infer_chronology_from_their_presence(self):
        for note_first in (True, False):
            with self.subTest(note_first=note_first):
                p = new_project('Note chronology regression')
                d = add_document(p, 'Marker document', 'technical source marker')
                c = add_code(p, 'Marker code')
                if note_first:
                    update_document(p, d['id'], {'memo': 'Retained technical note'})
                annotate(p, d['id'], c['id'], 0, 9)
                if not note_first:
                    update_document(p, d['id'], {'memo': 'Retained technical note'})
                before = copy.deepcopy(p)
                result = methods_narrative(p)
                self.assertNotIn('before any coding took place', result)
                self.assertNotIn("researcher's first impressions", result)
                self.assertIn('Timing relative to coding is not recorded', result)
                self.assertIn('Retained technical note', result)
                self.assertEqual(p, before)

    def test_missing_notes_do_not_assert_familiarisation_was_or_was_not_done(self):
        p = new_project('Empty note regression')
        before = copy.deepcopy(p)
        result = methods_narrative(p)
        self.assertIn('_No reading notes were recorded in this project file._', result)
        self.assertNotIn('No familiarisation memos', result)
        self.assertEqual(p, before)
