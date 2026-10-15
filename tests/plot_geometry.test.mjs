import test from 'node:test'
import assert from 'node:assert/strict'
import { matrixLayout } from '../website/lib/site/plot-geometry.ts'

test('heatmap cells are square in both full and short frames',()=>{
 for(const height of [330,450]) for(const [cols,rows] of [[19,15],[21,21],[1,1]]) {
  const layout=matrixLayout(cols,rows,height)
  assert.equal(layout.cellWidth,layout.cellHeight)
  assert.equal(layout.gridWidth/layout.gridHeight,cols/rows)
  assert.ok(layout.x>=0&&layout.y>=0)
  assert.ok(layout.x+layout.gridWidth<=layout.width)
  assert.ok(layout.y+layout.gridHeight<=layout.height)
 }
})
test('cooccurrence stays square, coverage retains 19 × 15 geometry',()=>{
 const pair=matrixLayout(21,21,330),coverage=matrixLayout(19,15,330)
 assert.equal(pair.gridWidth,pair.gridHeight)
 assert.equal(coverage.gridWidth/coverage.gridHeight,19/15)
})

test('hierarchy pages preserve theme, CSV order and stable row navigation',async()=>{
 const {hierarchyPage}=await import('../website/lib/site/plot-geometry.ts')
 const items=Array.from({length:25},(_,row)=>({row,group:row<20?'A':'B'}))
 const page=hierarchyPage(items,17)
 assert.deepEqual(page.rows.map(item=>item.row),[16,17,18,19])
 assert.equal(page.previous,8); assert.equal(page.next,undefined)
 assert.equal(page.total,20)
 assert.deepEqual(hierarchyPage(items,23).rows.map(item=>item.row),[20,21,22,23,24])
})
