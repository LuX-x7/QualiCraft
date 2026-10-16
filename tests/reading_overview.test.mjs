import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
function workspace(){
 const saved=new Map();
 const c=vm.createContext({URLSearchParams,location:{search:'?lang=en'},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},sessionStorage:{setItem(){}},document:{documentElement:{},addEventListener(){},querySelector(){return null}},window:{addEventListener(){}},setTimeout(){},clearTimeout(){},fetch:()=>new Promise(()=>{})});vm.runInContext(source,c);const run=s=>vm.runInContext(s,c);
 run(String.raw`state.project={id:'p',audit:[],blocks:[],suggestions:[],documents:[{id:'d',name:'Bologna boundary fixture',sha256:'abc',text:'AB😀\r\n  \r\nCDEF\nGHIJ',reading_state:{source_sha256:'abc',source_length:19,revision:1,marks:[{start:9,end:13,status:'read'}]}}],codes:[{id:'t1',name:'Group',parent_id:null},{id:'c1',name:'Same',parent_id:'t1'},{id:'t2',name:'Other',parent_id:null},{id:'c2',name:'Same',parent_id:'t2'}],annotations:[{id:'a',document_id:'d',code_id:'c1',start:0,end:3},{id:'b',document_id:'d',code_id:'c2',start:0,end:3},{id:'cross',document_id:'d',code_id:'c1',start:2,end:11},{id:'adjacent',document_id:'d',code_id:'c1',start:11,end:13},{id:'otherdoc',document_id:'outside',code_id:'c1',start:0,end:3}]};state.docId='d';doc().reading_state.source_length=cp(doc().text).length;doc().reading_state.marks=[{start:9,end:13,status:'read'}];`);
 return {run,json:s=>JSON.parse(run(`JSON.stringify(${s})`)),saved};
}
test('overview preserves CP coordinates and distinguishes annotations, source ranges and visual union',()=>{
 const w=workspace(),before=w.run('JSON.stringify(state.project)'),data=w.json('readingOverviewData(state.project,doc())');
 assert.deepEqual(data.paragraphs.map(p=>[p.start,p.end]),[[0,3],[9,13],[14,18]]);
 assert.equal(data.codingCount,4);assert.equal(data.ranges.length,3);assert.equal(data.ranges[0].annotations.length,2);
 assert.deepEqual(data.unions,[[0,13]]);assert.deepEqual(data.paragraphs.map(p=>p.codingCount),[3,2,0]);assert.deepEqual(data.paragraphs.map(p=>p.rangeCount),[2,2,0]);
 assert.equal(data.paragraphs[1].status,'read');assert.equal(w.run('JSON.stringify(state.project)'),before);
});
test('filtering does not shorten tracks, remove source identities or infer read state',()=>{
 const w=workspace(),before=w.json('readingOverviewData(state.project,doc())');w.run("state.search='NO MATCH';state.codeFilter='c2'");assert.deepEqual(w.json('readingOverviewData(state.project,doc())'),before);
 w.run("doc().reading_state.source_sha256='old'");const data=w.json('readingOverviewData(state.project,doc())');assert.equal(data.stale,true);assert.ok(data.paragraphs.every(p=>p.status==='unmarked'));assert.equal(data.codingCount,4);
});
test('same-name code paths and every assignment survive source-range preview',()=>{
 const w=workspace();w.run('ensureReadingOverview();readingOverview.open=true;readingOverview.rangeKey="0:3"');const html=w.run('readingOverviewHtml()');
 assert.match(html,/Group &gt; Same/);assert.match(html,/Other &gt; Same/);assert.match(html,/data-annotation-id="a"/);assert.match(html,/data-annotation-id="b"/);assert.match(html,/Entire document/);assert.match(html,/\[0, 3\)/);assert.doesNotMatch(html,/NaN|completion|coverage percentage/);
});
test('map selection is a preview and large lists are paginated',()=>{
 const w=workspace();w.run('ensureReadingOverview();readingOverview.open=true');w.run('selectReadingOverviewParagraph(1)');assert.equal(w.run('readingOverview.paragraph'),1);assert.equal(w.saved.size,0);
 w.run(String.raw`doc().text=Array(150).fill('Bologna fixture').join('\n');doc().reading_state.source_length=cp(doc().text).length`);const html=w.run('readingOverviewHtml()');assert.equal([...html.matchAll(/data-action="overview-select-paragraph"/g)].length,12);assert.match(html,/max="150"/);
});
test('source deletion and renaming derive new lists without changing manual marks',()=>{
 const w=workspace(),marks=w.run('JSON.stringify(doc().reading_state)');w.run("state.project.codes.find(c=>c.id==='t1').name='Renamed';ensureReadingOverview();readingOverview.open=true;readingOverview.rangeKey='0:3'");assert.match(w.run('readingOverviewHtml()'),/Renamed &gt; Same/);w.run('state.project.annotations=[]');assert.equal(w.json('readingOverviewData(state.project,doc())').codingCount,0);assert.match(w.run('readingOverviewHtml()'),/No saved coding ranges/);assert.equal(w.run('JSON.stringify(doc().reading_state)'),marks);
});
test('empty and code-free documents have exact neutral states without fake progress',()=>{
 const w=workspace();w.run(String.raw`state.project.annotations=[];doc().text='  \r\n';doc().reading_state.source_length=4;doc().reading_state.marks=[];ensureReadingOverview();readingOverview.open=true`);const data=w.json('readingOverviewData(state.project,doc())');assert.equal(data.paragraphs.length,0);assert.equal(data.ranges.length,0);assert.doesNotMatch(w.run('readingOverviewHtml()'),/NaN|Infinity/);
});
test('cross-paragraph sources require explicit full-document action when any part is filtered out',()=>{
 const w=workspace();w.run("ensureReadingOverview();readingOverview.open=true;readingOverview.rangeKey='2:11';state.search='CDEF';document.querySelectorAll=()=>[{dataset:{start:'9',end:'13'}}]");const html=w.run('readingOverviewHtml()');assert.match(html,/data-action="overview-show-full"/);assert.equal(w.run('state.search'),'CDEF');assert.equal(w.saved.size,0);
});
test('preview navigation and expanded overview never overwrite browser position',()=>{
 const w=workspace();w.run("writeReadingPosition(state.project,doc(),0);readingMounted={projectId:'p',document:doc(),start:9,filtered:false};readingParagraph=()=>({dataset:{start:'9'}});readingOverviewNav={key:markKey('p','d'),start:9};captureReadingPosition()");assert.equal(w.run('readReadingPosition(state.project,doc()).start'),0);
 w.run('readingOverviewNav=null;readingOverview.open=true;captureReadingPosition()');assert.equal(w.run('readReadingPosition(state.project,doc()).start'),0);
 w.run('readingOverview.open=false;captureReadingPosition()');assert.equal(w.run('readReadingPosition(state.project,doc()).start'),9);
});
test('explicit keep reports blocked browser storage without changing project marks',()=>{
 const w=workspace(),before=w.run('JSON.stringify(state.project)');w.run("readingMounted={start:0};document.querySelector=()=>({setAttribute(){}});renderReadingOverview=()=>{};previewCoding=()=>{};scrollReadingParagraph=()=>{};updateReadingPosition=()=>{};readerHtml=()=>'';localStorage.setItem=()=>{throw Error('blocked')};globalThis.feedback=null;toast=(message,error)=>{feedback={message,error}};keepOverviewPosition()");assert.equal(w.json('feedback').error,true);assert.match(w.json('feedback').message,/cannot be remembered/);assert.equal(w.run('JSON.stringify(state.project)'),before);
});
test('deleting the last saved assignment clears its obsolete preview without touching read marks',()=>{
 const w=workspace();w.run("ensureReadingOverview();readingOverviewFocus={key:markKey('p','d'),start:0,end:3,ids:['a','b']};readingOverview.rangeKey='0:3';state.project.annotations=state.project.annotations.filter(a=>a.start!==0);ensureReadingOverview()");assert.equal(w.run('readingOverviewFocus'),null);assert.equal(w.run('readingOverview.rangeKey'),null);assert.equal(w.run('doc().reading_state.marks.length'),1);
});
