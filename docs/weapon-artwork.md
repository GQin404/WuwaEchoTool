# 武器识别与图片维护（2026-10-21更新）

当前 **114件武器识别资料、0张正式武器图片**：五星50、四星43、三星21。来源为本次实际取得的Encore三语公开数据，包含历史限定、常驻、锻造等目录项，不表示每件都可从唤取获得；不从ID数字猜稀有度或类型。原始来源URL与SHA见convene-resource-audit.json。官方WIKI可核对中文名称；真实官方授权导入未由这些数据证明。

集中维护 `js/weapon-catalog.js`：id/resourceId为资源ID、names三语、category类型、rarity、fileName建议文件名、image实际路径（当前null）、source来源。没有复制网络图片地址作为运行依赖；Icon字段未进入注册表。WeaponPortraits只接受本地资源，ID权威，未知ID不借同名图；无ID查询仅唯一精确归一别名，冲突/子串均拒绝。

## 给现有武器补图

1. 使用你有权使用的透明原图，不改已有角色文件。按fileName放到image/weapons/5star、4star或3star；例如赫奕流明建议5star/blazing-brilliance.webp。不要仅改扩展名假装WebP。
2. 在同一条catalog记录将image从null改成完整本地路径；只改这一个注册表条目，页面/历史/分析自动复用，不需分别改JS。fileName只是建议，不是声称文件存在。
3. 新武器先核验真实resourceId、三语名称、类型/星级及来源，再新增一条。不得把WIKI页面ID、角色ID、武器类型编号当资源ID。
4. 推荐英数小写、连字符，保留比例与透明背景；新版本图可用新后缀避免旧图缓存。运行node scripts/check-convene-art.cjs，再在卡池分析/历史查看三语同图、加载失败回退。

缺图使用五种类别SVG；完全未知ID用中性武装结晶，不用错误角色图/固定剑冒充武器。缺图全清单（114条真实ID与三语名称）见weapon-missing-assets.json；WeaponPortraits.missing(records)可按本地档案列缺口，不含UID或授权。

## 与当期封面区别

image/convene-current/featured-weapon.webp是手动总览封面，**不是**某个物品的注册图片。替换它不影响历史记录身份。当前默认是原创中性结晶示例，仍须人工补正式封面；不会假装已识别当前卡池。详见image/convene-current/README.md。
