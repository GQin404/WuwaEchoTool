# Register 現行操作、跨頁安全與驗收

日期：2026-10-13。本次為本機實作，未部署、推送或發布。官方角色導入保留上一輪流程；不改動 Classic 介面、角色定義、權重、評分公式、概率、門檻或養成總覽的統計來源。

## 操作成果

角色工作台仍使用養成總覽／角色列表單一主要面板。新增原序、名稱、分數升降及資料完整度排序，資料／草稿狀態篩選、符合數／總數與重設。沒有有效分數的項目排在數值項目之後，保留不可計分的狀態；不補零分。名稱搜尋包含配置名稱；同角色配置以預設配置名稱或使用者名稱辨識，每個角色可直接選擇多份方案。

分析保留五槽、共同基線及原位宿主。缺漏資料優先定位補資料，未知模型不給改善排名；完整且可評時使用既有 weakestPositions。主詞條與固定貢獻、副詞條贡献及整套校正分開呈現，校正不分攤至每槽。完整詞條係數表及模型條件可展開。最低貢獻只作為模型中的分析入口，不宣稱是實戰最弱或刷取收益最高。

候選支援搜尋、Cost／套裝／主詞條／完整度／收藏、原序／名稱／角色副詞條貢獻排序、數量與重設。不可選項保留原因；無可靠貢獻值不參與數值排名。依原 eligibility、RoleCompare 及目前角色條件判斷，不建立新取捨規則。選擇按鈕明確標示保存草稿並比較。比較仍為單槽副詞條；可返回候選並保留篩選、排序及捲動，關閉保留槽位。

方案管理使用現有 baseline、draft、adoption。配置及方案可明確改名；比較紀錄支援角色／方案搜尋、有效、需重新驗證及來源不存在篩選。有效且可比較才顯示差值，沒有有效值顯示需重新比較。已保存、工具內採用及失效状态分開；刪除方案清理採用與名稱引用，不改來源角色。開啟方案仍重新 assess，名稱與採用標記不繞過驗證。

聲骸庫保留 OCR、收藏、編輯、加入裝備及比較。清單僅顯示紧湊摘要，完整資料在詳情展開；收藏是列按鈕之外的原生獨立按鈕。桌面以單一頁面捲動為主，列表自然延伸；詳情可容納於視窗時 sticky，過長則改自然捲動，不另設列表／詳情捲軸。手機使用獨立詳情及返回列表。未選参考角色時只展示屬性，選定角色後才計算原模型的副詞條貢獻及排序。比較位置的可選性直接呼叫既有 eligibility。真正零庫存與無篩選結果分開顯示，已選項被篩除仍保留並提示。

返回上下文使用受限內部地址及分頁狀態，不接受外站、javascript 或任意路徑。角色列表、聲骸庫及比較紀錄保留搜尋、篩選、排序、選取與合理捲動位置；編輯返回原槽位或清單。沒有未保存變更不增加確認；有變更可保留輸入、捨棄或繼續編輯。暫存僅放在隔離的 session 狀態，來源版本不同不自動套用。數字輸入／選項的字串與數字表示不被誤判為修改。語言切換保留輸入及焦點，不發出新官方請求。

另修正原有「打開有效草稿時無條件建立相同模型 override，導致之後切換條件被誤判為保存衝突」的問題。現在只恢復確實不同的條件，真正來源變動才判為衝突；變更模型後立即使舊比較失效。

## 資料與相容性

新增名稱資料使用 `RegisterMetadata` 的獨立版本結構，角色及草稿均以原識別引用，不更改角色身分、模型或 sourceRevision。完整備份新增可選 names 區段，舊備份未帶名稱时使用相容預設。明確删除角色时清理配置名称；删除草稿时清理方案名称及采用引用。跨鍵操作先驗證預期內容，失敗只回復已成功寫入的鍵，並回報無法回復的情況，不宣稱 localStorage 多鍵天然原子。

名稱改動、收藏與清單狀態不寫 mcData。排序只對展示副本操作，原存檔陣列不重排。養成總覽仍以全存檔及原有統計優先規則準備資料，不使用畫面篩選結果。

