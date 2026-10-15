'use client'
import { useEffect, useState } from 'react'
const EVENT = 'qualicraft-motion-change'
const KEY = 'qualicraft-motion'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches || document.documentElement.dataset.reducedMotion === 'true')
    update()
    media.addEventListener('change', update)
    window.addEventListener(EVENT, update)
    return () => { media.removeEventListener('change', update); window.removeEventListener(EVENT, update) }
  }, [])
  return reduced
}

export default function MotionPreference() {
  const [choice, setChoice] = useState('system')
  const apply = (value: string) => {
    setChoice(value)
    document.documentElement.dataset.reducedMotion = String(value === 'reduce')
    window.dispatchEvent(new Event(EVENT))
  }
  useEffect(() => {
    let value = 'system'
    try { if (localStorage.getItem(KEY) === 'reduce') value = 'reduce' } catch { /* Browser storage may be disabled. */ }
    apply(value)
  }, [])
  return <label className="motion-preference mono">Motion
    <select aria-label="Motion preference" value={choice} onChange={event => {
      apply(event.target.value)
      try { localStorage.setItem(KEY, event.target.value) } catch { /* Preference still works for this page. */ }
    }}><option value="system">Follow system</option><option value="reduce">Reduce motion</option></select>
  </label>
}
