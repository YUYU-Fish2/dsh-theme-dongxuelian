# P8 抱书彩铅主题氛围实施计划

> 执行者：新会话按 executing-plans 分步执行。用户本轮明确要求“先列进计划、做好规划交接，我新开会话做”，因此本轮仅规划，不导出资源、不改运行代码、不派发DSH、不启动预览或打包。新会话继续后使用既有Codex审核/测试、DSH限定read/write分工，无需重新讨论A-F风格。

**Goal：**围绕用户选定的B系列抱书横幅，做出纸白、灰蓝、靛蓝的彩铅绘本氛围；人物与蓝花应是清楚的场景主视觉，阅读、代码与输入始终清晰。

**Architecture：**复用当前官方Theme token、sidebar.brand.mark与shell.overlay/SceneStyle，以及Host固定Map路由和原事务清理。图片在官方会话容器内容下绘制；宽窗口空态优先左侧阅读/输入、右侧人物，聊天时用不透明阅读区保护内容。深色和停用继续完全释放，不改用户偏好或核心。

**Tech Stack：**原生JS、宿主共享React、官方Theme/Slot/WebServer；Node内置测试、Electron真实loader、CUA真实Web预览；Pillow只做已授权的等比缩放和WebP编码，不新增运行依赖。

## 1. 已锁定的输入、授权与基线

- 唯一主视觉：[reading.png](../../../assets/scenes/b-series/reading.png)，1536×1024、2857637B，SHA256 `387d5998225c850660ffeda5347c1105d61b589109d6608ad33d121621ef1691`。本轮已用Pillow只读比较，用户最新上传图与其解码RGBA像素完全相同；文件哈希不同只是不能据此推断画面不同。无需再次依赖Temp附件。
- 保留B的圆润简化五官、半睁淡蓝眼、银白发/发束、蓝花/白花/深蓝缎带、深蓝中式领口/宽白袖、松散彩铅排线与纸张留白。**不重新抽风格、不换回精细动漫脸、不把人物降成小图标或几乎不可见水印。**
- tea/garden/letter三图留作备选，当前不默认加入运行包、不同时铺满页面、不轮播。最新指令是围绕这一张做氛围，人物与界面融合优先于图片数量。
- 用户已授权本地仅等比缩放和格式编码。不得本地裁切/修脸/去背景/合成/加纹理；确需改画继续imagegen并沿用选定图身份/画法。
- 当前HEAD `b4e6e32`（四图母版）；风格候选 `4abd4f9`；可回退运行基线P7 `f96f68f`。当前运行代码仍是P7冷白雾蓝/两处放大Q背景，**尚未接入抱书图**。
- 当前工作树已有P6未完成的README.md、package.json修改及未跟踪docs/INSTALL.md、docs/RELEASE.md，必须保留。package版本虽为preview.2，但不是已验收发行版；旧preview.1 tgz不交付。
- 本轮未修改client.js/index.js/test/scripts、未导出WebP、未派发DSH、未启动新宿主。历史17项/P7窗口通过不能直接证明P8通过。

## 2. 视觉方案与验收标准

### 主图和留白

宽窗口空态优先采用“左侧内容、右侧抱书人物”：人物脸、发束、书和双手应清楚，标题/输入落在原图左侧留白。主图作为完整场景背景，保持比例，不拉伸。首先用一张图，不新造贴纸、花纹图层或动画。

左侧内容宽度初始目标440–520px，至多约会话列55%，具体值由官方DOM与真实1100/1440px窗口决定；此数值是试排基准，不是已核对的CSS。不能直接给全局聊天/代码宽度套这个限制。800px或大缩放下，优先让脸处于输入上方/侧方可见区域，必要时恢复居中输入，避免硬塞两列导致小字/溢出。窄屏可裁掉背景边缘植物，不能机械cover后切脸或遮书。

聊天态仍保留右侧人物/蓝花，但正文、代码、工具卡、输入区使用足够不透明的纸白阅读面。不能用高层透明人物压字，也不能仅把整张图淡到看不出来。若不透明阅读面遮掉大部分人物，先调整背景位置、阅读面宽度与边缘过渡，再决定是否温和减淡；不重写消息结构。

侧栏默认纸白偏灰蓝，最多复用同图的纸面/边缘少量植物作轻呼应，不再放一张重复头像大水印。24px品牌头像可沿用，暂不扩展为另一套角色贴纸。人物主视觉只在会话空态/聊天出现，插件/设置等页面不得被大图覆盖。

