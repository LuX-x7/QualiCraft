# QualiCraft 界面与工具评审

评审对象：本地运行的公开演示版（Bologna 样例项目，19 份文档 / 317 个编码 / 874 条标注）
评审方式：真实浏览器渲染 + 逐视图截图 + 对接口做 A/B 比对
日期：2026-10-11

---

## 一、结论先说

**四个主视图的骨架是好的**：编码工作区（正文 + 编码边栏 + AI 审核栏）的信息层次清楚，
数据密度和留白都合适；审计记录、导出、AI 建议的"先预览再发送"这些设计看得出是懂研究流程的人做的。

问题集中在两处：

1. **"图表"视图此前是个空壳** —— 六个控件里四个无效，五种图只有一种能看到。已修复。
2. **侧栏在真实数据量下会失控** —— 317 个编码平铺，侧栏高 10,579px（约 16 屏）。待处理。

---

## 二、本次已修复（commit `02f28b9`）

### 1. 图表视图的控件与后端脱节

对同一张图做 A/B 比对（比较 SVG 的 md5），结果如下：

| 界面控件 | 实际发送 | 后端 | 实测结果 |
|:--|:--|:--|:--|
| Group by（Themes / Codes） | `level` | 无此选项 | **两次输出字节完全相同** |
| Count within（Passages / Documents） | `unit` | 读的是 `mode` | **完全相同** |
| Palette → Reds | `palette=Reds` | `PALETTES` 里没有 | 静默回退默认值 |
| （没有这个控件） | 从不发送 `kind` | 默认 `frequency` | **5 种图只有 1 种可达** |

也就是说：**"图表"页永远只能画一张"编码频率"条形图**，其余控件点了没反应，
预览图的 alt 文案还写着"Theme co-occurrence heatmap"（与实际所画不符）。

后端其实五种图都实现了：`frequency / coverage / cooccurrence / hierarchy / accumulation`。

### 2. 聚类会直接搞死连接

`linkage(...).argsort()` **不是叶序**。linkage 矩阵是"合并过程表"，
对它取 argsort 得到的是列索引矩阵，拿去索引标签会抛：

```
TypeError: only integer scalar arrays can be converted to a scalar index
```

改用 `scipy.cluster.hierarchy.leaves_list()`；并加"结果必须是标签的全排列"校验，
不满足就退回不聚类的图（符合模块原本的意图：画不出就画不聚类的，而不是拒绝画）。

### 3. 图表出错时，浏览器只看到 "Failed to fetch"

上面的异常没有被请求处理器捕获，**socket 直接关闭、没有任何响应**。
用户看到的是 `Failed to fetch`，完全不知道是图表脚本挂了。

现在 plot 路由会捕获并返回 JSON 错误。顺带把 `ValueError` 的文案也放出来了
——"This figure has no data at this setting" 这种话本来就有用，之前被通用
"请求无效" 盖掉了。

### 4. 选"同一段落"直接报错

`analyze.cooccurrence(mode="unit")` 需要访谈正文，而绘图链路从来没传过。
现在 `_prepare` 会把 `{文档名: 正文}` 传下去。

### 5. 顺带

- **面板只显示当前图类型真正读取的控件** —— 频率条形图不需要配色和连接方式。
  这是让控件"可信"的关键：显示出来的都是有用的。
- 配色列表对齐后端 `PALETTES`（补上 `YlGnBu`，去掉无效的 `Reds`）。
- 修正过时文案：安装提示写"安装以下三个包（matplotlib seaborn scipy）"，
  实际只需要 matplotlib，**seaborn 在代码里从未被 import**。
- 预览图 alt 文案随图类型变化。

**验证**：80 个测试全绿；五种图全部 200；`cluster=1` 出图（原来断连接）；
`mode=unit` 200（原来 400）；导出包仍含 CSV + `figure.py` + SVG/PDF/PNG。

---
## 三、清单状态

> 第二轮更新：P0 两项、P1 的第 4、5 项已实现并推送；P1 的第 3 项与 P2 待办。

### P0 — 影响同学测评的第一印象

**1. 只读演示里仍然摆着"可写"的入口** —— 已修（`a52f813`）

演示模式下这些按钮**置灰 + tooltip**，并在 `action()` 里加了统一拦截作为兜底，
所以即使某条路径不是按钮，点击也会立刻得到说明，而不是稍后失败。

