"""Method-specific report presentation of a frozen Comparative QCA run."""
import copy,io,re,zipfile
from xml.etree import ElementTree as ET
from . import transcript,report_figures,method_maps


def number(value):return 'undefined' if value is None else format(value,'.6g') if isinstance(value,float) else str(value)

def blocks(entry):
    from .reporting import citation_text
    draft=entry['draft'];run=entry['bindings']['qca'];design=run['design'];result=run['result'];labels={id:'E'+str(i) for i,id in enumerate(entry['bindings']['evidence'],1)}
    case_labels={c['id']:c['label'] for c in design['cases']}
    case_name=lambda id:case_labels[id]+(' ['+id+']' if list(case_labels.values()).count(case_labels[id])>1 else '')
    cases=lambda ids:'; '.join(case_name(id) for id in ids) or 'None'
    b=[]
    def add(kind,*values):b.append((kind,*values))
    def authored(key,title):
        if draft[key]:add('h2',title);add('p',citation_text(entry,draft[key]))
    add('h1','Research design');add('h2','Research question');add('p',draft['research_question'] or design['question']);add('h2','Case definition');add('p',draft['case_unit'] or design['case_unit'])
    add('method')
    add('p','Binary crisp-set QCA. Outcome '+result['outcome']+' = '+str(result['target'])+' is analysed. Conservative minimisation uses only eligible positive configurations; no logical remainders.')
    add('meta','Frequency cutoff '+str(result['options']['n_cut'])+' · positive consistency cutoff '+str(result['options']['ic1'])+' · negative cutoff '+str(result['options']['ic0'])+'. Minimum means the fewest prime implicants. All equally minimal covers are included. Displayed ratios use six significant figures; full values are in the JSON / reproducible ZIP.')
    add('h1','Findings');add('h2','Configuration solutions')
    for message in result['warnings']:add('p',message)
    if not result['solutions']:add('p','No eligible configuration solution at these thresholds.')
    for i,s in enumerate(result['solutions'],1):
        add('h3','Solution '+str(i)+' · '+s['expression']);add('meta','Consistency '+number(s['consistency'])+' · coverage '+number(s['coverage']))
        rows=[]
        for term in s['terms']:
            p=next(p for p in result['prime_implicants'] if p['cube']==term)
            rows.append([p['expression'],number(p['consistency']),number(p['raw_coverage']),number(s['unique_coverage'][term])])
        add('table',['Path','Consistency','Raw coverage','Unique coverage'],rows)
        add('p','Covered cases: '+cases(s['cases']));add('p','Counterexample cases: '+cases(s['negative_cases']))
    add('meta','~ means set absence; * means AND; + means OR. A dash omits that condition. Solution coverage is computed on the union of covered cases, not the sum of path coverages. Set relations alone do not establish causal claims.')
    add('h2','Necessity checks');add('table',['Literal','Consistency','Coverage'],[[n['literal'],number(n['consistency']),number(n['coverage'])] for n in result['necessity']])
    for n in result['necessity']:
        if n['counterexample_cases']:add('meta',n['literal']+' · outcome cases outside this set: '+cases(n['counterexample_cases']))
    add('h2','Narrative Analysis');add('p',citation_text(entry,draft['narrative']) or 'Not yet written.')
    add('h1','Calibration');add('p','Saved calibration research question: '+design['question']);add('p','Saved case unit: '+design['case_unit'])
    for definition in design['conditions']+[design['outcome']]:
        add('h2',definition['id']+' · '+definition['label']);add('p',definition['definition']);add('p','0 — '+definition['zero_rule']);add('p','1 — '+definition['one_rule']);add('meta','Calibration basis: '+definition['basis'])
    names=result['conditions']+[result['outcome']];add('h2','Case memberships');add('table',['Case',*names],[[case_name(c['id']),*[str(c['cells'][name]['value']) for name in names]] for c in design['cases']])
    for c in design['cases']:
        add('h3',case_name(c['id']));add('meta','Case ID '+c['id']+'\nMapped sources: '+'; '.join(run['bindings']['documents'][id]['name']+' ['+id+']' for id in c['document_ids']))
        for name in names:
            cell=c['cells'][name];add('p',name+' = '+str(cell['value'])+' · '+cell['rationale']);add('meta','Selected evidence: '+(', '.join(labels[id] for id in cell['evidence_ids']) or 'None selected; rationale retained'))
    add('h1','Truth table');add('p','All '+str(2**len(result['conditions']))+' condition configurations are retained. ? means below the frequency cutoff, C means the intermediate consistency interval. Mixed outcomes are an independent observed-data flag, even when the threshold label is 0 or 1.')
    add('table',['Configuration','n','Positive','Negative','Consistency','Label','Mixed'],[[t['configuration'],str(t['n']),str(t['positive']),str(t['negative']),number(t['consistency']),t['label'],'yes' if t['mixed'] else 'no'] for t in result['truth_table']])
    for t in result['truth_table']:
        if t['cases']:add('meta',t['configuration']+' · cases: '+cases(t['cases'])+' · outcome counterexamples: '+cases(t['negative_cases']))
    if any(draft[k] for k in ['counterexamples','limitations','reflexivity','quality_notes','disclosure']):
        add('h1','Review and limitations')
        for key,title in [('counterexamples','Counterexamples and variation'),('limitations','Limitations'),('reflexivity','Reflexivity'),('quality_notes','Quality and review'),('disclosure','Research and assistance disclosure')]:authored(key,title)
    add('h1','Evidence appendix')
    if not entry['bindings']['evidence']:add('p','No quotations selected; calibration rationales are retained above.')
    for id,a in entry['bindings']['evidence'].items():
        add('h2',labels[id]+' · '+a['document_name']);add('quote',a['quote']);add('meta','['+str(a['start'])+', '+str(a['end'])+') · '+entry['bindings']['codes'][a['code_id']]['path'])
    add('h1','Review record');add('meta','Report '+entry['id']+' · version '+str(entry['revision'])+'\nQCA run '+run['id']+' · input revision '+str(run['input_revision'])+'\nRun SHA256 '+run['content_hash']+'\nSource SHA256 '+run['source_version'])
    for key,value in draft['checks'].items():add('meta',key.replace('-',' ').capitalize()+' · '+('confirmed by researcher' if value else 'not confirmed'))
    add('meta','Frozen computed results remain distinct from authored interpretation. Word edits stay in Word. The report ZIP includes calibrated data, all case IDs, truth table, results and the exact standalone QCA code. Fuzzy / multi-value sets, PRI filters and parsimonious / intermediate minimisation are outside this binary conservative implementation.')
    return b


