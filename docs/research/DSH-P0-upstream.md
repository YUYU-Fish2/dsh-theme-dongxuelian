# DSH P0 上游技术调研

调研日期：2026-10-19。DSH 执行源码调研，Codex 抽查并修订。本文件为审核后版本；未安装依赖、未启用主题插件、未修改 profile 或 DSH 安装文件，未执行任何第三方仓库脚本。项目决策以 [P0 报告](../P0-REPORT.md) 为准。

## 0. 结论摘要

1. 本机确为 DSH `0.2.1-rc.2`，官方 Theme 插件已提供 `ctx.theme.register()`、`ctx.theme.overrideTokens()`、`ctx.theme.setTheme()` 与 `theme/change`；Slot 系统提供 `ctx.slots.register()` / `inject()`；这三项足以做一个轻量主题插件。
2. 官方 Slot 层级中未发现角色专用大图插槽；但本项目要求的小头像有候选位置，包括 `sidebar.brand.mark`、`conversation.header.leading` 和 `conversation.hero.brand.mark`。尺寸、占用与共存需要实测；不能据此认定小头像需求不可实现，也不需要先引入整栏背景图。
3. 三个参考仓库代码许可证均为 MIT；但 naniwet 明确把角色素材排除在 MIT 之外（非商业同人图），Ethan 仓库内大量角色图的权利状态未说明，oil 不含角色素材。轻量复用应优先 oil 的“官方 Theme API + 令牌映射”思路，而不是整包 Fork 素材型主题。
4. 兼容性均不能直接推定：oil 只验证到 `0.1.2-rc.1`，Ethan 自动化基线 `0.2.0-rc.1`、桌面手测 `0.2.1-alpha.2`，naniwet 未声明验证版本。没有任何一个仓库声明验证过本机 `0.2.1-rc.2`。
5. 推荐路线：**最小独立官方 API 插件**（`overrideTokens` 做明暗双令牌层，Slot 只放小尺寸品牌/页脚元素），必要时借鉴 oil 的 MIT 令牌映射；不整包 Fork，也不复制 naniwet/Ethan 的角色素材。

## 1. 证据基线与方法限制

- 本机版本：`E:\dsh\resources\app.asar\dsh\package.json` 第 4 行 `"version": "0.2.1-rc.2"`；`.../@deepseek-ai/dsh-client-ui-theme/package.json` 第 4 行同为 `0.2.1-rc.2`。
- 官方公开源码按标签 `dsh-v0.2.1-rc.2` 核对，未使用 master：<https://github.com/deepseek-ai/deepseek-harness/tree/dsh-v0.2.1-rc.2>。
- 本地 asar 用只读 `read` 直接读取，未解包、未覆盖。`grep`/`rg` 不能进入 asar 虚拟路径，因此 asar 内证据以逐文件阅读和行号为准。
- **阻碍**：本次会话的 shell 在 provisioning 时失败：`SetNamedSecurityInfoW failed (Win32 5): grantWrite(E:\codex\dsh主题开发)`。因此无法执行 `git`、`node`、Electron Run-as-Node、`npm pack` 或任何加载测试；文件读写工具仍可用。报告中的 SHA 来自各克隆的 `.git/refs/heads/main`，不是重新计算的提交对象。

审核补充：上述 shell 限制仅影响 DSH 执行器，Codex 可运行命令。Codex 已用 `git rev-parse HEAD` 复核三仓 SHA，并用 Electron Run-as-Node 抽查本机 Theme、Sidebar、Conversation 和 Desktop Host 源码。DSH 曾尝试申请 ACL 修复，该调用被审批机制拒绝，未执行修复；后续无需修改 ACL，采用 DSH 读写报告、Codex 执行验证的分工。

## 2. 三仓基线

