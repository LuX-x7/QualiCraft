# QualiCraft · 第二轮审核材料

整理日期：2026-10-11
用途：回应第一轮审核提出的"第二轮需要贴出相关文件内容"的要求
配套文件：`QualiCraft-项目全景（供审核）.md`（已更新，第十三节是改动清单）

---

## 0. 本轮改了什么（一句话版）

第一轮审核把**伦理与数据核查**列为第一优先级，把**数据丢失**列为第二。
这两条都已处理，另外三项（图的单位声明、方法学导出、启动自检）也已实施。
网站重构、拆分 `app.js`、加 ShareAlike 警告——按审核意见**不做**。

---

## 1. 证据一：真实访谈数据不在仓库里

审核要求"检查 git 历史（不只是当前文件）"。以下是可复现的命令与结果。

### 1.1 工作区与跟踪文件

```sh
$ find . -iname "*Interview_Transcript*"
  → 无输出
$ git ls-files | grep -iE "interview|transcript|prostate"
  → 无输出
```

### 1.2 全历史特征词检索

两份访谈的特征词：治疗方式、事件、生活细节。

```sh
$ git log --all -S "brachytherapy"     → 0 条提交
$ git log --all -S "prostatectomy"     → 0 条提交
$ git log --all -S "IAEA ball"         → 0 条提交
$ git log --all -S "camembert"         → 0 条提交
```

### 1.3 历史中是否新增过该类文件名

```sh
$ git log --all --oneline --diff-filter=A -- '*Interview_Transcript*'
  → 无输出
```

### 1.4 随仓库发布的演示库内容

`demo-data/qualicraft.sqlite3` 是唯一被显式放行的数据库（其余 `*.sqlite3` 全部 gitignore）。

```
项目: Bologna · What is data?
文档: 19 | 编码: 317 | 标注: 874
文档名: interview02.txt, interview03.txt, interview04.txt, interview05.txt ...
```

即公开的 Bologna 语料（CC0，Zenodo 6123290）。

### 1.5 放行规则

```gitignore
data/
*.sqlite3
# 托管教学演示要带一份公开且带署名的样例语料，部署后能直接看到真实材料。
# 这是唯一一份可以安全跟踪的数据库。
!demo-data/qualicraft.sqlite3
```

**结论：干净。** 真实访谈稿从未进入工作区、git 历史或被跟踪的文件。
这条检查已写成固定动作，每次发布前重跑。

---

## 2. 证据二：`render.yaml` 全文

```yaml
# Render Blueprint — one-click deploy of the QualiCraft website and its
# read-only teaching workbench.
#
# Deploy it with the button in the README, or by opening:
#   https://render.com/deploy?repo=https://github.com/LuX-x7/QualiCraft
#
# The repository is private. Render's one-click flow needs access to it, so the
# deploy button only works for someone who already has it — it is not a public
# installer, and the README says so. If the repository is ever made public, the
# button starts working for everyone and this comment should change with it.
#
#   • qualicraft-workbench — the read-only workbench demo (Python + SQLite),
#                            mounted at /w to match the site's proxy.
#   • qualicraft-website   — the English-first marketing site (Next.js). Its /w
#                            path proxies to the workbench, so a reviewer
#                            reaches the tool from the site itself.
#
# Both bind the PORT Render injects and listen on 0.0.0.0. The workbench runs in
# public-demo mode: no writes, no uploads, no admin surface.

services:
  - type: web
    runtime: python
    name: qualicraft-workbench
    repo: https://github.com/LuX-x7/QualiCraft
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: python run_demo.py
    # The Blueprint is the source of truth for reviews, not for every push:
    # leaving this off means a commit cannot quietly redeploy a service someone
    # is in the middle of reviewing.
    autoDeployTrigger: 'off'
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0

  - type: web
    runtime: node
    name: qualicraft-website
    repo: https://github.com/LuX-x7/QualiCraft
    rootDir: website
    plan: free
    buildCommand: npm install && npm run build
    startCommand: QUALICRAFT_PUBLIC_SITE=1 node start.js
    autoDeployTrigger: 'off'
    # Probe a path that does not boot the database. The default `/` renders the
    # home page, and on a small instance that is slow enough to miss the probe's
    # timeout — the platform then decides nothing is listening and restarts.
    healthCheckPath: /api/health
    envVars:
      # The workbench's public address, not its `fromService` `host` property.
      # Render resolves that property over its private network, and the
      # hostname it yields is not guaranteed to answer over TLS — which left
      # the site proxying to something it could not reach. The public
      # onrender.com address is the one a browser uses and is verifiable.
      #
      # If the workbench ends up at a different address (Render appends a
      # suffix when a name is taken), change this one value in the dashboard;
      # the proxy reads it per request, so no rebuild is needed.
      - key: QT_WORKBENCH_URL
        value: https://qualicraft-workbench.onrender.com
      # No DATABASE_URL: the site falls back to embedded PGlite seeded from the
      # repository, which needs no external service.
```

