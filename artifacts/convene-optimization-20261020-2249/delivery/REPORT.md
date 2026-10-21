# 唤取记录完整优化与视觉重整：交付报告

基于任务开始时的最新工作区完成；本次未提交或推送 Git，未改变评分公式、存档 schema、导入算法、角色素材原件或其他模块。测试仅在隔离浏览器上下文使用合成档案，不访问个人浏览器资料。交付目录中的 changed-source 是本次变更副本，完整可运行项目仍位于 C:/Users/user/Downloads/WuwaEchoTool。

## 功能状态

| 项目 | 实际完成情况 | 验证 |
|---|---|---|
| 限定角色自动封面 | 当前账号、对应卡池、五星且为角色；按时间/数值序号取最新，稳定 gid 找本地立绘 | 单元+真实 Edge 页面，含切账号、导入新记录与三语言 |
| 限定武器自动封面 | 同样依据实际档案；独立目录与安全 ID/别名映射，保留名称/日期/间隔/保底 | 有图分支用明确合成素材；生产空目录和失败回退独立验证 |
| 总览与分析 | 整体评价、限定双主卡优先；其他池折叠；最近五星图片及数据；未知间隔显示 —，不产生 ≥ null | 四宽度×三语言 |
| 历史记录 | 搜索、卡池、快速五星入口；高级筛选折叠；40 条分页与逐笔数据保留，220ms 搜索防抖 | 交互筛选与存档前后比对 |
| 角色分析 | 大立绘、可见取得次数、时间轴状态；R0～R6、超额记录、待观测原因保留 | 目标回归与浏览器 |
| 双六阶徽章 | 两套轮廓、金属渐层、中心宝石、星轨/契约纹样；高阶羽翼/冠饰/刻度递增；SVG/Canvas 共用图元 | 同步单元检查、双家族图鉴和小尺寸截图 |
| 成就与图鉴 | 判定逻辑保留，图鉴公式折叠；分享成就使用同源图元；无成就时独立文案 | 浏览器展开/收起、Canvas |
| 四类原有分享 | 整体/角色各简略与详细保留；角色原分享也提供 R 目标与依据；目标专属分享保留 | PNG 下载字节与预览一致，分页/三语言/UID/失败回退 |
| 导入与教程 | 自动直连/条件代理机制保留；普通错误说明简化；本地日志推荐/备用与未来影片位置，不提供远端执行命令或假播放按钮 | 国服/国际服、重复/部分成功/取消等模拟通过 |

## 最新五星与图片规则

入口为 convene.html → ConveneAssets → ConveneCore 分析结果。`latest(stats,pool)` 只查看当前账号对应池的五星记录，复制排序后取最后一笔，不修改原数组；使用 Core.order 的实际 time、数值 seq 等稳定规则，不用当前 UP、名称拼接路径或对象遍历顺序。切账号、导入后和切语言均重新派生。

角色 ID 对应现有 roleList/CharacterPortraits；未知 ID 不冒用同名角色。武器目录为 js/weapon-catalog.js；解析器 js/weapon-portraits.js；只允许本地 image/weapons/[345]star 资源。ID 优先；只有无 ID 查询才允许精确唯一别名，冲突或模糊匹配拒绝。图片失败只有一次有界回退，避免加载循环。

## 武器素材缺口与扩充

**当前真实武器图片和经核验的目录条目均为 0。** 仓库没有可核实的完整真实 ID/图片清单，所有五星、四星、三星武器正式图及映射待补；没有虚构 ID，也没有把角色图当武器。现已完成可运行目录、解析器、中性武装结晶和五种类别占位图。未登记类别的未知武器使用中性图，避免错误暗示类型。合成几何测试图明显标注 SYNTHETIC ART FIXTURE，只存在测试请求拦截中。

未来添加真实授权透明图到相应星级目录，确认官方 resourceId 后在 weapon-catalog 加入三语名称、类型、来源/许可与路径即可；详细流程见 changed-source/docs/weapon-artwork.md。全局缺口见 weapon-missing-assets.json；`WeaponPortraits.missing(records)` 可为特定本地档案列出按 ID 去重的缺图清单，不包含 UID 或授权参数。

## 视觉对照与截图索引

