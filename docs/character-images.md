# 角色与声骸图片统一

- Register 角色分析和分享不再替换今汐图片；五个声骸示例图覆盖也已移除。
- 角色目录 `roleList` 可配置 `portrait`，统一由 `CharacterPortraits.resolve` 解析：仅限本地 `image/characters/文件名`；未配置则按 `cls` 使用原 `image/characters/{名称}.png`。
- 本次把用户提供的今汐、心两张 WebP 放入 `image/characters/jinxi.webp`、`image/characters/xin.webp` 并更新目录。其他角色保留现有图片，未假定其他官方图片地址。
- 将图片复制到 `image/characters` 后，在目录条目的 `portrait` 填写该本地路径即可。角色不支持外部 URL；远程路径会回退到原 cls 对应的本地 PNG。声骸 URL 规则不变。
- Classic 首页、角色选择器通过同一目录生成图片样式和独立名称栏，图片使用 cover 填满卡面，居中顶部裁切；手动／导入角色分析使用相同解析器与独立 figcaption。旧角色存档的历史 cls 显示时优先对齐目录 cls，不回写存档。
- Register 声骸直接呈现 view model 的 image：保存的 HTTP(S) imgCode 优先，否则按 costListId 读取共用声骸目录的 imgCode。无本地示例覆盖。
- 入口缩图移动到 `image/interface`。正式 JS 不再引用 `image/register`；旧原型素材保留但不参与正式角色／声骸显示。
- DOM-free view model 只调用纯图片解析函数；DOM 名称样式属于独立 presentation 初始化。

## 验证

新增角色图片测试覆盖本地路径、远程地址及非法路径回退、Classic 名称、五颗指定声骸 URL、不再引用 register 示例图片、三语渲染、所有页面依赖和存档不变。

浏览器使用本机 synthetic fixtures：新旧今汐实际载入相同 WebP；Register 五颗官方 URL 全部载入成功；Classic 卡片名称可见；导入角色 figcaption 与等级在 Desktop / 390px 均无重叠。

mcData schema、评分公式、核心保存逻辑没有改动。新增字段仅为静态角色目录的展示配置。未部署，真实玩家资料验收仍待 1D.5。