原有共享評分對照、命座／機制、概率凍結案例、導入、OCR、分享、備份與工具測試全部回歸。Classic 沒有新功能；新增樣式僅作用於 Register。官方導入 transport、Token、伺服器與流程未改動。

## 重跑驗收與歷史產物

在專案根目錄執行：

```powershell
node --test tests/*.test.cjs
node tests/register-operations-browser.cjs
node tests/register-import-browser.cjs
node artifacts/screenshot-recognition/startup-regression.cjs
node artifacts/screenshot-recognition/save-session-regression.cjs
node scripts/build-register-operations-report.cjs
```

兩個 `tests/*browser.cjs` 使用全新 Edge contexts、自行啟動暫時 localhost 伺服器，官方請求採 transport fixtures，其餘外部請求攔截；不使用使用者瀏覽器 profile。OCR 兩項既有腳本使用本機 8765 伺服器與全新 headless profile，若沒有開啟，可先執行既有 `node artifacts/screenshot-recognition/server.cjs`。

- [自動化結果](C:/Users/user/Downloads/WuwaEchoTool/artifacts/operation-optimization/unit-results.txt)：操作階段的歷史紀錄為 52 項、0 失敗；不作為今日測試總數。
- [整體操作瀏覽器結果](C:/Users/user/Downloads/WuwaEchoTool/artifacts/operation-optimization/browser-results.json)：1440、1024、390、360 × 繁中、簡中、英文；每組大量資料、少量資料及空存檔。
- 最終整體操作驗收：36 組流程、186 張介面截圖、12 張分享 PNG 輸出、0 頁面執行例外。
- [官方導入回歸](C:/Users/user/Downloads/WuwaEchoTool/artifacts/operation-optimization/import-regression.txt)：34 組既有完整導入及 Classic 同資料評分流程。
- [OCR 啟動回歸](C:/Users/user/Downloads/WuwaEchoTool/artifacts/operation-optimization/ocr-regression.txt)：三語／桌面／手機、取消與只重試、逾時、重複辨識、file URL 指引及不提前保存。
- [OCR 保存回歸](C:/Users/user/Downloads/WuwaEchoTool/artifacts/operation-optimization/ocr-save-regression.txt)：保存成功、失敗解鎖、不重複写入、重新開啟、忽略過期結果。
- [截圖索引](C:/Users/user/Downloads/WuwaEchoTool/artifacts/operation-optimization/screenshots.md)：包含角色清單、五槽分析、候選、比較、聲骸庫、方案、未保存提示、備份、未知模型、空槽、空庫、鍵盤視窗、模型失效、分享與工具。

大量情境使用 30 筆配置、200 筆聲骸、多角色多草稿與已採用紀錄；少量情境使用 4 筆配置、8 筆聲骸。驗證查看／篩選不改角色資料、改名不影響來源或評分、角色／方案引用清理、名冊與庫的搜尋／排序返回、編輯返回槽位、候選返回篩選、草稿返回紀錄、保留／捨棄输入、模型切換立即停止舊結論、PNG 分享下載及工具操作。每張介面截图檢查整頁橫向溢出及翻譯 key，頁面例外必須為零。

## 修改檔案

