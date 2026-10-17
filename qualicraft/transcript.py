"""Read-only coded-source exports. No analysis, project mutation or network IO."""
from __future__ import annotations

import base64
import hashlib
import html
import io
import json
import re
import zipfile
from xml.etree import ElementTree as ET

from .core import now, paragraphs, require, validate_span


def canonical(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(',', ':'))


def freeze(project, document_ids=None, include_memos=False, role_labels='saved'):
    """Project only confirmed evidence; never copy config, suggestions or reading state.

    One fetched project is one frozen version. IDs are selected in project order;
    no viewport, search, code filter, pending suggestions or browser state enters.
    Roles are structural Group/Code, not inferred Theme/Category semantics.
    """
    docs = project['documents']
    if document_ids is not None:
        require(isinstance(document_ids, list) and bool(document_ids), 'Choose at least one document.')
        require(all(isinstance(i, str) for i in document_ids) and len(set(document_ids)) == len(document_ids), 'Document selection is invalid.')
        require(set(document_ids) <= {d['id'] for d in docs}, 'A selected document no longer exists.')
        docs = [d for d in docs if d['id'] in document_ids]
    require(type(include_memos) is bool, 'Memo selection is invalid.')
    require(role_labels in ('saved', 'theme-category-code'), 'Hierarchy label selection is invalid.')
    by = {c['id']: c for c in project['codes']}
    parents = {c.get('parent_id') for c in by.values()}
    paths = {}
    for c in by.values():
        path, seen, node = [], set(), c
        while node:
            require(node['id'] not in seen, 'The saved code tree contains a cycle.')
            seen.add(node['id'])
            item = {'id': node['id'], 'name': node['name'], 'parent_id': node.get('parent_id'),
                    'role': 'Group' if node['id'] in parents else 'Code'}
            if role_labels == 'theme-category-code' and node['id'] in parents:
                item['role'] = 'Category' if node.get('parent_id') else 'Theme'
            if include_memos: item['memo'] = node.get('memo', '')
            path.insert(0, item)
            parent = node.get('parent_id')
            require(parent is None or parent in by, 'A saved code parent is missing.')
            node = by.get(parent)
        paths[c['id']] = path
    labels = {i: ' > '.join(n['name'] for n in p) for i, p in paths.items()}
    collisions = {label for label in labels.values() if list(labels.values()).count(label) > 1}
    frozen = {'contract': 'qt-coded-transcript-v1', 'project_id': project['id'], 'project_name': project['name'],
              'schema_version': project['schema_version'], 'include_memos': include_memos, 'role_labels': role_labels,
              'scope': 'all' if document_ids is None else 'selected', 'documents': []}
    serial = 0
    for index, d in enumerate(docs, 1):
        text = d['text']
        require(not re.search('[\x00-\x08\x0b\x0c\x0e-\x1f\ud800-\udfff\ufffe\uffff]', text),
                'The source contains characters unsupported by HTML or Word. The source was not changed.')
        doc = {'id': d['id'], 'name': d['name'], 'text': text,
               'sha256': hashlib.sha256(text.encode()).hexdigest(), 'key': f'D{index}',
               'annotations': [], 'blocks': []}
        if include_memos: doc['memo'] = d.get('memo', '')
        for a in project['annotations']:
            if a['document_id'] != d['id']: continue
            require(a['code_id'] in by, 'An annotated code is missing.')
            validate_span(d, a['start'], a['end'], a['quote'])
            serial += 1
            item = {k: a.get(k, '') for k in ['id', 'document_id', 'code_id', 'start', 'end', 'quote', 'source', 'created_at']}
            item.update(key=f'A{serial}', path=paths[a['code_id']], label=labels[a['code_id']] +
                        (f" · {a['code_id']}" if labels[a['code_id']] in collisions else ''))
            if include_memos: item['memo'] = a.get('memo', '')
            doc['annotations'].append(item)
        # Keep every character, including leading/trailing/blank lines. Number only
        # the same nonempty source paragraphs used by Coding. Gaps belong to a block.
        paras = paragraphs(text)
        starts = [0] + [p['start'] for p in paras[1:]]
        if not text: starts = [0]
        for number, start in enumerate(starts, 1):
            end = starts[number] if number < len(starts) else len(text)
            active = [a for a in doc['annotations'] if a['start'] < end and a['end'] > start]
            bounds = sorted({start, end} | {max(start, a['start']) for a in active} | {min(end, a['end']) for a in active})
            tokens = [{'start': x, 'end': y, 'text': text[x:y],
                       'keys': [a['key'] for a in active if a['start'] < y and a['end'] > x]}
                      for x, y in zip(bounds, bounds[1:])]
            doc['blocks'].append({'number': number, 'start': start, 'end': end, 'tokens': tokens,
                                  'keys': [a['key'] for a in active]})
        frozen['documents'].append(doc)
    frozen['association_count'] = serial
    frozen['range_count'] = len({(d['id'], a['start'], a['end']) for d in frozen['documents'] for a in d['annotations']})
    def check_strings(value):
        if isinstance(value, str):
            require(not re.search('[\x00-\x08\x0b\x0c\x0e-\x1f\ud800-\udfff\ufffe\uffff]', value),
                    'Saved evidence contains characters unsupported by HTML or Word. The project was not changed.')
        elif isinstance(value, dict):
            for item in value.values(): check_strings(item)
        elif isinstance(value, list):
            for item in value: check_strings(item)
    check_strings(frozen)
    # Include the whole saved codebook in the version, even unused tree changes.
    version_data = {**frozen, 'codebook': list(paths.values())}
    frozen['version'] = hashlib.sha256(canonical(version_data).encode()).hexdigest()
    frozen['generated_at'] = now()
    return frozen


