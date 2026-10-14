# GitHub 权限排查结论

**排查时间：** 2026-09-27
**账号：** `HaijunChe`
**仓库：** `https://github.com/LuX-x7/QualiCraft`
**结论一句话：协作邀请其实已经生效了，你有 push 权限。你看到"没显示"是正常的，而我和本地 git 推不上去是另外两个完全不同的原因。**

---

## 一、我实际验证到的事实（附证据）

| 检查项 | 结果 |
| :--- | :--- |
| 当前认证身份 | `HaijunChe`，id `246161505` |
| 仓库所有者类型 | `type: "User"` —— **个人账号，不是组织** |
| 仓库可见性 | public，`fork: false`，`forks_count: 0` |
| **你在该仓库的权限** | `admin: false, maintain: false, **push: true**, triage: true, pull: true` |
| 你自己两个仓库的权限 | `admin: true, maintain: true, push: true, triage: true, pull: true` |
| 仓库分支 | 只有 `main`，`protected: false` |
| 提交历史 | 全部 5 个提交作者均为 `LuX-x7`（git 作者名 `heronx07`）。**你目前 0 个提交** |
| 你名下仓库 | `cse-policy-legal-mapping`、`unfpa-cse-dashboard`，都不是 QualiCraft 的 fork |

> 说明：上表中的 `permissions` 是通过 WorkBuddy 已授权的 GitHub 连接器（以 `HaijunChe` 身份）读取的。`permissions` 字段只在认证请求里返回，匿名 curl 拿不到——查法见文末附录。

### 关键推理：`push: true` 是你的权限，不是连接器的权限

对比上面第 4 行和第 5 行：

- 你自己的仓库：`admin: true, maintain: true`
- QualiCraft：`admin: false, maintain: false, push: true`

`admin/maintain` 为 false、`push` 为 true —— **这正是"别人仓库上的写入型协作者"的权限签名**。如果这个字段反映的是连接器（集成应用）的权限，那它对所有仓库应该是一样的值，不会因为仓库归谁而不同。

**所以：邀请已经生效，`HaijunChe` 对 `LuX-x7/QualiCraft` 有写入权限。**

### 一个重要的澄清

"没有在 GitHub 页面显示"**不是**权限没生效的证据。见第三节。

---

## 二、三层权限必须分开看（这是那条建议最大的盲区）

你现在的处境里同时存在**三个独立**的权限层，它们的失败原因各不相同：

| 层 | 是什么 | 当前状态 | 导致什么 |
| :--- | :--- | :--- | :--- |
| **① 你的 GitHub 账号权限** | 你是否是该仓库协作者 | ✅ **正常，有 push** | 无问题 |
| **② 本地 git 认证** | 本机 `git push` 用什么身份 | ❌ **未配置**（`osxkeychain` 里没有 github.com 凭证） | 本地 `git push` 会要账号密码 / 报 403 |
| **③ WorkBuddy 连接器权限** | 集成应用的 GitHub App 安装范围 | ❌ **只读** | 我无法创建分支 / 提 PR |

**那条建议只讲了第 ② 层。** 它给的 PAT / SSH 方案对本地 git 是对的、也确实是你要做的，但它解释不了第 ③ 层。

我遇到的 403 是这样的：

```
POST https://api.github.com/repos/LuX-x7/QualiCraft/git/refs
403 Resource not accessible by integration
```

`Resource not accessible by integration` 是 **GitHub App（集成应用）** 特有的报错。它不是"你的账号没权限"，而是"这个 App 的安装令牌没有写权限"。

**所以：给 HaijunChe 生成 PAT，能让你的本地 git 推上去；但不会改变连接器的只读状态。** 这两件事要分开处理。

---

## 三、为什么"邀请后页面上看不到"是正常的

这是你最初的疑问，答案是：**在个人账号的仓库上，协作者身份本来就不会公开展示。**

GitHub 的规则：

