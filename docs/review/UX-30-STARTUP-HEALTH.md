# UX-30 · 启动健康检查误报

2026-10-16。基线 `75557dea5fa3b03345241a43cefa2d6816539c63`（UX-29）。**仅修复并关闭 UX17-05。** 只改 `website/start.js` 的启动诊断，补针对性回归／真实进程工具并更新审核文档；不改工作台、代理行为、网站界面、统计、绘图、报告、录屏、数据或部署配置。Windows 暂缓且未验证，不推送、不部署。

## 问题与修复

原脚本向后端根 `/api/health` 请求一次，真实工作台没有该路由。Bologna 后端已就绪时 `/w/api/bootstrap` 为 200，而启动日志仍为 `health 404 <- check QT_WORKBENCH_URL`。已在修改前用真实 Next／真实 Bologna 副本复现，见 `raw/start-before.txt`、`raw/baseline-start.txt`，退出 0（成功复现问题）。

启动诊断现在读取与现有代理相同的 `${base}/w/api/bootstrap`，不使用前台自身的健康结果冒充后端就绪。成功条件除 HTTP 2xx 外，还要求非空 token、项目数组和 config 对象；只检查结构，绝不记录 token、项目清单或响应正文。空项目也是合法就绪状态。请求不缓存、不跟随重定向。

最多 **3 次**，每次 **5 秒**（包括读取响应体）、重试间隔 **1 秒**，最坏请求／等待预算约 **17 秒**。短暂不可用日志为 `waiting (1/3)`／`waiting (2/3)`，恢复为含接口／次数／耗时的 `ready`；耗尽后通过 stderr 明确输出 `failed after 3 attempts`、具体 HTTP／连接／超时／结构／JSON 原因，以及配置／后端提示。不是把错误吞掉、把所有 200 都视为成功或无限等待。

诊断异步执行，Next 子进程照常启动；失败不会强制停止网站。原代理仍如实返回后端 4xx／5xx 或连接失败的 502，未隐藏故障。前台 `/api/health` 仍只表示网站存活，不是综合后端健康 API。此探测只在启动时运行，**不是持续监控**；超过窗口后若后端才恢复，不会自动补一条新的 ready 日志。

## 回归与真实进程验收

新增 `tests/startup_health.test.mjs` 的 **14 项**测试在旧实现全部失败，修复后全部通过。覆盖挂载路径／请求选项、无敏感日志、不阻塞 Next、拒绝连接→503→恢复、持续 401／404／503、连接失败、5 秒超时、拒绝重定向、错误 200、空项目／无效结构、无效 JSON，以及读取响应体时超时。测试只替换网络／子进程／计时边界，执行真实启动源代码，不访问外部服务。原始输出 `raw/regression-before.txt`（退出 1）、`raw/regression-final.txt`（退出 0）。中间 13/14 的输出保留：跨 VM Realm 的 SyntaxError 不能用 instanceof 可靠识别，已按 error.name 分类；不记录 JSON 解析错误中可能带的正文片段。

`tools/site/startup_health_acceptance.py` 启动真实 Next 进程验证 **9/9**：正常与延迟项连接真实工作台；其他故障使用明确标识的 loopback 协议夹具，无访谈内容。延迟项在启动后 1.4 秒才创建实际 Bologna 后端。下表为本次实测：前台存活从进程调用到健康 API 返回；诊断总耗时含轮询观察，略大于日志中的请求计时，不混用两者。

| 场景 | 前台存活 | 观察到诊断完成 | 最后一条诊断 |
| --- | --- | --- | --- |
| 真实后端已就绪 | 372 ms | 372 ms | `health        ready in 27ms (bootstrap http://127.0.0.1:8863/w/api/bootstrap; attempt 1/3)` |
| 真实 Bologna 后端延迟就绪 | 324 ms | 2097 ms | `health        ready in 2047ms (bootstrap http://127.0.0.1:56576/w/api/bootstrap; attempt 3/3)` |
| 持续 HTTP 503 | 313 ms | 2086 ms | `health        failed after 3 attempts in 2034ms: HTTP 503; check QT_WORKBENCH_URL and backend readiness (http://127.0.0.1:56601/w/api/bootstrap)` |
| 无后端监听／拒绝连接 | 514 ms | 2119 ms | `health        failed after 3 attempts in 2030ms: unreachable (ECONNREFUSED); check QT_WORKBENCH_URL and backend readiness (http://127.0.0.1:56618/w/api/bootstrap)` |
| 后端持续不响应 | 316 ms | 17083 ms | `health        failed after 3 attempts in 17007ms: request timed out (5000ms); check QT_WORKBENCH_URL and backend readiness (http://127.0.0.1:56636/w/api/bootstrap)` |
| 路径／配置错误 HTTP 404 | 404 ms | 2095 ms | `health        failed after 3 attempts in 2026ms: HTTP 404; check QT_WORKBENCH_URL and backend readiness (http://127.0.0.1:56665/w/api/bootstrap)` |
| HTTP 302 重定向 | 320 ms | 2088 ms | `health        failed after 3 attempts in 2027ms: HTTP 302; check QT_WORKBENCH_URL and backend readiness (http://127.0.0.1:56681/w/api/bootstrap)` |
| HTTP 200 但为网站健康 JSON | 327 ms | 2099 ms | `health        failed after 3 attempts in 2028ms: unexpected bootstrap response; check QT_WORKBENCH_URL and backend readiness (http://127.0.0.1:56698/w/api/bootstrap)` |
| HTTP 200 但不是 JSON | 314 ms | 2096 ms | `health        failed after 3 attempts in 2031ms: invalid bootstrap JSON; check QT_WORKBENCH_URL and backend readiness (http://127.0.0.1:56714/w/api/bootstrap)` |

