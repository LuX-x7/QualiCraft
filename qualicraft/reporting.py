"""Researcher-authored reports bound to saved coding evidence, never inferred analysis."""
from __future__ import annotations
import copy
import hashlib
import io
import json
import re
import zipfile
from xml.etree import ElementTree as ET
from . import transcript, report_figures
from .core import require, uid, now, event, code_path, validate_span, validate_reading_capacity

METHODS = {'ta':'Thematic Analysis', 'content':'Qualitative Content Analysis'}
HISTORY_LIMIT = 10
MAX_BYTES = 1_500_000
TEXT_FIELDS = {'title':200, 'research_question':4000, 'case_unit':2000, 'analysis_unit':2000,
               'approach':4000, 'method_notes':20000, 'reflexivity':20000, 'quality_notes':20000,
               'narrative':100000, 'counterexamples':20000, 'limitations':20000, 'disclosure':10000}
CHECKS = {'ta':['familiarisation','coding','theme-development','theme-review','reflexivity','writing'],
          'content':['units','coding-rules','category-development','category-review','context','writing']}


class ReportConflict(ValueError):
    pass


def digest(value):
    return hashlib.sha256(transcript.canonical(value).encode()).hexdigest()


def source_version(project):
    # Stable across a JSON restore to a new project ID and reading-only edits.
    return digest({'documents':[{k:d[k] for k in ('id','name','text')} for d in project['documents']],
        'codes':[{**{k:c.get(k) for k in ('id','name','parent_id','definition','memo','inclusion','exclusion','status')},
                  **({'research_role':c['research_role']} if 'research_role' in c else {})} for c in project['codes']],
        'annotations':project['annotations']})


def text(value, limit):
    require(isinstance(value,str) and len(value)<=limit and not re.search(r'[\x00-\x08\x0b\x0c\x0e-\x1f\ud800-\udfff\ufffe\uffff]',value), 'Report text is invalid or too long')
    return value


def ids(values, limit):
    require(isinstance(values,list) and len(values)<=limit and all(isinstance(v,str) and re.fullmatch(r'[a-zA-Z0-9_-]{1,100}',v) for v in values) and len(set(values))==len(values), 'Report references are invalid')
    return values


def validate_draft(draft):
    require(isinstance(draft,dict) and set(draft) in (set(TEXT_FIELDS)|{'method','rows','checks'},set(TEXT_FIELDS)|{'method','rows','checks','figures'}), 'The report draft format is invalid')
    require(isinstance(draft['method'],str) and draft['method'] in METHODS, 'This report method is unavailable')
    for key,limit in TEXT_FIELDS.items():text(draft[key],limit)
    require(draft['title'].strip(), 'Give the report a title')
    require(isinstance(draft['checks'],dict) and set(draft['checks'])==set(CHECKS[draft['method']]) and all(type(v) is bool for v in draft['checks'].values()), 'The method review state is invalid')
    rows=draft['rows'];require(isinstance(rows,list) and len(rows)<=2000,'A report supports up to 2000 table rows')
    ids([r.get('id') for r in rows if isinstance(r,dict)],2000)
    for row in rows:
        require(isinstance(row,dict) and set(row)=={'id','theme','category','code_ids','interpretation','evidence_ids'},'The analysis row format is invalid')
        for key,limit in [('theme',1000),('category',1000),('interpretation',10000)]:text(row[key],limit)
        ids(row['code_ids'],20);ids(row['evidence_ids'],100)
    figures=draft.get('figures',[])
    require(isinstance(figures,list) and len(figures)<=report_figures.MAX_FIGURES,'A report supports up to five frozen figures')
    ids([f.get('id') for f in figures if isinstance(f,dict)],report_figures.MAX_FIGURES)
    for figure in figures:
        require(isinstance(figure,dict) and set(figure)=={'id','options','caption'},'The report figure format is invalid')
        text(figure['caption'],4000);report_figures.options(figure['options'])
    return draft


