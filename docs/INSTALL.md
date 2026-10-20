# 安装、停用与卸载

目标宿主 DSH `0.2.1-rc.2`，包 `dsh-theme-dongxuelian@0.1.0-preview.4`。仅使用官方插件 CLI 和管理开关，不修改核心、不覆盖整份 profile 配置。

## 选择 profile

- 本机桌面通常使用 `desktop`；Web 可能为 `web` 或自建名称。安装前确认正在使用的名称。
- 设置了 `DSH_HOME` 的终端会操作该 home 下的 profile。开发测试应使用单独 home；日常安装前确认终端没有遗留测试用 `DSH_HOME`。
- 本机 CLI 在 `E:\dsh\resources\runtime\cli\bin\dsh.cmd`。其他机器替换成实际安装位置或已在PATH中的 `dsh`。
- 首次操作自己的日常 profile，可先备份**仅该 profile 的** `package.json`、`cordis.patch.yml`、`cordis.yml` 与锁文件到本地；不要把凭据、聊天或整个 home 一并发布。开发者本机的安装按用户明确授权执行，记录留在源码仓库的部署报告中。

## 安装本地归档

先对下载的tgz计算SHA256，与归档旁的校验文件核对：

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath 'E:\codex\dsh主题开发\release\dsh-theme-dongxuelian-0.1.0-preview.4.tgz'
```

桌面示例：

```powershell
& 'E:\dsh\resources\runtime\cli\bin\dsh.cmd' plugin --profile desktop add 'E:\codex\dsh主题开发\release\dsh-theme-dongxuelian-0.1.0-preview.4.tgz' --ignore-scripts
```

Web示例（把 `my-web` 替换成已有的Web profile名称）：

```powershell
& 'E:\dsh\resources\runtime\cli\bin\dsh.cmd' plugin --profile my-web add 'E:\codex\dsh主题开发\release\dsh-theme-dongxuelian-0.1.0-preview.4.tgz' --ignore-scripts
```

插件没有运行依赖，本地验收另加 `--offline` 从tgz安装。CLI会按包内 `dsh.bundle.patch` 调整插件bundle栈，不要再手写第二条entry。安装后按宿主提示重载，或在下一次正常启动该profile后生效；不要强行结束正在工作的宿主。

## 停用

在宿主“插件”页面关闭 `dsh-theme-dongxuelian` 的启用开关。浅色覆盖、品牌头像、抱书场景与资源路由应释放；深色本就保持原生主题。重新开启恢复浅色主题。不会改写“浅色/深色/跟随系统”的选择。

若其他主题也修改同一token或品牌槽，先在管理页面停用其中一项再比较；本预览版没有多主题排序设置。

## 卸载与恢复

```powershell
& 'E:\dsh\resources\runtime\cli\bin\dsh.cmd' plugin --profile desktop remove dsh-theme-dongxuelian
```

本机DSH 0.2.1-rc.2转发pnpm 11；`remove`不接受`--offline`或`--ignore-scripts`，不要从add命令照搬这些参数。

Web同样换成目标profile名称。之后正常重载/重启，确认品牌头像和人物背景不再出现，原生品牌和配色恢复；不要删除整个profile或其用户数据。

如需恢复本主题，重新执行同一tgz的add命令。出现安装失败，保留错误日志，核对profile名、归档路径、校验值与DSH版本；不要用整份示例配置覆盖原配置，也不要修ACL来绕过权限问题。

## 本地验收方式

preview.4归档使用独立隔离home的theme-pack profile加载，通过官方CLI离线add并核对安装文件；正常使用窗口与启停见源码仓库的`docs/validation/P10.md`。历史preview.2完整安装/卸载/重启记录见`docs/validation/P6.md`。这些测试profile不是日常安装目标，不要复制其配置到用户profile。
