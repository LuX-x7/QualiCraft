# UX-33 · 阅读能力后的网站、报告与工作台联合验收

后续修复（UX-35，2026-10-17）：**UX33-01已修复并本地验收；UX33-02保持关闭。** 手机搜索聚焦保留搜索前来源段落，清除筛选／Resume准确返回；真实阅读继续推进、显式Keep替换、项目／文档隔离及禁用存储均通过。见 [本轮修复与证据](UX-35-SEARCH-POSITION.md)。下方历史失败和当时未修状态仍按原轮次理解，不改写UX-33原46项结果。W03／实体设备／VoiceOver／用户接受与发布门禁未自动关闭；Windows暂缓，不推送、不部署。

后续修复（UX-34，2026-10-17）：**仅UX33-02已修复并验收，UX33-01按本轮明确范围不动。** 触摸Keep不再因控件滚入视口保存首段，真实原文滚动仍推进目标，桌面／手机／键盘／刷新与切换通过；原统计／绘图／数据不变。见 [本轮修复与证据](UX-34-KEEP-POSITION.md)。下方旧失败／通过均保留历史含义，不把UX-33原46项结果改写成全通过；Windows暂缓，不推送、不部署。

2026-10-16。产品基线 **`1c665aa359024e10492efc6bfeea4cad5ce92e78`**（UX-32B）；本轮只审查、截图、复跑验收与更新文档，未改功能。Windows 暂缓且未验证；不推送、不部署。

**结论：指定主流程11/11完成；扩大手机边界后，全部46项浏览器检查44通过、2失败。新增一项P2、一项P3，均未修复，不登记为联合验收全部通过。** T03已实现；手机位置记忆的联合接受重开。可以带着问题清单交给supervisor讨论，不能据此宣称最终发布验收完成。

## 环境与可复核证据

本轮使用新建受控Chrome上下文，仅访问本项目登记的本机预览；不附着或读取其他窗口／标签页。专用前台 `http://127.0.0.1:4466/`，后端8867，数据 `/tmp/qualicraft-ux33/data/qualicraft.sqlite3`。从起步页主动选择Try Bologna创建可编辑副本，再通过真实UI导入、编码与手动标记。没有模型密钥、模型请求、Guide或非Bologna研究文本。

原种子项目19文档／317编码／874标注及原审计完全保留。本轮工作副本导入相同Bologna原文后为20文档，对同一原句赋两个既有码，变成876标注；另将实际下载的JSON恢复为新项目。临时数据库共三个项目，不把验证新增记录解释成研究发现。常用4445数据库字节不变。

原模板SHA-256为 `b8b44b814f2fa6286decf877364665ad8276977c08913d02d7b8a90db62a755d`，仍为持久化v4；编辑／导出副本为v5。报告仍是manifest固定的19／874示例，**不会自动反映临时项目的20／876编辑**。

证据根 `~/qualicraft-review/ux-33/`；审核包镜像 `~/qualicraft-review/supervisor-review/raw/ux-33/`。`raw/run-index.json`记录命令、解释器、原始输出和退出码；`summary.json`为计数汇总，`post-commit.json`记录本轮完整文档提交。截图、下载与临时验收脚本不入Git；不归档运行数据库、备份或令牌。

## 按指定顺序的主流程

