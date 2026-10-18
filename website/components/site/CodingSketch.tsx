'use client'
import { useState } from 'react'
import type { CodingExample } from './CodingEvidence'

export default function CodingSketch({example}:{example:CodingExample}) {
 const [part,setPart]=useState(0),code=example.code_path.at(-1)!
 const [reading,setReading]=useState('unmarked'),[previous,setPrevious]=useState<string|null>(null)
 const mark=(value:string)=>{setPrevious(reading);setReading(value)}
 const activate=(index:number)=>({onMouseEnter:()=>setPart(index),onPointerMove:(event:React.PointerEvent)=>{if(event.pointerType==='mouse')setPart(index)},onFocus:()=>setPart(index),onClick:()=>setPart(index)})
 return <div className={`coding-sketch evidence-plate coding-part-${part}`} data-diagram="coding" data-source-coding={example.annotation_id}>
  <header className="record-drawing-heading"><span className="mono">02 / CODING · ONE SAVED ASSIGNMENT</span><strong>Choose the words.<br/><em>Attach the meaning.</em></strong></header>
  <div className="coding-workspace">
   <article className="coding-document" aria-label="Source document with highlighted passage">
    <div className="coding-document-head mono"><span>{example.document_name}</span><span>01 / SELECT</span></div>
    <div className="pencil-ruling" aria-hidden="true"><i/><i/><i/></div>
    <button type="button" className="coding-passage" aria-pressed={part===0} {...activate(0)} aria-label="Inspect highlighted original passage"><mark lang="it">{example.quote}</mark><svg className="coding-pencil" viewBox="0 0 50 50" fill="none" aria-hidden="true"><path d="M13 36L32 8L40 14L21 42L10 45Z M13 36L21 42M30 11L38 17M10 45L13 38"/></svg></button>
    <div className="coding-range-rule" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></div><p className="mono coding-coordinates">Unicode [{example.start}, {example.end})</p>
   </article>
   <div className="coding-decision"><span className="mono">02 / ATTACH A CODE</span><svg className="coding-attachment" viewBox="0 0 180 50" fill="none" aria-hidden="true"><path className="coding-line-base" d="M3 12C47 10 29 39 75 38H168M158 30L170 38L158 46"/><path className="coding-line-trace" pathLength="1" d="M3 12C47 10 29 39 75 38H168M158 30L170 38L158 46"/></svg>
    <button type="button" className="coding-code" aria-pressed={part===1} data-code-id={code.id} {...activate(1)}><span className="coding-code-dot" aria-hidden="true"/><span className="mono">CODE</span><strong>{code.name}</strong></button>
    <span className="mono coding-theme-heading">03 / KEEP ITS CODEBOOK POSITION</span><button className="coding-theme-path" type="button" aria-pressed={part===2} {...activate(2)}>{example.code_path.slice(0,-1).map((node,i)=><span key={node.id} data-theme-id={node.id}><span className="mono">{i?'PARENT CODE':'THEME / GROUP'}</span><strong>{node.name}</strong></span>)}</button>
   </div>
  </div>
  <p className="record-readout" role="status" aria-live="polite" aria-atomic="true"><span className="mono">{['ORIGINAL WORDS','SAVED CODE','CODEBOOK POSITION'][part]}</span><span>{part===0?`${example.document_name} · [${example.start}, ${example.end})`:part===1?code.name:example.code_path.map(n=>n.name).join(' › ')}</span></p>
  <div className="reading-guide" data-reading-guide={reading}>
   <div className="reading-guide-head"><span className="mono">READING ≠ CODING</span><div role="group" aria-label="Try manual reading marks in the illustration">
    <button type="button" aria-pressed={reading==='read'} onClick={()=>mark('read')}>Read</button>
    <button type="button" aria-pressed={reading==='revisit'} onClick={()=>mark('revisit')}>Revisit</button>
    <button type="button" disabled={previous===null} onClick={()=>{if(previous!==null)setReading(previous);setPrevious(null)}}>Undo</button>
   </div></div>
   <div className="reading-guide-tracks" aria-label={`Illustrative reading status: ${reading}; coding range is separate`}><span>Reading</span><div className={`guide-track guide-track--${reading}`}><i/></div><span>Coding</span><div className="guide-track guide-track--coding"><i/></div></div>
   <p role="status" aria-live="polite">{reading==='unmarked'?'Unmarked':reading==='read'?'Read':'Revisit'} · Reading marks are manual. Coding coverage stays separate.</p>
   <span className="mono">ILLUSTRATION ONLY · KEEP / RESUME IN THE WORKBENCH</span>
  </div>
  <details className="record-source"><summary>Source record &amp; IDs</summary><dl><dt>Coding ID</dt><dd>{example.annotation_id}</dd><dt>Code ID</dt><dd>{code.id}</dd><dt>Document SHA-256</dt><dd>{example.document_sha256}</dd></dl><p>Existing Bologna coding · CC0. An explanatory drawing; no project changes are made.</p></details>
 </div>
}
