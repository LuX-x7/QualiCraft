# UX-38 · W03调整后的三端联合验收

2026-10-17 最新（UX-39，人工结果登记）：**用户已确认手机Read／Revisit、撤销、Keep、Resume，以及切换文档和刷新后的保留均通过。** 结果来自本对话用户报告，对应独立Bologna手机临时副本；本轮不读取或重置该测试库，不改功能／数据，不重跑自动化或构建。手机型号、系统及浏览器版本尚未提供，已请求补齐，不能据此宣称跨设备兼容。VoiceOver、系统减少动态效果、操作系统下载完成提示、整体视觉／supervisor接受与发布门禁仍开放；其他未报告手机路径不一并关闭。见 [人工结果与边界](UX-39-MOBILE-MANUAL-ACCEPTANCE.md)。Windows继续暂缓且未验证，不推送、不部署。下方旧轮次按历史保留。

2026-10-17。产品基线 **`0ed62c645b25ec24f2be8c6ef7d5e915d48f6c91`**（UX-37）。**主流程11/11、全部54项浏览器检查54通过，范围内未发现新增功能缺陷。** 本轮只审查、截图和更新8份审核文档；工作台、网站、报告、测试源码、统计、绘图路径、数据与资产均未修改。Windows继续暂缓且未验证，不推送、不部署。

## 隔离与原始证据

仅Bologna CC0。新临时前台 `http://127.0.0.1:4470/` →8873，SQLite临时副本`/tmp/qualicraft-ux38/data/qualicraft.sqlite3`；受控Chrome只允许本项目origin，不读取其他窗口／标签页。无模型密钥，模型地址为不可用loopback，无模型请求。原模板及种子19文档／317编码／874标注及审计不变；工作副本实际增加同一Bologna文档和两条既有编码标注，成为20／317／876，再恢复为独立项目ID。

证据根 `~/qualicraft-review/ux-38/`；审核包镜像`~/qualicraft-review/supervisor-review/raw/ux-38/`。`raw/run-index.json`记录实际命令、退出码和原始输出SHA-256；`post-commit.json`记录完整本地提交和范围，`package-verification.json`核对文档、截图、原始结果和媒体。截图、下载和临时验收脚本均不进Git；本轮运行数据库、备份及令牌不复制进审核包。

## 按要求顺序走查

