import type { NextConfig } from 'next'

/**
 * Where the workbench is running. Both processes stay on this machine, which is
 * the point: the site is the shopfront, the workbench is where the transcripts
 * live, and neither of them talks to a server we do not own.
 */
const WORKBENCH = process.env.QT_WORKBENCH_URL || 'http://127.0.0.1:8765'

/** The prefix the workbench is mounted at, so it does not collide with /api. */
const MOUNT = '/w'

const nextConfig: NextConfig = {
  // The kernel talks to Postgres directly; keep the drivers out of the bundler.
  serverExternalPackages: ['@electric-sql/pglite', 'pg'],
  experimental: { serverActions: { bodySizeLimit: '8mb' } },

  async rewrites() {
    // beforeFiles, so these win over the site's own /api routes.
    return {
      beforeFiles: [
        { source: MOUNT, destination: `${WORKBENCH}${MOUNT}` },
        { source: `${MOUNT}/`, destination: `${WORKBENCH}${MOUNT}/` },
        { source: `${MOUNT}/:path*`, destination: `${WORKBENCH}${MOUNT}/:path*` },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
}

export default nextConfig
