/**
 * Kernel · QT first-run content
 * ---------------------------------------------------------------------------
 * The pages and records the site starts with. Kept apart from bootstrap.ts so
 * the kernel stays generic and the content lives in one readable place.
 *
 * Everything here is editable afterwards in the admin; nothing is hard-coded
 * into a component.
 */

export const QT_PAGES: Array<{
  slug: string
  title: string
  seo_title: string
  seo_description: string
  show_in_nav: boolean
  nav_label: string
  nav_order: number
  blocks: Array<{ type: string; data: Record<string, any> }>
}> = [
  {
    slug: 'home',
    title: 'Home',
    seo_title: 'QualiCraft — a researcher-led qualitative coding workbench',
    seo_description:
      'A qualitative research workbench that runs on your own machine. Code transcripts, group codes into themes, and export a methods record without your data leaving the desk.',
    show_in_nav: false,
    nav_label: 'Home',
    nav_order: 0,
    blocks: [
      {
        type: 'qtHero',
        data: {
          eyebrow: 'Qualitative research · Local first · Auditable',
          headline: 'Many tools help you do qualitative research,\nbut *this one is yours*.',
          body: 'A workbench for interview studies. Mark passages, build a codebook, group it into themes — and keep the whole record of how you got there. Everything stays on this machine.',
          primary_label: 'Enter the workspace',
          primary_href: '/app',
          secondary_label: 'See the method',
          secondary_href: '/method',
          footnote: 'No account. No upload. Runs offline.',
          show_mark: true,
          mark_size: 22,
        },
      },
      {
        type: 'qtWorkspace',
        data: {
          label: 'How it works',
          title: 'Three moves, and that is the whole tool.',
          body: 'We kept the interface small on purpose. There is no new vocabulary to learn — you read, you mark, you look at the shape.',
          passage:
            'The participant keeps returning to the toolchain, especially the alignment problem once code is generated. He treats the model as the only source of truth, which is why a change to the architecture forces a full regeneration.',
          highlight_a: 'keeps returning to the toolchain',
          highlight_b: 'forces a full regeneration',
          steps: [
            {
              name: 'Select',
              detail: 'Highlight a passage in the transcript. The coding box opens against the selection, not at the bottom of the page.',
            },
            {
              name: 'Apply',
              detail: 'Type a keyword and press Enter. An existing code is reused; if nothing matches, the code is created and applied in the same keystroke.',
            },
            {
              name: 'Read the shape',
              detail: 'Group codes into themes, then read the frequency table or the co-occurrence figure. Both come from the same codings.',
            },
          ],
        },
      },
      {
        type: 'showcase',
        data: {
          eyebrow: 'How it works',
          headline: 'Five modules, taken as you need them.',
          body: 'Import, code, analyse, plot, export. Each one stands on its own — nothing forces you through a step you do not want. The clips below are the running workbench, recorded step by step.',
        },
      },
      {
        type: 'qtPhases',
        data: {
          label: 'Method',
          title: 'It knows which step you are on.',
          body: 'The workspace follows the six phases of a thematic analysis rather than laying every panel out at once, so the interface tells you what to do next instead of leaving you to guess.',
        },
      },
      {
        type: 'qtCapabilities',
        data: {
          label: 'Capability blocks',
          title: 'Start with three things. Add the rest when you need them.',
          body: 'Documents, codes and codings are always there. Everything else is a block you drop in — and which blocks a study used is stored with the project, so it becomes part of the record.',
        },
      },
      {
        type: 'qtPrinciples',
        data: {
          label: 'Why it is built this way',
          title: 'Not more features. A different structure.',
          body: '',
          items: [
            {
              name: 'Your data stays here',
              detail:
                'Transcripts, codings and the codebook live in local files. There is no account, no upload and no cloud copy — which is what ethics review and data protection actually require.',
            },
            {
              name: 'Every suggestion can be traced',
              detail:
                'A model proposal is anchored to character offsets, and its quotation has to match the source exactly or it is thrown away. Whether to accept it is your decision, and the decision is recorded.',
            },
            {
              name: 'The method writes itself down',
              detail:
                'How the codebook changed, where AI helped, what was rejected — exported as Markdown instead of reconstructed from memory two weeks after the analysis finished.',
            },
            {
              name: 'The interface follows the study',
              detail:
                'Switch a capability off and it disappears from the interface rather than sitting there greyed out. A content analyst and a grounded theorist should not be looking at the same screen.',
            },
          ],
        },
      },
      {
        type: 'qtDatasets',
        data: {
          label: 'Datasets',
          title: 'Try it on public data first.',
          body: 'You do not need your own transcripts to walk the whole workflow. Both corpora below are published and bundled with the tool.',
        },
      },
      {
        type: 'qtEnter',
        data: {
          title: 'Start with one interview.',
          body: 'Import a transcript, mark the first passage, and see what the codebook looks like after an hour.',
          primary_label: 'Enter the workspace',
          primary_href: '/app',
          secondary_label: 'Read the method',
          secondary_href: '/method',
          footnote: 'The workspace runs on this machine.',
        },
      },
    ],
  },

  {
    slug: 'method',
    title: 'Method',
    seo_title: 'Method — how QualiCraft follows a thematic analysis',
    seo_description:
      'The six phases of a thematic analysis, and what the tool does at each one. Including the phases it does not cover yet.',
    show_in_nav: true,
    nav_label: 'Method',
    nav_order: 1,
    blocks: [
      {
        type: 'pageHeader',
        data: {
          eyebrow: 'Method',
          title: 'Built around a workflow, not a feature list.',
          body: 'The tool is organised by the phases of a thematic analysis. Here is what each phase needs, and what QT actually does about it — including where it falls short.',
        },
      },
      { type: 'qtPhases', data: { label: '', title: 'The six phases', body: '' } },
      {
        type: 'richtext',
        data: {
          title: 'On honesty about coverage',
          body: 'Phase four, reviewing themes, is only partly supported: codes can be merged, split and re-parented, but there is no dedicated view for the codes that have not been grouped yet. Phase one originally had nowhere to put familiarisation notes; it now has a reading note on each document.\n\nWe list what is missing rather than quietly omitting it, because a method section that overstates its tooling is worse than one that names its limits.',
        },
      },
    ],
  },

  {
    slug: 'about',
    title: 'About',
    seo_title: 'About QualiCraft',
    seo_description: 'What QT is, who it is for, and what it deliberately does not do.',
    show_in_nav: true,
    nav_label: 'About',
    nav_order: 2,
    blocks: [
      {
        type: 'pageHeader',
        data: {
          eyebrow: 'About',
          title: 'A research tool that keeps the record.',
          body: 'QT is built for interview studies where the analysis has to be defensible: every coding traceable to a passage, every model suggestion reviewable, every change to the codebook recoverable.',
        },
      },
      {
        type: 'values',
        data: {
          label: 'What we did not build',
          title: 'The omissions are decisions, not gaps.',
          body: 'Writing down what a tool refuses to do is how it stays small enough to trust.',
          items: [
            {
              name: 'No automatic coding',
              detail:
                'A one-click codebook would be easy to build and would destroy the thing that makes the analysis valid. The model proposes; a person decides.',
            },
            {
              name: 'No cloud accounts',
              detail:
                'An account means a server, which means the transcripts are somewhere you cannot see. Local is the feature, not a limitation.',
            },
            {
              name: 'No vector search',
              detail:
                'A researcher looking for every quotation about data sharing wants to know why each one came back. Keyword search is explainable; embeddings are not.',
            },
            {
              name: 'No word clouds',
              detail:
                'They are decorative. A co-occurrence matrix carries more information in the same space.',
            },
          ],
        },
      },
    ],
  },
]

