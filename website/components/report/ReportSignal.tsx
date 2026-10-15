'use client'
import { useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { buildChartModel, type ChartTable } from '@/lib/report/chart-model'
export default function ReportSignal({table,credit}:{table:ChartTable;credit:string}) {
 const model=useMemo(()=>{try{return buildChartModel('frequency',table)}catch{return null}},[table])
 const [active,setActive]=useState(0)
 const refs=useRef<Array<HTMLAnchorElement|null>>([])
 if(!model||!model.items.length)return null
 const item=model.items[active]
 const keyboard=(event:KeyboardEvent<HTMLAnchorElement>,index:number)=>{
  let next=index
  if(event.key==='ArrowRight')next=Math.min(index+1,model.items.length-1)
  else if(event.key==='ArrowLeft')next=Math.max(index-1,0)
  else if(event.key==='Home')next=0
  else if(event.key==='End')next=model.items.length-1
  else return
  event.preventDefault();setActive(next);refs.current[next]?.focus()
 }
 return <div className="report-signal"><span className="mono">CSV SNAPSHOT / {model.items.length} CODES</span><div className="signal-bars" role="group" aria-label="Frequency preview: one pixel per exported count">{model.items.map((row,index)=><a key={row.row} href="#sec-frequency" ref={el=>{refs.current[index]=el}} className={active===index?'is-current':''} aria-label={`${row.label}: ${row.value}; explore frequency chapter`} tabIndex={active===index?0:-1} onFocus={()=>setActive(index)} onPointerEnter={()=>setActive(index)} onKeyDown={event=>keyboard(event,index)}>{Array.from({length:row.value},(_,pixel)=><span key={pixel}/>)}</a>)}</div><div className="signal-readout" role="status" aria-live="polite"><strong>{item.value}</strong><span>{item.label}</span></div><p>{credit}</p></div>
}
