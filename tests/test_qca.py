"""Independent Boolean known answers, separate from public research examples."""
import copy,itertools,unittest
from qualicraft import qca

def matrix():
    return {'conditions':['A','B','C'],'outcome':'Y','cases':[{'id':'c'+''.join(map(str,bits)),'values':dict(zip(['A','B','C','Y'],[*bits,int(bits in [(1,0,1),(1,1,0),(1,1,1)])]))} for bits in itertools.product([0,1],repeat=3)]}

class QCATests(unittest.TestCase):
    def test_known_answer_terms_metrics_and_union(self):
        r=qca.analyze(matrix());self.assertEqual(len(r['truth_table']),8)
        self.assertEqual([s['terms'] for s in r['solutions']],[['1-1','11-']])
        self.assertTrue(r['enumeration_complete']);self.assertEqual(r['minimum_terms'],2)
        for p in r['prime_implicants']:
            self.assertEqual(p['consistency'],1);self.assertAlmostEqual(p['raw_coverage'],2/3)
        self.assertEqual(r['solutions'][0]['consistency'],1);self.assertEqual(r['solutions'][0]['coverage'],1)
        self.assertEqual(set(r['solutions'][0]['unique_coverage'].values()),{1/3})
        a=next(n for n in r['necessity'] if n['literal']=='A')
        self.assertEqual(a['consistency'],1);self.assertEqual(a['coverage'],.75)
    def test_unobserved_rows_are_never_borrowed(self):
        d=matrix();d['cases']=[c for c in d['cases'] if c['id']!='c111'];r=qca.analyze(d)
        self.assertEqual(r['solutions'][0]['terms'],['101','110'])
        self.assertEqual(next(t for t in r['truth_table'] if t['configuration']=='111')['label'],'?')
    def test_mixed_outcomes_are_independent_of_threshold_labels(self):
        d=matrix();d['cases'].append({'id':'counterexample','values':{'A':1,'B':0,'C':1,'Y':0}})
        r=qca.analyze(d);row=next(t for t in r['truth_table'] if t['configuration']=='101')
        self.assertTrue(row['mixed']);self.assertEqual(row['consistency'],.5);self.assertEqual(row['label'],'0');self.assertIn('counterexample',row['negative_cases'])
        r=qca.analyze(d,{'ic1':1,'ic0':.5});self.assertEqual(next(t for t in r['truth_table'] if t['configuration']=='101')['label'],'C');self.assertEqual(r['solutions'][0]['terms'],['11-'])
        r=qca.analyze(d,{'ic1':.5,'ic0':.5});self.assertEqual(next(t for t in r['truth_table'] if t['configuration']=='101')['label'],'1')
    def test_frequency_exclusion_and_no_positive_outcome(self):
        self.assertEqual(qca.analyze(matrix(),{'n_cut':2})['solutions'],[])
        d=matrix()
        for c in d['cases']:c['values']['Y']=0
        r=qca.analyze(d);self.assertEqual(r['solutions'],[]);self.assertIsNone(r['necessity'][0]['consistency'])
    def test_outcome_absence_is_analysed_separately(self):
        r=qca.analyze(matrix(),{'target':0});self.assertEqual(r['outcome_positive_cases'],['c000','c001','c010','c011','c100'])
        self.assertEqual(r['solutions'][0]['coverage'],1);self.assertEqual(r['target'],0)
    def test_invalid_values_ids_and_bounds_are_explicit(self):
        changes=[lambda d:d['cases'].append(copy.deepcopy(d['cases'][0])),lambda d:d['cases'][0]['values'].update(A=None),lambda d:d['cases'][0]['values'].update(A=True),lambda d:d['cases'][0]['values'].update(A=.5),lambda d:d['conditions'].append('Y'),lambda d:d.update(conditions=list('ABCDEFG'))]
        for change in changes:
            d=matrix();change(d)
            with self.assertRaises(ValueError):qca.analyze(d)
        for options in [{'ic0':1,'ic1':.8},{'n_cut':0},{'target':True},{'ic1':float('nan')},{'unknown':1}]:
            with self.assertRaises(ValueError):qca.analyze(matrix(),options)
    def test_constant_conditions_and_constant_true_cube(self):
        d=matrix()
        for c in d['cases']:c['values']['A']=1;c['values']['Y']=1
        r=qca.analyze(d);self.assertIn('A',r['constant_conditions']);self.assertEqual(r['solutions'][0]['terms'],['1--'])
        d=matrix()
        for c in d['cases']:c['values']['Y']=1
        self.assertEqual(qca.analyze(d)['solutions'][0]['terms'],['---'])
    def test_budget_and_cancellation_fail_without_mutating_inputs(self):
        d=matrix();before=copy.deepcopy(d)
        with self.assertRaises(qca.ComplexityError):qca.analyze(d,budget=1)
        with self.assertRaises(InterruptedError):qca.analyze(d,cancel=lambda:True)
        self.assertEqual(d,before)
    def test_six_conditions_and_one_hundred_cases_have_exact_bounded_results(self):
        names=list('ABCDEF');rows=[]
        for i,bits in enumerate(itertools.product([0,1],repeat=6)):
            rows.append({'id':'c'+str(i),'values':dict(zip(names+['Y'],[*bits,int(bits[0] and (bits[1] or bits[2]))]))})
        for i in range(36):rows.append({'id':'repeat'+str(i),'values':copy.deepcopy(rows[i]['values'])})
        data={'conditions':names,'outcome':'Y','cases':rows};r=qca.analyze(data)
        self.assertEqual(len(r['truth_table']),64);self.assertEqual(sum(row['n'] for row in r['truth_table']),100)
        self.assertEqual(r['solutions'][0]['terms'],['1-1---','11----'])
        self.assertEqual(r['solutions'][0]['coverage'],1);self.assertEqual(r['solutions'][0]['consistency'],1)
        data['cases'].append({'id':'extra','values':copy.deepcopy(rows[0]['values'])})
        with self.assertRaises(ValueError):qca.analyze(data)
    def test_exhaustive_three_condition_cube_invariant_and_all_minimal_covers(self):
        # Independent brute-force cube / cover enumeration for all 256 Boolean functions.
        combos=list(itertools.product([0,1],repeat=3));configs=[''.join(map(str,b)) for b in combos]
        cubes={''.join(c):{s for s in configs if all(x=='-' or x==v for x,v in zip(c,s))} for c in itertools.product('01-',repeat=3)}
        multiple=False
        for mask in range(256):
            positive={s for i,s in enumerate(configs) if mask>>i&1};d=matrix()
            for case,s in zip(d['cases'],configs):case['values']['Y']=int(s in positive)
            r=qca.analyze(d);valid={c:v for c,v in cubes.items() if v<=positive}
            prime={c:v for c,v in valid.items() if not any(v<w for w in valid.values())}
            self.assertEqual({p['cube'] for p in r['prime_implicants']},set(prime))
            expected=set()
            if positive:
                for count in range(1,len(prime)+1):
                    expected={tuple(sorted(keys)) for keys in itertools.combinations(prime,count) if set().union(*(prime[c] for c in keys))==positive}
                    if expected:break
            self.assertEqual({tuple(s['terms']) for s in r['solutions']},expected)
            multiple=multiple or len(expected)>1
        self.assertTrue(multiple)

if __name__=='__main__':unittest.main()
