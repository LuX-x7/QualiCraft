# UX-03A · 首页精简与 Coding 样板

2026-10-15。基线 `526b299c655d63ac0563e7cc41de1942a1e26697`。按用户批准的体验蓝图实施；取代早期 T7“默认完整视频/全部操作说明展开”的呈现，录屏与资料仍保留。未改工作台行为、图表渲染、统计或已有资产；未推送、未部署。

## 结果

首页默认英文词数同口径 `document.body.innerText.trim().split(/\s+/).length`：本轮修改前 **1,321**（2D 完成后的真实基线；UX-01 历史 1,315 不覆盖），最终桌面 **688**，390px **681**。两个最终值均在 650–800 目标范围内。详见 `browser/baseline.json`、`browser/observations.json` 的 A05/A09；中间布局的旧观测保留，不当作最终验收。

首屏缩短价值主张，提供工作台与报告两个入口；Windows 下载保持禁用，标明 validation pending。导航按 Workflow / Example report / Method / Data / About 组织。新增一张原始频次图和来自既有 manifest 的项目规模与 CREDIT 图注，供读者进入完整报告。完整方法表、4 条参考文献、四条边界的理由/修订/替代路径、全部 5 张生成数据卡均可用原生 disclosure 展开；默认展示 Bologna 卡，未另写卡片或单位句。

Coding 默认是明确标注为 **Relationship illustration** 的可核对关系示意，保留原始意大利语原句、编码和完整主题路径。四个步骤支持鼠标、原生按钮 Enter、方向键、Home/End；Escape 清除解释状态并返回首个步骤。可查看原有定义；未记定义时如实说明。源信息展示原始 ID、范围、原文哈希和 source=`imported`。不画可编辑的假工作台、不伪造保存状态、不翻译成另一句原文。

真实视频改为按需打开，保留原生控制、真实录屏静态帧、全尺寸入口和失败替代。手机通过显式步骤选择展示对应示意，控件高 44px；桌面保持原生滚动跟随，面板内部滚动，聚焦面板控件时不会被章节监听器切走。减少动态效果仍走静态模式。无脚本的服务器 HTML 包含原句、路径、原生资料展开和全部五段录屏/静态图链接。

其他四模块本轮只有简洁的工作流提纲，详细的数据示意在 3B 推进，未冒称已完成。

## 来源与契约

`tools/site/build_evidence.py` **只读** Bologna CC0 SQLite 项目，验证原有标注/文档 ID、Unicode 切片、完整父级链、文档与数据库哈希，并绑定现有报告 manifest；CLI 还核对全部 10 个 manifest 资产字节。输出 `website/lib/site/bologna-evidence.json`，页面只读生成物，不连接工作台数据库。

例证仍为既定蓝图原句：annotation `1777fabb3fc0461b88e972664b078e03`；`interview03.txt`，`[26013,26090)`；code `080e089a9fdc4b2787bd48f05dc83711`。生成物可按原命令逐字节复现。首页每次渲染复核资产与 manifest 绑定，失败时不显示不可靠图或示意。

## 验收证据

仓库外：`~/qualicraft-review/ux-03a/`。原始命令/输出在 `raw/`，项目标签页截图/DOM/观察在 `browser/`。

| 检查 | 结果 |
| --- | --- |
| 例证回归修复前 | 4 项因提取器不存在失败；`raw/evidence-before-local.txt`，退出 1 |
| 来源、Unicode、循环/缺失父级、错误原句与不符 manifest 回归 | 4/4；`raw/evidence-regression.txt`，退出 0 |
| 完整 Python | 140 项，跳过 3，其余通过；`raw/backend-full-loopback.txt`，退出 0 |
| 构建与类型检查 | `npm run build`，`raw/build-accepted.txt`，退出 0；构建后重启。旧 middleware 弃用提示保留 |
| 禁用文案 | 指定 `grep -rniE ... website/` 无匹配；`raw/forbidden-copy.txt`，退出 1 |
| 范围与数据 | 工作台、原 demo DB、10 个报告资产、五段录屏、生成数据卡、部署配置均未改；例证与原文/完整路径逐项核对；`raw/audit-final.txt`，退出 0 |
| SSR 静态契约 | HTTP 200 原始 HTML 排除 script 后仍有原句/路径及全部五段静态/视频链接；`raw/ssr-fallback-loopback.txt`，退出 0 |
| 浏览器 | 同一个本项目标签页；桌面 1440 × 900、手机 390 × 844；方向键/End/Escape、来源、定义、真实视频→静态图、资料展开、无页面横向溢出均有观察 |
| 校验失败退路 | 临时为频次 SVG 增一换行：图/示意均不显示，两个说明状态可见；40 秒自动恢复原字节后正常。A10/A11 与 A05 截图；最终范围校验确认资产与基线一致 |
| 控制台 | `browser/console.json` 为 `[]`，无 warn/error |

截图：A01 最终桌面首页，A02 桌面 Coding，A03 手机首页，A04 手机 Coding，A05 校验失败退路。截图不进 Git。

保留的环境失败：第一次完整 Python 与 HTTP 静态契约在沙箱内不能监听/连接本机，分别出现 10 个权限错误和连接错误；允许本机网络后同一代码通过，不修改测试入口。构建和布局迭代的原始输出保留。已知 `-t .` 失败沿用 UX-02B 记录。本轮未读其他窗口；无 JS 浏览器模式、系统减少动态效果的浏览器模拟、物理触摸、屏幕阅读器和 Windows 未实测，SSR/系统偏好代码覆盖不冒充这些实测。

下一步 3B 统一其余四模块；随后 4A/4B 和 5。总体状态见[体验计划](EXPERIENCE-ROADMAP.md)。
