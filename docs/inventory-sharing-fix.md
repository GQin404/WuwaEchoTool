# 声骸背包共享与筛选修复（2026-10-20）

本轮只修复 Register 角色编辑的背包选择流程及其筛选／共享展示。不更改评分公式、Classic 的业务流程或存档格式。基于当前含多配置的未提交工作目录继续修改；没有提交、推送、切换分支或清除用户资料。

## 根因与调用关系

`role-register-page.js` 的新增声骸入口进入 `register-workspace.html?mode=echo&roleid=...&inventory=1`，`register-workspace.js` 的 `openInventory()` 创建原生 dialog。

旧代码在同一弹窗内混用两种集合：预检遍历 `MultiConfig.entities(snapshot)`，列表和选择确认却从 `snapshot.unusedEchoes` 读取。因此已在任意配置使用的实体即使通过底层共享校验，仍没有进入列表和确认按钮的机会。不是底层数据缺少共享支持。

`CharacterCore.equip()` 对 v2 数据委派 `MultiConfig.equip()`，该方法将现有实体 ID 放入目标配置的槽位，不移除其他引用，也不复制实体。同配置的不同槽位不能重复引用同一 ID，总 Cost 不能超过 12。这些约束沿用原实现。

原背包仅支持搜索与 Cost。通用 `RegisterSearchUI.enhance()` 再通过 DOM 移动重新组成筛选区；本轮改为背包自行管理搜索下方的展开面板。声骸库的共享详情原本由 `MultiConfigUI` 的 MutationObserver 插入，再从列表克隆到详情；列表不可见、保留缓存或详情单独重绘时不够可靠。

## 修复行为

- 列表、选中项解析、可用性预检和提交均基于完整实体集合。共享状态不构成禁用条件。
- 每次新开弹窗，筛选折叠，隐藏已使用开启。重设恢复所有默认筛选；刷新保留当前筛选及仍存在的选择。
- 使用统计覆盖每位角色的全部配置，包括未激活配置；同一实体只在列表出现一次，详情按角色／配置去重计数。
- 搜索、Cost、套装、主属性可组合；这次保留旧两项并新增后两项。隐藏导致无结果时提供关闭提示。
- 被筛选隐藏的已选实体继续保留选择及确认状态。指定已占槽时，初始选中该槽的现有 ID，隐藏不改配置。
- 支持第一空槽或指定 1–5 槽替换，预检和提交传递相同目标位置。同配置重复与 Cost 超限仍禁用。
- 确认仍走 `core.transact()` 和已有乐观快照检查、持久化、评分与返回渲染；跨页更新触发原有来源变更提示，关闭过期弹窗。
- 列表卡片、库详情和背包的共享说明均由 `register-secondary-views.js` 直接渲染。删除旧 DOM 插入／克隆路径，复用 `MultiConfig.references()` 与 `.mc-usage` 样式。
- 列表保留缓存的签名加入全部角色配置的引用图及名称，引用变更时不再复用旧使用数量。
- 桌面筛选占搜索下方整行；手机单栏，面板内部可滚动，列表与确认区独立保留空间。没有右侧固定筛选栏。

## 本轮文件

| 文件 | 本轮职责 |
|---|---|
| `js/register-workspace.js` | 完整集合、筛选状态、位置预检／提交、选中保留、引用缓存签名 |
| `js/register-secondary-views.js` | 组合筛选、不可变渲染、空结果、三语共享详情 |
| `js/register-search-ui.js` | 移除背包通用 DOM 重组入口，其他页面沿用 |
| `js/multi-config-browser.js` | 移除共享说明 DOM 插入／克隆，保留管理、迁移、编辑确认 |
| `js/i18n-dictionaries.js` | 六个新键三语、旧空库／帮助／确认文字校正 |
| `css/register-workspace.css` | 搜索下方折叠面板及桌面／手机几何布局 |
| `tests/inventory-sharing-browser.cjs` | 六组实际页面共享／筛选／保存／布局交互与截图 |
| `docs/inventory-sharing-fix.md` | 本说明 |
| `.gitignore` | 忽略本轮可重建截图和打包暂存 |

`js/multi-config.js`、`js/character-core.js`、`js/base.js`、导入、备份及分享逻辑本轮均未修改；它们包含此前已存在的多配置改动，交付包完整保留。Git HEAD 与当前整体差异含前次工作，不能全部归为本轮。交付中的任务前快照比对以此前已交付的 20261020_1010 封装副本为基准，并说明脱敏差异。

## 验证与边界

详见交付 `TEST_REPORT.md`／ZIP 内 `handoff/05_TEST_REPORT.md`。所有浏览器流程使用真实 HTML、脚本、存储模块、控件和评分代码，配合隔离的合成存档；不会接触个人浏览器存档。官方导入回归使用模拟网络，不宣称真实账号或在线接口已验证。手机为 Edge viewport，不代替实体手机、Safari、软键盘或辅助技术验收。

目前背包小于千件时逐实体核心预检仍为同步操作；超大声骸库尚未做专项性能测量。localStorage 原有跨页事务边界不因本轮升级为数据库事务。详细已知边界见 `docs/multi-config.md`。没有新增唤取记录、云同步或另一套评分引擎。

建议 SourceTree 提交说明：`fix: 修复背包跨角色共享选择与折叠筛选`
