# 庫街區角色導入工作台：實作與驗收

日期：2026-10-13。範圍：本機 Register 完整實作、共用核心相容性及隔離驗收。未部署、推送或發布。

新版入口仍為 `register-workspace.html?view=register&mode=import`。首頁導入、空存檔引導及官方角色更新均使用此流程。原有預設入口、Classic／Register 切換及 URL view 規則未改動。

## 功能與保存邊界

流程為「連線帳號 → 多選角色 → 讀取與預覽 → 確認保存 → 查看結果 → 進入分析」。桌面使用頁首、主區及輔助區；手機依操作順序排列，底部保留導覽空間。縮小鍵盤視窗時隱藏底部導覽，將正在輸入的欄位移入可視範圍。

- 陸服／庫街區與九位 UID 範圍明確標示。Token 預設遮蔽，提供顯示／隱藏、既有教學及清除已保存憑證。
- 新 Token 在既有 bind 驗證成功時保存；未修改的已保存 Token 重用既有授權流程。只有本次授權、刷新及列表讀取成功，才顯示可使用。憑證保存與角色保存分開。
- 搜尋接受三語角色名稱。全選只涵蓋目前搜尋結果中的可導入角色，搜尋與語言切換保留已選角色與預覽。
- 詳情使用序列隊列，顯示實際完成數、目前角色與待處理／讀取中／完成／失敗／取消狀態。失敗不清除成功結果；只重試失敗或取消項目。
- `AbortSignal` 會中止可中止的 AJAX；epoch 同時拒絕非中止型 transport 的過期回應。切換憑證、離開頁面及取消會使舊工作失效。
- 預覽含角色、等級、共鳴鏈、API 提供的武器／技能與五槽聲骸資料；詳情預設收合。缺少主詞條等資料會保留缺漏與評分原因，總分顯示不可用，並非零分。
- 新增、更新、保留／跳過與需要指定目標各自呈現。已有相同可靠來源時不允許再新增重複來源；舊資料及多筆匹配必須明確指定更新目標。手動配置不在可更新目標中。
- 更新比較列出已知等級、共鳴鏈、武器及聲骸變化；只有完整資料與相同模型條件才顯示分數差。保留本地模型的 mode、extraEnergy、referenceHealth。
- 更新入口連到不同 UID 時會明確提醒將新增該帳號配置，保留原角色；可改回原帳號重新驗證。
- 只有明確點擊確認導入，才呼叫共用 `CharacterCore.transact`。保存前重新讀取本機完整資料；預覽期間的变動不會被覆蓋。保留預覽，受影響項目的保存方式需重新選擇。
- 儲存失敗保留整批待提交資料，成功前不產生已保存連結；重試與連續點擊不產生重複角色。結果提供個別分析、失敗重試、角色總覽及原角色返回。

## 來源 metadata、唯一性與交易方式

來源資訊直接保存在 `mcData.role[].importSource`，不建立第二個來源儲存鍵：

```text
version: 1
server: 既有陸服 serverId
accountKey: SHA-256(server + ':' + UID)
gameRoleId: 官方遊戲角色識別（字串）
```

此識別不包含 Token 或 accessToken。`tzmId` 延續既有本機 UID 保存方式；不放進導航 URL 或診斷結果。沒有 metadata 的舊角色不會被推定為目前帳號。共用 detail 轉換也為 Classic 的明確官方更新產生相同來源資料，避免留下錯誤帳號歸屬。

metadata 隨角色保存在同一份核心 JSON，因此核心備份、完整備份及還原自然保留它；刪除角色也一併刪除來源資訊。舊存檔沒有此欄位仍可使用；損壞或不支援的來源 metadata 由核心驗證拒絕。

另修正既有完整備份對空採用紀錄加入 `revision`、卻不符合共用採用儲存格式的問題。新匯出使用正確格式；舊備份中的有效、未使用 `revision` 欄位在副本上移除，再由共用採用紀錄驗證器檢查，原備份物件不變。瀏覽器還原後也實際確認草稿及採用儲存均可讀取。

本次 API shape 的 `phantomPropId` 是種類識別，未把它當成裝備實例。沒有經確認的可靠實例欄位時，以加密隨機 48-bit 數字生成快照實例 ID，保留既有 schema 與 Classic 數字 ID 相容性，提交時對全部角色與聲骸庫再檢查並排除碰撞。官方種類 ID 另保留為 `gameEchoTypeId`；角色與聲骸定義仍只維護既有共用目錄。未知聲骸的名稱與 Cost 無法唯一對應時，該角色的導入會被阻止。