| 檔案 | 内容 |
| --- | --- |
| `js/register-metadata.js`（新增） | 名稱、預设標籤、樂觀衝突及跨鍵回復工具 |
| `js/register-collections.js`（新增） | 不可變列表篩選與排序、可靠副詞條貢獻讀取 |
| `js/register-navigation.js`（新增） | 返回白名單、session 清單狀態、鍵盤視窗 |
| `js/register-unsaved.js`（新增） | 未保存輸入保留／捨棄／繼續與語意修改比對 |
| `js/character-dock.js` | 單面板、排序／狀態、配置辨識、多方案與返回狀態 |
| `js/role-register-renderer.js` | 問題優先順序、補資料、拆解、展開資訊 |
| `js/role-register-page.js` | 配置改名、方案驗證、焦點、返回與模型衝突 |
| `js/role-candidate-surface.js` | 候選查找、排序、返回、改名、未保存與模型失效 |
| `js/register-secondary-views.js` | 聲骸庫布局／上下文／原生收藏及比較紀錄 |
| `js/register-workspace.js` | 工作台狀態、表單返回、重設、收藏保存、方案改名 |
| `js/register-actions.js` | 角色刪除名稱清理、失敗回復與語言保持 |
| `js/role-history.js` | 草稿、採用與名稱引用整合删除 |
| `js/register-backup.js` | 新名稱區段與舊格式兼容 |
| `js/i18n-dictionaries.js` | 完整三語新增文案 |
| `css/register-operations.css`（新增） | 共用清單／表單、資料密度、手機與 reduced-motion |
| `index.html`、`mccost.html`、`mccost-readonly.html`、`register-workspace.html` | 載入上述 Register 模組與樣式 |
| `tests/register-operations.test.cjs`（新增） | 資料隔離、排序、備份、衝突、删除、返回及暫存邊界 |
| `tests/register-operations-browser.cjs`（新增） | 四尺寸三語、完整流程與大量／少量／空資料驗收 |
| `tests/register-secondary-views.test.cjs`、`tests/role-candidates.test.cjs` | 同步緊湊清單與新模組 harness，保留原行為回歸 |
| `tests/register-import-browser.cjs` | 備份檔讀取後等待非同步驗證完成，再核對還原可用性 |
| `scripts/build-register-operations-report.cjs`（新增） | 從已通過結果產生截圖索引與總結 JSON |
| `artifacts/operation-optimization/*`、本報告及操作清單 | 實際測試記錄與圖片 |

## 外部限制

上一輪官方導入已由使用者實際驗收通過；本輪保留該流程並完成 fixture 回歸，沒有以真實官方帳號重新登入。手機測試是實際 Edge／Chromium 的 390、360 寬度及 460 高度鍵盤佔用視窗，不宣稱為 iOS／Android 實機鍵盤驗證。所有驗收使用隔離存檔，不修改實際資料。


## 首頁、語言及本地導覽

沒有合法 view 的 index／根入口每次顯示雙入口，儲存的偏好不會自動跳過選擇。明確 view 用於內部導覽；Classic 固定簡中，Register／入口支援三語。選擇入口、切換語言或查看不寫角色配置。

直接開啟 index.html 後，導覽必須相對目前專案目錄解析，不能連到磁碟根目錄的 register-workspace.html。此規則同時覆蓋 file:// 及 HTTP 子目錄部署。OCR 上傳仍依原實作要求 HTTP，直接開檔不表示 OCR 可用。

- [入口桌面](qa/rc2/chooser-desktop.png)、[鍵盤焦點](qa/rc2/chooser-focus.png)、[入口手機](qa/rc2/chooser-mobile.png) 保留為入口階段的歷史圖片。
- `node tests/ui-view-navigation-browser.cjs` 使用隔離 Edge，驗證 file／HTTP 子目錄 × 三語共 6 組，包含雙入口、五個導覽目的地及 Classic。

## 跨功能修正紀錄（2026-10-13）

### 修正與檔案

