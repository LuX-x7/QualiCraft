# T7-11 — 补齐导入与导出完成结果

素材版本更新（2026-10-16）：当前网站五段媒体已由 [UX-29](UX-29-CURRENT-QT-RECORDINGS.md)替换为当前 QT 界面，保留真实首帧静态替代。下方尺寸、哈希、截图和旧版呈现均为本轮次当时的历史证据，不适用于当前媒体。原始素材／历史提交保留。

基线：`bcd626d3ecdc6953e55e95c5461d73f67b6cee53`。本轮补录两段结果画面并接入网站，五模块现均有已审核的真实视频和静帧。未修改工作台代码、分析行为、原始数据、图表、报告资产、数据卡片或部署配置；未推送、未部署。

## 实际操作和数据来源

只使用仓库 `demo-data/qualicraft.sqlite3` 内的 Bologna CC0 项目。原数据库 SHA-256 为 `b8b44b814f2fa6286decf877364665ad8276977c08913d02d7b8a90db62a755d`。SQLite 以只读连接复制到隔离的临时目录，在 `127.0.0.1:8811/w/?lang=en` 启动现有工作台。

导入通过界面创建 `Bologna · import example`，再用原生文件选择器导入从 Bologna 原项目提取的 `interview02.txt`（18582 字节，SHA-256 `f43f005420b55b9fb7c8346d7f9e5c4c0cfb73f46bc295c8ca9c45e561734036`）。点击 Import locally 后，对话框关闭，文档名称为 `interview02`，显示 18,239 字符和 31 段。持久化后的文本与源文档逐字相同。

导出切回原始 Bologna 项目，通过界面依次下载四种文件，并用浏览器的 download 事件等待实际下载完成。项目 JSON 与原项目完全相同：schema v4、19 文档、317 编码、874 标注。两个 CSV 与工作台输出逐字节相同；方法记录正文相同，动态生成时间单独验证。原 Bologna 项目及数据库保持不变。

| 实际下载文件 | 字节 | SHA-256 |
| --- | ---: | --- |
| qualicraft-project.json | 1134907 | `c8cae239363e34185b76a80aa298434f559139e8d2b8a3746d6624866ebdb186` |
| qualicraft-csv.csv | 463850 | `2e42f72b7a4a3529709d935161653af6d96d4c153e15a45e9996d3dd5ec65c45` |
| qualicraft-matrix.csv | 24183 | `2fbae2743715ab85c47114365d4b046e17c90deaa93f45f1afc7ffe0dafa5653` |
| qualicraft-methods.md | 62617 | `de24076d448d89467f9ba46cf558be475903c31fbae680252008ce1a3aa690ea` |

为避免显示用户下载目录里的其他内容，只把这四份完成下载的文件原样复制到隔离目录，校验哈希后，用 Python 标准目录视图在 `127.0.0.1:8812/Bologna-exports/` 展示。导出视频明确是下载完成后的文件结果，网站说明和可访问名称均如此标注。未伪造工作台文件管理功能，未手写文件列表界面。

## 录制与生产资产

`tools/e2e/record_completed_modules.mjs` 在 CUA 中连续捕获实际标签页，记录每帧的真实时间和 SHA-256；不会修改 DOM。导入录制文档阅读区（实际视口 1200×820，取 x=254、y=54、946×741 区域），中途实际滚动阅读。导出录制完整 720×420 文件视图，中途通过 Tab 聚焦文件；下方空间保留给播放器控件。

导入捕获 33 帧、3023.615 ms；导出捕获 42 帧、3074.413 ms。源帧与 trace 保存在仓库外。`tools/e2e/encode_completed_modules.py` 先验证源帧哈希，再按真实时间采样为 12 fps、36 帧的约 3 秒 VP9 WebM。没有插画、重绘、遮罩或跨场景拼接。浏览器报告最后呈现时间 2.917 秒；验收允许视频已正常播完的状态。

静帧直接取最终视频第一帧，解码像素校验相同。新增资产如下：

