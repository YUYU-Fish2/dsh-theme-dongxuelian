# P9-DSH 首稿说明：宽屏空态共同构图

2026-10-20。范围仅 `client.js` 的 `SCENE_CSS` 与本文；未改其他文件、测试、素材、版本、生命周期、Host 或模型配置，未运行 shell/Git、测试、真实宿主、浏览器或窗口预览，未读取凭据、日志、profile 或用户生成的会话图。以下只是待实测的实现说明，不是通过证据。

## 实际修改

只新增一个宽列容器查询，放在窄列规则之后、`max-width: 640px` 之前；既有 `<=1100px` 规则、active 聊天规则、原 26 个 token、24px 头像和 `apply` 事务/释放逻辑均未改。没有新增 JS、依赖、设置或 DOM 写入。

```css
@container dxl-reading (min-width: 1100px) {
  [data-slot="main.conversation"] > div[data-phase="hero"]
    [data-chain-overlay-fallback="conversation.composer"] > div {
    --dsh-composer-card-max-width:
      clamp(500px, calc(500px + (100cqi - 1100px) / 4), 560px);
    margin-inline:
      max(48px, calc((100cqi - 1280px) / 2 + 48px)) auto;
  }

  [data-slot="main.conversation"] > div[data-phase="hero"]
    [data-conversation-content]::before {
    inset: auto;
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    height: min(853px, calc(100% - 64px), calc(100cqi * 853 / 1280));
    width: auto;
    aspect-ratio: 1280 / 853;
    transform: translate(-50%, -50%);
    background-position: center;
    background-size: 100% 100%;
    mask-image:
      linear-gradient(90deg, transparent, #000 64px, #000 calc(100% - 64px), transparent),
      linear-gradient(180deg, transparent, #000 64px, #000 calc(100% - 64px), transparent);
    mask-composite: intersect;
  }
}
```

- 选择器仍以官方根 `[data-slot="main.conversation"] > div[data-phase="hero"]` 命名，只覆盖 hero；未使用 hash 类名。
- 输入栈仍取 `[data-chain-overlay-fallback="conversation.composer"] > div`，沿用原规则的 `width: 100%`、`max-width: var(--dsh-composer-card-max-width)`、`align-self: flex-start`，只改宽度变量和行内左距。
- 图片伪元素不再 `inset: 0` 铺满整列，而是独立盒子：高度取 853px、内容高度减 64px、宽度按原图比例所得高度三者最小值；`width: auto` + `aspect-ratio: 1280 / 853` 反推宽度，所以不拉伸；`translate(-50%, -50%)` 让盒中心落在内容列中心；`background-size: 100% 100%` 与原图同比例，不裁切。
- 渐隐改为横、竖两条 64px 边距的 linear-gradient，`mask-composite: intersect` 取交集；四边纸面渐隐随图片盒移动，中部保持全黑。没有降低整图 `opacity`，没有改 `reading.webp`。
- 原 `background` 简写中的 `#F7F3EB` 纸色、`no-repeat`、`z-index: -1`、`pointer-events: none` 仍继承；没有用背景色遮人物。

## 数值边界

- 1265×817、内容列约 985px：小于 1100px，不进入新查询，仍是原左距 48px、输入约 500px 的已满意小窗口。
- 内容列 1100px：输入宽 500px、左距 `max(48px, -42px)` 即 48px；图片高 `min(853, h-64, 733)`，宽 1100px。
- 内容列 1280px：输入宽 `500 + 180/4 = 545px`，左距 48px；图片最大 1280×853。
- 内容列 2279px（2559 窗口实测值）：输入宽封顶 560px，左距 `(2279-1280)/2+48 = 547.5px`；图片高 853px（若内容高度够）、宽 1280px，居中于内容列。
- 图片高度中的 `100%` 按 `[data-conversation-content]` 的包含块高度解析，不是窗口高度；`100cqi` 仍按会话根容器宽度解析。两者实际差值待真实窗口确认。
- 1100px 阈值处左距由旧规则的 `4cqi≈44px` 切到 48px，存在约 4px 的小跳变；宽度从 500px 连续增长，无阈值宽度突变。
- `clamp()` 在 1100–1340px 区间线性增长，1340px 后封顶 560px；低于 1100px 的 `min(500px, 55cqi)` 原样保留。

## 兼容性与风险

- 依赖 `cqi` 容器单位、`aspect-ratio`、`mask-composite` 与 `min()`/`clamp()`；当前宿主 Electron/Chromium 版本未在本次会话核对。
- `calc()` 中仅做“长度 × 数字 / 数字”，没有长度相乘或除以长度；若目标 Chromium 不支持该写法，`height` 整条会失效，需实窗确认图片盒没有塌成 0。
- 图片盒高度受限时宽度随比例缩小，可能小于 1280px 构图区；此时左右会露出更多纸面，而不是把图放大或裁切。
- 若 `[data-conversation-content]` 高度接近内容高度而非可用列高，`calc(100% - 64px)` 会让图片明显小于预期。
- 64px 四边渐隐是初值，人物、书或蓝花若靠近源图边缘可能被淡化；未按实际像素核对人物可见度。
- 图片盒超出内容列时没有被本包裁剪；若 `min()` 第三项未生效，可能出现横向溢出。
- 标题栈与输入同宽依赖宿主继续从 composer 栈读取 `--dsh-composer-card-max-width`；本次没有改宿主结构，也未验证标题是否随新变量移动。

## 未验证

- 未运行 `node --test`、`npm test`、`npm run check`、ModuleLoader、`npm pack`、隔离 Web预览或任何真实窗口。
- 未实测 2559×1395、1265×817、1920×1080、1440×900、800/1100/1280/1340 阈值、100/125/150% 缩放。
- 未确认输入/人物/书相对位置、四边渐隐观感、人物可见度、接缝色差、横向溢出、侧栏收放与右侧分栏。
- 未验证空态/聊天切换、深浅色切换、停用释放、图片与 token 回归；这些仍由 Codex 的真实 UI、测试与命令验证，并可按实测微调 64px/尺寸参数。