延迟项前台先在 324 ms 存活，后端 1.4 秒才启动；日志先出现两次 waiting，第三次 2047 ms ready，没有最终失败。超时项前台 316 ms 存活，三次实际请求均被取消，17007 ms 输出真实超时失败（观察到完成 17083 ms）。404／503／302／错误 200／无效 JSON 都没有变成 ready，且重定向目标未被访问。

每个场景均通过网站正常首页检查；正常两种情况再打开工作台并明确选择 Bologna，无写操作，控制台／HTTP 无错。故障 503 经原代理仍为 503，浏览器预期错误单独存入 `expected_fault_browser`，不与正常路径错误混算，也不声称故障路径控制台无错误。证据：`acceptance/results.json`、`acceptance/raw/start-*.txt`、`acceptance/screenshots/ready-workbench.png`、`delayed-workbench.png`、`http503-proxy-response.png`。

## 命令与原始输出

原始证据：`~/qualicraft-review/ux-30/`；审核包：`~/qualicraft-review/supervisor-review/`。完整运行时路径、命令、退出码见 `raw/run-index.json`。

| 命令 | 结果／输出 |
| --- | --- |
| `node --test tests/startup_health.test.mjs` | 修复前 0/14，退出 1；修复后 14/14，退出 0；`raw/regression-before.txt`、`raw/regression-final.txt` |
| `python tools/site/startup_health_acceptance.py --backend http://127.0.0.1:8863 --node <登记运行时> --out /tmp/qualicraft-ux30/acceptance` | 9/9，退出 0；`raw/startup-acceptance.txt`、`acceptance/results.json`。仅 loopback 独立进程／Chrome，不读其他窗口或标签 |
| `python -m unittest discover -s tests -v` | 155 项，跳过 3，退出 0；`raw/python-tests.txt`。使用授权的本机临时端口，不改已知 `-t .` 收集问题 |
| `node --test tests/*.test.mjs tools/report/*.test.mjs` | 122/122，退出 0；`raw/node-tests.txt` |
| `node --check website/start.js`；`node --check web/app.js`；新 Python 工具语法与 CSS 配平 | 退出 0；`raw/syntax.txt`；无产品 CSS 变更 |
| `npm run build`；`node node_modules/next/dist/bin/next build`（website） | npm 缺失退出 127；直接执行同一 Next 生产构建退出 0，含 TypeScript；`raw/npm-build.txt`、`raw/build.txt`。已有 middleware／static 提示保留 |
| `grep -rniE "publication-grade|publication-ready|publication-oriented|put in a paper|期刊" website/` | 无匹配，退出 1；`raw/forbidden-copy.txt`，空输出配退出码记录 |
| `python /tmp/qualicraft-ux30/restart_previews.py`；`python /tmp/qualicraft-ux30/normal_preview.py` | 退出 0；16 个登记前台构建后重启，首探均 ready；常用 4445 桌面 1440×1000／手机 390×844 模拟首页、报告、工作台与两个 API 200，无溢出，正常控制台／HTTP 无错；`raw/restart.txt`、`raw/normal-preview.txt`、`normal-preview.json` |
| 本轮范围／数据哈希核对 | 128 个非授权产品／数据文件与基线相同，10 个 manifest 资产匹配，正常及延迟 Bologna 临时数据库与源库字节相同；`scope.json`、`raw/final-checks.txt` |

源库 SHA-256：`b8b44b814f2fa6286decf877364665ad8276977c08913d02d7b8a90db62a755d`。两份新测试库均来自此 Bologna CC0 源，保持 **19 文档／317 编码／874 标注**；无新编码、统计、导出或绘图。模型密钥在测试后端关闭，Guide 路径不存在。未修改或重建报告／数据卡，未改录屏素材。

## 范围与剩余项

只有 `website/start.js` 改变产品行为；另有一份 Node 回归、一份真实验收工具与审核文档。完整提交哈希和干净工作树见审核包 `COMMITS.md`、`post-commit.json`。截图／日志／JSON 证据在仓库外；临时数据库和快照不收入审核包。

UX17-05 本轮关闭，UX17-01…04 既有关闭记录保持。**不代表整个项目全部完成**：T03 明确已读／范围概览、其余 W03 视觉、用户／supervisor 审美及独立试用、实体设备／VoiceOver／系统减少动态／OS 下载提示、正式发布门禁仍开放。手机是模拟，不声称真机通过；Windows 暂缓且未验证。其余功能不动，不推送、不部署，不改自动部署配置。
