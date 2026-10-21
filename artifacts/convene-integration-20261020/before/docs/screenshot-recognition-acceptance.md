# Register 截圖辨識 Beta 驗收

完成於 2026-10-10。僅本機實作及驗收，未部署。

## 驗收入口

啟動 `node artifacts/screenshot-recognition/server.cjs` 後，可從 http://127.0.0.1:8765/index.html?view=register 進入聲骸庫，或開啟 http://127.0.0.1:8765/register-workspace.html?view=register&mode=library 。點「新增聲骸」會先跳出「手動輸入／截圖辨識 Beta」選擇面板。辨識屬於聲骸庫入口；既有資料匯入頁維持原流程。返回聲骸庫再開啟辨識，會清空上一輪圖片、校對結果及重複上傳紀錄；已寫入的聲骸保留於聲骸庫。離開時取消背景辨識，遲到結果不會更新新一輪。

直接雙擊 HTML（`file://`）時會顯示明確說明並停用圖片上傳，請使用本機伺服器或 HTTPS 網站；從 index 首頁導覽本身不影響辨識。選圖去重已改用專案既有 CryptoJS，不依賴受安全來源限制的 `crypto.subtle`。模型使用 HTTP 快取、停用 IndexedDB 模型快取，載入與辨識皆顯示狀態，支援取消、逾時提示及重新辨識。

名稱先以繁中／英文別名對應現有簡中 catalog，再由 Core 取用既有名稱、Cost 與圖片。185 / 186 筆已有外語名稱對照，「冰墩墩」保留原名與手動選擇。[名稱對照範圍](screenshot-recognition-names.md)

攻擊、防禦、生命依數值後的 `%` 判斷加成或固定值；支援全形 `％`。校對的主／副詞條類型與數值都是下拉選單，數值直接取自新增聲骸使用的 mains／fctValue。更換類型會清空舊值，更換 Cost 會清除不相容的主詞條。

流程：上傳 → 本機辨識 → 逐張校對 → 勾選確認 → 寫入；該批全部成功寫入後自動返回並更新聲骸庫，清空辨識暫存。若仍有未寫入或失敗項目，留在校對頁。預設目的地是聲骸庫。只有有效的手動角色上下文才提供加入該角色的下一個位置；需要使用者明確選擇，沒有依圖片順序分配五槽。

## 實圖辨識結果

使用提供的五張原始圖片，未改寫原圖。每張產生一筆聲骸結果；左側列表沒有產生資料。

| 原圖 | catalog 對應 | Cost / 主詞條 | 副詞條 |
| --- | --- | --- | --- |
| 1 | 共鳴回響・天演溯心，181 | 4 / 暴擊傷害 44% | 5/5；單行重讀補回暴擊 7.5% |
| 2 | 解形煞，184 | 3 / 導電傷害加成 30% | 5/5 |
| 3 | 絕息魄，183 | 3 / 導電傷害加成 30% | 5/5 |
| 4 | 玉冥蛇，186 | 1 / 攻擊加成 18% | 5/5 |
| 5 | OCR 首字誤讀，保持未選擇；提供「霁息兽尊·首」，175，候選按鈕待確認 | 1 / 攻擊加成 18% | 5/5；單行重讀補回固定防禦 40 |

五張提供原圖的 25 條副詞條均與人工讀數一致，沒有補零。只有完整七行屬性結構才會對漏讀的副詞條做單行裁切重讀，並驗證既有合法檔位。名稱完整比對成功才自動選取；差一個字且 Cost 相符的名稱只提供候選，不自動套用。圖 5 的正確名稱「霽息獸尊・首」可對應 175，但本次 OCR 讀錯首字，因此仍需點選候選或手動校正。套裝無法從現有映射可靠確認，保持未選擇，使用者可校正。

這是 Beta 的實際限制，不代表所有截圖都能完整辨識。未知 catalog 不能直接儲存成新種類；主詞條與副詞條值也必須符合目前編輯器的既有支援範圍。

