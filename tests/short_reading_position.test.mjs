import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
function workspace(saved=new Map()){
  const frames=[];
  const c=vm.createContext({URLSearchParams,location:{search:'?lang=en'},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},sessionStorage:{setItem(){}},document:{documentElement:{},addEventListener(){},querySelector(){return null}},window:{innerWidth:1440,innerHeight:1000,addEventListener(){},scrollBy(){}},getComputedStyle:()=>({overflowY:'visible',position:'static'}),requestAnimationFrame:fn=>frames.push(fn),setTimeout(){},clearTimeout(){},fetch:()=>new Promise(()=>{})});
  vm.runInContext(source,c);const run=s=>vm.runInContext(s,c);
  run(`state.project={id:'p',documents:[{id:'d',text:'Bologna\\nSource\\nRange'},{id:'other',text:'Other\\nBologna'}],codes:[],annotations:[]};state.docId='d';state.view='coding';
    globalThis.output={};globalThis.elements={'#reading-document':{},'#reading-position':output,'#document-pane':{getBoundingClientRect:()=>({top:100,bottom:1000})},'.reading-dock':{getBoundingClientRect:()=>({bottom:100})}};
    globalThis.paragraphs=[0,8,15].map((start,i)=>({dataset:{start:String(start)},getBoundingClientRect:()=>({top:100+i*80,bottom:180+i*80}),focus(){document.activeElement=this}}));
    document.querySelector=s=>elements[s]||null;document.querySelectorAll=()=>paragraphs;
    updateReadingPath=()=>{};updateProjectMarks=()=>{};updateReadingOverviewPosition=()=>{};
    renderReadingOverview=()=>{};readerHtml=()=>'';previewCoding=()=>{};toast=()=>{};announceMark=()=>{};
    elements['#reader']={};readingMounted={projectId:'p',document:doc(),start:0,readingStart:0,filtered:false};if(!readReadingPosition(state.project,doc()))writeReadingPosition(state.project,doc(),0);`);
  return {run,saved,frames};
}
function keep(w){w.run("readingOverview={key:markKey('p','d'),open:true};readingOverviewNav={key:markKey('p','d'),start:8};keepOverviewPosition();updateReadingPosition();captureReadingPosition()");}

test('short source Keep survives later viewport samples when scrolling cannot align paragraph two',()=>{
  const w=workspace(),before=w.run('JSON.stringify(state.project)');keep(w);
  assert.equal(w.run('readReadingPosition(state.project,doc()).start'),8);
  assert.equal(w.run('output.textContent'),'Paragraph 2 / 3');
  assert.equal(w.run('readingMounted.readingStart'),8);
  assert.equal(w.run('JSON.stringify(state.project)'),before);
});
test('short source Resume after a fresh page mount retains the persisted paragraph',()=>{
  const w=workspace();w.run('writeReadingPosition(state.project,doc(),8)');
  const refreshed=workspace(w.saved);refreshed.run('mountReading();updateReadingPosition();captureReadingPosition()');
  assert.equal(refreshed.run('readReadingPosition(state.project,doc()).start'),8);
  assert.equal(refreshed.run('output.textContent'),'Paragraph 2 / 3');
});
test('search and clear retain the explicit short-document anchor',()=>{
  const w=workspace();keep(w);w.run("beginReadingSearch();state.search='Source';readingMounted.filtered=true;captureReadingPosition()");
  assert.equal(w.run('readingSearchPosition().start'),8);
  w.run("state.search='';mountReading();updateReadingPosition();captureReadingPosition()");
  assert.equal(w.run('readReadingPosition(state.project,doc()).start'),8);
  assert.equal(w.run('output.textContent'),'Paragraph 2 / 3');
});
test('document switch and return restore separate saved paragraph identities',()=>{
  const w=workspace();keep(w);w.run("captureReadingPosition();state.docId='other';captureReadingPosition();mountReading();state.docId='d';captureReadingPosition();mountReading();updateReadingPosition()");
  assert.equal(w.run('readReadingPosition(state.project,doc()).start'),8);
  assert.equal(w.run('output.textContent'),'Paragraph 2 / 3');
});
test('intentional reading gestures release a short-document target and continue physical reading',()=>{
  for(const type of ['wheel','touchmove','keydown']){
    const w=workspace();keep(w);w.run(`readingSearchGesture({type:'${type}',key:'Home',target:{closest:s=>s==='#document-pane'||s==='#reader'?{}:null}})`);
    assert.equal(w.run('readReadingPosition(state.project,doc()).start'),0,type);
    assert.equal(w.run('output.textContent'),'Paragraph 1 / 3',type);
  }
});
test('a source edit or different project invalidates an explicit viewport target',()=>{
  for(const change of ["state.project.id='other-project'","doc().text='Changed source'"]){
    const w=workspace();keep(w);w.run(change);
    assert.equal(w.run('Number(readingParagraph().dataset.start)'),0,change);
  }
});
test('aligned long-document scrolling needs no target and still follows the reading line',()=>{
  const w=workspace();w.run(`globalThis.offset=0;window.scrollBy=({top})=>{offset+=top};paragraphs.forEach((p,i)=>p.getBoundingClientRect=()=>({top:100+i*500-offset,bottom:600+i*500-offset}));scrollReadingParagraph(8,true);updateReadingPosition()`);
  assert.equal(w.run('output.textContent'),'Paragraph 2 / 3');
  w.run('offset=1000;updateReadingPosition()');
  assert.equal(w.run('output.textContent'),'Paragraph 3 / 3');
  assert.equal(w.run('readReadingPosition(state.project,doc()).start'),15);
});
