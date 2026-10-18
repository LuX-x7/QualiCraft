# UX-60 网站、报告与工作台最终联合验收

日期：2026-10-18。产品基线：`b80da59543dd41f76fcad27b0d8453fead84da72`，本地 `t7-site`。完整本轮提交见 Git 与仓库外审核包 `COMMITS.md`／`ux60-evidence/COMMIT.txt`。

## 结论与剩余问题

**整体验收未通过。** 主流程24项中21通过，JSON界面恢复桌面／手机各失败一次，手机编码树位置失败一次；另18项网站检查通过。新增P1 UX60-01及P2 UX60-02。两次HTTP400和对应控制台错误保留，其余正常HTTP／控制台和全部外部请求错误为0。原项目完整保留，可以携已知问题交supervisor讨论，但不能称最终发布候选。只新增验收工具并更新文档；不改工作台、网站、统计、绘图、数据或部署配置。

| 剩余项 | 状态与通过标准 |
| --- | --- |
| UX60-01／P1：冻结结果JSON界面恢复失败 | 当前必须优先修复。7,107,523字节的自导出项目在UI恢复返回400 `QCA integrity validation failed`。浏览器JSON往返将95处数值的float表示改成整数；值相同，哈希不同。QCA及11份冻结报告校验复现失败。保留原项目／列表／快照；不能以诊断API可恢复关闭此问题 |
| UX60-02／P2：手机打开编码树覆盖位置 | 390×844触摸模拟：Keep保存¶17（Unicode起点11435），打开Themes & Codes后变成¶1（0），主题筛选／清除／Resume沿用错误位置。阅读状态／编码／整个项目不变。见`joint/phone/theme-filter-memory.json`及独立复现`mobile-memory/results.json`；修复需保持原位置，正常阅读滚动仍可记忆 |
| 当前实体设备／系统辅助功能 | UX39已报告手机Read／Revisit、撤销、Keep／Resume、切文档／刷新通过（设备信息未补）。不能扩大为所有新控件已通过。当前批量导入／报告／导出实机、VoiceOver、OS减少动态和系统下载完成提示仍需逐项操作结果与设备／浏览器登记；本轮手机为Chrome触摸模拟，选取原句使用真实鼠标而非OS触摸选区柄 |
| F07／F08研究解释与参考对照 | 原有研究者裁决仍开放，本轮未接触私有资料；不能把软件流程通过登记为人工分析已几乎一致 |
| 用户／supervisor接受 | 审阅方法、案例／校准、叙述与证据、树和图表可用性，记录意见／接受结果；三方法流程图只是程序概览，非完成认证 |
| Windows | 用户明确暂缓，未验证；不阻挡这次本地supervisor审阅，也不声明平台通过 |
| 发布 | 本轮不推送、不部署；此前远端令牌workflow权限不足、用户选择保留本地的事实保持，未重试远端 |

UX55-01重复提醒、02提交快照、03批量队列、04完整方法及流程图保持技术关闭。UX60-02是打开手机编码树的新路径问题，不抹去UX39已报告通过的有限手机阅读操作。F01／F09的当前汇总曾残留“重复提醒／批量待做”，已更新；历史失败与旧轮结论保留。10月16日18:00旧目标已过，不登记为按时全部完成。

## 隔离数据与路径

新临时库：`/tmp/qualicraft-ux60/continued-fifth/service/qualicraft.sqlite3`。桌面前10项成功证据沿用本轮eighth执行及其完整库拷贝（result中逐项标明carried_evidence），不重复计数；后续桌面／手机独立执行。两份独立桌面／手机工作副本都从19文档／317节点／874标注开始；原生队列导入前两份公开Bologna正文，另起文档名，再对同一Unicode范围明确保存两码，最终各21文档／317节点／876标注。三个节点的Theme／Category／Code研究角色由UI明确指定，未改父子结构和统计规则；未指定角色保留Group结构标签。

原始Bologna种子GET前后完全一致；仓库示例库及141个产品／数据保护文件与基线逐字节相同。网站 `/report` 仍为manifest绑定的19文档／874关联静态样例，不把临时副本21／876的结果混称网站结果。当前构建110个网站源文件和现有审核入口资源已比对。

顺序与结果：

