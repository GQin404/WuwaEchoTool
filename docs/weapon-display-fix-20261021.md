# 武器图片显示与低星资源修复

日期：2026-10-21。

## 原因

1. 新增的 123 个 .webp 文件实际全部为 PNG 编码，真实 WebP 检查拒绝登记。
2. js/weapon-catalog.js 仍保留旧的 image:null 映射（已登记图片为 0）；直接打开静态页面不会执行 Node 同步脚本。
3. 上轮仅覆盖 3～5 星，遗漏 1star、2star 的目录扫描、星级验证及十件低星武器身份。

## 修复

- 将用户提供的 123 张 PNG 编码图片无损转为真正 WebP，尺寸、RGBA 像素与透明通道逐一比较一致。保留原文件备份：C:/Users/user/.codex/visualizations/2026/10/21/01a15c9e-2a06-7ab2-bd97-9a1cc4bc0029/weapon-fix-20261021/original-png/。没有下载或补造武器素材。
- 已补齐一星、二星各 5 件身份，完整目录 124 件；既有 114 件 resourceId、名称、类别和星级不变。resourceId 仍为唯一识别依据。
- 已登记 123 张图片：一星 5、二星 5、三星 21、四星 43、五星 49。只缺 image/weapons/5star/沉冥.webp（21020107），继续 SVG 回退。
- scripts/sync-weapon-art.cjs 与 js/weapon-portraits.js 支持 1～5 星。没有修改喚取掉落范围、导入校验、保底或评分逻辑。
- node scripts/serve.cjs 与 npm start 启动时同步映射；直接静态部署前仍需 npm run assets:weapons。启动中的进程需重启。
- _headers 新增武器图片及 js/weapon-catalog.js 的 no-cache, must-revalidate 配置，避免稳定文件名更新后长时间沿用旧缓存。
- 更新五个星级目录说明、武器维护文档、缺图清单及相关测试。

## 验证

- 完整 Node 单元测试：213 通过，0 失败；按此前公司监测反馈未运行会启动 PowerShell 的读取器测试 1 项。
- 静态入口依赖与脚本语法检查、资源完整性检查通过。
- Edge 桌面 1440 与手机 390 两种宽度：各自解码全部 123 张实际图片，全部成功；含 10 张一至二星图片。
- 历史记录中的武器缩略图显示正常，缺失「沉冥」及模拟图片 404 都回退 SVG，无页面错误。
- 直接启动本地服务可自动修复过期映射。

详细转换、测试日志和浏览器结果位于 C:/Users/user/.codex/visualizations/2026/10/21/01a15c9e-2a06-7ab2-bd97-9a1cc4bc0029/weapon-fix-20261021/。没有向正式项目写入测试截图，没有修改用户存储，没有执行 Git commit/push/reset/clean。

## 使用

本地：重启预览，然后 Ctrl+F5 强制刷新。
线上：同步上传修改后的 js/weapon-catalog.js、js/weapon-portraits.js、_headers 与 image/weapons/ 中的图片，再强制刷新。未来补图先运行 npm run assets:weapons，再发布。
