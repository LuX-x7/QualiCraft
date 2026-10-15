'use client'
import { useState } from 'react'
import DataPlot from '@/components/report/DataPlot'
import type { ChartTable } from '@/lib/report/chart-model'
import type { WorkflowData } from './WorkflowIllustration'

export default function PlotSketch({data,charts}:{data:WorkflowData;charts:Record<string,ChartTable>}) {
 const [kind,setKind]=useState('frequency')
 const [selected,setSelected]=useState<Record<string,number|undefined>>({frequency:0})
 const figure=data.figures.find(item=>item.kind===kind),table=charts[kind]
 if(!figure||!table)return <p role="status">Verified plot data is unavailable. <a href="/report">Open the original report.</a></p>
 return <div className="story-plot"><div className="story-plot-types" role="group" aria-label="Choose a plot">{data.figures.map(item=><button key={item.kind} type="button" aria-pressed={kind===item.kind} onClick={()=>setKind(item.kind)}>{item.kind==='coverage'?'Coverage':item.kind==='cooccurrence'?'Co-occurrence':item.kind==='accumulation'?'Accumulation':item.kind==='hierarchy'?'Hierarchy':'Frequency'}</button>)}</div>
   <DataPlot key={kind} kind={kind} label={figure.label} table={table} selected={selected[kind]} onSelect={row=>setSelected(prev=>({...prev,[kind]:row}))} onLocate={()=>window.location.assign(`/report#table-${kind}`)} keyboardHint="Arrow keys to explore · Enter for full report counts · Escape to clear"/>
   <details className="story-plot-selector"><summary>Choose a value by name</summary><label className="mono">CSV row<select aria-label="Plot value" value={selected[kind]??''} onChange={event=>setSelected(prev=>({...prev,[kind]:event.target.value===''?undefined:Number(event.target.value)}))}><option value="">Choose an item</option>{table.rows.map((row,index)=><option key={index} value={index}>{kind==='frequency'?row[0]:`${row[0]} · ${row[1]}`}</option>)}</select></label></details>
   <p className="story-plot-credit">{figure.credit}</p>
   <div className="story-plot-links mono"><a href={`/report#sec-${kind}`}>Explore the report ↗</a><a href={`/report/${figure.csv}`} download>CSV ↓</a><a href={`/report/${figure.svg}`} download>Original SVG ↓</a></div>
 </div>
}
