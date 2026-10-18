# UX-61 精确保留冻结项目的JSON恢复

日期：2026-10-18。基线 `2ae89ec8c7f76faf5a59a28611f8dcd7953e1545`，分支 `t7-site`；完整本轮提交见Git与审核包COMMITS.md／ux61-evidence/COMMIT.txt。

## 结论和范围

**UX60-01／P1已修复并通过本轮定向验收。** 上一轮失败的原始Bologna项目JSON无需改写，即可由桌面键盘／手机触摸模拟的正常文件选择入口恢复；再次导出的文件亦可恢复。旧QCA运行／历史、报告11个保留版本、阅读标记、五图资产及原恢复点保持，损坏内容仍被拒绝。项目继续schema v5，冻结格式、哈希算法及原对象形式API保持。

**UX60-02仍开放，本轮不修。** 手机打开Themes & Codes仍将Keep的¶17（11435）改为¶1（0）；定位源码未改，浏览器明确复核了该已知问题。当前人工辅助功能／新增实机路径、F07／F08研究者裁决与用户／supervisor接受仍开放；未重跑整套UX60联合，不能据本轮定向通过宣布整体验收完成。Windows暂缓且未验证，不推送、不部署。

## 修改及理由

浏览器对JSON对象做parse/stringify，会把11.0／1.0／0.0等写成11／1／0，数值相同但旧冻结记录的规范JSON哈希不同。UX60原件有95处转换；错误发生在恢复传输，不是统计计算错误。

- `web/app.js`：恢复文件直接作为原始JSON文本发送，仍检查空文件及20MB大小；其他对象请求继续使用原协议、只读与鉴权规则。成功后沿用原项目列表刷新、关闭对话框、加载新项目的流程。
- `qualicraft/server.py`：新增 `POST /api/projects/restore`，沿用原JSON内容类型／20MB请求／会话令牌／同源／公开只读边界。服务器解析后交给既有 `kind=restore` 分支验证、分配新ID、记录恢复事件并创建已提交快照。旧 `/api/projects` 对象协议保持。
- **没有删除或放宽完整性校验，没有重新给不可信输入计算哈希，没有改统计／绘图或旧冻结文件。** 不执行数据库迁移，不覆盖原项目；保留20MB原始请求上限，避免把原文本嵌成字符串再转义导致边界变化。

## 回归与浏览器验收

| 检查 | 实际结果与原始输出 |
| --- | --- |
| 新增Node 8项 | 修复前4失败／4通过：实际restore-file事件改写数值、原始传输缺失、空文件提示和畸形输入处理被暴露；修复后8/8。`raw/node-red.*`、`raw/node-green.*` |
| 新增Python 7项 | 隔离旧版出现7个失败断言（含subTest；旧对象协议、只读守卫本来可用），无测试入口修改；修复后7/7。`raw/python-red-final.*`、`raw/python-target-final.*` |
| 有效恢复与旧兼容 | 原JSON、重新导出JSON、历史无M1报告各在桌面／手机正常恢复，实际请求体UTF-8字节等于原文件；对documents／codes／annotations／blocks／QCA／report用规范JSON逐字段比较，保留浮点表示和原哈希 |
| 冻结报告与恢复点 | 旧报告全部保留版本可选；M1仍6步、五图仍5资产；真实报告ZIP含同一报告、QCA和原图资产。原项目及原快照文件字节保持，新项目已提交快照可恢复相同内容；旧M1缺省保持缺省 |
| 完整性与边界 | 篡改QCA计数、篡改报告、重算QCA哈希但计算错误、畸形／空／错误格式、鉴权／内容类型、只读拒绝均无新增／覆盖／审计／恢复点变化；20,000,000字节原请求通过，20,000,001申报请求拒绝 |
| 项目Chrome检查10项 | 桌面1440×1000用Enter，手机390×844用tap；正常控制台／HTTP／外部请求0，四次故意篡改各返回400并记录相应控制台，未当作正常错误或静默忽略。`raw/browser.*`、`ui/results.json`；退出0 |
| 完整Python | `python -m unittest discover -s tests -v`：287项，3原有环境跳过，退出0；`raw/python-full.*` |
| 完整Node | `node --test tests/*.test.mjs tools/report/*.test.mjs`：239通过、无跳过／失败，退出0；`raw/node-full.*` |
| 语法 | `node --check web/app.js`退出0，空输出配退出码记录；`raw/syntax.*` |
| 构建 | 本机npm不存在，`raw/npm-build.*`保留127；在独立当前网站源副本，用现有Node执行`node node_modules/next/dist/bin/next build`，退出0，`raw/build.*`。未安装依赖、未改构建配置或旧服务 |
| 范围 | `raw/scope.*`／`scope.json`：139个其余产品／数据／部署路径、110网站构建源全等；server删除新增六行路由块后与基线字节相同。qca／report／plotting／core／读位代码及原图素材保持 |
| 新入口截图 | `raw/review-shots.*`：新审核入口桌面／手机显示完整M1，无项目编辑／pageerror。截图保留，未把它计为10项主检查的新一次完整联合验收 |

