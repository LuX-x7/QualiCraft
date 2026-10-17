# UX-37 · W03 网站视觉收尾

2026-10-17 最新（UX-38，只验收）：**W03调整后的联合流程54/54通过；范围内未发现新增功能缺陷。** 新Bologna副本实际完成导入→两码同句→Read／Revisit与双轨→筛选／跳转／记忆→关系图→五图→报告594行／301热图映射→四导出／v5恢复。原手机搜索／Keep失败顺序继续通过；W03完整图框、手机全名、Import／Export工程图形与所有原图／媒体保留。23登记项目预览健康，原种子19/317/874／审计、常用4445库、产品与资产哈希保持。仅更新8份审核文档，不重跑全量单测或构建；UX-37的153 Node／直接Next构建与UX-35的163 Python（3跳过）明确作历史证据。见 [本轮流程、剩余事项与截图](UX-38-JOINT-ACCEPTANCE.md)。**W03技术项保持完成；用户／supervisor视觉接受、当前实体设备／VoiceOver与正式发布门禁仍开放。** Windows暂缓且未验证，不推送、不部署。下方旧轮次为历史。

2026-10-17。基线 **`abc2ffd7062cd3b325295a7f0a5f74cf5c34e296`**（UX-36文档／产品UX-35）。用户授权本轮精简左侧演示窗、改善手机关系图标签、完善Import／Export工程化图形。**本轮实现与技术验收完成；用户／supervisor视觉接受仍待确认。** 仅Bologna CC0；Windows暂缓且未验证，不推送、不部署。

## 具体改变

- **演示窗让图形先出现。** 固定左窗保留同一标题栏与进度，去掉内部重复的大标题；原Coding、保存路径图、追加圆点网络及五类图仍各有独立滚动场景。完整网络按比例适配第一屏，筛选移至原生“Choose theme or node”展开区，缩放、来源节点展开和Reset仍可直接操作。完整引文、路径与来源ID继续向下阅读。
- **手机节点名称保持可读。** 完整节点名在独立18px文字栏显示，随悬浮／触摸／键盘选择更新；手机滚动读图时该栏停在导航下方。密集概览不再要求读缩成小字的SVG标签；节点、连线、选择状态、完整名称下拉与详情全部保留。Fit为完整画布，放大／双轴原生平移／拖拽仍可用，显示位置与节点大小不承载统计值。
- **Import展示底层记录。** 原文件／数据库线稿仍在，补`document_id`、原文本、文档SHA-256的结构关系与准确`[start,end)`坐标。例证仍为interview03.txt、Unicode `[26013,26090)`，没有发明文档或范围；短摘要之外，可展开完整原句与ID。文件、文本记录、坐标三处可悬浮／触摸／键盘选择。
- **Export展示分支逻辑。** 原项目／四文件线稿及四个FileStructure图形保留，补documents／codes／annotations结构与分支连线。JSON、标注CSV、矩阵CSV和Methods各有字段提示与独立选择说明。图是格式说明，不伪装成工作台页面、下载完成或新分析结果。

工程图只用本项目SVG／CSS绘制，沿用纸色、细线、少量蓝／赭红，原始图形与布局模型未复制第三方代码或素材。新增线条进入动画一次完成，悬浮即时更新；减少动态下停用新增动画和过渡。原生滚动、键盘PageUp／PageDown场景切换和原选择行为保持。

## 验收证据

证据根 `~/qualicraft-review/ux-37/`；审核包镜像 `supervisor-review/raw/ux-37/`。`raw/run-index.json`记录绝对解释器、命令、退出码与输出SHA-256；`post-commit.json`记录完整本地提交和干净工作树；截图与运行产物不进Git，不归档运行数据库／备份／令牌。

