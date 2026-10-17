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
  { href: '/#modules', label: 'Workflow' },
  { href: '/#data', label: 'Data' },
  { href: '/#method', label: 'Methods' },
] as const

export const HERO = {
  eyebrow: 'Qualitative research · Local first · Researcher led',
  headline: ['Read closely.', 'Keep every coding traceable.'],
  body: 'Code passages, organise themes and check every link against the source. A local workbench for interview research.',
  primary: { label: 'Download and run locally', disabled: true, disabledNote: 'Windows validation pending' },
  secondary: { label: 'Open the read-only demo', href: '/w', note: 'First load may take about 30 seconds.' },
  report: { label: 'Read the example report', href: '/report' },
  footnote: 'Your project stays on your machine. The demo uses public Bologna data. AI suggestions become codings only after your review.',
}

/** The five steps of the walkthrough. Each: one goal, three verb-first
 *  operations, one thing to see. Under forty words apiece. */
export const MODULES = [
  {
    no: '01',
    key: 'import',
    title: 'Import',
    goal: 'Bring the source into view.',
    steps: [
      'Choose a .txt or .docx file.',
      'Name the document.',
      'Watch the paragraphs arrive.',
    ],
    see: 'Original text in numbered paragraphs, with document and character ranges preserved.',
  },
  {
    no: '02',
    key: 'coding',
    title: 'Coding',
    goal: 'Connect a passage, a code and its theme.',
    steps: [
      'Drag across a passage.',
      'Type a code name, press Enter.',
      'Code the same stretch twice if two ideas share it.',
    ],
    see: 'Keep the exact source range and full path. Assign Theme, Category or Code explicitly; the role stays with the saved node.',
  },
  {
    no: '03',
    key: 'analysis',
    title: 'Analysis',
    goal: 'Inspect the coding record.',
    steps: [
      'Open the Insights view.',
      'Read the frequency bars and the document × code matrix.',
      'Choose Figures → Co-occurrence heatmap.',
    ],
    see: 'Check counts against source passages; a frequent code is not automatically an important one.',
  },
  {
    no: '04',
    key: 'plotting',
    title: 'Plotting',
    goal: 'Choose from five existing views.',
    steps: [
      'Pick a figure type.',
      'Adjust only the controls that figure reads.',
      'Download the figure, the counts and the script.',
    ],
    see: 'Original figures, count CSVs and the script that generated them.',
  },
  {
    no: '05',
    key: 'export',
    title: 'Export',
    goal: 'Carry the evidence into your writing.',
    steps: [
      'Choose the document scope.',
      'Export coded HTML or Word.',
      'Write and version your Analysis Table and Narrative Analysis in Export.',
    ],
    see: 'A coded source notebook and an editable report, with saved figures, captions, counts and code.',
  },
] as const

/** Two methods, on the same axes. The claims are the two literatures', not
 *  ours: each row says what the method holds and how far this tool carries it.
 *  Citations verified 2026-10-13 against the published records. */
export const METHODS = {
  label: 'Method',
  title: 'Two ways to read the same transcript.',
  body:
    'TA and qualitative content analysis share passage coding, saved hierarchies and memos. Choose the approach that fits the research question; interpretation, reflexivity and reporting remain your work.',
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
      approach: 'Reflexive thematic analysis (one TA approach)',
      cells: [
        'What do participants make of X, and what does the field take it to mean?',
        'The coded meaning — a pattern across the corpus, not a single utterance.',
        'Researchers develop codes from the data or with theoretical guidance, then develop and revisit themes. Specify the TA approach used.',
        'Themes with defining quotations; a written narrative of each theme.',
        'For reflexive TA, inter-coder agreement is not the quality criterion; show reflexive engagement and a coherent interpretation. (Braun & Clarke, 2019)',
        'Central. The researcher’s stance is part of the analysis and belongs in the write-up. (Braun & Clarke, 2019)',
        'Carries the mechanics, memos and evidence. In Export, choose Thematic Analysis and write, save and restore your report with a method-specific review checklist. Theme development and interpretation remain researcher decisions.',
      ],
    },
    {
      approach: 'Qualitative content analysis (CA)',
      cells: [
        'How can the content and its meaning be interpreted through categories?',
        'The coded unit — a defined stretch of text placed in a category.',
        'Conventional approaches derive categories from data; directed approaches start with theory. Summative approaches combine counting with contextual interpretation.',
        'Categories with contextual interpretation; descriptive counts or matrices where justified.',
        'Conventional, directed and summative approaches have different coding and trustworthiness considerations. (Hsieh & Shannon, 2005)',
        'Describe how the analyst developed categories and inclusion rules and interpreted their context.',
        'Carries saved coding, descriptive counts and evidence. In Export, choose Qualitative Content Analysis to edit the Analysis Table, interpretation, method decisions and narrative. Agreement across coders is not computed here.',
      ],
    },
  ],
  writing: 'Available in Export: edit an Analysis Table and Narrative Analysis, choose saved quotations, compare and restore versions, and download HTML or editable Word. Save up to five figures with editable captions, frozen counts and code; download the complete report bundle. Project JSON preserves retained versions and shared figure assets. Changed coding is flagged; evidence refresh is explicit. Word edits stay in Word.',
  planned: [
    {
      name: 'Comparative QCA',
      detail: 'Qualitative Comparative Analysis is planned and unavailable. Calibration, truth tables and minimisation are not implemented. Coding counts and co-occurrence cannot stand in for this workflow.',
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
    'Four product decisions keep the workflow local and researcher led. Open a reason to inspect the boundary and alternatives.',
  items: [
    {
      name: 'Automatic coding',
      summary: 'The model proposes; you review each suggestion.',
      reason:
        'A one-click codebook would be easy to build and would remove the thing that ' +
        'makes the analysis valid. The model proposes; a person decides, and the decision ' +
        'is recorded.',
      instead: 'NVivo, MAXQDA and ATLAS.ti all ship autocoding or AI-assist features.',
    },
    {
      name: 'Cloud accounts',
      summary: 'Keep research files in the workspace you control.',
      reason:
        'An account means a server, which means the transcripts sit somewhere you cannot ' +
        'see. Local is the feature, not the limitation.',
      instead: 'A hosted CAQDAS — Delve, or the web editions of the desktop suites.',
    },
    {
      name: 'Real-time collaboration',
      summary: 'Share a portable project file, with its record.',
      reason:
        'Sharing live means accounts, conflict resolution and a server holding the data. ' +
        'The project file is portable instead: hand it over and both copies can be compared.',
      instead: 'The hosted tools above, which are built for shared projects.',
    },
    {
      name: 'Semantic (vector) search',
      summary: 'Review exact text matches and their source ranges.',
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
  title: 'Built on a checkable example.',
  body: 'This page and the report use the Bologna CC0 corpus. Its original Italian text and researcher coding are preserved. Other importer fixtures remain available below.',
}

export const FOOTER = {
  licence:
    'QualiCraft is released under the MIT licence. The datasets above carry their own ' +
    'licences, listed on each card.',
  cite:
    'Cite the workbench as: QualiCraft (0.1) [Computer software]. Local-first ' +
    'qualitative coding workbench.',
  /** Left empty on purpose: no address exists yet. See the T7 report. */
  feedback: '',
  feedbackUrl: 'https://github.com/LuX-x7/QualiCraft/issues',
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
