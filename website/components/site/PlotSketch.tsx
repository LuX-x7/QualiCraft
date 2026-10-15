'use client'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { buildChartModel, type ChartTable, type ChartItem } from '@/lib/report/chart-model'
import { matrixLayout, hierarchyPage } from '@/lib/site/plot-geometry'
import type { WorkflowData } from './WorkflowIllustration'

/** Homepage overview: every mark is an existing CSV row; report assets stay intact. */
export default function PlotSketch({kind,data,charts}:{kind:string;data:WorkflowData;charts:Record<string,ChartTable>}) {
 const [small,setSmall]=useState(false),[shortScreen,setShortScreen]=useState(false)
 useEffect(()=>{const m=window.matchMedia('(max-width: 600px)');const short=window.matchMedia('(max-height: 850px) and (min-width: 1001px)');const update=()=>{setSmall(m.matches);setShortScreen(short.matches)};update();m.addEventListener('change',update);short.addEventListener('change',update);return()=>{m.removeEventListener('change',update);short.removeEventListener('change',update)}},[])
 const [selected,setSelected]=useState(0),[original,setOriginal]=useState(false),marks=useRef<Map<number,SVGGElement>>(new Map()),focusRow=useRef<number|null>(null)
 const table=charts[kind],figure=data.figures.find(item=>item.kind===kind)
 const model=useMemo(()=>{try{return table?buildChartModel(kind,table):null}catch{return null}},[kind,table])
 useEffect(()=>{if(focusRow.current!==null){marks.current.get(focusRow.current)?.focus({preventScroll:true});focusRow.current=null}},[selected,kind])
 if(!figure||!model)return <p role="status">Verified data is unavailable. <a href="/report">Open the report.</a></p>
 const active=model.items[selected]??model.items[0],page=hierarchyPage(model.items,selected),bars=kind==='frequency'||kind==='hierarchy',barItems=kind==='hierarchy'?page.rows:model.items
 const maximum=Math.max(1,...(kind==='hierarchy'?model.items.filter(item=>item.group===page.group):model.items).map(item=>item.value))
 const ticks=[...new Set([0,.25,.5,.75,1].map(f=>Math.ceil(maximum*f)))]
 const select=(row:number)=>setSelected(row)
 const key=(event:KeyboardEvent<SVGGElement>,row:number)=>{
  let next=row
  if(event.key==='Home')next=0;else if(event.key==='End')next=model.items.length-1
  else if(['ArrowDown','ArrowRight'].includes(event.key))next=Math.min(row+1,model.items.length-1)
  else if(['ArrowUp','ArrowLeft'].includes(event.key))next=Math.max(row-1,0)
  else if(event.key==='Enter'){event.preventDefault();window.location.assign(`/report#table-${kind}`);return}else return
  event.preventDefault();focusRow.current=next;select(next)
 }
 const mark=(item:ChartItem,children:ReactNode)=><g key={item.row} role="button" tabIndex={selected===item.row?0:-1} ref={el=>{if(el)marks.current.set(item.row,el);else marks.current.delete(item.row)}} data-csv-row={item.row} aria-label={`Read ${item.group?item.group+' › ':''}${item.label}: ${item.value}`} aria-pressed={selected===item.row} className={`home-plot-mark${selected===item.row?' is-selected':''}`} onFocus={()=>select(item.row)} onClick={()=>select(item.row)} onPointerEnter={()=>select(item.row)} onKeyDown={event=>key(event,item.row)}><title>{`${item.label}: ${item.value}`}</title>{children}</g>
 const short=(value:string,n=35)=>value.length>n?value.slice(0,n-1)+'…':value
 const left=bars?355:70,top=40,w=900,h=kind==='hierarchy'?240:shortScreen?330:450
 const rowStep=(h-65)/Math.max(1,barItems.length)
 const bottom=h-55,lineY=(value:number)=>bottom-value/maximum*(h-100)
 const matrix=kind==='coverage'||kind==='cooccurrence',geometry=matrixLayout(model.x.length,model.y.length,h),mx=geometry.x,my=geometry.y,cell=geometry.cellWidth,matrixStep=geometry.cellHeight
 return <figure className={`story-plot story-plot--${kind}`}>
  <div className="home-plot-views" role="group" aria-label={`${figure.label} presentation`}><button type="button" aria-pressed={!original} onClick={()=>setOriginal(false)}>Explore counts</button><button type="button" aria-pressed={original} onClick={()=>setOriginal(true)}>Original figure</button><span>{original?'Unmodified workbench SVG':'Interactive view · existing CSV'}</span></div>
  {original?<div className="home-original-figure">
   {/* Native SVG dimensions determine the image ratio; the frame never stretches it. */}
   {/* eslint-disable-next-line @next/next/no-img-element */}
   <a href={`/report/${figure.svg}`} target="_blank" rel="noreferrer" aria-label={`Open full-size original ${figure.label}`}><img src={`/report/${figure.svg}`} alt={`Unmodified Bologna workbench export: ${figure.label}`}/></a><p>Original proportions. Open the figure for full-size labels.</p>
  </div>:<>
  <div className="home-plot-inspector" role="status" aria-live="polite" aria-atomic="true"><span>{active?.group?active.group+' › ':''}{active?.label}</span><strong>{active?.value}<small>{kind==='accumulation'?'distinct codes':'CSV count'}</small></strong>{active?.secondary!==undefined&&<span className="home-plot-new">{active.secondary} newly encountered</span>}</div>
  {kind==='hierarchy'&&<div className="home-theme-guide"><label>Saved theme <select aria-label="Saved theme in hierarchy" value={page.group} onChange={event=>select(model.items.find(item=>item.group===event.target.value)?.row??0)}>{model.groups.map(name=><option key={name}>{name}</option>)}</select></label><div><span>{page.start+1}–{page.start+page.rows.length} of {page.total} codes</span><button type="button" disabled={page.start===0} onClick={()=>select(page.previous!)} aria-label="Previous codes in theme">←</button><button type="button" disabled={page.next===undefined} onClick={()=>select(page.next!)} aria-label="Next codes in theme">→</button></div></div>}
  <svg viewBox={matrix?`${small?185:0} 0 ${geometry.width-(small?185:0)} ${geometry.height}`:small&&bars?`300 0 600 ${h}`:`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" className={`home-plot-svg${matrix?' home-plot-svg--matrix':''}`} role="group" aria-label={`${figure.label} ${kind==='hierarchy'?'selected theme page':'complete overview'}`}>
   {bars&&<>{ticks.map(value=><g className="home-plot-grid" key={value}><line x1={left+value/maximum*490} x2={left+value/maximum*490} y1="22" y2={h-25}/><text x={left+value/maximum*490} y={h-3} textAnchor="middle">{value}</text></g>)}{barItems.map((item,i)=>mark(item,<><rect x="0" y={top+i*rowStep-19} width="900" height={rowStep} fill="transparent"/>{small&&<text className="home-plot-mobile-index" x={left-16} y={top+i*rowStep-2} textAnchor="end">{String(i+1).padStart(2,'0')}</text>}<text className="home-plot-label" x={left-16} y={top+i*rowStep-2} textAnchor="end">{short(item.label,34)}</text><rect className="home-plot-bar" x={left} y={top+i*rowStep-16} width={item.value/maximum*490} height={Math.min(17,rowStep*.68)}/><text className="home-plot-number" x={left+item.value/maximum*490+10} y={top+i*rowStep-2}>{item.value}</text></>))}</>}
   {matrix&&<><text className="home-plot-note" x={mx} y="22">{kind==='coverage'?'Interview → · code ↓':'Code pairs'}</text>{model.x.map((label,i)=><text key={label} className="home-plot-axis" x={mx+i*cell+cell/2} y={my-12} textAnchor="middle">{String(i+1).padStart(2,'0')}</text>)}{model.y.map((label,i)=><text key={label} className="home-matrix-name" x={mx-12} y={my+i*matrixStep+matrixStep*.72} textAnchor="end">{small?String(i+1).padStart(2,'0'):short(label,36)}</text>)}<rect x={mx} y={my} width={model.x.length*cell} height={model.y.length*matrixStep} className="home-plot-matrix-ground"/>{model.items.map(item=>{const x=mx+model.x.indexOf(item.x!)*cell,y=my+model.y.indexOf(item.y!)*matrixStep;return mark(item,<><rect className="home-plot-cell" x={x+1} y={y+1} width={cell-2} height={matrixStep-2} fill={`color-mix(in srgb,var(--accent) ${8+item.value/maximum*82}%,white)`}/><text className="home-cell-number" x={x+cell/2} y={y+matrixStep*.72} textAnchor="middle" fill={item.value/maximum>.6?'white':'var(--ink)'}>{item.value}</text></>)})}</>}
   {kind==='accumulation'&&<>{ticks.map(value=><g className="home-plot-grid" key={value}><line x1={left} x2="850" y1={lineY(value)} y2={lineY(value)}/><text x="55" y={lineY(value)+6} textAnchor="end">{value}</text></g>)}<path className="home-plot-line" pathLength="1" d={model.items.map((item,i)=>`${i?'L':'M'} ${70+i/(model.items.length-1)*780} ${lineY(item.value)}`).join(' ')}/>{model.items.map((item,i)=>mark(item,<><circle cx={70+i/(model.items.length-1)*780} cy={lineY(item.value)} r="16" fill="transparent"/><circle className="home-code-dot" cx={70+i/(model.items.length-1)*780} cy={lineY(item.value)} r="5"/><text className="home-plot-axis" x={70+i/(model.items.length-1)*780} y={h-25} textAnchor="middle">{item.step}</text></>))}<text className="home-plot-note" x="70" y="23">Distinct codes encountered</text><text className="home-plot-note" x="460" y={h-2} textAnchor="middle">Interview step · original file-name order</text></>}
  </svg>
  </>}
  <div className="home-plot-controls"><label>Read a value<select aria-label={`${figure.label} value`} value={selected} onChange={event=>{select(Number(event.target.value));setOriginal(false)}}>{model.items.map(item=><option key={item.row} value={item.row}>{item.group?item.group+' › ':''}{item.label}</option>)}</select></label><a href={`/report#table-${kind}`}>Full table ↗</a><a href={`/report/${figure.csv}`} download>CSV ↓</a><a href={`/report/${figure.svg}`} download>SVG ↓</a></div>
  <figcaption>{figure.credit}</figcaption>
 </figure>
}
