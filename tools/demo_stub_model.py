"""本地桩模型服务 —— 仅用于演示 QualiCraft 的 AI 建议审核界面。

它实现了 OpenAI 兼容的 /v1/chat/completions 接口，但内部没有任何语言模型。
它按关键词规则从 target_text 中挑选真实子串作为引文，并返回对应的编码建议。
所有引文都是原文的精确子串，因此能通过 QualiCraft 的引文溯源校验。
"""
import json
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

RULES = [
    ("Model-driven code generation",
     r"model-driven|UML|class diagram|transformed into the code|generated code|code generation",
     "The participant describes generating code from architectural models rather than writing it by hand."),
    ("Architecture-code traceability",
     r"traceab|traceability file|link the architecture|links between architecture|links to ensure",
     "The participant describes tooling or practice that maintains explicit links between architecture and code."),
    ("Consistency verification",
     r"consistency|manually inspect|ensure the consistency|inspect architecture",
     "The participant describes how architecture and code are checked against each other."),
    ("Code readability and comprehension",
     r"readable|readability|easily to understand|understand the architecture|understand the system",
     "The participant links code readability to the ability to understand the architecture."),
    ("Change propagation",
     r"recompil|regenerated|changes reflected|intermediate files|maintain the links",
     "The participant describes what has to be redone when architecture or code changes."),
    ("Tooling and automation",
     r"using Eclipses|automatic process|supported with Code|tools that link|some tools",
     "The participant names tools and the degree of automation involved."),
]


def sentences(text):
    """按句切分，保留字符偏移量。"""
    out = []
    for m in re.finditer(r"[^.!?\n]+[.!?]?", text):
        s = m.group()
        if len(s.strip()) >= 30:
            out.append((m.start(), s))
    return out


def suggest(target):
    found, used = [], set()
    for start, sent in sentences(target):
        low = sent.lower()
        for name, pattern, rationale in RULES:
            if re.search(pattern, low) and name not in used:
                quote = sent.strip()
                offset = target.find(quote, start)
                if offset < 0 or target.find(quote, offset + 1) >= 0:
                    continue
                used.add(name)
                found.append({
                    "code_name": name,
                    "definition": "",
                    "quote": quote,
                    "start": offset,
                    "rationale": rationale,
                })
                break
        if len(found) >= 3:
            break
    return found


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *args):
        pass

    def do_POST(self):
        length = int(self.headers.get("Content-Length", "0"))
        body = json.loads(self.rfile.read(length))
        user = json.loads(body["messages"][1]["content"])
        payload = {"suggestions": suggest(user["target_text"])}
        content = json.dumps(payload, ensure_ascii=False)
        result = json.dumps({
            "id": "stub-response",
            "model": "local-stub-model",
            "choices": [{"finish_reason": "stop", "message": {"content": content}}],
            "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
        }, ensure_ascii=False).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(result)))
        self.end_headers()
        self.wfile.write(result)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 9111), Handler)
    print("stub model on http://127.0.0.1:9111/v1", flush=True)
    server.serve_forever()
