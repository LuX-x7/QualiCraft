"""Persisted, researcher-calibrated Comparative QCA, separate from coding counts."""
from __future__ import annotations
import copy,csv,hashlib,io,json,re,zipfile,platform,sys
from pathlib import Path
from functools import lru_cache
from . import qca,transcript
from .core import require,uid,now,event,validate_reading_capacity

HISTORY_LIMIT=4
MAX_BYTES=6_000_000

class QCAConflict(ValueError):pass

def digest(value):return hashlib.sha256(transcript.canonical(value).encode()).hexdigest()
def source_version(project):
    from .reporting import source_version as coding_version
    return coding_version(project)
def engine_source():return Path(qca.__file__).read_text(encoding='utf-8')
def text(value,limit=4000):
    require(isinstance(value,str) and len(value)<=limit and not re.search(r'[\x00-\x08\x0b\x0c\x0e-\x1f\ud800-\udfff\ufffe\uffff]',value),'QCA text is invalid or too long');return value
def ids(values,limit=100):
    require(isinstance(values,list) and len(values)<=limit and all(isinstance(v,str) and re.fullmatch('[A-Za-z0-9_-]{1,100}',v) for v in values) and len(set(values))==len(values),'QCA references must be distinct valid IDs');return values

def definition(id,label=''):
    return {'id':id,'label':label,'definition':'','zero_rule':'','one_rule':'','basis':''}
def blank():
    return {'question':'','case_unit':'','conditions':[definition('A')],'outcome':definition('Y'),'cases':[]}

def validate_design(design,complete=False):
    require(isinstance(design,dict) and set(design)=={'question','case_unit','conditions','outcome','cases'},'Invalid QCA design')
    for k in ('question','case_unit'):text(design[k])
    conditions=design['conditions'];require(isinstance(conditions,list) and 1<=len(conditions)<=6,'Use one to six conditions')
    definitions=conditions+[design['outcome']];names=[]
    for d in definitions:
        require(isinstance(d,dict) and set(d)=={'id','label','definition','zero_rule','one_rule','basis'},'Invalid set definition')
        require(isinstance(d['id'],str) and re.fullmatch('[A-Za-z][A-Za-z0-9_]{0,31}',d['id']),'Set IDs must begin with a letter and contain only letters, digits or underscores')
        names.append(d['id'])
        for k in ('label','definition','zero_rule','one_rule','basis'):
            text(d[k],200 if k=='label' else 4000)
            if complete:require(d[k].strip(),'Complete every set label, definition, 0/1 rule and calibration basis before running')
    require(len(set(names))==len(names),'Condition and outcome IDs must be distinct')
    cases=design['cases'];require(isinstance(cases,list) and len(cases)<=100,'At most 100 cases are supported')
    ids([c.get('id') for c in cases if isinstance(c,dict)])
    for c in cases:
        require(isinstance(c,dict) and set(c)=={'id','label','document_ids','cells'},'Invalid QCA case');text(c['label'],200);ids(c['document_ids'],100)
        require(isinstance(c['cells'],dict) and set(c['cells'])==set(names),'Every case needs a cell for each condition and outcome')
        for cell in c['cells'].values():
            require(isinstance(cell,dict) and set(cell)=={'value','rationale','evidence_ids'},'Invalid calibration cell')
            require(cell['value'] is None or type(cell['value']) is int and cell['value'] in (0,1),'Membership is 0, 1 or missing');text(cell['rationale'],2000);ids(cell['evidence_ids'],20)
            if complete:require(cell['value'] is not None and cell['rationale'].strip(),'Calibrate every membership explicitly and explain each decision; missing values cannot run')
        if complete:require(c['label'].strip() and c['document_ids'],'Each case needs a label and at least one mapped source document')
    if complete:require(design['question'].strip() and design['case_unit'].strip() and cases,'Define the research question, case unit and at least one case')
    return design

def calibrated_matrix(design):
    return {'conditions':[d['id'] for d in design['conditions']],'outcome':design['outcome']['id'],'cases':[{'id':c['id'],'values':{k:v['value'] for k,v in c['cells'].items()}} for c in design['cases']]}

