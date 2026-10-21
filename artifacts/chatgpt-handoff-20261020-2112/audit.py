from pathlib import Path
import json,re,zipfile,hashlib,datetime,shutil,html,collections
W=Path(__file__).resolve().parent;R=W.parents[1];S=W/'stage/WuwaEchoTool';H=S/'handoff'
def sha(b):return hashlib.sha256(b).hexdigest()
def put(p,t):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t,encoding='utf-8',newline='\n')
def data(p,x):put(p,json.dumps(x,ensure_ascii=False,indent=2)+'\n')
spec=[('unit.txt','npm test','tests 139'),('static.txt','npm run check:static','283 local entry dependencies and 131 script syntax'),('browser-convene.txt','node tests/convene-browser.cjs','PASS 6'),('browser-target.txt','node tests/convene-target-browser.cjs','PASS 6'),('browser-edge.txt','node tests/convene-edge-browser.cjs','PASS fault'),('browser-multi.txt','node tests/multi-config-browser.cjs','PASS 6'),('browser-config-ui.txt','node tests/multi-config-ui-browser.cjs','PASS 6'),('browser-inventory.txt','node tests/inventory-sharing-browser.cjs','PASS 6'),('browser-import.txt','node tests/register-import-browser.cjs','PASS: 40')]
scripts=[]
for n,cmd,marker in spec:
 t=(W/n).read_text('utf-8-sig');assert marker in t,(n,t[-400:]);shutil.copyfile(W/n,H/'evidence/tests'/n) if (H/'evidence/tests').exists() else None
 scripts.append({'command':cmd,'status':'passed','log':'handoff/evidence/tests/'+n,'completedAt':datetime.datetime.fromtimestamp((W/n).stat().st_mtime).astimezone().isoformat()})
(H/'evidence/tests').mkdir(parents=True,exist_ok=True)
for n,_,_ in spec:shutil.copyfile(W/n,H/'evidence/tests'/n)
assert 'fail 0' in (W/'unit.txt').read_text('utf-8') and 'skipped 0' in (W/'unit.txt').read_text('utf-8')
for src,dst in [('browser-target/results.json','target.json'),('browser-convene/results.json','convene.json'),('browser-convene/edge-results.json','convene-edge.json'),('browser-multi/results.json','multi.json'),('browser-config-ui/results.json','config-ui.json'),('browser-inventory/results.json','inventory.json'),('browser-import/official-import/browser-results.json','official-import.json')]:
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
 for locale in ['zh-CN','zh-TW','en']:copy_image('browser-convene',f'{width}-{locale}-overview.png')
 copy_image('browser-target',f'{width}-zh-CN-target-R6.png')
