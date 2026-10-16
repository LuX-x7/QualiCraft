import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
function workspace(){
 const handlers=[];
 const c=vm.createContext({crypto:webcrypto,URLSearchParams,location:{search:'?lang=en'},localStorage:{getItem(){return null}},sessionStorage:{setItem(){}},document:{documentElement:{},addEventListener(type,fn){handlers.push([type,fn])},querySelector(){return null}},window:{addEventListener(){}},setTimeout(){},clearTimeout(){},fetch:()=>new Promise(()=>{})});vm.runInContext(source,c);const run=s=>vm.runInContext(s,c);
 run(`state.project={id:'p1',updated_at:'2026',audit:[],blocks:[],suggestions:[],codes:[],annotations:[],documents:[{id:'d1',name:'Bologna marker fixture',sha256:'abc',text:'abc',reading_state:{source_sha256:'abc',source_length:3,revision:0,marks:[]}},{id:'d2',name:'Bologna second fixture',sha256:'def',text:'def',reading_state:{source_sha256:'def',source_length:3,revision:0,marks:[]}}]};state.docId='d1';readingMarkTarget={projectId:'p1',documentId:'d1',source_sha256:'abc',start:0,end:3,index:0};globalThis.calls=[];globalThis.reply=null;api=(path,body)=>{calls.push({path,body});return new Promise(resolve=>reply=resolve)};`);
 return {run,json:s=>JSON.parse(run(`JSON.stringify(${s})`)),handlers};
}
test('manual marks remain absent while a write is pending and late replies stay on their source document',async()=>{
 const w=workspace(),pending=w.run("saveReadingMark('read')");assert.equal(w.run("paragraphMark(doc(),0)"),'unmarked');assert.equal(w.run('readingWrites.size'),1);
 w.run("state.docId='d2';reply({document_id:'d1',changed:true,before:'unmarked',updated_at:'2027',reading_state:{source_sha256:'abc',source_length:3,revision:1,marks:[{start:0,end:3,status:'read'}]}})");await pending;
 assert.equal(w.run("paragraphMark(doc(),0)"),'unmarked');assert.equal(w.run("paragraphMark(state.project.documents[0],0)"),'read');assert.equal(w.run('readingWrites.size'),0);
});
test('failure retries the same explicit request ID and does not claim a saved mark',async()=>{
 const w=workspace();w.run("api=async(path,body)=>{calls.push({path,body});throw Error('offline')}");await w.run("saveReadingMark('read')");
 assert.equal(w.run("paragraphMark(doc(),0)"),'unmarked');const before=w.json('calls[0].body');
 w.run("api=async(path,body)=>{calls.push({path,body});return {document_id:'d1',changed:true,before:'unmarked',updated_at:'2027',reading_state:{source_sha256:'abc',source_length:3,revision:1,marks:[{start:0,end:3,status:'read'}]},audit_event:{id:'a',before:'unmarked',revision:1}}}");
 await w.run("saveReadingMark('read',{retry:readingFailures.get(markKey('p1','d1')).retry})");assert.deepEqual(w.json('calls[1].body'),before);assert.equal(w.run("paragraphMark(doc(),0)"),'read');assert.equal(w.run("readingUndos.get(markKey('p1','d1')).status"),'unmarked');
});
test('old project/revision responses cannot overwrite current marks',()=>{
 const w=workspace();w.run('doc().reading_state.revision=3');assert.equal(w.run("acceptReadingResponse('p1',{document_id:'d1',reading_state:{revision:1}})"),false);assert.equal(w.run("acceptReadingResponse('other',{document_id:'d1',reading_state:{revision:4}})"),false);assert.equal(w.run('doc().reading_state.revision'),3);
});
test('conflicts load authoritative state and require a fresh choice without retrying automatically',async()=>{
 const w=workspace();w.run("api=async(path,body)=>{calls.push({path,body});if(body){const e=Error('conflict');e.status=409;throw e}return {updated_at:'2027',documents:[{id:'d1',reading_state:{source_sha256:'abc',source_length:3,revision:2,marks:[{start:0,end:3,status:'revisit'}]}}]}}");await w.run("saveReadingMark('read')");assert.equal(w.run('calls.length'),2);assert.equal(w.run("paragraphMark(doc(),0)"),'revisit');assert.equal(w.run("readingFailures.get(markKey('p1','d1')).retry"),undefined);
});
test('if conflict refresh fails, Retry only fetches latest metadata and never repeats the rejected edit',async()=>{
 const w=workspace();w.run("api=async(path,body)=>{calls.push({path,body});if(body){const e=Error('conflict');e.status=409;throw e}throw Error('offline')}");await w.run("saveReadingMark('read')");assert.equal(w.run("readingFailures.get(markKey('p1','d1')).blocked"),true);
 w.run("api=async(path,body)=>{calls.push({path,body});return {updated_at:'2027',documents:[{id:'d1',reading_state:{source_sha256:'abc',source_length:3,revision:2,marks:[{start:0,end:3,status:'revisit'}]}}]}}");await w.run("refreshReadingMarks('p1','d1')");assert.equal(w.run('calls.filter(c=>c.body).length'),1);assert.equal(w.run("paragraphMark(doc(),0)"),'revisit');assert.equal(w.run("readingFailures.get(markKey('p1','d1')).blocked"),undefined);
});
test('stale metadata is inactive; controls and policy are available independently of capability blocks',()=>{
 const w=workspace();w.run("doc().reading_state.source_sha256='old';doc().reading_state.marks=[{start:0,end:3,status:'read'}]");assert.equal(w.run("paragraphMark(doc(),0)"),'unmarked');const html=w.run('codingView()');assert.match(html,/id="reading-mark-status"/);assert.match(html,/reading-mark-undo/);assert.match(html,/next snapshot/);assert.match(html,/format v5/);assert.doesNotMatch(html,/data-action="reading-overview"/);
});
test('a focused paragraph clipped below the desktop reader is not the visible mark target',()=>{
 const w=workspace();w.run("readingFocusedStart=0;window.innerHeight=900;globalThis.fakeParagraph={dataset:{start:'0'},getBoundingClientRect:()=>({top:880,bottom:940})};document.querySelectorAll=()=>[fakeParagraph];document.querySelector=s=>({getBoundingClientRect:()=>s==='#document-pane'?({top:100,bottom:875}):({bottom:100})})");
 assert.equal(w.run('visibleReadingFocus()'),null);
 w.run("fakeParagraph.getBoundingClientRect=()=>({top:200,bottom:260})");assert.equal(w.run('visibleReadingFocus()===fakeParagraph'),true);
});
