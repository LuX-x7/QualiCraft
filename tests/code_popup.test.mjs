// Exercise the actual popup renderer, navigation and submit handler with technical code fixtures.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
function workspace(codes){
  const input={value:''},box={innerHTML:''},chosen=[],created=[],notices=[];let rows=[];
  const document={documentElement:{},addEventListener(){},querySelector:s=>s==='#code-search'?input:s==='#code-suggest'?box:null,querySelectorAll:s=>s==='#code-suggest .suggest-row'?rows:[]};
  const context=vm.createContext({URLSearchParams,location:{search:'?lang=en'},sessionStorage:{setItem(){}},document,window:{addEventListener(){}},fetch:()=>new Promise(()=>{})});
  vm.runInContext(source,context);const run=s=>vm.runInContext(s,context);
  context.choose=id=>chosen.push(id);context.create=name=>created.push(name);context.notice=text=>notices.push(text);
  run(`state.project={codes:${JSON.stringify(codes.map(c=>({color:'#4f728f',...c})))},documents:[],annotations:[]};applyCodeById=async id=>choose(id);createAndApplyCode=async name=>create(name);toast=text=>notice(text);`);
  function type(query){input.value=query;run('renderCodeSuggest('+JSON.stringify(query)+')');rows=[...box.innerHTML.matchAll(/class="suggest-row[^\"]*"/g)].map((_,i)=>({classList:{toggle(name,value){this[name]=value}},scrollIntoView(){},index:i}));}
  return {run,type,input,box,chosen,created,notices,ids:q=>JSON.parse(run('JSON.stringify(codePopupMatches('+JSON.stringify(q)+').map(m=>m.code.id))')),submit:()=>run('submitCodePopup()')};
}
const basic=()=>[{id:'parent',name:'ancient manuscripts and early printed books',parent_id:null},{id:'leaf',name:'ancient manuscripts',parent_id:'parent'},{id:'other',name:'materials',parent_id:null}];
test('unique complete leaf name is first and Enter saves its ID rather than a containing parent',async()=>{
  const w=workspace(basic());w.type('ancient manuscripts');assert.equal(w.ids(w.input.value)[0],'leaf');await w.submit();assert.deepEqual(w.chosen,['leaf']);assert.deepEqual(w.created,[]);
});
test('case and surrounding whitespace preserve the unique exact-name selection',async()=>{
  const w=workspace(basic());w.type('  ANCIENT MANUSCRIPTS  ');await w.submit();assert.deepEqual(w.chosen,['leaf']);
});
test('exact-name candidates are found before applying the eight-row display limit',async()=>{
  const codes=Array.from({length:10},(_,i)=>({id:'partial'+i,name:'ancient manuscripts '+i,parent_id:null}));codes.push(...basic());const w=workspace(codes);w.type('ancient manuscripts');assert.equal(w.ids(w.input.value).length,8);assert.equal(w.ids(w.input.value)[0],'leaf');await w.submit();assert.deepEqual(w.chosen,['leaf']);
});
test('a complete saved path is prioritised over its earlier partial-path descendants',async()=>{
  const codes=basic();codes.splice(1,0,...Array.from({length:10},(_,i)=>({id:'partial'+i,name:'ancient manuscripts '+i,parent_id:'parent'})));const w=workspace(codes);w.type('ancient manuscripts and early printed books > ancient manuscripts');await w.submit();assert.deepEqual(w.chosen,['leaf']);
});
test('same exact name in different families does not silently save the first match or create another code',async()=>{
  const w=workspace([...basic(),{id:'same',name:'ancient manuscripts',parent_id:'other'}]);w.type('ancient manuscripts');await w.submit();assert.deepEqual(w.chosen,[]);assert.deepEqual(w.created,[]);assert.ok(w.notices.length);assert.doesNotMatch(w.box.innerHTML,/data-action="popup-create"/);
});
test('a full path disambiguates equal leaf names across families',async()=>{
  const w=workspace([...basic(),{id:'same',name:'ancient manuscripts',parent_id:'other'}]);w.type('materials > ancient manuscripts');await w.submit();assert.deepEqual(w.chosen,['same']);
});
test('explicit arrow selection resolves a same-name query using the highlighted row',async()=>{
  const w=workspace([...basic(),{id:'same',name:'ancient manuscripts',parent_id:'other'}]);w.type('ancient manuscripts');w.run('movePopupCursor(1)');await w.submit();assert.deepEqual(w.chosen,['same']);
});
test('arrows can choose another visible row even when the query matches a complete path',async()=>{
  const w=workspace([...basic(),{id:'related',name:'ancient manuscripts notes',parent_id:'parent'}]);w.type('ancient manuscripts and early printed books > ancient manuscripts');w.run('movePopupCursor(1)');await w.submit();assert.deepEqual(w.chosen,['related']);
});
test('typing again resets explicit navigation before an ambiguous query is submitted',async()=>{
  const w=workspace([...basic(),{id:'same',name:'ancient manuscripts',parent_id:'other'}]);w.type('ancient manuscripts');w.run('movePopupCursor(1)');w.type('ancient manuscripts ');await w.submit();assert.deepEqual(w.chosen,[]);
});
test('identical full display paths show stable IDs and still require an explicit choice',async()=>{
  const w=workspace([...basic(),{id:'same',name:'ancient manuscripts and early printed books > ancient manuscripts',parent_id:null}]);w.type('ancient manuscripts and early printed books > ancient manuscripts');assert.match(w.box.innerHTML,/ · leaf/);assert.match(w.box.innerHTML,/ · same/);await w.submit();assert.deepEqual(w.chosen,[]);
});
test('a full identity including its stable ID selects the intended duplicate path',async()=>{
  const w=workspace([...basic(),{id:'same',name:'ancient manuscripts and early printed books > ancient manuscripts',parent_id:null}]);w.type('ancient manuscripts and early printed books > ancient manuscripts · same');await w.submit();assert.deepEqual(w.chosen,['same']);assert.deepEqual(w.created,[]);
});
test('a root and nested code sharing an exact name are ambiguous rather than implicitly preferring the root',async()=>{
  const w=workspace([...basic(),{id:'root-same',name:'ancient manuscripts',parent_id:null}]);w.type('ancient manuscripts');await w.submit();assert.deepEqual(w.chosen,[]);
});
test('partial queries and empty queries keep the saved candidate order and row limit',()=>{
  const w=workspace(basic());assert.deepEqual(w.ids('manu'),['parent','leaf']);assert.deepEqual(w.ids(''),['parent','leaf','other']);
});
test('direct parent coding remains available through its unique exact name',async()=>{
  const w=workspace(basic());w.type('ancient manuscripts and early printed books');await w.submit();assert.deepEqual(w.chosen,['parent']);
});
test('new-name creation remains explicit and existing exact names do not offer a duplicate',async()=>{
  const w=workspace(basic());w.type('New technical marker');await w.submit();assert.deepEqual(w.created,['New technical marker']);w.type('ancient manuscripts');assert.doesNotMatch(w.box.innerHTML,/data-action="popup-create"/);
});
test('ranking and rendering never rename, reorder or modify saved records',()=>{
  const w=workspace(basic()),before=w.run('JSON.stringify(state.project)');w.type('ancient manuscripts');w.run('movePopupCursor(1)');w.type('');assert.equal(w.run('JSON.stringify(state.project)'),before);
});
