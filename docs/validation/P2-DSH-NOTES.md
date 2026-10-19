# P2-DSH 实现记录

本文件保留 DSH 初稿说明，`applied` 机制已由 Codex 修订为微任务合并和串行收敛。当前代码和最终验证以 [P2.md](P2.md) 为准。

日期 2026-10-19。范围：仅基础浅色令牌与可撤销生命周期；未接图片、Slot、设置、DOM 样式。

## 实现文件

- `client.js`：官方 `window.__ModuleLoader__.load` factory；`inject: ['theme']`；浅色 `ctx.theme.overrideTokens('dsh-theme-dongxuelian', TOKENS)`，深色释放；`ctx.effect` 内订阅 `theme/change`，清理先停监听、后释放本层。
- `index.js`：Host 最小入口，`name` 为包名，`apply` 为空。
- `package.json`：`dsh.client.platform=web`、inject 官方 theme、bundle.patch；文件白名单暂不含 P1 图片。
- `cordis.patch.yml`：唯一 entry，`id`/`name` 均为包名，不使用通用 `theme` id。

## 生命周期取舍

- 注册前先置 `applied=true`，释放前先置 `applied=false`；官方 API 会同步触发 `theme/change`，因此同色嵌套事件直接返回，不递归、不重复叠层。
- 仅浅→深/深→浅切换时改动本层；同色事件不重注册。
- 清理顺序为停止监听 → 释放本层；不调用 `setTheme`，不写 preference/localStorage/document/body，不清除其他插件层。

## 使用令牌（24）

- `--dsw-alias-bg-base` #F7F4EF；`--dsw-alias-bg-layer-1`、`--dsw-alias-bg-overlay` #FFFDF9；`--dsw-alias-bg-layer-2`、`--dsw-alias-bg-layer-3` #F0ECE7。
- `--dsw-alias-label-primary` #4C4540；`--dsw-alias-label-secondary`、`-tertiary`、`-caption` #716860。
- `--dsw-alias-border-l1`、`-l2` #D8D1C8；`--dsw-alias-border-l3`、`-l4` #8B8177。
- `--dsw-alias-brand-primary`、`--dsw-alias-state-business-primary`、`--dsw-alias-button-primary-fill` #96536A；`--dsw-alias-brand-text` #FFFFFF；`--dsw-alias-button-primary-hover` #7E4257；`--dsw-alias-interactive-bg-hover` #F0ECE7。
- `--dsw-specific-input-major` #FFFDF9；`--dsw-specific-sidebar-fill` #F0ECE7；`--dsw-specific-bubble` #DFAEBB；`--dsw-specific-bubble-highlight`、`--dsw-specific-sidebar-nav-item-active` #C9BED8。

## 未运行与风险

- DSH 未运行 `node --test test/theme.test.mjs`、`npm run check`、真实官方 loader 或实际窗口；这些由 Codex 执行并记录。
- 每个 dark 值与对应 light 相同，仅满足官方 `{light,dark}` 形状；深色不注册本层，因此 dark 值从不生效，也不代表新深色设计。
- `--dsw-alias-brand-text` 用作主按钮白字，依据参考主题与本机 0.2.1 令牌实践核对；真实组件的计算样式仍待窗口验证。
- tertiary/caption 复用 secondary，可能弱化文字层级；若实际界面不可接受，留待 P4 按截图调整。
- 多主题插件叠加顺序未验证；本插件只释放自己的 source，不抢占或清理他人层。
- `README.md`/`LICENSE` 与 `scripts/check.mjs` 由 Codex 后续补齐；文件白名单已预留。
