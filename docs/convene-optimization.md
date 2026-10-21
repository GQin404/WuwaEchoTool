> 历史任务记录（2026-10-20）。当前最新结果见convene-resource-management.md：64角色/62资源ID、114武器识别、手动固定封面。本文旧“空武器目录”和自动主封面仅为当时状态。

# 唤取记录完整优化：当前实现

本次基于最新工作区，保留现有自动通道、存档结构、总体星运、独立角色窗口/R0～R6与超额记录、完整/隐藏UID、Classic及共享声骸逻辑。没有重写评分或创建第二套导入系统。`docs/ui-reference/` 三组PNG已逐张查看；之前交接说明从最新独立handoff中读取，当前实现以本文件优先。

## 最新五星封面

`ConveneAssets.latest(stats,pool)`读取当前账号分析中的对应pool.five，仅五星和正确角色／武器类别，复制后按 `ConveneCore.order`（time → 数值seq → pool）排序，取最后一笔。不是按显示名称、对象遍历顺序、当前UP或字符串seq判断。两个同秒结果seq10比seq2新。

UI每次导入后reload、切账号、切语言或回到总览均从当前账号派生，不保存另一份封面状态。角色按稳定gid匹配现有roleList和CharacterPortraits；三语言精确别名仅用于无ID查询。图片路径只来自本地目录，不拼接显示名。缺图有原创角色剪影，同时名称保留。

武器用独立WeaponPortraits目录/解析器，未知ID不借同名其他物品，保持精确身份。当前真实素材0条，完整结构及缺图分支已补齐，详情见weapon-artwork.md与weapon-missing-assets.json。

## 视觉、交互与分享

限定双主卡保留左数据/右大图的桌面结构，手机单独采用图片区和完整宽度数据区。卡池分析同样显示最近图、名称、日期、准确或≥间隔、累计/五星/平均/当前保底。其他池仍可折叠访问。

历史增加常驻搜索、卡池和快速五星切换；高级筛选默认折叠，220ms搜索防抖，五星强调，逐笔记录与40条分页保留。角色主视觉补可见次数；时间轴保留所有记录并标当前存档可见，不推断真实链。

两组六阶保持原称号和阈值，星轨/契约不同轮廓；增加共享金属渐层、宝石/羽翼/冠饰/刻度与更强小尺寸中心轮廓。SVG与Canvas取同一组图元和调色，不引入第三方徽章。

图鉴公式默认折叠，条件/状态仍可读。原角色简略/详细分享现在也可选择R目标，显示目标与派生分数，详细图增加目标区间抽数及依据；目标专属分享保留。总体分享无已解锁成就时使用独立成就等待文案，不再把它误称为总体运势待观测；已有成就用同源SVG图元。原尺寸、每12条分页、四类模式、UID隐藏／完整以及同PNG预览下载保持兼容。

Windows推荐本地Logs选择、单文件备选及进阶固定源码参考；没有远端执行命令或假播放入口。普通导入说明避免要求玩家理解CORS/Worker；错误码仍供维护者排查。Android/iOS未实机验证状态保留。

## 数据与测试边界

ConveneCore/Store/CharacterRating/Service/Base/CharacterPortraits原件按任务开始SHA核对，不修改算法/schema/去重/逐池提交。测试使用合成账号/授权和明确合成图片，不打开用户浏览器资料。真实官方API、Cloudflare生产、实体手机、真实游戏日志与Discord客户端压缩不因此视为已验证。

本次统一测试命令、实际数量、四宽度三语言截图、PNG字节一致结果及剩余限制见独立交付REPORT.md与机器测试摘要。源码入口：convene.html、convene-assets.js、weapon-catalog.js、weapon-portraits.js、convene-ui.js、convene-share.js、convene-visuals.js、convene-i18n.js及css/convene.css。
