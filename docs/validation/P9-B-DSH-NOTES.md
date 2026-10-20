# P9-B-DSH 修订说明：1920px 宽屏构图与 active 收拢

2026-10-20。本文件记录 `client.js` 中 `SCENE_CSS` 的 P9-B 宽列修订，并新增本说明；不修改其他文件。以下参数是 Codex 提供的**试排值**，必须由其真实窗口、真实宿主和截图继续调整；本文不构成已验证结论。

## 范围与前提

- Codex 已按用户批准预览重新生成 `assets/scenes/p9/reading.png`，并按原尺寸等比覆盖 `assets/scenes/web/reading.webp`；新图为 1536×1024，比例 3/2。本文没有读取或修改图片、旧 P8 母版或素材说明。
- 只改 `client.js` 的 `SCENE_CSS`，新增本文；未改图片、测试、其他文档、token、生命周期、Host、`package.json`、profile、模型或权限。
- 未用 shell 修改文件，也未用 shell 运行测试、构建、Git、网络或安装；未使用子 agent。未运行 `node --test`、`npm test`、`npm run check`、真实宿主、浏览器、窗口或截图；未读取凭据、日志或用户会话。未提交。
- 没有新增 JS、依赖、设置、动画、DOM 写入或 hash 类名；没有改消息 DOM、代码内部横滚或全局字体。定位仍只用任务已核对的 `data-slot` / `data-phase` / `data-conversation-content` / `data-conversation-scroll` / `data-chain-overlay-fallback` 锚点。
- `<=1100px` 的既有窄列规则、active 基础纸白规则、`max-width: 900/760/640px` 查询均未改。新几何全部关在 `@container dxl-reading (min-width: 1100px)` 内，避免向小分栏泄漏。

## 实际修改

全部改动位于原有宽列容器查询内，选择器仍以官方会话根命名。层级、纸色和 `pointer-events: none` 继续由基础 `::before` 提供；宽列只覆盖盒子尺寸、位置和遮罩。

1. **共同构图区与 hero 输入**

   ```css
   --dsh-composer-card-max-width:
     clamp(500px, calc(500px + (100cqi - 1100px) * .34), 880px);
   margin-inline:
     calc(clamp(24px, 4cqi, 48px) + max(0px, (100cqi - 1920px) / 2)) auto;
   ```

   输入不再封顶 560px，随 1100–1920px 逐步放大，并用 880px 封顶；超过 1920px 时左距加入 `(100cqi - 1920px) / 2`，把内容推回居中的 1920px 共享构图区。

2. **hero/active 共用伪元素基础**

   ```css
   [data-phase="hero"] [data-conversation-content]::before,
   [data-phase="active"] [data-conversation-content]::before {
     inset: auto;
     top: 50%;
     width: auto;
     aspect-ratio: 3 / 2;
     transform: translateY(-50%);
     background-position: center;
     background-size: 100% 100%;
     mask-image:
       linear-gradient(90deg, transparent, #000 64px, #000 calc(100% - 64px), transparent),
       linear-gradient(180deg, transparent, #000 64px, #000 calc(100% - 64px), transparent);
     mask-composite: intersect;
   }
   ```

   图片仍是独立伪元素，不参与文档流；`width: auto` 加 `aspect-ratio: 3 / 2` 由高度反推宽度，配合 `background-size: 100% 100%`，在 3/2 盒内不拉伸、不裁切。负层级和 `pointer-events: none` 沿用基础规则。四边各 64px 渐隐，避免明显矩形接缝。

3. **hero 位置与高度**

   ```css
   right: calc(max(0px, (100cqi - 1920px) / 2)
     - clamp(0px, (1920px - 100cqi) * 190 / 820, 190px));
   height: min(
     clamp(800px, calc(800px + (100cqi - 1100px) * 480 / 820), 1280px),
     calc(100% - clamp(0px, (100cqi - 1100px) * 64 / 820, 64px))
   );
   ```

   1100px 时保留 `right: -190px`、800px 高的小窗口几何；1920px 时 `right: 0`、1280px 高，宽度按 3/2 达 1920px；超过 1920px 时 `right` 等于共同构图区右外边距，图片不再继续向右贴边。

