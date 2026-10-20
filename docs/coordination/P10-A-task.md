# P10-A 同纸底柔边融合（已交付）

状态：2026-10-20用户明确要求开始实施。Codex确认隔离基线及伪元素未被占用后派发；DSH headless退出0，限定两文件已交付。首稿见docs/validation/P10-DSH-NOTES.md，最终实测见docs/validation/P10.md。事件与错误流保留主工作区.research/dsh-p10-a.*。

实际执行工作区：C:/Users/sjtxd/.codex/worktrees/paper-blend/dsh主题开发；派发时已替换为此路径。主工作区E:/codex/dsh主题开发仅保留通道patch与日志。

只使用read/write/edit。允许修改client.js内SCENE_CSS，并新增docs/validation/P10-DSH-NOTES.md；禁止改测试、图片、index.js、package版本、profile/模型/核心/权限，不使用shell、Git、网络或子agent，不读取凭据/用户聊天。Codex负责命令、浏览器、审核和后续交付。

先读client.js与docs/superpowers/plans/2026-10-20-paper-blend.md，严格按Task2的CSS首稿实现。用户已选A“同纸底＋柔边融合”，不做独立阅读卡/磨砂效果，不重绘图片或复制生成示意里的控件/排版。

重点：
- 新效果只在宽列active生效；保留P9几何与小列阅读规则，不缩窄正文、不加栏间空白。
- 正文保留实色#F7F3EB，额外::after承载背景过渡，z-index:-1、pointer-events:none。不对消息/滚动容器设mask、opacity或filter，不改消息DOM。
- 使用宿主像素列宽共享阅读区定位变量，避免继承cqi在内层重新求值；只在计划明确位置使用cqi。
- 图片/生命周期/Theme token/官方Host接口不改。输入框仅非focus-within轻阴影，保留功能边界和键盘焦点。
- 计划参数是待实窗值；若::after已被其他样式占用，不直接覆盖，写明风险交Codex调整。不要扩大到JS监听、依赖、设置或动画。

完成只交允许文件和首稿说明，写实际变动、选择器依据及未测项；不得声称执行未运行的测试/窗口，不自行提交或安装。
