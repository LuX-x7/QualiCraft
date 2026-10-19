## 2026-10-19 · 邀请注册密码下限调整

按用户明确要求，注册密码下限从12位改为6位；前端约束、提示与服务端一致。邀请码、单次使用及7天有效期保持，不增加注册步骤，不设置共用初始密码；旧账号与密码哈希不迁移。仅修改 QT 托管边界，不改统计、绘图或研究数据。

定向回归：支持的 Python 环境中新增边界测试修改前唯一失败，修改后14项 hosted／hosted-site 测试全过。系统Python3.9缺少所需运行能力的失败原样保留，未当作产品结果。原始输出 `/tmp/qt-password-before-supported.txt`、`/tmp/qt-password-after.txt`。线上仅替换 `QT/releases/ux72/qualicraft/hosted.py`，旧文件留在QT/config；部署SHA-256：`b8d29ce1d3e76c66744da9ef50a4a427a731bb965caff9caea157229fad3e2af`。线上Chrome实际6位注册／退出／重新登录、5位拒绝且邀请码未消耗均通过，注册至起步4.05秒，页面脚本错误0；证据为 `password-live-result.json`。仅由既有监督进程重启QT网关，未重启隧道或其他项目。开机自启管理员阻塞不因此关闭。

---

## 2026-10-19 · 开机注册受管理员权限阻塞

用户已明确批准仅新增 `/etc/systemd/system/qt-xiaolu.service` 与其启用链接。实际执行 `sudo install` 被服务器拒绝：`xiaolu is not in the sudoers file.`；不是用户授权缺失。复核 `systemctl is-enabled qt-xiaolu.service` 返回 `not-found`，`is-active` 返回 `inactive`，没有注册成功，不得标为开机自启完成。已备单元 SHA-256 为 `12900b09656f57bfd98f3b62ee6243f94c0a7f125bd559289278e601c7b42e08`。现有 QT 手动监督进程保持运行。

下一步由服务器管理员以管理员身份执行已审核的专用单元安装、daemon-reload 和 enable；先不 start，待核验后仅切换 QT 进程。不要授予通用 sudo 权限，不改其他服务，不重启共享服务器。真实 OS 重启验证仍未执行。

---

# UX72 — Fixed website and full workbench; boot registration pending

Date: 2026-10-18. The user authorized a free-first alternative without waiting for LuX-x7, plus their own Tailscale device/Funnel authorization. Server changes remain confined to `/mnt/data/xiaolu/LMIC-ILI-EarlyWarning/QT/`. No system service, cron, shell profile, host interface or other project has been modified.

## Live fixed entry

- Website: https://qt-review.taila524d0.ts.net/ (redirects to `/QualiCraft/`).
- Report and worked outputs: https://qt-review.taila524d0.ts.net/QualiCraft/report/ .
- Full invited workbench: https://qt-review.taila524d0.ts.net/login . New users choose their own credentials using a private single-use invitation; existing accounts use their existing credentials.
- Website/report are public. Upload, manual coding, save, snapshots, report and exports are authenticated and isolated per account. Mentor needs only a browser, no local installation or Tailscale client.

The fixed name belongs to the dedicated persistent QT Tailscale node. Actual workbench and tunnel process restarts retained the same name, HTTPS/Funnel settings and saved work. This is **not an OS reboot test**. Tailscale Funnel is beta with provider bandwidth limits; Personal free eligibility is noncommercial. No paid plan was enabled by the agent. Server availability and provider availability remain requirements; this is not a production SLA.

The user completed authentication in their own browser. No password/auth key was requested, captured or committed. Official static Tailscale 1.104.1 amd64 package verified against SHA-256 `108d1d96ecf410d305571e173516f27038f870919a9b89c914a167c6d33a4528`. Dedicated userspace mode uses only QT's socket/state/logs, accepts no host DNS/routes and does not enable Tailscale SSH. Existing server networking was not modified.

GitHub Pages is now **optional**, not a prerequisite for the mentor entry. The existing repository still needs LuX-x7 to enable Pages; no bypass of repository permissions was attempted. Render services remain unchanged with auto-deploy off. Only the obsolete QT Quick Tunnel and its old gateway were retired after fixed-origin verification, avoiding parallel gateways for the same stores. Their source and data remain for rollback.

## Hosting implementation

`qualicraft.hosted --site-root` serves only the verified static artifact under its manifest prefix. Path traversal, hidden paths and symlink escapes are refused. Original inline Next hydration uses exact script SHA-256 CSP hashes; arbitrary inline scripts are not permitted. GET/HEAD are supported. The original 37 report / worked-example / clip / font resources retain their hashes.

