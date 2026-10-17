# Phase 2 backlog

2026-10-17 最新（UX-34）：**UX33-02 已修复并本地验收，UX33-01 按用户要求保持开放。** 手机触摸Keep使用当前项目／文档的来源跳转锚点；仅在原文进入正文阅读线时推进，控件滚入视口不再把首段当作新目标。真正触摸滚动阅读后仍能保存新位置；保存使用选定锚点，避免恢复布局再次覆盖。5项新增Node回归修复前3失败、修复后全过；144 Node、163 Python（3跳过）、语法／直接Next生产构建通过，npm缺失127保留。12项专用检查（含1项UX33-01仍存在的范围观察）＋11项原概览＋2项只读／禁用存储均通过；20登记前台健康并逐字节提供当前JS/CSS。只用Bologna临时副本，原19/317/874／审计与常用4445数据库、统计／绘图／CSV／10个报告资产不变；其余168个顶层JS函数及全局事件代码不变。见 [修复、证据与边界](UX-34-KEEP-POSITION.md)。**本轮只关闭02；01、其余W03、用户／supervisor接受、当前实体设备／VoiceOver与发布门禁仍开放。** Windows暂缓且未验证，不推送、不部署；下方旧轮次按历史保留。

后续更新（UX-32B）：双轨概览、精确段落／原句列表、分页和跳转已技术验收，见 [32B](UX-32B-READING-OVERVIEW.md)。位置／手动标记／实际编码继续独立，预览不覆盖Resume，清筛选须明确选择；v5与32A保存／快照规则不变。本文件旧轮次状态按历史保留；实体设备／VoiceOver、其余W03与发布接受仍开放，Windows暂缓，不推送、不部署。

后续更新（UX-32A）：手动项目级 Unmarked／Read／Revisit、保存／撤销、JSON v5 与快照规则已实现并技术验收，见 [32A](UX-32A-READING-MARKS.md)。32B 两轨概览与范围列表仍待做，本文件原方案／旧状态按历史保留；浏览器位置仍独立，不因滚动自动已读。Windows 暂缓，不推送、不部署。

Maintained from the director's rulings. Each item is closed by a commit or by a
recorded decision, never by a note alone.

| # | Item | Owning task | Status |
|:--|:--|:--|:--|
| P2-1 | Co-occurrence empty state explains that the figure needs overlapping ranges | `ad1e5e9` | closed |
| P2-2 | "You can put in a paper" removed from the workbench and README | `e0ba618`, `653ab89` | closed |
| P2-3 | B2: one-click "all five modules" preset | `8ed4202` | closed |
| P2-4 | Codebook count as a hint to expand | `1209a90` + `0f368ba` | closed (wording changed to "show codes", assertion shown to discriminate) |
| P2-5 | Dialog measurement at 390px | `dc18803`: Import, Create and Export measured at 356px, no overflow; control forces 500px and is detected | closed |
| P2-8 | Snapshots has **no visible entry at 390px** | decided in `dc18803`, scope narrowed and aligned in `b305fd4`: desktop-only **for the restore entry only** — the `.save-state` button and the Snapshots dialog it opens; automatic snapshots (written server-side per change) still run on phones — recorded in docs/NOT_BUILDING.md §6 | closed |
| P2-9 | `projects` has two elements with the same `data-action` at 390px, one hidden | `e56d2ba` (`tools/e2e/projects_a11y.py`, `projects-a11y.json` @ `2026-10-12T14:05:48`): the hidden duplicate is `display:none`, not focusable, and **absent from Chromium's AX tree** at both widths; only the visible substitute is exposed. No defect. | closed |
| Correction (P2-9) | The report once claimed "no `aria-hidden` anywhere in the app" | retracted by `d3e2a54`: `grep -rn "aria-hidden" web/ qualicraft/` returns 3 uses, all decorative (`web/landing.html:18`, `web/app.js:64,681`); both projects buttons carry no `aria-hidden` (`aria_hidden: null` in the same JSON), so the hiding is entirely the stylesheet's `display:none`. The verdict above is unaffected — the correction concerns the sentence, not the measurement. | closed |
| P2-7 | `smoke_mouse.py`, real mouse selection | `66650b2` (`tools/e2e/smoke_mouse.py`): a page.mouse drag selects a passage, opens the coding popup, Enter creates a code, and the server stores both codings with the dragged quote (`smoke-mouse.json` @ `2026-10-12T14:18:48`) | closed |
| Close-out | A test that tools/e2e/preset.py exists and imports, so forgetting to run it is noticed | `6a5aebe` | closed |
| Constraint | Every `measure()` action in `tools/e2e/dialogs.py` must exist as `data-action="..."` in `web/app.js`, and its opener must click the same action — enforced by `tests/test_e2e_harness.py` | `129f907` | closed |

---

## T6 (website) — must not be dropped when the redesign starts

**Added 2026-10-11, at the director's instruction. Phase 2 does not touch
`website/`; this item travels with T6 so that it cannot be assumed complete.**

`website/lib/kernel/qt-seed.ts:341` still reads:

```
'Publication figures drawn by an exported Python script, so a co-author can
 re-run them. Needs matplotlib; scipy adds clustering.'
```

