from pathlib import Path
import shutil,json,hashlib,datetime,html,re
R=Path.cwd();W=R/'artifacts/convene-ui-rework-20261020';D=W/'delivery';D.mkdir(exist_ok=True)
def cp(src,dst):dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,dst)
def put(p,t):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t,encoding='utf-8',newline='\n')
logs=['unit.txt','static.txt','browser-reference.txt','browser-convene.txt','browser-target.txt','browser-edge.txt','final-visual.txt']
markers=['pass 145','283 local entry dependencies and 133 script syntax','PASS 6','PASS 6','PASS 6','PASS fault','PASS final']
for name,mark in zip(logs,markers):
 assert mark in (W/name).read_text('utf-8-sig'),name
 cp(W/name,D/'tests'/name)
for group in ['acceptance','convene-regression','target-regression']:
 for p in (W/group).glob('*.png'):
  if p.name!='failure.png':cp(p,D/'screenshots'/group/p.name)
 for p in (W/group).glob('*results.json'):cp(p,D/'tests'/(group+'-'+p.name))
for group in ['before','final-visual','reference']:
 for p in (W/group).glob('*'):
  if p.is_file() and p.suffix in {'.png','.svg','.txt'}:cp(p,D/group/p.name)
for name in ['design-preview.html','design-preview.css','design-preview-1440.png','design-preview-390.png','badge-atlas.html']:cp(W/name,D/'design'/name)
cp(R/'image/characters/jinxi.webp',D/'design/assets/jinxi.webp');cp(R/'image/convene/weapon-emblem.svg',D/'design/assets/weapon-emblem.svg')
p=D/'design/design-preview.html';put(p,p.read_text('utf-8').replace('/image/characters/jinxi.webp','assets/jinxi.webp').replace('/image/convene/weapon-emblem.svg','assets/weapon-emblem.svg'))
cp(R/'docs/convene-reference-rework.md',D/'VISUAL_COMPARISON.md');cp(W/'changes.json',D/'changes.json')
changes=json.loads((W/'changes.json').read_text('utf-8'))
for item in changes:cp(R/item['path'],D/'changed-source'/item['path'])
# Compare protected modules with the actual task-start snapshot, without including credentials or private source backups.
baseline=json.loads((W/'baseline.json').read_text('utf-8-sig'));protected=['js/convene-core.js','js/convene-store.js','js/convene-character-rating.js','js/base.js']
for name in protected:assert hashlib.sha256((R/name).read_bytes()).hexdigest()==baseline['hashes'][name],name
for group in ['acceptance','convene-regression','target-regression']:
 o=json.loads((W/group/'results.json').read_text('utf-8-sig'));assert not o.get('pageErrors'),group