def validate_entry(entry):
    require(isinstance(entry,dict) and set(entry)=={'id','revision','saved_at','source_version','draft','bindings','restored_from','content_hash'},'The report version format is invalid')
    ids([entry['id']],1);require(type(entry['revision']) is int and 0<entry['revision']<=9_007_199_254_740_991,'The report revision is invalid')
    text(entry['saved_at'],100);require(isinstance(entry['source_version'],str) and re.fullmatch(r'[0-9a-f]{64}',entry['source_version']) is not None,'The report source version is invalid')
    if entry['restored_from'] is not None:ids([entry['restored_from']],1)
    validate_draft(entry['draft'])
    bindings=entry['bindings'];require(isinstance(bindings,dict) and set(bindings) in ({'codes','evidence'},{'codes','evidence','figures'}),'The report bindings are invalid')
    require(all(isinstance(bindings[k],dict) for k in bindings),'The report bindings are invalid')
    require(len(bindings['codes'])<=2000 and len(bindings['evidence'])<=200,'Too much report evidence')
    for id,c in bindings['codes'].items():
        ids([id],1);require(isinstance(c,dict) and set(c)=={'id','name','path'} and c['id']==id,'The report code reference is invalid')
        text(c['name'],160);text(c['path'],400000)
    for id,a in bindings['evidence'].items():
        require(isinstance(a,dict) and set(a)=={'id','document_id','document_name','sha256','code_id','start','end','quote','source'},'The report quotation reference is invalid')
        ids([id],1);require(id==a['id'],'The report quotation ID is invalid');ids([a['document_id']],1);ids([a['code_id']],1)
        text(a['document_name'],200);text(a['quote'],500000);text(a['source'],100)
        require(type(a['start']) is int and type(a['end']) is int and 0<=a['start']<a['end']<=500000 and a['end']-a['start']==len(a['quote']),'The frozen quotation range is invalid')
        require(isinstance(a['sha256'],str) and re.fullmatch('[0-9a-f]{64}',a['sha256']),'The frozen document SHA is invalid')
    figures=bindings.get('figures',{})
    require(set(figures)=={f['id'] for f in entry['draft'].get('figures',[])},'A report figure reference is missing')
    for ref in figures.values():
        require(isinstance(ref,dict) and set(ref)=={'asset_id','source_version'} and all(isinstance(v,str) and re.fullmatch(r'[0-9a-f]{64}',v) for v in ref.values()),'The frozen figure reference is invalid')
        require(ref['source_version']==entry['source_version'],'A figure belongs to different coding evidence')
    for row in entry['draft']['rows']:

        require(set(row['code_ids'])<=set(bindings['codes']) and set(row['evidence_ids'])<=set(bindings['evidence']),'A report reference is missing')
        require(all(bindings['evidence'][id]['code_id'] in row['code_ids'] for id in row['evidence_ids']),'A quotation does not belong to the selected code')
    citations=re.findall(r'\[E:([a-zA-Z0-9_-]+)\]', '\n'.join(entry['draft'][k] for k in TEXT_FIELDS)+'\n'+'\n'.join(row['interpretation'] for row in entry['draft']['rows']))
    require(set(citations)<=set(bindings['evidence']), 'A narrative citation has no selected evidence')
    require(entry['content_hash']==digest({k:v for k,v in entry.items() if k!='content_hash'}),'Report integrity validation failed')
    require(len(transcript.canonical(entry).encode())<=MAX_BYTES,'The report exceeds 1.5 MB; reduce selected quotations or text')


def validate_state(state):
    require(isinstance(state,dict) and set(state) in ({'format','revision','current','history'},{'format','revision','current','history','assets'}) and state['format']==1 and type(state['format']) is int,'The saved report format is invalid')
    validate_entry(state['current'])
    require(type(state['revision']) is int and state['revision']==state['current']['revision'],'The report revision is inconsistent')
    require(isinstance(state['history'],list) and len(state['history'])<=HISTORY_LIMIT,'Too many report versions')
    for e in state['history']:validate_entry(e)
    entries=state['history']+[state['current']];require(len({e['id'] for e in entries})==len(entries),'Duplicate report version IDs')
    revisions=[e['revision'] for e in entries];require(revisions==sorted(set(revisions)),'Report versions are out of order')
    require(all(e['revision']<state['revision'] for e in state['history']),'The report history revision is invalid')
    assets=state.get('assets',{});require(isinstance(assets,dict) and len(assets)<=55,'The figure asset pool is invalid')
    needed=set().union(*(report_figures.referenced(e) for e in entries))
    require(set(assets)==needed,'Frozen report figures are missing or unreferenced')
    for id,asset in assets.items():
        require(id==report_figures.identity(asset),'A frozen figure identity is invalid');report_figures.validate(asset)
    for e in entries:
        for f in e['draft'].get('figures',[]):
            ref=e['bindings']['figures'][f['id']]
            require(report_figures.options(f['options'])==assets[ref['asset_id']]['options'],'Figure parameters do not match the saved asset')
    return state


