# UX72 — Stable entry and startup recovery (in progress)

Date: 2026-10-18. User requests a free-first stable website and full workbench without waiting for LuX-x7. Server scope remains strictly `/mnt/data/xiaolu/LMIC-ILI-EarlyWarning/QT/`; no other project, system package, service registration, shell profile, cron or global network configuration may be changed.

## Candidate route

Use one dedicated userspace Tailscale Funnel node with its persistent `*.ts.net` name. The public website and authenticated workbench share that HTTPS origin. Visitors need only a browser; workbench invitation accounts remain required. This avoids repository-owner Pages administration and temporary Quick Tunnel hostnames. The existing Render services and UX71 deployment remain untouched until the replacement passes external verification.

This is a **candidate, not a deployed fixed address**. It requires the user's own account/device authorization and successful network tests from the server. Funnel is currently beta, available across plans, uses only the tailnet DNS name and has provider bandwidth limits. Personal free eligibility is for noncommercial use and must be checked on the actual account; no paid plan or trial is to be activated by the agent. A personal GitHub identity can be used for the user's own login. The agent never needs the user's password or an auth key in chat.

Official references:

- https://tailscale.com/docs/features/tailscale-funnel
- https://tailscale.com/docs/concepts/userspace-networking
- https://tailscale.com/pricing

## Prepared locally

- `qualicraft.hosted --site-root <verified artifact>` serves the original static export under its recorded prefix, with the website public and project APIs still invitation-authenticated. `/` redirects to the website; `/login` and `/w` retain their roles. Only the selected export directory can be read. Traversal, hidden files and symlink escapes are rejected. Inline Next hydration is allowed by exact SHA-256 CSP hashes, without general inline-script permission. GET and HEAD are supported.
- `tools/hosting/qt_service.py` supervises the QT workbench and optionally a dedicated userspace tailscaled. All paths/state/logs/socket/cache stay in QT; it does not reuse another Tailscale instance, alter host interfaces or read arbitrary PID files. A lock rejects duplicate supervisors; crashed children restart with bounded backoff; shutdown signals only processes it created. Existing projects and snapshots are never reset.
- `tools/hosting/qt.service.example` is a **template only**, not an installed service. No service has been enabled and no remote reboot has occurred.

## Boot constraint — do not conflate with crash recovery

A supervisor can restart a crashed child while it remains running. It cannot start itself after the operating system or container reboots without an external boot trigger. A file placed in QT alone is not such a trigger.

Prefer an existing provider startup-command facility pointing at QT's script. If none exists, a user-level systemd service / lingering or another approved boot mechanism is necessary. Registering these outside QT is currently forbidden by the user's scope, so the agent must explain the exact minimal exception and obtain authorization first. Do not install cron, modify `~/.config/systemd`, change lingering or restart the shared server under the current authorization.

## Gates before replacing the mentor link

1. Re-establish the private temporary SSH control connection; last round's connection was intentionally closed.
2. User completes free-account and device authorization in their own browser; no credentials in Git/evidence.
3. Verify outbound connectivity, dedicated userspace Funnel, HTTPS name, authenticated Bologna writes/exports, and no global network changes.
4. Rebuild website with the actual fixed workbench URL; upload only inside QT, then verify homepage → report → login → coding → save/export/restore externally.
5. Select and register an allowed startup trigger. Test only QT process stop/restart; do not reboot a shared host or affect sibling projects. State actual OS-boot verification separately.
6. Update roadmap / supervisor packet with the real URL, full hashes and evidence. Never present the candidate URL or the prepared unit template as an active deployment.

## Current evidence

Local raw outputs/screenshots: `~/qualicraft-review/ux-72/` once copied from `/tmp/qualicraft-ux72/`. Targeted hosted boundary tests and real-child crash/duplicate supervisor tests are included. Same-origin Chrome verifies actual module-button hydration, keyboard interaction, report, original Word download, login and zero console/page/HTTP errors. The initial browser run exposed missing HEAD handling; it was fixed before any deployment. Test counts and commit hashes are recorded after the final run.

## Scope and local test details

Nine protected files (core, analyzer, plotting, original server routes, reporting, QCA state, dataset registry, public Bologna database and render.yaml) remain byte-identical to the previous commit. The existing website source and its original assets are unchanged.

The UTF-8 static audit previously matched `Popen(` as `open(`; it now uses a word boundary, with a regression that still rejects a real text-mode `path.open` without encoding. The process-fixture source is written with explicit UTF-8. Earlier failed audit outputs are retained alongside final results. This changes a test classifier, not product encoding behavior.

Final local results: **319 Python tests pass (3 existing skips), 267 JavaScript tests pass**, project-only Chrome hydration / keyboard / report / Word / login checks pass with zero page, console and HTTP errors. Real supervised-child crash restart, duplicate-process rejection and preservation of a pre-existing runtime file pass. These are **local** results; no fixed Funnel name or OS boot behavior has been verified on the live server.
