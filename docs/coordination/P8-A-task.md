# P8-A 抱书彩铅氛围接入

只用 read/write，禁止 shell、Git、派生agent、改权限/profile/核心/模型、安装依赖。工作区 E:/codex/dsh主题开发。

只可修改 index.js、client.js、package.json，并新增 docs/validation/P8-DSH-NOTES.md。不要修改测试、素材、scripts、README或其他文档。Codex负责素材、测试、真实窗口、检查与审核。

先读本任务、client.js、index.js、package.json，以及 docs/superpowers/plans/2026-10-20-reading-atmosphere.md 的视觉要求和文件契约。不重新调研、生成图片或重构生命周期。

已完成：Codex导出 assets/scenes/web/reading.webp（1280×853，222484B），预算550000B。母版不变。当前新回归RED：18项中5失败13通过，失败分别是reading GET/HEAD仍404、旧sidebar-character仍200、Scene仍旧图、旧色板。新增shell.overlay owner恢复用例已通过，原生命周期应复用。

已由本机0.2.1-rc.2源码及真实空态DOM核对的公开锚点：
- [data-slot="main.conversation"] > div[data-phase="hero"或"active"]：根。
- 根内 [data-conversation-content][data-content-phase="hero"或"active"]：内容容器。
- 其直接子 [data-conversation-scroll]：竖向滚动容器。
- 滚动容器内 [data-composer-seat][data-conversation-region="composer"]：输入座。
- 空态该seat直接子div即官方composerStack，内含标题、工作区、输入。不用hash class/nth-child猜结构。
- 活跃消息视图有 [data-slot="conversation.session"]，其DOM由Codex后续检查。
- 当前1280×720空态：sidebar280px，main1000px；输入seat宽993px、高238px，y261。

实现要求：
1. index.js的FILES由avatar+sidebar-character替换为avatar+reading，后者路径 ./assets/scenes/web/reading.webp。其余HTTP处理不动。
2. package.files新增 assets/scenes/web/reading.webp、assets/scenes/README.md，移除 assets/characters/web/sidebar-character.webp。保留所有既有P6草稿字段/白名单/版本；不回退。
3. 26项token保留键和pair。纸底#F7F3EB、阅读/输入/弹层#FFFDF8、侧栏/hover#EDECE9；正文#313A50、次/三级/caption#5F687C；强调/主按钮/info#536B9E、hover#435882、白按钮字；边界轻#D4D7DE、功能#7D879B（Codex算对比度必要时加深）；bubble#DDE4EF、高亮/侧栏active#E4E5EE。保留语义色/语法高亮/字体。
4. 保留24px Avatar及shell.overlay只挂style的SceneStyle，两个controller。原apply、事务、微任务、最新scheme和逆序释放完全不动。
5. 主图只绘于main.conversation根负层级::before、pointer-events:none，完整横幅不拉伸；初始background-size:cover、right center、opacity:1，背景纸底衔接。不再给sidebar画avatar大水印，侧栏靠token呼应。
6. 宽空态左内容右人物：仅hero限定输入栈max-width约440–520px、至多约会话列55%，align-self:flex-start，左边约24–48px。可用已核对的[data-composer-seat] > div，hero的--dsh-composer-card-max-width适配栈宽。不要给聊天代码套窄栏限制。允许主根设自有container-name/type，按会话列宽做container query，避免viewport宽但会话窄时挤压。
7. 窄会话列（初始<=760px）恢复输入栈正常宽度，并把人物放在输入上方/右上；保持脸和书不被机械cover切掉，内容可竖滚、不横溢。不靠把主图淡到水印掩盖问题。宽屏聊天阅读区/代码/工具卡/输入使用足够不透明的纸白阅读面；不替换消息树、不直接写DOM。Codex会按实窗微调。
8. 不给插件/设置等全局页绘主图；不加配置/动画/框架/轮播。不要进行其他清理或改文案。

完成后P8-DSH-NOTES写实际改动、选择器依据、风险和未验证项。final仅文件、取舍和未测项；不要声称运行了测试或窗口，也不要读取凭据/历史大日志。
