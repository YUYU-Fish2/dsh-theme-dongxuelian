# P10 A方案同纸底柔边融合 Implementation Plan

> **执行记录（2026-10-20）：**用户在文件梳理后明确要求“开始工作，记得跟dsh分工”。已按executing-plans执行Task1–4：DSH限定CSS与首稿说明，Codex实窗/命令/交付。实现基线efc560d，隔离工作树paper-blend；最终preview.4与证据见docs/validation/P10.md。下方保留规划参数和执行步骤，勾选表示已完成。

**Goal:** 落实用户已选A方案，让聊天阅读区、底部输入框与抱书插画自然衔接，消除竖直切割感，同时保持文字、代码和操作控件清楚。

**Architecture:** 复用client.js的SceneStyle、会话内容隔离层和现有图片。宽列阅读区保持实色纸底，在其右侧用内容容器的独立背景伪元素延伸一段渐变；文字与控件完全不透明。沿用P9阅读/人物几何，不通过加大空白、缩窄正文或淡化人物来制造融合。

**Tech Stack:** 原生CSS渐变、伪元素、容器查询及现有官方Theme/Slot；无新JS逻辑、库、纹理资源或设置。

---

## 1. 已确认的选择与基线

- 用户已从三张示意中选择“第一种，就a”，随后要求“写出规划”。A为同纸底与柔边融合；B独立阅读纸页、C轻透纸面均不实施。
- A示意仅用于过渡效果参考，保留现有真实DSH控件、消息结构、字体与排版；不照搬生成图中重绘的图标、会话文字、额外花瓣或侧栏背景。
- 本地A示意位置：`C:/Users/sjtxd/.codex/generated_images/01a154f4-cd15-7cc2-a7a2-3d14a277e004/exec-76d99eae-446a-4ff1-b846-6a0a252c3afb.png`。不复制用户截图或整页生成示意到公开仓库/安装包。
- 规划时提交45bb84a；实际实施基线efc560d，分支feat/theme-v1，隔离工作树paper-blend。P9 preview.3为修改前基线，P10完成后本地交付preview.4，未推送。
- 继续使用assets/scenes/web/reading.webp，1536×1024、308130B，SHA256 `8ba35051b5bfc41ce67b473881c678b3061488e9fa46c4e44166ac276741e488`；不重新生成或修改图片。
- 当前active阅读底使用末端32px渐变。图片在内容容器::before，内容容器已有position:relative/isolation:isolate；本插件尚未占用该容器::after，可复用它承载背景过渡。

## 2. 视觉要求

1. **正文实底：**文字、代码、工具卡及消息气泡背后保持清楚的纸色阅读面。不给整个聊天容器设置opacity、mask或filter，不让图案透到文字下面。
2. **柔边位于文字之外：**宽列过渡带初始总宽128px，其中24px与阅读底重叠，向图片侧延伸104px；容器变窄时最小96px。宽度是试排值，不是已实测结果。
3. **人物清楚：**柔边主要经过图中的纸面/稀疏花枝，不横盖脸、手或书。若覆盖到这些区域，先缩窄过渡带；必要时图片右移24px、最多48px，并检查右侧仍完整。不得靠增加栏间空白解决。
4. **输入框轻纸卡：**保留稍亮的#FFFDF8纸色、原圆角和功能边界；只微调非聚焦状态阴影，使其与纸底协调。键盘焦点、输入光标和发送按钮仍沿用宿主可见状态。
5. **小列阅读优先：**新柔边限会话列≥1100 CSS px；小窗口/窄分栏先保留P9规则，不强塞宽过渡。首页构图、人物大小、阅读宽度和侧栏布局不在本次重设计范围。

## 3. 文件与职责

所有项目路径相对于`E:/codex/dsh主题开发`。

