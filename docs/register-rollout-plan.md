# Register / Classic 双界面发布计划

> RC2 当前规则（覆盖下方里程碑历史方案）：根目录及不带合法 view 的 index.html 每次显示双入口，不读取历史偏好自动进入。明确的 ?view=register / ?view=classic 用于内部界面导航；不需要 hosting redirect。Classic 固定简体中文，Register 和 chooser 三语。当前实现及验收见 [RC2 验收](rc2-acceptance.md)。

## Milestone 1

Decision-first Compare。保留 `view=register` 预览；不切换默认入口。Phase 1 为 Engineering Complete / Real-data Acceptance Pending，真实玩家数据可用后补 1D.5，不重做架构。

## Milestone 2：双入口 + Character Dock

`index` 作为统一入口。没有 URL 指定和已存偏好时，询问 Resonance Register / Classic View。显式选择保存 `wuwa.ui.view = register | classic`，提供始终可访问的切换入口。

优先级：合法 URL view > 保存的 UI preference > 首访询问。URL 指定只影响当前访问，不永久覆盖偏好；只有用户显式切换/选择才保存。未知值忽略。临时导航应保留角色上下文与 locale。

新旧界面共用 mcData、角色、声骸、评分入口、备份/还原与 i18n。UI preference 独立存储，不写入角色。Classic 保留长期支持，不做自动淘汰或数据迁移。

Mobile Register 未完成时，尺寸不支持则安全显示 Classic，并解释当前界面；不覆写 Register 偏好。返回支持尺寸后按偏好/URL 解析。需避免 resize 循环跳转和未保存草稿丢失。

Character Dock 接入最近角色与本地草稿入口；必须明确当前查看的是来源配置还是本地试算，不能把本地采用暗示为游戏装备更新。

## Milestone 3：完整 Register 体验 + Interface Guide + Mobile + rollout

### 首次引导 / Interface Guide

首次进入 index 且没有有效 `wuwa.ui.view` 时，将 Milestone 2 的简单选择升级为简洁界面导览。保留已确认的 URL override 优先级：合法 `?view=register|classic` 直接进入指定界面，不因此写入偏好。无 override、无偏好才自动打开导览；已有偏好不重复播放。

导览最多 2～3 个简短步骤，不做大型 wizard。可将比较与选择合并在同一步：

1. 欢迎：介绍鸣潮角色／声骸分析工具，以“选择你习惯的使用方式”为核心，说明两个界面共用数据与计算。
2. 比较：展示两种界面的实际视觉与工作方式。
3. 选择并进入：明确“使用 Resonance Register”和“使用 Classic View”CTA，选择即保存 preference 并进入，不追加第二次确认。

Register 定位为新版分析工作台：角色与五槽一体化、单颗原位分析、Candidate Compare、Decision-first 结果、本地草稿／试算配置，后续新分析功能主要在此发展。可标记“推荐给第一次使用”或“新版分析体验”，作为视觉焦点，但不能自动替用户选择。

Classic 定位为正式支持的熟悉操作方式：保留角色与声骸原流程，适合习惯原版的用户；核心数据与评分与 Register 共用。不描述为不推荐、即将淘汰或无法使用。

必须明确展示：“之后可以随时切换，不会影响角色数据或计算结果。”说明不需要重新导入角色，不会数据分家或因为界面选择出现不同评分。

两侧提供真实界面缩图、静态局部 mock preview 或实际 UI 示意：Register 展示角色 + 五槽 + 原位分析，Classic 展示现有角色操作画面。不得使用抽象插画、假 Dashboard 图标替代；如用示例数据，明确它是预览，不冒充用户存档。Preview 有适当文字说明。

设置提供“重新选择界面”，主动打开同一导览；打开或取消导览不改变现有偏好与角色上下文，只有明确选择才保存。返回用户默认直接进入上次界面。

