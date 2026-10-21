const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Model=require('../js/register-import-model.js'),Core=require('../js/character-core.js'),View=require('../js/role-view-model.js'),Backup=require('../js/register-backup.js'),Draft=require('../js/role-draft-model.js'),I18n=require('../js/i18n.js');
const env={$:()=>{},console:{log(){}}};
vm.runInNewContext(fs.readFileSync('js/base.js','utf8')+';globalThis.api={roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection,sumCostScores,mappingOfficialRoleId,mappingRoleId};',env);
vm.runInNewContext(fs.readFileSync('js/import-service.js','utf8'),env);vm.runInNewContext(fs.readFileSync('js/role-import-core.js','utf8'),env);
const api=env.api,normalize=View.createAdapter(api),clone=x=>JSON.parse(JSON.stringify(x));
const remote=api.roleList.slice(0,3).map(r=>({roleId:r.gid,roleName:r.name,level:90}));
function imported(id=1){const entry=api.roleList.find(r=>r.id===id);return {...Core.createRole(entry,500+id),isImport:true,gameRoleId:entry.gid,level:90,ming:0,costList:[59,51,52,35,39].map((id,i)=>({costId:600+i,costListId:id,name:api.costList.find(e=>e.id===id).name,type:['Cost4','Cost3','Cost3','Cost1','Cost1'][i],imgCode:'image/weapon.png',suite:'光套',mainAtrri:{property:['暴击','属伤','共鸣效率','大攻击','大攻击'][i],value:['22%','30%','32%','18%','18%'][i]},propertyList:[['暴击','8.1%'],['暴伤','16.2%'],['大攻击','8.6%'],['技能伤害','8.6%'],['共鸣效率','8.4%']].map(([property,value])=>({property,value}))}))};}
function setup({roles=[],list=remote,detail,service:override}={}){
 let data={role:clone(roles),unusedEchoes:[]},writes=0,failWrite=false;
 const cache=new Map([['kjq_token','fixture-token']]),storage={getItem:k=>cache.get(k)??null,setItem:(k,v)=>cache.set(k,v),removeItem:k=>cache.delete(k)};
 const core=Core.create({read:()=>data,write:d=>{if(failWrite)throw Error('quota');data=clone(d);storage.setItem('mcData',JSON.stringify(data));writes++;},normalize}),calls=[];
 const service=override||{bind:async token=>{calls.push('bind');storage.setItem('kjq_token',token);},list:async()=>{calls.push('list');return clone(list);},detail:async(uid,r,opt)=>{calls.push(String(r.gameRoleId));if(detail)return detail(uid,r,opt);return {...imported(r.roleListId),roleId:r.roleId};}};
 const model=Model.create({core,service,catalog:api.roleList,mapRole:api.mappingOfficialRoleId,normalize,storage});
 return {model,core,storage,calls,get data(){return clone(data);},get writes(){return writes;},set data(value){data=clone(value);},set failWrite(value){failWrite=value;}};
}
async function ready(s,uid='123456789'){assert.equal(await s.model.connect(uid,'fixture-token'),true);s.model.selectAll();await s.model.read();}
test('official names map the three reported characters through preview and explicit save',async()=>{
 const list=[{roleId:990052,roleName:'绯雪',level:90},{roleId:990055,roleName:'丽贝卡',level:40},{roleId:990056,roleName:'洛瑟菈',level:90}]; // Synthetic IDs, not official numeric IDs.
 const s=setup({list,detail:async(uid,r)=>({...imported(r.roleListId),roleId:r.roleId,gameRoleId:r.gameRoleId})});
 await ready(s);
 assert.deepEqual(s.model.snapshot().rows.map(r=>r.entry.id),[52,55,56]);
 assert.ok(s.model.snapshot().rows.every(r=>r.known&&r.status==='done'));
 assert.equal(s.writes,0);assert.equal(await s.model.save(),true);
 assert.deepEqual(s.data.role.map(r=>r.roleListId),[52,55,56]);
 assert.deepEqual(s.data.role.map(r=>r.gameRoleId),list.map(r=>r.roleId));
 assert.deepEqual(s.data.role.map(r=>r.importSource.gameRoleId),list.map(r=>String(r.roleId)));
 assert.equal(api.roleList.find(r=>r.id===55).name,'丽贝卡');
 for(const row of list)assert.equal(api.mappingRoleId(row.roleId,row.roleName),api.mappingOfficialRoleId(row.roleId,row.roleName));
});

