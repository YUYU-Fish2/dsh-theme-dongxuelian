# DSH 冬雪莲涂鸦主题

`0.1.0-preview.2`，面向DSH `0.2.1-rc.2`的轻量独立主题。以用户选定的彩铅抱书场景搭配纸白、灰蓝与靛蓝：宽空态左侧输入、右侧人物；聊天使用纸白阅读面，保留右侧观景带；窄列优先保证输入和正文宽度。深色/停用释放覆盖，恢复宿主品牌和颜色，不写主题偏好。

插件直接交付JavaScript和独立WebP，零第三方运行依赖，无构建或安装脚本。头像与场景共249348B；PNG母版及其他三幅备选不打包。来源和使用边界见[场景说明](assets/scenes/README.md)与[头像说明](assets/characters/README.md)。

## 安装与移除

下载本项目的 `dsh-theme-dongxuelian-0.1.0-preview.2.tgz`，核对随包提供的 SHA256。通过官方 CLI 安装到明确的 profile；以下为本机 PowerShell 示例，请按实际位置替换路径：

```powershell
& 'E:\dsh\resources\runtime\cli\bin\dsh.cmd' plugin --profile desktop add 'E:\codex\dsh主题开发\release\dsh-theme-dongxuelian-0.1.0-preview.2.tgz' --ignore-scripts
```

Web使用者将 `desktop` 换成自己的Web profile名称。不要整文件覆盖 `cordis.yml` 或手工重复插入同一个插件。临时隐藏主题，使用官方插件管理里的启用开关。

```powershell
& 'E:\dsh\resources\runtime\cli\bin\dsh.cmd' plugin --profile desktop remove dsh-theme-dongxuelian
```

完整安装、停用、卸载与恢复步骤见 [安装说明](docs/INSTALL.md)；验证和预览限制见 [发布说明](docs/RELEASE.md)。

## 验证范围

已验证18项主题/Slot/实际HTTP回归、真实官方ModuleLoader、隔离Web空态/聊天、深浅往返、停用/重启用与资源释放。空态和聊天分别检查800/1100/1440px及100/125/150% CSS缩放，长代码保持内部横滚。聊天/read内容复核使用P5历史，本轮未新增成功的模型请求。

**这是预览版。**真实桌面窗口/系统缩放/长会话列表压力未实测；better-sidebar在隔离环境的激活尚未确认。市场与挂件已见入口，但不能据此保证所有社区插件与多主题顺序兼容。不会自动安装到你的实际profile或发布远端。

## 源码开发入口

在完整源码仓库中，先读 `docs/HANDOFF.md`、`docs/superpowers/plans/2026-10-20-reading-atmosphere.md`、`docs/IMPLEMENTATION-PLAN.md` 与 `docs/coordination/WORKBOARD.md`；文件索引为 `docs/PROJECT-MAP.md`。这些开发记录不随安装包全部分发。

```powershell
npm test
npm run check
```

测试使用Node内置工具；HTTP回归需允许本机回环连接。许可证见 [LICENSE](LICENSE)，引用说明见 [THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES.md)。角色素材不声明官方授权。