### 配色初稿

| 作用 | 初始值 | 约束 |
| --- | --- | --- |
| 页面/纸底 | #F7F3EB | 接近原图纸面；预览时可按边缘颜色小调 |
| 输入/弹层/阅读面 | #FFFDF8 | 正文与代码前景清楚，必要时不透明 |
| 侧栏/悬停次底 | #EDECE9 | 比主图安静，不另造冷白整块 |
| 正文 | #313A50 | 深灰靛蓝 |
| 次文字 | #5F687C | 需要对所有实际浅底核算普通小字≥4.5:1 |
| 重点/按钮 | #536B9E | 白字≥4.5:1，hover初稿#435882 |
| 轻分隔 | #D4D7DE | 非唯一控件边界 |
| 功能边界 | #7D879B | 与实际控件底≥3:1，否则加深 |
| 选中/消息浅底 | #DDE4EF / #E4E5EE | 深色文字；不默认配白字 |

全部是**待计算、待实窗**的设计值，不能直接抄成“已验证”。保留错误/警告/成功语义、代码语法色、系统/等宽字体、原操作密度；不新增设置/粒子/动画。

## 3. 文件职责与公共URL契约

| 文件 | 新会话要做的事 |
| --- | --- |
| assets/scenes/b-series/reading.png | 选定母版，只读，不覆盖 |
| assets/scenes/web/reading.webp | 新增唯一场景发布导出 |
| assets/scenes/README.md | 新增尺寸/字节/编码参数/哈希/来源/使用范围 |
| client.js | 调色、改SceneStyle；沿用原apply/sync/事务，CSS仅锚官方容器/公开属性 |
| index.js | 固定路由表由avatar+sidebar-character改为avatar+reading；其余请求/释放逻辑复用 |
| test/assets.test.mjs | 新图GET/HEAD/预算、旧图撤出白名单、穿越/停用等回归 |
| test/slots.test.mjs | 更新场景资源契约，保留生命周期断言，补Scene owner消失恢复 |
| test/theme.test.mjs | 更新现有三项颜色契约，不为每色堆镜像测试 |
| scripts/check.mjs / package.json | 精确发布白名单与独立资源预算，不打包母版/候选/缓存 |
| docs/coordination/P8-A-task.md | 完成准备/RED后写给DSH的限定任务单 |
| docs/validation/P8.md | 写本次实测与限制，不能复用旧截图充当新图效果 |
| README/INSTALL/RELEASE、HANDOFF、总计划、看板 | P8/P6各自验证后按事实更新 |

计划中的最终公共URL只保留两项：

```text
/dongxuelian-theme/assets/avatar.webp  -> assets/characters/web/avatar.webp
/dongxuelian-theme/assets/reading.webp -> assets/scenes/web/reading.webp
```

旧sidebar-character.webp保留源码文件供历史回看，但撤出运行路由和package.files；不删除母版、不reset历史。所有图仍是独立资源，不能内联base64或开放任意路径读取。

## 4. 执行任务与检查点

### Task 1：读取基线并导出选定资源（Codex）

- [ ] 读HANDOFF→本计划→WORKBOARD与AGENTS，运行git status/log，保留上述P6草稿。检查当前CLI/DSH通道，不读凭据、不改模型/权限。
- [ ] 重新核对reading.png哈希。用已授权的等比缩放/编码导出1280×853 WebP初稿，quality90、method6；PNG不变，不处理其他三图。

```powershell
New-Item -ItemType Directory -Path 'assets/scenes/web' -Force | Out-Null
& 'E:/python/python.exe' -c "from PIL import Image; im=Image.open('assets/scenes/b-series/reading.png'); im.thumbnail((1280,1280),Image.Resampling.LANCZOS); im.save('assets/scenes/web/reading.webp','WEBP',quality=90,method=6)"
Get-FileHash -Algorithm SHA256 -LiteralPath 'assets/scenes/web/reading.webp'
```

- [ ] 目视对照原图，检查脸、蓝花、书、袖子和彩铅排线。目标场景≤550000B、头像≤40000B；超预算优先在quality86–90间编码比较或等比缩到1152px，不裁切/修画，不以预算换明显糊脸。记录实际尺寸/字节/参数，不承诺计划值就是输出值。
- [ ] 查看真实0.2.1-rc.2空态DOM与官方源码局部，确认可把空态内容移到左侧的公开锚点。已有main根为[data-slot="main.conversation"] > div[data-phase]、sidebar根为[data-slot="sidebar"] > div:first-child；**空态内部栈具体CSS锚点尚未确认**，不能猜hash类名或任意nth-child。查.research/p3-dsh-client-ui-conversation-lib-client.js对应hero/renderSlot片段即可，不重扫全盘。

