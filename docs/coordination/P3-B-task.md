# P3-B：轻量头像 Slot 与生命周期

执行 DSH，命令/审核 Codex。工作区 `E:\codex\dsh主题开发`，当前 `feat/theme-v1`。用户已授权继续。只用 read/write，不用 shell/agent，不改 profile、核心、权限或 Git，不安装依赖，不修改测试。

允许修改 `client.js`、`package.json`，以及在 `docs/validation/P3-DSH-NOTES.md` 追加不超过 25 行。先读本任务、`client.js`、`test/slots.test.mjs`、`test/helpers/client-host.mjs` 与 `package.json`。Codex 已观察 Slot 5 项 RED，原主题 7 项仍 GREEN。不要重做 P0、扫描全盘或改 Host `index.js`。

## 具体方案

- 用宿主共享 `require('react').createElement`；保持原 module factory，导出服务 `inject: ['theme', 'slots']`。`package.json` 的 `dsh.client.inject` 保留官方 theme，并加入 `@deepseek-ai/dsh-client-ui-renderer`，让 slots 服务先就绪。React 是宿主共享模块，不增加 npm 运行依赖。
- 仅 `sidebar.brand.mark` 和 `conversation.session.header.utilities`。前者 single，有官方品牌默认项；给本包有限优先级（低于默认 0，例如 -10）以显示本头像，卸载恢复默认项。后者为 list，用 id `dsh-theme-dongxuelian`、合理 order，不替换 header/leading/原按钮。
- 所有注册通过 `ctx.slots.inject(name, () => ctx.slots.register(options, component))`；inject 返回控制器 disposer，owner 子槽消失会自动清理，重新声明重跑。允许 owner 不存在，此时等待。不要在 React render 中注册槽。
- 两处均用简化 `avatar.webp`，固定 URL `/dongxuelian-theme/assets/avatar.webp`（可附当前包版本短 query）。侧栏官方 props.size=24；header 同样24。返回一个 `img`，alt 含冬雪莲、明确 width/height、draggable=false，style 只作用于自身：objectFit contain、display block、pointerEvents none、不放大布局、不使用圆形裁切、不修改系统/代码字体。图本身已有留白，无需额外 padding。
- `sidebar-character.webp` 是 192px 的独立备选导出，但当前没有48px以上既有槽，不强行展示趴边版；仍保留两项资源路由和包内导出。

## 生命周期与失败回滚

- 浅色同时拥有主题层及两个 Slot 控制器；深色/停用全部释放，回浅恢复；不写用户偏好。保留 P2 微任务合并/串行收敛/读取最新 scheme/stopped 的机制，避免同步事件重入。
- 使用同一个主题监听调度生命周期即可；同色事件不重建/叠加 Slot，卸载先停止监听再清理。
- 第二个 Slot 建立失败要回滚第一项和主题层，不能留下等待监听；注册覆盖或 Slot 期间同步停用时，随后返回的 disposer 仍要释放。已有 7 项回归不可破坏。
- 推荐将浅色一次 setup 组织为事务：先创建资源并收集 disposer，失败逆序释放，返回组合 disposer。返回前可触发 scheme/stop 变化，外层串行收敛必须重新读取 stopped 与 scheme。不要用大量任意扩展或改动无关 token。
- 官方 Slot 实现摘录 `.research/p3-dsh-client-ui-renderer.js:1368–1426`、官方品牌 `.research/p3-dsh-client-ui-brand-official.js:33–39`；只在需要时读相关片段。文档只记录实现与未验证项，不声称跑过命令。

## 包文件

`package.json.files` 精确加入 `assets/characters/web/avatar.webp`、`assets/characters/web/sidebar-character.webp` 与 `assets/characters/README.md`。不要把1254px PNG母版、docs、测试、缓存、node_modules 打包。保留版本 `0.1.0-preview.1`、现有 exports、scripts 与 patch。

final 仅列文件、选择与未验证项，由 Codex 跑测试、真实 loader 和隔离 UI。
