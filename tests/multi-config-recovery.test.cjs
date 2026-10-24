/* 兼容恢复使用合成存档；校验原始备份、刷新幂等性及有歧义资料的拒绝路径。 */
const {test}=require('node:test'),assert=require('node:assert/strict');
const MC=require('../js/multi-config.js'),Core=require('../js/character-core.js'),Meta=require('../js/register-metadata.js');
const echo=id=>({costId:id,costListId:59,type:'Cost4',mainAtrri:'暴击22%',propertyList:[]});
const legacy=()=>({role:[{...Core.createRole({id:1,name:'fixture'},'r1'),costList:[echo(11)]}],unusedEchoes:[echo(12)]});
function memory(data){const map=new Map(data===undefined?[]:[['mcData',JSON.stringify(data)]]);let fail=null,writes=0;return {map,getItem:k=>map.get(k)??null,setItem(k,v){writes++;if(k===fail){fail=null;throw Error('quota');}map.set(k,String(v));},removeItem:k=>map.delete(k),fail:k=>fail=k,get writes(){return writes;}};}
const initialize=s=>Core.initialize(s,Meta.create(s));
const foreign=()=>Array.from({length:8},(_,i)=>({Name:'合成角色'+i,NameImage:'合成角色'+i,UID:'fixture-only',NumberOfStars:i%3,list:[4,3,3,1,1].map(Cost=>({Id:0,Cost:String(Cost),Attributes:'合成套装',AllEchoAffix:[{Name:'攻擊',Number:'18%',Points:123}],Points:123}))}));

test('实际报告的外部数组结构可定位为 8 条角色与 40 条声骸，刷新不自动重置或猜测转换',()=>{
 const s=memory(foreign()),saved=[...s.map];assert.deepEqual(Core.foreignSummary(s.getItem('mcData')),{roles:8,echoes:40});
 assert.throws(()=>initialize(s),/INVALID_DATA/);assert.deepEqual([...s.map],saved);
 for(const data of [[],[{}],{role:[]},[{Name:'fixture',list:[{Cost:2,AllEchoAffix:[]}]}]])assert.equal(Core.foreignSummary(JSON.stringify(data)),null);
});

test('明确重新开始后逐字节保留外部数组，恢复新增与刷新，不复用不明 Id 或外部评分',()=>{
 const s=memory(foreign()),raw=s.getItem('mcData'),data=Core.restartForeign(s,raw);
 assert.equal(data.role.length,0);assert.equal(data.echoes.length,0);assert.deepEqual(Core.archivedForeignSummary(s),{roles:8,echoes:40});
 assert.equal(JSON.parse(s.getItem(Core.COMPATIBILITY_BACKUP)).snapshots[0].values.mcData,raw);
 const core=Core.create({read:()=>JSON.parse(s.getItem('mcData')),write:(d,o)=>MC.commit(s,d,o),normalize:()=>({slots:[],summary:{score:0}})});
 core.transact(JSON.stringify(core.load()),d=>d.role.push(Core.createRole({id:1,name:'fixture'},'new-role')));
 core.transact(JSON.stringify(core.load()),d=>core.saveEcho(d,null,null,echo('new-echo')));
 const result=initialize(s);assert.equal(result.role.length,1);assert.equal(result.echoes.length,1);
 assert.equal(JSON.parse(s.getItem(Core.COMPATIBILITY_BACKUP)).snapshots[0].values.mcData,raw);
 assert.throws(()=>Core.restartForeign(s,raw),/SOURCE_CHANGED/);
});

test('外部数组重新开始在取消前无写入；备份失败、核心提交失败或混合辅助资料均保留原文',()=>{
 for(const failedKey of [Core.COMPATIBILITY_BACKUP,'mcData']){
  const s=memory(foreign()),raw=s.getItem('mcData');s.fail(failedKey);
  assert.throws(()=>Core.restartForeign(s,raw));assert.equal(s.getItem('mcData'),raw);assert.equal(s.getItem(MC.JOURNAL),null);
  Core.restartForeign(s,raw);assert.equal(JSON.parse(s.getItem(Core.COMPATIBILITY_BACKUP)).snapshots.length,1);
 }
 const s=memory(foreign());s.setItem('wuwa.echoTool.drafts.v1','keep mixed data');const saved=[...s.map];
 assert.throws(()=>Core.restartForeign(s,s.getItem('mcData')),/INVALID_STORAGE/);assert.deepEqual([...s.map],saved);
 const valid=memory(legacy()),before=[...valid.map];assert.throws(()=>Core.restartForeign(valid,valid.getItem('mcData')),/INVALID_DATA/);assert.deepEqual([...valid.map],before);
});

test('导入服务与 Classic 共用写入边界都拒绝外部数组，保留原存档',()=>{
 const fs=require('node:fs'),vm=require('node:vm'),s=memory(legacy()),saved=[...s.map];
 assert.throws(()=>Core.restoreData({json:JSON.stringify(foreign()),expectedRaw:s.getItem('mcData'),readRaw:()=>s.getItem('mcData'),write:d=>s.setItem('mcData',JSON.stringify(d))}),/INVALID_DATA/);
 const env={$:()=>{},localStorage:s};vm.runInNewContext(fs.readFileSync('js/base.js','utf8'),env);
 for(const data of [foreign(),null,{list:[]}])assert.throws(()=>env.saveDataToCache(data),/INVALID_DATA/);
 assert.deepEqual([...s.map],saved);
});

