import type { ReportEvidence } from '@/lib/report/evidence'

export default function SourceEvidence({ evidence, kind, selected }: {
  evidence: ReportEvidence; kind: string; selected: number | undefined
}) {
  if (!evidence.available) return <p className="reader-help">Source examples are unavailable because their version could not be matched to this export. The original figures and count tables remain available.</p>
  if (selected === undefined) return null
  const ids = evidence.rows[kind]?.[selected]?.annotation_ids ?? []
  const examples = ids.map(id => evidence.examples[id])
  return <details className="reader-evidence">
    <summary>Inspect {examples.length === 2 ? 'a saved overlapping pair' : 'a saved source example'}</summary>
    <p className="reader-help">{examples.length === 2 ? 'One pair of saved codings with overlapping character ranges. This illustrates the rule; it is not the full set of counted pairs.'
      : kind === 'accumulation' ? 'One saved coding in this interview. It does not explain the cumulative total or establish saturation.'
      : 'At most one saved coding for this row. It illustrates the source relationship and does not represent every counted assignment.'}</p>
    {examples.length === 0 ? <p>No source example is attached to this zero-count row. A zero records no coding for this combination; it is not proof that a topic was absent.</p> : examples.map(example => <article key={example.annotation_id} className="source-example">
      <p className="mono">{example.document_name} · Unicode [{example.start}, {example.end})</p>
      <blockquote><mark>{example.quote}</mark></blockquote>
      <p className="source-code-path">{example.code_path.map(code => code.name).join(' › ')}</p>
      <details>
        <summary>Source IDs and verification</summary>
        <dl className="source-identities mono">
          <dt>Document ID</dt><dd>{example.document_id}</dd>
          <dt>Coding ID</dt><dd>{example.annotation_id}</dd>
          <dt>Code ID</dt><dd>{example.code_id}</dd>
          <dt>Code path IDs</dt><dd>{example.code_path.map(c => c.id).join(' › ')}</dd>
          <dt>Document SHA-256</dt><dd>{example.document_sha256}</dd>
          <dt>Project ID</dt><dd>{evidence.provenance.project_id}</dd>
          <dt>Project SHA-256</dt><dd>{evidence.provenance.project_sha256}</dd>
          <dt>Database SHA-256</dt><dd>{evidence.provenance.database_sha256}</dd>
          <dt>Manifest SHA-256</dt><dd>{evidence.provenance.manifest_sha256}</dd>
          <dt>Source index command</dt><dd>{evidence.provenance.command}</dd>
        </dl>
      </details>
    </article>)}
  </details>
}
