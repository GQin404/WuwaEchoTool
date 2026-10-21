# 截圖辨識名稱對照

`js/screenshot-name-aliases.js` 只儲存名稱別名，鍵是 `base.js` 現有 `costList.name`。比對成功後仍由 `CharacterCore.createEcho` 取用原 catalog 的簡中名稱、ID、Cost、圖片；沒有新增聲骸種類或圖片來源，也沒有執行期外部名稱 API。

2026-10-10 從 [encore.moe 多語名稱資料](https://www.encore.moe/echo?lang=zh-Hant) 核對公開繁中、簡中、英文名稱，依同一筆遊戲識別碼建立別名，再限制為既有 catalog 的交集。來源端點為 `https://api-v2.encore.moe/api/{en,zh-Hans,zh-Hant}/echo`。只有名稱欄位被保留至別名檔。

目前涵蓋 185 / 186 筆；現有暱稱「冰墩墩」沒有可靠外語對照，保留原名比對與手動選擇。舊目錄「无归谬误」「巡宵枪卫」分別接受遊戲名稱「无归的谬误」「巡霄枪卫」及其語系名稱，但不改寫原目錄。

比對忽略大小寫、標點、空白，使用完整名稱及 Cost，避免把本體、夢魘、異相與部位變體混在一起。不以模糊翻譯或名稱片段猜測種類。未識別或拼錯的 OCR 名稱仍需手動確認。

`tests/screenshot-recognition.test.cjs` 逐筆驗證全部別名能回到既有簡中 catalog；未確認的辨識結果不寫入資料。
