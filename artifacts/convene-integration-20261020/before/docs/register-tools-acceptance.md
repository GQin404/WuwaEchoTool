# Register 分析工具完整優化

本文維護機率分析、強化模擬、評分規則及其實際入口／會話狀態；以下修改及驗收結果記錄工具階段，不當作其他模組尚未完成的證據。沒有部署、推送或改動共用公式、機率模型、權重、評分規則、角色／聲骸資料格式。

## 盤點與呼叫關係

| 入口／功能 | 原有呼叫 | 本轮實作 |
| --- | --- | --- |
| 主導覽「分析工具」 | `register-workspace.html?mode=tools` → `RegisterTools.mount` | 保留入口與頁面標題列，工具頁籤及共同參考角色統一 |
| `probability.html?view=register` | 原本三種舊網址都只導向工具預設頁 | 帶入 `tool=probability` |
| `imitate.html?view=register` | 同上 | 帶入 `tool=simulation` |
| `rule.html?view=register` | 同上 | 帶入 `tool=rules` |
| 機率與期望 | `EchoToolCore.probability` + `countScores` + `fctValueHJ` | 原參數、候選池與結果不變；計算後保存條件快照，輸入改變即暫停展示舊數值 |
| 強化模擬 | `EchoToolCore.roll` + `fctValue` | 原随机來源、順序避重與數值表不變；保留 0–5 詞條、五詞條後禁用下一次、重設確認 |
| 資源 | `EchoToolCore.resources` + `costExperance` | 原投入／回收／損失／升滿餘額及小數不變，改成可展開分層資訊 |
| 評分規則 | `getScoreDetails`，參考角色共鳴鏈 0、預設條件 | 原 13 類係數，摘要與完整表格分層，顯示每 1 百分點／固定點的單位及六位小數 |

Classic 的 `probability.js`、`imitate.js`、`rule.html` 與計算核心未修改。所有角色定義及計算仍由原 `base.js`／共用核心供應。

## 實際修正

- 原先調整 checkbox／角色後，畫面仍保留上一次結果。現在結果有明確初始、條件已變、已具備目標、已完成及錯誤狀態；不以零取代尚未計算的結果。
- 已知詞條限制五項。選滿後只停用未選項目，已選項目仍可取消；過量／無效條件不送入計算。
- 更換顯示目標可查看同一組計算的其他目標，不需重複輸入。角色與已知條件變更後才要求重新計算。
- 顯示「100% 已具備」的意義、逐次機率不能直接相加、雙暴近似、生命／防禦池比例、剩餘副詞條期望及模型分數的範圍；不描述為官方掉落率或 DPS。
- 模擬完整展示五槽、最新開出的詞條及本次進度；重設需明確確認，Escape／取消保留原結果；重設只清模擬，不清其他工具條件。
- 工具共用參考角色，但模擬並不依角色更改随机分布。規則與機率期望使用原角色預設条件，不冒充已保存角色的裝備配置。
- 使用既有 `RegisterNavigation` 的 session UI 狀態保存條件、模擬、頁籤與詳情展開；重整重建原條件的結果。沒有新存檔格式，不寫 `mcData`。保存失敗顯示提示並沿用 `RegisterUnsaved` 保護離頁。
- 工具頁籤具 tablist／tab／tabpanel 語意、roving Tab、方向鍵、Home／End、focus-visible；捲動時頁籤可保持可操作。計算中有 aria-busy 與禁用回饋，語言切換不清操作，不增加事件監聽。
- 修正 Register 主導覽沒有攜帶目前語言的問題，避免工具返回後介面回到瀏覽器預設語言。Classic 路由與語言政策保持原樣。
- 詳情可收合並返回摘要；桌面雙欄、960px 以下單欄，操作區不另設底部固定列，避免遮住導覽或鍵盤；沒有整頁橫向溢出。

## 修改檔案

