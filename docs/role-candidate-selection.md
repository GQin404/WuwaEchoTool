# Phase 2B：Candidate Selection & Compare Context

## 范围

仅启用 Desktop `view=register` 的候选流程，不替换正式默认入口，不实现 2C 差异、推荐、采用或角色保存。Phase 1 真实玩家验收仍为 pending；本次测试数据均为 synthetic fixture。

## 文件与边界

- 新增 `js/role-candidates.js`：无 DOM 的候选 adapter、适用性检查和 compare context 组装。
- 新增 `js/role-candidate-surface.js`：共用原位选择工作流，读取来源、保存独立草稿、恢复与重新验证。
- 修改 `js/role-register-page.js` / `js/role-register-renderer.js`：启用分析区按钮，接入选择、关闭、来源／模型失效和语言重渲染。
- 修改 `mccost.html` / `mccost-readonly.html`：加载共用模块；仍由既有 RoleRegisterMode 判断是否启用。
- 修改 `css/role-register.css`：候选行、编辑表单、context 摘要的局部样式，不改变五槽或角色布局。
- 修改 `js/i18n-dictionaries.js`：35 个 candidate namespace key，三语完整。
- 新增 `tests/role-candidates.test.cjs`；调整 `tests/role-register.test.cjs` 的独立界面依赖桩。

## Candidate adapter

`createAdapter(normalize)` 使用现有 normalize / 评分 API，不修改公式：

1. `fromRecord(record, role)`：支持声骸库手动字符串主词条及导入对象主词条。使用副本和当前角色模型计算数据完整度，不调用旧 DOM、modal 或编辑保存逻辑。
2. `editor(echo)` / `fromEditor(fields, role, newIdentity)`：编辑字段使用稳定 stat key 和未格式化数值。复制保留目录、Cost、主副词条及已知套装 ID；生成新 UUID 实例。手动新建选择目录后确定 Cost，再输入主副词条；未知套装保持 null，不猜测。
3. `eligibility`：检查实例唯一性、基准身份可靠性、是否占用其他槽位、模型可用、Cost 1/3/4、替换后总 Cost ≤12，以及主词条的 Cost 适用性。主词条缺失或不可评分时阻止建立；副词条不足／无效标记 incomplete，可查看但不生成结论。
4. `prepare`：通过检查后调用 2A createCandidate，得到不可变 snapshot。库中候选在确认前再读取一次；记录变更或 ID 重复时要求重新选取。

Cost 对应的主词条类型检查不改变评分函数，也不声称完整验证游戏内所有等级与随机档位合法性。该部分仍可在实际上游数据验收时补充。

## Selection state 与交互

```text
state = {
  phase: select | context | error,
  baseline,
  role,
  position,
  source: library | clone | manual,
  rows,
  fields,
  editorIdentity,
  notice,
  context
}
```

role 仅为当前角色的内存副本，用于兼容计算；不保存到 draft，不复制整份 mcData。列表行使用临时 UUID 查找，不以名称或 DOM index 识别候选。用于持久化的是候选 echo identity。

候选 surface 位于唯一 `.rr-inline-analysis` 内的分析内容之后。原角色、五槽、选中槽位与连接线继续存在。关闭／Escape 返回原 selected slot，不收合原分析；切换槽位会先关闭旧候选流程。表单数值通过 input 立即更新本地状态，避免提交依赖 blur/change 顺序。键盘操作沿用原生 button/select/input，重渲染后恢复相应控件焦点。

没有有效选择时的恢复错误会显示在工作面中，不创建第二个 inline analysis。异步步骤使用 epoch 防止旧选择覆盖新状态；等待存储锁期间关闭流程会取消写入。

## Baseline revalidation 与 draft 建立

1. 从当前唯一角色记录及当前预览模型条件建立 immutable baseline，记录 target position 和原实例。
2. sourceRevision 使用角色原始记录的 canonical JSON 的 SHA-256；语言不参与摘要。摘要仅用于变化检测，不把旧中文名称作为业务 identifier。
3. 模型版本固定为 `legacy-scoring-2026-10-08`。修改评分实现或模型数据表时必须更新此版本。
4. 选择候选后用 2A createCandidate / createDraft 建立本地对象。
5. 进入 context 前重新读取当前角色并执行 assess；获得存储锁后、写入前再次验证，写入完成后再确认一次来源。
6. stale / incompatible 清除可用 context 并提示重新建立基准／选候选，不自动 rebase。工作面已有来源刷新和模型条件事件也会使 context 失效。
7. 仅在用户明确选择候选／建立草稿后写入 `wuwa.echoTool.drafts.v1`，然后在当前 register URL 加入 `draft=<UUID>`。

