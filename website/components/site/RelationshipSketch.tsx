'use client'
import { useMemo, useState } from 'react'
import { buildTrail } from '@/lib/site/scroll-story'
import type { CodingExample } from './CodingEvidence'

export default function RelationshipSketch({example,network=false}:{example:CodingExample;network?:boolean}) {
 const trail=useMemo(()=>{try{return buildTrail(example)}catch{return null}},[example])
 const [part,setPart]=useState('code')
 if(!trail)return <p role="status">The saved source path could not be verified. Open the report’s source record.</p>
 const description=part==='passage'?`${example.document_name} · Unicode [${example.start}, ${example.end})`
  : part==='code'?trail.code.name:trail.ancestors.map(node=>node.name).join(' › ')
 return <div className={`relationship-sketch${network?' relationship-sketch--network':''}`} data-source-coding={example.annotation_id}>
   <div className="relationship-canvas">
     <svg className="relationship-wires" viewBox="0 0 600 320" preserveAspectRatio="none" fill="none" aria-hidden="true"><path className="sketch-wire wire-source" d="M300 133V155H142V180" pathLength="1"/><path className="sketch-wire wire-theme" d="M282 237H319" pathLength="1"/><path d="M138 173L142 180L146 173M312 233L319 237L312 241"/><circle cx="300" cy="155" r="3"/></svg>
     <button type="button" className={`trail-node trail-passage${part==='passage'?' is-current':''}`} aria-pressed={part==='passage'} onPointerEnter={()=>setPart('passage')} onFocus={()=>setPart('passage')} onClick={()=>setPart('passage')} data-source-id={trail.passage.id}>
       <span className="sketch-label mono">HIGHLIGHTED PASSAGE / {example.document_name}</span><span className="trail-quote" lang="it"><mark>{example.quote}</mark></span>
     </button>
     <button type="button" className={`trail-node trail-code${part==='code'?' is-current':''}`} aria-pressed={part==='code'} onPointerEnter={()=>setPart('code')} onFocus={()=>setPart('code')} onClick={()=>setPart('code')} data-source-id={trail.code.id}><span className="sketch-label mono">CODE</span><strong>{trail.code.name}</strong></button>
     <button type="button" className={`trail-node trail-theme${part==='theme'?' is-current':''}`} aria-pressed={part==='theme'} onPointerEnter={()=>setPart('theme')} onFocus={()=>setPart('theme')} onClick={()=>setPart('theme')}><span className="sketch-label mono">THEME PATH</span><span className="trail-ancestors">{trail.ancestors.map(node=><span key={node.id} data-source-id={node.id}>{node.name}</span>)}</span></button>
   </div>
   <p className="sketch-readout" role="status" aria-live="polite"><span className="mono">{part.toUpperCase()}</span>{description}</p>
   <details className="sketch-source"><summary>Check the saved relationship</summary><p className="mono">{example.code_path.map(node=>node.name).join(' › ')}</p><dl><dt>Coding ID</dt><dd>{example.annotation_id}</dd><dt>Code ID</dt><dd>{example.code_id}</dd><dt>Document ID</dt><dd>{example.document_id}</dd><dt>Document SHA-256</dt><dd>{example.document_sha256}</dd></dl><p>This illustrates one saved coding. Open Insights → Relationship map in the workbench to explore the complete project.</p><a href="/w?lang=en">Open the workbench ↗</a></details>
 </div>
}
