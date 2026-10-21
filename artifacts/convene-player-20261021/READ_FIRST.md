# 先读这里

这是 2026-10-21 玩家体验重构后的完整精简源码包，单一 `WuwaEchoTool/` 根目录。当前任务以 `docs/convene-player-report.md` 为准，旧版说明中人工标记、旧查询范围及目标评分混用的描述已失效。

1. 阅读 `docs/convene-player-report.md`（改动、公式、覆盖、教程、限制、维护）。
2. 查看 `docs/convene-player-source-audit.json`、`docs/convene-history-audit.json` 及 `js/convene-history-data.js`（实际来源与条目）。
3. 查看 `handoff/evidence/` 的实跑日志和结果；`handoff/screenshots/` 为精选真实浏览器截图，均使用合成数据、隐藏 UID。
4. 查看 `handoff/FILE_MANIFEST.json` 和 `handoff/SHA256SUMS.txt` 校验文件。

## 运行与测试

使用 Node.js 24，执行 `npm start`，打开终端显示的本地地址（默认 8124）及 `convene.html?lang=zh-CN`。静态页面不需要打包器。部署代理请依现有 wrangler/worker 配置和当前报告核对绑定与限流。

- `npm test`
- `npm run check:static`
- `npm run test:convene:browser`
- `npm run test:convene:themes`
- `node tests/convene-browser.cjs`
- `node tests/multi-config-browser.cjs`

浏览器测试需要 Playwright 和 Microsoft Edge。当前环境从预装运行时读取 Playwright；在其他电脑可在副本中安装 Playwright（测试脚本先尝试普通 `require('playwright')`）。所有浏览器测试使用独立上下文与模拟接口，不代表真实官方账号、生产代理或移动设备操作已测试。

## 保留与排除

完整保留 HTML、JS、CSS、函数/worker、角色与武器注册表、角色图片、固定卡池封面、第三方运行库、OCR WASM/字库、测试及脚本。只保留旧 artifacts 中被现有测试直接读取的三项源基准。其余旧压缩包、缓存、IDE/Git 元数据和多份重复工程不纳入。

唯一源码脱敏差异：交付副本 `js/base.js` 的未使用 `tokenList` 字面量置为空数组，原工作目录未改写。没有附真实玩家存档、完整 UID、授权网址或凭证。文件清单按交付副本实际内容计算。

未执行 Git commit/push/reset/clean。后续维护请直接改当前实现，不恢复人工结果入口，也不要把角色取得评分改回目标模型。
