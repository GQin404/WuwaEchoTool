const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {createAdapter} = require('../js/role-view-model.js');
const controller = require('../js/role-register-controller.js');
const renderer = require('../js/role-register-renderer.js');
const i18n = require('../js/i18n.js');
const dictionaries = require('../js/i18n-dictionaries.js');
const read = name => fs.readFileSync(path.join(__dirname, '../js', name), 'utf8');
const clone = value => JSON.parse(JSON.stringify(value));
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < .000001, `${actual} != ${expected}`);

// 所有记录均为合成数据；只执行旧页函数，不运行初始化回调或访问真实存档。
function legacy(file) {
    const html = new Map(), writes = [];
    let node;
    node = new Proxy({}, {get: () => () => node});
    const context = {
        $: selector => typeof selector === 'function' ? undefined : new Proxy({}, {
            get: (_, key) => (...args) => {
                if (key === 'html' && args.length) html.set(selector, args[0]);
                return node;
            }
        }),
        alert: message => { throw Error(message); },
        console: {log() {}},
        localStorage: {setItem() { throw Error('Unexpected storage access'); }}
    };
    vm.runInNewContext(read('base.js') + '\n;globalThis.api={roleList,costList,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection};', context);
    vm.runInNewContext(read(file), context);
    context.getQueryString = () => null;
    context.saveDataToCache = data => writes.push(clone(data));
    return {context, html, writes};
}
const manualPage = legacy('mccost.js'), importedPage = legacy('mccost2.js');
const api = manualPage.context.api, normalize = createAdapter(api);

function fixture(id, imported, chain, mode, energy) {
    const mains = [
        ['Cost1', 35, '攻击18%', '大攻击', '18%'],
        ['Cost4', 59, '暴击22%', '暴击', '22%'],
        ['Cost3', 52, '共鸣效率32%', '共鸣效率', '32%'],
        ['Cost3', 51, '属伤30%', '属伤', '30%'],
        ['Cost1', 39, '生命22.8%', '大生命', '22.8%']
    ];
    return {
        roleId: 8001, roleListId: imported ? String(id) : id, isImport: imported,
        ming: chain, damageMode: mode, extraEnergy: energy, referenceHealth: 45000,
        totalScore: '999',
        costList: mains.map(([type, catalog, text, property, value], index) => ({
            costId: 1000 + index, costListId: imported ? 900000 + catalog : String(catalog),
            name: `Fixture Echo ${index + 1}`, imgCode: imported ? `https://example.test/echo-${catalog}.png` : String(catalog),
            type, suite: imported ? 'https://example.test/suite.png' : '光套',
            mainAtrri: imported ? {property, value} : text, sumScores: '999',
            propertyList: [
                {property: '暴击', value: '8.1%'}, {property: '暴伤', value: '16.2%'},
                {property: '共鸣效率', value: '8.4%'}, {property: '技能伤害', value: '7.9%'},
                {property: '小防御', value: '50'}
            ]
        }))
    };
}

let pairs = 0, localizedRenders = 0, corrections = 0;
for (const id of [1, 49, 51, 52, 53, ...api.newCharacterModels.ids]) {
    const modes = api.newCharacterModels.settings[id]?.modes.map(item => item[0]) || (id === 49 ? ['tune', 'fusion'] : id === 53 ? ['fusion', 'harmony'] : [undefined]);
    for (const mode of modes) for (let chain = 0; chain <= 6; chain++) for (const energy of [0, 200]) {
        const manual = fixture(id, false, chain, mode, energy), imported = fixture(id, true, chain, mode, energy);
        const before = JSON.stringify([manual, imported]);
        const a = normalize(manual), b = normalize(imported);
        assert.equal(a.summary.status, 'complete');
        assert.equal(b.summary.status, 'complete');
        near(a.summary.score, b.summary.score);

        const old = clone(manual);
        Object.assign(manualPage.context, {curRole: old, curData: {role: [old]}});
        manualPage.context.scoreAdjust();
        near(a.summary.score, Number(old.totalScore));
        assert.deepEqual(a.slots.map(slot => slot.echo.id), manual.costList.map(echo => echo.costId));
        assert.notDeepEqual(old.costList.map(echo => echo.costId), manual.costList.map(echo => echo.costId));
        let sum = 0;
        a.slots.forEach((slot, index) => {
            const echo = slot.echo, source = manual.costList[index];
            near(echo.score.value, Number(old.costList.find(item => item.costId === echo.id).sumScores));
            near(echo.score.value, b.slots[index].echo.score.value);
            assert.equal(echo.cost, Number(source.type.slice(4)));
            assert.equal(echo.effectiveCount, source.propertyList.filter(stat => api.getScoreDetails(stat, manual).rawScore > 0).length);
            echo.substats.forEach((stat, n) => near(stat.contribution, Number(api.countScores(source.propertyList[n], manual))));
            assert.equal(b.slots[index].echo.image, imported.costList[index].imgCode);
            sum += echo.score.value;
        });
        near(a.summary.energyCorrection, api.getRoleEnergyCorrection(manual, 74));
        near(a.summary.score, Number((sum + a.summary.energyCorrection).toFixed(2)));
        if (a.summary.energyCorrection !== 0) corrections++;

        // 导入页普通模型显示缓存；先核对过期缓存，再使用旧计算结果填充等价配置。
        const importedOld = clone(imported);
        Object.assign(importedPage.context, {curRole: importedOld, curData: {role: [importedOld]}});
        importedPage.context.randerCostList(importedOld.costList);
        if (id === 1) {
            assert.equal(importedOld.totalScore, '999');
            assert.ok(importedPage.html.get('.mc-cost-list2').includes('总999分'));
            importedOld.totalScore = old.totalScore;
            importedOld.costList.forEach(echo => { echo.sumScores = old.costList.find(item => item.costId === echo.costId).sumScores; });
            importedPage.context.randerCostList(importedOld.costList);
        }
        near(b.summary.score, Number(importedOld.totalScore));
        b.slots.forEach(slot => near(slot.echo.score.value, Number(importedOld.costList.find(echo => echo.costId === slot.echo.id).sumScores)));

        const c = controller.create(imported, normalize);
        c.select(3, c.snapshot().identities[3]);
        for (const locale of ['zh-TW', 'zh-CN', 'en']) {
            const state = c.snapshot(), rendered = renderer.render(state.model, i18n.create({language: locale}), {interaction: state});
            rendered.usedKeys.forEach(key => assert.ok(Object.hasOwn(dictionaries[locale], key), `${locale}: ${key}`));
            assert.equal((rendered.html.match(/class="rr-inline-analysis"/g) || []).length, 1);
            assert.equal(c.snapshot().selection.position, 3);
            assert.deepEqual(c.snapshot().model, b);
            localizedRenders++;
        }
        assert.equal(JSON.stringify([manual, imported]), before);
        pairs++;
    }
}
assert.ok(corrections > 0);
assert.ok(manualPage.writes.length > 0);
assert.ok(importedPage.writes.length > 0);
console.log(`PASS: ${pairs} synthetic manual/import pairs against legacy page functions; ${localizedRenders} localized selected renders; ${corrections} nonzero loadout corrections; stale caches and legacy sorting/writes isolated on copies.`);
