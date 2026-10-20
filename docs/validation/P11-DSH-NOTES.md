# P11-DSH 首稿说明：整页纸面与单层场景

2026-10-20。范围仅 `client.js` 的 `SCENE_CSS`（及其上方一段描述性注释）、`index.js` 固定 `FILES` Map、`package.json` 的 `files` 白名单和本文。未改版本、测试、素材、生命周期、Theme token、Host 路由/HTTP 逻辑、profile/模型/权限或核心；未运行测试、Git、网络、浏览器或真实宿主。以下只是待 Codex 实窗核对的首稿，不是视觉通过证据。

## 实际修改

### 路由与发布白名单

- `index.js`：`FILES` 新增且仅新增一项
  `"/dongxuelian-theme/assets/paper.webp" -> ./assets/textures/web/paper.webp`。
  GET/HEAD、404/405/500、缓存头、`ctx.inject(['webServer'])` 和 `scope.effect` 释放逻辑均未改；只把相邻注释里的 "two files" 改为 "three files"。
- `package.json`：`files` 新增 `assets/textures/web/paper.webp` 与
  `assets/textures/README.md`，其余项和顺序不变；版本仍为 `0.1.0-preview.4`。

### 纸纹

- `[data-slot="sidebar"] > div` 与会话根 `[data-slot="main.conversation"] > div[data-phase]`
  使用同一组声明：

  ```css
  background-color: #F7F3EB;
  background-image: url("/dongxuelian-theme/assets/paper.webp");
  background-repeat: repeat;
  background-size: 640px 640px;
  ```

- 只画背景，不设宽度、padding、边框、overflow 或定位；侧栏宽度仍由宿主控制。

### 场景与层级

- 会话根新增 `position: relative`、`isolation: isolate`；原有
  `container-name: dxl-reading` / `container-type: inline-size` 保留。
- 场景只保留一个负层级伪元素，直接挂在会话根：
  `[data-slot="main.conversation"] > div[data-phase]::before`。
- 原来内容容器上的 `[data-conversation-content]::before` 及其宽列/窄列/hero
  覆盖已全部删除，没有第二份 reading 图。
- 宽列 active 的 P10 不透明 `[data-conversation-scroll]` 底色和
  `[data-conversation-content]::after` 渐变桥已删除。宽列滚动容器改为
  `background: transparent`，但输入卡、代码块、消息气泡等宿主节点自己的
  实底没有删除。

### 宽列几何

位于既有 `@container dxl-reading (min-width: 1100px)` 内：

```css
--dxl-stage-inset: max(0px, (var(--dsh-conversation-column-width) - 1920px) / 2);
--dxl-reading-seat: calc(min(var(--dsh-conversation-column-width), 1920px) * .6);
--dsh-chat-content-width: min(
  var(--dsh-chat-user-width, 960px),
  calc(var(--dxl-reading-seat) - 96px),
  960px
);
--dsh-composer-card-max-width: calc(var(--dsh-chat-content-width) + 32px);
```

- 滚动容器 `width: var(--dxl-reading-seat)`、`margin-left: var(--dxl-stage-inset)`、
  `margin-right: 0`、`min-width: 0`、`background: transparent`。
- 阅读座取宿主已发布像素列宽的约 60%，共同舞台仍以 1920px 为上限；内容宽为
  座宽减 96px，再封顶 960px，并继续尊重宿主已有的 `--dsh-chat-user-width`。
- 图片仍是现有 `reading.webp`，未改字节。宽列下改为 3:2 盒，active 高
  `min(88vh, 100% - 64px, 1280px)`，hero 高 `min(90vh, 100% - 64px, 1280px)`；
  盒的右缘用 `max(0px, (100% - 1920px) / 2)` 退到 1920px 舞台内，四边各有
  64px 渐隐。没有整块不透明阅读底盖住原图，左下花枝和自然边缘应该能透出；
  实际人物位置、缩放和裁切范围待 1625×968 实窗修正。

### 小列

- 保留原文字优先规则：`--dxl-scene-gutter`、内容宽、`margin-right` 和
  `@container` 的 900/760/640px 规则未改语义。
- 小列 active 滚动容器不再用直线渐变，而是铺同一 `paper.webp`、640px repeat
  的纸面；代码块仍 `#FFFDF8`，输入仍由 `--dsw-specific-input-major` 提供浅纸实底。
- 消息、正文、气泡没有设置 `opacity`、`mask` 或 `filter`；输入菜单、按钮、
  焦点和滚动条没有新增规则。
- 小列 active 原图仍是基础 `auto min(100%, 720px)`、`right -150px center`；
  `@media (max-width: 1180px)` 恢复原来的 58% 高度/`right -110px`，
  `@media (max-width: 1040px)` 恢复 hero 的 36% 右上小图。

## 背景层级

会话根内部从下到上：

1. 根背景：`#F7F3EB` + `paper.webp` 平铺；
2. 根 `::before`：`reading.webp`，`position: absolute; inset: 0; z-index: -1;
   pointer-events: none`，位于根建立的隔离堆叠上下文内，所以在本根背景之上、
   所有正常流子节点之下；
3. header、content、消息、工具卡、输入等宿主节点。header 已确认透明；
   宽列 active 的 scroll 透明，设计上原图和根纸纹能贯穿标题至底部（前提是
   content 自身没有额外实底，待实窗确认）；
4. 宿主自己的气泡、代码块、输入卡实底在需要处盖住背景，保证文字清楚。

