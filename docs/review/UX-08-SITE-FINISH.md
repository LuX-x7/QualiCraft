# UX-08 · 网页收尾与参考效果复核

2026-10-15。基线 `86a2c0dc46eac4be37e6adc63f819f6a42c985fe`。用户要求复核 Pi 与阶跃报告的借鉴效果、完成 Windows 以外的可执行收尾，并授权把当前审核分支推送到现有共建仓库，保持可见性；不部署。

## 判断与修改

当前已实现简洁介绍、按需展开、五模块图解与真实录屏、问题→原图→准确计数→限制的报告路径，以及原句/编码/主题的可追溯关系。适合作为 supervisor 审核版。参考的是信息组织和阅读节奏；图表仍为已有工作台导出，不是参考站的图表或素材。

本轮修正三个具体摩擦点：收紧首页标题与上下留白；让桌面 Coding 图解默认完整显示并取消面板内层滚动，展开来源/定义/录屏时改用正常页面滚动；全站提供一个 main 地标和键盘“Skip to content”，报告内部容器不再重复 main。页脚提供核实存在的项目 GitHub Issues，未编造邮箱。

桌面 1440×900：首屏从 698.59px 收紧到 588.32px；原 Coding 面板 clientHeight 786px / scrollHeight 927px，现为 764px / 764px，外框 766.48px。普通阅读时保持 sticky；短窗口和打开详细内容时回到页面流。手机继续使用原来的上下排列和 44px 控件。

## 证据

原始输出及截图位于 `~/qualicraft-review/ux-08/`（执行中先写入 `/tmp/qualicraft-ux08/`）。

- `raw/build-final.txt`：通过本地 Node 执行网站 `next build`（与 package.json 的 build 脚本相同），退出 0；已重启 4445 本机服务。
- `raw/node.txt`：49 项 Node 回归通过。工作台 JavaScript 语法及 `git diff --check` 退出 0。
- 桌面和 390×844 手机视口：页面无横向溢出；键盘跳转正文后焦点为 `site-content`，各页只有一个 main；Coding 的 ArrowRight / End / Escape 能切换高亮、展开来源并返回；展开时使用页面滚动。
- 手机报告选择频次 23，键盘激活定位后完整表打开，焦点在对应数值行。当前标签页控制台 warn/error 为空。
- 浏览器真实 CSV 下载完成，返回文件 `/Users/chehaijun/Downloads/frequency (1).csv`：676 字节，与原报告 CSV 相同，SHA-256 `958c9bbd833ad2228230f0927bc09a35cd78824571328b03e572a439152cd82c`。浏览器工具此次返回较慢；没有把工具延迟当作产品错误。
- 通过 GitHub 公共 API 核实 `LuX-x7/QualiCraft` 当前 `private=false`、默认分支 `main`、Issues 已开启。历史“private”说明是旧状态，不是当前发布判断的依据。

未修改 `qualicraft/`、`web/`、数据库、统计定义、图表、CSV、数据卡、录屏、字体和部署配置。未重新生成报告资产。

## 人工验收与发布范围

真实手机、VoiceOver、系统减少动态效果及 OS 下载完成提示由用户配合验收，未回传前保持未验证。为手机提供 4446 临时局域网入口，代理到独立只读 Bologna 副本；四个 GET 返回 200，POST 返回 403，数据库与基线字节相同。手机入口不是部署，不包含密钥或私人数据。

Windows 继续暂缓。GitHub 仅推送当前审核分支 `t7-site`，保留 `main` 和可见性；自动部署保持关闭。实际提交、推送结果与余项见总体计划和审核包。
