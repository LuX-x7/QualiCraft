# Product UX-44 · Coded transcript export · 2026-10-17

2026-10-18 最新（UX-59）：**UX55-04 方法呈现已实现并验收。** Research report 始终显示所选完整方法、空白决策提示和随版本冻结的 M1 流程图；三种方法各有步骤与回看路径，同步工作台、网站、HTML／可编辑 Word／JSON／ZIP。旧报告不自动补图，恢复保留旧内容与冻结结果；方法切换保留已选引文。280 Python（3原有跳过）、231 Node、28项桌面／手机模拟／键盘／悬浮检查、直接Next构建通过；三种Word共48页及编辑重开样例验收，五图25文件／QCA及127保护路径保持。新入口 http://127.0.0.1:52761/ → Bologna · method report review。见 [UX59完整验收](UX-59-REPORT-METHOD-MAPS.md)。UX55四项技术缺口均关闭；最终联合、当前人工设备／研究者／supervisor接受仍待做。只用Bologna副本，不改统计与绘图；Windows暂缓，不推送、不部署。下方旧条目为历史状态。

2026-10-18 最新（UX-58）：**仅关闭 UX55-03：多文件队列已实现，逐份显示读取／检查／保存、失败原因与重试，沿用同名同内容的保留／取消选择。** 最多100文件／队列、8MB／文件；项目仍最多100文档。关闭／停止在当前文件后暂停，刷新后明确重选原文件并核对文本指纹；丢失回执复用请求ID，不重复导入。只保存队列元数据，不在浏览器存正文；存储不可用时明确提示。270 Python（3原有跳过）、231 Node、58项桌面／手机／键盘／恢复与旧单文件核对、直接Next构建通过；真实100文件选择在19文档Bologna副本保存81份、逐项报告19份容量失败。129保护路径及108网站构建源保持。新入口 http://127.0.0.1:52760/ → Bologna · batch import review。见 [UX58验收](UX-58-BATCH-IMPORT-QUEUE.md)。01／02保持关闭；04方法流程图、最终联合与人工／supervisor接受仍待做。本轮不改统计和绘图，Windows暂缓，不推送、不部署。下方为历史记录。

2026-10-18 最新（UX-57）：**仅关闭 UX55-01：同名且正文完全相同的 TXT／DOCX／粘贴导入先提醒，由用户保留另一份或取消；不自动合并或覆盖。** 提醒／取消不改数据库、审计或快照，明确保留才新增独立文档；并发检查和回执重试保护已接通。新增12项API／中断回归、9项前端回归；263 Python（3环境跳过）、209 Node、18项桌面／手机导入与站点核对、5项快照界面核对和独立Next构建通过。130保护路径／108网站构建源保持；新入口 http://127.0.0.1:52758/ → Bologna · duplicate import review。证据与边界见 [UX57](UX-57-DUPLICATE-IMPORT.md)。UX55-02保持关闭；03多文件队列、04方法流程图及当前人工／supervisor接受仍待做。本轮不改统计和绘图；Windows暂缓，不推送、不部署。下方为历史记录。

2026-10-18 最新（UX-56）：**仅关闭UX55-02：快照发布改为跟随已提交SQLite待办，中断前不发布候选，提交后中断可重启补写；旧恢复点和既有保留策略保持。** 新增12项回归（最初4项在旧版全部失败）；最终251 Python（3环境跳过）、200 Node、46项中断／恢复／界面与站点核对、六脚本复现和隔离Next构建完成。135保护路径与core中Store以外AST保持，项目JSON仍v5。证据见 [UX56](UX-56-COMMITTED-SNAPSHOTS.md)。新隔离入口 http://127.0.0.1:52757/ → Bologna · committed snapshot review；旧服务／项目不重置。UX55-01重复导入、UX55-03批量队列、UX55-04方法流程图及当前实体设备／研究者接受仍开放；不改统计和绘图，Windows暂缓，不推送、不部署。

2026-10-18 最新（UX-55，只验收）：**输入／连续导入／进程中断恢复共42项核对完成，但整体验收仍未关闭。** 500,000字符、19MB项目／6MB QCA历史等边界拒绝及已保存校准（含缺失）、冻结结果、五图报告、JSON／快照／下载重试与六脚本复现已核对。新增未修：UX55-02／P2 快照可能领先未提交数据库；UX55-01／P2 同名同内容重复导入无提醒；UX55-03 真正多文件批量上传仍是范围缺口。用户新增的“Method and decisions 内完整方法名＋流程图”为UX55-04待实施，见 [方案](REPORT-METHOD-FLOW-DESIGN.md)。[本轮问题、命令与证据](UX-55-INPUT-RECOVERY-ACCEPTANCE.md)明确区分42项执行与最终门禁通过；136产品／数据／部署路径、108网站文件保持。本轮不改功能、不重跑未变产品的全套单测／构建；Windows暂缓，不推送、不部署。

2026-10-18 最新（UX-54）：**Comparative QCA 已完成现有方案中的独立二元保守切片，并接通报告与可复现导出。** Insights 内可定义案例／多文档映射、1–6 条件及独立结果，明确填写 0／1 规则、依据、隶属值／理由与原句。缺失不变零；完整真值表、独立 mixed 标记、阈值、全部同等最少项配置、必要性和覆盖已实现。保存校准与冻结运行分开，历史／JSON／快照、过期提示、明确刷新与失败／冲突保护接通。239 Python（3环境跳过）、200 Node、50项项目浏览器检查、独立复现、100技术案例／6条件及生产构建证据见 [UX-54](UX-54-COMPARATIVE-QCA.md)。现有九项分析输出、五图25成员、32保护路径保持。首页改为三方法并如实列出边界。研究者／当前实体设备及更广输入／中断门槛继续开放；fuzzy／多值等不在本切片范围。只用Bologna临时副本，不推送、不部署；Windows暂缓。

2026-10-18 最新（UX-53）：**Notebook 与 research report 已进一步梳理层级和图片分页。** 报告按研究设计→Findings（分析表／叙述／逐行解读）→审核与限制→图→证据附录→审核记录阅读；标题黑色分级、原话斜体、原生页码。每张图或长图连续视图独占受控版面，内联图片不继承正文行距；原图、CSV、参数、代码与冻结记录保持。Notebook 精简开头、强化角色与树线、短原文／树对尽量同页，长树允许续页。完整证据与当前剩余顺序见 [UX-53](UX-53-DOCUMENT-LAYOUT.md)。实际Comparative引擎、输入／中断边界、当前人工设备与研究者／supervisor接受继续开放；不是全部最终标准完成。只用Bologna副本，本地提交，Windows暂缓，不推送、不部署。

2026-10-17 最新（UX-52）：**报告已支持最多五张现有图、可编辑图注及冻结 CSV／参数／复现代码。** 当前／历史版本共享资产，修改图注不重绘；过期新增图须明确刷新。渲染在数据库写锁之外完成，提交前重查报告版本与编码指纹；冲突、生成失败和容量拒绝不改报告／审计／快照。仅Bologna临时副本；208 Python（3环境跳过）、193 Node、直接Next构建与32保护路径核对通过。完整浏览器、独立代码复现和Word分页证据见 [UX-52](UX-52-FROZEN-REPORT-FIGURES.md)。UX-50结构化Word与UX-51持久角色保留。剩余重点是实际Comparative引擎、更广输入／中断边界和最终研究者／设备／supervisor接受；未宣称全项目最终完成。只保留本地提交，Windows暂缓，不推送、不部署。

