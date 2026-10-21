# 导入教学整合

2026-10-21：按用户要求，本轮只编辑本地源码，不做联网核对、脚本执行、测试或浏览器验收。

教学统一为「选择平台 → 选择方式 → 操作步骤 → 带入导入资料」。Windows、Android、iOS、PS5、Xbox、macOS、Linux 均有独立入口；Android 的飞行模式、日志和 Ascent 分开，Windows/macOS/Linux 保留命令与日志入口。

主步骤直接说明操作，不再反复出现“参考站”“本站适配”或原作者说明。必要脚本来源、授权资料说明和证书用途集中在“使用说明与来源”。远程命令只作为文字展示，不由页面自动执行。

输入衔接：支持历史 URL 与捕获到的查询请求 JSON；PS5 可填写页面信息中的 player_id 和 record_id。URL 解析补充 gacha_id 作为缺少 resources_id 时的兼容入口。账号授权仍只用于查询，不写入持久存档。

相关源码：js/convene-guides.js、js/convene-ui.js、js/convene-i18n.js、js/convene-service.js、css/convene.css、convene.html。上一份 ZIP 和此前测试记录不包含或验证本轮变更；当前工作目录源码包含这些改动。
