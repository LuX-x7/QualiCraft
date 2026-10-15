'use client'
import { useRef, useState, type KeyboardEvent } from 'react'
import { MODULES } from '@/lib/site/content'
import { CLIPS } from '@/lib/site/clips'
import { StepDemo } from './ModuleWalkthrough'
import type { CodingExample } from './CodingEvidence'
import type { WorkflowData } from './WorkflowIllustration'
import { useReducedMotion } from './MotionPreference'

export default function WorkflowShowcase({example,data}:{example:CodingExample|null;data:WorkflowData}) {
  const [active,setActive]=useState(1)
  const tabs=useRef<Array<HTMLButtonElement|null>>([])
  const reduced=useReducedMotion()
  const move=(event:KeyboardEvent<HTMLButtonElement>,index:number)=>{
    let next=index
    if(['ArrowRight','ArrowDown'].includes(event.key)) next=(index+1)%MODULES.length
    else if(['ArrowLeft','ArrowUp'].includes(event.key)) next=(index+MODULES.length-1)%MODULES.length
    else if(event.key==='Home') next=0
    else if(event.key==='End') next=MODULES.length-1
    else return
    event.preventDefault();setActive(next);tabs.current[next]?.focus()
  }
  return <section className="showcase section" id="modules" aria-labelledby="showcase-title"><div className="wrap">
    <div className="showcase-heading"><span className="mono sec-no">01 / THE WORKFLOW</span><h2 id="showcase-title">Follow the connection.</h2><p>One source. Every step in view.</p></div>
    <div className="showcase-tabs" role="tablist" aria-label="Workflow steps">{MODULES.map((item,index)=><button key={item.key} id={`showcase-tab-${item.key}`} ref={el=>{tabs.current[index]=el}} role="tab" type="button" aria-selected={active===index} aria-controls={`showcase-${item.key}`} tabIndex={active===index?0:-1} onClick={()=>setActive(index)} onKeyDown={event=>move(event,index)}><span className="mono">{item.no}</span>{item.title}</button>)}</div>
    {MODULES.map((item,index)=><div key={item.key} id={`showcase-${item.key}`} role="tabpanel" aria-labelledby={`showcase-tab-${item.key}`} hidden={active!==index}>
      {active===index&&<div className="showcase-grid"><div className="showcase-demo"><div className="showcase-window mono"><span className="pixel-status"/>QUALICRAFT / {item.title.toUpperCase()}<span>BOLOGNA · CC0</span></div><div className="showcase-canvas"><StepDemo item={item} reduced={reduced} example={example} data={data}/></div></div>
      <div className="showcase-copy"><span className="mono sec-no">{item.no} / {item.title.toUpperCase()}</span><h3>{item.goal}</h3><p>{item.see}</p><a className="quiet-link" href="/w?lang=en">Try it in the workbench ↗</a><details><summary>How it works</summary><ol>{item.steps.map(step=><li key={step}>{step}</li>)}</ol></details></div></div>}
    </div>)}
    <noscript><p>The <a href="/w?lang=en">workbench</a> and <a href="/report">example report</a> show the full workflow.</p><ul>{MODULES.map(item=><li key={item.key}><a href={CLIPS[item.key]?.poster}>{item.title} recorded still</a>{' · '}<a href={CLIPS[item.key]?.src}>recording</a></li>)}</ul></noscript>
  </div></section>
}
