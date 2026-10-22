// Offline estimate model. Budgets are assumptions, not measured damage or official ratios.
// Sources, rotation assumptions and exclusions: docs/character-weights-51-53.md
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = ['normal', 'skill', 'heavy', 'liberate', 'other'];
const round = (n, digits = 6) => Number(n.toFixed(digits));
const expectedCrit = cd => 1 + 0.8 * (cd - 1);

function components(id, chain, mode = 'fusion') {
    const parts = [];
    let attack = 2.5, bonus = 2, cd = 2.8;
    const add = (type, budget, options = {}) => parts.push({type, budget, cd, attack, bonus, ...options});
    if (id === 49) {
        if (chain >= 4) bonus += 0.2;
        // Sustained rotation with the original passive already fully stacked.
        // C3 improves access to the passive, not an additional +60% CD on top of it.
        const liberation = chain >= 6 ? 1.4 : 1;
        add('normal', 8);
        add('skill', 2);
        add('liberate', 15 * liberation, {cd: cd + (chain >= 1 ? 3 : 0)});
        add('liberate', 25 * (chain >= 2 ? 2 : 1) * liberation);
        add('liberate', 5 * (chain >= 3 ? 1.4 : 1) * liberation);
        add('liberate', 25 * (chain >= 3 ? 2 : 1) * liberation);
        add('other', 5);
        const tracks = chain >= 6 ? 60 : 30;
        const fixedCrit = chain >= 6 ? 1 + 0.8 * (2.75 - 1) : 1;
        const special = mode === 'fusion'
            ? 25 * (1 + (chain >= 2 ? 4 : 2) + tracks * (chain >= 2 ? 0.15 : 0.1)) / 6
            : 15 * (1 + tracks * 0.04) / 2.2 * (chain >= 2 ? 1.7 : 1);
        // Fixed-crit/anomaly packets do NOT inherit the player's ATK/crit/element coefficients.
        add('other', special * fixedCrit, {anomaly: true});
    } else if (id === 51) {
        if (chain >= 4) attack += 0.2;
        const talent = chain >= 3 ? 2.2 / 1.6 : 1;
        // Same-level enemy, no other DEF ignore; 2/(2-0.3) is the assumed DEF ratio.
        const finalTalent = chain >= 6 ? (2.8 / 2.2) * (2 / 1.7) : 1;
        add('normal', 5);
        add('skill', 1);
        add('other', 16 * (chain >= 1 ? 1.7 : 1), {echo: true});
        add('other', 24 * talent * finalTalent, {echo: true});
        add('other', 36 * (chain >= 2 ? 2.2 : 1) * talent * finalTalent, {echo: true});
        add('other', 12 * (chain >= 5 ? 1.3 : 1), {echo: true});
        add('other', 6);
        // C6's common 30% amplification cancels out of proportions and stat sensitivity.
    } else if (id === 52) {
        if (chain >= 4) bonus += 0.2;
        if (chain >= 6) cd += 0.4;
        add('normal', 2);
        add('skill', 7 * (chain >= 5 ? 1.8 : 1));
        add('liberate', 15 * (chain >= 1 ? 2.2 : 1));
        add('liberate', 20 * (chain >= 2 ? 2.25 : 1));
        add('liberate', 16 * (chain >= 3 ? 2.6 : 1));
        add('liberate', 25, {cd: cd + (chain >= 6 ? 5 : 0)});
        add('liberate', 5);
        add('other', 2);
        // Two Snow Rust stacks throughout. Baseline 21 applications; C1 adds two.
        const applications = chain >= 1 ? 23 / 21 : 1;
        const anomaly = chain >= 3 ? (203.77 + 102 + 488) / (203.77 + 102) : 1;
        add('other', 8 * applications * anomaly, {anomaly: true});
    } else if (id === 53) {
        if (chain >= 1) cd += 0.3;
        if (chain >= 2 && mode === 'fusion') bonus += 0.5;
        if (chain >= 6) { attack += 0.6; bonus += 0.6; }
        add('normal', chain >= 3 ? 2 : 5);
        add('skill', 12 * (chain >= 2 ? 1.4 : 1));
        // C3: one full-core bubble per rotation, converted to liberation.
        // Assumed effective baseline rotation = 6000% ATK: +1200 points => +20 budget.
        add(chain >= 3 ? 'liberate' : 'skill', chain >= 3 ? 23 : 3);
        add('liberate', chain >= 3 ? 10 : 15); // Fewer filler attacks with +30 concerto.
        add('liberate', 20 * (chain >= 4 ? 4 / 3 : 1));
        add('liberate', 10 * (chain >= 5 ? 2 : 1));
        add('liberate', 30 * (chain >= 3 ? 1.8 : 1));
        add('other', 5);
        // One C6 empowered burst per rotation. Its 12 budget is an explicit scenario estimate.
        if (chain >= 6 && mode === 'fusion') add('other', 12, {anomaly: true});
    } else {
        throw new Error('Unsupported role: ' + id);
    }
    return parts.map(p => ({...p, damage: p.anomaly ? p.budget :
        p.budget * (p.attack / 2.5) * (p.bonus / 2) * expectedCrit(p.cd) / expectedCrit(2.8)}));
}

