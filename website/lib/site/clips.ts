/** Accepted excerpts from tools/e2e/recordings; provenance in T7-10-CLIPS.md. */
export const CLIPS: Partial<Record<string, {
  src: string
  poster: string
  width: number
  height: number
  description: string
}>> = {
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
}

export const PENDING_CLIPS: Record<string, string> = {
  import: 'A new recording will show the imported document and its paragraphs.',
  export: 'A new recording will show the exported files after the download.',
}
