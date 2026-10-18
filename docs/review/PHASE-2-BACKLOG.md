# Phase 2 backlog

2026-10-18 最新（UX-65）：**Mac 优先的网站能力同步完成；新的桌面完整流程 13/13、最终网站 23/23 通过。** 首页按原五模块纳入批量队列／重复选择、手动阅读与编码双轨、独立 Comparative QCA 六步交互，以及 Notebook／Research report／五图代码／JSON 恢复四类输出。QCA 使用工作台生成的方法图定义，不编造校准值或研究结果；Notebook 用真实 Bologna 引文和保存路径，未指定角色不冒称 Theme／Category。287 Python（3原有跳过）、实际执行225 Node、语法和最终 Next 生产构建通过；71工作台／数据／原资产／部署文件保持，66最终构建源逐字节一致。新 Mac 入口 http://127.0.0.1:52774/ → Bologna · Mac release review。**用户明确将手机实机补测和 Windows 暂缓；不记作通过。** 系统 VoiceOver／系统动效／实际下载反馈未代签，研究者和 supervisor 内容裁决仍独立保留。源码提交 `787065a388ee3ef82ebe5d76683d9e2e934dd704` 已保存；本轮实际推送再次被GitHub以缺 workflow 权限拒绝，远端t7-site尚未创建、main未动；当前线上首页200但无新展示标记，不能当作新版已上线。autoDeployTrigger 保持 off；部署需单独明确授权和可用管理访问。见 [本轮范围、测试与发布状态](UX-65-MAC-SITE-SYNC.md)。下方为历史记录。

2026-10-18 最新（UX-63，只验收）：**修复后的完整Bologna技术联合验收通过：26主流程＋18网站检查全部通过，UX60-01／02在同一端到端流程中关闭。** 桌面／手机均从新副本重走批量导入→编码→阅读标记／双轨→筛选／跳转／位置→关系图→五图→报告读值／M1→Notebook／Word／代码→JSON及已提交快照恢复；无中途继承、无诊断恢复。正常控制台／HTTP／外部请求0，未发现新功能缺陷；另2项新入口精确原句列表／跳转／Resume核对通过。六导出脚本精确复现，当前v11样例彼此一致，最终报告18＋Notebook11共29页Word已渲染逐页检查。141产品／数据／部署路径、110构建源及31旧样例不变，独立Next构建通过；287 Python（3跳过）／246 Node明确沿用UX62同源证据，本轮不重复。新入口 http://127.0.0.1:52770/ → Bologna · repaired final joint review。**已达到本轮软件技术门槛，可交supervisor；当前人工辅助功能／实机新路径、F07／F08研究者裁决和用户／supervisor接受仍未代签，不能称全部最终标准已完成。** 见 [完整流程、剩余项、命令及截图](UX-63-REPAIRED-FINAL-JOINT.md)。只用Bologna临时副本，不改功能，Windows暂缓且未验证，不推送、不部署。下方各轮为历史记录。

2026-10-18 最新（UX-62）：**UX60-02已修复并定向验收：手机打开Themes & Codes保留Keep，主题／组合筛选、清除和Resume准确返回，实际触摸／滚轮／键盘阅读仍推进位置。** 复用源文本身份校验的内存返回锚点，只改编码树入口聚焦与打开；不新增项目字段或改变筛选语义。7项新增Node修复前5失败、修复后全过，39相关阅读回归、246 Node、287 Python（3原有跳过）、12项定向Chrome和10项冻结JSON恢复复验、语法与独立Next构建通过；正常控制台／HTTP／外部错误0，4次主动篡改拒绝另列。140保护路径、110网站源及31既有样例保持，项目／审计／快照不因导航改变。新独立入口 http://127.0.0.1:52766/ → Bologna · codebook position review。UX60-01保持关闭；两项修复未替代整套联合重跑、当前人工／研究者／supervisor接受。见 [本轮范围、命令和截图](UX-62-CODEBOOK-READING-POSITION.md)。只用Bologna副本，Windows暂缓且未验证，不推送、不部署。下方各轮为历史记录。

