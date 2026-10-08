const toolVersion = "3.7.48";
const suiteAttributeMap = {
    "冰套": 1,
    "火套": 2,
    "雷套": 3,
    "风套": 4,
    "光套": 5,
    "暗套": 6,
    "奶套": 7,
    "轻云套": 8,
    "攻击套": 9,
    "凌冽套": 10,
    "此间套": 11,
    "幽夜套": 12,
    "高天套": 13,
    "无惧套": 14,
    "流云套": 15,
    "愿戴套": 16,
    "奔狼套": 17,
    "失序套": 18,
    "荣斗套": 19,
    "息界套": 20,
    "焚羽套": 21,
    "命理套": 22,
    "星构套": 23,
    "流金套": 24,
    "逆光套": 25,
    "长路套": 26,
    "斑驳套": 27,
    "听唤套": 28,
    "雪落套": 29,
    "剪心套": 30,
    "碎梦套": 31,
    "冥途套": 32,
    "清邪套": 33,
    "羽落套": 34,
    "衔梦套": 35,
    "镜影套": 36,
    "茜染套": 37,
};

function getSuiteAttributeId(suiteName) {
    if (!suiteName) {
        return 0;
    }
    return suiteAttributeMap[suiteName] || 0;
}
const roleList = [
    {
        "id": 1,
        "gid": 1304,
        "name": "今汐",
        "star": 5,
        "rule": 1,
        "cls": "mcr-jinxi",
        "normal": 0.02,
        "skill": 0.72,
        "heavy": 0,
        "liberate": 0.2,
        "other": 0.06,
        "maxscore": 490.0
    },
    {   //长离
        "id": 2,
        "gid": 1205,
        "name": "长离",
        "star": 5,
        "rule": 1,
        "cls": "mcr-changli",
        "normal": 0.01,
        "skill": 0.59,
        "heavy": 0,
        "liberate": 0.27,
        "other": 0.13,
        "maxscore": 482.3
    },
    {   //忌炎
        "id": 3,
        "gid": 1404,
        "name": "忌炎",
        "star": 5,
        "rule": 1,
        "cls": "mcr-jiyan",
        "normal": 0.02,
        "skill": 0.11,
        "heavy": 0.68,
        "liberate": 0,
        "other": 0.19,
        "maxscore": 487.6
    },
    {
        "id": 4,
        "gid": 1203,
        "name": "安可",
        "star": 5,
        "rule": 1,
        "cls": "mcr-anke",
        "normal": 0.59,
        "skill": 0.12,
        "heavy": 0.02,
        "liberate": 0.05,
        "other": 0.22,
        "maxscore": 482.4
    },
    {
        "id": 5,
        "gid": 1605,
        "name": "暗主-男",
        "star": 5,
        "rule": 1,
        "cls": "mcr-nanzhu-an",
        "normal": 0.20,
        "skill": 0.25,
        "heavy": 0.05,
        "liberate": 0.3,
        "other": 0.2,
        "maxscore": 473.0
    },
    {
        "id": 6,
        "gid": 1501,
        "name": "光主-男",
        "star": 5,
        "rule": 1,
        "cls": "mcr-nanzhu-guang",
        "normal": 0.11,
        "skill": 0.21,
        "heavy": 0.31,
        "liberate": 0.23,
        "other": 0.14,
        "maxscore": 473.4
    },
    {
        "id": 7,
        "gid": 1503,
        "name": "维里奈",
        "star": 5,
        "rule": 3,
        "cls": "mcr-weilinai",
        "normal": 0,
        "skill": 0,
        "heavy": 0,
        "liberate": 0,
        "other": 0,
        "maxscore": 442.9
    },
    {
        "id": 8,
        "gid": 1302,
        "name": "吟霖",
        "star": 5,
        "rule": 1,
        "cls": "mcr-yinlin",
        "normal": 0.08,
        "skill": 0.37,
        "heavy": 0.20,
        "liberate": 0.21,
        "other": 0.14,
        "maxscore": 474.7
    },
    {
        "id": 9,
        "gid": 1405,
        "name": "鉴心",
        "star": 5,
        "rule": 2,
        "cls": "mcr-jianxin",
        "normal": 0.24,
        "skill": 0.06,
        "heavy": 0.31,
        "liberate": 0.27,
        "other": 0.12,
        "maxscore": 491.8
    },
    {
        "id": 10,
        "gid": 1301,
        "name": "卡卡罗",
        "star": 5,
        "rule": 1,
        "cls": "mcr-kakaluo",
        "normal": 0.2,
        "skill": 0.05,
        "heavy": 0.03,
        "liberate": 0.52,
        "other": 0.2,
        "maxscore": 478.3
    },
    {
        "id": 11,
        "gid": 1104,
        "name": "雪豹",
        "star": 5,
        "rule": 1,
        "cls": "mcr-lingyang",
        "normal": 0.4,
        "skill": 0.3,
        "heavy": 0.04,
        "liberate": 0.04,
        "other": 0.22,
        "maxscore": 475.2
    },
    {
        "id": 12,
        "gid": 1204,
        "name": "莫特斐",
        "star": 4,
        "rule": 2,
        "cls": "mcr-motefei",
        "normal": 0.15,
        "skill": 0.31,
        "heavy": 0,
        "liberate": 0.48,
        "other": 0.06,
        "maxscore": 496.0
    },
    {
        "id": 13,
        "gid": 1103,
        "name": "白芷",
        "star": 4,
        "rule": 4,
        "cls": "mcr-baizhi",
        "normal": 0,
        "skill": 0,
        "heavy": 0,
        "liberate": 0,
        "other": 0,
        "maxscore": 437.3
    },
    {
        "id": 14,
        "gid": 1303,
        "name": "渊武",
        "star": 4,
        "rule": 5,
        "cls": "mcr-yuanwu",
        "normal": 0.05,
        "skill": 0.45,
        "heavy": 0,
        "liberate": 0.46,
        "other": 0.04,
        "maxscore": 497.1
    },
    {
        "id": 15,
        "gid": 1402,
        "name": "秧秧",
        "star": 4,
        "rule": 2,
        "cls": "mcr-yangyang",
        "normal": 0.05,
        "skill": 0.22,
        "heavy": 0.28,
        "liberate": 0.4,
        "other": 0.05,
        "maxscore": 493.0
    },
    {
        "id": 16,
        "gid": 1202,
        "name": "赤霞",
        "star": 4,
        "rule": 1,
        "cls": "mcr-chixia",
        "normal": 0.06,
        "skill": 0.46,
        "heavy": 0,
        "liberate": 0.35,
        "other": 0.13,
        "maxscore": 476.6
    },
    {
        "id": 17,
        "gid": 1602,
        "name": "丹瑾",
        "star": 4,
        "rule": 1,
        "cls": "mcr-danjin",
        "normal": 0.08,
        "skill": 0.22,
        "heavy": 0.32,
        "liberate": 0.2,
        "other": 0.18,
        "maxscore": 472.4
    },
    {
        "id": 18,
        "gid": 1403,
        "name": "秋水",
        "star": 4,
        "rule": 1,
        "cls": "mcr-qiushui",
        "normal": 0.25,
        "skill": 0.33,
        "heavy": 0,
        "liberate": 0.22,
        "other": 0.2,
        "maxscore": 472.8
    },
    {
        "id": 19,
        "gid": 1102,
        "name": "散华",
        "star": 4,
        "rule": 1,
        "cls": "mcr-sanhua",
        "normal": 0.02,
        "skill": 0.3,
        "heavy": 0.3,
        "liberate": 0.32,
        "other": 0.06,
        "maxscore": 472.4
    },
    {
        "id": 20,
        "gid": 1601,
        "name": "桃祁",
        "star": 4,
        "rule": 5,
        "cls": "mcr-taoqi",
        "normal": 0.08,
        "skill": 0.38,
        "heavy": 0,
        "liberate": 0.5,
        "other": 0.04,
        "maxscore": 500.0
    },
    {
        "id": 21,
        "gid": 1502,
        "name": "光主-女",
        "star": 5,
        "rule": 1,
        "cls": "mcr-nvzhu-guang",
        "normal": 0.11,
        "skill": 0.21,
        "heavy": 0.31,
        "liberate": 0.23,
        "other": 0.14,
        "maxscore": 473.4
    },
    {
        "id": 22,
        "gid": 1604,
        "name": "暗主-女",
        "star": 5,
        "rule": 1,
        "cls": "mcr-nvzhu-an",
        "normal": 0.20,
        "skill": 0.25,
        "heavy": 0.05,
        "liberate": 0.3,
        "other": 0.2,
        "maxscore": 473.0
    },
    {
        "id": 23,
        "gid": 1105,
        "name": "折枝",
        "star": 5,
        "rule": 1,
        "cls": "mcr-zhezhi",
        "normal": 0.54,
        "skill": 0.21,
        "heavy": 0.18,
        "liberate": 0,
        "other": 0.07,
        "maxscore": 479.5
    },
    {
        "id": 24,
        "gid": 1305,
        "name": "相里要",
        "star": 5,
        "rule": 1,
        "cls": "mcr-xiangliyao",
        "normal": 0.13,
        "skill": 0.07,
        "heavy": 0.05,
        "liberate": 0.62,
        "other": 0.13,
        "maxscore": 484.2
    },
    {
        "id": 25,
        "gid": 1505,
        "name": "守岸人",
        "star": 5,
        "rule": 6,
        "cls": "mcr-shouanren",
        "normal": 0,
        "skill": 0,
        "heavy": 0,
        "liberate": 0.97,
        "other": 0,
        "maxscore": 398.5
    },
    {
        "id": 26,
        "gid": 1106,
        "name": "釉瑚",
        "star": 4,
        "rule": 2,
        "cls": "mcr-youhu",
        "normal": 0.11,
        "skill": 0.33,
        "heavy": 0.08,
        "liberate": 0.29,
        "other": 0.19,
        "maxscore": 492.4
    },
    {
        "id": 27,
        "gid": 1603,
        "name": "椿",
        "star": 5,
        "rule": 1,
        "cls": "mcr-chun",
        "normal": 0.66,
        "skill": 0,
        "heavy": 0.02,
        "liberate": 0.22,
        "other": 0.1,
        "maxscore": 486.3
    },
    {
        "id": 28,
        "gid": 1504,
        "name": "灯灯",
        "star": 4,
        "rule": 1,
        "cls": "mcr-dengdeng",
        "normal": 0.64,
        "skill": 0.08,
        "heavy": 0,
        "liberate": 0.2,
        "other": 0.08,
        "maxscore": 485.2
    },
    {   //珂莱塔
        "id": 29,
        "gid": 1107,
        "name": "珂莱塔",
        "star": 5,
        "rule": 1,
        "cls": "mcr-kelaita",
        "normal": 0.11,
        "skill": 0.75,
        "heavy": 0,
        "liberate": 0,
        "other": 0.14,
        "maxscore": 491.5
    },
    {
        "id": 30,
        "gid": 1606,
        "name": "洛可可",
        "star": 5,
        "rule": 1,
        "cls": "mcr-luokeke",
        "normal": 0.03,
        "skill": 0.12,
        "heavy": 0.68,
        "liberate": 0,
        "other": 0.17,
        "maxscore": 487.5
    },
    {
        "id": 31,
        "gid": 1507,
        "name": "赞妮",
        "star": 5,
        "rule": 1,
        "cls": "mcr-zanni",
        "normal": 0.03,
        "skill": 0.01,
        "heavy": 0.76,
        "liberate": 0.12,
        "other": 0.09,
        "maxscore": 492
    },
    {
        "id": 32,
        "gid": 1506,
        "name": "菲比",
        "star": 5,
        "rule": 1,
        "cls": "mcr-feibi",
        "normal": 0.09,
        "skill": 0.04,
        "heavy": 0.54,
        "liberate": 0.12,
        "other": 0.21,
        "maxscore": 479
    },
    {
        "id": 33,
        "gid": 1206,
        "name": "布兰特",
        "star": 5,
        "rule": 7,
        "cls": "mcr-bulante",
        "normal": 0.62,
        "skill": 0.12,
        "heavy": 0,
        "liberate": 0.12,
        "other": 0.14,
        "maxscore": 454.9
    },
    {
        "id": 34,
        "gid": 1607,
        "name": "坎特雷拉",
        "star": 5,
        "rule": 1,
        "cls": "mcr-kanteleila",
        "normal": 0.79,
        "skill": 0.06,
        "heavy": 0.06,
        "liberate": 0,
        "other": 0.09,
        "maxscore": 493.9
    },
    {
        "id": 35,
        "gid": 1408,
        "name": "风主女",
        "star": 5,
        "rule": 1,
        "cls": "mcr-nvzhu-feng",
        "normal": 0.08,
        "skill": 0.62,
        "heavy": 0,
        "liberate": 0.17,
        "other": 0.13,
        "maxscore": 483.9
    },
    {
        "id": 36,
        "gid": 1406,
        "name": "风主男",
        "star": 5,
        "rule": 1,
        "cls": "mcr-nanzhu-feng",
        "normal": 0.08,
        "skill": 0.62,
        "heavy": 0,
        "liberate": 0.17,
        "other": 0.13,
        "maxscore": 483.9
    },
    {
        "id": 37,
        "gid": 1407,
        "name": "夏空",
        "star": 5,
        "rule": 2,
        "cls": "mcr-xiakong",
        "normal": 0.15,
        "skill": 0.06,
        "heavy": 0.23,
        "liberate": 0.47,
        "other": 0.09,
        "maxscore": 495.4
    },
    {   //卡提西亚
        "id": 38,
        "gid": 1409,
        "name": "卡提希娅",
        "star": 5,
        "rule": 8,
        "cls": "mcr-katixiya",
        "normal": 0.654,
        "skill": 0.103,
        "heavy": 0.029,
        "liberate": 0.188,
        "other": 0.025,
        "maxscore": 488.9
    },
    {   //露帕
        "id": 39,
        "gid": 1207,
        "name": "露帕",
        "star": 5,
        "rule": 2,
        "cls": "mcr-lupa",
        "normal": 0.102,
        "skill": 0.182,
        "heavy": 0.066,
        "liberate": 0.637,
        "other": 0.013,
        "maxscore": 503.5
    },
    {   //弗洛洛  
        "id": 40,
        "gid": 1608,
        "name": "弗洛洛",
        "star": 5,
        "rule": 9,
        "cls": "mcr-fuluoluo",
        "normal": 0.083,
        "skill": 0.403,
        "heavy": 0.0,
        "liberate": 0.048,
        "other": 0.465,
        "maxscore": 470.7
    },
    {   //奥古斯塔
        "id": 41,
        "gid": 1306,
        "name": "奥古斯塔",
        "star": 5,
        "rule": 1,
        "cls": "mcr-aogusita",
        "normal": 0.073,
        "skill": 0.17,
        "heavy": 0.729,
        "liberate": 0,
        "other": 0.028,
        "maxscore": 490.3
    },
    {   //尤诺
        "id": 42,
        "gid": 1410,
        "name": "尤诺",
        "star": 5,
        "rule": 2,
        "cls": "mcr-younuo",
        "normal": 0.22,
        "skill": 0.15,
        "heavy": 0,
        "liberate": 0.596,
        "other": 0.034,
        "maxscore": 501.2
    },
    {   //嘉贝莉娜
        "id": 43,
        "gid": 1208,
        "name": "嘉贝莉娜",
        "star": 5,
        "rule": 1,
        "cls": "mcr-jiabeilina",
        "normal": 0,
        "skill": 0,
        "heavy": 0.385,
        "liberate": 0,
        "other": 0.615,
        "maxscore": 475.2
    },
    {   //仇远
        "id": 44,
        "gid": 1411,
        "name": "仇远",
        "star": 5,
        "rule": 2,
        "cls": "mcr-qiuyuan",
        "normal": 0,
        "skill": 0,
        "heavy": 0.56,
        "liberate": 0,
        "other": 0.44,
        "maxscore": 499.3
    },
    {   //千咲
        "id": 45,
        "gid": 1508,
        "name": "千咲",
        "star": 5,
        "rule": 2,
        "cls": "mcr-qianxiao",
        "normal": 0.075,
        "skill": 0.042,
        "heavy": 0.0,
        "liberate": 0.75,
        "other": 0.133,
        "maxscore": 510.3
    },
    {   //卜灵
        "id": 46,
        "gid": 1307,
        "name": "卜灵",
        "star": 4,
        "rule": 3,
        "cls": "mcr-buling",
        "normal": 0,
        "skill": 0,
        "heavy": 0,
        "liberate": 0,
        "other": 0,
        "maxscore": 453
    },
    {   //琳奈
        "id": 47,
        "gid": 1509,
        "name": "琳奈",
        "star": 5,
        "rule": 2,
        "cls": "mcr-linnai",
        "normal": 0.61,
        "skill": 0.03,
        "heavy": 0,
        "liberate": 0.15,
        "other": 0.21,
        "maxscore": 502
    },
    {   //莫宁
        "id": 48,
        "gid": 1209,
        "name": "莫宁",
        "star": 5,
        "rule": 10,
        "cls": "mcr-moning",
        // 库街区技能资料显示：莫宁的核心循环是共鸣回路/强化重击、共鸣技能与共鸣解放；
        // 普攻只负责填充静质量能，故不应把技能伤害权重设为最高。
        "normal": 0.05,
        "skill": 0.25,
        "heavy": 0.25,
        "liberate": 0.40,
        "other": 0.05,
        "maxscore": 486.5
    },
    {   //爱弥斯
        "id": 49,
        "gid": 0,
        "name": "爱弥斯",
        "star": 5,
        "rule": 1,
        "cls": "mcr-aemeath",
        // 0–6链区分震谐／聚爆；光翼共奏与蓄力重击均为解放伤害。详见 docs/character-weights-51-53.md。
        "normal": 0.08,
        "skill": 0.02,
        "heavy": 0,
        "liberate": 0.7,
        "other": 0.2,
        "maxscore": 488.2
    },
    {   //陆·赫斯
        "id": 50,
        "gid": 0,
        "name": "陆·赫斯",
        "star": 5,
        "rule": 1,
        "cls": "mcr-luuk-herssen",
        // 库街区明确标注：流金回潮、斩杀日冕、日髓阵列、空中攻击与共鸣解放
        // 均按普攻伤害处理；普攻词条应成为主要收益来源。
        "normal": 0.82,
        "skill": 0.04,
        "heavy": 0.02,
        "liberate": 0.07,
        "other": 0.05,
        "maxscore": 494.6
    },
    {   //西格莉卡
        "id": 51,
        "gid": 0,
        "name": "西格莉卡",
        "star": 5,
        "rule": 1,
        "cls": "mcr-xigelika",
        // 零链估值：强化普攻、符语重击、回路及解放均按声骸技能伤害计入 other。 依据与限制见 docs/character-weights-51-53.md。
        "normal": 0.05,
        "skill": 0.01,
        "heavy": 0,
        "liberate": 0,
        "other": 0.94,
        "echoSkillShare": 0.88,
        "maxscore": 488.832
    },
    {   //绯雪
        "id": 52,
        "gid": 0,
        "name": "绯雪",
        "star": 5,
        "rule": 1,
        "cls": "mcr-feixue",
        // 零链估值：预求身攻击、居合与强化重击归解放；霜冻效应计入 other。 依据与限制见 docs/character-weights-51-53.md。
        "normal": 0.02,
        "skill": 0.07,
        "heavy": 0,
        "liberate": 0.81,
        "other": 0.1,
        "maxscore": 494.58
    },
    {   //达妮娅
        "id": 53,
        "gid": 0,
        "name": "达妮娅",
        "star": 5,
        "rule": 2,
        "cls": "mcr-daniya",
        // 零链副输出估值：虚质粒子充足，计入蚀域持续伤害；沿用副输出充能规则。 依据与限制见 docs/character-weights-51-53.md。
        "normal": 0.05,
        "skill": 0.15,
        "heavy": 0,
        "liberate": 0.75,
        "other": 0.05,
        "maxscore": 510.3
    },
    {   //露西
        "id": 54,
        "gid": 0,
        "name": "露西",
        "star": 5,
        "rule": 1,
        "cls": "mcr-luxi",
        "normal": 0.82,
        "skill": 0.04,
        "heavy": 0.02,
        "liberate": 0.07,
        "other": 0.05,
        "maxscore": 494.6
    },
    {   //蕾贝卡
        "id": 55,
        "gid": 0,
        "name": "蕾贝卡",
        "star": 5,
        "rule": 1,
        "cls": "mcr-leibeika",
        "normal": 0.82,
        "skill": 0.04,
        "heavy": 0.02,
        "liberate": 0.07,
        "other": 0.05,
        "maxscore": 494.6
    },
    {   //洛瑟菈
        "id": 56,
        "gid": 0,
        "name": "洛瑟菈",
        "star": 5,
        "rule": 1,
        "cls": "mcr-luosela",
        "normal": 0.82,
        "skill": 0.04,
        "heavy": 0.02,
        "liberate": 0.07,
        "other": 0.05,
        "maxscore": 494.6
    },
    {   //漂泊者·导电（女）
        "id": 57,
        "gid": 0,
        "name": "漂泊者·导电（女）",
        "star": 5,
        "rule": 1,
        "cls": "mcr-nvzhu-dian",
        "normal": 0.15,
        "skill": 0.5,
        "heavy": 0,
        "liberate": 0.225,
        "other": 0.125,
        "maxscore": 459.596717
    },
    {   //漂泊者·导电（男）
        "id": 58,
        "gid": 0,
        "name": "漂泊者·导电（男）",
        "star": 5,
        "rule": 1,
        "cls": "mcr-nanzhu-dian",
        "normal": 0.15,
        "skill": 0.5,
        "heavy": 0,
        "liberate": 0.225,
        "other": 0.125,
        "maxscore": 459.596717
    },
    {   //秧秧·玄翎
        "id": 59,
        "gid": 0,
        "name": "秧秧·玄翎",
        "star": 5,
        "rule": 1,
        "cls": "mcr-yangyang-xuanling",
        "normal": 0.051314,
        "skill": 0.012829,
        "heavy": 0.775499,
        "liberate": 0.115457,
        "other": 0.044901,
        "maxscore": 500.756649
    },
    {   //穗穗
        "id": 60,
        "gid": 0,
        "name": "穗穗",
        "star": 5,
        "rule": 1,
        "cls": "mcr-suisui",
        "normal": 0.119661,
        "skill": 0.043513,
        "heavy": 0.027196,
        "liberate": 0,
        "other": 0.80963,
        "maxscore": 299.92064
    },
    {   //清宵
        "id": 61,
        "gid": 0,
        "name": "清宵",
        "star": 5,
        "rule": 1,
        "cls": "mcr-qingxiao",
        "normal": 0.297843,
        "skill": 0.0334,
        "heavy": 0.454655,
        "liberate": 0.193228,
        "other": 0.020874,
        "maxscore": 484.433034
    },
    {   //景燃
        "id": 62,
        "gid": 0,
        "name": "景燃",
        "star": 5,
        "rule": 1,
        "cls": "mcr-jingran",
        "normal": 0.019481,
        "skill": 0.077922,
        "heavy": 0.87013,
        "liberate": 0,
        "other": 0.032467,
        "maxscore": 568.841212
    },
    {   //心
        "id": 63,
        "gid": 0,
        "name": "心",
        "star": 5,
        "rule": 1,
        "cls": "mcr-xin",
        "normal": 0.12,
        "skill": 0.69,
        "heavy": 0,
        "liberate": 0.06,
        "other": 0.13,
        "maxscore": 474.582891
    },
    {   //锁暝
        "id": 64,
        "gid": 0,
        "name": "锁暝",
        "star": 5,
        "rule": 1,
        "cls": "mcr-suoming",
        "normal": 0.82,
        "skill": 0.04,
        "heavy": 0.02,
        "liberate": 0.07,
        "other": 0.05,
        "maxscore": 494.6
    }
];
const costList = [
    {"id": 1, "name": "呼咻咻", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/0169f205ae224a5790207540f65fe08d20240426.png"},
    {"id": 2, "name": "咔嚓嚓", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/593b08fd33df403c97744343f5117ae620240426.png"},
    {"id": 3, "name": "阿嗞嗞", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/88f3ddaacaa24db8b22497f354562e4420240426.png"},
    {"id": 4, "name": "呜咔咔", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/2bbdf5b238b244d7ab38e21c9d60da0320240426.png"},
    {"id": 5, "name": "冰墩墩", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/4fde338841bb4dc6b9a4d102deac8d8a20240627.png"},
    {"id": 6, "name": "咕咕河豚", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/ecd7eb4a70604810b4e912e6c4f5586020240426.png"},
    {"id": 7, "name": "啾啾河豚", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/793e4a9865b94c1b8ca49a3f0faaaed920240426.png"},
    {"id": 8, "name": "遁地鼠", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/e2da3c6f17ec44bab82f9a02697050a120240426.png"},
    {"id": 9, "name": "绿熔蜥（稚形）", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/932037c0c114454c82a27d35a8c0c16b20240426.png"},
    {"id": 10, "name": "碎獠猪", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/2b539da411d34331be4570036ddc023e20240427.png"},
    {"id": 11, "name": "火鬃狼", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/e428ba1cfa504a1eb1ba3704ce8a642c20240426.png"},
    {"id": 12, "name": "晶螯蝎", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/289698a6d68c4cb1b8b43310d3dba99420240426.png"},
    {"id": 13, "name": "游弋蝶", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/6ca2cbcef1484e81bf2330c698ed27ca20240427.png"},
    {"id": 14, "name": "寒霜陆龟", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/9ce8a0ef4f174d0a8e547abc22a353c320240426.png"},
    {"id": 15, "name": "幼猿", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/739a60644aaf4c9392bc746bc1e0d42a20240426.png"},
    {"id": 16, "name": "融火虫", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/4d5613ec6a97400499ccb050ea61f6ab20240627.png"},
    {"id": 17, "name": "侏侏鸵", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/2a235883b369493293057db1b11dbdc920240627.png"},
    {"id": 18, "name": "青羽鹭", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/11510b2a239a4c9ebc3c8f3d9ea1a90020240426.png"},
    {"id": 19, "name": "紫羽鹭", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/36a883d4c3994e648d0f70997c349f7120240426.png"},
    {"id": 20, "name": "绿熔蜥", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/f8f633034f3f4e9c92879e17abb1072e20240426.png"},
    {"id": 21, "name": "箭簇熊", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/f41ba7c7a298425db6096e6398413c0f20240426.png"},
    {"id": 22, "name": "暗鬃狼", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/9c7c0b57f7c54db6a0d659cc93ba973620240426.png"},
    {"id": 23, "name": "戏猿", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/fbf019b1e67c4806afabce7abea7215520240426.png"},
    {"id": 24, "name": "雪鬃狼", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/53a78eb6a444483cb68263dbc470bce820240627.png"},
    {"id": 25, "name": "踏光兽", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/3f3a0c7e24fb4a5195581b68cc9765c720240627.png"},
    {"id": 26, "name": "飞廉之猩", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/28e034b5491b4ff5b1f666c01fb599e520240426.png"},
    {"id": 27, "name": "无常凶鹭", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/8b71b922b9e047089252fc809b3c1a0520240426.png"},
    {"id": 28, "name": "哀声鸷", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/6b0eae92354149809d27038163476a2f20240426.png"},
    {"id": 29, "name": "无冠者", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/04e42a1684004c4eadecfbccc36dc1b420240427.png"},
    {"id": 30, "name": "无妄者", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/bce78415bf9648a3b5922f4856f44ade20240426.jpg"},
    {"id": 31, "name": "鸣钟之龟", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/abe3743f93fc4fe5bd4dbdfd7affa15420240426.png"},
    {"id": 32, "name": "冷凝棱镜", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/27f965424e7e451aaeab967d99ea286120240426.png"},
    {"id": 33, "name": "热熔棱镜", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/2bc4dc14bfb54af490df01140331345220240426.png"},
    {"id": 34, "name": "湮灭棱镜", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/b08de64745534b4c8a49e17bdbca924020240426.png"},
    {"id": 35, "name": "衍射棱镜", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/94a69cd7077f49cb885b2f6e2e5575fc20240426.png"},
    {"id": 36, "name": "辉萤军势", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/474a951580dc4230b0af1f514e7ec06b20240426.png"},
    {"id": 37, "name": "车刃镰", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/b7327ba4b7d04b51bbba45e79faa2db720240426.png"},
    {"id": 38, "name": "聚械机偶", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/b262f4102cc141b4bf729231030f363d20240426.png"},
    {"id": 39, "name": "刺玫菇（稚形）", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/9c79c765494045778356140847c9919920240426.png"},
    {"id": 40, "name": "先锋幼岩", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/775f00cce78d4ec18ec0d0626e17875c20240515.png"},
    {"id": 41, "name": "裂变幼岩", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/a4606e65227a4c85a0d7de4aa1a2fcc620240426.png"},
    {"id": 42, "name": "刺玫菇", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/89be7e6fa54a45a185a9a8e49503110d20240426.png"},
    {"id": 43, "name": "坚岩斗士", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/65d31043ee3f4e96b42239e109d3151a20240426.png"},
    {"id": 44, "name": "惊蛰猎手", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/c3e21f5fa27542dab5e10918fa25db4720240426.png"},
    {"id": 45, "name": "破霜猎手", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/2bdef5792db44fa3a42748373d2d798a20240426.png"},
    {"id": 46, "name": "巡徊猎手", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/e0e5bf0f5ee04fbdb9ac7bc56bab806420240426.png"},
    {"id": 47, "name": "鸣泣战士", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/3a7d10fd860f45808e6ee4fa3fcde6a920240426.png"},
    {"id": 48, "name": "审判战士", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/1c1da210b52645ad8d6ef8d522fae7ef20240426.png"},
    {"id": 49, "name": "振铎乐师", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/118cd65a53274b0d8606e10bc438f32620240427.png"},
    {"id": 50, "name": "奏谕乐师", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/2f98d4f95a0d42329c225913527fe80f20240427.png"},
    {"id": 51, "name": "冥渊守卫", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/2f3a653b034d4940b3d36c6a64b0e17a20240426.png"},
    {"id": 52, "name": "磐石守卫", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/10741880c9044363bc9bd9ec027edaaf20240426.png"},
    {"id": 53, "name": "朔雷之鳞", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/8c108c3f9a084929b64d1c5c7bb6b42620240427.png"},
    {"id": 54, "name": "云闪之鳞", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/e21bf8535ec846309a8677e098da1e1620240427.png"},
    {"id": 55, "name": "燎照之骑", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/d4223bda276e4417bc24af1283bdd0f420240426.png"},
    {"id": 56, "name": "通行灯偶", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/6c9b3aeea9f2452fb5ace0137f370b0020240427.png"},
    {"id": 57, "name": "巡哨机傀", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/82df33ec8ee143318e64c5d06df8b18620240427.png"},
    {"id": 58, "name": "游鳞机枢", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/c7483c1a06fd48e08f3fc2c4f78a8c9920240627.png"},
    {"id": 59, "name": "角", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/33ae27a34f2443228d0c890d8f29890320240627.png"},
    {"id": 60, "name": "无归谬误", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/4c292e5cd46f4d17ba2d3e00682eacaf20240924.png"},
    {"id": 61, "name": "雷鬃狼", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/036c8baf003b40d48dc77ebdc426099020241229.png"},
    {"id": 62, "name": "霜鬃狼", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/3dad2a453528499894e31d92ffa632df20241229.png"},
    {"id": 63, "name": "风鬃狼", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/11f4d3db7cda495ea73da812eaab19f320241229.png"},
    {"id": 64, "name": "梦魇·飞廉之猩", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/db11e1bcd7ac4bc2a3bb08b9cb6157dc20241229.png"},
    {"id": 65, "name": "梦魇·无常凶鹭", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/335e89eb9cbf4535af5f52102e87b7cb20241229.png"},
    {"id": 66, "name": "梦魇·哀声鸷", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/af2c919bfbb345939f290a8042a8994420241229.png"},
    {"id": 67, "name": "梦魇·无冠者", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/c84bbf27e98d4895bdecfdb296eee18d20241229.png"},
    {"id": 68, "name": "叹息古龙", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/e1624919c8d3447080e0737c196c009220241229.png"},
    {"id": 69, "name": "浮灵偶·海德", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/24b89888a14d417d8cf7bb8edb5ce2f720241226.png"},
    {"id": 70, "name": "浮灵偶·蕾弗", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/7ca147d6b2824618991cd5d3afd8650f20241226.png"},
    {"id": 71, "name": "浮灵偶·莱特", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/bcb7b2fa2d1b4f10a3ed917493adf01320241226.png"},
    {"id": 72, "name": "幽翎火", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/a05bc3f30c3e46ee9ba045940a28eb9920241226.png"},
    {"id": 73, "name": "云海妖精", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/6e994dd300574cecb35eba6f0f46f58420241226.png"},
    {"id": 74, "name": "魔术先生", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/5890dde2e2fa4dff94c3de2b9fe5d2a920241229.png"},
    {"id": 75, "name": "寂寞小姐", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/a719ec7ab91f4e5abebb658b4c4c8b6720241229.png"},
    {"id": 76, "name": "工头布偶", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/28c93652d6c44a4fbb66c013ab14a9d120241229.png"},
    {"id": 77, "name": "欺诈奇藏", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/d836773f1df04aa48f2f8a57249d228720241229.png"},
    {"id": 78, "name": "浮灵偶", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/3fcee736d69d44579431fe9eff20f9b020241229.png"},
    {"id": 79, "name": "巨布偶", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/5ed383ba0bda4dcd908a8097d9aaa1a020241229.png"},
    {"id": 80, "name": "巡游骑士", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/7b75578db92c4709926e81e4e2a941c520241229.png"},
    {"id": 81, "name": "幻昼骑士", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/e850351994ce4bce9dbf2bafb4fa43b420241229.png"},
    {"id": 82, "name": "暗夜骑士", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/67c7f66535b5423099d8e0757ef0afd920241229.png"},
    {"id": 83, "name": "毒冠贵族", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/8782a0b7e82840988c1195199da8bad920241229.png"},
    {"id": 84, "name": "持刃贵族", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/70fdc81b348b43a698c44694cb672b4a20241229.png"},
    {"id": 85, "name": "凝水贵族", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/2139f6b5b72c444d849bfbd966a4689820241229.png"},
    {"id": 86, "name": "琉璃刀伶", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/2219279853804fd3856c301b8f9a801a20241229.png"},
    {"id": 87, "name": "梦魇·朔雷之鳞", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/f69d0dac328042c0b4445a86d38d848e20241229.png"},
    {"id": 88, "name": "梦魇·云闪之鳞", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/0a71ce525dd94262aed595e375ebc37620241229.png"},
    {"id": 89, "name": "梦魇·燎照之骑", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/d75fc3a157334d4988b9ab2402fea49620241229.png"},
    {"id": 90, "name": "罗蕾莱", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/d3eb93a6749c4d54a097e540b910c8c520241229.png"},
    {"id": 91, "name": "异构武装", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/e3db966705e04c60aa45ccc9d896020e20241229.png"},
    {"id": 92, "name": "赫卡忒", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/1343d9a542f7465d95b770becbe2e8ed20241229.png"},
    {"id": 93, "name": "重塑雕像的拳砾", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/a8c2f72af15d457f9a6fd8a334d460e620250211.png"},
    {"id": 94, "name": "飓力熊", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/7dab018b8e584624b1b4335887b2541620250211.png"},
    {"id": 95, "name": "气动棱镜", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/21368d11fbdc44d1be179ce2e93b50b220250211.png"},
    {"id": 96, "name": "愚金幼岩", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/29eb52ba61ed4fbea66e26c3989c5af020250211.png"},
    {"id": 97, "name": "釉变幼岩", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/8335fe25c4444cc28d526aad2ffd15eb20250211.png"},
    {"id": 98, "name": "梦魇·辉萤军势", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/134e6d2c7df94ec9937dbf04f80a8af520250324.png"},
    {"id": 99, "name": "共鸣回响·芙露德莉斯", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/3710b525ef8b423e99f9e758ba3b848720250321.png"},
    {"id": 100, "name": "慈悲节使", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/d1272887244b401787a7956e17ca289820250324.png"},
    {"id": 101, "name": "赦罪节使", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/069b27cb87054e1abb6a333d9a5352d020250324.png"},
    {"id": 102, "name": "卫冕节使", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/be12db1038164ac9b027b5ebfd947f7620250324.png"},
    {"id": 103, "name": "小翼龙·气动", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/920ea200365349e5bb20529bdc4f1e3b20250324.png"},
    {"id": 104, "name": "小翼龙·导电", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/92c5fd1f8c334230810972844ebe0f2820250324.png"},
    {"id": 105, "name": "小翼龙·冷凝", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/94c496877f464875a66c0e3c490a6d4120250324.png"},
    {"id": 106, "name": "荣光节使", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/33fb845b64ac472b8d6b4bdb5210068320250324.png"},
    {"id": 107, "name": "梦魇·凯尔匹", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/d2cc1c10359c41cea9bd0b51dfce8f5f20250609.png"},
    {"id": 108, "name": "荣耀狮像", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/21f49813c2c340458b7d70118245dddf20250609.png"},
    {"id": 109, "name": "角鳄", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/8ef3b860f8294bedb5ec2a2856c30f6420250609.png"},
    {"id": 110, "name": "传道者的遗形", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/bfaf2609c0654bb4bde519fc7cd02b1a20250609.png"},
    {"id": 111, "name": "小翼龙·衍射", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/cadc22ccdb674d8c8ba91b265725eb4720250609.png"},
    {"id": 112, "name": "小翼龙·热熔", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/31cae90d8c77499f95dc9b722cb850b820250609.png"},
    {"id": 113, "name": "小翼龙·湮灭", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/34d9bc856f6b42e69c1360f5f30736e220250609.png"},
    {"id": 114, "name": "苦信者的作俑", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/24a3a5d5955a4a708098d4b18dd9c59020250609.png"},
    {"id": 115, "name": "梦魇·破霜猎手", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/6164921eca0145818c82fd7cd5a655a420250719.png"},
    {"id": 116, "name": "梦魇·审判战士", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/ae628d73ba9f4dac97b3f3e75f02352620250719.png"},
    {"id": 117, "name": "梦魇·振铎乐师", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/3ac5b03abee848ccb856a38d8108bdf220250719.png"},
    {"id": 118, "name": "共鸣回响·芬莱克", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/144ce261af1c420c8162ab22a3a49f7420250719.png"},
    {"id": 119, "name": "梦魇·赫卡忒", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/02d80c7af1f8416ea99f32b16d4134ea20250719.png"},
    {"id": 120, "name": "蚀脊龙", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/79a5ff12d6a540798710ee1c57a164f820250826.png"},
    {"id": 121, "name": "伪作的神王", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/f37c0f443100404da580ee1d51a7930520250826.png"},
    {"id": 122, "name": "海之女", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/e4785c7f87b04a34bc7ed6498054172020250826.png"},
    {"id": 123, "name": "梦魇·紫羽鹭", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/8b3c38cafabf45299bff60d1871809e420250826.png"},
    {"id": 124, "name": "梦魇·青羽鹭", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/e80b452661cf4cff910ae561e6d9249b20250826.png"},
    {"id": 125, "name": "梦魇·巡徊猎手", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/00e427d7aa7f414194a44a308023707e20250826.png"},
    {"id": 126, "name": "梦魇·惊蛰猎手", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/2b1cb391359a45f2bf304770194e02d720250826.png"},
    {"id": 127, "name": "梦魇·咕咕河豚", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/a71e0873d3ac4cbfb513c562ff9ecec120250826.png"},
    {"id": 128, "name": "梦魇·啾啾河豚", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/46e438150bc84aa48ae2800211f7089020250826.png"},
    {"id": 129, "name": "共鸣回响·鸣式·利维亚坦", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/606b81b27481473781ae26d6a4df750f20250930.png"},
    {"id": 130, "name": "梦魇·绿熔蜥", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/528df4b8b188400ea044fec240e3227c20250930.png"},
    {"id": 131, "name": "梦魇·刺玫菇（稚形）", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/ffe1e1ecde324e978866641042dfaaa220250930.png"},
    {"id": 132, "name": "梦魇·绿熔蜥（稚形）", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/528df4b8b188400ea044fec240e3227c20250930.png"},
    {"id": 133, "name": "梦魇·呜咔咔", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/11457d754cc748a4bb3dfc890c7c05c820251114.png"},
    {"id": 134, "name": "梦魇·刺玫菇", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/07870ba6ae1c48aea18e91864dfa29a220251114.png"},
    {"id": 135, "name": "梦魇·侏侏鸵", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/65469080f05442c5ba72bb5cb1399c4020251114.png"},
    {"id": 136, "name": "噼啪啪", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/1551339ffefa450bb25097cebf504ed920251225.png"},
    {"id": 137, "name": "岩蛛S4型", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/5b4c99510c404bb6b9cffb5289db402c20251225.png"},
    {"id": 138, "name": "矿岩熊蜂", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/7da2506ceb444a50b8b8b851cdcc8def20251225.png"},
    {"id": 139, "name": "莳植熊蜂", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/33aa36f4dd5f47cd83cc303ff06447f720251225.png"},
    {"id": 140, "name": "颤栗战士", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/4cce6a381f514e2fb0787789b8feed7220251225.png"},
    {"id": 141, "name": "风鳞蜃甲", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/30f382b2ca5a4bd9a7a3012fb9363baa20251225.png"},
    {"id": 142, "name": "霜鳞蜃甲", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/8aa396442a4a486ca414c017cefe1a8e20251225.png"},
    {"id": 143, "name": "隐迹铁影", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/c2a29cbf64d14868b1953b14998c088220251225.png"},
    {"id": 144, "name": "锯袭铁影", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/6169be96c1574982ab95ae56274bd98820251225.png"},
    {"id": 145, "name": "探隧重机", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/9feafa395c834f6cbc9083f7950c1cd520251225.png"},
    {"id": 146, "name": "重工铁蹄", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/16f94a8288a14714abfc0c151819fe3720251225.png"},
    {"id": 147, "name": "矿岩机麋", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/14aa949b0e2c4414b8e1ce082472674220251225.png"},
    {"id": 148, "name": "莳植机麋", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/b4f1ef1b97aa40cf931b4e0b114309e420251225.png"},
    {"id": 149, "name": "双极·渊陨重锋", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/3e1ade5d856e4ef9bd3a9fce0ddde3e320251225.png"},
    {"id": 150, "name": "双极·星升辉铳", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/0c00bb3113a4417eb66f6c189185d19a20251225.png"},
    {"id": 151, "name": "海维夏", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/0909b97a0cc647eebd4709f1716bb57e20251225.png"},
    {"id": 152, "name": "炉芯机骸", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/c2f48b94135c403a933d202f5014f80620251225.png"},
    {"id": 153, "name": "冰盈舞者", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/32b4f54961c240ceb685a92dcd21200220260131.png"},
    {"id": 154, "name": "影烁者", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/98919727033e467a86ddb0e1b5f0fe7520260131.png"},
    {"id": 155, "name": "格洛犸图", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/87452807fb3147198f94d2b880a345b620260131.png"},
    {"id": 156, "name": "共鸣回响·冠顶苍隼", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/8695f300783344d0ae7a4ed4e0b7a2d220260131.png"},
    {"id": 157, "name": "冠顶械隼", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/957f5b4c853b48849d87bff371e82df420260131.png"},
    {"id": 158, "name": "辛吉勒姆", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/777036cbede346778f6e8b9cf46864cd20260204.png"},
    {"id": 159, "name": "无铭探索者", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/160483c26d3045258e736de8a506482f20260131.png"},
    {"id": 160, "name": "共鸣回响·鸣式·虚造神型", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/6238d0a1b9ad44a28266f5da32bf587120260427.png"},
    {"id": 161, "name": "共鸣回响·达妮娅", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/73fc9323ba3843a29e6980a4aa0f597f20260428.png"},
    {"id": 162, "name": "共鸣回响·梦魇亚当·重锤", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/b8e9ca9f69434565a9cd0ac7e627172f20260605.png"},
    {"id": 163, "name": "千傀重楼", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/cedcff1b762c4588a9ca91bf1ed56a3e20260706.png"},
    {"id": 164, "name": "封庭械囿", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/d5c10b1f2e2644d48a96e2d2033e824920260706.png"},
    {"id": 165, "name": "瓷庭候", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/995abc3ec1fb4299b81a70be7175523f20260707.png"},
    {"id": 166, "name": "石庭候", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/885e85b7b33a40bd8aa4e72d2e8ddbe620260707.png"},
    {"id": 167, "name": "金庭候", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/ddb724030ed3412a94a9e7bae77489d420260707.png"},
    {"id": 168, "name": "心傀·喜", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/f6221ad22fcb4335a757ab9ed12c9e8e20260706.png"},
    {"id": 169, "name": "心傀·怒", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/42f8b34296be4f6eb60ce1f07711545c20260707.png"},
    {"id": 170, "name": "心傀·忧", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/ad3b6c5e2aea4526882f046f0ba4995820260707.png"},
    {"id": 171, "name": "心傀·思", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/0cb2fa83868646d080b7345d1f45362e20260707.png"},
    {"id": 172, "name": "心傀·悲", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/2ff0333040bc4e31bb2816a2bfa817df20260707.png"},
    {"id": 173, "name": "心傀·恐", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/6446a63d7e6c4e6fa33dc0c07cd9190f20260707.png"},
    {"id": 174, "name": "霁息兽尊·身", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/6f4fdcf152e144e49a9b2bfb3861f42120260706.png"},
    {"id": 175, "name": "霁息兽尊·首", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/c141123b4cac4d569bceda44cf15591e20260706.png"},
    {"id": 176, "name": "不熄猎手", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/49f3858a8e834f7dbf34199b7f320edd20260927.png"},
    {"id": 177, "name": "霁息兽尊", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/1db6e30777604f019bc94ef473c15db820260706.png"},
    {"id": 178, "name": "万囮牢·朽躯", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/d40160c26ad84c54810ea40a0da1833620260707.png"},
    {"id": 179, "name": "融躯战士", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/a17c803247ee4e468568bcdfceb73c5620260706.png"},
    {"id": 180, "name": "天傀劫煞", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/db41db58abd64a3aa70eee7d238f8f8520260818.png"},
    {"id": 181, "name": "共鸣回响·天演溯心", "type": "Cost4", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/aa17bfdf387740f186ff81988192b3aa20260929.png"},
    {"id": 182, "name": "巡宵枪卫", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/fdc00647c06c4c689dba6a4534f28d3d20260927.png"},
    {"id": 183, "name": "绝息魄", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/b727819977e84c1e8a3d36abf0c1ff7820260927.png"},
    {"id": 184, "name": "解形煞", "type": "Cost3", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/de4eafba05624778b5f2ee9b9afee0c020260927.png"},
    {"id": 185, "name": "奇绽傀", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/c4560345eb6640668c203dc429856f1b20260927.png"},
    {"id": 186, "name": "玉冥蛇", "type": "Cost1", "imgCode": "https://prod-alicdn-community.kurobbs.com/forum/c17bce57248143e79a0ad4ef1366779a20260927.png"},
];
const ruleList = [
    {
        "ruleId": 0,
        "attack01": 1,
        "attack02": 1,
        "crit": 1,
        "critDamage": 1,
        "property": 1,
        "health01": 1,
        "health02": 1,
        "defenseLimit": 40,
        "defense01": 1,
        "defense02": 1,
        "efficiency01": 1,
        "efficiency02": 0,
        "unike": 1,
        "treat": 0
    },
    {   //攻击主C
        "ruleId": 1,
        "attack01": 1,
        "attack02": 0.1,
        "crit": 1.8,
        "critDamage": 0.9,
        "property": 1,
        "health01": 0,
        "health02": 0,
        "defense01": 0,
        "defense02": 0,
        "defenseLimit": 40,
        "efficiency01": 0.5,
        "efficiency02": 0,
        "unike": 1,
        "treat": 0
    },
    {   //辅助/副C
        "ruleId": 2,
        "attack01": 1,
        "attack02": 0.1,
        "crit": 1.8,
        "critDamage": 0.9,
        "property": 1,
        "health01": 0,
        "health02": 0,
        "defense01": 0,
        "defense02": 0,
        "defenseLimit": 40,
        "efficiency01": 1,
        "efficiency02": 0.3,
        "unike": 1,
        "treat": 0
    },
    {   //攻击奶
        "ruleId": 3,
        "attack01": 1.2,
        "attack02": 0.12,
        "crit": 0,
        "critDamage": 0,
        "property": 1,
        "health01": 0.9,
        "health02": 0.009,
        "defense01": 0.5,
        "defense02": 0.06,
        "defenseLimit": 80,
        "efficiency01": 1,
        "efficiency02": 0.5,
        "unike": 0,
        "treat": 2
    },
    {
        "ruleId": 4,
        "attack01": 0,
        "attack02": 0,
        "crit": 0,
        "critDamage": 0,
        "property": 1,
        "health01": 1.2,
        "health02": 0.012,
        "defense01": 0.8,
        "defense02": 0.06,
        "defenseLimit": 80,
        "efficiency01": 1,
        "efficiency02": 0.5,
        "unike": 0,
        "treat": 2
    },
    {
        "ruleId": 5,
        "attack01": 0,
        "attack02": 0,
        "crit": 1.8,
        "critDamage": 0.9,
        "property": 1,
        "health01": 0,
        "health02": 0,
        "defense01": 1.2,
        "defense02": 0.09,
        "defenseLimit": 40,
        "efficiency01": 1,
        "efficiency02": 0.3,
        "unike": 1,
        "treat": 0
    },
    {
        "ruleId": 6,
        "attack01": 0,
        "attack02": 0,
        "crit": 0,
        "critDamage": 0.1,
        "property": 0.1,
        "health01": 1.0,
        "health02": 0.01,
        "defense01": 0.8,
        "defense02": 0.06,
        "defenseLimit": 100,
        "efficiency01": 1.1,
        "efficiency02": 0.55,
        "unike": 0.1,
        "treat": 2
    },
    {
        "ruleId": 7,
        "attack01": 0.5,
        "attack02": 0.05,
        "crit": 1.8,
        "critDamage": 0.9,
        "property": 1,
        "health01": 0,
        "health02": 0,
        "defense01": 0,
        "defense02": 0,
        "defenseLimit": 180,
        "efficiency01": 1,
        "efficiency02": 0,
        "unike": 1,
        "treat": 0
    },
    {   //生命C
        //因卡提专武没有双爆，调整双爆在声骸中的收益比重，在此条件下44111比43311更优
        "ruleId": 8,
        "attack01": 0,
        "attack02": 0,
        "crit": 2,
        "critDamage": 1,
        "property": 1,
        "health01": 1,
        "health02": 0.007,
        "defense01": 0,
        "defense02": 0,
        "defenseLimit": 40,
        "efficiency01": 0.5,
        "efficiency02": 0,
        "unike": 1,
        "treat": 0
    },
    {   //弗洛洛 - 无共鸣能量因而共鸣效率比重为0
        "ruleId": 9,
        "attack01": 1,
        "attack02": 0.1,
        "crit": 1.8,
        "critDamage": 0.9,
        "property": 1,
        "health01": 0,
        "health02": 0,
        "defense01": 0,
        "defense02": 0,
        "defenseLimit": 1000,
        "efficiency01": 0,
        "efficiency02": 0,
        "unike": 1,
        "treat": 0
    },
    {
        //莫宁 - 防御奶
        "ruleId": 10,
        "attack01": 0,
        "attack02": 0,
        "crit": 0,
        "critDamage": 0,
        "property": 0.1,
        "health01": 0.9,
        "health02": 0.009,
        "defense01": 1.4,
        "defense02": 0.1,
        "defenseLimit": 160,
        "efficiency01": 1.4,
        "efficiency02": 0.7,
        "unike": 0.1,
        "treat": 2
    }
];
/**-
 var saveInfo={
    "pjLevel":0,
    "role":[
        {
            "roleId":4541535246,
            "roleListId":5,
            "totalScore":73.52,
            "name":"暗主",
            "cls":"mcr-az",
            "dbCritNum":5,
            "attackNum":5,
            "normal":0.2,
            "skill":0.2,
            "heavy":0.2,
            "liberate":0.2,
            "other":0.2,
            "gxjy":0,
            "costList":[
                {
                    "costId":1254656456,
                    "costListId":1,
                    "name":"呼咻咻",
                    "type":"Cost1",
                    "imgCode":"001",
                    "suite":"风套",
                    "mainAtrri":"攻击力18%",
                    "sumScores":"12.03",
                    "propertyList":[
                        {"property":"暴击","value":"6.3%"},
                        {"property":"暴伤","value":"12.6%"},
                        {"property":"攻击","value":"40"},
                        {"property":"攻击","value":"11.6%"}
                    ]
                }
            ]
        }
    ]
};--**/
//主词条可选值
const zctValue = [
    {
        "type": "Cost4",
        "values": ["暴击22%", "暴伤44%", "生命33%", "攻击力33%", "防御41.8%", "治疗26.4%"]
    },
    {
        "type": "Cost3",
        "values": ["攻击力30%", "属伤30%", "生命30%", "共鸣效率32%", "防御38%"]
    },
    {
        "type": "Cost1",
        "values": ["攻击力18%", "生命22.8%", "防御18%"]
    },
]
//副词条可选值
const fctValue = [
    {
        "type": 0,
        "values": ["6.3%", "6.9%", "7.5%", "8.1%", "8.7%", "9.3%", "9.9%", "10.5%"]
    },
    {
        "type": 1,
        "values": ["12.6%", "13.8%", "15%", "16.2%", "17.4%", "18.6%", "19.8%", "21%"]
    },
    {
        "type": 2,
        "values": ["6.4%", "7.1%", "7.9%", "8.6%", "9.4%", "10.1%", "10.9%", "11.6%"]
    },
    {
        "type": 3,
        "values": ["8.1%", "9%", "10%", "10.9%", "11.8%", "12.8%", "13.8%", "14.7%"]
    },
    {
        "type": 4,
        "values": ["6.8%", "7.6%", "8.4%", "9.2%", "10%", "10.8%", "11.6%", "12.4%"]
    },
    {
        "type": 5,
        "values": ["320", "360", "390", "430", "470", "510", "540", "580"]
    },
    {
        "type": 6,
        "values": ["30", "40", "50", "60"]
    },
    {
        "type": 7,
        "values": ["40", "50", "60", "70"]
    }
]
//全副词条值总和
const fctValueHJ = [
    {"property": "暴击", "value": "67.2%"},
    {"property": "暴伤", "value": "134.4%"},
    {"property": "大攻击", "value": "72%"},
    {"property": "小攻击", "value": "180"},
    {"property": "小生命", "value": "3600"},
    {"property": "小防御", "value": "180"},
    {"property": "共鸣效率", "value": "76.8%"},
    {"property": "大防御", "value": "91.1%"},
    {"property": "大生命", "value": "72%"},
    {"property": "普攻伤害", "value": "72%"},
    {"property": "重击伤害", "value": "72%"},
    {"property": "技能伤害", "value": "72%"},
    {"property": "解放伤害", "value": "72%"}
];
//角色满分声骸累计属性+基础加成+命座
const RoleSumProperty = [
    {
        "id": 1, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "58%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.0, "skill": 0.79, "heavy": 0, "liberate": 0.2, "other": 0.01, "maxscore": 484.9},
            {"normal": 0.0, "skill": 0.81, "heavy": 0, "liberate": 0.18, "other": 0.01, "maxscore": 485.5},
            {"normal": 0.0, "skill": 0.81, "heavy": 0, "liberate": 0.18, "other": 0.01, "maxscore": 445.5},
            {"normal": 0.0, "skill": 0.81, "heavy": 0, "liberate": 0.18, "other": 0.01, "maxscore": 442.2},
            {"normal": 0.0, "skill": 0.68, "heavy": 0, "liberate": 0.32, "other": 0.0, "maxscore": 436.8},
            {"normal": 0.0, "skill": 0.84, "heavy": 0, "liberate": 0.16, "other": 0.0, "maxscore": 443.2}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.8,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.8,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 0.8,
                "attack02": 0.08,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.8,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.8,
                "attack02": 0.08,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.73,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.73,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.8,
                "attack02": 0.08,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.73,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.73,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.8,
                "attack02": 0.08,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.73,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.73,
                "treat": 0
            },
        ]
    },
    {   //长离
        "id": 2, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "58%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.0, "skill": 0.65, "heavy": 0, "liberate": 0.24, "other": 0.11, "maxscore": 483.9},
            {"normal": 0.0, "skill": 0.65, "heavy": 0, "liberate": 0.24, "other": 0.11, "maxscore": 483.9},
            {"normal": 0.0, "skill": 0.6, "heavy": 0, "liberate": 0.31, "other": 0.9, "maxscore": 479.0},
            {"normal": 0.0, "skill": 0.6, "heavy": 0, "liberate": 0.31, "other": 0.9, "maxscore": 469.2},
            {"normal": 0.0, "skill": 0.71, "heavy": 0, "liberate": 0.21, "other": 0.8, "maxscore": 475.4},
            {"normal": 0.0, "skill": 0.71, "heavy": 0, "liberate": 0.21, "other": 0.8, "maxscore": 475.4}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.98,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.98,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.98,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.98,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.96,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.96,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.93,
                "attack02": 0.093,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.96,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.96,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.93,
                "attack02": 0.093,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.96,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.96,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.93,
                "attack02": 0.093,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.96,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.96,
                "treat": 0
            }
        ]
    },
    {
        "id": 3, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "58%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.01, "skill": 0.15, "heavy": 0.68, "liberate": 0, "other": 0.16, "maxscore": 487.6},
            {"normal": 0.01, "skill": 0.15, "heavy": 0.68, "liberate": 0, "other": 0.16, "maxscore": 475.0},
            {"normal": 0.01, "skill": 0.15, "heavy": 0.68, "liberate": 0, "other": 0.16, "maxscore": 464.6},
            {"normal": 0.01, "skill": 0.15, "heavy": 0.68, "liberate": 0, "other": 0.16, "maxscore": 456.5},
            {"normal": 0.01, "skill": 0.15, "heavy": 0.68, "liberate": 0, "other": 0.16, "maxscore": 435.3},
            {"normal": 0.01, "skill": 0.07, "heavy": 0.81, "liberate": 0, "other": 0.11, "maxscore": 442.1}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 0.91,
                "attack02": 0.091,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 0.91,
                "attack02": 0.091,
                "crit": 1.8,
                "critDamage": 0.8,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.91,
                "attack02": 0.091,
                "crit": 1.8,
                "critDamage": 0.8,
                "property": 0.92,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.92,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.76,
                "attack02": 0.076,
                "crit": 1.8,
                "critDamage": 0.8,
                "property": 0.92,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.92,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.76,
                "attack02": 0.076,
                "crit": 1.8,
                "critDamage": 0.8,
                "property": 0.92,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.92,
                "treat": 0
            }
        ]
    },
    {
        "id": 4, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "58%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.59, "skill": 0.12, "heavy": 0.02, "liberate": 0.05, "other": 0.22, "maxscore": 481.8},
            {"normal": 0.59, "skill": 0.12, "heavy": 0.02, "liberate": 0.05, "other": 0.22, "maxscore": 481.8},
            {"normal": 0.59, "skill": 0.08, "heavy": 0.08, "liberate": 0.05, "other": 0.20, "maxscore": 481.8},
            {"normal": 0.59, "skill": 0.08, "heavy": 0.08, "liberate": 0.05, "other": 0.20, "maxscore": 479.6},
            {"normal": 0.59, "skill": 0.10, "heavy": 0.08, "liberate": 0.05, "other": 0.18, "maxscore": 479.6},
            {"normal": 0.59, "skill": 0.10, "heavy": 0.08, "liberate": 0.05, "other": 0.18, "maxscore": 463.5}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.98,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.98,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.98,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.98,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.98,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.98,
                "treat": 0
            }, {
                "ruleId": 4,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.92,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.92,
                "treat": 0
            }, {
                "ruleId": 5,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.92,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.92,
                "treat": 0
            }, {
                "ruleId": 6,
                "attack01": 0.92,
                "attack02": 0.092,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.92,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.92,
                "treat": 0
            }

        ]
    },
    {
        "id": 5, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "23.2%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 6, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "23.2%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 7, "propertyList": [
            {"name": "暴击", "property": "0%"},
            {"name": "暴伤", "property": "0%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "62%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "58%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "73.5%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 8, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "23.2%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.08, "skill": 0.53, "heavy": 0.17, "liberate": 0.2, "other": 0.12, "maxscore": 477.5},
            {"normal": 0.08, "skill": 0.53, "heavy": 0.17, "liberate": 0.2, "other": 0.12, "maxscore": 477.5},
            {"normal": 0.07, "skill": 0.51, "heavy": 0.23, "liberate": 0.18, "other": 0.11, "maxscore": 476.8},
            {"normal": 0.07, "skill": 0.51, "heavy": 0.23, "liberate": 0.18, "other": 0.11, "maxscore": 463.5},
            {"normal": 0.02, "skill": 0.51, "heavy": 0.20, "liberate": 0.24, "other": 0.03, "maxscore": 463.5},
            {"normal": 0.0, "skill": 0.64, "heavy": 0.16, "liberate": 0.20, "other": 0.0, "maxscore": 465.7}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.9,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.9,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.9,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.9,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.9,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.9,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.94,
                "attack02": 0.094,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.9,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.9,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.94,
                "attack02": 0.094,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.9,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.9,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.94,
                "attack02": 0.094,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.85,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.85,
                "treat": 0
            }
        ]
    },
    {
        "id": 9, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "23.2%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 10, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "58%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.2, "skill": 0.05, "heavy": 0.03, "liberate": 0.52, "other": 0.2, "maxscore": 478.3},
            {"normal": 0.19, "skill": 0.08, "heavy": 0.02, "liberate": 0.52, "other": 0.19, "maxscore": 478.3},
            {"normal": 0.19, "skill": 0.08, "heavy": 0.02, "liberate": 0.52, "other": 0.19, "maxscore": 475.9},
            {"normal": 0.19, "skill": 0.08, "heavy": 0.02, "liberate": 0.52, "other": 0.19, "maxscore": 473.7},
            {"normal": 0.18, "skill": 0.08, "heavy": 0.01, "liberate": 0.52, "other": 0.21, "maxscore": 473.7},
            {"normal": 0.12, "skill": 0.08, "heavy": 0.01, "liberate": 0.60, "other": 0.19, "maxscore": 477.8}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.92,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.92,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.85,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.85,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.85,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.85,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.85,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.85,
                "treat": 0
            }
        ]
    },
    {
        "id": 11, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "23.2%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.4, "skill": 0.3, "heavy": 0.04, "liberate": 0.04, "other": 0.22, "maxscore": 475.2},
            {"normal": 0.4, "skill": 0.3, "heavy": 0.04, "liberate": 0.04, "other": 0.22, "maxscore": 475.2},
            {"normal": 0.4, "skill": 0.3, "heavy": 0.04, "liberate": 0.04, "other": 0.22, "maxscore": 474.4},
            {"normal": 0.4, "skill": 0.3, "heavy": 0.04, "liberate": 0.04, "other": 0.22, "maxscore": 473.6},
            {"normal": 0.52, "skill": 0.24, "heavy": 0.02, "liberate": 0.04, "other": 0.18, "maxscore": 476.2},
            {"normal": 0.63, "skill": 0.19, "heavy": 0.0, "liberate": 0.0, "other": 0.18, "maxscore": 474.9}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.9,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.9,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.83,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.83,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.83,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.83,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.6,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.6,
                "treat": 0
            }
        ]
    },
    {
        "id": 12, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "58%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 13, "propertyList": [
            {"name": "暴击", "property": "0%"},
            {"name": "暴伤", "property": "0%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "62%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "58%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "73.5%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 14, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "0%"},
            {"name": "小攻击", "property": "0"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "23.2%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "73.5%"},
            {"name": "小防御", "property": "350"}
        ]
    },
    {
        "id": 15, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "58%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 16, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "58%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 17, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "23.2%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 18, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "23.2%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 19, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "23.2%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 20, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "0%"},
            {"name": "小攻击", "property": "0"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "58%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "73.5%"},
            {"name": "小防御", "property": "140"}
        ]
    },
    {
        "id": 21, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "58%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 22, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "23.2%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 23, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "58%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.54, "skill": 0.21, "heavy": 0.18, "liberate": 0, "other": 0.07, "maxscore": 479.5},
            {"normal": 0.58, "skill": 0.20, "heavy": 0.17, "liberate": 0, "other": 0.05, "maxscore": 481.7},
            {"normal": 0.58, "skill": 0.20, "heavy": 0.17, "liberate": 0, "other": 0.05, "maxscore": 460.7},
            {"normal": 0.58, "skill": 0.20, "heavy": 0.17, "liberate": 0, "other": 0.05, "maxscore": 450.7},
            {"normal": 0.69, "skill": 0.16, "heavy": 0.14, "liberate": 0, "other": 0.01, "maxscore": 457.0},
            {"normal": 0.76, "skill": 0.14, "heavy": 0.10, "liberate": 0, "other": 0.0, "maxscore": 461.3}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 0.85,
                "attack02": 0.085,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.78,
                "attack02": 0.078,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.78,
                "attack02": 0.078,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.78,
                "attack02": 0.078,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
        ]
    },
    {
        "id": 24, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "58%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.11, "skill": 0.05, "heavy": 0.03, "liberate": 0.7, "other": 0.11, "maxscore": 488.7},
            {"normal": 0.11, "skill": 0.05, "heavy": 0.03, "liberate": 0.7, "other": 0.11, "maxscore": 479.0},
            {"normal": 0.9, "skill": 0.04, "heavy": 0.02, "liberate": 0.76, "other": 0.09, "maxscore": 482.7},
            {"normal": 0.9, "skill": 0.04, "heavy": 0.02, "liberate": 0.76, "other": 0.09, "maxscore": 477.3},
            {"normal": 0.07, "skill": 0.03, "heavy": 0.01, "liberate": 0.82, "other": 0.07, "maxscore": 480.3},
            {"normal": 0.05, "skill": 0.02, "heavy": 0.01, "liberate": 0.87, "other": 0.05, "maxscore": 483.0}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.81,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.81,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.81,
                "property": 0.88,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.88,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.81,
                "property": 0.88,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.88,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.81,
                "property": 0.88,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.88,
                "treat": 0
            },
        ]
    },
    {
        "id": 25, "propertyList": [
            {"name": "暴击", "property": "0%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "0%"},
            {"name": "小攻击", "property": "0"},
            {"name": "共鸣效率", "property": "62%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "58%"},
            {"name": "大生命", "property": "58%"},
            {"name": "小生命", "property": "2900"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0,"skill": 0,"heavy": 0,"liberate": 0.97,"other": 0, "maxscore": 398.5},
            {"normal": 0,"skill": 0,"heavy": 0,"liberate": 0.97,"other": 0, "maxscore": 398.5},
            {"normal": 0,"skill": 0,"heavy": 0,"liberate": 0.97,"other": 0, "maxscore": 398.5},
            {"normal": 0,"skill": 0,"heavy": 0,"liberate": 0.97,"other": 0, "maxscore": 398.5},
            {"normal": 0,"skill": 0,"heavy": 0,"liberate": 0.97,"other": 0, "maxscore": 398.5},
            {"normal": 0,"skill": 0,"heavy": 0,"liberate": 0.97,"other": 0, "maxscore": 479.8}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 0,
                "attack02": 0,
                "crit": 0,
                "critDamage": 0.1,
                "property": 0.1,
                "health01": 1.0,
                "health02": 0.01,
                "defense01": 0.8,
                "defense02": 0.06,
                "defenseLimit": 100,
                "efficiency01": 1.1,
                "efficiency02": 0.55,
                "unike": 0.1,
                "treat": 2
            },
            {
                "ruleId": 2,
                "attack01": 0,
                "attack02": 0,
                "crit": 0,
                "critDamage": 0.1,
                "property": 0.1,
                "health01": 1.0,
                "health02": 0.01,
                "defense01": 0.8,
                "defense02": 0.06,
                "defenseLimit": 100,
                "efficiency01": 1.1,
                "efficiency02": 0.55,
                "unike": 0.1,
                "treat": 2
            },
            {
                "ruleId": 3,
                "attack01": 0,
                "attack02": 0,
                "crit": 0,
                "critDamage": 0.1,
                "property": 0.1,
                "health01": 1.0,
                "health02": 0.01,
                "defense01": 0.8,
                "defense02": 0.06,
                "defenseLimit": 100,
                "efficiency01": 1.1,
                "efficiency02": 0.55,
                "unike": 0.1,
                "treat": 2
            },
            {
                "ruleId": 4,
                "attack01": 0,
                "attack02": 0,
                "crit": 0,
                "critDamage": 0.1,
                "property": 0.1,
                "health01": 1.0,
                "health02": 0.01,
                "defense01": 0.8,
                "defense02": 0.06,
                "defenseLimit": 100,
                "efficiency01": 1.1,
                "efficiency02": 0.55,
                "unike": 0.1,
                "treat": 2
            },
            {
                "ruleId": 5,
                "attack01": 0,
                "attack02": 0,
                "crit": 0,
                "critDamage": 0.1,
                "property": 0.1,
                "health01": 1.0,
                "health02": 0.01,
                "defense01": 0.8,
                "defense02": 0.06,
                "defenseLimit": 100,
                "efficiency01": 1.1,
                "efficiency02": 0.55,
                "unike": 0.1,
                "treat": 2
            },
            {
                "ruleId": 6,
                "attack01": 0,
                "attack02": 0,
                "crit": 0,
                "critDamage": 1.0,
                "property": 1,
                "health01": 1.0,
                "health02": 0.01,
                "defense01": 0.8,
                "defense02": 0.06,
                "defenseLimit": 100,
                "efficiency01": 1.1,
                "efficiency02": 0.55,
                "unike": 1,
                "treat": 2
            }
        ]
    },
    {
        "id": 26, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "23.2%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {   //椿：27
        "id": 27, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "58%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.66, "skill": 0, "heavy": 0.02, "liberate": 0.22, "other": 0.1, "maxscore": 486.3},
            {"normal": 0.72, "skill": 0, "heavy": 0.01, "liberate": 0.19, "other": 0.08, "maxscore": 490},
            {"normal": 0.67, "skill": 0, "heavy": 0, "liberate": 0.28, "other": 0.05, "maxscore": 487.1},
            {"normal": 0.7, "skill": 0, "heavy": 0, "liberate": 0.26, "other": 0.04, "maxscore": 481.6},
            {"normal": 0.66, "skill": 0, "heavy": 0, "liberate": 0.24, "other": 0.1, "maxscore": 479},
            {"normal": 0.8, "skill": 0, "heavy": 0, "liberate": 0.16, "other": 0.04, "maxscore": 487.3}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.88,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.88,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.88,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
        ]
    },
    {
        "id": 28, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "58%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {   //珂莱塔
        "id": 29, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "58%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.10, "skill": 0.76, "heavy": 0, "liberate": 0, "other": 0.14, "maxscore": 492.2},
            {"normal": 0.09, "skill": 0.78, "heavy": 0, "liberate": 0, "other": 0.13, "maxscore": 493.2},
            {"normal": 0.05, "skill": 0.76, "heavy": 0, "liberate": 0, "other": 0.19, "maxscore": 492.2},
            {"normal": 0.05, "skill": 0.76, "heavy": 0, "liberate": 0, "other": 0.19, "maxscore": 488.5},
            {"normal": 0.04, "skill": 0.77, "heavy": 0, "liberate": 0, "other": 0.19, "maxscore": 489.1},
            {"normal": 0.02, "skill": 0.86, "heavy": 0, "liberate": 0, "other": 0.12, "maxscore": 494.2}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                //珂莱塔4命有技能增伤，然而组队中对攻击区通常也有大量加成，因此这里不下调属伤的收益，因为对于高链珂莱塔一攻一属通常为最优解
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
        ]
    },
    {
        "id": 30, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "0%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "58%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0,"skill": 0.14,"heavy": 0.68,"liberate": 0,"other": 0.18, "maxscore": 487.5},
            {"normal": 0,"skill": 0.14,"heavy": 0.68,"liberate": 0,"other": 0.18, "maxscore": 471.4},
            {"normal": 0,"skill": 0.14,"heavy": 0.68,"liberate": 0,"other": 0.18, "maxscore": 460.9},
            {"normal": 0,"skill": 0.11,"heavy": 0.74,"liberate": 0,"other": 0.15, "maxscore": 463.8},
            {"normal": 0,"skill": 0.08,"heavy": 0.80,"liberate": 0,"other": 0.12, "maxscore": 466.9},
            {"normal": 0,"skill": 0.04,"heavy": 0.90,"liberate": 0,"other": 0.06, "maxscore": 471.8}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 20,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.84,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 20,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.84,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.8,
                "property": 0.84,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 20,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.84,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.8,
                "property": 0.84,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 20,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.84,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.8,
                "property": 0.84,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 20,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.84,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.8,
                "property": 0.84,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 20,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.84,
                "treat": 0
            }]
    },
    {
        "id": 31, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "180"},
            {"name": "共鸣效率", "property": "24.8%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "58%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.03,"skill": 0.01,"heavy": 0.76,"liberate": 0.12,"other": 0.09, "maxscore": 477.3},
            {"normal": 0.03,"skill": 0.0,"heavy": 0.75,"liberate": 0.12,"other": 0.1, "maxscore": 476.6},
            {"normal": 0.02,"skill": 0.0,"heavy": 0.72,"liberate": 0.18,"other": 0.09, "maxscore": 475.3},
            {"normal": 0.02,"skill": 0.0,"heavy": 0.72,"liberate": 0.18,"other": 0.09, "maxscore": 462.8},
            {"normal": 0.02,"skill": 0.0,"heavy": 0.71,"liberate": 0.19,"other": 0.09, "maxscore": 462.4},
            {"normal": 0.01,"skill": 0.0,"heavy": 0.9,"liberate": 0.06,"other": 0.03, "maxscore": 471.1}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 35,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.8,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 35,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.8,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 35,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.8,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.93,
                "attack02": 0.093,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 35,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.8,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.93,
                "attack02": 0.093,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 35,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.8,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.93,
                "attack02": 0.093,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 35,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.8,
                "treat": 0
            },
        ]
    },
    {
        "id": 32, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "0%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "58%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.06,"skill": 0.02,"heavy": 0.53,"liberate": 0.18,"other": 0.20, "maxscore": 478.1},
            {"normal": 0.04,"skill": 0.01,"heavy": 0.50,"liberate": 0.15,"other": 0.30, "maxscore": 476.6},
            {"normal": 0.02,"skill": 0,"heavy": 0.65,"liberate": 0.09,"other": 0.24, "maxscore": 485.1},
            {"normal": 0.02,"skill": 0,"heavy": 0.65,"liberate": 0.09,"other": 0.24, "maxscore": 485.1},
            {"normal": 0.02,"skill": 0,"heavy": 0.65,"liberate": 0.09,"other": 0.24, "maxscore": 482.3},
            {"normal": 0.02,"skill": 0,"heavy": 0.65,"liberate": 0.09,"other": 0.24, "maxscore": 477.7}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 20,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 20,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 20,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 20,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.97,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 20,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.97,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.97,
                "attack02": 0.097,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.97,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 20,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.97,
                "treat": 0
            }]
    },
    {
        "id": 33, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "0"},
            {"name": "共鸣效率", "property": "62%"},
            {"name": "普攻伤害", "property": "58%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.62,"skill": 0.12,"heavy": 0,"liberate": 0.12,"other": 0.14, "maxscore": 449.4},
            {"normal": 0.60,"skill": 0.11,"heavy": 0,"liberate": 0.11,"other": 0.18, "maxscore": 448.4},
            {"normal": 0.66,"skill": 0.09,"heavy": 0,"liberate": 0.09,"other": 0.16, "maxscore": 451.6},
            {"normal": 0.66,"skill": 0.09,"heavy": 0,"liberate": 0.09,"other": 0.16, "maxscore": 451.6},
            {"normal": 0.66,"skill": 0.09,"heavy": 0,"liberate": 0.09,"other": 0.16, "maxscore": 448.3},
            {"normal": 0.76,"skill": 0.05,"heavy": 0,"liberate": 0.07,"other": 0.12, "maxscore": 453.1}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 0.5,
                "attack02": 0.05,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.85,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 180,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 0.85,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 0.5,
                "attack02": 0.05,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.85,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 180,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 0.85,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 0.5,
                "attack02": 0.05,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.85,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 180,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 0.85,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.5,
                "attack02": 0.05,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.85,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 180,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 0.85,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.5,
                "attack02": 0.05,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.77,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 180,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 0.77,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.5,
                "attack02": 0.05,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.77,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 180,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 0.77,
                "treat": 0
            }
        ]
    },
    {
        "id": 34, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "58%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.87,"skill": 0.04,"heavy": 0.04,"liberate": 0,"other": 0.05, "maxscore": 498.7},
            {"normal": 0.9,"skill": 0.03,"heavy": 0.03,"liberate": 0,"other": 0.04, "maxscore": 500.2},
            {"normal": 0.92, "skill": 0.02, "heavy": 0.02, "liberate": 0, "other": 0.04, "maxscore": 501.7},
            {"normal": 0.92, "skill": 0.02, "heavy": 0.02, "liberate": 0, "other": 0.04, "maxscore": 501.7},
            {"normal": 0.92, "skill": 0.02, "heavy": 0.02, "liberate": 0, "other": 0.04, "maxscore": 501.7},
            {"normal": 0.96, "skill": 0.01, "heavy": 0.01, "liberate": 0, "other": 0.02, "maxscore": 503.7}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
        ]
    },
    {
        "id": 35, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "180"},
            {"name": "共鸣效率", "property": "24.8%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "58%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 36, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "180"},
            {"name": "共鸣效率", "property": "24.8%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "58%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 37, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "23.2%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.15,"skill": 0.06,"heavy": 0.23,"liberate": 0.47,"other": 0.09, "maxscore": 477.9},
            {"normal": 0.15,"skill": 0.06,"heavy": 0.23,"liberate": 0.47,"other": 0.09, "maxscore": 463.8},
            {"normal": 0.14,"skill": 0.1,"heavy": 0.22,"liberate": 0.46,"other": 0.08, "maxscore": 463.6},
            {"normal": 0.07,"skill": 0.05,"heavy": 0.23,"liberate": 0.62,"other": 0.03, "maxscore": 466.5},
            {"normal": 0.06,"skill": 0.04,"heavy": 0.22,"liberate": 0.66,"other": 0.02, "maxscore": 459.7},
            {"normal": 0.05,"skill": 0.03,"heavy": 0.18,"liberate": 0.72,"other": 0.02, "maxscore": 460.5}
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 0.89,
                "attack02": 0.089,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 0.89,
                "attack02": 0.089,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 0.8,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 0.89,
                "attack02": 0.089,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 0.8,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.89,
                "attack02": 0.089,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 0.8,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.89,
                "attack02": 0.089,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.7,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 0.7,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.89,
                "attack02": 0.089,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.7,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 0.7,
                "treat": 0
            }
        ]
    },
    {   //卡提希娅
        "id": 38, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "0%"},
            {"name": "小攻击", "property": "0"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "58%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "58%"},
            {"name": "小生命", "property": "1160"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.654,"skill": 0.103,"heavy": 0.029,"liberate": 0.188,"other": 0.025,"maxscore": 488.9},
            {"normal": 0.706,"skill": 0.084,"heavy": 0.024,"liberate": 0.154,"other": 0.031,"maxscore": 492.2},
            {"normal": 0.547,"skill": 0.085,"heavy": 0.024,"liberate": 0.311,"other": 0.032,"maxscore": 482.5},
            {"normal": 0.547,"skill": 0.085,"heavy": 0.024,"liberate": 0.311,"other": 0.032,"maxscore": 482.5},
            {"normal": 0.547,"skill": 0.085,"heavy": 0.024,"liberate": 0.311,"other": 0.032,"maxscore": 482.5},
            {"normal": 0.547,"skill": 0.085,"heavy": 0.024,"liberate": 0.311,"other": 0.032,"maxscore": 482.5},
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 0,
                "attack02": 0,
                "crit": 2,
                "critDamage": 1,
                "property": 1,
                "health01": 1,
                "health02": 0.007,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 0,
                "attack02": 0,
                "crit": 2,
                "critDamage": 1,
                "property": 1,
                "health01": 1,
                "health02": 0.007,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 0,
                "attack02": 0,
                "crit": 2,
                "critDamage": 1,
                "property": 1,
                "health01": 1,
                "health02": 0.007,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0,
                "attack02": 0,
                "crit": 2,
                "critDamage": 1,
                "property": 0.92,
                "health01": 1,
                "health02": 0.007,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0,
                "attack02": 0,
                "crit": 2,
                "critDamage": 1,
                "property": 0.92,
                "health01": 1,
                "health02": 0.007,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0,
                "attack02": 0,
                "crit": 2,
                "critDamage": 1,
                "property": 0.92,
                "health01": 1,
                "health02": 0.007,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            }
        ]
    },
    {   //露帕
        "id": 39,
        "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "23.2%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.102, "skill": 0.182, "heavy": 0.066, "liberate": 0.637, "other": 0.013, "maxscore": 503.5},
            {"normal": 0.102, "skill": 0.182, "heavy": 0.066, "liberate": 0.637, "other": 0.013, "maxscore": 503.5},
            {"normal": 0.084,"skill": 0.149,"heavy": 0.054,"liberate": 0.702,"other": 0.01,"maxscore": 507.38},
            {"normal": 0.071,"skill": 0.1276,"heavy": 0.046,"liberate": 0.746,"other": 0.008,"maxscore": 510.3},
            {"normal": 0.071,"skill": 0.1276,"heavy": 0.046,"liberate": 0.746,"other": 0.008,"maxscore": 510.3},
            {"normal": 0.0375,"skill": 0.1336,"heavy": 0.048,"liberate": 0.78,"other": 0,"maxscore": 511.8},
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.9,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.9,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.9,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.89,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.89,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
        ]
    },
    {   //弗洛洛
        "id": 40,
        "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "0%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "58%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.073, "skill": 0.478, "heavy": 0.0, "liberate": 0.042, "other": 0.407, "maxscore": 475.1},
            {"normal": 0.063, "skill": 0.548, "heavy": 0.0, "liberate": 0.037, "other": 0.352, "maxscore": 479.6},
            {"normal": 0.053, "skill": 0.463, "heavy": 0.0, "liberate": 0.031, "other": 0.452, "maxscore": 474.3},
            {"normal": 0.053, "skill": 0.463, "heavy": 0.0, "liberate": 0.031, "other": 0.452, "maxscore": 474.3},
            {"normal": 0.053, "skill": 0.463, "heavy": 0.0, "liberate": 0.031, "other": 0.452, "maxscore": 474.3},
            {"normal": 0.047, "skill": 0.408, "heavy": 0.0, "liberate": 0.027, "other": 0.516, "maxscore": 439.5},
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 1000,
                "efficiency01": 0,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 1000,
                "efficiency01": 0,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 1000,
                "efficiency01": 0,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 1000,
                "efficiency01": 0,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 1000,
                "efficiency01": 0,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.55,
                "critDamage": 0.775,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 1000,
                "efficiency01": 0,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
        ]
    },
    {   //奥古斯塔
        "id": 41,
        "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.073, "skill": 0.17, "heavy": 0.729, "liberate": 0, "other": 0.028, "maxscore": 479.0},
            {"normal": 0.073, "skill": 0.17, "heavy": 0.729, "liberate": 0, "other": 0.028, "maxscore": 430.2},
            {"normal": 0.064, "skill": 0.15, "heavy": 0.762, "liberate": 0, "other": 0.0244, "maxscore": 432.2},
            {"normal": 0.064, "skill": 0.15, "heavy": 0.762, "liberate": 0, "other": 0.0244, "maxscore": 425.1},
            {"normal": 0.064, "skill": 0.15, "heavy": 0.762, "liberate": 0, "other": 0.0244, "maxscore": 425.1},
            {"normal": 0.057, "skill": 0.13, "heavy": 0.788, "liberate": 0, "other": 0.021, "maxscore": 391.8},
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.82,
                "property": 0.95,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.35,
                "critDamage": 0.675,
                "property": 0.95,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.35,
                "critDamage": 0.675,
                "property": 0.95,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.95,
                "attack02": 0.095,
                "crit": 1.35,
                "critDamage": 0.675,
                "property": 0.95,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.95,
                "attack02": 0.095,
                "crit": 1.35,
                "critDamage": 0.675,
                "property": 0.95,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.95,
                "attack02": 0.095,
                "crit": 1.08,
                "critDamage": 0.54,
                "property": 0.95,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
        ]
    },
    {
        "id": 42,
        "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "58%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.22, "skill": 0.15, "heavy": 0, "liberate": 0.596, "other": 0.034, "maxscore": 490.2},
            {"normal": 0.22, "skill": 0.15, "heavy": 0, "liberate": 0.596, "other": 0.034, "maxscore": 490.2},
            {"normal": 0.22, "skill": 0.15, "heavy": 0, "liberate": 0.596, "other": 0.034, "maxscore": 490.2},
            {"normal": 0.22, "skill": 0.15, "heavy": 0, "liberate": 0.596, "other": 0.034, "maxscore": 490.2},
            {"normal": 0.22, "skill": 0.15, "heavy": 0, "liberate": 0.596, "other": 0.034, "maxscore": 487.4},
            {"normal": 0.21, "skill": 0.07, "heavy": 0, "liberate": 0.70, "other": 0.02, "maxscore": 474.3},
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 0.92,
                "attack02": 0.092,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 0.92,
                "attack02": 0.092,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 0.92,
                "attack02": 0.092,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.92,
                "attack02": 0.092,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.92,
                "attack02": 0.092,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 0.92,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.92,
                "attack02": 0.092,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0.0,
                "unike": 0.92,
                "treat": 0
            }
        ]
    },
    {
        "id": 43,
        "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "23.2%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.0, "skill": 0.0, "heavy": 0.385, "liberate": 0.0, "other": 0.615, "maxscore": 484.3},
            {"normal": 0.0, "skill": 0.0, "heavy": 0.385, "liberate": 0.0, "other": 0.615, "maxscore": 468.2},
            {"normal": 0.0, "skill": 0.0, "heavy": 0.31, "liberate": 0.0, "other": 0.69, "maxscore": 466.2},
            {"normal": 0.0, "skill": 0.0, "heavy": 0.31, "liberate": 0.0, "other": 0.69, "maxscore": 466},
            {"normal": 0.0, "skill": 0.0, "heavy": 0.33, "liberate": 0.0, "other": 0.67, "maxscore": 466.4},
            {"normal": 0.0, "skill": 0.0, "heavy": 0.365, "liberate": 0.0, "other": 0.635, "maxscore": 448.6},
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.81,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 0.9,
                "attack02": 0.09,
                "crit": 1.8,
                "critDamage": 0.81,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 0.9,
                "attack02": 0.09,
                "crit": 1.8,
                "critDamage": 0.81,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.9,
                "attack02": 0.09,
                "crit": 1.8,
                "critDamage": 0.81,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 0.95,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.9,
                "attack02": 0.09,
                "crit": 1.8,
                "critDamage": 0.81,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 0.95,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.9,
                "attack02": 0.09,
                "crit": 1.8,
                "critDamage": 0.81,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0.0,
                "unike": 0.95,
                "treat": 0
            }
        ]
    },
    {
        "id": 44,
        "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "58%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.0, "skill": 0.0, "heavy": 0.56, "liberate": 0.0, "other": 0.44, "maxscore": 492.8},
            {"normal": 0.0, "skill": 0.0, "heavy": 0.56, "liberate": 0.0, "other": 0.44, "maxscore": 489.8},
            {"normal": 0.0, "skill": 0.0, "heavy": 0.66, "liberate": 0.0, "other": 0.34, "maxscore": 477.2},
            {"normal": 0.0, "skill": 0.0, "heavy": 0.66, "liberate": 0.0, "other": 0.34, "maxscore": 468.6},
            {"normal": 0.0, "skill": 0.0, "heavy": 0.66, "liberate": 0.0, "other": 0.34, "maxscore": 468.6},
            {"normal": 0.0, "skill": 0.0, "heavy": 0.56, "liberate": 0.0, "other": 0.44, "maxscore": 447.7},
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.68,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.68,
                "critDamage": 0.9,
                "property": 0.95,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.68,
                "critDamage": 0.9,
                "property": 0.95,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.94,
                "attack02": 0.094,
                "crit": 1.68,
                "critDamage": 0.9,
                "property": 0.95,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.94,
                "attack02": 0.094,
                "crit": 1.68,
                "critDamage": 0.9,
                "property": 0.95,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.94,
                "attack02": 0.094,
                "crit": 1.68,
                "critDamage": 0.8,
                "property": 0.95,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
        ]
    },
    {
        "id": 45,
        "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "58%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        "mzProperty": [
            {"normal": 0.075, "skill": 0.042, "heavy": 0.0, "liberate": 0.75, "other": 0.023, "maxscore": 501.7},
            {"normal": 0.075, "skill": 0.042, "heavy": 0.0, "liberate": 0.75, "other": 0.023, "maxscore": 501.7},
            {"normal": 0.067, "skill": 0.037, "heavy": 0.0, "liberate": 0.776, "other": 0.02, "maxscore": 503.2},
            {"normal": 0.067, "skill": 0.037, "heavy": 0.0, "liberate": 0.776, "other": 0.02, "maxscore": 503.2},
            {"normal": 0.067, "skill": 0.037, "heavy": 0.0, "liberate": 0.776, "other": 0.02, "maxscore": 501.7},
            {"normal": 0.067, "skill": 0.037, "heavy": 0.0, "liberate": 0.776, "other": 0.02, "maxscore": 501.7},
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 0.94,
                "attack02": 0.094,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 0.94,
                "attack02": 0.094,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 0.94,
                "attack02": 0.094,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.94,
                "attack02": 0.094,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.94,
                "attack02": 0.094,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 0.97,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.94,
                "attack02": 0.094,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 0.97,
                "treat": 0
            },
        ]
    },
    {
        "id": 46, "propertyList": [
            {"name": "暴击", "property": "0%"},
            {"name": "暴伤", "property": "0%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "300"},
            {"name": "共鸣效率", "property": "62%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "58%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "73.5%"},
            {"name": "小防御", "property": "0"}
        ]
    },
    {
        "id": 47,
        "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "58%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        mzProperty: [
            {"normal": 0.42, "skill": 0.05, "heavy": 0, "liberate": 0.15, "other": 0.38, "maxscore": 491},
            {"normal": 0.42, "skill": 0.05, "heavy": 0, "liberate": 0.15, "other": 0.38, "maxscore": 491},
            {"normal": 0.63, "skill": 0.03, "heavy": 0, "liberate": 0.1, "other": 0.24, "maxscore": 503.3},
            {"normal": 0.63, "skill": 0.03, "heavy": 0, "liberate": 0.1, "other": 0.24, "maxscore": 496.2},
            {"normal": 0.59, "skill": 0.03, "heavy": 0, "liberate": 0.15, "other": 0.23, "maxscore": 493.7},
            {"normal": 0.7, "skill": 0.02, "heavy": 0, "liberate": 0.11, "other": 0.17, "maxscore": 500.2},
        ],
        mzRule: [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.95,
                "attack02": 0.095,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.95,
                "attack02": 0.095,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.95,
                "attack02": 0.095,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
        ]
    },
    {
        "id": 48, "propertyList": [
            {"name": "暴击", "property": "0%"},
            {"name": "暴伤", "property": "25%"},
            {"name": "大攻击", "property": "0%"},
            {"name": "小攻击", "property": "0"},
            {"name": "共鸣效率", "property": "62%"},
            {"name": "普攻伤害", "property": "0%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "25%"},
            {"name": "解放伤害", "property": "25%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "73.5%"},
            {"name": "小防御", "property": "350"}
        ],
        //莫宁的共鸣链不改变其防御治疗定位；C5/C6才显著提高共鸣解放与响应伤害，因此只在对应命座提高解放权重。
        mzProperty: [
            {"normal": 0.05, "skill": 0.25, "heavy": 0.25, "liberate": 0.40, "other": 0.05, "maxscore": 486.5},
            {"normal": 0.05, "skill": 0.25, "heavy": 0.23, "liberate": 0.42, "other": 0.05, "maxscore": 480.8},
            {"normal": 0.05, "skill": 0.28, "heavy": 0.22, "liberate": 0.40, "other": 0.05, "maxscore": 476.2},
            {"normal": 0.05, "skill": 0.25, "heavy": 0.20, "liberate": 0.45, "other": 0.05, "maxscore": 470.5},
            {"normal": 0.04, "skill": 0.20, "heavy": 0.16, "liberate": 0.55, "other": 0.05, "maxscore": 466.8},
            {"normal": 0.03, "skill": 0.15, "heavy": 0.12, "liberate": 0.65, "other": 0.05, "maxscore": 459.6}
        ],
        mzRule: [
            {
                "ruleId": 1,
                "attack01": 0,
                "attack02": 0,
                "crit": 0,
                "critDamage": 0,
                "property": 0.1,
                "health01": 0.9,
                "health02": 0.009,
                "defense01": 1.4,
                "defense02": 0.1,
                "defenseLimit": 160,
                "efficiency01": 1.4,
                "efficiency02": 0.7,
                "unike": 0.1,
                "treat": 2
            },
            {
                "ruleId": 2,
                "attack01": 0,
                "attack02": 0,
                "crit": 0,
                "critDamage": 0,
                "property": 0.1,
                "health01": 0.88,
                "health02": 0.0088,
                "defense01": 1.34,
                "defense02": 0.096,
                "defenseLimit": 145,
                "efficiency01": 1.3,
                "efficiency02": 0.65,
                "unike": 0.1,
                "treat": 1.95
            },
            {
                "ruleId": 3,
                "attack01": 0,
                "attack02": 0,
                "crit": 0,
                "critDamage": 0,
                "property": 0.1,
                "health01": 0.86,
                "health02": 0.0086,
                "defense01": 1.28,
                "defense02": 0.092,
                "defenseLimit": 135,
                "efficiency01": 1.2,
                "efficiency02": 0.6,
                "unike": 0.1,
                "treat": 1.9
            },
            {
                "ruleId": 4,
                "attack01": 0,
                "attack02": 0,
                "crit": 0,
                "critDamage": 0,
                "property": 0.1,
                "health01": 0.84,
                "health02": 0.0084,
                "defense01": 1.22,
                "defense02": 0.088,
                "defenseLimit": 125,
                "efficiency01": 1.1,
                "efficiency02": 0.55,
                "unike": 0.1,
                "treat": 1.85
            },
            {
                "ruleId": 5,
                "attack01": 0,
                "attack02": 0,
                "crit": 0,
                "critDamage": 0,
                "property": 0.1,
                "health01": 0.82,
                "health02": 0.0082,
                "defense01": 1.16,
                "defense02": 0.084,
                "defenseLimit": 115,
                "efficiency01": 1.0,
                "efficiency02": 0.5,
                "unike": 0.1,
                "treat": 1.8
            },
            {
                "ruleId": 6,
                "attack01": 0,
                "attack02": 0,
                "crit": 0,
                "critDamage": 0,
                "property": 0.1,
                "health01": 0.8,
                "health02": 0.008,
                "defense01": 1.1,
                "defense02": 0.08,
                "defenseLimit": 105,
                "efficiency01": 0.9,
                "efficiency02": 0.45,
                "unike": 0.1,
                "treat": 1.75
            },
        ]
    },
    {
        "id": 49,
        "propertyList": [
            {
                "name": "暴击",
                "property": "52.5%"
            },
            {
                "name": "暴伤",
                "property": "105%"
            },
            {
                "name": "大攻击",
                "property": "58%"
            },
            {
                "name": "小攻击",
                "property": "300"
            },
            {
                "name": "共鸣效率",
                "property": "0%"
            },
            {
                "name": "普攻伤害",
                "property": "0%"
            },
            {
                "name": "技能伤害",
                "property": "0%"
            },
            {
                "name": "重击伤害",
                "property": "0%"
            },
            {
                "name": "解放伤害",
                "property": "58%"
            },
            {
                "name": "大生命",
                "property": "0%"
            },
            {
                "name": "小生命",
                "property": "0"
            },
            {
                "name": "大防御",
                "property": "0%"
            },
            {
                "name": "小防御",
                "property": "0"
            }
        ],
        "mzProperty": [
            {
                "normal": 0.069714,
                "skill": 0.017429,
                "heavy": 0,
                "liberate": 0.738571,
                "other": 0.174286,
                "anomalyShare": 0.130714,
                "maxscore": 500.3848
            },
            {
                "normal": 0.053243,
                "skill": 0.013311,
                "heavy": 0,
                "liberate": 0.730457,
                "other": 0.202989,
                "anomalyShare": 0.169713,
                "maxscore": 479.4273
            },
            {
                "normal": 0.045133,
                "skill": 0.011283,
                "heavy": 0,
                "liberate": 0.771514,
                "other": 0.17207,
                "anomalyShare": 0.143861,
                "maxscore": 495.4457
            },
            {
                "normal": 0.045731,
                "skill": 0.011433,
                "heavy": 0,
                "liberate": 0.781738,
                "other": 0.161098,
                "anomalyShare": 0.132516,
                "maxscore": 496.4444
            },
            {
                "normal": 0.045731,
                "skill": 0.011433,
                "heavy": 0,
                "liberate": 0.781738,
                "other": 0.161098,
                "anomalyShare": 0.132516,
                "maxscore": 496.4444
            },
            {
                "normal": 0.027356,
                "skill": 0.006839,
                "heavy": 0,
                "liberate": 0.654686,
                "other": 0.311119,
                "anomalyShare": 0.294022,
                "maxscore": 405.0869
            }
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1.022689,
                "attack02": 0.102269,
                "crit": 2.029916,
                "critDamage": 0.784286,
                "property": 1.022689,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 0.976809,
                "attack02": 0.097681,
                "crit": 1.902659,
                "critDamage": 0.775157,
                "property": 0.976809,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1.007222,
                "attack02": 0.100722,
                "crit": 1.935407,
                "critDamage": 0.818367,
                "property": 1.007222,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 1.020569,
                "attack02": 0.102057,
                "crit": 1.961054,
                "critDamage": 0.829211,
                "property": 0.92779,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 1.020569,
                "attack02": 0.102057,
                "crit": 1.961054,
                "critDamage": 0.829211,
                "property": 0.92779,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.830563,
                "attack02": 0.083056,
                "crit": 1.598884,
                "critDamage": 0.672719,
                "property": 0.755057,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            }
        ],
        "modeProfiles": {
            "fusion": [
                {
                    "weights": {
                        "normal": 0.072727,
                        "skill": 0.018182,
                        "heavy": 0,
                        "liberate": 0.636364,
                        "other": 0.272727,
                        "anomalyShare": 0.227273,
                        "maxscore": 443.8182
                    },
                    "rule": {
                        "ruleId": 0,
                        "attack01": 0.909091,
                        "attack02": 0.090909,
                        "crit": 1.636364,
                        "critDamage": 0.818182,
                        "property": 0.909091,
                        "health01": 0,
                        "health02": 0,
                        "defense01": 0,
                        "defense02": 0,
                        "defenseLimit": 40,
                        "efficiency01": 0.5,
                        "efficiency02": 0,
                        "unike": 1,
                        "treat": 0
                    }
                },
                {
                    "weights": {
                        "normal": 0.064126,
                        "skill": 0.016032,
                        "heavy": 0,
                        "liberate": 0.679369,
                        "other": 0.240473,
                        "anomalyShare": 0.200394,
                        "maxscore": 460.275
                    },
                    "rule": {
                        "ruleId": 1,
                        "attack01": 0.940713,
                        "attack02": 0.094071,
                        "crit": 1.867203,
                        "critDamage": 0.721419,
                        "property": 0.940713,
                        "health01": 0,
                        "health02": 0,
                        "defense01": 0,
                        "defense02": 0,
                        "defenseLimit": 40,
                        "efficiency01": 0.5,
                        "efficiency02": 0,
                        "unike": 1,
                        "treat": 0
                    }
                },
                {
                    "weights": {
                        "normal": 0.04868,
                        "skill": 0.01217,
                        "heavy": 0,
                        "liberate": 0.667858,
                        "other": 0.271292,
                        "anomalyShare": 0.240866,
                        "maxscore": 438.3416
                    },
                    "rule": {
                        "ruleId": 2,
                        "attack01": 0.893099,
                        "attack02": 0.08931,
                        "crit": 1.739606,
                        "critDamage": 0.708728,
                        "property": 0.893099,
                        "health01": 0,
                        "health02": 0,
                        "defense01": 0,
                        "defense02": 0,
                        "defenseLimit": 40,
                        "efficiency01": 0.5,
                        "efficiency02": 0,
                        "unike": 1,
                        "treat": 0
                    }
                },
                {
                    "weights": {
                        "normal": 0.041811,
                        "skill": 0.010453,
                        "heavy": 0,
                        "liberate": 0.714727,
                        "other": 0.233009,
                        "anomalyShare": 0.206877,
                        "maxscore": 458.9789
                    },
                    "rule": {
                        "ruleId": 3,
                        "attack01": 0.933086,
                        "attack02": 0.093309,
                        "crit": 1.792952,
                        "critDamage": 0.758131,
                        "property": 0.933086,
                        "health01": 0,
                        "health02": 0,
                        "defense01": 0,
                        "defense02": 0,
                        "defenseLimit": 40,
                        "efficiency01": 0.5,
                        "efficiency02": 0,
                        "unike": 1,
                        "treat": 0
                    }
                },
                {
                    "weights": {
                        "normal": 0.042612,
                        "skill": 0.010653,
                        "heavy": 0,
                        "liberate": 0.728427,
                        "other": 0.218308,
                        "anomalyShare": 0.191675,
                        "maxscore": 462.5889
                    },
                    "rule": {
                        "ruleId": 4,
                        "attack01": 0.950971,
                        "attack02": 0.095097,
                        "crit": 1.827318,
                        "critDamage": 0.772662,
                        "property": 0.864519,
                        "health01": 0,
                        "health02": 0,
                        "defense01": 0,
                        "defense02": 0,
                        "defenseLimit": 40,
                        "efficiency01": 0.5,
                        "efficiency02": 0,
                        "unike": 1,
                        "treat": 0
                    }
                },
                {
                    "weights": {
                        "normal": 0.042612,
                        "skill": 0.010653,
                        "heavy": 0,
                        "liberate": 0.728427,
                        "other": 0.218308,
                        "anomalyShare": 0.191675,
                        "maxscore": 462.5889
                    },
                    "rule": {
                        "ruleId": 5,
                        "attack01": 0.950971,
                        "attack02": 0.095097,
                        "crit": 1.827318,
                        "critDamage": 0.772662,
                        "property": 0.864519,
                        "health01": 0,
                        "health02": 0,
                        "defense01": 0,
                        "defense02": 0,
                        "defenseLimit": 40,
                        "efficiency01": 0.5,
                        "efficiency02": 0,
                        "unike": 1,
                        "treat": 0
                    }
                },
                {
                    "weights": {
                        "normal": 0.023972,
                        "skill": 0.005993,
                        "heavy": 0,
                        "liberate": 0.573687,
                        "other": 0.396348,
                        "anomalyShare": 0.381366,
                        "maxscore": 354.969
                    },
                    "rule": {
                        "ruleId": 6,
                        "attack01": 0.727805,
                        "attack02": 0.07278,
                        "crit": 1.401069,
                        "critDamage": 0.589489,
                        "property": 0.661641,
                        "health01": 0,
                        "health02": 0,
                        "defense01": 0,
                        "defense02": 0,
                        "defenseLimit": 40,
                        "efficiency01": 0.5,
                        "efficiency02": 0,
                        "unike": 1,
                        "treat": 0
                    }
                }
            ]
        }
    },
    {
        "id": 50, "propertyList": [
            {"name": "暴击", "property": "52.5%"},
            {"name": "暴伤", "property": "105%"},
            {"name": "大攻击", "property": "58%"},
            {"name": "小攻击", "property": "120"},
            {"name": "共鸣效率", "property": "37.2%"},
            {"name": "普攻伤害", "property": "58%"},
            {"name": "技能伤害", "property": "0%"},
            {"name": "重击伤害", "property": "0%"},
            {"name": "解放伤害", "property": "0%"},
            {"name": "大生命", "property": "0%"},
            {"name": "小生命", "property": "0"},
            {"name": "大防御", "property": "0%"},
            {"name": "小防御", "property": "0"}
        ],
        //陆·赫斯的共鸣链主要强化空中攻击、共鸣技能与集谐响应；这些伤害在官方资料中均归入普攻伤害。
        mzProperty: [
            {"normal": 0.82, "skill": 0.04, "heavy": 0.02, "liberate": 0.07, "other": 0.05, "maxscore": 494.6},
            {"normal": 0.84, "skill": 0.03, "heavy": 0.02, "liberate": 0.06, "other": 0.05, "maxscore": 491.8},
            {"normal": 0.86, "skill": 0.03, "heavy": 0.02, "liberate": 0.04, "other": 0.05, "maxscore": 489.2},
            {"normal": 0.88, "skill": 0.02, "heavy": 0.01, "liberate": 0.04, "other": 0.05, "maxscore": 485.5},
            {"normal": 0.90, "skill": 0.02, "heavy": 0.01, "liberate": 0.02, "other": 0.05, "maxscore": 482.8},
            {"normal": 0.92, "skill": 0.01, "heavy": 0.01, "liberate": 0.01, "other": 0.05, "maxscore": 479.6}
        ],
        mzRule: [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 0.98,
                "attack02": 0.098,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.98,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.98,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 0.96,
                "attack02": 0.096,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.96,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.96,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.94,
                "attack02": 0.094,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.94,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.94,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.92,
                "attack02": 0.092,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.92,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.92,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.90,
                "attack02": 0.09,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 0.90,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 0.90,
                "treat": 0
            },
        ]
    },
    {
        "id": 51,
        "propertyList": [
            {
                "name": "暴击",
                "property": "52.5%"
            },
            {
                "name": "暴伤",
                "property": "105%"
            },
            {
                "name": "大攻击",
                "property": "58%"
            },
            {
                "name": "小攻击",
                "property": "300"
            },
            {
                "name": "共鸣效率",
                "property": "37.2%"
            },
            {
                "name": "普攻伤害",
                "property": "23.2%"
            },
            {
                "name": "技能伤害",
                "property": "0%"
            },
            {
                "name": "重击伤害",
                "property": "0%"
            },
            {
                "name": "解放伤害",
                "property": "0%"
            },
            {
                "name": "大生命",
                "property": "0%"
            },
            {
                "name": "小生命",
                "property": "0"
            },
            {
                "name": "大防御",
                "property": "0%"
            },
            {
                "name": "小防御",
                "property": "0"
            }
        ],
        "mzProperty": [
            {
                "normal": 0.044964,
                "skill": 0.008993,
                "heavy": 0,
                "liberate": 0,
                "other": 0.946043,
                "anomalyShare": 0,
                "echoSkillShare": 0.892086,
                "maxscore": 489.0101
            },
            {
                "normal": 0.032383,
                "skill": 0.006477,
                "heavy": 0,
                "liberate": 0,
                "other": 0.96114,
                "anomalyShare": 0,
                "echoSkillShare": 0.92228,
                "maxscore": 489.4549
            },
            {
                "normal": 0.025893,
                "skill": 0.005179,
                "heavy": 0,
                "liberate": 0,
                "other": 0.968928,
                "anomalyShare": 0,
                "echoSkillShare": 0.937856,
                "maxscore": 489.6844
            },
            {
                "normal": 0.025893,
                "skill": 0.005179,
                "heavy": 0,
                "liberate": 0,
                "other": 0.968928,
                "anomalyShare": 0,
                "echoSkillShare": 0.937856,
                "maxscore": 477.9069
            },
            {
                "normal": 0.025419,
                "skill": 0.005084,
                "heavy": 0,
                "liberate": 0,
                "other": 0.969497,
                "anomalyShare": 0,
                "echoSkillShare": 0.938993,
                "maxscore": 477.9236
            },
            {
                "normal": 0.018708,
                "skill": 0.003742,
                "heavy": 0,
                "liberate": 0,
                "other": 0.97755,
                "anomalyShare": 0,
                "echoSkillShare": 0.955102,
                "maxscore": 478.161
            }
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 50,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 50,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 50,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.925926,
                "attack02": 0.092593,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 50,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.925926,
                "attack02": 0.092593,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 50,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.925926,
                "attack02": 0.092593,
                "crit": 1.8,
                "critDamage": 0.9,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 50,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            }
        ]
    },
    {
        "id": 52,
        "propertyList": [
            {
                "name": "暴击",
                "property": "52.5%"
            },
            {
                "name": "暴伤",
                "property": "105%"
            },
            {
                "name": "大攻击",
                "property": "58%"
            },
            {
                "name": "小攻击",
                "property": "300"
            },
            {
                "name": "共鸣效率",
                "property": "0%"
            },
            {
                "name": "普攻伤害",
                "property": "0%"
            },
            {
                "name": "技能伤害",
                "property": "0%"
            },
            {
                "name": "重击伤害",
                "property": "0%"
            },
            {
                "name": "解放伤害",
                "property": "58%"
            },
            {
                "name": "大生命",
                "property": "0%"
            },
            {
                "name": "小生命",
                "property": "0"
            },
            {
                "name": "大防御",
                "property": "0%"
            },
            {
                "name": "小防御",
                "property": "0"
            }
        ],
        "mzProperty": [
            {
                "normal": 0.01684,
                "skill": 0.058941,
                "heavy": 0,
                "liberate": 0.833601,
                "other": 0.090618,
                "anomalyShare": 0.073777,
                "maxscore": 498.9762
            },
            {
                "normal": 0.013912,
                "skill": 0.048692,
                "heavy": 0,
                "liberate": 0.862537,
                "other": 0.074859,
                "anomalyShare": 0.060947,
                "maxscore": 506.8966
            },
            {
                "normal": 0.010908,
                "skill": 0.038179,
                "heavy": 0,
                "liberate": 0.815945,
                "other": 0.134968,
                "anomalyShare": 0.124059,
                "maxscore": 473.4892
            },
            {
                "normal": 0.011033,
                "skill": 0.038615,
                "heavy": 0,
                "liberate": 0.825252,
                "other": 0.1251,
                "anomalyShare": 0.114067,
                "maxscore": 473.6375
            },
            {
                "normal": 0.010702,
                "skill": 0.067424,
                "heavy": 0,
                "liberate": 0.800523,
                "other": 0.121351,
                "anomalyShare": 0.110649,
                "maxscore": 473.8463
            },
            {
                "normal": 0.009062,
                "skill": 0.057088,
                "heavy": 0,
                "liberate": 0.841964,
                "other": 0.091886,
                "anomalyShare": 0.082825,
                "maxscore": 489.2461
            }
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1.006764,
                "attack02": 0.100676,
                "crit": 1.812175,
                "critDamage": 0.906088,
                "property": 1.006764,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1.020709,
                "attack02": 0.102071,
                "crit": 1.837277,
                "critDamage": 0.918638,
                "property": 1.020709,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 0.95211,
                "attack02": 0.095211,
                "crit": 1.713798,
                "critDamage": 0.856899,
                "property": 0.95211,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 0.96297,
                "attack02": 0.096297,
                "crit": 1.733347,
                "critDamage": 0.866673,
                "property": 0.875428,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 0.966686,
                "attack02": 0.096669,
                "crit": 1.740034,
                "critDamage": 0.870017,
                "property": 0.878805,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.99693,
                "attack02": 0.099693,
                "crit": 2.136138,
                "critDamage": 0.651238,
                "property": 0.9063,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 0.5,
                "efficiency02": 0,
                "unike": 1,
                "treat": 0
            }
        ]
    },
    {
        "id": 53,
        "propertyList": [
            {
                "name": "暴击",
                "property": "52.5%"
            },
            {
                "name": "暴伤",
                "property": "105%"
            },
            {
                "name": "大攻击",
                "property": "58%"
            },
            {
                "name": "小攻击",
                "property": "120"
            },
            {
                "name": "共鸣效率",
                "property": "37.2%"
            },
            {
                "name": "普攻伤害",
                "property": "0%"
            },
            {
                "name": "技能伤害",
                "property": "0%"
            },
            {
                "name": "重击伤害",
                "property": "0%"
            },
            {
                "name": "解放伤害",
                "property": "58%"
            },
            {
                "name": "大生命",
                "property": "0%"
            },
            {
                "name": "小生命",
                "property": "0"
            },
            {
                "name": "大防御",
                "property": "0%"
            },
            {
                "name": "小防御",
                "property": "0"
            }
        ],
        "mzProperty": [
            {
                "normal": 0.05,
                "skill": 0.15,
                "heavy": 0,
                "liberate": 0.75,
                "other": 0.05,
                "anomalyShare": 0,
                "maxscore": 510.1768
            },
            {
                "normal": 0.04771,
                "skill": 0.188931,
                "heavy": 0,
                "liberate": 0.715649,
                "other": 0.04771,
                "anomalyShare": 0,
                "maxscore": 496.1845
            },
            {
                "normal": 0.014205,
                "skill": 0.119318,
                "heavy": 0,
                "liberate": 0.830966,
                "other": 0.035511,
                "anomalyShare": 0,
                "maxscore": 502.8729
            },
            {
                "normal": 0.013562,
                "skill": 0.113924,
                "heavy": 0,
                "liberate": 0.838608,
                "other": 0.033906,
                "anomalyShare": 0,
                "maxscore": 503.3161
            },
            {
                "normal": 0.012701,
                "skill": 0.106689,
                "heavy": 0,
                "liberate": 0.848857,
                "other": 0.031753,
                "anomalyShare": 0,
                "maxscore": 503.9106
            },
            {
                "normal": 0.012259,
                "skill": 0.102972,
                "heavy": 0,
                "liberate": 0.819282,
                "other": 0.065487,
                "anomalyShare": 0.034841,
                "maxscore": 452.3435
            }
        ],
        "mzRule": [
            {
                "ruleId": 1,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.91194,
                "critDamage": 0.819403,
                "property": 1,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 2,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.91194,
                "critDamage": 0.819403,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 3,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.91194,
                "critDamage": 0.819403,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 4,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.91194,
                "critDamage": 0.819403,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 5,
                "attack01": 1,
                "attack02": 0.1,
                "crit": 1.91194,
                "critDamage": 0.819403,
                "property": 0.8,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            },
            {
                "ruleId": 6,
                "attack01": 0.778354,
                "attack02": 0.077835,
                "crit": 1.845326,
                "critDamage": 0.790854,
                "property": 0.622683,
                "health01": 0,
                "health02": 0,
                "defense01": 0,
                "defense02": 0,
                "defenseLimit": 40,
                "efficiency01": 1,
                "efficiency02": 0.3,
                "unike": 1,
                "treat": 0
            }
        ],
        "modeProfiles": {
            "harmony": [
                {
                    "weights": {
                        "normal": 0.05,
                        "skill": 0.15,
                        "heavy": 0,
                        "liberate": 0.75,
                        "other": 0.05,
                        "anomalyShare": 0,
                        "maxscore": 510.3
                    },
                    "rule": {
                        "ruleId": 0,
                        "attack01": 1,
                        "attack02": 0.1,
                        "crit": 1.8,
                        "critDamage": 0.9,
                        "property": 1,
                        "health01": 0,
                        "health02": 0,
                        "defense01": 0,
                        "defense02": 0,
                        "defenseLimit": 40,
                        "efficiency01": 1,
                        "efficiency02": 0.3,
                        "unike": 1,
                        "treat": 0
                    }
                },
                {
                    "weights": {
                        "normal": 0.05,
                        "skill": 0.15,
                        "heavy": 0,
                        "liberate": 0.75,
                        "other": 0.05,
                        "anomalyShare": 0,
                        "maxscore": 510.1768
                    },
                    "rule": {
                        "ruleId": 1,
                        "attack01": 1,
                        "attack02": 0.1,
                        "crit": 1.91194,
                        "critDamage": 0.819403,
                        "property": 1,
                        "health01": 0,
                        "health02": 0,
                        "defense01": 0,
                        "defense02": 0,
                        "defenseLimit": 40,
                        "efficiency01": 1,
                        "efficiency02": 0.3,
                        "unike": 1,
                        "treat": 0
                    }
                },
                {
                    "weights": {
                        "normal": 0.04771,
                        "skill": 0.188931,
                        "heavy": 0,
                        "liberate": 0.715649,
                        "other": 0.04771,
                        "anomalyShare": 0,
                        "maxscore": 508.1845
                    },
                    "rule": {
                        "ruleId": 2,
                        "attack01": 1,
                        "attack02": 0.1,
                        "crit": 1.91194,
                        "critDamage": 0.819403,
                        "property": 1,
                        "health01": 0,
                        "health02": 0,
                        "defense01": 0,
                        "defense02": 0,
                        "defenseLimit": 40,
                        "efficiency01": 1,
                        "efficiency02": 0.3,
                        "unike": 1,
                        "treat": 0
                    }
                },
                {
                    "weights": {
                        "normal": 0.014205,
                        "skill": 0.119318,
                        "heavy": 0,
                        "liberate": 0.830966,
                        "other": 0.035511,
                        "anomalyShare": 0,
                        "maxscore": 514.8729
                    },
                    "rule": {
                        "ruleId": 3,
                        "attack01": 1,
                        "attack02": 0.1,
                        "crit": 1.91194,
                        "critDamage": 0.819403,
                        "property": 1,
                        "health01": 0,
                        "health02": 0,
                        "defense01": 0,
                        "defense02": 0,
                        "defenseLimit": 40,
                        "efficiency01": 1,
                        "efficiency02": 0.3,
                        "unike": 1,
                        "treat": 0
                    }
                },
                {
                    "weights": {
                        "normal": 0.013562,
                        "skill": 0.113924,
                        "heavy": 0,
                        "liberate": 0.838608,
                        "other": 0.033906,
                        "anomalyShare": 0,
                        "maxscore": 515.3161
                    },
                    "rule": {
                        "ruleId": 4,
                        "attack01": 1,
                        "attack02": 0.1,
                        "crit": 1.91194,
                        "critDamage": 0.819403,
                        "property": 1,
                        "health01": 0,
                        "health02": 0,
                        "defense01": 0,
                        "defense02": 0,
                        "defenseLimit": 40,
                        "efficiency01": 1,
                        "efficiency02": 0.3,
                        "unike": 1,
                        "treat": 0
                    }
                },
                {
                    "weights": {
                        "normal": 0.012701,
                        "skill": 0.106689,
                        "heavy": 0,
                        "liberate": 0.848857,
                        "other": 0.031753,
                        "anomalyShare": 0,
                        "maxscore": 515.9106
                    },
                    "rule": {
                        "ruleId": 5,
                        "attack01": 1,
                        "attack02": 0.1,
                        "crit": 1.91194,
                        "critDamage": 0.819403,
                        "property": 1,
                        "health01": 0,
                        "health02": 0,
                        "defense01": 0,
                        "defense02": 0,
                        "defenseLimit": 40,
                        "efficiency01": 1,
                        "efficiency02": 0.3,
                        "unike": 1,
                        "treat": 0
                    }
                },
                {
                    "weights": {
                        "normal": 0.012701,
                        "skill": 0.106689,
                        "heavy": 0,
                        "liberate": 0.848857,
                        "other": 0.031753,
                        "anomalyShare": 0,
                        "maxscore": 474.774
                    },
                    "rule": {
                        "ruleId": 6,
                        "attack01": 0.806452,
                        "attack02": 0.080645,
                        "crit": 1.91194,
                        "critDamage": 0.819403,
                        "property": 0.769231,
                        "health01": 0,
                        "health02": 0,
                        "defense01": 0,
                        "defense02": 0,
                        "defenseLimit": 40,
                        "efficiency01": 1,
                        "efficiency02": 0.3,
                        "unike": 1,
                        "treat": 0
                    }
                }
            ]
        }
    }
]
// BEGIN GENERATED NEW CHARACTER MODELS
// Generated by scripts/sync-new-character-model.cjs; edit the source model.
const newCharacterModels = (function createNewCharacterModels() {
    const ids = [57, 58, 59, 60, 61, 62, 63];
    const types = ['normal', 'skill', 'heavy', 'liberate', 'other'];
    const elements = ['导电', '衍射', '湮灭', '气动', '热熔', '冷凝'];
    const primary = {57:'导电',58:'导电',59:'湮灭',60:'冷凝',61:'气动',62:'热熔',63:'导电'};
    const settings = {
        57: {label:'输出循环', modes:[['quick','短按超负荷·速切'],['critical','长按超负荷·临界共鸣']]},
        58: {label:'输出循环', modes:[['quick','短按超负荷·速切'],['critical','长按超负荷·临界共鸣']]},
        59: {modes:[['cycle','苍／羽完整循环']]},
        60: {label:'评分用途', modes:[['support','治疗辅助'],['damage','自身输出']]},
        61: {label:'循环情景', modes:[['sustained','持续循环'],['opening','首轮爆发']]},
        62: {label:'循环情景', modes:[['sustained','持续循环'],['opening','首轮爆发']]},
        63: {label:'共鸣模态', modes:[['unison','同奏'],['electro','电磁']]}
    };
    const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
    const round = n => Number(n.toFixed(6));
    function modeFor(role) {
        const modes = settings[Number(role.roleListId)].modes;
        return modes.some(m => m[0] === role.damageMode) ? role.damageMode : modes[0][0];
    }
    function packets(role) {
        const id = Number(role.roleListId), c = clamp(parseInt(role.ming)||0,0,6), mode = modeFor(role);
        const parts = [];
        let attack = 2500, bonus = 2, cd = 2.8, crit = .8;
        const add = (type, budget, extra = {}) => parts.push({type,budget,attack,bonus,cd,crit,element:primary[id],...extra});
        if (id === 57 || id === 58) {
            add('normal',mode === 'quick' ? 12 : 6);
            add('skill',mode === 'quick' ? 8 : 4);
            add('skill',32*(c>=3?1.2:1),{tag:'overload'});
            add('liberate',18*(c>=4?1.2:1));
            add('other',5);
            add('other',5*(c>=2?1.5:1),{fixed:true,tag:'electro'});
            if (mode === 'critical') {
                // One ground chain: all multi-element packets retain SKILL damage classification.
                for (const [element,budget] of [['衍射',12],['湮灭',12],['气动',16],['导电',15]]) {
                    add('skill',budget*(c>=6?1.2:1),{element,bonus:bonus+.2,cd:cd+(c>=5?.2:0),tag:'critical'});
                }
            }
        } else if (id === 59) {
            if (c>=4) attack += 200;
            const heavy = c>=6 ? 1.4 : 1;
            add('normal',8);
            add('skill',2);
            add('heavy',10*heavy,{tag:'switch'});
            // Both swords in one rotation; +160% stance CD and assumed full +150% feather oath.
            add('heavy',55*(c>=2?2:1)*heavy,{cd:cd+3.1,tag:'stance'});
            add('liberate',18*(c>=3?2.75:1));
            add('other',5);
            add('other',2*(c>=3?1.5:1),{fixed:true});
            if(c>=1) add('heavy',2*337.98/60*heavy,{tag:'c1'});
            if(c>=6) add('heavy',5*337.98/60*heavy,{crit:1,guaranteed:true,tag:'c6'});
        } else if (id === 60) {
            if(c>=2) cd += .5;
            add('normal',c>=3?6:12);
            add('normal',10*(c>=5?2:1));
            add('heavy',5*(c>=5?2:1));
            add('skill',8);
            // Intro directly enters the rain stance; do not also invent an awakening in this rotation.
            // Shared passive once per 25s: +80% CR is capped, +240% elemental bonus.
            add('other',55,{health:true,crit:1,guaranteed:true,cd:cd+(c>=6?5:0),bonus:bonus+2.4,tag:'intro'});
            add('other',5);
            add('other',5,{fixed:true});
        } else if (id === 61) {
            if(c>=1) crit = .96;
            if(c>=4) attack += 200;
            const stacks = c>=2?25:15;
            const lock = 1 + stacks*.02 + .35;
            const final = c>=6?1.4:1;
            add('normal',6);
            add('normal',24,{multiplier:lock*lock});
            add('heavy',10*(c>=2?1.4:1)*final,{multiplier:lock*lock});
            add('heavy',30*(c>=3?1+stacks*.03:1)*final,{multiplier:lock*lock});
            add('skill',8*(c>=5?2:1));
            add('liberate',17*final,{cd:cd+(c>=3?1:0),multiplier:lock*lock});
            add('other',5);
            // C1 stacks are consumed together; only C6 replenishes them in sustained rotations.
            if(c>=1 && (mode==='opening'||c>=6)) add('normal',400/60*(1+25*.04)*final,{multiplier:c>=6?lock*lock:1,tag:'greatsword'});
            // Harmony is a common final multiplier, so cancels from echo stat proportions.
        } else if (id === 62) {
            const hp = clamp(Number(role.referenceHealth)||40000,15000,70000);
            const capped = Math.min(hp,50000);
            attack += capped*(c>=3?.05:.036);
            bonus += capped*.000015 + (c>=4?.2:0);
            const heavy = c>=6?1.4:1;
            const fire = 1+clamp(hp-25000,0,25000)*.00009;
            add('normal',3);
            add('heavy',10*heavy);
            add('skill',12*(c>=1?1.8:1));
            add('heavy',40*fire*(c>=2?1.46:1)*(mode==='opening'&&c>=2?1.45:1)*heavy,{tag:'lifeFire'});
            add('heavy',18*heavy); // Liberation explicitly deals heavy damage.
            add('heavy',12*(c>=6?1.8*3:1)*heavy,{tag:'ghosts'}); // Four regular + eight C6 summons.
            add('other',5);
        } else if (id === 63) {
            if(mode==='unison') attack += 500;
            else bonus += .5; // Two passive stacks, no unselected teammate/weapon buffs.
            if(c>=4) bonus += .2;
            const skill = c>=6?1.4*(2/1.8):1;
            const unisonStacks = c>=6?4:3;
            add('normal',mode==='unison'?12:17);
            add('skill',10*skill);
            add('skill',34*(c>=2?1.6:1)*skill,{tag:'heavyConverted'});
            add('skill',25*(c>=3?1.7:1)*skill,{cd:cd+(mode==='unison'&&c>=3?.2+.15*unisonStacks:0),tag:'liberationConverted'});
            add('liberate',6,{tag:'coordinated'});
            add('other',(mode==='unison'?13:8)*(mode==='unison'&&c>=1?1.15+.1*unisonStacks:1),{tag:'intro'});
            if(mode==='electro') {
                const fixedCrit = c>=6?1+.8*(2.3-1):1;
                // 50 Thunderheart stacks assumed: C0 17.5 times, C1 21 times, C3 +15 times.
                add('other',20*((c>=1?21:17.5)+(c>=3?15:0))/17.5*fixedCrit,{fixed:true,tag:'electro'});
            }
        }
        return parts.map(p=>({...p,damage:p.fixed?p.budget:p.budget*(p.health?1:p.attack/2500)*(p.bonus/2)*(1+p.crit*(p.cd-1))/2.44*(p.multiplier||1)}));
    }
    function reference(role) {
        const id=Number(role.roleListId), support=id===60&&modeFor(role)==='support';
        const names=['暴击','暴伤','大攻击','小攻击','共鸣效率','普攻伤害','技能伤害','重击伤害','解放伤害','大生命','小生命','大防御','小防御'];
        let values=[52.5,105,58,120,37.2,0,0,0,0,0,0,0,0];
        if(id===57||id===58||id===63) values[6]=46.4;
        if(id===59||id===61) values[7]=46.4;
        if(id===62) values=[52.5,105,23.2,0,37.2,0,0,23.2,0,58,1740,0,0];
        if(id===60) values=support?[0,0,0,0,62,0,0,0,0,58,2900,0,0]:[52.5,105,0,0,37.2,0,23.2,0,0,58,1040,0,0];
        return names.map((name,i)=>({name,property:String(values[i])+([3,10,12].includes(i)?'':'%')}));
    }
    function profile(role) {
        const id=Number(role.roleListId), parts=packets(role), total=parts.reduce((s,p)=>s+p.damage,0);
        const weighted=f=>parts.reduce((s,p)=>s+(p.fixed?0:p.damage*f(p)),0)/total;
        const weights=Object.fromEntries(types.map(t=>[t,round(parts.filter(p=>p.type===t).reduce((s,p)=>s+p.damage,0)/total)]));
        weights.other=round(1-types.slice(0,4).reduce((s,t)=>s+weights[t],0));
        weights.anomalyShare=round(parts.filter(p=>p.fixed).reduce((s,p)=>s+p.damage,0)/total);
        const rule={ruleId:clamp(parseInt(role.ming)||0,0,6),attack01:2500*weighted(p=>p.health?0:1/p.attack),attack02:250*weighted(p=>p.health?0:1/p.attack),
            crit:2.5*weighted(p=>p.guaranteed?0:(p.cd-1)/(1+p.crit*(p.cd-1))),critDamage:2.5*weighted(p=>p.crit/(1+p.crit*(p.cd-1))),
            property:2.5*weighted(p=>1/p.bonus),health01:0,health02:0,defense01:0,defense02:0,defenseLimit:40,efficiency01:.5,efficiency02:0,unike:1.25,treat:0};
        // Named elements keep mixed-element Rover bonuses separate; legacy 属伤 means primary element.
        rule.elements=Object.fromEntries(elements.map(e=>[e,2.5*weighted(p=>p.element===e?1/p.bonus:0)]));
        rule.property=rule.elements[primary[id]];
        if(id===60) {
            // HP 35k / base HP 16,712 reference. Support score measures healing/energy, not team DPS.
            rule.health01=250*167.12/35000*weighted(p=>p.health?1:0);
            rule.health02=rule.health01/167.12;
            if(modeFor(role)==='support') Object.assign(rule,{attack01:0,attack02:0,crit:0,critDamage:0,property:0,health01:1,health02:1/167.12,unike:0,treat:1.2,defenseLimit:100,efficiency01:1.2,elements:{}});
        }
        if(id===62) {
            const hp=clamp(Number(role.referenceHealth)||40000,15000,70000);
            // Forward marginal derivative includes HP->ATK, elemental bonus and life-fire multiplier.
            const next=packets({...role,referenceHealth:hp+1}).reduce((s,p)=>s+p.damage,0);
            rule.health02=hp>=50000?0:250*(next-total)/total;
            rule.health01=rule.health02*153.75;
        }
        for(const key of Object.keys(rule)) if(typeof rule[key]==='number') rule[key]=round(rule[key]);
        for(const e of Object.keys(rule.elements)) rule.elements[e]=round(rule.elements[e]);
        // Per-type sensitivity matters for packets with innate bonus, fixed damage or HP scaling.
        rule.typeCoefficients=Object.fromEntries(types.slice(0,4).map(t=>[t,round(id===60&&modeFor(role)==='support'?0:2.5*weighted(p=>p.type===t?1/p.bonus:0))]));
        const coefficients={'暴击':rule.crit,'暴伤':rule.critDamage,'大攻击':rule.attack01,'小攻击':rule.attack02,'共鸣效率':rule.efficiency01,
            '普攻伤害':rule.typeCoefficients.normal,'技能伤害':rule.typeCoefficients.skill,'重击伤害':rule.typeCoefficients.heavy,'解放伤害':rule.typeCoefficients.liberate,'大生命':rule.health01,'小生命':rule.health02};
        const ref=reference(role);
        let main=22*rule.crit+60*rule.property+36*rule.attack01+350*rule.attack02+4560*rule.health02;
        if(id===62||id===60) main=22*rule.crit+60*rule.property+45.6*rule.health01+350*rule.attack02+4560*rule.health02;
        if(id===60&&modeFor(role)==='support') main=26.4*rule.treat+64*rule.efficiency01+45.6*rule.health01+4560*rule.health02;
        const er=Number.parseFloat(ref[4].property)+(id===60&&modeFor(role)==='support'?64:0);
        weights.maxscore=round(main+ref.reduce((s,p)=>s+parseFloat(p.property)*(coefficients[p.name]||0),0)-(rule.efficiency01-rule.efficiency02)*Math.max(0,er-rule.defenseLimit));
        return {weights,rule,reference:ref};
    }
    function install(roles, refs) {
        for(const id of ids) {
            const modeProfiles={};
            for(const [mode] of settings[id].modes) modeProfiles[mode]=Array.from({length:7},(_,ming)=>profile({roleListId:id,ming,damageMode:mode}));
            const profiles=modeProfiles[settings[id].modes[0][0]];
            Object.assign(roles[id-1],profiles[0].weights);
            refs[id-1]={id,propertyList:profiles[0].reference,mzProperty:profiles.slice(1).map(p=>p.weights),mzRule:profiles.slice(1).map(p=>p.rule),modeProfiles};
        }
    }
    return {ids,settings,modeFor,packets,profile,reference,install};
})();
newCharacterModels.install(roleList, RoleSumProperty);
// END GENERATED NEW CHARACTER MODELS
//计算角色声骸超越人数百分比的分母
const MaxScore = 85;

//传入角色命座+专武+声骸分数=返回角色评价
function callbackEval(mz, zw, sh) {
    let zsc = 15 * mz;
    zsc = parseInt(zsc) + 5 * zw;
    if (zw != 0) {
        zsc = parseInt(zsc) + 15;
    }
    zsc = parseFloat(zsc) + parseFloat(sh);
    zsc = zsc.toFixed(2);
    zsc = zsc / 2.15;
    zsc = Math.round(zsc);
    let ds = Math.floor(zsc / 9);//段数
    let xs = zsc % 9;//星数
    if (xs == 0) {
        xs = 9;
        ds = ds - 1;
    }
    if (ds === 0) {
        return "斗之气" + numToChinese(xs) + "段";
    } else if (ds === 1) {
        return numToChinese(xs) + "星斗者";
    } else if (ds === 2) {
        return numToChinese(xs) + "星斗师";
    } else if (ds === 3) {
        return numToChinese(xs) + "星大斗师";
    } else if (ds === 4) {
        return numToChinese(xs) + "星斗灵";
    } else if (ds === 5) {
        return numToChinese(xs) + "星斗王";
    } else if (ds === 6) {
        return numToChinese(xs) + "星斗皇";
    } else if (ds === 7) {
        return numToChinese(xs) + "星斗宗";
    } else if (ds === 8) {
        return numToChinese(xs) + "星斗尊";
    } else if (ds === 9) {
        return numToChinese(xs) + "转半圣";
    } else if (ds === 10) {
        return numToChinese(xs) + "星斗圣";
    } else if (ds === 11) {
        return "至尊斗帝";
    } else {
        return "未知虚空";
    }
}

function numToChinese(num) {
    const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const units = ['', '十', '百', '千', '万'];
    let result = '';

    num = num.toString(); // 确保输入是字符串

    for (let i = 0; i < num.length; i++) {
        const digit = num[i];
        const unitPos = num.length - i - 1;

        result += chineseNumbers[digit] + units[unitPos % 4];

        if (digit !== '0' && unitPos % 4 === 0 && num.length > 1) {
            result += units[4]; // 处理万位
        }

        if (unitPos % 8 === 0 && unitPos !== 0) {
            result += units[5]; // 处理亿位
        }
    }

    return result.replace(/零+/g, '零').replace(/^一十/, '十');
}

//将JSON数据保存到本地浏览器缓存,data-JSON格式
function saveDataToCache(data) {
    localStorage.setItem("mcData", JSON.stringify(data));
}

//将JSON数据从浏览器缓存取出,key-缓存的键
function getDataFromCache(key) {
    let data2 = localStorage.getItem(key);
    if (data2 != null && typeof (data2) !== "undefined") {
        data2 = JSON.parse(data2);
    }
    return data2;
}

//从URL拿到参数的值
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
//校验角色是否配置了命座权重参数
function checkMingConfig(roleId){
    let flag = false;
    RoleSumProperty.forEach(item=>{
        if(item.id==roleId){
            if(typeof (item.mzProperty)!="undefined"){
                flag=true;
            }
        }
    });
    return flag;
}
// 统一读取链数及角色模态，单词条、整套充能校正使用同一分母。
function getRoleScoreConfig(role) {
    if (newCharacterModels.ids.includes(Number(role.roleListId))) return newCharacterModels.profile(role);
    const base = roleList[Number(role.roleListId) - 1];
    const ref = RoleSumProperty[Number(role.roleListId) - 1];
    const chain = Math.max(0, Math.min(6, parseInt(role.ming) || 0));
    let weights = base;
    let rule = ruleList[base.rule];
    if (chain && ref && ref.mzProperty && ref.mzRule) {
        weights = ref.mzProperty[chain - 1];
        rule = ref.mzRule[chain - 1];
    }
    if (Number(role.roleListId) === 53 && role.damageMode === 'harmony') {
        const profile = ref.modeProfiles.harmony[chain];
        weights = profile.weights;
        rule = profile.rule;
    }
    if (Number(role.roleListId) === 49 && role.damageMode === 'fusion') {
        const profile = ref.modeProfiles.fusion[chain];
        weights = profile.weights;
        rule = profile.rule;
    }
    if (Number(role.roleListId) === 51) {
        const extra = Math.max(0, Math.min(200, Number(role.extraEnergy) || 0));
        rule = {...rule, defenseLimit: Math.max(0, 50 - extra)};
        // 默认分母已含37.2%参考充能在额外充能为0时的转化；按用户输入重算。
        const coefficient = 2 * weights.echoSkillShare * rule.property;
        const conversion = er => Math.min(25, Math.max(0, extra + er - 25)) - Math.min(25, Math.max(0, extra - 25));
        const delta = coefficient * (conversion(37.2) - 12.2)
            - rule.efficiency01 * Math.max(0, 37.2 - rule.defenseLimit);
        weights = {...weights, maxscore: weights.maxscore + delta};
    }
    return {weights, rule};
}

// 按整套累计共鸣效率处理阈值，避免每个词条分别跨越125%而重复计分。
function getRoleEnergyCorrection(role, echoEnergy) {
    const {weights, rule} = getRoleScoreConfig(role);
    const energy = Math.max(0, Number(echoEnergy) || 0);
    let points = -(rule.efficiency01 - rule.efficiency02) * Math.max(0, energy - rule.defenseLimit);
    if (Number(role.roleListId) === 51) {
        const extra = Math.max(0, Math.min(200, Number(role.extraEnergy) || 0));
        const converted = Math.min(25, Math.max(0, extra + energy - 25)) - Math.min(25, Math.max(0, extra - 25));
        points += 2 * weights.echoSkillShare * rule.property * converted;
    }
    return points * 100 / weights.maxscore;
}

// 导入存档的声骸分数也要随链数、模态、外部充能重算，不能沿用缓存。
function recalculateMechanicRole(role) {
    if (![49, 51, 52, 53, ...newCharacterModels.ids].includes(Number(role.roleListId))) return;
    let total = 0, energy = 0;
    (role.costList || []).forEach(cost => {
        const imported = cost.mainAtrri && typeof cost.mainAtrri === 'object';
        let score = 0;
        if (imported) {
            score = Number(countMainAttr2(cost, role)) + Number(countScores(cost.mainAtrri, role));
            if (cost.mainAtrri.property === '共鸣效率') energy += parseFloat(cost.mainAtrri.value) || 0;
        } else if (cost.mainAtrri) {
            score = Number(countMainAttr(cost, role));
            if (cost.mainAtrri.includes('效率')) energy += 32;
        }
        (cost.propertyList || []).forEach(ct => {
            score += Number(countScores(ct, role));
            if (ct.property === '共鸣效率') energy += parseFloat(ct.value) || 0;
        });
        cost.sumScores = score.toFixed(2);
        total += Number(cost.sumScores);
    });
    role.totalScore = (total + getRoleEnergyCorrection(role, energy)).toFixed(2);
}

// 新机制的选项保存在当前角色；默认值也可用于没有这些字段的旧存档。
function setupRoleMechanics(role, onChange) {
    const id = Number(role.roleListId);
    if (newCharacterModels.ids.includes(id)) {
        $('#mc-role-mechanics').remove();
        const setting = newCharacterModels.settings[id];
        let content = '';
        if (setting.modes.length > 1) {
            content = '<label for="mc-damage-mode">' + setting.label + '</label> <select id="mc-damage-mode">' +
                setting.modes.map(([value,label]) => '<option value="' + value + '">' + label + '</option>').join('') + '</select>';
        }
        if (id === 62) content += '<div><label for="mc-reference-health">生命收益评估基准</label> <input id="mc-reference-health" type="number" min="15000" max="70000" step="100" style="width:7em"><small>评估此生命值附近的词条收益；50000后额外生命无输出收益。比较配装时请保持同一基准。</small></div>';
        if (id === 57 || id === 58) content += '<small>旧存档“属伤”按导电计；其他属性请在声骸主词条中指定。</small>';
        if (!content) return;
        const panel = '<div id="mc-role-mechanics" class="mc-role-mode-row">' + content + '</div>';
        if ($('#roleMing').length) $('#roleMing').parent().after(panel);
        else $('.mc-character-score').first().append(panel);
        $('#mc-damage-mode').val(newCharacterModels.modeFor(role)).on('change', function () {
            role.damageMode = $(this).val();
            onChange();
        });
        $('#mc-reference-health').val(Math.max(15000,Math.min(70000,Number(role.referenceHealth)||40000))).on('change',function () {
            role.referenceHealth = Math.max(15000,Math.min(70000,Number($(this).val())||40000));
            $(this).val(role.referenceHealth);
            onChange();
        });
        return;
    }
    if (![49, 51, 53].includes(id)) return;
    $('#mc-role-mechanics').remove();
    const options = id === 49
        ? '<option value="tune">震谐</option><option value="fusion">聚爆</option>'
        : '<option value="fusion">聚爆</option><option value="harmony">集谐</option>';
    const content = id !== 51
        ? '<label for="mc-damage-mode">评分模态</label> <select id="mc-damage-mode">' + options + '</select>'
        : '<label for="mc-extra-energy">声骸以外的额外共鸣效率（%）</label> <input id="mc-extra-energy" type="number" min="0" max="200" step="0.1" style="width:6em"> <small>不含基础100%；计入武器等提供的充能。125%至150%的声骸增伤转化计入整套总分。</small>';
    if (id === 51) {
        $('.mc-fct-hj-title3').first().before('<div id="mc-role-mechanics" class="mb-3">' + content + '</div>');
    } else {
        // 与共鸣链放在同一角色设置区；导入页没有链数选择器，放在角色摘要下。
        const panel = '<div id="mc-role-mechanics" class="mc-role-mode-row">' + content + '</div>';
        if ($('#roleMing').length) {
            $('#roleMing').parent().after(panel);
        } else {
            $('.mc-character-score').first().append(panel);
        }
    }
    const selectedMode = id === 49 ? (role.damageMode === 'fusion' ? 'fusion' : 'tune') : (role.damageMode === 'harmony' ? 'harmony' : 'fusion');
    $('#mc-damage-mode').val(selectedMode).on('change', function () {
        role.damageMode = $(this).val();
        onChange();
    });
    $('#mc-extra-energy').val(Math.max(0, Math.min(200, Number(role.extraEnergy) || 0))).on('change', function () {
        role.extraEnergy = Math.max(0, Math.min(200, Number($(this).val()) || 0));
        $(this).val(role.extraEnergy);
        onChange();
    });
}

//传入词条根据角色自动计算分数,ct词条对象,role角色对象，return分数
// Pure calculation details for read-only consumers. Keep the legacy rounded API below.
function getScoreDetails(ct, role) {
    if (role != null && ct != null) {
        const {rule: curRule, weights: ruleType} = getRoleScoreConfig(role);
        //先确定词条系数
        let xs = 0;
        switch (ct.property) {
            case "暴击":
                xs = curRule.crit;
                break;
            case "暴伤":
                xs = curRule.critDamage;
                break;
            case "大攻击":
                xs = curRule.attack01;
                break;
            case "小攻击":
                xs = curRule.attack02;
                break;
            case "大生命":
                xs = curRule.health01;
                break;
            case "小生命":
                xs = curRule.health02;
                break;
            case "生命":
                if (newCharacterModels.ids.includes(Number(role.roleListId))) xs = curRule.health02;
                break;
            case "大防御":
                xs = curRule.defense01;
                break;
            case "小防御":
                xs = curRule.defense02;
                break;
            case "属伤":
                xs = curRule.property;
                break;
            case "导电伤害":
            case "衍射伤害":
            case "湮灭伤害":
            case "气动伤害":
            case "热熔伤害":
            case "冷凝伤害":
                xs = curRule.elements ? (curRule.elements[ct.property.slice(0,2)] || 0) : curRule.property;
                break;
            case "治疗":
                xs = curRule.treat;
                break;
            case "共鸣效率":
                xs = curRule.efficiency01;
                break;
            case "普攻伤害":
                xs = curRule.typeCoefficients ? curRule.typeCoefficients.normal : curRule.unike * ruleType.normal;
                break;
            case "重击伤害":
                xs = curRule.typeCoefficients ? curRule.typeCoefficients.heavy : curRule.unike * ruleType.heavy;
                break;
            case "技能伤害":
                xs = curRule.typeCoefficients ? curRule.typeCoefficients.skill : curRule.unike * ruleType.skill;
                break;
            case "解放伤害":
                xs = curRule.typeCoefficients ? curRule.typeCoefficients.liberate : curRule.unike * ruleType.liberate;
                break;
        }
        //先将百分号去除
        let val = ct.value.replace("%", "");
        let score = parseFloat(val) * xs * 100 / ruleType.maxscore;
        return {coefficient: xs, rawScore: score, score: score.toFixed(2)};
    }
    return null;
}

function countScores(ct, role) {
    const details = getScoreDetails(ct, role);
    if (details) return details.score;
    alert("异常：数据关联角色失败。");
    return 0;
}

//计分器-传入一个声骸计算返回其总得分-cost声骸对象
function sumCostScores(cost, role) {
    let score = countScores(cost.mainAtrri, role);
    if (cost.propertyList != null && cost.propertyList.length > 0) {
        cost.propertyList.forEach(item => {
            score = parseFloat(score) + parseFloat(countScores(item, role));

        });
    }
    score = parseFloat(score);
    return score.toFixed(2);
}

//将主属性计分
function countMainAttr(currentCost, curRole) {
    //将主属性计分
    let ct = 0;
    let score1 = 0;
    let score2 = 0;
    if (currentCost.type === "Cost1") {
        ct = {"property": "生命", "value": "2280"};
    } else if (currentCost.type === "Cost3") {
        ct = {"property": "小攻击", "value": "100"};
    } else if (currentCost.type === "Cost4") {
        ct = {"property": "小攻击", "value": "150"};
    }
    score2 = countScores(ct, curRole);
    if (currentCost.mainAtrri === "暴击22%" || currentCost.mainAtrri === "暴击22.0%") {
        ct = {"property": "暴击", "value": "22%"};
    } else if (currentCost.mainAtrri === "暴伤44%" || currentCost.mainAtrri === "暴伤44.0%") {
        ct = {"property": "暴伤", "value": "44%"};
    } else if (currentCost.mainAtrri === "生命33%") {
        ct = {"property": "大生命", "value": "33%"};
    } else if (currentCost.mainAtrri === "攻击力33%") {
        ct = {"property": "大攻击", "value": "33%"};
    } else if (currentCost.mainAtrri === "防御41.8%") {
        ct = {"property": "大防御", "value": "41.8%"};
    } else if (currentCost.mainAtrri === "治疗26.4%") {
        ct = {"property": "治疗", "value": "26.4%"};
    } else if (currentCost.mainAtrri === "攻击力30%") {
        ct = {"property": "大攻击", "value": "30%"};
    } else if (currentCost.mainAtrri === "属伤30%") {
        ct = {"property": "属伤", "value": "30%"};
    } else if (/^(导电|衍射|湮灭|气动|热熔|冷凝)伤害30%$/.test(currentCost.mainAtrri)) {
        ct = {"property": currentCost.mainAtrri.slice(0,4), "value": "30%"};
    } else if (currentCost.mainAtrri === "生命30%") {
        ct = {"property": "大生命", "value": "30%"};
    } else if (currentCost.mainAtrri === "共鸣效率32%") {
        ct = {"property": "共鸣效率", "value": "32%"};
    } else if (currentCost.mainAtrri === "防御38%") {
        ct = {"property": "大防御", "value": "38%"};
    } else if (currentCost.mainAtrri === "攻击力18%" || currentCost.mainAtrri === "攻击18%") {
        ct = {"property": "大攻击", "value": "18%"};
    } else if (currentCost.mainAtrri === "生命22.8%") {
        ct = {"property": "大生命", "value": "22.8%"};
    } else if (currentCost.mainAtrri === "防御18%") {
        ct = {"property": "大防御", "value": "18%"};
    }
    score1 = countScores(ct, curRole);
    score1 = parseFloat(score1) + parseFloat(score2);
    return score1.toFixed(2);
}

function countMainAttr2(currentCost, curRole) {
    //将主属性计分
    let ct = 0;
    if (currentCost.type === "Cost1") {
        ct = {"property": "生命", "value": "2280"};
    } else if (currentCost.type === "Cost3") {
        ct = {"property": "小攻击", "value": "100"};
    } else if (currentCost.type === "Cost4") {
        ct = {"property": "小攻击", "value": "150"};
    }
    return countScores(ct, curRole);
}

const hostName = "https://api.kurobbs.com:443";
const methodName = ["/aki/roleBox/akiBox/roleData", "/aki/roleBox/akiBox/getRoleDetail", "/user/emoji/queryUsage", "/aki/roleBox/akiBox/refreshData", "/aki/roleBox/akiBox/towerIndex", "/aki/roleBox/akiBox/towerDataDetail", "/aki/roleBox/requestToken"];
const tokenList = ["eyJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkIjoxNzI4MDU1Nzc4ODc3LCJ1c2VySWQiOjEwNDAyMTE5fQ.0TsWAkPmtCcJd1b58mMC3dpTSfxjt89rkIQXdepNeZY"];
//蒲牢评价
const pulaoSay = [
    {
        "level": 0,
        "title": "大佬真是强无敌啊~来自土木老姐的认可。",
        "dj": "龙王大成级大佬",
        "ps": "鸣太祖",
        "say": "大佬浑身都是肝，兜里全是钱~",
        "img": "kalie"
    },
    {
        "level": 1,
        "title": "大佬真是666啊~来自二十一号的瞻仰。",
        "dj": "半步龙王级大佬",
        "ps": "大鸣皇太子",
        "say": "大佬进深渊就像回家一样吧~",
        "img": "37"
    },
    {
        "level": 2,
        "title": "大佬家住无音区？~来自蒲牢的惊讶",
        "dj": "海啸级巅峰大佬",
        "ps": "大鸣左丞相",
        "say": "大佬体力无限的么？声骸见你绕道走~",
        "img": "lz01"
    },
    {
        "level": 3,
        "title": "大佬打全息已经像打精英怪一样了吧~",
        "dj": "半步海啸级大佬",
        "ps": "大鸣右丞相",
        "say": "大佬太强了，这期深渊带我乱杀~",
        "img": "lz03"
    },
    {
        "level": 4,
        "title": "大佬还记得我么?是我把你召唤到这个世界的~",
        "dj": "怒涛级巅峰大佬",
        "ps": "大鸣大将军",
        "say": "别指望我，我只是一瓶冰露~",
        "img": "blu"
    },
    {
        "level": 5,
        "title": "恭喜大佬再上一台阶，祝福早日达到海啸境~来自丽芙的认可",
        "dj": "怒涛级中期大佬",
        "ps": "大鸣禁军统帅",
        "say": "苟富贵，勿相忘，以后可要罩着我哦~",
        "img": "lifu09"
    },
    {
        "level": 6,
        "title": "恭喜大佬踏入怒涛级境界~这片土地归你管辖。",
        "dj": "入门怒涛级大佬",
        "ps": "大鸣偏将军",
        "say": "能不能给我整点好吃的，呜呜呜。",
        "img": "371"
    },
    {
        "level": 7,
        "title": "大佬已经成为这片大陆有名的强者了~来自比安卡的认可",
        "dj": "半步怒涛级大佬",
        "ps": "大鸣督军",
        "say": "十步杀一人，一天灭一城。",
        "img": "bak"
    },
    {
        "level": 8,
        "title": "大佬离称霸大鸣王潮不远了~来自蒲牢的认可",
        "dj": "巨浪级巅峰大佬",
        "ps": "大鸣都事",
        "say": "此子恐怖如斯~断不可留。",
        "img": "lz04"
    },
    {
        "level": 9,
        "title": "大佬突破巨浪境界，后面就海阔天空惹~",
        "dj": "巨浪级中期大佬",
        "ps": "大鸣检校",
        "say": "哈西嘞，无音区刷起来，man!",
        "img": "lz03"
    },
    {
        "level": 10,
        "title": "大佬练度不肝不咸，卖个萌~哎嘿~",
        "dj": "入门巨浪级中佬",
        "ps": "大鸣照磨",
        "say": "你打深渊估计有些吃力吧~因为吃力就对了，",
        "img": "lz02"
    },
    {
        "level": 11,
        "title": "你的练度在轻波级里是最强的！",
        "dj": "轻波级的王",
        "ps": "大鸣管勾",
        "say": "下一步，踏入巨浪级境界！",
        "img": "lz05"
    },
    {
        "level": 12,
        "title": "今天又被深渊和全息爆锤~",
        "dj": "轻波级小将",
        "ps": "大鸣参议",
        "say": "你感叹：这叼游戏这么难！",
        "img": "lifu02"
    }, {
        "level": 13,
        "title": "深渊全息不可能打的，这辈子都不可能打的。",
        "dj": "轻波级精锐",
        "ps": "大鸣参军",
        "say": "能混一天是一天~",
        "img": "lifu01"
    },
    {
        "level": 14,
        "title": "能签到能抽卡=能玩。",
        "dj": "轻波级憨憨",
        "ps": "大鸣断事",
        "say": "这叼游戏我是肝不了一点~",
        "img": "lz07"
    },
    {
        "level": 15,
        "title": "肝养的这么好是要留着出去浪么？",
        "dj": "轻波级杂鱼",
        "ps": "大鸣大头兵",
        "say": "死海里都找不到比你还咸的了~",
        "img": "lz06"
    }
]
const skillName = ["普攻", "技能", "解放", "变奏", "回路"]
//虚拟IP
var ipAddr = "";
$(function () {
    $("#tool-version").html(toolVersion);
    ipAddr = getRandomInt(100, 255) + ":" + getRandomInt(30, 255) + ":" + getRandomInt(100, 200) + ":" + getRandomInt(10, 255);
});
/*
var headers={
    'Host': 'api.kurobbs.com',
    'Connection': 'keep-alive',
    'Content-Length': 94,
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    'sec-ch-ua': '"Android WebView";v="117","Not;A=Brand";v="8","Chromium";v="117"',
    'source': 'android',
    'sec-ch-ua-mobile': '?1',
    'User-Agent': 'Mozilla/Android14',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json,text/plain',
    'devCode': '',
    'token': '',
    'sec-ch-ua-platform': '"Android"',
    'Origin': 'https://web-static.kurobbs.com',
    'X-Requested-With': 'com.kurogame.kjq',
    'Sec-Fetch-Site': 'same-site',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Accept-Encoding': 'gzip,deflate,br',
    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
}*/
var headers = {
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    'source': 'android',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json,text/plain,*/*',
    'devCode': '',
    'X-Requested-With': 'com.kurogame.kjq',
    'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
}
//补全headers
function completeHeaders(bat, needToken = true) {
    let newHeaders = headers;
    //从本地存储拿到保存的token
    let token = localStorage.getItem("kjq_token");
    if (token == null || typeof (token) === "undefined") {
        //还未设置token
        alert("检测到您还没有设置库街区token，现在去首页设置。");
        window.open("./index.html", "_self");
        return;
    } else {
        if (needToken) {
            newHeaders.token = token;
        }
    }
    //拿到IP地址-devcode
    newHeaders.devCode = ipAddr + ",Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/605.1.15 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 KuroGameBox/2.5.5";
    newHeaders.did = crypto.randomUUID().toUpperCase();
    if (bat != null && typeof (bat) !== "undefined") {
        newHeaders["b-at"] = bat;
    }
    return newHeaders;
}

function completeHeaders2(tk) {
    let newHeaders = headers;
    newHeaders.token = tk;
    //拿到IP地址-devcode
    newHeaders.devCode = ipAddr + ",Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/605.1.15 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 KuroGameBox/2.5.5";
    return newHeaders;
}

function getRandomInt(min, max) {
    min = Math.ceil(min); // 将min向上取整
    max = Math.floor(max); // 将max向下取整
    return Math.floor(Math.random() * (max - min + 1)) + min; // 返回min到max之间的随机整数
}

//官方角色ID互相映射我的体系角色ID
function mappingRoleId(rid, roleName) {
    // New API roles may not yet have a numeric mapping. Only match an explicit full name.
    if (roleName && !roleList.some(item => item.gid !== 0 && rid == item.gid)) {
        const normalized = String(roleName).replace(/[·・\-\s（）()]/g, '');
        const aliases = {'漂泊者女导电':57, '漂泊者男导电':58};
        if (aliases[normalized]) return aliases[normalized];
        const match = roleList.find(item => newCharacterModels.ids.includes(item.id) && item.name.replace(/[·・\-\s（）()]/g, '') === normalized);
        if (match) return match.id;
    }
    let re = 0;
    roleList.forEach((item) => {
        if (rid == item.gid) {
            re = item.id;
        }
    });
    roleList.forEach((item) => {
        if (rid == item.id) {
            re = item.gid;
        }
    });
    return re;
}

function mappingRoleImg(rid) {
    let re = 0;
    roleList.forEach((item) => {
        if (rid == item.id) {
            re = item.cls;
        }
    });
    return re;
}

//狗粮回收参数-num-强化阶级
const costExperance = [
    {"gouliang": 1, "dakong": 10},
    {"gouliang": 3.4, "dakong": 20},
    {"gouliang": 8, "dakong": 30},
    {"gouliang": 16, "dakong": 40},
    {"gouliang": 28.6, "dakong": 50}
]

function decrypt(ciphertext) {
    const keyBase64 = "XSNLFgNCth8j8oJI3cNIdw==";
    const key = CryptoJS.enc.Base64.parse(keyBase64);
    const encryptedData = CryptoJS.enc.Base64.parse(ciphertext);

    // 注意：CryptoJS中没有直接的ECB模式，但你可以使用ECB的兼容写法
    // 在CryptoJS中，你可以将模式设置为null来表示ECB（尽管这不是最佳实践）
    const decrypted = CryptoJS.AES.decrypt(
        {ciphertext: encryptedData},
        key,
        {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    try {
        return JSON.parse(plaintext);
    } catch (e) {
        throw new Error('转化解密数据为JSON失败，请联系作者。');
    }
}

// 首次进入当前浏览器会话时显示维护说明。
$(function () {
    if (window.RoleRegisterMode) return;
    const maintenanceKey = "mcMaintenanceNoticeShown";
    let hasShown = false;
    try {
        hasShown = sessionStorage.getItem(maintenanceKey) === "1";
    } catch (e) {
        hasShown = false;
    }

    if ($("#mc-maintenance-modal").length > 0) {
        return;
    }

    const modalHtml = `
        <div class="modal fade mc-maintenance-modal" id="mc-maintenance-modal" tabindex="-1" role="dialog" aria-labelledby="mc-maintenance-title" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="mc-maintenance-title">网站公告</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="关闭">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="nav nav-tabs mc-notice-tabs" role="tablist" aria-label="公告分类">
                        <button type="button" class="nav-link active" id="mc-notice-important-tab" data-toggle="tab" data-target="#mc-notice-important" role="tab" aria-controls="mc-notice-important" aria-selected="true">重要事项</button>
                        <button type="button" class="nav-link" id="mc-notice-updates-tab" data-toggle="tab" data-target="#mc-notice-updates" role="tab" aria-controls="mc-notice-updates" aria-selected="false">版本更新</button>
                    </div>
                    <div class="modal-body tab-content">
                        <div class="tab-pane fade show active" id="mc-notice-important" role="tabpanel" aria-labelledby="mc-notice-important-tab">
                        <ul>
                            <li>本工具前维护者已停止维护，<code class="mc-maintenance-domain">wuwaechotool.com</code> 将于 2026 年底到期。详情请查看 <a href="https://space.bilibili.com/287293445/dynamic" target="_blank" rel="noopener noreferrer">B站主页</a>。</li>
                            <li>目前由本人 <a href="https://space.bilibili.com/1265897372" target="_blank">@炭烤蛋</a> 继续接手维护，希望能让这个工具继续使用下去。</br>由于个人时间与开发进度有限，更新速度可能较慢，还请见谅。</li>
                            <li>原作者在设计时，部分占比主要依据个人判断，目前本人会借助 AI 辅助判断占比，让结果更准确。</li>
                            <li>如果发现任何问题，欢迎留言反馈 <a href="https://space.bilibili.com/1265897372" target="_blank">@炭烤蛋</a>。</li>
                        </ul>
                        </div>
                        <div class="tab-pane fade" id="mc-notice-updates" role="tabpanel" aria-labelledby="mc-notice-updates-tab">
                            <!-- 更新记录由新到旧排列，新版本添加在列表最前方。 -->
                            <article class="mc-release" aria-labelledby="mc-release-3-7-48">
                                <header class="mc-release-header">
                                    <h6 id="mc-release-3-7-48">声骸评分工具 <strong>3.7.48</strong></h6>
                                    <time datetime="2026-10-07">2026年10月7日</time>
                                </header>
                                <h6 class="mc-release-heading">角色数据新增</h6>
                                <ul class="mc-release-characters">
                                    <li>西格莉卡</li><li>绯雪</li><li>达妮娅</li><li>秧秧·玄翎</li><li>穗穗</li>
                                    <li>漂泊者·导电（女）</li><li>漂泊者·导电（男）</li><li>清宵</li><li>景燃</li><li>心</li>
                                </ul>
                                <p class="mc-release-summary">上述角色已新增占比判断与多模态判断；另外，爱弥斯新增多模态判断。</p>
                                <h6 class="mc-release-heading">功能优化与新增</h6>
                                <ol class="mc-release-features">
                                    <li>放大电脑端角色选择卡牌，手机端大小不变。</li>
                                    <li>新增多模态选择。</li>
                                    <li>调整角色删除按钮的显示。</li>
                                    <li>鼠标悬停在角色卡牌时显示角色名称。</li>
                                    <li>新增角色属性筛选。</li>
                                    <li>放大角色声骸页面的角色图片。</li>
                                </ol>
                            </article>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">我知道了</button>
                    </div>
                </div>
            </div>
        </div>`;

    $("body").append(modalHtml);
    // 保留弹窗供首页手动打开；会话标记只控制自动显示。
    if (hasShown) return;
    try {
        sessionStorage.setItem(maintenanceKey, "1");
    } catch (e) {
        // 某些隐私模式可能禁用 sessionStorage，弹窗仍可正常使用。
    }
    $("#mc-maintenance-modal").modal("show");
});
