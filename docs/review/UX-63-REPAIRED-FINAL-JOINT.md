# UX-63 修复后的最终联合验收

日期：2026-10-18。基线 `73253755f20ab278396f87c41a3e5bb79419eacd`，分支 `t7-site`。完整本轮提交见Git及审核包COMMITS.md／ux63-evidence/COMMIT.txt。

## 结论与剩余事项

**本轮软件技术联合验收通过，可将当前版本交supervisor审核。** 全新桌面／手机副本各13项主流程，26/26；另网站7项W03、7项热图、4项自然滚动／目录，18/18，合计44/44。全部新执行，无中途结果继承，无诊断API替代界面恢复。正常控制台、HTTP、项目外请求错误均0；未发现新的未关闭功能缺陷。UX60-01／P1及UX60-02／P2在完整联合中复验关闭，旧失败记录不删除。

**整体验收仍不能登记为全部最终标准完成。** 本轮只验证公开Bologna技术流程及输出保真，不代签实机／辅助功能、研究解释与用户／supervisor接受。Windows按用户要求暂缓，不作为本次本地supervisor审核的阻挡，也不声称已通过。本轮不改功能、统计、绘图、数据或部署配置，不推送、不部署。

| 剩余项 | 当前状态与通过标准 |
| --- | --- |
| 当前人工设备与系统辅助功能 | 当前VoiceOver、系统减少动态效果、系统下载完成反馈、未报告的新批量导入／报告实机路径仍待真实操作结果与设备／系统／浏览器。UX39用户已报告Read／Revisit、撤销、Keep／Resume、切文档／刷新通过，保留该有限范围，设备信息待补。本轮手机为Chrome触摸模拟；原句选区使用真鼠标，不冒称OS触摸选区柄或系统文件选择已验证 |
| F07／F08研究者裁决 | 私有参考对照仍需研究者确认；本轮未读取真实访谈。技术范围、数值、导出和恢复正确，不等于独立解释已几乎等同手工分析 |
| 用户／supervisor接受 | 审阅方法、案例／条件／校准、叙述与证据、反例和局限，记录内容及视觉可用性的接受／问题。报告M1是过程概览，不是研究完成认证 |
| 容量与方法适用边界 | 本轮从19文档导入2份技术复制件至21文档；此前限定1／2／100文档与100文件队列按旧证据保留。不是无限量、百独立受访者、最大编码压力或所有QCA变体认证。Comparative当前为1–6条件、二元保守切片，fuzzy／多值／中间或简约方案不在该已接受切片内 |
| Windows及远端 | Windows明确暂缓且未验证。本轮无GitHub推送、部署或自动部署修改；旧令牌权限问题保持历史事实，未重试远端 |

目前无需新增功能修复；下一步先收集当前人工与supervisor意见。发现具体问题后再编号、授权并实施，不把过去的交付期限补记为已按时完成。

## 数据隔离与流程

从只读公开Bologna语料新建种子临时项目，再为桌面1440×1000／手机390×844各建独立可编辑副本。起始19文档／317节点／874标注；原生队列导入前两份Bologna文本，新增两条同范围标注，最终各21／317／876。源文本、原始19文档及种子项目保持；没有使用真实访谈、个人数据库或外部站点。所有写入均在临时数据库中，验收结束主服务关闭。

