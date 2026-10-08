const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Core=require('../js/character-core.js'),VM=require('../js/role-view-model.js'),Tools=require('../js/echo-tool-core.js'),Views=require('../js/ui-view.js');
const env={$:()=>{},console:{log(){}}};
vm.runInNewContext(fs.readFileSync('js/base.js','utf8')+';globalThis.api={roleList,costList,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection,fctValue,fctValueHJ,sumCostScores,costExperance};',env);
const api=env.api,normalize=VM.createAdapter(api),copy=x=>JSON.parse(JSON.stringify(x));
let saved={role:[Core.createRole(api.roleList[0],1)],unusedEchoes:[]},writes=0;
const core=Core.create({read:()=>saved,write:d=>{saved=copy(d);writes++;},normalize});
const echo={...Core.createEcho(api.costList.find(e=>e.type==='Cost4'),10),mainAtrri:'暴击22%',propertyList:[{property:'暴击',value:'8.1%'}]};
const baseline=JSON.stringify(saved);core.load();assert.equal(writes,0);
core.transact(baseline,d=>core.saveEcho(d,1,null,echo,1));assert.equal(writes,1);assert.equal(saved.role[0].costList[0].costId,10);
assert.equal(Number(saved.role[0].totalScore),normalize(saved.role[0]).summary.knownContribution);
assert.throws(()=>core.transact(baseline,()=>{}),/SOURCE_CHANGED/);assert.equal(writes,1);
let before=JSON.stringify(saved);assert.throws(()=>core.transact(before,d=>core.saveEcho(d,1,null,echo,2)),/IDENTITY/);assert.equal(JSON.stringify(saved),before);
core.transact(before,d=>core.removeEcho(d,1,10,true));assert.equal(saved.role[0].costList.length,0);assert.equal(saved.unusedEchoes[0].costId,10);
core.transact(JSON.stringify(saved),d=>core.equip(d,1,10));assert.equal(saved.unusedEchoes.length,0);assert.equal(saved.role[0].costList[0].costId,10);
for(const bad of [null,{}, {role:[{roleId:1,costList:[]},{roleId:1,costList:[]}]}])assert.throws(()=>Core.validate(bad));
const tooMuch=copy(saved);tooMuch.role[0].costList=[1,2,3].map(costId=>({...echo,costId}));before=JSON.stringify(tooMuch);
const bounded=Core.create({read:()=>tooMuch,write:()=>assert.fail('must not save'),normalize});assert.throws(()=>bounded.transact(before,d=>bounded.saveEcho(d,1,null,{...echo,costId:99},4)),/COST_LIMIT/);assert.equal(JSON.stringify(tooMuch),before);
const ambiguous=copy(saved);ambiguous.unusedEchoes=[echo,echo];const safe=Core.create({read:()=>ambiguous,write:()=>assert.fail('ambiguous write'),normalize});assert.throws(()=>safe.transact(JSON.stringify(ambiguous),d=>safe.equip(d,1,10)),/IDENTITY/);
for(const page of ['costedit','unusedEchoes','compare','probability','imitate','rule']){assert.equal(Views.nativeUrl('https://local/'+page+'.html?view=classic','classic'),null);assert.match(Views.nativeUrl('https://local/'+page+'.html?view=register','register'),/^\/register-workspace.html/);}
assert.ok(!Views.nativeUrl('https://local/costedit.html?roleid=0&costid=3','register').includes('roleid'));
// 冻结输出来自抽取前的旧工具，不用新实现生成期望值。
for(const c of require('./fixtures/legacy-probability.json').cases){
 const r=Tools.probability(c.properties.map(property=>({property,value:'8.1%'})),s=>api.countScores(s,{roleListId:1,ming:0}),api.fctValueHJ);
 for(const [key,stat]of [['bj','crit'],['bs','damage'],['gj','attack']]){const out=r[stat];assert.equal(out.present?'已出':out.rounds.map((p,i)=>'('+(i+1)+')'+p.toFixed(2)+'% | ').join('')+'(总)'+out.total.toFixed(2)+'%',c.outputs[key]);}
 assert.equal(r.dual.present?'已达成':r.dual.total.toFixed(2)+'%',c.outputs.sb);assert.equal(r.defensive.toFixed(2)+'%',c.outputs.sf);assert.equal(r.expected.toFixed(2),c.outputs.ysqw);
}
for(let seed=0;seed<100;seed++){const items=[];let n=seed;while(items.length<5){const next=Tools.roll(items,api.fctValue,()=>((n=n*1664525+1013904223)>>>0)/4294967296);assert.ok(next);items.push(next);}assert.equal(new Set(items.map(i=>i.property)).size,5);assert.equal(Tools.roll(items,api.fctValue),null);}
for(let count=0;count<=5;count++){
 const result=Tools.resources(count,api.costExperance),old=count?api.costExperance[count-1]:{gouliang:0,dakong:0};
 assert.equal(result.used.xp,old.gouliang);assert.equal(result.used.tuners,old.dakong);
 assert.equal(result.recovered.xp,old.gouliang*.7);assert.equal(result.recovered.tuners,old.dakong*.3);
 assert.equal(result.lost.xp,old.gouliang*.3);assert.equal(result.lost.tuners,old.dakong*.7);
 assert.equal(result.remaining.xp,28.6-old.gouliang);assert.equal(result.remaining.tuners,50-old.dakong);
}
// 网络使用代表性响应，不需要或读取玩家登录凭证。
vm.runInNewContext(fs.readFileSync('js/role-import-core.js','utf8'),env);vm.runInNewContext(fs.readFileSync('js/import-service.js','utf8'),env);
const raw={phantomProp:{phantomPropId:100,name:'fixture',cost:4,iconUrl:'image/test.png'},fetterDetail:{iconUrl:'image/set.png'},mainProps:[{attributeName:'暴击',attributeValue:'22%'}],subProps:[{attributeName:'暴击',attributeValue:'8.1%'}]};
const imported={...saved.role[0],isImport:true,gameRoleId:1000},original=JSON.stringify(imported),map=new Map([['kjq_token','synthetic']]),requests=[];
const service=env.ImportService.create({host:'test:',methods:['list','detail','bind','refresh','','','auth'],headers:()=>({}),tokenHeaders:()=>({}),storage:{getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)},convert:(e,r)=>env.RoleImportCore.convertPhantomData(e,r,api,10000),ajax:options=>{requests.push(options.url);options.success(options.url==='test:auth'?{data:{accessToken:'synthetic'}}:options.url==='test:list'?{code:200,data:JSON.stringify({roleList:[{roleId:1000}]})}:options.url==='test:detail'?{code:200,data:JSON.stringify({level:90,chainList:[{unlocked:true}],skillList:[],phantomData:{equipPhantomList:[raw]}})}:{success:true});}});
(async()=>{assert.equal((await service.list('123456789')).length,1);const result=await service.detail('123456789',imported);assert.equal(result.ming,1);assert.equal(result.costList[0].costId,10100);assert.equal(JSON.stringify(imported),original);assert.equal(map.has('mcData'),false);core.score(result);assert.equal(Number(result.costList[0].sumScores),normalize(result).slots[0].echo.score.value);await assert.rejects(service.list('1'),/INVALID_UID/);console.log('PASS: shared core transactions, cancellation/conflicts, equip/remove, duplicate identity, Cost limit, native routes, 126 frozen legacy probability cases, 100 five-stat simulations, synthetic import transport and score parity.');})().catch(e=>{console.error(e);process.exitCode=1;});