本轮Python运行时为3.14；UX60中`-t .`在允许loopback后已收集280并通过，早期环境收集失败和沙盒权限失败均保留。本轮不修改或再次替换测试入口。初期新增HTTP测试的缺令牌GET和大请求在提前拒绝时Broken pipe属于测试写法错误，已修正请求方式；原始`python-red`、`python-green`等中间输出保留，正式红／绿证据分别单列。

所有命令完整argv／cwd／退出码／耗时在外部 `~/qualicraft-review/ux-61/raw/*.command.json`，stdout/stderr与退出码在同名txt／exit。七项Python和八项Node含Bologna既有文本／技术测试标记，没有私有访谈资料。手机为触摸模拟，不冒称实体设备或OS原生文件选择／VoiceOver通过。

## 审核入口、截图与样例

新独立本地入口：http://127.0.0.1:52763/ → Workbench → **Bologna · frozen JSON recovery review**。21文档／317节点／876标注，来自公开Bologna验收副本；旧库与恢复点未重置。此地址只在开发机服务在线时可用。浏览器应打开这个配套的新后端／新JS入口；旧长驻后端需重启并刷新JS后才支持新恢复路由，不把旧进程视为已自动升级。

截图位于 `ux-61/ui/desktop/`、`ux-61/ui/phone/`：

- `01-old-project-restored.png`：上一轮失败原件正常恢复。
- `02-restored-reading-and-coding-tracks.png`：已读状态及编码轨保留。
- `03-all-retained-report-versions.png`、`04-restored-frozen-method-map.png`：旧版本与报告原貌。
- `05-reexport-restored.png`：重新下载JSON后再次恢复。
- `06-tampered-qca-rejected.png`／`06-tampered-report-rejected.png`：拒绝损坏但保留当前项目。
- `07-legacy-project-restored.png`／`08-legacy-map-remains-absent.png`：旧报告不补写流程图。
- `phone/09-UX60-02-remains-open.png`：范围外手机问题仍存在。

`review-shots/desktop-M1-detail.png`与`phone-M1-detail.png`补充完整六步图的实际渲染细节。原始冻结图／CSV／脚本没有重新生成；没有新增Word排版，旧Word／ZIP样例保留。新 `samples/json-recovery/`提供重导出JSON；原 `samples/final-joint/project-json.json`保持原字节，供直接复验修复，不改输入来“通过”。

审核包：`~/qualicraft-review/supervisor-review/`，新归档 `supervisor-review-UX61-update.zip`。旧29个样例文件、最初六个Word／ZIP、UX60失败证据保留；新提交完整哈希、范围、原始输出与ZIP成员SHA256／CRC在包内。正常验证只操作Bologna隔离临时项目，不含真实访谈、实时DB、会话token或凭据；Windows暂缓，不推送、不部署。
