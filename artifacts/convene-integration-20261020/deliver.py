from pathlib import Path
import json,hashlib,shutil,re,datetime,html,subprocess
R=Path.cwd();W=R/'artifacts/convene-integration-20261020';D=W/'delivery-final';assert not D.exists();D.mkdir()
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def put(p,s):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s,encoding='utf-8',newline='\n')
def data(p,x):put(p,json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def cp(a,b):b.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(a,b)
baseline=json.loads((W/'baseline.json').read_text('utf-8'));before={x['path']:x['sha256']for x in baseline['files']}
scan=[p for d in ['js','css','tests','functions','convene-worker','docs']for p in(R/d).rglob('*')if p.is_file()]+list(R.glob('*.html'))+[R/'package.json',R/'wrangler.toml']+list((R/'image/convene/badges').glob('*.svg'))
changes=[]
for p in scan:
 rel=p.relative_to(R).as_posix();digest=sha(p)
 if rel not in before or digest!=before[rel]:changes.append({'path':rel,'status':'modified'if rel in before else'added','beforeSha256':before.get(rel),'afterSha256':digest})
protected=['js/base.js','js/multi-config.js','js/multi-config-browser.js','js/character-core.js','js/register-workspace.js','js/register-share.js','js/register-backup.js','js/convene-store.js','convene-worker/index.js','convene-worker/wrangler.toml','js/import-service.js','js/role-view-model.js','package.json']
for p in protected:assert sha(R/p)==before[p],p
spec=[('unit-final.txt','tests 139'),('static-final.txt','283 local entry dependencies and 131 script syntax'),('target-final.txt','PASS 6'),('legacy-final.txt','PASS 6'),('edge-final.txt','PASS fault'),('multi-final.txt','PASS 6'),('config-final.txt','PASS 6'),('inventory-final.txt','PASS 6'),('protected-check.txt','PASS original')]
for n,marker in spec:assert marker in(W/n).read_text('utf-8'),n;cp(W/n,D/'TEST'/n)
assert 'fail 0'in(W/'unit-final.txt').read_text('utf-8')
for source,name in [('target-final/results.json','target.json'),('legacy-final/results.json','convene.json'),('legacy-final/edge-results.json','edge.json'),('multi-final/results.json','multi.json'),('config-final/results.json','config-ui.json'),('inventory-final/results.json','inventory.json')]:
 x=json.loads((W/source).read_text('utf-8'));assert not x.get('pageErrors');cp(W/source,D/'TEST'/name)
for p in(W/'target-final').glob('*.png'):
 assert p.name!='failure.png'
 share=p.name.startswith('character-tier-')or re.search(r'target-R\d-(?:compact|detailed-excess|private-no-badge)\.png$',p.name)
 cp(p,D/('share-samples'if share else'screenshots')/p.name)
for p in(W/'legacy-final').glob('*.png'):
 if re.search(r'-(?:overall|character)-(?:compact|detailed)(?:-page-\d+)?\.png$',p.name)or p.name.startswith('tier-'):cp(p,D/'share-samples'/p.name)
 elif re.search(r'-(?:overview|history-filter|pools)\.png$',p.name):cp(p,D/'screenshots'/('convene-'+p.name))
for width in [1440,390]:
 for name in ['04-manager-desktop-mobile','05-compare-different-cost-names-radar']:
  cp(W/'config-final'/f'{width}-zh-CN-{name}.png',D/'screenshots'/f'workspace-{width}-{name}.png')
 cp(W/'inventory-final'/f'{width}-zh-CN-06-A-B-same-X-reference-proof.png',D/'screenshots'/f'inventory-{width}-shared-reference-proof.png')
for p in(R/'image/convene/badges').glob('*.svg'):cp(p,D/'badges'/p.name)
cp(R/'docs/convene-integration.md',D/'DEVELOPMENT.md');data(D/'CHANGES.json',{'baselineAt':baseline['at'],'changes':changes,'protectedFilesUnchanged':protected,'archiveVersion':1,'overallRulesAndStatistics':'unchanged exact function text and fixed-result regression'})
put(D/'CHANGE_FILES.txt','\n'.join(('M'if x['status']=='modified'else'A')+' '+x['path']for x in sorted(changes,key=lambda x:x['path']))+'\n')
screens=list((D/'screenshots').glob('*.png'));samples=list((D/'share-samples').glob('*.png'))
summary={'completedAt':datetime.datetime.now().astimezone().isoformat(),'environment':{'node':'24.13.0','npm':'11.6.2','playwright':'1.62.1','browser':'Microsoft Edge headless','widths':[1440,390],'languages':['zh-CN','zh-TW','en']},'unit':{'passed':139,'failed':0,'skipped':0,'originalTestsPreserved':124},'static':{'dependencies':283,'scripts':131,'failed':0},'browser':{'target':6,'convene':6,'multiConfig':6,'configUI':6,'sharedInventory':6,'totalFlows':30,'pageErrors':0,'canvasLayoutCases':51,'convenePNGs':72,'legacyEchoPNGsGenerated':12,'inventoryGroupsPerFlow':17,'faultInjection':'quota, multi-account, unavailable storage, Canvas, font/image fallback'},'screenshotsDelivered':len(screens),'pngSamplesDelivered':len(samples),'svgAssets':14,'changedFiles':len(changes),'modifiedExisting':sum(x['status']=='modified'for x in changes),'newFiles':sum(x['status']=='added'for x in changes),'realOfficialAPI':False,'realDevice':False,'cloudflareProduction':False,'actualBannerInvestmentKnown':False,'characterRating':'explicit opt-in verified recorded-window efficiency; actual banner investment remains unknown/observing','sourceSchemaChanged':False,'protectedFilesUnchanged':protected}
data(D/'TEST/SUMMARY.json',summary)
put(D/'REPORT.md',f'''# 唤取导入、双星运与目标分享开发报告

完成：{summary['completedAt']}。当前工作目录直接修改；没有自动commit、push、reset、clean、切换分支或清除用户数据。实际改动相对本任务开始快照 {baseline['at']}，不是只看Git HEAD。{summary['modifiedExisting']}个既有文件、{summary['newFiles']}个新增文件，见CHANGE_FILES.txt/CHANGES.json；13个保护文件哈希不变。

## 完成内容

1. 修复svr_id/serverId纯数字限制，Core/Parser/代理一致允许合法英数字母标识；数字账号、备份、真实IndexedDB和切换保持兼容。支持fragment/query、合法编码、换行、参数顺序、语言别名和额外gacha元数据。错误区分格式/缺参/参数、授权拒绝、结构、代理配置、超时、上游服务与存储；重复导入明确无新增。
2. Windows提供本站日志解析与第三方PowerShell源码审阅两条路径，标来源/固定版/GPL与权限/配置分支，不自动执行远程代码；Android/iOS独立，均说明设备验证限制。
3. 原整体星运公式/门槛保留；升级六阶总体徽章，新增不同外框/中心构图的六阶角色徽章，另有中性状态；14个透明原创SVG与Canvas共用图元。统一图鉴分整体/角色/成就，未授予称号不标解锁。
4. 新增独立角色模块、R0～R6选择、12次取得/超额5次完整保留、目标PNG简略/详细、UID遮蔽/超额/徽章开关。紧凑1200×880，详细1200×1600最多12条/页。预览与下载同一PNG，跟页面相同快照和计算。
5. 桌面评价信息并列，手机目标和口径单栏、主分享全宽、证据折叠；简繁英完成。

## 最重要的数据边界

现有字段不能可靠证明活动目标或实际投入。默认“活动实际投入”始终未知并待观测，**没有实现虚假的实际活动总投入评级**。用户可主动选择“连续记录区间效率”：从存档限定池首个已知五星之后，逐条数到目标第K次取得；包含其他五星，要求同池连续span及可靠起点，不是把目标五星间隔相加。该窗口可能含其他活动，不能解释为“为了此角色实际投入”。

角色窗口模型：P=窗口抽数，K=R目标+1，score=clamp(100×(1−(P−K)/(160K−K)),0,100)。160是本站比较基准，非该角色官方保底/期望/排名。六阶95/85/70/40/20分界对应天命之约、星辰眷恋、共鸣相契、命运同行、逆风寻星、漫长守候；不套整体300抽门槛。缺口、无起点、跨池、次数不足或规则异常均不评分。R标签只指本存档次数，不证明真实链数，超额不加分、不推算消费/珊瑚。完整推导、边界与来源见DEVELOPMENT.md。

## 实际测试

|类别|本次结果|
|---|---|
|单元|139通过、0失败、0跳过；保留原124，新增15|
|静态|283入口依赖、131脚本语法通过|
|目标流程|1440/390×简繁英6组，通过英数字母导入/重复/失败保留、R0/R3/R6、图鉴、UID/徽章/超额和下载字节一致|
|原唤取|6组通过，Global/CN mock、增量/去重/取消、真实IndexedDB、备份回滚/中断恢复、四分享及续页|
|声骸回归|多配置6、配置UI6、共享背包6（每组17项）通过；原养成12PNG生成|
|PNG/故障|新角色30下载+6计算阶级，原唤取30+6整体阶级；51组三语布局边界；Canvas、缺字体/图片、配额与存储异常通过|
|保护检查|总体规则/统计/去重/validate函数原文不变（仅身份校验扩展）；存储/备份/评分/Classic关联核心13文件哈希不变|

普通浏览器共30流程，另有故障/Canvas检查。所有请求为明确Mock/Fixture，浏览器是实际Edge隔离渲染；不加载个人浏览器、不使用真实授权。手机指390px视口，非实体设备。测试日志/JSON在TEST/。未执行真实官方授权POST、真实完整玩家导入、真实Windows日志与Android/iOS取链、Cloudflare生产、Discord客户端上传压缩或大存档压力。

## 截图、PNG与资源

INDEX.html浏览{len(screens)}张本次截图、{len(samples)}张PNG样本；screenshots含桌面手机目标/教学/图鉴/共享回归，share-samples含R0/R3/R6、12取得/超额5、遮蔽UID、关闭徽章和两套六阶计算样本。所有数值为明确合成资料，不是真实玩家。overview中的失败横幅来自有意故障注入；手机全页截图的固定底栏出现在首屏位置。badges含14个透明SVG；页面与PNG均使用同一图元。

## 风险与下一步

- 真实活动投入需要可靠活动目标/起点证据，目前没有；本次窗口模型不能当作该功能已解决。
- 当期新增池规则与官方字段/CORS需维护者在授权条件下私下验证；本次无真实API/Cloudflare生产验证。
- 既有跨localStorage/IndexedDB恢复与多标签竞争边界保留；大型历史性能和真实设备/Discord预览未测。
- 原ConveneCore.character兼容统计保留，新增页面独立规则不要再从旧luck字段取角色评级。

建议SourceTree说明：修复唤取服务器标识导入，新增独立区间角色星运、双徽章图鉴与R目标战绩分享。仅建议，没有执行提交。
''')
cards=[]
for group in ['screenshots','share-samples','badges']:
 for p in sorted((D/group).iterdir()):
  rel=p.relative_to(D).as_posix();cards.append('<figure data-group="'+group+'"><a href="'+html.escape(rel)+'"><img loading="lazy" src="'+html.escape(rel)+'"></a><figcaption>'+html.escape(p.name)+'</figcaption></figure>')
put(D/'INDEX.html','<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>唤取整合交付图集</title><style>body{background:#102222;color:#e3eddf;font:16px system-ui;margin:24px}a{color:#b5e7cd}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}figure{margin:0;border:1px solid #436054;padding:16px;border-radius:12px}img{display:block;width:100%;height:340px;object-fit:contain}figcaption{overflow-wrap:anywhere;font-size:12px}button{padding:12px;background:#204237;color:inherit;border:1px solid #7cae98;border-radius:8px;margin:5px}</style><h1>唤取导入、双星运与目标战绩</h1><p>全部截图来自实际隔离浏览器，全部数值为合成fixture。<a href="REPORT.md">开发报告</a> · <a href="CHANGE_FILES.txt">修改文件</a></p><p>活动实际投入仍未知；有分数的角色样本采用主动选择的连续记录区间效率。</p><div><button onclick="filter(\'\')">全部</button><button onclick="filter(\'screenshots\')">页面截图</button><button onclick="filter(\'share-samples\')">分享PNG</button><button onclick="filter(\'badges\')">透明SVG</button></div><main>'+''.join(cards)+'</main><script>function filter(group){document.querySelectorAll("figure").forEach(e=>e.hidden=!!group&&e.dataset.group!==group)}</script></html>')
# All local gallery links must exist. Do not duplicate secrets or historical source backups.
for rel in re.findall(r'(?:href|src)="([^"]+)"',(D/'INDEX.html').read_text('utf-8')):assert(D/rel).is_file(),rel
secrets=re.compile(rb'eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{30,}')
for p in D.rglob('*'):
 if p.is_file()and p.suffix in {'.md','.json','.txt','.html','.svg'}:assert not secrets.search(p.read_bytes()),p.name
files=sorted(p for p in D.rglob('*')if p.is_file());data(D/'MANIFEST.json',{'files':[{'path':p.relative_to(D).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p)}for p in files]});put(D/'SHA256SUMS.txt',''.join(sha(p)+'  '+p.relative_to(D).as_posix()+'\n'for p in sorted(files+[D/'MANIFEST.json'])))
summary['deliveryFiles']=len(files)+2;data(W/'DELIVERY.json',summary);print(json.dumps(summary,ensure_ascii=True))