| 文件 | 操作与职责 |
| --- | --- |
| client.js | 仅修改SCENE_CSS的宽列active阅读背景、桥接伪元素和非聚焦输入卡阴影 |
| docs/coordination/P10-A-task.md | 已准备的DSH限定任务，后续实施时才派发 |
| docs/validation/P10-DSH-NOTES.md | DSH实施时新增，记录实际修改和未验证项 |
| docs/validation/P10.md | 已记录实际窗口、检查结果及归档/desktop交付信息 |
| docs/validation/screenshots/p10-chat-wide.jpg、p10-chat-small.jpg | 实施后保存隔离数据实际截图，不使用生成图冒充 |
| docs/HANDOFF.md、IMPLEMENTATION-PLAN.md、coordination/WORKBOARD.md | 同步当前阶段与剩余项 |
| package.json、README.md、docs/RELEASE.md、docs/INSTALL.md | 实施验收后才更新preview.4版本与说明 |
| release/preview.4-manifest.json、release/SHA256SUMS.txt | 归档后填写实际大小与哈希，保留preview.3 |

index.js、图片、现有生命周期和宿主核心无需修改。此次为局部CSS适配，不引入第三方方案或进行外部库检索。

## Task 1：真实基线与限定派发

- [x] Codex查看当前Git状态，保留用户更改；读HANDOFF、本计划和P9验证。仅在后续明确要求实施时开始本任务。
- [x] 复用既有隔离theme-test，不读日常聊天或模型凭据；打开已有隔离聊天内容。在约2331×1388的用户反馈窗口与1265×817小窗口各留一张修改前图，记录实际内容列、阅读区右边界和人物位置。截图像素不能直接当CSS viewport，按实际测量记录。
- [x] 确认真实DOM仍有[data-conversation-content]、[data-conversation-scroll]和[data-composer-card]；检查宿主/其他激活样式没有占用计划中的::after。若占用，不直接覆盖，先改用同一背景层的多重渐变方案并记录原因。
- [x] 使用docs/coordination/P10-A-task.md派发DSH，只允许client.js样式和P10-DSH-NOTES。沿用既有worker patch，不改模型、不使用DSH shell。

实际调用沿用下列范式，工作目录改为paper-blend隔离工作树，patch与日志使用主工作区.research绝对路径：

```powershell
Get-Content -LiteralPath 'docs/coordination/P10-A-task.md' -Raw |
  & 'E:/dsh/resources/runtime/cli/bin/dsh.cmd' headless --patch '.research/dsh-worker.patch.yml' --json - `
    1> '.research/dsh-p10-a.events.jsonl' 2> '.research/dsh-p10-a.stderr.log'
