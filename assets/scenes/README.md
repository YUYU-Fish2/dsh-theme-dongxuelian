# 抱书彩铅场景资源

用户已选B彩铅绘本画法和`b-series/reading.png`抱书横幅，作为P8唯一主视觉。图片由imagegen按用户选定的B参考另绘，身份与来源见源码仓库的`assets/scenes/b-series/README.md`；不复制外部画师图片入包，不声明角色官方授权。

## 发布导出

| 文件 | 尺寸 | 字节 | 编码 |
| --- | --- | ---: | --- |
| `web/reading.webp` | 1280×853 | 222484 | Pillow / LANCZOS等比缩小、WebP quality90、method6 |

2026-10-20在用户已授权的“仅等比缩放与格式编码”范围内导出。没有裁切、修脸、合成、去背景或添加纹理，PNG母版未覆盖。导出保留人物脸、蓝花、书、双手与彩铅排线，已目视检查。

- 母版`b-series/reading.png`：1536×1024、2857637B，SHA256 `387d5998225c850660ffeda5347c1105d61b589109d6608ad33d121621ef1691`。
- 发布导出SHA256：`a0fc8241566b07187964719cba5caed72447655809456d1c126dccbe227a9592`。
- 单项预算550000B；与保留的头像26864B合计249348B。

发布包仅带本说明和`web/reading.webp`；四幅PNG母版、其他三个备选场景及风格候选板不打包。公共URL为`/dongxuelian-theme/assets/reading.webp`，通过Host固定白名单提供。

主图只用于浅色会话空态/聊天内容下方；侧栏靠颜色轻呼应。深色或停用释放场景样式，不写用户主题偏好，不作为覆盖插件/设置页面的前景壁纸。安装与实际验证限制见包内`docs/INSTALL.md`、`docs/RELEASE.md`；源码阶段证据见`docs/validation/P8.md`。
