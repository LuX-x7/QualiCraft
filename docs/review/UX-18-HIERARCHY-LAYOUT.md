# UX-18 · UX17-01 层级图标签布局

后续状态：UX17-02 后由 [UX-19](UX-19-MOBILE-FIGURE-VIEWER.md) 原尺寸查看器关闭；本文件保留 UX-18 当时的范围、失败记录与未完成说明。

2026-10-16。基线 `e44a787fc2d97e490fa6e68aa2ba9ac6324b8c62`。用户明确授权本轮调整工作台绘图显示路径和相关报告资产；**只关闭 UX17-01**。不改统计、CSV、分析、其他功能或部署配置，不推送、不部署。Windows 暂缓、未验证。

## 修改与结果

原布局把 8 个主题放进固定高度的 2×4 网格；其中 materials 有 115 个编码，换行后标签互相覆盖。现在用选定字体的实际文本尺寸计算每行高度，按完整标签分配空间，将主题放入两个等宽、独立堆叠的列。每个主题保留原计数排序、完整名称、逐条数值与主题合计；标题、坐标文字、脚注使用实际物理间距。层级图的网格线不再穿过数值。

预览、导出包和独立脚本仍共用同一条渲染路径。其他四类图继续走原 tight_layout；仅层级图跳过二次压缩。完整 Bologna 的 **259 条 CSV 行全部保留**。9/10 pt 的实际 PDF 均无文字碰撞或裁切，8 个面板对齐检查通过。图幅随实际行数增长，不将全部标签重新挤进一张固定高度图；这也意味着原有手机整图缩小问题 **UX17-02 仍存在**，不能用本次修复宣称手机小字问题已解决。

只更新报告层级 SVG、manifest 和两份原句例证 JSON 的 manifest 哈希。五份 CSV、五图原有 numbers/credit 字段、其他四张 SVG 均与基线逐字节或逐字段一致；项目 JSON、原始标注和数据卡片不变。图注继续来自现有 CREDIT。

## 数据与环境

- 可编辑 Bologna CC0 临时副本：`/tmp/qualicraft-ux18/data/qualicraft.sqlite3`，19 文档 / 317 编码 / 874 标注；本轮只预览、选择和导出，没有新增研究记录。
- 独立验收入口 `http://127.0.0.1:4451/`，后端 `127.0.0.1:8851/w`；常用 4445 预览也已重启并加载最终代码，保留原临时数据目录。构建后重启现有项目 Next 进程，避免陈旧清单。
- 受控 Chrome 仅访问本项目来源，不读取其他窗口/标签页。桌面 1440×900、手机 390×844 触摸上下文；手机为模拟，不能代替真机。
- Python `/private/tmp/qualicraft-read-values-venv/bin/python`，matplotlib 3.11.2；实际字体 PingFang SC。原数据库 SHA-256 保持 `b8b44b814f2fa6286decf877364665ad8276977c08913d02d7b8a90db62a755d`。
- 证据、实际下载、完整脚本和截图在 `~/qualicraft-review/ux-18/`；不进 Git。命令与退出码见 `raw/run-index.json`。

## 回归与验收

| 命令 / 检查 | 结果与原始证据 |
| --- | --- |
| `python -m unittest discover -s tests -p test_hierarchy_layout.py -v`，先运行旧实现 | 2 个测试、3 处失败（Bologna 9/10 pt 和窄图大字长标签）；`raw/regression-before.txt`，exit 1 |
| 同一新增测试与最终全套测试 | 最终 `python -m unittest discover -s tests -v`：150 项，跳过 3，exit 0；覆盖完整标签/计数、相邻及跨主题碰撞、边界、长标题、零值和相同值；`raw/python-all.txt` |
| `python -m unittest discover -s tests -t .` | 当前环境同样运行 150 项、跳过 3，exit 0；`raw/python-legacy-collection.txt`。未改测试入口；UX-09 以前的收集失败历史保留在旧审核材料中 |
| `node --test tests/*.test.mjs tools/report/*.test.mjs` | 74/74，exit 0；包括新版 SVG 的全部 259 个条形与 CSV 身份/数值/位置验证；`raw/node-all.txt` |
| `node --check web/app.js` | exit 0；`raw/node-check.txt` 与命令索引 |
| `npm run build` | 环境无 npm，exit 127，保留 `raw/npm-build.txt`；没有伪称该命令通过 |
| `node node_modules/next/dist/bin/next build`（website 下） | 执行 package.json 相同的 Next 生产构建目标，exit 0；`raw/next-build.txt` |
| `rebuild_report.py`，现有 builder 改用临时数据库并先输出至临时目录 | 五 CSV、全部 numbers/credit 和其他四 SVG 保持一致；只拷回层级 SVG/manifest，并重绑例证来源哈希；`raw/rebuild-report.txt`、`asset-comparison.json` |
| `render_final.py`、PDF 字号/碰撞检查 | 最终 9/10 pt：面板对齐 PASS、字号下限 8 pt、文字碰撞/裁切 FAIL 0 / WARN 0；`after/9/`、`after/10/` 中有 JSON、PDF 标记层和原图 |
| `browser.py` | 5/5，exit 0；桌面预览、键盘导出、报告读值/行定位、手机触摸预览/下载、手机报告/原图下载；控制台/HTTP 错误为空，桌面/手机横向溢出均 0；`browser-results.json`、`raw/browser.txt` |
| `standalone.py` | exit 0；实际运行浏览器下载的独立脚本，SVG/PDF/PNG 三份均与导出逐字节一致；`standalone-results.json`、`raw/standalone.txt` |
| 必需的 `grep -rniE "publication-grade|publication-ready|publication-oriented|put in a paper|期刊" website/` | 无匹配，exit 1；`raw/forbidden-copy.txt` 与命令索引 |

