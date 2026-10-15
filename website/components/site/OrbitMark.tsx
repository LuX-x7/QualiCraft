'use client'
import { useEffect, useRef, useState } from 'react'
import { ORBIT_STEPS, orbitPath, orbitPoint } from '@/lib/site/orbit-sketch'
import { useReducedMotion } from './MotionPreference'

/** Original orbital drawing, illustrating five workflow steps rather than quantities. */
export default function OrbitMark(){
 const reduced=useReducedMotion(),[manual,setManual]=useState(false),[visible,setVisible]=useState(false),[selected,setSelected]=useState<number|null>(null)
 const root=useRef<HTMLDivElement>(null),nodes=useRef<Array<HTMLButtonElement|null>>([]),trails=useRef<Array<SVGPathElement|null>>([]),elapsed=useRef(0)
 useEffect(()=>{if(!root.current)return;const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting));observer.observe(root.current);return()=>observer.disconnect()},[])
 const paused=manual||selected!==null||reduced||!visible
 useEffect(()=>{
  if(paused)return
  let frame=0,previous=0
  const draw=(now:number)=>{
   if(document.hidden){previous=0;frame=requestAnimationFrame(draw);return}
   if(previous)elapsed.current+=Math.min(now-previous,50)/1000
   previous=now
   ORBIT_STEPS.forEach((step,index)=>{
    const angle=step.phase+elapsed.current*Math.PI*2/step.period,p=orbitPoint(step.radius,angle,step.inclination),node=nodes.current[index]
    if(node){node.style.left=`${p.x/6}%`;node.style.top=`${p.y/4.2}%`;node.style.setProperty('--depth-scale',String(p.scale));node.style.zIndex=p.depth>0?'3':'1';node.dataset.depth=p.depth.toFixed(3)}
    trails.current[index]?.setAttribute('d',orbitPath(step.radius,step.inclination,angle-.55,angle,20))
   })
   frame=requestAnimationFrame(draw)
  }
  frame=requestAnimationFrame(draw);return()=>cancelAnimationFrame(frame)
 },[paused])
 return <div ref={root} className={`orbit-mark${paused?' is-paused':''}${selected!==null?' has-selection':''}`}>
  <div className="orbit-drawing" role="group" aria-label="Five workflow steps in an illustrative satellite system">
   <svg className="orbit-system" viewBox="0 0 600 420" fill="none" aria-hidden="true">
    <defs><pattern id="orbit-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)"><path d="M0 0V5" stroke="currentColor" strokeWidth=".5" opacity=".23"/></pattern></defs>
    <path className="orbit-guide" d="M22 210H578M300 38V382"/>
    <path className="orbit-guide-ticks" d="M34 206V214M566 206V214M296 50H304M296 370H304"/>
    {ORBIT_STEPS.map((step,index)=><g key={step.key} className={`orbit-track${selected===index?' is-current':''}`}><path className="orbit-track-far" d={orbitPath(step.radius,step.inclination,Math.PI,Math.PI*2)}/><path className="orbit-track-near" d={orbitPath(step.radius,step.inclination,0,Math.PI)}/><path ref={el=>{trails.current[index]=el}} className="orbit-trail" d={orbitPath(step.radius,step.inclination,step.phase-.55,step.phase,20)}/></g>)}
    <g className="orbit-centre"><ellipse cx="300" cy="210" rx="32" ry="23" fill="var(--paper)"/><ellipse cx="300" cy="210" rx="32" ry="23" fill="url(#orbit-hatch)"/><ellipse cx="300" cy="210" rx="32" ry="23"/><ellipse cx="300" cy="210" rx="13" ry="23"/><path d="M270 202Q300 215 330 202M270 218Q300 231 330 218"/></g>
    <g className="orbit-measure mono"><text x="20" y="384">QT / WORKFLOW SYSTEM</text><text x="580" y="384" textAnchor="end">SCHEMATIC · NOT TO SCALE</text></g>
   </svg>
   {ORBIT_STEPS.map((step,index)=>{const p=orbitPoint(step.radius,step.phase,step.inclination);return <button key={step.key} ref={el=>{nodes.current[index]=el}} type="button" className={`orbit-satellite${selected===index?' is-current':''}`} style={{left:`${p.x/6}%`,top:`${p.y/4.2}%`,['--depth-scale' as string]:p.scale,zIndex:p.depth>0?3:1}} aria-label={`Explore ${step.name}`} aria-pressed={selected===index} onPointerEnter={()=>setSelected(index)} onPointerLeave={event=>{if(document.activeElement!==event.currentTarget)setSelected(null)}} onFocus={()=>setSelected(index)} onBlur={()=>setSelected(null)} onClick={()=>setSelected(index)}>
    <svg className="satellite-sphere" viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="9.8" fill="var(--paper)"/><path d="M10 9L23 22M7 13L20 26M14 7L25 18" className="satellite-hatch"/><circle cx="16" cy="16" r="9.8"/><path d="M7 17Q15 11 25 17M13 7Q22 16 16 25"/><circle cx="16" cy="16" r="13.8" className="satellite-ring"/></svg>
    <span className="orbit-node-label mono">{String(index+1).padStart(2,'0')} / {step.name.toUpperCase()}</span>
   </button>})}
  </div>
  <div className="orbit-caption"><span className="orbit-description" role="status" aria-live="polite">{selected===null?'Five steps. One local record.':ORBIT_STEPS[selected].detail}</span><button type="button" className="mono orbit-pause" aria-pressed={manual} disabled={reduced} onClick={()=>{setManual(value=>!value);setSelected(null)}}>{reduced?'Motion reduced':manual?'Play ↻':'Pause Ⅱ'}</button></div>
 </div>
}
