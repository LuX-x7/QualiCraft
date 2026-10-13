import { NextResponse, type NextRequest } from 'next/server'

/**
 * English is the default locale and stays at the root: `/method` is
 * internally rewritten to `/en/method`, so the canonical URLs the owner
 * shares stay short. Chinese keeps its prefix — `/zh/method` is passed
 * through untouched so `app/[locale]` resolves it.
 */
const LOCALES = ['en', 'zh']
const RTL = new Set<string>([])

/**
 * `/w` is the workbench, proxied to a separate local process by next.config.
 * It must not be locale-rewritten, or `/w` becomes `/en/w` and 404s.
 */
const BYPASS = ['/api', '/_next', '/uploads', '/w', '/icon.svg', '/favicon.ico']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (BYPASS.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.next()
  }

  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]
  const hasLocale = Boolean(first && LOCALES.includes(first))
  const locale = hasLocale ? first : 'en'

  // A locale-prefixed workbench link (`/zh/w`) has no route — the workbench is
  // proxied at the bare `/w`. Send it there with the language as a query.
  if (segments.length === 2 && segments[1] === 'w' && hasLocale) {
    const target = request.nextUrl.clone()
    target.pathname = '/w'
    target.search = `?lang=${locale}`
    return NextResponse.redirect(target)
  }

  const headers = new Headers(request.headers)
  headers.set('x-isc-locale', locale)
  headers.set('x-isc-dir', RTL.has(locale) ? 'rtl' : 'ltr')

  // Already prefixed with the default locale: let Next route it normally,
  // only the headers are ours.
  if (hasLocale && locale === 'en') {
    return NextResponse.next({ request: { headers } })
  }

  // A prefixed path in the other locale serves the same document as its /en
  // twin: the public site renders one English copy, so /zh/report is rewritten
  // rather than left to render English under a Chinese lang attribute. The
  // workbench has its own language switch and is excluded above.
  if (hasLocale) {
    const url = request.nextUrl.clone()
    url.pathname = '/' + pathname.split('/').filter(Boolean).slice(1).join('/')
    url.pathname = url.pathname === '/' ? '/en' : '/en' + url.pathname
    return NextResponse.rewrite(url, { request: { headers } })
  }

  // Unprefixed: serve the default locale without changing the visible URL.
  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`

  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = {
  matcher: ['/((?!_next|uploads|w/|w$|.*\\..*).*)'],
}
