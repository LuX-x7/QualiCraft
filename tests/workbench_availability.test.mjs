import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
import {proxyWorkbench, workbenchStatus} from '../website/lib/workbench-connection.mjs'

const bootstrap={token:'private-token',projects:[{id:'private-project'}],config:{public_demo:true}}
const request=(path='/w?lang=en',options={})=>new Request('https://qt.example'+path,{headers:{accept:'text/html'},...options})
const deps=(reply)=>({base:'https://backend.example',fetchImpl:reply})

test('a warm HTML navigation streams the original workbench without a holding page',async()=>{
 const result=await proxyWorkbench(request(),[],deps(async()=>new Response('original UI',{headers:{'content-type':'text/html','content-security-policy':"default-src 'self'"}})))
 assert.equal(result.status,200);assert.equal(await result.text(),'original UI');assert.equal(result.headers.get('content-security-policy'),"default-src 'self'")
})
for(const status of [502,503,504])test(`navigation through a transient ${status} gets a bounded connecting page`,async()=>{
 let calls=0;const result=await proxyWorkbench(request(),[],deps(async()=>{calls++;return new Response('platform failure',{status})}))
 const body=await result.text();assert.equal(result.status,200);assert.equal(calls,1);assert.match(body,/Opening the workbench/);assert.match(body,/workbench-connect.js/);assert.match(body,/role="status"/);assert.doesNotMatch(body,/platform failure|backend.example/);assert.equal(result.headers.get('cache-control'),'no-store')
})
test('a stalled navigation is bounded and connection failures use the same recovery page',async()=>{
 let signal;const result=await proxyWorkbench(request(),[],deps(async(_url,options)=>{signal=options.signal;throw Error('secret network address')}))
 assert.ok(signal instanceof AbortSignal);assert.equal(result.status,200);assert.doesNotMatch(await result.text(),/secret/)
})
test('permanent HTTP errors are never disguised as a waking server',async()=>{
 for(const status of [401,403,404,500]){const r=await proxyWorkbench(request(),[],deps(async()=>new Response('failure',{status})));assert.equal(r.status,status);assert.equal(await r.text(),'failure')}
})
test('API writes are sent once with the original body and are never retried or given an HTML success',async()=>{
 const calls=[];const req=request('/w/api/projects', {method:'POST',headers:{'content-type':'application/json','X-QualiCraft-Token':'test','origin':'https://qt.example'},body:'{"name":"copy"}'})
 const r=await proxyWorkbench(req,['api','projects'],deps(async(url,options)=>{calls.push({url,...options});throw Error('private')}))
 assert.equal(calls.length,1);assert.equal(calls[0].method,'POST');assert.equal(new TextDecoder().decode(calls[0].body),'{"name":"copy"}');assert.equal(calls[0].headers.get('origin'),null);assert.equal(calls[0].headers.get('X-QualiCraft-Token'),'test');assert.equal(calls[0].signal,undefined);assert.equal(r.status,502);assert.doesNotMatch(await r.text(),/private/)
})
test('large export API responses keep their status, bytes and unrestricted generation time',async()=>{
 let options;const r=await proxyWorkbench(request('/w/api/projects/x/plot-bundle'),['api','projects','x','plot-bundle'],deps(async(_url,o)=>{options=o;return new Response('zip bytes',{headers:{'content-type':'application/zip'}})}))
 assert.equal(options.signal,undefined);assert.equal(await r.text(),'zip bytes');assert.equal(r.headers.get('content-type'),'application/zip')
})
test('readiness checks validate the real bootstrap and disclose no token or project data',async()=>{
 let options;const r=await workbenchStatus(deps(async(url,o)=>{options=o;assert.equal(url,'https://backend.example/w/api/bootstrap');return Response.json(bootstrap)}))
 assert.deepEqual(await r.json(),{ready:true,retryable:false});assert.equal(options.redirect,'manual');assert.ok(options.signal instanceof AbortSignal);assert.equal(r.headers.get('cache-control'),'no-store')
})
test('readiness distinguishes temporary faults from configuration errors and rejects unrelated HTML/JSON',async()=>{
 for(const status of [502,503,504])assert.deepEqual(await (await workbenchStatus(deps(async()=>new Response('platform',{status})))).json(),{ready:false,retryable:true})
 for(const status of [401,403,404])assert.deepEqual(await (await workbenchStatus(deps(async()=>new Response('',{status})))).json(),{ready:false,retryable:false})
 for(const body of [{ok:true}, {...bootstrap,token:''}, {...bootstrap,config:[]}])assert.deepEqual(await (await workbenchStatus(deps(async()=>Response.json(body)))).json(),{ready:false,retryable:false})
})
test('readiness network failures remain recoverable without reflecting error details',async()=>{
 const r=await workbenchStatus(deps(async()=>{throw Error('secret')}));assert.deepEqual(await r.json(),{ready:false,retryable:true})
})
test('a provider waking page served as HTTP 200 is not mistaken for a ready backend',async()=>{
 const r=await workbenchStatus(deps(async()=>new Response('<html>loading</html>',{headers:{'content-type':'text/html'}})))
 assert.deepEqual(await r.json(),{ready:false,retryable:true})
 const nav=await proxyWorkbench(request(),[],deps(async()=>new Response('loading',{headers:{'x-render-routing':'no-deploy'}})))
 assert.equal(nav.headers.get('x-qt-workbench'),'connecting')
})
test('API transient errors retain their error status and never become a successful holding page',async()=>{
 const r=await proxyWorkbench(request('/w/api/projects'),['api','projects'],deps(async()=>new Response('offline',{status:503})))
 assert.equal(r.status,503);assert.equal(await r.text(),'offline')
})

