import type { NextConfig } from 'next'

/**
 * The workbench that owns `/w` is proxied by a route handler
 * (app/w/[[...path]]/route.ts), not by `rewrites()` here.
 *
 * A rewrite destination is resolved when `next build` runs, so a hosted
 * deployment would freeze whatever workbench URL existed at build time — and
 * the site would keep pointing at it after the service moved. The handler
 * reads QT_WORKBENCH_URL per request instead, which also means pointing the
 * site at a different workbench needs no rebuild.
 */
const nextConfig: NextConfig = {
  // No server actions and no database drivers: the public pages render from
  // committed files, and the workbench is a separate process behind /w.
}

export default nextConfig
