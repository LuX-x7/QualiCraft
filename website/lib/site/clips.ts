/** Real current-QT recordings; provenance and frame audit in UX-29-CURRENT-QT-RECORDINGS.md. */
export const RECORDING_NOTE = 'QT interface · Recorded 16 October 2026'
export const CLIPS: Partial<Record<string, {
  src: string
  poster: string
  width: number
  height: number
  description: string
  label?: string
}>> = {
  import: {
    src: '/clips/import.webm?v=785fb7706310',
    poster: '/clips/import.png?v=4fe619a3352a',
    width: 1440,
    height: 1000,
    description: 'The imported Bologna document, its saved receipt and current reading controls in QT.',
  },
  coding: {
    src: '/clips/coding.webm?v=f34881af0697',
    poster: '/clips/coding.png?v=140a350c4929',
    width: 1440,
    height: 1000,
    description: 'One demonstration coding saved in the Bologna copy, with its full theme and code path.',
  },
  analysis: {
    src: '/clips/analysis.webm?v=2c7f6637faf8',
    poster: '/clips/analysis.png?v=2a28b8d4b9df',
    width: 1440,
    height: 1000,
    description: 'The QT relationship map with passage nodes expanded and an exact source quotation selected.',
  },
  plotting: {
    src: '/clips/plotting.webm?v=8fddadea7edb',
    poster: '/clips/plotting.png?v=6f622fde6679',
    width: 1440,
    height: 1000,
    description: 'The rendered theme frequency figure, its controls and the figure-and-script download in QT.',
  },
  export: {
    src: '/clips/export.webm?v=59c84668ade4',
    poster: '/clips/export.png?v=cc45cd786378',
    width: 696,
    height: 696,
    description: 'A verified project JSON download in QT: filename, bytes and content preview. This recording predates coded transcript HTML and Word.',
  },
}
