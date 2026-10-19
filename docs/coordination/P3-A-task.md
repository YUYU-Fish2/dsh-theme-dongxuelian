# P3-A：独立角色资源 Host 路由

执行 DSH，命令/审核 Codex。工作区 `E:\codex\dsh主题开发`，分支 `feat/theme-v1`。用户已授权继续与本地等比缩放、WebP 编码。仅做 P3 Host 路由，不改客户端、测试、图片、profile、DSH 核心或 Git，不安装依赖，不用 shell/派生 agent，不修 ACL。

允许修改：`index.js`，新增 `docs/validation/P3-DSH-NOTES.md`（不超过 40 行）。先读本任务和 `test/assets.test.mjs`；不要重复 P0 调研或扫描全盘。Codex 已写测试并会在派发前运行 RED。

## 已确认接口与取舍

- `ctx.inject(['webServer'], scope => { scope.effect(() => scope.webServer.register(route), label) })`，沿用官方服务生命周期；也可使用已确认的声明式注入，只要满足生命周期与隔离要求。
- `register({ kind: 'prefix', path: '/dongxuelian-theme/assets', handler(req,res) {} })` 返回路由移除 disposer。handler 使用原生 Node IncomingMessage/ServerResponse；宿主已经按 pathname 选路由。
- 原始官方服务摘录仅在确需查看时读 `.research/p3-dsh-host-webserver-lib-index.js` 第 320–333、377–390 行；参考 `.research/naniwet-dsh-themes/theme-route.js` 第 80–145 行只为 API 形式，不复用其任意路径逻辑。
- 本包不需要复制静态服务器或引入依赖，只用 Node 内置文件 API。

## 验收边界

- 固定映射恰好两项 URL：`/dongxuelian-theme/assets/avatar.webp`、`/dongxuelian-theme/assets/sidebar-character.webp`。分别映射包内 `assets/characters/web/` 同名文件，文件相对 `import.meta.url` 解析，不接受任意磁盘路径。
- 只允许 GET/HEAD；其他方法 405，`Allow: GET, HEAD`。未知文件/母版/嵌套/编码路径 404；不要 decode 后放行编码别名。允许普通查询参数（去除 `?` 后精确查白名单），不要用会继承 Object.prototype 的对象属性判断。
- 成功 `Content-Type: image/webp`、正确 `Content-Length`、`X-Content-Type-Options: nosniff`；HEAD 不读流/不输出正文。GET 返回原始字节，不 base64、不内联 JS。缓存使用短期缓存或 no-cache，不使用长时间 immutable。
- 文件读取失败时不得悬挂/崩溃；保持失败可诊断。停用/服务移除后路由释放；不要手动改宿主 server。
- 保留包名导出。不要声称已运行命令，Codex 负责实际验证。

final 仅列修改文件、最小取舍和未验证项；不要扩展到 Slot、打包、安装或发布。
