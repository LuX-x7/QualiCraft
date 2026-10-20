'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import type { CodingExample } from './CodingEvidence'

const OUTPUTS = [
  { name: 'Coded notebook', type: 'HTML / EDITABLE WORD', detail: 'Full source, exact highlights and saved code paths. Explicit Theme, Category and Code roles appear when you assign them.' },
  { name: 'Research report', type: 'HTML / EDITABLE WORD / ZIP', detail: 'Your selected method and process map, Analysis Table, Narrative Analysis and selected evidence. Save, compare and restore versions.' },
  { name: 'Figures & code', type: 'SVG / PDF / PNG / CSV / PYTHON', detail: 'Five figure types with their original counts, parameters and reproducible code. The report bundle keeps selected figures and a bound QCA run when present.' },
  { name: 'Project & restore', type: 'PROJECT JSON', detail: 'Source text, codebook, reading marks, QCA calibration, frozen runs and saved report versions. Restore as a separate project.' },
] as const

export default function OutputSketch({ example }: { example: CodingExample }) {
  const [active, setActive] = useState(0), [linked, setLinked] = useState(false)
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const keyboard = (event: KeyboardEvent, index: number) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : Math.max(0, Math.min(3, index + (event.key === 'ArrowRight' ? 1 : -1)))
    setActive(next); refs.current[next]?.focus({ preventScroll: true })
  }
  return <div className="output-overview engineering-plate" data-output={active}>
    <p className="engineering-caption mono">YOUR SOURCE → YOUR WRITING → A REPRODUCIBLE RECORD</p>
    <div className="output-choices" role="group" aria-label="Explore final research outputs">{OUTPUTS.map((item, index) => <button key={item.name}
      type="button" ref={el => { refs.current[index] = el }} aria-pressed={active === index}
      onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} onKeyDown={event => keyboard(event, index)}>
      <span className="mono">0{index + 1}</span>{item.name}</button>)}</div>
    <div className="output-preview">
      {active === 0 ? <div className={`output-notebook${linked ? ' is-linked' : ''}`}>
        <article><span className="mono">SOURCE / {example.document_name}</span>
          <div className="notebook-context" aria-hidden="true"><i/><i/></div>
          <button className="output-quote" type="button" aria-label="Trace this saved quotation to its code path" aria-pressed={linked}
            onMouseEnter={() => setLinked(true)} onMouseLeave={() => setLinked(false)} onFocus={() => setLinked(true)} onBlur={() => setLinked(false)} onClick={() => setLinked(current => !current)}>
            <mark lang="en">{example.quote}</mark></button>
          <div className="notebook-context" aria-hidden="true"><i/><i/></div>
          <span className="mono">Unicode [{example.start}, {example.end})</span></article>
        <div className="output-tree"><span className="mono">SAVED CODE PATH</span><ol>{example.code_path.map((node, index) => <li key={node.id} style={{ marginLeft: `${index * 14}px` }} data-source-node={node.id}>
          <span className="mono">{index === example.code_path.length - 1 ? 'CODE' : 'GROUP · ROLE UNASSIGNED'}</span><strong>{node.name}</strong></li>)}</ol></div>
      </div> : active === 1 ? <div className="output-report">
        <div className="report-page-sketch"><span className="mono">RESEARCH REPORT</span><h3>Method &amp; decisions</h3>
          <div className="report-map-sketch" aria-label="Selected method process map"><i/><span>→</span><i/><span>→</span><i/></div>
          <h3>Analysis Table</h3><div className="report-lines" aria-hidden="true"><i/><i/></div>
          <h3>Narrative Analysis</h3><div className="report-lines" aria-hidden="true"><i/><i/></div>
          <span className="mono">FIGURES / EVIDENCE / LIMITATIONS</span></div>
        <div className="output-margin"><span className="mono">SAVED TOGETHER</span><p>Chosen method<br/>Process map M1<br/>Frozen evidence<br/>Editable writing</p></div>
      </div> : active === 2 ? <div className="output-reproduction">
        <svg viewBox="0 0 420 170" fill="none" aria-hidden="true"><g className="procedure-lines"><path d="M15 15v130h130M30 115h35V75H30zm48 0h35V40H78zM177 30h82v110h-82zM177 57h82m-82 27h82m-82 27h82M204 30v110m27-110v110M310 30l-20 30 20 30m50-60 20 30-20 30m-18-68-18 78M15 157h365"/></g><path className="procedure-trace" pathLength="1" d="M147 89h25m91 0h24"/></svg>
        <div className="output-file-labels mono"><span>ORIGINAL FIGURE</span><span>EXACT COUNT CSV</span><span>PYTHON SCRIPT</span></div>
        <p>Frequency · coverage · co-occurrence · hierarchy · accumulation</p>
      </div> : <div className="output-restore">
        <svg viewBox="0 0 400 140" fill="none" aria-hidden="true"><g className="procedure-lines"><path d="M28 18h100v103H28zM44 39h67m-67 21h67m-67 21h44M142 69h96m-13-10 13 10-13 10M257 18h115v103H257zM272 40h85m-85 22h85m-85 22h52M290 18V7h64v11"/></g><path className="procedure-trace" pathLength="1" d="M141 69h96"/></svg>
        <div className="output-file-labels mono"><span>PROJECT JSON</span><span>NEW PROJECT / RETAINED VERSIONS</span></div><p>Keep the current project. Continue from a separate restored copy.</p>
      </div>}
    </div>
    <div className="procedure-readout" role="status" aria-live="polite" aria-atomic="true"><span className="mono">{OUTPUTS[active].type}</span><h3>{OUTPUTS[active].name}</h3><p>{OUTPUTS[active].detail}</p></div>
    <p className="sketch-note mono">OUTPUT GUIDE · WORD EDITS STAY IN WORD</p>
  </div>
}
