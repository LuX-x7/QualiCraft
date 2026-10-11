/**
 * Kernel · QT block library
 * ---------------------------------------------------------------------------
 * The modules specific to this site. Everything here follows the same contract
 * as the base library: a label, a list of fields, a renderer. The admin editor
 * is generated from the fields, so dropping one of these onto a page needs no
 * further code.
 *
 * Data blocks store a query, never a copy. Change a dataset record once and the
 * home page, the docs page and the detail page all move together.
 */

import QtMark from '@/components/QtMark'
import { Btn, Media, Section, SectionHead } from '@/components/ui'
import { registerBlock } from './types'

/* ------------------------------- utilities ------------------------------- */

function Lines({ text, className = '' }: { text?: string; className?: string }) {
  const lines = String(text || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  if (!lines.length) return null
  // *word* marks the accented run, the way the reference site does it.
  const parts = (line: string) =>
    line.split(/(\*[^*]+\*)/g).map((chunk, index) =>
      chunk.startsWith('*') && chunk.endsWith('*') && chunk.length > 2 ? (
        <em key={index}>{chunk.slice(1, -1)}</em>
      ) : (
        <span key={index}>{chunk}</span>
      ),
    )
  return (
    <>
      {lines.map((line, index) => (
        <span className={`line${index === lines.length - 1 ? ' line--last' : ''} ${className}`} key={index}>
          {parts(line)}
        </span>
      ))}
    </>
  )
}

const LINK_FIELDS = [
  { key: 'primary_label', label: 'Primary button label', type: 'text' as const, span: 1 as const },
  {
    key: 'primary_href',
    label: 'Primary button link',
    type: 'text' as const,
    span: 1 as const,
    help: 'A path like /app, or a full URL.',
  },
  { key: 'secondary_label', label: 'Secondary button label', type: 'text' as const, span: 1 as const },
  { key: 'secondary_href', label: 'Secondary button link', type: 'text' as const, span: 1 as const },
]

/* --------------------------------- layout -------------------------------- */

registerBlock({
  type: 'qtHero',
  label: 'Hero (QT)',
  group: 'layout',
  hint: 'The opening statement, with the QT block mark above it.',
  initial: () => ({
    eyebrow: 'Qualitative research · Local first · Auditable',
    headline: 'Many tools help you code.\nThis one is *yours*.',
    body: '',
    primary_label: 'Enter the workspace',
    primary_href: '/app',
    secondary_label: '',
    secondary_href: '',
    footnote: 'No account. No upload. Runs on your own machine.',
    show_mark: true,
    mark_size: 20,
  }),
  fields: [
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', span: 1 },
    {
      key: 'headline',
      label: 'Headline',
      type: 'textarea',
      span: 2,
      required: true,
      help: 'Press Enter to break the line. The last line is emphasised. Wrap a word in *asterisks* to accent it.',
    },
    { key: 'body', label: 'Intro paragraph', type: 'textarea', span: 2 },
    ...LINK_FIELDS,
    { key: 'footnote', label: 'Footnote', type: 'text', span: 2 },
    { key: 'show_mark', label: 'Show the QT block mark', type: 'boolean', span: 1 },
    { key: 'mark_size', label: 'Mark cell size (px)', type: 'number', span: 1 },
  ],
  render: ({ data, ctx }) => (
    <Section size="lg" className="blk-hero blk-hero--qt">
      <div className="hero__grid hero__grid--stack">
        <div className="hero__text">
          {data.show_mark !== false ? (
            <QtMark label={ctx.settings.identity.site_name} size={Number(data.mark_size) || 20} animate />
          ) : null}
          {data.eyebrow ? <p className="label">{data.eyebrow}</p> : null}
          <h1 className="display">
            <Lines text={data.headline} />
          </h1>
          {data.body ? <p className="hero__body">{data.body}</p> : null}
          {data.primary_label || data.secondary_label ? (
            <div className="hero__actions">
              <Btn href={data.primary_href || '/app'} variant="ink" size="lg" settings={ctx.settings} i18n={ctx.i18n}>
                {data.primary_label || 'Enter the workspace'}
              </Btn>
              {data.secondary_label ? (
                <Btn href={data.secondary_href} variant="ghost" size="lg" settings={ctx.settings} i18n={ctx.i18n}>
                  {data.secondary_label}
                </Btn>
              ) : null}
            </div>
          ) : null}
          {data.footnote ? <p className="hero__foot">{data.footnote}</p> : null}
        </div>
      </div>
    </Section>
  ),
})

/* -------------------------------- the tool ------------------------------- */

registerBlock({
  type: 'qtWorkspace',
  label: 'Workspace demo',
  group: 'content',
  hint: 'A wide pane showing a passage being coded, beside a narrower column of copy.',
  initial: () => ({
    label: 'How it works',
    title: 'Three moves, and that is the whole tool.',
    body: 'We kept the interface small on purpose. There is no new vocabulary to learn.',
    steps: [
      { name: 'Select', detail: 'Highlight a passage. The coding box opens against the selection.' },
      { name: 'Apply', detail: 'Type a keyword and press Enter. An existing code is reused; a new one is created in place.' },
      { name: 'Read the shape', detail: 'Group codes into themes, then read the frequency table or the co-occurrence figure.' },
    ],
    passage: 'The participant keeps returning to the toolchain, especially the alignment problem once code is generated.',
    highlight_a: 'keeps returning to the toolchain',
    highlight_b: 'the alignment problem once code is generated',
  }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 1 },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    { key: 'body', label: 'Intro paragraph', type: 'textarea', span: 2 },
    {
      key: 'steps',
      label: 'Steps',
      type: 'repeater',
      span: 2,
      itemLabel: 'name',
      fields: [
        { key: 'name', label: 'Step', type: 'text', span: 2 },
        { key: 'detail', label: 'Detail', type: 'textarea', span: 2 },
      ],
    },
    { key: 'passage', label: 'Sample passage', type: 'textarea', span: 2, help: 'Shown in the demo pane.' },
    { key: 'highlight_a', label: 'First highlight', type: 'text', span: 1 },
    { key: 'highlight_b', label: 'Second highlight', type: 'text', span: 1 },
  ],
  render: ({ data }) => {
    const passage = String(data.passage || '')
    const a = String(data.highlight_a || '')
    const b = String(data.highlight_b || '')
    let rendered = passage
    // Wrap the two highlights without letting a missing one break the passage.
    const marks: Array<[string, string]> = [
      [a, '<mark class="demo-hl demo-hl--a">'],
      [b, '<mark class="demo-hl demo-hl--b">'],
    ]
    for (const [needle, open] of marks) {
      if (needle && rendered.includes(needle)) {
        rendered = rendered.replace(needle, `${open}${needle}</mark>`)
      }
    }
    const steps = Array.isArray(data.steps) ? data.steps : []
    return (
      <Section className="blk-workspace">
        <div className="ws-grid">
          <div className="ws-pane">
            <div className="ws-chrome">
              <span />
              <span />
              <span />
            </div>
            <div className="ws-body">
              <p dangerouslySetInnerHTML={{ __html: rendered }} />
            </div>
            <div className="ws-pop">
              <div className="ws-pop__row">
                <span className="ws-pop__dot" />
                Type a keyword, press Enter
              </div>
              <div className="ws-pop__item">
                <i style={{ background: 'var(--terracotta)' }} />
                Architecture–code alignment
              </div>
              <div className="ws-pop__item ws-pop__item--active">
                <i style={{ background: 'var(--accent)' }} />
                Change propagation
              </div>
              <div className="ws-pop__item ws-pop__item--create">+ Create &ldquo;toolchain&rdquo;</div>
            </div>
          </div>
          <div className="ws-copy">
            {data.label ? <p className="label">{data.label}</p> : null}
            {data.title ? (
              <h2 className="h2">
                <Lines text={data.title} />
              </h2>
            ) : null}
            {data.body ? <p className="lede">{data.body}</p> : null}
            <ol className="ws-steps">
              {steps.map((step: any, index: number) => (
                <li key={index}>
                  <strong>{step.name}</strong>
                  <span>{step.detail}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>
    )
  },
})

/* --------------------------------- method -------------------------------- */

registerBlock({
  type: 'qtPhases',
  label: 'Analysis phases',
  group: 'data',
  hint: 'The six phases of the workflow, read from the phases collection.',
  initial: () => ({ label: 'Method', title: 'It knows which step you are on.', body: '' }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 1 },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    { key: 'body', label: 'Intro paragraph', type: 'textarea', span: 2 },
  ],
  render: async ({ data, ctx }) => {
    const phases = await ctx.get('phases', { limit: 12 })
    if (!phases.length) return null
    return (
      <Section className="blk-phases">
        <SectionHead label={data.label} title={data.title} body={data.body} />
        <div className="phase-grid">
          {phases.map((phase) => (
            <article className={`phase phase--${phase.data.supported || 'full'}`} key={phase.id}>
              <span className="phase__n">{String(phase.data.number ?? '').padStart(2, '0')}</span>
              <strong>{phase.title}</strong>
              <p>{phase.data.summary}</p>
              {phase.data.supported === 'partial' ? <span className="phase__flag">Partly covered</span> : null}
              {phase.data.supported === 'none' ? <span className="phase__flag">Not yet</span> : null}
            </article>
          ))}
        </div>
      </Section>
    )
  },
})

/* ---------------------------- the two methods ---------------------------- */

/**
 * Thematic analysis against content analysis, on the same axes.
 *
 * A first project usually has to choose between these two, and the choice is
 * made by the research question rather than by preference — so the comparison
 * is laid out as a table rather than as two descriptions a reader has to hold
 * in their head at once. The last row is the one that matters for this tool:
 * both are supported, and the difference shows up in whether the categories
 * are built first or allowed to emerge.
 */
const METHOD_ROWS: Array<[string, string, string]> = [
  [
    'The question it answers',
    'How do people understand this?',
    'How often does this come up?',
  ],
  [
    'Where the codes come from',
    'Open coding first, then grouped into themes',
    'A category list is settled first, then the material is filed into it',
  ],
  [
    'How much the codebook moves',
    'Revised throughout. Merging, splitting and re-parenting are normal',
    'Categories settle early and then stay put',
  ],
  [
    'What you end up with',
    'Themes, each carried by quotations',
    'Frequencies, and a case-by-code table',
  ],
  [
    'What it looks like here',
    'The codebook tree, the relationship map, the hierarchy figure',
    'The frequency figure and the document × code matrix',
  ],
]

registerBlock({
  type: 'qtMethods',
  label: 'Methods comparison',
  group: 'content',
  hint: 'Thematic analysis against content analysis, plus the phases of a thematic analysis.',
  initial: () => ({
    label: 'Method',
    title: 'Two ways to read the same transcript.',
    body: 'These are the two a first project usually has to choose between, and they are not a right answer and a wrong one — the research question decides. The same comparison, on the same axes.',
  }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 1 },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    { key: 'body', label: 'Intro paragraph', type: 'textarea', span: 2 },
  ],
  render: async ({ data, ctx }) => {
    const phases = await ctx.get('phases', { limit: 12 })
    return (
      <Section className="blk-methods">
        <SectionHead label={data.label} title={data.title} body={data.body} />

        <div className="methods-wrap">
          <table className="methods">
            <thead>
              <tr>
                <th scope="col" className="methods__axis">On this axis</th>
                <th scope="col">Thematic analysis</th>
                <th scope="col">Content analysis</th>
              </tr>
            </thead>
            <tbody>
              {METHOD_ROWS.map(([axis, thematic, content]) => (
                <tr key={axis}>
                  <th scope="row">{axis}</th>
                  <td>{thematic}</td>
                  <td>{content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="methods__note">
          You decide which one you are doing before you open the tool, and it comes down to a single
          question: do you settle the categories first, or do you let them emerge? QualiCraft does not
          force either. The codebook is the same structure in both cases, which is why the same
          workspace serves a content analysis and a grounded theory study.
        </p>

        {phases.length ? (
          <div className="methods__phases">
            <h3>If you are doing a thematic analysis</h3>
            <p>
              The familiar six phases, and what each one asks of you. The workspace is arranged in
              this order rather than laying every panel out at once, so it can tell you what to do
              next instead of leaving you to guess.
            </p>
            <div className="phase-grid">
              {phases.map((phase) => (
                <article className={`phase phase--${phase.data.supported || 'full'}`} key={phase.id}>
                  <span className="phase__n">{String(phase.data.number ?? '').padStart(2, '0')}</span>
                  <strong>{phase.title}</strong>
                  <p>{phase.data.summary}</p>
                  {phase.data.supported === 'partial' ? <span className="phase__flag">Partly covered</span> : null}
                  {phase.data.supported === 'none' ? <span className="phase__flag">Not yet</span> : null}
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </Section>
    )
  },
})

/* ------------------------------ capabilities ----------------------------- */

registerBlock({
  type: 'qtCapabilities',
  label: 'Capability blocks',
  group: 'data',
  hint: 'The optional blocks a study can switch on, read from the capabilities collection.',
  initial: () => ({
    label: 'Capability blocks',
    title: 'Start with three things. Add the rest when you need them.',
    body: 'Documents, codes and codings are always there. Everything else is a block you drop in — and which blocks a study used is stored with the project.',
  }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 1 },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    { key: 'body', label: 'Intro paragraph', type: 'textarea', span: 2 },
  ],
  render: async ({ data, ctx }) => {
    const items = await ctx.get('capabilities', { limit: 40 })
    if (!items.length) return null
    return (
      <Section className="blk-capabilities">
        <SectionHead label={data.label} title={data.title} body={data.body} />
        <div className="cap-tray">
          {items.map((item) => (
            <article className={`cap cap--${item.data.default_on ? 'on' : 'off'}`} key={item.id}>
              <span className="cap__grip" />
              <div className="cap__body">
                <strong>{item.title}</strong>
                <span>{item.data.summary}</span>
              </div>
              <span className="cap__state">{item.data.default_on ? 'On by default' : 'Add when needed'}</span>
            </article>
          ))}
        </div>
      </Section>
    )
  },
})

/* -------------------------------- datasets ------------------------------- */

registerBlock({
  type: 'qtDatasets',
  label: 'Dataset list',
  group: 'data',
  hint: 'Public corpora a visitor can try, read from the datasets collection.',
  initial: () => ({
    label: 'Datasets',
    title: 'Try it on public data first.',
    body: 'You do not need your own transcripts to walk the whole workflow.',
  }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 1 },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    { key: 'body', label: 'Intro paragraph', type: 'textarea', span: 2 },
  ],
  render: async ({ data, ctx }) => {
    const items = await ctx.get('datasets', { limit: 12 })
    if (!items.length) return null
    return (
      <Section className="blk-datasets">
        <SectionHead label={data.label} title={data.title} body={data.body} />
        {/* Horizontal rather than a grid: five corpora do not fit across, and
            the format label is the point of each card, so the cards want to be
            read side by side. The scroll container carries its own fade so a
            desktop reader can see there is more to the right. */}
        <div className="dataset-scroll">
          <div className="dataset-track">
            {items.map((item) => (
              <article className="dataset" key={item.id}>
                <div className="dataset__top">
                  <span className="dataset__format">{item.data.format}</span>
                  {item.data.year ? <span className="dataset__year">{item.data.year}</span> : null}
                </div>
                <strong>{item.title}</strong>
                {item.data.author ? <p className="dataset__by">{item.data.author}</p> : null}
                <p>{item.data.summary}</p>
                <div className="dataset__meta">
                  {item.data.interviews ? <span>{item.data.interviews} interviews</span> : null}
                  {item.data.codes ? <span>{item.data.codes} codes</span> : null}
                  {item.data.language ? <span>{item.data.language}</span> : null}
                </div>
                <div className="dataset__licence">
                  <span>{item.data.licence}</span>
                  {item.data.share_alike ? (
                    <em>Share-alike: anything derived from it carries the same licence.</em>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>
    )
  },
})

/* ------------------------------- principles ------------------------------ */

registerBlock({
  type: 'qtPrinciples',
  label: 'Principles',
  group: 'content',
  hint: 'Three or four statements about how the tool behaves.',
  initial: () => ({
    label: 'Why it is built this way',
    title: 'Not more features. A different structure.',
    body: '',
    items: [
      {
        name: 'Your data stays here',
        detail: 'Transcripts, codings and the codebook live in local files. No account, no upload, no cloud copy.',
      },
      {
        name: 'Every suggestion can be traced',
        detail: 'A model proposal is anchored to character offsets, and its quotation has to match the source exactly or it is discarded.',
      },
      {
        name: 'The method writes itself down',
        detail: 'How the codebook changed, where AI helped, what was rejected — exported as Markdown instead of reconstructed from memory.',
      },
    ],
  }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 1 },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    { key: 'body', label: 'Intro paragraph', type: 'textarea', span: 2 },
    {
      key: 'items',
      label: 'Statements',
      type: 'repeater',
      span: 2,
      itemLabel: 'name',
      fields: [
        { key: 'name', label: 'Heading', type: 'text', span: 2 },
        { key: 'detail', label: 'Detail', type: 'textarea', span: 2 },
      ],
    },
  ],
  render: ({ data }) => {
    const items = Array.isArray(data.items) ? data.items : []
    return (
      <Section className="blk-principles">
        <SectionHead label={data.label} title={data.title} body={data.body} />
        <div className="principle-grid">
          {items.map((item: any, index: number) => (
            <article className="principle" key={index}>
              <h3>{item.name}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </Section>
    )
  },
})

/* ------------------------------- entry point ----------------------------- */

registerBlock({
  type: 'qtEnter',
  label: 'Enter the workspace',
  group: 'convert',
  hint: 'The closing call to action that opens the tool.',
  initial: () => ({
    title: 'Start with one interview.',
    body: 'Import a transcript, mark the first passage, and see what the codebook looks like after an hour.',
    primary_label: 'Enter the workspace',
    primary_href: '/app',
    footnote: 'The workspace runs on this machine.',
  }),
  fields: [
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    { key: 'body', label: 'Paragraph', type: 'textarea', span: 2 },
    ...LINK_FIELDS,
    { key: 'footnote', label: 'Footnote', type: 'text', span: 2 },
  ],
  render: ({ data, ctx }) => (
    <Section className="blk-cta">
      <div className="cta__inner">
        {data.title ? <h2 className="cta__headline">{data.title}</h2> : null}
        {data.body ? <p className="cta__body">{data.body}</p> : null}
        <div className="hero__actions">
          <Btn href={data.primary_href || '/app'} variant="ink" size="lg" settings={ctx.settings} i18n={ctx.i18n}>
            {data.primary_label || 'Enter the workspace'}
          </Btn>
          {data.secondary_label ? (
            <Btn href={data.secondary_href} variant="ghost" size="lg" settings={ctx.settings} i18n={ctx.i18n}>
              {data.secondary_label}
            </Btn>
          ) : null}
        </div>
        {data.footnote ? <p className="hero__foot">{data.footnote}</p> : null}
      </div>
    </Section>
  ),
})

/* --------------------------------- mark ---------------------------------- */

registerBlock({
  type: 'qtMarkBlock',
  label: 'QT mark',
  group: 'layout',
  hint: 'The block mark on its own, for use as a divider.',
  initial: () => ({ size: 16, label: '' }),
  fields: [
    { key: 'size', label: 'Cell size (px)', type: 'number', span: 1 },
    { key: 'label', label: 'Caption', type: 'text', span: 1 },
  ],
  render: ({ data, ctx }) => (
    <Section className="blk-mark">
      <QtMark label={data.label || ctx.settings.identity.site_name} size={Number(data.size) || 16} />
      {data.label ? <p className="label">{data.label}</p> : null}
    </Section>
  ),
})

/* Re-exported so the media helper stays in one place if a block needs it. */
export { Media }
