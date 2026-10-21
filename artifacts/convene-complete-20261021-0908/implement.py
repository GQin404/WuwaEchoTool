from pathlib import Path
import json
R=Path.cwd()
def put(p,t):p.write_text(t,encoding='utf-8',newline='\n')
p=R/'convene.html';t=p.read_text('utf-8');t=t.replace('<script src="js/convene-assets.js">','<script src="js/character-catalog.js"></script><script src="js/convene-covers.js"></script><script src="js/convene-windows.js"></script><script src="js/convene-assets.js">');put(p,t)
p=R/'js/convene-ui.js';t=p.read_text('utf-8')
def fn(name,code):
 global t
 a=t.index('function '+name+'(');b=t.index('\n',a);t=t[:a]+code.strip()+t[b:]
fn('poolCards',r'''function poolCards(s,featured=false){const entries=featured?[1,2].map(id=>s.pools.find(p=>p.pool===id)||{pool:id,total:0,five:[],rule:{hard:80},pity:null,observed:0,absent:true}):[...s.pools].sort((a,b)=>a.pool-b.pool);return '<div class="cv-pools'+(featured?' cv-featured-pools':'')+'">'+entries.map(p=>{const last=assets.latest(s,p.pool),art=last?assets.artwork(last):{src:p.pool===2?WeaponPortraits.FALLBACK:ConveneAssets.CHARACTER_FALLBACK,fallback:p.pool===2?WeaponPortraits.FALLBACK:ConveneAssets.CHARACTER_FALLBACK,hasArtwork:false,kind:p.pool===2?'weapon':'character'},cover=ConveneCovers.resolve(p.pool,art,{featured}),intervals=p.five.filter(f=>f.interval!=null),avg=mean(intervals.map(f=>f.interval));return '<section class="cv-card cv-pool-card'+(featured?' cv-featured-pool':'')+'" data-pool-card="'+p.pool+'"><div class="cv-pool-art" data-cover-pool="'+p.pool+'" data-cover-item="'+esc(last?.item||'')+'" data-cover-mode="'+cover.mode+'" data-art="'+cover.mode+'"><img src="'+esc(cover.src)+'" data-fallbacks="'+esc(JSON.stringify(cover.fallbacks))+'" alt="'+esc(featured?t(p.pool===1?'featuredCharacterCover':'featuredWeaponCover'):last?display(last):t(art.kind==='weapon'?'weaponArt':'artMissing'))+'" fetchpriority="'+(featured?'high':'auto')+'"></div><div class="cv-pool-copy"><div class="cv-eyebrow">'+(p.pool===1?'01 / RESONATOR':p.pool===2?'02 / WEAPON':'ARCHIVE / '+p.pool)+'</div><div class="cv-section-heading"><h3>'+esc(poolName(p.pool))+'</h3><span class="cv-gold">'+p.five.length+' ★</span></div><div class="cv-pool-total">'+p.total+' <small>'+esc(t('total'))+'</small></div><div class="cv-pool-average"><span>'+esc(t('avg'))+'</span><strong>'+n(avg)+'</strong></div><div class="cv-pity-line"><span>'+esc(t('pity'))+'</span><strong>'+(p.absent?'—':!p.rule.hard?esc(t('unknown')):p.pity==null?'≥ '+p.observed:p.pity)+(p.rule.hard&&!p.absent?' <small>/ '+p.rule.hard+'</small>':'')+'</strong></div>'+(p.rule.hard&&!p.absent?'<progress max="'+p.rule.hard+'" value="'+Math.min(p.rule.hard,p.pity??p.observed)+'"></progress>':'<small>'+esc(t(p.absent?'poolNotImported':'unsupportedRule'))+'</small>')+(last?'<div class="cv-pool-latest"><div><small>'+esc(t('latest'))+'</small><strong>'+esc(display(last))+'</strong><time>'+esc(last.time.slice(0,10))+'</time><span class="cv-latest-interval">'+esc(last.interval==null?last.observed==null?'—':'≥ '+last.observed:last.interval)+' '+esc(t('interval'))+'</span></div></div>':'')+'<small class="cv-art-caption" data-art-note>'+esc(featured?t('manualCover'):!art.hasArtwork?t(art.kind==='weapon'?'weaponPlaceholder':'characterPlaceholder'):'')+'</small>'+(p.pool===1||p.pool===2?button('analyzePool','data-focus-pool="'+p.pool+'" class="cv-text-button"'):'')+'</div></section>';}).join('')+'</div>';}
''')
# Latest request prioritizes featured pools and core statistics before overall rating.
t=t.replace("return '<div class=\"cv-overview\">'+hero(s)+'<section", "return '<div class=\"cv-overview\"><section")
t=t.replace("+poolCards(s,true)+'</section><section class=\"cv-card cv-latest-featured\">'", "+poolCards(s,true)+'</section>'+metrics(s)+hero(s)+'<section class=\"cv-card cv-latest-featured\">'")
# The literal includes a nested heading; use exact boundary independent of subsequent content.
if "poolCards(s,true)+'</section>'+metrics(s)+hero(s)" not in t:
 t=t.replace("+poolCards(s,true)+'</section><section class=\"cv-card cv-latest-featured\"><div", "+poolCards(s,true)+'</section>'+metrics(s)+hero(s)+'<section class=\"cv-card cv-latest-featured\"><div")
