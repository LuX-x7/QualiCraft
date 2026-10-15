# UX-09 · GitHub 源码交付与验收入口

> 当前决定：用户随后明确反馈网页文字仍多、未达到参考效果；源码推送暂停。UX-10 重新进行视觉验收，人工试用状态恢复为待确认。本页记录发布准备，不代表已经推送或视觉目标已被接受。

2026-10-15。应用基线 `f57ef0f605c4746b9337f42e0dddf786548c4d43`（UX-08）。用户已明确指定现有共建仓库 `https://github.com/LuX-x7/QualiCraft.git`，推送并保持现有可见性。不创建新仓库，不修改 `main`，不部署；Windows 继续暂缓。

## 已完成

- 修复 `unittest -t .` 的真实收集问题：给 tests 增加包入口；没有删测试或更换命令。两种原命令均实际运行 148 项、跳过 3、退出 0；逐项规范化 ID 集合相同。为避免把 tests 带入发行包，setuptools 查找范围明确限制为 `qualicraft*`。
- CI 安装既有 requirements，再运行两种 Python 收集、工作台语法与 49 项 Node 回归；增加独立网站构建 job。只配置检查，不配置部署。远端运行结果在推送后单独记录，不把本地通过当作 CI 已通过。
- 更新另一台电脑的启动说明：明确 `t7-site` 审核分支、Bologna 可编辑副本、依赖和两服务入口，不再要求私人 Guide 或模型密钥；保留原始示例库。
- README 中英文同步修正旧的站点数据库植入、环境变量来源与重复段落。正式前台是英文，工作台保留自己的语言开关。
- render.yaml 仅更正过期的 private 注释；解析后的所有配置值和两个 `autoDeployTrigger: 'off'` 均不变。
- 通过公共 GitHub API 核实仓库当前公开、Issues 已开启、默认分支 main。远端 main 是当前审核分支的祖先，检查时没有独有的未合并 main 提交；push dry-run 成功，不覆盖同学分支。

## 原始证据与失败记录

`~/qualicraft-review/ux-08/raw/`：`discovery-before.txt` 保留原收集失败；第一次修复后测试已收集 148 项，但沙箱禁止临时 HTTP bind，产生 10 个 PermissionError。相同测试在允许回环监听的环境重跑，两种命令分别通过，见 `unit-top-level-final.txt`、`unit-standard-final.txt`。`discovery-parity.json` 记录 148 个 ID 相等和发行包范围。

`node.txt` 49/49；`build-final.txt` 构建退出 0，`forbidden.txt` 禁用文案扫描退出 1、无匹配；`scope.json` 受保护路径无变化。有限 token/private-key 格式扫描没有匹配，不把这当成覆盖所有历史内容的保证。浏览器验收与 CSV 实际下载见 UX-08。

本次不是新增统计、修改工作台行为或生成新图；`qualicraft/`、`web/`、数据和报告资产均保持原样，部署配置值未变。

## 人工回传与范围

用户最初选择“四项均通过（补充设备信息）”，随后明确说明尚未试用 QT、未找到链接。因此该选择不能作为本轮人工验收通过的证据；手机实机触摸、VoiceOver、系统减少动态效果、系统下载提示均恢复为待确认，机型/版本尚未提供。Windows 未验证。用户另已明确允许本项目 `tools/motion/measure.py` 使用独立受控浏览器；逐帧实测结果保留在本轮 motion 目录，不读取其他已打开窗口。

源代码推送、GitHub Release、网站部署是不同操作。获授权的远端范围仅为 `t7-site`，当前尚未实际推送；安装器、自动部署和仓库可见性均不变。正式自定义域名并非源码推送的前置；现有网站地址留在 README，部署时 SITE_URL 需使用实际服务地址。原 Windows 人工门禁仍未完成。
