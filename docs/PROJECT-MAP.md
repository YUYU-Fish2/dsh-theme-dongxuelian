# 项目文件导航

> 2026-10-20用户复核更正：P10功能/安装证据保留，但未达到用户示例视觉，撤回“视觉已达标”的判断。当前按[P11设计](superpowers/specs/2026-10-20-reference-paper-design.md)接续：复用P9母版，补独立纸纹，修正遮挡与构图；用户随后明确要求安装并推送GitHub；已形成preview.5并安装desktop，上传证据以P11-DEPLOYMENT为准。

2026-10-20核对。当前分支`feat/theme-v1`，当前交付为P11 preview.5；既有部署记录确认已更新本机desktop并推送GitHub。本次梳理前本地HEAD与远端分支均为`ce5e7d0`，工作区干净；本次仅维护文档，不重新安装或验收日常窗口。P9人物场景继续复用，视觉差异见[P11](validation/P11.md)。进度以[HANDOFF](HANDOFF.md)、计划、看板和Git为准。

P11当前开发入口：[设计](superpowers/specs/2026-10-20-reference-paper-design.md)、[执行计划](superpowers/plans/2026-10-20-reference-paper.md)、[实际预览与差异](validation/P11.md)、[纸纹来源](../assets/textures/README.md)。preview.5归档与desktop15文件一致，详见[部署](validation/P11-DEPLOYMENT.md)；下方preview.4为历史记录，不能当P11视觉通过证据。

## 阅读入口

| 目的 | 入口 |
| --- | --- |
| 新会话接续 | [HANDOFF](HANDOFF.md) → [P11计划](superpowers/plans/2026-10-20-reference-paper.md) → [P11部署](validation/P11-DEPLOYMENT.md) → [总计划](IMPLEMENTATION-PLAN.md) → [看板](coordination/WORKBOARD.md)，遵守根[AGENTS](../AGENTS.md) |
| 找当前图片 | [P9新母版](../assets/scenes/p9/reading.png)及[来源说明](../assets/scenes/p9/README.md)，另有[P11纸纹](../assets/textures/README.md)；[原B系列](../assets/scenes/b-series/README.md)保留历史 |
| 查当前运行效果证据 | [P11实窗与已知差异](validation/P11.md)；沿用图片/首页见[P9](validation/P9.md)，真实聊天历史见[P5矩阵](validation/P5-MATRIX.md) |
| 查当前方案执行 | [P11设计](superpowers/specs/2026-10-20-reference-paper-design.md)、[已执行计划](superpowers/plans/2026-10-20-reference-paper.md)、[已交付任务](coordination/P11-A-task.md)；P10为历史A方案 |
| 给DSH派发任务 | [协作方法](coordination/DSH-COLLABORATION.md)；现有任务书均已交付，最新为P11-A，后续按新增需求限定范围 |
| 查安装和发行说明 | [README](../README.md)、[INSTALL](INSTALL.md)、[RELEASE](RELEASE.md)为preview.5；归档/日常安装实测见[P11部署](validation/P11-DEPLOYMENT.md) |

**P10历史交付状态：**P10功能检查和安装事实保留，视觉达标判断已撤回；preview.4为351902B、13文件，见[P10](validation/P10.md)和[清单](../release/preview.4-manifest.json)。P10当时未推送，相关实现随后随P11上传；当前交付与安装以[P11部署](validation/P11-DEPLOYMENT.md)为准。

## 目录分工

```text
项目根目录/
  client.js                            唯一客户端入口
  index.js、cordis.patch.yml            配套Host入口与注册配置
  package.json                         包契约、脚本与发布白名单
  README.md                            当前preview.5使用说明
  AGENTS.md、LICENSE、THIRD_PARTY_NOTICES.md
  assets/
    characters/                        Q版母版、保留的头像WebP及历史背景
    scenes/p9/                         按批准示意重新生成的当前场景母版
    scenes/web/                        当前reading.webp运行导出
    scenes/b-series/                   原P8抱书与三幅备选PNG母版，保留历史
    textures/                          P11纸纹母版、来源说明及web/paper.webp
    style-studies/                     A-F候选板与用户选B参考
  docs/
    HANDOFF.md                         当前状态、授权与下一步
    PROJECT-MAP.md                     本文件：导航与分类
    IMPLEMENTATION-PLAN.md             P0–P11总计划、验收与回退
    INSTALL.md、RELEASE.md              当前preview.5安装与发行说明
    P0-REPORT.md                        历史调研汇总
    superpowers/plans/                 P11已执行计划、P10/P9/P8历史计划
    superpowers/specs/                 P11当前设计、P9历史构图提案
    coordination/                      看板、DSH协作方法、已交付任务书
    design/                            视觉规范与历史探索
    research/                          随Git保存的调研证据
    validation/                        阶段验证、DSH说明与截图
  test/                                Node回归测试及共享夹具
  scripts/                             语法/包契约与真实loader检查
  release/                             当前preview.5 tgz/校验/manifest；旧包留历史
  .research/                           忽略的缓存、隔离home、配置与日志
```

