# 唤取资源与视觉完整修正（2026-10-21）

## 当前结果与入口

本轮保留现有Core/Store/CharacterRating/CharacterPortraits/Base与角色养成功能，未改公式或schema。来源审计：convene-resource-audit.json。64个本地角色形态全部进入统一注册表并匹配原图；62个资源ID可靠对照，2个导电主角性别对应未知（1309/1310不按顺序猜）。114个武器三语/类型/星级可识别；0张正式武器图。缺口详见weapon-missing-assets.json。

js/character-catalog.js由现有roleList内部ID、CharacterPortraits/CSS图片及集中三语/资源ID元数据构造只读注册表。内部id≠resourceId；resourceId为主，无ID时唯一精确别名；各性别/元素Rover不合并。旧名雪豹/桃祁等保留别名，显示采用本次核对名称。没有改变旧声骸养成目录或其存档。

js/convene-assets.js统一为总览最近五星、分析、历史、角色星运/分享提供身份、三语和图片，不按语言拼文件名。js/weapon-catalog.js/weapon-portraits.js集中武器识别；图片与识别资料分离，缺图有类型回退。添加角色仍走既有base角色定义与base.css图片维护；新元数据只补character-catalog这一处，不逐页面重复注册；现有图无需重命名或复制专属角色库。

## 总览固定封面与布局

js/convene-covers.js优先image/convene-current两个固定WebP，只作用总览限定双卡。卡池分析/历史继续物品真实图。手动封面不随账号/最新取得切换，数据仍随账号/导入更新；不宣称自动识别当前游戏卡池。缺固定图时才回退最近取得。封面示例与替换/缓存详见该目录README。

按本次最新要求，总览顺序为限定角色/武器→核心统计→整体星运→最近五星→其他池/趋势/成就。桌面左右数据/视觉，手机图片在前完整宽度数据在后；物品图片contain等比。保留全部卡池分析按钮与异常提示，没有删掉次要池分析入口。

## 徽章与分享

ConveneVisuals两族各使用固定核心构图，升级仅追加同源图元；overall为星盘/星轨/星核，character为契约盾印/双核/连接。最低到最高5/7/10/13/16/20个路径，保留每阶前缀结构，增加框圈、刻纹、翼片、冠饰与底部装饰。金属渐层克制，SVG/Canvas同源（含中心宝石），14个静态SVG同步生成。称号/区间/门槛保持原样，未舍入边界无重叠。

原四分享与目标分享、R0～R6、超额、UID隐藏/完整、12条分页保留。R窗口口径明确包含锚点至目标所有抽取（含其他角色/歪出），不是目标角色实际花费；默认真实投入证据不足仍待观测，不把其他角色抽数伪装成目标成本，不改窗口公式。

## Windows与导入

js/convene-windows.js提供可查看/复制/下载的原创建本地PowerShell命令。先读运行中的游戏路径，不能取得时由玩家提供目录/日志；仅几个确定路径，不扫描全部磁盘。明文/XOR/BOM、64MiB上限；只读文件，默认只向剪贴板复制私密URL，控制台不打印链接。无网络、提权、设置写入、执行策略更改。命令粘贴运行；若下载.ps1被系统策略阻止，使用可审查的粘贴命令，不要求降低系统策略。

公开参考固定版本为WuWa Tracker 747a48b1b994baa9c372a4fb933ea7588428bd4b（2026-10-21核查）；其脚本含配置写入/提权分支，所以本站没有复制整脚本，也不提供下载后立即执行的命令。来源链接保留在教程，真实游戏版本适用性未实机证明。

parseURL新增常见复制形式的有界清理：成对尖括号、单一Markdown链接、HTML &amp;与转义分隔符；仍严格校验HTTPS白名单、query/#/record、重复参数、地区及必要授权字段。合法gacha_id/type变化不影响池请求。自动直连/条件代理、错误分类、去重/逐池提交/部分成功保持原实现；成功空响应有独立说明，不当无效链接。真实官方API/Cloudflare部署未验证。

## 测试与来源

本轮新增注册表/历史角色武器/形态隔离/边界/本地命令测试与四宽度三语真实Edge流程；最终命令、数量、截图及PNG下载一致性见独立交付REPORT.md、test-results.json。Node模拟、浏览器Mock、真实官方接口、部署及实体设备严格分开，不用旧报告计数冒充本次。

数据来源为https://api-v2.encore.moe/api/{en,zh-Hans,zh-Hant}/{character,weapon}公开目录，保存检索时间与内容哈希，非运行时服务依赖；历史资源ID旁证https://github.com/yuhkix/wuwa-ids，中文名称可核对官方WIKI。只取事实字段，没有下载或绑定网络图片。Cache规则依据https://developers.cloudflare.com/pages/configuration/headers/；公开参考脚本仅审查未执行。