2026-10-17 最新（UX-51）：**已实现持久 Theme／Category／Code 研究角色，并接通工作台、原文 HTML／Word 和报告起始标签。** 角色由研究者明确指定／清除，随审计、快照和 JSON 恢复；旧项目保持未指定，不按层数自动分类。只改角色时表单仅提交实际改动，保留原颜色／定义等字段。198 Python（3环境跳过）、193 Node、角色及旧 Coding／报告浏览器验收、直接Next构建通过；全部五类图包25成员与结果逐字节不变，32保护路径不变。见 [实现、边界与证据](UX-51-PERSISTENT-RESEARCH-ROLES.md)。Word结构化样例仍见UX-50。剩余重点为报告图资产嵌入、独立Comparative引擎和最终联合／人工接受；未宣称全部最终标准完成。只用Bologna临时副本，不推送、不部署；Windows暂缓。

2026-10-17 最新（UX-50）：**两种可编辑 Word 已完成结构化排版：标题层级、斜体原话、正体分析、段落标签与独立记录附录。** 全文树样例15页、报告3页均渲染检查；18,239字符／53关联与冻结证据保持。191 Python（3环境跳过）、最终相关13＋19回归、14原文导出＋11报告Chrome检查及直接Next构建通过，正常控制台／HTTP／外部请求0；32保护路径不变。npm缺失127与早期验收／构建环境失败原样保留。见 [设计、命令与剩余顺序](UX-50-WORD-HIERARCHY.md)。下一步为持久语义角色、报告图资产、独立Comparative及最终联合／人工验收；本轮不冒称全项目最终完成。只用Bologna临时副本，不推送、不部署；Windows暂缓。

2026-10-17 最新（UX-49／47A）：**原生可编辑 Word 树、工作台表格／叙述报告与限定 1／2／100 文档负载已有本地验收。** 100 档为 1,565,190 字符／4,615 关联，31,700 矩阵单元、五脚本字节复现、恢复和手机／关系图检查通过；技术复制件不等于独立受访者，也不是百文件批量导入吞吐测试。新增报告原句跳转完整身份守卫，187 Node 通过；Python 189（3 跳过）与同源 Next 构建保持，58 项不同 Chrome 场景累计通过。见 [容量、边界与命令](UX-49-BOLOGNA-CAPACITY.md)、[报告及47A](UX-47-RESEARCH-REPORT-EDITOR.md)。当前干净演示为 52755 → Bologna · supervisor report sample。Comparative 引擎、持久语义角色、报告图资产嵌入、进一步容量／中断与研究者／设备／supervisor 接受仍开放；不是全部最终标准完成。只用 Bologna，不推送、不部署；Windows 暂缓。

2026-10-17 最新（UX-47）：**Export 内可编辑 Analysis Table／Narrative Analysis 已实现并保存到项目，支持版本比较／恢复、精确引文、证据过期／明确刷新及 HTML／Word 下载。** TA／内容分析有独立人工审核清单；报告标签不改码本。189 Python（3 跳过）、181 Node、49 生产代理 Chrome 场景和隔离 Next 构建通过；32 个统计／绘图／原资产／数据／部署保护文件不变。UX-46 的原生可编辑 Word 树保留。见 [实现与边界](UX-47-RESEARCH-REPORT-EDITOR.md)。Comparative QCA、持久语义角色、百份容量和研究者／设备／supervisor 接受仍开放；不能称全部最终标准完成。本机当前入口 52755；只用 Bologna 临时副本，不推送、不部署，Windows 暂缓。下方旧状态按历史保留。

2026-10-17 最新（UX-46）：**编码原文 Word 已使用原生可编辑树线与文字，不是插入截图。** 全文高亮、完整祖先关系、清楚角色标签与短叶节点跨页保留；15 页样例检查、12 导出回归及 14 浏览器场景通过。见 [Word 树与证据](UX-46-EDITABLE-WORD-TREE.md)。报告编辑器为独立 UX-47 工作流，仍在验收；Comparative、容量与研究者接受未关闭。只用 Bologna 临时副本，不推送、不部署，Windows 暂缓。

2026-10-17 推送结果补记（UX-45R）：本轮功能提交为 `3710a05df86e44940aa3216f1469e747291924d3`，本地干净。**实际 GitHub 推送未成功**：现有 HTTPS PAT 缺 `workflow` 权限，GitHub 拒绝待推送历史中 UX-09 的测试工作流更新；严格核验 GitHub 官方主机密钥后，SSH 也返回 `Permission denied (publickey)`。远端未创建 `t7-site`，main 未改；没有删除工作流或改写审核历史绕过权限。用户随后明确选择“暂时保留本地提交”；停止远端重试，后续收到新指示再处理授权和推送。截图、产物、完整提交和拒绝原始输出已收进本地审核包；不冒称已上线／已发布。没有产品代码新改动，无需因本次记录重复功能测试。Windows 仍暂缓，不部署。

2026-10-17 最新（UX-45）：**QT 起步卫星背景、简洁编码原文树和网站／工作台能力状态已同步，完成本轮技术验收；这仍是审核版，不是全部最终标准完成。** HTML 去表格边框，以正文＋树线／角色节点阅读，Word 为无边框可编辑文字布局，技术信息收进详情／附录。可明确选择 Theme→Category→Code 展示标签；默认仍是 Group／Code，展示预设不等于已保存研究角色。网站新增两种现有导出说明，Comparative QCA 和 Analysis Table／Narrative Analysis 编辑器明确标为待实现。174 Python（3 跳过）、181 Node、38 Chrome 场景及隔离 Next 构建通过；33 个统计／绘图／数据／资产／部署保护文件不变。用户本轮已明确授权推送现有 GitHub 仓库，范围为现有 t7-site 审核分支，保持 main、可见性与自动部署关闭；不进行部署。完整证据与剩余标准见 [UX-45](UX-45-REVIEW-FINISH.md)。Windows 暂缓且未验证；下方各轮“未推送”等表述只代表当时历史状态。

2026-10-17最新（UX-44）：**UX42编码原文对照导出已实现自包含HTML＋可编辑DOCX，并完成Bologna技术验收。** 单份／所选多份／全部范围明确，全文、高亮与实际Group／Code祖先树、同句多码／重叠／跨段及完整ID对应保留；不自动推断Theme／Category研究语义。HTML悬浮／触摸／键盘双向定位，禁脚本仍可读；备忘录默认排除，版本指纹与旧文件过期提示已接通。155 Node、172 Python（3跳过）、14生产代理浏览器场景、语法与隔离Next构建通过；正常控制台／HTTP／外部请求0，Word全文样例14页及编辑样例3页检查。见 [实现与证据](UX-44-CODED-TRANSCRIPT-EXPORT.md)。只用Bologna临时副本；原数据、v5格式、四旧导出、统计／绘图和网站／报告资产不改。独立PDF、语义角色设置、报告编辑、三方法／容量、实体设备／supervisor与发布门禁继续开放；Windows暂缓且未验证，不推送、不部署。下方旧轮次按历史保留。

2026-10-17最新（UX-43）：**UX40-01已修复并在Bologna临时副本验收。完整叶名先于父级包含匹配；同名／路径多义时Enter不自动保存，明确方向键／鼠标／触摸或完整身份可选择。** 候选按精确程度排序后再截8项，完整名称／路径／ID可换行，原有父级编码及新码创建保留。专用16回归先12失败后全过，全部148 Node、163 Python（3跳过）、语法／隔离生产构建通过；14工作台场景＋构建后代理核心1项及首页／报告4页通过，正常控制台／HTTP／项目外请求0。见 [修复与证据](UX-43-CODE-POPUP-EXACT-MATCH.md)。只改弹出选码及相应测试，原Bologna、统计／绘图、网站／报告资产保持；本轮无真实资料重跑。编码原文对照导出仍待做，下一步按UX-42推进；报告编辑／三方法／容量／当前实体设备／supervisor与发布门槛继续开放。Windows暂缓且未验证，不推送、不部署；下方旧状态按历史保留。

