"""Bind report CSV rows to limited, exact Bologna coding examples.

Read-only source lookup, not new analysis. Each selected positive row receives
at most one coding (or one overlapping pair); examples never replace counts.
"""
from __future__ import annotations
import csv
import json
from pathlib import Path
import sqlite3
import sys

REPO=Path(__file__).resolve().parents[2]
if str(REPO) not in sys.path: sys.path.insert(0,str(REPO))
from qualicraft.analyze import code_labels
from tools.site.build_evidence import build_evidence,sha,PROJECT


def build_report_evidence(project,database_sha256,manifest_raw,tables):
    labels=code_labels(project['codes'])
    ids={label:cid for cid,label in labels.items()}
    documents={d['name']:d for d in project['documents']}
    if len(documents)!=len(project['documents']):
        raise ValueError('Document display names are ambiguous')
    codes={c['id']:c for c in project['codes']}
    annotations=sorted(project['annotations'],key=lambda a:(len(a['quote']),a['document_id'],a['start'],a['id']))
    examples={};rows={};provenance=None
    def example(annotation):
        nonlocal provenance
        if annotation['id'] not in examples:
            record=build_evidence(project,database_sha256,manifest_raw,annotation['id'])
            provenance=record['provenance']
            examples[annotation['id']]=record['example']
        return annotation['id']
    def candidates(label,case=None,section=None):
        if label not in ids or (case is not None and case not in documents):
            raise ValueError('CSV identity has no unambiguous saved source')
        found=[a for a in annotations if a['code_id']==ids[label] and (case is None or a['document_id']==documents[case]['id'])]
        if section is not None:
            current=ids[label];seen=set()
            while codes[current].get('parent_id'):
                if current in seen: raise ValueError('Cyclic code path')
                seen.add(current);current=codes[current]['parent_id']
            if codes[current]['name']!=section: raise ValueError('CSV theme differs from the saved codebook')
        return found
    expected={'frequency':['code','count'],'coverage':['case','code','count'], 'cooccurrence':['code_a','code_b','count'], 'hierarchy':['section','subsection','count'], 'accumulation':['step','case','cumulative','new']}
    for kind,table in tables.items():
        if kind not in expected or table[0]!=expected[kind]: raise ValueError('Unknown CSV schema')
        rows[kind]=[]
        for row in table[1:]:
            chosen=[]
            if kind=='accumulation':
                if row[1] not in documents: raise ValueError('CSV document is missing')
                chosen=[a for a in annotations if a['document_id']==documents[row[1]]['id']][:1]
            elif int(row[-1])>0:
                if kind=='cooccurrence':
                    left,right=candidates(row[0]),candidates(row[1])
                    pair=next(((a,b) for a in left for b in right if a['document_id']==b['document_id'] and a['code_id']!=b['code_id'] and a['start']<b['end'] and b['start']<a['end']),None)
                    if pair: chosen=list(pair)
                elif kind=='frequency': chosen=candidates(row[0])[:1]
                elif kind=='coverage': chosen=candidates(row[1],case=row[0])[:1]
                else: chosen=candidates(row[1],section=row[0])[:1]
                if not chosen: raise ValueError('A positive CSV row has no matching saved coding example')
            rows[kind].append({'row':row,'annotation_ids':[example(a) for a in chosen]})
    if provenance is None: raise ValueError('No verifiable source examples')
    provenance={**provenance,'command':'python tools/report/build_evidence.py'}
    return {'schema_version':1,'provenance':provenance,'rows':rows,'examples':examples}


def main():
    database=REPO/'demo-data/qualicraft.sqlite3'
    with sqlite3.connect(database.as_uri()+'?mode=ro',uri=True) as conn:
        project=json.loads(conn.execute('SELECT data FROM projects WHERE id=?',(PROJECT,)).fetchone()[0])
    if project['name']!='Bologna · What is data?': raise ValueError('Only Bologna CC0 is permitted')
    root=REPO/'website/public/report';raw=(root/'manifest.json').read_bytes();manifest=json.loads(raw)
    for f in manifest['files']:
        p=(root/f['path']).resolve()
        if not p.is_relative_to(root.resolve()): raise ValueError('Asset outside report directory')
        data=p.read_bytes()
        if sha(data)!=f['sha256'] or len(data)!=f['bytes']: raise ValueError('Stale report asset')
    tables={f['kind']:list(csv.reader((root/f['csv']).open(encoding='utf-8'))) for f in manifest['figures'] if not f.get('error')}
    result=build_report_evidence(project,sha(database.read_bytes()),raw,tables)
    out=REPO/'website/lib/report/bologna-evidence.json'
    out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('VERIFIED',len(result['examples']),'exact coding examples;',sum(len(r) for r in result['rows'].values()),'unchanged CSV rows')
    print('MANIFEST_SHA256',result['provenance']['manifest_sha256'])
    print('WROTE',out.relative_to(REPO))

if __name__=='__main__': main()
