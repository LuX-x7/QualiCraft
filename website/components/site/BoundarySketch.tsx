import { NOT_DOING } from '@/lib/site/content'
import SketchGlyph from './SketchGlyph'
const GLYPHS=['human','cloud','share','search']
export default function BoundarySketch() {
 return <div className="boundary-sketch"><div className="boundary-heading"><span className="sec-no mono">05 / WHAT WE LEAVE OUT</span><h2 id="boundary-title">Less to navigate.<br/><em>More room to think.</em></h2><p>Keep the mechanics clear. Keep judgement with the researcher.</p></div><div className="boundary-drawings">{NOT_DOING.items.map((item,index)=><details className="boundary-drawing" key={item.name}><summary><SketchGlyph kind={GLYPHS[index]}/><span className="mono boundary-no">0{index+1}</span><strong>{item.name}</strong><span className="boundary-summary">{item.summary}</span><span className="mono boundary-open">WHY +</span></summary><div>{'struckReason' in item&&<p><s>{item.struckReason}</s></p>}{'revision' in item&&<p>{item.revision}</p>}<p>{item.reason}</p><p>{item.instead}</p></div></details>)}</div></div>
}
