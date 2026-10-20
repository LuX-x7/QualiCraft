// node --test tests/network_evidence.test.mjs
// Real workbench functions with technical marker strings, no interview fixture.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../web/app.js', import.meta.url), 'utf8');
function workspace() {
  const context = vm.createContext({
    URLSearchParams, location: {search:'?lang=en'}, sessionStorage:{setItem(){}},
    document:{documentElement:{},addEventListener(){},querySelector(){return null;}},
    window:{addEventListener(){}}, fetch:()=>new Promise(()=>{}),
  });
  vm.runInContext(source, context);
  vm.runInContext(String.raw`
    state.project={id:'project',updated_at:'v1',suggestions:[],blocks:['insights'],
      documents:[{id:'d1',name:'Same',text:'😀 '+ 'source marker '.repeat(10)},
                 {id:'d2',name:'Same',text:'😀 '+ 'source marker '.repeat(10)}],
      codes:[{id:'t1',name:'Theme',parent_id:null},{id:'c1',name:'Shared',parent_id:'t1'},
             {id:'leaf',name:'Leaf',parent_id:'c1'},{id:'t2',name:'Other',parent_id:null},
             {id:'c2',name:'Shared',parent_id:'t2'}].map(c=>({...c,color:'#427d77',status:'final'})),
      annotations:[{id:'a1',document_id:'d1',code_id:'c1',start:0,end:110,source:'manual'},
                   {id:'a2',document_id:'d1',code_id:'leaf',start:0,end:110,source:'imported'},
                   {id:'a3',document_id:'d2',code_id:'c1',start:0,end:110,source:'manual'},
                   {id:'a4',document_id:'d1',code_id:'c2',start:0,end:110,source:'manual'}]};
    state.project.annotations.forEach(a=>a.quote=Array.from(state.project.documents.find(d=>d.id===a.document_id).text).slice(a.start,a.end).join(''));
    state.docId='d1'; state.view='insights';
    NET.nodes=[{id:'theme:t1',kind:'theme',theme_id:'t1',label:'Theme'},
      {id:'code:c1',kind:'code',code_id:'c1',theme_id:'t1',label:'Shared'},
      {id:'p:0',kind:'passage',code_id:'c1',theme_id:'t1',annotation_id:'a1',document_id:'d1',start:0,end:110}];
    NET.index=new Map(NET.nodes.map(n=>[n.id,n]));
    NET.selected='code:c1';NET.visible=new Set(['theme:t1','code:c1','p:0']);NET.expanded=new Set(['code:c1']);
    render=()=>{};toast=message=>{state.testToast=message;};
  `, context);
  const run = expression => vm.runInContext(expression, context);
  return {run, json:expression=>JSON.parse(run(`JSON.stringify(${expression})`))};
}
test('Insights opens the map directly, with complete frequency and matrix views retained', () => {
  const w=workspace();
  assert.match(w.run('insightsView()'), /Insights views/);
  assert.match(w.run('insightsView()'), /id="network-stage"/);
  assert.doesNotMatch(w.run('insightsView()'), /class="bar-row"/);
  w.run("state.insightsTab='frequency'");
  assert.match(w.run('insightsView()'), /class="bar-row"/);
  w.run("state.insightsTab='matrix'");
  assert.match(w.run('insightsView()'), /<table>/);
});
test('theme evidence includes descendants, while code evidence keeps its own assignments', () => {
  const w=workspace();
  w.run("NET.selected='theme:t1'");
  assert.deepEqual(w.json('networkEvidenceRows().map(a=>a.id)'), ['a1','a2','a3']);
  w.run("NET.selected='code:c1'");
  assert.deepEqual(w.json('networkEvidenceRows().map(a=>a.id)'), ['a1','a3']);
});
test('passage references resolve by ID and exact range, never by matching names or previews', () => {
  const w=workspace();
  assert.equal(w.run("networkPassageEvidence(NET.index.get('p:0')).id"),'a1');
  w.run("NET.index.get('p:0').document_id='d2'");
  assert.equal(w.run("networkPassageEvidence(NET.index.get('p:0'))"),null);
});
test('source validation uses Unicode code points and refuses mismatched saved text', () => {
  const w=workspace();
  assert.equal(w.run("evidenceRecord('a1').valid"),true);
  w.run("state.project.annotations[0].quote='wrong source'");
  assert.equal(w.run("evidenceRecord('a1').valid"),false);
});
test('full quotation, code path and source range survive beyond the graph preview', () => {
  const w=workspace();w.run("NET.evidenceId='a1'");
  const html=w.run('networkEvidenceHtml()');
  assert.ok(html.includes(w.run("state.project.annotations[0].quote")));
  assert.ok(html.includes('Theme &gt; Shared'));
  assert.match(html,/\[0, 110\)/);
  assert.match(html,/data-action="net-locate" data-id="a1"/);
});
test('stored strings are escaped in the evidence panel', () => {
  const w=workspace();
  w.run("state.project.documents[0].name='<script>bad</script>';NET.evidenceId='a1'");
  const html=w.run('networkEvidenceHtml()');
  assert.ok(html.includes('&lt;script&gt;bad&lt;/script&gt;'));
  assert.ok(!html.includes('<script>'));
});
test('locating a source clears obstructing filters and retains graph context', () => {
  const w=workspace();w.run("state.docId='d2';state.search='marker';state.codeFilter='c2';NET.evidenceId='a1'");
  const before=w.json('[NET.selected,[...NET.visible],[...NET.expanded]]');
  w.run("openNetworkSource('a1')");
  assert.deepEqual(w.json('[state.view,state.docId,state.search,state.codeFilter,state.sourceFocus]'),['coding','d1','',null,'a1']);
  assert.deepEqual(w.json('[NET.selected,[...NET.visible],[...NET.expanded]]'),before);
  assert.equal(w.run('state.networkReturn.docId'),'d2');
});
test('returning restores prior reading filters and does not clear the graph selection', () => {
  const w=workspace();w.run("state.docId='d2';state.search='marker';state.codeFilter='c2';NET.evidenceId='a1';openNetworkSource('a1');returnToNetwork()");
  assert.deepEqual(w.json('[state.view,state.insightsTab,state.docId,state.search,state.codeFilter,state.sourceFocus]'),['insights','map','d2','marker','c2',null]);
  assert.equal(w.run('NET.selected'),'code:c1');
  assert.equal(w.run("NET.expanded.has('code:c1')"),true);
});
test('an unavailable source cannot move the reader or alter project data', () => {
  const w=workspace();w.run("state.project.annotations[0].quote='mismatch'");
  const before=w.run('JSON.stringify(state.project)');
  w.run("openNetworkSource('a1')");
  assert.equal(w.run('state.view'),'insights');
  assert.equal(w.run('JSON.stringify(state.project)'),before);
});
test('source highlighting follows the selected annotation without highlighting unrelated codings', () => {
  const w=workspace();
  w.run("state.sourceFocus='a1'");
  assert.match(w.run("highlight(state.project.documents[0].text,0,state.project.annotations.filter(a=>a.document_id==='d1'))"),/class="source-target" tabindex="0" role="button"/);
  assert.doesNotMatch(w.run("highlight(state.project.documents[1].text,0,state.project.annotations.filter(a=>a.document_id==='d2'))"),/source-target/);
});
test('rebuilding the map for the same revision preserves selected, expanded and dragged positions', async () => {
  const w=workspace();
  w.run(`NET.projectKey='project:v1';NET.alpha=0;NET.nodes[1].x=123;NET.nodes[1].y=-45;
    NET.evidenceId='a1';
    const stage={innerHTML:''},picker={innerHTML:'',disabled:true};
    document.getElementById=id=>id==='network-stage'?stage:id==='network-select'?picker:{};
    drawNetwork=()=>{};drawNetworkLegend=()=>{};drawNetworkEvidence=()=>{};
    api=()=>{throw new Error('cached map must not fetch or reseed');};`);
  await w.run('loadNetwork()');
  assert.deepEqual(w.json('[NET.selected,NET.evidenceId,[...NET.expanded],NET.nodes[1].x,NET.nodes[1].y]'),['code:c1','a1',['code:c1'],123,-45]);
});
test('a late network response cannot replace another project selection', async () => {
  const w=workspace();
  w.run(`const stage={innerHTML:''};document.getElementById=()=>stage;
    api=async()=>{state.project.id='another-project';return {nodes:[],links:[],levels:{}};};`);
  await w.run('loadNetwork()');
  assert.equal(w.run('NET.selected'),'code:c1');
  assert.equal(w.run('NET.nodes.length'),3);
});

