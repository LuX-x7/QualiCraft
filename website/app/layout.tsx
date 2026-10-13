import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { SEO } from '@/lib/site/content'
import './t7.css'

/**
 * The document shell. Metadata is static and comes from the site module —
 * no settings are read at request time, so a page never waits on a database
 * to learn its own title. metadataBase is set only when a site URL is
 * configured; without one, Open Graph URLs stay relative rather than
 * inventing a domain.
 */
export const metadata: Metadata = {
  title: { default: SEO.title, template: `%s · ${SEO.siteName}` },
  description: SEO.description,
  ...(process.env.SITE_URL ? { metadataBase: new URL(process.env.SITE_URL) } : {}),
  openGraph: {
    title: SEO.title,
    description: SEO.description,
    type: 'website',
    siteName: SEO.siteName,
  },
  twitter: { card: 'summary_large_image', title: SEO.title, description: SEO.description },
  icons: { icon: '/icon.svg' },
}

/**
 * The middleware resolves the locale and passes it down as a request header, so
 * the document element can carry the right `lang` and `dir` from the first
 * paint. The public site renders the English copy, so the value is `en` in
 * practice; the header is still honoured rather than hard-coded, because the
 * workbench proxy shares this document shell.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const head = await headers()
  const locale = head.get('x-isc-locale') || 'en'
  const dir = head.get('x-isc-dir') || 'ltr'

  return (
    <html lang={locale} dir={dir}>
      <head>
        {/* The site's two families are self-hosted and subset — see
            public/fonts and tools/site/prepare_fonts.py. No request to a font
            CDN is made at runtime, so a page never depends on a third party
            to render its own type. */}
      </head>
      <body>{children}</body>
    </html>
  )
}
