"""UX86-02: source-bound short-document Keep/Resume on isolated Bologna copies."""
import argparse
import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from qualicraft import core
from qualicraft.examples import teaching_project
from qualicraft.server import bologna_example
from recovery_boundaries import Service, backup_manifest
from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', required=True, type=Path)
    parser.add_argument('--baseline-app', type=Path, help='Optional old app.js served only in the owned test context')
    args = parser.parse_args()
    out = args.out; out.mkdir(parents=True, exist_ok=True)
    shots = out / 'screenshots'; shots.mkdir(exist_ok=True)
    seed = teaching_project(); seed['id'] = core.uid(); seed['name'] = 'Bologna · short-document position review'
    long_doc = core.add_document(seed, 'Bologna · original long source', bologna_example()['documents'][0]['text'])
    service = Service(out / 'owned-service', seed)
    result = {'checks': [], 'console': [], 'http': [], 'outside': [], 'timings': [], 'baseline_app': bool(args.baseline_app)}

    def save():
        (out / 'results.json').write_text(json.dumps(result, indent=2), encoding='utf-8')

    def check(name, fn):
        started = time.perf_counter()
        try:
            evidence = fn()
            result['checks'].append({'name': name, 'pass': True, 'evidence': evidence})
            print('PASS', name, flush=True)
        except Exception as error:
            result['checks'].append({'name': name, 'pass': False, 'error': str(error)})
            print('FAIL', name, str(error), flush=True)
        result['timings'].append({'name': name, 'seconds': round(time.perf_counter() - started, 3)})
        save()

    try:
        before = service.json('/projects/' + seed['id'])
        backups = backup_manifest(service.folder, seed['id'])
        with sync_playwright() as pw:
            browser = pw.chromium.launch(channel='chrome', headless=True)
            for width, height, method in [(1440, 1000, 'keyboard'), (1024, 768, 'mouse'), (390, 844, 'touch-emulation')]:
                context = browser.new_context(viewport={'width': width, 'height': height}, has_touch=width == 390, is_mobile=width == 390)

                def route(request):
                    url = request.request.url
                    if not url.startswith(service.base + '/'):
                        result['outside'].append(url); request.abort()
                    elif args.baseline_app and url.split('?')[0].endswith('/app.js'):
                        request.fulfill(path=str(args.baseline_app), content_type='text/javascript')
                    else:
                        request.continue_()

                context.route('**/*', route)
                page = context.new_page(); page.set_default_timeout(12000)
                page.on('pageerror', lambda e: result['console'].append(str(e)))
                page.on('console', lambda m: result['console'].append(m.text) if m.type == 'error' else None)
                page.on('response', lambda r: result['http'].append([r.status, r.url]) if r.status >= 400 else None)
                page.goto(service.base + '/w/?lang=en', wait_until='networkidle')
                page.locator('#start-project-select').select_option(seed['id'])
                page.locator('[data-action="start-open"]').click()
                expect(page.locator('#reading-document')).to_be_visible()
                first = seed['documents'][0]
                page.locator('#reading-document').select_option(first['id'])
                expected_start = first['text'].index('\n\n') + 2
                prefix = str(width) + '-' + method

                def activate(selector):
                    element = page.locator(selector).first
                    if method == 'keyboard':
                        element.focus(); page.keyboard.press('Enter')
                    elif method == 'touch-emulation':
                        element.tap()
                    else:
                        element.click()

                def position(index=2):
                    expect(page.locator('#reading-position')).to_have_text(f'Paragraph {index} / 3')
                    actual = page.evaluate('readReadingPosition(state.project,doc())?.start')
                    assert actual == (expected_start if index == 2 else 0), actual
                    return {'paragraph': index, 'saved_start': actual, 'focus': page.evaluate('document.activeElement?.className')}

                def jump():
                    activate('[data-action="reading-overview"]')
                    activate('#overview-paragraph-list summary')
                    page.locator('#overview-paragraph-number').fill('2')
                    activate('[data-action="overview-find-paragraph"]')
                    activate('[data-action="overview-jump-paragraph"]')
                    expect(page.locator('#reader .paragraph').nth(1)).to_be_focused()

                def keep_case():
                    jump()
                    assert page.evaluate('readReadingPosition(state.project,doc()).start') == 0, 'Preview must not replace Resume'
                    activate('[data-action="overview-keep"]')
                    page.wait_for_timeout(250)  # Allow native scroll callbacks after the control closes.
                    evidence = position()
                    expect(page.locator('#reader .paragraph').nth(1)).to_be_focused()
                    page.screenshot(path=str(shots / (prefix + '-keep.png')))
                    return evidence

                check(prefix + ' Keep paragraph two without changing preview semantics', keep_case)
                check(prefix + ' Resume after Keep', lambda: (activate('[data-action="reading-resume"]'), page.wait_for_timeout(180), position())[-1])

                def refresh_case():
                    page.reload(wait_until='networkidle'); evidence = position()
                    page.screenshot(path=str(shots / (prefix + '-refresh.png')))
                    return evidence

                check(prefix + ' refresh restores paragraph two', refresh_case)

                def switch_case():
                    page.locator('#reading-document').select_option(seed['documents'][1]['id'])
                    page.locator('#reading-document').select_option(first['id'])
                    page.wait_for_timeout(180)
                    return position()

                check(prefix + ' document switch and return', switch_case)

                def filter_case():
                    search = page.locator('#search'); search.focus(); search.fill('QT_NO_SUCH_BOLOGNA_PASSAGE')
                    expect(page.locator('#reader .paragraph')).to_have_count(0)
                    assert page.evaluate('readReadingPosition(state.project,doc()).start') == expected_start
                    search.fill(''); search.press('Tab'); activate('[data-action="reading-resume"]')
                    evidence = position()
                    page.screenshot(path=str(shots / (prefix + '-filter-resume.png')))
                    return evidence

                check(prefix + ' no-match search, clear and Resume', filter_case)

                def code_filter_case():
                    # Existing explicit filter action; clicking a tree node alone is not a filter.
                    code = next(a['code_id'] for a in seed['annotations'] if a['document_id'] == first['id'])
                    by_id = {c['id']: c for c in seed['codes']}
                    while by_id[code].get('parent_id'):
                        code = by_id[code]['parent_id']
                    if width <= 1000:
                        activate('[data-action="coding-codebook"]')
                    page.locator(f'[data-action="inspect-code"][data-id="{code}"]').first.click()
                    activate('[data-action="inspect-filter"]')
                    if width <= 1000:
                        activate('[data-action="inspect-here"]')
                    activate('[data-action="clear-filter"]')
                    activate('[data-action="reading-resume"]')
                    return position()

                check(prefix + ' code filter, clear and Resume', code_filter_case)

                def scroll_case():
                    def wait_saved(predicate):
                        deadline = time.monotonic() + 3
                        while time.monotonic() < deadline:
                            if predicate(page.evaluate('readReadingPosition(state.project,doc()).start')):
                                return
                            time.sleep(.04)
                        raise AssertionError('Reading position did not settle: ' + page.locator('#reading-position').inner_text())
                    page.locator('#reading-document').select_option(long_doc['id'])
                    paragraph = page.locator('#reader .paragraph').first
                    paragraph.focus(); page.keyboard.press('End')
                    wait_saved(lambda value: value > 0)
                    advanced = page.evaluate('readReadingPosition(state.project,doc()).start')
                    assert advanced > 0, {'phase': 'End', 'saved': advanced, 'visible': page.locator('#reading-position').inner_text()}
                    page.keyboard.press('Home')
                    wait_saved(lambda value: value == 0)
                    home = page.evaluate('readReadingPosition(state.project,doc()).start')
                    assert home == 0, {'phase': 'Home', 'saved': home, 'visible': page.locator('#reading-position').inner_text(), 'geometry': page.evaluate('({scroll:readingScrollContainer()?.scrollTop,window:scrollY,target:readingMounted.navigationTarget})')}
                    page.locator('#reading-document').select_option(first['id'])
                    evidence = position()
                    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Page overflow'
                    return {'long_document_advances_and_returns': True, **evidence}

                check(prefix + ' genuine keyboard reading remains live', scroll_case)
                context.close()
            browser.close()
        unchanged = service.json('/projects/' + seed['id']) == before
        snapshot_same = backup_manifest(service.folder, seed['id']) == backups
        check('Navigation leaves project, audit and recovery points unchanged', lambda: {'unchanged': unchanged, 'snapshots_unchanged': snapshot_same} if unchanged and snapshot_same else (_ for _ in ()).throw(AssertionError('Unexpected research edit')))
        result['completed'] = all(c['pass'] for c in result['checks']) and not any(result[k] for k in ['console', 'http', 'outside'])
        save()
        print(json.dumps({k: result[k] for k in ['completed', 'console', 'http', 'outside']}), flush=True)
        if not result['completed']:
            sys.exit(1)
    finally:
        service.stop()


if __name__ == '__main__':
    main()
