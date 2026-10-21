'use client'
import { useRef, useState, type KeyboardEvent } from 'react'
import SketchGlyph from './SketchGlyph'
import SavedPathSketch from './SavedPathSketch'
import { networkExamples } from '@/lib/site/record-network'
import { EXPORT_FORMATS } from '@/lib/site/export-formats'
import CodingSketch from './CodingSketch'
import OutputSketch from './OutputSketch'
import type { SavedCoding } from '@/lib/site/record-network'
import type { CodingExample } from './CodingEvidence'

function FileStructure({index}:{index:number}) {
 return <svg className="file-structure" viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
  {index===0?<><path d="M22 8H30V56H22M98 8H90V56H98M30 32H48M62 17V47M48 32H62M62 17H86M62 47H86"/><circle cx="49" cy="32" r="4"/><path d="M70 12V22M77 12V22M70 42V52M77 42V52"/></>
   :index===1?<><path d="M12 10H108V54H12Z M12 23H108M36 10V54M68 10V54M12 38H108"/><path className="format-trace" d="M17 31H30M43 31H61M73 31H102M17 46H30M43 46H61M73 46H102"/></>
   :index===2?<><path d="M25 9H105V55H25Z M25 23H105M25 39H105M45 9V55M65 9V55M85 9V55M12 16H18M12 31H18M12 47H18"/><path className="format-trace" d="M48 26H62V36H48Z M87 42H102V52H87Z"/></>
   :index===3?<><path d="M20 14H99M20 29H99M20 43H85M29 53H91"/><path className="format-trace" d="M10 11V18M7 14H14M10 26V33M7 29H14M10 40V47M7 43H14"/></>
   :<><path d="M7 7H69V57H7Z M15 16H61M15 25H57M15 34H61M15 43H60M15 50H48M83 12V49M83 18H104M83 33H104M83 48H104"/><path className="format-trace" d="M14 28H59V38H14Z M69 33H83"/><circle cx="106" cy="18" r="3"/><circle cx="106" cy="33" r="3"/><circle cx="106" cy="48" r="3"/></>}
 </svg>
}
export default function SketchScene({kind,example,records=[]}:{kind:string;example:CodingExample|null;records?:SavedCoding[]}) {
 const [part,setPart]=useState(0),refs=useRef<Array<HTMLButtonElement|null>>([])
 const keyboard=(event:KeyboardEvent,index:number,count:number)=>{
  if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(event.key))return
  event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?count-1:Math.max(0,Math.min(count-1,index+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)))
  setPart(next);refs.current[next]?.focus({preventScroll:true})
 }
 const activate=(index:number,count:number)=>({ref:(el:HTMLButtonElement|null)=>{refs.current[index]=el},onMouseEnter:()=>setPart(index),onPointerMove:(event:React.PointerEvent)=>{if(event.pointerType==='mouse')setPart(index)},onFocus:()=>setPart(index),onClick:()=>setPart(index),onKeyDown:(event:KeyboardEvent)=>keyboard(event,index,count)})
 if(!example)return <p role="status">The source illustration is unavailable. Open the verified example report.</p>
 if(kind==='coding')return <CodingSketch example={example} records={records}/>
 if(kind==='analysis')return <SavedPathSketch records={networkExamples(records,example)} initial={example}/>
 if(kind==='import')return <div className="import-sketch engineering-plate" data-flow-active={part}>
   <p className="engineering-caption mono">FILE → TEXT RECORD → SOURCE RANGE</p>
   <p className="import-queue-guide mono">BATCH QUEUE → DUPLICATE CHOICE → SAVE / RETRY</p>
   <div className="import-journey">
    <button type="button" data-flow-step="file" className={`sketch-object${part===0?' is-current':''}`} aria-pressed={part===0} {...activate(0,3)}><span className="mono">01 / SOURCE</span><SketchGlyph kind="import"/><strong>{example.document_name}</strong><span className="engineering-note">Keep the document identity.</span></button>
    <span className="journey-arrow" aria-hidden="true">→</span>
    <button type="button" data-flow-step="record" className={`sketch-object sketch-document${part===1?' is-current':''}`} aria-pressed={part===1} {...activate(1,3)}><span className="mono">02 / TEXT RECORD</span>
     <svg data-import-record="true" className="import-record" viewBox="0 0 280 124" fill="none" aria-hidden="true"><path className="engineering-outline" d="M3 3L275 5L277 120L4 122Z M5 41H276M5 81H276M114 4V120"/><g className="engineering-field"><text x="16" y="28">document_id</text><text x="16" y="68">text</text><text x="16" y="108">sha256</text></g><g className="engineering-value"><text x="124" y="28">{example.document_id.slice(0,12)}…</text><path d="M124 57H260M124 67H244M124 77H254"/><text x="124" y="108">{example.document_sha256.slice(0,12)}…</text></g></svg>
     <span className="import-quote" lang="en">{example.quote}</span>
    </button>
   </div>
   <button type="button" data-flow-step="range" className={`import-range${part===2?' is-current':''}`} aria-pressed={part===2} {...activate(2,3)}><span className="mono">03 / EXACT COORDINATES</span><svg viewBox="0 0 620 48" fill="none" aria-hidden="true"><path className="range-baseline" d="M20 24H600M20 18V30M600 18V30M50 21V27M90 21V27M130 21V27M170 21V27M210 21V27M250 21V27M290 21V27M330 21V27M370 21V27M410 21V27M450 21V27M490 21V27M530 21V27M570 21V27"/><path className="range-selection" d="M20 10V38M20 10H30M20 38H30M600 10V38M590 10H600M590 38H600M31 24C180 22 440 26 589 24"/></svg><span><strong>{example.start}</strong><em>Unicode [start, end)</em><strong>{example.end}</strong></span></button>
   <p className="sketch-readout" role="status" aria-live="polite"><span className="mono">{part===0?'ORIGINAL FILE':part===1?'READABLE SOURCE':'PRESERVED RANGE'}</span>{part===0?example.document_name:part===1?'Original words, stable document identity.':`Unicode [${example.start}, ${example.end})`}</p>
   <details className="engineering-source"><summary>Source excerpt &amp; identity</summary><blockquote lang="en">{example.quote}</blockquote><dl><dt>Document ID</dt><dd>{example.document_id}</dd><dt>Document SHA-256</dt><dd>{example.document_sha256}</dd></dl><p>Bologna CC0 · explanatory structure from a saved record.</p></details>
 </div>
 return <><OutputSketch example={example}/><details className="legacy-export-guide"><summary>All original export formats</summary><div className="export-sketch engineering-plate" data-flow-active={part}>
  <p className="engineering-caption mono">CODING EVIDENCE → YOUR RESEARCH REPORT</p>
  <div className="export-board">
   <div className="export-package"><SketchGlyph kind="export"/><div data-export-record="true" className="export-record"><span className="mono">PROJECT RECORD</span><svg viewBox="0 0 190 132" fill="none" aria-hidden="true"><path className="engineering-outline" d="M8 7L180 4L183 125L6 127Z M22 28V106M22 38H44M22 70H44M22 102H44"/><g className="engineering-field"><text x="51" y="43">documents</text><text x="51" y="75">codes</text><text x="51" y="107">annotations</text></g><circle className="engineering-joint" cx="22" cy="70" r="3"/></svg></div></div>
   <svg className="export-wiring" viewBox="0 0 600 320" preserveAspectRatio="none" fill="none" aria-hidden="true"><path d="M140 160H188V78H575M188 160V244H575M235 78V92M405 78V92M575 78V92M235 244V258M405 244V258M575 244V258"/><circle cx="188" cy="160" r="4"/><path className="engineering-trace" pathLength="1" d="M140 160H188V78H575M188 160V244H575"/></svg>
   <div className="export-files" role="group" aria-label="Explore export formats">{EXPORT_FORMATS.map((format,index)=><button type="button" key={format.name} aria-label={format.label} aria-pressed={part===index} className={`export-file${part===index?' is-current':''}`} {...activate(index,EXPORT_FORMATS.length)}><span className="file-fold" aria-hidden="true"/><strong className="mono">{format.suffix}</strong><FileStructure index={index}/><span>{format.name}</span><span className="export-fields mono">{format.fields}</span></button>)}</div>
  </div>
  <p className="sketch-readout" role="status" aria-live="polite"><span className="mono">{EXPORT_FORMATS[part].name.toUpperCase()}</span>{EXPORT_FORMATS[part].detail}</p><p className="sketch-note mono">FORMAT GUIDE · DOWNLOAD YOUR FILES FROM THE WORKBENCH</p>
 </div></details></>
}
