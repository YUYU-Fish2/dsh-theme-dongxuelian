# P2-A：基础主题限定实现

执行 DSH，审核/命令 Codex。工作区 `E:\codex\dsh主题开发`，分支 `feat/theme-v1`。用户已授权自主分阶段继续，不要再次询问是否实现。只做 P2，不接图片、Slot、设置、DOM 样式。

先读取本任务、`test/theme.test.mjs`、`docs/design/P1-VISUAL-SPEC.md` 第 5/6 节；必要时读取 `docs/IMPLEMENTATION-PLAN.md`。不要调查全盘/网络、不要调用 shell/agent、不要修 ACL、不要改用户 profile、不要 Git。仅允许新增/修改：`client.js`、`index.js`、`package.json`、`cordis.patch.yml`、`docs/validation/P2-DSH-NOTES.md`。不要修改测试。

Codex 已写生命周期测试并将在派发前执行 RED。你用 read/write 实现满足测试的最小插件；不声称已运行测试，命令由 Codex 执行。

## 包与入口

包名和官方 loader registration id 均 `dsh-theme-dongxuelian`，version `0.1.0-preview.1`，type module。直接交付 `index.js` 与手写官方 factory 格式 `client.js`，不创建 src/lib 双副本、不加编译器或依赖。Host `export const name` 与空 `apply` 即可。

客户端按现有官方形式：`window.__ModuleLoader__.load({ id, factory(require) { ...; return { inject: ['theme'], apply }; } })`。不需要 require 任何共享模块，因此 dependencies/peerDependencies 都无需添加 React。`dsh.client` 指定 platform web、inject `['@deepseek-ai/dsh-client-ui-theme']`，bundle.patch 指向 `./cordis.patch.yml`。patch 插入唯一 id/name（均包名），避免使用通用 theme id。

package files 白名单先含两个 JS、patch、README、LICENSE（Codex 后补 LICENSE），不打包 P1 图片。scripts：`test: node --test test/*.test.mjs`；`check: node scripts/check.mjs`（Codex 后补脚本）。无 install/prepack 生命周期钩子。

## 生命周期关键要求

浅色时 `ctx.theme.overrideTokens(包名, TOKENS)` 取得 release，深色释放。不得 setTheme、不得改 preference、localStorage、document/body 或全局 CSS。使用 `ctx.effect` 包含初始化/监听与清理；`ctx.on('theme/change', sync)` 返回 stop。清理先停止监听，再释放本层；不清除别人的层。

官方 overrideTokens/release 会同步触发 theme/change，因此应用前必须先标记浅色层拥有状态（例如 applied=true），释放前先清空状态，保证同色嵌套事件直接返回，避免递归。不要在每个 theme/change 无条件重注册。只切换浅/深时更改本层。测试包含此行为。

TOKENS 每项必须 `{light, dark}` 字符串对（官方边界要求，即使暗色不激活）。dark 可使用对应 light 字符串因为暗色从不注册，不另造深色设计，文档说明此点。优先 15–25 个实际存在的 token，保持界面可读。

配色：bg-base #F7F4EF；面板 bg-layer-1 #FFFDF9、bg-layer-2 #F0ECE7；label-primary #4C4540、secondary #716860；装饰 border-l1/l2 #D8D1C8，必要控件边界按宿主 token使用 #8B8177；brand/state-business/button-primary-fill 深玫瑰 #96536A，主按钮 label白色（先核对 token 名）；hover 用可读的较深玫瑰；input-major 面板；sidebar-fill 次底；bubble 柔粉 #DFAEBB、选中底淡紫 #C9BED8 均深文字。不改代码高亮/字体，不要盲写未知 token。

已知存在的 token：`--dsw-alias-bg-base`、bg-layer-1/2/3、bg-overlay、label-primary/secondary/tertiary/caption、border-l1..l4、brand-primary、state-business-primary、button-primary-fill、specific-input-major、specific-sidebar-fill、specific-bubble。完整本机源码在 asar，可 read `E:\dsh\resources\app.asar\dsh\node_modules\@deepseek-ai\dsh-client-ui-theme\lib\client.js`，只在确需核对 label/hover token 时读相关区段；勿整文件读取。

说明文档不超过 50 行：实现文件、设计取舍、使用 token 名、未运行的检查与风险。最终回复仅文件列表和需 Codex 验证项。
