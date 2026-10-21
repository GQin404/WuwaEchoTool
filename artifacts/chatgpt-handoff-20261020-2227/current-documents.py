from pathlib import Path
import json,hashlib
W=Path(__file__).resolve().parent;R=W.parents[1];S=W/'stage/WuwaEchoTool';H=S/'handoff'
def put(n,t):(H/n).write_text(t.strip()+'\n',encoding='utf-8')
def load(n):return json.loads((H/n).read_text('utf-8'))
def data(n,x):put(n,json.dumps(x,ensure_ascii=False,indent=2))
# Recheck all current task delivery hashes and protected calculation/storage sources.
latest=json.loads((R/'artifacts/convene-ui-rework-20261020/changes.json').read_text('utf-8'))
for f in latest:assert hashlib.sha256((R/f['path']).read_bytes()).hexdigest()==f['afterSha256'],f['path']
baseline=json.loads((R/'artifacts/convene-ui-rework-20261020/baseline.json').read_text('utf-8-sig'))
for p in ['js/convene-core.js','js/convene-store.js','js/convene-character-rating.js','js/base.js']:assert hashlib.sha256((R/p).read_bytes()).hexdigest()==baseline['hashes'][p]
data('latest-task-changes.json',{'task':'唤取记录参考图UI/UX重构','changes':latest,'protectedCoreUnchanged':['js/convene-core.js','js/convene-store.js','js/convene-character-rating.js','js/base.js'],'baseline':'task-start file hashes; Git HEAD cannot identify untracked development boundaries'})
mods=load('module-index.json')['modules'];by={m['id']:m for m in mods}
by['convene-import']['risk']='普通UI自动直连；仅NETWORK/TIMEOUT降级本站代理，授权/限流/无效数据/上游错误不重试；逐池提交、取消保留成功池；生产授权未验证'
by['convene-url']['dataSource']='白名单官方HTTPS链接或主动选择的Logs文件夹/单日志；本地UTF8/XOR，只尝试Client.log/debug.log，不自动导入'
by['convene-entry']['tests']+=['tests/convene-ui-reference.test.cjs','tests/convene-ui-reference-browser.cjs']
by['convene-entry']['risk']='限定双主卡/次要池折叠；角色立绘与独立手机顺序；局部CSS后置覆盖需核对；本次只封装不再改UI'
by['convene-share']['risk']='showUID默认false，只隐藏/完整UID；masked旧参数不产生UID；页面与PNG同快照。具体武器图无可靠映射，只是明确类别示意'
for m in mods:
 if m['id'] in ['convene-url','convene-import','convene-share']:m['tests']+=['tests/convene-ui-reference.test.cjs','tests/convene-ui-reference-browser.cjs']
 if m['id']=='convene-proxy':m['risk']='自动前端诊断区分代理404/405/503；显式旧proxy:true调用保留PROXY_REQUIRED兼容。部署绑定和真实授权未验证'
