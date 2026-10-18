
import {siteUrl} from '@/lib/site/url'
import maps from '@/lib/site/method-maps.json'

/** Generated semantic source; the saved report freezes its own version. */
export default function MethodProcess({ method }: { method: keyof typeof maps }) {
  const map = maps[method]
  return <div className="site-method-map">
    <h3>{map.name}</h3>
    <p className="mono">METHOD MAP M1 · v{map.version}</p>
    <p>Procedure overview, not a completion record. Document your chosen approach and decisions.</p>
    <ol aria-label={`${map.name} process steps`}>{map.steps.map(step => <li key={step.id}>
      <span className="mono" aria-hidden="true">{String(step.id).padStart(2, '0')}</span>
      <div><strong>{step.title}</strong><p>{step.detail}</p></div>
    </li>)}</ol>
    <p className="site-method-return">Revisit {map.links.slice(5).map(([a,b]) => `${String(a).padStart(2, '0')} → ${String(b).padStart(2, '0')}`).join(' · ')}</p>
    <p>{map.note}</p>
    <p className="site-method-sources">{map.references.map(ref => <a key={ref.url} href={siteUrl(ref.url)}>{ref.title} ↗</a>)}</p>
    <p>Save this method and map with your Research report in Export. HTML, editable Word and the report ZIP keep that saved version. Word edits stay in Word.</p>
  </div>
}
