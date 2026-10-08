const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const {createAdapter} = require('../js/role-view-model.js');
const forbidden = () => { throw new Error('Unexpected DOM/storage/alert access'); };
const context = {$:()=>{},alert:forbidden};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/base.js'),'utf8')+
    '\n;globalThis.api={roleList,costList,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection,recalculateMechanicRole,newCharacterModels};',context);
context.$ = forbidden;
Object.defineProperty(context,'document',{get:forbidden});
Object.defineProperty(context,'localStorage',{get:forbidden});
const api=context.api, normalize=createAdapter(api);
const clone=x=>JSON.parse(JSON.stringify(x));
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const near=(a,b)=>assert.ok(Math.abs(a-b)<.011,`${a} != ${b}`);
function fixture(id=1, imported=false) {
    const mains=[['Cost1','攻击18%','大攻击','18%'],['Cost4','暴击22%','暴击','22%'],['Cost3','共鸣效率32%','共鸣效率','32%'],['Cost3','属伤30%','属伤','30%'],['Cost1','生命22.8%','大生命','22.8%']];
    return {roleId:120,roleListId:id,isImport:imported,ming:0,totalScore:'999',costList:mains.map((m,i)=>({costId:500+i,costListId:[35,59,52,51,39][i],type:m[0],mainAtrri:imported?{property:m[2],value:m[3]}:m[1],sumScores:'999',suite:imported?'https://example.test/set.png':'光套',propertyList:[{property:'暴击',value:'6.3%'},{property:'暴伤',value:'12.6%'},{property:'共鸣效率',value:'8.4%'},{property:'技能伤害',value:'7.9%'},{property:'小防御',value:'50'}]}))};
}
const input=freeze(fixture()), before=JSON.stringify(input), out=normalize(input);
assert.equal(JSON.stringify(input),before);
assert.deepEqual(out.slots.map(s=>s.echo.id),[500,501,502,503,504]); // Deliberately not Cost sorted.
assert.equal(out.slots.length,5);
assert.equal(out.summary.status,'complete');
assert.notEqual(out.summary.score,999);
assert.equal(out.summary.cachedScore,999);
assert.equal(out.slots[0].echo.score.cached,999);
assert.equal(out.scale.shared,true);
assert.equal(out.scale.scope,'role-score-contribution');
assert.equal(out.slots[0].echo.mainStat.property,'大攻击');
assert.equal(out.slots[0].echo.mainStat.unit,'%');
assert.equal(out.slots[0].echo.substats[4].unit,'flat');
assert.equal(out.slots[0].echo.suite.name,'光套');
assert.equal(out.summary.substatTotals.find(s=>s.property==='共鸣效率').value,42);
assert.deepEqual(normalize(input),out); // Repeatable and independent of a selected slot.
out.slots[0].echo.substats[0].raw.value='changed';
out.model.configuration.weights.maxscore=-1;
assert.equal(JSON.stringify(input),before);
assert.ok(normalize(input).model.configuration.weights.maxscore>0);

