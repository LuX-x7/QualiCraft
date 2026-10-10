/**
 * Kernel · schema + first-run seed
 * ---------------------------------------------------------------------------
 * Nine tables. Everything the site shows is either a `page` (a stack of
 * `blocks`) or an `entry` (a record inside a named collection). Adding a new
 * content type therefore needs no migration — only a collection definition.
 */

import { driver, raw, type Row } from './db'
import { id } from './ids'
import { DICTIONARY } from './dictionary'
import { QT_ENTRIES, QT_PAGES, QT_SETTINGS } from './qt-seed'

const DDL = `
create table if not exists users (
  id            serial primary key,
  email         text unique not null,
  password_hash text not null,
  name          text not null default '',
  role          text not null default 'admin',
  created_at    timestamptz not null default now()
);

create table if not exists pages (
  id               serial primary key,
  slug             text unique not null,
  title            text not null default '',
  seo_title        text not null default '',
  seo_description  text not null default '',
  status           text not null default 'published',
  show_in_nav      boolean not null default false,
  nav_label        text not null default '',
  nav_order        integer not null default 0,
  updated_at       timestamptz not null default now()
);

create table if not exists blocks (
  id         text primary key,
  page_id    integer not null references pages(id) on delete cascade,
  type       text not null,
  position   integer not null default 0,
  enabled    boolean not null default true,
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists blocks_page_position_idx on blocks(page_id, position);

create table if not exists entries (
  id         text primary key,
  collection text not null,
  slug       text,
  title      text not null default '',
  status     text not null default 'published',
  position   integer not null default 0,
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists entries_collection_idx on entries(collection, position);
create unique index if not exists entries_collection_slug_idx on entries(collection, slug);

create table if not exists settings (
  key   text primary key,
  value jsonb not null default '{}'::jsonb
);

create table if not exists translations (
  locale     text not null,
  key        text not null,
  value      text not null default '',
  updated_at timestamptz not null default now(),
  primary key (locale, key)
);

create table if not exists media (
  id         text primary key,
  url        text not null,
  filename   text not null default '',
  alt        text not null default '',
  mime       text not null default '',
  size       integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id         text primary key,
  name       text not null default '',
  email      text not null default '',
  phone      text not null default '',
  whatsapp   text not null default '',
  country    text not null default '',
  level      text not null default '',
  message    text not null default '',
  source     text not null default '',
  status     text not null default 'new',
  notes      text not null default '',
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
-- Idempotent upgrade for installs created before the application form existed.
alter table leads add column if not exists data jsonb not null default '{}'::jsonb;

create table if not exists revisions (
  id         serial primary key,
  block_id   text not null,
  data       jsonb not null,
  actor      text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id         serial primary key,
  actor      text not null default '',
  action     text not null default '',
  target     text not null default '',
  created_at timestamptz not null default now()
);
`

export async function migrate(): Promise<void> {
  const d = await driver()
  await d.exec(DDL)
}

/* -------------------------------------------------------------------------- */
/* Seed                                                                        */
/* -------------------------------------------------------------------------- */

const S = 'https://images.unsplash.com'
const img = (photo: string, w = 1600) => `${S}/${photo}?auto=format&fit=crop&w=${w}&q=80`

/**
 * Everything that identifies the business is deliberately empty. The owner
 * fills it in from Admin → Site settings; the admin dashboard shows a checklist
 * of what is still blank.
 */

/* -------------------------------------------------------------------------- */

async function isEmpty(table: string): Promise<boolean> {
  const res = await raw(`select count(*)::int as n from ${table}`)
  return Number((res.rows[0] as Row)?.n ?? 0) === 0
}

export async function seed(): Promise<void> {
  if (await isEmpty('pages')) {
    for (const page of QT_PAGES) {
      const inserted = await raw(
        `insert into pages (slug, title, seo_title, seo_description, status, show_in_nav, nav_label, nav_order)
         values ($1,$2,$3,$4,'published',$5,$6,$7) returning id`,
        [
          page.slug,
          page.title,
          page.seo_title,
          page.seo_description,
          page.show_in_nav,
          page.nav_label || page.title,
          page.nav_order,
        ],
      )
      const pageId = Number((inserted.rows[0] as Row).id)
      let position = 0
      for (const block of page.blocks) {
        await raw(
          `insert into blocks (id, page_id, type, position, enabled, data) values ($1,$2,$3,$4,true,$5::jsonb)`,
          [id('blk'), pageId, block.type, position++, JSON.stringify(block.data)],
        )
      }
    }
  }

  if (await isEmpty('settings')) {
    for (const [key, value] of Object.entries(QT_SETTINGS)) {
      await raw(`insert into settings (key, value) values ($1,$2::jsonb)`, [key, JSON.stringify(value)])
    }
  }

  // Every collection stores its display name in `title`; the seeded source
  // arrays use their own natural key (name / title), so normalise here.
  const collections: Array<[string, Array<{ title: string; slug: string; data: Record<string, any> }>]> =
    Object.entries(QT_ENTRIES)

  for (const [collection, items] of collections) {
    const res = await raw(`select count(*)::int as n from entries where collection = $1`, [collection])
    if (Number((res.rows[0] as Row)?.n ?? 0) > 0) continue
    let position = 0
    for (const item of items) {
      await raw(
        `insert into entries (id, collection, slug, title, status, position, data)
         values ($1,$2,$3,$4,'published',$5,$6::jsonb)
         on conflict do nothing`,
        [id('ent'), collection, item.slug, item.title, position++, JSON.stringify(item.data)],
      )
    }
  }


  // Seed the built-in interface translations so the owner sees real text in
  // Admin → Languages rather than empty boxes, and can edit any of it.
  if (await isEmpty('translations')) {
    for (const locale of Object.keys(DICTIONARY) as Array<keyof typeof DICTIONARY>) {
      const table = DICTIONARY[locale]
      for (const key of Object.keys(table)) {
        const value = table[key]
        if (!value) continue
        await raw(
          `insert into translations (locale, key, value) values ($1,$2,$3) on conflict do nothing`,
          [locale, key, value],
        )
      }
    }
  }

  if (await isEmpty('users')) {
    const { hashPassword } = await import('./auth')
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@internationalstudycouncil.com'
    const password = process.env.SEED_ADMIN_PASSWORD || 'changeme123'
    await raw(`insert into users (email, password_hash, name, role) values ($1,$2,$3,'owner')`, [
      email.toLowerCase(),
      hashPassword(password),
      'Site owner',
    ])
  }
}