| 仓库 | HEAD（完整 SHA） | 包版本 | 许可证正文结论 | 入口 / 依赖 |
|---|---|---|---|---|
| naniwet/dsh-themes | `39cb277e6c419be1b8bb95e9dac595682418bfe6` | `0.1.0` | MIT，Copyright (c) 2026 naniwet；README 明确角色素材不在 MIT 内，仅非商业使用 | `main: index.js`；`exports["./client"]: client.js`；依赖 `@deepseek-ai/schemastery ^3.18.1`，peer `@deepseek-ai/cordis ^4.0.1` |
| EthanHannn/dsh-theme | `c7c7f360321e1884ad84c004b562f6088b7113c7` | `0.2.0` | MIT，Copyright (c) 2026 dsh-themes contributors；未见对仓库内角色图的单独授权说明 | `main: lib/index.js`；`exports["./client"]: lib/client.js`；无 runtime dependencies；peer 含 React 18、cordis `^4.0.1`、4 个 `@deepseek-ai/dsh-client-*` `^0.2.0-rc.1` |
| oil-oil/dsh-theme | `38c3cf09f1ece363283d29224c61ac369b0ffabc` | `0.2.0` | MIT，Copyright (c) 2026 oil-oil；素材仅 README 图形与官方 DeepSeek 标志 | `main: lib/index.js`；`exports["./client"]: lib/client.js`；无 runtime dependencies；peer `cordis ^4.0.2`、React/ReactDOM 18 |

固定链接：

- naniwet `package.json`：<https://github.com/naniwet/dsh-themes/blob/39cb277e6c419be1b8bb95e9dac595682418bfe6/package.json#L1-L39>
- naniwet `LICENSE`：<https://github.com/naniwet/dsh-themes/blob/39cb277e6c419be1b8bb95e9dac595682418bfe6/LICENSE>
- Ethan `package.json`：<https://github.com/EthanHannn/dsh-theme/blob/c7c7f360321e1884ad84c004b562f6088b7113c7/package.json#L1-L76>
- Ethan `LICENSE`：<https://github.com/EthanHannn/dsh-theme/blob/c7c7f360321e1884ad84c004b562f6088b7113c7/LICENSE>
- oil `package.json`：<https://github.com/oil-oil/dsh-theme/blob/38c3cf09f1ece363283d29224c61ac369b0ffabc/package.json#L1-L78>
- oil `LICENSE`：<https://github.com/oil-oil/dsh-theme/blob/38c3cf09f1ece363283d29224c61ac369b0ffabc/LICENSE>

## 3. 各仓实现方式

### 3.1 naniwet：配置型皮肤 + 自带 Host 图片路由

- Host 半：`index.js:10-13` 引入 schemastery 与 `registerThemeRoutes`；`index.js:37-110` 定义 `presets` 配置；`index.js:118-130` 只做校验并注册路由。
- 图片：`theme-route.js:16` 固定前缀 `/dsh-theme`；`:82-143` 在 `ctx.inject(['webServer'])` 内注册 `/dsh-theme/manifest`（exact）和 `/dsh-theme/image`（prefix），从磁盘流式返回图片。
- 浏览器半：`client.js:13-21` 用 `window.__ModuleLoader__.load` 手写 bundle；`:30-42` 生成整张样式表；`:44-101` 直接覆盖 `--dsw-alias-*`，但只写“暗色一套 + light 覆盖”；`:106-128` 用 `[data-slot="sidebar"] > div:first-child` 放侧栏角色；`:137-158` 用 `[data-composer-card]`、`[class*="bubble"]` 等 DOM 子串选择器；`:449-455` 声明 `inject = ['slots']`；`:533-537` 注册 `settings.general.item`；`:539-598` 在 effect 内插 `<style>`、改 favicon、加粒子层，并在清理函数移除。
- 兼容性缺口：README 没有“已验证 Harness 版本”表（`README.md:52-60` 只讲安装）；`README.md:144-153` 自认依赖 CSS-module 类名子串，重命名即失效。
- 代码级问题：`client.js:111-128` 的模板字符串内有一段重复/无效 CSS（`:123` 的 `%, transparent) 66%,`），CSS 解析会丢弃该段；不是 JS 语法错误，但说明该 HEAD 的样式表未经过严格校验。另 `:52`、`:63` 使用 `--dsw-alias-border-l`，而 0.2.1 的实际令牌是 `--dsw-alias-border-l1`…`l4`，该覆盖不会生效。
- 路由仍须实测：本机桌面 Host 源码明确使用 `ctx.webServer`，故不能以“桌面没有 WebServer”排除该路线；现有 `/dsh-theme/manifest` 路由的鉴权、桌面转发和资源可达性未验证。

