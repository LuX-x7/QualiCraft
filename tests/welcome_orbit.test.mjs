import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../web/welcome-orbit.js',import.meta.url),'utf8');
function scene(reduce=false){
  let frames=new Map(),next=0,disconnected=false,resize;const events={};
  const ctx=new Proxy({},{get:()=>()=>{},set:()=>true});
  const button={disabled:false,textContent:'',setAttribute(){},addEventListener:(n,f)=>events[n]=f,removeEventListener(){}};
  const root={isConnected:true,clientWidth:720,clientHeight:500,querySelector:s=>s==='canvas'?{getContext:()=>ctx}:button,querySelectorAll:()=>[],addEventListener(){},removeEventListener(){}};
  const c={window:{},matchMedia:()=>({matches:reduce,addEventListener(){},removeEventListener(){}}),ResizeObserver:class{constructor(fn){resize=fn;}observe(){}disconnect(){disconnected=true;}},devicePixelRatio:1,document:{hidden:false},requestAnimationFrame:f=>{frames.set(++next,f);return next;},cancelAnimationFrame:id=>frames.delete(id)};
  vm.runInNewContext(source,c);
  function tick(){const [id,fn]=frames.entries().next().value;frames.delete(id);fn(100);}
  return {c,root,button,tick,frames,events,resize:()=>resize(),disconnected:()=>disconnected};
}
test('reduced motion renders once and schedules no continuous animation',()=>{const s=scene(true);s.c.window.mountWelcomeOrbit(s.root);s.tick();assert.equal(s.frames.size,0);assert(s.button.disabled);assert.equal(s.button.textContent,'Motion reduced');});
test('entering a project disposes the welcome animation and resize observer',()=>{const s=scene();s.c.window.mountWelcomeOrbit(s.root);s.tick();assert.equal(s.frames.size,1);s.c.window.mountWelcomeOrbit(null);assert.equal(s.frames.size,0);assert(s.disconnected());});
test('the keyboard-operable pause control stops the animation loop',()=>{const s=scene();s.c.window.mountWelcomeOrbit(s.root);s.tick();s.events.click();s.tick();assert.equal(s.frames.size,0);assert.equal(s.button.textContent,'Play motion');});
test('a resized reduced-motion canvas redraws once instead of staying blank',()=>{const s=scene(true);s.c.window.mountWelcomeOrbit(s.root);s.tick();s.root.clientWidth=390;s.resize();assert.equal(s.frames.size,1);s.tick();assert.equal(s.frames.size,0);});
