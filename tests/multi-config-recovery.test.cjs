/* 兼容恢复使用合成存档；校验原始备份、刷新幂等性及有歧义资料的拒绝路径。 */
const {test}=require('node:test'),assert=require('node:assert/strict');
const MC=require('../js/multi-config.js'),Core=require('../js/character-core.js'),Meta=require('../js/register-metadata.js');
const echo=id=>({costId:id,costListId:59,type:'Cost4',mainAtrri:'暴击22%',propertyList:[]});
const legacy=()=>({role:[{...Core.createRole({id:1,name:'fixture'},'r1'),costList:[echo(11)]}],unusedEchoes:[echo(12)]});
function memory(data){const map=new Map(data===undefined?[]:[['mcData',JSON.stringify(data)]]);let fail=null,writes=0;return {map,getItem:k=>map.get(k)??null,setItem(k,v){writes++;if(k===fail){fail=null;throw Error('quota');}map.set(k,String(v));},removeItem:k=>map.delete(k),fail:k=>fail=k,get writes(){return writes;}};}
const initialize=s=>Core.initialize(s,Meta.create(s));

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
