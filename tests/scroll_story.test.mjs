import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { pickStoryIndex, buildTrail } from '../website/lib/site/scroll-story.ts'

test('scroll story follows the reading line, including gaps and skipped chapters',()=>{
 const boxes=[{top:-900},{top:-400},{top:110},{top:900},{top:1400}]
 assert.equal(pickStoryIndex(boxes,400),2)
 assert.equal(pickStoryIndex(boxes,1000),3)
 assert.equal(pickStoryIndex(boxes,1800),4)
})
test('reverse scroll and the first chapter are deterministic',()=>{
 assert.equal(pickStoryIndex([{top:200},{top:600}],100),0)
 assert.equal(pickStoryIndex([{top:-200},{top:200}],200),1)
 assert.equal(pickStoryIndex([],200),-1)
})
test('the saved Bologna passage, code and every ancestor retain their identities',()=>{
 const {example}=JSON.parse(readFileSync(new URL('../website/lib/site/bologna-evidence.json',import.meta.url)))
 const before=JSON.stringify(example),trail=buildTrail(example)
 assert.equal(trail.passage.quote,example.quote)
 assert.equal(trail.code.id,example.code_id)
 assert.deepEqual(trail.ancestors.map(node=>node.id),example.code_path.slice(0,-1).map(node=>node.id))
 assert.deepEqual(trail.edges.map(edge=>[edge.from,edge.to]),[[example.annotation_id,example.code_id],...example.code_path.slice(1).map((node,i)=>[node.id,example.code_path[i].id])])
 assert.equal(JSON.stringify(example),before)
})
test('equal display labels never merge relationship nodes',()=>{
 const trail=buildTrail({annotation_id:'a',code_id:'leaf',quote:'source',code_path:[{id:'root',name:'same',definition:''},{id:'leaf',name:'same',definition:''}]})
 assert.equal(trail.code.id,'leaf');assert.equal(trail.ancestors[0].id,'root')
 assert.equal(trail.edges.some(edge=>edge.from===edge.to),false)
})
test('inconsistent source identity cannot produce a convincing invented link',()=>{
 assert.throws(()=>buildTrail({annotation_id:'a',code_id:'missing',quote:'source',code_path:[{id:'root',name:'root',definition:''}]}))
 assert.throws(()=>buildTrail({annotation_id:'a',code_id:'leaf',quote:'source',code_path:[{id:'leaf',name:'root',definition:''},{id:'leaf',name:'leaf',definition:''}]}))
})
