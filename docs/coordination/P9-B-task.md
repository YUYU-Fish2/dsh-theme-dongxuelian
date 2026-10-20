# P9-B 按已批准预览收紧首页与聊天构图

工作区C:/Users/sjtxd/.codex/worktrees/wide-window/dsh主题开发。用户最新要求：成品按之前生成预览，明确授权重新生成场景，聊天中间不应空那么大一片，并要求继续与DSH协同、只做正常使用必要验证。此前只hero的1280px构图首稿不满足最新目标，须修订，不保留过小场景占比。

只用read/write/edit。允许修改client.js中的SCENE_CSS，以及新增docs/validation/P9-B-DSH-NOTES.md。不要改图片、测试、其他文档、token/生命周期/Host、profile/模型/权限，不用shell/Git/网络/子agent。Codex负责素材、实窗、验收和安装。

Codex已用imagegen根据用户批准的预览重新生成assets/scenes/p9/reading.png，并等比原尺寸编码覆盖web/reading.webp。新图1536×1024，原比例3/2；请用aspect-ratio:3 / 2，不裁切。旧P8母版保留历史。人物约位于图的右侧55–95%，左侧留白供内容。场景应大得多，不能又把人物贴最右或靠拉长空白补位置。

先读client.js、本任务；不要重新研究/外搜。仅改现有P9宽列覆盖(@container dxl-reading (min-width:1100px))：

1. 宽屏共同构图区上限1920px（原1280过小）。hero输入宽度从500平滑增加到880px，建议clamp(500px,calc(500px + (100cqi - 1100px) * .34),880px)。margin-inline:calc(clamp(24px,4cqi,48px) + max(0px,(100cqi - 1920px)/2)) auto。宽屏输入不能继续500/560px一小块；不要改变全局字体。
2. hero图片仍使用独立等比例伪元素、负层级和pointer-events:none。right从1100列宽时的-190px平滑变到1920列宽时0，超过1920则是共同构图区右外边距：calc(max(0px,(100cqi - 1920px)/2) - clamp(0px,(1920px - 100cqi)*190/820,190px))。height:min(clamp(800px,calc(800px + (100cqi - 1100px)*480/820),1280px),calc(100% - clamp(0px,(100cqi - 1100px)*64/820,64px)))；aspect-ratio:3 / 2；width:auto；inset:auto；top:50%；transform:translateY(-50%)；background-position:center；background-size:100%100%。这样保留小窗口几何并随宽屏放大到接近预览占比。
3. 宽屏active必须同步收拢，不再留下原scroll占几乎整列、正文却固定760px居中的空白。active内容设--dxl-scene-gutter:clamp(340px,calc(100cqi * .32),620px)；--dsh-chat-content-width:min(var(--dsh-chat-user-width,1040px),calc(min(100cqi,1920px) - var(--dxl-scene-gutter) - 96px))；--dsh-composer-card-max-width:calc(var(--dsh-chat-content-width) + 32px)。尊重用户明确的chat-user-width，但默认不额外锁死760。
4. active的[data-conversation-scroll]：width:calc(min(100cqi,1920px) - var(--dxl-scene-gutter))；margin-left:max(0px,calc((100cqi - 1920px)/2))；margin-right:0；min-width:0；原纸白阅读面linear-gradient保持。正文/输入跟随官方堆栈居中在这个有限阅读区中，不能再相对全屏大空白居中。不改消息DOM/代码内部横滚；不把整块文字铺到人物上。
5. 宽屏active图片复用hero等比大绘图盒，但右偏移从1100时-150px开始(以150/820代替190/820)，初始高度720px逐步到1280px(560/820)；内容高度减64的限制同hero。hero和active可共用一条宽列伪元素基础选择器，再分别覆盖其height/right，以减少复制。仍用局部64px四边mask，避免明显矩形接缝。不要改<=1100px各窄列规则，宽列限制不能泄漏到小分栏。

说明当前参数是Codex提供的试排，需其真实窗口调整；不要声称已验证。没有新JS/库/设置/动画。若定位必须修改其他核心或使用hash类，先在说明写风险，停止该扩展。只交付允许文件，不提交。
