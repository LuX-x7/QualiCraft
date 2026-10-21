"""UX86-01 real-Chrome regression: drag left-to-right across a saved highlight."""
from pathlib import Path
import argparse, json
from playwright.sync_api import sync_playwright

p = argparse.ArgumentParser()
p.add_argument('--config', type=Path, required=True)
p.add_argument('--project-id', required=True)
p.add_argument('--out', type=Path, required=True)
a = p.parse_args()
cfg = json.loads(a.config.read_text(encoding='utf-8'))
assert cfg['origin'].startswith('http://127.0.0.1:'), 'QA must use a local disposable workspace'
a.out.mkdir(parents=True, exist_ok=True)
with sync_playwright() as pw:
    browser = pw.chromium.launch(channel='chrome')
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(cfg['origin'] + '/login')
    page.locator('#login-name').fill(cfg['username'])
    page.locator('#login-password').fill(cfg['password'])
    page.locator('form[data-auth="login"] button').click()
    page.locator('#start-project-select').select_option(a.project_id)
    page.locator('[data-action="start-open"]').click()
    page.locator('#reader').wait_for()
    document_id = page.evaluate('() => state.project.documents.find(d => state.project.annotations.some(a => a.document_id === d.id && a.start === 5 && a.end === 28))?.id')
    assert document_id, 'fixture project has no saved source range'
    page.locator('#reading-document').select_option(document_id)
    page.locator('#reader mark[data-coding-ids]').first.wait_for()
    assert page.locator('#reader mark[data-coding-ids]').count(), 'selected document must display the saved highlight'
    passage = page.locator('#reader .passage').first
    bounds = passage.evaluate('''el => {
      const nodes=[], walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
      while(walker.nextNode())nodes.push(walker.currentNode);
      function at(cp){for(const n of nodes){const text=Array.from(n.textContent);if(cp<=text.length)return[n,text.slice(0,cp).join('').length];cp-=text.length;}throw Error('offset outside passage');}
      function box(a,b){const r=document.createRange();r.setStart(...at(a));r.setEnd(...at(b));return r.getBoundingClientRect().toJSON();}
      return {start:box(5,6),end:box(27,28)};
    }''')
    start, end = bounds['start'], bounds['end']
    carets = page.evaluate('''q => { const el=document.querySelector('#reader .passage'); return [[q.start.x+.2,q.start.y+q.start.height/2],[q.end.right-.2,q.end.y+q.end.height/2]].map(([x,y])=>{const c=document.caretPositionFromPoint(x,y);const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n,base=0;while((n=w.nextNode())){if(n===c.offsetNode)return base+Array.from(n.textContent.slice(0,c.offset)).length;base+=Array.from(n.textContent).length;}return null;}); }''', bounds)
    # Same forward gesture that fails when its anchor begins inside an existing <mark>.
    page.mouse.move(start['x'] + 0.2, start['y'] + start['height']/2)
    page.mouse.down()
    page.mouse.move(end['right'] - 0.2, end['y'] + end['height']/2, steps=16)
    page.mouse.up()
    page.wait_for_timeout(200)
    page.screenshot(path=str(a.out / 'forward-reselect.png'))
    observed = page.evaluate('''() => ({
      popup:!!document.querySelector('#code-search'),
      range:state.selection && [state.selection.start,state.selection.end],
      selectedText:window.getSelection()?.toString() || ''
    })''')
    (a.out / 'result.json').write_text(json.dumps({'expected':[5,28],'caret_cp':carets,'observed':observed,'pageErrors':errors},indent=2),encoding='utf-8')
    assert observed['popup'], f'forward drag did not open candidate picker: {observed}'
    assert observed['range'] == [5,28], f'wrong source range: {observed}'
    count = page.evaluate('() => state.project.annotations.length')
    page.locator('#code-search').press('ArrowDown')
    assert page.locator('#code-search').get_attribute('aria-activedescendant'), 'keyboard candidate navigation did not activate an option'
    page.keyboard.press('Escape')
    assert page.locator('#code-search').count() == 0, 'Escape should close the picker'
    # Reverse selection remains supported and must resolve to the same source bounds.
    page.evaluate('() => window.getSelection()?.removeAllRanges()')
    page.mouse.move(end['right'] - 0.2, end['y'] + end['height']/2)
    page.mouse.down()
    page.mouse.move(start['x'] + 0.2, start['y'] + start['height']/2, steps=16)
    page.mouse.up()
    page.wait_for_timeout(200)
    reverse = page.evaluate("() => ({popup:!!document.querySelector('#code-search'), range:state.selection && [state.selection.start,state.selection.end]})")
    assert reverse == {'popup': True, 'range': [5,28]}, f'reverse drag changed behavior: {reverse}'
    assert page.evaluate('n => state.project.annotations.length === n', count), 'picker navigation changed saved annotations'
    assert not errors, f'uncaught browser errors: {errors}'
    browser.close()
print('UX86-01 forward/reverse reselect, keyboard navigation and no-write checks passed')
