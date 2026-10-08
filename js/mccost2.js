var roleid = 0;
var curData;
var curRole;
var flag = true;//控制导入频率
//副词条汇总值
var fcthz = [
    {"name": "暴击", "property": 0},
    {"name": "暴伤", "property": 0},
    {"name": "大攻击", "property": 0},
    {"name": "小攻击", "property": 0},
    {"name": "共鸣效率", "property": 0},
    {"name": "普攻伤害", "property": 0},
    {"name": "技能伤害", "property": 0},
    {"name": "重击伤害", "property": 0},
    {"name": "解放伤害", "property": 0},
    {"name": "大生命", "property": 0},
    {"name": "小生命", "property": 0},
    {"name": "大防御", "property": 0},
    {"name": "小防御", "property": 0}
];
$(function () {
    if (window.RoleRegisterMode) return;
    //获取当前编辑角色ID
    roleid = getQueryString("roleid");
    //从缓存取出角色数据
    curData = getDataFromCache("mcData");

    //初始化声骸列表
    if (curData == null || roleid == null) {
        alert("没有检查到历史数据或选择编辑的角色ID，请返回首页。");
        window.open("./index.html", "_self");
        return;
    } else {
        if (curData.role.length > 0) {
            curData.role.forEach(item => {
                if (item.roleId == roleid) {
                    curRole = item;
                    setupRoleMechanics(curRole, function () {
                        recalculateMechanicRole(curRole);
                        saveDataToCache(curData);
                        randerCostList(curRole.costList);
                    });
                    //初始化角色头像
                    if (item.cls != "" && item.cls != null) {
                        let rlItem = roleList.find(r => r.id == item.roleListId);
                        $(".mc-character-img").attr("src", "image/characters/" + rlItem.cls.replace("mcr-", "") + ".png");
                    }
                    //初始化武器等级命座
                    try {
                        $("#role-info").html("Lv" + curRole.level + " - " + (typeof (curRole.ming) === "undefined" ? 0 : curRole.ming) + "命");
                        $(".mc-weapon-img").attr("src", curRole.weaponImg);
                        if (typeof (curRole.weaponStar) !== "undefined") {
                            $(".mc-weapon-img").addClass("mc-weapon-bg" + curRole.weaponStar);
                            if (typeof (curRole.weaponlevel) !== "undefined" && typeof (curRole.weaponReson) !== "undefined") {
                                $(".mc-weapon-info").html("Lv" + curRole.weaponlevel + "-精" + curRole.weaponReson);
                            }
                        }
                        //初始化技能图
                        let sklres = "";
                        curRole.skillList.forEach((its, idx) => {
                            sklres += `<div class="mc-role-skill-item">
                                            <img class="mc-role-skill-img" src="` + its.img + `" alt="技能图片">
                                            <span class="mc-role-skill-level">` + skillName[idx] + `-` + its.level + `</span>
                                        </div>`;
                        });
                        $(".mc-role-skill").html(sklres);
                    } catch (e) {
                        //第一次进，少属性导致报错
                    }
                    //开始初始化声骸列表
                    randerCostList(curRole.costList);
                }
            });
        } else {
            alert("没有检查到历史数据或选择编辑的角色ID，请返回首页。");
            window.open("./index.html", "_self");
            return;
        }
    }

    //返回首页
    $(".mc-btn-backhome").click(() => {
        window.open("./index.html", "_self");
    });

    //点击导入角色数据
    $(".mc-character-addbtn2").click(() => {
        if (!flag) {
            alert("导入按钮冷却中，冷却时间30秒，稍后再试。")
            return;
        }
        if (!confirm("确定要从官方导出数据到本页面吗？")) {
            return;
        }
        //拿到特征码
        if (curData.tzmId != null) {
            //有特征码，开始查询
            if (curData.tzmId.length !== 9) {
                alert("特征码ID必须是9位数字。")
                return;
            }
            let method = hostName + methodName[1];
            let params = {
                "gameId": 3,
                "roleId": curData.tzmId,
                "serverId": "76402e5b20be2c39f095a152090afddc",
                "channelId": 19,
                "countryCode": 1,
                "id": curRole.gameRoleId || mappingRoleId(curRole.roleListId)
            }
            //发送刷新数据请求
            $.ajax({
                url: hostName + methodName[3],
                type: 'POST',
                headers: completeHeaders(localStorage.getItem("kjq_bat"), false),
                data: params,
                dataType: 'json',
                success: function (rest) {
                    //查询角色数据
                    $.ajax({
                        url: method,
                        type: 'POST',
                        headers: completeHeaders(localStorage.getItem("kjq_bat"), false),
                        data: params,
                        dataType: 'json',
                        success: function (res) {

                            // 处理返回的数据
                            if (res != null && typeof (res) != "undefined" && (res.code === 200 || res.code === 10902)) {
                                fcthz = [
                                    {"name": "暴击", "property": 0},
                                    {"name": "暴伤", "property": 0},
                                    {"name": "大攻击", "property": 0},
                                    {"name": "小攻击", "property": 0},
                                    {"name": "共鸣效率", "property": 0},
                                    {"name": "普攻伤害", "property": 0},
                                    {"name": "技能伤害", "property": 0},
                                    {"name": "重击伤害", "property": 0},
                                    {"name": "解放伤害", "property": 0},
                                    {"name": "大生命", "property": 0},
                                    {"name": "小生命", "property": 0},
                                    {"name": "大防御", "property": 0},
                                    {"name": "小防御", "property": 0}
                                ];
                                let deData = JSON.parse(res.data);
                                let info01 = "Lv" + deData.level;
                                curRole["level"] = deData.level;
                                //先处理等级-共鸣链
                                let mz = 0;
                                if (deData.chainList == null) {
                                    alert("在UID-" + curData.tzmId + "下没有查到该角色的数据。");
                                    return;
                                }
                                deData.chainList.forEach((item, index) => {
                                    if (item.unlocked) {
                                        mz++;
                                    }
                                });
                                info01 += "-" + mz + "命";
                                curRole["ming"] = mz;
                                $("#role-info").html(info01);
                                //处理武器
                                curRole["weaponImg"] = deData.weaponData.weapon.weaponIcon;
                                curRole["weaponStar"] = deData.weaponData.weapon.weaponStarLevel;
                                curRole["weaponlevel"] = deData.weaponData.level;
                                curRole["weaponReson"] = deData.weaponData.resonLevel;
                                $(".mc-weapon-img").attr("src", curRole.weaponImg).addClass("mc-weapon-bg" + curRole.weaponStar);
                                $(".mc-weapon-info").html("Lv" + curRole.weaponlevel + "-精" + curRole.weaponReson);
                                //处理技能
                                let rskill = "";
                                let skillList = [];
                                deData.skillList.forEach((item, index) => {
                                    if (index < 5) {
                                        let skl = {
                                            "img": item.skill.iconUrl,
                                            "level": item.level
                                        }
                                        skillList.push(skl);
                                        rskill += `<div class="mc-role-skill-item">
                                            <img class="mc-role-skill-img" src="` + item.skill.iconUrl + `" alt="技能图片">
                                            <span class="mc-role-skill-level">` + skillName[index] + `-` + item.level + `</span>
                                        </div>`;
                                    }
                                });
                                curRole["skillList"] = skillList;
                                $(".mc-role-skill").html(rskill);
                                //处理声骸
                                //先清空旧数据
                                curRole.costList = [];
                                if (deData.phantomData.equipPhantomList != null && deData.phantomData.equipPhantomList.length > 0) {
                                    deData.phantomData.equipPhantomList.forEach((item) => {
                                        if (item != null) {
                                            curRole.costList.push(convertPhantomData(item));
                                        }
                                    });
                                }
                                //计算总分
                                let sumScore = 0;
                                let overOfen = 0;
                                curRole.costList.forEach(iic => {
                                    if (iic.mainAtrri.property.includes("效")) {
                                        overOfen = parseFloat(overOfen) + parseFloat(iic.mainAtrri.value.replace("%", ""));
                                    }
                                    iic.propertyList.forEach((ipt) => {
                                        if (ipt.property.includes("效")) {
                                            overOfen = parseFloat(overOfen) + parseFloat(ipt.value.replace("%", ""));
                                        }
                                    });
                                    sumScore = parseFloat(sumScore) + parseFloat(iic.sumScores);
                                });
                                const maxScore = getRoleEnergyCorrection(curRole, overOfen);
                                sumScore = parseFloat(sumScore) + parseFloat(maxScore);
                                curRole.totalScore = sumScore.toFixed(2);
                                //保存数据到本地
                                curData.role.forEach((roles, index) => {
                                    if (roles.roleId == curRole.roleId) {
                                        curData.role[index] = curRole;
                                        saveDataToCache(curData);
                                    }
                                });
                                //刷新声骸列表
                                randerCostList(curRole.costList);
                                flag = false;
                                alert("导入成功！");
                                setTimeout(function () {
                                    flag = true;
                                }, 30000);
                            } else {
                                alert("ID" + curData.tzmId + "下未查到该角色：请检查你的库街区是否设置了不公开角色，也可能是token过期了，重新绑定一次试试。");
                            }
                        },
                        error: function (e) {
                            alert("从库街区获取数据失败，请保存截图并联系作者。");
                        }
                    });
                },
                error: function (e) {
                    alert("刷新游戏数据到库街区失败，请稍后再试。");
                }
            });

        } else {
            alert("没有查询到你的特征码，请重新录入一次。");
            window.open("./index.html", "_self");
        }
    });

});

