from __future__ import annotations

import argparse
import base64
import json
import mimetypes
import os
import secrets
import sys
import urllib.parse
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from .ai import Analyzer
from .core import Store, add_code, add_document, annotate, benchmark_project, csv_export, event, find, new_project, now, read_docx, require, review, synthetic_project, uid, validate_project

ROOT = Path(__file__).resolve().parent.parent


def create_server(data_dir, guide_dir, port=8765):
    store = Store(Path(data_dir) / "qualicraft.sqlite3")
    if not store.list():
        store.create(synthetic_project())
    analyzer = Analyzer(store)
    token = secrets.token_urlsafe(32)

    class Handler(BaseHTTPRequestHandler):
        server_version = "QualiCraft/0.1"

        def log_message(self, fmt, *args):
            pass  # No document content, credentials or patient identifiers in access logs.

        def send(self, data, content_type="application/json; charset=utf-8", status=200, filename=None):
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
            self.end_headers()
            self.wfile.write(data)

        def check_request(self):
            allowed = {f"127.0.0.1:{self.server.server_port}", f"localhost:{self.server.server_port}"}
            require(self.headers.get("Host") in allowed, "Host 不允许")
            origin = self.headers.get("Origin")
            require(origin is None or origin in {"http://" + host for host in allowed}, "跨站请求不允许")
            require(self.headers.get("Sec-Fetch-Site", "") != "cross-site", "跨站请求不允许")

        def do_GET(self):
            try:
                self.check_request()
                parsed = urllib.parse.urlsplit(self.path)
                path = parsed.path
                if path == "/api/bootstrap":
                    return self.send({"token": token, "projects": store.list(), "config": analyzer.public_config(),
                                      "guide_available": (Path(guide_dir) / "Paired_Qualitative_Transcripts_TU_Delft").is_dir()})
                if path.startswith("/api/"):
                    require(self.headers.get("X-QualiCraft-Token") == token, "会话已过期，请刷新页面")
                    parts = path.strip("/").split("/")
                    if path == "/api/projects":
                        return self.send(store.list())
                    if path == "/api/jobs":
                        return self.send(analyzer.list_jobs())
                    if len(parts) >= 3 and parts[1] == "projects":
                        project = store.get(parts[2])
                        if len(parts) == 3:
                            return self.send(project)
                        if len(parts) == 4 and parts[3] == "export":
                            fmt = urllib.parse.parse_qs(parsed.query).get("format", ["json"])[0]
                            if fmt in {"csv", "matrix"}:
                                return self.send(csv_export(project, fmt == "matrix"), "text/csv; charset=utf-8", filename=f"qualicraft-{fmt}.csv")
                            if fmt == "json":
                                return self.send(json.dumps(project, ensure_ascii=False, indent=2).encode(), filename="qualicraft-project.json")
                    return self.send({"error": "接口不存在"}, status=404)
                files = {"/": "index.html", "/app.js": "app.js", "/style.css": "style.css"}
                if path not in files:
                    return self.send({"error": "文件不存在"}, status=404)
                file = ROOT / "web" / files[path]
                return self.send(file.read_bytes(), (mimetypes.guess_type(file.name)[0] or "text/plain") + "; charset=utf-8")
            except (ValueError, KeyError, TypeError):
                return self.send({"error": "请求无效或会话已过期"}, status=400)
            except (BrokenPipeError, ConnectionResetError):
                pass

        def do_POST(self):
            try:
                self.check_request()
                require(self.headers.get("X-QualiCraft-Token") == token, "会话已过期，请刷新页面")
                require(self.headers.get("Content-Type", "").startswith("application/json"), "仅接受 JSON 请求")
                size = int(self.headers.get("Content-Length", "0"))
                require(0 < size <= 20_000_000, "请求过大或为空")
                body = json.loads(self.rfile.read(size))
                require(isinstance(body, dict), "请求格式错误")
                parts = urllib.parse.urlsplit(self.path).path.strip("/").split("/")
                if parts == ["api", "config"]:
                    return self.send(analyzer.configure(body))
                if parts == ["api", "analyze"]:
                    require(body.get("confirmed") is True, "需要确认发送预览中的数据")
                    return self.send(analyzer.start(body.get("preview_id")))
                if len(parts) == 4 and parts[:2] == ["api", "jobs"] and parts[3] == "cancel":
                    return self.send(analyzer.cancel(parts[2]))
                if parts == ["api", "projects"]:
                    kind = body.get("kind", "empty")
                    if kind == "demo":
                        project = synthetic_project()
                    elif kind in {"benchmark", "reference"}:
                        project = benchmark_project(guide_dir, reference=kind == "reference")
                    elif kind == "restore":
                        project = validate_project(body.get("project"))
                        project["id"] = uid()
                        project["updated_at"] = now()
                        event(project, "project_restore")
                    elif kind == "empty":
                        project = new_project(body.get("name", "新研究项目"))
                    else:
                        raise ValueError("项目类型无效")
                    return self.send(store.create(project))
                if len(parts) == 4 and parts[:2] == ["api", "projects"]:
                    project_id, action = parts[2:]
                    if action == "preview":
                        return self.send(analyzer.preview(project_id, body))
                    def operation(project):
                        if action == "documents":
                            text = body.get("text")
                            if body.get("docx_base64"):
                                try:
                                    text = read_docx(base64.b64decode(body["docx_base64"], validate=True))
                                except Exception:
                                    raise ValueError("无法解析 DOCX；请确认是有效的 Word 文档（8 MB 以内）") from None
                            return add_document(project, body.get("name"), text)
                        if action == "codes":
                            return add_code(project, body.get("name"), body.get("definition", ""), body.get("color"))
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
                            require(isinstance(memo, str) and len(memo) <= 5000, "备忘录过长")
                            event(project, "memo_update", annotation_id=annotation["id"], before=annotation.get("memo", ""), after=memo)
                            annotation["memo"] = memo
                            return annotation
                        if action == "review":
                            review(project, body.get("id"), body.get("action"))
                            return {"ok": True}
                        raise ValueError("操作不存在")
                    return self.send(store.change(project_id, operation))
                return self.send({"error": "接口不存在"}, status=404)
            except ValueError as exc:
                return self.send({"error": str(exc)}, status=400)
            except (KeyError, TypeError, AttributeError, OverflowError):
                return self.send({"error": "数据格式无效，请检查输入"}, status=400)
            except (BrokenPipeError, ConnectionResetError):
                pass
            except Exception:
                return self.send({"error": "本地处理失败；请检查存储目录是否可写"}, status=500)

    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    server.daemon_threads = True
    server.store, server.analyzer = store, analyzer
    return server


def main():
    parser = argparse.ArgumentParser(description="QualiCraft local research workbench")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--data-dir", default=str(ROOT / "data"))
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
        server = create_server(args.data_dir, args.guide_dir, args.port)
    except OSError as exc:
        print(f"Cannot start local service: {exc}", file=sys.stderr)
        return 1
    url = f"http://127.0.0.1:{server.server_port}"
    print(f"QualiCraft 0.1 | {url}\nStorage: {Path(args.data_dir).resolve()}\nPress Ctrl+C to stop. No cloud call is made at startup.", flush=True)
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
