# UX-02D · 默认状态与方法记录事实校正

2026-10-15。基线 `da95d4d92faeaf9bb61f19d0d792c7ff0959a655`。本轮关闭 UX-01-06/08。用户授权按总计划继续；只操作本地项目的同一个标签页，未读取其他窗口。Windows 暂缓；未推送、未部署。

## 改动与边界

- 新项目实际默认值保持 hierarchy / memos / ai / insights / audit 开、plotting 关。网站不再将五个工作步骤说成默认关闭的模块；方法对照表如实写明新项目备忘录开启。AI 能力开启不代表发起请求。
- 空项目旧预设“Turn on all five modules”改名为 **Enable figure workflow**，说明实际加入 hierarchy / insights / plotting / audit 并保留其他开关。预设集合和实现不变；英文与中文均校正，旧错误翻译值也已替换。
- 方法记录只说保存了哪些阅读笔记，并写明 **Timing relative to coding is not recorded in this project file.** 没有笔记时只报告文件内未记录；不据此判断熟悉资料阶段是否发生。笔记原文、审计、标注和 schema 不改写。
- `docs/NOT_BUILDING.md` 改成六项真实已实现能力及默认值；将旧交叉表、信度、REFI、转写等明确标为早期提案。四条产品立场保留，旧提案仍可由 Git 历史核查。

## 回归与证据

根目录：`~/qualicraft-review/ux-02d/`。

| 检查 | 结果 / 原始输出 |
| --- | --- |
| 方法时间推断修复前 | 2 项测试共 3 个有效断言失败，包含笔记先写/后写两种顺序；`raw/methods-before-valid.txt`，退出 1 |
| 方法回归修复后 | 2/2；`raw/methods-after.txt`，退出 0 |
| 完整 Python | 136 项，跳过 3，其余通过；`raw/backend-full.txt`，退出 0 |
| 前端与语法 | 27 项回归通过；`raw/frontend.txt`；`raw/syntax.txt`，退出 0 |
| 网站构建 | `npm run build` 退出 0；`raw/build-ready.txt`；构建后已重启服务。既有 middleware 弃用提示保留，未改路由配置 |
| 网站禁用词扫描 | `grep -rniE ... website/` 无匹配，`raw/forbidden-copy.txt`，退出 1 |
| Python 范围 | AST 逐项比对：除 methods_narrative 外，core 全部语句与基线相同；统计、绘图、server、数据卡、manifest 资产、示例库、部署配置均未改；`raw/facts-scope-final.txt`，退出 0 |
| 数据核查 | 原三个 Bologna 临时项目 JSON、审计、快照及 15 份 CSV 未变；仅新增隔离空项目 `UX-02D · defaults check`，用于 UI 默认/预设验收；`raw/data-after.txt`，退出 0 |
| 方法 HTTP | 实际导出不含错误时间判断；内存副本使用已有 Bologna 切片作为笔记验证新措辞，未存回数据库；`raw/bologna-methods.md`、`raw/facts-scope-final.txt` |
| 浏览器 | 新项目真实五开一关、预设增加绘图、1440px/390px 文案与无横向溢出、Enter 切换步骤通过；`screenshots/observations.json` 与 `.dom.txt` |
| 控制台 | 工作台和网站 warn/error 均为 `[]`；`screenshots/console.json` |

主要截图：D01 空项目预设；D02 六项能力的五开一关；D03 预设结果；D04 手机预设；D05/D06 网站桌面与手机的准确工作流说明。

执行中的工具准备失败同样保留：`methods-before.txt` 先因测试错误使用关键字参数而报错，修正调用后才得到有效失败；首次 `build.txt` 因 PATH 无 node 退出 127，随后明确运行时的 `build-ready.txt` 通过；首次 `facts-scope.txt` 对笔记末尾空白的断言未遵守既有 strip 规则，修正核查脚本后 `facts-scope-final.txt` 通过。未为这些准备问题改产品行为。

已知 `-t .` 收集失败沿用 UX-02B 原始记录，不修改入口。Windows、真机触摸和屏幕阅读器未验证。

## 下一步

3A/3B：首页精简、Bologna 原句—编码—主题样板与五模块统一。4A/4B：其余三图 CSV 读值和可追溯例证。5：视觉、响应式和全流程回归。总体状态与周末前目标维护在[总计划](EXPERIENCE-ROADMAP.md)。
