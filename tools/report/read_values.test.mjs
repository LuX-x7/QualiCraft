// Run from repository root: node --test tools/report/read_values.test.mjs
// Use the site's existing TypeScript compiler; no extra test dependency.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
const require = createRequire(new URL('../../website/package.json', import.meta.url))
const ts = require('typescript')
const source = await readFile(new URL('../../website/lib/report/hit-map.ts', import.meta.url), 'utf8')
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText
const { readHitMap } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
const root = new URL('../../website/public/report/', import.meta.url)
const manifest = JSON.parse(await readFile(new URL('manifest.json', root), 'utf8'))
const fixtures = {}
for (const kind of ['frequency', 'accumulation']) {
  const figure = manifest.figures.find(item => item.kind === kind)
  const lines = (await readFile(new URL(figure.csv, root), 'utf8')).trim().split(/\r?\n/).map(line => line.split(','))
  fixtures[kind] = { figure, table: { head: lines[0], rows: lines.slice(1) }, svg: await readFile(new URL(figure.svg, root), 'utf8') }
}
for (const kind of Object.keys(fixtures)) {
  const { figure, table, svg } = fixtures[kind]
  test(`${kind}: every CSV row maps to a distinct in-bounds SVG mark`, () => {
    const map = readHitMap(kind, svg, table, figure.numbers)
    assert.ok(map)
    assert.equal(map.targets.length, table.rows.length)
    assert.equal(new Set(map.targets.map(item => `${item.x}:${item.y}`)).size, table.rows.length)
    for (const item of map.targets) {
      assert.ok(item.x >= 0 && item.y >= 0 && item.x + item.width <= map.width && item.y + item.height <= map.height)
    }
  })
  test(`${kind}: changed CSV value, identity, order or schema disables geometry`, () => {
    for (const change of [copy => { copy.rows[0][kind === 'frequency' ? 1 : 2] = '999' },
      copy => { copy.rows[0][kind === 'frequency' ? 0 : 1] = 'another item' },
      copy => { copy.rows.reverse() }, copy => { copy.head[0] = 'other' }]) {
      const copy = structuredClone(table); change(copy)
      assert.equal(readHitMap(kind, svg, copy, figure.numbers), null)
    }
  })
  test(`${kind}: unsupported or out-of-bounds SVG disables geometry`, () => {
    assert.equal(readHitMap(kind, '<svg viewBox="0 0 100 100"></svg>', table, figure.numbers), null)
    assert.equal(readHitMap(kind, svg.replace(/viewBox="[^"]+"/, 'viewBox="0 0 1 1"'), table, figure.numbers), null)
    assert.equal(readHitMap(kind, svg.replace(/viewBox="[^"]+"/, ''), table, figure.numbers), null)
    assert.equal(readHitMap(kind, svg.replace('<g id="figure_1">', '<g id="figure_1" transform="translate(20 0)">'), table, figure.numbers), null)
  })
}
test('frequency: tied counts retain their separate code labels and top-to-bottom order', () => {
  const { figure, table, svg } = fixtures.frequency
  const map = readHitMap('frequency', svg, table, figure.numbers)
  assert.ok(map)
  assert.equal(table.rows[4][1], table.rows[5][1])
  assert.notEqual(table.rows[4][0], table.rows[5][0])
  assert.notEqual(map.targets[4].y, map.targets[5].y)
  assert.ok(map.targets[0].y < map.targets.at(-1).y)
  assert.equal(readHitMap('frequency', svg.replace('keeping working materials after', 'mismatched code label'), table, figure.numbers), null)
})
test('accumulation: first and last markers match the original SVG, with CSV new values retained', () => {
  const { figure, table, svg } = fixtures.accumulation
  const map = readHitMap('accumulation', svg, table, figure.numbers)
  assert.ok(map)
  assert.deepEqual(map.targets[0], { x: 82.423636, y: 330.439084, width: 0, height: 0 })
  assert.deepEqual(map.targets.at(-1), { x: 662.896364, y: 103.459286, width: 0, height: 0 })
  assert.deepEqual(table.rows[17], ['18', 'interview18.txt', '251', '1'])
  assert.equal(readHitMap('accumulation', svg.replaceAll('297.599454', '298.599454'), table, figure.numbers), null)
})
