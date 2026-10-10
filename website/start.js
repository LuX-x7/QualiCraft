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
