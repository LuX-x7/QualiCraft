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
  .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/\s+/g, ' ').replace(/-\s+/g, '-').trim()
const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

// Balanced groups, since axes contain nested tick/label groups. No SVG is
// executed here; the caller has already verified its manifest hash.
const groups = (svg: string, prefix: string) => {
  const out: { id: string; body: string; depth: number }[] = []
  const stack: { id: string; start: number }[] = []
  for (const match of svg.matchAll(/<g\b[^>]*>|<\/g>/g)) {
    if (match[0].startsWith('</')) {
      const group = stack.pop()
      if (group?.id.startsWith(prefix)) out.push({ id: group.id, body: svg.slice(group.start, match.index), depth: stack.length })
    } else stack.push({ id: match[0].match(/\bid="([^"]+)"/)?.[1] ?? '', start: match.index! + match[0].length })
  }
  return out
}
const words = (svg: string) => text([...svg.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map(m => m[1]).join(' '))
const rectangle = (body: string): HitTarget | null => {
  const d = body.match(/<path d="([^"]+)"/)?.[1]
  if (!d || !/^\s*M [\d.]+ [\d.]+\s+L [\d.]+ [\d.]+\s+L [\d.]+ [\d.]+\s+L [\d.]+ [\d.]+\s+z\s*$/.test(d)) return null
  const [a,b,c,e] = points(d)
  return a[0] === e[0] && b[0] === c[0] && a[1] === b[1] && c[1] === e[1]
    ? { x:a[0], y:c[1], width:b[0]-a[0], height:a[1]-c[1] } : null
}
const textPosition = (body: string) => {
  const translated = body.match(/translate\(([-\d.]+) ([-\d.]+)\)/)
  const direct = body.match(/<text\b[^>]*\bx="([-\d.]+)" y="([-\d.]+)"/)
  const p = translated ?? direct
  return p ? [Number(p[1]),Number(p[2])] : null
}
const inside = (t: HitTarget, x: number, y: number, tolerance = 0) => x >= t.x-tolerance && x <= t.x+t.width+tolerance && y >= t.y-tolerance && y <= t.y+t.height+tolerance

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
  } else if (kind === 'cooccurrence') {
    if (!equal(table.head,['code_a','code_b','count']) || table.rows.some(r=>r.length!==3 || !/^[1-9]\d*$/.test(r[2]) || r[0]===r[1])) return null
    const labels = numbers.labels as string[], matrix = numbers.matrix as number[][]
    if (!Array.isArray(labels) || !Array.isArray(matrix)) return null
    const expected = labels.flatMap((a,i)=>labels.flatMap((b,j)=>i!==j && matrix[i]?.[j]>0 ? [[a,b,String(matrix[i][j])]] : []))
    if (!equal(table.rows,expected)) return null
    const axes = groups(svg,'axes_').find(g=>g.id==='axes_1')?.body
    if (!axes) return null
    const xTicks=groups(axes,'xtick_'), yTicks=groups(axes,'ytick_')
    const xs=xTicks.map(t=>words(t.body)), ys=yTicks.map(t=>words(t.body))
    const exported = [...new Set(table.rows.flatMap(r=>r.slice(0,2)))].map(text)
    if (!equal(xs,exported) || !equal(ys,exported)) return null
    const rect=rectangle(groups(axes,'patch_')[0]?.body ?? '')
    if (!rect || xs.length<2) return null
    const cw=rect.width/xs.length,ch=rect.height/ys.length
    const aligned=(ticks: {body:string}[], horizontal:boolean) => ticks.every((tick,i)=>{
      const match=tick.body.match(/<use\b[^>]*\bx="([-\d.]+)" y="([-\d.]+)"/)
      return match && Math.abs(Number(match[horizontal?1:2])-(horizontal?rect.x+(i+.5)*cw:rect.y+(i+.5)*ch))<0.00001
    })
    if(!aligned(xTicks,true)||!aligned(yTicks,false)) return null
    const texts=groups(axes,'text_').map(g=>({label:words(g.body),p:textPosition(g.body)}))
    targets=[]
    for(const [a,b,count] of table.rows) {
      const i=ys.indexOf(text(a)),j=xs.indexOf(text(b))
      const target={x:rect.x+j*cw,y:rect.y+i*ch,width:cw,height:ch}
      if(i<0||j<0||!texts.some(t=>t.label===count && t.p && inside(target,...t.p as [number,number]))) return null
      targets.push(target)
    }
  } else if (kind === 'hierarchy') {
    if (!equal(table.head,['section','subsection','count']) || table.rows.some(r=>r.length!==3 || !/^\d+$/.test(r[2]))) return null
    const hierarchy=numbers.hierarchy as Record<string,Record<string,number>>
    const total=(sub:Record<string,number>)=>Object.values(sub).reduce((a,b)=>a+b,0)
    const expected=Object.entries(hierarchy??{}).sort((a,b)=>total(b[1])-total(a[1])).flatMap(([section,sub])=>Object.entries(sub).sort((a,b)=>b[1]-a[1]).map(([label,count])=>[section,label,String(count)]))
    if(!equal(table.rows,expected)) return null
    const found=new Map<string,HitTarget>()
    for(const {body} of groups(svg,'axes_')) {
      const labels=groups(body,'ytick_').map(g=>words(g.body))
      if(!labels.length) continue
      const texts=groups(body,'text_').filter(g=>g.depth===0).map(g=>({label:words(g.body),p:textPosition(g.body)}))
      const section=Object.keys(hierarchy).find(section=>texts.some(t=>t.label.startsWith(text(section)+' ') && t.label.endsWith('coded extracts')))
      if(!section) return null
      const bars=groups(body,'patch_').filter(g=>g.body.includes('clip-path=')).map(g=>rectangle(g.body))
      if(bars.some(b=>!b) || bars.length!==labels.length) return null
      const printed=texts.filter(t=>/^\d+$/.test(t.label))
      if(printed.length!==bars.length || !printed[0]?.p) return null
      const baseline=printed[0].p[1]-(bars[0]!.y+bars[0]!.height/2)
      for(let i=0;i<labels.length;i++) {
        const bar=bars[i]!, candidates=table.rows.filter(r=>r[0]===section && text(r[1])===labels[i])
        if(candidates.length!==1 || printed[i].label!==candidates[0][2] || !printed[i].p || printed[i].p![0]<bar.x+bar.width || Math.abs(printed[i].p![1]-(bar.y+bar.height/2)-baseline)>0.00001) return null
        found.set(JSON.stringify(candidates[0].slice(0,2)),bar)
      }
    }
    if(found.size!==table.rows.length) return null
    targets=table.rows.map(r=>found.get(JSON.stringify(r.slice(0,2)))!)
  } else return null
  if (targets.some(target => !Object.values(target).every(Number.isFinite) || target.x < 0 || target.y < 0
    || target.width < 0 || target.height < 0 || target.x + target.width > width || target.y + target.height > height)) return null
  return { width, height, targets }
}
