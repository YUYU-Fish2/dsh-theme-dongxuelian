# P11 按示例恢复整页纸面 Implementation Plan

> 后续授权：用户明确要求安装本机DSH并推送GitHub；已按preview.5接续归档/安装，详见[部署](../../validation/P11-DEPLOYMENT.md)。以下不安装/推送限制为原实验阶段边界。

> 使用executing-plans，沿用DSH限定read/write、Codex素材/命令/实窗分工。当前交付范围是可审阅隔离预览；不安装、不推送、不发布，待真实视觉反馈后确定preview.5。

**Goal:** 让真实DSH在用户示例相同视口呈现统一纸面、自然插画边缘和清楚的聊天内容。

**Architecture:** 保留P9母版，新增独立纸纹；复用现有官方槽、负层级CSS、固定Map与生命周期。撤掉遮挡原图的宽列实色阅读板和P10桥，按真实构图调整宽列阅读几何。

**Tech Stack:** 原生JS/CSS、官方Theme/Slot、独立WebP、Node内置测试。

## Task 1 素材与基线

- [x] 读母版与示例，纠正“必须重画人物”的判断；生成纸纹并编码为56518B WebP。
- [x] 在1625×968隔离Web确认官方sidebar直接子容器、conversation根/标题/内容标记；不使用hash类名。
- [x] 将paper加入既有Host测试数组和80KB检查预算；先运行assets测试取得RED。

## Task 2 DSH限定实现

- [x] DSH按coordination/P11-A-task.md修改client.js、index.js、package文件白名单并写P11-DSH-NOTES；不改版本/测试/素材/profile/模型/核心。
- [x] 复用Map新增paper.webp，保留GET/HEAD及严格URL边界；白名单新增paper与来源说明。
- [x] CSS使用已核对的[data-slot="sidebar"] > div及[data-slot="main.conversation"] > div[data-phase]，纸纹repeat/640px；共享会话纸面，不改用户侧栏宽度。
- [x] 宽列重设完整场景背景基准，scroll透明、撤掉P10桥；按示例实窗校正人物/阅读比例，而非固定P9几何。

## Task 3 Codex实窗与记录

- [x] 同尺寸1625×968先看纸面/花枝/人物/文字关系；再看宽2331×1388和小1265×817。出现明显不符就修正，不以测试代替视觉。
- [x] 运行现有18项回归和check；按变化范围检查纸纹GET/HEAD/停用释放。无新公共算法或依赖，无需外部库或额外抽象。
- [x] 菜单、输入焦点、滚动、浅深浅与官方停启必要检查；不发送模型请求。
- [x] 记录实际截图、参数、未测项和与示例尚存差异；同步HANDOFF/总计划/看板并独立本地提交。
- [x] 恢复隔离profile稳定源码路径、关闭临时宿主/标签；不更改日常preview.4安装。

## 实际修订

Codex已用真实浏览器证实根伪元素可以查询自身origin容器，删除DSH首稿media代理；宽列scroll恢复全宽，正文/输入座各自定位。阅读座max(768px,stage×.56)，正文最高960px，输入比正文宽160px。主文字#2C4268，纸纹层增加35%浅纸色覆层降低颗粒对比。限定reviewer两项拖柄风险已修正；首次拖动空程作为已知限制记录。原型未打包/安装，视觉仍待用户反馈。