三组 docs/ui-reference PNG 已实际查看，使用其信息层级，未照搬框图说明。实际 HTML/CSS 的最终页面就是高保真实现；所有截图来自 Edge 渲染，徽章专用预览另见 preview/badge-atlas.html。

- 桌面：整体评价先于限定双卡；主卡左数据/右立绘，保留最近取得与次级卡池、分布及月份趋势。
- 手机：主卡图片在前、完整宽度数据在后；历史筛选折叠，弹窗与分享操作保留。没有横向溢出断言失败。
- 角色：大立绘、目标与可见次数在首层，时间轴保留所有取得；不是推断真实共鸣链。
- 徽章：整体星盘/角色契约两种轮廓，SSS 额外冠饰和多层框；相同绘图用于网页及 Canvas。
- 分享：深色共鸣背景与金属强调，角色图为主视觉；详细记录分页，默认无 UID 空栏；完整 UID 仅用户主动开启。

screenshots/final 是最终代码、生产空武器目录的四宽度三语言截图：overview-full、character-full、weapon-pool、两个 atlas、公式展开、Windows 底部与角色原分享 PNG。both-six-tier-families.png 同时展示两套六阶及小尺寸。

screenshots/interaction-synthetic-art 包含账号切换、导入更新、映射/回退、限定角色/武器分析、历史、导入窗口、Windows 推荐/备用、整体分享、R0～R6；其中武器有图为明确合成测试分支，不能当正式图库截图。screenshots/target-regression 为目标专属简略图。完整可点击缩略图目录见 GALLERY.html。

视觉自检：桌面/平板/390/360 页面与弹窗均检查横向溢出；立绘不拉伸，武器 contain；无缺图导致空白主卡；标题/按钮可读；公式收起；页内与 PNG 字节一致。窄英文底部导航可能换行，属于当前共享导航的紧凑表现；没有改动全局导航业务。已人工抽查桌面、768、390、360 英文、角色分享与双徽章图鉴；其余矩阵由浏览器断言及截图覆盖，不将自动截图等同逐张人工审美判断。

## 实际测试

| 指令 | 结果 |
|---|---|
| npm test | 153 通过，0 失败，0 跳过 |
| npm run check:static | 286 本地入口依赖、139 脚本语法检查通过 |
| node scripts/check-convene-art.cjs | 0 真实目录条目、7 个回退资源通过；空目录明确披露 |
| node tests/convene-optimization-browser.cjs | 12 个宽度/语言流程通过：账号切换、导入更新、映射/失败、筛选与存档保持 |
| node tests/convene-browser.cjs | 6 个现有导入/分享回归流程通过 |
| node tests/convene-target-browser.cjs | 6 个目标/三语/UID/超额回归流程通过，含 36 个 Canvas 布局场景 |
| node tests/convene-edge-browser.cjs | 最终重新执行通过：存储配额回滚、双账号、Canvas 失败、存储不可用、六阶 PNG、15 个三语 Canvas 布局场景 |
| node artifacts/convene-optimization-20261020-2249/final-visual.cjs | 12 次最终视觉复核通过：公式默认折叠、未知间隔、目标选择、PNG 字节相等、档案不变 |

浏览器为 Playwright 驱动实际 Microsoft Edge，1440/768/390/360px × zh-CN/zh-TW/en。合成记录和模拟 API，不是静态示意图。原浏览器脚本可用 WUWA_CONVENE_OUT 指定输出；新优化脚本使用 WUWA_OPTIMIZE_OUT。运行需 Node 与 Playwright、已安装 Edge；npm start 启动静态站，无 bundler，打开 convene.html?view=register&lang=zh-CN。测试日志与机器结果见 evidence/、test-results.json。

## 兼容性与未验证边界

ConveneCore、ConveneStore、CharacterRating、Service、CharacterPortraits、base.js 六个原件对比任务开始 SHA-256 完全相同。没有数据迁移。旧模块工作区已有修改未覆盖，Git 状态中未跟踪文件不能被误认作本次全部新增；changes.json 以任务开始基准标注，比对不到的旧徽章标为 regenerated。

官方真实 API、真实玩家链接、Cloudflare 正式代理部署、实体手机、Android/iOS 真实日志获取、Discord 客户端压缩效果均 **未验证**。手机测试为浏览器视口模拟。模拟连通不代表生产授权或代理一定有效；未重写当前连接机制。真实武器图是当前明确剩余项。旧 Classic 与角色工作台没有新增人工全流程回归；现有单元/静态路由回归通过，不夸大为实机验收。

