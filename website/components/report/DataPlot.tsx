'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { buildChartModel, type ChartItem, type ChartTable } from '@/lib/report/chart-model'

const short = (text: string, length = 35) => text.length > length ? `${text.slice(0, length - 1)}…` : text

export default function DataPlot({ kind, label, table, selected, onSelect, onLocate }: {
  kind: string; label: string; table: ChartTable; selected: number | undefined
  onSelect: (row: number | undefined, open?: boolean) => void; onLocate: (row: number) => void
}) {
  const model = useMemo(() => { try { return buildChartModel(kind, table) } catch { return null } }, [kind, table])
  const [group, setGroup] = useState(model?.groups[0] ?? '')
  const [expanded, setExpanded] = useState(false)
  const [entered, setEntered] = useState(false)
  const surface = useRef<HTMLDivElement>(null)
  const marks = useRef<Map<number, SVGGElement>>(new Map())
  useEffect(() => {
    if (!surface.current || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setEntered(true); observer.disconnect() }
    }, { threshold: .12 })
    observer.observe(surface.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (kind !== 'hierarchy' || selected === undefined || !model) return
    const item = model.items[selected]
    if (item) {
      setGroup(item.group ?? '')
      const index = model.items.filter(row => row.group === item.group).findIndex(row => row.row === selected)
      if (index >= 12) setExpanded(true)
    }
  }, [kind, selected, model])
  if (!model) return <p role="status">Use the original figure and complete count table below.</p>
  const all = kind === 'hierarchy' ? model.items.filter(item => item.group === group) : model.items
  const items = kind === 'hierarchy' && !expanded ? all.slice(0, 12) : all
  const maximum = Math.max(1, ...items.map(item => item.value))
  const ticks = [...new Set([0, .25, .5, .75, 1].map(fraction => Math.ceil(maximum * fraction)))]
  const bars = kind === 'frequency' || kind === 'hierarchy'
  const matrix = kind === 'coverage' || kind === 'cooccurrence'
  const left = bars ? 325 : matrix ? 265 : 70
  const top = matrix ? 125 : 34
  const cell = 36
  const width = matrix ? left + model.x.length * cell + 25 : 920
  const height = bars ? Math.max(180, items.length * 36 + 65) : matrix ? top + model.y.length * cell + 55 : 390
  const active = selected === undefined ? undefined : model.items[selected]
  const choose = (event: KeyboardEvent<SVGGElement>, item: ChartItem) => {
    let index = items.findIndex(row => row.row === item.row)
    if (event.key === 'Home') index = 0
    else if (event.key === 'End') index = items.length - 1
    else if (['ArrowRight', 'ArrowDown'].includes(event.key)) index = Math.min(index + 1, items.length - 1)
    else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) index = Math.max(index - 1, 0)
    else if (event.key === 'Escape') { event.preventDefault(); onSelect(undefined); return }
    else if (event.key === 'Enter') { event.preventDefault(); onLocate(item.row); return }
    else if (event.key === ' ') { event.preventDefault(); onSelect(item.row); return }
    else return
    event.preventDefault()
    const next = items[index]
    onSelect(next.row)
    marks.current.get(next.row)?.focus({ preventScroll: true })
    marks.current.get(next.row)?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }
  const mark = (item: ChartItem, content: ReactNode) => <g key={item.row} role="button"
    ref={element => { if (element) marks.current.set(item.row, element); else marks.current.delete(item.row) }}
    tabIndex={(selected ?? items[0]?.row) === item.row ? 0 : -1}
    aria-label={`Read ${kind === 'accumulation' ? `Step ${item.step} · ${item.label}` : kind === 'hierarchy' ? `${item.group} › ${item.label}` : item.label}`}
    aria-pressed={selected === item.row} data-csv-row={item.row}
    className={`plot-mark${selected === item.row ? ' is-selected' : ''}`}
    onFocus={() => onSelect(item.row)} onClick={() => onSelect(item.row)}
    onPointerMove={event => { if (event.pointerType === 'mouse' && (event.movementX || event.movementY)) onSelect(item.row) }}
    onKeyDown={event => choose(event, item)}><title>{`${item.label}: ${item.value}`}</title>{content}</g>
  const xPoint = (index: number) => 70 + index / Math.max(1, items.length - 1) * 790
  const yPoint = (value: number) => 330 - value / maximum * 270
  return <div ref={surface} className={`data-plot${entered ? ' has-entered' : ''}`}>
    {kind === 'hierarchy' && <div className="plot-theme"><label>Theme <select value={group} onChange={event => { setGroup(event.target.value); setExpanded(false); onSelect(undefined) }} aria-label="Theme to display">{model.groups.map(name => <option key={name}>{name}</option>)}</select></label>
      <span>{items.length} of {all.length} codes</span>{all.length > 12 && <button type="button" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show first 12' : 'Show all in this theme'}</button>}</div>}
    <div className="plot-inspector" id={`reader-value-${kind}`} role="status" aria-live="polite" aria-atomic="true">
      {active ? <><span className="plot-inspector-label">{kind==='hierarchy'?`${active.group} › `:''}{active.label}</span><strong>{active.value}<small>{kind==='accumulation'?'distinct codes':'CSV count'}</small></strong>{active.secondary!==undefined&&<span className="plot-secondary">{active.secondary} newly encountered</span>}</> : <span>Choose a mark to read its exact CSV value.</span>}
    </div>
    <div className="plot-scroll" tabIndex={0} role="region" aria-label={`${label} chart; scroll horizontally on small screens`}>
      <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label={`${label} data items`} className={`plot-svg plot-svg--${kind}`}>
        {bars && <>
          {ticks.map(value => <g key={value} className="plot-grid"><line x1={left + value / maximum * 540} y1={14} x2={left + value / maximum * 540} y2={height - 36} /><text x={left + value / maximum * 540} y={height - 12} textAnchor="middle">{value}</text></g>)}
          {items.map((item, index) => mark(item, <>
            <rect x={0} y={top + index * 36 - 16} width={width} height={35} fill="transparent" />
            <text x={left - 18} y={top + index * 36 + 1} textAnchor="end" className="plot-label">{short(item.label)}</text>
            <rect className="plot-bar" x={left} y={top + index * 36 - 13} width={item.value / maximum * 540} height={19} />
            <text className="plot-number" x={left + item.value / maximum * 540 + 10} y={top + index * 36 + 1}>{item.value}</text>
          </>))}
          <text className="plot-axis" x={left + 270} y={height - 1} textAnchor="middle">CSV count · unit stated below</text>
        </>}
        {matrix && <>
          {model.x.map((name, index) => <text key={name} className="plot-label plot-matrix-label" transform={`translate(${left + index * cell + 22},${top - 12}) rotate(-55)`}>{kind === 'coverage' ? name.replace('.txt', '') : short(name, 19)}</text>)}
          {model.y.map((name, index) => <text key={name} className="plot-label" x={left - 14} y={top + index * cell + 23} textAnchor="end">{short(name, 31)}</text>)}
          <rect x={left} y={top} width={model.x.length * cell} height={model.y.length * cell} fill="var(--paper-sunken)" />
          {items.map(item => {const x=left+model.x.indexOf(item.x!)*cell,y=top+model.y.indexOf(item.y!)*cell;return mark(item,<>
            <rect className="plot-cell" x={x+1} y={y+1} width={cell-2} height={cell-2} fill={`color-mix(in srgb, var(--accent) ${item.value / maximum * 88 + 6}%, white)`} />
            <text className="plot-cell-value" x={x+cell/2} y={y+23} textAnchor="middle" fill={item.value/maximum>.6?'white':'var(--ink-soft)'}>{item.value}</text>
          </>)})}
          <text className="plot-axis" x={left} y={height-14}>{kind === 'coverage' ? 'Interviews → · codes ↓' : 'Exported pairs · blank cells have no CSV value'}</text>
        </>}
        {kind === 'accumulation' && <>
          {ticks.map(value=><g key={value} className="plot-grid"><line x1={70} x2={860} y1={yPoint(value)} y2={yPoint(value)}/><text x={52} y={yPoint(value)+5} textAnchor="end">{value}</text></g>)}
          <path className="plot-area" d={`M 70 330 ${items.map((item,index)=>`L ${xPoint(index)} ${yPoint(item.value)}`).join(' ')} L 860 330 Z`} />
          <path className="plot-line" pathLength="1" d={items.map((item,index)=>`${index?'L':'M'} ${xPoint(index)} ${yPoint(item.value)}`).join(' ')} />
          {items.map((item,index)=>mark(item,<><circle cx={xPoint(index)} cy={yPoint(item.value)} r={17} fill="transparent"/><circle className="plot-dot" cx={xPoint(index)} cy={yPoint(item.value)} r={5}/><text className="plot-label" x={xPoint(index)} y={359} textAnchor="middle">{item.step}</text></>))}
          <text className="plot-axis" x={465} y={385} textAnchor="middle">Interview step · original file-name order</text>
          <text className="plot-label" x={70} y={16}>Distinct codes encountered</text>
        </>}
      </svg>
    </div>
    <p className="plot-keyboard mono">Arrow keys to explore · Enter to locate the count row · Escape to clear</p>
  </div>
}
