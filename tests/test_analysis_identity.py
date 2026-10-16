import copy
import csv
import io
import unittest

from qualicraft import analyze, plotting
from qualicraft.core import add_code, add_document, annotate, csv_export, new_project, validate_project


def duplicates():
    project = new_project('Identity regression')
    first = add_document(project, 'I1', 'alpha beta')
    second = add_document(project, 'I2', 'alpha beta')
    left = add_code(project, 'Left')
    right = add_code(project, 'Right')
    a = add_code(project, 'Shared', parent_id=left['id'])
    b = add_code(project, 'Shared', parent_id=right['id'])
    annotate(project, first['id'], a['id'], 0, 5)
    annotate(project, first['id'], b['id'], 0, 5)
    return project, first, second, left, right, a, b


class IdentityTests(unittest.TestCase):
    def test_tidy_appends_ids_and_label_without_renaming_saved_codes(self):
        project, _, _, left, right, a, b = duplicates()
        before = copy.deepcopy(project)
        rows = analyze.tidy(project)
        self.assertEqual(tuple(rows[0]), ('case', 'code', 'parent_code', 'theme', 'start', 'end', 'text', 'source', 'code_id', 'theme_id', 'code_label'))
        self.assertEqual([r['code_id'] for r in rows], [a['id'], b['id']])
        self.assertEqual([r['theme_id'] for r in rows], [left['id'], right['id']])
        self.assertEqual([r['code_label'] for r in rows], ['Left > Shared', 'Right > Shared'])
        self.assertEqual([r['code'] for r in rows], ['Shared', 'Shared'])
        self.assertEqual(project, before)
        validate_project(project)
        self.assertEqual(project['schema_version'], 5)

    def test_identical_span_counts_distinct_ids_in_every_statistic(self):
        project, first, *_ = duplicates()
        rows = analyze.tidy(project)
        self.assertEqual({r['label']: r['count'] for r in analyze.frequency(rows)}, {'Left > Shared': 1, 'Right > Shared': 1})
        cov = analyze.coverage(rows)
        self.assertEqual(cov['codes'], ['Left > Shared', 'Right > Shared'])
        self.assertEqual(cov['matrix'], [[1, 1]])
        for mode in ('overlap', 'unit'):
            co = analyze.cooccurrence(rows, mode=mode, case_text={'I1': first['text']})
            self.assertEqual(co['labels'], cov['codes'])
            self.assertEqual(co['matrix'], [[1, 1], [1, 1]])
        self.assertEqual(analyze.accumulation(rows)['cumulative'], [2])
        self.assertEqual(analyze.hierarchy(rows), {'Left': {'Left > Shared': 1}, 'Right': {'Right > Shared': 1}})
        self.assertEqual(analyze.summary(project), {'cases': 1, 'codes': 2, 'codings': 2, 'themes': 2})

    def test_same_id_across_documents_aggregates_and_nested_names_stay_distinct(self):
        project, first, second, left, _, a, _ = duplicates()
        branch = add_code(project, 'Branch', parent_id=left['id'])
        c = add_code(project, 'Shared', parent_id=branch['id'])
        annotate(project, second['id'], a['id'], 0, 5)
        annotate(project, first['id'], c['id'], 0, 5)
        rows = analyze.tidy(project)
        self.assertEqual({r['label']: r['count'] for r in analyze.frequency(rows)},
                         {'Left > Shared': 2, 'Right > Shared': 1, 'Left > Branch > Shared': 1})
        self.assertEqual(analyze.accumulation(rows)['cumulative'], [3, 3])
        self.assertEqual(analyze.summary(project)['codes'], 3)
        self.assertEqual({r['label']: r['count'] for r in analyze.frequency(rows, by='theme')}, {'Left': 3, 'Right': 1})

    def test_colliding_full_paths_append_full_ids(self):
        project, first, _, left, _, a, _ = duplicates()
        # A literal separator in a name can produce the same visible path.
        branch = add_code(project, 'Left > Branch')
        b = add_code(project, 'Shared', parent_id=branch['id'])
        middle = add_code(project, 'Branch', parent_id=left['id'])
        c = add_code(project, 'Shared', parent_id=middle['id'])
        for code in (b, c):
            annotate(project, first['id'], code['id'], 0, 5)
        rows = analyze.tidy(project)
        labels = {r['code_id']: r['code_label'] for r in rows}
        self.assertIn(b['id'], labels[b['id']])
        self.assertIn(c['id'], labels[c['id']])
        self.assertEqual(len(set(labels.values())), len(labels))
        self.assertEqual(analyze.summary(project)['codes'], 4)

    def test_network_ownership_and_edges_use_real_ids(self):
        project, _, _, left, right, a, b = duplicates()
        graph = analyze.network(analyze.tidy(project))
        nodes = {n['id']: n for n in graph['nodes']}
        for theme, code in ((left, a), (right, b)):
            node = nodes['code:' + code['id']]
            self.assertEqual(node['code_id'], code['id'])
            self.assertEqual(node['theme_id'], theme['id'])
            self.assertEqual(node['weight'], 1)
            self.assertEqual(nodes['theme:' + theme['id']]['theme_id'], theme['id'])
            self.assertTrue(any(l['source'] == 'theme:' + theme['id'] and l['target'] == node['id'] and l['kind'] == 'hierarchy' for l in graph['links']))
        co = [l for l in graph['links'] if l['kind'] == 'cooccurrence']
        self.assertEqual(len(co), 1)
        self.assertEqual({co[0]['source'], co[0]['target']}, {'code:' + a['id'], 'code:' + b['id']})
        self.assertEqual(co[0]['weight'], 1)
        for n in nodes.values():
            if n['kind'] == 'passage':
                self.assertIn('code:' + n['code_id'], nodes)
        for link in graph['links']:
            self.assertIn(link['source'], nodes)
            self.assertIn(link['target'], nodes)

    def test_count_csvs_keep_columns_and_disambiguate_labels(self):
        project, first, *_ = duplicates()
        rows = analyze.tidy(project)
        headers = {'frequency': ['code', 'count'], 'coverage': ['case', 'code', 'count'],
                   'cooccurrence': ['code_a', 'code_b', 'count'], 'hierarchy': ['section', 'subsection', 'count'],
                   'accumulation': ['step', 'case', 'cumulative', 'new']}
        for kind, header in headers.items():
            data = plotting._dataset(rows, plotting.normalise({'kind': kind}), {'I1': first['text']})
            self.assertEqual(next(csv.reader(io.StringIO(data))), header)
            if kind != 'accumulation':
                self.assertIn('Left > Shared', data)
                self.assertIn('Right > Shared', data)
        matrix = list(csv.reader(io.StringIO(csv_export(project, matrix=True).decode('utf-8-sig'))))
        self.assertEqual(matrix[0], ['document', 'Left', 'Right', 'Left > Shared', 'Right > Shared'])
        self.assertEqual(matrix[1], ['I1', '0', '0', '1', '1'])
