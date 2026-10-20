2026-10-20 UX80：75D五图选择与空状态已实现／测试通过／上线QT。Figures入口常驻，五个可见选择＋明确生成；零编码、能力关闭、缺依赖、合法空结果与真实故障分开提示；一条标注可生成适用四图，两种共现按模式／Top N解释。284 Node、330 Python（3原有跳过）、语法／生产构建通过；Bologna本地五SVG／CSV及线上五SVG与修复前逐字节一致，下载、键盘、触摸模拟、故障重试和起步入口通过，正常控制台0。线上预览单次0.817–13.039秒（已请求过同参数，含缓存和网络）；层级图仍需等待，保留完整图与原尺寸查看。仅QT app.js／style.css同步，不重启、不推送。见[UX80](UX-80-FIVE-FIGURE-FLOW.md)。真实新手试用仍属75E；其余75D误导入管理／候选列表／窗口恢复、75B、75A上线及独立发布待办继续开放，Windows暂缓。

---

2026-10-20 UX79：75D正常手工编码保存已实现／测试通过／上线QT。单次已提交回执替代保存后全项目下载；完整基线过期安全回退，不重试写入，快照真实状态保留。线上同一Bologna副本三次赋码24.813／22.310／16.388秒→1.624／1.563／1.581秒（中位数减少92.9%，4请求→1 POST）；导出／刷新精确范围与标注ID一致、恢复点正常，0脚本错误。272 Node通过，330 Python（3原有跳过）、语法与生产构建通过；完整冻结JSON导出再恢复通过。仅server.py／app.js同步并保留回滚。见[UX79](UX-79-CODING-SAVE-RECEIPTS.md)。过期基线／阅读标记后校准等回退路径仍可能较慢；其余75D、75B、75A上线、75E、系统开机注册／Pages独立待办，Windows暂缓。下方十余秒正常保存记录为修复前历史。

---

UX78实际原句赋码19.409秒，刷新精确范围／标注ID保持；服务器内读取0.0091–0.1163秒。

UX78耗时补记：同一副本三次保存中位数48.401→17.758秒，打开40.171→19.132秒；独立冻结项目保存5.34–5.98秒。网络波动仍明显，不承诺秒存，持续延迟观察不关闭；完整冻结JSON两次恢复已通过。

2026-10-20 UX78：75D完整冻结JSON恢复与保存传输优化已实现／测试通过／已上线QT。原文gzip传输＋原校验／20MB解压上限、项目响应私有压缩、省去创建后重复下载、保存后并行读取；不改统计、绘图、格式或快照规则。263 Node、325 Python（3原有跳过）、语法／生产构建通过。线上Bologna两次完整恢复9.93／10.11秒，三次保存5.34–5.98秒；全部文档、编码、2版QCA／3版报告及导出再恢复一致，0脚本错误。仅三文件同步并重载QT网关，保留回滚。见[UX78证据](UX-78-RESTORE-TRANSFER-LATENCY.md)。其余75D、75B、75A上线、75E仍开放；Windows暂缓。下方超时记录为修复前历史，不能推广为所有网络均已秒开。

---

UX77补充：线上完整冻结项目恢复请求180秒超时，未通过此项；本地恢复通过。75D需优先复现大项目响应与保存延迟；本轮单树主流程通过不代表完整发布验收。

2026-10-20 UX77：75C Coding单层已实现、测试通过并上线QT；正文＋唯一右树，定位与筛选分离，继续编码／在此继续，窄屏复用一份树。259 Node通过；Python322项、3原有跳过；JS及生产构建通过。独立Bologna线上主流程7组、0脚本错误；打开Coding3.08s，编码保存含刷新6.49–7.50s，延迟仍待优化。仅同步app.js／style.css，未重启服务；统计、绘图、数据、导出不变。详见[UX77验收](UX-77-SINGLE-LAYER-CODING.md)。75D其余→75B→75A上线→75E继续开放，Windows暂缓；系统自启与Pages仍独立待办。

---

2026-10-20 UX76: Official-source competitor comparison, task protocol and delivery gates recorded in [UX76](UX-76-COMPARISON-AND-DELIVERY.md). Neutral Name labels locally verified;247 Node and10 QCA checks pass. One report-method check blocked by missing matplotlib. No deployment.

---

2026-10-20 UX75A：新手简化计划已登记；网站删重／Sources独立页／Help／TA→QCA→CA及Export整合本地完成，247 Node／生产构建／37资产／桌面窄屏键盘与控制台通过。尚未部署；英文翻译教学副本、Coding一层及同学问题复现仍待做。见 [逐轮计划与验收](UX-75-SIMPLIFICATION-PLAN.md)。

---

2026-10-19 UX74：压缩Coding项目／账号／阅读工具栏；1440×1000同展开状态正文提前129px，247 Node／键盘／窄屏检查通过。仅QT界面，数据统计绘图不变。见 [UX74](UX-74-COMPACT-CODING.md)。

---

2026-10-19 UX73：网站标语与彩色QT统一；线上每次登录先选上传／Bologna／已有项目，本地继续上次行为保留。247 Node及静态构建／37原资产通过。见 [UX73](UX-73-BRAND-START.md)。开机自启管理员阻塞仍保留。

---

2026-10-19 UX72：QT 专用系统启动注册已获用户授权，但服务器明确拒绝：`xiaolu is not in the sudoers file.`。单元复核为 not-found／inactive；开机自启未完成，需服务器管理员仅注册已备 QT 单元。现有进程保持，不改其他服务、不重启主机。详见 [UX72](UX-72-STABLE-ENTRY.md)。

