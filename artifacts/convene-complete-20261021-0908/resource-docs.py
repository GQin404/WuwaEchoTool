from pathlib import Path
import json,re
R=Path.cwd();W=R/'artifacts/convene-complete-20261021-0908'
def put(p,t):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t.strip()+'\n',encoding='utf-8',newline='\n')
p=R/'js/weapon-catalog.js';t=p.read_text('utf-8');raw=json.loads(t.split('()=>(',1)[1].rsplit('));',1)[0])
for r in raw['weapons']:r['fileName']=re.sub('[^a-z0-9]+','-',r['names']['en'].lower()).strip('-')+'.webp'
assert len({(r['rarity'],r['fileName'])for r in raw['weapons']})==len(raw['weapons'])
put(p,t.split('()=>(',1)[0]+'()=>('+json.dumps(raw,ensure_ascii=False,separators=(',',':'))+'));')
audit=json.loads((R/'docs/convene-resource-audit.json').read_text('utf-8'))
for r,m in zip(raw['weapons'],audit['weaponsMissingImages']):
 assert r['id']==m['id'];m['suggestedPath']='image/weapons/'+str(r['rarity'])+'star/'+r['fileName']
put(R/'docs/convene-resource-audit.json',json.dumps(audit,ensure_ascii=False,indent=2))
put(R/'docs/weapon-missing-assets.json',json.dumps({'productionCatalogEntries':114,'verifiedOfficialWeaponImages':0,'missingImageCount':114,'missingByRarity':{'5star':50,'4star':43,'3star':21},'images':audit['weaponsMissingImages'],'unknownCharacterResourceIdMappings':audit['characterMappingsPending'],'notes':'Metadata exists independently of art. No weapon artwork downloaded. Editorial covers are not actual weapon portraits or evidence of current UP.'},ensure_ascii=False,indent=2))
put(R/'docs/weapon-artwork.md','''# 武器识别与图片维护（2026-10-21更新）

当前 **114件武器识别资料、0张正式武器图片**：五星50、四星43、三星21。来源为本次实际取得的Encore三语公开数据，包含历史限定、常驻、锻造等目录项，不表示每件都可从唤取获得；不从ID数字猜稀有度或类型。原始来源URL与SHA见convene-resource-audit.json。官方WIKI可核对中文名称；真实官方授权导入未由这些数据证明。

集中维护 `js/weapon-catalog.js`：id/resourceId为资源ID、names三语、category类型、rarity、fileName建议文件名、image实际路径（当前null）、source来源。没有复制网络图片地址作为运行依赖；Icon字段未进入注册表。WeaponPortraits只接受本地资源，ID权威，未知ID不借同名图；无ID查询仅唯一精确归一别名，冲突/子串均拒绝。

## 给现有武器补图

1. 使用你有权使用的透明原图，不改已有角色文件。按fileName放到image/weapons/5star、4star或3star；例如赫奕流明建议5star/blazing-brilliance.webp。不要仅改扩展名假装WebP。
2. 在同一条catalog记录将image从null改成完整本地路径；只改这一个注册表条目，页面/历史/分析自动复用，不需分别改JS。fileName只是建议，不是声称文件存在。
3. 新武器先核验真实resourceId、三语名称、类型/星级及来源，再新增一条。不得把WIKI页面ID、角色ID、武器类型编号当资源ID。
4. 推荐英数小写、连字符，保留比例与透明背景；新版本图可用新后缀避免旧图缓存。运行node scripts/check-convene-art.cjs，再在卡池分析/历史查看三语同图、加载失败回退。

缺图使用五种类别SVG；完全未知ID用中性武装结晶，不用错误角色图/固定剑冒充武器。缺图全清单（114条真实ID与三语名称）见weapon-missing-assets.json；WeaponPortraits.missing(records)可按本地档案列缺口，不含UID或授权。

## 与当期封面区别

image/convene-current/featured-weapon.webp是手动总览封面，**不是**某个物品的注册图片。替换它不影响历史记录身份。当前默认是原创中性结晶示例，仍须人工补正式封面；不会假装已识别当前卡池。详见image/convene-current/README.md。
''')
for rarity in [3,4,5]:
 count=sum(r['rarity']==rarity for r in raw['weapons'])
 put(R/('image/weapons/'+str(rarity)+'star/README.md'),f'''# {rarity}星武器图片

注册表已有{count}件该星级识别资料，正式图片仍待补，文件名建议见js/weapon-catalog.js的fileName。合法透明图放本目录后，设置同条目的image路径；不要把name自动拼路径，也不要登记不存在的图片。缺图继续显示类别占位。维护及逐项清单见docs/weapon-artwork.md与docs/weapon-missing-assets.json。
''')
put(R/'image/convene-current/README.md','''# 手动总览封面

只替换同名文件即可更新总览，维护者无须修改HTML、CSS或JS：

- featured-character.webp：限定角色主卡。
- featured-weapon.webp：限定武器主卡。

本次初始角色封面是现有今汐图片的维护示例，武器封面是原创中性结晶；**两者不表示当前游戏UP，也不表示该账号的最近取得物品**。主卡明确标“手动维护封面”，最近五星的名称/日期/间隔仍来自真实导入记录。请自行换成你有权使用的当期图片。

不要改image/characters原图或建第二套角色库。固定封面是编辑选图的单独用途；除这两个文件外，角色/历史/分享仍复用原角色资源。建议实际WebP、透明背景、完整人物或武器且保留比例；避免把已经裁掉头部的源图当全身图，CSS无法恢复被裁内容。

主卡优先固定图；文件缺失或加载失败→最近取得的可靠物品图→角色/武器类别占位。卡池分析与历史使用物品自身图，不使用手动封面顶替身份。

_headers对本目录先移除宽泛Cache-Control再设置no-cache,must-revalidate，防止继承普通image目录7日缓存；按Cloudflare Pages叠加规则配置。正常刷新会重新校验；正式部署的额外Cache Rules/CDN覆盖仍需维护者确认。npm start本地服务no-store。不要清除玩家本地数据来刷新图片。
''')
put(R/'docs/convene-resource-management.md','''# 唤取资源与视觉完整修正（2026-10-21）

## 当前结果与入口

本轮保留现有Core/Store/CharacterRating/CharacterPortraits/Base与角色养成功能，未改公式或schema。来源审计：convene-resource-audit.json。64个本地角色形态全部进入统一注册表并匹配原图；62个资源ID可靠对照，2个导电主角性别对应未知（1309/1310不按顺序猜）。114个武器三语/类型/星级可识别；0张正式武器图。缺口详见weapon-missing-assets.json。

js/character-catalog.js由现有roleList内部ID、CharacterPortraits/CSS图片及集中三语/资源ID元数据构造只读注册表。内部id≠resourceId；resourceId为主，无ID时唯一精确别名；各性别/元素Rover不合并。旧名雪豹/桃祁等保留别名，显示采用本次核对名称。没有改变旧声骸养成目录或其存档。

js/convene-assets.js统一为总览最近五星、分析、历史、角色星运/分享提供身份、三语和图片，不按语言拼文件名。js/weapon-catalog.js/weapon-portraits.js集中武器识别；图片与识别资料分离，缺图有类型回退。添加角色仍走既有base角色定义与base.css图片维护；新元数据只补character-catalog这一处，不逐页面重复注册；现有图无需重命名或复制专属角色库。

## 总览固定封面与布局

js/convene-covers.js优先image/convene-current两个固定WebP，只作用总览限定双卡。卡池分析/历史继续物品真实图。手动封面不随账号/最新取得切换，数据仍随账号/导入更新；不宣称自动识别当前游戏卡池。缺固定图时才回退最近取得。封面示例与替换/缓存详见该目录README。

按本次最新要求，总览顺序为限定角色/武器→核心统计→整体星运→最近五星→其他池/趋势/成就。桌面左右数据/视觉，手机图片在前完整宽度数据在后；物品图片contain等比。保留全部卡池分析按钮与异常提示，没有删掉次要池分析入口。

## 徽章与分享

ConveneVisuals两族各使用固定核心构图，升级仅追加同源图元；overall为星盘/星轨/星核，character为契约盾印/双核/连接。最低到最高5/7/10/13/16/20个路径，保留每阶前缀结构，增加框圈、刻纹、翼片、冠饰与底部装饰。金属渐层克制，SVG/Canvas同源（含中心宝石），14个静态SVG同步生成。称号/区间/门槛保持原样，未舍入边界无重叠。

原四分享与目标分享、R0～R6、超额、UID隐藏/完整、12条分页保留。R窗口口径明确包含锚点至目标所有抽取（含其他角色/歪出），不是目标角色实际花费；默认真实投入证据不足仍待观测，不把其他角色抽数伪装成目标成本，不改窗口公式。

## Windows与导入

js/convene-windows.js提供可查看/复制/下载的原创建本地PowerShell命令。先读运行中的游戏路径，不能取得时由玩家提供目录/日志；仅几个确定路径，不扫描全部磁盘。明文/XOR/BOM、64MiB上限；只读文件，默认只向剪贴板复制私密URL，控制台不打印链接。无网络、提权、设置写入、执行策略更改。命令粘贴运行；若下载.ps1被系统策略阻止，使用可审查的粘贴命令，不要求降低系统策略。

公开参考固定版本为WuWa Tracker 747a48b1b994baa9c372a4fb933ea7588428bd4b（2026-10-21核查）；其脚本含配置写入/提权分支，所以本站没有复制整脚本，也不提供下载后立即执行的命令。来源链接保留在教程，真实游戏版本适用性未实机证明。

parseURL新增常见复制形式的有界清理：成对尖括号、单一Markdown链接、HTML &amp;与转义分隔符；仍严格校验HTTPS白名单、query/#/record、重复参数、地区及必要授权字段。合法gacha_id/type变化不影响池请求。自动直连/条件代理、错误分类、去重/逐池提交/部分成功保持原实现；成功空响应有独立说明，不当无效链接。真实官方API/Cloudflare部署未验证。

## 测试与来源

本轮新增注册表/历史角色武器/形态隔离/边界/本地命令测试与四宽度三语真实Edge流程；最终命令、数量、截图及PNG下载一致性见独立交付REPORT.md、test-results.json。Node模拟、浏览器Mock、真实官方接口、部署及实体设备严格分开，不用旧报告计数冒充本次。

数据来源为https://api-v2.encore.moe/api/{en,zh-Hans,zh-Hant}/{character,weapon}公开目录，保存检索时间与内容哈希，非运行时服务依赖；历史资源ID旁证https://github.com/yuhkix/wuwa-ids，中文名称可核对官方WIKI。只取事实字段，没有下载或绑定网络图片。Cache规则依据https://developers.cloudflare.com/pages/configuration/headers/；公开参考脚本仅审查未执行。
''')
p=R/'docs/convene-optimization.md';old=p.read_text('utf-8')
if not old.startswith('> 历史'):put(p,'> 历史任务记录（2026-10-20）。当前最新结果见convene-resource-management.md：64角色/62资源ID、114武器识别、手动固定封面。本文旧“空武器目录”和自动主封面仅为当时状态。\n\n'+old)
print('Updated centralized file naming, complete missing-art list, cover instructions and current maintenance documentation.')
