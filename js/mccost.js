var currentCostId = "000";//选择的声骸ID
var currentImportCostId = "000";//选择的导入声骸ID
var roleid = 0;
var curData;
var curRole;
var costNum = 0;
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
                    //初始化命座
                    if (typeof (item.ming) === "undefined") {
                        $("#roleMing").val("0");
                        $("#mc-mzs").val("0");
                        curRole["ming"] = 0;
                    } else {
                        $("#roleMing").val(item.ming);
                        $("#mc-mzs").html(item.ming);
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
    //初始化声骸选单默认加载Cost4
    loadCost("Cost4");
    //切换命座显示
    $("#roleMing").change(function () {
        let newMing = $(this).val();
        curRole.ming = newMing;
        //保存并刷新页面。
        curData.role.forEach((roles, index) => {
            if (roles.roleId == curRole.roleId) {
                curData.role[index] = curRole;
                saveDataToCache(curData);
            }
        });
        //开始初始化声骸列表
        randerCostList(curRole.costList);
        alert("已设定角色为【" + newMing + "】命,并自动刷新评分。");
    });
    $("#mc-addcost").on("click", ".mcccost-reset", function () {
        $(".mcccost-reset").removeClass("mc-active");
        $(this).addClass("mc-active");
        currentCostId = $(this).attr("data-id");
    });
    //返回首页
    $(".mc-btn-backhome").click(() => {
        window.open("./index.html?view=classic", "_self");
    });
    //添加保存声骸
    $('#qd-btn2').click(() => {
        //超5个校验
        if (curRole.costList.length > 4) {
            alert("已经添加了5个声骸，不能再添加了。");
            $('#mc-addcost').modal('hide');
            return;
        }
        if (parseInt(costNum) > 11) {
            alert("已经累计达到12Cost，不能再添加了。");
            $('#mc-addcost').modal('hide');
            return;
        }
        if (currentCostId === "000") {
            alert("请先选择一个声骸。");
            return;
        }
        // 执行确定按钮的操作
        let currentCost = CharacterCore.createEcho(costList[currentCostId - 1], Date.now());
        try {const normalize=RoleViewModel.createAdapter({roleList,costList,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection});
            const core=CharacterCore.create({read:()=>getDataFromCache('mcData'),write:saveDataToCache,normalize});
            core.transact(JSON.stringify(core.load()),d=>core.saveEcho(d,roleid,null,currentCost,d.role.find(r=>String(r.roleId)===String(roleid)).costList.length+1));
            curData=core.load();curRole=curData.role.find(r=>String(r.roleId)===String(roleid));randerCostList(curRole.costList,false);
        }catch(_){alert(EchoI18n.createBrowser(window).t('workspace.COST_LIMIT'));return;}
        if (getQueryString("registerAdd") === "1") {
            const target = new URLSearchParams({roleid:String(roleid),view:'register',selectedPosition:String(curRole.costList.length),selectedEcho:String(currentCost.costId)});
            window.open('./mccost.html?' + target, '_self');
            return;
        }
        $('.mc-cost-list-null').addClass('mc-hide');
        $('#mc-addcost').modal('hide');
    });

    //导入声骸相关事件
    //当导入模态框显示时，渲染未使用的声骸列表
    $('#mc-importcost').on('show.bs.modal', function () {
        renderImportCostList();
    });

    //选择导入的声骸
    $(document).on("click", ".mc-import-cost-list .mc-cost-list", function () {
        $(".mc-import-cost-list .mc-cost-list").removeClass("mc-active");
        $(this).addClass("mc-active");
        currentImportCostId = $(this).attr("data-id");
    });

    //导入声骸过滤
    $("#mc-import-filter-value").change(function () {
        renderImportCostList($(this).find("option:selected").val());
    });

    //确认导入声骸
    $('#import-qd-btn').click(() => {
        //超5个校验
        if (curRole.costList.length > 4) {
            alert("已经添加了5个声骸，不能再添加了。");
            $('#mc-importcost').modal('hide');
            return;
        }
        if (parseInt(costNum) > 11) {
            alert("已经累计达到12Cost，不能再添加了。");
            $('#mc-importcost').modal('hide');
            return;
        }
        if (currentImportCostId === "000") {
            alert("请先选择一个声骸。");
            return;
        }

        // 找到选中的未使用声骸
        let selectedCost = null;
        if (curData.unusedEchoes && curData.unusedEchoes.length > 0) {
            selectedCost = curData.unusedEchoes.find(item => item.costId == currentImportCostId);
        }

        if (!selectedCost) {
            alert("未找到选中的声骸。");
            return;
        }

        try {const normalize=RoleViewModel.createAdapter({roleList,costList,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection});
            const core=CharacterCore.create({read:()=>getDataFromCache('mcData'),write:saveDataToCache,normalize});
            core.transact(JSON.stringify(core.load()),d=>core.equip(d,roleid,currentImportCostId));
            curData=core.load();curRole=curData.role.find(r=>String(r.roleId)===String(roleid));randerCostList(curRole.costList,false);
        }catch(_){alert(EchoI18n.createBrowser(window).t('workspace.COST_LIMIT'));return;}
        // 隐藏模态框
        $('#mc-importcost').modal('hide');
        
        // 重置选择
        currentImportCostId = "000";
    });

    //点击跳转到声骸编辑页
    $(".mc-cost-box").on("click", ".mc-cost-list", function () {
        window.open("./costedit.html?view=classic&roleid=" + roleid + "&costid=" + $(this).attr("data-id"), "_self");
    });
    if (getQueryString("registerAdd") === "1") $("#mc-addcost").modal("show");
    //重新过滤Cost
    $("#mc-filter-value").change(function () {
        loadCost($(this).find("option:selected").val());
    });
});