data('module-index.json',{'formatVersion':1,'pathBase':'project root','modules':mods})
lines=['# 功能与代码映射','','当前源码核对，路径相对项目根；与module-index.json一致。','']
for m in mods:lines+=['## '+m['name'],'',*['- '+label+'：'+', '.join('`'+p+'`'for p in m[key])for label,key in [('入口','entry'),('核心','core'),('依赖','dependencies'),('UI','uiFiles'),('测试','tests')]],'- 数据：'+m['dataSource'],'- 保存：'+m['storage'],'- 风险：'+m['risk']+'；Classic影响：'+m['affectsClassic']+'。','']
put('02_MODULE_MAP.md','\n'.join(lines))
fdata=load('feature-status.json');features=fdata['features']
for f in features:
 for key in ['verified','scope','knownIssues','nextStep']:
  if key in f:f[key]=f[key].replace('本次139项','本次145项')
 if f['name']=='唤取记录导入':f.update(scope='官方URL/地区/英数服务器识别、逐池去重合并、自动直连和代理备援、细分HTTP原因；普通UI无额外池ID/手动通道',verified='本次唤取6+目标6+参考6流程，自动连接成功/降级/取消/失败不写入单元，合成文件夹/UTF8/XOR日志',knownIssues='真实官方接口与生产CORS/代理绑定未验证；自动模式每池可能各尝试两通道；缺少合法活动元数据',nextStep='生产实际部署和授权条件下单独验证，不能将Mock当成功')
 if f['name']=='称号及特殊成就':f.update(scope='总体/角色两个六阶族、14透明SVG；复杂度逐级增加金属层/羽翼/冠饰、统一三类图鉴',verified='本次SVG/Canvas共享图元、六阶严格递增单元、三语图鉴及计算PNG样本')
 if f['name']=='唤取记录分享':f.update(scope='整体/角色四模式+R目标两模式，1200宽PNG；showUID仅完整/隐藏且默认隐藏，分页/超额/徽章开关',verified='本次四模式与全部R0～R6下载示例、PNG预览字节一致、72基础回归PNG和额外参考下载、51Canvas案例',knownIssues='区间效率不代表实际活动投入；外部render未传characterRating仍保留旧兼容回退；Discord客户端未测')
 if '布局' in f['name'] or '桌面' in f['name']:f.update(scope='角色工作台与背包/配置UI保留；唤取限定优先、大立绘、桌面多列时间轴/手机单列、44px按钮、全宽卡片',verified='本次工作台/共享/配置各6流程，唤取三组各6三语视口流程；仅Edge 1440/390，不是实体手机')
