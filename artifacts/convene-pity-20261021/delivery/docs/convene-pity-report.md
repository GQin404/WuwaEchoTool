# 唤取记录修正：现状审计与交付验收

日期：2026-10-21。基于当前工作区源码直接增量修改；没有重新开发图片注册表、封面、存储、导入教程或分享系统。没有执行 Git commit、push、reset、clean，也没有操作个人浏览器数据。

**验收结论：计算边界、状态机、玩家补充分离、总览和六阶主题已实现并验证；全历史 UP 覆盖、实际服务器编号映射及联动保底规则仍未完成核实，不能宣称整个需求已全部验收。** 当前保留未知是数据限制，不代表玩家必定处于小保底。

## 1. 修改前的实际审计

已检查 core、UI、store、service、character-rating、assets、visuals、share、i18n、weapon-catalog、两份现有模块文档、资源审计、UI 参考和既有测试/截图。

| 已有实现 | 实际问题或限制 | 本次处理 |
|---|---|---|
| 连续导入、去重、历史跨度合并、首段删失 | `≥73` 是从已保存连续片段起点到首次五星的已知下限，不能据此断言官方过期；没有上一个五星或跨缺口时无法精确 | 保留算法的不确定性，改为“已记录 73 抽”；不进入均值、最快、最晚和评分 |
| 同秒反转接口顺序并生成 seq | 没有利用可用的逐条数字 ID；仅有时间不足以排序 | 同秒全部具有安全且唯一数字 ID 时使用 BigInt 比较；否则保留接口顺序的反向序号 |
| 角色、武器分别累计保底 | 只有五星计数，缺少当前 UP 保证状态和剩余抽数 | 增加独立保证状态机与最大剩余抽数 |
| 限定结果玩家逐条确认 | 没有历史 UP 数据；下拉框默认挤入每条历史 | 增加资料表；可靠范围自动推导；手动选项折叠、独立保存和撤销 |
| 目标 R0–R6 区间评分 | 可以把无关五星之间的全部区间用于角色分数 | 无法归属目标的五星阻止评分；可靠目标链才累加实际可确认投入 |
| 统一 64 角色、114 武器识别与固定封面 | 这部分已经完成，不应重建；正式武器图仍缺失 | 沿用原注册表和文件名，复核联动身份及缺图 |
| 六阶同源徽章与四种 PNG 分享 | 页面主题未联动；总览星运位于双卡/统计之后 | 星运主卡前置，边框/轨道/金属细节随有效等级改变 |

## 2. 本次修改内容

- 新增 `js/convene-banners.js`：规则、历史卡池、来源与确认状态集中维护；历史资料与核心计算分离。
- `convene-core.js`：可靠同秒 ID 顺序、独立 UP 状态、剩余抽数、已确认目标投入、补充/撤销与备份兼容、来源标记、身份不明记录隔离。
- `convene-character-rating.js`：沿用原数值公式；缺失或无关证据不再生成目标分数；支持已验证目标链的 R0–R6 累计投入。
- `convene-ui.js` / `convene-i18n.js` / `convene-share.js` / `convene.css`：总览、主题、精确值和下限文案、状态提示、折叠补充、三语和 PNG 同步。
- `functions/api/convene.js`：只允许可控数字逐条 `id` 通过响应白名单；不保存授权 `recordId`。
- `convene.html` 与 `register-workspace.html`：在核心脚本之前加载规则资料；后者是完整备份入口所需的依赖修改，保留已有用户修改。

## 3. 抽数与大小保底算法

按卡池、连续记录跨度、时间和同秒序号从旧到新遍历。上一个五星与本次五星处于已验证连续跨度时，索引差就是本次间隔；五星之后重置计数。首次五星、缺口、未知规则和超过硬保底的异常间隔不作为精确样本。

当前保底是最后一个已知五星之后的连续抽数。普通重复池规则为 80 时，最大剩余抽数为 `80 − 当前保底`；当前计数未知时不伪造精确剩余值，达到或超过上限时显示异常。单次间隔、目标投入、当前计数和 UP 保证状态分别保存/显示。

限定角色保证状态为 `unknown`、`chance`、`guaranteed`：

