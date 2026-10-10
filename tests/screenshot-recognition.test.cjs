const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Adapter=require('../js/screenshot-recognition-adapter.js'),Core=require('../js/character-core.js'),View=require('../js/role-view-model.js'),Candidates=require('../js/role-candidates.js');
const context={$:()=>{}};vm.runInNewContext(fs.readFileSync('js/base.js','utf8')+';globalThis.api={costList,roleList,suiteAttributeMap,fctValue,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection};',context);
const api=context.api,normalize=View.createAdapter(api),catalog=api.costList;
const lines=text=>text.split('\n').map(text=>({text,confidence:95}));
const nameAliases=require('../js/screenshot-name-aliases.js');
for(const [canonical,names] of Object.entries(nameAliases)){
 const entry=catalog.find(e=>e.name===canonical);assert.ok(entry);
 for(const name of names){const r=Adapter.parse(lines(name+' +25\nCOST '+entry.type.slice(4)),{catalog});assert.equal(r.catalogId,entry.id,name);assert.equal(catalog.find(e=>e.id===r.catalogId).name,canonical);}
}
assert.equal(Object.keys(nameAliases).length,185);
for(const [base,names] of Object.entries({atk:['攻击','攻擊','ATK'],def:['防御','防禦','DEF'],hp:['生命','生命值','HP']})){
 for(const name of names)for(const [value,key] of [['10.1%',base+'_percent'],['40',base+'_flat'],['10.1％',base+'_percent']]){const s=Adapter.stat({text:name+' '+value,confidence:95});assert.equal(s.key,key);assert.equal(s.value,parseFloat(value));}
}
assert.equal(Adapter.parse(lines('Unknown variant: Jué +25\nCOST 4'),{catalog}).catalogId,'');
assert.equal(Adapter.parse(lines('霽息獸尊・首 +25\nCOST 1'),{catalog}).catalogId,175);
assert.equal(Adapter.parse(lines('霽息獸尊・首 +25\nCOST 3'),{catalog}).catalogId,'');
const suggestion=Adapter.parse(lines('圳息獸尊・首 +25\nCOST 1'),{catalog});assert.equal(suggestion.catalogId,'');assert.deepEqual(suggestion.suggestedCatalogIds,[175]);
assert.deepEqual(Adapter.parse(lines('圳息獸尊・首 +25\nCOST 3'),{catalog}).suggestedCatalogIds,[]);
const samples=[
['共鳴迴響・天演溯心 +25','COST 4','暴擊傷害 44.0%','攻擊 150','暴擊 7.5%','攻擊 30','共鳴技能傷害加成 9.4%','重擊傷害加成 10.1%','防禦 40','聲骸技能'],
['共鸣回响·天演溯心 +25','COST 4','暴击伤害 44.0%','攻击 150','暴击 7.5%','攻击 30','共鸣技能伤害加成 9.4%','重击伤害加成 10.1%','防御 40','声骸技能'],
['Jué +25','COST 4','Crit. DMG 44.0%','ATK 150','Crit. Rate 7.5%','ATK 30','Resonance Skill DMG Bonus 9.4%','Heavy Attack DMG Bonus 10.1%','DEF 40','Echo Skill']
];
for(const [index,sample] of samples.entries()){
 const source=lines(sample.join('\n')),before=JSON.stringify(source),r=Adapter.parse(source,{catalog});assert.equal(JSON.stringify(source),before);assert.equal(r.catalogId,index===2?59:181);assert.equal(r.detectedCost,4);assert.equal(r.detectedMainStat.key,'crit_damage');assert.equal(r.detectedMainStat.value,44);assert.deepEqual(r.detectedSubstats.map(s=>s.key),['crit_rate','atk_flat','resonance_skill_damage','heavy_attack_damage','def_flat']);assert.deepEqual(r.detectedSubstats.map(s=>s.value),[7.5,30,9.4,10.1,40]);assert.equal(r.needsReview,true);
 const echo=Adapter.toEcho(r,{catalog,createEcho:Core.createEcho,id:101,suites:api.suiteAttributeMap});assert.equal(echo.imgCode,catalog.find(e=>e.id===r.catalogId).imgCode);assert.equal(echo.mainAtrri,'暴伤44%');assert.equal(echo.propertyList.length,5);assert.ok(!('sourceImage' in echo));
 let writes=0,saved={role:[Core.createRole(api.roleList[0],1)],unusedEchoes:[]};const core=Core.create({read:()=>saved,write:d=>{saved=d;writes++;},normalize});assert.equal(writes,0);core.transact(JSON.stringify(saved),d=>core.saveEcho(d,null,null,echo));assert.equal(writes,1);assert.equal(saved.unusedEchoes.length,1);core.transact(JSON.stringify(saved),d=>core.equip(d,1,101));assert.equal(saved.role[0].costList.length,1);assert.equal(saved.unusedEchoes.length,0);assert.equal(Number(saved.role[0].costList[0].sumScores),normalize(saved.role[0]).slots[0].echo.score.value);
 const duplicate=JSON.parse(JSON.stringify(r));duplicate.detectedSubstats[1]=duplicate.detectedSubstats[0];assert.throws(()=>Adapter.toEcho(duplicate,{catalog,createEcho:Core.createEcho,id:102}),/INVALID_ECHO/);
 const bad=JSON.parse(JSON.stringify(r));bad.detectedCost=1;assert.throws(()=>Adapter.toEcho(bad,{catalog,createEcho:Core.createEcho,id:102}),/INVALID_ECHO/);
}
const missing=Adapter.parse(lines('暴擊 7.5%\n攻擊 30'),{catalog});assert.equal(missing.detectedCost,'');assert.ok(missing.detectedSubstats.every(s=>s.value===''));assert.equal(missing.detectedMainStat.value,'');
const unknown=Adapter.parse(lines('靈息獸尊・首 +25\nCOST 1\n攻擊 18.0%\n生命 2280\n暴擊 6.3%\n聲骸技能'),{catalog});assert.equal(unknown.catalogId,'');assert.equal(unknown.detectedSubstats[0].value,6.3);assert.equal(unknown.detectedSubstats[1].value,'');assert.throws(()=>Adapter.toEcho(unknown,{catalog,createEcho:Core.createEcho,id:1}),/INVALID_ECHO/);
const missingPercent=Adapter.stat({text:'暴擊傷害 44.096',confidence:20});assert.equal(missingPercent.value,'');assert.equal(missingPercent.needsReview,true);
const rollValues={crit_rate:[6.3,7.5],atk_flat:[30],resonance_skill_damage:[9.4],heavy_attack_damage:[10.1],def_flat:[40]};const badRoll=Adapter.parse(lines(samples[0].join('\n').replace('7.5%','75%')),{catalog,rollValues});assert.equal(badRoll.detectedSubstats[0].value,'');assert.equal(badRoll.detectedSubstats[0].needsReview,true);
const invalidMain=Adapter.parse(lines(samples[0].join('\n').replace('44.0%','440%')),{catalog,mainValues:{Cost4:[{key:'crit_damage',value:44}]}});assert.equal(invalidMain.detectedMainStat.value,'');
assert.doesNotMatch(fs.readFileSync('js/screenshot-recognition-adapter.js','utf8'),/localStorage|mcData|saveDataToCache|countScores/);
assert.doesNotMatch(fs.readFileSync('js/screenshot-recognition.js','utf8'),/localStorage|mcData|saveDataToCache|countScores/);
for(const page of ['mccost.html','mccost-readonly.html','index.html'])assert.doesNotMatch(fs.readFileSync(page,'utf8'),/screenshot-recognition\.js/);
console.log('PASS: trilingual parsing, one Echo, fixed-stat exclusion, unknown catalog, missing Cost/value/percent, existing rolls, manual conversion, Core library/equip/score parity, no OCR writes and Classic isolation.');

