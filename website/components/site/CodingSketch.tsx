'use client'
import { useState } from 'react'
import type { CodingExample } from './CodingEvidence'

export default function CodingSketch({example}:{example:CodingExample}) {
 const [part,setPart]=useState(0),code=example.code_path.at(-1)!
 const activate=(index:number)=>({onMouseEnter:()=>setPart(index),onPointerMove:(e:React.PointerEvent)=>{if(e.pointerType==='mouse')setPart(index)},onFocus:()=>setPart(index),onClick:()=>setPart(index)})
 return <div className={`coding-sketch coding-part-${part}`} data-diagram="coding" data-source-coding={example.annotation_id}>
  <header className="record-drawing-heading"><span className="mono">ONE SAVED CODING</span><strong>Keep the words. Attach the meaning.</strong></header>
  <div className="coding-workspace">
   <article className="coding-document" aria-label="Source document with highlighted passage"><div className="coding-document-head mono"><span>{example.document_name}</span><span>01 / SELECT</span></div><div className="pencil-ruling" aria-hidden="true"><i/><i/><i/></div>
    <button type="button" className="coding-passage" aria-pressed={part===0} {...activate(0)} aria-label="Inspect highlighted original passage"><mark lang="it">{example.quote}</mark><svg className="coding-pencil" viewBox="0 0 50 50" fill="none" aria-hidden="true"><path d="M13 36L32 8L40 14L21 42L10 45Z M13 36L21 42M30 11L38 17M10 45L13 38"/></svg></button>
    <div className="pencil-ruling" aria-hidden="true"><i/><i/></div><p className="mono coding-coordinates">Unicode [{example.start}, {example.end})</p>
   </article>
   <div className="coding-decision"><span className="mono">02 / ATTACH A CODE</span><svg className="coding-attachment" viewBox="0 0 180 50" fill="none" aria-hidden="true"><path className="coding-line-base" d="M3 12C47 10 29 39 75 38H168M158 30L170 38L158 46"/><path className="coding-line-trace" pathLength="1" d="M3 12C47 10 29 39 75 38H168M158 30L170 38L158 46"/></svg><button type="button" className="coding-code" aria-pressed={part===1} data-code-id={code.id} {...activate(1)}><span className="coding-code-dot" aria-hidden="true"/><strong>{code.name}</strong><span className="mono">SAVED CODE</span></button><span className="mono coding-theme-heading">03 / LOCATE IN THE CODEBOOK</span><button className="coding-theme-path" type="button" aria-pressed={part===2} {...activate(2)}>{example.code_path.slice(0,-1).map((node,i)=><span key={node.id} data-theme-id={node.id}><span className="mono">{i?'PARENT THEME':'ROOT THEME'}</span><strong>{node.name}</strong></span>)}</button></div>
  </div>
  <p className="record-readout" role="status" aria-live="polite"><span className="mono">{['ORIGINAL WORDS','STABLE CODE ID','SAVED THEME PATH'][part]}</span>{part===0?`${example.document_name} · [${example.start}, ${example.end})`:part===1?code.name:example.code_path.map(n=>n.name).join(' › ')}</p>
  <details className="record-source"><summary>Inspect this saved record</summary><dl><dt>Coding ID</dt><dd>{example.annotation_id}</dd><dt>Code ID</dt><dd>{code.id}</dd><dt>Document SHA-256</dt><dd>{example.document_sha256}</dd></dl><p>Existing Bologna coding. This illustration does not change the project.</p></details>
 </div>
}
