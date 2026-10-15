# UX-06 · 覆盖图轴方向修复

2026-10-15。基线 `e740d89e3a7e1e00ed1007893811bc70c8535827`。用户明确允许本轮修改工作台覆盖绘图路径并重新生成报告资产；统计定义、CSV 数值、其余功能与部署设置不动。**UX-04A-L01 已修复并验收。**

## 修改与边界

`qualicraft/plotting.py` 的覆盖模板现在把显示矩阵组织为 `[编码][访谈]`，符合 imshow 的 `[y][x]`：横轴访谈、纵轴编码。分析结果和 CSV 仍为 `[文档][编码]`；只改变显示方向，不重新定义计数或排序。

用既有 `tools/report/build_assets.py` 重新生成五类资产。只有 `coverage.svg` 的字节改变；五份 CSV、另外四份 SVG、所有结果字段、原始 CREDIT 单位句完全不变。新 manifest 记录导出时的基线提交、工作树状态和准确源文件 SHA-256，避免把尚未提交的修复误记为已包含在 HEAD；报告的 Export record 展示这些信息。

首页和报告例证索引仅更新 manifest 绑定，所有原句、ID、范围、路径、来源版本和 CSV 行关系不变。报告删除旧的方向错误提示，保留静态图、CSV 选择、完整表、定位与下载；本轮不增加图上选区或新统计。

## 回归与原始证据

证据目录：`~/qualicraft-review/ux-06/`。

- `raw/before.txt`：三个新增回归在修复前全部失败，覆盖非方阵/乱序/零值、单文档、单编码。修复后通过。
- `tests/test_coverage_axes.py` 还核对 Bologna 的全部 285 个实际 SVG 图像格子颜色、显示轴与原 CSV 值；PNG 存储方向按 SVG 自身变换解释，不猜坐标。
- `raw/unit-accepted.txt`：148 项 Python，退出 0，跳过 3；`raw/node.txt`：49/49；`raw/syntax.txt`：JavaScript 语法退出 0。
- `raw/build-final.txt`：构建退出 0，已重启；`raw/forbidden-copy-final.txt`：要求的禁用词扫描退出 1、无匹配。
- `raw/audit.txt`：覆盖模板之外 plotting.py AST 不变；分析/core/schema/数据库/工作台前端、数据卡、录屏、字体、部署配置不变；五份 CSV 与四份非覆盖 SVG 字节一致；全部数值与单位句不变；原始和临时 Bologna 数据库 SHA-256 均为 `b8b44b814f2fa6286decf877364665ad8276977c08913d02d7b8a90db62a755d`。浏览器完整 594 行计数表仍逐行等于 CSV。
- `raw/downloads-final.txt`：五图包完整 HTTP 返回、ZIP CRC/脚本/PNG/PDF/SVG 检查通过，CSV 等于原基线；独立重跑覆盖导出脚本，SVG 等于新报告资产，SHA-256 为 `9d413a84151a814cf4e2eb9e5f85bc4910402812540fb7ea4bec838ea258c605`。
- 桌面 1440×900、手机 390×844：工作台和报告图均加载，无页面横向溢出；手机正值 1 与 CSV 一致；键盘表格行按钮、Next/Previous、定位、Escape 可用；首页 Coding 和报告来源例证在新绑定下仍可展开。控制台警告/错误为空。截图见 `browser/C01`…`C13`；最终构建为 C12 手机读值、C13 桌面覆盖图，读值与完整表 DOM 见 JSON。

## 保留的核查失败与限制

`targeted-final.txt` 曾按 PNG 存储顺序而未应用 SVG 垂直变换取样，修正核查坐标后通过；`unit-final.txt` 的既有编码扫描将 PIL 的二进制 Image.open 误判为文本读取，改用明确的 PNG 二进制解码接口，未修改编码检查或测试入口。`downloads.txt` 曾将工作台 9pt 与报告 10pt 混比；按相同报告参数独立重跑后字节一致。工作台与报告原有默认字号保持不变，失败输出全部保留。

当前浏览器工具对原生 select 的 End/方向键未产生选项变化，未计为通过；键盘验收使用现有表格行按钮及前后项控件完成。没有操作原生系统窗口。Windows、真机触摸和 OS 下载完成 UI 未在本轮验证；下载证据为完整 HTTP 文件及独立脚本结果。已知 `unittest -t .` 收集失败记录继续保留，未修改入口。

本地提交与完整哈希见 Git 和审核包 `COMMITS.md`。总体计划、审核提纲与审核包已更新；未推送、未部署。
