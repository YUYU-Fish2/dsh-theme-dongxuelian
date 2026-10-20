# DSH 冬雪莲涂鸦主题

`0.1.0-preview.4`，面向DSH `0.2.1-rc.2`的轻量独立主题。以用户批准的宽屏示意重新生成彩铅抱书场景，统一暖纸白、灰蓝与靛蓝：宽屏首页的输入和人物使用共同构图，聊天适度加宽阅读区并收紧中间空白；窄列优先保证输入和正文宽度。preview.4在宽列聊天使用实色纸底与文字外侧柔边，让阅读面和插画自然衔接；输入卡只减轻非聚焦阴影。深色/停用释放覆盖，不写主题偏好。

插件直接交付JavaScript和独立WebP，零第三方运行依赖，无构建或安装脚本。头像与场景共334994B；PNG母版、用户截图和整页生成示意不打包。来源见[场景说明](assets/scenes/README.md)与[头像说明](assets/characters/README.md)。

## 安装与移除

下载本项目的 `dsh-theme-dongxuelian-0.1.0-preview.4.tgz`，核对随包提供的 SHA256。通过官方 CLI 安装到明确的 profile；以下为本机 PowerShell 示例，请按实际位置替换路径：

```powershell
& 'E:\dsh\resources\runtime\cli\bin\dsh.cmd' plugin --profile desktop add 'E:\codex\dsh主题开发\release\dsh-theme-dongxuelian-0.1.0-preview.4.tgz' --ignore-scripts
```

Web使用者将 `desktop` 换成自己的Web profile名称。不要整文件覆盖 `cordis.yml` 或手工重复插入同一个插件。临时隐藏主题，使用官方插件管理里的启用开关。

```powershell
& 'E:\dsh\resources\runtime\cli\bin\dsh.cmd' plugin --profile desktop remove dsh-theme-dongxuelian
```

完整安装、停用、卸载与恢复步骤见 [安装说明](docs/INSTALL.md)；验证和预览限制见 [发布说明](docs/RELEASE.md)。

## 验证范围

P10使用既有18项主题/Slot/HTTP回归和语法/包契约检查；真实视觉检查覆盖2331×1388与1265×817聊天、两行输入与按钮焦点、菜单、侧栏收放、深浅往返及官方启停。原P9首页/场景与真实加载证据保留。聊天内容来自既有隔离历史，没有新增模型请求。

**这是预览版。**用户原生截图已确认旧版主题显示；新版视觉验证采用隔离Web，系统DPI、其他平台及所有社区插件组合未逐项验证。日常安装仅在用户明确授权后进行，安装不等于原生窗口已重载。

## 源码开发入口

在完整源码仓库中，先读 `docs/HANDOFF.md`、`docs/superpowers/plans/2026-10-20-paper-blend.md`、`docs/IMPLEMENTATION-PLAN.md` 与 `docs/coordination/WORKBOARD.md`；文件索引为 `docs/PROJECT-MAP.md`。这些开发记录不随安装包全部分发。

```powershell
npm test
npm run check
```

测试使用Node内置工具；HTTP回归需允许本机回环连接。许可证见 [LICENSE](LICENSE)，引用说明见 [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES.md)。角色素材不声明官方授权。