//初始化声骸列表list-声骸列表
function randerCostList(list) {
    // 切换模态会重新渲染，汇总值必须从零开始。
    fcthz.forEach(item => { item.property = 0; });
    if ([49, 51, 52, 53, ...newCharacterModels.ids].includes(Number(curRole.roleListId))) {
        recalculateMechanicRole(curRole);
        saveDataToCache(curData);
    }
    if (list != null && typeof (list) != "undefined" && list.length > 0) {
        let ress = ""
        let ctz = "";
        let sbdc = 0;//双爆达成数量
        let gjdc = 0;//大攻击条数
        let sumFct = 0;//副词条总分
        //对声骸进行43311排序
        list.sort(function(a, b) {
            let aval = a.type.replace("Cost","");
            let bval = b.type.replace("Cost","");
            return parseInt(bval) - parseInt(aval);
        });
        list.forEach((item, index) => {
            ress += `<div data-id="` + item.costId + `" cost-id="` + item.costListId + `" class="mc-cost-list">
            <div class="mc-cost-val3">
                <img class="mc-cost-img mc-cost-img2" src="` + item.imgCode + `" alt="cost">`;
            if (item.suite !== null && item.suite !== "") {
                ress += `<img class="mc-suite-attr3" src="` + item.suite + `" alt="套装属性">`;
            }
            ress += `</div>`;

            if (item.type === "Cost1") {
                ctz = "生命2280";
            } else if (item.type === "Cost3") {
                ctz = "小攻击100";
            } else if (item.type === "Cost4") {
                ctz = "小攻击150";
            }
            ress += `<div class="mc-cost-val mc-cost-val2">
                                <p>主属性</p>
                                <p>` + (item.mainAtrri == null ? "未设置" : (guifan2(item.mainAtrri.property) + item.mainAtrri.value)) + `</p>
                                <p>` + ctz + `</p>
                                <p class="mc-cost-blue">总` + item.sumScores + `分</p>
                            </div>`;
            let lss = 0;
            let fcthj = 0;
            for (let i = 0; i < 5; i++) {
                if (typeof (item.propertyList) != "undefined" && i < item.propertyList.length) {
                    fcthz.forEach((fct, index) => {
                        if (fct.name === item.propertyList[i].property) {
                            fcthz[index].property = parseFloat(fct.property) + parseFloat(item.propertyList[i].value.replace("%", ""));
                        }
                    });
                    fcthj = parseFloat(fcthj) + parseFloat(countScores(item.propertyList[i], curRole));
                    if (item.propertyList[i].property === "暴击" || item.propertyList[i].property === "暴伤") {
                        ress += `<div class="mc-cost-val">
                                <p>属性` + (i + 1) + `</p>
                                <p class="mc-cost-jiaz mc-cost-red">` + jianhua(item.propertyList[i].property) + `</p>
                                <p class="mc-cost-jiaz mc-cost-red">` + item.propertyList[i].value + `</p>
                                <p class="mc-cost-jiaz">` + countScores(item.propertyList[i], curRole) + `分</p>
                            </div>`;
                        lss = lss + 1;
                    } else if (item.propertyList[i].property === "大攻击" || item.propertyList[i].property === "小攻击") {
                        ress += `<div class="mc-cost-val">
                                <p>属性` + (i + 1) + `</p>
                                <p class="mc-cost-jiaz mc-cost-orange">` + jianhua(item.propertyList[i].property) + `</p>
                                <p class="mc-cost-jiaz mc-cost-orange">` + item.propertyList[i].value + `</p>
                                <p class="mc-cost-jiaz">` + countScores(item.propertyList[i], curRole) + `分</p>
                            </div>`;
                        if (item.propertyList[i].property === "大攻击") {
                            gjdc = gjdc + 1;
                        }
                    } else if (item.propertyList[i].property === "共鸣效率") {
                        ress += `<div class="mc-cost-val">
                                <p>属性` + (i + 1) + `</p>
                                <p class="mc-cost-green">` + jianhua(item.propertyList[i].property) + `</p>
                                <p class="mc-cost-green">` + item.propertyList[i].value + `</p>
                                <p>` + countScores(item.propertyList[i], curRole) + `分</p>
                            </div>`;
                    } else if (item.propertyList[i].property === "普攻伤害" || item.propertyList[i].property === "重击伤害" || item.propertyList[i].property === "技能伤害" || item.propertyList[i].property === "解放伤害") {
                        ress += `<div class="mc-cost-val">
                                <p>属性` + (i + 1) + `</p>
                                <p class="mc-cost-purple">` + jianhua(item.propertyList[i].property) + `</p>
                                <p class="mc-cost-purple">` + item.propertyList[i].value + `</p>
                                <p>` + countScores(item.propertyList[i], curRole) + `分</p>
                            </div>`;
                    } else {
                        ress += `<div class="mc-cost-val">
                                <p>属性` + (i + 1) + `</p>
                                <p>` + jianhua(item.propertyList[i].property) + `</p>
                                <p>` + item.propertyList[i].value + `</p>
                                <p>` + countScores(item.propertyList[i], curRole) + `分</p>
                            </div>`;
                    }

                } else {
                    ress += `<div class="mc-cost-val">
                                <p>属性` + (i + 1) + `</p>
                                <p>/</p>
                                <p>/</p>
                                <p>0.00分</p>
                            </div>`;
                }
            }
            if (lss > 1) {
                sbdc = sbdc + 1;
            }
            $("#fhj0" + (index + 1)).html(fcthj.toFixed(2));
            sumFct = parseFloat(sumFct) + parseFloat(fcthj.toFixed(2));
            ress += `</div>`;
        });
        ress += `</div>`;
        $("#fhj06").html(sumFct.toFixed(2));
        $(".mc-cost-list2").html(ress);
        countHJF(sbdc, gjdc);
        renderFctCount();
    } else {
        countHJF(0, 0);
    }
}

