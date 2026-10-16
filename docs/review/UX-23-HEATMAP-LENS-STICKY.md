# UX-23 · 原图移动放大镜与统一固定演示窗

2026-10-16。基线 `b067981dc6012c517adc182383736d8585e787aa`。按用户要求，只改网站展示：覆盖与共现热图增加可移动放大镜；随后用户指出其他模块的左窗没有固定，本轮一并恢复整个工作流共用的固定左窗。Windows 暂缓，不推送、不部署。

## 完成的结构

- 桌面左窗固定，右侧自然滚动依次切换 Import、Coding、原简洁关系图、新圆点网络、五类图、Export，共十个场景、仍为五个模块。无需点击标题；标题悬浮、点击及键盘导航继续可用。
- 原简洁关系图和圆点网络均保留为独立滚动步骤；切换时组件保持挂载，选择状态保留。未显示的步骤使用原生 `hidden`，不会混入键盘焦点序列。UX-21/22 的独立纵向画板布局按本次最新反馈收回同一固定窗口，没有删除其中的图。
- 手机保留每一步的完整图解；热图按原图→放大区→准确读值排列，避免长标签变化推移正在触摸的原图。图内拖动只移动取景框，图外保持正常页面滚动。窄屏关系图仍保留节点、连线、缩放及平移。
- 窗口内容超出矮屏可见范围时可以在窗内滚动，键盘可到达底部读值、表格及下载入口。

## 放大镜与数据准确性

完整原图上有可移动取景框；桌面左侧直接裁取同一原始 SVG 的区域，并显示完整行列标签及 CSV 数值。两张原图的实际轴标签和裁切矩形从已校验的 SVG 读取，不能假定 CSV 行序就是原图坐标。尤其共现图的轴顺序与旧前端矩阵顺序不同，现已按名称一一核对；无法核对时保留旧计数图及原图，禁用放大入口。

鼠标悬浮无需点击，按住可拖动；放大区内悬浮可读取格子而不移动取景框。方向键逐格移动，Home/End 到角落，Enter/空格冻结悬浮，Escape 恢复；冻结期间键盘和显式拖动仍可用。CSV 下拉选择与放大框联动。保留 Explore counts、Original figure、完整计数表以及 CSV/SVG 下载。

覆盖图 285 行包括明确导出的 0。共现 CSV 只有 16 条导出记录；原图中其他格子即使画了 0 或对角线，也明确显示 **No exported CSV row**，不补造统计值。共现第一组导出值 7 映射到真实原图第 2 列、第 1 行。

工作台、统计定义、数据库、数据卡、Bologna 语料、报告原 SVG/CSV/manifest、录屏及部署配置不变。`/report` 仍为 19 文档/874 编码记录的固定快照，未新增统计或自动更新机制。

## 验收与证据

证据目录：`~/qualicraft-review/ux-23/`。原始输出索引 `raw/run-index.json`；范围核对 `scope.json`。截图不进 Git。

| 命令或检查 | 结果与原始输出 |
| --- | --- |
| 修复前 `before_check.py` | 两张热图均没有原图放大镜，退出 1；`before/results.json`、`raw/before.txt` |
| `node --test tests/*.test.mjs tools/report/*.test.mjs` | 82/82，退出 0；`raw/node-final.txt`。新增五项检查真实 SVG 轴、301 行映射、边界、拒绝错误几何和 XML 标签 |
| `python tools/site/heatmap_acceptance.py --url http://127.0.0.1:4445 --out /tmp/qualicraft-ux23/after-lens` | 7/7，退出 0；`after-lens/results.json`、`raw/lens-accepted.txt`。301 行、真实悬浮、手机触摸、键盘、原图比例、四次实际下载和十个 manifest 文件逐字节核查 |
| `python tools/site/story_acceptance.py --url http://127.0.0.1:4445 --out /tmp/qualicraft-ux23/after-story` | 10/10，退出 0；`after-story/results.json`、`raw/story-accepted.txt`。无点击滚轮依次看到十个步骤，固定窗 top 均为 78px；旧新关系图及全部 594 行原计数读值保留 |
| `npm run build` | 本机仍缺 npm，退出 127；`raw/npm-build.txt`。没有安装依赖或更改锁文件 |
| website 内 `node node_modules/next/dist/bin/next build` | 生产构建、TypeScript 通过，退出 0；`raw/build-final5.txt`。随后重启登记的本项目预览，`raw/restart-final3.txt` |
| 范围、资产、禁用词与文档链接 | 40 个保护文件哈希不变；保护路径无 diff，manifest 十个文件通过；扫描无匹配退出 1；`scope.json`、`raw/scope.txt` |

Chrome 只访问本项目本地网站/报告，不连接或读取其他窗口，不发起工作台操作。桌面 1440×900、矮屏 1366×768、390px 触摸上下文及横屏、1000/1001 等断点、键盘和减少动态效果覆盖。最终 console/pageerror/HTTP 错误均为 0。手机视口和 CDP 触摸不等于实际手机或 VoiceOver 验收。

迭代失败记录保留：新增测试的导入/路径错误、手机 SVG 拖动被原生滚动接管、长读值推移原图，以及一次构建期间旧服务资源清单导致的 500。均未作为通过证据；修复后以重启的生产构建重新验收。既有工作台测试未在此网站轮重跑。

主要截图：`after-lens/cooccurrence-desktop.png`、`coverage-desktop.png`、两张 `*-phone-full.png`、`cooccurrence-laptop-keyboard.png`；`after-story/natural-scroll-*.png` 记录统一固定窗口和所有旧图。

## 仍未完成

W01 的实现和本地技术验收完成，最终审美接受待用户确认。W03 其余视觉细化、工作台 T01–T05（树/高亮、阅读位置/明确已读、首次进入、可跳过引导、视觉统一）、UX17-03/04/05 继续开放。真机、VoiceOver、系统减少动态效果、下载完成提示和发布门禁单列；Windows 暂缓且未验证。本轮没有顺带实施其他功能。
