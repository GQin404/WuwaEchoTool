> 2026-10-21 更新：本次保底、独立玩家补充、总览顺序和六阶主题以 [修正验收报告](convene-pity-report.md) 为准。下文保留既有实现说明；原有“默认逐条下拉确认”和旧总览顺序已被本次实现取代。

# 唤取记录模块（Convene archive）

> 界面已更新为v2，新增内建教学、规则／成就说明和完整角色分享分页。请先读 [convene-ui-v2.md](convene-ui-v2.md)。以下保留数据与接口说明；旧版外站教学入口及仅展示近期详细分享的行为已被v2替代。


本模块使用独立 IndexedDB，不读写 `mcData` 的角色或声骸评分。入口为 `convene.html?view=register`。界面与报告三语共用；开发说明使用简体中文。

## 运行

Node.js 24（本次验证 24.13.0），无需安装运行依赖：

```sh
npm start
# http://127.0.0.1:8124/convene.html?view=register
npm test
npm run check:static
npm run test:convene:browser
```

浏览器验收需安装 Playwright 1.62.1 和 Edge。测试先尝试 `require('playwright')`，本机再回退到 Codex 自带运行时。现有其他浏览器脚本含原机器绝对依赖路径，ZIP 的 `handoff/run-browser.cjs` 提供可移植执行入口。不要用 file:// 打开；IndexedDB 与 Web Locks 需要可信来源（localhost / HTTPS）。无 Web Locks 时正常历史读写仍由 IndexedDB 事务保护，跨库完整恢复会拒绝执行，避免不安全恢复。

`npm start` 仅监听 127.0.0.1，内含固定端点代理和每分钟 40 次限制。不会打开个人浏览器或打印请求正文。历史页面也可选择直接连接；需官方允许 CORS。

## 模块地图

| 文件 | 责任 |
|---|---|
| `js/convene-core.js` | 严格记录结构、稳定批次身份、追加合并、连续区间、卡池规则、统计、角色取得、运势及成就 |
| `js/convene-service.js` | 官方 URL 解析、Windows 所选日志解码、独立授权、端点及请求、逐池同步 |
| `js/convene-store.js` | IndexedDB 事务、并发写入、完整恢复日志及中断恢复 |
| `js/convene-i18n.js` | 简中／繁中／英文文案；未知物品保留官方导入名称 |
| `js/convene-ui.js` / `css/convene.css` | 五个页签、折叠筛选、分页、结果标记、多账号、分享预览 |
| `js/convene-share.js` | Canvas 原生绘图，整体／角色各简略和详细 PNG，不是网页截图 |
| `functions/api/convene.js` | Pages 接口／固定端点代理核心，输入限长、响应限长、超时、不回显官方错误正文 |
| `convene-worker/` / `wrangler.toml` | 独立限流 Worker 与 Pages service binding 配置 |
| `js/register-backup.js` | 可选 `sections.convene`、异步完整备份与恢复；旧备份仍可恢复且保留历史 |
| `tests/convene*` | 标记为 fixture 的单元、模拟 API、隔离真实浏览器验收 |

角色名称与立绘复用 `roleList.gid` → `i18n.entity('characters',id)`、`CharacterPortraits.resolve`。不修改评分引擎、导入 Token 或 Classic 业务。

## 接口研究与验证边界

研究日期：2026-10-20。没有使用任何玩家授权进行查询。