| 环节 | 实际核对 | 原始结果／截图（相对证据根） |
| --- | --- | --- |
| 网站→导入 | 原Coding图、Analysis路径图与追加圆点网络都在；显式Bologna副本；TXT预览、Enter保存，原文18239个Unicode码点逐字一致 | `results.json`；`screenshots/01-home-desktop.png`、`03-import-preview.png`、`04-import-result.png` |
| 编码 | 两次真实鼠标拖选、输入既有码名并Enter；同一`[2,38)`准确原句，两条实际标注ID／编码ID；主题路径清楚 | `results.json`；`05-mouse-coding-popup.png`、`06-coded-source.png` |
| 手动标记→双轨 | ¶4=Read、¶5=Revisit，键盘保存／Undo；即时读回项目。阅读单独修改未轮转研究编辑快照；轨道31段／2标注／1来源，非“编码完成率” | `results.json`；`06a-marked-dual-track.png` |
| 筛选→跳转→记忆 | 主题自身及后代逐段对独立预期；叠加无匹配搜索后仍为全文53标注。明确Show full document & jump才清筛选；共享范围保留两ID和完整引文。桌面临时预览保留Resume，主动Keep／文档切换／刷新恢复 | `results.json`；`06b-filter-explicit-source.png`、`06c-resume-after-filter.png`、`06d-kept-position-reload.png` |
| 关系图 | 真实新增标注→完整原句／两码→定位→返回。所有连线端点存在；补查返回原文档、搜索、主题筛选、所选节点及原阅读锚点 | `results.json`、`navigation.json`；`07-network-evidence.png`、`08-source-location.png`、`29-network-return-filters.png` |
| 五类图 | 频次、覆盖、共现、层级、累计真实预览和五个ZIP；25成员CRC／格式／SVG XML／脚本语法；实际259行层级CSV在9／10pt保持标签计数且几何零重叠／裁切 | `results.json`、`output-audit.json`；`09-workbench-*.png`、`downloads/*.zip` |
| 报告读值 | 五类全部594表行逐格对CSV：15／285／16／259／19；每类首中末三次读值和选中行，键盘及定位；十个SVG／CSV的HTTP字节与原文件一致 | `results.json`；`10-report-*.png`、`11-report-source.png` |
| 导出→恢复 | 实际完成JSON、标注CSV、矩阵CSV、Methods下载，逐字节对API。JSON等于本轮SQLite项目，恢复新ID后原文／标注／手动标记一致；恢复项目的概览可独立导航 | `results.json`、`navigation.json`、`summary.json`；`12-export-result.png`、`30-restored-project-tracks.png` |

报告计数和工作项目计数的区别是固定示例与可编辑副本的区别。两码同原句仍为两条编码、一处来源，不据此新增共现规则、统计、阅读完成度或方法结论。下载证据是受控Chrome实际下载事件／完整文件；不冒称本轮检查了操作系统通知。

## 剩余问题：本轮发现，尚未修复

### UX33-02 / P2 · 手机触摸Keep可能保存首段而非刚定位段落

复现：390×844触摸上下文打开本轮工作副本 → Overview → Exact paragraphs → 4 → Preview → Go to source ¶4 → 点击Keep this reading position。跳转后`current=872`、`preview=872`，源范围为¶4 `[872,2681)`；控件滚入视口后，在pointerdown前当前位置／预览变成0，实际保存`start=0`（¶1），仍显示“Browser reading position saved.”。

此路径在主补查与独立无搜索复现中出现；独立对照中390px键盘Enter和1440px鼠标均保存872。不是原文、标注或项目Read丢失；影响的是浏览器保存位置与确认提示的准确性。触摸仿真不能替代实体手机，但已有足够证据登记未关闭缺陷。

证据：`phone-followup.json`中该检查失败、`keep-probe.json`三种输入对照；命令 `python /tmp/qualicraft-ux33/phone_followup.py`退出1，`python /tmp/qualicraft-ux33/keep_probe.py`退出0（诊断成功，**不代表触摸功能通过**）。截图 `screenshots/36-keep-390-tap-before.png`与`37-keep-390-tap-after.png`展示¶4到¶1及保存提示。原始`raw/phone-followup-complete.txt`、`raw/keep-probe.txt`保留实际坐标与事件。

关闭标准：相同顺序中触摸、键盘和桌面均保留刚跳到的¶4；Keep控件为获得焦点／进入视口而产生的界面滚动不得偷换目标；保存回执和Resume／刷新结果均对应872。支持别的段落、长段、短屏及明确实际阅读滚动后保存；不改项目手动标记或统计。**建议下一轮优先。**

### UX33-01 / P3 · 手机进入搜索前的阅读锚点被工具栏定位覆盖

复现：在¶4保存`start=872` → 从固定栏Overview按钮以原生Tab依次经过标记控件到Search in document。到达搜索框时页面移到顶端，锚点在输入前已变为0。输入无匹配搜索 → 概览选择¶6 → Show full document & jump → Resume，返回¶1。

这是调用上方搜索时缺少“搜索前阅读位置”的可用性缺口；按当前“记住最近视口”实现，焦点滚动被当成阅读滚动。**不是显式清筛选或概览跳转偷偷写项目**，不能把它混同为数据损坏。桌面已验收的过滤保留仍通过。

证据：`supplement.json`保留该检查失败；`phone-probe.json`逐步记录872→0，`phone-followup.json`的native_Tab_steps确认第4次Tab在输入前改变锚点。命令分别为 `python /tmp/qualicraft-ux33/supplement.py`退出1、`python /tmp/qualicraft-ux33/phone_probe.py`退出0；`raw/phone-probe.txt`、`screenshots/31-phone-before-search.png`、`32-phone-after-filter-resume.png`、`33-phone-native-tab-filter-resume.png`。

