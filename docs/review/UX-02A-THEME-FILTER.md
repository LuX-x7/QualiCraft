# UX-02A · 主题筛选包含自身与所有后代

2026-10-15，基线 `9d7acd1aa8cb9f827be388443a859e694b829dad`。本轮只关闭 **UX-01-01**。用户明确允许为此修改工作台、补回归与本地提交；其他审查问题没有实施。当前状态已同步到[总体计划](EXPERIENCE-ROADMAP.md)和[原问题清单](UX-01-WALKTHROUGH.md)。

## 行为与实现范围

原先侧栏按主题汇总自身与后代的标注，但 `readerHtml()` 只匹配选中编码自身。现在复用现有 `codeDescendants()`，在每次筛选时建立“自身 + 所有后代”的 ID 集合，再按该集合匹配原文段落。根主题、中间层和叶编码沿用相同规则；同名异 ID 不混入。

只改 `web/app.js::readerHtml()` 的成员判断。没有改变统计定义、侧栏计数、当前文档范围、搜索、标注、高亮、边栏标签、清除/再次点击取消筛选、数据存储、审计、绘图路径或网站。没有数据库迁移；项目仍为 schema v4。

**单位保持原样**：侧栏是全项目标注数；原文区是当前文档命中的段落。同一句赋两码，计数仍为 2，原文段落显示一次，两条标签及高亮都保留。跨文档的主题总数不会被误称为当前屏幕的原句数量。

## 回归测试

新增 `tests/theme_filter.test.mjs`：用 Node 内置 test / VM 执行真实 `web/app.js` 的原文渲染，不另写一份筛选算法；只替代浏览器启动所需的空壳接口并暂停 bootstrap，不启动浏览器或真实请求。测试使用技术标记字符串，不使用其他访谈材料，无新增依赖。

```sh
node --test tests/theme_filter.test.mjs
python -m unittest discover -s tests -v
node --check web/app.js
```

9 项回归覆盖：父级直接标注及后代、父级无直接标注、多层中间编码、同名异树与叶编码、文档/搜索交集、同范围多码和 Unicode 高亮、无筛选/空结果、收起子树、筛选不修改项目或计数。

原始输出在 `~/qualicraft-review/ux-02a/raw/`，记录实际解释器、命令、工作目录与退出码：

| 检查 | 结果 | 原始输出 |
| --- | --- | --- |
| 修复前 9 项回归 | **6 失败、3 通过，退出 1**；直接编码可见，后代被漏掉 | `regression-baseline.txt` |
| 修复后同一组回归 | **9/9，退出 0** | `regression-after.txt` |
| 全部后端单测 | **129 项，OK，跳过 3，退出 0** | `unit.txt` |
| 工作台 JS 语法 | 退出 0 | `node-check.txt` |
| 既有 `-t .` 收集问题 | 仍是 Start directory is not importable，退出 1；没有改测试入口 | `known-collection.txt` |
| 数据与范围核对 | 三项目记录相等、15 份计数 CSV 对照相等，退出 0 | `data-scope-audit.txt` |

Node 回归是独立命令，不包含在 Python 的 129 项数字中。网站未改，本轮未重跑 Next 构建、报告交互或动效验收。

## Bologna 临时副本的界面验收

数据库：`/private/tmp/qualicraft-ux02a/data/qualicraft.sqlite3`。原库通过 SQLite backup 复制，独立准备两个测试项目：一份重放 UX-01 的“父主题无直接标注、两码同句”案例；一份使用 Bologna 的 `interview02.txt` / `interview03.txt`，包含自身、子、孙、兄弟、跨主题同名编码和空主题。测试标签不作为 Bologna 研究结论。

夹具准备是临时数据操作，不冒称 UI 创建流程。本轮筛选、搜索、清除和导航均通过 CUA 的实际控件完成；页面脚本求值只读 DOM，不写页面状态，不调用接口来替代操作。预期结果由临时数据中的父链及字符范围独立核对。

Chrome 桌面自然内容视口 1512×857，手机视口 390×844，共 **23 条 UI 观察**。`browser/checks.json` 保存每次段落起点、高亮、标签、计数、筛选状态与溢出；`browser/keyboard-trail.json` 保存 Tab 到主题按钮的路径；`browser/console.json` 警告/错误为 0。

| 场景 | 验收结果 |
| --- | --- |
| 原问题重放 | 桌面侧栏父主题计数 2；筛选后出现 `[122,193)` 原句所在的一段，两条编码标签保留；手机边栏主题入口得到同一结果 |
| 自身与各层后代 | 根主题在当前文档命中 4 段；中间编码 2 段、叶编码 1 段；与独立预期逐项相等 |
| 同名与空主题 | 另一主题下同名子码只命中另一段；空主题保持空结果，不泄漏其他主题 |
| 多码、搜索、收起 | 搜索与子树取交集；同句两码仍只显示一段、两标签；侧栏收起子树不影响证据范围 |
| 跨文档 | 切换文档沿用原先清空筛选行为；再次选主题仅显示该文档命中的段落 |
| 键盘 | 桌面从搜索框用 Tab 到主题，再 Enter 选择；手机用 Enter 选择边栏主题和 Clear filters，均能完成操作 |
| 手机 | 使用现有原文边栏主题入口；多层后代、搜索、多码和另一主题均核对；所查视图无页面横向溢出 |
| 原始完整 Bologna | 未改动的 19 文档/317 编码/874 标注项目中，主题 `is this data? and what is data?` 总计 103；当前文档 8 条相关标注位于 3 段，实际显示的起点与独立预期相等 |

截图共 **11 张原始 JPEG**，保留同名 DOM 快照；不进仓库：

- `browser/desktop-no-direct.jpg`：原问题修复，侧栏 2 与原句/两条标签同时可见。
- `browser/desktop-root.jpg`、`desktop-child.jpg`、`desktop-keyboard-root.jpg`：根主题、中间层、键盘选择。
- `browser/desktop-search-intersection.jpg`、`desktop-second-document.jpg`：搜索交集、跨文档。
- `browser/phone-no-direct.jpg`、`phone-keyboard-theme.jpg`、`phone-root.jpg`、`phone-overlap-search.jpg`：手机主题入口、键盘、后代与多码。
- `browser/desktop-original-bologna.jpg`：未改标注的完整 Bologna 项目。

数据与统计保护核对：临时库三个项目的文档、编码、标注、备忘、审计等全部字段与 UI 操作前相等；对三个项目分别核对五种图的计数 CSV，共 15 份，字节相等。原始数据库 SHA-256 仍为 `b8b44b814f2fa6286decf877364665ad8276977c08913d02d7b8a90db62a755d`。`qualicraft/`、网站、工具、绘图路径及部署配置相对基线无差异；运行代码的改动仅在上述原文渲染函数内。

## 记录的预检与边界

第一次 Node 夹具换行转义错误，9 项都因夹具语法失败，保留 `regression-before.txt`，**不当成问题复现**。修正夹具后才得到 6 失败/3 通过的有效基线。首次临时数据准备把两个根主题取了同名，被现有规则拒绝；保留 `setup.txt`，第二次改为不同根名、跨主题同名子编码，准备成功在 `setup-final.txt`。两者均未修改产品规则来迁就夹具。

手机验收是浏览器视口，不是物理触屏；屏幕阅读器与 Windows 未验证。原有手机主题按钮触控尺寸、关系图、模块说明与方法记录等问题没有顺带修改。没有推送、部署或改变自动部署配置。
