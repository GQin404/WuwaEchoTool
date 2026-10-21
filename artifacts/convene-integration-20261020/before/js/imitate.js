//当前正在被编辑的声骸
var currentCost = {
    "sumScore": 0,
    "propertyList": []
}
var tempurl = null;
//模拟词条库
var monick = [
    {"property": "暴击", "value": 0},
    {"property": "暴伤", "value": 1},
    {"property": "大攻击", "value": 2},
    {"property": "小攻击", "value": 6},
    {"property": "小生命", "value": 5},
    {"property": "小防御", "value": 7},
    {"property": "共鸣效率", "value": 4},
    {"property": "大防御", "value": 3},
    {"property": "大生命", "value": 2},
    {"property": "普攻伤害", "value": 2},
    {"property": "重击伤害", "value": 2},
    {"property": "技能伤害", "value": 2},
    {"property": "解放伤害", "value": 2}
]
$(function () {
    if(window.UiView?.redirecting)return;
    //初始化声骸选单默认加载Cost4
    loadCost("Cost4");
    //重新过滤Cost
    $("#mc-filter-value").change(() => {
        loadCost($(this).find("option:selected").val());
    });
    $("#mc-addcost").on("click", ".mcccost-reset", function () {
        $(".mcccost-reset").removeClass("mc-active");
        $(this).addClass("mc-active");
        tempurl = $(this).attr("imgcode");
    });
    $("#qd-btn2").click(() => {
        if (tempurl == null) {
            alert("请选择一个声骸。");
        } else {
            $("#shimg01").attr("src",  tempurl );
            $("#mc-addcost").modal("hide");
        }
    });

    //点击随机开启副词条
    $("#mc-kqct").click(() => {
        if (currentCost.propertyList.length > 4) {
            alert("词条已满5个，请重置再试");
            return;
        }
        const next=EchoToolCore.roll(currentCost.propertyList,fctValue);
        if(next){currentCost.propertyList.push(next);renderList(null,null);}
    });
    $("#mc-czct").click(() => {
        if (confirm("确定要重置吗？")) {
            currentCost.propertyList = [];
            renderList(null, null);
        }
    });
    //返回首页
    $(".mc-btn-backhome").click(() => {
        window.open("./index.html?view=classic", "_self");
    });
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
    if (currentCost.propertyList.length > 0) {
        currentCost.propertyList.forEach((item, index) => {
            res += `<tr>
                <th scope="row">` + (index + 1) + `</th>
                <td>` + item.property + `</td>
                <td>` + item.value + `</td>
            </tr>`;
        });
    } else {
        res = ` <tr>
                <td colspan="4">无副词条属性</td>
            </tr>`;
    }
    $("#chitiao-list").html(res);
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
    const result=EchoToolCore.probability(currentCost.propertyList);
    for(const [id,key] of [['bj','crit'],['bs','damage'],['gj','attack']]){const item=result[key];$('#gl-'+id).html(item.present?'已出':item.rounds.map((p,i)=>'('+(i+1)+')'+p.toFixed(2)+'% | ').join('')+'(总)'+item.total.toFixed(2)+'%');}
    $('#gl-sb').html(result.dual.present?'已达成':result.dual.total.toFixed(2)+'%');
    $('#gl-sf').html(result.defensive.toFixed(2)+'%');

}

//加载声骸选单-cst-Cost名例如Cost4
function loadCost(cst) {
    let rest = "";
    costList.forEach(item => {
        if (item.type === cst) {
            if(item.imgCode.length>6){
                rest += `<div imgcode="` + item.imgCode + `"  class="mc-cost-val mcccost-reset">
                            <img class="mc-cost-img" src="` + item.imgCode + `" alt="cost">
                        </div>`;
            }else{
                let gsxb = parseInt(item.imgCode)-1;
                rest += `<div imgcode="` + item.imgCode + `"  class="mc-cost-val mcccost-reset">
                            <img class="mc-cost-img" src="` + costList[gsxb].imgCode + `" alt="cost">
                        </div>`;
            }

        }
    });
    $('.mc-fillcost-list').html(rest);
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