| 檔案 | 修正前的問題 | 本輪處理 |
| --- | --- | --- |
| `js/role-candidates.js` | 已保存庫存候選只驗證角色基準，沒有檢查候選实例是否被編輯、刪除、裝備或重複 | 在既有適配器加入純讀取的來源驗證；比較正規化的 Cost、主／副詞條、套裝及身分，忽略名稱與評分快取；手動試算仍為獨立快照 |
| `js/role-candidate-surface.js` | 重新開啟或採用可能繼續展示舊候選結果；切換來源直接重設輸入；保存後側邊清單不更新 | 保存、開啟、重新計算、採用前檢查候選與保存的草稿；失效立即移除結論；來源切換沿用保留／捨棄／留下；顯示方案名稱，保存／改名／採用後更新清單及目前方案標示 |
| `js/role-register-page.js` | 失敗的分析設定保存沒有離頁保護；槽位返回狀態不足；切換槽位可能開兩次未儲存確認 | 沿用既有 session 表單保護恢復未提交設定，來源不符時不套回；在既有導航中記錄並驗證槽位；修正重複確認；監聽方案／名稱／來源變更，重新驗證清單與比較 |
| `js/character-dock.js` | 瀏覽器恢復頁面可能沿用舊最近角色；候選來源失效仍列為有效草稿；不合法頁籤值可能隱藏所有面板 | 重新讀最近角色；共用候選来源驗證；無效頁籤回到養成總覽 |
| `js/register-navigation.js` | 分析頁進聲骸庫未帶角色及槽位 | 帶入明確角色、選中槽位及經 allowlist 驗證的返回位置，沿用原導航儲存與返回規則 |
| `js/register-workspace.js` | 聲骸庫／紀錄未追蹤其他分頁資料變更，刪除後仍可能顯示舊選取或上下文 | pageshow、focus、storage 重新驗證；清除已不存在的角色／聲骸及變動的替換位置；比較前再檢查來源；紀錄不顯示失效差值；失效返回連結安全回工作台；分析上下文僅作參考，聲骸庫手動／OCR 新增仍加入庫存 |
| `js/register-unsaved.js` | 第一個表單確認後可繞過其他未提交輸入；Escape 留下對話框；session 清理失敗可把已完成的核心保存報成失敗 | 在現有模組集中註冊一次離頁事件，逐一保護所有髒表單；取消後重新啟用先前表單保護；Escape 關閉並還原焦點；保留／捨棄失敗不離開；核心保存成功後的 session 清理採容錯 |
| `css/register-operations.css` | 部分不可操作按钮使用 loading 游標，其他互動狀態不一致 | Register 按鈕統一低飽和選中／Hover、180ms 過渡、focus-visible、Disabled 與 aria-busy 游標；成功／失敗訊息維持共用色彩及 reduced-motion |
| `index.html` | 工作台未載入既有候選適配器 | 載入共用 `role-candidates.js` 供有效性檢查，無第二套評分或 Classic 介面變更 |

`register-metadata.js`、草稿儲存、本地採用與歷史清理經檢查及失敗／衝突／備份／清理回歸，現有功能可沿用，沒有為了清單額外重寫。

新增 `tests/register-integration.test.cjs`、`tests/register-integration-browser.cjs`。調整 `tests/role-register.test.cjs` 的實際依賴，及 `tests/register-operations-browser.cjs` 對「被編輯候選應失效」與「槽位已恢復」的預期。

## 備份、刪除與舊資料相容

Register 完整備份由 RegisterBackup 匯出 core、drafts、adoptions、echoMeta、names；不含登入憑證。舊核心備份與独立草稿格式保留用途，不能把它們說成包含所有命名空間。舊完整備份未帶名稱使用相容預設；採用記錄的舊 revision 相容在既有驗證器处理。驗證、確認與明確寫入分開，損壞資料及來源衝突不能被名稱／已採用標記繞過。

角色刪除需明確確認，取消不寫資料；清理相關名稱及引用。草稿刪除不改來源角色，清理採用及名稱引用。跨 localStorage 鍵不是天然原子交易，保存失敗按既有回復／錯誤規則處理，不把 session 清理失敗冒充已完成的核心保存失敗。

## 驗收歷史及待補邊界

2026-10-08：五槽／保存返回／合成新舊資料對照、baseline／draft／候選／比較、完整 Register 與手機流程陸續接入。2026-10-09：入口改為每次主動選擇、共享 shell、角色／刪除／備份／次級頁面驗收。2026-10-13：操作 36 組、跨頁整合 6 組、搜尋 12 組、標題列 12 組、導入合成服務 34 組；各自是歷史驗收，不把所有輸出當成今天重新執行。

最近已執行的完整 Node 結果為 64 通過／0 失敗；本地導覽為 6 組通過。執行命令取得的新結果優先於歷史文件中的測試檔數。真實玩家資料一致性、官方服務／權限、Safari／Firefox、手機與平板硬體、軟鍵盤與手勢應另記錄；使用者已回報官方導入及本地導覽測試 OK，不等同本機合成服務自動化完成實帳號／實機驗收。

