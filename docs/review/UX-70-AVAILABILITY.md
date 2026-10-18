# UX70 · Website speed and sleeping-workbench recovery

2026-10-18. User reported a slow website and HTTP 502 on Try the workbench. Scope: connection handling and website delivery only. Bologna only; no research, statistics, plotting, data, result assets, paid-plan, or auto-deploy changes. Windows and physical-phone follow-up remain deferred.

## Diagnosis

At 18:44:03 UTC the public /w?lang=en returned HTTP 502 in 0.572s, with provider header `x-render-routing: no-deploy`. A direct backend request completed HTTP 200 after 32.886s; the same website proxy then returned HTTP 200 in 0.391s. Render logs show a new backend process starting at 21:44:28 Nicosia and listening at 21:44:32, without a new deploy or an intervening OOM event. This supports an idle-instance wake-up as the cause. Earlier OOM events are historical, before UX68. Evidence: home/workbench/backend/proxy-awake headers and timings, backend-startup-log.txt, backend-events.txt and website-events.txt outside Git.

Render documents the free tier's 15-minute idle shutdown and roughly one-minute wake-up: https://render.com/docs/free#spinning-down-on-idle . A code fix cannot remove the platform's own sleep or make the website available before its Node instance is awake.

## Change

- Home, report and About are generated as static HTML at build time, including existing manifest/file-integrity checks. The public site has one English copy; /zh still rewrites to English. The independent workbench keeps its language selector. No request-time asset rehash/render on each page visit.
- One early, finite readiness request on a visible website page begins waking the backend while the visitor reads. Hover/focus intent can send it sooner; no background keep-alive timer.
- An initial /w HTML navigation gets a two-second upstream deadline. Transient 502/503/504, provider no-deploy pages or connection failure show a small QT connection page, with status text, example/back links and progressive retry. It checks the real bootstrap, then reloads the same URL. After about two minutes, or a permanent failure, it stops and exposes explicit retry. Bootstrap tokens/project data never appear in readiness responses.
- API/exports retain their original status and long generation time. Writes are sent exactly once; no transport retry or HTTPS downgrade. Original security headers remain on the actual workbench response. Only initial navigation gets an HTML fallback. Word preview thumbnails load lazily.

## Verification

- `node --test tests/*.test.mjs tools/report/*.test.mjs`: **263 pass**, including **16** new connection/client tests. Transient/permanent/HTML-200 startup, network errors, write once/body/auth, long export streaming, bootstrap shape/privacy, recovery and retry bounds covered.
- `python -m unittest discover -s tests -v`: **298 tests, OK, 3 existing skips**. An initial sandbox run failed with 49 port-listening permission errors; retained, then rerun with loopback permission. No product changes to bypass a test.
- Production Next build exits 0; /en, /en/report and /en/about are SSG. JS syntax, diff checks and forbidden-phrase scan pass (scan exit 1 = no matches).
- **9 browser checks** pass in a fresh controlled Chrome: static pages/locales, real read-only Bologna entry through temporary 503, keyboard entry, unchanged report/download links, satellite Pause/Play, actual stalled HTML deadline **2.029s**, permanent failure/explicit keyboard retry. Console errors **0**. Temporary-failure page appears in **0.120s** when upstream immediately returns 503.
- Same-machine loopback medians: home **0.1197 → 0.0140s**; report **0.1118 → 0.0136s**; About **0.0097 → 0.0034s**. Three complete HTTP reads each; not an internet latency or idle-instance guarantee.
- **53 protected tracked files unchanged**, including all qualicraft/, web/, demo data, report assets, worked-example files, CI and render.yaml. All **11 worked-example downloads** have identical lengths and SHA-256. Core figures/counts/scripts/data untouched.

Raw evidence: `~/qualicraft-review/ux-70/` (working source `/tmp/qualicraft-ux70/`), command/output/exit triples under raw/. Before-module test failure, first UI selector mismatch (`Pause` versus actual `Pause Ⅱ`), sandbox limitation and a GET-only test simulator's POST 501 are preserved. The final browser script uses the visible label; write forwarding is unit-tested and must additionally be checked as HTTP403 online. No native VoiceOver, phone or Windows claim is made.

## Release

Source `074e50aea7388d9f457f0b73b7c4b01e69f5a41e` was normally fast-forwarded to main and manually deployed to the existing website service. Deployment `dep-dbahah49v7es738h0lcg` is **Live** at 2026-10-18 18:52:58 UTC. Existing backend remains on `2865b1d7fe4d12c5f09628e94c57a2ffc832af93` because its source did not change; it was not redeployed. Auto-Deploy is **Off**, read directly from the existing settings control without editing; free plan unchanged.

Live anonymous HTTP reads after deployment: home **0.589s**, report **0.587s**, About **0.282s**, workbench HTML **0.748s**, bootstrap **0.315s**; all HTTP200, and the public pages report `x-nextjs-cache: HIT`. These are individual warm measurements, not a cold-start guarantee. Readiness returns only the expected two booleans; a nonexistent write still returns **403**. All eleven public output files match the original manifest SHA-256/length. Native Chrome follows Try the workbench → explicit read-only choice → Enter → original Bologna 19/317/874, with **zero console warnings/errors**. Screenshots live-home/start/coding.png and render-live.png are external. Recovery from a forced outage is validated on the controlled loopback boundary; production was not deliberately broken or restarted to simulate an outage.

GitHub CI run [39156055908](https://github.com/LuX-x7/QualiCraft/actions/runs/39156055908) **succeeded**: both Python collection commands pass 298 tests (3 skips), Node passes 263, and npm ci / npm run build succeed with SSG routes. Full job logs are retained externally in ci/. The updated `~/qualicraft-review/supervisor-review-UX70-release.zip` preserves prior samples and includes current docs and explicit UX70 raw evidence. Its external packet-verification.json contains the full archive checksum.