保持现有路径，避免破坏文档引用、测试与发布白名单。不另建与根`client.js`等价的`src/`或`lib/`副本。

## 运行文件与检查工具

| 文件 | 职责 |
| --- | --- |
| [client.js](../client.js) | 唯一客户端源；官方factory、26项浅色token、明暗/停用事务；品牌头像和SceneStyle槽；P11整页纸纹、根场景及阅读/输入构图，宽列已撤掉P10实色阅读板与柔边桥 |
| [index.js](../index.js) | Host入口；官方生命周期内注册avatar、reading和paper三项固定WebP白名单路由 |
| [cordis.patch.yml](../cordis.patch.yml) | 注册唯一`dsh-theme-dongxuelian` Host entry |
| [package.json](../package.json) | 包版本、入口、DSH声明、发布白名单及`test`/`check`命令；零第三方运行依赖 |
| [test/theme.test.mjs](../test/theme.test.mjs) | 七项主题生命周期回归 |
| [test/assets.test.mjs](../test/assets.test.mjs) | 五项Host实际HTTP路由回归，需本地回环连接 |
| [test/slots.test.mjs](../test/slots.test.mjs) | 六项品牌/SceneStyle、明暗释放、owner恢复和回滚回归 |
| [test/helpers/client-host.mjs](../test/helpers/client-host.mjs) | 主题与Slot测试共用的模拟宿主夹具 |
| [scripts/check.mjs](../scripts/check.mjs) | JS语法、包契约、WebP格式/体积及白名单检查 |
| [scripts/runtime-smoke.mjs](../scripts/runtime-smoke.mjs) | 通过DSH Electron Run-as-Node检查官方ModuleLoader与token；不能代替窗口验收 |
| [.gitignore](../.gitignore) | 忽略`.research/`、`node_modules/`和`release/*.tgz` |
| [LICENSE](../LICENSE)、[THIRD_PARTY_NOTICES](../THIRD_PARTY_NOTICES.md) | 代码许可与参考代码归属；角色来源另见素材说明，不声明官方授权 |

表内测试数量来自当前文件和既有阶段记录；本次梳理不重新声明运行回归通过。

## 素材：当前运行与历史参考

| 文件 | 状态与用途 | 发布边界 |
| --- | --- | --- |
| [characters/README](../assets/characters/README.md) | 早期角色来源与导出说明 | 当前白名单包含 |
| [avatar.png](../assets/characters/avatar.png)、[sidebar-character.png](../assets/characters/sidebar-character.png) | Q版PNG母版，保留来源 | 不打包 |
| [avatar.webp](../assets/characters/web/avatar.webp) | 当前192px头像，26864B；P8沿用 | 当前运行资源 |
| [sidebar-character.webp](../assets/characters/web/sidebar-character.webp) | 历史512px Q版背景，124148B | 已撤出路由和包，保留源码 |
| [p9/README](../assets/scenes/p9/README.md)、[reading.png](../assets/scenes/p9/reading.png) | 当前P9母版；1536×1024、2577594B，按批准示意重新生成 | 母版不打包；当前WebP由此编码 |
| [b-series/README](../assets/scenes/b-series/README.md)、[reading.png](../assets/scenes/b-series/reading.png) | P8选定的B彩铅抱书母版；1536×1024、2857637B | 历史母版，不打包；对应旧WebP从preview.2追溯 |
| [web/reading.webp](../assets/scenes/web/reading.webp)、[场景说明](../assets/scenes/README.md) | 当前P9导出1536×1024、308130B，原尺寸quality92编码 | 当前唯一人物场景运行资源；P11继续复用 |
| [paper.png](../assets/textures/paper.png)、[纸纹说明](../assets/textures/README.md) | P11独立纸纹母版；1254×1254、2200910B | 母版不打包 |
| [web/paper.webp](../assets/textures/web/paper.webp) | P11纸纹导出1254×1254、56518B，原尺寸quality82编码 | 当前运行资源，浅色时以640px平铺并叠淡纸色 |
| [tea.png](../assets/scenes/b-series/tea.png)、[garden.png](../assets/scenes/b-series/garden.png)、[letter.png](../assets/scenes/b-series/letter.png) | 同系列备选 | 不默认接入或打包 |
| [p8-abc.png](../assets/style-studies/p8-abc.png)、[p8-def.png](../assets/style-studies/p8-def.png) | A-F画法探索板，选择已结束 | 仅历史参考，不打包 |
| [p8-b-selected-reference.png](../assets/style-studies/p8-b-selected-reference.png) | 用户选B的参考截图，含截图UI | 仅参考，不打包 |

