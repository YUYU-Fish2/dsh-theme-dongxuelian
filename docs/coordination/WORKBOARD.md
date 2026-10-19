# 冬雪莲涂鸦主题协作看板

当前阶段：用户再次否定P7放大Q版头像方案，要求完整人物/场景图片与融洽氛围；P6暂停，先做P8。P7技术验证保留历史，不能当审美需求已满足。见 [接续记录](../HANDOFF.md)、[总计划](../IMPLEMENTATION-PLAN.md)与 [DSH 协作方法](DSH-COLLABORATION.md)。

最新进展：用户要求“人物减少AI味、多尝试风格，让我挑”。A-F六种人物画法已生成展示，见 [P8候选](../design/P8-STYLE-CANDIDATES.md)。等待风格选择，再做主/辅完整场景和实际接入；不继续P6打包。

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
| P6 | Codex | 隔离归档安装 | 打包、安装/卸载/重启、说明 | 正在进行，交付preview |
| P7 | DSH限定实现 / Codex | 独立reviewer / 实际窗口 | 冷白雾蓝、主次人物背景、去header重复头像 | 17/17、check、真实loader、九组CSS模拟、明暗启停通过，见P7.md |
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
