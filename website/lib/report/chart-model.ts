export type ChartTable = { head: string[]; rows: string[][] }
export type ChartItem = { row: number; label: string; value: number; x?: string; y?: string; group?: string; step?: number; secondary?: number }
export type ChartModel = { items: ChartItem[]; x: string[]; y: string[]; groups: string[] }

/** Display geometry only. Every mark retains its original CSV row and value. */
export function buildChartModel(kind: string, table: ChartTable): ChartModel {
  const column = (name: string) => {
    const index = table.head.indexOf(name)
    if (index < 0) throw new Error(`Missing CSV column: ${name}`)
    return index
  }
  const number = (row: string[], name: string) => {
    const raw = row[column(name)]
    if (!/^\d+$/.test(raw ?? '')) throw new Error(`Invalid CSV ${name}`)
    const value = Number(raw)
    if (!Number.isSafeInteger(value)) throw new Error(`Invalid CSV ${name}`)
    return value
  }
  const field = (row: string[], name: string) => row[column(name)]
  const items = table.rows.map((cells, row): ChartItem => {
    if (kind === 'accumulation') return { row, label: field(cells, 'case'), step: number(cells, 'step'), value: number(cells, 'cumulative'), secondary: number(cells, 'new') }
    const value = number(cells, 'count')
    if (kind === 'frequency') return { row, label: field(cells, 'code'), value }
    if (kind === 'hierarchy') return { row, label: field(cells, 'subsection'), group: field(cells, 'section'), value }
    if (kind === 'coverage') return { row, label: `${field(cells, 'case')} × ${field(cells, 'code')}`, x: field(cells, 'case'), y: field(cells, 'code'), value }
    if (kind === 'cooccurrence') return { row, label: `${field(cells, 'code_a')} × ${field(cells, 'code_b')}`, x: field(cells, 'code_b'), y: field(cells, 'code_a'), value }
    throw new Error('Unsupported figure')
  })
  const unique = (values: (string | undefined)[]) => [...new Set(values.filter((value): value is string => value !== undefined))]
  const x = kind === 'cooccurrence' ? unique(items.flatMap(item => [item.x, item.y])) : unique(items.map(item => item.x))
  const y = kind === 'cooccurrence' ? [...x] : unique(items.map(item => item.y))
  const coordinates = items.filter(item => item.x !== undefined).map(item => JSON.stringify([item.x, item.y]))
  if (new Set(coordinates).size !== coordinates.length) throw new Error('Duplicate CSV coordinates')
  return { items, x, y, groups: unique(items.map(item => item.group)) }
}
