from pathlib import Path
import json,hashlib
W=Path(__file__).resolve().parent;R=W.parents[1];S=W/'stage/WuwaEchoTool';H=S/'handoff'
def put(n,t):(H/n).write_text(t.strip()+'\n',encoding='utf-8')
def load(n):return json.loads((H/n).read_text('utf-8'))
def data(n,x):put(n,json.dumps(x,ensure_ascii=False,indent=2))
snap=json.loads((W/'snapshot.json').read_text('utf-8'))
# Re-inspected current files and test programs, not inherited feature conclusions.
mods=load('module-index.json')['modules']
by={m['id']:m for m in mods}
by['convene-url']['risk']='英数字母服务器ID保留大小写、数字旧ID不迁移；格式成功不代表授权成功；不可因gacha元数据未知拒绝整条URL'
by['convene-url']['dataSource']='白名单HTTPS记录URL，query/hash、复制换行、已知语言别名、svr_id不透明标识；不用UID猜地区'
by['convene-character']['core']+=['js/convene-character-rating.js']
by['convene-character']['risk']='旧Core.character.luck保留兼容，新UI改用独立evaluate；活动实际投入与真实链始终未知，窗口不是活动消费'
by['convene-rating']['name']='总体星运评分和称号（原公式保留）'
by['convene-rating']['risk']='保留原10间隔/300抽及最高30间隔/10机会门槛；不与新角色窗口模型混用'
by['convene-share']['risk']='原四模式保留，目标新增两版本；shareSnapshot冻结账号读数，超额记录不改变R6；不得把窗口称为实际投入'
by['convene-share']['tests']+=['tests/convene-target-browser.cjs']
by['convene-entry']['dependencies']+=['js/convene-character-rating.js']
by['convene-proxy']['risk']='近期截图提示PROXY_REQUIRED；404/405/503共用文案，实际站点及响应未确认；本机路由可达不是官方POST成功'
by['tests']['tests']+=['tests/convene-integration.test.cjs','tests/convene-target-browser.cjs']
mods += [dict(id='character-target-rating',name='独立角色区间星运/R0～R6',entry=['convene.html'],core=['js/convene-character-rating.js'],dependencies=['js/convene-core.js','js/convene-ui.js','js/convene-i18n.js'],dataSource='当前账号的角色五星记录及pool1连续span；R0～R6=当前档案第1～7次取得',storage='仅派生和会话选择；version1归档不添加字段，bannerSpend/actualChain为null',uiFiles=['css/convene.css','js/convene-ui.js'],tests=['tests/convene-integration.test.cjs','tests/convene-target-browser.cjs'],risk='默认investment无可靠活动证据，保持待观测；主动选择window才给区间效率分；首次目标无起点/跨池/缺口/异常均拒绝评分',affectsClassic='否'),dict(id='badge-families',name='整体/角色双徽章族及图鉴',entry=['js/convene-visuals.js'],core=['js/convene-visuals.js'],dependencies=['js/convene-i18n.js','js/convene-core.js','js/convene-character-rating.js'],dataSource='原创artwork图元；image/convene/badges下两族各六阶+中性，共14透明SVG',storage='静态资源与纯绘图，不保存解锁推断',uiFiles=['js/convene-ui.js','css/convene.css'],tests=['tests/convene-integration.test.cjs','tests/convene-target-browser.cjs','tests/convene-edge-browser.cjs'],risk='SVG/Canvas必须共用形状；不要把R标记当成42枚图标，也不要将未符合档位标已解锁',affectsClassic='否')]
for mod in mods:
 for k in ['entry','core','dependencies','uiFiles','tests']:
  for p in mod[k]:assert (S/p).is_file(),p