def escaped(value):
    # HTML parsers normalise literal CR; character references preserve source CPs.
    return html.escape(str(value), quote=True).replace('\r', '&#13;')


NOTICE = ('Hierarchy labels describe structure; research roles remain the researcher’s decision. '
          'Source labels record entry routes, not independent authorship. Pending suggestions and reading state are excluded. '
          'This is a frozen copy. Re-export after changing the source or codebook; existing files do not update.')

CSS = """
*{box-sizing:border-box}body{margin:0;color:#202a36;background:#fbfaf7;font:17px/1.7 Georgia,serif}
header,main{max-width:1320px;margin:auto;padding:24px 40px}header{padding-top:36px}h1{font-size:36px;line-height:1.2;margin:6px 0}h2{font-size:28px;line-height:1.3;margin:12px 0}p{margin:.5em 0}a{color:#345d7b;text-underline-offset:4px}
.meta,small,nav,summary{font:12px/1.6 system-ui;overflow-wrap:anywhere}.meta{color:#626c74}.notice{font:14px/1.6 system-ui;max-width:85ch}.export-meta{margin:16px 0;color:#59656d}.export-meta summary{cursor:pointer}.export-meta .meta{padding:12px 0}.doc{margin:20px 0 64px}nav{display:flex;gap:8px 18px;flex-wrap:wrap;margin-top:16px}
.row{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(260px,1fr);gap:64px;padding:22px 0;scroll-margin-top:16px}.source{min-width:0}.source-text{white-space:pre-wrap;overflow-wrap:anywhere;margin:8px 0;font:18px/1.85 Georgia,serif}
mark{background:#eee1b4;color:inherit;cursor:pointer;border-bottom:1px solid #a28d52}mark.active{background:#ffda79}a:focus-visible,mark:focus-visible{outline:3px solid #436b87;outline-offset:3px}
.tree{font:15px/1.5 system-ui;min-width:0;overflow-wrap:anywhere;padding-top:6px}.tree ul{list-style:none;padding:0;margin:0}.tree ul ul{padding-left:24px;position:relative;margin:10px 0 0}.tree ul ul:before{content:'';position:absolute;top:-6px;bottom:20px;left:5px;border-left:1px solid #8194a5;transform:rotate(.3deg)}.tree li{position:relative;margin:14px 0}.tree ul ul>li:before{content:'';position:absolute;left:-19px;top:15px;width:14px;border-top:1px solid #8194a5;transform:rotate(-1deg)}
.node-heading{display:flex;align-items:flex-start;gap:9px}.node-dot{width:7px;height:7px;flex:none;margin-top:10px;background:#4b607c;transform:rotate(-4deg)}.node-dot[data-role=Theme]{background:#914b3c;transform:rotate(45deg)}.node-dot[data-role=Category]{background:transparent;border:1px solid #66775c;border-radius:50%}.node-heading .role{display:block;font:10px/1.5 ui-monospace,monospace;text-transform:uppercase;letter-spacing:.12em;color:#57636e}.node-heading .node-name{font:17px/1.4 Georgia,serif}.node-heading[data-role=Theme] .node-name{font-weight:700;color:#793c30}.node-heading[data-role=Category] .node-name{color:#465d3f}
.association{margin:6px 0 10px 16px}.association>a{font:12px/1.5 ui-monospace,monospace}.association.active>a{background:#e8eef1}.identity{display:block;font:11px/1.6 ui-monospace,monospace;overflow-wrap:anywhere}.evidence-meta{color:#65717c;margin-top:3px}.evidence-meta summary{font-size:11px;cursor:pointer}.evidence-meta[open]{padding-bottom:10px}.refs{font:12px system-ui;display:flex;gap:14px;flex-wrap:wrap}.note{white-space:pre-wrap;font:14px/1.6 system-ui}.muted{color:#737b82;font-size:12px}.selected-path{min-height:21px;font:13px/1.5 system-ui;color:#49627a}.role-key{display:flex;gap:20px;font:11px ui-monospace,monospace;margin:12px 0;flex-wrap:wrap}.role-key span{display:flex;gap:6px;align-items:center}.role-key i{display:inline-block;width:7px;height:7px;background:#4b607c}.role-key .theme{background:#914b3c;transform:rotate(45deg)}.role-key .category{background:transparent;border:1px solid #66775c;border-radius:50%}
@media(max-width:700px){header,main{padding:20px}.row{grid-template-columns:minmax(0,1fr);gap:12px;padding:18px 0}.tree{padding:0 0 20px 12px}.source-text{font-size:18px}.node-heading .node-name{font-size:17px}h1{font-size:30px}}
@media print{body{background:white;font-size:11pt}header,main{padding:0;max-width:none}.row{grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:24pt}.source-text{font-size:11pt}.node-heading .node-name{font-size:10pt}.tree{font-size:9pt}nav,.refs{display:none}mark{print-color-adjust:exact;-webkit-print-color-adjust:exact}h2{break-after:avoid}}
"""

