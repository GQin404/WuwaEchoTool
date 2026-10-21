(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-core.js'));else root.ConveneMessages=factory(root.ConveneCore);})(typeof globalThis!=='undefined'?globalThis:this,function(){
const rows={
 title:['喚取紀錄','唤取记录','Convene archive'],subtitle:['記下每一次共鳴','记下每一次共鸣','EVERY RESONANCE, REMEMBERED'],overview:['總覽','总览','Overview'],history:['歷史紀錄','历史记录','History'],pools:['卡池分析','卡池分析','Pools'],characters:['角色分析','角色分析','Resonators'],data:['匯入與資料','导入与数据','Import & data'],account:['帳號','账号','Account'],empty:['尚無喚取紀錄','尚无唤取记录','No convenes archived'],start:['導入你的第一段共鳴旅程','导入你的第一段共鸣旅程','Bring your resonance journey into focus'],local:['紀錄僅保存在此瀏覽器；請定期匯出備份。','记录仅保存在此浏览器；请定期导出备份。','Stored in this browser. Export backups regularly.'],import:['匯入紀錄','导入记录','Import history'],url:['遊戲喚取紀錄網址','游戏唤取记录网址','In-game Convene History URL'],server:['伺服器','服务器','Server'],auto:['自動辨識','自动识别','Detect automatically'],global:['國際服','国际服','Global'],cn:['中國大陸官方服','中国大陆官方服','China official'],direct:['直接連線（受 CORS 限制）','直接连接（受 CORS 限制）','Direct connection (requires CORS)'],extra:['額外卡池 ID（選填，9–20，逗號分隔）','额外卡池 ID（选填，9–20，逗号分隔）','Additional pool IDs (optional, 9–20, comma separated)'],stop:['停止','停止','Stop'],guide:['如何取得網址','如何取得网址','Get a history URL'],guideText:['Windows：先在遊戲開啟喚取歷史，再選擇 Client/Saved/Logs/Client.log；只在本機解碼所選檔案。亦可依 WuWa Tracker 教學取得網址。其他平台請使用該教學的對應流程；未在本專案實機驗證。網址授權可能失效，請重新開啟遊戲歷史取得新連結。','Windows：先在游戏打开唤取历史，再选择 Client/Saved/Logs/Client.log；只在本机解码所选文件。也可按 WuWa Tracker 教学取得网址。其他平台请使用该教学的对应流程；未在本项目实机验证。网址授权可能失效，请重新打开游戏历史取得新链接。','Windows: open Convene History in-game, then select Client/Saved/Logs/Client.log. Only your chosen file is decoded locally. Alternatively follow WuWa Tracker’s guide. Other platforms: use its platform-specific instructions (not device-tested here). Authorization can expire; open game history again for a fresh link.'],log:['選擇 Windows 日誌','选择 Windows 日志','Select Windows log'],networkNote:['需部署已設定限流的 Pages Function，或官方端點允許 CORS；本機預覽不代表官方授權已驗證。','需部署已配置限流的 Pages Function，或官方端点允许 CORS；本地预览不代表官方授权已验证。','Requires a rate-limited Pages Function, or upstream CORS permission. Local preview does not verify official authorization.'],total:['累計抽數','累计抽数','Archived pulls'],five:['五星總數','五星总数','Five-star results'],avg:['平均五星間隔','平均五星间隔','Mean 5★ interval'],fast:['最快間隔','最快间隔','Fastest interval'],slow:['最晚間隔','最晚间隔','Longest interval'],observing:['運勢待觀測','运势待观测','Fortune under observation'],fate:['天命共鳴者','天命共鸣者','Resonance of Destiny'],star:['星運眷顧者','星运眷顾者','Favored by Starlight'],lucky:['幸運同行者','幸运同行者','Fortune’s Companion'],steady:['平穩共鳴者','平稳共鸣者','Steady Resonance'],headwind:['逆風漂泊者','逆风漂泊者','Against the Current'],abyss:['深淵守望者','深渊守望者','Watcher of the Abyss'],score:['運勢指數','运势指数','Fortune index'],samples:['有效間隔樣本','有效间隔样本','Verified intervals'],confidence:['樣本可信度','样本可信度','Sample confidence'],low:['樣本有限','样本有限','Limited sample'],established:['已有參考樣本','已有参考样本','Established sample'],coverage:['首段歷史未知；可能有未存檔區間。','首段历史未知；可能有未存档区间。','The initial history is unknown; unarchived gaps may exist.'],unknown:['無法確認','无法确认','Unknown'],pity:['目前保底進度','当前保底进度','Current pity'],atLeast:['至少','至少','At least'],gaps:['未銜接區段','未衔接区段','Unjoined segments'],updated:['最後更新','最后更新','Last updated'],limited:['限定結果（玩家確認）','限定结果（玩家确认）','Limited outcomes (user confirmed)'],win:['非保證命中','非保证命中','Won chance'],loss:['非限定結果','非限定结果','Off-banner'],guarantee:['保證命中','保证命中','Guaranteed'],resultHelp:['接口未提供足夠 UP／保證資訊。只在確知當次遊戲結果時手動標記；保證命中不計入勝率，缺失結果不猜測。','接口未提供足够 UP／保证信息。只在确知当次游戏结果时手动标记；保证命中不计入胜率，缺失结果不猜测。','The API does not establish the featured target or guarantee state. Annotate only known in-game results. Guaranteed results are excluded from win rate; unknown results stay unknown.'],winRate:['可確認勝率','可确认胜率','Confirmed chance win rate'],latest:['最近五星','最近五星','Latest five-star'],distribution:['五星間隔分布','五星间隔分布','5★ interval distribution'],trend:['每月抽取趨勢','每月抽取趋势','Monthly pull activity'],all:['全部','全部','All'],filters:['篩選','筛选','Filters'],search:['角色／武器名稱或 ID','角色／武器名称或 ID','Resonator / weapon name or ID'],from:['開始日期','开始日期','From'],to:['結束日期','结束日期','To'],rarity:['稀有度','稀有度','Rarity'],pool:['卡池','卡池','Pool'],kind:['類型','类型','Type'],character:['角色','角色','Resonator'],weaponKind:['武器','武器','Weapon'],reset:['重設','重设','Reset'],previous:['上一頁','上一页','Previous'],next:['下一頁','下一页','Next'],date:['取得時間','取得时间','Acquired'],interval:['五星間隔','五星间隔','5★ interval'],name:['物品','物品','Item'],share:['分享戰績','分享战绩','Share report'],compact:['簡略版','简略版','Compact'],detailed:['詳細版','详细版','Detailed'],masked:['顯示遮蔽 UID','显示遮蔽 UID','Show masked UID'],download:['下載 PNG','下载 PNG','Download PNG'],close:['關閉','关闭','Close'],export:['匯出唤取備份','导出唤取备份','Export archive'],restore:['合併備份','合并备份','Merge backup'],backupNote:['僅追加合併，不刪除較早紀錄。完整資料管理備份也會包含喚取紀錄。','仅追加合并，不删除较早记录。完整数据管理备份也会包含唤取记录。','Backups merge without deleting older records. The full data-management backup includes this archive too.'],acquired:['取得次數','取得次数','Times acquired'],characterNote:['此處為角色取得時的五星間隔，不等於為此角色花費的總抽數。','此处为角色取得时的五星间隔，不等于为此角色花费的总抽数。','These are 5★ intervals at acquisition, not total pulls spent for this character.'],bannerSpend:['角色活動卡池投入：接口資訊不足，無法可靠重建。','角色活动卡池投入：接口信息不足，无法可靠重建。','Banner spending: the API cannot reliably reconstruct event-level investment.'],none:['沒有符合條件的紀錄','没有符合条件的记录','No matching records'],one:['一發入魂','一发入魂','One-pull Resonance'],ten:['十抽奇蹟','十抽奇迹','Ten-pull Miracle'],pityAch:['保底常客','保底常客','At the Threshold'],streak:['連續好運','连续好运','Fortune in Sequence'],comeback:['逆風翻盤','逆风翻盘','Turning the Tide'],consecutive:['五星連發','五星连发','Consecutive Stars'],achievements:['共鳴成就','共鸣成就','Resonance achievements'],formula:['評級說明','评级说明','How the rating works'],formulaText:['出金運 = 各有效間隔的 100 ×（該池硬保底 − 間隔）÷（硬保底 − 1）平均。有限定確認樣本時，以 80% 出金運 + 20% 非保證命中率合成。至少 10 個有效間隔與 300 抽才授予稱號；最高階另需 30 間隔與 10 次確認機會。這是娛樂性速度指數，不是玩家百分位；可信度不加分。首段、缺口及規則未知池不計分。','出金运 = 各有效间隔的 100 ×（该池硬保底 − 间隔）÷（硬保底 − 1）平均。有限定确认样本时，以 80% 出金运 + 20% 非保证命中率合成。至少 10 个有效间隔与 300 抽才授予称号；最高阶另需 30 间隔与 10 次确认机会。这是娱乐性速度指数，不是玩家百分位；可信度不加分。首段、缺口及规则未知池不计分。','Draw luck averages 100 × (pool hard pity − interval) / (hard pity − 1). With confirmed chance outcomes, the index combines 80% draw luck and 20% win rate. Titles require 10 valid intervals and 300 pulls; the top tier also needs 30 intervals and 10 confirmed chances. An entertainment speed index, not a player percentile. Confidence adds no points. Initial, gapped and unknown-rule intervals are excluded.'],imported:['匯入完成','导入完成','Import completed'],added:['新增','新增','New'],duplicates:['重複','重复','Duplicates'],failed:['失敗卡池','失败卡池','Failed pools'],cancelled:['已停止；已成功保存的卡池仍保留。','已停止；已成功保存的卡池仍保留。','Stopped. Successfully saved pools are preserved.'],saved:['備份已合併','备份已合并','Backup merged'],busy:['讀取卡池','读取卡池','Reading pool'],noData:['官方返回空紀錄；舊存檔仍保留。','官方返回空记录；旧存档仍保留。','The API returned no records. Older archives are preserved.'],privacy:['本地存檔 · 不含授權資訊','本地存档 · 不含授权信息','LOCAL ARCHIVE · NO CREDENTIALS'],sample:['測試資料 · 非真實帳號','测试数据 · 非真实账号','TEST FIXTURE · NOT A REAL ACCOUNT'],unsupportedRule:['此池規則待驗證；不參與保底上限或運勢評分。','此池规则待验证；不参与保底上限或运势评分。','Pool rules unverified; excluded from pity limits and fortune scoring.'],warning:['出現超出規則範圍的紀錄，請檢查缺口或規則版本。','出现超出规则范围的记录，请检查缺口或规则版本。','A result exceeds the rule limits. Check gaps or rule versions.'],limitedPool:['限定角色','限定角色','Featured Resonator'],weaponPool:['限定武器','限定武器','Featured Weapon'],standardPool:['常駐角色','常驻角色','Standard Resonator'],standardWeaponPool:['常駐武器','常驻武器','Standard Weapon'],novicePool:['新手喚取','新手唤取','Novice Convene'],choicePool:['新手自選','新手自选','Beginner’s Choice'],giftPool:['自選贈禮（待核對）','自选赠礼（待核对）','Selector gift (unverified)'],unknownPool:['未知規則卡池','未知规则卡池','Unverified pool'],INVALID_URL:['網址無效或伺服器選擇衝突，請貼上遊戲歷史完整網址。','网址无效或服务器选择冲突，请粘贴游戏历史完整网址。','Invalid URL or conflicting region. Paste the full in-game history URL.'],AUTH_OR_API:['官方拒絕請求；授權可能過期，請重新取得連結。','官方拒绝请求；授权可能过期，请重新取得链接。','The API rejected the request. Authorization may have expired; get a fresh link.'],NETWORK:['連線失敗；請檢查網路、代理部署及 CORS。','连接失败；请检查网络、代理部署及 CORS。','Connection failed. Check network, proxy deployment and CORS.'],TIMEOUT:['請求逾時；請稍後重試。','请求超时；请稍后重试。','Request timed out. Try again later.'],PROXY_REQUIRED:['此站未啟用查詢代理。請部署 Pages Function 或嘗試直接連線。','此站未启用查询代理。请部署 Pages Function 或尝试直接连接。','The query proxy is unavailable. Deploy the Pages Function or try direct connection.'],RATE_LIMIT:['請求過於頻繁，請一分鐘後重試。','请求过于频繁，请一分钟后重试。','Too many requests. Retry in one minute.'],INVALID_RESPONSE:['回應格式不支援，未保存此池；請更新接口定義。','响应格式不支持，未保存此池；请更新接口定义。','Unsupported response. This pool was not saved; update the adapter.'],BATCH_CONFLICT:['相同時間批次發生衝突，已保留原存檔，未猜測合併。','相同时间批次发生冲突，已保留原存档，未猜测合并。','A timestamp batch conflicts. The old archive is preserved; no speculative merge.'],STORAGE_FAILED:['無法寫入儲存空間；請先備份，檢查配額或私人瀏覽限制。','无法写入存储空间；请先备份，检查配额或隐私浏览限制。','Storage unavailable. Back up first; check quota or private browsing restrictions.'],INVALID_BACKUP:['備份格式損壞，原資料未變更。','备份格式损坏，原数据未变更。','Invalid backup. Existing data is unchanged.'],UNSUPPORTED_BACKUP:['備份版本不支援，原資料未變更。','备份版本不支持，原数据未变更。','Unsupported backup version. Existing data is unchanged.'],NO_URL:['日誌中未找到支援的歷史網址，請先在遊戲開啟歷史。','日志中未找到支持的历史网址，请先在游戏打开历史。','No supported history URL found. Open history in-game first.'],FILE_TOO_LARGE:['檔案過大，請選擇較新的日誌或較小備份。','文件过大，请选择较新的日志或较小备份。','File too large. Select a newer log or smaller backup.'],IMAGE_FAILED:['圖片產生失敗，請重試或檢查圖片資源。','图片生成失败，请重试或检查图片资源。','Image generation failed. Retry or check image assets.']
};
Object.assign(rows,{guideLink:['取得官方連結','取得官方链接','Get official link'],windowsReference:['Windows 日誌協定參考','Windows 日志协议参考','Windows log protocol reference'],androidReference:['Android 公開 Ascent 方法','Android 公开 Ascent 方法','Android public Ascent method'],platformReference:['公開平台方法研究參考','公开平台方法研究参考','Public platform research reference']});
Object.assign(rows,{
  "fortune": [
    "星運評定",
    "星运评定",
    "FORTUNE RESONANCE"
  ],
  "update": [
    "匯入 / 更新",
    "导入 / 更新",
    "Import / update"
  ],
  "data": [
    "資料管理",
    "数据管理",
    "Data management"
  ],
  "autoSource": [
    "自動辨識來源與伺服器",
    "自动辨识来源与服务器",
    "Source and server detected automatically"
  ],
  "importHint": [
    "貼上遊戲歷史網址，開始保存你的共鳴旅程。",
    "粘贴游戏历史网址，开始保存你的共鸣旅程。",
    "Paste your in-game history URL to archive your journey."
  ],
  "startImport": [
    "開始匯入",
    "开始导入",
    "Start import"
  ],
  "advanced": [
    "進階連線設定",
    "高级连接设置",
    "Advanced connection settings"
  ],
  "detected": [
    "已辨識來源",
    "已识别来源",
    "Detected source"
  ],
  "processed": [
    "已處理紀錄",
    "已处理记录",
    "Processed records"
  ],
  "partial": [
    "部分卡池未完成；成功紀錄已保存。",
    "部分卡池未完成；成功记录已保存。",
    "Some pools could not finish. Successful records are saved."
  ],
  "ratingRules": [
    "查看評級規則",
    "查看评级规则",
    "Rating rules"
  ],
  "personalBreakdown": [
    "你的評分來源",
    "你的评分来源",
    "Your rating breakdown"
  ],
  "drawLuck": [
    "出金運",
    "出金运",
    "Draw luck"
  ],
  "limitedLuck": [
    "限定運",
    "限定运",
    "Limited luck"
  ],
  "weight": [
    "權重",
    "权重",
    "Weight"
  ],
  "eligiblePulls": [
    "相關池抽數",
    "相关池抽数",
    "Eligible pool pulls"
  ],
  "opportunities": [
    "確認的非保證機會",
    "确认的非保证机会",
    "Confirmed chance outcomes"
  ],
  "excluded": [
    "未納入評分的五星",
    "未纳入评分的五星",
    "Excluded five-star intervals"
  ],
  "reason.noIntervals": [
    "還沒有完整、規則已知的五星間隔；首段不推定為完整。",
    "还没有完整、规则已知的五星间隔；首段不推定为完整。",
    "No complete interval with verified pool rules yet. The first segment is censored."
  ],
  "reason.smallSample": [
    "有效間隔或相關池抽數未達門檻，先觀察而不授予長期稱號。",
    "有效间隔或相关池抽数未达门槛，先观察而不授予长期称号。",
    "Valid intervals or eligible pulls are below the threshold. A long-term title is withheld."
  ],
  "reason.topGate": [
    "分數已達最高區間，但最高階的有效間隔或確認機會不足。",
    "分数已达最高区间，但最高阶的有效间隔或确认机会不足。",
    "The score reaches the top band, but its interval or confirmed-outcome requirement is unmet."
  ],
  "reason.qualified": [
    "樣本門檻已達成，依未四捨五入的分數判定稱號。",
    "样本门槛已达成，依未四舍五入的分数判定称号。",
    "The sample threshold is met. The title uses the unrounded score."
  ],
  "threshold": [
    "稱號門檻",
    "称号门槛",
    "Title requirements"
  ],
  "topThreshold": [
    "最高階額外門檻",
    "最高阶额外门槛",
    "Additional top-tier requirements"
  ],
  "speedFormula": [
    "H 為該池硬保底，N 為完整五星間隔；各有效間隔速度分數取平均。",
    "H 为该池硬保底，N 为完整五星间隔；各有效间隔速度分数取平均。",
    "H is pool hard pity and N a complete five-star interval. Valid interval scores are averaged."
  ],
  "chanceFormula": [
    "非保證命中 ÷（非保證命中 + 非限定結果）× 100；保證與未知不計入。",
    "非保证命中 ÷（非保证命中 + 非限定结果）× 100；保证与未知不计入。",
    "Chance wins / (chance wins + off-banner results) × 100. Guaranteed and unknown results are excluded."
  ],
  "noChance": [
    "沒有確認的非保證結果時，只使用出金運，不以 0 分替代未知。",
    "没有确认的非保证结果时，只使用出金运，不以 0 分替代未知。",
    "Without confirmed chance outcomes, draw luck carries the full weight. Unknown is not zero."
  ],
  "confidenceRule": [
    "可信度只控制稱號展示，不提供運氣加分。首段、跨缺口和未知規則不推算精確間隔。",
    "可信度只控制称号展示，不提供运气加分。首段、跨缺口和未知规则不推算精确间隔。",
    "Confidence controls title eligibility, never adds luck points. Initial, gapped and unknown-rule intervals are not inferred."
  ],
  "entertainment": [
    "娛樂性速度指數，並非全服機率百分位。",
    "娱乐性速度指数，并非全服概率百分位。",
    "An entertainment speed index, not a population percentile."
  ],
  "fate.desc": [
    "共鳴近乎應聲而至，星光為你匯聚。",
    "共鸣近乎应声而至，星光为你汇聚。",
    "Resonance answers your call; the stars converge."
  ],
  "star.desc": [
    "星光頻頻回應，旅程總有驚喜。",
    "星光频频回应，旅程总有惊喜。",
    "Starlight answers often. Surprise follows your path."
  ],
  "lucky.desc": [
    "與好運同行，珍貴的共鳴不時到來。",
    "与好运同行，珍贵的共鸣不时到来。",
    "Fortune travels beside you, bringing welcome echoes."
  ],
  "steady.desc": [
    "共鳴有早有晚，步調平穩前行。",
    "共鸣有早有晚，步调平稳前行。",
    "Early or late, every resonance carries you forward."
  ],
  "headwind.desc": [
    "偶爾要多等一會，仍在向下一道星光前進。",
    "偶尔要多等一会，仍在向下一道星光前进。",
    "A longer wait sometimes, with another light ahead."
  ],
  "abyss.desc": [
    "漫長的等待也被記住；下一次共鳴仍值得期待。",
    "漫长的等待也被记住；下一次共鸣仍值得期待。",
    "The archive remembers the wait, and the next resonance awaits."
  ],
  "observing.desc": [
    "先記下旅途，讓更多樣本描出你的星運。",
    "先记下旅途，让更多样本描出你的星运。",
    "Keep recording. More samples will reveal your fortune."
  ],
  "atlas": [
    "成就圖鑑",
    "成就图鉴",
    "Achievement atlas"
  ],
  "viewAll": [
    "查看全部",
    "查看全部",
    "View all"
  ],
  "unlocked": [
    "已解鎖",
    "已解锁",
    "Unlocked"
  ],
  "notReached": [
    "本存檔未達成",
    "本存档未达成",
    "Not reached in this archive"
  ],
  "insufficient": [
    "資料不足",
    "资料不足",
    "Insufficient evidence"
  ],
  "progress": [
    "目前進度",
    "当前进度",
    "Progress"
  ],
  "unlockDate": [
    "最早可確認解鎖時間",
    "最早可确认解锁时间",
    "Earliest confirmed unlock"
  ],
  "archiveScope": [
    "成就僅描述可確認的存檔範圍；缺失歷史不代表從未達成。",
    "成就仅描述可确认的存档范围；缺失历史不代表从未达成。",
    "Achievements describe the verifiable archive only. Missing history does not prove an achievement never occurred."
  ],
  "condition.one": [
    "已知重複池中，一次完整五星間隔為 1 抽。",
    "已知重复池中，一次完整五星间隔为 1 抽。",
    "A complete interval of one pull in a known repeatable pool."
  ],
  "condition.ten": [
    "已知重複池中，一次完整五星間隔不超過 10 抽。",
    "已知重复池中，一次完整五星间隔不超过 10 抽。",
    "A complete interval of at most ten pulls in a known repeatable pool."
  ],
  "condition.pity": [
    "至少 3 個有效普通池間隔達 75 抽或以上。",
    "至少 3 个有效普通池间隔达 75 抽或以上。",
    "At least three valid standard-mechanism intervals of 75 pulls or more."
  ],
  "condition.streak": [
    "同一卡池連續 3 個精確間隔各不超過 20 抽。",
    "同一卡池连续 3 个精确间隔各不超过 20 抽。",
    "Three consecutive exact intervals of at most twenty pulls in one pool."
  ],
  "condition.comeback": [
    "同一連續區間，確認的非限定結果後接確認的保證命中。",
    "同一连续区间，确认的非限定结果后接确认的保证命中。",
    "A confirmed off-banner result followed by a confirmed guarantee in the same continuous segment."
  ],
  "condition.consecutive": [
    "兩個連續五星之間有精確 1 抽間隔。",
    "两个连续五星之间有精确 1 抽间隔。",
    "Two consecutive five-stars separated by exactly one pull."
  ],
  "poolOverview": [
    "卡池共鳴概況",
    "卡池共鸣概况",
    "Pool resonance overview"
  ],
  "allHistory": [
    "查看完整歷史",
    "查看完整历史",
    "Full history"
  ],
  "poolFocus": [
    "分析卡池",
    "分析卡池",
    "Analyze pool"
  ],
  "observedInterval": [
    "目前可確認的間隔",
    "当前可确认的间隔",
    "Confirmed interval"
  ],
  "guideTitle": [
    "取得你的喚取紀錄",
    "取得你的唤取记录",
    "Get your Convene history"
  ],
  "guideIntro": [
    "這是遊戲歷史頁的臨時授權連結，不是登入密碼。只貼到匯入欄位，不要公開分享。",
    "这是游戏历史页的临时授权链接，不是登录密码。只粘贴到导入栏位，不要公开分享。",
    "A temporary authorization link for your in-game history. Paste it into the import field; keep it private."
  ],
  "guideWindows": [
    "Windows",
    "Windows",
    "Windows"
  ],
  "guideAndroid": [
    "Android",
    "Android",
    "Android"
  ],
  "guideIOS": [
    "iOS",
    "iOS",
    "iOS"
  ],
  "guideOther": [
    "其他平台",
    "其他平台",
    "Other platforms"
  ],
  "guideOpen": [
    "開啟遊戲",
    "打开游戏",
    "Open game"
  ],
  "guideHistory": [
    "喚取 → 歷史紀錄",
    "唤取 → 历史记录",
    "Convene → History"
  ],
  "guideFile": [
    "選擇本機日誌",
    "选择本地日志",
    "Choose local log"
  ],
  "guideImport": [
    "回到本頁匯入",
    "回到本页导入",
    "Import here"
  ],
  "originalDiagram": [
    "WuwaEchoTool 原創流程示意，非遊戲截圖",
    "WuwaEchoTool 原创流程示意，非游戏截图",
    "Original WuwaEchoTool diagram; not a game screenshot"
  ],
  "windows1": [
    "登入目標帳號與伺服器，打開「喚取」，進入任一池的歷史紀錄並等待載入。",
    "登录目标账号与服务器，打开“唤取”，进入任一卡池的历史记录并等待加载。",
    "Sign in to the intended account/server. Open Convene and let a pool’s History finish loading."
  ],
  "windows2": [
    "在啟動器查看遊戲安裝位置，找到 Client/Saved/Logs/Client.log；找不到時可搜尋 Client.log。",
    "在启动器查看游戏安装位置，找到 Client/Saved/Logs/Client.log；找不到时可搜索 Client.log。",
    "Locate the game installation through its launcher, then Client/Saved/Logs/Client.log. Search for Client.log if needed."
  ],
  "windows3": [
    "在此工具選擇該日誌。本頁只在裝置內解析你選取的檔案，填入最近找到的官方歷史連結。",
    "在此工具选择该日志。本页仅在设备内解析你选取的文件，填入最近找到的官方历史链接。",
    "Choose that log in this tool. The selected file is decoded locally and its latest supported history link fills the import field."
  ],
  "windows4": [
    "回到匯入面板開始匯入。若日誌被占用，可先關閉遊戲再重新選擇。實際遊戲版本的日誌仍待實機核對。",
    "回到导入面板开始导入。若日志被占用，可先关闭游戏再重新选择。实际游戏版本的日志仍待实机核对。",
    "Return to import. If the file is locked, close the game and select it again. Real game log variants still require device verification."
  ],
  "platformUnverified": [
    "公開方法已研究；本專案未在此平台實機驗證。",
    "公开方法已研究；本项目未在此平台实机验证。",
    "Public methods researched; not device-verified by this project."
  ],
  "android1": [
    "Android 11+ 的公開方法使用 Ascent 配合無線偵錯取得歷史連結；本頁未內建該裝置工具。",
    "Android 11+ 的公开方法使用 Ascent 配合无线调试取得历史链接；本页未内置该设备工具。",
    "A documented Android 11+ method uses Ascent with wireless debugging. This page does not embed that device utility."
  ],
  "android2": [
    "在可信來源取得並核對工具，按工具說明連接無線偵錯；開啟遊戲喚取歷史後，取得該官方歷史頁的完整連結。",
    "在可信来源取得并核对工具，按工具说明连接无线调试；打开游戏唤取历史后，取得该官方历史页的完整链接。",
    "Verify a trusted copy of the utility, follow its wireless-debugging setup, then open in-game History and obtain its full official history link."
  ],
  "android3": [
    "把連結貼回本頁，完成後關閉偵錯。若機型不支援，可在同帳號同伺服器的 Windows 遊戲端取鏈，或合併自己的 WuwaEchoTool 備份。",
    "把链接粘贴回本页，完成后关闭调试。若机型不支持，可在同账号同服务器的 Windows 游戏端取链，或合并自己的 WuwaEchoTool 备份。",
    "Paste the link here and disable debugging afterwards. Alternatively use the same account/server on Windows, or merge your own WuwaEchoTool backup."
  ],
  "ios1": [
    "iOS 的公開取鏈方法需要裝置端網路擷取及憑證設定；本專案未驗證特定工具與配置，不將其列為可直接使用的內建能力。",
    "iOS 的公开取链方法需要设备端网络捕获及证书设置；本项目未验证特定工具与配置，不将其列为可直接使用的内置能力。",
    "Public iOS methods use on-device network capture and certificate setup. No specific configuration has been verified here or bundled as a working feature."
  ],
  "ios2": [
    "可操作的替代流程：在 Windows 登入同帳號同伺服器，按 Windows 步驟取得連結，再於這部裝置貼上。連結授權失效時需重新取得。",
    "可操作的替代流程：在 Windows 登录同账号同服务器，按 Windows 步骤取得链接，再于这台设备粘贴。链接授权失效时需重新取得。",
    "Alternative: sign in to the same account/server on Windows, follow the Windows steps, then paste the link on this device. Refresh it if authorization expires."
  ],
  "ios3": [
    "已有 WuwaEchoTool 存檔時，使用「資料管理 → 合併備份」。這只還原已保存的歷史，不會取得尚未保存的新紀錄。",
    "已有 WuwaEchoTool 存档时，使用“数据管理 → 合并备份”。这仅恢复已保存的历史，不会取得尚未保存的新记录。",
    "For an existing WuwaEchoTool archive, use Data management → Merge backup. This restores saved history only; it does not fetch new pulls."
  ],
  "other1": [
    "macOS、Linux、PS5、Xbox 的取鏈流程未在本專案實機驗證；不展示假定可用的專用操作。",
    "macOS、Linux、PS5、Xbox 的取链流程未在本项目实机验证；不展示假定可用的专用操作。",
    "macOS, Linux, PS5 and Xbox extraction has not been device-tested here. No platform-specific sequence is presented as verified."
  ],
  "other2": [
    "若已有完整官方歷史連結，可直接貼上；否則可使用同帳號 Windows 取鏈或合併現有備份。",
    "若已有完整官方历史链接，可直接粘贴；否则可使用同账号 Windows 取链或合并现有备份。",
    "Paste an existing full official history link, or use Windows for the same account, or merge an existing backup."
  ],
  "faqRegion": [
    "國際服與陸服有何差異？",
    "国际服与陆服有何差异？",
    "What differs between regions?"
  ],
  "faqRegionText": [
    "遊戲歷史頁的官方來源、伺服器與授權參數決定查詢端點。本頁沿既有白名單解析，自動選擇獨立設定；不要求玩家改網域或手動換服。",
    "游戏历史页的官方来源、服务器与授权参数决定查询端点。本页沿既有白名单解析，自动选择独立配置；不要求玩家改域名或手动换服。",
    "The official page source, server and authorization select a separate endpoint configuration. The existing allowlist parser handles this automatically; do not edit domains or switch regions manually."
  ],
  "faqExpired": [
    "連結過期怎麼辦？",
    "链接过期怎么办？",
    "What if the link expires?"
  ],
  "faqExpiredText": [
    "重新打開遊戲歷史，取得新連結再試；本工具不承諾固定有效期。既有歷史不會因更新失敗而被刪除。",
    "重新打开游戏历史，取得新链接再试；本工具不承诺固定有效期。既有历史不会因更新失败而被删除。",
    "Reopen in-game History and obtain a new link. No fixed lifetime is promised. Failed updates do not delete archived history."
  ],
  "faqFailed": [
    "無法匯入時如何排查？",
    "无法导入时如何排查？",
    "How do I troubleshoot import?"
  ],
  "faqFailedText": [
    "確認貼上完整官方歷史連結、帳號和伺服器正確，再重取連結。連線問題可展開進階設定；部分池失敗可重試，成功資料已保留。不要提交包含授權參數的截圖。",
    "确认粘贴完整官方历史链接、账号和服务器正确，再重新取链。连接问题可展开高级配置；部分池失败可重试，成功数据已保留。不要提交含授权参数的截图。",
    "Check the full official link, account and server, then obtain a fresh link. Connection options are under Advanced. Retry failed pools; successful data is preserved. Omit authorization from screenshots."
  ],
  "faqArchive": [
    "如何長期保留歷史？",
    "如何长期保留历史？",
    "How do I preserve history?"
  ],
  "faqArchiveText": [
    "定期更新並匯出備份；官方可查詢窗口不等於終身歷史。只合併舊檔、不刪除窗口外紀錄；不同裝置的瀏覽器資料不會自動同步。",
    "定期更新并导出备份；官方可查询窗口不等于终身历史。只合并旧档、不删除窗口外记录；不同设备的浏览器数据不会自动同步。",
    "Update and export backups regularly. The API window is not lifetime history. Older archived pulls are retained; browsers on different devices do not sync automatically."
  ],
  "backImport": [
    "返回匯入",
    "返回导入",
    "Back to import"
  ],
  "references": [
    "研究來源與驗證範圍",
    "研究来源与验证范围",
    "Research sources and verification scope"
  ],
  "guideUnavailable": [
    "未有可宣稱已驗證的其他平台取鏈方式。",
    "尚无可宣称已验证的其他平台取链方式。",
    "No other platform extraction method is claimed as verified."
  ],
  "shareOverall": [
    "分享整體戰績",
    "分享整体战绩",
    "Share overall report"
  ],
  "shareCharacter": [
    "分享角色戰績",
    "分享角色战绩",
    "Share resonator report"
  ],
  "recentOnly": [
    "顯示 {shown} / {total} 次取得",
    "显示 {shown} / {total} 次取得",
    "Showing {shown} / {total} acquisitions"
  ],
  "capturedState": [
    "存檔狀態",
    "存档状态",
    "Archive status"
  ],
  "emptyTitle": [
    "你的下一道共鳴，從這裡記下。",
    "你的下一道共鸣，从这里记下。",
    "Your next resonance begins here."
  ],
  "emptyBody": [
    "匯入遊戲歷史，在此保存每次取得與每段旅程。",
    "导入游戏历史，在此保存每次取得与每段旅程。",
    "Import in-game history and preserve each acquisition along your journey."
  ],
  "selfMade": [
    "獨立繪製 · 共鳴戰績",
    "独立绘制 · 共鸣战绩",
    "RESONANCE / PERSONAL REPORT"
  ]
});
Object.assign(rows,{
  "android1": [
    "Android 11+ 連上 Wi-Fi，在系統開啟開發人員選項與無線偵錯。從公開專案核對並取得 Ascent；此方法未在本專案實機驗證。",
    "Android 11+ 连接 Wi-Fi，在系统打开开发者选项与无线调试。从公开项目核对并取得 Ascent；此方法未在本项目实机验证。",
    "On Android 11+, connect to Wi-Fi and enable Developer options and Wireless debugging. Verify Ascent from its public project. This method is not device-tested here."
  ],
  "android2": [
    "在 Ascent 選擇 Pair / Start Pairing；回到無線偵錯的「使用配對碼配對裝置」，把顯示的六位碼填入配對流程。系統選項名稱因機型而異。",
    "在 Ascent 选择 Pair / Start Pairing；回到无线调试的“使用配对码配对设备”，把显示的六位码填入配对流程。系统选项名称因机型而异。",
    "In Ascent choose Pair / Start Pairing. Open Pair device with pairing code in Wireless debugging and enter the displayed six-digit code. Menu names vary by device."
  ],
  "android3": [
    "配對成功後在 Ascent 選擇 Connect，再回到遊戲開啟「喚取 → 歷史紀錄」，等待工具找到官方歷史連結並選擇 Copy。",
    "配对成功后在 Ascent 选择 Connect，再回到游戏打开“唤取 → 历史记录”，等待工具找到官方历史链接并选择 Copy。",
    "After pairing, choose Connect in Ascent. Open Convene → History in-game, wait for the official history link and choose Copy."
  ],
  "android4": [
    "貼回本頁開始匯入，完成後關閉無線偵錯。若配對失敗或機型不支援，改用同帳號同伺服器的 Windows 取鏈，或合併自己的 WuwaEchoTool 備份。",
    "粘贴回本页开始导入，完成后关闭无线调试。若配对失败或机型不支持，改用同账号同服务器的 Windows 取链，或合并自己的 WuwaEchoTool 备份。",
    "Paste it here and import, then disable Wireless debugging. If pairing fails, use Windows for the same account/server or merge your own WuwaEchoTool backup."
  ]
});
Object.assign(rows,{
  "INVALID_URL_FORMAT": [
    "網址格式不正確，請貼上官方歷史完整網址。",
    "网址格式不正确，请粘贴官方历史完整网址。",
    "Invalid URL format. Paste the official history URL."
  ],
  "INVALID_URL_MISSING": [
    "缺少必要參數，請重新複製完整歷史網址。",
    "缺少必要参数，请重新复制完整历史网址。",
    "Required parameters are missing. Copy the complete history URL."
  ],
  "INVALID_URL_PARAMETER": [
    "網址參數內容不合法或重複，尚未發送請求。",
    "网址参数内容不合法或重复，尚未发送请求。",
    "Invalid or duplicate parameters. No request was sent."
  ],
  "UPSTREAM_UNAVAILABLE": [
    "官方服務暫時不可用，請稍後重試。",
    "官方服务暂时不可用，请稍后重试。",
    "The upstream service is unavailable. Retry later."
  ],
  "AUTH_OR_API": [
    "官方拒絕授權或請求，請重取連結；不能僅據此判定已過期。",
    "官方拒绝授权或请求，请重取链接；不能仅据此判定已过期。",
    "The official API rejected authorization or the request. Get a new link; rejection alone does not prove expiry."
  ],
  "unchanged": [
    "匯入成功，沒有新增紀錄。",
    "导入成功，没有新增记录。",
    "Import succeeded. No new records."
  ],
  "targetTitle": [
    "角色星運",
    "角色星运",
    "Resonator fortune"
  ],
  "rTarget": [
    "紀錄區間目標",
    "记录区间目标",
    "Recorded-window target"
  ],
  "rScope": [
    "評價口徑",
    "评价口径",
    "Evaluation scope"
  ],
  "rInvestment": [
    "活動實際投入（未能確認）",
    "活动实际投入（未能确认）",
    "Actual banner investment (unverified)"
  ],
  "rWindow": [
    "連續紀錄區間效率",
    "连续记录区间效率",
    "Continuous-window efficiency"
  ],
  "rScopeHelp": [
    "R0～R6 表示本存檔第 1～7 次取得，不證明真實共鳴鏈。區間抽數從本存檔限定池首個已知五星之後開始，包含所有中間結果；不是活動總投入。",
    "R0～R6 表示本存档第 1～7 次取得，不证明真实共鸣链。区间抽数从本存档限定池首个已知五星之后开始，包含所有中间结果；不是活动总投入。",
    "R0–R6 labels the first 1–7 acquisitions in this archive, not a proven lifetime chain. The window starts after this archive’s first known limited-pool five-star and includes every intervening result. It is not banner spending."
  ],
  "rDraws": [
    "可確認區間抽數",
    "可确认区间抽数",
    "Verified window pulls"
  ],
  "rActual": [
    "活動實際投入：未知",
    "活动实际投入：未知",
    "Actual banner spending: unknown"
  ],
  "rVisible": [
    "存檔取得次數",
    "存档取得次数",
    "Archived acquisitions"
  ],
  "rExcess": [
    "存檔超額取得（超過 7 次）",
    "存档超额取得（超过 7 次）",
    "Archived acquisitions beyond seven"
  ],
  "rMax": [
    "可展示區間目標",
    "可展示区间目标",
    "Available archive target"
  ],
  "rNoChain": [
    "不據此推斷真實鏈數、消費或珊瑚。",
    "不据此推断真实链数、消费或珊瑚。",
    "No lifetime chain, spending or coral is inferred."
  ],
  "rShare": [
    "分享目標戰績",
    "分享目标战绩",
    "Share target report"
  ],
  "rRules": [
    "角色評價規則",
    "角色评价规则",
    "Resonator rating rules"
  ],
  "rModel": [
    "本站區間效率模型；非官方排名。K=目標次數，P=完整區間抽數。分數=max(0,min(100,100×(1−(P−K)/(160K−K))))。160 是內部比較基準，不是此角色的官方保證上限。僅在主動選擇區間口徑且起點與連續性可核對時評價。",
    "本站区间效率模型；非官方排名。K=目标次数，P=完整区间抽数。分数=max(0,min(100,100×(1−(P−K)/(160K−K))))。160 是内部比较基准，不是此角色的官方保证上限。仅在主动选择区间口径且起点与连续性可核对时评价。",
    "Internal window efficiency, not an official rank: K=target copies, P=verified window pulls. Score=clamp(100×(1−(P−K)/(160K−K)),0,100). 160 is an internal reference, not a guaranteed cap for this character. Rating requires opting into a verifiable continuous window."
  ],
  "rWindowLabel": [
    "區間角色星運 · 非活動投入",
    "区间角色星运 · 非活动投入",
    "Window fortune · not banner spending"
  ],
  "rReason.targetNotReached": [
    "本存檔尚未取得足夠次數。",
    "本存档尚未取得足够次数。",
    "Not enough acquisitions in this archive."
  ],
  "rReason.crossPool": [
    "取得橫跨不同卡池，不能合併推算投入。",
    "取得横跨不同卡池，不能合并推算投入。",
    "Acquisitions cross pool types; spending cannot be combined."
  ],
  "rReason.missingOrigin": [
    "首個目標前缺少可確認的起點。",
    "首个目标前缺少可确认的起点。",
    "No verifiable starting boundary before the first target."
  ],
  "rReason.historyGap": [
    "目標區間包含未銜接歷史，無法精確評價。",
    "目标区间包含未衔接历史，无法精确评价。",
    "A history gap prevents exact window evaluation."
  ],
  "rReason.bannerUnverified": [
    "接口沒有可靠活動目標資訊，實際投入未知；可另選區間效率。",
    "接口没有可靠活动目标信息，实际投入未知；可另选区间效率。",
    "No reliable banner-target metadata. Actual spending is unknown; window efficiency is an optional separate metric."
  ],
  "rReason.windowVerified": [
    "連續區間可核對；評分只描述此區間。",
    "连续区间可核对；评分只描述此区间。",
    "Continuous window verified. The score describes this window only."
  ],
  "rReason.invalidInterval": [
    "區間出現超出目前池規則的五星間隔，暫不評價。",
    "区间出现超出目前池规则的五星间隔，暂不评价。",
    "A five-star interval exceeds the current pool rule; rating withheld."
  ],
  "rStart": [
    "區間起點（此五星之後）",
    "区间起点（此五星之后）",
    "Window starts after this five-star"
  ],
  "rEnd": [
    "目標取得終點",
    "目标取得终点",
    "Target acquisition endpoint"
  ],
  "rEvidence": [
    "區間證據",
    "区间证据",
    "Window evidence"
  ],
  "rShowExcess": [
    "顯示超額取得",
    "显示超额取得",
    "Show extra acquisitions"
  ],
  "rShowBadge": [
    "顯示稱號與徽章",
    "显示称号与徽章",
    "Show title and badge"
  ],
  "rAtlas": [
    "星運圖鑑",
    "星运图鉴",
    "Fortune atlas"
  ],
  "rOverall": [
    "整體星運",
    "整体星运",
    "Overall fortune"
  ],
  "rCharacter": [
    "角色星運",
    "角色星运",
    "Resonator fortune"
  ],
  "rCurrent": [
    "目前評價",
    "目前评价",
    "Current evaluation"
  ],
  "rUnawarded": [
    "尚未授予",
    "尚未授予",
    "Not awarded"
  ],
  "rNotLifetime": [
    "區間結果，不代表終身紀錄",
    "区间结果，不代表终身记录",
    "Window results, not lifetime history"
  ],
  "bond.observing": [
    "契約待觀測",
    "契约待观测",
    "Bond under observation"
  ],
  "bond.fate": [
    "天命之約",
    "天命之约",
    "Covenant of Destiny"
  ],
  "bond.star": [
    "星辰眷戀",
    "星辰眷恋",
    "Cherished by Starlight"
  ],
  "bond.lucky": [
    "共鳴相契",
    "共鸣相契",
    "Resonance in Accord"
  ],
  "bond.steady": [
    "命運同行",
    "命运同行",
    "Walking with Fate"
  ],
  "bond.headwind": [
    "逆風尋星",
    "逆风寻星",
    "Seeking Stars Upwind"
  ],
  "bond.abyss": [
    "漫長守候",
    "漫长守候",
    "The Patient Vigil"
  ],
  "windowsMethods": [
    "選擇取得方式",
    "选择取得方式",
    "Choose a retrieval method"
  ],
  "windowsLocal": [
    "方式 A：本站本機日誌解析（不執行腳本）",
    "方式 A：本站本地日志解析（不执行脚本）",
    "Method A: local log parsing (no script execution)"
  ],
  "windowsScript": [
    "方式 B：檢閱第三方 PowerShell 腳本",
    "方式 B：审阅第三方 PowerShell 脚本",
    "Method B: review a third-party PowerShell script"
  ],
  "windowsScriptHelp": [
    "WuWa Tracker 的 GPL-3.0 腳本可尋找安裝目錄、讀取及解碼日誌並複製網址；部分分支會詢問修改 Engine.ini、權限或提升權限。它不是本站程式。請先檢閱固定版本，若不願變更請拒絕提示並改用方式 A；本站不自動下載或執行它，也不要求一律使用管理員。",
    "WuWa Tracker 的 GPL-3.0 脚本可寻找安装目录、读取及解码日志并复制网址；部分分支会询问修改 Engine.ini、权限或提升权限。它不是本站程序。请先审阅固定版本，若不愿变更请拒绝提示并改用方式 A；本站不自动下载或执行它，也不要求一律使用管理员。",
    "WuWa Tracker’s GPL-3.0 script locates installations, decodes logs and copies a URL. Some branches ask to change Engine.ini, permissions or elevation. It is third-party code. Review the pinned version, decline unwanted changes, or use Method A. This site never downloads or executes it automatically and does not require elevation."
  ],
  "windowsScriptSource": [
    "檢閱固定版本原始碼",
    "审阅固定版本源码",
    "Review pinned source"
  ],
  "windowsValidation": [
    "已核對公開原始碼，未以真實遊戲或裝置執行驗證。先在遊戲開啟喚取歷史，取得網址後貼回本站匯入。",
    "已核对公开源码，未以真实游戏或设备执行验证。先在游戏打开唤取历史，取得网址后粘贴回本站导入。",
    "Public source reviewed; not executed against a real game or device. Open history in-game first, then paste the retrieved URL here."
  ]
});
Object.assign(rows,{windows2:['選擇下方 A 本機解析或 B 第三方腳本；一般讀檔不需管理員權限。','选择下方 A 本地解析或 B 第三方脚本；一般读文件不需管理员权限。','Choose Method A (local parsing) or B (third-party script). Normal file reading does not require elevation.'],windows3:['取得完整官方網址後貼回匯入頁；不要將連結公開分享。','取得完整官方网址后粘贴回导入页；不要将链接公开分享。','Paste the complete official URL into Import. Do not share the authorization URL publicly.']});
Object.assign(rows,{"featuredFirst": ["限定喚取", "限定唤取", "Featured convenes"], "latestFeatured": ["最近限定五星", "最近限定五星", "Latest featured 5★"], "otherPools": ["其他卡池", "其他卡池", "Other pools"], "poolNotImported": ["尚無此池紀錄", "尚无此池记录", "No records for this pool"], "weaponArt": ["武器類別示意圖", "武器类别示意图", "Weapon category artwork"], "artMissing": ["立繪暫不可用", "立绘暂不可用", "Portrait unavailable"], "coreData": ["共鳴軌跡", "共鸣轨迹", "Acquisition record"], "acquisitionTimeline": ["取得時間軸", "取得时间轴", "Acquisition timeline"], "showUID": ["顯示完整 UID", "显示完整 UID", "Show full UID"], "autoTransport": ["自動連線 · 直連受限時使用本站代理備援", "自动连接 · 直连受限时使用本站代理备援", "Automatic connection · site proxy fallback when direct access is blocked"], "importFailed": ["所有卡池匯入失敗；原存檔未變更。", "所有卡池导入失败；原存档未变更。", "All pools failed. Existing archives are unchanged."], "PROXY_NOT_DEPLOYED": ["直連受限，且本站未部署查詢路由（404）。", "直连受限，且本站未部署查询路由（404）。", "Direct access blocked; site proxy route is missing (404)."], "PROXY_METHOD": ["直連受限，本站代理不接受 POST（405），請檢查託管路由。", "直连受限，本站代理不接受 POST（405），请检查托管路由。", "Direct access blocked; site proxy rejects POST (405). Check hosting routes."], "PROXY_UNAVAILABLE": ["直連受限，本站代理暫不可用（503），請檢查服務綁定及限流設定。", "直连受限，本站代理暂不可用（503），请检查服务绑定及限流配置。", "Direct access blocked; site proxy unavailable (503). Check service bindings and rate limiting."], "quickWindows": ["快速取得 · 選擇日誌資料夾", "快速获取 · 选择日志文件夹", "Quick import · choose a log folder"], "quickWindowsHelp": ["先在遊戲開啟喚取歷史。在遊戲安裝位置開啟 Client/Saved/Logs，選擇該資料夾；本站只在本機讀取 Client.log 或 debug.log，不上傳、不修改遊戲檔案。", "先在游戏打开唤取历史。在游戏安装位置打开 Client/Saved/Logs，选择该文件夹；本站只在本机读取 Client.log 或 debug.log，不上传、不修改游戏文件。", "Open Convene History in-game. Find Client/Saved/Logs in the installation and choose that folder. Only Client.log or debug.log is read locally; game files are neither uploaded nor modified."], "chooseLogFolder": ["選擇 Logs 資料夾", "选择 Logs 文件夹", "Choose Logs folder"], "videoSoon": ["教學影片預留", "教学视频预留", "Video guide slot"], "videoSoonHelp": ["未提供影片；目前請依上方步驟操作。", "尚未提供视频；目前请按上方步骤操作。", "Video not available yet; follow the steps above."], "windows2": ["使用下方快速取得選擇 Logs 資料夾，也可展開單檔備選。", "使用下方快速获取选择 Logs 文件夹，也可展开单文件备选。", "Use the quick folder picker below, or expand the single-file alternative."], "windowsLocal": ["備選：選擇單一日誌", "备选：选择单一日志", "Alternative: select one log"], "windowsScript": ["進階參考：第三方腳本原始碼", "进阶参考：第三方脚本源码", "Advanced reference: third-party script source"]});
Object.assign(rows,{"quickFive": ["只看五星", "只看五星", "5★ only"], "characterPlaceholder": ["角色立繪待補 · 名稱保留", "角色立绘待补 · 名称保留", "Portrait unavailable · identity retained"], "weaponPlaceholder": ["武器素材待補 · 類別示意", "武器素材待补 · 类别示意", "Artwork pending · category placeholder"], "acquisitionState": ["目前存檔可見", "当前存档可见", "Visible in this archive"], "autoTransport": ["自動連線 · 會自動嘗試可用的備援方式", "自动连接 · 会自动尝试可用的备用方式", "Automatic connection · available fallback selected for you"], "PROXY_NOT_DEPLOYED": ["目前網站的備援連線未啟用（404），請聯絡網站維護者。", "当前网站的备用连接未启用（404），请联系网站维护者。", "This site’s backup connection is not enabled (404). Contact its maintainer."], "PROXY_METHOD": ["目前網站的備援連線設定不正確（405），請聯絡網站維護者。", "当前网站的备用连接配置不正确（405），请联系网站维护者。", "This site’s backup connection is misconfigured (405). Contact its maintainer."], "PROXY_UNAVAILABLE": ["目前網站的備援服務暫不可用（503），請稍後重試或聯絡維護者。", "当前网站的备用服务暂不可用（503），请稍后重试或联系维护者。", "This site’s backup service is unavailable (503). Retry later or contact its maintainer."], "videoSoonHelp": ["影片尚未提供；請先使用上方推薦方式。", "视频尚未提供；请先使用上方推荐方式。", "Video not available yet; use the recommended method above."], "quickWindows": ["推薦方式 · 選擇日誌資料夾", "推荐方式 · 选择日志文件夹", "Recommended · choose a log folder"], "shareTargetLabel": ["記錄目標（非真實共鳴鏈）", "记录目标（非真实共鸣链）", "Archive target (not actual chain)"]});
Object.assign(rows,{"noAchievements": ["成就等待點亮", "成就等待点亮", "No achievements unlocked"], "achievementNext": ["只依目前存檔判定，保留每一步共鳴。", "仅依据当前存档判定，保留每一步共鸣。", "Based on the visible archive. Keep each resonance."]});
Object.assign(rows,{"NETWORK": ["連線失敗，請檢查網路或稍後重試；持續失敗請聯絡網站維護者。", "连接失败，请检查网络或稍后重试；持续失败请联系网站维护者。", "Connection failed. Check your network or retry later; contact the site maintainer if it persists."], "faqFailedText": ["確認貼上完整遊戲歷史連結，並重新開啟歷史取得新連結。部分卡池失敗可重試，已成功保存的資料會保留。持續失敗請提供不含授權連結的錯誤代碼給網站維護者。", "确认粘贴完整游戏历史链接，并重新打开历史获取新链接。部分卡池失败可重试，已成功保存的数据会保留。持续失败请将不含授权链接的错误代码提供给网站维护者。", "Paste the complete in-game history link and obtain a fresh one if needed. Retry failed pools; successful imports remain saved. For persistent failures, give the site maintainer the error code without your authorization URL."]});
function create(locale='zh-CN'){const index={'zh-TW':0,'zh-CN':1,en:2}[locale]??1;return (key,params={})=>String(rows[key]?.[index]||key).replace(/\{(\w+)\}/g,(_,k)=>params[k]??'{'+k+'}');}
function poolName(pool,t){return t(({1:'limited',2:'weapon',3:'standard',4:'standardWeapon',5:'novice',6:'choice',7:'gift'}[pool]||'unknown')+'Pool')+(pool>=8?' '+pool:'');}
return {rows,create,poolName};});
