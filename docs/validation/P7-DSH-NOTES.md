# P7-DSH 实现记录：冷白雾蓝与人物背景

2026-10-19。范围仅 `client.js` 与本记录；未改测试、`index.js`、`package.json`、资源、profile/核心，未装依赖、未用 shell/Git、未启动窗口。按任务单要求，只实现了待审核的代码，所有结论均未经运行验证。

## 修改文件

- `client.js`
  - 26 个 `--dsw-*` token 全部替换为 `docs/design/P7-WINTER-SCENE.md` 的冷白雾蓝色板；token 键名、`{ light, dark }` 配对与数量不变。
  - 删除 `conversation.session.header.utilities` 常量与注册（标题栏重复头像移除）；`sidebar.brand.mark` 的 24px `Avatar` 原样保留。
  - 新增 `shell.overlay` 注册：`{ name: 'shell.overlay', id: OWNER, order: 100 }`，组件 `SceneStyle` 返回 `createElement('style', { 'data-dxl-scene': '' }, SCENE_CSS)`。样式表字符串定义在 `client.js` 内，不新增依赖，不渲染可见占位或可聚焦控件。
  - Theme 生命周期（`ctx.effect`、`theme/change` 监听、`queueMicrotask`、`syncing` 串行循环、`stopped` 重读、`setupLight` 事务与逆序释放、`sync` 主循环）保持原逻辑未改写；只把第二个事务项从 header 槽换成 scene 槽。
- 新增本记录。

## 背景实现选择

- 只注册/绘制两处，均通过官方容器：
  - `[data-slot="main.conversation"] > div[data-phase]`（容器是 `display: contents`，根是带 `data-phase` 的直接 div）。
  - `[data-slot="sidebar"] > div:first-child`（直接 div 根；`:first-child` 沿用已验证 DOM 结构与既有第三方实现的定位方式）。
- 根只加 `position: relative` 与 `isolation: isolate`；不写尺寸、字体、`overflow`、`display`，不改布局。
- 根 `::before`：`content: ''`、`position: absolute`、`inset: 0`、`z-index: -1`、`pointer-events: none`、`background-repeat: no-repeat`。伪元素在隔离堆叠上下文内处于文字/控件之下；`shell.overlay` 只承载 `<style>`，不在 z-index 20 的前景层放任何图。
- 选择器全部锚定上述两个官方 `data-slot` 容器与其直接根，不使用 hash 类名、`body`/`html` 布局改写、`[class*=...]` 或 DOM 写入。

### 数值（初始值，待真实截图调整）

| 位置 | 图 | 尺寸 | 位置 | 透明度 |
| --- | --- | --- | --- | --- |
| 聊天（`data-phase="active"`） | `sidebar-character.webp` | `360px auto` | `right -25px bottom 90px` | `0.24` |
| 空态（`data-phase="hero"`） | 同上 | 同上 | 同上 | `0.65` |
| 侧栏 | `avatar.webp` | `210px auto` | `center bottom 75px` | `0.13` |
| `max-width: 900px` 聊天 | 主图 | `260px auto` | 不变 | `0.16` |
| `max-width: 900px` 空态 | 主图 | 同上 | 不变 | `0.32`（暂定，任务单未给值） |
| `max-width: 900px` 侧栏 | 头像 | `180px auto` | 不变 | 保持 `0.13`（任务单只要求尺寸） |

- 侧栏收起隐藏：命中 `[data-sidebar-collapsed]` 祖先、`[data-slot="sidebar"][data-sidebar-collapsed]` 容器、或 `[data-slot="sidebar"] > div[data-sidebar-collapsed]` 根三种情形时，`::before { content: none }`。
- 无平铺、无动画、无新设置、无 `!important`；所有数值集中在 `SCENE_CSS`，便于审核侧按截图单点调整。

## 生命周期取舍

