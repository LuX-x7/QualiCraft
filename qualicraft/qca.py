"""QT binary crisp-set QCA v1. Original, standard-library-only conservative engine.

No logical remainders are used. All minimum-cardinality prime-implicant covers
are returned, or execution fails explicitly at its resource bound. Counts here
are calibrated cases, never qualitative coding frequencies. This file is also
the exact standalone engine shipped with frozen exports.
"""
from __future__ import annotations
import itertools
import math
import re
from fractions import Fraction

VERSION = 'qt-crisp-conservative-1'
MAX_CONDITIONS = 6
MAX_CASES = 100
DEFAULT_BUDGET = 200_000
MAX_SOLUTIONS = 256

class ComplexityError(ValueError):
    pass


def require(condition, message):
    if not condition:raise ValueError(message)


def options(value=None):
    value={} if value is None else value
    require(isinstance(value,dict) and set(value)<={'n_cut','ic1','ic0','target'},'Unknown QCA options')
    out={'n_cut':1,'ic1':1,'target':1,**value};out.setdefault('ic0',out['ic1'])
    require(type(out['n_cut']) is int and 1<=out['n_cut']<=MAX_CASES,'Frequency cutoff must be an integer from 1 to 100')
    require(type(out['target']) is int and out['target'] in (0,1),'Choose outcome presence (1) or absence (0)')
    require(all(type(out[k]) in (int,float) and math.isfinite(out[k]) and 0<=out[k]<=1 for k in ('ic1','ic0')) and out['ic0']<=out['ic1'],'Consistency cutoffs must satisfy 0 <= ic0 <= ic1 <= 1')
    return out


def matrix(value):
    require(isinstance(value,dict) and set(value)=={'conditions','outcome','cases'},'Invalid calibrated matrix')
    conditions=value['conditions'];outcome=value['outcome'];cases=value['cases']
    valid=lambda x:isinstance(x,str) and re.fullmatch('[A-Za-z][A-Za-z0-9_]{0,31}',x) is not None
    require(isinstance(conditions,list) and 1<=len(conditions)<=MAX_CONDITIONS and all(valid(c) for c in conditions) and len(set(conditions))==len(conditions),'Use one to six distinct condition identifiers')
    require(valid(outcome) and outcome not in conditions,'Define a separate outcome identifier')
    require(isinstance(cases,list) and 1<=len(cases)<=MAX_CASES,'Use one to 100 calibrated cases')
    seen=set()
    for case in cases:
        require(isinstance(case,dict) and set(case)=={'id','values'},'Invalid case matrix row')
        id=case['id'];require(isinstance(id,str) and re.fullmatch('[A-Za-z0-9_-]{1,100}',id) and id not in seen,'Case IDs must be distinct');seen.add(id)
        values=case['values'];require(isinstance(values,dict) and set(values)==set(conditions+[outcome]) and all(type(v) is int and v in (0,1) for v in values.values()),'Every membership must be explicitly calibrated to integer 0 or 1; missing values cannot run')
    return value


def ratio(a,b):return a/b if b else None


def expression(cube,conditions):
    return '*'.join(('~' if b=='0' else '')+c for c,b in zip(conditions,cube) if b!='-') or '1'


