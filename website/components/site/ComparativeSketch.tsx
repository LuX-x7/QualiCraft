'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import maps from '@/lib/site/method-maps.json'

/** A procedure guide, using the same generated method map as the report.
 *  It intentionally contains no invented case memberships or computed result. */
export default function ComparativeSketch() {
  const [active, setActive] = useState(0)
  const buttons = useRef<Array<HTMLButtonElement | null>>([])
  const steps = maps.comparative.steps
  const choose = (index: number, focus = false) => {
    const next = Math.max(0, Math.min(steps.length - 1, index))
    setActive(next)
    if (focus) buttons.current[next]?.focus({ preventScroll: true })
  }
  const keyboard = (event: KeyboardEvent, index: number) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    choose(event.key === 'Home' ? 0 : event.key === 'End' ? steps.length - 1
      : index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1), true)
  }
  return <div className="qca-sketch engineering-plate" data-diagram="comparative" data-qca-step={active + 1}>
    <p className="engineering-caption mono">COMPARATIVE QCA / CASES → SETS → CONFIGURATIONS</p>
    <div className="qca-procedure" role="group" aria-label="Explore Comparative QCA procedure">
      {steps.map((step, index) => <button key={step.id} type="button" ref={el => { buttons.current[index] = el }}
        aria-pressed={active === index} onMouseEnter={() => choose(index)} onFocus={() => choose(index)}
        onClick={() => choose(index)} onKeyDown={event => keyboard(event, index)}>
        <span className="mono">{String(step.id).padStart(2, '0')}</span>
        <svg viewBox="0 0 140 66" fill="none" aria-hidden="true">
          <g className="procedure-lines">
            {index === 0 ? <><path d="M14 16h30v37H14zM22 10h30v37M31 4h30v37M62 32h25m-7-6 7 6-7 6M99 17h25v32H99z"/><path d="M19 26h18m-18 8h18m-18 8h12M104 26h15m-15 9h15"/></>
              : index === 1 ? <><path d="M12 14h45v37H12zM83 14h45v37H83zM58 32h24"/><circle cx="34" cy="32" r="10"/><path d="M95 24h20m-20 9h20m-20 9h12"/></>
              : index === 2 ? <><path d="M10 15h45v36H10zM20 27h25m-25 12h17M59 33h20m-6-5 6 5-6 5M89 14v40h40V14zM89 34h40m-20-20v40"/><path d="M96 24h7m13 19h7"/></>
              : index === 3 ? <><path d="M18 8h104v49H18zM18 23h104m-104 17h104M45 8v49m26-49v49m26-49v49"/><path d="M25 16h12m15 16h12m13 17h12m15-17h12"/></>
              : index === 4 ? <><circle cx="42" cy="30" r="22"/><circle cx="69" cy="30" r="22"/><path d="M58 11c-13 9-13 28 0 38M94 30h28m-7-6 7 6-7 6M27 59h64"/></>
              : <><path d="M18 8h76v49H18zM28 19h53m-53 9h44m-44 9h53m-53 10h33M101 26h22v26h-22zM107 26v-7a5 5 0 0 1 10 0v7"/></>}
          </g>
          <path className="procedure-trace" pathLength="1" d="M9 62Q67 59 131 62"/>
        </svg>
        <strong>{step.title}</strong>
      </button>)}
    </div>
    <div className="procedure-readout" role="status" aria-live="polite" aria-atomic="true">
      <span className="mono">{String(active + 1).padStart(2, '0')} / RESEARCHER DECISION</span>
      <h3>{steps[active].title}</h3><p>{steps[active].detail}</p>
    </div>
    <p className="sketch-note">Binary sets · 1–6 conditions · up to 100 cases. Save calibration, then freeze a run. The report keeps that result and its reproducible code.</p>
    <p className="sketch-note mono">PROCEDURE GUIDE · NO CASE VALUES OR RESULTS ARE ASSUMED</p>
    <a className="quiet-link" href="#method">Compare all three methods ↓</a>
  </div>
}
