# 冬雪莲涂鸦主题完整实施计划

> 执行方式：按阶段执行（executing-plans），DSH 承担受限实现，Codex 承担派发、测试与审核。用户已于 2026-10-19 授权自主继续；完成一个阶段的验证、记录与提交后再进入下一阶段，不合并成无法回退的大改动。新会话从 [HANDOFF](HANDOFF.md) 接续，不重复 P0/P1。

**目标：**交付可在 DSH `0.2.1-rc.2` 独立启停、轻量、可读、保留角色特征的主题插件。

**当前执行入口：**用户已选定B彩铅绘本抱书图reading.png，并要求先规划交接、新会话实现。按 [P8抱书氛围详细计划](superpowers/plans/2026-10-20-reading-atmosphere.md) 从Task 1接续；本轮不改运行代码、不导出/预览/打包。以下P0-P7为历史阶段，P7技术通过不代表P8审美需求已满足。

2026-10-20按用户“梳理文件”请求补全[文件导航](PROJECT-MAP.md)，保留目录及既有草稿；未启动上述P8任务，实施范围与验收安排不变。

**架构：**官方Theme覆盖仅在浅色激活，不改变用户偏好；品牌头像与背景样式走官方Slot，完整抱书场景在内容下绘制，独立资源走固定Host白名单路由，统一随生命周期释放。隔离测试不碰用户desktop profile。

**技术栈：**原生 JavaScript、官方 `window.__ModuleLoader__.load` factory、Node 内置测试/VM/文件 API、DSH 自带 Electron 与官方 ModuleLoader；图片采用独立 PNG/WebP 文件。当前无第三方运行依赖，不为几百行主题引入编译框架。

## 已确定的输入与取舍

- 用户已选B彩铅绘本抱书图，最新目标为纸白/灰蓝/靛蓝、左侧阅读右侧人物的完整场景。见P8详细计划；P1暖色/仅小头像和P7放大Q版背景均为历史。深色继续释放覆盖。
- 独立最小插件优于 Fork 大主题。P0 已检索与读三参考项目；P2 GitHub MCP 再查 oil 的 `overrideTokens` 返回未完整索引的空结果，不据此声称不存在实现。以已克隆固定 SHA 源码与本机官方 API 为证据。
- 复用官方 factory 形式，不自造模块加载器/打包器、不依赖 React（仅在 P3 实际 Slot 组件需要时使用宿主 React）。直接交付 JS，无需 TypeScript/打包构建依赖，`npm run check` 承担语法和契约检查。
- 手写入口 `client.js` 是唯一客户端源；不要同时维护等价 `src` 和 `lib` 副本。Host 入口 `index.js`；包名 `dsh-theme-dongxuelian`；Cordis entry id 同名，避免参考项目常用 `theme` 冲突。
- 模块 loader 的真实启动检查单列，不能用 VM 测试通过代替真实宿主导入；实际窗口回归也单列。
- P1 两项图片是 1254px 母版候选，总 1860219 字节。存在低 alpha 像素和头像 9.33% 最小留白，不能直接当轻量已验收发布资源。

## P0 / P1：历史基线

- [x] P0 调研报告、本机 `0.2.1-rc.2`、三仓源码/兼容/许可核对；提交 `b4b5edb`，标签 `p0-research-2026-10-19`。
- [x] P1 规范、色彩核算、两项候选与原生尺寸初审；提交 `4ebb417`，标签 `p1-visual-2026-10-19`。
- [x] 用户允许新绘并要求后续自主推进与完整项目内记录。

## P2：基础主题与可撤销生命周期

**文件职责：** `package.json`（入口/文件白名单/脚本），`cordis.patch.yml`（唯一 Host entry），`index.js`（Host 最小入口），`client.js`（factory、令牌、事件/释放），`test/theme.test.mjs`（生命周期回归），`scripts/check.mjs`（语法与包契约），`scripts/runtime-smoke.mjs`（真实官方 loader 检查），`docs/validation/P2.md`（证据）。

