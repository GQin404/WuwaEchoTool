const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {estimate, components} = require('../scripts/character-chain-model.cjs');
const root = path.resolve(__dirname, '..');
const context = {$: () => {}};
vm.runInNewContext(fs.readFileSync(path.join(root, 'js/base.js'), 'utf8') +
    '\n;globalThis.api={roleList,ruleList,RoleSumProperty,getRoleScoreConfig,getRoleEnergyCorrection,countScores,countMainAttr,recalculateMechanicRole};', context);
const api = context.api;
const types = ['normal', 'heavy', 'skill', 'liberate', 'other'];
const close = (a, b, eps = 1e-5) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

function referenceScore(role) {
    const ref = api.RoleSumProperty[role.roleListId - 1].propertyList;
    const main = [['Cost4','暴击22%'], ['Cost3','属伤30%'], ['Cost3','属伤30%'], ['Cost1','攻击18%'], ['Cost1','攻击18%']];
    let score = main.reduce((s, [type, mainAtrri]) => s + Number(api.countMainAttr({type, mainAtrri}, role)), 0);
    score += ref.reduce((s, ct) => s + Number(api.countScores({property:ct.name, value:ct.property}, role)), 0);
    score += api.getRoleEnergyCorrection(role, parseFloat(ref.find(p => p.name === '共鸣效率').property));
    return score;
}

let cases = 0;
for (const id of [49, 51, 52, 53]) {
    const ref = api.RoleSumProperty[id - 1], base = api.roleList[id - 1];
    assert.equal(ref.mzProperty.length, 6);
    assert.equal(ref.mzRule.length, 6);
    for (const mode of (id === 49 ? ['tune','fusion'] : id === 53 ? ['fusion','harmony'] : ['fusion'])) {
        for (let chain = 0; chain <= 6; chain++) {
            const role = {roleListId:id, ming:String(chain), damageMode:mode};
            const config = api.getRoleScoreConfig(role);
            const expected = estimate(id, chain, api.ruleList[base.rule], ref.propertyList, mode);
            for (const type of types) close(config.weights[type], expected.weights[type]);
            close(config.weights.maxscore, expected.weights.maxscore);
            for (const key of ['attack01','attack02','crit','critDamage','property']) close(config.rule[key], expected.rule[key]);
            close(types.reduce((s, t) => s + config.weights[t], 0), 1);
            assert.ok(config.weights.maxscore > 0);
            close(referenceScore(role), 100, 0.08);
            assert.equal(Number(api.countScores({property:'重击伤害',value:'11.6%'}, role)), 0);
            cases++;
        }
    }
}
assert.equal(cases, 42);
// Invalid/legacy fields fall back safely, rather than indexing undefined chain data.
close(api.getRoleScoreConfig({roleListId:49}).weights.maxscore, api.roleList[48].maxscore);
assert.ok(Number.isFinite(api.getRoleScoreConfig({roleListId:53,ming:99,damageMode:'unknown'}).weights.maxscore));
// Same character has genuinely different mode profiles, including C6 extra burst packets.
for (const id of [49,53]) {
    const other = id === 49 ? 'tune' : 'harmony';
    assert.notEqual(api.getRoleScoreConfig({roleListId:id,ming:6,damageMode:'fusion'}).weights.other,
        api.getRoleScoreConfig({roleListId:id,ming:6,damageMode:other}).weights.other);
}
// C5 Aemeath supplies no sustained boss damage; C4 and C5 should match, not be interpolated.
assert.equal(JSON.stringify(api.RoleSumProperty[48].mzProperty[3]), JSON.stringify(api.RoleSumProperty[48].mzProperty[4]));
const special = components(49,6,'tune').find(p => p.anomaly);
close(special.damage, 15 * 3.4 / 2.2 * 1.7 * 2.4);
// Sigrika conversion: threshold, cap, external energy, and per-set rather than per-roll.
const sig = {roleListId:51,ming:6};
close(api.getRoleEnergyCorrection(sig,25),0);
assert.ok(api.getRoleEnergyCorrection(sig,37.2)>0);
const energyPoints = (role, e) => Number(api.countScores({property:'共鸣效率',value:String(e)},role)) + api.getRoleEnergyCorrection(role,e);
close(energyPoints(sig,50),energyPoints(sig,75),.02);
for (const extraEnergy of [0,10,25,40,50,75]) close(referenceScore({...sig,extraEnergy}),100,.08);
close(energyPoints({...sig,extraEnergy:50},40),0,.02);
// Hand-entered and imported main-stat representations must receive the same total.
for (const id of [49,51,52,53]) {
    const hand = {roleListId:id,ming:6,costList:[{type:'Cost3',mainAtrri:'共鸣效率32%',propertyList:[{property:'暴击',value:'10.5%'},{property:'解放伤害',value:'11.6%'}]}]};
    const imported = JSON.parse(JSON.stringify(hand));
    imported.costList[0].mainAtrri = {property:'共鸣效率',value:'32%'};
    api.recalculateMechanicRole(hand); api.recalculateMechanicRole(imported);
    close(Number(hand.totalScore),Number(imported.totalScore),.02);
    const prior = imported.totalScore; api.recalculateMechanicRole(imported); assert.equal(imported.totalScore,prior);
}
console.log('PASS: 42 chain/mode profiles, model parity, reference sets, mode separation, fixed crit, energy thresholds, legacy fields and import/manual parity.');
