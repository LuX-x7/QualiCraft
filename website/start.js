'use strict'

// Next's `-p` flag, rather than relying on its default, makes the site obey
// the single public port injected by the publisher while staying portable to
// Windows shells for local runs.
//
// `-H 0.0.0.0` is not cosmetic. Left to choose for itself, Next binds the IPv6
// wildcard `::` rather than the IPv4 one, and a platform that scans for a
// listener on 0.0.0.0 then reports "no open HTTP ports" and keeps restarting
// the process — the app logs "Ready" each time and still serves nothing. Bind
// the IPv4 wildcard explicitly so the platform's scan finds it.
const { spawn } = require('node:child_process')
const path = require('node:path')

const nextBin = require.resolve('next/dist/bin/next')
const port = String(process.env.PORT || 4321)
const host = process.env.HOST || '0.0.0.0'

/**
 * The workbench address this deployment will actually proxy to, resolved the
 * same way the route handler resolves it.
 *
 * The Blueprint used to carry a literal value and the dashboard carried
 * another, with the dashboard winning and nothing saying so — the site kept
 * proxying to a host that had been renamed. The value is now declared without
 * one (`sync: false`), which makes the dashboard the single source of truth.
 * Printing what was read closes the loop: a mismatch is visible at startup
 * instead of showing up as a 502 later.
 */
function workbenchBase() {
  const raw = (process.env.QT_WORKBENCH_URL || 'http://127.0.0.1:8765').trim().replace(/\/+$/, '')
  if (/^https?:\/\//i.test(raw)) return raw
  const authority = raw.split('/')[0]
  return `https://${authority.includes('.') ? authority : `${authority}.onrender.com`}`
}

const base = workbenchBase()
console.log(`QualiCraft site | listening on ${host}:${port}`)
console.log(`  workbench     ${base}${process.env.QT_WORKBENCH_URL ? '' : '  (default; QT_WORKBENCH_URL is not set)'}`)

// Diagnose the same mounted bootstrap used by the /w proxy. The workbench has
// no /api/health route. HTTP 200 alone could be another site's landing page, so
// require the bootstrap shape without logging tokens or project metadata.
// A waking backend gets a bounded retry window; Next starts independently.
async function probeWorkbench(base) {
  const target = `${base}/w/api/bootstrap`
  const started = Date.now()
  const attempts = 3, timeoutMs = 5000, retryMs = 1000
  for (let attempt = 1; attempt <= attempts; attempt++) {
    let failure
    try {
      const response = await fetch(target, {
        signal: AbortSignal.timeout(timeoutMs), cache: 'no-store', redirect: 'manual',
      })
      if (!response.ok) {
        failure = `HTTP ${response.status}`
        await response.body?.cancel()
      } else {
        const payload = await response.json()
        if (payload && typeof payload.token === 'string' && payload.token.length > 0 &&
            Array.isArray(payload.projects) && payload.config &&
            typeof payload.config === 'object' && !Array.isArray(payload.config)) {
          console.log(`  health        ready in ${Date.now() - started}ms (bootstrap ${target}; attempt ${attempt}/${attempts})`)
          return
        }
        failure = 'unexpected bootstrap response'
      }
    } catch (error) {
      failure = error.name === 'TimeoutError' || error.name === 'AbortError'
        ? `request timed out (${timeoutMs}ms)`
        : error.name === 'SyntaxError'
          ? 'invalid bootstrap JSON'
          : `unreachable (${error.cause?.code || error.message})`
    }
    if (attempt < attempts) {
      console.log(`  health        waiting (${attempt}/${attempts}): ${failure}; retrying in ${retryMs}ms`)
      await new Promise(resolve => setTimeout(resolve, retryMs))
    } else {
      console.warn(`  health        failed after ${attempts} attempts in ${Date.now() - started}ms: ${failure}; check QT_WORKBENCH_URL and backend readiness (${target})`)
    }
  }
}
void probeWorkbench(base)

const child = spawn(process.execPath, [nextBin, 'start', '-p', port, '-H', host], {
  cwd: __dirname,
  env: process.env,
  stdio: 'inherit',
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exit(code ?? 1)
})
child.on('error', (error) => {
  console.error('Could not start the website:', error.message)
  process.exit(1)
})
