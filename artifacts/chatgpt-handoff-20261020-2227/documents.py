from pathlib import Path
import json,datetime,shutil,hashlib,re
W=Path(__file__).resolve().parent; R=W.parents[1]; S=W/'stage/WuwaEchoTool'; H=S/'handoff'; H.mkdir(exist_ok=True)
snapshot=json.loads((W/'snapshot.json').read_text('utf-8'))
def put(name,text):
 p=H/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text.strip()+'\n',encoding='utf-8')
def data(name,obj):put(name,json.dumps(obj,ensure_ascii=False,indent=2))
modules=[]
def m(id,name,entry,core,deps,source,storage,ui,tests,risk,classic):
 modules.append(dict(id=id,name=name,entry=entry.split(),core=core.split(),dependencies=deps.split(),dataSource=source,storage=storage,uiFiles=ui.split(),tests=tests.split(),risk=risk,affectsClassic=classic))
m('classic','Classic旧版','index.html mccost.html unusedEchoes.html costedit.html','js/index.js js/mccost.js js/mccost2.js js/unusedEchoes.js js/costedit.js','js/base.js js/multi-config-browser.js','base.js目录与mcData兼容投影','localStorage mcData','css/base.css','tests/character-dock.test.cjs tests/multi-config-browser.cjs','共享base及实体编辑可能影响两版；Classic投影写回当前配置','是')
m('workspace','角色工作台与草稿比较','mccost.html register-workspace.html','js/role-register-page.js js/role-register-controller.js js/register-workspace.js js/role-register-renderer.js js/character-dock.js','js/role-view-model.js js/character-core.js js/role-draft-model.js js/role-draft-storage.js js/role-compare.js js/role-candidates.js','角色目录、当前配置、候选草稿','mcData + wuwa.echoTool.drafts.v1/adoptions','css/role-register.css css/character-dock.css css/register-workspace.css','tests/role-view-model.test.cjs tests/multi-config-ui-browser.cjs','草稿绑定configurationId；比较前检查来源指纹','共享核心间接影响')
m('library','声骸资料库与管理','register-workspace.html unusedEchoes.html','js/register-workspace.js js/register-secondary-views.js js/register-collections.js','js/character-core.js js/register-search-ui.js js/register-metadata.js','costList目录 + 根echoes实体','mcData; wuwa.register.echoMeta.v1','css/register-workspace.css','tests/register-secondary-views.test.cjs tests/inventory-sharing-browser.cjs','目录id不是实例costId；资料库无角色时不推定评分','是，Classic unusedEchoes仅未引用投影')
m('scoring','评分模型与归一化','js/base.js','js/role-view-model.js js/stat-keys.js','scripts/new-character-model.cjs scripts/character-chain-model.cjs','roleList/ruleList/RoleSumProperty/newCharacterModels + calculations/katixiya.xlsx','评分缓存在mcData；展示重算','rule.html css/role-register.css','tests/character-chain-scoring.test.cjs tests/new-character-scoring.test.cjs','模型系数、分母、充能修正、链数和模态必须同步；本任务未改','是')
m('single','单件声骸分析','mccost.html','js/role-view-model.js js/role-register-renderer.js js/role-candidates.js','js/echo-tool-core.js js/base.js','当前角色模型与单件词条','草稿独立存储，明确采纳后才写回','css/role-register.css','tests/role-candidates.test.cjs tests/role-register-interaction.test.cjs','单件贡献不是品质百分位；缺失模型不应填0','计算共享')
m('set','整套分析与配置比较','mccost.html','js/role-view-model.js js/role-compare.js js/multi-config-browser.js','js/register-share.js js/base.js','当前或选定配置五槽、整套充能','mcData; 草稿baseline','css/multi-config.css css/role-register.css','tests/multi-config-ui-browser.cjs tests/share-radar.test.cjs','总分含整套修正，不能只加缓存；雷达统一原分刻度','共享评分')
m('config','多套配置','mccost.html','js/multi-config.js js/multi-config-browser.js','js/character-core.js js/role-draft-storage.js','role.configurations[]与echoes[]','mcData loadoutVersion:2；事务日志wuwa.multiconfig.transaction.v2','css/multi-config.css','tests/multi-config.test.cjs tests/multi-config-browser.cjs tests/multi-config-ui-browser.cjs','删除最后一套禁止；默认与活动配置不同；复制只复制引用','是，投影桥接')
m('sharing','跨角色共用和背包筛选','register-workspace.html mccost.html','js/multi-config.js js/register-workspace.js js/register-secondary-views.js','js/character-core.js','全部echoes + references全部角色全部配置','mcData同一costId','css/register-workspace.css','tests/inventory-sharing-browser.cjs tests/multi-config.test.cjs','隐藏仅筛选；同配置重复实体与Cost>12仍禁止；编辑全局生效','是，共享实体')
m('role-import','官方角色导入','register-workspace.html index.html','js/import-service.js js/register-import-model.js js/register-import-workbench.js','js/base.js js/character-core.js js/multi-config.js','api.kurobbs.com社区角色盒子；gid可靠映射','mcData；授权键kjq_token/kjq_bat属于用户浏览器，不入包','css/register-import.css','tests/register-import.test.cjs tests/register-import-browser.cjs tests/import-errors.test.cjs','未知/重复gid禁止导入；保留与完整覆盖不同；不将phantomPropId当实例ID','共享导入底层')
m('echo-share','声骸养成分享','mccost.html','js/register-share.js','js/role-view-model.js js/character-portraits.js js/i18n.js','所选配置只读snapshot与角色/声骸图片','不存新业务数据；导出PNG','css/role-register.css','tests/register-share.test.cjs tests/multi-config-browser.cjs tests/share-radar.test.cjs','跨域图片可能失败；模型缺失必须表达；保留两模板','Register导出，不改Classic')
m('backup','备份与恢复','register-workspace.html','js/register-backup.js js/register-tools.js','js/character-core.js js/convene-store.js js/register-metadata.js','完整section白名单；可选convene','localStorage多键 + IndexedDB恢复日志','css/register-workspace.css','tests/register-backup.test.cjs tests/convene-v2.test.cjs tests/convene-browser.cjs','跨库不能假装原生事务；恢复时避免其他角色页并发写入','是，mcData')
m('ocr','截图识别','register-workspace.html','js/register-screenshot-import.js js/screenshot-recognition.js js/screenshot-recognition-adapter.js js/screenshot-name-aliases.js','library/ocr/tesseract.min.js','用户主动选择的截图、base目录与别名','临时Blob/待确认表单；模型可缓存，非自动保存截图','css/register-workspace.css','tests/screenshot-recognition.test.cjs','保留SIMD/非SIMD嵌入WASM和三语模型；人工确认后写入','否')
m('i18n','三语言','js/i18n.js js/convene-i18n.js','js/i18n-dictionaries.js js/stat-keys.js','js/ui-view.js','角色/声骸/套装稳定实体key，旧中文仅兼容','语言偏好及URL参数','css/base.css css/convene.css','tests/i18n.test.cjs tests/convene-browser.cjs','简繁英文布局需实际验证；内部稳定ID不得用翻译名替代','是')
m('responsive','桌面/手机导航与布局','js/ui-view.js','js/character-dock.js js/register-navigation.js','js/register-workspace.js','URL view与页面数据','会话/语言设置；业务数据不由布局复制','css/character-dock.css css/register-workspace.css css/multi-config.css css/convene.css','tests/multi-config-ui-browser.cjs tests/convene-browser.cjs','多份CSS后置覆盖；不能只看早期断点与旧截图','是，视图选择')
m('convene-entry','唤取页面与前端','convene.html','js/convene-ui.js','js/convene-core.js js/convene-service.js js/convene-store.js js/convene-visuals.js js/convene-share.js js/convene-i18n.js','独立账号存档的分析结果','独立IndexedDB；URL不持久化','css/convene.css','tests/convene-browser.cjs','四个分析导航、导入和数据管理是不同层；不改mcData评分','不改旧业务，仅导航入口')
m('convene-url','授权URL和地区识别','js/convene-service.js','js/convene-service.js','js/convene-core.js','官方HTTPS历史URL或主动所选Windows日志','仅请求内存；不保存URL/recordId','js/convene-ui.js','tests/convene.test.cjs tests/convene-browser.cjs','仅白名单域名/路径；query及hash重复键拒绝；不得按UID猜区','否')
m('convene-import','Global/CN导入服务','js/convene-service.js','js/convene-service.js','js/convene-core.js js/convene-store.js','固定.net/.com官方/gacha/record/query POST','逐池验证合并后写archive','js/convene-ui.js','tests/convene.test.cjs tests/convene-browser.cjs','无自动重试；20秒超时；部分失败保留成功池；新池规则未知','否')
m('convene-proxy','Pages/Worker代理','functions/api/convene.js','convene-worker/index.js scripts/serve.cjs','wrangler.toml convene-worker/wrangler.toml','固定上游两个端点、JSON白名单','不持久化凭证；Worker限流绑定','convene.html','tests/convene.test.cjs','Cloudflare未线上验证；缺限流绑定503；非任意代理','否')
m('convene-store','唤取存储与恢复','js/convene-store.js','js/convene-store.js','js/convene-core.js js/register-backup.js','version1账户记录与连续spans','IndexedDB wuwa-convene v1/archive: data及restore','js/convene-ui.js','tests/convene-browser.cjs tests/convene-edge-browser.cjs','无WebLocks可读写但完整跨库恢复拒绝；不清除损坏存档','仅完整备份桥接')
m('convene-merge','去重/排序/增量','js/convene-core.js','js/convene-core.js','js/convene-service.js','官方倒序单抽记录；同秒批次反转','accounts[].records/spans','js/convene-ui.js','tests/convene.test.cjs tests/convene-v2.test.cjs','没有可靠官方单抽ID；同秒数量/内容冲突拒绝，不能按名字去重','否')
m('convene-stats','保底/五星/卡池统计','js/convene-core.js','js/convene-core.js','js/convene-ui.js','POOLS、连续区间与记录','纯计算，不回写推断','css/convene.css','tests/convene.test.cjs tests/convene-v2.test.cjs','未知池无硬保底；首段左删失；新卡池规则待真实核对','否')
m('convene-character','单角色唤取分析','js/convene-core.js','js/convene-ui.js js/convene-core.js','js/character-portraits.js js/base.js','资源ID + 角色kind + 取得当次间隔','纯计算，bannerSpend:null','css/convene.css','tests/convene-browser.cjs tests/convene-v2.test.cjs','取得间隔不是目标总投入；角色最高级门槛须确认','否')
m('convene-rating','星运评分和称号','js/convene-core.js','js/convene-core.js js/convene-visuals.js','js/convene-i18n.js','RATING_RULES、有效重复池间隔和用户标记胜负','纯计算，不存新推断标签','js/convene-ui.js css/convene.css','tests/convene-v2.test.cjs tests/convene-edge-browser.cjs','娱乐速度指标而非全服百分位；最高档有额外证据门槛','否')
m('convene-achievement','特殊成就图鉴','js/convene-core.js','js/convene-core.js js/convene-visuals.js','js/convene-i18n.js','有效间隔、同区间用户结果证据','计算state/progress/date，不永久伪造解锁','js/convene-ui.js css/convene.css','tests/convene-v2.test.cjs tests/convene-browser.cjs','未达成仅指当前档案；一发入魂与五星连发当前条件相同','否')
m('convene-share','唤取Canvas分享','js/convene-share.js','js/convene-share.js js/convene-visuals.js','js/convene-core.js js/convene-i18n.js js/character-portraits.js','analyse/character只读结果，实体立绘','PNG dataURL；不写业务存档','js/convene-ui.js css/convene.css','tests/convene-browser.cjs tests/convene-edge-browser.cjs','详细角色12条分页；全部取得含>7但无R0-R6目标评级','否')
m('tests','测试系统','package.json','tests/browser-qa.cjs tests/convene-fixture.cjs','tests/fixtures/convene-v1-results.json tests/fixtures/legacy-probability.json','合成fixture及保留的artifacts/*/baseline快照','隔离浏览器上下文；输出独立目录','tests/ui-ux-static.cjs','tests/convene-v2.test.cjs','多个旧浏览器脚本硬编码Playwright本机路径，交接提供适配运行器','全部模块回归')
for mod in modules:
 for key in ['entry','core','dependencies','uiFiles','tests']:
  for p in mod[key]:assert (S/p).exists(),(mod['id'],p)
