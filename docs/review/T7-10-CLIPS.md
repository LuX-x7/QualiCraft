# T7-10 — 真实录屏与静态替代

本轮基线：`dcdb3e18440f7377c67e044b09fc7679ac4cd4f1`。仅修改首页五模块演示组件、对应样式与媒体清单，加入三个已审核的视频片段和真实静帧。工作台、报告数据、数据卡片、原始录屏和部署配置未改。没有推送或部署。

## 五段源素材的审查

来源均为 `tools/e2e/recordings/` 的 Bologna CC0 示例，未使用 `_deprecated/`。每段原片均为 8.75 秒、12 fps、105 帧。原 trace 记载录制地址 `http://127.0.0.1:8810/w/?lang=en`，其提交字段可解析为 `56581781d20f687955a4cae2ef3c7d331dbbee8e`；这是素材携带的历史元数据，不表示本轮重新录制。

| 模块 | 汉字 | 结果与遮罩检查 | 本轮处理 |
| --- | --- | --- | --- |
| Import | 105 帧 OCR 未检出汉字 | 全段停留在导入对话框，灰罩可见，未显示导入完成的文档 | 不接入，保留 clip pending |
| Coding | 105 帧 OCR 未检出汉字 | 已编码段落与边栏标签清晰，无灰罩；演示的是已有结果的阅读，不是一次新编码操作 | 接入 0–3 秒 |
| Analysis | 105 帧 OCR 未检出汉字 | 计数结果可见、无灰罩；前段含网站禁用措辞，不能直接接入原片 | 仅接入 2.5–5.5 秒的后续结果列表 |
| Plotting | 105 帧 OCR 未检出汉字 | 实际图表、设置项与下载入口可见，无灰罩；不声称片段展示了下载完成 | 接入 2.5–5.5 秒 |
| Export | 105 帧 OCR 未检出汉字 | 前段是编码界面，随后打开带灰罩的导出对话框；全段没有下载完成或文件结果 | 不接入，保留 clip pending |

原片 SHA-256：

```text
seg1-import.webm  9ff58d4bd4f568b04970fe2672dc41b424951b99ad73b43458af962791e2d08e
seg2-coding.webm  ca0cd575ef3f2df71a71d92888b6835c40cbab8ec5fa86594c4d02cb29107635
seg3-analyse.webm 2992402348553ca9eaa1133c079ba00c6a8cacb11339fa18d4582ca3d0bead84
seg4-plot.webm    d7212f2ce66eebda258cc72c875334ae4ca9e4441e0e2638534484cbe1fb2087
seg5-export.webm  ee26ab370184b62234eeaa4ec14ac652ee2d5dbd8222d600bf7559a7984cdf99
```

## 接入资产与静帧

只进行时间截取并用 VP9 无损重新编码；未裁切、遮盖、重绘、拼接或修改画面内容。每段 36 帧，名义时长 3 秒，浏览器报告最后呈现时间为 2.917 秒。解码后的全部 YUV 帧与原片对应区间逐帧相同。

静帧取原片 Coding 第 36 帧、Analysis 与 Plotting 第 66 帧（帧号从 1 起）。PNG 解码像素与这些源视频帧一致。三个片段均无音轨；每个 WebM 小于 1.5 MB。

| 文件（`website/public/clips/`） | 字节 | SHA-256 |
| --- | ---: | --- |
| coding.webm | 662212 | `d6a8d930f14d8229383082c83e2730536a75d63e4a027dd0b186cc64e9022ca0` |
| coding.png | 1357311 | `5a8c6c3dc689c9410de1fb3fd1611e92af3865aedda2d7a69557649738d735fb` |
| analysis.webm | 370091 | `e4ef4ae6d13c83df3d06804ac219beda1baa6383538fa547aad1a67839b7b0a8` |
| analysis.png | 633956 | `272113a0da5a14b8883947ca13bf59efd21eac2beb687c803f659fa6f76bf213` |
| plotting.webm | 458451 | `3cdf62dcb272ccf273f3546011c14a90af3840d0a3bff1721bbdc7fc64b457c6` |
| plotting.png | 372962 | `e66b2bf91786d1c476548a462bc03428ef00afe644d39f82d216d2fc6dc4b93b` |

FFmpeg 7.1 的生成参数（完整路径及执行结果见外部原始输出）：

```text
ffmpeg -i SOURCE.webm -vf trim=start=START:duration=3,setpts=PTS-STARTPTS -an -c:v libvpx-vp9 -lossless 1 OUTPUT.webm
```

桌面保留左侧固定演示、右侧步骤；手机把媒体放在各步骤内，键盘定位到步骤开头。视频由用户主动播放，支持原生控件、真实静帧切换和全尺寸静帧链接。视频加载失败时自动显示对应静帧和状态提示。减少动态效果偏好会关闭跟随切换，按顺序显示静帧；当前浏览器接口没有媒体偏好模拟能力，此偏好未做运行时模拟，手动静帧与手机顺序布局已实际验证。

## 验收与证据

证据根目录：`~/qualicraft-review/module-clips/`，截图和审查画面均未加入仓库。生产媒体是用户本轮授权接入的网站资产。

| 检查 | 结果与原始输出 |
| --- | --- |
| 源视频解码、帧数、原 trace | `raw/source-audit.txt`：五段各 105 帧，解码退出码 0，原 trace 共 525 帧无汉字记录 |
| 五段源视频逐帧 OCR | `raw/ocr-sources.txt`：独立复核汉字和禁用措辞；原分析前段单独标出 |
| 接入视频全部帧 OCR | `raw/ocr-accepted.txt`：108 帧，未检出汉字或禁用措辞，退出码 0 |
| 逐帧与静帧来源一致性、体积 | `raw/verify-assets.txt`：三段视频及三张静帧全部通过，退出码 0 |
| 桌面 1440×900、手机 390×844 | `browser/checks.json`、`raw/browser-validation.txt`：三个播放器可实际播放，均不自动播放，静帧可加载；无横向溢出 |
| 键盘 | 同上：方向键、Home、End、视频 Space、静帧 Enter、桌面 Tab 到媒体操作通过；焦点可见 |
| 故障回退 | 同上：临时移走绘图 WebM，确认 HTTP 404 后自动显示正确静帧；媒体已原样恢复。故障注入的预期控制台错误与正常浏览记录分开保存 |
| 正常浏览控制台 | `browser/checks.json`：最终桌面、手机、首页和报告浏览无 warning/error |
| 页面、媒体与 Range 请求 | `raw/http-and-scope.txt`：页面 HTTP 200，六个媒体文件与磁盘字节一致，三段视频 Range 请求返回 HTTP 206 |
| 生产构建 | `raw/build-final.txt`：`npm run build` 退出码 0；保留已有 middleware 迁移提示，不在本轮改动 |
| 网站禁用措辞 grep | `raw/forbidden-copy.txt`：无匹配，退出码 1 |
| 范围与提交 | `raw/http-and-scope.txt`、`raw/final-scope.txt`、`raw/commit.txt`：工作台、原始素材、报告资产、数据卡片和部署配置保持基线；完整提交哈希见 commit.txt |

主要截图：`browser/desktop-coding-still.jpg`、`desktop-analysis-still.jpg`、`desktop-plotting-still.jpg`、`phone-plotting-still.jpg`、`phone-video-unavailable.jpg`。另附桌面与手机首页、报告页截图。Windows 未验证；本轮未运行或改变工作台分析。

后续需要重新录制 Import 和 Export 的完成状态；不以其他模块画面代替这两项结果。
