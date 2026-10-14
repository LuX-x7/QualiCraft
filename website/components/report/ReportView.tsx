'use client'

/**
 * The report's client half: the table of contents that follows the reader,
 * the figure/table toggle, and the motion.
 *
 * Motion, exactly as measured on the reference build and no further:
 * the TOC indicator travels 240 ms with cubic-bezier(0.22, 0.61, 0.36, 1);
 * a figure fades in once over 240 ms ease-out when it first enters the
 * viewport; hover is immediate. Scrolling is the browser's own — nothing
 * here hijacks it. Under prefers-reduced-motion the CSS drops every
 * transition and the observer marks figures shown without animating.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

export type FigureData = {
  kind: string
  label: string
  credit: string
  svg: string
  csv: string
  commit: string
  numbers: Record<string, unknown>
  error?: string
}

export type CsvTable = { head: string[]; rows: string[][] }

export type Section = { id: string; no: string; title: string; subs: { id: string; label: string }[] }

export default function ReportView({
  sections,
  figures,
  csvs,
  children,
}: {
  sections: Section[]
  figures: FigureData[]
  csvs: Record<string, CsvTable>
  children: React.ReactNode
}) {
  const [current, setCurrent] = useState(sections[0]?.id ?? '')
  const [tables, setTables] = useState<Record<string, boolean>>({})
  const [indicatorTop, setIndicatorTop] = useState(0)
  const figureRefs = useRef<Map<string, HTMLElement>>(new Map())
  const listRef = useRef<HTMLOListElement | null>(null)

  /* The TOC follows the section the reader is in. The observer measures
     against a hairline across the middle of the viewport; the callback then
     recomputes the section containing that line from the boxes, so the
     current chapter is the one the reader is actually inside rather than
     whichever had the largest overlap when the scroll settled. */
  useEffect(() => {
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!headings.length || typeof IntersectionObserver === 'undefined') return
    const pick = () => {
      const line = window.innerHeight * 0.5
      let lastAbove = ''
      for (const el of headings) {
        const box = el.getBoundingClientRect()
        if (box.top <= line && box.bottom >= line) return el.id
        if (box.bottom < line) lastAbove = el.id
      }
      return lastAbove
    }
    const observer = new IntersectionObserver(
      () => {
        const id = pick()
        if (id) setCurrent(id)
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  /* The indicator travels to the current chapter: a thin rule and a dot,
     positioned at the active link's centre. The travel itself is the CSS
     transition on `top`, so its duration and easing live in one place.

     The centre is measured against the list, not against the link's
     offsetParent: every chapter link sits inside a positioned `.toc-item`,
     so `link.offsetTop` is a few pixels for every chapter alike and the
     rule would never leave the first one. Two rects taken at the same
     moment have no offsetParent to argue about. */
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const link = list.querySelector(`a[href="#${current}"]`) as HTMLElement | null
    if (!link) return
    const listRect = list.getBoundingClientRect()
    const linkRect = link.getBoundingClientRect()
    setIndicatorTop(linkRect.top - listRect.top + linkRect.height / 2)
  }, [current, sections])

  /* A figure fades in once, on first entry. Elements start visible; the
     pending class is added only once JS is running, so a no-script reader
     never faces hidden content. */
  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const nodes = [...figureRefs.current.entries()]
    if (reduced || typeof IntersectionObserver === 'undefined') return
    for (const [, el] of nodes) el.classList.add('fig-pending')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.remove('fig-pending')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.15 },
    )
    for (const [, el] of nodes) observer.observe(el)
    return () => observer.disconnect()
  }, [figures])

  const setFigureRef = useCallback((kind: string, el: HTMLElement | null) => {
    if (el) figureRefs.current.set(kind, el)
    else figureRefs.current.delete(kind)
  }, [])

  const toggle = (kind: string) => setTables((prev) => ({ ...prev, [kind]: !prev[kind] }))

  return (
    <div className="report">
      <nav className="report-toc" aria-label="Report contents">
        <div className="report-toc-inner">
          <p className="toc-kicker mono">Contents</p>
          <ol className="toc-list" ref={listRef}>
            {sections.map((section) => {
              const active = section.id === current
              return (
                <li key={section.id} className={active ? 'toc-item is-current' : 'toc-item'}>
                  <a
                    href={`#${section.id}`}
                    aria-current={active ? 'true' : undefined}
                    className="toc-link"
                  >
                    <span className="toc-no mono">{section.no}</span>
                    <span className="toc-title">{section.title}</span>
                  </a>
                  <ol className="toc-subs">
                    {section.subs.map((sub) => (
                      <li key={sub.id}>
                        <a href={`#${sub.id}`} className="toc-sub mono">
                          <span className="toc-sub-no">{sub.label}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </li>
              )
            })}
          </ol>
          {/* The indicator: a thin rule and a dot, travelling to the current
              chapter over 240 ms on the measured easing. */}
          <span
            className="toc-indicator"
            aria-hidden="true"
            style={{ top: `${indicatorTop}px` }}
          />
        </div>
      </nav>

      <main className="report-body" id="main">
        {children}

        {figures.map((figure, index) => {
          const table = csvs[figure.kind]
          const asTable = Boolean(tables[figure.kind])
          const figNo = `FIG.${String(index + 1).padStart(2, '0')}`
          return (
            <section
              key={figure.kind}
              className="report-fig-section"
              id={`fig-${figure.kind}`}
              ref={(el) => setFigureRef(figure.kind, el)}
            >
              <figure className="fig" id={figNo}>
                {figure.error ? (
                  <div className="fig-absent">
                    <strong>Figure not drawn.</strong>
                    <p>{figure.error}</p>
                  </div>
                ) : (
                  <img
                    src={`/report/${figure.svg}`}
                    alt={`${figure.label}. The caption states what the figure counts.`}
                    width={960}
                    height={540}
                    loading="lazy"
                  />
                )}
                <figcaption>
                  <span className="fig-no mono">{figNo}</span>
                  <span className="fig-title">{figure.label}</span>
                  <span className="fig-unit">{figure.credit}</span>
                  <span className="fig-source">
                    QualiCraft workbench export · {String(figure.numbers.codings ?? 0)} codings ·
                    commit {figure.commit.slice(0, 12)}
                  </span>
                </figcaption>
              </figure>

              {table && (
                <div className="fig-table-wrap">
                  <button
                    type="button"
                    className="fig-toggle mono"
                    aria-expanded={asTable}
                    aria-controls={`table-${figure.kind}`}
                    onClick={() => toggle(figure.kind)}
                  >
                    {asTable ? 'Hide the table' : 'View as table'}
                  </button>
                  <div id={`table-${figure.kind}`} hidden={!asTable} className="table-scroll">
                    <table className="data">
                      <caption className="mono">
                        TABLE.{String(index + 1).padStart(2, '0')} · {figure.label} — the counts
                        behind {figNo}
                      </caption>
                      <thead>
                        <tr>
                          {table.head.map((cell) => (
                            <th key={cell}>{cell}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className={cellIndex ? 'num' : undefined}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )
        })}
      </main>
    </div>
  )
}
