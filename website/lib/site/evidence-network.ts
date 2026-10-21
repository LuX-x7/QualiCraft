import type {SavedCoding,RecordNode} from './record-network'
import type { ChartTable } from '../report/chart-model'
export type EvidenceNode={id:string;sourceId:string;kind:RecordNode['kind'];label:string;root:string;path:string[];x:number;y:number;record?:SavedCoding}
export type EvidenceLink={from:string;to:string;kind:'hierarchy'|'coding'|'cooccurrence';value?:number}
const savedNodeKind=(node:SavedCoding['code_path'][number],leaf=false):RecordNode['kind']=>node.research_role??(leaf?'code':'group')
const savedNodeId=(node:SavedCoding['code_path'][number],leaf=false)=>`${savedNodeKind(node,leaf)}:${node.id}`

/** A view of saved paths and exported pairs. No counts are recalculated. */
export function evidenceNetwork(records:SavedCoding[],pairs?:ChartTable) {
 const nodes=new Map<string,EvidenceNode>(),links=new Map<string,EvidenceLink>()
 for(const record of records){
  if(!record.code_path.length||record.code_path.at(-1)?.id!==record.code_id||new Set(record.code_path.map(n=>n.id)).size!==record.code_path.length)throw new Error('Invalid saved path')
  const root=record.code_path[0].id,path=record.code_path.map((n,i)=>savedNodeId(n,i===record.code_path.length-1))
  record.code_path.forEach((node,i)=>{
   if(!nodes.has(path[i]))nodes.set(path[i],{id:path[i],sourceId:node.id,kind:savedNodeKind(node,i===record.code_path.length-1),label:node.name,root,path:path.slice(0,i+1),x:0,y:0})
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

/** A radial tree per saved family. Positions are display geometry, never data. */
export function layoutEvidenceNetwork(input:EvidenceNode[],links:EvidenceLink[]) {
 const nodes=input.map(node=>({...node})),index=new Map(nodes.map(node=>[node.id,node]))
 const roots=nodes.filter(node=>node.path.length===1&&node.kind!=='passage')
 const children=new Map<string,string[]>()
 for(const edge of links)if(edge.kind!=='cooccurrence'&&index.has(edge.from)&&index.has(edge.to))children.set(edge.to,[...(children.get(edge.to)??[]),edge.from])
 for(const ids of children.values())ids.sort((a,b)=>index.get(a)!.label.localeCompare(index.get(b)!.label)||a.localeCompare(b))
 const columns=roots.length>1?Math.min(3,roots.length):1,rows=Math.ceil(roots.length/columns)
 roots.forEach((root,family)=>{
  const familyNodes=nodes.filter(node=>node.root===root.sourceId),leaves=familyNodes.filter(node=>!children.get(node.id)?.length)
  const leafOrder=new Map(leaves.sort((a,b)=>a.id.localeCompare(b.id)).map((node,i)=>[node.id,i]))
  const angleFor=(id:string):number=>{const branch=children.get(id)??[];return branch.length?branch.reduce((sum,child)=>sum+angleFor(child),0)/branch.length:(leafOrder.get(id)??0)}
  const cx=columns===1?500:70+(family%columns+.5)*860/columns,cy=rows===1?310:60+(Math.floor(family/columns)+.5)*480/rows
  const radiusX=columns===1?355:Math.min(120,370/columns),radiusY=rows===1?220:Math.min(105,220/rows)
  const maxDepth=Math.max(1,...familyNodes.map(node=>node.path.length-1))
  for(const node of familyNodes){const depth=node.path.length-1,angle=-Math.PI/2+2*Math.PI*(angleFor(node.id)+.5)/Math.max(1,leaves.length),radius=depth/maxDepth
   node.x=cx+Math.cos(angle)*radiusX*radius;node.y=cy+Math.sin(angle)*radiusY*radius
  }
 })
 return nodes
}