> **本轮修正**：原文第 10 行写着"The repository is public"——**这是错的**，仓库是 private。
> 已改为说明私有，并注明按钮只对已有权限的人有效。

**关于 `QT_WORKBENCH_URL`**：它同时写在 blueprint 和 Dashboard 里，
**Dashboard 的值优先且不报错**。这造成过一轮"文件写对了但线上是旧值"的排查，
现在靠启动自检（证据四）暴露，但没有机制强制二者一致——这是已知的薄弱点。

---

## 3. 证据三：备份实现（`qualicraft/core.py`）

```python
# How many snapshots to keep per project. Twenty changes is several sessions of
# work, which is the distance a mistake usually takes to notice.
BACKUP_KEEP = 20


class Store:
    def __init__(self, path, backup_dir=None):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        # Snapshots live beside the database by default. `data/` is ignored by
        # git, so they never end up in the repository.
        self.backup_dir = Path(backup_dir) if backup_dir else self.path.parent / "backups"
        with self.connect() as conn:
            conn.execute("CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, data TEXT NOT NULL)")

    def _snapshot(self, project):
        """Write a restorable copy of the project beside the database.

        The whole project is one row in one SQLite file. That is convenient, and
        it is also a single point of failure: one bad delete and weeks of coding
        are gone, with nothing to go back to. A JSON snapshot per change costs
        almost nothing next to re-coding an interview, and it is written in the
        same format the Restore dialog already reads, so recovery needs no
        special tooling.

        A failure here must never fail the edit the researcher just made, so
        every error is swallowed.
        """
        try:
            folder = self.backup_dir / project["id"]
            folder.mkdir(parents=True, exist_ok=True)
            # To the microsecond: three edits inside the same second are normal
            # while coding, and a second-resolution name would let them overwrite
            # each other. The result still sorts lexicographically.
            stamp = (now().replace("-", "").replace(":", "")
                     .replace("T", "").replace(".", "")[:20])
            (folder / (stamp + ".json")).write_text(
                json.dumps(project, ensure_ascii=False, indent=1), encoding="utf-8")
            keep = sorted(folder.glob("*.json"))
            for stale in keep[:-BACKUP_KEEP]:
                stale.unlink()
        except OSError:
            pass

    def backups(self, project_id):
        """What is on disk for this project, newest first."""
        folder = self.backup_dir / project_id
        if not folder.is_dir():
            return []
        rows = []
        for item in sorted(folder.glob("*.json"), reverse=True):
            try:
                rows.append({"name": item.name, "bytes": item.stat().st_size,
                             "written_at": item.stat().st_mtime})
            except OSError:
                continue
        return rows
```

`create()` 与 `change()` 的末尾各调一次 `self._snapshot(project)`（在事务提交之后）。

### 实测结果

```
连续三次改动后的备份数: 4
  20261011130207860053.json
  20261011130207851538.json
  20261011130207843176.json
  20261011130207833556.json
再改 25 次后（上限 20）: 20
恢复演练 —— 从最早一份读回: Backup drill | 审计条目 9
```

通过 HTTP 接口改动一次真实项目（91 条标注、36 个编码）：

```
改动前备份数: 0
改动后备份数: 1
  20261011130349680510.json 133127 bytes
```

### 接口

`GET /api/projects/<id>/backups` → `[{name, bytes, written_at}]`。
顶栏显示份数，悬停说明"每次改动后都会写一份可恢复的副本，在「项目」对话框里恢复"。

### 请审核者重点看这里

- **粒度**：每次改动一份，保留 20 份。对一个 133KB 的项目是 2.6MB 上限。
  你认为**按时间轮转**（比如每小时一份、保留 30 天）是否更合适？
- **位置**：默认写在数据库旁边。用户没有指定目录的能力。
- **恢复**：走已有的"恢复项目 JSON"，**是手工的**。要不要做成界面里直接选一份恢复？

---

## 4. 证据四：启动自检（`qualicraft/server.py`）

```python
def self_check(server, args, public_demo):
    """Print the configuration the process actually came up with.

    More than one deployment problem in this project was a setting that looked
    right in the file and was something else at runtime: a dashboard variable
    quietly overriding the blueprint, a key file that was never read, a data
    directory that was not the one being written to. Printing the effective
    values at startup turns that class of problem from a debugging session into
    a glance.
    """
    data_dir = Path(args.data_dir).resolve()
    database = data_dir / "qualicraft.sqlite3"
    backups = data_dir / "backups"
    snapshots = len(list(backups.glob("*/*.json"))) if backups.is_dir() else 0

    lines = [
        "QualiCraft 0.1",
        f"  url             http://127.0.0.1:{server.server_port}{server.base_path}",
        f"  bind            {args.host}:{server.server_port}",
        f"  data dir        {data_dir}",
        f"  database        {database} ({'found' if database.exists() else 'will be created'})",
        f"  backups         {backups} ({snapshots} snapshot{'s' if snapshots != 1 else ''})",
        f"  public demo     {'ON - every write is refused' if public_demo else 'off'}",
    ]

    state = plotting.availability()
    if state["available"]:
        lines.append("  plotting        available")
    else:
        lines.append(f"  plotting        MISSING: {', '.join(state['missing'])} "
                     f"- install with: {state['install']}")
    if state["optional_missing"]:
        lines.append(f"  plotting extra  {', '.join(state['optional_missing'])} absent "
                     "- figures still draw, without clustering")

    config = server.analyzer.public_config()
    if config.get("has_key"):
        lines.append(f"  cloud model     key loaded; endpoint {config.get('base_url')}, "
                     f"model {config.get('model')}")
    else:
        lines.append("  cloud model     no key; AI suggestions cannot run")

    lines.append("  network         no outbound request is made until you confirm "
                 "an analysis preview")
    return "\n".join(lines)
```

