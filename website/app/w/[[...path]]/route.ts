/**
 * Runtime proxy for the workbench.
 * ---------------------------------------------------------------------------
 * The marketing site owns `/w` and forwards it to the workbench service, so a
 * visitor reaches the real tool from the site rather than a second address.
 *
 * This is a route handler rather than a `rewrites()` entry on purpose: rewrite
 * destinations are resolved when `next build` runs, so a hosted deployment
 * would bake in whatever workbench URL happened to exist at build time and
 * break whenever that host changed. A handler reads the environment per
 * request, so the deployment can be pointed anywhere without a rebuild.
 *
 * Origin is deliberately not forwarded: the workbench rejects cross-site
 * requests, and the absence of an Origin header is what it accepts. The
 * Sec-Fetch-* headers are dropped for the same reason.
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function workbenchBase(): string {
  const raw = (process.env.QT_WORKBENCH_URL || 'http://127.0.0.1:8765').trim().replace(/\/+$/, '')
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
}

/** Headers that describe the browser-to-site hop, not the request itself. */
const HOP_BY_HOP = new Set([
  'host', 'connection', 'keep-alive', 'transfer-encoding', 'upgrade',
  'origin', 'referer', 'cookie',
  'sec-fetch-site', 'sec-fetch-mode', 'sec-fetch-dest', 'sec-fetch-user',
  'accept-encoding', 'content-length',
])

/**
 * A hosted platform may hand over the workbench's private-network hostname,
 * and those do not always answer on the scheme you guessed. Trying the other
 * one costs nothing and turns a hard 502 into a working page.
 */
async function fetchUpstream(
  target: string,
  method: string,
  headers: Headers,
  body?: ArrayBuffer,
): Promise<Response> {
  const send = (url: string) =>
    fetch(url, { method, headers, body, redirect: 'manual', cache: 'no-store' })

  try {
    return await send(target)
  } catch (error) {
    const alternate = target.replace(/^https:/i, 'http:')
    if (alternate === target) throw error
    return await send(alternate)
  }
}

async function proxy(request: Request, segments: string[] | undefined): Promise<Response> {
  const incoming = new URL(request.url)
  const suffix = segments?.length ? `/${segments.join('/')}` : ''
  const target = `${workbenchBase()}/w${suffix}${incoming.search}`

  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value)
  })

  const hasBody = !['GET', 'HEAD'].includes(request.method)
  const body = hasBody ? await request.arrayBuffer() : undefined

  let upstream: Response
  try {
    upstream = await fetchUpstream(target, request.method, headers, body)
  } catch (error) {
    return new Response(
      `The workbench is not reachable at ${workbenchBase()}. ` +
        `Set QT_WORKBENCH_URL to its address.\n\n${(error as Error).message}`,
      { status: 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    )
  }

  const out = new Headers()
  for (const [key, value] of upstream.headers) {
    // The workbench sets its own security headers; keep them, but drop the
    // length so the platform recomputes it for this response.
    if (key.toLowerCase() === 'content-length') continue
    out.set(key, value)
  }
  return new Response(upstream.body, { status: upstream.status, headers: out })
}

type Context = { params: Promise<{ path?: string[] }> }

async function handle(request: Request, context: Context): Promise<Response> {
  const { path } = await context.params
  return proxy(request, path)
}

export const GET = handle
export const POST = handle
export const PUT = handle
export const PATCH = handle
export const DELETE = handle
export const HEAD = handle