features.append(dict(name='参考图驱动的唤取视觉重构',status='已实现且已验证',scope='三组PNG/SVG规范；限定双主卡、最近限定、其他池折叠、大立绘、独立手机顺序、复杂度递增徽章、简化导入和本地教学',files=['js/convene-ui.js','css/convene.css','js/convene-visuals.js','docs/convene-reference-rework.md'],verified='本次参考6组三语视口、角色图片失败占位、手机卡片满宽、筛选、视频预留、四分享/R例/UID、数据不变；结构参考原图随源码保留',unverified='实体手机/Discord真实客户端/具体武器图/真实游戏日志',knownIssues='没有可靠具体武器图片目录或资源ID映射；继续显示明确类别SVG',nextStep='核对具体武器图库授权及映射、真实设备和大档案表现'))
fdata.update(features=features,partialImplementation=['武器记录名称及类别SVG存在，具体武器图鉴/ID映射缺失','实际活动投入和真实链未知；窗口R目标/双徽章/分享已实现'],cancelledOrSuperseded=fdata['cancelledOrSuperseded']+['普通导入额外池ID/手动连接控件由自动通道取代','分享遮蔽UID选项已由默认隐藏/完整显示取代'],warning='以当前源码为准；附件内将双徽章/R目标等列未来的旧模板不适用；实际投入与真实链仍未知')
data('feature-status.json',fdata)
lines=['# 当前真实开发进度','','状态仅指实测范围；真实官方授权/生产/实体设备未验证。','|功能|状态|实际范围与代码|已验证|未验证和问题|下一步|','|---|---|---|---|---|---|']
for f in features:lines.append('|'+ '|'.join([f['name'],f['status'],f['scope']+'；'+', '.join('`'+p+'`'for p in f['files']),f['verified'],f['unverified']+'；'+f['knownIssues'],f['nextStep']])+'|')
lines+=['','## 计划、取代与无法确认','','实际活动证据驱动的真实投入仍部分实现；Discord客户端调优/自动外部上传仅讨论；没有证据支持另有后台开发任务或其他正式取消项。','已取代：右侧固定背包筛选/已用禁选、外站教学主入口、普通导入手动通道/额外池、分享遮蔽UID。','无法确认：历史用户截图所在站点及当时HTTP状态、真实官方授权/完整玩家导入、实际生产绑定和设备。旧截图代理问题不等于当前代码仍混用404/405/503或全败提示部分成功。']
put('01_CURRENT_PROGRESS.md','\n'.join(lines))
p=H/'00_READ_FIRST.md';text=p.read_text('utf-8').replace('最新开发增加英数字母服务器兼容、独立角色窗口评级、双徽章族、R0～R6目标和超额战绩PNG。','已存在英数服务器兼容、角色窗口评级、双徽章/R目标/超额PNG；最近完成限定优先、大立绘/独立手机版、六阶复杂度重绘、自动连接、本地日志文件夹教学和分享UID默认隐藏/完整显示。').replace('新开发说明docs/convene-integration.md优先于历史任务文档。','最新docs/convene-reference-rework.md及docs/ui-reference/说明视觉；计算细节继续读docs/convene-integration.md和03。').replace('404/405/503共用代理文案及全部失败仍显示部分失败是当前可复现逻辑风险，仅记录未修复。','最新普通UI自动模式已区分代理404/405/503，全失败文案已修复；旧显式proxy:true兼容调用仍有泛化错误码。').replace('只检查、独立测试、写交接与封装','只检查、独立测试、写交接与封装');put('00_READ_FIRST.md',text)
p=H/'04_CONVENE_SYSTEM.md';text=p.read_text('utf-8');a=text.index('convene.html的单一');b=text.index('\n\n',a);text=text[:a]+'''convene.html单一导入/更新入口。普通UI只有URL/自动来源提示/开始停止，不再有额外池ID和手动连接。Windows优先选择Logs文件夹（只尝试Client.log/debug.log、按修改时间、64MiB每文件、UTF8/XOR）；单文件为备选，固定第三方源码仅进阶参考，教学视频明确未提供。不扫描未授权磁盘、不执行脚本、不修改游戏配置。Android/iOS分开且设备未测。''' +text[b:]
text=text.replace('直接模式受官方CORS，默认同源代理。','普通UI传proxy=auto，先直接请求固定官方端点，NETWORK/CORS或TIMEOUT才降级固定本站代理；授权、限流、无效响应、上游故障不换通道重试。函数旧默认proxy=true及显式false保留兼容。')
a=text.index('URL分FORMAT');b=text.index('\n\n',a);text=text[:a]+'''URL分FORMAT/MISSING/PARAMETER；官方拒绝AUTH_OR_API不据此确定过期；畸形JSON/code/data→INVALID_RESPONSE；NETWORK/TIMEOUT/UPSTREAM_UNAVAILABLE/STORAGE_FAILED分别处理。普通UI自动降级代理404→PROXY_NOT_DEPLOYED、405→PROXY_METHOD、503→PROXY_UNAVAILABLE；旧显式proxy:true仍保留PROXY_REQUIRED。每池仅受条件约束的两通道尝试，无定时无限重试；sync逐池继续、保存成功，失败池不写，取消不回滚已有成功。全部失败显示importFailed；部分成功才partial；无新增分别unchanged/noData。HTTP分类不能替代生产配置诊断。''' +text[b:]
text=text.replace('超额/UID遮蔽/徽章开关','超额/完整UID或隐藏（默认）/徽章开关').replace('桌面并列，手机目标单栏、全宽分享、证据折叠','总览限定双主卡与其他池折叠，桌面角色大立绘与数据/评级并列、多列时间轴；手机按主视觉/核心数据/评级/时间轴/分享排列，卡片满宽、证据折叠')
text=text.replace('当前风险：三个HTTP状态共用代理提示、八池全败仍用“部分失败/成功已保存”文案；未知池规则、新接口字段/分页、实际活动元数据、真实设备/生产验证不足。本次只记录，不修复产品。','当前未验证：生产CORS/代理与真实授权、未知池规则、新接口分页、实际活动元数据、实体设备。历史泛化代理文案和全败提示已在上一开发任务修复，本交接任务未改产品。')
put('04_CONVENE_SYSTEM.md',text)
p=H/'05_SHARE_AND_BADGES.md';text=p.read_text('utf-8').replace('默认不显示UID，可选仅遮蔽','默认不显示UID，可选显示完整UID；showUID=false为默认，旧masked参数不再输出UID').replace('总体星轨/分阶轮廓/结晶/高阶冠饰，角色不同盾框/双星/链结；不只是换色。','总体星轨/星核，角色盾框/双星/链结；最新每阶增加金属轮廓/羽翼/刻纹/冠饰/宝石，严格递增路径数，不只是换色。')
text+='\n## 最新视觉与隐私回归\n\n角色主图范围加大并等比contain。武器使用明确类别原创SVG，缺具体图库/映射；不宣称是该武器官方立绘。参考浏览器另实测四类PNG、全部R0～R6示例、完整/隐藏UID及legacy masked默认不泄露；额外下载数见08机器结果。旧72基础回归不包括这些额外下载。'
put('05_SHARE_AND_BADGES.md',text)
put('06_UI_UX_STATUS.md','''# 当前视觉与交互现状

## 已设计、已实现、已截图验证

三组结构规范在docs/ui-reference/，PNG和SVG原样保留，附README；docs/convene-reference-rework.md为最近开发说明。整体为深色鸣潮风格、圆角、金色/薄荷共鸣元素、原生SVG/Canvas。上一任务确有独立高保真HTML/CSS及真实截图；本包不重复封其448张产物，保存结构原图和本次复跑代表证据。

- 总览顺序：总体徽章/称号/分数/可信度→限定角色/限定武器双主卡→最近限定五星→其他池折叠→全量统计/分布/月趋势/成就。未导入池明确无记录，不造保底。
- 角色桌面：大立绘在左、核心数据和独立R评级在右，下方完整多列取得时间轴与分布；修复分布卡被拉成长空白。角色图映射到本地WebP，contain，无图则占位。
- 手机：独立单栏按角色主视觉/核心数据/R评级/时间轴/分享；时间轴满宽，操作≥44px，底栏留出滚动空间。全页截图固定导航在首屏位置，不能将其位置误判成实际页面中部漂浮控件。
- 历史：搜索、池/品质/角色武器/日期组合过滤、重置、分页，玩家结果标注保留。
- 导入：URL和自动识别、开始/取消。移除普通UI额外池/手动通道，自动直连或代理备援，分级错误、全败/部分成功区分。
- Windows：本地文件夹快速解析与单文件备选、进阶固定源码链接、视频未提供预留。不执行脚本。
- 徽章：总体与角色独立族，六阶轮廓/金属层/羽翼/冠饰复杂度递增。SVG与Canvas同源，图鉴不把未授予说成已获得。
- 分享：四模式及目标两版保留，UID默认隐藏、仅可完整显示，预览下载一致；实际活动投入未知不变。
- 角色工作台/共享背包/配置比较沿用现有实现，本任务不改；本次独立副本各6组三语视口回归。

## 响应式与三语言

css/convene.css有≥1100、≤1099、≤700，最新覆盖含701～1100与≤700，需按最终层叠理解，不只读第一段旧规则。视口1440/390×简中/繁中/英文实测，含横向溢出、手机顺序和卡片宽度、图片解码、缺图占位、按钮/对话框。外部手机系统原生文件选择按钮的文字由浏览器系统语言决定；网站标签有三语。实体手机、Safari/Firefox未验。

## 仍待调整或验证

具体武器立绘/资源ID映射不存在，当前是明确类别示意图。大量历史逐条DOM性能、更多窄屏/平板/长译文、真实设备字体、Discord压缩、未来教学视频均未完整验证。复杂度递增已实现，视觉喜好与真实32px小尺寸识别仍可继续用户验收；不改变评级阈值。''')
lines=['# 最近一次开发任务与本次封装边界','','上一任务：参考图驱动的唤取记录UI/UX重构。当前包按工作目录，不按Git HEAD复原；唤取源文件仍有未跟踪项，HEAD diff不足以描述任务边界。','', '实际修改33个源码/资源/测试/文档文件，latest-task-changes.json列路径及可核对SHA；仅任务开始记录过的6个核心UI文件有before SHA，其余不伪造旧hash。','',*['- `'+x['path']+'`'for x in latest],'','主要变化：限定主卡优先、角色大立绘/独立手机顺序、时间轴与空白/字号修正、六阶层次重绘、普通导入自动连接及细分HTTP错误、全败不冒充成功、本地文件夹教学和视频预留、分享完整或隐藏UID。','', '数据流仅改变请求通道选择/界面派生/Canvas，原逐池合并与存储/计算函数保留。任务开始baseline核对convene-core/store/character-rating/base四文件原SHA一致；主公式/档案schema/Classic业务未改。Canvas/视觉共用代码有Register导航入口影响，旧养成与共享/配置浏览器仍回归。','', '测试新增convene-ui-reference.test.cjs及浏览器脚本，适配目标/故障脚本的完整UID和教学选择器；上一任务145单元/18流程通过，本包重新全套核对见08。','', '仍未解决：真实官方授权与部署验证、具体武器图库、真实活动投入元数据、实体手机和Discord客户端。旧全败和普通UI泛化代理错误不再列未修复。','', '本次只读交接：独立复制、检查、测试、文档、脱敏副本与ZIP。未修改产品/测试原件、Git分支或用户数据。']
put('07_LATEST_CHANGES.md','\n'.join(lines))
put('09_NEXT_IMPROVEMENTS.md','''# 当前后续建议（不在本次实施）

## 优先处理

1. 真实授权/生产通道验证：auto仅NETWORK/TIMEOUT降级；当前有可测试的404/405/503分类，不等于部署已成功。核对CONVENE_PROXY/CONVENE_RATE_LIMITER及实际站点响应；不把旧截图当现版问题已重现。
2. 具体武器图片和稳定ID映射缺失：当前明确类别SVG。取得授权和可核验映射后再扩充；未知不得错配角色图。
3. 跨localStorage/IndexedDB恢复并发：前值/日志可回滚但不是跨库原生原子事务，真实多标签页冲突与大存档恢复应补故障覆盖。

## 可靠性、UI和维护

同一池自动直连受限时可能每池均试两通道，真实网络延迟与CORS预检需测；维护错误兼容边界，避免授权/限流时切通道绕过拒绝。大档案当前逐条DOM、月趋势/时间轴无虚拟化，需要实际性能测量再优化。css/convene.css有多轮后置覆盖，应在后续开发整理视觉分区并保留三语断点回归，不能在打包任务改CSS。

新Windows快速方法只是本地日志夹读取，未实机核对新版本日志；视频明确未提供，内容待用户制作。桌面/手机视口通过仍需实体设备/更多宽度/字号/键盘和屏幕阅读器验证。Discord超长图可读性/实际客户端压缩未验证。

## 计算与测试缺口

one与consecutive当前条件有重复语义，先由产品确认再调整。未知新池/卡池继承/响应分页、当前游戏版本规则来源未完整验证。角色窗口160参考值不是官方概率或实际消费，真实活动投入/真实链仍未知；可靠活动身份和起点证据是前置条件。

## 正式已做、条件不足与仅讨论

多配置、跨角色共用、唤取、双徽章、R0～R6窗口目标/独立角色称号、超额战绩、默认隐藏UID、限定优先与独立手机布局已经实现。真实投入评价仅有未知保护/窗口替代口径，不能当全部完成。客户端特调/外部上传、概率百分位等仅讨论，无证据表明有另外后台开发任务。

## 已被取代

背包右侧固定筛选、已用禁选、唤取外站教学主入口、普通导入手动连接/额外池ID、分享遮蔽UID已取代；保留底层兼容API不代表应重新放回普通UI。无证据的其他正式取消事项不编造。''')
p=H/'10_DEPLOYMENT_AND_ENV.md';text=p.read_text('utf-8').replace('浏览器默认同源代理需要Functions，纯静态托管只能尝试直接官方模式并受CORS限制。','普通UI自动先直连，NETWORK/TIMEOUT才降级同源代理；纯静态托管缺代理时显示404/405等独立原因，直连仍受官方CORS。底层默认proxy:true保留旧程序调用。').replace('当前404/405/503共用前端文案；','普通UI自动模式已区分404/405/503；旧显式proxy:true兼容调用仍统一；');put('10_DEPLOYMENT_AND_ENV.md',text)
print('Current UI/reference/transport/privacy states refreshed; all 33 latest development hashes and four protected originals rechecked.')