def html_export(entry,stale=False,assets=None):
    from .reporting import METHODS,citation_text
    esc=transcript.escaped;body=[]
    for kind,*values in blocks(entry):
        if kind=='method':body.append(method_maps.block_html(entry,lambda value:'<p>'+esc(citation_text(entry,value)).replace('\n','<br>')+'</p>'))
        elif kind=='table':
            headers,rows=values;body.append('<div class="table-wrap" tabindex="0" role="region" aria-label="'+esc(headers[0])+' table"><table><thead><tr>'+''.join('<th scope="col">'+esc(h)+'</th>' for h in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+esc(v)+'</td>' for v in row)+'</tr>' for row in rows)+'</tbody></table></div>')
        else:
            tag={'h1':'h2','h2':'h3','h3':'h4','p':'p','meta':'p','quote':'blockquote'}[kind];text=esc(values[0]);cls=' class="meta"' if kind=='meta' else '';body.append('<'+tag+cls+'>'+text.replace('\n','<br>')+'</'+tag+'>')
    figures=report_figures.html(entry,assets)
    return ('''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'"><title>'''+esc(entry['draft']['title'])+'''</title><style>'''+method_maps.CSS+'''body{max-width:850px;margin:auto;padding:40px 22px;color:#202a36;background:white;font:18px/1.7 Georgia,serif}h1,h2,h3,h4{font-family:system-ui,sans-serif;color:#000;line-height:1.3}h1{font-size:34px}h2{font-size:28px;margin-top:52px}h3{font-size:22px;margin-top:30px}h4{font-size:18px}p,td,th{overflow-wrap:anywhere}.meta{font:13px/1.7 system-ui;color:#526171;white-space:normal}.table-wrap{overflow-x:auto;max-width:100%;margin:24px 0;outline-offset:3px}.table-wrap:focus-visible{outline:2px solid #263746}table{width:100%;border-collapse:collapse;font-size:15px}th{background:#263746;color:white;font-family:system-ui}td,th{text-align:left;vertical-align:top;border:1px solid #d9d9d9;padding:10px}blockquote{font-style:italic;white-space:pre-wrap;margin:22px}figure{margin:36px 0}figure img{display:block;max-width:100%;height:auto}pre{white-space:pre-wrap;overflow-wrap:anywhere}a{color:#30465e}@media(max-width:500px){body{font-size:17px;padding:24px 18px}h1{font-size:28px}table{min-width:490px}h2{font-size:24px}}@media print{h2{break-before:page}h2,h3,h4{break-after:avoid}thead{display:table-header-group}.table-wrap{overflow:visible}figure{break-before:page}figure img{max-height:210mm;object-fit:contain}}</style><header><h1>'''+esc(entry['draft']['title'])+'</h1><p>'+METHODS['comparative']+'</p><p class="meta">Saved report version '+str(entry['revision'])+' · '+esc(entry['saved_at'][:10])+(' · Saved source or calibration has changed; this report retains its frozen run.' if stale else ' · Frozen QCA result and researcher writing.')+'</p></header><main>'+''.join(body)+figures+'</main></html>').encode()