1. [x] Codex 先编写测试：浅色存在一层、深色零层、回浅色恢复、同步 `theme/change` 不递归、重复同色事件不重叠、停止后监听与覆盖归零、外部插件覆盖保持、当前用户 preference 不被写入、重启只出现一份。运行 `node --test test/theme.test.mjs` 记录 RED。
2. [x] 派发 DSH 限定文件，不允许改测试、profile、权限。`client.js` 用官方 factory 返回 `inject: ['theme']` 与 `apply`。最终实现经真窗口修订为微任务合并事件、串行收敛并读取最新 scheme，将 stopped 纳入目标状态；不能在宿主派发内嵌套发布快照。详见 `docs/validation/P2.md`。
3. [x] 颜色映射使用 P1 核算值；背景、层级、文字、侧栏、主按钮、输入框、边界、选中态只用本机存在的 token。保留代码语法色/字体；必要的代码块底色不能破坏高亮对比。
4. [x] 完成 `package.json` 与唯一 Cordis entry，文件白名单先只带基础代码、说明和许可证，不带候选图片；无 import 的模块不添加 React/cordis 运行依赖。`npm test`、`npm run check` 应退出 0。
5. [x] `scripts/runtime-smoke.mjs` 从显式 `DSH_RUNTIME_ROOT`（默认本机 asar 路径）读取官方 loader，建立真实模块表并导入本插件。以 Electron Run-as-Node 执行，不修改安装包。记录真实版本与加载结果。
6. [x] 先用 `.research/test-home` 启动官方隔离 Web profile，临时加入本包，检查最终配置 entry 与页面计算值。查 CLI `web --help` 获取实际支持的 port/auth 参数，不猜命令或复用用户真实会话。若 UI 工具无法访问，记录模块级结论与 UI 限制，不伪造窗口验收。
7. [x] 用本地 jscpd CLI 扫当前绝对路径，检查新增文件与差异，修复实质问题，提交 `feat: add reversible light theme tokens` 并更新接续文档。P2 结束前不得把未运行的 UI 检查记为通过。

## P3：两项角色资源与显示逻辑

**文件：** `assets/characters/`（必要导出与出处），`index.js`（固定资源映射路由），`client.js`（小头像 Slot 与清理），`test/assets.test.mjs`（Host 请求与失败路径），`docs/validation/P3.md`。

1. [x] 检查两项母版在 16/24/32/48/64/96px、三种 P1 浅底与圆角/圆形裁切中的实际渲染；不重绘人物身份。先用容器留白/简化现有头像解决裁切，不扩大侧栏布局；无法接受的图通过 imagegen 修订。
2. [x] 用户明确授权仅等比缩放/格式编码；已输出两项192px透明无损WebP，总50862字节，母版不变。输出适合实际显示的独立轻量 PNG/WebP。记录尺寸、字节、alpha 和哈希，明确母版与发布导出；不把图编码进 JS。图片修改遵守当前 imagegen 工具要求，不擅自改用 Python 修图。
3. [x] 先写 Host 测试：只允许 GET/HEAD 指定两文件，未知文件 404，路径穿越/任意磁盘读取不可达；Content-Type 正确、HEAD 无正文、disposer 后路由移除。先看到 RED 再实现。
4. [x] Host 使用官方 `ctx.webServer.register` 的唯一命名白名单路由，不复制 naniwet 任意图片路径方案。真实桌面 Host 接入已确认，但请求是否经桌面载入仍须实际验证。
5. [x] 按本机 Slot 规则使用 `sidebar.brand.mark` 和适当 header 小槽，确认当前占用、优先级、原有按钮与卸载还原。若侧栏插件替换子槽，用 `slots.inject` 跟随 owner，不替换整栏；已有空间不够则使用简化头像。空状态插画可省略，不新增第三项无必要图。
6. [x] 测试同一角色两处一致、点击穿透/可访问名称、明暗策略、热启停无重复、图片路由和 Slot 完全释放。更新包文件白名单，提交 P3 并写证据与剩余限制。