SCRIPT = '''
(()=>{
const tokens=[...document.querySelectorAll('mark[data-keys]')],items=[...document.querySelectorAll('[data-association]')];
function activate(keys){const set=new Set(keys);tokens.forEach(e=>e.classList.toggle('active',e.dataset.keys.split(' ').some(k=>set.has(k))));items.forEach(e=>e.classList.toggle('active',set.has(e.dataset.association)));const labels=[...new Set(items.filter(e=>set.has(e.dataset.association)).map(e=>e.dataset.label))];document.getElementById('selected-path').textContent=labels.join(' · ');}
tokens.forEach(e=>{const keys=e.dataset.keys.split(' ');e.addEventListener('mouseenter',()=>activate(keys));e.addEventListener('focus',()=>activate(keys));e.addEventListener('click',()=>{activate(keys);const row=e.closest('.row');const target=row.querySelector('[data-association="'+keys[0]+'"] a');if(target){target.focus();target.scrollIntoView({block:'nearest'});}});e.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();e.click();}if(event.key==='Escape')activate([]);});});
items.forEach(e=>{e.addEventListener('mouseenter',()=>activate([e.dataset.association]));e.addEventListener('focusin',()=>activate([e.dataset.association]));});
document.querySelectorAll('a[data-locate]').forEach(a=>a.addEventListener('click',event=>{const row=a.closest('.row'),key=a.dataset.locate,target=[...row.querySelectorAll('mark[data-keys]')].find(m=>m.dataset.keys.split(' ').includes(key));if(target){event.preventDefault();activate([key]);target.focus();target.scrollIntoView({block:'center'});}}));
})();
'''


