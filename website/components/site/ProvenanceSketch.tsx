
import {siteUrl} from '@/lib/site/url'
import cards from '@/lib/site/data-cards.json'
import type { Manifest } from '@/lib/report/read'
import SketchGlyph from './SketchGlyph'
export default function ProvenanceSketch({project}:{project:Manifest['project']|undefined}) {
 const card=cards.cards.find(item=>item.file==='bologna_qda.zip')
 if(!card)return null
 return <div className="provenance-sketch"><header><span className="sec-no mono">03 / THE SOURCE</span><h2 id="source-title">A record you can check.</h2><p>From a public archive to inspectable evidence.</p></header>
   <div className="provenance-chain">
    <details className="provenance-stop"><summary><SketchGlyph kind="archive"/><span className="mono">01 / PUBLIC SOURCE</span><strong>Bologna</strong><span>{card.licence}</span></summary><div><h3>{card.title}</h3><p>{card.author} · {card.year} · {card.language}</p><p>{card.purpose}</p><a href={siteUrl(`https://doi.org/${card.doi}`)}>Dataset record ↗</a>{' · '}<a href={siteUrl(card.licence_url)}>{card.licence}</a><p className="mono provenance-hash">Archive SHA-256 · {card.sha256_short}</p></div></details>
    <span className="provenance-arrow" aria-hidden="true">→</span>
    <details className="provenance-stop"><summary><SketchGlyph kind="coding"/><span className="mono">02 / LOCAL RECORD</span><strong>Source → code → theme</strong><span>{project?`${project.documents} interviews · ${project.codes} codes · ${project.codings} codings`:'Verified example'}</span></summary><div><p>The original Italian text, saved code paths and character ranges remain inspectable. This is the existing Bologna coding record, not a new analysis.</p><a href={siteUrl("/w?lang=en")}>Inspect the record ↗</a></div></details>
    <span className="provenance-arrow" aria-hidden="true">→</span>
    <details className="provenance-stop"><summary><SketchGlyph kind="plotting"/><span className="mono">03 / CHECKABLE EXPORTS</span><strong>Figure + counts + code</strong><span>Original SVG · CSV · generation script</span></summary><div><p>The report verifies exported files against the manifest. Explore a value, inspect the complete table and keep the original figure.</p><a href={siteUrl("/report")}>Read the example ↗</a>{' · '}<a href={siteUrl("/report/manifest.json")}>File hashes ↗</a></div></details>
   </div>
 </div>
}