| 环节 | 实际验收结果 | 原始记录／截图（相对证据根） |
| --- | --- | --- |
| 网站→导入 | 十场景原生滚动、同一个固定左窗；W03源文件→文本记录→准确坐标可悬浮／键盘／触摸。显式Try Bologna副本中实际导入18239 Unicode码点原文，逐字一致，保存结果可见 | `story/results.json`、`w03/results.json`、`results.json`；`w03/desktop-import-engineering.png`、`screenshots/04-import-result.png` |
| 编码 | 真实鼠标两次拖选同一句`[2,38)`，赋两个已有code ID，quote精确、两条annotation ID与所属路径可读，原874条标注不变 | `results.json`；`screenshots/06-coded-source.png` |
| 手动阅读／双轨 | ¶4 Read、¶5 Revisit与键盘Undo；即刻读回、单独标记不轮转研究编辑快照。31段／2条编码／1处来源，两轨独立；不把滚动／编码当作自动已读 | `results.json`；`screenshots/06a-marked-dual-track.png` |
| 筛选／跳转／记忆 | 主题自身和全部后代逐段对独立预期；无匹配组合筛选仍保留全文53标注的轨道。明确Show full document & jump才清筛选；原句共享两码各保留ID。预览不覆盖Resume，Keep／文档往返／刷新准确 | `results.json`、`supplement.json`、`phone-followup.json`；`screenshots/06b-filter-explicit-source.png`、`33-phone-native-tab-filter-resume.png` |
| 关系图 | Coding、原Analysis路径图和新增圆点网络均保留。零点击自然滚动到实际可见图，390／1440下各314节点／322连线处于裁切范围；普通／矮桌面完整框、手机18px全名、选择／拖拽／源展开／键盘均通过。工作台新增真实标注定位与返回保留原文档、主题和搜索筛选、节点和位置；所有连线端点存在 | `story/results.json`、`w03/results.json`、`navigation.json`、`network-capture.json`；`screenshots/network-visible-1440.png`、`network-visible-390.png`、`07-network-evidence.png` |
| 五类图 | 五个真实预览／实际ZIP，25成员含SVG／PDF／300dpi PNG／CSV／脚本；CRC、格式头、XML和脚本语法通过。实际259行层级CSV在9／10pt的原渲染断言中无重叠／裁切；手机原尺寸、比例、Fit／缩放／键盘返回保持 | `results.json`、`output-audit.json`、`supplement.json`；`screenshots/09-workbench-*.png`、`22-phone-viewer-*.png`、`downloads/*.zip` |
| 报告读值 | 全部594表行逐格对CSV：15／285／16／259／19。每图首中末读值、键盘／表格定位通过；301热图映射、移动取景框和准确数值通过，原图比例／静态原图／全表／下载保持，10资产HTTP字节一致；无JS退路可用 | `results.json`、`heatmap/results.json`、`supplement.json`；`screenshots/10-report-*.png`、`heatmap/coverage-desktop.png` |
| 导出→恢复 | 四种实际下载逐字节对API；JSON等于最终SQLite项目。恢复独立ID后原文、编码、标注和两手动标记不变，概览／位置项目身份隔离。网站四格式分支仅解释结构，不伪装已下载 | `results.json`、`navigation.json`、`summary.json`；`screenshots/12-export-result.png`、`30-restored-project-tracks.png`、`w03/desktop-export-engineering.png` |

报告仍为manifest固定19文档／874标注示例，不会自动反映本轮20／876工作副本。两码同句是两条标注、一处原始范围，不是两处原句或新统计口径。五段UX-29录屏和静态替代逐字节保持；它们早于阅读控件，阅读功能用实时工作台／本轮截图展示。

## 两条手机旧失败顺序

UX33-01：在新导入文档保存¶4起点872，Overview原生Tab经标记控件到Search，各步锚点均872，即使浏览器把视口移到顶部也不变。无匹配搜索→概览¶6→明确显示全文并跳转→Resume回872，Read保留。`phone-followup.json`的`anchor_changed_before_text_input=false`。

UX33-02：同一390×844触摸上下文从概览跳¶4，Keep前current／preview／memory均872；实际触摸Keep保存872，切文档和刷新后仍872／Read。导航补验项目POST为0，项目／审计／快照未变。原UX-33的44/46失败证据仍保留；当前54=UX-36的47项加7项W03复验，不冒充原46项。

## 本轮命令、结果与边界

命令由`/private/tmp/qualicraft-read-values-venv/bin/python`在仓库根运行，完整参数／退出码／原始输出哈希见run-index；下表的Python简称不更换解释器。

