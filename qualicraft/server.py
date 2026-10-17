from __future__ import annotations

import argparse
import base64
import io
import json
import mimetypes
import os
import secrets
import sqlite3
import sys
import tempfile
import urllib.parse
import webbrowser
import zipfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from . import analyze, ingest, plotting, transcript, reporting, report_figures
from .ai import Analyzer
from .core import ReadingConflict, validate_reading_capacity
from .core import BLOCKS, Store, endpoint_host, add_code, add_document, annotate, benchmark_project, csv_export, delete_code, event, find, grounded_theory_examples_project, merge_codes, methods_narrative, new_project, now, read_docx, require, review, set_blocks, synthetic_project, uid, update_code, update_document, validate_project

ROOT = Path(__file__).resolve().parent.parent


def bologna_example():
    """Copy only the bundled public example; never open or modify user data."""
    source = ROOT / "demo-data" / "qualicraft.sqlite3"
    require(source.is_file(), "The bundled Bologna example is not installed.")
    with sqlite3.connect(source.resolve().as_uri() + "?mode=ro", uri=True) as db:
        row = db.execute("SELECT data FROM projects WHERE id=?",
                         ("a71a0b538c024c3ab23fb4286cfe93e2",)).fetchone()
    require(row is not None, "The bundled Bologna example is unavailable.")
    project = validate_project(json.loads(row[0]))
    project["id"] = uid()
    project["name"] = "Bologna · example copy"
    project["updated_at"] = now()
    event(project, "example_copy", example="bologna")
    return project


def network_response(project, passages=True):
    """Attach exact source references without changing the graph's statistics."""
    graph = analyze.network(analyze.tidy(project), passages=passages)
    code_ids = {code['id'] for code in project['codes']}
    # tidy preserves annotation order and omits annotations with missing codes.
    references = {f'p:{index}': annotation for index, annotation in enumerate(
        a for a in project['annotations'] if a['code_id'] in code_ids)}
    for node in graph['nodes']:
        if node['kind'] == 'passage':
            annotation = references[node['id']]
            node.update(annotation_id=annotation['id'],
                        document_id=annotation['document_id'],
                        start=annotation['start'], end=annotation['end'])
    return graph


