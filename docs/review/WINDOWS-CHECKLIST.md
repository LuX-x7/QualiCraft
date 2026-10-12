# Windows 验证清单（试用前置门禁）

> 本文件是**门禁**，不是背景资料：在它带着原始输出通过之前，"Windows 未测试" 保持有效，
> 试用就绪保持红色。通过与否由总监裁定；本清单只负责让一次 Windows 运行可执行、可判读、可回传。
>
> 状态：**未开始**。macOS 参考值全部来自 2026-10-12 的运行（提交 `66650b2`、`e56d2ba` 等），
> Windows 首跑完成后在此登记日期与结果。

## 0. 环境准备

| 项 | 要求 | 说明 |
|:--|:--|:--|
| Python | ≥ 3.11（`pyproject.toml` 的 `requires-python`） | 用 `python --version` 确认；低于 3.11 直接停 |
| 虚拟环境 | `python -m venv .venv` 然后 `.venv\Scripts\activate` | 不要用系统 Python 直接装包 |
| 依赖 | `pip install -r requirements.txt` | 装的是 matplotlib / pandas / numpy。**裸解释器跑测试会得到 11 个 error、退出码 1**——那是缺依赖的真实失败，不是产品失败 |
| Playwright | `pip install playwright` | e2e 脚本只用它当驱动；**不需要** `playwright install` |
| Chrome | 本机装有 Chrome | 所有 e2e 脚本用 `channel="chrome"` 驱动系统 Chrome（7 个脚本一致，已 grep 核实）；headless 运行不需要显示器 |

可选：Node（只为 `node --check web/app.js` 语法检查）。

从仓库根目录执行所有命令。路径含空格时，在 PowerShell / cmd 里给路径加引号。

## 1. 执行顺序与判读标准

按序执行；**每步都保留原始输出和退出码**（见第 3 节回传方式）。任何一步失败，停下来报告，
不要改脚本去迁就结果——失败是数据。

### 步骤 0 · 单元测试

```sh
python -m unittest discover -s tests
```

判读：退出码 0，末两行与 macOS 参考值一致：

```
Ran 114 tests in ...
OK (skipped=3)
```

三个 skip 是两条本地数据集缺席（Guide / TU Delft 参考项目）加一条绘图栈在位时的自跳；
若 skip 数不同，报告差异，不要当作失败。若出现 `errors=11`，说明第 0 步的依赖没装对，回到环境准备。

### 步骤 1 · smoke.py（十个步骤全流程）

```sh
python tools/e2e/smoke.py
```

判读：退出码 0，末行 `10/10 steps passed`。产物：`%USERPROFILE%\qualicraft-review\e2e\run-<时间戳>\`
内的 `results.json` 与 `S01.png`–`S10.png`。想亲眼看界面可加 `--headless false`（需显示器）。

### 步骤 2 · smoke_mouse.py（真实鼠标拖拽编码）

```sh
python tools/e2e/smoke_mouse.py
```

判读：退出码 0，`7/7 passed`（M0、M1×2、M2、M3、C1、C2 全过）。产物：
`%USERPROFILE%\qualicraft-review\e2e\p2-7\smoke-mouse.json`。M3 证明服务器侧两条 coding 的
quote 与所拖文字一致；C1/C2 是对照（无拖拽的单击、阅读区外的拖拽都不得弹出编码框）。

### 步骤 3 · preset.py（五模块预设）

```sh
python tools/e2e/preset.py
```

判读：退出码 0，`5/5 passed`。此脚本**只写 stdout**，没有产物文件——把控制台输出存成文本回传。

### 步骤 4 · dialogs.py（390px 对话框测量）

```sh
python tools/e2e/dialogs.py
```

判读：退出码 0，并出现三行：

```
  control reported overflow: True
  measured 3 of 4; none of the measured overflows; unreachable: ['Snapshots']
  the measurement can tell when one does not fit
```

产物：`%USERPROFILE%\qualicraft-review\e2e\p2-5\dialogs-390.json`。`unreachable: ['Snapshots']`
是**预期结果**——快照恢复入口按决定只在宽屏提供（docs/NOT_BUILDING.md §6），不是缺陷。

### 可选步骤 5 · projects_a11y.py / control.py

```sh
python tools/e2e/projects_a11y.py
python tools/e2e/control.py
```

`projects_a11y.py` 判读：`controls behaved: True   natural reads sound: True`。
`control.py` 是 S5 的对照实验（同一逻辑对正常版和故意破坏版各跑一遍，必须一 PASS 一 FAIL）。
两者不属于门禁四项，但同属本阶段 e2e 资产，跑了更好。

## 2. Windows 特有注意

- **脚本本身没有平台分支**：`grep -rn "darwin\|platform\|os.name\|/Users" tools/e2e/*.py` 无匹配（已核实）。没有 macOS 专属逻辑需要绕开。
- **默认编码**：Windows 控制台/文件默认 ANSI 代码页，正是 `tests/test_encoding.py` 钉的场景——包内所有读写都显式 `encoding="utf-8"`。步骤 0 的编码测试就是 Windows 上的行为校验。注意该静态扫描只覆盖 `qualicraft/` 与 `tests/`，不含 `tools/`。
- **产物路径**：`~/qualicraft-review/...` 在 Windows 上展开为 `%USERPROFILE%\qualicraft-review\...`。
- **端口**：脚本用 `free_port()` 动态取端口（优先指定值，被占则换随机端口），冲突概率极低；若报端口错误，报告原始输出。
- **退出码获取**：PowerShell 里 `python ... > out.txt 2>&1` 之后用 `echo $LASTEXITCODE`；cmd 里用 `echo %ERRORLEVEL%`。管道到 `Tee-Object` 再取 `$LASTEXITCODE` 在 Windows PowerShell 5.1 下不可靠，不要那样做。
- **`run.ps1` 不要用于门禁**：它硬编码了 `E:\Software\...` 路径（Guide 目录、API key 文件），是本机启动器。要人工看一眼界面，用 `python run.py` 或 `python run_demo.py`，属可选项，不产生回传物。
- **每个脚本 1–3 分钟**，全部跑完约 10 分钟；smoke.py 最慢。

## 3. 回传模板

把下面一段填好回传。原始输出直接贴文本，不要转述、不要截图代替文本：

```
Windows 版本：
Python 版本（python --version）：
Chrome 是否安装及版本：

步骤0 unittest：
  退出码：
  末三行原文：

步骤1 smoke.py：
  退出码：
  末三行原文：

步骤2 smoke_mouse.py：
  退出码：
  末三行原文：

步骤3 preset.py：
  退出码：
  5/5 那行原文：

步骤4 dialogs.py：
  退出码：
  control / measured 两行原文：

（可选）步骤5：
  projects_a11y 退出码与末两行：
  control.py 结论：

产物文件清单（目录名 + 文件名 + 字节数）：
```

## 4. 通过之后

1. 在本文件头部登记：日期、Windows 版本、Python 版本、运行人。
2. 在 `docs/review/PHASE-2-BACKLOG.md` 的"Windows 门禁"节把状态改为 closed，引用本文件的提交。
3. README 若新增"已在 Windows 验证（版本/日期）"一句。注意 `tests/test_encoding.py` 里
   "Windows itself has not been tested" 那句说的是**该文件的覆盖范围**（行为校验要在这里跑过才算），
   与本清单是两件事：清单通过后那句可改为"Windows 已验证一次，见 docs/review/WINDOWS-CHECKLIST.md"，
   但不是删掉了事。
4. 推送授权与试用开放仍由总监决定；本清单通过只是把这个决定变成可能。
