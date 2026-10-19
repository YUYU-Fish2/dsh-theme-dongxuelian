# P8-DSH 接入记录：抱书彩铅氛围

2026-10-20。范围仅 `index.js`、`client.js`、`package.json` 与本文；未改测试、素材、`scripts/`、README 或其他文档，未运行 shell/Git、测试、真实宿主或窗口，未读取凭据或历史大日志。以下内容是待审核的实现说明，不是测试或窗口通过证据。

## 修改文件

- `index.js`
  - `FILES` 从 avatar + `sidebar-character.webp` 改为 avatar + `reading.webp`，后者指向 `./assets/scenes/web/reading.webp`。
  - HTTP 处理、HEAD 只 stat、GET 读文件、405、404、500、缓存头、`ctx.inject(['webServer'])` 与 `scope.effect` 释放均未改动。
- `client.js`
  - 26 个 `--dsw-*` token 的键名、数量和 `{ light, dark }` pair 形状保留；只改浅色值。语义色、语法高亮、字体 token 未新增、未覆盖。
  - `Avatar` 仍为 24px；`SceneStyle` 仍返回带 `data-dxl-scene=""` 的 `<style>`；仍只有 `sidebar.brand.mark` 与 `shell.overlay` 两个 controller。
  - `apply`、`setupLight` 事务、`releaseAll` 逆序释放、`sync` 串行循环、`queueMicrotask` 合并、`stopped`/最新 scheme 重读全部保持原逻辑；只改了 token 值和 `SCENE_CSS` 内容及说明注释。
- `package.json`
  - `files` 新增 `assets/scenes/web/reading.webp`、`assets/scenes/README.md`，移除 `assets/characters/web/sidebar-character.webp`。
  - 其余既有字段、版本 `0.1.0-preview.2`、P6 草稿白名单项（`README.md`、`docs/INSTALL.md`、`docs/RELEASE.md`、`THIRD_PARTY_NOTICES.md` 等）保留。
- 新增本文。

## Token 映射

| 用途 | 键 | 浅色值 |
| --- | --- | --- |
| 纸底 | `--dsw-alias-bg-base` | `#F7F3EB` |
| 阅读/弹层 | `--dsw-alias-bg-layer-1`、`--dsw-alias-bg-overlay` | `#FFFDF8` |
| 侧栏/次底 | `--dsw-alias-bg-layer-2`、`--dsw-alias-bg-layer-3`、`--dsw-specific-sidebar-fill`、`--dsw-alias-interactive-bg-hover` | `#EDECE9` |
| 正文 | `--dsw-alias-label-primary` | `#313A50` |
| 次/三级/caption | `--dsw-alias-label-secondary`、`--dsw-alias-label-tertiary`、`--dsw-alias-label-caption` | `#5F687C` |
| 强调/主按钮/info | `--dsw-alias-brand-primary`、`--dsw-alias-state-business-primary`、`--dsw-alias-button-primary-fill`、`--dsw-alias-button-info-fill` | `#536B9E` |
| 主按钮/info hover | `--dsw-alias-button-primary-hover`、`--dsw-alias-button-info-hover` | `#435882` |
| 白按钮字 | `--dsw-alias-brand-text` | `#FFFFFF` |
| 轻边界 | `--dsw-alias-border-l1`、`--dsw-alias-border-l2` | `#D4D7DE` |
| 功能边界 | `--dsw-alias-border-l3`、`--dsw-alias-border-l4` | `#7D879B` |
| 消息浅底 | `--dsw-specific-bubble` | `#DDE4EF` |
| 高亮/侧栏 active | `--dsw-specific-bubble-highlight`、`--dsw-specific-sidebar-nav-item-active` | `#E4E5EE` |
| 输入面 | `--dsw-specific-input-major` | `#FFFDF8` |

手工 WCAG 近似（非渲染验证）：`#7D879B` 对 `#FFFDF8` 约 3.55:1、对 `#EDECE9` 约 3.06:1；`#5F687C` 对 `#FFFDF8` 约 5.5:1、对 `#EDECE9` 约 4.7:1；白字对 `#536B9E` 约 5.3:1、对 `#435882` 约 7.1:1。按这些纯色计算未加深功能边界，仍待在带图实窗复核。

## 选择器依据与绘制层级

只使用任务单已核对的公开锚点，不使用 hash class、`nth-child`、`body/html` 全局布局或 DOM 写入：

- `[data-slot="main.conversation"] > div[data-phase]`：会话根；`hero` 与 `active` 是官方 phase 值。
- `[data-composer-seat][data-conversation-region="composer"] > div`：空态官方 composerStack；标题、工作区、输入都在其中。
- `[data-conversation-scroll]`：会话竖向滚动容器。
- `data-content-phase` 只作为已核对结构的事实记录，本次没有用它另加选择器。
- `container-name: dxl-reading` / `container-type: inline-size` 是本包在会话根上自设的容器，不依赖宿主类名。

主图只出现在 `[data-slot="main.conversation"] > div[data-phase]::before`：

- `z-index: -1`、`pointer-events: none`、`inset: 0`，位于内容之下。
- 初始 `background-size: cover`、`background-position: right center`、`opacity: 1`，不拉伸。
- 伪元素自身铺 `#F7F3EB` 纸底，和会话根纸色衔接。
- 侧栏不再绘制 avatar/人物水印；侧栏只通过 `--dsw-specific-sidebar-fill`、hover、active 等 token 呼应。
- 选择器限定在 `main.conversation`，插件、设置等页面不会被主图覆盖。

## 空态与聊天布局

### 宽空态