2026-10-17补充（UX-42，新增导出要求）：**最终输出增加编码原文对照文档：完整正文与精确高亮，右侧逐段保留原句对应的Code／Category／Theme实际树形路径，方便整理Narrative Analysis。** 同句多码、重叠、同名不同路径、跨段／跨页和未编码语境均须保留；默认全文范围不受临时筛选／视口影响。当前四导出没有此项，产品未实现／验收。已写入 [最终标准F11](FINAL-ACCEPTANCE-V2.md)及 [UX-42完整规格](UX-42-CODED-TRANSCRIPT-EXPORT.md)。格式组合为建议，不把未确认项冒称用户要求。本轮只更新文档，不读取真实正文或改产品／统计／绘图／数据；UX40-01仍优先，随后在第五模块先做编码证据输出、再接报告编辑。Windows暂缓且未验证，不推送、不部署。

2026-10-17 最新（UX-41，模板与第二份私有验证）：**三份指定附件已审查；实际作业方法确认为Qualitative Content Analysis。用户明确保留TA／内容分析／Comparative三种最终路径，后者单列新增，尚未实现。** 第一份结果封存不改，完成13行参考映射；主要意义相关但有一处助手证据覆盖不足，不计算一致率。第二份在新隔离项目完成41段／31范围／38关联／24树节点，8组应用检查、五图60行CSV／五脚本／四导出恢复及6组私有结果页检查通过。Word报告四页已检查，但在产品外制作，不是工作台新增功能。第二份已看过参考，不能称盲测；正文、截图及具体对照仅私有保存。见 [本轮审查与边界](UX-41-TEMPLATE-SECOND-CASE.md)、[更新的最终标准](FINAL-ACCEPTANCE-V2.md)。本轮仅更新审核文档；产品／统计／绘图／网站不改，UX40-01/P2、报告编辑器、三方法完整流程、百份容量、人工／supervisor接受和发布门禁仍开放。Windows暂缓且未验证，不推送、不部署。下方旧轮次按原授权范围保留。

2026-10-17 最新（UX-40，独立资料验收）：**用户已授权本轮真实访谈范围例外并授权代为脱敏；隔离副本主流程可跑通，但不能登记全通过。** 14项使用显式编码选择的流程检查通过，另1项“叶编码名＋Enter”场景失败：**UX40-01／P2**，父主题名包含叶名时默认候选可把标注保存到父级；显式选条目／输入完整路径可绕过，本轮未修。原PDF保留，匿名TXT导入后55段、13树节点／9活跃码、13标注／10范围；32图表CSV行、25图包成员、五脚本、四导出和v5恢复核对。正文、原句、原始数据文件与含正文截图仅在私有临时目录，Git及公开审核包仅含匿名计数和问题证据。统计／绘图／产品代码与原项目不变，未重跑全量单测／构建。见 [独立结果与问题](UX-40-INDEPENDENT-ACCEPTANCE.md)。UX40-01、其余人工／视觉与发布门禁开放；Windows暂缓且未验证，不推送、不部署。下方旧轮次按历史保留。

2026-10-17 最新（UX-39，人工结果登记）：**用户已确认手机Read／Revisit、撤销、Keep、Resume，以及切换文档和刷新后的保留均通过。** 结果来自本对话用户报告，对应独立Bologna手机临时副本；本轮不读取或重置该测试库，不改功能／数据，不重跑自动化或构建。手机型号、系统及浏览器版本尚未提供，已请求补齐，不能据此宣称跨设备兼容。VoiceOver、系统减少动态效果、操作系统下载完成提示、整体视觉／supervisor接受与发布门禁仍开放；其他未报告手机路径不一并关闭。见 [人工结果与边界](UX-39-MOBILE-MANUAL-ACCEPTANCE.md)。Windows继续暂缓且未验证，不推送、不部署。下方旧轮次按历史保留。

2026-10-17 最新（UX-38，只验收）：**W03调整后的联合流程54/54通过；范围内未发现新增功能缺陷。** 新Bologna副本实际完成导入→两码同句→Read／Revisit与双轨→筛选／跳转／记忆→关系图→五图→报告594行／301热图映射→四导出／v5恢复。原手机搜索／Keep失败顺序继续通过；W03完整图框、手机全名、Import／Export工程图形与所有原图／媒体保留。23登记项目预览健康，原种子19/317/874／审计、常用4445库、产品与资产哈希保持。仅更新8份审核文档，不重跑全量单测或构建；UX-37的153 Node／直接Next构建与UX-35的163 Python（3跳过）明确作历史证据。见 [本轮流程、剩余事项与截图](UX-38-JOINT-ACCEPTANCE.md)。**W03技术项保持完成；用户／supervisor视觉接受、当前实体设备／VoiceOver与正式发布门禁仍开放。** Windows暂缓且未验证，不推送、不部署。下方旧轮次为历史。

2026-10-17 最新（UX-37）：**W03本轮授权的视觉收尾已实现并技术验收，用户视觉接受仍待确认。** 固定演示窗去掉重复大标题，网络完整适配普通／矮桌面；主题／节点筛选按需展开，手机节点全名以18px独立显示并随触摸／键盘更新。Import补文件→真实文本记录→准确坐标，Export补项目结构→四格式分支；原线稿、路径图、圆点网络、五图／全表／下载及五录屏／静态替代全部保留。33浏览器（7新＋10网站＋7热图＋9录屏）、153 Node、语法与直接Next生产构建通过；npm缺失127保留。仅Bologna，工作台／统计／数据／10报告资产与10媒体文件不变，22预览更新。见 [本轮范围与截图](UX-37-W03-VISUAL.md)。**W03实现项本轮关闭，整体视觉／supervisor接受、当前实体设备与发布门禁不代签；Windows暂缓且未验证，不推送、不部署。** 下方旧轮次为历史。

2026-10-17 最新（UX-36，只验收）：**UX-34／35修复后的联合流程47/47通过；UX33-01／02在本次真实导入和标记副本中均复验通过。** 网站→导入→编码→Read／Revisit与双轨→筛选／跳转／记忆→关系图→五图→报告读值→四导出／v5恢复走通；594报告行、301热图映射、25图包成员、22登记前台与原数据／产品哈希核对。没有修改功能、统计、绘图、资产或测试代码；不重复全量单测／构建，UX-35的153 Node、163 Python（3跳过）及直接Next构建为同产品历史证据。见 [联合验收与剩余事项](UX-36-JOINT-ACCEPTANCE.md)。**可交supervisor审核；W03视觉收尾、用户接受、当前实体设备／VoiceOver与正式发布门禁仍开放，不能称全部完成。** Windows暂缓且未验证，不推送、不部署。下方旧轮次保留历史含义。

