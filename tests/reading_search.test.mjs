import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
function workspace(blocked=false){
  const saved=new Map(),handlers=[];
  const c=vm.createContext({URLSearchParams,location:{search:'?lang=en'},localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return saved.get(k)||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');saved.set(k,v)}},sessionStorage:{setItem(){}},document:{documentElement:{},addEventListener(type,fn){handlers.push([type,fn])},querySelector(){return null}},window:{addEventListener(){}},setTimeout(){},clearTimeout(){},fetch:()=>new Promise(()=>{})});
  vm.runInContext(source,c);const run=s=>vm.runInContext(s,c);
  run(`state.project={id:'p',documents:[{id:'d',text:'Bologna\\nSource\\nRange'},{id:'other',text:'Other'}],codes:[],annotations:[]};state.docId='d';readingMounted={projectId:'p',document:doc(),start:8,readingStart:8,filtered:false};writeReadingPosition(state.project,doc(),8);readingViewportTop=()=>100;readingParagraph=()=>({dataset:{start:'0'},getBoundingClientRect:()=>({top:400,bottom:450})});`);
  return {run,saved,handlers};
}
test('search focus preserves the last reading anchor after a control scroll has already changed the viewport',()=>{
  const w=workspace();w.run('readingMounted.start=0;writeReadingPosition(state.project,doc(),0);beginReadingSearch()');
  assert.equal(w.run('readingSearchPosition().start'),8);assert.equal(w.run('readReadingPosition(state.project,doc()).start'),8);
  w.run('captureReadingPosition()');assert.equal(w.run('readReadingPosition(state.project,doc()).start'),8);
});
test('active search retains its original anchor through matching, empty and no-match query states',()=>{
  const w=workspace();w.run("beginReadingSearch();readingMounted.start=0;state.search='NO_MATCH';beginReadingSearch();state.search='';captureReadingPosition()");
  assert.equal(w.run('readingSearchPosition().start'),8);assert.equal(w.run('readReadingPosition(state.project,doc()).start'),8);
});
test('search return positions are isolated by project, document and unchanged source',()=>{
  const w=workspace();w.run("beginReadingSearch();state.docId='other'");assert.equal(w.run('readingSearchPosition()'),null);
  w.run("state.docId='d';state.project.id='other-project'");assert.equal(w.run('readingSearchPosition()'),null);
  w.run("state.project.id='p';doc().text='Changed\\nSource\\nRange'");assert.equal(w.run('readingSearchPosition()'),null);
});
test('a fresh position at the actual reading line takes priority over an older cached anchor',()=>{
  const w=workspace();w.run("readingParagraph=()=>({dataset:{start:'15'},getBoundingClientRect:()=>({top:90,bottom:150})});beginReadingSearch()");
  assert.equal(w.run('readingSearchPosition().start'),15);assert.equal(w.run('readReadingPosition(state.project,doc()).start'),15);
});
test('blocked storage still allows a temporary search return without inventing persisted memory',()=>{
  const w=workspace(true),before=w.run('JSON.stringify(state.project)');w.run('beginReadingSearch()');
  assert.equal(w.run('readingSearchPosition().start'),8);assert.equal(w.run('readReadingPosition(state.project,doc())'),null);
  assert.equal(w.run('JSON.stringify(state.project)'),before);assert.equal(w.saved.size,0);
});
test('ending a search return allows normal reading capture again',()=>{
  const w=workspace();w.run('beginReadingSearch();readingSearchReturn=null;captureReadingPosition()');
  assert.equal(w.run('readReadingPosition(state.project,doc()).start'),0);
});
test('previewing a filtered result cannot replace the full-document search return',()=>{
  const w=workspace();w.run("readingMounted.filtered=true;readingMounted.start=15;readingParagraph=()=>({dataset:{start:'15'},getBoundingClientRect:()=>({top:90,bottom:150})});beginReadingSearch()");
  assert.equal(w.run('readingSearchPosition().start'),8);assert.equal(w.run('readReadingPosition(state.project,doc()).start'),8);
});
test('a scroll retargeted within the source pane waits for the actual reading position',()=>{
  const w=workspace();w.run("globalThis.frames=[];requestAnimationFrame=fn=>frames.push(fn);window.innerHeight=700;document.querySelector=s=>s==='#reading-document'?{}:s==='#document-pane'?{getBoundingClientRect:()=>({bottom:700})}:null;updateReadingPath=()=>{};updateProjectMarks=()=>{};updateReadingOverviewPosition=()=>{};readingParagraph=()=>({dataset:{start:'8'},getBoundingClientRect:()=>({top:90,bottom:150})});scheduleReadingPosition=()=>updateReadingPosition();readingSearchGesture({type:'wheel',target:{closest:s=>s==='#document-pane'?{}:null}})");
  assert.equal(w.run('readingMounted.readingStart'),8);
  w.run("readingParagraph=()=>({dataset:{start:'0'},getBoundingClientRect:()=>({top:400,bottom:450})});frames.shift()()");
  assert.equal(w.run('readingMounted.readingStart'),0,'a real scroll back to the beginning must replace the old search return');
});
test('deferred input-clear restoration cannot affect a different document or project',()=>{
  const w=workspace();w.run("document.activeElement={id:'search'};globalThis.frames=[];requestAnimationFrame=fn=>frames.push(fn);globalThis.restored=[];scrollReadingParagraph=start=>restored.push(start);updateReadingPosition=()=>{};scheduleSearchReadingRestore(8);state.docId='other';frames.shift()()");
  assert.equal(w.run('restored.length'),0);
  w.run("state.docId='d';scheduleSearchReadingRestore(8);readingOverview.open=true;frames.shift()()");assert.equal(w.run('restored.length'),0);
  w.run("readingOverview.open=false;scheduleSearchReadingRestore(8);document.activeElement=null;frames.shift()()");assert.equal(w.run('restored.length'),0);
  w.run("document.activeElement={id:'search'};scheduleSearchReadingRestore(8);frames.shift()()");assert.equal(w.run('restored[0]'),8);
});
