//当前正在被编辑的声骸
var currentCostA = {
    "sumScore": 0,
    "propertyList": []
}
var currentCostB = {
    "sumScore": 0,
    "propertyList": []
}
var lx = "A";
var currentRole = 0;
var tempRole = null;
let yct = {"property": "", "value": ""};
var curData;
var costid = 0;
var currentUnusedCostId = "000"; // 当前选中的未使用声骸ID
var currentImportTarget = "A"; // 当前导入目标：A 或 B
$(function () {
    curData = getDataFromCache("mcData");
    //初始化角色选单
    let roleRes = `<div class="mc-filter">角色过滤：
                        <select id="mc-filter-select" class="form-control mc-select">
                            <option value="s5" selected>五星角色</option>
                            <option value="s4">四星角色</option>
                        </select>
                    </div><div class="mc-filter-role5">`;
    let ress4 = `<div class="mc-filter-role4 mc-hide">`
    roleList.forEach(item => {
        if (item.star === 5) {
            roleRes += `<div data-role-val="` + item.id + `" class="mc-role ` + item.cls + `"></div>`;
        } else {
            ress4 += `<div data-role-val="` + item.id + `" class="mc-role ` + item.cls + `"></div>`;
        }
    });
    roleRes += "</div>";
    ress4 += "</div>";
    roleRes += ress4;
    //切换选择角色星级
    $(".modal-body-a").on("change", "#mc-filter-select", function () {
        if ($("#mc-filter-select option:selected").val() === "s5") {
            $(".mc-filter-role5").removeClass("mc-hide");
            $(".mc-filter-role4").addClass("mc-hide");
        } else {
            $(".mc-filter-role4").removeClass("mc-hide");
            $(".mc-filter-role5").addClass("mc-hide");
        }
    });
    $("#mc-addrole .modal-body-a").html(roleRes);
    $("#shimg").on("click", "#shimg01", function () {
        $("#mc-addrole").modal("show");
    });
    //点击添加角色
    $("#mc-addrole .mc-role").click(function () {
        $(".mc-role").removeClass("mc-active");
        $(this).addClass("mc-active");
        currentRole = $(this).attr("data-role-val");
    });

    //保存角色
    $('#qd-btn').click(() => {
        if (currentRole < 1) {
            alert("请先选择一个角色。");
            return;
        }
        // 执行确定按钮的操作,从角色JSON查出对应编号插入列表
        roleList.forEach(item => {
            if (item.id == currentRole) {
                //生成一个角色对象
                tempRole = {
                    "roleId": Date.now(),
                    "isImport": false,
                    "level": 0,
                    "roleListId": item.id,
                    "totalScore": 0.00,
                    "name": item.name,
                    "cls": item.cls.replace("mcr-", ""),
                    "dbCritNum": 0,
                    "attackNum": 0,
                    "costList": []
                }
                //将角色头像回显到左上角
                let rlItem = roleList.find(r => r.id == tempRole.roleListId);
                $("#shimg").html(`<img id="shimg01" class="mc-character-imgCost" src="image/characters/` + rlItem.cls.replace("mcr-", "") + `.png" alt="选择的角色">`);
                renderList(null, null);
                $(".mc-role-cel").addClass("mc-hide");
            }
        });
        $('#mc-addrole').modal('hide');
    });
    //下拉选择联动
    $("#mc-words-name").change(() => {
        let dqz = $(this).find("option:selected").val();
        let gzid = [];
        if (dqz == "暴击") {
            gzid = fctValue[0].values;
        }
        if (dqz == "暴伤") {
            gzid = fctValue[1].values;
        }
        if (dqz == "大攻击" || dqz == "大生命" || dqz == "普攻伤害" || dqz == "重击伤害" || dqz == "技能伤害" || dqz == "解放伤害") {
            gzid = fctValue[2].values;
        }
        if (dqz == "大防御") {
            gzid = fctValue[3].values;
        }
        if (dqz == "共鸣效率") {
            gzid = fctValue[4].values;
        }
        if (dqz == "小生命") {
            gzid = fctValue[5].values;
        }
        if (dqz == "小攻击") {
            gzid = fctValue[6].values;
        }
        if (dqz == "小防御") {
            gzid = fctValue[7].values;
        }
        //初始化联动select
        let ress = ``;
        gzid.forEach((item, index) => {
            if (index === 0) {
                ress += `<label class="radio-inline"> <input type="radio" name="mc-words-value" value="` + item + `"  checked="checked"> ` + item + ` </label>`;
            } else {
                ress += `<label class="radio-inline"> <input type="radio" name="mc-words-value" value="` + item + `"> ` + item + ` </label>`;
            }
        });
        $("#sx-value").html(ress);
    }).trigger("change");
    //清空添加副词条
    $(".mc-cost-addbtn1").click(() => {
        if(confirm("确定清空B声骸的词条吗？")){
            currentCostB.propertyList=[];
            let res = ` <tr>
                <th scope="row">1</th>
                <td colspan="4">无副词条属性</td>
            </tr>
            <tr>
                <th scope="row">+</th>
                <th></th>
                <th>计分合计：</th>
                <th id="listScoreB">0.00</th>
                <th></th>
            </tr>`;
            $("#chitiao-listB").html(res);
        }
    });
    //点击添加副词条
    $(".mc-cost-addbtn2").click(() => {
        lx = "A";
        if (tempRole == null || typeof (tempRole) === "undefined") {
            alert("因为计分与角色伤害分布关联，请先选择角色。");
            $("#mc-addrole").modal("show");
        } else {
            $("#mc-addwords").modal("show");
        }
        $("#qd-btn5").addClass("mc-hide");
        $("#qd-btn3").removeClass("mc-hide");
    });
    $(".mc-cost-addbtn3").click(() => {
        lx = "B";
        if (tempRole == null || typeof (tempRole) === "undefined") {
            alert("因为计分与角色伤害分布关联，请先选择角色。");
            $("#mc-addrole").modal("show");
        } else {
            $("#mc-addwords").modal("show");
        }
        $("#qd-btn5").addClass("mc-hide");
        $("#qd-btn3").removeClass("mc-hide");
    });
    //从角色声骸数据导入副词条
    $(".mc-cost-addbtn4").click(() => {
        lx = "A";
        if (tempRole == null || typeof (tempRole) === "undefined") {
            alert("因为计分与角色伤害分布关联，请先选择角色。");
            $("#mc-addrole").modal("show");
        } else {
            //初始化该角色下所有的声骸
            let rest = "";
            curData.role.forEach((item, index) => {
                if (item.roleListId == tempRole.roleListId) {
                    item.costList.forEach(its => {
                        if (its.imgCode.includes(".png")||its.imgCode.length>6) {
                            rest += `<div data-id="` + its.costId + `" class="mc-cost-val mcccost-reset">
                                <img class="mc-cost-img" src="` + its.imgCode + `" alt="cost">
                            </div>`;
                        } else {
                            let gsxb = parseInt(its.imgCode)-1;
                            rest += `<div data-id="` + its.costId + `" class="mc-cost-val mcccost-reset">
                                <img class="mc-cost-img" src="` + costList[gsxb].imgCode + `" alt="cost">
                            </div>`;
                        }

                    });
                }
            });
            if (rest === "") {
                alert("没有查到该角色的声骸。");
            } else {
                $(".modal-body-c").html(rest);
                $("#mc-addcost").modal("show");
            }
        }
    });

    //从声骸库导入声骸A词条
    $(".mc-cost-addbtn5").click(() => {
        currentImportTarget = "A";
        if (tempRole == null || typeof (tempRole) === "undefined") {
            alert("因为计分与角色伤害分布关联，请先选择角色。");
            $("#mc-addrole").modal("show");
        } else {
            renderUnusedCostList();
            $("#mc-import-from-unused").modal("show");
        }
    });

    //从声骸库导入声骸B词条
    $(".mc-cost-addbtn6").click(() => {
        currentImportTarget = "B";
        if (tempRole == null || typeof (tempRole) === "undefined") {
            alert("因为计分与角色伤害分布关联，请先选择角色。");
            $("#mc-addrole").modal("show");
        } else {
            renderUnusedCostList();
            $("#mc-import-from-unused").modal("show");
        }
    });

    //未使用声骸过滤
    $("#mc-unused-filter-value").change(function () {
        renderUnusedCostList($(this).find("option:selected").val());
    });

    //选择未使用的声骸
    $(document).on("click", ".mc-unused-cost-list .mc-cost-list", function () {
        $(".mc-unused-cost-list .mc-cost-list").removeClass("mc-active");
        $(this).addClass("mc-active");
        currentUnusedCostId = $(this).attr("data-id");
    });

    //确认导入未使用声骸的词条
    $('#unused-qd-btn').click(() => {
        if (currentUnusedCostId === "000") {
            alert("请先选择一个声骸。");
            return;
        }

        // 找到选中的未使用声骸
        let selectedCost = null;
        if (curData.unusedEchoes && curData.unusedEchoes.length > 0) {
            selectedCost = curData.unusedEchoes.find(item => item.costId == currentUnusedCostId);
        }

        if (!selectedCost) {
            alert("未找到选中的声骸。");
            return;
        }

        // 导入词条到对应的声骸
        if (currentImportTarget === "A") {
            currentCostA.propertyList = [...selectedCost.propertyList];
        } else {
            currentCostB.propertyList = [...selectedCost.propertyList];
        }

        // 重新渲染列表并计算分数
        lx = currentImportTarget;
        renderList(null, null);
        
        // 隐藏模态框
        $('#mc-import-from-unused').modal('hide');
        
        // 重置选择
        currentUnusedCostId = "000";
    });

    $("#mc-addcost .modal-body-c").on("click", ".mc-cost-val", function () {
        $(".mc-cost-val").removeClass("mc-active");
        $(this).addClass("mc-active");
        costid = $(this).attr("data-id");
    });
    //导入选择的声骸副词条
    $('#qd-btn2').click(() => {
        //拿到副词条数组
        curData.role.forEach(item => {
            if (item.roleListId == tempRole.roleListId) {
                item.costList.forEach(its => {
                    if (parseInt(its.costId) === parseInt(costid)) {
                        currentCostA.propertyList = its.propertyList;
                    }
                });
            }
        });
        if (currentCostA.propertyList.length > 0) {
            renderList(null, null);
        } else {
            alert("查询到该声骸下副词条为空。")
        }
        $('#mc-addcost').modal('hide');
    });
    //添加词条保存
    $('#qd-btn3').click(() => {
        if ((lx === "A" && currentCostA.propertyList.length === 5) || (lx === "B" && currentCostB.propertyList.length === 5)) {
            $("#mc-addwords").modal("hide");
            alert("副词条已满5条，请尝试修改或删除。");
            return;
        }
        //获取词条属性与值
        let sx = $("#mc-words-name").val();
        let sxv = $("#sx-value input[name='mc-words-value']:checked").val();
        if (checkRepeat(sx)) {
            alert("已选择了相同属性，不允许重复");
        } else {
            renderList({"property": sx, "value": sxv}, null);
        }
        $('#mc-addwords').modal('hide');
    });
    //修改词条
    $(".table-striped").on("click", ".mc-edit-fct", function () {
        //拿到原属性和值
        let sx = $(this).parent().attr("data-sx");
        let sxv = $(this).parent().attr("data-sxv");
        lx = $(this).parent().attr("data-lx");
        $("#qd-btn3").addClass("mc-hide");
        $("#qd-btn5").removeClass("mc-hide");
        $("#mc-words-name").val(sx).trigger("change");
        $("#sx-value input[name='mc-words-value'][value='" + sxv + "']").prop('checked', true);
        yct.property = sx;
        yct.value = sxv;
        $('#mc-addwords').modal('show');
    });
    //修改保存词条
    $('#qd-btn5').click(() => {
        //获取新词条属性与值
        let sx = $("#mc-words-name").val();
        let sxv = $("#sx-value input[name='mc-words-value']:checked").val();
        //原词条没变或不重复
        if (sx === yct.property || !checkRepeat(sx)) {
            renderList({"property": sx, "value": sxv}, yct);
        } else {
            alert("属性重复。");
            return;
        }
        $('#mc-addwords').modal('hide');
    });

    //删除词条
    $(".table-striped").on("click", ".mc-del-fct", function () {
        //拿到属性和值
        let sx = $(this).parent().attr("data-sx");
        let sxv = $(this).parent().attr("data-sxv");
        lx = $(this).parent().attr("data-lx");
        if (confirm("确认要删除副词条【" + sx + "-" + sxv + "】吗？")) {
            if (lx === "A") {
                currentCostA.propertyList = currentCostA.propertyList.filter(function (value) {
                    return !(value.property === sx && value.value === sxv);
                });
            } else {
                currentCostB.propertyList = currentCostB.propertyList.filter(function (value) {
                    return !(value.property === sx && value.value === sxv);
                });
            }
            renderList(null, null);

        }
    });

    //返回首页
    $(".mc-btn-backhome").click(() => {
        window.open("./index.html", "_self");
    });
});

