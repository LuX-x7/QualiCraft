import QtMark from '@/components/QtMark'
import WorkflowShowcase from './WorkflowShowcase'
import cards from '@/lib/site/data-cards.json'
import { readSiteEvidence } from '@/lib/site/evidence'
import { DATA_SECTION, HERO, METHODS, NOT_DOING } from '@/lib/site/content'

function DataCards({ selected }: { selected: typeof cards.cards }) {
  return <ul className="cards">{selected.map(card => <li key={card.id} className="card">
    <div className="card__head"><span className="card__id mono">{card.id}</span><span className="card__licence mono"><a href={card.licence_url}>{card.licence}</a>{card.share_alike ? ' · ShareAlike' : ''}</span></div>
    <h3 className="card__title">{card.title}</h3><p className="card__meta mono">{card.author} · {card.year}{card.language ? ` · ${card.language}` : ''}</p>
    <p className="card__purpose">{card.purpose}</p><p className="card__hash mono">sha256:{card.sha256_short}{card.sha256_verified ? '' : ' (recorded)'}</p>
  </li>)}</ul>
}

export default async function HomeView() {
  const source=await readSiteEvidence().catch(()=>null)
  const example=source?.evidence?.example??null
  const manifest=source?.evidence?source.manifest:null
  const figure=manifest?.figures.find(item=>item.kind==='frequency')
  return <>
    <section className="hero hero--focused" aria-labelledby="hero-title">
      <div className="hero__ground" aria-hidden="true"/>
      <div className="wrap hero__inner">
        <div className="hero-pixels"><QtMark size={15} animate label=""/></div>
        <p className="hero__eyebrow mono">QUALICRAFT / A LOCAL RESEARCH WORKBENCH</p>
        <h1 id="hero-title" className="hero__title">Read closely.<br/><em>See the connections.</em></h1>
        <p className="hero__body">Passages, codes and themes. One traceable record.</p>
        <div className="hero__actions"><a className="btn btn--primary" href="/w?lang=en">Try the workbench ↗</a><a className="btn btn--secondary" href="/report">Explore the report →</a></div>
        <p className="hero__footnote mono">Local first · Researcher led · Public Bologna sample</p>
      </div>
      <a className="hero-scroll mono" href="#modules">FOLLOW THE RECORD ↓</a>
    </section>
    <WorkflowShowcase example={example} data={source?.workflow??{frequency:[],frequencyCredit:'',frequencyCsv:'',figures:[]}}/>
    <section className="section home-report home-report--quiet" aria-labelledby="home-report-title"><div className="wrap home-report__grid">
      <div><span className="sec-no mono">02 / THE EVIDENCE</span><h2 id="home-report-title">A pattern.<br/><em>A passage behind it.</em></h2><p>Five interactive views. Exact counts. The source within reach.</p>
        {manifest&&<dl className="home-proof"><div><dt>Interviews</dt><dd>{manifest.project.documents}</dd></div><div><dt>Defined codes</dt><dd>{manifest.project.codes}</dd></div><div><dt>Codings</dt><dd>{manifest.project.codings}</dd></div></dl>}
        <a className="quiet-link" href="/report">Read the Bologna example →</a>
      </div>
      <a className="report-invitation" href="/report#sec-frequency" aria-label="Explore the exact Bologna frequency counts">
        <span className="mono">BOLOGNA / CODE FREQUENCY</span>
        {source?.workflow.frequency.map(row=><div key={row.label} className="invitation-row"><span>{row.label}</span><div style={{width:`${Number(row.count)/Math.max(1,...source.workflow.frequency.map(item=>Number(item.count)))*100}%`}}/><strong>{row.count}</strong></div>)}
        {figure&&<span className="invitation-credit">{figure.credit}</span>}<span className="mono invitation-action">EXPLORE THE VALUES ↗</span>
      </a>
    </div></section>
    <section className="section home-notes" id="method"><div className="wrap">
      <span className="mono sec-no">03 / THE APPROACH</span><h2>Researcher-led, by design.</h2>
      <div className="principle-line mono"><span>Local files</span><span>Exact source ranges</span><span>Human decisions</span><span>Reproducible exports</span></div>
      <details className="home-details"><summary>Methods, limits &amp; references</summary><h3>{METHODS.title}</h3><p>{METHODS.body}</p>
        <div className="table-scroll"><table className="methods"><caption className="mono">Thematic analysis and qualitative content analysis</caption><thead><tr><th scope="col">Approach</th>{METHODS.columns.map(column=><th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{METHODS.rows.map(row=><tr key={row.approach}><th scope="row">{row.approach}</th>{row.cells.map((cell,index)=><td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
        <ol className="citations__list">{METHODS.citations.map(citation=><li key={citation}>{citation}</li>)}</ol>
        <h3>{NOT_DOING.title}</h3><ul className="boundary">{NOT_DOING.items.map(item=><li key={item.name}><h4>{item.name}</h4><p>{item.reason}</p><p>{item.instead}</p>{'revision' in item&&<p>{item.revision}</p>}</li>)}</ul>
        <details><summary>{NOT_DOING.scopeDecision.name}</summary><p>{NOT_DOING.scopeDecision.reason}</p></details>
      </details>
      <details className="home-details" id="data"><summary>Data, licence &amp; provenance</summary><p>{DATA_SECTION.body}</p><DataCards selected={cards.cards.filter(card=>card.file==='bologna_qda.zip')}/><details><summary>Other public importer fixtures</summary><DataCards selected={cards.cards.filter(card=>card.file!=='bologna_qda.zip')}/></details></details>
      <details className="home-details"><summary>Run locally</summary><p>{HERO.primary.disabledNote}. The source and current setup instructions are available in the <a href="https://github.com/LuX-x7/QualiCraft">project repository</a>.</p><button type="button" disabled>{HERO.primary.label}</button></details>
    </div></section>
  </>
}