function client(replies){
 const timers=[],logs=[],handlers={},elements=new Map(['connection-status','retry-connection'].map(id=>[id,{textContent:'',hidden:false,addEventListener(type,fn){handlers[id+type]=fn}}]));let reloads=0,calls=0,time=0
 const scope={document:{getElementById:id=>elements.get(id),visibilityState:'visible'},window:{location:{reload(){reloads++}},addEventListener(type,fn){handlers[type]=fn}},fetch:async()=>{const value=replies[Math.min(calls++,replies.length-1)];if(value instanceof Error)throw value;return {ok:true,json:async()=>value}},AbortSignal,Date:{now:()=>time},setTimeout:(fn,ms)=>{timers.push({fn,ms})},clearTimeout(){},console:{error:(...v)=>logs.push(v)}}
 vm.runInNewContext(readFileSync(new URL('../website/public/workbench-connect.js',import.meta.url),'utf8'),scope)
 return {elements,timers,handlers,logs,get calls(){return calls},get reloads(){return reloads},async settle(){for(let i=0;i<10;i++)await Promise.resolve()},async tick(ms=5000){time+=ms;timers.shift()?.fn();await this.settle()}}
}
test('connecting client retries only until real readiness, then reloads the same URL',async()=>{
 const c=client([{ready:false,retryable:true},{ready:true}]);await c.settle();assert.equal(c.reloads,0);assert.equal(c.timers.length,1);await c.tick();assert.equal(c.reloads,1);assert.equal(c.calls,2);assert.equal(c.timers.length,0)
})
test('connecting client stops after two minutes and offers explicit retry instead of an endless spinner',async()=>{
 const c=client([{ready:false,retryable:true}]);await c.settle();await c.tick(120001);assert.equal(c.timers.length,0);assert.equal(c.reloads,0);assert.equal(c.elements.get('retry-connection').hidden,false);assert.match(c.elements.get('connection-status').textContent,/unavailable/i)
 c.handlers['retry-connectionclick']();await c.settle();assert.ok(c.timers.length>0)
})
test('permanent readiness failure stops immediately; no automatic reload loop',async()=>{
 const c=client([{ready:false,retryable:false}]);await c.settle();assert.equal(c.timers.length,0);assert.equal(c.reloads,0);assert.equal(c.elements.get('retry-connection').hidden,false)
})
