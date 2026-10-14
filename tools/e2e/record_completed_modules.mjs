/**
 * Capture a continuous, already-completed result through the CUA tab API.
 * Run inside cua_repl after performing and verifying the real import/download.
 * Raw frames and traces belong outside the repository. No DOM is modified.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

export async function recordCompletedState(tab, { outDir, clip, durationMs = 3000 }, action) {
  await mkdir(outDir, { recursive: true })
  const observe = () => tab.playwright.evaluate(() => ({
    url: location.href,
    title: document.title,
    viewport: [innerWidth, innerHeight],
    headings: [...document.querySelectorAll('h1,h2')].map(e => e.textContent),
    dialogs: [...document.querySelectorAll('[role="dialog"],dialog[open]')]
      .filter(e => e.getBoundingClientRect().width > 0).length,
    han: [...new Set(document.body.innerText.match(/\p{Script=Han}/gu) || [])],
    blocked: /publication|put in a paper|期刊/i.test(document.body.innerText),
  }))
  const before = await observe()
  if (before.dialogs || before.han.length || before.blocked) {
    throw new Error('Result is not ready for recording: ' + JSON.stringify(before))
  }
  const frames = []
  const start = performance.now()
  let acted = false
  do {
    const capturedAtMs = performance.now() - start
    const bytes = await tab.screenshot({ fullPage: false, ...(clip ? { clip } : {}) })
    const file = `frame-${String(frames.length).padStart(4, '0')}.jpg`
    await writeFile(join(outDir, file), bytes)
    frames.push({ file, capturedAtMs, sha256: createHash('sha256').update(bytes).digest('hex') })
    if (action && !acted && performance.now() - start >= durationMs / 2) {
      await action()
      await tab.getAXState({ emit: false })
      acted = true
    }
  } while (performance.now() - start < durationMs)
  const trace = {
    capturedAt: new Date().toISOString(),
    durationMs: performance.now() - start,
    clip: clip || null,
    before,
    after: await observe(),
    frames,
  }
  if (trace.after.dialogs || trace.after.han.length || trace.after.blocked) {
    throw new Error('Result failed the final recording check')
  }
  await writeFile(join(outDir, 'trace.json'), JSON.stringify(trace, null, 2) + '\n')
  return { outDir, frames: frames.length, durationMs: trace.durationMs, before, after: trace.after }
}