function sensitivity(parts) {
    const total = parts.reduce((sum, p) => sum + p.damage, 0);
    const weighted = f => parts.reduce((sum, p) => sum + (p.anomaly ? 0 : p.damage * f(p)), 0) / total;
    return {
        attack: weighted(p => 1 / p.attack),
        property: weighted(p => 1 / p.bonus),
        crit: weighted(p => (p.cd - 1) / expectedCrit(p.cd)),
        critDamage: weighted(p => 0.8 / expectedCrit(p.cd))
    };
}

function estimate(id, chain, baseRule, reference, mode = 'fusion') {
    const parts = components(id, chain, mode);
    const total = parts.reduce((sum, p) => sum + p.damage, 0);
    const weights = Object.fromEntries(types.map(type => [type,
        round(parts.filter(p => p.type === type).reduce((sum, p) => sum + p.damage, 0) / total)]));
    weights.other = round(1 - types.slice(0, 4).reduce((sum, k) => sum + weights[k], 0));
    weights.anomalyShare = round(parts.filter(p => p.anomaly).reduce((sum, p) => sum + p.damage, 0) / total);
    if (id === 51) weights.echoSkillShare = round(parts.filter(p => p.echo).reduce((sum, p) => sum + p.damage, 0) / total);
    const zero = sensitivity(components(id, 0, id === 49 ? 'tune' : 'fusion')), cur = sensitivity(parts);
    const rule = {...baseRule, ruleId: chain};
    if (id === 51) rule.defenseLimit = 50;
    for (const [key, stat] of [['attack01','attack'], ['attack02','attack'], ['property','property'], ['crit','crit'], ['critDamage','critDamage']]) {
        rule[key] = round(baseRule[key] * cur[stat] / zero[stat]);
    }
    // Keep existing energy heuristic; concerto energy is not liberation energy.
    const coefficients = {
        '暴击':rule.crit, '暴伤':rule.critDamage, '大攻击':rule.attack01, '小攻击':rule.attack02,
        '共鸣效率':rule.efficiency01, '普攻伤害':weights.normal * rule.unike,
        '技能伤害':weights.skill * rule.unike, '重击伤害':weights.heavy * rule.unike,
        '解放伤害':weights.liberate * rule.unike
    };
    const main = 22 * rule.crit + 60 * rule.property + 36 * rule.attack01 + 350 * rule.attack02;
    const passive = id === 51 ? 2 * weights.echoSkillShare * rule.property * (37.2 - 25) : 0;
    weights.maxscore = round(main + reference.reduce((sum, p) => sum + parseFloat(p.property) * (coefficients[p.name] || 0), 0) + passive, 4);
    return {weights, rule};
}

function loadData() {
    const context = {$: () => {}};
    vm.runInNewContext(fs.readFileSync(path.join(root, 'js/base.js'), 'utf8') +
        '\n;globalThis.data = {roleList, ruleList, RoleSumProperty};', context);
    return context.data;
}

if (require.main === module) {
    const data = loadData();
    const result = {};
    for (const id of [49, 51, 52, 53]) {
        const role = data.roleList[id - 1];
        result[id] = {};
        for (const mode of (id === 49 ? ['tune', 'fusion'] : id === 53 ? ['fusion', 'harmony'] : ['fusion'])) {
            result[id][mode] = Array.from({length: 7}, (_, chain) => estimate(id, chain,
                data.ruleList[role.rule], data.RoleSumProperty[id - 1].propertyList, mode));
        }
    }
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
}

module.exports = {components, estimate, loadData};