//加载渲染副词条列表,ct为新词条对象，yct为原词条
function renderList(ct, yct) {
    if (ct !== "" && ct != null && typeof (ct) != "undefined") {
        if (yct !== "" && yct != null && typeof (yct) != "undefined") {
            //原词条不为空，修改原词条
            if (lx === "A") {
                currentCostA.propertyList.forEach((item, index) => {
                    if (item.property === yct.property && item.value === yct.value) {
                        //找到了该元素,覆盖原来的值
                        currentCostA.propertyList[index].value = ct.value;
                        currentCostA.propertyList[index].property = ct.property;
                    }
                });
            } else {
                currentCostB.propertyList.forEach((item, index) => {
                    if (item.property === yct.property && item.value === yct.value) {
                        //找到了该元素,覆盖原来的值
                        currentCostB.propertyList[index].value = ct.value;
                        currentCostB.propertyList[index].property = ct.property;
                    }
                });
            }

        } else {
            //原词条为null，默认为新增词条
            if (lx === "A") {
                currentCostA.propertyList.push(ct);
            } else {
                currentCostB.propertyList.push(ct);
            }
        }
    }
    //重新加载该列表
    let res = "";
    let sumScore = 0;
    let lsarr = currentCostA.propertyList;
    if (lx === "B") {
        lsarr = currentCostB.propertyList;
    }
    if (lsarr.length > 0) {
        lsarr.forEach((item, index) => {
            let sc = countScores(item, tempRole);
            sumScore += parseFloat(sc);
            let xh = index + 1;
            res += `<tr>
                <th scope="row">` + xh + `</th>
                <td>` + item.property + `</td>
                <td>` + item.value + `</td>
                <td>` + sc + `</td>
                <td data-sx="` + item.property + `" data-sxv="` + item.value + `" data-lx="` + lx + `"><a class="mc-edit-fct" href="javascript:void(0)">修改</a>|<a
                    class="mc-del-fct" href="javascript:void(0)">删除</a></td>
            </tr>`;
        });
        //合计计分
        res += `<tr>
            <th scope="row">+</th>
            <th></th>
            <th>计分合计：</th>
            <th id="listScore` + lx + `">` + sumScore.toFixed(2) + `</th>
            <th></th>
        </tr>`;
    } else {
        res = ` <tr>
                <th scope="row">1</th>
                <td colspan="4">无副词条属性</td>
            </tr>
            <tr>
                <th scope="row">+</th>
                <th></th>
                <th>计分合计：</th>
                <th id="listScore` + lx + `">0.00</th>
                <th></th>
            </tr>`;
    }
    if (lx === "A") {
        $("#chitiao-listA").html(res);
    } else {
        $("#chitiao-listB").html(res);
    }
    //进行比对
    compareCost();
}

