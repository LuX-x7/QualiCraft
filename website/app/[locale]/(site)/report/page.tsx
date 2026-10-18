import type { Metadata } from 'next'
import Link from 'next/link'
import ReportSignal from '@/components/report/ReportSignal'
import WorkedOutputs, {readWorkedExample} from '@/components/report/WorkedOutputs'
import ReportView, { type CsvTable, type FigureData, type Section } from '@/components/report/ReportView'
import { readCsv, readManifest, verifyManifest, type Manifest } from '@/lib/report/read'
import dataCards from '@/lib/site/data-cards.json'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { reportEvidence } from '@/lib/report/evidence'
import { readHitMap } from '@/lib/report/hit-map'
import '../t7-report.css'

export const metadata: Metadata = {
  title: 'A worked example · Bologna sources, report and figures',
  description: 'Read five views of the Bologna corpus, with a question, an exported figure, its counts and its limits in each chapter.',
}

/** Prose describes the existing export. It neither calculates new statistics
 *  nor recodes the source material. Dataset metadata comes from the generated card. */
function chapters(manifest: Manifest, figures: FigureData[]): Section[] {
  const byKind = Object.fromEntries(figures.map(figure => [figure.kind, figure]))
  const freq = byKind.frequency?.numbers as { labels?: string[]; counts?: number[] } | undefined
  const cov = byKind.coverage?.numbers as { labels?: string[]; cases?: string[] } | undefined
  const co = byKind.cooccurrence?.numbers as { labels?: string[]; mode?: string } | undefined
  const hier = byKind.hierarchy?.numbers as { hierarchy?: Record<string, Record<string, number>> } | undefined
  const acc = byKind.accumulation?.numbers as { cumulative?: number[]; cases?: string[] } | undefined
  const top = (freq?.labels ?? []).slice(0, 5).map((label, index) => ({ label, count: freq?.counts?.[index] }))
  const themeCount = Object.keys(hier?.hierarchy ?? {}).length
  const last = acc?.cumulative?.at(-1)
  const corpus = dataCards.cards.find(card => card.file === 'bologna_qda.zip')

  return [
    {
      id: 'sec-corpus', no: '01', title: 'The corpus',
      intro: <>
        <p className="report-lead">One public corpus. One saved coding record.</p>
        <p>Read frequency, distribution, shared ranges, theme structure and accumulation. Every view retains its exported values.</p>
        {corpus && <details className="report-dataset"><summary>Dataset, licence &amp; source record</summary>
          <aside className="report-data-card" aria-labelledby="corpus-record-title">
            <p className="report-step mono">Source dataset · {corpus.id}</p>
            <h3 id="corpus-record-title">{corpus.title}</h3>
            <p className="report-card-meta">{corpus.author} · {corpus.year} · {corpus.language}</p>
            <p>{corpus.purpose}</p>
            <div className="report-card-links mono"><a href={`https://doi.org/${corpus.doi}`}>Dataset record ↗</a><a href={corpus.licence_url}>{corpus.licence}</a></div>
            <p className="report-card-hash mono">Archive SHA-256 · {corpus.sha256_short}</p>
          </aside>
        </details>}
      </>,
    },
    {
      id: 'sec-frequency', no: '02', title: 'Code frequency', figureKind: 'frequency',
      intro: <>
        <p className="report-lead">Which codes appear most often in the coding record?</p>
        <p>Explore the {freq?.labels?.length ?? 0} exported codes. Choose a bar to read the count and find its source row.</p>
      </>,
      reading: <>
        <p>The five highest displayed counts belong to {top.map((item, index) => <span key={item.label}>
          {index > 0 && (index === top.length - 1 ? ' and ' : ', ')}<em>{item.label}</em> ({item.count})
        </span>)}.</p>
        <p>This is a selected view of the codebook. The numbers record coding activity; deciding what a passage means still requires reading it in context.
          Next, <a href="#sec-coverage">check how these codes are distributed across interviews</a>.</p>
      </>,
    },
    {
      id: 'sec-coverage', no: '03', title: 'Code × interview', figureKind: 'coverage',
      intro: <>
        <p className="report-lead">How are the busiest codes distributed across interviews?</p>
        <p>{cov?.cases?.length ?? 0} interviews across, {cov?.labels?.length ?? 0} codes down. Choose any cell, including zeros.</p>
      </>,
      reading: <>
        <p>A zero means no coding was recorded for that code in that interview. It does not establish that the topic was absent from the conversation.</p>
        <p>These are the codes selected for this figure, not the entire codebook. To examine shared text rather than distribution across files,
          continue to <a href="#sec-cooccurrence">co-occurrence</a>.</p>
      </>,
    },
    {
      id: 'sec-cooccurrence', no: '04', title: 'Co-occurrence', figureKind: 'cooccurrence',
      intro: <>
        <p className="report-lead">Which codes {co?.mode === 'unit' ? 'occur in the same paragraph' : 'share a stretch of text'}?</p>
        <p>Only the exported non-zero pairs are shown. Blank cells carry no CSV value; the original figure remains available below.</p>
      </>,
      reading: <>
        <p>TABLE.03 preserves the exported non-zero pairs in both directions. The original workbench figure also includes a diagonal; it is not included in this CSV or the interactive view.</p>
        <p>A blank pair in the count export is not proof that two ideas are unrelated. These values describe the coded ranges under the chosen rule.
          Next, <a href="#sec-hierarchy">return to the codebook’s theme structure</a>.</p>
      </>,
    },
    {
      id: 'sec-hierarchy', no: '05', title: 'Theme hierarchy', figureKind: 'hierarchy',
      intro: <>
        <p className="report-lead">How does the codebook organise the coded material?</p>
        <p>Choose one of {themeCount} exported themes. Expand the group to inspect every code without merging its identity.</p>
      </>,
      reading: <>
        <p>The theme membership comes from the codebook. The exported layout orders groups and bars by their counts;
          it does not establish that a larger group explains the others.</p>
        <p>The same material can carry more than one code. To see how the set of encountered codes grows across files,
          continue to <a href="#sec-accumulation">accumulation</a>.</p>
      </>,
    },
    {
      id: 'sec-accumulation', no: '06', title: 'Accumulation', figureKind: 'accumulation',
      intro: <>
        <p className="report-lead">How does the set of encountered codes grow as files are added?</p>
        <p>The curve adds interviews in file-name order. TABLE.05 preserves the exported step, case, cumulative total and number of newly encountered codes.</p>
      </>,
      reading: <>
        <p>The final exported point is {last ?? 'unavailable'} distinct codes encountered across {acc?.cases?.length ?? 0} interviews,
          compared with {manifest.project.codes} codes defined in the full codebook.</p>
        <p>The route through the curve depends on the order of the files. A slower rise alone does not decide whether the research is complete.
          Finish with the <a href="#sec-methods">counting rules and export record</a>.</p>
      </>,
    },
    {
      id: 'sec-methods', no: '07', title: 'Methods & limits',
      intro: <>
        <p>This worked example describes existing coding counts. For your own Research report, select one method in Export: Thematic Analysis, Qualitative Content Analysis or Qualitative Comparative Analysis. Its saved name and process map accompany HTML, editable Word and the report ZIP. <a href="/#method">Explore the three method maps</a>.</p>
        <p className="report-lead">Follow each number back to its export.</p>
        <p>The page reads the workbench’s SVGs and CSVs. It checks every listed file against the manifest’s SHA-256 and byte length before showing the report.
          Count tables retain the exported rows and order. The unit statements below come directly from that same manifest.</p>
        <details className="report-method-detail"><summary>Counting rules from the manifest</summary><dl className="report-rules">{figures.map(figure => <div key={figure.kind}>
          <dt>{figure.label}</dt><dd>{figure.credit}</dd>
        </div>)}</dl></details>
        <details className="report-export-record" id="export-record"><summary>Export record &amp; file hashes</summary>
          <dl className="report-provenance">
            <div><dt>Project</dt><dd>{manifest.project.name}</dd></div>
            <div><dt>Source</dt><dd className="mono">{manifest.source}</dd></div>
            <div><dt>Exported at</dt><dd className="mono"><time dateTime={manifest.generated_at}>{manifest.generated_at}</time></dd></div>
            <div><dt>{manifest.working_tree_dirty ? 'Base commit' : 'Commit'}</dt><dd className="mono">{manifest.commit}</dd></div>
            {manifest.working_tree_dirty && <div><dt>Source state</dt><dd>Working tree at export; exact source hashes recorded below.</dd></div>}
            {Object.entries(manifest.source_files ?? {}).map(([name, hash]) => <div key={name}><dt>{name} SHA-256</dt><dd className="mono">{hash}</dd></div>)}
            <div><dt>Command</dt><dd className="mono">{manifest.command}</dd></div>
          </dl>
          <a href="/report/manifest.json" className="mono">Read the manifest and full file hashes ↗</a>
        </details>
        <p>These descriptive views do not replace interpretation of the interviews. For the same workflow in the interface,
          <Link href="/w?lang=en">open the workbench</Link>.</p>
      </>,
    },
  ]
}