### Task 2：新资源契约先RED（Codex）

- [ ] 在test/assets.test.mjs现有fixture旁先新增以下直接回归，确认旧实现返回404而失败；不要先改index.js。

```js
test('抱书场景支持GET和HEAD，响应与发布文件一致', async (t) => {
  const host = await fixture(t);
  const bytes = readFileSync(new URL('../assets/scenes/web/reading.webp', import.meta.url));
  assert.ok(bytes.length < 550_000);
  const response = await host.fetch(`${prefix}/reading.webp?v=p8`);
  assert.equal(response.status, 200);
  assert.equal(response.headers['content-type'], 'image/webp');
  assert.deepEqual(response.body, bytes);
  const head = await host.fetch(`${prefix}/reading.webp`, 'HEAD');
  assert.equal(head.status, 200);
  assert.equal(Number(head.headers['content-length']), bytes.length);
  assert.equal(head.body.length, 0);
});
```

- [ ] 加一项旧sidebar-character.webp应404，并将既有两文件循环改成avatar/reading各自磁盘URL和预算，保留405、encoded traversal、Map原型键、停用后404等真实边界。停用检查覆盖两个URL。
- [ ] 更新Slot场景资源断言为reading.webp，并明确不再引用sidebar-character.webp；保留两个Slot而非增加第三个装饰层。把现有owner消失/重声明用例分别覆盖sidebar与shell.overlay，确认等待者和条目不会残留。
- [ ] 执行node --test test/assets.test.mjs test/slots.test.mjs，记录预期失败原因；CSS排版与小范围调色用预览验证，不写只镜像字符串的样式测试。

### Task 3：限定DSH接入（DSH实现，Codex审核）

- [ ] 在P8-A任务单中只允许DSH改index.js、client.js、package.json、docs/validation/P8-DSH-NOTES.md。素材/测试由Codex处理；禁止shell/Git/profile/core/权限/模型/依赖安装/派生agent。
- [ ] index.js仅改FILES：

```js
const FILES = new Map([
  [`${PREFIX}/avatar.webp`, new URL('./assets/characters/web/avatar.webp', import.meta.url)],
  [`${PREFIX}/reading.webp`, new URL('./assets/scenes/web/reading.webp', import.meta.url)],
])
```

- [ ] client继续使用SceneStyle在shell.overlay挂style；主图在内容下，伪元素pointer-events:none、负层级。复用当前事务、微任务合并、读取最新scheme/stopped与逆序释放，不重构apply主循环。没有新库需求，属于现有路由/样式的局部扩展，不为其引入框架。
- [ ] 按已核对的官方DOM做空态左排/右图、聊天不透明阅读面及窄屏收敛；不能直接替换root或整段消息组件，不能用body/html全局布局补丁或hash类名抢优先级。先保留函数/字体/代码行为。
- [ ] package.files新增assets/scenes/web/reading.webp与assets/scenes/README.md，撤出旧sidebar-character.webp；其他未完成P6字段不能回退。scripts/check资源表同步改为头像/场景的独立预算。
- [ ] 用新的本地日志名调用，不覆盖历史、不打印密钥；沿用现有worker patch由DSH自己解析凭据：

```powershell
Get-Content -LiteralPath 'docs/coordination/P8-A-task.md' -Raw |
  & 'E:/dsh/resources/runtime/cli/bin/dsh.cmd' headless --patch '.research/dsh-worker.patch.yml' --json - `
    1> '.research/dsh-p8-a.events.jsonl' 2> '.research/dsh-p8-a.stderr.log'
