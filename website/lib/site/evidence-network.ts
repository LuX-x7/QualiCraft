import type { SavedCoding } from './record-network'
import type { ChartTable } from '../report/chart-model'
export type EvidenceNode={id:string;sourceId:string;kind:'theme'|'code'|'passage';label:string;root:string;path:string[];x:number;y:number;record?:SavedCoding}
export type EvidenceLink={from:string;to:string;kind:'hierarchy'|'coding'|'cooccurrence';value?:number}

/** A view of saved paths and exported pairs. No counts are recalculated. */
export function evidenceNetwork(records:SavedCoding[],pairs?:ChartTable) {
 const nodes=new Map<string,EvidenceNode>(),links=new Map<string,EvidenceLink>()
 for(const record of records){
  if(!record.code_path.length||record.code_path.at(-1)?.id!==record.code_id||new Set(record.code_path.map(n=>n.id)).size!==record.code_path.length)throw new Error('Invalid saved path')
  const root=record.code_path[0].id,path=record.code_path.map((n,i)=>(i?'code:':'theme:')+n.id)
  record.code_path.forEach((node,i)=>{
   if(!nodes.has(path[i]))nodes.set(path[i],{id:path[i],sourceId:node.id,kind:i?'code':'theme',label:node.name,root,path:path.slice(0,i+1),x:0,y:0})
   if(i)links.set(path[i]+'>'+path[i-1],{from:path[i],to:path[i-1],kind:'hierarchy'})
  })
  const id='passage:'+record.annotation_id
  nodes.set(id,{id,sourceId:record.annotation_id,kind:'passage',label:record.document_name,root,path:[...path,id],x:0,y:0,record})
  links.set(id+'>'+path.at(-1),{from:id,to:path.at(-1)!,kind:'coding'})
 }
 // Only unambiguous saved labels can be joined to the existing exported CSV.
 const names=new Map<string,EvidenceNode[]>()
 for(const node of nodes.values())if(node.kind!=='passage')names.set(node.label,[...(names.get(node.label)??[]),node])
 if(pairs){const a=pairs.head.indexOf('code_a'),b=pairs.head.indexOf('code_b'),count=pairs.head.indexOf('count')
  if(a>=0&&b>=0&&count>=0)for(const row of pairs.rows){const left=names.get(row[a]),right=names.get(row[b]);if(left?.length===1&&right?.length===1&&left[0].id!==right[0].id)links.set('pair:'+left[0].id+'>'+right[0].id,{from:left[0].id,to:right[0].id,kind:'cooccurrence',value:Number(row[count])})}
 }
 return {nodes:[...nodes.values()],links:[...links.values()]}
}

/** Bounded, deterministic display layout; node positions carry no data value. */
export function layoutEvidenceNetwork(input:EvidenceNode[],links:EvidenceLink[]) {
 const nodes=input.map(n=>({...n,vx:0,vy:0})),index=new Map(nodes.map(n=>[n.id,n])),roots=nodes.filter(n=>n.kind==='theme')
 const hash=(id:string)=>[...id].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,7)
 nodes.forEach(node=>{const root=Math.max(0,roots.findIndex(n=>n.sourceId===node.root)),angle=root*2*Math.PI/Math.max(1,roots.length)-Math.PI/2,seed=hash(node.id),jitter=seed%628/100,r=node.kind==='theme'?0:24+seed%76
  node.x=500+Math.cos(angle)*(roots.length===1?0:300)+Math.cos(jitter)*r;node.y=310+Math.sin(angle)*(roots.length===1?0:190)+Math.sin(jitter)*r})
 for(let step=0;step<150;step++){
  const alpha=1-step/170
  for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
   const a=nodes[i],b=nodes[j];let dx=b.x-a.x,dy=b.y-a.y;if(dx===0&&dy===0)dx=.1
   const d=Math.max(64,dx*dx+dy*dy),distance=Math.sqrt(d),radius=(a.kind==='theme'?25:8)+(b.kind==='theme'?25:8)+5,f=450/(d*distance)+Math.max(0,radius-distance)*.12/distance;a.vx-=dx*f;a.vy-=dy*f;b.vx+=dx*f;b.vy+=dy*f
  }
  for(const link of links){if(link.kind==='cooccurrence')continue;const a=index.get(link.from),b=index.get(link.to);if(!a||!b)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,f=(d-(link.kind==='coding'?36:65))*.025;a.vx+=dx/d*f;a.vy+=dy/d*f;b.vx-=dx/d*f;b.vy-=dy/d*f}
  for(const node of nodes){node.vx=(node.vx+(500-node.x)*.001)*.7;node.vy=(node.vy+(310-node.y)*.001)*.7;node.x+=node.vx*alpha;node.y+=node.vy*alpha}
 }
 const minX=Math.min(...nodes.map(n=>n.x)),maxX=Math.max(...nodes.map(n=>n.x)),minY=Math.min(...nodes.map(n=>n.y)),maxY=Math.max(...nodes.map(n=>n.y)),scale=Math.min(860/Math.max(1,maxX-minX),480/Math.max(1,maxY-minY))
 return nodes.map(({vx,vy,...node})=>({...node,x:500+(node.x-(minX+maxX)/2)*scale,y:300+(node.y-(minY+maxY)/2)*scale}))
}
