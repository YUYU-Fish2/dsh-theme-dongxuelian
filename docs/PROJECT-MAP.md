# 项目文件导航

本页为文件职责索引；当前进度以HANDOFF/总计划/看板和Git为准。P0-P7为历史阶段，P8抱书氛围已规划、尚未实施。

## 从哪里开始

| 要做的事 | 阅读入口 |
| --- | --- |
| 了解项目与当前交付范围 | [README](../README.md) |
| 新会话继续开发 | [HANDOFF](HANDOFF.md) → [实施计划](IMPLEMENTATION-PLAN.md) → [协作看板](coordination/WORKBOARD.md)，同时遵守根 [AGENTS.md](../AGENTS.md) |
| 实施已选抱书图氛围 | [P8详细计划](superpowers/plans/2026-10-20-reading-atmosphere.md)，从Task 1开始 |
| 找最终选定母版 | [抱书reading.png](../assets/scenes/b-series/reading.png)、[四图说明](../assets/scenes/b-series/README.md)；其他图仅备选 |
| 找主题实现 | [client.js](../client.js)、[package.json](../package.json) |
| 找配色、角色设计与素材限制 | [视觉规范](design/P1-VISUAL-SPEC.md)、[配色核算](design/P1-COLOR-CHECK.md)、[素材审核](design/P1-REVIEW.md) |
| 判断哪些行为已验证 | [P2 验证记录](validation/P2.md)及其截图；未完成项见 HANDOFF |
| 给 DSH 派发限定任务 | [协作方法](coordination/DSH-COLLABORATION.md)与 `coordination/P*-A-task.md` 历史任务书 |

目标宿主DSH `0.2.1-rc.2`；P2-P7技术基线已完成，运行代码仍为P7。package工作树为preview.2草稿，尚无满足最新P8需求的交付包。用户要求本轮仅规划、新会话实施，不能复用旧P7截图或旧tgz作为P8结果。

## 运行与开发文件

| 文件 | 职责与边界 |
| --- | --- |
| [package.json](../package.json) | 包元信息、Host/client 入口、DSH 声明、发布文件白名单、`test`/`check` 命令；当前没有第三方运行依赖 |
| [cordis.patch.yml](../cordis.patch.yml) | 注册唯一的 `dsh-theme-dongxuelian` Host entry |
| [index.js](../index.js) | Host 入口，官方服务生命周期内注册两项 WebP 固定白名单路由 |
| [client.js](../client.js) | 唯一客户端源：官方factory、26浅色token、明暗/停用事务；品牌头像与SceneStyle槽；目前画旧Q背景，P8尚未改 |
| [test/theme.test.mjs](../test/theme.test.mjs) | 七项主题生命周期回归测试（夹具与 Slot 测试共用 `test/helpers/client-host.mjs`），使用模拟上下文；不能代替真实窗口验收 |
| [test/assets.test.mjs](../test/assets.test.mjs) | 五项 Host 资源路由实际 HTTP 回归，需允许本地回环连接 |
| [test/slots.test.mjs](../test/slots.test.mjs) | 五项品牌/SceneStyle Slot、明暗释放、owner恢复与失败回滚回归 |
| [scripts/check.mjs](../scripts/check.mjs) | JS 语法、包契约、WebP 格式/体积与发布文件白名单检查 |
| [scripts/runtime-smoke.mjs](../scripts/runtime-smoke.mjs) | 本机官方 ModuleLoader 导入与 token 存在性检查；通过 DSH Electron Run-as-Node 执行，不能代替 UI 验证 |
| [.gitignore](../.gitignore) | 忽略 `.research/`、`node_modules/`、`release/*.tgz` |
| [AGENTS.md](../AGENTS.md) | 项目协作规则、授权范围与新会话阅读顺序 |
| [LICENSE](../LICENSE) | 项目代码许可证 |
| [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) | 真实 loader 检查脚本所参考代码的归属与许可；角色来源另见素材说明 |

代码直接交付 JS，不需要编译；不要另建与根 `client.js` 等价的 `src/`、`lib/` 副本。

## 素材与文档目录