def catalog(project):
    docs={d['id']:d for d in project['documents']}
    codes={c['id']:{'id':c['id'],'name':c['name'],'path':code_path(project['codes'],c)} for c in project['codes']}
    evidence={}
    for a in project['annotations']:
        d=docs[a['document_id']];validate_span(d,a['start'],a['end'],a['quote'])
        evidence[a['id']]={k:a[k] for k in ('id','document_id','code_id','start','end','quote','source')}
        evidence[a['id']].update(document_name=d['name'],sha256=hashlib.sha256(d['text'].encode()).hexdigest())
    return {'codes':codes,'evidence':evidence}


def context(project):
    state=project.get('research_report');stamp=source_version(project)
    if state:validate_state(state)
    return {'state':state,'source_version':stamp,'stale':bool(state and state['current']['source_version']!=stamp),
            'figure_previews':{f['id']:'data:image/png;base64,'+report_figures.base64.b64encode(report_figures.files(state['assets'][state['current']['bindings']['figures'][f['id']]['asset_id']])[f['options']['name']+'.png']).decode('ascii') for f in state['current']['draft'].get('figures',[])} if state else {},
            'catalog':catalog(project),'methods':METHODS,'checks':CHECKS,'history_limit':HISTORY_LIMIT}


def blank(project, method):
    require(method in METHODS,'This report method is unavailable')
    return {**{k:'' for k in TEXT_FIELDS},'title':project['name']+' analysis','method':method,
            'rows':[],'checks':{k:False for k in CHECKS[method]}}


