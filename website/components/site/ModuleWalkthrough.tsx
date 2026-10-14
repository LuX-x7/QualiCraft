'use client'

/**
 * The five modules, walked through by scrolling.
 *
 * Desktop: the demonstration panel is sticky on the left while the five
 * numbered steps scroll past on the right; an IntersectionObserver picks the
 * step the reader is in and the panel shows that step's media. Phone: the
 * panel sits above the list and shows the same active step.
 *
 * Scrolling stays the browser's own — nothing here smooth-scrolls or
 * intercepts the wheel; the observer only reports which step is current, and
 * activating a step with the keyboard scrolls it into view natively.
 *
 * Media: each step carries a short clip recorded from the running workbench.
 * Until a clip has passed the acceptance checks the panel shows the
 * placeholder the brief asks for — a frame that says "clip pending" — and no
 * substituted screenshot. Adding an accepted clip is one entry in CLIPS.
 *
 * prefers-reduced-motion: the sticky following and the observer are off, and
 * every step is laid out in full, in order, as a static page.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { MODULES } from '@/lib/site/content'

/** Steps whose clip is accepted and present under /clips/. Empty by design. */
const CLIPS: Record<string, string> = {}

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)

export default function ModuleWalkthrough() {
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(false)
  const stepRefs = useRef<Array<HTMLLIElement | null>>([])
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  /* Activating a step scrolls it into view, and the observer then reports
     whatever step the reader's line falls in — which after a keyboard jump
     can be a different one, and the panel flickers away from the step the
     reader just chose. The activation therefore holds the observer off for a
     moment; a real wheel or touch clears the hold immediately, so scrolling
     by hand is never delayed. */
  const holdRef = useRef(0)

  useEffect(() => {
    const clear = () => {
      holdRef.current = 0
    }
    window.addEventListener('wheel', clear, { passive: true })
    window.addEventListener('touchmove', clear, { passive: true })
    return () => {
      window.removeEventListener('wheel', clear)
      window.removeEventListener('touchmove', clear)
    }
  }, [])

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!query) return
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  /* The observer follows the reader. A hairline band across the middle of the
     viewport is the root the observer measures against; in the callback the
     step containing the reader's line is recomputed from the boxes, so the
     active step is the one the reader is actually inside rather than whichever
     step happens to have the largest overlap. Nothing scrolls as a result —
     the observer only reports. */
  useEffect(() => {
    if (reduced) return
    const nodes = stepRefs.current.filter((el): el is HTMLLIElement => Boolean(el))
    if (!nodes.length || typeof IntersectionObserver === 'undefined') return
    const pick = () => {
      const line = window.innerHeight * 0.5
      let lastAbove: string | null = null
      for (const el of nodes) {
        const box = el.getBoundingClientRect()
        if (box.top <= line && box.bottom >= line) return el.id
        if (box.bottom < line) lastAbove = el.id
      }
      return lastAbove
    }
    const observer = new IntersectionObserver(
      () => {
        if (performance.now() < holdRef.current) return
        const id = pick()
        if (!id) return
        const index = MODULES.findIndex((module) => `module-${module.key}` === id)
        if (index >= 0) setActive(index)
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    nodes.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [reduced])

  const goTo = useCallback((index: number, focus = false) => {
    const bounded = Math.max(0, Math.min(MODULES.length - 1, index))
    setActive(bounded)
    holdRef.current = performance.now() + 900
    const node = stepRefs.current[bounded]
    if (node) node.scrollIntoView({ block: 'center' })
    if (focus) buttonRefs.current[bounded]?.focus()
  }, [])

  /* Keyboard: up and down walk the steps. The panel follows; the page scroll
     only when the reader asks for it. */
  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault()
      goTo(index + 1, true)
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault()
      goTo(index - 1, true)
    } else if (event.key === 'Home') {
      event.preventDefault()
      goTo(0, true)
    } else if (event.key === 'End') {
      event.preventDefault()
      goTo(MODULES.length - 1, true)
    }
  }

  const module = MODULES[active]
  const clip = CLIPS[module.key]

  return (
    <section className="section walk" id="modules" aria-labelledby="modules-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-no">03</span>
          <h2 id="modules-title">Five modules, taken as you need them.</h2>
          <p>
            Import, code, analyse, plot, export. Each step says what to do and what you
            should see; scroll the list and the panel follows. Every module is off by
            default except the three at the core — turn one on and it stays on for that
            study.
          </p>
        </div>

        <div className={`walk__grid${reduced ? ' walk__grid--static' : ''}`}>
          <div className="walk__panel" aria-live="polite">
            <div className="walk__panel-head">
              <span className="walk__panel-no mono">{module.no}</span>
              <span className="walk__panel-title">{module.title}</span>
            </div>
            {clip ? (
              <video
                className="walk__media"
                src={clip}
                controls
                playsInline
                preload="metadata"
              />
            ) : (
              <div className="walk__placeholder">
                <span className="walk__placeholder-no mono">{module.no}</span>
                <span className="walk__placeholder-text mono">clip pending</span>
                <span className="walk__placeholder-note">
                  A {module.title.toLowerCase()} clip, recorded from the running workbench,
                  lands here once it passes the acceptance checks.
                </span>
              </div>
            )}
            <p className="walk__panel-see">{module.see}</p>
          </div>

          <ol className="walk__steps">
            {MODULES.map((item, index) => {
              const current = index === active
              return (
                <li
                  key={item.key}
                  id={`module-${item.key}`}
                  ref={(el) => {
                    stepRefs.current[index] = el
                  }}
                  className={`walk__step${current ? ' is-current' : ''}`}
                >
                  <button
                    type="button"
                    ref={(el) => {
                      buttonRefs.current[index] = el
                    }}
                    className="walk__step-button"
                    aria-current={current ? 'step' : undefined}
                    onClick={() => goTo(index)}
                    onKeyDown={(event) => onKeyDown(event, index)}
                  >
                    <span className="walk__step-no mono">{item.no}</span>
                    <span className="walk__step-title">{item.title}</span>
                  </button>
                  <p className="walk__step-goal">{item.goal}</p>
                  <ul className="walk__step-ops">
                    {item.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
