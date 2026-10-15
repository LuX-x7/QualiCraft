'use client'
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { MODULES } from '@/lib/site/content'
import { CLIPS } from '@/lib/site/clips'
import { pickStoryIndex } from '@/lib/site/scroll-story'
import { STORY_SCENES, pageSceneIndex } from '@/lib/site/story-scenes'
import type { ChartTable } from '@/lib/report/chart-model'
import SketchScene from './SketchScene'
import PlotSketch from './PlotSketch'
import { RecordedExample } from './ModuleWalkthrough'
import type { CodingExample } from './CodingEvidence'
import type { WorkflowData } from './WorkflowIllustration'
import { useReducedMotion } from './MotionPreference'

function StoryArt({kind,reduced,inline=false,children}:{kind:string;reduced:boolean;inline?:boolean;children:ReactNode}) {
 const [entered,setEntered]=useState(false),root=useRef<HTMLDivElement>(null)
 useEffect(()=>{if(!root.current)return;const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setEntered(true);observer.disconnect()}},{threshold:.1});observer.observe(root.current);return()=>observer.disconnect()},[])
 return <div ref={root} className={`story-art${inline?' story-inline':''} story-art--${kind}${reduced||!entered?' is-static':''}`}>{children}</div>
}
export default function WorkflowShowcase({example,data,charts}:{example:CodingExample|null;data:WorkflowData;charts:Record<string,ChartTable>}) {
 const [active,setActive]=useState(0),[compact,setCompact]=useState(false),[replay,setReplay]=useState(0)
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
 const visit=(index:number,focus=false)=>{const next=Math.max(0,Math.min(index,STORY_SCENES.length-1));setActive(next);sections.current[next]?.scrollIntoView({block:'center',behavior:'instant'});if(focus)buttons.current[next]?.focus({preventScroll:true})}
 const keyboard=(event:KeyboardEvent<HTMLButtonElement>,index:number)=>{if(!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(event.key))return;event.preventDefault();visit(event.key==='Home'?0:event.key==='End'?STORY_SCENES.length-1:index+(['ArrowDown','ArrowRight'].includes(event.key)?1:-1),true)}
 const render=(index:number)=>{const scene=STORY_SCENES[index];return scene.module==='plotting'?<PlotSketch kind={scene.plot} data={data} charts={charts}/>:<SketchScene kind={scene.module} example={example}/>}
 const scene=STORY_SCENES[active],item=MODULES.find(step=>step.key===scene.module)!
 return <section className="scroll-story section" id="workflow" aria-labelledby="story-title"><div className="wrap">
   <header className="story-heading"><span className="sec-no mono">02 / FOLLOW THE RECORD</span><h2 id="story-title">One workflow.<br/><em>Every connection in view.</em></h2><p>Keep scrolling. The drawing follows your reading.</p></header>
   <div className="story-layout">
    {!compact&&<aside className="story-stage" data-scene={scene.id} aria-label={`${item.title}${'plot' in scene?` / ${scene.plot}`:''} interactive illustration`} onKeyDown={event=>{const next=pageSceneIndex(event.key,active,STORY_SCENES.length,(event.target as Element).tagName);if(next===null)return;event.preventDefault();visit(next,true)}}>
      <div className="story-stage-head mono"><span>{scene.no} / {item.title.toUpperCase()}</span><span>{active+1} / {STORY_SCENES.length} · BOLOGNA CC0</span></div>
      <StoryArt key={`${scene.id}-${replay}`} kind={scene.module} reduced={reduced}>{render(active)}</StoryArt>
      <div className="story-stage-foot mono"><span>{scene.module==='plotting'?'ORIGINAL CSV · EXACT VALUES':'SAVED SOURCE · INTERACTIVE SKETCH'}</span><button type="button" disabled={reduced} onClick={()=>setReplay(value=>value+1)}>Replay ↻</button></div>
    </aside>}
    <ol className="story-steps">{STORY_SCENES.map((step,index)=>{const module=MODULES.find(item=>item.key===step.module)!;return <li key={step.id}><article id={`story-${step.id}`} ref={el=>{sections.current[index]=el}} className={`story-step${active===index?' is-current':''}`}>
      <h3><button className="story-step-title" type="button" ref={el=>{buttons.current[index]=el}} aria-current={active===index?'step':undefined} onClick={()=>visit(index)} onKeyDown={event=>keyboard(event,index)}><span className="mono">{step.no} / {module.title.toUpperCase()}</span><span className="story-step-heading">{step.title}</span></button></h3>
      <p>{step.body}</p><a className="quiet-link" href={step.module==='plotting'?`/report#sec-${step.plot}`:'/w?lang=en'}>{step.module==='plotting'?'Full figure, counts & source →':'Try it in the workbench ↗'}</a>
      {compact&&<StoryArt kind={step.module} reduced={reduced} inline>{render(index)}</StoryArt>}
      {(step.module!=='plotting'||step.plot==='frequency')&&<details className="story-details"><summary>Workbench recording &amp; steps</summary><ol>{module.steps.map(text=><li key={text}>{text}</li>)}</ol><RecordedExample item={module} reduced={reduced}/></details>}
    </article></li>})}</ol>
   </div>
   <noscript><p>Drawings require JavaScript. The original recordings, stills, figures and complete count tables remain available.</p><ul>{MODULES.map(step=><li key={step.key}><a href={CLIPS[step.key]?.poster}>{step.title} still</a>{' · '}<a href={CLIPS[step.key]?.src}>recording</a></li>)}</ul><a href="/report">Original figures and complete count tables</a></noscript>
 </div></section>
}
