const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const I18n=require('../js/i18n.js');
const dictionaries=require('../js/i18n-dictionaries.js');
const keys=require('../js/stat-keys.js');
const {createAdapter}=require('../js/role-view-model.js');
const root=path.resolve(__dirname,'..');
const cases=[['zh-TW','zh-TW'],['zh-HK','zh-TW'],['zh-MO','zh-TW'],['zh-CN','zh-CN'],['zh-SG','zh-CN'],['en-US','en'],['en-GB','en'],['en','en'],['zh-Hant','zh-TW'],['zh-Hans','zh-CN'],['zh_HK','zh-TW'],['enough',null],['fr',null],['',null],['bad tag',null]];
cases.forEach(([tag,want])=>assert.equal(I18n.supported(tag),want));
assert.deepEqual(I18n.resolveLocale({manual:'en',url:'zh-CN',languages:['zh-TW']}),{locale:'en',source:'manual'});
assert.equal(I18n.resolveLocale({manual:'invalid',url:'zh-SG',languages:['en-US']}).locale,'zh-CN');
assert.equal(I18n.resolveLocale({languages:['fr-FR','en-US'],language:'zh-TW'}).locale,'en');
assert.equal(I18n.resolveLocale({languages:[],language:'zh-HK'}).locale,'zh-TW');
assert.equal(I18n.resolveLocale({url:'invalid',languages:['ja-JP']}).source,'fallback');
const store=new Map([['mcData','unchanged']]), writes=[];
const storage={getItem:k=>store.get(k),setItem:(k,v)=>{writes.push(k);store.set(k,v);}};
const doc={documentElement:{lang:'old'}};
const i18n=I18n.create({storage,document:doc,url:'/?lang=zh-CN',languages:['en-US']});
assert.equal(i18n.locale,'zh-CN');assert.equal(doc.documentElement.lang,'zh-CN');assert.equal(writes.length,0);
let changes=0;const unsubscribe=i18n.subscribe(state=>{changes++;assert.equal(state.locale,doc.documentElement.lang);});
assert.equal(i18n.setLocale('en').persisted,true);
assert.equal(doc.documentElement.lang,'en');assert.equal(changes,1);
assert.equal(i18n.t('stats.crit_rate'),'CRIT Rate');
assert.equal(i18n.t('analysis.inspect',{position:3}),'Inspect slot 3');
assert.equal(I18n.create({storage,url:'/?lang=zh-CN',languages:['zh-TW']}).locale,'en');
unsubscribe();i18n.setLocale('zh-TW');assert.equal(changes,1);
assert.deepEqual([...new Set(writes)],[I18n.STORAGE_KEY]);assert.equal(store.get('mcData'),'unchanged');
assert.throws(()=>i18n.setLocale('fr'),RangeError);
const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
const unavailable=I18n.create({storage:blocked,languages:['zh-SG']});
assert.equal(unavailable.locale,'zh-CN');assert.equal(unavailable.setLocale('en').persisted,false);assert.equal(unavailable.locale,'en');
const env={document:doc,navigator:{languages:['en-GB']},location:{href:'https://example.test/?lang=zh-TW'}};
Object.defineProperty(env,'localStorage',{get(){throw Error('blocked');}});
assert.equal(I18n.createBrowser(env).locale,'zh-TW');

// 三语 key 和插值参数必须一致，缺失文案回退到繁体中文。
const allKeys=Object.keys(dictionaries['zh-TW']).sort();
for(const locale of ['zh-CN','en']) {
    assert.deepEqual(Object.keys(dictionaries[locale]).sort(),allKeys);
    for(const key of allKeys)assert.deepEqual((dictionaries[locale][key].match(/\{\w+\}/g)||[]).sort(),(dictionaries['zh-TW'][key].match(/\{\w+\}/g)||[]).sort());
}
for(const key of Object.values(keys.legacyToKey))assert.ok(allKeys.includes('stats.'+key));
const fallback=I18n.create({languages:['en'],messages:{en:{},'zh-TW':{'test.key':'測試 {n}'}}});
assert.equal(fallback.t('test.key',{n:1}),'測試 1');assert.equal(fallback.t('missing.key'),'[missing.key]');
assert.equal(i18n.entity('echoes',999,'原始名称'),'原始名称');

