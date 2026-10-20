"""Extract one verified Bologna coding for the site's explanatory illustration.

This reads the CC0 demo database in read-only mode. It adds no analysis, edits
no saved record and never derives a quotation from a graph label or count CSV.
"""
from __future__ import annotations
import hashlib
import json
import sqlite3
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
import sys
if str(REPO) not in sys.path: sys.path.insert(0,str(REPO))
ANNOTATION = '1777fabb3fc0461b88e972664b078e03'
PROJECT = 'a71a0b538c024c3ab23fb4286cfe93e2'


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def build_evidence(project, database_sha256, manifest_raw, annotation_id=ANNOTATION):
    manifest = json.loads(manifest_raw)
    expected = manifest['project']
    for key, records in [('documents','documents'),('codes','codes'),('codings','annotations')]:
        if expected[key] != len(project[records]):
            raise ValueError('The evidence project does not match the report manifest')
    annotation = next((a for a in project['annotations'] if a['id']==annotation_id), None)
    if not annotation:
        raise ValueError('The saved example annotation is missing')
    document = next((d for d in project['documents'] if d['id']==annotation['document_id']), None)
    start, end = annotation['start'], annotation['end']
    if (not document or not isinstance(start,int) or not isinstance(end,int)
            or not 0 <= start < end <= len(document['text'])
            or document['text'][start:end] != annotation['quote']):
        raise ValueError('The example quote does not match its saved source range')
    by_id = {c['id']:c for c in project['codes']}
    code_path, seen, current = [], set(), annotation['code_id']
    while current:
        if current in seen or current not in by_id:
            raise ValueError('The example coding path is incomplete or cyclic')
        seen.add(current)
        code = by_id[current]
        code_path.append({'id':code['id'],'name':code['name'],'definition':code.get('definition','')})
        current = code.get('parent_id')
    project_raw = json.dumps(project,ensure_ascii=False,sort_keys=True).encode()
    return {'schema_version':1,'provenance':{
        'command':'python tools/site/build_evidence.py',
        'source':'demo-data/qualicraft.sqlite3','database_sha256':database_sha256,
        'project_id':project['id'],'project_sha256':sha(project_raw),
        'manifest_sha256':sha(manifest_raw),
    },'example':{
        'annotation_id':annotation['id'],'document_id':document['id'],
        'document_name':document['name'],'document_sha256':sha(document['text'].encode()),
        'start':start,'end':end,'quote':annotation['quote'],
        'source':annotation.get('source',''),'code_id':annotation['code_id'],
        'code_path':list(reversed(code_path)),
    }}


def main():
    database = REPO/'demo-data/qualicraft.sqlite3'
    from qualicraft.examples import teaching_project
    project = teaching_project()
    report_root = REPO/'website/public/report'
    manifest_raw = (report_root/'manifest.json').read_bytes()
    for item in json.loads(manifest_raw)['files']:
        target = (report_root/item['path']).resolve()
        if not target.is_relative_to(report_root.resolve()):
            raise ValueError('A manifest asset is outside the report directory')
        raw = target.read_bytes()
        if len(raw) != item['bytes'] or sha(raw) != item['sha256']:
            raise ValueError('Report export bytes do not match the manifest')
    result = build_evidence(project,sha(database.read_bytes()),manifest_raw,project['annotations'][0]['id'])
    out = REPO/'website/lib/site/bologna-evidence.json'
    out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('VERIFIED',result['example']['document_name'],result['example']['annotation_id'],
          f"[{result['example']['start']}, {result['example']['end']})")
    print('MANIFEST_SHA256',result['provenance']['manifest_sha256'])
    print('WROTE',out.relative_to(REPO))
    return 0

if __name__=='__main__':
    raise SystemExit(main())