本稿没有为侧栏新增伪元素：纸纹直接铺在已确认的 `[data-slot="sidebar"] > div` 盒上。
窄列 scroll 的纸纹是另一层正常背景，位于其消息内容之下；它只覆盖窄列阅读区，
不改变根场景的唯一性。

## 选择器依据

只使用任务单已核对的公开锚点：

- `[data-slot="sidebar"] > div`：真实侧栏盒；
- `[data-slot="conversation.header"] > header`：透明 header，本稿不直接选中它；
- `[data-slot="main.conversation"] > div[data-phase]`：会话根，`hero`/`active` 为官方 phase；
- `[data-conversation-content]`、`[data-conversation-scroll]`、`[data-composer-card]`：
  沿用 P9/P10 已核对的内容、滚动和输入标记；
- `[data-chain-overlay-fallback="conversation.composer"] > div`：沿用现有 hero 输入栈锚点。

没有使用 hash 类名、`nth-child` 猜结构、`body/html` 全局布局重写或 DOM 写入。

### 为什么根场景用 viewport 代理而不是 @container

会话根本身就是 `dxl-reading` 查询容器，`@container` 不能给容器自身的
`::before` 应用条件；把场景留在 `[data-conversation-content]::before` 虽然能查询，
但会退回“场景在内容里”的旧结构，无法覆盖 header，也会与“只保留一份场景”冲突。
追加 JS 尺寸监听被任务禁止。

本稿因此只对**背景层**使用 viewport 代理：

- `@media (min-width: 1380px)`：宽列 3:2 场景。按已知 280px 侧栏，1380 − 280 = 1100，
  与内容容器宽列阈值对齐；1625×968 示例会进入该分支。
- `@media (max-width: 1180px)`：active 中等列 58% 图；1180 − 280 = 900。
- `@media (max-width: 1040px)`：hero 小图；1040 − 280 = 760。

这些代理只改 `::before` 的尺寸、位置和 mask；阅读座宽度、内容宽、输入宽仍由
`@container` 和宿主像素变量计算，所以正文不会跟着 viewport 代理变形。没有用
`:has()` 做宽度判断，因为 `:has()` 的选择依据是子树/属性而不是根的实测宽度；
在父级是 `display: contents` 且没有稳定祖先容器的前提下，viewport 代理是无需 JS
的最简可行方案。

## 计算值（未实测）

按 P9/P10 已记录的 280px 侧栏估算：

| 视口宽 | 内容列 | 阅读座 60% | 内容宽 | 场景媒体分支 |
| --- | --- | --- | --- | --- |
| 1625 | 1345 | 807 | 711 | 宽列 3:2，高约 852、宽约 1278，右缘 0，左缘约 67 |
| 2331 | 2051 | 1152 | 960 | 宽列 3:2，高约 1221、宽约 1832，舞台内缩 65.5 |
| 1265 | 985 | 约 709（旧窄列公式） | 约 661 | 非宽列，基础 720px 图 |

1265 行仍走原窄列阅读座公式，不是 60% 宽列公式；“阅读座 60%”只在内容容器
达到 1100px 后生效。所有数值都依赖宿主实际内容高度、header 高度、滚动条和
`--dsh-conversation-column-width` 的真实值，需实窗复核。

## 未测项与风险

- 未运行 `node --test`、`scripts/check.mjs`、ModuleLoader、`npm pack`、真实宿主、
  浏览器或任何窗口；不声称 18 项回归、纸纹 GET/HEAD 200、深浅色切换、停用释放、
  焦点/菜单/滚动或宽小实窗已通过。
- 640px 平铺是否有接缝、与侧栏纸纹的纤维对齐、与 P9 原图纸色的细微色差，均未看；
  README 的“可平铺性需浏览器确认”仍未完成。
- 窄列 scroll 的纸纹从自身盒左上角起铺，和根纸纹不一定对齐；其右缘没有 P10 的
  32px 渐变，可能出现一条较硬的纸面/插画边界。先保留纹理统一，待实窗决定是否
  换成带渐隐的承托层。
- 宽列 scroll 透明后，正文直接落在原图左侧纸面上；原图该区域是否足够干净、
  左下花枝是否压字、人物脸/手/书是否被阅读座或 64px mask 切到，均未看。
- 宽列场景的 88vh/90vh 是首稿值，未按 1625×968 示例对齐；`right` 的百分比
  余量、`aspect-ratio` + `width:auto` 在绝对定位伪元素上的实际求值、`max()` 中
  百分比减像素的兼容性均未在宿主 Chromium 核对。
- media 代理只在“侧栏约 280px”时与内容阈值同步；侧栏收起、侧栏宽度不同或未来
  宿主改变布局时，场景分支可能和阅读座分支短暂错位。这是本稿明确的取舍，不是
  已验证的一致行为。
- 未确认会话根是否已有宿主/其他插件的 `::before`；若有，本次声明会与其属性合并
  竞争。也未确认根是否 `overflow: hidden` 而裁掉宽列图片左缘。
- 未确认 `[data-slot="conversation.header"] > header` 确实在会话根内部并保持透明；
  若 header 是根的兄弟，根纸纹和场景不会铺到标题后面。
- 未确认侧栏根背景是否被宿主更高优先级/内联样式覆盖；未改侧栏宽度和折叠逻辑。
- 未在真实窗口验证输入菜单、按钮、焦点、滚动条、深色释放；这些规则本稿没有改，
  但不能用“未改”代替回归结果。

## 边界

仅交付上述文件。未提交、未安装、未推送、未更新版本或归档；实窗对照、参数修正、
测试和最终验收由 Codex 负责。不声明视觉通过。
