'use client'

import { useRef, useState } from 'react'
import type evidence from '@/lib/site/bologna-evidence.json'
export type CodingExample = (typeof evidence)['example']

const STEPS = ['Read passage', 'See code', 'Follow theme', 'Check source']
const EXPLAIN = [
  'An existing Bologna coding, shown as a relationship illustration.',
  'A saved code stays linked to the original document and range.',
  'Theme paths organise codes. Select a label to inspect its recorded definition.',
  'Check the original Italian text, document, range and stable source IDs.',
]

export default function CodingEvidence({ example }: { example: CodingExample }) {
  const [step, setStep] = useState(0)
  const [definition, setDefinition] = useState<number | null>(null)
  const [sourceOpen, setSourceOpen] = useState(false)
  const buttons = useRef<Array<HTMLButtonElement | null>>([])
  const targets = useRef<Array<HTMLElement | null>>([])
  const select = (index: number, focus = false) => {
    const next = Math.max(0, Math.min(STEPS.length - 1, index))
    setStep(next)
    if (next === 3) setSourceOpen(true)
    if (focus) buttons.current[next]?.focus({ preventScroll: true })
    requestAnimationFrame(() => targets.current[next]?.scrollIntoView({ block: 'nearest', behavior: 'instant' }))
  }
  const keyboard = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); select(index + 1, true) }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); select(index - 1, true) }
    if (event.key === 'Home') { event.preventDefault(); select(0, true) }
    if (event.key === 'End') { event.preventDefault(); select(3, true) }
  }
  const leaf = example.code_path.at(-1)!
  return <div className="coding-example" data-evidence-annotation={example.annotation_id} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); setDefinition(null); setSourceOpen(false); select(0, true) } }}>
    <p className="illustration-label mono">Relationship illustration · Saved Bologna coding</p>
    <div className="evidence-steps" role="group" aria-label="Coding illustration steps">
      {STEPS.map((label, index) => <button key={label} ref={el => { buttons.current[index] = el }} type="button" aria-pressed={step === index}
        onClick={() => select(index)} onKeyDown={event => keyboard(event, index)}>{index + 1}. {label}</button>)}
    </div>
    <p className="evidence-explanation" aria-live="polite" aria-atomic="true">{EXPLAIN[step]}</p>
    <div ref={el => { targets.current[0] = el }} className={`evidence-quote${step === 0 ? ' is-selected' : ''}`}>
      <span className="mono evidence-label">Passage · {example.document_name}</span>
      <blockquote lang="en"><mark className={step >= 1 ? 'is-coded' : ''}>{example.quote}</mark></blockquote>
      <span className="mono evidence-range">Unicode range [{example.start}, {example.end})</span>
    </div>
    <div className="evidence-connector" aria-hidden="true">↓</div>
    <div ref={el => { targets.current[1] = el }} className={`evidence-code${step === 1 ? ' is-selected' : ''}`}>
      <span className="mono evidence-label">Code</span><strong>{leaf.name}</strong>
    </div>
    <div className="evidence-connector" aria-hidden="true">↓</div>
    <div ref={el => { targets.current[2] = el }} className={`evidence-themes${step === 2 ? ' is-selected' : ''}`}>
      <span className="mono evidence-label">Full theme path</span>
      <ol>{example.code_path.map((code, index) => <li key={code.id}>
        <button type="button" aria-pressed={definition === index} onClick={() => { setDefinition(definition === index ? null : index); setStep(2) }}>{code.name}</button>
      </li>)}</ol>
      {definition !== null && <p className="evidence-definition" role="status">{example.code_path[definition].definition || 'No definition was recorded for this code.'}</p>}
    </div>
    <details ref={el => { targets.current[3] = el }} className="evidence-source" open={sourceOpen} onToggle={event => setSourceOpen(event.currentTarget.open)}>
      <summary>Example source and verification</summary>
      <dl><dt>Document</dt><dd>{example.document_name} · [{example.start}, {example.end})</dd>
        <dt>Annotation ID</dt><dd>{example.annotation_id}</dd><dt>Code ID</dt><dd>{example.code_id}</dd>
        <dt>Document ID</dt><dd>{example.document_id}</dd><dt>Document SHA-256</dt><dd>{example.document_sha256}</dd>
        <dt>Recorded source</dt><dd>{example.source} · Bologna CC0</dd></dl>
    </details>
  </div>
}
