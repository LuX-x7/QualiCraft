/**
 * Site · the words the public pages are made of.
 * ---------------------------------------------------------------------------
 * One module holds every string the frontend renders, so a copy change is one
 * edit in one file and nothing has to be assembled from a database at request
 * time. Figures' unit sentences do not live here: those come from the
 * workbench's CREDIT constants through the manifest (see lib/report/read.ts),
 * so the site never writes a second copy of one.
 *
 * The dataset cards are generated, not typed: tools/site/build_data_cards.py
 * reads qualicraft/datasets.py and writes data-cards.json. If the cards here
 * ever disagree with datasets.py, the generator is wrong, not this file.
 */

export const NAV = [
  { href: '#method', label: 'Method' },
  { href: '/w', label: 'Workspace' },
  { href: '/report', label: 'Docs' },
  { href: '#data', label: 'Data' },
  { href: '/about', label: 'About' },
  { href: '#feedback', label: 'Feedback' },
] as const

export const HERO = {
  eyebrow: 'Qualitative research · Local first · Auditable',
  headline: ['You read it. You code it.', 'The tool only writes down how you got there.'],
  body:
    'A workbench for interview studies. Mark passages, build a codebook, group it into ' +
    'themes — and keep the whole record of how you got there. Everything stays on the ' +
    'machine you run it on, and works offline once you have it.',
  primary: {
    label: 'Download and run locally',
    /** Disabled until the Windows gate passes; the note says why. */
    disabled: true,
    disabledNote: 'Windows check in progress',
  },
  secondary: {
    label: 'Open the read-only demo',
    href: '/w',
    note: 'first load about 30 seconds',
  },
  footnote:
    'The demo is a read-only sample project on public data. The workbench itself runs ' +
    'on your own machine.',
}

/** The five steps of the walkthrough. Each: one goal, three verb-first
 *  operations, one thing to see. Under forty words apiece. */
export const MODULES = [
  {
    no: '01',
    key: 'import',
    title: 'Import',
    goal: 'Bring a transcript in.',
    steps: [
      'Choose a .txt or .docx file.',
      'Name the document.',
      'Watch the paragraphs arrive.',
    ],
    see: 'Numbered paragraphs, speaker turns kept, no Markdown left behind.',
  },
  {
    no: '02',
    key: 'coding',
    title: 'Coding',
    goal: 'Mark what matters.',
    steps: [
      'Drag across a passage.',
      'Type a code name, press Enter.',
      'Code the same stretch twice if two ideas share it.',
    ],
    see: 'A pill in the margin, a code in the codebook, an offset you can re-find.',
  },
  {
    no: '03',
    key: 'analysis',
    title: 'Analysis',
    goal: 'Count what you coded.',
    steps: [
      'Open the Insights view.',
      'Read the frequency bars and the document × code matrix.',
      'Open the co-occurrence heatmap.',
    ],
    see: 'Every view states what it counts — and what it does not.',
  },
  {
    no: '04',
    key: 'plotting',
    title: 'Plotting',
    goal: 'Draw the five figures.',
    steps: [
      'Pick a figure type.',
      'Adjust only the controls that figure reads.',
      'Download the figure, the counts and the script.',
    ],
    see: 'A caption that names the unit, on every figure, in every format.',
  },
  {
    no: '05',
    key: 'export',
    title: 'Export',
    goal: 'Take the record with you.',
    steps: [
      'Export the project JSON.',
      'Export the codings CSV.',
      'Export the methods record.',
    ],
    see: 'Files another tool can open — and a methods section already drafted.',
  },
] as const

/** Two methods, on the same axes. The claims are the two literatures', not
 *  ours: each row says what the method holds and how far this tool carries it.
 *  Citations verified 2026-10-13 against the published records. */
