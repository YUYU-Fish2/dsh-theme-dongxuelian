# P10-DSH 首稿说明：同纸底柔边融合

2026-10-20。范围仅 `client.js` 的 `SCENE_CSS` 与本文；未改测试、素材、`index.js`、版本、生命周期、Theme token、Host 接口、profile/模型/权限，未运行 shell/Git、测试、真实宿主、浏览器或窗口预览，未读取凭据或用户聊天。以下只是待实窗确认的首稿说明，不是通过证据。

## 实际修改

只改现有 `@container dxl-reading (min-width: 1100px)` 内与 active 阅读区相关的四处，未新增第二个等价容器查询，未改窄列规则、首页 hero 规则、图片 `::before` 的尺寸/位置/四边 mask、26 个 token、头像和 `apply` 事务。以下片段为便于阅读省略容器查询外壳，实际四条规则均位于该 `@container` 内。

```css
[data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-content] {
  --dxl-scene-gutter: clamp(380px, calc(var(--dsh-conversation-column-width) * .36), 720px);
  --dxl-paper-inset: max(0px, (var(--dsh-conversation-column-width) - 1920px) / 2);
  --dxl-paper-column: calc(min(var(--dsh-conversation-column-width), 1920px) - var(--dxl-scene-gutter));
  --dxl-paper-blend: clamp(96px, 6cqi, 128px);
  --dsh-chat-content-width: min(
    var(--dsh-chat-user-width, 1040px),
    calc(min(var(--dsh-conversation-column-width), 1920px) - var(--dxl-scene-gutter) - 96px)
  );
  --dsh-composer-card-max-width: calc(var(--dsh-chat-content-width) + 32px);
}

[data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-scroll] {
  width: var(--dxl-paper-column);
  margin-left: var(--dxl-paper-inset);
  margin-right: 0;
  min-width: 0;
  background: #F7F3EB;
}

[data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-content]::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--dxl-paper-inset) + var(--dxl-paper-column) - 24px);
  width: var(--dxl-paper-blend);
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(90deg,
    #F7F3EB 24px,
    rgb(247 243 235 / .82) 45%,
    rgb(247 243 235 / .30) 75%,
    transparent 100%);
}

[data-slot="main.conversation"] > div[data-phase="active"] [data-composer-card]:not(:focus-within) {
  box-shadow: 0 3px 14px rgb(49 58 80 / .06);
}
```

- **纸底与过渡分离：**active 滚动容器改为实色 `#F7F3EB`，删掉原末端 32px 透明渐变；过渡由内容容器的 `::after` 单独承载。正文、代码、工具卡和气泡仍是宿主原节点，不设 `mask`、`opacity` 或 `filter`，不改消息 DOM。
- **层级：**内容容器此前已有 `position: relative` 与 `isolation: isolate`（P9 起沿用），`::after` 用 `z-index: -1`、`pointer-events: none`。同一负层里 `::before`（插画）先绘、`::after`（桥）后绘，真实消息控件再绘于其上；桥与滚动容器重叠的 24px 被实色阅读底盖住，因此渐变不会淡化正文。
- **定位变量：**`--dxl-paper-inset` 与 `--dxl-paper-column` 均由宿主已发布的 `--dsh-conversation-column-width` 像素值计算，未在可继承自定义属性里使用 `100cqi`。新的 `cqi` 只出现在计划明确指定的 `--dxl-paper-blend`（6cqi，96–128px），且只被同一内容容器的 `::after` 使用。
- **几何替换：**原宽列 `scroll` 的 `width: calc(min(100cqi, 1920px) - gutter)`、`margin-left: max(0px, calc((100cqi - 1920px) / 2))` 改为上述共享变量。两者在“宿主像素列宽 = 查询容器宽度”的前提下表达式等价；本次未在窗口复测。
- **桥的尺寸：**总宽 `clamp(96px, 6cqi, 128px)`，左缘落在阅读底右缘内 24px，向插画侧延伸 `总宽 - 24px`（宽列约 72–104px）。渐变前 24px 为实色，随后按 `.82 → .30 → transparent` 过渡。
- **输入卡：**仅非 `:focus-within` 状态加 `0 3px 14px rgb(49 58 80 / .06)` 轻阴影；未设置 border、outline、background、字体、行高、按钮状态或过渡动画，聚焦时该规则不再匹配，保留宿主焦点表现。