## P4：有限界面细节

**文件：** `client.js`，必要时单一 `theme.css`（只作用于插件自有节点），`docs/validation/P4.md`。

1. [x] 以 P2/P3 真界面截图对照 P1，修正悬停/焦点/选中/禁用/错误态和少量插件节点圆角，不改布局尺寸、消息结构或字体。
2. [x] 优先 token；没有全局圆角 token 就保留宿主圆角，不建立脆弱 hash 类名规则或 `:not(#id)` 特异性竞争，不默认装饰聊天正文。
3. [x] 复核正文/次文字/输入框/代码块对比与键盘焦点；动画默认无。不存在明显问题就不额外加装饰，记录无需修改的结论亦可。
4. [x] 运行现有测试、语法检查与 jscpd（如涉及公共逻辑），检查截图和差异，提交 P4。

## P5：运行回归与修复

**阶段结论：** 已完成候选回归，真实聊天/read/附件/尺寸通过，缩放为CSS模拟，真实桌面与better-sidebar激活未确认；按计划交付preview，非全平台通过。见矩阵。归档安装卸载项留P6补齐。

**文件：** `docs/validation/P5-MATRIX.md`（按行记通过/失败/未测、证据与复跑命令），只修复本插件相关代码与对应回归测试。

1. [x] 隔离宿主冷启动与刷新；单独启用、停用、重新启用、卸载重启；浅/深/系统切换；覆盖与事件无残留。
2. [x] 正常聊天流程、长中文/英文、长代码（含水平滚动与语法色）、多行输入/附件/工具消息；有真实模型调用需求时沿用已配置通道，不复制密钥；未真实发请求则不得宣称聊天验证通过。
3. [x] 800/1100/1440px 或实际可用窗口宽度，侧栏收起/展开，100/125/150% 缩放，键盘焦点；标明截图/模拟 viewport 与真实硬件的区别。
4. [x] 检查控制台错误和网络资源失败；比较用户已装 better-sidebar/whale-widget/dshmarket 的源码占用与隔离共存，不能擅自启停用户 profile 的插件。
5. [x] 发现缺陷先复现、写直接回归测试、最小修复、重跑受影响项。重大问题修复前不进入发布；环境导致的未测项如实保留，必要时交付候选而非“正式通过”。
6. [x] 完成独立代码审核与 jscpd：检查生命周期、事件重入、资源访问边界、Slot 卸载、打包遗漏；采用 DSH 限定审查或 code-reviewer，避免重复全文分析。修复重要项后提交 P5。

## P7：用户追加的配色与人物背景（先于P6完成）

- [x] 实际查看アカババァ会员Q版、B站装扮、眠眠生日二创，只参考配色构图；设计/计划见 `docs/design/P7-WINTER-SCENE.md`。
- [x] 新Slot契约RED→DSH限定实现→Codex对比度修订/素材导出；官方shell.overlay仅挂style，负层级背景、保留品牌、移除header重复图。
- [x] 17/17、check、真实loader、实际九组尺寸/CSS缩放、明暗/启停/收放/更多/历史代码，独立review无实质发现。证据 `docs/validation/P7.md`。
- [x] 最终jscpd：本项目8文件855行0 clones；diff检查通过并独立提交P7。然后P6重新打包，不交旧preview.1包。

## P8：选定抱书图后的氛围接入（新会话实施）

- [x] A-F风格探索、用户选择B、四幅同系列生成、用户明确选定reading.png主视觉；母版已保存并提交b4e6e32。
- [x] 确认最新上传图与母版像素一致；完整规划与交接已写入P8详细计划。
- [ ] Task 1：按授权等比导出单项reading.webp；核对真实空态DOM，不猜hash选择器。
- [ ] Task 2–3：路由/Slot契约RED，DSH限定接入，Codex审核与GREEN；保留P6草稿。
- [ ] Task 4–5：实际空态/聊天布局、阅读面、窄屏/明暗/启停，测试/真实loader/查重/审核，P8独立记录提交。
- [ ] Task 6：P8成立后重做P6归档及隔离安装/卸载/重启；不交旧包。

