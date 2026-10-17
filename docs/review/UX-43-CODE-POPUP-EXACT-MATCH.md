# UX-43 · UX40-01完整编码名与Enter修复

2026-10-17，产品基线 `2a36ce5a74f5cb66de22f0351ac42c5b7ff2d3cb`。用户明确授权本轮工作台修改，仅处理选码并补回归。**UX40-01已在Bologna目标场景修复并验收。** 编码原文对照导出、报告编辑、三方法流程、容量及其他接受项不随此关闭。Windows暂缓且未验证，不推送、不部署。

## 问题与修复规则

Bologna本身有父节点 `ancient manuscripts and early printed books` 和其叶编码 `ancient manuscripts`。原候选按保存顺序匹配路径，再截前8项；完整叶名仍可能让父节点排第一，Enter保存父节点。旧submit还会用完整路径匹配覆盖用户已经通过方向键选中的另一项。

本轮只调整编码弹出框：

- 搜索全部保存编码，将完整路径／完整身份、完整名称、其余路径包含匹配依次排列，再限制显示8项；同等匹配保持原顺序。
- 唯一完整叶名默认排在包含该词的父节点之前，Enter保存该叶编码ID；大小写和首尾空白沿用现有宽松匹配。
- 同名跨分支或显示路径冲突时，直接Enter提示明确选择，项目内容、审计与快照不变。方向键后Enter、鼠标／触摸或完整路径可明确目标；相同显示路径在候选中展示完整ID。
- Enter尊重当前方向键高亮行；重新输入重置这次选择。完整已有名称不再附带“新建同名编码”的选项；原有新码创建及有意选择父节点的行为保留。
- 仅弹出候选名称改为完整换行，输入更新后重新定位弹出框，使手机能够辨认路径与ID。正文高亮、侧栏、存储、统计与绘图路径不改。

同名时不猜用户指的是哪条路径。此保护只影响名称／路径歧义，不禁止对父节点直接编码。QA标注只用于验证保存行为，不构成新的Bologna研究分析。

## 先失败、再通过

新增 `tests/code_popup.test.mjs` 的16项真实函数回归，覆盖完整叶名、大小写／空白、8项截断、完整路径、跨主题同名、路径冲突／ID、明确方向键、重输、新建及原记录不变。最终测试夹具对保存的修复前 `app.js` 重跑：**4通过／12失败**；修复后16全部通过。

新增 `tools/e2e/code_popup.py`。修复前在Bologna恢复副本实际鼠标选区并输入完整叶名＋Enter，**1项失败**：原句范围 `[5,28)` 正确，但期望叶ID `a4c01fae826040d7a8ad95b7297edf7b`，实际父ID `d050cb3e46234516980d0f5f4371b06d`。原始失败和截图保留，未删除或改作成功。

修复后14项桌面／390px触摸仿真通过，逐次核对保存ID、原句与范围；多义Enter的项目／审计／快照不变。另通过已构建网站代理入口重复核心场景1项，以及补核实际annotation与审计annotation_id的对应。原19文档／317节点／874标注Bologna项目保持不变，所有写操作只在恢复副本。

| 验证 | 本轮结果 |
| --- | --- |
| 专用Node回归 | 16／16；保存的修复前实现同夹具12失败 |
| 全部Node测试 | 148／148 |
| Python完整测试 | 163项，3跳过，退出0 |
| JS语法 | `node --check web/app.js`退出0 |
| 工作台浏览器 | 14／14，桌面1440px及手机390px；真实鼠标选区，原生键盘输入／方向键／Enter／Escape，鼠标与触摸明确选择 |
| 构建后网站代理 | 核心实际保存1／1；首页／报告在1440px、390px共4页均200、无横向溢出 |
| 控制台／HTTP／项目外浏览器请求 | 上述正常场景均0 |
| 原项目与资产 | 原Bologna记录／数据库与统计、绘图、报告／媒体资产字节保持；范围与函数级核查见scope原始输出 |

手机是受控Chrome触摸仿真，选区以真实鼠标拖拽准备；不是本轮实体手机、系统虚拟键盘或VoiceOver签署。历史真实访谈项目未重跑或改写，不将Bologna修复证明直接当作其研究者接受。