pngs=list(D.rglob('*.png'));summary={'completedAt':datetime.datetime.now().astimezone().isoformat(),'unit':{'passed':145,'failed':0,'skipped':0},'static':{'localEntryDependencies':283,'scriptSyntax':133,'failed':0},'browser':{'referenceFlows':6,'conveneRegressionFlows':6,'targetRegressionFlows':6,'totalFlows':18,'pageErrors':0,'viewports':[1440,390],'languages':['zh-CN','zh-TW','en'],'canvasLayoutCases':51,'faults':['quota preservation','multiple accounts','full/hidden UID','Canvas failure','unavailable storage'],'PNGDownloadMatchesPreview':True},'screenshotsAndPNGs':len(pngs),'changedSourceFiles':len(changes),'protectedModuleHashesUnchanged':protected,'officialAPI':'mock only; authorized official POST not run','realGameLogs':'not run; synthetic plain/XOR logs tested','physicalMobileDevice':'not tested','assets':'canonical local character portraits; explicit generic weapon-category illustration, no verified per-weapon art catalog','dataPreserved':True,'gitWrites':False}
put(D/'test-results.json',json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
put(D/'REPORT.md',f'''# 唤取记录 UI/UX 参考重构交付

完成时间：{summary['completedAt']}。实际源码已直接修改于 WuwaEchoTool 当前工作目录；本目录只提供设计、截图、测试证据和本次修改文件副本，不冒充完整项目交接ZIP。

## 验收结果

- 145项单元测试通过，0失败、0跳过；283项入口依赖、133项脚本语法检查通过。
- 三组浏览器脚本各6流程，共18流程，0页面错误，真实 Edge 页面操作，1440/390宽×简中/繁中/英文。额外故障注入与51个Canvas文字边界案例通过。
- 四类整体／角色简洁和详细图、分页、R0～R6目标下载、超额展示、徽章开关、完整／隐藏UID、预览与下载PNG字节一致均验证。
- 自动直连成功、网络受限→代理备援、404/405/503区分、授权／限流不重试、全失败不写数据；本地文件夹解析仅填写链接不自动导入；历史组合筛选及重置；IndexedDB/备份/取消保护均有实际或针对性测试。
- 当前交付共{len(pngs)}张PNG，包含参考、设计、修改前、正式页面／实际视口、三语回归及分享样本。旧失败调试图未交付。
- 核心公式、档案schema、存储和声骸数据模块4个文件的SHA与任务开始一致；没有Git提交、推送、重置、清理或用户数据删除。

## 视觉自检

阅读VISUAL_COMPARISON.md。先查看final-visual/1440-overview-full.png、390-overview-full.png、1440-character-full.png、390-character-full.png和1440-both-badge-families.png，再检查截图画廊。

已逐张查看三组PNG及三组SVG渲染图。设计预览desktop/mobile均由HTML/CSS实跑生成，角色图路径错误在预览阶段修正。实际页面修正了桌面分布卡的高度拉伸空白、手机时间轴宽度、元数据字号；主体立绘采用contain，不拉伸或裁掉头部；缺图提供明确占位；手机分享按钮≥44px且底部留白可滚动到固定导航上方。全页截图中的固定导航出现在拍摄时首屏位置，因此额外提供手机独立视口图以核对遮挡。

## 限制（不写成通过）

所有接口是明确mock，全部玩家记录、UID和日志是合成fixture。未验证真实官方授权POST、生产代理部署、实体手机、真实游戏版本日志或Discord客户端压缩。测试截图中的404和部分失败横幅是故障注入证据；正式final-visual图无故障横幅。

没有可靠的具体武器图片目录和ID映射，所以明确显示本地武器类别示意SVG，未伪造官方武器外观。当前R标记/区间评级与实际活动投入未知的边界保留。第三方脚本仅固定源码链接供审阅，未执行；简易获取为浏览器本地日志文件夹选择。教学影片仅预留，没有虚构视频。

## 修改文件

共{len(changes)}个本次源码／资源／测试／文档文件，详见changes.json和changed-source/，含5个唤取JS、CSS、14个徽章SVG、武器类别SVG、测试及三组结构参考。只有在任务开始记录过的文件才列before SHA，不用Git HEAD猜测未跟踪源码的旧内容。

## 运行

项目根 `npm start`，访问 http://127.0.0.1:8124/convene.html?view=register。`npm test` / `npm run check:static`。浏览器脚本需要Playwright与Edge或适配浏览器环境；输出通过WUWA_REFERENCE_OUT、WUWA_CONVENE_OUT、WUWA_TARGET_OUT指定独立目录。

SourceTree提交说明（未提交）：重构唤取记录布局与六阶徽章，优化角色立绘和分享隐私，增加自动连接及本地日志教学，补齐三语与浏览器回归。
''')
# Browsable local gallery with collapsed bulk regression groups.
style='body{background:#0c171c;color:#e4eddf;font:16px/1.6 Segoe UI,Microsoft JhengHei,sans-serif;padding:25px;max-width:1500px;margin:auto}a{color:#9ed9c2}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:22px}figure{margin:0;background:#172a2d;border:1px solid #3b574e;border-radius:12px;padding:12px}img{width:100%;height:300px;object-fit:contain}figcaption{overflow-wrap:anywhere;font-size:13px}details{margin:30px 0}summary{cursor:pointer;font-size:20px}'
def figures(paths):return '<main>'+''.join('<figure><a href="'+html.escape(p.relative_to(D).as_posix())+'"><img loading="lazy" src="'+html.escape(p.relative_to(D).as_posix())+'"></a><figcaption>'+html.escape(p.relative_to(D).as_posix())+'</figcaption></figure>'for p in paths)+'</main>'
body='<h1>唤取记录 · 视觉交付</h1><p>合成存档／模拟接口。全部PNG来自真实浏览器或实际Canvas下载。<a href="REPORT.md">报告</a> · <a href="VISUAL_COMPARISON.md">视觉对照</a> · <a href="design/design-preview.html">可运行设计预览</a> · <a href="design/badge-atlas.html">双组六阶徽章</a></p><h2>正式页面与实际视口</h2>'+figures(sorted((D/'final-visual').glob('*.png')))
for group,paths in [('设计预览',list((D/'design').glob('*.png'))),('修改前',list((D/'before').glob('*.png'))),('原始结构与SVG渲染',list((D/'reference').glob('*.png')))]+[(g,list((D/'screenshots'/g).glob('*.png')))for g in ['acceptance','convene-regression','target-regression']]:body+='<details><summary>'+group+' · '+str(len(paths))+'张</summary>'+figures(sorted(paths))+'</details>'
put(D/'index.html','<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>唤取记录视觉交付</title><style>'+style+'</style>'+body+'</html>')
# The exported preview opens locally; no absolute file dependencies or real account values.
for p in [D/'index.html',D/'design/design-preview.html']:
 for value in re.findall(r'(?:src|href)="([^"]+)"',p.read_text('utf-8')):
  assert (p.parent/value).is_file(),(p,value)
secret=re.compile(rb'eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|record_id=[a-f0-9]{32}')
for p in D.rglob('*'):
 if p.is_file():assert not secret.search(p.read_bytes()),p
files=sorted(p for p in D.rglob('*')if p.is_file());put(D/'SHA256SUMS.txt',''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.relative_to(D).as_posix()+'\n'for p in files))
print(json.dumps({'delivery':str(D),'files':len(files)+1,'pngs':len(pngs),'bytes':sum(p.stat().st_size for p in D.rglob('*')if p.is_file()),'changedFiles':len(changes)},ensure_ascii=True))
