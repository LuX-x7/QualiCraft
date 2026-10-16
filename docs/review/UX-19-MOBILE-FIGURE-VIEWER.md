# UX-19 · UX17-02 手机图表原尺寸查看

2026-10-16。基线 `9bc837ca9b41080a04e175b275285e9d69d247fd`。本轮获用户授权只修复 UX17-02；只改工作台图表查看界面，不改统计、CSV、绘图路径或绘图结果。Windows 暂缓、未验证；不推送、不部署。

## 已实现

- 原图上方增加 **Enlarge figure / 放大查看图表**；真实预览加载成功后才启用，加载中或失败时不可打开空图。
- 使用同一份服务器 SVG Blob 打开原生模态查看器，默认 **100% 原尺寸**。原预览保留为整图概览。
- 提供适应宽度、原尺寸、25%–400% 缩放；图像始终保持原比例，完整内容通过原生横纵滚动查看。适应宽度可按容器实际宽度缩得更小，不截断原图数据；横竖屏切换后重新适应。
- 鼠标/触摸按钮、真实触摸横纵滑动、方向键、Home/End、`+`/`−`/`0` 可操作；Tab/Shift+Tab 保持在查看器内。Escape 或关闭按钮退出并返回入口焦点；浏览器 Ctrl/Command 缩放快捷键不被拦截。
- 保留原有图表/CSV/Python 完整 ZIP 下载；查看器另提供当前原 SVG 的直接下载。缩放和滚动不请求重新绘图、不写入项目。
- 查看器持有独立的同源 Blob URL，关闭后清理 URL、事件监听和页面滚动锁，原预览继续可用。没有前端重绘、统计重算、图像拉伸或新分析功能。

**关闭标准已满足：** 手机不再只有缩成小字的预览；可从图上方打开可读原尺寸图，横纵查看所有内容并下载完整文件。未将概览本身重新排版，也未在本轮处理手机文档入口 UX17-03。

## 数据与证据

- 新建可编辑 Bologna CC0 临时副本：`/tmp/qualicraft-ux19/data/qualicraft.sqlite3`，19 文档 / 317 编码 / 874 标注。完整项目 JSON 在浏览器操作前后相等。
- 独立网站/工作台入口：`http://127.0.0.1:4452/` → `127.0.0.1:8852/w`。普通 4445 预览保留原临时数据和后端。构建后按原端口/后端重启项目 Next 进程。
- 本轮受控 Chrome 只访问项目回环来源，不读取其他窗口或标签页。桌面 1440×900、手机 390×844、横屏 844×390；手机为模拟触摸上下文，双向滑动使用真实 Chrome 触摸输入事件，不能代替真机验收。
- 完整原始证据在 `~/qualicraft-review/ux-19/`。主结果 `accepted/results.json`；命令/退出码 `raw/run-index.json`；范围/哈希 `scope.json`。截图和实际下载不进 Git。
- 新回归脚本：`tools/e2e/plot_viewer.py`，只接受 loopback URL，验证前确认是 Bologna 项目。执行例：

```sh
python tools/e2e/plot_viewer.py --url http://127.0.0.1:4452 \
  --out /tmp/qualicraft-ux19/accepted \
  --baseline-dir /tmp/qualicraft-ux19/baseline-bundles
```

## 验收结果

| 检查 / 命令 | 结果及原始输出 |
| --- | --- |
| 新浏览器回归先跑旧实现 | 因手机缺少放大/原尺寸入口失败，exit 1；`raw/viewer-before.txt`、`before/results.json`、`before/screenshots/00-before-phone.png` |
| 同一回归跑最终实现 | **5/5，exit 0**；`raw/viewer-final.txt`、`accepted/results.json`。覆盖初始禁用、原尺寸/比例、触摸滑动、横竖屏、五图下载、键盘缩放上下限和完整范围、Tab、Escape、重开、焦点及项目不变 |
| 五图修改前后逐文件比较 | 五 ZIP 均 CRC 正常；每个包的 SVG/PDF/PNG/CSV/Python 共 **25 个成员全部字节一致**。直接下载的 SVG 等于实际预览 Blob 及 ZIP 内 SVG；五 CSV 等于原报告 CSV。`baseline-bundles/hashes.json`、`accepted/downloads/` 和主结果 |
| 额外鼠标/生命周期走查 | 鼠标开关/缩放/双轴滚轮/适应宽度，正反向 Tab、关闭后 URL 回收、原预览保留、滚动锁移除通过；`raw/mouse.txt`、`mouse-results.json`、`raw/supplement.txt`、`supplement-results.json` |
| `python -m unittest discover -s tests -v` | 150 项，跳过 3，exit 0；`raw/python-all.txt` |
| `node --test tests/*.test.mjs tools/report/*.test.mjs` | 74/74，exit 0；`raw/node-all.txt` |
| `node --check web/app.js` | exit 0；`raw/node-check.txt` 与命令索引 |
| `npm run build` | 此环境无 npm，exit 127，原始失败保留在 `raw/npm-build.txt` |
| website 下 `node node_modules/next/dist/bin/next build` | package.json 相同 Next 生产构建目标，exit 0；`raw/next-build.txt`。构建后重启，再执行最终浏览器回归 |
| 范围/空白/链接/报告哈希 | 仅两份工作台 UI、新浏览器回归和相关审核文档改变；`qualicraft/`、原 DB、网站/报告、CSV、绘图结果、依赖和部署配置不变。原始结论及命令见 `scope.json`、`raw/scope.txt`、命令索引 |

正常流程控制台/HTTP 错误均为空；原尺寸图保持 naturalWidth 显示，横向内容限制在可滚动查看器内，手机/桌面页面无新增横向溢出。缩放/适应宽度操作没有新增绘图请求。核心分析与报告检查没有用截图代替原始数据比对。

截图：`accepted/screenshots/01-phone-actual-size.png`、`02-phone-touch-pan.png`、`03-phone-landscape-fit.png`、`04-phone-coverage-actual.png`、`04-phone-hierarchy-actual.png`、`05-desktop-actual-size.png`、`06-desktop-keyboard-bottom-right.png`、`07-phone-entry.png`。

首次新版键盘验收发现原生 Tab 在边界会进入浏览器工具栏，已增加明确的双向焦点循环；`raw/viewer-first.txt` 与 `after/` 保留失败。另一次新增清理断言早于异步原生 close 事件，改为等待真实关闭清理完成后判断；`raw/viewer-second.txt` 与 `final/` 保留，未修改浏览器安全策略或隐藏产品错误。最终 5/5 和补充正反 Tab 均通过。

## 后续状态

UX17-02 关闭；UX17-01 保持上一轮已关闭。UX17-03 手机直接文档切换、UX17-04 旧录屏、UX17-05 健康探针继续待做，本轮未推进。用户整体视觉接受、实际 QT 试用和设备/VoiceOver/系统反馈确认另列；Windows 暂缓，未推送、未部署。完整本地提交哈希记入 Git 和 supervisor 审核包 `COMMITS.md`，不写入自身提交。
