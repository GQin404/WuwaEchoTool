# Final Acceptance Fixes — Release Candidate

本批仍是待产品最终验收的 Release Candidate，未部署，未视为正式批准。

## 完成范围

1. 首次入口改为独立双入口页面；简短说明始终可见，hover / focus 展开真实界面预览，触摸布局直接显示预览。
2. 移除持续占位的全局切换条。Register 设置包含语言、界面导览与 Classic 切换；Classic 页尾提供 Register 入口，固定使用简体中文，不覆盖 Register 语言偏好。
3. 角色页面包屑提供工作台及角色总览链接和焦点状态。
4. Dock、角色、声骸库、备份及工具共用 Register shell；手机使用底部导航，分析操作区避开导航。
5. Register 支持删除角色：确认对话框默认聚焦取消，确认时检查来源是否变化，再调用 Classic / Register 共用 CharacterCore.removeRole。保留声骸库；历史 draft 不自动删除，恢复时重新验证来源。
6. 新增和编辑声骸提供实时头像、名称及 Cost 预览，图片失败显示说明。
7. 角色分享视图输出 1440 × 1150 PNG，包含角色、模型条件、五槽、配置分数、副词条合计和点评。明确区分声骸评分与 DPS，分享模块只读取 view model，不保存或重算角色。
8. shell、入口和分享统一使用简洁三条竖线标识，保持连续配置带，不增加卡片网格或发光装饰。

## 验证

- 16 个 tests/*.test.cjs 全部通过；408 个三语 key 一致。
- 包含 280 对合成手动 / 导入配置交叉比对、840 次三语渲染及评分校正测试。
- 新测试覆盖删除来源冲突、重复 identity 拒绝、声骸库隔离、分享快照不可变、incomplete 分数保留 null、Classic 语言隔离及三语操作入口。
- 浏览器：1440px 三语入口无水平溢出，两个真实预览、无 Register shell；键盘 focus 展开 Classic 预览。
- 浏览器：Register 英文偏好经过 Classic 简中后仍保留；Classic 原有首次提示可能需要先关闭。
- 浏览器：390px 角色分析无水平溢出，只有一个 inline analysis，分析操作区距底部 96px。
- 浏览器：新增声骸头像实际加载成功、标题 Add Echo、只有一个 shell。
- 浏览器：创建专用测试角色、取消删除、确认删除并返回 Dock；删除后核心备份与创建前逐字相同。
- 分享 PNG 实际下载并检查成图：1440 × 1150，313588 bytes，五槽与 72.34 配置分数一致。浏览器自动化未收到 download 事件，但下载目录文件证明输出完成。
- git diff --check 通过。

## 数据边界与限制

mcData schema、评分公式及模型未改动；删除是明确确认后的核心写入，分享及切换不写角色数据。所有验收角色均为 representative fixtures / synthetic datasets，真实玩家资料验收 1D.5 仍待补做。

外部头像受网络及 CORS 影响；无法载入时分享保留数据并提示图片缺失。实体名仍允许使用既有目录名称 fallback。没有执行线上部署或宣称真实账号验收完成。
