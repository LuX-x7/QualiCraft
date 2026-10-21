import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

async function editor(kind,hosted,lang,saved=true){
  const elements=new Map(),handlers=[];
  const dialog={dataset:{},querySelector(s){if(!elements.has(s))elements.set(s,{textContent:'',focus(){}});return elements.get(s);},addEventListener(type,fn){handlers.push([type,fn]);}};
  const c=vm.createContext({window:{addEventListener(){}},document:{querySelector:()=>dialog},AbortController});
  vm.runInContext(readFileSync(new URL(`../web/${kind}-editor.js`,import.meta.url),'utf8'),c);
  const api=c.window[kind==='report'?'QTReport':'QTQCA'];
  let context;
  if(kind==='report'){
    const checks={content:[]},draft=api.blank('Bologna','content',checks);
    context={checks,methods:{content:'Content Analysis'},method_maps:{content:''},method_map_css:'',catalog:{codes:{},evidence:{}},state:saved?{revision:2,current:{revision:2,draft,method_map:{}}}:null};
  }else{
    const design={question:'',case_unit:'',conditions:[api.definition('A')],outcome:api.definition('Y'),cases:[]};
    context={blank:design,documents:[],state:saved?{revision:2,design}:null};
  }
  await api.open({hosted,lang,project:{name:'Bologna',codes:[]},endpoint:'/test',request:async()=>context,modal(){}});
  return {status:()=>elements.get(kind==='report'?'#report-save-state':'#qca-save-state').textContent,handlers};
}
for(const lang of ['en','zh'])for(const hosted of [false,true]){
  for(const kind of ['report','qca'])test(`${kind} saved state names ${hosted?'server':'local'} storage in ${lang}`,async()=>{
    const e=await editor(kind,hosted,lang);
    assert.match(e.status(),new RegExp(lang==='zh'?(hosted?'服务器':'本地'):(hosted?'Saved on server':'Saved locally')));
    assert.match(e.status(),/2$/);
  });
  test(`import receipt and queue agree with ${hosted?'server':'local'} mode in ${lang}`,()=>{
    const c=vm.createContext({URLSearchParams,location:{search:'?lang='+lang},localStorage:{getItem(){}},sessionStorage:{setItem(){}},window:{QT_HOSTED:hosted,addEventListener(){}},document:{documentElement:{},querySelector(){return null},addEventListener(){}},fetch:()=>new Promise(()=>{})});
    vm.runInContext(readFileSync(new URL('../web/app.js',import.meta.url),'utf8'),c);
    const expected=new RegExp(lang==='zh'?(hosted?'服务器':'本地'):(hosted?'server':'locally'));
    assert.match(vm.runInContext("QT('importedLocal')",c),expected);
    assert.match(vm.runInContext("queueStateLabel({state:'saved'})",c),expected);
  });
}
for(const kind of ['report','qca'])test(`${kind} unsaved state never claims a completed save`,async()=>{
  const e=await editor(kind,true,'en',false);assert.match(e.status(),/not saved/);assert.doesNotMatch(e.status(),/Saved on server/);
});
