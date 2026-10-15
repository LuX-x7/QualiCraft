import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import evidence from './bologna-evidence.json'
import { readManifest, verifyManifest } from '@/lib/report/read'

export async function readSiteEvidence() {
  const [manifest, checked, raw] = await Promise.all([
    readManifest(), verifyManifest(),
    readFile(path.join(process.cwd(), 'public/report/manifest.json')),
  ])
  const bound = createHash('sha256').update(raw).digest('hex') === evidence.provenance.manifest_sha256
  return { manifest, evidence: checked.ok && bound ? evidence : null }
}
