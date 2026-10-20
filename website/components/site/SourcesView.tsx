import {siteUrl} from '@/lib/site/url'
import ProvenanceSketch from './ProvenanceSketch'
import cards from '@/lib/site/data-cards.json'
import {DATA_SECTION} from '@/lib/site/content'
import {readSiteEvidence} from '@/lib/site/evidence'

export default async function SourcesView(){
 const source=await readSiteEvidence().catch(()=>null)
 return <section className="section sources-page" aria-labelledby="source-title"><div className="wrap">
  <ProvenanceSketch project={source?.manifest.project}/>
  <div className="source-records"><h2>Data sources &amp; licences</h2><p>{DATA_SECTION.body}</p>
   <ul className="cards">{cards.cards.map(card=><li key={card.id} className="card">
    <div className="card__head"><span className="card__id mono">{card.id}</span><a href={siteUrl(card.licence_url)}>{card.licence}{card.share_alike?' · ShareAlike':''}</a></div>
    <h3 className="card__title">{card.title}</h3><p className="card__meta mono">{card.author} · {card.year} · {card.language}</p>
    <p>{card.purpose}</p><p className="card__hash mono">sha256:{card.sha256_short}{card.sha256_verified?'':' (recorded)'}</p>
   </li>)}</ul>
  </div>
 </div></section>
}