| 命令／原始输出（相对证据根） | 结果 |
| --- | --- |
| `python tools/site/w03_acceptance.py --url http://127.0.0.1:4445 --out /tmp/qualicraft-ux37/before`；`raw/w03-red.txt` | 修改前7项新需求，6项不满足、资产保留对照1项通过。这是本轮视觉要求的基线，非新增6个数据缺陷 |
| 同脚本，最终`--url http://127.0.0.1:4469 --out /tmp/qualicraft-ux37/w03`；`raw/w03-final.txt`、`w03/results.json` | **7/7**：普通／矮桌面完整网络、手机18px全名、按需筛选／真实悬浮／键盘、Import三阶段、Export四结构、320px／横屏／减少动态、资产与零POST |
| `python tools/site/story_acceptance.py --url http://127.0.0.1:4469 --out /tmp/qualicraft-ux37/story`；`raw/story-final.txt` | **10/10**：十场景自然滚动、原路径图与追加网络、真实悬浮／拖拽／键盘／触摸平移、原ID与连线／16CSV对、全部594读值与图形比例 |
| `python tools/site/heatmap_acceptance.py --url http://127.0.0.1:4469 --out /tmp/qualicraft-ux37/heatmap`；`raw/heatmap.txt` | **7/7**：301CSV映射、原图放大镜、准确数值、悬浮／键盘／触摸／静态退路 |
| `python tools/site/recordings_acceptance.py --url http://127.0.0.1:4469 --out /tmp/qualicraft-ux37/recordings --receipt /tmp/qualicraft-ux37/recording-receipt.json`；`raw/recordings.txt` | **9/9**：五段视频及首帧、手机／桌面／键盘、减少动态、无JS与视频丢失静态替代。沿用原180帧合格回执与当前字节核对，不冒称重新录制 |
| `node --test tests/*.test.mjs tools/report/*.test.mjs`、`node --check web/app.js`；`raw/node-final.txt`、`js-check.txt` | **153通过**，语法退出0；本轮没有改工作台JS |
| `cd website && npm run build`；`raw/npm-build.txt`；绝对Node执行`node_modules/next/dist/bin/next build`；`raw/build-final.txt` | npm缺失127保留；直接执行package.json同一Next生产构建退出0，含类型检查，既有middleware提示保留 |
| `grep -rniE 'publication-grade|publication-ready|publication-oriented|put in a paper|期刊' website/`；`raw/prohibited-copy.txt` | 退出1，无匹配；空输出结合实际退出码记录，不写成扫描未执行 |
| `restart_previews.py`、`normal_preview.py`；`raw/restart.txt`、`normal-preview.txt`、`normal-preview.json` | 22登记前台在最终构建后更新，首页／报告／health／bootstrap均200，工作台JS/CSS字节与源码相等；普通4445桌面／手机、只读例与320px无溢出／错误／数据库写入 |
| `summarize.py`、`scope.py`；`raw/summary.txt`、`scope.txt`、`summary.json`、`scope.json` | 33项通过、数据／原图／媒体／组件保持，13文件允许清单、保护哈希／链接／脚本编译／空白检查 |

最终**33项浏览器检查全部通过（7＋10＋7＋9）**。正常控制台／pageerror／HTTP错误0；录屏缺失测试使用单独的故意404夹具，错误单列于`intentional_failure_messages`，不隐瞒也不混入正常路径。网站主验收无工作台请求或项目POST。

首轮新版W03为6/7：一个新增测试用单元素选择器误匹配三个一直挂载的标题，改为逐一确认全部隐藏，未改功能期望；输出与截图保留在`raw/w03-first.txt`、`w03-first/`。原网站首轮10/10保留在`story-first/`。随后按截图调整字段图列宽／字号和手机名称栏，最终构建后完整复验通过；所有构建输出保留。完整后端单测未重跑，因为后端／工作台／统计／绘图原字节不变，不把此前163项结果写成本轮新测试。

## 实际尺寸与截图

1440×900中，网络画布为917.80×430px，屏幕y=209.25…639.25，完整处于演示窗内部y=123.44…813.44。1440×650中为917.80×260px，y=204.81…464.81，内部可视区y=119…559。SVG保留1000:620坐标系、meet比例和留白，不拉伸图形。390px画布312×230px，完整节点名18px、无需浏览器放大；缩放／平移只改视图，不改记录或统计。

截图精选索引为审核包`SCREENSHOTS-UX37.md`。`w03/desktop-network-900.png`、`desktop-network-650.png`、`phone-network-readable.png`展示完整画布与名称；`desktop-import-engineering.png`、`desktop-export-engineering.png`展示工程结构；`screenshots/mobile-import-full.png`、`mobile-export-full.png`是手机完整组件长图，按原生滚动阅读，不冒充一个手机视口全部容纳。新动画等进入稳定状态后拍摄。

手机为独立受控Chrome触摸仿真，且只访问本项目origin，不读取其他窗口／标签页。未声称实体手机、VoiceOver、系统设置或Windows已验证。Codex预览打开请求返回queued；真实浏览器截图与HTTP探测才是本轮可见性证据。

## 保留范围与计划状态

工作台`qualicraft/`、`web/`、统计、SQLite、CSV、报告生成流程、所有`website/lib/`和`website/public/`字节不变。10个manifest SVG／CSV、10个视频／静态帧及其下载保持。SketchGlyph、CodingSketch、SavedPathSketch、PlotSketch原组件字节相同；SketchScene的四个FileStructure原绘图代码相同。新增网络仅调整呈现、缩放和控件位置，模型／ID／原关系数据不改。常用4445数据库与Bologna原模板SHA-256保持。

仓库产品只改3个网站文件（sketches.css、RelationshipSketch、SketchScene）；新增W03浏览器工具，原story工具仅增加打开按需筛选与无遮挡平移的采集操作，原值／ID／行为断言不放松。其余8份为审核文档。

**W03本轮授权的实现与技术验收关闭；用户视觉接受仍开放。** 以当前截图和实际页面确认是否符合所需的简洁、手稿与科研化呈现。其余仍需当前版本实体设备／VoiceOver／系统减少动态／OS下载反馈，以及用户／supervisor接受、正式发布地址和平台声明。原UX-36联合验收47/47为历史工作台证据；本轮33项是网站范围，不混作同一套检查。

当前网站 `http://127.0.0.1:4445/#workflow`，报告`/report`；隔离Bologna工作台仍为`http://127.0.0.1:4469/w?lang=en`。Windows继续暂缓且未验证，不推送、不部署，不改自动部署设置。
