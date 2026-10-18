import {readFile} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import path from 'node:path'

type OutputFile={path:string;bytes:number;sha256:string}
type ExampleManifest={scope:{project:{documents:number;codes:number;codings:number};notebook:{document:string;characters:number;codings:number;tree_labels:string};report:{method:string;selected_evidence:number;status:string}};files:OutputFile[]}
export async function readWorkedExample():Promise<ExampleManifest>{
  const root=path.join(process.cwd(),'public/worked-example')
  const manifest:ExampleManifest=JSON.parse(await readFile(path.join(root,'manifest.json'),'utf8'))
  for(const file of manifest.files){
    if(path.basename(file.path)!==file.path)throw Error('Invalid worked example file')
    const bytes=await readFile(path.join(root,file.path))
    if(bytes.length!==file.bytes||createHash('sha256').update(bytes).digest('hex')!==file.sha256)throw Error('Worked example integrity mismatch: '+file.path)
  }
  return manifest
}
export default function WorkedOutputs({manifest}:{manifest:ExampleManifest}){
  const scope=manifest.scope
  return <div className="worked-outputs">
    <p className="report-lead">Open the finished files.</p>
    <p>One public Bologna record: {scope.project.documents} interviews, {scope.project.codes} defined codes and {scope.project.codings} codings. These files come from the workbench’s existing exporters.</p>
    <div className="output-grid">
      <article className="output-card"><span className="mono output-number">01 / CODED SOURCE</span><h3>Tree Notebook</h3>
        <a className="output-preview" href="/worked-example/notebook.html" aria-label="Read the coded Bologna notebook"><img src="/worked-example/notebook-preview.png" alt="An actual exported Notebook page with source text, highlighted passages and the code tree" width="600" height="850"/></a>
        <p>Full {scope.notebook.document} text, {scope.notebook.codings} saved codings, highlights and their tree paths.</p>
        <div className="output-links"><a href="/worked-example/notebook.html">Read Notebook ↗</a><a href="/worked-example/notebook.docx" download>Editable Word ↓</a></div>
        <details><summary>Source scope &amp; tree labels</summary><p>{scope.notebook.characters.toLocaleString('en')} characters. {scope.notebook.tree_labels}</p></details>
      </article>
      <article className="output-card"><span className="mono output-number">02 / RESEARCH WRITING</span><h3>Research report</h3>
        <a className="output-preview" href="/worked-example/research-report.html" aria-label="Read the Bologna Research report"><img src="/worked-example/report-preview.png" alt="An actual Research report page showing its selected method and process map" width="600" height="850"/></a>
        <p>{scope.report.method}, method map, an Analysis Table, illustrative Narrative Analysis and five figures.</p>
        <div className="output-links"><a href="/worked-example/research-report.html">Read report ↗</a><a href="/worked-example/research-report.docx" download>Editable Word ↓</a><a href="/worked-example/research-report.zip" download>Complete report ZIP ↓</a></div>
      </article>
      <article className="output-card output-card--compact"><span className="mono output-number">03 / FIGURES AND RECIPES</span><h3>Five figures. Exact counts.</h3><p>SVG, PDF and 300 dpi PNG for each figure, with its CSV and standalone Python script. Extract the ZIP before running the code.</p><div className="output-links"><a href="#sec-frequency">Explore figures ↓</a><a href="/worked-example/figures-and-code.zip" download>Five figures &amp; code ZIP ↓</a></div></article>
      <article className="output-card output-card--compact"><span className="mono output-number">04 / CONTINUE THE PROJECT</span><h3>Restore and edit locally</h3><p>Project JSON preserves all {scope.project.documents} source documents, original coding and the saved example report. Restore it as a new local project.</p><div className="output-links"><a href="/worked-example/project.json" download>Project JSON ↓</a><a href="https://github.com/LuX-x7/QualiCraft#local-installation">Local setup ↗</a></div></article>
    </div>
    <p className="output-scope">{scope.report.status} Word text and tree labels are editable; editing Word does not update QT. The five figures cover the whole corpus; the Notebook covers one complete interview. <a href="/worked-example/manifest.json">File hashes &amp; source record ↗</a></p>
  </div>
}
