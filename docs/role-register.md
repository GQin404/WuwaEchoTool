# 1B：共用角色分析结构

## 范围与入口

本检查点完成 Desktop 只读结构和真实数据转换，不包含 1C 的槽位选择、展开、编辑事件。
在现有 `mccost.html?roleid=…` 或 `mccost-readonly.html?roleid=…` 后追加 `&view=register`，载入时视口宽度至少 1100px 即启用新版。
没有该参数或较窄视口继续使用原版；模式在载入时确定，不在缩放时重复初始化。
首页、Mobile、Compare 未改版。新版底部提供返回原版操作的链接。

## 模块与连续工作面

| 模块／DOM | 职责 |
| --- | --- |
| `js/role-register-mode.js` | 在旧初始化前确定预览模式 |
| `js/role-register-page.js` | 从 `mcData.role` 按实例 `roleid` 读取，调用同一个 adapter 和 renderer；只绑定语言事件 |
| `js/role-register-renderer.js` | 无 DOM／存储依赖的 HTML 生成器；输出已用翻译 key 清单 |
| `.rr-identity` | 左侧身份锚点、角色图像、存档配置说明 |
| `.rr-loadout` / `.rr-slot` | 一条共同基线上的五个固定位置，公共行高，无独立背景和卡片边框 |
| `.rr-rail` | 已知副词条累计，明确排除角色、武器、主词条；不伪装完整角色面板 |
| `.rr-evaluation` | 整体评分与集中问题摘要，明确最低贡献不是替换建议 |
| `.rr-inline-analysis` | 五槽之后唯一隐藏分析区域，1C 将沿所选槽位连接至此 |
| `.rr-conditions` | 实际模型条件、已知贡献小计与整套效率校正 |
| `css/role-register.css` | 根节点作用域内的连续工作面、对齐与换行规则 |

手动与导入记录只在 1A adapter 中解析不同的旧字段；两个 HTML 入口加载相同渲染模块。
renderer 不读取 `.mc-cost-list` 或旧 DOM。原 DOM 保留在未启用预览时使用；预览时隐藏并跳过旧 `mccost.js`／`mccost2.js` ready 回调及维护弹窗。
仍使用 `base.js` 中的目录和评分 API，并加载原 jQuery／Bootstrap 依赖；这不是全站去依赖改造。

## 数据与边界

- 五槽严格使用 `model.slots` 原顺序，不按 Cost 或得分排序。
- 每槽贡献条统一使用 `(value - scale.min) / (scale.max - scale.min)`。该尺度是角色总评分贡献，不是每颗独立满分 100 的质量分；上限由 1A 决定，至少为 100。
- 读数来自重新计算的 view model，忽略存档缓存得分；不引入 prototype 数值。
- `model.parameters` 新增生效模式、适用角色的额外效率和参考生命，用现有模型默认值与边界生成语言中立元数据，不变更公式。
- 空槽保留空间和位置，显示空槽／缺少数据；缺失数值为破折号。配置不完整时不补零、不选最低贡献槽、不作替换建议。
- 未知模型显示无法判断与本地化问题；已知副词条仍可累计，但注明范围。
- 已有完整三语实体名称使用 `characters.*`／`echoes.*`。尚未翻译的实体显示本地化类型加稳定 ID，不回退到中文名称；完整实体目录翻译仍是后续工作，旧自定义名称保留在 legacy 数据中。
- 角色 1 使用已确认 prototype 的立绘，其余角色继续使用现有肖像；缺图隐藏破损图标，文本身份与数值保留。全角色立绘资源整备不在本检查点内。

## i18n 与存档

新增界面文案使用 `register.*` 与既有业务命名空间。renderer 对当前语言缺 key 直接报错，不静默借用繁中。
数字和单位由 1A.5 formatter 输出，语言选择会重绘相同模型并更新 `html.lang`，不重算或保存配置。
没有存档迁移、格式变更、评分算法修改或角色存档写入；唯一写入为用户选择的 `wuwa.ui.locale`。
所有新增维护注释使用简体中文。

## 验收

- `node tests/role-register.test.cjs`：手动／导入等价、五槽与唯一隐藏区域、共同尺度、缺数据／未知模型、全部模型模式、三语 key、转义、Desktop 开关和仅语言偏好写入。
- 既有 `i18n.test.cjs`、`role-view-model.test.cjs`、`character-chain-scoring.test.cjs`、`new-character-scoring.test.cjs` 回归。
- 浏览器在 1440px 检查繁中、简中、英文，两个正式 HTML 预览入口和实时语言切换；测试记录是按既有格式构造的 QA fixture，通过真实评分函数计算，不是用户真实账号导入验收。后者留给 1D。
- 额外检查 1100px 英文换行，标签／值分行且字号不因语言缩小。
- QA 记录仅通过测试脚本显式输出到独立目录，不捆绑在正式页面，也不会自动写入用户存档。

## 文件清单

新增上述四个 JS/CSS 模块、`tests/role-register.test.cjs`、本文件和 `image/register/` 素材说明及六张图片。
修改 `mccost.html`、`mccost-readonly.html` 的资源入口；`js/mccost.js`、`js/mccost2.js`、`js/base.js` 各增加一处预览保护；`js/role-view-model.js` 增加模型条件元数据；`js/i18n-dictionaries.js` 补充三语文案。