//词条得分对比,
function compareCost() {
    let sa = $("#listScoreA").html();
    let sb = $("#listScoreB").html();
    if (sa === "" || sa == null) {
        sa = 0;
    }
    if (sb === "" || sb == null) {
        sb = 0;
    }
    let cz = sa - sb;
    cz = cz.toFixed(2);
    let res = "经过对比得出：";
    if (parseFloat(cz) > 0) {
        res += "选A---声骸A比声骸B的总得分高出【" + Math.abs(cz) + "】分，分值差距<1.5的情况下，优先满足暴击：暴伤=1：2，角色属伤过高的情况下，优先攻击力。";
    } else if (parseFloat(cz) == 0) {
        res += "声骸A与声骸B的总得分相等，优先满足暴击：暴伤=1：2，角色属伤过高的情况下，优先攻击力。";
    } else {
        res += "选B---声骸B比声骸A的总得分高出【" + Math.abs(cz) + "】分，分值差距<1.5的情况下，优先满足暴击：暴伤=1：2，角色属伤过高的情况下，优先攻击力。";
    }
    $(".mc-db-result").html(res);
}

//校验词条是否重复,name-词条名 true-重复
function checkRepeat(name) {
    let fl = false;
    let crrl = currentCostA.propertyList;
    if (lx === "B") {
        crrl = currentCostB.propertyList;
    }
    crrl.forEach(item => {
        if (item.property === name) {
            fl = true;
        }
    });
    return fl;
}