//渲染副词条汇总统计表
function renderFctCount() {
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

//加载声骸选单-cst-Cost名例如Cost4
function loadCost(cst) {
    let rest = "";
    costList.forEach(item => {
        if (item.type === cst) {
            if(item.imgCode.length>6){
                rest += `<div data-id="` + item.id + `"  class="mc-cost-val mcccost-reset">
                            <img class="mc-cost-img" src="` + item.imgCode + `" alt="cost">
                        </div>`;
            }else{
                rest += `<div data-id="` + item.id + `"  class="mc-cost-val mcccost-reset">
                            <img class="mc-cost-img" src="image/cost/` + item.imgCode + `.png" alt="cost">
                        </div>`;
            }

        }
    });
    $('.mc-fillcost-list').html(rest);
}

//初始化声骸列表list-声骸列表
function randerCostList(list, persist = true) {
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
    //对角色声骸得分及角色总分进行校准
    list = scoreAdjust(persist);
    if (list != null && list.length > 0) {
        let ress = ""
        let ctz = "";
        let sbdc = 0;//双爆达成数量
        let gjdc = 0;//大攻击条数
        let sumFct = 0;//副词条总分
        list.forEach((item, index) => {
            ress += `<div data-id="` + item.costId + `" cost-id="` + item.costListId + `" class="mc-cost-list">
            <div class="mc-cost-val3">`;
            if(item.imgCode.length>6){
                ress += `<img class="mc-cost-img" src="` + item.imgCode + `" alt="cost">`;
            }else{
                let gsxb = parseInt(item.imgCode)-1;
                ress += `<img class="mc-cost-img" src="` + costList[gsxb].imgCode + `" alt="cost">`;
            }

            if (item.suite !== null && item.suite !== "") {
                let sxz = getSuiteAttributeId(item.suite);
                ress += `<img class="mc-suite-attr2" src="image/attribute/` + sxz + `.png" alt="套装属性">`;
            }
            ress += `</div>`;

            if (item.type === "Cost1") {
                ctz = "生命2280";
                costNum = parseInt(costNum) + 1;
            } else if (item.type === "Cost3") {
                ctz = "小攻击100";
                costNum = parseInt(costNum) + 3;
            } else if (item.type === "Cost4") {
                ctz = "小攻击150";
                costNum = parseInt(costNum) + 4;
            }
            ress += `<div class="mc-cost-val mc-cost-val2">
                                <p>主属性</p>
                                <p>` + (item.mainAtrri == null ? "未设置" : jianhua(item.mainAtrri)) + `</p>
                                <p>` + ctz + `</p>
                                <p class="mc-cost-blue">总` + item.sumScores + `分</p>
                            </div>`;
            let lss = 0;
            let fcthj = 0;
            for (let i = 0; i < 5; i++) {
                shzf = 0;
                if (i < item.propertyList.length) {
                    fcthz.forEach((fct, idx) => {
                        if (fct.name === item.propertyList[i].property) {
                            fcthz[idx].property = parseFloat(fct.property) + parseFloat(item.propertyList[i].value.replace("%", ""));
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
    } else {
        if (zt.indexOf("共鸣效率") > -1) {
            return zt.replace("共鸣效率", "共效");
        }
        return zt;
    }
}

//初始化声骸计分
function countHJF(sbz, gjz) {
    $("#sbz").html(sbz);
    $("#gjz").html(gjz);
    $("#zfz").html(curRole.totalScore);
    $("#pjz").html(byzt(curRole.totalScore));
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

//对角色声骸得分及角色总分进行校准-返回声骸list
function scoreAdjust(persist = true) {
    // 新版的新增入口只读取旧配置，避免初始化时排序或回写缓存评分。
    if (getQueryString("registerAdd") === "1") return curRole.costList;
    let shzf = 0;//单个声骸总分
    let jszf = 0;//角色声骸总分
    let overOfen = 0;//共鸣效率累计值
    //对声骸进行43311排序
    curRole.costList=curRole.costList.sort(function(a, b) {
        let aval = a.type.replace("Cost","");
        let bval = b.type.replace("Cost","");
        return parseInt(bval) - parseInt(aval);
    });
    curRole.costList.forEach((item, index) => {
        shzf = 0;
        if (item.mainAtrri !== null && item.mainAtrri !== "") {
            shzf = parseFloat(shzf) + parseFloat(countMainAttr(item, curRole));
           // console.log(item.mainAtrri);
            if (item.mainAtrri.includes("效")) {
                overOfen = parseFloat(overOfen) + parseFloat(32);
            }
        }
        item.propertyList.forEach((its) => {
            shzf = parseFloat(shzf) + parseFloat(countScores(its, curRole));
            if (its.property.includes("效")) {
                overOfen = parseFloat(overOfen) + parseFloat(its.value.replace("%", ""));
            }
        });

        shzf = shzf.toFixed(2);
        jszf = parseFloat(jszf) + parseFloat(shzf);
        curRole.costList[index].sumScores = shzf;
    });
    const maxScore = getRoleEnergyCorrection(curRole, overOfen);
    jszf = parseFloat(jszf) + parseFloat(maxScore);
    jszf = jszf.toFixed(2);
    if (jszf != curRole.totalScore) {
        curRole.totalScore = jszf;
        $("#zfz").html(jszf);
        $("#pjz").html(byzt(curRole.totalScore));
        //保存数据
        curData.role.forEach((roles, index) => {
            if (roles.roleId == curRole.roleId) {
                curData.role[index] = curRole;
                if (persist) saveDataToCache(curData);
            }
        });
    }
    return curRole.costList;
}

//渲染导入声骸列表
function renderImportCostList(filterType = "all") {
    if (!curData.unusedEchoes || curData.unusedEchoes.length === 0) {
        $(".mc-import-cost-list").html('<div class="mc-cost-list-null">声骸库为空。</div>');
        return;
    }

    let filteredList = curData.unusedEchoes;
    if (filterType !== "all") {
        filteredList = curData.unusedEchoes.filter(item => item.type === filterType);
    }

    if (filteredList.length === 0) {
        $(".mc-import-cost-list").html('<div class="mc-cost-list-null">没有符合条件的声骸。</div>');
        return;
    }

    let ress = "";
    filteredList.forEach((item, index) => {
        ress += `<div data-id="` + item.costId + `" cost-id="` + item.costListId + `" class="mc-cost-list">
            <div class="mc-cost-val3">`;
        if(item.imgCode.length>6){
            ress += `<img class="mc-unused-cost-img" src="` + item.imgCode + `" alt="cost">`;
        }else{
            let gsxb = parseInt(item.imgCode)-1;
            ress += `<img class="mc-unused-cost-img" src="` + costList[gsxb].imgCode + `" alt="cost">`;
        }

        if (item.suite !== null && item.suite !== "") {
            let sxz = getSuiteAttributeId(item.suite);
            ress += `<img class="mc-suite-attr2" src="image/attribute/` + sxz + `.png" alt="套装属性">`;
        }
        ress += `</div>`;

        ress += `<div class="mc-cost-val mc-cost-val2">
                            <p>主属性</p>
                            <p>` + (item.mainAtrri == null ? "未设置" : jianhua(item.mainAtrri)) + `</p>
                            <p>` + (item.type === "Cost1" ? "生命2280" : item.type === "Cost3" ? "小攻击100" : "小攻击150") + `</p>
                        </div>`;

        for (let i = 0; i < 5; i++) {
            if (i < item.propertyList.length) {
                if (item.propertyList[i].property === "暴击" || item.propertyList[i].property === "暴伤") {
                    ress += `<div class="mc-cost-val mc-cost-val-unused">
                            <p>属性` + (i + 1) + `</p>
                            <p class="mc-cost-jiaz mc-cost-red">` + jianhua(item.propertyList[i].property) + `</p>
                            <p class="mc-cost-jiaz mc-cost-red">` + item.propertyList[i].value + `</p>
                        </div>`;
                } else if (item.propertyList[i].property === "大攻击" || item.propertyList[i].property === "小攻击") {
                    ress += `<div class="mc-cost-val mc-cost-val-unused">
                            <p>属性` + (i + 1) + `</p>
                            <p class="mc-cost-jiaz mc-cost-orange">` + jianhua(item.propertyList[i].property) + `</p>
                            <p class="mc-cost-jiaz mc-cost-orange">` + item.propertyList[i].value + `</p>
                        </div>`;
                } else if (item.propertyList[i].property === "共鸣效率") {
                    ress += `<div class="mc-cost-val mc-cost-val-unused">
                            <p>属性` + (i + 1) + `</p>
                            <p class="mc-cost-green">` + jianhua(item.propertyList[i].property) + `</p>
                            <p class="mc-cost-green">` + item.propertyList[i].value + `</p>
                        </div>`;
                } else if (item.propertyList[i].property === "普攻伤害" || item.propertyList[i].property === "重击伤害" || item.propertyList[i].property === "技能伤害" || item.propertyList[i].property === "解放伤害") {
                    ress += `<div class="mc-cost-val mc-cost-val-unused">
                            <p>属性` + (i + 1) + `</p>
                            <p class="mc-cost-purple">` + jianhua(item.propertyList[i].property) + `</p>
                            <p class="mc-cost-purple">` + item.propertyList[i].value + `</p>
                        </div>`;
                } else {
                    ress += `<div class="mc-cost-val mc-cost-val-unused">
                            <p>属性` + (i + 1) + `</p>
                            <p>` + jianhua(item.propertyList[i].property) + `</p>
                            <p>` + item.propertyList[i].value + `</p>
                        </div>`;
                }
            } else {
                ress += `<div class="mc-cost-val mc-cost-val-unused">
                            <p>属性` + (i + 1) + `</p>
                            <p>/</p>
                            <p>/</p>
                        </div>`;
            }
        }
        ress += `</div>`;
    });

    $(".mc-import-cost-list").html(ress);
}
