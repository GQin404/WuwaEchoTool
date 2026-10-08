/* 纯数据边界：只接收规范化数据，不访问 DOM、存档或评分函数。 */
(function(root,factory){
    if(typeof module==='object'&&module.exports)module.exports=factory(require('./stat-keys.js'));
    else root.RoleDraftModel=factory(root.StatKeys);
})(typeof globalThis!=='undefined'?globalThis:this,function(statKeys){
    'use strict';
    const SCHEMA_VERSION=1;
    const copy=x=>JSON.parse(JSON.stringify(x));
    const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
    function fail(code){throw new Error(code);}
    function requireValue(ok,code){if(!ok)fail(code);}
    const id=x=>(typeof x==='string'&&x.trim()!==''||typeof x==='number'&&Number.isFinite(x))?String(x):null;
    const token=x=>typeof x==='string'&&x.trim()!=='';
    const timestamp=x=>Number.isSafeInteger(x)&&x>=0;
    // 键排序用于语义比较，不使用可能碰撞的短哈希，也不依赖对象插入顺序。
    function canonical(x){
        if(Array.isArray(x))return '['+x.map(canonical).join(',')+']';
        if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+canonical(x[k])).join(',')+'}';
        return JSON.stringify(x);
    }
    const same=(a,b)=>canonical(a)===canonical(b);
    const exact=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&same(Object.keys(value).sort(),keys.slice().sort());
    function validConditions(c){
        return exact(c,['chain','mode','extraEnergy','referenceHealth'])&&Number.isInteger(c.chain)&&c.chain>=0&&c.chain<=6&&
            ['default','tune','fusion','harmony','quick','critical','cycle','support','damage','sustained','opening','unison','electro'].includes(c.mode)&&
            (c.extraEnergy===null||Number.isFinite(c.extraEnergy)&&c.extraEnergy>=0&&c.extraEnergy<=200)&&
            (c.referenceHealth===null||Number.isFinite(c.referenceHealth)&&c.referenceHealth>=15000&&c.referenceHealth<=70000);
    }
    function validStat(s){
        const expectedUnit=['atk_flat','hp_flat','hp_flat_legacy','def_flat'].includes(s?.key)?'flat':'percent';
        return exact(s,['key','unit','value','status'])&&(s.key===null||Object.hasOwn(statKeys.keyToLegacy,s.key))&&
            [null,'percent','flat'].includes(s.unit)&&(s.value===null||Number.isFinite(s.value)&&s.value>=0)&&
            ['valid','missing','invalid','unsupported'].includes(s.status)&&
            (s.status!=='valid'||s.key!==null&&s.unit===expectedUnit&&s.value!==null);
    }
    function validEcho(e){
        return exact(e,['identity','catalogId','cost','suiteId','mainStat','substats','completeness'])&&
            (e.identity===null||token(e.identity))&&
            (e.catalogId===null||token(e.catalogId))&&[null,1,3,4].includes(e.cost)&&
            (e.suiteId===null||token(e.suiteId))&&validStat(e.mainStat)&&Array.isArray(e.substats)&&
            e.substats.every(validStat)&&['complete','incomplete'].includes(e.completeness)&&
            (e.completeness!=='complete'||e.cost!==null&&e.mainStat.status==='valid'&&e.substats.length===5&&
                e.substats.every(s=>s.status==='valid')&&new Set(e.substats.map(s=>s.key)).size===5);
    }
    function echoFromView(e,completeness){
        const stat=s=>({key:s.key??null,unit:s.unit??null,value:s.value??null,status:s.status});
        const echo={identity:id(e.id),catalogId:id(e.catalogId),cost:e.cost??null,suiteId:id(e.suite?.id),
            mainStat:stat(e.mainStat),substats:e.substats.map(stat),completeness};
        requireValue(validEcho(echo),'INVALID_ECHO');return echo;
    }
    function reliable(b){
        const ids=b.slots.filter(s=>s.echo).map(s=>s.echo.identity);
        return b.identityState==='reliable'&&ids.every(Boolean)&&new Set(ids).size===ids.length;
    }
    function validateBaseline(b){
        requireValue(exact(b,['schemaVersion','id','version','createdAt','expiresAt','sourceRevision','modelVersion','viewModelVersion','role','conditions','modelStatus','identityState','slots']),'INVALID_BASELINE');
        requireValue(b.schemaVersion===SCHEMA_VERSION&&token(b.id)&&b.version===1&&timestamp(b.createdAt)&&
            (b.expiresAt===null||timestamp(b.expiresAt)&&b.expiresAt>b.createdAt)&&token(b.sourceRevision)&&token(b.modelVersion)&&b.viewModelVersion===2,'INVALID_BASELINE_VERSION');
        requireValue(exact(b.role,['identity','catalogId','source'])&&token(b.role.identity)&&token(b.role.catalogId)&&['manual','imported'].includes(b.role.source),'INVALID_ROLE_IDENTITY');
        requireValue(validConditions(b.conditions)&&['available','unavailable'].includes(b.modelStatus)&&['reliable','ambiguous'].includes(b.identityState),'INVALID_MODEL');
        requireValue(Array.isArray(b.slots)&&b.slots.length===5&&b.slots.every((s,i)=>exact(s,['position','echo'])&&s.position===i+1&&(s.echo===null||validEcho(s.echo))),'INVALID_SLOTS');
        if(b.identityState==='reliable')requireValue(reliable(b),'AMBIGUOUS_IDENTITY');
        return true;
    }
    function createBaseline(model,options){
        requireValue(model?.schemaVersion===2,'UNSUPPORTED_VIEW_MODEL');
        const parameters=model.model.parameters;
        const b={schemaVersion:SCHEMA_VERSION,id:options.id,version:1,createdAt:options.createdAt,expiresAt:options.expiresAt??null,
            sourceRevision:options.sourceRevision,modelVersion:options.modelVersion,viewModelVersion:model.schemaVersion,
            role:{identity:id(model.role.id),catalogId:id(model.role.catalogId),source:model.role.source},
            conditions:{chain:model.model.chain,mode:parameters.mode,extraEnergy:parameters.extraEnergy??null,referenceHealth:parameters.referenceHealth??null},
            modelStatus:model.model.status,identityState:'reliable',slots:model.slots.map(s=>({position:s.position,echo:s.echo?echoFromView(s.echo,s.status):null}))};
        if(!reliable(b)||model.issues.some(i=>['duplicate-cost-id','extra-slots'].includes(i.code)))b.identityState='ambiguous';
        validateBaseline(b);return freeze(b);
    }
    function validateCandidate(c){
        requireValue(exact(c,['schemaVersion','id','source','sourceRevision','echo'])&&c.schemaVersion===SCHEMA_VERSION&&token(c.id)&&
            ['manual','imported','inventory'].includes(c.source)&&token(c.sourceRevision)&&validEcho(c.echo)&&c.echo.identity!==null,'INVALID_CANDIDATE');
        return true;
    }
    function createCandidate(echo,options){
        // 调用方必须提供候选集合中唯一的实例；不能用名称或目录 ID 猜测。
        requireValue(Array.isArray(options.identityScope)&&options.identityScope.filter(x=>id(x)===id(echo.id)).length===1,'AMBIGUOUS_CANDIDATE');
        const c={schemaVersion:SCHEMA_VERSION,id:options.id,source:options.source,sourceRevision:options.sourceRevision,
            echo:echoFromView(echo,options.completeness)};
        validateCandidate(c);return freeze(c);
    }
    function validateDraft(d,b){
        validateBaseline(b);
        requireValue(exact(d,['schemaVersion','id','baseline','targetSlot','originalEchoIdentity','candidate','modelConditions','createdAt','updatedAt','status'])&&
            d.schemaVersion===SCHEMA_VERSION&&token(d.id)&&exact(d.baseline,['id','version'])&&d.baseline.id===b.id&&d.baseline.version===b.version,'INVALID_DRAFT');
        requireValue(timestamp(d.createdAt)&&timestamp(d.updatedAt)&&d.updatedAt>=d.createdAt&&d.createdAt>=b.createdAt&&d.status==='active'&&validConditions(d.modelConditions),'INVALID_DRAFT_STATE');
        requireValue(Number.isInteger(d.targetSlot)&&d.targetSlot>=1&&d.targetSlot<=5&&reliable(b),'AMBIGUOUS_TARGET');
        requireValue(d.originalEchoIdentity===(b.slots[d.targetSlot-1].echo?.identity??null),'TARGET_MISMATCH');
        validateCandidate(d.candidate);
        requireValue(!b.slots.some(s=>s.position!==d.targetSlot&&s.echo?.identity===d.candidate.echo.identity),'CANDIDATE_ALREADY_EQUIPPED');
        return true;
    }
    function createDraft(b,c,options){
        const d={schemaVersion:SCHEMA_VERSION,id:options.id,baseline:{id:b.id,version:b.version},targetSlot:options.targetSlot,
            originalEchoIdentity:b.slots[options.targetSlot-1]?.echo?.identity??null,candidate:copy(c),modelConditions:copy(options.modelConditions??b.conditions),
            createdAt:options.createdAt,updatedAt:options.createdAt,status:'active'};
        validateDraft(d,b);return freeze(d);
    }
    function updateDraft(d,b,changes){
        validateDraft(d,b);
        requireValue(timestamp(changes.updatedAt)&&changes.updatedAt>=d.updatedAt,'INVALID_UPDATE_TIME');
        const next={...copy(d),candidate:copy(changes.candidate??d.candidate),modelConditions:copy(changes.modelConditions??d.modelConditions),updatedAt:changes.updatedAt};
        validateDraft(next,b);return freeze(next);
    }
    function assess(b,d,current,now){
        try{validateDraft(d,b);validateBaseline(current);requireValue(timestamp(now),'INVALID_TIME');}
        catch(error){return {status:'incompatible',reason:error.message};}
        if(!same(b.role,current.role))return {status:'incompatible',reason:'ROLE_MISMATCH'};
        if(b.modelVersion!==current.modelVersion||b.viewModelVersion!==current.viewModelVersion)return {status:'incompatible',reason:'MODEL_VERSION_CHANGED'};
        if(b.modelStatus!=='available'||current.modelStatus!=='available')return {status:'incompatible',reason:'MODEL_UNAVAILABLE'};
        if(!same(b.conditions,current.conditions)||!same(b.conditions,d.modelConditions))return {status:'incompatible',reason:'MODEL_CONDITIONS_CHANGED'};
        if(!reliable(current))return {status:'incompatible',reason:'AMBIGUOUS_IDENTITY'};
        if(b.expiresAt!==null&&now>=b.expiresAt)return {status:'stale',reason:'BASELINE_EXPIRED'};
        if(b.sourceRevision!==current.sourceRevision||!same(b.slots,current.slots))return {status:'stale',reason:'SOURCE_CHANGED'};
        return {status:'valid',reason:null};
    }
    function materialize(b,d,current,now){
        const result=assess(b,d,current,now);
        requireValue(result.status==='valid',result.reason);
        // 返回试算用语义输入，绝不生成 mcData 或调用保存；评分兼容转换留给后续阶段。
        const slots=copy(b.slots);slots[d.targetSlot-1].echo=copy(d.candidate.echo);
        return freeze({role:copy(b.role),modelVersion:b.modelVersion,conditions:copy(d.modelConditions),slots});
    }
    return {SCHEMA_VERSION,canonical,createBaseline,createCandidate,createDraft,updateDraft,validateBaseline,validateCandidate,validateDraft,assess,materialize};
});