2026-10-17 最新（UX-35）：**UX33-01 已修复并本地验收，UX33-02保持关闭。** 手机聚焦上方搜索框不再覆盖搜索前阅读位置；匹配／无匹配、清空输入／Clear filters、Resume均回到原段落。真实触摸／键盘／滚轮阅读仍可推进下一次搜索锚点，显式Keep仍可替换；项目／文档／源文本身份隔离，临时搜索返回只存内存。9项新增Node回归与13项搜索Chrome回归先失败、后通过；153 Node、163 Python（3跳过）、语法与直接Next生产构建通过，npm缺失127保留。13搜索＋12 Keep＋11概览＋2只读／存储共38项通过；21登记前台200并提供当前JS/CSS。仅Bologna临时副本；原模板19/317/874、普通4445数据库、统计／绘图／CSV／10报告资产均不变。见 [修复、证据与边界](UX-35-SEARCH-POSITION.md)。**本轮只关闭01；W03、用户／supervisor接受、当前实体设备／VoiceOver及发布门禁仍开放。** Windows暂缓且未验证，不推送、不部署；下方旧轮次按历史保留。

2026-10-17 最新（UX-34）：**UX33-02 已修复并本地验收，UX33-01 按用户要求保持开放。** 手机触摸Keep使用当前项目／文档的来源跳转锚点；仅在原文进入正文阅读线时推进，控件滚入视口不再把首段当作新目标。真正触摸滚动阅读后仍能保存新位置；保存使用选定锚点，避免恢复布局再次覆盖。5项新增Node回归修复前3失败、修复后全过；144 Node、163 Python（3跳过）、语法／直接Next生产构建通过，npm缺失127保留。12项专用检查（含1项UX33-01仍存在的范围观察）＋11项原概览＋2项只读／禁用存储均通过；20登记前台健康并逐字节提供当前JS/CSS。只用Bologna临时副本，原19/317/874／审计与常用4445数据库、统计／绘图／CSV／10个报告资产不变；其余168个顶层JS函数及全局事件代码不变。见 [修复、证据与边界](UX-34-KEEP-POSITION.md)。**本轮只关闭02；01、其余W03、用户／supervisor接受、当前实体设备／VoiceOver与发布门禁仍开放。** Windows暂缓且未验证，不推送、不部署；下方旧轮次按历史保留。

2026-10-16 最新（UX-33，只验收）：网站→工作台导入→编码→阅读标记／双轨→关系图→五图→报告读值→导出已走查。**46项浏览器检查44通过、2失败，不能登记为联合验收全通过。** 新增 **UX33-02 / P2**：390px触摸从概览跳到¶4后，点击 Keep 时控件滚入视口，保存锚点可能变为¶1；对应键盘／桌面对照通过。**UX33-01 / P3**：手机键盘聚焦上方搜索，原¶4锚点在输入前已被视口移动覆盖为¶1。两项只影响浏览器位置，原文／编码／项目手动标记不丢失。本轮163 Python（3跳过）、139 Node、语法通过；594报告表行、25图包成员、四导出与v5恢复核对，正常控制台／HTTP错误为0。仅Bologna临时工作副本20/317/876，原19/317/874种子与常用4445数据库不变；214个核心路径文件和10个manifest资产不变。**T03已实现，手机位置记忆的联合接受重开；先修02，再复核01，之后处理W03视觉／用户与实体设备／发布门禁。** 见 [本轮问题、截图与命令](UX-33-JOINT-ACCEPTANCE.md)。本轮不改功能、不重建产品，构建沿用32B历史通过证据；Windows暂缓且未验证，不推送、不部署。下方旧轮次为历史。

2026-10-16 最新：**UX-32B 已实现阅读标记／已有编码范围双轨概览、精确段落／原句范围列表与跳转。** Overview 默认折叠、展开随正文滚走，两轨均按全文原始 Unicode 字符坐标绘制；同范围多码保留实际 annotation／code ID，连续笔迹只作视觉并集。全文轨道不随搜索或编码筛选缩短，缺失原文必须明确选择 Show full document & jump；预览／跳转不改 Read，也不覆盖原 Resume，Keep this reading position 才更新本浏览器位置。网络原句定位／返回保持优先；手机默认固定栏134px，支持触摸、键盘分页和精确跳转。10项新Node回归（最初6项先失败）、139 Node／163 Python（3跳过）、11概览＋10原标记＋2只读／存储禁用浏览器场景、语法／直接Next构建通过；npm缺失127保留。原Bologna19/317/874、项目v5存储、后端、统计／绘图、两CSV、五图与报告／网站资产不改。见 [32B实装与证据](UX-32B-READING-OVERVIEW.md)。**T03本轮计划内技术功能已验收；其余W03、用户／supervisor视觉接受、当前新控件实体设备／VoiceOver及发布门禁仍开放。** Windows暂缓且未验证，不推送、不部署；下方旧轮次为历史。

2026-10-16 最新：**UX-32A 已实现 Coding 手动三态标记、即时保存与撤销，项目 JSON 升为 v5。** Unmarked／Read／Revisit 与位置、编码独立；成功应答后显示新状态，失败可重试，409 先读回最新值再由用户重选；JSON 导出／恢复保留项目标记。旧 v4 GET 仅内存升级，首写前检查原持久化 v4 恢复点；阅读单独写入不轮转普通快照，下一次研究编辑收录，当前状态可立即导出 JSON。8 项 Python 专用／7 项 Node 专用回归、163 Python（3 跳过）、129 Node、10 项 Chrome 主验收、17 个预览健康与正常／只读桌面手机检查、语法／直接 Next 构建通过；npm 缺失127原始输出保留。Bologna 19/317/874、八分析、两 CSV、五图数据／脚本／结果、报告资产与录屏保持。见 [32A 实装与证据](UX-32A-READING-MARKS.md)。**32B 两轨范围概览／列表未实施；T03 仅本轮存储与标记切片关闭，其余 W03、用户／实体设备及发布门禁仍开放。** Windows 暂缓且未验证；不推送、不部署。下方旧轮次按历史保留。

2026-10-16 最新：**UX-31 已完成 T03 明确已读／编码范围概览的审查与方案，尚未实现功能。** 推荐将位置（浏览器）、手动标记（Unmarked／Read／Revisit，未来项目格式v5）和现有编码范围分开；明确中性迁移、冲突／失败、JSON／Methods／CSV、快照滞后规则。默认紧凑、概览按需展开的桌面／手机线框与18条待实施验收标准已交付，见 [方案](UX-31-READING-STATE-DESIGN.md)／[静态界面稿](UX-31-READING-MOCKUP.html)。只读Bologna临时副本：19/317/874，示例31段、53标注／52来源范围；桌面／390px无写请求，静态布局无溢出／控制台错误，251个非文档文件和10个manifest资产不变。**运行产品仍为UX-30，项目仍v4；T03实现、其余W03、用户／实体设备与发布门禁仍开放。** 本轮不重跑功能测试或构建，不冒称方案交互已验收。Windows暂缓且未验证，不推送、不部署；下方旧轮次按历史保留。

# Latest running product · UX-30 · 2026-10-16

2026-10-16 最新：**UX-30 已修复并验收 UX17-05 启动健康误报。** 启动诊断改查与现有代理一致的 `/w/api/bootstrap` 并核对结构；每次最多 5 秒、最多 3 次、间隔 1 秒，不阻塞网站启动。暂未就绪显示 waiting，恢复显示 ready，持续连接／HTTP／超时／无效响应明确 failed，不跟随重定向、不记录 token 或项目内容。14 项回归先失败后通过；9 种真实 Next 启动场景、155 Python（3 跳过）、122 Node、语法和直接 Next 生产构建通过。npm 不可用（127）保留；128 个受保护文件、10 个 manifest 资产和 Bologna 临时库字节不变。16 个登记前台重启后首探均 ready，常用 4445 桌面／手机模拟控制台无错。见 [范围与证据](UX-30-STARTUP-HEALTH.md)。**UX17-01…05 均已按各轮证据关闭；明确已读／范围、其余 W03、用户／实体设备接受与发布门禁仍开放。** Windows 暂缓且未验证；不推送、不部署。下方旧轮次结论按历史保留。

