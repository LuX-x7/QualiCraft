# 推送指引 —— 两个改动

## 为什么没有直接推送

我尝试通过 GitHub 连接器创建分支，返回：

```
403 Resource not accessible by integration
```

连接器认证的身份是你本人（`HaijunChe`，对该仓库有 `push` 权限），但**连接器安装令牌本身是只读的**，因此无法由我创建分支 / 提交 / PR。

---

## 我准备好的东西

两个改动已经拆成**两个独立提交**，各自导出为可直接 `git am` 的补丁：

| 补丁 | 内容 | 规模 |
| :--- | :--- | :--- |
| `QualiCraft_Patch1_编码功能修复.patch` | 修复"划选文字后看不到打标按钮" | 1 文件，+16 行 |
| `QualiCraft_Patch2_P0码表层级.patch` | 码表层级 + 编码增删改合并 | 8 文件，+504 −20 行 |

补丁 2 依赖补丁 1（两者都改 `web/style.css`，顺序应用即可）。

---

## 推送步骤

在你已登录 GitHub 的终端里执行：

```bash
git clone https://github.com/LuX-x7/QualiCraft.git
cd QualiCraft

# 第一个改动：修复
git checkout -b fix/coding-selection-bar
git am /path/to/QualiCraft_Patch1_编码功能修复.patch
git push -u origin fix/coding-selection-bar

# 第二个改动：码表层级（基于修复分支，方便你本地接着做）
git checkout -b feat/codebook-hierarchy
git am /path/to/QualiCraft_Patch2_P0码表层级.patch
git push -u origin feat/codebook-hierarchy
```

推送后 GitHub 会给出创建 PR 的链接。建议先合并 PR 1，再合并 PR 2（PR 2 会自动只显示第二个提交）。

> **如果你不想分两个 PR**：只需 `git checkout -b fix-and-hierarchy main` 然后依次 `git am` 两个补丁，一次性推送即可。

---

## PR 1 描述（可直接复制）

```markdown
## Problem

Selecting text in a transcript showed no "Apply code" control, so manual coding
was impossible. This reproduced on any document long enough to scroll.

## Root cause

`web/style.css` declared:

    .selection-bar{position:sticky;bottom:10px;...}

`.selection-bar` is rendered inside `#selection-slot`, a wrapper `<div>` whose
height equals the bar itself. A sticky element can never be offset outside its
own containing block, so the bar had **zero travel** and stayed at its natural
flow position — the very bottom of the scroll content.

Measured on `Interview Transcript_IP6.docx` (72 segments):

| | |
|---|---|
| `.document-pane` visible height | 389 px |
| `.document-pane` scroll height | 15,055 px |
| selection bar position | y = 15,228 |
| **distance below the visible area** | **14,676 px** |

The application logic was correct — `state.selection` held the right character
offsets. Only the bar's position was wrong.

## Fix

Move the sticky context from `.selection-bar` onto `#selection-slot`, so the
bar's containing block becomes the scroll container (`.document-pane`) and it
pins to the bottom of the reading pane:

    #selection-slot{position:sticky;bottom:0;z-index:6;pointer-events:none}
    #selection-slot:empty{display:none}
    #selection-slot>*{pointer-events:auto}

`pointer-events` keeps the empty slot from swallowing clicks on the content
beneath it.

The change is appended as a small override block with an explanatory comment,
rather than editing the rule in place — `style.css` keeps the whole stylesheet
on a single 8,000-character line, so an in-place edit produces a diff that
cannot be reviewed on GitHub. Happy to fold it into the minified rule instead.

## Verification

| | before | after |
|---|---|---|
| bar top (px) | 15,228 | 500 |
| visible inside the pane | no | **yes** |

Full flow re-tested end to end: select text → "Apply code" → choose a code →
add a memo → save → passage highlighted, margin pill appears with source
`HUMAN`. Repeated across 6 codes and 7 passages. No backend or data-model
change.
```

---

## PR 2 描述（可直接复制）

```markdown
## What this adds

Projects move to **schema v2** and the codebook becomes a tree, so codes can be
grouped into themes. Until now the codebook was a flat list and a code could not
be renamed, re-parented, merged or deleted — which made a thematic workflow
impossible, since the whole point of thematic analysis is moving from codes to
themes.

### Model changes

A code gains `parent_id`, `memo`, `inclusion`, `exclusion`, `anchor_examples`,
`status` (`emergent` / `provisional` / `final`) and `order`. A document gains
`attributes`, reserved for case-level metadata.

### Migration

`migrate()` upgrades a v1 project in place the first time it is read. Every
added value is a neutral default, so an existing codebook, its codings and all
character offsets are preserved untouched. Migration is idempotent and runs
inside `Store.get` and `Store.change`.

Verified against the real benchmark projects: the TU Delft reference workspace
loads as v2 with all **54 codes and 377 codings intact**.

### New operations

Rename, redefine, recolour, re-parent, merge and delete a code. The tree is
validated on every write:

- a code may not be its own parent;
- a code may not point at a missing parent;
- a code may not be moved beneath one of its own descendants.

Merging moves codings across and **collapses** a coding that would duplicate an
existing target coding on the same passage, rather than creating a second copy.
Deleting re-parents the deleted code's children upward and reports how many
codings were removed; both counts land in the audit trail.

### Interface

The sidebar renders the codebook as a tree: branches indent by depth, parents
carry a rolled-up count (own codings plus every descendant), branches collapse,
and a per-row affordance opens the code detail dialog (name, definition, group,
status, memo, inclusion/exclusion criteria, anchor examples, colour, plus
delete and merge).

### Export

The codings CSV gains a `code_path` column, e.g.
`Architecture-code alignment > Architecture-code traceability`. The column is
additive, so existing downstream scripts keep working.

## Why this matters for the benchmark data

The TU Delft codebook encodes a hierarchy inside its code names:
`Experience with RDM [R]` and `Experience with RDM [PM/SP]` are two roles of the
same theme — 13 such pairs among 54 codes. That structure was invisible to the
tool; it can now be represented directly.

## Tests

6 new tests in `tests/test_core.py` and 1 in `tests/test_http.py` cover the
migration, hierarchy validation, cycle rejection, rename conflicts, merge
duplicate-collapsing, delete re-parenting and the export column.

    python -m unittest discover -s tests    # 23 tests, 2 skipped, OK
    node --check web/app.js                 # clean
```

---

## 另外两点

1. **`tools/demo_stub_model.py` 未包含在任何补丁里。** 那是我为演示 AI 审核链路写的本地桩程序（无 API key 时可用）。如果你觉得对贡献者有用，可以单独提一个 PR；不需要就直接删掉。

2. **本次评估还发现一个未修复的问题**（不在这些补丁范围内）：`/api/bootstrap` 无需任何凭证即下发会话令牌。单机 `127.0.0.1` 下是合理的，但一旦为了实验室共用而放开监听地址，任何能访问该端口的客户端都能读写全部研究项目。详见 `QualiCraft_项目评估报告.md`。
