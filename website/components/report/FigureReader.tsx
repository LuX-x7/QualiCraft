'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { HitMap } from '@/lib/report/hit-map'
import type { CsvTable, FigureData } from './ReportView'

export default function FigureReader({ figure, table, selected, onSelect, onLocate }: {
  figure: FigureData
  table: CsvTable
  selected: number | undefined
  onSelect: (row: number | undefined, open?: boolean) => void
  onLocate: (row: number) => void
}) {
  const [ready, setReady] = useState(false)
  const [hovered, setHovered] = useState<number>()
  const [focused, setFocused] = useState<number>()
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  useEffect(() => setReady(true), [])
  const map: HitMap | undefined = figure.hitMap
  const frequency = figure.kind === 'frequency'
  const label = (row: string[]) => frequency ? row[0] : `Step ${row[0]} · ${row[1]}`
  const row = selected === undefined ? undefined : table.rows[selected]
  const hintIndex = hovered !== undefined || focused !== undefined ? selected : undefined
  const hintRow = hintIndex === undefined ? undefined : table.rows[hintIndex]
  const hintTarget = hintIndex === undefined ? undefined : map?.targets[hintIndex]
  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    index = selected ?? index
    let next = index
    if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = table.rows.length - 1
    else if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = Math.min(index + 1, table.rows.length - 1)
    else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = Math.max(index - 1, 0)
    else if (event.key === 'Escape') { onSelect(undefined); setHovered(undefined); setFocused(undefined); return }
    else return
    event.preventDefault()
    onSelect(next)
    buttons.current[next]?.focus({ preventScroll: true })
  }

  return <div className="figure-reader">
    <div className="figure-surface">
      <img src={`/report/${figure.svg}`} alt={`${figure.label}. Exact exported values are in the count table below.`}
        width={map?.width ?? 960} height={map?.height ?? 540} loading="lazy" />
      {ready && map && <div className="figure-targets" role="group" aria-label={`${figure.label} data items`}
        aria-describedby={`reader-help-${figure.kind}`}>
        {map.targets.map((target, index) => <button key={index} type="button"
          ref={el => { buttons.current[index] = el }}
          className={`figure-target ${frequency ? 'is-bar' : 'is-point'}${selected === index ? ' is-selected' : ''}`}
          style={{ left: `${target.x / map.width * 100}%`, top: `${target.y / map.height * 100}%`,
            ...(frequency ? { width: `${target.width / map.width * 100}%`, height: `${target.height / map.height * 100}%` } : {}) }}
          tabIndex={(selected ?? 0) === index ? 0 : -1}
          aria-label={`Read ${label(table.rows[index])}`}
          aria-pressed={selected === index} aria-controls={`reader-value-${figure.kind}`}
          onPointerEnter={event => { if (event.pointerType === 'mouse') { setHovered(index); onSelect(index) } }}
          onPointerLeave={() => setHovered(undefined)}
          onFocus={() => { setFocused(index); onSelect(index) }} onBlur={() => setFocused(undefined)}
          onClick={() => onSelect(index, true)}
          onKeyDown={event => move(event, index)} />)}
      </div>}
      {ready && map && hintRow && hintTarget && <div className="reader-hint" aria-hidden="true"
        style={{ left: `${Math.min(55, Math.max(5, (hintTarget.x + hintTarget.width) / map.width * 100))}%`,
          top: `${Math.min(75, hintTarget.y / map.height * 100 + 4)}%` }}>
        <p>{label(hintRow)}</p>
        <dl className="mono">{table.head.map((column, index) => (frequency ? index === 1 : index >= 2)
          && <div key={column}><dt>{column}</dt><dd>{hintRow[index]}</dd></div>)}</dl>
      </div>}
    </div>
    {ready && <div className="reader-panel">
      <p className="report-step mono">Read the exported values</p>
      <p className="reader-help" id={`reader-help-${figure.kind}`}>Select an item below, or point to the figure on a larger screen.
        Use arrow keys, Home and End on the figure; press Enter to open its counts.</p>
      <label className="reader-label mono" htmlFor={`reader-select-${figure.kind}`}>{frequency ? 'Code' : 'Interview step'}</label>
      <select id={`reader-select-${figure.kind}`} value={selected ?? ''}
        onChange={event => onSelect(event.target.value === '' ? undefined : Number(event.target.value), true)}>
        <option value="">Choose an item</option>
        {table.rows.map((item, index) => <option key={index} value={index}>{label(item)}</option>)}
      </select>
      <div className="reader-value" id={`reader-value-${figure.kind}`} role="status" aria-live="polite" aria-atomic="true">
        {row ? <>
          <p className="reader-item">{label(row)}</p>
          <dl className="reader-numbers mono">{table.head.map((column, index) =>
            (frequency ? index === 1 : index >= 2) && <div key={column}><dt>{column}</dt><dd>{row[index]}</dd></div>)}</dl>
        </> : <p className="reader-empty">Choose a data item to read its CSV values.</p>}
      </div>
      <div className="reader-actions mono">
        <button type="button" disabled={selected === undefined || selected === 0}
          onClick={() => onSelect(selected! - 1, true)}>Previous</button>
        <button type="button" disabled={selected === undefined || selected === table.rows.length - 1}
          onClick={() => onSelect(selected! + 1, true)}>Next</button>
        <button type="button" disabled={selected === undefined} onClick={() => onLocate(selected!)}>View selected row ↓</button>
      </div>
    </div>}
    <noscript><p className="reader-help">Open the complete count table below to read exact values.</p></noscript>
  </div>
}
