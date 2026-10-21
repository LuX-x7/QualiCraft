'use client'
import { useState } from 'react'
import { NOT_DOING } from '@/lib/site/content'
import SketchGlyph from './SketchGlyph'
const GLYPHS=['human','cloud','share','search']
export default function BoundarySketch() {
 const [active,setActive]=useState(0),selected=NOT_DOING.items[active]
 return <div className="boundary-sketch"><div className="boundary-heading"><span className="sec-no mono">04</span><h2 id="boundary-title">What QT does not do</h2><p>Four deliberate product choices keep the work researcher-led.</p></div><div className="boundary-drawings" role="group" aria-label="Explore QT product choices">{NOT_DOING.items.map((item,index)=><button type="button" className={`boundary-drawing${active===index?' is-active':''}`} key={item.name} aria-pressed={active===index} aria-controls="boundary-description" onClick={()=>setActive(index)}><SketchGlyph kind={GLYPHS[index]}/><span className="mono boundary-no">0{index+1}</span><strong>{item.name}</strong><span className="boundary-summary">{item.summary}</span></button>)}</div><section className="choice-description" id="boundary-description" aria-live="polite" aria-labelledby="boundary-description-title"><span className="mono">WHY</span><h3 id="boundary-description-title">{selected.name}</h3><p>{selected.reason}</p></section></div>
}
