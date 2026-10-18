'use client'
import {siteUrl} from '@/lib/site/url'

import {useEffect,useId,useRef,useState,type KeyboardEvent,type PointerEvent} from 'react'
import {originalCell,originalWindow,originalCellRow,type OriginalHeatmap} from '@/lib/site/original-heatmap'
import type {ChartModel} from '@/lib/report/chart-model'

export default function HeatmapMagnifier({source,svg,label,model,selected,onSelect,small}:{source:OriginalHeatmap;svg:string;label:string;model:ChartModel;selected:number;onSelect:(row:number)=>void;small:boolean}) {
 const [cell,setCell]=useState({x:0,y:0}),[center,setCenter]=useState({x:0,y:0}),[frozen,setFrozen]=useState(false),localRow=useRef<number|null>(null),drag=useRef(false),hint=useId(),clip=useId()
 useEffect(()=>{if(selected<0||localRow.current===selected)return;const item=model.items.find(item=>item.row===selected);if(!item)return;const point={x:source.x.indexOf(item.x!),y:source.y.indexOf(item.y!)};if(point.x>=0&&point.y>=0){setCell(point);setCenter(point)}},[selected,model,source])
 useEffect(()=>{setCenter(cell)},[small])
 const region=originalWindow(source,center.x,center.y,small),active=originalCellRow(source,model.items,cell.x,cell.y),stepX=source.plot.width/source.x.length,stepY=source.plot.height/source.y.length
 const choose=(x:number,y:number,moveFrame=true)=>{const point={x:Math.max(0,Math.min(source.x.length-1,x)),y:Math.max(0,Math.min(source.y.length-1,y))};setCell(point);if(moveFrame)setCenter(point);const row=originalCellRow(source,model.items,point.x,point.y)?.row??-1;localRow.current=row;onSelect(row)}
 const pointer=(event:PointerEvent<SVGSVGElement>,moveFrame:boolean)=>{
  if(!drag.current&&(event.pointerType!=='mouse'||frozen))return
  const matrix=event.currentTarget.getScreenCTM();if(!matrix)return;const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse()),found=originalCell(source,point.x,point.y)
  if(found&&(moveFrame||(found.x>=region.xStart&&found.x<region.xStart+region.columns&&found.y>=region.yStart&&found.y<region.yStart+region.rows)))choose(found.x,found.y,moveFrame)
 }
 const down=(event:PointerEvent<SVGSVGElement>,moveFrame:boolean)=>{const matrix=event.currentTarget.getScreenCTM();if(!matrix)return;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());const found=originalCell(source,p.x,p.y);if(!found||(!moveFrame&&(found.x<region.xStart||found.x>=region.xStart+region.columns||found.y<region.yStart||found.y>=region.yStart+region.rows)))return;drag.current=true;event.currentTarget.setPointerCapture(event.pointerId);pointer(event,moveFrame)}
 const finish=(event:PointerEvent<SVGSVGElement>)=>{drag.current=false;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)}
 const key=(event:KeyboardEvent<SVGSVGElement>)=>{
  if(['Enter',' '].includes(event.key)){event.preventDefault();setFrozen(value=>!value);return}
  if(event.key==='Escape'){event.preventDefault();setFrozen(false);return}
  let x=cell.x,y=cell.y
  if(event.key==='Home'){x=0;y=0}else if(event.key==='End'){x=source.x.length-1;y=source.y.length-1}else if(event.key==='ArrowLeft')x--;else if(event.key==='ArrowRight')x++;else if(event.key==='ArrowUp')y--;else if(event.key==='ArrowDown')y++;else return
  event.preventDefault();choose(x,y)
 }
 const selectedRect=<rect className="lens-selected-cell" x={source.plot.x+cell.x*stepX} y={source.plot.y+cell.y*stepY} width={stepX} height={stepY} vectorEffect="non-scaling-stroke"/>
 return <div className="heatmap-magnifier" data-heatmap-lens={source.kind} data-original-sha256={source.sha256} data-cell-x={cell.x} data-cell-y={cell.y} data-window-x={region.xStart} data-window-y={region.yStart}>
  <div className="lens-panels">
   <div className="lens-detail"><div className="lens-panel-heading mono"><span>MAGNIFIED ORIGINAL</span><span>{region.columns} × {region.rows} cells</span></div><svg className="lens-detail-svg" viewBox={`${region.x} ${region.y} ${region.width} ${region.height}`} preserveAspectRatio="xMidYMid meet" role="group" aria-label={`${label} magnified original cells`} onPointerDown={event=>down(event,false)} onPointerMove={event=>pointer(event,false)} onPointerUp={finish} onPointerCancel={finish}>
    <defs><clipPath id={clip}><rect x={region.x} y={region.y} width={region.width} height={region.height}/></clipPath></defs>
    <image href={siteUrl(svg)} x="0" y="0" width={source.width} height={source.height} aria-hidden="true" clipPath={`url(#${clip})`}/>
    <rect className="lens-hit-area" x={region.x} y={region.y} width={region.width} height={region.height}/>{selectedRect}
   </svg><div className="lens-coordinate" role="status" aria-live="polite" aria-atomic="true"><span className="mono">COLUMN {cell.x+1} · ROW {cell.y+1}</span><p>{source.x[cell.x]}<br/>× {source.y[cell.y]}</p><span className="lens-csv-value" data-lens-row={active?.row??''}>{active?`CSV count: ${active.value}`:'No exported CSV row for this cell.'}</span></div></div>
   <div className="lens-overview"><div className="lens-panel-heading mono">COMPLETE ORIGINAL</div><svg className="lens-original-svg" viewBox={`0 0 ${source.width} ${source.height}`} preserveAspectRatio="xMidYMid meet" tabIndex={0} role="group" aria-label={`${label} original with movable magnifier`} aria-describedby={hint} onKeyDown={key} onPointerDown={event=>down(event,true)} onPointerMove={event=>pointer(event,true)} onPointerUp={finish} onPointerCancel={finish}>
    <image href={siteUrl(svg)} x="0" y="0" width={source.width} height={source.height} aria-hidden="true"/>
    <rect className="lens-hit-area" x={source.plot.x} y={source.plot.y} width={source.plot.width} height={source.plot.height}/>
    <rect className="lens-viewfinder" x={region.x} y={region.y} width={region.width} height={region.height} vectorEffect="non-scaling-stroke"/>
   </svg><button type="button" className="lens-freeze" aria-pressed={frozen} onClick={()=>setFrozen(value=>!value)}>{frozen?'Resume hover':'Freeze hover'}</button><p className="lens-hint" id={hint}>Move or drag the frame. Arrow keys move one cell; Home/End reach the corners. Enter freezes hover.</p><a className="quiet-link" href={siteUrl(svg)} target="_blank" rel="noreferrer">Open full-size original ↗</a></div>
  </div>
 </div>
}