t=t.replace("+poolCards({pools:other})+'</details>'+metrics(s)+'<div", "+poolCards({pools:other})+'</details><div")
assert "poolCards(s,true)+'</section>'+metrics(s)+hero(s)" in t
# Bounded ordered fallbacks: manual -> latest asset -> category. No loops on a failed placeholder.
a=t.index("host.addEventListener('error'");b=t.index('\n',a)
t=t[:a]+r'''host.addEventListener('error',e=>{const image=e.target;if(image.tagName!=='IMG')return;let queue=[];try{queue=image.dataset.fallbacks?JSON.parse(image.dataset.fallbacks):image.dataset.fallback&&!image.dataset.fallbackTried?[image.dataset.fallback]:[];}catch(_){}const next=queue.shift();image.dataset.fallbacks=JSON.stringify(queue);image.dataset.fallbackTried='1';if(next&&next!==image.getAttribute('src')){image.src=next;const cover=image.closest('[data-cover-pool]');if(cover){cover.dataset.art=next.endsWith('.svg')?'placeholder':'mapped';cover.dataset.coverMode='fallback';const note=cover.parentElement.querySelector('[data-art-note]');if(note)note.textContent=t('coverFallback');}if(image.closest('.cv-character-art'))image.parentElement.classList.add('cv-portrait-fallback');return;}if(image.closest('.cv-character-art')){const box=document.createElement('div');box.className='cv-portrait-fallback';box.textContent=t('artMissing');image.replaceWith(box);}else{const box=document.createElement('span');box.className='cv-image-unavailable';box.textContent=t('artMissing');image.replaceWith(box);}},true);'''+t[b:]
fn('guideView',r'''function guideView(){const platform=guidePlatform,windows=platform==='windows',keys=windows?['psStep1','psStep2','psStep3','psStep4']:platform==='android'?['android1','android2','android3','android4']:platform==='ios'?['ios1','ios2','ios3']:['other1','other2'];return '<p class="cv-guide-intro">'+esc(t('guideIntro'))+'</p><div class="cv-platform-tabs">'+['windows','android','ios','other'].map(v=>'<button type="button" data-guide-platform="'+v+'" aria-pressed="'+(v===platform)+'">'+esc(t({windows:'guideWindows',android:'guideAndroid',ios:'guideIOS',other:'guideOther'}[v]))+'</button>').join('')+'</div><figure class="cv-guide-diagram"><div>'+['guideOpen','guideHistory',windows?'psCommand':'guideLink','guideImport'].map((k,i)=>'<span><b>0'+(i+1)+'</b>'+esc(t(k))+'</span>').join('')+'</div><figcaption>'+esc(t('originalDiagram'))+'</figcaption></figure>'+(windows?'':'<p class="cv-guide-unverified">'+esc(t('platformUnverified'))+'</p>')+'<ol class="cv-guide-steps">'+keys.map(k=>'<li>'+esc(t(k))+'</li>').join('')+'</ol>'+(windows?'<section class="cv-windows-methods"><div class="cv-eyebrow">POWERSHELL / LOCAL ONLY</div><h3>'+esc(t('psTitle'))+'</h3><p>'+esc(t('psScope'))+'</p><div class="cv-actions">'+button('psCopy','data-copy-windows class="cv-primary"')+button('psDownload','data-download-windows')+'</div><p data-command-status role="status"></p><details class="cv-command-details"><summary>'+esc(t('psInspect'))+'</summary><textarea readonly spellcheck="false" aria-label="'+esc(t('psCommand'))+'" data-windows-command>'+esc(ConveneWindows.command)+'</textarea></details><details class="cv-log-backup"><summary>'+esc(t('windowsLocal'))+'</summary><p>'+esc(t('quickWindowsHelp'))+'</p><label class="cv-log-choice">'+esc(t('chooseLogFolder'))+'<input type="file" data-guide-folder webkitdirectory directory multiple></label><p>Client/Saved/Logs/Client.log<br>Client/Binaries/Win64/ThirdParty/KrPcSdk_Global/KRSDKRes/KRSDKWebView/debug.log</p><label class="cv-log-choice">'+esc(t('log'))+'<input type="file" data-guide-log accept=".log,.txt"></label></details><details class="cv-script-review"><summary>'+esc(t('psSource'))+'</summary><p>'+esc(t('psRisk'))+'</p><a href="'+ConveneWindows.reference+'" target="_blank" rel="noopener noreferrer">WuWa Tracker · 747a48b · 2026-10-21</a></details><p>'+esc(t('windowsValidation'))+'</p><div class="cv-video-slot"><span aria-hidden="true">▤</span><div><h4>'+esc(t('videoSoon'))+'</h4><small>'+esc(t('videoSoonHelp'))+'</small></div></div></section>':'')+'<div class="cv-guide-faq">'+[['faqRegion','faqRegionText'],['faqExpired','faqExpiredText'],['faqFailed','faqFailedText'],['faqArchive','faqArchiveText']].map(([q,a])=>'<details><summary>'+esc(t(q))+'</summary><p>'+esc(t(a))+'</p></details>').join('')+'</div><div class="cv-actions">'+button('backImport','data-back-import class="cv-primary"')+'</div>';}
''')
t=t.replace("info.addEventListener('click',e=>{", "info.addEventListener('click',async e=>{")
needle="if(button.dataset.atlasKind)"
assert needle in t
t=t.replace(needle,"if(button.hasAttribute('data-copy-windows')){try{await navigator.clipboard.writeText(ConveneWindows.command);info.querySelector('[data-command-status]').textContent=t('psCopied');}catch(_){const box=info.querySelector('[data-windows-command]');box.closest('details').open=true;box.focus();box.select();info.querySelector('[data-command-status]').textContent=t('psCopyManual');}return;}if(button.hasAttribute('data-download-windows')){download(ConveneWindows.command,'WuwaEchoTool-read-history.ps1','text/plain;charset=utf-8');return;}"+needle)
# Empty successful result must not be described as an invalid URL. Existing failure classifications remain.
needle="await reload();"
# Locate the import-only call without affecting reload callers.
line=next(x for x in t.splitlines()if x.startswith("host.addEventListener('submit'"))
if 'await reload();' in line:
 replacement=line.replace('await reload();',"await reload();if(!result.failed.length&&!result.cancelled&&result.added===0&&result.duplicates===0)status(t('emptyResult'));")
 t=t.replace(line,replacement)
