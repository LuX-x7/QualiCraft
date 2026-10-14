# QualiCraft · 编码与绘图模块设计

本文是实现契约。它固定五个模块的边界、模块之间传递的数据形状，以及几条会直接
影响图表数值的口径决议。实现与本文冲突时，以本文为准；要改口径，先改本文。

参考物：`qualitative_coding_plotting_research_v2.txt`（需求与数据集）与
`plot_examples_v2.txt`（五张图的参考实现）。

---

## 1. 目标

本地优先的质性编码 → 导出数据 → 可直接编辑的矢量图 + 可复现代码，以网页平台形式提供。
（不宣称"期刊级"：不同期刊的格式要求不同，能承诺的是输出 SVG/PDF 与 300dpi PNG。）
绘图体验对齐 bioinformatics.com.cn 的三段式：**参数化 → 实时预览 → 一键导出**。

三条不可让步的性质：

1. **预览即脚本输出。** 只有一条渲染路径，导出脚本原样就是画图的那段代码，
   而不是另写一份"导出用的"脚本。
2. **默认不出本地。** 原文不参与任何网络调用；云端分析必须经人工确认。
3. **图上的每个数字都要能说清单位。** 是编码行数，不是人数，不是重要性。

---

## 2. 五个模块

| 模块 | 输入 | 输出 | 状态 |
|:--|:--|:--|:--|
| **M1 ingest** | 粘贴文本 / `.txt` / `.docx` / OpenQDA CSV / NVivo CSV / ATLAS.ti XLSX / QualCoder `.qda` / REFI-QDA `.qdpx` / 内置公开数据集 | `Project`（documents + codes + annotations）+ `source_meta`（数据集名 / DOI / 许可 / 版本） | 部分已有，需补 CSV 与 `.qda` |
| **M2 coding** | `Project` + 人工操作 / LLM 建议 | 更新后的 `codes` / `annotations` / `suggestions` / `audit` | 基本齐备，需补 codebook 映射 |
| **M3 analyze** | `Project` | **tidy 表** + 四类派生统计量（频次 / 共现 / 覆盖 / 累计） | 全新 |
| **M4 plot** | tidy 表 + 图表参数 | SVG + PDF + 300–600 dpi PNG + 复现脚本 + 数据 CSV | 仅 1/5 种图 |
| **M5 export** | `Project` + 图表 bundle | JSON / 标注 CSV / 矩阵 CSV / 方法学 Markdown / 复现脚本 / 图表包 zip | 基本齐备，需补打包 |

横切关注点：**provenance**（已有 `event()`）、**privacy**（缺去识别提示）、
**i18n**（中英双语，已完成）。

### M3 为什么单独成层

现在 `plotting.cooccurrence()` 直接在 `Project` 上算。加第二种图就要再写一遍遍历，
加第五种图就有五份几乎相同的遍历代码。把 `Project → tidy 表` 这一步抽出来之后，
**绘图模块只认一张表**，加新图 = 加一个渲染函数。

---

## 3. 数据契约：tidy 表

所有绘图函数的唯一输入。列名固定，顺序固定。

| 列 | 类型 | 来源 | 说明 |
|:--|:--|:--|:--|
| `case` | str | `document.name` | 一份访谈 / 一个案例 |
| `code` | str | `code.name` | 编码名 |
| `parent_code` | str | 父级 `code.name`，无父级时为空串 | 原始名称，供显示 |
| `theme` | str | 顶层祖先 `code.name`，无则等于 `code` | 原始主题名称，供显示 |
| `start` | int | `annotation.start` | Unicode 码点，闭开区间 |
| `end` | int | `annotation.end` | 同上 |
| `text` | str | `annotation.quote` | 该编码覆盖的原文片段 |
| `source` | str | `annotation.source` | `manual` / `ai_reviewed` |
| `code_id` | str | `annotation.code_id` | 稳定编码身份，所有编码聚合与去重使用此列 |
| `theme_id` | str | 顶层祖先 `code.id` | 稳定主题身份，主题聚合使用此列 |
| `code_label` | str | 完整编码表生成的显示标签 | 普通编码用原名；重名用完整路径；路径文本仍冲突时追加完整编码 ID |

前八列的含义与顺序保留，后三列追加。项目仍保存 schema v4，不重命名编码，
不进行数据库迁移。计数 CSV 保留原列结构，名称列使用可区分的显示标签。
网络节点使用 `code:<code_id>` / `theme:<theme_id>`，编码与片段节点携带
`code_id`、`theme_id`，主题节点携带 `theme_id`，定位及连线均以 ID 为准。

派生表（同样由 M3 产出，供 M4 直接消费）：

