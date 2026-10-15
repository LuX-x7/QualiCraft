<!-- 最新体验轮入口；下文历史交接保留。 -->
> 2026-10-15 更新：UX-02B 已完成关系图直接入口、完整证据、准确定位与返回；[验收](UX-02B-NETWORK-EVIDENCE.md)。用户要求周末前完成已规划体验项供 supervisor 审核，Windows 明确允许暂缓；当前状态、目标时间和验收门槛统一见[总体计划](EXPERIENCE-ROADMAP.md)。仍不推送、不部署。

# 移交说明：接手这个仓库要先读的东西

> **2026-10-15 更新入口**：当前体验工作的状态、已完成提交和后续验收统一维护在
> [EXPERIENCE-ROADMAP.md](EXPERIENCE-ROADMAP.md)。本轮
> [UX-01 走查](UX-01-WALKTHROUGH.md)与[三端蓝图](UX-01-BLUEPRINT.md)仅为审查和方案，
> 没有功能修改。下文保留 T7-08 交接时的历史快照；其中“录屏未接入”等旧待办已被
> T7-10 / T7-11 完成，不能当成当前状态。报告读值进展见 T7-12。

> 写给下一个执行者（Codex 或任何人）。此前的工作在一个 AI 会话里完成，
> 会话结束后**只有落在 git 里的东西能留下**——本文件就是为此写的。
> 读的顺序：本文件 → `docs/review/PHASE-2-BACKLOG.md` → `docs/review/T7-BRIEF.md`
> → `docs/review/WINDOWS-CHECKLIST.md` → `docs/NOT_BUILDING.md`。

## 1. 当前状态（交接时的事实）

| 项 | 值 |
|:--|:--|
| 分支 | `t7-site`（**未推送**，`main` 也未推送） |
| 工作树 | 干净 |
| 最后一次提交 | `c1e0fc8 T7-07: the motion spec, measured frame by frame` |
| 构建 | `npm run build` 退出码 0 |
| 验收 | 两宽度 4 页面全绿（见 `~/qualicraft-review/site-t7/acceptance.txt`） |
| 动效 | 四项全 PASS（见 `~/qualicraft-review/motion/table-latest.txt`） |

T6+T7 的网站改版已完成并验收。**没有推送、没有部署**——这是任务单的要求，
不是疏忽。是否推送、是否部署，由总监决定。

## 2. 环境准备（新机器或新会话）

```bash
# Python：三个工具需要 numpy / Pillow / playwright（matplotlib/pandas 已在 requirements）
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
pip install pillow playwright
playwright install chrome        # 脚本用 channel="chrome"，需要本机 Chrome

# Node：网站
cd website && npm install
```

`requirements.txt` 目前只列 matplotlib / pandas / numpy；**Pillow 与 playwright
是后加的两个工具引入的新依赖**（本文件写入时已补进 requirements.txt）。

## 3. 怎么跑（每条都验证过）

```bash
# 网站（生产构建 + 服务）
cd website && npm run build
PORT=4425 HOST=127.0.0.1 node start.js &      # 端口随意，只要不和别的冲突

# 工作台（/w 代理的目标；不跑它 /w 会 502，其余页面照常）
python run_demo.py                            # 监听 8765，与网站默认代理一致

# 验收（截图 + overflow + 控制台 + 键盘 + manifest 哈希 + 禁用词）
python tools/site/acceptance.py --url http://127.0.0.1:4425 --out ~/qualicraft-review/site-t7

# 动效逐帧测量（CDP 录屏；四项对照表）
python tools/motion/measure.py --url http://127.0.0.1:4425

# 资产再生成（改了语料或绘图代码时）
python tools/report/build_assets.py           # /report 的图 + CSV + manifest.json
python tools/site/build_data_cards.py         # 数据卡片（读 qualicraft/datasets.py）
python tools/site/prepare_fonts.py            # 字体从上游重取（需联网）
```

## 4. 已经做完的（T6+T7）

