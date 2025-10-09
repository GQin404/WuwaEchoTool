//从缓存中取出该角色数据
var curRole;
var costid;
var curData;
//当前正在被编辑的声骸
var currentCost;
// 是否是声骸库的声骸
var isUnused = getQueryString("roleid") == 0;
let yct = {"property": "", "value": ""};
$(function () {
    //获取当前编辑角色ID
    roleid = getQueryString("roleid");
    //获取当前编辑声骸ID
    costid = getQueryString("costid");
    //从缓存取出角色数据
    curData = getDataFromCache("mcData");
    if (curData == null || roleid == null || costid == null) {
        alert("没有检查到历史数据或选择编辑的角色ID或声骸ID，请返回首页。");
        window.open("./index.html", "_self");
        return;
    } else {
        if (curData.role.length > 0 && !isUnused) {
            curData.role.forEach(item => {
                if (item.roleId == roleid) {
                    curRole = item;
                    curRole.costList.forEach(its => {
                        if (its.costId == costid) {
                            currentCost = its;
                            //初始化声骸头像
                            if(its.imgCode.length>6){
                                $("#shimg01").attr("src", its.imgCode);
                                $("#select-zhu-img").attr("src", its.imgCode);
                            }else{
                                let gsxb = parseInt(its.imgCode)-1;
                                $("#shimg01").attr("src", costList[gsxb].imgCode);
                                $("#select-zhu-img").attr("src", costList[gsxb].imgCode);
                            }

                            $("#mc-cost-level1").html(its.type);
                            if (its.type === "Cost3") {
                                $("#mc-cost-level2").html("巨浪级");
                            } else if (its.type === "Cost4") {
                                $("#mc-cost-level2").html("海啸级");
                            }
                        }
                    });
                }
            });
        } else if (isUnused) {
            let cost = curData.unusedEchoes.find(item => item.costId == costid);
            if (cost) {
                currentCost = cost;
                //初始化声骸头像
                if(currentCost.imgCode.length>6){
                    $("#shimg01").attr("src", currentCost.imgCode);
                    $("#select-zhu-img").attr("src", currentCost.imgCode);
                }else{
                    let gsxb = parseInt(currentCost.imgCode)-1;
                    $("#shimg01").attr("src", costList[gsxb].imgCode);
                    $("#select-zhu-img").attr("src", costList[gsxb].imgCode);
                }

                $("#mc-cost-level1").html(currentCost.type);
                if (currentCost.type === "Cost3") {
                    $("#mc-cost-level2").html("巨浪级");
                } else if (currentCost.type === "Cost4") {
                    $("#mc-cost-level2").html("海啸级");
                }
            }
        } else {
            alert("没有检查到历史数据或选择编辑的角色ID，请返回首页。");
            window.open("./index.html", "_self");
            return;
        }
    }

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
    //根据缓存保存的数据初始化页面
    loadMainPgAttri();
    //初始化副词条列表
    renderList(null, null);

    $(".mc-cost-addbtn").click(() => {
        $("#qd-btn5").addClass("mc-hide");
        $("#qd-btn3").removeClass("mc-hide");
    });
    //添加词条保存
    $('#qd-btn3').click(() => {
        if (currentCost.propertyList.length === 5) {
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
    $("#fct-list").on("click", ".mc-edit-fct", function () {
        //拿到原属性和值
        let sx = $(this).parent().attr("data-sx");
        let sxv = $(this).parent().attr("data-sxv");
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
    $("#fct-list").on("click", ".mc-del-fct", function () {
        //拿到属性和值
        let sx = $(this).parent().attr("data-sx");
        let sxv = $(this).parent().attr("data-sxv");
        if (confirm("确认要删除副词条【" + sx + "-" + sxv + "】吗？")) {
            currentCost.propertyList = currentCost.propertyList.filter(function (value) {
                return !(value.property === sx && value.value === sxv);
            });
            renderList(null, null);
        }
    });
    //保存主词条信息
    $('#qd-btn4').click(() => {
        //获取词条属性与值
        let sx = $("#mc-suite-name").val();
        let sxv = $("#mc-main-value").val();
        //保存数据值
        currentCost.suite = sx;
        currentCost.mainAtrri = sxv;
        //重新渲染计算
        randerMainAttri();
        $('#mc-addwords-main').modal('hide');
    });
    //保存声骸信息并返回上一页
    $(".mc-cost-savebtn").click(() => {
        if (!confirm("确定要保存吗？")) {
            return false;
        }
        if (isUnused) {
            curData.unusedEchoes.forEach((e, index) => {
                if (e.costId == currentCost.costId) {
                    curData.unusedEchoes[index] = currentCost;
                    saveDataToCache(curData);
                    window.open("./unusedEchoes.html", "_self");
                }
            })
        } else {
            let overOfen = 0;
            let totalScore = 0;
            if (curRole.costList.length > 0) {
                //先将Cost覆盖到角色对象
                curRole.costList.forEach((item, index) => {
                    if (item.costId == currentCost.costId) {
                        curRole.costList[index] = currentCost;
                    }
                });
                //计算共鸣效率溢出量
                curRole.costList.forEach(item => {
                    totalScore = parseFloat(totalScore) + parseFloat(item.sumScores);
                    if (item.propertyList.length > 0) {
                        if (item.mainAtrri === "共鸣效率32%") {
                            overOfen = parseFloat(overOfen) + 32;
                        }
                        item.propertyList.forEach(its => {
                            if (its.property === "共鸣效率") {
                                overOfen = parseFloat(overOfen) + parseFloat(its.value.replace("%", ""));
                            }
                        });
                    }
                });
            }
            //计算角色对象的声骸总分-溢出量
            if (parseFloat(overOfen) > ruleList[roleList[curRole.roleListId - 1].rule].defenseLimit) {
                //共鸣效率有溢出
                let ovf = (ruleList[roleList[curRole.roleListId - 1].rule].efficiency01 - ruleList[roleList[curRole.roleListId - 1].rule].efficiency02) * (ruleList[roleList[curRole.roleListId - 1].rule].defenseLimit - parseFloat(overOfen));
                ovf = parseFloat(ovf) * 100 / roleList[curRole.roleListId - 1].maxscore + parseFloat(totalScore);
                curRole.totalScore = ovf.toFixed(2);
            } else {
                //无溢出
                curRole.totalScore = totalScore.toFixed(2);
            }
            //将角色覆盖到mcData保存并返回
            curData.role.forEach((its, index) => {
                if (its.roleId == curRole.roleId) {
                    curData.role[index] = curRole;
                    saveDataToCache(curData);
                    window.open("./mccost.html?roleid=" + roleid, "_self");
                }
            });
        }
    });
    //删除声骸并返回上一页
    $(".mc-cost-delbtn").click(() => {
        // 创建自定义确认对话框
        let confirmDialog = $('<div class="modal fade" id="deleteConfirmModal" tabindex="-1">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<h5 class="modal-title">删除声骸</h5>' +
            '<button type="button" class="close" data-dismiss="modal">' +
            '<span>&times;</span>' +
            '</button>' +
            '</div>' +
            '<div class="modal-body">' +
            '<p>请选择如何处理该声骸：</p>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-secondary" id="cancelDelete">取消</button>' +
            (isUnused ? '' : '<button type="button" class="btn btn-primary" id="moveToUnused">移至声骸库</button>') +
            '<button type="button" class="btn btn-danger" id="permanentDelete">删除</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>');
        
        // 移除已存在的模态框（如果有）
        $('#deleteConfirmModal').remove();
        
        // 添加到页面并显示
        $('body').append(confirmDialog);
        $('#deleteConfirmModal').modal('show');
        
        // 取消按钮事件
        $('#cancelDelete').click(() => {
            $('#deleteConfirmModal').modal('hide');
        });
        
        // 永久删除按钮事件
        $('#permanentDelete').click(() => {
            if (!confirm("确定要永久删除该声骸吗？此操作不可恢复！")) {
                return false;
            }
            
            if (isUnused) {
                // 从unusedEchoes中删除
                curData.unusedEchoes = curData.unusedEchoes.filter(item => {
                    return item.costId != costid;
                });
                saveDataToCache(curData);
                $('#deleteConfirmModal').modal('hide');
                window.open("./unusedEchoes.html", "_self");
            } else {
                // 从角色声骸列表中移除
                curRole.costList = curRole.costList.filter(item => {
                    return item.costId != costid;
                });
                
                // 保存数据并返回
                curData.role.forEach((its, index) => {
                    if (its.roleId == curRole.roleId) {
                        curData.role[index] = curRole;
                        saveDataToCache(curData);
                        $('#deleteConfirmModal').modal('hide');
                        window.open("./mccost.html?roleid=" + roleid, "_self");
                    }
                });
            }
        });
        
        // 移至声骸库按钮事件（只在非unused时显示）
        if (!isUnused) {
            $('#moveToUnused').click(() => {
                // 找到要移动的声骸
                let costToMove = curRole.costList.find(item => item.costId == costid);
                
                if (costToMove) {
                    // 初始化unusedEchoes数组（如果不存在）
                    if (!curData.unusedEchoes) {
                        curData.unusedEchoes = [];
                    }
                    
                    // 将声骸添加到unusedEchoes
                    curData.unusedEchoes.push(costToMove);
                    
                    // 从角色声骸列表中移除
                    curRole.costList = curRole.costList.filter(item => {
                        return item.costId != costid;
                    });
                    
                    // 保存数据并返回
                    curData.role.forEach((its, index) => {
                        if (its.roleId == curRole.roleId) {
                            curData.role[index] = curRole;
                            saveDataToCache(curData);
                            $('#deleteConfirmModal').modal('hide');
                            window.open("./mccost.html?roleid=" + roleid, "_self");
                        }
                    });
                }
            });
        }
        
        // 模态框隐藏时清理
        $('#deleteConfirmModal').on('hidden.bs.modal', function () {
            $(this).remove();
        });
    });
    //返回首页
    $(".mc-btn-backhome").click(() => {
        window.open("./index.html", "_self");
    });
});

//根据当前声骸属性加载主属性图片及词条并计算总分
function loadMainPgAttri() {
    console.log("currentCost", currentCost);
    if (currentCost.imgCode !== null && currentCost.imgCode !== "") {
        //初始化左上角声骸图标
        if(currentCost.imgCode.length>6){
            $("#shimg01").attr("src", currentCost.imgCode);
        }else{
            let gsxb = parseInt(currentCost.imgCode)-1;
            $("#shimg01").attr("src", costList[gsxb].imgCode);
        }

        if (currentCost.type !== null && currentCost.type !== "") {
            let ress = "";
            zctValue.forEach(item => {
                if (item.type === currentCost.type) {
                    item.values.forEach((itm, index) => {
                        if (index === 0) {
                            ress += `<option selected value="` + itm + `">` + itm + `</option>`;
                        } else {
                            ress += `<option value="` + itm + `">` + itm + `</option>`;
                        }
                    });
                }
            });
            $("#mc-main-value").html(ress);
        }
        randerMainAttri();
    }
}

function randerMainAttri() {
    //将套装显示替换主属性值
    if (currentCost.mainAtrri !== null && currentCost.mainAtrri !== "") {
        $(".mc-set-tixing").css("display", "none");
        $(".mc-set-mainsx").removeClass("mc-hide");
        $("#zsx01").html(currentCost.mainAtrri);
        if (currentCost.type === "Cost1") {
            $("#zsx02").html("生命2280");
        } else if (currentCost.type === "Cost3") {
            $("#zsx02").html("攻击力100");
        } else if (currentCost.type === "Cost4") {
            $("#zsx02").html("攻击力150");
        }
        if (currentCost.suite !== null && currentCost.suite !== "") {
            let sxz = 0;
            switch (currentCost.suite) {
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
            $("#shimg02").attr("src", "image/attribute/" + sxz + ".png");
        }
    }
    if (!isUnused) {
        let score1 = countMainAttr(currentCost, curRole);
        score1 = parseFloat(score1);
        $("#zhupf").html(score1.toFixed(2));
        countTotalScores();
    }
}

//计算声骸总分数
function countTotalScores() {
    let s1 = $("#zhupf").html();
    let s2 = $("#listScore").html();
    if (typeof (s1) === "undefined") {
        s1 = 0;
    }
    if (typeof (s2) === "undefined") {
        s2 = 0;
    }
    let hjscore = parseFloat(s1) + parseFloat(s2);
    hjscore = hjscore.toFixed(2);
    currentCost.sumScores = hjscore;
    $("#zonpf").html(hjscore);
    //获取剩余期望得分
    let qwScore = $("#gl-ysqw").html();
    //加总得到期望总分
    hjscore = parseFloat(hjscore) + parseFloat(qwScore);
    $("#z-qw").html(hjscore.toFixed(2));
}

//加载渲染副词条列表,ct为新词条对象，yct为原词条
function renderList(ct, yct) {
    if (ct !== "" && ct != null && typeof (ct) != "undefined") {
        if (yct !== "" && yct != null && typeof (yct) != "undefined") {
            //原词条不为空，修改原词条
            currentCost.propertyList.forEach((item, index) => {
                if (item.property === yct.property && item.value === yct.value) {
                    //找到了该元素,覆盖原来的值
                    currentCost.propertyList[index].value = ct.value;
                    currentCost.propertyList[index].property = ct.property;
                }
            });
        } else {
            //原词条为null，默认为新增词条
            currentCost.propertyList.push(ct);
        }
    } else {
        //alert("传入的词条信息为空。");
        //直接重新加载
    }
    //重新加载该列表
    let res = "";
    let sumScore = 0;
    if (currentCost.propertyList.length > 0) {
        currentCost.propertyList.forEach((item, index) => {
            let sc = 0;
            console.log("isunused", isUnused);
            if (!isUnused) {
                
                sc = countScores(item, curRole);
                sumScore += parseFloat(sc);
            }
            
            let xh = index + 1;
            res += `<tr>
                <th scope="row">` + xh + `</th>
                <td>` + item.property + `</td>
                <td>` + item.value + `</td>
                <td>` + sc + `</td>
                <td data-sx="` + item.property + `" data-sxv="` + item.value + `"><a class="mc-edit-fct" href="javascript:void(0)">修改</a>|<a
                    class="mc-del-fct" href="javascript:void(0)">删除</a></td>
            </tr>`;
        });
        //合计计分
        res += `<tr>
            <th scope="row">+</th>
            <th></th>
            <th>计分合计：</th>
            <th id="listScore">` + sumScore.toFixed(2) + `</th>
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
                <th id="listScore">0.00</th>
                <th></th>
            </tr>`;
    }
    $("#chitiao-list").html(res);
    //初始化合计总得分
    countTotalScores();
    //词条概率计算
    countProbability();
}

//校验词条是否重复,name-词条名 true-重复
function checkRepeat(name) {
    let fl = false;
    currentCost.propertyList.forEach(item => {
        if (item.property === name) {
            fl = true;
        }
    });
    return fl;
}

//词条概率计算：
function countProbability() {
    let syqct = ["暴击", "暴伤", "大攻击", "小攻击", "大生命", "小生命", "大防御", "小防御", "共鸣效率", "普攻伤害", "重击伤害", "技能伤害", "解放伤害"];//剩余全词条
    let lastNum = 96;
    let sfcts = 28;//剩余可出生防数
    //0.总词条数104个，排除已出词条类的个数
    if (currentCost.propertyList.length > 0) {
        currentCost.propertyList.forEach(item => {
            syqct = syqct.filter(value => {
                return value !== item.property;
            });
            if (item.property === "暴击") {
                lastNum = lastNum - 8;
            } else if (item.property === "暴伤") {
                lastNum = lastNum - 8;
            } else if (item.property === "大攻击") {
                lastNum = lastNum - 8;
            } else if (item.property === "小防御") {
                sfcts = sfcts - 4;
                lastNum = lastNum - 4;
            } else if (item.property === "大防御") {
                sfcts = sfcts - 8;
                lastNum = lastNum - 8;
            } else if (item.property === "小生命") {
                sfcts = sfcts - 8;
                lastNum = lastNum - 8;
            } else if (item.property === "大生命") {
                sfcts = sfcts - 8;
                lastNum = lastNum - 8;
            } else if (item.property === "共鸣效率") {
                lastNum = lastNum - 8;
            } else if (item.property === "小攻击") {
                lastNum = lastNum - 4;
            } else {
                lastNum = lastNum - 8;
            }
        });
    }
    let bjzlv = 0;//出暴击总概率
    let bszlv = 0;//出暴伤总概率
    //1.计算剩余出暴击概率
    let wln = [];
    let res = "";
    let syfbjjd = 0;
    let gl = 0;
    if (!syqct.includes("暴击")) {
        $("#gl-bj").html("已出");
    } else {
        for (let i = 0; i < (5 - currentCost.propertyList.length); i++) {
            syfbjjd = lastNum * (syqct.length - i) / syqct.length;
            if (i === 0) {
                gl = backMaxNum("暴击") * 100 / syfbjjd;
                gl = gl.toFixed(2);
                bjzlv = parseFloat(bjzlv) + parseFloat(gl);
            } else if (i > 0) {
                //第二轮概率-剩余非暴击可能个数
                gl = backMaxNum("暴击") * 100 / syfbjjd;
                gl = gl.toFixed(2);
                if (i === 1) {
                    bjzlv = parseFloat(bjzlv) + (100 - wln[0]) * gl / 100;
                }
                if (i === 2) {
                    bjzlv = parseFloat(bjzlv) + (100 - wln[0]) * (100 - wln[1]) * gl / 10000;
                }
                if (i === 3) {
                    bjzlv = parseFloat(bjzlv) + (100 - wln[0]) * (100 - wln[1]) * (100 - wln[2]) * gl / 1000000;
                }
                if (i === 4) {
                    bjzlv = parseFloat(bjzlv) + (100 - wln[0]) * (100 - wln[1]) * (100 - wln[2]) * (100 - wln[3]) * gl / 100000000;
                }
            }
            res += "(" + (i + 1) + ")" + gl + "% | ";
            wln.push(gl);
        }
        res += "(总)" + bjzlv.toFixed(2) + "%";
        $("#gl-bj").html(res);
    }
    //2.计算剩余出爆伤概率
    if (!syqct.includes("暴伤")) {
        $("#gl-bs").html("已出");
    } else {
        wln = [];
        res = "";
        syfbjjd = 0;
        gl = 0;
        for (let i = 0; i < (5 - currentCost.propertyList.length); i++) {
            syfbjjd = lastNum * (syqct.length - i) / syqct.length;
            if (i === 0) {
                gl = backMaxNum("暴击") * 100 / syfbjjd;
                gl = gl.toFixed(2);
                bszlv = parseFloat(bszlv) + parseFloat(gl);
            } else if (i > 0) {
                //第二轮概率-剩余非暴击可能个数
                gl = backMaxNum("暴击") * 100 / syfbjjd;
                gl = gl.toFixed(2);
                if (i === 1) {
                    bszlv = parseFloat(bszlv) + (100 - wln[0]) * gl / 100;
                }
                if (i === 2) {
                    bszlv = parseFloat(bszlv) + (100 - wln[0]) * (100 - wln[1]) * gl / 10000;
                }
                if (i === 3) {
                    bszlv = parseFloat(bszlv) + (100 - wln[0]) * (100 - wln[1]) * (100 - wln[2]) * gl / 1000000;
                }
                if (i === 4) {
                    bszlv = parseFloat(bszlv) + (100 - wln[0]) * (100 - wln[1]) * (100 - wln[2]) * (100 - wln[3]) * gl / 100000000;
                }
            }
            res += "(" + (i + 1) + ")" + gl + "% | ";
            wln.push(gl);
        }
        res += "(总)" + bszlv.toFixed(2) + "%";
        $("#gl-bs").html(res);
    }
    //3.计算剩余出大攻击概率
    if (!syqct.includes("大攻击")) {
        $("#gl-gj").html("已出");
    } else {
        wln = [];
        res = "";
        syfbjjd = 0;
        gl = 0;
        let dgjzgl = 0;
        for (let i = 0; i < (5 - currentCost.propertyList.length); i++) {
            syfbjjd = lastNum * (syqct.length - i) / syqct.length;
            if (i === 0) {
                gl = backMaxNum("大攻击") * 100 / syfbjjd;
                gl = gl.toFixed(2);
                dgjzgl = parseFloat(dgjzgl) + parseFloat(gl);
            } else if (i > 0) {
                //第二轮概率-剩余非暴击可能个数
                gl = backMaxNum("大攻击") * 100 / syfbjjd;
                gl = gl.toFixed(2);
                if (i === 1) {
                    dgjzgl = parseFloat(dgjzgl) + (100 - wln[0]) * gl / 100;
                }
                if (i === 2) {
                    dgjzgl = parseFloat(dgjzgl) + (100 - wln[0]) * (100 - wln[1]) * gl / 10000;
                }
                if (i === 3) {
                    dgjzgl = parseFloat(dgjzgl) + (100 - wln[0]) * (100 - wln[1]) * (100 - wln[2]) * gl / 1000000;
                }
                if (i === 4) {
                    dgjzgl = parseFloat(dgjzgl) + (100 - wln[0]) * (100 - wln[1]) * (100 - wln[2]) * (100 - wln[3]) * gl / 100000000;
                }
            }
            res += "(" + (i + 1) + ")" + gl + "% | ";
            wln.push(gl);
        }
        res += "(总)" + dgjzgl.toFixed(2) + "%";
        $("#gl-gj").html(res);
    }
    //4双爆达成概率
    if (!syqct.includes("暴击") && !syqct.includes("暴伤")) {
        $("#gl-sb").html("已达成");
    } else {
        if (!syqct.includes("暴击")) {
            //暴击未达成
            $("#gl-sb").html(bszlv.toFixed(2) + "%");
        }
        if (!syqct.includes("暴伤")) {
            //暴伤未达成
            $("#gl-sb").html(bjzlv.toFixed(2) + "%");
        }
        //均未达成且空位>1
        if (syqct.includes("暴伤") && syqct.includes("暴击")) {
            if (currentCost.propertyList.length < 4) {
                let zgls = bszlv * bjzlv / 100;
                $("#gl-sb").html(zgls.toFixed(2) + "%");
            } else {
                $("#gl-sb").html("0.00%");
            }
        }

    }
    //5下次生防概率
    if (sfcts > 0) {
        let sfgl = sfcts * 100 / lastNum;
        $("#gl-sf").html(sfgl.toFixed(2) + "%");
    } else {
        $("#gl-sf").html("0.00%");
    }

    //6.得分期望，先计算剩余未开词条总得分
    let sumScoreR = 0;
    console.log("isunused", isUnused)
    fctValueHJ.forEach(item => {
        if (syqct.includes(item.property) && !isUnused) {
            sumScoreR = parseFloat(sumScoreR) + parseFloat(countScores(item, curRole));
        }
    });

    let sumP = sumScoreR * (5 - currentCost.propertyList.length) / lastNum;
    $("#gl-ysqw").html(sumP.toFixed(2));
    //获取已获得的总得分
    let alreadyScore = $("#zonpf").html();
    //加总得到期望总分
    sumP = sumP + parseFloat(alreadyScore);
    $("#z-qw").html(sumP.toFixed(2));
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