全部文案、预览标签与说明支持 zh-TW / zh-CN / en，英文通过换行和合理布局适应长度。两个选项均支持键盘与清晰 focus，不只靠颜色表达差异；reduced-motion 下无需动画即可理解和完成操作。

### Register-native 完整操作流程

Milestone 2 中 Register 跳到 Classic 创建／编辑页面是过渡行为，不是最终设计。Milestone 3 必须补齐：

| 流程 | 最终要求 |
| --- | --- |
| Create | Character Dock → Register 创建界面 → 显式保存 → Register 角色分析 |
| Import / Reimport | Register 内完成输入、验证、角色选择、进度、错误处理；成功返回角色上下文并重新验证 selection / draft |
| Edit Echo | Register 编辑 presentation，保留角色、槽位与返回上下文；取消不保存 |
| Add Echo | 从空槽进入 Register 新增／选择流程，保存后返回对应槽位 |
| Echo Library | 完整声骸库管理提供 Register presentation；与现有原位候选选择器共用 adapter |
| Backup / Data Management | Register 内完成核心及专属数据的备份／还原，明确覆盖范围；整合现有独立 JSON 导出／恢复 |
| Tool Integration | 顶部比较、概率与其他工具纳入 Register 导航与界面，不意外进入 Classic 专用页面 |

Classic 保留完整原体验。抽出共用 service / controller / adapter，集中建立、导入、编辑验证、评分和存档规则；两套 presentation 调用同一核心，不复制第二套 business logic、mcData 或评分公式。不得仅把 Classic modal 搬入 Register 充作完整的新流程。

首次界面选择、语言和界面设置可以永久作为中立共用入口；工具可共享内容组件，但正常操作应保留用户选择的 presentation 与导航。只有明确切换界面才进入另一种体验。

### Mobile、数据整合与发布

完成 Mobile 专用信息编排、角色分析与比较，统一 Phase 2 备份／还原、历史草稿管理、孤立采用引用清理、失效提示与返回上下文。Mobile Register 完成并通过验收后移除临时 Classic fallback。保留 Classic 长期支持。

### Milestone 3 验收条件

- 新用户在短导览中能理解 Register / Classic 差异，两个界面均有实际 visual preview。
- 明确传达共用数据、共用计算、随时切换、无需重新导入；Classic 正式支持，Register 为未来新分析功能主要方向。
- 用户必须主动选择；选择后保存且不重复显示；设置可重新打开导览，无第二次确认。
- URL override 不修改永久偏好；locale、view preference 与角色数据互相独立。
- 导览、预览标签与功能说明三语完整；Desktop / Mobile 长英文不溢出；键盘、focus、reduced-motion 通过。
- Register 从建立／导入到分析、编辑、新增、声骸库、比较、备份和工具操作，全程不意外落入 Classic UI。
- Classic 完整流程回归通过，两种 presentation 共用同一套数据、规则、评分与存档；明确保存之外无数据写入副作用。
- 返回时角色、槽位和 locale 上下文合理保留；编辑、重新导入、还原后重新验证 draft，不使用 stale / incompatible 结果。
- Mobile 专用体验、备份边界与最终 rollout 回归完成。真实玩家数据可用后补 1D.5，仍独立标记 Real-data Acceptance Pending。

整个 Milestone 3 一次完成后统一验收，不为 Interface Guide 或其他上述工作另拆小 checkpoint。本次仅更新 scope，不开始 UI 实作。

## Milestone 3 实现记录（2026-10-08）

完整 Register workspace、共享 Core/Import/Tool 服务、Mobile 专用编排与 Interface Guide 已实现。移除临时 Mobile Classic fallback；URL override 仍不覆盖永久偏好。Classic 内部导航显式保留 Classic。详细验收证据、人工确认进度和发布边界见 `milestone3-acceptance.md`。未部署，完成最后验收后才决定正式 rollout；真实玩家验收继续独立保留为 1D.5。
