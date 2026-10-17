# UX-44 · 编码原文对照导出实现与验收

2026-10-17。基线 `eda5a556edc1c15c239aeabd0685b844abedd290`。本轮按用户授权实现 UX42 的**自包含 HTML 与可编辑 DOCX**切片，完成 Bologna 技术验收。完整提交见审核包 `COMMITS.md`。独立 PDF、语义层级设置和报告编辑后续单列；不把本轮视为全部最终标准或研究者接受。

只用 CC0 Bologna 的可编辑临时副本。未读取真实访谈，未改原项目、项目 v5 格式、统计定义、CSV、绘图代码、网站／报告资产、录屏、依赖清单或部署配置。Windows 暂缓且未验证；未推送、未部署。

## 使用入口与结果

[本轮工作台](http://127.0.0.1:64232/w/?lang=en)，选择 **Bologna · UX44 review copy** → Export → Coded transcript。

- 明确选择当前文档、所选多份或全部文档。当前文档默认全文，包括未编码语境；搜索、编码筛选、阅读位置不改变范围。多选为空时禁止下载。
- HTML 打开即可离线阅读；高亮／右树可悬浮、触摸、键盘往返定位。关闭脚本后全文、全部树和普通段落链接仍保留。手机逐段上下排列，不隐藏树或条目。
- Word 正文与右树均为可编辑文字；原句范围与 A 标识对应，长行可续页，重复表头保留文档名与续页说明。没有把正文或树做成图片。外部修改不会回写 QT。
- 保存的祖先链全部保留，显示中性 Group／Code 结构角色；**不自动把根／中间层认定为 Theme／Category**。已有研究命名不改，显式语义角色设置另做。
- 文档、标注和编码备忘录可选择包含，默认不包含。未采纳建议、阅读标记、浏览器位置、模型配置、token 和其他应用状态不进入产物。
- 文件记录项目／文档／标注／编码身份、原句 Unicode `[start,end)` 范围、完整路径、来源、生成时间和证据 SHA256。同一关联跨段重复提示仍是同一 A 标识，不增加关联总数。
- 版本指纹来自冻结的来源、编码及范围选择；生成时间不影响版本。文件名带指纹前 12 位。重新打开 Export 自动检查上次文件，证据变化时提示重新导出，旧文件保持不变。检查记录只在当前页面内存中保存；关闭页面后仍可从文件内读取完整版本，但本轮不新增项目成果库。

HTML／DOCX 是本轮冻结的格式组合。HTML 的打印样式用于普通浏览器打印，**不是本轮新增的独立 PDF 导出或固定分页承诺**。

## 实现与数据契约

`qualicraft/transcript.py` 新增只读 `qt-coded-transcript-v1` 投影。一次 GET 读取一个项目版本，按项目顺序选择文档，构建全文片段、精确高亮和实际祖先链，再由同一投影生成两种格式。DOCX 内 `customXml/item1.xml` 保留相同冻结证据，祖先 ID 可从此核对；正文树显示完整名称，关联显示完整标注／编码 ID。HTML 包含转义的本地证据模板；样式和脚本全部内置，脚本由固定内容哈希约束，无网络读取。

新 GET 格式为 `coded-html`、`coded-docx`、`coded-version`，仍使用现有项目会话令牌。重复 `document_id` 明确选择文档，缺省为全部；`memos=0/1`。空／重复／无效文档选择或非法参数返回 400。记录不一致或 HTML／XML 无法保留的字符明确拒绝，不改源文凑结果。没有新依赖、子进程、项目写操作、审计事件或快照。

前端仅扩展 Export 对话框、下载、范围选择及旧版本提示；旧四导出代码路径保留。样式新增内容限定于新导出控件。原分析与绘图源文件、网站及 Bologna 数据均须通过提交前哈希核对。

## UX42 验收映射

| 标准 | 本轮结果与范围 |
| --- | --- |
| CT01 全文 | HTML 逐字符核对所有 19 份文档；两格式冻结正文相同。未编码语境、空项目／无编码文档有说明。产品导入本身不接收空白文档，此规则未改。 |
| CT02 精确范围 | 原始坐标反查；单元测试与浏览器覆盖 Unicode、组合字符、CRLF、同范围多码、部分重叠、嵌套、跨段。 |
| CT03 归属 | 实际稳定 ID／祖先路径；父级直接标注、未归组、深层、同名和相同显示路径分别测试。没有新造主题或类别。 |
| CT04 对应 | HTML 悬浮／键盘／触摸往返准确；跨段重复条目沿用同一标识。Bologna 全部 874 关联保留。 |
| CT05 范围 | 当前／多选／全部明确；空多选禁用；搜索无结果、编码筛选及滚动均不缩短输出。 |
| CT06 版式 | HTML 1440／390px 无横向溢出，手机保留所有树。全文 Word 14 页及编辑样例 3 页逐页检查；表格续页不裁切正文，重复头说明延续。未进行 Windows 或原生 Word 界面验收。 |
| CT07 可编辑 | Word 文字／树非图片；用文档库加写作笔记、保存并重开，原文单元格保持。最终作者在原生 Word 的写作接受仍开放。 |
| CT08 版本 | 两格式正文／标签／范围／路径与指纹相同；改码本后旧文件提示过期，原文件 SHA 保持。 |
| CT09 隔离 | 字符转义、脚本注入样例、禁脚本阅读、默认排除笔记及无外部请求均通过；本轮只用 Bologna，未重新验证私有研究案例。 |
| CT10 保持 | 四旧下载逐字节等于原端点；导出前后项目／审计／快照不变，原种子仍 19／317／874。统计／绘图与资产哈希保持，适用测试和构建通过。OS 下载提示仍由实体设备人工核对。 |

## 命令与原始证据

运行目录为仓库根；证据归档 `~/qualicraft-review/ux-44/`。`raw/run-index.json` 记录完整命令、退出码和输出 SHA256；下表为便于阅读的命令摘要。

| 命令 | 结果 | 原始输出 |
| --- | --- | --- |
| `python -m unittest discover -s tests -p test_transcript_export.py -v`（实现前） | 1 个收集错误，尚无 transcript 模块 | `raw/transcript-red.txt` |
| 新增 7 个 Node 检查运行于封存的旧 app.js | 0 通过／7 失败；新增接口不存在 | `raw/node-export-red.txt` |
| 同一 Python 专用命令（最终实现） | 9／9 通过 | `raw/transcript-final.txt` |
| `node --test tests/*.test.mjs` | 155／155 通过 | `raw/node-final.txt` |
| `python -m unittest discover -s tests -v` | 172 个测试通过，3 跳过 | `raw/python-verified.txt` |
| `node --check web/app.js`；Python 导出器／驱动语法 | 退出 0 | `raw/syntax-final.txt` |
| `python tools/e2e/transcript_export.py --url http://127.0.0.1:64232 --out …` | 14／14 通过；控制台／HTTP／外部请求 0 | `raw/browser-approved.txt`、`browser-approved/results.json` |
| 构建后网站与报告的 1440／390px Chrome 检查 | 四页 200、无溢出／控制台／外部请求错误 | `raw/production-smoke-final.txt` |
| `npm run build` | 环境缺少 npm，127；未隐藏 | `raw/npm-build.txt` |
| 隔离副本 `node node_modules/next/dist/bin/next build` | 退出 0，使用原有物理依赖副本，无安装／更新 | `raw/build-final.txt` |
| documents 技能 `render_docx.py`＋编辑／保存／重开检查 | 全文 14 页与编辑样例 3 页检查；最终下载文件另渲染核对 | `raw/docx-download.txt`、`raw/docx-edit-render.txt`、`docx-edit.json`、`docx-layout.json` |

首轮浏览器 12／12 通过，随后增加筛选／Unicode 场景。一次固定 QA 端口已被旧服务占用，启动失败；相应代理下载超时后终止（130），证据保留在 `raw/production-service.txt`、`raw/browser-final.txt`。改用动态空闲端口，并在任何新测试写入前核对代理与本轮独立后端的 token 身份；最终 14 项通过。测试只创建 Bologna 工作副本，未改旧服务的原项目。另一次临时 smoke 收集器拼写错误已修正，失败输出保留。未改断言或放宽预期来获得通过。

`-t .` 的早期收集问题沿用原失败记录，不改测试入口掩盖。当前手机检查为 Chrome 390px 触摸模拟，不是实体手机、OS 虚拟键盘、VoiceOver 或 Windows 验收。

## 截图与交付

- [桌面全文与对应树](/Users/chehaijun/qualicraft-review/ux-44/browser-approved/screenshots/03b-desktop-complete-source-tree.png)
- [手机完整归属树](/Users/chehaijun/qualicraft-review/ux-44/browser-approved/screenshots/06b-phone-complete-tree.png)
- [桌面导出范围](/Users/chehaijun/qualicraft-review/ux-44/browser-approved/screenshots/01-desktop-export-scope.png)
- [证据已变化提示](/Users/chehaijun/qualicraft-review/ux-44/browser-approved/screenshots/07-stale-version-warning.png)

最终 HTML／Word 样例、截图、渲染和命令输出只放仓库外，不进 Git。审核包新增 UX44 增补，保留旧轮次失败与证据。源码提交只含实现、测试和本轮审核文档。

剩余：研究者／supervisor 检查实际写作用途与视觉；当前实体设备、VoiceOver、系统减少动态效果与 OS 下载完成反馈；显式 Theme／Category 角色与可编辑 Analysis Table／Narrative Analysis；独立 PDF、三方法完整流程与百份容量；后续网站演示需随报告工作再同步新增导出。Windows 暂缓；无推送、无部署。
