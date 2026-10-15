# UX-03B · 五模块展示统一

2026-10-15。基线 `a1ff283fca5e33e85f5681eb4bcdd58b5d11267e`。本轮仅网站展示，未改工作台、统计、绘图路径、原始资产或部署配置。

Import 显示原始 Bologna 文档、准确原句及字符范围；Analysis 读取现有频次 CSV 前三行，切换后显示 23 / 21 / 19；Plotting 可切换全部五张原 SVG、各自 manifest 单位句、CSV 与报告入口；Export 解释 Project JSON / Codings CSV / Matrix CSV / Methods Markdown 的现有内容。所有图解明确标为 illustration / guide，不模拟保存或下载成功。Coding 样板及五段真实录屏、原始静态替代均保留。Analysis 的热力图入口已指向 Figures。

## 验收与证据

原始输出与截图：`~/qualicraft-review/ux-03b/`。

- `raw/build-final.txt`：`npm --prefix website run build`，退出 0；早期在根目录直接 build 的退出 254 保留于 `build.txt`，随后正确 prefix 构建通过。
- `raw/audit.txt`：退出 0；原始 Bologna 来源、ID、范围与全文路径、全部十个 manifest 文件哈希、HTTP 文件字节一致；浏览器 21 / 19 等于 CSV。受保护路径与基线无差异。
- `raw/forbidden-copy.txt`：要求的禁用词扫描退出 1，无匹配。
- `browser/observations.json`：桌面、390×844、选择与方向键/Home/End/Escape、全部五图、真实导入视频播放和静态替代；手机默认 682 词，无页面横向溢出，控件至少 44px。最终四种导出格式另行核对。
- `browser/console-final.json`：错误及警告为空。`B01`…`B12` 截图展示原始图、读值和说明。

构建后已重启本地服务。浏览器只使用同一项目标签页；未读取其他窗口。未重复跑未改动的后端全量测试：3A 的 140 项（跳过 3）是前轮记录。真机触摸、Windows、系统级减少动态效果本轮未验证，后者继续在第 5 阶段处理。

下一步：4A 覆盖/共现/层级 CSV 读值与行定位，4B 可追溯例证，5 视觉和响应式收尾。不推送、不部署。
