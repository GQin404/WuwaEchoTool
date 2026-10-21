# 封面替换说明

集中映射：js/convene-covers.js 的 files；当前四份自制示意图为1000×560 SVG，均明确标示非官方。

| 卡池 | 稳定文件 |
|---|---|
| 常驻武器 | image/convene-current/standard-weapon.svg |
| 联动角色 | image/convene-current/collab-character.svg |
| 联动武器 | image/convene-current/collab-weapon.svg |
| 回响角色 | image/convene-current/reverb-character.svg |

直接用自己的SVG替换同名文件即可，无需改核心或计算代码；SVG也可嵌入自己的本地图片数据。若希望使用PNG/WebP/JPEG，把文件放在同一目录，仅在files集中表改对应扩展名。请保留类别占位降级文件。

卡片继承现有限定池的object-fit、渐变遮罩、圆角与桌面/手机样式；图片不会改变池分类或保底。当前illustrative元数据与三语标记将继续提醒占位性质；若拥有可靠正式图片并希望改标识，可单独调整该集中元数据，不能宣称本示意图为官方图。

已有_headers对convene-current设置no-cache/must-revalidate。浏览器测试已模拟在同路径替换800×400图片，确认无需改核心即显示；另验证加载失败自动降级。
