# 审查 prompt：让接手者先看一遍，别先改

用法：在仓库目录里跑 `codex`，然后粘这一句——

> 读 `AGENTS.md`，再读 `docs/review/REVIEW-PROMPT.md`，按里面的要求做第一轮审查。
> 这一轮**只审查、不改代码**。

下面是 Codex 要执行的完整要求。

---

## 任务：第一轮审查（只读，不改代码）

你刚接手这个仓库。**先不要修改任何文件、不要提交、不要推送、不要部署。**
你的任务是把项目看明白，然后给出一份**能站得住的评估**。

### 一、先建立事实基础

按顺序读，不要跳：

1. `AGENTS.md` — 硬性约束与证据纪律（**必须遵守**）
2. `docs/review/HANDOFF.md` — 当前状态、已做/未做、怎么跑、踩过的坑
3. `docs/review/T7-BRIEF.md` — 网站改版的任务单与动效规格
4. `docs/review/PHASE-2-BACKLOG.md` — 未完成项与待决问题
5. `docs/review/WINDOWS-CHECKLIST.md` — Windows 门禁（人工执行）
6. `docs/NOT_BUILDING.md` — 四条"不做"的立场
7. `docs/review/QualiCraft_开发流程规范.md` — 提交格式与证据纪律
8. `docs/review/QualiCraft-项目全景（供审核）.md` — 项目全景（**注意：这是旧材料，
   与当前代码不一致处，以代码为准，并把不一致列出来**）

然后看代码本身，至少覆盖：

- 工作台：`qualicraft/`（核心）、`web/`（界面）、`run.py`、`run_demo.py`、`tests/`
- 网站：`website/app`、`website/components`、`website/lib`、`website/app/t7.css`、
  `website/middleware.ts`、`website/next.config.ts`
- 工具：`tools/report/build_assets.py`、`tools/site/build_data_cards.py`、
  `tools/site/acceptance.py`、`tools/motion/measure.py`、`tools/e2e/`
- 文档：`README.md`、`CONTINUE_ON_NEW_COMPUTER.md`（**已知问题：它说仓库是 public，
  实际是 private，确认一下并指出**）

### 二、动手跑（这是评估的硬要求，不能只看代码）

```bash
# 工作台测试
python -m unittest discover -s tests -t .          # 记下收集到的用例数与通过数

# 网站构建与服务（构建后必须重启，见 HANDOFF §7）
cd website && npm run build                        # 记下退出码
PORT=4425 HOST=127.0.0.1 node start.js &
cd ..

# 工作台演示（/w 代理的目标）
python run_demo.py &                               # 监听 8765

# 验收：截图 + overflow + 控制台 + 键盘 + manifest 哈希 + 禁用词
python tools/site/acceptance.py --url http://127.0.0.1:4425 --out ~/qualicraft-review/review-1

# 动效逐帧测量（四项对照表）
python tools/motion/measure.py --url http://127.0.0.1:4425
```

**看截图**：`tools/site/acceptance.py` 写出的 PNG 就是网站的样子，逐张看
（桌面 1440 / 手机 390，首页、五模块区、报告页、about）。
网站的工作台在 `http://127.0.0.1:4425/w`，那是内嵌工具的入口，也看一遍。

缺依赖就按 `HANDOFF.md` §2 装（`requirements.txt` + `playwright install chrome`）。

### 三、给出评估（要具体，要挂证据）

分三部分，每部分都要有**优点、问题、风险**三栏：

1. **项目整体**：结构是否清楚？约束是否被真正遵守（尤其：工作台行为没被改过吗？
   有没有把不该进仓库的东西带进来？）文档与代码是否一致？哪些文档已经过期？
2. **网页（`website/`）**：六区块首页、五模块演示区、`/report`、`/about`。
   设计系统是否统一？动效是否符合 T7 规格（跑 `measure.py`，看对照表，
   有 EXPLAIN 的项要判断是方法误差还是真没达标）？无障碍与响应式有无问题？
   有没有"看起来做了但其实没接上"的地方（例如占位框还在、按钮是 disabled 的）？
3. **内嵌工具（工作台，`qualicraft/` + `web/`，入口 `/w`）**：功能完整度、
   数据路径（导入→编码→分析→绘图→导出）、错误处理、测试覆盖的真实边界
   （哪些路径有测试、哪些没有）、以及它作为"内嵌到网站里的只读演示"是否站得住。

**证据纪律**（来自 `docs/review/QualiCraft_开发流程规范.md`，必须遵守）：

- 每条结论挂在一条命令和它的**原始输出**上；"没找到"同样要证据（命令 + 退出码，
  空输出不算证据）。
- 哈希用完整值。数字（测试数、文件数、行数）要能对上。
- 区分**事实**（你跑出来的）与**推测**（你没验证的），推测必须标注。

### 四、最后给三样东西

1. **十条以内的问题清单**，按严重程度排序，每条注明：现象 / 证据 / 影响 /
   建议动作。找不到十条就少写，不要凑。
2. **你没能验证的东西**（缺环境、缺数据、跑不起来的），以及需要什么才能验证。
3. **下一步建议**：如果只能做三件事，做哪三件。

### 五、边界

- 不改代码、不提交、不推送、不部署。这一轮只出报告。
- 报告直接写在对话里即可；如果内容长，写进 `docs/review/REVIEW-1-<日期>.md`
  并提交（**只提交这一个文件**）。
- 不要为了让指标好看而修改代码或测试。
