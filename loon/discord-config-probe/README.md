# Discord配置探测

用于探测 Discord App 下发的实验和设置接口，查找是否存在能影响原生聊天布局的服务端开关。

## 订阅链接

```text
https://raw.githubusercontent.com/Ankhu-1/loon/main/loon/discord-config-probe/Discord-config-probe.plugin
```

## 怎么用

1. 在 Loon 中添加上面的订阅链接。
2. 开启 MITM 并信任证书。
3. 打开 Discord App，切换几个频道、DM、设置页。
4. 看 Loon 的脚本日志或通知里是否出现 `bubble`、`chat`、`message`、`layout`、`mobile` 等命中。
5. 把命中的日志截图发回来，我再判断能不能写成真正的强制开关插件。

## 注意

这个插件只记录配置/实验接口的关键词命中，不修改 Discord 返回内容。它不会上传日志；日志只在你的 Loon 本地显示。