put(p,t)
p=R/'js/convene-i18n.js';t=p.read_text('utf-8');marker='return {rows,'
# Insert before the final exported factory, without redefining existing keys elsewhere.
at=t.rfind('return {');assert at>=0
messages={
'manualCover':['手動維護封面 · 與個人取得紀錄無關','手动维护封面 · 与个人取得记录无关','Manual cover · independent of your pulls'],
'featuredCharacterCover':['手動限定角色封面','手动限定角色封面','Manual featured Resonator cover'],
'featuredWeaponCover':['手動限定武器封面','手动限定武器封面','Manual featured Weapon cover'],
'coverFallback':['封面缺失 · 顯示最近取得圖片或類別佔位','封面缺失 · 显示最近取得图片或类别占位','Cover unavailable · latest artwork or category fallback'],
'psTitle':['簡單取得 · PowerShell','简单获取 · PowerShell','Quick access · PowerShell'],
'psCommand':['PowerShell 命令','PowerShell 命令','PowerShell command'],
'psCopy':['複製 PowerShell 命令','复制 PowerShell 命令','Copy PowerShell command'],
'psDownload':['下載本地腳本','下载本地脚本','Download local script'],
'psInspect':['查看完整命令（可先審查）','查看完整命令（可先审查）','Inspect the full command'],
'psScope':['本站命令只讀本機日誌並把網址複製到剪貼簿；不聯網、不改遊戲設定、不要求管理員。','本站命令只读本机日志并把网址复制到剪贴板；不联网、不改游戏设置、不要求管理员。','This local reader only reads logs and copies the URL. No network, game changes, or administrator rights.'],
'psStep1':['在遊戲開啟喚取歷史，保留遊戲執行。','在游戏打开唤取历史，保持游戏运行。','Open Convene History in game and keep the game running.'],
'psStep2':['複製下方命令，開啟 Windows PowerShell，先查看命令再貼上執行。','复制下方命令，打开 Windows PowerShell，先查看命令再粘贴执行。','Copy the command below, inspect it, then paste it into Windows PowerShell.'],
'psStep3':['自動尋找執行中的遊戲；無法取得路徑時，貼上遊戲資料夾或 Client.log 路徑。','自动查找运行中的游戏；无法取得路径时，粘贴游戏文件夹或 Client.log 路径。','It checks the running game. If unavailable, paste your game folder or Client.log path.'],
'psStep4':['看到複製成功後，回到本工具貼上網址並匯入。請勿公開該連結。','看到复制成功后，返回本工具粘贴网址并导入。请勿公开该链接。','After the copied message, return here, paste the URL and import. Keep the link private.'],
'psSource':['來源核查與第三方腳本風險','来源核查与第三方脚本风险','Source review and third-party risks'],
'psRisk':['已核查 WuWa Tracker 固定版本的日誌/XOR流程；其腳本另含設定寫入與提權分支，本站未使用，也不下載執行。遠端腳本可能更新，請勿直接執行不理解的命令。','已核查 WuWa Tracker 固定版本的日志/XOR流程；其脚本另含设置写入与提权分支，本站未使用，也不下载执行。远程脚本可能更新，请勿直接执行不理解的命令。','The pinned Tracker log/XOR flow was reviewed. Its configuration-writing and elevation branches are not used or executed here. Remote scripts can change; inspect commands before running them.'],
'psCopied':['命令已複製；到 PowerShell 貼上執行。','命令已复制；到 PowerShell 粘贴执行。','Command copied. Paste into PowerShell.'],
'psCopyManual':['請在命令框按 Ctrl+C 複製。','请在命令框按 Ctrl+C 复制。','Press Ctrl+C in the selected command box.'],
'emptyResult':['連線成功，但官方未返回紀錄。請確認遊戲帳號與歷史可見範圍；原紀錄保留。','连接成功，但官方未返回记录。请确认游戏账号与历史可见范围；原记录保留。','Connected, but the API returned no records. Check the game account and available history; existing data is kept.'],
'rScopeHelp':['區間效率包含錨點至目標間所有抽取（含其他角色及歪出），不是「為此角色花費」。僅比較相同 R 與相同口徑；實際活動投入未知。','区间效率包含锚点至目标间所有抽取（含其他角色及歪出），不是“为此角色花费”。仅比较相同 R 与相同口径；实际活动投入未知。','Window efficiency includes all pulls between anchor and target, including other characters and losses. It is not spending for this character. Compare only identical R targets and scopes; banner spending is unknown.']}
t=t[:at]+'Object.assign(rows,'+json.dumps(messages,ensure_ascii=False,separators=(',',':'))+');\n'+t[at:];put(p,t)
p=R/'js/convene-service.js';t=p.read_text('utf-8');old="const clean=text.trim().replace(/[ \\t]*[\\r\\n]+[ \\t]*/g,'').replace(/\\t/g,'');let u;";assert old in t
new="const clean=text.trim().replace(/^<([^<>]+)>$/,'$1').replace(/^\\[[^\\]]*\\]\\((https:\\/\\/[^)]+)\\)$/,'$1').replace(/&amp;/gi,'&').replace(/\\\\&/g,'&').replace(/[ \\t]*[\\r\\n]+[ \\t]*/g,'').replace(/\\t/g,'');let u;"
t=t.replace(old,new);put(p,t)
p=R/'_headers';t=p.read_text('utf-8');t+='\n/image/convene-current/*\n  Cache-Control: no-cache, must-revalidate\n';put(p,t)
p=R/'css/convene.css';t=p.read_text('utf-8');t+='''
/* Featured editorial covers: identity statistics stay separate from the replaceable art. */
#convene-app .cv-featured-pool{min-height:480px}
#convene-app .cv-featured-pool .cv-pool-art{width:48%;bottom:20px;top:38px;right:0}
#convene-app .cv-featured-pool .cv-pool-art img{width:100%;height:100%;object-fit:contain;object-position:center bottom;filter:drop-shadow(0 10px 22px #0005)}
#convene-app .cv-featured-pool .cv-pool-copy{width:55%;position:relative;z-index:1}
#convene-app .cv-featured-pool .cv-art-caption{font-size:10px;line-height:1.5;margin-top:12px;opacity:.78}
#convene-info .cv-command-details textarea{display:block;box-sizing:border-box;width:100%;min-height:260px;max-height:42vh;resize:vertical;white-space:pre;font:12px/1.6 Consolas,monospace;background:#0b191d;color:#cfdfd6;border:1px solid #3c5d59;border-radius:10px;padding:14px;margin-top:14px;overflow:auto}
#convene-info .cv-windows-methods>.cv-actions{justify-content:flex-start;flex-wrap:wrap}
#convene-info [data-command-status]:empty{display:none}
#convene-app .cv-image-unavailable{display:grid;place-items:center;min-height:60px;font-size:12px;color:#abc2bc}
@media(min-width:701px) and (max-width:1000px){#convene-app .cv-featured-pool{min-height:450px}#convene-app .cv-featured-pool .cv-pool-copy{width:58%}#convene-app .cv-featured-pool .cv-pool-art{width:44%;opacity:.92}}
@media(max-width:700px){#convene-app .cv-featured-pool{min-height:0}#convene-app .cv-featured-pool .cv-pool-art{position:relative;inset:auto;width:100%;height:300px;margin:-12px 0 8px}#convene-app .cv-featured-pool .cv-pool-art img{object-position:center center}#convene-app .cv-featured-pool .cv-pool-copy{width:100%}#convene-app .cv-featured-pool .cv-art-caption{font-size:11px}#convene-info .cv-command-details textarea{font-size:11px;padding:10px}#convene-info .cv-windows-methods>.cv-actions button{min-height:44px;flex:1}}
''';put(p,t)
print('Updated UI, fixed-cover cascade, copyable local reader, URL copy normalization and responsive styles.')
