'use strict';
const $ = (s, root = document) => root.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cp = s => Array.from(s);
const cut = (s, a, b) => cp(s).slice(a, b).join('');
const state = {token:'', projects:[], project:null, docId:null, view:'coding', search:'', codeFilter:null, selection:null, reviewFilter:'pending', config:{}, jobs:[], collapsed:new Set()};

// Capability blocks. The core (documents, codes, codings) is always on; these
// are opt-in, so a researcher assembles the tool they need. See docs/NOT_BUILDING.md.
const BLOCKS = [
  {id:'hierarchy', name:'Theme grouping', desc:'Group codes under themes. Turns the flat list into a collapsible tree with rolled-up counts.'},
  {id:'memos', name:'Memos', desc:'Reading notes on a document, notes on a code or theme, notes on a single coding.'},
  {id:'ai', name:'AI suggestions', desc:'A model proposes codings; each one arrives in a review queue and only enters the codebook if you accept it.'},
  {id:'insights', name:'Frequency analysis', desc:'How often each code was used, and a document by code matrix.'},
  {id:'audit', name:'Audit trail', desc:'Every action with a timestamp, stored with the project and included in exports.'},
  {id:'plotting', name:'Plotting workbench', desc:'Publication figures: a theme co-occurrence heatmap with clustering, plus the script that drew it so a co-author can re-run it. Needs matplotlib, seaborn and scipy.'}
];
function hasBlock(id) {
  const blocks = state.project && state.project.blocks;
  return Array.isArray(blocks) ? blocks.includes(id) : true;
}
const icons = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  chart:'<path d="M4 3v17h17M8 16v-5m5 5V6m5 10v-8"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 15l-5-5L5 20"/>',
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
function codePath(code) {
  const byId=new Map(state.project.codes.map(c=>[c.id,c]));
  const parts=[code.name]; let cur=code; const seen=new Set([code.id]);
  while(cur.parent_id && byId.has(cur.parent_id) && !seen.has(cur.parent_id)) {
    cur=byId.get(cur.parent_id); seen.add(cur.id); parts.push(cur.name);
  }
  return parts.reverse().join(' > ');
}
function codeDescendants(id) {
  const out=new Set(); const stack=[id];
  while(stack.length) {
    const cur=stack.pop();
    state.project.codes.forEach(c=>{ if(c.parent_id===cur && !out.has(c.id)) { out.add(c.id); stack.push(c.id); } });
  }
  return out;
}
function codeDepthMap() {
  const byId=new Map(state.project.codes.map(c=>[c.id,c]));
  const depth=new Map();
  state.project.codes.forEach(c=>{
    let d=0, cur=c; const seen=new Set([c.id]);
    while(cur.parent_id && byId.has(cur.parent_id) && !seen.has(cur.parent_id)) {
      seen.add(cur.id); cur=byId.get(cur.parent_id); d++;
    }
    depth.set(c.id, d);
  });
  return depth;
}
function codeTree() {
  const byParent=new Map();
  state.project.codes.forEach(c=>{ const k=c.parent_id||null; if(!byParent.has(k)) byParent.set(k,[]); byParent.get(k).push(c); });
  byParent.forEach(list=>list.sort((a,b)=>(a.order??0)-(b.order??0)||a.name.localeCompare(b.name)));
  const rows=[];
  (function walk(parentId,depth){
    (byParent.get(parentId)||[]).forEach(c=>{
      const kids=byParent.get(c.id)||[];
      rows.push({code:c, depth, childCount:kids.length});
      if(kids.length && !state.collapsed.has(c.id)) walk(c.id, depth+1);
    });
  })(null,0);
  return rows;
}
function codeCounts() {
  const byId=new Map(state.project.codes.map(c=>[c.id,c]));
  const own=new Map(state.project.codes.map(c=>[c.id,0]));
  state.project.annotations.forEach(a=>{ if(own.has(a.code_id)) own.set(a.code_id, own.get(a.code_id)+1); });
  const total=new Map(own);
  state.project.codes.forEach(c=>{
    let cur=c.parent_id; const seen=new Set([c.id]);
    while(cur && byId.has(cur) && !seen.has(cur)) {
      seen.add(cur.id);
      total.set(cur, (total.get(cur)||0) + (own.get(c.id)||0));
      cur=byId.get(cur).parent_id;
    }
  });
  return {own, total};
}
function codebookHtml() {
  const p=state.project;
  if(!p.codes.length) return '<div class="empty">No codes yet. Add one to start coding.</div>';
  const {own,total}=codeCounts();
  return codeTree().map(({code:c,depth,childCount})=>{
    const open=!state.collapsed.has(c.id);
    return `<div class="code-row" style="--depth:${depth}">
      <button class="twisty${childCount?'':' leaf'}" data-action="toggle-code" data-id="${c.id}" title="${childCount?(open?'Collapse':'Expand'):''}" aria-label="Toggle">${childCount?(open?'▾':'▸'):''}</button>
      <button class="side-item${state.codeFilter===c.id?' selected':''}" data-action="filter-code" data-id="${c.id}" title="${esc(c.definition||c.name)}">
        <span class="dot" style="background:${esc(c.color)}"></span>
        <span class="name">${esc(c.name)}${c.status!=='final'?`<span class="status-flag">${esc(c.status)}</span>`:''}</span>
        <span class="count" title="${own.get(c.id)||0} direct · ${total.get(c.id)||0} including sub-codes">${total.get(c.id)||0}</span>
      </button>
      <button class="edit-code" data-action="code-edit" data-id="${c.id}" title="Edit, re-parent, merge or delete" aria-label="Edit code">⋯</button>
    </div>`;
  }).join('') || '<div class="empty">No codes to show.</div>';
}
function segments(text) {
  let speaker='unknown';
  return [...text.matchAll(/[^\r\n]+/gu)].filter(m=>m[0].trim()).map((m,i)=>{
    const label=m[0].match(/^\s*(患者|病人|受访者|Patient|Participant|Answer|IP\d+|P|A|医生|访谈者|采访者|Doctor|Interviewer|D|Q)\s*[:：]/i);
    if(label) speaker=/^(患者|病人|受访者|Patient|Participant|Answer|IP\d+|P|A)$/i.test(label[1])?'patient':'doctor';
    else if(/^\s*IQ\d+(?:\.\d+)*(?:\s*[:.]|\s*$)/i.test(m[0])) speaker='doctor';
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
  const titles={coding:'Coding workspace',insights:'Insights',audit:'Audit trail'};
  $('#app').innerHTML=`<div class="shell">
    <aside class="sidebar"><div class="brand"><span class="brand-icon">Q</span><span class="brand-name">QualiCraft</span><span class="version">ALPHA</span></div>
    <div class="section-label">PROJECT</div><select id="project-select" class="project-select" aria-label="Switch project">${state.projects.map(x=>`<option value="${esc(x.id)}" ${x.id===p.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select>
    <button class="link new-project" data-action="projects">+ New / import project</button>
    <nav class="nav" aria-label="Main navigation">${[['coding','grid','Coding workspace'],['insights','chart','Insights'],['plotting','image','Figures'],['audit','history','Audit trail']].filter(([view])=>view==='coding'||hasBlock(view)).map(([view,i,t])=>`<button class="${state.view===view?'active':''}" data-action="view" data-view="${view}" title="${t}">${icon(i)}<span class="nav-label">${t}</span></button>`).join('')}</nav>
    <div class="sidebar-scroll"><div class="side-title"><div class="section-label">DOCUMENTS <span class="count">${p.documents.length}</span></div><button class="link" data-action="import" aria-label="Import interview">＋</button></div>
    ${p.documents.map(d=>`<button class="side-item ${d.id===state.docId?'selected':''}" data-action="doc" data-id="${d.id}" title="${esc(d.name)}">${icon('doc')}<span class="name">${esc(d.name)}</span></button>`).join('') || '<div class="empty">Import your first interview</div>'}
    <div class="side-title"><div class="section-label">CODEBOOK <span class="count">${p.codes.length}</span></div><button class="link" data-action="code" aria-label="New code">＋</button></div>
    ${codebookHtml()}
    <div class="side-title"><div class="section-label">TOOLS <span class="count">${(p.blocks||[]).length}/${BLOCKS.length}</span></div></div><button class="side-item" data-action="tools" title="Add or remove capability blocks"><span class="tools-glyph">\u229e</span><span class="name">Capability blocks</span><span class="count">${(p.blocks||[]).length}</span></button>
    </div><div class="local-note"><span class="status-dot"></span><div><strong>Local workspace</strong><span>Cloud only when requested</span></div></div></aside>
    <main class="workspace"><header class="topbar"><div class="breadcrumb"><strong>${esc(p.name)}</strong><span>${titles[state.view]}</span></div><div class="top-actions"><span class="save-state">Saved locally</span><button data-action="settings">${icon('setting')}Model</button><button data-action="export">${icon('down')}Export</button><span class="avatar">QC</span></div></header>
    <section class="project-strip"><div><h1>${esc(p.name)}</h1><div class="metrics"><span><b>${p.documents.length}</b> documents</span><span><b>${p.codes.length}</b> codes</span><span><b>${p.annotations.length}</b> codings</span><span class="pending-metric"><b>${pending}</b> to review</span></div></div><button class="primary" data-action="import">${icon('upload')}Import interview</button></section>
    <div id="job-status"></div><button class="link mobile-only" data-action="projects">Switch / create project</button>
    ${state.view==='coding'?codingView():state.view==='insights'?insightsView():state.view==='plotting'?plottingView():auditView()}
    <footer class="bottom-bar"><span>QUALICRAFT 0.1 · LOCAL WORKSPACE</span><span>Exact source ranges · Researcher-reviewed coding</span></footer></main></div>`;
  renderJob();
  loadPlotPreview();
}
function highlight(text, start, annotations) {
  const chars=cp(text), end=start+chars.length;
  const relevant=annotations.filter(a=>a.start<end&&a.end>start);
  const bounds=[...new Set([start,end,...relevant.flatMap(a=>[Math.max(start,a.start),Math.min(end,a.end)])])].sort((a,b)=>a-b);
  return bounds.slice(0,-1).map((a,i)=>{
    const b=bounds[i+1], active=relevant.filter(x=>x.start<b&&x.end>a), part=esc(chars.slice(a-start,b-start).join(''));
    if(!active.length) return part;
    const activeCodes=active.map(x=>codesFor(x)).filter(Boolean);
    if(!activeCodes.length) return part;
    const depth=codeDepthMap();
    const shallow=activeCodes.reduce((m,c)=>((depth.get(c.id)||0)<(depth.get(m.id)||0)?c:m),activeCodes[0]);
    const deep=activeCodes.reduce((m,c)=>((depth.get(c.id)||0)>(depth.get(m.id)||0)?c:m),activeCodes[0]);
    return `<mark style="background:color-mix(in srgb,${esc(shallow.color)} 20%,#fff);border-bottom-color:${esc(deep.color)}" title="${esc(activeCodes.map(c=>c.name).join(' · '))}">${part}</mark>`;
  }).join('');
}

function codingView() {
  const d=doc(); if(!d) return `<div class="no-doc"><div class="eyebrow">A SPACE FOR YOUR QUESTIONS</div><h2>Start with a conversation</h2><p>Import TXT, DOCX, or paste a transcript.<br>Build a codebook, code by hand, or connect a model for suggestions.</p><button class="primary" data-action="import">Import interview</button> <button data-action="code">Create code</button></div>`;
  return `<div class="tabs-bar"><div class="doc-tab">${icon('doc')}<span>${esc(d.name)}</span><span class="tab-close">×</span></div><input id="search" class="search" placeholder="Search in document" aria-label="Search transcript" value="${esc(state.search)}"></div>
  <div class="work-grid${hasBlock('ai')?'':' no-review'}"><section class="document-pane" id="document-pane" aria-label="Source transcript"><div class="document-tools"><div class="panel-kicker">DOCUMENT</div><div class="tool-group"><span class="selection-hint">Select text to code a passage</span><button data-action="code">+ New code</button><button class="primary${hasBlock('ai')?'':' block-off'}" data-action="analyze">${icon('star')}Analyze with AI</button></div></div>
  <div class="reader-header"><div><h2 class="reader-heading">${esc(d.name)}</h2><div class="reader-meta">${cp(d.text).length.toLocaleString()} characters · ${segments(d.text).length} segments · ${state.project.annotations.filter(a=>a.document_id===d.id).length} codings</div></div><div class="margin-label">CODING MARGIN</div></div>
  <div class="reading-note${hasBlock('memos')?'':' block-off'}"><span class="reading-note-label">READING NOTES</span><textarea id="doc-memo" rows="2" placeholder="First impressions, questions to follow up, anything that stands out.">${esc(d.memo||'')}</textarea><span class="reading-note-state" id="doc-memo-state"></span></div>
  <div id="reader">${readerHtml()}</div></section><aside class="review-pane${hasBlock('ai')?'':' block-off'}" aria-label="AI suggestion review"><div class="review-header"><div class="panel-kicker">AI REVIEW</div><div class="review-title"><h3>Suggestions</h3><span class="count">${state.project.suggestions.filter(s=>s.document_id===d.id&&s.status==='pending').length}</span></div><p class="review-subtitle">Verify each interpretation against the source. A suggestion becomes a coding only after you accept it.</p><select id="review-filter" class="review-filter" aria-label="Suggestion status">${[['pending','Pending review'],['accepted','Accepted'],['rejected','Rejected']].map(([v,t])=>`<option value="${v}" ${state.reviewFilter===v?'selected':''}>${t}</option>`).join('')}</select></div><div class="suggestion-list">${suggestionsHtml()}</div><div class="review-footnote">Source ranges are verified automatically.<br>Interpretation remains your decision.</div></aside></div>`;
}
function readerHtml() {
  const d=doc(), annotations=state.project.annotations.filter(a=>a.document_id===d.id);
  const paras=segments(d.text).filter(p=> (!state.search||p.text.toLocaleLowerCase().includes(state.search.toLocaleLowerCase())) && (!state.codeFilter||annotations.some(a=>a.code_id===state.codeFilter&&a.start<p.end&&a.end>p.start)));
  const filter=state.codeFilter?`<p class="tiny-label">Filter: ${esc(state.project.codes.find(c=>c.id===state.codeFilter)?.name)} <button class="link" data-action="clear-filter">Clear filters</button></p>`:'';
  return filter+(paras.map(p=>{
    const matches=annotations.filter(a=>a.start<p.end&&a.end>p.start);
    return `<div class="paragraph" data-start="${p.start}" data-end="${p.end}"><span class="line-no">${String(p.index+1).padStart(2,'0')}</span><div class="passage ${p.speaker==='doctor'?'doctor':''}" data-start="${p.start}">${highlight(p.text,p.start,annotations)}</div><div class="margin-tags">${matches.map(a=>{const c=codesFor(a);return `<button class="pill" style="--code-color:${esc(c.color)}" data-action="annotation" data-id="${a.id}"><span class="code-name">${esc(c.name)}</span><span class="source">${a.source==='manual'?'HUMAN':a.source==='researcher_reference'?'REFERENCE':'AI · REVIEWED'}</span></button>`;}).join('')}</div></div>`;
  }).join('') || '<div class="empty">No passages match your filters.<button class="link" data-action="clear-filter">Clear filters</button></div>');
}
function suggestionsHtml() {
  const suggestions=state.project.suggestions.filter(s=>s.document_id===state.docId&&s.status===state.reviewFilter);
  return suggestions.map((s,i)=>`<article class="suggestion"><div class="card-eyebrow"><span>${s.source==='synthetic_demo'?'DEMO SUGGESTION':'AI SUGGESTION'}</span><span>#${String(i+1).padStart(2,'0')}</span></div><h3>${esc(s.code_name)}</h3>${s.definition?`<p class="definition">${esc(s.definition)}</p>`:''}<button class="quote-btn" data-action="locate" data-start="${s.start}" title="Locate this quotation in the source"><span>“${esc(s.quote)}”</span><small>Source range [${s.start}, ${s.end}) · Locate ↗</small></button><div class="rationale-label">RATIONALE</div><p class="reason">${esc(s.rationale)}</p>${s.status==='pending'?`<div class="card-actions"><button class="primary" data-action="review" data-id="${s.id}" data-decision="accept">Accept coding</button><button data-action="review" data-id="${s.id}" data-decision="reject">Reject</button></div>`:`<small class="decision-state">${s.status==='accepted'?'Accepted by researcher':'Rejected · decision recorded'}</small>`}</article>`).join('') || '<div class="empty"><span class="empty-symbol">◇</span><strong>No suggestions in this view</strong><span>Run AI coding or choose another review status.</span></div>';
}
function insightsView() {
  const p=state.project, counts=p.codes.map(c=>({...c,count:p.annotations.filter(a=>a.code_id===c.id).length})).sort((a,b)=>b.count-a.count);
  const max=Math.max(1,...counts.map(c=>c.count));
  return `<div class="view-body"><section class="panel"><h2>Code frequency</h2><p>Each confirmed quotation–code link counts once. Frequency is not importance or a count of participants. Pending suggestions are excluded.</p>${counts.map(c=>`<div class="bar-row"><span>${esc(c.name)}</span><div class="bar-track"><div class="bar-value" style="width:${c.count/max*100}%;background:${esc(c.color)}"></div></div><b>${c.count}</b></div>`).join('')||'<div class="empty">Apply codes to see your research take shape.</div>'}</section><section class="panel"><h2>Document × code</h2><p>Export the complete matrix as CSV for further analysis and plotting.</p><div class="table-wrap"><table><thead><tr><th>Document</th>${p.codes.map(c=>`<th>${esc(c.name)}</th>`).join('')}</tr></thead><tbody>${p.documents.map(d=>`<tr><td>${esc(d.name)}</td>${p.codes.map(c=>`<td>${p.annotations.filter(a=>a.document_id===d.id&&a.code_id===c.id).length}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section></div>`;
}
let plotBlobUrl = null;
async function loadPlotPreview() {
  const img = document.getElementById('plot-preview');
  if (!img) return;
  if (plotBlobUrl) { URL.revokeObjectURL(plotBlobUrl); plotBlobUrl = null; }
  try {
    const response = await fetch(projectUrl('plot') + '?' + plotQuery(),
                                 {headers: {'X-QualiCraft-Token': state.token}});
    if (!response.ok) {
      const problem = await response.json().catch(() => ({error: 'The figure could not be produced.'}));
      throw new Error(problem.error || 'The figure could not be produced.');
    }
    plotBlobUrl = URL.createObjectURL(await response.blob());
    img.src = plotBlobUrl;
    img.classList.remove('loading');
  } catch (error) {
    const stage = img.parentElement;
    if (stage) stage.innerHTML = '<div class="plot-empty"><strong>Could not draw the figure</strong><p>'
      + esc(error.message) + '</p></div>';
  }
}
function plotQuery() {
  const o = state.plotOptions;
  const q = new URLSearchParams();
  Object.keys(o).forEach(k => { if (o[k] !== '' && o[k] !== null) q.set(k, String(o[k])); });
  return q.toString();
}
function plottingView() {
  const conf = state.config.plotting || {};
  if (!state.plotOptions) state.plotOptions = {level:'theme', unit:'paragraph', palette:'viridis',
    cluster:1, method:'ward', annotate:1, title:'', fontsize:9};
  const o = state.plotOptions;
  const codings = state.project.annotations.length;
  const ready = conf.available && codings >= 2;
  const select = (key, choices) => '<select data-plot="' + key + '">'
    + choices.map(([v, label]) => '<option value="' + v + '"' + (String(o[key]) === String(v) ? ' selected' : '') + '>'
        + esc(label) + '</option>').join('') + '</select>';

  const controls = '<div class="plot-controls">'
    + '<label class="field">Group by' + select('level', [['theme','Themes'],['code','Codes']]) + '</label>'
    + '<label class="field">Count within' + select('unit', [['paragraph','Passages'],['document','Documents']]) + '</label>'
    + '<label class="field">Palette' + select('palette', [['viridis','Viridis'],['rocket','Rocket'],['mako','Mako'],['flare','Flare'],['crest','Crest'],['Blues','Blues'],['Reds','Reds']]) + '</label>'
    + '<label class="field">Clustering' + select('cluster', [['1','On'],['0','Off']]) + '</label>'
    + '<label class="field">Linkage' + select('method', [['ward','Ward'],['complete','Complete'],['average','Average'],['single','Single']]) + '</label>'
    + '<label class="field">Show counts' + select('annotate', [['1','Yes'],['0','No']]) + '</label>'
    + '<label class="field">Base font size<select data-plot="fontsize">'
      + [7,8,9,10,11,12].map(n => '<option value="' + n + '"' + (Number(o.fontsize) === n ? ' selected' : '') + '>' + n + ' pt</option>').join('')
      + '</select></label>'
    + '<label class="field">Title<input type="text" data-plot="title" value="' + esc(o.title) + '" placeholder="Optional"></label>'
    + '</div>';

  const stage = !conf.available
    ? '<div class="plot-empty"><strong>The plotting workbench is not installed</strong>'
      + '<p>Figures are drawn by a Python script rather than in the browser, so the same script can be exported and re-run by a co-author. Install the three packages and reopen this view:</p>'
      + '<pre>' + esc(conf.install || 'pip install matplotlib seaborn scipy') + '</pre></div>'
    : codings < 2
      ? '<div class="plot-empty"><strong>Not enough codings yet</strong><p>Co-occurrence needs at least two coded passages before there is anything to plot.</p></div>'
      : '<img class="plot-preview loading" id="plot-preview" alt="Theme co-occurrence heatmap">';

  return '<div class="view-body"><section class="panel"><h2>Figures</h2>'
    + '<p>Two themes co-occur when they are used in the same passage. The figure is drawn by a script on the server, '
    + 'not in the browser, so the preview you see is exactly what the exported script produces.</p>'
    + '<div class="plot-grid">' + controls + '<div class="plot-stage">' + stage + '</div></div>'
    + '<div class="plot-actions">'
    + '<button class="primary" data-action="plot-export"' + (ready ? '' : ' disabled') + '>Download figure + script</button>'
    + '<span class="muted">A folder with the counts as CSV, the script, and the figure as SVG, PDF and 300 dpi PNG.</span>'
    + '</div></section></div>';
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
  state.selectionRect=range.getBoundingClientRect();
  state.selectionSpansParagraphs=first!==last;
  markPendingSelection(range);
  showCodePopup();
}
let pendingRange=null;
function markPendingSelection(range) {
  if(!window.CSS||!CSS.highlights||typeof Highlight==='undefined') return;
  try { pendingRange=range.cloneRange(); CSS.highlights.set('pending', new Highlight(pendingRange)); } catch(e) {}
}
function clearPendingSelection() {
  pendingRange=null;
  if(window.CSS&&CSS.highlights) CSS.highlights.delete('pending');
}
function removeCodePopupDom() {
  const el=$('#code-popup'); if(el) el.remove();
}
function closeCodePopup() {
  removeCodePopupDom();
  clearPendingSelection();
}
function codePopupMatches(query) {
  const needle=query.trim().toLowerCase();
  const all=state.project.codes.map(c=>({code:c, path:codePath(c)}));
  if(!needle) return all.slice(0,8);
  return all.filter(x=>x.path.toLowerCase().includes(needle)).slice(0,8);
}
function showCodePopup() {
  removeCodePopupDom();
  const sel=state.selection; if(!sel) return;
  const host=document.createElement('div');
  host.id='code-popup';
  host.className='code-popup';
  host.innerHTML=`
    <div class="code-popup-row">
      <input id="code-search" type="text" autocomplete="off" spellcheck="false" placeholder="输入关键字，回车即打标">
      <button class="code-popup-x" data-action="close-popup" title="关闭 (Esc)">✕</button>
    </div>
    <div class="code-suggest" id="code-suggest"></div>
    <div class="code-popup-foot">
      <span class="code-popup-count">${sel.end-sel.start} 字符${state.selectionSpansParagraphs?'（跨段）':''}</span>
      <button data-action="annotate">更多选项…</button>
      <button data-action="analyze-selection">AI 分析</button>
    </div>`;
  document.body.appendChild(host);
  renderCodeSuggest('');
  positionCodePopup();
  setTimeout(positionCodePopup,120);
  setTimeout(positionCodePopup,320);
  const input=$('#code-search');
  if(input) {
    input.focus();
    input.addEventListener('input',e=>renderCodeSuggest(e.target.value));
    input.addEventListener('keydown',e=>{
      if(e.key==='Enter'){ e.preventDefault(); submitCodePopup(); }
      else if(e.key==='Escape'){ e.preventDefault(); closeCodePopup(); }
      else if(e.key==='ArrowDown'){ e.preventDefault(); movePopupCursor(1); }
      else if(e.key==='ArrowUp'){ e.preventDefault(); movePopupCursor(-1); }
    });
  }
}
function positionCodePopup() {
  const host=$('#code-popup'); if(!host) return;
  const anchor=pendingRange?pendingRange.getBoundingClientRect():(state.selectionRect||null);
  if(!anchor||(!anchor.width&&!anchor.height)) return;
  const list=$('#code-suggest');
  const vw=window.innerWidth, vh=window.innerHeight, gap=8;
  const above=anchor.top-gap*2, below=vh-anchor.bottom-gap*2;
  const useBelow=below>=above;
  const room=Math.max(130,useBelow?below:above);
  if(list) {
    const chrome=host.getBoundingClientRect().height-(list.getBoundingClientRect().height||0);
    list.style.maxHeight=Math.max(56,Math.min(212,room-chrome))+'px';
  }
  const box=host.getBoundingClientRect();
  let left=anchor.left;
  if(left+box.width>vw-gap) left=Math.max(gap,vw-box.width-gap);
  if(left<gap) left=gap;
  let top=useBelow?anchor.bottom+gap:anchor.top-box.height-gap;
  top=Math.max(gap,Math.min(top,vh-box.height-gap));
  host.style.left=left+'px'; host.style.top=top+'px';
}
function renderCodeSuggest(query) {
  const box=$('#code-suggest'); if(!box) return;
  const needle=query.trim();
  const matches=codePopupMatches(needle);
  const depth=codeDepthMap();
  const exact=matches.some(m=>m.path.toLowerCase()===needle.toLowerCase());
  state.popupMatches=matches;
  state.popupCursor=0;
  const rows=matches.map((m,i)=>`<button class="suggest-row${i===0?' active':''}" data-action="popup-apply" data-id="${m.code.id}">
      <span class="dot" style="background:${esc(m.code.color)}"></span>
      <span class="suggest-name">${esc(m.path)}</span>
      ${(depth.get(m.code.id)||0)>0?'<span class="suggest-tag">子级</span>':''}
    </button>`).join('');
  const createRow=(needle&&!exact)
    ? `<button class="suggest-row create" data-action="popup-create" data-name="${esc(needle)}">＋ 新建编码「${esc(needle)}」并打标</button>`
    : '';
  box.innerHTML=(rows+createRow)||'<div class="suggest-empty">还没有编码，输入关键字即可新建</div>';
}
function movePopupCursor(delta) {
  const rows=[...document.querySelectorAll('#code-suggest .suggest-row')];
  if(!rows.length) return;
  const next=Math.max(0,Math.min(rows.length-1,(state.popupCursor||0)+delta));
  state.popupCursor=next;
  rows.forEach((r,i)=>r.classList.toggle('active',i===next));
  rows[next].scrollIntoView({block:'nearest'});
}
async function applyCodeById(codeId) {
  const sel=state.selection; if(!sel) return;
  await api(projectUrl('annotations'),{document_id:sel.document_id,start:sel.start,end:sel.end,code_id:codeId,memo:''});
  closeCodePopup(); state.selection=null;
  await refresh();
  toast('已打标。');
}
async function createAndApplyCode(name) {
  const code=await api(projectUrl('codes'),{name,definition:'',color:null});
  await refresh();
  await applyCodeById(code.id);
  toast(`已新建编码「${name}」并打标。`);
}
async function submitCodePopup() {
  const input=$('#code-search'); if(!input) return;
  const q=input.value.trim();
  const matches=state.popupMatches||[];
  const exact=matches.find(m=>m.path.toLowerCase()===q.toLowerCase());
  const pick=exact||matches[state.popupCursor||0];
  if(pick) return applyCodeById(pick.code.id);
  if(q) return createAndApplyCode(q);
  toast('先输入关键字，或从列表里选一个编码。',true);
}
function locate(start) {
  if(state.search||state.codeFilter){state.search='';state.codeFilter=null;render();}
  const para=[...document.querySelectorAll('.paragraph')].find(el=>Number(el.dataset.start)<=start&&Number(el.dataset.end)>start);
  if(para){para.scrollIntoView({behavior:'smooth',block:'center'});para.classList.add('flash');setTimeout(()=>para.classList.remove('flash'),1800);}
}
function showImport() {
  modal('Import interview',`<p>Import UTF-8 TXT or DOCX, or paste a transcript. Original line breaks define segments. Use Doctor:/Patient:, Interviewer:/Participant:, or IQ.../IP1: speaker labels. Chinese labels are also supported.</p><label class="field">Choose a file<input id="import-file" type="file" accept=".txt,.docx"><small>DOCX imports paragraph and table text; layout, comments, and headers are not retained.</small></label><label class="field">Document name<input id="document-name" placeholder="e.g. P02 · Care experience" maxlength="200"></label><label class="field">Or paste a transcript<textarea id="document-text" rows="9" placeholder="Doctor: How did the conversation feel?&#10;Patient: ..."></textarea></label>`, '<button data-action="close">Cancel</button><button class="primary" data-action="save-document">Import locally</button>');
}
function showTools() {
  const enabled = state.project.blocks || [];
  const bricks = BLOCKS.map(b => {
    const on = enabled.includes(b.id);
    return '<button type="button" class="brick' + (on ? ' on' : '') + '" data-block="' + b.id + '"'
      + ' aria-pressed="' + on + '">'
      + '<span class="brick-grip" aria-hidden="true"></span>'
      + '<span class="brick-body"><strong>' + esc(b.name) + '</strong>'
      + '<span>' + esc(b.desc) + '</span></span>'
      + '<span class="brick-state">' + (on ? 'Added' : 'Add') + '</span></button>';
  }).join('');
  modal('Capability blocks',
    '<p>The core is always there: <strong>documents, codes and codings</strong>. Everything else is a block — '
    + 'click one to add it to this project and the interface grows to match. Click again to take it away. '
    + 'Which blocks a study used is stored with the project, so it becomes part of the record.</p>'
    + '<div class="block-tray">' + bricks + '</div>',
    '<button data-action="close">Cancel</button><button class="primary" data-action="save-blocks">Save blocks</button>');
}
function showCode(parentId=null) {
  const parents=state.project.codes;
  modal('Create code',`<label class="field">Code name<input id="code-name" maxlength="160" placeholder="e.g. Information barriers"></label><label class="field">Definition and inclusion criteria<textarea id="code-definition" rows="4" placeholder="Describe when to use this code and when to exclude it."></textarea></label>${parents.length&&hasBlock('hierarchy')?`<label class="field">Group under (optional)<select id="code-parent"><option value="">— top level —</option>${parents.map(c=>`<option value="${c.id}" ${parentId===c.id?'selected':''}>${esc(codePath(c))}</option>`).join('')}</select><small>Choosing a parent makes this a sub-code. Grouping codes under a theme is what turns a flat tag list into a codebook.</small></label>`:''}<label class="field">Color<input id="code-color" type="color" value="#427d77"></label>`, '<button data-action="close">Cancel</button><button class="primary" data-action="save-code">Save code</button>');
}
function showCodeEdit(id) {
  const c=state.project.codes.find(x=>x.id===id); if(!c) return;
  const blocked=codeDescendants(id);
  const {own,total}=codeCounts();
  const others=state.project.codes.filter(x=>x.id!==id);
  modal('Edit code', `
    <label class="field">Name<input id="ec-name" maxlength="160" value="${esc(c.name)}"></label>
    <label class="field">Definition<textarea id="ec-definition" rows="3" placeholder="What this code means.">${esc(c.definition)}</textarea></label>
    <div class="form-row">
      <label class="field${hasBlock('hierarchy')?'':' block-off'}">Group under<select id="ec-parent"><option value="">— top level —</option>${others.map(o=>`<option value="${o.id}"${c.parent_id===o.id?' selected':''}${blocked.has(o.id)?' disabled':''}>${esc(codePath(o))}${blocked.has(o.id)?' — its own sub-code':''}</option>`).join('')}</select></label>
      <label class="field">Status<select id="ec-status">${[['emergent','Emergent'],['provisional','Provisional'],['final','Final']].map(([v,t])=>`<option value="${v}"${c.status===v?' selected':''}>${t}</option>`).join('')}</select></label>
    </div>
    <label class="field${hasBlock('memos')?'':' block-off'}">Code / theme memo<textarea id="ec-memo" rows="3" placeholder="How is this code or theme developing?">${esc(c.memo||'')}</textarea></label>
    <div class="form-row">
      <label class="field">Inclusion criteria<textarea id="ec-inclusion" rows="2" placeholder="Use this code when…">${esc(c.inclusion||'')}</textarea></label>
      <label class="field">Exclusion criteria<textarea id="ec-exclusion" rows="2" placeholder="Do not use it when…">${esc(c.exclusion||'')}</textarea></label>
    </div>
    <label class="field">Anchor examples (one per line)<textarea id="ec-anchors" rows="3" placeholder="Typical quotations that illustrate this code.">${esc((c.anchor_examples||[]).join('\n'))}</textarea></label>
    <label class="field">Colour<input id="ec-color" type="color" value="${esc(c.color)}"></label>
    <div class="notice">${own.get(id)||0} direct coding(s) · ${total.get(id)||0} including sub-codes · ${blocked.size} sub-code(s).</div>`,
    `<button class="danger" data-action="code-delete-ask" data-id="${id}">Delete</button>${others.length?`<button data-action="code-merge-ask" data-id="${id}">Merge into…</button>`:''}<button data-action="close">Cancel</button><button class="primary" data-action="code-save" data-id="${id}">Save changes</button>`);
}
function showCodeDeleteAsk(id) {
  const c=state.project.codes.find(x=>x.id===id); if(!c) return;
  const {own}=codeCounts();
  const kids=codeDescendants(id).size;
  modal('Delete code', `<p>Delete <b>${esc(c.name)}</b>?</p>
    <div class="notice">${own.get(id)||0} coding(s) will be removed from the transcript.${kids?` ${kids} sub-code(s) will move up to the level above.`:''} The removal is written to the audit trail but cannot be undone from the interface.</div>`,
    `<button data-action="close">Cancel</button><button class="danger" data-action="code-delete" data-id="${id}">Delete code</button>`);
}
function showMergeAsk(id) {
  const src=state.project.codes.find(x=>x.id===id); if(!src) return;
  const others=state.project.codes.filter(x=>x.id!==id);
  modal('Merge code', `<p>Move every coding from <b>${esc(src.name)}</b> into another code, then remove it.</p>
    <label class="field">Merge into<select id="merge-target">${others.map(o=>`<option value="${o.id}">${esc(codePath(o))}</option>`).join('')}</select></label>
    <div class="notice">Sub-codes of <b>${esc(src.name)}</b> are re-parented to the target. A coding that would duplicate an existing target coding on the same passage is collapsed rather than copied.</div>`,
    `<button data-action="close">Cancel</button><button class="primary" data-action="code-merge" data-id="${id}">Merge</button>`);
}
function showAnnotation() {
  if(!state.selection||state.selection.document_id!==state.docId) throw new Error('Select a passage in the transcript first.');
  if(!state.project.codes.length) {showCode();return;}
  modal('Code this passage',`<blockquote class="big-quote">${esc(cut(doc().text,state.selection.start,state.selection.end))}</blockquote><label class="field">Select a code<select id="annotation-code">${state.project.codes.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></label><label class="field${hasBlock('memos')?'':' block-off'}">Research memo (optional)<textarea id="annotation-memo" rows="3" placeholder="Record your interpretation or a question for comparison."></textarea></label>`, '<button data-action="close">Cancel</button><button class="primary" data-action="save-annotation">Apply code</button>');
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
  modal('Research projects',`<label class="field">Existing projects<select id="modal-project-select">${state.projects.map(p=>`<option value="${p.id}" ${p.id===state.project.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label><button data-action="switch-project">Open project</button><hr style="border:0;border-top:1px solid #e3e7e2;margin:22px 0"><label class="field">New project name<input id="new-project-name" placeholder="e.g. Experiences of outpatient care" maxlength="160"></label><button class="primary" data-action="new-project">Create project</button><div class="option-grid"><button class="option-card" data-action="grounded-project"><strong>Tian 2021 · software architecture interviews</strong><span>Import 8 semi-structured practitioner interviews. IP1–IP2 pair Chinese responses with English translations; IP3–IP8 are in English.</span></button><button class="option-card" data-action="demo-project"><strong>Fictional care interview</strong><span>Explore a fictional transcript, sample coding, and fixed review suggestions.</span></button><button class="option-card" data-action="benchmark-project"><strong>TU Delft · blind workspace</strong><span>Import 7 transcripts and 54 codes, without reference annotations.</span></button><button class="option-card" data-action="reference-project"><strong>TU Delft · researcher reference</strong><span>Explore 377 researcher annotations for comparison. These are not model predictions.</span></button><button class="option-card" data-action="restore-pick"><strong>Restore project JSON</strong><span>Restore a backup as a new project while keeping the original.</span></button></div><input id="restore-file" type="file" accept=".json" hidden><p>Guide collections are imported from the local Guide directory and retain source provenance in the project audit trail.</p>`);
}
function showExport() {
  modal('Export your research',`<p>Files are saved to your browser download folder. Full project exports include source transcripts; handle them as research data.</p><div class="option-grid"><button class="option-card" data-action="download" data-format="json"><strong>Full project · JSON</strong><span>Transcripts, codebook, codings, suggestions, and activity. Restore later to continue.</span></button><button class="option-card" data-action="download" data-format="csv"><strong>Codings · CSV</strong><span>Document, code, source quote, character offsets, memo, and provenance.</span></button><button class="option-card" data-action="download" data-format="matrix"><strong>Document × code · CSV</strong><span>Confirmed codings only, ready for Excel, R, or Python.</span></button><button class="option-card" data-action="download" data-format="methods"><strong>Methods record · Markdown</strong><span>How the analysis was actually carried out, assembled from your audit trail. Draft the methods section from it.</span></button></div>`);
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
  if(a==='toggle-code'){const id=button.dataset.id;state.collapsed.has(id)?state.collapsed.delete(id):state.collapsed.add(id);render();return;}
  if(a==='code-edit')return showCodeEdit(button.dataset.id);
  if(a==='code-delete-ask')return showCodeDeleteAsk(button.dataset.id);
  if(a==='code-merge-ask')return showMergeAsk(button.dataset.id);
  if(a==='clear-filter'){state.codeFilter=null;state.search='';render();return;}
  if(a==='import')return showImport();
  if(a==='code')return showCode();
  if(a==='tools')return showTools();
  if(a==='save-blocks'){
    const picked=[...document.querySelectorAll('#dialog .brick.on')].map(x=>x.dataset.block);
    await api(projectUrl('blocks'),{blocks:picked});
    if(!picked.includes(state.view)&&state.view!=='coding')state.view='coding';
    closeModal();await refresh();
    toast('Capability blocks updated.');return;
  }
  if(a==='settings')return showSettings();
  if(a==='projects')return showProjects();
  if(a==='export')return showExport();
  if(a==='annotate'){closeCodePopup();return showAnnotation();}
  if(a==='analyze'||a==='analyze-selection'){closeCodePopup();return showAnalyze(a==='analyze-selection');}
  if(a==='close-popup'){closeCodePopup();return;}
  if(a==='popup-apply'){await applyCodeById(button.dataset.id);return;}
  if(a==='popup-create'){await createAndApplyCode(button.dataset.name);return;}
  if(a==='locate')return locate(Number(button.dataset.start));
  if(a==='preview-analysis')return previewAnalysis();
  if(a==='save-document'){
    const file=$('#import-file').files[0];
    const body={name:$('#document-name').value||file?.name,text:$('#document-text').value};
    if(file){if(file.size>8_000_000)throw new Error('File exceeds 8 MB.'); if(/\.docx$/i.test(file.name)){const bytes=new Uint8Array(await file.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));body.docx_base64=btoa(binary);delete body.text;}else if(/\.txt$/i.test(file.name)){body.text=new TextDecoder('utf-8',{fatal:true}).decode(await file.arrayBuffer());}else throw new Error('Choose a TXT or DOCX file.');}
    const d=await api(projectUrl('documents'),body);state.docId=d.id;state.selection=null;closeModal();await refresh();toast('Interview imported.');return;
  }
  if(a==='save-code'){await api(projectUrl('codes'),{name:$('#code-name').value,definition:$('#code-definition').value,color:$('#code-color').value,parent_id:$('#code-parent')?$('#code-parent').value||null:null});closeModal();await refresh();toast('Code saved.');return;}
  if(a==='code-save'){
    const id=button.dataset.id;
    await api(projectUrl('code-update'),{id,changes:{
      name:$('#ec-name').value, definition:$('#ec-definition').value, color:$('#ec-color').value,
      parent_id:$('#ec-parent').value||null, status:$('#ec-status').value, memo:$('#ec-memo').value,
      inclusion:$('#ec-inclusion').value, exclusion:$('#ec-exclusion').value,
      anchor_examples:$('#ec-anchors').value.split('\n').map(x=>x.trim()).filter(Boolean)}});
    closeModal();await refresh();toast('Code updated.');return;
  }
  if(a==='code-delete'){
    const id=button.dataset.id;
    const result=await api(projectUrl('code-delete'),{id});
    if(state.codeFilter===id)state.codeFilter=null;
    closeModal();await refresh();
    toast(`Deleted “${result.name}” · ${result.codings_removed} coding(s) removed${result.children_reparented?` · ${result.children_reparented} sub-code(s) moved up`:''}.`);return;
  }
  if(a==='code-merge'){
    const id=button.dataset.id, target=$('#merge-target').value;
    const result=await api(projectUrl('code-merge'),{source_id:id,target_id:target});
    if(state.codeFilter===id)state.codeFilter=null;
    closeModal();await refresh();
    toast(`Merged “${result.source}” into “${result.target}” · ${result.codings_moved} coding(s) moved${result.duplicates_collapsed?` · ${result.duplicates_collapsed} duplicate(s) collapsed`:''}.`);return;
  }
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
  if(a==='grounded-project')return createProject({kind:'grounded_examples'});
  if(a==='benchmark-project')return createProject({kind:'benchmark'});
  if(a==='reference-project')return createProject({kind:'reference'});
  if(a==='restore-pick'){$('#restore-file').click();return;}
  if(a==='plot-export'){
    const response=await fetch(projectUrl('plot-bundle')+'?'+plotQuery(),{headers:{'X-QualiCraft-Token':state.token}});
    if(!response.ok){
      const problem=await response.json().catch(()=>({error:'The figure could not be produced.'}));
      throw new Error(problem.error||'The figure could not be produced.');
    }
    const url=URL.createObjectURL(await response.blob()),link=document.createElement('a');
    link.href=url;link.download='qualicraft-figure.zip';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    toast('Figure, counts and script exported.');
    return;
  }
  if(a==='download'){
    const format=button.dataset.format,response=await fetch(projectUrl('export')+'?format='+format,{headers:{'X-QualiCraft-Token':state.token}});
    if(!response.ok)throw new Error('Export failed.');const url=URL.createObjectURL(await response.blob()),link=document.createElement('a');link.href=url;link.download='qualicraft-'+(format==='json'?'project.json':format==='methods'?'methods.md':format+'.csv');link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Exported to your browser download folder.');return;
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
document.addEventListener('click',e=>{
  const brick=e.target.closest('.brick'); if(!brick) return;
  const on=brick.classList.toggle('on');
  brick.setAttribute('aria-pressed',String(on));
  const state_=brick.querySelector('.brick-state'); if(state_) state_.textContent=on?'Added':'Add';
});
document.addEventListener('change',async e=>{
  if(e.target.dataset&&e.target.dataset.plot){state.plotOptions[e.target.dataset.plot]=e.target.value;render();return;}

  try{
    if(e.target.id==='project-select')await loadProject(e.target.value);
    if(e.target.id==='review-filter'){state.reviewFilter=e.target.value;render();}
    if(e.target.id==='send-confirm')$('[data-action="start-analysis"]').disabled=!e.target.checked;
    if(e.target.id==='import-file'&&e.target.files[0])$('#document-name').value=e.target.files[0].name.replace(/\.(txt|docx)$/i,'');
    if(e.target.id==='restore-file'&&e.target.files[0]){if(e.target.files[0].size>20_000_000)throw new Error('Project file exceeds 20 MB.');await createProject({kind:'restore',project:JSON.parse(await e.target.files[0].text())});}
  }catch(error){errorDisplay(error);}
});
document.addEventListener('input',e=>{if(e.target.id==='search'){state.search=e.target.value;state.selection=null;closeCodePopup();$('#reader').innerHTML=readerHtml();}});
let docMemoTimer=null;
document.addEventListener('input',e=>{
  if(e.target.id!=='doc-memo')return;
  const doc=state.project.documents.find(d=>d.id===state.docId);
  if(doc)doc.memo=e.target.value;
  const badge=$('#doc-memo-state');
  if(badge)badge.textContent='\u2026';
  clearTimeout(docMemoTimer);
  docMemoTimer=setTimeout(async()=>{
    const target=$('#doc-memo-state');
    try{
      await api(projectUrl('document-update'),{id:state.docId,changes:{memo:e.target.value}});
      if(target){target.textContent='saved';setTimeout(()=>{if(target.isConnected)target.textContent='';},1600);}
    }catch(error){
      if(target)target.textContent='not saved';
    }
  },900);
});
document.addEventListener('mouseup',e=>{if(e.target.closest('#reader'))selectionUpdate();});
document.addEventListener('keyup',e=>{if(e.shiftKey&&e.target.closest('#reader'))selectionUpdate();});
document.addEventListener('mousedown',e=>{if(!e.target.closest('#code-popup')&&!e.target.closest('#reader')&&!e.target.closest('dialog'))closeCodePopup();});
window.addEventListener('scroll',()=>positionCodePopup(),true);
window.addEventListener('resize',()=>positionCodePopup());
async function init(){try{const boot=await api('/api/bootstrap');state.token=boot.token;state.projects=boot.projects;state.config=boot.config;await loadProject(state.projects[0].id);state.jobs=await api('/api/jobs');renderJob();if(state.jobs.some(j=>j.status==='running'))startPolling();}catch(error){$('#app').innerHTML=`<div class="loading">Could not open workspace: ${esc(error.message)}. Check that the local server is running, then refresh.</div>`;}}
init();