//渲染副词条汇总统计表
function renderFctCount() {
    //将标题命座回填
    $("#mc-mzs").html(typeof (curRole.ming) !== "undefined" ? curRole.ming : 0);
    //开始回填列表
    let maxHz = getRoleScoreConfig(curRole).reference || RoleSumProperty[parseInt(curRole.roleListId) - 1].propertyList;
    let resh = "";
    let wcd = 0;
    maxHz.forEach((item, index) => {
        if (item.property !== "0" && item.property !== "0%" && item.property !== 0) {
            wcd = parseFloat(fcthz[index].property) * 100 / parseFloat(item.property.replace("%", ""));
            wcd = wcd.toFixed(2) + "%";
        } else {
            wcd = "/";
        }

        resh += `<tr>
                    <th scope="row">` + (index + 1) + `</th>
                    <td>` + item.name + `</td>
                    <td>` + (item.name.includes("小") ? fcthz[index].property : (fcthz[index].property.toFixed(1) + "%")) + `</td>
                    <td>` + item.property + `</td>
                    <td>` + wcd + `</td>
                </tr>`;
    });
    $("#mc-fct-hzb").html(resh);
}

//简化中文字数
function jianhua(zt) {
    if (zt === "共鸣效率") {
        return "共效";
    } else if (zt === "普攻伤害") {
        return "普伤";
    } else if (zt === "重击伤害") {
        return "重击";
    } else if (zt === "技能伤害") {
        return "技伤";
    } else if (zt === "解放伤害") {
        return "解放";
    } else if (zt === "暴击伤害") {
        return "暴伤";
    } else if (zt === "普攻伤害加成") {
        return "普伤";
    } else if (zt === "共鸣技能伤害加成") {
        return "技伤";
    } else if (zt === "重击伤害加成") {
        return "重击";
    } else if (zt === "共鸣解放伤害加成") {
        return "解放";
    } else if (zt === "衍射伤害加成" || zt === "气动伤害加成" || zt === "热熔伤害加成" || zt === "冷凝伤害加成" || zt === "湮灭伤害加成" || zt === "导电伤害加成") {
        return "属伤";
    } else {
        return zt;
    }
}

