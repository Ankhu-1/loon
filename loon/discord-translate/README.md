# Discord消息翻译

给 Discord 消息列表追加译文的 Loon 插件。默认使用 DeepSeek API，显示方式为“追加译文”，不覆盖原文。

## 订阅链接

```text
https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/discord-translate/Discord-translate.plugin
```

如果 GitHub raw 对旧文件名有缓存，可以使用 DeepSeek 专用新路径：

```text
https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/discord-translate/Discord-translate-deepseek.plugin
```

## DeepSeek API Key

仓库里不会保存你的 API Key。插件文件只提供一个空的本地输入项：

```ini
dt_deepseek_api_key = input,""
```

安装插件后，在 Loon 插件设置里填写自己的 DeepSeek API Key 即可。脚本不会把 Key 写到日志、通知或 GitHub 文件里。

默认模型是 `deepseek-v4-flash`，也可以在插件设置里改成 `deepseek-v4-pro`。

Loon 本地输入框是否掩码显示取决于 Loon 自身实现；公开 GitHub 仓库不会包含你的 Key，也不要分享带有本地插件设置页的截图。

## 功能

- 翻译 Discord 频道历史消息接口
- 翻译 Discord 搜索消息接口
- 默认使用 DeepSeek API
- 可切换回 Google 公共接口
- 支持简体中文、繁体中文、英文、日文、韩文
- 支持追加译文或替换原文
- 支持翻译嵌入卡片标题和描述
- 支持每批翻译数量限制

## 注意

需要在 Loon 中开启 MITM 并信任证书。Discord App 的实时新消息通常来自 Gateway/WebSocket，Loon 响应脚本不一定能改到；打开频道时通过消息历史接口加载出来的内容更容易生效。

DeepSeek API 调用会把待翻译的消息文本发送到 DeepSeek。API Key 只在你的 Loon 本地配置中使用，不会出现在公开仓库里。