2026-10-18 最新（UX-61）：**仅关闭P1 UX60-01：含冻结QCA／报告的项目JSON已通过桌面／手机正常界面恢复。** 上传保留原始JSON文本，服务器在原20MB／鉴权／只读边界内解析一次，再沿用原项目验证、新ID和快照流程；不改哈希规则、不重算输入哈希、不迁移旧记录。旧冻结版本、无M1历史报告、五图资产、阅读标记、导出和原恢复点均保持；损坏／篡改仍拒绝。新增8 Node／7 Python回归，旧版失败证据保留；287 Python（3原有跳过）、239 Node、10项桌面键盘／手机触摸模拟恢复检查、语法及独立Next构建通过，正常控制台／HTTP／外部请求错误0；四次主动篡改的400与对应日志另列。139保护路径／110网站构建源不变，只有恢复传输与路由改变。新独立入口 http://127.0.0.1:52763/ → Bologna · frozen JSON recovery review，旧项目／恢复点未重置。**UX60-02仍存在且本轮不修；整体验收及当前人工／研究者／supervisor接受未全部关闭。** 见 [修复、回归与截图](UX-61-EXACT-JSON-RESTORE.md)。只用Bologna临时副本，Windows暂缓且未验证，不推送、不部署。下方各轮为历史记录。

2026-10-18 最新（UX-60，只验收）：**最终联合验收尚未通过：新增P1 UX60-01（含冻结结果JSON界面恢复失败）及P2 UX60-02（手机打开编码树覆盖Keep位置）。** 桌面／手机各走完批量导入→编码→阅读双轨→关系图→五图→报告／方法图→Notebook／Word／代码→恢复；24主检查21通过、两视口恢复失败及手机位置失败，另18网站检查通过。界面两次HTTP400及相应控制台错误完整记录，其余正常错误0；原项目／项目列表／快照未改变，类型保真的诊断API恢复和已提交快照均可保全内容，不能替代UI恢复通过。六脚本复现、594行、29页Word、280 Python（3原有跳过）／231 Node／语法／独立Next构建通过；141产品／数据及110构建源保持。本轮未修功能，UX55-01…04原切片保持关闭，先修UX60-01，再修UX60-02；当前系统辅助功能／实机新路径、F07／F08研究者裁决及用户／supervisor接受仍开放。见 [问题、命令与截图](UX-60-FINAL-JOINT-ACCEPTANCE.md)。可携已知问题交supervisor讨论，不能称最终发布候选；原审核入口 http://127.0.0.1:52761/ → Bologna · method report review 保留。Windows暂缓且未验证，不推送、不部署。下方旧状态为各轮历史。

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

后续更新（UX-32B）：双轨概览、精确段落／原句列表、分页和跳转已技术验收，见 [32B](UX-32B-READING-OVERVIEW.md)。位置／手动标记／实际编码继续独立，预览不覆盖Resume，清筛选须明确选择；v5与32A保存／快照规则不变。本文件旧轮次状态按历史保留；实体设备／VoiceOver、其余W03与发布接受仍开放，Windows暂缓，不推送、不部署。

后续更新（UX-32A）：手动项目级 Unmarked／Read／Revisit、保存／撤销、JSON v5 与快照规则已实现并技术验收，见 [32A](UX-32A-READING-MARKS.md)。32B 两轨概览与范围列表仍待做，本文件原方案／旧状态按历史保留；浏览器位置仍独立，不因滚动自动已读。Windows 暂缓，不推送、不部署。

Maintained from the director's rulings. Each item is closed by a commit or by a
recorded decision, never by a note alone.