- 浅色一次 setup 的 owned 顺序：theme 覆盖 → sidebar 控制器 → scene 控制器。scene 注册抛错时 `release()` 逆序释放 sidebar 与主题层，随后 `apply` 的 effect 清理监听；满足“第二注册失败回滚主题与第一槽”。
- 深色、停用、owner 子槽消失均由既有 `releaseAll` 释放两个 Slot controller 与样式节点；回浅/重声明恢复一份。
- `SceneStyle` 无 props、无 state、无副作用；React 卸载 slot 时 `<style>` 一并移除，代码不直接操作 `document`。

## 风险

- `[data-slot="sidebar"] > div:first-child` 依赖真实 DOM 中根确实是该容器的第一个 div；若出现前置兄弟节点，背景会缺失（不会遮挡）。若直接 div 多于一个，需审核侧改为更精确的选择器（本次未用广域 `> div`，避免多处上色）。
- `[data-sidebar-collapsed]` 按“存在即收起”的属性语义匹配；若官方把它写成 `data-sidebar-collapsed="false"` 这类始终存在的值，收起判定会反置（应改为带值判断）。以真实 DOM 属性写法为准。
- 根上新增 `position: relative` 会改变绝对定位子元素的包含块，`isolation: isolate` 会新建堆叠上下文；可能影响侧栏浮层/菜单/拖拽层或原有 `z-index`。任务单要求如此实现，但需真实窗口检查 popover、更多菜单、滚动条与代码横滚。
- `z-index: -1` 只保证在自身根背景之上、根内容之下；若中间某个子容器有不透明背景铺满，人物会被该子层挡住（可能表现为完全看不到图）。
- 伪元素 `inset: 0` 相对根的 padding box；若该根本身是滚动容器，背景会随内容滚走，而不是固定在视口。真实 DOM 若如此，需换承载节点或改用 fixed 方案（超出本任务范围，先记录）。
- 宿主若已在这两个根上使用 `::before` 绘制内容，本包的 `::before` 会与其属性合并（相同属性覆盖），有互相影响的可能；`::after` 同样有风险，未在真实窗口确认。
- `avatar.webp` 母版为 192px，侧栏按 210px 放大，可能有轻微模糊；低透明度下预计不可见，但未截图确认。
- `max-width: 900px` 用视口宽度而非聊天区/侧栏实际宽度，窄窗口下侧栏可能先收起，届时头像背景由收起规则隐藏。
- `data-phase="hero"` 的 `0.65`、窄屏空态 `0.32` 为初始值，可能过强或压到居中标题/输入框；需按截图下调。
- 样式表是浅色期间全局生效的 `<style>`，仅靠选择器限定到两个官方容器；若宿主未来在这些容器外复用同名 `data-slot` 结构，会一并命中。
- 头图 URL 仍为绝对路径 `/dongxuelian-theme/assets/...`，依赖 P3 Host 白名单路由与打包 `files`；本次未核对 `package.json` 是否已包含 `sidebar-character.webp`。

## 未验证（待 Codex）

- 未运行 `node --test test/slots.test.mjs`、`node --test`、`npm run check`、真实 ModuleLoader、真实窗口或截图；本记录不构成测试通过证据。
- 已知测试对齐点：`test/theme.test.mjs` 仍断言旧暖色（`#F7F4EF`/`#4C4540`/`#716860`），本次按任务单只改 `client.js`，该文件需审核侧同步更新后才能全绿。
- `shell.overlay` 中 React 渲染裸 `<style>` 的实际插入位置、slot 卸载时节点移除、`data-dxl-scene` 属性保留，均待真实宿主确认。
- 真实 0.2.1-rc.2 中 `[data-slot="sidebar"]` 的直接根是否确为第一个 div、根背景是否不透明、`data-sidebar-collapsed` 的属性值语义、以及 `display: contents` 容器下 `position: relative` 的实际效果，需按真实 DOM 与计算样式复核。
- 800/1100/1440px、浅/深、停用/重启用、侧栏展开/收起、hero 与聊天的遮挡与对比度均未做窗口验证。