4. **active 阅读区收拢**

   ```css
   --dxl-scene-gutter: clamp(340px, calc(100cqi * .32), 620px);
   --dsh-chat-content-width: min(
     var(--dsh-chat-user-width, 1040px),
     calc(min(100cqi, 1920px) - var(--dxl-scene-gutter) - 96px)
   );
   --dsh-composer-card-max-width: calc(var(--dsh-chat-content-width) + 32px);
   ```

   默认正文宽改为 1040px（不再锁死 760px），但继续尊重用户显式设置的 `--dsh-chat-user-width`；只有该变量缺失时才用 1040px。可用宽度随共享构图区收窄，输入卡在正文宽基础上加回 32px。

5. **active 滚动列**

   ```css
   width: calc(min(100cqi, 1920px) - var(--dxl-scene-gutter));
   margin-left: max(0px, calc((100cqi - 1920px) / 2));
   margin-right: 0;
   min-width: 0;
   background: linear-gradient(90deg, #FFFDF8 calc(100% - 16px), transparent);
   ```

   滚动列左对齐并限制在“共享构图区 − 场景让位”内；超过 1920px 时用左外边距把 1920px 构图区居中，右侧不再额外留 `--dxl-scene-gutter`。纸白阅读面渐变和 `pre` 的纸白底色保持，正文与输入继续由官方堆栈在该有限阅读区内居中，不再相对全屏空白居中。未改滚动列内部的消息结构或代码横滚。

6. **active 图片**

   ```css
   right: calc(max(0px, (100cqi - 1920px) / 2)
     - clamp(0px, (1920px - 100cqi) * 150 / 820, 150px));
   height: min(
     clamp(720px, calc(720px + (100cqi - 1100px) * 560 / 820), 1280px),
     calc(100% - clamp(0px, (100cqi - 1100px) * 64 / 820, 64px))
   );
   ```

   复用 hero 的 3/2 大绘图盒；1100px 时从 `right: -150px`、720px 高起步，1920px 时到 `right: 0`、1280px 高，超过 1920px 后按构图区外边距退让。active 的右侧 150px 偏移和 hero 的 190px 偏移分别保留，避免把人物重新贴到最右边。纸白阅读面在滚动列上仍是不透明主体，人物主要从右侧让位带露出。

## 数值试排

按 `cqi` 约等于会话列宽估算，未扣除宿主 header、滚动条、面板 padding 或实际内容高度；`height` 的 `100% - 64px` 上限可能使下列图片更小。所有值都需实窗复核。

| 列宽 | hero 输入 | hero 图高×宽 | hero right | active 让位 | active 滚动列 | active 正文 | active 图高×宽 | active right |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1100px | 500px | 800×1200px | -190px | 352px | 748px | 652px | 720×1080px | -150px |
| 1280px | 561.2px | 905.4×1358px | -148.3px | 409.6px | 870.4px | 774.4px | 842.9×1264.4px | -117.1px |
| 1920px | 778.8px | 1280×1920px | 0 | 614.4px | 1305.6px | 1040px | 1280×1920px | 0 |
| 2560px | 880px | 1280×1920px | 320px | 620px | 1300px | 1040px | 1280×1920px | 320px |

- 2560px 行的滚动列另有 `margin-left: 320px`；1100–1920px 行为 0。
- 默认正文宽 1040px 时，1920px 滚动列内左右各约 132.8px 纸白余量；人物理论上从图宽 55% 起，若图片高度达到 1280px、左缘为 0，可见人物从滚动列右缘 1305.6px 开始进入右侧让位带。
- 高度受限时（如 1920×1080，内容高度约 1016px），图片约 1524×1016px、左缘约 396px，人物 55% 起点约 1234px；滚动列仍到 1305.6px，正文右缘约 1172.8px，人物可见部分在其右。

## 与旧 P9 首稿的差异

