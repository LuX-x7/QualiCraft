'use client'
import { useState } from 'react'
import SketchGlyph from './SketchGlyph'
import RelationshipSketch from './RelationshipSketch'
import type { CodingExample } from './CodingEvidence'

const EXPORTS=[{name:'Project',suffix:'.json',detail:'Documents, codebook, codings and audit trail. Restore as a new project.'},{name:'Codings',suffix:'.csv',detail:'Saved coding records with document, code path, exact quotation and character range.'},{name:'Matrix',suffix:'.csv',detail:'Documents by codes, with recorded coding counts.'},{name:'Methods',suffix:'.md',detail:'A reviewable record of saved notes, changes, AI use and counting rules.'}]
export default function SketchScene({kind,example}:{kind:string;example:CodingExample|null}) {
 const [part,setPart]=useState(0)
 if(!example)return <p role="status">The source illustration is unavailable. Open the verified example report.</p>
 if(kind==='coding'||kind==='analysis')return <><RelationshipSketch example={example} network={kind==='analysis'}/>{kind==='analysis'&&<a className="sketch-map-link" href="/w?lang=en">Explore the full relationship map in Insights ↗</a>}</>
 if(kind==='import')return <div className="import-sketch">
   <div className="import-journey"><button type="button" className={`sketch-object${part===0?' is-current':''}`} aria-pressed={part===0} onPointerEnter={()=>setPart(0)} onFocus={()=>setPart(0)} onClick={()=>setPart(0)}><SketchGlyph kind="import"/><span className="mono">01 / SOURCE FILE</span><strong>{example.document_name}</strong></button><span className="journey-arrow" aria-hidden="true">→</span><button type="button" className={`sketch-object sketch-document${part===1?' is-current':''}`} aria-pressed={part===1} onPointerEnter={()=>setPart(1)} onFocus={()=>setPart(1)} onClick={()=>setPart(1)}><span className="mono sketch-label">02 / READABLE DOCUMENT</span><span className="document-ruling" aria-hidden="true"><i/><i/><i/></span><span className="import-quote" lang="it">{example.quote}</span><span className="document-ruling" aria-hidden="true"><i/><i/></span></button></div>
   <p className="sketch-readout" role="status" aria-live="polite"><span className="mono">{part===0?'ORIGINAL FILE':'PRESERVED RANGE'}</span>{part===0?'Bring the source into your local project.':`${example.document_name} · Unicode [${example.start}, ${example.end})`}</p>
 </div>
 return <div className="export-sketch"><div className="export-package"><SketchGlyph kind="export"/><span className="mono">YOUR LOCAL RECORD</span></div><div className="export-files" role="group" aria-label="Explore export formats">{EXPORTS.map((format,index)=><button type="button" key={format.name} aria-pressed={part===index} className={`export-file${part===index?' is-current':''}`} onPointerEnter={()=>setPart(index)} onFocus={()=>setPart(index)} onClick={()=>setPart(index)}><span className="file-fold" aria-hidden="true"/><strong className="mono">{format.suffix}</strong><span>{format.name}</span></button>)}</div><p className="sketch-readout" role="status" aria-live="polite"><span className="mono">{EXPORTS[part].name.toUpperCase()}</span>{EXPORTS[part].detail}</p><p className="sketch-note mono">FORMAT GUIDE · DOWNLOAD YOUR FILES FROM THE WORKBENCH</p></div>
}
