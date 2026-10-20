# UX83 — 75D Coding 窗口恢复

2026-10-20。已实现／测试通过／已上线QT。仅 Bologna 临时副本，Windows 操作系统继续暂缓。

## 复现与修复

旧实现跨1000px整页render，段落13位置7612变为0，待编码Range折叠为空，树搜索失去焦点且入口关闭。`before.py`退出0及`before/results.json`记录实际复现；`raw/tests-before.txt`记录旧实现回归失败。早期脚本把Range仍连接误判为断开，已修正断言并保留原失败日志。

- 调整窗口仅移动同一个树面板节点，保留搜索、光标、展开状态；不重建正文、候选列表或未保存表单。
- 缩放、窗口失焦前保留稳定段落锚点，布局稳定或回到窗口后恢复；修复窄屏实际滚动容器定位。正常阅读手势取消待恢复动作，继续更新阅读位置。
- 返回点绑定项目、文档、正文及当前reader；换文档后旧回调不能覆盖新位置。阅读概览／当前控件保留，不强制拉走焦点。
- 新状态仅在界面内存中，保留搜索、筛选、Keep／Resume及阅读标记含义；不新增保存、API、格式或分析。

## 本地验收

`node --test tests/*.test.mjs`316项通过，新增13条；`python -m unittest discover -s tests -v`341项、3原有跳过，123.913秒，退出0。JS语法、diff检查及Next生产构建退出0（无npm，使用捆绑Node直接调用Next CLI）。76份后端／语料／公开资产／Render文件与基线逐字节一致。

`after.py local`15组通过：1440／1280／1024／900／390断点、实际阅读滚动、搜索／清除／Resume、概览、唯一树输入与焦点、继续编码返回点、未保存表单、准确原句Range、候选光标及memo、文档切换、触摸模拟旋转、保存／刷新／JSON下载与健康恢复点。仅两次明确赋码产生写入，窗口操作未写项目。正常console及pageerror均0，实际响应字节与源码一致。恢复后单次编码保存1.135秒，非性能承诺。

`windows.py local`额外4组通过：两个自建有界面Chrome窗口真实focus false→true，后台调整大小返回原段落；待编码选区和候选、未保存memo及光标、两个QT标签切换保留，项目JSON完全不变。只激活测试浏览器进程，不读取其他窗口。Chrome本次visibility始终visible，不能将其写作原生后台hidden事件已观测；hidden分支由回归覆盖。早期focus仿真造成的验收脚本失败保留，关闭该仿真后验证真实失焦。

证据目录：`~/qualicraft-review/ux-83/`，原始命令输出位于raw；截图不进Git。自动化与触摸模拟不代表导师、新手、真实手机或Windows已验收。

## 同步边界

仅同步QT/releases/ux72/web/app.js及style.css，旧哈希先核验，新哈希及实际响应字节复核；回滚在QT/config/files-before-ux83-20261020/。不重启、不改网关、系统服务、其他项目、隧道或Render，不推送GitHub。线上复核结果见下方完成记录。

## 后续

75B英文教学副本、75A网站同步、75E联合验收与新手试用继续待做。延迟持续观察、Pages自动发布及服务器开机注册独立保留，不以本轮通过关闭整个项目。

## Online completion evidence

`after.py online`: 15 checks, exit 0. `windows.py online`: 4 checks, exit 0. Independent Bologna copies only. Exact annotation bounds and IDs survive refresh and JSON export; healthy recovery points remain. Console and page errors: 0. Authenticated JS/CSS responses match local bytes. Actual focus false/true recorded; Chrome visibility remained visible. One resumed coding save: 1.501 seconds (observation, not a performance guarantee).

Deployment SHA and rollback: `raw/deploy.txt`. Screenshots and assertions: `after-online/`, `windows-online/`. Earlier harness/focus-emulation diagnostic failures remain in raw logs.

| Task | Pending | Implemented | Tests passed | Online |
| --- | --- | --- | --- | --- |
| 75D window recovery / UX83 | No | Yes | Local and online | QT only |
| 75B English teaching copy | Yes | No | No | No |
| 75A website synchronization | Yes | Historical local changes | Historical records | Pending |
| 75E integrated acceptance and real novice review | Yes | No | No | No |

This does not replace integrated acceptance, real-device accessibility checks or supervisor approval. Windows remains deferred.
