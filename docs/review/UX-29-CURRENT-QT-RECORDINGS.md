# UX-29 · 当前 QT 五段真实录屏

2026-10-16。基线 `a29735d564b65e0b4fbe1e3a6a718e53a87dd3d0`（UX-28 文档，工作台产品为 UX-27）。**仅关闭 UX17-04：五段旧录屏已更新为当前 QT；不改工作台、统计、绘图或数据。** Windows 暂缓且未验证；不推送、不部署。

## 真实结果与接入

- **Import**：从 Bologna 导入实际文档，出现保存回执、原文、31 段和当前阅读栏；录像内可折叠详情。
- **Coding**：真实鼠标选区后向既有编码保存一条演示标注；显示原句、高亮、边注和完整主题／父码／编码路径。这是 UI 测试动作，不声称是研究者认可的材料解释。
- **Analysis**：现有关系图展开原句节点，选中上述编码和原句，显示准确全文、文档及 `[2, 38)` 范围；不再用频次列表充当关系图演示。未选节点淡化是现有选择状态，不是覆盖画面的模态遮罩。
- **Plotting**：真实按主题频次图，八个条形、控制项及下载可见；实际 ZIP 包含 SVG/PDF/PNG/CSV/Python 五个成员并通过 CRC。统计定义、绘图文件和原报告不改。
- **Export**：实际完成 JSON、coding CSV、matrix CSV、methods Markdown 四种下载并逐字节对照独立 API；录像展示最后一次 JSON 下载后的 QT 原生面板、真实文件名／1,154,960 B／预览。“Sent to browser”不替代 OS 完成提示。

四段录制未修改的 1440×1000 完整工作台；Export 是实际不透明对话框内侧的 696×696 连续裁切（x=372、y=152），不包含外围灰色 backdrop。没有隐藏／改造 DOM/CSS、拼接场景或重构假界面。五段均由连续时间戳截图编码为 3 秒、12 fps、无音轨 VP9；各 36 帧，共 180 帧。207 张原始抓帧、trace、实际下载和失败尝试均保留在仓库外。

只替换 `website/public/clips/` 十个生产素材，更新 `clips.ts` 的尺寸、准确描述与 SHA 前缀缓存参数；通用图注标明 QT 和录制日期。仍在原有可展开入口按需播放，不自动播放／循环。Show still image、全尺寸真实静帧、减少动态效果、无 JS 原生展开和视频失败替代均保留。原 Coding 图、Analysis 简洁路径、追加圆点网络、全部五图和报告未删改。

| 片段 | 实际像素 | WebM 字节 | 完整视频 SHA-256 |
| --- | --- | --- | --- |
| import | 1440×1000 | 392,343 | `785fb7706310136d7c862a289de419b9f69d7140162f6dbb30829aa190048b5c` |
| coding | 1440×1000 | 237,039 | `f34881af0697ecb5625daee04a0259515c83ba08877d11d94f3266eaa19b2e9e` |
| analysis | 1440×1000 | 301,938 | `2c7f6637faf8dc505474276e9fd2394bdebdf564a6670f13a0205121a80b0597` |
| plotting | 1440×1000 | 130,747 | `8fddadea7edb518e59d0353b1c424f6b3211253ae043ccd33a3050b4280837d9` |
| export | 696×696 | 50,129 | `59c84668ade4612ba79e1486c637cc8cb4df2969945bfed30de7bc60af59ca40` |

十个素材的完整 SHA、编码命令及源帧数量见 `recording-receipt.json`；静态图来自实际视频首帧，非另做演示图。录制只使用 `/tmp/qualicraft-ux29/data/` 下 Bologna 副本，服务为 4462 → 8862，模型请求不可用。通过界面主动再复制后操作，最终副本 **20 文档／317 编码／875 标注**；原种子仍 **19／317／874**，JSON／审计和源数据库字节不变。固定报告仍是 19／874，不能拿副本的 875 与固定报告比较来推断数据丢失。

## 验收证据

全部原始输出／截图：`~/qualicraft-review/ux-29/`；审核包：`~/qualicraft-review/supervisor-review/`。`raw/run-index.json` 逐条列命令、退出码和输出。所有测试浏览器均是独立受控 Chrome，只允许本项目 loopback，不读取其他窗口／标签。

