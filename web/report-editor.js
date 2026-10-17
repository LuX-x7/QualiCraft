/* Researcher writing, saved versions and explicit evidence refresh. No model calls. */
(() => {
  const escape = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fields = {title:200,research_question:4000,case_unit:2000,analysis_unit:2000,approach:4000,method_notes:20000,reflexivity:20000,quality_notes:20000,narrative:100000,counterexamples:20000,limitations:20000,disclosure:10000};
  const labels = {title:['Report title','报告标题'],research_question:['Research question','研究问题'],case_unit:['Case definition','案例定义'],analysis_unit:['Analysis unit','分析单位'],approach:['Analytic approach','分析取向'],method_notes:['Method and decisions','方法与决策'],reflexivity:['Reflexivity','反身性记录'],quality_notes:['Quality and review','质量与审核'],narrative:['Narrative Analysis','叙述分析'],counterexamples:['Counterexamples and variation','反例与差异'],limitations:['Limitations','局限'],disclosure:['Research and assistance disclosure','研究与辅助工具披露']};
  let editor = null;
  const clone = x => JSON.parse(JSON.stringify(x));
  function blank(name,method,checks) {return {...Object.fromEntries(Object.keys(fields).map(k=>[k,''])),title:name+' analysis',method,rows:[],checks:Object.fromEntries(checks[method].map(k=>[k,false]))};}
  async function open(env) {
    const context = await env.request(env.endpoint+'/report');
    const dialog = document.querySelector('#dialog'),abort = new AbortController(),signal=abort.signal;
    const L=(en,zh)=>env.lang==='zh'?zh:en;
    const e=editor={env,context,draft:clone(context.state?.current.draft??blank(env.project.name,'content',context.checks)),dirty:false,tab:'setup',page:0,evidencePage:0,activeRow:null,previewId:null,useHierarchy:false};
    const status=()=>{const el=dialog.querySelector('#report-save-state');if(el)el.textContent=e.dirty?L('Unsaved writing','写作未保存'):e.context.state?L('Saved locally · version ','本地已保存 · 版本 ')+e.context.state.revision:L('New draft · not saved','新草稿 · 未保存');};
    const dirty=()=>{if(!e.dirty){e.dirty=true;status();}};
    const field=k=>`<label class="field">${L(...labels[k])}${k==='title'?`<input data-report-field="${k}" maxlength="${fields[k]}" value="${escape(e.draft[k])}">`:`<textarea data-report-field="${k}" maxlength="${fields[k]}" rows="${k==='narrative'?16:4}">${escape(e.draft[k])}</textarea>`}</label>`;
    const selectedRow=()=>e.draft.rows.find(r=>r.id===e.activeRow)??e.draft.rows[0];
    const currentBindings=()=>e.context.stale?e.context.state.current.bindings:e.context.catalog;
    function error(message){const el=dialog.querySelector('#modal-error');el.className='inline-error';el.textContent=message;}
    function render() {
      const nav=[['setup',L('Method','方法')],['table','Analysis Table'],['narrative','Narrative Analysis'],['evidence',L('Evidence','证据')],['versions',L('Versions','版本')],['preview',L('Preview & download','预览与下载')]];
      let content='';
      if(e.tab==='setup')content=`${field('title')}<label class="field">${L('Method','研究方法')}<select id="report-method">${Object.entries(e.context.methods).map(([id,name])=>`<option value="${id}" ${id===e.draft.method?'selected':''}>${escape(name)}</option>`).join('')}</select></label><p class="report-help">${L('Changing method preserves writing and table rows, resets the review checklist, and is recorded on the next Save. Comparative QCA remains a separate planned workflow.','切换方法保留写作和表格，重置审核清单，在下次保存时记录。Comparative QCA 仍为独立待实现流程。')}</p>${['research_question','case_unit','analysis_unit','approach','method_notes'].map(field).join('')}<fieldset class="report-checks"><legend>${L('Your method review','研究者方法审核')}</legend>${e.context.checks[e.draft.method].map(k=>`<label><input type="checkbox" data-report-check="${k}" ${e.draft.checks[k]?'checked':''}>${escape(k.replaceAll('-',' '))}</label>`).join('')}</fieldset><p class="report-help">${L('Checks record your confirmation. They do not certify research quality.','勾选记录研究者确认，不是研究质量认证。')}</p>`;
      if(e.tab==='table') {
        const codes=currentBindings().codes;
        content=`<p class="report-help">${L('Theme and Category labels belong to this report. Editing them does not rename the codebook.','主题／类别标签属于此报告；编辑不会重命名码本。')}</p><div class="report-add"><label class="field">${L('Saved code','已保存编码')}<select id="report-add-code">${Object.values(codes).map(c=>`<option value="${c.id}">${escape(c.path)}</option>`).join('')}</select></label><button data-report-action="add">${L('Add row','添加一行')}</button><button data-report-action="add-coded">${L('Start from saved codings','从已保存标注起步')}</button></div><label class="report-help"><input type="checkbox" id="report-start-labels" ${e.useHierarchy?'checked':''}>${L('Use saved hierarchy as starting labels for my review','使用保存层级作为待审核的起始标签')}</label><p>${e.draft.rows.length} ${L('rows','行')}</p>`;
        e.page=Math.min(e.page,Math.max(0,Math.ceil(e.draft.rows.length/10)-1));
        content+=e.draft.rows.slice(e.page*10,e.page*10+10).map((r,i)=>`<details class="report-row" open data-row-id="${r.id}"><summary>${L('Row','行')} ${e.page*10+i+1} · ${escape(r.code_ids.map(id=>codes[id]?.name??e.context.state?.current.bindings.codes[id]?.name??id).join(' / '))}</summary><div class="report-row-labels"><label class="field">Theme<input data-report-row="${r.id}" data-report-cell="theme" maxlength="1000" value="${escape(r.theme)}"></label><label class="field">Category<input data-report-row="${r.id}" data-report-cell="category" maxlength="1000" value="${escape(r.category)}"></label></div><label class="field">Codes<select multiple size="3" data-report-row="${r.id}" data-report-cell="code_ids">${[...new Map([...Object.values(codes),...r.code_ids.filter(id=>!codes[id]).map(id=>({id,name:id,path:'Unavailable · '+id}))].map(c=>[c.id,c])).values()].map(c=>`<option value="${c.id}" ${r.code_ids.includes(c.id)?'selected':''}>${escape(c.path)}</option>`).join('')}</select></label><label class="field">${L('Row interpretation','本行解读')}<textarea rows="3" maxlength="10000" data-report-row="${r.id}" data-report-cell="interpretation">${escape(r.interpretation)}</textarea></label><div class="report-row-actions"><button data-report-action="row-evidence" data-row="${r.id}">${L('Choose evidence','选择证据')} (${r.evidence_ids.length})</button><button data-report-action="up" data-row="${r.id}">${L('Move up','上移')}</button><button data-report-action="down" data-row="${r.id}">${L('Move down','下移')}</button><button data-report-action="remove" data-row="${r.id}">${L('Remove row','移除此行')}</button></div></details>`).join('');
        content+=`<div class="report-pager"><button data-report-action="prev" ${e.page===0?'disabled':''}>${L('Previous','上一页')}</button><span>${e.page+1} / ${Math.max(1,Math.ceil(e.draft.rows.length/10))}</span><button data-report-action="next" ${(e.page+1)*10>=e.draft.rows.length?'disabled':''}>${L('Next','下一页')}</button></div>`;
      }
      if(e.tab==='narrative')content=`<p class="report-help">${L('Write your interpretation. Add source references from Evidence; they are checked against selected quotations.','请写下研究者解读。可从证据页插入来源引用，保存时核对关联。')}</p>${['narrative','reflexivity','quality_notes','counterexamples','limitations','disclosure'].map(field).join('')}`;
      if(e.tab==='evidence') {
        const row=selectedRow();if(row)e.activeRow=row.id;
        const list=row?Object.values(currentBindings().evidence).filter(a=>row.code_ids.includes(a.code_id)):[];
        e.evidencePage=Math.min(e.evidencePage,Math.max(0,Math.ceil(list.length/20)-1));
        content=`<p class="report-help">${L('Select saved quotations for a table row. Source text and ranges stay read-only. The report may contain interview text.','为表格行选择已保存原句，原文和范围只读。报告可能包含访谈正文。')}</p><label class="field">${L('Table row','表格行')}<select id="report-evidence-row">${e.draft.rows.map((r,i)=>`<option value="${r.id}" ${r.id===row?.id?'selected':''}>${i+1} · ${escape(r.theme||L('Untitled','未命名'))}</option>`).join('')}</select></label>${!row?L('Add a table row first.','请先添加表格行。'):list.slice(e.evidencePage*20,e.evidencePage*20+20).map(a=>`<article class="report-quote"><label><input type="checkbox" data-report-evidence="${a.id}" ${row.evidence_ids.includes(a.id)?'checked':''}>${escape(a.document_name)} · [${a.start}, ${a.end})</label><blockquote>${escape(a.quote)}</blockquote><button data-report-action="insert-reference" data-evidence="${a.id}" ${row.evidence_ids.includes(a.id)?'':'disabled'}>${L('Insert reference in narrative','在叙述中插入引用')}</button><button data-report-action="locate-source" data-evidence="${a.id}">${L('Locate in source','定位原文')}</button><details><summary>${L('Saved identity','保存的身份')}</summary><p class="report-help">${escape(a.id)}<br>${escape(currentBindings().codes[a.code_id]?.path??a.code_id)}</p></details></article>`).join('')}<div class="report-pager"><button data-report-action="e-prev" ${e.evidencePage===0?'disabled':''}>${L('Previous','上一页')}</button><span>${list.length} ${L('saved quotations','条已保存原句')}</span><button data-report-action="e-next" ${(e.evidencePage+1)*20>=list.length?'disabled':''}>${L('Next','下一页')}</button></div>`;
      }
      if(e.tab==='versions') {
        const history=e.context.state?.history??[];
        content=`<p class="report-help">${L('Restore creates a new report version and keeps the current version in history. The first and nine most recent historical versions are retained. Project JSON includes all retained versions.','恢复会创建新报告版本，当前版进入历史。保留首版及最近九个历史版本；项目 JSON 包含所有保留版本。')}</p><label class="field">${L('Compare saved version with current writing','对比已保存版本与当前写作')}<select id="report-history"><option value="">${L('Choose version','选择版本')}</option>${history.toReversed().map(v=>`<option value="${v.id}">${v.revision} · ${escape(v.saved_at)} · ${escape(e.context.methods[v.draft.method])}</option>`).join('')}</select></label><div id="report-comparison"></div><button data-report-action="restore">${L('Restore selected as a new version','将所选恢复为新版本')}</button>`;
      }
      if(e.tab==='preview')content=`<p class="report-help">${L('Preview and downloads use a saved version. Save your latest writing first. Word edits remain in Word.','预览与下载使用已保存版本，请先保存最新写作。Word 编辑保留在 Word 内。')}</p><div class="report-downloads">${['html','docx','json'].map(fmt=>`<button data-report-action="download" data-format="${fmt}" ${!e.context.state||e.dirty?'disabled':''}>${L('Download','下载')} ${fmt==='docx'?'editable Word':fmt.toUpperCase()}</button>`).join('')}</div><div id="report-download-status" role="status"></div><iframe id="report-preview" title="Saved research report preview" sandbox=""></iframe>`;
      env.modal(L('Research report','研究报告'),`<div class="report-toolbar"><span id="report-save-state" role="status"></span><button data-report-action="save" ${env.readonly?'disabled':''}>${L('Save version','保存版本')}</button></div>${e.context.stale?`<div class="notice">${L('Coding evidence changed. Writing stays editable; saved quotations stay frozen. Refresh deliberately to use current evidence.','编码证据已变化。写作仍可编辑，保存的引文保持冻结；如需使用当前证据，请明确刷新。')}<button data-report-action="refresh" ${env.readonly?'disabled':''}>${L('Refresh evidence and save','刷新证据并保存')}</button></div>`:''}<div role="tablist" aria-label="Report sections" class="report-tabs">${nav.map(([id,label])=>`<button role="tab" id="report-tab-${id}" data-report-tab="${id}" aria-selected="${e.tab===id}" aria-controls="report-panel" tabindex="${e.tab===id?0:-1}">${label}</button>`).join('')}</div><section role="tabpanel" aria-labelledby="report-tab-${e.tab}" id="report-panel">${content}</section><div id="report-discard" hidden class="notice">${L('Keep your unsaved writing: save it, or explicitly discard it to close.','有未保存写作：请保存，或明确丢弃后关闭。')}<button data-report-action="discard">${L('Discard unsaved writing and close','丢弃未保存写作并关闭')}</button></div>`);
      dialog.dataset.workflow='report';status();
      if(e.tab==='preview'&&e.context.state&&!e.dirty){const id=e.context.state.current.id,frame=dialog.querySelector('#report-preview');env.fetchFile(env.endpoint+'/export?format=report-html&version_id='+encodeURIComponent(id)).then(async res=>{const html=await res.text();if(!res.ok)throw Error(L('Preview could not be loaded','无法加载预览'));if(frame.isConnected&&editor===e&&e.context.state?.current.id===id)frame.srcdoc=html;}).catch(err=>{if(frame.isConnected&&editor===e)error(err.message);});}
    }
    function add(codeId) {
      if(!codeId)return;
      const row={id:crypto.randomUUID().replaceAll('-',''),theme:'',category:'',code_ids:[codeId],interpretation:'',evidence_ids:[]};
      if(e.useHierarchy)Object.assign(row,startingLabels(env.project.codes,codeId));
      e.draft.rows.push(row);e.activeRow=row.id;dirty();
    }
    async function lockedSave(action) {
      if(env.readonly)throw Error(L('This example is read-only','此演示只读'));
      if(e.saving)return;e.saving=true;
      const locked=[...dialog.querySelectorAll('button,input,textarea,select')].map(el=>[el,el.disabled]);locked.forEach(([el])=>el.disabled=true);
      try {await action();}finally {e.saving=false;locked.forEach(([el,disabled])=>{if(el.isConnected)el.disabled=disabled;});}
    }
    async function save(refresh=false) {
      await lockedSave(async()=>{
        const updated=await env.request(env.endpoint+'/report-save',{revision:e.context.state?.revision??0,source_version:e.context.source_version,draft:clone(e.draft),refresh_evidence:refresh});
        e.context=await env.request(env.endpoint+'/report');e.draft=clone(updated.current.draft);e.dirty=false;await env.onSaved();render();
      });
    }
    dialog.addEventListener('input',ev=>{
      const t=ev.target;if(t.dataset.reportField){e.draft[t.dataset.reportField]=t.value;dirty();}
      if(t.dataset.reportRow&&t.dataset.reportCell!=='code_ids'){const row=e.draft.rows.find(r=>r.id===t.dataset.reportRow);row[t.dataset.reportCell]=t.value;dirty();}
    },{signal});
    dialog.addEventListener('change',ev=>{
      const t=ev.target;
      if(t.id==='report-start-labels')e.useHierarchy=t.checked;
      if(t.id==='report-method'){e.draft.method=t.value;e.draft.checks=Object.fromEntries(e.context.checks[t.value].map(k=>[k,false]));dirty();render();}
      if(t.dataset.reportCheck){e.draft.checks[t.dataset.reportCheck]=t.checked;dirty();}
      if(t.dataset.reportCell==='code_ids'){const row=e.draft.rows.find(r=>r.id===t.dataset.reportRow);row.code_ids=[...t.selectedOptions].map(o=>o.value);row.evidence_ids=row.evidence_ids.filter(id=>row.code_ids.includes(currentBindings().evidence[id]?.code_id));dirty();}
      if(t.id==='report-evidence-row'){e.activeRow=t.value;e.evidencePage=0;render();}
      if(t.dataset.reportEvidence){const row=selectedRow(),id=t.dataset.reportEvidence;row.evidence_ids=t.checked?[...new Set([...row.evidence_ids,id])]:row.evidence_ids.filter(x=>x!==id);dirty();render();}
      if(t.id==='report-history'){const old=e.context.state.history.find(v=>v.id===t.value);dialog.querySelector('#report-comparison').innerHTML=old?`<p>${L('Changed fields','已改变字段')}: ${escape([...Object.keys(fields),'method','rows','checks'].filter(k=>JSON.stringify(old.draft[k])!==JSON.stringify(e.draft[k])).join(', ')||L('none','无'))}</p><div class="report-compare"><article><h3>${L('Selected saved narrative','所选历史叙述')}</h3><p>${escape(old.draft.narrative)}</p></article><article><h3>${L('Current writing','当前写作')}</h3><p>${escape(e.draft.narrative)}</p></article></div>`:'';}
    },{signal});
    dialog.addEventListener('click',async ev=>{
      const tab=ev.target.closest('[data-report-tab]');if(tab){e.tab=tab.dataset.reportTab;render();dialog.querySelector('#report-tab-'+e.tab)?.focus();return;}
      const button=ev.target.closest('[data-report-action]');if(!button||button.disabled)return;
      const action=button.dataset.reportAction;button.disabled=true;
      try {
        if(action==='save'||action==='refresh')await save(action==='refresh');
        else if(action==='add'){add(dialog.querySelector('#report-add-code').value);e.page=Math.floor((e.draft.rows.length-1)/10);render();}
        else if(action==='add-coded'){const present=new Set(e.draft.rows.flatMap(r=>r.code_ids));for(const a of Object.values(currentBindings().evidence)){if(!present.has(a.code_id)){add(a.code_id);present.add(a.code_id);}}render();}
        else if(action==='remove'){e.draft.rows=e.draft.rows.filter(r=>r.id!==button.dataset.row);dirty();render();}
        else if(action==='up'||action==='down'){const i=e.draft.rows.findIndex(r=>r.id===button.dataset.row),j=i+(action==='up'?-1:1);if(j>=0&&j<e.draft.rows.length){[e.draft.rows[i],e.draft.rows[j]]=[e.draft.rows[j],e.draft.rows[i]];dirty();render();}}
        else if(action==='row-evidence'){e.activeRow=button.dataset.row;e.evidencePage=0;e.tab='evidence';render();}
        else if(action==='prev'||action==='next'){e.page+=action==='next'?1:-1;render();}
        else if(action==='e-prev'||action==='e-next'){e.evidencePage+=action==='e-next'?1:-1;render();}
        else if(action==='insert-reference'){e.draft.narrative+=' [E:'+button.dataset.evidence+']';dirty();e.tab='narrative';render();dialog.querySelector('[data-report-field="narrative"]').focus();}
        else if(action==='restore'){if(e.dirty)throw Error(L('Save your current writing before restoring.','请先保存当前写作再恢复。'));const id=dialog.querySelector('#report-history').value;if(!id)throw Error(L('Choose a version.','请选择版本。'));await lockedSave(async()=>{await env.request(env.endpoint+'/report-restore',{revision:e.context.state.revision,version_id:id});e.context=await env.request(env.endpoint+'/report');e.draft=clone(e.context.state.current.draft);await env.onSaved();render();});}
        else if(action==='download'){const response=await env.fetchFile(env.endpoint+'/export?format=report-'+button.dataset.format);if(!response.ok)throw Error(L('Download failed. Save the report first.','下载失败，请先保存报告。'));const blob=await response.blob(),name='qt-research-report-'+e.context.state.current.id.slice(0,12)+'.'+button.dataset.format,url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);dialog.querySelector('#report-download-status').textContent=name+' · '+blob.size+' bytes · '+L('Sent to browser. Check downloads for completion.','已发送至浏览器，请检查下载完成。');}
        else if(action==='locate-source'){if(e.dirty)throw Error(L('Save your writing before locating the source.','请先保存写作再定位原文。'));await env.onLocate(currentBindings().evidence[button.dataset.evidence]);}
        else if(action==='discard'){e.dirty=false;dialog.close();}
      }catch(err){error(err.message);}finally{if(button.isConnected)button.disabled=false;}
    },{signal});
    dialog.addEventListener('keydown',ev=>{
      if((ev.ctrlKey||ev.metaKey)&&ev.key.toLowerCase()==='s'){ev.preventDefault();save().catch(err=>error(err.message));}
      if(ev.target.matches('[data-report-tab]')&&['ArrowRight','ArrowLeft','Home','End'].includes(ev.key)){ev.preventDefault();const tabs=[...dialog.querySelectorAll('[data-report-tab]')],i=tabs.indexOf(ev.target);tabs[ev.key==='Home'?0:ev.key==='End'?tabs.length-1:(i+(ev.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length].click();}
    },{signal});
    function guard(ev){if(e.saving){ev.preventDefault();ev.stopImmediatePropagation();return;}if(e.dirty){ev.preventDefault();ev.stopImmediatePropagation();dialog.querySelector('#report-discard').hidden=false;dialog.querySelector('[data-report-action="save"]').focus();}}
    dialog.addEventListener('cancel',guard,{signal});
    dialog.addEventListener('click',ev=>{if(ev.target.closest('[data-action="close"]'))guard(ev);},{capture:true,signal});
    dialog.addEventListener('close',()=>{abort.abort();editor=null;delete dialog.dataset.workflow;},{once:true});
    render();
  }
  window.addEventListener('beforeunload',event=>{if(editor?.dirty||editor?.saving){event.preventDefault();event.returnValue='';}});
  function startingLabels(codes,codeId) {
    const by=new Map(codes.map(c=>[c.id,c])),path=[],seen=new Set();let n=by.get(codeId);
    while(n&&!seen.has(n.id)){seen.add(n.id);path.unshift(n);n=by.get(n.parent_id);}
    if(path.some(c=>['theme','category','code'].includes(c.research_role)))return {theme:path.filter(c=>c.research_role==='theme').map(c=>c.name).join(' > '),category:path.filter(c=>c.research_role==='category').map(c=>c.name).join(' > ')};
    return {theme:path.length>1?path[0].name:'',category:path.slice(1,-1).map(c=>c.name).join(' > ')};
  }
  window.QTReport={open,blank,startingLabels};
})();