| 当前状态及结果 | 当次分类 | 下次状态 |
|---|---|---|
| 初始未知，取得确认 UP | 不猜小保/大保 | 小保 50/50 |
| 小保，取得确认 UP | 小保命中 | 小保 50/50 |
| 非已知大保，取得确认非 UP 的常驻角色 | 小保歪出 | 大保保证 |
| 大保，取得确认 UP | 大保命中 | 小保 50/50 |
| 卡池不明或中间历史缺失 | 未知 | 未知 |
| 结果与已知大保、UP 身份冲突 | 未知，保留冲突证据 | 未知 |

不因“没有看到歪池”推断小保。大保结果不计入小保命中率分母。普通限定武器独立计数，不套角色 50/50。未知 ID 也不会因为不在 UP 列表就自动成为“歪出”。

若有逐条数字 ID，同秒批次必须全部有效且唯一才能按 ID 排序，避免 JavaScript 大数字精度损失。无 ID 时沿用接口返回的先后顺序并反转为旧到新；真实接口是否始终满足这一契约尚未实测。截断或冲突的同秒批次继续拒绝合并，保留原档。

## 4. 历史 UP 资料覆盖范围

本次可运行的确认窗口仅为：国际版、明确逻辑服务器标识 `Asia`、守岸人 1.3 首期，2024-09-29 11:00:00 至 2024-10-24 09:59:59（服务器本地时间）。UP 资源 ID 1505 沿用原统一角色注册表。

