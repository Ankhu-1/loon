# Loon 插件订阅

这个目录收集按应用拆分的 Loon 去广告和界面精简插件。插件名称和介绍均为中文；除特别说明外，每个应用建议只启用对应的一个插件。

## 使用方式

1. 打开 Loon。
2. 进入 `插件`。
3. 选择从 URL 添加插件。
4. 复制下方 Raw 订阅链接添加。

## 插件列表

| 插件 | 说明 | 订阅链接 | 备注 |
| --- | --- | --- | --- |
| 高德地图核心精简 | 去除高德地图开屏、活动、会员、优惠券、任务、皮肤语音包和营销消息，保留地图、导航、搜索、路线、周边和天气。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE%E6%A0%B8%E5%BF%83%E7%B2%BE%E7%AE%80.lpx) | 增强版，不建议与高德地图开屏广告拦截同时启用。 |
| 高德地图开屏广告拦截 | 拦截高德地图启动开屏广告配置，尽量不影响地图、定位、搜索和导航功能。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE%E5%BC%80%E5%B1%8F%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA.lpx) | 轻量版，已被高德地图核心精简覆盖。 |
| 哔哩哔哩品牌开屏拦截 | 拦截哔哩哔哩品牌开屏广告列表，不改动正常视频、动态和直播接口。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%93%81%E7%89%8C%E5%BC%80%E5%B1%8F%E6%8B%A6%E6%88%AA.lpx) | 单独开屏规则。 |
| 哔哩哔哩会员广告上报拦截 | 拦截哔哩哔哩会员广告物料上报接口，作为现有 B 站去广告规则的补充。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%BC%9A%E5%91%98%E5%B9%BF%E5%91%8A%E4%B8%8A%E6%8A%A5%E6%8B%A6%E6%88%AA.lpx) | 补充上报规则。 |
| BOSS直聘开屏广告拦截 | 拦截 BOSS 直聘启动广告接口，保留职位搜索、聊天和投递相关功能。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/BOSS%E7%9B%B4%E8%81%98%E5%BC%80%E5%B1%8F%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA.lpx) | 独立插件。 |
| 浏览器网页广告拦截 | 拦截浏览器网页中的常见广告、跟踪和弹窗资源，作为应用专用插件之外的网页补充规则。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BD%91%E9%A1%B5%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA.lpx) | 网页通用规则。 |
| 掌上生活广告预缓存拦截 | 拦截掌上生活广告预缓存接口，保留登录、账单、支付和基础服务接口。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E6%8E%8C%E4%B8%8A%E7%94%9F%E6%B4%BB%E5%B9%BF%E5%91%8A%E9%A2%84%E7%BC%93%E5%AD%98%E6%8B%A6%E6%88%AA.lpx) | 独立插件。 |
| Discord推广内容拦截 | 清理 Discord Nitro 推广、收藏品营销和任务广告决策返回，保留聊天、服务器和通知功能。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/Discord%E6%8E%A8%E5%B9%BF%E5%86%85%E5%AE%B9%E6%8B%A6%E6%88%AA.lpx) | 独立插件。 |
| Discord消息翻译 | 给 Discord 消息列表追加译文，支持简体中文、繁体中文、英文、日文、韩文，可选择追加译文或替换原文。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/discord-translate/Discord-translate.plugin) | 需要 MITM；实时新消息可能不生效。 |
| Google本机转化广告上报拦截 | 拦截 Google 本机广告转化上报请求，减少网页和应用广告追踪。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/Google%E6%9C%AC%E6%9C%BA%E8%BD%AC%E5%8C%96%E5%B9%BF%E5%91%8A%E4%B8%8A%E6%8A%A5%E6%8B%A6%E6%88%AA.lpx) | 补充规则。 |
| Investing广告清理 | 清理 Investing 应用促销横幅、广告位配置、Outbrain 信息流广告和 VAST 广告链接，不处理 moomoo/Futu。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/Investing%E5%B9%BF%E5%91%8A%E6%B8%85%E7%90%86.lpx) | 独立插件。 |
| 京东开屏广告增强拦截 | 拦截京东开屏图片素材，并下调启动广告和基础配置中的广告开关。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E4%BA%AC%E4%B8%9C%E5%BC%80%E5%B1%8F%E5%B9%BF%E5%91%8A%E5%A2%9E%E5%BC%BA%E6%8B%A6%E6%88%AA.lpx) | 增强版，不建议与京东开屏素材拦截同时启用。 |
| 京东开屏素材拦截 | 拦截抓包中发现的京东 iOS 开屏竖图素材，不使用脚本。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E4%BA%AC%E4%B8%9C%E5%BC%80%E5%B1%8F%E7%B4%A0%E6%9D%90%E6%8B%A6%E6%88%AA.lpx) | 轻量版，已被京东开屏广告增强拦截覆盖。 |
| 拼多多全局弹窗拦截 | 清空拼多多全局弹窗接口返回，尽量不影响商品、订单和支付功能。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%85%A8%E5%B1%80%E5%BC%B9%E7%AA%97%E6%8B%A6%E6%88%AA.lpx) | 独立插件。 |
| QQ聊天核心精简 | 保留 QQ 原本聊天功能，拦截 QQ 空间广告、访客装饰物料、会员装扮补丁和游戏中心物料。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/QQ%E8%81%8A%E5%A4%A9%E6%A0%B8%E5%BF%83%E7%B2%BE%E7%AE%80.lpx) | 独立插件。 |
| 铁路12306广告拦截 | 拦截铁路 12306 首页广告初始化、运营广告类型和广告域名，保留车票查询、下单和推送功能。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E9%93%81%E8%B7%AF12306%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA.lpx) | 独立插件。 |
| 淘宝闲鱼开屏广告拦截 | 拦截淘宝多广告接口和闲鱼开屏广告接口，保留商品浏览、搜索和交易相关接口。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E6%B7%98%E5%AE%9D%E9%97%B2%E9%B1%BC%E5%BC%80%E5%B1%8F%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA.lpx) | 独立插件。 |
| 淘宝天猫贷款活动清理 | 清理淘宝、天猫贷款、金融、活动弹窗、营销推送和浮层，保留购物、订单和支付相关接口。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E8%B4%B7%E6%AC%BE%E6%B4%BB%E5%8A%A8%E6%B8%85%E7%90%86.lpx) | 增强版。 |
| 腾讯广告SDK启动拦截 | 拦截腾讯广告 SDK 启动接口，作为多应用广告请求的补充拦截。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E8%85%BE%E8%AE%AF%E5%B9%BF%E5%91%8ASDK%E5%90%AF%E5%8A%A8%E6%8B%A6%E6%88%AA.lpx) | 补充规则。 |
| 微信公众号推广拦截 | 拦截微信公众平台本地生活推广页面请求，保留微信聊天和公众号基础阅读功能。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%8E%A8%E5%B9%BF%E6%8B%A6%E6%88%AA.lpx) | 独立插件。 |
| 小红书开屏广告拦截 | 拦截小红书开屏、全屏广告资源，并清理开屏配置中的广告内容。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%BC%80%E5%B1%8F%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA.lpx) | 独立插件。 |
| 雪球推广内容拦截 | 清理雪球远程推广配置和推广曝光上报，不影响行情、资讯、社区和交易相关接口。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E9%9B%AA%E7%90%83%E6%8E%A8%E5%B9%BF%E5%86%85%E5%AE%B9%E6%8B%A6%E6%88%AA.lpx) | 独立插件。 |
| 广告补充拦截合集 | 补充拦截 B 站品牌开屏、高德开屏、拼多多弹窗、Google 转化上报和腾讯广告 SDK 启动请求，不包含 moomoo/Futu。 | [Raw](https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/%E5%B9%BF%E5%91%8A%E8%A1%A5%E5%85%85%E6%8B%A6%E6%88%AA%E5%90%88%E9%9B%86.lpx) | 合集版，和单应用插件有重叠，通常不用同时启用。 |

## 注意

- `广告补充拦截合集` 与部分单应用插件有重叠，通常选择单应用插件即可。
- `高德地图核心精简` 已覆盖 `高德地图开屏广告拦截`。
- `京东开屏广告增强拦截` 已覆盖 `京东开屏素材拦截`。
- 插件启用后建议强制关闭对应 App 再重新打开；部分 App 会缓存配置，必要时清理缓存。
