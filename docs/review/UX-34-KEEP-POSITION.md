# UX-34 · 手机Keep保存准确来源段落

2026-10-17。基线 **`2d6a7b42d224e7b51a6ac737f4fb5aa6a992fcee`**（UX-33文档候选，运行产品UX-32B）。用户本轮明确授权工作台修复UX33-02。**本轮仅关闭UX33-02，UX33-01不修、仍开放。** 只用Bologna CC0临时副本；Windows暂缓且未验证，不推送、不部署。

## 修复与边界

旧实现把“视口里出现原句”当作“阅读位置推进”。手机触摸前，浏览器为了把Keep按钮带入视口先移动页面，首段从概览下方露出；此时`readingMounted.start`与临时导航锚点都变为0，Keep随后保存首段并显示成功。

现在保留当前稳定项目／文档ID对应的来源导航锚点：只有原段落进入**正文阅读线**时才推进该锚点。正文阅读线仍由固定阅读栏、文档区和已有sticky工具行决定，沿用原几何边界。概览控件下方仅露出的首段不再替换目标。Keep从该导航锚点恢复并保存相同字符位置，避免恢复布局时的可见位置提示再次替换它。真正向下触摸阅读仍可推进，不能永久锁在最初跳转段。

产品只改`web/app.js`中的Keep／阅读位置几何与推进条件，新增共享几何helper。没有修改HTML／CSS、手动标记存储／Undo／项目v5、源文本、编码归属、搜索／主题筛选、关系图、统计或绘图。源码对照确认：仅`keepOverviewPosition`、`readingParagraph`、`updateReadingPosition`三个原函数改变，新增`readingViewportTop`；其余**168个顶层JS函数及函数外全局事件代码完全一致**。UX33-01所在的捕获／搜索事件代码未改，实测仍能复现。

## 回归先失败，再通过

证据根 `~/qualicraft-review/ux-34/`，审核包镜像 `supervisor-review/raw/ux-34/`。`raw/run-index.json`记录实际命令、工作目录、绝对解释器、退出码及原始输出哈希；`post-commit.json`记录完整本地提交。截图／运行数据库不入Git。

| 检查 | 实际命令及原始输出（相对证据根） | 结果 |
| --- | --- | --- |
| 新单测，修复前 | `node --test tests/reading_keep.test.mjs`；`raw/regression-red.txt` | 5项中3失败、2对照通过：控件滚动覆盖、保存时重排、只预览别段都会丢失目标 |
| 真实Chrome，修复前 | `python tools/e2e/overview_keep.py --url http://127.0.0.1:4467 --out /tmp/qualicraft-ux34/acceptance`；`raw/browser-red.txt`、`acceptance-red/results.json` | 初始11项中4失败：390px触摸¶4／¶5／¶6及真正阅读后Keep均误存0；桌面／键盘及特定矮窗／窄窗对照通过，不笼统归因于所有手机布局 |
| 新单测，修复后 | 同单测；`raw/regression-green.txt` | 5/5，包括真正阅读推进、项目／文档隔离、保存时重排不偷换目标、只预览不算跳转 |
| 新Chrome最终 | 同脚本，加入准确编码原句跳转场景；`raw/browser-final-with-source.txt`、`acceptance/results.json` | **12/12**：8种输入／窗口／段落组合＋真实触摸阅读推进＋精确原句来源Keep＋1项UX33-01仍存在的范围观察＋项目／快照不变 |
| 原概览回归 | `python tools/e2e/reading_overview.py --url http://127.0.0.1:8869 --out /tmp/qualicraft-ux34/overview-regression`；`raw/overview-regression.txt` | **11/11**：全文轨道、全部31段／52来源分页、同范围多码／跨段／相邻、筛选明确清除、Resume／Keep、网络优先、手机／断点／减少动态及零写 |
| 只读／禁用存储 | `python /tmp/qualicraft-ux34/readonly_review.py`；`raw/readonly-review.txt`、`readonly-review.json` | **2/2**：导航可用，不能保存浏览器位置时明确提示；项目和只读权限不变，零项目写请求／pageerror |
| Node完整／语法 | `node --test tests/*.test.mjs tools/report/*.test.mjs`、`node --check web/app.js`；`raw/node-full.txt`、`js-check.txt` | **144通过**，语法退出0 |
| Python完整 | `python -m unittest discover -s tests -v`；`raw/python-full.txt` | **163项，3跳过，退出0**；不改测试入口 |
| 构建 | `cd website && npm run build`；`raw/npm-build.txt`；再以绝对Node运行`node_modules/next/dist/bin/next build`；`raw/build.txt` | npm不存在，退出127原样保留；与package.json相同的Next生产构建退出0，含TypeScript。既有middleware弃用提示保留 |
| 当前预览 | `restart_previews.py`、`normal_preview.py`；`raw/restart.txt`、`normal-preview.txt`、`normal-preview.json` | 构建后20登记前台重启／首页／报告／health／bootstrap均200，JS／CSS响应字节等于当前源码；常用4445桌面／手机、只读入口与320px正常，无溢出／控制台错误 |
| 修改范围 | `node /tmp/qualicraft-ux34/function_scope.mjs`、`python /tmp/qualicraft-ux34/scope.py`；`raw/function-scope.txt`、`scope.txt` | 168其余函数及全局事件不变；后端／统计／绘图／CSV／网站与报告资产、原Bologna模板均不变；具体文件／链接／哈希见scope.json |

