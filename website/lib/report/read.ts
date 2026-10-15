/**
 * /report's data, read from the files the workbench's export wrote.
 *
 * Nothing here draws or transforms a figure: the SVGs and count CSVs are the
 * ones `tools/report/build_assets.py` produced through the workbench's own
 * plotting path, and this module only reads them back. The manifest records
 * the SHA-256 of every file at export time; `verify()` re-hashes what is on
 * disk so a stale or edited file fails loudly instead of quietly rendering.
 */
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export type ManifestFigure = {
  kind: string
  label: string
  credit: string
  svg: string
  csv: string
  numbers: Record<string, unknown>
  error?: string
}

export type Manifest = {
  generated_at: string
  commit: string
  command: string
  source: string
  working_tree_dirty?: boolean
  source_files?: Record<string, string>
  project: { name: string; documents: number; codes: number; codings: number }
  figures: ManifestFigure[]
  files: { path: string; bytes: number; sha256: string }[]
}

const ROOT = () => path.join(process.cwd(), 'public', 'report')

export async function readManifest(): Promise<Manifest> {
  const raw = await readFile(path.join(ROOT(), 'manifest.json'), 'utf8')
  return JSON.parse(raw) as Manifest
}

export async function readCsv(relative: string): Promise<string[][]> {
  const raw = await readFile(path.join(ROOT(), relative), 'utf8')
  return raw
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => splitCsvLine(line))
}

/** The smallest CSV reader that is correct for the exports: quoted fields
 *  with doubled quotes inside, no embedded newlines in these files. */
function splitCsvLine(line: string): string[] {
  const out: string[] = []
  let field = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          field += '"'
          i++
        } else {
          quoted = false
        }
      } else {
        field += ch
      }
    } else if (ch === '"') {
      quoted = true
    } else if (ch === ',') {
      out.push(field)
      field = ''
    } else {
      field += ch
    }
  }
  out.push(field)
  return out
}

/** Re-hash every file the manifest lists. A mismatch is a failed test, not a
 *  warning: the page would be showing a figure the export did not produce. */
export async function verifyManifest(): Promise<{ ok: boolean; problems: string[] }> {
  const manifest = await readManifest()
  const problems: string[] = []
  for (const file of manifest.files) {
    let bytes: Buffer
    try {
      bytes = await readFile(path.join(ROOT(), file.path))
    } catch {
      problems.push(`${file.path}: missing from disk`)
      continue
    }
    const digest = createHash('sha256').update(bytes).digest('hex')
    if (digest !== file.sha256) {
      problems.push(`${file.path}: sha256 ${digest.slice(0, 12)}… != manifest ${file.sha256.slice(0, 12)}…`)
    } else if (bytes.length !== file.bytes) {
      problems.push(`${file.path}: ${bytes.length} bytes on disk, manifest says ${file.bytes}`)
    }
  }
  return { ok: problems.length === 0, problems }
}
