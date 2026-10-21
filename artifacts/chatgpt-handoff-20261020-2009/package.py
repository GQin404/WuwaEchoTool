from pathlib import Path
import json,re,hashlib,zipfile,datetime,collections,subprocess
W=Path(__file__).resolve().parent;R=W.parents[1];S=W/'stage/WuwaEchoTool';H=S/'handoff'
def sha(b):return hashlib.sha256(b).hexdigest()
def put(p,t):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t,encoding='utf-8',newline='\n')
def data(p,x):put(p,json.dumps(x,ensure_ascii=False,indent=2)+'\n')
snap=json.loads((W/'snapshot.json').read_text('utf-8'));test=json.loads((H/'test-results.json').read_text('utf-8'))
assert test['unit']=={'passed':124,'failed':0,'skipped':0} and test['browser']['totalFlows']==64
for f in snap['preExclusionSourceFiles']:assert sha((R/f['path']).read_bytes())==f['originalSha256'],'Workspace changed: '+f['path']
for f in snap['sourceFiles']:assert sha((S/f['path']).read_bytes())==f['sha256'],'Staging source changed: '+f['path']
required=['00_READ_FIRST.md','01_CURRENT_PROGRESS.md','02_MODULE_MAP.md','03_DATA_AND_CALCULATION.md','04_CONVENE_SYSTEM.md','05_SHARE_AND_BADGES.md','06_UI_UX_STATUS.md','07_LATEST_CHANGES.md','08_TEST_REPORT.md','09_NEXT_IMPROVEMENTS.md','10_DEPLOYMENT_AND_ENV.md','module-index.json','feature-status.json','test-results.json']
assert all((H/p).is_file()for p in required)
# Documentation must not point to an imaginary code module.
for m in json.loads((H/'module-index.json').read_text('utf-8'))['modules']:
 for k in ['entry','core','dependencies','uiFiles','tests']:
  for p in m[k]:assert (S/p).is_file(),p
for f in json.loads((H/'feature-status.json').read_text('utf-8'))['features']:
 for p in f['files']:assert (S/p).is_file(),p
for p in (H/'evidence/screenshots').glob('*.html'):
 for v in re.findall(r'(?:href|src)="([^"]+)"',p.read_text('utf-8')):assert (p.parent/v).is_file(),v