//将官方词条规范成我的标准
function guifan(zt, value) {
    if (/^(衍射|气动|热熔|冷凝|湮灭|导电)伤害加成$/.test(zt)) return zt.replace('加成', '');
    if (zt === "普攻伤害加成") {
        return "普攻伤害";
    } else if (zt === "重击伤害加成") {
        return "重击伤害";
    } else if (zt === "共鸣技能伤害加成") {
        return "技能伤害";
    } else if (zt === "共鸣解放伤害加成") {
        return "解放伤害";
    } else if (zt === "暴击伤害") {
        return "暴伤";
    } else if (zt === "治疗效果加成") {
        return "治疗";
    } else if (zt === "攻击") {
        if (value.includes('%')) {
            return "大攻击";
        }
        return "小攻击";
    } else if (zt === "生命") {
        if (value.includes('%')) {
            return "大生命";
        }
        return "小生命";
    } else if (zt === "防御") {
        if (value.includes('%')) {
            return "大防御";
        }
        return "小防御";
    } else if (zt === "衍射伤害加成" || zt === "气动伤害加成" || zt === "热熔伤害加成" || zt === "冷凝伤害加成" || zt === "湮灭伤害加成" || zt === "导电伤害加成") {
        return "属伤";
    } else {
        return zt;
    }
}

