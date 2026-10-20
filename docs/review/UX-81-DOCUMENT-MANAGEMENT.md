# UX81 — 75D 误导入文档管理

2026-10-20。仅 Bologna 隔离副本；不读取其他账户研究项目，不改统计定义、CSV契约、绘图路径或图形样式。Windows暂缓，不推送GitHub。

## 复现与决定

- 修复前没有文档管理／移除入口；受控Chrome打开Bologna副本，`Manage documents`按钮数量为0。向拟用移除路径提交请求返回400／`The requested action does not exist`，项目内容不变。证据：`before.py`及`before/results.json`、截图，退出0。不是“按钮藏得太深”。
- 新回归在旧实现上失败：Python因移除模块不存在失败；10条前端回归在HEAD旧脚本上失败。保留`raw/tests-before.txt`及`raw/frontend-before.txt`，不能把这些当作修复后通过。
- 管理入口不常驻增加Coding面板；项目标题旁提供 **Manage documents**。按文件名查找，最近加入在前；文件名、字符数、导入时间、编码数量及完整ID可区分同名副本，另有View查看原文。

## 移除规则

1. 单文档、稳定ID定位，不按名称合并或删除；先显示文件名、ID及该文档编码／建议／阅读标记数量，再勾选确认，最后点击Remove document。默认焦点在Cancel；未勾选不可提交，无批量全选删除。
2. 移除当前项目中的该文档、附属标注、建议、阅读状态及文档笔记；共享编码树及其他文档保持原样。移除有编码的文档后，该项目数据自然改变，之后重算的数量可能改变；**没有改统计定义来掩盖这种影响**。
3. 确认绑定整份已保存项目状态；确认期间新增标注、改名、笔记／阅读标记或校准发生变化，旧确认失效。请求失败不自动重放；提交后响应丢失也只发送一次，重新打开管理器读取真实保存状态并重新审查。
4. 通过既有Store事务移除，提交前核验确切的旧已提交状态恢复点；恢复失败则不移除。删除后仍走原提交后快照outbox；原恢复点按既有保留策略轮转，未改保留数量。故障注入验证回滚没有未提交内容快照，后续重试仍可保存。
5. **Recovery points**在同一管理流程内可达，包括窄屏；复用原Snapshots→Restore as a copy，不覆盖现项目。保留原审计与冻结结果，明确提示这不是彻底擦除所有副本。
6. 当前Comparative QCA案例仍映射此文档时，阻止移除，提示先在Export→Research report→Comparative QCA调整案例映射与校准；不静默改研究设计。已冻结QCA／报告及历史版本原样保留，其他文档移除后按原来源指纹规则提示过期。
7. 正在运行分析时阻止移除；成功后清除该文档待发送预览。模型开始前核对源文档存在及SHA，防止过期预览重新写入已移除文档。没有改变模型提示、建议裁决、统计或绘图算法。
8. 当前文档被移除后切到仍存在的文档／空项目，清掉失效筛选和临时定位；移除其他文档时保留当前文档、搜索、筛选。关闭／取消返回Coding；搜索框有文字时Escape也能一次退出，保留阅读位置。

## 验收与原始输出

证据根目录：`~/qualicraft-review/ux-81/`。测试脚本只访问本项目；真实手机、VoiceOver及Windows未在本轮认证，也没有真实新手试用签字。

- Node：`node --test tests/*.test.mjs`，295项通过，退出0；新增11条，`raw/node-final.txt`。
- Python：`MPLCONFIGDIR=/tmp/qt-78/mpl /tmp/qt-77-env/bin/python -m unittest discover -s tests -v`，341项、3原有跳过，退出0；新增11条，`raw/python-final.txt`。首轮因新测试读取文本未声明UTF-8而失败，修正后全量重跑；首轮输出保留。既有SQLite ResourceWarning保留，未屏蔽。
- `node --check web/app.js`、四个Python文件编译及Next生产构建退出0。环境没有npm命令，使用同一捆绑Node直接运行`node_modules/next/dist/bin/next build`；不是声称执行了不存在的npm命令。
- 本地Chrome主流程14组、键盘／丢失响应／触摸模拟／控制台4组通过。主流程覆盖1440×1000、1024×768、390px、同名导入、取消、已编码文档移除、准确恢复、JSON导出／刷新、QCA阻止与冻结结果保留、原Notebook／Word／报告／五图入口。
- 额外键盘验收发现原生搜索框会优先清空文字而吞掉Escape；已明确处理本管理流程的Escape并补回归。早期失败和最终通过输出均保留。
- 72份保护文件与修复前HEAD逐字节一致：除本轮所需core／server／ai外的既有`qualicraft/`、Bologna、网站公开资源及Render配置；详见`protected.json`。没有重新生成图表资产。

## 线上同步与范围

本地通过后只同步QT下六文件：`web/app.js`、`web/style.css`、`qualicraft/server.py`、`qualicraft/core.py`、`qualicraft/ai.py`、新增`qualicraft/document_management.py`。仅重载核实过的QT网关，由既有QT进程管理器拉起；未动隧道、其他项目、系统服务或Render。

回滚：`QT/config/files-before-ux81-20261020/`保留五份旧文件；回滚时还需移除本轮新增模块，再重载QT网关。部署记录在`QT/logs/ux81-deployment.json`，六份文件均核验SHA。

部署脚本首轮健康验证用匿名`/w/app.js`做SHA检查，该受保护路径正确重定向到登录页，造成脚本误报；独立复核登录HTTP200、新网关PID和六文件哈希后修正验收记录。没有为此放宽认证、再次重启或修改产品逻辑。认证后的资源与真实移除流程另行验证。

线上Chrome主流程14组及额外输入／故障4组全部通过（`after-online/results.json`、`input-online/results.json`，命令退出0）。正常控制台与脚本错误0；故意构造的陈旧确认400、丢失连接错误单独保留，不冒充正常操作错误。已通过登录→选独立Bologna副本→管理／查看／返回→取消／移除→保存／刷新→JSON导出／恢复点恢复，另复核冻结QCA／报告及旧入口。

| 单次实际耗时（秒） | 本地 | 线上QT |
|---|---:|---:|
| 打开管理器并读取已保存文档 | 1.213 | 2.564 |
| 读取指定文档的移除审查 | 0.058 | 0.835 |
| 移除未编码副本、核验恢复点并刷新界面 | 1.325 | 3.085 |

单次耗时只反映当次网络与Bologna副本，不是冷启动或p95保证。截图见`after-online/document-manager-desktop.png`、`removal-review.png`、`coded-removal-review.png`、`qca-mapping-protection.png`、`removal-review-mobile.png`及`input-online/touch-recovery.png`。

## 剩余75D

本轮只关闭误导入文档管理；候选列表完整浏览、窗口恢复等继续逐项复现。75B英文教学副本、75A网站本地简化上线、75E真实新手联合验收及独立发布事项继续开放。系统开机注册和GitHub Pages状态不因本轮改变。
