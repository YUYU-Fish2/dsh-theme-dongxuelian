# P0-A：DSH 技术调研任务单

派发日期：2026-10-19。派发与审核：Codex。执行：本机 DSH headless，沿用默认模型配置。

## 目标与范围

只做 P0 技术调研，禁止提前实现 P1–P6。工作区：`E:\codex\dsh主题开发`。

交付文件只允许新增/修改 `docs/research/DSH-P0-upstream.md`。不要提交 Git、安装依赖、启用插件、修改用户 profile 或 DSH 安装文件。不要读取凭据、聊天记录或其他无关私人数据。允许读取源码、README、LICENSE、兼容说明以及访问公开 GitHub 源码。

## 已确认信息（无需重复全盘搜索）

- 本机启动器 `E:\dsh\resources\runtime\cli\bin\dsh.cmd --version` 为 `0.2.1-rc.2`；桌面 EXE FileVersion 同值。`E:\dsh\version` 的 `44.7.0` 是 Electron 版本，不是 DSH 版本。
- 安装根目录 `E:\dsh`；代码位于 `E:\dsh\resources\app.asar\dsh\node_modules\@deepseek-ai`（Electron 的 asar 虚拟文件系统）；用户 desktop profile 已有 better-sidebar、whale-widget、dshmarket 等插件，禁止修改。
- 三个参考仓库已在 `.research/naniwet-dsh-themes`、`.research/ethan-dsh-theme`、`.research/oil-dsh-theme` 克隆；Ethan 克隆可能尚在完成，可短暂等候或直接读取 GitHub，禁止并发覆盖克隆。
- GitHub MCP 已确认三个仓库均标 MIT（仍须读许可证正文）。最近 push：naniwet 2026-08-18、Ethan 2026-10-16、oil 2026-09-09。
- oil README/compatibility 声明只验证 Harness `0.1.2-rc.1` / 社区 Desktop `2.0.5`，并不等于本机已兼容；源码引用 Theme/Slot API。
- naniwet 的配置型皮肤较重，有壁纸、背景角色、CSS module 子串选择器等；不要复制其角色素材。

## 需要交付的证据

1. 三仓各记录 HEAD 完整 SHA、包版本、许可证正文结论、实际入口与依赖、README/兼容说明、核心源码实现方式；引用路径和行号，公共证据给固定 SHA 链接。
2. 核对本机 `0.2.1-rc.2` 实际官方 Theme、Slot、插件生命周期、静态资源接口。优先读安装包或与其版本匹配的官方公开源码，不把 master 当成本机版本。可使用 Electron Run-as-Node 只读 asar，禁止解包覆盖应用。不要执行第三方仓库脚本。
3. 明确哪些主题令牌可稳定覆盖基础背景/面板/文字/边框/按钮/输入框；角色能否通过公开 slot 放在侧栏/顶部/空状态，若没有可用 slot 如实记录，不能虚构接口。
4. 比较三条路线：最小独立官方 API 插件、精简复用某参考项目、直接 Fork 大型主题；推荐符合用户轻量需求的一条，说明维护、许可证、依赖与适配成本。
5. 列出代码证据支持的结论、仅上游自述的结论、尚需真实运行验证的结论，禁止宣称加载测试已经通过。
6. 给出后续 P2 最小构建/打包/加载/停用回归方案以及与已安装侧栏插件的共存风险，不实际执行安装。

尽量控制输出与探索量，聚焦上述问题，不遍历整个硬盘。报告建议不超过 250 行；最终回复只给文件路径、关键结论、阻碍与未验证项。