```

## Task 2：DSH实施背景过渡

- [x] 在现有≥1100px容器查询内，为active内容定义共享的阅读区尺寸变量。使用官方已发布的像素列宽，不在可继承自定义属性内使用100cqi，避免P9遇到的内层容器重新求值问题。
- [x] 用共享变量替换原宽列scroll的等价width/margin-left，阅读区几何保持一致；其背景改为实色纸底，原32px内部渐变由独立桥接层替代。
- [x] 新增内容::after背景桥，不修改scroll内容、消息节点或文字透明度。首稿完整CSS如下，合入现有容器查询，替换相应旧scroll规则，勿复制出第二套等价覆盖：

```css
@container dxl-reading (min-width: 1100px) {
  [data-slot="main.conversation"] > div[data-phase="active"] [data-conversation-content] {
    --dxl-paper-inset: max(0px, (var(--dsh-conversation-column-width) - 1920px) / 2);
    --dxl-paper-column: calc(min(var(--dsh-conversation-column-width), 1920px) - var(--dxl-scene-gutter));
    --dxl-paper-blend: clamp(96px, 6cqi, 128px);
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
}
```

桥与图片同为负层级，::after绘于::before之后、真实消息控件之前；阅读底覆盖重叠部分，所以渐变不会淡化文字。桥的尺寸变量仅在内容容器伪元素/直接阅读容器上使用；若需要继承给更深层节点，先把相关cqi换为宿主像素列宽，避免改变参考容器。

- [x] 不更改现有图片::before的四边mask。若桥影响人物，Codex先把过渡最大宽从128减到96px；仍不合适才在宽列active规则内将现有图片right值减24px（向右移），最多减48px，禁止缩小阅读宽或再加空白带。
- [x] 输入卡只更改非focus-within状态的轻阴影，不覆盖聚焦框线、outline、字体、行高、按钮状态或功能边界颜色。实窗若收益很小，保留原阴影并在记录说明，不为示意细节硬加效果。
- [x] DSH写P10-DSH-NOTES，说明选择器/层级、实际参数和未验证项；不自称已运行浏览器或测试。

## Task 3：Codex正常使用验收

- [x] 在同一隔离聊天、同样滚动位置保存宽/小窗口修改后图，确认阅读区宽度和输入位置没有漂移。正文、代码、工具卡、气泡及输入文字保持完整清楚。
- [x] 目视检查竖直纸面接缝消失或明显减弱，人物脸/书/手不被洗淡，没有大片新增空白、整页横滚或矩形遮罩。必要调整仅限Task2列明的带宽与图片小幅位置。
- [x] 正常滚动一次，打开/关闭附件菜单，输入两行后清空（不发送模型请求），键盘聚焦输入/发送按钮；确认桥不挡点击和焦点。侧栏收放或打开一次分栏，验证进入小列后自然恢复阅读优先。
- [x] 浅→深→浅、官方插件停用/启用各一次，确认桥和场景跟随原SceneStyle一起移除/恢复；不为未改Host路由重跑完整HTTP矩阵。
- [x] 最终代码只运行一次现有回归与语法/包契约，预期18项通过、check通过。若没有生命周期/Host变动，不重复真实loader、系统DPI、压力、全平台或多插件矩阵，不新增CSS字符串镜像测试。

```powershell
& 'D:/node.exe' --test test/*.test.mjs
& 'D:/node.exe' scripts/check.mjs
git diff --check
```

- [x] 核对diff只涉及本次样式；图片哈希不变。纯局部CSS不专门外搜/查重；若实施意外扩展为公共逻辑或完整代码质量审查，按AGENTS使用明确项目路径jscpd CLI，不使用未知索引结果。
- [x] P10.md记录实际截图、参数、检查通过/未测项和DSH分工；不把本轮规划或A生成图当作实测证据。

## Task 4：实施验收后交付

- [x] 代码/视觉验收通过后，将package.json的version从0.1.0-preview.3更新为0.1.0-preview.4，使用说明仅描述实际变化。图片尺寸/预算和运行依赖保持。
- [x] `npm pack --dry-run --json`确认仍只包含现有13项运行/说明文件；`npm pack --pack-destination release --json`生成新的preview.4 tgz，实际解包比对并写manifest/SHA256。不覆盖preview.3归档、校验或历史标签。
- [x] 归档在一个无源码链接的隔离profile离线安装，核对client.js/图片等13文件哈希并查看一次聊天过渡即可；无需重复P6卸载/重启全套。
- [x] 沿用此前明确本机安装授权，备份desktop相关5配置后通过官方CLI更新本包，核对既有插件/主配置保留。不强制退出用户DSH；记录安装与日常窗口是否已重载，不能混为一谈。
- [x] 更新HANDOFF、总计划、看板和部署记录，形成独立本地提交；没有本轮额外指令则不推送GitHub、不创建Release或发布npm。

## 实施结果

Task1–4已完成；DSH headless退出0。宽/小窗口正文与输入几何保持，柔边实际123.073px，沿用首稿参数，无需移动图片。18/18与check通过；preview.4归档351902B、13文件，隔离归档聊天和desktop哈希一致。desktop首次离线更新因Hindsight0.8.2离线元数据缺失失败；公开npm确认版本存在后正常联网安装成功，保留五插件版本，撤销pnpm自动追加的release-age例外，主配置恢复原字节。不强制重启日常DSH，不推送或发布；完整证据与未测边界见[P10](../../validation/P10.md)。