data('module-index.json',{'formatVersion':1,'pathBase':'project root','modules':modules})
features=[]
def f(name,status,scope,code,verified,unverified,issue,next):features.append(dict(name=name,status=status,scope=scope,files=code.split(),verified=verified,unverified=unverified,knownIssues=issue,nextStep=next))
partial='已实现但尚未完整验证';verified='已实现且已验证'
f('Classic旧版',partial,'旧入口及多配置兼容投影保留','index.html js/multi-config.js','现有单元、迁移及工作台回归','全部Classic页面逐操作、真实官方联网','共享实体编辑会跨配置更新，需理解兼容投影','补充独立Classic端到端覆盖')
f('新版角色工作台',verified,'五槽、原位分析、草稿比较、管理与分享','js/role-register-page.js js/register-workspace.js','桌面手机三语6组配置UI流程','真实手机、所有浏览器','跨页同时编辑有竞争风险','并发保存专项验证')
f('声骸资料库',verified,'全部实体、检索、元数据与共享背包','js/register-secondary-views.js js/register-workspace.js','6组×17组验收，共享选择/编辑/移除','大规模真实存档压力','Classic未使用投影与Register全库不同','保留此边界并补压力测试')
f('声骸评分与分析',verified,'共用旧模型、单件/整套贡献、链数/模态/充能修正','js/base.js js/role-view-model.js','124项总套件包含评分及v1回归','游戏伤害真值与全部新版本平衡','公式依赖有序目录和角色特例','维护新角色时补可核对模型来源')
f('官方角色导入',partial,'gid可靠映射、批量保留/覆盖、预览、错误分类','js/import-service.js js/register-import-model.js','40组mock流程','真实账号认证/验证码/CORS/全部平台','外部服务变更及未知gid需维护','有授权条件下私下验证真实接口')
f('多套声骸配置',verified,'新增/复制/默认/切换/改名/删除/比较','js/multi-config.js js/multi-config-browser.js','多配置6组及UI6组，单元迁移和回滚','多进程极端交错','localStorage多键不具有数据库原生隔离','避免并发角色写入')
f('跨角色声骸共用',verified,'同costId实体多引用、全配置统计、隐藏已用默认开启','js/multi-config.js js/register-secondary-views.js','真实控件选取、两角色保留、编辑同步、移除不抢占','大规模多标签竞争','同配置不能重复，Cost仍上限12','扩展并发一致性覆盖')
f('配置保存与恢复',partial,'loadoutVersion2迁移、回滚日志及完整备份','js/register-backup.js js/convene-store.js','单元及浏览器回滚/中断恢复/预览实体计数','浏览器崩溃与多页恢复交错全部时序','跨localStorage与IDB恢复需WebLocks','恢复时关闭其他角色编辑页')
f('声骸养成分享',verified,'原生Canvas简略/详细、配置名、贡献雷达','js/register-share.js','12张PNG及现有分享单元回归','Discord实际客户端缩略图与远程图片全部CORS','远程声骸图可缺图；不伪造替代物品','补远程图片失败场景和客户端可读性')
f('唤取记录导入',partial,'URL自动地区、独立授权、逐池增量/去重/取消','js/convene-service.js js/convene-store.js','Global/CN模拟导入和本地合成日志','真实官方POST、真实玩家完整导入、设备取链','新池/接口协议和授权有效期未真实核对','优先真实接口匿名结构验证')
f('唤取统计与分析',verified,'历史/卡池/角色、连续区间、左删失、未知规则','js/convene-core.js js/convene-ui.js','v1固定结果、缺口/冲突/日期/保底单元及页面','当期游戏所有新池规则','7/8及额外新池规则未确认','核对新池ID及继承关系')
f('星运评定',partial,'固定速度指数、80/20可选权重、样本和最高档门槛','js/convene-core.js','数值不变快照、6阶样本、个人规则面板','全服校准不在实现范围','角色>=95时机会恒0会保持observing','先确认角色专属评级需求，勿擅改公式')
f('称号及特殊成就',verified,'六档共用几何徽章、六成就图鉴及证据状态','js/convene-visuals.js js/convene-core.js','六档图形、日期/进度/资料不足与页面通过','原创专属美术及Discord可读性','one/consecutive条件相同；档案不足不代表永未达成','确认两个成就的产品差异')
f('唤取记录分享',verified,'整体/角色×简略/详细，角色详细12条分页','js/convene-share.js','30张主/续页PNG+6阶PNG，15组三语边界','真实Discord压缩/预览','不是R0-R6目标或累计投入评级','讨论项等待正式需求')
f('桌面与移动布局',partial,'响应式布局、折叠筛选、滚动dialog、手机阅读顺序','css/convene.css css/multi-config.css css/register-workspace.css','1440/390浏览器视口实际操作截图','iOS/Android实体设备、Safari/Firefox','超长名称/系统字体仍需设备验证','补真实设备及键盘/缩放矩阵')
f('繁中/简中/英文',verified,'共用实体词典及唤取独立消息表','js/i18n-dictionaries.js js/convene-i18n.js','6个桌面手机语言组合、PNG布局、缺key断言','所有未知官方物品名翻译不保证','未知物品保留导入名；武器无完整本地图鉴','按稳定ID维护，不按名称合并')
f('云端代理部署',partial,'Pages服务绑定独立限流Worker','functions/api/convene.js convene-worker/index.js','输入/来源/限流/超时/上游错误mock单元','Cloudflare真实生产配置与请求','缺限流绑定返回503，不能纯静态托管默认代理','部署者配置绑定后做生产验收')
future=['整体星运专属美术徽章体系（现有共用六阶几何已存在）','角色星运独立六阶美术、称号与Discord专项战绩设计（现有共用角色PNG已存在）','R0～R6目标标记与指定共鸣链累计抽数评级','从0命至6命各阶段累计抽数分享','同角色超过七次取得的专属超额展示（通用完整历史与分页已保留全部次数）']
data('feature-status.json',{'pathBase':'project root','statusVocabulary':['已实现且已验证','已实现但尚未完整验证','部分实现或开发中','仅规划或讨论','已取消或放弃','无法确认'],'features':features,'discussionOnly':future,'cancelledOrSuperseded':['唤取外站教学作为主入口已由内建教学取代','角色背包右侧固定筛选栏与已装备禁用限制已由折叠筛选和合法共享取代'],'unableToConfirm':['Cloudflare实际账号配置和线上部署','真实官方POST/玩家全量导入','无法从GitHEAD单独确定所有历史Codex任务边界'],'partialImplementation':['武器仅可靠名称和中性图标，不存在完整本地武器立绘目录'],'warning':'验证基于合成数据和本次测试范围，不等于全产品所有路径均验证'})
put('GIT_STATUS.txt',snapshot['gitStatus']);put('GIT_DIFF_STAT.txt',snapshot['gitDiffStat'])
data('source-snapshot.json',{'capturedAt':snapshot['startedAt'],'head':snapshot['head'],'branch':snapshot['branch'],'files':snapshot['sourceFiles']})
data('exclusions.json',snapshot['excluded']);data('sanitization.json',snapshot['sanitized']);data('size-analysis.json',{'largestDirectoriesBeforePortraitExclusion':snapshot['largestDirectories'],'largestFilesBeforePortraitExclusion':snapshot['largestFiles'],'historicalPortraitAudit':snapshot['historicalPortraitAudit']})
put('00_READ_FIRST.md',f'''# WuwaEchoTool：先读此文件

版本：package.json 为 **2.0.0**。快照检查始于 {snapshot['startedAt']}；实际 ZIP 时间与大小见 11_FILE_MANIFEST.md。基于工作目录，包含 Git 尚未提交/未跟踪的源码。HEAD：{snapshot['head']}。本次只检查、独立封装与生成文档，没有改产品、公式、UI、数据结构或个人存档，也没有提交/推送/切换分支。

## 当前是什么

静态 HTML/CSS/原生 JS 工具，Classic 与 Register 角色工作台共存。支持声骸目录、评分、单件/整套分析、草稿/配置比较、多套正式配置、跨角色同实体共享、官方角色导入、OCR、备份及养成PNG。另有独立唤取记录 v2：自动识别Global/CN、增量归档、统计、星运、成就、三语与Canvas分享。多配置/共享/唤取已经存在，不能沿用旧模板写成未采用。

最新产品更新是唤取 UI v2：内建教学、主视觉与移动阅读顺序、评级拆解、成就图鉴、12条分页角色分享，修复非法日历日期及备份预览实体数。本次交接没有再次开发这些功能。

## 阅读顺序与入口

先读 01 进度、02 模块地图、03 数据与公式，再按任务读04唤取、05分享徽章、06 UI与07最近改动。08是本次实测，09后续建议，10运行部署，11封装清单。module-index.json、feature-status.json、test-results.json、file-manifest.json 供程序检索；路径均相对项目根。

入口：index.html（Classic与视图桥）、mccost.html?view=register&roleid=…（角色详情）、register-workspace.html?view=register（库/导入/工具）、convene.html?view=register（唤取）。先读 js/multi-config.js、js/character-core.js、js/role-view-model.js、js/register-workspace.js；唤取先读 js/convene-core.js → service/store → ui/share/visuals。评分原始依据在 js/base.js。

## 运行与检查

本次 Node24.13.0/npm11.6.2、Windows/Edge；根项目没有 npm 依赖，也没有根 lockfile（不是漏封）。无需 npm install，运行 `npm start`，打开 http://127.0.0.1:8124/convene.html?view=register 。占用端口可设置 PORT；不要覆盖已有服务器。静态项目无需打包构建，发布根目录及 Functions。

`npm test`；`npm run check:static`；`node handoff/verify.cjs`。浏览器：在 handoff/browser-tools 执行 `npm ci`、`npx playwright install chromium`，回根目录执行 `node handoff/run-browser.cjs tests/convene-browser.cjs`。可设置 WUWA_BROWSER_CHANNEL=msedge；输出目录变量见08，测试使用全新上下文，不加载个人资料。更多部署细节见10。

## 关键边界

Mock通过不等于真实官方API通过；真实账号POST、设备取链、Cloudflare生产环境仍未验证。首段/历史缺口不可推定完整保底。星运是娱乐速度指标，不是概率百分位。角色最高档复用总体机会门槛值得确认；共享localStorage跨页面写入并非原生数据库事务。现有共享六阶几何图标已实现，专属角色目标/R0-R6评级仍仅讨论。

唯一封装源码差异：js/base.js 中未使用且仅声明的历史凭证值已在副本置空，工作区原件未改；详见sanitization.json。64个无代码引用的旧版角色PNG（约39.92MiB）仅在包中排除，当前WebP、所有必要目录、OCR模型及测试基准保留。没有复制个人浏览器存档。
''')
rows=['# 当前真实进度','', '状态必须同时结合验证范围阅读；“已验证”不代表真实服务/所有设备已经覆盖。','', '|功能|状态|实现与主要文件|已验证|未验证/问题|下一步|','|---|---|---|---|---|---|']
for x in features:rows.append('|'+ '|'.join([x['name'],x['status'],x['scope']+'；'+', '.join('`'+p+'`'for p in x['files']),x['verified'],x['unverified']+'；'+x['knownIssues'],x['nextStep']])+'|')
rows+=['','## 部分实现 / 仅讨论 / 已取代 / 无法确认','','武器记录可识别、可显示名称和中性武器图标，但没有完整本地武器插画目录；不虚构模块。没有证据表明正在并行开发其他未提交功能。','',*['- 仅讨论：'+x for x in future],'','已取代的旧方案：外站教学主入口、背包固定右筛选栏、已使用就禁选。它们是旧实现被替代，不代表所有历史规划均有正式取消记录。','无法确认：真实API、生产绑定、真实设备和所有历史任务的精确边界。最近v2可由留存baseline与当前hash比较，见07。']
put('01_CURRENT_PROGRESS.md','\n'.join(rows))
rows=['# 功能与代码映射','','`module-index.json` 为同一索引的结构化版本；完整路径相对项目根。','']
for x in modules:
 rows+=['## '+x['name'],'','- 入口：'+', '.join('`'+p+'`'for p in x['entry']),'- 核心：'+', '.join('`'+p+'`'for p in x['core']),'- 依赖：'+', '.join('`'+p+'`'for p in x['dependencies']),'- 数据来源：'+x['dataSource'],'- 保存：'+x['storage'],'- UI：'+', '.join('`'+p+'`'for p in x['uiFiles']),'- 测试：'+', '.join('`'+p+'`'for p in x['tests']),'- 修改风险：'+x['risk']+'。Classic影响：'+x['affectsClassic']+'。','']
