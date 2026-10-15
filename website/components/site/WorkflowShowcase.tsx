'use client'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { MODULES } from '@/lib/site/content'
import { CLIPS } from '@/lib/site/clips'
import { pickStoryIndex } from '@/lib/site/scroll-story'
import type { ChartTable } from '@/lib/report/chart-model'
import SketchScene from './SketchScene'
import PlotSketch from './PlotSketch'
import { RecordedExample } from './ModuleWalkthrough'
import type { CodingExample } from './CodingEvidence'
import type { WorkflowData } from './WorkflowIllustration'
import { useReducedMotion } from './MotionPreference'

const COPY = [
 ['Start with the source.','Bring a document into a readable local workspace. Preserve its wording and source ranges.'],
 ['A passage. A code. A theme.','Highlight the original words, name a code and follow its complete theme path. Every connection stays inspectable.'],
 ['Look through the connections.','Move between themes, codes and their source passages. Read the evidence before interpreting a pattern.'],
 ['A pattern. A passage behind it.','Read five views of the same record. Keep exact counts, original figures and the code that generated them.'],
 ['Take the record with you.','Choose a project, coding table, matrix or methods record. Each file has a clear purpose.'],
]
function StoryArt({kind,reduced,inline=false,children}:{kind:string;reduced:boolean;inline?:boolean;children:ReactNode}) {
 const [entered,setEntered]=useState(false),root=useRef<HTMLDivElement>(null)
 useEffect(()=>{if(!root.current)return;const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setEntered(true);observer.disconnect()}},{threshold:.12});observer.observe(root.current);return()=>observer.disconnect()},[])
 return <div ref={root} className={`story-art${inline?' story-inline':''} story-art--${kind}${reduced||!entered?' is-static':''}`}>{children}</div>
}
export default function WorkflowShowcase({example,data,charts}:{example:CodingExample|null;data:WorkflowData;charts:Record<string,ChartTable>}) {
 const [active,setActive]=useState(0),[compact,setCompact]=useState(false),[replay,setReplay]=useState(0)
 const reduced=useReducedMotion()
 const sections=useRef<Array<HTMLElement|null>>([]),buttons=useRef<Array<HTMLButtonElement|null>>([])
 const stage=useRef<HTMLElement>(null),hold=useRef(0)
 useEffect(()=>{
  const media=window.matchMedia('(max-width: 800px)')
  const update=()=>setCompact(media.matches);update();media.addEventListener('change',update)
  return()=>media.removeEventListener('change',update)
 },[])
 useEffect(()=>{
  if(compact)return
  let frame=0
  const pick=()=>{frame=0;if(performance.now()<hold.current)return;const index=pickStoryIndex(sections.current.map(el=>({top:el?.getBoundingClientRect().top??Infinity})),innerHeight*.46);if(index>=0)setActive(index)}
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(pick)}
  const release=(event:Event)=>{if((event.target as Element)?.closest?.('.story-stage'))return;hold.current=0;schedule()}
  const observer=new IntersectionObserver(schedule,{rootMargin:'-32% 0px -46% 0px',threshold:0})
  sections.current.forEach(el=>{if(el)observer.observe(el)})
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule)
  window.addEventListener('wheel',release,{passive:true});window.addEventListener('touchmove',release,{passive:true});schedule()
  return()=>{observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);window.removeEventListener('wheel',release);window.removeEventListener('touchmove',release)}
 },[compact])
 const visit=useCallback((index:number,focus=false)=>{
  const next=Math.max(0,Math.min(index,MODULES.length-1));hold.current=performance.now()+1000;setActive(next)
  sections.current[next]?.scrollIntoView({block:'center',behavior:'instant'});if(focus)buttons.current[next]?.focus({preventScroll:true})
 },[])
 const keyboard=(event:KeyboardEvent<HTMLButtonElement>,index:number)=>{
  if(!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(event.key))return
  event.preventDefault();visit(event.key==='Home'?0:event.key==='End'?4:index+(['ArrowDown','ArrowRight'].includes(event.key)?1:-1),true)
 }
 const render=(index:number)=>MODULES[index].key==='plotting'?<PlotSketch data={data} charts={charts}/>:<SketchScene kind={MODULES[index].key} example={example}/>
 const item=MODULES[active]
 return <section className="scroll-story section" id="workflow" aria-labelledby="story-title"><div className="wrap">
   <header className="story-heading"><span className="sec-no mono">02 / FOLLOW THE RECORD</span><h2 id="story-title">One workflow.<br/><em>Every connection in view.</em></h2><p>Scroll the story. Explore the drawing.</p></header>
   <div className="story-layout">
    {!compact&&<aside ref={stage} className="story-stage" aria-label={`${item.title} interactive illustration`} onFocusCapture={()=>{hold.current=Infinity}} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node)){hold.current=0}}}>
      <div className="story-stage-head mono"><span>{item.no} / {item.title.toUpperCase()}</span><span>BOLOGNA · CC0</span></div>
      <StoryArt key={`${item.key}-${replay}`} kind={item.key} reduced={reduced}>{render(active)}</StoryArt>
      <div className="story-stage-foot mono"><span>{item.key==='plotting'?'EXISTING CSV / EXACT VALUES':'ILLUSTRATION / SAVED RECORD'}</span><button type="button" disabled={reduced} onClick={()=>setReplay(value=>value+1)}>Replay drawing ↻</button></div>
    </aside>}
    <ol className="story-steps">{MODULES.map((step,index)=><li key={step.key}><article id={`story-${step.key}`} ref={el=>{sections.current[index]=el}} className={`story-step${active===index?' is-current':''}`}>
      <h3><button className="story-step-title" type="button" ref={el=>{buttons.current[index]=el}} aria-current={active===index?'step':undefined} onClick={()=>visit(index)} onKeyDown={event=>keyboard(event,index)}><span className="mono">{step.no} / {step.title.toUpperCase()}</span><span className="story-step-heading">{COPY[index][0]}</span></button></h3>
      <p>{COPY[index][1]}</p><a className="quiet-link" href={step.key==='plotting'?'/report':'/w?lang=en'}>{step.key==='plotting'?'Read the full report →':'Try it in the workbench ↗'}</a>
      {compact&&<StoryArt kind={step.key} reduced={reduced} inline><span className="mono sketch-inline-label">{step.key==='plotting'?'EXISTING CSV / EXACT VALUES':'ILLUSTRATION / SAVED BOLOGNA RECORD'}</span>{render(index)}</StoryArt>}
      <details className="story-details"><summary>Workbench steps &amp; real recording</summary><ol>{step.steps.map(text=><li key={text}>{text}</li>)}</ol><RecordedExample item={step} reduced={reduced}/></details>
    </article></li>)}</ol>
   </div>
   <noscript><p>Interactive drawings require JavaScript. View the original recordings and stills:</p><ul>{MODULES.map(step=><li key={step.key}><a href={CLIPS[step.key]?.poster}>{step.title} still</a>{' · '}<a href={CLIPS[step.key]?.src}>recording</a></li>)}</ul><a href="/report">Open the original figures and full count tables</a></noscript>
 </div></section>
}
