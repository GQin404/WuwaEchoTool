/* 多配置核心：mcData 内的实体、稳定引用与旧版投影；不合并属性相似的实例。 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.MultiConfig=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VERSION=2,JOURNAL='wuwa.multiconfig.transaction.v2',copy=x=>JSON.parse(JSON.stringify(x)),key=x=>String(x),settingsKeys=['damageMode','extraEnergy','referenceHealth'];
const uid=()=>globalThis.crypto.randomUUID(),now=()=>Date.now(),same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const canonical=x=>Array.isArray(x)?'['+x.map(canonical).join(',')+']':x&&typeof x==='object'?'{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}':JSON.stringify(x);
const settings=r=>Object.fromEntries(settingsKeys.filter(k=>Object.hasOwn(r,k)).map(k=>[k,r[k]]));
function active(r){return r.configurations?.find(c=>c.id===r.activeConfigurationId);}
function role(data,id){const r=data.role.find(r=>key(r.roleId)===key(id));if(!r)throw Error('SOURCE_CHANGED');return r;}
function entities(data){return data.loadoutVersion===VERSION?data.echoes:data.unusedEchoes||[];}
function references(data,id){return data.role.flatMap(r=>(r.configurations||[]).flatMap(c=>c.slots.map((v,i)=>v!=null&&key(v)===key(id)?{roleId:r.roleId,roleListId:r.roleListId,roleName:r.name,configurationId:c.id,name:c.name,position:i+1,current:c.id===r.activeConfigurationId}:null).filter(Boolean)));}
function configuration(r,{name='',slots=[],source='local',values={}}={}){return {id:uid(),roleId:r.roleId,name,slots:Array.from({length:5},(_,i)=>slots[i]??null),settings:copy(values),createdAt:now(),updatedAt:now(),source};}
function project(data){
 if(data.loadoutVersion!==VERSION)return data;
 const map=new Map(data.echoes.map(e=>[key(e.costId),e]));
 for(const r of data.role){const c=active(r);if(!c)throw Error('INVALID_CONFIG');
  const list=c.slots.map(id=>id==null?null:copy(map.get(key(id))||null));while(list.length&&!list.at(-1))list.pop();r.costList=list;
  for(const k of settingsKeys)delete r[k];Object.assign(r,copy(c.settings));
 }
 const used=new Set(data.role.flatMap(r=>r.configurations.flatMap(c=>c.slots.filter(v=>v!=null).map(key))));
 data.unusedEchoes=data.echoes.filter(e=>!used.has(key(e.costId))).map(copy);return data;
}
function migrate(input,names={}){
 const data=copy(input);if(data.loadoutVersion!==undefined&&data.loadoutVersion!==VERSION)throw Error('UNSUPPORTED_SCHEMA');
 if(data.loadoutVersion===VERSION){validate(data);return project(data);}
 data.echoes=[];const used=new Set();
 const add=e=>{if(!e)return null;const entity=copy(e);if(entity.costId==null||used.has(key(entity.costId))){entity.legacyCostId=entity.costId??null;entity.costId=uid();}used.add(key(entity.costId));data.echoes.push(entity);return entity.costId;};
 for(const r of data.role){const c=configuration(r,{name:names[r.roleId]||'',slots:r.costList.map(add),source:r.isImport?'official':'legacy',values:settings(r)});r.configurations=[c];r.activeConfigurationId=r.defaultConfigurationId=c.id;}
 for(const e of data.unusedEchoes||[])add(e);
 data.loadoutVersion=VERSION;return project(data);
}
/* 仅补齐可确定的旧字段；新版 costList/unusedEchoes 是投影，必须从配置重建后再校验。 */
function prepare(input){
 const data=copy(input);
 if(!data||Array.isArray(data)||!Array.isArray(data.role))throw Error('INVALID_DATA');
 if(data.unusedEchoes==null)data.unusedEchoes=[];
 if(data.loadoutVersion!==VERSION){
  for(const r of data.role)if(r&&typeof r==='object'&&!Object.hasOwn(r,'costList'))r.costList=[];
  return data;
 }
 for(const r of data.role){
  if(!r||!Array.isArray(r.configurations)||!r.configurations.length)throw Error('INVALID_CONFIG');
  for(const c of r.configurations){
   if(!c||typeof c!=='object')throw Error('INVALID_CONFIG');
   if(c.roleId===undefined)c.roleId=r.roleId;
   if(c.name===undefined)c.name='';
   if(c.source===undefined)c.source='legacy';
   if(c.settings===undefined&&r.configurations.length===1)c.settings=settings(r);
   if(Array.isArray(c.slots)&&c.slots.length<5)c.slots=Array.from({length:5},(_,i)=>c.slots[i]??null);
   if(c.createdAt===undefined)c.createdAt=Number.isFinite(c.updatedAt)?c.updatedAt:0;
   if(c.updatedAt===undefined)c.updatedAt=c.createdAt;
  }
  if(r.configurations.length===1){
   if(r.activeConfigurationId==null)r.activeConfigurationId=r.configurations[0].id;
   if(r.defaultConfigurationId==null)r.defaultConfigurationId=r.configurations[0].id;
  }
 }
 return project(validate(data));
}
function validate(data){
 if(data.loadoutVersion!==undefined&&data.loadoutVersion!==VERSION)throw Error('UNSUPPORTED_SCHEMA');
 if(data.loadoutVersion!==VERSION)return data;
 if(!Array.isArray(data.echoes))throw Error('INVALID_CONFIG');
 const ids=new Set();for(const e of data.echoes){if(!e||!['string','number'].includes(typeof e.costId)||typeof e.costId==='number'&&!Number.isFinite(e.costId)||key(e.costId)===''||ids.has(key(e.costId)))throw Error('IDENTITY');ids.add(key(e.costId));}
 const configs=new Set();for(const r of data.role){if(!Array.isArray(r.configurations)||!r.configurations.length)throw Error('INVALID_CONFIG');
  for(const c of r.configurations){if(!c||typeof c.id!=='string'||!c.id||configs.has(c.id)||key(c.roleId)!==key(r.roleId)||typeof c.name!=='string'||c.name.length>80||typeof c.source!=='string'||!Array.isArray(c.slots)||c.slots.length!==5||c.slots.some(v=>v!=null&&!['string','number'].includes(typeof v))||!c.settings||Array.isArray(c.settings)||typeof c.settings!=='object'||Object.keys(c.settings).some(k=>!settingsKeys.includes(k))||!Number.isFinite(c.createdAt)||!Number.isFinite(c.updatedAt))throw Error('INVALID_CONFIG');
   configs.add(c.id);const slotIds=c.slots.filter(v=>v!=null).map(key);if(new Set(slotIds).size!==slotIds.length)throw Error('IDENTITY');
  }
  if(!active(r)||!r.configurations.some(c=>c.id===r.defaultConfigurationId))throw Error('INVALID_CONFIG');
 }return data;
}
/* 将既有编辑器或 Classic 对当前投影的修改写回唯一实体；其他配置不挪槽。 */
function reconcile(input,previous){
 let data=copy(input);if(data.loadoutVersion!==VERSION)return data;
 if(!previous||previous.loadoutVersion!==VERSION)return project(validate(data));
 for(const r of data.role){const old=previous.role.find(x=>key(x.roleId)===key(r.roleId));
  if(!r.configurations?.length){const c=configuration(r,{slots:r.costList.map(e=>e?.costId??null),values:settings(r),source:r.isImport?'official':'local'});r.configurations=[c];r.activeConfigurationId=r.defaultConfigurationId=c.id;}
  const c=active(r);
  if(!old||same(old.configurations,r.configurations)&&(!same(old.costList,r.costList)||!same(settings(old),settings(r)))){
   if(!old||!same(old.costList.filter(Boolean).map(e=>key(e.costId)),r.costList.filter(Boolean).map(e=>key(e.costId))))c.slots=Array.from({length:5},(_,i)=>r.costList[i]?.costId??null);c.settings=settings(r);c.updatedAt=now();
   for(const e of r.costList.filter(Boolean)){const at=data.echoes.findIndex(x=>key(x.costId)===key(e.costId));if(at<0)data.echoes.push(copy(e));else if(!same(old?.costList.find(x=>x&&key(x.costId)===key(e.costId)),e))data.echoes[at]=copy(e);}
  }
 }
 // 旧版声骸库编辑/新增/删除只作用于真正未引用项目。
 for(const e of data.unusedEchoes||[]){const before=previous.unusedEchoes.find(x=>key(x.costId)===key(e.costId));if(!same(before,e)){const at=data.echoes.findIndex(x=>key(x.costId)===key(e.costId));if(at<0)data.echoes.push(copy(e));else data.echoes[at]=copy(e);}}
 for(const old of previous.unusedEchoes||[])if(!(data.unusedEchoes||[]).some(e=>key(e.costId)===key(old.costId))&&!references(data,old.costId).length)data.echoes=data.echoes.filter(e=>key(e.costId)!==key(old.costId));
 return project(validate(data));
}
function add(data,id,duplicate=false,name=''){const r=role(data,id),from=active(r),c=configuration(r,{name,slots:duplicate?from.slots:[],values:duplicate?from.settings:{},source:'local'});r.configurations.push(c);r.activeConfigurationId=c.id;project(data);return c.id;}
function select(data,id,cid){const r=role(data,id);if(!r.configurations.some(c=>c.id===cid))throw Error('SOURCE_CHANGED');r.activeConfigurationId=cid;return project(data);}
function rename(data,id,cid,name){if(typeof name!=='string'||!name.trim()||name.trim().length>80)throw Error('INVALID_CONFIG');const c=role(data,id).configurations.find(c=>c.id===cid);if(!c)throw Error('SOURCE_CHANGED');c.name=name.trim();c.updatedAt=now();}
function remove(data,id,cid){const r=role(data,id);if(r.configurations.length===1)throw Error('LAST_CONFIG');if(!r.configurations.some(c=>c.id===cid))throw Error('SOURCE_CHANGED');r.configurations=r.configurations.filter(c=>c.id!==cid);if(r.defaultConfigurationId===cid)r.defaultConfigurationId=r.configurations[0].id;if(r.activeConfigurationId===cid)r.activeConfigurationId=r.defaultConfigurationId;project(data);}
function equip(data,id,echoId,position){const r=role(data,id),c=active(r),e=data.echoes.find(e=>key(e.costId)===key(echoId));if(!e)throw Error('IDENTITY');const i=position==null?c.slots.findIndex(x=>x==null):Number(position)-1;if(i<0||i>4)throw Error('COST_LIMIT');if(c.slots.some((x,n)=>n!==i&&x!=null&&key(x)===key(echoId)))throw Error('IDENTITY');const next=c.slots.slice();next[i]=e.costId;const sources=next.filter(v=>v!=null).map(v=>data.echoes.find(e=>key(e.costId)===key(v)));if(sources.some(e=>!e))throw Error('SOURCE_CHANGED');if(sources.some(e=>!['Cost1','Cost3','Cost4'].includes(e.type)))throw Error('INVALID_ECHO');const cost=sources.reduce((n,e)=>n+Number(e.type.slice(4)),0);if(cost>12)throw Error('COST_LIMIT');c.slots=next;c.updatedAt=now();project(data);return i+1;}
function edit(data,echo){const i=data.echoes.findIndex(e=>key(e.costId)===key(echo.costId));if(i<0)data.echoes.push(copy(echo));else data.echoes[i]=copy(echo);project(data);}
function unlink(data,id,echoId){const c=active(role(data,id));c.slots=c.slots.map(v=>v!=null&&key(v)===key(echoId)?null:v);c.updatedAt=now();project(data);}
function destroy(data,echoId){for(const r of data.role)for(const c of r.configurations){if(c.slots.some(v=>v!=null&&key(v)===key(echoId)))c.updatedAt=now();c.slots=c.slots.map(v=>v!=null&&key(v)===key(echoId)?null:v);}data.echoes=data.echoes.filter(e=>key(e.costId)!==key(echoId));project(data);}
function overwrite(data,id,next){const old=role(data,id),r=copy(next);r.roleId=old.roleId;const used=new Set(data.echoes.map(e=>key(e.costId)));const slots=r.costList.map(e=>{const item=copy(e);while(item.costId==null||used.has(key(item.costId)))item.costId=uid();used.add(key(item.costId));data.echoes.push(item);return item.costId;});for(const k of settingsKeys)delete r[k];const c=configuration(r,{slots,source:'official'});r.configurations=[c];r.defaultConfigurationId=r.activeConfigurationId=c.id;data.role[data.role.indexOf(old)]=r;project(data);return r;}
function recover(storage){const raw=storage.getItem(JOURNAL);if(raw===null)return;const j=JSON.parse(raw);if(!j||j.version!==1||!j.before||Object.keys(j.before).some(k=>!['mcData','wuwa.echoTool.drafts.v1','wuwa.echoTool.localConfigurations.v1','wuwa.register.names.v1','wuwa.register.echoMeta.v1'].includes(k)))throw Error('INVALID_STORAGE');for(const [k,v]of Object.entries(j.before))v===null?storage.removeItem(k):storage.setItem(k,v);storage.removeItem(JOURNAL);}
function commit(storage,data,{resetRoles=[],resetConfigurations=[],migrateConfigurations=null,expectedCore=null,removedEchoIds=[]}={}){
 const changes={mcData:JSON.stringify(data)},before={};
 if(removedEchoIds.length){const raw=storage.getItem('wuwa.register.echoMeta.v1');if(raw!==null){const meta=JSON.parse(raw);if(!meta||Array.isArray(meta)||typeof meta!=='object')throw Error('INVALID_STORAGE');for(const id of removedEchoIds)delete meta[key(id)];changes['wuwa.register.echoMeta.v1']=JSON.stringify(meta);}}
 if(migrateConfigurations){const raw=storage.getItem('wuwa.register.echoMeta.v1');if(raw!==null){const meta=JSON.parse(raw);if(!meta||Array.isArray(meta)||typeof meta!=='object')throw Error('INVALID_STORAGE');let changed=false;for(const e of data.echoes)if(e.legacyCostId!=null&&meta[key(e.legacyCostId)]&&!meta[key(e.costId)]){meta[key(e.costId)]=copy(meta[key(e.legacyCostId)]);changed=true;}if(changed)changes['wuwa.register.echoMeta.v1']=JSON.stringify(meta);}}
 if(resetRoles.length||resetConfigurations.length||migrateConfigurations){
  const ids=new Set(resetRoles.map(key)),configs=new Set(resetConfigurations),draftKey='wuwa.echoTool.drafts.v1',adoptKey='wuwa.echoTool.localConfigurations.v1',nameKey='wuwa.register.names.v1';
  const raw=storage.getItem(draftKey),drafts=raw===null?null:JSON.parse(raw),removed=new Set(),oldSignatures=new Map();
  if(migrateConfigurations&&drafts)for(const d of drafts.drafts||[]){const b=drafts.baselines?.find(b=>b.id===d.baseline.id);if(b)oldSignatures.set(d.id,canonical({baseline:b,draft:d}));}
  if(drafts){if(!Array.isArray(drafts.baselines)||!Array.isArray(drafts.drafts))throw Error('INVALID_STORAGE');if(migrateConfigurations)for(const b of drafts.baselines)if(!b.role.configurationId&&migrateConfigurations[b.role.identity])b.role.configurationId=migrateConfigurations[b.role.identity];const bids=new Set(drafts.baselines.filter(b=>ids.has(b.role?.identity)||configs.has(b.role?.configurationId)).map(b=>b.id));drafts.drafts=drafts.drafts.filter(d=>{if(bids.has(d.baseline.id)){removed.add(d.id);return false;}return true;});drafts.baselines=drafts.baselines.filter(b=>!bids.has(b.id));drafts.revision++;changes[draftKey]=JSON.stringify(drafts);}
  const adoptedRaw=storage.getItem(adoptKey);if(adoptedRaw!==null){const a=JSON.parse(adoptedRaw);if(!Array.isArray(a.items))throw Error('INVALID_STORAGE');a.items=a.items.filter(i=>!removed.has(i.draftId));if(migrateConfigurations&&drafts){for(const item of a.items){const b=drafts.baselines.find(b=>b.id===item.baselineId),d=drafts.drafts.find(d=>d.id===item.draftId);if(b&&d&&oldSignatures.get(item.draftId)===item.signature)item.signature=canonical({baseline:b,draft:d});}}changes[adoptKey]=JSON.stringify(a);}
  const namesRaw=storage.getItem(nameKey);if(namesRaw!==null){const n=JSON.parse(namesRaw);if(!n.roles||!n.drafts)throw Error('INVALID_STORAGE');for(const id of ids)delete n.roles[id];for(const id of removed)delete n.drafts[id];n.revision++;changes[nameKey]=JSON.stringify(n);}
 }
 for(const k of Object.keys(changes))before[k]=storage.getItem(k);
 if(expectedCore!==null&&JSON.stringify(JSON.parse(before.mcData))!==expectedCore)throw Error('SOURCE_CHANGED');
 try{storage.setItem(JOURNAL,JSON.stringify({version:1,before}));for(const [k,v]of Object.entries(changes))storage.setItem(k,v);storage.removeItem(JOURNAL);}catch(error){try{for(const [k,v]of Object.entries(before))v===null?storage.removeItem(k):storage.setItem(k,v);storage.removeItem(JOURNAL);}catch(_){throw Error('ROLLBACK_FAILED');}throw error;}
}
return {VERSION,JOURNAL,copy,uid,settings,active,role,entities,references,configuration,project,migrate,prepare,validate,reconcile,add,select,rename,remove,equip,edit,unlink,destroy,overwrite,recover,commit};
});
