"""Source-bound English Bologna teaching copy; original corpus remains unchanged."""
from pathlib import Path
import copy
import hashlib
import json
import sqlite3
import uuid
from . import core

ROOT = Path(__file__).resolve().parent.parent

def teaching_project():
    path = ROOT / 'demo-data/bologna-english.json'
    spec = json.loads(path.read_text(encoding='utf-8'))
    database = ROOT / 'demo-data/qualicraft.sqlite3'
    core.require(hashlib.sha256(database.read_bytes()).hexdigest() == spec['source_database_sha256'], 'Bologna translation source changed')
    with sqlite3.connect(database.resolve().as_uri()+'?mode=ro', uri=True) as db:
        original = json.loads(db.execute('SELECT data FROM projects WHERE id=?', (spec['source_project_id'],)).fetchone()[0])
    annotations = {a['id']: a for a in original['annotations']}
    source_docs = {d['id']: d for d in original['documents']}
    p = core.new_project('Bologna · English teaching copy')
    # Stable example IDs allow source binding between the website and workbench.
    identity = lambda key: uuid.uuid5(uuid.NAMESPACE_URL, 'qt-bologna-english-v1/'+key).hex
    p['id'] = identity('project')
    p['created_at'] = p['updated_at'] = '2026-10-20T00:00:00+00:00'
    p['provenance'] = spec['notice']+' Source: demo-data/qualicraft.sqlite3; source SHA-256 '+spec['source_database_sha256']+'. Translation: demo-data/bologna-english.json.'
    grouped = {}
    for entry in spec['passages']:
        a = annotations[entry['source_annotation_id']]
        d = source_docs[a['document_id']]
        core.require((a['document_id'], a['start'], a['end']) == (entry['source_document_id'], entry['source_start'], entry['source_end']), 'Translation source bounds changed')
        core.require(d['text'][a['start']:a['end']] == a['quote'] and hashlib.sha256(a['quote'].encode()).hexdigest() == entry['source_quote_sha256'], 'Translation source quote changed')
        grouped.setdefault(a['document_id'], []).append(entry)
    used = set()
    for did, entries in grouped.items():
        text = '\n\n'.join(x['english'] for x in entries)
        d = core.add_document(p, source_docs[did]['name'].replace('.txt', '-english-excerpts.txt'), text)
        d['id'] = identity(did);d['created_at'] = p['created_at']
        d['memo'] = spec['notice']+' Original document ID: '+did
        d['attributes'] = {'language':'en', 'source_language':'it', 'translation':'Teaching excerpts', 'source_document_id':did}
        # Rebuild reading state against the translated source identity.
        d['reading_state'] = core.empty_reading_state(d)
        offset = 0
        for entry in entries:
            a = annotations[entry['source_annotation_id']]
            assignments = [(a, 0, len(entry['english']))]
            for extra in entry['additional_codes']:
                original_a = annotations[extra['source_annotation_id']]
                core.require(original_a['document_id']==did and a['start']<=original_a['start']<original_a['end']<=a['end'], 'Nested translation source is not contained')
                quote=extra['english_quote'];core.require(entry['english'].count(quote)==1, 'Ambiguous translated quote')
                begin=entry['english'].index(quote);assignments.append((original_a,begin,begin+len(quote)))
            for source_a,start,end in assignments:
                used.add(source_a['code_id'])
                p['annotations'].append({'id':identity(source_a['id']), 'document_id':d['id'], 'code_id':source_a['code_id'], 'start':offset+start, 'end':offset+end, 'quote':text[offset+start:offset+end], 'memo':'Translated teaching association; original annotation '+source_a['id'], 'source':'manual', 'created_at':p['created_at']})
            offset += len(entry['english'])+2
    codes={c['id']:c for c in original['codes']}
    for cid in list(used):
        current=codes[cid]
        while current.get('parent_id'):
            used.add(current['parent_id']);current=codes[current['parent_id']]
    p['codes']=[copy.deepcopy(c) for c in original['codes'] if c['id'] in used]
    p['audit']=[]
    core.event(p,'english_teaching_copy',source_project_id=original['id'],translation_sha256=hashlib.sha256(path.read_bytes()).hexdigest())
    p['updated_at']=p['created_at']
    for index,item in enumerate(p['audit']):item.update(id=identity('audit/'+str(index)),time=p['created_at'])
    return core.validate_project(p)
