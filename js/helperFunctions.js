

//加载声骸选单-cst-Cost名例如Cost4
var loadCost = function loadCost(cst) {
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
var renderCostList = function renderCostList(list) {
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
    if (list != null && list.length > 0) {
        let ress = ""
        let ctz = "";
        let sbdc = 0;//双爆达成数量
        let gjdc = 0;//大攻击条数
        let sumFct = 0;//副词条总分
        list.forEach((item, index) => {
            ress += `<div data-id="` + item.costId + `" cost-id="` + item.costListId + `" class="mc-cost-list">
            <div class="mc-cost-val3">`;
            ress += `<span data-id="` + item.costId + `" class="mc-cost-delete">×</span>`;
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
                                <p>` + ctz + `</p>
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
                    //fcthj = parseFloat(fcthj) + parseFloat(countScores(item.propertyList[i], curRole));
                    if (item.propertyList[i].property === "暴击" || item.propertyList[i].property === "暴伤") {
                        ress += `<div class="mc-cost-val mc-cost-val-unused">
                                <p>属性` + (i + 1) + `</p>
                                <p class="mc-cost-jiaz mc-cost-red">` + jianhua(item.propertyList[i].property) + `</p>
                                <p class="mc-cost-jiaz mc-cost-red">` + item.propertyList[i].value + `</p>
                            </div>`;
                        lss = lss + 1;
                    } else if (item.propertyList[i].property === "大攻击" || item.propertyList[i].property === "小攻击") {
                        ress += `<div class="mc-cost-val mc-cost-val-unused">
                                <p>属性` + (i + 1) + `</p>
                                <p class="mc-cost-jiaz mc-cost-orange">` + jianhua(item.propertyList[i].property) + `</p>
                                <p class="mc-cost-jiaz mc-cost-orange">` + item.propertyList[i].value + `</p>
                            </div>`;
                        if (item.propertyList[i].property === "大攻击") {
                            gjdc = gjdc + 1;
                        }
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
    } else {
        countHJF(0, 0);
    }
    return;
}

//初始化声骸计分
function countHJF(sbz, gjz) {
    $("#sbz").html(sbz);
    $("#gjz").html(gjz);
    $("#zfz").html(0);
}

//简化中文字数
var jianhua = function jianhua(zt) {
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