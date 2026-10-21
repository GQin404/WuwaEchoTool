/* Canonical player-facing messages: zh-TW, zh-CN, en. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-core.js'));else root.ConveneMessages=factory(root.ConveneCore);})(typeof globalThis!=='undefined'?globalThis:this,function(Core){
'use strict';
const rows={
  "title": [
    "喚取紀錄",
    "唤取记录",
    "Convene archive"
  ],
  "subtitle": [
    "記下每一次共鳴",
    "记下每一次共鸣",
    "EVERY RESONANCE, REMEMBERED"
  ],
  "overview": [
    "總覽",
    "总览",
    "Overview"
  ],
  "history": [
    "歷史紀錄",
    "历史记录",
    "History"
  ],
  "pools": [
    "卡池分析",
    "卡池分析",
    "Pools"
  ],
  "characters": [
    "角色分析",
    "角色分析",
    "Resonators"
  ],
  "data": [
    "資料管理",
    "数据管理",
    "Data management"
  ],
  "account": [
    "帳號",
    "账号",
    "Account"
  ],
  "empty": [
    "尚無喚取紀錄",
    "尚无唤取记录",
    "No convenes archived"
  ],
  "start": [
    "導入你的第一段共鳴旅程",
    "导入你的第一段共鸣旅程",
    "Bring your resonance journey into focus"
  ],
  "local": [
    "紀錄僅保存在此瀏覽器；請定期匯出備份。",
    "记录仅保存在此浏览器；请定期导出备份。",
    "Stored in this browser. Export backups regularly."
  ],
  "import": [
    "匯入紀錄",
    "导入记录",
    "Import history"
  ],
  "url": [
    "喚取連結／請求 JSON",
    "唤取链接／请求 JSON",
    "History URL / request JSON"
  ],
  "server": [
    "伺服器",
    "服务器",
    "Server"
  ],
  "auto": [
    "自動辨識",
    "自动识别",
    "Detect automatically"
  ],
  "global": [
    "國際服",
    "国际服",
    "Global"
  ],
  "cn": [
    "中國大陸官方服",
    "中国大陆官方服",
    "China official"
  ],
  "direct": [
    "直接連線（受 CORS 限制）",
    "直接连接（受 CORS 限制）",
    "Direct connection (requires CORS)"
  ],
  "extra": [
    "額外卡池 ID（選填，9–20，逗號分隔）",
    "额外卡池 ID（选填，9–20，逗号分隔）",
    "Additional pool IDs (optional, 9–20, comma separated)"
  ],
  "stop": [
    "停止",
    "停止",
    "Stop"
  ],
  "guide": [
    "如何取得網址",
    "如何取得网址",
    "Get a history URL"
  ],
  "guideText": [
    "Windows：先在遊戲開啟喚取歷史，再選擇 Client/Saved/Logs/Client.log；只在本機解碼所選檔案。亦可依 WuWa Tracker 教學取得網址。其他平台請使用該教學的對應流程；未在本專案實機驗證。網址授權可能失效，請重新開啟遊戲歷史取得新連結。",
    "Windows：先在游戏打开唤取历史，再选择 Client/Saved/Logs/Client.log；只在本机解码所选文件。也可按 WuWa Tracker 教学取得网址。其他平台请使用该教学的对应流程；未在本项目实机验证。网址授权可能失效，请重新打开游戏历史取得新链接。",
    "Windows: open Convene History in-game, then select Client/Saved/Logs/Client.log. Only your chosen file is decoded locally. Alternatively follow WuWa Tracker’s guide. Other platforms: use its platform-specific instructions (not device-tested here). Authorization can expire; open game history again for a fresh link."
  ],
  "log": [
    "選擇 Windows 日誌",
    "选择 Windows 日志",
    "Select Windows log"
  ],
  "networkNote": [
    "需部署已設定限流的 Pages Function，或官方端點允許 CORS；本機預覽不代表官方授權已驗證。",
    "需部署已配置限流的 Pages Function，或官方端点允许 CORS；本地预览不代表官方授权已验证。",
    "Requires a rate-limited Pages Function, or upstream CORS permission. Local preview does not verify official authorization."
  ],
  "total": [
    "累計抽數",
    "累计抽数",
    "Archived pulls"
  ],
  "five": [
    "五星總數",
    "五星总数",
    "Five-star results"
  ],
  "avg": [
    "平均五星間隔",
    "平均五星间隔",
    "Mean 5★ interval"
  ],
  "fast": [
    "最快間隔",
    "最快间隔",
    "Fastest interval"
  ],
  "slow": [
    "最晚間隔",
    "最晚间隔",
    "Longest interval"
  ],
  "observing": [
    "運勢待觀測",
    "运势待观测",
    "Fortune under observation"
  ],
  "fate": [
    "天命共鳴者",
    "天命共鸣者",
    "Destined Resonator"
  ],
  "star": [
    "星運眷顧者",
    "星运眷顾者",
    "Star-favored Rover"
  ],
  "lucky": [
    "幸運同行者",
    "幸运同行者",
    "Fortunate Companion"
  ],
  "steady": [
    "平穩共鳴者",
    "平稳共鸣者",
    "Steady Resonator"
  ],
  "headwind": [
    "逆風漂泊者",
    "逆风漂泊者",
    "Headwind Rover"
  ],
  "abyss": [
    "深淵守望者",
    "深渊守望者",
    "Abyss Watcher"
  ],
  "score": [
    "運勢指數",
    "运势指数",
    "Fortune index"
  ],
  "samples": [
    "有效間隔樣本",
    "有效间隔样本",
    "Verified intervals"
  ],
  "confidence": [
    "樣本可信度",
    "样本可信度",
    "Sample confidence"
  ],
  "low": [
    "樣本有限",
    "样本有限",
    "Limited sample"
  ],
  "established": [
    "已有參考樣本",
    "已有参考样本",
    "Established sample"
  ],
  "coverage": [
    "統計依目前保存紀錄計算。",
    "统计按当前保存记录计算。",
    "Statistics use saved records."
  ],
  "unknown": [
    "無法確認",
    "无法确认",
    "Unknown"
  ],
  "pity": [
    "目前保底進度",
    "当前保底进度",
    "Current pity"
  ],
  "atLeast": [
    "至少",
    "至少",
    "At least"
  ],
  "gaps": [
    "未銜接區段",
    "未衔接区段",
    "Unjoined segments"
  ],
  "updated": [
    "最後更新",
    "最后更新",
    "Last updated"
  ],
  "limited": [
    "限定結果",
    "限定结果",
    "Featured outcome"
  ],
  "win": [
    "非保證命中",
    "非保证命中",
    "Won chance"
  ],
  "loss": [
    "非限定結果",
    "非限定结果",
    "Off-banner"
  ],
  "guarantee": [
    "保證命中",
    "保证命中",
    "Guaranteed"
  ],
  "resultHelp": [
    "抽數與戰績均自動計算。",
    "抽数与战绩均自动计算。",
    "Pulls and results are calculated automatically."
  ],
  "winRate": [
    "可確認勝率",
    "可确认胜率",
    "Confirmed chance win rate"
  ],
  "latest": [
    "最近五星",
    "最近五星",
    "Latest five-star"
  ],
  "distribution": [
    "五星間隔分布",
    "五星间隔分布",
    "5★ interval distribution"
  ],
  "trend": [
    "每月抽取趨勢",
    "每月抽取趋势",
    "Monthly pull activity"
  ],
  "all": [
    "全部",
    "全部",
    "All"
  ],
  "filters": [
    "篩選",
    "筛选",
    "Filters"
  ],
  "search": [
    "角色／武器名稱或 ID",
    "角色／武器名称或 ID",
    "Resonator / weapon name or ID"
  ],
  "from": [
    "開始日期",
    "开始日期",
    "From"
  ],
  "to": [
    "結束日期",
    "结束日期",
    "To"
  ],
  "rarity": [
    "稀有度",
    "稀有度",
    "Rarity"
  ],
  "pool": [
    "卡池",
    "卡池",
    "Pool"
  ],
  "kind": [
    "類型",
    "类型",
    "Type"
  ],
  "character": [
    "角色",
    "角色",
    "Resonator"
  ],
  "weaponKind": [
    "武器",
    "武器",
    "Weapon"
  ],
  "reset": [
    "重設",
    "重设",
    "Reset"
  ],
  "previous": [
    "上一頁",
    "上一页",
    "Previous"
  ],
  "next": [
    "下一頁",
    "下一页",
    "Next"
  ],
  "date": [
    "取得時間",
    "取得时间",
    "Acquired"
  ],
  "interval": [
    "五星間隔",
    "五星间隔",
    "5★ interval"
  ],
  "name": [
    "物品",
    "物品",
    "Item"
  ],
  "share": [
    "分享戰績",
    "分享战绩",
    "Share report"
  ],
  "compact": [
    "簡略版",
    "简略版",
    "Compact"
  ],
  "detailed": [
    "詳細版",
    "详细版",
    "Detailed"
  ],
  "masked": [
    "顯示遮蔽 UID",
    "显示遮蔽 UID",
    "Show masked UID"
  ],
  "download": [
    "下載 PNG",
    "下载 PNG",
    "Download PNG"
  ],
  "close": [
    "關閉",
    "关闭",
    "Close"
  ],
  "export": [
    "匯出唤取備份",
    "导出唤取备份",
    "Export archive"
  ],
  "restore": [
    "合併備份",
    "合并备份",
    "Merge backup"
  ],
  "backupNote": [
    "僅追加合併，不刪除較早紀錄。完整資料管理備份也會包含喚取紀錄。",
    "仅追加合并，不删除较早记录。完整数据管理备份也会包含唤取记录。",
    "Backups merge without deleting older records. The full data-management backup includes this archive too."
  ],
  "acquired": [
    "取得次數",
    "取得次数",
    "Times acquired"
  ],
  "characterNote": [
    "此處為角色取得時的五星間隔，不等於為此角色花費的總抽數。",
    "此处为角色取得时的五星间隔，不等于为此角色花费的总抽数。",
    "These are 5★ intervals at acquisition, not total pulls spent for this character."
  ],
  "bannerSpend": [
    "區間合計僅加總完整五星間隔，未包含無法確認的首段，不代表為此角色花費。",
    "区间合计仅加总完整五星间隔，未包含无法确认的首段，不代表为此角色花费。",
    "Interval totals include complete five-star intervals only, excluding unknown prefixes. They are not spending for this character."
  ],
  "none": [
    "沒有符合條件的紀錄",
    "没有符合条件的记录",
    "No matching records"
  ],
  "one": [
    "一發入魂",
    "一发入魂",
    "One-pull Resonance"
  ],
  "ten": [
    "十抽奇蹟",
    "十抽奇迹",
    "Ten-pull Miracle"
  ],
  "pityAch": [
    "保底常客",
    "保底常客",
    "At the Threshold"
  ],
  "streak": [
    "連續好運",
    "连续好运",
    "Fortune in Sequence"
  ],
  "comeback": [
    "逆風翻盤",
    "逆风翻盘",
    "Turning the Tide"
  ],
  "consecutive": [
    "再遇雙星",
    "再遇双星",
    "Twin Stars Return"
  ],
  "achievements": [
    "共鳴成就",
    "共鸣成就",
    "Resonance achievements"
  ],
  "formula": [
    "評級說明",
    "评级说明",
    "How the rating works"
  ],
  "formulaText": [
    "出金運 = 各有效間隔的 100 ×（該池硬保底 − 間隔）÷（硬保底 − 1）平均。有限定確認樣本時，以 80% 出金運 + 20% 非保證命中率合成。至少 10 個有效間隔與 300 抽才授予稱號；最高階另需 30 間隔與 10 次確認機會。這是娛樂性速度指數，不是玩家百分位；可信度不加分。首段、缺口及規則未知池不計分。",
    "出金运 = 各有效间隔的 100 ×（该池硬保底 − 间隔）÷（硬保底 − 1）平均。有限定确认样本时，以 80% 出金运 + 20% 非保证命中率合成。至少 10 个有效间隔与 300 抽才授予称号；最高阶另需 30 间隔与 10 次确认机会。这是娱乐性速度指数，不是玩家百分位；可信度不加分。首段、缺口及规则未知池不计分。",
    "Draw luck averages 100 × (pool hard pity − interval) / (hard pity − 1). With confirmed chance outcomes, the index combines 80% draw luck and 20% win rate. Titles require 10 valid intervals and 300 pulls; the top tier also needs 30 intervals and 10 confirmed chances. An entertainment speed index, not a player percentile. Confidence adds no points. Initial, gapped and unknown-rule intervals are excluded."
  ],
  "imported": [
    "匯入完成",
    "导入完成",
    "Import completed"
  ],
  "added": [
    "新增",
    "新增",
    "New"
  ],
  "duplicates": [
    "重複",
    "重复",
    "Duplicates"
  ],
  "failed": [
    "失敗卡池",
    "失败卡池",
    "Failed pools"
  ],
  "cancelled": [
    "已停止；已成功保存的卡池仍保留。",
    "已停止；已成功保存的卡池仍保留。",
    "Stopped. Successfully saved pools are preserved."
  ],
  "saved": [
    "備份已合併",
    "备份已合并",
    "Backup merged"
  ],
  "busy": [
    "讀取卡池",
    "读取卡池",
    "Reading pool"
  ],
  "noData": [
    "官方返回空紀錄；舊存檔仍保留。",
    "官方返回空记录；旧存档仍保留。",
    "The API returned no records. Older archives are preserved."
  ],
  "privacy": [
    "本地存檔 · 不含授權資訊",
    "本地存档 · 不含授权信息",
    "LOCAL ARCHIVE · NO CREDENTIALS"
  ],
  "sample": [
    "測試資料 · 非真實帳號",
    "测试数据 · 非真实账号",
    "TEST FIXTURE · NOT A REAL ACCOUNT"
  ],
  "unsupportedRule": [
    "此池規則待驗證；不參與保底上限或運勢評分。",
    "此池规则待验证；不参与保底上限或运势评分。",
    "Pool rules unverified; excluded from pity limits and fortune scoring."
  ],
  "warning": [
    "出現超出規則範圍的紀錄，請檢查缺口或規則版本。",
    "出现超出规则范围的记录，请检查缺口或规则版本。",
    "A result exceeds the rule limits. Check gaps or rule versions."
  ],
  "limitedPool": [
    "限定角色",
    "限定角色",
    "Featured Resonator"
  ],
  "weaponPool": [
    "限定武器",
    "限定武器",
    "Featured Weapon"
  ],
  "standardPool": [
    "常駐角色",
    "常驻角色",
    "Standard Resonator"
  ],
  "standardWeaponPool": [
    "常駐武器",
    "常驻武器",
    "Standard Weapon"
  ],
  "novicePool": [
    "新手喚取",
    "新手唤取",
    "Novice Convene"
  ],
  "choicePool": [
    "新手自選",
    "新手自选",
    "Beginner’s Choice"
  ],
  "giftPool": [
    "自選贈禮（待核對）",
    "自选赠礼（待核对）",
    "Selector gift (unverified)"
  ],
  "unknownPool": [
    "未知規則卡池",
    "未知规则卡池",
    "Unverified pool"
  ],
  "INVALID_URL": [
    "網址無效或伺服器選擇衝突，請貼上遊戲歷史完整網址。",
    "网址无效或服务器选择冲突，请粘贴游戏历史完整网址。",
    "Invalid URL or conflicting region. Paste the full in-game history URL."
  ],
  "AUTH_OR_API": [
    "官方拒絕授權或請求，請重取連結；不能僅據此判定已過期。",
    "官方拒绝授权或请求，请重取链接；不能仅据此判定已过期。",
    "The official API rejected authorization or the request. Get a new link; rejection alone does not prove expiry."
  ],
  "NETWORK": [
    "連線失敗，請檢查網路或稍後重試；持續失敗請聯絡網站維護者。",
    "连接失败，请检查网络或稍后重试；持续失败请联系网站维护者。",
    "Connection failed. Check your network or retry later; contact the site maintainer if it persists."
  ],
  "TIMEOUT": [
    "請求逾時；請稍後重試。",
    "请求超时；请稍后重试。",
    "Request timed out. Try again later."
  ],
  "PROXY_REQUIRED": [
    "此站未啟用查詢代理。請部署 Pages Function 或嘗試直接連線。",
    "此站未启用查询代理。请部署 Pages Function 或尝试直接连接。",
    "The query proxy is unavailable. Deploy the Pages Function or try direct connection."
  ],
  "RATE_LIMIT": [
    "請求過於頻繁，請一分鐘後重試。",
    "请求过于频繁，请一分钟后重试。",
    "Too many requests. Retry in one minute."
  ],
  "INVALID_RESPONSE": [
    "回應格式不支援，未保存此池；請更新接口定義。",
    "响应格式不支持，未保存此池；请更新接口定义。",
    "Unsupported response. This pool was not saved; update the adapter."
  ],
  "BATCH_CONFLICT": [
    "相同時間批次發生衝突，已保留原存檔，未猜測合併。",
    "相同时间批次发生冲突，已保留原存档，未猜测合并。",
    "A timestamp batch conflicts. The old archive is preserved; no speculative merge."
  ],
  "STORAGE_FAILED": [
    "無法寫入儲存空間；請先備份，檢查配額或私人瀏覽限制。",
    "无法写入存储空间；请先备份，检查配额或隐私浏览限制。",
    "Storage unavailable. Back up first; check quota or private browsing restrictions."
  ],
  "INVALID_BACKUP": [
    "備份格式損壞，原資料未變更。",
    "备份格式损坏，原数据未变更。",
    "Invalid backup. Existing data is unchanged."
  ],
  "UNSUPPORTED_BACKUP": [
    "備份版本不支援，原資料未變更。",
    "备份版本不支持，原数据未变更。",
    "Unsupported backup version. Existing data is unchanged."
  ],
  "NO_URL": [
    "日誌中未找到支援的歷史網址，請先在遊戲開啟歷史。",
    "日志中未找到支持的历史网址，请先在游戏打开历史。",
    "No supported history URL found. Open history in-game first."
  ],
  "FILE_TOO_LARGE": [
    "檔案過大，請選擇較新的日誌或較小備份。",
    "文件过大，请选择较新的日志或较小备份。",
    "File too large. Select a newer log or smaller backup."
  ],
  "IMAGE_FAILED": [
    "圖片產生失敗，請重試或檢查圖片資源。",
    "图片生成失败，请重试或检查图片资源。",
    "Image generation failed. Retry or check image assets."
  ],
  "guideLink": [
    "取得官方連結",
    "取得官方链接",
    "Get official link"
  ],
  "windowsReference": [
    "Windows 日誌協定參考",
    "Windows 日志协议参考",
    "Windows log protocol reference"
  ],
  "androidReference": [
    "Android 公開 Ascent 方法",
    "Android 公开 Ascent 方法",
    "Android public Ascent method"
  ],
  "platformReference": [
    "公開平台方法研究參考",
    "公开平台方法研究参考",
    "Public platform research reference"
  ],
  "fortune": [
    "星運評定",
    "星运评定",
    "Fortune rating"
  ],
  "update": [
    "匯入 / 更新",
    "导入 / 更新",
    "Import / update"
  ],
  "autoSource": [
    "自動辨識來源與伺服器",
    "自动辨识来源与服务器",
    "Source and server detected automatically"
  ],
  "importHint": [
    "貼上完整喚取連結，或貼上擷取到的查詢請求 JSON，即可自動匯入。",
    "粘贴完整唤取链接，或粘贴捕获到的查询请求 JSON，即可自动导入。",
    "Paste the full history URL or captured query request JSON to import automatically."
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
    "可信度只控制稱號展示，不提供運氣加分。首段、跨缺口和未知規則不推算精確間隔。 稱號依未捨入分數判定；顯示數字可能四捨五入。",
    "可信度只控制称号展示，不提供运气加分。首段、跨缺口和未知规则不推算精确间隔。 称号依据未舍入分数判定；显示数字可能四舍五入。",
    "Confidence controls title eligibility, never adds luck points. Initial, gapped and unknown-rule intervals are not inferred. Titles use unrounded scores; displayed values may be rounded."
  ],
  "entertainment": [
    "娛樂性速度指數，並非全服機率百分位。",
    "娱乐性速度指数，并非全服概率百分位。",
    "An entertainment speed index, not a population percentile."
  ],
  "fate.desc": [
    "星軌為你偏轉，五星接連回應。",
    "星轨为你偏转，五星接连回应。",
    "The stars turn toward you; five-stars keep answering."
  ],
  "star.desc": [
    "好運常伴，每次共鳴都值得期待。",
    "好运常伴，每次共鸣都值得期待。",
    "Fortune stays close; each resonance brings anticipation."
  ],
  "lucky.desc": [
    "星光偶爾提前抵達，驚喜不曾缺席。",
    "星光偶尔提前抵达，惊喜不曾缺席。",
    "Starlight sometimes arrives early, bringing welcome surprises."
  ],
  "steady.desc": [
    "步步積累，屬於你的共鳴終會到來。",
    "步步积累，属于你的共鸣终会到来。",
    "Every step builds toward a resonance of your own."
  ],
  "headwind.desc": [
    "旅途稍長，仍有下一次轉機。",
    "旅途稍长，仍有下一次转机。",
    "The journey takes longer; another turn awaits."
  ],
  "abyss.desc": [
    "漫長等待，也會迎來新的星光。",
    "漫长等待，也会迎来新的星光。",
    "Even a long wait can give way to new starlight."
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
    "僅計算已保存紀錄中的戰績。",
    "仅计算已保存记录中的战绩。",
    "Results reflect saved records only."
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
    "同一保底組連續 3 個完整間隔不超過 20 抽",
    "同一保底组连续 3 个完整间隔不超过 20 抽",
    "Three consecutive complete intervals of at most 20 pulls in one pity group"
  ],
  "condition.comeback": [
    "同一連續區間，確認的非限定結果後接確認的保證命中。",
    "同一连续区间，确认的非限定结果后接确认的保证命中。",
    "A confirmed off-banner result followed by a confirmed guarantee in the same continuous segment."
  ],
  "condition.consecutive": [
    "2 次完整間隔為 1 抽的五星",
    "2 次完整间隔为 1 抽的五星",
    "Two complete five-star intervals of one pull"
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
    "使用下方快速取得選擇 Logs 資料夾，也可展開單檔備選。",
    "使用下方快速获取选择 Logs 文件夹，也可展开单文件备选。",
    "Use the quick folder picker below, or expand the single-file alternative."
  ],
  "windows3": [
    "取得完整官方網址後貼回匯入頁；不要將連結公開分享。",
    "取得完整官方网址后粘贴回导入页；不要将链接公开分享。",
    "Paste the complete official URL into Import. Do not share the authorization URL publicly."
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
    "確認貼上完整遊戲歷史連結，並重新開啟歷史取得新連結。部分卡池失敗可重試，已成功保存的資料會保留。持續失敗請提供不含授權連結的錯誤代碼給網站維護者。",
    "确认粘贴完整游戏历史链接，并重新打开历史获取新链接。部分卡池失败可重试，已成功保存的数据会保留。持续失败请将不含授权链接的错误代码提供给网站维护者。",
    "Paste the complete in-game history link and obtain a fresh one if needed. Retry failed pools; successful imports remain saved. For persistent failures, give the site maintainer the error code without your authorization URL."
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
    "WuwaEchoTool · 共鳴戰績",
    "WuwaEchoTool · 共鸣战绩",
    "WuwaEchoTool · Convene report"
  ],
  "android4": [
    "貼回本頁開始匯入，完成後關閉無線偵錯。若配對失敗或機型不支援，改用同帳號同伺服器的 Windows 取鏈，或合併自己的 WuwaEchoTool 備份。",
    "粘贴回本页开始导入，完成后关闭无线调试。若配对失败或机型不支持，改用同账号同服务器的 Windows 取链，或合并自己的 WuwaEchoTool 备份。",
    "Paste it here and import, then disable Wireless debugging. If pairing fails, use Windows for the same account/server or merge your own WuwaEchoTool backup."
  ],
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
  "unchanged": [
    "匯入成功，沒有新增紀錄。",
    "导入成功，没有新增记录。",
    "Import succeeded. No new records."
  ],
  "targetTitle": [
    "目標比較",
    "目标比较",
    "Target comparison"
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
    "區間效率包含錨點至目標間所有抽取（含其他角色及歪出），不是「為此角色花費」。僅比較相同 R 與相同口徑；實際活動投入未知。",
    "区间效率包含锚点至目标间所有抽取（含其他角色及歪出），不是“为此角色花费”。仅比较相同 R 与相同口径；实际活动投入未知。",
    "Window efficiency includes all pulls between anchor and target, including other characters and losses. It is not spending for this character. Compare only identical R targets and scopes; banner spending is unknown."
  ],
  "rDraws": [
    "可確認的投入抽數",
    "可确认的投入抽数",
    "Verified pulls"
  ],
  "rActual": [
    "目標角色累計投入",
    "目标角色累计投入",
    "Target investment"
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
    "以目標取得次數 K、可確認抽數 P 計算：100×(1−(P−K)/(160K−K))，限制於0–100。160 為比較基準，並非角色的實際花費或官方排名；稱號依未捨入分數判定。",
    "以目标取得次数 K、可确认抽数 P 计算：100×(1−(P−K)/(160K−K))，限制于0–100。160 为比较基准，并非角色的实际花费或官方排名；称号依据未舍入分数判定。",
    "For K acquisitions and P verified pulls: clamp(100×(1−(P−K)/(160K−K)),0,100). 160 is a comparison reference. This is not an official ranking; titles use unrounded scores."
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
    "共鳴初章",
    "共鸣初章",
    "First resonance"
  ],
  "bond.fate": [
    "天命之約",
    "天命之约",
    "Destined Bond"
  ],
  "bond.star": [
    "星辰眷戀",
    "星辰眷恋",
    "Stellar Affinity"
  ],
  "bond.lucky": [
    "共鳴相契",
    "共鸣相契",
    "Resonant Accord"
  ],
  "bond.steady": [
    "命運同行",
    "命运同行",
    "Shared Destiny"
  ],
  "bond.headwind": [
    "逆風尋星",
    "逆风寻星",
    "Seeking Starlight"
  ],
  "bond.abyss": [
    "漫長守候",
    "漫长守候",
    "Patient Vigil"
  ],
  "windowsMethods": [
    "選擇取得方式",
    "选择取得方式",
    "Choose a retrieval method"
  ],
  "windowsLocal": [
    "備選：選擇單一日誌",
    "备选：选择单一日志",
    "Alternative: select one log"
  ],
  "windowsScript": [
    "進階參考：第三方腳本原始碼",
    "进阶参考：第三方脚本源码",
    "Advanced reference: third-party script source"
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
  ],
  "featuredFirst": [
    "限定喚取",
    "限定唤取",
    "Featured convenes"
  ],
  "latestFeatured": [
    "最近限定五星",
    "最近限定五星",
    "Latest featured 5★"
  ],
  "otherPools": [
    "其他卡池",
    "其他卡池",
    "Other pools"
  ],
  "poolNotImported": [
    "尚無此池紀錄",
    "尚无此池记录",
    "No records for this pool"
  ],
  "weaponArt": [
    "武器類別示意圖",
    "武器类别示意图",
    "Weapon category artwork"
  ],
  "artMissing": [
    "立繪暫不可用",
    "立绘暂不可用",
    "Portrait unavailable"
  ],
  "coreData": [
    "共鳴軌跡",
    "共鸣轨迹",
    "Acquisition record"
  ],
  "acquisitionTimeline": [
    "取得時間軸",
    "取得时间轴",
    "Acquisition timeline"
  ],
  "showUID": [
    "顯示完整 UID",
    "显示完整 UID",
    "Show full UID"
  ],
  "autoTransport": [
    "自動連線 · 會自動嘗試可用的備援方式",
    "自动连接 · 会自动尝试可用的备用方式",
    "Automatic connection · available fallback selected for you"
  ],
  "importFailed": [
    "所有卡池匯入失敗；原存檔未變更。",
    "所有卡池导入失败；原存档未变更。",
    "All pools failed. Existing archives are unchanged."
  ],
  "PROXY_NOT_DEPLOYED": [
    "目前網站的備援連線未啟用（404），請聯絡網站維護者。",
    "当前网站的备用连接未启用（404），请联系网站维护者。",
    "This site’s backup connection is not enabled (404). Contact its maintainer."
  ],
  "PROXY_METHOD": [
    "目前網站的備援連線設定不正確（405），請聯絡網站維護者。",
    "当前网站的备用连接配置不正确（405），请联系网站维护者。",
    "This site’s backup connection is misconfigured (405). Contact its maintainer."
  ],
  "PROXY_UNAVAILABLE": [
    "目前網站的備援服務暫不可用（503），請稍後重試或聯絡維護者。",
    "当前网站的备用服务暂不可用（503），请稍后重试或联系维护者。",
    "This site’s backup service is unavailable (503). Retry later or contact its maintainer."
  ],
  "quickWindows": [
    "推薦方式 · 選擇日誌資料夾",
    "推荐方式 · 选择日志文件夹",
    "Recommended · choose a log folder"
  ],
  "quickWindowsHelp": [
    "先在遊戲開啟喚取歷史。在遊戲安裝位置開啟 Client/Saved/Logs，選擇該資料夾；本站只在本機讀取 Client.log 或 debug.log，不上傳、不修改遊戲檔案。",
    "先在游戏打开唤取历史。在游戏安装位置打开 Client/Saved/Logs，选择该文件夹；本站只在本机读取 Client.log 或 debug.log，不上传、不修改游戏文件。",
    "Open Convene History in-game. Find Client/Saved/Logs in the installation and choose that folder. Only Client.log or debug.log is read locally; game files are neither uploaded nor modified."
  ],
  "chooseLogFolder": [
    "選擇 Logs 資料夾",
    "选择 Logs 文件夹",
    "Choose Logs folder"
  ],
  "videoSoon": [
    "教學影片預留",
    "教学视频预留",
    "Video guide slot"
  ],
  "videoSoonHelp": [
    "影片尚未提供；請先使用上方推薦方式。",
    "视频尚未提供；请先使用上方推荐方式。",
    "Video not available yet; use the recommended method above."
  ],
  "quickFive": [
    "只看五星",
    "只看五星",
    "5★ only"
  ],
  "characterPlaceholder": [
    "角色立繪待補 · 名稱保留",
    "角色立绘待补 · 名称保留",
    "Portrait unavailable · identity retained"
  ],
  "weaponPlaceholder": [
    "武器素材待補 · 類別示意",
    "武器素材待补 · 类别示意",
    "Artwork pending · category placeholder"
  ],
  "acquisitionState": [
    "目前存檔可見",
    "当前存档可见",
    "Visible in this archive"
  ],
  "shareTargetLabel": [
    "記錄目標（非真實共鳴鏈）",
    "记录目标（非真实共鸣链）",
    "Archive target (not actual chain)"
  ],
  "noAchievements": [
    "成就等待點亮",
    "成就等待点亮",
    "No achievements unlocked"
  ],
  "achievementNext": [
    "只依目前存檔判定，保留每一步共鳴。",
    "仅依据当前存档判定，保留每一步共鸣。",
    "Based on the visible archive. Keep each resonance."
  ],
  "manualCover": [
    "手動維護封面 · 與個人取得紀錄無關",
    "手动维护封面 · 与个人取得记录无关",
    "Manual cover · independent of your pulls"
  ],
  "featuredCharacterCover": [
    "限定角色封面",
    "限定角色封面",
    "Featured Resonator cover"
  ],
  "featuredWeaponCover": [
    "限定武器封面",
    "限定武器封面",
    "Featured Weapon cover"
  ],
  "coverFallback": [
    "封面缺失 · 顯示最近取得圖片或類別佔位",
    "封面缺失 · 显示最近取得图片或类别占位",
    "Cover unavailable · latest artwork or category fallback"
  ],
  "psTitle": [
    "簡單取得 · PowerShell",
    "简单获取 · PowerShell",
    "Quick access · PowerShell"
  ],
  "psCommand": [
    "PowerShell 命令",
    "PowerShell 命令",
    "PowerShell command"
  ],
  "psCopy": [
    "複製 PowerShell 命令",
    "复制 PowerShell 命令",
    "Copy PowerShell command"
  ],
  "psDownload": [
    "下載本地腳本",
    "下载本地脚本",
    "Download local script"
  ],
  "psInspect": [
    "查看完整命令（可先審查）",
    "查看完整命令（可先审查）",
    "Inspect the full command"
  ],
  "psScope": [
    "本站命令只讀本機日誌並把網址複製到剪貼簿；不聯網、不改遊戲設定、不要求管理員。",
    "本站命令只读本机日志并把网址复制到剪贴板；不联网、不改游戏设置、不要求管理员。",
    "This local reader only reads logs and copies the URL. No network, game changes, or administrator rights."
  ],
  "psStep1": [
    "在遊戲開啟喚取歷史，保留遊戲執行。",
    "在游戏打开唤取历史，保持游戏运行。",
    "Open Convene History in game and keep the game running."
  ],
  "psStep2": [
    "複製下方命令，開啟 Windows PowerShell，先查看命令再貼上執行。",
    "复制下方命令，打开 Windows PowerShell，先查看命令再粘贴执行。",
    "Copy the command below, inspect it, then paste it into Windows PowerShell."
  ],
  "psStep3": [
    "自動尋找執行中的遊戲；無法取得路徑時，貼上遊戲資料夾或 Client.log 路徑。",
    "自动查找运行中的游戏；无法取得路径时，粘贴游戏文件夹或 Client.log 路径。",
    "It checks the running game. If unavailable, paste your game folder or Client.log path."
  ],
  "psStep4": [
    "看到複製成功後，回到本工具貼上網址並匯入。請勿公開該連結。",
    "看到复制成功后，返回本工具粘贴网址并导入。请勿公开该链接。",
    "After the copied message, return here, paste the URL and import. Keep the link private."
  ],
  "psSource": [
    "來源核查與第三方腳本風險",
    "来源核查与第三方脚本风险",
    "Source review and third-party risks"
  ],
  "psRisk": [
    "已核查 WuWa Tracker 固定版本的日誌/XOR流程；其腳本另含設定寫入與提權分支，本站未使用，也不下載執行。遠端腳本可能更新，請勿直接執行不理解的命令。",
    "已核查 WuWa Tracker 固定版本的日志/XOR流程；其脚本另含设置写入与提权分支，本站未使用，也不下载执行。远程脚本可能更新，请勿直接执行不理解的命令。",
    "The pinned Tracker log/XOR flow was reviewed. Its configuration-writing and elevation branches are not used or executed here. Remote scripts can change; inspect commands before running them."
  ],
  "psCopied": [
    "命令已複製；到 PowerShell 貼上執行。",
    "命令已复制；到 PowerShell 粘贴执行。",
    "Command copied. Paste into PowerShell."
  ],
  "psCopyManual": [
    "請在命令框按 Ctrl+C 複製。",
    "请在命令框按 Ctrl+C 复制。",
    "Press Ctrl+C in the selected command box."
  ],
  "emptyResult": [
    "連線成功，但官方未返回紀錄。請確認遊戲帳號與歷史可見範圍；原紀錄保留。",
    "连接成功，但官方未返回记录。请确认游戏账号与历史可见范围；原记录保留。",
    "Connected, but the API returned no records. Check the game account and available history; existing data is kept."
  ],
  "LINK_EXPIRED": [
    "官方明確回覆連結授權已失效；請在遊戲重新開啟歷史並取得新連結。",
    "官方明确回复链接授权已失效；请在游戏重新打开历史并获取新链接。",
    "The API explicitly reported expired link authorization. Reopen in-game history and get a fresh URL."
  ],
  "knownPulls": [
    "已記錄 {n} 抽",
    "已记录 {n} 抽",
    "{n} recorded pulls"
  ],
  "pullCount": [
    "{n} 抽",
    "{n} 抽",
    "{n} pulls"
  ],
  "remainingPulls": [
    "距離五星保底最多 {n} 抽",
    "距离五星保底最多 {n} 抽",
    "At most {n} pulls to a 5★"
  ],
  "incompletePrefix": [
    "前段紀錄不完整，實際抽數可能更多。",
    "前段记录不完整，实际抽数可能更多。",
    "Earlier history is incomplete; actual pulls may be higher."
  ],
  "state.unknown": [
    "UP 保證尚無足夠紀錄",
    "UP 保证尚无足够记录",
    "UP guarantee not yet established"
  ],
  "state.chance": [
    "目前小保底 · 50/50",
    "当前小保底 · 50/50",
    "Next 5★: 50/50"
  ],
  "state.guaranteed": [
    "目前大保底 · 下次五星必定 UP",
    "当前大保底 · 下次五星必定 UP",
    "Next 5★: guaranteed featured"
  ],
  "state.featured": [
    "五星必定為當期 UP 武器",
    "五星必定为当期 UP 武器",
    "5★ is the featured weapon"
  ],
  "source.history": [
    "歷史卡池資料",
    "历史卡池资料",
    "Banner archive"
  ],
  "source.unknown": [
    "資料不足",
    "资料不足",
    "Insufficient evidence"
  ],
  "collabCharacterPool": [
    "聯動角色",
    "联动角色",
    "Collab Resonator"
  ],
  "collabWeaponPool": [
    "聯動武器",
    "联动武器",
    "Collab Weapon"
  ],
  "rReason.investmentVerified": [
    "已依確認的目標卡池與完整五星區間加總投入。",
    "已依据确认的目标卡池与完整五星区间加总投入。",
    "Investment uses verified target banners and complete intervals."
  ],
  "rReason.unrelatedResults": [
    "區間含無法歸屬目標的其他五星，暫不評分。",
    "区间含无法归属目标的其他五星，暂不评分。",
    "Other 5★ outcomes cannot be attributed to this target; no score."
  ],
  "censoredSamples": [
    "{n} 個未知間隔未計分",
    "{n} 个未知间隔未计分",
    "{n} unknown intervals excluded"
  ],
  "ambiguousPool": [
    "卡池身份不明（已隔離）",
    "卡池身份不明（已隔离）",
    "Unidentified pool (isolated)"
  ],
  "fourPity": [
    "四星或以上保底",
    "四星或以上保底",
    "4★ or higher pity"
  ],
  "knownSpend": [
    "已知五星區間合計",
    "已知五星区间合计",
    "Known interval total"
  ],
  "neededCopies": [
    "還需取得",
    "还需取得",
    "Acquisitions remaining"
  ],
  "characterSample": [
    "{n} 個完整間隔 · 3 個起評級",
    "{n} 个完整间隔 · 3 个起评级",
    "{n} complete intervals · rated from 3"
  ],
  "characterFormula": [
    "角色取得評分只看完整五星間隔：平均 100×(H−N)/(H−1)。3 個有效間隔起授予稱號，不依賴 UP 判定；不是為此角色花費。",
    "角色取得评分只看完整五星间隔：平均 100×(H−N)/(H−1)。3 个有效间隔起授予称号，不依赖 UP 判定；不是为此角色花费。",
    "Acquisition score averages 100×(H−N)/(H−1) over complete intervals. Titles start at 3 valid samples and do not require UP outcomes. This is not character spending."
  ],
  "offlineFallback": [
    "備用：本站離線日誌讀取",
    "备用：本站离线日志读取",
    "Fallback: local offline log reader"
  ],
  "guideVerifiedScope": [
    "已核對公開教學與腳本；未在遊戲及 Android／iOS 實機完成操作驗證。",
    "已核对公开教学与脚本；未在游戏及 Android／iOS 实机完成操作验证。",
    "Public instructions and script reviewed; live game and Android/iOS device flows have not been tested."
  ],
  "thirdRisk": [
    "第三方 WuWa Tracker 固定版本指令：會下載並執行遠端程式。腳本可要求修改 Engine.ini（備份 .backup）、修復日誌 ACL／擁有者並提權；提權分支會改抓 710dffa 版本。請先審查原始碼，拒絕不理解的修改；喚取網址含私人授權。",
    "第三方 WuWa Tracker 固定版本指令：会下载并执行远程程序。脚本可要求修改 Engine.ini（备份 .backup）、修复日志 ACL／所有者并提权；提权分支会改抓 710dffa 版本。请先审查源码，拒绝不理解的修改；唤取网址含私人授权。",
    "This pinned WuWa Tracker command downloads and executes third-party code. It can request Engine.ini edits (.backup), log ACL/ownership repairs and elevation; elevated branches fetch revision 710dffa. Inspect the source before accepting changes. History URLs contain private authorization."
  ],
  "thirdStep1": [
    "啟動 Windows 版《鳴潮》，登入要匯入的帳號。",
    "启动 Windows 版《鸣潮》，登录要导入的账号。",
    "Launch Wuthering Waves on Windows and sign into the desired account."
  ],
  "thirdStep2": [
    "開啟遊戲的「喚取 → 歷史紀錄」，等待頁面載入。",
    "打开游戏的“唤取 → 历史记录”，等待页面加载。",
    "Open Convene → History in game and wait for the page to load."
  ],
  "thirdStep3": [
    "開啟 Windows PowerShell，查看並執行下方指令。",
    "打开 Windows PowerShell，查看并执行下方命令。",
    "Open Windows PowerShell, inspect the command below and run it."
  ],
  "thirdStep4": [
    "自行決定是否執行第三方指令；依提示選擇遊戲路徑。遇到修改權限或設定的提示，先了解影響。",
    "自行决定是否执行第三方指令；按提示选择游戏路径。遇到修改权限或设置的提示，先了解影响。",
    "If you choose to run it, follow its game-path prompts. Review any configuration or permission repair before accepting."
  ],
  "thirdStep5": [
    "依指令提示尋找遊戲日誌；取得網址後，複製完整喚取連結。",
    "按命令提示查找游戏日志；获取网址后，复制完整唤取链接。",
    "Follow the prompts to locate the game logs, then copy the complete history URL."
  ],
  "thirdStep6": [
    "回到本站「匯入／更新」，貼上完整網址並匯入。不要公開網址、終端截圖或日誌。",
    "返回本站“导入／更新”，粘贴完整网址并导入。不要公开网址、终端截图或日志。",
    "Return to Import/update here, paste the full URL and import. Keep the URL, terminal screenshots and logs private."
  ],
  "androidNew1": [
    "Android 11 以上可使用 Ascent 2.1.6。先下載並安裝 Ascent，連接 Wi-Fi 或熱點。",
    "Android 11 以上可使用 Ascent 2.1.6。先下载并安装 Ascent，连接 Wi-Fi 或热点。",
    "On Android 11 or later, download and install Ascent 2.1.6 and connect to Wi-Fi or a hotspot."
  ],
  "androidNew2": [
    "在系統開發人員選項開啟偵錯與無線偵錯，於 Ascent 點選 Pair／Start Pairing。",
    "在系统开发者选项开启调试和无线调试，在 Ascent 点击 Pair／Start Pairing。",
    "Enable debugging and Wireless debugging in Developer options, then choose Pair / Start Pairing in Ascent."
  ],
  "androidNew3": [
    "開啟「無線偵錯 → 使用配對碼配對」，將顯示的六位碼輸入 Ascent，再按 Connect。",
    "打开“无线调试 → 使用配对码配对”，将显示的六位码输入 Ascent，再点击 Connect。",
    "Open Wireless debugging → Pair with pairing code, enter the six-digit code in Ascent and select Connect."
  ],
  "androidNew4": [
    "開啟遊戲喚取歷史，返回 Ascent 複製擷取到的網址，貼入下方欄位。",
    "打开游戏唤取历史，返回 Ascent 复制捕获的网址，粘贴到下方输入框。",
    "Open in-game Convene History, return to Ascent and copy the captured URL into the field below."
  ],
  "androidNew5": [
    "取得連結後停止 Ascent，忘記配對裝置，關閉無線／USB 偵錯。",
    "获取链接后停止 Ascent，忘记配对设备，关闭无线／USB 调试。",
    "After retrieving the URL, stop Ascent, forget the paired device and disable Wireless/USB debugging."
  ],
  "androidAlternatives": [
    "參考站另有飛航模式與 Client.log 教學。飛航模式需在載入歷史前斷網，再從錯誤頁複製網址；新版 WebView 可能不顯示。可存取 Client.log 時可用本站離線解析；Android 儲存限制依版本及廠商不同。這兩種相容性未實機驗證，失敗可改用同帳號 Windows 匯入。",
    "参考站另有飞行模式与 Client.log 教学。飞行模式需在加载历史前断网，再从错误页复制网址；新版 WebView 可能不显示。可访问 Client.log 时可用本站离线解析；Android 存储限制依版本及厂商不同。这两种兼容性未实机验证，失败可改用同账号 Windows 导入。",
    "The reference also offers Airplane mode and Client.log methods. Disconnect before history loads, then copy the URL from the error page if exposed; newer WebViews may hide it. Accessible Client.log files can use our offline reader. Storage access varies by OS/vendor. These methods are untested on devices; Windows with the same account is an alternative."
  ],
  "ascentSource": [
    "Ascent 2.1.6 來源",
    "Ascent 2.1.6 来源",
    "Ascent 2.1.6 source"
  ],
  "iosNew1": [
    "安裝 Stream，開啟 HTTPS Sniffing 設定。",
    "安装 Stream，打开 HTTPS Sniffing 设置。",
    "Install Stream and open its HTTPS Sniffing settings."
  ],
  "iosNew2": [
    "使用 Safari 開啟 Stream 的憑證下載頁，確認憑證資訊後，到「設定 → 一般 → VPN 與裝置管理」安裝對應描述檔。",
    "使用 Safari 打开 Stream 的证书下载页，确认信息后，在“设置 → 通用 → VPN 与设备管理”安装对应描述文件。",
    "Open Stream’s certificate download page in Safari. Inspect it, then install its profile in Settings → General → VPN & Device Management."
  ],
  "iosNew3": [
    "到「設定 → 一般 → 關於本機 → 憑證信任設定」開啟對應根憑證的完整信任；返回 Stream 開始擷取。",
    "在“设置 → 通用 → 关于本机 → 证书信任设置”开启对应根证书的完全信任，再返回 Stream 开始捕获。",
    "Enable full trust for the matching root certificate in Settings → General → About → Certificate Trust Settings, then start capture in Stream."
  ],
  "iosNew4": [
    "在 Stream 開始擷取後開啟遊戲喚取歷史，再停止擷取。於 aki-gm-resources 的歷史網頁請求複製完整 URL，貼到本站。原影片使用 API JSON 匯入參考站，本站應使用歷史網址，不能直接貼 API 回應 JSON。",
    "在 Stream 开始捕获后打开游戏唤取历史，再停止捕获。在 aki-gm-resources 的历史网页请求复制完整 URL，贴到本站。原视频使用 API JSON 导入参考站，本站应使用历史网址，不能直接贴 API 响应 JSON。",
    "Start Stream capture, open in-game Convene History, then stop capture. Copy the full aki-gm-resources history-page request URL and import it here. The original video imports API JSON into Tracker; this tool requires the history URL rather than API response JSON."
  ],
  "iosNew5": [
    "用完關閉擷取及 VPN，撤銷完整信任；到 設定 → 一般 → VPN 與裝置管理 移除 Stream 的憑證描述檔，並刪除擷取記錄。請勿移除工作／學校管理設定。",
    "用完关闭捕获及 VPN，撤销完全信任；到 设置 → 通用 → VPN 与设备管理 移除 Stream 的证书描述文件，并删除捕获记录。请勿移除工作／学校管理设置。",
    "Afterward stop capture and VPN, revoke full trust, remove Stream’s certificate profile in Settings → General → VPN & Device Management, and delete captured sessions. Do not remove work or school management profiles."
  ],
  "iosAlternative": [
    "不願安裝憑證時，可在 Windows 登入同一遊戲帳號取得歷史網址，再將網址私下傳回本機。已觀看教學中的 Stream 與憑證流程；目前 iOS 版本及本站 URL 取得流程未在實機測試。",
    "不愿安装证书时，可在 Windows 登录同一游戏账号获取历史网址，再将网址私下传回本机。已观看教学中的 Stream 与证书流程；当前 iOS 版本及本站 URL 获取流程未在实机测试。",
    "If you prefer to avoid certificates, get the history URL using the same game account on Windows and transfer it privately. Stream and certificate steps were reviewed in the video; current iOS and URL retrieval for this tool are not device-tested."
  ],
  "iosVideo": [
    "原作者 iOS 影片",
    "原作者 iOS 视频",
    "Original iOS video"
  ],
  "certificateHelp": [
    "Apple 憑證說明",
    "Apple 证书说明",
    "Apple certificate help"
  ],
  "bond.observing.desc": [
    "相遇已被珍藏，累積更多完整間隔後點亮稱號。",
    "相遇已被珍藏，积累更多完整间隔后点亮称号。",
    "Your acquisitions are saved. More complete intervals will unlock a title."
  ],
  "bond.fate.desc": [
    "命運早已回應，每次相遇都格外耀眼。",
    "命运早已回应，每次相遇都格外耀眼。",
    "Fate has answered; every encounter shines."
  ],
  "bond.star.desc": [
    "星光偏愛，這段共鳴之旅格外順遂。",
    "星光偏爱，这段共鸣之旅格外顺遂。",
    "Starlight favors this shared journey."
  ],
  "bond.lucky.desc": [
    "每次相遇，都是恰到好處的回響。",
    "每次相遇，都是恰到好处的回响。",
    "Each encounter arrives as a welcome echo."
  ],
  "bond.steady.desc": [
    "一路同行，讓相遇成為值得珍藏的紀錄。",
    "一路同行，让相遇成为值得珍藏的记录。",
    "Every encounter becomes a memory to keep."
  ],
  "bond.headwind.desc": [
    "即使繞了遠路，也終於迎來那道身影。",
    "即使绕了远路，也终于迎来那道身影。",
    "A longer road still leads to a familiar face."
  ],
  "bond.abyss.desc": [
    "等待或許漫長，但相遇依然珍貴。",
    "等待或许漫长，但相遇依然珍贵。",
    "The wait may be long; the encounter remains precious."
  ],
  "pull1": [
    "共鳴啟程",
    "共鸣启程",
    "First Echo"
  ],
  "condition.pull1": [
    "記錄至少 1 抽",
    "记录至少 1 抽",
    "Record 1 pull"
  ],
  "pull100": [
    "百次回響",
    "百次回响",
    "Hundred Echoes"
  ],
  "condition.pull100": [
    "記錄 100 抽",
    "记录 100 抽",
    "Record 100 pulls"
  ],
  "pull500": [
    "潮聲不息",
    "潮声不息",
    "Unending Tides"
  ],
  "condition.pull500": [
    "記錄 500 抽",
    "记录 500 抽",
    "Record 500 pulls"
  ],
  "pull1000": [
    "千星之路",
    "千星之路",
    "Thousand-star Path"
  ],
  "condition.pull1000": [
    "記錄 1000 抽",
    "记录 1000 抽",
    "Record 1,000 pulls"
  ],
  "pull3000": [
    "星海遠航",
    "星海远航",
    "Starsea Voyager"
  ],
  "condition.pull3000": [
    "記錄 3000 抽",
    "记录 3000 抽",
    "Record 3,000 pulls"
  ],
  "gold1": [
    "初見星光",
    "初见星光",
    "First Starlight"
  ],
  "condition.gold1": [
    "取得 1 次五星",
    "取得 1 次五星",
    "Obtain 1 five-star"
  ],
  "gold10": [
    "十星回應",
    "十星回应",
    "Ten Replies"
  ],
  "condition.gold10": [
    "取得 10 次五星",
    "取得 10 次五星",
    "Obtain 10 five-stars"
  ],
  "gold30": [
    "星群相聚",
    "星群相聚",
    "Gathering Stars"
  ],
  "condition.gold30": [
    "取得 30 次五星",
    "取得 30 次五星",
    "Obtain 30 five-stars"
  ],
  "gold100": [
    "百星共鳴",
    "百星共鸣",
    "Hundred-star Chorus"
  ],
  "condition.gold100": [
    "取得 100 次五星",
    "取得 100 次五星",
    "Obtain 100 five-stars"
  ],
  "fiveEarly": [
    "星光常臨",
    "星光常临",
    "Frequent Visitors"
  ],
  "condition.fiveEarly": [
    "5 個完整五星間隔均不超過 20 抽",
    "5 个完整五星间隔均不超过 20 抽",
    "Record 5 complete five-star intervals of 20 pulls or less"
  ],
  "hard": [
    "終點之光",
    "终点之光",
    "Light at the Limit"
  ],
  "condition.hard": [
    "1 次完整五星間隔達到該池硬保底",
    "1 次完整五星间隔达到该池硬保底",
    "One complete interval reaches its pool’s hard pity"
  ],
  "characters5": [
    "五音相和",
    "五音相和",
    "Five Voices"
  ],
  "condition.characters5": [
    "記錄 5 位不同四星或五星角色",
    "记录 5 位不同四星或五星角色",
    "Record 5 distinct four/five-star Resonators"
  ],
  "characters10": [
    "同行之眾",
    "同行之众",
    "Many Companions"
  ],
  "condition.characters10": [
    "記錄 10 位不同四星或五星角色",
    "记录 10 位不同四星或五星角色",
    "Record 10 distinct four/five-star Resonators"
  ],
  "weapons5": [
    "五刃成詩",
    "五刃成诗",
    "Five Blades"
  ],
  "condition.weapons5": [
    "記錄 5 種不同四星或五星武器",
    "记录 5 种不同四星或五星武器",
    "Record 5 distinct four/five-star weapons"
  ],
  "weapons10": [
    "兵器譜",
    "兵器谱",
    "Armory Chronicle"
  ],
  "condition.weapons10": [
    "記錄 10 種不同四星或五星武器",
    "记录 10 种不同四星或五星武器",
    "Record 10 distinct four/five-star weapons"
  ],
  "seven": [
    "七次相逢",
    "七次相逢",
    "Seven Encounters"
  ],
  "condition.seven": [
    "同一角色記錄 7 次五星取得（不等於實際共鳴鏈）",
    "同一角色记录 7 次五星取得（不等于实际共鸣链）",
    "Record 7 five-star acquisitions of one Resonator; not proof of owned chains"
  ],
  "collab": [
    "異界回聲",
    "异界回声",
    "Otherworld Echo"
  ],
  "condition.collab": [
    "在已識別聯動池取得 1 次五星",
    "在已识别联动池取得 1 次五星",
    "Obtain one five-star in an identified collab pool"
  ],
  "weaponGold": [
    "鋒芒初現",
    "锋芒初现",
    "First Golden Edge"
  ],
  "condition.weaponGold": [
    "取得 1 次五星武器",
    "取得 1 次五星武器",
    "Obtain one five-star weapon"
  ],
  "fourCollect": [
    "紫曜流光",
    "紫曜流光",
    "Violet Chorus"
  ],
  "condition.fourCollect": [
    "記錄 30 次四星取得",
    "记录 30 次四星取得",
    "Record 30 four-star acquisitions"
  ],
  "months": [
    "六季潮汐",
    "六季潮汐",
    "Six Months of Tides"
  ],
  "condition.months": [
    "記錄涵蓋 6 個不同月份",
    "记录涵盖 6 个不同月份",
    "Save records from 6 distinct months"
  ],
  "optionalTarget": [
    "可選：R0～R6 目標比較",
    "可选：R0～R6 目标比较",
    "Optional: R0–R6 target comparison"
  ],
  "newVoyageCharacterPool": [
    "新航角色",
    "新航角色",
    "New Voyage Resonator"
  ],
  "newVoyageWeaponPool": [
    "新航武器",
    "新航武器",
    "New Voyage Weapon"
  ],
  "reverbCharacterPool": [
    "回響角色",
    "回响角色",
    "Reverb Resonator"
  ],
  "reverbWeaponPool": [
    "回響武器",
    "回响武器",
    "Reverb Weapon"
  ],
  "guideLead": [
    "選擇裝置與取得方式，依步驟匯入喚取紀錄。",
    "选择设备与获取方式，按步骤导入唤取记录。",
    "Choose your device and a method, then follow the steps to import your history."
  ],
  "guidePlatform": [
    "使用裝置",
    "使用设备",
    "Device"
  ],
  "guideMethod": [
    "取得方式",
    "获取方式",
    "Method"
  ],
  "platform.windows": [
    "Windows",
    "Windows",
    "Windows"
  ],
  "platform.android": [
    "Android",
    "Android",
    "Android"
  ],
  "platform.ios": [
    "iOS",
    "iOS",
    "iOS"
  ],
  "platform.ps5": [
    "PS5",
    "PS5",
    "PS5"
  ],
  "platform.xbox": [
    "Xbox",
    "Xbox",
    "Xbox"
  ],
  "platform.macos": [
    "macOS",
    "macOS",
    "macOS"
  ],
  "platform.linux": [
    "Linux",
    "Linux",
    "Linux"
  ],
  "methodAuto": [
    "自動取得",
    "自动获取",
    "Automatic"
  ],
  "methodLog": [
    "日誌檔案",
    "日志文件",
    "Log file"
  ],
  "methodLocal": [
    "本機讀取指令",
    "本地读取命令",
    "Local reader"
  ],
  "methodAirplane": [
    "飛航模式",
    "飞行模式",
    "Airplane mode"
  ],
  "methodAscent": [
    "Ascent",
    "Ascent",
    "Ascent"
  ],
  "methodStream": [
    "Stream 擷取",
    "Stream 捕获",
    "Stream capture"
  ],
  "methodPageInfo": [
    "頁面資訊",
    "页面信息",
    "Page information"
  ],
  "methodURL": [
    "複製網址",
    "复制网址",
    "Copy URL"
  ],
  "methodTerminal": [
    "終端指令",
    "终端命令",
    "Terminal command"
  ],
  "copyCommand": [
    "複製指令",
    "复制命令",
    "Copy command"
  ],
  "downloadCommand": [
    "下載指令檔",
    "下载命令文件",
    "Download command"
  ],
  "guideFinish": [
    "將取得的資料帶入匯入欄位，按下「開始匯入」。",
    "将获取的资料带入导入栏，点击“开始导入”。",
    "Place the retrieved data in the import field and select Start import."
  ],
  "guideGameHistory": [
    "啟動遊戲，登入要匯入的帳號，開啟「喚取 → 歷史紀錄」。",
    "启动游戏，登录要导入的账号，打开“唤取 → 历史记录”。",
    "Launch the game, sign into the desired account and open Convene → History."
  ],
  "windowsLog1": [
    "開啟遊戲安裝資料夾，前往 Client/Saved/Logs，找到 Client.log。也可選擇遊戲網頁元件的 debug.log。",
    "打开游戏安装文件夹，进入 Client/Saved/Logs，找到 Client.log。也可选择游戏网页组件的 debug.log。",
    "Open the game installation folder, go to Client/Saved/Logs and locate Client.log. The game web component’s debug.log is also supported."
  ],
  "guideSelectLog": [
    "選取 Client.log 或 debug.log，讀取完成後會自動帶入匯入欄位。",
    "选择 Client.log 或 debug.log，读取完成后会自动填入导入栏。",
    "Select Client.log or debug.log. The extracted URL will fill the import field."
  ],
  "localCommandStep": [
    "開啟 Windows PowerShell，複製並執行下方本機讀取指令；依提示選擇遊戲資料夾或日誌路徑。",
    "打开 Windows PowerShell，复制并执行下方本地读取命令；按提示选择游戏文件夹或日志路径。",
    "Open Windows PowerShell and run the local reader below. Follow its prompt for the game folder or log path."
  ],
  "androidFlight1": [
    "啟動遊戲並完成登入，進入喚取介面。",
    "启动游戏并完成登录，进入唤取界面。",
    "Launch the game, sign in and open the Convene screen."
  ],
  "androidFlight2": [
    "打開系統快捷設定，開啟飛航模式，確認 Wi-Fi 與行動網路皆已中斷。",
    "打开系统快捷设置，开启飞行模式，确认 Wi-Fi 和移动网络均已断开。",
    "Enable Airplane mode in Quick Settings and ensure both Wi-Fi and mobile data are disconnected."
  ],
  "androidFlight3": [
    "返回遊戲開啟歷史紀錄；載入失敗時，從錯誤頁選取並複製完整網址。",
    "返回游戏打开历史记录；加载失败时，从错误页选中并复制完整网址。",
    "Open History in game. When loading fails, select and copy the complete URL shown on the error page."
  ],
  "androidFlight4": [
    "關閉飛航模式並恢復網路，再貼上連結。若錯誤頁沒有顯示網址，改選日誌檔案或 Ascent。",
    "关闭飞行模式并恢复网络，再粘贴链接。若错误页未显示网址，改用日志文件或 Ascent。",
    "Turn off Airplane mode and reconnect before pasting the URL. If it is not exposed on the error page, use Log file or Ascent."
  ],
  "androidLog1": [
    "使用檔案管理器，在遊戲資料目錄找到 Client.log。資料夾位置與存取權限依系統版本而異；無法存取時可改用其他取得方式。",
    "使用文件管理器，在游戏数据目录找到 Client.log。文件夹位置和访问权限因系统版本而异；无法访问时可切换其他获取方式。",
    "Use a file manager to locate Client.log in the game data directory. Locations and access permissions vary by system version; use another method if access is unavailable."
  ],
  "downloadAscent": [
    "下載 Ascent 2.1.6",
    "下载 Ascent 2.1.6",
    "Download Ascent 2.1.6"
  ],
  "iosCapture": [
    "開啟遊戲喚取歷史，再停止擷取。在 Stream 找到喚取查詢請求，複製 Request Body／請求本文的 JSON（包含 playerId、recordId、serverId、cardPoolId）；也可複製歷史網頁的完整 URL。",
    "打开游戏唤取历史，再停止捕获。在 Stream 找到唤取查询请求，复制 Request Body／请求正文的 JSON（包含 playerId、recordId、serverId、cardPoolId）；也可复制历史网页的完整 URL。",
    "Open in-game Convene History and stop capture. In Stream, copy the query request body JSON containing playerId, recordId, serverId and cardPoolId, or copy the full history-page URL."
  ],
  "iosCleanup": [
    "取得資料後關閉擷取及 VPN，撤銷憑證完整信任，並移除 Stream 的憑證描述檔與擷取記錄。",
    "获取资料后关闭捕获和 VPN，撤销证书完全信任，并移除 Stream 的证书描述文件和捕获记录。",
    "After retrieving the data, stop capture and VPN, revoke full certificate trust and remove Stream’s certificate profile and captured sessions."
  ],
  "ps5Options": [
    "在喚取歷史頁按下控制器的 Options 按鈕。",
    "在唤取历史页按下控制器的 Options 按钮。",
    "Press the controller’s Options button while on the history page."
  ],
  "ps5Page": [
    "開啟「頁面資訊」，找到網址內的 player_id 與 record_id。",
    "打开“页面信息”，找到网址中的 player_id 和 record_id。",
    "Open Page Information and locate player_id and record_id in the URL."
  ],
  "ps5Fields": [
    "將這兩個欄位填入下方。UID 對應的伺服器會自動帶入。",
    "将这两个字段填入下方，系统会自动带入 UID 对应的服务器。",
    "Enter those two fields below. The matching server will be filled automatically."
  ],
  "xboxCopy": [
    "選取歷史頁的完整網址，按 B 返回，再按選單（☰）並選擇「複製」。",
    "选中历史页的完整网址，按 B 返回，再按菜单（☰）并选择“复制”。",
    "Select the full history URL, press B, then open Menu (☰) and choose Copy."
  ],
  "xboxPaste": [
    "在下方欄位開啟選單（☰），選擇「貼上」。也可將連結私下傳至其他裝置後匯入。",
    "在下方输入框打开菜单（☰），选择“粘贴”。也可将链接私下传到其他设备后导入。",
    "Open Menu (☰) in the field below and choose Paste. You can also transfer the URL privately to another device."
  ],
  "macTerminal": [
    "開啟 macOS「終端機」。下方本機指令需要 Perl；若無法使用，可切換到日誌檔案方式。",
    "打开 macOS“终端”。下方本地命令需要 Perl；若不可用，可切换到日志文件方式。",
    "Open Terminal on macOS. The local command below requires Perl; use Log file if it is unavailable."
  ],
  "macCommandStep": [
    "執行下方指令，取得網址後會顯示在終端機並複製到剪貼簿。",
    "执行下方命令，获取的网址会显示在终端并复制到剪贴板。",
    "Run the command below. The retrieved URL will be displayed and copied to the clipboard."
  ],
  "macLog": [
    "在 Finder 按 Command + Shift + G，前往 ~/Library/Containers/com.kurogame.wutheringwaves.global/Data/Library/Logs/Client，選取 Client.log。",
    "在 Finder 按 Command + Shift + G，进入 ~/Library/Containers/com.kurogame.wutheringwaves.global/Data/Library/Logs/Client，选择 Client.log。",
    "In Finder, press Command + Shift + G and open ~/Library/Containers/com.kurogame.wutheringwaves.global/Data/Library/Logs/Client, then select Client.log."
  ],
  "linuxTerminal": [
    "開啟終端機，準備執行 Bash 指令。",
    "打开终端，准备执行 Bash 命令。",
    "Open a terminal with Bash available."
  ],
  "linuxRun": [
    "查看並執行下方指令。若沒有自動找到遊戲，依提示輸入 Steam／Wine 的遊戲安裝路徑。",
    "查看并执行下方命令。若未自动找到游戏，按提示输入 Steam／Wine 的游戏安装路径。",
    "Inspect and run the command below. If the game is not found automatically, enter its Steam/Wine installation path when prompted."
  ],
  "linuxLog": [
    "開啟 Steam／Wine 中的遊戲安裝目錄，前往 Client/Saved/Logs，選取 Client.log。",
    "打开 Steam／Wine 中的游戏安装目录，进入 Client/Saved/Logs，选择 Client.log。",
    "Open the game installation directory in Steam/Wine, go to Client/Saved/Logs and select Client.log."
  ],
  "inputURLJSON": [
    "貼上歷史 URL 或請求 JSON",
    "粘贴历史 URL 或请求 JSON",
    "Paste the history URL or request JSON"
  ],
  "inputHistoryURL": [
    "貼上完整喚取連結",
    "粘贴完整唤取链接",
    "Paste the complete history URL"
  ],
  "useImportData": [
    "帶入匯入資料",
    "填入导入资料",
    "Use this import data"
  ],
  "guideNotes": [
    "使用說明與來源",
    "使用说明与来源",
    "Notes and sources"
  ],
  "guidePrivacy": [
    "喚取連結與請求 JSON 含有帳號授權。請勿公開分享。日誌在本機解析，授權資料僅用於這次查詢。",
    "唤取链接与请求 JSON 包含账号授权，请勿公开分享。日志在本机解析，授权资料仅用于本次查询。",
    "History URLs and request JSON contain account authorization. Keep them private. Logs are parsed locally and authorization is used only for this query."
  ],
  "commandRisk.remoteWindows": [
    "此指令會下載並執行 WuWa Tracker 腳本；部分分支會詢問修改 Engine.ini 或修復日誌權限，並可能要求管理員權限。執行前可開啟下方原始碼查看。",
    "此命令会下载并执行 WuWa Tracker 脚本；部分分支会询问修改 Engine.ini 或修复日志权限，并可能要求管理员权限。运行前可打开下方源码查看。",
    "This command downloads and runs the WuWa Tracker script. Some branches request Engine.ini changes, log permission repairs or administrator rights. Inspect its source before running."
  ],
  "commandRisk.remoteLinux": [
    "此指令會下載並執行遠端 Bash 腳本，尋找遊戲日誌及喚取網址。執行前可查看原始碼。",
    "此命令会下载并执行远程 Bash 脚本，查找游戏日志与唤取网址。运行前可查看源码。",
    "This command downloads and runs a remote Bash script to find the game logs and history URL. You can inspect its source before running."
  ],
  "commandRisk.localWindows": [
    "本機讀取指令只讀取日誌並複製網址，不下載遠端程式。",
    "本地读取命令只读取日志并复制网址，不下载远程程序。",
    "The local reader reads logs and copies the URL without downloading remote code."
  ],
  "commandRisk.localMac": [
    "本機 Perl 指令讀取 Client.log 並複製網址，不修改遊戲檔案、不聯網。",
    "本地 Perl 命令读取 Client.log 并复制网址，不修改游戏文件、不联网。",
    "The local Perl command reads Client.log and copies the URL without modifying game files or accessing the network."
  ],
  "viewScript": [
    "查看腳本原始碼",
    "查看脚本源码",
    "View script source"
  ],
  "watchGuide": [
    "觀看操作示範",
    "观看操作演示",
    "Watch the walkthrough"
  ],
  "allGuideSources": [
    "方法來源",
    "方法来源",
    "Method source"
  ],
  "INVALID_IMPORT_JSON": [
    "請貼上喚取查詢的請求本文 JSON，須包含帳號、伺服器、recordId 及 cardPoolId；不要貼回應資料。",
    "请粘贴唤取查询的请求正文 JSON，需包含账号、服务器、recordId 和 cardPoolId；不要粘贴响应数据。",
    "Paste the query request body JSON containing the account, server, recordId and cardPoolId, rather than response data."
  ],
  "INVALID_CONSOLE_INPUT": [
    "請輸入完整的九位 UID 與 record_id；無法識別的伺服器可改用完整喚取連結。",
    "请输入完整的九位 UID 和 record_id；无法识别的服务器可改用完整唤取链接。",
    "Enter the complete nine-digit UID and record_id. For unrecognized servers, use the full history URL."
  ],
  "remoteCommandHint": [
    "這個指令會下載並執行遠端腳本，可先在使用說明開啟原始碼查看。",
    "此命令会下载并执行远程脚本，可先在使用说明中打开源码查看。",
    "This command downloads and runs a remote script. Its source is available in Notes and sources."
  ],
  "iosTrustNote": [
    "完整信任根憑證會允許 Stream 檢查 HTTPS 流量。擷取期間避免操作其他私人 App，完成後停用並移除對應憑證。",
    "完全信任根证书会允许 Stream 检查 HTTPS 流量。捕获期间避免操作其他私人 App，完成后停用并移除对应证书。",
    "Trusting the root certificate allows Stream to inspect HTTPS traffic. Avoid other private apps during capture and disable and remove its certificate afterward."
  ],
  "reportLabel": [
    "共鳴星運報告",
    "共鸣星运报告",
    "RESONANCE FORTUNE REPORT"
  ],
  "luckyHighlights": [
    "幸運高光",
    "幸运高光",
    "Fortune highlights"
  ],
  "highlightFastest": [
    "最快一次：{n} 抽迎來五星",
    "最快一次：{n} 抽迎来五星",
    "Fastest five-star: {n} pulls"
  ],
  "highlightStreak": [
    "連續 {n} 次在 20 抽內迎來五星",
    "连续 {n} 次在 20 抽内迎来五星",
    "{n} consecutive five-stars within 20 pulls"
  ],
  "highlightEarly": [
    "{n} 次在 10 抽內迎來五星",
    "{n} 次在 10 抽内迎来五星",
    "{n} five-stars within 10 pulls"
  ],
  "highlightUP": [
    "已確認小保勝出 {n} / {total} 次",
    "已确认小保胜出 {n} / {total} 次",
    "Confirmed chance wins: {n} / {total}"
  ],
  "noReliableHighlight": [
    "尚無足夠精確區間可產生高光",
    "尚无足够精确区间可产生高光",
    "No exact intervals available for a highlight"
  ],
  "evidenceOnly": [
    "僅使用已確認的連續記錄",
    "仅使用已确认的连续记录",
    "Based on confirmed continuous records"
  ],
  "allAcquisitions": [
    "每一次共鳴，完整記錄",
    "每一次共鸣，完整记录",
    "Every acquisition, in order"
  ],
  "acquisitionOrdinal": [
    "第 {n} 次",
    "第 {n} 次",
    "No. {n}"
  ],
  "exactShort": [
    "精確間隔",
    "精确间隔",
    "Exact interval"
  ],
  "lowerBoundShort": [
    "已記錄下限",
    "已记录下限",
    "Recorded lower bound"
  ],
  "unknownInterval": [
    "間隔未知",
    "间隔未知",
    "Interval unknown"
  ],
  "sumIntervals": [
    "有效間隔合計",
    "有效间隔合计",
    "Exact-interval sum"
  ],
  "sumIntervalsNote": [
    "僅加總精確五星間隔，不等於目標角色實際投入。",
    "仅加总精确五星间隔，不等于目标角色实际投入。",
    "Sum of exact five-star intervals; not confirmed target spending."
  ],
  "reportCoverage": [
    "{n} 次取得缺少精確間隔 · {gaps} 處記錄缺口",
    "{n} 次取得缺少精确间隔 · {gaps} 处记录缺口",
    "{n} acquisitions lack exact intervals · {gaps} history gaps"
  ],
  "allShown": [
    "完整顯示 {n} 次取得",
    "完整显示 {n} 次取得",
    "All {n} acquisitions shown"
  ],
  "reliableUP": [
    "已確認 UP 結果",
    "已确认 UP 结果",
    "Confirmed UP results"
  ],
  "unknownUPNote": [
    "未知結果不計入小保勝率",
    "未知结果不计入小保胜率",
    "Unknown results are excluded from chance-win rate"
  ],
  "representativeAchievements": [
    "代表性幸運成就",
    "代表性幸运成就",
    "Representative fortune achievements"
  ],
  "characterAutomatic": [
    "自動角色星運 · 依取得間隔評定",
    "自动角色星运 · 依取得间隔评定",
    "Automatic character fortune · acquisition intervals"
  ],
  "optionalTargetSeparate": [
    "可選目標分析，與自動星運獨立",
    "可选目标分析，与自动星运独立",
    "Optional target analysis · separate from automatic fortune"
  ],
  "targetInvestment": [
    "可確認目標投入",
    "可确认目标投入",
    "Confirmed target spending"
  ],
  "poolUnknown": [
    "卡池身分未確認",
    "卡池身份未确认",
    "Banner identity unconfirmed"
  ],
  "intervalAnomaly": [
    "區間異常，未納入評分",
    "区间异常，未纳入评分",
    "Anomalous interval · excluded"
  ],
  "IMAGE_TOO_LARGE": [
    "取得記錄過多，超出瀏覽器單張圖片上限；未截斷任何記錄。",
    "取得记录过多，超出浏览器单张图片上限；未截断任何记录。",
    "This complete report exceeds the browser image limit. No records were truncated."
  ],
  "firstTier": [
    "第一階",
    "第一阶",
    "Tier I"
  ],
  "tierWord": [
    "星運等階",
    "星运等阶",
    "Fortune tier"
  ],
  "cabinet": [
    "成就展示櫃",
    "成就展示柜",
    "Achievement cabinet"
  ],
  "rarity.legendary": [
    "傳說",
    "传说",
    "Legendary"
  ],
  "rarity.epic": [
    "史詩",
    "史诗",
    "Epic"
  ],
  "rarity.rare": [
    "稀有",
    "稀有",
    "Rare"
  ],
  "rarity.common": [
    "普通",
    "普通",
    "Common"
  ],
  "rarityDisclaimer": [
    "稀有度依本工具的成就難度分級，並非全服解鎖率。",
    "稀有度依本工具的成就难度分级，并非全服解锁率。",
    "Rarity reflects achievement difficulty in this tool, not population unlock rates."
  ],
  "illustrativeCover": [
    "示意封面 · 非官方宣傳圖",
    "示意封面 · 非官方宣传图",
    "Illustrative cover · not official art"
  ],
  "cabinetOpen": [
    "查看收藏展示櫃",
    "查看收藏展示柜",
    "Open collection cabinet"
  ]
};
function create(locale='zh-CN'){const index={'zh-TW':0,'zh-CN':1,en:2}[locale]??1;return (key,params={})=>String(rows[key]?.[index]||key).replace(/\{(\w+)\}/g,(_,k)=>params[k]??'{'+k+'}');}
function poolName(pool,t){return t((Core.POOLS[pool]?.key||'unknown')+'Pool')+(pool>=8&&pool<101?' '+pool:'');}
return {rows,create,poolName};});
