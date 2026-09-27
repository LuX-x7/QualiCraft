'use strict';
const $ = (s, root = document) => root.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cp = s => Array.from(s);
const cut = (s, a, b) => cp(s).slice(a, b).join('');
const state = {token:'', projects:[], project:null, docId:null, view:'coding', search:'', codeFilter:null, selection:null, reviewFilter:'pending', config:{}, jobs:[]};
const icons = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  chart:'<path d="M4 3v17h17M8 16v-5m5 5V6m5 10v-8"/>',
  history:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6m3-4v6l4 2"/>',
  doc:'<path d="M5 3h9l5 5v13H5zM14 3v6h5M8 13h8m-8 4h6"/>',
  upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>',
  star:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>',
  setting:'<path d="M4 7h16M4 17h16M8 4v6m8 4v6"/>',
  down:'<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.doc}</svg>`;
let toastTimer, pollTimer;
function toast(message, error=false) { const el=$('#toast'); el.textContent=message; el.className='visible'+(error?' error':''); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.className='',6000); }
async function api(path, body) {
  const response = await fetch(path, {method:body ? 'POST':'GET', headers:{'X-QualiCraft-Token':state.token,...(body?{'Content-Type':'application/json'}:{})}, ...(body?{body:JSON.stringify(body)}:{})});
  const data = await response.json(); if(!response.ok) throw new Error(data.error || 'Request failed'); return data;
}
const projectUrl = action => `/api/projects/${state.project.id}${action?'/'+action:''}`;
const doc = () => state.project?.documents.find(d=>d.id===state.docId);
const codesFor = a => state.project.codes.find(c=>c.id===a.code_id);
function segments(text) {
  let speaker='unknown';
  return [...text.matchAll(/[^\r\n]+/gu)].filter(m=>m[0].trim()).map((m,i)=>{
    const label=m[0].match(/^\s*(患者|病人|受访者|Patient|Participant|P|A|医生|访谈者|采访者|Doctor|Interviewer|D|Q)\s*[:：]/i);
    if(label) speaker=/^(患者|病人|受访者|Patient|Participant|P|A)$/i.test(label[1])?'patient':'doctor';
    const start=cp(text.slice(0,m.index)).length;
    return {text:m[0], start, end:start+cp(m[0]).length, index:i, speaker};
  });
}
async function loadProject(id) {
  state.project=await api(`/api/projects/${id}`); state.docId=state.project.documents[0]?.id;
  state.selection=null; state.search=''; state.codeFilter=null; render();
}
async function refresh() {
  state.project=await api(projectUrl()); state.projects=await api('/api/projects'); render();
}
function modal(title, body, footer='') {
  const dlg=$('#dialog'); dlg.innerHTML=`<div class="modal-head"><h2>${esc(title)}</h2><button data-action="close" aria-label="Close">×</button></div><div class="modal-body">${body}<div id="modal-error" role="alert"></div></div>${footer?`<div class="modal-footer">${footer}</div>`:''}`;
  if(!dlg.open) dlg.showModal();
}
function closeModal() { $('#dialog').close(); $('#dialog').innerHTML=''; }
function errorDisplay(error) { if($('#dialog').open && $('#modal-error')) { $('#modal-error').className='inline-error'; $('#modal-error').textContent=error.message; } else toast(error.message,true); }
function render() {
  const p=state.project; if(!p) return;
  const pending=p.suggestions.filter(s=>s.status==='pending').length;
  const count=new Map(p.codes.map(c=>[c.id,p.annotations.filter(a=>a.code_id===c.id).length]));
  const titles={coding:'Coding workspace',insights:'Insights',audit:'Audit trail'};
  $('#app').innerHTML=`<div class="shell">
    <aside class="sidebar"><div class="brand"><span class="brand-icon">q</span><span class="brand-name">QualiCraft</span><sup>α</sup></div>
    <div class="section-label">YOUR RESEARCH</div><select id="project-select" class="project-select" aria-label="Switch project">${state.projects.map(x=>`<option value="${esc(x.id)}" ${x.id===p.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select>
    <button class="link new-project" data-action="projects">+ New / import project</button>
    <nav class="nav" aria-label="Main navigation">${[['coding','grid','Coding workspace'],['insights','chart','Insights'],['audit','history','Audit trail']].map(([view,i,t])=>`<button class="${state.view===view?'active':''}" data-action="view" data-view="${view}" title="${t}">${icon(i)}<span class="nav-label">${t}</span></button>`).join('')}</nav>
    <div class="sidebar-scroll"><div class="side-title"><div class="section-label">DOCUMENTS <span class="count">${p.documents.length}</span></div><button class="link" data-action="import" aria-label="Import interview">＋</button></div>
    ${p.documents.map(d=>`<button class="side-item ${d.id===state.docId?'selected':''}" data-action="doc" data-id="${d.id}" title="${esc(d.name)}">${icon('doc')}<span class="name">${esc(d.name)}</span></button>`).join('') || '<div class="empty">Import your first interview</div>'}
    <div class="side-title"><div class="section-label">CODEBOOK <span class="count">${p.codes.length}</span></div><button class="link" data-action="code" aria-label="New code">＋</button></div>
    ${p.codes.map(c=>`<button class="side-item ${state.codeFilter===c.id?'selected':''}" data-action="filter-code" data-id="${c.id}" title="${esc(c.definition || c.name)}"><span class="dot" style="background:${esc(c.color)}"></span><span class="name">${esc(c.name)}</span><span class="count">${count.get(c.id)}</span></button>`).join('')}
    </div><div class="local-note"><span class="dot"></span> Projects stored locally<br><span class="muted">Qwen API · Cloud on request</span></div></aside>
    <main class="workspace"><header class="topbar"><div class="breadcrumb">Personal workspace <span>/ &nbsp; ${titles[state.view]}</span></div><div class="top-actions"><span class="save-state">✓ Saved locally</span><button data-action="settings">${icon('setting')}Model settings</button><button data-action="export">${icon('down')}Export</button><span class="avatar">QC</span></div></header>
    <section class="page-head"><div class="eyebrow">Listen closely. Understand deeply.</div><div class="head-row"><h1>${esc(p.name)}</h1><button class="primary" data-action="import">${icon('upload')}Import interview</button></div><div class="subtitle">Every interpretation, connected to its source. <span class="study-chip">Researcher-led · AI-assisted</span></div><div class="metrics"><span><b>${p.documents.length}</b> documents</span><span class="divider">/</span><span><b>${p.codes.length}</b> codes</span><span class="divider">/</span><span><b>${p.annotations.length}</b> codings</span><span class="divider">/</span><span><b>${pending}</b> to review</span></div></section>
    <div id="job-status"></div><button class="link mobile-only" data-action="projects">Switch / create project</button>
    ${state.view==='coding'?codingView():state.view==='insights'?insightsView():auditView()}
    <footer class="bottom-bar"><span>LOCAL WORKSPACE &nbsp;·&nbsp; QUALICRAFT 0.1</span><span>Human judgment guides every code &nbsp; / &nbsp; Research use</span></footer></main></div>`;
  renderJob();
}
function highlight(text, start, annotations) {
  const chars=cp(text), end=start+chars.length;
  const relevant=annotations.filter(a=>a.start<end&&a.end>start);
  const bounds=[...new Set([start,end,...relevant.flatMap(a=>[Math.max(start,a.start),Math.min(end,a.end)])])].sort((a,b)=>a-b);
  return bounds.slice(0,-1).map((a,i)=>{
    const b=bounds[i+1], active=relevant.filter(x=>x.start<b&&x.end>a), part=esc(chars.slice(a-start,b-start).join(''));
    return active.length?`<mark title="${esc(active.map(x=>codesFor(x)?.name).join(' · '))}">${part}</mark>`:part;
  }).join('');
}
function codingView() {
  const d=doc(); if(!d) return `<div class="no-doc"><div class="eyebrow">A SPACE FOR YOUR QUESTIONS</div><h2>Start with a conversation</h2><p>Import TXT, DOCX, or paste a transcript.<br>Build a codebook, code by hand, or connect a model for suggestions.</p><button class="primary" data-action="import">Import interview</button> <button data-action="code">Create code</button></div>`;
  return `<div class="tabs-bar"><div class="doc-tab">${icon('doc')}${esc(d.name)}</div><input id="search" class="search" placeholder="Search transcript…" aria-label="Search transcript" value="${esc(state.search)}"></div>
  <div class="work-grid"><section class="document-pane" id="document-pane" aria-label="Source transcript"><div class="document-tools"><span>Select a passage to apply a code</span><div><button data-action="code">+ Code</button> <button class="soft" data-action="analyze">${icon('star')}AI coding</button></div></div>
  <h2 class="reader-heading">${esc(d.name)}</h2><div class="reader-meta">${cp(d.text).length.toLocaleString()} characters &nbsp;·&nbsp; ${segments(d.text).length} text segments &nbsp;·&nbsp; ${state.project.annotations.filter(a=>a.document_id===d.id).length} codings</div>
  <div id="reader">${readerHtml()}</div><div id="selection-slot"></div></section><aside class="review-pane" aria-label="Coding suggestions"><div class="review-title"><h3>Coding suggestions</h3><span class="count">${state.project.suggestions.filter(s=>s.document_id===d.id&&s.status==='pending').length} Pending</span></div><p class="review-subtitle">Check each suggestion against your research question.<br>Only accepted suggestions become codings.</p><select id="review-filter" class="review-filter" aria-label="Suggestion status">${[['pending','Pending'],['accepted','Accepted'],['rejected','Rejected']].map(([v,t])=>`<option value="${v}" ${state.reviewFilter===v?'selected':''}>${t}</option>`).join('')}</select>${suggestionsHtml()}<div class="review-footnote">✓ Quotes verified against the source<br>Interpretations still need your review.</div></aside></div>`;
}
function readerHtml() {
  const d=doc(), annotations=state.project.annotations.filter(a=>a.document_id===d.id);
  const paras=segments(d.text).filter(p=> (!state.search||p.text.toLocaleLowerCase().includes(state.search.toLocaleLowerCase())) && (!state.codeFilter||annotations.some(a=>a.code_id===state.codeFilter&&a.start<p.end&&a.end>p.start)));
  const filter=state.codeFilter?`<p class="tiny-label">Filter: ${esc(state.project.codes.find(c=>c.id===state.codeFilter)?.name)} <button class="link" data-action="clear-filter">Clear filters</button></p>`:'';
  return filter+(paras.map(p=>{
    const matches=annotations.filter(a=>a.start<p.end&&a.end>p.start);
    return `<div class="paragraph" data-start="${p.start}" data-end="${p.end}"><span class="line-no">${String(p.index+1).padStart(2,'0')}</span><div class="passage ${p.speaker==='doctor'?'doctor':''}" data-start="${p.start}">${highlight(p.text,p.start,annotations)}</div><div class="margin-tags">${matches.map(a=>{const c=codesFor(a);return `<button class="pill" style="--code-color:${esc(c.color)}" data-action="annotation" data-id="${a.id}">${esc(c.name)}<span class="source">${a.source==='manual'?'Manual':a.source==='researcher_reference'?'Researcher reference':'AI · reviewed'}</span></button>`;}).join('')}</div></div>`;
  }).join('') || '<div class="empty">No passages match your filters.<button class="link" data-action="clear-filter">Clear filters</button></div>');
}
function suggestionsHtml() {
  const suggestions=state.project.suggestions.filter(s=>s.document_id===state.docId&&s.status===state.reviewFilter);
  return suggestions.map(s=>`<article class="suggestion"><div class="card-eyebrow"><span>${s.source==='synthetic_demo'?'Fixed demo · not model output':'AI suggestion · quote verified'}</span><span>↗</span></div><h3>${esc(s.code_name)}</h3><button class="quote-btn" data-action="locate" data-start="${s.start}" title="Locate in source">“${esc(s.quote)}”</button><p class="reason">${esc(s.rationale)}</p>${s.status==='pending'?`<div class="card-actions"><button class="primary" data-action="review" data-id="${s.id}" data-decision="accept">✓ Accept</button><button data-action="review" data-id="${s.id}" data-decision="reject">Reject</button></div>`:`<small>${s.status==='accepted'?'Accepted by researcher':'Rejected · decision recorded'}</small>`}</article>`).join('') || '<div class="empty"><span class="empty-symbol">✧</span><strong>No suggestions here yet</strong>Run AI coding to review suggestions alongside your transcript.</div>';
}
function insightsView() {
  const p=state.project, counts=p.codes.map(c=>({...c,count:p.annotations.filter(a=>a.code_id===c.id).length})).sort((a,b)=>b.count-a.count);
  const max=Math.max(1,...counts.map(c=>c.count));
  return `<div class="view-body"><section class="panel"><h2>Code frequency</h2><p>Each confirmed quotation–code link counts once. Frequency is not importance or a count of participants. Pending suggestions are excluded.</p>${counts.map(c=>`<div class="bar-row"><span>${esc(c.name)}</span><div class="bar-track"><div class="bar-value" style="width:${c.count/max*100}%;background:${esc(c.color)}"></div></div><b>${c.count}</b></div>`).join('')||'<div class="empty">Apply codes to see your research take shape.</div>'}</section><section class="panel"><h2>Document × code</h2><p>Export the complete matrix as CSV for further analysis and plotting.</p><div class="table-wrap"><table><thead><tr><th>Document</th>${p.codes.map(c=>`<th>${esc(c.name)}</th>`).join('')}</tr></thead><tbody>${p.documents.map(d=>`<tr><td>${esc(d.name)}</td>${p.codes.map(c=>`<td>${p.annotations.filter(a=>a.document_id===d.id&&a.code_id===c.id).length}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section></div>`;
}
const actionNames={document_import:'Document imported',code_create:'Create code',annotation_create:'Coding created',suggestion_review:'Suggestion reviewed',analysis_start:'Analysis started',analysis_segment:'Segment analyzed',analysis_finish:'Analysis finished',benchmark_import:'Benchmark imported',annotation_remove:'Coding removed',memo_update:'Memo updated',project_restore:'Project restored'};
function auditView() {
  return `<div class="view-body"><section class="panel"><h2>Provenance and activity</h2><p>${esc(state.project.provenance||'Personal research project. When sharing your findings, document the data source, methods, and role of AI assistance.')}</p><p>Activity is saved locally and included in project exports. This is an editable research trail, not a tamper-proof log.</p>${state.project.audit.slice().reverse().map(a=>`<details class="audit-item"><summary><span>${esc(actionNames[a.action]||a.action)}</span><span class="muted">${esc(new Date(a.time).toLocaleString('en-GB'))}</span></summary><pre>${esc(JSON.stringify(a,null,2))}</pre></details>`).join('')}</section></div>`;
}
function selectionUpdate() {
  const s=window.getSelection(); if(!s||s.isCollapsed||!s.rangeCount) return;
  const range=s.getRangeAt(0);
  const passage=node=>(node.nodeType===1?node:node.parentElement)?.closest('.passage');
  const first=passage(range.startContainer), last=passage(range.endContainer);
  if(!first||!last) return;
  function offset(el,node,pos){const r=document.createRange();r.selectNodeContents(el);r.setEnd(node,pos);return Number(el.dataset.start)+cp(r.toString()).length;}
  const start=offset(first,range.startContainer,range.startOffset), end=offset(last,range.endContainer,range.endOffset);
  if(start>=end) return;
  state.selection={start,end,document_id:state.docId};
  $('#selection-slot').innerHTML=`<div class="selection-bar"><span>Selected ${end-start} characters${first!==last?' (includes intervening source text)':''}</span><button class="primary" data-action="annotate">Apply code</button><button data-action="analyze-selection">Analyze selection</button></div>`;
}
function locate(start) {
  if(state.search||state.codeFilter){state.search='';state.codeFilter=null;render();}
  const para=[...document.querySelectorAll('.paragraph')].find(el=>Number(el.dataset.start)<=start&&Number(el.dataset.end)>start);
  if(para){para.scrollIntoView({behavior:'smooth',block:'center'});para.classList.add('flash');setTimeout(()=>para.classList.remove('flash'),1800);}
}
function showImport() {
  modal('Import interview',`<p>Import UTF-8 TXT or DOCX, or paste a transcript. Original line breaks define segments. Use Doctor:/Patient: or Interviewer:/Participant: speaker labels. Chinese labels are also supported.</p><label class="field">Choose a file<input id="import-file" type="file" accept=".txt,.docx"><small>DOCX imports paragraph and table text; layout, comments, and headers are not retained.</small></label><label class="field">Document name<input id="document-name" placeholder="e.g. P02 · Care experience" maxlength="200"></label><label class="field">Or paste a transcript<textarea id="document-text" rows="9" placeholder="Doctor: How did the conversation feel?&#10;Patient: ..."></textarea></label>`, '<button data-action="close">Cancel</button><button class="primary" data-action="save-document">Import locally</button>');
}
function showCode() {
  modal('Create code',`<label class="field">Code name<input id="code-name" maxlength="160" placeholder="e.g. Information barriers"></label><label class="field">Definition and inclusion criteria<textarea id="code-definition" rows="4" placeholder="Describe when to use this code and when to exclude it."></textarea></label><label class="field">Color<input id="code-color" type="color" value="#427d77"></label>`, '<button data-action="close">Cancel</button><button class="primary" data-action="save-code">Save code</button>');
}
function showAnnotation() {
  if(!state.selection||state.selection.document_id!==state.docId) throw new Error('Select a passage in the transcript first.');
  if(!state.project.codes.length) {showCode();return;}
  modal('Code this passage',`<blockquote class="big-quote">${esc(cut(doc().text,state.selection.start,state.selection.end))}</blockquote><label class="field">Select a code<select id="annotation-code">${state.project.codes.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label><label class="field">Research memo (optional)<textarea id="annotation-memo" rows="3" placeholder="Record your interpretation or a question for comparison."></textarea></label>`, '<button data-action="close">Cancel</button><button class="primary" data-action="save-annotation">Apply code</button>');
}
function showSettings() {
  modal('Cloud model settings',`<p>The launcher can read a local API_key.txt. Keys entered here stay in server memory only, outside browser storage, projects, and exports.</p><label class="field">API Base URL<input id="api-base" value="${esc(state.config.base_url)}" spellcheck="false"><small>Alibaba Cloud Beijing: https://dashscope.aliyuncs.com/compatible-mode/v1. A workspace-specific URL in the same region or another compatible endpoint also works.</small></label><label class="field">Model name<input id="api-model" value="${esc(state.config.model)}" spellcheck="false"><small>Default: qwen3.8-flash. When switching providers, update the endpoint, model, and key together.</small></label><label class="field">API Key<input id="api-key" type="password" autocomplete="off" placeholder="${state.config.has_key?'Configured; leave blank to keep the key for this endpoint':'Enter your key here, not in chat'}"></label><div class="notice">Manual coding is free and works offline. Cloud analysis runs only after confirmation and may incur provider charges. De-identify real transcripts and confirm that sharing them with this provider is permitted.</div><a class="source-link" href="https://help.aliyun.com/zh/model-studio/compatibility-of-openai-with-dashscope" target="_blank" rel="noreferrer">Official Model Studio API documentation ↗</a>`, '<button data-action="clear-key">Clear key</button><button class="primary" data-action="save-settings">Save settings</button>');
}
function showAnalyze(forceSelection=false) {
  if(!doc()) throw new Error('Import an interview first.');
  const selected=state.selection?.document_id===state.docId;
  modal('AI-assisted coding',`<p>Preview the exact request before running analysis. Results arrive as suggestions for your review.</p><div class="form-row"><label class="field">Coding approach<select id="analysis-mode"><option value="deductive">Deductive · existing codes only</option><option value="inductive">Inductive · allow new codes</option></select></label><label class="field">Analysis scope<select id="analysis-scope"><option value="patient">Labeled patient / participant turns</option><option value="all">All non-empty text segments</option>${selected?`<option value="selection" ${forceSelection?'selected':''}>Selected passage (${state.selection.end-state.selection.start} characters)</option>`:''}</select></label></div><label class="check-row"><input id="include-context" type="checkbox" checked>Include the preceding doctor or interviewer question as context when speaker labels are recognized.</label><div class="notice">Up to 200 requests per run. Long segments are split at 6,000 characters. Speaker identification relies on explicit labels. Check the preview before sending.</div>`, '<button data-action="close">Cancel</button><button class="primary" data-action="preview-analysis">Preview requests</button>');
}
let activePreview=null;
async function previewAnalysis() {
  const request={document_id:state.docId,mode:$('#analysis-mode').value,scope:$('#analysis-scope').value,include_context:$('#include-context').checked,...(state.selection||{})};
  activePreview=await api(projectUrl('preview'),request);
  const preview=activePreview;
  modal('Review cloud request',`<p><b>${esc(preview.base_url)}</b><br>Model: ${esc(preview.model)} · ${preview.requests.length} requests · ${preview.segments.reduce((n,s)=>n+cp(s.text).length,0).toLocaleString()} target characters</p><div class="notice">Requests include the listed text, selected context, complete codebook definitions, and system instructions. Canceling stops subsequent requests; in-flight requests may still incur charges.</div><details class="preview-details"><summary>View full request bodies (${preview.requests.length} segments, no credentials)</summary>${preview.requests.map((r,i)=>`<details class="preview-details"><summary>Segment ${i+1} · source [${preview.segments[i].start}, ${preview.segments[i].end})</summary><pre class="preview-json">${esc(JSON.stringify(r,null,2))}</pre></details>`).join('')}</details><label class="check-row"><input id="send-confirm" type="checkbox">I have reviewed the content. These texts are de-identified and may be shared with this provider.</label>`, '<button data-action="close">Back</button><button class="primary" data-action="start-analysis" disabled>Send and analyze</button>');
}
function showProjects() {
  modal('Research projects',`<label class="field">Existing projects<select id="modal-project-select">${state.projects.map(p=>`<option value="${p.id}" ${p.id===state.project.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label><button data-action="switch-project">Open project</button><hr style="border:0;border-top:1px solid #e3e7e2;margin:22px 0"><label class="field">New project name<input id="new-project-name" placeholder="e.g. Experiences of outpatient care" maxlength="160"></label><button class="primary" data-action="new-project">Create project</button><div class="option-grid"><button class="option-card" data-action="demo-project"><strong>Fictional care interview</strong><span>Explore a fictional transcript, sample coding, and fixed review suggestions.</span></button><button class="option-card" data-action="benchmark-project"><strong>TU Delft · blind workspace</strong><span>Import 7 transcripts and 54 codes, without reference annotations.</span></button><button class="option-card" data-action="reference-project"><strong>TU Delft · researcher reference</strong><span>Explore 377 researcher annotations for comparison. These are not model predictions.</span></button><button class="option-card" data-action="restore-pick"><strong>Restore project JSON</strong><span>Restore a backup as a new project while keeping the original.</span></button></div><input id="restore-file" type="file" accept=".json" hidden><p>Dataset: van Gend & Zuiderwijk (2022), CC BY 4.0. <a href="https://doi.org/10.4121/19635147.v1" target="_blank" rel="noreferrer">Dataset source ↗</a></p>`);
}
function showExport() {
  modal('Export your research',`<p>Files are saved to your browser download folder. Full project exports include source transcripts; handle them as research data.</p><div class="option-grid"><button class="option-card" data-action="download" data-format="json"><strong>Full project · JSON</strong><span>Transcripts, codebook, codings, suggestions, and activity. Restore later to continue.</span></button><button class="option-card" data-action="download" data-format="csv"><strong>Codings · CSV</strong><span>Document, code, source quote, character offsets, memo, and provenance.</span></button><button class="option-card" data-action="download" data-format="matrix"><strong>Document × code · CSV</strong><span>Confirmed codings only, ready for Excel, R, or Python.</span></button></div>`);
}
async function createProject(body) {
  const p=await api('/api/projects',body); state.projects=await api('/api/projects'); closeModal(); state.view='coding'; await loadProject(p.id); toast('Project created and saved locally.');
}
async function action(button) {
  const a=button.dataset.action;
  if(a==='close'){closeModal();return;}
  if(a==='view'){state.view=button.dataset.view;state.selection=null;render();return;}
  if(a==='doc'){state.docId=button.dataset.id;state.selection=null;state.search='';state.codeFilter=null;state.view='coding';render();return;}
  if(a==='filter-code'){state.codeFilter=state.codeFilter===button.dataset.id?null:button.dataset.id;state.view='coding';render();return;}
  if(a==='clear-filter'){state.codeFilter=null;state.search='';render();return;}
  if(a==='import')return showImport();
  if(a==='code')return showCode();
  if(a==='settings')return showSettings();
  if(a==='projects')return showProjects();
  if(a==='export')return showExport();
  if(a==='annotate')return showAnnotation();
  if(a==='analyze'||a==='analyze-selection')return showAnalyze(a==='analyze-selection');
  if(a==='locate')return locate(Number(button.dataset.start));
  if(a==='preview-analysis')return previewAnalysis();
  if(a==='save-document'){
    const file=$('#import-file').files[0];
    const body={name:$('#document-name').value||file?.name,text:$('#document-text').value};
    if(file){if(file.size>8_000_000)throw new Error('File exceeds 8 MB.'); if(/\.docx$/i.test(file.name)){const bytes=new Uint8Array(await file.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));body.docx_base64=btoa(binary);delete body.text;}else if(/\.txt$/i.test(file.name)){body.text=new TextDecoder('utf-8',{fatal:true}).decode(await file.arrayBuffer());}else throw new Error('Choose a TXT or DOCX file.');}
    const d=await api(projectUrl('documents'),body);state.docId=d.id;state.selection=null;closeModal();await refresh();toast('Interview imported.');return;
  }
  if(a==='save-code'){await api(projectUrl('codes'),{name:$('#code-name').value,definition:$('#code-definition').value,color:$('#code-color').value});closeModal();await refresh();toast('Code saved.');return;}
  if(a==='save-annotation'){await api(projectUrl('annotations'),{...state.selection,code_id:$('#annotation-code').value,memo:$('#annotation-memo').value});state.selection=null;closeModal();await refresh();toast('Passage coded.');return;}
  if(a==='review'){const start=state.project.suggestions.find(s=>s.id===button.dataset.id)?.start;await api(projectUrl('review'),{id:button.dataset.id,action:button.dataset.decision});await refresh();locate(start);toast(button.dataset.decision==='accept'?'Accepted and added to your codings.':'Rejected; review decision saved.');return;}
  if(a==='annotation'){
    const annotation=state.project.annotations.find(x=>x.id===button.dataset.id);
    modal(codesFor(annotation).name,`<blockquote class="big-quote">${esc(annotation.quote)}</blockquote><p>Source range [${annotation.start}, ${annotation.end}) · ${esc(annotation.source)}</p><label class="field">Research memo<textarea id="edit-memo" rows="4">${esc(annotation.memo)}</textarea></label>`,`<button class="danger" data-action="remove-annotation" data-id="${annotation.id}">Remove coding</button><button class="primary" data-action="save-memo" data-id="${annotation.id}">Save memo</button>`);return;
  }
  if(a==='save-memo'){await api(projectUrl('memo'),{id:button.dataset.id,memo:$('#edit-memo').value});closeModal();await refresh();toast('Memo saved.');return;}
  if(a==='remove-annotation'){await api(projectUrl('remove-annotation'),{id:button.dataset.id});closeModal();await refresh();toast('Coding removed; the previous record is retained in the audit trail.');return;}
  if(a==='save-settings'||a==='clear-key'){
    state.config=await api('/api/config',{base_url:$('#api-base').value,model:$('#api-model').value,api_key:a==='clear-key'?'':$('#api-key').value,keep_key:a!=='clear-key'});closeModal();toast(a==='clear-key'?'Key cleared from memory.':'Settings saved. No text has been sent.');return;
  }
  if(a==='start-analysis'){
    if(!$('#send-confirm').checked)throw new Error('Confirm the request content first.');
    const job=await api('/api/analyze',{preview_id:activePreview.id,confirmed:true});state.jobs.push(job);closeModal();renderJob();startPolling();toast('Analysis started. Results will appear as suggestions.');return;
  }
  if(a==='cancel-job'){await api(`/api/jobs/${button.dataset.id}/cancel`,{});toast('Cancellation requested. The current request may still finish.');return;}
  if(a==='switch-project'){const id=$('#modal-project-select').value;closeModal();await loadProject(id);return;}
  if(a==='new-project')return createProject({name:$('#new-project-name').value,kind:'empty'});
  if(a==='demo-project')return createProject({kind:'demo'});
  if(a==='benchmark-project')return createProject({kind:'benchmark'});
  if(a==='reference-project')return createProject({kind:'reference'});
  if(a==='restore-pick'){$('#restore-file').click();return;}
  if(a==='download'){
    const format=button.dataset.format,response=await fetch(projectUrl('export')+'?format='+format,{headers:{'X-QualiCraft-Token':state.token}});
    if(!response.ok)throw new Error('Export failed.');const url=URL.createObjectURL(await response.blob()),link=document.createElement('a');link.href=url;link.download=`qualicraft-${format==='json'?'project.json':format+'.csv'}`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Exported to your browser download folder.');return;
  }
}
function renderJob(){
  const holder=$('#job-status');if(!holder)return;
  const job=state.jobs.filter(j=>j.project_id===state.project.id).at(-1);
  if(!job){holder.innerHTML='';return;}
  const labels={running:job.cancel_requested?'Stopping':'Analyzing',completed:'Analysis complete',cancelled:'Analysis canceled',failed:'Analysis interrupted'};
  holder.innerHTML=`<div class="job-bar"><span>${esc(labels[job.status])} · ${job.done}/${job.total} segments · ${job.saved} new suggestions${job.discarded?' · '+job.discarded+' failed validation':''}${job.error?' · '+esc(job.error):''}</span>${job.status==='running'?`<button data-action="cancel-job" data-id="${job.id}" ${job.cancel_requested?'disabled':''}>Stop remaining requests</button>`:''}</div>`;
}
function startPolling(){
  clearTimeout(pollTimer);pollTimer=setTimeout(async()=>{try{const before=state.jobs.filter(j=>j.status==='running').map(j=>j.id);state.jobs=await api('/api/jobs');renderJob();const finished=state.jobs.find(j=>before.includes(j.id)&&j.status!=='running');if(finished){if(finished.project_id===state.project.id)await refresh();toast(finished.error||'Analysis finished. Review your suggestions.',finished.status==='failed');}if(state.jobs.some(j=>j.status==='running'))startPolling();}catch(e){toast('Could not read task status. Refresh to view saved results.',true);}},1500);
}
document.addEventListener('click',async e=>{const button=e.target.closest('[data-action]');if(!button||button.disabled)return;button.disabled=true;try{await action(button);}catch(error){errorDisplay(error);}finally{if(button.isConnected)button.disabled=button.dataset.action==='start-analysis'&&!$('#send-confirm')?.checked;}});
document.addEventListener('change',async e=>{
  try{
    if(e.target.id==='project-select')await loadProject(e.target.value);
    if(e.target.id==='review-filter'){state.reviewFilter=e.target.value;render();}
    if(e.target.id==='send-confirm')$('[data-action="start-analysis"]').disabled=!e.target.checked;
    if(e.target.id==='import-file'&&e.target.files[0])$('#document-name').value=e.target.files[0].name.replace(/\.(txt|docx)$/i,'');
    if(e.target.id==='restore-file'&&e.target.files[0]){if(e.target.files[0].size>20_000_000)throw new Error('Project file exceeds 20 MB.');await createProject({kind:'restore',project:JSON.parse(await e.target.files[0].text())});}
  }catch(error){errorDisplay(error);}
});
document.addEventListener('input',e=>{if(e.target.id==='search'){state.search=e.target.value;state.selection=null;$('#reader').innerHTML=readerHtml();$('#selection-slot').innerHTML='';}});
document.addEventListener('mouseup',e=>{if(e.target.closest('#reader'))selectionUpdate();});
document.addEventListener('keyup',e=>{if(e.shiftKey&&e.target.closest('#reader'))selectionUpdate();});
async function init(){try{const boot=await api('/api/bootstrap');state.token=boot.token;state.projects=boot.projects;state.config=boot.config;await loadProject(state.projects[0].id);state.jobs=await api('/api/jobs');renderJob();if(state.jobs.some(j=>j.status==='running'))startPolling();}catch(error){$('#app').innerHTML=`<div class="loading">Could not open workspace: ${esc(error.message)}. Check that the local server is running, then refresh.</div>`;}}
init();
