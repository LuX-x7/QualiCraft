# UX-25 · Coding 阅读栏、位置记忆与手机文档切换

后续设计（UX-31，2026-10-16）：明确已读／编码范围已有 [方案与18条待实施标准](UX-31-READING-STATE-DESIGN.md)及[静态稿](UX-31-READING-MOCKUP.html)，但没有新增功能。下文UX-25的位置记忆仍只在浏览器；当前项目格式仍v4。不能把方案状态当作实装能力。Windows暂缓，不推送、不部署。

2026-10-16。基线 `2478ef71d8e20d7337adaa507432cd509d8726da`；本轮完整提交见 Git 与审核包 `COMMITS.md`。

## 范围与结果

用户明确授权本轮 Coding 界面和阅读导航修改。产品只改 `web/app.js`、`web/style.css`；统计、绘图、CSV、网站与报告资产不动。所有可编辑验收均使用 Bologna CC0 临时副本；实际编码／合并、笔记和新增导入分别使用额外恢复的副本。没有推送、部署或修改自动部署配置。Windows 暂缓、未验证。

- 合并文档标签和阅读定位，收紧重复项目标题；常驻栏显示当前文档、真实段落序号及完整编码路径。悬浮或键盘聚焦标注时显示准确路径；其余时间显示当前位置实际标注，筛选时明确写 Filter。长路径可独立滚动，键盘可聚焦。
- 原文搜索、创建编码、AI 入口保留；手机编码工具按需展开。元数据与原阅读笔记收到 Document details & notes；导入结果仍展开详情并聚焦文档标题。
- 原生文档选择器列出全部文档，与侧栏使用同一稳定 ID。桌面／手机切换、重新载入与横竖布局切换均保留段落上下文。
- 本机浏览器 `localStorage` 按项目 ID／文档 ID 保存段落起始 code-point 偏移、文本长度和内容指纹，并保存该项目最近打开文档 ID。只恢复当前项目内存在的文档与有效段落；同长度文本改变、损坏／越界记录均不复用。原文和引句不写入导航存储。浏览器禁用或清理存储后正常阅读，Resume 不虚报保存成功。
- 搜索及编码筛选不覆盖原文位置；关系图定位原句优先于位置恢复，返回关系图仍有效。手机只用一个页面滚动容器，并在吸顶前后重新测量恢复位置。
- 快速切换文档／项目时，阅读笔记的延迟请求捕获原项目、文档及输入值；各文档独立排队，避免错写或取消另一文档的待保存笔记。保存接口与项目字段不变。

**位置不是已读。** 没有新增已读标记、完成度、编码范围缩略条或 schema；浏览器位置不进入项目 JSON／备份／导出，也不跨浏览器或设备同步。启动时选择哪个项目仍沿用既有规则；只恢复已加载项目中的最近文档。T03 本轮授权的定位部分完成，明确已读和范围概览另列待做。

## 验收与原始输出

证据根：`~/qualicraft-review/ux-25/`。执行使用现有 bundled Node 与 `/private/tmp/qualicraft-read-values-venv/bin/python`；精确命令、退出码与输出索引见 `raw/run-index.json`。

| 检查 | 结果 | 原始记录 |
| --- | --- | --- |
| 最终 8 项新增回归在基线重放 | 8 失败，验证缺失定位能力与切换笔记问题；工作文件未回退 | `raw/reading-baseline-replay.txt` |
| `node --test tests/*.test.mjs tools/report/*.test.mjs` | 99 通过 | `raw/node-final.txt` |
| `python -m unittest discover -s tests -v` | 150 通过，3 跳过 | `raw/python.txt` |
| `node --check web/app.js` | 退出 0 | `raw/syntax-final.txt` |
| `npm run build` | 127：环境无 npm，保留失败；未改依赖 | `raw/npm-build.txt` |
| 直接执行现有 Next build | 生产构建／TypeScript 退出 0；随后重启七个已登记的项目预览 | `raw/build.txt`、`raw/restart.txt` |
| 新阅读导航 Chrome 验收 | 10/10：真实滚轮、手机触摸事件、文档／刷新恢复、键盘、悬浮、筛选、关系图原句、320–1440 边界、禁用存储、减少动态效果、笔记归属 | `final-accepted/results.json`、`raw/browser-final-accepted.txt` |
| UX-24 Coding 回归 | 11/11：317 节点／六级树、重叠标注、来源、焦点、手机树、实际鼠标编码与正常合并 | `hierarchy/results.json`、`raw/hierarchy.txt` |
| 手机未编码导入补验 | 实际导入 Bologna 文本；全部 20 文档逐项打开，未编码文档刷新和键盘可再次选择；导入结果焦点保留 | `phone-import.json`、`raw/phone-import.txt` |
| 原项目／分析／范围 | 原 Bologna 19/317/874 的完整 JSON、审计与快照列表不变；8 项分析输出、60 受保护文件、10 manifest 资产和 31 关键 JS 函数保持 | `raw/analysis-after.txt`、`scope.json`、`function-scope.json` |

这组结果关闭 UX17-03 的技术缺陷。新浏览器验收均无控制台／正常路径 HTTP 错误。手机为 Chrome 触摸模拟与视口验收，**未冒称本轮真机、VoiceOver 或系统设置人工验收**。

同设备无位置记录时，首段顶部由约 416→340 CSS px（1440×900）、628→515 CSS px（390×844）；不是研究进度指标。原始测量见 `before.json`、`final-accepted/results.json`。截图：`final-accepted/screenshots/01-desktop-compact.png`、`02-desktop-restored.png`、`04-desktop-coding-path.png`、`05-phone-compact.png`、`06-phone-sticky-reading.png`、`07-phone-restored.png`、`08-phone-landscape.png`；另有 `screenshots/11-import-focus.png` 与 `12-phone-uncoded-after-refresh.png`。

中途的测试夹具换行错误、探针文件名遮蔽 Python inspect、独立标注栏内滚轮和 CSP 等测试脚本问题，以及手机滚动容器／吸顶恢复的真实问题均保留原输出；结论以最终通过记录为准。未通过修改测试入口隐藏失败。

## 后续仍开放

明确已读／编码范围概览，T01 空项目与继续工作、T05 可跳过引导、T04 与剩余 W03 视觉统一、UX17-04 旧录屏／UX17-05 启动提示、用户视觉和新一轮真机接受、发布门禁继续开放。本轮不顺带实现。Windows 暂缓，不推送、不部署。
