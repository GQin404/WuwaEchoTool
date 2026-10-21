# 武器图片维护

武器始终以 resourceId 唯一识别。当前目录共 124 件：五星 50、四星 43、三星 21、二星 5、一星 5。目前已登记 123 张真实 WebP，只缺五星「沉冥」。

## 放置与登记

1. 使用现有 js/weapon-catalog.js 的 names["zh-CN"] 简体中文名称，文件名为「官方简体中文武器名称.webp」。例如：5star/赫奕流明.webp、5star/浩境粼光.webp、5star/苍鳞千嶂.webp、5star/时和岁稔.webp。
2. 将真实静态 WebP 放入 image/weapons/1star/、2star/、3star/、4star/ 或 5star/，优先透明背景。不能只把 PNG/JPG 的扩展名改成 WebP；不要下载未经授权的素材。
3. 执行 npm run assets:weapons。npm start、npm test 和 npm run check:static 的前置步骤也会同步。直接部署静态文件前必须运行同步命令。无需手工修改 image 映射或业务代码。
4. 执行 npm run check:weapons 和 node scripts/check-convene-art.cjs。随后刷新页面验证显示。

js/weapon-catalog.js 是统一身份与资源映射；脚本只更新 fileName/image，不更改 resourceId、名称、别名、星级或类别。文件缺失时 image 为 null；错误格式不会登记，检查失败并保留占位。浏览器已有图片加载失败回退机制继续使用。

## 冲突及文件校验

建议文件名仅从现有简体名称生成，不进行简繁、英文或模糊文件名识别。名称规范化重名或 Windows 非法字符以「名称--resourceId.webp」消歧，具体结果见 docs/weapon-missing-assets.json 的 conflicts。当前无冲突。NFC 保存文字；NFKC/大小写仅检查文件系统冲突，不用于合并武器身份。

同步检查 RIFF/WEBP 容器、长度、图像数据块和基本头标识；最终解码仍需浏览器验证。动画 WebP 不在此静态武器规范内。未登记文件、非法 WebP 和缺图会列入同一 JSON 清单。清单中的 verifiedOfficialWeaponImages 为沿用字段，仅表示按目录登记的有效文件数量，不代表图片来源授权认证。

本轮补齐十件一至二星武器身份（resourceId 对照：https://github.com/yuhkix/wuwa-ids/blob/main/weapons.md），仅用于素材识别；不扩展喚取掉落星级或修改保底规则。既有 114 件身份不变。123 个扩展名为 WebP、内容为 PNG 的新增图片已无损转换成真正 WebP，逐像素一致。原文件备份位于 Codex 独立维护目录，未在项目内堆放副本。

本地预览通过 npm start 或 node scripts/serve.cjs 启动时会同步资源映射；已启动的进程需重启。静态托管不会扫描新增图片，部署前仍需运行 npm run assets:weapons，并一并上传 js/weapon-catalog.js 与图片，再刷新页面。

稳定文件名更新：_headers 为武器映射和武器图片设置重新验证缓存。正式托管需支持该配置；更新后请强制刷新。