# Prior recording refresh · UX-29 · 2026-10-16

2026-10-16 最新：**UX-29 已更新五段当前 QT 真实录屏并关闭 UX17-04。** Import 保存回执／原文、Coding 完整归属、Analysis 展开原句节点的关系图、Plotting 实际结果与下载、Export 已核验 JSON 文件名／大小／预览均可见；保留原交互图和真实首帧静态替代。180/180 编码帧核验、9 专用浏览器 + 10 原网站回归、155 Python（3 跳过）、108 Node、语法与直接 Next 生产构建通过；npm 不可用的 127 输出保留。只改媒体清单／日期说明／十个生产素材及验收工具、文档，工作台与统计／绘图不变；111 个受保护文件及 10 个 manifest 资产匹配基线。常用 4445 已更新。见 [本轮范围、证据与限制](UX-29-CURRENT-QT-RECORDINGS.md)。**UX17-05、明确已读／范围、其余 W03、视觉／实体设备接受和发布门禁仍开放。** Windows 暂缓且未验证，不推送、不部署。下方旧轮次状态按历史保留。

# Prior joint acceptance · UX-28 · 2026-10-16

2026-10-16 最新：**UX-28 视觉统一后联合验收完成：主路径 8/8，全部浏览器检查 37/37。** 新 Bologna 独立临时副本按导入→真实鼠标两码→关系图原句往返→五类图／ZIP→报告 594 行与 15 次读值→四格式导出走通；手机全部 20 文档、五图原尺寸、键盘／悬浮、无 JS 原图与表格通过。123 个产品／数据文件和 10 个 manifest 资产不变；原 19/317/874 与审计保留，工作副本为 20/317/876。范围内未发现新增 P1/P2 阻断，UX17-01/02/03 保持关闭；UX17-04 旧录屏、UX17-05 启动探针仍为 P3，明确已读／范围、剩余 W03、视觉／设备接受与发布门禁未关闭。见 [UX-28](UX-28-JOINT-ACCEPTANCE.md)。本轮仅文档，未重复全量单测／构建；最近 UX-27 证据仍有效但不算本轮新跑。Windows 暂缓，不推送、不部署。

2026-10-16 最新：**UX-27 已完成 T04 本轮授权的跨页面视觉统一与本地技术验收。** 工作台起步／侧栏使用网站同款像素 QT，移除 Q／QC 复合标识；纸色、墨色主按钮／悬浮／边框、等宽导航及当前项统一。侧栏去网格，正文白底，原文／选区不动，正文对比度 14.84:1。155 Python（3 跳过）、108 Node、7 新视觉 + 12 起步 + 10 阅读 + 11 Coding 检查、语法／构建通过；原 Bologna、8 分析、61 受保护哈希／10 资产／31 JS 函数不变，4445 已更新。见 [UX-27](UX-27-VISUAL-UNITY.md)。仅网站页签图标同步更新；网站／报告源码、后端／统计／绘图不改。T04 技术项完成，视觉／真机接受、明确已读／范围、剩余 W03、UX17-04/05 和发布门禁仍开放；Windows 暂缓，不推送、不部署。下方旧轮次为历史。

[UX-26](UX-26-STARTUP-GUIDE.md) implements the authorized T01/T05 slice. Fresh local visits use an explicit start page; a truly empty work area no longer seeds a fictional project. Explicit Import creates a named empty project; Try Bologna creates an independent validated copy from the bundled read-only template. Successful project selection is remembered by stable ID and resumes UX-25 paragraph memory; stale/corrupt IDs return to start. The optional inline three-step guide advances with actual import/coding, supports Skip/close/Done, Help, Escape and focus return, without enabling tools or sending model requests. Existing/restored work opens directly; public samples remain read-only. 155 Python (3 skipped), 108 Node, 12 startup + 10 reading + 11 hierarchy Chrome checks, syntax and direct production build pass. Original Bologna JSON/audit/snapshots, eight analyses and template stay equal; 59 protected hashes, ten report files, 31 key JS and three server functions match. Only startup/guide UI/server setup, regressions and review docs change; statistics/plotting/site/CSV unchanged. Evidence `~/qualicraft-review/ux-26/`; normal 4445 uses the same unchanged temporary DB, QA 4455/4456/4457 covers populated/empty/read-only. T01/T05 technically complete; explicit read/range overview, T04/remaining W03, UX17-04/05 and owner/device/release acceptance remain open. Windows deferred; no push/deploy. [Current plan](EXPERIENCE-ROADMAP.md). Earlier entries below are historical.

# Latest implementation · UX-25 · 2026-10-16

[UX-25](UX-25-READING-NAVIGATION.md) implements the authorized T03 reading-navigation slice: compact Coding header, persistent document/paragraph/coding paths, browser-local per-project/document paragraph restoration, and a native phone document switcher. Search/filter results do not overwrite the original position; relationship-map source jumps keep priority. Details/notes and normal tools remain available; delayed notes stay with their original document/project. No read-completion state, range overview, startup redesign or schema changes. 150 Python (3 skipped), 99 Node, 10 new Chrome + 11 hierarchy checks and the 20-document/uncoded-import phone supplement pass; syntax/direct production build pass. Original Bologna JSON/audit/snapshots and eight analyses remain equal; 60 protected hashes, ten report files and 31 critical functions match. Only workbench UI, tests and review docs change. Evidence: `~/qualicraft-review/ux-25/`; normal preview 4445 restarted, isolated acceptance 4454 → 8854. UX17-03 technically closed; remaining T03 scope, T01/05/04, W03, UX17-04/05 and owner/device/release acceptance remain open. Windows deferred; no push/deploy. [Current plan](EXPERIENCE-ROADMAP.md). Earlier status entries below are historical.

# Latest implementation · UX-24 · 2026-10-16

[UX-24](UX-24-CODING-HIERARCHY.md) implements T02 under the owner’s explicit workbench-UI authorization. Coding now exposes nested saved Themes/Groups, parent codes and codes, full paths, calm source highlights and exact per-coding focus. Phone users can open the same tree; overlapping assignments and normal coding/edit/merge remain available. Imported Bologna records are correctly labelled IMPORTED, without changing provenance. 150 Python tests (3 skipped), 91 Node tests, 11 project-only Chrome checks, syntax and production build pass. Only web/app.js and web/style.css change product behavior; statistics, plotting, data, website and report assets are untouched. The original 19/317/874 Bologna project remains equal; real write regression uses separate restored copies. Sixty protected hashes, eight analysis outputs and 32 key JS functions remain unchanged. Evidence: `~/qualicraft-review/ux-24/`. T03, T01/05/04, remaining W03, UX17-03/04/05 and owner/device/release acceptance remain open. Windows deferred; no push/deploy. [Current plan](EXPERIENCE-ROADMAP.md).

# Latest implementation · UX-23 · 2026-10-16

[UX-23](UX-23-HEATMAP-LENS-STICKY.md) adds movable original-SVG magnifiers to both heatmaps and restores one sticky desktop stage for the entire workflow, following the owner’s latest layout correction. Original path diagram, circular network, Coding and all five plots remain independent scroll steps; phone views retain all content. 82 Node tests, 17 project-only Chrome checks, 301 magnifier mappings, all 594 existing CSV readouts and production build pass. Forty protected files remain identical; workbench/statistics/data/report assets unchanged. W01 is technically implemented; remaining W03, T01–T05, UX17-03/04/05, visual/device acceptance and release gates remain open. Evidence: `~/qualicraft-review/ux-23/`. Windows deferred; no push/deploy. [Current plan](EXPERIENCE-ROADMAP.md). Earlier layout/status statements below are historical.

