# v2.0 UI／UX 整体精修

本次基于工作区现有正式 v2.0 实现。没有修改评分公式、角色目录、共用计算规则、玩家存档格式或 Classic 页面；没有增加依赖，没有实现多套声骸，没有切换分支、提交或推送。

## 修改摘要与页面

| 页面／模块 | 实际变化与用户体验 |
| --- | --- |
| 共用视觉系统 | 沿用分析页的深色背景、青绿强调、细线与连续工作面；统一表单最小高度、数字对齐、复选框、禁用状态、弹窗和键盘焦点。主要按钮悬停保持可读的深色文字，成功回馈使用 status，错误使用 alert。作用域限定为 Register。 |
| 角色分析：手动／官方两个入口 | 整体评分和已有分析结论移至五槽前面；五槽顺序、共同评分尺度、最低贡献的解释和唯一原位分析宿主全部保留。总分与单槽分数固定两位小数，详细数值桌面右对齐。 |
| 手机分析 | 修复副词条标题被桌面 23% 栏宽限制的问题，直向详情标题使用全宽；状态行可随文字增高，320／360px 窄屏评分字体适当缩小，避免相邻槽位挤压。 |
| 声骸库／新增与编辑 | 保存后返回既有角色或声骸库上下文，并提供三语非阻断式保存回馈；库内删除回到列表并提供删除回馈。收藏、渲染和 Escape 返回保留页面位置与会话状态，过滤、排序和角色关联沿用既有实现。桌面与手机的详情返回差异保留。 |
| 比较记录 | 并发刷新只接受最新一轮；同一角色的多个方案共享本轮摘要及模型，避免反复解析整份存档和重复计算摘要。异步完成后核对核心数据、方案及采纳来源，来源变动时重新验证。 |
| 角色工作台、分析工具、数据管理、导入 | 通过既有共用样式获得一致的表单、数字、按钮、焦点及弹窗状态；成熟的页签、概览、导入和备份布局保留。没有重新设计稳定区域。 |

## 分享养成

- **共鸣图示的路径、形状、数量及五槽对应关系保留。** 简略版与详细版底部继续显示原有五个共鸣符号；详细版五槽基线节点也保留。
- 简略版宽 1440px，普通内容保持 1150px 基础高度；较长声骸名称或主词条会增加共同区域及整体高度，后续读数和底部图示一起下移，完整显示文字。
- 详细版继续使用 2040px 宽度、实际量测的共享行高及动态整体高度。没有替换既有模板。
- 长角色名称按已有标题区域调整字号；主要分数固定两位小数。预览和 PNG 继续使用同一 Canvas。
- 当前弹窗内并行加载并复用图片；失败保留数据及既有提示。关闭弹窗取消待加载图片与计时器，并阻止迟到的 PNG 回调触发下载。
- 增加三语准备状态，加载时禁用下载；预览底部操作区可随弹窗滚动保持可访问。继续支持本地文件来源受限时显式选择图片重绘。

## 结构与数据边界

渲染链继续是 `CharacterCore／RoleViewModel → renderer／workspace → UI`。评分仍调用原有 API；存储事务、身份唯一性、冲突保护、导入与备份格式维持原样。

新增 `EchoI18n.format.scoreValue` 仅格式化显示，不参与计算。一次性操作回馈使用原有 `wuwa.register.navigation.v1` 会话空间，不写 `mcData`；既有会话状态可以直接读取，无须迁移。

动画继续尊重 `prefers-reduced-motion`；没有增加图表、评价门槛或无计算依据的养成建议。

## 验收方式

2026-10-14 实际执行结果：

