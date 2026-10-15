# UX-02C · 关系图操作与数量说明

2026-10-15。基线 `54ab1e6ac8f7363a4b09499d5827be18c41ee877`。用户授权按总体计划实施；本轮关闭 UX-01-04/05。Windows 继续暂缓；未推送、未部署。完整提交见 Git 与仓库外 `raw/local-commit.txt`。

## 已实现与范围

- 图外选择器保留，新增 Previous / Next、Show / Hide passage nodes、Clear selection。可通过原生按钮的 Tab / Enter 完成选择、展开、收起、清除，不依赖拖拽或 SVG 小圆点。Escape 清除并把焦点返回 Next；当前完整路径与数量通过 polite live region 提示。手机按钮实测高度均为 44px。加载期间选择控件禁用。
- 每个节点有来源或完整编码路径的原生 SVG title；图外控件、全文证据、原文定位及返回组成替代操作路径。保留现有鼠标节点选择和拖拽。
- 图例使用 **Codings** 表示原有标注关联数量，另列 **Source ranges**（文档 ID + 起止范围去重）。选择状态和证据列表也同时说明两种数量。原句详情列出该同一范围上的全部保存编码路径；同一句两码清楚显示为“一处范围、两条标注”。不更改任何频次、共现或其他统计。
- `prefers-reduced-motion: reduce` 时在不呈现运动帧的情况下计算现有布局；偏好运行中改变时停止动画帧。此分支由回归验证，没有为测试读取其他窗口或改变系统设置。浏览器未模拟该系统偏好，不能声称做过此项浏览器实测。

仅改 `web/app.js`、`web/style.css`、前端回归和审查文档；Python 分析、core、server、绘图路径、示例数据、网站和部署配置均未改。

## 验收

证据：`~/qualicraft-review/ux-02c/`，截图在 `screenshots/`，不入 Git。

| 检查 | 结果与原始输出 |
| --- | --- |
| 初次回归 `node --test tests/network_evidence.test.mjs` | 原有 12 项通过，新增 6 项失败；`raw/frontend-before.txt`，退出 1 |
| 修复后网络 18 项 + 主题筛选 9 项 | 27/27；`raw/frontend-final.txt`，退出 0 |
| `python -m unittest discover -s tests -v` | 134 项，跳过 3，其余通过；`raw/backend-full.txt`，退出 0 |
| `node --check web/app.js` | `raw/syntax.txt`，退出 0 |
| 数据对照 | 三个项目 JSON、审计与快照数、15 份计数 CSV 哈希完全一致；883 条来源引用准确，图数据/连线未变；`raw/data-baseline.txt`、`raw/data-after.txt`，退出 0 |
| UI | 12 条有编号观察，`screenshots/observations.json`；桌面与 390 × 844 无页面横向溢出；Enter 选择主题/编码、收起再展开、证据定位/返回和 Escape 焦点通过 |
| 手机 | 4 个图外按钮均高 44px；鼠标点击和键盘路径可用，不冒充真机触摸 |
| 控制台 | `screenshots/console.json` 为 `[]`，本轮 warn/error 为空 |
| 范围、格式、本地提交 | `raw/scope.txt`、`raw/local-commit.txt`，退出 0 |

既有 `unittest ... -t .` 收集失败保留于 UX-02B 的 `raw/known-collection-failure.txt`；本轮未修改入口。网站未改，未重跑 Next 构建。Windows、屏幕阅读器、物理触屏未验证。

主要截图：`C10-final-desktop.jpg`（同一范围两条标注的完整路径）；`C12-final-mobile.jpg`（图外按钮、当前选择与手机布局）；`C09-mobile-source-units.jpg`（手机原句详情）。C01…C09 是暂停前本项目标签页的观察，C10…C12 是用户授权继续后最终脚本复核。暂停时误取的无关前台窗口不在任何验收材料中；恢复后只操作项目标签页。

## 下一步

2D 校正默认能力块、五个工作步骤的命名和方法记录的时间措辞；随后 3A/3B 首页精简与模块统一，4A/4B 报告读值与例证，5 视觉与集成。状态统一见[总体计划](EXPERIENCE-ROADMAP.md)。