def docx_export(entry,stale=False,assets=None):
    from . import reporting
    # Reuse the established native package, styles, figure placement and OPC
    # compatibility. Only its generic body is replaced by QCA-specific chapters.
    base=copy.deepcopy(entry);base['draft']['method']='content'
    with zipfile.ZipFile(io.BytesIO(reporting.docx_export(base,stale,assets))) as z:files={n:z.read(n) for n in z.namelist()}
    W=transcript.W;tag=transcript.word_tag;run=transcript.word_run;root=ET.fromstring(files['word/document.xml']);body=root.find('{'+W+'}body');section=copy.deepcopy(body.find('{'+W+'}sectPr'))
    # Retain the already checked inline original figures and editable captions.
    def chapter(node,title):
        style=node.find('{'+W+'}pPr/{'+W+'}pStyle')
        return node.tag=='{'+W+'}p' and style is not None and style.get('{'+W+'}val')=='Heading1' and transcript.word_plain(node)==title
    source=list(body);start=next((i for i,n in enumerate(source) if chapter(n,'Figures')),None);end=next((i for i,n in enumerate(source) if chapter(n,'Evidence appendix')),None)
    figures=[copy.deepcopy(n) for n in source[start:end]] if start is not None else []
    body.clear()
    def p(value,style,page=False):
        para=tag(body,'p');pp=tag(para,'pPr');tag(pp,'pStyle',{'val':style})
        if page:tag(pp,'pageBreakBefore')
        run(para,value)
    p(entry['draft']['title'],'Title');p(reporting.METHODS['comparative'],'Subtitle');p('Saved version '+str(entry['revision'])+' · '+entry['saved_at'][:10],'Meta')
    if stale:p('Saved source or calibration changed. This report retains its frozen QCA run.','Meta')
    first=True
    for kind,*values in blocks(entry):
        if kind=='method':method_maps.word_block(body,entry)
        elif kind=='table':
            headers,rows=values;table=tag(body,'tbl');pr=tag(table,'tblPr');tag(pr,'tblW',{'w':10260,'type':'dxa'});tag(pr,'tblLayout',{'type':'fixed'});margins=tag(pr,'tblCellMar')
            for side in ['top','bottom','left','right']:tag(margins,side,{'w':110,'type':'dxa'})
            borders=tag(pr,'tblBorders')
            for side in ['top','bottom','left','right','insideH','insideV']:tag(borders,side,{'val':'single','sz':4,'color':'D9D9D9'})
            weights=([4]+[1]*(len(headers)-1)) if headers[0]=='Case' else [2,1,1,1] if headers[0]=='Path' else [2,1,1] if headers[0]=='Literal' else [2,1,1,1,2,1,1]
            widths=[int(10260*w/sum(weights)) for w in weights];widths[-1]+=10260-sum(widths);grid=tag(table,'tblGrid')
            for width in widths:tag(grid,'gridCol',{'w':width})
            for i,row in enumerate([headers]+rows):
                tr=tag(table,'tr');trp=tag(tr,'trPr')
                if i==0:tag(trp,'tblHeader')
                if sum(map(len,row))<=350:tag(trp,'cantSplit')
                for column,(width,value) in enumerate(zip(widths,row)):
                    cell=tag(tr,'tc');cp=tag(cell,'tcPr');tag(cp,'tcW',{'w':width,'type':'dxa'});tag(cp,'shd',{'val':'clear','fill':'263746' if i==0 else 'FFFFFF' if i%2 else 'F6F7F8'})
                    tag(cp,'vAlign',{'val':'center'});para=tag(cell,'p');pp=tag(para,'pPr');tag(pp,'spacing',{'before':0,'after':0,'line':270,'lineRule':'auto'});tag(pp,'jc',{'val':'center' if column else 'left'});run(para,value,size=19,bold=i==0,color='FFFFFF' if i==0 else '000000',font='Calibri' if i==0 else 'Georgia')
            p('','Meta')
        else:
            if kind=='h1' and values[0]=='Evidence appendix' and figures:
                for node in figures:body.append(node)
            p(values[0],{'h1':'Heading1','h2':'Heading2','h3':'Heading3','meta':'Meta','p':'Normal','quote':'EvidenceQuote'}[kind],page=kind=='h1' and not first)
            if kind=='h1':first=False
    body.append(section);files['word/document.xml']=ET.tostring(root,encoding='utf-8',xml_declaration=True).replace(b'\r',b'&#13;')
    files['customXml/item1.xml']=('<report>'+transcript.escaped(transcript.canonical(entry))+'</report>').encode()
    output=io.BytesIO()
    with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as z:
        for name,payload in files.items():z.writestr(name,payload)
    return transcript.word_footer(output.getvalue(),'QT Comparative QCA report')