def save(project, body, restore=False):
    old=project.get('research_report');revision=old['revision'] if old else 0
    require(type(body.get('revision')) is int,'The report revision is required')
    if body['revision']!=revision:raise ReportConflict('The report changed in another tab. Keep your text and reload the saved version before retrying.')
    assets=copy.deepcopy(old.get('assets',{})) if old else {}
    if restore:
        target=next((e for e in old['history'] if e['id']==body.get('version_id')),None) if old else None
        require(target is not None,'That report version is unavailable')
        entry=copy.deepcopy(target);entry['restored_from']=target['id']
    else:
        draft=copy.deepcopy(validate_draft(body.get('draft')))
        current_stamp=source_version(project)
        refresh=body.get('refresh_evidence',False);require(type(refresh) is bool,'Evidence refresh choice is invalid')
        if not old or refresh:
            if body.get('source_version')!=current_stamp:raise ReportConflict('Coding evidence changed. Reload the evidence catalogue before refreshing.')
            bindings=catalog(project);stamp=current_stamp
        else:
            bindings=old['current']['bindings'];stamp=old['current']['source_version']
            # New references can be added from current evidence while the saved
            # evidence is still current. Stale reports keep their frozen quotes.
            if stamp==current_stamp:bindings=catalog(project)
        chosen_codes={id for row in draft['rows'] for id in row['code_ids']};chosen_evidence={id for row in draft['rows'] for id in row['evidence_ids']}
        require(chosen_codes<=set(bindings['codes']) and chosen_evidence<=set(bindings['evidence']), 'A reference is missing. Refresh evidence explicitly or remove the unavailable reference.')
        entry={'draft':draft,'source_version':stamp,'bindings':{key:{id:copy.deepcopy(bindings[key][id]) for id in sorted(selected)} for key,selected in [('codes',chosen_codes),('evidence',chosen_evidence)]},'restored_from':None}
        figures={};old_figures={f['id']:f for f in old['current']['draft'].get('figures',[])} if old else {}
        for f in draft.get('figures',[]):
            f['options']=report_figures.options(f['options']);previous=old_figures.get(f['id']);old_ref=old['current']['bindings'].get('figures',{}).get(f['id']) if old else None
            if old_ref and not refresh and report_figures.options(previous['options'])==f['options']:
                ref=copy.deepcopy(old_ref)
            else:
                require(stamp==current_stamp,'Refresh evidence explicitly before adding or changing a figure in a stale report')
                asset_id,asset=report_figures.freeze(project,f['options']);assets[asset_id]=asset
                ref={'asset_id':asset_id,'source_version':stamp}
            figures[f['id']]=ref
        if 'figures' in draft:entry['bindings']['figures']=figures
    entry.update(id=uid(),revision=revision+1,saved_at=now())
    entry['content_hash']=digest({k:v for k,v in entry.items() if k!='content_hash'})
    validate_entry(entry)
    history=copy.deepcopy(old['history']+[old['current']]) if old else []
    if len(history)>HISTORY_LIMIT:history=history[:1]+history[-(HISTORY_LIMIT-1):]
    new={'format':1,'revision':revision+1,'current':entry,'history':history}
    needed=set().union(*(report_figures.referenced(e) for e in history+[entry]))
    if needed:new['assets']={id:assets[id] for id in sorted(needed)}
    validate_state(new)
    # Validate capacity on a copy before audit or project state can change.
    candidate=copy.deepcopy(project);candidate['research_report']=new;event(candidate,'report_restore' if restore else 'report_save',report_id=entry['id'],revision=entry['revision'],restored_from=entry['restored_from'])
    validate_reading_capacity(candidate)
    project['research_report']=new;project['audit']=candidate['audit']
    return new


def install_prepared(project,state,expected_revision,expected_source):
    """Commit a render prepared without holding SQLite's writer lock."""
    revision=project.get('research_report',{}).get('revision',0)
    if revision!=expected_revision or source_version(project)!=expected_source:
        raise ReportConflict('The report or coding evidence changed while figures were generated. Keep your writing and reload before saving again.')
    validate_state(state)
    candidate=copy.deepcopy(project);candidate['research_report']=state;entry=state['current']
    event(candidate,'report_save',report_id=entry['id'],revision=entry['revision'],restored_from=entry['restored_from'])
    validate_reading_capacity(candidate)
    project['research_report']=state;project['audit']=candidate['audit']
    return state


def selected(project, version_id=None):
    state=project.get('research_report');require(state is not None,'Save a report before exporting');validate_state(state)
    entry=next((e for e in [state['current']]+state['history'] if version_id is None or e['id']==version_id),None)
    require(entry is not None,'That report version is unavailable')
    return copy.deepcopy(entry),entry['source_version']!=source_version(project)


def citation_text(entry, value):
    labels={id:'E'+str(i) for i,id in enumerate(entry['bindings']['evidence'],1)}
    return re.sub(r'\[E:([a-zA-Z0-9_-]+)\]',lambda m:'['+labels.get(m[1],m[1])+']',value)


