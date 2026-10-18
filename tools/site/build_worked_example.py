"""Publish Bologna-only outputs from the existing notebook/report exporters.

Run with the plotting dependencies installed. --prepare writes the frozen source;
--word exports the two Word documents from that source without invoking plotting.
The original /report manifest, SVGs and CSVs are never overwritten.
"""
from pathlib import Path
import argparse
import hashlib
import json
import subprocess
import sys
import zipfile
import io

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT))
from qualicraft import core, plotting, reporting, transcript, report_figures
from qualicraft.server import bologna_example
OUT=ROOT/'website/public/worked-example'


def write_json(path,value):
    path.write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')


def prepare():
    p=bologna_example();p['name']='Bologna worked example'
    d=next(d for d in p['documents'] if d['name']=='interview02.txt')
    draft=reporting.blank(p,'content')
    draft.update(title='Bologna coding evidence report',
        research_question='How are research materials described in this saved Bologna coding record?',
        case_unit='The corpus has 19 public interview documents. The short written example below reviews selected passages from interview02.txt.',
        analysis_unit='An existing quotation and its saved code path, read in the context of the full source document.',
        approach='Qualitative Content Analysis',
        method_notes='This is a worked software example using the original Bologna coding. No new coding or participant interpretation was generated. Table labels retain the saved ancestry. Method steps show the workflow; unchecked review stages remain unconfirmed.',
        reflexivity='The short illustrative narrative was prepared for the QT demonstration. It is not an independently validated analysis of this corpus.',
        quality_notes='Quoted characters and code identities were checked against the saved source. All five figures use the complete original 19-document coding record and their existing counting rules.',
        counterexamples='Only selected material-related passages are interpreted here. Contrasting perspectives across the other interviews require further contextual reading.',
        limitations='This small writing example does not establish a complete analysis or saturation. Counts describe saved coding activity rather than importance or prevalence among people.',
        disclosure='Public Bologna CC0 data only. No private interviews or model calls were used. Editing the downloaded Word documents does not change the QT project.')
    by={c['id']:c for c in p['codes']};chosen=[];seen=set()
    for a in p['annotations']:
        chain=[];node=by[a['code_id']]
        while node:
            chain.insert(0,node);node=by.get(node.get('parent_id'))
        if a['document_id']==d['id'] and len(chain)>=3 and chain[0]['name']=='materials' and chain[1]['id'] not in seen:
            chosen.append((a,chain));seen.add(chain[1]['id'])
        if len(chosen)==3:break
    assert chosen
    draft['rows']=[{'id':'example-row-'+str(i),'theme':chain[0]['name'],'category':' > '.join(c['name'] for c in chain[1:-1]),'code_ids':[a['code_id']],'evidence_ids':[a['id']],
        'interpretation':'The saved code distinguishes a form of research material in this passage. [E:'+a['id']+']'} for i,(a,chain) in enumerate(chosen,1)]
    draft['narrative']='The selected passages describe different forms of research material. Their saved paths place these distinctions inside the materials group. Read the exact quotations before judging how well each code fits. '+' '.join('[E:'+a['id']+']' for a,_ in chosen)+'\nThe five figures summarize all existing codings across the corpus. They support checking the record; they do not substitute for interpretation of the interviews.'
    draft['checks']['units']=True
    draft['figures']=[{'id':'example-'+kind,'options':{'kind':kind,'font':'DejaVu Sans'},'caption':label+' from the original saved coding record.'} for kind,label in [('frequency','Code frequency'),('coverage','Code by interview'),('cooccurrence','Code co-occurrence'),('hierarchy','Theme hierarchy'),('accumulation','Code accumulation')]]
    state=reporting.save(p,{'revision':0,'source_version':reporting.source_version(p),'draft':draft})
    core.validate_project(p)
    frozen=transcript.freeze(p,[d['id']],role_labels='theme-category-code')
    write_json(OUT/'project.json',p);write_json(OUT/'notebook-record.json',frozen)
    (OUT/'notebook.html').write_bytes(transcript.html_export(frozen))
    (OUT/'research-report.html').write_bytes(reporting.html_export(state['current'],assets=state['assets']))
    with zipfile.ZipFile(OUT/'figures-and-code.zip','w',zipfile.ZIP_DEFLATED) as z:
        for figure in state['current']['draft']['figures']:
            asset=state['assets'][state['current']['bindings']['figures'][figure['id']]['asset_id']]
            for name,payload in report_figures.files(asset).items():z.writestr(figure['options']['kind']+'/'+name,payload)
        z.writestr('README.txt','Bologna CC0. Each of five folders contains SVG, PDF, 300 dpi PNG, exact CSV and figure.py. Extract first; install matplotlib (scipy for optional clustering), then run python figure.py in the chosen folder. Font: DejaVu Sans. Counts are the existing saved coding record, not new analysis.\n')
    write_json(OUT/'scope.json',{'project':{'documents':len(p['documents']),'codes':len(p['codes']),'codings':len(p['annotations'])},'notebook':{'document':d['name'],'characters':len(d['text']),'codings':sum(a['document_id']==d['id'] for a in p['annotations']),'tree_labels':'Explicit display convention: root Theme, intermediate Category, leaf Code. Saved names and links are unchanged.'},'report':{'method':reporting.METHODS['content'],'selected_evidence':len(chosen),'status':'Illustrative writing from existing codes; not a newly validated research analysis.'}})


def word():
    p=json.loads((OUT/'project.json').read_text(encoding='utf-8'));state=p['research_report']
    frozen=json.loads((OUT/'notebook-record.json').read_text(encoding='utf-8'))
    (OUT/'notebook.docx').write_bytes(transcript.docx_export(frozen))
    (OUT/'research-report.docx').write_bytes(reporting.docx_export(state['current'],assets=state['assets']))
    (OUT/'research-report.zip').write_bytes(reporting.bundle_export(state['current'],state['assets']))
    # Core exporters are the authority; no website-specific document layout.
    manifest()


def manifest():
    files=[]
    for path in sorted(OUT.iterdir()):
        if path.is_file() and path.name!='manifest.json':files.append({'path':path.name,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
    write_json(OUT/'manifest.json',{'source':'demo-data/qualicraft.sqlite3','licence':'CC0','source_commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'working_tree_dirty':bool(subprocess.check_output(['git','status','--porcelain','--','tools/site/build_worked_example.py','qualicraft/plotting.py'],cwd=ROOT,text=True)),'source_files':{str(path.relative_to(ROOT)):hashlib.sha256(path.read_bytes()).hexdigest() for path in [Path(__file__),ROOT/'qualicraft/plotting.py',ROOT/'qualicraft/reporting.py',ROOT/'qualicraft/transcript.py']},'scope':json.loads((OUT/'scope.json').read_text(encoding='utf-8')),'files':files})


if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--prepare',action='store_true');ap.add_argument('--word',action='store_true');ap.add_argument('--manifest',action='store_true');args=ap.parse_args();OUT.mkdir(parents=True,exist_ok=True)
    if args.manifest:manifest()
    else:
        if args.prepare or not args.word:prepare()
        if args.word or not args.prepare:word()
    print('Bologna outputs written to',OUT)
