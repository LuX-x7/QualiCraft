"""Explicit document removal; never infer identity from a display filename."""
import hashlib,json
from .core import event,find,require


def removal_info(project,document_id):
    doc=find(project['documents'],document_id)
    cases=[c['label'] or c['id'] for c in project.get('comparative_qca',{}).get('design',{}).get('cases',[]) if document_id in c['document_ids']]
    # Bind confirmation to the entire current project, including reading marks,
    # saved coding, renamed sources and calibration. Stale counts cannot approve.
    confirmation=hashlib.sha256(json.dumps(project,sort_keys=True,ensure_ascii=False).encode()).hexdigest()
    return {'document':{k:doc.get(k) for k in ('id','name','created_at','sha256')},
            'characters':len(doc['text']),
            'codings':sum(a['document_id']==document_id for a in project['annotations']),
            'suggestions':sum(s['document_id']==document_id for s in project['suggestions']),
            'has_note':bool(doc.get('memo')),
            'reading_marks':len(doc.get('reading_state',{}).get('marks',[])),
            'qca_cases':cases,'blocked':bool(cases),'confirmation':confirmation,
            'has_frozen_results':bool(project.get('research_report') or project.get('comparative_qca',{}).get('current'))}


def remove_document(project,body):
    info=removal_info(project,body.get('id'))
    require(body.get('confirmation')==info['confirmation'],
            'The project changed. Review the document and its counts again before removing it.')
    require(not info['blocked'],
            'This document is mapped to current Comparative QCA cases. Update the case mapping and calibration in Research report → Comparative QCA first; no document was removed.')
    id=info['document']['id']
    project['documents'][:]=[d for d in project['documents'] if d['id']!=id]
    project['annotations'][:]=[a for a in project['annotations'] if a['document_id']!=id]
    project['suggestions'][:]=[s for s in project['suggestions'] if s['document_id']!=id]
    event(project,'document_remove',document_id=id,name=info['document']['name'],
          sha256=info['document']['sha256'],codings=info['codings'],suggestions=info['suggestions'])
    return {'removed_id':id,'codings':info['codings'],'suggestions':info['suggestions']}
