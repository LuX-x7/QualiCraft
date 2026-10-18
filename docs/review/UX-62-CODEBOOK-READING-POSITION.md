# UX-62 手机编码树保留阅读位置

日期：2026-10-18。问题：UX60-02／P2。基线 `ab02c4e011c3cdb5246b498aec54a8701a025b35`，分支 `t7-site`；完整本轮提交见Git及审核包COMMITS.md／ux62-evidence/COMMIT.txt。

## 结论与边界

**UX60-02已修复并通过本轮定向验收。** 手机在Bologna interview02.txt的¶17执行Keep后，打开Themes & Codes、筛选materials（含后代）、清除／同主题切换和Resume均保留起点11435；组合搜索、无匹配、取消／Escape、刷新／切文档、窄屏／横竖切换和存储被禁用的行为均有检查。真正阅读滚动仍更新位置，再打开树／Resume使用新位置。手机为受控Chrome触摸模拟，不冒称实体设备或VoiceOver验收。

只改 `web/app.js` 的编码树入口focusin与showMobileCodebook：调用既有beginReadingSearch，在控件或对话框引发滚动之前／之后保留最后实际阅读线，复用已经按项目、文档和源文本校验的内存返回锚点。已有搜索返回不被覆盖；过滤结束沿既有mountReading恢复，实际阅读手势沿既有逻辑解除锚点并推进位置。

不加项目字段、不存正文到浏览器、不改Keep／Resume数据格式、筛选语义、阅读标记或持久化规则。统计、绘图、CSV、五图和网站不变；导航无POST，数据库项目／审计／恢复点均不变。UX60-01复验保持关闭；其余功能不改。Windows暂缓且未验证，不推送、不部署。

## 失败证据与修复

旧UX60独立证据保留：`~/qualicraft-review/ux-60/mobile-memory/results.json`，Keep11435→打开树0；`ux-60/joint/phone/theme-filter-memory.json`还记录筛选、清除及Resume均0。新7项Node回归在改产品前5失败／2通过，修复后全过，覆盖原生入口聚焦、控件滚动、已有搜索返回、实际阅读推进、源身份及禁用存储。

新浏览器首次执行有12项／3通过：手机关键流程复现位置丢失；其中桌面脚本错误地寻找手机专用入口，不能算产品缺陷。修复后中间执行11/12，唯一失败为脚本未先展开桌面侧栏；已修正脚本，最终完整12/12通过。新审核入口补充截图的第一次GET缺会话头被400拒绝，补正确头后通过。这些中间输出和退出码全部保留，不以它们冒充正式通过结果。

## 原始命令与结果

原始stdout/stderr、完整argv／cwd／退出码／耗时均在 `~/qualicraft-review/ux-62/raw/`，命令记录为同名`.command.json`，文本`.txt`及`.exit`；空语法输出配退出码保留。

| 检查 | 原始记录与结果 |
| --- | --- |
| 新7项回归 | `regression-before.*`退出1，5失败；`regression-after.*`退出0，包含7新＋32既有阅读回归，共39通过 |
| 全部前端回归 | `node-full.*`：`node --test tests/*.test.mjs tools/report/*.test.mjs`，246通过，无失败／跳过，退出0 |
| 全部Python | `python-full.*`：`python -m unittest discover -s tests -v`，287项，3原有环境跳过，退出0 |
| JS语法 | `syntax.*`：`node --check web/app.js`，退出0 |
| 生产构建 | `npm-build.*`如实保留npm不存在127；同一当前网站源独立副本执行`node node_modules/next/dist/bin/next build`，`next-build.*`退出0。未安装依赖或修改配置／旧服务 |
| 定向Chrome | `browser-final.*`／`ui-final/results.json`：12/12；桌面1440×900、手机390×844／320×740／390×600并旋转844×390，触摸／鼠标／键盘，正常控制台／HTTP／外部请求0，导航POST0，项目及快照哈希相同 |
| 冻结JSON兼容 | `restore-regression.*`／`restore/results.json`：10/10桌面／手机恢复复验；旧失败原件、重导出、旧无M1、保留版本／QCA／图资产及恢复点保持；恢复后的手机项目Keep→树仍11435。4次主动篡改400及对应错误另列，正常错误0 |
| 当前审核入口 | `review-shots-final.*`：独立21文档／317节点／876标注副本桌面／手机完整Keep→树／筛选→清除→Resume11435，项目／审计／快照保持，正常错误及POST0 |
| 范围 | `scope.*`／`scope.json`：基线140个其余产品／数据／部署路径、110网站构建源及31既有样例不变；去掉入口聚焦条件和打开前的锚点调用后app.js与基线逐字节相同 |

Python运行时3.14。本轮不改测试入口；旧`-t .`收集／权限问题及UX60允许loopback后280项通过的记录继续按历史保留。本轮新增测试针对前端导航，没有新Python产品行为。旧Word、图、ZIP与样例不重新生成；完整项目恢复脚本原来对已知缺陷的观察已改成“位置保留”的回归断言，不再要求缺陷继续出现，旧证据保持。

## 截图与审核入口

新独立本地入口：[网站](http://127.0.0.1:52766/) → [工作台](http://127.0.0.1:52766/w/?lang=en) → **Bologna · codebook position review**。保留冻结QCA／报告的公开Bologna技术副本，有21文档／317节点／876关联；网站原示例仍19文档。旧项目、旧入口和恢复点均不重置。服务只在开发机运行时可访问，其他设备不能用自己的127.0.0.1访问开发机。

`~/qualicraft-review/ux-62/ui-final/`：

- `01-phone-Keep-paragraph17.png`、`02-phone-codebook-keeps-position.png`：Keep与打开树。
- `04-phone-theme-filter.png`、`05-phone-clear-Resume-paragraph17.png`：筛选、清除后返回。
- `06-keyboard-1440.png`／`06-keyboard-390.png`：桌面／手机键盘。
- `07-phone-real-reading-advances.png`、`08-desktop-normal-scroll.png`：实际阅读推进。
- `09-phone-reload-document-return.png`、`10-phone-responsive-*.png`：刷新、切文档和响应式。

`review-shots/`为实际新审核入口：`phone-open-tree-preserves-Keep.png`及桌面／手机`*-filter-clear-Resume-paragraph17.png`。`restore/phone/09-codebook-position-preserved.png`证明冻结项目恢复后位置仍保留。首次中间失败另保留在before／ui目录及各原始输出中。

## 总体状态与交付

本轮未发现新的未关闭功能问题；UX60-01／02均为定向关闭，**不把它们自动换算为旧UX60整套联合通过**。下一轮按批量导入→编码→阅读双轨／筛选／跳转／位置→关系图→五图→报告方法图与读值→Notebook／Word／代码→JSON恢复重跑联合门禁，再汇总当前人工设备／VoiceOver／系统减少动态／下载反馈和研究者、用户／supervisor接受。UX39用户已报告的阅读标记／位置结果保留其原范围，设备信息仍待补；不代签新增路径。

总体计划、最终验收表及一页英文审核说明同步更新。原31样例与最初六个Word／ZIP保持SHA256；包为 `~/qualicraft-review/supervisor-review/`，本轮归档 `supervisor-review-UX62-update.zip`，完整提交、命令、截图、范围及CRC／逐成员SHA256在包内。无真实访谈、活跃数据库、会话token或凭据进入审核包。Windows暂缓，不推送、不部署。