| 顺序 | 实际核对与结果 |
| --- | --- |
| 1 批量导入 | 原生文件选择2份TXT，逐份保存回执；正文与原公开源完全一致；再次导入同名同内容先提醒，取消后项目完全不变 |
| 2 编码 | 真鼠标选取Unicode [5,28)；输入完整叶码名Enter准确保存，第二码同范围；两条quote／code_id／document_id／范围独立核对；显式角色与树完整 |
| 3 阅读与双轨 | Read→Revisit→撤销Read，另一段Revisit；31段、2关联／1不同范围；精确¶17跳转后Keep；搜索聚焦／无匹配／清除／Resume、文档切换及刷新保留原位置；主题筛选含后代，侧栏全局计数与当前文档2关联一致；桌面位置保持，手机打开树将起点11435覆盖为0，独立列UX60-02失败 |
| 4 关系图 | 稳定ID全连线无悬空；选叶码→选新增标注→精确原句焦点→返回同码，项目不变；网站普通滚动无标题点击也展示含passage节点的网络 |
| 5 五类图 | 频次、覆盖、共现、层级、累计各实际GUI导出；原尺寸／保持比例／关闭焦点返回；25个文件与同设置的报告冻结资产逐字节一致。人工预期两码频次各+1、同范围对共现+1、累计不同码259，定义不变 |
| 6 报告与方法 | 二元QCA两技术案例、条件A／B、结果Y，明确规则／理由／证据；(1,0,1)/(0,1,0)预期解A*~B、4行真值表。Content／TA／Comparative三种报告分别保存、M1六步、5原图、四格式、冻结QCA／引文／写作保留；恢复Content再Comparative，各生成新版本 |
| 7 网站读值 | 五CSV共594行逐格完全一致；首／中／尾共15次选择定位；频次／累计真实可见柱／点悬浮及End键；热图另核301个原SVG／CSV映射；目录当前章节、十步固定窗口、手机节点连线、原10报告文件与5视频／5静态替代保留 |
| 8 Notebook与导出 | 在无匹配筛选时仍导出完整18,239字符、2关联／1范围；HTML悬浮／触摸／键盘双向定位；Word为原生可编辑树，非截图，角色／高亮metadata与HTML一致；四旧导出保持。Word外部编辑不回写QT |
| 9 恢复 | **UI正常恢复失败／P1**，服务器400拒绝；原项目／列表／快照不变。为继续隔离检查，另用Python保留导出数值类型发送原项目，恢复成新ID后，全文、树／角色、标注、阅读状态、blocks、QCA、所有保留报告版本与资产完全一致；已提交快照恢复再次比对。该诊断路径不能算正常UI验收通过。Keep／Resume是本浏览器项目／文档的本地位置，未作为项目JSON恢复目标 |

只核对三方法编辑／冻结／呈现的保真，不把技术叙述在三种报告中的保留当作新开展的三份研究。案例隶属值为明确技术测试标记，不是从Bologna编码频次推导的实质结论。旧报告无M1的兼容与UX56中断时点，沿用未改源码的上一轮回归；本轮没有冒称重新SIGKILL所有时点。

## 命令与原始证据

外部证据：`~/qualicraft-review/ux-60/`。每条命令完整argv／cwd／退出码／耗时在 `raw/*.command.json`，stdout／stderr合并在同名 `.txt`，退出码另存 `.exit`。下表的简写Python指 `/private/tmp/qualicraft-read-values-venv/bin/python`；Node为已配置Codex运行时。

