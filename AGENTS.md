# 项目协作与新会话入口

新会话先读 `docs/HANDOFF.md`，再读当前P8详细计划 `docs/superpowers/plans/2026-10-20-reading-atmosphere.md`、`docs/IMPLEMENTATION-PLAN.md` 和 `docs/coordination/WORKBOARD.md`。当前状态只以这些文件、Git 与实际验证结果为准，不把历史阶段报告中的“尚未开始”误当成当前状态。

与DSH的派发、实际分工、命令、故障与日志见 `docs/coordination/DSH-COLLABORATION.md`。用户已选B彩铅绘本抱书图reading.png并要求“继续干”；P8实现和隔离Web预览验收已完成，P6新归档在隔离home的安装/启停/卸载/重启也已通过，本地preview.2交付完成。不重做风格选择、不交旧Q版包；证据见docs/validation/P8.md与P6.md。

## 用户已授权的工作方式

- 用户要求 Codex 做审核与派发，与本机 DSH 联合开发，以减少重复分析；DSH 接限定读写任务，Codex 执行命令、测试与审核。
- 用户已确认 P0 技术路线和原课表图参考，允许按原图角色特征与手绘画风生成新图，不必复用同一图片。
- 2026-10-19 用户要求“你自己继续做，记录记得写入项目，计划要全，方便新开会话”。允许按 P2→P6 自主连续推进，各阶段独立验证、记录、提交，不再因常规可逆步骤反复询问。
- 用户后续要求完整人物/场景氛围并选定 `assets/scenes/b-series/reading.png`，修订此前仅小头像的视觉范围；允许在会话内容下绘制选定场景，不把它扩展成覆盖全部功能页的前景壁纸。保持轻量、官方接口、不改核心/profile/其他插件、不新增复杂设置/动画。关键需求冲突或难以撤销的操作才提问。
- 此前要求先规划交接，随后已明确“继续干”；允许接续P8和P6，按实际阶段验证/记录/提交，不因常规可逆步骤反复询问。

- 2026-10-20用户随后明确要求上传GitHub并选择公开仓库YUYU-Fish2/dsh-theme-dongxuelian，同时要求装到本机DSH；已授权推送分支/预览标签和通过官方CLI安装desktop。仅限本次操作，保留配置备份、模型和其他插件，不扩展到Release/npm或强制退出用户DSH。证据见docs/validation/DEPLOYMENT.md。

## 避免重复造轮子

- 新增功能或公共逻辑前先检索当前项目；适合用现成库的功能用 GitHub MCP 搜索成熟方案，结合维护、许可证、依赖和适配成本选择。简单文案、样式或局部修正不必外搜。
- 公共逻辑新增、多模块重构或代码质量审查时执行 jscpd。MCP 索引目录须先确认；本机多个 `jscpd --mcp` 进程未显式给路径，无法确认索引，默认采用 CLI 扫本项目明确绝对路径，不能把其他目录结果当成本项目结果。
- CLI：`C:\Users\sjtxd\Documents\Codex\tools\jscpd\node_modules\jscpd-windows-x64-msvc\bin\jscpd.exe`。排除 `.research`、`.git`、`node_modules`、生成产物，使用本地 token 检测，不启用外部 embeddings。
- 按重复报告核对行为后决定重构；允许必要测试夹具结构相似，不为行数提取无收益的抽象。

## 执行规则

- 先明确目标、范围和验收。尽量小改，沿用既有接口，不顺手重写、不覆盖用户改动、不添加假想扩展。
- 先复现或写能捕获行为的测试，再实现生命周期/路由等逻辑。颜色映射和低影响文案不必逐项写镜像测试。
- 证据优先：运行适用检查、读取退出码、检查差异，再声明完成；区分模拟测试、真实宿主模块加载、实际窗口测试和未验证项。
- 每阶段维护 `docs/HANDOFF.md`、总计划、看板和 `docs/validation/` 记录，并建立独立 Git 提交。不要只把重要状态写在聊天里。
- 当前实现分支 `feat/theme-v1`；保留 `main` 的 P0/P1 记录，不执行 reset/clean，不自动推送或发布。
- `.research/` 是忽略的缓存、日志、隔离 home 与临时 DSH 启动覆盖；不把凭据、用户聊天、原始大图或此目录打包发布。
- DSH 的 shell 曾在 provisioning 阶段报 Win32 5；不要再次修 ACL 或绕过审批。DSH 使用 read/write 完成限定任务，Codex 使用正常 shell 跑检查。
- DSH 调用沿用已有模型配置，凭据由 DSH 自身服务解析；不得读取、复制、打印密钥。不要改变用户现有模型、插件和 profile。

## 技术方向

目标宿主为本机 DSH `0.2.1-rc.2`。P2 使用零第三方运行依赖的手写官方 client module factory 和 Theme API；浅色覆盖、深色释放、停用清理，不写用户主题偏好。P3 独立图片资源通过官方 Host 白名单路由与合适 Slot 接入。具体文件、命令、测试与限制见总计划。
