import SketchGlyph from './SketchGlyph'
export default function MethodSketch() {
 return <div className="method-sketch"><header><span className="sec-no mono">04 / TWO APPROACHES</span><h2 id="method-title">One record.<br/><em>Two ways to read it.</em></h2></header><div className="method-paths">
  <details className="method-path"><summary><div className="method-drawing"><SketchGlyph kind="analysis"/><span className="method-handnote mono">PASSAGES → CODES → THEMES</span></div><span className="mono">TA / THEMATIC ANALYSIS</span><strong>Interpret patterns of meaning.</strong><span>Keep the connections. Write the interpretation.</span></summary><p>The workbench records passages, codes, themes and memos. Reflexive interpretation and writing remain the researcher’s work.</p></details>
  <details className="method-path"><summary><div className="method-drawing"><SketchGlyph kind="plotting"/><span className="method-handnote mono">CATEGORIES × CASES → COUNTS</span></div><span className="mono">CA / CONTENT ANALYSIS</span><strong>Inspect categories and counts.</strong><span>Read recorded coding activity in context.</span></summary><p>The workbench supports descriptive counts and a document-by-code matrix. It does not calculate inter-coder agreement; a count alone does not establish importance.</p></details>
 </div></div>
}
