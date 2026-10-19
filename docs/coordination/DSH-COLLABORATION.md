# Codex 与 DSH 协作开发及接续方法

2026-10-19。用户要求 Codex 做审核/任务派发员，与本机 DSH 分工节省额度；已授权自主分阶段继续。此前收尾至 P2，本轮已恢复协作并完成 P3，P4已由Codex完成局部配色/窗口核对，继续P5。

## 固定分工

| 角色 | 工作 | 边界 |
| --- | --- | --- |
| Codex | 拆任务、先写行为测试、派发、命令验证、图片生成/审核、修正、Git/接续记录 | 不重复完整调查，抽查关键证据；未实测不宣称通过 |
| 本机 DSH CLI | read/write 限定文件，调查小范围源码或实现功能，交付风险 | 不改测试/profile/核心/权限/Git，不用 shell/派生 agent，不越阶段，不声称运行未执行检查 |
| 独立 reviewer | 只读检查关键生命周期，给复现证据 | 不改文件，不代替窗口验收 |

## 实际交付与审核

| 任务单 | DSH 工作 | Codex 工作 |
| --- | --- | --- |
| [P0-A](P0-A-task.md) | 三仓与官方接口调查草稿 | 复核 SHA/版本/许可，修正图片内联、桌面 WebServer、头像插槽和越阶段建议 |
| [P1-A](P1-A-task.md) | 视觉规范草案，4 次 read/write 后交付 | 核对原图、生成两项候选、修正颜色/尺寸、记录 alpha，P1 提交 `4ebb417` |
| [P2-A](P2-A-task.md) | client.js、index.js、package.json、patch、P2-DSH-NOTES | 测试 RED→实现 GREEN；审核后补三项回归并修复；7/7、真实 loader、隔离窗口明暗/启停通过 |
| [P3-A](P3-A-task.md) | index.js 白名单资源路由、P3-DSH-NOTES | 先写5项RED，实际HTTP5/5；真实Host GET/HEAD/404/405/停用检查 |
| [P3-B](P3-B-task.md) | client.js Slot事务、package.json 注入与资源白名单 | 先写5项RED，全部17/17；素材导出、真实loader、两处头像窗口验证与独立只读审核 |

P3 初次 CLI 在沙箱内写 headless 启动配置遇到 EPERM；正常审批调用后在模型请求前遇到 TRANSPORT 连接错误（用量0、无文件改动）。用户告知通道恢复后，新日志 `dsh-p3-a-resumed.events.jsonl` 的调用成功、退出0，之后 `dsh-p3-b.events.jsonl` 成功；错误流均对应同名 `.stderr.log`。未重试 DSH shell、未修 ACL、未改模型/凭据。Codex 的本地 HTTP 测试也需正常审批以允许回环连接。最终证据见 [P3 验证](../validation/P3.md)，DSH 说明保留各次交付时未验证项。

P2 当前代码包含 Codex 审核修正；[DSH 首稿说明](../validation/P2-DSH-NOTES.md)保留历史，最终事实见 [P2 验证](../validation/P2.md)。独立审核发现 disposer 返回期间的同步切色/停用残留；真实窗口又发现宿主旧快照重涂，均先复现再修复。

## 实际可用调用

CLI `E:\dsh\resources\runtime\cli\bin\dsh.cmd`，版本 `0.2.1-rc.2`。在项目根目录运行，每个任务用独立短上下文与新日志名：

```powershell
Get-Content -LiteralPath 'docs\coordination\P2-A-task.md' -Raw |
  & 'E:\dsh\resources\runtime\cli\bin\dsh.cmd' headless --patch '.research\dsh-worker.patch.yml' --json - `
    1> '.research\dsh-p2-a.events.jsonl' 2> '.research\dsh-p2-a.stderr.log'
```

下次先创建 P3 任务单与 p3 日志，不覆盖历史。进程退出码 0/final 事件只是交付信号；Codex 必须读实际文件、跑测试和审查，不直接相信 final 自述。

临时覆盖 `.research/dsh-worker.patch.yml` 沿用 desktop 已配置默认模型与 provider 非敏感字段，临时启用凭据服务。**密钥由 DSH 自身服务解析，未读取/提取/复制密钥**。不提交覆盖/日志/认证 URL。新机器缺此文件时确认正常 DSH 通道，不复制 `.credentials.yaml`、猜密钥或改用户模型。

## 故障与已经确定的处理

- 默认 headless 的 `deepseek-official` 无凭据，首次调用在模型请求前失败；已改临时覆盖复用桌面通道，不再重复无凭据请求。
- DSH shell 报 `SetNamedSecurityInfoW failed (Win32 5): grantWrite(...)`。P0 申请 ACL 修复被审批拒绝，未执行；后续固定 **DSH 只 read/write、Codex 执行 shell**。不要再修 ACL 或重试相同排障。
- P1/P2 没改用户 profile；Codex 只在 `.research/test-home` 测试。临时 Host helper 必须有独立 package.json，否则会被宿主识别为本主题的第二来源。

## 新任务单模板要求

1. 明确唯一阶段目标、允许修改的具体文件、禁止项。
2. 提供已确认事实和少量必读文件，不重做 P0，不遍历全盘或重复外搜。
3. 给验收/失败路径，行为测试由 Codex 先跑 RED，再交 DSH 实现；不允许 DSH 改测试来适配实现。
4. 明确不用 shell、不修 ACL、不改 profile/核心、不安装、不提交、不派生 agent。
5. final 只列文件、取舍与未验证项；Codex 跑命令、审核差异、修复重要项并写项目记录。

P3 拆为资源 Host 白名单路由与 Slot 两步，先检查小尺寸/裁切，再写路由回归；完整阶段范围见 [总计划](../IMPLEMENTATION-PLAN.md)，当前事实见 [HANDOFF](../HANDOFF.md)。

## 本地原始记录（被 Git 忽略）

- `.research/dsh-p0-a.events.jsonl`：首次无凭据失败。
- `.research/dsh-p0-a-desktop-route.events.jsonl`、`dsh-p1-a.events.jsonl`、`dsh-p2-a.events.jsonl`：各阶段成功调用，错误流使用对应 `.stderr.log`。
- `.research/jscpd-p2-final/jscpd-report.json`：当前项目最终扫描原始报告。
- `.research/test-home`、`p2-web*.log`、`test-host-url.txt`：测试与调试缓存，含临时认证信息，不发布。

任务单、审核结论、验证和提交均入项目；大型原始事件流仅本地留存，不作为下个会话必读全文。
