# 冬雪莲涂鸦主题协作看板

当前阶段：**P8抱书氛围规划交接完成，用户要求在新会话实施。** 已选B彩铅绘本及唯一主视觉assets/scenes/b-series/reading.png，其他三图备选。当前运行仍为旧P7，抱书图未接入。P6等P8完成后继续，旧Q版包不交付。

新会话读 [接续记录](../HANDOFF.md) → [P8详细计划](../superpowers/plans/2026-10-20-reading-atmosphere.md) → [总计划](../IMPLEMENTATION-PLAN.md)。本轮仅写计划/交接，未导出/改运行代码/派发DSH/启动新预览/打包；已停止确认属于本项目的旧theme-test隔离预览。

2026-10-20最新请求“梳理文件”：补全[文件导航](../PROJECT-MAP.md)及交接中的整理记录，保留原路径、历史素材和P6草稿；P8仍待继续指令。旧隔离预览的停止记录来自此前规划会话，本次未操作进程。

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
| P6 | Codex | 隔离归档安装 | 打包、安装/卸载/重启、说明 | 等P8成立后接续，草稿保留，旧包不交付 |
| P7 | DSH限定实现 / Codex | 独立reviewer / 实际窗口 | 冷白雾蓝、主次人物背景、去header重复头像 | 17/17、check、真实loader、九组CSS模拟、明暗启停通过，见P7.md |
| P8素材 | Codex / imagegen | 用户选择 | A-F→选B→四幅→选抱书横幅 | 已选定reading.png，与最新上传图像素一致 |
| P8接入 | Codex审核/测试、DSH限定实现 | 实际窗口/独立审核 | 纸白灰蓝氛围、完整主图、阅读面、资源/生命周期 | 详细计划已写，按用户要求留新会话从Task 1开始 |
| 交接维护 | Codex | 新会话 | 完整计划、状态、命令、日志与授权 | 已建立 HANDOFF 与根 AGENTS 入口 |

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
