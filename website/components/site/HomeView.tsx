
import {siteUrl,externalWorkbench} from '@/lib/site/url'
import {readFile} from 'node:fs/promises'
import path from 'node:path'
import {originalHeatmap,type OriginalHeatmap} from '@/lib/site/original-heatmap'
import {buildChartModel} from '@/lib/report/chart-model'
import OrbitMark from './OrbitMark'
import WorkflowShowcase from './WorkflowShowcase'
import MethodSketch from './MethodSketch'
import ModuleAtlas from './ModuleAtlas'
import BoundarySketch from './BoundarySketch'
import { readCsv } from '@/lib/report/read'
import type { ChartTable } from '@/lib/report/chart-model'
import { readSiteEvidence } from '@/lib/site/evidence'
import { METHODS, NOT_DOING } from '@/lib/site/content'

export default async function HomeView() {
  const source=await readSiteEvidence().catch(()=>null)
  const example=source?.teachingEvidence?.example??null
  const analysisExample=source?.evidence?.example??source?.network?.[0]??null
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
    <section id="top" className="hero hero--focused" aria-labelledby="hero-title">
      <div className="hero__ground" aria-hidden="true"/>
      <div className="wrap hero__composition"><OrbitMark/><div className="hero__inner">
        <h1 id="hero-title" className="hero__title">Build your research.<br/><em>Block by block.</em></h1>
        <p className="hero__body">A workspace for qualitative research. Your passages, codes and decisions.</p>
        <div className="hero__actions"><a className="btn btn--primary" href={siteUrl("/w?lang=en")}>Try the workbench ↗</a><a className="btn btn--secondary" href={siteUrl("/report#sec-outputs")}>View worked example →</a></div>
        <p className="hero__footnote mono">{externalWorkbench?'Full online workspace · Upload, code, save and export':'Bologna example · Your own files in the local workbench'}</p>
      </div></div>
      <a className="hero-scroll mono" href={siteUrl("#modules")}>FOLLOW THE RECORD ↓</a>
    </section>
    <section className="section home-atlas" id="modules" aria-labelledby="atlas-title"><div className="wrap"><ModuleAtlas/></div></section>
    <WorkflowShowcase heatmaps={heatmaps} records={source?.network??[]} teachingRecords={source?.teachingNetwork??[]} example={example} analysisExample={analysisExample} data={source?.workflow??{frequency:[],frequencyCredit:'',frequencyCsv:'',figures:[]}} charts={charts}/>
    <section className="section home-method" id="method" aria-labelledby="method-title"><div className="wrap">
      <MethodSketch/>

      <details className="home-details"><summary>Full comparison &amp; references</summary><h3>{METHODS.title}</h3><p>{METHODS.body}</p>
        <div className="table-scroll"><table className="methods"><caption className="mono">Thematic analysis, qualitative content analysis and Comparative QCA</caption><thead><tr><th scope="col">Approach</th>{METHODS.columns.map(column=><th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{METHODS.rows.map(row=><tr key={row.approach}><th scope="row">{row.approach}</th>{row.cells.map((cell,index)=><td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
        <ol className="citations__list">{METHODS.citations.map(citation=><li key={citation}>{citation}</li>)}</ol>
      </details>
    </div></section>
    <section className="section home-boundary" id="boundaries" aria-labelledby="boundary-title"><div className="wrap">
      <BoundarySketch/>
      <details className="home-details"><summary>{NOT_DOING.scopeDecision.name}</summary><p>{NOT_DOING.scopeDecision.reason}</p></details>
    </div></section>
  </div>
}
