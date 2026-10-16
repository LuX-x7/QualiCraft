# UX-32A · Coding 手动阅读标记

后续更新（UX-32B）：双轨概览、精确段落／原句列表、分页和跳转已技术验收，见 [32B](UX-32B-READING-OVERVIEW.md)。位置／手动标记／实际编码继续独立，预览不覆盖Resume，清筛选须明确选择；v5与32A保存／快照规则不变。本文件旧轮次状态按历史保留；实体设备／VoiceOver、其余W03与发布接受仍开放，Windows暂缓，不推送、不部署。

2026-10-16。基线 `075e449868bc3ddf5447a876998a9317d2ad99c5`（UX-31 方案），本轮用户明确授权实现 32A、项目 v5 与快照滞后规则。**本轮手动标记切片已实现并通过本地技术验收；32B 编码范围概览未做。** 只用 Bologna CC0 临时副本；未改统计、绘图、报告资产、网站素材和部署配置，不推送、不部署；Windows 暂缓且未验证。

## 使用方式与语义

Coding 常驻栏选择段落的 `○ Unmarked`／`✓ Read`／`↺ Revisit`；`Mark read · ¶N` 明确写出目标段。选择 Unmarked 清除，Undo 撤销最近确认的转换；Undo 可在滚动后仍作用于原段落，不猜当前段。边缘符号、菜单文字和可访问名称共同表达状态；正文背景和编码高亮不变。没有 Overview 按钮或进度百分比。

目标优先采用视口和阅读面板内明确聚焦的段落，否则取吸顶栏下首个可见段落；控件获得焦点／手势开始时固定目标，保存不跳下一段。分段沿用每条非空物理行，Unicode code-point `[start,end)`，不是任意选中的原句。滚动、Resume、搜索、编码、模型建议不自动标记已读；浏览器位置仍独立保存。

保存中显示原确认状态与 Saving，收到成功应答才改变状态。失败显示 Not saved 和 Retry；重试沿用请求 ID。409 读回最新标记后要求重选；若刷新也失败，标记动作禁用，Retry 只刷新、不重发被拒编辑。切换文档／项目后迟到响应不串写，较旧 revision 不覆盖新状态。只读演示展示已有状态但不能修改；后端照常验证 token／只读规则。

## v5、保存、快照与恢复

- 新项目格式 5；旧格式 1–4 只在内存中添加中性空值，不从编码／笔记猜测 Read。GET／JSON 导出不改库。原始 Bologna 模板仍是未改动的 v4。
- 文档 `reading_state` 包含 version=1、原始 UTF-8 source SHA、code-point source_length、固定 segmentation=`nonempty-lines-cp-v1`、revision、完整段落 marks；只存 Read/Revisit，缺记录即 Unmarked。不写 memo／attributes，不依赖能力块。
- `reading-mark` 接受明确 set-status、源身份、完整范围、expected_revision 和32位请求 ID。SQLite `BEGIN IMMEDIATE` 原子写入；重复请求返回当前权威状态，重复同状态不增加事件／revision／快照；冲突409。审计记录 before／after、准确坐标、请求 ID／revision 和服务端按钮动作时间，不复制原句。
- 首次明确写入旧格式前，检查一份**原持久化旧 JSON**恢复点（测试使用 v4），失败不改库；普通研究编辑也经过这一门槛。不是先迁移到 v5 再把它称作 v4 备份。
- **阅读单独保存即时入库，不轮转30份研究编辑快照；下一次研究编辑快照才包含这些标记。现在导出 JSON 可独立保留。** 首次升级／失效标记 reset 的必要恢复点是例外。31次阅读标记只产生1份升级前恢复点；既有普通研究编辑快照行为保留。
- JSON／快照恢复保留其时刻的标记，生成新项目 ID，不覆盖原项目；旧快照不会从当前项目混入后来标记。v5不能被旧版应用读取，不提供降级导出；详情与导出窗口均说明格式和快照规则。
- 合法但绑定旧原文的元数据保留且失效，显示 Needs recheck；确认 reset 并检查恢复点后重新绑定。坏 SHA、重复／重叠／部分段落、布尔／浮点端点、未知状态／版本及越界原子拒绝。最多50,000条／项目；完整 UTF-8 JSON≤19,000,000 bytes，审计≤100,000；无截断。恢复追加审计后再检查容量；无效快照先拒绝，不额外生成快照。
- Coding CSV 原8列、matrix、统计、五类图、报告不变；Methods 仅加独立手动工作流限制及真实审计说明。模型 payload 不带 reading_state，不自动发送请求。

## 验收与原始证据

主目录 `~/qualicraft-review/ux-32a/`；审核包 `~/qualicraft-review/supervisor-review/` 的 `raw/ux-32a/` 镜像原始输出。每条命令的退出码见 `raw/run-index.json`；失败记录保留。