def html_export(entry, stale=False, assets=None):
    assets=report_figures.selected_assets(entry,assets or {})
    esc=transcript.escaped;d=entry['draft'];b=entry['bindings']
    labels={id:'E'+str(i) for i,id in enumerate(b['evidence'],1)}
    def prose(s):return '<p>'+esc(citation_text(entry,s)).replace('\n','<br>')+'</p>' if s else '<p class="muted">Not yet written.</p>'
    rows=''.join('<tr><td>'+esc(r['theme'])+'</td><td>'+esc(r['category'])+'</td><td>'+ '<br>'.join(esc(b['codes'][id]['name']) for id in r['code_ids'])+'</td></tr>' for r in d['rows'])
    sections=''.join(f'<section><h2>{title}</h2>{prose(d[key])}</section>' for key,title in [('research_question','Research question'),('case_unit','Case definition'),('analysis_unit','Analysis unit'),('approach','Analytic approach'),('method_notes','Method and decisions')])
    interpretations=''.join(f'<h3>Row {i}</h3>{prose(r["interpretation"])}<p class="meta">'+esc(' · '.join(labels[id] for id in r['evidence_ids']))+'</p>' for i,r in enumerate(d['rows'],1) if r['interpretation'] or r['evidence_ids'])
    evidence=''.join(f'<section id="e-{esc(id)}"><h3>{labels[id]}</h3><blockquote>{esc(a["quote"])}</blockquote><p class="meta">{esc(a["document_name"])} · [{a["start"]}, {a["end"]})<br>Annotation {esc(id)} · Code {esc(a["code_id"])}<br>Document {esc(a["document_id"])} · SHA256 {a["sha256"]}<br>Saved source {esc(a["source"])}</p></section>' for id,a in b['evidence'].items())
    tail=''.join(f'<section><h2>{title}</h2>{prose(d[key])}</section>' for key,title in [('reflexivity','Reflexivity'),('quality_notes','Quality and review'),('counterexamples','Counterexamples and variation'),('limitations','Limitations'),('disclosure','Research and assistance disclosure')])
    return f'''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'"><title>{esc(d['title'])}</title><style>body{{max-width:900px;margin:auto;padding:32px 22px;background:#fbfaf7;color:#202a36;font:18px/1.7 Georgia,serif}}h1,h2,h3{{color:#000}}table{{border-collapse:collapse;width:100%;font-size:16px}}td,th{{text-align:left;vertical-align:top;padding:12px;border:1px solid #d9d9d9;overflow-wrap:anywhere}}th{{background:#eee}}.meta,.muted{{font:13px/1.6 system-ui;overflow-wrap:anywhere;color:#526171}}blockquote{{margin:16px 0;padding-left:20px;border-left:2px solid #8194a5;white-space:pre-wrap}}section{{margin:28px 0}}@media print{{body{{background:white;max-width:none}}thead{{display:table-header-group}}}}</style><h1>{esc(d['title'])}</h1><p>{METHODS[d['method']]}</p><p class="meta">Researcher-edited draft · version {entry['revision']} · {esc(entry['saved_at'])}<br>{'Evidence changed since this report was saved. Frozen quotations are retained.' if stale else 'Evidence matches the current coding record.'}</p>{sections}<h2>Analysis Table — Themes Categories and Codes</h2><table><thead><tr><th>Themes</th><th>Categories</th><th>Codes</th></tr></thead><tbody>{rows}</tbody></table><h2>Narrative Analysis</h2>{prose(d['narrative'])}{interpretations}{tail}{report_figures.html(entry,assets)}<h2>Selected evidence</h2>{evidence or '<p>No quotations selected.</p>'}<h2>Review checklist</h2>{prose(chr(10).join(k+': '+('confirmed by researcher' if v else 'not confirmed') for k,v in d['checks'].items()))}<p class="meta">Report {entry['id']} · Content SHA256 {entry['content_hash']}<br>Evidence SHA256 {entry['source_version']}<br>Report text and table labels are authored interpretations; saved quotation records remain separate. External edits do not update QT.</p></html>'''.encode()


