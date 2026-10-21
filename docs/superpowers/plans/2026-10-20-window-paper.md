# P12 窗口模式连续纸面实施计划

按writing-plans/executing-plans实施。用户已明确指定复用改进后的全屏效果，按既有授权执行局部可逆修正。

**Goal:** 修复窗口模式重新出现的竖直纸板边界。

**Architecture:** 复用根背景和现有场景，scroll全列透明；正文/输入座独立布局。窗口列沿用全屏构图，极窄列减弱插画干扰。

**Tech Stack:** 现有JS中的CSS、官方DSH CLI、Node测试、真实隔离Chrome。

- [x] Codex在隔离theme-test复现1310窗口，记录scroll实底/gutter和截图；baseline 18项检查。
- [x] DSH按P12-A只调整client.js的SCENE_CSS及P12-DSH-NOTES，不改生命周期/字号/profile。
- [x] Codex检查差异并验证1310、1625、1024/800；确认scroll全列透明、无整页横溢、文字清楚；运行18项/check。
- [x] 字号链路已做初查；用户2026-10-21明确延期，不在本轮修复或修改字号。
- [x] 形成preview.6；包与安装文件哈希核对、配置备份；按既有安装授权更新desktop，不自动推送本轮新改动。
- [x] 更新HANDOFF/总计划/看板/验证，独立提交；恢复隔离源码路径并归档临时工作树。

实际修正与安装见docs/validation/P12.md；GitHub本轮未推送。用户停止界面控制后未继续操作窗口。