| 檔案 | 內容 |
| --- | --- |
| `js/register-tools.js` | 在既有工具模組整理狀態、驗證、計算回饋、結果、模擬、規則、會話保留、鍵盤與詳情操作；仍呼叫原核心 |
| `css/register-workspace.css` | 工具專屬響應式展示，沿用現有 Register 變數、按鈕、彈窗與焦點樣式 |
| `js/i18n-dictionaries.js` | 繁中／簡中／英文工具說明、流程及狀態 |
| `js/ui-view.js` | 僅修正 Register 工具入口的子頁籤與主導覽語言參數 |
| `tests/register-tools.test.cjs` | 新增五項計算、狀態、恢復及路由測試 |
| `tests/register-tools-browser.cjs` | 新增完整三語／尺寸驗收 |
| `tests/register-operations-browser.cjs`、`tests/register-import-browser.cjs` | 使用新版主要結果及執行中狀態，等待計算完成後檢查結果，維持原回歸範圍 |

## 既有工具階段驗收結果

- Node **64 通過、0 失敗**：原 59 + 新增 5。
- 新工具瀏覽器 **12 組通過、0 失敗**：1440／1024／390／360 × 繁中／簡中／英文，無 pageerror。涵蓋初始、機率與舊值停止展示、目標切換、五項上限、完整數據、模擬 0–5、重設／取消、規則、跨工具、跨頁返回、重整、語言、鍵盤、載入禁用、失敗重試、session 保存失敗與三種舊入口。
- 原完整操作 **36 通過**、跨頁整合 **6 通過**、官方導入合成服務 **34 通過**、頁首驗收 **12 通過**。OCR 啟動與保存兩份瀏覽器腳本亦通過。
- 計算一致性：**64 角色 × 126 原機率案例 = 8,064 組**，與修改前的共用核心调用完全一致；**100 組固定随机序列**的五詞條模擬一致；全部角色的 **832 個係數**與原 `getScoreDetails` 一致；資源估算直接比對原函式。
- 原 Node 測試仍覆蓋 Classic 路由／初始讀取、手動及匯入評分一致性、既有概率案例、資料衝突、備份及角色操作。瀏覽器另確認 Classic 原入口不掛載新版工具，以及既有官方配置的 Classic 更新流程。

全部使用隔離瀏覽器存檔，未修改使用者實際資料。結果與 60 張代表截圖在 `artifacts/register-tools/`。

## 可重跑方式

```powershell
node --test tests/*.test.cjs
node tests/register-tools-browser.cjs
node tests/register-operations-browser.cjs
node tests/register-integration-browser.cjs
node tests/register-import-browser.cjs
node tests/register-heading-browser.cjs
```

瀏覽器使用本環境 Playwright runtime 與 Microsoft Edge，腳本自行啟停 localhost 服務。OCR 既有腳本使用專案服務 `http://127.0.0.1:8765`。

## 使用者驗收清單

請使用獨立測試瀏覽器設定檔或備份副本：

1. 開「分析工具」，選角色、勾兩個已知詞條並計算；查看主要機率與期望，再展開完整數據及資源。已具備目標時確認 100% 的說明。
2. 改已知詞條或角色，確認舊數值暫停展示；重新計算。換顯示目標，確認不必重新輸入已知條件。
3. 模擬兩次，切規則／機率再切回；確認原模擬保留。開到五槽後確認下一次停用；重設先取消，再確認重設。
4. 重新整理，離開工具到聲骸庫再由主導覽回來；確認角色、條件、工具及模擬保留。
5. 切三語，展開規則表，確認單位、零係數及長文字；鍵盤用 Tab、左右鍵、Home／End 及詳情返回操作。
6. 真實手機／平板檢查長頁捲動、黏附工具頁籤、底部導覽、下拉選擇器、重設彈窗及詳情返回；驗證縮放與軟鍵盤不遮住按鈕。

未驗證的外部限制：真實手機／平板硬體、Safari／Firefox、實際官方帳號／服務、瀏覽器被系統強制終止後的 session 保留。機率與模擬不是官方掉落實測；本輪只保持原模型並改善解讀。已測範圍沒有尚未處理的已知問題。後續維護直接更新本文件，不另建立重複階段報告。