当前P9母版SHA256：`f80e113674590e82f2ddade75813291c8594ced39e9d606fad6ad0f3be56429d`；运行场景SHA256：`8ba35051b5bfc41ce67b473881c678b3061488e9fa46c4e44166ac276741e488`；纸纹WebP SHA256：`93a7c8708e5678b2a57bb29b24d8658700b349e680d6f93b5f437c4d491bef86`。当前头像、场景、纸纹三项运行WebP合计391512B；334994B为P9/P10、249348B为P8、151012B为P7历史值。

## 文档：按用途查找

### 当前状态与执行计划

- [HANDOFF](HANDOFF.md)：当前事实、授权、环境、下一步与本次梳理记录。
- [总计划](IMPLEMENTATION-PLAN.md)：P0–P11阶段范围、验收与回退；P11已交付preview.5，P9为沿用图片/首页基线。
- [P11整页纸面计划](superpowers/plans/2026-10-20-reference-paper.md)：当前已执行计划，后续安装/上传见部署记录。
- [P10同纸底柔边融合计划](superpowers/plans/2026-10-20-paper-blend.md)：历史已执行计划；视觉判断已撤回。
- [P9宽屏共同构图计划](superpowers/plans/2026-10-20-wide-window-composition.md)：历史preview.3实现计划；图片和首页构图继续沿用。
- [P8抱书氛围详细计划](superpowers/plans/2026-10-20-reading-atmosphere.md)：preview.2历史计划，Task 1–5及Task 6归档验收已完成。
- [WORKBOARD](coordination/WORKBOARD.md)：分工和任务状态。
- [DSH-COLLABORATION](coordination/DSH-COLLABORATION.md)：调用方式、权限边界、历史贡献和日志位置。
- [INSTALL](INSTALL.md)、[RELEASE](RELEASE.md)：当前preview.5安装与发行文档；历史P6命令已实测修订，最新交付证据见P11及P11-DEPLOYMENT。

### 历史设计与调研（保留追溯）

| 阶段 | 文档与用途 |
| --- | --- |
| P0 | [调研报告](P0-REPORT.md)、[上游接口/许可](research/DSH-P0-upstream.md)、[原图来源](research/P0-character-source.md) |
| P1 | [视觉规范](design/P1-VISUAL-SPEC.md)、[配色核算](design/P1-COLOR-CHECK.md)、[素材审核](design/P1-REVIEW.md)；其中旧配色和小头像范围不覆盖用户最新决定 |
| P7 | [冷白雾蓝/Q版背景设计](design/P7-WINTER-SCENE.md)；对应历史P7运行基线，不是最终P8方向 |
| P8历史探索 | [月色花房](design/P8-MOONLIT-ATELIER.md)、[A-F候选](design/P8-STYLE-CANDIDATES.md)；均已由B抱书方案取代，不再执行选择流程 |

最近完成：[P11-A](coordination/P11-A-task.md)，DSH限定CSS/Map/files与[首稿说明](validation/P11-DSH-NOTES.md)已交付，Codex最终实窗修正与交付见P11及P11-DEPLOYMENT。

历史派发任务书：[P0-A](coordination/P0-A-task.md)、[P1-A](coordination/P1-A-task.md)、[P2-A](coordination/P2-A-task.md)、[P3-A](coordination/P3-A-task.md)、[P3-B](coordination/P3-B-task.md)、[P7-A](coordination/P7-A-task.md)、[P8-A](coordination/P8-A-task.md)、[P9-A](coordination/P9-A-task.md)、[P9-B](coordination/P9-B-task.md)、[P10-A](coordination/P10-A-task.md)。这些记录已完成的限定分工。

