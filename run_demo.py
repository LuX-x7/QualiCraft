"""Read-only public demo entrypoint for hosted deployments.

Runs the workbench with QUALICRAFT_PUBLIC_DEMO semantics: binds 0.0.0.0,
accepts the reverse proxy's Host/Origin, and rejects every write. The demo
database (a public, attributed Bologna corpus) ships under demo-data/ so a
fresh deployment opens straight into real material with nothing to configure.
"""
import os

from qualicraft.server import create_server


def main():
    port = int(os.environ.get("PORT", "8765"))
    host = os.environ.get("HOST", "0.0.0.0")
    data_dir = os.environ.get("QUALICRAFT_DATA_DIR", "demo-data")
    # Mounted under /w so the marketing site's rewrite can proxy to it; a bare
    # "/" redirects there so the service URL is shareable on its own.
    base_path = os.environ.get("QUALICRAFT_BASE_PATH", "/w")
    server = create_server(data_dir, ".", port=port, base_path=base_path, host=host,
                           public_demo=True)
    print(f"QualiCraft public demo listening on {host}:{port}{base_path} (read-only)", flush=True)
    try:
        server.serve_forever()
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
