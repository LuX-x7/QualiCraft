/**
 * Kernel · block library
 * ---------------------------------------------------------------------------
 * Every module the owner can drop onto a page. A block is three things:
 * a label, a list of fields, and a renderer. The admin editor is generated
 * from the fields; the renderer is the only place markup lives.
 */

import Link from 'next/link'
import ModuleShowcase from '@/components/ModuleShowcase'
import QtMark from '@/components/QtMark'
import Icon, { iconForService, type IconName as WhyIcon } from '@/components/Icon'
import { Arrow, Btn, Chip, Empty, Media, Section, SectionHead } from '@/components/ui'
import { asArray, asList, daysUntil, formatDate, money } from '@/lib/kernel/ids'
import { markdown, plain } from '@/lib/kernel/md'
import { registerBlock, type RenderCtx } from './types'

/* ------------------------------- utilities ------------------------------- */

function Lines({ text, className = '' }: { text?: string; className?: string }) {
  const lines = String(text || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  if (!lines.length) return null
  return (
    <>
      {lines.map((line, index) => (
        <span className={`line${index === lines.length - 1 ? ' line--last' : ''} ${className}`} key={index}>
          {line}
        </span>
      ))}
    </>
  )
}

function videoEmbed(url: string): string {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return url
}

/* Icons cycled through the "Why choose us" cards. */
const WHY_ICONS: WhyIcon[] = ['shield', 'coin', 'compass', 'document']

const LINK_FIELDS = [
  { key: 'primary_label', label: 'Primary button label', type: 'text' as const, span: 1 as const },
  {
    key: 'primary_href',
    label: 'Primary button link',
    type: 'text' as const,
    span: 1 as const,
    help: 'A path like /contact, or the words whatsapp, email or phone.',
  },
  { key: 'secondary_label', label: 'Secondary button label', type: 'text' as const, span: 1 as const },
  { key: 'secondary_href', label: 'Secondary button link', type: 'text' as const, span: 1 as const },
]

/* --------------------------------- layout -------------------------------- */

registerBlock({
  type: 'hero',
  label: 'Hero',
  group: 'layout',
  hint: 'The opening statement. One per page.',
  initial: () => ({
    eyebrow: '',
    headline: 'A headline that\nearns the second line.',
    body: '',
    primary_label: 'Get started',
    primary_href: '/contact',
    secondary_label: '',
    secondary_href: '',
    footnote: '',
    media: '',
    variant: 'display',
    show_mark: false,
  }),
  fields: [
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', span: 1, placeholder: 'International Study Council' },
    {
      key: 'variant',
      label: 'Layout',
      type: 'select',
      span: 1,
      options: ['display', 'split', 'compact', 'mark'],
      help: 'display = large headline with portrait image, split = headline beside image, compact = text only.',
    },
    {
      key: 'headline',
      label: 'Headline',
      type: 'textarea',
      span: 2,
      required: true,
      help: 'Press Enter to break the line. The last line is emphasised.',
    },
    { key: 'body', label: 'Intro paragraph', type: 'textarea', span: 2 },
    ...LINK_FIELDS,
    { key: 'footnote', label: 'Footnote', type: 'text', span: 2, placeholder: 'No fees until you are admitted.' },
    {
      key: 'show_mark',
      label: 'Show the ISC block mark',
      type: 'boolean',
      span: 2,
      placeholder: 'Animated logo above the headline',
    },
    { key: 'media', label: 'Image', type: 'image', span: 2 },
  ],
  render: ({ data, ctx }) => {
    const variant = data.variant || 'display'
    return (
      <Section size="lg" className={`blk-hero blk-hero--${variant}`}>
        <div className="hero__grid">
          <div className="hero__text">
            {data.show_mark ? <QtMark label={ctx.settings.identity.site_name} size={13} animate /> : null}
            {data.eyebrow ? <p className="label">{data.eyebrow}</p> : null}
            <h1 className="display">
              <Lines text={data.headline} />
            </h1>
            {data.body ? <p className="hero__body">{data.body}</p> : null}
            {data.primary_label || data.secondary_label ? (
              <div className="hero__actions">
                <Btn href={data.primary_href || '/contact'} variant="ink" size="lg" settings={ctx.settings} i18n={ctx.i18n}>
                  {data.primary_label || 'Get started'}
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
          {variant !== 'compact' && data.media ? (
            <Media src={data.media} alt="" ratio={variant === 'display' ? '4 / 5' : '4 / 3'} className="hero__media" priority />
          ) : null}
        </div>
      </Section>
    )
  },
})

registerBlock({
  type: 'pageHeader',
  label: 'Page header',
  group: 'layout',
  hint: 'The title block at the top of an inner page.',
  initial: () => ({ eyebrow: '', title: 'Page title', body: '' }),
  fields: [
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', span: 1 },
    { key: 'title', label: 'Title', type: 'text', span: 1, required: true },
    { key: 'body', label: 'Intro', type: 'textarea', span: 2 },
  ],
  render: ({ data }) => (
    <Section size="sm" className="blk-pagehead">
      {data.eyebrow ? <p className="label">{data.eyebrow}</p> : null}
      <h1 className="h1">{data.title}</h1>
      {data.body ? <p className="lede">{data.body}</p> : null}
    </Section>
  ),
})


registerBlock({
  type: 'divider',
  label: 'Divider',
  group: 'layout',
  hint: 'Breathing room between two sections.',
  initial: () => ({ label: '' }),
  fields: [{ key: 'label', label: 'Label (optional)', type: 'text', span: 2 }],
  render: ({ data }) =>
    data.label ? (
      <Section size="sm">
        <p className="rule-label">{data.label}</p>
      </Section>
    ) : (
      <div className="spacer" />
    ),
})

/* -------------------------------- content -------------------------------- */

registerBlock({
  type: 'stats',
  label: 'Key numbers',
  group: 'content',
  hint: 'Four numbers in a bordered row.',
  initial: () => ({ label: '', items: [{ value: '', label: '' }] }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 2 },
    {
      key: 'items',
      label: 'Numbers',
      type: 'repeater',
      span: 2,
      itemLabel: 'value',
      fields: [
        { key: 'value', label: 'Value', type: 'text', span: 1, placeholder: '1,800+' },
        { key: 'label', label: 'Caption', type: 'text', span: 1 },
      ],
    },
  ],
  render: ({ data }) => {
    const items = asArray<any>(data.items).filter((i) => i?.value)
    if (!items.length) return null
    return (
      <Section size="sm" className="blk-stats">
        {data.label ? <p className="label">{data.label}</p> : null}
        <div className="stats">
          {items.map((item, index) => (
            <div className="stat" key={index}>
              <span className="stat__value">{item.value}</span>
              <span className="stat__label">{item.label}</span>
            </div>
          ))}
        </div>
      </Section>
    )
  },
})

registerBlock({
  type: 'cardGrid',
  label: 'Card grid',
  group: 'content',
  hint: 'Generic cards — services, features, anything.',
  initial: () => ({ label: '', title: '', body: '', columns: '3', items: [{ title: '', body: '', tag: '', href: '' }] }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 1 },
    { key: 'columns', label: 'Columns', type: 'select', span: 1, options: ['2', '3', '4'] },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    { key: 'body', label: 'Intro', type: 'textarea', span: 2 },
    {
      key: 'items',
      label: 'Cards',
      type: 'repeater',
      span: 2,
      itemLabel: 'title',
      fields: [
        { key: 'tag', label: 'Tag', type: 'text', span: 1, placeholder: '01' },
        { key: 'title', label: 'Title', type: 'text', span: 1 },
        { key: 'body', label: 'Body', type: 'textarea', span: 2 },
        { key: 'href', label: 'Link (optional)', type: 'text', span: 2 },
      ],
    },
  ],
  render: ({ data, ctx }) => {
    const items = asArray<any>(data.items).filter((i) => i?.title)
    if (!items.length) return null
    return (
      <Section className="blk-cards">
        <SectionHead label={data.label} title={data.title} body={data.body} />
        <div className={`grid g-${data.columns || 3}`}>
          {items.map((item, index) => {
            const inner = (
              <>
                {item.tag ? <span className="cell__tag">{item.tag}</span> : null}
                <h3 className="cell__title">{item.title}</h3>
                {item.body ? <p className="cell__body">{item.body}</p> : null}
                {item.href ? (
                  <span className="card__go">
                    Read more <Arrow />
                  </span>
                ) : null}
              </>
            )
            return item.href ? (
              <Link className="cell cell--link" href={ctx.i18n.href(item.href)} key={index}>
                {inner}
              </Link>
            ) : (
              <div className="cell" key={index}>
                {inner}
              </div>
            )
          })}
        </div>
      </Section>
    )
  },
})

registerBlock({
  type: 'imageText',
  label: 'Image + text',
  group: 'content',
  hint: 'A picture beside a block of copy.',
  initial: () => ({ label: '', title: '', body: '', bullets: [], media: '', image_side: 'right', cta_label: '', cta_href: '' }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 1 },
    { key: 'image_side', label: 'Image side', type: 'select', span: 1, options: ['right', 'left'] },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    { key: 'body', label: 'Body', type: 'richtext', span: 2 },
    { key: 'bullets', label: 'Bullet points', type: 'list', span: 2, help: 'One per line.' },
    { key: 'media', label: 'Image', type: 'image', span: 2 },
    { key: 'cta_label', label: 'Link label', type: 'text', span: 1 },
    { key: 'cta_href', label: 'Link', type: 'text', span: 1 },
  ],
  render: ({ data, ctx }) => (
    <Section className={`blk-imgtext blk-imgtext--${data.image_side || 'right'}`}>
      <div className="split">
        <div className="split__text">
          {data.label ? <p className="label">{data.label}</p> : null}
          {data.title ? <h2 className="h2">{data.title}</h2> : null}
          {data.body ? <div className="prose" dangerouslySetInnerHTML={{ __html: markdown(data.body) }} /> : null}
          {asList(data.bullets).length ? (
            <ul className="tick-list">
              {asList(data.bullets).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {data.cta_label ? (
            <Btn href={data.cta_href || '/contact'} variant="ghost" settings={ctx.settings} i18n={ctx.i18n}>
              {data.cta_label}
            </Btn>
          ) : null}
        </div>
        {data.media ? <Media src={data.media} alt="" ratio="4 / 5" className="split__media" /> : null}
      </div>
    </Section>
  ),
})

registerBlock({
  type: 'steps',
  label: 'Process steps',
  group: 'content',
  hint: 'A numbered walkthrough.',
  initial: () => ({ label: '', title: '', items: [{ title: '', body: '' }] }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 2 },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    {
      key: 'items',
      label: 'Steps',
      type: 'repeater',
      span: 2,
      itemLabel: 'title',
      fields: [
        { key: 'title', label: 'Step', type: 'text', span: 2 },
        { key: 'body', label: 'Detail', type: 'textarea', span: 2 },
      ],
    },
  ],
  render: ({ data }) => {
    const items = asArray<any>(data.items).filter((i) => i?.title)
    if (!items.length) return null
    return (
      <Section className="blk-steps">
        <SectionHead label={data.label} title={data.title} />
        <ol className="steps">
          {items.map((item, index) => (
            <li className="step" key={index}>
              <span className="step__num">{String(index + 1).padStart(2, '0')}</span>
              <div className="step__body">
                <h3 className="step__title">{item.title}</h3>
                {item.body ? <p>{item.body}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </Section>
    )
  },
})

registerBlock({
  type: 'faq',
  label: 'FAQ',
  group: 'content',
  hint: 'Collapsible questions.',
  initial: () => ({ label: '', title: '', items: [{ question: '', answer: '' }] }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 2 },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    {
      key: 'items',
      label: 'Questions',
      type: 'repeater',
      span: 2,
      itemLabel: 'question',
      fields: [
        { key: 'question', label: 'Question', type: 'text', span: 2 },
        { key: 'answer', label: 'Answer', type: 'richtext', span: 2 },
      ],
    },
  ],
  render: ({ data }) => {
    const items = asArray<any>(data.items).filter((i) => i?.question)
    if (!items.length) return null
    return (
      <Section className="blk-faq">
        <SectionHead label={data.label} title={data.title} />
        <div className="faq">
          {items.map((item, index) => (
            <details className="faq__item" key={index}>
              <summary>
                <span>{item.question}</span>
                <span className="faq__sign" aria-hidden="true" />
              </summary>
              <div className="faq__answer prose" dangerouslySetInnerHTML={{ __html: markdown(item.answer) }} />
            </details>
          ))}
        </div>
      </Section>
    )
  },
})

registerBlock({
  type: 'gallery',
  label: 'Gallery',
  group: 'content',
  hint: 'A grid of images.',
  initial: () => ({ label: '', title: '', columns: '3', images: [{ url: '', alt: '', caption: '' }] }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 1 },
    { key: 'columns', label: 'Columns', type: 'select', span: 1, options: ['2', '3', '4'] },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    {
      key: 'images',
      label: 'Images',
      type: 'repeater',
      span: 2,
      itemLabel: 'caption',
      fields: [
        { key: 'url', label: 'Image', type: 'image', span: 2 },
        { key: 'caption', label: 'Caption', type: 'text', span: 2 },
      ],
    },
  ],
  render: ({ data }) => {
    const images = asArray<any>(data.images).filter((i) => i?.url)
    if (!images.length) return null
    return (
      <Section className="blk-gallery">
        <SectionHead label={data.label} title={data.title} />
        <div className={`grid g-${data.columns || 3} gallery`}>
          {images.map((image, index) => (
            <figure className="gallery__item" key={index}>
              <Media src={image.url} alt={image.caption || ''} ratio="4 / 3" />
              {image.caption ? <figcaption>{image.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </Section>
    )
  },
})

registerBlock({
  type: 'video',
  label: 'Video',
  group: 'content',
  hint: 'Embed a YouTube or Vimeo link.',
  initial: () => ({ label: '', title: '', url: '', caption: '' }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 2 },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    { key: 'url', label: 'Video URL', type: 'url', span: 2, placeholder: 'https://www.youtube.com/watch?v=…' },
    { key: 'caption', label: 'Caption', type: 'text', span: 2 },
  ],
  render: ({ data }) =>
    data.url ? (
      <Section className="blk-video">
        <SectionHead label={data.label} title={data.title} />
        <div className="video">
          <iframe
            src={videoEmbed(data.url)}
            title={data.title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        {data.caption ? <p className="video__caption">{data.caption}</p> : null}
      </Section>
    ) : null,
})

registerBlock({
  type: 'richtext',
  label: 'Text section',
  group: 'content',
  hint: 'A heading and a block of formatted copy.',
  initial: () => ({ label: '', title: '', body: '', width: 'narrow' }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 1 },
    { key: 'width', label: 'Width', type: 'select', span: 1, options: ['narrow', 'wide'] },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    { key: 'body', label: 'Body', type: 'richtext', span: 2 },
  ],
  render: ({ data }) =>
    data.body || data.title ? (
      <Section className={`blk-text blk-text--${data.width || 'narrow'}`}>
        <SectionHead label={data.label} title={data.title} />
        <div className="prose" dangerouslySetInnerHTML={{ __html: markdown(data.body) }} />
      </Section>
    ) : null,
})

registerBlock({
  type: 'html',
  label: 'Custom HTML',
  group: 'content',
  hint: 'For embeds and one-offs. Rendered as-is.',
  initial: () => ({ code: '' }),
  fields: [{ key: 'code', label: 'HTML', type: 'textarea', span: 2 }],
  render: ({ data }) =>
    data.code ? (
      <Section size="sm">
        <div dangerouslySetInnerHTML={{ __html: String(data.code) }} />
      </Section>
    ) : null,
})

/* -------------------------------- data ----------------------------------- */

const FILTER_LEVELS = ['Foundation', 'Diploma', "Bachelor's", "Master's", 'PhD']









/* ------------------------------- conversion ------------------------------ */

registerBlock({
  type: 'cta',
  label: 'Call to action',
  group: 'convert',
  hint: 'A closing statement with buttons.',
  initial: () => ({
    headline: '',
    body: '',
    primary_label: 'Get in touch',
    primary_href: '/contact',
    secondary_label: '',
    secondary_href: '',
    variant: 'ink',
  }),
  fields: [
    { key: 'variant', label: 'Style', type: 'select', span: 2, options: ['ink', 'line'] },
    { key: 'headline', label: 'Headline', type: 'text', span: 2, required: true },
    { key: 'body', label: 'Body', type: 'textarea', span: 2 },
    ...LINK_FIELDS,
  ],
  render: ({ data, ctx }) => (
    <Section className={`blk-cta blk-cta--${data.variant || 'ink'}`}>
      <div className="cta">
        <h2 className="cta__headline">{data.headline}</h2>
        {data.body ? <p className="cta__body">{data.body}</p> : null}
        <div className="cta__actions">
          <Btn href={data.primary_href || '/contact'} variant={data.variant === 'ink' ? 'paper' : 'ink'} size="lg" settings={ctx.settings} i18n={ctx.i18n}>
            {data.primary_label || 'Get in touch'}
          </Btn>
          {data.secondary_label ? (
            <Btn href={data.secondary_href} variant={data.variant === 'ink' ? 'paper-ghost' : 'ghost'} size="lg" settings={ctx.settings} i18n={ctx.i18n}>
              {data.secondary_label}
            </Btn>
          ) : null}
        </div>
      </div>
    </Section>
  ),
})





registerBlock({
  type: 'why',
  label: 'Why choose us',
  group: 'content',
  hint: 'Left: the argument. Right: a grid of animated reasons.',
  initial: () => ({
    label: 'Why us',
    title: 'Why students pick us',
    body: 'Most agencies sell you a university. We sell you a decision you can defend — and we tell you when the answer is not to go.',
    items: [
      { title: 'We say no when we should', body: 'If a destination does not fit your budget or your grades, we tell you before you spend anything.' },
      { title: 'The price is the price', body: 'Written quotes, no add-ons discovered halfway through, no commission hidden in the tuition.' },
      { title: 'One advisor, start to finish', body: 'The person who assesses you files your applications and builds your visa file. No handovers.' },
      { title: 'We publish our refusals', body: 'Everything we will not do is written down. It is the fastest way to judge an agency.' },
    ],
  }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 2 },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    { key: 'body', label: 'Intro', type: 'textarea', span: 2 },
    {
      key: 'items',
      label: 'Reasons',
      type: 'repeater',
      span: 2,
      itemLabel: 'title',
      fields: [
        { key: 'title', label: 'Heading', type: 'text', span: 2 },
        { key: 'body', label: 'Explanation', type: 'textarea', span: 2 },
      ],
    },
  ],
  render: ({ data }) => {
    const items = asArray<any>(data.items).filter((item) => item?.title)
    if (!items.length) return null
    return (
      <Section className="blk-why">
        <div className="why">
          <div className="why__intro">
            {data.label ? <p className="label">{data.label}</p> : null}
            {data.title ? <h2 className="h2">{data.title}</h2> : null}
            {data.body ? <p className="why__body">{data.body}</p> : null}
          </div>
          <div className="why__grid">
            {items.map((item, index) => (
              <div className="why__card" key={index} style={{ animationDelay: `${index * 90}ms` }}>
                <span className="why__icon" aria-hidden="true">
                  <Icon name={WHY_ICONS[index % WHY_ICONS.length]} size={18} />
                </span>
                <h3 className="why__card-title">{item.title}</h3>
                {item.body ? <p className="why__card-body">{item.body}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </Section>
    )
  },
})

registerBlock({
  type: 'values',
  label: "What we don't do",
  group: 'content',
  hint: 'A row of plain refusals. Builds trust faster than another list of promises.',
  initial: () => ({
    label: 'Boundaries',
    title: "What we don't do",
    body: '',
    items: [
      { title: 'No guaranteed admission', body: 'Nobody can promise an offer. Anyone who does is lying to you.' },
      { title: 'No buying your way in', body: 'We do not forge documents, fake finances or pay anyone off.' },
      { title: 'No silence after payment', body: 'You get a named advisor and a reply within one working day.' },
      { title: 'No undisclosed commission', body: 'If a university pays us, it is written on your shortlist.' },
    ],
  }),
  fields: [
    { key: 'label', label: 'Label', type: 'text', span: 2 },
    { key: 'title', label: 'Heading', type: 'text', span: 2 },
    { key: 'body', label: 'Intro', type: 'textarea', span: 2 },
    {
      key: 'items',
      label: 'Refusals',
      type: 'repeater',
      span: 2,
      itemLabel: 'title',
      fields: [
        { key: 'title', label: 'Heading', type: 'text', span: 2 },
        { key: 'body', label: 'Explanation', type: 'textarea', span: 2 },
      ],
    },
  ],
  render: ({ data }) => {
    const items = asArray<any>(data.items).filter((item) => item?.title)
    if (!items.length) return null
    const doubled = [...items, ...items]
    return (
      <Section className="blk-values">
        <SectionHead label={data.label} title={data.title} body={data.body} />
        <div className="marquee marquee--values">
          <div className="marquee__track">
            {doubled.map((item, index) => (
              <div className="value" key={index}>
                <span className="value__mark" aria-hidden="true">
                  ✕
                </span>
                <h3 className="value__title">{item.title}</h3>
                {item.body ? <p className="value__body">{item.body}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </Section>
    )
  },
})




/* ------------------------------ import side ------------------------------ */
// Importing this module registers every block above. Consumers should import
// from '@/lib/kernel/blocks' so the registry is populated before rendering.

export { Chip, money, plain, formatDate }
export type { RenderCtx }

/* The five modules, shown rather than described. The images are screenshots of
   the running workbench, so the panel also documents what the product looks
   like. Step copy lives in the component, in both languages, because it is
   fixed product copy rather than per-site content. */
registerBlock({
  type: 'showcase',
  label: 'Module walkthrough',
  group: 'layout',
  hint: 'Left: screenshots of the running workbench. Right: what each module does.',
  initial: () => ({
    eyebrow: 'How it works',
    headline: 'Five modules, taken as you need them',
    body: 'Import, code, analyse, plot, export. Each one stands on its own — nothing forces you through a step you do not want.',
  }),
  fields: [
    { key: 'eyebrow', label: 'Eyebrow', type: 'text', span: 1, placeholder: 'How it works' },
    { key: 'headline', label: 'Headline', type: 'text', span: 1 },
    { key: 'body', label: 'Intro paragraph', type: 'textarea', span: 2 },
  ],
  render: ({ data, ctx }) => (
    <ModuleShowcase
      eyebrow={data.eyebrow}
      headline={data.headline}
      body={data.body}
      locale={ctx.i18n.locale}
    />
  ),
})