更新保留本機角色 ID；未經可靠實例資訊確認的裝備不推定為同一件聲骸。更新造成的來源快照變化，透過現有 sourceRevision／baseline／candidate／draft assess 機制使比較及採用結果失效。草稿與採用記錄不刪除，也不把本地方案說成遊戲裝備更新。

批次提交只寫 `mcData` 一個鍵：先在副本上完成整批變更與驗證，再做一次原有寫入。瀏覽器支援 Web Locks 時取得 `wuwa-mcData` 鎖；不支援時沿用同步 optimistic transaction。Classic 舊寫入不參與此新鎖，但本機快照比對與同步提交仍拒絕已發生的來源變更。原生 `localStorage.setItem` 失敗保留舊值，本次不需要跨鍵提交或來源 journal，亦不宣稱多鍵儲存天然具備交易性。

清除兩個憑證鍵採先保存舊值、失敗時嘗試回復並顯示儲存錯誤的策略。此操作不接觸角色資料，測試涵蓋中途失敗後回復；若瀏覽器連回復寫入都拒絕，顯示失敗並需重新驗證憑證。

## 共用核心與 Classic 核對

沒有新評分模型、角色定義副本、權重表、門檻或概率來源。使用既有 `RoleViewModel.createAdapter`、CharacterCore.score 與原評分函式。角色分析頁的五槽與原位分析結構保持原樣。

原有測試包含 280 組手動／官方配置對照、840 次三語渲染、45 組養成總覽 fixture、16 種評價門檻、126 組已凍結概率案例及既有角色機制／命座測試，均通過。瀏覽器也在同一份已保存資料上比對 Classic 實際顯示分數與共用 adapter（差小於 0.02），操作其原本官方導入按鈕並確認本機角色 ID 保留。Classic 既有公告彈窗依原流程關閉，未重新設計 Classic。

## 可重跑的驗收

在專案根目錄執行：

```powershell
node --test --test-reporter=spec tests/*.test.cjs > artifacts/official-import/unit-results.txt
node tests/register-import-browser.cjs
node scripts/build-import-acceptance.cjs
```

第一項為全數回歸。第二項使用已安裝的 bundled Playwright 與 headless Microsoft Edge，自行開啟臨時 localhost 伺服器與獨立 browser contexts，關閉後釋放伺服器。所有官方請求由 controllable transport fixtures 攔截，不連接真實官方帳號；其餘外部請求也被阻擋。無需手動建立存檔或啟動 8765 伺服器。

結果記錄：

- [完整自動化輸出](C:/Users/user/Downloads/WuwaEchoTool/artifacts/official-import/unit-results.txt)：44 項通過、0 失敗，包含既有全數回歸、18 項新版資料／流程測試與完整備份相容測試。
- [瀏覽器結果 JSON](C:/Users/user/Downloads/WuwaEchoTool/artifacts/official-import/browser-results.json)：包含各尺寸、語言、情境、截圖清單與頁面錯誤計數。
- 最終瀏覽器驗收：34 組通過、196 張實際截圖、0 頁面執行錯誤。導入與相關 Register／Classic 操作皆覆蓋四種寬度及三語。
- [截圖索引](C:/Users/user/Downloads/WuwaEchoTool/artifacts/official-import/screenshots.md)：全部實際瀏覽器截圖；畫面中的帳號、武器與 API 皆為合成測試資料，Token 皆遮蔽。

| 驗收範圍 | 證據 |
| --- | --- |
| 1440、1024、390、360 × 繁中、簡中、英文 | 每組完整導入、部分失敗、單項重試、保存、返回分析與無橫向溢出 |
| 憑證与 API 各階段 | 新 Token、已保存憑證重用、UID 錯誤、缺 Token、失效、官方驗證、資料憑證一次有界重新授權、維護、網路／逾時／HTTP／格式錯誤 |
| 多選與預覽 | 搜尋不丟選取、目前結果全選、三語搜尋、進度不受語言切換影響、未知角色禁選、未知聲骸禁止保存、預覽及取消不寫 mcData |
| 非同步 | 序列讀取、重複啟動阻擋、部分成功、取消、切換 UID、離開頁面、忽略過期回應、只重試失敗 |
| 更新與保存 | 手動同名保留、跨 UID 隔離／更新入口提示、舊資料指定目標、多筆匹配、跳過、本機衝突重新確認、quota 失敗重試、唯一 ID、重複提交 |
| 草稿及備份 | 真實 UI 建立候選比較、更新後 stale 草稿不提供有效決策、草稿保留、来源 metadata 完整備份／還原、刪除清理、舊存檔相容 |
| 相關 Register 頁面 | 各尺寸／三語實際建立角色、聲骸表單保存、聲骸庫收藏與比較、角色管理／養成總覽、概率／模擬／規則工具、完整備份下載與還原 |
| 無障礙與手機 | label、鍵盤 Space 勾選、重繪保留焦點／搜尋游標、持續存在的 live region、狀態文字／輪廓、reduced-motion、360×460 鍵盤佔用視窗測試 |
| Classic | 各尺寸／三語情境使用同存檔核對原評分與明確官方更新流程；保持既有介面 |

