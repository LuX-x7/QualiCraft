import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
function context(){
  const els={'#coded-scope':{value:'current'},'#coded-document-list':{},'#coded-scope-summary':{},'#coded-version-status':{isConnected:true}};
  const buttons=[{},{}];let selected=[];
  const document={documentElement:{},addEventListener(){},querySelector:s=>els[s]||null,querySelectorAll:s=>s.includes('coded-document')?selected:s.includes('download-coded')?buttons:[]};
  let version='v1';
  const c=vm.createContext({URLSearchParams,location:{search:'?lang=en'},sessionStorage:{setItem(){}},document,window:{addEventListener(){}},fetch:url=>url.includes('bootstrap')?new Promise(()=>{}):Promise.resolve({ok:true,json:async()=>({version})})});
  vm.runInContext(source,c);const run=s=>vm.runInContext(s,c);
  run("state.project={id:'p',documents:[{id:'d1',name:'First'},{id:'d2',name:'Second'}]};state.docId='d1';state.token='private-token';");
  return {run,els,buttons,select(ids){selected=ids.map(value=>({value}));},version(v){version=v;}};
}
test('default selection exports the whole current document',()=>{const c=context();assert.equal(c.run('JSON.stringify(transcriptSelection())'),'["d1"]');});
test('all documents omit the selection parameter',()=>{const c=context();c.els['#coded-scope'].value='all';assert.equal(c.run('transcriptSelection()'),null);assert.equal(c.run("transcriptParams('coded-html',null,false)"),'format=coded-html&memos=0');});
test('multiple stable IDs are safely encoded without search state',()=>{const c=context();const result=c.run("transcriptParams('coded-docx',['id1','id2'],true)");assert.equal(result,'format=coded-docx&memos=1&document_id=id1&document_id=id2');assert(!result.includes('token'));});
test('empty selected scope disables both export buttons',()=>{const c=context();c.els['#coded-scope'].value='selected';c.select([]);c.run('refreshTranscriptScope()');assert(c.buttons.every(b=>b.disabled));assert.equal(c.els['#coded-document-list'].hidden,false);});
test('selected scope has an explicit full text summary',()=>{const c=context();c.els['#coded-scope'].value='selected';c.select(['d2']);c.run('refreshTranscriptScope()');assert.match(c.els['#coded-scope-summary'].textContent,/Full text.*1.*Second/);assert(c.buttons.every(b=>!b.disabled));});
test('a changed frozen version is marked stale without updating the old file',async()=>{const c=context();c.run("lastTranscriptExport={projectId:'p',ids:['d1'],memos:false,filename:'old.html',version:'v0'}");await c.run('checkTranscriptVersion()');assert.match(c.els['#coded-version-status'].textContent,/Evidence changed/);assert.equal(c.run('lastTranscriptExport.version'),'v0');});
test('same version and project are checked without cross-project reuse',async()=>{const c=context();c.run("lastTranscriptExport={projectId:'p',ids:null,memos:false,filename:'current.html',version:'v1'}");await c.run('checkTranscriptVersion()');assert.match(c.els['#coded-version-status'].textContent,/Current evidence version/);c.els['#coded-version-status'].textContent='untouched';c.run("state.project.id='another'");await c.run('checkTranscriptVersion()');assert.equal(c.els['#coded-version-status'].textContent,'untouched');});