// 百分比与百分点使用不同入口，原始数值保持不变。
for(const locale of ['zh-TW','zh-CN','en']) {
    i18n.setLocale(locale);
    assert.equal(i18n.format.percentage(6.3),new Intl.NumberFormat(locale,{style:'percent',maximumFractionDigits:1}).format(.063));
    assert.ok(i18n.format.percentagePoint(6.3).includes('+6.3'));
    assert.ok(i18n.format.score(2.8).includes('2.80'));
    assert.equal(i18n.format.integer(12345),new Intl.NumberFormat(locale,{maximumFractionDigits:0}).format(12345));
    assert.equal(i18n.format.decimal(12.345),new Intl.NumberFormat(locale,{maximumFractionDigits:2}).format(12.345));
    assert.equal(i18n.format.dateTime('2026-10-08T00:00:00Z',{timeZone:'UTC'}),new Intl.DateTimeFormat(locale,{dateStyle:'medium',timeStyle:'short',timeZone:'UTC'}).format(new Date('2026-10-08T00:00:00Z')));
    for(const n of [null,undefined,NaN,Infinity,'6.3%'])assert.equal(i18n.format.percentage(n),'—');
    for(const date of [null,undefined,'invalid',{},true,Symbol('invalid')])assert.equal(i18n.format.dateTime(date),'—');
}

// 语言切换仅影响显示，转换结果与存档都不能变化。
const ctx={$:()=>{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'js/base.js'),'utf8')+'\n;globalThis.api={roleList,costList,suiteAttributeMap,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection};',ctx);
const normalize=createAdapter(ctx.api);
const source={roleId:1,roleListId:1,ming:0,costList:[{costId:2,costListId:59,type:'Cost4',mainAtrri:'暴击22%',suite:'光套',propertyList:[{property:'暴击',value:'6.3%'},{property:'小防御',value:'50'}]}]};
const original=JSON.stringify(source), before=JSON.stringify(normalize(source));
const fullSource=JSON.parse(JSON.stringify(source));
fullSource.costList=[['Cost4','暴击22%'],['Cost3','属伤30%'],['Cost3','属伤30%'],['Cost1','攻击18%'],['Cost1','攻击18%']].map(([type,mainAtrri],i)=>({
    costId:100+i,type,mainAtrri,propertyList:[{property:'暴击',value:'6.3%'},{property:'暴伤',value:'12.6%'},{property:'共鸣效率',value:'8.4%'},{property:'技能伤害',value:'7.9%'},{property:'小防御',value:'50'}]
}));
const fullBefore=JSON.stringify(normalize(fullSource));
assert.ok(Number.isFinite(normalize(fullSource).summary.score));
for(const locale of ['zh-TW','zh-CN','en']) {
    i18n.setLocale(locale);assert.equal(JSON.stringify(normalize(source)),before);assert.equal(JSON.stringify(source),original);
    assert.equal(JSON.stringify(normalize(fullSource)),fullBefore);
    const result=normalize(source), stat=result.slots[0].echo.substats[0];
    assert.equal(stat.key,'crit_rate');assert.equal(stat.property,undefined);assert.equal(stat.unit,'percent');assert.equal(typeof stat.value,'number');
    assert.equal(result.role.nameKey,'characters.1');assert.equal(result.slots[0].echo.nameKey,'echoes.59');assert.equal(result.slots[0].echo.suite.nameKey,'sets.5');
    result.issues.forEach(issue=>assert.notEqual(i18n.t('issues.'+issue.code,issue.params),'[issues.'+issue.code+']'));
}
const browser={};
Object.defineProperty(browser,'document',{get(){throw Error('automatic DOM access');}});
for(const file of ['i18n-dictionaries.js','i18n.js','stat-keys.js','role-view-model.js'])vm.runInNewContext(fs.readFileSync(path.join(root,'js',file),'utf8'),browser);
assert.equal(typeof browser.EchoI18n.create,'function');assert.equal(typeof browser.RoleViewModel.createAdapter,'function');
console.log(`PASS: locale precedence/mapping, persistence and blocked storage, lang/subscriptions, ${allKeys.length} matching trilingual keys, Intl formatters, neutral view model and score/save invariance.`);