| 命令（完整参数见原始记录） | 输出与结果 |
| --- | --- |
| `python tools/e2e/final_joint.py --out /tmp/qualicraft-ux60/continued-fifth --site-build /tmp/qualicraft-ux60/site-build --continue-from /tmp/qualicraft-ux60/eighth` | `raw/continued-fifth.*`、`joint/results.json`；21/24，2次预期400／控制台及1次手机位置错误，51张主流程截图；最终退出1（真实恢复门槛失败），前10项来源eighth明确保留 |
| `python tools/site/w03_acceptance.py --url http://127.0.0.1:52762 --out /tmp/qualicraft-ux60/website-w03` | `raw/website-w03.*`、`website-w03/results.json`；7/7，0控制台／HTTP／POST，退出0 |
| `python tools/site/heatmap_acceptance.py --url http://127.0.0.1:52762 --out /tmp/qualicraft-ux60/website-heatmap` | `raw/website-heatmap.*`、`website-heatmap/results.json`；7/7、301映射，退出0 |
| `python /tmp/qualicraft-ux60/scroll.py` | `raw/scroll-final.*`、`scroll/results.json`；4/4，所有十步自动滚动／5目录、无写请求，退出0 |
| `python /tmp/qualicraft-ux60/reproduce.py …/continued-fifth/desktop …/reproduction-final` | `raw/independent-reproduction-final.*`、`reproduction-final/results.json`；五绘图脚本的全部25成员一致；QCA全部值／案例ID／配置相同，退出0 |
| `python -m unittest discover -s tests -v` | `raw/python-full.*`；280项、3原有环境跳过，退出0 |
| `node --test tests/*.test.mjs tools/report/*.test.mjs` | `raw/node-full.*`；231通过、0跳过／失败，退出0 |
| `node --check web/app.js` | `raw/syntax.*`；退出0（空stdout由退出码记录证明） |
| `npm run build` | `raw/npm-build.*`；本机npm不存在，退出127；未把它写成通过 |
| `node node_modules/next/dist/bin/next build`（独立当前源副本） | `raw/build-final.*`；退出0。初次依赖软链越出Turbopack根目录失败1保留在`raw/build.*`；改复制已有依赖后通过，未改产品配置或安装依赖 |
| `render_docx.py` 两次＋逐页PNG／页边界／页码核对 | `raw/word-final-report.*`、`raw/word-final-notebook.*`、`word/visual-index.json`与`word/VISUAL-REVIEW.json`；报告18＋原文11共29页，六步M1同页、全部图文／树无重叠裁切。最终两份来自eighth下载、continued副本保持原字节；另有前期29页渲染，22页与最终像素相同，7差异页（版本／身份／证据编号）已目检，最终29页均检查页边界与页码 |
| `python -m unittest discover -s tests -t .` | `raw/known-discovery.*`保留无loopback权限的42个PermissionError／退出1；`raw/discovery-with-loopback.*`在允许测试服务器后执行，280项／3原有跳过／退出0。当前Python3.14可收集280项；未修改测试入口，旧环境收集失败记录保留于既有审核历史 |
| `python /tmp/qualicraft-ux60/scope_final.py` | `raw/scope-final.*`、`scope-final.json`；141保护路径／110构建源全等，原审核服务三资源字节相同，三个页面200，退出0 |

主脚本中间未完成记录全部保留：虚拟正文等待、Keep后折叠状态、误设不存在的Top3选项、CSV str/bytes、大写Word角色及异步版本等待、Playwright参数签名。上述早期项是验收脚本假设／调用问题；后续eighth出现的UI400为真实产品缺陷，continued中保持失败并用类型保真的诊断恢复继续检查。诊断项目列表需刷新、图表悬浮需滚到可见位置等工具修正也保留。只改工具，未改产品迎合断言；最终仍退出1，不把失败改写为通过。无“没找到”空输出充当结论。

## 截图、产物与审核入口

主截图位于 `joint/desktop/`、`joint/phone/`：`01-batch-import-results.png`、`03-coding-highlight-tree.png`、`04-reading-dual-tracks.png`、`07-network-evidence.png`、`09-coverage-actual-size.png`、`09-hierarchy-actual-size.png`、`12-comparative-saved-method-map.png`、`13-notebook-source-tree.png`、`15-json-restore-integrity-error.png`、`15-restored-reading-tracks.png`（后者为诊断恢复）、`16-restored-method-map.png`、`18-report-frequency.png`、`19-report-method-export-record.png`。`scroll/*-network-normal-scroll.png`补充常驻网络证据。Word全部页面与100%裁切视图在`word/`。

完整原始下载只保存在仓库外 `ux-60/exports/`；正常JSON界面恢复当前失败，导出文件仍原样保留供修复回归；审核包新增 `samples/final-joint/`，保留此前23个样例文件及六个最初Word／ZIP的原字节。新验收副本服务在脚本结束后关闭；原审核样例 http://127.0.0.1:52761/ → Workbench → **Bologna · method report review** 仍独立运行、源码一致。本机地址需开发机服务在线；未宣布公开上线或最终技术通过。

**四类最终产物**：完整高亮／树Notebook；五类图＋对应CSV／代码；一份按选定方法保存的Research report（Comparative版本包含QCA，不是另需两份总报告）；完整JSON恢复文件。使用者改Word仅改外部文件，改工作台报告需另保存版本。

审核包：`~/qualicraft-review/supervisor-review/`；本轮归档 `supervisor-review-UX60-update.zip`，逐文件SHA／ZIP CRC、完整提交与范围在包内清单及`ux60-evidence/raw/final-git.json`。手机缺陷的独立无项目写入复现见`raw/mobile-memory-repro-final.*`和前后截图。新增最小数值证据见`restore-numbers.json`及`raw/restore-numeric-proof.*`；修复应兼容旧冻结版本，不能删除完整性校验、重算不可信内容哈希或覆盖旧恢复点来掩盖错误。不含私有访谈正文、实时数据库、服务token或凭据。Windows暂缓，不推送、不部署。
