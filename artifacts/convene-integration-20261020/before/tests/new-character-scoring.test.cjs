const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const {createNewCharacterModels} = require('../scripts/new-character-model.cjs');
const model = createNewCharacterModels();
const ctx = {$:()=>{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/base.js'),'utf8')+
    '\n;globalThis.api={roleList,RoleSumProperty,getRoleScoreConfig,countScores,countMainAttr,recalculateMechanicRole,getRoleEnergyCorrection,mappingRoleId};',ctx);
const api=ctx.api;
const near=(a,b,tolerance=.001)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
const score=(role,property,value)=>Number(api.countScores({property,value:String(value)},role));
let cases=0;
for(const id of model.ids) {
    assert.equal(api.RoleSumProperty[id-1].mzProperty.length,6);
    assert.equal(api.RoleSumProperty[id-1].mzRule.length,6);
    for(const [damageMode] of model.settings[id].modes) for(let ming=0;ming<=6;ming++) {
        const role={roleListId:id,ming,damageMode};
        const expected=model.profile(role), actual=api.getRoleScoreConfig(role);
        assert.deepEqual(JSON.parse(JSON.stringify(actual)),expected);
        near(['normal','skill','heavy','liberate','other'].reduce((s,k)=>s+actual.weights[k],0),1);
        assert.ok(actual.weights.maxscore>0);
        let mains=['暴击22%','属伤30%','属伤30%','攻击18%','攻击18%'];
        if(id===60||id===62) mains=['暴击22%','属伤30%','属伤30%','生命22.8%','生命22.8%'];
        if(id===60&&damageMode==='support') mains=['治疗26.4%','共鸣效率32%','共鸣效率32%','生命22.8%','生命22.8%'];
        const costList=mains.map((mainAtrri,i)=>({type:['Cost4','Cost3','Cost3','Cost1','Cost1'][i],mainAtrri,propertyList:[]}));
        // The reference is an aggregate benchmark; move substats into one entry for this arithmetic check.
        costList[0].propertyList=actual.reference.map(p=>({property:p.name,value:p.property}));
        const set={...role,costList};
        api.recalculateMechanicRole(set); near(Number(set.totalScore),100,.12);
        const previous=set.totalScore; api.recalculateMechanicRole(set); assert.equal(set.totalScore,previous);
        cases++;
    }
}
assert.equal(cases,91);
// Sex does not change Rover's score, and named main stats receive only their element's contribution.
for(let ming=0;ming<=6;ming++) for(const damageMode of ['quick','critical']) {
    assert.deepEqual(model.profile({roleListId:57,ming,damageMode}),model.profile({roleListId:58,ming,damageMode}));
}
const rover={roleListId:57,ming:6,damageMode:'critical'};
assert.ok(score(rover,'气动伤害',30)>0);
assert.equal(score(rover,'热熔伤害',30),0);
assert.equal(score({...rover,damageMode:'quick'},'气动伤害',30),0);
near(score(rover,'属伤',30),score(rover,'导电伤害',30));
for(const element of ['导电','气动','衍射','湮灭']) {
    const hand={...rover,costList:[{type:'Cost3',mainAtrri:element+'伤害30%',propertyList:[]}]};
    const imported={...rover,costList:[{type:'Cost3',mainAtrri:{property:element+'伤害',value:'30%'},propertyList:[]}]};
    api.recalculateMechanicRole(hand); api.recalculateMechanicRole(imported);
    assert.equal(hand.totalScore,imported.totalScore);
}
// Real classifications: converted heavies / liberation, guaranteed crit, and fixed anomaly crit.
assert.equal(score({roleListId:62,ming:6},'解放伤害',11.6),0);
assert.equal(score({roleListId:63,ming:6},'重击伤害',11.6),0);
assert.ok(model.packets({roleListId:59,ming:6}).find(p=>p.tag==='c6').guaranteed);
const xin5=model.packets({roleListId:63,ming:5,damageMode:'electro'}).find(p=>p.fixed);
const xin6=model.packets({roleListId:63,ming:6,damageMode:'electro'}).find(p=>p.fixed);
near(xin6.damage/xin5.damage,2.04);
assert.equal(score({roleListId:60},'暴击',10.5),0);
assert.ok(score({roleListId:60},'大生命',11.6)>0);
assert.ok(score({roleListId:60,damageMode:'damage'},'暴伤',21)>0);
assert.equal(model.packets({roleListId:60}).filter(p=>p.health).length,1);
// HP conversion must stop at 50k and include the 25k threshold; no DEF value for Jingran.
for(let ming=0;ming<=6;ming++) {
    const role={roleListId:62,ming};
    assert.ok(score({...role,referenceHealth:40000},'大生命',11.6)>0);
    assert.equal(score({...role,referenceHealth:50000},'大生命',11.6),0);
    assert.equal(score({...role,referenceHealth:60000},'小生命',580),0);
    assert.equal(score(role,'大防御',14.7),0);
    assert.ok(model.profile({...role,referenceHealth:25000}).rule.health01>model.profile({...role,referenceHealth:24900}).rule.health01);
}
// C1 Qingxiao's finite opening packet does not recur without C6.
assert.equal(model.packets({roleListId:61,ming:1}).some(p=>p.tag==='greatsword'),false);
assert.ok(model.packets({roleListId:61,ming:1,damageMode:'opening'}).some(p=>p.tag==='greatsword'));
assert.ok(model.packets({roleListId:61,ming:6}).some(p=>p.tag==='greatsword'));
for(const id of model.ids) assert.ok(Number.isFinite(api.getRoleScoreConfig({roleListId:id,ming:99,damageMode:'legacy'}).weights.maxscore));
for(const id of model.ids) assert.equal(api.mappingRoleId(999999,api.roleList[id-1].name),id);
assert.equal(api.mappingRoleId(999999,'漂泊者-女-导电'),57);
assert.equal(api.mappingRoleId(999999,'漂泊者-男-导电'),58);
assert.equal(api.mappingRoleId(999999,'漂泊者'),0); // Never guess sex/element from an ambiguous name.
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/role-import-core.js'),'utf8'),ctx);
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/mccost2.js'),'utf8')+'\n;globalThis.normalize=guifan;',ctx);
for(const element of ['导电','衍射','湮灭','气动','热熔','冷凝']) assert.equal(ctx.normalize(element+'伤害加成','30%'),element+'伤害');
console.log('PASS: 91 new chain/scenario profiles, reference scores, gender parity, mixed elements, fixed crit, HP caps, healing and import/manual parity.');
