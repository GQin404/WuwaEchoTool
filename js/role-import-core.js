/* 导入转换与传输由两种 presentation 共用，不接触页面节点。 */
(function(root){
function convertPhantomData(ycost, curRole, api, now=Date.now()) {
    let newCost = {
        "costId": now + ycost.phantomProp.phantomPropId,
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
    newCost.sumScores = api.countMainAttr2(newCost, curRole);
    newCost.sumScores = parseFloat(newCost.sumScores) + parseFloat(api.sumCostScores(newCost, curRole));
    newCost.sumScores = newCost.sumScores.toFixed(2);
    return newCost;
}


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

root.RoleImportCore={convertPhantomData,guifan};
})(typeof globalThis!=='undefined'?globalThis:this);
