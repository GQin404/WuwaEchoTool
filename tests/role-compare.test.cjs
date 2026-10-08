const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {webcrypto}=require('node:crypto');
const candidates=require('../js/role-candidates.js'),drafts=require('../js/role-draft-model.js'),storageModule=require('../js/role-draft-storage.js');
const {createAdapter}=require('../js/role-view-model.js'),controllerModule=require('../js/role-register-controller.js');
const I18n=require('../js/i18n.js'),dictionary=require('../js/i18n-dictionaries.js');
const read=name=>fs.readFileSync(path.join(__dirname,'../js',name),'utf8'),copy=x=>JSON.parse(JSON.stringify(x));
const env={$:()=>{}};vm.runInNewContext(read('base.js')+'\n;globalThis.api={roleList,costList,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection};',env);
const normalize=createAdapter(env.api),adapter=candidates.createAdapter(normalize);
const role={roleId:101,roleListId:1,ming:0,costList:[59,51,52,35,39].map((id,i)=>({costId:600+i,costListId:id,type:['Cost4','Cost3','Cost3','Cost1','Cost1'][i],mainAtrri:['暴击22%','属伤30%','共鸣效率32%','攻击18%','攻击18%'][i],propertyList:[{property:'暴击',value:'8.1%'},{property:'暴伤',value:'16.2%'},{property:'大攻击',value:'8.6%'},{property:'小防御',value:'50'},{property:'共鸣效率',value:'8.4%'}]}))};
const baseline=drafts.createBaseline(normalize(role),{id:'b',createdAt:1,sourceRevision:'r1',modelVersion:'v1'});

const compare=require('../js/role-compare.js'),localModule=require('../js/role-local-configuration.js');
const original=JSON.stringify(role);
function run(edit,conditions={},base=baseline,current=base){
 const fields=candidates.editor(normalize(role).slots[2].echo);edit(fields);
 const slot=adapter.fromEditor(fields,role,'candidate');
 const candidate=drafts.createCandidate(slot.echo,{id:'c',source:'manual',sourceRevision:'c1',identityScope:['candidate'],completeness:slot.status});
 const draft=drafts.createDraft(base,candidate,{id:'d',targetSlot:3,createdAt:2});
 return {draft,result:compare.evaluate({baseline:base,draft,current,role,normalize,conditions,now:3})};
}
const yes={equipment:true,energy:true,tradeoffs:true};
let x=run(f=>f.substats[0].value=10.5);
assert.equal(x.result.conclusion,'needs-condition');
x=run(f=>f.substats[0].value=10.5,yes);
assert.equal(x.result.conclusion,'recommended');
const score=x.result.rows.find(r=>r.key==='score');
const echo=adapter.fromEditor(candidates.editor(x.draft.candidate.echo),role,'candidate').echo;
assert.equal(score.candidate,echo.score.substats);
assert.equal(x.result.rows.find(r=>r.key==='crit_rate').delta,2.4);
assert.equal(run(()=>{},yes).result.conclusion,'keep-current');
assert.equal(run(f=>f.substats[0].value=6.3,yes).result.conclusion,'keep-current');
const energy=run(f=>{f.substats[0].value=10.5;f.substats[4].value=5;},{equipment:true});
assert.equal(energy.result.conclusion,'needs-condition');
assert.ok(energy.result.missing.includes('energy'));
assert.equal(energy.result.rows.find(r=>r.key==='resonance_efficiency').judgement,'unknown');
assert.equal(run(f=>f.substats.pop()).result.conclusion,'insufficient-data');
const stale=copy(baseline);stale.sourceRevision='changed';
assert.equal(run(()=>{},yes,baseline,stale).result.conclusion,'incompatible');
const incompatible=copy(baseline);incompatible.conditions.chain=1;
assert.equal(run(()=>{},yes,baseline,incompatible).result.conclusion,'incompatible');
const empty=copy(baseline);empty.slots[4].echo=null;
assert.equal(run(()=>{},yes,empty).result.conclusion,'insufficient-data');
const map=new Map([['mcData',original]]),writes=[];
const local=localModule.create({getItem:k=>map.get(k)??null,setItem:(k,v)=>{writes.push(k);map.set(k,v);}});
assert.ok(local.adopt(baseline,x.draft,baseline,yes,x.result,3).ok);
assert.ok(local.find(baseline,x.draft));
assert.equal(local.adopt(baseline,x.draft,stale,yes,x.result,4).ok,false);
map.set(localModule.KEY,'broken');assert.equal(local.adopt(baseline,x.draft,baseline,yes,x.result,4).ok,false);
assert.equal(map.get(localModule.KEY),'broken');assert.equal(map.get('mcData'),original);
assert.ok(writes.every(k=>k===localModule.KEY));assert.equal(JSON.stringify(role),original);
for(const locale of ['zh-TW','zh-CN','en']){
 const i=I18n.create({language:locale});
 for(const key of Object.keys(dictionary.en).filter(k=>k.startsWith('compare.')))assert.ok(dictionary[locale][key]);
 assert.notEqual(i.format.percentagePoint(2.4),i.format.percentage(2.4));
}
console.log('PASS: decision rules, scoring parity, percentage points, energy uncertainty, incomplete/stale/model conditions, local adoption and corruption isolation.');
