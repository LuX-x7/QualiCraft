import type { ChartModel, ChartItem } from '../report/chart-model'
export type OriginalHeatmap={kind:string;width:number;height:number;plot:{x:number;y:number;width:number;height:number};x:string[];y:string[];sha256:string}
const attribute=(tag:string,name:string)=>tag.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1]??''
const number=(tag:string,name:string)=>{const value=Number(attribute(tag,name));if(!attribute(tag,name)||!Number.isFinite(value))throw new Error('Missing SVG coordinate');return value}
const decode=(text:string)=>text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi,(_,value:string)=>value[0]==='#'?String.fromCodePoint(value[1].toLowerCase()==='x'?parseInt(value.slice(2),16):Number(value.slice(1))):({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[value.toLowerCase()]??''))
const normal=(text:string)=>text.replace(/\s/g,'')
function groupAt(svg:string,start:number){
 const tags=/<\/?g\b[^>]*>/g;tags.lastIndex=start;let depth=0,first=true
 for(let match;(match=tags.exec(svg));){if(first&&match.index!==start)throw new Error('Invalid SVG group');first=false;depth+=match[0].startsWith('</')?-1:1;if(depth===0)return svg.slice(start,tags.lastIndex)}
 throw new Error('Unclosed SVG group')
}
function group(svg:string,id:string){const marker=`id="${id}"`,at=svg.indexOf(marker);if(at<0)throw new Error('Missing SVG axis');const start=svg.lastIndexOf('<g',at);return groupAt(svg,start)}
function ticks(svg:string,axis:string,coordinate:string){
 const content=group(svg,axis),ids=[...content.matchAll(/<g\b[^>]*id="([xy]tick_\d+)"/g)].map(m=>m[1])
 return ids.map(id=>{const tick=group(content,id),use=tick.match(/<use\b[^>]*>/)?.[0];if(!use)throw new Error('Missing tick position');const text=[...tick.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map(m=>decode(m[1].replace(/<[^>]*>/g,''))).join(' ');return {position:number(use,coordinate),text}}).sort((a,b)=>a.position-b.position)
}
/** Read the actual exported SVG axes; CSV order and plot margins are not guessed. */
export function originalHeatmap(svg:string,kind:string,model:ChartModel,sha256:string):OriginalHeatmap {
 if(!['coverage','cooccurrence'].includes(kind))throw new Error('Not a heatmap')
 const root=svg.match(/<svg\b[^>]*>/)?.[0]??'',view=attribute(root,'viewBox').trim().split(/\s+/).map(Number)
 if(view.length!==4||view.some(n=>!Number.isFinite(n))||view[0]!==0||view[1]!==0||view[2]<=0||view[3]<=0)throw new Error('Unsupported SVG viewBox')
 const axes=group(svg,'axes_1'),clipped=axes.match(/<g\b[^>]*clip-path="url\(#([\w-]+)\)"[^>]*>/)
 if(!clipped||!groupAt(axes,clipped.index!).includes('<image'))throw new Error('Missing original heatmap image')
 const clip=svg.match(new RegExp(`<clipPath\\b[^>]*id="${clipped[1]}"[^>]*>([\\s\\S]*?)<\\/clipPath>`))?.[1],rect=clip?.match(/<rect\b[^>]*\/?\s*>/)?.[0]
 if(!rect)throw new Error('Missing original plot bounds')
 const plot={x:number(rect,'x'),y:number(rect,'y'),width:number(rect,'width'),height:number(rect,'height')}
 if(plot.x<0||plot.y<0||plot.width<=0||plot.height<=0||plot.x+plot.width>view[2]||plot.y+plot.height>view[3])throw new Error('Plot outside original SVG')
 const mapAxis=(axis:string,coordinate:string,labels:string[],start:number,size:number,removeExtension=false)=>{
  const found=ticks(axes,axis,coordinate),lookup=new Map(labels.map(label=>[normal(removeExtension?label.replace(/\.txt$/,''):label),label]))
  if(lookup.size!==labels.length||found.length!==labels.length)throw new Error('Ambiguous or incomplete original axis')
  const mapped=found.map((tick,i)=>{const label=lookup.get(normal(tick.text));if(!label||Math.abs(tick.position-(start+(i+.5)*size/found.length))>.05)throw new Error('Original axis does not match CSV');return label})
  if(new Set(mapped).size!==labels.length)throw new Error('Repeated original axis label');return mapped
 }
 return {kind,width:view[2],height:view[3],plot,x:mapAxis('matplotlib.axis_1','x',model.x,plot.x,plot.width,kind==='coverage'),y:mapAxis('matplotlib.axis_2','y',model.y,plot.y,plot.height),sha256}
}
export function originalCell(source:OriginalHeatmap,x:number,y:number){
 const p=source.plot;if(x<p.x||y<p.y||x>p.x+p.width||y>p.y+p.height)return null
 return {x:Math.min(source.x.length-1,Math.floor((x-p.x)/p.width*source.x.length)),y:Math.min(source.y.length-1,Math.floor((y-p.y)/p.height*source.y.length))}
}
export function originalWindow(source:OriginalHeatmap,x:number,y:number,small=false){
 const columns=Math.min(source.x.length,small?3:source.kind==='coverage'?5:4),rows=Math.min(source.y.length,small?3:source.kind==='coverage'?3:4),xStart=Math.max(0,Math.min(source.x.length-columns,x-Math.floor(columns/2))),yStart=Math.max(0,Math.min(source.y.length-rows,y-Math.floor(rows/2)))
 return {xStart,yStart,columns,rows,x:source.plot.x+xStart*source.plot.width/source.x.length,y:source.plot.y+yStart*source.plot.height/source.y.length,width:columns*source.plot.width/source.x.length,height:rows*source.plot.height/source.y.length}
}
export function originalCellRow(source:OriginalHeatmap,items:ChartItem[],x:number,y:number){return items.find(item=>item.x===source.x[x]&&item.y===source.y[y])}