- [WuWa Tracker 导入说明](https://wuwatracker.com/import)提供各平台取得链接的流程；这里链接到原教学，Windows 额外支持用户主动选择日志。未声称网页可搜索硬盘。日志 XOR 协议独立实现，没有复制其 GPL PowerShell 脚本。
- [Kuro API Collection](https://github.com/TomyJan/Kuro-API-Collection)及其 [baseData 文档](https://github.com/TomyJan/Kuro-API-Collection/blob/master/API/aki/roleBox/akiBox/baseData.md)说明社区账号 Token 对应角色盒子；现有角色导入服务使用社区接口。唤取历史单独使用游戏历史链接授权，未复用 Token。
- [wuwa-pulltrack](https://github.com/vermilion10/wuwa-pulltrack)提供国际服端点和返回列表字段、同时间批次顺序的适配参考。其“约六个月”“约一天授权”是第三方观测，不作为本项目保证。原项目将所有池设成 80 的做法没有沿用。
- [大陆端点实现参考](https://github.com/KirisameVanilla/wuthering-waves-gacha-export/blob/main/src-tauri/src/lib.rs)用于核对 .com 地址及字段结构。
- [官方活动公告](https://wutheringwaves.kurogames.com/en/main/news/detail/3723)确认同类限定角色活动继承计数；[周年武器公告](https://wutheringwaves.kurogames.com/en/main/news/detail/2662)说明周年武器与限定武器的计数关系。接口数值 ID 的新池映射仍待真实响应核对，未仅按活动名称推定共享关系。
- [Cloudflare 官方限流说明](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)用于 Worker 配置。限流是 Cloudflare 节点级近似限制，不是严格全球计费计数。

已做无授权 OPTIONS 检查：国际服 `.net`、大陆 `.com` 都返回 HTTP 200，`Access-Control-Allow-Origin: *`。这只能证明当时预检可达，不能证明 POST 授权、真实账号字段、所有平台或未来 CORS 仍正常。真实账号导入、真实 Windows 游戏日志、移动设备取链、Cloudflare 生产部署均未实测。

### 授权与请求

只接受 HTTPS 官方历史页面域名、路径和必需参数；支持 query / hash query，拒绝重复授权键和域名／服务器冲突，不按 UID 首位猜区域。官方域名可可靠判断 .com / .net；手动选择冲突时提示重取链接。

请求：固定 `/gacha/record/query`，分别使用 `gmserver-api.aki-game2.net` / `.com`。请求字段独立构建。默认查询类型 1–8；可显式增加 9–20，新增类型没有已核实规则时仅保存与展示。未来新增字段／分页结构必须更新适配器，当前不静默跳过畸形行。

默认每池返回一个完整列表；只有整个列表结构、顺序及单抽数量有效才保存。不同池逐个独立提交，部分失败或取消不会回滚已成功的池。不会将网络错误消息、完整 URL、recordId、Token 写入存档、地址栏、控制台或报错正文。链接提交后清空输入。

### Cloudflare 部署（尚未部署验证）

Pages Functions 可通过 service binding 调用独立 Worker；Worker 才配置 Rate Limiting binding，避免假定 Pages 本身支持该绑定。需 Wrangler >=4.36。先在自己的 Cloudflare 账号部署 `convene-worker/wrangler.toml`，再将根 `wrangler.toml` 的 Pages 项目名改为实际项目名并绑定 `wuwa-convene-proxy`。本次没有部署，也没有访问用户 Cloudflare 账号。

```sh
npx wrangler@4 deploy --config convene-worker/wrangler.toml
npx wrangler@4 pages dev .
# 正式 pages deploy 由项目维护者决定；静态资源发布范围应排除 artifacts / 测试和私人文件。
```

Worker 禁用 observability；代码不打印授权。仅接受同源 JSON POST，正文 <=4096 bytes，固定两端点、池类型 1–20、语言白名单、字段白名单、最多 24 MiB 响应和 20 秒超时，拒绝上游重定向。缺少限流 binding 时返回 503。不会接受任意 URL 转发。

## 数据可靠性

每个账号身份包含 region + server + UID。数据库 `wuwa-convene` v1、`archive` object store；版本化白名单结构只持久化必要记录，不保存授权。迁移／验证可重复运行。其他来源（UIGF、第三方任意 JSON）未冒充兼容格式。

API 没有可靠的单抽 ID，因此身份为池类型 + 官方时间 + 同时间批次内从旧到新的序号，保留十连中的重复物品。重复导入不变成新抽；窗口滑动不会删除旧记录。已有同时间批次数量或内容冲突时拒绝该池，保留原存档；不是按时间和名称粗暴去重。

每次成功列表提供一个可确认连续区间；仅有重叠记录的区间才合并。无重叠区间保持缺口，后续重叠补回可修复。首次导入的第一段必定视为左删失，不假定从账号首抽开始。无法确认的间隔不进入平均值和运势。只输出存档覆盖范围，不承诺终身全历史。

完整恢复在 Web Lock 内先写 IndexedDB 恢复日志，再写原有 localStorage，最后合并历史并提交；失败回滚，浏览器中断后下次打开存档恢复日志。旧备份没有历史区段时保留现有历史。完整恢复与现有角色页面同时操作仍应避免（角色页面本身不使用此存档锁）；恢复期间请关闭正在编辑角色的其他标签页。

## 规则、统计与娱乐评分

规则集中在 `ConveneCore.POOLS`。传统池 1–4 分开计算，各 80；新手池 5 为 50，选择池 6 为 80，两者不进入重复抽取运势。7 的赠礼映射待核对，8 及额外新池没有确认规则，不套用 80、不生成精确保底或运势。这些传统数值是当前适配基线，未用真实账号内的当期游戏规则逐条复核；维护新版本时需核对游戏详情并增加版本规则，不应将新增复刻／联动／回响池机械并入旧池。

总览平均值、最快、最晚只统计已知传统重复池的有效完整间隔；不同池各自展示独立平均，不将新手与赠礼混入。历史按各池及连续区间计算，跨同类活动沿用同一个池计数。未知规则的池也不会显示推定间隔。

限定胜负默认未知。API 缺少目标角色和保证状态；历史列表允许玩家依据当次游戏事实标记未知／非保证命中／非限定结果／保证命中，写明 `evidence: user`。胜率只含非保证结果；已知失败之后误标非保证命中不会作为确认胜率。没有猜测“非标准角色就是赢了 50/50”。这不是官方认证的胜负分类。

出金速度指数：各有效重复池间隔 `100 × (hard − interval)/(hard − 1)` 的平均。若有确认非保证结果，用 80% 速度 + 20% 确认命中率。不是概率百分位，不拟合未经证实的软保底。至少 10 个有效间隔、300 个相关池抽数才显示长期称号；最高级需 30 间隔、10 个确认机会。不足则显示运势待观察。可信度只控制展示，不加分。角色的可信度使用其有效间隔覆盖抽数。

称号按 20、40、70、85、95 分为六档，是娱乐性速度分段，不声称经全服分布校准。

成就：一发入魂／五星连发要求精确间隔 1；十抽奇迹要求精确间隔 <=10；保底常客要求至少 3 个 >=75 的有效普通池间隔；连续好运要求同池连续三个精确间隔 <=20；逆风翻盘要求同连续区间内已确认非限定后接保证命中。首段或缺失历史不生成证据。

角色分析只展示实际取得次数、时间及取得当次五星间隔。活动目标、复刻批次、未取得目标的投入无法从现有字段可靠重建，界面明确显示未知，不生成“角色总投入”。

## 分享与隐私

原生 Canvas 1200px 宽 PNG：深色渐变、共鸣纹样、按称号颜色、数据图表、原角色立绘等比缩放，不绘制网页 UI。整体、角色各简略／详细；简略分享列近期条目，详细角色分享按12条分页，全部结果可逐页下载；完整历史也在页面和备份中。三语文字自动缩放／有限截断；默认无 UID，选择后只显示遮蔽 UID。预览与下载复用同一 PNG data URL，不重新随机绘制。角色资源缺失时显示中性共鸣符号，不以错误角色图片替代。

交付中的所有战绩 PNG 均带“测试数据／非真实账号”标记，截图和测试使用独立浏览器上下文。没有复制个人 localStorage 或 IndexedDB。
