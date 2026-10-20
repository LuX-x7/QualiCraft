import test from 'node:test'
import {fileURLToPath} from 'node:url'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {buildChartModel} from '../website/lib/report/chart-model.ts'
import {readCsv} from '../website/lib/report/read.ts'
import {originalHeatmap,originalCell,originalWindow,originalCellRow} from '../website/lib/site/original-heatmap.ts'
const tables={};const cwd=process.cwd();process.chdir(fileURLToPath(new URL('../website',import.meta.url)));
try{for(const kind of ['coverage','cooccurrence']){const [head,...rows]=await readCsv('../original-bologna/report/figures/'+kind+'.csv');tables[kind]={head,rows}}}finally{process.chdir(cwd)}
const load=kind=>{const root=new URL('../website/public/original-bologna/report/figures/',import.meta.url),svg=readFileSync(new URL(kind+'.svg',root),'utf8'),model=buildChartModel(kind,tables[kind]);return {svg,model,source:originalHeatmap(svg,kind,model,'test-hash')}}
test('actual original axes and plot bounds are recovered, including different CSV order',()=>{
 const coverage=load('coverage'),pairs=load('cooccurrence')
 assert.equal(coverage.source.x.length,19);assert.equal(coverage.source.y.length,15)
 assert.equal(pairs.source.x.length,12);assert.equal(pairs.source.y.length,12)
 assert.notEqual(pairs.source.x[0],pairs.model.x[0])
 assert.equal(pairs.source.x[0],'keeping working materials after the end of the project')
 assert.equal(pairs.source.plot.width,pairs.source.plot.height)
})
test('every CSV row maps to its true original cell; zeros and absent pairs stay distinct',()=>{
 for(const kind of ['coverage','cooccurrence']){
  const {source,model}=load(kind),before=JSON.stringify(model)
  for(const item of model.items){const x=source.x.indexOf(item.x),y=source.y.indexOf(item.y);assert.ok(x>=0&&y>=0);assert.equal(originalCellRow(source,model.items,x,y),item);assert.deepEqual(originalCell(source,source.plot.x+(x+.5)*source.plot.width/source.x.length,source.plot.y+(y+.5)*source.plot.height/source.y.length),{x,y})}
  if(kind==='cooccurrence')assert.equal(originalCellRow(source,model.items,0,0),undefined)
  else assert.equal(originalCellRow(source,model.items,0,0).value,0)
  assert.equal(JSON.stringify(model),before)
 }
})
test('all movable windows stay within original bounds at every cell and both sizes',()=>{
 for(const kind of ['coverage','cooccurrence'])for(const small of [false,true]){
  const {source}=load(kind),p=source.plot
  for(let x=0;x<source.x.length;x++)for(let y=0;y<source.y.length;y++){
   const w=originalWindow(source,x,y,small);assert.ok(w.xStart<=x&&x<w.xStart+w.columns&&w.yStart<=y&&y<w.yStart+w.rows)
   assert.ok(w.x>=p.x&&w.y>=p.y&&w.x+w.width<=p.x+p.width+.00001&&w.y+w.height<=p.y+p.height+.00001)
   assert.ok(Math.abs(w.width/w.columns-p.width/source.x.length)<1e-8)
  }
  assert.equal(originalCell(source,p.x-1,p.y),null);assert.equal(originalCell(source,p.x,p.y-1),null)
  assert.deepEqual(originalCell(source,p.x+p.width,p.y+p.height),{x:source.x.length-1,y:source.y.length-1})
 }
})
test('unrecognised or inconsistent source geometry fails instead of guessing',()=>{
 const {svg,model}=load('coverage')
 for(const broken of [svg.replace('id="axes_1"','id="other"'),svg.replace('id="matplotlib.axis_1"','id="other_axis"'),svg.replace('interview01','unmatched-label')])assert.throws(()=>originalHeatmap(broken,'coverage',model,'test'))
 assert.throws(()=>originalHeatmap(svg,'coverage',{...model,x:[...model.x,'missing.txt']},'test'))
 assert.throws(()=>originalHeatmap(svg,'frequency',model,'test'))
})
test('XML labels are decoded before matching saved CSV names',()=>{
 const axis=(id,labels,coord)=>`<g id="matplotlib.axis_${id}">${labels.map((s,i)=>`<g id="${coord}tick_${i+1}"><g><use x="${coord==='x'?30+40*i:10}" y="${coord==='y'?30+40*i:90}"/></g><g><text>${s}</text></g></g>`).join('')}</g>`
 const svg=`<svg viewBox="0 0 100 100"><g id="axes_1"><g clip-path="url(#plot)"><image/></g>${axis(1,['A&amp;B','C'],'x')}${axis(2,['D','E'],'y')}</g><defs><clipPath id="plot"><rect x="10" y="10" width="80" height="80"/></clipPath></defs></svg>`
 const source=originalHeatmap(svg,'cooccurrence',{x:['A&B','C'],y:['D','E'],items:[],groups:[]},'test')
 assert.deepEqual(source.x,['A&B','C'])
})