@lru_cache(maxsize=32)
def verify_calculation(matrix_json,options_json,result_json):
    # Cache only exact immutable mathematical inputs/results, never source text.
    # A prepared run is checked before taking the database writer lock.
    require(result_json==transcript.canonical(qca.analyze(json.loads(matrix_json),json.loads(options_json))),'Saved QCA results do not match the calibrated matrix')

def bind(project,design):
    from .reporting import catalog
    docs={d['id']:d for d in project['documents']};available=catalog(project);evidence=available['evidence'];selected=set();doc_ids=set()
    for c in design['cases']:
        require(set(c['document_ids'])<=set(docs),'A mapped source document is unavailable; update the case mapping')
        doc_ids.update(c['document_ids'])
        for cell in c['cells'].values():
            require(set(cell['evidence_ids'])<=set(evidence),'Calibration evidence is unavailable; select current saved quotations')
            require(all(evidence[id]['document_id'] in c['document_ids'] for id in cell['evidence_ids']),'A calibration quotation must belong to a document mapped to that case')
            selected.update(cell['evidence_ids'])
    codes={evidence[id]['code_id'] for id in selected}
    return {'documents':{id:{'id':id,'name':docs[id]['name'],'sha256':hashlib.sha256(docs[id]['text'].encode()).hexdigest()} for id in sorted(doc_ids)},'evidence':{id:evidence[id] for id in sorted(selected)},'codes':{id:available['codes'][id] for id in sorted(codes)}}

def validate_run(run):
    keys={'id','input_revision','created_at','source_version','design','options','matrix','bindings','result','engine_source','content_hash'}
    require(isinstance(run,dict) and set(run) in (keys,keys|{'environment'}),'Invalid frozen QCA run');ids([run['id']],1)
    require(type(run['input_revision']) is int and run['input_revision']>0,'Invalid QCA input revision');text(run['created_at'],100)
    require(isinstance(run['source_version'],str) and re.fullmatch('[0-9a-f]{64}',run['source_version']),'Invalid QCA source fingerprint')
    validate_design(run['design'],complete=True);require(qca.options(run['options'])==run['options'],'Invalid saved thresholds')
    require(run['matrix']==calibrated_matrix(run['design']),'The saved matrix does not match calibration')
    require(run['engine_source']==engine_source(),'This QCA engine version is unavailable; retain the original exported bundle')
    if 'environment' in run:
        env=run['environment'];require(isinstance(env,dict) and set(env)=={'python','implementation','system','engine_sha256'},'Invalid QCA generation environment')
        for key in ('python','implementation','system'):text(env[key],100)
        require(env['engine_sha256']==hashlib.sha256(run['engine_source'].encode()).hexdigest(),'QCA engine checksum does not match the frozen source')
    require(run['content_hash']==digest({k:v for k,v in run.items() if k!='content_hash'}),'QCA integrity validation failed')
    verify_calculation(transcript.canonical(run['matrix']),transcript.canonical(run['options']),transcript.canonical(run['result']))
    bindings=run['bindings'];require(isinstance(bindings,dict) and set(bindings)=={'documents','evidence','codes'} and all(isinstance(v,dict) for v in bindings.values()),'Invalid frozen QCA source bindings')
    expected_docs={id for c in run['design']['cases'] for id in c['document_ids']};expected_evidence={id for c in run['design']['cases'] for cell in c['cells'].values() for id in cell['evidence_ids']}
    require(set(bindings['documents'])==expected_docs and set(bindings['evidence'])==expected_evidence,'Missing QCA source bindings')
    for id,d in bindings['documents'].items():
        require(isinstance(d,dict) and set(d)=={'id','name','sha256'} and d['id']==id,'Invalid mapped document');text(d['name'],200);require(isinstance(d['sha256'],str) and re.fullmatch('[0-9a-f]{64}',d['sha256']),'Invalid source SHA256')
    for id,a in bindings['evidence'].items():
        require(isinstance(a,dict) and set(a)=={'id','document_id','document_name','sha256','code_id','start','end','quote','source'} and a['id']==id,'Invalid QCA quotation');ids([id],1);ids([a['code_id']],1);text(a['document_name'],200);text(a['source'],100)
        require(a['document_id'] in bindings['documents'] and a['sha256']==bindings['documents'][a['document_id']]['sha256'],'QCA evidence belongs to a different source')
        text(a['quote'],500000);require(type(a['start']) is int and type(a['end']) is int and 0<=a['start']<a['end']<=500000 and a['end']-a['start']==len(a['quote']),'Invalid exact QCA quotation range')
    require(set(bindings['codes'])=={a['code_id'] for a in bindings['evidence'].values()},'Missing QCA evidence code')
    for id,c in bindings['codes'].items():
        require(isinstance(c,dict) and set(c)=={'id','name','path'} and c['id']==id,'Invalid QCA evidence code');text(c['name'],160);text(c['path'],400000)
    for c in run['design']['cases']:
        require(all(bindings['evidence'][id]['document_id'] in c['document_ids'] for cell in c['cells'].values() for id in cell['evidence_ids']),'QCA evidence is outside the mapped case')
    return run