来源：[官方守岸人活动公告](https://wutheringwaves.kurogames.com/en/main/news/detail/1420)、[官方 1.3 更新说明](https://wutheringwaves.kurogames.com/en/main/news/detail/1454)。开始时刻采用公告计划维护完成时刻；并不保证实际开服没有延迟。

`global-1.3-shorekeeper` 是工具内部稳定 ID，不是伪造的官方接口卡池编号。`Asia` 仅是明确的逻辑地区标识；**没有把 `1001`、UID 或任何不透明服务器字符串臆断映射成亚洲服**。因此普通真实导入若服务器编号尚未映射，会保持未知；本次不是全版本历史覆盖。

多个候选同期开池时，仅当稳定身份/精确卡池名称能消歧才采用；不会根据玩家抽出的角色来反推选中了哪一个池。不同地区、边界外、未登记版本均不自动猜测。

## 5. 联动支持范围、依据与限制

已复核的身份：露西 1511、丽贝卡 1308、蜃影 21030056、碎骨 21030066。原有注册表已登记这些资源，本次没有另建识别系统。

[官方 3.4 更新维护公告](https://wutheringwaves.kurogames.com/en/main/news/detail/4765)确认角色、武器及对应联动活动身份。四条资料以 `identity-only` 登记；具体时间、专用货币、硬保底、UP 规则、官方数字类型和继承关系未从可直接核对的官方详细规则中完整取得，相关字段保持空值。检索到社区转载的规则并未作为官方已核实规则启用。

可对**已有且明确标注联动类别/活动名称**的记录提供独立联动角色/武器累计数、五星结果、图片及历史筛选。101/102 是派生的展示分类，不向官方接口请求这两个数字，也不写回原始记录。没有联动数据时仅沿用“其他卡池”折叠入口，不制造空白联动大卡。

**未完成：联动精确保底、跨联动继承和自动发现官方接口类型。** 当前导入保持原有 1–8 请求范围，不猜 9/10 等新接口类型。没有足够字段时只能显示未知；真实接口缺少的记录无法靠界面修复创造出来。若普通池来源混入未明确分类的联动物品，整组进入“卡池身份不明（已隔离）”，不继续伪装普通池保底或评分。

## 6. 仍不能自动判断的情况

1. 最早五星之前的记录缺失，或两次快照没有重叠连接。
2. 历史 UP 窗口未登记、服务器不透明、时区依据不明。
3. 同时存在多个 UP，记录没有可靠卡池身份。
4. 原始来源混有联动、规则版本无法确定。
5. 角色目标取得之前的歪出链不完整，或存在无法归属目标的其他五星。
6. 官方记录保留期外的抽取从未被本地保存。

界面不会将这些情况解释成“0 抽”“一定小保”“一定命中”或精确平均值。

## 7. 总览与六阶主题

顺序调整为整体星运主卡 → 限定角色/武器双卡 → 核心统计 → 最近五星/其他池 → 趋势与详细分析。

主卡包含正式六阶徽章、称号、分数、评语、有效样本及排除的未知间隔数量。双卡保留固定封面路径，最近个人五星另有明确标题、名称和日期；桌面将图片与数据分区并用渐层衔接，手机改为上方图片、下方完整数据。统计卡保留累计抽数、五星数量、平均、最快和最晚，统一间距与独立圆角。

主题根据有效称号写入 `data-fortune`；观察中保持中性。低阶轻边框、中阶双层框、高阶轨道/金属纹理和多层光边递进，沿用六阶不同几何徽章。独立打开页面也强制保留本模块深色底色，不依赖全站界面偏好。没有持续动画，支持 `prefers-reduced-motion`；主题不参与任何计算。

六阶由合成记录经过实际 `ConveneCore.analyse()` 触发，未通过改 DOM 等级伪装评分：

| 等级 | 桌面 | 手机 |
|---|---|---|
| 低谷 | [截图](../artifacts/convene-pity-20261021/themes/abyss-desktop.png) | [截图](../artifacts/convene-pity-20261021/themes/abyss-mobile.png) |
| 逆风 | [截图](../artifacts/convene-pity-20261021/themes/headwind-desktop.png) | [截图](../artifacts/convene-pity-20261021/themes/headwind-mobile.png) |
| 平稳 | [截图](../artifacts/convene-pity-20261021/themes/steady-desktop.png) | [截图](../artifacts/convene-pity-20261021/themes/steady-mobile.png) |
| 幸运 | [截图](../artifacts/convene-pity-20261021/themes/lucky-desktop.png) | [截图](../artifacts/convene-pity-20261021/themes/lucky-mobile.png) |
| 星眷 | [截图](../artifacts/convene-pity-20261021/themes/star-desktop.png) | [截图](../artifacts/convene-pity-20261021/themes/star-mobile.png) |
| 最高阶 | [截图](../artifacts/convene-pity-20261021/themes/fate-desktop.png) | [截图](../artifacts/convene-pity-20261021/themes/fate-mobile.png) |

## 8. 三语言与资源回归

简中、繁中、英文同步替换精确抽数/已记录下限、剩余保底、保证状态、玩家补充来源和评分限制；移除总览的手动维护封面说明与无信息的装饰英文。导入失败、过期、样本不足、平台方法未实测等必要提示保留。

三语言使用同一资源 ID，不按译名拼图片路径。露西继续使用 `image/characters/luxi.webp`，丽贝卡继续使用 `image/characters/leibeika.webp`。未知 ID 不借用同名角色图片。缺图继续使用类别占位，不捏造武器图。

本次[资源复核清单](convene-pity-resource-audit.json)明确两把联动武器缺图；原有全部 114 把武器正式图缺口见 `weapon-missing-assets.json`。可补文件为 `image/weapons/5star/spectral-trigger.webp` 和 `image/weapons/5star/skull-thrasher.webp`，补图必须同时按既有武器注册表维护授权资源路径。

## 9. 角色星运、R0–R6 与评分影响

总体公式和门槛不变：有效间隔速度指数；有确认小保样本时 80% 速度加 20% 命中率；10 个间隔、300 抽授予称号，最高阶另需 30 间隔与 10 次机会。未知首段继续排除。

目标角色公式不变：`clamp(100 × (1 − (P − K)/(160K − K)), 0, 100)`。新增可靠目标投入由该目标小保命中的完整间隔，或同目标卡池连续“歪出 → 大保命中”的两个完整间隔组成；不跨无关角色摊算。R0–R6 分别要求 1–7 次目标取得都具有可确认投入。

**用户分数可能变化：**原先包含无关五星的角色区间现在显示待观察；新增可靠小保证据可能让总体 80/20 合成开始生效；识别到混合来源会排除原本误计普通池的样本。这些是证据与纳入条件修正，不是擅自调整公式、权重或等级阈值。

四种分享图（整体/角色 × 简略/详细）和额外目标分享沿用正式徽章与原角色图；默认无 UID，勾选后完整显示。PNG 下载直接使用预览的同一 data URL，实际下载字节已比对。未核实联动规则不会出现在分享图中充当精确分数。

## 10. 玩家数据兼容与安全

数据库名称和版本仍为 `wuwa-convene` / archive v1。没有清空 IndexedDB、localStorage 或个人账号数据。

新增补充写在账号 `annotations[原记录ID]` 中，原始记录不变；撤销保存 unknown 标记，防止重新合并旧备份时复活已撤销标记。旧版记录中的 `result/evidence:user` 仍兼容，新的独立补充优先。重导入按原逻辑去重，补充保留。

初始状态属于可选进阶操作，保存 `initialStates` 与 `initialAnchors`。锚定原最早记录，向前新增更早数据时不错误套用；历史缺口重置未知。所有依赖玩家补充的分类/保证状态明确标记玩家来源。

测试使用新建独立浏览器上下文、合成账号和合成记录。没有真实 token、授权 record_id、真实 UID 或完整真实唤取 URL 进入测试、日志、截图或交付包。逐条数字 `sourceId` 与授权 `recordId` 是不同字段。

## 11. 执行的测试

实际命令、最终数量和原始结果在交付目录的 `test-results.json`、`unit-tests.txt`、`focused-tests.txt`、`static-tests.txt`、`browser-tests.txt`、`theme-tests.txt`。

- `npm test`：182 项通过；全项目 Node 测试，包含声骸、备份、路由及唤取测试。
- `node --test tests/convene*.test.cjs`：88 项通过；唤取专项，包含新增 18 项边界/状态/补充/隔离/入口测试。
- `npm run check:static`：正式入口本地依赖和全部脚本语法。
- `node tests/convene-pity-browser.cjs`：真实无头 Edge，1440/768/390/360 × 简中/繁中/英文共 12 组；总览、历史、池分析、角色分析、封面刷新/缺图、四种 PNG、完整 UID、R0–R6 导出、教程复制/下载及存档字节不变。
- `node tests/convene-theme-browser.cjs`：六个实际评分等级 × 桌面/手机，联动角色/武器入口和筛选、默认折叠、独立保存/撤销、初始保证持久化、页面错误检查。

- `node tests/convene-entry-browser.cjs`：直接入口深色/中性空状态、声骸工作台完整备份依赖及无页面错误，使用隔离上下文。

旧的“任意五星区间均可评目标分数”测试已改成新需求的排除标准；数值公式边界测试仍保留。测试中发现并修复了空初始状态导致备份非幂等、异步保存断言过早、完整备份入口遗漏新依赖等问题。未把失败过程写成最终通过。

## 12. 浏览器证据入口

- [桌面总览](../artifacts/convene-pity-20261021/browser/1440-zh-CN-overview-full.png)
- [手机总览](../artifacts/convene-pity-20261021/browser/390-zh-CN-overview-full.png)
- [繁中总览](../artifacts/convene-pity-20261021/browser/1440-zh-TW-overview-full.png) / [英文总览](../artifacts/convene-pity-20261021/browser/1440-en-overview-full.png)
- [历史五星与筛选](../artifacts/convene-pity-20261021/browser/1440-zh-CN-history-filters.png)
- [角色分析](../artifacts/convene-pity-20261021/browser/1440-zh-CN-character-analysis.png)
- [联动角色](../artifacts/convene-pity-20261021/themes/collab-character.png) / [联动武器](../artifacts/convene-pity-20261021/themes/collab-weapon.png) / [联动筛选](../artifacts/convene-pity-20261021/themes/collab-history-filter.png)
- [进阶补充](../artifacts/convene-pity-20261021/themes/advanced-annotation.png) / [初始保证补充](../artifacts/convene-pity-20261021/themes/initial-guarantee-supplement.png)
- 分享 PNG：[整体简略](../artifacts/convene-pity-20261021/browser/1440-zh-CN-overall-compact.png)、[整体详细](../artifacts/convene-pity-20261021/browser/1440-zh-CN-overall-detailed.png)、[角色简略](../artifacts/convene-pity-20261021/browser/1440-zh-CN-character-compact.png)、[角色详细](../artifacts/convene-pity-20261021/browser/1440-zh-CN-character-detailed.png)。

## 13. 尚未通过实证的项目与维护方法

没有真实官方授权/API 端到端验证、实际服务器编号对照、Cloudflare 部署验证或实体手机测试。Edge 手机截图属于真实浏览器的设备尺寸模拟。联动精确保底及全历史自动判定尚未完成，不能以合成测试代替官方证明。

后续维护集中在 `convene-banners.js`：新增稳定内部 ID、卡池类别、各语言准确名称、起止时刻及时区、地区/明确服务器映射、UP ID、继承组、规则版本、官方来源和确认状态。只有足够证据时才将 `identity-only` 提升为 `verified`。新联动先登记身份；没有官方继承依据时保持独立、未知。明确继承的活动应映射到同一分析分类和规则；未知数字接口类型不自动启用。

发布前仍应补齐官方全历史窗口、可靠服务器映射与联动详细规则来源，然后添加对应真实匿名字段契约测试；不需要重做角色/武器图片系统或改数值评分公式。
