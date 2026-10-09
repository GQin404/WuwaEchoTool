# RC2 — Visual / Navigation / Workspace Refinement

状态：等待最终人工验收，未部署。此记录覆盖旧版发布计划中“根入口按偏好自动进入”的规则。

## 当前行为

- 根目录 `/` 和没有合法 view 的 `index.html` 每次显示新版／旧版 chooser；`wuwa.ui.view` 不触发根入口自动跳转。
- `index.html?view=register`、`index.html?view=classic` 保留明确的内部导航；界面内切换仍可用。无需服务器路由或 hosting redirect。
- 历史 preference 仅保留为非根入口的兼容导航信息。入口语言和 Register 语言仍独立保存；Classic 固定简体中文。
- 双入口为一条左右分段的斜切配置带，以“新版入口／旧版入口”为主标题。语言控件固定右上；删除重复的底部提示。
- hover / keyboard focus 使用背景明度、边界及延伸下划线；focus 额外标记沿斜切边界。预览占据固定布局空间，只改变透明度与可见性。触摸布局直接展示预览。
- 三线标记为居中对齐的 18 / 36 / 18px 节奏；分享标记同步为短／长／短。
- 角色页作为参考：统一 1600px border-box 容器、48px 桌面横向 padding、20px 移动 padding、共享 header / nav / settings。稳定滚动条占位避免短页和长页切换位移。
- Dock 采用紧凑最近配置带与始终可见的角色索引。行中显示头像、身份、来源、五槽完整度、评分／不完整状态、草稿状态，直接进入角色分析。删除保持独立操作。
- 导入／手动建立置于页首，空资料仍显示 onboarding；搜索筛选仅折叠辅助控件，角色本身不再被折叠。
- 保留角色分析五槽、共同尺度、原位分析与 Compare 结构。当前可操作 breadcrumb 保留；工具子流程继续使用既有返回链接。

## 验收证据

17 个 `tests/*.test.cjs` 全部通过；409 个三语 key 一致。新增 `rc2-workspace.test.cjs` 检查 HTTP / file URL、历史 preference、明确 view、三语手动／导入角色索引、空资料入口及不写入 mcData。原有评分、草稿、编辑返回、比较、备份回归全部通过。`git diff --check` 通过。

浏览器验收使用本机 synthetic fixture，未使用真实玩家账号：

- A：直接 index 显示 chooser。
- B / C：分别选择 Register / Classic 后重新打开 index，均显示 chooser。新上下文解析测试同样覆盖有历史 preference 的情形。
- D / E：Register 内部切换 Classic，再由 Classic 返回 Register；Classic 为 zh-CN，无语言选择器；Register 保留 en。Classic 原有首次提示需按原行为关闭。
- 1440px 的 Dock、声骸库、备份、工具、角色页，各三语共 15 个组合无水平溢出。header 均高 104px，品牌 x=48，设置右边界 x=1377（15px 滚动条占位），内容横向 padding=48px。
- 390px 同样 15 个组合无水平溢出且只有一个 shell。移动布局显示底部导航与重排后的索引，没有缩小桌面表格。
- 英文桌面 1100px 边界无水平溢出。
- chooser focus 前后：选项 top=321.1875、height=152；语言控件 top=24；页面总高=1030，全部保持不变。
- chooser 手机三语无水平溢出。键盘 Tab / Enter 可以查看说明和进入选定界面。
- 角色位置 03 可选且只有一个 inline analysis。

## 截图

- [入口](qa/rc2/chooser-desktop.png)
- [入口 focus 展开](qa/rc2/chooser-focus.png)
- [Desktop Dock](qa/rc2/dock-desktop.png)
- [声骸库](qa/rc2/library-desktop.png)
- [角色 reference page](qa/rc2/role-desktop.png)
- [Mobile Dock](qa/rc2/dock-mobile.png)
- [Mobile chooser](qa/rc2/chooser-mobile.png)

完整页面截图中的固定底部导航位于截图时的 viewport 底部；正常滚动时始终贴底，不随长图展开。

## 不变边界

Classic HTML、业务脚本、既有操作与简体中文未改动。mcData schema、评分公式、模型、存储、导入／编辑／删除核心均未改动；复用原归一化层和 draft revalidation。新增／修改维护注释使用简体中文。

真实玩家资料验收仍为 1D.5 pending。外部头像受网络影响，缺失头像保留行布局和文字身份，不输出破损图片图标。本版本交由用户做 RC2 人工验收，不代表正式批准上线。
