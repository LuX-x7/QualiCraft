/** Selection geometry from the unchanged, verified workbench SVG. This accepts
 * only the current export shapes; a different layout keeps the CSV reader but
 * loses its overlay rather than guessing where values belong. */
export type HitTarget = { x: number; y: number; width: number; height: number }
export type HitMap = { width: number; height: number; targets: HitTarget[] }
type Table = { head: string[]; rows: string[][] }
const number = '-?\\d+(?:\\.\\d+)?'
const points = (d: string) => [...d.matchAll(new RegExp(`[ML] (${number}) (${number})`, 'g'))]
  .map(match => [Number(match[1]), Number(match[2])])
const text = (value: string) => value.replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/\s+/g, ' ').trim()
const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

export function readHitMap(kind: string, svg: string, table: Table, numbers: Record<string, unknown>): HitMap | null {
  const box = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
  if (!box || !table.rows.length || /<(?:g|path|use)\b[^>]*\btransform=/.test(svg)) return null
  const width = Number(box[1]), height = Number(box[2])
  if (!(width > 0 && height > 0)) return null
  let targets: HitTarget[]
  if (kind === 'frequency') {
    if (!equal(table.head, ['code', 'count']) || table.rows.some(row => row.length !== 2 || !/^\d+$/.test(row[1]))
      || !equal(table.rows.map(row => row[0]), numbers.labels)
      || !equal(table.rows.map(row => Number(row[1])), numbers.counts)) return null
    targets = [...svg.matchAll(/<g id="patch_\d+">\s*<path d="([^"]+)" clip-path=/g)]
      .map(match => {
        const p = points(match[1])
        if (p.length !== 4 || !/^\s*M [\d.]+ [\d.]+\s+L [\d.]+ [\d.]+\s+L [\d.]+ [\d.]+\s+L [\d.]+ [\d.]+\s+z\s*$/.test(match[1])) return null
        const [a, b, c, d] = p
        if (a[0] !== d[0] || b[0] !== c[0] || a[1] !== b[1] || c[1] !== d[1]) return null
        return { x: a[0], y: c[1], width: b[0] - a[0], height: a[1] - c[1] }
      }).filter((target): target is HitTarget => target !== null).sort((a, b) => a.y - b.y)
    if (targets.length !== table.rows.length) return null
    const groups = [...svg.matchAll(/<g id="text_\d+">([\s\S]*?)<\/g>/g)].map(match => {
      const labels = [...match[1].matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map(label => label[1])
      const y = match[1].match(/translate\([-\d.]+ ([-\d.]+)\)/)?.[1] ?? match[1].match(/\by="([-\d.]+)"/)?.[1]
      return { label: text(labels.join(' ')), y: Number(y) }
    })
    // Check both full labels and the SVG's printed counts at each bar. In
    // particular, equal counts never serve as a code's identity.
    if (targets.some((target, i) => {
      const centre = target.y + target.height / 2
      return ![table.rows[i][0], table.rows[i][1]].every(label => groups.some(group =>
        group.label === text(label) && Math.abs(group.y - centre) < target.height / 2))
    })) return null
  } else if (kind === 'accumulation') {
    if (!equal(table.head, ['step', 'case', 'cumulative', 'new'])
      || table.rows.some((row, i) => row.length !== 4 || row[0] !== String(i + 1) || !/^\d+$/.test(row[2]) || !/^\d+$/.test(row[3]))
      || !equal(table.rows.map(row => row[1]), numbers.cases)
      || !equal(table.rows.map(row => Number(row[2])), numbers.cumulative)) return null
    const lines = [...svg.matchAll(/<g id="line2d_\d+">([\s\S]*?)<\/g>/g)]
      .map(match => {
        const uses = [...match[1].matchAll(/<use\b[^>]*\bx="([-\d.]+)" y="([-\d.]+)"/g)]
          .map(use => [Number(use[1]), Number(use[2])])
        const path = match[1].match(/<path d="([^"]+)" clip-path=/)?.[1]
        return { uses, line: path ? points(path) : [] }
      }).filter(candidate => candidate.uses.length === table.rows.length && equal(candidate.uses, candidate.line))
    if (lines.length !== 1) return null
    const p = lines[0].uses
    const first = Number(table.rows[0][2]), last = Number(table.rows.at(-1)![2])
    if (p.length < 2 || last === first) return null
    const scale = (p.at(-1)![1] - p[0][1]) / (last - first)
    if (p.some((point, i) => (i > 0 && point[0] <= p[i - 1][0])
      || Math.abs(point[1] - (p[0][1] + (Number(table.rows[i][2]) - first) * scale)) > 0.00001)) return null
    targets = p.map(([x, y]) => ({ x, y, width: 0, height: 0 }))
  } else return null
  if (targets.some(target => !Object.values(target).every(Number.isFinite) || target.x < 0 || target.y < 0
    || target.width < 0 || target.height < 0 || target.x + target.width > width || target.y + target.height > height)) return null
  return { width, height, targets }
}