| # | Item | Owning task | Status |
|:--|:--|:--|:--|
| P2-1 | Co-occurrence empty state explains that the figure needs overlapping ranges | `ad1e5e9` | closed |
| P2-2 | "You can put in a paper" removed from the workbench and README | `e0ba618`, `653ab89` | closed |
| P2-3 | B2: one-click "all five modules" preset | `8ed4202` | closed |
| P2-4 | Codebook count as a hint to expand | `1209a90` + `0f368ba` | closed (wording changed to "show codes", assertion shown to discriminate) |
| P2-5 | Dialog measurement at 390px | `dc18803`: Import, Create and Export measured at 356px, no overflow; control forces 500px and is detected | closed |
| P2-8 | Snapshots has **no visible entry at 390px** | decided in `dc18803`, scope narrowed and aligned in `b305fd4`: desktop-only **for the restore entry only** — the `.save-state` button and the Snapshots dialog it opens; automatic snapshots (written server-side per change) still run on phones — recorded in docs/NOT_BUILDING.md §6 | closed |
| P2-9 | `projects` has two elements with the same `data-action` at 390px, one hidden | `e56d2ba` (`tools/e2e/projects_a11y.py`, `projects-a11y.json` @ `2026-10-12T14:05:48`): the hidden duplicate is `display:none`, not focusable, and **absent from Chromium's AX tree** at both widths; only the visible substitute is exposed. No defect. | closed |
| Correction (P2-9) | The report once claimed "no `aria-hidden` anywhere in the app" | retracted by `d3e2a54`: `grep -rn "aria-hidden" web/ qualicraft/` returns 3 uses, all decorative (`web/landing.html:18`, `web/app.js:64,681`); both projects buttons carry no `aria-hidden` (`aria_hidden: null` in the same JSON), so the hiding is entirely the stylesheet's `display:none`. The verdict above is unaffected — the correction concerns the sentence, not the measurement. | closed |
| P2-7 | `smoke_mouse.py`, real mouse selection | `66650b2` (`tools/e2e/smoke_mouse.py`): a page.mouse drag selects a passage, opens the coding popup, Enter creates a code, and the server stores both codings with the dragged quote (`smoke-mouse.json` @ `2026-10-12T14:18:48`) | closed |
| Close-out | A test that tools/e2e/preset.py exists and imports, so forgetting to run it is noticed | `6a5aebe` | closed |
| Constraint | Every `measure()` action in `tools/e2e/dialogs.py` must exist as `data-action="..."` in `web/app.js`, and its opener must click the same action — enforced by `tests/test_e2e_harness.py` | `129f907` | closed |

---

## T6 (website) — must not be dropped when the redesign starts

**Added 2026-10-11, at the director's instruction. Phase 2 does not touch
`website/`; this item travels with T6 so that it cannot be assumed complete.**

`website/lib/kernel/qt-seed.ts:341` still reads:

```
'Publication figures drawn by an exported Python script, so a co-author can
 re-run them. Needs matplotlib; scipy adds clustering.'
```

"Publication figures" is the same claim that was removed from the workbench
(P2-2), from `README.md`, and from `docs/DESIGN.md`. A journal's requirements
differ from one to the next, so the tool cannot assert that a figure is
publication-ready; what it can assert is that each figure states the unit it
counts.

**The live site does not currently carry this string** — searching the deployed
home page for "publication figures" returns false, while "states what it counts"
returns true. So it is either bound to a page that is not the home page, or was
already superseded in the deployed build. It is uncleaned in the source either
way.

**Action when T6 runs:** replace with wording of the same shape as the fix
already applied elsewhere, and re-run the repository-wide sweep for
`publication-grade|publication-ready|publication-oriented|put in a paper|期刊`
to confirm nothing else survives in `website/`.

---

## Windows 门禁（试用前置，不随 Phase 2 关闭）

清单：`docs/review/WINDOWS-CHECKLIST.md`（建立于 `46f12fc`，现行文本 `680e109`）。必跑四项脚本
（`tools/e2e/smoke.py`、`smoke_mouse.py`、`preset.py`、`dialogs.py`）加
`python -m unittest discover -s tests`，由人在 Windows 机器上执行，附原始输出与退出码回传。

| 项 | 状态 |
|:--|:--|
| Windows 验证（四项脚本 + unittest） | open — 未开始，登记后引用首次运行的日期与版本 |

