/** Reading order only: plotting is five scroll scenes, never a timer or a tab gate. */
export const STORY_SCENES = [
 {id:'import',module:'import',no:'01',title:'Start with the source.',body:'Queue TXT or DOCX files. Review progress, retry failures and decide whether to keep a duplicate. Preserve the original words and source ranges.'},
 {id:'coding',module:'coding',no:'02',title:'One passage. One assignment.',body:'Select the words and assign a code with an explicit Theme, Category or Code role. Mark Read or Revisit; compare reading and coding coverage. Keep and Resume preserve your place.'},
 {id:'analysis',module:'analysis',no:'03',title:'Follow the evidence.',body:'Trace a highlighted passage through its code and saved codebook path. Theme and Category appear only when the researcher assigned those roles.'},
 {id:'network',module:'analysis',no:'03',title:'One path. A wider network.',body:'Explore saved connections among passages, codes and assigned roles. Legacy Bologna groups remain explicitly unassigned.'},
 {id:'qca',module:'analysis',no:'03',title:'Cases. Sets. Configurations.',body:'Comparative QCA has its own calibration workflow. Define cases, conditions and an outcome; justify 0 or 1, inspect the truth table and freeze a conservative result. Counts do not become memberships.'},
 {id:'plotting',module:'plotting',plot:'frequency',no:'04',title:'Which codes occur most?',body:'Each bar reads one exported CSV row. Explore the original counts without treating frequency as importance.'},
 {id:'plotting-coverage',module:'plotting',plot:'coverage',no:'04',title:'Across which interviews?',body:'Move the frame across the complete original. Inspect the enlarged cells and their exact exported values.'},
 {id:'plotting-cooccurrence',module:'plotting',plot:'cooccurrence',no:'04',title:'Which codes overlap?',body:'Magnify the original matrix and inspect exported pairs. Cells without a CSV row are labelled explicitly.'},
 {id:'plotting-hierarchy',module:'plotting',plot:'hierarchy',no:'04',title:'Where does each code belong?',body:'Read all 259 saved code rows under their original Bologna groups. Browse eight named bars at a time, or select any exported row.'},
 {id:'plotting-accumulation',module:'plotting',plot:'accumulation',no:'04',title:'What changes as you read?',body:'Follow all 19 Bologna interviews. Read cumulative and newly encountered codes directly from the original CSV.'},
 {id:'export',module:'export',no:'05',title:'From source to a written report.',body:'Export the coded full-text notebook and editable Research report. Keep the selected method, process map, Analysis Table and Narrative Analysis together with figures and reproducible code. Restore the project from JSON.'},
] as const

/** Page keys inside an illustration advance the story; native form controls keep theirs. */
export function pageSceneIndex(key:string,index:number,count:number,tag:string):number|null {
 if(!count||['SELECT','INPUT','TEXTAREA'].includes(tag.toUpperCase()))return null
 if(key==='PageDown')return Math.min(count-1,index+1)
 if(key==='PageUp')return Math.max(0,index-1)
 return null
}
