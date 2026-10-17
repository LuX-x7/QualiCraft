// Render the real workbench with technical markers, never interview fixtures.
import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8')
function workspace(){
 const context=vm.createContext({URLSearchParams,location:{search:'?lang=en'},sessionStorage:{setItem(){}},document:{documentElement:{},addEventListener(){},querySelector(){return null}},window:{addEventListener(){}},fetch:()=>new Promise(()=>{})});vm.runInContext(source,context)
 const run=s=>vm.runInContext(s,context)
 run(`state.project={id:'test',blocks:['hierarchy'],documents:[{id:'doc',name:'marker.txt',text:'A😀BCDE'}],codes:[{id:'root',name:'Group <one>',parent_id:null},{id:'branch',name:'Parent',parent_id:'root'},{id:'leaf',name:'Same',parent_id:'branch'},{id:'other',name:'Group two',parent_id:null},{id:'same',name:'Same',parent_id:'other'},{id:'flat',name:'Standalone',parent_id:null}].map((c,i)=>({...c,color:['#ff0000','#00ff00','#0000ff'][i%3],status:'final'})),annotations:[{id:'a1',code_id:'leaf',document_id:'doc',start:1,end:4,source:'manual'},{id:'a2',code_id:'same',document_id:'doc',start:1,end:4,source:'researcher_reference'},{id:'a3',code_id:'root',document_id:'doc',start:3,end:5,source:'manual'}]};state.project.annotations.forEach(a=>a.quote=Array.from(state.project.documents[0].text).slice(a.start,a.end).join(''));state.docId='doc';`)
 return {run,json:s=>JSON.parse(run('JSON.stringify('+s+')'))}
}
test('codebook expresses nested lists, stable parent IDs and explicit roles',()=>{
 const w=workspace(),html=w.run('codebookHtml()')
 assert.match(html,/class="codebook-tree"/);assert.match(html,/data-code-node="leaf" data-parent-id="branch"/)
 assert.match(html,/Theme \/ group/);assert.match(html,/Parent code/);assert.match(html,/Ungrouped code/)
 assert.match(html,/aria-expanded="true"/);assert.doesNotMatch(html,/aria-label="Toggle"/)
 assert.equal([...html.matchAll(/data-code-node=/g)].length,6)
})
test('collapsed parents hide their branch without changing its counts or membership',()=>{
 const w=workspace(),before=w.run('JSON.stringify(state.project)');w.run("state.collapsed.add('root')")
 const html=w.run('codebookHtml()');assert.match(html,/aria-expanded="false"/);assert.match(html,/<ul[^>]* hidden/)
 assert.match(html,/data-code-node="leaf"/);assert.equal(w.run("codeCounts().total.get('root')"),2);assert.equal(w.run('JSON.stringify(state.project)'),before)
})
test('search keeps full escaped ancestry and same-name codes distinct',()=>{
 const w=workspace();w.run("state.sideFilter='same'")
 const html=w.run('codebookHtml()');assert.match(html,/Group &lt;one&gt; &gt; Parent &gt; Same/);assert.match(html,/Group two &gt; Same/)
 assert.match(html,/data-code-node="leaf"/);assert.match(html,/data-code-node="same"/);assert.doesNotMatch(html,/<one>/)
})
test('source highlights use one calm palette without modifying text or source ranges',()=>{
 const w=workspace(),html=w.run("highlight('A😀BCDE',0,state.project.annotations)")
 assert.doesNotMatch(html,/#ff0000|#00ff00|#0000ff|style=/)
 assert.equal(html.replace(/<[^>]+>/g,''),'A😀BCDE');assert.match(html,/data-coding-count="3"/)
 const ids=[...html.matchAll(/data-coding-ids="([^"]+)"/g)].map(m=>JSON.parse(m[1].replaceAll('&quot;','"')));assert.ok(ids.some(ids=>ids.includes('a1')&&ids.includes('a2')&&ids.includes('a3')))
})
test('coding margin retains every overlapping assignment and its full parent chain',()=>{
 const w=workspace(),html=w.run('marginHtml(state.project.annotations)')
 assert.equal([...html.matchAll(/class="pill"/g)].length,3);assert.match(html,/data-coding-node="branch"/);assert.match(html,/data-coding-node="leaf"/)
 for(const id of ['a1','a2','a3'])assert.ok(html.includes('data-id="'+id+'"'))
 assert.match(html,/3 saved codings/);assert.match(html,/Overlapping ranges/)
 assert.doesNotMatch(html,/--code-color/)
})
test('coding details expose all overlapping saved IDs, paths and exact quotations',()=>{
 const w=workspace(),html=w.run("codingDetailsHtml(state.project.annotations[0])")
 assert.match(html,/Group &lt;one&gt; &gt; Parent &gt; Same/);assert.match(html,/😀BC/);assert.match(html,/\[1, 4\)/)
 for(const id of ['a1','a2','a3'])assert.ok(html.includes('data-id="'+id+'"'))
})
test('all presentation paths and highlight splits leave saved records unchanged',()=>{
 const w=workspace(),before=w.run('JSON.stringify(state.project)');w.run("codebookHtml();marginHtml(state.project.annotations);codingDetailsHtml(state.project.annotations[0]);state.codeFilter='root';readerHtml();state.sourceFocus='a2';highlight('A😀BCDE',0,state.project.annotations)")
 assert.equal(w.run('JSON.stringify(state.project)'),before);assert.deepEqual(w.json('[...codeCounts().total]'),[['root',2],['branch',1],['leaf',1],['other',1],['same',1],['flat',0]])
})

test('imported codings are labelled by saved provenance, never inferred as AI-reviewed',()=>{const w=workspace();assert.equal(w.run("codingSourceLabel({source:'imported'})"),'IMPORTED');assert.equal(w.run("codingSourceLabel({source:'ai_reviewed'})"),'AI · REVIEWED');assert.equal(w.run("codingSourceLabel({source:'manual'})"),'HUMAN')})

test('identical display paths expose full IDs without renaming stored codes',()=>{const w=workspace();w.run("state.project.codes.push({id:'another',name:'Same',parent_id:'branch',color:'#ff0000',status:'final'})");assert.equal(w.run("codeIdentity(state.project.codes.find(c=>c.id==='leaf'))"),'Group <one> > Parent > Same · leaf');assert.equal(w.run("codeIdentity(state.project.codes.find(c=>c.id==='another'))"),'Group <one> > Parent > Same · another');assert.equal(w.run("state.project.codes.find(c=>c.id==='leaf').name"),'Same')})

test('saved research roles take precedence over tree depth without changing parentage or counts',()=>{
 const w=workspace(),before=w.json('[...codeCounts().total]');
 w.run("state.project.codes[0].research_role='code';state.project.codes[1].research_role='theme';state.project.codes[2].research_role='category'");
 assert.equal(w.run('codeRole(state.project.codes[0])'),'Code');
 assert.equal(w.run('codeRole(state.project.codes[1])'),'Theme');
 assert.equal(w.run('codeRole(state.project.codes[2])'),'Category');
 assert.deepEqual(w.json('[...codeCounts().total]'),before);
 const html=w.run('marginHtml(state.project.annotations)');assert.match(html,/Category/);assert.match(html,/Theme/);
 assert.equal(w.run('codePath(state.project.codes[2])'),'Group <one> > Parent > Same');
 w.run('delete state.project.codes[1].research_role');assert.equal(w.run('codeRole(state.project.codes[1])'),'Parent code');
})

test('a role-only edit submits no untouched colour, name or method fields',()=>{
 const w=workspace();w.run("formBefore={name:'Same',color:'#009e73',definition:'',research_role:null};formAfter={...formBefore,research_role:'category'}");
 assert.deepEqual(w.json('codeEditChanges(formAfter,formBefore)'),{research_role:'category'});
 assert.deepEqual(w.json('codeEditChanges(formBefore,formBefore)'),{});
 w.run("formAfter.name='Renamed'");assert.deepEqual(w.json('codeEditChanges(formAfter,formBefore)'),{name:'Renamed',research_role:'category'});
})
