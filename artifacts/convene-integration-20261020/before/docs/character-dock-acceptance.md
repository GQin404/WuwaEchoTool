# Register 角色工作台與養成總覽

## 現行操作

首頁無合法 view 時顯示 Register／Classic 雙入口；歷史偏好不會讓首頁自動跳過選擇。Register 支援桌面與手機，不再回退 Classic。手動建立、官方導入、角色分析均有新版入口，兩版共用 mcData 與計算核心。

養成總覽／角色列表一次只顯示一個主要面板。Selected、Hover、focus-visible 可區分，保留 tablist／tab／tabpanel、aria-selected／controls、方向鍵及 Home／End；尊重 reduced-motion。來源、角色／配置搜尋、資料／草稿狀態、原序／名稱／評分升降／完整度排序只作用於展示副本。沒有可用分數時顯示原因，不補零。重設與符合數／總數不影響全帳號統計。

配置名與方案名由 RegisterMetadata 獨立引用原身份，完整備份相容舊資料。進出分析後保留頁籤、搜尋、篩選、排序及合理位置。最近角色在 pageshow／focus 時重新讀取；失效連結安全返回。

## 多方案與來源驗證

同角色可查看多份方案。打開前重新驗證角色、五槽、模型及庫存候選來源；有效才顯示差值。需重比、來源消失、已保存及本地採用分開顯示，名稱或採用狀態不能繞過驗證。本地採用不改遊戲装备。

## Classic 統計含義及安全重用

Classic 的 `pulaoPJ()` 是跨角色、讀取已儲存 `totalScore` 的統計：

1. 只要有任何 `isImport` 為 truthy 的角色，就只統計匯入角色。
2. 沒有匯入角色，才統計所有手動角色。
3. 計數是互斥區間：`>90`、`>80 且 ≤90`、`>70 且 ≤80`、`>60 且 ≤70`。剛好 90 計入大畢業，80 計入中畢業，70 計入小畢業，60 不算畢業。
4. 整體評分是所選角色總分的合計，不是百分制總評；平均值分母是統計範圍內的角色數，含未畢業角色。
5. 保留原本先 `toFixed(2)` 再判定稱號的順序與所有嚴格大於條件。

純計算由 `pulaoPJ()` 原樣抽至 `base.js` 的 `getCultivationOverview(roles)`；Classic 的 DOM、圖片、文案與 UI 不改，改呼叫共用函式後仍進行原本 DOM 回填。Register 同樣呼叫此函式，依其回傳的 `pulaoSay.level` 取得三語稱號、練度與評語；沒有另一份評分規則。

Register 的 `RegisterOverview.prepare()` 不重算／寫入 totalScore。總覽固定保留四個畢業等級與摘要欄位，並顯示可統計完整角色及未完成／分數待補數量。部分資料完整時，只使用共用 Classic 函式取得完整角色的畢業數量，明示這是部分分布；全範圍總分、平均、等級與稱號仍標示暫不可用，不使用子集產生全範圍鑑定。沒有可統計角色時，畢業數量顯示破折號，避免虛假零值。完整性仍由既有 RoleViewModel summary.status 與保存分數有效性判斷，匯入優先規則不變。

養成總覽由工作台頁籤獨立顯示，與角色列表不同时堆疊。分析頁的總覽入口保留跨角色範圍說明，不需先打開分享。

## 百分比來源

Classic 的「超越玩家比例」是 `sumScore * 100 / 1200`，取兩位小數後上限 100。它沒有實際玩家樣本、分布或伺服器資料，因此無法解釋成百分位。Register 完全不展示此百分比，僅展示既有總分、均分、分級與稱號。Classic 原有算法和呈現維持不變。

## 同資料對照

合成資料：8 位手動角色的已保存總分為 `90, 80, 70, 60, 90.01, 80.01, 70.01, 60.01`，各自具有完整五聲骸。

