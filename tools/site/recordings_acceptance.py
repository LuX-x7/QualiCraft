"""Project-only Chrome acceptance for the five real recordings and still fallbacks.

Requires an independently checked recording receipt; never attaches to existing
tabs or changes a project. Phone checks use a touch-enabled Chrome viewport,
not a physical device. Raw outputs belong outside the repository.
"""
import argparse
import hashlib
import json
from pathlib import Path
import traceback
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--url', required=True)
    ap.add_argument('--out', type=Path, required=True)
    ap.add_argument('--receipt', type=Path, required=True)
    args = ap.parse_args()
    parsed = urlsplit(args.url)
    assert parsed.hostname in ('127.0.0.1', 'localhost') and parsed.scheme == 'http'
    origin = f'{parsed.scheme}://{parsed.netloc}'
    out = args.out; out.mkdir(parents=True, exist_ok=True)
    receipt = json.loads(args.receipt.read_text(encoding='utf8'))
    keys = ['import', 'coding', 'analysis', 'plotting', 'export']
    results = []; errors = []; http = []; expected_failures = []

    def check(name, fn):
        try:
            reading = fn(); results.append({'name': name, 'pass': True, 'reading': reading})
            print('PASS', name, flush=True)
        except Exception as error:
            results.append({'name': name, 'pass': False, 'error': str(error), 'traceback': traceback.format_exc()})
            print('FAIL', name, str(error), flush=True)

    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='chrome', headless=True)

        def context(intentional_failure=False, **options):
            ctx = browser.new_context(**options)
            def route(r):
                if not r.request.url.startswith(origin + '/'):
                    r.abort()
                elif intentional_failure and '/clips/' in r.request.url and '.webm' in r.request.url:
                    r.fulfill(status=404, body='Intentional missing video acceptance fixture')
                else:
                    r.continue_()
            ctx.route('**/*', route)
            def watch(page):
                sink = expected_failures if intentional_failure else errors
                page.on('pageerror', lambda e: sink.append(str(e)))
                page.on('console', lambda m: sink.append(m.text) if m.type == 'error' else None)
                page.on('response', lambda r: (expected_failures if intentional_failure else http).append([r.status, r.url]) if r.status >= 400 else None)
            ctx.on('page', watch)
            return ctx

        def page_in(ctx):
            page = ctx.new_page(); page.set_default_timeout(10000)
            page.goto(origin + '/', wait_until='networkidle')
            return page

        def open_recording(page, key, phone=False):
            outer = page.locator('#story-' + key + ' .story-details')
            outer.locator(':scope > summary').tap() if phone else outer.locator(':scope > summary').press('Enter')
            expect(outer).to_have_attribute('open', '')
            inner = outer.locator('.recorded-example')
            inner.locator(':scope > summary').tap() if phone else inner.locator(':scope > summary').press('Enter')
            expect(inner).to_have_attribute('open', '')
            return inner

        desktop = context(viewport={'width': 1440, 'height': 900})
        page = page_in(desktop)

        def media_http():
            verified = []
            for key in keys:
                meta = receipt['clips'][key]
                for field, ext in [('webm', 'webm'), ('poster', 'png')]:
                    version = meta[field]['sha256'][:12]
                    response = desktop.request.get(f'{origin}/clips/{key}.{ext}?v={version}')
                    assert response.status == 200
                    data = response.body()
                    assert len(data) == meta[field]['bytes'] and hashlib.sha256(data).hexdigest() == meta[field]['sha256']
                    assert response.headers['content-type'].startswith('video/webm' if ext == 'webm' else 'image/png')
                partial = desktop.request.get(f'{origin}/clips/{key}.webm?v={meta["webm"]["sha256"][:12]}', headers={'Range': 'bytes=0-127'})
                assert partial.status == 206 and len(partial.body()) == 128
                verified.append(key)
            return {'ten_assets_exact': verified, 'video_range_206': 5}
        check('ten accepted files and native video range requests', media_http)

        def playback(phone=False):
            ctx = context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True) if phone else desktop
            tab = page_in(ctx) if phone else page
            checked = []
            for key in keys:
                inner = open_recording(tab, key, phone)
                video = inner.locator('video'); expect(video).to_be_visible()
                tab.wait_for_function('(key)=>{const v=document.querySelector("#story-"+key+" video");return v?.readyState>=2}', arg=key)
                info = video.evaluate('(v)=>({width:v.videoWidth,height:v.videoHeight,duration:v.duration,src:v.currentSrc,paused:v.paused,auto:v.autoplay,loop:v.loop,muted:v.muted,inline:v.playsInline})')
                meta = receipt['clips'][key]
                assert [info['width'], info['height']] == [meta['width'], meta['height']]
                assert abs(info['duration'] - 3) < .02 and info['paused'] and not info['auto'] and not info['loop'] and info['muted'] and info['inline']
                assert info['src'].endswith('?v=' + meta['webm']['sha256'][:12])
                if phone:
                    video.scroll_into_view_if_needed(); box = video.bounding_box()
                    # Chrome's native phone play button is above the seek bar.
                    video.tap(position={'x': 26, 'y': box['height'] - 48})
                else:
                    video.focus(); video.press('Space')
                tab.wait_for_function('(key)=>document.querySelector("#story-"+key+" video")?.currentTime>.3', arg=key)
                inner.screenshot(path=str(out/f'{key}-{"phone" if phone else "desktop"}-recording.png'))
                toggle = inner.get_by_role('button', name='Show still image:', exact=False)
                toggle.tap() if phone else toggle.press('Enter')
                img = inner.locator('img'); expect(img).to_be_visible()
                tab.wait_for_function('(key)=>{const i=document.querySelector("#story-"+key+" .recorded-example img");return i?.complete&&i.naturalWidth>0}', arg=key)
                assert img.evaluate('(i)=>[i.naturalWidth,i.naturalHeight]') == [meta['width'], meta['height']]
                assert img.get_attribute('src').endswith('?v=' + meta['poster']['sha256'][:12])
                inner.screenshot(path=str(out/f'{key}-{"phone" if phone else "desktop"}-still.png'))
                toggle = inner.get_by_role('button', name='Watch recording:', exact=False)
                toggle.tap() if phone else toggle.press('Enter')
                expect(inner.locator('video')).to_be_visible()
                assert inner.locator('video').evaluate('(v)=>v.paused')
                inner.locator('summary').press('Escape')
                expect(inner).not_to_have_attribute('open', '')
                expect(inner.locator('summary')).to_be_focused()
                tab.locator('#story-' + key + ' .story-details > summary').press('Enter')
                checked.append({'key': key, 'media': info, 'native_play': True, 'still': True, 'escape_focus': True})
            assert tab.evaluate('document.documentElement.scrollWidth-innerWidth') <= 1
            if phone: ctx.close()
            return checked
        check('desktop keyboard playback, true stills, restart and Escape focus for all five', lambda: playback())
        check('390px touch playback and still toggles for all five without overflow', lambda: playback(True))

        def static_mode(phone=False, javascript=True, failure=False):
            ctx = context(intentional_failure=failure, viewport={'width': 390 if phone else 1440, 'height': 844 if phone else 900}, is_mobile=phone, has_touch=phone, java_script_enabled=javascript, reduced_motion='reduce' if javascript and not failure else 'no-preference')
            tab = page_in(ctx)
            for key in keys:
                inner = open_recording(tab, key, phone)
                expect(inner.locator('img')).to_be_visible()
                tab.wait_for_function('(key)=>{const i=document.querySelector("#story-"+key+" .recorded-example img");return i?.complete&&i.naturalWidth>0}', arg=key) if javascript else None
                assert inner.locator('video').count() == 0
                if failure: expect(inner.get_by_role('status')).to_contain_text('could not load')
                if javascript: assert inner.locator('img').evaluate('(i)=>i.naturalWidth') == receipt['clips'][key]['width']
                inner.screenshot(path=str(out/f'{key}-{"failure" if failure else "nojs" if not javascript else "reduced-phone" if phone else "reduced-desktop"}.png'))
            assert tab.locator('.recorded-example').count() == 5
            if not javascript: assert tab.locator('noscript a[href*="/clips/"]').count() == 10
            assert tab.evaluate('document.documentElement.scrollWidth-innerWidth') <= 1 if javascript else True
            ctx.close()
            return {'five_real_stills': True, 'intentional_failure': failure, 'javascript': javascript, 'phone': phone}
        check('reduced motion desktop uses five recorded stills', static_mode)
        check('reduced motion touch viewport uses five recorded stills', lambda: static_mode(True))
        check('all five missing videos automatically retain real stills and status', lambda: static_mode(failure=True))
        check('native disclosures and ten media links survive without JavaScript', lambda: static_mode(javascript=False))

        def preserved():
            assert page.locator('[data-story-art]').count() == 10
            assert page.locator('[data-story-art="coding"] .coding-passage').count() > 0
            assert page.locator('[data-story-art="analysis"] .analysis-path').count() == 1
            assert page.locator('[data-story-art="network"] .relationship-force-svg').count() == 1
            response = page.goto(origin + '/report', wait_until='networkidle'); assert response.status == 200
            for key in ['frequency', 'coverage', 'cooccurrence', 'hierarchy', 'accumulation']:
                assert page.locator('#sec-' + key).count() == 1
            page.screenshot(path=str(out/'report-preserved.png'))
            return {'all_ten_scenes': True, 'original_analysis_and_additional_network': True, 'five_report_sections': True}
        check('original illustrations and five report sections remain', preserved)
        check('normal console and HTTP responses are clean', lambda: (not errors and not http) or (_ for _ in ()).throw(AssertionError([errors, http])))
        browser.close()
    result = {'url': origin, 'results': results, 'console': errors, 'http': http, 'intentional_failure_messages': expected_failures, 'physical_device': False}
    (out/'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf8')
    passed = sum(r['pass'] for r in results); print(f'{passed}/{len(results)} checks passed')
    raise SystemExit(0 if passed == len(results) else 1)


if __name__ == '__main__':
    main()