# Latest correction · UX-22 · 2026-10-16

[UX-22](UX-22-KEEP-EXISTING-DIAGRAMS.md) corrects the interpretation: add the circular network without replacing earlier diagrams. The original simple Analysis path illustration is restored at `/#story-analysis`, followed by the additional circular network at `/#story-network`. Coding, all five plots, original assets and downloads remain. The original component matches its pre-UX-21 source after namespace-only normalization. 77 Node tests, ten project-only Chrome checks, all 594 CSV readouts and production build pass; source/workbench/data/report assets are unchanged. Evidence: `~/qualicraft-review/ux-22/`. W01, remaining W03, workbench T01–T05, UX17-03/04/05, visual/physical-device acceptance and release gates remain open. Windows deferred; no push/deploy. [Current plan](EXPERIENCE-ROADMAP.md).

## Prior implementation · UX-21

[UX-21](UX-21-PERMANENT-NETWORK.md) implements permanent website Coding and Analysis plates. The owner clarified the relationship map means the workbench-style circular network, not a flowchart/tree. Analysis now uses existing report evidence (389 saved examples; 313 theme/code nodes) and 16 existing CSV pairs, with hover/focus/selection, drag, source expansion and mobile zoom/pan. Coding remains a distinct single-assignment drawing. Ordinary scrolling exposes both, independent of the plot stage. 77 Node tests, nine project-only Chrome checks, all 594 CSV readouts and the production build pass. Forty protected source/data/report/clip files remain byte-identical; no workbench/statistics/data changes. Final screenshots/raw outputs: `~/qualicraft-review/ux-21/after/`. Current preview is 4445. Only W02 and the Coding/Analysis part of W03 are implemented; owner visual acceptance, W01, workbench T01–T05 and UX17-03/04/05 remain open. The owner’s new workbench-header screenshot is recorded for later reading-location layout only. Windows deferred; no push/deploy. [Roadmap](EXPERIENCE-ROADMAP.md).

## Prior design review · UX-20 · 2026-10-16

[UX-20](UX-20-EXPERIENCE-DESIGN.md) records the owner's renewed website/Coding feedback and a proposed sequence. **Documentation only; none of its new interactions or workflow states are implemented.** Project-only Chrome inspection at 4445 found the desktop relationship graph in the changing Analysis scene, while the mobile layout hides its connected SVG. The Bologna temporary project remained unchanged (19 documents/317 codes/874 codings). Proposed next work: a permanently visible passage/code/theme graph within the workflow section and a Coding/Analysis visual sample; then the matrix magnifier, Coding hierarchy/highlights/location (including open UX17-03), startup states, optional onboarding and unified acceptance. Screenshots and raw evidence: `~/qualicraft-review/ux-20/`. UX-19 remains the latest implemented repair and broad regression baseline. UX17-03/04/05, owner visual/device acceptance and release gates remain open. No feature changes, push or deploy; Windows deferred. See the current [plan](EXPERIENCE-ROADMAP.md).

## Latest implemented repair · UX-19 mobile figure viewer · 2026-10-16

[UX-19](UX-19-MOBILE-FIGURE-VIEWER.md) closes **UX17-02 only**. The workbench adds an Enlarge figure entry above the original preview and a native dialog showing the same SVG at 100%, with proportional zoom, two-axis scrolling, keyboard/focus handling and direct SVG download. Existing full bundles remain intact. No renderer, statistics, CSV or report asset changes: all 25 members of five actual figure bundles match the pre-change baseline byte-for-byte. 150 Python tests (3 skipped), 74 Node tests, five project-only Chrome checks plus lifecycle/reverse-Tab checks, syntax and production build pass. Source/output records, the intentional pre-fix failure and eight final screenshots are in `~/qualicraft-review/ux-19/`. Normal 4445 preview has been restarted; isolated acceptance 4452 → 8852 uses an unchanged fresh Bologna copy, 19 documents/874 codings. UX17-01 remains closed; UX17-03/04/05 and owner/device/release acceptance remain open. Windows deferred; no push/deploy. Current [plan](EXPERIENCE-ROADMAP.md) and [English brief](SUPERVISOR-ONE-PAGE.md) supersede older notes below.

## Prior hierarchy fix · historical UX-18

[UX-18](UX-18-HIERARCHY-LAYOUT.md) closes **UX17-01 only**, under the owner's explicit permission to change the hierarchy display path and related report assets. Font-measured rows and independent theme columns retain all 259 records. Five CSVs, all original result fields/credits and the other four SVGs are unchanged. 150 Python tests (3 skipped), 74 Node tests, five project-only Chrome checks (desktop/phone/keyboard/console/download), standalone SVG/PDF/PNG byte reproduction and production build pass. Actual 9/10 pt PDF text has no collisions/clipping; the generic source check's Type42 preference is explicitly excepted to retain working CFF glyphs/Type3 output. See scope and raw records in UX-18 and `~/qualicraft-review/ux-18/`. Normal preview 4445 has been restarted; isolated acceptance 4451 → 8851 uses a fresh 19-document/874-coding Bologna copy. UX17-02/03 mobile issues, 04/05 follow-ups, owner/device acceptance and release gates remain open. Windows deferred; no push/deploy. Current [roadmap](EXPERIENCE-ROADMAP.md) and [English supervisor brief](SUPERVISOR-ONE-PAGE.md) supersede older status text below.

## Prior joint acceptance · historical UX-17

[UX-17](UX-17-JOINT-ACCEPTANCE.md) audits the unchanged application at `4a7936878b658099943e1bab1efaf7d09420839a`. Eight functional stages pass on a fresh Bologna copy: import, real mouse coding, network/source roundtrip, five real plot bundles, 594 report table rows with 15 exact readouts, and four byte-verified exports, plus desktop/phone touch/keyboard checks. Normal console/HTTP errors are empty. **Three P2 findings remain: overlapping hierarchy labels in original exports, tiny mobile plot previews, and no direct mobile document switcher.** Old recordings and a misleading startup health probe are P3. The report stays a fixed 19-document/874-coding snapshot; the QA copy has 20/876. No functional code, source data or assets changed in this review. See the [roadmap](EXPERIENCE-ROADMAP.md); evidence `~/qualicraft-review/ux-17/`. Normal review entry remains 4445; isolated joint acceptance is 4450 → 8850. Windows deferred, no push/deploy. Owner visual and physical-device acceptance remain open. Latest broad test/build results are UX-12's; not rerun in this documentation-only round.

Prior implementation: [UX-12](UX-12-IMPORT-EXPORT.md) (Import/Export UI); [UX-16](UX-16-HOVER-NETWORK-CLARITY.md) (website interactions).

<!-- Below: historical handoff entries, not current completion claims. -->

> 当前入口：UX-13 回应六项首页反馈，见 [记录](UX-13-SPATIAL-NOTEBOOK.md) 与 [总计划](EXPERIENCE-ROADMAP.md)。QT 居中、粒子透视、可组合工程线稿、九段自然滚动与完整五图、明确关系节点、大字号和全首页网格。用户视觉接受及实际 QT 试用待确认；UX-12 工作台导入／导出界面另列。Windows 暂缓，不推送、不部署。

