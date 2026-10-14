/** Accepted recordings; provenance in T7-10-CLIPS.md and T7-11-COMPLETION.md. */
export const CLIPS: Partial<Record<string, {
  src: string
  poster: string
  width: number
  height: number
  description: string
  label?: string
}>> = {
  import: {
    src: '/clips/import.webm',
    poster: '/clips/import.png',
    width: 946,
    height: 741,
    description: 'Bologna’s interview02.txt after import: the document and 31 numbered segments.',
  },
  coding: {
    src: '/clips/coding.webm',
    poster: '/clips/coding.png',
    width: 2720,
    height: 1750,
    description: 'Existing coded passages and their margin labels in the Bologna sample.',
  },
  analysis: {
    src: '/clips/analysis.webm',
    poster: '/clips/analysis.png',
    width: 2720,
    height: 1502,
    description: 'Further down the code frequency results in the Bologna sample’s Insights view.',
  },
  plotting: {
    src: '/clips/plotting.webm',
    poster: '/clips/plotting.png',
    width: 2032,
    height: 1566,
    description: 'A rendered code frequency figure, its controls and the download option in the Bologna sample.',
  },
  export: {
    src: '/clips/export.webm',
    poster: '/clips/export.png',
    width: 720,
    height: 420,
    description: 'Completed Bologna exports—project JSON, two CSV files and methods Markdown—shown in a local file listing.',
    label: 'Export completed files recording',
  },
}