---

2026-10-18 UX72 上线补记：固定网站 https://qt-review.taila524d0.ts.net/ 与完整邀请工作台 https://qt-review.taila524d0.ts.net/login 已通过外网Bologna全流程。无需 LuX-x7 或安装客户端；网站／报告公开，上传／编码／保存／导出需私有账号。321 Python（3原有跳过）、267 Node、Chrome交互／键盘／报告／Word／登录／编码／退出、12项完整导出和五图CSV一致性通过；远端分别停止QT网页与隧道后自动恢复，域名、冻结报告与保存编码保持。公开文本gzip与哈希资源缓存已接通，原37资源不变。**系统开机自启尚未注册：仅QT目录无法登记启动，已备专用服务并等待用户是否允许仅QT启动注册的最小例外。没有修改QT外文件或其他项目，没有重启共享主机。** 旧QT临时隧道退役，Render不变且自动部署关闭，GitHub Pages不再是审核入口前置。见 [UX72](UX-72-STABLE-ENTRY.md)。

---

2026-10-18 UX72 进度：固定入口和开机自启尚未完成，导师入口仍不能登记为长期稳定。已本地准备单一 HTTPS 来源的网站／工作台和 QT 内进程恢复；319 Python（3原有跳过）、267 Node、Chrome原交互／键盘／报告／下载／零错误通过。等待用户重新接通SSH和免费账户设备授权；开机触发须平台既有入口，否则要另获最小注册权限，当前没有越界操作。见 [UX72](UX-72-STABLE-ENTRY.md)。

---

2026-10-18 UX71 发布补记：源码已正常推 main：`e70f7290aaf9d85ecbe4b765564732617efc5276`；静态站已正常推 gh-pages：`8d93e01827211012c324ffde3aee479fb4ff1f2f`，没有强推或改仓库权限。308 Python（3原有跳过）、267 Node、静态生产构建／37资源哈希／Chrome网站及报告通过；服务器32文件与源码一致。新邀请账户在线Bologna上传→编码→保存→4个快照→JSON导出通过；Notebook／Word／报告及五类图完整导出通过。**GitHub Pages仍未开启，预期地址不可当作已上线；工作台为受登录保护的临时HTTPS入口，固定域名与重启自启待落实。** 私人邀请码不在Git或公开审核包。见 [UX71记录](UX-71-OWN-SERVER-PAGES.md)。

---

2026-10-18 最新（UX71，迁移进行中）：用户明确要求 GitHub Pages 网站 + 自有服务器完整在线工作台，取代新部署的“只读公开版”限制。已在指定 `QT/` 内建立独立环境、邀请账户与隔离持久存储，完整复用原分析／绘图／导出；HTTPS Bologna 编码、重启恢复和12项在线导出检查通过，五类 CSV 与本地一致。GitHub Pages 静态构建保持37份原资源。**Pages 尚未开启（需 LuX-x7 管理权限，用户目前无法联系）；当前工作台 HTTPS 是临时隧道，不是固定正式域名，服务器重启自启也未配置。** 原 Render 保留，自动部署不变。见 [UX71部署与边界](UX-71-OWN-SERVER-PAGES.md)。Windows／手机后续暂缓。下方为历史。

---

2026-10-18 最新（UX70）：网站加载与工作台冷启动入口修复已完成本地验证。首页／报告／About 改为构建时生成；工作台暂时不可用时显示有限等待／自动进入，持续故障保留明确重试。16项新回归、263 Node、298 Python（3原有跳过）、9项Chrome、生产构建通过；53保护文件与11份下载原样。免费实例唤醒时间仍存在，不能承诺闲置后秒开。源码 `074e50aea7388d9f457f0b73b7c4b01e69f5a41e` 已正常推main，网站手动部署并Live；线上首页／报告约0.59s、工作台HTML约0.75s（热测），只读403与11份下载哈希、Chrome入口和零控制台错误已核对。后端不重启，免费规格及Auto-Deploy Off保持。见 [UX70记录](UX-70-AVAILABILITY.md)。Windows／手机补测仍暂缓。下方各轮为历史。

---