### 3.2 Ethan：注册大量 ThemeDefinition + 生成式大包

- Host 半仅 `lib/index.js:12-13` 的 `export function apply() {}`，浏览器功能全在 `./client`。
- `package.json:39-52` 声明 `dsh.client.inject` 四个客户端包并 `immediately: true`；`package.json:54-60` 的 peer 范围是 `^0.2.0-rc.1`。
- 浏览器 half 是生成文件（`lib/client.js:1-13` 自述 GENERATED，123,383 行）；只 runtime require `react`、`react/jsx-runtime`、`@deepseek-ai/dsh-client-store`（`:17-19`）。
- 主题注册：`:122547-122553` 把 `SKINS` 与 `dsh-preview-light/dark` 逐个 `ctx.theme.register(skinDefinition)`，并在 effect 清理时 dispose；`:123361-123373` 注册 `settings.section`，并向 `sidebar.footer.action` 注入“侧栏伙伴”入口。
- 偏好：`:123224-123245` 自述 `ThemeService` 启动后会异步采纳内置偏好，可能覆盖第三方 preference，因此用 3 次 change 或 5 秒 boot guard 重新 `setTheme`；`:123168-123221` 用 `theme/change` 同步壁纸属性。
- 样式：`:122599-122611` 用 `:not(#dsh-themes)` 提升特异性对抗后注入的 ui-* 样式；`:122608-122609` 自认哈希类名变化会导致强调色静默失效。
- 兼容性：`compatibility.json:3-12` 的自动化基线是 `0.2.0-rc.1`；`README.md:74-79` 另称 `0.2.1-alpha.2` Windows 桌面手测通过，`0.2.1-rc.2` 未列。
- 体积/维护：README 列 100+ 套主题，包声明包含 `lib/client.assets-*.js` 资源分块；轻量场景直接复用会引入不必要的素材、生成器、测试脚本和兼容门禁。

### 3.3 oil：官方 Theme API + 设置页，最接近“轻量可复用”

- Host 半 `src/index.ts:1-5` 与 `lib/index.js:1-5` 都是空 `apply()`，只保留可发现入口。
- `package.json:35-47` 的 `dsh.client` 指向 locale/renderer/settings/theme；`package.json:55-77` 中客户端 `@deepseek-ai/dsh-client-*` devDependencies 固定在 `0.1.2-rc.1`，但 runtime peer 只有 cordis/React。
- 浏览器入口 `src/client/index.tsx:43-47` 声明 `inject = ['slots','locale','theme']`；`:60-67` 每次设置变化调用 `ctx.theme.overrideTokens('dsh-theme', buildThemeTokenOverrides(...))`，并保存 release 函数；`:116-127` 用 `ctx.effect` 在卸载时释放令牌层；`:144-157` 注册 `settings.section`。
- 令牌映射 `src/client/theme-tokens.ts:143-258`：所有值都是 `{ light, dark }` 对，覆盖 `--dsw-alias-bg-base`、`bg-layer-1/2/3`、`bg-overlay`、`border-l1..l4`、`label-*`、`button-primary-*`、`brand-primary`、`specific-sidebar-fill`、`specific-input-major` 等。
- 兼容性：`docs/compatibility.md:5` 明确目标是 Harness `0.1.2-rc.1` / 社区 Desktop `2.0.5`；`:9-17` 说只从公开 store/cordis 导入，发布产物只请求 `react`、`react/jsx-runtime`、`@deepseek-ai/dsh-client-store`。这与本机 0.2.1 的模块表高度重合，但**未验证**。
- 产物 `lib/client.js:1-32` 确认实际只 require 上述 3 个模块；没有 `dsh-client-runtime/client` 旧入口。

## 4. 本机 0.2.1-rc.2 官方接口核对

### 4.1 Theme

本地 `@deepseek-ai/dsh-client-ui-theme/lib/client.js`（版本 0.2.1-rc.2）：

