from pathlib import Path
w=Path('artifacts/chatgpt-handoff-20261020-2227');p=w/'audit.py';t=p.read_text('utf-8')
t=t.replace("('browser-target.txt'", "('browser-reference.txt','node tests/convene-ui-reference-browser.cjs','PASS 6'),('browser-target.txt'",1)
t=t.replace("[('browser-target/results.json'", "[('browser-reference/results.json','reference.json'),('browser-target/results.json'",1)
a=t.index('for width in [1440,390]:',t.index('def copy_image'));b=t.index("data(H/'evidence/screenshots/index.json'",a)
t=t[:a]+'''for width in [1440,390]:
 for suffix in ['overview','character-analysis']:copy_image('browser-reference',f'{width}-zh-CN-{suffix}.png')
for name in ['390-en-overview','1440-zh-TW-character-analysis','1440-zh-CN-pool-1','1440-zh-CN-pool-2','390-zh-CN-history-filters','1440-zh-CN-import','1440-zh-CN-windows-guide','390-zh-CN-windows-guide-bottom','1440-zh-CN-overall-six-tiers','1440-zh-CN-character-six-tiers','1440-zh-CN-overall-compact','1440-zh-CN-overall-detailed','1440-zh-CN-character-compact','1440-zh-CN-character-detailed','1440-zh-CN-target-R0','1440-zh-CN-target-R3','1440-zh-CN-target-R6','390-zh-CN-portrait-fallback']:copy_image('browser-reference',name+'.png')
copy_image('browser-target','1440-zh-CN-target-R6-detailed-excess.png')
copy_image('browser-config-ui','1440-zh-CN-05-compare-different-cost-names-radar.png')
copy_image('browser-inventory','1440-zh-CN-06-A-B-same-X-reference-proof.png')
copy_image('browser-inventory','390-zh-CN-02-filters-expanded.png')
copy_image('browser-multi','1440-zh-CN-share-compact.png')
''' +t[b:]
t=t.replace("summary={'formatVersion'", "extraPNGs=len([p for p in (W/'browser-reference').glob('*.png') if re.match(r'^(1440|390)-(zh-CN|zh-TW|en)-(?:overall|character)-(?:compact|detailed|full-uid)\\.png$',p.name) or re.match(r'^(1440|390)-(zh-CN|zh-TW|en)-target-R[0-6]\\.png$',p.name)])\nassert extraPNGs==58,extraPNGs\nsummary={'formatVersion'",1)
t=t.replace("'targetFlows':6,", "'referenceFlows':6,'referenceExtraDownloadedPNGs':extraPNGs,'targetFlows':6,").replace("'masked share'","'full/hidden UID'")
a=t.index("put(H/'08_TEST_REPORT.md'");b=t.index("print(json.dumps",a)
t=t[:a]+'''put(H/'08_TEST_REPORT.md',f\'''# 本次实际测试报告

独立快照检查开始：{json.loads((W/'snapshot.json').read_text('utf-8'))['startedAt']}。Windows、Node24.13.0/npm11.6.2、Playwright1.62.1/本机Edge。每次全新上下文/合成数据，不打开个人浏览器配置、不清除用户数据；产品和测试原件没有为了通过检查被修改。

## 命令、完成时间与日志

{commands}

命令在独立副本运行。浏览器由handoff/run-browser.cjs适配旧测试依赖路径，可设WUWA_BROWSER_CHANNEL=msedge；输出变量WUWA_REFERENCE_OUT、WUWA_TARGET_OUT、WUWA_CONVENE_OUT、WUWA_MULTI_OUT、WUWA_MULTI_UI_OUT、WUWA_INVENTORY_OUT、WUWA_QA_OUT均指独立产物目录。并非其余全部历史browser脚本均重跑。

## 实际结果

- 单元145通过，0失败，0跳过；评分模型/链数/模态、迁移共享、日期/去重/保底/星运/代理与自动通道、备份、徽章复杂度等现有套件。
- 静态283本地入口依赖、133脚本语法通过；另审计{len(refs)}根HTML/CSS本地引用，缺失0；动态JS不是静态穷举证明，主要路径由浏览器覆盖。
- 普通浏览器76流程通过，0页面错误：原唤取6、角色目标6、参考视觉6、多配置6、配置UI6、共享背包6（每流程17组）、官方角色导入mock40。1440/390视口×简中/繁中/英文；实体手机/其他浏览器未测。
- 页面真实操作：限定双主卡排序/其他折叠、角色图解码/缺图占位、手机顺序与时间轴满宽、历史组合筛选/重置、取消/全败保留原数据、文件夹本地解析只填URL、无手动连接/额外池、教学视频预留、双徽章图鉴、全部R0～R6示例、完整/隐藏UID（旧masked参数不输出UID）。
- IndexedDB/存档：逐池增量/重复/部分失败/取消、多账号、损坏/未来备份拒绝、跨库回滚/启动恢复；多配置迁移/默认/复制/删除、共享实体编辑/移除不抢占另一角色均验证。
- 图片：养成12PNG；原唤取30+6总体阶、目标30+6角色阶=72PNG；参考脚本额外下载{extraPNGs}PNG（四模式/完整UID/全部R示例），合计唤取{72+extraPNGs}。51组三语Canvas文字边界通过；预览/下载字节一致、字体/图片/Canvas故障覆盖。
- 另故障脚本覆盖配额失败保留、多账号、完整UID、Canvas失败/存储不可用；不将其计成额外76流程。包内精选{len(screens)}张本次代表图/PNG及画廊，不重复塞全部截图。

## 真实接口与环境边界

代理在Node内mock上游和绑定。浏览器拦截固定官方/社区接口，以明确fixture执行真实页面交互；自动通道针对CORS/HTTP/取消还另有单元断言。真实官方授权POST、真实玩家完整历史、真实Windows游戏日志、Android/iOS取链接、Cloudflare生产与Discord上传压缩均未执行；缺少真实条件，不请求用户秘密。不把这些写成通过或Node报告里的skipped。

当前计算与存储核心原件SHA核对，最近UI任务没有改总体公式或schema。本次也没有产品修改。ZIP的CRC/SHA、解压和复测结果见11及ZIP旁verification.json。\''')
''' +t[b:]
p.write_text(t,encoding='utf-8')
print('Audit now requires fresh 76 flows and current privacy/transport UI evidence.')
