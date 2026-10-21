'use client'
import { useRef, useState } from 'react'
import { MODULES } from '@/lib/site/content'
import SketchGlyph from './SketchGlyph'
const DESCRIPTIONS=['File → text → range','Passage → code → meaning','Trace the saved links','SVG + CSV + script','Record → chosen format']
export default function ModuleAtlas() {
 const [active,setActive]=useState<(typeof MODULES)[number]['key']>(MODULES[0].key)
 const description=useRef<HTMLElement>(null)
 const choose=(key:typeof active)=>{setActive(key);const box=description.current?.getBoundingClientRect();if(box&&box.bottom>innerHeight-24)description.current?.scrollIntoView({block:'nearest',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
 const selected=MODULES.find(step=>step.key===active)??MODULES[0]
 return <div className="module-atlas">
  <div className="atlas-heading"><span className="sec-no mono">01</span><h2 id="atlas-title">Workflow</h2><p>Five tools. Use only what your study needs.</p></div>
  <ol className="atlas-blocks">{MODULES.map((item,index)=><li key={item.key}><button type="button" className={`atlas-block atlas-block--${item.key} is-picked${active===item.key?' is-active':''}`} aria-label={`Show ${item.title}`} aria-pressed={active===item.key} aria-controls="atlas-description" onClick={()=>choose(item.key)}>
   <div className="atlas-engineering"><svg className="block-platform" viewBox="0 0 230 220" fill="none" aria-hidden="true"><path d="M17 147L112 111L214 145V177L116 211L17 177Z M17 147L116 182L214 145M116 182V211"/><path className="block-construction" d="M6 146H225M115 95V218M25 186L116 218L208 187"/><path className="block-socket" d="M44 157L61 151L78 157L61 163Z M145 157L162 151L179 157L162 163Z"/></svg><div className="atlas-floating"><SketchGlyph kind={item.key}/></div></div>
   <span className="atlas-caption"><span className="mono">{item.no}</span><strong>{item.title}</strong></span><span className="atlas-purpose">{DESCRIPTIONS[index]}</span>
  </button></li>)}</ol>
  <section ref={description} className="atlas-description" id="atlas-description" aria-live="polite" aria-atomic="true" aria-labelledby="atlas-description-title">
   <div><span className="mono">{selected.title.toUpperCase()}</span><h3 id="atlas-description-title">{selected.goal}</h3><p>{selected.see}</p></div>
  </section>
 </div>
}