## 修改檔案

| 檔案 | 功能 |
| --- | --- |
| `js/register-import-model.js`（新增） | 無 DOM 的批次狀態、搜尋／選取、隊列、取消、身份與衝突判斷、單鍵保存 |
| `js/register-import-workbench.js`（新增） | Register 表單、進度、列表、預覽、保存方式、結果、焦點與鍵盤视窗處理 |
| `css/register-import.css`（新增） | 導入工作台桌面／手機排版 |
| `css/register-foundation.css`（新增） | Register 共用配色、表單、按鈕、分隔線及焦點變數 |
| `register-workspace.html`、`js/register-workspace.js` | 載入新模組，移除舊单角色立即保存路徑與 screenshot.title 混用 |
| `js/import-service.js` | AbortSignal、安全錯誤、穩定 DID、一次資料憑證重新授權、存儲失敗分類、共用來源 metadata |
| `js/role-import-core.js` | 共用聲骸目錄對應、隨機快照 ID、數字詞條格式、缺漏保留及原評分入口 |
| `js/character-core.js` | 共用來源識別／驗證；沿用原交易與評分 |
| `js/mccost2.js` | Classic 官方轉換同樣使用共用聲骸目錄，不新增操作 |
| `js/register-backup.js` | 採用紀錄匯出格式修正、舊完整備份相容轉換與共用驗證 |
| `js/character-portraits.js` | 無 CSS 背景資訊時使用現有 webp 資產 |
| `js/role-register-renderer.js` | 官方更新入口保留語言與原選取上下文 |
| `js/role-register-page.js`、`js/character-dock.js` | 本地核心更新通知後刷新與重新驗證來源 |
| `css/role-register.css` | 分析頁配色變數引用共用 foundation，五槽布局不變 |
| `index.html`、`mccost.html`、`mccost-readonly.html` | 接入 Register foundation；Classic 樣式仍由原作用域控制 |
| `js/i18n-dictionaries.js` | 新增／調整完整繁中、簡中與英文文案 |
| `tests/register-import.test.cjs`（新增） | 18 項資料、transport 與流程測試 |
| `tests/register-backup.test.cjs` | 新增舊備份轉換、原輸入不變與還原後共用採用儲存可讀取測試 |
| `tests/register-import-browser.cjs`（新增） | 完整隔離瀏覽器驗收與實際截圖 |
| `scripts/build-import-acceptance.cjs`（新增） | 由已通過的驗收結果生成截圖索引 |
| `docs/official-import-workbench-acceptance.md`（新增） | 本報告 |
| `artifacts/official-import/*`（新增） | 測試結果與截圖；不由產品程式載入 |

## 外部限制與尚未驗證

**真實官方帳號導入尚未驗證。** 本輪沒有有效陸服帳號進行成功登入／導入，fixture 成功不能替代真實官方驗收。沒有據此推測官方 API 已改版，也沒有嘗試繞過官方驗證。

手機驗收使用實際 Chromium／Edge 的 390、360 寬度與 360×460 縮小視窗模擬鍵盤佔用；沒有宣稱已完成 iOS／Android 實機鍵盤驗收。Classic 保留原有排版，沒有將新版的手機布局要求套到 Classic。


## API 查核與修正歷史

下列查核原文記錄 2026-10-10／11 的當時情況及來源。共用可變 headers、憑證重授權與通用錯誤等舊問題已由後續既有程式及 import-headers／import-errors／import-workbench 測試處理，不應再當作目前缺失。無憑證回應及開源程式比對僅是歷史證據，不能保證今日上游服務可用，也不等於實際帳號驗證。


查核日期：2026-10-10。此次只調查，未修改匯入程式、未部署，也沒有使用任何帳號 Token 或個人 UID 發送請求。

### 現有請求鏈

服務定義位於 `js/base.js:7376`，Register 呼叫順序位於 `js/import-service.js`。

主機：`https://api.kurobbs.com:443`。以下皆為 POST：