| 检查 | 结果 |
| --- | --- |
| `node --test tests/*.test.cjs` | 70 项通过，0 失败；包括原有评分／存档／导入／备份相容性及新增四项回归。 |
| `node tests/ui-ux-static.cjs` | 244 个正式入口本地依赖和 97 个脚本语法检查通过。 |
| `node tests/register-operations-browser.cjs` | 1440、1280、1024、768、390、360、320px × 三语，共 63 组流程通过；345 张截图／PNG，0 页面错误。涵盖 30 个角色、200 个声骸及少量／空数据，编辑返回、删除、筛选／排序、候选比较、语言保留、备份恢复和工具操作。 |
| `node tests/ui-ux-browser.cjs` | 30 张实际 PNG 通过：三语 × 简略／详细 × 普通／长名称／缺数据／未知模型／空配置；预览与下载字节一致，底部五个共鸣符号保留。另通过移动标题宽度、收藏滚动、Escape 会话保留与乱序刷新测试。 |
| `node tests/register-heading-browser.cjs` | 1440、768、320px × 三语，共九组标题／按钮／焦点状态检查通过。 |
| `node tests/register-import-browser.cjs` | 1440、320px 三语及异常情境，共 22 组离线模拟验收通过；106 张截图，0 页面错误。包含官方导入、手动创建、库内操作、完整备份恢复及 Classic 评分／更新路径。 |
| `git diff --check` | 通过。 |

实际查看了修改前桌面基准、修改后的桌面与手机分析截图、长名称详细 PNG；手机截图暴露的表格标题宽度问题已经修正并再次验证。初次分享专项测试的合成方案数量预期错误已经修正；这里记录的是修正后的完整通过结果。

浏览器使用新的本机 HTTP 来源、独立无头 Edge context 和合成数据，未使用个人浏览器档案或真实账号。外部图像由测试替换为既有本地资源或阻止请求；这不代表真实网络、CORS 或官方账号验收。

运行结果记录于 `artifacts/ui-ux-v2/`。`ui-ux-focused/results.json` 保存 30 组实际 PNG 的语言、模式、情境、尺寸和预览一致性记录；三语长名称图、手机预览和分析截图可直接检查。`ui-ux-v2-baseline/` 是修改前桌面基准。

重跑命令：

```powershell
node --test tests/*.test.cjs
node tests/ui-ux-static.cjs
node tests/ui-ux-browser.cjs
$env:WUWA_QA_WIDTHS='1440,1280,1024,768,390,360,320'
node tests/register-operations-browser.cjs
$env:WUWA_QA_WIDTHS='1440,768,320'
node tests/register-heading-browser.cjs
$env:WUWA_QA_WIDTHS='1440,320'
node tests/register-import-browser.cjs
```

项目直接发布 HTML／CSS／JS，没有 package.json、打包器或独立 TypeScript 检查任务。因此发布验证采用正式入口依赖检查、全部脚本语法检查和真实浏览器加载，不能将不存在的构建命令描述为“正式构建通过”。

## 未处理与真实环境限制

- 未重新验证真实官方账号、线上接口和外部图片的网络／CORS；离线导入回归使用模拟响应。
- 手机和平板采用浏览器 viewport；未在真实触控设备、Safari 或真实软键盘环境运行。键盘遮挡检查是视口模拟。
- 未新增声骸配置模型，未为视觉统一重写稳定架构；存档迁移及新版评分标准均不在本次范围。

## 未来多套声骸的相容性

需要关注 `CharacterCore` 的 `role.costList` 单套装备入口、`RoleViewModel` 的配置输入、`RoleDraftModel／RoleDraftStorage` 的角色基线与来源摘要、`RoleLocalConfiguration` 的本地采纳记录、导航按角色保存的分析选取状态，以及导入更新和 `RegisterBackup` 的跨空间相容性。

未来应显式引入配置身份，并处理声骸实例的引用与装备占用；不能以显示名称或 DOM 顺序作为配置／声骸身份。旧 `roleId`、`costId`、官方来源和既有备份必须有明确的相容读取与迁移策略。本次没有改变这些模型；分享仍接收独立 model 快照，之后可以由调用端传入指定配置。

## Git 与建议提交

产品修改：`css/register-foundation.css`、`css/register-operations.css`、`css/role-register.css`、`js/i18n-dictionaries.js`、`js/i18n.js`、`js/register-navigation.js`、`js/register-share.js`、`js/register-workspace.js`、`js/role-register-page.js`、`js/role-register-renderer.js`。

新增验收：`tests/ui-ux.test.cjs`、`tests/ui-ux-static.cjs`、`tests/ui-ux-browser.cjs`；本文与本次 QA 证据目录。

建议提交消息：`refactor(ui): 优化 v2.0 分析层级、连续操作与分享体验`。

所有修改保留在当前工作区，由用户自行检查和提交。