| 工作流 | 提交 | 内容 |
|:--|:--|:--|
| T7-01 | `41d1d2c` | 设计系统（`website/app/t7.css`）+ 自托管子集化字体（Source Serif 4 / JetBrains Mono，各带 OFL） |
| T7-02 | `f88ce8d` | `tools/report/build_assets.py`：报告资产走工作台自己的导出路径 |
| T7-03 | `11ae432` `6e854a9` `6b1c421` | `website/lib/site/` 静态内容模块 + 首页六区块 + /about；前台不再引用内核；[slug] 路由删除 |
| T7-04 | `ebba578` | 五模块演示区（sticky + IntersectionObserver + 键盘 + reduced-motion + clip pending 占位框） |
| T7-05 | `10fc4b6` | `/report` 页；`verifyManifest()` 接线（哈希不符即拒出图） |
| T7-06 | `96a44e4` `535debc` | qt-seed:341 句子替换；删 admin（32 文件）/内核/旧组件/globals.css + pglite/pg 依赖；README 重写 |
| T7-07 | `7da89cf` `c1e0fc8` | `tools/motion/measure.py` 逐帧测量；修两处真 bug（标志动画丢失、指示器定位错） |
| T7-08 | `acb9e1d` | `tools/site/acceptance.py` 验收；键盘 hold 修复 |

网站现在只有 19 个源文件（`website/app`、`components`、`lib`），路由：
`/[locale]`、`/[locale]/about`、`/[locale]/report`、`/api/health`、`/w/[[...path]]`。

## 5. 没做完的（交接时的真实缺口）

1. **五段演示 WebM 未接入网站**。素材**已经录好并在仓库里**：
   `tools/e2e/recordings/`（`seg1-import` … `seg5-export`，各含 `.webm`
   131–284 KB、`.png` 首帧、`.trace.json`；同目录 `_deprecated/` 下两个标了
   "勿交付"的文件，不要用）。缺的是：确认它们过总监验收标准（无汉字、
   结果可见、无灰罩）→ 复制进 `website/public/clips/` → 在
   `components/site/ModuleWalkthrough.tsx` 的 `CLIPS` 常量里登记（一行一个）。
   注意仓库里**没有录制脚本**：那套流程没有随录制结果一起进来，若要重录需先
   补一个 `tools/e2e/` 下的录制器，否则只能沿用现有五段。
2. **反馈邮箱缺失**。`lib/site/content.ts` 的 `FOOTER.feedback` 故意留空，
   页脚该行不渲染。不得编造地址。
3. **下载按钮仍 disabled**（"Windows check in progress"）。Windows 门禁由人工执行，
   见 `docs/review/WINDOWS-CHECKLIST.md`。门禁通过后按钮需要一个**公开**的落地地址——
   仓库是 private，页面不得链私有仓库。
4. **`metadataBase` 未设**（`website/app/layout.tsx` 只在 `SITE_URL` 存在时设置）。
   没有真实域名，不编造。
5. **`/zh` 重写至英文版**（`website/middleware.ts`）：前台只渲染一份英文文案。
   工作台保留自己的语言开关。这是决定，不是遗漏。

## 6. 必须继续遵守的约束

来自任务单（`T7-BRIEF.md` 有全文）：

- 不推送、不部署、不改 `render.yaml` 的 `autoDeployTrigger`——除非总监明确要求。
- 不改工作台（`qualicraft/`、`web/`）的行为与图表渲染路径。
- 不新增分析功能（词频、AI 主题、全文导出、语义检索一律不做）。
- 不使用真实访谈文本；示例数据只用 Bologna 语料（CC0）。
- 不复制第三方代码/素材/图标/字体/文案。
- 页面文字不得出现 `publication`、`publication-grade`、`publication-ready`、
  `期刊`、`put in a paper`。改完网站文案后跑一次：
  `grep -rniE "publication-grade|publication-ready|publication-oriented|put in a paper|期刊" website/`
  （无输出即退出码 1）。
- 不得声称 Windows 已验证。
- 图注的单位句来自工作台的 `CREDIT` 常量（经 manifest 传递），**网站上不得另写一份**。
- 数据卡片清单来自 `qualicraft/datasets.py`（经 `tools/site/build_data_cards.py` 生成），
  **不得另写一份**。

## 7. 踩过的坑（省你时间）

- **构建后必须重启 `next start`**。`.next` 被替换而进程还持有旧清单时，`/about`
  会报 `Invariant: The client reference manifest for route "/[locale]/about" does not exist`——
  看着像产品 500，其实是陈旧产物。验收前一律重启。
