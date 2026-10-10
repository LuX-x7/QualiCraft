<h1 align="center">QualiCraft</h1>

<p align="center">
  <strong>A modular, local-first workbench for qualitative coding and figures.</strong><br>
  Interview studies, open-ended responses, thematic analysis — with the whole
  record of how you got there.
</p>

<p align="center">
  <a href="#english"><strong>English</strong></a>
  ·
  <a href="#中文"><strong>中文</strong></a>
</p>

<p align="center"><em>English first · 中文在下半部分</em></p>

---

<a id="english"></a>

# English

QualiCraft is a small workbench for interview and open-ended response work. You
read a transcript, mark the passages that matter, build a codebook, group it
into themes — and every step stays on your machine and in the record.

It is built around one conviction: **the researcher decides**. A model may
suggest, but nothing enters the codebook until a person accepts it.

## The five modules

The work is split into five modules. They are bricks, not a pipeline — you take
the ones you need and skip the rest. Nothing forces you through a step you do
not want.

| # | Module | What it does |
|:--|:--|:--|
| 1 | **Ingest** | Bring transcripts in, or read another tool's coding export whole. |
| 2 | **Coding** | Select a passage, name a code, write a memo. The codebook nests to any depth. |
| 3 | **Analyse** | Frequency, coverage, co-occurrence, accumulation — and a relationship map. |
| 4 | **Plot** | Five publication-grade figures, with the parameters beside the preview. |
| 5 | **Export** | Project JSON, CSV or matrix, a methods narrative, and a figure bundle. |

## What makes it different

**Local first.** Transcripts, codings, memos and the audit trail live in a SQLite
file on this machine. No account, no upload, no telemetry. Cloud model calls
happen only when you configure an endpoint and press the button.

**A record, not a log.** Every action is an event: what changed, when, and who
accepted it. Pending suggestions are excluded from every count until you accept
them, so a number you read is never a number the model produced on its own.

**The counting rule is on the figure.** Each figure states its unit. Frequency
counts coding rows, never participants — a distinction that quietly ruins a lot
of qualitative reporting.

**The preview is the export.** Figures are drawn by a Python script on the
server, not in the browser. What you see is what the exported script produces,
because it *is* the exported script. SVG and PDF output is byte-reproducible:
no random element ids, no wall-clock stamp.

## The relationship map

The newest piece, and the one that shows something a codebook cannot.

A force-directed graph of the whole study, shaped like a citation map:

- **Themes** are the largest nodes — the theme carrying the most material is the
  biggest ball on screen.
- **Codes** come next, sized by how often they were used.
- **Coded passages** are the smallest, hidden until you open a code, because
  several hundred at once is noise rather than information.

Two kinds of edge, and the second is the point:

- **Hierarchy edges** repeat what the codebook already says.
- **Dashed co-occurrence edges** join codes whose spans actually overlap in one
  interview. **The codebook records none of that.** On the Bologna corpus that
  is 285 edges across 8 themes — relationships a flat codebook hides.

Click a theme to isolate its family; everything more than one hop away fades.
Click a code to open its passages. Drag to rearrange.

## Reading another tool's export

You do not have to start from nothing. Drop in another tool's export and
QualiCraft reads it into a new project — transcripts, codebook and codings:

| Format | Importer |
|:--|:--|
| QualCoder `.qda` (zipped) | `from_qualcoder_qda` |
| OpenQDA passage-code CSV | `from_openqda_csv` |
| NVivo coding summary CSV | `from_nvivo_csv` |
| ATLAS.ti frequency report XLSX | `from_atlas_report` |
| FAIRqual codebook XLSX | `from_fairqual_codebook` |

The importer is chosen from the file itself, by matching header signatures —
you do not have to know that OpenQDA and NVivo both emit CSV.

## The five public datasets

Downloaded once, verified by SHA-256, with licence metadata travelling
alongside so a figure's credit line cannot drift from its source.

