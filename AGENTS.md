# AGENTS.md — 在这个仓库里工作前先读

QualiCraft：一个本地优先的质性编码工作台（Python + SQLite）+ 英文前台网站
（Next.js，`website/`）。本文件是入口，细节在下列文件里。

## 先读（按顺序）

1. `docs/review/HANDOFF.md` — 当前状态、已做/未做、怎么跑、踩过的坑
2. `docs/review/T7-BRIEF.md` — 任务单原件（含动效规格）
3. `docs/review/PHASE-2-BACKLOG.md` — 未完成项与待决问题
4. `docs/review/WINDOWS-CHECKLIST.md` — Windows 门禁（人工执行，不得声称已验证）
5. `docs/NOT_BUILDING.md` — 四条"不做"的立场与理由（网站文案的来源）

## 硬性约束（违反即停下并报告）

- **不推送、不部署、不改 `render.yaml` 的 `autoDeployTrigger`**，除非用户明确要求。
- **不改工作台（`qualicraft/`、`web/`）的行为与图表渲染路径。**
- **不新增分析功能**（词频、AI 主题、全文导出、语义检索一律不做）。
- **不使用真实访谈文本**；示例数据只用 Bologna 语料（CC0，`demo-data/`）。
- **不复制第三方代码/素材/图标/字体/文案。**
- 网站文字不得出现 `publication` / `publication-grade` / `publication-ready` /
  `期刊` / `put in a paper`。改完文案跑：
  `grep -rniE "publication-grade|publication-ready|publication-oriented|put in a paper|期刊" website/`
- 图注单位句来自工作台 `CREDIT` 常量（经 manifest 传递）；数据卡片来自
  `qualicraft/datasets.py`。**两者都不许在网站上另写一份。**
- 发现真实访谈内容或个人数据 → 立即停止。

## 常用命令

```bash
cd website && npm run build                    # 必须退出码 0
PORT=4425 HOST=127.0.0.1 node start.js &       # 构建后务必重启，否则陈旧清单导致假 500
python run_demo.py                             # /w 代理的目标，监听 8765
python tools/site/acceptance.py --url http://127.0.0.1:4425 --out ~/qualicraft-review/site-t7
python tools/motion/measure.py   --url http://127.0.0.1:4425
python tools/report/build_assets.py            # 报告资产（改了语料或绘图代码时）
python tools/site/build_data_cards.py          # 数据卡片（改了 datasets.py 时）
python -m unittest discover -s tests -t .      # 工作台测试
```

Python 依赖见 `requirements.txt`（含 pillow、playwright；脚本用
`channel="chrome"`，需 `playwright install chrome`）。

## 提交约定

- 一个工作流一笔提交，格式 `<编号>: <简述>`（如 `T7-05: …`），提交信息里写明
  测试名与结果。
- **证据纪律**：每条结论挂在一条命令和它的原始输出上；"没找到"同样需要证据
  （命令 + 退出码，空输出不算证据）。哈希用完整值。报告里的数字必须能对上。
- 验收截图与录屏**不进仓库**，放 `~/qualicraft-review/`。
