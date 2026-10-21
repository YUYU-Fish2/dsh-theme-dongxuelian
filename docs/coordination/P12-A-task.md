# P12-A 窗口模式连续纸面

状态：已交付，headless退出0；Codex修正与实测见docs/validation/P12.md。

唯一工作目录：C:/Users/sjtxd/.codex/worktrees/window-paper/dsh主题开发。

只用read/write/edit，允许改client.js的SCENE_CSS和新增docs/validation/P12-DSH-NOTES.md。禁止shell、Git、网络、子agent；不改测试、版本、素材、JS生命周期、Theme token、字号、宿主核心/profile/模型/权限，不读取凭据或用户聊天。不修改主工作区E:/codex/dsh主题开发。

读P12设计/计划与client.js。已定位：base active scroll的margin-right:gutter和不透明paper导致聊天列<1100px时直线切边；P11的>=1100透明/全列scroll只覆盖大列。用户要求窗口也和全屏相同，不是重选风格。

实现：
1. 所有active尺寸scroll透明、完整列宽（margin-inline:0），纸纹和唯一人物仍由root绘制，不能加第二场景或新桥。
2. 将P11 active左阅读座/输入座规则合理覆盖到>=900px聊天列（可重组现有@container避免复制整段）；hero>=1100规则和既有宽屏效果保持。正文640px官方拖动下限、宽度柄和输入菜单不能被破坏；窗口正文尽量>=640，输入适当宽于正文。
3. <900px列取消reserved gutter，正文/输入用实际列宽扣正常边距，scroll始终全列透明。仅对插画层适当柔化/弱化，防止画面墨迹影响正文；<640极窄文字优先。消息/文字不可opacity/mask/filter。不隐藏滚动/拖柄伪装修复。
4. 原图、主配色、>=1100几何保持；CSS局部修正，不加第三方依赖、不做新设置。

首稿说明实际改动和未测项；不能声称视觉验收。Codex负责真实窗口/测试/修正。