- 仅 `hero` 的 composerStack 设 `--dsh-composer-card-max-width: min(500px, 55cqi)`，同时设 `width: 100%`、`max-width`、`align-self: flex-start`、`margin-inline: clamp(24px, 4cqi, 48px) auto`。
- 500px 与 55% 取较小值；以当前 1000px main 计算为 500px，820px main 为 451px，满足 440–520px 与“至多 55%”的初排目标。
- `cqi` 以会话根容器为参照；这是本包自设的 container，不把 55% 套到全局聊天或代码宽度。
- 官方 `HeroShell` 的标题栈同样读取 `--dsh-composer-card-max-width`，所以标题和输入一起落在左侧纸面。

### 宽聊天

- `[data-phase="active"] [data-conversation-scroll]` 设 `margin-right: clamp(180px, 22cqi, 300px)`，把滚动列收窄到左侧，右侧留出透明观景带；不是改消息树，也不是把代码列限制到 440–520px。
- 滚动列铺 `#FFFDF8` 纸白渐变，最右 16px 轻微过渡；正文、输入卡、`pre` 使用纸白面，长代码仍由宿主容器自行横滚。
- active 的 `::before` 用 `background-position: right -160px center`，把人物脸和书推到右侧观景带，裁掉的主要是源图最右侧窗框/藤蔓（可能含少量发梢），不是脸或书。
- 没有改 `conversation.session` 的消息 DOM；任务单明确其结构待 Codex 检查，因此本次没有拿未核对的子结构做阅读面。

### 窄会话列

- `@container dxl-reading (max-width: 760px)`：hero composerStack 恢复 `min(680px, 100%)` 并居中，`margin-inline: 0 auto`，`align-self: stretch`；不继承 500px 的窄列。
- 窄空态人物：`@media (max-width: 1040px)` 下 hero 主图改为 `background-size: auto min(36%, 36vh)`、`right 12px top 8px`，完整显示横幅、保持比例，人物落在输入上方/右上；36% 是初始值，目标是让图底接近 720px 窗口下输入座上沿。
- 1040px 是视口代理值：当前侧栏 280px 时，1040 − 280 = 760px，与容器阈值对齐；侧栏收起时两者可能不同步，这是已知取舍。
- active 在 `@container dxl-reading (max-width: 900px)` 下取消右侧观景带，改为接近全宽的纸白面，只留 64px 边缘过渡；窄聊天优先保证正文可读，人物主要让位给空态。
- 没有把主图透明度调低来掩盖裁切或可读性问题；宽聊天靠纸白阅读列和右侧观景带分隔。

## 风险与未验证项

### 风险

- 会话根新增 `position: relative`、`isolation: isolate`、`container-type: inline-size`：会改变绝对定位子元素的包含块并新建堆叠/尺寸 containment；滚动条、浮层、更多菜单、宽度拖拽把手和宿主 `::before` 是否受影响未在真实窗口确认。
- 若宿主未来在同一个根上使用 `::before` 绘制内容，本包的 `content`、背景和层级会与其属性合并/覆盖；当前 0.2.1-rc.2 未见冲突，但未在真实窗口确认。
- active 的 `margin-right` 依赖 `[data-conversation-scroll]` 是可收缩的 flex/block 子项；已补 `width: auto; min-width: 0`，但若宿主另有 `width: 100%`、固定宽度或不同 display，可能出现横向溢出、滚动条位置偏移或观景带失效。
- `22cqi`/`55cqi` 依赖最近的 `dxl-reading` 容器；若宿主在中间新增自己的 container，单位会改以它为参照。
- `right -160px` 会把显示宽度的右侧约 160 CSS px 移出容器（对应源图像素随 cover 缩放变化）；当前判断该处是窗框/藤蔓，但未在 800/1100/1440 全部宽度核对脸、书和蓝花。
- 窄空态 `36% / 36vh` 与 1040px 视口阈值是初值；图可能偏小、与标题轻微重叠，或在不同窗口高度下与输入座距离不理想。1040px 代理在侧栏收起/展开时会与 760px 容器阈值不同步。
- 主图纸色与 `#F7F3EB` 的实际边缘可能有细微色差；窄空态完整显示图片时可能看到矩形纸边，未取色核对。
- `pre` 强制 `#FFFDF8` 可能与宿主代码块的语法高亮底色/圆角/边框不完全一致；工具卡没有单独选择器，依赖 token 与纸白阅读列，未核对真实卡片。
- `assets/scenes/README.md` 在当前工作区未发现（只有 `assets/scenes/b-series/README.md`），但已按任务单列入 `package.files`；需要 Codex 补该文件或确认路径，否则 `npm pack` 清单会缺少场景来源说明。
- `assets/characters/README.md` 仍描述旧 `sidebar-character.webp`；按范围本次未改该文档，需在 P6/P8 文档阶段同步。
- 旧 `assets/characters/web/sidebar-character.webp` 仍在磁盘，但已撤出 FILES 与 `package.files`；这是任务单要求的历史保留，不是运行路由。

### 未验证

- 未运行 `node --test`、`npm test`、`npm run check`、真实 ModuleLoader、`npm pack` 或任何窗口/截图。
- 未在真实 0.2.1-rc.2 中确认 `<style>` 插入、`data-dxl-scene` 保留、container query 生效、`margin-right` 实际收窄滚动列、右侧人物是否按预期露出。
- 未验证 800/1100/1440 空态与聊天、CSS zoom 100/125/150、长代码横滚、工具卡、附件/更多菜单、侧栏收放、浅→深→浅释放、停用后 reading/avatar 404。
- 未对带图实际像素复核对比度；上面的 WCAG 数值只是纯色手算。
- 未确认 `conversation.session` 的活跃消息 DOM，因此本次没有对它设置阅读面或宽度。
