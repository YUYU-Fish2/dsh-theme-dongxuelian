# P11 preview.5安装与GitHub推送

2026-10-20，用户明确要求“做完了就帮我装上dsh，顺便推送github”，授权本次desktop安装与现有仓库推送。沿用DSH限定实现、Codex素材/实窗/审核/命令分工；本次不新增视觉功能，不发npm或GitHub Release，不强制结束用户DSH。

## 归档与检查

- 版本`0.1.0-preview.5`，运行代码与P11已实窗验证实现一致；只更新版本和安装/发行说明。已知侧栏/代码卡差异与首次宽度拖动空程仍见[P11](P11.md)。
- `release/dsh-theme-dongxuelian-0.1.0-preview.5.tgz`：409223B，解包431148B、15文件；SHA256 `d1972360b105d194cb161321c504d10d2084e99cee06d8baa5afe21d7d08c929`。精确[manifest](../../release/preview.5-manifest.json)及[SHA256清单](../../release/SHA256SUMS.txt)入Git，tgz沿用忽略规则留本地。
- npm pack JSON名单与实际tar名单一致，15文件逐字节等于工作树；没有PNG母版、截图、用户参考、测试、缓存或配置。三项WebP共391512B。
- 本轮Node回归18/18、scripts/check.mjs及git diff --check通过。没有修改CSS/Host逻辑，沿用P11窗口证据，不重复扩大测试。

## 官方CLI安装

全新隔离home `.research/package-p11-home` 的theme-pack profile通过官方CLI `add <preview.5.tgz> --offline --ignore-scripts` 安装成功，15文件与manifest匹配。

日常目标是用户默认home的desktop；安装前明确移除终端测试DSH_HOME，备份package.json、cordis.patch.yml、cordis.yml、pnpm-lock.yaml、pnpm-workspace.yaml五配置到`.research/desktop-preview5-backup-20261020-213149/`。索引为`.research/desktop-preview5-backup-location.txt`，未备份凭据或聊天。

官方命令：

```powershell
& 'E:/dsh/resources/runtime/cli/bin/dsh.cmd' plugin --profile desktop add 'E:/codex/dsh主题开发/release/dsh-theme-dongxuelian-0.1.0-preview.5.tgz' --offline --ignore-scripts
```

退出0，从preview.4更新到preview.5。pnpm提示peer依赖和+1/-26，并自动新增Hindsight0.8.2的minimumReleaseAgeExclude；核对唯一策略差异后撤销该新增项，恢复原pnpm-workspace.yaml字节。

最终安装15文件与manifest一致，来自稳定主目录tgz而非源码工作树链接。原五插件的直接声明/实际版本保留：dsh-tui0.16.1、Hindsight0.8.2、better-sidebar0.28.0、whale-widget0.4.2、dshmarket1.66.42。cordis.yml、cordis.patch.yml、pnpm-workspace.yaml及package.json的dsh元数据与备份一致；模型配置保留。锁文件正常更新，未逐一运行传递依赖。

日志和核对报告仅存`.research/desktop-preview5-cli-install.log`与`desktop-preview5-install-result.json`。未强制重启日常窗口，安装成功不能当成原生窗口热加载证据；正常重载/重启后查看。

## GitHub

目标为现有公开仓库[YUYU-Fish2/dsh-theme-dongxuelian](https://github.com/YUYU-Fish2/dsh-theme-dongxuelian)，分支`feat/theme-v1`。上传前远端为`45bb84a4f79d41cbe9133f1b2f0b66bff94d3565`。本次不改写历史、不覆盖旧标签、不发布Release/npm。

`git push origin feat/theme-v1`退出0，远端从`45bb84a4f79d41cbe9133f1b2f0b66bff94d3565`更新至`14321d7382338d8d5d43a90d4905029af3567da3`；随后`git ls-remote origin refs/heads/feat/theme-v1`确认一致。该提交包含preview.5版本、包清单和安装证据，并带上尚未上传的P10/P11实现与记录。本段作为随后文档提交同步，旧标签保持。

上传前核对222处本地文档链接、15项包文件及归档SHA256；增量文本凭据模式检查无命中，Git未跟踪.research。此为模式检查，不声称能证明任意秘密不存在。没有上传配置备份、聊天、日志或用户参考图。