- `:1522-1530` 内置 `light` / `dark` 定义；`:1531-1630` 官方 inspect 令牌表。
- `:1712-1718` `setTheme(id)` 只接受 `system` 或已注册 id，未注册直接抛错；内置 preference 才会写 Host 设置。
- `:1807-1818` `register(definition)`：`{ id, colorScheme, tokens }`，重复 id 抛错，返回 disposer；dispose 当前激活主题会把 preference 重置为默认。
- `:1835-1846` `overrideTokens(source, tokens)`：按 source 叠层，后叠者按 token 覆盖；值必须是 `{ light, dark }` 对。
- `:1931-1943` 裸字符串值会抛 TypeError，并提示改成 `{ light, dark }`。
- 本地 `lib/index.js:5-9` 只允许 `light`/`dark`/`system` 三种持久化 preference；`:134-159` 用 `body[data-ds-dark-theme]` 切换暗色。
- `ThemePresenter` 把激活主题的 token 写成 body 内联 CSS 变量（官方 `ui-layout/src/client/theme-presenter.ts`），所以内联层会压过普通样式表规则；多个插件都调 `overrideTokens` 时按 seq 叠加，后调用者赢，跨插件顺序不应被视为稳定契约。

结论：轻量插件应优先 `overrideTokens`（不改变用户选择、可随明暗切换、disposer 可完全回退）；`register` 适合需要独立主题 id/选择器的产品，但要自己处理 preference 持久化。

### 4.2 Slot

官方 0.2.1 的 SlotMap 与层级（固定标签）：

- `ui-layout` 的 SlotMap：<https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.1-rc.2/packages/client/ui-layout/src/client/index.ts>。`sidebar` 是 single 且已被 `ui-sidebar` 占用；`main` 是 keyed；`shell.overlay` 是 list；`shell.leading` 是 single。
- `ui-sidebar` 声明的子槽：`sidebar.brand.mark`、`sidebar.brand.name`、`sidebar.toggle.badge`、`sidebar.panellist`（list）、`sidebar.workspaces`、`sidebar.settings`、`sidebar.footer.action`（list）。没有 `sidebar.art` / `sidebar.hero` / 大图槽。
- 官方 `docs/subsystems/slots.md`：<https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.1-rc.2/docs/subsystems/slots.md>。其中给出 `conversation.hero.brand.mark`、`conversation.hero.workspace`、`conversation.hero.agentPreset`、`conversation.hero.options`；并明确 `single`/已占用 keyed 是“替换点”，新增内容应使用 list id 或未占用 key。
- 生命周期：`ctx.slots.register()` 返回 disposer；`ctx.slots.inject(key, cb)` 在 owner 声明出现/消失时执行/清理；disposer 会递归折叠该 entry 声明的子槽。注册未声明槽、重复声明子槽、在已占用 single 的同 priority 再注册都会在加载期抛错。

### 4.3 插件生命周期

- 插件模块形状：`name` + `apply(ctx, config)` + 可选 `inject` + 可选 `Config`。Host 入口可以是空 `apply()`（oil `lib/index.js:1-5`、Ethan `lib/index.js:12-13`），客户端由 `dsh.client` 单独加载。
- 资源释放统一走 `ctx.effect(() => cleanup, label)`；服务通过 `ctx.provide('theme', ...)` 暴露；事件通过 `ctx.on('theme/change', ...)` 订阅；Slot 注册与 `inject` 都绑定 Cordis 生命周期。
- 官方 ui-theme 的 `apply`（本地 `lib/client.js:2022-2073`）就是范本：`installThemeStyles` → 注册 locale → 创建 ThemeRuntime → `ctx.provide('theme')` → 注册两个 `settings.general.item`。

### 4.4 静态资源

- 客户端 bundle：包在 `exports["./client"]` 导出构建产物，Host 扫描 `dsh.client` 后经 `/plugins/??<pkg>/client.js&rev=...` 提供；子 chunk 走 `require.async`。没有“把任意静态目录挂到站点”的公开接口。官方说明：<https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.1-rc.2/docs/subsystems/client-modules.md>。
- Host 路由：`ctx.webServer.register({ kind: 'exact'|'prefix', path, handler })` 是公开接口（本地 `dsh-host-webserver/lib/index.js:300-333`，重复 (kind,path) 抛错，返回 disposer）。Codex 核对 `dsh-desktop-host/lib/index.js:342-346`，桌面 Host 用该服务生成本地连接 URL 并收集 index injections；服务在本机桌面架构中存在。自定义图片请求是否通过桌面实际页面载入，仍需实测。
- 按用户要求，图片保留为独立 `assets/` 文件，不内联 data URI、不打入 JavaScript chunk。P3 优先以独立包内最多三个文件的白名单和官方 Host 路由提供资源；只读取插件资源，不接受任意本地路径。路由需唯一命名、绑定生命周期、核对鉴权与 MIME，并先在隔离环境验证；尚未实现。