## 文件与交付校验

修改/新增文件完整列表见 changes.json 与下表。SHA256SUMS.txt 覆盖交付文件（不自哈希）；复制到 Downloads 后再次按 SHA 校验。没有附带真实授权、个人存档、Git 历史或依赖目录。evidence/final-visual.cjs 保留原项目相对运行环境，在项目目录运行，不应把 changed-source 当独立项目启动。


| 文件 | 本次责任 |
|---|---|
| convene.html | 解析、资源接线、样式、三语或维护说明；详见源码 |
| css/convene.css | 解析、资源接线、样式、三语或维护说明；详见源码 |
| docs/convene-optimization.md | 解析、资源接线、样式、三语或维护说明；详见源码 |
| docs/weapon-artwork.md | 解析、资源接线、样式、三语或维护说明；详见源码 |
| docs/weapon-missing-assets.json | 解析、资源接线、样式、三语或维护说明；详见源码 |
| image/convene/badges/character-abyss.svg | 由统一 SVG 图元重新生成的阶级徽章 |
| image/convene/badges/character-fate.svg | 由统一 SVG 图元重新生成的阶级徽章 |
| image/convene/badges/character-headwind.svg | 由统一 SVG 图元重新生成的阶级徽章 |
| image/convene/badges/character-lucky.svg | 由统一 SVG 图元重新生成的阶级徽章 |
| image/convene/badges/character-observing.svg | 由统一 SVG 图元重新生成的阶级徽章 |
| image/convene/badges/character-star.svg | 由统一 SVG 图元重新生成的阶级徽章 |
| image/convene/badges/character-steady.svg | 由统一 SVG 图元重新生成的阶级徽章 |
| image/convene/badges/overall-abyss.svg | 由统一 SVG 图元重新生成的阶级徽章 |
| image/convene/badges/overall-fate.svg | 由统一 SVG 图元重新生成的阶级徽章 |
| image/convene/badges/overall-headwind.svg | 由统一 SVG 图元重新生成的阶级徽章 |
| image/convene/badges/overall-lucky.svg | 由统一 SVG 图元重新生成的阶级徽章 |
| image/convene/badges/overall-observing.svg | 由统一 SVG 图元重新生成的阶级徽章 |
| image/convene/badges/overall-star.svg | 由统一 SVG 图元重新生成的阶级徽章 |
| image/convene/badges/overall-steady.svg | 由统一 SVG 图元重新生成的阶级徽章 |
| image/convene/character-fallback.svg | 透明回退图或目录维护说明 |
| image/weapons/3star/README.md | 透明回退图或目录维护说明 |
| image/weapons/4star/README.md | 透明回退图或目录维护说明 |
| image/weapons/5star/README.md | 透明回退图或目录维护说明 |
| image/weapons/fallback-broadblade.svg | 透明回退图或目录维护说明 |
| image/weapons/fallback-gauntlets.svg | 透明回退图或目录维护说明 |
| image/weapons/fallback-pistols.svg | 透明回退图或目录维护说明 |
| image/weapons/fallback-rectifier.svg | 透明回退图或目录维护说明 |
| image/weapons/fallback-sword.svg | 透明回退图或目录维护说明 |
| image/weapons/fallback.svg | 透明回退图或目录维护说明 |
| js/convene-assets.js | 解析、资源接线、样式、三语或维护说明；详见源码 |
| js/convene-i18n.js | 解析、资源接线、样式、三语或维护说明；详见源码 |
| js/convene-share.js | 原角色分享 R 目标、依据、成就与占位 |
| js/convene-ui.js | 封面、历史筛选、角色、图鉴、分享入口与回退 |
| js/convene-visuals.js | 共享 SVG/Canvas 金属层次与阶级图元 |
| js/weapon-catalog.js | 解析、资源接线、样式、三语或维护说明；详见源码 |
| js/weapon-portraits.js | 解析、资源接线、样式、三语或维护说明；详见源码 |
| scripts/check-convene-art.cjs | 解析、资源接线、样式、三语或维护说明；详见源码 |
| tests/convene-artwork.test.cjs | 映射/封面/交互自动化 |
| tests/convene-optimization-browser.cjs | 映射/封面/交互自动化 |
