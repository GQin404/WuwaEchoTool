# 图片维护

- 角色图片统一在 `css/base.css` 的 `.mcr-*` 类中维护 `background-image`，图片放在 `image/characters`。
- 浏览器初始化时，`character-portraits.js` 读取 CSS 中的本地图片路径，供 Classic 角色页、Register 和分享使用。它不再生成覆盖 CSS 的图片地址，只补充 Classic 名称栏。
- 不要在 `base.js` 为角色新增 `portrait` 图片配置。角色图片不使用远程 URL。
- 声骸图片继续在 `js/base.js` 的 `costList[].imgCode` 维护，保留原 URL 机制。
- `tests/character-portraits.test.cjs` 已按维护者要求移除；它不是产品运行依赖。
- 图片变更不修改角色存档或评分公式。
