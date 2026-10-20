'use client'
import {siteUrl} from '@/lib/site/url'

import { useState } from 'react'
import { MODULES } from '@/lib/site/content'
import SketchGlyph from './SketchGlyph'
const DESCRIPTIONS=['File → text → range','Passage → code → theme','Trace the saved links','SVG + CSV + script','Record → chosen format']
export default function ModuleAtlas() {
 const [route,setRoute]=useState(MODULES.map(step=>step.key))
 const toggle=(key:(typeof MODULES)[number]['key'])=>setRoute(current=>current.includes(key)?current.filter(item=>item!==key):[...current,key])
 return <div className="module-atlas">
  <div className="atlas-heading"><h2 id="atlas-title">Workflow</h2><p>A small core. Use the tools that help.</p></div>
  <ol className="atlas-blocks">{MODULES.map((item,index)=><li key={item.key}><button type="button" className={`atlas-block atlas-block--${item.key}${route.includes(item.key)?' is-picked':''}`} aria-label={`Include ${item.title} in the sketch`} aria-pressed={route.includes(item.key)} onClick={()=>toggle(item.key)}>
   <div className="atlas-engineering"><svg className="block-platform" viewBox="0 0 230 220" fill="none" aria-hidden="true"><path d="M17 147L112 111L214 145V177L116 211L17 177Z M17 147L116 182L214 145M116 182V211"/><path className="block-construction" d="M6 146H225M115 95V218M25 186L116 218L208 187"/><path className="block-socket" d="M44 157L61 151L78 157L61 163Z M145 157L162 151L179 157L162 163Z"/></svg><div className="atlas-floating"><SketchGlyph kind={item.key}/></div></div>
   <span className="atlas-caption"><span className="mono">{item.no}</span><strong>{item.title}</strong><span className="atlas-state" aria-hidden="true">{route.includes(item.key)?'−':'+'}</span></span><span className="atlas-purpose">{DESCRIPTIONS[index]}</span>
  </button><a className="atlas-preview-link" href={siteUrl(`#story-${item.key}`)}>Explore {item.title} ↘</a></li>)}</ol>
  <details className="atlas-options"><summary>What can I switch on or off in QT?</summary><p>You do not need every module. Use the tools that help your study.</p></details>
 </div>
}
