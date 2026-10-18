'use client'
import {useEffect} from 'react'
/** One early wake request per page, plus intent; no background keep-alive. */
export default function WorkbenchWarmup() {
  useEffect(() => {
    let sent=false
    function wake() {
      if(sent || document.visibilityState !== 'visible')return
      sent=true
      void fetch('/api/workbench-status',{cache:'no-store',signal:AbortSignal.timeout(10000)}).catch(()=>{})
    }
    function intent(event: Event) {
      if(event.target instanceof Element && event.target.closest('a[href^="/w"]'))wake()
    }
    const timer=window.setTimeout(wake,1500)
    document.addEventListener('pointerover',intent,{passive:true})
    document.addEventListener('focusin',intent)
    return () => {window.clearTimeout(timer);document.removeEventListener('pointerover',intent);document.removeEventListener('focusin',intent)}
  },[])
  return null
}
