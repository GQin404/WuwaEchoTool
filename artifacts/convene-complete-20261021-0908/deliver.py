from pathlib import Path
import json,hashlib,shutil,datetime,html,re
R=Path.cwd();W=R/'artifacts/convene-complete-20261021-0908';OUT=W/'delivery';OUT.mkdir(exist_ok=True)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def put(n,t):p=OUT/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t.strip()+'\n',encoding='utf-8',newline='\n')
def data(n,x):put(n,json.dumps(x,ensure_ascii=False,indent=2))
baseline=json.loads((W/'baseline.json').read_text('utf-8'));expected={'convene.html','_headers','css/convene.css','js/convene-assets.js','js/convene-ui.js','js/convene-i18n.js','js/convene-service.js','js/convene-visuals.js','js/weapon-catalog.js','scripts/check-convene-art.cjs','tests/convene-artwork.test.cjs','tests/convene-optimization-browser.cjs','tests/convene-target-browser.cjs','functions/api/convene.js'}
modified=[p for p,h in baseline['hashes'].items()if sha(R/p)!=h]
assert set(modified)<=expected,set(modified)-expected
protected={p:sha(R/p)==baseline['hashes'][p]for p in ['js/base.js','js/convene-core.js','js/convene-store.js','js/convene-character-rating.js','js/convene-share.js','js/character-portraits.js','js/multi-config.js','js/character-core.js','js/role-view-model.js']}
assert all(protected.values())
images=[p for p in baseline['hashes']if p.startswith('image/characters/')];assert all(sha(R/p)==baseline['hashes'][p]for p in images)
paths=set(modified)|{'js/character-catalog.js','js/convene-covers.js','js/convene-windows.js','tests/convene-resource-registry.test.cjs','tests/convene-windows-reader.test.cjs','tests/convene-complete-browser.cjs','tests/convene-guide-browser.cjs','docs/convene-resource-audit.json','docs/convene-resource-management.md','docs/weapon-artwork.md','docs/weapon-missing-assets.json','docs/convene-optimization.md','image/convene-current/README.md','image/convene-current/featured-character.webp','image/convene-current/featured-weapon.webp'}
paths|={p.relative_to(R).as_posix()for p in (R/'image/convene/badges').glob('*.svg')}
paths|={'image/weapons/'+str(i)+'star/README.md'for i in [3,4,5]}
records=[]
for rel in sorted(paths):
 p=R/rel;assert p.is_file(),p;dest=OUT/'changed-source'/rel;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,dest)
 records.append({'path':rel,'beforeSHA256':baseline['hashes'].get(rel),'afterSHA256':sha(p),'baseline': 'task-start source hash'if rel in baseline['hashes']else'new or regenerated/documented task resource; prior hash not captured'})
data('changes.json',records)
data('source-guard.json',{'protectedSourceMatches':protected,'allOriginalCharacterFilesUnchanged':len(images),'otherBaselineSourcesUnchanged':sum(p not in modified for p in baseline['hashes']),'changedBaselineFiles':modified,'originalImagesRemoved':0,'gitMutationsPerformed':False,'personalStorageUsed':False})
logs=[('unit.txt','npm test','pass 164'),('static.txt','npm run check:static','289 local entry dependencies and 146 script syntax'),('art.txt','node scripts/check-convene-art.cjs','PASS 64 existing character images'),('browser.txt','node tests/convene-complete-browser.cjs','PASS 12'),('guide-browser.txt','node tests/convene-guide-browser.cjs','PASS 12'),('fallback-browser.txt','node tests/convene-optimization-browser.cjs','PASS 12'),('convene-browser.txt','node tests/convene-browser.cjs','PASS 6'),('target-browser.txt','node tests/convene-target-browser.cjs','PASS 6'),('edge-browser.txt','node tests/convene-edge-browser.cjs','PASS fault')]
script_results=[]
for name,cmd,marker in logs:
 p=W/name;t=p.read_text('utf-8-sig');assert marker in t,(name,t[-400:]);dest=OUT/'evidence'/name;dest.parent.mkdir(exist_ok=True);shutil.copy2(p,dest)
 script_results.append({'command':cmd,'result':'passed','completedAt':datetime.datetime.fromtimestamp(p.stat().st_mtime,datetime.timezone(datetime.timedelta(hours=8))).isoformat(),'log':dest.relative_to(OUT).as_posix()})
