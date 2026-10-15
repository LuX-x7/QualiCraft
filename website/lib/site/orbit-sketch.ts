/** Original perspective geometry; these dimensions encode layout, never research values. */
export const ORBIT_STEPS = [
 {key:'import',name:'Import',detail:'Bring the source into view.',radius:180,inclination:.42,phase:.6,period:32},
 {key:'coding',name:'Coding',detail:'Connect original words to a code.',radius:225,inclination:-.36,phase:2.2,period:41},
 {key:'analysis',name:'Analysis',detail:'Follow codes, themes and source passages.',radius:275,inclination:.68,phase:4,period:49},
 {key:'plotting',name:'Plotting',detail:'Inspect five views of the saved counts.',radius:325,inclination:-.55,phase:5.25,period:59},
 {key:'export',name:'Export',detail:'Keep figures, counts and generating code.',radius:370,inclination:.2,phase:3,period:72},
] as const
export type OrbitCamera={yaw:number;pitch:number}
export function orbitPoint(radius:number,angle:number,inclination=0,camera:OrbitCamera={yaw:0,pitch:0}) {
 const x=radius*Math.cos(angle),z=radius*Math.sin(angle)*Math.cos(inclination),y=radius*Math.sin(angle)*Math.sin(inclination)
 const yaw=camera.yaw-.14,pitch=camera.pitch+.48
 const u=x*Math.cos(yaw)+z*Math.sin(yaw),v=-x*Math.sin(yaw)+z*Math.cos(yaw)
 const sy=y*Math.cos(pitch)+v*Math.sin(pitch),depth=v*Math.cos(pitch)-y*Math.sin(pitch)
 const perspective=1000/(1000-depth)
 return {x:500+u*perspective,y:260+sy*perspective*.64,depth:depth/radius,scale:perspective}
}
export function orbitPath(radius:number,inclination:number,from=0,to=Math.PI*2,segments=96,camera:OrbitCamera={yaw:0,pitch:0}) {
 return Array.from({length:segments+1},(_,i)=>{const p=orbitPoint(radius,from+(to-from)*i/segments,inclination,camera);return `${i?'L':'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`}).join(' ')
}
