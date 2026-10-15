'use client'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { buildChartModel, type ChartTable, type ChartItem } from '@/lib/report/chart-model'
import type { WorkflowData } from './WorkflowIllustration'

/** Homepage overview: every mark is an existing CSV row; report assets stay intact. */
export default function PlotSketch({kind,data,charts}:{kind:string;data:WorkflowData;charts:Record<string,ChartTable>}) {
 const [small,setSmall]=useState(false),[shortScreen,setShortScreen]=useState(false)
 useEffect(()=>{const m=window.matchMedia('(max-width: 600px)');const short=window.matchMedia('(max-height: 850px) and (min-width: 1001px)');const update=()=>{setSmall(m.matches);setShortScreen(short.matches)};update();m.addEventListener('change',update);short.addEventListener('change',update);return()=>{m.removeEventListener('change',update);short.removeEventListener('change',update)}},[])
 const [selected,setSelected]=useState(0),marks=useRef<Map<number,SVGGElement>>(new Map())
 const table=charts[kind],figure=data.figures.find(item=>item.kind===kind)
 const model=useMemo(()=>{try{return table?buildChartModel(kind,table):null}catch{return null}},[kind,table])
 if(!figure||!model)return <p role="status">Verified data is unavailable. <a href="/report">Open the report.</a></p>
 const maximum=Math.max(1,...model.items.map(item=>item.value)),active=model.items[selected]??model.items[0]
 const ticks=[...new Set([0,.25,.5,.75,1].map(f=>Math.ceil(maximum*f)))]
 const select=(row:number)=>setSelected(row)
 const key=(event:KeyboardEvent<SVGGElement>,row:number)=>{
  let next=row
  if(event.key==='Home')next=0;else if(event.key==='End')next=model.items.length-1
  else if(['ArrowDown','ArrowRight'].includes(event.key))next=Math.min(row+1,model.items.length-1)
  else if(['ArrowUp','ArrowLeft'].includes(event.key))next=Math.max(row-1,0)
  else if(event.key==='Enter'){event.preventDefault();window.location.assign(`/report#table-${kind}`);return}else return
  event.preventDefault();select(next);marks.current.get(next)?.focus({preventScroll:true})
 }
 const mark=(item:ChartItem,children:ReactNode)=><g key={item.row} role="button" tabIndex={selected===item.row?0:-1} ref={el=>{if(el)marks.current.set(item.row,el);else marks.current.delete(item.row)}} data-csv-row={item.row} aria-label={`Read ${item.group?item.group+' › ':''}${item.label}: ${item.value}`} aria-pressed={selected===item.row} className={`home-plot-mark${selected===item.row?' is-selected':''}`} onFocus={()=>select(item.row)} onClick={()=>select(item.row)} onPointerEnter={()=>select(item.row)} onKeyDown={event=>key(event,item.row)}><title>{`${item.label}: ${item.value}`}</title>{children}</g>
 const short=(value:string,n=35)=>value.length>n?value.slice(0,n-1)+'…':value
 const left=kind==='frequency'?355:70,top=40,w=900,h=shortScreen?330:450
 const rowStep=(h-65)/Math.max(1,model.items.length),matrixStep=(h-105)/Math.max(1,model.y.length),groupHeight=(h-30)/2
 const bottom=h-55,lineY=(value:number)=>bottom-value/maximum*(h-100)
 const matrix=kind==='coverage'||kind==='cooccurrence',mx=80,my=65,cell=(900-mx-25)/Math.max(1,model.x.length)
 return <figure className={`story-plot story-plot--${kind}`}>
  <div className="home-plot-inspector" role="status" aria-live="polite" aria-atomic="true"><span>{active?.group?active.group+' › ':''}{active?.label}</span><strong>{active?.value}<small>{kind==='accumulation'?'distinct codes':'CSV count'}</small></strong>{active?.secondary!==undefined&&<span className="home-plot-new">{active.secondary} newly encountered</span>}</div>
  <svg viewBox={small&&kind==='frequency'?`300 0 600 ${h}`:`0 0 ${w} ${h}`} className="home-plot-svg" role="group" aria-label={`${figure.label} complete overview`}>
   {kind==='frequency'&&<>{ticks.map(value=><g className="home-plot-grid" key={value}><line x1={left+value/maximum*490} x2={left+value/maximum*490} y1="22" y2={h-25}/><text x={left+value/maximum*490} y={h-3} textAnchor="middle">{value}</text></g>)}{model.items.map((item,i)=>mark(item,<><rect x="0" y={top+i*rowStep-19} width="900" height={rowStep} fill="transparent"/>{small&&<text className="home-plot-mobile-index" x={left-16} y={top+i*rowStep-2} textAnchor="end">{String(i+1).padStart(2,'0')}</text>}<text className="home-plot-label" x={left-16} y={top+i*rowStep-2} textAnchor="end">{short(item.label,34)}</text><rect className="home-plot-bar" x={left} y={top+i*rowStep-16} width={item.value/maximum*490} height={Math.min(17,rowStep*.68)}/><text className="home-plot-number" x={left+item.value/maximum*490+10} y={top+i*rowStep-2}>{item.value}</text></>))}</>}
   {matrix&&<><text className="home-plot-note" x="80" y="23">{kind==='coverage'?'Interview → · code ↓':'Code pairs · blank = no exported value'}</text>{model.x.map((label,i)=><text key={label} className="home-plot-axis" x={mx+i*cell+cell/2} y={my-12} textAnchor="middle">{String(i+1).padStart(2,'0')}</text>)}{model.y.map((label,i)=><text key={label} className="home-plot-axis" x={mx-12} y={my+i*matrixStep+matrixStep*.72} textAnchor="end">{String(i+1).padStart(2,'0')}</text>)}<rect x={mx} y={my} width={model.x.length*cell} height={model.y.length*matrixStep} className="home-plot-matrix-ground"/>{model.items.map(item=>{const x=mx+model.x.indexOf(item.x!)*cell,y=my+model.y.indexOf(item.y!)*matrixStep;return mark(item,<><rect className="home-plot-cell" x={x+1} y={y+1} width={cell-2} height={matrixStep-2} fill={`color-mix(in srgb,var(--accent) ${8+item.value/maximum*82}%,white)`}/><text className="home-cell-number" x={x+cell/2} y={y+matrixStep*.72} textAnchor="middle" fill={item.value/maximum>.6?'white':'var(--ink)'}>{item.value}</text></>)})}<text className="home-plot-note" x="80" y={h-8}>Numbered axes follow the original CSV order. Select a cell for full names.</text></>}
   {kind==='hierarchy'&&<>{model.groups.map((group,gi)=>{const x=20+(gi%4)*222,y=16+Math.floor(gi/4)*(groupHeight+6),items=model.items.filter(item=>item.group===group);return <g key={group}><path className="hierarchy-frame" d={`M${x} ${y+24}V${y+groupHeight-10}H${x+204}`}/><text className="home-plot-note" x={x+8} y={y+14}>{short(group,23)}</text>{items.map((item,i)=>mark(item,<><circle cx={x+18+(i%12)*15} cy={y+44+Math.floor(i/12)*Math.min(15,(groupHeight-42)/10)} r="7.5" fill="transparent"/><circle className="home-code-dot" cx={x+18+(i%12)*15} cy={y+44+Math.floor(i/12)*Math.min(15,(groupHeight-42)/10)} r={shortScreen?2+item.value/maximum*1.9:2.6+item.value/maximum*3.7}/></>))}</g>})}<text className="home-plot-note" x="20" y={h-3}>{model.items.length} exported code rows · {model.groups.length} saved themes · dot size follows CSV count</text></>}
   {kind==='accumulation'&&<>{ticks.map(value=><g className="home-plot-grid" key={value}><line x1={left} x2="850" y1={lineY(value)} y2={lineY(value)}/><text x="55" y={lineY(value)+6} textAnchor="end">{value}</text></g>)}<path className="home-plot-line" pathLength="1" d={model.items.map((item,i)=>`${i?'L':'M'} ${70+i/(model.items.length-1)*780} ${lineY(item.value)}`).join(' ')}/>{model.items.map((item,i)=>mark(item,<><circle cx={70+i/(model.items.length-1)*780} cy={lineY(item.value)} r="16" fill="transparent"/><circle className="home-code-dot" cx={70+i/(model.items.length-1)*780} cy={lineY(item.value)} r="5"/><text className="home-plot-axis" x={70+i/(model.items.length-1)*780} y={h-25} textAnchor="middle">{item.step}</text></>))}<text className="home-plot-note" x="70" y="23">Distinct codes encountered</text><text className="home-plot-note" x="460" y={h-2} textAnchor="middle">Interview step · original file-name order</text></>}
  </svg>
  <div className="home-plot-controls"><label>Read a value<select aria-label={`${figure.label} value`} value={selected} onChange={event=>select(Number(event.target.value))}>{model.items.map(item=><option key={item.row} value={item.row}>{item.group?item.group+' › ':''}{item.label}</option>)}</select></label><a href={`/report#table-${kind}`}>Full table ↗</a><a href={`/report/${figure.csv}`} download>CSV ↓</a><a href={`/report/${figure.svg}`} download>SVG ↓</a></div>
  <figcaption>{figure.credit}</figcaption>
 </figure>
}
