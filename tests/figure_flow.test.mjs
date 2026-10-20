import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
function harness(){
 const c=vm.createContext({URLSearchParams,location:{search:'?lang=en'},localStorage:{getItem(){return null},setItem(){}},sessionStorage:{setItem(){}},document:{documentElement:{},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]}},window:{addEventListener(){}},fetch:()=>new Promise(()=>{}),AbortController,URL,Blob});
 vm.runInContext(source,c);const run=s=>vm.runInContext(s,c);
 run("state.config={plotting:{available:true}};state.project={id:'bologna',updated_at:'v1',blocks:['plotting'],documents:[{id:'d',name:'Bologna',text:'Bologna public evidence'}],codes:[{id:'c'}],annotations:[{id:'a',code_id:'c',document_id:'d',start:0,end:7}],suggestions:[]};state.docId='d';state.view='plotting'");
 return {c,run,json:s=>JSON.parse(run('JSON.stringify('+s+')'))};
}
test('all five types have visible native choices and an explicit generation action',()=>{
 const h=harness(),html=h.run('plottingView()');assert.equal([...html.matchAll(/type="radio"[^>]*data-plot="kind"/g)].length,5);assert.match(html,/data-action="plot-generate"/);assert.match(html,/role="status"/);assert.doesNotMatch(html,/at least two coded passages/);
});
test('one saved coding can generate frequency, coverage, hierarchy and accumulation',()=>{
 const h=harness();h.run('plottingView()');for(const kind of ['frequency','coverage','hierarchy','accumulation']){h.run(`state.plotOptions.kind='${kind}'`);assert.equal(h.run('plotPrerequisite()'),null,kind);}
});
test('zero saved codings has a coding return path rather than an incorrect two-coding threshold',()=>{
 const h=harness();h.run('state.project.annotations=[]');const html=h.run('plottingView()');assert.match(html,/No saved codings/);assert.match(html,/data-view="coding"/);assert.match(html,/data-action="plot-generate" disabled/);
});
test('Figures remains discoverable while the optional block is off',()=>{
 assert.match(source,/view==='coding'\|\|view==='plotting'\|\|hasBlock\(view\)/);const h=harness();h.run('state.project.blocks=[]');assert.match(h.run('plottingView()'),/data-action="enable-figures"/);assert.equal(h.run('plotPrerequisite().kind'),'disabled');
});
test('only known 400 no-data responses become empty results; real faults remain visible',()=>{
 const h=harness();h.run('plottingView()');h.c.message='No overlapping code ranges: this figure counts codes applied to overlapping character ranges';assert.equal(h.run("plotFailure(400,message,{kind:'cooccurrence',mode:'overlap',top:15}).state"),'empty');assert.equal(h.run("plotFailure(503,'Service unavailable',{kind:'cooccurrence',mode:'overlap'}).state"),'error');assert.equal(h.run("plotFailure(401,'Sign in to continue',{kind:'cooccurrence',mode:'overlap'}).state"),'error');assert.match(h.run("plotFailure(503,'Service unavailable',{kind:'cooccurrence'}).body"),/Service unavailable/);
});
test('cooccurrence empty guidance follows requested mode and Top N; does not invent codings',()=>{
 const h=harness();h.run('plottingView()');const text=h.run("plotFailure(400,'No overlapping code ranges',{kind:'cooccurrence',mode:'unit',top:15}).body");assert.match(text,/same passage/i);assert.match(text,/15/);assert.doesNotMatch(text,/Apply two codes to the same/);assert.doesNotMatch(h.run("plotFailure(400,'No overlapping code ranges',{kind:'cooccurrence',mode:'unit',top:15}).title"),/overlapping/i);
});
test('view mounting and option changes do not launch hidden plotting subprocess requests',async()=>{
 const h=harness();h.run('plottingView();globalThis.calls=0;fetch=()=>{calls++;throw Error("must not fetch")};document.getElementById=()=>null');await h.run('loadPlotPreview()');assert.equal(h.run('calls'),0);
});
test('download is disabled until this exact project and option selection has a ready preview',()=>{
 const h=harness();let html=h.run('plottingView()');assert.match(html,/data-action="plot-export" disabled/);h.run("plotUi.status='ready';plotUi.blob=new Blob(['svg']);");html=h.run('plottingView()');assert.doesNotMatch(html,/data-action="plot-export" disabled/);h.run("state.plotOptions.kind='coverage'");assert.match(h.run('plottingView()'),/data-action="plot-export" disabled/);
});
test('duplicate generate is ignored and a late response cannot replace a newer selection',async()=>{
 const h=harness();h.run('plottingView();render=()=>{};globalThis.requests=0;fetch=(url,options)=>{requests++;globalThis.signal=options.signal;return new Promise(resolve=>{globalThis.finish=resolve})}');
 const pending=h.run('generatePlotPreview()');await h.run('generatePlotPreview()');assert.equal(h.run('requests'),1);
 h.run("state.plotOptions.kind='coverage';ensurePlotUi();finish({ok:true,blob:async()=>new Blob(['old figure'])})");await pending;
 assert.equal(h.run('signal.aborted'),true);assert.equal(h.run('plotUi.status'),'idle');assert.equal(h.run('plotUi.blob'),null);
});
test('download failure keeps the valid preview and exposes its real error',async()=>{
 const h=harness();h.run("plottingView();plotUi.status='ready';plotUi.blob=new Blob(['svg']);updatePlotStatus=()=>{};toast=()=>{};fetch=async()=>({ok:false,status:503,json:async()=>({error:'Bundle service unavailable'})})");
 await h.run('exportPlotBundle()');assert.equal(h.run('plotUi.status'),'ready');assert.match(h.run('plotUi.download'),/Bundle service unavailable/);assert.equal(h.run('plotUi.exporting'),false);
});
test('editing a title does not rebuild the controls and swallow the following Generate click',()=>{
 const h=harness();h.run('plottingView();document.getElementById=()=>null;globalThis.renders=0;render=()=>{renders++};');
 h.run("changePlotOption({dataset:{plot:'title'},value:'Bologna preview',type:'text',tagName:'INPUT'})");assert.equal(h.run('renders'),0);assert.equal(h.run('state.plotOptions.title'),'Bologna preview');assert.equal(h.run('plotUi.status'),'idle');
});
test('appearance controls remain expanded while changing their values',()=>{
 const h=harness();h.run('plotAppearanceOpen=true');assert.match(h.run('plottingView()'),/<details class="plot-options" open>/);
});
