# 冬雪莲涂鸦主题协作看板

> 2026-10-20用户复核更正：P10功能/安装证据保留，但未达到用户示例视觉，撤回“视觉已达标”的判断。当前按[P11设计](../superpowers/specs/2026-10-20-reference-paper-design.md)接续：复用P9母版，补独立纸纹，修正遮挡与构图；用户随后明确要求安装并推送GitHub；已形成preview.5并安装desktop，上传证据以P11-DEPLOYMENT为准。

当前阶段：**P11 preview.5已归档并安装desktop，用户已授权本次GitHub上传。** P10功能/安装证据保留，但视觉判断撤回。P11复用P9人物、增加独立纸纹，DSH限定实现，Codex实窗/修正；18/18/check/查重与限定复核通过，仅证明相应检查。隔离与desktop均匹配15文件，原五插件及主配置保持；上传状态见[P11部署](../validation/P11-DEPLOYMENT.md)。

入口：[接续记录](../HANDOFF.md) → [P11计划](../superpowers/plans/2026-10-20-reference-paper.md) → [总计划](../IMPLEMENTATION-PLAN.md)，文件用途见[导航](../PROJECT-MAP.md)。

| 任务 | 执行者 | 审核者 | 范围 | 状态 |
| --- | --- | --- | --- | --- |
| P0-A | DSH | Codex | 本机主题接口、三仓源码/许可/兼容、技术路线草案 | 已交付，审核修订已完成 |
| P0-B | Codex | Codex | 原课表素材定位与出处证据，不设计新角色 | 已完成，原图参考已确认 |
| P0-C | Codex | 用户确认 | 复核 P0-A 关键证据、汇总 P0 报告、建立可回退记录 | 已交付且获准继续 |
| P1-A | DSH | Codex | 角色、风格、配色与素材规格草案 | 已交付，Codex 已修订颜色和实际尺寸边界 |
| P1-B | Codex / imagegen | Codex | 两项新绘透明素材与一致性审核 | 候选已形成，原生尺寸初审与 alpha 检查已做；发布级检查留至 P3 |
| P1-C | Codex | 用户可审阅 | 量化配色、审核记录、阶段提交 | 已完成规范、核算和候选记录；本地链接与文件范围检查通过 |
| P2-A | DSH | Codex | 最小包、浅色令牌、深色释放与卸载 | 已交付，审核修正并入当前代码 |
| P2-B | Codex | 独立审查 | 生命周期/真实 loader/隔离运行/查重 | 7/7 + 真实窗口启停/明暗往返 + 查重通过，见 P2.md |
| P3-A/B | DSH | Codex / 独立 reviewer | 白名单路由、轻量头像与生命周期 | 17/17、实际 Web 两处头像/明暗/启停、0 clones；见 P3.md |
| P4 | Codex | 实际窗口 | 官方发送按钮info pair、hover/focus/disabled核对 | 已完成，26token、17/17、真实窗口，见P4.md |
| P5 | Codex / DSH运行时 | Codex | 真实聊天/read、尺寸/缩放模拟、社区共存 | 候选回归完成；桌面与better-sidebar激活未确认，见P5矩阵 |
| P6 | Codex | 隔离归档安装 | 打包、安装/卸载/重启、说明 | 已完成：最终13文件包、SHA、新home离线安装/启停/卸载/重启；见P6.md |
| P7 | DSH限定实现 / Codex | 独立reviewer / 实际窗口 | 冷白雾蓝、主次人物背景、去header重复头像 | 17/17、check、真实loader、九组CSS模拟、明暗启停通过，见P7.md |
| P8素材 | Codex / imagegen | 用户选择 | A-F→选B→四幅→选抱书横幅 | 已选定reading.png，与最新上传图像素一致 |
| P8接入 | Codex审核/测试、DSH限定实现 | 实际窗口/独立审核 | 纸白灰蓝氛围、完整主图、阅读面、资源/生命周期 | 已完成：18/18、真实Web/loader、0 clones、独立审核；见P8.md |
| 上传/本机安装 | Codex | Git远端/文件哈希 | 用户明确授权公开仓库及desktop安装 | 公开分支/标签已上传，desktop13文件安装一致；原生热加载未目视，见DEPLOYMENT.md |
| 交接维护 | Codex | 新会话 | 完整计划、状态、命令、日志与授权 | 已建立 HANDOFF 与根 AGENTS 入口 |
| P9大窗口/聊天 | DSH限定read/write、Codex图像/实窗修正 | 独立只读审核 | 新图、1920px共同构图、阅读面、preview.3归档及desktop更新 | 已完成，正常使用检查通过；见[P9](../validation/P9.md)，不声称已目视日常窗口重载 |
| P10 A柔边融合 | DSH限定CSS、Codex实窗/命令/交付 | Codex差异与实际窗口 | 实底阅读、独立背景柔边、轻纸卡阴影 | 已完成preview.4，headless退出0、18/18/check、隔离归档聊天与desktop13文件一致；[证据](../validation/P10.md) |
| P11 按示例整页纸面 | DSH限定CSS/Map/files，Codex素材/实窗/修正 | 限定只读复核与真实窗口 | 复用母版、纸纹、阅读/输入构图 | preview.5已按新增授权安装desktop，15文件一致；视觉差异保留，见[P11](../validation/P11.md)与[部署](../validation/P11-DEPLOYMENT.md) |
| preview.5文件信息梳理 | Codex | 文件/Git核对 | 导航、交接、总计划与看板 | 校正P11入口、三项运行资源、归档边界与P6复选框；验证范围见[交接](../HANDOFF.md)，未重跑功能/窗口验收 |

协作约定：DSH 处理限定文件内的调研与后续获准实施；Codex 负责拆分任务、验收标准、关键证据抽查、差异审核与阶段关口。避免双方重复完整研究；只在关键结论缺证或冲突时复查。

## 调用记录

- 2026-10-19：已确认 DSH `0.2.1-rc.2` 提供 `headless --json -`，任务正文从标准输入传入。
- 首次调用在模型请求前因默认 `deepseek-official` 缺少凭据失败，未产出调研结论。
- 桌面 profile 已配置自定义模型通道。仅将默认模型选择、provider 的非敏感配置和凭据服务启用项写入被 Git 忽略的 `.research/dsh-worker.patch.yml`，通过 `--patch` 临时启动。密钥由 DSH 自身凭据服务解析，未读取、复制或输出密钥；没有修改现有 profile。
- 本轮事件记录：`.research/dsh-p0-a-desktop-route.events.jsonl`；错误流：`.research/dsh-p0-a-desktop-route.stderr.log`。日志不提交 Git。
- P0-A 已结束，进程退出码 0，产生 final 事件。DSH shell 受 provisioning 限制，读写工具可用；Codex 负责命令验证，不修复 ACL、不重复派发同一排障任务。
- 审核已修正独立图片、桌面 WebServer、头像插槽与阶段范围方面的建议；详见 `docs/P0-REPORT.md`。
- 本仓库没有 Git 作者配置，提交命令临时使用 `Codex <codex@local.invalid>` 标注代理制作的本地记录，未修改全局 Git 配置。
- P1-A 使用同一临时模型通道，独立短任务仅调用 read/write，4 次工具调用后交付；退出码 0。未重复调查 P0 源码或尝试修复 shell。
- P1-A 事件与错误流位于 `.research/dsh-p1-a.events.jsonl`、`.research/dsh-p1-a.stderr.log`，不提交 Git。
