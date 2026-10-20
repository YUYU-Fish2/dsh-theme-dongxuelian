# 项目文件导航

2026-10-20核对。当前分支`feat/theme-v1`，P9新场景与宽屏/聊天共同构图已交付，preview.3已按授权更新本机desktop。本文说明文件职责与保留范围；进度以[HANDOFF](HANDOFF.md)、计划、看板和Git为准，P8/P6保留历史。

## 阅读入口

| 目的 | 入口 |
| --- | --- |
| 新会话接续 | [HANDOFF](HANDOFF.md) → [P9计划](superpowers/plans/2026-10-20-wide-window-composition.md) → [总计划](IMPLEMENTATION-PLAN.md) → [看板](coordination/WORKBOARD.md)，遵守根[AGENTS](../AGENTS.md) |
| 找当前图片 | [P9新母版](../assets/scenes/p9/reading.png)及[来源说明](../assets/scenes/p9/README.md)；[原B系列](../assets/scenes/b-series/README.md)保留历史 |
| 查当前运行效果证据 | [P9验证](validation/P9.md)；真实聊天历史见[P5矩阵](validation/P5-MATRIX.md) |
| 给DSH派发任务 | [协作方法](coordination/DSH-COLLABORATION.md)；现有任务书均为历史记录 |
| 查安装和发行说明 | [README](../README.md)、[INSTALL](INSTALL.md)、[RELEASE](RELEASE.md)为preview.3；归档/日常安装实测见[P9](validation/P9.md)及[部署](validation/DEPLOYMENT.md) |

**交付状态：**P9最终4例正常窗口、明暗/启停、18项回归及独立审核通过，全新隔离归档加载和desktop13文件一致，见[P9](validation/P9.md)与[清单](../release/preview.3-manifest.json)。原5插件/主配置保留；日常DSH未强制重启，本次未推送。preview.2历史见P8/P6。

## 目录分工

```text
项目根目录/
  client.js                            唯一客户端入口
  index.js、cordis.patch.yml            配套Host入口与注册配置
  package.json                         包契约、脚本与发布白名单
  README.md                            当前preview.3使用说明
  AGENTS.md、LICENSE、THIRD_PARTY_NOTICES.md
  assets/
    characters/                        Q版母版、保留的头像WebP及历史背景
    scenes/p9/                         按批准示意重新生成的当前母版；web/为运行导出
    scenes/b-series/                   原P8抱书与三幅备选PNG母版，保留历史
    style-studies/                     A-F候选板与用户选B参考
  docs/
    HANDOFF.md                         当前状态、授权与下一步
    PROJECT-MAP.md                     本文件：导航与分类
    IMPLEMENTATION-PLAN.md             P0–P9总计划、验收与回退
    INSTALL.md、RELEASE.md              当前preview.3安装与发行说明
    P0-REPORT.md                        历史调研汇总
    superpowers/plans/                 当前P9执行计划与P8历史
    coordination/                      看板、DSH协作方法、历史任务书
    design/                            视觉规范与历史探索
    research/                          随Git保存的调研证据
    validation/                        阶段验证、DSH说明与截图
  test/                                Node回归测试及共享夹具
  scripts/                             语法/包契约与真实loader检查
  release/                             当前preview.3 tgz/校验/manifest；旧包留历史
  .research/                           忽略的缓存、隔离home、配置与日志
```

保持现有路径，避免破坏文档引用、测试与发布白名单。不另建与根`client.js`等价的`src/`或`lib/`副本。

## 运行文件与检查工具

| 文件 | 职责 |
| --- | --- |
| [client.js](../client.js) | 唯一客户端源；官方factory、26项浅色token、明暗/停用事务；品牌头像和SceneStyle槽；当前绘制抱书彩铅场景 |
| [index.js](../index.js) | Host入口；官方生命周期内注册avatar和reading两项固定WebP白名单路由 |
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

## 素材：当前运行、已选待接入、历史参考

| 文件 | 状态与用途 | 发布边界 |
| --- | --- | --- |
| [characters/README](../assets/characters/README.md) | 早期角色来源与导出说明 | 当前白名单包含 |
| [avatar.png](../assets/characters/avatar.png)、[sidebar-character.png](../assets/characters/sidebar-character.png) | Q版PNG母版，保留来源 | 不打包 |
| [avatar.webp](../assets/characters/web/avatar.webp) | 当前192px头像，26864B；P8沿用 | 当前运行资源 |
| [sidebar-character.webp](../assets/characters/web/sidebar-character.webp) | 历史512px Q版背景，124148B | 已撤出路由和包，保留源码 |
| [b-series/README](../assets/scenes/b-series/README.md)、[reading.png](../assets/scenes/b-series/reading.png) | 用户选定的B彩铅抱书主视觉；1536×1024、2857637B | 母版不打包；已有对应WebP运行导出 |
| [web/reading.webp](../assets/scenes/web/reading.webp)、[场景说明](../assets/scenes/README.md) | 1280×853、222484B，等比缩放与quality90编码 | 当前唯一场景运行资源 |
| [tea.png](../assets/scenes/b-series/tea.png)、[garden.png](../assets/scenes/b-series/garden.png)、[letter.png](../assets/scenes/b-series/letter.png) | 同系列备选 | 不默认接入或打包 |
| [p8-abc.png](../assets/style-studies/p8-abc.png)、[p8-def.png](../assets/style-studies/p8-def.png) | A-F画法探索板，选择已结束 | 仅历史参考，不打包 |
| [p8-b-selected-reference.png](../assets/style-studies/p8-b-selected-reference.png) | 用户选B的参考截图，含截图UI | 仅参考，不打包 |