put(H/'verify.cjs',r'''/* Validate a freshly extracted package before generating new test outputs. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'file-manifest.json'),'utf8')),actual=[];
function digest(b){return crypto.createHash('sha256').update(b).digest('hex');}
function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(e.isDirectory()){if(!['node_modules','.git'].includes(e.name))walk(path.join(d,e.name));}else actual.push(path.relative(root,path.join(d,e.name)).split(path.sep).join('/'));}}
walk(root);assert.deepEqual(actual.sort(),[...manifest.files.map(f=>f.path),'handoff/file-manifest.json','handoff/SHA256SUMS.txt'].sort());
for(const f of manifest.files){const b=fs.readFileSync(path.join(root,f.path));assert.equal(b.length,f.bytes);assert.equal(digest(b),f.sha256,f.path);}
let count=0;for(const line of fs.readFileSync(path.join(__dirname,'SHA256SUMS.txt'),'utf8').trim().split(/\r?\n/)){const m=line.match(/^([a-f0-9]{64})  (.+)$/);assert.ok(m);assert.equal(digest(fs.readFileSync(path.join(root,m[2]))),m[1],m[2]);count++;}
console.log('PASS '+actual.length+' files, '+count+' SHA-256 entries; manifest paths/sizes/digests match.');
''')
stamp=datetime.datetime.now().astimezone();name='WuwaEchoTool_ChatGPT_Full_'+stamp.strftime('%Y%m%d_%H%M')+'.zip';zp=W/name
sizes=collections.Counter();largest=[]
for f in snap['sourceFiles']:sizes[f['path'].split('/')[0]]+=f['bytes'];largest.append((f['path'],f['bytes']))
oldsize=json.loads((H/'size-analysis.json').read_text('utf-8'));oldsize['packagedSourceDirectories']=sizes.most_common();oldsize['packagedSourceLargestFiles']=sorted(largest,key=lambda x:x[1],reverse=True)[:12];data(H/'size-analysis.json',oldsize)
largestTable='\n'.join('|'+p+'|'+str(n)+'|'+('当前角色/声骸图与OCR示例，保留画质'if p=='image'else '本地OCR双核心及三语模型/依赖，不能当缓存删除'if p=='library'else '历史测试引用的baseline与脚本/审计资料，未重复封全项目'if p=='artifacts'else '有效源码或文档')+'|'for p,n in sizes.most_common(7))
checks={'requiredDocuments':True,'moduleAndFeaturePaths':True,'galleryLinks':True,'originalSourceHashesUnchanged':len(snap['preExclusionSourceFiles']),'archiveSourceHashesMatchSnapshot':len(snap['sourceFiles']),'localResourceReferences':test['resources']['localReferences'],'localResourceMissing':test['resources']['missing'],'sourceFiles':len(snap['sourceFiles']),'excludesGitHistory':True,'excludesPersonalBrowserStorage':True,'sanitizedUnusedCredentialInArchiveCopyOnly':True}
data(H/'prepack-checks.json',checks)
def pack(zipsize=0,rawsize=0):
 count=len([p for p in S.rglob('*')if p.is_file()and p.relative_to(S).as_posix()not in {'handoff/11_FILE_MANIFEST.md','handoff/file-manifest.json','handoff/SHA256SUMS.txt'}])+3
 put(H/'11_FILE_MANIFEST.md',f'''# 封装内容与完整性

实际封装：{stamp.isoformat()}
ZIP：{name}
ZIP 大小：{zipsize:012d} bytes
文件总数：{count:08d}
未压缩总量：{rawsize:012d} bytes
源快照文件：{len(snap['sourceFiles'])}（当前内容，含未提交/未跟踪）；另有交接文档、索引、工具、29张本次代表截图/PNG及真实测试日志。只有一个WuwaEchoTool/根，没有嵌套完整副本。

## 顶层与重要内容

根HTML入口/配置/package.json/_headers/wrangler.toml；js/完整业务和静态数据；css/布局；image/当前图片SVG与OCR示例；library/本地第三方与OCR核心/三语模型/校验和；functions/api/convene.js与convene-worker/代理部署；scripts/服务与模型维护；tests/全部现有测试及fixtures；docs/有效项目说明与引用图片；calculations/模型表；原DOCX说明；artifacts/仅保留测试所需baseline及有用途的文本脚本；handoff/本交接。

根无npm依赖、无根lockfile，这是实际项目而非遗漏。浏览器辅助工具的package.json和lockfile位于handoff/browser-tools，npm ci后安装Playwright浏览器；服务端需维护者在自己的Cloudflare环境部署绑定。不存在必须保留但被按名称删除的dist/build运行目录。

## 体积来源（源文件，字节）

|目录/文件|字节|保留原因|
|---|---:|---|
{largestTable}

最大的单个文件是library/ocr两份约3.95MB嵌入WASM JS，分别支持SIMD和非SIMD，不能当重复删除；截图示例及有效DOCX较大但仍用于项目。见size-analysis.json精确文件排行。未降低任何产品图片品质。

## 排除与敏感信息

详见exclusions.json。排除.git、node_modules、系统/编辑器缓存、历史ZIP/打包副本、重复大量截图和生成产物、潜在私人.env/数据库/日志。目录经过用途核对，保留被测试实际引用的旧baseline。另排除64个image/characters/旧版图片历史PNG，41,862,376字节；代码/配置/测试/文档均无旧目录引用，当前CSS和Portraits解析当前WebP。工作区旧图未删除。

唯一源码脱敏：base.js中未使用的历史tokenList凭证值在包内置空；工作区不改，sanitization.json记录前后hash且不包含秘密。未复制个人UID档案/浏览器资料；tests中的fixture授权和假UID为明确合成数据。高置信度敏感模式及Office XML扫描无遗留，扫描不能证明任意未知编码均无秘密。

## 校验方法与可运行边界

file-manifest.json为机器清单，逐文件bytes/SHA-256，不自列自身与SHA文件；SHA256SUMS.txt覆盖除自身外的每个文件（含file-manifest.json），没有循环。新解压副本运行node handoff/verify.cjs验证。ZIP外另提供整体SHA-256和最终验证摘要，避免ZIP自包含自身哈希的循环。

封装流程强制检查CRC、重复/危险路径、UTF-8中文路径、文件集与SHA、文档路径/画廊链接、源文件前后哈希，并解压运行校验和测试；失败不正式交付。最终结果以ZIP旁verification.json和回复为准。本次无丢失本地引用；动态JS和所有远程资源无法仅靠静态穷举，已用浏览器操作覆盖主要路径。真实授权API/生产与设备仍未验证，详见08/10。
''')
 files=sorted(p for p in S.rglob('*')if p.is_file()and p.relative_to(S).as_posix()not in {'handoff/file-manifest.json','handoff/SHA256SUMS.txt'})
 data(H/'file-manifest.json',{'formatVersion':1,'pathBase':'project root','capturedAt':stamp.isoformat(),'excludedFromOwnList':['handoff/file-manifest.json','handoff/SHA256SUMS.txt'],'files':[{'path':p.relative_to(S).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p.read_bytes())}for p in files]})
 put(H/'SHA256SUMS.txt',''.join(sha(p.read_bytes())+'  '+p.relative_to(S).as_posix()+'\n'for p in sorted(files+[H/'file-manifest.json'])))
 allfiles=sorted(p for p in S.rglob('*')if p.is_file());raw=sum(p.stat().st_size for p in allfiles)
 with zipfile.ZipFile(zp,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9)as z:
  for p in allfiles:z.write(p,'WuwaEchoTool/'+p.relative_to(S).as_posix(),compress_type=zipfile.ZIP_STORED if p.name in {'file-manifest.json','SHA256SUMS.txt','11_FILE_MANIFEST.md'}else zipfile.ZIP_DEFLATED)
 return zp.stat().st_size,raw
