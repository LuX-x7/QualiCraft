'use client'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { buildTrail } from '@/lib/site/scroll-story'
import type { CodingExample } from './CodingEvidence'

export default function RelationshipSketch({example,network=false}:{example:CodingExample;network?:boolean}) {
 const trail=useMemo(()=>{try{return buildTrail(example)}catch{return null}},[example])
 const [part,setPart]=useState('code'),[wires,setWires]=useState('')
 const graph=useRef<HTMLDivElement>(null),arrow=useId().replaceAll(':','')
 useEffect(()=>{
  const root=graph.current;if(!root)return
  const nodes=Array.from(root.querySelectorAll<HTMLButtonElement>('.trail-node'))
  const update=()=>{const r=root.getBoundingClientRect();if(!r.width||!r.height)return;const boxes=nodes.map(n=>n.getBoundingClientRect());if(boxes.length!==4)return;const [source,code,parent,theme]=boxes
   const xy=(x:number,y:number)=>[x-r.left,y-r.top];const [sx,sy]=xy(source.right,source.top+source.height/2),[cx,cy]=xy(code.left,code.top+code.height/2),[cr,cry]=xy(code.right,code.top+code.height/2),[px,py]=xy(parent.left,parent.top+parent.height/2),[ptx,pty]=xy(parent.left+parent.width/2,parent.top),[tx,ty]=xy(theme.left+theme.width/2,theme.bottom)
   setWires(`M${sx} ${sy}C${(sx+cx)/2} ${sy} ${(sx+cx)/2} ${cy} ${cx} ${cy} M${cr} ${cry}C${(cr+px)/2} ${cry} ${(cr+px)/2} ${py} ${px} ${py} M${ptx} ${pty}L${tx} ${ty}`)
  };const observer=new ResizeObserver(update);observer.observe(root);nodes.forEach(node=>observer.observe(node));update();return()=>observer.disconnect()
 },[example])
 if(!trail)return <p role="status">The saved source path could not be verified. <a href="/report">Open the source report.</a></p>
 const ancestors=[...trail.ancestors].reverse()
 const description=part==='passage'?`${example.document_name} · Unicode [${example.start}, ${example.end})`:part==='code'?trail.code.name:ancestors.find(node=>node.id===part)?.name??trail.code.name
 const activate=(id:string)=>({onPointerEnter:()=>setPart(id),onFocus:()=>setPart(id),onClick:()=>setPart(id)})
 return <div className={`relationship-sketch${network?' relationship-sketch--network':''}`} data-source-coding={example.annotation_id}>
   <div className="relationship-legend"><span className="mono">SAVED RELATIONSHIP</span><strong>Highlighted passage <span>↔</span> Code <span>↔</span> Themes</strong></div>
   <div ref={graph} className="relationship-canvas" role="group" aria-label="Interactive graph connecting the highlighted passage, code and saved theme nodes">
     <svg className="relationship-wires" fill="none" aria-hidden="true"><defs><marker id={arrow} markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M1 1L8 4.5L1 8" fill="none" stroke="var(--accent)" strokeWidth="1"/></marker></defs><path className="sketch-wire" d={wires} markerEnd={`url(#${arrow})`} pathLength="1"/><path className="relationship-active-wire" d={wires}/></svg>
     <button type="button" className={`trail-node trail-passage${part==='passage'?' is-current':''}`} aria-pressed={part==='passage'} {...activate('passage')} data-source-id={trail.passage.id}><span className="sketch-label mono">01 / HIGHLIGHTED PASSAGE</span><span className="trail-quote" lang="it"><mark>{example.quote}</mark></span><span className="trail-document mono">{example.document_name}</span></button>
     <button type="button" className={`trail-node trail-code${part==='code'?' is-current':''}`} aria-pressed={part==='code'} {...activate('code')} data-source-id={trail.code.id}><span className="sketch-label mono">02 / CODE</span><strong>{trail.code.name}</strong><span className="trail-port" aria-hidden="true"/></button>
     {ancestors.map((node,index)=><button key={node.id} type="button" className={`trail-node trail-theme trail-theme-${index}${part===node.id?' is-current':''}`} aria-pressed={part===node.id} {...activate(node.id)} data-source-id={node.id}><span className="sketch-label mono">{index===0?'03 / PARENT THEME':'04 / ROOT THEME'}</span><strong>{node.name}</strong><span className="trail-port" aria-hidden="true"/></button>)}
   </div>
   <p className="sketch-readout" role="status" aria-live="polite"><span className="mono">{part==='passage'?'SOURCE RANGE':part==='code'?'SELECTED CODE':'SELECTED THEME'}</span>{description}</p>
   <details className="sketch-source"><summary>Inspect source IDs &amp; the complete saved path</summary><p>{example.code_path.map(node=>node.name).join(' › ')}</p><dl><dt>Coding ID</dt><dd>{example.annotation_id}</dd><dt>Code ID</dt><dd>{example.code_id}</dd><dt>Document ID</dt><dd>{example.document_id}</dd><dt>Document SHA-256</dt><dd>{example.document_sha256}</dd></dl><p>One saved coding, with every ancestor. <a href="/w?lang=en">Explore the full project map in Insights ↗</a></p></details>
 </div>
}
