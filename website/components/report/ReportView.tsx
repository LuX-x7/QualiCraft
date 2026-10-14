'use client'

/** Native anchors and disclosures keep the reading path usable without JS.
 *  Scroll tracking adds a current chapter; figures retain the T7 one-time fade. */
import { useCallback, useEffect, useRef, useState } from 'react'
import FigureReader from './FigureReader'
import type { HitMap } from '@/lib/report/hit-map'

export type FigureData = {
  kind: string
  label: string
  credit: string
  svg: string
  csv: string
  commit: string
  numbers: Record<string, unknown>
  error?: string
  hitMap?: HitMap
}
export type CsvTable = { head: string[]; rows: string[][] }
export type Section = {
  id: string
  no: string
  title: string
  figureKind?: string
  intro: React.ReactNode
  reading?: React.ReactNode
}
const numericColumns = new Set(['count', 'step', 'cumulative', 'new'])

export default function ReportView({ sections, figures, csvs }: {
  sections: Section[]
  figures: FigureData[]
  csvs: Record<string, CsvTable>
}) {
  const [current, setCurrent] = useState(sections[0]?.id ?? '')
  const [tables, setTables] = useState<Record<string, boolean>>({})
  const [selected, setSelected] = useState<Record<string, number | undefined>>({})
  const [pendingRow, setPendingRow] = useState<string>()
  const [narrow, setNarrow] = useState(false)
  const [contentsOpen, setContentsOpen] = useState(false)
  const [indicatorTop, setIndicatorTop] = useState(0)
  const reportRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const figureRefs = useRef<Map<string, HTMLElement>>(new Map())

  const selectRow = (kind: string, row: number | undefined, open = false) => {
    setSelected(prev => ({ ...prev, [kind]: row }))
    if (open) setTables(prev => ({ ...prev, [kind]: true }))
  }
  // Keep selection visible inside an already open table without moving the
  // page. Only the explicit row button moves reading position and focus.
  useEffect(() => {
    for (const [kind, index] of Object.entries(selected)) {
      if (index === undefined || !tables[kind]) continue
      const row = document.getElementById(`row-${kind}-${index}`)
      const scroller = row?.closest<HTMLElement>('.table-scroll')
      if (row && scroller) {
        const r = row.getBoundingClientRect(), s = scroller.getBoundingClientRect()
        if (r.top < s.top || r.bottom > s.bottom) scroller.scrollTop += r.top - s.top
      }
    }
    if (pendingRow) {
      const row = document.getElementById(pendingRow)
      row?.focus({ preventScroll: true })
      row?.scrollIntoView({ block: 'start', behavior: 'instant' })
      setPendingRow(undefined)
    }
  }, [selected, tables, pendingRow])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)')
    const resize = () => { setNarrow(media.matches); setContentsOpen(false) }
    resize()
    media.addEventListener('change', resize)
    return () => media.removeEventListener('change', resize)
  }, [])

  // Track chapter tops at the reading line, including fast scrolls and layout
  // changes when fonts, figures or count disclosures change the page height.
  useEffect(() => {
    const chapters = sections.map(section => document.getElementById(section.id))
      .filter((el): el is HTMLElement => Boolean(el))
    let frame = 0
    const pick = () => {
      frame = 0
      const offset = parseFloat(getComputedStyle(reportRef.current!).getPropertyValue('--report-anchor-offset'))
      let id = chapters[0]?.id ?? ''
      for (const chapter of chapters) {
        if (chapter.getBoundingClientRect().top <= offset + 12) id = chapter.id
      }
      if (id) setCurrent(id)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(pick) }
    const observer = new IntersectionObserver(schedule, { rootMargin: '-112px 0px -55% 0px' })
    const sizes = new ResizeObserver(schedule)
    chapters.forEach(chapter => { observer.observe(chapter); sizes.observe(chapter) })
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      observer.disconnect(); sizes.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [sections])

  // Count anchors always exist, even when their table is closed. Direct URLs
  // and browser Back/Forward open the requested counts without hiding the plot.
  useEffect(() => {
    const reveal = () => {
      const hash = window.location.hash.slice(1)
      const section = sections.find(section => section.figureKind && hash === `table-${section.figureKind}`)
      if (section?.figureKind) setTables(prev => ({ ...prev, [section.figureKind!]: true }))
    }
    reveal()
    window.addEventListener('hashchange', reveal)
    return () => window.removeEventListener('hashchange', reveal)
  }, [sections])

  useEffect(() => {
    const position = () => {
      const list = listRef.current
      const link = list?.querySelector<HTMLAnchorElement>(`a[href="#${current}"]`)
      if (list && link) {
        const box = link.getBoundingClientRect()
        setIndicatorTop(box.top - list.getBoundingClientRect().top + box.height / 2)
      }
    }
    position()
    window.addEventListener('resize', position)
    return () => window.removeEventListener('resize', position)
  }, [current, narrow, contentsOpen])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const nodes = [...figureRefs.current.values()]
    nodes.forEach(el => el.classList.add('fig-pending'))
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.remove('fig-pending'); observer.unobserve(entry.target) }
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 })
    nodes.forEach(el => observer.observe(el))
    return () => { observer.disconnect(); nodes.forEach(el => el.classList.remove('fig-pending')) }
  }, [figures])

  const setFigureRef = useCallback((kind: string, el: HTMLElement | null) => {
    if (el) figureRefs.current.set(kind, el)
    else figureRefs.current.delete(kind)
  }, [])
  const visit = (section: Section, counts = false) => {
    setCurrent(section.id)
    if (counts && section.figureKind) setTables(prev => ({ ...prev, [section.figureKind!]: true }))
    if (narrow) setContentsOpen(false)
  }
  const chapter = sections.find(section => section.id === current) ?? sections[0]

  return (
    <div className="report" ref={reportRef}>
      <nav className="report-toc" aria-label="Report contents">
        <details className="report-toc-inner" open={!narrow || contentsOpen}
          onToggle={event => { if (narrow) setContentsOpen(event.currentTarget.open) }}>
          <summary className="report-toc-summary">
            <span className="mono">Contents</span>
            <span className="toc-current">{chapter?.no} · {chapter?.title}</span>
          </summary>
          <p className="toc-kicker mono">Contents · reading {chapter?.no} / {String(sections.length).padStart(2, '0')}</p>
          <div className="toc-list-wrap">
            <ol className="toc-list" ref={listRef}>
              {sections.map(section => {
                const number = String(figures.findIndex(figure => figure.kind === section.figureKind) + 1).padStart(2, '0')
                return (
                  <li key={section.id} className={section.id === current ? 'toc-item is-current' : 'toc-item'}>
                    <a href={`#${section.id}`} aria-current={section.id === current ? 'location' : undefined}
                      className="toc-link" onClick={() => visit(section)}>
                      <span className="toc-no mono">{section.no}</span>
                      <span className="toc-title">{section.title}</span>
                    </a>
                    {section.figureKind && (
                      <ol className="toc-subs">
                        <li><a href={`#fig-${section.figureKind}`} className="toc-sub mono" onClick={() => visit(section)}>FIG.{number} · figure</a></li>
                        <li><a href={`#table-${section.figureKind}`} className="toc-sub mono" onClick={() => visit(section, true)}>TABLE.{number} · counts</a></li>
                      </ol>
                    )}
                  </li>
                )
              })}
            </ol>
            <span className="toc-indicator" aria-hidden="true" style={{ top: `${indicatorTop}px` }} />
          </div>
        </details>
      </nav>

      <main className="report-body" id="main">
        {sections.map(section => {
          const figureIndex = figures.findIndex(figure => figure.kind === section.figureKind)
          const figure = figures[figureIndex]
          const table = figure && csvs[figure.kind]
          const readable = table && ['frequency', 'accumulation'].includes(figure.kind)
          const number = String(figureIndex + 1).padStart(2, '0')
          return (
            <section key={section.id} className="report-section" id={section.id} tabIndex={-1} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}><span className="sec-no">{section.no}</span>{section.title}</h2>
              {figure && <h3 className="report-step mono">The question</h3>}
              <div className="report-prose report-question">{section.intro}</div>
              {figure && (
                <>
                  <div className="report-fig-section" id={`fig-${figure.kind}`} tabIndex={-1}
                    ref={el => setFigureRef(figure.kind, el)}>
                    <figure className="fig">
                      {figure.error ? <div className="fig-absent"><strong>Figure not drawn.</strong><p>{figure.error}</p></div> : readable ? (
                        <FigureReader figure={figure} table={table} selected={selected[figure.kind]}
                          onSelect={(row, open) => selectRow(figure.kind, row, open)}
                          onLocate={row => {
                            selectRow(figure.kind, row, true)
                            setPendingRow(`row-${figure.kind}-${row}`)
                          }} />
                      ) : (
                        <img src={`/report/${figure.svg}`} alt={`${figure.label}. The caption states what the figure counts.`}
                          width={960} height={540} loading="lazy" />
                      )}
                      <figcaption>
                        <span className="fig-no mono">FIG.{number}</span><span className="fig-title">{figure.label}</span>
                        <span className="fig-unit">{figure.credit}</span>
                        <span className="fig-source">Workbench export · {String(figure.numbers.codings ?? 0)} codings · <a href="#sec-methods">Export record</a></span>
                      </figcaption>
                    </figure>
                  </div>
                  <div className="report-counts" id={`table-${figure.kind}`} tabIndex={-1}>
                    <div className="report-counts-head">
                      <h3 className="report-step mono">The counts</h3>
                      {table && <a className="mono" href={`/report/${figure.csv}`} download>Download CSV</a>}
                    </div>
                    {table ? (
                      <details className="fig-table-wrap" open={Boolean(tables[figure.kind])}
                        onToggle={event => {
                          const open = event.currentTarget.open
                          setTables(prev => prev[figure.kind] === open ? prev : { ...prev, [figure.kind]: open })
                        }}>
                        <summary className="fig-toggle mono">
                          <span>TABLE.{number} · {tables[figure.kind] ? 'Hide counts' : 'View counts'}</span>
                          <span className="table-row-count">{table.rows.length} rows</span>
                        </summary>
                        <div className="table-scroll" tabIndex={0} role="region" aria-label={`${figure.label} counts`}>
                          <table className="data">
                            <caption className="mono">TABLE.{number} · {figure.label} — exported values behind FIG.{number}</caption>
                            <thead><tr>{table.head.map(cell => <th key={cell} scope="col">{cell}</th>)}</tr></thead>
                            <tbody>{table.rows.map((row, rowIndex) => (
                              <tr key={rowIndex} id={readable ? `row-${figure.kind}-${rowIndex}` : undefined}
                                tabIndex={readable ? -1 : undefined}
                                className={readable && selected[figure.kind] === rowIndex ? 'is-selected' : undefined}
                                aria-current={readable && selected[figure.kind] === rowIndex ? 'true' : undefined}>
                                {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className={numericColumns.has(table.head[cellIndex]) ? 'num' : undefined}>
                                  {readable && cellIndex === 0 ? <button type="button" className="reader-row-button"
                                    aria-label={`Read ${figure.kind === 'frequency' ? cell : `step ${cell}: ${row[1]}`}`}
                                    aria-pressed={selected[figure.kind] === rowIndex}
                                    onClick={() => selectRow(figure.kind, rowIndex)}>{cell}</button> : cell}
                                </td>
                              ))}</tr>
                            ))}</tbody>
                          </table>
                        </div>
                      </details>
                    ) : <p className="report-prose">No count table was exported for this figure.</p>}
                    {readable && <a className="reader-return mono" href={`#fig-${figure.kind}`}>Return to the figure ↑</a>}
                  </div>
                  <div className="report-reading">
                    <h3 className="report-step mono">Reading &amp; limits</h3>
                    <div className="report-prose">{section.reading}</div>
                  </div>
                </>
              )}
            </section>
          )
        })}
      </main>
    </div>
  )
}
