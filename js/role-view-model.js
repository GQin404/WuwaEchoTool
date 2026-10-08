/* Pure data adapter. No DOM, storage, selection state, or automatic initialization. */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.RoleViewModel = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';
    const copy = value => value == null ? null : JSON.parse(JSON.stringify(value));
    const round = value => Number(value.toFixed(2));
    const percentNames = new Set(['暴击','暴伤','大攻击','大生命','大防御','共鸣效率','属伤','治疗','普攻伤害','重击伤害','技能伤害','解放伤害','导电伤害','衍射伤害','湮灭伤害','气动伤害','热熔伤害','冷凝伤害']);
    const flatNames = new Set(['小攻击','小生命','小防御','生命']);
    // These are the manual main-stat strings explicitly understood by countMainAttr.
    const manualMains = new Set(['暴击22%','暴击22.0%','暴伤44%','暴伤44.0%','生命33%','攻击力33%','防御41.8%','治疗26.4%','攻击力30%','属伤30%','生命30%','共鸣效率32%','防御38%','攻击力18%','攻击18%','生命22.8%','防御18%', ...['导电','衍射','湮灭','气动','热熔','冷凝'].map(x=>x+'伤害30%')]);
    function numeric(value) {
        if (typeof value !== 'string' && typeof value !== 'number') return null;
        const text = String(value).trim();
        if (!/^\d+(?:\.\d+)?%?$/.test(text)) return null;
        const number = Number(text.replace('%',''));
        return Number.isFinite(number) ? number : null;
    }
    function stat(input) {
        if (!input) return {status:'missing', property:null, value:null, unit:null, raw:copy(input)};
        const property = typeof input.property === 'string' ? input.property : null;
        const value = numeric(input.value);
        const unit = percentNames.has(property) ? '%' : flatNames.has(property) ? 'flat' : null;
        const mismatch = unit === 'flat' && String(input.value).includes('%');
        return {status:!unit ? 'unsupported' : value === null || mismatch ? 'invalid' : 'valid', property, value, unit, raw:copy(input)};
    }
    function mainStat(raw) {
        if (typeof raw !== 'string') return stat(raw);
        const match = raw.match(/^(.+?)(\d+(?:\.\d+)?%)$/);
        if (!match || !manualMains.has(raw)) return {status:raw ? 'unsupported' : 'missing',property:null,value:null,unit:null,raw};
        const aliases = {'攻击':'大攻击','攻击力':'大攻击','生命':'大生命','防御':'大防御'};
        return {...stat({property:aliases[match[1]] || match[1],value:match[2]}),raw};
    }
    function createAdapter(api) {
        for (const name of ['getRoleScoreConfig','getScoreDetails','countScores','countMainAttr','countMainAttr2','getRoleEnergyCorrection']) {
            if (typeof api[name] !== 'function') throw new TypeError('Missing scoring API: '+name);
        }
        return function normalizeRole(input) {
            if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Expected a role record');
            // Legacy calculators receive a detached copy, never the caller's record.
            const role = copy(input), issues = [];
            const master = (api.roleList || []).find(x=>String(x.id)===String(role.roleListId));
            let config = null;
            if (master) {
                try {
                    config = api.getRoleScoreConfig(role);
                    if (!config || !Number.isFinite(config.weights?.maxscore) || config.weights.maxscore<=0) config=null;
                } catch (_) { config=null; }
            }
            if (!config) issues.push({code:'model-unavailable'});
            function calculate(fn) {
                if (!config) return null;
                try { const n=Number(fn()); return Number.isFinite(n)?n:null; } catch (_) { return null; }
            }
            function withContribution(s) {
                let detail=null;
                if (config && s.status==='valid') {
                    try { detail=api.getScoreDetails({property:s.property,value:String(s.value)+(s.unit==='%'?'%':'')},role); } catch (_) { /* Invalid model is unavailable, not zero. */ }
                }
                const valid=detail&&Number.isFinite(detail.rawScore)&&Number.isFinite(detail.coefficient)&&Number.isFinite(Number(detail.score));
                return {...s,contribution:valid?Number(detail.score):null,rawContribution:valid?detail.rawScore:null,coefficient:valid?detail.coefficient:null,
                    scoreStatus:!valid?'unavailable':detail.coefficient===0?'not-scored':detail.rawScore>0?'positive':'zero-value'};
            }
            const list = Array.isArray(role.costList) ? role.costList : [];
            if (!Array.isArray(role.costList)) issues.push({code:'loadout-missing'});
            if (list.length>5) issues.push({code:'extra-slots',count:list.length-5});
            const ids = list.map(x=>x?.costId).filter(x=>x!=null).map(String);
            if (new Set(ids).size!==ids.length) issues.push({code:'duplicate-cost-id'});
            const totals = new Map();
            const slots = Array.from({length:5},(_,index)=>{
                const source=list[index];
                const key='position-'+(index+1);
                if (!source || typeof source!=='object' || Array.isArray(source)) return {key,position:index+1,status:'empty',echo:null};
                const catalog=(api.costList || []).find(x=>String(x.id)===String(source.costListId));
                const costMatch=/^Cost([134])$/.exec(source.type || '');
                const cost=costMatch?Number(costMatch[1]):null;
                const main=mainStat(source.mainAtrri);
                const words=Array.isArray(source.propertyList)?source.propertyList:[];
                const substats=words.map(word=>withContribution(stat(word)));
                const wordNames=substats.map(x=>x.property);
                const validWords=Array.isArray(source.propertyList)&&words.length<=5&&new Set(wordNames).size===wordNames.length&&substats.every(x=>x.status==='valid'&&x.contribution!==null);
                substats.filter(x=>x.status==='valid').forEach(s=>{
                    const k=s.property+'|'+s.unit;
                    const old=totals.get(k)||{property:s.property,unit:s.unit,value:0};
                    totals.set(k,{...old,value:round(old.value+s.value)});
                });
                const mainContribution=cost && main.status==='valid' ? calculate(()=>typeof source.mainAtrri==='string'
                    ? api.countMainAttr(copy(source),role)
                    : Number(api.countMainAttr2(copy(source),role))+Number(api.countScores({property:main.property,value:String(main.value)+(main.unit==='%'?'%':'')},role))) : null;
                const subContribution=validWords?round(substats.reduce((sum,s)=>sum+s.contribution,0)):null;
                const score=mainContribution!==null&&subContribution!==null?round(mainContribution+subContribution):null;
                const complete=score!==null&&words.length===5;
                if (!complete) issues.push({code:'slot-incomplete',position:index+1});
                const image = typeof source.imgCode==='string' && /^https?:\/\//.test(source.imgCode) ? source.imgCode : catalog?.imgCode || null;
                return {key,position:index+1,status:complete?'complete':'incomplete',echo:{
                    id:source.costId??null,catalogId:source.costListId??null,name:source.name||catalog?.name||null,cost,image,
                    suite:typeof source.suite==='string'&&/^https?:\/\//.test(source.suite)?{name:null,icon:source.suite}:{name:source.suite||null,icon:null},
                    mainStat:main,substats,openedCount:words.length,
                    positiveContributionCount:validWords?substats.filter(x=>x.contribution>0).length:null,
                    effectiveCount:validWords?substats.filter(x=>x.rawContribution>0).length:null,
                    effectiveScope:'positive-model-contribution-before-loadout-correction',
                    score:{value:score,mainAndFixed:mainContribution,substats:subContribution,cached:numeric(source.sumScores),scope:'role-score-contribution'},
                    // No level, set identity, active/main echo or cross-import identity is inferred.
                    energy:main.status==='valid'&&validWords ? (main.property==='共鸣效率'?main.value:0)+substats.filter(x=>x.property==='共鸣效率').reduce((sum,s)=>sum+s.value,0):null
                }};
            });
            const echoes=slots.filter(s=>s.echo).map(s=>s.echo);
            const costTotal=echoes.every(e=>e.cost!==null)?echoes.reduce((sum,e)=>sum+e.cost,0):null;
            if (costTotal>12) issues.push({code:'cost-limit-exceeded',value:costTotal});
            const complete=slots.every(s=>s.status==='complete')&&issues.length===0;
            const knownContribution=round(echoes.reduce((sum,e)=>sum+(e.score.value??0),0));
            const energy=echoes.every(e=>e.energy!==null)?echoes.reduce((sum,e)=>sum+e.energy,0):null;
            const correction=complete&&energy!==null?calculate(()=>api.getRoleEnergyCorrection(role,energy)):null;
            const score=correction!==null?round(knownContribution+correction):null;
            const values=echoes.map(e=>e.score.value).filter(x=>x!==null);
            return {
                schemaVersion:1,
                role:{id:role.roleId??null,catalogId:role.roleListId??null,name:role.name||master?.name||null,source:role.isImport===true?'imported':'manual',level:numeric(role.level),portrait:master?.cls?'image/characters/'+master.cls.replace('mcr-','')+'.png':null},
                model:{status:config?'available':'unavailable',chain:Math.max(0,Math.min(6,parseInt(role.ming)||0)),requestedMode:role.damageMode??null,extraEnergy:role.extraEnergy??null,configuration:copy(config)},
                slots,
                scale:{min:0,max:Math.max(100,Math.ceil(Math.max(0,...values)/10)*10),unit:'score-points',scope:'role-score-contribution',shared:true},
                summary:{status:complete&&score!==null?'complete':'incomplete',score,cachedScore:numeric(role.totalScore),knownContribution,energyCorrection:correction,costTotal,substatTotals:[...totals.values()],totalsScope:'known-substats-only',
                    weakestPositions:complete&&values.length===5?slots.filter(s=>s.echo.score.value===Math.min(...values)).map(s=>s.position):[]},
                issues
            };
        };
    }
    return {createAdapter};
});