| 階段 | 路徑 | 用途 |
| --- | --- | --- |
| 綁定 Token | `/user/emoji/queryUsage` | 以回應 success 判定 Token 是否可用 |
| 取得授權 | `/aki/roleBox/requestToken` | 以 Token、UID、serverId 取得 accessToken，保存為 kjq_bat |
| 刷新資料 | `/aki/roleBox/akiBox/refreshData` | 更新資料 |
| 取得角色列表 | `/aki/roleBox/akiBox/roleData` | 讀取 roleList |
| 取得單一角色 | `/aki/roleBox/akiBox/getRoleDetail` | 讀取武器、共鳴鏈、技能及聲骸 |

### 無憑證連線測試

空請求不讀取任何玩家資料，僅確認路由及錯誤回應。

| 路徑尾段 | HTTP | 業務 code | 回應 msg |
| --- | --- | --- | --- |
| queryUsage | 200 | 220 | 访问令牌不能为空 |
| requestToken | 200 | 220 | 访问令牌不能为空 |
| roleData | 200 | 10000 | 角色id不能为空 |
| getRoleDetail | 200 | 10000 | 角色id不能为空 |

對 requestToken 發送 Origin `http://127.0.0.1:8765` 的 OPTIONS 預檢，HTTP 200，allow-origin 回傳該來源，允許 POST 與程式使用的 token、source、devcode、did 等標頭。

以上只能確認端點仍可回應、測試來源的預檢允許；不能證明有效登入後的權限、回應格式或資料取得均正常，也不能代替使用者實際網站來源的測試。

### 程式已確認的限制與問題

- 固定 serverId 為 `76402e5b20be2c39f095a152090afddc`，對應國服。使用者已確認此功能只服務陸服玩家，因此這是預期範圍，不是此次缺陷。
- AJAX 錯誤、API 非成功 code、缺少 accessToken、資料結構不符，全部只顯示 IMPORT_FAILED，沒有保留失敗階段、HTTP 狀態及官方業務 code。
- `completeHeaders` 回傳共享 headers 物件，每次建立不同 DID；曾設定 token 後，即使 needToken=false 仍可能帶著舊 token。使用假資料已重現此行為，但尚無有效授權請求證明它是本次失敗根因。
- parse 接受物件或 JSON 字串，沒有處理其他編碼格式。不能在沒有真實回應證據時判定官方已改為其他格式。
- 現有 import 測試是合成 transport fixture，並非官方線上成功登入驗證。

### 後續定位所需資訊

使用者沒有陸服帳號可測試。目前仍需有效授權請求的失敗階段、HTTP 狀態與業務 code 才能確認根因；不需要在聊天中公開 Token、accessToken 或完整帳號回應。

參考：[社群維護者的 API 實測記錄（serverId）](https://github.com/TomyJan/Kuro-API-Collection/blob/master/API/gamer/widget/game3/getData.md)。這不是官方保證的公開開發者 API 規格。

### 2026-10-11 開源實作比對

直接讀取維護中的 [MoonShadow1976/WutheringWavesUID API 定義](https://github.com/MoonShadow1976/WutheringWavesUID/blob/master/WutheringWavesUID/utils/api/api.py) 與 [請求實作](https://github.com/MoonShadow1976/WutheringWavesUID/blob/master/WutheringWavesUID/utils/api/requests.py)，角色授權、刷新、列表及詳情仍使用上表相同路徑。這是程式碼比對，不代表已使用有效帳號驗證服務成功。

| 項目 | 此網站 | 參考實作 |
| --- | --- | --- |
| DID | completeHeaders 每次產生新 UUID | 重用帳號保存的 DID，授權請求也傳同一 DID |
| Headers | 共用可變物件，needToken=false 可能殘留 token | 每次建立新物件，按需加入 token |
| 資料憑證 b-at | 缺少失效更新分支 | 辨識失效後重新 requestToken 並保存 |
| 登入檢查 | emoji/queryUsage | user/login/log |
| 驗證挑戰 | 通用失敗提示 | 有 geeTest 回應辨識分支 |
| 維護／業務錯誤 | 通用 IMPORT_FAILED | 保留業務訊息並辨識維護狀態 |

參考專案在 [2026-09-11 的提交](https://github.com/MoonShadow1976/WutheringWavesUID/commit/cae3656ada2804a086c6d1ad4414fad84cf6be0f) 加入維護訊息處理；該提交沒有替換角色 API 路徑，不能據此宣稱目前官方正在維護。

建議優先改善獨立 headers、DID 一致性，以及不含敏感憑證的分階段錯誤訊息，再補上明確的資料憑證失效處理。這些差異是排查方向，尚未證明是使用者遇到失敗的直接原因。此次只更新查核文件，未變更匯入程式或部署。
