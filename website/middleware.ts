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
const BYPASS = ['/api', '/admin', '/_next', '/uploads', '/w', '/world-map.json', '/icon.svg', '/favicon.ico']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // This CMS ships with a documented first-run admin account for local setup.
  // A teaching deployment must never expose that login or its write APIs.
  // Start the public build with QUALICRAFT_PUBLIC_SITE=1 to make the boundary
  // server-enforced (not merely hidden in the interface).
  if (process.env.QUALICRAFT_PUBLIC_SITE === '1'
      && (pathname === '/admin' || pathname.startsWith('/admin/')
        || pathname === '/api/admin' || pathname.startsWith('/api/admin/'))) {
    return new NextResponse('Not found', { status: 404 })
  }

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

  // Already prefixed: let Next route it normally, only the headers are ours.
  if (hasLocale) {
    return NextResponse.next({ request: { headers } })
  }

  // Unprefixed: serve the default locale without changing the visible URL.
  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`

  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = {
  // Include /admin and /api/admin so the public-demo guard above actually
  // runs there; normal APIs still fall through the BYPASS list unchanged.
  matcher: ['/((?!_next|uploads|w/|w$|.*\\..*).*)'],
}