test('map has explicit keyboard and touch controls plus a live selection summary', () => {
  const w=workspace(),html=w.run('insightsView()');
  for(const action of ['net-prev','net-next','net-clear','net-passages'])assert.ok(html.includes(`data-action="${action}"`));
  assert.match(html,/id="network-selection"[^>]*aria-live="polite"/);
});
test('source ranges are identified by document ID and exact bounds, not text', () => {
  const w=workspace();
  assert.equal(w.run('networkSourceCount(state.project.annotations)'),2);
  assert.deepEqual(w.json("sameSourceCodings(state.project.annotations[0]).map(a=>a.id)"),['a1','a2','a4']);
});
test('evidence distinguishes one source range carrying several saved codings', () => {
  const w=workspace();w.run("NET.evidenceId='a1'");
  const html=w.run('networkEvidenceHtml()');
  assert.match(html,/1 source range · 3 saved codings/);
  for(const path of ['Theme &gt; Shared','Theme &gt; Shared &gt; Leaf','Other &gt; Shared'])assert.ok(html.includes(path));
});
test('previous and next visit every selectable node by ID, excluding passage dots', () => {
  const w=workspace();w.run("toggleNetworkNode=id=>{NET.selected=id;}");
  w.run('stepNetworkSelection(1)');assert.equal(w.run('NET.selected'),'theme:t1');
  w.run('stepNetworkSelection(-1)');assert.equal(w.run('NET.selected'),'code:c1');
  w.run('NET.selected=null;stepNetworkSelection(1)');assert.equal(w.run('NET.selected'),'theme:t1');
});
test('explicit collapse only hides the selected code passage dots and preserves evidence', () => {
  const w=workspace();w.run(`NET.links=[{kind:'coding',source:'code:c1',target:'p:0'}];NET.evidenceId='a1';
    NET.visible.add('other-dot');drawNetwork=()=>{};drawNetworkEvidence=()=>{};drawNetworkLegend=()=>{};drawNetworkControls=()=>{};wakeNetwork=()=>{};`);
  w.run('toggleNetworkPassages()');
  assert.equal(w.run("NET.visible.has('p:0')"),false);assert.equal(w.run("NET.visible.has('other-dot')"),true);
  assert.equal(w.run('NET.evidenceId'),'a1');
  w.run('toggleNetworkPassages()');assert.equal(w.run("NET.visible.has('p:0')"),true);
});
test('reduced motion settles the layout without scheduling animation frames', () => {
  const w=workspace();w.run(`window.matchMedia=()=>({matches:true});state.steps=0;
    stepNetwork=()=>{state.steps++;NET.alpha*=0.5;};drawNetwork=()=>{};
    requestAnimationFrame=()=>{throw new Error('animation must stay off');};`);
  w.run('wakeNetwork()');assert.equal(w.run('NET.frame'),0);assert.equal(w.run('NET.alpha'),0);
  assert.ok(w.run('state.steps')>0);
});
test('explicit reduced motion works without changing system preferences or project records',()=>{
  const w=workspace(),before=w.json('state.project')
  w.run(`window.matchMedia=()=>({matches:false});document.documentElement.dataset={reducedMotion:'true'};
    state.steps=0;stepNetwork=()=>{state.steps++;NET.alpha*=.5};drawNetwork=()=>{};
    requestAnimationFrame=()=>{throw new Error('manual reduction must keep frames off')}`)
  assert.equal(w.run('networkReducedMotion()'),true)
  w.run('wakeNetwork()');assert.equal(w.run('NET.frame'),0)
  assert.deepEqual(w.json('state.project'),before)
})