def create_server(data_dir, guide_dir, port=8765, base_path="", host="127.0.0.1",
                  public_demo=False, backup_dir=None):
    """Start the local workbench.

    `base_path` lets the server live behind a prefix — for example /w — so the
    Next.js site can proxy to it without the two fighting over /api. Left empty,
    every path is served at the root as before.
    """
    base_path = ("/" + base_path.strip("/")) if base_path.strip("/") else ""
    store = Store(Path(data_dir) / "qualicraft.sqlite3", backup_dir=backup_dir)
    store.migrate_legacy_demo_projects()
    analyzer = Analyzer(store)
    token = secrets.token_urlsafe(32)

    class Handler(BaseHTTPRequestHandler):
        server_version = "QualiCraft/0.1"

        def log_message(self, fmt, *args):
            pass  # No document content, credentials or patient identifiers in access logs.

        def send(self, data, content_type="application/json; charset=utf-8", status=200,
                 filename=None, extra_headers=None):
            if not isinstance(data, bytes):
                data = json.dumps(data, ensure_ascii=False).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("Referrer-Policy", "no-referrer")
            self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'")
            if filename:
                self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
            for header, value in (extra_headers or []):
                self.send_header(header, value)
            self.end_headers()
            self.wfile.write(data)

        def check_request(self):
            allowed = {f"127.0.0.1:{self.server.server_port}", f"localhost:{self.server.server_port}"}
            host = self.headers.get("Host", "")
            if public_demo:
                # The reverse proxy supplies the public host, not loopback.
                # In this explicitly read-only mode there are no state-changing
                # requests; still reject cross-origin browser fetches.
                require(bool(host) and "\\r" not in host and "\\n" not in host,
                        "This host is not allowed")
                origin = self.headers.get("Origin")
                require(origin is None or urllib.parse.urlsplit(origin).netloc.lower() == host.lower(),
                        "Cross-site requests are not allowed")
            else:
                require(host in allowed, "This host is not allowed")
                origin = self.headers.get("Origin")
                require(origin is None or origin in {"http://" + item for item in allowed},
                        "Cross-site requests are not allowed")
            require(self.headers.get("Sec-Fetch-Site", "") != "cross-site", "Cross-site requests are not allowed")

        def do_GET(self):
            try:
                self.check_request()
                parsed = urllib.parse.urlsplit(self.path)
                path = parsed.path
                if base_path:
                    # A hosted demo is mounted under a prefix so the marketing
                    # site can proxy to it. Someone who was handed the service
                    # URL on its own would land on a bare "/", so send them to
                    # the mount instead of a 404.
                    if path == "/" and public_demo:
                        self.send_response(302)
                        self.send_header("Location", base_path + "/")
                        self.send_header("Content-Length", "0")
                        self.end_headers()
                        return
                    if path == base_path:
                        path = "/"
                    elif path.startswith(base_path + "/"):
                        path = path[len(base_path):]
                    else:
                        return self.send({"error": "The file does not exist"}, status=404)
                if path == "/api/bootstrap":
                    return self.send({"token": token, "projects": store.list(),
                                      "config": {**analyzer.public_config(), "plotting": plotting.availability(),
                                                 "public_demo": public_demo,
                                                 "bologna_example_available": (ROOT / "demo-data" / "qualicraft.sqlite3").is_file()},
                                      "guide_available": (Path(guide_dir) / "Paired_Qualitative_Transcripts_TU_Delft").is_dir()})
                if path.startswith("/api/"):
                    require(self.headers.get("X-QualiCraft-Token") == token, "The session has expired; refresh the page")
                    parts = path.strip("/").split("/")
                    if path == "/api/projects":
                        return self.send(store.list())
                    if path == "/api/jobs":
                        return self.send(analyzer.list_jobs())
                    if len(parts) >= 3 and parts[1] == "projects":
                        project = store.get(parts[2])
                        if len(parts) == 3:
                            return self.send(project)
                        if len(parts) == 4 and parts[3] == 'report':
                            return self.send(reporting.context(project))
                        if len(parts) == 4 and parts[3] == "backups":
                            # Snapshots written automatically on every change,
                            # plus whether writing them is still working. The
                            # count alone would keep looking healthy after the
                            # backups had stopped.
                            return self.send({"items": store.backups(parts[2]),
                                              "status": store.backup_status()})
                        if len(parts) == 4 and parts[3] == "export":
                            fmt = urllib.parse.parse_qs(parsed.query).get("format", ["json"])[0]
                            if fmt in {'report-html','report-docx','report-json','report-zip'}:
                                query = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)
                                version = query.get('version_id', [None])
                                require(len(version)==1, 'Choose one report version')
                                entry, stale = reporting.selected(project, version[0])
                                suffix = fmt.removeprefix('report-')
                                assets = project['research_report'].get('assets',{})
                                payload = reporting.html_export(entry, stale, assets) if suffix=='html' else reporting.docx_export(entry, stale, assets) if suffix=='docx' else reporting.bundle_export(entry,assets,stale) if suffix=='zip' else json.dumps(reporting.export_record(entry,assets),ensure_ascii=False,indent=2).encode()
                                mime = 'text/html; charset=utf-8' if suffix=='html' else 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' if suffix=='docx' else 'application/zip' if suffix=='zip' else 'application/json'
                                return self.send(payload,mime,filename=f"qt-research-report-{entry['id'][:12]}.{suffix}")
                            if fmt in {"coded-html", "coded-docx", "coded-version"}:
                                query = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)
                                memo = query.get('memos', ['0'])
                                require(memo in (['0'], ['1']), 'Memo selection is invalid.')
                                roles = query.get('role_labels', ['saved'])
                                require(len(roles) == 1, 'Hierarchy label selection is invalid.')
                                frozen = transcript.freeze(project, query.get('document_id'), memo == ['1'], roles[0])
                                headers = [('X-QT-Evidence-Version', frozen['version']),
                                           ('X-QT-Exported-At', frozen['generated_at'])]
                                if fmt == 'coded-version':
                                    return self.send({'version': frozen['version']}, extra_headers=headers)
                                suffix = 'html' if fmt == 'coded-html' else 'docx'
                                payload = transcript.html_export(frozen) if suffix == 'html' else transcript.docx_export(frozen)
                                mime = 'text/html; charset=utf-8' if suffix == 'html' else 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                                return self.send(payload, mime, filename=f"qt-coded-transcript-{frozen['version'][:12]}.{suffix}", extra_headers=headers)
                            if fmt in {"csv", "matrix"}:
                                return self.send(csv_export(project, fmt == "matrix"), "text/csv; charset=utf-8", filename=f"qualicraft-{fmt}.csv")
                            if fmt == "methods":
                                return self.send(methods_narrative(project).encode(), "text/markdown; charset=utf-8", filename="qualicraft-methods.md")
                            if fmt == "json":
                                return self.send(json.dumps(project, ensure_ascii=False, indent=2).encode(), filename="qualicraft-project.json")
                        if len(parts) == 4 and parts[3] == "network":
                            # The graph is small enough to send whole; the
                            # client decides which passages to reveal.
                            query = urllib.parse.parse_qs(parsed.query)
                            with_passages = query.get("passages", ["1"])[0] not in ("0", "false")
                            return self.send(network_response(project, passages=with_passages))
                        if len(parts) == 4 and parts[3] in ("plot", "plot-bundle"):
                            query = urllib.parse.parse_qs(parsed.query)
                            options = {key: query[key][0] for key in query if query[key]}
                            # Drawing runs a generated script in a subprocess, so
                            # it fails in ways the caller cannot see: a missing
                            # matplotlib, or a script that raised. Let the failure
                            # out as a message rather than as a dropped connection
                            # — an escaped exception closes the socket with no
                            # response at all, and the browser then reports
                            # "Failed to fetch" instead of the actual reason.
                            try:
                                if parts[3] == "plot":
                                    svg, _ = plotting.render(project, options)
                                    return self.send(svg.encode("utf-8"), "image/svg+xml; charset=utf-8")
                                files, _ = plotting.bundle(project, options)
                                buffer = io.BytesIO()
                                with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as archive:
                                    for name, payload in files.items():
                                        archive.writestr(name, payload)
                                return self.send(buffer.getvalue(), "application/zip", filename="qualicraft-figure.zip")
                            except RuntimeError as exc:
                                return self.send({"error": str(exc)}, status=500)
                            except ValueError as exc:
                                # "Nothing to plot yet", "no data at this setting":
                                # the reader can act on these, so send the wording
                                # rather than the generic invalid-request notice.
                                return self.send({"error": str(exc)}, status=400)
                    return self.send({"error": "The API endpoint does not exist"}, status=404)
                if path == "/config.js":
                    return self.send(('window.QT_BASE=' + json.dumps(base_path) + ';').encode(),
                                     "application/javascript; charset=utf-8")
                files = {"/": "index.html", "/app.js": "app.js", "/welcome-orbit.js": "welcome-orbit.js", "/report-editor.js":"report-editor.js",
                         "/style.css": "style.css",
                         "/landing.html": "landing.html", "/landing.css": "landing.css"}
                if path not in files:
                    return self.send({"error": "The file does not exist"}, status=404)
                file = ROOT / "web" / files[path]
                payload = file.read_bytes()
                # Under a prefix the HTML cannot use relative asset paths, because
                # the page is served at /w with no trailing slash. Rewrite them to
                # absolute paths that include the prefix.
                if base_path and file.suffix == ".html":
                    for name in ("style.css", "config.js", "welcome-orbit.js", "report-editor.js", "app.js", "landing.css"):
                        payload = payload.replace(f'"{name}"'.encode(), f'"{base_path}/{name}"'.encode())
                return self.send(payload, (mimetypes.guess_type(file.name)[0] or "text/plain") + "; charset=utf-8")
            except (ValueError, KeyError, TypeError):
                return self.send({"error": "The request is invalid or the session has expired"}, status=400)
            except (BrokenPipeError, ConnectionResetError):
                pass

        def do_POST(self):
            try:
                self.check_request()
                if public_demo:
                    return self.send({"error": "This public demonstration is read-only. Start a local copy to create or change projects."}, status=403)
                require(self.headers.get("X-QualiCraft-Token") == token, "The session has expired; refresh the page")
                require(self.headers.get("Content-Type", "").startswith("application/json"), "Only JSON requests are accepted")
                size = int(self.headers.get("Content-Length", "0"))
                require(0 < size <= 20_000_000, "The request is empty or too large")
                body = json.loads(self.rfile.read(size))
                require(isinstance(body, dict), "The request format is invalid")
                raw = urllib.parse.urlsplit(self.path).path
                if base_path and raw.startswith(base_path + "/"):
                    raw = raw[len(base_path):]
                parts = raw.strip("/").split("/")
                if parts == ["api", "config"]:
                    return self.send(analyzer.configure(body))
                if parts == ["api", "import"]:
                    # Another tool's export, uploaded from the interface. The
                    # file is written to a scratch directory and handed to the
                    # importer that recognises it; nothing is stored until the
                    # importer returns a project.
                    filename = str(body.get("filename") or "upload")
                    payload = body.get("data")
                    require(isinstance(payload, str) and payload, "The uploaded file is empty")
                    try:
                        blob = base64.b64decode(payload, validate=True)
                    except Exception:
                        raise ValueError("The uploaded file could not be read") from None
                    require(0 < len(blob) <= 20_000_000, "The file is empty or larger than 20 MB")
                    suffix = Path(filename).suffix.lower() or ".bin"
                    with tempfile.TemporaryDirectory(prefix="qualicraft-import-") as scratch:
                        target = Path(scratch) / ("upload" + suffix)
                        target.write_bytes(blob)
                        project = ingest.from_file(target, body.get("name") or None)
                    return self.send(store.create(project))
                if parts == ["api", "analyze"]:
                    require(body.get("confirmed") is True, "Confirm the preview before sending data")
                    return self.send(analyzer.start(body.get("preview_id")))
                if len(parts) == 4 and parts[:2] == ["api", "jobs"] and parts[3] == "cancel":
                    return self.send(analyzer.cancel(parts[2]))
                if parts == ["api", "projects"]:
                    kind = body.get("kind", "empty")
                    if kind == "bologna":
                        project = bologna_example()
                    elif kind == "demo":
                        project = synthetic_project()
                    elif kind in {"benchmark", "reference"}:
                        project = benchmark_project(guide_dir, reference=kind == "reference")
                    elif kind == "grounded_examples":
                        project = grounded_theory_examples_project(guide_dir)
                    elif kind == "restore":
                        project = validate_project(body.get("project"))
                        project["id"] = uid()
                        project["updated_at"] = now()
                        event(project, "project_restore")
                        validate_reading_capacity(project)
                    elif kind == "empty":
                        project = new_project(body.get("name", "Untitled research project"))
                    else:
                        raise ValueError("The project type is invalid")
                    return self.send(store.create(project))
                if len(parts) == 4 and parts[:2] == ["api", "projects"]:
                    project_id, action = parts[2:]
                    if action in {"reading-mark", "reading-reset"}:
                        return self.send(store.change_reading(project_id, body, reset=action == "reading-reset"))
                    if action == "preview":
                        return self.send(analyzer.preview(project_id, body))
                    if action == "restore-snapshot":
                        # Handled before the change wrapper, not inside it.
                        # Restoring creates a new project, and that write cannot
                        # happen inside the transaction the wrapper has already
                        # opened on the same database — SQLite refuses the second
                        # writer and the request dies as a generic 500.
                        #
                        # Always a copy: restoring over the project the snapshot
                        # came from would lose the current state and the recovery
                        # point in one move.
                        require(not public_demo, "The public demonstration is read-only")
                        return self.send(store.restore(project_id, body.get("name", "")))
                    if action == 'report-save':
                        # Render on a detached project before acquiring a writer lock.
                        # Recheck report revision and coding identity at the short commit.
                        candidate=store.get(project_id);stamp=reporting.source_version(candidate)
                        revision=candidate.get('research_report',{}).get('revision',0)
                        prepared=reporting.save(candidate,body)
                        return self.send(store.change(project_id,lambda p:reporting.install_prepared(p,prepared,revision,stamp)))
                    def operation(project):
                        if action in {'report-save','report-restore'}:
                            return reporting.save(project,body,restore=action=='report-restore')
                        if action == "documents":
                            text = body.get("text")
                            if body.get("docx_base64"):
                                try:
                                    text = read_docx(base64.b64decode(body["docx_base64"], validate=True))
                                except Exception:
                                    raise ValueError("The DOCX file could not be parsed. Use a valid Word document under 8 MB.") from None
                            return add_document(project, body.get("name"), text)
                        if action == "codes":
                            return add_code(project, body.get("name"), body.get("definition", ""), body.get("color"), body.get("parent_id"), body.get("research_role"))
                        if action == "document-update":
                            return update_document(project, body.get("id"), body.get("changes"))
                        if action == "blocks":
                            return set_blocks(project, body.get("blocks"))
                        if action == "code-update":
                            return update_code(project, body.get("id"), body.get("changes"))
                        if action == "code-delete":
                            return delete_code(project, body.get("id"))
                        if action == "code-merge":
                            return merge_codes(project, body.get("source_id"), body.get("target_id"))
                        if action == "annotations":
                            return annotate(project, body.get("document_id"), body.get("code_id"), body.get("start"), body.get("end"), body.get("memo", ""))
                        if action == "remove-annotation":
                            annotation = find(project["annotations"], body.get("id"))
                            project["annotations"].remove(annotation)
                            event(project, "annotation_remove", annotation=annotation)
                            return {"ok": True}
                        if action == "memo":
                            annotation = find(project["annotations"], body.get("id"))
                            memo = body.get("memo", "")
                            require(isinstance(memo, str) and len(memo) <= 5000, "The memo is too long")
                            event(project, "memo_update", annotation_id=annotation["id"], before=annotation.get("memo", ""), after=memo)
                            annotation["memo"] = memo
                            return annotation
                        if action == "review":
                            review(project, body.get("id"), body.get("action"))
                            return {"ok": True}
                        raise ValueError("The requested action does not exist")
                    return self.send(store.change(project_id, operation))
                return self.send({"error": "The API endpoint does not exist"}, status=404)
            except report_figures.FigureRenderError as exc:
                return self.send({"error": str(exc)}, status=500)
            except (ReadingConflict, reporting.ReportConflict) as exc:
                return self.send({"error": str(exc)}, status=409)
            except ValueError as exc:
                return self.send({"error": str(exc)}, status=400)
            except (KeyError, TypeError, AttributeError, OverflowError):
                return self.send({"error": "The data format is invalid; check the input"}, status=400)
            except (BrokenPipeError, ConnectionResetError):
                pass
            except Exception:
                return self.send({"error": "Local processing failed; check that the storage directory is writable"}, status=500)

    server = ThreadingHTTPServer((host, port), Handler)
    server.daemon_threads = True
    server.store, server.analyzer, server.base_path = store, analyzer, base_path
    return server


