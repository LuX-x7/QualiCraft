import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {networkExamples,recordFamily,exampleContains} from '../website/lib/site/record-network.ts'
const primary=JSON.parse(readFileSync(new URL('../website/lib/site/bologna-evidence.json',import.meta.url))).example
const saved=Object.values(JSON.parse(readFileSync(new URL('../website/lib/report/bologna-evidence.json',import.meta.url))).examples)
test('network uses existing saved records, includes the original highlight and all saved roots',()=>{
 const records=networkExamples(saved,primary),before=JSON.stringify(saved)
 assert.ok(records.some(e=>e.annotation_id===primary.annotation_id))
 assert.equal(new Set(records.map(e=>e.code_id)).size,records.length)
 assert.deepEqual(new Set(records.map(e=>e.code_path[0].id)),new Set(saved.map(e=>e.code_path[0].id)))
 for(const id of new Set(records.map(e=>e.code_path[0].id)))assert.ok(records.filter(e=>e.code_path[0].id===id).length<=3)
 assert.equal(JSON.stringify(saved),before)
})
test('every displayed network edge has actual source identity and endpoints',()=>{
 const records=networkExamples(saved,primary)
 for(const root of new Set(records.map(e=>e.code_path[0].id))){
  const family=recordFamily(records,root),ids=new Set(family.nodes.map(n=>n.id))
  assert.equal(ids.size,family.nodes.length)
  for(const edge of family.edges){assert.ok(ids.has(edge.from)&&ids.has(edge.to));assert.notEqual(edge.from,edge.to)}
  for(const record of family.examples){
   assert.ok(family.edges.some(e=>e.from===`passage:${record.annotation_id}`&&e.to===family.key(record.code_id)))
   for(let i=1;i<record.code_path.length;i++)assert.ok(family.edges.some(e=>e.from===family.key(record.code_path[i].id)&&e.to===family.key(record.code_path[i-1].id)))
   assert.ok(exampleContains(record,`passage:${record.annotation_id}`))
  }
 }
})
test('same-name codes remain distinct network nodes',()=>{
 const a={...primary,annotation_id:'p1',code_id:'c1',code_path:[{id:'t',name:'theme',definition:''},{id:'c1',name:'same',definition:''}]}
 const b={...a,annotation_id:'p2',code_id:'c2',code_path:[a.code_path[0],{id:'c2',name:'same',definition:''}]}
 const family=recordFamily([a,b],'t')
 assert.equal(family.nodes.filter(n=>n.kind==='code').length,2)
 assert.equal(family.edges.filter(e=>e.to==='group:t').length,2)
})