| | Dataset | What it holds |
|:--|:--|:--|
| A | OpenQDA passage-code export | 837 coding rows, no transcript |
| **B** | **Bologna · "what is data?"** | **19 real transcripts, 3-level codebook, 903 codings — the only set with source text** |
| C | TU Delft NVivo export | 1,008 rows, 2 levels |
| D | ATLAS.ti interview analysis | 43 theme sheets, a frequency report |
| E | FAIRqual workshop codebook | 48 rows, category / subcategory / code |

Dataset B carries the usability work: it is the only set whose character
offsets can be verified against real text, so it is what the walkthrough is
built on.

## Getting started

The application uses the Python standard library. Python 3.11 or newer is
recommended.

```sh
python run.py --open
# or
python -m qualicraft.server --port 8765
```

Then open <http://127.0.0.1:8765>. The first launch creates a fictional
demonstration project under `data/`. No network call is made at startup.

Plotting needs three packages; nothing else does:

```sh
pip install matplotlib pandas numpy
```

To use a cloud model, either configure it in **Model settings** or set
environment variables before launch:

```sh
export QUALICRAFT_API_BASE="https://dashscope.aliyuncs.com/compatible-mode/v1"
export QUALICRAFT_MODEL="qwen3.8-flash"
export QUALICRAFT_API_KEY_FILE="/path/to/API_key.txt"
python run.py --open
```

The API key is read into server memory only. It is never placed in a project,
browser storage, request preview, audit entry, or export. Do not commit
`API_key.txt`.

The first model request is deliberately gated: the UI shows the exact text,
context, codebook, endpoint and model, and asks for confirmation. Use
de-identified material and follow your institution's ethics and data-processing
requirements before sending any real participant data to a cloud provider.

## Tests

```sh
python -m unittest discover -s tests      # 79 tests
node --check web/app.js
```

The tests cover Unicode offsets, CRLF text, overlapping codes, CSV formula
injection, SQLite transaction rollback, request authentication, quote
validation, project restore, and an OpenAI-compatible fake model server. The
importers are tested against the real datasets, which is where most of the
surprises came from.

## Project layout

```
qualicraft/      the library — core, ingest, analyze, plotting, ai, evaluate, server
web/             the workbench interface (plain JavaScript, no build step)
website/         the marketing site (Next.js)
tests/           79 tests, including the importers against the real datasets
docs/            design contract, testing log, usability walkthrough
examples/        five reference figures, each with data CSV and script
tools/           scenario runner, example generator, smoke test
```

## Documentation

| Document | What it covers |
|:--|:--|
| `docs/DESIGN.md` | The module contract — what each layer may and may not do |
| `docs/TESTING.md` | Five scenarios run end to end against real data |
| `docs/WALKTHROUGH.md` | A usability walkthrough in the running interface |
| `docs/ARCHITECTURE.md` | How the pieces fit together |
| `docs/NOT_BUILDING.md` | What this deliberately is not |

## Security boundaries

The local server binds to `127.0.0.1`, uses a per-process session token,
rejects cross-site requests, does not log transcript content, and keeps model
calls explicit. These protections suit a local prototype, **not** a process
open to the public internet.

Do not deploy the current server as a public website with real data. A hosted
edition needs a real identity provider, encrypted per-user storage, CSRF and
session management, rate limits, provider key handling, audit retention,
deletion and export workflows, backups, and a reviewed GDPR/ethics process.
GitHub Pages can host documentation or a static demo, but it cannot safely run
this Python backend or store private research projects.

## Scope

This is a research tool, not a hosted multi-user service, not a clinical
decision aid, and not a replacement for methodological judgment. It does not
turn inter-rater agreement into a quality score, and it does not decide themes
for you.

---

<a id="中文"></a>

# 中文

QualiCraft 是一个用于访谈与开放式作答的小型工作台。你读转录、标出重要的段落、
建立编码本、把它归成主题——整个过程留在本机，也留在记录里。

它建立在一条信念上：**研究者做决定**。模型可以建议，但未经人确认，任何东西
都不会进入编码本。

## 五个模块