未部署或推送，Classic 長期保留，不進行自動淘汰或另建資料／計算引擎。


## 文件維護入口與驗收產物

本輪整理只處理 2026-10-08（含）之後由 Codex 產生的內容，沒有更動正式程式、公式、資源或測試。階段文件整合到下列主文件；歷史結果標記日期，不能當作目前缺失或今日重新測試的證據。

| 範圍 | 主文件 |
| --- | --- |
| 操作與跨頁驗收 | [本文件](register-operations-acceptance.md)、[使用清單](register-operations-player-checklist.md) |
| 工作台／統計 | [工作台](character-dock-acceptance.md) |
| 分析／候選／比較 | [角色分析](role-register.md)、[候選](role-candidate-selection.md)、[比較](decision-first-compare.md) |
| 資料／草稿／國際化 | [view model](role-view-model.md)、[baseline／draft](role-draft-model.md)、[i18n](i18n-foundation.md) |
| 聲骸庫與搜尋 | [聲骸庫](register-library-search-acceptance.md) |
| 官方導入及歷史 API 查核 | [官方導入](official-import-workbench-acceptance.md) |
| OCR | [辨識驗收](screenshot-recognition-acceptance.md)、[名稱對照](screenshot-recognition-names.md) |
| 分享／工具 | [分享圖](register-share-acceptance.md)、[工具](register-tools-acceptance.md) |
| 正式資源／計算一致性 | [圖片維護](character-images.md)、[合成對照方法](register-fixture-acceptance.md) |
| 人為舊權重文件：保留、不改寫 | [51–53](character-weights-51-53.md)、[57–63](character-weights-57-63.md) |

較早工作台列表／框架、庫存選擇器、聲骸庫長表與次級頁面圖片已退役；保留三語總覽、空／不完整／部分資料、分享圖／before 對照、入口 chooser，以及現行操作、搜尋、導入、工具、OCR 等證據。圖像索引中的同位元組圖片可能共用一份檔案。不要整個刪除 artifacts：正式 Node 依賴 Classic 基準，QA 仍需要 seed、before 程式快照、OCR 素材及損壞備份 fixture。

既有 QA 可能重產已退役圖片，只有當次輸出才能稱為當次執行；整理不改測試程式或新增自動刪除系統。不再為每輪建立一份同內容的新階段文件，更新相應主文件並保留必要的新行為／限制／測試結果即可。

## 2026-10-14 v2.0 最終整合驗收（基準 bcf33d2）

已閱讀交接副本六份狀態／地圖／下一步／提示／manifest／validation；原專案根目錄沒有這六份檔案，以目前原始碼為準。已有工作台、五槽、候選、具名多草稿、紀錄再驗證、聲骸庫與三個工具均保留，沒有重新實作業務功能或介面。

本輪修正：`register-navigation.js` 的會話容器若為陣列，原實作會回報保存成功，但 JSON 序列化會丟失具名頁面狀態；null、原始值與損壞 JSON 也會令保存失敗。現在讀取安全降級、下次明確保存恢復容器，保留其他有效頁面狀態；儲存讀取／写入失敗仍回報失敗，不覆寫既有內容。角色 mcData、草稿、資料格式與計算公式均未修改。

測試改進：七份 Register 瀏覽器套件共用 `tests/browser-qa.cjs`，預設輸出到系統暫存 `wuwa-v2-qa/<suite>`，同名結果覆寫；`WUWA_QA_OUT` 可指定輸出根目錄，`WUWA_QA_WIDTHS` 可指定尺寸，不新增產品狀態。既有 OCR 歷史 QA 本輪以記憶體改寫 screenshot 路徑方式執行，原檔未改、未新增永久圖片。頁籤 CSS 驗收將固定 220ms 等待改為等實際選中顏色到位，消除並行執行時的動畫時序誤判，沒有修改 CSS。

當次結果（隔離合成資料，Edge headless）：

