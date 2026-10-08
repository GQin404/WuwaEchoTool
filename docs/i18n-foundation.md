# 1A.5 国际化基础

当前仅建立基础模块，不修改旧页面、不挂载语言选择器，也不启动 1B。

## 模块与加载顺序

- `stat-keys.js`：旧中文属性标识与稳定英文 key 的兼容映射。
- `role-view-model.js`：依赖 `StatKeys`，保持无 DOM、无存储、无 locale 参数。
- `i18n-dictionaries.js`：100 个 key，每个均提供 zh-TW / zh-CN / en 文案。
- `i18n.js`：依赖 `EchoDictionaries`，负责解析语言、偏好持久化、翻译和显示格式化。

浏览器加载顺序为字典 → i18n、StatKeys → view model；模块加载本身无副作用。1B 的页面初始化代码再调用 `EchoI18n.createBrowser(window)`，并通过 `subscribe` 重新渲染文字。语言选择器调用 `setLocale('en')` 等明确操作，不调用 reload。后续 Desktop 选择器放在顶部次要区域；Mobile 入口留待对应阶段。

## 语言解析

优先级：有效手动偏好 → URL `?lang=` → navigator.languages 顺序 → navigator.language → zh-TW。

- zh-TW / zh-HK / zh-MO → zh-TW。
- zh-CN / zh-SG → zh-CN。
- en 与 en-* → en。
- 额外兼容 zh-Hant / zh-Hans、大小写和下划线形式。
- 不支持的浏览器列表项继续检查后续项；全部不支持才回退。
- 无效手动偏好或 URL 参数忽略，不覆盖有效的后续来源。

存储 key 为 `wuwa.ui.locale`，与 `mcData` 完全隔离。只在用户调用 setLocale 时写入，自动检测不保存。后续页面读取已保存选择后，不受浏览器语言或 URL 覆盖。初始化和手动切换均同步 document.documentElement.lang。

存储被浏览器禁用时，页面内切换仍可用，setLocale 返回 persisted:false；下次访问无法保证记住选择。URL 不会自动改写。页面订阅返回取消订阅函数，避免重复初始化积累监听。

## 字典与命名

字典采用 `messages[locale]['namespace.key']`。命名空间包含 common、nav、role、loadout、analysis、summary、assistant、state、scoring、issues、format、stats、characters、echoes、sets。

- UI key 使用英文语义名称，例如 `analysis.chooseCandidate`，不以中文原文为 key。
- 属性 key 使用 snake_case，例如 `stats.crit_rate`、`stats.atk_percent`。
- 实体使用稳定目录 ID，例如 `characters.1`、`echoes.59`、`sets.5`；目录 ID 不等于实例 ID，不通过名称猜测。
- 已有状态码保留英文形式，例如 `scoring.not-scored`；不为大小写风格改写业务 identifier。
- 插值使用命名参数，例如 `{position}`、`{stat}`。三语必须使用相同参数。
- 缺少当前语言文案先回退 zh-TW，完全缺少 key 时显示 `[namespace.key]`，不静默变成空文字。
- t 返回纯文本，renderer 必须使用 textContent 等文本入口，不用 innerHTML。嵌套翻译由 renderer 显式组合，例如先翻译 stats，再传入 analysis.ignored 的 stat 参数。

实体翻译目前仅覆盖原型涉及的角色和声骸、一个套装，未宣称整个目录均已翻译。entity 按 locale → zh-TW → 调用方提供的原始名称 → key 回退。原始名称可以来自 legacy.name，仅用于显示，不能参与计算、排序身份匹配或模型判断。

## View model v2

存档版本不变，只有尚未接入 UI 的衍生契约升为 schemaVersion:2：

- stat.key 取代公开 property；value 是 number，unit 是 percent / flat 等语义标记，不拼接百分号。
- stat.legacy.property / legacy.raw 保存兼容审计输入，不能当成新版 UI key。
- role、echo 提供 nameKey，原名称移至 legacy.name。
- suite 提供 id / nameKey / icon；名称映射来自注入的 suiteAttributeMap。只有 URL 或无法映射时，id / nameKey 为 null。
- issues 统一为 `{code, params}`。
- 模型原始配置移至 model.legacyConfiguration，其中旧引用属性仍可能有中文，属于诊断边界。
- completeness 和 scoring 等状态继续使用已有英文语义码；不生成最终 UI 句子。

`生命` 与 `小生命` 暂保留不同 key（hp_flat_legacy / hp_flat），因为旧模型处理并不完全一致。虽然显示名称相同，也不能在本阶段合并计算标识。

## 格式化

format 提供 integer、decimal、percentage、percentagePoint、score、dateTime，使用 Intl.NumberFormat / Intl.DateTimeFormat。

- percentage(6.3) 表示 6.3%，只在显示入口换算为 Intl 的比例输入 .063。
- percentagePoint(6.3) 表示 +6.3 个百分点，英文使用 pp，不冒充相对提升百分比。
- score 固定两位小数，其他数值可明确指定精度。
- 日期默认使用浏览器时区，可传 timeZone；不推造存档时间。
- 缺值、非有限数值和错误类型显示 unavailable，不把缺值格式化为 0。
- 计算层不依赖这些函数，切换语言不会重新选择评分模型或写回数字字符串。

## 旧中文依赖风险

| 文件 | 依赖 | 本阶段处理 |
| --- | --- | --- |
| base.js | getScoreDetails 按中文 property 分支，countMainAttr 匹配中文主词条，能量校正及参考表使用中文名称，suiteAttributeMap 中文 key | 保留原公式与输入协议，通过兼容映射隔离 |
| mccost.js / mccost2.js | 中文词条汇总、单双暴统计、includes("效")、属性名称转换和直接 HTML 文案 | 不接入自动全文翻译；1B 新 renderer 改用稳定 key |
| costedit.js | 中文选项值、主词条字符串、重复词条识别、概率与保存计算 | 暂保留旧编辑器，不将翻译文案写回 option value |
| compare.js | 词条名称比较、去重和旧中文结论 | 留待 Phase 2 统一比较状态 |
| probability.js / imitate.js / helperFunctions.js | 中文词条类别、概率判断和显示生成 | 后续逐页接入，不批量替换字符串 |
| index.js / unusedEchoes.js | 目录名称、筛选入口及直接中文文案 | 首页与声骸库整合时单独处理 |

最大的风险是把 locale 翻译值写回 property 或 mainAtrri，使旧 switch 无法匹配而返回零分。禁止把整个旧 DOM 文本替换成另一语言后再读取 DOM 作为计算输入。

## 测试与范围

`node tests/i18n.test.cjs` 验证解析顺序、地区映射、存储失败、跨实例偏好、html.lang、订阅取消、100 个三语 key 和参数一致性、缺词回退、Intl 格式化、切换语言后 view model 和存档不变。

其余三套回归测试继续通过：60 组手动/导入模型配对、42 组链数/模态、91 组新角色场景。测试使用构造记录与真实计分函数，没有连接真实账号。语言控制器使用注入环境测试；由于本阶段不挂载 UI，尚未宣称完成新页面浏览器交互验收。
