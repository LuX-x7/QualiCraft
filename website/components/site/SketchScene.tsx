'use client'
import { useState } from 'react'
import SketchGlyph from './SketchGlyph'
import RelationshipSketch from './RelationshipSketch'
import CodingSketch from './CodingSketch'
import type { SavedCoding } from '@/lib/site/record-network'
import type { ChartTable } from '@/lib/report/chart-model'
import type { CodingExample } from './CodingEvidence'

const EXPORTS=[{name:'Project',suffix:'.json',detail:'Documents, codebook, codings and audit trail. Restore as a new project.'},{name:'Codings',suffix:'.csv',detail:'Saved coding records with document, code path, exact quotation and character range.'},{name:'Matrix',suffix:'.csv',detail:'Documents by codes, with recorded coding counts.'},{name:'Methods',suffix:'.md',detail:'A reviewable record of saved notes, changes, AI use and counting rules.'}]
function FileStructure({index}:{index:number}) {
 return <svg className="file-structure" viewBox="0 0 120 64" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
  {index===0?<><path d="M22 8H30V56H22M98 8H90V56H98M30 32H48M62 17V47M48 32H62M62 17H86M62 47H86"/><circle cx="49" cy="32" r="4"/><path d="M70 12V22M77 12V22M70 42V52M77 42V52"/></>
   :index===1?<><path d="M12 10H108V54H12Z M12 23H108M36 10V54M68 10V54M12 38H108"/><path className="format-trace" d="M17 31H30M43 31H61M73 31H102M17 46H30M43 46H61M73 46H102"/></>
   :index===2?<><path d="M25 9H105V55H25Z M25 23H105M25 39H105M45 9V55M65 9V55M85 9V55M12 16H18M12 31H18M12 47H18"/><path className="format-trace" d="M48 26H62V36H48Z M87 42H102V52H87Z"/></>
   :<><path d="M20 14H99M20 29H99M20 43H85M29 53H91"/><path className="format-trace" d="M10 11V18M7 14H14M10 26V33M7 29H14M10 40V47M7 43H14"/></>}
 </svg>
}
export default function SketchScene({kind,example,records=[],pairs,credit}:{kind:string;example:CodingExample|null;records?:SavedCoding[];pairs?:ChartTable;credit?:string}) {
 const [part,setPart]=useState(0)
 if(!example)return <p role="status">The source illustration is unavailable. Open the verified example report.</p>
 if(kind==='coding')return <CodingSketch example={example}/>
 if(kind==='analysis')return <RelationshipSketch records={records} initial={example} pairs={pairs} credit={credit}/>
 if(kind==='import')return <div className="import-sketch">
   <div className="import-journey"><button type="button" className={`sketch-object${part===0?' is-current':''}`} aria-pressed={part===0} onPointerEnter={()=>setPart(0)} onFocus={()=>setPart(0)} onClick={()=>setPart(0)}><SketchGlyph kind="import"/><span className="mono">01 / SOURCE FILE</span><strong>{example.document_name}</strong></button><span className="journey-arrow" aria-hidden="true">→</span><button type="button" className={`sketch-object sketch-document${part===1?' is-current':''}`} aria-pressed={part===1} onPointerEnter={()=>setPart(1)} onFocus={()=>setPart(1)} onClick={()=>setPart(1)}><span className="mono sketch-label">02 / READABLE DOCUMENT</span><span className="document-ruling" aria-hidden="true"><i/><i/><i/></span><span className="import-quote" lang="it">{example.quote}</span><span className="document-ruling" aria-hidden="true"><i/><i/></span></button></div>
   <button type="button" className={`import-range${part===2?' is-current':''}`} aria-pressed={part===2} onPointerEnter={()=>setPart(2)} onFocus={()=>setPart(2)} onClick={()=>setPart(2)}><span className="mono">03 / SOURCE COORDINATES</span><svg viewBox="0 0 620 48" fill="none" aria-hidden="true"><path className="range-baseline" d="M20 24H600M20 18V30M600 18V30M50 21V27M90 21V27M130 21V27M170 21V27M210 21V27M250 21V27M290 21V27M330 21V27M370 21V27M410 21V27M450 21V27M490 21V27M530 21V27M570 21V27"/><path className="range-selection" d="M20 10V38M20 10H30M20 38H30M600 10V38M590 10H600M590 38H600M31 24C180 22 440 26 589 24"/></svg><span><strong>{example.start}</strong><em>Exact words · original position</em><strong>{example.end}</strong></span></button>
   <p className="sketch-readout" role="status" aria-live="polite"><span className="mono">{part===0?'ORIGINAL FILE':part===1?'READABLE SOURCE':'PRESERVED RANGE'}</span>{part===0?'Bring the source into your local project.':part===1?'Keep the wording and its document identity together.':`${example.document_name} · Unicode [${example.start}, ${example.end})`}</p>
 </div>
 return <div className="export-sketch"><div className="export-package"><SketchGlyph kind="export"/><span className="mono">ONE RECORD → FOUR FILE STRUCTURES</span></div><div className="export-files" role="group" aria-label="Explore export formats">{EXPORTS.map((format,index)=><button type="button" key={format.name} aria-pressed={part===index} className={`export-file${part===index?' is-current':''}`} onPointerEnter={()=>setPart(index)} onFocus={()=>setPart(index)} onClick={()=>setPart(index)}><span className="file-fold" aria-hidden="true"/><strong className="mono">{format.suffix}</strong><FileStructure index={index}/><span>{format.name}</span></button>)}</div><p className="sketch-readout" role="status" aria-live="polite"><span className="mono">{EXPORTS[part].name.toUpperCase()}</span>{EXPORTS[part].detail}</p><p className="sketch-note mono">FORMAT GUIDE · DOWNLOAD YOUR FILES FROM THE WORKBENCH</p></div>
}
