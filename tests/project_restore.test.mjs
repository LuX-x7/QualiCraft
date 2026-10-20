import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
function harness(){
 const listeners=[],requests=[],errors=[],created=[];
 const c=vm.createContext({URLSearchParams,location:{search:'?lang=en'},localStorage:{getItem(){return null},setItem(){}},sessionStorage:{setItem(){}},document:{documentElement:{},addEventListener(type,fn){if(type==='change')listeners.push(fn)},querySelector(){return null}},window:{QT_BASE:'/w',addEventListener(){}},fetch:()=>new Promise(()=>{})});
 vm.runInContext(source,c);const run=s=>vm.runInContext(s,c);run("state.config={};state.token='local-test-token';");
 c.captureCreated=(body,raw)=>created.push({body,raw});c.captureError=e=>errors.push(e.message);
 const upload=listeners.find(fn=>fn.toString().includes("e.target.id==='restore-file'"));assert.ok(upload);
 const file=(text,size=new TextEncoder().encode(text).length)=>({size,async text(){return text}});
 async function select(f){await upload({target:{id:'restore-file',files:[f],dataset:{},matches(){return false}}})}
 function stubCreate(){run('createProject=async(body,raw)=>captureCreated(body,raw);errorDisplay=captureError;')}
 return {c,run,requests,errors,created,file,select,stubCreate};
}
const raw='{ "value": 1.0, "exponent": 1e0, "negative": -0.0, "text": "Bologna 🧪" }';
test('file chooser sends original JSON text without a browser numeric roundtrip',async()=>{const h=harness();h.stubCreate();await h.select(h.file(raw));assert.deepEqual(h.created,[{body:raw,raw:true}]);assert.deepEqual(h.errors,[])});
test('raw API preserves exact JSON bytes and existing auth and proxy prefix',async()=>{const h=harness();h.c.input=raw;h.c.fetch=async(url,options)=>{h.requests.push({url,...options});return {ok:true,json:async()=>({id:'restored'})}};await h.run("api('/api/projects/restore',input,{rawJson:true})");assert.equal(h.requests[0].url,'/w/api/projects/restore');assert.equal(h.requests[0].body,raw);assert.equal(h.requests[0].method,'POST');assert.equal(h.requests[0].headers['X-QualiCraft-Token'],'local-test-token');assert.equal(h.requests[0].headers['Content-Type'],'application/json')});
test('normal object requests keep their existing JSON protocol',async()=>{const h=harness();h.c.fetch=async(url,options)=>{h.requests.push({url,...options});return {ok:true,json:async()=>({})}};await h.run("api('/api/projects',{kind:'empty',name:'Bologna copy'})");assert.equal(h.requests[0].body,'{"kind":"empty","name":"Bologna copy"}')});
test('read-only public workspace refuses raw restore before fetch',async()=>{const h=harness();h.run('state.config.public_demo=true');h.c.fetch=()=>{throw Error('must not fetch')};await assert.rejects(h.run("api('/api/projects/restore','{}',{rawJson:true})"),/read-only/i)});
test('oversize file fails before reading or sending content',async()=>{const h=harness();h.stubCreate();await h.select({size:20_000_001,text(){throw Error('must not read')}});assert.deepEqual(h.created,[]);assert.match(h.errors[0],/20 MB/)});
test('empty file fails clearly before any restore request',async()=>{const h=harness();h.stubCreate();await h.select(h.file(''));assert.deepEqual(h.created,[]);assert.match(h.errors[0],/empty/i)});
test('malformed JSON is passed unmodified to the authoritative server validator',async()=>{const h=harness();h.stubCreate();await h.select(h.file('{broken'));assert.deepEqual(h.created,[{body:'{broken',raw:true}]);assert.deepEqual(h.errors,[])});
test('integrity rejection is surfaced without a retry or client-side rehash',async()=>{const h=harness();h.run("createProject=async()=>{throw Error('QCA integrity validation failed')};errorDisplay=captureError;");await h.select(h.file(raw));assert.deepEqual(h.errors,['QCA integrity validation failed'])});

test('large frozen JSON uses gzip transport without rewriting source numbers or text',async()=>{
 const {gunzipSync}=await import('node:zlib');const h=harness();
 Object.assign(h.c,{CompressionStream,Blob,Response});
 const original=raw+' '.repeat(70000);h.c.input=original;
 h.c.fetch=async(url,options)=>{h.requests.push({url,...options});return {ok:true,json:async()=>({})}};
 await h.run("api('/api/projects/restore',input,{rawJson:true})");
 assert.equal(h.requests[0].headers['Content-Encoding'],'gzip');
 assert.equal(gunzipSync(Buffer.from(h.requests[0].body)).toString('utf8'),original);
 assert.ok(h.requests[0].body.byteLength<original.length/2);
});
test('older browsers retain uncompressed large raw restore fallback',async()=>{
 const h=harness(),original=raw+' '.repeat(70000);h.c.input=original;
 h.c.fetch=async(url,options)=>{h.requests.push(options);return {ok:true,json:async()=>({})}};
 await h.run("api('/api/projects/restore',input,{rawJson:true})");
 assert.equal(h.requests[0].body,original);assert.equal(h.requests[0].headers['Content-Encoding'],undefined);
});
test('post-save refresh starts independent reads together and renders only after all settle',async()=>{
 const h=harness();h.run("state.project={id:'p'};globalThis.started=[];globalThis.resolvers=[];globalThis.renders=0;api=path=>new Promise(resolve=>{started.push(path);resolvers.push(resolve)});loadBackups=()=>api('backups');render=()=>{renders++}");
 const pending=h.run('refresh()');assert.deepEqual(Array.from(h.run('started')),['/w/api/projects/p','/api/projects','backups']);assert.equal(h.run('renders'),0);
 h.run("resolvers[0]({id:'p',name:'saved'});resolvers[1]([{id:'p'}]);resolvers[2]({})");await pending;
 assert.equal(h.run('state.project.name'),'saved');assert.equal(h.run('renders'),1);
});
test('created restore response is reused when opening Coding instead of downloading the project twice',async()=>{
 const h=harness();h.run("globalThis.requestsMade=[];api=async(path)=>{requestsMade.push(path);return path==='/api/projects'?[]:{id:'restored',documents:[]}};globalThis.opened=null;loadProject=async(id,created)=>{opened={id,created}};closeModal=()=>{};toast=()=>{}");
 await h.run("createProject('{}',true)");assert.equal(h.run('opened.id'),'restored');assert.equal(h.run('opened.created.id'),'restored');assert.deepEqual(Array.from(h.run('requestsMade')),['/api/projects/restore','/api/projects']);
});
