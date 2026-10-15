'use client'

import { useRef, useState } from 'react'
import type { CodingExample } from './CodingEvidence'
import type { ManifestFigure } from '@/lib/report/read'

export type WorkflowData = {
  frequency: { label: string; count: string }[]
  frequencyCredit: string
  frequencyCsv: string
  figures: ManifestFigure[]
}
const FORMATS = [
  { label: 'Project JSON', suffix: '.json', title: 'A portable project',
    items: ['Source documents', 'Codebook and codings', 'Suggestions and audit trail'], note: 'Restore this file as a new project to continue the work. It includes the source text.' },
  { label: 'Codings CSV', suffix: '.csv', title: 'A row for each saved coding',
    items: ['Document and code path', 'Start, end and exact quotation', 'Memo and recorded source'], note: 'Inspect coding records in another tool. The separate matrix export places documents against codes.' },
  { label: 'Matrix CSV', suffix: '.csv', title: 'A document × code table',
    items: ['One document per row', 'One code per column', 'Recorded coding counts in each cell'], note: 'Inspect the full document-by-code matrix in another tool. It is a separate CSV from the coding records.' },
  { label: 'Methods Markdown', suffix: '.md', title: 'A record for review',
    items: ['Saved notes and codebook changes', 'Recorded AI use and review', 'Counting rules and limitations'], note: 'Review this record against your actual research process. It does not infer when notes were written.' },
]

export default function WorkflowIllustration({ kind, example, data }: {
  kind: string; example: CodingExample | null; data: WorkflowData
}) {
  const [selected, setSelected] = useState(0)
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const labels = kind === 'import' ? ['File', 'Original text', 'Source range']
    : kind === 'analysis' ? data.frequency.map(row => row.label)
      : kind === 'plotting' ? data.figures.map(f => f.label) : FORMATS.map(f => f.label)
  const choose = (index: number, focus = false) => {
    const next = Math.max(0, Math.min(labels.length - 1, index)); setSelected(next)
    if (focus) refs.current[next]?.focus({ preventScroll: true })
  }
  const keyboard = (event: React.KeyboardEvent, index: number) => {
    if (['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End','Escape'].includes(event.key)) {
      event.preventDefault()
      choose(event.key === 'Home' || event.key === 'Escape' ? 0 : event.key === 'End' ? labels.length - 1
        : index + (event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1), true)
    }
  }
  if (!example || !labels.length) return <p role="status">This illustration is unavailable until its source export can be verified.</p>
  const format = FORMATS[selected] ?? FORMATS[0]
  const figure = data.figures[selected] ?? data.figures[0]
  const row = data.frequency[selected] ?? data.frequency[0]
  return <div className={`workflow-illustration workflow-illustration--${kind}`}>
    <p className="illustration-label mono">{kind === 'plotting' ? 'Existing workbench exports' : kind === 'export' ? 'Output guide · Existing formats' : 'Workflow illustration · Bologna'}</p>
    <div className="workflow-choices" role="group" aria-label={`${kind} illustration choices`}>
      {labels.map((label,index) => <button key={label} type="button" ref={el => { refs.current[index] = el }}
        aria-pressed={selected === index} onClick={() => choose(index)} onKeyDown={event => keyboard(event,index)}>
        <span>{label}</span>{kind === 'analysis' && <strong>{data.frequency[index].count}</strong>}
      </button>)}
    </div>
    {kind === 'import' && <div className="workflow-source">
      <div className={selected === 0 ? 'is-selected' : ''}><span className="mono evidence-label">Source document</span><strong>{example.document_name}</strong></div>
      <div className="evidence-connector" aria-hidden="true">↓</div>
      <div className={selected === 1 ? 'is-selected' : ''}><span className="mono evidence-label">Existing source excerpt</span><blockquote lang="it">{example.quote}</blockquote></div>
      <div className="evidence-connector" aria-hidden="true">↓</div>
      <div className={selected === 2 ? 'is-selected' : ''}><span className="mono evidence-label">Unicode range</span><strong>[{example.start}, {example.end})</strong></div>
      <p role="status">{['Keep the source file recognisable.', 'The original wording stays intact.', 'A saved coding can point back to this exact range.'][selected]}</p>
    </div>}
    {kind === 'analysis' && row && <div className="workflow-count">
      <dl aria-live="polite"><dt>Selected code</dt><dd>{row.label}</dd><dt>CSV count</dt><dd className="workflow-count__value">{row.count}</dd></dl>
      <p className="workflow-credit">{data.frequencyCredit}</p>
      <a href={`/report/${data.frequencyCsv}`} download>Inspect this count CSV</a>
      <p>Insights contains the relationship map, frequency and document matrix. Find the co-occurrence heatmap in Figures.</p>
    </div>}
    {kind === 'plotting' && figure && <figure className="workflow-figure" aria-live="polite">
      {/* Original verified asset, without a replacement renderer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/report/${figure.svg}`} alt={`Existing Bologna export: ${figure.label}`} width="1000" height="700" loading="lazy" />
      <figcaption><strong>{figure.label}</strong><p>{figure.credit}</p><a href={`/report/${figure.csv}`} download>Count CSV</a>{' · '}<a href={`/report#sec-${figure.kind}`}>Open report chapter</a></figcaption>
    </figure>}
    {kind === 'export' && <div className="workflow-output" aria-live="polite">
      <span className="workflow-file mono" aria-hidden="true">{format.suffix}</span><h3>{format.title}</h3>
      <ul>{format.items.map(item => <li key={item}>{item}</li>)}</ul><p>{format.note}</p>
      <p className="workflow-note">Select a format here to inspect its contents. Use Export in the workbench to download your project.</p>
    </div>}
  </div>
}
