import json
import tempfile
import threading
import time
import unittest
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from qualicraft.server import create_server


class HTTPTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.server = create_server(self.tmp.name, self.tmp.name, port=0)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.base = f"http://127.0.0.1:{self.server.server_port}"
        self.token = self.request("/api/bootstrap")["token"]

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.tmp.cleanup()

    def request(self, path, body=None, headers=None):
        request = urllib.request.Request(self.base + path, data=json.dumps(body).encode() if body is not None else None,
            headers=headers if headers is not None else {"X-QualiCraft-Token": getattr(self, "token", ""), "Content-Type": "application/json"})
        with urllib.request.urlopen(request, timeout=3) as response:
            return json.load(response)

    def test_block_cross_site_and_unauthenticated_mutations(self):
        for headers in [{"Content-Type": "application/json"}, {"X-QualiCraft-Token": self.token, "Content-Type": "application/json", "Origin": "https://evil.example"}]:
            with self.assertRaises(urllib.error.HTTPError):
                self.request("/api/projects", {"name": "blocked"}, headers)

    def test_http_roundtrip_review_export_restore(self):
        p = self.request("/api/projects", {"kind": "demo"})
        root = "/api/projects/" + p["id"]
        self.request(root + "/review", {"id": p["suggestions"][0]["id"], "action": "accept"})
        project = self.request(root + "/export?format=json")
        self.assertEqual(len(project["annotations"]), 2)
        restored = self.request("/api/projects", {"kind": "restore", "project": project})
        self.assertNotEqual(restored["id"], p["id"])
        self.assertEqual(restored["documents"], project["documents"])

    def test_real_http_model_contract(self):
        calls = []
        class FakeModel(BaseHTTPRequestHandler):
            def log_message(self, *args):
                pass
            def do_POST(self):
                data = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
                calls.append(data)
                target = json.loads(data["messages"][1]["content"])["target_text"]
                output = {"suggestions": [{"code_name": "Feeling heard and respected", "quote": target[:12], "start": 0, "rationale": "The quotation supports the code."}]}
                result = json.dumps({"id": "test-response", "model": "fake", "choices": [{"finish_reason": "stop", "message": {"content": json.dumps(output)}}], "usage": {"total_tokens": 1}}).encode()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(result)))
                self.end_headers()
                self.wfile.write(result)
        model = ThreadingHTTPServer(("127.0.0.1", 0), FakeModel)
        thread = threading.Thread(target=model.serve_forever, daemon=True)
        thread.start()
        try:
            self.request("/api/config", {"base_url": f"http://127.0.0.1:{model.server_port}/v1", "model": "fake", "api_key": "test-key"})
            p = self.request("/api/projects", {"kind": "demo"})
            root = "/api/projects/" + p["id"]
            preview = self.request(root + "/preview", {"document_id": p["documents"][0]["id"], "scope": "patient"})
            self.assertEqual(len(calls), 0)
            self.assertNotIn("test-key", json.dumps(preview))
            job = self.request("/api/analyze", {"preview_id": preview["id"], "confirmed": True})
            deadline = time.monotonic() + 5
            while time.monotonic() < deadline:
                job = self.request("/api/jobs")[-1]
                if job["status"] != "running":
                    break
                time.sleep(.02)
            self.assertEqual(job["status"], "completed")
            self.assertEqual(len(calls), 4)
            result = self.request(root)
            self.assertEqual(len(result["annotations"]), 1)
            self.assertEqual(len([s for s in result["suggestions"] if s["source"] == "model"]), 4)
            self.assertNotIn("test-key", json.dumps(result))
        finally:
            model.shutdown()
            model.server_close()
            thread.join()

    def test_http_codebook_hierarchy_and_maintenance(self):
        p = self.request("/api/projects", {"kind": "demo"})
        root = "/api/projects/" + p["id"]
        parent, other = p["codes"][0], p["codes"][1]

        child = self.request(root + "/codes", {"name": "Sub-code", "definition": "", "parent_id": parent["id"]})
        self.assertEqual(child["parent_id"], parent["id"])

        updated = self.request(root + "/code-update", {"id": child["id"],
                                                       "changes": {"name": "Renamed sub-code", "memo": "a note"}})
        self.assertEqual(updated["name"], "Renamed sub-code")
        self.assertEqual(updated["memo"], "a note")

        # A code may not be moved beneath its own descendant.
        with self.assertRaises(urllib.error.HTTPError):
            self.request(root + "/code-update", {"id": parent["id"], "changes": {"parent_id": child["id"]}})

        merged = self.request(root + "/code-merge", {"source_id": child["id"], "target_id": other["id"]})
        self.assertEqual(merged["source"], "Renamed sub-code")
        self.assertEqual(merged["target"], other["name"])

        deleted = self.request(root + "/code-delete", {"id": other["id"]})
        self.assertIn("codings_removed", deleted)

        project = self.request(root)
        self.assertEqual(project["schema_version"], 2)
        self.assertNotIn(other["id"], [c["id"] for c in project["codes"]])
        self.assertTrue(any(a["action"] == "code_delete" for a in project["audit"]))


if __name__ == "__main__":
    unittest.main()
