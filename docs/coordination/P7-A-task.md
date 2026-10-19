# P7-A 冷白雾蓝人物背景

只用 read/write；禁止 shell、agent、Git、改权限/profile/核心/模型、安装依赖。仅可修改 client.js 与新增 docs/validation/P7-DSH-NOTES.md。不要改测试/其他文件。Codex已跑新Slot测试RED（4失败1通过），负责运行、素材、审核与窗口。

先读本文件、docs/design/P7-WINTER-SCENE.md、client.js、test/slots.test.mjs。用户明确要求“人物背景适量，不能只有几个图标”，并授权自行搭配；不重复调研。

1. 保留26个token，按设计文档色板替换。保留Theme生命周期微任务/事务/最新scheme机制，不改用户偏好。
2. 保留 sidebar.brand.mark 的24px Avatar。移除 HEADER_UTILITIES 注册；第二项改 shell.overlay 独占id OWNER、order100。组件 SceneStyle 返回 createElement('style', {'data-dxl-scene':''}, SCENE_CSS)。CSS字串存在本文件；不新增依赖。style不显示占位或可聚焦控件，停止时随槽卸载，不直接改DOM。
3. 已从真实0.2.1-rc.2 DOM核对：[data-slot="main.conversation"]是display:contents，直接div根有data-phase="active"或"hero"；[data-slot="sidebar"]同样直接div根。不要使用hash类名。shell.overlay祖先z-index20，故绝不能在该槽直接叠前景人物，只承载style。
4. 通过这两个官方容器直接根的::before或::after绘背景：根position:relative、isolation:isolate；伪元素content:''、absolute inset:0、z-index:-1、pointer-events:none、background-repeat:no-repeat。不改布局尺寸/字体/overflow，不遮操作，背景图片在子内容下。用自有样式选择器精准限定这两个根与伪元素，无全局body/html布局重写。
5. 聊天主图sidebar-character.webp，右下构图，初始背景尺寸360px、right -25px bottom 90px，opacity约.24；hero空状态可提升至.65，保持中心输入与标题干净。侧栏背景avatar.webp约210px，中心偏下bottom75px，opacity约.13；它是轻呼应而非第二主角。sidebar根或祖先data-sidebar-collapsed时隐藏其伪元素（官方根塌缩由上级data-sidebar-collapsed控制），宽度<=900时主图收敛到260px/opacity.16、侧栏180px。不重复平铺、没有动画/新设置。数值Codex会按实际截图调整。
6. 头像与SceneStyle仍是两个Slot controller，浅色共同拥有。第二注册失败回滚主题与第一槽；同步停用/深色/owner消失释放。不要改原sync主循环。

回报文件、实现选择、风险和未验证项。不要声称已运行测试或窗口。不要读凭据/历史大日志。