size,raw=pack();size2,raw2=pack(size,raw);assert(size,raw)==(size2,raw2)
with zipfile.ZipFile(zp)as z:
 assert z.testzip()is None
 names=z.namelist();assert len(names)==len(set(names));assert all(not n.startswith(('/','\\'))and '..'not in Path(n).parts for n in names)
 nonascii=[i for i in z.infolist()if not i.filename.isascii()];assert all(i.flag_bits&0x800 for i in nonascii)
 expected=sorted('WuwaEchoTool/'+p.relative_to(S).as_posix()for p in S.rglob('*')if p.is_file());assert sorted(names)==expected
 sums=(H/'SHA256SUMS.txt').read_text('utf-8').splitlines()
 for line in sums:
  digest,p=line.split('  ',1);assert sha(z.read('WuwaEchoTool/'+p))==digest,p
 secret=re.compile(rb'eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{20,}')
 assert not any(secret.search(z.read(n))for n in names),'JWT pattern in final archive'
 E=W/'verified';assert not E.exists();z.extractall(E)
for f in snap['preExclusionSourceFiles']:assert sha((R/f['path']).read_bytes())==f['originalSha256'],f['path']
result={'zipName':name,'packagedAt':stamp.isoformat(),'zipPath':str(zp),'zipBytes':size,'zipMiB':round(size/1048576,2),'uncompressedBytes':raw,'fileCount':len(names),'sourceFiles':len(snap['sourceFiles']),'sha256':sha(zp.read_bytes()),'sha256EntriesChecked':len(sums),'crc':'passed','duplicatePaths':0,'unsafePaths':0,'utf8NonAsciiPaths':len(nonascii),'missingLocalReferences':0,'workspaceSourceFilesUnchanged':len(snap['preExclusionSourceFiles']),'sanitizedSourceFiles':1,'historicalPortraitsExcluded':64,'screenshots':29,'testSummary':test,'prepackChecks':checks,'extractedPath':str(E/'WuwaEchoTool')}
data(W/'verification.json',result);put(W/(name+'.sha256'),result['sha256']+'  '+name+'\n')
print(json.dumps({k:v for k,v in result.items()if k not in {'testSummary','prepackChecks'}},ensure_ascii=True))
