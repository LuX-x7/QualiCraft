import test from 'node:test'
import assert from 'node:assert/strict'
import { STORY_SCENES } from '../website/lib/site/story-scenes.ts'
import { pickStoryIndex } from '../website/lib/site/scroll-story.ts'
test('natural reading visits all five plot kinds without clicking a tab',()=>{
 assert.deepEqual(STORY_SCENES.filter(s=>s.module==='plotting').map(s=>s.plot),['frequency','coverage','cooccurrence','hierarchy','accumulation'])
 const boxes=STORY_SCENES.map((_,i)=>({top:i*900}))
 for(let i=0;i<boxes.length;i++) assert.equal(STORY_SCENES[pickStoryIndex(boxes,i*900+400)].id,STORY_SCENES[i].id)
 assert.equal(new Set(STORY_SCENES.map(s=>s.id)).size,STORY_SCENES.length)
})