"Publication figures" is the same claim that was removed from the workbench
(P2-2), from `README.md`, and from `docs/DESIGN.md`. A journal's requirements
differ from one to the next, so the tool cannot assert that a figure is
publication-ready; what it can assert is that each figure states the unit it
counts.

**The live site does not currently carry this string** — searching the deployed
home page for "publication figures" returns false, while "states what it counts"
returns true. So it is either bound to a page that is not the home page, or was
already superseded in the deployed build. It is uncleaned in the source either
way.

**Action when T6 runs:** replace with wording of the same shape as the fix
already applied elsewhere, and re-run the repository-wide sweep for
`publication-grade|publication-ready|publication-oriented|put in a paper|期刊`
to confirm nothing else survives in `website/`.

---

## Windows 门禁（试用前置，不随 Phase 2 关闭）

清单：`docs/review/WINDOWS-CHECKLIST.md`（建立于 `46f12fc`，现行文本 `680e109`）。必跑四项脚本
（`tools/e2e/smoke.py`、`smoke_mouse.py`、`preset.py`、`dialogs.py`）加
`python -m unittest discover -s tests`，由人在 Windows 机器上执行，附原始输出与退出码回传。

| 项 | 状态 |
|:--|:--|
| Windows 验证（四项脚本 + unittest） | open — 未开始，登记后引用首次运行的日期与版本 |

macOS 参考值（2026-10-12，作对照不作承诺）：unittest `Ran 114 tests` / `OK (skipped=3)`；
smoke.py `10/10 steps passed`；smoke_mouse `7/7 passed`；preset `5/5 passed`；
dialogs 退出码 0、`measured 3 of 4`、`unreachable: ['Snapshots']`、`control reported overflow: True`。

unittest 的 skip 数随机器而变（已在清单步骤 0 核实并写明）：`tests/test_core.py:122,130` 两条
数据集测试只在 `E:/Software/Guide/...` 真实存在时才跑——作者本人的 Windows 机上会真的跑，
预期 `OK (skipped=1)`，FAIL 即 Windows 导入器的真实发现；其他机器 `OK (skipped=3)`。

**顺序**：Windows 结果通过 → 本行改 closed → 总监才决定推送授权与试用开放。

---

## T6+T7 · 网站改版（分支 t7-site，本地）

以 `lib/site/` 静态内容模块重建前台：`/`（六区块首页 + 五模块演示区）、`/report`（Bologna 示例报告）、`/about`；`/w` 工作台代理与 `/api/health` 不动。CMS 内核、admin（32 个文件，以 find 为准）、globals.css 与 PGlite/pg 依赖已全删。数据卡片由 `tools/site/build_data_cards.py` 从 `qualicraft/datasets.py` 生成（哈希不符即拒写）；`/report` 图表由 `tools/report/build_assets.py` 走工作台导出路径生成，页面每次渲染重新校验 manifest 哈希，不符即拒出图。

| 工作流 | 提交 | 内容 |
|:--|:--|:--|
| T7-01 | `41d1d2c` | 设计系统与自托管子集化字体（T7.css + OFL） |
| T7-02 | `f88ce8d` | build_assets.py：报告资产来自工作台导出路径 |
| T7-03 | `11ae432` `6e854a9` `6b1c421` | 静态内容模块 + 首页六区块 + about；前台不再引用内核 |
| T7-04 | `ebba578` | 五模块演示区（sticky + IntersectionObserver + 键盘 + reduced-motion） |
| T7-05 | `10fc4b6` | /report 页 + manifest 哈希校验接线 |
| T7-06 prep | `96a44e4` | qt-seed:341 "Publication figures" 句替换 |
| T7-06 | `535debc` | 删 admin/内核/旧组件/globals.css + db 依赖；README 重写 |
| T7-07 | `7da89cf` | 动效规格 + tools/motion/measure.py 逐帧测量；修两处真 bug |
| T7-08 | `acb9e1d` | tools/site/acceptance.py 验收；键盘 hold 修复 |

- 验收（原始输出在 `~/qualicraft-review/site-t7/acceptance.txt`）：1440 与 390 两宽下四个页面 overflow=+0、console=0、http=0、无禁用词；键盘走查导航/五步骤/报告目录/表格切换全部通过；manifest 哈希校验不拒出图。
- 动效（`~/qualicraft-review/motion/`）：三轮全 PASS——指示器 240ms±(+2/+8)、图淡入 220–238ms、像素标志 1383–1384ms（窗 1200–1500）、首屏地面 0.96–1.00 px/s（参考 0.92，线性 ±0.17px）。
- `grep -rniE "publication-grade|publication-ready|publication-oriented|put in a paper|期刊" website/` 退出码 1、无匹配。
- 未完成：① 五段演示 WebM 未录（占位框 "clip pending"，待 tools/e2e 录屏流程与总监验收：无汉字、结果可见、无灰罩）；② 反馈邮箱缺失（留空，qt-seed 占位符未用）；③ 下载按钮仍 disabled（Windows 门禁未过）；④ metadataBase 未设（无真实域名，未编造）；⑤ /zh 重写至英文版（前台只渲染一份英文文案）。
- 待总监裁决：下载按钮的落地地址（无公开发布物）、站点域名、反馈邮箱。
