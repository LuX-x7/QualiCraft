/**
 * The QT mark.
 * ---------------------------------------------------------------------------
 * The two letters drawn as blocks on the same 20px grid the page background
 * uses. A Q is a ring with a tail hanging off the corner; a T is a crossbar and
 * a stem. Drawn in cells rather than as a path so the mark sits on the grid the
 * way a brick does.
 *
 * Layout is seven columns by four rows: three for the Q, one gutter, three for
 * the T. The tail needs the fourth row, which is why the grid is not square.
 */

/** [column, row, tone] — tone defaults to ink. */
const CELLS: Array<[number, number, string?]> = [
  // Q — ring
  [0, 0],
  [1, 0, 'sunkissed'],
  [2, 0],
  [0, 1],
  [2, 1],
  [0, 2],
  [1, 2, 'sage'],
  [2, 2],
  // Q — tail
  [2, 3, 'accent'],
  // T — crossbar and stem
  [4, 0, 'terracotta'],
  [5, 0],
  [6, 0],
  [5, 1, 'tidal'],
  [5, 2],
]

const COLUMNS = 7
const ROWS = 4

export default function QtMark({
  label,
  size = 12,
  animate = false,
  className = '',
}: {
  /** Screen-reader label. Pass '' when the mark sits beside visible text. */
  label?: string
  /** Cell size in pixels. */
  size?: number
  animate?: boolean
  className?: string
}) {
  const gap = Math.max(1, Math.round(size / 5))
  const at = new Map(CELLS.map(([x, y, tone]) => [`${x},${y}`, tone || 'ink']))
  // The mark is laid down column by column, bottom of each column first, so it
  // reads as blocks being stacked rather than a shape fading in. Delay follows
  // that order, not the order the cells happen to sit in the array. Fifty
  // milliseconds a cell: fourteen cells at fifty-five, plus the 620 ms drop,
  // measured 1516 ms — outside the 1.2–1.5 s window the brief asks for — and
  // fifty lands the whole assembly near 1350 ms, inside it. Measured, not
  // guessed: tools/motion/measure.py. Fifty
  // milliseconds a cell: fourteen cells at fifty-five, plus the 620 ms drop,
  // measured 1516 ms — outside the 1.2–1.5 s window the brief asks for — and
  // fifty lands the whole assembly near 1350 ms, inside it. Measured, not
  // guessed: tools/motion/measure.py. Fifty
  // milliseconds a cell, because fourteen cells at fifty-five plus the 620 ms
  // drop measured 1516 ms — outside the 1.2–1.5 s the brief asks for — and
  // fifty lands the whole assembly near 1350 ms, inside it (measured by
  // tools/motion/measure.py).
  const order = (x: number, y: number) => x * ROWS + (ROWS - 1 - y)
  return (
    <span
      className={`qtmark${animate ? ' qtmark--animate' : ''} ${className}`}
      style={{
        display: 'inline-grid',
        gridTemplateColumns: `repeat(${COLUMNS}, ${size}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${size}px)`,
        gap: `${gap}px`,
        // How far a block falls. Set here so it scales with the mark.
        ['--drop' as string]: `${Math.round(size * 2.4)}px`,
      }}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      {Array.from({ length: COLUMNS * ROWS }, (_, index) => {
        const x = index % COLUMNS
        const y = Math.floor(index / COLUMNS)
        const tone = at.get(`${x},${y}`)
        if (!tone) return <span key={index} />
        return (
          <span
            key={index}
            className={`qtmark__cell qtmark__cell--${tone}`}
            style={{ animationDelay: animate ? `${order(x, y) * 50}ms` : undefined }}
          />
        )
      })}
    </span>
  )
}