export default async function ReportPage() {
  const manifest = await readManifest()
  const checked = await verifyManifest()
  if (!checked.ok) {
    return <div className="t7"><header className="report-head wrap">
      <p className="sec-no">A worked example</p><h1>These figures do not match their export</h1>
      <p className="report-standfirst">The manifest beside the figures records the SHA-256 of every file the workbench export wrote.
        Re-hashing what is on disk disagrees, so the page refuses to show them. Re-run the export and try again.</p>
      <ul className="report-problems mono">{checked.problems.map(problem => <li key={problem}>{problem}</li>)}</ul>
    </header></div>
  }

  const figures: FigureData[] = manifest.figures.map(figure => ({ ...figure, numbers: figure.numbers ?? {}, commit: manifest.commit }))
  const csvs: Record<string, CsvTable> = {}
  for (const figure of manifest.figures) {
    if (!figure.error && figure.csv) {
      const rows = await readCsv(figure.csv)
      csvs[figure.kind] = { head: rows[0] ?? [], rows: rows.slice(1) }
      if (['frequency', 'accumulation', 'cooccurrence', 'hierarchy'].includes(figure.kind)) {
        const svg = await readFile(path.join(process.cwd(), 'public', 'report', figure.svg), 'utf8')
        const hitMap = readHitMap(figure.kind, svg, csvs[figure.kind], figure.numbers)
        if (hitMap) figures.find(item => item.kind === figure.kind)!.hitMap = hitMap
      }
    }
  }
  const evidence = reportEvidence(await readFile(path.join(process.cwd(), 'public', 'report', 'manifest.json'), 'utf8'), csvs)
  const outputs = await readWorkedExample()
  const sections:Section[] = [{id:'sec-outputs',no:'00',title:'Finished outputs',intro:<WorkedOutputs manifest={outputs}/>} ,...chapters(manifest, figures)].map((section,index)=>({...section,no:String(index+1).padStart(2,'0')}))

  return <div className="t7">
    <header className="report-head report-head--visual wrap">
      <div><p className="sec-no">FIELD NOTES / BOLOGNA · CC0</p>
        <h1>From coded source<br/><em>to finished files.</em></h1>
        <p className="report-standfirst">Read the Notebook and editable report, then trace all five figures to their counts.</p>
        <dl className="report-facts mono">
          <div><dt>Interviews</dt><dd>{manifest.project.documents}</dd></div>
          <div><dt>Defined codes</dt><dd>{manifest.project.codes}</dd></div>
          <div><dt>Codings</dt><dd>{manifest.project.codings}</dd></div>
        </dl>
        <a className="report-start mono" href="#sec-outputs">Open the finished outputs ↓</a>
      </div>
      {csvs.frequency && <ReportSignal table={csvs.frequency} credit={figures.find(item=>item.kind==='frequency')?.credit??''}/>}
    </header>
    <ReportView sections={sections} figures={figures} csvs={csvs} evidence={evidence} />
  </div>
}
