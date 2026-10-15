/** Reading order only: plotting is five scroll scenes, never a timer or a tab gate. */
export const STORY_SCENES = [
 {id:'import',module:'import',no:'01',title:'Start with the source.',body:'Bring a document into a readable workspace. Keep the original words and their source ranges.'},
 {id:'coding',module:'coding',no:'02',title:'Passage. Code. Theme.',body:'Trace one saved connection. Select the highlighted words, the code or either theme node to inspect the relationship.'},
 {id:'analysis',module:'analysis',no:'03',title:'Every connection has a source.',body:'Follow the highlighted path in either direction. The full project map lives in Insights; this is one saved Bologna coding.'},
 {id:'plotting',module:'plotting',plot:'frequency',no:'04.1',title:'Which codes occur most?',body:'Each bar reads one exported CSV row. Explore the original counts without treating frequency as importance.'},
 {id:'plotting-coverage',module:'plotting',plot:'coverage',no:'04.2',title:'Across which interviews?',body:'See all 19 interview columns and 15 code rows together. Select a cell to read its exact saved count.'},
 {id:'plotting-cooccurrence',module:'plotting',plot:'cooccurrence',no:'04.3',title:'Which codes overlap?',body:'Inspect the exported pairs. Blank cells have no exported value; no diagonal or reverse pair is invented.'},
 {id:'plotting-hierarchy',module:'plotting',plot:'hierarchy',no:'04.4',title:'Where does each code belong?',body:'Each dot is one of 259 exported code rows, grouped under its saved theme. Select a dot to read its name and count.'},
 {id:'plotting-accumulation',module:'plotting',plot:'accumulation',no:'04.5',title:'What changes as you read?',body:'Follow all 19 interview steps. Read cumulative and newly encountered codes directly from the saved CSV.'},
 {id:'export',module:'export',no:'05',title:'Take the record with you.',body:'Choose a project, coding table, matrix or methods record. Each file has a clear purpose.'},
] as const

/** Page keys inside an illustration advance the story; native form controls keep theirs. */
export function pageSceneIndex(key:string,index:number,count:number,tag:string):number|null {
 if(!count||['SELECT','INPUT','TEXTAREA'].includes(tag.toUpperCase()))return null
 if(key==='PageDown')return Math.min(count-1,index+1)
 if(key==='PageUp')return Math.max(0,index-1)
 return null
}