## 选择器依据

- 全部沿用现有官方根选择器 `[data-slot="main.conversation"] > div[data-phase="active"]` 及其 `[data-conversation-content]` / `[data-conversation-scroll]` 子标记，没有引入 hash 类名。
- `[data-composer-card]` 是本次新引用的宿主标记，依据派发前 Codex 在真实隔离 Web 确认该 DOM 存在；`:not(:focus-within)` 用于只在静止态生效。未确认该节点就是最终可见卡片盒，也未确认宿主是否会以更高优先级覆盖该阴影。
- 本包样式此前没有 `::after` 规则；Codex 在派发前确认目标内容容器的 `::after` `content` 为 `none`、`background` 为 `none`，因此本次不是覆盖已有桥。若宿主或其他激活插件在别的状态占用同一 `::after`，本规则会与其声明合并竞争，需由 Codex 实窗判断后调整，不应直接假定安全。
- 选择器仍限定在宽列 active，窄列、首页、侧栏和非会话页面不新增规则。

## 数值与边界（计算值，未实测）

- 内容列 1100px：gutter ≈396px，scroll 宽 704px，inset 0，桥宽 96px；桥从 680px 起，向插画侧延伸 72px。
- 内容列 1920px：gutter ≈691px，scroll 宽 1229px，桥宽约 115px（6cqi）。
- 内容列 2279px（P9 的 2559 窗口实测列宽）：gutter 720px，scroll 宽 1200px，inset 179.5px，桥宽封顶 128px；桥左缘 1355.5px、右缘 1483.5px，仍在内容列内。
- `>=1100px` 才出现桥；`<1100px` 与 `<=640px` 规则保持 P9 原样。桥的最小总宽 96px，不是新增栏间空白。

## 风险与未验证

- 未运行 `node --test`、`scripts/check.mjs`、ModuleLoader、`npm pack`、隔离 Web 或任何真实窗口；不声称截图、焦点、滚动、深浅色切换或开关释放已验证。
- 未实测桥的实际观感：接缝是否消失、人物脸/手/书是否被洗淡、24px 重叠是否完全被实色底盖住、亚像素下是否出现细线，均待 Codex 实窗截图判断。滚动容器若有圆角、边框或内边距，也会改变接缝形态，未测。
- 未确认 `[data-conversation-content]` 是否有水平 padding；绝对定位的 `left` 以 padding 盒为基准，而 `scroll` 的 `margin-left` 以内容盒为基准，若有 padding 会产生同量偏移。首稿按“无水平 padding”的计划假设实现。
- 未确认 `--dsh-conversation-column-width` 在目标窗口始终为像素值、且等于内容容器宽度；若宿主改变该变量语义，`inset`/`column` 与旧 `100cqi` 表达式将不再等价。也未确认内容容器本身没有被额外限宽或水平居中；任一偏差都会让 `::after` 的绝对定位基准相对滚动容器偏移。
- 未确认 `6cqi` 在 `::after` 上的解析容器与声明处完全一致；按现有结构它应仍是 `div[data-phase]` 查询容器，但未在真实浏览器核对。
- 未确认 `[data-composer-card]` 的可见盒子、宿主原阴影和焦点环；若轻阴影收益很小或被覆盖，按计划保留宿主原样并在 P10 记录说明即可。该规则在聚焦时整体不再匹配，阴影可能瞬时切换而宿主过渡是否覆盖此变化未测。
- 未重跑窄列与首页；虽未改其选择器，仍以 Codex 的差异与常规回归为准。

## 边界

仅交付上述两个允许文件的内容。未提交、未安装、未推送、未更新版本或归档；实窗验收、参数微调、测试和后续交付由 Codex 负责。
