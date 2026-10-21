# 成就展示柜、角色分享与卡池封面优化

基准：2026-10-21 21:02完整项目。当前原有未提交修改保留，不执行Git commit/push/reset/clean。

## 完成内容

1. 喚取页内部导航在角色分析右侧新增“成就展示柜”。原26项成就的条件、解锁、进度和日期均来自原Core.achievementDetails，没有修改判定/清空存档。空账号也能查看全部26项。按传说→史诗→稀有→普通分架，同架先已解锁后未解锁，稳定保留原顺序。每件藏品含原专属徽章、名称、难度稀有度、条件、进度、状态及解锁日期。四列/三列/手机双列收藏架、独立奖章展台；原弹窗不再混入成就，星运图鉴只保留整体/角色称号。
2. 角色分享由独立ConveneCharacterShare绘制：左侧立绘与大姓名一体，右侧278px徽章、紧邻称号和43px评分；取得记录使用紧凑的编号结算格，简略无日期。简略≤24次为1200宽3列，>24为1440宽4列；详细两列完整记录含时间/池类型/可靠UP、更多统计与覆盖说明。31/32次完整取得及15次缺口均检查，无省略/去重错误/伪精确。
3. 整体分享仍由原ConveneShare的整体分支绘制，未改其简略/详细设计、布局或内容。自动dispatch只在character存在时进入新模块。基准测试fixture保留21:02原分享源，在同一浏览器数据/字体环境对比新旧整体两版：桌面/手机×三语=12份PNG及布局元数据逐字节/逐项一致。
4. 常驻武器(4)、联动角色(101)、联动武器(102)、回响角色(104)接入集中ConveneCovers映射，与现有限定池复用cv-featured-pool封面几何、圆角/渐变/布局和图片回退队列。自制原生SVG明确标ILLUSTRATIVE PLACEHOLDER / NOT OFFICIAL ART，界面有三语“示意封面·非官方宣传图”。图片可同路径替换，无需修改核心；断图依次回退至本地物品图/类别占位，最终文本降级。封面完全不参与池分类、记录或保底。

## 难度分级表

仅本工具编辑性难度，不是全服统计概率或真实解锁率：
- 传说：pull3000、gold100、seven、fiveEarly、streak、consecutive。
- 史诗：pull1000、gold30、comeback、characters10、weapons10、months。
- 稀有：pull500、gold10、one、ten、pity、hard、characters5、weapons5、collab、fourCollect。
- 普通：pull1、pull100、gold1、weaponGold。

原成就所要求的条件完整显示，不因分级重新定义。未来可在convene-cabinet.js集中调整展示难度，不应改Core来追求视觉排序。

## 源码定位

- js/convene-cabinet.js：难度元数据和只读排序；Core原字段逐项保留。
- js/convene-character-share.js：仅角色普通分享新布局，保留同一luck结果与完整Report.acquisitions。
- js/convene-share.js：新增角色模块依赖和提前分发，原整体/目标路径保留。
- js/convene-ui.js、css/convene.css、convene.html：独立页/导航/藏品陈列/封面接入、脚本加载。
- js/convene-i18n.js：三语展示柜/稀有度/占位标识。
- js/convene-covers.js、image/convene-current/*.svg：四类替换封面。
- tests/convene-cabinet.test.cjs、tests/convene-cabinet-browser.cjs：本轮规则、数据不变、布局、PNG和封面验收。
- tests/fixtures/convene-share-2102.js：必要的21:02整体分享对照基准，仅供测试。
- 原convene-player-browser/convene-browser更新成就独立页面导航契约；资源注册表测试补新增元数据字段。

## 数据安全与边界

Core、Banners、CharacterRating、Report、Service、Store、history-data、Visuals及base正式源码应与21:02哈希一致；未改公式/历史/身份/存储，未运行真实账号。新模块只派生呈现。精确interval、下限lowerBound、未知/异常分别标识；knownSpend仍只代表有效间隔合计，非可确认目标花费。R0–R6目标分析/分享独立保留。

角色单图超30000px仍明确报错，不截断。真实设备/系统字体、Discord上传裁切、真实API及Cloudflare线上未验证。测试采用隔离浏览器、合成记录和Mock；分享示例标注测试资料，不是私人战绩。

集中验收发现并修正了新增测试导航选择器歧义、图片需等待decode，以及视觉复核中的冗余封面position覆盖。没有改任何算法断言来通过测试；最终数量与命令以测试结果.json为准，初次失败不冒充全程零失败。未执行PowerShell测试；1用例预先安全排除。

## 封面替换

见同目录“封面替换说明.md”。默认示意图是可直接编辑/替换的本地SVG，源文件保留原质量；若换其他扩展名，只改ConveneCovers集中files映射，不改核心逻辑。类别图片身份与个人最近取得分别处理，示意图不表示当前官方UP。
