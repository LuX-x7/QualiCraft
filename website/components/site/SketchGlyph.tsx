'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Original notebook schematics: input, record and relationship rather than stock icons. */
export default function SketchGlyph({ kind, className = '' }: { kind: string; className?: string }) {
 const root=useRef<SVGSVGElement>(null),[entered,setEntered]=useState(false)
 useEffect(()=>{if(!root.current)return;const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setEntered(true);observer.disconnect()}},{threshold:.15});observer.observe(root.current);return()=>observer.disconnect()},[])
 let drawing:ReactNode
 if(kind==='import')drawing=<>
  <g className="glyph-paper"><path className="sketch-back" d="M32 33L88 29L102 43L105 118L34 123Z"/><path d="M41 26L99 25L114 41L112 116L43 118Z M99 26V42H113"/><path className="pencil-echo" d="M39 29L38 115M46 120L109 117"/><path d="M52 53L100 52M52 64H96M52 76L101 75M53 98H91"/><path className="glyph-highlight" d="M50 79L101 78L101 91L50 93Z"/></g>
  <path className="glyph-connections" d="M105 84C119 83 121 68 137 68M130 63L138 68L131 73M108 106C122 108 125 117 138 116"/>
  <g className="glyph-record"><ellipse cx="159" cy="62" rx="23" ry="9"/><path d="M136 62L137 119C139 131 180 131 182 119V62M137 81C143 91 176 91 182 81M137 101C143 110 176 110 182 101"/><path className="glyph-check" d="M149 116L156 122L171 108"/></g>
  <path className="sketch-detail" d="M43 134V144M111 129V144M43 140H111M47 137L43 140L48 143M107 137L112 140L107 143"/>
 </>
 else if(kind==='coding')drawing=<>
  <path className="sketch-back" d="M26 35L91 32L103 44L101 133L27 137Z M90 33V46H102M38 57L88 55M38 68H85M38 111L81 110M38 121H70"/>
  <path className="glyph-highlight" d="M35 78L91 76V95L35 97Z"/><path d="M42 85L84 84"/>
  <g className="glyph-connections"><path d="M92 87C110 87 102 71 121 71M115 66L123 71L116 76M144 84V108M138 101L144 109L149 102M151 125H175V51H160"/></g>
  <g className="glyph-tag"><path d="M123 56L149 55L161 70L149 85H122Z"/><circle cx="151" cy="70" r="2.5"/><path d="M131 65H143M131 73H140"/></g>
  <path d="M120 113L154 112L165 124L154 138H120Z"/><path className="pencil-echo" d="M118 115L118 140L152 141"/><path d="M128 125H151M167 39H187V143H169M171 46H181M171 135H181"/>
  <circle className="glyph-pin" cx="175" cy="95" r="3"/>
 </>
 else if(kind==='analysis'||kind==='thematic')drawing=<>
  <g className="glyph-connections"><path d="M43 43C67 42 61 69 86 68M40 91C67 91 60 69 86 68M45 135C64 134 64 112 85 111M108 68C134 68 120 90 145 90M107 112C133 113 121 90 145 90"/></g>
  <g className="glyph-paper"><path d="M26 29L46 27L54 34V52L26 54Z M32 38H46M32 44H42M24 77L45 76L52 83V102H25Z M30 86H45M30 92H40M29 120L48 119L55 127V146H29Z M34 130H47M34 137H43"/></g>
  <g className="glyph-node"><rect x="84" y="56" width="25" height="25" rx="4"/><path d="M91 68H102"/><rect x="83" y="100" width="25" height="25" rx="4"/><path d="M90 112H101"/></g>
  <g className="glyph-node glyph-node-3"><path d="M145 67L180 65L186 77L185 111L144 113Z"/><path d="M152 80H176M152 90H171M152 101H178"/></g>
  <path className="pencil-echo" d="M141 68L140 116L181 114"/><path className="sketch-detail" d="M68 143C94 155 145 153 165 127M158 131L166 126L166 136"/>
 </>
 else if(kind==='plotting'||kind==='content')drawing=<>
  <path className="sketch-back" d="M21 36L84 34L86 98H22Z"/><path className="glyph-matrix" d="M35 48V87M49 47V87M63 47V87M23 60H85M23 73H85M23 86H85"/><path className="glyph-highlight" d="M36 61H48V72H36Z M64 75H83V85H64Z"/>
  <g className="glyph-connections"><path d="M84 73L100 72M94 67L101 72L94 77M75 110C83 122 99 130 115 129"/></g>
  <path d="M102 27L181 25L183 111L102 113Z M113 101H173M113 101V40"/>
  <g className="glyph-bars"><path d="M123 100V77H134V100M142 100V61H152V100M161 100V44H171V100"/></g>
  <path className="glyph-trend" d="M120 66C137 66 147 50 167 37"/><path className="pencil-echo" d="M100 30L99 116L180 114"/>
  <g className="glyph-script"><path d="M120 124L177 122L183 130V151H120Z M133 132L128 137L133 142M168 131L174 137L169 142M149 130L145 144"/></g>
 </>
 else if(kind==='export')drawing=<>
  <g className="glyph-record"><ellipse cx="101" cy="44" rx="28" ry="10"/><path d="M73 44V80C77 95 127 95 129 80V44M74 62C82 74 122 73 128 62"/></g>
  <g className="glyph-connections"><path d="M100 91V107M34 117V107H169V117M79 107V117M123 107V117"/></g>
  <g className="glyph-box-contents"><path d="M20 119L44 117L51 125V150L20 152Z M66 119H88L95 126V151H66Z M110 119L133 118L140 125V151H110Z M154 119H176L183 126V151H154Z"/><path d="M30 128L26 134L30 140M40 128L44 134L40 140M73 130H89M73 137H89M79 125V145M116 128H134M116 135H134M116 142H134M123 123V147M162 129H176M162 136H173M162 143H170"/></g>
  <path className="pencil-echo" d="M72 42C73 27 129 27 132 43M18 123V154H47M109 154H137"/>
  <path className="glyph-check" d="M149 72L158 81L177 58"/>
 </>
 else if(kind==='cloud')drawing=<>
  <path d="M38 64C17 57 24 36 43 37C49 13 85 14 94 37C116 28 130 55 113 64Z"/><path className="glyph-strike" d="M35 76L112 21"/>
  <path d="M60 92L173 89L176 145L58 147Z M68 102H164V134H68Z M48 149L184 147L178 155H54Z"/><path d="M95 114H135V129H95Z M96 114V109H113L118 114"/><path className="sketch-detail" d="M144 73V84M140 78L144 84L148 78M32 89L32 151"/>
 </>
 else if(kind==='human')drawing=<>
  <path d="M23 49H64V87H23Z M31 60H54M31 68H50M31 77H45"/><path className="glyph-connections" d="M65 69H83M76 63L84 69L77 75M130 99L150 111"/>
  <circle cx="107" cy="48" r="17"/><path d="M79 95C79 71 135 72 135 95V122H78Z"/><path className="glyph-check" d="M91 100L103 111L122 87"/>
  <path d="M149 109H179V145H149Z M156 119H173M156 128H173M156 137H167"/><path className="pencil-echo" d="M145 110V149H176"/>
 </>
 else if(kind==='share')drawing=<>
  <path d="M27 29L72 27L84 40V102L28 105Z M72 28V41H83M39 53H72M39 65H70M39 78H64"/>
  <path className="glyph-transfer" d="M63 126C99 135 101 56 137 65M129 59L138 65L130 70"/>
  <path d="M121 78L163 76L177 90V147L121 150Z M163 78V91H176M132 104H164M132 116H159M132 128H163"/>
  <path className="sketch-detail" d="M92 29V57M92 69V95M92 110V149"/>
 </>
 else if(kind==='search')drawing=<>
  <path d="M27 29L119 26L132 42V134L28 137Z M118 28V43H131M40 55H110M40 69H105M40 112H111M40 124H90"/>
  <path className="glyph-highlight" d="M37 79L111 77V96L37 99Z"/><path d="M46 88L101 86"/>
  <circle cx="132" cy="90" r="34"/><path d="M155 115L180 143M113 75V102M150 75V102M113 74H119M145 74H151M113 103H119M145 103H151"/>
 </>
 else drawing=<>
  <path d="M32 44L115 39L129 55L128 139L32 144Z M115 40V56H128M44 69H108M44 80H99M44 92H110M44 107H83"/>
  <path className="pencil-echo" d="M26 49L26 149L122 144M40 35L110 31L120 42"/>
  <g className="glyph-connections"><path d="M129 85C145 85 135 58 151 56M129 106C145 106 137 131 152 131"/></g>
  <path d="M153 42H182V70H153Z M160 49H175M160 56H176M160 63H170M153 117H182V145H153Z"/><path className="glyph-check" d="M159 130L166 137L177 123"/>
 </>
 return <svg ref={root} className={`sketch-glyph ${className}${entered?' has-entered':''}`} data-schematic={kind} viewBox="0 0 206 176" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"><g className="glyph-datum" strokeWidth=".55" opacity=".35"><path d="M16 160H190M19 17V166M14 28H24M14 150H24M35 165V155M181 165V155"/><path strokeDasharray="2 5" d="M102 17V159M19 88H190"/><path d="M20 160A29 29 0 0 1 49 131"/></g>{drawing}<g className="glyph-fasteners" strokeWidth=".65" opacity=".5"><circle cx="19" cy="160" r="2.5"/><circle cx="188" cy="160" r="2.5"/><path d="M17 158L21 162M186 158L190 162"/></g></svg>
}
