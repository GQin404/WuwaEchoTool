# Milestone 3：完整 Register 流程与验收记录

## 实现边界

Register 使用 `register-workspace.html` 提供 Create、Import/Reimport、Echo Edit/Add、Echo Library、Backup、比较历史与工具的独立 presentation。角色分析仍由原手动/导入页面的 Register rendering/controller 共用入口承载，Classic 保留原界面。

新增共享模块：

- `character-core.js`：创建记录、读取副本、来源冲突检查、显式事务提交、声骸新增/编辑/移入库/装备、核心备份校验。评分仍调用 RoleViewModel 对既有 scoring API 的适配器。
- `role-import-core.js`：原导入转换及属性规范化函数的共享入口；Classic 包装器继续使用同一实现。
- `import-service.js`：共享绑定、角色列表与详情请求。失败不提交角色；网络详情是未保存副本，由调用方显式提交。
- `echo-tool-core.js`：原概率算法、逐轮舍入、模拟和资源回收计算的共享入口。修正模拟池顺序避重时可能越界的问题，不改变角色评分。
- `role-history.js`：显式删除草稿、清理孤立采用引用；两个独立命名空间写入失败时尝试回滚，不写 mcData。
- `register-tools.js` / `register-workspace.js`：Register presentation，输入与 locale 状态不作为 domain identifier。

没有修改 mcData schema、评分公式或旧数据 identifier。`base.js` 的变更仅限制 Classic 公告弹窗的挂载范围；Register 和首次导览不会挂上 Bootstrap 公告。旧中文属性名仍由共享兼容边界转换，不在此次大规模迁移。

## Routing 与导览

优先级不变：URL override > `wuwa.ui.view` > 首次导览。URL 不持久化选择；用户明确切换才保存。`wuwa.ui.locale` 独立保存。

首次导览为一个简洁的欢迎、比较、选择画面；使用本机 synthetic 配置的实际 Register / Classic 缩图，明确共用数据与评分、随时切换、Classic 长期支持及 Register 的新功能发展方向。已有偏好不重复播放，顶部可重新打开。导览取消或完成后支持回到角色或 Register 工具上下文。

旧 Echo 编辑器、声骸库、比较及工具 URL 在 Register 模式下进入原生 workspace。显式 Classic override 保留 Classic，Classic 内部工具导航显式携带 `view=classic`，防止保存的 Register 偏好覆盖当次 Classic 导航。尺寸变化不再重载为 Classic。

## Mobile

角色身份移到上方，五个固定位置仍保留共同基线与贡献尺度。详细词条在选中槽位下方展开；比较差异变为带 Current / Candidate / Delta 标签的逐项行。底部导航、原位操作列、候选 bottom sheet、横向滑动槽位与 reduced-motion 支持均限定在 Register。

390px 英文验收发现 workspace 底部导航换行高度超过操作列预留，已统一为 96px 加 safe-area。角色分析底部导航实测约 53px，原位操作列预留 58px。

## 备份与历史

Register 的统一数据管理页面明确分开导出/恢复：

1. 核心角色与声骸：与 Classic 相同的 mcData JSON。
2. 草稿：`wuwa.echoTool.drafts.v1`。
3. 本地采用记录：`wuwa.echoTool.localConfigurations.v1`。

当前使用可复制的 JSON 文本区，不合并成会破坏旧备份兼容性的包。导出不包含登录凭证和界面偏好；切换语言保留文本区内容。恢复需要显式确认与校验，核心来源变化拒绝覆盖。恢复草稿后继续比较仍重新验证 baseline。

历史列表区分 valid / stale / incompatible。失效记录不会直接继续旧结果；删除草稿时清理不再使用的 baseline 和相关采用引用，也可单独清理孤立引用。

## 已完成的浏览器验收

全部使用 localhost synthetic fixture，不是真实玩家验收。

- Register 创建手动角色 → 五空槽与 incomplete；从空槽添加 Echo → 保存返回同一槽位原位分析。
- Register 编辑位置 03 暴击 9.3% → 9.9%；总分 72.12 → 72.34，槽位贡献 9.59 → 9.81。Classic 读取相同总分。
- 声骸库 90001 加入测试角色 103，库记录移出，角色分数缓存 9.59；Register 返回位置 01，始终一个 inline analysis。
- 编辑页面取消返回保留该位置，未提交编辑。
- Mobile 390px：位置 03 选取、clone candidate、修改为 10.5%、建立 draft，得到副词条评分增加 0.22、暴击增加 0.6 个百分点；未自动采用。
- Compare 切换三语保留槽位与唯一原位区，无横向溢出；键盘 focus 可见。
- Desktop 1440px 导览三语、Mobile 390px 英文导览无横向溢出；两张实际 preview 正常加载；Enter 可选择界面并回到来源工具页面。
- 390px 工具三语无横向溢出，切换语言保留概率输入与输出。模型范围明确是零链、默认机制、旧工具概率假设，不宣称 DPS。
- 核心、草稿、采用记录实际导出成功；Desktop 与 Mobile 英文备份页无横向溢出，切换语言时三个 JSON 逐字不变。
- Register 不再出现 Classic 公告。正式账号网络导入未发送请求，不要求 token。

原生确认框无法由当前浏览器工具可靠控制；库装备已经通过人工确认后的页面与导出数据验证。核心备份原样恢复的最后人工确认尚待回覆，不能把这个 UI 步骤描述成已完成。

## 自动化结果

15 组 `tests/*.test.cjs` 全部通过，含：

- 280 对代表性手动/导入配置与旧页计算交叉验证；840 次三语 selected render；266 个非零整套共鸣效率校正。
- 42 组既有链数/模式、91 组新增角色机制场景。
- 126 组抽取前概率工具固定输出；100 次五词条模拟无重复/越界；六种强化阶段资源投入/回收/损失/剩余与旧计算一致。
- 共享核心事务、取消不写入、来源冲突、Cost 限制、重复 identity 拒绝；synthetic API 响应导入及实际转换器评分一致。
- 历史清理失败回滚、损坏草稿保护、损坏核心存档的显式恢复、备份来源冲突。
- 383 个三语 key 一致，Register rendering 实际使用的 97 个 key 三语完整；locale 不修改计算和角色存档。
- 32 种入口组合、双向 URL 适配、原 Classic 编辑/新增回调及返回路由。

JavaScript 语法检查通过；Git diff whitespace 检查通过。

## 最终验收边界

- 尚未发布到 production。代码入口策略已实现，不以自动淘汰 Classic 的方式 rollout。
- 新增 UI 文案三语完整；角色/声骸实体名称无字典项时仍使用源目录名称 fallback，不伪造未经核对的英文名。
- 真实玩家资料和真实认证网络往返没有可用样本：保留 **Engineering Complete / Real-data Acceptance Pending** 与未来 `1D.5 Real-data Acceptance`。
- 全平台实机兼容性不能由单一内嵌浏览器证明；当前证据为 Desktop/Mobile viewport 验证、现有回归及共享核心测试。
- 本机测试修改仅涉及 synthetic fixture；原始会话备份仍位于早期 QA 分页 sessionStorage，浏览器错误页限制导致该副本尚未恢复。不得宣称所有本机 fixture 已恢复。
