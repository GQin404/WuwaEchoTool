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
        window.open("./index.html?view=classic", "_self");
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
                    if (roleList.some(r => r.id == item.roleListId)) {
                        let rlItem = roleList.find(r => r.id == item.roleListId);
                        $(".mc-character-img").attr("src", CharacterPortraits.resolve(rlItem)).attr("alt", rlItem?.name || "角色");
                        $(".mc-character-name").text(rlItem?.name || "未知角色");
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
                    randerCostList(curRole.costList, false);
                }
            });
        } else {
            alert("没有检查到历史数据或选择编辑的角色ID，请返回首页。");
            window.open("./index.html?view=classic", "_self");
            return;
        }
    }

    //返回首页
    $(".mc-btn-backhome").click(() => {
        window.open("./index.html?view=classic", "_self");
    });

    //点击导入角色数据
    $(".mc-character-addbtn2").click(async () => {
        if (!flag || !confirm("确定要从官方导出数据到本页面吗？")) return;
        flag=false;
        const source=JSON.stringify(getDataFromCache('mcData'));
        const service=ImportService.create({ajax:$.ajax,host:hostName,methods:methodName,headers:completeHeaders,tokenHeaders:completeHeaders2,storage:localStorage,convert:(echo,role)=>RoleImportCore.convertPhantomData(echo,role,{guifan,countMainAttr2,sumCostScores})});
        try {
            const updated=await service.detail(String(curData.tzmId||''),{...curRole,gameRoleId:curRole.gameRoleId||mappingRoleId(curRole.roleListId)});
            if(JSON.stringify(getDataFromCache('mcData'))!==source)throw Error('SOURCE_CHANGED');
            const normalize=RoleViewModel.createAdapter({roleList,costList,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection});
            const core=CharacterCore.create({read:()=>getDataFromCache('mcData'),write:saveDataToCache,normalize});
            core.score(updated);
            core.transact(source,data=>{const index=data.role.findIndex(r=>r.roleId===curRole.roleId);if(index<0)throw Error('SOURCE_CHANGED');data.role[index]=updated;});
            location.reload();
        }catch(_){alert(EchoI18n.createBrowser(window).t('workspace.IMPORT_FAILED'));}
        finally{setTimeout(()=>{flag=true;},30000);}
    });

});

//初始化声骸列表list-声骸列表
function randerCostList(list, persist = true) {
    // 切换模态会重新渲染，汇总值必须从零开始。
    fcthz.forEach(item => { item.property = 0; });
    if ([49, 51, 52, 53, ...newCharacterModels.ids].includes(Number(curRole.roleListId))) {
        recalculateMechanicRole(curRole);
        if (persist) saveDataToCache(curData);
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
function guifan(zt,value){return RoleImportCore.guifan(zt,value);}

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
function convertPhantomData(ycost) { return RoleImportCore.convertPhantomData(ycost,curRole,{guifan,countMainAttr2,sumCostScores}); }
