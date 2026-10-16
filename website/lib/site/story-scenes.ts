/** Reading order only: plotting is five scroll scenes, never a timer or a tab gate. */
export const STORY_SCENES = [
 {id:'import',module:'import',no:'01',title:'Start with the source.',body:'Bring a document into a readable workspace. Keep the original words and their source ranges.'},
 {id:'coding',module:'coding',no:'02',title:'Select words. Attach meaning.',body:'Explore the highlighted source, its saved code and its codebook position. The original words and Unicode range stay together.'},
 {id:'analysis',module:'analysis',no:'03',title:'Explore the relationship network.',body:'Hover a theme, code or source node. Trace its real saved links and read the highlighted passage behind them. Change themes to explore other existing examples.'},
 {id:'plotting',module:'plotting',plot:'frequency',no:'04.1',title:'Which codes occur most?',body:'Each bar reads one exported CSV row. Explore the original counts without treating frequency as importance.'},
 {id:'plotting-coverage',module:'plotting',plot:'coverage',no:'04.2',title:'Across which interviews?',body:'Read large cells in a detail window. The overview keeps the full 19 × 15 matrix in view; every value comes from the saved CSV.'},
 {id:'plotting-cooccurrence',module:'plotting',plot:'cooccurrence',no:'04.3',title:'Which codes overlap?',body:'Inspect the exported pairs. Blank cells have no exported value; no diagonal or reverse pair is invented.'},
 {id:'plotting-hierarchy',module:'plotting',plot:'hierarchy',no:'04.4',title:'Where does each code belong?',body:'Read the saved code rows under each theme. Browse eight named bars at a time, or select any of the 259 exported rows.'},
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
