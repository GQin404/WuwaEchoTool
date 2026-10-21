# 武器图片目录与可靠映射

生产目录 `js/weapon-catalog.js` 当前为 **0 个真实武器图片条目**。仓库没有可核验的武器图片或完整官方资源 ID 目录，因此没有从测试数据反推、臆造或借用角色图片。`image/weapons/3star`、`4star`、`5star` 已建立；当前这些目录只含维护说明，没有伪装成官方图的素材。

## 新增一把武器

1. 从有使用许可、可核验的来源取得透明背景原图，确认该武器真实 `resourceId`，记录来源/许可。不要把名称或武器类型编号当物品ID。
2. 将素材放到对应星级目录，推荐透明WebP、最长边≤1600px，保留原始比例。文件名只用英数、连字符、下划线；更新图片时使用新版本文件名，避免静态图片缓存复用旧文件。
3. 在 `weapon-catalog.js` 的 `weapons` 数组加入：`id`（真实资源ID字符串）、`rarity`（3/4/5）、`category`（sword/broadblade/pistols/gauntlets/rectifier/unknown）、`names`（zh-CN/zh-TW/en）、可选精确 `aliases`、`image`（本地图片路径）、维护用 `source`／`license`。没有真图时先省略image，保持明确类别占位。
4. 执行 `node scripts/check-convene-art.cjs`，并跑单元和浏览器。检查加载、透明边缘、比例、失败回退和三语言相同ID的图片一致性。

目录结构是现行运行代码，不是仅文档方案。解析器 `WeaponPortraits.create/resolve/find/missing` 集中处理。ID为主；有ID但目录未收录时，**不会**用另一个武器的同名别名偷配图片。仅无ID的独立名称查询允许NFKC/空白/大小写归一后的精确唯一别名；冲突、子串、模糊相似不匹配。只接受 `image/weapons/[345]star/*.webp|png|avif|svg`，拒绝外链、路径穿越和查询参数。

## 缺少什么

目前所有真实五星、四星、三星武器图片及其经过核验的ID映射均待提供，不能枚举一个尚未掌握的完整官方图库当作事实。`docs/weapon-missing-assets.json` 明确记录这一范围。后续对于某份本地档案，可以调用 `WeaponPortraits.missing(该档案的武器记录)` 获取按资源ID去重的待补列表；不需要导出UID、时间线或授权链接。

默认占位是透明的中性武装结晶，不是固定的一把示意剑；登记类别后有五种独立类型SVG。UI会保留最新获得的真实名称、时间、间隔和保底，并明确标注图片待补；加载失败也退回相应类别。

## 测试素材边界

浏览器测试拦截两个 `fixture-synthetic-*` 图片请求，使用明确写有 SYNTHETIC ART FIXTURE 的几何图验证有图分支。这些合成ID、几何图没有加入生产目录，也不当作官方武器或真实素材交付。正式默认目录为0条的无映射状态另有真实页面测试。
