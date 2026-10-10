/**
 * Kernel · content served from the repository instead of the database
 * ---------------------------------------------------------------------------
 * A public deployment shows copy that is already committed in `qt-seed.ts`, so
 * it has no reason to boot a database. It also cannot afford to: loading the
 * embedded Postgres costs about 700 MB resident, and a small instance is killed
 * for exceeding its limit the first time a page is rendered.
 *
 * So when the site runs in public mode without a DATABASE_URL, the read side of
 * the kernel answers from the seed data instead. Only reads are served here;
 * public mode 404s the admin and every write route, so nothing needs a table.
 *
 * Ids are derived from the slug rather than generated, so repeated builds emit
 * identical markup — which matters for caching and for diffing the output.
 */

import { QT_ENTRIES, QT_PAGES, QT_SETTINGS } from './qt-seed'
import type { Block, Entry, EntryQuery, SiteSettings } from './types'
import type { Page } from './content'

/**
 * True when this deployment should serve committed content rather than query a
 * database. Deliberately not merely "public": a deployment that supplies
 * DATABASE_URL has a real database and should use it.
 */
export function staticContent(): boolean {
  return process.env.QUALICRAFT_PUBLIC_SITE === '1' && !process.env.DATABASE_URL?.trim()
}

/** A stable, readable id derived from the thing it identifies. */
function stableId(prefix: string, value: string): string {
  return `${prefix}-${value.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
}

const PAGES: Page[] = QT_PAGES.map((page, index) => ({
  id: index + 1,
  slug: page.slug,
  title: page.title,
  seo_title: page.seo_title,
  seo_description: page.seo_description,
  status: 'published',
  show_in_nav: page.show_in_nav,
  nav_label: page.nav_label || page.title,
  nav_order: page.nav_order,
}))

const BLOCKS: Block[] = QT_PAGES.flatMap((page, index) =>
  page.blocks.map((block, position) => ({
    id: stableId('blk', `${page.slug}-${position}`),
    page_id: index + 1,
    type: block.type,
    position,
    enabled: true,
    data: block.data || {},
  })),
) as Block[]

const ENTRIES: Entry[] = Object.entries(QT_ENTRIES).flatMap(([collection, items]) =>
  items.map((item, position) => ({
    id: stableId('ent', `${collection}-${item.slug || position}`),
    collection,
    slug: item.slug,
    title: item.title,
    status: 'published',
    position,
    data: item.data || {},
    created_at: '',
    updated_at: '',
  })),
) as Entry[]

export async function staticGetPage(slug: string): Promise<Page | null> {
  return PAGES.find((page) => page.slug === slug) || null
}

export async function staticListPages(): Promise<Page[]> {
  return [...PAGES].sort((a, b) => a.nav_order - b.nav_order || a.id - b.id)
}

export async function staticNavPages(): Promise<Page[]> {
  return PAGES.filter((page) => page.show_in_nav && page.status === 'published')
    .sort((a, b) => a.nav_order - b.nav_order || a.id - b.id)
}

export async function staticListBlocks(pageId: number, opts: { includeDisabled?: boolean } = {}): Promise<Block[]> {
  return BLOCKS.filter((block) => block.page_id === pageId)
    .filter((block) => (opts.includeDisabled === false ? block.enabled : true))
    .sort((a, b) => a.position - b.position)
}

export async function staticListEntries(collection: string, opts: EntryQuery = {}): Promise<Entry[]> {
  let rows = ENTRIES.filter((entry) => entry.collection === collection)

  if (opts.status) rows = rows.filter((entry) => entry.status === opts.status)
  if (opts.featured) rows = rows.filter((entry) => Boolean(entry.data?.featured))

  for (const [key, value] of Object.entries(opts.where || {})) {
    if (value === undefined || value === null || value === '') continue
    rows = rows.filter((entry) => {
      const actual = entry.data?.[key]
      return Array.isArray(value) ? value.includes(actual) : String(actual) === String(value)
    })
  }

  const limit = Math.min(Math.max(Number(opts.limit ?? 50), 1), 200)
  return rows.sort((a, b) => a.position - b.position).slice(0, limit)
}

export async function staticGetSettings(): Promise<SiteSettings> {
  return QT_SETTINGS as SiteSettings
}
