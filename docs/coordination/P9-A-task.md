# P9-A 宽屏空态共同构图

工作目录C:/Users/sjtxd/.codex/worktrees/wide-window/dsh主题开发。只用read/write/edit，不用shell、Git、子agent或网络，不读凭据/日志/profile，不安装、不改权限。

允许修改：client.js的SCENE_CSS；新增docs/validation/P9-DSH-NOTES.md。禁止修改其他文件、测试、图片、版本、生命周期、Host和模型配置。

用户已批准大窗口构图提案并要求开始。先读本任务、client.js和docs/superpowers/plans/2026-10-20-wide-window-composition.md，不重做调研。Codex负责真实UI/测试/命令和最终调整。

当前用户满意1265×817的小窗口（内容列约985px），2559×1395下内容列2279px而输入只有500px，靠左48px、图片贴最右，宽屏失衡已复现。

仅为空态hero添加@container dxl-reading (min-width:1100px)覆盖：
- 继续官方根 [data-slot="main.conversation"] > div[data-phase="hero"] 和其子[data-conversation-content]::before，不改DOM、不用hash类名。
- 输入栈仍是[data-chain-overlay-fallback="conversation.composer"] > div：margin-inline:max(48px,calc((100cqi - 1280px)/2 + 48px)) auto；--dsh-composer-card-max-width:clamp(500px,calc(500px + (100cqi - 1100px)/4),560px)。width/max-width等原逻辑复用。
- 图片伪元素脱离全列inset:0，改inset:auto；top/left:50%；right/bottom:auto；height:min(853px,calc(100% - 64px),calc(100cqi * 853 / 1280))；width:auto；aspect-ratio:1280 / 853；transform:translate(-50%,-50%)；background-position:center；background-size:100% 100%。这样比例不变、图片盒中心是内容列中心，四边渐隐才能随图片本身移动。
- mask-image使用横/竖两条linear-gradient，四边约64px纸面渐隐，中部黑色，mask-composite:intersect。不要降低整图opacity，不改图片文件；Codex会实测盒尺寸和人物可见度，必要时微调。
- <=1100px的原规则、所有active聊天规则先保留。保留原26token、头像和事务释放；不新增JS逻辑、库或设置。

说明实际修改、边界和未测项目。final不声称跑过测试或预览，不自行提交。若CSS数值在浏览器不兼容，如实说明，不扩大范围。不要读取用户生成图，它含个人会话；实现只用现有reading.webp。
