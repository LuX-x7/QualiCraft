/**
 * Kernel · QT collections
 * ---------------------------------------------------------------------------
 * The structured content behind the QT site. Same pattern as the ISC kernel:
 * each registration produces an admin list, an admin form, and a data source
 * that blocks query — records live in the shared `entries` table, so adding one
 * is a registration rather than a migration.
 */

import { registerCollection } from './types'

/* ------------------------------- capabilities ---------------------------- */

/**
 * The capability blocks a researcher switches on. The landing page reads this
 * collection, and so does the documentation page — one record, three places.
 */
registerCollection({
  name: 'capabilities',
  label: 'Capability blocks',
  singular: 'Capability',
  hint: 'The optional blocks a study can switch on, shown on the home page and in the docs.',
  titleKey: 'name',
  slugKey: 'name',
  columns: ['group', 'default_on', 'position'],
  initial: () => ({ default_on: false, group: 'analysis', position: 0 }),
  fields: [
    { key: 'name', label: 'Name', type: 'text', span: 2, required: true },
    {
      key: 'group',
      label: 'Group',
      type: 'select',
      span: 1,
      options: ['core', 'coding', 'analysis', 'output', 'heavy'],
      help: 'core is always on. heavy means it needs extra software installed.',
    },
    { key: 'summary', label: 'One-line summary', type: 'textarea', span: 2, help: 'Shown on the tile.' },
    { key: 'detail', label: 'Full description', type: 'richtext', span: 2 },
    { key: 'default_on', label: 'On by default', type: 'boolean', span: 1 },
    { key: 'position', label: 'Order', type: 'number', span: 1 },
    { key: 'icon', label: 'Icon name', type: 'text', span: 2, help: 'See components/Icon.tsx for the available names.' },
  ],
})

/* ---------------------------------- datasets ------------------------------ */

/**
 * The public corpora a visitor can try the tool on before importing their own
 * interviews. Keeping these as records means the landing page and the docs page
 * both read the same list.
 */
registerCollection({
  name: 'datasets',
  label: 'Datasets',
  singular: 'Dataset',
  hint: 'Public interview corpora bundled with the tool.',
  titleKey: 'name',
  slugKey: 'name',
  columns: ['interviews', 'topic', 'has_reference_codes', 'position'],
  initial: () => ({ has_reference_codes: false, position: 0 }),
  fields: [
    { key: 'name', label: 'Name', type: 'text', span: 2, required: true },
    { key: 'topic', label: 'Topic', type: 'text', span: 1 },
    { key: 'interviews', label: 'Number of interviews', type: 'number', span: 1 },
    { key: 'summary', label: 'One-line summary', type: 'textarea', span: 2 },
    { key: 'detail', label: 'Full description', type: 'richtext', span: 2 },
    {
      key: 'has_reference_codes',
      label: 'Ships with a reference codebook',
      type: 'boolean',
      span: 2,
      help: 'Useful for validating a coding scheme against a published one.',
    },
    { key: 'source', label: 'Source', type: 'url', span: 2 },
    { key: 'position', label: 'Order', type: 'number', span: 1 },
  ],
})

/* ---------------------------------- phases -------------------------------- */

/**
 * The six phases of a thematic analysis. The tool is organised around these, so
 * the landing page lists them from the same records the method page uses.
 */
registerCollection({
  name: 'phases',
  label: 'Analysis phases',
  singular: 'Phase',
  hint: 'The stages of the research workflow the tool is organised around.',
  titleKey: 'name',
  slugKey: 'name',
  columns: ['number', 'supported', 'position'],
  initial: () => ({ supported: 'full', position: 0 }),
  fields: [
    { key: 'number', label: 'Step number', type: 'number', span: 1, required: true },
    { key: 'name', label: 'Name', type: 'text', span: 1, required: true },
    { key: 'summary', label: 'What happens here', type: 'textarea', span: 2 },
    {
      key: 'supported',
      label: 'Tool support',
      type: 'select',
      span: 1,
      options: ['full', 'partial', 'none'],
      help: 'Shown as a marker on the phase card.',
    },
    { key: 'position', label: 'Order', type: 'number', span: 1 },
  ],
})

/* ---------------------------------- figures ------------------------------- */

/**
 * The figure types the plotting workbench can produce. Kept as records so the
 * roadmap can be edited without a deploy.
 */
registerCollection({
  name: 'figures',
  label: 'Figure types',
  singular: 'Figure',
  hint: 'The publication figures the plotting workbench can draw.',
  titleKey: 'name',
  slugKey: 'name',
  columns: ['status', 'position'],
  initial: () => ({ status: 'planned', position: 0 }),
  fields: [
    { key: 'name', label: 'Name', type: 'text', span: 2, required: true },
    { key: 'summary', label: 'What it shows', type: 'textarea', span: 2 },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      span: 1,
      options: ['shipped', 'planned'],
    },
    { key: 'position', label: 'Order', type: 'number', span: 1 },
  ],
})