def docx_export(entry, stale=False, assets=None):
    assets=report_figures.selected_assets(entry,assets or {})
    # Reuse the established standalone OOXML package, replacing only its body.
    frozen={'project_name':'','documents':[],'association_count':0,'range_count':0,'include_memos':False,'project_id':'report','schema_version':5,'version':entry['source_version'],'generated_at':entry['saved_at']}
    with zipfile.ZipFile(io.BytesIO(transcript.docx_export(frozen))) as z:files={n:z.read(n) for n in z.namelist()}
    root=ET.fromstring(files['word/document.xml']);W=transcript.W;tag=transcript.word_tag;run=transcript.word_run;body=root.find('{'+W+'}body');section=copy.deepcopy(body.find('{'+W+'}sectPr'));body.clear()
    def p(s,style='Normal',size=None):
        para=tag(body,'p');pp=tag(para,'pPr');tag(pp,'pStyle',{'val':style})
        run(para,s,size=size);return para
    def prose(value):
        return [p(paragraph) for paragraph in (citation_text(entry,value) or 'Not yet written.').split('\n\n')]
    d=entry['draft'];b=entry['bindings'];p(d['title'],'Title');p(METHODS[d['method']],'Subtitle')
    p(f"Researcher-edited draft · version {entry['revision']} · {entry['saved_at']}",'Meta')
    p('Evidence changed; frozen quotations are retained.' if stale else 'Evidence matches the current coding record.','Meta')
    p('Research design','Heading1')
    for key,title in [('research_question','Research question'),('case_unit','Case definition'),('analysis_unit','Analysis unit'),('approach','Analytic approach'),('method_notes','Method and decisions')]:p(title,'Heading2');prose(d[key])
    p('Analysis Table','Heading1');p('Themes Categories and Codes','Meta')
    table=tag(body,'tbl');pr=tag(table,'tblPr');tag(pr,'tblW',{'w':10260,'type':'dxa'});tag(pr,'tblLayout',{'type':'fixed'});borders=tag(pr,'tblBorders')
    for side in ['top','left','bottom','right','insideH','insideV']:tag(borders,side,{'val':'single','sz':4,'color':'D9D9D9'})
    margins=tag(pr,'tblCellMar')
    for side in ['top','left','bottom','right']:tag(margins,side,{'w':130,'type':'dxa'})
    grid=tag(table,'tblGrid')
    for width in [3000,3000,4260]:tag(grid,'gridCol',{'w':width})
    for i,values in enumerate([['Themes','Categories','Codes']]+[[r['theme'],r['category'],'\n'.join(b['codes'][id]['name'] for id in r['code_ids'])] for r in d['rows']]):
        row=tag(table,'tr')
        row_props=tag(row,'trPr')
        if i==0:tag(row_props,'tblHeader')
        if sum(len(v) for v in values)<=400:tag(row_props,'cantSplit')
        for width,value in zip([3000,3000,4260],values):
            cell=tag(row,'tc');cp=tag(cell,'tcPr');tag(cp,'tcW',{'w':width,'type':'dxa'})
            if i==0:tag(cp,'shd',{'fill':'EEEEEE','val':'clear'})
            para=tag(cell,'p')
            if i==0:tag(tag(para,'pPr'),'keepNext')
            run(para,value,size=21,bold=i==0,font='Calibri' if i==0 else 'Georgia')
    labels={id:'E'+str(i) for i,id in enumerate(b['evidence'],1)}
    p('Narrative Analysis','Heading1');prose(d['narrative'])
    for i,r in enumerate(d['rows'],1):
        if r['interpretation'] or r['evidence_ids']:
            p('Row '+str(i),'Heading2');paragraphs=prose(r['interpretation'] or 'No row interpretation.')
            tag(paragraphs[-1].find('{'+W+'}pPr'),'keepNext')
            p('Evidence '+(' · '.join(labels[id] for id in r['evidence_ids']) or 'not selected'),'Meta')
    p('Method review and limitations','Heading1')
    for key,title in [('reflexivity','Reflexivity'),('quality_notes','Quality and review'),('counterexamples','Counterexamples and variation'),('limitations','Limitations'),('disclosure','Research and assistance disclosure')]:p(title,'Heading2');prose(d[key])
    p('Review checklist','Heading2')
    for key,value in d['checks'].items():p(key.replace('-',' ').capitalize()+': '+('confirmed by researcher' if value else 'not confirmed'),'Meta')
    if d.get('figures'):
        p('Figures','Heading1')
        for i,figure in enumerate(d['figures'],1):
            ref=b['figures'][figure['id']];asset=assets[ref['asset_id']];settings=asset['options']
            payload=report_figures.files(asset)[settings['name']+'.png'];parts=report_figures.word_parts(payload)
            for j,crop in enumerate(parts,1):
                p('Figure '+str(i)+' '+settings['title']+(' part '+str(j)+' of '+str(len(parts)) if len(parts)>1 else ''),'Heading2')
                report_figures.add_word_image(body,files,payload,i*1000+j,settings['title'],crop,len(figure['caption'])<=500)
                caption=p(figure['caption'] or 'Caption not yet written.','Normal')
                if len(figure['caption'])<=500:tag(caption.find('{'+W+'}pPr'),'keepNext')
                p(settings['credit'],'Meta')
                if len(parts)>1:p('Consecutive view of the unchanged original figure. The complete SVG, PDF and PNG remain in the report ZIP.','Meta')
    p('Selected evidence','Heading1')
    p('Verbatim quotations are italic. Interpretation remains in upright text.','Meta')
    for id,a in b['evidence'].items():
        p(labels[id]+' '+a['document_name'],'Heading2');quote=p(a['quote'],'EvidenceQuote');tag(quote.find('{'+W+'}pPr'),'keepNext')
        p(f"{a['document_name']} · [{a['start']}, {a['end']})",'Meta')
    record=p('Record details','Heading1');tag(record.find('{'+W+'}pPr'),'pageBreakBefore')
    p(f"Report {entry['id']}\nContent SHA256 {entry['content_hash']}\nEvidence SHA256 {entry['source_version']}\nExternal edits do not update QT.",'Meta')
    for id,a in b['evidence'].items():p(labels[id],'Heading2');p(f"Annotation {id}\nDocument {a['document_id']}\nSHA256 {a['sha256']}\nCode {a['code_id']} · source {a['source']}",'Meta')
    for i,figure in enumerate(d.get('figures',[]),1):
        ref=b['figures'][figure['id']];asset=assets[ref['asset_id']]
        p('Figure '+str(i)+' record','Heading2');p('Figure ID '+figure['id']+'\nAsset SHA256 '+ref['asset_id']+'\nEvidence SHA256 '+ref['source_version'],'Meta')
        p(json.dumps({'parameters':asset['options'],'environment':asset['environment']},ensure_ascii=False),'Meta')
    body.append(section);files['word/document.xml']=ET.tostring(root,encoding='utf-8',xml_declaration=True)
    files['customXml/item1.xml']=('<report>'+transcript.escaped(transcript.canonical(entry))+'</report>').encode()
    buffer=io.BytesIO()
    with zipfile.ZipFile(buffer,'w',zipfile.ZIP_DEFLATED) as z:
        for name,payload in files.items():z.writestr(name,payload)
    return buffer.getvalue()