> 当前：用户未接受此前视觉结果，UX-10 已重开首页与报告展示。前端 CSV 新呈现获授权，保留原图/完整数据，不改工作台。[本轮记录](UX-10-VISUAL-RESTART.md) · [总计划](EXPERIENCE-ROADMAP.md)。本地技术检查不等于用户视觉接受；实际 QT/设备试用待确认。推送暂停，未部署，Windows 暂缓。

> 最新：2026-10-15 UX-06 已修复覆盖图轴方向并更新报告资产，[验收](UX-06-COVERAGE-AXES.md)。五 CSV、所有统计值和四张其他图不变；UX-04A-L01 已关闭。审核包及[总计划](EXPERIENCE-ROADMAP.md)已更新。Windows 暂缓，不推送、不部署。

> 最新：2026-10-15 体验阶段 2A…5 已验收，见[集成记录](UX-05-INTEGRATION.md)与[supervisor 审核提纲](SUPERVISOR-REVIEW.md)。完整现状以[总计划](EXPERIENCE-ROADMAP.md)为准。覆盖原图方向限制明确保留；Windows 暂缓，不推送、不部署。

> 最新：UX-04B 报告有限原句例证已验收，[记录](UX-04B-SOURCE-EXAMPLES.md)。下一步 5 视觉/响应式及 supervisor 审核包。Windows 暂缓，不推送不部署。

> 最新：UX-04A 五图读值验收完成，[记录](UX-04A-REPORT-READERS.md)。新发现覆盖图原始方向限制，按原计划明确退回 CSV 选择；未改绘图。下一步 4B → 5。

> 最新：2026-10-15 UX-03B 五模块展示已验收，见[记录](UX-03B-WORKFLOW.md)。下一步 4A/4B → 5；[总计划](EXPERIENCE-ROADMAP.md)。只使用同一项目标签页，不读取其他窗口。

> 最新：2026-10-15 UX-03A 首页精简与 Coding 样板已验收，见[记录](UX-03A-HOME-CODING.md)。下一步 3B；当前全部状态与周末目标见[总计划](EXPERIENCE-ROADMAP.md)。只用本项目标签页，不读其他窗口。

> 最新：2026-10-15 UX-02D 事实校正已完成，见[验收](UX-02D-FACTS.md)。下一步 3A/3B；只使用本项目标签页验收，不读取其他窗口。

> 最新：2026-10-15 UX-02C 已完成，见[验收](UX-02C-NETWORK-CONTROLS.md)。用户要求继续 2D 及后续；浏览器只能操作本项目标签页，不读其他原生窗口。Windows 暂缓，不推送、不部署。

<!-- 最新体验轮入口；下文历史交接保留。 -->
> 2026-10-15 更新：UX-02B 已完成关系图直接入口、完整证据、准确定位与返回；[验收](UX-02B-NETWORK-EVIDENCE.md)。用户要求周末前完成已规划体验项供 supervisor 审核，Windows 明确允许暂缓；当前状态、目标时间和验收门槛统一见[总体计划](EXPERIENCE-ROADMAP.md)。仍不推送、不部署。

# 移交说明：接手这个仓库要先读的东西

> **2026-10-15 更新入口**：当前体验工作的状态、已完成提交和后续验收统一维护在
> [EXPERIENCE-ROADMAP.md](EXPERIENCE-ROADMAP.md)。本轮
> [UX-01 走查](UX-01-WALKTHROUGH.md)与[三端蓝图](UX-01-BLUEPRINT.md)仅为审查和方案，
> 没有功能修改。下文保留 T7-08 交接时的历史快照；其中“录屏未接入”等旧待办已被
> T7-10 / T7-11 完成，不能当成当前状态。报告读值进展见 T7-12。

> 写给下一个执行者（Codex 或任何人）。此前的工作在一个 AI 会话里完成，
> 会话结束后**只有落在 git 里的东西能留下**——本文件就是为此写的。
> 读的顺序：本文件 → `docs/review/PHASE-2-BACKLOG.md` → `docs/review/T7-BRIEF.md`
> → `docs/review/WINDOWS-CHECKLIST.md` → `docs/NOT_BUILDING.md`。

## 1. 当前状态（交接时的事实）

| 项 | 值 |
|:--|:--|
| 分支 | `t7-site`（**未推送**，`main` 也未推送） |
| 工作树 | 干净 |
| 最后一次提交 | `c1e0fc8 T7-07: the motion spec, measured frame by frame` |
| 构建 | `npm run build` 退出码 0 |
| 验收 | 两宽度 4 页面全绿（见 `~/qualicraft-review/site-t7/acceptance.txt`） |
| 动效 | 四项全 PASS（见 `~/qualicraft-review/motion/table-latest.txt`） |

T6+T7 的网站改版已完成并验收。**没有推送、没有部署**——这是任务单的要求，
不是疏忽。是否推送、是否部署，由总监决定。

## 2. 环境准备（新机器或新会话）

```bash
# Python：三个工具需要 numpy / Pillow / playwright（matplotlib/pandas 已在 requirements）
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
pip install pillow playwright
playwright install chrome        # 脚本用 channel="chrome"，需要本机 Chrome

# Node：网站
cd website && npm install
```

`requirements.txt` 目前只列 matplotlib / pandas / numpy；**Pillow 与 playwright
是后加的两个工具引入的新依赖**（本文件写入时已补进 requirements.txt）。

## 3. 怎么跑（每条都验证过）

```bash
# 网站（生产构建 + 服务）
cd website && npm run build
PORT=4425 HOST=127.0.0.1 node start.js &      # 端口随意，只要不和别的冲突

# 工作台（/w 代理的目标；不跑它 /w 会 502，其余页面照常）
python run_demo.py                            # 监听 8765，与网站默认代理一致

# 验收（截图 + overflow + 控制台 + 键盘 + manifest 哈希 + 禁用词）
python tools/site/acceptance.py --url http://127.0.0.1:4425 --out ~/qualicraft-review/site-t7

# 动效逐帧测量（CDP 录屏；四项对照表）
python tools/motion/measure.py --url http://127.0.0.1:4425

# 资产再生成（改了语料或绘图代码时）
python tools/report/build_assets.py           # /report 的图 + CSV + manifest.json
python tools/site/build_data_cards.py         # 数据卡片（读 qualicraft/datasets.py）
python tools/site/prepare_fonts.py            # 字体从上游重取（需联网）
```

## 4. 已经做完的（T6+T7）

| 工作流 | 提交 | 内容 |
|:--|:--|:--|
| T7-01 | `41d1d2c` | 设计系统（`website/app/t7.css`）+ 自托管子集化字体（Source Serif 4 / JetBrains Mono，各带 OFL） |
| T7-02 | `f88ce8d` | `tools/report/build_assets.py`：报告资产走工作台自己的导出路径 |
| T7-03 | `11ae432` `6e854a9` `6b1c421` | `website/lib/site/` 静态内容模块 + 首页六区块 + /about；前台不再引用内核；[slug] 路由删除 |
| T7-04 | `ebba578` | 五模块演示区（sticky + IntersectionObserver + 键盘 + reduced-motion + clip pending 占位框） |
| T7-05 | `10fc4b6` | `/report` 页；`verifyManifest()` 接线（哈希不符即拒出图） |
| T7-06 | `96a44e4` `535debc` | qt-seed:341 句子替换；删 admin（32 文件）/内核/旧组件/globals.css + pglite/pg 依赖；README 重写 |
| T7-07 | `7da89cf` `c1e0fc8` | `tools/motion/measure.py` 逐帧测量；修两处真 bug（标志动画丢失、指示器定位错） |
| T7-08 | `acb9e1d` | `tools/site/acceptance.py` 验收；键盘 hold 修复 |