## 5. 可稳定覆盖的令牌与角色放置

### 5.1 令牌

0.2.1 的令牌定义与两套明暗值在官方 `design-platform.css`：
<https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.1-rc.2/packages/client/ui-theme/src/styles/design-platform.css>

| 目标 | 建议令牌 | 说明 |
|---|---|---|
| 基础背景 | `--dsw-alias-bg-base` | 官方 inspect 表内；body 背景 |
| 面板/层 | `--dsw-alias-bg-layer-1/2/3`、`--dsw-alias-bg-overlay`、`--dsw-alias-bg-module-platform` | layer 1/2/overlay 在 inspect 表；layer 3 仍被组件使用 |
| 侧栏 | `--dsw-specific-sidebar-fill`、`--dsw-specific-sidebar-nav-item-*` | 侧栏专用；比覆盖 `sidebar` DOM 稳 |
| 文字 | `--dsw-alias-label-primary/secondary/tertiary/caption/dimmed` | primary/secondary 在 inspect 表 |
| 边框 | `--dsw-alias-border-l1..l4` | 注意没有 `--dsw-alias-border-l`；naniwet 用的就是错名 |
| 按钮 | `--dsw-alias-brand-primary`、`--dsw-alias-button-primary-fill/hover/dimmed`、`--dsw-alias-state-business-primary` | 主按钮/强调 |
| 输入框 | `--dsw-specific-input-major`、`--dsw-specific-login-input` | 输入区主背景 |
| 气泡 | `--dsw-specific-bubble`、`--dsw-specific-bubble-highlight` | 会话气泡 |
| 代码/滚动条 | `--dsw-alias-markdown-code-block`、`--dsw-alias-scrollbar-*` | 可选 |

稳定性判断：官方 inspect 表列出的 14 个（base、layer 1/2、overlay、border l1/l2、brand、label primary/secondary、state error/idle/success/warn、sidebar-fill）是最稳的公开面；其余是 0.2.1 实际 CSS 中存在的内部令牌，代码可用但升级时优先复核。

### 5.2 角色能否通过公开 slot 放置

| 位置 | 可用公开 slot | 能否放“大幅角色” | 结论 |
|---|---|---|---|
| 侧栏 | `sidebar.brand.mark`、`sidebar.brand.name`（single）；`sidebar.footer.action`（list） | 否 | 只能换小 logo/加一个页脚小元素；整栏角色图没有公开槽 |
| 顶部 | `shell.overlay`（list，点击穿透）；`conversation.header.leading` / `conversation.session.header.*` | 否（可放小浮层） | 没有 banner/hero 槽；`shell.overlay` 不是角色专用 |
| 空状态 | `conversation.hero.brand.mark`、`conversation.hero.workspace`、`conversation.hero.agentPreset`、`conversation.hero.options` | 仅 logo 级 | 没有整幅插画槽；替换 brand.mark 会顶掉官方鲸鱼标 |
| 全框 | `shell.overlay` | 可放绝对定位装饰图 | 属于“浮层 list”，需自己处理尺寸/点击穿透；仍非角色 API |

因此：不能虚构 `sidebar.character`、`hero.art` 之类接口。P2 只做基础主题；P3 的小头像先验证实际已有插槽，不因缺少角色专用大图槽就改成整栏背景或替换会话布局。空状态插画是可选项，无合适位置时可推迟。

## 6. 三条路线比较

