# 官方导入角色名称修复（2026-10-19）

绯雪（52）、丽贝卡（55）、洛瑟菈（56）的官方数字gid尚未登记；原名称备援仅允许57–63，导致选择阶段被拦截。另外55此前误写为蕾贝卡。

官方简体名称依据：
- [绯雪](https://wiki.kurobbs.com/mc/item/1488853937364017152)
- [丽贝卡](https://wiki.kurobbs.com/mc/item/1502681773647212544)
- [洛瑟菈](https://wiki.kurobbs.com/mc/item/1514097978770092032)

目录55改为官方简体名称丽贝卡，旧称蕾贝卡及繁体写法仅保留为导入别名；不新增选项。内部ID、图片路径、评分与存档结构不变。不把WIKI条目ID当作游戏角色ID，不猜测gid。

mappingOfficialRoleId供Register和Classic带名称导入共用：优先唯一已登记官方ID，否则仅允许52/55/56及既有57–63按明确完整名称唯一对应。非法／未知ID、简写、重复官方ID与歧义名称继续阻挡。无名称mappingRoleId保留旧版反向查询。Register移除额外字面名称比较，避免明确别名被二次否决。

实际官方gameRoleId继续随记录和importSource保存；旧存档不需迁移。tests/register-import.test.cjs覆盖三位的预览及显式保存、来源ID保留、正式名称／别名／繁体写法、旧版反向查询及重复／模糊对应保护。990xxx仅为合成测试ID，真实账号线上导入仍需验证。

## 本轮实际验证

- `npm test`：74项通过，0失败。
- `npm run check:static`：244个本地入口依赖、105个脚本语法检查通过。
- `WUWA_QA_WIDTHS=1440,320`，运行`node tests/register-import-browser.cjs`：28组验收通过，112张截图，0页面错误。包括三位角色在桌面／手机、繁中／简中／英文的6组新增选择→预览→保存回归，以及既有导入／异常／跨页与Classic更新验收。
- `git diff --check`通过。

浏览器使用无头Edge、独立context和合成资料／模拟官方响应，不接触真实账号或个人存档。结果见`artifacts/official-mapping-fix-20261019/official-import/browser-results.json`。没有修改评分公式、图片资源或用户存档。