选定母版SHA256：`387d5998225c850660ffeda5347c1105d61b589109d6608ad33d121621ef1691`。当前两项运行WebP合计249348B；151012B是P7历史值，不能当作当前产物大小。

## 文档：按用途查找

### 当前状态与执行计划

- [HANDOFF](HANDOFF.md)：当前事实、授权、环境、下一步与本次梳理记录。
- [总计划](IMPLEMENTATION-PLAN.md)：历史阶段与P8→P6的验收记录和范围。
- [P8抱书氛围详细计划](superpowers/plans/2026-10-20-reading-atmosphere.md)：唯一当前视觉实现计划，Task 1–5已执行，Task 6归档验收也已完成。
- [WORKBOARD](coordination/WORKBOARD.md)：分工和任务状态。
- [DSH-COLLABORATION](coordination/DSH-COLLABORATION.md)：调用方式、权限边界、历史贡献和日志位置。
- [INSTALL](INSTALL.md)、[RELEASE](RELEASE.md)：已完成的P6发行文档；运行边界及卸载命令已实测修订。

### 历史设计与调研（保留追溯）

| 阶段 | 文档与用途 |
| --- | --- |
| P0 | [调研报告](P0-REPORT.md)、[上游接口/许可](research/DSH-P0-upstream.md)、[原图来源](research/P0-character-source.md) |
| P1 | [视觉规范](design/P1-VISUAL-SPEC.md)、[配色核算](design/P1-COLOR-CHECK.md)、[素材审核](design/P1-REVIEW.md)；其中旧配色和小头像范围不覆盖用户最新决定 |
| P7 | [冷白雾蓝/Q版背景设计](design/P7-WINTER-SCENE.md)；对应历史P7运行基线，不是最终P8方向 |
| P8历史探索 | [月色花房](design/P8-MOONLIT-ATELIER.md)、[A-F候选](design/P8-STYLE-CANDIDATES.md)；均已由B抱书方案取代，不再执行选择流程 |

历史派发任务书：[P0-A](coordination/P0-A-task.md)、[P1-A](coordination/P1-A-task.md)、[P2-A](coordination/P2-A-task.md)、[P3-A](coordination/P3-A-task.md)、[P3-B](coordination/P3-B-task.md)、[P7-A](coordination/P7-A-task.md)。这些记录已完成的限定分工；本次[P8-A](coordination/P8-A-task.md)也已交付。

### 验证与截图

| 阶段 | 证据入口 |
| --- | --- |
| P2 | [验证](validation/P2.md)、[DSH说明](validation/P2-DSH-NOTES.md) |
| P3 | [验证](validation/P3.md)、[DSH说明](validation/P3-DSH-NOTES.md) |
| P4 | [界面细节验证](validation/P4.md) |
| P5 | [真实聊天与运行矩阵](validation/P5-MATRIX.md) |
| P7 | [历史运行基线验证](validation/P7.md)、[DSH说明](validation/P7-DSH-NOTES.md) |
| 上传/本机安装 | [公开仓库上传与desktop安装记录](validation/DEPLOYMENT.md) |
| P6交付 | [最终归档安装/卸载/重启验证](validation/P6.md) |
| P8 | [当前抱书氛围验证](validation/P8.md)、[DSH首稿说明](validation/P8-DSH-NOTES.md)；以Codex最终实测为准 |

`docs/validation/screenshots/`含历史17张及P8新增5张、P6新增2张截图，文件前缀标明阶段。结合对应报告看测试条件与限制。旧报告里的“尚未开始”只说明当时状态，历史通过也不能代替新改动验证。

## 本地缓存、归档与维护规则

`docs/research/`是入库证据，`.research/`是被忽略的本地工作目录，两者不要混用。

| 内容 | 处理原则 |
| --- | --- |
| `.research/`参考仓缓存 | 本地调研辅助，不作为本插件源码或发布内容 |
| `.research/`隔离home、临时patch、配置、日志、连接辅助文件 | 可能含认证或会话信息；不提交、不打包，不复用旧认证链接 |
| `.research/`查重、打包和预览结果 | 仅证明记录对应版本；后续变更须重验 |
| `release/dsh-theme-dongxuelian-0.1.0-preview.1.tgz` | 旧Q版包，保留本地追溯，不交付；最终preview.2及SHA另列release清单 |

本次没有删除、移动素材或清理缓存。后续清理`.research/`前，先确认隔离进程与日志保留需求。

发布范围由`package.json.files`和npm实际归档共同确定；当前包括头像/抱书两项WebP及最终INSTALL/RELEASE，不含场景PNG、候选板、测试和开发记录。P6已按实际tar和安装副本逐文件复核；校验清单不放进tgz。

维护时优先更新现有入口：状态写HANDOFF、步骤写计划、分工写看板、证据写validation、文件职责写本页；避免再建内容重复的总览。新增或移动文件后核对相对链接和发布白名单。
