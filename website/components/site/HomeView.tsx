import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {originalHeatmap,type OriginalHeatmap} from '@/lib/site/original-heatmap'
import {buildChartModel} from '@/lib/report/chart-model'
import OrbitMark from './OrbitMark'
import WorkflowShowcase from './WorkflowShowcase'
import MethodSketch from './MethodSketch'
import ModuleAtlas from './ModuleAtlas'
import BoundarySketch from './BoundarySketch'
import ProvenanceSketch from './ProvenanceSketch'
import { readCsv } from '@/lib/report/read'
import type { ChartTable } from '@/lib/report/chart-model'
import cards from '@/lib/site/data-cards.json'
import { readSiteEvidence } from '@/lib/site/evidence'
import { DATA_SECTION, METHODS, NOT_DOING } from '@/lib/site/content'

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
  const charts: Record<string, ChartTable> = {},heatmaps:Record<string,OriginalHeatmap>={}
  if(source?.evidence) for(const figure of source.workflow.figures){
    const [head,...rows]=await readCsv(figure.csv);charts[figure.kind]={head,rows}
    if(['coverage','cooccurrence'].includes(figure.kind))try{
      const svg=await readFile(path.join(process.cwd(),'public/report',figure.svg),'utf8')
      const digest=source.manifest.files.find(file=>file.path===figure.svg)?.sha256??''
      heatmaps[figure.kind]=originalHeatmap(svg,figure.kind,buildChartModel(figure.kind,charts[figure.kind]),digest)
    }catch{/* A failed mapping leaves counts and the original image available. */}
  }
  return <div className="home-page">
    <section className="hero hero--focused" aria-labelledby="hero-title">
      <div className="hero__ground" aria-hidden="true"/>
      <div className="wrap hero__composition"><OrbitMark/><div className="hero__inner">
        <p className="hero__eyebrow mono">QT / A LOCAL RESEARCH WORKBENCH</p>
        <h1 id="hero-title" className="hero__title">Read closely.<br/><em>See the connections.</em></h1>
        <p className="hero__body">Passages, codes and themes. One traceable record.</p>
        <div className="hero__actions"><a className="btn btn--primary" href="/w?lang=en">Try the workbench ↗</a></div>
        <p className="hero__footnote mono">Local files · Human decisions</p>
      </div></div>
      <a className="hero-scroll mono" href="#modules">FOLLOW THE RECORD ↓</a>
    </section>
    <section className="section home-atlas" id="modules" aria-labelledby="atlas-title"><div className="wrap"><ModuleAtlas/></div></section>
    <WorkflowShowcase heatmaps={heatmaps} records={source?.network??[]} example={example} data={source?.workflow??{frequency:[],frequencyCredit:'',frequencyCsv:'',figures:[]}} charts={charts}/>
    <section className="section home-source" id="data" aria-labelledby="source-title"><div className="wrap">
      <ProvenanceSketch project={manifest?.project}/>
      <details className="home-details"><summary>Data cards &amp; licences</summary><p>{DATA_SECTION.body}</p><DataCards selected={cards.cards.filter(card=>card.file==='bologna_qda.zip')}/><details><summary>Other public importer fixtures</summary><DataCards selected={cards.cards.filter(card=>card.file!=='bologna_qda.zip')}/></details></details>
    </div></section>
    <section className="section home-method" id="method" aria-labelledby="method-title"><div className="wrap">
      <MethodSketch/>
      <details className="home-details"><summary>Planned / unavailable · QCA &amp; report writing</summary><dl className="method-plans">{METHODS.planned.map(item=><div key={item.name}><dt>{item.name}</dt><dd>{item.detail}</dd></div>)}</dl></details>
      <details className="home-details"><summary>Full comparison &amp; references</summary><h3>{METHODS.title}</h3><p>{METHODS.body}</p>
        <div className="table-scroll"><table className="methods"><caption className="mono">Thematic analysis and qualitative content analysis</caption><thead><tr><th scope="col">Approach</th>{METHODS.columns.map(column=><th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{METHODS.rows.map(row=><tr key={row.approach}><th scope="row">{row.approach}</th>{row.cells.map((cell,index)=><td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
        <ol className="citations__list">{METHODS.citations.map(citation=><li key={citation}>{citation}</li>)}</ol>
      </details>
    </div></section>
    <section className="section home-boundary" id="boundaries" aria-labelledby="boundary-title"><div className="wrap">
      <BoundarySketch/>
      <details className="home-details"><summary>{NOT_DOING.scopeDecision.name}</summary><p>{NOT_DOING.scopeDecision.reason}</p></details>
    </div></section>
  </div>
}