| 命令 | 新跑结果／输出 |
| --- | --- |
| `python /tmp/qualicraft-ux38/joint.py` | 11/11；`raw/joint.txt`、`results.json` |
| `python tools/site/story_acceptance.py --url http://127.0.0.1:4470 --out /tmp/qualicraft-ux38/story` | 10/10；`raw/story.txt` |
| `python tools/site/w03_acceptance.py --url http://127.0.0.1:4470 --out /tmp/qualicraft-ux38/w03` | 7/7；`raw/w03.txt` |
| `python tools/site/heatmap_acceptance.py --url http://127.0.0.1:4470 --out /tmp/qualicraft-ux38/heatmap` | 7/7、301映射；`raw/heatmap.txt` |
| `python tools/e2e/visual_unity.py --url http://127.0.0.1:4470 --out /tmp/qualicraft-ux38/visual` | 7/7；`raw/visual.txt` |
| `python /tmp/qualicraft-ux38/supplement.py` | 5/5；20文档／317树、阅读／范围／筛选／记忆、五图查看、无JS退路；`raw/supplement.txt` |
| `python /tmp/qualicraft-ux38/navigation.py` | 3/3；网络完整返回／v5恢复身份隔离／导航零写；`raw/navigation.txt` |
| `python /tmp/qualicraft-ux38/phone_followup.py` | 4/4；搜索前锚点／Resume、触摸Keep、切文档刷新／Read、零写；`raw/phone-followup.txt` |
| `python /tmp/qualicraft-ux38/output_audit.py` | 25成员／259行几何／10manifest／397非md非html哈希保持；`raw/output-audit.txt` |
| `python /tmp/qualicraft-ux38/normal_preview.py` | 23项目入口四路由200、当前工作台JS／CSS，常用4445桌面手机／只读4457／320px QA无错误溢出；`raw/normal-preview.txt` |
| `python /tmp/qualicraft-ux38/network_capture.py` | 桌面／手机零点击自然滚轮取景，扣除祖先裁切仍见节点连线；额外截图，不重复计入54项；`raw/network-capture.txt` |
| `python /tmp/qualicraft-ux38/consolidate.py`、`scope.py` | 54/54汇总、原种子及审计／常用库／219产品路径文件哈希保持，8份文档范围／链接／空白核查；`raw/consolidate.txt`、`raw/scope.txt` |

正常控制台／pageerror／HTTP错误0；没有失败检查被删除或改成观察豁免。输出审计的Matplotlib只读默认缓存提示保留，临时缓存成功，退出0；不是图形失败。

**本轮不重跑全量单测、语法或生产构建，也不重新生成资产。** 产品与UX-37逐字节一致，UX-37的153 Node／语法／直接Next生产构建退出0为网站当前版本历史证据；npm缺失127保留。最近完整后端证据为UX-35的163 Python（3跳过），其后后端未改。完整提交、来源与历史收据存`historical-test-receipts.json`，不计为本轮新跑。临时验收脚本适配W03已折叠的原生选择器，未修改仓库测试入口或断言。

## 剩余问题与关闭标准

| 项目 | 当前结论 | 下一步／关闭标准 |
| --- | --- | --- |
| 新增功能缺陷 | 本轮规定路径未发现；54项通过，不能推出未测路径无缺陷 | 保留本轮原始输出与截图，不因审查自行改功能 |
| 整体视觉／supervisor接受 | **开放**。W03实现技术项已完成。全主题网络仍密集；手机用独立全名、主题筛选和缩放读取，并非同时显示每个节点全名；这是审核讨论点，未新增已确认缺陷ID | 用户／supervisor明确接受布局、图文密度、工程图与追溯流程；若有意见，单列授权下一轮 |
| 当前实体设备与辅助功能 | **未新验**。本轮手机是Chrome触摸仿真；浏览器减少动态模式不等于系统切换／VoiceOver | 当前阅读及W03控件在实际手机、VoiceOver、系统减少动态及操作系统下载完成提示上人工验收并记录设备／系统／浏览器 |
| 录屏时效说明 | 五段现有录像／替代均保留；UX-29录像未涵盖后加阅读控件 | 审核时阅读标记／双轨用当前实时界面，本轮不补录 |
| 正式发布门禁 | **开放**；这份包供本地讨论，不是发布批准 | 核实正式地址／下载物／平台声明，另行取得当前推送／部署授权；Windows暂缓且未验证 |

下一步先用当前候选做supervisor审核与上述人工接受，不把历史冲刺目标写成已按时全完成。普通入口`http://127.0.0.1:4445/`和`/report`不变；独立可编辑QA为`http://127.0.0.1:4470/w?lang=en`，选择Bologna · example copy及Bologna · UX38 joint review。loopback链接仅本机可访问。
