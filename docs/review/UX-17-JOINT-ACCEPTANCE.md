# UX-17 · 网站、报告与工作台联合验收

后续状态（2026-10-16）：**UX17-01 已由 [UX-18](UX-18-HIERARCHY-LAYOUT.md)、UX17-02 已由 [UX-19](UX-19-MOBILE-FIGURE-VIEWER.md) 修复并验收**；UX17-03、04/05 继续待办。以下保留 UX-17 原轮次的失败、截图与结论，不作为修复后的当前结果。

2026-10-16。应用基线：`4a7936878b658099943e1bab1efaf7d09420839a`。本轮仅走查、取证与更新文档；不改功能、统计、绘图或报告资产，不推送、不部署。Windows 继续暂缓、未验证。

**结论：主操作路径 8/8 通过，但仍有三项 P2 可用性问题，不应把“文件能生成”当作五图展示质量全部通过。** 可以带着本清单进行 supervisor 审核讨论；尚不能声称全部体验问题或发布门禁已关闭。

## 环境和证据

- 新 Bologna CC0 临时副本：`/tmp/qualicraft-ux17/data/qualicraft.sqlite3`。仅监听本机，网站/报告/工作台统一入口 `http://127.0.0.1:4450/`，后端 `127.0.0.1:8850/w`；无模型密钥。原有 4445 会话未改写。
- 初始 19 文档、317 编码、874 标注；导入后 20 文档，鼠标选区后 876 标注。两条新标注仅用于验证操作与范围保存，**不是审核通过的研究解释**。原 19 份文档、317 个编码及前 874 条标注均保留。
- 完整证据：`~/qualicraft-review/ux-17/`。`results.json`、`raw/joint-first.txt` 为主路径；`readability.json`、`raw/readability-final.txt` 为补充可读性走查；`raw/run-index.json` 记录命令与退出码。截图和实际下载不进 Git。
- 浏览器为新建的受控 Chrome，仅允许访问本项目 4450 回环来源，不连接或读取其他窗口/标签页。1440×900 桌面与 390×844 手机触摸上下文；后者是模拟，不是真机验收。

## 按指定顺序的结果

| 环节 | 实际操作与核对 | 结果 / 证据 |
| --- | --- | --- |
| 网站入口 | 首页 → Analysis 示意 → 实际工作台；现有 Bologna 项目可读，无云模型密钥 | 通过；`01-home-desktop.png`、`02-site-analysis-desktop.png` |
| 导入 | 选择 Bologna interview02.txt，核对 TXT 预览；Enter 导入，直接显示真实文档与本地回执 | 通过；18,239 字符，内容 SHA-256 与输入一致；`03-import-preview.png`、`04-import-result.png` |
| 编码 | 两次真实鼠标拖拽，使用键盘选择两个现有编码；独立核对保存的文档 ID、编码 ID、Unicode 范围与原句 | 通过；两条标注范围均 `[2,38)`，同一原句两码；`05-mouse-coding-popup.png`、`06-coded-source.png` |
| 关系图 | 选择编码 → 选新增标注 → 完整原句 → 定位高亮 → 返回关系图 | 通过；1 个原句范围 / 2 条标注明确，选择保留；1,143 节点、1,421 连线均有实际端点；`07-network-evidence.png`、`08-source-location.png` |
| 五类图 | 依次频次、覆盖、共现、层级、累计；每类等待真实后端 SVG 预览，再下载完整 ZIP | 生成与导出通过；五 ZIP CRC 正常，各含 SVG/PDF/PNG/CSV/Python；PNG 头正确，脚本可编译。本轮未另外执行已下载脚本。CSV 行数依次 15/300/18/259/20；`09-workbench-*.png`、`downloads/*.zip`。层级标签质量另列未通过 |
| 报告读值 | 五类完整表逐格对 CSV；每类首/中/末各选一行，核对准确数值与选中行，键盘箭头和定位计数行；保留原 SVG/CSV | 通过；594 行（15/285/16/259/19），15 次抽样读值、键盘和行定位；10 份原资产 HTTP 200 且字节一致，manifest 的 10 份 SHA-256 也匹配；`10-report-*.png`、`11-report-source.png`、`raw/manifest-check.json` |
| 导出 | JSON、标注 CSV、矩阵 CSV、方法 Markdown；实际保存下载，逐字节对独立 API 响应；JSON 包含新增文档和两条标注，原记录保留 | 通过；四文件及完整 SHA-256 见 `results.json`；`12-export-result.png` |
| 手机与跨页复核 | 首页关系示意触摸、工作台关系图定位、覆盖图生成、报告最后一条覆盖值及表行定位 | 路径通过，工作台/报告页面横向溢出均 0，正常浏览器警告/错误及 HTTP 错误均为空；`13…19` 手机截图。图表字太小与文档入口缺失仍另列问题 |

报告是 manifest 固定的 **19 文档 / 874 标注示例**，本次工作副本为 **20 文档 / 876 标注**。`/report` 不会自动吸收工作台的新编码；这不是计数丢失。本轮没有重建报告，静态示例和实际项目必须分开讲解。是否需要用户项目报告入口，属于后续产品讨论。

