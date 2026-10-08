# Phase 2A：Baseline / Draft Data Model

本阶段只新增独立数据模块和测试，没有挂载到 HTML、正式角色页、register controller 或备份 UI。Phase 1 状态仍为 Engineering Complete / Real-data Acceptance Pending；1D.5 保留。

## 模块边界

- `js/role-draft-model.js`：纯数据 UMD 模块。接收 role-view-model v2，投影不可变基准、候选和单槽草稿；提供校验、有效性判断及试算输入组合。不访问 DOM、storage、时钟或评分 API。
- `js/role-draft-storage.js`：显式注入 Storage 接口，仅访问 `wuwa.echoTool.drafts.v1`。不会自动初始化，不读写 mcData。
- 时间使用调用方传入的 Unix 毫秒；ID 使用调用方生成的唯一字符串，后续入口应使用 UUID，不把时间戳、翻译文案或数组下标当作唯一身份。

## Baseline schema

```json
{
  "schemaVersion": 1,
  "id": "baseline-uuid",
  "version": 1,
  "createdAt": 1791417600000,
  "expiresAt": null,
  "sourceRevision": "source-revision-token",
  "modelVersion": "scoring-model-revision",
  "viewModelVersion": 2,
  "role": {"identity": "123", "catalogId": "1", "source": "manual"},
  "conditions": {"chain": 0, "mode": "default", "extraEnergy": null, "referenceHealth": null},
  "modelStatus": "available",
  "identityState": "reliable",
  "slots": [{"position": 1, "echo": null}]
}
```

以上 slots 为结构缩写，实际校验要求严格按位置 1–5 保存五项。空槽为 null。`source` 为 manual / imported。

配置经过深拷贝和递归冻结。原始中文名称、legacy 字段、图片、已计算分数和缓存分数不进入快照。模型由 `modelVersion` 加有效条件固定；不复制包含旧中文键的权重对象。评分实现／数据表变化时，维护者必须更换 modelVersion。后续计算适配器必须校验版本，不允许用新模型静默计算旧基准。

`sourceRevision` 是调用方必须提供的、与 locale 无关的来源修订 token。重新导入、编辑或替换源配置时应更新，即使导入后数据值碰巧相同也可以识别发生过更新。当前旧存档没有这个字段，本阶段不向旧存档补字段；后续集成层在独立来源修订边界管理。不能每次渲染随机生成 token，也不能用语言或格式化数字生成。

即使 sourceRevision 未变化，五槽语义数据发生改变也会判为 stale。比较使用键排序后的完整结构相等性，不依赖短哈希或数组重排。baseline 的 version=1 表示该不可变快照的版本；更新来源后应新建 baseline ID，不能就地覆盖。存储层拒绝同一 baseline ID 的不同内容。

## Candidate representation

```json
{
  "schemaVersion": 1,
  "id": "candidate-uuid",
  "source": "inventory",
  "sourceRevision": "inventory-revision-token",
  "echo": {
    "identity": "999",
    "catalogId": "52",
    "cost": 3,
    "suiteId": null,
    "mainStat": {"key": "resonance_efficiency", "unit": "percent", "value": 32, "status": "valid"},
    "substats": [],
    "completeness": "incomplete"
  }
}
```

Candidate 是捕获时的不可变候选数据，不是随声骸库变化的活引用。候选改变时重新创建或替换 draft.candidate。source 为 manual / imported / inventory。构建时必须提供完整候选身份范围 identityScope；候选实例缺失或在范围内重复时拒绝创建。导入目录 ID 和本地目录 ID 不被视为实例身份。

所有属性只保存稳定 stat key、单位类型、原始 number、语义状态；百分比使用 32 表示 32%，不保存 `%`。未知套装 ID 为 null，不从名称或图片猜测。未知属性保留 unsupported/invalid 状态，不把显示名称作为 key；完整性校验防止缺词条被伪装成 complete。

## Draft schema

```json
{
  "schemaVersion": 1,
  "id": "draft-uuid",
  "baseline": {"id": "baseline-uuid", "version": 1},
  "targetSlot": 3,
  "originalEchoIdentity": "602",
  "candidate": {},
  "modelConditions": {"chain": 0, "mode": "default", "extraEnergy": null, "referenceHealth": null},
  "createdAt": 1791417601000,
  "updatedAt": 1791417601000,
  "status": "active"
}
```

candidate 为上述完整结构的缩写。草稿只保存单槽替换、候选快照及试算模型条件，不复制整份角色或 mcData。多个草稿共享一个 baseline。同一槽位允许建立多个独立草稿，ID 不同。`updateDraft` 返回新对象，不修改旧对象。

