from pathlib import Path
import json,re,zipfile,hashlib,datetime,shutil,html,collections
W=Path(__file__).resolve().parent;R=W.parents[1];S=W/'stage/WuwaEchoTool';H=S/'handoff'
def sha(b):return hashlib.sha256(b).hexdigest()
def put(p,t):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t,encoding='utf-8',newline='\n')
def data(p,x):put(p,json.dumps(x,ensure_ascii=False,indent=2)+'\n')
spec=[('unit.txt','npm test','tests 145'),('static.txt','npm run check:static','283 local entry dependencies and 133 script syntax'),('browser-convene.txt','node tests/convene-browser.cjs','PASS 6'),('browser-reference.txt','node tests/convene-ui-reference-browser.cjs','PASS 6'),('browser-target.txt','node tests/convene-target-browser.cjs','PASS 6'),('browser-edge.txt','node tests/convene-edge-browser.cjs','PASS fault'),('browser-multi.txt','node tests/multi-config-browser.cjs','PASS 6'),('browser-config-ui.txt','node tests/multi-config-ui-browser.cjs','PASS 6'),('browser-inventory.txt','node tests/inventory-sharing-browser.cjs','PASS 6'),('browser-import.txt','node tests/register-import-browser.cjs','PASS: 40')]
scripts=[]
for n,cmd,marker in spec:
 t=(W/n).read_text('utf-8-sig');assert marker in t,(n,t[-400:]);shutil.copyfile(W/n,H/'evidence/tests'/n) if (H/'evidence/tests').exists() else None
 scripts.append({'command':cmd,'status':'passed','log':'handoff/evidence/tests/'+n,'completedAt':datetime.datetime.fromtimestamp((W/n).stat().st_mtime).astimezone().isoformat()})
(H/'evidence/tests').mkdir(parents=True,exist_ok=True)
for n,_,_ in spec:shutil.copyfile(W/n,H/'evidence/tests'/n)
assert 'fail 0' in (W/'unit.txt').read_text('utf-8') and 'skipped 0' in (W/'unit.txt').read_text('utf-8')
for src,dst in [('browser-reference/results.json','reference.json'),('browser-target/results.json','target.json'),('browser-convene/results.json','convene.json'),('browser-convene/edge-results.json','convene-edge.json'),('browser-multi/results.json','multi.json'),('browser-config-ui/results.json','config-ui.json'),('browser-inventory/results.json','inventory.json'),('browser-import/official-import/browser-results.json','official-import.json')]:
 obj=json.loads((W/src).read_text('utf-8'));assert not obj.get('pageErrors'),src;shutil.copyfile(W/src,H/'evidence/tests'/dst)
missing=[];refs=[];external=[]
for p in list(S.glob('*.html'))+list((S/'css').glob('*.css')):
 text=p.read_text('utf-8-sig')
 for value in re.findall(r'\b(?:src|href)=["\']([^"\']+)',text)+re.findall(r'url\(\s*["\']?([^\)"\']+)',text):
  if re.match(r'^(?:https?:)?//',value):external.append({'file':p.relative_to(S).as_posix(),'url':value});continue
  if not value or value.startswith(('#','data:','blob:','javascript:','mailto:')):continue
  value=value.split('#')[0].split('?')[0]
  if not value:continue
  target=S/value.lstrip('/') if value.startswith('/') else p.parent/value
  refs.append({'file':p.relative_to(S).as_posix(),'reference':value})
  if not target.exists():missing.append(refs[-1])
assert not missing,missing
data(H/'evidence/tests/resource-audit.json',{'scanned':'all root HTML and css/*.css static references; dynamic paths additionally exercised by browser tests','localReferenceCount':len(refs),'missing':missing,'externalDependencies':external,'notExhaustiveForArbitraryDynamicJS':True})
# Secret values are never printed. Synthetic test authorization is allowed.
jwt=re.compile(r'eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{20,}')
patterns=[re.compile(r'(?:record_id=|[\"\']recordId[\"\']\s*:\s*[\"\'])[a-fA-F0-9]{32}'),jwt,re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),re.compile(r'\b(?:ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|AKIA[A-Z0-9]{16}|sk-[A-Za-z0-9_-]{32,})\b')]
findings=[];authRisks=[];fixtureFiles=set()
for p in S.rglob('*'):
 if not p.is_file():continue
 rel=p.relative_to(S).as_posix();chunks=[]
 if p.suffix.lower() in {'.js','.cjs','.json','.html','.css','.md','.txt','.xml','.map','.yml','.yaml','.toml','.patch'}:chunks=[p.read_text('utf-8-sig',errors='replace')]
 elif p.suffix.lower() in {'.xlsx','.docx'}:
  with zipfile.ZipFile(p)as z:chunks=[z.read(n).decode('utf-8',errors='replace')for n in z.namelist()if n.endswith('.xml')]
 if any(pat.search(t)for pat in patterns for t in chunks):findings.append(rel)
 for t in chunks:
  for value in re.findall(r'record_id=([^&\s\x22\x27<>]+)',t):
   if re.match(r'^(?:fixture|test|fake|example|x{2,}|\$|\{|<|%|PLACEHOLDER|REDACTED)',value,re.I):fixtureFiles.add(rel)
   elif rel.startswith(('tests/','artifacts/')):fixtureFiles.add(rel)
   else:authRisks.append({'file':rel,'category':'literal record_id value requires review; value suppressed'})
