/** Original illustrative geometry. Radii describe layout, never research values. */
export const ORBIT_STEPS = [
 {key:'import',name:'Import',detail:'Bring the source into view.',radius:104,inclination:.1,phase:.6,period:34},
 {key:'coding',name:'Coding',detail:'Connect original words to a code.',radius:144,inclination:-.12,phase:2.2,period:43},
 {key:'analysis',name:'Analysis',detail:'Follow codes, themes and source passages.',radius:182,inclination:.16,phase:4.0,period:51},
 {key:'plotting',name:'Plotting',detail:'Inspect five views of the saved counts.',radius:224,inclination:-.08,phase:5.25,period:62},
 {key:'export',name:'Export',detail:'Keep figures, counts and generating code.',radius:266,inclination:.07,phase:3.0,period:74},
] as const
export function orbitPoint(radius:number,angle:number,inclination=0) {
 const x=radius*Math.cos(angle),z=radius*Math.sin(angle),y=z*Math.sin(inclination)
 const projectedY=y*.88+z*.41,roll=-.27
 return {x:300+x*Math.cos(roll)-projectedY*Math.sin(roll),y:210+x*Math.sin(roll)+projectedY*Math.cos(roll),depth:z/radius,scale:.88+Math.sin(angle)*.15}
}
export function orbitPath(radius:number,inclination:number,from=0,to=Math.PI*2,segments=96) {
 return Array.from({length:segments+1},(_,i)=>{
  const point=orbitPoint(radius,from+(to-from)*i/segments,inclination)
  return `${i?'L':'M'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`
 }).join(' ')
}
