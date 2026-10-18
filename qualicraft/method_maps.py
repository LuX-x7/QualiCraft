"""Versioned original method orientations, frozen on deliberate report save.

Absent on legacy entries means absent, never an inferred upgrade. Saved v1 maps
are validated structurally, not compared with a future catalogue definition.
"""
import copy,json,re
from pathlib import Path
from . import transcript
from .core import require
MAPS=json.loads(Path(__file__).with_name('method_maps.json').read_text(encoding='utf-8'))
NOTICE='Procedure overview, not a completion record. Record your approach and decisions; researcher confirmations remain separate.'
CSS='''.method-map{margin:28px 0;color:#202a36;font:15px/1.55 system-ui,sans-serif}.method-map ol{list-style:none;padding:0;margin:22px 0}.method-map li{position:relative;margin:0 0 24px;padding:14px 18px 14px 58px;border:1px solid #a9b3be;background:#fafbf9;break-inside:avoid}.method-map li:not(:last-child)::after{content:"↓";position:absolute;bottom:-25px;left:24px;font-size:20px;color:#4b607c}.method-map .map-number{position:absolute;left:16px;top:14px;font:14px/1.6 ui-monospace,monospace;color:#4b607c}.method-map strong{display:block;font-size:16px}.method-map .map-detail{display:block;margin-top:4px}.method-map .map-return{border-left:2px dashed #9c6f48;padding-left:14px}.method-map .map-note,.method-map .map-provenance{font-size:13px;overflow-wrap:anywhere}.method-map a{color:inherit;text-underline-offset:3px}.method-map summary:focus-visible,.method-map a:focus-visible{outline:2px solid #4b607c;outline-offset:3px}.method-map details{font:13px/1.6 system-ui}.method-map h4{font-size:19px;margin:16px 0}@media(max-width:500px){.method-map li{padding:12px 12px 12px 44px}.method-map .map-number{left:10px}.method-map strong{font-size:16px}}'''

def freeze(method):return copy.deepcopy(MAPS[method])

def validate(m,method):
    require(isinstance(m,dict) and set(m)=={'version','method','name','note','steps','links','references'},'The saved method map is invalid')
    require(type(m['version']) is int and m['version']==1 and m['method']==method,'The saved method map version or method is invalid')
    def text(s,n):require(isinstance(s,str) and 0<len(s)<=n and not re.search(r'[\x00-\x1f\ud800-\udfff\ufffe\uffff]',s),'The method map text is invalid')
    text(m['name'],160);text(m['note'],2000)
    require(isinstance(m['steps'],list) and len(m['steps'])==6,'The method map steps are invalid')
    for i,s in enumerate(m['steps'],1):
        require(isinstance(s,dict) and set(s)=={'id','title','detail'} and type(s['id']) is int and s['id']==i,'The method map step is invalid')
        text(s['title'],100);text(s['detail'],500)
    require(isinstance(m['links'],list) and 5<=len(m['links'])<=12,'The method map connections are invalid')
    for link in m['links']:require(isinstance(link,list) and len(link)==2 and all(type(i) is int and 1<=i<=6 for i in link) and link[0]!=link[1],'The method map connection is invalid')
    require(len({tuple(l) for l in m['links']})==len(m['links']) and m['links'][:5]==[[i,i+1] for i in range(1,6)] and all(a>b for a,b in m['links'][5:]),'The method map order is invalid')
    require(isinstance(m['references'],list) and 1<=len(m['references'])<=5,'The method map references are invalid')
    for ref in m['references']:
        require(isinstance(ref,dict) and set(ref)=={'title','url'},'The method map reference is invalid');text(ref['title'],300);text(ref['url'],1000)
        require(re.fullmatch(r'https://[a-zA-Z0-9.-]+/[^\s<>"\x27]*',ref['url']) is not None,'The method reference URL is invalid')

def return_text(m):
    return 'Revisit '+ '; '.join(f'{a:02d} → {b:02d} · {m["steps"][b-1]["title"]}' for a,b in m['links'][5:])