| 驗證 | 通過 | 失敗 |
| --- | ---: | ---: |
| 全部 Node 測試（新增 2 項異常會話／儲存失敗回歸） | 66 | 0 |
| 工作台／分析／庫存／方案／備份／分享操作矩陣 | 45 | 0 |
| 跨頁、多方案再開啟、未保存、來源修改／刪除 | 15 | 0 |
| 機率、模擬、規則、返回／重整、異常會話恢復 | 15 | 0 |
| 官方匯入合成 transport、新增／更新、Classic 回歸 | 40 | 0 |
| 搜尋／收合／計數／重設／庫存捲動與 sticky | 15 | 0 |
| 標題／新增入口／手機詳情返回 | 15 | 0 |
| Tabs 滑鼠／鍵盤／焦點／reduced motion | 15 | 0 |
| file:// 與 HTTP 子目錄三語雙版本導覽 | 6 | 0 |

瀏覽器合計 166 組、0 頁面例外；三語為 zh-TW／zh-CN／en，Register 矩陣寬度 1440／1024／768／390／360。工作台／庫存涵蓋 30 配置、200 聲骸、小資料及空資料。Node 包含新舊評分對照、126 組凍結機率、模擬、備份 metadata、交易失敗及衝突等現有回歸。另執行實際本機 OCR 保存回歸：辨識 panel.png、明確確認才寫入、不重複保存、配額錯誤保留原資料、重新進入清空舊會話、非同步舊結果不回寫；通過。初次 Tabs 套件有 1 次動畫時序斷言失敗，修正等待方式後完整 15 組重跑通過，沒有略過斷言。

50 份 js 全部 `node --check` 通過，`git diff --check` 通過。專案是靜態 HTML，沒有 package.json 或建置命令，未將語法／頁面驗證冒稱打包建置。Classic 頁面、共用計算核心、正式資料與語系內容未修改；未部署、未推送、未重置工作區。

重跑（需現有 Playwright 依賴與 Edge；套件沿用現有本機依賴路徑）：

```powershell
node --test tests/*.test.cjs
$env:WUWA_QA_WIDTHS = '1440,1024,768,390,360'
foreach ($suite in 'operations','integration','tools','import','search','heading','tabs') {
    node "tests/register-$suite-browser.cjs"
    if ($LASTEXITCODE -ne 0) { throw "Failed: $suite" }
}
node tests/ui-view-navigation-browser.cjs
```

集中人工驗收（使用測試設定檔或先備份）：

1. 工作台搜尋／排序後進入角色、切换五槽、返回；確認頁籤及篩選保留、最近角色正確。
2. 同角色建立並命名兩份單槽草稿，來回開啟；確認名稱、位置、基準各自正確，採用不影響另一方案或遊戲裝備。
3. 修改來源聲骸後重開草稿；確認需重新比較，沒有舊差值或有效結論。刪除一份草稿後確認其他方案與來源角色不受影響。
4. 候選手動修改後返回或切槽，逐一試保留／捨棄／留下；未修改時不應跳確認。
5. 聲骸庫搜尋、收合篩選、收藏、詳情、編輯與比較；手機返回原列表位置，長詳情底部按鈕可捲動抵達。
6. 三工具計算／模擬後切換、換語言、返回與重整；輸入保留，條件變更後不顯示過期結果。
7. 實際手機／平板開啟軟鍵盤，驗證底部導覽、焦點與確認彈窗；英文長字串及窄螢幕可操作。
8. 使用正式流程測試官方更新、自己的 OCR 圖片、備份還原與分享；切回 Classic 確認原操作。

限制與發布判斷：尚未測真實官方帳號／線上 API、玩家真實資料、手機／平板實機或 Safari／Firefox；本機沒有其他 Playwright 瀏覽器執行檔，未下載安裝。視窗縮小模擬軟鍵盤不等於實機。部分歷史 QA 依賴外部舊原圖／舊 UI，未當作現行必跑套件，也沒有宣稱全 artifacts QA 已通過。本輪未發現已驗證範圍內阻礙發布的功能問題，但正式發布仍需使用者完成上述外部及實機集中驗收。
