# P11-A 按示例恢复整页纸面

状态：已派发并交付，headless退出0；首稿见P11-DSH-NOTES，Codex实际修正与实验结果见P11.md。以下保留当时的限定任务，不把首稿参数当最终实测。

工作区C:/Users/sjtxd/.codex/worktrees/reference-paper/dsh主题开发。用户已要求按照示例工作，并确认与DSH分工；P10未达到示例，不能只再调直线渐变。

仅read/write/edit；允许client.js内SCENE_CSS、index.js固定Map、package.json的files白名单，并新增docs/validation/P11-DSH-NOTES.md。禁止改版本/测试/素材/生命周期/Theme token、profile/模型/权限/核心，不用shell/Git/网络/子agent，不读凭据或用户聊天。

先读docs/superpowers/specs/2026-10-20-reference-paper-design.md及plans/2026-10-20-reference-paper.md，然后读相关代码，不重复全仓研究。Codex已生成assets/textures/web/paper.webp及README来源说明，并先取得Host契约RED。

实现目标：
1. Map仅新增paper.webp→assets/textures/web/paper.webp；package files新增该文件及assets/textures/README.md。复用现有机制，不改其余Host逻辑。
2. 已实窗确认[data-slot="sidebar"] > div是真实侧栏盒；[data-slot="conversation.header"] > header是透明header。会话根是[data-slot="main.conversation"] > div[data-phase]。给侧栏和会话根同一纸纹url repeat（建议background-size640px），纸色#F7F3EB，不改sidebar宽度。
3. 会话根position:relative/isolation:isolate。将场景负层级::before从content提升到根，使原图纸面贯穿标题至底部；不要同时保留两份场景。背景使用现有reading.webp，不改图片。原CSS中content上::before的窄列/hero规则也一并改到根的::before，注意@container不能查询自身样式：如需根按宽度变化，用现有根对内content的背景承载方案或:has选择器，不加JS监听。选择最简单能成立的方案并说明。
4. 宽列active移除P10不透明scroll与::after桥。阅读座用宿主像素列宽的约60%（cap1920共同舞台），内容宽为座宽-96px，上限960px。宽列场景应呈现原母版左下花枝及自然边缘，不能被整块阅读底盖掉。人物位置/缩放按1625×968示例对照留给Codex修正；不要继续“保持旧几何”作为目标。
5. 小列保持原文字优先保护，允许保留窄列阅读底，纸纹仍统一；代码/输入浅纸色实底可保留，消息/文字不设置opacity/mask/filter。输入菜单、按钮、焦点和滚动条不改。
6. 不声明视觉通过。仅说明实际修改、背景层级、选择器依据和未测项。Codex负责浏览器/测试及最终修正。
