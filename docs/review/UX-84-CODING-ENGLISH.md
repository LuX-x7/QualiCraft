# UX84 Coding 精简与英文教学示例

2026-10-21。用户优先要求截图中的 Coding 顶部简洁，以及网站／工作台默认示例使用英语。已实现／测试通过／已上线现有QT网站及工作台。本轮不推送GitHub，Windows继续暂缓。

## 交付内容与边界

- Coding项目标题合为一行；账号、统计、文档管理与导入收进Project options。文档、正文与唯一编码树优先显示。
- Reading marks保留手动三态、保存与撤销，默认折叠。Coding actions保留编码／AI入口；不删除研究能力。移除空的Continue coding和重复提示，实际临时查看时仍显示返回。
- 搜索、段落位置与已有编码路径保留；未编码处不再占一行空说明。详情与说明按需展开。关闭首次可跳过引导后，1440桌面首段顶端227px，截图可核验；不把首次引导自动当作日常布局。
- 新建Bologna副本默认使用英语。**这是三个原访谈的精选译文：3个excerpt文档、25个树节点、11个教学编码关联，不是19份全文翻译，也不是新的独立研究分析。** 8段译文及3个嵌套关联逐一绑定原注释ID、原字符范围与原引文SHA。译文字符范围重新计算，不复用意大利语偏移。
- 教学文件为`demo-data/bologna-english.json`，`qualicraft/examples.py`生成确定性的项目与关联。名称、定义和树祖先来自源代码本；不根据层级替原项目推断研究角色。
- 网站默认Coding／关系图引文、报告五图／CSV读值、Notebook、可编辑Word、Research report、代码包及JSON都从同一教学项目生成，并标明译文范围。旧录屏明确标为Italian-source archive，不冒称英文录屏。
- 原Bologna数据库及原统计／绘图源码不变。全部旧网站图／计数／成果下载保留在`/QualiCraft/original-bologna/`。旧账号已有项目不改写；从Try English Bologna创建新副本。

## 验收证据

证据根目录`~/qualicraft-review/ux-84/`。319项Node通过；345项Python完成、3原有跳过；JS语法、源码diff检查和Next静态生产构建退出0。原生生成SVG尾空格及CSV的CRLF在完整diff检查中保留告警，未为消除告警改写绘图字节。原完整19文档图形基准仍用归档的原CSV执行，259行完整层级图内存／布局、原覆盖轴与原热图几何回归保留，未用小样例替代完整规模测试。

`ui.py local`8组通过：英文起步、折叠默认、原生键盘展开、Read／Undo、1440／1024／900／390保留唯一树／查询、准确选区缩放后赋码、保存刷新JSON、正常console／pageerror 0。

`site_check.py local`8组通过：首页删重与英文引文、窄屏无溢出、成果入口、全部生成文件哈希、旧来源下载、Help及键盘、正常console／pageerror／HTTP错误0。

五份独立代码实际在隔离目录重跑，各自CSV／SVG／PDF／PNG逐字节一致。Notebook 3页、报告12页通过文档技能渲染并检查所有页面，无重叠。Word仍可编辑，Word修改不会回写QT。

早期失败均保留：初次生成脚本额外参数与导入路径、旧固定数据数量断言、只读节点常量测试替身、首次缺pdf2image渲染环境，以及SSH上传引号错误；修复后重跑。原始日志不删除，不把这些记录为线上产品故障。

## 尚未全部完成

同学反馈的五图选择／空状态、文档误导入管理、候选完整浏览、窗口恢复、正常保存及冻结恢复延迟已分别上线（UX78–83）。本轮补齐日常顶部精简与英文教学示例；整套comments与后续要求仍不能统称全部关闭。

后续逐项：75D父节点计数解释、QT标志返回起步入口与新增编码延迟复核；75E批量导入到JSON恢复的统一版本联合验收及真实新手试用。多人编辑、faculty共享API不在已实现能力中。Pages自动发布／服务器OS开机注册仍独立待办；Windows、真实手机和原生辅助功能不代签。

## 线上完成记录

线上`ui.py online`8组通过，`site_check.py online`8组通过，正常console／pageerror／HTTP错误0；英文副本一次编码保存0.651秒（单次观察，不作性能承诺）。实际JS／CSS响应与本地文件逐字节核对。完整原19文档Bologna另在本地隔离恢复，重跑UX83全部15组窗口／阅读／搜索／选区／表单／刷新JSON回归通过。

只同步五个QT文件（app.js、style.css、server.py、examples.py及英文教学JSON）和61份清单保护的静态资源，重载QT自身网关，不改其他进程、系统服务、隧道或Render。文件回滚：QT/config/files-before-ux84b-20261021；整站回滚：QT/config/site-before-ux84b-20261021。上线字节及包SHA见raw/deploy-retry.txt。

首次同步的文案式就绪断言不匹配精简首页，触发自动回滚；修正为实际成果manifest核对后重试成功。该次回滚及最初上传引号失败原始输出均保留；不冒称首次即成功。GitHub未推送；Pages管理员设置和OS自启仍未完成。

网站：https://qt-review.taila524d0.ts.net/QualiCraft/
工作台：https://qt-review.taila524d0.ts.net/login
旧账号请选择Try English Bologna创建英文副本；旧研究数据与旧意大利语副本不会被改写。