### 实际输出

```
QualiCraft 0.1
  url             http://127.0.0.1:8799
  bind            127.0.0.1:8799
  data dir        /private/tmp/sc-test
  database        /private/tmp/sc-test/qualicraft.sqlite3 (found)
  backups         /private/tmp/sc-test/backups (1 snapshot)
  public demo     off
  plotting        available
  cloud model     no key; AI suggestions cannot run
  network         no outbound request is made until you confirm an analysis preview
```

---

## 5. 证据五：图的单位声明（`qualicraft/plotting.py`）

```python
CREDIT_DEFAULTS = {
    "frequency": "Counts passage-code assignments, not participants. Frequency is not importance.",
    "coverage": "Counts passage-code assignments, not participants. Zero means no coding in this interview.",
    "cooccurrence": "Overlapping code ranges within one interview. Descriptive; not correlation.",
    "hierarchy": "Counts coded extracts per section and subsection, not participants.",
    "accumulation": "Interviews in file-name order, not the order conducted. A plateau is not saturation.",
}

# The one figure whose name invites a causal reading gets the caveat in the
# subtitle as well, because that line is read before the credit is.
SUBTITLE_DEFAULTS = {
    "cooccurrence": "Descriptive only: two codes sharing a range, not a correlation.",
}
```

在 `normalise()` 末尾生效：调用方没有显式给 `credit` / `subtitle` 时套用上表。
所以**每张图都带单位说明**，而不是只在方法学记录里写。

---

## 6. 证据六：方法学记录的新增部分

审核指出"审稿人一定会问用了哪个模型、接受率多少"。记录里原有的部分已经数了
建议的生成/接受/拒绝，本轮补上**端点与模型名**（从该次运行的审计条目读，不靠记忆）：

```python
runs = [e for e in audit if e.get("action") == "analysis_start"]
if runs:
    endpoints = sorted({str(e.get("base_url", "")) for e in runs if e.get("base_url")})
    models = sorted({str(e.get("model", "")) for e in runs if e.get("model")})
    add("- Endpoint: " + (", ".join(endpoints) if endpoints else "_not recorded_"))
    add("- Model: " + (", ".join(models) if models else "_not recorded_"))
    add("- Analysis runs: " + str(len(runs)) + ", each sent only after the researcher "
        "confirmed a preview of the exact text to be transmitted.")
```

新增第七节，让方法学记录**脱离图也能读**：

```markdown
## 7. How to read the figures

- Frequency, coverage and co-occurrence count **passage-code assignments**, not
  participants. A code used forty times is not forty times as important, and the
  count is not a proportion of the sample.
- Co-occurrence means two codes were applied to **overlapping character ranges
  within the same interview**. It is descriptive. It is not correlation, and it is
  not evidence of a theoretical relationship.
- The accumulation curve orders interviews by **file name**, which is not the
  order they were conducted in. A plateau does not demonstrate thematic saturation.
- On a co-occurrence matrix the diagonal counts the units a code appears in,
  which is a different unit from the off-diagonal cells.
```

未记录备忘录时明确写出，而不是让这一节消失：

> _No familiarisation notes were recorded on any document. If the study expects
> them, this is the place to say why not._

---

## 7. 测试状态

```
$ python -m unittest discover -s tests
Ran 80 tests in 5.1s
OK (skipped=3)
```

分布：analyze 21 · core 26 · plotting 16 · ingest 10 · http 7。

**本轮新增的代码没有补测试。** 备份与自检目前只有手工验证（上面的实测输出）。
这是我知道的缺口——如果你认为该补，请说明补到什么程度。

---

## 8. 尚未做 / 明确不做

| 项 | 状态 |
|:--|:--|
| 交叉表、编码者间信度、REFI-QDA 导出 | 未做（第八节已列） |
| PyInstaller 打包 | 未做，README 已有分平台安装说明 |
| 网站重构 / 拆分 `app.js` / ShareAlike 警告 | 按审核意见**不做** |
| 备份的自动化测试 | **未做**，见第 7 节 |
| `render.yaml` 与 Dashboard 的值一致性校验 | **未做**，只有启动自检暴露差异 |
