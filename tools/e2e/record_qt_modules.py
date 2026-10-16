"""Record real completed QT workflows on a disposable, loopback Bologna copy.

Raw captures and traces must stay outside the repository. This does not alter
DOM/CSS, workbench code, source data, statistics or plot rendering. Export is a
literal crop inside the current native dialog, so no backdrop enters the video.
Only reviewed/encoded production media may be copied into website/public/clips.
"""
from pathlib import Path
from urllib.parse import urlsplit
import argparse
import csv
import hashlib
import io
import json
import math
import sqlite3
import subprocess
import time
import zipfile
from playwright.sync_api import sync_playwright, expect


def digest(data):
    return hashlib.sha256(data).hexdigest()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--url', required=True)
    ap.add_argument('--out', type=Path, required=True)
    ap.add_argument('--ffmpeg', required=True)
    a = ap.parse_args(); base = a.url.rstrip('/')
    assert urlsplit(base).hostname in ('127.0.0.1', 'localhost') and urlsplit(base).scheme == 'http'
    root = a.out.resolve(); root.mkdir(parents=True, exist_ok=True)
    for directory in ['inputs','downloads','captures','media','screenshots']: (root/directory).mkdir(exist_ok=True)
    repo = Path(__file__).resolve().parents[2]
    source_path = repo/'demo-data/qualicraft.sqlite3'; source_hash = digest(source_path.read_bytes())
    pid = 'a71a0b538c024c3ab23fb4286cfe93e2'
    with sqlite3.connect(source_path.resolve().as_uri()+'?mode=ro', uri=True) as db:
        source = json.loads(db.execute('select data from projects where id=?',(pid,)).fetchone()[0])
    assert len(source['documents']) == 19 and len(source['codes']) == 317 and len(source['annotations']) == 874
    file = root/'inputs/interview02.txt'; file.write_text(source['documents'][0]['text'],encoding='utf8')
    receipt = {'product_commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip(),
               'origin':base,'source_sha256':source_hash,'viewport':[1440,1000],'clips':{},'downloads':[],'console':[],'http':[]}
    with sync_playwright() as pw:
        browser = pw.chromium.launch(channel='chrome',headless=True)
        ctx = browser.new_context(viewport={'width':1440,'height':1000},device_scale_factor=1,locale='en-US',accept_downloads=True)
        ctx.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base+'/') else r.abort())
        page = ctx.new_page(); page.set_default_timeout(12000)
        page.on('pageerror',lambda e:receipt['console'].append(str(e)))
        page.on('console',lambda m:receipt['console'].append(m.text) if m.type=='error' else None)
        page.on('response',lambda r:receipt['http'].append([r.status,r.url]) if r.status>=400 else None)
        boot = ctx.request.get(base+'/w/api/bootstrap').json(); headers={'X-QualiCraft-Token':boot['token']}
        assert not boot['config']['has_key']
        original_url = base+'/w/api/projects/'+pid
        original = ctx.request.get(original_url,headers=headers).json()
        assert original == source
        page.goto(base+'/w?lang=en',wait_until='networkidle')
        page.locator('[data-action="bologna-project"]').click(); expect(page.locator('#reading-document')).to_be_visible()
        copy_id = page.locator('#project-select').input_value(); assert copy_id != pid
        url = base+'/w/api/projects/'+copy_id
        def project(): return ctx.request.get(url,headers=headers).json()
        if page.locator('.quick-guide').count(): page.locator('.quick-guide [data-action="guide-dismiss"]').last.click()

        def observe(clip):
            return page.evaluate('''rect=>{
                const box=rect||{x:0,y:0,width:innerWidth,height:innerHeight};
                const inside=r=>r.width>0&&r.height>0&&r.right>box.x&&r.left<box.x+box.width&&r.bottom>box.y&&r.top<box.y+box.height;
                const texts=[],walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
                while(walker.nextNode()){
                    const node=walker.currentNode,el=node.parentElement;if(!el||['SCRIPT','STYLE','OPTION'].includes(el.tagName))continue;
                    const s=getComputedStyle(el);if(s.visibility==='hidden'||s.display==='none')continue;
                    const range=document.createRange();range.selectNodeContents(node);
                    if([...range.getClientRects()].some(inside))texts.push(node.textContent);
                }
                const text=texts.join(' '),dialogs=[...document.querySelectorAll('dialog[open]')];
                const d=dialogs[0],r=d?.getBoundingClientRect();
                const cropInsideDialog=Boolean(rect&&dialogs.length===1&&box.x>=r.left&&box.y>=r.top&&box.x+box.width<=r.right&&box.y+box.height<=r.bottom&&getComputedStyle(d).opacity==='1');
                return {url:location.href,title:document.title,text,han:[...new Set(text.match(/\\p{Script=Han}/gu)||[])],blocked:/publication|put in a paper|期刊/i.test(text),dialogs:dialogs.length,cropInsideDialog,dialogBounds:r?{x:r.x,y:r.y,width:r.width,height:r.height}:null,viewport:[innerWidth,innerHeight]};
            }''',clip)

        def record(key, action=None, clip=None):
            print('RECORD',key,flush=True)
            work=root/'captures'/key;work.mkdir(exist_ok=True)
            before=observe(clip)
            def valid(state):
                assert not state['han'] and not state['blocked'],state
                assert state['cropInsideDialog'] if clip else state['dialogs']==0,state
            valid(before);frames=[];start=time.perf_counter();acted=False
            while time.perf_counter()-start<3.2:
                elapsed=(time.perf_counter()-start)*1000
                if action and not acted and elapsed>=1100: action();acted=True
                timestamp=(time.perf_counter()-start)*1000
                data=page.screenshot(type='png',**({'clip':clip} if clip else {}));name=f'frame-{len(frames):04d}.png';(work/name).write_bytes(data)
                frames.append({'file':name,'capturedAtMs':timestamp,'sha256':digest(data)})
                page.wait_for_timeout(25)
            duration=(time.perf_counter()-start)*1000;after=observe(clip);valid(after)
            trace={'before':before,'after':after,'durationMs':duration,'clip':clip,'frames':frames,'captureSurface':'literal dialog content crop' if clip else 'unmodified full workbench viewport'}
            (work/'trace.json').write_text(json.dumps(trace,ensure_ascii=False,indent=2),encoding='utf8')
            lines=['ffconcat version 1.0']
            for i,frame in enumerate(frames):
                end=frames[i+1]['capturedAtMs'] if i+1<len(frames) else duration
                assert end>frame['capturedAtMs']
                lines += [f"file '{frame['file']}'",f"duration {(end-frame['capturedAtMs'])/1000:.9f}"]
            lines += [f"file '{frames[-1]['file']}'"]
            concat=work/'frames.ffconcat';concat.write_text('\n'.join(lines)+'\n',encoding='utf8')
            dest=root/'media'/(key+'.webm');poster=dest.with_suffix('.png')
            commands=[[a.ffmpeg,'-hide_banner','-loglevel','error','-y','-safe','1','-f','concat','-i',str(concat),'-vf','fps=12,trim=duration=3,setpts=PTS-STARTPTS,pad=ceil(iw/2)*2:ceil(ih/2)*2','-an','-pix_fmt','yuv420p','-r','12','-c:v','libvpx-vp9','-lossless','1',str(dest)],
                      [a.ffmpeg,'-hide_banner','-loglevel','error','-y','-i',str(dest),'-frames:v','1',str(poster)]]
            for command in commands: subprocess.run(command,check=True)
            assert dest.stat().st_size<1_500_000
            from PIL import Image
            width,height=Image.open(poster).size
            receipt['clips'][key]={'width':width,'height':height,'source_frames':len(frames),'source_duration_ms':duration,'crop':clip,'commands':commands,'webm':{'bytes':dest.stat().st_size,'sha256':digest(dest.read_bytes())},'poster':{'bytes':poster.stat().st_size,'sha256':digest(poster.read_bytes())}}
            page.screenshot(path=str(root/'screenshots'/(key+'-source.png')))
            (root/'recording-receipt.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2),encoding='utf8')
            print('DONE',key,receipt['clips'][key]['webm']['bytes'],'bytes',flush=True)

        page.locator('.project-strip [data-action="import"]').click();page.locator('#import-file').set_input_files(file)
        page.locator('#document-name').fill('interview02 · QT recording');page.locator('[data-action="save-document"]').click()
        expect(page.locator('.import-receipt')).to_be_visible();expect(page.locator('.reader-heading')).to_be_focused()
        imported=project()['documents'][-1];assert imported['text']==source['documents'][0]['text']
        record('import',lambda:page.locator('.reading-details>summary').click())
        for name in ['keeping working materials after the end of the project']:
            passage=page.locator('.passage').first;passage.scroll_into_view_if_needed();box=passage.bounding_box()
            page.mouse.move(box['x']+12,box['y']+10);page.mouse.down();page.mouse.move(box['x']+min(252,box['width']-12),box['y']+10,steps=18);page.mouse.up()
            expect(page.locator('#code-search')).to_be_visible();page.locator('#code-search').fill(name);page.locator('#code-search').press('Enter');expect(page.locator('#code-popup')).not_to_be_visible()
        coded=project();new=coded['annotations'][-1:]
        assert all(a['document_id']==imported['id'] and a['quote']==imported['text'][a['start']:a['end']] for a in new)
        assert len(coded['annotations'])==875
        page.mouse.move(1430,30);record('coding',lambda:page.locator('.pill').first.hover())
        page.get_by_role('button',name='Insights',exact=True).click();expect(page.locator('#network-select')).to_be_enabled()
        page.locator('#network-select').select_option('code:'+new[0]['code_id']);page.locator(f'[data-action="net-evidence"][data-id="{new[0]["id"]}"]').click()
        expect(page.locator('.network-detail blockquote')).to_have_text(new[0]['quote'])
        if page.locator('#network-passages').get_attribute('aria-expanded')!='true':page.locator('#network-passages').click()
        expect(page.locator('#network-passages')).to_have_attribute('aria-expanded','true')
        assert page.locator('#network-stage .net-node[data-id^="p:"]').count()>0
        page.wait_for_function('()=>NET.alpha<.02',timeout=30000)
        record('analysis',lambda:page.locator('[data-action="net-locate"]').hover())
        page.get_by_role('button',name='Figures',exact=True).click();page.locator('[data-plot="level"]').select_option('theme')
        page.wait_for_function('()=>{const e=document.querySelector("#plot-preview");return e&&e.complete&&e.naturalWidth>0&&!e.classList.contains("loading")}',timeout=120000)
        with page.expect_download(timeout=120000) as event:page.locator('[data-action="plot-export"]').click()
        plot_file=root/'downloads/qt-theme-frequency.zip';event.value.save_as(plot_file)
        with zipfile.ZipFile(plot_file) as z:assert z.testzip() is None and {'.svg','.pdf','.png','.csv','.py'}=={Path(n).suffix for n in z.namelist()}
        page.mouse.move(1430,30);record('plotting')
        page.locator('[data-action="export"]').click()
        for fmt in ['csv','matrix','methods','json']:
            with page.expect_download() as event:page.locator(f'[data-action="download"][data-format="{fmt}"]').click()
            download=event.value;target=root/'downloads'/download.suggested_filename;download.save_as(target);payload=target.read_bytes()
            api=ctx.request.get(url+'/export?format='+fmt,headers=headers);assert api.ok and api.body()==payload
            expect(page.locator('[data-export-filename]')).to_have_text(download.suggested_filename)
            receipt['downloads'].append({'format':fmt,'filename':download.suggested_filename,'bytes':len(payload),'sha256':digest(payload)})
        page.locator('.io-export-preview>summary').click();box=page.locator('#dialog').bounding_box()
        # Round inward and use even dimensions; every output pixel is from inside
        # this actual dialog. Never hide/remove its real backdrop in the page.
        x,y=math.ceil(box['x'])+2,math.ceil(box['y'])+2
        w=2*math.floor((box['x']+box['width']-2-x)/2);h=2*math.floor((box['y']+box['height']-2-y)/2)
        record('export',lambda:page.locator('.io-export-preview>summary').focus(),{'x':x,'y':y,'width':w,'height':h})
        assert ctx.request.get(original_url,headers=headers).json()==original
        assert project()==json.loads((root/'downloads/qualicraft-project.json').read_text())
        assert digest(source_path.read_bytes())==source_hash and not receipt['console'] and not receipt['http']
        receipt.update({'project_id':copy_id,'imported_document_id':imported['id'],'new_codings':new,'original_seed_unchanged':True,'source_unchanged':True,'all_downloads_equal_API':True,'project_counts':[20,317,875]})
        (root/'recording-receipt.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2),encoding='utf8');browser.close()
    print('PASS five real QT results; exact Bologna input/codings/downloads; no product changes',flush=True)


if __name__=='__main__':main()
