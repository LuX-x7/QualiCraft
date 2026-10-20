'use client'
import {siteUrl} from '@/lib/site/url'

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { MODULES } from '@/lib/site/content'
import { CLIPS } from '@/lib/site/clips'
import { pickStoryIndex } from '@/lib/site/scroll-story'
import { STORY_SCENES, pageSceneIndex } from '@/lib/site/story-scenes'
import type { SavedCoding } from '@/lib/site/record-network'
import type { ChartTable } from '@/lib/report/chart-model'
import type { OriginalHeatmap } from '@/lib/site/original-heatmap'
import SketchScene from './SketchScene'
import PlotSketch from './PlotSketch'
import RelationshipSketch from './RelationshipSketch'
import { RecordedExample } from './ModuleWalkthrough'
import type { CodingExample } from './CodingEvidence'
import type { WorkflowData } from './WorkflowIllustration'
import { useReducedMotion } from './MotionPreference'
import ComparativeSketch from './ComparativeSketch'

function StoryArt({kind,reduced,inline=false,children}:{kind:string;reduced:boolean;inline?:boolean;children:ReactNode}) {
 const [entered,setEntered]=useState(false),root=useRef<HTMLDivElement>(null)
 useEffect(()=>{if(!root.current)return;const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setEntered(true);observer.disconnect()}},{threshold:.1});observer.observe(root.current);return()=>observer.disconnect()},[])
 return <div ref={root} className={`story-art${inline?' story-inline':''} story-art--${kind}${reduced||!entered?' is-static':''}`}>{children}</div>
}
export default function WorkflowShowcase({example,data,charts,records,heatmaps={}}:{example:CodingExample|null;data:WorkflowData;charts:Record<string,ChartTable>;records:SavedCoding[];heatmaps?:Record<string,OriginalHeatmap>}) {
 const [active,setActive]=useState(0),[compact,setCompact]=useState(false),[replays,setReplays]=useState<Record<string,number>>({})
 const reduced=useReducedMotion(),sections=useRef<Array<HTMLElement|null>>([]),buttons=useRef<Array<HTMLButtonElement|null>>([]),stageBody=useRef<HTMLDivElement>(null)
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
 useEffect(()=>{if(stageBody.current)stageBody.current.scrollTop=0},[active])
 const visit=(index:number,focus=false)=>{const next=Math.max(0,Math.min(index,STORY_SCENES.length-1));setActive(next);sections.current[next]?.scrollIntoView({block:'center',behavior:'instant'});if(focus)buttons.current[next]?.focus({preventScroll:true})}
 const keyboard=(event:KeyboardEvent<HTMLButtonElement>,index:number)=>{if(!['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'].includes(event.key))return;event.preventDefault();visit(event.key==='Home'?0:event.key==='End'?STORY_SCENES.length-1:index+(['ArrowDown','ArrowRight'].includes(event.key)?1:-1),true)}
 const artKeyboard=(event:KeyboardEvent,index:number)=>{const next=pageSceneIndex(event.key,index,STORY_SCENES.length,(event.target as Element).tagName);if(next===null)return;event.preventDefault();visit(next,true)}
 const render=(index:number)=>{const scene=STORY_SCENES[index];return scene.module==='plotting'?<PlotSketch kind={scene.plot} data={data} charts={charts} source={heatmaps[scene.plot]}/>:scene.id==='qca'?<ComparativeSketch/>:scene.id==='network'&&example?<RelationshipSketch records={records} initial={example} pairs={charts.cooccurrence} credit={data.figures.find(figure=>figure.kind==='cooccurrence')?.credit}/>:<SketchScene kind={scene.module} example={example} records={records}/>}
 const artwork=(index:number,inline=false)=>{const step=STORY_SCENES[index];return <div data-story-art={step.id} className={`story-panel${['coding','analysis','network'].includes(step.id)?' evidence-plate':''}`} hidden={!inline&&active!==index} key={`${step.id}-${replays[step.id]??0}`} onKeyDown={event=>artKeyboard(event,index)}><StoryArt kind={step.module} reduced={reduced} inline={inline}>{render(index)}</StoryArt></div>}
 const scene=STORY_SCENES[active],module=MODULES.find(item=>item.key===scene.module)!
 return <section className="scroll-story section" id="workflow" aria-labelledby="story-title"><div className="wrap">
  <header className="story-heading"><span className="sec-no mono">02 / FOLLOW THE RECORD</span><h2 id="story-title">One workflow.<br/><em>Every connection in view.</em></h2><p>Scroll to follow. Hover or focus to explore.</p><nav className="story-evidence-links" aria-label="Explore the source relationships"><a href={siteUrl("#story-coding")}>Coding: one assignment ↓</a><a href={siteUrl("#story-analysis")}>Analysis: a saved path ↓</a><a href={siteUrl("#story-network")}>Explore the network ↓</a></nav></header>
  <div className="story-layout">
   {!compact&&<aside className="story-stage story-stage--sequence" data-scene={scene.id} aria-label={`${module.title} interactive illustration`}>
    <div className="story-stage-head mono"><span>{scene.no} / {module.title.toUpperCase()}</span><span>{active+1} / {STORY_SCENES.length} · BOLOGNA CC0</span></div>
    {/* All drawings stay mounted; only the active panel is displayed and focusable. */}
    <div className="story-stage-body" ref={stageBody}>{STORY_SCENES.map((_,index)=>artwork(index))}</div>
    <div className="story-stage-foot mono"><span>{scene.module==='plotting'?'ORIGINAL SVG · EXACT CSV VALUES':scene.id==='qca'?'METHOD PROCEDURE · RESEARCHER DECISIONS':scene.module==='export'?'OUTPUT GUIDE · SAVED BOLOGNA SOURCE':'SAVED SOURCE · INTERACTIVE SKETCH'}</span><button type="button" disabled={reduced} onClick={()=>setReplays(current=>({...current,[scene.id]:(current[scene.id]??0)+1}))}>Replay ↻</button></div>
   </aside>}
   <ol className="story-steps">{STORY_SCENES.map((step,index)=>{const item=MODULES.find(item=>item.key===step.module)!;return <li key={step.id}><article id={`story-${step.id}`} ref={el=>{sections.current[index]=el}} className={`story-step${active===index?' is-current':''}`}>
    <h3><button className="story-step-title" type="button" ref={el=>{buttons.current[index]=el}} onMouseEnter={()=>setActive(index)} onPointerMove={event=>{if(event.pointerType==='mouse')setActive(index)}} onFocus={()=>setActive(index)} aria-current={active===index?'step':undefined} onClick={()=>visit(index)} onKeyDown={event=>keyboard(event,index)}><span className="mono">{step.no} / {item.title.toUpperCase()}</span><span className="story-step-heading">{step.title}</span></button></h3>
    <p>{step.body}</p><a className="quiet-link" href={siteUrl(step.module==='plotting'?`/report#sec-${step.plot}`:'/w?lang=en')}>{step.module==='plotting'?'Full figure, counts & source →':'Try it in the workbench ↗'}</a>
    {step.module==='export'&&<details className="story-details"><summary>Report writing &amp; exports</summary><p>Choose your method, edit the Analysis Table and Narrative Analysis, and save a version. Export a coded notebook, editable Word report, figures with counts and code, or the restorable project JSON.</p></details>}
    {compact&&artwork(index,true)}
    {!['network','qca'].includes(step.id)&&(step.module!=='plotting'||step.plot==='frequency')&&<details className="story-details"><summary>Workbench recording &amp; steps</summary><ol>{item.steps.map(text=><li key={text}>{text}</li>)}</ol><RecordedExample item={item} reduced={reduced}/></details>}
   </article></li>})}</ol>
  </div>
  <noscript><p>Drawings require JavaScript. The original recordings, stills, figures and complete count tables remain available.</p><ul>{MODULES.map(step=><li key={step.key}><a href={siteUrl(CLIPS[step.key]?.poster)}>{step.title} still</a>{' · '}<a href={siteUrl(CLIPS[step.key]?.src)}>recording</a></li>)}</ul><a href={siteUrl("/report")}>Original figures and complete count tables</a></noscript>
 </div></section>
}
