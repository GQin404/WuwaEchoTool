# 1C：槽位选择与原位分析

## 范围

继续使用 `&view=register` Desktop 预览入口。首页、Mobile、正式默认入口及 Candidate Compare 未改版。
模型条件仅影响当前预览中的计算，不写入角色存档；界面明确标记未保存，可恢复存档条件。

## 状态与身份

`js/role-register-controller.js` 是无 DOM、无存储依赖的共用控制器。手动与导入角色使用同一实现。

```js
{
  selection: {
    position: 3,
    echoIdentity: 'instance:602',
    kind: 'echo'
  },
  identities: { 1: 'instance:600', 2: 'instance:601', 3: 'instance:602' },
  notice: null,
  evidenceOpen: false,
  modelChanged: false
}
```

- 正常身份使用唯一 `costId`，同时记录逻辑槽位 `position`，不根据名字、图片、DOM 顺序或 Cost 排序判断身份。
- 缺失、空字符串、无效或重复 ID 使用源对象的 `WeakMap` 临时身份 `session:*`。仅在当前载入期间可保持选择；外部刷新后不恢复此身份，也不提供可能编辑错对象的链接。
- 空槽状态为 `{position, echoIdentity:null, kind:'empty'}`，不生成假声骸或假评分。
- 每个槽位和问题摘要都带上位置与身份，委托给同一个 `select(position, identity)`；过期身份不会选择新的声骸。
- 再次激活同一个槽位即收合。全局问题没有可靠槽位目标时，只展开计算依据，不改变选择。

## DOM 更新与可访问性

`role-register-page.js` 保留五个 `.rr-slot` 节点、唯一 `.rr-inline-analysis` 宿主与 `.rr-connector` 节点，更新内部展示内容和状态属性，不向页面追加分析面板。
连接线在原节点上调整 `left`，180ms 过渡；`prefers-reduced-motion: reduce` 关闭过渡，程序滚动使用 `auto`。

槽位使用原生 button，因此支持 Tab、Shift+Tab、Enter、Space；`aria-pressed`、`aria-expanded` 与 `aria-controls` 同步更新。
Selected 还使用文字与下划线，hover 使用虚线轮廓，键盘 focus 使用实线轮廓。
Escape 或收合按钮返回当前槽位焦点；问题摘要入口展开后把焦点移到分析标题。
语言切换保持控制器状态，仅重绘 presentation，包含隐藏标签和区域 `aria-label`，不调用 adapter 或写入角色数据。

## 真实分析数据

展示位置、实体名称／ID、实例 ID、Cost、主词条、主词条及固定贡献、每条副词条的实际值、模型系数、贡献和计分原因。
缺副词条保留缺失行；不完整数据明确区分于低分。未知模型只显示已有原始数值，系数／贡献为空，不生成建议。
候选比较按钮禁用，仅说明 Phase 2，不实现候选选择或比较计算。

## 模型刷新

链数、有效 damage mode、角色 51 的额外共鸣效率与角色 62 的参考生命使用已存在评分 API 重建 view model，不修改公式。
重算后按身份重新确认选择；同一唯一 ID 移至其他位置时跟随该实例，消失或身份模糊时清除并通过三语状态通知说明。
重算不排序；`pageshow`、窗口恢复焦点和 `mcData` storage 事件会检查源记录，仅在记录变化时重建。
本次模型条件只保存在内存，不扩展存档格式，不提前实现 Phase 2 的配置草稿。

## 编辑与新增返回

- 手动角色的独立“编辑声骸”链接带 `roleid`、`costid`、`returnRegister=1` 与 `rrPosition`，不把整个槽位变成编辑链接。
- 原编辑器保存、删除或移至声骸库后，经 `editorReturn()` 生成固定的本地角色页地址；没有开放任意 return URL。
- 新版收到 `selectedPosition`／`selectedEcho` 后核对唯一实例：可靠才恢复；删除或替换身份不可识别时回到总览。处理后移除临时 URL 参数。
- 原版编辑器仍按原有明确保存／删除规则写入，本检查点只调整返回路由，没有改变评分算法。
- 空槽主操作为“加入声骸”，转入现有新增流程；特殊 `registerAdd=1` 入口绕过旧初始化的排序／缓存回写，明确新增后按新实例 ID 返回新版分析。
- 现有新增流程按原数组末尾追加，选择后方空槽不会插入空洞或移动已有声骸；返回时定位实际新增位置。导入配置的空槽则提供更新导入数据入口，不把导入角色改造成手动配置。
- 既有编辑器／新增流程仍使用原界面语言；本次三语范围为新版角色工作面。

## 存储边界

槽位选择、收合、问题导航、依据展开、模型预览和语言重绘均不写入 `mcData`。
语言手动切换仍仅写 `wuwa.ui.locale`。独立编辑器中的明确保存与新增维持原有写入行为。
浏览器 QA 页面是显式生成、显式点击的合成测试数据入口，产品页面不会加载它。

## 验证结果

- `role-register-interaction.test.cjs`：30 组三语已选状态、任意五槽、切换／收合、模型与顺序不变性、实例移动／删除／身份冲突、空槽／缺数据／未知模型、所有已支持模式及机制边界。
- `role-register-editor.test.cjs`：执行真实旧编辑／新增回调，验证初始化及取消零写入、明确保存／新增才写入、原版与新版返回路由、顺序保持、新实例恢复参数。
- 原有 view model、renderer、i18n、两套评分回归保持通过。
- 浏览器 1440px：五个位置依次激活，坐标不变且分析区域恒为一个；Enter、Space、Tab、Escape 与问题入口通过；三语切换保持位置 03、面板展开与评分。
- 浏览器模型预览：链数变更使 QA 配置评分 71.01 → 71.37，同时保留选择。独立 QA 检查页确认选取、模型变更及语言切换后存档字节不变。
- 浏览器跨页 storage 更新：替换实例后清除选择并显示本地化通知。
- 浏览器编辑链接到达正确实例，但原版原生保存确认框令控制工具超时，完整点击保存返回仍待人工验收；不把回调单测宣称为浏览器端通过。
- reduced-motion 已实现 CSS 与滚动分支；尚未进行操作系统偏好切换的浏览器验收。

## 文件变更

新增控制器、交互测试、编辑／新增回调测试、独立 QA 生成脚本和本文件。
修改共用 page／renderer／CSS、三语 dictionary、两套角色 HTML 资源入口、`costedit.html`／`js/costedit.js` 返回桥接、`js/mccost.js` 的明确新增桥接，以及原 renderer 测试适配。
`role-view-model.js` 与评分公式未修改。所有新增维护注释为简体中文。

在 1C 停止，等待确认后再进入 1D。

后续补验：原生保存确认框已由用户人工确认，三语实际保存返回及身份失效情景均完成验证，结果见 [1C.5 验收记录](role-register-save-return-acceptance.md)。
