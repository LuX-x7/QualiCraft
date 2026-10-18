"""Decisions for the interactive document importer, inside Store.change's lock.

A reply raises before mutation so a warning/retry cannot rotate snapshots or
update project timestamps. Internal corpus importers retain add_document's API.
"""
import base64
import hashlib
import json
from .core import add_document, find, read_docx, require, string


class ImportReply(Exception):
    def __init__(self, payload):
        self.payload = payload
        super().__init__('Document import needs no write')


def read_document(body):
    text = body.get('text')
    if body.get('docx_base64'):
        try:
            text = read_docx(base64.b64decode(body['docx_base64'], validate=True))
        except Exception:
            raise ValueError('The DOCX file could not be parsed. Use a valid Word document under 8 MB.') from None
    return text


def source_info(body, text):
    name = string(body.get('name'), 'Document name', 200)
    require(isinstance(text, str) and text.strip() and len(text) <= 500_000,
            'The document is empty or exceeds 500,000 characters')
    return {'valid': True, 'name': name, 'sha256': hashlib.sha256(text.encode('utf-8')).hexdigest(),
            'characters': len(text)}


def import_document(project, body, text):
    info = source_info(body, text)
    name, source = info['name'], info['sha256']
    require(body.get('expected_sha256') is None or body['expected_sha256'] == source,
            'The source changed. Reselect the original file, or add the changed file as a new item.')
    request_id = body.get('request_id')
    require(request_id is None or (isinstance(request_id, str) and 1 <= len(request_id) <= 100),
            'The import request ID is invalid')
    identity = hashlib.sha256(json.dumps([project['id'], name, source], ensure_ascii=False).encode()).hexdigest()
    if request_id:
        previous = next((e for e in reversed(project['audit'])
                         if e['action'] == 'document_import' and e.get('import_request_id') == request_id), None)
        if previous:
            require(previous.get('import_identity') == identity,
                    'This import request was already used for a different source. Start a new import.')
            raise ImportReply(find(project['documents'], previous['document_id']))
    matches = [d['id'] for d in project['documents'] if d['name'] == name and d['text'] == text]
    confirmation = hashlib.sha256(json.dumps([identity, sorted(matches)]).encode()).hexdigest()
    if matches and body.get('duplicate_confirmation') != confirmation:
        raise ImportReply({'requires_confirmation': True, 'duplicate': {
            'name': name, 'document_ids': matches, 'count': len(matches), 'confirmation': confirmation}})
    require(not body.get('duplicate_confirmation') or bool(matches),
            'The matching source changed. Review the source and import again.')
    document = add_document(project, name, text)
    if request_id:
        project['audit'][-1].update(import_request_id=request_id, import_identity=identity)
    return document