def self_check(server, args, public_demo):
    """Print the configuration the process actually came up with.

    More than one deployment problem in this project was a setting that looked
    right in the file and was something else at runtime: a key file that was
    never read, a data directory that was not the one being written to. Printing
    the effective values at startup turns that class of problem from a debugging
    session into a glance.

    It reports only what it can measure. An earlier version ended with a
    reassuring line about outbound requests that was a string literal — true of
    the design, but not something this function had checked.
    """
    data_dir = Path(args.data_dir).resolve()
    database = data_dir / "qualicraft.sqlite3"
    status = server.store.backup_status()

    lines = [
        "QualiCraft 0.1",
        f"  url             http://127.0.0.1:{server.server_port}{server.base_path}",
        f"  bind            {args.host}:{server.server_port}",
        f"  data dir        {data_dir}",
        f"  database        {database} ({'found' if database.exists() else 'will be created'})",
        f"  backups         {status['dir']} (keeping {status['keep']} per project)",
        f"  public demo     {'ON - every write is refused' if public_demo else 'off'}",
    ]

    state = plotting.availability()
    if state["available"]:
        lines.append("  plotting        available")
    else:
        lines.append(f"  plotting        MISSING: {', '.join(state['missing'])} "
                     f"- install with: {state['install']}")
    if state["optional_missing"]:
        lines.append(f"  plotting extra  {', '.join(state['optional_missing'])} absent "
                     "- figures still draw, without clustering")

    config = server.analyzer.public_config()
    if config.get("has_key"):
        lines.append(f"  cloud model     key loaded; endpoint {endpoint_host(config.get('base_url'))}, "
                     f"model {config.get('model')}")
        lines.append("  outbound        only to that host, and only after you confirm a preview")
    else:
        lines.append("  cloud model     no key loaded, so nothing can be sent")
        lines.append("  outbound        none possible until a key is configured")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="QualiCraft local research workbench")
    parser.add_argument("--port", type=int, default=int(os.getenv("PORT", 8765)),
                        help="Port to listen on; falls back to $PORT when set")
    public_demo = os.getenv("QUALICRAFT_PUBLIC_DEMO", "").lower() in {"1", "true", "yes"}
    parser.add_argument("--host", default=os.getenv("QUALICRAFT_HOST", "0.0.0.0" if public_demo else "127.0.0.1"),
                        help="Bind address. Stays on loopback unless you ask otherwise: this tool is built to run on your own machine, and handing it to a network is a different decision.")
    parser.add_argument("--base-path", default=os.getenv("QUALICRAFT_BASE_PATH", ""),
                        help="Serve everything under this prefix, for embedding behind a proxy")
    parser.add_argument("--data-dir", default=str(ROOT / "data"))
    parser.add_argument("--backup-dir", default=os.getenv("QUALICRAFT_BACKUP_DIR", ""),
                        help="Where to write project snapshots. Defaults to a backups/ folder "
                             "beside the database. Do not point this at a synced folder: that "
                             "would send transcripts off the machine.")
    parser.add_argument("--guide-dir", default=os.getenv("QUALICRAFT_GUIDE", str(ROOT.parent / "Guide")))
    parser.add_argument("--api-key-file", default=os.getenv("QUALICRAFT_API_KEY_FILE", ""), help="Read the provider key from this local file")
    parser.add_argument("--api-base", default=os.getenv("QUALICRAFT_API_BASE", ""), help="OpenAI-compatible API base URL")
    parser.add_argument("--model", default=os.getenv("QUALICRAFT_MODEL", ""), help="Model name")
    parser.add_argument("--open", action="store_true")
    args = parser.parse_args()
    if args.api_key_file:
        os.environ["QUALICRAFT_API_KEY_FILE"] = args.api_key_file
    if args.api_base:
        os.environ["QUALICRAFT_API_BASE"] = args.api_base
    if args.model:
        os.environ["QUALICRAFT_MODEL"] = args.model
    try:
        server = create_server(args.data_dir, args.guide_dir, args.port, args.base_path, args.host,
                               public_demo=public_demo,
                               backup_dir=args.backup_dir or None)
    except OSError as exc:
        print(f"Cannot start local service: {exc}", file=sys.stderr)
        return 1
    url = f"http://127.0.0.1:{server.server_port}{server.base_path}"
    print(self_check(server, args, public_demo), flush=True)
    if args.open:
        webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