- **`next build` 会留下 `.next-stale-<pid>/`**（被杀掉的构建重命名而来），已加进 `.gitignore`。
- Playwright 脚本用 `channel="chrome"`，headless Chrome **默认不是** reduced-motion；
  要测 reduced-motion 得显式 `reduced_motion="reduce"` 建 context。
- CDP screencast **只在页面有合成变化时出帧**：静态页面前后帧可能隔几百毫秒。
  测量静态页面的过渡时，帧序列会缺中间帧——`tools/motion/measure.py` 的注释写了怎么处理。
- `element.style.top` 返回**目标值**，不是动画中的值；要看 `getComputedStyle` 或 rect。
- 删 CSS 文件前先 grep 组件依赖的类名：QtMark 的动画规则原本在 `globals.css` 里，
  删旧设计系统时静默丢了动画，是动效测量抓出来的。
- 颜色相近时用色相判别：TOC 的 "Contents" 灰（`#6b7280`）在容差内会被当成 accent
  （`#4b607c`），加 `b - g > 15` 才分得开。

## 8. 材料都在哪（原先散落在仓库外，现已归档进仓库）

移交时把散在工作区根目录（仓库的上一级）里的文档与素材全部归档了，位置如下：

| 位置 | 内容 |
|:--|:--|
| `docs/review/` | 评审、方案、规范、排查：`QualiCraft_开发流程规范.md`（提交格式与证据纪律，**接手前应读**）、`QualiCraft-项目全景（供审核）.md`、`QualiCraft-第二轮审核材料.md`、`QualiCraft-网站结构方案.md`、`QualiCraft-界面与工具评审.md`、`QualiCraft_方法论支持评估与设计方案.md`、`QualiCraft_编码工作流差距分析.md`、`QualiCraft_设计理念与下一步方向.md`、`QualiCraft_GitHub权限排查结论.md`、`QualiCraft_推送指引与PR描述.md`、`QualiCraft_全流程操作走查.html` |
| `docs/review/deliveries/` | 交付报告与原始输出附录（T1–T6 各版本） |
| `docs/review/prompts/` | 给 Claude 的审核 Prompt（第一、二轮） |
| `docs/patches/` | 早期补丁 Patch1–4 |
| `docs/reference/` | `isc-home-01.png`（旧站首页参考）、`pi.dev/`（版式参考材料） |
| `docs/evidence/` | 评估证据、评审截图、走查截图（117 张，约 20 MB）、运行日志 |
| `tools/e2e/recordings/` | 五段演示录屏（见第 5 节第 1 条） |
| 仓库根 | `启动QualiCraft.sh`、`启动公开演示.sh`（macOS 一键启停，与 `run.ps1` 对应） |

**刻意没有搬进来的**（都有理由，不要随手加进来）：

- `../Guide/` — 第三方已发表访谈材料（Tian 2021、TU Delft）。它是外部研究素材，
  有许可问题，且任务单规定仓库里不使用真实访谈文本。需要时按 `run.py --guide-dir` 指过去。
- `../data/qualicraft.sqlite3` — 本地运行状态，`.gitignore` 按设计忽略 `*.sqlite3`。
- `../.tmp_ref/` — 早期临时图与对照脚本（4.2 MB），已被 `tools/report/build_assets.py` 取代。
- `../.workbuddy-ai/` — 上一个 AI 会话的本地记忆与运行时，与项目无关。

仓库外的验收证据（按任务单要求**不进仓库**）：

- `~/qualicraft-review/site-t7/` — 17 张截图 + `acceptance.txt`
- `~/qualicraft-review/motion/` — 录屏帧 + `measurements.json` + `table-latest.txt`

## 9. 不要带过去的东西

- 工作区的 `../.workbuddy-ai/`（AI 会话的本地记忆与运行时）。它与仓库无关，
  **不要**复制进仓库；仓库内确认无任何 WorkBuddy 路径引用（已 grep 核对）。
- 上面那份本地记忆里的事实表**不是证据**：它只是"先查表"的提醒，断言仍须来自
  运行或当次源码阅读。

## 10. 待总监决定（最多三条）

1. 下载按钮通过 Windows 门禁后的**公开落地地址**（无公开发布物）。
2. 站点**正式域名**（用于 `metadataBase` 与分享预览）。
3. **反馈邮箱**，以及是否接受"`/zh` 重写至英文版"这一前台单语言决定。
