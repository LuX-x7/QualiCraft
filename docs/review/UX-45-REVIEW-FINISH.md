# UX-45 · QT 起步、简洁编码证据与审核推送

2026-10-17。基线 `ef44f91ca05001e47c6519c1f9d0b4fb6caeea10`。用户本轮授权新增起步页视觉、优化编码原文导出、同步产品能力说明，并尽快推送现有共建仓库。**本轮完成项可作 supervisor 审核版；完整最终产品仍未全部实现。**

## 已完成与使用方式

- 起步页复用本项目自己的 QT 像素标志与透视卫星绘制逻辑，纸色网格、粒子拖尾、鼠标视角及五模块标记。桌面左右、手机上下排列；原 Import／Bologna／继续项目／JSON 恢复入口保留。Pause 可用键盘操作，系统减少动态效果时静态绘制，调整窗口可重绘静帧，进入项目后停止循环与观察器。未改变访谈阅读区。
- Export → Coded transcript：正文去掉表格框线，HTML 使用清楚的树线、缩进和不同角色节点；Word 采用无可见边框的可编辑文字分栏。全文、高亮、每个保存关联、完整祖先链和身份保留，技术元数据分别折叠或放入 Record details 附录。Word 内部使用无边框布局表以保证两列续页，不是把文字／树栅格化为图片。
- Tree display labels 默认 Saved Groups／Codes；研究者可明确选择 Theme→Category→Code **展示预设**，分别给有子项的根、中间组、叶节点标记。原始父子关系不变，不能据此认定研究主题／类别已建立。不同深度保留，不强行压成恰好三层；完整语义角色设置仍待做。`role_labels=saved|theme-category-code` 在 HTML、Word、版本查询间一致，非法／重复选择返回 400。
- 网站两处格式介绍共用六格式清单；旧四导出、所有原图／表／下载、录屏和静态替代保留。旧 Export 录屏说明注明它早于新增的两种格式，没有冒称已重录。
- 网站 Methods 和工作台 Export 的折叠说明都明确：已有编码／层级／备忘录／描述性计数／图／证据导出；TA 和内容分析可共用这些工具。Comparative QCA、Analysis Table／Narrative Analysis 编辑器尚不可用。用户最终要求仍保留三方法。

## 验收与命令

原始输出、下载、截图、Word 渲染均在 `~/qualicraft-review/ux-45/`，不进 Git。此次只用新建 Bologna 临时工作副本，原种子仍为 19 文档／317 编码／874 关联；未读取真实访谈。

| 命令／检查 | 结果 | 原始证据 |
| --- | --- | --- |
| `python -m unittest discover -s tests -v` | 174 测试，3 跳过，OK | `raw/python-full.txt` |
| `python -m unittest discover -s tests -t . -v` | 174 测试，3 跳过，OK | `raw/python-package-authorized.txt` |
| `node --test tests/*.test.mjs tools/report/*.test.mjs` | 181／181 通过 | `raw/node-final.txt` |
| `node --check web/app.js`、`node --check web/welcome-orbit.js`、Python 语法 | 退出 0 | `raw/syntax.json` |
| `npm run build` | npm 不在此环境，127 | `raw/npm-build.txt` |
| 隔离源副本 `node node_modules/next/dist/bin/next build` | 退出 0；原物理依赖副本，无安装／更新 | `raw/build-final.txt` |
| `tools/e2e/review_finish.py --url http://127.0.0.1:49277 --out …` | 7／7，正常控制台／HTTP／项目外请求 0 | `raw/browser-final.txt`、`browser-final/results.json` |
| `tools/e2e/transcript_export.py --url … --out …` | 14／14；全文、874 关联、双向定位、旧四下载、无修改与旧文件提示保持 | `legacy-browser/results.json` |
| `tools/site/story_acceptance.py --url … --out …` | 10／10，594 行原 CSV 读值、五图、报告桌面／手机通过 | `raw/story.txt`、`story/results.json` |
| `tools/site/w03_acceptance.py --url … --out …` | 7／7；完整网络、320px／横屏、十资产／十媒体、旧四格式保留 | `raw/w03.txt`、`w03/results.json` |
| documents `render_docx.py`，下载文件的正文／树视觉检查 | 最终 Word 15 页；正文与树可编辑，完整身份另附录 | `raw/word-final.txt`、`word-final/` |
| 基线 SHA256 保护范围 | 33 文件相等，无变化 | `raw/scope.json` |
| 必跑网站禁词 grep | 退出 1，0 匹配 | `raw/forbidden-copy.txt` |
| 待推送历史及当前文本的私有文件名／姓名、密钥模式检查 | 913 历史 blob，0 匹配；不是所有秘密的形式化保证 | `raw/privacy-scan.json` |

新增有意义回归覆盖：显示预设保留 ID／实际路径／原句、拒绝非法参数、不修改项目、简洁树及无边框 Word；查询参数与版本策略；卫星减少动态效果／调整窗口重绘／暂停／离开后的清理。既有 14 项导出浏览器回归继续通过。W03 的四格式断言更新为六格式，并单独核对旧四标签与结构保留。