export const METHODS = {
  label: 'Method',
  title: 'Two ways to read the same transcript.',
  body:
    'Thematic analysis and qualitative content analysis are the two a first project ' +
    'usually has to choose between. They are not a right answer and a wrong one — the ' +
    'research question decides. The same comparison, on the same axes.',
  columns: [
    'Research question',
    'Unit of analysis',
    'Coding approach',
    'Outputs',
    'Reliability',
    'Reflexivity',
    'How far this tool carries it',
  ],
  rows: [
    {
      approach: 'Thematic analysis (TA)',
      cells: [
        'What do participants make of X, and what does the field take it to mean?',
        'The coded meaning — a pattern across the corpus, not a single utterance.',
        'Codes emerge from the data; the codebook grows and is revised as themes form.',
        'Themes with defining quotations; a written narrative of each theme.',
        'Not the frame: a single researcher coding well, with the judgement shown rather than a coefficient. (Braun & Clarke, 2006, 2019)',
        'Central. The researcher’s stance is part of the analysis and belongs in the write-up. (Braun & Clarke, 2019)',
        'Carries the mechanics — passages to codes, codes to themes, memos, the record. The reflexive writing is yours: it happens in the memo fields, which are off until you turn them on.',
      ],
    },
    {
      approach: 'Qualitative content analysis (CA)',
      cells: [
        'What is in the text, and how much of it is there?',
        'The coded unit — a defined stretch of text placed in a category.',
        'Codes derive from a framework or emerge, then categories are defined and counted.',
        'A category system with frequencies; matrices of category by case.',
        'Central. Inter-coder agreement (e.g. Krippendorff’s alpha) and a documented codebook. (Hsieh & Shannon, 2005; Krippendorff, 2019)',
        'Present but quieter: the analyst defines categories and inclusion rules, and those definitions are the audit trail. (Krippendorff, 2019)',
        'Carries the counting directly — frequency, document × code, and the whole codebook exported for an appendix. Agreement across coders is not computed here; export the codings and compute it where you report it.',
      ],
    },
  ],
  citations: [
    'Braun, V., & Clarke, V. (2006). Using thematic analysis in psychology. Qualitative Research in Psychology, 3(2), 77–101. https://doi.org/10.1191/1478088706qp063oa',
    'Braun, V., & Clarke, V. (2019). Reflecting on reflexive thematic analysis. Qualitative Research in Sport, Exercise and Health, 11(4), 589–597. https://doi.org/10.1080/2159676X.2019.1628806',
    'Hsieh, H.-F., & Shannon, S. E. (2005). Three approaches to qualitative content analysis. Qualitative Health Research, 15(9), 1277–1288. https://doi.org/10.1177/1049732305276687',
    'Krippendorff, K. (2019). Content analysis: An introduction to its methodology (4th ed.). SAGE. ISBN 978-1-5063-9566-1',
  ],
}

/** The boundary. The four positions come from docs/NOT_BUILDING.md, each with
 *  its reason and where to look instead; the scope decision is recorded the
 *  same way, because a decision is not a stance. */