| 文件（`website/public/clips/`） | 字节 | SHA-256 |
| --- | ---: | --- |
| import.webm | 323876 | `e284c2b9f2ccec72de7b59a7cc28953893b7de6e630280901f917da0e96c6c0f` |
| import.png | 277299 | `840fb6aece52aa699b60e6c24f4fd5c5bdfbd607af04eb8b2b9bc83f49d9f950` |
| export.webm | 34129 | `1d2860e2455f1e5c7c7d34da67d1289def82d77341137412cfed81f46863881d` |
| export.png | 50528 | `e4285ba0955e7bc99d0dca7d34d789e1e321149825bf1fbeeb38be6d85f3fcf9` |

两个片段全部 72 帧经 OCR 未检出汉字或网站禁用措辞；结果始终可见，无灰罩。进入录制前和结束后还检查了实际 DOM：无打开的对话框、无汉字、无禁用措辞。原有编码、分析、绘图三段媒体未改。

网站移除导入、导出待替换提示，提供两段的新静帧及原有静帧切换、全尺寸链接和错误回退。TXT 按原样保留 Markdown 标记，因此导入模块提示修正为“保留原文”，不再承诺剥离格式。桌面选择首步骤或按 Home 时定位到步骤顶部，防止较高的导入画面使静帧按钮落到视口下方。

## 验收与原始证据

完整证据位于 `~/qualicraft-review/module-completion/`，包含源帧、trace、下载产物及其证明、命令原始输出、验收截图和完整提交回执。验收媒体不进仓库；本轮授权接入的四个网站生产资产例外。

| 检查 | 证据与结果 |
| --- | --- |
| 实际导入与四份下载内容 | `raw/import-export-verified.txt`：通过，退出码 0 |
| 连续源画面、真实首帧、体积 | `raw/media-check-final.txt`：72 个编码帧与源捕获按时间采样后的像素相同，两张静帧与视频第一帧相同；两个 WebM 均小于 1.5 MB，退出码 0 |
| 全部新增视频帧 OCR | `raw/ocr-final.txt`：72 帧无汉字、无禁用措辞，退出码 0；审查联系表在 `source/` |
| 桌面 1440×900 / 手机 390×844 | `browser/checks.json`、`raw/browser-validation.txt`：五段均实际播放；没有占位框或自动播放；无横向溢出 |
| 键盘 | 同上：两种宽度方向键、Home、End；视频 Space、静帧 Enter、桌面 Tab 到媒体操作通过。手机菜单也经 Enter 打开并进入报告 |
| 最终首模块可见性 | `browser/checks.json`：重新构建后复核首模块静帧按钮处于视口内；更新四张模块验收截图 |
| 控制台与页面 | `browser/checks.json`：正常浏览无 warning/error；桌面、手机首页与报告截图在 `browser/` |
| HTTP、媒体、数据契约 | `raw/http-and-protected-scope.txt`：页面 200，十个媒体文件与磁盘相同，五段视频 Range 请求 206；报告清单十个文件哈希全部正确；下载目录内容与实际下载哈希相同 |
| 工具语法 | `raw/recorder-syntax.txt`、`raw/encoder-syntax.txt`：node --check 与 py_compile 退出码 0 |
| 生产构建 | `raw/build-final.txt`：npm run build 退出码 0；已有 middleware 迁移提示保留 |
| 禁用措辞与补丁格式 | `raw/forbidden-copy.txt`：无匹配，退出码 1；`raw/staged-check.txt`：退出码 0 |
| 范围与提交 | `raw/final-scope.txt`、`raw/commit.txt`：仅十个授权文件；工作台、原数据、图表路径与部署配置未改，完整提交哈希见回执 |

初次下载校验脚本错误地比较了 CSV 的字符串与 bytes，随后又把带动态生成时间的方法记录作全字符串比较；这两次失败分别保留在 `raw/import-export-proof.txt`、`raw/import-export-proof-final.txt`。按现有导出契约修正临时校验脚本后通过，没有为此修改工作台或下载文件。

Windows 未验证；减少动态效果偏好的运行时模拟仍未验证，继承的手动静帧路径已在两种宽度实际验收。未启动分析或绘图的新行为。
