# UX-35 · 手机搜索保留阅读位置

2026-10-17。基线 **`688e15393b22eab028225240a93c051b8a90c82a`**（UX-34）。用户明确授权本轮修复UX33-01。**本轮关闭UX33-01；UX33-02保持关闭，其余项不动。** 仅Bologna CC0临时副本；Windows暂缓且未验证，不推送、不部署。

## 行为与存储规则

旧实现会在手机原生聚焦搜索框、浏览器自动把控件滚入视口时，把先前第4段的阅读锚点872覆盖成首段0；输入事件再次捕获被移动的视口，清除／Resume因此返回错误段落。

现在将最后实际阅读位置与控件引起的视口移动分开。搜索开始时按当前项目ID、文档ID和完整源文本绑定返回段落，输入／过滤不覆盖该位置；清空输入、Clear filters及Resume回到搜索前原段落。Chrome处理输入光标后的一次布局恢复也使用同一锚点，后续导航／打开概览／文档切换会取消过期恢复。

真正触摸、滚轮或键盘阅读仍更新下一次搜索位置。滚回首段会记录0，不永久锁住之前的第4段；浏览器合成滚动使事件目标变成正文区元数据时也能识别实际阅读。仅在控件上点击或编辑输入不算阅读推进。概览预览不改保存位置，显式Keep仍能保存新来源段落，并清除旧搜索返回。

临时搜索返回仅存内存，随项目／文档／源文本改变失效；它不写项目、JSON、审计或快照。沿用浏览器本地阅读位置，不引入新存储字段或项目格式。禁用浏览器存储时，本次查询清空仍能临时返回，但Resume保持禁用，没有虚报保存成功。手动Read／Revisit与Undo仍使用原v5行为，筛选定义与来源精确范围保持。

## 回归与原始证据

证据根 `~/qualicraft-review/ux-35/`，审核包镜像 `supervisor-review/raw/ux-35/`。`raw/run-index.json`记录绝对运行时、命令、工作目录、退出码和输出SHA-256；`post-commit.json`记录完整本地提交及干净工作树。截图和临时库不进Git，审核包不收录运行数据库／备份。

| 检查 | 命令及原始输出（相对证据根） | 结果 |
| --- | --- | --- |
| 新单测先失败 | `node --test tests/reading_search.test.mjs`；`raw/regression-red.txt` | 初始7项全部失败，确认修复前没有搜索返回保护 |
| Chrome先失败 | `python tools/e2e/reading_search.py --url http://127.0.0.1:4468 --out /tmp/qualicraft-ux35/acceptance`；`raw/browser-red.txt`、`acceptance-red/results.json` | 13项中10失败；原生Tab、触摸、清除与切换等复现位置丢失，3对照通过 |
| 时序边界补测 | `raw/regression-timing-red.txt`、`regression-retarget-red.txt`、`regression-navigation-red.txt`、`regression-gesture-red.txt` | 扩为9项，先分别捕获输入光标滚动、滚轮目标重定向、恢复取消、真实阅读采样问题，再修正；最终9/9 |
| 搜索最终浏览器 | 同搜索脚本；`raw/browser-final.txt`、`acceptance/results.json` | **13/13**，生产构建和预览重启后完整复验；含Tab、触摸、匹配／无匹配、组合筛选、预览／Keep、真实阅读、桌面、窄／矮／旋转、切换、禁用存储与零项目写 |
| Keep回归 | `python tools/e2e/overview_keep.py --url http://127.0.0.1:8870 --out /tmp/qualicraft-ux35/keep-regression`；`raw/keep-regression.txt` | **12/12**；上轮保留的UX33-01观察改为准确锚点断言，无已知失败豁免 |
| 原双轨概览回归 | `python tools/e2e/reading_overview.py --url http://127.0.0.1:8871 --out /tmp/qualicraft-ux35/overview-regression-final`；`raw/overview-regression-final.txt` | **11/11**；全文轨道／分页／准确来源／同段多码／跨段／相邻、筛选、位置与网络返回保持 |
| 只读／禁用存储 | `python /tmp/qualicraft-ux35/readonly_review.py`；`raw/readonly-review.txt`、`readonly-review.json` | **2/2**；来源导航仍可用，无法持久保存时明确提示，零项目写 |
| Node与语法 | `node --test tests/*.test.mjs tools/report/*.test.mjs`、`node --check web/app.js`；`raw/node-final.txt`、`js-check.txt` | **153通过**（含9项新回归），语法退出0 |
| Python | `python -m unittest discover -s tests -v`；`raw/python-final.txt` | **163项，3跳过，退出0**；一次普通沙箱执行因禁止绑定本地端口出现16项错误（`raw/python-sandbox.txt`），以本机测试权限完整重跑；不改测试入口 |
| 构建 | `cd website && npm run build`；`raw/npm-build.txt`；绝对Node运行`node_modules/next/dist/bin/next build`；`raw/build.txt` | npm缺失127保留；与package.json对应的直接Next生产构建0，TypeScript通过，既有middleware提示保留 |
| 实际预览 | `restart_previews.py`、`normal_preview.py`；`raw/restart.txt`、`normal-preview.txt`、`normal-preview.json` | 21登记前台重启：首页／报告／health／bootstrap均200，JS/CSS响应字节与源码一致；普通4445桌面／手机、只读入口与320px无溢出／错误 |
| 数据／范围 | `function_scope.mjs`、`summary.py`、`scope.py`；`raw/function-scope.txt`、`summary.txt`、`scope.txt` | 168其余顶层函数及其余全局事件代码不变；15文件允许清单，保护哈希／链接／编译／空白检查通过，详见scope.json |