网站现在只有 19 个源文件（`website/app`、`components`、`lib`），路由：
`/[locale]`、`/[locale]/about`、`/[locale]/report`、`/api/health`、`/w/[[...path]]`。

## 5. 没做完的（交接时的真实缺口）

1. **五段演示 WebM 未接入网站**。素材**已经录好并在仓库里**：
   `tools/e2e/recordings/`（`seg1-import` … `seg5-export`，各含 `.webm`
   131–284 KB、`.png` 首帧、`.trace.json`；同目录 `_deprecated/` 下两个标了
   "勿交付"的文件，不要用）。缺的是：确认它们过总监验收标准（无汉字、
   结果可见、无灰罩）→ 复制进 `website/public/clips/` → 在
   `components/site/ModuleWalkthrough.tsx` 的 `CLIPS` 常量里登记（一行一个）。
   注意仓库里**没有录制脚本**：那套流程没有随录制结果一起进来，若要重录需先
   补一个 `tools/e2e/` 下的录制器，否则只能沿用现有五段。
2. **反馈邮箱缺失**。`lib/site/content.ts` 的 `FOOTER.feedback` 故意留空，
   页脚该行不渲染。不得编造地址。
3. **下载按钮仍 disabled**（"Windows check in progress"）。Windows 门禁由人工执行，
   见 `docs/review/WINDOWS-CHECKLIST.md`。门禁通过后按钮需要一个**公开**的落地地址——
   仓库是 private，页面不得链私有仓库。
4. **`metadataBase` 未设**（`website/app/layout.tsx` 只在 `SITE_URL` 存在时设置）。
   没有真实域名，不编造。
5. **`/zh` 重写至英文版**（`website/middleware.ts`）：前台只渲染一份英文文案。
   工作台保留自己的语言开关。这是决定，不是遗漏。

## 6. 必须继续遵守的约束

来自任务单（`T7-BRIEF.md` 有全文）：

- 不推送、不部署、不改 `render.yaml` 的 `autoDeployTrigger`——除非总监明确要求。
- 不改工作台（`qualicraft/`、`web/`）的行为与图表渲染路径。
- 不新增分析功能（词频、AI 主题、全文导出、语义检索一律不做）。
- 不使用真实访谈文本；示例数据只用 Bologna 语料（CC0）。
- 不复制第三方代码/素材/图标/字体/文案。
- 页面文字不得出现 `publication`、`publication-grade`、`publication-ready`、
  `期刊`、`put in a paper`。改完网站文案后跑一次：
  `grep -rniE "publication-grade|publication-ready|publication-oriented|put in a paper|期刊" website/`
  （无输出即退出码 1）。
- 不得声称 Windows 已验证。
- 图注的单位句来自工作台的 `CREDIT` 常量（经 manifest 传递），**网站上不得另写一份**。
- 数据卡片清单来自 `qualicraft/datasets.py`（经 `tools/site/build_data_cards.py` 生成），
  **不得另写一份**。

## 7. 踩过的坑（省你时间）

- **构建后必须重启 `next start`**。`.next` 被替换而进程还持有旧清单时，`/about`
  会报 `Invariant: The client reference manifest for route "/[locale]/about" does not exist`——
  看着像产品 500，其实是陈旧产物。验收前一律重启。
- **`next build` 会留下 `.next-stale-<pid>/`**（被杀掉的构建重命名而来），已加进 `.gitignore`。
- Playwright 脚本用 `channel="chrome"`，headless Chrome **默认不是** reduced-motion；
  要测 reduced-motion 得显式 `reduced_motion="reduce"` 建 context。
- CDP screencast **只在页面有合成变化时出帧**：静态页面前后帧可能隔几百毫秒。
  测量静态页面的过渡时，帧序列会缺中间帧——`tools/motion/measure.py` 的注释写了怎么处理。
- `element.style.top` 返回**目标值**，不是动画中的值；要看 `getComputedStyle` 或 rect。
- 删 CSS 文件前先 grep 组件依赖的类名：QtMark 的动画规则原本在 `globals.css` 里，
  删旧设计系统时静默丢了动画，是动效测量抓出来的。
- 颜色相近时用色相判别：TOC 的 "Contents" 灰（`#6b7280`）在容差内会被当成 accent
  （`#4b607c`），加 `b - g > 15` 才分得开。

## 8. 材料都在哪（原先散落在仓库外，现已归档进仓库）

移交时把散在工作区根目录（仓库的上一级）里的文档与素材全部归档了，位置如下：

| 位置 | 内容 |
|:--|:--|
| `docs/review/` | 评审、方案、规范、排查：`QualiCraft_开发流程规范.md`（提交格式与证据纪律，**接手前应读**）、`QualiCraft-项目全景（供审核）.md`、`QualiCraft-第二轮审核材料.md`、`QualiCraft-网站结构方案.md`、`QualiCraft-界面与工具评审.md`、`QualiCraft_方法论支持评估与设计方案.md`、`QualiCraft_编码工作流差距分析.md`、`QualiCraft_设计理念与下一步方向.md`、`QualiCraft_GitHub权限排查结论.md`、`QualiCraft_推送指引与PR描述.md`、`QualiCraft_全流程操作走查.html` |
| `docs/review/deliveries/` | 交付报告与原始输出附录（T1–T6 各版本） |
| `docs/review/prompts/` | 给 Claude 的审核 Prompt（第一、二轮） |
| `docs/patches/` | 早期补丁 Patch1–4 |
| `docs/reference/` | `isc-home-01.png`（旧站首页参考）、`pi.dev/`（版式参考材料） |
| `docs/evidence/` | 评估证据、评审截图、走查截图（117 张，约 20 MB）、运行日志 |
| `tools/e2e/recordings/` | 五段演示录屏（见第 5 节第 1 条） |
| 仓库根 | `启动QualiCraft.sh`、`启动公开演示.sh`（macOS 一键启停，与 `run.ps1` 对应） |

**刻意没有搬进来的**（都有理由，不要随手加进来）：

- `../Guide/` — 第三方已发表访谈材料（Tian 2021、TU Delft）。它是外部研究素材，
  有许可问题，且任务单规定仓库里不使用真实访谈文本。需要时按 `run.py --guide-dir` 指过去。
- `../data/qualicraft.sqlite3` — 本地运行状态，`.gitignore` 按设计忽略 `*.sqlite3`。
- `../.tmp_ref/` — 早期临时图与对照脚本（4.2 MB），已被 `tools/report/build_assets.py` 取代。
- `../.workbuddy-ai/` — 上一个 AI 会话的本地记忆与运行时，与项目无关。

仓库外的验收证据（按任务单要求**不进仓库**）：

- `~/qualicraft-review/site-t7/` — 17 张截图 + `acceptance.txt`
- `~/qualicraft-review/motion/` — 录屏帧 + `measurements.json` + `table-latest.txt`

## 9. 不要带过去的东西

- 工作区的 `../.workbuddy-ai/`（AI 会话的本地记忆与运行时）。它与仓库无关，
  **不要**复制进仓库；仓库内确认无任何 WorkBuddy 路径引用（已 grep 核对）。
- 上面那份本地记忆里的事实表**不是证据**：它只是"先查表"的提醒，断言仍须来自
  运行或当次源码阅读。

## 10. 待总监决定（最多三条）

1. 下载按钮通过 Windows 门禁后的**公开落地地址**（无公开发布物）。
2. 站点**正式域名**（用于 `metadataBase` 与分享预览）。
3. **反馈邮箱**，以及是否接受"`/zh` 重写至英文版"这一前台单语言决定。