def validate_state(state):
    require(isinstance(state,dict) and set(state)=={'format','revision','design','options','current','history'} and type(state['format']) is int and state['format']==1,'Invalid saved QCA state')
    require(type(state['revision']) is int and 0<state['revision']<=9_007_199_254_740_991,'Invalid QCA revision');validate_design(state['design']);require(qca.options(state['options'])==state['options'],'Invalid saved QCA options')
    require(state['current'] is None or isinstance(state['current'],dict),'Invalid current QCA run')
    require(isinstance(state['history'],list) and len(state['history'])<=HISTORY_LIMIT,'Too many QCA run versions')
    runs=state['history']+([state['current']] if state['current'] else [])
    for run in runs:validate_run(run);require(run['input_revision']<=state['revision'],'Invalid QCA run revision')
    require(len({run['id'] for run in runs})==len(runs),'Duplicate QCA run IDs')
    revisions=[run['input_revision'] for run in runs];require(revisions==sorted(set(revisions)),'QCA run versions are out of order')
    require(len(transcript.canonical(state).encode())<=MAX_BYTES,'QCA history exceeds 6 MB; export and use a smaller research design')
    return state

def is_stale(project,run=None):
    state=project.get('comparative_qca');run=run or (state or {}).get('current')
    return bool(run and (not state or run['source_version']!=source_version(project) or run['design']!=state['design'] or run['options']!=state['options']))

def context(project):
    state=project.get('comparative_qca')
    if state:validate_state(state)
    from .reporting import catalog
    return {'state':state,'blank':blank(),'source_version':source_version(project),'stale':is_stale(project),'catalog':catalog(project),'documents':[{'id':d['id'],'name':d['name']} for d in project['documents']],'history_limit':HISTORY_LIMIT,'limits':{'conditions':6,'cases':100,'solutions':qca.MAX_SOLUTIONS}}

def expected(project,body):
    state=project.get('comparative_qca');revision=state['revision'] if state else 0
    require(type(body.get('revision')) is int,'QCA revision is required')
    if body['revision']!=revision or body.get('source_version')!=source_version(project):raise QCAConflict('QCA calibration or source evidence changed in another tab. Keep your edits and reload before retrying.')
    return state,revision

def install(project,state,action):
    validate_state(state);candidate=copy.deepcopy(project);candidate['comparative_qca']=state;event(candidate,action,qca_revision=state['revision'],run_id=state['current']['id'] if state['current'] else None);validate_reading_capacity(candidate)
    project['comparative_qca']=state;project['audit']=candidate['audit'];return state

def save(project,body):
    old,revision=expected(project,body);design=copy.deepcopy(validate_design(body.get('design')));settings=qca.options(body.get('options'));bind(project,design)
    state={'format':1,'revision':revision+1,'design':design,'options':settings,'current':copy.deepcopy(old['current']) if old else None,'history':copy.deepcopy(old['history']) if old else []}
    return install(project,state,'qca_calibration_save')

