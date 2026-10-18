# UX71 — GitHub Pages + private full online workbench

Date: 2026-10-18. Supersedes the readonly-only public-workbench decision for this new deployment, by the user's explicit request. Existing Render services remain unchanged as rollback. No analysis definitions, CSV calculations, plotting implementation, original report assets or auto-deployment configuration are changed.

## Current deployment

- Dedicated server directory: `/mnt/data/xiaolu/LMIC-ILI-EarlyWarning/QT/` only. No sibling project, global service, package manager, SSH configuration or gateway configuration modified.
- Full workbench review login: https://looking-goals-warranty-survive.trycloudflare.com/login . **Temporary HTTPS hostname**, not a permanent production address. Cloudflare Quick Tunnel has no uptime guarantee and a new tunnel gets a new hostname. A fixed HTTPS domain / named tunnel or provider mapping is still needed for a permanent link.
- GitHub Pages artifact: `/QualiCraft/` homepage, `/QualiCraft/report/`, About, original downloads and client interactions; no Render proxy or cold-start dependency. Static build verifies all 37 original report / worked-example / clip / font files by SHA-256.
- **Pages is not enabled**. HaijunChe has push permission, not repository administration. User currently cannot contact LuX-x7. Preparing a branch does not activate a website. Required owner setting: Settings → Pages → Deploy from a branch → `gh-pages` → `/(root)`.
- Expected URL after owner activation: `https://lux-x7.github.io/QualiCraft/`. Do not describe it as live before checking HTTP and deployment status.

## Authentication and persistence

The online deployment uses invitation-only accounts. Each account gets a separate SQLite project store, snapshot directory, Analyzer and full loopback workbench. New users see the empty start page and may upload material or choose their own editable Bologna copy. Features and exports reuse existing workbench routes; this is not the old readonly Render demo.

Passwords are scrypt hashes with random salts; sessions and invitations are stored as hashes. Cookies are Secure / HttpOnly / SameSite=Lax. The gateway enforces the configured HTTPS host, request origin, existing workbench token and 20MB request limit. Cross-site navigation from the website can reach login; cross-site API requests are refused. Sign-out invalidates the session. Global operator model keys / key files are refused. AI still needs an explicit user configuration and request confirmation.

The user's SSH password was entered only in their own Terminal. The agent reused the temporary SSH control socket; no SSH password was read, copied or stored. Private invitations are kept outside Git and public evidence. Each invite is single-use and expires after seven days. Users choose their own passwords.

Projects are saved on this server, **not on the visitor's computer**. Local installation remains available. Researchers must confirm consent, institutional requirements and data-processing arrangements before uploading private interviews. This round uploaded only public Bologna data. Single-user local use and invited hosted use are distinct storage choices; no blanket ethics approval is claimed.

## Server boundary and operation

`QT/venv`, `releases/ux71-candidate`, `runtime/accounts`, `runtime/users`, `config`, `cache`, `tmp`, `logs`, `packages`, and `bin` contain the installation. System Python lacked ensurepip, so pip was bootstrapped inside the QT venv; no sudo or system package changes. Official cloudflared 2026.10.1 binary verified against its GitHub release SHA-256 `3bfc539f45d2620c71debb7a86be0efa737ed5ccbad9eb85c787116900e5c586`.

Gateway binds loopback only; cloudflared forwards HTTPS to that gateway. Processes are detached from SSH and their metadata is stored in `QT/config/*-process.json`. Restart testing was limited to the verified QT gateway PID and retained accounts, projects and snapshots. **Server reboot autostart is not configured**, because system services / cron outside QT are outside the user's boundary. Do not claim reboot resilience or production SLA.

No migration of original local or Render databases. Retaining old services does not mean the old readonly public instance is editable. Windows and physical-phone follow-up remain deferred.

## Verification and evidence

Raw commands, outputs, exit files, JSON checks and screenshots: `~/qualicraft-review/ux-71/` (outside Git). Test-only loopback Pages artifacts must not be published. Final regression: 308 Python tests passed (3 existing skips), 267 JavaScript tests passed; app.js and hosted-auth.js syntax checks passed. Static production build and Chrome Pages/report/download checks passed. Seven protected implementation/deployment files are byte-identical to the previous committed version. Full commit hashes are recorded in the external release evidence.

- Hosted integration: anonymous API/write rejection, single-use invite, hashed credentials, logout, account/token isolation, frozen Bologna report JSON export/restore and persistent restart, wrong host/cross-origin rejection, global-key refusal and workspace traversal rejection.
- Controlled Chrome: HTTPS login, online start, actual Coding reader, keyboard focus, native sign-out, unauthorized API after logout, zero page errors. Initial test assumptions about project creation kind / button / CSV filename were corrected to match unchanged APIs. Native logout exposed no-referrer / empty-body proxy interactions; same-origin referrer policy and a nonempty form fix them without relaxing origin or request-size checks.
- Full online exports: JSON, coded HTML / editable Word, frozen Research report JSON / HTML / Word / ZIP; all five SVG previews and complete SVG / PDF / PNG / CSV / Python bundles. Each downloaded figure CSV equals the unchanged local analysis result. One measured run: hierarchy preview + complete bundle 13.98s, report ZIP 6.56s; these are observations, not latency guarantees.
- Website: isolated static production build, unchanged 37 assets, repository prefix checks, original downloads, browser / keyboard / console checks.

## Remaining release gates

1. Owner activation of GitHub Pages and external URL verification.
2. A stable HTTPS workbench hostname and reboot process policy for long-term availability; temporary tunnel is suitable only for review.
3. Supervisor / researcher acceptance and institutional approval for real uploads are not replaced by software tests.

Public provider limitation reference: https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/ .

## Published source / prepared Pages branch

- Source pushed normally to `main`: `e70f7290aaf9d85ecbe4b765564732617efc5276`.
- Static artifact pushed normally to `gh-pages`: `8d93e01827211012c324ffde3aee479fb4ff1f2f`. Clean source metadata and 37 original asset hashes are included in `qt-release.json`. Branch publication is **not** Pages activation.
- All 32 deployed source/example files match the source commit. Actual online upload → one manual code / annotation → save → four committed snapshots → JSON export passed in a separate Bologna QA project.
- Private owner and supervisor invitations prepared separately, each single-use / seven days, excluded from public packet and Git.
