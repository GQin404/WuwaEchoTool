# Register / Classic 双界面发布计划

## Milestone 1

Decision-first Compare。保留 `view=register` 预览；不切换默认入口。Phase 1 为 Engineering Complete / Real-data Acceptance Pending，真实玩家数据可用后补 1D.5，不重做架构。

## Milestone 2：双入口 + Character Dock

`index` 作为统一入口。没有 URL 指定和已存偏好时，询问 Resonance Register / Classic View。显式选择保存 `wuwa.ui.view = register | classic`，提供始终可访问的切换入口。

优先级：合法 URL view > 保存的 UI preference > 首访询问。URL 指定只影响当前访问，不永久覆盖偏好；只有用户显式切换/选择才保存。未知值忽略。临时导航应保留角色上下文与 locale。

新旧界面共用 mcData、角色、声骸、评分入口、备份/还原与 i18n。UI preference 独立存储，不写入角色。Classic 保留长期支持，不做自动淘汰或数据迁移。

Mobile Register 未完成时，尺寸不支持则安全显示 Classic，并解释当前界面；不覆写 Register 偏好。返回支持尺寸后按偏好/URL 解析。需避免 resize 循环跳转和未保存草稿丢失。

Character Dock 接入最近角色与本地草稿入口；必须明确当前查看的是来源配置还是本地试算，不能把本地采用暗示为游戏装备更新。

## Milestone 3：Mobile + 工具整合 + rollout

实现 Mobile 专用信息编排和比较，整合工具与模式导航。统一 Phase 2 数据备份/还原、采用引用清理、失效提示与返回上下文。覆盖键盘、reduced-motion、长英文、断点 fallback 和 Classic 回归后发布双入口。

每个 milestone 完成统一验收一次，不拆成细小审批点。Milestone 1 完成后停止，等待用户确认再进入 Milestone 2。
