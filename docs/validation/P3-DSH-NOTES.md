# P3-DSH 实现记录：角色资源 Host 路由

日期 2026-10-19。范围仅 Host 白名单路由；未改客户端、测试、图片、profile/核心，未装依赖、未用 shell、未提交。

## 修改文件

- `index.js`：`apply(ctx)` 通过 `ctx.inject(['webServer'], scope => scope.effect(() => scope.webServer.register(route), label))` 注册一条 `kind: 'prefix'`、`path: '/dongxuelian-theme/assets'` 路由；`register` 返回的 disposer 交给 effect 释放。保留 `name` 包名导出。
- 新增本记录。行为测试 `test/assets.test.mjs` 由 Codex 预先写入并跑 RED。

## 映射与响应取舍

- 固定 `Map` 两项：`/dongxuelian-theme/assets/avatar.webp`、`/dongxuelian-theme/assets/sidebar-character.webp`，分别指向 `assets/characters/web/` 同名文件；路径由 `import.meta.url` 解析，不接受任意磁盘输入。
- 仅去掉 `?` 后的原文精查白名单，不做 percent-decoding；`__proto__`、编码别名、母版、嵌套与穿越均不命中，返回 404 且不泄漏文件系统信息。
- 未知路径先 404；已知路径仅 GET/HEAD，其他方法 405 且 `Allow: GET, HEAD`。
- GET 用 `readFile` 返回原始字节；HEAD 仅 `stat` 取长度，不读正文、不开流。两者均 `Content-Type: image/webp`、精确 `Content-Length`、`nosniff`、`Cache-Control: no-cache`。
- 读取失败：未发头时 500 文本，已发头时销毁响应，避免悬挂；错误文本不含磁盘路径。
- 未手动改宿主 server，也未复制静态服务器或引入依赖。

## 未验证（待 Codex）

- 未运行 `node --test test/assets.test.mjs`、`npm run check` 或真实 loader。
- 真实 DSH 0.2.1-rc.2 中 `webServer` 注入、前缀命中与停用释放未在窗口验证；仅按任务单给出的接口约定实现。
- `package.json` 的 `files` 尚未包含 `assets/characters/web/`，属打包范围，本次未改。
- 查询串、并发读取、客户端 Slot 接入及实际图片显示未验证。

## P3-B 头像 Slot 与生命周期（2026-10-19）

- `client.js` 用宿主共享 `require('react').createElement` 渲染固定 24px 的 `avatar.webp` `<img>`：alt 含“冬雪莲”，显式 24×24、`draggable=false`，仅自身 `objectFit: contain`、`display: block`、`pointerEvents: none`，无圆形裁切、字体或 padding。
- 服务改为 `inject: ['theme', 'slots']`。仅注册 `sidebar.brand.mark`（single，`priority: -10`，卸载回到官方品牌默认项）和 `conversation.session.header.utilities`（list，`id: dsh-theme-dongxuelian`、`order: 100`，保留原按钮）；均经 `ctx.slots.inject(name, () => ctx.slots.register(...))`，owner 未声明时等待，子槽消失自动清理。
- 浅色一次 setup 组织为事务：theme 层、侧栏控制器、header 控制器依次进入 owned 数组，失败逆序释放，同一组合 disposer 负责深色/停用释放。同步 stop/register 后重读 `stopped`；scheme 变化由外层串行循环重读 `colorScheme` 并丢弃本节事务，避免同色重建。
- `package.json` 的 `dsh.client.inject` 保留官方 theme，加入 `@deepseek-ai/dsh-client-ui-renderer` 以等待 slots 服务；`files` 精确加入两张 WebP 与角色 README，未包含 PNG 母版、docs、测试或缓存。版本、exports、scripts、patch 不变。
- `sidebar-character.webp` 仅保留路由与包内导出，未接入 48px 以上槽。

## 未验证（待 Codex）

- 未运行 `node --test`、`npm run check` 或真实 loader；未做隔离 UI/窗口验证。
- 已知测试对齐点：`test/theme.test.mjs` 仍以 `deepEqual([...plugin.inject], ['theme'])` 断言旧服务列表；本任务要求加入 `slots`，该断言需审核侧同步，未修改测试。
- 真实宿主中 single Slot 的 `priority: -10` 是否压过官方默认项、controller 释放、24px header 视觉占位待验证。
