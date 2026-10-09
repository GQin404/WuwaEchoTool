# Register Secondary Workspace Final Refinement

验收日期：2026-10-09。未部署，等待最终产品人工验收。

## 范围与实现

- 声骸库采用紧凑索引与唯一 Inspector。搜索、Cost、套装、主词条及完整度筛选不写入存档，不引入全局声骸评分。
- Inspector 集中编辑、加入角色、角色比较和删除。加入规则沿用 CharacterCore：手动角色、下一可用位置、五颗上限及 12 Cost 上限。
- 比较入口传递角色、位置、原声骸 identity 与库中候选 identity。RoleCandidateSurface.fromLibrary 复用原 open/enter、候选 adapter、baseline 校验和 draft 创建。源数据不可靠时不能直接进入比较。
- 比较记录按进行中、需要重新比较、已失效分组，组内按更新时间排序。只有重新验证为 valid 的记录才请求既有 RoleCompare 结果；失效和不完整结果不展示虚假 Δ。
- 数据管理保留核心、草稿、采用记录三个既有格式。默认下载和选文件恢复，JSON 放在折叠的进阶区。恢复继续使用原确认与 service 校验；完成后刷新数量。
- Tool Station 切换概率、模拟、规则三个模式，保留同一 shell 和内容区。概率、开孔、资源及权重调用原 core/API。当前工具模型条件明确显示为共鸣链 0、默认条件；未新增计算能力。
- register-secondary-views.js 提取声骸库、备份与历史 presentation；register-workspace.js 继续编排服务与事件，register-tools.js 维护工具 presentation 状态。
- 导航顺序：角色工作台、声骸库、比较记录、工具、数据管理。
- 手机 Inspector 为全宽详情，隐藏列表和筛选，返回恢复原行焦点。桌面保持右侧 Inspector。

## 不变边界

本轮没有改动 Classic UI、mcData schema、base.js、RoleViewModel、计分公式、概率/模拟 core、导入 API、图片 catalog 或备份格式。图片继续读取原 cost catalog imgCode；角色图片规则不涉及本轮。

工作区原有未提交修改包含更早的图片、Classic 切换与分享修复，不能将当前总 diff 全部归入本轮。

## 验证结果

- `node --test tests/*.test.cjs`：19 个测试文件通过。
- 包含 126 个冻结旧版概率用例、100 组五词条模拟、评分回归、草稿/采用备份往返、损坏数据与冲突处理、Classic 路由及语言隔离。
- 新 presentation 测试覆盖三语完整 key、五种筛选、共享图片源、重复 identity 按钮禁用、唯一 Inspector、JSON 默认折叠、失效历史不生成继续草稿链接和输入不可变。
- 浏览器：声骸库选择候选并选择角色位置 03，进入原角色 Compare；不完整候选显示 insufficient-data，不给出替换结论。
- 浏览器：已知暴击后目标暴击为 100%，剩余开孔和资源同步；模拟下一孔与重置正常；切换英语后保留模拟词条及数值。
- 浏览器：手机 Enter 选取进入详情，返回后恢复原行键盘焦点。
- 浏览器：取消恢复确认；未执行核心数据覆盖。JSON 下载按钮更新成功状态且无控制台错误，但嵌入浏览器未返回 download 事件，因此本轮不宣称已验证下载文件在磁盘落地。需在正式浏览器人工验收下载与选文件恢复整条链路。
- 三语 × 四页 × 1440/390px 共 24 组 DOM 宽度检查无水平溢出，结果位于 artifacts/secondary-workspace/layout-checks.json。选中 Inspector 英文手机宽度另行检查通过。
- 代表性桌面/手机截图位于 artifacts/secondary-workspace/。

数据仍为 representative fixtures；真实玩家数据验收 1D.5 继续待补，不将其描述为真实帐号验收。