```

- [ ] Codex读实际diff/退出码与文件，再跑测试；DSH final只作交付信号。通道失败时记录具体错误，继续可独立的导出/预览准备，不重复修ACL或改密钥。

### Task 4：真实预览和视觉迭代（Codex）

- [ ] 新隔离宿主启动，认证URL只本地读取后用于浏览器，不打印/提交。可复用test-home，但不能碰日常desktop profile。

```powershell
$env:DSH_HOME='E:/codex/dsh主题开发/.research/test-home'
& 'E:/dsh/resources/runtime/cli/bin/dsh.cmd' --profile theme-test --patch '.research/p3-test-host.patch.yml' --port 0 --no-open *> '.research/p8-web.log'
```

- [ ] 区分该patch会创建合成夹具与P5既有真实模型历史；P8不必重新花费模型请求验证相同聊天内容，使用已有长代码/read工具记录即可，但不得称“本轮新真实对话通过”。
- [ ] 保存1100和1440空态截图：脸/蓝花/书可读、输入落留白、不遮标题。800下脸不被cover裁掉、无整页横溢。对照母版确认不是又一张小图标或低透明水印。
- [ ] 正常聊天/中英文/长代码横滚/高亮/read工具卡/多行输入、附件菜单、更多菜单、侧栏收放与长列表、插件/设置页面无大图污染。
- [ ] 800/1100/1440 × CSSzoom100/125/150九组检查；说明是CSS模拟，不写成系统DPI通过。直接检查document.scrollWidth、控件点击、pre内部横滚与图片加载状态，不只看截图。
- [ ] 浅→深→浅、系统媒体模拟、官方插件停用/重启用：style1→0→1、品牌头像与背景正确释放、原主题恢复，Host停用reading/avatar均404。恢复viewport、CSSzoom与媒体模拟，结束关闭自己标签/自己的隔离进程。
- [ ] 配色用WCAG公式算实际纯色，正文/次文字≥4.5:1，关键边界≥3:1；再看带图真实窗口，确保阅读面足够不透明。若无法兼顾人物与正文，修改布局/阅读面，不靠极淡图片掩盖。

### Task 5：P8验证、审核、记录和独立提交

- [ ] npm test、npm run check、真实官方loader（React/服务适配与窗口结论分开）：

```powershell
npm test
npm run check
$env:ELECTRON_RUN_AS_NODE='1'
& 'E:/dsh/DeepSeek Harness.exe' scripts/runtime-smoke.mjs | Out-String
& 'C:/Users/sjtxd/Documents/Codex/tools/jscpd/node_modules/jscpd-windows-x64-msvc/bin/jscpd.exe' 'E:/codex/dsh主题开发' --format javascript,typescript --ignore '**/.research/**,**/.git/**,**/node_modules/**,**/release/**' --reporters console,json --output 'E:/codex/dsh主题开发/.research/jscpd-p8-final' --no-colors --no-tips
git diff --check
```

- [ ] 查重必须明确本项目；MCP索引未知时用上述CLI。根据真实重复行为决定复用，不为了行数重构。独立只读审核重点看新CSS层级、路由/白名单/资源预算、生命周期与包遗漏，不把理论风险冒充已复现缺陷。
- [ ] docs/validation/P8.md写RED→GREEN、导出哈希/字节、命令退出码、截图、尺寸矩阵与限制。HANDOFF/总计划/WORKBOARD更新为P8实际结果，旧审美失败/P7历史不冒充P8。
- [ ] 独立提交P8运行改动和证据；提交前点名检查已有P6草稿，不能混入无关修改或把.research打包。若视觉还在迭代，明确记录，不写完成标签。

### Task 6：P8成立后才继续P6预览交付

- [ ] 重写README/INSTALL/RELEASE的旧冷白/玫瑰/两小头像/旧图片体积，保留preview与原生桌面/系统DPI/第三方插件未测边界。明确正式采用抱书图，其他三母版不打包。
- [ ] npm pack --dry-run --json核对精确白名单：只有入口/patch/最终WebP/安装许可文档；排除PNG、style-studies、.research、测试、凭据/聊天。
- [ ] npm pack --pack-destination release生成新归档，列manifest、尺寸和SHA256；旧preview.1哈希作废，不重复交旧包。
- [ ] 用新.research/package-p8-home、官方Web模板和独立theme-pack profile从tgz离线add，核对安装client/index/reading哈希；不能用工作树link替代。复验窗口/停用/卸载/重启，确认原品牌/背景恢复、资源404。
- [ ] 写P6验证和最终交接，独立提交/preview标签；不自动推送、发布、装到日常profile或结束用户真实DSH。

## 5. 新会话第一条可直接使用的指令

> 先读docs/HANDOFF.md，再读docs/superpowers/plans/2026-10-20-reading-atmosphere.md和WORKBOARD。用户已选assets/scenes/b-series/reading.png作为唯一主视觉，B彩铅绘本画法不再发散；按计划从Task 1继续，Codex审核/导出/测试，DSH限定read/write。保留P6草稿，不用旧P7/旧包当新效果；先给真实空态与聊天预览再收尾P8/P6。无需再次询问风格选择，关键冲突或不可撤销操作才提问。
