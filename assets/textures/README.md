# 统一纸面纹理

2026-10-20，imagegen参考本项目P9母版空白纸面生成，无人物、花枝、文字或UI。用于匹配用户示例的整页纸面；人物和场景继续复用P9素材。

- 母版paper.png：1254×1254、RGB，SHA256 `99c8dacdfe7ce52750eeac8eceb8a9b558f199e7fae366c65b88551382a74039`。
- 发布web/paper.webp：原尺寸、Pillow quality82/method6、56518B，SHA256 `93a7c8708e5678b2a57bb29b24d8658700b349e680d6f93b5f437c4d491bef86`。仅格式编码，无本地修画。
- CSS以640px平铺并叠35%淡纸色降低颗粒对比；真实浏览器目视未见明显接线，不声称数学无缝。
- PNG母版及用户示例不进入运行包。纹理仅在浅色SceneStyle激活时使用，深色/停用释放。自preview.5纳入安装包，部署状态见源码docs/validation/P11-DEPLOYMENT.md。
