import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { setImmediate } from 'node:timers/promises'

const source = readFileSync(new URL('../website/start.js', import.meta.url), 'utf8')
const bootstrap = { token: 'test-token-never-log', projects: [{ name: 'test-project-never-log' }], config: { public_demo: false } }

// Execute the real startup entry with only network/process/timer boundaries
// replaced. No existing browser, server, data or external host is accessed.
function start(replies, value = 'http://127.0.0.1:8863') {
  const calls = [], logs = [], waits = [], timeouts = [], spawned = [], cancelled = []
  let pending
  const require = (name) => {
    assert.equal(name === 'node:child_process' || name === 'node:path', true)
    return name === 'node:path' ? {} : { spawn: (...args) => {
      spawned.push(args)
      return { on() {}, kill() {} }
    } }
  }
  require.resolve = () => '/test/next'
  const context = {
    require, __dirname: '/test/website',
    process: { env: { QT_WORKBENCH_URL: value }, execPath: '/test/node', on() {} },
    console: { log: (...args) => logs.push(args.join(' ')), warn: (...args) => logs.push(args.join(' ')), error: (...args) => logs.push(args.join(' ')) },
    Date, AbortSignal: { timeout: ms => { timeouts.push(ms); return 'test-signal' } },
    setTimeout: (fn, ms) => { waits.push(ms); queueMicrotask(fn) },
    fetch: async (url, options) => {
      calls.push({ url, options })
      const reply = replies[Math.min(calls.length - 1, replies.length - 1)]
      if (reply.error) throw reply.error
      if (reply.pending) return new Promise(resolve => { pending = resolve })
      return response(reply)
    },
  }
  function response(reply) {
    const status = reply.status ?? 200
    return { status, ok: status >= 200 && status < 300,
      body: { async cancel() { cancelled.push(status) } },
      async json() { if (reply.jsonError) throw reply.jsonError; return reply.payload ?? bootstrap },
    }
  }
  vm.runInNewContext(source, context)
  return { calls, logs, waits, timeouts, spawned, cancelled,
    finish: async () => { for (let i = 0; i < 8; i++) await setImmediate() },
    resolve: reply => pending(response(reply)),
  }
}

test('startup probes the mounted bootstrap used by the proxy, never a fictitious health route', async () => {
  const run = start([{}], 'http://127.0.0.1:8863///'); await run.finish()
  assert.equal(run.calls.length, 1)
  assert.equal(run.calls[0].url, 'http://127.0.0.1:8863/w/api/bootstrap')
  assert.equal(run.calls[0].options.cache, 'no-store')
  assert.equal(run.calls[0].options.redirect, 'manual')
  assert.match(run.logs.join('\n'), /health\s+ready/)
  assert.deepEqual(run.timeouts, [5000])
})

test('real bootstrap success is logged without its token or project metadata', async () => {
  const run = start([{}]); await run.finish()
  assert.match(run.logs.join('\n'), /bootstrap/)
  assert.doesNotMatch(run.logs.join('\n'), /test-token-never-log|test-project-never-log/)
  assert.deepEqual(run.waits, [])
})

test('diagnostic network waits do not block the Next process from starting', async () => {
  const run = start([{ pending: true }]); await setImmediate()
  assert.equal(run.spawned.length, 1)
  assert.doesNotMatch(run.logs.join('\n'), /health\s+ready/)
  run.resolve({}); await run.finish()
  assert.match(run.logs.join('\n'), /health\s+ready/)
})

test('an unready backend can recover after refusal and HTTP 503 without a false final failure', async () => {
  const run = start([{ error: new TypeError('fetch failed') }, { status: 503 }, {}]); await run.finish()
  assert.equal(run.calls.length, 3)
  assert.equal(run.logs.filter(line => /health\s+waiting/.test(line)).length, 2)
  assert.match(run.logs.join('\n'), /HTTP 503/)
  assert.match(run.logs.join('\n'), /health\s+ready.*attempt 3\/3/)
  assert.doesNotMatch(run.logs.join('\n'), /health\s+failed/)
  assert.deepEqual(run.waits, [1000, 1000])
})

for (const status of [401, 404, 503]) {
  test(`persistent HTTP ${status} remains a bounded explicit failure`, async () => {
    const run = start([{ status }]); await run.finish()
    assert.equal(run.calls.length, 3)
    assert.match(run.logs.join('\n'), new RegExp(`health\\s+failed.*HTTP ${status}.*QT_WORKBENCH_URL`))
    assert.doesNotMatch(run.logs.join('\n'), /health\s+ready/)
    assert.deepEqual(run.cancelled, [status, status, status])
    assert.equal(run.spawned.length, 1)
  })
}

test('connection refusal stays visible after bounded retries', async () => {
  const error = new TypeError('fetch failed', { cause: { code: 'ECONNREFUSED' } })
  const run = start([{ error }]); await run.finish()
  assert.equal(run.calls.length, 3)
  assert.match(run.logs.join('\n'), /health\s+failed.*unreachable.*ECONNREFUSED/)
  assert.doesNotMatch(run.logs.join('\n'), /health\s+ready/)
})

test('each stalled request has a five-second bound and a persistent timeout is reported', async () => {
  const error = Object.assign(new Error('expired'), { name: 'TimeoutError' })
  const run = start([{ error }]); await run.finish()
  assert.deepEqual(run.timeouts, [5000, 5000, 5000])
  assert.equal(run.calls.length, 3)
  assert.match(run.logs.join('\n'), /health\s+failed.*timed out.*5000ms/)
})

test('redirects are not followed or mistaken for readiness', async () => {
  const run = start([{ status: 302 }]); await run.finish()
  assert.equal(run.calls.length, 3)
  assert.ok(run.calls.every(call => call.options.redirect === 'manual'))
  assert.match(run.logs.join('\n'), /health\s+failed.*HTTP 302/)
})

test('HTTP 200 from a website health route does not prove workbench readiness', async () => {
  const run = start([{ payload: { ok: true, service: 'qualicraft-website' } }]); await run.finish()
  assert.match(run.logs.join('\n'), /health\s+failed.*unexpected bootstrap response/)
  assert.doesNotMatch(run.logs.join('\n'), /health\s+ready/)
})

test('a successful empty workbench is valid, malformed bootstrap shapes are not', async () => {
  const good = start([{ payload: { token: 'test', projects: [], config: {} } }]); await good.finish()
  assert.match(good.logs.join('\n'), /health\s+ready/)
  for (const payload of [[], { token: '', projects: [], config: {} }, { token: 'test', projects: {}, config: {} }, { token: 'test', projects: [], config: [] }]) {
    const bad = start([{ payload }]); await bad.finish()
    assert.match(bad.logs.join('\n'), /health\s+failed.*unexpected bootstrap response/)
  }
})

test('HTML or invalid JSON bodies cannot turn an HTTP 200 into a healthy result', async () => {
  const run = start([{ jsonError: new SyntaxError('sensitive response must not be logged') }]); await run.finish()
  assert.match(run.logs.join('\n'), /health\s+failed.*invalid bootstrap JSON/)
  assert.doesNotMatch(run.logs.join('\n'), /sensitive response/)
})

test('timeouts while reading bootstrap JSON retain the timeout diagnosis', async () => {
  const run = start([{ jsonError: Object.assign(new Error('expired'), { name: 'TimeoutError' }) }]); await run.finish()
  assert.match(run.logs.join('\n'), /health\s+failed.*timed out/)
})