data('module-index.json',{'formatVersion':1,'pathBase':'project root','modules':mods})
fdata=load('feature-status.json');features=fdata['features'];byf={f['name']:f for f in features}
byf['声骸评分与分析']['verified']='本次139项总套件包含评分、链数、模态及v1数值回归；源码与旧任务基准核对'
byf['官方角色导入']['verified']='本次40个mock浏览器场景；错误处理与批量导入现有单元'
byf['唤取记录导入'].update(scope='英数字母服务器标识、Global/CN自动识别、语言别名、逐池增量/去重/取消、分级错误',verified='本次目标6+原唤取6三语视口流程和代理mock单元',knownIssues='404/405/503统一为代理未启用；用户截图八池全失败，实际站点/HTTP状态未确定；全失败仍显示部分失败文案',nextStep='先定位当前站点/api/convene响应及Pages/Worker绑定，不能靠改svr_id再猜授权过期')
byf['星运评定'].update(name='总体星运评定',status='已实现且已验证',scope='原总体速度/可选80:20/样本门槛保留，不用于新角色窗口规则',verified='本次139项总套件、v1固定结果及6阶计算PNG通过',unverified='真实全服分布校准未实现，不声称概率百分位',knownIssues='传统池规则为现有适配基线，新池未确认',nextStep='维护规则版本，确保新池不机械套80')
byf['称号及特殊成就'].update(scope='总体/角色两个六阶族、14透明SVG、统一三类图鉴、六成就证据状态',files=['js/convene-visuals.js','js/convene-character-rating.js','js/convene-core.js'],verified='图元/静态SVG一致、六阶样本、图鉴当前状态、日期/进度、本次桌面手机三语通过',unverified='Discord实际客户端压缩与实体设备',knownIssues='one/consecutive当前仍同条件；档案未达成不等于终身未达成',nextStep='确认重复成就语义及真实设备小尺寸可读性')
byf['唤取记录分享'].update(scope='原整体/角色四模式+新目标紧凑/详细；角色历史12条分页、R标记/超额/徽章开关',files=['js/convene-share.js','js/convene-character-rating.js','js/convene-visuals.js'],verified='本次72唤取PNG（含12阶计算样本）、51组三语Canvas边界、字体/图片失败降级',knownIssues='用户可选窗口评级不是活动实际投入；旧render未传characterRating仍有兼容回退',nextStep='真实Discord预览与更长目标分页专项测试')
features += [dict(name='R0～R6角色区间星运与超额战绩',status='已实现且已验证',scope='独立target-window-v1、可见1～7取得目标；12条/超额5；后续取得不改已有R6结果',files=['js/convene-character-rating.js','js/convene-ui.js','js/convene-share.js'],verified='本次新增15单元与6组三语浏览器，缺起点/缺口/跨池/单次/七次/十二次与R6稳定',unverified='实际活动目标、真实链、终身投入并不可证明',knownIssues='窗口含其他活动；160是本站参考，不是官方保证；默认为未知实际投入待观测',nextStep='保持口径清晰，取得可靠活动元数据后再正式定义真实投入评价'),dict(name='实际活动投入与真实共鸣链评级',status='部分实现或开发中',scope='已有未知状态、证据检查和另选窗口口径；真实投入计算未实现，不代表仍有后台开发任务',files=['js/convene-character-rating.js'],verified='bannerSpend/actualChain=null与待观测保护通过',unverified='活动元数据来源/实际投入与真实链均未确认',knownIssues='当前官方适配行没有可靠目标活动身份，不能将窗口改名冒充',nextStep='先获取合法、可版本化、可核对的活动/起点证据；无证据继续未知')]
fdata.update(features=features,discussionOnly=['可靠活动证据驱动的真实目标投入/共鸣链评级（现仅未知状态与窗口模型）','Discord客户端专用适配与外部上传（PNG已实现，客户端未验证）'],partialImplementation=['武器记录名称/中性图标，无完整本地图鉴','实际活动投入/真实链未知；窗口R目标、双徽章、独立称号和PNG已经实现'],unableToConfirm=['截图所在工具网站地址及/api/convene实际状态','真实官方POST/完整玩家导入','Cloudflare生产绑定与真实设备取链'],warning='旧任务把双徽章/R目标/超额/角色分享写成仅讨论已过时；当前代码已实现的是可见记录窗口口径。无证据的正式取消事项不臆造。')
data('feature-status.json',fdata)
lines=['# 当前真实进度','','状态依据当前源码与本次复跑；已验证限定于下列范围。代码已实现不等于真实API、生产和实体手机已验证。','', '|功能|状态|实际范围/文件|已验证|未验证和问题|下一步|','|---|---|---|---|---|---|']
for f in features:lines.append('|'+ '|'.join([f['name'],f['status'],f['scope']+'；'+', '.join('`'+p+'`'for p in f['files']),f['verified'],f['unverified']+'；'+f['knownIssues'],f['nextStep']])+'|')
lines+=['','## 计划、取代与无法确认','','只有可靠活动证据后的实际投入评级、真实设备/生产/Discord验证仍未完成。双徽章、R0～R6可见区间、超额展示与角色目标PNG已经存在，不能按旧模板放回未来清单。','现有源码无法确认另有正式取消但未记录的功能。已被取代的旧实现：外站作为教学主入口、背包右侧固定筛选栏、已用声骸禁选限制。旧Core.character.luck仍是兼容字段，新UI已用独立模块；其最高档门槛问题不是当前角色页面仍在复用总体门槛。','无法确认：具体线上站点与HTTP状态、真实授权POST、设备和Cloudflare生产。']
put('01_CURRENT_PROGRESS.md','\n'.join(lines))
lines=['# 功能与代码映射','','路径相对项目根；module-index.json为完全相同的机器索引。','']
for m in mods:
 lines += ['## '+m['name'],'',*['- '+label+'：'+', '.join('`'+p+'`'for p in m[key])for label,key in [('入口','entry'),('核心','core'),('依赖','dependencies'),('UI','uiFiles'),('测试','tests')]],'- 数据：'+m['dataSource'],'- 保存：'+m['storage'],'- 风险：'+m['risk']+'；Classic影响：'+m['affectsClassic']+'。','']
