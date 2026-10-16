export type SavedCoding = { annotation_id:string; document_id:string; document_name:string; document_sha256:string; start:number; end:number; quote:string; source:string; code_id:string; code_path:{id:string;name:string;definition:string}[] }
export type RecordNode = { id:string; sourceId:string; kind:'theme'|'code'|'passage'; label:string; x:number; y:number }

/** Choose brief, existing evidence records; this does not calculate research statistics. */
export function networkExamples(records:SavedCoding[],preferred:SavedCoding):SavedCoding[] {
 const chosen:SavedCoding[]=[],seen=new Set<string>(),counts=new Map<string,number>()
 const ordered=[preferred,...[...records].sort((a,b)=>a.quote.length-b.quote.length||a.annotation_id.localeCompare(b.annotation_id))]
 for(const record of ordered){if(!record.code_path.length||record.code_path.at(-1)?.id!==record.code_id||new Set(record.code_path.map(n=>n.id)).size!==record.code_path.length)throw new Error('Invalid saved path');const root=record.code_path[0].id
  if(seen.has(record.code_id)||(counts.get(root)??0)>=3)continue
  chosen.push(record);seen.add(record.code_id);counts.set(root,(counts.get(root)??0)+1)
 }
 return chosen
}
export function recordFamily(records:SavedCoding[],rootId:string) {
 const examples=records.filter(e=>e.code_path[0].id===rootId),nodes=new Map<string,RecordNode>(),edges=new Map<string,{from:string;to:string}>()
 const key=(id:string)=>id===rootId?`theme:${id}`:`code:${id}`
 examples.forEach((record,index)=>{if(!record.code_path.length||record.code_path.at(-1)?.id!==record.code_id||new Set(record.code_path.map(n=>n.id)).size!==record.code_path.length)throw new Error('Invalid saved path');const y=50+index*105
  record.code_path.forEach((node,depth)=>{const id=key(node.id)
   const theme=depth<record.code_path.length-1
   nodes.set(id,{id,sourceId:node.id,kind:theme?'theme':'code',label:node.name,x:depth===0?110:depth===record.code_path.length-1?545:320,y:depth===0?155:y})
   if(depth){const to=key(record.code_path[depth-1].id);edges.set(`${id}>${to}`,{from:id,to})}
  })
  const id=`passage:${record.annotation_id}`,to=key(record.code_id)
  nodes.set(id,{id,sourceId:record.annotation_id,kind:'passage',label:record.document_name,x:790,y})
  edges.set(`${id}>${to}`,{from:id,to})
 })
 const parents=[...nodes.values()].filter(n=>n.x===320)
 parents.forEach((node,i)=>{node.y=parents.length===1?155:50+i*210/(parents.length-1)})
 return {examples,nodes:[...nodes.values()],edges:[...edges.values()],key}
}

export function exampleContains(record:SavedCoding,nodeId:string) {
 return nodeId===`passage:${record.annotation_id}`||record.code_path.some(node=>nodeId===`theme:${node.id}`||nodeId===`code:${node.id}`)
}
