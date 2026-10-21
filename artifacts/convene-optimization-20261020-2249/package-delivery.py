from pathlib import Path
import json, hashlib, shutil, datetime, html, re

ROOT=Path.cwd()
WORK=ROOT/'artifacts/convene-optimization-20261020-2249'
OUT=WORK/'delivery'
OUT.mkdir(exist_ok=True)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
baseline=json.loads((WORK/'baseline.json').read_text('utf-8-sig'))
protected=['js/convene-core.js','js/convene-store.js','js/convene-character-rating.js','js/convene-service.js','js/character-portraits.js','js/base.js']
checks={p:sha(ROOT/p)==baseline['hashes'][p] for p in protected}
assert all(checks.values()),checks
changed=[p for p,h in baseline['hashes'].items() if sha(ROOT/p)!=h]
new=['js/weapon-catalog.js','js/weapon-portraits.js','js/convene-assets.js','tests/convene-artwork.test.cjs','tests/convene-optimization-browser.cjs','scripts/check-convene-art.cjs','docs/weapon-artwork.md','docs/weapon-missing-assets.json','docs/convene-optimization.md']
new += [p.relative_to(ROOT).as_posix() for p in sorted((ROOT/'image/weapons').rglob('*')) if p.is_file()]
new += ['image/convene/character-fallback.svg']
changed += [p.relative_to(ROOT).as_posix() for p in sorted((ROOT/'image/convene/badges').glob('*.svg'))]
files=sorted(set(changed+new))
for name in files:
    dest=OUT/'changed-source'/name
    dest.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(ROOT/name,dest)
changes=[{'path':p,'taskStartSHA256':baseline['hashes'].get(p),'finalSHA256':sha(ROOT/p),'baseline':'task-start snapshot' if p in baseline['hashes'] else 'new or regenerated; no prior hash captured'} for p in files]
(OUT/'changes.json').write_text(json.dumps(changes,ensure_ascii=False,indent=2),'utf-8')

def copy_file(src,dest):
    dest.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(src,dest)

# Final production-catalog pages after the last UI/Canvas changes: all 12 matrices.
for p in (WORK/'final-visual').glob('*.png'):
    copy_file(p,OUT/'screenshots/final'/p.name)
# Supplemental interaction evidence; skip obsolete atlas layout and pre-final character exports.
suffixes=['account-B-covers','cover-updated-after-import','history-five-filter','import','pool-1','pool-2','weapon-load-fallback','windows-recommended','windows-alternative-video-slot']
for p in (WORK/'browser').glob('*.png'):
    if p.name.startswith('1440-zh-CN-') or p.name.startswith('390-zh-CN-'):
        if any(p.stem.endswith('-'+s) for s in suffixes) or '-target-R' in p.stem or '-overall-compact' in p.stem or '-overall-detailed' in p.stem or '-overall-full-uid' in p.stem:
            copy_file(p,OUT/'screenshots/interaction-synthetic-art'/p.name)
for p in (WORK/'target-regression').glob('1440-zh-CN-target-R*-compact.png'):
    copy_file(p,OUT/'screenshots/target-regression'/p.name)
copy_file(WORK/'badge-atlas.html',OUT/'preview/badge-atlas.html')
copy_file(WORK/'final-visual.cjs',OUT/'evidence/final-visual.cjs')
logs=['unit.txt','static.txt','art-check.txt','browser.txt','browser-convene.txt','browser-target.txt','browser-edge-final.txt','final-visual.txt']
for name in logs: copy_file(WORK/name,OUT/'evidence'/name)
results={}
for folder in ['browser','convene-regression','target-regression','final-visual']:
    p=WORK/folder/'results.json'
    if p.exists():
        results[folder]=json.loads(p.read_text('utf-8-sig'))
        copy_file(p,OUT/'evidence'/f'{folder}-results.json')