put('02_MODULE_MAP.md','\n'.join(rows))
put('03_DATA_AND_CALCULATION.md','''# 数据结构与实际计算

本说明对应当前函数，不修改模型。数据目录主要位于 js/base.js：roleList（本地id/官方gid/类名/基础权重）、costList（目录id/Cost/imgCode）、ruleList、RoleSumProperty、词条档位和资源表。武器没有完整本地目录；官方角色详情会保存武器名称/图/等级等，唤取保存资源ID/kind/name。计算表 calculations/katixiya.xlsx 与 scripts/*character* 是模型维护资料，不是另一个运行数据库。

## 角色、实体和配置

`mcData` localStorage：根 `role[]`、`echoes[]`、`loadoutVersion:2`、`unusedEchoes`。role含roleId本地身份、roleListId目录身份、isImport、gameRoleId/importSource、level/ming、武器技能信息、configurations[]、activeConfigurationId、defaultConfigurationId及costList兼容投影。

声骸：costId是全局实例ID，costListId是目录类型，另含name/type/imgCode/suite/mainAtrri/propertyList/sumScores。不能用名字、属性或phantomPropId证明两次导入是同一个实例。configuration由MultiConfig.configuration创建：id UUID、roleId、name、slots固定五个ID或null、settings（仅damageMode/extraEnergy/referenceHealth）、createdAt/updatedAt/source。

`MultiConfig.project`按active配置生成role.costList，保留中间空槽、裁掉尾空槽；unusedEchoes是全部配置均未引用实体的投影。`references`遍历所有角色/配置/槽，不只当前项。复制配置复制ID引用；equip仅改当前配置，允许别的配置引用同ID，但同配置重复ID与Cost合计>12仍拒绝。edit改唯一实体，project刷新所有活动投影；CharacterCore事务重算变化角色的评分，其他配置下次normalize使用同实体。unlink只去当前引用；destroy才全局移除引用和实体。

删除角色/配置不等于删除共享实体；禁止删最后配置。`overwrite`保留本地roleId，采用官方新记录重建一套配置并分配不冲突的新实例；旧实体留库，不根据相似度合并。批量完整覆盖清理该角色草稿/采纳/旧名，其他角色与全局收藏保留；默认“保留”不会刷新现有角色。

`MultiConfig.migrate/validate/reconcile`：旧格式迁成第一套，保留合法唯一ID及字段；冲突实例产生新UUID并带legacyCostId，元数据随迁移。loadoutVersion非预期拒绝，不强制覆盖。缺引用不猜对象；展示空槽/警告。reconcile桥接Classic编辑到活动配置和实体。commit先保存多键前值至wuwa.multiconfig.transaction.v2，失败回滚，启动recover；localStorage多键日志并不提供跨进程数据库级隔离。

草稿：wuwa.echoTool.drafts.v1包含schemaVersion/revision/baselines/drafts，baseline.role.configurationId绑定具体配置；来源指纹不等于整账号数据。采纳wuwa.echoTool.localConfigurations.v1、名称wuwa.register.names.v1、实体元数据wuwa.register.echoMeta.v1有独立校验。完整备份为format=wuwa-register-backup/version=1，sections.core/drafts/adoptions/echoMeta/names及可选convene；不是任意第三方JSON。备份预览按canonical echoes唯一costId计数，旧格式合并装备与unused后去重。

## 声骸评分：原函数链

js/base.js `getRoleScoreConfig(role)`选角色、0～6链权重及rule，处理49/53模态、51额外充能与newCharacterModels等特例；不能只用基础roleList一行。`getScoreDetails`以词条数值去%后乘实际系数×100/maxscore，系数按crit/attack/element/typeCoefficients等分支选取；返回rawScore及toFixed(2)贡献。`countScores`复用它。主属性使用`countMainAttr`（旧字符串）或`countMainAttr2 + countScores`（结构对象），保留原固定主词条规则，不能统一成纯副词条线性分。

js/role-view-model.js `createAdapter(...)->normalizeRole`在副本上调用旧引擎：每槽=主/固定贡献+舍入后的副词条贡献；完整五槽才算整套充能修正`getRoleEnergyCorrection`，总分=knownContribution+energyCorrection。修正基础为 -(efficiency01-efficiency02)×max(0,echoEnergy-defenseLimit)，角色51另有额外充能转化，再×100/maxscore。模型不支持/词条缺失时为null/incomplete，不伪造0或满分。有效词条按修正前rawContribution>0统计，并非最终整套增益。

js/echo-tool-core.js probability沿用旧离散词条/逐轮舍入假设；不是官方概率校准，不参与上述角色评分。完整明细请直接读base.js、role-view-model及tests/character-chain-scoring、new-character-scoring、role-view-model。

## 唤取归档

ConveneCore.VERSION=1；归档 `{version:1,accounts:[]}`。账号身份为region:server:uid，不按UID首位判断区服。账号字段id/uid/region/server/updated/records/spans。持久化record白名单：id/pool/time/seq/item/name/kind/rank/label/result，手工胜负另evidence:'user'。授权recordId、完整URL、Token不保存。数据库wuwa-convene v1，objectStore archive，key data；跨库恢复前值日志为key restore。

官方行resourceId/resourceType/qualityLevel/name/cardPoolType/time/count被normalize映射；time严格真实公历YYYY-MM-DD HH:mm:ss，count若给出必须1，时间必须倒序、rank仅3/4/5。同时间批次反转成从旧到新seq，id=`pool|time|seq`；order按time→seq→pool。item/rank/kind组成冲突签名，名称翻译不同不作为新抽。同池同秒数量或内容冲突拒绝该池并保留原档。不会按时间+名称粗去重，十连重复保留。

mergeAccount追加，不删除窗口外旧记录；每次成功列表产生first/last span，coalesce只合并实际重叠范围，无重叠保留缺口。combine合并备份，不覆盖已有明确用户标记；仅旧unknown可接纳新增已标记结果。首次导入左端不知起点，第一五星的精确间隔为null；不得把观察数量当终身抽数。kind由isCharacter正则辨识角色，其余保留来源名称。

## 保底及统计

POOLS现值：1限定角色、2限定武器、3常驻角色、4常驻武器均hard=80/repeat=true；5新手50、6选择80但repeat=false；7赠礼映射待核对、8及额外9～20未知，无hard规则。只是当前适配基线，非真实账号当期所有规则已验证。

analyse按pool类型独立计算，同类型活动共用该池历史；没有额外bannerId自动分类，也不将新池名相似就合并。跨连续区间重置lastFive。仅有已知重复池、同连续区间前一五星且间隔≤hard时精确interval有效；超过hard标anomaly，当前pity≥hard也有异常提示。未知、首段和缺口不补猜。pity为最新有效连续区间五星之后数量；否则null并显示observed。总平均/最快/最晚只用已知重复池有效完整五星间隔；不混新手赠礼。

限定结果默认unknown，仅pool1五星允许用户标win/loss/guarantee并声明evidence:user。前一个已确认loss后的非guarantee结果降为unknown；胜率win/(win+loss)，guarantee/unknown不算机会。不能按常驻角色名单猜50/50。

character(account,item)只过滤该资源且isCharacter的五星；total是实际取得次数，平均/最快/最晚是取得当次五星间隔。bannerSpend=null，目标复刻投入/未取得期间投入无法从现字段确定；不是“角色总消耗”。

## 星运公式与称号

ConveneCore.luck：速度draw = 各有效间隔的 `100×(H-N)/(H-1)` 的算术平均。有机会时limited=100×win/(win+loss)，score=clamp(0,100,0.8×draw+0.2×limited)；无机会仅draw占100%，不是把未知当0。draw缺失则score=null。RATING_RULES/ratingDetails直接供规则UI使用，不是另一套文案公式。qualified需≥10有效间隔且相关重复池total≥300；top另需≥30间隔且≥10确认非保证机会。总览相关池total含左删失记录，角色传入的total是其有效间隔和；这是现实现区别。

未达qualified为observing；score≥95但未达top也为observing。其余按未舍入分数：95～100天命共鸣者、85≤x<95星运眷顾者、70≤x<85幸运同行者、40≤x<70平稳共鸣者、20≤x<40逆风漂泊者、0≤x<20深渊守望者。不是概率百分位、无软保底拟合、无全服分布校准；可信度只控制称号资格，不加分。

待确认计算行为：character()始终把win/loss传0，故机会恒0，角色score≥95无法达top，会保持observing。此次仅记录，不修改；它说明“角色专属星运”尚需正式定义。

## 六成就与分享数据

analyse/achievementDetails：one精确间隔=1；ten≤10；pity至少3个有效普通池间隔≥75；streak同池连续3个精确间隔≤20；comeback同连续区间用户确认loss后接guarantee；consecutive精确间隔=1（与one当前相同）。图鉴返回unlocked/notReached/insufficient、target/progress/date；date是当前档案最早可确认达标时间，notReached仅是存档内未达成。缺证据不填伪进度。

RegisterShare用只读RoleViewModel快照；ConveneShare用analyse/character结果与同一消息表，Visuals共用几何。分享不重算另一套分数，不补未知投入，也不读取授权。详见05。
''')
put('04_CONVENE_SYSTEM.md','''# 唤取记录专项交接

## 取得与提交

convene.html → 导入/更新 → 输入官方历史URL；一般界面不要求选择Global/CN。内建教学dialog含Windows/Android/iOS/其他平台，编号步骤、原创流程示意、FAQ。Windows仅解析用户主动选择的日志（≤64MiB），fromLog尝试UTF-8与XOR解码；网页不会扫描磁盘。Android无线调试/Ascent步骤由公开资料重新编写但没有真机验证；iOS专用抓包配置未验证，提供同账号Windows/已有备份替代路径，不承诺跨平台自动取链。

parseURL只接受HTTPS、无用户口令/端口的 `aki-gm-resources(-oversea)?.aki-game.(net|com)` 与 `/aki/gacha/index.html`；参数支持query和hash query。必需player_id、svr_id、record_id、resources_id各一次，lang可选；若query/hash重复或已知svr_area与域名冲突拒绝。授权示例仅用占位符，不能粘贴玩家真实URL到本文件。域名.com→cn，.net→global；server保留svr_id原值，不以UID首位猜区。

## 实际请求契约

Global：`https://gmserver-api.aki-game2.net/gacha/record/query`；CN：`https://gmserver-api.aki-game2.com/gacha/record/query`。都是JSON POST，不是替换网页域名后GET。payload：playerId、serverId、recordId、cardPoolId（来自resources_id）、cardPoolType整数1～20、languageCode。通过本地/Pages `/api/convene`时另带region；服务端剥离region后转发。

上游成功为 `{code:0,data:[...]}`；行保留cardPoolType/resourceId/resourceType/qualityLevel/name/count/time。不接受未知分页对象冒充数组；code非0变AUTH_OR_API。每次请求整个池列表，当前无分页协议适配。默认池1～8，可在进阶查询9～20；未知池保存但无推定保底。前端credentials:omit/referrerPolicy:no-referrer/cache:no-store。

## CORS、代理与错误

直接连接取决于官方CORS；默认使用同源代理。Pages Functions通过CONVENE_PROXY服务绑定独立Worker，Worker复用handle与CONVENE_RATE_LIMITER。根npm start用相同handle加loopback限流替身，不代表线上绑定已通过。

代理限制：JSON POST、同源Origin（存在时校验）、固定两上游与字段/语言白名单、4KiB正文、24MiB响应、20秒超时、禁止重定向、上游错误正文不透传、不记录授权。绑定缺失503，限流429，方法405、格式/大小/来源拒绝。Worker每节点近似40次/60秒限流，非全球精确计费。授权仅在本次请求内存中，记录日志不包含URL/recordId/Token。

fetchPool没有自动重试；sync顺序逐池请求，失败记录安全错误码继续下池，取消不回滚成功池；用户可重试，稳定去重避免重复。20秒AbortController；网络/授权/格式/批次冲突/存储失败在UI显示分类，不回显敏感上游消息。与角色盒子导入的dataToken单次刷新重试是不同机制。

## 保存与完整性

parseURL→payload→fetchPool→Core.normalize全列表验证→store.update事务→mergeAccount→archive；成功后汇总processed/added/duplicates/failed。提交后清空链接；存档只有白名单账号/记录/spans。记录ID和冲突策略见03。首段左删失，只有真实重叠span才合并；无重叠形成缺口，不宣称终身完整。未知池、新响应结构、缺失期记录需后续真实接口适配。

独立导出为version1归档；完整项目备份可选sections.convene。combine只合并，旧项目备份未含convene时保留当前唤取档案。IndexedDB读写事务、WebLock、跨localStorage恢复前值日志与启动中断恢复均存在；没有WebLocks拒绝完整跨库恢复。不要与其他角色编辑标签页并发恢复。

## 分析、星运、成就、分享

UI包含总览、历史、卡池、角色四个分析页；导入为独立视图，数据管理置于账号栏。历史支持组合筛选/重设/分页/用户限定结果证据标记；卡池分布/月趋势/最近五星/时间轴；角色按资源ID映射立绘和全部取得。没有可靠活动目标投入，bannerSpend未知。规则面板读取RATING_RULES和ratingDetails，图鉴读取achievementDetails，避免另写一套计算。

整体/角色各简略/详细Canvas，角色详细每页12条、全部页可下载；同一dataURL用于预览与下载。几何徽章共用SVG/Canvas；三语适配、字体缩放/有限截断。手机重排阅读顺序，dialog固定最大视口并滚动，不是简单缩放桌面。

## API验证状态（本次）

|证据层级|状态|
|---|---|
|静态代码/语法/本地依赖|本次执行通过，见08|
|Fixture/Mock核心与代理|本次单元测试通过|
|隔离浏览器模拟Global/CN导入|本次1440/390×三语通过|
|真实官方授权POST|未验证，无真实授权条件|
|真实用户完整历史导入|未验证；不索取私人Token|
|真实Windows日志与Android/iOS设备取链|未验证；Windows只用合成日志|
|Cloudflare线上Pages/Worker|未部署验证，只有代码与模拟测试|

旧文档提到的历史无授权OPTIONS结果属于当时观测，本次未联网重验，也不能推导POST成功。当前问题：池7/8/新增池规则未核实、角色最高档门槛问题、所有真实平台与生产环境验证缺口，详见09。核心已有实现，不能将其说成全部已正式运营验证。
''')
put('05_SHARE_AND_BADGES.md','''# 分享图片、称号与徽章

## 声骸养成

js/register-share.js原生Canvas，snapshot复制所选RoleViewModel及配置名，不截网页。compact宽1440，detailed宽2040，高度按角色信息/名称/五卡/词条/汇总动态计算；临时canvas初始1150高不是最终固定高度。PNG下载；简略/详细、统一贡献雷达/原始分刻度、主/副词条、角色立绘及配置名。图片异步加载、超时和失败占位，远程图跨域失败可能缺图；file来源可主动选资源替代。字体system-ui/sans-serif，自动折行/测量，未封装一个必需在线字体。Classic原页面未被改成新分享模板。

本次多配置浏览器6组实际生成12张旧养成PNG；现有register-share/share-radar单元回归通过。未验证Discord真实客户端上传/压缩、所有外部图片CORS及所有系统字体。

## 唤取整体与角色

js/convene-share.js render独立Canvas→dataURL，预览/下载字节相同，不截UI。整体/角色×compact/detailed四种模式，dark/cyan/gold共鸣波形与几何徽章。宽固定1200；整体compact高1080，整体detailed高1480+52×池数。角色历史historyH=92+54×本页条数；compact最近3条，高690+historyH+155；detailed每页12条，高690+historyH+500。页数ceil(全部取得数/12)，最后页自然较短，全部取得含超过七次不会丢失。

数据来自ConveneCore.analyse/character，当前不足/未知沿用真实状态，未补造角色总投入。整体有分数/称号/样本、总抽/五星/平均、成就带/限定结果，详细加各池与分布；角色有立绘/次数/平均/最快/最晚、全部取得时间及当次间隔，详细另分布。角色立绘只允许本地image/characters文件，等比contain，8秒解码失败用中性徽章，不用错角色图。武器无可靠本地目录时使用image/convene/weapon-emblem.svg中性符号。

字体Segoe UI/Microsoft JhengHei/sans-serif，文字测量缩字至下限后有限省略；不同系统的字形可能略变。默认无UID，可选遮蔽UID，不绘制授权信息。fixture图片注明测试数据，不代表真实玩家战绩。本次30张（24主版本+6续页）及6阶样本，15个三语布局边界通过。

## 当前已实现的称号与图标

六阶阈值与资格见03；显示中文/英文称号、描述、分数、可信度与规则拆解。js/convene-visuals.js的geometry/badge/drawBadge共用总体与角色绘图：从低到高4/6/8/10/12/14边形、1～6层翼线，最高两阶带冠饰，observing为虚线中性几何。颜色也分六阶。**因此当前并非“没有六阶徽章”**，但属于同一套共用程序几何，不是每系统独立原创角色徽章资源集。

achievementIcon提供六个SVG路径：one/ten/pity/streak/comeback/consecutive；图鉴显示进度、证据不足、解锁日期。整体PNG当前成就条使用通用星形符号及文字，没有在PNG逐个绘制六种SVG成就图标；不能将网页图鉴徽章误写成全部PNG成就图集。

## 尚属讨论，不在本次新增

- 整体星运六阶专属美术体系：共用几何已有，更独立的资源设计未实现。
- 角色星运独立六阶徽章/独立称号与Discord专项设计：当前角色分享复用总体星运函数和几何，不能当作已做专属规则。
- R0～R6目标、指定角色目标链累计抽数评级、0～6命各阶段累计抽数分享：未实现。声骸角色ming链数不是这套唤取目标功能。
- 超过七次取得的专属超额战绩展示：未实现专门模式；一般历史和详细分页已保留所有取得。

Discord可能将1200宽长图缩成缩略图、把2040宽养成详细图文字缩小；需实际客户端验证。当前没有直接发Discord或外部上传按钮，未进行未经授权的发布。
''')
put('06_UI_UX_STATUS.md','''# UI/UX现状

以下从当前CSS/JS和本次重跑截图得出；不是沿用旧示意图。样本均为fixture。evidence/screenshots为代表性实跑截图，原始浏览器结果JSON和测试日志见evidence/tests；完整重复截图未再全量塞进ZIP。

|区域|当前代码实现/交互|验证与待调整|
|---|---|---|
|Register整体|深色、青绿/金色、圆角面板，共鸣线条；顶部导航和手机底部入口|1440/390三语实际交互；真机/字体放大未测|
|角色详情|侧栏角色立绘/配置切换/管理，五槽贡献、单件原位展开、整套统计和分享|配置管理/对比/切换/删除6组通过；空值必须保留提示|
|配置管理|原生dialog滚动列表、每配置菜单，名称/默认/复制/删除；旧高级区默认收合|桌面双栏比较、手机单栏，不再狭窄通用窗；同声骸项有稳定实体信息|
|声骸背包|搜索+筛选按钮，下方折叠面板，默认hideUsed=true；重开/重设恢复默认|共享状态数据驱动渲染；关闭隐藏可选择已用实体，17组×6通过|
|完整声骸库|检索和词条读数，桌面列表+详情检查器；手机切换详情|这是独立库的检查器，不能将它误认成禁止的背包固定右筛选栏|
|唤取总览|单一导入主入口、四分析页、账号/次要数据管理，评级主视觉/六指标/卡池/最近五星/图表|手机阅读顺序主卡→核心→近期/成就→卡池/图表；不同于桌面缩小|
|唤取导入|自动识别来源，正常表单无地区选择器；进阶仅连接/额外池；进度、取消/部分失败|双区mock、重复/增量/取消通过；真实API未验|
|唤取历史/卡池|可折叠组合筛选、重设/分页，五星重点图卡，其他紧凑；池选择、分布、月份/时间轴|真实浏览器操作，通过；未知物品沿用导入名|
|唤取角色|本地立绘contain、四指标、完整取得记录、情境分享|立绘加载和PNG边界通过；无可靠目标投入明确未知|
|教学/规则/图鉴|受视口约束原生dialog，滚动主体/关闭/Escape焦点返回；四平台教学、六阶门槛和个人拆解、六成就|三语桌面手机实测；真实平台取链不因此已验证|
|分享预览|模式/分页/下载同PNG，角色12条一页|四模式三语、续页和下载字节一致通过|

## 实际响应式断点

css/convene.css：min1100六列指标、max1099中屏重排、max700手机布局/底部导航/主卡阅读顺序；prefers-reduced-motion适配。
css/multi-config.css：max700管理/对比单栏，dialog max-height使用dvh。
css/register-workspace.css：1100、960、760、700、650、600、480多处组件断点；背包筛选max600单栏、max480紧凑footer，详情检查器max760切换；存在后置覆盖，不能只引用文件前段旧grid声明。
css/character-dock.css及css/role-register.css还承担角色列表/详情布局，修改需同时查级联、view参数和旧版桥。

## 完成度边界

设计决策已记录于docs/convene-ui-v2.md、docs/multi-config-ui-fix.md和docs/inventory-sharing-fix.md；代码已实现且本次截图验证上述桌面/手机视口和三语路径。未完成的验证是实体手机（尤其iOS Safari）、浏览器/系统字体矩阵、极长未知名/大字号、Discord缩略图。没有将“截图看起来正常”替代精确数据断言，也没有本次修改UI。
''')
# Recompute latest-task differences from a real retained baseline, not HEAD alone.
old=R/'artifacts/inventory-fix-20261020/convene-ui-v2/BASELINE.json'
if old.exists():
 b=json.loads(old.read_text('utf-8-sig'));before={f['path']:f['sha256']for f in b['files']};now={f['path']:f['originalSha256']for f in snapshot['preExclusionSourceFiles']}
 changes={'baselineAt':b['at'],'changedExisting':[p for p in before if p in now and before[p]!=now[p]],'newFiles':[p for p in now if p not in before],'missingFormerSource':[p for p in before if p not in now]}
