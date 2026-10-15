import test from 'node:test'
import assert from 'node:assert/strict'
import { pageSceneIndex } from '../website/lib/site/story-scenes.ts'
test('focused illustration PageDown and PageUp visit the next reading scene',()=>{
 assert.equal(pageSceneIndex('PageDown',2,9,'BUTTON'),3)
 assert.equal(pageSceneIndex('PageUp',3,9,'g'),2)
 assert.equal(pageSceneIndex('PageDown',8,9,'BUTTON'),8)
 assert.equal(pageSceneIndex('PageUp',0,9,'BUTTON'),0)
})
test('native select/input paging and plot arrow keys remain native to their controls',()=>{
 for(const tag of ['SELECT','INPUT','TEXTAREA'])assert.equal(pageSceneIndex('PageDown',2,9,tag),null)
 for(const key of ['ArrowRight','Enter','Escape'])assert.equal(pageSceneIndex(key,2,9,'g'),null)
 assert.equal(pageSceneIndex('PageDown',0,0,'BUTTON'),null)
})
