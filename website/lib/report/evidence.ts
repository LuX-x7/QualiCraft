import { createHash } from 'node:crypto'
import source from './bologna-evidence.json'
import homeSource from '@/lib/site/bologna-evidence.json'
import type { CsvTable } from '@/components/report/ReportView'

export type SourceExample = typeof source.examples[keyof typeof source.examples]
export type EvidenceRows = { row: string[]; annotation_ids: string[] }[]
export type ReportEvidence = {
  available: boolean
  provenance: typeof source.provenance
  examples: Record<string, SourceExample>
  rows: Record<string, EvidenceRows>
}

export function reportEvidence(manifestRaw: string, tables: Record<string, CsvTable>): ReportEvidence {
  const rows: Record<string, EvidenceRows> = source.rows
  const examples: Record<string, SourceExample> = source.examples
  const available = createHash('sha256').update(manifestRaw).digest('hex') === source.provenance.manifest_sha256
    && source.provenance.database_sha256 === homeSource.provenance.database_sha256
    && source.provenance.project_sha256 === homeSource.provenance.project_sha256
    && Object.entries(tables).every(([kind, table]) => rows[kind]?.length === table.rows.length
      && table.rows.every((row, i) => JSON.stringify(row) === JSON.stringify(rows[kind][i].row)
        && rows[kind][i].annotation_ids.every(id => Boolean(examples[id]))))
  return { available, provenance: source.provenance, examples: available ? examples : {}, rows: available ? rows : {} }
}
