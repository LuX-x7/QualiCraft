# UX-36 · 两项位置修复后的联合验收

2026-10-17。当前产品／本轮基线 **`026813503dca1ab57ed9347a53e2b1475ec0b98b`**（UX-35）。用户要求继续；按既有顺序先做修复后的联合复验。**本轮只验收和更新文档，不改功能、测试、网站资产、统计或绘图，不推送、不部署。** Windows暂缓且未验证。

**结论：主流程11/11，全部47项浏览器检查47通过。UX33-01搜索前位置、UX33-02触摸Keep均在真实导入／标记后的副本里通过旧失败顺序。范围内未发现新增功能阻断，可交supervisor审核；W03视觉收尾、用户接受、当前实体设备／VoiceOver与正式发布门禁仍开放。** 不据本轮通过声称整体项目或发布已经全部完成。

## 环境与证据

仅Bologna CC0，新临时前台 `http://127.0.0.1:4469/` → 后端8872，临时数据 `/tmp/qualicraft-ux36/data/qualicraft.sqlite3`。独立受控Chrome上下文只允许该项目origin，不读取其他窗口／标签页。后台无模型密钥，模型地址为不可用loopback，未发模型请求。

证据根 `~/qualicraft-review/ux-36/`；审核包镜像 `supervisor-review/raw/ux-36/`。`raw/run-index.json`包含绝对运行时、实际命令、退出码、原始输出SHA-256；`post-commit.json`为完整文档提交及范围核查；截图和运行数据库不进Git，审核包不复制运行数据库／备份／令牌。当前包的`LATEST-CANDIDATE.md`是英文审核说明；旧PDF和旧候选保留历史标记。

## 按实际顺序的主流程

| 环节 | 实际结果 | 截图／原始结果（相对证据根） |
| --- | --- | --- |
| 网站→起步→导入 | 保留Coding图、Analysis路径图及追加圆点网络；从网站进入，显式Try Bologna创建独立副本；导入同一interview02，18239 Unicode码点逐字一致，保存结果可见 | `results.json`；`screenshots/01-home-desktop.png`、`03-import-preview.png`、`04-import-result.png` |
| 编码 | 真实鼠标两次拖选同一`[2,38)`原句并选择既有码，两条不同annotation／code ID、完整路径与准确quote | `results.json`；`05-mouse-coding-popup.png`、`06-coded-source.png` |
| 阅读标记与概览 | ¶4 Read、¶5 Revisit，键盘保存／Undo；项目即时读回，阅读单独修改不轮转研究编辑快照；31段、两码、一处来源，两条轨道独立 | `results.json`；`06a-marked-dual-track.png` |
| 筛选／跳转／记忆 | 主题自身及全部后代按独立预期核对；组合无匹配搜索仍保持全文53标注；明确Show full document & jump才清筛选；共享来源两ID／完整引文、Resume、Keep及文档切换／刷新准确 | `results.json`；`06b-filter-explicit-source.png`、`06c-resume-after-filter.png`、`06d-kept-position-reload.png` |
| 关系图 | 真实新增标注→完整原句和两码→定位→返回；所有连线端点均存在；额外验证原文档、主题／文本筛选、所选节点与保存位置全部返回 | `results.json`、`navigation.json`；`07-network-evidence.png`、`08-source-location.png`、`29-network-return-filters.png` |
| 五类图 | 五个真实预览和ZIP：SVG／PDF／PNG／CSV／脚本共25成员，CRC、格式头、XML、脚本语法通过；实际259行层级CSV在9／10pt零标签重叠或裁切 | `results.json`、`output-audit.json`；`09-workbench-*.png`、`downloads/*.zip` |
| 报告读值 | 所有594表行逐格对CSV，15／285／16／259／19；每类首中末三个读值和选中行、键盘与行定位；10个原图／CSV的HTTP字节一致；两热图301行映射、悬浮／触摸／键盘通过 | `results.json`、`heatmap/results.json`；`10-report-*.png`、`heatmap/coverage-desktop.png` |
| 导出→恢复 | 实际下载JSON／标注CSV／矩阵CSV／Methods，逐字节对API；JSON等于最终SQLite项目；恢复新项目ID后文档、编码、标注与两个手动标记一致，概览身份隔离 | `results.json`、`navigation.json`、`summary.json`；`12-export-result.png`、`30-restored-project-tracks.png` |

