# UX-24 · Coding 层级与原句高亮

2026-10-16。基线 `2a8f065ab10947a7d3246ce883419161cce95a66`。用户明确授权本轮优化工作台 Coding 的 Themes／Codes 树和高亮；此授权仅覆盖相关界面，统计定义、绘图行为、网站／报告与数据资产仍受保护。Windows 暂缓，不推送、不部署。

## 完成范围：T02

- 编码本以真实父 ID 构成嵌套列表和连线，名称换行显示。明确标记 **Theme / group、Parent code、Code、Ungrouped code**；只有实际有子编码的根节点称为主题／分组，不把独立根编码当成已确认主题。
- 搜索显示完整父路径；路径仍同名时追加完整编码 ID。名称、父级关系、颜色和 ID 均不写回更改。计数继续使用原 `codeCounts()`，包括自身及所有后代标注。
- 原句旁也按保存的树组织每条标注，显示准确范围和来源；深层树使用有边界的滚动区，当前路径固定显示，避免短原句被标注列表撑成整屏空白。仅 Coding 在宽屏适当加宽侧栏，其他视图宽度保持原规则。
- 正文以单一轻灰蓝色表示已编码；悬浮或聚焦一条标注时，用同一强调色关联精确原句、编码及全部祖先。重叠标注不混铺多种颜色，保留数量提示、各自的范围入口和逐条完整引用。
- 标注详情展示完整路径、原句与重叠标注列表；“Open in document”清除阻碍定位的文字／编码筛选，聚焦真实来源范围。没有阅读进度或已读状态存储。
- 手机增加 **Themes & codes** 入口，打开同一编码树，支持搜索、折叠、选择与编辑入口；展开和编辑按钮至少 44×44。桌面与手机支持原生 Tab、Enter、Escape，树中还支持上下／左右、Home／End；折叠和筛选保留合理焦点，关闭详情可回到标注。
- 校正相关来源标签：Bologna 的 874 条记录均保存为 `imported`，此前界面兜底误显示 `AI · REVIEWED`；现在显示 `IMPORTED`。只有实际 `ai_reviewed` 才显示 AI 审核标签，原来源字段不变。

本轮没有调整统计、共现定义、绘图参数／生成／查看器、数据格式、导入导出协议、首页／报告视觉、启动状态或阅读记忆功能。

## 数据和范围

只使用新建的 Bologna 临时工作区：本地验收 `4453 → 8853`，无 Guide、无模型密钥。基线项目仍为 **19 文档、317 编码、874 标注**；八个根分组，最深六层。

树、搜索、悬浮、详情与定位全部只读，基线项目 JSON 与初始值相等。真实鼠标编码和正常跨树合并在**另一个恢复的 Bologna 副本**中执行；该副本的新增记录、合并和审计是有意的验收写入，不能描述为整个临时数据库未变化。仓库 `demo-data/qualicraft.sqlite3` 哈希未变；本轮没有向用户原预览副本发送写请求。

频次、覆盖、两种共现、累计、层级、网络和汇总共八项输出逐项相等。32 个关键前端函数源码与基线一致，包含计数、后代筛选、文本选择、编码写入、编辑／合并表单、Insights、全部绘图和原尺寸查看器函数。`qualicraft/`、`website/`、Bologna 模板、报告资产与部署配置无 diff；除获授权的 `web/app.js`、`web/style.css` 外，60 个基线保护文件哈希不变。未重新生成任何图或 CSV。

## 验收与原始证据

目录：`~/qualicraft-review/ux-24/`。命令／退出码见 `raw/run-index.json`；最终截图 `final/screenshots/`，不进 Git。

| 检查 | 结果／原始输出 |
| --- | --- |
| 修复前真实界面 | 无结构列表、无角色标签；当前文档八种原句内联颜色，退出 1；`before/results.json`、`raw/browser-before.txt` |
| 修复前针对性回归 | 初始七项失败；最终九项在完整基线提交源码上重放，9/9 失败，退出 1；`raw/coding-before.txt`、`raw/coding-baseline-replay.txt`。重放没有替换工作区文件 |
| `node --test tests/*.test.mjs tools/report/*.test.mjs` | 91/91，退出 0；`raw/node-accepted-final.txt`。新增九项覆盖树、角色、折叠、同名路径、来源、重叠／Unicode、准确范围及不修改项目 |
| `python -m unittest discover -s tests -v` | 150 tests，3 skipped，退出 0；`raw/python.txt`。初始沙箱不允许 HTTP 用例监听端口的失败保留在 `raw/python-before.txt`，同命令允许本地监听后基线及最终均通过；没有改测试入口 |
| `node --check web/app.js` | 退出 0；`raw/syntax-accepted-final.txt` |
| `python tools/e2e/coding_hierarchy.py --url http://127.0.0.1:4453 --out /tmp/qualicraft-ux24/final` | 11/11，退出 0；`raw/browser-final-accepted.txt`、`final/results.json`。317 个真实树节点及父 ID、六层路径、悬浮、键盘、手机触摸、重叠原句、真实编码和跨树合并均通过 |
| `npm run build` | 环境仍缺 npm，退出 127；`raw/npm-build.txt`。未安装依赖／修改锁文件 |
| website 内 `node node_modules/next/dist/bin/next build` | 生产／TypeScript 构建退出 0；`raw/build.txt`。构建后已重启登记的六个本项目 Next 预览，`raw/restart.txt`；工作台 JS/CSS 由后端直接提供，不被 Next 打包 |
| 范围与数据 | `raw/analysis-after.txt`（八输出／基线 JSON 相等）、`function-scope.json`（32 函数相同）、`scope.json`（60 哈希／保护路径／manifest／文档链接） |

1440×900 桌面、1366×768、390×844 触摸上下文、844×390 横屏及 800/801/1120/1121/1279/1280 等断点覆盖；最终 console/pageerror/HTTP 错误均 0，减少动态效果下功能可用。Chrome 脚本只访问本项目，不读取其他窗口。手机模拟与 CDP／浏览器触摸不等于真机或 VoiceOver 验收。

迭代中保留了手机搜索初始焦点失败、原句断言不当使用 `inner_text` 的空白差异、切换项目后的测试等待不足，以及修改前沙箱权限失败。最终断言核对精确 `textContent` 与保存范围，没有删掉失败检查来获得通过。

主要截图：`01-desktop-tree.png`、`03-desktop-focused-coding.png`、`04-desktop-exact-source.png`、`05-phone-codebook-search.png`、`06-phone-coding-detail.png`、`07-phone-tree-and-coding.png`、`08-phone-full-tree.png`、`11-laptop-coding.png`、`12-desktop-theme-groups.png`。

## 下一步仍单列

T02 的实现和本地技术验收完成，审美与实际使用接受待用户确认。T03 顶部精简、阅读位置记忆／明确已读和 UX17-03 手机文档切换；T01 首次进入／继续工作；T05 可跳过引导；T04 视觉统一及 W03 其余网页细化仍待做。UX17-04 旧录屏、UX17-05 启动健康提示、真机／VoiceOver／系统减少动态效果／下载提示和发布门禁继续开放。Windows 未验证；本轮未推送或部署。
