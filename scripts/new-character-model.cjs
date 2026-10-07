// Public skill facts and explicit rotation assumptions: docs/character-weights-57-63.md.
// This pure factory is embedded in base.js by sync-new-character-model.cjs.
function createNewCharacterModels() {
    const ids = [57, 58, 59, 60, 61, 62, 63];
    const types = ['normal', 'skill', 'heavy', 'liberate', 'other'];
    const elements = ['导电', '衍射', '湮灭', '气动', '热熔', '冷凝'];
    const primary = {57:'导电',58:'导电',59:'湮灭',60:'冷凝',61:'气动',62:'热熔',63:'导电'};
    const settings = {
        57: {label:'输出循环', modes:[['quick','短按超负荷·速切'],['critical','长按超负荷·临界共鸣']]},
        58: {label:'输出循环', modes:[['quick','短按超负荷·速切'],['critical','长按超负荷·临界共鸣']]},
        59: {modes:[['cycle','苍／羽完整循环']]},
        60: {label:'评分用途', modes:[['support','治疗辅助'],['damage','自身输出']]},
        61: {label:'循环情景', modes:[['sustained','持续循环'],['opening','首轮爆发']]},
        62: {label:'循环情景', modes:[['sustained','持续循环'],['opening','首轮爆发']]},
        63: {label:'共鸣模态', modes:[['unison','同奏'],['electro','电磁']]}
    };
    const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
    const round = n => Number(n.toFixed(6));
    function modeFor(role) {
        const modes = settings[Number(role.roleListId)].modes;
        return modes.some(m => m[0] === role.damageMode) ? role.damageMode : modes[0][0];
    }
    function packets(role) {
        const id = Number(role.roleListId), c = clamp(parseInt(role.ming)||0,0,6), mode = modeFor(role);
        const parts = [];
        let attack = 2500, bonus = 2, cd = 2.8, crit = .8;
        const add = (type, budget, extra = {}) => parts.push({type,budget,attack,bonus,cd,crit,element:primary[id],...extra});
        if (id === 57 || id === 58) {
            add('normal',mode === 'quick' ? 12 : 6);
            add('skill',mode === 'quick' ? 8 : 4);
            add('skill',32*(c>=3?1.2:1),{tag:'overload'});
            add('liberate',18*(c>=4?1.2:1));
            add('other',5);
            add('other',5*(c>=2?1.5:1),{fixed:true,tag:'electro'});
            if (mode === 'critical') {
                // One ground chain: all multi-element packets retain SKILL damage classification.
                for (const [element,budget] of [['衍射',12],['湮灭',12],['气动',16],['导电',15]]) {
                    add('skill',budget*(c>=6?1.2:1),{element,bonus:bonus+.2,cd:cd+(c>=5?.2:0),tag:'critical'});
                }
            }
        } else if (id === 59) {
            if (c>=4) attack += 200;
            const heavy = c>=6 ? 1.4 : 1;
            add('normal',8);
            add('skill',2);
            add('heavy',10*heavy,{tag:'switch'});
            // Both swords in one rotation; +160% stance CD and assumed full +150% feather oath.
            add('heavy',55*(c>=2?2:1)*heavy,{cd:cd+3.1,tag:'stance'});
            add('liberate',18*(c>=3?2.75:1));
            add('other',5);
            add('other',2*(c>=3?1.5:1),{fixed:true});
            if(c>=1) add('heavy',2*337.98/60*heavy,{tag:'c1'});
            if(c>=6) add('heavy',5*337.98/60*heavy,{crit:1,guaranteed:true,tag:'c6'});
        } else if (id === 60) {
            if(c>=2) cd += .5;
            add('normal',c>=3?6:12);
            add('normal',10*(c>=5?2:1));
            add('heavy',5*(c>=5?2:1));
            add('skill',8);
            // Intro directly enters the rain stance; do not also invent an awakening in this rotation.
            // Shared passive once per 25s: +80% CR is capped, +240% elemental bonus.
            add('other',55,{health:true,crit:1,guaranteed:true,cd:cd+(c>=6?5:0),bonus:bonus+2.4,tag:'intro'});
            add('other',5);
            add('other',5,{fixed:true});
        } else if (id === 61) {
            if(c>=1) crit = .96;
            if(c>=4) attack += 200;
            const stacks = c>=2?25:15;
            const lock = 1 + stacks*.02 + .35;
            const final = c>=6?1.4:1;
            add('normal',6);
            add('normal',24,{multiplier:lock*lock});
            add('heavy',10*(c>=2?1.4:1)*final,{multiplier:lock*lock});
            add('heavy',30*(c>=3?1+stacks*.03:1)*final,{multiplier:lock*lock});
            add('skill',8*(c>=5?2:1));
            add('liberate',17*final,{cd:cd+(c>=3?1:0),multiplier:lock*lock});
            add('other',5);
            // C1 stacks are consumed together; only C6 replenishes them in sustained rotations.
            if(c>=1 && (mode==='opening'||c>=6)) add('normal',400/60*(1+25*.04)*final,{multiplier:c>=6?lock*lock:1,tag:'greatsword'});
            // Harmony is a common final multiplier, so cancels from echo stat proportions.
        } else if (id === 62) {
            const hp = clamp(Number(role.referenceHealth)||40000,15000,70000);
            const capped = Math.min(hp,50000);
            attack += capped*(c>=3?.05:.036);
            bonus += capped*.000015 + (c>=4?.2:0);
            const heavy = c>=6?1.4:1;
            const fire = 1+clamp(hp-25000,0,25000)*.00009;
            add('normal',3);
            add('heavy',10*heavy);
            add('skill',12*(c>=1?1.8:1));
            add('heavy',40*fire*(c>=2?1.46:1)*(mode==='opening'&&c>=2?1.45:1)*heavy,{tag:'lifeFire'});
            add('heavy',18*heavy); // Liberation explicitly deals heavy damage.
            add('heavy',12*(c>=6?1.8*3:1)*heavy,{tag:'ghosts'}); // Four regular + eight C6 summons.
            add('other',5);
        } else if (id === 63) {
            if(mode==='unison') attack += 500;
            else bonus += .5; // Two passive stacks, no unselected teammate/weapon buffs.
            if(c>=4) bonus += .2;
            const skill = c>=6?1.4*(2/1.8):1;
            const unisonStacks = c>=6?4:3;
            add('normal',mode==='unison'?12:17);
            add('skill',10*skill);
            add('skill',34*(c>=2?1.6:1)*skill,{tag:'heavyConverted'});
            add('skill',25*(c>=3?1.7:1)*skill,{cd:cd+(mode==='unison'&&c>=3?.2+.15*unisonStacks:0),tag:'liberationConverted'});
            add('liberate',6,{tag:'coordinated'});
            add('other',(mode==='unison'?13:8)*(mode==='unison'&&c>=1?1.15+.1*unisonStacks:1),{tag:'intro'});
            if(mode==='electro') {
                const fixedCrit = c>=6?1+.8*(2.3-1):1;
                // 50 Thunderheart stacks assumed: C0 17.5 times, C1 21 times, C3 +15 times.
                add('other',20*((c>=1?21:17.5)+(c>=3?15:0))/17.5*fixedCrit,{fixed:true,tag:'electro'});
            }
        }
        return parts.map(p=>({...p,damage:p.fixed?p.budget:p.budget*(p.health?1:p.attack/2500)*(p.bonus/2)*(1+p.crit*(p.cd-1))/2.44*(p.multiplier||1)}));
    }
    function reference(role) {
        const id=Number(role.roleListId), support=id===60&&modeFor(role)==='support';
        const names=['暴击','暴伤','大攻击','小攻击','共鸣效率','普攻伤害','技能伤害','重击伤害','解放伤害','大生命','小生命','大防御','小防御'];
        let values=[52.5,105,58,120,37.2,0,0,0,0,0,0,0,0];
        if(id===57||id===58||id===63) values[6]=46.4;
        if(id===59||id===61) values[7]=46.4;
        if(id===62) values=[52.5,105,23.2,0,37.2,0,0,23.2,0,58,1740,0,0];
        if(id===60) values=support?[0,0,0,0,62,0,0,0,0,58,2900,0,0]:[52.5,105,0,0,37.2,0,23.2,0,0,58,1040,0,0];
        return names.map((name,i)=>({name,property:String(values[i])+([3,10,12].includes(i)?'':'%')}));
    }
    function profile(role) {
        const id=Number(role.roleListId), parts=packets(role), total=parts.reduce((s,p)=>s+p.damage,0);
        const weighted=f=>parts.reduce((s,p)=>s+(p.fixed?0:p.damage*f(p)),0)/total;
        const weights=Object.fromEntries(types.map(t=>[t,round(parts.filter(p=>p.type===t).reduce((s,p)=>s+p.damage,0)/total)]));
        weights.other=round(1-types.slice(0,4).reduce((s,t)=>s+weights[t],0));
        weights.anomalyShare=round(parts.filter(p=>p.fixed).reduce((s,p)=>s+p.damage,0)/total);
        const rule={ruleId:clamp(parseInt(role.ming)||0,0,6),attack01:2500*weighted(p=>p.health?0:1/p.attack),attack02:250*weighted(p=>p.health?0:1/p.attack),
            crit:2.5*weighted(p=>p.guaranteed?0:(p.cd-1)/(1+p.crit*(p.cd-1))),critDamage:2.5*weighted(p=>p.crit/(1+p.crit*(p.cd-1))),
            property:2.5*weighted(p=>1/p.bonus),health01:0,health02:0,defense01:0,defense02:0,defenseLimit:40,efficiency01:.5,efficiency02:0,unike:1.25,treat:0};
        // Named elements keep mixed-element Rover bonuses separate; legacy 属伤 means primary element.
        rule.elements=Object.fromEntries(elements.map(e=>[e,2.5*weighted(p=>p.element===e?1/p.bonus:0)]));
        rule.property=rule.elements[primary[id]];
        if(id===60) {
            // HP 35k / base HP 16,712 reference. Support score measures healing/energy, not team DPS.
            rule.health01=250*167.12/35000*weighted(p=>p.health?1:0);
            rule.health02=rule.health01/167.12;
            if(modeFor(role)==='support') Object.assign(rule,{attack01:0,attack02:0,crit:0,critDamage:0,property:0,health01:1,health02:1/167.12,unike:0,treat:1.2,defenseLimit:100,efficiency01:1.2,elements:{}});
        }
        if(id===62) {
            const hp=clamp(Number(role.referenceHealth)||40000,15000,70000);
            // Forward marginal derivative includes HP->ATK, elemental bonus and life-fire multiplier.
            const next=packets({...role,referenceHealth:hp+1}).reduce((s,p)=>s+p.damage,0);
            rule.health02=hp>=50000?0:250*(next-total)/total;
            rule.health01=rule.health02*153.75;
        }
        for(const key of Object.keys(rule)) if(typeof rule[key]==='number') rule[key]=round(rule[key]);
        for(const e of Object.keys(rule.elements)) rule.elements[e]=round(rule.elements[e]);
        // Per-type sensitivity matters for packets with innate bonus, fixed damage or HP scaling.
        rule.typeCoefficients=Object.fromEntries(types.slice(0,4).map(t=>[t,round(id===60&&modeFor(role)==='support'?0:2.5*weighted(p=>p.type===t?1/p.bonus:0))]));
        const coefficients={'暴击':rule.crit,'暴伤':rule.critDamage,'大攻击':rule.attack01,'小攻击':rule.attack02,'共鸣效率':rule.efficiency01,
            '普攻伤害':rule.typeCoefficients.normal,'技能伤害':rule.typeCoefficients.skill,'重击伤害':rule.typeCoefficients.heavy,'解放伤害':rule.typeCoefficients.liberate,'大生命':rule.health01,'小生命':rule.health02};
        const ref=reference(role);
        let main=22*rule.crit+60*rule.property+36*rule.attack01+350*rule.attack02+4560*rule.health02;
        if(id===62||id===60) main=22*rule.crit+60*rule.property+45.6*rule.health01+350*rule.attack02+4560*rule.health02;
        if(id===60&&modeFor(role)==='support') main=26.4*rule.treat+64*rule.efficiency01+45.6*rule.health01+4560*rule.health02;
        const er=Number.parseFloat(ref[4].property)+(id===60&&modeFor(role)==='support'?64:0);
        weights.maxscore=round(main+ref.reduce((s,p)=>s+parseFloat(p.property)*(coefficients[p.name]||0),0)-(rule.efficiency01-rule.efficiency02)*Math.max(0,er-rule.defenseLimit));
        return {weights,rule,reference:ref};
    }
    function install(roles, refs) {
        for(const id of ids) {
            const modeProfiles={};
            for(const [mode] of settings[id].modes) modeProfiles[mode]=Array.from({length:7},(_,ming)=>profile({roleListId:id,ming,damageMode:mode}));
            const profiles=modeProfiles[settings[id].modes[0][0]];
            Object.assign(roles[id-1],profiles[0].weights);
            refs[id-1]={id,propertyList:profiles[0].reference,mzProperty:profiles.slice(1).map(p=>p.weights),mzRule:profiles.slice(1).map(p=>p.rule),modeProfiles};
        }
    }
    return {ids,settings,modeFor,packets,profile,reference,install};
}
module.exports = {createNewCharacterModels};
