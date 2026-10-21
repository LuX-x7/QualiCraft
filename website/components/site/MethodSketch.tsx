
'use client'
import { useState } from 'react'
import SketchGlyph from './SketchGlyph'
import MethodProcess from './MethodProcess'

const METHODS = [
 {key:'ta', acronym:'TA', name:'Thematic Analysis', note:'PASSAGES → CODES → THEMES', glyph:'thematic', description:'Develop and revisit themes through interpretation and writing. QT keeps each saved link and memo visible; the interpretation remains yours.'},
 {key:'comparative', acronym:'QCA', name:'Qualitative Comparative Analysis', note:'CASES → SETS → CONFIGURATIONS', glyph:'comparative', description:'Calibrate conditions and an outcome, inspect the truth table, and export a frozen result with reproducible code.'},
 {key:'content', acronym:'CA', name:'Qualitative Content Analysis', note:'PASSAGES → CATEGORIES → COUNTS', glyph:'content', description:'Build categories from coded passages, then inspect descriptive counts and the document-by-code matrix in context.'},
] as const

export default function MethodSketch() {
 const [active,setActive]=useState<(typeof METHODS)[number]['key']>('ta')
 const selected=METHODS.find(item=>item.key===active)??METHODS[0]
 return <div className="method-sketch"><header><span className="sec-no mono">03</span><h2 id="method-title">Choose a method</h2><p>TA, QCA or qualitative content analysis.</p></header><div className="method-paths" role="group" aria-label="Choose a research method">
  {METHODS.map(item=><button type="button" key={item.key} className={`method-path${active===item.key?' is-active':''}`} aria-pressed={active===item.key} aria-controls="method-description" onClick={()=>setActive(item.key)}><div className="method-drawing">{item.glyph==='comparative'?<svg viewBox="0 0 240 120" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.5"><path d="M18 24h36v22H18zM18 55h36v22H18zM18 86h36v22H18zM64 65h24m-7-6 7 6-7 6M100 24h54v78h-54zM100 50h54M100 76h54M127 24v78M164 65h24m-7-6 7 6-7 6M196 37h25v23h-25zM196 75h25v23h-25zM209 60v15"/></g><g fill="currentColor"><circle cx="113" cy="37" r="3"/><circle cx="140" cy="63" r="3"/><circle cx="113" cy="89" r="3"/></g></svg>:<SketchGlyph kind={item.glyph}/>}<span className="method-handnote mono">{item.note}</span></div><strong className="method-acronym">{item.acronym}</strong><span>{item.name}</span></button>)}
 </div><section className="choice-description method-description" id="method-description" aria-live="polite" aria-labelledby="method-description-title"><span className="mono">{selected.acronym}</span><h3 id="method-description-title">{selected.name}</h3><p>{selected.description}</p><details className="method-process-details"><summary>Read the method steps</summary><MethodProcess method={selected.key}/></details></section></div>
}
