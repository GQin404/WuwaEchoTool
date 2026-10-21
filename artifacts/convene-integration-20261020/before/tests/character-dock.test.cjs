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


const dock=require('../js/character-dock.js'),drafts=require('../js/role-draft-model.js'),candidates=require('../js/role-candidates.js');
const {createHash}=require('node:crypto');
const digest=async record=>createHash('sha256').update(drafts.canonical(record)).digest('hex');
(async()=>{
 const manual=fixture(1,false,0,undefined,0),imported=fixture(51,true,0,undefined,100);
 const before=JSON.stringify([manual,imported]);assert.equal(dock.select([manual,imported],[]),manual);assert.equal(dock.select([],[]),null);
 for(const [record,page] of [[manual,manualPage],[imported,importedPage]]){
  page.context.curRole=clone(record);page.context.curData={role:[page.context.curRole]};
  const n=page.writes.length;page.context.randerCostList(page.context.curRole.costList,false);assert.equal(page.writes.length,n);
  const model=normalize(record),baseline=drafts.createBaseline(model,{id:'base',createdAt:1,sourceRevision:await digest(record),modelVersion:'legacy-scoring-2026-10-08'});
  const adapter=candidates.createAdapter(normalize),slot=adapter.fromEditor(candidates.editor(model.slots[2].echo),record,'candidate');
  const candidate=drafts.createCandidate(slot.echo,{id:'candidate',source:'manual',sourceRevision:'r',identityScope:['candidate'],completeness:slot.status});
  const draft=drafts.createDraft(baseline,candidate,{id:'draft',targetSlot:3,createdAt:2});
  assert.equal((await dock.assess(record,baseline,draft,normalize,digest,3)).status,'valid');
  const edited=clone(record);edited.costList[2].propertyList[0].value='9.3%';
  assert.equal((await dock.assess(edited,baseline,draft,normalize,digest,3)).status,'stale');
  edited.ming=1;assert.equal((await dock.assess(edited,baseline,draft,normalize,digest,3)).status,'incompatible');
 }
 assert.equal(JSON.stringify([manual,imported]),before);
 console.log('PASS: Dock source selection, manual/import baseline resume, stale/model rejection and Classic initial rendering without persistence.');
})().catch(e=>{console.error(e);process.exitCode=1;});
