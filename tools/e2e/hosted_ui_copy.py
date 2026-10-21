"""Validate registration pattern and private start using an owned loopback service."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', required=True, type=Path)
    parser.add_argument('--out', required=True, type=Path)
    parser.add_argument('--baseline-auth', type=Path)
    args = parser.parse_args()
    config = json.loads(args.config.read_text()); base = config['origin']
    assert urlsplit(base).hostname == '127.0.0.1'
    out = args.out; out.mkdir(parents=True, exist_ok=True)
    result = {'checks': [], 'console': [], 'http': [], 'outside': []}
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(channel='chrome', headless=True)
            context = browser.new_context(viewport={'width': 1440, 'height': 1000})

            def route(request):
                url = request.request.url
                if not url.startswith(base + '/'):
                    result['outside'].append(url); request.abort()
                elif args.baseline_auth and url == base + '/login':
                    request.fulfill(path=str(args.baseline_auth), content_type='text/html')
                else:
                    request.continue_()

            context.route('**/*', route)
            page = context.new_page()
            page.on('pageerror', lambda e: result['console'].append(str(e)))
            page.on('console', lambda m: result['console'].append(m.text) if m.type == 'error' else None)
            page.on('response', lambda r: result['http'].append([r.status, r.url]) if r.status >= 400 else None)
            page.goto(base + '/login')
            page.locator('details:has(form[data-auth="register"]) > summary').click()
            name = page.locator('#register-name')
            for value in ['ab', '_start', 'has space', 'bad/name', 'a' * 49]:
                name.fill(value)
                if len(value) > 48:
                    assert len(name.input_value()) == 48, 'Typing is capped at maxlength'
                    # Also check the pattern itself beyond the typing boundary.
                    name.evaluate('(el, value) => { el.value = value; }', value)
                valid = name.evaluate('el => el.checkValidity()')
                result['checks'].append({'name': 'reject ' + value[:16], 'pass': not valid})
            for value in ['abc', 'Bologna-review_1.test', 'A' + 'a' * 47]:
                name.fill(value)
                valid = name.evaluate('el => el.checkValidity()')
                result['checks'].append({'name': 'accept ' + value[:20], 'pass': valid})
            page.locator('#register-invite').fill(config['invite'])
            page.locator('#register-password').fill(config['password'])
            name.fill(config['username'])
            page.locator('form[data-auth="register"] button').click()
            expect(page.locator('[data-action="start-project"]')).to_be_visible()
            assert page.locator('#reader').count() == 0
            page.screenshot(path=str(out / 'registered-project-start.png'))
            result['checks'].append({'name': 'registration enters project start directly', 'pass': True})
            browser.close()
        result['pass'] = all(c['pass'] for c in result['checks']) and not any(result[k] for k in ['console', 'http', 'outside'])
        if not result['pass']:
            raise AssertionError('Registration validity or clean-console gate failed')
    finally:
        (out / 'results.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
        print(json.dumps(result), flush=True)


if __name__ == '__main__':
    main()