Public HTML/CSS/JS/JSON/SVG transfer may use gzip; decompression produces the exact original bytes. Only hashed `/_next/static/` resources get immutable caching. Private APIs, credentials and private exports keep their original uncompressed/no-store path. Homepage HTML is 998,824 bytes, or 203,440 bytes over gzip. This reduces transfer, not the underlying report or data. It does not promise a fixed latency.

`QT/ops/qt_service.py` supervises only QT's web and userspace tunnel children. All persistent paths remain in QT. Its lock refuses duplicates; bounded-backoff restarts preserve runtime files; shutdown acts only on children it created. No arbitrary PID file is used to signal another project. The live QA terminated each verified child individually: both recovered, same hostname/Funnel configuration, original report/documents/annotations and a manual coding remained exact.

## Boot remains the single operational gate

Read-only OS checks found systemd PID 1, an available user runtime, `Linger=no`, and no QT path in the user unit search path. A QT-local script cannot execute itself when the OS boots.

A concrete dedicated **system** unit is prepared only at `QT/config/qt-xiaolu.service`, with tracked source `tools/hosting/qt-system.service.example`. It passes systemd syntax verification. It runs as `xiaolu`, with `NoNewPrivileges`, read-only system/home mounts and a single QT write exception. It does not enable user-wide lingering or restart another service. The intended unit registration path is currently absent. Verification reported an existing unrelated network-online dependency warning; it was not modified.

**Not installed or enabled.** The user has been asked whether to allow the minimal exception: add `/etc/systemd/system/qt-xiaolu.service` and its own boot-enable link. No answer is assumed. If permission is granted, administrative access is still required. Registration must use a root-owned copy, not a root-loaded symlink to a user-writable unit. Stop only the verified manual QT supervisor before starting that unit, retain data, verify effective user/write boundaries, test only QT restart and rerun external checks. Do not reboot the shared server.

## Verification

- 321 Python tests pass, 3 existing skips; 267 Node tests pass. Nine protected analysis/data/original-server/deployment files are byte-identical to the prior release.
- Fixed HTTPS Chrome: actual module hydration, keyboard interaction, report, original Word download, login, editable Bologna Coding and logout pass; page/console/unexpected HTTP errors zero on the successful runs.
- Actual Bologna import → manual code/annotation → server save → 4 committed snapshots → JSON export passes in a separate QA project.
- Seven original exports pass: JSON, coded HTML/Word, frozen Research report JSON/HTML/Word/ZIP. Five previews and complete figure bundles pass with exact unchanged local CSV comparison. One run: full hierarchy preview + ZIP 20.20s, report ZIP 11.57s; observations only.
- After remote child restarts and the transfer update: frozen report, 19 documents, 874 annotations, and manual import/coding remained exact in QA account. Unauthenticated project bootstrap is HTTP 401.
- Initial TLS probe occurred during certificate provisioning and failed; certificate issuance and subsequent external checks succeeded. One Chrome run reported `ERR_NETWORK_IO_SUSPENDED`; failed output retained, unchanged clean rerun passed. No failure is recorded as a pass.
- The earlier UTF-8 test audit matched `Popen` as `open`. A word boundary plus regression fixes that false positive while still refusing real text opens without explicit UTF-8. Product encoding behavior is unchanged.

Raw commands, outputs, JSON checks and live screenshots: `~/qualicraft-review/ux-72/`. Private invitations and temporary QA credentials are excluded from Git and the public packet. Private invitation handoff now points at the fixed login; invitation codes were not regenerated or printed. Windows and physical-phone follow-up remain deferred.

Official references: https://tailscale.com/docs/features/tailscale-funnel ; https://tailscale.com/docs/concepts/userspace-networking ; https://tailscale.com/pricing .

## Source and operator handoff

Application source pushed to `main`: `892e2efccfb97a103f3d233c3cc30846e93f2e82` (including preparation `8907638ffdad8c71993d58d2792ef315a650300e`). The live 32 source/example files and two operation files match that source. Current server static build uses the unchanged website source at `8907638ffdad8c71993d58d2792ef315a650300e`. The updated `gh-pages` artifact is `807e815568d8a7e6fb4522e5a9625256e67c19ef`, built from `892e2efccfb97a103f3d233c3cc30846e93f2e82` with the fixed workbench URL and 37 original resource hashes. Pages itself is not enabled and is not the live mentor address.

The server's current dedicated Tailscale device key expires on 2027-04-16. For long-term unattended use the account owner must manage renewal or deliberately disable expiry for **this QT device only**; no key-expiry setting or global tailnet policy was changed by the agent. HTTPS/Funnel background configuration and state are stored within QT.

GitHub README now points at the fixed entry and explains invited server storage separately from local use and the optional readonly Render blueprint. Private invitations at `~/qualicraft-review/private/qt-review-invitations.json` have the new login URL with the same unprinted codes; they are not in Git or the public packet.
