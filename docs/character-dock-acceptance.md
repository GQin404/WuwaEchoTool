# Milestone 2：Character Dock 与双入口

## 实现

- `ui-view.js`：纯 resolve + 浏览器入口，URL > 保存偏好 > 首访选择。URL 不写偏好；顶部显式切换才写 `wuwa.ui.view`。locale 独立保存在 `wuwa.ui.locale`。
- `character-dock.js` / `character-dock.css`：角色身份锚点、五槽共同尺度、真实模型评分与 issues、最近角色、最近一份比较状态。全部角色、搜索、来源筛选按需展开，不使用角色卡片网格。
- 最近角色只保存 ID 到 `wuwa.ui.recentRoles.v1`，不写入 mcData。没有角色显示导入/建立入口；创建使用共享 Classic 工作流，避免复制另一套 domain 编辑逻辑。
- 所有现有 HTML 加入全局切换入口与相同 i18n 基础。Classic 正文保持原操作与原文案，新增入口和 Dock 三语完整。
- `role-register-mode.js` 使用同一 resolve 结果，角色入口可按偏好进入 Register。显式 Classic URL 不被 Register 偏好覆盖。Classic 编辑返回保留 Classic，Register 编辑返回仍保留原槽位上下文。

## 数据与计算边界

两种界面读取同一个 mcData，无 schema 迁移、无评分公式副本、未修改 base.js。Dock 使用现有 role-view-model/scoring API。

旧 Classic 角色渲染曾在首次加载时保存校准缓存。现在初始化使用 `persist=false`：仍调用原计算函数显示正确结果，但只切换界面不写回存档。明确编辑和模型修改仍走原保存流程。首次选择和 Dock 跳过 index.js 旧初始化，不新建空 mcData、不弹出旧导入设置。

Register 导向手动建立时抑制无关的旧首页偏好弹窗，避免双 modal 重叠；不自动确认任何导入凭证或保存操作。

## Draft 恢复和备份

Dock 用当前源数据 SHA-256、现有模型版本、五槽和模型条件调用 RoleDraftModel.assess。valid 才提供带 draft ID 的继续链接；stale/incompatible 标为重新比较，不带旧 draft。进入比较后 role-candidate-surface 再验证一次，避免导航期间源数据变化。

主屏显示所选角色最近更新的一份 draft（含已采用状态），不是跨角色独立声骸库。采用记录仍不改变当前五槽和角色评分。

新增 adoption exportData/restore，与 draft 独立 export/restore 一并放在 Dock 折叠区。JSON 可复制保存；显式恢复替换对应集合，先校验，损坏存储不覆盖。恢复后重新验证；核心角色备份仍由原机制共享。Milestone 3 再统一完整备份 UX、下载文件、历史草稿管理与孤立采用引用清理。

## Mobile

1100px 以下 Register 安全回退 Classic，session 内说明一次，保存偏好不变。Desktop Register 缩窄时重新载入为 Classic；旧编辑器不因尺寸变化重新载入，防止丢失未保存编辑。Mobile Register 在 Milestone 3 完成后移除此临时回退。

## 验收

- 全部 13 组自动测试通过，含 32 种 URL/preference/尺寸组合、三语隔离、最近角色、Classic 返回路由、独立 adoption 备份损坏保护。
- 手动/导入 fixture：Dock assess valid、源编辑 stale、模型条件 incompatible；Classic 初始化不产生持久化写入。
- 保留 280 对 synthetic 新旧计算对照、840 次三语渲染、266 个非零整套校正、既有编辑保存返回测试。
- 浏览器：无偏好首次选择，三语可切换；选择 Register 后无 URL 再次进入 Dock；Classic URL override 不修改 Register preference；显式 Classic 切换后无 URL 进入 Classic。稽核确认切换核心数据保持逐字不变。
- 浏览器：空 fixture 显示 onboarding，无 0 分统计；通过共用 Classic 建立一个合成角色后，Register 读取同一新角色并显示五个空槽和 incomplete。
- 浏览器：源 fixture 暴击由 9.3 改成 9.9 后，Dock 总分 72.12 → 72.34、槽 03 分数 9.59 → 9.81，旧 draft 标记需要重新比较。
- Desktop 1440px 首次选择与 Dock 三语无水平溢出；Dock 英文内容宽度与 scrollWidth 同为 1425（滚动条除外）。截图检查共同配置带、角色图像和长英文换行。
- 390px 实测无 character-dock，显示 Classic；不强制缩小 Desktop 布局。
- 所有测试改动在独立 localhost fixture 副本操作，结束已恢复原 fixture、locale 和 UI preference。未使用真实玩家数据，1D.5 仍待补。

## 下一里程碑

Milestone 3：Mobile 独立编排、工具与导航整合、统一备份/还原 UX、草稿历史管理、最终 rollout 回归。Classic 长期保留，不进行自动淘汰。本阶段完成后等待用户验收。
