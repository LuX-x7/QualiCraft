'use client'
import {siteUrl} from '@/lib/site/url'
import {useMemo,useRef,useState,type KeyboardEvent} from 'react'
import {savedNodeKind,savedNodeId,type SavedCoding,type RecordNode} from '@/lib/site/record-network'

const roleName=(kind:RecordNode['kind'])=>kind==='passage'?'Passage':kind==='group'?'Group':kind[0].toUpperCase()+kind.slice(1)

export default function SavedPathSketch({records,initial}:{records:SavedCoding[];initial:SavedCoding}) {
 const choices=useMemo(()=>[...new Map([initial,...records].map(record=>[record.annotation_id,record])).values()],[records,initial])
 const [annotation,setAnnotation]=useState(initial.annotation_id),[selected,setSelected]=useState(initial.code_id)
 const refs=useRef<Array<HTMLButtonElement|null>>([])
 const active=choices.find(record=>record.annotation_id===annotation)??choices[0],choice=choices.indexOf(active)
 if(!active)return <p role="status">Saved evidence is unavailable. <a href={siteUrl('/report')}>Read the verified report.</a></p>
 const selectSource=(index:number)=>{const record=choices[(index+choices.length)%choices.length];setAnnotation(record.annotation_id);setSelected(record.code_id)}
 const keyboard=(event:KeyboardEvent,index:number)=>{
  if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return
  event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?active.code_path.length-1:Math.max(0,Math.min(active.code_path.length-1,index+(event.key==='ArrowDown'?1:-1)))
  setSelected(active.code_path[next].id);refs.current[next]?.focus({preventScroll:true})
 }
 return <div className="analysis-path evidence-plate evidence-study" data-diagram="analysis-path">
  <div className="evidence-study-head"><span className="mono">ONE PASSAGE / ITS CODEBOOK PATH</span><div className="evidence-source-paging"><button type="button" onClick={()=>selectSource(choice-1)} aria-label="Previous saved passage">←</button><span className="mono">{choice+1} / {choices.length}</span><button type="button" onClick={()=>selectSource(choice+1)} aria-label="Next saved passage">→</button></div></div>
  <div className="evidence-study-body">
   <article className="evidence-source-sheet">
    <span className="mono evidence-document-name">{active.document_name}</span>
    <div className="evidence-context-lines" aria-hidden="true"><i/><i/></div>
    <button type="button" className="evidence-source-quote" data-path-node={`passage:${active.annotation_id}`} data-source-id={active.annotation_id} aria-pressed={selected===active.code_id} onMouseEnter={()=>setSelected(active.code_id)} onFocus={()=>setSelected(active.code_id)} onClick={()=>setSelected(active.code_id)} aria-label="Trace this highlighted passage to its saved code"><mark>{active.quote}</mark></button>
    <div className="evidence-context-lines" aria-hidden="true"><i/><i/><i/></div>
    <span className="mono evidence-source-range">[{active.start}, {active.end}) · exact saved range</span>
   </article>
   <div className="evidence-path-bridge" aria-hidden="true"><span/>→<span/></div>
   <div className="evidence-codebook"><span className="mono evidence-codebook-label">CODEBOOK</span>
    <ol className="evidence-tree">{active.code_path.map((node,index)=>{const leaf=index===active.code_path.length-1,kind=savedNodeKind(node,leaf);return <li key={node.id} style={{marginLeft:`${index*16}px`}}><button type="button" ref={el=>{refs.current[index]=el}} className={`evidence-tree-node evidence-tree-node--${kind}`} data-path-node={savedNodeId(node,leaf)} data-source-id={node.id} aria-pressed={selected===node.id} onMouseEnter={()=>setSelected(node.id)} onFocus={()=>setSelected(node.id)} onClick={()=>setSelected(node.id)} onKeyDown={event=>keyboard(event,index)}><span className="mono">{roleName(kind)}</span><strong>{node.name}</strong></button></li>})}</ol>
   </div>
  </div>
  <p className="evidence-study-selection sr-only" role="status" aria-live="polite" data-selected-annotation={active.annotation_id}><span className="mono">SELECTED</span> {active.code_path.find(node=>node.id===selected)?.name??active.code_path.at(-1)?.name}</p>
  <details className="record-source"><summary>Choose a source &amp; inspect research roles</summary><label className="evidence-study-picker mono">Choose a passage<select aria-label="Path source example" value={active.annotation_id} onChange={event=>{const next=choices.findIndex(record=>record.annotation_id===event.target.value);selectSource(next)}}>{choices.map((record,index)=><option key={record.annotation_id} value={record.annotation_id}>{String(index+1).padStart(2,'0')} · {record.document_name} · {record.code_path.at(-1)?.name}</option>)}</select></label><p>Theme, Category and Code are researcher-assigned roles. “Group” means this original Bologna node has no assigned role. TA does not require a Category layer; Comparative QCA uses its separate case-and-set workflow.</p><dl><dt>Coding ID</dt><dd>{active.annotation_id}</dd><dt>Code ID</dt><dd>{active.code_id}</dd><dt>Document SHA-256</dt><dd>{active.document_sha256}</dd></dl><a href={siteUrl('/report')}>Original Bologna results &amp; source records ↗</a></details>
 </div>
}
