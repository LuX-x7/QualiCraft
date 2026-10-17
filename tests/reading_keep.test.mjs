import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
function workspace(){
  const saved=new Map();
  const c=vm.createContext({URLSearchParams,location:{search:'?lang=en'},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},sessionStorage:{setItem(){}},document:{documentElement:{},addEventListener(){},querySelector(){return null}},window:{addEventListener(){}},setTimeout(){},clearTimeout(){},fetch:()=>new Promise(()=>{})});
  vm.runInContext(source,c);const run=s=>vm.runInContext(s,c);
  run(`state.project={id:'p',documents:[{id:'d',text:'Bologna\\nSource\\nRange',sha256:'source'}],codes:[],annotations:[]};state.docId='d';readingMounted={projectId:'p',document:doc(),start:8,filtered:false};readingOverview={key:markKey('p','d'),open:true};readingOverviewNav={key:markKey('p','d'),start:8};writeReadingPosition(state.project,doc(),0);`);
  return {run};
}
function geometry(w,top,start){
  w.run(`readingViewportTop=()=>100;readingParagraph=()=>({dataset:{start:'${start}'},getBoundingClientRect:()=>({top:${top},bottom:${top+60}})});document.querySelector=selector=>selector==='#document-pane'?{getBoundingClientRect:()=>({bottom:700})}:selector==='#reading-document'?{}:null;window.innerHeight=700;updateReadingPath=()=>{};updateProjectMarks=()=>{};updateReadingOverviewPosition=()=>{};`);
}
function keepUi(w,reflowStart){
  w.run(`document.querySelector=()=>({setAttribute(){}});renderReadingOverview=()=>{};readerHtml=()=>'';previewCoding=()=>{};scrollReadingParagraph=start=>{globalThis.scrolledTo=start;readingMounted.start=start};updateReadingPosition=()=>{${reflowStart===undefined?'':`readingMounted.start=${reflowStart};`}};toast=()=>{};announceMark=()=>{};`);
}

test('bringing overview controls into view does not replace the source jump anchor',()=>{
  const w=workspace();geometry(w,450,0);w.run('updateReadingPosition()');
  assert.equal(w.run('readingMounted.start'),0,'the visible-position indicator remains independent');
  assert.equal(w.run('readingOverviewNav.start'),8,'a paragraph below the reading line is not a new reading anchor');
  assert.equal(w.run('readReadingPosition(state.project,doc()).start'),0,'preview does not replace Resume');
  keepUi(w);w.run('keepOverviewPosition()');assert.equal(w.run('scrolledTo'),8);assert.equal(w.run('readReadingPosition(state.project,doc()).start'),8);
});
test('real reading past the source jump advances the position Keep saves',()=>{
  const w=workspace();geometry(w,80,15);w.run('updateReadingPosition()');assert.equal(w.run('readingOverviewNav.start'),15);
  keepUi(w);w.run('keepOverviewPosition()');assert.equal(w.run('readReadingPosition(state.project,doc()).start'),15);
});
test('Keep writes the chosen paragraph even if restoring the viewport reflows the indicator',()=>{
  const w=workspace(),before=w.run('JSON.stringify(state.project)');keepUi(w,0);w.run('keepOverviewPosition()');
  assert.equal(w.run('scrolledTo'),8);assert.equal(w.run('readReadingPosition(state.project,doc()).start'),8);
  assert.equal(w.run('JSON.stringify(state.project)'),before);assert.equal(w.run('readingOverviewNav'),null);
});
test('a different project or document never supplies the Keep anchor',()=>{
  const w=workspace();w.run("readingOverviewNav.key=markKey('other','d');readingMounted.start=15");keepUi(w);w.run('keepOverviewPosition()');
  assert.equal(w.run('scrolledTo'),15);assert.equal(w.run('readReadingPosition(state.project,doc()).start'),15);
});
test('previewing another paragraph without jumping does not replace the last reading anchor',()=>{
  const w=workspace();w.run('readingOverview.paragraph=2');geometry(w,500,0);w.run('updateReadingPosition()');
  keepUi(w);w.run('keepOverviewPosition()');assert.equal(w.run('readReadingPosition(state.project,doc()).start'),8);
});
