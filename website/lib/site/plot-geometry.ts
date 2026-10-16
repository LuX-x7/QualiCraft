/** Display coordinates only: one isotropic scale for both heatmap axes. */
export function matrixLayout(columns: number, rows: number, height: number) {
  const cell = (height - 105) / Math.max(1, rows)
  const gridWidth = columns * cell, gridHeight = rows * cell
  return { x: 260, y: 55, cellWidth: cell, cellHeight: cell,
    gridWidth, gridHeight, width: gridWidth + 300, height }
}

export function hierarchyPage<T extends { row: number; group?: string }>(items: T[], selected: number, size = 8) {
  const active=items.find(item=>item.row===selected)??items[0]
  const group=items.filter(item=>item.group===active?.group)
  const start=Math.floor(Math.max(0,group.findIndex(item=>item.row===active?.row))/size)*size
  return { group: active?.group, rows: group.slice(start,start+size), start, total:group.length,
    previous:group[Math.max(0,start-size)]?.row, next:group[start+size]?.row }
}

/** A detail window preserves legibility; the full matrix remains in the overview and export. */
export function matrixWindow(xCount:number,yCount:number,x:number,y:number,small=false,pairs=false) {
 const columns=small?3:pairs?4:6,rows=small?3:pairs?4:3
 const xStart=Math.floor(Math.max(0,x)/columns)*columns,yStart=Math.floor(Math.max(0,y)/rows)*rows
 return {columns,rows,xStart,yStart,xEnd:Math.min(xCount,xStart+columns),yEnd:Math.min(yCount,yStart+rows)}
}
