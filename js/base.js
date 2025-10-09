const toolVersion = "2.7.31";
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
    {
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
    }
]
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
//传入词条根据角色自动计算分数,ct词条对象,role角色对象，return分数
function countScores(ct, role) {
    if (role != null && ct != null) {
        let curRule = ruleList[roleList[role.roleListId - 1].rule];
        let ruleType = roleList[role.roleListId - 1];
        //校验是否有命座，如果有，优先适用命座规则-部分角色开放】
        if (checkMingConfig(role.roleListId)) {
            if (typeof (role.ming) !== "undefined" && parseInt(role.ming) > 0) {
                //取出对应的命座计算规则。
                let ming = parseInt(role.ming) - 1;
                ruleType = RoleSumProperty[role.roleListId - 1].mzProperty[ming];
                curRule = RoleSumProperty[role.roleListId - 1].mzRule[ming];
            }
        }
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
            case "大防御":
                xs = curRule.defense01;
                break;
            case "小防御":
                xs = curRule.defense02;
                break;
            case "属伤":
                xs = curRule.property;
                break;
            case "治疗":
                xs = curRule.treat;
                break;
            case "共鸣效率":
                xs = curRule.efficiency01;
                break;
            case "普攻伤害":
                xs = curRule.unike * ruleType.normal;
                break;
            case "重击伤害":
                xs = curRule.unike * ruleType.heavy;
                break;
            case "技能伤害":
                xs = curRule.unike * ruleType.skill;
                break;
            case "解放伤害":
                xs = curRule.unike * ruleType.liberate;
                break;
        }
        //先将百分号去除
        let val = ct.value.replace("%", "");
        let score = parseFloat(val) * xs * 100 / ruleType.maxscore;
        return score.toFixed(2);
    } else {
        alert("异常：数据关联角色失败。");
        return 0;
    }
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
function mappingRoleId(rid) {
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