工作被拆成五个模块。它们是积木，不是流水线——需要哪个就用哪个，不想用的可以跳过，
没有任何环节会强迫你走完某一步。

| # | 模块 | 做什么 |
|:--|:--|:--|
| 1 | **导入 ingest** | 读入转录，或整份读取其他工具的编码导出 |
| 2 | **编码 coding** | 选中段落、命名编码、写备忘录；编码本可嵌套到任意深度 |
| 3 | **分析 analyze** | 频次、覆盖、共现、累计，以及一张关系网图 |
| 4 | **绘图 plot** | 五类期刊级图表，参数就在预览旁边 |
| 5 | **导出 export** | 项目 JSON、CSV 或矩阵、方法学叙述，以及图包 |

## 它不一样的地方

**本地优先。** 转录、编码、备忘录、审计记录全存在一个本机 SQLite 文件里。
没有账号、没有上传、没有遥测。云端模型调用只在你配置了接入点并按下按钮之后发生。

**是记录，不是日志。** 每一个动作都是一条事件：改了什么、什么时候、谁接受的。
**待审核的建议不计入任何统计**，所以你看到的数字永远不会是模型自己造出来的。

**计数单位写在图上。** 每张图都标明自己的口径。频次统计的是编码行数，不是受访者
人数——这个区别被含糊掉，会毁掉不少质性研究报告。

**预览就是导出。** 图由服务端的一段 Python 脚本绘制，不是在浏览器里画的。
你看到的就是导出脚本的输出，因为**它就是**那段脚本。SVG 与 PDF 输出可逐字节
复现：没有随机元素 id，没有时间戳。

## 关系网图

最新的一块，也是唯一能显示"编码本说不出来的东西"的一块。

一张力导向图，形态参考引文网络：

- **主题** 是最大的节点——承载材料最多的主题就是屏幕上最大的球
- **编码** 次之，按使用次数定大小
- **被编码的文本片段** 最小，默认隐藏，点开编码才展开——几百个同时出现是噪声而非信息

两种边，第二种才是重点：

- **层级边** 只是把编码本重画一遍
- **虚线共现边** 连接在同一份访谈中区间真的重叠的编码。**这些关系编码本一条都没记。**
  在 Bologna 语料上是跨越 8 个主题的 285 条边——扁平编码本藏起来的那些联系

点击主题即隔离它这一支，一跳以外的全部淡出；点击编码展开它的原文；可拖拽重排。

## 读取其他工具的导出

你不必从零开始。把别的工具的导出文件放进来，QualiCraft 会把它读成一个新项目——
转录、编码本和标注一起：

| 格式 | 导入器 |
|:--|:--|
| QualCoder `.qda`（压缩包） | `from_qualcoder_qda` |
| OpenQDA 段落编码 CSV | `from_openqda_csv` |
| NVivo 编码汇总 CSV | `from_nvivo_csv` |
| ATLAS.ti 频次报告 XLSX | `from_atlas_report` |
| FAIRqual 编码本 XLSX | `from_fairqual_codebook` |

导入器由**文件内容**自动选择（匹配表头特征）——你不必知道 OpenQDA 和 NVivo
导出的都是 CSV。

## 五个公开数据集

各下载一次，用 SHA-256 校验，许可信息随数据一起走，所以图的署名行不会与来源脱节。

| | 数据集 | 内容 |
|:--|:--|:--|
| A | OpenQDA 段落编码导出 | 837 条编码行，无原文 |
| **B** | **Bologna · 什么是"数据"** | **19 份真实转录、三级编码本、903 条编码——唯一带原文的** |
| C | 代尔夫特理工 NVivo 导出 | 1008 行，两层层级 |
| D | ATLAS.ti 访谈分析 | 43 个主题表，频次报告 |
| E | FAIRqual 工作坊编码本 | 48 行，类别/子类/编码 |

数据集 B 承载着可用性工作：它是唯一**字符偏移能在真实文本上验证**的集合，
所以走查建立在它上面。

## 开始使用

应用只依赖 Python 标准库，建议 3.11 或更高版本。