def html_export(data):
    parts = []
    for d in data['documents']:
        anns = {a['key']: a for a in d['annotations']}
        rows = []
        for b in d['blocks']:
            source = ''.join(f'<mark tabindex="0" role="button" data-start="{t["start"]}" data-end="{t["end"]}" data-keys="{" ".join(t["keys"])}" aria-label="{escaped(" / ".join(anns[k]["label"] for k in t["keys"]))}">{escaped(t["text"])}</mark>' if t['keys'] else escaped(t['text']) for t in b['tokens'])
            roots = {}
            for key in b['keys']:
                a = anns[key]; level = roots
                for n in a['path']:
                    node = level.setdefault(n['id'], {'node': n, 'children': {}, 'items': []})
                    level = node['children']
                node['items'].append(a)
            def tree(nodes):
                out = []
                for node in nodes.values():
                    n = node['node']
                    entries = []
                    for a in node['items']:
                        entries.append(f'<div class="association" data-association="{a["key"]}" data-label="{escaped(a["label"])}"><a href="#{d["key"]}-p{b["number"]}" data-locate="{a["key"]}">{a["key"]} ↩</a><details class="evidence-meta"><summary>Range and record</summary><span class="identity">[{a["start"]}, {a["end"]})<br>Annotation {escaped(a["id"])}<br>Code {escaped(a["code_id"])}<br>Source {escaped(a["source"])} · {escaped(a["created_at"])}</span></details>{note(a)}</div>')
                    out.append(f'<li><div class="node-heading" data-role="{n["role"]}"><i class="node-dot" data-role="{n["role"]}" aria-hidden="true"></i><div><span class="role">{n["role"]}</span><span class="node-name">{escaped(n["name"])}</span></div></div>{note(n)}{"".join(entries)}{tree(node["children"]) if node["children"] else ""}</li>')

                return '<ul>'+''.join(out)+'</ul>'
            refs = ' '.join(f'<a href="#{d["key"]}-p{b["number"]}-tree">{k}</a>' for k in b['keys'])
            rows.append(f'<section class="row" id="{d["key"]}-p{b["number"]}"><div class="source"><small>¶ {b["number"]:02d}</small><div class="source-text">{source}</div><div class="refs">{refs}</div></div><aside class="tree" id="{d["key"]}-p{b["number"]}-tree" aria-label="Saved coding tree for paragraph {b["number"]}">{tree(roots) if roots else "<p class=muted>No saved codings</p>"}</aside></section>')
        parts.append(f'<article class="doc" id="{d["key"]}"><h2>{escaped(d["name"])}</h2><details class="export-meta"><summary>{len(d["annotations"])} saved associations · {len(d["text"])} characters · Source details</summary><p class="meta">Document {escaped(d["id"])}<br>SHA256 {d["sha256"]}</p></details>{note(d)}{"".join(rows)}</article>')

    digest = base64.b64encode(hashlib.sha256(SCRIPT.encode()).digest()).decode()
    policy = f"default-src 'none'; script-src 'sha256-{digest}'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; connect-src 'none'"
    nav = ''.join(f'<a href="#{d["key"]}">{escaped(d["name"])}</a>' for d in data['documents'])
    roles = data.get('role_labels', 'saved')
    role_note = ('Theme / Category / Code are display labels chosen by the exporter: grouped roots, inner groups and leaves. Saved ancestry is unchanged.' if roles == 'theme-category-code' else 'Group / Code are the saved structural labels. Theme / Category display labels can be chosen at export.')
    legend = '<div class="role-key"><span><i class="theme"></i>THEME</span><span><i class="category"></i>CATEGORY</span><span><i></i>CODE</span></div>' if roles == 'theme-category-code' else '<div class="role-key"><span>GROUP → SAVED CHILDREN → CODE</span></div>'
    output = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="{policy}"><title>Coded transcript</title><style>{CSS}</style></head><body><header><small>QT / SOURCE NOTEBOOK</small><h1>Coded transcript</h1><p>{escaped(data['project_name'])}</p><p class="meta">{len(data['documents'])} documents · {data['association_count']} saved associations · {data['range_count']} source ranges</p>{legend}<p class="notice">Read the source on the left. Follow its coding tree on the right.</p><details class="export-meta"><summary>Export details · {escaped(data['generated_at'][:10])} · {data['version'][:12]}</summary><p class="notice">{role_note} {NOTICE} Select a highlight or tree reference to trace the source. Repeated A labels identify the same saved association.</p><p class="meta">Generated {escaped(data['generated_at'])}<br>Project {escaped(data['project_id'])} · Schema v{data['schema_version']}<br>Evidence version SHA256 {data['version']}<br>Memos {"included" if data['include_memos'] else "excluded"}</p></details><nav aria-label="Documents">{nav}</nav><p class="selected-path" id="selected-path" role="status" aria-live="polite"></p></header><main>{''.join(parts) or '<p>No documents in this project.</p>'}</main><template id="frozen-evidence">{escaped(canonical(data))}</template><script>{SCRIPT}</script></body></html>'''
    return output.encode('utf-8')


def note(item):
    return f'<p class="note">Memo: {escaped(item["memo"])}</p>' if item.get('memo') else ''


W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
ET.register_namespace('w', W)


def word_tag(parent, name, attrs=None):
    return ET.SubElement(parent, f'{{{W}}}{name}', {f'{{{W}}}{k}': str(v) for k, v in (attrs or {}).items()})


def word_run(p, text, shade=False, size=None, bold=False, color=None):
    r = word_tag(p, 'r'); props = word_tag(r, 'rPr')
    if shade: word_tag(props, 'shd', {'fill': 'EEE0AC', 'val': 'clear'})
    if size: word_tag(props, 'sz', {'val': size})
    if bold: word_tag(props, 'b')
    if color: word_tag(props, 'color', {'val': color})
    for part in re.split('(\n|\t)', text):
        if part == '\n': word_tag(r, 'br')
        elif part == '\t': word_tag(r, 'tab')
        elif part:
            t = word_tag(r, 't'); t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve'); t.text = part


def word_plain(p):
    return ''.join(n.text or '' if n.tag == f'{{{W}}}t' else '\n' if n.tag == f'{{{W}}}br' else '\t' if n.tag == f'{{{W}}}tab' else '' for n in p.iter())


def docx_export(data):
    """Minimal standard OOXML, entirely editable, with no extra installation."""
    doc = ET.Element(f'{{{W}}}document'); body = word_tag(doc, 'body')
    def p(parent, text='', style=None, size=None, bold=False, keep=False):
        para = word_tag(parent, 'p'); props = word_tag(para, 'pPr')
        if style: word_tag(props, 'pStyle', {'val': style})
        if keep: word_tag(props, 'keepNext')
        word_tag(props, 'spacing', {'after': '65', 'line': '290', 'lineRule': 'auto'})
        word_run(para, text, size=size, bold=bold); return para
    p(body, 'Coded transcript', 'Title')
    p(body, data['project_name'], size=24)
    p(body, f"Full source · {len(data['documents'])} document(s) · {data['association_count']} associations · {data['range_count']} distinct source ranges", size=20)
    p(body, 'Read the source on the left. Follow its saved coding tree on the right.', size=21)
    p(body, ('Display labels chosen at export: Theme for grouped roots, Category for inner groups, Code for leaves.' if data.get('role_labels') == 'theme-category-code' else 'Group and Code preserve the saved structural labels.') + ' Memos ' + ('included.' if data['include_memos'] else 'excluded.') + ' Full record details follow the transcript.', size=18)
    if not data['documents']: p(body, 'No documents in this project.')
    for d in data['documents']:
        p(body, d['name'], 'Heading1')
        if d.get('memo'): p(body, 'Memo: '+d['memo'], size=20)
        table = word_tag(body, 'tbl'); props = word_tag(table, 'tblPr')
        word_tag(props, 'tblW', {'w': '10260', 'type': 'dxa'})
        word_tag(props, 'tblLayout', {'type': 'fixed'})
        borders = word_tag(props, 'tblBorders')
        for side in ['top', 'left', 'bottom', 'right', 'insideH', 'insideV']:
            word_tag(borders, side, {'val': 'nil'})
        margins = word_tag(props, 'tblCellMar')
        for side in ['top', 'left', 'bottom', 'right']: word_tag(margins, side, {'w': '110', 'type': 'dxa'})
        grid = word_tag(table, 'tblGrid')
        for width in [5860, 4400]: word_tag(grid, 'gridCol', {'w': width})
        header = word_tag(table, 'tr'); word_tag(word_tag(header, 'trPr'), 'tblHeader')
        for title, width in [('Full source text', 5860), ('Saved coding tree', 4400)]:
            cell = word_tag(header, 'tc'); cp = word_tag(cell, 'tcPr'); word_tag(cp, 'tcW', {'w': width, 'type': 'dxa'}); p(cell, title, size=18, bold=True)
            p(cell, d['name'] if width == 5860 else 'Continue by paragraph and A reference', size=15)
        anns = {a['key']: a for a in d['annotations']}
        for b in d['blocks']:
            row = word_tag(table, 'tr')  # row splitting allowed; long source/tree can continue
            left, right = [word_tag(row, 'tc') for _ in range(2)]
            for cell, width in [(left, 5860), (right, 4400)]:
                cp = word_tag(cell, 'tcPr'); word_tag(cp, 'tcW', {'w': width, 'type': 'dxa'}); word_tag(cp, 'vAlign', {'val': 'top'})
            p(left, f"¶ {b['number']:02d}  {' '.join(b['keys'])}", size=17)
            para = p(left); para.set(f'{{{W}}}rsidR', '00000001')
            for t in b['tokens']: word_run(para, t['text'], bool(t['keys']))
            if not b['keys']: p(right, 'No saved codings', size=19)
            roots = {}
            for key in b['keys']:
                a = anns[key]; level = roots
                for n in a['path']:
                    node = level.setdefault(n['id'], {'node': n, 'children': {}, 'items': []})
                    level = node['children']
                node['items'].append(a)
            def tree(nodes, depth=0):
                for node in nodes.values():
                    n = node['node']
                    role = n['role']
                    symbol = {'Theme': '◆', 'Category': '○', 'Code': '•', 'Group': '◇'}[role]
                    para = p(right, '', keep=True)
                    word_tag(para.find(f'{{{W}}}pPr'), 'ind', {'left': min(depth, 8)*220})
                    word_run(para, symbol+' '+role.upper()+'  ', size=16, bold=True, color={'Theme':'8F3222','Category':'53684B'}.get(role,'4B607C'))
                    word_run(para, n['name'], size=21, bold=role=='Theme')
                    if n.get('memo'): p(right, 'Memo: '+n['memo'], size=18)
                    for a in node['items']:
                        para=p(right, f"{a['key']}  [{a['start']}, {a['end']})", size=17)
                        word_tag(para.find(f'{{{W}}}pPr'), 'ind', {'left': min(depth, 8)*220+120})
                        if a.get('memo'): p(right, 'Memo: '+a['memo'], size=18)
                    tree(node['children'], depth+1)
            tree(roots)
        p(body)
    p(body, 'Record details', 'Heading1')
    p(body, f"Generated {data['generated_at']}\nProject {data['project_id']} · Schema v{data['schema_version']}\nEvidence SHA256 {data['version']}", size=16)
    p(body, NOTICE + ' This frozen file does not update or write external edits back to QT.', size=18)
    for d in data['documents']:
        p(body, d['name'], 'Heading1')
        p(body, f"Document {d['id']}\nSource SHA256 {d['sha256']}", size=16)
        for a in d['annotations']:
            p(body, f"{a['key']} · [{a['start']}, {a['end']}) · {a['label']}", size=17, bold=True, keep=True)
            p(body, f"Annotation {a['id']} · Code {a['code_id']}\nSource {a['source']} · {a['created_at']}", size=16)
    section = word_tag(body, 'sectPr')
    word_tag(section, 'pgSz', {'w': '11906', 'h': '16838'})
    word_tag(section, 'pgMar', {'top': '900', 'right': '823', 'bottom': '900', 'left': '823', 'header': '400', 'footer': '400'})
    styles = f'''<w:styles xmlns:w="{W}"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="22"/><w:color w:val="000000"/></w:rPr></w:rPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="36"/><w:color w:val="000000"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/></w:pPr><w:rPr><w:b/><w:sz w:val="28"/><w:color w:val="000000"/></w:rPr></w:style></w:styles>'''
    content_types = '''<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>'''
    relationships = '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">{}</Relationships>'
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as z:
        for name, payload in {'[Content_Types].xml': content_types,
                              '_rels/.rels': relationships.format('<Relationship Id="r1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'),
                              'word/_rels/document.xml.rels': relationships.format('<Relationship Id="r1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="r2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml" Target="../customXml/item1.xml"/>'),
                              'word/styles.xml': styles,
                              'word/document.xml': ET.tostring(doc, encoding='unicode').replace('\r', '&#13;'),
                              'customXml/item1.xml': '<evidence>'+escaped(canonical(data))+'</evidence>'}.items():
            z.writestr(name, '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'+payload)
    return buf.getvalue()
