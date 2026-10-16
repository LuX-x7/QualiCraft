'use client'
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { MODULES } from '@/lib/site/content'
import { CLIPS } from '@/lib/site/clips'
import { pickStoryIndex } from '@/lib/site/scroll-story'
import { STORY_SCENES, pageSceneIndex } from '@/lib/site/story-scenes'
import type { SavedCoding } from '@/lib/site/record-network'
import type { ChartTable } from '@/lib/report/chart-model'
import SketchScene from './SketchScene'
import PlotSketch from './PlotSketch'
import RelationshipSketch from './RelationshipSketch'
import { RecordedExample } from './ModuleWalkthrough'
import type { CodingExample } from './CodingEvidence'
import type { WorkflowData } from './WorkflowIllustration'
import { useReducedMotion } from './MotionPreference'

function StoryArt({kind,reduced,inline=false,children}:{kind:string;reduced:boolean;inline?:boolean;children:ReactNode}) {
 const [entered,setEntered]=useState(false),root=useRef<HTMLDivElement>(null)
 useEffect(()=>{if(!root.current)return;const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setEntered(true);observer.disconnect()}},{threshold:.1});observer.observe(root.current);return()=>observer.disconnect()},[])
 return <div ref={root} className={`story-art${inline?' story-inline':''} story-art--${kind}${reduced||!entered?' is-static':''}`}>{children}</div>
}
export default function WorkflowShowcase({example,data,charts,records}:{example:CodingExample|null;data:WorkflowData;charts:Record<string,ChartTable>;records:SavedCoding[]}) {
 const [active,setActive]=useState(0),[compact,setCompact]=useState(false),[replay,setReplay]=useState(0)
 const networkSection=useRef<HTMLElement>(null),networkTitle=useRef<HTMLHeadingElement>(null)
 const reduced=useReducedMotion(),sections=useRef<Array<HTMLElement|null>>([]),buttons=useRef<Array<HTMLButtonElement|null>>([])
 useEffect(()=>{const media=window.matchMedia('(max-width: 1000px)');const update=()=>setCompact(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[])
 useEffect(()=>{
  if(compact)return
  let frame=0
  const pick=()=>{frame=0;const index=pickStoryIndex(sections.current.map(el=>({top:el?.getBoundingClientRect().top??Infinity})),innerHeight*.5);if(index>=0)setActive(index)}
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(pick)}
  const observer=new IntersectionObserver(schedule,{rootMargin:'-40% 0px -40% 0px',threshold:0})
  sections.current.forEach(el=>{if(el)observer.observe(el)})
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);schedule()
  return()=>{observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule)}
 },[compact])
 const visit=(index:number,focus=false)=>{const next=Math.max(0,Math.min(index,STORY_SCENES.length-1));setActive(next);sections.current[next]?.scrollIntoView({block:next===1||next===2?'start':'center',behavior:'instant'});if(focus)buttons.current[next]?.focus({preventScroll:true})}
 const keyboard=(event:KeyboardEvent<HTMLButtonElement>,index:number)=>{if(!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(event.key))return;event.preventDefault();visit(event.key==='Home'?0:event.key==='End'?STORY_SCENES.length-1:index+(['ArrowDown','ArrowRight'].includes(event.key)?1:-1),true)}
 const artKeyboard=(event:KeyboardEvent,index:number)=>{if(index===2&&event.key==='PageDown'&&!['SELECT','INPUT','TEXTAREA'].includes((event.target as Element).tagName)){event.preventDefault();networkSection.current?.scrollIntoView({block:'start',behavior:'instant'});networkTitle.current?.focus({preventScroll:true});return}const next=pageSceneIndex(event.key,index,STORY_SCENES.length,(event.target as Element).tagName);if(next===null)return;event.preventDefault();visit(next,true)}
 const render=(index:number)=>{const scene=STORY_SCENES[index];return scene.module==='plotting'?<PlotSketch kind={scene.plot} data={data} charts={charts}/>:<SketchScene kind={scene.module} example={example} records={records}/>}
 const copy=(index:number)=>{const step=STORY_SCENES[index],module=MODULES.find(item=>item.key===step.module)!;return <>
  <h3><button className="story-step-title" type="button" ref={el=>{buttons.current[index]=el}} onMouseEnter={()=>setActive(index)} onPointerMove={event=>{if(event.pointerType==='mouse')setActive(index)}} onFocus={()=>setActive(index)} aria-current={active===index?'step':undefined} onClick={()=>visit(index)} onKeyDown={event=>keyboard(event,index)}><span className="mono">{step.no} / {module.title.toUpperCase()}</span><span className="story-step-heading">{step.title}</span></button></h3>
  <p>{step.body}</p><a className="quiet-link" href={step.module==='plotting'?`/report#sec-${step.plot}`:'/w?lang=en'}>{step.module==='plotting'?'Full figure, counts & source →':'Try it in the workbench ↗'}</a>
 </>}
 const recording=(index:number)=>{const step=STORY_SCENES[index],module=MODULES.find(item=>item.key===step.module)!;return (step.module!=='plotting'||step.plot==='frequency')&&<details className="story-details"><summary>Workbench recording &amp; steps</summary><ol>{module.steps.map(text=><li key={text}>{text}</li>)}</ol><RecordedExample item={module} reduced={reduced}/></details>}
 const stage=(index:number,single=false)=>{const scene=STORY_SCENES[index],item=MODULES.find(step=>step.key===scene.module)!;return <aside className={`story-stage ${single?'story-stage--single':'story-stage--sequence'}`} data-scene={scene.id} aria-label={`${item.title}${'plot' in scene?` / ${scene.plot}`:''} interactive illustration`} onKeyDown={event=>artKeyboard(event,index)}>
  <div className="story-stage-head mono"><span>{scene.no} / {item.title.toUpperCase()}</span><span>{index+1} / {STORY_SCENES.length} · BOLOGNA CC0</span></div>
  <StoryArt key={`${scene.id}-${replay}`} kind={scene.module} reduced={reduced}>{render(index)}</StoryArt>
  <div className="story-stage-foot mono"><span>{scene.module==='plotting'?'ORIGINAL CSV · EXACT VALUES':'SAVED SOURCE · INTERACTIVE SKETCH'}</span><button type="button" disabled={reduced} onClick={()=>setReplay(value=>value+1)}>Replay ↻</button></div>
 </aside>}
 const narrative=(index:number)=>{const step=STORY_SCENES[index];return <article id={`story-${step.id}`} ref={el=>{sections.current[index]=el}} className={`story-step${active===index?' is-current':''}`}>
  {copy(index)}{compact&&<StoryArt kind={step.module} reduced={reduced} inline>{render(index)}</StoryArt>}{recording(index)}
 </article>}
 // These two records stay mounted and visible in the document, independent of
 // the scrolling plot stage. Their source selection also survives scrolling away.
 const permanent=(index:1|2)=>{const step=STORY_SCENES[index];return <article key={step.id} id={`story-${step.id}`} ref={el=>{sections.current[index]=el}} className="story-proof" data-permanent-scene={step.module}>
  <div className="story-proof-art" onKeyDown={event=>artKeyboard(event,index)}><StoryArt kind={step.module} reduced={reduced}>{render(index)}</StoryArt></div>
  <div className={`story-step story-proof-copy${active===index?' is-current':''}`}>{copy(index)}{recording(index)}</div>
 </article>}
 return <section className="scroll-story section" id="workflow" aria-labelledby="story-title"><div className="wrap">
  <header className="story-heading"><span className="sec-no mono">02 / FOLLOW THE RECORD</span><h2 id="story-title">One workflow.<br/><em>Every connection in view.</em></h2><p>Scroll to follow. Hover or focus to explore.</p><nav className="story-evidence-links" aria-label="Explore the source relationships"><a href="#story-coding">Coding: one assignment ↓</a><a href="#story-analysis">Analysis: a saved path ↓</a><a href="#story-network">Explore the network ↓</a></nav></header>
  <div className="story-layout">{!compact&&stage(0,true)}<ol className="story-steps"><li>{narrative(0)}</li></ol></div>
  {permanent(1)}{permanent(2)}
  {example&&<section id="story-network" ref={networkSection} className="story-proof" data-permanent-scene="network" aria-labelledby="network-title">
   <div className="story-proof-art" onKeyDown={event=>{if(!['SELECT','INPUT','TEXTAREA'].includes((event.target as Element).tagName)&&['PageUp','PageDown'].includes(event.key)){event.preventDefault();visit(event.key==='PageUp'?2:3,true)}}}><StoryArt kind="analysis" reduced={reduced}><RelationshipSketch records={records} initial={example} pairs={charts.cooccurrence} credit={data.figures.find(figure=>figure.kind==='cooccurrence')?.credit}/></StoryArt></div>
   <div className="story-step story-proof-copy"><span className="network-supplement-label mono">03 / ANALYSIS · NETWORK VIEW</span><h3 id="network-title" ref={networkTitle} tabIndex={-1} className="story-step-heading">One path.<br/>A wider network.</h3><p>Explore saved connections across themes. Select a code to trace its highlighted source.</p><a className="quiet-link" href="/w?lang=en">Explore Insights in the workbench ↗</a></div>
  </section>}
  <div className="story-layout">{!compact&&stage(Math.max(3,active))}<ol className="story-steps">{STORY_SCENES.slice(3).map((step,index)=><li key={step.id}>{narrative(index+3)}</li>)}</ol></div>
  <noscript><p>Drawings require JavaScript. The original recordings, stills, figures and complete count tables remain available.</p><ul>{MODULES.map(step=><li key={step.key}><a href={CLIPS[step.key]?.poster}>{step.title} still</a>{' · '}<a href={CLIPS[step.key]?.src}>recording</a></li>)}</ul><a href="/report">Original figures and complete count tables</a></noscript>
 </div></section>
}