macOS 参考值（2026-10-12，作对照不作承诺）：unittest `Ran 114 tests` / `OK (skipped=3)`；
smoke.py `10/10 steps passed`；smoke_mouse `7/7 passed`；preset `5/5 passed`；
dialogs 退出码 0、`measured 3 of 4`、`unreachable: ['Snapshots']`、`control reported overflow: True`。

unittest 的 skip 数随机器而变（已在清单步骤 0 核实并写明）：`tests/test_core.py:122,130` 两条
数据集测试只在 `E:/Software/Guide/...` 真实存在时才跑——作者本人的 Windows 机上会真的跑，
预期 `OK (skipped=1)`，FAIL 即 Windows 导入器的真实发现；其他机器 `OK (skipped=3)`。

**顺序**：Windows 结果通过 → 本行改 closed → 总监才决定推送授权与试用开放。

---

## T6+T7 · 网站改版（分支 t7-site，本地）

以 `lib/site/` 静态内容模块重建前台：`/`（六区块首页 + 五模块演示区）、`/report`（Bologna 示例报告）、`/about`；`/w` 工作台代理与 `/api/health` 不动。CMS 内核、admin（32 个文件，以 find 为准）、globals.css 与 PGlite/pg 依赖已全删。数据卡片由 `tools/site/build_data_cards.py` 从 `qualicraft/datasets.py` 生成（哈希不符即拒写）；`/report` 图表由 `tools/report/build_assets.py` 走工作台导出路径生成，页面每次渲染重新校验 manifest 哈希，不符即拒出图。

| 工作流 | 提交 | 内容 |
|:--|:--|:--|
| T7-01 | `41d1d2c` | 设计系统与自托管子集化字体（T7.css + OFL） |
| T7-02 | `f88ce8d` | build_assets.py：报告资产来自工作台导出路径 |
| T7-03 | `11ae432` `6e854a9` `6b1c421` | 静态内容模块 + 首页六区块 + about；前台不再引用内核 |
| T7-04 | `ebba578` | 五模块演示区（sticky + IntersectionObserver + 键盘 + reduced-motion） |
| T7-05 | `10fc4b6` | /report 页 + manifest 哈希校验接线 |
| T7-06 prep | `96a44e4` | qt-seed:341 "Publication figures" 句替换 |
| T7-06 | `535debc` | 删 admin/内核/旧组件/globals.css + db 依赖；README 重写 |
| T7-07 | `7da89cf` | 动效规格 + tools/motion/measure.py 逐帧测量；修两处真 bug |
| T7-08 | `acb9e1d` | tools/site/acceptance.py 验收；键盘 hold 修复 |

- 验收（原始输出在 `~/qualicraft-review/site-t7/acceptance.txt`）：1440 与 390 两宽下四个页面 overflow=+0、console=0、http=0、无禁用词；键盘走查导航/五步骤/报告目录/表格切换全部通过；manifest 哈希校验不拒出图。
- 动效（`~/qualicraft-review/motion/`）：三轮全 PASS——指示器 240ms±(+2/+8)、图淡入 220–238ms、像素标志 1383–1384ms（窗 1200–1500）、首屏地面 0.96–1.00 px/s（参考 0.92，线性 ±0.17px）。
- `grep -rniE "publication-grade|publication-ready|publication-oriented|put in a paper|期刊" website/` 退出码 1、无匹配。
- 未完成：① 五段演示 WebM 未录（占位框 "clip pending"，待 tools/e2e 录屏流程与总监验收：无汉字、结果可见、无灰罩）；② 反馈邮箱缺失（留空，qt-seed 占位符未用）；③ 下载按钮仍 disabled（Windows 门禁未过）；④ metadataBase 未设（无真实域名，未编造）；⑤ /zh 重写至英文版（前台只渲染一份英文文案）。
- 待总监裁决：下载按钮的落地地址（无公开发布物）、站点域名、反馈邮箱。
