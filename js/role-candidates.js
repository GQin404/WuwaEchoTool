/* 候选适配仅在兼容边界使用旧属性名，不复用旧编辑器 DOM 或保存入口。 */
(function(root,factory){
    if(typeof module==='object'&&module.exports)module.exports=factory(require('./stat-keys.js'),require('./role-draft-model.js'));
    else root.RoleCandidates=factory(root.StatKeys,root.RoleDraftModel);
})(typeof globalThis!=='undefined'?globalThis:this,function(keys,drafts){
    'use strict';
    const copy=x=>JSON.parse(JSON.stringify(x));
    const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
    const MAIN={1:['atk_percent','hp_percent','def_percent'],3:['atk_percent','hp_percent','def_percent','resonance_efficiency','elemental_damage','electro_damage','spectro_damage','havoc_damage','aero_damage','fusion_damage','glacio_damage'],4:['atk_percent','hp_percent','def_percent','crit_rate','crit_damage','healing_bonus']};
    const SUB=['crit_rate','crit_damage','atk_percent','atk_flat','hp_percent','hp_flat','def_percent','def_flat','resonance_efficiency','basic_attack_damage','heavy_attack_damage','resonance_skill_damage','resonance_liberation_damage'];
    const unit=key=>key?.endsWith('_flat')?'flat':'percent';
    function editor(echo=null){
        const stat=s=>({key:s?.key||'',value:s?.value??''});
        return {catalogId:echo?.catalogId??'',suiteId:echo?.suite?.id??echo?.suiteId??null,cost:echo?.cost??3,mainStat:stat(echo?.mainStat),substats:Array.from({length:5},(_,i)=>stat(echo?.substats[i]))};
    }
    function createAdapter(normalize){
        function fromRecord(record,role){
            const source=copy(record||{});
            return normalize({...copy(role),isImport:typeof source.mainAtrri==='object',costList:[source]}).slots[0];
        }
        function fromEditor(fields,role,identity){
            const convert=s=>({property:keys.keyToLegacy[s.key]||null,value:s.value===''||s.value===null?'':String(s.value)+(unit(s.key)==='percent'?'%':'')});
            const slot=fromRecord({costId:identity,costListId:fields.catalogId||null,type:'Cost'+fields.cost,mainAtrri:convert(fields.mainStat),
                propertyList:fields.substats.filter(s=>s.key||s.value!=='').map(convert)},role);
            slot.echo.suite.id=fields.suiteId??null;return slot;
        }
        function eligibility(baseline,position,slot,scope){
            const e=slot?.echo,ids=scope.map(x=>x==null?null:String(x));
            if(e?.catalogId==null)return {status:'blocked',reason:'identity'};
            if(!baseline.slots[position-1]?.echo||baseline.identityState!=='reliable')return {status:'blocked',reason:'identity'};
            if(!e||e.id==null||String(e.id).trim()===''||ids.filter(x=>x===String(e.id)).length!==1)return {status:'blocked',reason:'identity'};
            if(baseline.slots.some(s=>s.position!==position&&s.echo?.identity===String(e.id)))return {status:'blocked',reason:'equipped'};
            if(baseline.modelStatus!=='available')return {status:'blocked',reason:'model'};
            const total=baseline.slots.reduce((n,s)=>n+(s.position===position?0:s.echo?.cost||0),0)+e.cost;
            if(!MAIN[e.cost]||total>12||baseline.slots.some(s=>s.echo&&s.echo.cost===null))return {status:'blocked',reason:'cost'};
            if(e.mainStat.status!=='valid'||!MAIN[e.cost].includes(e.mainStat.key))return {status:'blocked',reason:'main'};
            if(e.score.mainAndFixed===null)return {status:'blocked',reason:'model'};
            if(slot.status!=='complete'||e.substats.some(s=>s.contribution===null))return {status:'incomplete',reason:'incomplete'};
            return {status:'ready',reason:'ready'};
        }
        function prepare(baseline,position,slot,options){
            const check=eligibility(baseline,position,slot,options.identityScope);
            if(check.status==='blocked')return {eligibility:check,candidate:null};
            return {eligibility:check,candidate:drafts.createCandidate(slot.echo,{...options,completeness:slot.status})};
        }
        return {fromRecord,fromEditor,eligibility,prepare};
    }
    function context(baseline,draft,current,now,locale,eligibility){
        const validity=drafts.assess(baseline,draft,current,now);
        if(validity.status!=='valid')return {validity,context:null};
        if(!eligibility||eligibility.status==='blocked')return {validity,context:null};
        return {validity,context:freeze(copy({baseline,draft,targetSlot:draft.targetSlot,currentEcho:baseline.slots[draft.targetSlot-1].echo,
            candidate:draft.candidate,model:{version:baseline.modelVersion,conditions:draft.modelConditions},validity,
            eligibility,locale,register:{roleId:baseline.role.identity,view:'register',selectedSlot:draft.targetSlot},conclusion:null}))};
    }
    return {MAIN,SUB,unit,editor,createAdapter,context};
});
