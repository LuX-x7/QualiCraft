/** CUA browser acceptance, called with a bound tab in cua_repl. All actions
 * use the documented tab API; evaluate only observes DOM state. Screenshots
 * and observations belong outside the repository. */
import assert from 'node:assert/strict'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
const report = new URL('../../website/public/report/', import.meta.url)
const rows = {}
for (const kind of ['frequency', 'accumulation']) {
  rows[kind] = (await readFile(new URL(`figures/${kind}.csv`, report), 'utf8')).trim().split(/\r?\n/).slice(1).map(line => line.split(','))
}
export const checks = []
export async function observe(tab, kind) {
  const state = await tab.playwright.evaluate(kind => {
    const section = document.getElementById(`sec-${kind}`)
    const reader = document.getElementById(`reader-value-${kind}`)
    const table = document.getElementById(`table-${kind}`)
    const active = document.activeElement
    const selected = table.querySelector('tr.is-selected')
    const region = table.querySelector('.table-scroll')
    const r = selected?.getBoundingClientRect(), s = region?.getBoundingClientRect()
    return {
      selected: document.getElementById(`reader-select-${kind}`).value,
      item: reader.querySelector('.reader-item')?.textContent,
      values: [...reader.querySelectorAll('dd')].map(cell => cell.textContent),
      tableRows: [...table.querySelectorAll('tbody tr')].map(row => [...row.querySelectorAll('td')].map(cell => cell.textContent)),
      selectedRow: selected?.id, selectedCells: selected ? [...selected.querySelectorAll('td')].map(cell => cell.textContent) : [],
      rowVisibleInTable: Boolean(r && s && r.top >= s.top - 1 && r.bottom <= s.bottom + 1),
      activeId: active?.id, activeLabel: active?.getAttribute('aria-label'),
      selectedMarks: [...section.querySelectorAll('.figure-target[aria-pressed="true"]')].map(button => button.getAttribute('aria-label')),
      hint: section.querySelector('.reader-hint')?.textContent,
      tabStops: section.querySelectorAll('.figure-target[tabindex="0"]').length,
      tableOpen: table.querySelector('details').open,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      viewport: { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight },
      selectorHeight: document.getElementById(`reader-select-${kind}`).getBoundingClientRect().height,
      targetsDisplay: getComputedStyle(section.querySelector('.figure-targets')).display,
    }
  }, kind)
  // Browser observations can carry a different realm's Array prototype.
  return JSON.parse(JSON.stringify(state))
}
export async function checkSelection(tab, kind, index, name) {
  const actual = await observe(tab, kind)
  const expected = rows[kind][index]
  checks.push({ name, kind, index, actual, expected })
  assert.equal(actual.selected, String(index))
  assert.equal(actual.item, kind === 'frequency' ? expected[0] : `Step ${expected[0]} · ${expected[1]}`)
  assert.deepEqual(actual.values, kind === 'frequency' ? expected.slice(1) : expected.slice(2))
  assert.deepEqual(actual.tableRows, rows[kind])
  assert.equal(actual.selectedRow, `row-${kind}-${index}`)
  assert.deepEqual(actual.selectedCells, expected)
  assert.equal(actual.overflow, 0)
  return actual
}
export async function sweep(tab, kind, indices, mode) {
  for (const index of indices) {
    await tab.playwright.getByLabel(kind === 'frequency' ? 'Code' : 'Interview step', { exact: true }).selectOption(String(index))
    await tab.playwright.domSnapshot()
    const actual = await checkSelection(tab, kind, index, `${mode}: CSV item ${index + 1}`)
    assert.ok(actual.tableOpen && actual.rowVisibleInTable)
    if (mode === 'phone') { assert.equal(actual.targetsDisplay, 'none'); assert.ok(actual.selectorHeight >= 44) }
  }
}
export async function keyboard(tab, kind) {
  const surface = tab.playwright.getByRole('group', { name: `${kind === 'frequency' ? 'Code frequency' : 'Code accumulation'} data items` })
  const marks = surface.locator('button')
  await marks.first().press('Home')
  await tab.playwright.domSnapshot()
  let actual = await checkSelection(tab, kind, 0, 'keyboard: Home')
  assert.equal(actual.tabStops, 1)
  for (const [key, index] of [['ArrowRight', 1], ['End', rows[kind].length - 1], ['ArrowRight', rows[kind].length - 1], ['ArrowLeft', rows[kind].length - 2], ['Home', 0], ['ArrowLeft', 0]]) {
    await surface.getByLabel(actual.activeLabel, { exact: true }).press(key)
    await tab.playwright.domSnapshot()
    actual = await checkSelection(tab, kind, index, `keyboard: ${key}`)
    assert.equal(actual.activeLabel, actual.selectedMarks[0])
  }
  await surface.getByLabel(actual.activeLabel, { exact: true }).press('Enter')
  await tab.playwright.domSnapshot()
  assert.equal((await observe(tab, kind)).tableOpen, true)
  await surface.getByLabel(actual.activeLabel, { exact: true }).press('Tab')
  await tab.playwright.domSnapshot()
  assert.equal((await observe(tab, kind)).activeId, `reader-select-${kind}`)
  checks.push({ name: 'keyboard: Enter opens counts and Tab leaves the figure', kind, actual: await observe(tab, kind) })
}
export async function locate(tab, kind, mode) {
  const section = tab.playwright.locator(`#sec-${kind}`)
  await section.getByRole('button', { name: 'View selected row ↓', exact: true }).press('Enter')
  await tab.playwright.domSnapshot()
  const actual = await observe(tab, kind)
  checks.push({ name: `${mode}: locate selected row`, kind, actual })
  assert.equal(actual.activeId, actual.selectedRow)
  assert.ok(actual.rowVisibleInTable)
  const rect = await tab.playwright.locator(`#${actual.selectedRow}`).evaluate(row => {
    const r = row.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, viewport: document.documentElement.clientHeight }
  })
  assert.ok(rect.top >= (mode === 'phone' ? 152 : 112) - 1 && rect.bottom <= rect.viewport)
}
export async function screenshot(tab, dir, name) {
  await mkdir(dir, { recursive: true })
  await writeFile(`${dir}/${name}.jpg`, await tab.screenshot({ fullPage: false }))
}
export async function controls(tab, kind, mode) {
  const section = tab.playwright.locator(`#sec-${kind}`)
  await tab.playwright.getByLabel(kind === 'frequency' ? 'Code' : 'Interview step', { exact: true }).selectOption('0')
  await tab.playwright.domSnapshot()
  assert.equal(await section.getByRole('button', { name: 'Previous', exact: true }).isEnabled(), false)
  await section.getByRole('button', { name: 'Next', exact: true }).click()
  await tab.playwright.domSnapshot()
  await checkSelection(tab, kind, 1, `${mode}: Next`)
  await section.getByRole('button', { name: 'Previous', exact: true }).click()
  await tab.playwright.domSnapshot()
  await checkSelection(tab, kind, 0, `${mode}: Previous`)
  const index = kind === 'frequency' ? 5 : 17
  await tab.playwright.locator(`#row-${kind}-${index} button`).click()
  await tab.playwright.domSnapshot()
  await checkSelection(tab, kind, index, `${mode}: table selects figure item`)
}
export async function mouse(tab, kind, index) {
  // Navigate to the chart before clicking a mark, as a reader would. This also
  // avoids native browser automation attempting to click an off-screen mark.
  await tab.playwright.getByRole('link', { name: kind === 'frequency' ? 'FIG.01 · figure' : 'FIG.05 · figure', exact: true }).click()
  await tab.playwright.domSnapshot()
  const item = rows[kind][index]
  const label = kind === 'frequency' ? item[0] : `Step ${item[0]} · ${item[1]}`
  await tab.playwright.getByRole('group', { name: `${kind === 'frequency' ? 'Code frequency' : 'Code accumulation'} data items` })
    .getByLabel(`Read ${label}`, { exact: true }).click()
  await tab.playwright.domSnapshot()
  const actual = await checkSelection(tab, kind, index, 'desktop: mouse and instant hint')
  assert.equal(actual.hint, label + (kind === 'frequency' ? `count${item[1]}` : `cumulative${item[2]}new${item[3]}`))
}
export async function save(tab, dir) {
  const console = await tab.dev.logs({ levels: ['warn', 'error'], limit: 100 })
  checks.push({ name: 'console', entries: console })
  await mkdir(dir, { recursive: true })
  await writeFile(`${dir}/checks.json`, JSON.stringify(checks, null, 2))
  assert.equal(console.length, 0)
}
