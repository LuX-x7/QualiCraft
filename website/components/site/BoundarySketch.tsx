import { NOT_DOING } from '@/lib/site/content'
import SketchGlyph from './SketchGlyph'
const GLYPHS=['human','cloud','share','search']
export default function BoundarySketch() {
 return <div className="boundary-sketch"><div className="boundary-heading"><h2 id="boundary-title">What we leave out</h2></div><div className="boundary-drawings">{NOT_DOING.items.map((item,index)=><details className="boundary-drawing" key={item.name}><summary><SketchGlyph kind={GLYPHS[index]}/><span className="mono boundary-no">0{index+1}</span><strong>{item.name}</strong><span className="boundary-summary">{item.summary}</span><span className="mono boundary-open">WHY +</span></summary><div><p>{item.reason}</p></div></details>)}</div></div>
}
