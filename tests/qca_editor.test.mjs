import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('../web/qca-editor.js',import.meta.url),'utf8'),context);const api=context.window.QTQCA;
const run={id:'saved1',created_at:'2026-10-18',input_revision:2,design:{cases:[{id:'c1',label:'<script>bad</script>'}]},result:{conditions:['A'],outcome:'Y',target:1,options:{n_cut:1,ic1:1,ic0:1},optimisation:'minimum terms',warnings:[],solutions:[{expression:'A',terms:['1'],consistency:1,coverage:1,unique_coverage:{1:1},cases:['c1'],negative_cases:[]}],truth_table:[{configuration:'1',n:1,positive:1,negative:0,consistency:1,label:'1',mixed:false,cases:['c1']}],prime_implicants:[{cube:'1',expression:'A',consistency:1,raw_coverage:1,configurations:['1'],cases:['c1']}],necessity:[{literal:'A',consistency:1,coverage:1,counterexample_cases:[]}]}};
test('QCA set definitions never pre-fill calibration rules',()=>{const d=api.definition('A');assert.equal(d.id,'A');for(const key of ['definition','zero_rule','one_rule','basis'])assert.equal(d[key],'');});
test('empty results require explicit saved calibration',()=>{assert.match(api.resultHTML(null),/Missing memberships never become zero/);});
test('QCA computed report separates undefined from zero',()=>{assert.equal(api.ratio(null),'undefined');assert.equal(api.ratio(0),'0');assert.equal(api.ratio(1/3),'0.333333');});
test('calibrated identities and result labels are escaped',()=>{const html=api.resultHTML(run);assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;bad&lt;/script&gt;'));assert(html.includes('data-case="c1"'));assert(html.includes('Complete QCA truth table'));assert(html.includes('Necessary')===false);});
test('report result has no dead case action buttons',()=>{assert(!api.resultHTML(run,false).includes('data-qca-action="inspect"'));assert(api.resultHTML(run).includes('data-qca-action="inspect"'));});
test('outcome direction remains explicit in displayed results',()=>{const other=structuredClone(run);other.result.target=0;assert.match(api.resultHTML(other),/Y = 0/);assert.match(api.resultHTML(run),/Y = 1/);});
test('run guard preserves zero membership and rejects missing calibration before requests',()=>{
 const definition=id=>({id,label:id,definition:'definition',zero_rule:'out',one_rule:'in',basis:'basis'});
 const d={question:'Q',case_unit:'Case',conditions:[definition('A')],outcome:definition('Y'),cases:[{label:'c',document_ids:['source'],cells:{A:{value:0,rationale:'reason'},Y:{value:1,rationale:'reason'}}}]};
 assert.equal(api.runIssue(d),null);d.cases[0].cells.A.value=null;assert.match(api.runIssue(d),/missing/);d.cases[0].cells.A.value=0;d.conditions[0].basis='';assert.match(api.runIssue(d),/basis/);
});
