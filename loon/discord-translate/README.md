# Discord消息翻译

给 Discord 消息列表追加译文的 Loon 插件。默认翻译为简体中文，显示方式为“追加译文”，不覆盖原文。

## 订阅链接

```text
https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/discord-translate/Discord-translate.plugin
```

## 功能

- 翻译 Discord 频道历史消息接口
- 翻译 Discord 搜索消息接口
- 支持简体中文、繁体中文、英文、日文、韩文
- 支持追加译文或替换原文
- 支持翻译嵌入卡片标题和描述
- 支持每批翻译数量限制

## 注意

需要在 Loon 中开启 MITM 并信任证书。Discord App 的实时新消息通常来自 Gateway/WebSocket，Loon 响应脚本不一定能改到；打开频道时通过消息历史接口加载出来的内容更容易生效。

默认使用 Google Translate 公共接口，消息文本会发送到翻译服务。如果介意隐私，请不要启用这个插件。
