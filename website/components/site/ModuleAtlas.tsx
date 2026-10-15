import { MODULES } from '@/lib/site/content'
import SketchGlyph from './SketchGlyph'

export default function ModuleAtlas() {
  return <div className="module-atlas">
    <div className="atlas-heading"><span className="sec-no mono">01 / THE WORKFLOW</span><h2 id="atlas-title">Five steps. <em>Your workflow.</em></h2><p>A small core. Use the tools that help.</p></div>
    <ol className="atlas-blocks">{MODULES.map(item=><li key={item.key}><a className={`atlas-block atlas-block--${item.key}`} href={`#story-${item.key}`}><SketchGlyph kind={item.key}/><span className="atlas-caption"><span className="mono">{item.no}</span><strong>{item.title}</strong><span aria-hidden="true">↘</span></span></a></li>)}</ol>
    <p className="atlas-instruction mono">HOVER TO EXPLORE · SELECT TO FOLLOW A STEP</p>
    <details className="atlas-options"><summary>What can I switch on or off?</summary><p>These are five workflow steps. Inside the workbench, configure theme grouping, memos, AI suggestions, Insights, Audit and Figures in Tools → Capability blocks. Core documents, codes and codings remain available. AI still requires configuration, request preview and confirmation.</p><a href="/w?lang=en">Configure your workspace ↗</a></details>
  </div>
}