export const QT_SETTINGS = {
  identity: {
    site_name: 'QualiCraft',
    site_short: 'QC',
    tagline: 'A qualitative research workbench',
    logo_text: 'QC',
    description: 'Code interviews, build themes, keep the record. Runs on your own machine.',
  },
  contact: {
    email: '',
    phone: '',
    whatsapp: '',
    whatsapp_message: '',
    address: '',
    hours: '',
  },
  social: { linkedin: '', facebook: '', instagram: '' },
  theme: { accent: '#4b607c', accent_ink: '#33465c' },
  seo: {
    default_title: 'QualiCraft — a researcher-led qualitative coding workbench',
    default_description: 'A qualitative research workbench that runs locally and keeps a readable record of the analysis.',
  },
  languages: { enabled: ['en', 'zh'], default: 'en' },
}

/** Records for the QT collections, keyed by collection name. */
export const QT_ENTRIES: Record<string, Array<{ title: string; slug: string; data: Record<string, any> }>> = {
  capabilities: [
    {
      title: 'Documents, codes and codings',
      slug: 'core',
      data: {
        name: 'Documents, codes and codings',
        group: 'core',
        summary: 'The three things every study has. Always available, never switchable off.',
        default_on: true,
        position: 0,
        icon: 'grid',
      },
    },
    {
      title: 'Theme grouping',
      slug: 'theme-grouping',
      data: {
        name: 'Theme grouping',
        group: 'coding',
        summary: 'Group codes under themes. Turns the flat list into a collapsible tree with rolled-up counts.',
        default_on: true,
        position: 1,
        icon: 'grid',
      },
    },
    {
      title: 'Memos',
      slug: 'memos',
      data: {
        name: 'Memos',
        group: 'coding',
        summary: 'Reading notes on a document, notes on a code or theme, notes on a single coding.',
        default_on: true,
        position: 2,
        icon: 'doc',
      },
    },
    {
      title: 'AI suggestions',
      slug: 'ai-suggestions',
      data: {
        name: 'AI suggestions',
        group: 'analysis',
        summary: 'A model proposes codings. Each one arrives in a review queue and only enters the codebook if you accept it.',
        default_on: true,
        position: 3,
        icon: 'star',
      },
    },
    {
      title: 'Frequency analysis',
      slug: 'frequency-analysis',
      data: {
        name: 'Frequency analysis',
        group: 'analysis',
        summary: 'How often each code was used, and a document by code matrix.',
        default_on: true,
        position: 4,
        icon: 'chart',
      },
    },
    {
      title: 'Audit trail',
      slug: 'audit-trail',
      data: {
        name: 'Audit trail',
        group: 'output',
        summary: 'Every action with a timestamp, stored with the project and included in exports.',
        default_on: true,
        position: 5,
        icon: 'history',
      },
    },
    {
      title: 'Plotting workbench',
      slug: 'plotting-workbench',
      data: {
        name: 'Plotting workbench',
        group: 'heavy',
        summary:
          'Publication figures drawn by an exported Python script, so a co-author can re-run them. Needs matplotlib; scipy adds clustering.',
        default_on: false,
        position: 6,
        icon: 'image',
      },
    },
    {
      title: 'Methods record',
      slug: 'methods-record',
      data: {
        name: 'Methods record',
        group: 'output',
        summary: 'A written account of how the analysis was carried out, assembled from the audit trail.',
        default_on: true,
        position: 7,
        icon: 'down',
      },
    },
  ],

  datasets: [
    {
      title: 'Tian 2021',
      slug: 'tian-2021',
      data: {
        name: 'Tian 2021',
        topic: 'Software architecture',
        interviews: 8,
        summary: 'Eight interviews with practising architects. No preset codes, so it is the better one for practising open coding.',
        has_reference_codes: false,
        position: 0,
      },
    },
    {
      title: 'TU Delft',
      slug: 'tu-delft',
      data: {
        name: 'TU Delft',
        topic: 'Research data management',
        interviews: 7,
        summary: 'Seven interviews with a published reference codebook, so you can code blind and then compare against it.',
        has_reference_codes: true,
        position: 1,
      },
    },
  ],

  phases: [
    { title: 'Familiarisation', slug: 'familiarisation', data: { number: 1, name: 'Familiarisation', summary: 'Read the transcripts and note first impressions. Each document carries a reading note.', supported: 'full', position: 0 } },
    { title: 'Open coding', slug: 'open-coding', data: { number: 2, name: 'Open coding', summary: 'Mark passages and let the codebook grow from the data. The coding box opens against the selection.', supported: 'full', position: 1 } },
    { title: 'Searching for themes', slug: 'searching', data: { number: 3, name: 'Searching for themes', summary: 'Group codes under candidate themes. The codebook supports several levels.', supported: 'full', position: 2 } },
    { title: 'Reviewing themes', slug: 'reviewing', data: { number: 4, name: 'Reviewing themes', summary: 'Merge, split and re-parent. There is no dedicated view for codes that are still ungrouped.', supported: 'partial', position: 3 } },
    { title: 'Defining and naming', slug: 'defining', data: { number: 5, name: 'Defining and naming', summary: 'Each code and theme carries a definition, inclusion and exclusion criteria, anchor examples and a status.', supported: 'full', position: 4 } },
    { title: 'Writing up', slug: 'writing-up', data: { number: 6, name: 'Writing up', summary: 'The methods record is generated from the audit trail and exported as Markdown.', supported: 'full', position: 5 } },
  ],

  figures: [
    { title: 'Theme co-occurrence heatmap', slug: 'cooccurrence', data: { name: 'Theme co-occurrence heatmap', summary: 'Which themes appear in the same passages, with bidirectional hierarchical clustering.', status: 'shipped', position: 0 } },
    { title: 'Diverging thematic bars', slug: 'diverging-bars', data: { name: 'Diverging thematic bars', summary: 'How often each theme is raised by each group, mirrored around a centre line.', status: 'planned', position: 1 } },
    { title: 'Mixed-methods bubble matrix', slug: 'bubble-matrix', data: { name: 'Mixed-methods bubble matrix', summary: 'Themes against groups, bubble size for how often a theme came up, colour for a quantitative score.', status: 'planned', position: 2 } },
  ],
}
