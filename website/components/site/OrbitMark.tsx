'use client'
import { useEffect, useRef, useState } from 'react'
import QtMark from '@/components/QtMark'
import { ORBIT_STEPS, orbitPoint, type OrbitCamera } from '@/lib/site/orbit-sketch'
import { useReducedMotion } from './MotionPreference'

const INK=[75,96,124],RUST=[143,50,34]
const colour=(tone:number[],alpha:number)=>`rgba(${tone.join(',')},${alpha})`
/** Two depth layers surround the real QT mark. All particles and geometry are original. */
export default function OrbitMark(){
 const reduced=useReducedMotion(),[manual,setManual]=useState(false),[visible,setVisible]=useState(false),[selected,setSelected]=useState<number|null>(null)
 const root=useRef<HTMLDivElement>(null),surface=useRef<HTMLDivElement>(null),back=useRef<HTMLCanvasElement>(null),front=useRef<HTMLCanvasElement>(null)
 const nodes=useRef<Array<HTMLButtonElement|null>>([]),elapsed=useRef(0),target=useRef<OrbitCamera>({yaw:0,pitch:0}),camera=useRef<OrbitCamera>({yaw:0,pitch:0})
 useEffect(()=>{if(!root.current)return;const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting));observer.observe(root.current);return()=>observer.disconnect()},[])
 useEffect(()=>{
  const box=surface.current,bg=back.current,fg=front.current
  if(!box||!bg||!fg)return
  const b=bg.getContext('2d'),f=fg.getContext('2d');if(!b||!f||!visible)return
  let frame=0,previous=0,width=0,height=0,dpr=1
  const resize=()=>{width=box.clientWidth;height=box.clientHeight;dpr=Math.min(devicePixelRatio||1,1.5);[bg,fg].forEach(canvas=>{canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr)})}
  const observer=new ResizeObserver(resize);observer.observe(box);resize()
  const draw=(now:number)=>{
   if(!visible||document.hidden){previous=0;frame=requestAnimationFrame(draw);return}
   if(previous&&!manual&&selected===null&&!reduced)elapsed.current+=Math.min(now-previous,50)/1000
   previous=now
   camera.current.yaw+=(target.current.yaw-camera.current.yaw)*.055;camera.current.pitch+=(target.current.pitch-camera.current.pitch)*.055
   const view=reduced?{yaw:0,pitch:0}:camera.current,t=elapsed.current
   for(const ctx of [b,f]){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);ctx.scale(width/1000,height/520)}
   const dot=(p:ReturnType<typeof orbitPoint>,radius:number,tone:number[],alpha:number)=>{const ctx=p.depth>0?f:b;ctx.fillStyle=colour(tone,alpha);ctx.beginPath();ctx.arc(p.x,p.y,radius*p.scale,0,Math.PI*2);ctx.fill()}
   // Thin, slightly offset strokes retain the feel of an engineering notebook.
   ORBIT_STEPS.forEach((step,index)=>{
    const hot=selected===index,tone=hot||index===3?RUST:INK,emphasis=selected===null||hot?1:.23
    for(let layer=0;layer<2;layer++){
     let last:ReturnType<typeof orbitPoint>|null=null
     for(let j=0;j<=100;j++){const p=orbitPoint(step.radius+layer*.8,j/100*Math.PI*2,step.inclination,view);if(last){const ctx=(p.depth+last.depth)>0?f:b;ctx.strokeStyle=colour(tone,(p.depth>0?.22:.09)*emphasis*(layer?.35:1));ctx.lineWidth=hot?1.25:.75;ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke()}last=p}
    }
    const angle=step.phase+t*Math.PI*2/step.period
    for(let lane=0;lane<(width<600?3:5);lane++)for(let j=0;j<48;j++){
     const fade=1-j/48,p=orbitPoint(step.radius+Math.sin(j*2.1+lane*1.8)*lane*2.8,angle-j*.027-lane*.009,step.inclination+Math.sin(j+lane)*.006,view)
     dot(p,(1+lane*.15)*fade+.3,tone,(.06+.6*fade*fade)*emphasis)
    }
    const p=orbitPoint(step.radius,angle,step.inclination,view),ctx=p.depth>0?f:b,r=(hot?13:10)*p.scale
    ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle='rgb(250,248,244)';ctx.strokeStyle=colour(tone,hot?1:.85);ctx.lineWidth=1.1;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();ctx.stroke()
    ctx.beginPath();ctx.ellipse(0,0,r*.4,r,Math.PI*.18,0,Math.PI*2);ctx.ellipse(0,0,r,r*.35,-.25,0,Math.PI*2);ctx.stroke()
    for(let h=0;h<7;h++){ctx.fillStyle=colour(tone,.3);ctx.beginPath();ctx.arc(-r*.25+(h%2)*r*.25,-r*.6+h*r*.18,.6,0,Math.PI*2);ctx.fill()}
    if(hot){ctx.setLineDash([2,4]);ctx.beginPath();ctx.arc(0,0,r+6,0,Math.PI*2);ctx.stroke()}ctx.restore()
    const node=nodes.current[index];if(node){node.style.left=`${p.x/10}%`;node.style.top=`${p.y/5.2}%`;node.dataset.depth=p.depth.toFixed(3);node.style.zIndex=p.depth>0?'5':'1'}
   })
   // A sparse, rotating particle field, with deterministic seeds and no external textures.
   const count=width<600?300:720
   for(let i=0;i<count;i++){const radius=85+((i*71)%300),angle=i*2.41+t*.035/(1+radius/220),p=orbitPoint(radius,angle,Math.sin(i*13)*.48,view);const fade=selected===null?1:.4;dot(p,i%11===0?1.3:.75,INK,(i%7===0?.3:.14)*fade)}
   if(!reduced)frame=requestAnimationFrame(draw)
  }
  frame=requestAnimationFrame(draw)
  return()=>{cancelAnimationFrame(frame);observer.disconnect()}
 },[manual,selected,reduced,visible])
 return <div ref={root} className={`orbit-mark${manual||selected!==null||reduced?' is-paused':''}`}>
  <div ref={surface} className="orbit-drawing" role="group" aria-label="Interactive perspective satellite system around QT" onPointerMove={event=>{if(reduced||event.pointerType==='touch')return;const r=event.currentTarget.getBoundingClientRect();target.current={yaw:((event.clientX-r.left)/r.width-.5)*.65,pitch:((event.clientY-r.top)/r.height-.5)*.3}}} onPointerLeave={()=>{target.current={yaw:0,pitch:0}}}>
   <canvas ref={back} className="orbit-canvas orbit-canvas--back" aria-hidden="true"/>
   <div className="hero-qt"><QtMark size={18} animate label="QT"/></div>
   <canvas ref={front} className="orbit-canvas orbit-canvas--front" aria-hidden="true"/>
   {ORBIT_STEPS.map((step,index)=>{const p=orbitPoint(step.radius,step.phase,step.inclination);return <button type="button" key={step.key} ref={el=>{nodes.current[index]=el}} className={`orbit-satellite${selected===index?' is-current':''}`} style={{left:`${p.x/10}%`,top:`${p.y/5.2}%`}} aria-label={`Explore ${step.name}`} aria-pressed={selected===index} onPointerEnter={()=>setSelected(index)} onPointerLeave={event=>{if(document.activeElement!==event.currentTarget)setSelected(null)}} onFocus={()=>setSelected(index)} onBlur={()=>setSelected(null)} onClick={()=>setSelected(index)}><span className="orbit-node-label mono">{step.name}</span></button>})}
  </div>
  <div className="orbit-caption"><span role="status" aria-live="polite">{selected===null?'Move to explore. Follow a satellite.':ORBIT_STEPS[selected].detail}</span><button type="button" className="mono orbit-pause" aria-pressed={manual} disabled={reduced} onClick={()=>{setManual(value=>!value);setSelected(null)}}>{reduced?'Motion reduced':manual?'Play ↻':'Pause Ⅱ'}</button></div>
  <span className="orbit-concept mono">FIVE WORKFLOW STEPS · CONCEPTUAL SKETCH</span>
 </div>
}
