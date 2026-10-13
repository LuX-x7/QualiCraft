import type { Metadata } from 'next'
import Link from 'next/link'
import ReportView, { type CsvTable, type FigureData, type Section } from '@/components/report/ReportView'
import { readCsv, readManifest, verifyManifest } from '@/lib/report/read'
import '../t7-report.css'

export const metadata: Metadata = {
  title: 'A worked example · figures from the Bologna corpus',
  description:
    'Five figures drawn by the QualiCraft workbench from a public, CC0-licensed interview corpus, with the counts behind each one.',
}

/** The report's chapters. Figures are described only with the numbers the
 *  workbench export produced; nothing is inferred and nothing is claimed
 *  beyond what a reader can count on the figure. */
function chapters(
  project: { documents: number; codes: number; codings: number },
  figures: FigureData[],
  commit: string,
): { sections: Section[]; prose: Record<string, React.ReactNode> } {
  const byKind = Object.fromEntries(figures.map((f) => [f.kind, f]))
  const freq = byKind.frequency?.numbers as { labels?: string[]; counts?: number[] } | undefined
  const acc = byKind.accumulation?.numbers as { cumulative?: number[]; cases?: string[] } | undefined
  const co = byKind.cooccurrence?.numbers as { labels?: string[] } | undefined
  const hier = byKind.hierarchy?.numbers as { hierarchy?: Record<string, Record<string, number>> } | undefined

  const top = (freq?.labels ?? []).slice(0, 5).map((label, i) => ({
    label,
    count: (freq?.counts ?? [])[i],
  }))
  const themeCount = hier?.hierarchy ? Object.keys(hier.hierarchy).length : 0
  const distinctCodes = acc?.cumulative?.length ? acc.cumulative[acc.cumulative.length - 1] : 0

  const sections: Section[] = [
    {
      id: 'sec-corpus',
      no: '01',
      title: 'The corpus',
      subs: [
        { id: 'fig-frequency', label: 'FIG.01 · the figure' },
        { id: 'table-frequency', label: 'TABLE.01 · the counts' },
      ],
    },
    {
      id: 'fig-frequency',
      no: '02',
      title: 'Code frequency',
      subs: [
        { id: 'fig-frequency', label: 'FIG.01 · the figure' },
        { id: 'table-frequency', label: 'TABLE.01 · the counts' },
      ],
    },
    {
      id: 'fig-coverage',
      no: '03',
      title: 'Code × interview',
      subs: [{ id: 'fig-coverage', label: 'FIG.02 · the figure' }],
    },
    {
      id: 'fig-cooccurrence',
      no: '04',
      title: 'Co-occurrence',
      subs: [{ id: 'fig-cooccurrence', label: 'FIG.03 · the figure' }],
    },
    {
      id: 'fig-hierarchy',
      no: '05',
      title: 'Theme hierarchy',
      subs: [{ id: 'fig-hierarchy', label: 'FIG.04 · the figure' }],
    },
    {
      id: 'fig-accumulation',
      no: '06',
      title: 'Accumulation',
      subs: [{ id: 'fig-accumulation', label: 'FIG.05 · the figure' }],
    },
    {
      id: 'sec-limits',
      no: '07',
      title: 'What these numbers do not say',
      subs: [],
    },
  ]

  const prose: Record<string, React.ReactNode> = {
    'sec-corpus': (
      <>
        <p>
          Every figure on this page was drawn by the QualiCraft workbench itself, from a
          public corpus: {project.documents} interview transcripts, {project.codes} codes and{' '}
          {project.codings} codings, released under CC0 1.0 and listed with its licence in the
          workbench&rsquo;s dataset record. The figures and the count tables are the files the
          workbench&rsquo;s export produces — the page does not redraw anything.
        </p>
        <p>
          The export ran at commit <code className="mono">{commit.slice(0, 12)}</code>; the
          manifest beside the figures records the hash of every file. Where a caption states what
          a figure counts, that sentence is the workbench&rsquo;s own wording, carried into the
          caption rather than rewritten here.
        </p>
      </>
    ),
    'fig-frequency': (
      <>
        <p>
          FIG.01 counts each confirmed passage&ndash;code link once, and shows the{' '}
          {(freq?.labels ?? []).length} most frequent codes. The five highest are{' '}
          {top.map((item, index) => (
            <span key={item.label}>
              {index > 0 && (index === top.length - 1 ? ' and ' : ', ')}
              <em>{item.label}</em> ({item.count})
            </span>
          ))}
          . Pending suggestions are excluded, so every bar is a coding a researcher accepted.
        </p>
      </>
    ),
    'fig-coverage': (
      <p>
        FIG.02 is the same count arranged by interview: one column per transcript, one row per
        code, a cell per passage&ndash;code link. A zero is an interview that code never appears
        in — the figure says so in its caption, because a zero is easy to misread.
      </p>
    ),
    'fig-cooccurrence': (
      <p>
        FIG.03 counts pairs of codes applied to overlapping character ranges within one
        interview, across the {co?.labels?.length ?? 0} busiest codes. Codes used on separate
        passages never form a pair, so the figure stays empty until two codes share a stretch of
        text. The diagonal is not pairs: it counts the units a code appears in.
      </p>
    ),
    'fig-hierarchy': (
      <p>
        FIG.04 arranges the codebook as its themes: {themeCount} top-level groups, each with the
        codes filed under it, and a bar per code counting the extracts coded with it. The
        ordering is the codebook&rsquo;s own, not a ranking.
      </p>
    ),
    'fig-accumulation': (
      <p>
        FIG.05 plots distinct codes seen so far as the interviews are added one at a time in
        file-name order, ending at {distinctCodes} distinct codes across{' '}
        {acc?.cases?.length ?? 0} interviews. File-name order is not the order the interviews
        were conducted in, and a flattening curve is not evidence that coding is finished.
      </p>
    ),
    'sec-limits': (
      <>
        <p>
          Frequency is not importance, and it is not a count of participants. Co-occurrence
          here is descriptive: two codes sharing a range, not a measured relationship. A
          plateau on the accumulation curve is not saturation. Those cautions are the
          workbench&rsquo;s own captions, and they apply to every number on this page.
        </p>
        <p>
          Nothing here interprets the interviews. The corpus is public and the figures are
          reproducible from it; what the passages mean is a question for the researchers who
          coded them. If you want to run the same export on your own material, the workbench
          runs locally —{' '}
          <Link href="/w">open the read-only demo</Link> or download it and code your own.
        </p>
      </>
    ),
  }

  return { sections, prose }
}