def map_html(m):
    esc=transcript.escaped
    steps=''.join(f'<li><span class="map-number" aria-hidden="true">{s["id"]:02d}</span><strong>{esc(s["title"])}</strong><span class="map-detail">{esc(s["detail"])}</span></li>' for s in m['steps'])
    refs=' · '.join('<a href="'+esc(r['url'])+'">'+esc(r['title'])+'</a>' for r in m['references'])
    return '<div class="method-map"><h4>Method map M1 · '+esc(m['name'])+'</h4><p class="map-note">'+esc(NOTICE)+'</p><ol aria-label="Method process steps">'+steps+'</ol><p class="map-return">'+esc(return_text(m))+'</p><p class="map-note">'+esc(m['note'])+'</p><details><summary>Method sources</summary><p>'+refs+'</p></details></div>'

def provenance(entry):
    m=entry.get('method_map');parts=['Saved report version '+str(entry['revision']), 'method-map schema v'+str(m['version']) if m else 'legacy report · no saved method map','Coding source SHA256 '+entry['source_version']]
    if 'qca' in entry['bindings']:
        run=entry['bindings']['qca'];r=run['result'];o=r['options']
        parts+=['Frozen QCA run '+run['id'],'Run SHA256 '+run['content_hash'],f'Outcome {r["outcome"]} = {r["target"]} · frequency cutoff {o["n_cut"]} · consistency cutoffs {o["ic1"]} / {o["ic0"]}']
    return '\n'.join(parts)

def method_name(entry):return entry.get('method_map',MAPS[entry['draft']['method']])['name']

def block_html(entry,prose):
    esc=transcript.escaped;d=entry['draft'];m=entry.get('method_map')
    fields=''.join('<h4>'+title+'</h4>'+prose(d[key] or 'Not documented yet.') for key,title in [('approach','Analytic approach'),('analysis_unit','Analysis unit'),('method_notes','Approach and decisions')])
    qualifier='<p>Binary crisp-set, conservative, no logical remainders.</p>' if d['method']=='comparative' else ''
    return '<section class="method-decisions"><h3>Method and decisions</h3><p><strong>Method used:</strong> '+esc(method_name(entry))+'</p>'+qualifier+fields+(map_html(m) if m else '<p class="meta">No method map was saved in this legacy report. Save a new version to include the current method map; the old version remains unchanged.</p>')+'<p class="meta map-provenance">'+esc(provenance(entry)).replace('\n','<br>')+'</p></section>'

def word_block(body,entry):
    """Native paragraphs, editable text and arrow connectors; no floating objects."""
    from .reporting import citation_text
    tag=transcript.word_tag;run=transcript.word_run;d=entry['draft'];m=entry.get('method_map')
    def p(value,style='Normal',keep=False,page=False):
        para=tag(body,'p');pr=tag(para,'pPr');tag(pr,'pStyle',{'val':style})
        if keep:tag(pr,'keepNext')
        if page:tag(pr,'pageBreakBefore')
        run(para,value);return para,pr
    p('Method and decisions','Heading2');p('Method used: '+method_name(entry))
    if d['method']=='comparative':p('Binary crisp-set, conservative, no logical remainders.','Meta')
    for key,title in [('approach','Analytic approach'),('analysis_unit','Analysis unit'),('method_notes','Approach and decisions')]:
        p(title,'Heading3');p(citation_text(entry,d[key]) or 'Not documented yet.')
    if m:
        p('Method map M1','Heading2',page=True);p(m['name'],'ChapterNote');p(NOTICE,'Meta')
        for i,s in enumerate(m['steps']):
            para,pr=p('','Normal',keep=True);tag(pr,'spacing',{'before':60,'after':60,'line':260,'lineRule':'auto'});tag(pr,'ind',{'left':240,'right':240})
            borders=tag(pr,'pBdr');tag(borders,'left',{'val':'single','sz':12,'space':10,'color':'4B607C'})
            tag(pr,'shd',{'val':'clear','fill':'F7F8F6'});run(para,f'{s["id"]:02d}  '+s['title'],bold=True,font='Calibri',size=23);run(para,'\n'+s['detail'],size=21)
            if i<5:
                arrow,ap=p('↓','Meta',keep=True);tag(ap,'spacing',{'before':0,'after':0,'line':160,'lineRule':'auto'});tag(ap,'jc',{'val':'center'})
        p(return_text(m),'Meta');p(m['note'],'Meta')
        p('Method sources','Heading3')
        for ref in m['references']:p(ref['title']+'\n'+ref['url'],'Meta')
    else:p('No method map was saved in this legacy report. Save a new version to include the current method map; the old version remains unchanged.','Meta')
    p(provenance(entry),'Meta')