def export_record(entry,assets):
    chosen=report_figures.selected_assets(entry,assets)
    return {'format':'qt-report-package-v1','report':entry,'figure_assets':chosen} if chosen else entry


def bundle_export(entry,assets,stale=False):
    chosen=report_figures.selected_assets(entry,assets);buffer=io.BytesIO()
    with zipfile.ZipFile(buffer,'w',zipfile.ZIP_DEFLATED) as z:
        z.writestr('report.html',html_export(entry,stale,chosen));z.writestr('report.docx',docx_export(entry,stale,chosen))
        z.writestr('report.json',json.dumps(export_record(entry,chosen),ensure_ascii=False,indent=2))
        for f in entry['draft'].get('figures',[]):
            asset=chosen[entry['bindings']['figures'][f['id']]['asset_id']];prefix='figures/'+f['id']+'/'
            for name,payload in report_figures.files(asset).items():z.writestr(prefix+name,payload)
            z.writestr(prefix+'parameters.json',json.dumps(asset['options'],ensure_ascii=False,indent=2))
            z.writestr(prefix+'result.json',json.dumps(asset['result'],ensure_ascii=False,indent=2))
            z.writestr(prefix+'environment.json',json.dumps(asset['environment'],ensure_ascii=False,indent=2))
        z.writestr('README.txt','Frozen researcher-authored QT report. Figure captions are editable; figures and counts are saved outputs.\nEach figures/<id>/ folder contains the exact CSV and figure.py used for its PNG, SVG and PDF. Install matplotlib (and scipy when clustering is selected), then run python figure.py inside that folder. Font and package versions affect cross-environment rendering.\nreport.json preserves the report and its shared figure records, not the full source project. Export project JSON separately for QT restoration. Word edits do not update QT.\n')
    return buffer.getvalue()
