/**
 * Health probe for the hosting platform.
 * ---------------------------------------------------------------------------
 * Render (and every other platform worth deploying to) decides whether an
 * instance is serving by polling a path. Left at the default `/`, that probe
 * renders the home page, which boots the embedded database — slow work on a
 * small instance, and if it does not finish inside the probe's timeout the
 * platform concludes nothing is listening and restarts the process. The app
 * then logs "Ready" over and over and the URL serves nothing.
 *
 * So the probe answers from nowhere: no database, no rendering, no imports
 * beyond this file. If this responds, the process is alive.
 *
 * It sits under /api because the middleware leaves that prefix alone; any other
 * path would be locale-rewritten to /en/<path> and miss this route.
 */

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  return new Response(JSON.stringify({ ok: true, service: 'qualicraft-website' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