[實際結果 JSON](../artifacts/screenshot-recognition/actual-results.json)

## 驗收項目

| 項目 | 結果 / 證據 |
| --- | --- |
| 完整遊戲畫面、單顆辨識 | 五張原圖各一筆；[桌面校對](../artifacts/screenshot-recognition/desktop-review.png) |
| 只裁右側資訊、單張 | 玉冥蛇裁切 PNG、JPEG、WEBP；[裁切結果](../artifacts/screenshot-recognition/desktop-zh-TW-crop.png) |
| 多張批次 | 五張依序辨識；[批次畫面](../artifacts/screenshot-recognition/desktop-batch.png) |
| 不完整、模糊、截錯頁面 | 保持 unknown、未寫入；[不完整圖校對](../artifacts/screenshot-recognition/incomplete-review.png) |
| 重複上傳 | SHA-256 相同圖片略過，結果數仍是五筆 |
| 校對 UI | 名稱 catalog、Cost、主詞條類型／數值、副詞條、套裝皆可改；原圖可點擊放大 |
| 加入聲骸庫 | 圖 1 手動補正暴擊後，明確勾選確認才寫入；[聲骸庫](../artifacts/screenshot-recognition/desktop-library.png)、[確認後](../artifacts/screenshot-recognition/desktop-saved.png) |
| 角色上下文 | 明確選擇後追加至下一個位置；匯入角色維持唯讀；[角色寫入](../artifacts/screenshot-recognition/role-context-saved.png) |
| 公開範例 | 五張完整圖只遮右下特徵碼；另提供右側裁切圖。像素差異檢查確認遮罩外完全一致；[公開完整範例](../image/screenshot-examples/full.png)、[右側範例](../image/screenshot-examples/panel.png) |
| 三語 Desktop / Mobile | zh-TW、zh-CN、en；1440×1100 桌面、390×844 手機視窗；無水平溢出；手機為 Edge 視窗模擬，未宣稱實體手機測試 |
| 錯誤隔離 | 損壞圖片、OCR 資源載入失敗可手動校正；資料過期禁止覆寫；辨識期間沒有 mcData 寫入、沒有非 GET 網路請求 |

三語截圖：

- 繁中：[桌面](../artifacts/screenshot-recognition/desktop-zh-TW-crop.png)、[手機校對](../artifacts/screenshot-recognition/mobile-zh-TW-review.png)、[手機確認](../artifacts/screenshot-recognition/mobile-zh-TW-confirm.png)
- 簡中：[桌面](../artifacts/screenshot-recognition/desktop-zh-CN-crop.png)、[手機校對](../artifacts/screenshot-recognition/mobile-zh-CN-review.png)、[手機確認](../artifacts/screenshot-recognition/mobile-zh-CN-confirm.png)
- 英文：[桌面](../artifacts/screenshot-recognition/desktop-en-crop.png)、[手機校對](../artifacts/screenshot-recognition/mobile-en-review.png)、[手機確認](../artifacts/screenshot-recognition/mobile-en-confirm.png)

## 實作邊界

- `ScreenshotRecognitionAdapter` 是純暫存解析與轉換層，不讀寫儲存、也不計分。
- `screenshot-recognition.js` 載入本機 Tesseract.js，先尋找右側 COST 錨點，再取選中詳細面板；同時支援裁切圖。圖片不傳送到外部辨識服務。
- 主／副詞條種類取自 RoleCandidates／StatKeys；合法數值沿用目前編輯器 mains、fctValue。固定第二主屬性不會誤匯入為副詞條。
- 確認後使用 CharacterCore.createEcho、transact、saveEcho。沒有新增永久資料格式，沒有把 sourceImage、confidence 或 Blob URL 存進 mcData。
- Classic UI、CharacterCore、scoring、probability、simulation、原 ImportService/API、image catalog 均未修改。
- 新增三語文案延續 i18n-dictionaries；自有程式註解採簡體中文。第三方 vendored 檔保留原授權與註解。
- 本機 OCR 資源約 13 MB，首次啟動較慢。需要 HTTP(S) 供 Worker 載入；file:// 失敗會留下校對流程與說明。

