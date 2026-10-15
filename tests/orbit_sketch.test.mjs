import test from 'node:test'
import assert from 'node:assert/strict'
import { ORBIT_STEPS, orbitPoint } from '../website/lib/site/orbit-sketch.ts'
test('each illustrative orbit closes and stays inside its own drawing',()=>{
 for(const step of ORBIT_STEPS){
  const first=orbitPoint(step.radius,0,step.inclination),last=orbitPoint(step.radius,Math.PI*2,step.inclination)
  assert.ok(Math.abs(first.x-last.x)<1e-8&&Math.abs(first.y-last.y)<1e-8)
  for(let i=0;i<360;i++){const p=orbitPoint(step.radius,i*Math.PI/180,step.inclination);assert.ok(p.x>20&&p.x<580&&p.y>35&&p.y<385)}
 }
})
test('near and far positions have different depth and apparent size',()=>{
 const near=orbitPoint(180,Math.PI/2),far=orbitPoint(180,Math.PI*1.5)
 assert.ok(near.depth>0&&far.depth<0&&near.scale>far.scale)
 assert.equal(new Set(ORBIT_STEPS.map(step=>step.period)).size,5)
})