- 共享构图区从 1280px 改为 1920px；hero 输入上限从 560px 改为 880px，不再是一小块。
- hero 图片从 1280×853、最大 853px 高，改为 3/2 比例、800→1280px 高，并保留 1100px 处 `right: -190px`。
- active 从“几乎整列滚动 + 正文 760px 居中”改为“滚动列 = 构图区 − 场景让位”，默认正文 1040px，输入卡跟随；active 图片也从旧的小图改为 3/2、720→1280px 的共享大绘图盒。
- `<=1100px` 规则、基础 active 规则、窄列查询均保持原样。

## 风险与需实窗调整

- **输入斜率与 880px 目标不完全一致**：按建议的 `.34`，1920px 列宽时输入约 778.8px，而不是 880px；880px 要到约 2217px 才达到。若要求 1920px 处正好 880px，应把 `.34` 改为 `380 / 820`（约 `.4634`）。本次按 Codex 建议值保留，便于实窗比较。
- **1100px 阈值处 active 有跳变**：窄列 active 让位约 28%（1100px 时约 307.7px），宽列改为 32%（352px），滚动列约 791.3→748px，正文约 743.3→652px。任务要求不改窄列，故该边界跳变保留；需真实拖动窗口确认是否明显。
- **人物与正文的相对位置仍取决于真实图**：纸白滚动列会遮住其下方的图片，人物应主要从右侧让位带露出；但在超高窗口（如 1920px 宽且内容高度足够）图片达到 1920×1280px 时，55% 人物起点约 1056px，早于滚动列右缘 1305.6px，人物左侧约 250px 会被纸面遮住。需按用户对人物完整度的要求实窗确认；若必须露出更多人物，可调让位、正文宽或图片高度，而不应把正文铺到人物上。
- **`height` 的 `100%` 基准**：`calc(100% - 64px)` 按 `[data-conversation-content]` 的包含块解析，不是窗口高度；若该元素高度由内容撑开，图片可能明显小于试排值。
- **滚动列宽度与定位的宿主假设**：本次给 `[data-conversation-scroll]` 明确 `width` 和 `margin-left`，假设它仍是可收缩的普通 flex/block 子项且未被宿主自身居中。若宿主另有 `align-items: center`、固定宽度或内联样式，左对齐/让位可能不符合预期；需实窗核对侧栏收放和滚动条位置。
- **64px 四边渐隐**：小窗口宽列下，右侧 64px 可能覆盖到图片宽度的最右约 5%，人物/书边缘可能被轻微淡化；只在 `>=1100px` 生效，需按实际像素检查。
- **超过 1920px 的居中**：`margin-inline` 与 `right` 都使用 `(100cqi - 1920px) / 2`，依赖 `cqi` 仍是会话根容器宽度；若宿主在中间插入新的容器，单位基准会改变。
- **未使用 hash 类或改核心**：本次不需要改其他核心，也没有使用 hash 类，因此没有触发“先写风险、停止扩展”的条件。

## 未验证

- 未运行任何测试、检查、ModuleLoader、`npm pack`、隔离预览或真实窗口；未生成截图。
- 未验证 1100/1280/1440/1920/2560 等宽度、不同窗口高度、100/125/150% 缩放、侧栏收放、右侧分栏。
- 未确认 hero 输入在 1100–1920px 的观感、`880px` 封顶是否合适、active 正文 1040px 是否仍显空、输入卡是否跟随。
- 未确认人物、书、蓝花与 64px 渐隐的实际可见度，active 图片是否从让位带自然露出，纸白滚动列是否完全遮住其下图片，以及宽列与窄列切换时是否有接缝或横向溢出。
- 未验证深/浅色切换、停用释放、token、头像与图片路由回归；这些仍由 Codex 的真实窗口、测试和验收负责。

## 交付

- `client.js`：仅 `SCENE_CSS` 的宽列块及其注释。
- `docs/validation/P9-B-DSH-NOTES.md`：本说明（新增）。
- 未提交；未改其他文件。
