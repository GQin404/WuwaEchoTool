# Milestone 1：Decision-first Compare

## 数据边界

`RoleCompare.evaluate` 是无 DOM、无存储的计算解释层。输入 baseline、draft、fresh current、角色条件、normalize 与显式确认条件；输出 scope、validity、conclusion、targetSlot、rows、gains、losses、unknown、requirements、missing、breakdown。输入快照不修改，输出冻结。

范围固定为 `substats-only`。使用既有 normalize / getScoreDetails 的副词条贡献相加，不包含主词条和固定贡献，不把整套共鸣效率校正拆分到目标槽。不能据此声称 DPS 或完整配置总分提升。属性行也是副词条范围；ATK flat 与 ATK percent 分开。有效词条按现有模型 raw contribution > 0 计数。

## 结论顺序

1. baseline stale、模型 incompatible 或候选不适用：incompatible，不显示旧差值。
2. 基准五槽或候选不完整：insufficient-data，不把空值当零。
3. Cost / 主词条 / 声骸种类 / 套装不同或套装未知，要求 equipment 确认；充能变化要求 energy 确认；模型内属性损失或无法判定的变化要求 tradeoffs 确认。未确认则 needs-condition。
4. 条件已解决且副词条评分差正向：recommended；否则 keep-current。

确认是玩家对模型外适用性的明确声明，不是工具计算出了充能阈值。确认不能消除缺数据或失效状态。增加/减少保存在 direction，收益判断另存 judgement；不计分属性和充能变化保留 unknown。

## 工作面和操作

原五槽与连接线保留，唯一 inline analysis 内切换为结论、范围、收益/代价/未知、变化行。完整贡献、权重与未变化行渐进展开。比较中隐藏原单颗大表，返回时恢复。无 Current/Candidate 卡片网格。

- recommended：采用本地草稿，重新验证后保存采用记录。
- keep-current：关闭比较，保留原选中槽，不写角色。
- needs-condition：显示明确确认项；更改后重算解释结果。
- insufficient-data：候选缺数据返回独立候选编辑；基准缺数据返回分析并聚焦原版操作入口，由来源编辑/重新导入补齐，再建立比较。
- incompatible：重新建立 baseline 和候选选择。

compare 每次 render 检查来源摘要和模型条件；验证期间移除旧结论。相同输入缓存纯比较结果，语言切换不重新计分。draft 保存沿用 2B 的锁内重新验证；采用在独立 storage 锁内重新读取来源、检查草稿仍存在、重新计算并验证。异步摘要完成后再检查来源和模型未变，关闭/切换通过 epoch 取消。

## 本地采用与恢复

原 draft v1 schema 不变。新增 `wuwa.echoTool.localConfigurations.v1`：

```
{ schemaVersion: 1, items: [{ draftId, baselineId, signature, conditions, adoptedAt }] }
```

signature 是 baseline+draft 的稳定序列化，采用记录引用完整现存草稿而非复制 mcData。重新打开 URL 中的 draft 后必须重新验证 baseline，记录不能绕过验证。stale 后不显示“已采用”并停止使用旧结果。损坏存储不自动覆盖，采用失败保留来源和草稿。

既有 backup/restore 不变，仍不包含 Phase 2 命名空间；不能宣称采用记录已被旧备份覆盖。Milestone 3 应统一版本化导出、还原后来源验证与孤立记录清理。当前草稿删除不会修改角色；残留采用引用不用于物化配置。

## 验收记录

- 自动化：全部 11 个 *.test.cjs 通过。新增结论、评分入口一致性、百分点、充能不确定性、缺数据、stale/incompatible、采用与损坏存储隔离；实际 surface 事件测试三语采用、刷新恢复、失效后不展示采用结果。
- 保留 Phase 1 的 280 对手动/导入 fixture 与旧评分对照、840 次三语渲染、266 个非零整套校正场景。
- 浏览器 1440px：位置 03 暴击 9.3 → 10.5，显示 +1.2 pp；副词条评分 4.28 → 4.72，差 0.44；本地采用成功。来源总分仍 72.12、五槽未改变，唯一分析区。
- 浏览器繁中、简中、英文切换保留 draft 和采用状态，文档语言同步，英文页面 scrollWidth=clientWidth=1425（含滚动条后的内容宽度）。
- 数据均为 representative fixtures，非真实玩家账号。1D.5 仍为 Real-data Acceptance Pending。

本里程碑只改变 register 预览，不改变 production 默认入口、mcData schema 或评分公式。