最终浏览器主验收合计**25项通过（12＋11＋2）**，其中1项是“UX33-01仍存在”的范围观察，**不是该问题获通过或关闭**。原UX-33的44/46是历史整体验收，不改写成25项或全通过。两套主脚本和正常入口的JS／控制台／HTTP错误为0；新Keep脚本在准备完成后UI POST=0，项目JSON／审计／快照完全不变。

首次修复后执行与生产构建／前台重启重叠，一条页面导航被重启打断（`ERR_CONNECTION_REFUSED`）。该输出与结果保留在`raw/browser-first-green.txt`、`acceptance-interrupted/`，不算产品通过。待前台就绪完整重跑11项通过；随后针对准确编码原句的控件位置补入第12项并再次完整通过。没有删除失败、修改功能期望或隐藏控制台来凑结果。

## 手机、桌面与键盘的实际结果

390×844触摸：¶4 `[872,2681)`、¶5 `[2683,2858)`和¶6 `[2860,3348)`，Keep分别保存872／2683／2860；刷新与文档往返保持对应锚点。390px键盘Enter、1440×900鼠标、1440×600矮桌面、320×740和390×600触摸均通过。

真正触摸滚动从¶5继续向下后，Keep保存新的可见阅读锚点；没有一直锁在2683。准确编码来源跳转也保存其所属¶4，完整引文／标注身份保持，刷新正确。只在概览预览另一段没有执行跳转时，单测确认Keep不把预览选择当作新的来源定位。保存后焦点回到准确原文，完整正文可读。

精选截图：

- `acceptance-red/screenshots/390-844-tap-p4-after.png`：修复前误存首段；
- `acceptance/screenshots/390-844-tap-p4-after.png`：修复后保持¶4及Read；
- `390-844-tap-p5-after.png`、`390-844-tap-p6-after.png`：短段／普通段；
- `1440-900-click-p4-after.png`、`390-844-keyboard-p4-after.png`：桌面／键盘；
- `320-740-tap-p4-after.png`、`390-600-tap-p4-after.png`：窄／矮手机；
- `phone-real-reading-scroll-kept.png`、`phone-exact-source-kept.png`：真实阅读推进及准确原句来源。

除第一张明确位于acceptance-red外，后续精简名称均在`acceptance/screenshots/`。全部截图及原始PNG不进仓库，审核包提供单独索引。手机为受控Chrome触摸仿真；没有代验实体设备／VoiceOver或声称Windows通过。

## 数据、存储和范围纪律

专用新临时前台4467→后端8868，后台无模型密钥，模型地址为不可用loopback，不发送模型请求；受控上下文只访问本项目相应origin，不读取其他窗口／标签页。

主夹具明确恢复Bologna副本、导入同一interview02原文并在`[2,38)`加两个既有码、标记¶4=Read／¶5=Revisit，得到**20文档／317编码／876标注**。这些属于准备写入；随后Keep检查不写项目。主临时库内原19／317／874项目连同审计保持原样；原模板SHA-256仍为`b8b44b814f2fa6286decf877364665ad8276977c08913d02d7b8a90db62a755d`，持久化v4，工作副本仍v5。

原11项概览回归另用8869／overview-data的全新Bologna副本，明确准备两个阅读标记，并另恢复20文档／878标注的边界夹具。没有复用或覆盖原UX-32A／32B／33的标记审核副本。主夹具／原概览在准备后的before／after JSON及快照均相同。

常用4445数据库字节不变；10个manifest SVG／CSV资产及网站全路径原字节保持。没有新增统计、改单位、重画图、重建报告资产或更改CSV。新脚本和单元测试只有回归用途，不是产品新功能。源码的`captureReadingPosition`和原搜索事件未改；原生Tab到手机Search仍将872变为0，记录在`acceptance/results.json`的`known_open`，UX33-01继续开放。

## 当前计划与审核包

**UX33-02本轮关闭。UX33-01按用户明确要求本轮不动。** 后续可单独确定搜索前阅读记忆语义并修复，再按用户／supervisor具体反馈收束W03视觉。当前新控件的实体设备／VoiceOver、用户审美接受及正式发布门禁仍开放；不由本轮局部修复推断整体项目全部完成。

总体计划、handoff、原UX-33问题历史与一页英文说明已同步。当前普通入口为 `http://127.0.0.1:4445/w?lang=en`，明确标记的本轮副本在 `http://127.0.0.1:4467/w?lang=en`。完整提交、范围和审核包一致性见`post-commit.json`、`scope.json`、`package-verification.json`。Windows暂缓，不推送、不部署。
