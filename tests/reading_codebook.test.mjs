import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
function workspace(blocked=false){
  const saved=new Map(),handlers=[],frames=[];
  const c=vm.createContext({URLSearchParams,location:{search:'?lang=en'},localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return saved.get(k)||null;},setItem:(k,v)=>{if(blocked)throw Error('blocked');saved.set(k,v);}},sessionStorage:{setItem(){}},document:{documentElement:{},addEventListener(type,fn){handlers.push([type,fn]);},querySelector(){return null;}},window:{addEventListener(){}},requestAnimationFrame:fn=>frames.push(fn),setTimeout(){},clearTimeout(){},fetch:()=>new Promise(()=>{})});
  vm.runInContext(source,c);const run=s=>vm.runInContext(s,c);
  run(`state.project={id:'p',documents:[{id:'d',text:'Bologna\\nSource\\nRange'},{id:'other',text:'Other'}],codes:[],annotations:[]};state.docId='d';readingMounted={projectId:'p',document:doc(),start:8,readingStart:8,filtered:false};writeReadingPosition(state.project,doc(),8);readingViewportTop=()=>100;readingParagraph=()=>({dataset:{start:'0'},getBoundingClientRect:()=>({top:400,bottom:450})});globalThis.elements={'#dialog':{dataset:{}},'#mobile-code-filter':{focus(){}}};document.querySelector=s=>elements[s]||null;modal=()=>{};codebookHtml=()=>'';`);
  return {run,saved,handlers,c,frames};
}
test('opening the codebook repairs a control scroll using the last actual reading line',()=>{
  const w=workspace(),before=w.run('JSON.stringify(state.project)');
  w.run('readingMounted.start=0;writeReadingPosition(state.project,doc(),0);showMobileCodebook();captureReadingPosition()');
  assert.equal(w.run('readReadingPosition(state.project,doc()).start'),8);
  assert.equal(w.run('readingSearchPosition().start'),8);
  assert.equal(w.run('JSON.stringify(state.project)'),before);
});
test('native focus on the codebook entry protects the anchor before activation',()=>{
  const w=workspace();w.c.event={target:{id:'',closest:s=>s==='[data-action="coding-codebook"]'?{}:null}};
  for(const [type,handler] of w.handlers)if(type==='focusin')handler(w.c.event);
  w.run('captureReadingPosition()');assert.equal(w.run('readReadingPosition(state.project,doc()).start'),8);
});
test('codebook opening and repeated filtering retain an existing pre-search return',()=>{
  const w=workspace();w.run("beginReadingSearch();state.search='NO_MATCH';readingMounted.filtered=true;readingMounted.start=15;showMobileCodebook();state.codeFilter='theme';showMobileCodebook();captureReadingPosition()");
  assert.equal(w.run('readingSearchPosition().start'),8);assert.equal(w.run('readReadingPosition(state.project,doc()).start'),8);
});
test('closing the dialog and control-only movement cannot overwrite a kept position',()=>{
  const w=workspace();w.run('showMobileCodebook();captureReadingPosition();captureReadingPosition()');
  assert.equal(w.run('readReadingPosition(state.project,doc()).start'),8);
});
test('real source scrolling after a codebook interaction advances the next return anchor',()=>{
  const w=workspace();w.run("showMobileCodebook();document.activeElement={id:''};readingParagraph=()=>({dataset:{start:'15'},getBoundingClientRect:()=>({top:90,bottom:150})});readingSearchGesture({type:'touchmove',target:{closest:s=>s==='#document-pane'?{}:null}});captureReadingPosition()");
  assert.equal(w.run('readingSearchPosition()'),null);assert.equal(w.run('readReadingPosition(state.project,doc()).start'),15);
  w.run('readingMounted.readingStart=15;showMobileCodebook()');assert.equal(w.run('readingSearchPosition().start'),15);
});
test('the codebook return is invalid in a different document, project or changed source',()=>{
  const w=workspace();w.run("showMobileCodebook();state.docId='other'");assert.equal(w.run('readingSearchPosition()'),null);
  w.run("state.docId='d';state.project.id='other'");assert.equal(w.run('readingSearchPosition()'),null);
  w.run("state.project.id='p';doc().text='Changed\\nSource\\nRange'");assert.equal(w.run('readingSearchPosition()'),null);
});
test('blocked storage retains only an honest in-memory return and no project changes',()=>{
  const w=workspace(true),before=w.run('JSON.stringify(state.project)');w.run('showMobileCodebook();captureReadingPosition()');
  assert.equal(w.run('readingSearchPosition().start'),8);assert.equal(w.run('readReadingPosition(state.project,doc())'),null);
  assert.equal(w.run('JSON.stringify(state.project)'),before);assert.equal(w.saved.size,0);
});
