import {siteUrl,externalWorkbench} from '@/lib/site/url'
export const metadata={title:'Help · QT',description:'Start a project, code a passage and keep your results.'}
export default function HelpPage(){return <section className="section help-page" aria-labelledby="help-title"><div className="wrap">
 <header className="sec-head"><h1 id="help-title">Help</h1><p>Start small. Keep your decisions with the evidence.</p></header>
 <ol className="help-start"><li><h2>Open a project</h2><p>{externalWorkbench?'Sign in, or register with an invitation, a username and a password of at least six characters.':'Run QT locally, or explore the public read-only demo.'} Choose your project or an editable Bologna copy in the full workspace.</p></li>
 <li><h2>Import and code</h2><p>Import TXT or DOCX, or paste text. Select a passage, choose or create a code, then review its saved path. You do not need every optional tool.</p></li>
 <li><h2>Keep your work</h2><p>Export the highlighted notebook, editable Research report, figures with code, and project JSON. JSON restores a separate project; Word edits stay in Word.</p></li></ol>
 <div className="help-questions">
 <details><summary>Where is my interview stored?</summary><p>In local use, projects stay on your machine. In the online workspace, projects are saved in your private account on the QT server. Uploading to the online workspace is not local-only storage.</p></details>
 <details><summary>Does AI code automatically?</summary><p>No. You can connect a compatible LLM API, preview the request and confirm sending. The provider receives the selected content in that request. Suggestions become saved codings only when you accept them.</p></details>
 <details><summary>Can my faculty provide an API?</summary><p>A compatible institutional endpoint can be configured as a model endpoint if your institution allows it. QT does not currently provide faculty-wide accounts, shared billing or a managed shared API key. Keep keys out of exports and public pages.</p></details>
 <details><summary>Can several people edit together?</summary><p>Simultaneous editing of one shared project is not supported. Share an export for review or restore project JSON as a separate copy. Separate accounts do not share a project automatically.</p></details>
 <details><summary>Why is a figure unavailable?</summary><p>Open Figures and choose a figure type. A view may need saved codings, a hierarchy or overlapping code ranges. Read its empty-state message; do not treat missing evidence as a zero result. If generation fails, report the figure type and error message.</p></details>
 <details><summary>Why is the example in Italian?</summary><p>The current worked example preserves the public Bologna source and its saved coding. An English teaching example is planned; it will clearly identify any translation and retain the source record.</p><a href={siteUrl('/sources')}>Inspect sources and licences →</a></details>
 </div><p><a className="btn btn--primary" href={siteUrl('/w?lang=en')}>Open the workbench ↗</a>{' '}<a className="quiet-link" href="https://github.com/LuX-x7/QualiCraft/issues">Report a problem ↗</a></p>
 </div></section>}
