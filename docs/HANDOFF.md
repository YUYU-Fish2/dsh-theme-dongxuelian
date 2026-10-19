# 新会话接续记录

当前状态：**规划交接已完成，P8实现留到用户新开的会话。** 本轮只核对素材、写计划/交接和收起旧隔离预览，没有修改运行代码、导出资源、派发DSH或打包。

工作区：E:\codex\dsh主题开发；分支：feat/theme-v1。新会话先读本文件，再读[P8抱书氛围详细计划](superpowers/plans/2026-10-20-reading-atmosphere.md)、[总计划](IMPLEMENTATION-PLAN.md)、[看板](coordination/WORKBOARD.md)和根AGENTS。

## 1. 用户已经决定，不再重问

- 用户嫌旧背景只有小图标，要求有完整人物/场景、整体融洽；又明确人物偏涂鸦、减少AI味，不能只给精细动漫脸加纸纹。
- 已从A-F选择**B彩铅绘本**，随后四幅同系列中明确选定**抱书横幅reading.png**：“就这个，配合这个做一个恰当的氛围”。
- 最新指令：“先列进计划，做好规划交接工作，我新开会话做”。本轮到此交接；新会话收到继续指令后按详细计划执行。
- 视觉方向：温和纸白底、灰蓝线条、靛蓝重点色；主图右侧人物/蓝花清楚，左侧留白承接阅读和输入；侧栏只轻呼应。tea/garden/letter保留备选，不默认同时使用，不轮播、不再发散风格。
- 用户已允许本地**仅等比缩放与格式编码**；不能本地裁切/修脸/去背景/合成。需要改画用imagegen，不改已选人物身份和B画法。

## 2. 唯一主视觉与素材

选定母版：[reading.png](../assets/scenes/b-series/reading.png)，1536×1024、2857637B，SHA256：

`387d5998225c850660ffeda5347c1105d61b589109d6608ad33d121621ef1691`

本轮已只读核对：用户最新Temp上传图与该母版的解码RGBA像素**完全相同**，新会话直接用仓库文件，不依赖临时附件。四图目录与哈希见[素材说明](../assets/scenes/b-series/README.md)。其他精细月色花房、叠纸纹人物、A-F草案不作为最终图；外部二创只参考配色构图，不复制入包。

## 3. Git与当前代码，勿把历史当现状

- 本次规划前HEAD `b4e6e32`：四幅B系列PNG；`4abd4f9`：六种候选；运行基线P7 `f96f68f`。
- 更早：P5 `91734ba`、P4 `7f96ad1`、P3 `cb41a11`、P2 `be6ee2a`。
- **当前client.js仍是P7**：26个浅色冷白雾蓝token、24px品牌头像、shell.overlay里的SceneStyle，以及官方main/sidebar根伪元素绘制的旧Q版背景。抱书图尚未接入。
- 当前index.js仍只放行avatar.webp和sidebar-character.webp；新reading.webp未导出、未路由、未加入package.files。P8计划将最终白名单改为avatar+reading，保留旧文件源码但撤出包和运行路由。
- 生命周期沿用官方Theme/Slot和原事务、微任务合并/串行收敛；深色/停用释放，不写主题偏好。零第三方运行依赖、无编译。
- **保留现有未完成P6草稿：**README.md、package.json修改；未跟踪docs/INSTALL.md、docs/RELEASE.md。这些不是本轮规划产生的运行改动，不覆盖/回退/顺手提交为发行。package虽为0.1.0-preview.2，仍不是已验收交付。
- 旧release/dsh-theme-dongxuelian-0.1.0-preview.1.tgz为Q头像方案，不交付，不复用旧SHA。

## 4. 新会话从这里执行

详细计划有六个任务、具体文件、路由回归示例、命令、失败路径和视觉验收：

1. 核对素材与Git，等比导出reading.webp，单项初始预算550KB；读取真实空态DOM后再排版，**空态内部栈公开锚点尚未确认，不得猜hash类名**。
2. 先写新资源GET/HEAD、旧路由撤出、Slot/owner释放的RED，再给DSH限定任务。
3. Codex导出/测试/审核，DSH仅read/write改指定Host/client/package/notes；复用现有生命周期，不改核心/profile/测试/权限/模型。
4. 真实隔离DSH：宽窗口左内容右人物、聊天不透明阅读面、窄屏、长代码/工具卡/菜单/侧栏；避免又把主图淡成水印或遮脸压字。
5. 测试/check/真实ModuleLoader/明确本项目jscpd/独立审核；P8证据和阶段提交。
6. P8成立后再继续P6：文档改为最终图、精确打包、新隔离home从tgz安装/卸载/重启及SHA，预览交付，不自动发布或装入日常profile。

设计色值是**计划初稿**，尚未计算或实窗验收；导出尺寸/预算也不是已实现结果。新会话应核算对比度并依据真实截图微调，而不是把计划值写成通过。

## 5. 既有验证与本轮证据

历史P7：[P7验证](validation/P7.md)，17/17、check、真实loader/26token、独立reviewer12/12与0 clones；窗口九组CSS模拟、明暗/启停/更多/收放通过。P5曾完成真实两轮聊天/read/附件，可用其历史复核新背景，不必重新请求模型；必须写清是读取历史。

上述不是P8通过证据。本轮仅验证选定图片像素身份、文档/链接/差异；没有运行测试或实际P8窗口。原生桌面/系统DPI/其他平台/better-sidebar实际激活仍未确认，保留preview边界。

## 6. 进程、工具与安全边界

- 本轮未启动宿主或DSH模型任务；发现旧隔离theme-test进程PID25256、监听64067，核对其theme-test + p3-test-host.patch命令特征后已停止。旧端口/认证URL不可作为新连接；其他Node/DSH进程未操作。
- DSH P7-A已退出0。新P8任务书/日志尚未创建或派发，不能把旧日志当新贡献。
- DSH CLI：E:\dsh\resources\runtime\cli\bin\dsh.cmd；Node：D:\node.exe；Pillow：E:\python\python.exe；Electron：E:\dsh\DeepSeek Harness.exe；runtime：E:\dsh\resources\app.asar\dsh。
- jscpd用AGENTS指定CLI扫明确本项目绝对路径，排除.research/.git/node_modules/release。MCP索引不明不要冒用。
- 协作命令和凭据边界见[DSH协作方法](coordination/DSH-COLLABORATION.md)；沿用worker patch，由DSH自身服务解析密钥，不读/复制/打印凭据，不修ACL。
- 只在隔离.research/test-home等测试；不改日常desktop profile/其他插件/模型/核心，不推送发布，不reset/clean。日志、配置、认证链接、用户数据不提交/打包。

## 7. 新会话启动语

> 先读docs/HANDOFF.md，再读docs/superpowers/plans/2026-10-20-reading-atmosphere.md和WORKBOARD。用户已选B系列reading.png抱书横幅，围绕纸白/灰蓝/靛蓝做氛围，从Task 1开始；不用重新选图或生成候选。保留P6草稿，Codex审核导出测试、DSH限定read/write。先做真实空态/聊天预览，再完成P8/P6记录和交付。