def run(project,body,*,budget=qca.DEFAULT_BUDGET,cancel=None):
    old,revision=expected(project,body);require(old is not None,'Save calibration before running QCA');design=copy.deepcopy(validate_design(old['design'],complete=True));bindings=bind(project,design);matrix_=calibrated_matrix(design)
    result=qca.analyze(matrix_,old['options'],budget=budget,cancel=cancel)
    source=engine_source()
    frozen={'id':uid(),'input_revision':revision+1,'created_at':now(),'source_version':source_version(project),'design':design,'options':copy.deepcopy(old['options']),'matrix':matrix_,'bindings':bindings,'result':result,'engine_source':source,'environment':{'python':sys.version.split()[0],'implementation':platform.python_implementation(),'system':platform.system(),'engine_sha256':hashlib.sha256(source.encode()).hexdigest()}};frozen['content_hash']=digest(frozen)
    history=copy.deepcopy(old['history']+([old['current']] if old['current'] else []))
    if len(history)>HISTORY_LIMIT:history=history[:1]+history[-(HISTORY_LIMIT-1):]
    state={**copy.deepcopy(old),'revision':revision+1,'current':frozen,'history':history};return install(project,state,'qca_run')

def install_prepared(project,state,revision,stamp):
    expected(project,{'revision':revision,'source_version':stamp});return install(project,state,'qca_run')

def selected(project,run_id=None):
    state=project.get('comparative_qca');require(state and state['current'],'Save and run QCA before exporting')
    selected=next((r for r in [state['current']]+state['history'] if run_id is None or r['id']==run_id),None);require(selected is not None,'That saved QCA run is unavailable');validate_run(selected);return copy.deepcopy(selected)

def csv_bytes(rows):
    out=io.StringIO(newline='');writer=csv.writer(out);writer.writerows(rows);return out.getvalue().encode('utf-8-sig')

def export_files(run):
    validate_run(run);r=run['result'];d=run['design'];names=r['conditions']+[r['outcome']]
    matrix_csv=csv_bytes([['case_id','case_label',*names]]+[[c['id'],c['label'],*[c['cells'][name]['value'] for name in names]] for c in d['cases']])
    truth_csv=csv_bytes([['configuration',*r['conditions'],'n','positive','negative','consistency','label','mixed','case_ids','positive_case_ids','negative_case_ids']]+[[t['configuration'],*list(t['configuration']),t['n'],t['positive'],t['negative'],t['consistency'],t['label'],t['mixed'],';'.join(t['cases']),';'.join(t['positive_cases']),';'.join(t['negative_cases'])] for t in r['truth_table']])
    script="""# Reproduce this frozen QT QCA run. Python 3.10+, standard library only.
from pathlib import Path
import json
import qca_engine
folder=Path(__file__).resolve().parent
record=json.loads((folder/'qca-run.json').read_text(encoding='utf-8'))
result=qca_engine.analyze(record['matrix'],record['options'])
if result!=record['result']:raise RuntimeError('Reproduction differs from the frozen result')
(folder/'reproduced-result.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print('All QCA values, case IDs and configurations reproduce exactly.')
"""
    files={'qca-run.json':json.dumps(run,ensure_ascii=False,indent=2).encode(),'calibration.csv':matrix_csv,'truth-table.csv':truth_csv,'result.json':json.dumps(r,ensure_ascii=False,indent=2).encode(),'qca_engine.py':run['engine_source'].encode(),'reproduce.py':script.encode(),'README.txt':b'Binary crisp-set QCA; conservative minimisation without logical remainders. One to six conditions, one outcome, up to 100 cases. Run python reproduce.py in this directory. The script checks all computed values and identities. No third-party package is required. Calibration definitions, rationales, exact selected quotations, source hashes, thresholds and outcome direction are frozen in qca-run.json. Missing memberships never become zero. Minimum means minimum number of prime implicants; every equally minimal cover is included or the run fails at its resource limit. Dash omits a condition; ~ negates a set; * means AND; + means OR. Undefined ratios are JSON null / blank CSV cells, not zero. Necessary and sufficient set relations are not automatic causal conclusions. Coding counts and existing plots are unchanged. Files can contain interview quotations; keep private when using private data.\n'}
    if 'environment' in run:files['environment.json']=json.dumps(run['environment'],indent=2).encode()
    return files

def bundle_export(run):
    files=export_files(run);out=io.BytesIO()
    with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
        for name,payload in files.items():z.writestr(name,payload)
        z.writestr('MANIFEST.json',json.dumps({name:hashlib.sha256(payload).hexdigest() for name,payload in files.items()},indent=2))
    return out.getvalue()
