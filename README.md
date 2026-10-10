<h1 align="center">QualiCraft</h1>

<p align="center">
  <strong>A researcher-led workbench for qualitative coding, analysis, and publication-ready figures.</strong><br>
  Local-first by design · English interface by default · 中文可切换
</p>

<p align="center">
  <a href="https://render.com/deploy?repo=https://github.com/LuX-x7/QualiCraft"><img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render" height="32"></a>
</p>

<p align="center">
  <a href="#deploy"><strong>Put it online</strong></a>
  ·
  <a href="https://github.com/LuX-x7/QualiCraft/tree/main/website">Website source</a>
  ·
  <a href="https://github.com/LuX-x7/QualiCraft/tree/main/web">Workbench source</a>
</p>

<p align="center"><em>The button above deploys both the site and a read-only workbench to your own free host, and gives you a public link to share.</em></p>

<p align="center">
  <a href="#english"><strong>English</strong></a>
  ·
  <a href="#中文"><strong>中文</strong></a>
</p>

<p align="center"><em>English first · 中文在下半部分</em></p>

---

<a id="english"></a>

# English

QualiCraft is a modular workbench for interview studies and other open-ended material. Read transcripts, build a hierarchical codebook, review model suggestions, inspect relationships between themes, and produce reproducible figures — while keeping the researcher in control of every interpretation.

**The public links above are for teaching and demonstration.** The workbench link opens a read-only sample built from public, attributed research data. For private research, run QualiCraft locally: the normal application stores projects in a SQLite file on your own machine.

> **Researcher decides.** A model can suggest codes, but no suggestion becomes a coding until a person accepts it. Pending suggestions do not enter counts, figures, or exports.

## Try it