//传入词条名称，返回该词条总数值个数,mc-词条名称
function backMaxNum(mc) {
    if (mc === "小攻击" || mc === "小防御") {
        return 4;
    } else if (mc === "暴击" || mc === "暴伤" || mc === "大防御" || mc === "共鸣效率" || mc === "小生命") {
        return 8;
    } else {
        return 8;
    }
}

//渲染未使用声骸列表
function renderUnusedCostList(filterType = "all") {
    if (!curData.unusedEchoes || curData.unusedEchoes.length === 0) {
        $(".mc-unused-cost-list").html('<div class="mc-cost-list-null">声骸库为空。</div>');
        return;
    }

    let filteredList = curData.unusedEchoes;
    if (filterType !== "all") {
        filteredList = curData.unusedEchoes.filter(item => item.type === filterType);
    }

    if (filteredList.length === 0) {
        $(".mc-unused-cost-list").html('<div class="mc-cost-list-null">没有符合条件的声骸。</div>');
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
            let sxz = 0;
            switch (item.suite) {
                case "光套":
                    sxz = 5;
                    break;
                case "火套":
                    sxz = 2;
                    break;
                case "冰套":
                    sxz = 1;
                    break;
                case "暗套":
                    sxz = 6;
                    break;
                case "雷套":
                    sxz = 3;
                    break;
                case "风套":
                    sxz = 4;
                    break;
                case "奶套":
                    sxz = 7;
                    break;
                case "轻云套":
                    sxz = 8;
                    break;
                case "攻击套":
                    sxz = 9;
                    break;
                case "凌冽套":
                    sxz = 10;
                    break;
                case "此间套":
                    sxz = 11;
                    break;
                case "幽夜套":
                    sxz = 12;
                    break;
                case "高天套":
                    sxz = 13;
                    break;
                case "无惧套":
                    sxz = 14;
                    break;
                case "流云套":
                    sxz = 15;
                    break;
                case "愿戴套":
                    sxz = 16;
                    break;
                case "奔狼套":
                    sxz = 17;
                    break;
                case "失序套":
                    sxz = 18;
                    break;
                case "荣斗套":
                    sxz = 19;
                    break;
                case "息界套":
                    sxz = 20;
                    break;
                case "焚羽套":
                    sxz = 21;
                    break;
            }
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

    $(".mc-unused-cost-list").html(ress);
}