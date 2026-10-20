import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
const A='a'.repeat(64),B='b'.repeat(64);
function harness(){
 const c=vm.createContext({URLSearchParams,location:{search:'?lang=en'},localStorage:{getItem(){return null},setItem(){}},sessionStorage:{setItem(){}},document:{documentElement:{},addEventListener(){},querySelector(){return null}},window:{addEventListener(){}},fetch:()=>new Promise(()=>{})});
 vm.runInContext(source,c);const run=s=>vm.runInContext(s,c);
 run(`state.config={};state.project={id:'p',name:'Bologna',updated_at:'1',documents:[{id:'d',text:'Bologna evidence'}],codes:[],annotations:[],audit:[],research_report:{current:{content_hash:'frozen'}}};state.projects=[{id:'p',name:'Bologna',updated_at:'1'}];projectVersions.set(state.project,'${A}');globalThis.refreshes=0;refresh=async()=>{refreshes++};`);
 const receipt={format:'qt-save-v1',project_id:'p',base_version:A,version:B,patch:{codes:{op:'splice',start:0,delete:0,items:[{id:'c',name:'New'}]},updated_at:{op:'set',value:'2'}},result:{id:'c',name:'New'},summary:{id:'p',name:'Bologna',updated_at:'2'},backups:[{name:'point.json'}],backup_status:{error:null}};
 return {c,run,receipt,json:s=>JSON.parse(run('JSON.stringify('+s+')'))};
}
test('small committed receipt preserves unchanged source/frozen objects and real backup status',async()=>{
 const h=harness();h.c.receipt=h.receipt;h.run('globalThis.old=state.project;api=async()=>receipt');
 const result=await h.run("saveCoding('codes',{name:'New'})");assert.equal(result.id,'c');assert.equal(h.run('state.project.documents===old.documents'),true);assert.equal(h.run('state.project.research_report===old.research_report'),true);assert.equal(h.run('state.project.codes.length'),1);assert.equal(h.run('state.backups[0].name'),'point.json');assert.equal(h.run('refreshes'),0);assert.equal(h.run('projectVersions.get(state.project)'),B);
});
test('no local saved state appears until committed server response arrives',async()=>{
 const h=harness();h.c.receipt=h.receipt;h.run('api=()=>new Promise(resolve=>{globalThis.finish=resolve})');const task=h.run("saveCoding('codes',{name:'New'})");await Promise.resolve();assert.equal(h.run('state.project.codes.length'),0);h.run('finish(receipt)');await task;assert.equal(h.run('state.project.codes.length'),1);
});
test('server failure leaves project and backup evidence unchanged',async()=>{
 const h=harness();const before=h.run('JSON.stringify(state.project)');h.run("api=async()=>{throw Error('commit failed')}");await assert.rejects(h.run("saveCoding('codes',{})"),/commit failed/);assert.equal(h.run('JSON.stringify(state.project)'),before);assert.equal(h.run('refreshes'),0);
});
test('stale baseline full response applies once without a second GET or mutation replay',async()=>{
 const h=harness();h.receipt.project={id:'p',updated_at:'2',documents:[],codes:[{id:'other'},{id:'c'}],annotations:[]};delete h.receipt.patch;h.c.receipt=h.receipt;h.run('globalThis.calls=0;api=async()=>{calls++;return receipt}');await h.run("saveCoding('codes',{})");assert.equal(h.run('state.project.codes.length'),2);assert.equal(h.run('calls'),1);assert.equal(h.run('refreshes'),0);
});
test('bad baseline/range performs one authoritative refresh and never repeats mutation',async()=>{
 for(const bad of ['baseline','range']){const h=harness();if(bad==='baseline')h.receipt.base_version=B;else h.receipt.patch.codes.start=999;h.c.receipt=h.receipt;h.run('globalThis.calls=0;api=async()=>{calls++;return receipt}');await h.run("saveCoding('codes',{})");assert.equal(h.run('calls'),1);assert.equal(h.run('refreshes'),1);assert.equal(h.run('state.project.codes.length'),0);}
});
test('receipt with wrong project cannot replace active source; failed refresh reports committed status',async()=>{
 const h=harness();h.receipt.project_id='other';h.c.receipt=h.receipt;h.run("api=async()=>receipt;refresh=async()=>{throw Error('network down')}");await assert.rejects(h.run("saveCoding('codes',{})"),/Saved on the server/);assert.equal(h.run('state.project.id'),'p');assert.equal(h.run('state.project.codes.length'),0);
});
test('queued saves use newly acknowledged baseline and cannot apply out of order',async()=>{
 const h=harness();h.c.first=h.receipt;h.c.second={...h.receipt,base_version:B,version:A,patch:{codes:{op:'splice',start:1,delete:0,items:[{id:'c2'}]}}};h.run('globalThis.versions=[];globalThis.n=0;api=async(path,body,options)=>{versions.push(options.compactVersion);return n++?second:first}');await Promise.all([h.run("saveCoding('codes',{})"),h.run("saveCoding('codes',{})")]);assert.deepEqual(h.json('versions'),[A,B]);assert.deepEqual(h.json('state.project.codes.map(c=>c.id)'),['c','c2']);
});
test('switching projects during save never applies old receipt to the new project',async()=>{
 const h=harness();h.c.receipt=h.receipt;h.run('api=()=>new Promise(resolve=>{globalThis.finish=resolve})');const pending=h.run("saveCoding('codes',{})");await Promise.resolve();h.run("state.project={id:'other',documents:[],codes:[],annotations:[]};finish(receipt)");await pending;assert.equal(h.run('state.project.id'),'other');assert.equal(h.run('state.project.codes.length'),0);
});
test('legacy server response falls back to existing refresh path',async()=>{
 const h=harness();h.run("api=async()=>({id:'legacy-code'})");assert.equal((await h.run("saveCoding('codes',{})")).id,'legacy-code');assert.equal(h.run('refreshes'),1);
});
