/* 比较只解释现有副词条模型；数值方向与收益判断分开保存。 */
(function(root,factory){
    if(typeof module==='object'&&module.exports)module.exports=factory(require('./role-draft-model.js'),require('./role-candidates.js'));
    else root.RoleCompare=factory(root.RoleDraftModel,root.RoleCandidates);
})(typeof globalThis!=='undefined'?globalThis:this,function(drafts,candidates){
    'use strict';
    const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
    function evaluate({baseline,draft,current,role,normalize,conditions={},now=Date.now()}){
        const validity=drafts.assess(baseline,draft,current,now);
        const result={scope:'substats-only',validity,conclusion:'incompatible',rows:[],gains:[],losses:[],unknown:[],requirements:[],missing:[],targetSlot:draft.targetSlot};
        if(validity.status!=='valid')return freeze(result);
        const adapter=candidates.createAdapter(normalize),old=baseline.slots[draft.targetSlot-1].echo,next=draft.candidate.echo;
        const a=adapter.fromEditor(candidates.editor(old),role,old.identity),b=adapter.fromEditor(candidates.editor(next),role,next.identity);
        result.breakdown={current:a.echo.substats,candidate:b.echo.substats};
        const eligibility=adapter.eligibility(baseline,draft.targetSlot,b,[next.identity]);
        if(eligibility.status==='blocked')return freeze({...result,validity:{status:'incompatible',reason:eligibility.reason}});
        if(baseline.slots.some(s=>!s.echo||s.echo.completeness!=='complete')||next.completeness!=='complete'||[a,b].some(s=>s.echo.substats.some(t=>t.contribution===null))){
            result.conclusion='insufficient-data';return freeze(result);
        }
        const add=(key,unit,x,y,judgement)=>{
            const delta=Number((y-x).toFixed(8));
            result.rows.push({key,unit,current:x,candidate:y,delta,direction:delta>0?'increase':delta<0?'decrease':'unchanged',judgement:delta===0?'neutral':judgement(delta)});
        };
        add('score','score',a.echo.score.substats,b.echo.score.substats,d=>d>0?'gain':'loss');
        add('effective','integer',a.echo.effectiveCount,b.echo.effectiveCount,()=> 'unknown');
        const totals=e=>Object.fromEntries(e.substats.map(s=>[s.key,s.value]));
        const av=totals(a.echo),bv=totals(b.echo);
        const keys=[...new Set(['crit_rate','crit_damage','atk_percent','atk_flat','resonance_efficiency',...Object.keys(av),...Object.keys(bv)])];
        for(const key of keys){
            const scored=[...a.echo.substats,...b.echo.substats].some(s=>s.key===key&&s.coefficient>0);
            add(key,candidates.unit(key),av[key]||0,bv[key]||0,d=>key==='resonance_efficiency'?'unknown':scored?(d>0?'gain':'loss'):'unknown');
        }
        // 未建模的差异必须由玩家显式确认，不能由分数替代装备适用性判断。
        if(old.cost!==next.cost||drafts.canonical(old.mainStat)!==drafts.canonical(next.mainStat)||old.catalogId!==next.catalogId||old.suiteId!==next.suiteId||old.suiteId===null)result.requirements.push('equipment');
        if(result.rows.some(r=>r.key==='resonance_efficiency'&&r.delta!==0)||([old.mainStat,next.mainStat].some(s=>s.key==='resonance_efficiency')&&drafts.canonical(old.mainStat)!==drafts.canonical(next.mainStat)))result.requirements.push('energy');
        if(result.rows.some(r=>r.key!=='score'&&r.delta!==0&&(r.judgement==='loss'||r.judgement==='unknown')))result.requirements.push('tradeoffs');
        result.missing=result.requirements.filter(k=>conditions[k]!==true);
        result.gains=result.rows.filter(r=>r.delta!==0&&r.judgement==='gain').map(r=>r.key);
        result.losses=result.rows.filter(r=>r.delta!==0&&r.judgement==='loss').map(r=>r.key);
        result.unknown=result.rows.filter(r=>r.delta!==0&&r.judgement==='unknown').map(r=>r.key);
        result.conclusion=result.missing.length?'needs-condition':result.rows[0].delta>0?'recommended':'keep-current';
        result.rows.sort((a,b)=>Number(b.delta!==0)-Number(a.delta!==0));
        return freeze(result);
    }
    return {evaluate};
});