| 項目 | Classic | Register |
|---|---:|---:|
| 完美畢業 >90 | 1 | 1 |
| 大畢業 (80,90] | 2 | 2 |
| 中畢業 (70,80] | 2 | 2 |
| 小畢業 (60,70] | 2 | 2 |
| 統計角色數 | 8 | 8 |
| 合計分數 | 600.04 | 600.04 |
| 平均分數 | 75.00 | 75（同值，依現有格式器省略尾零） |
| 練度 | 入门怒涛级大佬 | 入門怒濤級大佬 |
| 稱號 | 大鸣偏将军 | 大鳴偏將軍 |

補充混合来源案例：手動 99 分 + 匯入 65 分，兩版都只計 1 位匯入角色、總分 65、均分 65、小畢業 1 位。保存分數刻意用邊界值測試，並非從示範聲骸重新計分。

## 統計核對

計算公式、原有分級與來源優先規則未修改。這一輪沒有修改 base.js 或 Classic 的 index.js，也沒有修改分享圖、mcData、Echo schema、資料寫入或聲骸庫。

- 全角色概況：角色總數與未篩選的完整列表一致；完成判斷使用現有完整配置與有效保存分數条件。只新增展示用的 total / completed / remaining，沒有寫入存檔。
- 畢業分布及鑑定：保留有匯入角色就採匯入角色、否則採手動角色的既有規則。混合來源時，上方總角色數與本次鑑定角色數可能不同，未擅自改成合併統計。
- 同一遊戲角色的不同保存配置各佔一筆列表記錄；不按角色名稱合併。Dock 原本就拒絕重複 roleId 的損壞資料；沒有新增去重或評分規則。分布不會同時把手動與匯入來源加在一起。
- 未完成配置不進入畢業分布。部分資料完整時仍只顯示其已確認分布，不以子集產生整體平均或称号。
- 分級保持互斥且嚴格大於：>90、(80,90]、(70,80]、(60,70]。完整保留小數取捨及原來 16 種稱號判斷。
- 列表分數為原有即時計算值，鑑定沿用保存分數；若舊存檔分數過時，两者可能不同。這是原有行為，本次沒有更動或偷偷回寫。最終截图使用一致的合成分数，边界值另由单元测试覆盖。

## 代表圖片與歷史驗收

保留三語桌面／手機的 2 位及 24 位角色總覽，及空、未完成、部分完成圖片；皆位於 `artifacts/register-overview-tabs/`。它們記錄總覽階段的合成資料，不把歷史圖片描述為今日重新拍攝。現行角色列表及跨頁情境見 [整體圖像索引](../artifacts/operation-optimization/screenshots.md)。

- [繁中總覽](../artifacts/register-overview-tabs/overview-2-zh-TW.png)、[簡中](../artifacts/register-overview-tabs/overview-2-zh-CN.png)、[英文](../artifacts/register-overview-tabs/overview-2-en.png)。
- [手機繁中](../artifacts/register-overview-tabs/mobile-overview-2-zh-TW.png)、[簡中](../artifacts/register-overview-tabs/mobile-overview-2-zh-CN.png)、[英文](../artifacts/register-overview-tabs/mobile-overview-2-en.png)。
- [部分完成](../artifacts/register-overview-tabs/partial-zh-TW.png)、[空資料](../artifacts/register-overview-tabs/empty-zh-TW.png)、[未完成](../artifacts/register-overview-tabs/incomplete-zh-TW.png)。

2026-10-12 的總覽驗收核對 Classic 45 組資料與 16 種稱號；三語完整／部分／空資料的统计來源、存檔不變與键盤切換已記錄通過。這是歷史結果，最新完整測試與重跑方式見 [整體驗收](register-operations-acceptance.md)。

保留 `artifacts/register-overview/classic-before.js`：正式 Node 測試直接依賴這份 Classic 基準。QA 程式、seed 與模型／統計规则不因圖片整理而移除。