浏览器逐项核对完整 259 行表和首/中/末三次数值，Enter 定位并聚焦对应表格行；真实保存桌面/手机 ZIP，核对 CRC、五类文件、CSV 字节和预览/导出 SVG。手机继续保留原有图幅缩小现象，截图如实记录。原 SVG 和计数下载入口保留。

截图重点：`01-workbench-desktop.png`、`03-report-keyboard-row.png`、`05-report-original-desktop.png`、`06-workbench-phone.png`、`07-report-phone-row.png`；`09-native-after-top/dense/bottom.png` 为 Python 从实际 PDF 渲染的局部，便于原尺寸核查，不是另一套绘图实现。修复前原图及失败输出一并保留。

## 验收中发现并处理的事项

- 新测试最初将 `write_text` 的编码参数换行书写，触发现有静态 UTF-8 检查；已调整新测试的书写格式，没有修改原检查或测试入口。首次失败保留在 `raw/python-all-first.txt`。
- 沙箱字体列表缺少实际可用的 PingFang，曾回退到另一字体。最终使用与本机工作台相同的字体访问权限重跑；其余四图字节一致。前期输出保留在 `qa/attempt1/`。
- 通用科研图源码检查偏好 PDF Type42；本机 CFF 字体在该方式下实际出现错误字形，因此最终保留项目原有 Type3。**通用源码检查仍有 1 项不满足（Type42），没有将它记成全绿**；原始报告在 `source-audit.txt`。三项 WARN 是其通用 TIFF/静态 DPI/固定期刊宽度要求，超出本轮格式与动态布局范围。实际 PDF 字形已目视核查，字号和碰撞检查通过，独立脚本仍重现原格式；不作额外字体编辑性或投稿合规承诺。Type42 尝试没有留在功能代码中。
- 去除零长度刻度会让 matplotlib 输出自闭合 SVG 分组，不兼容既有严格读值解析器；最终保留原刻度结构、增加标签间距，74 项前端测试通过，没有放宽解析器或改报告交互代码。
- 浏览器前两次采集到空 HTTP 响应体，第三次直接 fetch Blob 被现有 CSP 正常阻止；这些是验收采集方式的问题，原始失败均保留。最终用只读观察器记录页面实际创建的 SVG Blob，再与导出比对；未放宽 CSP、未改产品逻辑。
- `git diff --check` 对 matplotlib 原样生成的 SVG 路径行报告尾随空格（exit 2），保留 `raw/whitespace-all.txt`；排除该生成 SVG 后源码/文档检查 exit 0。没有手工清洗 SVG，以保持其与独立脚本输出一致；文件哈希和读值几何另行验证通过。

## 范围与后续

本轮功能代码仅 `qualicraft/plotting.py` 的层级显示布局及共用 finish 的可选跳过布局分支。`qualicraft/analyze.py`、`core.py`、`server.py`、`web/`、其余绘图主体、五 CSV、原 DB、录屏、依赖清单及 `render.yaml` 均未改。

UX17-01 已按本轮标准关闭。UX17-02 手机原图查看、UX17-03 手机文档入口、UX17-04 旧录屏、UX17-05 健康探针继续待办，未在本轮修复；实际设备、用户视觉接受和正式发布门禁另列。Windows 暂缓、不推送、不部署。完整本地提交哈希见 Git 和审核包 `COMMITS.md`，本文件不写入自身提交哈希。