| 项目 | 命令／证据 | 结果 |
| --- | --- | --- |
| 修复前回归 | `python -m unittest discover -s tests -p test_reading_marks.py -v`；`raw/regression-red.txt` | 退出1；v5与新保存接口缺失，6测试收集，1失败／11错误（含子测试） |
| 专用／完整 Python | 上述专用8项；`python -m unittest discover -s tests -v`；`raw/backend-green.txt`、`raw/python-full.txt` | 全量163项，3跳过，退出0；首次全量的旧格式期望／UTF-8遗漏记录在`python-first-full.txt`，修正后原研究内容断言保留 |
| Node 与语法 | `node --test tests/*.test.mjs tools/report/*.test.mjs`；`node --check web/app.js` | 129通过（含7项新状态测试），退出0；初次HTML属性顺序兼容问题输出保留，恢复原选择器顺序后原筛选测试通过 |
| 构建 | `cd website && npm run build`，随后绝对路径 Node 执行 `node_modules/next/dist/bin/next build` | npm缺失127原始输出保留；与package脚本相同的Next生产构建退出0；已有middleware弃用提示未扩大范围修复 |
| 主浏览器 | `python tools/e2e/reading_marks.py --url http://127.0.0.1:4464 --out /tmp/qualicraft-ux32a/acceptance` | 10/10：中性加载、三态／键盘撤销、故障重试、409、迟到响应、390px触摸／文档切换／清localStorage、JSON实际下载／恢复／下一编辑快照、响应式／减少动态、原文失效reset、研究数据／控制台 |
| 手机／键盘 | 同上；320/390/800/801/1120/1440px与600px矮窗口 | 页面无横溢出；390px默认常驻栏134px，标记控件≥44×44；Space保存／Enter撤销，原生select可达，不依赖悬浮或拖拽 |
| 真实故障反馈 | `acceptance/results.json`、`03-save-failure-retry.png`、`04-cross-tab-conflict.png` | 受控503和409的预期网络／控制台错误单列；正常路径JS／控制台／HTTP错误均为0，不将故障场景混称零错误 |
| 兼容与范围 | `compatibility.json`、`scope.json`、`normal-preview.json` | 八分析、两CSV、五图计数／脚本／结果一致，25个图包成员生成；研究数据19/317/874、原Bologna／统计绘图源码／网站报告素材与manifest保持；17个登记预览健康，常用4445及只读演示能读v5 |

浏览器仅启动隔离 Chrome 并访问本项目 origin，不读取已有窗口。手机是触摸仿真；本轮没有替用户复验实体手机／VoiceOver。UTF-8/emoji只出现在明确标示的单元测试边界夹具，实机副本与截图全用 Bologna。历史 `-t .` 收集失败原件保留在 `raw/known-collection-historical-failure.txt`，没有修改测试入口。本轮 Python 3.14 的同命令实际可收集并通过163项（3跳过），见 `collection-current-runtime.txt`；本轮没有改测试入口；入口的历史修正见总体计划中的 UX-09，不把那轮修改算作本轮成果。系统 Python 3.9 的额外诊断在沙箱中因端口权限／依赖等失败（27错误、10跳过），单独保留，不作为本轮通过数。

## UX-31 标准的分轮结论

| 标准 | 32A 本轮结论 |
| --- | --- |
| R01–R05 | 标记部分通过：中性迁移、独立三态、确认后显示、失败／重试、清除／撤销／重复、并发冲突、只读／鉴权；跨上下文使用独立Chrome上下文，不宣称Safari或Windows验证 |
| R06–R09 | 现有段落与原始编码不变；**范围并集／两轨／来源列表／过滤跳转专项留32B**，没有把未实现的概览判为通过 |
| R10 | 改名／研究编辑不丢标记、移除编码不改变标记、同文新文档ID中性；不做旧损坏项目修复 |
| R11–R14 | 完整性／容量、版本恢复、31次标记快照时序、checked upgrade/reset、八分析／CSV／五图与模型payload通过；全量门槛测试覆盖 |
| R15–R17 | 本轮标记栏桌面／手机／键盘／减少动态通过；**概览专项待32B，实体设备和VoiceOver仍为人工门禁** |
| R18 | 全量回归／语法／构建／保护哈希与本地证据完成；不推送／部署，Windows未验证 |

## 当前剩余事项

32B 两轨范围概览与精确列表／跳转仍待授权；其余 W03、用户视觉／supervisor接受、当前新控件的实体设备／VoiceOver与发布门禁保持开放。UX17-01…05既有关闭不变。网站 UX-29 录屏展示该轮界面，未重录本轮新增标记栏／v5下载；新功能以当前工作台和本轮截图验收，不把旧录屏当32A证据。

本轮本地提交完整哈希与最终文件范围见审核包 `COMMITS.md`、`raw/ux-32a/post-commit.json`，避免把提交前的缩写或旧产品哈希当成本轮。正常查看入口：[工作台](http://127.0.0.1:4445/w?lang=en)；可编辑验收副本：[32A QA](http://127.0.0.1:4464/w?lang=en)。后者可见本轮明确操作的项目标记。
