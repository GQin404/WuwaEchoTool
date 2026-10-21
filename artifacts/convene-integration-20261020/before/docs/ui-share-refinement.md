# 工作台精修、Register 视觉统一与分享战绩卡

2026-10-15，基于当前未提交源码继续修改。没有回退旧修改或执行 commit、push、分支操作。base、ViewModel、controller、存档结构、Classic 与路由保持不变。

## 工作台及新版面板

保留左侧角色卡、右侧总览、五件圆角卡片与原位详细分析。总览将身份/配置/分数/装备数量/Cost与观察结论分为两列，手机自然上下排列。观察按钮仍可定位槽位；证据入口放在底部模型详情，避免顶部重复按钮。

共鸣链及真实评分模式移动到角色卡“角色评分设置”，状态同步显示；底部保留额外能量/参考生命、重置/失败重试与模型解释。没有多模式的角色不会虚构选择。保存仍由原 page/controller/CharacterCore 事务执行；sumScores 等原缓存会正常重算，身份和原词条不变。

删除是与分享等宽的暗红圆角按钮，原确认机制保留。仅移除工作台 rr-overview-entry 重复区块，首页跨角色总览和导航仍存在。

register-foundation.css 统一14px面板、10px卡片、8px控件和危险色；库存与详情、比较列表、工具、数据管理、角色列表和弹窗复用。规则仅作用于 Register，保留功能及原页面布局。

## 分享布局与品牌

继续使用原 Canvas 流程，等待字体与并行图片；预览/下载同一PNG、关闭取消、返回选择、file://选图修复与稳定文件名保留。顶部三竖线图标/双语品牌/两侧细线、原双共鸣环、底部原五符号路径和比例全部复用。

简略版1440px宽：大角色立绘、链/模式、大总分、五角图、五张图片/名称/Cost/贡献圆角卡。详细版2040px宽：相同框架，补齐套装、主词条/数值、五条副词条/数值与原口径累计网格。高度随实际文字及数据自适应。两版不堆入模型系数或完整计算表。

测量与绘制使用同一换行器，英文优先空格、中文与长单词逐字回退。五卡共享区域最大行高，数值与标签分区。有效高亮仍要求模型可用、词条有效和原 rawContribution > 0，未知保持中性。

## 五角图依据

现有贡献分没有可靠的跨Cost质量百分比上限，因此图名为“单件评分分布”。五轴直接取 slot.echo.score.value；同图共用0到当前最大非负贡献向上取整到10分的坐标（全零最小1分），图中明确标示范围。这只是展示轴，不是新评分、质量满分或等级；不同角色/模式图片的坐标可变，不能按面积跨图片比较质量。

只有五件完整、模型可用且分数非负才填充。缺值、未知、非有限值或负分仅显示位置/实际读数，不把缺项补0；负数保留标签，零是真实中心坐标。总分始终使用 summary.score，不把五件相加覆盖整套校正。累计始终使用 substatTotals。

## 文件与验证

产品：css/role-register.css、css/register-foundation.css、js/role-register-renderer.js、js/register-share.js、js/i18n-dictionaries.js。

测试：tests/register-share.test.cjs、tests/ui-ux-browser.cjs、tests/role-workspace-browser.cjs、tests/share-radar.test.cjs、tests/ui-share-redesign-browser.cjs。文档：本文、role-register.md、register-share-acceptance.md。

实际结果以 artifacts/ui-unification-20261015 的 JSON、日志及最新包 handoff/05_TEST_REPORT.md 为准。本轮不要求新旧PNG一致，改测数据、品牌装饰、雷达、边界与同次预览/下载相同。截图目录：C:\Users\user\Downloads\WuwaEchoTool-UI-Preview，均为真实项目流程与隔离合成数据。

真实Safari、实体手机/软键盘、真实官方账号及线上CORS未验证；极长文本会增加导出高度。建议提交：feat(ui): 精修角色评分设置并重设计双版本分享战绩卡。