assert 'fail 0' in (W/'unit.txt').read_text('utf-8') and 'skipped 0'in (W/'unit.txt').read_text('utf-8')
assert all(not line.strip()or line.startswith('warning:')for line in (W/'diff-check.txt').read_text('utf-8').splitlines())
shutil.copy2(W/'diff-check.txt',OUT/'evidence/diff-check.txt')
for folder,name in [('browser','results.json'),('browser','guide-results.json'),('fallback-regression','results.json'),('convene-regression','results.json'),('convene-regression','edge-results.json'),('target-regression','results.json')]:
 p=W/folder/name;obj=json.loads(p.read_text('utf-8'));assert not obj.get('pageErrors'),p;shutil.copy2(p,OUT/'evidence'/(folder+'--'+name))
shots=[]
for p in sorted((W/'browser').glob('*.png')):
 if p.name=='failure.png':continue
 dest=OUT/'screenshots'/p.name;dest.parent.mkdir(exist_ok=True);shutil.copy2(p,dest);shots.append(dest.relative_to(OUT).as_posix())
assert (OUT/'screenshots/both-six-tier-families.png').is_file()
(OUT/'preview').mkdir(exist_ok=True);shutil.copy2(W/'browser/badge-preview.html',OUT/'preview/badge-preview.html')
shutil.copy2(W/'browser/1440-zh-CN-local-reader.ps1',OUT/'preview/WuwaEchoTool-read-history.ps1')
audit=json.loads((R/'docs/convene-resource-audit.json').read_text('utf-8'))
data('resource-status.json',audit)
summary={'createdAt':datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=8))).isoformat(),'unit':{'pass':164,'fail':0,'skip':0},'static':{'localDependencies':289,'scriptSyntaxChecks':146,'pass':True},'browser':{'totalFlows':48,'completeFourWidthThreeLanguage':12,'guideFinalPosition':12,'fallbackAndImportUpdate':12,'originalImportAndShare':6,'targetAndExcess':6,'faultInjectionSeparate':True,'pageErrors':[],'widths':[1440,768,390,360],'languages':['zh-CN','zh-TW','en'],'realOfficialAuthenticatedAPI':False,'CloudflareProduction':False,'physicalMobile':False,'realGameLogs':False,'syntheticOnly':True,'pngPreviewDownloadByteParity':True,'oldCanvasLayoutCases':51},'resources':{'registeredLocalCharacters':64,'reliableResourceIDs':62,'newResourceIDsBeyondExistingGids':14,'existingImagesMatched':64,'pendingGenderMappings':2,'weapons':114,'weaponsByRarity':{'5':50,'4':43,'3':21},'realWeaponArt':0,'newEditorialCovers':2},'protected':protected,'originalCharacterFilesUnchanged':len(images),'scripts':script_results,'sourceFilesInDelivery':len(records),'screenshots':len(shots)}
data('test-results.json',summary)
rows='\n'.join('| `'+x['path']+'` | '+('与任务开始SHA对比'if x['beforeSHA256']else'新增/再生资源或维护文件')+' |'for x in records)
put('CHANGED_FILES.md','# 本次文件清单\n\n本次直接变更与新增/再生文件共'+str(len(records))+'项，目录中的changed-source为这些文件的副本，不是独立可运行的完整项目。完整最新项目仍在C:/Users/user/Downloads/WuwaEchoTool。Git HEAD差异包含此前任务，不能全部归于本轮。机器哈希见changes.json。\n\n| 路径 | 基准 |\n|---|---|\n'+rows)
report='''# 唤取记录完整修正、图片资源管理与视觉优化

基于本轮开始的最新工作区完成；本次未执行Git commit/push/reset/clean或创建/切换分支。没有删除或重命名原角色图片，没有修改声骸评分、唤取统计/角色窗口公式、存档schema或个人资料。changed-source是本次文件副本，完整项目在C:/Users/user/Downloads/WuwaEchoTool。

## 功能与完成状态

| 项目 | 实际结果 |
|---|---|
| 统一角色注册 | 64个本地角色/形态全部登记；62个可靠资源ID，包含14个此前gid未登记项；64张现用图匹配；2个导电主角性别对应待核实，不猜ID顺序 |
| 历史角色/三语 | 补齐64项简/繁/英显示与安全别名。旧字典原本多数历史角色缺名称键；新注册表集中补齐并复用原图片。凌阳/雪豹、桃祈/旧名及丽贝卡旧别名明确处理，主角元素/性别不合并 |
| 武器识别 | 114件：五星50、四星43、三星21；ID、三语、类型、稀有度和建议文件名集中管理。识别与图片分开，正式武器图0张；没有下载网络图片或把角色图当武器 |
| 固定总览封面 | 两个指定WebP已建立，优先于玩家最近取得图；切账号不换手动封面，数据仍更新；正常刷新同文件内容替换已用浏览器验证 |
| 缺图/未知ID | 手动封面→最新可靠物品图→类别占位的有界回退；历史与分析仍显示真实身份图，未知ID不偷配相似名称 |
| 双六阶徽章 | 两族保持不同识别；同一家族共用基本骨架，等级逐步追加图元，路径5/7/10/13/16/20；渐层/星轨/契约/翼片/冠饰层次递进，非只换色 |
| R0～R6/超额 | 已有功能完整保留；R为可见次数，默认真实活动投入待观测；窗口包含锚点至目标间全部抽取，明确不是为目标角色的实际花费，不混口径比较 |
| Windows教程 | 首屏可复制本地PowerShell命令，可查看/下载；只读日志、可选自动查运行游戏路径、无网络/提权/改配置；本地日志为备用，保留影片静态预留 |
| 导入 | Fragment/query、空白/换行、单一Markdown/尖括号、HTML/转义分隔符清理；合法gacha值不改变池请求；自动直连/条件代理保留；明确空结果与授权/网络/代理/上游错误 |
| 安全过期原因 | 上游明确包含过期提示时给LINK_EXPIRED；代理只转安全枚举，不回传原错误或授权文本；未知业务错误不猜数字码映射。真实接口尚未验证 |
| 四分享 | 整体/角色各简略/详细与目标图保留；立绘与新徽章同源，默认无UID，仅完整/隐藏，分页与PNG下载一致性通过 |

## 注册表及图片维护

- js/character-catalog.js：内部角色ID与资源ID显式关联、三语、稀有度、安全别名。create读取现有roleList与CharacterPortraits/CSS取得图片，不建第二套角色库。
- js/weapon-catalog.js：114件静态识别及fileName，image当前null。WeaponPortraits负责本地路径白名单、唯一精确别名与类别回退。
- js/convene-assets.js：所有唤取展示统一从注册表取名/图；名称不拼图片路径，未知ID不按名字冒用。
- 新角色继续放image/characters并沿用现有文件名/CSS定义；注册元数据集中在character-catalog，不改每个页面。旧内部ID不改，不能假设等于游戏ID。
- 新武器图按fileName放image/weapons/3star、4star、5star；同条catalog设置image本地路径即可。须为实际WebP/支持格式、有使用权、保留透明背景/比例；新增武器先核验真实ID，不用WIKI页面ID或类型编号替代。
- 检查：node scripts/check-convene-art.cjs，再检查三语同图、历史/分析与失败回退。详细操作见changed-source/docs/weapon-artwork.md和convene-resource-management.md。

## 当期封面替换

只替换这两个同名文件，无需改HTML/CSS/JS：

```
image/convene-current/featured-character.webp
image/convene-current/featured-weapon.webp
```

当前角色封面取现有今汐作为维护示例，武器是原创中性结晶，**均不宣称当前游戏UP**。主卡有“手动维护封面”标记，个人最近五星仍单独显示姓名/日期/间隔。固定封面是编辑选图用途，不是又一套角色注册图片库。

_headers对本目录先! Cache-Control移除宽泛图片7日规则，再no-cache,must-revalidate。Cloudflare Pages匹配规则会合并同名头，所以专门处理；本地服务no-store。浏览器以同一路径换响应内容并正常刷新，图像像素摘要确实变化。Cloudflare生产额外Cache Rules未验证；不要清除玩家数据来刷新封面。

## 资源待补清单

角色图片缺失0；导电女/男两项图片都在，但1309/1310的性别对应未独立核实，所以resourceId保持null。完整记录在resource-status.json的characterMappingsPending。

正式武器图缺114张，逐项真实ID/三语名称/星级/类型/建议文件路径见changed-source/docs/weapon-missing-assets.json及resource-status.json。注册表源有124条，排除了不属于现唤取品质范围的1/2星训练武器10条；不谎称覆盖所有未来物品。未知未来ID仍安全占位。需人工补合法正式武器图及当期真实编辑封面。

来源为本次实际请求的Encore三语公开目录快照（无Beta参数），URL与内容SHA保留在审计JSON；历史ID旁证公开wuwa-ids，官方WIKI核对中文事实。只取名称/ID/类型/品质等事实，不绑定或下载来源Icon。公开目录请求成功不代表真实官方唤取授权API成功。

## 视觉对照与实现

docs/ui-reference三张PNG已实际打开查看；以信息层级/人物主视觉/手机顺序为参考，未把框图复制为界面。按本次10.1的最新优先级，限定双卡置顶、核心统计后才整体星运，保留次要池/趋势/成就/图鉴。桌面数据与图片分区，手机图片在前、数据完整宽度；人物/武器contain等比，未裁掉原图内容，也无法恢复原图本来没有的部分。

两组六阶并排、32/64/160px在screenshots/both-six-tier-families.png与preview/badge-preview.html；同家族前阶图元完整保留到后阶，最高级增加冠饰/外围结构而非夸张发光。14个正式静态SVG与实时SVG/Canvas同步，中心宝石也一致。评分边界不变，规则补充“按未舍入分数判称号，显示数字可能四舍五入”，避免边界误读。

截图从真实Edge页面或页面Canvas导出。桌面、手机、平板/窄屏、三语、手动封面/同名替换/缺图、角色/武器卡池分析、历史筛选、教程、两套徽章、四分享和全部R0～R6均有实际文件。GALLERY.html可按文件名浏览原图。已人工抽查桌面总览、手机角色分析、360英文教程、双徽章和角色简略PNG；全矩阵另有浏览器断言，不把自动截图说成逐张人工审美批准。

## Windows核查与命令边界

参考固定版本：https://github.com/wuwatracker/wuwatracker/blob/747a48b1b994baa9c372a4fb933ea7588428bd4b/import.ps1（2026-10-21读取核查，未执行）。该脚本另含配置写入/提权分支，所以未直接复制完整脚本或给远程下载执行命令；本站是独立本地读取器。

本地命令先读运行中的Client-Win64-Shipping路径；无法读到则让用户给游戏目录/Client.log。仅若干已知日志路径，不扫全磁盘；明文/奇偶XOR/BOM和64MiB上限。默认向剪贴板复制URL、控制台仅显示成功提示。无管理员、网络、文件/游戏配置写入或执行策略更改。下载.ps1如被系统策略阻止，按教程粘贴已审查命令；不要求降低系统安全策略。真实游戏版本、进程路径与玩家日志未实机验证。

## 实际测试结果

- npm test：164通过，0失败，0跳过；新增历史注册表、语言/形态安全、固定封面、连续徽章/评分边界、本地PowerShell与脱敏过期原因测试。Windows命令实际用powershell.exe -Command运行隔离合成文件；明文Global、XOR CN、BOM+XOR及不支持URL均校验，只读前后字节相等。非Windows仅该测试会明确跳过。
- npm run check:static：289本地入口依赖、146脚本语法通过；素材检查64图/62ID、114武器/0正式图、7回退/2封面通过。
- 浏览器48组：完整12（四宽度×三语，含全部四模式PNG/UID/账号/历史/目标/缺图）、最终教程12（首屏按钮/剪贴板/下载）、固定封面失效后的既有账号/增量回退12、原唤取6、目标6；0页面错误。
- 另故障套件：配额失败保留、双账号、Canvas失败、IndexedDB不可用、六总体阶PNG及15原分享Canvas布局通过；目标36布局，合计51旧Canvas边界场景。该套件不重复计入48流程。
- PNG预览与下载字节一致；原详细分页/长记录/超额、UID完整/隐藏保留。Git diff --check通过（只读，不覆盖全部未跟踪文件的语法检查）。
- 代码源保护：Base/Core/Store/CharacterRating/ConveneShare/CharacterPortraits/MultiConfig/CharacterCore/RoleViewModel均与任务开始SHA相同；原角色文件全部哈希不变。API Service仅清理复制格式/分类错误，Pages handle仅返回安全过期枚举，未动评分或存档逻辑。

各实际命令、结束时间、输出与机读结果见evidence和test-results.json。根package没有运行依赖，无需安装即可npm start；测试浏览器依赖Playwright与Edge（本机缓存），程序本身不依赖测试运行时。

## 未验证与剩余问题

真实官方授权POST/真实玩家完整历史、Cloudflare线上绑定及缓存策略、实体手机、真实游戏日志/进程查找、Android/iOS取得URL、Discord客户端压缩均未验证；本次导入为Mock。代码逻辑/本地Edge通过不等于这些已通过。

明确需人工补：2个导电主角性别ID证据、114张正式武器图、维护者选定当期封面。现有真实活动投入/终身共鸣链仍无足够数据，不伪造目标消费。主站其他页面的历史翻译范围未在本轮重做，统一资源服务当前接入的是全部唤取展示；既有Classic业务与图片原件保持。

## 修改文件与交付

完整清单CHANGED_FILES.md（含当前SHA与可用任务基准）；changed-source为本次代码/文档/资源副本。未包含Git、node_modules、用户存档或真实授权。Screenshots与preview是本次实际结果；失败调试图没有作为正式交付。SHA256SUMS.txt覆盖交付文件但不自校验，file-manifest.json也排除自身及校验表避免循环。复制到Downloads后再次逐文件验证。
'''
put('REPORT.md',report)
put('SOURCE_TREE_MESSAGE.txt','统一唤取角色与武器识别，新增固定封面维护，精修连续六阶徽章\n\n补齐64个本地角色与114件武器识别资料，保留原图；改善Windows本地命令教程、URL复制格式及脱敏错误分类。保持评分与存档结构。164项单元测试及48组浏览器流程通过，正式武器图与真实环境验证待补。')
figures=''.join('<figure><a href="'+html.escape(p)+'"><img loading="lazy" src="'+html.escape(p)+'" alt="'+html.escape(Path(p).stem)+'">'+html.escape(Path(p).name)+'</a></figure>'for p in shots)
put('GALLERY.html','<!doctype html><meta charset="utf-8"><title>唤取完整修正 · 实际截图与PNG</title><style>body{background:#0d191f;color:#e5eade;font:16px system-ui;padding:24px}p{line-height:1.7;max-width:1000px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(265px,1fr));gap:20px}figure{margin:0;padding:12px;border:1px solid #4a665e;border-radius:14px;background:#17292d}a{color:#91d1c0;overflow-wrap:anywhere}img{width:100%;height:260px;object-fit:contain}</style><h1>唤取资源与视觉修正 · 实际Edge/Canvas</h1><p>所有档案/授权均为合成。固定角色封面是今汐示例，武器为原创中性图，均不宣称当前UP。最终Windows截图已单独更新到首屏复制版。点击原图；报告在REPORT.md，徽章矢量预览在preview/badge-preview.html。</p><main>'+figures+'</main>')
# Do not copy source baseline base.js or third-party full scripts into this change delivery.
secret=re.compile(rb'eyJ[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}|(?:record_id=|[\"\']recordId[\"\']\s*:\s*[\"\'])[a-f0-9]{32}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----',re.I)
for p in OUT.rglob('*'):
 if p.is_file()and p.suffix.lower()in{'.js','.cjs','.json','.md','.txt','.ps1','.html','.svg'}:assert not secret.search(p.read_bytes()),'Potential secret: '+str(p.relative_to(OUT))
manifest=[{'path':p.relative_to(OUT).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p)}for p in sorted(OUT.rglob('*'))if p.is_file()and p.name not in{'file-manifest.json','SHA256SUMS.txt'}]
data('file-manifest.json',{'files':manifest,'excludedFromManifest':['file-manifest.json','SHA256SUMS.txt'],'allPathsRelativeToDeliveryRoot':True})
entries=[p for p in sorted(OUT.rglob('*'))if p.is_file()and p.name!='SHA256SUMS.txt']
put('SHA256SUMS.txt','\n'.join(sha(p)+'  '+p.relative_to(OUT).as_posix()for p in entries))
print(json.dumps({'delivery':str(OUT),'changedFiles':len(records),'screenshots':len(shots),'files':len(entries)+1,'bytes':sum(p.stat().st_size for p in OUT.rglob('*')if p.is_file()),'protected':protected,'originalCharacterFilesUnchanged':len(images),'secretScan':'passed'},ensure_ascii=True))