最终浏览器**38项通过（13＋12＋11＋2）**，没有“已知仍失败即算通过”的范围观察。搜索／Keep／概览均在夹具准备后零UI项目POST，项目JSON／审计／快照前后相同；控制台／pageerror／HTTP错误0。旧UX-33的44/46仍是当时历史结果，不把本轮局部回归写成旧轮次全通过。

中间三版浏览器输出和截图原样保留：`browser-first-green.txt`为8/13，`browser-second-green.txt`及`browser-third-green.txt`各12/13。它们分别发现清空后的浏览器光标自动滚动、滚回首段沿用旧锚点、真实触摸后保留了过期手势状态。第四版13/13通过（`browser-fourth-green.txt`及`acceptance-fourth-green/`），随后生产构建重启后再次完整通过。滚轮诊断原始输出亦保留；其中一次诊断脚本引号导致SyntaxError，退出1，修正后重新诊断，未修改产品验收期望。最终`acceptance/`截图目录仅含最终结果，历史失败保留在相应历史目录。

## 桌面、手机和键盘验收

主返回段落为interview02.txt的¶4 `[872,2681)`，预设Read；¶5 `[2683,2858)`预设Revisit。原生Tab聚焦搜索尚未输入、触摸输入匹配词、无匹配、清空和Resume均保留872。组合主题／文本筛选仍按原定义，Clear filters返回872。概览显式查看¶6后Resume回872；显式Keep则保存2860并经刷新保持，旧搜索返回不覆盖它。

真实触摸阅读后下一次查询返回新的段落；主动滚回首段后下一次查询正确返回0。桌面1440×900鼠标和键盘、390×844触摸、320×740／390×600及旋转至844×390均保持原比例和完整正文，无水平溢出。项目／文档往返与刷新保持各自位置；源文本匹配及过期布局恢复取消有单元测试保护。

最终截图在`acceptance/screenshots/`：`03-phone-focus-only-resume.png`、`04-phone-query-cleared.png`、`06-phone-clear-filters-return.png`、`07-phone-combined-filter-return.png`、`09-phone-explicit-Keep-replaces-search-return.png`、`10-phone-real-reading-next-search.png`、`11-desktop-tab.png`、`12-responsive-320-740.png`、`13-project-document-reload-return.png`和`14-blocked-storage-temporary-return.png`。修复前对照在`acceptance-red/screenshots/failure-1.png`。审核包另有`SCREENSHOTS-UX35.md`索引。

手机是独立受控Chrome的触摸仿真；只允许当前本项目origin，不读取其他标签页／窗口。未声称实体手机、VoiceOver或Windows通过。

## 数据、代码与下一步

专用临时4468→8870，原概览另用8871；仅Bologna，无模型密钥，模型地址设为不可用loopback。搜索夹具恢复19文档／317编码／874标注的副本，仅明确准备¶4／¶5两个阅读标记；Keep回归另建20文档／317编码／876标注副本，原概览另建20文档／878标注边界夹具。这些是明确准备写入，后续UI查询不写研究记录。

原Bologna模板持久化v4，SHA-256仍为`b8b44b814f2fa6286decf877364665ad8276977c08913d02d7b8a90db62a755d`；工作副本沿用v5。临时库原项目连同审计和普通4445数据库字节不变。10个manifest报告SVG／CSV和全部网站／后端／统计／绘图／样式／部署配置字节不变；没有重绘或更新报告资产。

产品仅改`web/app.js`的4个原位置函数（captureReadingPosition、keepOverviewPosition、mountReading、updateReadingPosition），添加4个搜索／手势／恢复helper、一个内存变量和7个事件绑定，并将搜索输入捕获改为开始搜索返回。其余168个顶层函数和归一化允许修改后的其他全局事件原字节相同。新增9项Node与搜索e2e；原Keep脚本只把旧UX33-01观察改为固定结果断言。其余修改为11份审核文档。

**UX33-01本轮关闭；UX33-02保持关闭。** 其余W03视觉、当前实体设备／VoiceOver、用户／supervisor接受和发布门禁不因本轮通过自动关闭。总体计划、handoff、一页英文说明及原问题状态已同步。普通工作台仍为`http://127.0.0.1:4445/w?lang=en`，标记的QA副本在`http://127.0.0.1:4468/w?lang=en`（Bologna · UX35 search review）。完整本地提交和审核包一致性见`post-commit.json`、`scope.json`和`package-verification.json`。Windows暂缓，不推送、不部署。
