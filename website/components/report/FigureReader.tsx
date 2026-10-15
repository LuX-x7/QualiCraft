'use client'

import DataPlot from './DataPlot'
import type { CsvTable, FigureData } from './ReportView'

export default function FigureReader({ figure, table, selected, onSelect, onLocate }: {
  figure: FigureData; table: CsvTable; selected: number | undefined
  onSelect: (row: number | undefined, open?: boolean) => void; onLocate: (row: number) => void
}) {
  const label = (row: string[]) => figure.kind === 'frequency' ? row[0] : figure.kind === 'accumulation'
    ? `Step ${row[0]} · ${row[1]}` : `${row[0]} ${figure.kind === 'hierarchy' ? '›' : '×'} ${row[1]}`
  return <div className="figure-reader">
    <DataPlot kind={figure.kind} label={figure.label} table={table} selected={selected} onSelect={onSelect} onLocate={onLocate} />
    {selected !== undefined && <div className="reader-actions mono">
      <button type="button" disabled={selected === 0} onClick={() => onSelect(selected - 1)}>Previous</button>
      <button type="button" disabled={selected === table.rows.length - 1} onClick={() => onSelect(selected + 1)}>Next</button>
      <button type="button" onClick={() => onLocate(selected)}>View selected row ↓</button>
    </div>}
    <details className="reader-tools"><summary>Choose a value by name</summary>
      <label className="reader-label mono" htmlFor={`reader-select-${figure.kind}`}>{figure.kind === 'frequency' ? 'Code' : figure.kind === 'accumulation' ? 'Interview step' : figure.kind === 'coverage' ? 'Interview × code' : figure.kind === 'cooccurrence' ? 'Exported code pair' : 'Theme › code'}</label>
      <select id={`reader-select-${figure.kind}`} value={selected ?? ''}
        onKeyDown={event => { if(event.key === 'Escape') onSelect(undefined) }}
        onChange={event => onSelect(event.target.value === '' ? undefined : Number(event.target.value))}>
        <option value="">Choose an item</option>
        {table.rows.map((row,index) => <option key={index} value={index}>{label(row)}</option>)}
      </select>
      {figure.kind === 'cooccurrence' && <p className="reader-help">Only exported non-zero off-diagonal pairs are selectable. Blank and diagonal cells have no value in this CSV.</p>}
    </details>
    <details className="original-figure"><summary>Original workbench figure</summary>
      <img src={`/report/${figure.svg}`} alt={`${figure.label}: original workbench export.`} width={figure.hitMap?.width ?? 960} height={figure.hitMap?.height ?? 540} loading="lazy" />
      <a className="mono" href={`/report/${figure.svg}`} download>Download original SVG</a>
    </details>
    <noscript><p className="reader-help">Open the original figure or complete table for static values.</p></noscript>
  </div>
}