def analyze(value, settings=None, *, budget=DEFAULT_BUDGET, cancel=None):
    data=matrix(value);settings=options(settings);conditions=data['conditions'];outcome=data['outcome'];cases=data['cases'];k=len(conditions)
    require(type(budget) is int and budget>0,'The computation budget is invalid')
    steps=0
    def tick():
        nonlocal steps
        steps+=1
        if cancel and cancel():raise InterruptedError('QCA run cancelled; the previous saved result is retained')
        if steps>budget:raise ComplexityError('QCA complexity limit reached; no partial solution was saved. Reduce conditions or revise the calibrated design.')
    tick()
    all_configs=[''.join(c) for c in itertools.product('01',repeat=k)]
    case_config={c['id']:''.join(str(c['values'][x]) for x in conditions) for c in cases}
    y={c['id'] for c in cases if c['values'][outcome]==settings['target']}
    all_ids={c['id'] for c in cases};truth=[]
    ic1=Fraction(str(settings['ic1']));ic0=Fraction(str(settings['ic0']))
    for config in all_configs:
        tick();ids={id for id,v in case_config.items() if v==config};pos=ids&y;neg=ids-y;n=len(ids)
        fraction=Fraction(len(pos),n) if n else None
        label='?' if n<settings['n_cut'] else '1' if fraction>=ic1 else 'C' if fraction>=ic0 else '0'
        truth.append({'configuration':config,'n':n,'positive':len(pos),'negative':len(neg),'consistency':ratio(len(pos),n),'mixed':bool(pos and neg),'label':label,'cases':sorted(ids),'positive_cases':sorted(pos),'negative_cases':sorted(neg)})
    positive={r['configuration'] for r in truth if r['label']=='1'}
    cubes={}
    for bits in itertools.product('01-',repeat=k):
        tick();cube=''.join(bits);expanded={s for s in all_configs if all(a=='-' or a==b for a,b in zip(cube,s))}
        if expanded<=positive:cubes[cube]=expanded
    prime={c:v for c,v in cubes.items() if not any(c[:i]+'-'+c[i+1:] in cubes for i,b in enumerate(c) if b!='-')}
    prime=dict(sorted(prime.items()));covers=set();best=k and len(positive)+1;visited=set()
    def search(chosen,covered):
        nonlocal best,covers
        tick();key=frozenset(chosen)
        if key in visited:return
        visited.add(key)
        if covered==positive:
            if len(chosen)<best:best=len(chosen);covers=set()
            if len(chosen)==best:
                covers.add(tuple(sorted(chosen)))
                if len(covers)>MAX_SOLUTIONS:raise ComplexityError('More than 256 equally minimal solutions; no incomplete enumeration was saved')
            return
        if len(chosen)>=best:return
        missing=positive-covered
        pivot=min(missing,key=lambda s:(sum(s in v for v in prime.values()),s))
        for cube,expanded in prime.items():
            if pivot in expanded:search(chosen+[cube],covered|expanded)
    if positive:search([],set())
    memberships={cube:{id for id,config in case_config.items() if config in expanded} for cube,expanded in prime.items()}
    implicants=[{'cube':cube,'expression':expression(cube,conditions),'configurations':sorted(expanded),'cases':sorted(memberships[cube]),'positive_cases':sorted(memberships[cube]&y),'negative_cases':sorted(memberships[cube]-y),'consistency':ratio(len(memberships[cube]&y),len(memberships[cube])),'raw_coverage':ratio(len(memberships[cube]&y),len(y))} for cube,expanded in prime.items()]
    solutions=[]
    for terms in sorted(covers):
        union=set().union(*(memberships[c] for c in terms));pos=union&y
        unique={c:ratio(len((memberships[c]&y)-set().union(*(memberships[t] for t in terms if t!=c))),len(y)) for c in terms}
        solutions.append({'terms':list(terms),'expression':' + '.join(expression(c,conditions) for c in terms),'cases':sorted(union),'positive_cases':sorted(pos),'negative_cases':sorted(union-y),'consistency':ratio(len(pos),len(union)),'coverage':ratio(len(pos),len(y)),'unique_coverage':unique})
    necessity=[]
    for condition in conditions:
        for bit in (1,0):
            x={c['id'] for c in cases if c['values'][condition]==bit};intersection=x&y
            necessity.append({'literal':('~' if bit==0 else '')+condition,'consistency':ratio(len(intersection),len(y)),'coverage':ratio(len(intersection),len(x)),'cases':sorted(x),'counterexample_cases':sorted(y-x)})
    constants=[condition for condition in conditions if len({c['values'][condition] for c in cases})==1]
    return {'engine':VERSION,'method':'binary conservative; no logical remainders','conditions':list(conditions),'outcome':outcome,'target':settings['target'],'options':settings,'truth_table':truth,'prime_implicants':implicants,'solutions':solutions,'minimum_terms':best if covers else None,'optimisation':'minimum number of prime implicants; all equally minimal covers','enumeration_complete':True,'necessity':necessity,'constant_conditions':constants,'outcome_positive_cases':sorted(y),'outcome_negative_cases':sorted(all_ids-y),'warnings':(['Constant conditions: '+', '.join(constants)] if constants else [])+(['No cases in the selected outcome set; outcome coverage and necessity consistency are undefined.'] if not y else [])+(['No eligible positive truth-table rows; no configuration solution.'] if not positive else [])}