## 測試

全部 20 個 `tests/*.test.cjs` 通過（含新增 screenshot-recognition.test.cjs）。新增測試包含繁簡英解析、固定屬性排除、未知名稱、Cost 缺失、百分號遺失、非法數值、重複副詞條、Core 寫入與分數一致、OCR 不寫入、Classic 隔離。

實際瀏覽器驗收：`node artifacts/screenshot-recognition/acceptance.cjs`。原始五張來源使用本次提供的本機 Temp 檔案；不把原始未遮碼圖片複製進公開目錄。截圖證據使用遮碼副本或不含特徵碼的右側裁切。

- `node artifacts/screenshot-recognition/confirmation-check.cjs`：未勾選不能寫入、修改欄位撤銷確認、鍵盤焦點保留。
- `node artifacts/screenshot-recognition/library-regression.cjs`：聲骸庫桌面／手機入口、原資料匯入頁不受影響、英文合成測試圖經真實 OCR 對應簡中目錄、攻擊加成／固定防禦／固定生命辨識、全部副詞條檔位與新增聲骸一致、Cost 切換清空不相容主詞條、返回後清空待確認資料。英文圖為測試排版，非實際遊戲截圖。
- `node artifacts/screenshot-recognition/startup-regression.cjs`：三語桌面／手機新增方式選擇、Escape 與焦點、手動輸入路徑、停用 crypto.subtle 後仍可辨識與去重、模型載入卡住可取消並重試、逾時恢復、file URL 的操作說明，全程未寫入。
- `node artifacts/screenshot-recognition/missed-row-regression.cjs`：新提供的原圖讀出五條正確副詞條（包含固定防禦 40），名稱候選必須點選，仍須勾選確認才能寫入；取消按鈕在桌面／手機皆靠右。[修正後校對](../artifacts/screenshot-recognition/recovered-defense.png)、[取消靠右](../artifacts/screenshot-recognition/cancel-right-mobile.png)。
- [新增方式桌面](../artifacts/screenshot-recognition/add-choice-zh-TW-desktop.png)、[新增方式手機](../artifacts/screenshot-recognition/add-choice-zh-TW-mobile.png)、[直接開檔說明](../artifacts/screenshot-recognition/file-protocol-help.png)
- [聲骸庫桌面入口](../artifacts/screenshot-recognition/library-entry-desktop.png)、[手機入口](../artifacts/screenshot-recognition/library-entry-mobile.png)、[英文 OCR 校對](../artifacts/screenshot-recognition/english-ocr-review.png)
- [瀏覽器結果](../artifacts/screenshot-recognition/browser-test-result.json)
- `node artifacts/screenshot-recognition/check-results.cjs`：與人工讀數逐欄比對。
- `node artifacts/screenshot-recognition/check-masks.cjs`：確認五張公開圖的變更僅在右下遮罩區。
- [本機 OCR 資源、版本與授權](../library/ocr/README.md)

- `node artifacts/screenshot-recognition/save-session-regression.cjs`：確認單張寫入完成後返回聲骸庫，不重載整頁或重複寫入、儲存失敗可重試、已保存／未保存／執行中離開再進入皆為空白、舊非同步結果隔離。[寫入完成](../artifacts/screenshot-recognition/save-completed.png)、[重新進入](../artifacts/screenshot-recognition/new-session-empty.png)。

- `node artifacts/screenshot-recognition/return-library-regression.cjs`：批次部分完成與驗證失敗時留在校對頁，最後一筆成功後返回聲骸庫、更新列表並清空辨識會話。[批次完成返回](../artifacts/screenshot-recognition/batch-return-library.png)。