```sh
python run.py --open
# 或
python -m qualicraft.server --port 8765
```

然后打开 <http://127.0.0.1:8765>。首次启动会在 `data/` 下创建一个虚构的演示项目。
启动时不会发起任何网络请求。

绘图需要三个包，其余什么都不需要：

```sh
pip install matplotlib pandas numpy
```

要用云端模型，可以在**模型设置**里配置，也可以在启动前设环境变量：

```sh
export QUALICRAFT_API_BASE="https://dashscope.aliyuncs.com/compatible-mode/v1"
export QUALICRAFT_MODEL="qwen3.8-flash"
export QUALICRAFT_API_KEY_FILE="/path/to/API_key.txt"
python run.py --open
```

密钥只被读进服务端内存，不会进入项目、浏览器存储、请求预览、审计条目或导出文件。
**不要提交 `API_key.txt`。**

第一次模型请求是刻意设了闸门的：界面会把将要发送的原文、上下文、编码本、接入点
和模型全部显示出来，要求你明确确认。在把任何真实参与者数据发给云厂商之前，请先做
脱敏，并遵守你所在机构的伦理与数据处理要求。

## 测试

```sh
python -m unittest discover -s tests      # 79 个测试
node --check web/app.js
```

测试覆盖 Unicode 偏移、CRLF 文本、重叠编码、CSV 公式注入、SQLite 事务回滚、
请求鉴权、引文校验、项目恢复，以及一个 OpenAI 兼容的假模型服务。
导入器是**针对真实数据集**测的——大部分意外都是从那儿来的。

## 目录结构

```
qualicraft/     库本体 —— core, ingest, analyze, plotting, ai, evaluate, server
web/            工作台界面（原生 JavaScript，无需构建）
website/        宣传站点（Next.js）
tests/          79 个测试，含针对真实数据集的导入器测试
docs/           设计契约、测试记录、可用性走查
examples/       五张参考图，各带数据 CSV 与脚本
tools/          场景执行器、示例生成器、冒烟测试
```

## 文档

| 文档 | 内容 |
|:--|:--|
| `docs/DESIGN.md` | 模块契约——每一层能做什么、不能做什么 |
| `docs/TESTING.md` | 五个场景在真实数据上端到端跑通的记录 |
| `docs/WALKTHROUGH.md` | 在真实界面上做的可用性走查 |
| `docs/ARCHITECTURE.md` | 各部分如何拼在一起 |
| `docs/NOT_BUILDING.md` | 它刻意不做的事 |

## 安全边界

本地服务端绑定 `127.0.0.1`、使用每进程会话令牌、拒绝跨站请求、不记录转录内容、
模型调用保持显式。这些防护适合本地原型，**不适合**暴露到公网。

**不要把当前服务端连同真实数据一起部署为公开网站。** 一个正经的托管版需要真实的
身份体系、按用户加密的存储、CSRF 与会话管理、速率限制、厂商密钥管理、审计留存、
删除与导出流程、备份，以及经过评审的 GDPR/伦理流程。GitHub Pages 可以托管文档或
静态演示，但它跑不了这个 Python 后端，也不该存私人研究项目。

## 边界

这是一个研究工具，不是托管的多用户服务，不是临床决策辅助，也不能替代方法学判断。
它不会把评分者间一致性算作品质分数，也不会替你决定主题。

---

## Licence and credits

Code is released under the MIT License — see [LICENSE](LICENSE).

The public datasets remain the property of their authors and are used under
their own licences:

- **Bologna interviews** — Gualandi, B.; Pareschi, L.; Peroni, S. (2022),
  *What do we mean by "data" in the arts and humanities?*, Zenodo 6123290,
  CC0 1.0
- **ATLAS.ti interview code analysis** — Wosny, M. (2023), Zenodo 10116088,
  CC BY 4.0
- **FAIRqual workshop codebook** — FAIRqual project, CC BY 4.0

Do not redistribute private interview material or API keys.

<p align="center"><a href="#english">↑ English</a></p>