> 用的是**置灰而非 `disabled`**：`disabled` 的按钮不接收指针事件，
> tooltip 不显示、点击也没有任何反馈 —— 那正是要消除的"静默失败"。
> 实测：演示模式 5 个控件锁定、本地模式 0 个；点击提示为
> "Read-only demo. Run QualiCraft locally to make changes."

**2. 侧栏在真实数据量下失控** —— 已修（`a52f813`）

加了筛选框，编码本默认收起（点标题展开）。实测三种状态：

| 状态 | 侧栏高度 |
|:--|:--|
| 默认（编码本收起） | **786px** |
| 输入筛选词 | **1,215px** |
| 编码本展开 | 10,613px |

筛选结果**平铺显示并带上主题路径**（如 `materials › publications, modern a…`）——
过滤后的树会失去意义，因为构成分支的编码已经不在了。
实测输入 `material`：317 个编码 → 21 个匹配。

### P1 — 体验打磨

**3. 审计记录可读性** —— 待办

300 多行几乎全是 `Create code`，**时间戳全部相同**（同一次导入），无筛选/分组/分页。
作为"来源与活动"记录，读者看不出任何过程信息。
建议：按动作类型分组折叠、加筛选、或按导入批次归并显示。

**4. Insights 与 Figures 的 "Code frequency" 重复** —— 已修（`a52f813`）

Insights 的说明末尾补了一句指向 Figures："For a figure you can put in a paper,
use Figures."（中文对应"需要放进论文的图，请到「图表」页导出。"）

**5. "取前 N 个编码"没有暴露** —— 已修（`a52f813`）

Figures 面板新增 **Top N codes** 控件（10/15/20/30/40），只在 coverage 与
cooccurrence 两种图下出现 —— 这两种才是真正读 `top` 的。

### P2 — 可选

**6. 图表描述文案**：`plotDesc` 原来描述的是共现图，现已改为通用文案；
如果希望每种图有各自的说明，可以再按 `kind` 分别写。

**7. 编码状态标记**：`emergent / provisional / final` 在编码本里只有小字标记，
在 317 条编码的规模下不易扫读。

---

## 三点五、网页（marketing site）的评审结论

本轮把网站四个页面（首页 / method / about / zh）在 1440px 与 390px 下都渲染截图过了一遍。
整体完成度很高：信息架构清楚、文案克制，六个阶段的网格、能力模块卡片、
两个公开数据集都做得扎实。发现并修复了两个问题。

**① 页头 logo 压在品牌名上** —— 已修（`b07a312`）

浏览器实测：标记的盒子宽 **34px**，但里面的网格是 **109px**。
原因是 `.brand__logo` 还留着 `width: 2.1rem` —— 那是 logo 还是一张可缩放的图片时写的，
而现在标记是一个固定 13px 轨道的 CSS grid。**固定轨道不会为适应盒子而收缩**，
于是轨道溢出，方块直接画在了旁边的 "QualiCraft" 上。

尺寸也不对：`size 13` 画出 109×61，那是英雄区的体量，占了 68px 页头的大半。
`size 4` 画出 34×19，正是 2.1rem 那个槽位要的宽度。

**② 过时文案** —— 已修（`b07a312`）

能力模块里写 "Needs matplotlib, seaborn and scipy"。实际只需要 matplotlib，
**seaborn 从未被 import**，scipy 只影响聚类。工作台里的同一句也一并改了。

**待你确认的两点**（看页面时判断）：

- **页脚与结尾 CTA 写着 "The workspace runs on this machine."** —— 线上是托管演示，
  访客并不在本机运行。这句话对本地安装是对的，对公开演示是误导。
- **结尾 CTA 的对齐**：标题与按钮左对齐，中间那段说明文字却是居中的，
  同一个区块里混了两种对齐。

## 四、附录：本次用到的验证方法

想复现或继续排查时可以直接用：

```bash
# 同一张图，换参数，比 md5 —— 相同即说明参数无效
curl -s -H "X-QualiCraft-Token: $TOKEN" \
  "http://127.0.0.1:8765/w/api/projects/$PID/plot?kind=frequency&level=code"  | md5
curl -s -H "X-QualiCraft-Token: $TOKEN" \
  "http://127.0.0.1:8765/w/api/projects/$PID/plot?kind=frequency&level=theme" | md5
```

Token 与项目 ID 来自 `GET /w/api/bootstrap`。

侧栏高度：

```js
document.querySelector('.sidebar-scroll').scrollHeight   // 10579
document.querySelector('.sidebar-scroll').clientHeight   // 673
```
