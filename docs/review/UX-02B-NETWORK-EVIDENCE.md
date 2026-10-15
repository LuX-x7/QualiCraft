# UX-02B · 关系图回到原句

2026-10-15。用户授权继续第 2B 阶段；本轮关闭 **UX-01-02、UX-01-03**。基线 `afee5fd1a2d54ab4bccae2a859098b2af6a64919`，本地提交见 Git 与仓库外 `raw/local-commit.txt`。不推送、不部署。

## 交付

Insights 默认进入 Relationship map，频次与矩阵各有独立按钮，完整记录仍可到达。完整 Bologna 实测频次 317 行、矩阵 19 行 × 318 列（含文档名列）。关系图无需滚过这些记录才能找到。

选主题后，证据列表包含该主题自身与所有后代编码的已保存标注；选编码只列该编码的直接标注，与现有网络编码权重一致。每条证据可展开完整原句、文档名、完整编码路径和原始 Unicode 字符范围。图上原句点也可打开对应证据。图最多展开 14 个原句点的既有规则保留，证据列表不受该上限截断。

“Open in document”切换到正确文档、清除遮挡原句的搜索与筛选，并将准确标注范围加深高亮和聚焦。重叠标注可能将同一范围拆成几个 mark，合起来仍等于原句。“Back to relationship map”恢复先前阅读文档/筛选，保留图的选择、展开节点、证据及坐标。同一项目修订内复用图状态；项目变化时重新加载。迟到的旧响应不能覆盖新视图。

## 数据边界

- 只在 `server.py` 的网络响应层追加 `annotation_id`、`document_id`、`start`、`end`；不修改 `analyze.py`、tidy 合约、聚合、图形导出或保存的 schema v4。
- 原句按 annotation ID + document ID + code ID + 原始范围核对；前端用 Unicode code point 切片，并核对保存原句。缺失或不一致时禁用定位，不按名称或 80 字符图标签猜来源。
- 临时库从上一轮 Bologna 验收副本复制。两个 `UX-02A` 测试项目名称保留，包含的文本均来自 Bologna CC0，测试标签不作为研究结论。另一个完整 Bologna 项目仍为 19 文档、317 编码、874 标注、337 审计。
- 原 `demo-data/qualicraft.sqlite3` SHA-256 仍为 `b8b44b814f2fa6286decf877364665ad8276977c08913d02d7b8a90db62a755d`。
- `raw/data-baseline.txt`、`raw/data-after.txt`：三个项目 JSON、审计与快照数一致；15 份计数 CSV 哈希一致；883 条网络原句引用逐条准确；去掉新增元数据后，网络节点/权重/ID/连线与既有生成结果相等，所有边均指向实际节点。均退出 0。

## 回归与验收证据

证据根目录：`~/qualicraft-review/ux-02b/`。截图不进仓库。

| 命令 / 检查 | 结果 | 原始输出 |
| --- | --- | --- |
| `python -m unittest discover -s tests -p test_network_evidence.py -v` 修复前 | 5 项报错，缺少响应 helper/来源字段 | `raw/backend-before.txt`，退出 1 |
| `node --test tests/network_evidence.test.mjs` 修复前 | 最初 9 项均失败，缺入口与证据函数 | `raw/frontend-before.txt`，退出 1 |
| 针对性后端回归修复后 | 5/5 通过；同名同文本跨文档、Unicode、遗失编码、无原句模式、HTTP 只读 | `raw/backend-after.txt`，退出 0 |
| `node --test tests/network_evidence.test.mjs tests/theme_filter.test.mjs` | 12 项来源导航/缓存回归 + 上轮 9 项筛选回归通过 | `raw/frontend-final.txt` 及最终复核，退出 0 |
| `python -m unittest discover -s tests -v` | 134 项，跳过 3，其他通过 | `raw/backend-full.txt`，退出 0 |
| `node --check web/app.js` | 通过 | `raw/syntax.txt` 及最终复核，退出 0 |
| `python -m unittest discover -s tests -t .` | 仍为已知收集失败，未改入口 | `raw/known-collection-failure.txt`，退出 1 |
| 桌面 Chrome / 390 × 844 | 证据、准确定位、返回、清除、视图切换可用；无页面横向溢出 | `screenshots/observations.json`、各 `.dom.txt` |
| 键盘 | Enter 展开证据、打开原文、返回与清除通过；焦点回到 mark / 证据按钮；Tab 可继续到证据按钮 | 同上；S12/S13/S14 |
| 控制台 | 本轮 warn/error 记录为空 | `screenshots/console.json` |
| 受保护范围 | 统计、绘图、core、数据卡、网站、示例库和部署配置未改 | `raw/scope.txt`，退出 0 |

桌面自然视口记录为 1512 × 857，浏览器工具操作后为 1512 × 801；截图按实际尺寸保存。手机为 Chrome 390 × 844 视口，不等于真机触摸。原生选择器的方向键尝试未观察到值变化，**不据此声称 2C 的完整键盘选择验收通过**；2B 的证据/定位/返回按钮路径已用 Enter 验证。2C 仍需完成命名、选择/展开/清除及单位说明。Windows 按用户最新要求暂缓，保持未验证；屏幕阅读器和物理触屏未验证。

网站未改，本轮未重跑 Next 构建；使用既有构建的 `/w` 代理测试更新后的工作台。图布局和拖拽的原有力模拟保留，新定位高亮不增加动态效果。减少动态效果的全图行为在 2C/5 继续核查。

主要截图：

- `S01-theme-descendants.jpg`：主题列表 6 条，自身/后代/跨文档。
- `S04-evidence-detail.jpg`、`S05-source-highlight.jpg`：测试项目跨文档证据与定位。
- `S09-full-bologna-map-entry.jpg`：完整 Bologna 的直接入口。
- `S10-bologna-full-evidence.jpg`、`S11-bologna-source.jpg`：完整 300 字符原句 `[25152,25452)` 与准确高亮。
- `S12-mobile-evidence-keyboard.jpg`、`S13-mobile-source.jpg`、`S14-mobile-evidence.jpg`：窄屏与键盘。

执行记录保留一个验收脚本准备失误：`raw/data-before.txt` 退出 2（临时脚本尚未写入）；随后 `raw/data-baseline.txt` 退出 0，之后开始的数据对照有效。另一次写入证据目录的自动审批超时，未执行；重试获准后完成。没有删除失败记录或把失败算作功能通过。

## 后续

2C：关系图单位与完整替代操作；2D：默认能力块/方法叙述事实校正。网站精简、五模块统一、另外三图读值、报告例证与视觉统一仍在总计划中。本轮不把这些待办标为完成。总计划已按用户周末前交付 supervisor 的要求改为冲刺排程，Windows 暂缓。