export default async function ReportPage() {
  const manifest = await readManifest()

  /* The manifest records the hash of every file at export time. It is
     re-hashed here, on every render, and a mismatch fails the page rather
     than warning: a figure on disk that the export did not produce must
     never be shown as one it did. */
  const checked = await verifyManifest()
  if (!checked.ok) {
    return (
      <div className="t7">
        <header className="report-head wrap">
          <p className="sec-no">A worked example</p>
          <h1>These figures do not match their export</h1>
          <p className="report-standfirst">
            The manifest beside the figures records the SHA-256 of every file the
            workbench export wrote. Re-hashing what is on disk disagrees, so the page
            refuses to show them. Re-run the export and try again.
          </p>
          <ul className="report-problems mono">
            {checked.problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </header>
      </div>
    )
  }

  const figures: FigureData[] = manifest.figures.map((figure) => ({
    ...figure,
    commit: manifest.commit,
  }))
  const csvs: Record<string, CsvTable> = {}
  for (const figure of manifest.figures) {
    if (!figure.error && figure.csv) {
      const rows = await readCsv(figure.csv)
      csvs[figure.kind] = { head: rows[0] ?? [], rows: rows.slice(1) }
    }
  }
  const { sections, prose } = chapters(manifest.project, figures, manifest.commit)

  return (
    <div className="t7">
      <header className="report-head wrap">
        <p className="sec-no">A worked example</p>
        <h1>Five figures, and the counts behind them</h1>
        <p className="report-standfirst">
          An example report built the way the tool builds one: figures drawn by the workbench
          from a public interview corpus, each captioned with what it counts, each with its
          numbers one click away.
        </p>
        <dl className="report-facts mono">
          <div>
            <dt>Corpus</dt>
            <dd>{manifest.project.name}</dd>
          </div>
          <div>
            <dt>Documents</dt>
            <dd>{manifest.project.documents}</dd>
          </div>
          <div>
            <dt>Codes</dt>
            <dd>{manifest.project.codes}</dd>
          </div>
          <div>
            <dt>Codings</dt>
            <dd>{manifest.project.codings}</dd>
          </div>
          <div>
            <dt>Commit</dt>
            <dd>{manifest.commit.slice(0, 12)}</dd>
          </div>
        </dl>
      </header>

      <ReportView sections={sections} figures={figures} csvs={csvs}>
        {sections.map((section) => (
          <section key={section.id} className="report-section" id={section.id}>
            {!section.id.startsWith('fig-') && (
              <h2>
                <span className="sec-no">{section.no}</span>
                {section.title}
              </h2>
            )}
            <div className="report-prose">{prose[section.id]}</div>
          </section>
        ))}
      </ReportView>
    </div>
  )
}