test('legacy aliases stay compatible while ambiguous names and duplicate identities stay blocked',async()=>{
 for(const name of ['蕾贝卡','蕾貝卡','麗貝卡'])assert.equal(api.mappingOfficialRoleId(990055,name),55);
 assert.equal(api.mappingOfficialRoleId(990052,'緋雪'),52);
 assert.equal(api.mappingOfficialRoleId('990052',' 绯 雪 '),52);
 for(const name of ['绯','丽贝','洛瑟','漂泊者','unknown'])assert.equal(api.mappingOfficialRoleId(990099,name),0);
 for(const id of [0,null,undefined,'','invalid'])assert.equal(api.mappingOfficialRoleId(id,'绯雪'),0);
 const registered=api.roleList.find(r=>r.gid!==0);
 assert.equal(api.mappingOfficialRoleId(String(registered.gid),'unused label'),registered.id);
 assert.equal(api.mappingRoleId(registered.id),registered.gid);
 api.roleList.push({...registered,id:999});
 try{assert.equal(api.mappingOfficialRoleId(registered.gid,'绯雪'),0);}finally{api.roleList.pop();}
 api.roleList.push({...api.roleList.find(r=>r.id===55),name:'绯雪'});
 try{assert.equal(api.mappingOfficialRoleId(990052,'绯雪'),0);}finally{api.roleList.pop();}
 const s=setup({list:[{roleId:990055,roleName:'蕾贝卡'},{roleId:990056,roleName:'洛瑟菈'},{roleId:990056,roleName:'洛瑟菈'},{roleId:990099,roleName:'绯'}]});
 await s.model.connect('123456789','fixture-token');s.model.selectAll();
 assert.deepEqual(s.model.snapshot().rows.map(r=>r.known),[true,false,false,false]);
 assert.equal(s.model.snapshot().selected.size,1);assert.equal(s.writes,0);
});