for suffix in ['rating-rules','achievement-atlas']:copy_image('browser-convene','1440-zh-CN-'+suffix+'.png')
for suffix in ['windows-methods','target-R0-compact','target-R3-compact','target-R6-compact','target-R6-detailed-excess']:copy_image('browser-target','1440-zh-CN-'+suffix+'.png')
copy_image('browser-target','two-badge-families-desktop.png')
copy_image('browser-target','390-en-character-atlas.png')
copy_image('browser-config-ui','1440-zh-CN-05-compare-different-cost-names-radar.png')
copy_image('browser-inventory','1440-zh-CN-06-A-B-same-X-reference-proof.png')
copy_image('browser-inventory','390-zh-CN-02-filters-expanded.png')
copy_image('browser-multi','1440-zh-CN-share-compact.png')
data(H/'evidence/screenshots/index.json',{'capturedDuringThisHandoff':True,'screenshots':screens,'note':'overview includes deliberate partial-import failure test; fixture error banner is expected, not a real upstream request failure. Full-page mobile screenshot shows fixed bottom nav at the initial viewport position.'})
figures=''.join('<figure><a href="'+html.escape(Path(x['file']).name)+'"><img loading="lazy" src="'+html.escape(Path(x['file']).name)+'"></a><figcaption>'+html.escape(Path(x['file']).name)+'</figcaption></figure>'for x in screens)
put(H/'evidence/screenshots/index.html','<!doctype html><meta charset="utf-8"><title>本次隔离测试截图</title><style>body{background:#102020;color:#def;font:16px sans-serif;margin:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}figure{margin:0}img{width:100%;max-height:600px;object-fit:contain}figcaption{overflow-wrap:anywhere}</style><h1>本次实跑截图与PNG样本</h1><p>全部合成数据。手机全页截图的固定导航出现在首屏位置；部分导入失败是测试注入。单击查看原图。</p><main>'+figures+'</main>')
summary={'formatVersion':1,'executedFrom':'independent packaging copy, never personal browser profile','environment':{'platform':'Windows','node':'24.13.0','npm':'11.6.2','playwright':'1.62.1','browser':'installed Microsoft Edge headless','viewports':[1440,390],'languages':['zh-CN','zh-TW','en']},'unit':{'passed':139,'failed':0,'skipped':0},'static':{'localDependencies':283,'scriptSyntaxChecks':131,'failed':0},'browser':{'convene':6,'multiConfig':6,'configUI':6,'inventory':6,'officialRoleImportMock':40,'totalFlows':70,'pageErrors':0,'inventoryGroupsPerFlow':17,'legacyEchoPNGs':12,'conveneMainAndContinuationPNGs':30,'tierPNGs':6,'canvasLayoutCases':51,'targetFlows':6,'targetDownloadPNGs':30,'characterTierPNGs':6,'faultInjection':['quota preservation','multi-account','masked share','Canvas failure','unavailable storage']},'scripts':scripts,'resources':{'localReferences':len(refs),'missing':missing},'screenshotsPackaged':len(screens),'notExecuted':[{'item':x,'reason':'No real authorization/device/production environment; no private credentials requested'}for x in ['real official Global/CN authorized POST','real player complete archive import','actual Windows game log extraction','physical Android/iOS URL extraction','Cloudflare production Pages/Worker','Discord actual client upload/compression']], 'realOfficialAPIValidated':False,'realMobileDeviceValidated':False,'productionValidated':False}
data(H/'test-results.json',summary)
commands='\n'.join('- `'+x['command']+'`：通过，结束 '+x['completedAt']+'；'+x['log'] for x in scripts)
put(H/'08_TEST_REPORT.md',f'''# 本次实际测试报告

检查始于 {json.loads((W/'snapshot.json').read_text('utf-8'))['startedAt']}，各命令结束时间如下。Windows、Node24.13.0/npm11.6.2、Playwright1.62.1/本机Edge无头，独立封装副本、全新浏览器上下文；未读取或清空用户浏览器数据。没有为了通过检查修改产品/测试原件。

## 执行命令与证据

{commands}

上述命令在副本根运行，输出变量设为独立目录：WUWA_TARGET_OUT、WUWA_CONVENE_OUT、WUWA_MULTI_OUT、WUWA_MULTI_UI_OUT、WUWA_INVENTORY_OUT、WUWA_QA_OUT。这些是本次所有浏览器脚本；没有声称其余全部历史browser脚本均重跑。旧脚本路径适配说明见10及run-browser.cjs。

## 数量与范围

- 单元：139通过、0失败、0跳过（Node测试runner实际数字）。包含评分、迁移/引用、日期、备份、唤取去重/连续区间/保底/星运/成就及代理模拟等。
- 静态：283本地入口依赖、131脚本语法检查通过；另审计{len(refs)}条根HTML/CSS本地引用，缺失0。后者并非所有任意JS动态字符串的数学完备证明。
- 普通浏览器：70流程，0失败、0页面错误；唤取6、角色目标6、多配置6、配置UI6、共享背包6（每流程17组验收）、官方角色导入mock40。桌面1440/手机390×简繁英为对应三语矩阵。
- 数据：真实IndexedDB读写、重复/增量、部分失败/取消、多账号、无效/未来备份拒绝、回滚与中断恢复；多配置迁移/默认/复制/删除，共享实体编辑和移除保留别角色引用；都用合成存档。
- 图片：旧养成12张；唤取24主版本+6续页、另6阶样本；新增角色目标30张下载PNG与6阶角色样本，合计唤取72张；51个三语Canvas文字边界案例通过，预览/下载字节一致。旧四类与新两类分享、详细续页实际生成。
- 故障脚本：配额不足保留数据、Canvas失败、存储不可用、遮蔽UID及多账号通过。此脚本不伪装成额外70流程或真实API。
- 本包保留{len(screens)}张本次代表截图/PNG及画廊，原始大量重复截图不重复封装。页面三语、dialog/筛选/图片有浏览器断言，代表图可在随包画廊检查。

## 服务端与真实验证边界

functions/api/convene.js在Node中以mock fetch和绑定测试输入/来源/字段、大小/限流/上游错误等；浏览器路由拦截/api/convene及社区角色API，以明确fixture响应进行真实页面操作。角色目标覆盖R0/R3/R6、超额8～12次、六阶独立角色徽章、双徽章图鉴、字型/图片降级、字母数字serverId与旧数字存档。角色窗口评分使用合成连续证据，真实活动投入仍未知。**没有连接真实授权官方POST**，不等于真实玩家完整历史已导入。真实设备、真实Windows游戏日志、Cloudflare生产绑定/部署、Discord上传压缩均未执行；这是缺少条件的验证范围，不是Node报告中的skipped测试数。

本次没有联网重做旧文档曾记的OPTIONS，无授权预检可达也不能证明授权POST。Chrome/Firefox/Safari及实体手机未测。实际测试结果JSON为test-results.json；ZIP自身CRC/SHA/路径/敏感信息和解压校验见11与交付旁的验证摘要。
''')
print(json.dumps({'unit':summary['unit'],'browserFlows':70,'staticReferences':len(refs),'packagedScreenshots':len(screens),'secrets':len(findings)},ensure_ascii=True))