工作副本明确增加同一Bologna文档和两条编码，成为20文档／317编码／876标注；原模板及种子仍19／317／874。报告仍使用manifest固定19／874示例，不会自动反映本轮编辑。两码同原句是两条标注、一处来源，不是两处原句、阅读完成率或新统计定义。

## 原两条失败顺序：现在均通过

**UX33-01：** 在本轮导入文档¶4 `[872,2681)`保存位置，从Overview原生Tab经过三个标记控件到Search；各步保存锚点均872，浏览器把视口带到顶部时仍872。输入无匹配搜索，概览选择¶6，明确显示全文并跳转，再Resume回¶4，Read仍在。`phone-followup.json`保留每步activeElement／scroll／anchor，`anchor_changed_before_text_input=false`，不是只检查页面无报错。

**UX33-02：** 相同390×844触摸上下文从概览跳¶4后，Keep前current／preview／memory均872，触摸Keep实际保存872；文档往返和刷新后仍872，原Read保留。没有先用辅助脚本修正错误再宣称Keep通过；普通阅读滚动恢复另有单独检查。项目／审计／快照和手动标记不因这些导航改变，UI项目POST为0。

证据：`phone-followup.json`、`raw/phone-followup.txt`；`screenshots/33-phone-native-tab-filter-resume.png`、`35-phone-keep-after-source.png`、`34-phone-keep-reload.png`。UX-33原44/46和当时的两个失败原样保留。当前手机组显式增加一个“搜索／筛选／Resume准确”检查，因此总数47，不能把当前47项写成原来46项全部通过。

## 检查清单和命令

以下命令在仓库根目录，用`/private/tmp/qualicraft-read-values-venv/bin/python`执行；完整路径、原始输出与哈希见run-index。

| 命令 | 结果／输出 |
| --- | --- |
| `python /tmp/qualicraft-ux36/joint.py` | 11/11；`raw/joint.txt`、`results.json` |
| `python tools/site/story_acceptance.py --url http://127.0.0.1:4469 --out /tmp/qualicraft-ux36/story` | 10/10；`raw/story.txt`、`story/results.json`；正常滚动、固定左窗、原路径和追加网络、鼠标悬浮／拖拽／键盘／手机／减少动态、594读值 |
| `python tools/site/heatmap_acceptance.py --url http://127.0.0.1:4469 --out /tmp/qualicraft-ux36/heatmap` | 7/7；`raw/heatmap.txt`、`heatmap/results.json`；301映射和取景框／准确数值、静态原图与表／下载保持 |
| `python tools/e2e/visual_unity.py --url http://127.0.0.1:4469 --out /tmp/qualicraft-ux36/visual` | 7/7；`raw/visual.txt`、`visual/results.json`；QT／导航／按钮／边框、高对比原文、断点、五图查看及原项目保持 |
| `python /tmp/qualicraft-ux36/supplement.py` | 5/5；`raw/supplement.txt`、`supplement.json`；手机20文档／317树节点、Read和双轨／精确来源／筛选记忆、五图原尺寸／比例／Fit／键盘返回、无JS报告 |
| `python /tmp/qualicraft-ux36/navigation.py` | 3/3；`raw/navigation.txt`、`navigation.json`；网络返回完整上下文、恢复v5项目标记／概览隔离、零项目写 |
| `python /tmp/qualicraft-ux36/phone_followup.py` | 4/4；`raw/phone-followup.txt`、`phone-followup.json`；原生搜索与Resume、触摸Keep、文档／刷新／Read、项目与快照保持 |
| `python /tmp/qualicraft-ux36/output_audit.py` | 25图包成员、259行层级几何和10个manifest资产；`raw/output-audit.txt`、`output-audit.json` |
| `python /tmp/qualicraft-ux36/normal_preview.py` | 22登记项目入口的首页／报告／health／bootstrap均200，工作台JS/CSS等于当前源码；普通4445桌面／手机、只读4457、320px QA无溢出／控制台错误；`raw/normal-preview.txt`、`normal-preview.json` |
| `python /tmp/qualicraft-ux36/consolidate.py`、`scope.py` | 47/47汇总、原种子／审计／常用数据库／产品哈希保持；8份允许文档、链接与空白；`raw/consolidate.txt`、`scope.txt`、`summary.json`、`scope.json` |