## 命令与原始证据

持久证据目录：`~/qualicraft-review/ux-43/`。执行时同结构暂存于 `/tmp/qualicraft-ux43/`；命令、退出码及每次输出在 `raw/run-index.json`。

| 命令／动作 | 原始结果文件 | 退出码／说明 |
| --- | --- | --- |
| `node --test /tmp/qualicraft-ux43/code-popup-red.mjs` | `raw/node-popup-red-final-fixtures.txt` | 1；同一最终夹具对保存旧JS，12失败 |
| `node --test tests/*.test.mjs` | `raw/node-final.txt` | 0；148项 |
| `python -m unittest discover -s tests -v` | `raw/python-final.txt` | 0；163项／3跳过；实际使用隔离MPLCONFIGDIR和本地HTTP测试授权 |
| `node --check web/app.js` | `raw/node-check.txt` | 0 |
| `python tools/e2e/code_popup.py --url http://127.0.0.1:8878 --out …` | `raw/browser-final.txt`、`browser-final/results.json` | 0；14项，桌面／手机含保存结果 |
| 同脚本 `--reproduce-only`，网站代理4449 | `raw/production-browser.txt`、`production-browser/results.json` | 0；构建后核心场景1项 |
| 审计关联补核 | `raw/audit-targeted.txt`、`acceptance/results.json` | 0；真实保存标注与审计annotation_id一致 |
| `node node_modules/next/dist/bin/next build` | `raw/build-final.txt` | 0；Next16.4.0，原跟踪网站源码与原依赖的物理隔离副本 |
| 构建后四页Chrome检查 | `raw/production-smoke.txt`、`production-smoke.json` | 0；4页均200，无控制台／HTTP／外部请求 |

本轮机器无npm，原`npm run build`退出127保存在 `raw/npm-build.txt`。随后选用pnpm时触发了自动依赖整理并遇到隔离副本外部symlink的Turbopack错误，退出1保存在 `raw/build.txt`。**没有采用该次新下载的依赖**：原7个包目录按原inode恢复，原Next／TypeScript入口恢复；新增包与元数据隔离保存，见 `dependency-restoration.json`。最终物理复制原依赖后直接Next构建成功；4445原预览的首页／报告仍200，原`.next`未覆盖。未修改依赖清单或锁文件，也未迁移middleware警告。

Python首次完整运行受沙箱禁止监听回环端口影响，16个环境错误／退出1保留在 `raw/python-all.txt`；在允许项目本地HTTP测试后重跑通过。首次浏览器采集11／14：同父重名夹具被现有API正确拒绝、非编辑区的键盘选区假设未成立；均保留 `browser-green/` 与原始输出。最终使用合法但显示路径相同的分支，以及真实鼠标选区后的原生键盘输入；目标编码／原句预期未放宽。初始API采集错误与真正的UX40-01分别记录。

## 截图索引

截图不进Git；以下为持久证据目录下的实际文件：

- `browser-red/screenshots/01-desktop-exact-candidate.png`及失败截图：旧实现真实保存到父节点。
- `browser-final/screenshots/01-desktop-exact-candidate.png`：完整叶名排首位，完整父链可见。
- `browser-final/screenshots/01-desktop-exact-saved.png`：保存后的准确叶路径。
- `browser-final/screenshots/05-eight-row-cap-exact-first.png`：先匹配再截8项。
- `browser-final/screenshots/08-desktop-ambiguous-paths.png`：相同显示路径的完整ID。
- `browser-final/screenshots/10-phone-exact-candidate.png`及`10-phone-exact-saved.png`：手机候选／保存结果。
- `browser-final/screenshots/11-phone-ambiguous-paths.png`：多义Enter提示，随后触摸明确选择。

本轮修改仅为弹出选码JS、该候选换行CSS、两份回归工具及审核文档。编码原文对照导出仍按 [UX-42](UX-42-CODED-TRANSCRIPT-EXPORT.md) 待做；下一步推进它与后续报告编辑，三方法／容量／人工与supervisor／发布门槛继续单独登记。完整提交哈希、保护范围、原始输出及审核包一致性见证据的post-commit／scope／package-verification，不以旧通过记录替代本轮证据。