test('search, visible-only all, multi-select, unknown/duplicate blocking and preview/cancel isolation',async()=>{
 const s=setup({list:[...remote,{roleId:999999,roleName:'unknown'}]});await s.model.connect('123456789','fixture-token');
 s.model.snapshot().search=remote[0].roleName;s.model.selectAll();assert.equal(s.model.snapshot().selected.size,1);
 s.model.snapshot().search='';assert.equal(s.model.snapshot().selected.size,1);s.model.selectAll();assert.equal(s.model.snapshot().selected.size,3);
 s.model.select('3',true);assert.equal(s.model.snapshot().selected.size,3);const before=s.data;await s.model.read();assert.deepEqual(s.data,before);assert.equal(s.writes,0);s.model.cancel();assert.equal(s.writes,0);
 const duplicate=setup({list:[remote[0],remote[0]]});await duplicate.model.connect('123456789','fixture-token');duplicate.model.selectAll();assert.equal(duplicate.model.snapshot().selected.size,0);
});
test('partial success, one bounded queue, retry failed only, save successful items',async()=>{
 let fail=true,active=0,max=0;const s=setup({detail:async(uid,r)=>{active++;max=Math.max(max,active);await new Promise(resolve=>setTimeout(resolve,5));active--;if(r.gameRoleId===remote[1].roleId&&fail)throw Error('fixture');return {...imported(r.roleListId),roleId:r.roleId};}});
 await s.model.connect('123456789','fixture-token');s.model.selectAll();const running=s.model.read();assert.equal(await s.model.read(),false);await running;
 assert.equal(max,1);assert.equal(s.model.counts().failed,1);assert.equal(s.model.counts().add,2);assert.equal(s.writes,0);
 fail=false;await s.model.retry();assert.equal(s.calls.filter(x=>x===String(remote[0].roleId)).length,1);assert.equal(s.model.counts().add,3);assert.equal(await s.model.save(),true);assert.equal(s.writes,1);assert.equal(s.data.role.length,3);
});
test('cancel stops scheduling and ignores a non-abortable response',async()=>{
 let resolve;const s=setup({detail:()=>new Promise(r=>resolve=r)});await s.model.connect('123456789','fixture-token');s.model.selectAll();const running=s.model.read();s.model.cancel();resolve(imported());await running;
 assert.equal(s.calls.filter(c=>/^\d+$/.test(c)).length,1);assert.equal(s.model.snapshot().rows[0].preview,null);assert.equal(s.model.counts().failed,3);assert.equal(s.writes,0);
});
test('UID/token invalidation and dispose prevent old list/detail and commits',async()=>{
 let resolve;const s=setup({service:{bind:async()=>{},list:()=>new Promise(r=>resolve=r)}});const running=s.model.connect('123456789','fixture-token');s.model.invalidate();resolve(remote);await running;assert.equal(s.model.snapshot().rows.length,0);assert.equal(s.writes,0);
 const d=setup({detail:()=>new Promise(r=>resolve=r)});await d.model.connect('123456789','fixture-token');d.model.selectAll();const read=d.model.read();d.model.dispose();resolve(imported());await read;assert.equal(await d.model.save(),false);assert.equal(d.writes,0);
});
test('explicit save, idempotent submit, UID separation, reliable update preserves local ID',async()=>{
 const manual={...imported(),isImport:false};const s=setup({roles:[manual]});await ready(s);const before=s.data;assert.deepEqual(before.role,[manual]);assert.equal(await s.model.save(),true);const first=s.data.role[1];assert.equal(await s.model.save(),false);assert.equal(s.writes,1);
 await ready(s);assert.equal(s.model.counts().update,3);assert.equal(await s.model.save(),true);assert.equal(s.data.role[1].roleId,first.roleId);assert.deepEqual(s.data.role[0],manual);
 await ready(s,'987654321');assert.equal(s.model.counts().add,3);await s.model.save();assert.equal(s.data.role.length,7);assert.equal(s.data.role[1].importSource.accountKey,await Model.accountKey('123456789'));
});
test('legacy source requires a target; cannot overwrite manual or another UID',async()=>{
 const legacy=imported(),other=imported(2);other.importSource={version:1,server:Model.SERVER,gameRoleId:String(remote[1].roleId),accountKey:await Model.accountKey('987654321')};
 const s=setup({roles:[legacy,other]});await ready(s);assert.equal(s.model.snapshot().rows[0].action,'resolve');assert.equal(await s.model.save(),false);
 assert.throws(()=>s.model.choose('1','update',other.roleId),/IDENTITY/);s.model.choose('0','update',legacy.roleId);await s.model.save();assert.equal(s.data.role[0].roleId,legacy.roleId);assert.ok(s.data.role[0].importSource);assert.deepEqual(s.data.role[1],other);
});
test('multiple source matches require explicit target',async()=>{
 const source={version:1,server:Model.SERVER,gameRoleId:String(remote[0].roleId),accountKey:await Model.accountKey('123456789')};
 const a={...imported(),importSource:source},b={...a,roleId:999};const s=setup({roles:[a,b]});await ready(s);assert.equal(s.model.snapshot().rows[0].action,'resolve');assert.equal(await s.model.save(),false);s.model.choose('0','update',999);await s.model.save();assert.deepEqual(s.data.role[0],a);
});
test('skip and failed items never save, partial batch may commit',async()=>{
 const s=setup({detail:async(uid,r)=>{if(r.roleListId===3)throw Error('fixture');return {...imported(r.roleListId),roleId:r.roleId};}});await ready(s);s.model.choose('1','skip');assert.deepEqual(s.model.counts(),{add:1,update:0,skip:1,failed:1,resolve:0});await s.model.save();assert.equal(s.data.role.length,1);assert.equal(s.model.snapshot().result.failed,1);assert.equal(s.model.snapshot().result.skip,1);
});
test('local conflict retains preview, preserves foreign writes and reconfirms affected target',async()=>{
 const source={version:1,server:Model.SERVER,gameRoleId:String(remote[0].roleId),accountKey:await Model.accountKey('123456789')};const original={...imported(),importSource:source};
 const s=setup({roles:[original]});await ready(s);const preview=s.model.snapshot().rows[0].preview;const foreign=s.data;foreign.role[0].level=80;s.data=foreign;
 assert.equal(await s.model.save(),false);assert.equal(s.model.snapshot().error.message,'SOURCE_CHANGED');assert.equal(s.model.snapshot().rows[0].preview,preview);assert.equal(s.data.role[0].level,80);assert.equal(s.model.snapshot().rows[0].action,'resolve');assert.equal(await s.model.save(),false);
 s.model.choose('0','update',original.roleId);assert.equal(await s.model.save(),true);assert.equal(s.data.role[0].level,90);
});
test('storage failure retains batch, no partial writes or saved links, retry unique IDs',async()=>{
 const s=setup();await ready(s);s.failWrite=true;const before=s.data;assert.equal(await s.model.save(),false);assert.deepEqual(s.data,before);assert.equal(s.model.snapshot().rows.some(r=>r.savedId),false);assert.equal(s.model.snapshot().error.message,'SAVE_FAILED');
 s.failWrite=false;const p=s.model.save();assert.equal(await s.model.save(),false);assert.equal(await p,true);assert.equal(s.writes,1);
 const ids=s.data.role.flatMap(r=>[r.roleId,...r.costList.map(e=>e.costId)]).map(String);assert.equal(new Set(ids).size,ids.length);
});
test('complete backup roundtrip includes inline source; delete removes it; legacy schema survives',async()=>{
 const s=setup();await ready(s);await s.model.save();const value=Backup.exportData({storage:s.storage,coreData:s.data});assert.doesNotMatch(JSON.stringify(value),/fixture-token/);
 const target=setup();assert.equal(Backup.restore(value,{storage:target.storage,validateCore:Core.validate}).ok,true);assert.deepEqual(JSON.parse(target.storage.getItem('mcData')),s.data);
 const data=s.data;Core.removeRole(data,data.role[0].roleId);assert.equal(data.role.length,2);assert.equal(Core.validate({role:[imported()],unusedEchoes:[]}).role.length,1);
 const bad=clone(s.data);bad.role[0].importSource.accountKey='invalid';assert.throws(()=>Core.validate(bad),/INVALID_DATA/);
});
test('source update invalidates baseline/draft while preserving draft and adoption storage',async()=>{
 const s=setup();await ready(s);await s.model.save();const role=s.data.role[0],base=Draft.createBaseline(normalize(role),{id:'before',createdAt:1,sourceRevision:Draft.canonical(role),modelVersion:'legacy-scoring-2026-10-08'});
 const candidate=Draft.createCandidate({...normalize(role).slots[4].echo,id:'candidate'},{id:'candidate',source:'inventory',sourceRevision:'candidate',identityScope:['candidate'],completeness:'complete'});
 const draft=Draft.createDraft(base,candidate,{id:'draft',targetSlot:5,createdAt:1});s.storage.setItem('wuwa.echoTool.drafts.v1',JSON.stringify({schemaVersion:1,revision:0,baselines:[base],drafts:[draft]}));s.storage.setItem('wuwa.echoTool.localConfigurations.v1','preserved');
 const before=s.storage.getItem('wuwa.echoTool.drafts.v1');await ready(s);await s.model.save();const fresh=s.data.role[0],current=Draft.createBaseline(normalize(fresh),{id:'after',createdAt:2,sourceRevision:Draft.canonical(fresh),modelVersion:base.modelVersion});
 assert.equal(Draft.assess(base,draft,current,2).status,'stale');assert.equal(s.storage.getItem('wuwa.echoTool.drafts.v1'),before);assert.equal(s.storage.getItem('wuwa.echoTool.localConfigurations.v1'),'preserved');
});
test('three-language keys complete and new/import scoring uses the shared adapter',async()=>{
 const s=setup();await ready(s);for(const row of s.model.snapshot().rows){assert.deepEqual(row.view,normalize(row.commit));}
 for(const locale of ['zh-TW','zh-CN','en']){const i=I18n.create({url:'/?lang='+locale});for(const key of Object.keys(require('../js/i18n-dictionaries.js')[locale]).filter(k=>k.startsWith('official.')))assert.notEqual(i.t(key),key);}
});
test('real transport chain reauthorizes once for list/detail data credentials and aborts safely',async()=>{
 for(const target of ['list','detail']){
  let auth=0,attempts=0;const requests=[],cache=new Map([['kjq_token','fixture-token']]);
  const service=env.ImportService.create({host:'',methods:['list','detail','bind','refresh','','','auth'],headers:()=>({did:Math.random().toString()}),tokenHeaders:()=>({}),storage:{getItem:k=>cache.get(k),setItem:(k,v)=>cache.set(k,v)},convert:e=>e,ajax:o=>{
   requests.push(o);if(o.url==='auth'){auth++;o.success({data:{accessToken:'fixture-access'}});}else if(o.url===target&&attempts++===0)o.success({code:999,msg:'数据令牌已失效'});else if(o.url==='list')o.success({data:{roleList:remote}});else if(o.url==='detail')o.success({data:{level:90,chainList:[],phantomData:{equipPhantomList:[]}}});else o.success({success:true});
  }});
  if(target==='list')await service.list('123456789');else await service.detail('123456789',imported());assert.equal(attempts,2);assert.equal(auth,target==='list'?2:1);assert.equal(new Set(requests.map(r=>r.headers.did).filter(Boolean)).size,1);assert.equal(cache.has('mcData'),false);
 }
 let aborts=0,pending;const service=env.ImportService.create({host:'',methods:['list','detail','bind','refresh','','','auth'],headers:()=>({}),tokenHeaders:()=>({}),storage:{getItem:()=>null,setItem:()=>assert.fail('stale credentials')},ajax:o=>{pending=o;return {abort(){aborts++;}};}});
 const controller=new AbortController(),running=service.bind('fixture-token',{signal:controller.signal});controller.abort();pending.success({success:true});await assert.rejects(running,/CANCELLED/);assert.equal(aborts,1);
});
test('repeated dataToken cannot loop; empty token and invalid UID never issue transport',async()=>{
 let requests=0;const service=env.ImportService.create({host:'',methods:['list','detail','bind','refresh','','','auth'],headers:()=>({}),tokenHeaders:()=>({}),storage:{getItem:()=> 'fixture',setItem:()=>{}},ajax:o=>{requests++;o.success(o.url==='auth'?{data:{accessToken:'fixture'}}:{code:999,msg:'数据令牌已失效'});}});
 await assert.rejects(service.list('123456789'));assert.equal(requests,4);requests=0;await assert.rejects(service.bind(''));await assert.rejects(service.list('1'));assert.equal(requests,0);
});
test('localized search and credential clear preserve core data, with recovery on partial clear failure',async()=>{
 const s=setup();await ready(s);const before=s.data;s.model.clearCredentials();assert.equal(s.storage.getItem('kjq_token'),null);assert.deepEqual(s.data,before);assert.equal(s.writes,0);
 const cache=new Map([['kjq_token','fixture-token'],['kjq_bat','fixture-access']]);let fail=true;const storage={getItem:k=>cache.get(k)??null,setItem:(k,v)=>cache.set(k,v),removeItem:k=>{if(k==='kjq_bat'&&fail)throw Error('quota');cache.delete(k);}};
 const model=Model.create({service:{list:async()=>remote},core:s.core,catalog:api.roleList,mapRole:id=>api.roleList.find(r=>r.gid===id)?.id,normalize,storage,searchName:entry=>entry.id===1?'Jinhsi':''});await model.connect('123456789','fixture-token');model.snapshot().search='Jinhsi';assert.equal(model.visible().length,1);
 model.clearCredentials();assert.equal(model.snapshot().error.message,'SAVE_FAILED');assert.equal(storage.getItem('kjq_token'),'fixture-token');assert.equal(storage.getItem('kjq_bat'),'fixture-access');assert.deepEqual(s.data,before);fail=false;model.clearCredentials();assert.equal(storage.getItem('kjq_token'),null);
});
test('credential storage failure is classified without raw exceptions, and connection stays unverified',async()=>{
 const service=env.ImportService.create({host:'',methods:['list','detail','bind','refresh','','','auth'],tokenHeaders:()=>({}),storage:{setItem:()=>{throw Error('private-storage-detail');}},ajax:o=>o.success({success:true})});
 await assert.rejects(service.bind('fixture-token'),e=>e.message==='SAVE_FAILED');
 const s=setup({service:{list:async()=>{const error=Error('IMPORT_FAILED');error.importFailure={stage:'auth',reason:'credential'};throw error;}}});assert.equal(await s.model.connect('123456789','fixture-token'),false);assert.equal(s.model.snapshot().credential,'invalid');assert.equal(s.writes,0);
});
test('conversion rejects unknown Echo mappings and uses unique snapshot identities, with numeric flat stats',()=>{
 env.crypto=globalThis.crypto;
 const raw={phantomProp:{phantomPropId:900000,name:api.costList[0].name,cost:1,iconUrl:'image/weapon.png'},fetterDetail:{iconUrl:'image/weapon.png'},mainProps:[{attributeName:'攻击',attributeValue:'18%'}],subProps:[{attributeName:'攻击',attributeValue:40}]};
 const options={...api,catalog:api.costList},role=imported();const converted=Array.from({length:100},()=>env.RoleImportCore.convertPhantomData(raw,role,options));assert.equal(new Set(converted.map(e=>e.costId)).size,100);assert.equal(converted[0].costListId,1);assert.equal(converted[0].propertyList[0].property,'小攻击');
 assert.throws(()=>env.RoleImportCore.convertPhantomData({...raw,phantomProp:{...raw.phantomProp,name:'unknown'}},role,options),/UNKNOWN_ECHO/);
 const incomplete=env.RoleImportCore.convertPhantomData({...raw,mainProps:[]},role,options);assert.equal(incomplete.mainAtrri,null);const view=normalize({...role,costList:[incomplete]});assert.equal(view.summary.score,null);assert.equal(view.slots[0].status,'incomplete');
});