put('02_MODULE_MAP.md','\n'.join(lines))
put('00_READ_FIRST.md',f'''# WuwaEchoTool 当前完整快照：先读此文件

版本package.json=2.0.0。检查始于{snap['startedAt']}；实际封装时间/大小见11。HEAD {snap['head']}。包含工作目录未提交/未跟踪源码，不是Git diff。本次只检查、独立测试、写交接与封装，没有改产品/公式/UI/数据/分支或清除浏览器资料。

## 当前定位与进度

静态原生HTML/CSS/JS工具：Classic与Register共存；角色工作台、声骸库/评分/单件和整套分析、草稿比较、多套正式配置、跨角色同costId共享、官方角色导入、OCR、备份、养成Canvas分享均存在。独立唤取记录有归档/增量/保底/总体星运/成就/三语；最新开发增加英数字母服务器兼容、独立角色窗口评级、双徽章族、R0～R6目标和超额战绩PNG。

**最重要边界**：角色R0～R6是本存档第1～7次取得。默认实际活动投入仍未知并待观测；主动选择window后才评价可核对连续区间效率。不能把它说成实际活动投入、真实链或官方排名。双徽章和窗口目标分享已实现，不是旧版未来计划。近期用户截图八池全部代理失败；未获得工具网站地址/响应，不能说线上导入已验证。

## 阅读顺序

00→01真实进度→02模块地图→03数据/公式；唤取任务继续04系统、05分享徽章、06UI、07最近改动、08本次实测、09后续建议、10运行部署、11文件清单。机器索引module-index.json/feature-status.json/test-results.json/file-manifest.json与文档对应，路径相对项目根。SHA256SUMS.txt和verify.cjs可检查解压副本。

## 先读这些代码

角色：js/multi-config.js → character-core.js → role-view-model.js → register-workspace.js；原评分数据/公式在js/base.js。唤取：convene-core.js → convene-service.js/store.js → **convene-character-rating.js** → convene-ui.js/share.js/visuals.js；页面convene.html、css/convene.css，代理functions/api/convene.js及convene-worker/。新开发说明docs/convene-integration.md优先于历史任务文档。

## 运行与测试

本次Windows、Node24.13.0/npm11.6.2。根项目无npm依赖、无根lockfile，属实际现状，不是漏封；不需npm install。`npm start`仅127.0.0.1:8124，入口/convene.html?view=register、/register-workspace.html?view=register、/index.html；端口占用可设置PORT。静态源无打包构建步骤，不要file://打开。

`npm test`；`npm run check:static`；新解压先`node handoff/verify.cjs`。浏览器辅助在handoff/browser-tools执行npm ci及npx playwright install chromium，然后回根：`node handoff/run-browser.cjs tests/convene-target-browser.cjs`（或convene-browser等）。可设WUWA_BROWSER_CHANNEL=msedge；输出变量/全部本次命令见08。旧测试硬编码本机路径由运行器适配。

## 交付完整性与风险

必要源码/当前WebP与声骸图/OCR双核心和三语模型/测试基准/部署配置保留。64张无活动引用的旧PNG约39.92MiB仅从包内排除，工作区不删除；base.js未使用历史凭证仅在副本置空，唯一源字节脱敏差异详见sanitization.json。未复制个人浏览器、私人数据库、真实授权URL/recordId；本次不用此前用户给过的真实授权。

Mock与真实浏览器渲染通过仍不是官方授权POST/玩家完整导入/Cloudflare生产/真实设备成功。404/405/503共用代理文案及全部失败仍显示部分失败是当前可复现逻辑风险，仅记录未修复。实际活动证据、并发跨存储恢复、Discord实际压缩和大存档性能仍需后续验证。
''')
# Keep re-inspected unchanged echo rules, replace obsolete role-rating interpretation.
text=(H/'03_DATA_AND_CALCULATION.md').read_text('utf-8')
text=text.replace('不按UID首位判断区服。','不按UID首位判断区服。server是大小写保留的不透明字符串，Core.validServer允许首位英数字母、后续英数字母/_/-，长度1～128；数字旧ID保持原值，无迁移。')
text=text.replace('待确认计算行为：character()始终把win/loss传0，故机会恒0，角色score≥95无法达top，会保持observing。此次仅记录，不修改；它说明“角色专属星运”尚需正式定义。','兼容API注意：Core.character().luck仍沿用旧总体门槛且机会为0，≥95时会observing。最新页面/目标分享已用独立ConveneCharacterRating，不再将该兼容字段当新角色评级。ConveneShare.render未传characterRating时仍保留旧回退，未来调用者应显式提供。')
text += '''
## 独立角色窗口规则：当前已实现

js/convene-character-rating.js RULES.version=target-window-v1，evaluate(account,item,target,scope)。target0～6对应当前档案第1～7次取得，actualChain和bannerSpend始终null。scope默认investment：不能证明活动目标，保持score/draws=null与observing；若有可算窗口只保留windowDraws供另选口径，不能冒充活动投入。

用户明确选择window后：先取该角色可见前K次五星（跨池则拒绝），在pool1排序记录找本档首个已知五星作锚点；必须早于首目标且同一个span覆盖锚点到第K次终点。逐个检查中间五星间隔不超现有80规则，P=endIndex-startIndex，证据为每一条中间记录ID。包含其他角色/活动，不能只加目标的五星间隔，也不承诺“为了此角色”花费。

score=clamp(100×(1−(P−K)/(160K−K)),0,100)，160为本站参考，不是官方保证/期望/百分位。95/85/70/40/20分界依次天命之约、星辰眷恋、共鸣相契、命运同行、逆风寻星、漫长守候；不继承总体300抽/10间隔门槛，按未舍入值判定、显示一位小数。对应P/K区间≤8.95、≤24.85、≤48.70、≤96.40、≤128.20及更高，非可比较的真实活动消费。

reason分别targetNotReached/crossPool/missingOrigin/historyGap/invalidInterval/bannerUnverified/windowVerified。缺证据不评分；选择结果与派生对象不持久化，没有schema迁移。total保留全部次数、excess=max(0,total-7)，maxVisibleTarget=min(6,total-1)仅是可展示档案目标。R6只取前7终点，后续第8～12次不改R6，原记录不删，不推断课金/珊瑚。新增15单元与目标浏览器验证独立性和12次完整保留。
'''
put('03_DATA_AND_CALCULATION.md',text)
put('04_CONVENE_SYSTEM.md','''# 唤取系统：协议、状态与验证边界

## 取得链接与输入

convene.html的单一导入/更新入口。Windows内建教学有A本站主动选日志（64MiB上限、UTF8/XOR本机解码）及B第三方固定源码审阅；本站不扫描磁盘/自动执行PowerShell/改游戏配置。B为WuWa Tracker GPL脚本研究，页面说明部分配置/权限/提升权限分支，详见docs/convene-integration.md，不把第三方包装成原创。Android/iOS/其他平台分开，真实设备未测；本地解析仅有合成日志验证。

parseURL支持官方HTTPS aki-gm-resources(-oversea)?.aki-game.(net|com)与/aki/gacha/index.html，query或#/record?参数；合法编码、换序、首尾/换行空白。player_id/svr_id/record_id/resources_id必需且不可重复；lang/svr_area重复拒绝；.net→global、.com→cn，svr_area已知冲突拒绝，不按UID推区。server为1～128英数字母/_/-，首位英数字母，大小写保留，数字旧id兼容。已知语言en/zh-Hans/zh-Hant/ja/ko/fr/de/es/ru/pt及映射别名支持；未知gacha_id/gacha_type等元数据不决定身份、不阻止URL。不能将角色盒子Token与recordId混用。

## 实际请求

Global https://gmserver-api.aki-game2.net/gacha/record/query；CN https://gmserver-api.aki-game2.com/gacha/record/query。JSON POST字段playerId/serverId/recordId/cardPoolId（resources_id）/cardPoolType/languageCode；同源/api/convene另带region，由代理剥离。credentials:omit、no-referrer、no-store。默认池1～8，进阶9～20，不按陌生gacha_type直接猜新规则。成功code0/data数组，逐行白名单字段cardPoolType/resourceId/resourceType/qualityLevel/name/count/time；不接受未知分页对象。记录验证后逐池保存，不静默丢畸形行。

直接模式受官方CORS，默认同源代理。Pages Functions的CONVENE_PROXY绑定Worker，Worker复用handle并配置CONVENE_RATE_LIMITER；npm start本机以同handle和loopback限流替身工作。JSON POST、Origin存在时同源、4KiB正文、24MiB响应、20秒、固定上游、字段/语言白名单、拒重定向；缺限流503，429限流，错误不回显上游正文/授权。真实Cloudflare配置未确认，不能将Wrangler文件存在当作已部署。

## 错误、合并与保存

URL分FORMAT/MISSING/PARAMETER；官方明确拒绝AUTH_OR_API但不武断宣称过期；畸形JSON/code/data为INVALID_RESPONSE；TIMEOUT/NETWORK/UPSTREAM_UNAVAILABLE/STORAGE_FAILED等分类。当前proxy模式404/405/503统一PROXY_REQUIRED，因此提示本身不能区分缺路由、错误HTTP方法或绑定缺失。fetchPool无自动重试；sync逐池继续，成功池已提交，取消/失败不回滚成功，用户重试靠稳定去重。不更新失败池。重复成功显示unchanged，空官方列表noData；不把授权保存到URL/控制台/归档。角色盒子dataToken单次刷新重试是另一个模块。

归档account=region:server:uid，Core.VERSION1；记录pool|time|seq，不按名字去重，保留同批重复。仅实际重叠span合并，窗口滑动保留旧记录；无重叠即缺口，首段左删失，不能宣称终身全历史。规范字段/保底/用户胜负证据/角色窗口公式见03。

IndexedDB wuwa-convene v1/archive，data及restore日志；正常事务/WebLock，完整备份跨mcData恢复需锁和前值日志；旧备份无convene时保留现历史，失败回滚/启动中断恢复。不能与角色页并发写入就声称数据库级原子。

## 界面和新增角色系统

总览/历史/卡池/角色四导航；导入和次要数据管理独立。组合筛选/分页/用户胜负标记、分布/月趋势/角色全部取得；内建规则图鉴分总体/角色/特殊成就。总体原公式不变；新角色默认实际投入未知，主动选窗口才给独立区间效率称号。R0～R6只对应可见次数，12次保留/超额5、后续取得不改已有R6；不推断真实链/实际消费。

原整体/角色各简略详细四PNG继续；新增目标两版本1200×880/1600，超额/UID遮蔽/徽章开关，账号snapshot和页面同evaluate结果。桌面并列，手机目标单栏、全宽分享、证据折叠；三语支持。

## 最近用户反馈与验证层级

用户截图显示八池失败、新增0重复0、代理未启用；这次没有成功导入。实际工具网站地址和HTTP响应尚未取得，不把猜测写成部署结论。前一轮只读观察本机/api/convene GET=405（正常方法限制）、POST空JSON=400，说明本机路由/校验可达，**不是官方授权POST验证**；没有用用户真实链接查询或保存凭证。本轮只进行独立副本的合成测试。

|层级|状态|
|---|---|
|静态/语法/本地资源|本次执行，见08|
|Fixture核心/代理/目标规则|本次执行通过|
|真实隔离浏览器模拟Global/CN/英数server导入|本次执行，通过三语桌面手机|
|真实官方授权POST/真实完整玩家导入|未执行，本次不使用先前用户提供过的授权|
|真实设备/Windows游戏日志|未执行，仅合成日志和视口|
|Cloudflare生产站点及当前截图站点配置|未确认|

当前风险：三个HTTP状态共用代理提示、八池全败仍用“部分失败/成功已保存”文案；未知池规则、新接口字段/分页、实际活动元数据、真实设备/生产验证不足。本次只记录，不修复产品。
''')
put('05_SHARE_AND_BADGES.md','''# 当前分享、称号与徽章

## 声骸养成

js/register-share.js只读RoleViewModel/configuration快照，原生Canvas，不截网页。compact宽1440、detailed宽2040，最终高按角色/五卡/词条/汇总动态计算（初始1150不是最终高）。PNG、原始贡献雷达统一刻度、角色立绘/配置名/两模板。system-ui/sans-serif自动折行测量；图片异步超时、跨域失败占位，file来源可主动选图替代。本次多配置6流程生成12旧养成PNG，分享单元通过；远程声骸CORS/Discord压缩所有场景未验。

## 唤取原四模式与新增目标模式

js/convene-share.js render为整体/角色各compact/detailed，1200宽；整体compact高1080、detailed高1480+52×池数。角色historyH=92+54×本页条数，compact最近3条，高690+historyH+155；detailed每页12条，高690+historyH+500。角色图据本地立绘等比绘制，缺图中性符号。页面传characterRating时使用新角色评价；外部直接render未传该参数仍保留旧C.character.luck回退，不能误写为兼容API已统一改造。

renderTarget新增目标compact 1200×880、detailed 1200×1600，详细每页12条；showExcess=false仅选定前K取得，true展示全部acquisitions，pages可覆盖全部。目标R和六阶徽章组合，非42套。默认不显示UID，可选仅遮蔽；可开关超额和称号/徽章。来自shareSnapshot账号和同ConveneCharacterRating.evaluate，预览/下载同dataURL。R只是当前档案次数；实际bannerSpend/真实链未知，默认不评分；主动窗口效率并不证明活动投入。

目标详图每行R0～R6/超额编号、时间、该次五星间隔，主区显示选定目标窗口P；行的五星间隔不是每行累计P。全部取得不会因超七次删除。showExcess是展示开关而非存档修改，不推测消费/珊瑚。

Canvas文字测量/缩字/有限省略，Segoe UI/Microsoft JhengHei/sans-serif，缺系统字体自然回退；目标立绘本地2秒失败使用中性徽章（旧render为8秒）。没有必须在线下载的徽章/字体。武器缺可靠图鉴时用本地weapon-emblem.svg，不用错误角色替代。

## 双六阶徽章：已实现

ConveneVisuals.artwork/badge/drawBadge共用原创路径。总体星轨/分阶轮廓/结晶/高阶冠饰，角色不同盾框/双星/链结；不只是换色。image/convene/badges下overall及character各fate/star/lucky/steady/headwind/abyss/observing，共14透明SVG。页面SVG、Canvas图元一致，文字三语独立；图鉴分总体/角色/成就，当前符合才标目前评价。achievementIcon仍有六个SVG图标，普通总体PNG成就带仍是通用星形与文字，不是把所有成就SVG嵌入PNG。

总体称号天命共鸣者等原六阶和门槛不变；角色称号天命之约/星辰眷恋/共鸣相契/命运同行/逆风寻星/漫长守候及契约待观测。窗口公式和证据见03，不能混作总体概率分位。

## 已实现与尚未实现的准确边界

旧模板列作未来的双徽章、角色独立窗口称号、R目标、各阶段窗口抽数分享、超额展示和Discord友好紧凑PNG，**当前已存在**。尚未实现的是可靠活动元数据驱动的真实投入/真实共鸣链评级；也未验证真实Discord客户端压缩/预览，没有外部自动上传/发送功能。不能把“没有真实活动证据”表述成“窗口R目标/徽章根本不存在”。

本次生成原唤取30PNG+6总体阶级、新目标30PNG+6角色阶级，共72；51组三语Canvas边界，字体/图片失败、Canvas不可用、隐藏UID、开关徽章/超额通过。72均合成fixture，代表样本在evidence/screenshots。Discord可能将长图/2040宽养成图缩小导致文字可读性降低，实际客户端尚未验证。
''')
text=(H/'06_UI_UX_STATUS.md').read_text('utf-8')
text += '''
## 最新整合界面（本次已重新验证）

角色页增加独立targetPanel：R0～R6可见次数与investment/window口径选择，默认actual未知，证据折叠，P/score/超额/可展示R目标。桌面徽章/称号/分数/抽数并列；max700目标控件单栏、按钮全宽。账号/角色切换恢复未知口径，选择只在会话不写归档。统一星运图鉴有总体/角色/成就三标签，角色图鉴显示当前角色与R，不伪造其他档解锁。

Windows内建流程新增A本站日志解析/B固定第三方源码审阅，说明许可/配置权限分支，无远程自动执行按钮。导入保留默认自动地区，已支持英数server、换行/语言别名；重复导入明确无新增，相同失败原因合并池号避免手机堆叠。

目标分享有版本/R/遮蔽UID/超额/徽章开关，沿用同一dialog与PNG预览，不另造页面；两族形状/透明SVG/小尺寸样本已真实浏览器渲染。当前不是概念图阶段。截图中的八池全失败文案、实际站点代理不可用，以及真实设备/Safari/Discord验证仍待处理，本次不改UI。
'''
put('06_UI_UX_STATUS.md',text)
# Latest product-task file list is verified against current hashes, not copied as a claim.
dev=json.loads((R/'artifacts/convene-integration-20261020/delivery-final/CHANGES.json').read_text('utf-8'))
for x in dev['changes']:assert hashlib.sha256((R/x['path']).read_bytes()).hexdigest()==x['afterSha256'],x['path']
latest={'baselineAt':dev['baselineAt'],'method':'per-file current SHA verified against retained product-task after-SHA; before-SHA available for existing files','changes':dev['changes'],'protectedFilesUnchanged':dev['protectedFilesUnchanged'],'subsequentWork':'read-only proxy diagnosis and current packaging; no subsequent product changes'}
data('latest-task-changes.json',latest)
put('07_LATEST_CHANGES.md',f'''# 最近开发、诊断与本次交接

最近产品任务为“导入修复、双星运、徽章与角色目标分享整合”。保留的真实任务起点 {dev['baselineAt']}；本次逐项验证当前SHA等于该任务afterSHA，共9个既有文件修改、19新增（14SVG）。latest-task-changes.json含完整before/after审计；未将HEAD误当任务开始。更早任务归属无法只靠Git精确还原。

修改：{', '.join('`'+x['path']+'`' for x in dev['changes']if x['status']=='modified')}。
新增：{', '.join('`'+x['path']+'`' for x in dev['changes']if x['status']=='added')}。

服务器ID从纯数字扩为合法不透明标识，前端/Core/代理一致，数字旧账号不迁移；URL错误细分与无新增提示。Windows教学A/B选择。总体公式保留，新增独立派生角色窗口evaluate，不写数据、不新增schema；六阶双族与统一图鉴、R目标/超额开关及紧凑PNG。手机单栏目标/证据折叠/全宽分享。新增15单元与目标浏览器脚本，原124保留。

13保护文件原任务hash保持，包含存储、备份、评分/共享/导入/Classic桥；本次根源快照仍将脱敏差异单独说明。旧C.character.luck与render缺参回退保留，调用者需显式使用新模块，不能宣称API全部重写。

之后用户反馈八池代理失败：只读代码/无授权本机路由诊断，不属于新产品改动。实际站点/HTTP状态未取得，真实POST/生产未验；未用真实授权请求或保存链接。当前全失败/代理泛化文案仅记录问题。

本轮交接仅复制实际工作目录、脱敏副本、生成文档和非破坏性测试，没有修改产品或Git状态。当前Git已改及未跟踪全收录源码，见GIT_STATUS.txt；临时封装目录不属于产品功能。
''')
put('09_NEXT_IMPROVEMENTS.md','''# 当前值得继续处理的事项

## 优先三项

1. **真实代理入口与误导性错误提示**：用户截图八池全部PROXY_REQUIRED，具体工具站点未提供。先检查该站/api/convene的POST状态/响应以及Pages/Worker/限流绑定。fetchPool把404/405/503都归“代理未启用”，不能凭截图判是哪一项。UI仅以failed.length选partial，八池全败仍说部分失败/成功已保存；可用合成503响应复现。后续修正文案/诊断分类，不靠猜授权过期。本次只记录。
2. **角色窗口与活动实际投入必须继续区分**：新窗口R0～R6模型/双徽章/超额PNG已实现，不是等待采用；但bannerSpend/actualChain始终未知。160为本站参考、窗口可含别的活动。若要回答“为了角色达到真实链花多少”，需要可靠活动目标及起点证据和正式新规则，不能直接改标签。当前默认未知保护必须保留。
3. **跨页/跨存储数据安全**：多配置多键localStorage补偿日志及ConveneStore跨IDB恢复不等于原生数据库隔离。其他角色页没有共同唤取锁，真实并发交错尚未全测。先补多页恢复/写入时序再评估统一存储，避免擅自迁移。

## 其他具体改进

- 真实Global/CN授权POST、完整玩家记录、Cloudflare生产、实际Windows日志/Android/iOS仍缺验证；使用者曾提供过的链接不应进入公开代码/报告。先由维护者私下验证并产出脱敏结构fixture。池7/8/9～20/新活动继承关系待核对，不机械套80。
- Core.character.luck是旧兼容总体门槛字段，当前UI已用独立evaluate；ConveneShare.render缺characterRating仍旧回退。后续可明确弃用/强类型入口，避免未来调用者又混用，不能把现UI仍说成未修复旧最高档问题。
- one和consecutive成就条件相同，需确认是否正式保留重复语义。当前图鉴只是档案内证据，不是永久终身解锁。
- 目标详细分页现12条/页，已有12次/超额5测试；更长记录、多页目标开关组合、超长未知名和浏览器字体矩阵仍可补专项。原角色详细续页已测试。
- 真机/Safari/Firefox、系统缩放、Discord实际长图压缩可读性未测。14 SVG与PNG图元已实现，通过32px样本，不代表实体客户端全覆盖。
- 大档性能：Core.validate多次find、analyse按pool/segment遍历，角色evaluate还会验证/分析副本；数十万抽的耗时与内存未压测，先测再优化公式旁的索引。
- 武器只有可靠名称/中性图标，没有完整本地图鉴；远程声骸图仍依赖网络/CORS。保留当前图片与OCR双核心/三语模型，不将其误删为缓存。
- 旧browser脚本存在硬编码Playwright路径，本包提供适配器；正式维护可统一工具入口。旧任务docs按时间解释，当前以代码和handoff为准。

## 需求/讨论/已取代

实际活动证据驱动的真实目标投入评价是条件尚不足的部分需求；当前没有证据有另一个正在后台进行的开发任务。Discord客户端特调/外部上传仅讨论，不自动实施。双徽章、角色窗口称号、R标记、超额和目标PNG已存在，不能再列未实现。
已取代的旧实现：外站教学主入口、背包固定右筛选、已用就禁选。其他正式取消事项无证据，不编造。未来全服百分位模型/官方概率排名也没有实现，不可用窗口内部速度分冒充。
''')
text=(H/'10_DEPLOYMENT_AND_ENV.md').read_text('utf-8')
text += '''
## 近期代理故障的排查顺序

真实工具页面若在静态托管或其他预览器，/api/convene可能根本没有路由；Cloudflare则检查Functions、CONVENE_PROXY服务绑定与Worker限流。仓库配置存在不代表生产已配置。当前404/405/503共用前端文案；GET /api/convene返回405是本项目预期方法限制，应以不含授权的POST空JSON是否返回400作为路由/本地校验探测，不能拿这个探测当官方POST成功。未取得截图站点地址，不假设它就是localhost或Cloudflare。不要记录或重放私人授权来排查部署层。
'''
put('10_DEPLOYMENT_AND_ENV.md',text)
print('Current-source module/status/formula/UI/deployment documents refreshed; 28 latest task file hashes verified.')