targetSlot 和 originalEchoIdentity 必须共同匹配。空槽的 originalEchoIdentity=null；有缺失／重复实例的基准可以保存为 ambiguous 快照，但不允许创建可组合的草稿。候选已在另一个槽位装备时拒绝组合，避免一个实例重复占槽。

`status=active` 是持久化生命周期状态；valid / stale / incompatible 是每次根据当前来源计算的有效性，不能从存档读出一个历史 valid 就直接采用。放弃未保存草稿只需丢弃对象；保存过的草稿通过 storage.remove 删除。

## 有效性与试算入口

`assess(baseline, draft, currentBaseline, now)` 返回 `{status, reason}`，reason 是稳定 code：

| 状态 | 条件 |
| --- | --- |
| incompatible | 结构损坏、身份不明确、角色／来源不一致、模型版本改变、模型不可用、共鸣链／有效模式／机制条件不同 |
| stale | sourceRevision 改变、槽位顺序／实例／属性数据改变、expiresAt 到期 |
| valid | 身份可靠、相同角色与模型条件、基准未过期、来源及五槽配置未变 |

incompatible 优先于 stale。草稿自己改变模型条件也会要求重新比较，不能把不同模型的结果直接当作同条件提升。expiresAt=null 表示不按时间失效，但仍检查来源；不自动删除过期草稿。

`materialize(baseline, draft, currentBaseline, now)` 内部再次 assess，只有 valid 返回新的 `{role, modelVersion, conditions, slots}` 语义试算输入，否则抛出 reason code。它不生成旧角色存档，也不调用评分或保存。评分兼容转换、采用确认、批量多槽操作和 Compare UI 均不在 2A 范围。

调用方必须重新读取当前来源并构建 currentBaseline，不能用旧 baseline 代替当前来源来绕过检查。恢复备份后同样如此。重新比较应创建新的 baseline／draft，不提供静默 rebase。

## Storage / backup / migration

独立 key：`wuwa.echoTool.drafts.v1`；envelope schemaVersion=1：

```json
{"schemaVersion":1,"revision":0,"baselines":[],"drafts":[]}
```

- load：不存在则返回空数据，不落盘。JSON 损坏、孤立 draft、重复 ID、字段错误或未知 schema 返回错误，保留原始内容，不自动清空。
- save：同时校验 baseline 和 draft。baseline 按 ID 去重且不可覆盖；同 ID 草稿只能在相同基准／目标／创建时间下更新。
- 所有写操作必须提供 load 得到的 expectedRevision，旧 revision 返回 STORAGE_CONFLICT。这是乐观冲突检查，不是 localStorage 的跨标签页原子锁；后续多窗口 UI 若需并发写，应在调用层增加 Web Locks 或等价串行机制，不能宣称当前具备事务隔离。
- remove：删除指定 draft，同时清理不再被任何草稿引用的 baseline，不接触角色数据。
- exportData / restore：仅用于独立草稿 envelope。restore 是显式整包替换，需 expectedRevision；先验证整包再写入，失败不写。损坏的现有 namespace 不允许被静默覆盖，未来恢复 UI 应先提供原始备份与明确重置流程。
- 当前没有前代草稿格式，因此不虚构 migration。未知版本 fail closed；未来版本使用显式迁移器，先保留旧 namespace，再验证新结果，不修改 mcData。
- 现有 mcdata.json 导出／恢复行为完全不变，目前不会携带草稿。未来完整备份可以添加并列 drafts envelope；旧角色备份仍可独立读取。

## 验收结果

`node tests/role-draft.test.cjs` 通过：

1. 手动／导入 baseline 创建均不修改源角色，递归冻结。
2. candidate／draft 创建和更新均不修改 baseline。
3. 删除草稿只写独立 namespace，mcData 字节不变。
4. 同角色两个 draft 可同时存储，共享一份 baseline。
5. 编辑属性、重新导入修订、槽位重排、过期分别识别 stale。
6. 不同共鸣链、支持模式、extraEnergy、referenceHealth、模型版本识别 incompatible。
7. 缺失／重复身份、可见五槽之外的重复数据、目标不匹配、候选重复装备均阻止错误组合。
8. 三语格式化不改变 baseline、draft、identity 或语义试算输入。
9. 旧 mcData 不变，所有草稿写入均限定到独立 key。
10. 损坏 JSON、未知版本、孤立引用、重复 ID、拒绝存储、写入配额失败均安全回报；备份往返和 revision 冲突检查通过。

另外重新执行原有八个测试脚本，全部通过。评分公式、正式页面、字典和原存档 schema 均未修改。真实玩家资料仍留待 1D.5，2A 完成后停止，不进入 2B。