- `frequency`：`code`、`count`，按 count 降序
- `cooccurrence`：方阵 + 标签 + 对应的 `code_ids`，两种口径（见 §4）
- `coverage`：`case × code` 计数矩阵 + 对应的 `code_ids`
- `accumulation`：按 `case` 顺序的累计去重编码数

---

## 4. 两条口径决议

### 4.1 共现有两种定义，都要提供

| 口径 | 定义 | 出处 |
|:--|:--|:--|
| `overlap`（默认） | 同一 `case` 内，两条标注的**字符区间实际重叠** | 资料 Fig 3 的算法 |
| `shared-unit` | 两条标注落在**同一个段落单元**内即算共现 | 现有 `plotting.cooccurrence()` |

两者数值不同，`overlap` 更严格。默认 `overlap`，切换开关暴露给用户，并在图注写明
当前用的是哪一种。

### 4.2 计数单位必须写进图注

以下三句是硬性要求，每张相关图的署名框里都要出现对应的一句：

- 频次 / 覆盖 / 共现的单位是**编码行（passage–code assignment）**，不代表观点重要性，
  也不代表受访者比例。
- 累计曲线按**文件名顺序**排列，不代表访谈时间顺序；平台期**不能证明**主题饱和。
- 对角线数值是"该编码出现的单元数"，与其余格子的口径不同。

---

## 5. 公开数据集

| 集 | 规模 | 许可 | 用途 | 落到哪 |
|:--|:--|:--|:--|:--|
| **A** Open Science 访谈（Le Foll 2025, Zenodo 17588655） | 837 行 / 39 code / 26 文件 | CC BY-SA 4.0 | 解析器测试 + Fig 1/2/3/5 基准 + 评估集 | ingest + plot |
| **C** Publishing Reproducible Research（Loffreda & Chiarelli 2021, Zenodo 5512420） | 1008 行 | CC BY 4.0 | Fig 4 层级图基准 | ingest + plot |
| **B** Bologna FICLIT（Zenodo 6123290） | 19 访谈 + `.qda` | CC0 | QualCoder SQLite 解析器测试 | ingest |
| **D** 医疗访谈（Zenodo 10116088） | 52 份 XLSX | CC BY 4.0 | 待打开确认结构后再接 | ingest（暂缓） |
| **E** FAIRqual（GitHub fairqual/dataitd24） | ~50 行层级 | CC BY 4.0 | 轻量层级 + 频次单元测试夹具 | plot 测试 |

**关于"训练"：** 资料结论明确——这些数据规模小、领域窄、编码体系各异，
**不足以训练通用自动编码模型**。可行路径是把 A / C 用作 **few-shot 示例**与
**评估集**。评估按**整份访谈留出**（leave-interviews-out），不随机切片，
否则同一访谈的相邻段落会泄漏。

**许可注意：** A 是 CC BY-SA 4.0，有 ShareAlike 要求，衍生物需同样开放；
C / D / E 是 CC BY 4.0，署名即可。每张图自动写入来源署名，`source_meta` 随项目保存。

---

## 6. 与现有代码的映射

| 设计 | 现有实现 | 动作 |
|:--|:--|:--|
| `Project` 数据结构 | `core.py`：documents / codes / annotations / audit | 复用，不改 |
| 层级编码 | `core.py`：`parent_id`、`descendants`、`code_path` | 复用，`theme` 列由此推出 |
| 事件日志 | `core.py`：`event()` | 复用 |
| 方法学导出 | `core.py`：`methods_narrative()` | 复用 |
| 标注 CSV 导出 | `core.py`：`csv_export()` | 复用 |
| tidy 表 | 无 | **新增 `analyze.py`** |
| CSV / `.qda` 导入 | 无 | **新增 `ingest.py`** |
| 共现热图 | `plotting.py`：`cooccurrence()` + `build_script()` | 重构为消费 tidy 表 |
| 其余四类图 | 无 | **扩展 `plotting.py`** |
| 数据集下载与校验 | 无 | **新增 `datasets.py`** |

---

## 7. 图的统一规范

- **配色**：默认 Okabe–Ito 色盲友好八色；保留现有 viridis 等连续色板用于热图。
- **署名框**：每张图固定三段——图题（粗体）、副标题（数据规模说明）、
  底部来源（数据集 + DOI + 许可 + "示例分析，非研究结论"）。
- **输出**：`{name}.png`（300 dpi）、`{name}.svg`（矢量，可编辑）、
  `{name}.pdf`、`{name}.csv`（该图背后的计数）、`figure.py`（复现脚本）。
- **字体**：西文 DejaVu Sans；中文标签回退到系统 CJK 字体，缺失时明确报错而不是画成方块。