1. **仓库公开页面没有"Collaborators"列表。** 协作者名单是私密的，只有仓库所有者能在 `Settings → Collaborators and teams`（新路径 `Settings → Access`）看到。你作为协作者，在仓库页面上**不会看到任何"你是协作者"的标记**。

2. **仓库侧边栏 / Insights 里的 "Contributors" 是按提交历史生成的**，不是按协作者身份。你现在 **0 个提交**，所以那里当然没有你。等你推送了第一个提交，你的头像就会出现在 Contributors 里。

3. **你名下的仓库列表里也不会多出它。** 别人的个人仓库不会出现在你的 repositories 列表。

**换句话说：接受邀请后"什么都没变"，是预期行为，不是故障。** 唯一的验证方式就是去实际做一件需要写权限的事。

### 怎么确认邀请真的生效了

按可靠性排序：

1. **直接推一个分支**（最可靠）。成功了就是有权限 —— 而且这正是你现在要做的事。
2. **网页测试**：登录 `HaijunChe` → 打开仓库任意文件 → 点铅笔 ✏️。
   - 若显示 "Commit changes"（可以直接提交到分支）：你有写权限。
   - 若只显示 "fork this repository and submit a pull request"：你没有写权限。
   - ⚠️ 注意：这个测试**在公开仓库上不够精确**——非协作者也能点铅笔，只是会被引导去 fork。所以"看到 fork 提示"不等于你没权限，要结合第 1 条。
3. **查通知 / 邮件**：GitHub 在你接受邀请时会发确认通知。
4. **让所有者确认**：`https://github.com/LuX-x7/QualiCraft/settings/access`（只有 `LuX-x7` 本人能打开）。

---

## 四、那条建议逐条核对

### ✅ 说对的部分

| 说法 | 评价 |
| :--- | :--- |
| `user.name` / `user.email` 只是 commit 作者信息，**不控制推送权限** | **完全正确**，而且这是最常见的混淆点。推送权限由远程认证（SSH key / PAT）决定。 |
| HTTPS 方式推送要用 **PAT** 当密码，不是账号密码 | **正确**。GitHub 早在 2021 年 8 月就取消了 git 操作的密码认证。 |
| SSH 方式要把公钥加到**自己的**账号 | **正确**。 |
| 要检查 **Rulesets**，新版规则集不一定在 Classic branch protection 里 | **正确**，这是个好的补充。 |
| "没有开启分支保护" | **我独立验证过：正确。** `main` 的 `protected` 字段为 `false`。 |

### ❌ 对不上 / 缺失的部分

1. **诊断层错了。** 它假设问题是本地 `git push` 403。但实际报 403 的是 **WorkBuddy 的 GitHub 连接器（一个只读的 GitHub App）**，不是本地 git。按它的方案做，本地 git 会通，但连接器仍然推不了。

2. **完全没回答"为什么看不到"。** 它直接跳进了 push 排错，但从头到尾没解释你最初的问题。而这个问题根本不需要排错 —— 是预期行为（见第三节）。

3. **分支保护这条线是无效排查。** 即使真的开了 Classic 分支保护，它也**不会**阻止创建新分支 —— 经典保护作用于**已存在的**分支（通常是 `main`），而 `POST /git/refs` 是新建分支。所以对"创建分支报 403"来说，分支保护从来不是嫌疑对象。它把注意力引到了错误的方向。

4. **网页测试的判断标准不严谨**（见第三节第 2 条的说明）。

5. **没有区分"三层权限"**，导致把三种不同成因的失败混成一个"403"。

---

## 五、你现在该怎么做

既然 `HaijunChe` 已有 push 权限，**不需要 fork**，可以直接把分支推到 `LuX-x7/QualiCraft` 并开 PR。

### 方案 A：HTTPS + PAT（最快）