| 顺序 | 本轮实际结果 |
| --- | --- |
| 批量导入 | 原生文件选择两份TXT，逐项保存；正文准确。再次同名同内容进入确认，取消不改项目、审计或快照 |
| 编码 | 真鼠标选取Unicode [5,28)，完整叶名＋Enter分别保存两码。quote／document_id／code_id／范围与人工预期准确，Theme／Category／Code角色在副本显式指定，未虚构其他节点角色 |
| 阅读标记与双轨 | Read→Revisit→撤销Read，另一段Revisit；31段、2关联／1不同原句范围。Keep精确¶17，搜索聚焦／无匹配／清除／Resume、切文档与刷新均保留；标记独立保存在项目 |
| 筛选、跳转和位置 | 桌面／手机开树前、开树后、主题筛选、清除、Resume五阶段全部保持11435；筛选包含自身／后代，与侧栏全局计数和当前文档2关联一致。实际滚轮／触摸滚动后位置推进，再开树／Resume返回新位置。另在新审核入口补验精确范围[5,28)列表、两个编码、预览／原句跳转与Resume，2/2且项目／快照不变 |
| 关系图 | 所有连线均指向实际稳定ID节点；选叶码→新增标注证据→原句焦点→返回同节点，项目不变。网站自然滚动可见passage节点与连线，不需点击标题 |
| 五类图 | 实际GUI预览、100%／按宽度、比例／完整内容、关闭焦点返回、SVG／PDF／PNG／CSV／Python导出。报告冻结资产与五包25成员逐字节一致。人工预期两码频次各+1、同范围对共现+1、累计不同码259均符合原定义 |
| QCA与报告 | 两明确技术案例、条件A/B、结果Y、规则／理由／证据；(1,0,1)/(0,1,0)预期解A*~B，4行真值表。Content／TA／Comparative三种报告各保存六步M1、五图、引文、叙述及四格式；版本恢复保留全部绑定及冻结QCA |
| 网站报告读值 | 五CSV共594行逐格一致；首／中／尾15次选行定位。桌面频次／累计实际柱点悬浮和End键，手机触摸；热图独立核301映射；目录当前章节、十步自然滚动／固定窗口、手机节点连线、十原图文件与五录屏／五静态替代保持 |
| Notebook／Word／代码 | 在无匹配筛选时仍导出完整18,239字符、2关联／1范围；HTML悬浮／触摸／键盘双向定位，Word原生可编辑树与metadata精确，不是截图。六导出脚本独立执行，五图25成员和QCA结果／案例ID／配置一致 |
| JSON和快照恢复 | 真实文件选择界面上传原始JSON字节，桌面／手机均200，无类型改写或诊断路径。正文、树／角色、标注、阅读标记、blocks、冻结QCA、全部报告版本与图资产相同；已提交快照恢复成另一副本再次比对，原项目／恢复点不改。Resume是浏览器项目／文档本地位置，不作为JSON内容恢复 |

技术编码和QCA隶属值是明确声明的验收设计，不是Bologna的新研究解释，也未为迎合手工答案调整结果。研究标记、编码覆盖、阅读位置和研究者完成确认仍相互独立。

## 当前产物与Word版面

完整联合下载包含方法版本恢复的历史验证：Comparative v9导出后，恢复Content生成v10，再恢复Comparative生成v11。这是预期版本行为，不是数据不一致。为交付清楚，审核包新样例全部重新通过当前审核入口正常GUI导出，Research report HTML／Word／JSON／ZIP统一当前v11；Notebook与项目JSON亦使用同一个当前项目ID，逐字段核对。下载未改项目或快照。旧v9及原下载保留在本轮完整外部证据中，不覆盖既有样例。

最终当前样例报告18页、Notebook11页，合计29页；全部渲染PNG、按原尺寸逐页查看及页边界／页码核对。六步M1同在报告第2页，五图／长层级图连续视图没有重叠裁切，Notebook原话斜体、问题粗斜体，原生树清楚且可编辑。用捆绑LibreOffice无界面渲染核对；没有操作其他窗口，也未声称在Windows Microsoft Word实机中检查。外部Word编辑不回写QT。

四类最终产物仍为：完整高亮／树Notebook；五类图与各自CSV／Python；一份按选定方法保存的Research report（Comparative版内含QCA，而非两份互相竞争的总报告）；完整项目JSON。冻结图不是新的统计，方法流程图不能替代研究者方法判断。

## 命令与证据

证据目录：`~/qualicraft-review/ux-63/`。每条命令完整argv／cwd／退出码／耗时在raw同名`.command.json`，stdout/stderr在`.txt`，退出码在`.exit`。空语法输出有退出码，不以空输出代替证据。

