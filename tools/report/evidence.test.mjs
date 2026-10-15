import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
const require=createRequire(new URL('../../website/package.json',import.meta.url))
const ts=require('typescript')
const read=name=>JSON.parse(readFileSync(new URL(name,import.meta.url),'utf8'))
const source=read('../../website/lib/report/bologna-evidence.json'), home=read('../../website/lib/site/bologna-evidence.json')
const raw=readFileSync(new URL('../../website/public/report/manifest.json',import.meta.url),'utf8')
const tables=Object.fromEntries(Object.entries(source.rows).map(([kind,rows])=>[kind,{head:[],rows:rows.map(r=>r.row)}]))
const js=ts.transpileModule(readFileSync(new URL('../../website/lib/report/evidence.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText
function load(index=source,baseline=home){const exports={};new Function('require','exports',js)(name=>name==='./bologna-evidence.json'?index:name==='@/lib/site/bologna-evidence.json'?baseline:require(name),exports);return exports.reportEvidence}
test('reviewed example index binds to exact manifest bytes and all CSV rows',()=>{assert.equal(load()(raw,tables).available,true)})
test('another manifest version cannot attach old quotations',()=>{assert.equal(load()(raw+'\n',tables).available,false)})
test('a changed row or missing annotation disables source examples',()=>{const rows=structuredClone(tables);rows.frequency.rows[0]=['other','23'];assert.equal(load()(raw,rows).available,false);const index=structuredClone(source);delete index.examples[index.rows.frequency[0].annotation_ids[0]];assert.equal(load(index)(raw,tables).available,false)})
test('changed database/project source binding disables examples',()=>{for(const key of ['database_sha256','project_sha256']){const baseline=structuredClone(home);baseline.provenance[key]='other';assert.equal(load(source,baseline)(raw,tables).available,false)}})