function guifan2(zt) {
    if (zt === "大攻击" || zt === "小攻击") {
        return "攻击";
    } else if (zt === "大生命" || zt === "小生命") {
        return "生命";
    } else if (zt === "大防御" || zt === "小防御") {
        return "防御";
    } else if (zt === "共鸣效率") {
        return "共效";
    } else {
        return zt;
    }
}

//初始化声骸计分
function countHJF(sbz, gjz) {
    $("#sbz").html(sbz);
    $("#gjz").html(gjz);
    $("#zfz").html(curRole.totalScore);
    $("#pjz").html(byzt(curRole.totalScore));
    //计算超越百分比
    let percent = parseFloat(curRole.totalScore) * 100 / MaxScore;
    percent = percent.toFixed(1);
    if (parseFloat(percent) > 100) {
        percent = 100;
    }
    $(".mc-badge-left").html("超" + percent + "%玩家");
    $(".mc-badge-right").html(callbackEval((typeof (curRole.weaponStar) !== "undefined" && curRole.weaponStar === 5 ? curRole.weaponReson : 0), typeof (curRole.ming) !== "undefined" ? curRole.ming : 0, curRole.totalScore));
}

function byzt(score) {
    if ((parseFloat(score) > 90)) {
        return "完美毕业"
    } else if ((parseFloat(score) > 80)) {
        return "大毕业"
    } else if ((parseFloat(score) > 70)) {
        return "中毕业"
    } else if ((parseFloat(score) > 60)) {
        return "小毕业"
    } else if ((parseFloat(score) > 50)) {
        return "接近毕业"
    } else {
        return "咸鱼一条";
    }
}

//将官方格式的声骸剥离成我的格式-ycost官方格式
function convertPhantomData(ycost) {
    let newCost = {
        "costId": Date.now() + ycost.phantomProp.phantomPropId,
        "costListId": ycost.phantomProp.phantomPropId,
        "name": ycost.phantomProp.name,
        "type": "Cost" + ycost.phantomProp.cost,
        "imgCode": ycost.phantomProp.iconUrl,
        "suite": ycost.fetterDetail.iconUrl,
        "mainAtrri": {
            "property": guifan(ycost.mainProps[0].attributeName === "攻击" ? "大攻击" : ycost.mainProps[0].attributeName, ycost.mainProps[0].attributeValue),
            "value": ycost.mainProps[0].attributeValue
        },
        "sumScores": 0,
        "propertyList": []
    }
    if (ycost.subProps != null && ycost.subProps.length > 0) {
        ycost.subProps.forEach(its => {
            //副词条转化
            newCost.propertyList.push({
                "property": guifan(its.attributeName, its.attributeValue),
                "value": its.attributeValue
            });
        });
    }
    newCost.sumScores = countMainAttr2(newCost, curRole);
    newCost.sumScores = parseFloat(newCost.sumScores) + parseFloat(sumCostScores(newCost, curRole));
    newCost.sumScores = newCost.sumScores.toFixed(2);
    return newCost;
}

