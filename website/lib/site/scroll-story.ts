/** Reading position only; this never requests or changes page scrolling. */
export function pickStoryIndex(boxes: { top: number }[], line: number): number {
  if (!boxes.length) return -1
  let index = 0
  boxes.forEach((box, i) => { if (box.top <= line) index = i })
  return index
}

type Code = { id: string; name: string; definition: string }
type SavedPassage = { annotation_id: string; code_id: string; quote: string; code_path: Code[] }
/** A relationship illustration from an existing record, never inferred links. */
export function buildTrail(example: SavedPassage) {
  const code = example.code_path.at(-1)
  if (!code || code.id !== example.code_id || new Set(example.code_path.map(node => node.id)).size !== example.code_path.length) throw new Error('Source path does not match its code identity')
  return {
    passage: { id: example.annotation_id, quote: example.quote }, code,
    ancestors: example.code_path.slice(0, -1),
    edges: [ { from: example.annotation_id, to: code.id },
      ...example.code_path.slice(1).map((node, i) => ({ from: node.id, to: example.code_path[i].id })) ],
  }
}
