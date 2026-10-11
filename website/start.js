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

// Probe it once, without blocking startup: a free instance may be asleep, so a
// slow first answer is expected rather than a fault.
const started = Date.now()
fetch(`${base}/api/health`)
  .then((response) => console.log(
    `  health        ${response.status} in ${Date.now() - started}ms${response.ok ? '' : '  <- check QT_WORKBENCH_URL'}`))
  .catch((error) => console.log(
    `  health        unreachable after ${Date.now() - started}ms: ${error.message}`))

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
