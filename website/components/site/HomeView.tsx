import QtMark from '@/components/QtMark'
import ModuleWalkthrough from '@/components/site/ModuleWalkthrough'
import cards from '@/lib/site/data-cards.json'
import { readSiteEvidence } from '@/lib/site/evidence'
import { DATA_SECTION, HERO, METHODS, NOT_DOING } from '@/lib/site/content'

function DataCards({ selected }: { selected: typeof cards.cards }) {
  return <ul className="cards">{selected.map(card => <li key={card.id} className="card">
    <div className="card__head"><span className="card__id mono">{card.id}</span><span className="card__licence mono"><a href={card.licence_url} rel="noopener noreferrer" target="_blank">{card.licence}</a>{card.share_alike ? ' · ShareAlike' : ''}</span></div>
    <h3 className="card__title">{card.title}</h3><p className="card__meta mono">{card.author} · {card.year}{card.language ? ` · ${card.language}` : ''}</p>
    <p className="card__purpose">{card.purpose}</p><p className="card__hash mono" title={`SHA-256 of ${card.file}`}>sha256:{card.sha256_short}{card.sha256_verified ? '' : ' (recorded)'}</p>
  </li>)}</ul>
}

export default async function HomeView() {
  const source = await readSiteEvidence().catch(() => null)
  const evidence = source?.evidence ?? null
  const manifest = evidence ? source!.manifest : null
  const figure = manifest?.figures.find(f => f.kind === 'frequency')
  return <>
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__ground" aria-hidden="true" />
      <div className="wrap hero__inner">
        <p className="hero__eyebrow mono">01 · {HERO.eyebrow}</p>
        <h1 id="hero-title" className="hero__title"><QtMark size={8} animate label="" /><span>{HERO.headline[0]}<br />{HERO.headline[1]}</span></h1>
        <p className="hero__body">{HERO.body}</p>
        <div className="hero__actions"><a className="btn btn--primary" href={HERO.secondary.href}>{HERO.secondary.label}</a><a className="btn btn--secondary" href={HERO.report.href}>{HERO.report.label}</a></div>
        <p className="hero__footnote">{HERO.footnote} <span className="hero__load-note">{HERO.secondary.note}</span></p>
        <div className="hero__download"><button type="button" disabled aria-disabled="true">{HERO.primary.label}</button><span className="mono">{HERO.primary.disabledNote}</span></div>
      </div>
    </section>

    <ModuleWalkthrough example={evidence?.example ?? null} data={source?.workflow ?? {frequency:[],frequencyCredit:'',frequencyCsv:'',figures:[]}} />

    <section className="section home-report" aria-labelledby="home-report-title">
      <div className="wrap home-report__grid"><div><span className="sec-no">03</span><h2 id="home-report-title">A figure you can question.</h2>
        <p>Read the same coding record through five views. Each chapter keeps the question, original figure, exact counts and limits together.</p>
        {manifest && <dl className="home-proof"><div><dt>Documents</dt><dd>{manifest.project.documents}</dd></div><div><dt>Defined codes</dt><dd>{manifest.project.codes}</dd></div><div><dt>Codings</dt><dd>{manifest.project.codings}</dd></div></dl>}
        <p>The counts describe coding activity. They do not measure importance, participant agreement or the strength of an interpretation.</p>
        <a className="btn" href="/report">Inspect figures, counts and methods →</a>
      </div><div>{figure ? <figure className="home-figure">
        {/* The unchanged workbench export; its unit sentence comes from the manifest. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <a href="/report#sec-frequency"><img src={`/report/${figure.svg}`} alt="Code frequency in the existing Bologna export; open the report to inspect its values." width="1000" height="700" loading="lazy" /></a>
        <figcaption><span className="mono">FIG.01 · {figure.label}</span><br />{figure.credit}</figcaption>
      </figure> : <p role="status">The exported example could not be verified. Its provenance must be checked before figures or source illustrations are shown.</p>}</div></div>
    </section>

    <section className="section" id="method" aria-labelledby="method-title"><div className="wrap">
      <div className="sec-head"><span className="sec-no">04</span><h2 id="method-title">{METHODS.title}</h2><p>{METHODS.body}</p></div>
      <div className="method-summaries"><article><h3>Thematic analysis</h3><p>Develop and revise interpretations across the material. Codes and quotations support the account; a theme needs your definition and written argument.</p></article>
        <article><h3>Qualitative content analysis</h3><p>Define coding units and categories, then inspect their recorded frequencies and distribution. The workbench supports these counts directly; it does not compute agreement across coders.</p></article></div>
      <details className="home-details"><summary>Compare both methods and references</summary><div className="table-scroll"><table className="methods"><caption className="mono">TABLE.01 · Thematic analysis and qualitative content analysis, on the same axes</caption>
        <thead><tr><th scope="col">Approach</th>{METHODS.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
        <tbody>{METHODS.rows.map(row => <tr key={row.approach}><th scope="row">{row.approach}</th>{row.cells.map((cell,index) => <td key={index}>{cell}</td>)}</tr>)}</tbody>
      </table></div><div className="citations"><p className="citations__label mono">References</p><ol className="citations__list">{METHODS.citations.map(citation => <li key={citation}>{citation}</li>)}</ol></div></details>
    </div></section>

    <section className="section" id="boundary" aria-labelledby="boundary-title"><div className="wrap">
      <div className="sec-head"><span className="sec-no">05</span><h2 id="boundary-title">{NOT_DOING.title}</h2><p>{NOT_DOING.body}</p></div>
      <ul className="boundary">{NOT_DOING.items.map(item => <li className="boundary__item" key={item.name}><h3>{item.name}</h3><p>{item.summary}</p>
        <details><summary>Reason and alternatives</summary>{'struckReason' in item && <p className="boundary__struck"><s>{item.struckReason}</s></p>}{'revision' in item && <p className="boundary__revision">{item.revision}</p>}<p>{item.reason}</p><p className="boundary__instead mono">If you need it: <span className="boundary__instead-body">{item.instead}</span></p></details>
      </li>)}</ul><details className="home-details"><summary>{NOT_DOING.scopeDecision.name}</summary><p>{NOT_DOING.scopeDecision.reason}</p></details>
    </div></section>

    <section className="section" id="data" aria-labelledby="data-title"><div className="wrap">
      <div className="sec-head"><span className="sec-no">06</span><h2 id="data-title">{DATA_SECTION.title}</h2><p>{DATA_SECTION.body}</p></div>
      <DataCards selected={cards.cards.filter(card => card.file === 'bologna_qda.zip')} />
      <details className="home-details"><summary>Other public importer fixtures</summary><DataCards selected={cards.cards.filter(card => card.file !== 'bologna_qda.zip')} /></details>
    </div></section>
  </>
}
