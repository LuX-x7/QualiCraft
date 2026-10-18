/** The site's connection boundary; no research or plotting logic lives here. */
export function workbenchBase() {
  const raw = (process.env.QT_WORKBENCH_URL || 'http://127.0.0.1:8765').trim().replace(/\/+$/, '')
  if (/^https?:\/\//i.test(raw)) return raw
  const authority = raw.split('/')[0]
  return `https://${authority.includes('.') ? authority : `${authority}.onrender.com`}`
}
const TRANSIENT = new Set([502, 503, 504])
const HOP_BY_HOP = new Set([
  'host', 'connection', 'keep-alive', 'transfer-encoding', 'upgrade',
  'origin', 'referer', 'cookie', 'sec-fetch-site', 'sec-fetch-mode',
  'sec-fetch-dest', 'sec-fetch-user', 'accept-encoding', 'content-length',
])
function connectingPage() {
  return new Response(`<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Opening QT</title><link rel="icon" href="/icon.svg">
<style>
*{box-sizing:border-box}body{margin:0;color:#1f2836;background:#faf8f4;background-image:linear-gradient(#4b607c0c 1px,transparent 1px),linear-gradient(90deg,#4b607c0c 1px,transparent 1px);background-size:24px 24px;font:18px/1.6 system-ui,sans-serif}main{max-width:640px;margin:12vh auto;padding:32px}img{width:64px;height:64px}h1{font:normal 38px/1.2 Georgia,serif;margin:24px 0}p{max-width:50ch}small{color:#4b607c}nav{display:flex;flex-wrap:wrap;gap:16px;margin-top:28px}a,button{font:inherit;color:#1f2836;padding:10px 14px;border:1px solid #4b607c;background:#fff;text-decoration:none;min-height:44px}button{cursor:pointer}a:focus-visible,button:focus-visible{outline:3px solid #ad6743;outline-offset:4px}[hidden]{display:none!important}@media(max-width:600px){main{margin:5vh auto;padding:24px}h1{font-size:32px}}</style>
<script src="/workbench-connect.js" defer></script></head><body><main>
<img src="/icon.svg" alt="QT"><h1>Opening the workbench</h1>
<p id="connection-status" role="status" aria-live="polite">Connecting to the demo. After inactivity, the free server can take about a minute to wake up. This page will continue automatically when it is ready.</p>
<small>Public Bologna demo · read-only. Your own interviews stay in the local app.</small>
<nav aria-label="While you wait"><button id="retry-connection" hidden>Try again</button><a href="/report#sec-outputs">View worked example →</a><a href="/">Back to website</a></nav>
<noscript><p>JavaScript is off. <a href="">Reload the workbench</a> after a minute, or explore the example above.</p></noscript>
</main></body></html>`, {headers:{
    'content-type':'text/html; charset=utf-8', 'cache-control':'no-store',
    'x-qt-workbench':'connecting', 'x-content-type-options':'nosniff',
    'content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'",
    'referrer-policy':'no-referrer',
  }})
}
/** @param {Request} request @param {string[] | undefined} segments */
export async function proxyWorkbench(request, segments, {base=workbenchBase(), fetchImpl=fetch}={}) {
  const incoming = new URL(request.url)
  const suffix = segments?.length ? `/${segments.join('/')}` : ''
  const navigation = request.method === 'GET' && !suffix && request.headers.get('accept')?.includes('text/html')
  const headers = new Headers()
  request.headers.forEach((value,key)=>{if(!HOP_BY_HOP.has(key.toLowerCase()))headers.set(key,value)})
  const body = ['GET','HEAD'].includes(request.method) ? undefined : await request.arrayBuffer()
  let upstream
  try {
    // Bound only the initial HTML. Plot/export requests keep their generation
    // time. Never replay a write or silently downgrade an HTTPS request.
    upstream = await fetchImpl(`${base}/w${suffix}${incoming.search}`, {
      method:request.method, headers, body, redirect:'manual', cache:'no-store',
      ...(navigation ? {signal:AbortSignal.timeout(2000)} : {}),
    })
  } catch {
    if(navigation)return connectingPage()
    return new Response('The workbench is temporarily unavailable. Please try again.',{status:502,headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store'}})
  }
  if(navigation && (TRANSIENT.has(upstream.status) || upstream.headers.get('x-render-routing') === 'no-deploy')) {
    await upstream.body?.cancel()
    return connectingPage()
  }
  const out = new Headers()
  upstream.headers.forEach((value,key)=>{if(!['content-length','content-encoding','transfer-encoding','connection'].includes(key.toLowerCase()))out.set(key,value)})
  return new Response(upstream.body,{status:upstream.status,headers:out})
}
/** Readiness is based on the actual bootstrap, never the website's health. */
export async function workbenchStatus({base=workbenchBase(), fetchImpl=fetch}={}) {
  let ready=false, retryable=true
  try {
    const response=await fetchImpl(`${base}/w/api/bootstrap`,{signal:AbortSignal.timeout(8000),cache:'no-store',redirect:'manual'})
    if(!response.ok){retryable=TRANSIENT.has(response.status);await response.body?.cancel()}
    else if(response.headers.get('content-type')?.includes('text/html')) {
      // Render can return its waking page with HTTP 200 before Python is up.
      retryable=true
      await response.body?.cancel()
    } else {
      const value=await response.json()
      ready=Boolean(value && typeof value.token==='string' && value.token.length && Array.isArray(value.projects) && value.config && typeof value.config==='object' && !Array.isArray(value.config))
      retryable=false
    }
  } catch(error) { retryable=!(error instanceof SyntaxError) }
  return Response.json({ready,retryable},{headers:{'cache-control':'no-store','x-content-type-options':'nosniff'}})
}