```text
assets/characters/
  README.md                   素材来源、生成过程与使用边界
  avatar.png                  简化头像母版候选
  web/avatar.webp             192px透明无损WebP，实际头像
  web/sidebar-character.webp  P7为512px透明WebP，计划P8撤出运行包但保留源码
  sidebar-character.png       侧栏角色母版候选
docs/
  PROJECT-MAP.md              本文件：文件职责与阅读入口
  HANDOFF.md                  当前状态、授权、命令与下一步
  IMPLEMENTATION-PLAN.md      P0–P6 范围、步骤、验收与回退
  superpowers/plans/
    2026-10-20-reading-atmosphere.md  当前P8抱书氛围详细计划，新会话从Task 1执行
  P0-REPORT.md                P0 调研结论及审核修订
  coordination/
    WORKBOARD.md             分工与任务状态
    DSH-COLLABORATION.md      DSH 调用方法、实际贡献与日志索引
    P0-A-task.md              P0 限定调研任务书
    P1-A-task.md              P1 限定视觉规格任务书
    P2-A-task.md              P2 限定实现任务书
    P3-A-task.md              P3 Host 白名单路由任务书
    P3-B-task.md              P3 小头像与事务生命周期任务书
  design/
    P1-VISUAL-SPEC.md         角色特征、画风、配色与界面约束
    P1-COLOR-CHECK.md         配色与对比度核算
    P1-REVIEW.md              素材尺寸、alpha、哈希与待验项
  research/
    DSH-P0-upstream.md        官方接口、参考仓库、兼容与许可证据
    P0-character-source.md    原课表图标来源与检索证据
  validation/
    P2.md                    P2 测试、真实 loader 与窗口验证证据
    P3.md                    P3 资源、Slot、测试与窗口证据
    P3-DSH-NOTES.md           DSH 的 P3 分步实现记录
    P2-DSH-NOTES.md           DSH 的 P2 实现说明，结合 P2.md 阅读
    screenshots/
      p2-light-1100.jpg       隔离 Web 浅色截图
      p2-dark-1100.jpg        隔离 Web 深色截图
      p2-disabled-1100.jpg    隔离 Web 停用截图
```

上面的characters目录是早期Q版资产。新assets/scenes/b-series/有四幅B彩铅绘本PNG，用户已选reading.png，尚无对应运行WebP。assets/style-studies/保存六种探索/用户选B的参考，不打包。P7旧WebP合计151012B；P3的50862B仅为当时192px导出记录，不能套用P8。来源见[角色说明](../assets/characters/README.md)与[场景说明](../assets/scenes/b-series/README.md)。

P0/P1 报告和历史任务书保留当时结论；其中的“尚未开始”不代表今天的进度。`docs/research/` 是随 Git 保存的调研证据，与下述本地 `.research/` 缓存不同。

## 本地缓存与打包边界

`.research/` 已被 Git 忽略。本次仅核对其顶层名称，不读取凭据或认证链接内容，也不清理目录。

| 本地内容 | 用途与处理原则 |
| --- | --- |
| `oil-dsh-theme/`、`ethan-dsh-theme/`、`naniwet-dsh-themes/` | 参考项目源码缓存；不要作为本插件源码或发布资源 |
| `dsh-*.events.jsonl`、`*.stderr.log`、`p2-web*.stdout.log` | 协作与运行日志，可能包含会话信息，保留本地排障 |
| `dsh-worker.patch.yml`、`test-host.patch.yml`、`p2-web*.config.yml` | 本地临时启动覆盖与配置；不公开分发，不覆盖用户 profile |
| `test-home/` | 官方模板创建的隔离测试 home，包含本次插件测试环境 |
| `host-diagnostics/`、`announce-test-host.mjs`、`test-host-*` | 隔离宿主诊断、状态与连接辅助文件；旧认证链接不能复用 |
| `jscpd-*/`、`p2-pack.json` | 历史查重和打包检查结果，不代表后续改动已验证 |

后续清理缓存前确认测试进程状态，并保留追溯日志。release/中旧preview.1 tgz不是新方案；P8完成后P6须重新归档及隔离验收。

现有 `package.json.files` 显式列出 `index.js`、`client.js`、`cordis.patch.yml`、`README.md`、`LICENSE`、两项 `web/*.webp` 与素材 README，npm 另按自身规则包含 `package.json` 等必要文件。本文是开发文档导航，开发文档链接依赖完整仓库；最终安装说明与归档内容仍须在 P6 完成核对。