| 路线 | 做法 | 维护/许可/依赖/适配成本 | 评价 |
|---|---|---|---|
| A. 最小独立官方 API 插件 | 一个客户端 bundle；`overrideTokens` 令牌层；必要 Slot 小元素；P3 再加入独立资源和 Host 路由 | 最低；自有代码许可另行明确；若复用 MIT 片段保留声明；运行依赖按实际 import 决定；跟踪 Theme/Slot/Host 路由 API | **推荐** |
| B. 精简复用 oil | 复制其 `theme-tokens.ts` 的映射与设置页骨架，裁掉字体/预设/设置 UI | 中低；MIT；需 TS/React/tsdown 构建；可保留 `overrideTokens` 生命周期 | 次选：要调色/字体面板时用 |
| C. 直接 Fork 大型主题 | Fork Ethan（100+ 主题、生成式 12 万行客户端、素材包）或 naniwet（Host 路由 + DOM 选择器） | 最高；MIT 但素材权利复杂；构建/素材/兼容门禁全背上；API 漂移要持续跟 | 不符合轻量需求，不建议 |

推荐 A 的具体理由：

- 不改变用户“浅色/深色/跟随系统”的官方选择：`overrideTokens` 只叠令牌层，`theme/change` 自动用对应 light/dark 值。
- 卸载即回退：disposer 删除令牌层，不残留 DOM/样式/偏好；这是主题插件最重要的回归面。
- P2 无需图片路由；P3 按独立文件管理要求加入最小 Host 路由，并验证桌面可达性。
- 小头像原本就在用户需求内，优先验证品牌位和顶部候选插槽；不预设用户需要大幅侧栏角色，不扩展成壁纸系统。

## 7. 证据分级

### A. 代码证据支持

- 本机 0.2.1-rc.2 的 Theme 注册/覆盖/偏好 API 与 Slot 生命周期，见第 4 节本地 asar 行号与固定标签源码。
- 三仓 SHA、包版本、入口、依赖、许可证正文；naniwet/oil/Ethan 的兼容声明文本。
- 未发现角色专用大图槽；`sidebar` 为 single 且被占用，但品牌、顶部和空状态均有小元素候选插槽。
- naniwet 使用 `/dsh-theme` 根绝对路径与 `webServer`；Ethan 使用 `ctx.theme.register` + 自定义 localStorage 偏好；oil 使用 `ctx.theme.overrideTokens`。
- naniwet 的 `--dsw-alias-border-l` 不是 0.2.1 的有效令牌；其模板内有重复 CSS 段。

### B. 仅上游自述

- 三仓 README 的视觉效果、截图、安装步骤、“卸载后完全恢复”等描述，未在本机复现。
- Ethan README 的“0.2.1-alpha.2 Windows 桌面手测通过”，以及 100+ 主题的完整性。
- oil README 的“使用官方 Theme 和 Slot API，因此无需替换组件”。
- naniwet README 的“Web 插件安装后可用”。

### C. 尚需真实运行验证

- 三个插件在 0.2.1-rc.2 桌面端是否真的能加载、显示、切换明暗、卸载回退。
- `webServer` 的桌面源码接入已确认；naniwet 的 `/dsh-theme/manifest` 在实际桌面页面是否可达仍未测。
- 各 `single` 槽当前实际占用者、priority 行为，以及替换 `conversation.hero.brand.mark` 的真实视觉结果。
- 与已安装 better-sidebar / whale-widget / dshmarket 的插槽冲突与加载顺序。
- Ethan 的 boot guard 在 0.2.1-rc.2 的 settings 采纳时序下是否仍必要/有效。

## 8. P2 最小构建/打包/加载/停用回归方案（不执行安装）

### 8.1 最小包结构

```
dsh-theme-lite/
  package.json          # type: module; main: lib/index.js; exports["./client"]: lib/client.js
  cordis.patch.yml      # - insert: [{ id: theme-lite, name: dsh-theme-lite }]
  lib/index.js          # export function apply() {}
  lib/client.js         # window.__ModuleLoader__.load({ id, factory })
  LICENSE
```

`package.json` 关键字段：`dsh.bundle.patch: "./cordis.patch.yml"`、`dsh.client.platform: "web"`；peerDependencies 只写 `@deepseek-ai/cordis` 与 `react`，不要写死 0.2.1。

### 8.2 客户端最小逻辑