edge=json.loads((WORK/'convene-regression/edge-results.json').read_text('utf-8-sig'))
copy_file(WORK/'convene-regression/edge-results.json',OUT/'evidence/edge-results.json')
summary={'generatedAt':datetime.datetime.now().astimezone().isoformat(),'unit':{'tests':153,'pass':153,'fail':0,'skip':0},'static':{'localDependencies':286,'scriptSyntaxChecks':139,'pass':True},'browser':{'optimizationMatrices':12,'existingImportFlows':6,'targetFlows':6,'finalVisualMatrices':12,'widths':[1440,768,390,360],'locales':['zh-CN','zh-TW','en'],'engine':'Microsoft Edge headless / Playwright','pageErrors':[],'realOfficialAPI':False,'realCloudflareDeployment':False,'physicalMobile':False,'syntheticFixtures':True},'art':{'productionWeapons':0,'fallbackFilesChecked':7,'fixtureArtIsNotOfficial':True},'protectedTaskStartSHA256Matches':checks,'faultInjection':edge,'sourceFilesDelivered':len(files)}
(OUT/'test-results.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),'utf-8')

report='''# 唤取记录完整优化与视觉重整：交付报告

基于任务开始时的最新工作区完成；本次未提交或推送 Git，未改变评分公式、存档 schema、导入算法、角色素材原件或其他模块。测试仅在隔离浏览器上下文使用合成档案，不访问个人浏览器资料。交付目录中的 changed-source 是本次变更副本，完整可运行项目仍位于 C:/Users/user/Downloads/WuwaEchoTool。

## 功能状态

| 项目 | 实际完成情况 | 验证 |
|---|---|---|
| 限定角色自动封面 | 当前账号、对应卡池、五星且为角色；按时间/数值序号取最新，稳定 gid 找本地立绘 | 单元+真实 Edge 页面，含切账号、导入新记录与三语言 |
| 限定武器自动封面 | 同样依据实际档案；独立目录与安全 ID/别名映射，保留名称/日期/间隔/保底 | 有图分支用明确合成素材；生产空目录和失败回退独立验证 |
| 总览与分析 | 整体评价、限定双主卡优先；其他池折叠；最近五星图片及数据；未知间隔显示 —，不产生 ≥ null | 四宽度×三语言 |
| 历史记录 | 搜索、卡池、快速五星入口；高级筛选折叠；40 条分页与逐笔数据保留，220ms 搜索防抖 | 交互筛选与存档前后比对 |
| 角色分析 | 大立绘、可见取得次数、时间轴状态；R0～R6、超额记录、待观测原因保留 | 目标回归与浏览器 |
| 双六阶徽章 | 两套轮廓、金属渐层、中心宝石、星轨/契约纹样；高阶羽翼/冠饰/刻度递增；SVG/Canvas 共用图元 | 同步单元检查、双家族图鉴和小尺寸截图 |
| 成就与图鉴 | 判定逻辑保留，图鉴公式折叠；分享成就使用同源图元；无成就时独立文案 | 浏览器展开/收起、Canvas |
| 四类原有分享 | 整体/角色各简略与详细保留；角色原分享也提供 R 目标与依据；目标专属分享保留 | PNG 下载字节与预览一致，分页/三语言/UID/失败回退 |
| 导入与教程 | 自动直连/条件代理机制保留；普通错误说明简化；本地日志推荐/备用与未来影片位置，不提供远端执行命令或假播放按钮 | 国服/国际服、重复/部分成功/取消等模拟通过 |

## 最新五星与图片规则

入口为 convene.html → ConveneAssets → ConveneCore 分析结果。`latest(stats,pool)` 只查看当前账号对应池的五星记录，复制排序后取最后一笔，不修改原数组；使用 Core.order 的实际 time、数值 seq 等稳定规则，不用当前 UP、名称拼接路径或对象遍历顺序。切账号、导入后和切语言均重新派生。

角色 ID 对应现有 roleList/CharacterPortraits；未知 ID 不冒用同名角色。武器目录为 js/weapon-catalog.js；解析器 js/weapon-portraits.js；只允许本地 image/weapons/[345]star 资源。ID 优先；只有无 ID 查询才允许精确唯一别名，冲突或模糊匹配拒绝。图片失败只有一次有界回退，避免加载循环。

## 武器素材缺口与扩充

**当前真实武器图片和经核验的目录条目均为 0。** 仓库没有可核实的完整真实 ID/图片清单，所有五星、四星、三星武器正式图及映射待补；没有虚构 ID，也没有把角色图当武器。现已完成可运行目录、解析器、中性武装结晶和五种类别占位图。未登记类别的未知武器使用中性图，避免错误暗示类型。合成几何测试图明显标注 SYNTHETIC ART FIXTURE，只存在测试请求拦截中。

未来添加真实授权透明图到相应星级目录，确认官方 resourceId 后在 weapon-catalog 加入三语名称、类型、来源/许可与路径即可；详细流程见 changed-source/docs/weapon-artwork.md。全局缺口见 weapon-missing-assets.json；`WeaponPortraits.missing(records)` 可为特定本地档案列出按 ID 去重的缺图清单，不包含 UID 或授权参数。

## 视觉对照与截图索引

三组 docs/ui-reference PNG 已实际查看，使用其信息层级，未照搬框图说明。实际 HTML/CSS 的最终页面就是高保真实现；所有截图来自 Edge 渲染，徽章专用预览另见 preview/badge-atlas.html。

- 桌面：整体评价先于限定双卡；主卡左数据/右立绘，保留最近取得与次级卡池、分布及月份趋势。
- 手机：主卡图片在前、完整宽度数据在后；历史筛选折叠，弹窗与分享操作保留。没有横向溢出断言失败。
- 角色：大立绘、目标与可见次数在首层，时间轴保留所有取得；不是推断真实共鸣链。
- 徽章：整体星盘/角色契约两种轮廓，SSS 额外冠饰和多层框；相同绘图用于网页及 Canvas。
- 分享：深色共鸣背景与金属强调，角色图为主视觉；详细记录分页，默认无 UID 空栏；完整 UID 仅用户主动开启。

screenshots/final 是最终代码、生产空武器目录的四宽度三语言截图：overview-full、character-full、weapon-pool、两个 atlas、公式展开、Windows 底部与角色原分享 PNG。both-six-tier-families.png 同时展示两套六阶及小尺寸。

screenshots/interaction-synthetic-art 包含账号切换、导入更新、映射/回退、限定角色/武器分析、历史、导入窗口、Windows 推荐/备用、整体分享、R0～R6；其中武器有图为明确合成测试分支，不能当正式图库截图。screenshots/target-regression 为目标专属简略图。完整可点击缩略图目录见 GALLERY.html。

视觉自检：桌面/平板/390/360 页面与弹窗均检查横向溢出；立绘不拉伸，武器 contain；无缺图导致空白主卡；标题/按钮可读；公式收起；页内与 PNG 字节一致。窄英文底部导航可能换行，属于当前共享导航的紧凑表现；没有改动全局导航业务。已人工抽查桌面、768、390、360 英文、角色分享与双徽章图鉴；其余矩阵由浏览器断言及截图覆盖，不将自动截图等同逐张人工审美判断。

## 实际测试

| 指令 | 结果 |
|---|---|
| npm test | 153 通过，0 失败，0 跳过 |
| npm run check:static | 286 本地入口依赖、139 脚本语法检查通过 |
| node scripts/check-convene-art.cjs | 0 真实目录条目、7 个回退资源通过；空目录明确披露 |
| node tests/convene-optimization-browser.cjs | 12 个宽度/语言流程通过：账号切换、导入更新、映射/失败、筛选与存档保持 |
| node tests/convene-browser.cjs | 6 个现有导入/分享回归流程通过 |
| node tests/convene-target-browser.cjs | 6 个目标/三语/UID/超额回归流程通过，含 36 个 Canvas 布局场景 |
| node tests/convene-edge-browser.cjs | 最终重新执行通过：存储配额回滚、双账号、Canvas 失败、存储不可用、六阶 PNG、15 个三语 Canvas 布局场景 |
| node artifacts/convene-optimization-20261020-2249/final-visual.cjs | 12 次最终视觉复核通过：公式默认折叠、未知间隔、目标选择、PNG 字节相等、档案不变 |

浏览器为 Playwright 驱动实际 Microsoft Edge，1440/768/390/360px × zh-CN/zh-TW/en。合成记录和模拟 API，不是静态示意图。原浏览器脚本可用 WUWA_CONVENE_OUT 指定输出；新优化脚本使用 WUWA_OPTIMIZE_OUT。运行需 Node 与 Playwright、已安装 Edge；npm start 启动静态站，无 bundler，打开 convene.html?view=register&lang=zh-CN。测试日志与机器结果见 evidence/、test-results.json。

## 兼容性与未验证边界

ConveneCore、ConveneStore、CharacterRating、Service、CharacterPortraits、base.js 六个原件对比任务开始 SHA-256 完全相同。没有数据迁移。旧模块工作区已有修改未覆盖，Git 状态中未跟踪文件不能被误认作本次全部新增；changes.json 以任务开始基准标注，比对不到的旧徽章标为 regenerated。

官方真实 API、真实玩家链接、Cloudflare 正式代理部署、实体手机、Android/iOS 真实日志获取、Discord 客户端压缩效果均 **未验证**。手机测试为浏览器视口模拟。模拟连通不代表生产授权或代理一定有效；未重写当前连接机制。真实武器图是当前明确剩余项。旧 Classic 与角色工作台没有新增人工全流程回归；现有单元/静态路由回归通过，不夸大为实机验收。

## 文件与交付校验

修改/新增文件完整列表见 changes.json 与下表。SHA256SUMS.txt 覆盖交付文件（不自哈希）；复制到 Downloads 后再次按 SHA 校验。没有附带真实授权、个人存档、Git 历史或依赖目录。evidence/final-visual.cjs 保留原项目相对运行环境，在项目目录运行，不应把 changed-source 当独立项目启动。

'''
report += '\n| 文件 | 本次责任 |\n|---|---|\n'
for p in files:
    if p in changed and p.startswith('image/convene/badges'): purpose='由统一 SVG 图元重新生成的阶级徽章'
    elif p=='js/convene-ui.js': purpose='封面、历史筛选、角色、图鉴、分享入口与回退'
    elif p=='js/convene-share.js': purpose='原角色分享 R 目标、依据、成就与占位'
    elif p=='js/convene-visuals.js': purpose='共享 SVG/Canvas 金属层次与阶级图元'
    elif p.startswith('image/'): purpose='透明回退图或目录维护说明'
    elif p.startswith('tests/'): purpose='映射/封面/交互自动化'
    else: purpose='解析、资源接线、样式、三语或维护说明；详见源码'
    report += f'| {p} | {purpose} |\n'
(OUT/'REPORT.md').write_text(report,'utf-8')
(OUT/'SOURCE_TREE_MESSAGE.txt').write_text('优化唤取总览自动五星封面与三语图片映射\n\n新增可扩充武器素材目录及类别回退；调整历史筛选、角色 R 分享与双六阶徽章。保留评分、存档与自动导入逻辑。153 项测试与静态检查通过，完成四宽度三语浏览器复核。真实武器图待补，官方 API/实机未验证。\n','utf-8')
shots=sorted((OUT/'screenshots').rglob('*.png'))
gallery='<!doctype html><meta charset="utf-8"><title>唤取优化 · 真实浏览器截图</title><style>body{background:#0d181c;color:#e8eee2;font:16px system-ui;padding:24px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}figure{margin:0;padding:12px;background:#17282c;border:1px solid #49645f;border-radius:12px}img{width:100%;height:250px;object-fit:contain}a{color:#8bcebd;overflow-wrap:anywhere}p{max-width:1000px;line-height:1.6}</style><h1>唤取记录优化 · 实际渲染证据</h1><p>全部来自实际 Edge 页面或页面 Canvas 下载。数据均为合成，不代表真实玩家。final 使用生产空武器目录；interaction-synthetic-art 中有图武器是明确测试素材，不是官方资源。点击查看原尺寸。详细状态和限制请阅读 REPORT.md。</p><main>'
for p in shots:
    rel=p.relative_to(OUT).as_posix(); label=html.escape(rel)
    gallery+=f'<figure><a href="{label}"><img loading="lazy" src="{label}" alt="{label}">{label}</a></figure>'
(OUT/'GALLERY.html').write_text(gallery+'</main>','utf-8')
# Never print detected content. Scan high-confidence secrets, not words like token in source.
secret=re.compile(rb'eyJ[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}|(?:record_id|resources_id)[=\"\s:]+[a-f0-9]{32}',re.I)
for p in OUT.rglob('*'):
    if p.is_file() and p.suffix.lower() in ['.js','.cjs','.md','.txt','.json','.html']:
        assert not secret.search(p.read_bytes()),'Potential secret in '+str(p.relative_to(OUT))
manifest=[{'path':p.relative_to(OUT).as_posix(),'size':p.stat().st_size,'sha256':sha(p)} for p in sorted(OUT.rglob('*')) if p.is_file() and p.name not in ['SHA256SUMS.txt','manifest.json']]
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),'utf-8')
entries=[p for p in sorted(OUT.rglob('*')) if p.is_file() and p.name!='SHA256SUMS.txt']
(OUT/'SHA256SUMS.txt').write_text('\n'.join(sha(p)+'  '+p.relative_to(OUT).as_posix() for p in entries)+'\n','utf-8')
print(json.dumps({'delivery':str(OUT),'sourceFiles':len(files),'screenshots':len(shots),'totalFiles':len(entries)+1,'bytes':sum(p.stat().st_size for p in OUT.rglob('*') if p.is_file()),'protected':checks,'secretScan':'passed'},ensure_ascii=False))