- **[Deploy it online](#deploy)** — one blueprint puts the site and a read-only
  workbench on the internet so someone else can open them in a browser.
- **[Website source](https://github.com/LuX-x7/QualiCraft/tree/main/website)** — English-first overview, with a language switch at the top of the page.
- **[Workbench source](https://github.com/LuX-x7/QualiCraft/tree/main/web)** — the standalone interface and local Python server.
- **[Chinese README](#中文)** — jump to the Chinese translation below.

The hosted workbench is read-only and uses the public Bologna sample; it is not
a place to upload participant material. Use the local installation below for
your own work.

<a id="deploy"></a>

## Putting a demo online

**GitHub alone cannot host this.** GitHub Pages serves static files only, so it
cannot run the Python workbench, its SQLite storage, or the Next.js site. A
shareable link needs a host that runs a process; [Render](https://render.com)
does that on its free plan and deploys straight from this repository.

`render.yaml` in the repository root defines both services, so there is nothing
to configure by hand:

| Service | What it is |
|:--|:--|
| `qualicraft-workbench` | The workbench in read-only public-demo mode, mounted at `/w`. Rejects every write. |
| `qualicraft-website` | The marketing site. Its `/w` path proxies to the workbench, so a reviewer reaches the tool from the site itself. `QUALICRAFT_PUBLIC_SITE=1` also 404s `/admin`. |

To deploy — no fork, no GitHub App, no CLI:

1. Click **[Deploy to Render](https://render.com/deploy?repo=https://github.com/LuX-x7/QualiCraft)**,
   or go to [render.com](https://render.com) and sign in (GitHub or email; the free plan is enough).
2. Render reads `render.yaml` from this public repository and lists both services
   with their build and start commands. Review them.
3. **Apply**. The first build takes a few minutes: dependencies are installed,
   and the site's database seeds itself from the repository on first boot.
4. Copy the two URLs Render gives you — one for the site, one for the workbench.

Because this repository is **public**, Render can deploy it directly: the deploy
link names the repo (`?repo=https://github.com/LuX-x7/QualiCraft`), so being a
collaborator rather than the owner is not a problem. Add `autoDeployTrigger: 'off'`
(already set) if the deployment is for review rather than for every commit.

Notes worth knowing before you share the link:

- The free plan **sleeps after ~15 minutes idle**, so the first visit afterwards
  takes about 30 seconds to wake. Later visits are fast. For a link that never
  sleeps, move to a paid instance or your own server — the repository is the
  same either way.
- To later point the deployment at a different workbench (for instance one on
  your own server), set `QT_WORKBENCH_URL` in the site service's environment to
  its address. No rebuild is needed; the proxy reads it per request.
- The workbench demo is **read-only by construction** (`QUALICRAFT_PUBLIC_DEMO=1`):
  every `POST` is refused before it is parsed, so a shared instance cannot be
  written through. It ships the public, attributed Bologna corpus in
  `demo-data/`, which is the only database exempted from the `*.sqlite3` ignore
  rule in `.gitignore`.
- The site proxies the workbench through a route handler
  (`website/app/w/[[...path]]/route.ts`) rather than a `next.config` rewrite,
  because rewrite destinations are frozen at build time. The handler reads
  `QT_WORKBENCH_URL` per request, so pointing the site at a different workbench
  needs no rebuild; `render.yaml` fills it from the workbench service's host.

### A hosted public instance is not for private data

The public demo runs on loopback-free, read-only terms and ships sample
material. It is the right way to show the interface to a supervisor or a
reviewer. It is **not** the right place for real participant data: a proper
multi-user deployment still needs identity and access management, per-user
encrypted storage, rate limits, session and CSRF controls, backups, deletion
and export workflows, and a reviewed ethics and data-retention process.

## The five modules

These are independent capability blocks, not a mandatory wizard. Enable the modules you need and leave the rest out of the way.

| # | Module | What it does |
|:--|:--|:--|
| 1 | **Ingest** | Add TXT/DOCX transcripts or import an existing coding export. The importer recognises QualCoder `.qda` archives, OpenQDA CSV, NVivo CSV, ATLAS.ti XLSX reports, and FAIRqual XLSX codebooks. |
| 2 | **Coding** | Select source text, apply hierarchical codes, add memos, and keep a provenance trail. Human codings and model suggestions are distinguishable. |
| 3 | **Analyse** | Inspect code frequency, document × code counts, coverage, co-occurrence, accumulation, and the theme–code–passage relationship map. |
| 4 | **Plot** | Render publication-oriented figures from the same tidy analysis table. Adjust grouping, palette, font, clustering, and labels beside the preview. |
| 5 | **Export** | Export the full project JSON, codings CSV, document × code matrix, a methods record, or a figure bundle with CSV, script, SVG, PDF and PNG. |

### The relationship map

The map makes both the codebook and the evidence visible:

- **Themes** are the largest, darkest nodes; size reflects the amount of coded material beneath them.
- **Codes** sit within themes and are sized by use.
- **Coded passages** are the smallest evidence nodes. They are revealed as needed rather than flooding the canvas.
- **Solid hierarchy links** show theme → code structure.
- **Dashed co-occurrence links** connect code spans that overlap in the same interview. Those relationships are not represented by the codebook itself.

Select a theme or code to bring its immediate relationships forward; drag nodes to explore the layout. The map is an exploratory aid, not a measure of theoretical importance: interpret node counts in the context of the research question and sampling design.

### Five figures

The plotting workbench provides:

1. Code frequency
2. Document × code heatmap
3. Code co-occurrence
4. Theme hierarchy
5. Coding accumulation

Every figure states its counting unit. The exported Python script draws the preview as well as the downloaded figure, so the preview and export share one rendering path. SVG/PDF output is configured for reproducible builds.

## Data and import formats

Five public datasets exercise different export shapes and data quality. Files are downloaded once, checked against SHA-256, and accompanied by licence metadata.

| Set | Format | What it contains |
|:--|:--|:--|
| A | OpenQDA passage-code CSV | 837 coding rows; no transcript text. |
| B | QualCoder `.qda` | 19 Bologna interview transcripts, hierarchical codebook and imported coding records; used for the real-text walkthrough. |
| C | NVivo CSV | 1,008 coding rows, with a two-level structure. |
| D | ATLAS.ti XLSX | A frequency report across theme sheets; no source transcript. |
| E | FAIRqual XLSX | A category / subcategory / codebook export. |

Importing a coding table creates a new project and retains the source attribution available in the export. When an export contains no transcript text, QualiCraft does not invent source quotations or character offsets.

## Local installation

Python 3.11 or later is recommended. The core application uses the Python standard library; plotting requires `matplotlib`, `pandas`, and `numpy`.

```sh
git clone https://github.com/LuX-x7/QualiCraft.git
cd QualiCraft
python -m venv .venv
. .venv/bin/activate            # Windows: .venv\Scripts\activate
python -m pip install -e .
python -m pip install matplotlib pandas numpy
python run.py --open
```

The workbench opens at `http://127.0.0.1:8765`. On first launch it creates a fictional demo project in `data/`. No cloud call is made at startup.

To use the standalone frontend without the launcher:

```sh
python -m qualicraft.server --port 8765
```

Project data is stored in a local SQLite database under `data/`; this directory is git-ignored. Back up or export your project before moving machines.

## Optional model suggestions

QualiCraft can call an OpenAI-compatible endpoint after you configure a model and explicitly confirm the request. Example:

```sh
export QUALICRAFT_API_BASE="https://dashscope.aliyuncs.com/compatible-mode/v1"
export QUALICRAFT_MODEL="qwen3.8-flash"
export QUALICRAFT_API_KEY_FILE="/secure/path/API_key.txt"
python run.py --open
```

The API key is read by the server and is not written to project data, browser storage, audit events, previews, or exports. The interface previews the exact text and context to be sent before the first request. Use de-identified material and follow your institution's ethics and data-processing requirements before sending participant data to any provider.

## Tests

```sh
python -m unittest discover -s tests
node --check web/app.js
```

The suite covers Unicode and CRLF offsets, overlapping codings, importers against real datasets, CSV formula injection, SQLite rollback, request authentication and read-only public-demo behavior, project restoration, and the model request/confirmation contract.

## Project layout

```text
qualicraft/      Python library: core, ingest, analyze, plotting, AI, evaluation, server
web/             standalone workbench UI (plain JavaScript; no frontend build step)
website/         English-first marketing site and recorded module walkthrough
 run_demo.py     hosted entrypoint for the read-only public demo
 render.yaml     one-click blueprint for the site + workbench deployment
 demo-data/      the public Bologna corpus the demo opens into
 tests/          unit, integration, importer and HTTP tests
 data/           local project state and downloaded datasets (git-ignored)
 examples/        five reference figure bundles: CSV + Python + SVG/PDF/PNG
docs/            design contract, testing record, usability walkthrough
 tools/           scenario runner, example generator and smoke tests
```

## Documentation

- [`TESTING.md`](TESTING.md) — test commands and scenarios
- [`docs/DESIGN.md`](docs/DESIGN.md) — module boundaries and analysis definitions
- [`docs/WALKTHROUGH.md`](docs/WALKTHROUGH.md) — observations from the running UI
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system structure
- [`docs/NOT_BUILDING.md`](docs/NOT_BUILDING.md) — deliberate non-goals
- [`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md)

## Privacy, security and scope

The ordinary local server binds to loopback (`127.0.0.1`), uses a per-process token, rejects cross-site requests, and does not log transcript content. The hosted teaching demo is deliberately separate: it contains only a public sample corpus and rejects all write requests.

**Do not expose a locally configured workbench containing private research data to the public internet.** A general hosted multi-user service would require identity and access management, per-user encrypted storage, rate limiting, session/CSRF controls, secret management, backups, deletion and export workflows, and a reviewed ethics and data-retention process. Use the published demo only to show the interface to a supervisor; use a local instance for real participant data.

QualiCraft is a research aid, not a clinical decision tool, not a substitute for methodological judgement, and not an automated theme generator. Frequency is descriptive; it is not a standalone measure of importance.

## Licence and dataset credits

The software is released under the [MIT License](LICENSE). Public datasets remain under their own terms; see [`qualicraft/datasets.py`](qualicraft/datasets.py) for source URLs, checksums, attribution and licence metadata. Do not redistribute private interview material or API keys.

---

<a id="中文"></a>

# 中文

<p align="right"><a href="#english">English</a> · <strong>中文</strong></p>

QualiCraft 是一个面向访谈研究和开放式材料的模块化工作台。它支持导入转录、建立层级编码本、审核模型建议、查看主题关系并生成可复现的图表；每一种解释仍由研究者决定。

**上方公开链接用于教学演示。** 工作台链接打开的是只读样例，使用公开且标注来源的研究数据。正式研究请在本机运行 QualiCraft：常规版本把项目存入本机 SQLite 文件。

> **研究者做决定。** 模型可以提出编码建议，但必须由人接受后才会成为正式标注。待审核建议不会计入统计、图表或导出。

## 在线查看

- **[部署到线上](#部署)** —— 一份蓝图把网站和一个只读工作台放到公网，别人用浏览器就能打开。
- **[项目网站源码](https://github.com/LuX-x7/QualiCraft/tree/main/website)** —— 英文为主，页面顶部可切换语言。
- **[工作台源码](https://github.com/LuX-x7/QualiCraft/tree/main/web)** —— 独立界面与本机 Python 服务端。
- **[English README](#english)** —— 跳转至上方英文说明。

在线工作台是只读的，使用 Bologna 公开样例，不适合上传参与者材料。自己的研究请使用下面的本机安装方式。

<a id="部署"></a>

## 把它放到线上

**只靠 GitHub 做不到。** GitHub Pages 只能提供静态文件，跑不了 Python 工作台、它的 SQLite 存储，
也跑不了 Next.js 网站。想要一个可分享的链接，需要能跑进程的托管平台；[Render](https://render.com)
的免费方案可以，并且能直接从本仓库部署。

仓库根目录的 `render.yaml` 已经定义好两个服务，不需要手工配置：

| 服务 | 说明 |
|:--|:--|
| `qualicraft-workbench` | 只读公开演示模式的工作台，挂在 `/w`；拒绝一切写入。 |
| `qualicraft-website` | 宣传网站。它的 `/w` 路径代理到工作台，测评者从网站内部就能进到工具；`QUALICRAFT_PUBLIC_SITE=1` 同时让 `/admin` 返回 404。 |

部署步骤——**不用 Fork，不用装 GitHub App，不用命令行**：

1. 点 **[Deploy to Render](https://render.com/deploy?repo=https://github.com/LuX-x7/QualiCraft)**，
   或打开 [render.com](https://render.com) 登录（GitHub 或邮箱均可，免费方案就够）。
2. Render 会读取这个**公开仓库**里的 `render.yaml`，列出两个服务及其构建/启动命令。核对一下。
3. 点 **Apply**。首次构建需要几分钟：依赖自动安装，网站数据库在首次启动时从仓库植入。
4. 记下 Render 给出的两个网址——网站一个，工作台一个。

因为这个仓库是**公开**的，Render 可以直接部署：部署链接里带了仓库地址
（`?repo=https://github.com/LuX-x7/QualiCraft`），所以"你是协作者而不是仓库所有者"完全不影响。
如果这份部署是给别人评审用、不希望每次提交都自动重新部署，保持 `autoDeployTrigger: 'off'`（已设好）。

分享链接前值得知道：

- 免费方案**闲置约 15 分钟会休眠**，之后第一次访问需要约 30 秒唤醒；之后很快。
  想要永不休眠的链接，升级到付费实例或用你自己的服务器——两种情况用的都是同一个仓库。
- 以后想把网站指向另一个工作台（比如部署在你自己服务器上的那个），
  在网站服务的环境变量里设置 `QT_WORKBENCH_URL` 即可，**不需要重新构建**，代理按请求读取它。
- 工作台演示是**构造上只读**（`QUALICRAFT_PUBLIC_DEMO=1`）：每个 `POST` 在解析之前就被拒绝，
  共享实例无法被写入。它自带公开且有署名的 Bologna 语料（`demo-data/`），这是 `.gitignore`
  中 `*.sqlite3` 规则唯一放行的数据库。
- 网站用**路由处理器**（`website/app/w/[[...path]]/route.ts`）代理工作台，而不是 `next.config`
  的 rewrite——因为 rewrite 的目标在构建时就固化了。处理器按请求读取 `QT_WORKBENCH_URL`，
  所以把网站指向另一个工作台无需重新构建；`render.yaml` 会从工作台服务的主机名自动填入。

### 公开实例不适合放私人数据

公开演示以只读方式运行并自带样例材料，适合向老师或评审展示界面，**不适合放真实参与者数据**。
一个正经的多人部署仍需要身份权限管理、用户隔离加密、限流、会话与 CSRF 控制、备份、
删除和导出流程，以及经过评审的伦理与数据留存规范。

## 五个模块

五个模块是可独立开关的能力积木，不是必须走完的向导；按研究需要启用即可。

| # | 模块 | 功能 |
|:--|:--|:--|
| 1 | **导入** | 添加 TXT/DOCX 转录，或导入已有编码导出。可识别 QualCoder `.qda`、OpenQDA CSV、NVivo CSV、ATLAS.ti XLSX 报表、FAIRqual XLSX 编码本。 |
| 2 | **编码** | 选择原文、应用层级编码、添加备忘录并保留来源记录；人工编码与模型建议可区分。 |
| 3 | **分析** | 查看编码频次、文档 × 编码计数、覆盖、共现、累计趋势，以及主题—编码—文本片段关系网图。 |
| 4 | **绘图** | 基于同一张整洁分析表生成期刊风格图表，可在预览旁调节分组、配色、字号、聚类和标注。 |
| 5 | **导出** | 导出项目 JSON、编码 CSV、文档 × 编码矩阵、方法记录，或包含 CSV、脚本、SVG、PDF、PNG 的图包。 |

### 关系网图

关系图把编码本和证据放在一起：

- **主题**是最大、最深的节点，大小表示其下承载的编码材料量。
- **编码**位于主题之下，按使用量呈现。
- **被编码的文本片段**是最小的证据节点，按需展开，避免画布被大量节点淹没。
- **实线层级边**表示主题 → 编码结构。
- **虚线共现边**连接同一份访谈中区间重叠的编码。这些关系并不会记录在编码本结构里。

点击主题或编码可聚焦其直接关系，拖动节点可探索布局。关系图是探索工具，不是理论重要性的测量；节点数量仍需结合研究问题和抽样设计解释。

### 五类图表

1. 编码频次
2. 文档 × 编码热图
3. 编码共现
4. 主题层级
5. 编码累计趋势

每张图都标明统计单位。预览与导出由同一段 Python 脚本绘制，保证两者使用相同渲染路径；SVG/PDF 输出也针对可复现构建配置。

## 数据集与导入格式

五个公开数据集覆盖不同导出结构与数据质量。文件下载后会按 SHA-256 校验，并随附许可元数据。

| 集 | 格式 | 内容 |
|:--|:--|:--|
| A | OpenQDA 段落编码 CSV | 837 条编码记录，不含转录原文。 |
| B | QualCoder `.qda` | Bologna 19 份访谈转录、层级编码本及编码记录，用于真实文本走查。 |
| C | NVivo CSV | 1008 条编码记录，包含两层结构。 |
| D | ATLAS.ti XLSX | 多主题频次报表，不含原始转录。 |
| E | FAIRqual XLSX | 类别 / 子类别 / 编码本导出。 |

导入编码表会创建一个新项目，并保留导出文件中可用的来源信息。如果文件不含转录原文，QualiCraft 不会虚构引文或字符偏移。

## 本机安装

建议 Python 3.11 或更高版本。核心程序使用 Python 标准库；绘图需要 `matplotlib`、`pandas` 和 `numpy`。

```sh
git clone https://github.com/LuX-x7/QualiCraft.git
cd QualiCraft
python -m venv .venv
. .venv/bin/activate            # Windows: .venv\Scripts\activate
python -m pip install -e .
python -m pip install matplotlib pandas numpy
python run.py --open
```

工作台会打开 `http://127.0.0.1:8765`。首次启动会在 `data/` 下创建虚构演示项目；启动时不会发起云端调用。

也可以不使用启动器，直接运行：

```sh
python -m qualicraft.server --port 8765
```

项目数据保存在 `data/` 下的本机 SQLite 数据库中，该目录已加入 git 忽略。更换设备前请备份或导出项目。

## 可选模型建议

配置 OpenAI 兼容端点后，QualiCraft 可调用模型；发送前需要明确确认。例如：

```sh
export QUALICRAFT_API_BASE="https://dashscope.aliyuncs.com/compatible-mode/v1"
export QUALICRAFT_MODEL="qwen3.8-flash"
export QUALICRAFT_API_KEY_FILE="/secure/path/API_key.txt"
python run.py --open
```

密钥由服务端读取，不写入项目数据、浏览器存储、审计记录、请求预览或导出。首次请求前，界面会预览将发送的原文和上下文。向任何服务商发送参与者材料前，请先脱敏，并遵守机构伦理和数据处理要求。

## 测试

```sh
python -m unittest discover -s tests
node --check web/app.js
```

测试涵盖 Unicode 与 CRLF 偏移、重叠编码、真实数据集导入、CSV 公式注入、SQLite 回滚、请求鉴权与公开演示只读限制、项目恢复，以及模型请求确认流程。

## 目录结构

```text
qualicraft/      Python 库：core、ingest、analyze、plotting、AI、评估、服务端
web/             独立工作台前端（原生 JavaScript，无需构建）
website/         英文优先的宣传网站及模块操作演示
 run_demo.py     只读公开演示的托管入口
 render.yaml     网站 + 工作台一键部署蓝图
 demo-data/      演示启动即打开的 Bologna 公开语料
 tests/          单元、集成、导入及 HTTP 测试
 data/           本地项目状态和下载数据集（git 忽略）
examples/        五套参考图包：CSV + Python + SVG/PDF/PNG
docs/            设计契约、测试记录、可用性走查
tools/           场景执行器、示例生成器、冒烟测试
```

## 文档

- [`TESTING.md`](TESTING.md) —— 测试命令与场景
- [`docs/DESIGN.md`](docs/DESIGN.md) —— 模块边界与分析口径
- [`docs/WALKTHROUGH.md`](docs/WALKTHROUGH.md) —— 真实界面走查
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) —— 系统结构
- [`docs/NOT_BUILDING.md`](docs/NOT_BUILDING.md) —— 明确不做的功能
- [`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md)

## 隐私、安全与范围

普通本机服务只绑定 `127.0.0.1`，使用每进程令牌，拒绝跨站请求，也不记录转录内容。托管教学演示是独立配置：只包含公开样例数据，拒绝所有写入请求。

**不要把含私人研究数据的本地工作台公开到互联网。** 通用多人托管版还需要身份权限管理、用户隔离加密、限流、会话与 CSRF 控制、密钥管理、备份、删除和导出流程，以及经过评审的伦理与数据留存规范。已发布的工作台只用于向老师演示界面；真实参与者数据应保留在本机实例。

QualiCraft 是研究辅助工具，不是临床决策系统，也不能替代方法学判断或自动替你生成主题。频次是描述性统计，不能单独代表理论重要性。

## 许可证与数据集来源

软件采用 [MIT License](LICENSE)。公开数据集各自遵循其许可；来源 URL、校验值、署名和许可元数据见 [`qualicraft/datasets.py`](qualicraft/datasets.py)。不要重新分发私人访谈材料或 API 密钥。

<p align="center"><a href="#english">↑ English</a></p>