保留环境尝试：第一次 package discovery 在沙箱内运行，17 个 HTTP 测试因本地 socket 的 PermissionError 失败，**不是收集问题或产品回归**；以允许本地端口的执行方式重跑后同一入口通过，原输出为 `raw/python-package.txt`。历史早期 `-t .` 收集问题不删除，但不能把当前已通过入口仍称为失败；没有修改 `tests/__init__.py` 或测试入口。第一次隔离构建复制范围含本地被忽略配置，随后删除临时副本中的忽略配置、改用 Git 跟踪／本轮新文件清单重建，最终构建与预览均用后者；未读取或提交该配置。浏览器早期截图保留，最后一次静帧重绘与手机焦点间距修正后重新验收。

手机为 Chrome 390px 触摸模拟，系统减少动态效果为浏览器媒体模拟；不替代实体手机、VoiceOver 或 OS 下载提示。Windows 暂缓且未验证。

## 审核入口与截图

本机预览：[网站](http://127.0.0.1:49277/) → [工作台](http://127.0.0.1:49277/w/?lang=en)，选择 **Bologna · QT notebook review** → Export。项目同名多份来自验收独立恢复，内容相同；原种子不改。然后看 [报告](http://127.0.0.1:49277/report)。本机服务依赖此电脑；现有 Render 网站没有因本轮更新而部署。

- [桌面起步](/Users/chehaijun/qualicraft-review/ux-45/browser-final/screenshots/entry-1440-reduced-False.png)
- [手机起步](/Users/chehaijun/qualicraft-review/ux-45/browser-final/screenshots/entry-390-reduced-False.png)
- [正文与清晰归属树](/Users/chehaijun/qualicraft-review/ux-45/browser-final/screenshots/notebook-1440.png)
- [网站六种输出说明](/Users/chehaijun/qualicraft-review/ux-45/browser-final/screenshots/site-six-outputs-1440.png)

## GitHub 范围与剩余事项

用户明确授权推送既有 `https://github.com/LuX-x7/QualiCraft.git`，保持可见性。只读 API 核对为 **public**、默认 **main**；远端 main 为 `56581781d20f687955a4cae2ef3c7d331dbbee8e`，是本地基线的祖先，未发现需合入的 main 新提交。当前本地分支是 `t7-site`，推送范围限此审核分支，不强推、不合并或更新 main，不改变可见性，不新建发布版本。实际远端核验与完整提交哈希收进审核包 `COMMITS.md` 和 `raw/push*.txt`；仅成功核对远端 ref 后向用户报告推送完成。

`render.yaml` 两项 `autoDeployTrigger: 'off'` 保持字节相同；本轮不部署、不发送邮件。GitHub 源码分支与在线站点是两个不同交付物。

最终标准仍开放：**可编辑 Analysis Table／Narrative Analysis、持久语义角色设置、完整方法流程与独立 Comparative QCA、百份容量／失败恢复实测**，以及研究者／supervisor 接受、当前 VoiceOver／实体设备／下载反馈。独立固定分页 PDF 单列后续；现有图表 PDF 不受影响。按 [最终验收标准](FINAL-ACCEPTANCE-V2.md) 一项项实现与验证，不能将当前代码审核推送称为产品全部完成。

### 实际推送结果：权限阻塞，未发布

功能提交 `3710a05df86e44940aa3216f1469e747291924d3`。`git push --dry-run origin HEAD:refs/heads/t7-site` 退出 0，但实际 `git push origin HEAD:refs/heads/t7-site` 被 GitHub 服务端拒绝：现有 Personal Access Token 缺 `workflow` scope，不能发布待推送历史中 UX-09 的 `.github/workflows/test.yml` 更新。这是 GitHub 凭据限制，不是本机自动审批拒绝或测试失败。没有把 dry-run 成功当作实际成功。

第一次 SSH 因本机没有已知主机密钥拒绝连接；使用 [GitHub 官方公开指纹／主机密钥](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints) 在临时 known_hosts 中严格验证后，再次返回 `Permission denied (publickey)`。未改全局配置、未显示令牌／私钥。只读远端检查显示没有 `t7-site` 分支，main 保持原哈希。原始输出见 `raw/push.txt`、`raw/ssh-auth-verified-host.txt`、`raw/remote-after-rejection.txt`。

需要用户在本机为当前 Git 凭据补齐 workflow 权限，或配置已有权限的 SSH 登录，然后重试同一审核分支。完整候选保留；不删除 CI 文件、不改写现有审核历史来绕过限制。当前只能提供本地预览／审核包，不能声称 GitHub 更新或新站部署完成。

用户在拒绝后明确选择“暂时保留本地提交”。因此本轮停止远端重试，按本地审核候选交付；后续重新推送需要用户新指示。