| 命令／检查 | 结果与原始输出 |
| --- | --- |
| `python tools/e2e/record_qt_modules.py --url http://127.0.0.1:4462 --out /tmp/qualicraft-ux29 --ffmpeg <已登记运行时>` | 退出 0；五段实际结果、四格式文件字节和原种子不变；`raw/record-final.txt`、`recording-receipt.json`。最终编码显式加 `-r 12`，见 `raw/encoding-duration.txt` |
| `python /tmp/qualicraft-ux29/audit_media.py` | 退出 0；180/180 帧逐帧 MD5 与真实采样序列相同、五张静帧像素与首帧相同；五段均 3 秒／无音轨／<1.5 MB。en/it/zh OCR 全帧无 Han／禁用词；DOM 边界与人工逐段检查无模态灰罩；`raw/media-audit-final.txt`、五份 `raw/ocr-*.txt`、`media-audit.json` |
| `python tools/site/recordings_acceptance.py --url http://127.0.0.1:4462 --out /tmp/qualicraft-ux29/site-final --receipt /tmp/qualicraft-ux29/recording-receipt.json` | 退出 0，**9/9**；桌面 1440×900／390×844 触摸模拟、五段原生实际播放、十个素材字节／206、静帧与比例、Enter／Space／Escape 焦点、减少动态效果、无 JS、五段故障回退、控制台／HTTP；`site-final/results.json` |
| `python tools/site/story_acceptance.py --url http://127.0.0.1:4462 --out /tmp/qualicraft-ux29/story` | 退出 0，**10/10**；无点击正常滚动固定左窗、原简洁路径和追加网络均保留，悬浮／拖动／手机／键盘及全部 **594** CSV 读值；`story/results.json` |
| `python -m unittest discover -s tests -v` | 授权隔离环境退出 0，**155 项、跳过 3**；`raw/python-tests-final.txt`。首次沙箱内 15 个端口绑定错误保留在 `raw/python-tests.txt`，未改测试入口或产品来规避 |
| `node --test tests/*.test.mjs tools/report/*.test.mjs`；`node --check web/app.js` | 均退出 0，**108/108**；`raw/node-tests.txt`、`raw/js-syntax.txt`；两个新 Python 工具无缓存语法编译与既有 CSS 配平通过 |
| `npm run build`；`node node_modules/next/dist/bin/next build`（website） | npm 不可用退出 **127**；直接执行同一 Next 构建退出 **0**，含 TypeScript／路由；`raw/npm-build.txt`、`raw/build.txt`。已有 middleware 提示未改动 |
| `grep -rniE "publication-grade|publication-ready|publication-oriented|put in a paper|期刊" website/` | 无匹配，退出 **1**；`raw/forbidden-copy-grep.txt`（空输出配退出码）；错误使用的早期 rg 命令不作为通过证据 |
| `python /tmp/qualicraft-ux29/verify_scope.py` | 退出 0；**111** 个非授权产品／数据文件不变，只改 12 个预期网站产品／媒体文件；**10** 个 manifest 资产哈希正确；原种子及报告不变；`scope.json`、`raw/scope-final.txt` |
| `python /tmp/qualicraft-ux29/restart_previews.py`；`python /tmp/qualicraft-ux29/normal_preview.py` | 均退出 0；构建后重启 15 个登记前台；常用 **4445** 首页／报告／工作台／健康与 bootstrap 200，十素材与磁盘一致，新 Analysis 键盘播放和 Export 静帧可见，正常控制台／HTTP 无错；`normal-preview.json`、`services.json` |

原始失败未删除：首轮重叠选择未打开弹窗；第二轮关系图运动导致超过体积目标；第三轮测试等待表达式触发 CSP（改为合法函数，无 CSP 绕过）；第四轮成功录制却误收起原句节点未采纳；最终第五轮条件展开并断言节点存在。编码器最初容器末帧时长 2.917 秒，已按真实源帧重新明确输出 12 fps，最终三秒。媒体首验只到该时长断言即停，不能算 OCR 通过。手机脚本首次点在原生进度条而非播放键，8/9；按截图中播放按钮位置纠正后 9/9。范围脚本最初误用 manifest 的 `assets` 键，按实际 `files` 修正后通过。均保留失败原始输出；没有为迎合验收修改工作台。

## 截图与当前剩余事项

- 网站实页：`screenshots/normal-4445-analysis.png`、`normal-4445-export.png`；桌面／手机所有五段播放／静态／无 JS／减少动态／故障图片见 `site-final/`。
- 工作台源结果：`screenshots/import-source.png`、`coding-source.png`、`analysis-source.png`、`plotting-source.png`、`export-source.png`；Export 全页原始截图故意保留真实 backdrop，仅生产视频使用内侧裁切。
- 全段接触表：`screenshots/*-contact.png`，供人工核对第 1/12/24/36 帧；完整逐帧 PNG 在 `audit-frames/`。接触表仅作 QA，不是生产视频素材。

**仅 UX17-04 关闭。** UX17-05 启动探针仍为已知 P3，本轮未改 `start.js`；T03 明确已读／编码范围概览、W03 其余视觉、用户／supervisor 审美确认、实体手机／VoiceOver／系统减少动态／OS 下载提示与发布门禁继续开放。手机检查是模拟，不声称已做真机；Windows 暂缓且未验证。此前 UX-28 37 项联合验收为历史完整路线证据，本轮 9+10 检查与其分开计数；不冒称整体项目完成。

一项工作流一笔本地 `UX-29` 提交；完整哈希与最终范围／干净工作树见审核包 `COMMITS.md` 和 `post-commit.json`。生产素材入库，抓帧、trace、验收截图、原始输出和下载只存仓库外；不推送、不部署，不改自动部署配置。