控制台／pageerror／HTTP错误0。没有删除失败或以观察豁免计入通过。手机是Chrome触摸仿真；桌面／390px／现有视觉断点、横屏、无JS和减少动态模式均按脚本结果核对，不等于实体设备／VoiceOver／系统设置或操作系统通知已验。

**本轮不重跑全量单元测试／语法或生产构建。** 产品与UX-35字节相同，沿用其153 Node、163 Python（3跳过）、语法及直接Next生产构建退出0的历史证据；npm缺失127保留在ux-35。它们不计为本轮新跑。临时验收脚本在证据目录内，未修改仓库测试入口或产品代码。

## 关系图补拍与仍需改进的显示密度

原手机整块元素截图会在拍完长图后改变页面取景，随后页面截图可能停在下方Data区，因此不把该页面截图冒充当前可见关系图。另用`python /tmp/qualicraft-ux36/network_capture.py`、`raw/network-capture.txt`和`network-capture.json`补拍：桌面／390px均通过原生滚轮、零点击到达实际图形，按视口及祖先滚动容器裁切后仍有节点和连线可见。截图为`screenshots/network-visible-1440.png`、`network-visible-390.png`，不重复计入47项功能检查。

这同时明确了W03的两个具体视觉问题：桌面左窗的标题／选择器占用较多高度，完整关系图需在演示窗内继续滚动；手机默认50%网络概览的标签偏小，需要现有缩放和独立详情读取。图可达与数据可核对已有证据，但当前密度仍未达到“普通窗口直接清楚阅读”的视觉关闭标准。下一轮应收紧说明与控件，并让图形与完整详情各有清楚的阅读位置；不是删除图或改变数据。补拍首版滚轮步长跳过了过窄取景区（退出1），后修正采集条件；中间几何记录未扣祖先裁切，最终版已补计。原输出均保留，不改产品或功能验收期望。

## 剩余事项与下一步

1. **W03网站视觉收尾：仍待实施／接受。** Coding／Analysis样板、既有路径与追加网络保持；其余Import／Export图形应进一步表现真实底层逻辑，统一五模块标注、线宽、选择状态和图文节奏，收紧手机长图和控件密度。当前能操作和读值不等于已经达到用户期待的审美。下一轮先做这一视觉工作流，保留所有原图、录屏／静态替代、全表与下载，不改工作台和数据。
2. **用户／supervisor接受：待讨论。** 使用当前截图与可编辑QA副本讨论阅读工作流、简洁程度、证据可追溯性和保留的产品边界；不由自动化测试代签。
3. **当前版本实体设备与辅助功能：未重新验证。** 手机实际触摸、VoiceOver、系统减少动态和操作系统下载完成提示需人执行；旧人工结果不能自动覆盖新增阅读控件。
4. **正式发布门禁：仍开放。** 正式平台声明、公开下载和地址需单独核实；本轮不推送、不部署。Windows继续暂缓且未验证。

UX-29五段录像与静态替代原字节保留，早于当前阅读控件，当前阅读能力应以实时工作台／本轮截图演示。本轮未补录、重绘或新增分析功能。原10月16日18:00是过去的冲刺目标，仍开放的工作不能登记为当时已全部完成。

可审核入口：普通网站 `http://127.0.0.1:4445/`、报告`/report`、工作台`/w?lang=en`；本轮隔离副本为`http://127.0.0.1:4469/w?lang=en`，导入文档名Bologna · UX36 joint review。总体计划与一页英文说明已同步；完整本地文档提交与包内一致性见`post-commit.json`和`package-verification.json`。
