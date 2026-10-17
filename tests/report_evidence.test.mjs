import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../web/app.js',import.meta.url),'utf8');
const frozen={id:'a',document_id:'d',code_id:'c',sha256:'verified-sha',quote:'saved passage',start:10,end:23};
for(const [name,change] of [
  ['reassigned code',p=>p.annotations[0].code_id='another-code'],
  ['moved document with identical text',p=>p.annotations[0].document_id='another-document'],
  ['changed quotation',p=>p.annotations[0].quote='changed words'],
  ['changed source fingerprint',p=>p.documents[0].sha256='changed-sha'],
  ['changed range',p=>p.annotations[0].start=11],
  ['deleted annotation',p=>p.annotations=[]],
]) {
  test(`report source jump refuses ${name} before changing the workspace`,async()=>{
    const document={documentElement:{},addEventListener(){},querySelector(){return null;},querySelectorAll(){return [];}};
    const context=vm.createContext({URLSearchParams,location:{search:'?lang=en'},document,window:{addEventListener(){}},fetch:()=>new Promise(()=>{})});
    vm.runInContext(source,context);
    const project={id:'p',documents:[{id:'d',sha256:frozen.sha256}],annotations:[{...frozen}]};change(project);
    context.liveProject=project;context.evidence=frozen;
    vm.runInContext("api=async()=>liveProject;closed=false;closeModal=()=>{closed=true};state.project={id:'p',documents:[]};state.docId='original-document';state.search='original-filter'",context);
    await assert.rejects(vm.runInContext('locateReportEvidence(evidence)',context));
    assert.equal(vm.runInContext('closed',context),false);
    assert.equal(vm.runInContext('state.docId',context),'original-document');
    assert.equal(vm.runInContext('state.search',context),'original-filter');
  });
}