- `inject = ['theme', 'slots']`。
- `apply(ctx)` 内：`ctx.effect(() => ctx.theme.overrideTokens('dsh-theme-lite', TOKENS), 'theme-lite: tokens')`。
- `TOKENS` 只放第 5.1 节表内项目，每项 `{ light, dark }`；先用 8–12 个核心令牌，不追求全量。
- 可选 Slot：`ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({ name:'sidebar.footer.action', id:'theme-lite', order: 50 }, SmallMark))`；或 `conversation.hero.brand.mark` 放小 logo。不要同时替换多个 single 槽。
- 图片推迟至 P3，使用独立资源文件和经验证的官方 Host 路由；不使用 data URI 或 JavaScript 图片 chunk。
- 卸载清理：只依赖 `ctx.effect` 的 disposer；不写 `document.body` 全局属性，不改 favicon，不写 localStorage（P2 不需要偏好）。

### 8.3 构建/打包检查

- 构建后确认 `lib/client.js` 是 `window.__ModuleLoader__.load` 形式，首行 `id` 与包名一致；`require()` 只出现 `react`、`react/jsx-runtime`、`@deepseek-ai/dsh-client-store` 等平台模块。
- `npm pack --dry-run` 核对最小入口、patch、安装说明、许可证与 P3 必要的 `assets/`；不得带 `node_modules`、原始大幅参考图、测试夹具和 `.research`。
- 在隔离测试 home（非用户 desktop profile）安装 tgz；记录 boot graph 中是否出现该 entry，以及控制台是否有 `slot ... is not declared` / `theme ... is not registered`。

### 8.4 加载/停用回归清单

1. 冷启动：浅色/深色各截一张；检查 `--dsw-alias-bg-base`、`bg-layer-1/2`、`label-primary`、`border-l2`、`button-primary-fill`、`specific-input-major` 的计算值。
2. 切换系统明暗：不重启，确认令牌切换到另一套值；`theme/change` 不报错。
3. 打开/关闭侧栏、切换会话、打开设置：确认 Slot 元素仍在/或按预期消失，没有重复注册。
4. 禁用插件（不卸载）：确认 `<style>`/Slot 节点/自定义属性全部消失，计算值回到默认；再次启用，确认只出现一份。
5. 卸载后重启：确认 boot graph 不再有该 entry，页面无残留样式。
6. 与 better-sidebar / whale-widget / dshmarket 同时启用：重点看 `sidebar` 是否被替换、`sidebar.footer.action` 是否仍存在、`conversation.hero.brand.mark` 是否被别的插件占用；出现 single 槽冲突时用不同 priority 或改用 list 槽，不要抢占。

### 8.5 共存风险（代码证据 + 待验证）

- `sidebar` 是 single，当前由官方 `ui-sidebar` 占用。若 better-sidebar 直接替换 `sidebar`，其声明的 `sidebar.footer.action` 等子槽会随之折叠；我们的 `ctx.slots.inject` 会在新 owner 出现时重跑，但若新 owner 不声明该子槽，我们的入口就消失。这是“功能消失”，不是崩溃。
- 若 better-sidebar 只是向 `sidebar.footer.action` 追加条目，list 槽可共存；用唯一 `id` 和不同 `order` 即可。
- `shell.overlay` 是 list，适合多插件共存；但它是点击穿透层，放角色图要自己开 `pointer-events`，且不要遮挡交互。
- 多个主题插件同时 `overrideTokens` 时按 seq 叠加，后调用者赢；不增加设置面板或冲突检测系统，先记录此限制，使用 DSH 原有插件启停方式处理，并在测试时核对共存效果。
- 参考主题的 `[class*="..."]`、`:not(#id)` 等高特异性选择器可能命中其他插件 DOM；P2 不要复制这类选择器。

## 9. 未验证项与后续动作

- 未执行任何加载/安装/打包；本报告不宣称“加载测试通过”。
- 已从本机 Desktop Host 源码确认 `webServer` 接入；未验证自定义资源路由在窗口中的实际请求。
- 未验证三个参考仓库在 0.2.1-rc.2 的实际渲染与卸载。
- 未读取用户 profile 内容，未检查 better-sidebar/whale-widget/dshmarket 的具体 slot 占用；共存结论基于官方 Slot 规则，需在隔离环境实测。
- 用户确认 P0 的技术基础和素材来源后再进入 P1。插件骨架、隔离加载与卸载验证属于 P2 的实施与测试，不作为本轮 P0 的隐含追加任务。
