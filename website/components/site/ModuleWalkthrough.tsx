'use client'

/**
 * The five modules, walked through by scrolling.
 *
 * Desktop: the demonstration panel is sticky on the left while the five
 * numbered steps scroll past on the right; an IntersectionObserver picks the
 * step the reader is in and the panel shows that step's media. Phone and
 * reduced motion: media appears with each step, in reading order.
 *
 * Scrolling stays the browser's own — nothing here smooth-scrolls or
 * intercepts the wheel; the observer only reports which step is current, and
 * activating a step with the keyboard scrolls it into view natively.
 *
 * Media: each step carries a short clip recorded from the running workbench.
 * Until a clip has passed the acceptance checks the panel shows the
 * placeholder the brief asks for — a frame that says "clip pending" — and no
 * substituted screenshot. Accepted media and recorded stills live in CLIPS.
 *
 * prefers-reduced-motion: the sticky following and the observer are off, and
 * every step is laid out in full, in order, as a static page.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { MODULES } from '@/lib/site/content'
import { CLIPS } from '@/lib/site/clips'
import CodingEvidence, { type CodingExample } from './CodingEvidence'

type Module = (typeof MODULES)[number]

function ModuleMedia({ item, reduced }: { item: Module; reduced: boolean }) {
  const clip = CLIPS[item.key]
  const [still, setStill] = useState(false)
  const [failed, setFailed] = useState(false)
  const captionId = `clip-caption-${item.key}`

  if (!clip) return (
    <div className="walk__placeholder">
      <span className="walk__placeholder-no mono">{item.no}</span>
      <span className="walk__placeholder-text mono">clip pending</span>
      <span className="walk__placeholder-note">A {item.title.toLowerCase()} recording will appear here after review.</span>
    </div>
  )

  const showStill = reduced || still || failed
  return (
    <figure className="walk__recording">
      {showStill ? (
        // These are unaltered decoded recording frames, not substituted UI.
        // eslint-disable-next-line @next/next/no-img-element
        <img className="walk__media" src={clip.poster} width={clip.width}
          height={clip.height} alt={clip.description} loading="lazy" />
      ) : (
        <video className="walk__media" src={clip.src} poster={clip.poster}
          width={clip.width} height={clip.height} controls muted playsInline
          preload="metadata" aria-label={clip.label || `${item.title} workbench recording`}
          aria-describedby={captionId} onError={() => setFailed(true)}>
          <a href={clip.poster}>View the recorded still image</a>
        </video>
      )}
      <figcaption id={captionId}>
        <p>{clip.description} <span className="walk__recording-meta">3 seconds · CC0 sample · No audio.</span></p>
        {failed && <p role="status">The recording could not load. The recorded still image is shown.</p>}
        <div className="walk__media-actions">
          {!reduced && !failed && (
            <button type="button" className="walk__media-toggle"
              aria-label={`${still ? 'Watch recording' : 'Show still image'}: ${item.title}`}
              onClick={() => setStill(!still)}>
              {still ? 'Watch recording' : 'Show still image'}
            </button>
          )}
          <a href={clip.poster} target="_blank" rel="noreferrer">Open full-size still (new tab)</a>
        </div>
      </figcaption>
    </figure>
  )
}

function RecordedExample({ item, reduced }: { item: Module; reduced: boolean }) {
  const [open, setOpen] = useState(false)
  const clip = CLIPS[item.key]
  return <details className="recorded-example" open={open} onToggle={event => setOpen(event.currentTarget.open)} onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); event.currentTarget.querySelector('summary')?.focus() } }}>
    <summary>Real workspace recording · {item.title}</summary>
    {open ? <ModuleMedia item={item} reduced={reduced} /> : clip && (
      // The native disclosure still has a real recorded image without JavaScript.
      // eslint-disable-next-line @next/next/no-img-element
      <img className="walk__media" src={clip.poster} width={clip.width} height={clip.height} alt={clip.description} loading="lazy" />
    )}
  </details>
}
function StepDemo({ item, reduced, example }: { item: Module; reduced: boolean; example: CodingExample | null }) {
  return <>
    {item.key === 'coding' && (example ? <CodingEvidence example={example} /> : <p role="status">The source illustration could not be verified. Read the export record in the example report.</p>)}
    {item.key !== 'coding' && <div className="workflow-result"><p className="illustration-label mono">Workflow outline</p><h3>{item.goal}</h3><p>{item.see}</p></div>}
    <RecordedExample item={item} reduced={reduced} />
  </>
}

export default function ModuleWalkthrough({ example }: { example: CodingExample | null }) {
  const [active, setActive] = useState(1)
  const [reduced, setReduced] = useState(false)
  const [compact, setCompact] = useState(false)
  const [mediaReady, setMediaReady] = useState(false)
  const inlineMedia = reduced || compact
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
    const clear = (event: Event) => {
      if ((event.target as Element)?.closest?.('.walk__panel')) return
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
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const phone = window.matchMedia('(max-width: 800px)')
    const onChange = () => {
      setReduced(motion.matches)
      setCompact(phone.matches)
      setMediaReady(true)
    }
    onChange()
    motion.addEventListener('change', onChange)
    phone.addEventListener('change', onChange)
    return () => {
      motion.removeEventListener('change', onChange)
      phone.removeEventListener('change', onChange)
    }
  }, [])

  /* The observer follows the reader. A hairline band across the middle of the
     viewport is the root the observer measures against; in the callback the
     step containing the reader's line is recomputed from the boxes, so the
     active step is the one the reader is actually inside rather than whichever
     step happens to have the largest overlap. Nothing scrolls as a result —
     the observer only reports. */
  useEffect(() => {
    if (!mediaReady || reduced || compact) return
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
  }, [reduced, compact, mediaReady])

  const goTo = useCallback((index: number, focus = false) => {
    const bounded = Math.max(0, Math.min(MODULES.length - 1, index))
    setActive(bounded)
    holdRef.current = performance.now() + 900
    const node = stepRefs.current[bounded]
    if (node) node.scrollIntoView({ block: inlineMedia || bounded === 0 ? 'start' : 'center' })
    if (focus) buttonRefs.current[bounded]?.focus({ preventScroll: true })
  }, [inlineMedia])

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

  return (
    <section className="section walk" id="modules" aria-labelledby="modules-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-no">02</span>
          <h2 id="modules-title">Five steps, one traceable workflow.</h2>
          <p>Follow one record from source to export. Start with the Coding illustration,
            or open a real Bologna recording at any step.</p>
          <button className="walk__start" type="button" onClick={() => goTo(1, true)}>Explore the coding example →</button>
          <details className="workflow-settings"><summary>Workflow steps and project settings</summary>
            <p>These five steps are not capability switches. New projects enable theme grouping,
            memos, AI suggestions, Insights and Audit. Enable Figures in Tools when needed.
            A model request still requires configuration, preview and confirmation.</p></details>
        </div>

        <div className={`walk__grid${inlineMedia ? ' walk__grid--inline' : ''}`}>
          {!inlineMedia && <div className="walk__panel" id="module-demo"
            onFocusCapture={() => { holdRef.current = Number.POSITIVE_INFINITY }}
            onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) holdRef.current = performance.now() + 900 }}
            onPointerDown={() => { holdRef.current = Number.POSITIVE_INFINITY }}>
            <div className="walk__panel-head">
              <span className="walk__panel-no mono">{module.no}</span>
              <span className="walk__panel-title">{module.title}</span>
            </div>
            <StepDemo key={module.key} item={module} reduced={reduced} example={example} />
            <p className="walk__panel-see">{module.see}</p>
          </div>}

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
                    aria-controls={inlineMedia ? `module-demo-${item.key}` : 'module-demo'}
                    onClick={() => goTo(index)}
                    onKeyDown={(event) => onKeyDown(event, index)}
                  >
                    <span className="walk__step-no mono">{item.no}</span>
                    <span className="walk__step-title">{item.title}</span>
                  </button>
                  <p className="walk__step-goal">{item.goal}</p>
                  <p className="walk__step-result">{item.see}</p>
                  <details className="walk__operations"><summary>How in the workbench</summary><ul className="walk__step-ops">
                    {item.steps.map(step => <li key={step}>{step}</li>)}
                  </ul></details>
                  {inlineMedia && (reduced || current) && <div className="walk__inline" id={`module-demo-${item.key}`}>
                    <StepDemo item={item} reduced={reduced} example={example} />
                    <p className="walk__panel-see">{item.see}</p>
                  </div>}
                </li>
              )
            })}
          </ol>
        </div>
        <noscript><p>Recorded stills and videos remain available without interactive step switching.</p><ul>{MODULES.map(item => <li key={item.key}><a href={CLIPS[item.key]?.poster}>{item.title} recorded still</a>{' · '}<a href={CLIPS[item.key]?.src}>recording</a></li>)}</ul></noscript>
      </div>
    </section>
  )
}
