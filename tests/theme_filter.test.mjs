// node --test tests/theme_filter.test.mjs
// Exercise the real reader renderer, not a second implementation of filtering.
// The document strings below are technical markers, not interview material.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../web/app.js', import.meta.url), 'utf8');
function workspace() {
  const context = vm.createContext({
    URLSearchParams, location: { search: '?lang=en' },
    sessionStorage: { setItem() {} },
    document: { documentElement: {}, addEventListener() {} },
    window: { addEventListener() {} },
    // Pause bootstrap: these are renderer unit tests, with no server or browser.
    fetch: () => new Promise(() => {}),
  });
  vm.runInContext(source, context);
  vm.runInContext(String.raw`
    state.project = {
      documents: [{id:'d1', text:'own\nchild\ndeep😀\nsibling\nother\nuncoded'},
                  {id:'d2', text:'other\ndeep😀'}],
      codes: [
        {id:'root', name:'Theme', parent_id:null},
        {id:'child', name:'Shared', parent_id:'root'},
        {id:'deep', name:'Leaf', parent_id:'child'},
        {id:'sibling', name:'Sibling', parent_id:'root'},
        {id:'outside', name:'Theme', parent_id:null},
        {id:'other', name:'Shared', parent_id:'outside'},
        {id:'empty', name:'Empty', parent_id:null},
      ].map(c=>({...c, color:'#427d77', status:'final'})),
      annotations: [
        {id:'a1', document_id:'d1', code_id:'root', start:0, end:3},
        {id:'a2', document_id:'d1', code_id:'child', start:4, end:9},
        {id:'a3', document_id:'d1', code_id:'deep', start:10, end:15},
        {id:'a4', document_id:'d1', code_id:'sibling', start:16, end:23},
        {id:'a5', document_id:'d1', code_id:'other', start:24, end:29},
        {id:'a6', document_id:'d2', code_id:'deep', start:6, end:11},
      ],
    };
    state.docId='d1';
  `, context);
  const run = expression => vm.runInContext(expression, context);
  return {
    run,
    read(id, search = '') {
      run(`state.codeFilter=${JSON.stringify(id)};state.search=${JSON.stringify(search)}`);
      return run('readerHtml()');
    },
  };
}
const starts = html => [...html.matchAll(/class="paragraph" data-start="(\d+)"/g)].map(m => Number(m[1]));

test('theme includes its own, direct-child, deep-descendant and sibling ranges', () => {
  const w = workspace();
  assert.deepEqual(starts(w.read('root')), [0, 4, 10, 16]);
  assert.equal(w.run("codeCounts().total.get('root')"), 5); // one is in d2
});

test('theme with no direct coding still reveals all descendants', () => {
  const w = workspace();
  w.run("state.project.annotations=state.project.annotations.filter(a=>a.code_id!=='root')");
  assert.deepEqual(starts(w.read('root')), [4, 10, 16]);
});

test('an intermediate code includes itself and descendants, not ancestors or siblings', () => {
  const w = workspace();
  assert.deepEqual(starts(w.read('child')), [4, 10]);
});

test('same-name codes in other trees stay separate by ID; leaves stay exact', () => {
  const w = workspace();
  assert.deepEqual(starts(w.read('deep')), [10]);
  assert.deepEqual(starts(w.read('outside')), [24]);
  assert.deepEqual(starts(w.read('other')), [24]);
});

test('subtree filtering remains an intersection with document and text search', () => {
  const w = workspace();
  assert.deepEqual(starts(w.read('root', 'DEEP😀')), [10]);
  assert.deepEqual(starts(w.read('root', 'other')), []);
  w.run("state.docId='d2'");
  assert.deepEqual(starts(w.read('root')), [6]);
  assert.deepEqual(starts(w.read('root', 'other')), []);
});

test('two codes on one range retain both assignments behind one compact indicator', () => {
  const w = workspace();
  w.run("state.project.annotations.push({id:'a7',document_id:'d1',code_id:'child',start:10,end:15})");
  const html = w.read('child', 'deep');
  assert.deepEqual(starts(html), [10]);
  assert.match(html, /data-action="inspect-paragraph"[^>]*>2 saved codings/);
  assert.doesNotMatch(html, /class="margin-tree"/);
  assert.match(html, /data-coding-count="2"/);
  assert.ok(html.includes('title="Leaf · Shared">deep😀</mark>'));
  assert.equal(w.run("codeCounts().total.get('root')"), 6);
});

test('no filter, empty results and clearing retain the existing reader behavior', () => {
  const w = workspace();
  assert.deepEqual(starts(w.read(null)), [0, 4, 10, 16, 24, 30]);
  assert.ok(w.read('empty').includes('No passages match your filters.'));
  assert.deepEqual(starts(w.read(null, 'uncoded')), [30]);
});

test('collapsed tree presentation does not hide descendant evidence', () => {
  const w = workspace();
  w.run("state.collapsed=new Set(['root','child'])");
  assert.deepEqual(starts(w.read('root')), [0, 4, 10, 16]);
});

test('reading filters does not change project records, source ranges or counts', () => {
  const w = workspace();
  const project = w.run('JSON.stringify(state.project)');
  const counts = w.run('JSON.stringify([...codeCounts().total])');
  for (const id of ['root', 'child', 'deep', 'outside', 'empty', null]) w.read(id);
  assert.equal(w.run('JSON.stringify(state.project)'), project);
  assert.equal(w.run('JSON.stringify([...codeCounts().total])'), counts);
});