2026-10-18 最新（UX69）：**公开起步页、SVG 预览提速及完整 worked example 已上线。** Try the workbench 先说明只读 Bologna，再由用户进入；本地上传／新建／继续保持。预览使用同一脚本只保存 SVG，并有输入绑定、有容量上限的临时缓存，完整下载仍为 SVG／PDF／300 dpi PNG／CSV／Python。五类预览及完整输出与同环境旧基线一致；线上完整层级图两次预览 25.97s／0.70s（原线上约88.8s）；免费冷启动及完整下载仍需时间。首页及导航新增 [worked example](https://qualicraft-website.onrender.com/report#sec-outputs)，含一份完整编码 Notebook／可编辑 Word、含方法图与3条证据的 Content 示例报告／Word、五图代码包及可恢复全部19文档的 JSON。该写作为展示样例，不冒称新的实证研究或 QCA 校准结论。298 Python（3 原有跳过，两种 Linux 收集通过）、247 Node、语法／构建、32页 Word、11份线上下载／哈希与隔离恢复通过；原18保护文件保持。源提交 `2865b1d7fe4d12c5f09628e94c57a2ffc832af93` 已正常推 main，两现有免费服务手动部署并 Live；Auto-Deploy 保持 Off。Chrome 原生文件选择因扩展权限未通过，不扩大权限；本地完整粘贴导入／继续已通过，文件解析／队列由回归覆盖。手机补测、Windows 暂缓，原生辅助功能与研究者／supervisor接受不代签。见 [UX69记录](UX-69-START-PREVIEW-OUTPUTS.md)。下方历轮为历史。

---

# Supervisor review · QualiCraft

2026-10-18 最新（UX68）：**UX67-01 已在现有免费 512MB 实例关闭，未升级付费规格。** 完整层级图先用输出 DPI 的微型 Agg 计算边界，再一次分配最终 PNG；保留全部 259 行、8 主题、300 dpi、尺寸与图形。Mac 独立进程峰值约501→304 MiB（12 pt约350 MiB），同字体修复前后 CSV／SVG／PDF／PNG 逐字节一致；线上默认完整图包连续两次 HTTP200（94.6s / 89.3s），CSV／SVG／PDF 与旧基线一致，PNG 全部像素及尺寸／DPI 一致，项目不变、服务继续健康。首页改为 “Many tools. This one is yours.”，**Pause／Play 原样保留且键盘切换通过**。289 Python（3原有跳过，两种 Linux 收集均通过）、246 Node、语法与构建通过；原10份报告资产／manifest、统计／数据／Coding 行为保持。源码已推 main，两现有服务在 `545560aa07caf0639e23de6a98d73fa7530c2566` 手动部署并 Live；CI测量隔离补记 `7839a4a2304f81471de0614c2e819e7299e0923b` 不改应用，Auto-Deploy 仍 Off。可交 supervisor 做技术／视觉／研究内容审核；公开工作台只读，上传／编码保存用本地版。免费冷启动和大图导出需等待；手机补测／Windows 继续暂缓，当前原生辅助功能和研究者／supervisor 接受不代签。见 [修复、线上证据及发布记录](UX-68-HIERARCHY-MEMORY.md)。下方 UX67 的开放问题及历轮未发布表述是历史记录。

---

2026-10-18 最新（UX67，发布）：**已按用户明确指示直接快进 main，并手动更新现有网站与只读 Bologna 工作台。** GitHub 插件以 HaijunChe 的现有协作者权限保留全部提交历史，未强推或更改仓库可见性。两服务均在应用提交 `98717a66225c18fed65c06fc2f37a13d2bf0dbe0` 显示 Live；之后的 `51f5c67ab657fbbe6a6e301470c78883b2f2f75c` 只补齐 CI job 的网站依赖安装，287 Python（3 原有跳过，两种收集命令均通过）、246 Node、语法和网站构建通过。首页新 QCA／四类输出、报告读值、只读防写及原 SVG／CSV 已在线核查。**新增 UX67-01：公开工作台完整层级图包导出触发免费实例 512MB 内存上限并返回502；服务自动恢复，不能登记线上五图导出全过。** 本地绘图及网站既有静态图保持；未改功能／统计／绘图、付费规格或自动部署。入口：[网站](https://qualicraft-website.onrender.com/) → [报告](https://qualicraft-website.onrender.com/report) → [只读工作台](https://qualicraft-website.onrender.com/w?lang=en)。手机实机补测／Windows 暂缓；系统辅助功能及研究者／supervisor 接受不代签。完整证据、哈希和剩余项见 [UX67 发布记录](UX-67-PUBLIC-RELEASE.md)。下方“未推送／未部署／鉴权阻塞”等为各轮历史状态，已被本条发布事实替代。

---

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

2026-10-17 推送结果补记（UX-45R）：本轮功能提交为 `3710a05df86e44940aa3216f1469e747291924d3`，本地干净。**实际 GitHub 推送未成功**：现有 HTTPS PAT 缺 `workflow` 权限，GitHub 拒绝待推送历史中 UX-09 的测试工作流更新；严格核验 GitHub 官方主机密钥后，SSH 也返回 `Permission denied (publickey)`。远端未创建 `t7-site`，main 未改；没有删除工作流或改写审核历史绕过权限。用户随后明确选择“暂时保留本地提交”；停止远端重试，后续收到新指示再处理授权和推送。截图、产物、完整提交和拒绝原始输出已收进本地审核包；不冒称已上线／已发布。没有产品代码新改动，无需因本次记录重复功能测试。Windows 仍暂缓，不部署。

2026-10-17 最新（UX-45）：**QT 起步卫星背景、简洁编码原文树和网站／工作台能力状态已同步，完成本轮技术验收；这仍是审核版，不是全部最终标准完成。** HTML 去表格边框，以正文＋树线／角色节点阅读，Word 为无边框可编辑文字布局，技术信息收进详情／附录。可明确选择 Theme→Category→Code 展示标签；默认仍是 Group／Code，展示预设不等于已保存研究角色。网站新增两种现有导出说明，Comparative QCA 和 Analysis Table／Narrative Analysis 编辑器明确标为待实现。174 Python（3 跳过）、181 Node、38 Chrome 场景及隔离 Next 构建通过；33 个统计／绘图／数据／资产／部署保护文件不变。用户本轮已明确授权推送现有 GitHub 仓库，范围为现有 t7-site 审核分支，保持 main、可见性与自动部署关闭；不进行部署。完整证据与剩余标准见 [UX-45](UX-45-REVIEW-FINISH.md)。Windows 暂缓且未验证；下方各轮“未推送”等表述只代表当时历史状态。

2026-10-17最新（UX-44）：**UX42编码原文对照导出已实现自包含HTML＋可编辑DOCX，并完成Bologna技术验收。** 单份／所选多份／全部范围明确，全文、高亮与实际Group／Code祖先树、同句多码／重叠／跨段及完整ID对应保留；不自动推断Theme／Category研究语义。HTML悬浮／触摸／键盘双向定位，禁脚本仍可读；备忘录默认排除，版本指纹与旧文件过期提示已接通。155 Node、172 Python（3跳过）、14生产代理浏览器场景、语法与隔离Next构建通过；正常控制台／HTTP／外部请求0，Word全文样例14页及编辑样例3页检查。见 [实现与证据](UX-44-CODED-TRANSCRIPT-EXPORT.md)。只用Bologna临时副本；原数据、v5格式、四旧导出、统计／绘图和网站／报告资产不改。独立PDF、语义角色设置、报告编辑、三方法／容量、实体设备／supervisor与发布门禁继续开放；Windows暂缓且未验证，不推送、不部署。下方旧轮次按历史保留。

Latest UX-43: [UX40-01 is fixed in the scoped Bologna regression](UX-43-CODE-POPUP-EXACT-MATCH.md). Complete leaf names precede partial parent matches;ambiguous names require an explicit path/arrow/touch choice. The original source,statistics,plots and website assets remain unchanged. 16 dedicated regressions,148 Node,163 Python (3 skipped),14 workbench browser scenarios and isolated production build pass. Coded-transcript export is the next planned implementation;report/method/capacity/owner/supervisor/release gates remain open. Earlier paragraphs retain their historical scope.

17 October2026, UX-42 addendum: the final output must include a complete coded transcript, with precise highlighted passages and their adjacent saved Code/Category/Theme tree. This supports narrative writing. [Specification and acceptance criteria](UX-42-CODED-TRANSCRIPT-EXPORT.md) are recorded; the feature is not implemented. Temporary filters must not truncate the export, and multi-code/overlapping/cross-page relationships must remain traceable. Only review documents changed; no new private input was read.

Current update,17 October2026: [UX-41](UX-41-TEMPLATE-SECOND-CASE.md) records the template review,frozen first-case comparison and post-reference second-case technical validation. The actual assignment is Content Analysis;the owner still requires TA,Content and a separately implemented Comparative path. Editable reports are external deliverables,not yet a product feature. UX40-01,method-specific flows,capacity and owner/supervisor/release gates remain open. The shareable package contains anonymous summaries only;private text,reports and screenshots are excluded. Earlier sections retain their historical scope.

**Latest — UX-40, 17 October2026:** an explicitly authorised real transcript was deidentified and tested in an isolated project. **14 workflow checks pass with explicit code selection; one leaf-name/Enter variant fails.** Open P2 UX40-01:when a parent name contains the leaf name,Enter can save the first parent candidate rather than the intended leaf. The exact range was preserved;explicit row selection/full path is a workaround. Five figures/32 CSV rows/25 bundle members,five standalone scripts,four exports and v5 recovery work. No product/statistics/plotting changes;full tests/build are not rerun. Real interview text,raw exports and transcript screenshots remain private and are excluded from Git/public review materials. Only anonymous counts and a code-picker-only image are shared. Existing owner-reported Bologna phone reading acceptance remains scoped;new-phone physical/VoiceOver/system-motion/download and overall/release acceptance are not implied. Windows deferred/unverified;no push/deployment. [Current result and issue](UX-40-INDEPENDENT-ACCEPTANCE.md). Earlier results below are historical.

**Latest — UX-39, 17 October 2026:** the owner reports that physical-phone Read, Revisit, Undo, Keep and Resume pass, including retention after switching documents and refreshing. This closes the reported phone reading/position slice on the tested device; model, OS and browser details have not been supplied and are requested. It does not sign off other phone workflows, VoiceOver, system reduced motion, OS download feedback, overall visual/workflow acceptance or release gates. Only documentation changes; no new automated tests or build. Windows deferred/unverified; no push/deployment. [Direct report and scope](UX-39-MOBILE-MANUAL-ACCEPTANCE.md). Earlier evidence below is historical.

**Latest — UX-38, 17 October 2026:** post-W03 joint acceptance passes **54/54 Chrome checks** on a new editable Bologna copy. Actual import, mouse coding, Read/Revisit and Undo, dual tracks, filtering/source navigation/Resume/Keep, network roundtrip, five plot bundles, all 594 report rows and four exports/v5 recovery pass. Both former phone-anchor failures remain fixed. W03's complete frame, readable phone selection and engineering diagrams pass; original drawings, tables, downloads, recordings and stills remain. No new functional defect was found in exercised paths. All product/assets/source/main-preview hashes stay unchanged; this round edits review documents only. Full unit tests and build are historical, not rerun: UX-37 Node153/direct Next build, UX-35 Python163 (3 skipped). Owner/supervisor visual acceptance, current physical-device/accessibility and formal release gates remain open. Windows deferred/unverified; no push/deployment. [Current findings and evidence](UX-38-JOINT-ACCEPTANCE.md). Earlier entries below are historical.

2026-10-17 最新（UX-37）：**W03本轮授权的视觉收尾已实现并技术验收，用户视觉接受仍待确认。** 固定演示窗去掉重复大标题，网络完整适配普通／矮桌面；主题／节点筛选按需展开，手机节点全名以18px独立显示并随触摸／键盘更新。Import补文件→真实文本记录→准确坐标，Export补项目结构→四格式分支；原线稿、路径图、圆点网络、五图／全表／下载及五录屏／静态替代全部保留。33浏览器（7新＋10网站＋7热图＋9录屏）、153 Node、语法与直接Next生产构建通过；npm缺失127保留。仅Bologna，工作台／统计／数据／10报告资产与10媒体文件不变，22预览更新。见 [本轮范围与截图](UX-37-W03-VISUAL.md)。**W03实现项本轮关闭，整体视觉／supervisor接受、当前实体设备与发布门禁不代签；Windows暂缓且未验证，不推送、不部署。** 下方旧轮次为历史。

2026-10-17 最新（UX-36，只验收）：**UX-34／35修复后的联合流程47/47通过；UX33-01／02在本次真实导入和标记副本中均复验通过。** 网站→导入→编码→Read／Revisit与双轨→筛选／跳转／记忆→关系图→五图→报告读值→四导出／v5恢复走通；594报告行、301热图映射、25图包成员、22登记前台与原数据／产品哈希核对。没有修改功能、统计、绘图、资产或测试代码；不重复全量单测／构建，UX-35的153 Node、163 Python（3跳过）及直接Next构建为同产品历史证据。见 [联合验收与剩余事项](UX-36-JOINT-ACCEPTANCE.md)。**可交supervisor审核；W03视觉收尾、用户接受、当前实体设备／VoiceOver与正式发布门禁仍开放，不能称全部完成。** Windows暂缓且未验证，不推送、不部署。下方旧轮次保留历史含义。

2026-10-17 最新（UX-35）：**UX33-01 已修复并本地验收，UX33-02保持关闭。** 手机聚焦上方搜索框不再覆盖搜索前阅读位置；匹配／无匹配、清空输入／Clear filters、Resume均回到原段落。真实触摸／键盘／滚轮阅读仍可推进下一次搜索锚点，显式Keep仍可替换；项目／文档／源文本身份隔离，临时搜索返回只存内存。9项新增Node回归与13项搜索Chrome回归先失败、后通过；153 Node、163 Python（3跳过）、语法与直接Next生产构建通过，npm缺失127保留。13搜索＋12 Keep＋11概览＋2只读／存储共38项通过；21登记前台200并提供当前JS/CSS。仅Bologna临时副本；原模板19/317/874、普通4445数据库、统计／绘图／CSV／10报告资产均不变。见 [修复、证据与边界](UX-35-SEARCH-POSITION.md)。**本轮只关闭01；W03、用户／supervisor接受、当前实体设备／VoiceOver及发布门禁仍开放。** Windows暂缓且未验证，不推送、不部署；下方旧轮次按历史保留。

2026-10-17 最新（UX-34）：**UX33-02 已修复并本地验收，UX33-01 按用户要求保持开放。** 手机触摸Keep使用当前项目／文档的来源跳转锚点；仅在原文进入正文阅读线时推进，控件滚入视口不再把首段当作新目标。真正触摸滚动阅读后仍能保存新位置；保存使用选定锚点，避免恢复布局再次覆盖。5项新增Node回归修复前3失败、修复后全过；144 Node、163 Python（3跳过）、语法／直接Next生产构建通过，npm缺失127保留。12项专用检查（含1项UX33-01仍存在的范围观察）＋11项原概览＋2项只读／禁用存储均通过；20登记前台健康并逐字节提供当前JS/CSS。只用Bologna临时副本，原19/317/874／审计与常用4445数据库、统计／绘图／CSV／10个报告资产不变；其余168个顶层JS函数及全局事件代码不变。见 [修复、证据与边界](UX-34-KEEP-POSITION.md)。**本轮只关闭02；01、其余W03、用户／supervisor接受、当前实体设备／VoiceOver与发布门禁仍开放。** Windows暂缓且未验证，不推送、不部署；下方旧轮次按历史保留。

2026-10-16 最新（UX-33，只验收）：网站→工作台导入→编码→阅读标记／双轨→关系图→五图→报告读值→导出已走查。**46项浏览器检查44通过、2失败，不能登记为联合验收全通过。** 新增 **UX33-02 / P2**：390px触摸从概览跳到¶4后，点击 Keep 时控件滚入视口，保存锚点可能变为¶1；对应键盘／桌面对照通过。**UX33-01 / P3**：手机键盘聚焦上方搜索，原¶4锚点在输入前已被视口移动覆盖为¶1。两项只影响浏览器位置，原文／编码／项目手动标记不丢失。本轮163 Python（3跳过）、139 Node、语法通过；594报告表行、25图包成员、四导出与v5恢复核对，正常控制台／HTTP错误为0。仅Bologna临时工作副本20/317/876，原19/317/874种子与常用4445数据库不变；214个核心路径文件和10个manifest资产不变。**T03已实现，手机位置记忆的联合接受重开；先修02，再复核01，之后处理W03视觉／用户与实体设备／发布门禁。** 见 [本轮问题、截图与命令](UX-33-JOINT-ACCEPTANCE.md)。本轮不改功能、不重建产品，构建沿用32B历史通过证据；Windows暂缓且未验证，不推送、不部署。下方旧轮次为历史。

2026-10-16 最新：**UX-32B 已实现阅读标记／已有编码范围双轨概览、精确段落／原句范围列表与跳转。** Overview 默认折叠、展开随正文滚走，两轨均按全文原始 Unicode 字符坐标绘制；同范围多码保留实际 annotation／code ID，连续笔迹只作视觉并集。全文轨道不随搜索或编码筛选缩短，缺失原文必须明确选择 Show full document & jump；预览／跳转不改 Read，也不覆盖原 Resume，Keep this reading position 才更新本浏览器位置。网络原句定位／返回保持优先；手机默认固定栏134px，支持触摸、键盘分页和精确跳转。10项新Node回归（最初6项先失败）、139 Node／163 Python（3跳过）、11概览＋10原标记＋2只读／存储禁用浏览器场景、语法／直接Next构建通过；npm缺失127保留。原Bologna19/317/874、项目v5存储、后端、统计／绘图、两CSV、五图与报告／网站资产不改。见 [32B实装与证据](UX-32B-READING-OVERVIEW.md)。**T03本轮计划内技术功能已验收；其余W03、用户／supervisor视觉接受、当前新控件实体设备／VoiceOver及发布门禁仍开放。** Windows暂缓且未验证，不推送、不部署；下方旧轮次为历史。

2026-10-16 最新：**UX-32A 已实现 Coding 手动三态标记、即时保存与撤销，项目 JSON 升为 v5。** Unmarked／Read／Revisit 与位置、编码独立；成功应答后显示新状态，失败可重试，409 先读回最新值再由用户重选；JSON 导出／恢复保留项目标记。旧 v4 GET 仅内存升级，首写前检查原持久化 v4 恢复点；阅读单独写入不轮转普通快照，下一次研究编辑收录，当前状态可立即导出 JSON。8 项 Python 专用／7 项 Node 专用回归、163 Python（3 跳过）、129 Node、10 项 Chrome 主验收、17 个预览健康与正常／只读桌面手机检查、语法／直接 Next 构建通过；npm 缺失127原始输出保留。Bologna 19/317/874、八分析、两 CSV、五图数据／脚本／结果、报告资产与录屏保持。见 [32A 实装与证据](UX-32A-READING-MARKS.md)。**32B 两轨范围概览／列表未实施；T03 仅本轮存储与标记切片关闭，其余 W03、用户／实体设备及发布门禁仍开放。** Windows 暂缓且未验证；不推送、不部署。下方旧轮次按历史保留。

**Latest review — UX-31 (design only):** the read-mark/range overview proposal is ready; running product remains UX-30, project schema4. It separates browser position, explicit Unmarked/Read/Revisit project marks, and ranges derived from saved annotation IDs. Recommended future format5 carries marks in JSON; read-only GETs stay non-mutating, stale sources/conflicts/errors are explicit, and reading-only saves do not rotate ordinary research snapshots. CSVs/figures keep existing meanings. Compact/expanded desktop/phone sketches and18 pending acceptance gates are included. [Proposal](UX-31-READING-STATE-DESIGN.md) · [Static interface](UX-31-READING-MOCKUP.html). Read-only Bologna checks confirm31 anchors/53 codings/52 source ranges, no normal console/HTTP errors or mutations;251 non-document files and ten manifest assets match baseline. No new functional tests/build: UX-30 results remain prior evidence. T03 implementation, remaining W03, owner/device and release gates stay open. Windows deferred/unverified; no push/deployment. No reading-mark feature is claimed implemented.

**Latest — UX-30:** UX17-05 is closed. Startup now probes the real mounted `/w/api/bootstrap`, validates its shape, and retries at most three times (5 seconds/request, 1 second between tries) without blocking Next. Temporary unavailability logs waiting, recovery logs ready, and persistent refusal/HTTP/timeout/invalid responses remain explicit failures. Redirects are not followed; tokens/project metadata are not logged. Fourteen regressions fail before and pass after; nine real Next startup cases, 155 Python (3 skipped), 122 Node, syntax and direct production build pass. npm is unavailable (127), retained. All 128 protected files, ten manifest assets and pristine Bologna copies match baseline. All 16 registered fronts report ready on their first probe; common 4445 desktop/phone simulation has clean normal console/HTTP. [Current evidence](UX-30-STARTUP-HEALTH.md). UX17-01–05 are closed, but read marks/range overview, remaining W03, owner/device and release gates remain open. Windows deferred/unverified; no push/deployment. Earlier candidate notes are historical.

**Latest — UX-29:** all five embedded recordings now show the current QT interface and real Bologna results, with authentic first-frame stills and dated captions. The Analysis clip shows the expanded relationship map and selected source; Export shows the actual QT panel after a byte-verified JSON download. All 180 encoded frames match their real timestamped captures, pass Han/prohibited-copy OCR, and retain clear results without a modal backdrop. Nine dedicated browser checks plus ten original website regressions pass; 155 Python (3 skipped), 108 Node, syntax and the direct Next production build pass. npm was unavailable (127), retained in raw evidence. Workbench/statistics/rendering and report data are unchanged; 111 protected files and all ten manifest hashes match baseline. The usual 4445 preview serves the new assets. **UX17-04 is closed; UX17-05, read marks/range overview, remaining W03, owner/device and release gates remain open.** [Current scope/evidence](UX-29-CURRENT-QT-RECORDINGS.md). Phone checks are simulated. Windows deferred and unverified; no push/deployment. Earlier candidates below are historical.

**Latest — UX-28:** visual-unity joint acceptance passes all 8 ordered stages and 37 browser checks. An explicitly created Bologna copy is imported, mouse-coded twice, traced through the relationship map, drawn in five figure types, compared with all 594 fixed-report rows/15 sampled selections, and exported in four byte-verified formats. Phone checks cover all 20 documents, five original-size viewers, touch/keyboard and static report fallback. All 123 protected product/data files and ten manifest assets remain unchanged; the original seed/audit stays intact. No new P1/P2 blocker was found in the exercised paths. UX17-04 old recordings and UX17-05 startup health-probe mismatch remain P3; read marks/range overview, remaining W03, owner/device acceptance and release gates are open. [Current scope/evidence](UX-28-JOINT-ACCEPTANCE.md). Documentation-only; full unit/build results belong to UX-27 and were not rerun. Windows deferred; no push/deployment.

**Latest — UX-27:** the workbench now adopts the existing site’s pixel QT, warm paper, ink primary buttons, fine borders and mono navigation. Q/QualiCraft and QC decorations are removed; the current view has an explicit accessible name/current marker, and phone navigation targets remain at least 44×44. The transcript stays plain white with exact source text and 14.84:1 body contrast. 155 Python (3 skipped), 108 Node, 7 visual + 12 startup + 10 reading + 11 Coding checks, syntax and production build pass. Original Bologna/audit/snapshots, eight analyses, 61 protected hashes, ten manifest assets and 31 key JS functions match baseline. The legacy ISC favicon is also replaced with QT; the standalone workbench embeds that same SVG. The usual 4445 preview serves current assets. T04’s authorised visual scope is technically complete; owner/device acceptance, explicit read/range overview, remaining W03, UX17-04/05 and release gates remain open. [Scope and evidence](UX-27-VISUAL-UNITY.md). Windows deferred; no push/deployment. Earlier candidates are historical.

**Latest — UX-26:** local startup now offers an empty project/import, explicit Bologna copy or existing-project choice. It remembers the explicitly opened project and resumes its document/paragraph; an empty server no longer creates fictional material. The optional three-step guide follows actual import/coding, supports Skip/close/Done, Help and keyboard focus return, and offers truthful read-only actions. 155 Python (3 skipped), 108 Node, 12 startup + 10 reading + 11 Coding checks, syntax and production build pass. Original Bologna/audit/snapshots and eight analyses remain unchanged; statistics, plotting, default blocks, CSV and site assets are untouched. T01/T05 are technically implemented. Explicit read/range overview, T04/remaining W03, UX17-04/05, owner/device acceptance and release gates remain open. [Scope and evidence](UX-26-STARTUP-GUIDE.md). Windows deferred; no push/deployment. Earlier candidates below are historical.

**Latest — UX-25:** Coding now has a compact persistent document/paragraph/coding-path bar, independent browser-local reading positions and a native phone document switcher. Details/notes remain available; pending notes retain their original document/project when switching. UX17-03 is technically closed after all 20 documents and an uncoded Bologna import were opened on phone, with refresh/keyboard checks. 150 Python (3 skipped), 99 Node, 10 new Chrome + 11 hierarchy checks and the phone-import supplement pass; syntax/production build pass. Original Bologna JSON/audit/snapshots and eight analyses are unchanged. No explicit read/completion state, range overview, startup redesign, statistics, plotting or site changes. Remaining T03/T01/05/04/W03, UX17-04/05, owner/device acceptance and release gates remain open. [Scope and evidence](UX-25-READING-NAVIGATION.md). Windows deferred; no push/deployment. Earlier candidate notes below are historical.

**Latest — UX-24:** Coding now has a clearly labelled saved hierarchy, full ancestry, calm source highlights and exact coding/path focus. Phone users can open the same tree; overlapping assignments remain individually inspectable. Imported Bologna codings are labelled by their actual provenance. 150 Python tests (3 skipped), 91 Node tests, 11 project-only Chrome checks, syntax and production build pass. The original Bologna project and eight analysis outputs are unchanged; write regression uses additional restored Bologna copies. Website/report assets and statistics/plotting remain unchanged. T02 is technically implemented; reading-location/startup/onboarding/unified visuals, UX17-03/04/05, owner/device acceptance and release gates remain open. [Scope and evidence](UX-24-CODING-HIERARCHY.md). Windows deferred; no push/deployment.

**Latest — UX-23:** every desktop workflow step now uses one sticky left demonstration while the right narrative scrolls. Both original heatmaps add movable original-SVG magnifiers with exact CSV readouts; all earlier diagrams, count views, tables and downloads remain. 82 Node tests, 17 project-only Chrome checks, 301 original-cell mappings, all 594 existing CSV readouts and the production build pass. Workbench, data and original report assets are unchanged. W01 is implemented; other visual/workbench work, owner/device acceptance and release gates remain open. [Scope and evidence](UX-23-HEATMAP-LENS-STICKY.md). Windows deferred; no push/deployment. Older layout/status notes below are historical.

**Latest — UX-22:** the original simple Analysis illustration is restored, with the circular network added below it. The two are both permanent, alongside Coding and all five original plot presentations. 77 Node tests, ten Chrome checks, 594 CSV readouts and production build pass. Remaining website/workbench designs, UX17-03/04/05, visual/device acceptance and release gates remain open; [scope and evidence](UX-22-KEEP-EXISTING-DIAGRAMS.md). Windows deferred; no push/deployment.

**Latest, 16 October 2026 — UX-21:** the website now keeps distinct Coding and circular Analysis network views permanently in the reading sequence. The map uses existing Bologna report evidence and CSV pairs, with actual hover, node drag, keyboard selection, source expansion and phone controls. Nine Chrome checks, 77 Node tests, all 594 CSV readouts and the production build pass; protected workbench/data/report assets are unchanged. Owner visual acceptance remains pending. W01, workbench T01–T05 and UX17-03/04/05 remain open; the new workbench-header screenshot is a future reading-location proposal only. Windows deferred; no push/deployment. Use [the current one-page brief](SUPERVISOR-ONE-PAGE.md) and [UX-21 scope/evidence](UX-21-PERMANENT-NETWORK.md). Prior validation counts below are historical.

**Current update, 16 October 2026 — UX-19:** UX17-01/02 are closed: repaired hierarchy labels and original-size phone figure viewing. The new viewer preserves the SVG's ratio/full extent, supports touch/keyboard zoom and scrolling, and keeps all downloads. Five real bundles/25 members match the pre-change baseline byte-for-byte; statistics, CSVs and report assets are unchanged. 150 Python tests (3 skipped), 74 Node tests, five project-only Chrome checks plus lifecycle/reverse Tab, syntax and production build pass. UX17-03 mobile document navigation, UX17-04/05, owner/device acceptance and release gates remain open. Windows is deferred; no push/deployment. Use the current [one-page brief](SUPERVISOR-ONE-PAGE.md) and [UX-19 evidence](UX-19-MOBILE-FIGURE-VIEWER.md). Notes below and earlier PDFs describe historical candidates.

For a short handout, use the [one-page English review brief](SUPERVISOR-ONE-PAGE.md) in the evidence package. Earlier PDFs are labelled historical and do not contain the UX-33 findings. The current Markdown provides a 15-20 minute demonstration, three discussion questions and outstanding items; the longer walkthrough below remains available.

Latest review: UX-10 reopens visual acceptance following the owner's feedback that the previous website was too dense. The homepage now focuses on one workflow step and the report renders the existing CSVs as interactive graphics. This frontend presentation is explicitly authorised; original SVGs, full tables and downloads are retained. The owner has not yet trialled QT. Technical checks do not mean visual sign-off. **Source push is paused; no deployment; Windows deferred.** [UX-10 scope and evidence](UX-10-VISUAL-RESTART.md).

The target remains Friday **16 October, 18:00 Asia/Nicosia (UTC+3)**. The revised candidate is available locally for review; final owner acceptance remains pending.

## Open the local review

- Website: `http://127.0.0.1:4445/`
- Example report: `http://127.0.0.1:4445/report`
- Editable review workbench: `http://127.0.0.1:4445/w?lang=en`

These are local addresses, not public sharing links. The private review instance uses a disposable copy containing only Bologna CC0: 19 documents, 317 defined codes, 874 codings. Public-demo copy explains its read-only deployment; the private review instance deliberately permits edits to its isolated copy. No model key is loaded, and the configured provider endpoint is inactive loopback. No AI request is needed for the review.

Persistent evidence package: `~/qualicraft-review/supervisor-review/README.md`. It contains startup instructions, source database, reviewed downloads, screenshots, complete commit hashes and raw checks. The checkout is required to run the application; the package is review evidence, not an installer.

## Suggested 25–30 minute discussion

1. **Homepage, 3 min.** Read the short purpose, then inspect the real passage → code → complete theme path. Compare the simple illustration with the optional real recording and its still image.
2. **Workbench, 7 min.** Open Insights → Relationship map. Select “keeping working materials after the end of the project”. Inspect its 23 codings and 23 source ranges, open a full quotation, locate it in its transcript and return. Try Previous/Next, Show/Hide passages, Escape and the named selector. Selection does not change the research record.
3. **Report, 7 min.** Select the frequency count 23. Open its count row and limited saved example. Inspect co-occurrence count 7 and the two overlapping source ranges. Compare hierarchy and accumulation; view source IDs/version hashes and the unit/limits statements. Tables, original SVGs and downloads remain available.
4. **Workflow and export, 5 min.** Inspect the other four explanations and optional recordings; distinguish project JSON, coding CSV, matrix CSV and methods Markdown. Five real figure bundles and four project exports are included in the evidence package.
5. **Limits and priorities, 5 min.** Discuss interpretive usefulness, whether examples are sufficient to understand traceability, and the reading/visual hierarchy. Counts describe coding activity, not importance, agreement or saturation.

## Known limits to review candidly

Coverage axes are now corrected: interviews run horizontally, codes vertically. All 285 displayed cells were checked against the unchanged CSV. UX-10 adds an explicitly authorised frontend presentation of existing CSV rows. Original SVGs, exact row selection, full tables and downloads remain available; statistics and workbench rendering are unchanged.

Desktop and 390px browser layouts, keyboard, console, local export responses and explicit reduced-motion mode were checked. A mobile viewport is not a physical touch device. Windows, physical touch, screen-reader operation and OS-level motion switching await fresh manual confirmation. The authorised project motion script has been updated for the revised markup; its pixel estimates, actual timelines and console logs are retained in UX-10 evidence. The browser download observer timed out; complete ZIP responses were independently checked instead of claiming OS download UI completion.

The former `unittest -t .` collection failure is fixed in UX-09 and its earlier output retained. Both discovery commands now run the same 148 tests, with 3 skips. Node interaction/geometry/source/chart checks ran 56 tests; website build and JavaScript syntax checks returned 0. No new statistics, private interview content or third-party reference-site assets were introduced. UX-08 observed a completed browser CSV download and checked it byte-for-byte against the report CSV; OS UI confirmation remains a separate manual check.

## Review records

[Overall plan](EXPERIENCE-ROADMAP.md) · [2C](UX-02C-NETWORK-CONTROLS.md) · [2D](UX-02D-FACTS.md) · [3A](UX-03A-HOME-CODING.md) · [3B](UX-03B-WORKFLOW.md) · [4A](UX-04A-REPORT-READERS.md) · [4B](UX-04B-SOURCE-EXAMPLES.md) · [5](UX-05-INTEGRATION.md)

[Coverage correction and refreshed acceptance](UX-06-COVERAGE-AXES.md). The prior coverage restriction is closed; Windows and public-release gates remain pending.

Current visual revision: [UX-10](UX-10-VISUAL-RESTART.md). Historical 3A–5 acceptance is retained for traceability and does not override the owner’s later rejection of the visual result.
