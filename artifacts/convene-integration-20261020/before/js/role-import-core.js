/* 导入转换与传输由两种 presentation 共用，不接触页面节点。 */
(function(root){
function convertPhantomData(ycost, curRole, api, now) {
    if(!ycost?.phantomProp||!Array.isArray(ycost.mainProps)||![1,3,4].includes(Number(ycost.phantomProp.cost))||ycost.subProps!=null&&!Array.isArray(ycost.subProps))throw Error('INVALID_ECHO');
    const primary=ycost.mainProps[0],text=value=>typeof value==='string'||typeof value==='number'?String(value):null;
    let identity;
    if(now!==undefined)identity=now+ycost.phantomProp.phantomPropId; // explicit legacy fixture seed
    else {const bytes=new Uint32Array(2);root.crypto.getRandomValues(bytes);identity=(bytes[0]&0xffff)*4294967296+bytes[1];}
    const matches=api.catalog?.filter(e=>e.name===ycost.phantomProp.name&&e.type==='Cost'+ycost.phantomProp.cost);
    if(matches&&matches.length!==1)throw Error('UNKNOWN_ECHO');
    let newCost = {
        "costId": identity,
        "costListId": matches?.[0]?.id??ycost.phantomProp.phantomPropId,
        "gameEchoTypeId": ycost.phantomProp.phantomPropId,
        "name": ycost.phantomProp.name,
        "type": "Cost" + ycost.phantomProp.cost,
        "imgCode": ycost.phantomProp.iconUrl,
        "suite": ycost.fetterDetail?.iconUrl||null,
        "mainAtrri": primary?{
            "property": guifan(primary.attributeName === "攻击" ? "大攻击" : primary.attributeName, primary.attributeValue),
            "value": text(primary.attributeValue)
        }:null,
        "sumScores": 0,
        "propertyList": []
    }
    if (ycost.subProps != null && ycost.subProps.length > 0) {
        ycost.subProps.forEach(its => {
            //副词条转化
            newCost.propertyList.push({
                "property": guifan(its?.attributeName, its?.attributeValue),
                "value": text(its?.attributeValue)
            });
        });
    }
    // Incomplete fields remain explicit. The shared view adapter determines score availability;
    // this legacy cache is populated only when the existing scoring API accepts the data.
    try{
        const score=Number(newCost.mainAtrri?api.countMainAttr2(newCost,curRole):0)+Number(api.sumCostScores(newCost,curRole));
        newCost.sumScores=Number.isFinite(score)?score.toFixed(2):null;
    }catch(_){newCost.sumScores=null;}
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
        if (String(value).includes('%')) {
            return "大攻击";
        }
        return "小攻击";
    } else if (zt === "生命") {
        if (String(value).includes('%')) {
            return "大生命";
        }
        return "小生命";
    } else if (zt === "防御") {
        if (String(value).includes('%')) {
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