else:changes={'baselineAt':None,'note':'无法确认上一任务开始前的基准；不编造差异'}
data('latest-task-changes.json',changes)
put('07_LATEST_CHANGES.md',f'''# 最近修改与本次封装

最近产品任务：唤取记录 v2 UI与体验重构。本次重新比较留存于上一任务的实际文件SHA基准（{changes.get('baselineAt')}）及当前工作区SHA；机器清单见latest-task-changes.json。它是当前可用的任务开始基准，不能把HEAD当作这次任务起点。更早Codex任务的精确归属无法仅靠Git恢复。

## 实际改动文件

已有文件改动：{', '.join('`'+p+'`'for p in changes.get('changedExisting',[]))}。

新增文件：{', '.join('`'+p+'`'for p in changes.get('newFiles',[]))}。

Git HEAD下还有已改8文件及未跟踪的新唤取模块/部署/测试，见GIT_STATUS.txt；未跟踪文件全部进入实际源码快照，不只封Git diff。此次封装临时脚本不属于产品新增功能。

## UI/数据差异

导入按钮统一、正常界面地区选择移除（地区解析仍保留）、内建教学替代外站主入口；总览主视觉、四分析导航、移动阅读顺序、卡池/角色层级调整；新增个人评级拆解、成就进度/日期/证据状态及六阶共用几何；Canvas重新布局、详细角色12条分页可下载全部取得。没有增加R0-R6目标评级或独立角色投入模型。

数据核心保留schema1、去重/保底/星运数值；新ratingDetails和achievementDetails为展示衍生数据。公历校验修复，错误日历时间会被拒绝，不自动删除已有个人记录；RegisterBackup预览统计canonical唯一costId或旧格式装备+库去重，不改备份内容/共享引用。新增10项v2单元及页面/故障/PNG回归。

## 本次交接没有产品变更

仅在独立artifacts封装目录生成副本/文档/测试输出。源文件前后SHA复验；包内历史未使用凭证脱敏是唯一源文件字节差异，见sanitization.json，工作区未改。旧图片不删源文件，只在包内排除已证实无引用的历史副本。

Classic不被本次整理更改。上一v2产品任务的间接风险集中在共享的register-backup预览、严格日期拒绝和导航集成；原评分/共享核心/旧分享未在v2改，现有回归通过。真实API/生产/设备未验，角色最高档及双成就重合语义仍待确认，不能写为已解决。
''')
put('09_NEXT_IMPROVEMENTS.md','''# 基于实际代码的后续建议

## 三个优先问题

1. **真实接口与新池规则验证缺口**：ConveneService/POOLS只经过mock及固定协议检查，池7/8/9～20规则未知。具备授权条件时由维护者私下验证Global/CN真实响应结构/当期池ID/继承关系/授权/CORS，再补脱敏fixture；同时在实际Cloudflare绑定环境验证限流和错误处理。不能用旧OPTIONS观测证明POST。
2. **角色最高档资格疑点**：ConveneCore.character向luck传win/loss=0，最高档却要求10确认机会，因此角色score≥95会显示observing。总体与角色评级是否该同门槛需产品决策；本任务不擅改公式。one/consecutive两个成就也完全同条件，应确认是否意图保留重复语义。
3. **跨存储/跨页并发恢复风险**：多配置commit是localStorage多键补偿日志，ConveneStore完整恢复另跨IndexedDB。角色其他标签页不参与同一个WebLock；已有回滚测试不等于所有时序原子。优先补多页写入/恢复交错测试，再决定统一异步存储方案。

## UI、可靠性与测试

- 当前1440/390三语页面和PNG已重跑；真实Android/iOS设备取链、Safari/Firefox、系统字体/放大和键盘导航矩阵未覆盖。Android教学来自公开协议但未经设备实测，iOS专用步骤明确保留验证边界。
- 新武器资源只有官方名称/中性图标，不要将错误角色图片当作武器；若需完整武器图鉴应先确定稳定资源来源及许可证。
- 角色/声骸图分散在CSS与目录，未来可增加统一资源引用审计；必须保留OCR两种核心/三语模型。当前远程声骸URL仍依赖网络/CORS，分享缺图降级值得加断言。
- 大存档：analyse按池多次过滤和逐记录span查找，validate反复find，真实几十万抽的延迟/内存未测；先用合成规模基准定位，不凭空重写计算。
- 多个旧浏览器测试硬编码本机Playwright路径；本包有不改测试的适配运行器。后续正式维护可统一工具入口，现无CI配置保证线上执行。
- 历史docs是各任务当时记录，有互相覆盖的描述，例如multi-config末尾“没有新增唤取”是该任务当时范围，不是当前产品状态；以代码和本handoff优先。
- 图片导出本次通过，但Discord实际压缩/长图缩略可读性没有验证；先测现有1200/2040宽PNG，再决定是否需要独立社交模板。

## 需求与构想的边界

目前无证据有另一个正式未完成开发需求正在实现。后续维护建议不等于用户已批准改公式/重构。
仅讨论：整体/角色专属美术徽章、角色独立称号/Discord模板、R0～R6目标、按目标链累计抽数评级、0～6命阶段分享、>7次专属超额展示。共用六阶几何与一般角色分享已经实现，不能因讨论新的专属方案而把现实现写成不存在。

旧方案已取代：外站作为唤取教学主入口；背包固定右筛选栏；声骸已被其他角色使用就禁止选取。除这些有代码证据的替代外，其他计划是否正式取消无法确认。
''')
put('10_DEPLOYMENT_AND_ENV.md','''# 运行与部署

## 本地

根package.json version2.0.0，没有dependencies/devDependencies，故根无lockfile属实际现状，运行不需npm install。Node24.13.0/npm11.6.2本次实测；没有更低Node兼容矩阵。`npm start`→127.0.0.1:8124，`PORT=其他端口`（PowerShell先 `$env:PORT='8125'`）可调。必须用localhost HTTP/HTTPS，不能将file://下Worker/IndexedDB/锁失败当作产品正常。

静态HTML/JS/CSS直接服务，无build脚本/打包器。npm start的scripts/serve.cjs提供静态文件白名单与同源/api/convene固定端点适配，绑定loopback；不监听局域网、不打印凭证。角色盒子仍直接访问其既有社区API，不复用唤取代理。

## 测试依赖

`npm test`、`npm run check:static`用Node内建功能。浏览器测试单独在handoff/browser-tools运行`npm ci`，精确Playwright1.62.1及lockfile；`npx playwright install chromium`。回根执行 `node handoff/run-browser.cjs tests/convene-browser.cjs`；可设WUWA_BROWSER_CHANNEL=msedge使用已安装Edge。旧脚本硬编码本机模块地址由运行器映射，不需要修改产品/测试原件。浏览器输出环境变量见08，始终隔离上下文。

## Cloudflare结构

根wrangler.toml：name=wuwa-echo-tool、pages_build_output_dir='.'、compatibility_date=2026-10-19、services绑定CONVENE_PROXY→wuwa-convene-proxy。functions/api/convene.js映射/api/convene，优先转service binding；若直接handle仍需限流binding，否则503。

convene-worker/wrangler.toml：main=index.js，导入共用handle；observability=false，ratelimits.CONVENE_RATE_LIMITER namespace_id='1001'，40/60秒。Wrangler需支持Rate Limiting binding（既有说明要求≥4.36），实际当前安装/账号配置未确认。配置中项目/服务名是仓库默认值，不能假设已部署到用户账号。

维护者自行部署示例（本次没有执行）：`npx wrangler@4 deploy --config convene-worker/wrangler.toml`；本地平台模拟 `npx wrangler@4 pages dev .`。发布前应单独准备干净发布目录，仅运行资源/Functions/实际配置，排除tests、artifacts、handoff与私人文件；直接发布整个交接根目录可能暴露审计资料。本任务没有创建发布产物或改变现有配置。

_headers只设置/image/*缓存7天+stale7天。项目没有_redirects或自定义SPA重写文件，不假设不存在的路由规则；实际HTML入口通过query view/roleid/configuration/lang控制。浏览器默认同源代理需要Functions，纯静态托管只能尝试直接官方模式并受CORS限制。

## 环境/凭证

服务端没有必须填写的真实.env密钥；需要的是绑定名称CONVENE_PROXY/CONVENE_RATE_LIMITER。本地PORT可选。Cloudflare部署认证由维护者正常工具管理，不进入源包。角色盒子kjq_token/kjq_bat是用户浏览器授权，唤取record_id是短期链接授权；都不作为包内环境变量样例真实值。

外部依赖：api.kurobbs.com及其鉴权/验证码/签名契约、两个官方唤取POST端点、部分声骸图URL、既有CryptoJS CDN（HTML带本地资源回退）。角色当前WebP与OCR核心/三语模型在本地保留。无证据支持离线导入真实账号，亦无服务器自动备份/云同步。

部署前：单元/静态/隔离浏览器三语、备份恢复、秘密扫描、绑定缺失拒绝、429/上游错误和真实授权私下验证；生产配额/域名/CORS/TLS/实际账号部署全部仍需维护者确认。不要把本地Mock通过当线上成功。
''')
base=R/'artifacts/multiconfig-20261020/source-stage/WuwaEchoTool/handoff'
for n in ['run-browser.cjs','browser-tools/package.json','browser-tools/package-lock.json']:
 p=H/n;p.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(base/n,p)
print('Documentation and module indexes generated.')
