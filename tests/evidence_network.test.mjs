import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {evidenceNetwork,layoutEvidenceNetwork} from '../website/lib/site/evidence-network.ts'
import {networkExamples} from '../website/lib/site/record-network.ts'
const saved=Object.values(JSON.parse(readFileSync(new URL('../website/lib/report/bologna-evidence.json',import.meta.url))).examples)
test('network preserves all saved IDs, parent links and highlighted source records without mutation',()=>{
 const before=JSON.stringify(saved),graph=evidenceNetwork(saved),ids=new Set(graph.nodes.map(n=>n.id))
 assert.equal(ids.size,graph.nodes.length)
 for(const record of saved){
  const path=record.code_path.map((n,i)=>`${n.research_role??(i===record.code_path.length-1?'code':'group')}:${n.id}`)
  assert.equal(graph.nodes.find(n=>n.id==='passage:'+record.annotation_id).record.quote,record.quote)
  for(let i=1;i<path.length;i++)assert.ok(graph.links.some(l=>l.from===path[i]&&l.to===path[i-1]&&l.kind==='hierarchy'))
  assert.ok(graph.links.some(l=>l.from==='passage:'+record.annotation_id&&l.to===path.at(-1)))
 }
 for(const edge of graph.links)assert.ok(ids.has(edge.from)&&ids.has(edge.to)&&edge.from!==edge.to)
 assert.equal(JSON.stringify(saved),before)
})
test('research roles are explicit and hierarchy depth never invents a theme or category',()=>{
 const example=saved[0],plain={...example,annotation_id:'plain',code_id:'leaf',code_path:[{id:'root',name:'Root',definition:''},{id:'middle',name:'Middle',definition:''},{id:'leaf',name:'Leaf',definition:''}]}
 const plainGraph=evidenceNetwork([plain])
 assert.deepEqual(plainGraph.nodes.filter(n=>n.kind!=='passage').map(n=>n.kind),['group','group','code'])
 const assigned={...plain,annotation_id:'assigned',code_path:[{...plain.code_path[0],research_role:'theme'},{...plain.code_path[1],research_role:'category'},{...plain.code_path[2],research_role:'code'}]}
 const assignedGraph=evidenceNetwork([assigned])
 assert.deepEqual(assignedGraph.nodes.filter(n=>n.kind!=='passage').map(n=>n.kind),['theme','category','code'])
})
test('exported pairs retain their exact values and ambiguous names are not joined',()=>{
 const example=saved[0],make=(id,name)=>({...example,annotation_id:'a'+id,code_id:id,code_path:[{id:'t',name:'theme',definition:''},{id,name,definition:''}]})
 const graph=evidenceNetwork([make('c1','one'),make('c2','two')],{head:['code_a','code_b','count'],rows:[['one','two','7']]})
 assert.deepEqual(graph.links.filter(l=>l.kind==='cooccurrence'),[{from:'code:c1',to:'code:c2',kind:'cooccurrence',value:7}])
 const duplicate=evidenceNetwork([make('c1','one'),make('c2','one'),make('c3','two')],{head:['code_a','code_b','count'],rows:[['one','two','7']]})
 assert.equal(duplicate.nodes.filter(n=>n.kind==='code').length,3)
 assert.equal(duplicate.links.filter(l=>l.kind==='cooccurrence').length,0)
})
test('bounded network layout is deterministic and leaves the saved graph untouched',()=>{
 const graph=evidenceNetwork(saved),nodes=graph.nodes.filter(n=>n.kind!=='passage'),ids=new Set(nodes.map(n=>n.id)),links=graph.links.filter(l=>ids.has(l.from)&&ids.has(l.to)),before=JSON.stringify(graph)
 const layout=layoutEvidenceNetwork(nodes,links)
 assert.deepEqual(layoutEvidenceNetwork(nodes,links),layout)
 for(const n of layout)assert.ok(Number.isFinite(n.x)&&Number.isFinite(n.y)&&n.x>=42&&n.x<=958&&n.y>=42&&n.y<=578)
 assert.equal(JSON.stringify(graph),before)
})
test('site network sample stays readable without changing source records',()=>{
 const before=JSON.stringify(saved),sample=networkExamples(saved,saved[0]),roots=new Set(sample.map(record=>record.code_path[0].id))
 assert.deepEqual(roots,new Set(saved.map(record=>record.code_path[0].id)))
 for(const root of roots)assert.ok(sample.filter(record=>record.code_path[0].id===root).length<=3)
 assert.ok(sample.some(record=>record.annotation_id===saved[0].annotation_id))
 assert.equal(JSON.stringify(saved),before)
})