test('刷新时从新版实体与配置重建失效投影，保留非当前配置并只备份一次',()=>{
 const d=MC.migrate(legacy()),first=d.role[0].activeConfigurationId;
 MC.add(d,'r1',false,'另一套');d.role[0].costList=null;d.unusedEchoes='stale';
 const original=JSON.stringify(d),s=memory(d),configs=structuredClone(d.role[0].configurations),entities=structuredClone(d.echoes);
 const restored=initialize(s);assert.deepEqual(restored.role[0].costList,[]);assert.deepEqual(restored.unusedEchoes,[echo(12)]);
 assert.deepEqual(restored.role[0].configurations,configs);assert.deepEqual(restored.echoes,entities);
 MC.select(restored,'r1',first);assert.deepEqual(restored.role[0].costList,[echo(11)]);
 const backup=JSON.parse(s.getItem(Core.COMPATIBILITY_BACKUP));assert.equal(backup.snapshots[0].values.mcData,original);
 const saved=[...s.map],writes=s.writes;initialize(s);assert.deepEqual([...s.map],saved);assert.equal(s.writes,writes);
});

test('缺失的单配置元数据与短槽位可确定补齐，不改变词条或角色设置',()=>{
 const d=MC.migrate(legacy()),r=d.role[0],c=MC.active(r);r.damageMode='custom';r.extraEnergy=42;
 for(const k of ['roleId','name','source','settings','createdAt','updatedAt'])delete c[k];
 c.slots=[11];delete r.activeConfigurationId;delete r.defaultConfigurationId;delete r.costList;delete d.unusedEchoes;
 const s=memory(d),result=initialize(s),fixed=result.role[0],config=MC.active(fixed);
 assert.equal(config.id,c.id);assert.deepEqual(config.slots,[11,null,null,null,null]);assert.deepEqual(config.settings,{damageMode:'custom',extraEnergy:42});
 assert.deepEqual(fixed.costList,[echo(11)]);assert.equal(fixed.extraEnergy,42);assert.deepEqual(result.echoes,d.echoes);Core.validate(result);
});

test('旧版缺少空装备列表与声骸库时可刷新迁移，正常旧版与 null 存档也可初始化',()=>{
 for(const data of [{role:[{roleId:'r',roleListId:1}]},legacy(),null,undefined]){
  const s=memory(data),result=initialize(s);assert.equal(result.loadoutVersion,2);Core.validate(result);
  if(data!==undefined)assert.equal(JSON.parse(s.getItem(Core.COMPATIBILITY_BACKUP)).snapshots[0].values.mcData,JSON.stringify(data));
  const saved=[...s.map];initialize(s);assert.deepEqual([...s.map],saved);
 }
});

test('重复角色或实体、未知版本及无法确定的配置保持原样，不猜测修复',()=>{
 const duplicate=legacy();duplicate.role.push(structuredClone(duplicate.role[0]));
 const entity=MC.migrate(legacy());entity.echoes.push(structuredClone(entity.echoes[0]));
 const noEntity=MC.migrate(legacy());delete noEntity.echoes;
 const ambiguous=MC.migrate(legacy());MC.add(ambiguous,'r1',true);delete ambiguous.role[0].activeConfigurationId;
 const settings=MC.migrate(legacy());MC.add(settings,'r1',true);delete settings.role[0].configurations[0].settings;
 for(const data of [duplicate,entity,noEntity,ambiguous,settings,{...legacy(),loadoutVersion:99},{role:[null]}]){
  const s=memory(data),saved=[...s.map];assert.throws(()=>initialize(s));assert.deepEqual([...s.map],saved);
 }
});

test('原始备份不解析损坏 JSON、不导出凭证，初始化失败不覆盖任何原值',()=>{
 const s=memory();s.setItem('mcData','{broken');s.setItem('kjq_token','private');s.setItem('kjq_bat','private');
 s.setItem(MC.JOURNAL,'bad journal');const saved=[...s.map];assert.throws(()=>initialize(s));assert.deepEqual([...s.map],saved);
 const exported=Core.rawBackup(s);assert.equal(exported.values.mcData,'{broken');assert.equal(exported.values[MC.JOURNAL],'bad journal');assert.ok(!JSON.stringify(exported).includes('private'));
});

test('备份写入或核心提交失败不覆盖原存档，重试后正常恢复',()=>{
 for(const failedKey of [Core.COMPATIBILITY_BACKUP,'mcData']){
  const d=MC.migrate(legacy());d.role[0].costList=null;const s=memory(d),raw=s.getItem('mcData');s.fail(failedKey);
  assert.throws(()=>initialize(s));assert.equal(s.getItem('mcData'),raw);assert.equal(s.getItem(MC.JOURNAL),null);
  const result=initialize(s);Core.validate(result);assert.deepEqual(result.role[0].costList,[echo(11)]);
  assert.equal(JSON.parse(s.getItem(Core.COMPATIBILITY_BACKUP)).snapshots.length,1);
 }
});

test('初始化兼容修复仍保留旧草稿关联、名称及原始辅助资料',()=>{
 const s=memory(legacy());s.setItem(Meta.KEY,JSON.stringify({schemaVersion:1,revision:0,roles:{r1:'原名称'},drafts:{}}));
 s.setItem('wuwa.echoTool.drafts.v1',JSON.stringify({schemaVersion:1,revision:0,baselines:[{id:'b',role:{identity:'r1'}}],drafts:[]}));
 const raw=s.getItem('wuwa.echoTool.drafts.v1'),data=initialize(s);
 assert.equal(MC.active(data.role[0]).name,'原名称');assert.equal(JSON.parse(s.getItem('wuwa.echoTool.drafts.v1')).baselines[0].role.configurationId,data.role[0].activeConfigurationId);
 assert.equal(JSON.parse(s.getItem(Core.COMPATIBILITY_BACKUP)).snapshots[0].values['wuwa.echoTool.drafts.v1'],raw);
});
