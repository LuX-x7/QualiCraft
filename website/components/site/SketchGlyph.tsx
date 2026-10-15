import type { ReactNode } from 'react'

/** Original line drawings. Moving parts are semantic groups, not raster frames. */
export default function SketchGlyph({ kind, className = '' }: { kind: string; className?: string }) {
  let drawing: ReactNode
  if (kind === 'import') drawing = <>
    <path className="sketch-back" d="M31 100L44 84H153L173 103V139L31 141Z"/>
    <g className="glyph-paper"><path d="M69 24L125 22L145 44L144 116L67 118Z"/><path d="M125 23V45H144M79 57L132 56M79 69H130M79 81L122 82M80 94H111"/></g>
    <path className="sketch-front" d="M31 104L71 103L78 116H126L134 103L173 104L171 141L32 140Z"/>
    <path className="sketch-detail" d="M20 150H185M20 146V154M185 146V154"/>
  </>
  else if (kind === 'coding') drawing = <>
    <path d="M40 29L140 27L157 45L155 142L41 143Z"/><path d="M140 28V45H156M55 53H129M55 71H137M55 89L123 88M55 109H135M55 126H100"/>
    <path className="glyph-highlight" d="M52 83L132 81L132 96L52 98Z"/>
    <g className="glyph-tag"><path d="M115 111L142 86L179 121L152 149Z"/><circle cx="143" cy="101" r="3"/><path d="M141 118L159 136M135 124L150 139"/></g>
  </>
  else if (kind === 'analysis') drawing = <>
    <g className="glyph-connections"><path d="M102 41L53 89L101 133L156 86Z M102 41V133M53 89L156 86"/></g>
    {[[102,41],[53,89],[101,133],[156,86]].map(([x,y],i)=><g key={i} className={`glyph-node glyph-node-${i}`}><rect x={x-13} y={y-11} width="26" height="23" rx="3"/><path d={`M${x-6} ${y}H${x+6}`}/></g>)}
    <path className="sketch-detail" d="M26 153H181"/>
  </>
  else if (kind === 'plotting') drawing = <>
    <path d="M34 28L171 27L172 142L33 143Z M47 126H158M48 126V45"/>
    <g className="glyph-bars"><path d="M64 126V94H82V126M96 126V73H114V126M128 126V49H146V126"/></g>
    <path className="glyph-trend" d="M61 86L99 58L138 39"/><path className="sketch-detail" d="M26 152H182M26 148V156M182 148V156"/>
  </>
  else if (kind === 'export') drawing = <>
    <g className="glyph-box-contents"><path d="M77 44L119 43L133 57V101H76Z M119 44V58H132M86 70H123M86 81H118"/></g>
    <g className="glyph-lid-left"><path d="M37 82L102 62L103 93L39 113L21 95Z"/></g>
    <g className="glyph-lid-right"><path d="M103 62L166 82L183 96L168 113L103 93Z"/></g>
    <path className="sketch-front" d="M39 91L103 110L168 91L167 139L104 159L39 139Z M104 111V158"/>
    <path className="sketch-detail" d="M51 122L76 130M51 131L68 137"/>
  </>
  else if (kind === 'cloud') drawing = <><path d="M40 115C13 103 26 71 49 74C50 33 112 26 126 65C166 45 188 98 153 115Z"/><path className="glyph-strike" d="M38 141L163 36"/><rect x="82" y="99" width="40" height="43" rx="3"/><path d="M92 99V85C92 70 112 71 112 85V99"/></>
  else if (kind === 'human') drawing = <><circle cx="101" cy="45" r="20"/><path d="M65 101C65 72 139 72 139 101V145H65Z"/><path className="glyph-check" d="M82 112L96 127L125 96"/></>
  else if (kind === 'share') drawing = <><path d="M33 42H77L88 55V117H33Z M77 43V56H88M123 65H167L179 78V140H123Z M167 66V79H178"/><path className="glyph-transfer" d="M73 136H111V40H153M142 31L154 40L142 50"/></>
  else if (kind === 'search') drawing = <><circle cx="89" cy="77" r="46"/><path d="M121 111L163 151M64 65H111M64 80H109M64 95H99"/><path className="glyph-highlight" d="M60 73H114V87H60Z"/></>
  else drawing = <><path d="M42 42L153 38L168 53L165 144L42 147Z M55 28L143 26L155 39M66 15L132 14L143 27"/><path className="glyph-check" d="M74 93L94 112L134 66"/><path className="sketch-detail" d="M58 129H132"/></>
  return <svg className={`sketch-glyph ${className}`} viewBox="0 0 206 176" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{drawing}</svg>
}