## P6：打包交付与安装/卸载说明

**暂停提醒：**风格与主图已确定，不再等待A-F选择。用户要求新会话实现P8抱书氛围；完成P8真实窗口验证后再继续本节，不能交旧Q版包。

**文件：** `README.md`（最终入口与安装），`docs/INSTALL.md`（版本/安装/停用/卸载/恢复），`docs/RELEASE.md`（验证/限制/素材出处），`LICENSE` 与必要 `THIRD_PARTY_NOTICES.md`，`release/`（最终可安装归档与 SHA256，按实际打包内容决定是否提交大文件）。

1. [ ] `npm pack --dry-run --json` 核对只带入口、patch、必要独立资源、安装与许可说明；排除 `.research`、用户数据、测试夹具、母版大图和依赖目录。不执行无必要的安装生命周期脚本。
2. [ ] `npm pack --pack-destination release` 生成 tgz，列归档内容、字节数和 SHA-256；在新的隔离 profile 从该 tgz 安装，不能只验证工作树链接包。
3. [ ] 用实际可用 CLI 写安装命令，desktop 与 web profile 分开解释；停用优先走官方管理界面，卸载对应包，提醒不整文件覆盖 cordis。用户原 profile 的实际安装若有必要，由此前自主开发授权范围评估后执行可回退操作，先备份仅受影响配置并记录；不擅自关闭用户运行中的应用。
4. [ ] 文档明确目标与已验证版本，角色图原创生成参考、第三方代码归属、未测平台/交互与多主题顺序限制。许可证仅覆盖本项目可授权部分，不虚构角色官方授权。
5. [ ] 全部适用检查通过后提交 release 记录，建立 `v0.1.0`（正式）或 `v0.1.0-preview`（有重要运行未测项）标签，更新接续文件和准确最终说明。不自动发 GitHub Release、推远端或发布 npm。

## 统一命令与回退

工作区：`E:\codex\dsh主题开发`。Node：`D:\node.exe`；DSH CLI：`E:\dsh\resources\runtime\cli\bin\dsh.cmd`；实际运行时 root：`E:\dsh\resources\app.asar\dsh`。

```powershell
git status --short
node --test test/*.test.mjs
npm run check
$env:ELECTRON_RUN_AS_NODE='1'
& 'E:\dsh\DeepSeek Harness.exe' scripts/runtime-smoke.mjs
& 'C:\Users\sjtxd\Documents\Codex\tools\jscpd\node_modules\jscpd-windows-x64-msvc\bin\jscpd.exe' 'E:\codex\dsh主题开发' --format javascript,typescript --ignore '**/.research/**,**/.git/**,**/node_modules/**,**/release/**' --reporters console,json --output 'E:\codex\dsh主题开发\.research\jscpd-current' --no-colors --no-tips
git diff --check
```

上述测试/脚本在 P2 创建后才可运行；当前状态以 HANDOFF 为准。每阶段完成后先确认工作树，再建立提交与标签；回看基线用 `git show <tag>:<file>`，需要回退时从相应 tag 新建恢复分支，禁止用 `reset --hard` 覆盖未知改动。现有作者配置缺失时使用单次 `git -c user.name=Codex -c user.email=codex@local.invalid commit ...`，不改全局设置。

## 新会话交接检查

- [ ] 状态：当前分支/提交、已完成阶段、正在执行任务、后台进程与是否可安全停止。
- [ ] 验证：最近命令、时间、退出码、证据文件；过期报告与新修订分清。
- [ ] 接续：下一项具体动作与验收标准、已知阻碍及只需补充的条件。
- [ ] 范围：保留用户最新授权、独立资源、深色释放、不动核心/profile、DSH 无 shell 的分工。

每次阶段提交或会话结束前更新 [HANDOFF](HANDOFF.md)。