export const NOT_DOING = {
  label: 'The boundary',
  title: 'Four things it does not do.',
  body:
    'A short list, because only decisions that follow from the tool’s stance belong ' +
    'on it. Anything that is merely a lot of work is an optional block you can switch on.',
  items: [
    {
      name: 'Automatic coding',
      reason:
        'A one-click codebook would be easy to build and would remove the thing that ' +
        'makes the analysis valid. The model proposes; a person decides, and the decision ' +
        'is recorded.',
      instead: 'NVivo, MAXQDA and ATLAS.ti all ship autocoding or AI-assist features.',
    },
    {
      name: 'Cloud accounts',
      reason:
        'An account means a server, which means the transcripts sit somewhere you cannot ' +
        'see. Local is the feature, not the limitation.',
      instead: 'A hosted CAQDAS — Delve, or the web editions of the desktop suites.',
    },
    {
      name: 'Real-time collaboration',
      reason:
        'Sharing live means accounts, conflict resolution and a server holding the data. ' +
        'The project file is portable instead: hand it over and both copies can be compared.',
      instead: 'The hosted tools above, which are built for shared projects.',
    },
    {
      name: 'Semantic (vector) search',
      struckReason:
        'A researcher looking for every quotation about data sharing wants to know why ' +
        'each one came back. Keyword search is explainable; embeddings are not.',
      revision:
        'That was the first reason, and it is withdrawn: explainability was the wrong ' +
        'frame. The questions this tool answers are enumerable and reviewable — every ' +
        'quotation that mentions data sharing, shown with its offsets — and a recall ' +
        'that cannot be pointed at changes what the product is, not how well it searches.',
      reason:
        'Keyword hits can be shown; vector recall cannot. The product boundary holds. ' +
        '(Revised 2026-10; the earlier reason is struck through above.)',
      instead: 'A local embedding search over the exported JSON, if you want one.',
    },
  ],
  scopeDecision: {
    name: 'Snapshots: restore entry is wide-screen only',
    reason:
      'The restore button and its dialog are hidden below 800px, because restoring a ' +
      'project from a backup is something you do at the computer the project lives on. ' +
      'Automatic snapshots keep being written after every change, on a phone too — only ' +
      'the restore entry is desktop-only.',
  },
}

export const DATA_SECTION = {
  label: 'Data',
  title: 'Try it on public data first.',
  body:
    'You do not need your own transcripts to walk the whole workflow. These corpora ' +
    'are published and openly licensed, and each one arrives in a different export ' +
    'format — so between them they exercise every import path. The demo opens the ' +
    'Bologna corpus (CC0).',
}

export const FOOTER = {
  licence:
    'QualiCraft is released under the MIT licence. The datasets above carry their own ' +
    'licences, listed on each card.',
  cite:
    'Cite the workbench as: QualiCraft (0.1) [Computer software]. Local-first ' +
    'qualitative coding workbench. Available from the project’s releases page.',
  /** Left empty on purpose: no address exists yet. See the T7 report. */
  feedback: '',
}

export const ABOUT = {
  title: 'A research tool that keeps the record.',
  body:
    'QualiCraft is built for interview studies where the analysis has to be defensible: ' +
    'every coding traceable to a passage, every model suggestion reviewable, every change ' +
    'to the codebook recoverable. It runs on your machine, stores one SQLite file, and ' +
    'never opens a connection you did not ask for.',
  principles: [
    {
      name: 'Your data stays here',
      detail:
        'Local files, no account, no upload. Which is what ethics review asks for anyway.',
    },
    {
      name: 'Every suggestion can be traced',
      detail:
        'A suggestion is anchored to character offsets, and its quotation has to match ' +
        'the source exactly or it is discarded. Accepting it stays your decision, and the ' +
        'decision is recorded.',
    },
    {
      name: 'The method writes itself down',
      detail:
        'How the codebook changed, where AI helped, what was rejected — exported as ' +
        'Markdown, not reconstructed from memory a fortnight later.',
    },
    {
      name: 'The interface follows the study',
      detail:
        'Switch a capability off and it leaves the interface rather than sitting there ' +
        'greyed out. A content analyst and a grounded theorist should not see the same screen.',
    },
  ],
}

export const SEO = {
  siteName: 'QualiCraft',
  title: 'QualiCraft — a researcher-led qualitative coding workbench',
  description:
    'A qualitative research workbench that runs on your own machine. Code transcripts, ' +
    'group codes into themes, and export a methods record without your data leaving the desk.',
  report: {
    title: 'A worked example · figures from the Bologna corpus',
    description:
      'Five figures drawn by the QualiCraft workbench from a public, CC0-licensed interview ' +
      'corpus, with the counts behind each one.',
  },
  about: {
    title: 'About QualiCraft',
    description:
      'What QualiCraft is, who it is for, and what it deliberately does not do.',
  },
}