关闭标准：明确搜索前锚点保留语义；从手机长文调用／聚焦搜索时，焦点辅助滚动不得抹去原阅读上下文；显式清筛选、跳转、Resume、文档切换／刷新均能回到约定锚点。继续保持主题后代筛选、全文轨道、无匹配提示、手动标记及统计定义。可与02关联评估，但另行授权后实施。

## 浏览器覆盖与验证口径

| 原始结果 | 通过／总数 | 覆盖 |
| --- | --- | --- |
| `results.json` | 11/11 | 指定顺序，真实导入／编码／标记／绘图／报告／下载恢复，桌面和手机主线 |
| `story/results.json` | 10/10 | 自然滚动十场景、固定左窗、原路径图与新增网络、真实悬浮／拖拽／键盘／手机、594读值 |
| `heatmap/results.json` | 7/7 | 301CSV行映射原SVG、移动框／准确数值、悬浮、键盘、触摸与静态保留 |
| `visual/results.json` | 7/7 | QT／导航／按钮／边框、原文与高对比、桌面手机断点、五图查看及只读项目保持 |
| `supplement.json` | 4/5 | 手机全部20文档、317节点树、双轨／原句；五图原尺寸比例／Fit／键盘返回；无JS报告；搜索锚点失败 |
| `navigation.json` | 3/3 | 网络返回完整过滤上下文／锚点、恢复v5项目与概览隔离；零项目写请求 |
| `phone-followup.json` | 2/3 | 原生Tab独立复现搜索；触摸Keep失败；普通滚动后的文档切换／刷新／Read保持、项目零写通过 |
| **合计** | **44/46** | **2失败均保留。诊断脚本不重复计为通过项目** |

全部最终正常路径控制台／JS／HTTP错误为0，不能因此掩盖位置逻辑失败。手机为Chrome触摸仿真；覆盖320／390及现有视觉脚本断点、横屏／矮窗、减少动态模式；实体手机／VoiceOver／系统动态设置／OS下载提示未在本轮代验。Windows继续未验证。

完整回归：`python -m unittest discover -s tests -v`，163项、3跳过，退出0；`node --test tests/*.test.mjs tools/report/*.test.mjs`，139通过，退出0；`node --check web/app.js`退出0。输出分别在`raw/python-full.txt`、`node-full.txt`、`js-check.txt`，命令绝对解释器见run-index。单测现有覆盖未包含上述手机触摸组合路径，不能据单测通过关闭问题。

本轮只改文档，**没有重新生产构建**；沿用产品代码相同的UX-32B已通过Next构建，npm缺失127属于此前记录，不伪称本轮新结果。19个登记前台首页／报告／health／bootstrap均200，常用4445桌面／手机、只读例及本轮320px正常入口无错误，见 `python /tmp/qualicraft-ux33/normal_preview.py`／`raw/normal-preview.txt`和`normal-preview.json`。

初始失败完整保留：补查的真实搜索失败；phone_followup初版重复关闭已打开Overview造成Keep定位超时（脚本错误），修正后才得到真实触摸Keep错误；首次尾部断言未写结果的输出也保留。没有通过改产品、删除失败或改变期望值使检查冒充全通过。Matplotlib只读默认缓存和已有测试ResourceWarning保留在原始输出；不属于浏览器控制台错误。

## 已完成与仍待做

- 已完成本轮联合审查、截图、原始输出、导出／恢复与范围核查。UX17-01…05按各轮证据保持关闭；原图、录屏、完整表格、下载及现有统计／绘图不动。
- **下一轮先修UX33-02，再处理／明确UX33-01并补回归，复跑这两条失败顺序。** 本轮不修功能，也不把修复记作已完成。
- W03剩余网站视觉、控件密度与图文节奏，需要用户／supervisor具体反馈及接受。UX-29录屏仍可播放且保留静态替代，但早于新增阅读控件；阅读能力用当前工作台／截图演示。
- 当前新控件实体设备／VoiceOver、用户／supervisor接受及正式发布门禁仍开放；旧人工设备结论不自动适用于新版本。Windows暂缓；保持不推送、不部署。

当前审核使用 [一页英文说明](SUPERVISOR-ONE-PAGE.md)；审核包README和LATEST-CANDIDATE已同步上述两项。历史PDF属于旧候选，单独标记，不作为本轮结果。完整文档提交及包内文件一致性见`post-commit.json`、`package-verification.json`。