### 验证与截图

| 阶段 | 证据入口 |
| --- | --- |
| P2 | [验证](validation/P2.md)、[DSH说明](validation/P2-DSH-NOTES.md) |
| P3 | [验证](validation/P3.md)、[DSH说明](validation/P3-DSH-NOTES.md) |
| P4 | [界面细节验证](validation/P4.md) |
| P5 | [真实聊天与运行矩阵](validation/P5-MATRIX.md) |
| P7 | [历史运行基线验证](validation/P7.md)、[DSH说明](validation/P7-DSH-NOTES.md) |
| 历史首次上传/本机安装 | [preview.2公开仓库上传与desktop安装记录](validation/DEPLOYMENT.md)；最新见下方P11部署 |
| P6交付 | [最终归档安装/卸载/重启验证](validation/P6.md) |
| P8 | [preview.2抱书氛围验证](validation/P8.md)、[DSH首稿说明](validation/P8-DSH-NOTES.md)；以Codex最终实测为准 |
| P9 | [历史preview.3验证与安装](validation/P9.md)、[DSH首稿说明](validation/P9-DSH-NOTES.md)、[聊天修订说明](validation/P9-B-DSH-NOTES.md) |
| P10 | [历史preview.4验证与安装](validation/P10.md)、[DSH首稿说明](validation/P10-DSH-NOTES.md) |
| P11 | [真实预览与差异](validation/P11.md)、[DSH首稿说明](validation/P11-DSH-NOTES.md)、[preview.5安装与上传](validation/P11-DEPLOYMENT.md) |

`docs/validation/screenshots/`当前Git跟踪39张截图（含P11四张），其中P9为6张、P10为5张JPEG（前后宽/小及归档聊天），文件前缀标明阶段。结合对应报告看测试条件与限制。旧报告里的“尚未开始”只说明当时状态，历史通过也不能代替新改动验证。

## 本地缓存、归档与维护规则

`docs/research/`是入库证据，`.research/`是被忽略的本地工作目录，两者不要混用。

| 内容 | 处理原则 |
| --- | --- |
| `.research/`参考仓缓存 | 本地调研辅助，不作为本插件源码或发布内容 |
| `.research/`隔离home、临时patch、配置、日志、连接辅助文件 | 可能含认证或会话信息；不提交、不打包，不复用旧认证链接 |
| `.research/`查重、打包和预览结果 | 仅证明记录对应版本；后续变更须重验 |
| [preview.5当前归档](../release/dsh-theme-dongxuelian-0.1.0-preview.5.tgz) | 409223B、解包431148B、15文件；[清单](../release/preview.5-manifest.json)、[SHA256](../release/SHA256SUMS.txt)入Git，tgz被忽略，仅在本地保留 |
| `release/dsh-theme-dongxuelian-0.1.0-preview.4.tgz` | 历史本地归档，351902B；[清单](../release/preview.4-manifest.json)与[SHA256](../release/SHA256SUMS.txt)入Git，tgz被忽略 |
| `release/dsh-theme-dongxuelian-0.1.0-preview.3.tgz` | P9历史归档，351231B；[逐文件清单](../release/preview.3-manifest.json)与[SHA256](../release/SHA256SUMS.txt)入Git，tgz被忽略 |
| `release/dsh-theme-dongxuelian-0.1.0-preview.2.tgz` | P8历史归档，264794B；保留[清单](../release/preview.2-manifest.json)与SHA追溯 |
| `release/dsh-theme-dongxuelian-0.1.0-preview.1.tgz` | 旧Q版包，62271B，仅本地历史，不作为当前交付 |

本次没有删除、移动素材或清理缓存。后续清理`.research/`前，先确认隔离进程与日志保留需求。

发布范围由`package.json.files`和npm实际归档共同确定；当前包括头像/抱书/纸纹三项WebP及最终INSTALL/RELEASE，不含PNG母版、候选板、测试和开发记录。P11已按实际tar和安装副本逐文件复核；校验清单不放进tgz。

维护时优先更新现有入口：状态写HANDOFF、步骤写计划、分工写看板、证据写validation、文件职责写本页；避免再建内容重复的总览。新增或移动文件后核对相对链接和发布白名单。

GitHub源码仓库包含manifest与校验清单，未包含被忽略的tgz，也未创建Release/npm发行；源码已推送不能理解成安装包可从Release下载。最新交付证据见[部署记录](validation/P11-DEPLOYMENT.md)。
