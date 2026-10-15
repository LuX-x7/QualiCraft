import test from 'node:test'
import assert from 'node:assert/strict'
import { buildChartModel } from '../website/lib/report/chart-model.ts'

test('coverage keeps interview columns, code rows, zeroes and CSV row identity', () => {
 const table={head:['case','code','count'],rows:[['d2','B','0'],['d2','A','3'],['d1','B','1'],['d1','A','2']]}
 const before=JSON.stringify(table)
 const model=buildChartModel('coverage',table)
 assert.deepEqual(model.x,['d2','d1']); assert.deepEqual(model.y,['B','A'])
 assert.deepEqual(model.items.map(i=>[i.row,i.x,i.y,i.value]),[[0,'d2','B',0],[1,'d2','A',3],[2,'d1','B',1],[3,'d1','A',2]])
 assert.equal(JSON.stringify(table),before)
})
test('co-occurrence never invents diagonal, absent or reverse values',()=>{
 const model=buildChartModel('cooccurrence',{head:['code_a','code_b','count'],rows:[['A','B','7'],['B','A','7'],['B','C','1']]})
 assert.equal(model.items.length,3)
 assert.deepEqual(model.items.map(i=>i.row),[0,1,2])
 assert.equal(model.items.some(i=>i.x===i.y),false)
 assert.equal(model.items.some(i=>i.x==='B'&&i.y==='C'),false)
})
test('equal labels/counts in different themes stay independent rows',()=>{
 const model=buildChartModel('hierarchy',{head:['section','subsection','count'],rows:[['T1','same','2'],['T2','same','2']]})
 assert.deepEqual(model.items.map(i=>[i.row,i.group,i.value]),[[0,'T1',2],[1,'T2',2]])
})
test('accumulation reads step, cumulative and new directly without recalculation',()=>{
 const model=buildChartModel('accumulation',{head:['step','case','cumulative','new'],rows:[['1','b','24','24'],['2','a','58','34']]})
 assert.deepEqual(model.items.map(i=>[i.row,i.step,i.value,i.secondary]),[[0,1,24,24],[1,2,58,34]])
})
test('invalid counts cannot be silently displayed as zero',()=>{
 for(const value of ['', 'NaN', '-1', '1.5']) assert.throws(()=>buildChartModel('frequency',{head:['code','count'],rows:[['a',value]]}))
 assert.equal(buildChartModel('frequency',{head:['code','count'],rows:[['a','0']]}).items[0].value,0)
})
test('duplicate matrix coordinates trigger a fallback instead of merging',()=>{
 assert.throws(()=>buildChartModel('coverage',{head:['case','code','count'],rows:[['a','x','1'],['a','x','2']]}))
})

test('all five saved Bologna CSVs retain every original row and value', async()=>{
 const {readManifest,readCsv,verifyManifest}=await import('../website/lib/report/read.ts')
 const {fileURLToPath}=await import('node:url')
 const cwd=process.cwd()
 try {
  process.chdir(fileURLToPath(new URL('../website/',import.meta.url)))
  assert.deepEqual(await verifyManifest(),{ok:true,problems:[]})
  const manifest=await readManifest()
  let total=0
  for(const figure of manifest.figures){
   const [head,...rows]=await readCsv(figure.csv)
   const before=JSON.stringify(rows)
   const model=buildChartModel(figure.kind,{head,rows})
   assert.equal(model.items.length,rows.length)
   for(const item of model.items){
    const raw=rows[item.row]
    assert.equal(item.value,Number(raw[head.indexOf(figure.kind==='accumulation'?'cumulative':'count')]))
    if(figure.kind==='accumulation') assert.equal(item.secondary,Number(raw[head.indexOf('new')]))
    if(figure.kind==='coverage') {assert.equal(item.x,raw[0]);assert.equal(item.y,raw[1])}
    if(figure.kind==='cooccurrence') {assert.equal(item.y,raw[0]);assert.equal(item.x,raw[1])}
    if(figure.kind==='hierarchy') {assert.equal(item.group,raw[0]);assert.equal(item.label,raw[1])}
   }
   assert.equal(JSON.stringify(rows),before)
   total+=rows.length
  }
  assert.equal(total,594)
 } finally {process.chdir(cwd)}
})