let parityCases=0;
for(const id of [1,49,51,52,53,...api.newCharacterModels.ids]) {
    const modes=api.newCharacterModels.settings[id]?.modes.map(x=>x[0]) || (id===49?['tune','fusion']:id===53?['fusion','harmony']:[undefined]);
    for(const mode of modes) for(const chain of [0,3,6]) {
        const manual=fixture(id), imported=fixture(id,true);
        for(const role of [manual,imported]) Object.assign(role,{ming:chain,damageMode:mode,extraEnergy:25});
        const a=normalize(freeze(manual)), b=normalize(freeze(imported));
        near(a.summary.score,b.summary.score);
        a.slots.forEach((s,i)=>near(s.echo.score.value,b.slots[i].echo.score.value));
        const expected=clone(imported);
        if(id!==1){api.recalculateMechanicRole(expected);near(b.summary.score,Number(expected.totalScore));}
        else {
            let sum=manual.costList.reduce((v,c)=>v+Number(api.countMainAttr(c,manual))+c.propertyList.reduce((t,s)=>t+Number(api.countScores(s,manual)),0),0);
            sum+=api.getRoleEnergyCorrection(manual,74);
            near(a.summary.score,sum);
        }
        assert.equal(b.slots[0].echo.suite.name,null);
        parityCases++;
    }
}
const partial=fixture();partial.costList=partial.costList.slice(0,2);
assert.equal(normalize(partial).summary.score,null);
assert.equal(normalize(partial).slots[2].status,'empty');
assert.deepEqual(normalize(partial).summary.weakestPositions,[]);
const incomplete=fixture();incomplete.costList[2].propertyList.pop();
assert.equal(normalize(incomplete).summary.status,'incomplete');
assert.equal(normalize(incomplete).slots[2].echo.openedCount,4);
for(const bad of ['unknown99%','攻击18%garbage','']) {
    const r=fixture();r.costList[0].mainAtrri=bad;
    assert.equal(normalize(r).slots[0].echo.score.value,null);
    assert.equal(normalize(r).summary.score,null);
}
for(const bad of [{property:'未来词条',value:'1%'},{property:'暴击',value:'NaN'},{property:'小攻击',value:'15%'},{property:'暴击',value:-5}]) {
    const r=fixture();r.costList[0].propertyList[0]=bad;
    const v=normalize(r);assert.equal(v.slots[0].echo.substats[0].contribution,null);assert.equal(v.summary.score,null);
}
const numeric=fixture(1,true);numeric.costList[0].propertyList[0].value=6.3;
assert.equal(normalize(numeric).slots[0].echo.substats[0].value,6.3);
const tiny=fixture();tiny.costList[0].propertyList[0].value='0.0001%';
const tinySlot=normalize(tiny).slots[0].echo;
assert.equal(tinySlot.substats[0].contribution,0);
assert.equal(tinySlot.substats[0].scoreStatus,'positive');
assert.ok(tinySlot.effectiveCount>tinySlot.positiveContributionCount);
assert.equal(tinySlot.substats[4].scoreStatus,'not-scored');
const duplicate=fixture();duplicate.costList[1].costId=500;
assert.ok(normalize(duplicate).issues.some(x=>x.code==='duplicate-cost-id'));
const duplicateWord=fixture();duplicateWord.costList[0].propertyList[1]=clone(duplicateWord.costList[0].propertyList[0]);
assert.equal(normalize(duplicateWord).summary.score,null);
const extra=fixture();extra.costList.push(clone(extra.costList[0]));
assert.equal(normalize(extra).slots.length,5);assert.equal(normalize(extra).summary.score,null);
assert.ok(normalize(extra).issues.some(x=>x.code==='extra-slots'));
const wrongModel=fixture(9999);assert.equal(normalize(wrongModel).model.status,'unavailable');assert.equal(normalize(wrongModel).summary.score,null);
const badCost=fixture();badCost.costList[0].type='Cost9';assert.equal(normalize(badCost).summary.score,null);
const highCost=fixture();highCost.costList[0].type='Cost4';assert.ok(normalize(highCost).issues.some(x=>x.code==='cost-limit-exceeded'));
assert.equal(normalize({}).summary.score,null);
assert.equal(normalize({roleListId:1,costList:[]}).summary.score,null);
// Browser export works without DOM or loading any UI script.
const browser={};Object.defineProperty(browser,'document',{get:forbidden});Object.defineProperty(browser,'localStorage',{get:forbidden});
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/role-view-model.js'),'utf8'),browser);
assert.equal(typeof browser.RoleViewModel.createAdapter,'function');
console.log(`PASS: ${parityCases} real-model manual/import pairs; immutable inputs, stable slots, stale-cache replacement, missing/invalid data, unit separation and DOM/storage-free browser export.`);
