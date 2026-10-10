# Register 分享雙模式驗收

- 簡略版：保留原本 1440 × 1150 繪製內容；與 HEAD 原版在相同配置下產生的 PNG 逐位元組一致。
- 詳細版：1440 × 1830 起，累計欄位較多時自動加高。角色、鏈數、模式與模型條件、總分、五槽名稱／Cost／主詞條／分數／五條副詞條、可辨識套裝、全部副詞條累計、已知貢獻與共鳴效率校正皆取自同一份 view model。
- 入口：分享養成結果 → 選模式 → 預覽 → 下載 PNG；可返回選擇。Escape 關閉後焦點回到入口。
- Classic、評分、圖片來源與載入規則均未修改；新增文案包含繁中、簡中與英文。
- Edge 無頭瀏覽器，桌面 1440 × 1100、手機 390 × 844。兩模式預覽、手機實際下載、返回與關閉通過，手機對話框無水平溢出。
- 使用獨立瀏覽器 context 與 tests/register-qa.cjs 合成資料，沒有修改使用者存檔。
- 此環境無法載入遠端聲骸圖片，PNG 範例保留角色立繪與全部讀數，預覽有顯示缺圖提示。沒有替換來源或使用假圖。
- 全部 19 個 tests/*.test.cjs 通過。分享測試覆蓋三語、兩模式、選擇前不繪圖／下載、輸出尺寸、本地檔案補圖、取消／錯檔恢復與資料不變。

產物位於 artifacts/register-share：compact.png、detailed.png、desktop-selection.png、desktop-compact.png、desktop-detailed.png、mobile-selection.png、mobile-compact.png、mobile-detailed.png。compact-original.png 為原版對照。

重現：執行 node artifacts/register-share/server.cjs，再執行 node artifacts/register-share/qa.cjs。QA 腳本使用本機 bundled Playwright 與 Edge。