assert not findings,findings
assert not authRisks,authRisks
data(H/'evidence/tests/security-audit.json',{'highConfidenceSecrets':findings,'unreviewedAuthorizationLiteralRisks':authRisks,'syntheticAuthorizationFiles':sorted(fixtureFiles),'archiveOnlySanitization':json.loads((H/'sanitization.json').read_text('utf-8')),'personalStorageCopied':False,'realCredentialsRequested':False,'limitations':'Pattern scan is not mathematical proof of all possible secrets; selected data and literal auth test contexts reviewed. No actual browser profile or private database included.'})
screens=[]
def copy_image(group,name):
 p=W/group/name;assert p.exists(),p;dest=H/'evidence/screenshots'/(group+'--'+name);dest.parent.mkdir(exist_ok=True);shutil.copyfile(p,dest);screens.append({'file':dest.relative_to(S).as_posix(),'sourceTest':group,'syntheticFixture':True})
for width in [1440,390]:
 for suffix in ['overview','character-analysis']:copy_image('browser-reference',f'{width}-zh-CN-{suffix}.png')
for name in ['1440-zh-CN-import','1440-zh-CN-windows-guide','1440-zh-CN-overall-six-tiers','1440-zh-CN-character-six-tiers','390-zh-CN-history-filters']:copy_image('browser-reference',name+'.png')
copy_image('browser-target','1440-zh-CN-target-R6-detailed-excess.png')
copy_image('browser-config-ui','1440-zh-CN-05-compare-different-cost-names-radar.png')
copy_image('browser-inventory','1440-zh-CN-06-A-B-same-X-reference-proof.png')
copy_image('browser-inventory','390-zh-CN-02-filters-expanded.png')
copy_image('browser-multi','1440-zh-CN-share-compact.png')
data(H/'evidence/screenshots/index.json',{'capturedDuringThisHandoff':True,'screenshots':screens,'note':'overview includes deliberate partial-import failure test; fixture error banner is expected, not a real upstream request failure. Full-page mobile screenshot shows fixed bottom nav at the initial viewport position.'})
figures=''.join('<figure><a href="'+html.escape(Path(x['file']).name)+'"><img loading="lazy" src="'+html.escape(Path(x['file']).name)+'"></a><figcaption>'+html.escape(Path(x['file']).name)+'</figcaption></figure>'for x in screens)
put(H/'evidence/screenshots/index.html','<!doctype html><meta charset="utf-8"><title>本次隔离测试截图</title><style>body{background:#102020;color:#def;font:16px sans-serif;margin:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}figure{margin:0}img{width:100%;max-height:600px;object-fit:contain}figcaption{overflow-wrap:anywhere}</style><h1>本次实跑截图与PNG样本</h1><p>全部合成数据。手机全页截图的固定导航出现在首屏位置；部分导入失败是测试注入。单击查看原图。</p><main>'+figures+'</main>')
extraPNGs=len([p for p in (W/'browser-reference').glob('*.png') if re.match(r'^(1440|390)-(zh-CN|zh-TW|en)-(?:overall|character)-(?:compact|detailed|full-uid)\.png$',p.name) or re.match(r'^(1440|390)-(zh-CN|zh-TW|en)-target-R[0-6]\.png$',p.name)])
assert extraPNGs==58,extraPNGs
summary={'formatVersion':1,'executedFrom':'independent packaging copy, never personal browser profile','environment':{'platform':'Windows','node':'24.13.0','npm':'11.6.2','playwright':'1.62.1','browser':'installed Microsoft Edge headless','viewports':[1440,390],'languages':['zh-CN','zh-TW','en']},'unit':{'passed':145,'failed':0,'skipped':0},'static':{'localDependencies':283,'scriptSyntaxChecks':133,'failed':0},'browser':{'convene':6,'multiConfig':6,'configUI':6,'inventory':6,'officialRoleImportMock':40,'totalFlows':76,'pageErrors':0,'inventoryGroupsPerFlow':17,'legacyEchoPNGs':12,'conveneMainAndContinuationPNGs':30,'tierPNGs':6,'canvasLayoutCases':51,'referenceFlows':6,'referenceExtraDownloadedPNGs':extraPNGs,'targetFlows':6,'targetDownloadPNGs':30,'characterTierPNGs':6,'faultInjection':['quota preservation','multi-account','full/hidden UID','Canvas failure','unavailable storage']},'scripts':scripts,'resources':{'localReferences':len(refs),'missing':missing},'screenshotsPackaged':len(screens),'notExecuted':[{'item':x,'reason':'No real authorization/device/production environment; no private credentials requested'}for x in ['real official Global/CN authorized POST','real player complete archive import','actual Windows game log extraction','physical Android/iOS URL extraction','Cloudflare production Pages/Worker','Discord actual client upload/compression']], 'realOfficialAPIValidated':False,'realMobileDeviceValidated':False,'productionValidated':False}
data(H/'test-results.json',summary)
commands='\n'.join('- `'+x['command']+'`：通过，结束 '+x['completedAt']+'；'+x['log'] for x in scripts)
put(H/'08_TEST_REPORT.md',f'''# 本次实际测试报告

独立快照检查开始：{json.loads((W/'snapshot.json').read_text('utf-8'))['startedAt']}。Windows、Node24.13.0/npm11.6.2、Playwright1.62.1/本机Edge。每次全新上下文/合成数据，不打开个人浏览器配置、不清除用户数据；产品和测试原件没有为了通过检查被修改。

## 命令、完成时间与日志

{commands}

命令在独立副本运行。浏览器由handoff/run-browser.cjs适配旧测试依赖路径，可设WUWA_BROWSER_CHANNEL=msedge；输出变量WUWA_REFERENCE_OUT、WUWA_TARGET_OUT、WUWA_CONVENE_OUT、WUWA_MULTI_OUT、WUWA_MULTI_UI_OUT、WUWA_INVENTORY_OUT、WUWA_QA_OUT均指独立产物目录。并非其余全部历史browser脚本均重跑。

## 实际结果

- 单元145通过，0失败，0跳过；评分模型/链数/模态、迁移共享、日期/去重/保底/星运/代理与自动通道、备份、徽章复杂度等现有套件。
- 静态283本地入口依赖、133脚本语法通过；另审计{len(refs)}根HTML/CSS本地引用，缺失0；动态JS不是静态穷举证明，主要路径由浏览器覆盖。
- 普通浏览器76流程通过，0页面错误：原唤取6、角色目标6、参考视觉6、多配置6、配置UI6、共享背包6（每流程17组）、官方角色导入mock40。1440/390视口×简中/繁中/英文；实体手机/其他浏览器未测。
- 页面真实操作：限定双主卡排序/其他折叠、角色图解码/缺图占位、手机顺序与时间轴满宽、历史组合筛选/重置、取消/全败保留原数据、文件夹本地解析只填URL、无手动连接/额外池、教学视频预留、双徽章图鉴、全部R0～R6示例、完整/隐藏UID（旧masked参数不输出UID）。
- IndexedDB/存档：逐池增量/重复/部分失败/取消、多账号、损坏/未来备份拒绝、跨库回滚/启动恢复；多配置迁移/默认/复制/删除、共享实体编辑/移除不抢占另一角色均验证。
- 图片：养成12PNG；原唤取30+6总体阶、目标30+6角色阶=72PNG；参考脚本额外下载{extraPNGs}PNG（四模式/完整UID/全部R示例），合计唤取{72+extraPNGs}。51组三语Canvas文字边界通过；预览/下载字节一致、字体/图片/Canvas故障覆盖。
- 另故障脚本覆盖配额失败保留、多账号、完整UID、Canvas失败/存储不可用；不将其计成额外76流程。包内精选{len(screens)}张本次代表图/PNG及画廊，不重复塞全部截图。

## 真实接口与环境边界

代理在Node内mock上游和绑定。浏览器拦截固定官方/社区接口，以明确fixture执行真实页面交互；自动通道针对CORS/HTTP/取消还另有单元断言。真实官方授权POST、真实玩家完整历史、真实Windows游戏日志、Android/iOS取链接、Cloudflare生产与Discord上传压缩均未执行；缺少真实条件，不请求用户秘密。不把这些写成通过或Node报告里的skipped。

当前计算与存储核心原件SHA核对，最近UI任务没有改总体公式或schema。本次也没有产品修改。ZIP的CRC/SHA、解压和复测结果见11及ZIP旁verification.json。''')
print(json.dumps({'unit':summary['unit'],'browserFlows':76,'staticReferences':len(refs),'packagedScreenshots':len(screens),'secrets':len(findings)},ensure_ascii=True))
