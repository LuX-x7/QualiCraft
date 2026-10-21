import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import evidence from './bologna-evidence.json'
import teachingEvidence from './bologna-teaching-evidence.json'
import reportSource from '@/lib/report/bologna-evidence.json'
import teachingReportSource from '@/lib/report/bologna-teaching-evidence.json'
import { readCsv, readManifest, verifyManifest } from '@/lib/report/read'

export async function readSiteEvidence() {
  const [manifest, checked, raw] = await Promise.all([
    readManifest(), verifyManifest(),
    readFile(path.join(process.cwd(), 'public/report/manifest.json')),
  ])
  const bound = createHash('sha256').update(raw).digest('hex') === evidence.provenance.manifest_sha256
  const frequency = manifest.figures.find(f => f.kind === 'frequency')
  const csv = frequency && checked.ok && bound ? await readCsv(frequency.csv) : []
  const expectedLabels = frequency?.numbers.labels, expectedCounts = frequency?.numbers.counts
  const valid = JSON.stringify(csv[0]) === JSON.stringify(['code','count'])
    && csv.slice(1).every(row => row.length === 2 && /^\d+$/.test(row[1]))
    && JSON.stringify(csv.slice(1).map(row => row[0])) === JSON.stringify(expectedLabels)
    && JSON.stringify(csv.slice(1).map(row => Number(row[1]))) === JSON.stringify(expectedCounts)
  const network=checked.ok&&bound&&reportSource.provenance.manifest_sha256===evidence.provenance.manifest_sha256&&reportSource.provenance.project_sha256===evidence.provenance.project_sha256&&reportSource.provenance.database_sha256===evidence.provenance.database_sha256?Object.values(reportSource.examples):[]
  const teachingNetwork=Object.values(teachingReportSource.examples)
  return { manifest, network, teachingNetwork, evidence: checked.ok && bound ? evidence : null, teachingEvidence,
    workflow: { frequency: valid ? csv.slice(1,4).map(row => ({label:row[0],count:row[1]})) : [],
      frequencyCredit:frequency?.credit ?? '', frequencyCsv:frequency?.csv ?? '',
      figures:checked.ok && bound ? manifest.figures.filter(f => !f.error) : [] } }

}