| 命令／核对 | 实际记录 |
| --- | --- |
| `python tools/e2e/final_joint.py --out /tmp/qualicraft-ux63/joint --site-build /tmp/qualicraft-ux63/site-build` | `raw/final-joint.*`、`joint/results.json`：26/26，正常错误0，issues0，退出0。未使用--continue-from；没有carried_evidence，没有诊断恢复 |
| W03／热图／自然滚动脚本 | `raw/website-w03.*`、`website-heatmap.*`、`website-scroll.*`：7＋7＋4=18/18，各退出0；正常错误／写请求0；301原图映射保持 |
| `python /tmp/qualicraft-ux63/reproduce.py …/joint/desktop …/reproduction` | `raw/independent-reproduction.*`、`reproduction/results.json`：六脚本退出0，全部五图成员及QCA结果相同 |
| 当前精确列表／跳转／新入口 | `raw/review-shots.*`、`review-shots/results.json`：桌面／手机2/2，原句[5,28)与2编码精确，¶17 Resume11435，M1六步，项目／快照及正常错误0 |
| 当前一致导出 | `raw/current-exports.*`、`current-exports/results.json`：七文件，v11 report／JSON／Word／ZIP内容一致，Notebook项目身份一致，项目／快照不变 |
| Word渲染与逐页 | `raw/word-report.*`／`word-notebook.*`为联合下载v9／原Notebook；`word-final-report.*`／`word-final-notebook.*`为交付当前v11／当前Notebook。`word-final-geometry.*`、`word-final/VISUAL-REVIEW.json`记录29页最终检查；相同页像素对照，变化页重新原尺寸查看，页边界及页码通过 |
| 构建与语法 | 当前独立网站源副本执行`node node_modules/next/dist/bin/next build`，`raw/build.*`退出0；`raw/syntax.*`、`audit-script-compile.*`退出0。本机npm缺失127沿用UX62原始事实，不冒称本轮执行npm成功；未安装依赖或改构建配置 |
| 全量单测与旧兼容 | 没有新产品改动，不重复全量单测；明确沿用同源UX62的287 Python（3原有跳过）／246 Node以及UX61／62旧冻结兼容／完整性拒绝证据。完整记录在保留的ux-62目录；本轮没有重新声称SIGKILL各时点或Windows通过 |
| 范围 | `raw/scope-final.*`／`scope.json`：141产品／数据／部署路径、110构建源及31旧样例全等；只改联合验收脚本与审核文档，测试入口不变。初次scope脚本把Git对中文路径的显示转义当成文件名而失败，已限制到所需产品路径并保留该工具错误输出，未读取其他资料 |

验收脚本只同步原始JSON恢复路由的断言、检查上传字节、强化每步位置比较并新增真实滚动检查，不修改任何产品行为来通过。旧UX60的39/42失败结论保持历史意义，本轮是独立新执行44/44；未回填旧结果。旧`-t .`环境收集／权限失败与后续允许loopback后通过的历史继续保留，本轮不改入口。

文档聚合脚本第一次误将热图结果根对象当作检查数组，断言失败后在写文档前停止；修正读取`checks`后，`raw/docs-update-final.*`退出0。该工具错误及原始输出保留，不属于产品失败，也不混入44项正式门禁。

## 截图与交付

主截图在`ux-63/joint/desktop/`与`joint/phone/`：

- `01-batch-import-results.png`、`03-coding-highlight-tree.png`、`04-reading-dual-tracks.png`。
- `05-resume-after-filter-refresh.png`、`06-theme-descendant-filter.png`、`06b-normal-reading-advances-memory.png`；位置五阶段原始JSON为`theme-filter-memory.json`。
- `07-network-evidence.png`、`08-network-source.png`、`09-coverage-actual-size.png`、`09-hierarchy-actual-size.png`。
- `12-comparative-saved-method-map.png`、`13-notebook-source-tree.png`、`15-restored-reading-tracks.png`、`16-restored-method-map.png`。
- `18-report-frequency.png`及`19-report-method-export-record.png`；`website-w03/`、`website-heatmap/`和`scroll/`补充网站截图。

`review-shots/*-exact-source-range-jump.png`、`*-filter-clear-Resume-paragraph17.png`及`*-M1-detail.png`来自新持久审核入口。最终Word全部页在`word-final/`，原始Word页在`word/`，不得把中间文件冒称最终文件。

入口：[网站](http://127.0.0.1:52770/) → [工作台](http://127.0.0.1:52770/w/?lang=en) → **Bologna · repaired final joint review**。新独立库只装本轮已通过的Bologna副本；旧入口、项目和恢复点均保留。本机地址仅在开发机服务运行时可访问，其他设备的127.0.0.1不指向本机。

更新包：`~/qualicraft-review/supervisor-review/`，新归档`supervisor-review-UX63-update.zip`。新增`samples/repaired-final-joint/`为当前一致交付文件；31旧样例与最初六个Word／ZIP不覆盖。包内有完整提交、范围、原始输出、截图和逐文件SHA256／ZIP CRC；不含真实访谈、活跃数据库、token或凭据。可交审核，不等于研究者接受、推送或部署批准。