## 剩余问题清单

优先级 P2 表示需要修复的可用性/图表表达问题；P3 为后续一致性/维护问题。均未在本轮修复。

| ID / 优先级 | 复现与影响 | 证据 | 建议及关闭标准 |
| --- | --- | --- | --- |
| **UX17-01 / P2：层级图标签重叠** | 桌面 Figures → Theme hierarchy，默认 9 pt；copyright/privacy、materials 等多编码面板的长标签严重重叠。问题也存在于导出 SVG，不只是预览缩放，不能作为清晰的完整层级图交付 | `screenshots/09-workbench-hierarchy.png`、`19-hierarchy-actual-1440.png`、`downloads/hierarchy.zip`；`readability.json` 的原始 SVG 文本基线小于 9 单位字号，多个面板碰撞 | 下一轮优先解决布局：按实际标签/行数分配面板高度、换行/分页等；需单独授权修改绘图显示路径。保持统计定义与 CSV 字节不变；完整 Bologna 所有标签、计数无碰撞，SVG/PDF/PNG 均验收 |
| **UX17-02 / P2：手机工作台图表被整体缩小** | 390px Figures → Code × interview / Theme hierarchy。预览宽仅 240 CSS px；9 SVG 单位字号约缩为 2.42 / 2.75 CSS px。页面虽不溢出，标签无法正常阅读 | `screenshots/19-coverage-actual-390.png`、`19-hierarchy-actual-390.png`；`readability.json` 的图像尺寸与 viewBox 估算 | 给原图可放大/横向查看或原尺寸独立入口，保留下载；不拉伸、不裁掉图例，不改统计/绘图数据。用原尺寸与手机实测标签可读、焦点和触摸入口可用。现阶段可用报告计数表或下载原 SVG 查看 |
| **UX17-03 / P2：手机缺少直接的文档切换入口** | 390px 刷新 Coding，显示第一文档；桌面 20 个文档按钮在手机均隐藏，现有选择器是项目/建议状态，没有文档选择器。已有标注可经关系图绕行定位，但无法直接浏览全部文档，未编码文档尤其难找 | `screenshots/18-document-navigation-phone.png`；`readability.json`：桌面可见文档按钮 20，手机 0，以及选择器清单；对应 `web/style.css` 的窄屏侧栏隐藏规则 | 增加手机文档选择器或可访问文档列表；应能直接打开所有 20 份文档及未编码文档，导入后刷新仍能再次选择；验证触摸、键盘和焦点，不改变文本/标注 |
| **UX17-04 / P3：旧录屏未跟随新界面更新** | 可展开工作台录屏仍为早期界面；Import/Export 没有 UX-12 的新结果反馈，Analysis 录屏描述仍是频次结果，和目前关系图演示主线不同 | 当前 `website/lib/site/clips.ts` 与原 `website/public/clips/` 未变；UX-12 已明确登记旧版本 | 另轮更新重点片段，或明确标注旧界面；Bologna、结果可见、静态替代与键盘入口要求保留。本轮未重录 |
| **UX17-05 / P3：启动健康探针误报 404** | 网站启动探测后端根 `/api/health` 得 404，但真实代理 bootstrap 与网站自身 health 均 200，容易被误认作服务故障 | `raw/health-probe.json`：8850/api/health=404，4450/w/api/bootstrap=200，4450/api/health=200；正常用户流程无 HTTP 错误 | 另轮对齐探针和现有实际健康入口；不能靠隐藏告警掩盖真实故障；启动诊断和真实访问状态一致 |

## 未验证与验收边界

- 用户对视觉方向的接受、实际 QT 试用和设备信息尚未关闭；手机真机触摸、VoiceOver、系统减少动态效果切换及 OS 下载完成提示没有在本轮验证。浏览器已能完成真实下载，应用回执仍只报告“Sent to browser”。
- Windows 暂缓、未验证；没有推送或部署。公开下载/域名等正式发布门禁仍单列。
- 本轮没有改应用代码，未重复跑全量单测或构建。最近一次基线 UX-12 的 148 Python（3 跳过）、74 Node、语法与直接 Next 构建结果仍有效，但不是本轮新运行；npm 缺失的原始失败保留在 UX-12。本轮运行的是现有生产构建及实际联合浏览器/导出检查。
- 首次补充 SVG 采集器把 transform 文本的缺省 y 误记为 0；已按实际 translate 坐标校正并重新采集，`raw/readability-first-parser.txt` 仅作原始历史，结论引用 `raw/readability-final.txt` / `readability.json`。功能代码未因此改动。
- 原数据库 SHA-256 仍为 `b8b44b814f2fa6286decf877364665ad8276977c08913d02d7b8a90db62a755d`；完整范围与文档提交证据随审核包保存。

建议下一轮先处理 UX17-01，再处理 UX17-02/03；同时可将当前版本、截图和这份问题清单交给 supervisor，明确演示范围与图表限制。