当前 sourceRevision 是内容摘要，不能区分内容完全相同的两次导入事件；相同配置／条件仍可视为相同基准。实际旧导入通常重新生成 costId，会被检测为变化。摘要包含缓存字段，缓存变化也会保守判为 stale。没有为此增加旧存档字段。

支持 Web Locks 时，草稿保存按 namespace 串行；不支持时使用 2A revision 检查，不宣称跨标签页完整事务隔离。mcData 不参与这个锁，也不会被草稿流程写入。

## Compare context

```text
{
  baseline,
  draft,
  targetSlot,
  currentEcho,
  candidate,
  model: { version, conditions },
  validity: { status: valid, reason: null },
  eligibility: { status: ready | incomplete, reason },
  locale,
  register: { roleId, view: register, selectedSlot },
  conclusion: null
}
```

深拷贝并冻结 context 的数据。`getContext()` 在呈现边界返回当前 locale；locale 不写入 candidate 或 draft。当前仅显示 Current / Candidate 的身份、主副词条和完整度，不显示分数差异、推荐或采用按钮。

## 刷新恢复

仅当当前 URL 带 draft ID 时恢复，未增加草稿列表或自动猜测最近草稿。恢复前校验 namespace/schema、baseline 引用和当前角色：

- 来源摘要相同才恢复原预览模型条件；如果原来源已改变，不覆盖当前条件。
- 重新计算候选适用性，再运行 baseline assess，不信任持久化的历史 valid 状态。
- 使用 slot position + original echo identity 恢复分析；实例已丢失或歧义时不猜位置，显示错误。
- 缺失／损坏草稿返回明确存储提示，不修改角色数据。
- 关闭 surface 移除 URL 中 draft 参数，但保留已保存草稿；删除仍使用 2A storage.remove，2B 未新增删除 UI。
- 返回原版入口的 URL 会移除 draft 和 register 专用恢复参数。

## 验收

十个测试脚本全部通过（新增 role-candidates，原有九个回归脚本）。新增测试使用实际 adapter、2A model/storage、候选 surface 事件与异步摘要；DOM 桩只收集呈现内容。

| 验收项目 | 结果 |
| --- | --- |
| 任意已配置槽位进入选择 | 手动／导入 × 三语 × 五槽通过 |
| 关闭回到原 selected slot | 通过；浏览器 Escape 后保持位置 03、唯一分析区展开 |
| 库候选保留角色上下文 | 通过；重新读取候选也能识别变化／重复身份 |
| 复制／手动候选独立 snapshot | 通过；即时输入值进入新 candidate，原实例不变 |
| 创建 draft 无角色／baseline 副作用 | 通过；测试写入 key 全为独立 namespace |
| stale 阻挡 | 通过；浏览器修改合成源数据再刷新，显示重新建立基准提示 |
| incompatible 阻挡 | 通过；浏览器切换共鸣链立即撤销可用 context |
| incomplete 无假结论 | 通过；无副词条的库候选及手动候选均明确提示，conclusion=null |
| locale 不影响 identity | 通过；浏览器 en → zh-TW → zh-CN 后 UUID 不变 |
| 刷新重新验证 | 通过；可恢复原位置、模型与 draft，过期来源不恢复结果 |

浏览器人工操作额外确认：复制位置 03 的暴击从 9.3 改为 10.5 后，Current 仍为 9.3，Candidate 为 10.5；修改前一度发现输入事件顺序问题，已改为 input 同步并加入回归断言。浏览器独立 QA 审计显示整个候选操作与模型预览后 mcData 字节不变。故障注入与还原仅在临时合成 QA 页面执行，没有进入产品代码。

1440px 视觉复核通过：五槽共同基线保留，列表沿原分析区展开，无独立卡片网格。Mobile 不在本阶段范围。所有新增维护注释为简体中文，公式、mcData schema、旧备份行为均未修改。

完成 2B 后停止，等待确认再进入 2C。
