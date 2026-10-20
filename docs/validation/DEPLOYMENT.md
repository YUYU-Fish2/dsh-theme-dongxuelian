# GitHub上传与本机安装

2026-10-20。P8/P6验收后，用户明确要求“上传github”“还有帮我装到电脑的dsh上”，并选择**新建公开仓库YUYU-Fish2/dsh-theme-dongxuelian**；后续又要求优先完成GitHub上传。这是针对本次上传和desktop安装的明确授权，替代此前“不自动推送/不自动安装”的默认边界。

## GitHub

- 公开仓库：[YUYU-Fish2/dsh-theme-dongxuelian](https://github.com/YUYU-Fish2/dsh-theme-dongxuelian)。仓库为空创建，不自动初始化README/许可，保留项目现有历史。
- GitHub MCP两次因OAuth令牌交换网络超时未完成；随后通过已登录GitHub网页创建，使用已有Git Credential Manager登录推送，没有读取/打印凭据。
- `origin`为上述HTTPS仓库；`git push --set-upstream origin feat/theme-v1`及`git push origin refs/tags/v0.1.0-preview.2`均退出0。首次上传分支和标签解引用均为`44b35db5e1e63e10eb19c8381c975cfbe0742023`，`git ls-remote`实证一致。
- GitHub公共API确认private=false、default_branch=feat/theme-v1。本机main保留原P0/P1位置，没有reset、强推或改写历史。
- 上传前检查全部Git对象路径，没有.research、node_modules、credential/env文件；文本历史的GitHub token/私钥/长API key模式检查无命中，最大blob3477400B。此项是模式检查，非声称对任意秘密的完整证明。
- 上传源代码和预览标签；未创建GitHub Release或发布npm。已验收tgz仍为本地归档，SHA与包内容不变，见[P6记录](P6.md)。本文件及入口更新作为随后文档提交同步，preview标签仍固定在P6验收提交。

## 本机DSH desktop安装

- 目标为当前用户`.dsh/profiles/desktop`，宿主DSH 0.2.1-rc.2。安装前备份package.json、cordis.patch.yml、cordis.yml、pnpm-lock.yaml、pnpm-workspace.yaml共5项到被忽略的`.research/desktop-preview2-backup-20261020-010233/`；没有复制凭据或聊天home，不提交备份。
- 使用最终preview.2 tgz，SHA256 `504d35a783fc0b200a36df15667f5bca83e7f1aa44067dfe724811d3e0e99e57`。官方CLI实际安装命令：

```powershell
$env:DSH_HOME=Join-Path $env:USERPROFILE '.dsh'
& 'E:/dsh/resources/runtime/cli/bin/dsh.cmd' plugin --profile desktop add 'E:/codex/dsh主题开发/release/dsh-theme-dongxuelian-0.1.0-preview.2.tgz' --offline --ignore-scripts
```

- add退出0，downloaded0、安装本包0.1.0-preview.2。安装副本全部13文件哈希与已验收manifest一致。
- 原有五项直接依赖声明及实际版本均保留：dsh-tui 0.16.1、hindsight-coding-agents 0.8.1、better-sidebar 0.28.0、whale-widget 0.4.2、dshmarket 1.66.42。cordis.yml、cordis.patch.yml及pnpm-workspace.yaml字节均未变；官方插件管理在package.json的dsh元数据中追加主题bundle，既有dsh元数据保留；没有改模型或其他插件设置。
- pnpm报告已有market元数据缺time、peer依赖提示并整理传递依赖（+1/-26）；没有忽略其影响，已核对以上五项插件及主配置。没有安装生命周期脚本。
- desktop profile由Electron应用独占管理，额外尝试CLI `--dump-config`被官方拒绝，此命令不是主题加载失败证据。未绕过此限制，也未读取凭据。
- 用户DSH正在运行，没有强制关闭/重启。安装完成；当前原生窗口是否已热加载未目视验证，若尚未显示，正常重启DSH后加载。此前P6的隔离Web和真实loader验证不冒充本次原生窗口验收。

停用/卸载走官方插件管理或`plugin --profile desktop remove dsh-theme-dongxuelian`。如需回滚本次配置，使用上述本地备份逐项核对，只恢复本次受影响文件；不要覆盖后续用户更改或删除整个profile。