1. 用 `HaijunChe` 登录 → `https://github.com/settings/tokens` → **Generate new token (classic)**
2. 勾选 **`repo`** 整个大项（或改用 Fine-grained token，在 `Repository access` 里选 `LuX-x7/QualiCraft`，权限给 `Contents: Read and write` + `Pull requests: Read and write`）
3. 生成后**立刻复制**（页面刷新就看不到了）
4. 本地推送时：
   - `Username`: `HaijunChe`
   - `Password`: **粘贴 PAT**（不是你的 GitHub 登录密码）
5. 建议让 macOS 钥匙串记住，之后就不用重复输入：

```bash
git config --global credential.helper osxkeychain
```

### 方案 B：SSH（长期更省事）

```bash
ssh-keygen -t ed25519 -C "你的邮箱"
pbcopy < ~/.ssh/id_ed25519.pub        # 公钥已复制到剪贴板
# 打开 https://github.com/settings/keys → New SSH key → 粘贴
ssh -T git@github.com                 # 应显示 Hi HaijunChe!
cd <仓库目录>
git remote set-url origin git@github.com:LuX-x7/QualiCraft.git
```

### 推完之后

- 你会出现在仓库的 **Contributors** 列表里（因为终于有提交了）。
- 这也顺带证明了邀请确实生效。

### 关于连接器

如果你希望我也能直接帮你推，需要在 WorkBuddy 的「连接器管理」里把 GitHub 重新授权为**可读写**。否则我这边只能产出补丁，由你推送。

---

## 六、可以直接回复对方的文字

> 我这边排查清楚了，分两层：
>
> **1. 协作邀请其实已经生效了。** 我查了 API，`HaijunChe` 在 `LuX-x7/QualiCraft` 上的权限是 `push: true`（`admin: false, maintain: false`，正是外部协作者的正常签名）。所以邀请没问题。
>
> **2. "页面上看不到"是正常的。** 个人账号的仓库不会公开展示协作者名单，只有你在 `Settings → Access` 里能看到；仓库里的 "Contributors" 是按提交历史算的，我还没有任何提交，所以那里当然没有我。等我推了第一个提交就会出现。
>
> **3. 分支保护那条线可以排除了**，而且它本来也不会导致这个报错——Classic 分支保护作用于已有分支，不会阻止新建分支。我确认过 `main` 的 `protected` 是 `false`。
>
> **4. 真正卡住的是本地 git 没有配置认证**（`osxkeychain` 里没有 github.com 的凭证），我按你说的方案 A 配 PAT 就能解决。
>
> **5. 补充一点：** 我这边通过 WorkBuddy 的 GitHub 连接器操作时，报的是 `403 Resource not accessible by integration`。这是**集成应用（GitHub App）自身的安装权限是只读**导致的，和我的账号权限无关。所以那条路径需要把连接器重新授权为可读写，或者我改用本地 git 推送。这两件事是分开的。

---

## 附：本次排查用到的命令（你也可以自己跑）

```bash
git remote -v                        # 看是 https 还是 ssh
git config --global user.name        # 只是 commit 作者信息，不决定推送权限
git config --global user.email
git config --get credential.helper   # 看有没有凭证助手（本机是 osxkeychain）
git push --dry-run origin main       # 试推送（不改动远端）
```

```bash
# 查分支及是否受分支保护 —— 匿名即可，无需登录
curl -s https://api.github.com/repos/LuX-x7/QualiCraft/branches \
  | grep -E '"name"|"protected"'
# 实测输出： "name": "main"  /  "protected": false
```

**关于查自己的权限：** `permissions` 字段**只在带认证的请求里返回**，匿名请求根本不会有这个字段（我实测确认过）。所以要看它必须带 token：

```bash
curl -s -H "Authorization: Bearer <你的PAT>" \
  https://api.github.com/repos/LuX-x7/QualiCraft | grep -A6 '"permissions"'
```

本报告里的 `permissions` 数值是我通过 WorkBuddy 已授权的 GitHub 连接器（以 `HaijunChe` 身份）读取的，不是匿名请求得到的。

**更简单的替代办法：** 不用 curl，直接跑一次 `git push`。推送成功就说明有写权限——这也是最直接的验证。
