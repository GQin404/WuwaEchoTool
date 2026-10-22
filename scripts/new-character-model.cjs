// 来源与循环假设见 docs/character-weights-54-56.md、character-weights-57-63.md 及 suoming-share-estimate.md。
// 此纯模型由 sync-new-character-model.cjs 嵌入 base.js。
function createNewCharacterModels() {
    const ids = [54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64];
    const types = ['normal', 'skill', 'heavy', 'liberate', 'other'];
    const elements = ['导电', '衍射', '湮灭', '气动', '热熔', '冷凝'];
    const primary = {54:'衍射',55:'导电',56:'冷凝',57:'导电',58:'导电',59:'湮灭',60:'冷凝',61:'气动',62:'热熔',63:'导电',64:'导电'};
    // 库街区技能十级倍率。次数、覆盖率与偏谐参考基数是模型假设，不是官方占比。
    const missingCharacterFacts = {
        lucy: {
            intro:69.14*2, preparationNormal:20.66+20.05*2+36.06*2+48.08,
            preparationHeavy:56.86*4+18.96*3,
            payload:20.05+10.03+40.09+10.03+20.05, pulse:30.86*2+61.72*4,
            deadlock:51.70+206.77, compressedNormal:19.49*4+22.27*5+28.12*5+25.06*5,
            doubleThread:33.41*5, multiThread:59.65*4,
            network:894.65, darknet:1789.29, cluster:79.53, motion:911.83,
            response:1094.19+68.39*4, pulseC2:450
        },
        rebecca: {
            intro:27.04*6+40.56+67.60, skill:23.66*4+35.49*4,
            hunterNormal:36.76*2+19.13*5+109.85,
            ironNormal:61.69*2+84.50+33.77*2+157.57,
            hunterDodge:16.90*5, ironDodge:101.40,
            hunterFinish:19.89*4+318.10, ironFinish:278.34,
            gun:[24.30,48.60,72.90], firework:63.62+572.58,
            turret:2.5, response:2358.89, finishC6:900
        },
        lucilla: {
            intro:97.42, skillSetup:13.26*3, chaseLight:82.35*2+274.48+109.80,
            liberation:142.74, memoryFirst:30.64+45.95, memorySecond:59.77+89.65,
            memoryThird:52.12*8, forget:285.48, departure:84.81*3+593.64
        }
    };
    const suomingFacts = {
        introClosed:110.89*2+36.97*4, introOpen:131.43*3+65.72*2,
        openFirst:65.42+32.71*2, openSecond:114.40+38.14*3,
        openThird:58.64*4, openFourth:107.25*2+47.67*3,
        skill:106.61, noAbandon:152.67, finisher:1551.41,
        finisherHold:19.40*10+24.24*8, liberation:60.89*8+208.76,
        thunder:59.65, echo:91.18*3
    };
    const settings = {
        54: {label:'输出循环', modes:[['lucyDarknet','暗网深潜·完整循环'],['lucyNetwork','网络行者·速切']]},
        55: {label:'输出循环', modes:[['rebeccaQuick','快速协奏·提前收枪'],['rebeccaBurst','机枪爆发·持续'],['rebeccaOpening','机枪爆发·首轮']]},
        56: {label:'模态／情景', modes:[['lucillaEcho','声骸·持续'],['lucillaEchoOpening','声骸·首轮'],['lucillaFrost','霜渐·持续'],['lucillaFrostOpening','霜渐·首轮']]},
        57: {label:'输出循环', modes:[['quick','短按超负荷·速切'],['critical','长按超负荷·临界共鸣']]},
        58: {label:'输出循环', modes:[['quick','短按超负荷·速切'],['critical','长按超负荷·临界共鸣']]},
        59: {modes:[['cycle','苍／羽完整循环']]},
        60: {label:'评分用途', modes:[['support','治疗辅助'],['damage','自身输出']]},
        61: {label:'循环情景', modes:[['sustained','持续循环'],['opening','首轮爆发']]},
        62: {label:'循环情景', modes:[['sustained','持续循环'],['opening','首轮爆发']]},
        63: {label:'共鸣模态', modes:[['unison','同奏'],['electro','电磁']]},
        64: {label:'输出循环', modes:[['unison','同奏速切·持续'],['unisonOpening','同奏速切·首轮'],['contract','禁锁契主·持续'],['contractOpening','禁锁契主·首轮']]}
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
        if (id === 54) {
            const f=missingCharacterFacts.lucy, dark=mode==='lucyDarknet';
            if(c>=1) attack+=200;
            if(c>=4) bonus+=.2;
            const heavy=c>=6?1.4:1;
            add('normal',f.preparationNormal,{tag:'preparationNormal'});
            add('heavy',f.preparationHeavy*heavy,{tag:'preparationHeavy'});
            add('skill',f.payload+f.pulse,{tag:'preparationSkill'});
            add('other',f.intro,{tag:'intro'});
            if(c>=2)add('heavy',f.pulseC2*heavy,{tag:'pulseC2'});
            if(dark) {
                bonus+=.65;
                add('heavy',f.deadlock*heavy,{tag:'deadlock'});
                add('heavy',f.compressedNormal*heavy,{tag:'compressedNormal'});
                add('heavy',f.doubleThread*heavy,{tag:'doubleThread'});
                add('heavy',f.multiThread*(c>=2?6.6:3.7)*heavy,{tag:'multiThreadSQL'});
            }
            add('heavy',(dark?f.darknet:f.network)*(c>=3?1.5:1)*heavy,{tag:'overwrite',cd:cd+(c>=3?1:0)});
            // 示例协议选择：全部优先运动失能，32 Ram 剩余的2点用于集群入侵，不虚构无限施放。
            const ram=c>=2?32:24, motionCount=Math.floor(ram/6), clusterCount=Math.floor((ram%6)/2);
            if(clusterCount)add('heavy',clusterCount*f.cluster*heavy,{tag:'cluster'});
            // 固定包不吃攻击、面板双暴或四类专项；偏谐基数10000仅为显式参考假设。
            const dissonanceScale=10000/(2500*2*2.44);
            add('other',motionCount*f.motion*dissonanceScale*(c>=3?1.65:1)*(c>=6?1.6:1),{fixed:true,tag:'motion',count:motionCount,ram});
            add('other',f.response*dissonanceScale*(c>=3?1.65:1)*(c>=6?1.6:1),{fixed:true,tag:'hackingResponse',count:1});
        } else if (id === 55) {
            const f=missingCharacterFacts.rebecca, quick=mode==='rebeccaQuick', opening=mode==='rebeccaOpening';
            // 两层固有攻击和解放团队攻击按覆盖估算，合计基础攻击的40%。
            attack+=400;
            if(c>=2)bonus+=.2;
            const amplification=c>=2?1.15:1, fullHot=!opening||c>=3;
            const hotScale=c>=4?1.6:1;
            const fullCD=.3*hotScale, fullIgnore=.15*hotScale;
            const normalScale=c>=6?1.4:1;
            const normalBonus=(c>=5?.2:0)*normalScale;
            const addMode=(type,budget,tag,stance='both')=>{
                const dual=fullHot||stance==='both';
                const ignore=dual?fullIgnore:stance==='iron'?.15:0;
                const extraCD=dual?fullCD:stance==='hunter'?.3:0;
                add(type,budget,{tag,cd:cd+extraCD,bonus:bonus+(type==='normal'?normalBonus:0),
                    typeScale:type==='normal'?normalScale:1,multiplier:amplification*2/(2-ignore)});
            };
            addMode('other',f.intro,'intro','iron');
            addMode('skill',2*f.skill,'switchSkills');
            addMode('normal',(f.hunterNormal+f.hunterDodge)*(c>=1?1.5:1),'hunterAttacks','hunter');
            addMode('normal',(f.ironNormal+f.ironDodge)*(c>=1?1.5:1),'ironAttacks','iron');
            const extraHunter=opening&&c>=6?1:0;
            addMode('normal',f.hunterFinish*(1+extraHunter)+f.ironFinish,'convertedFinishers');
            if(c>=6)addMode('normal',f.finishC6*(2+extraHunter),'finishC6');
            // 5/5/10发分别获得10/20/60过载，恰好90点；速切仅打一发后主动收枪。
            const shots=quick?[1,0,0]:[5,5,10];
            addMode('normal',shots.reduce((s,n,i)=>s+n*f.gun[i],0)*(c>=3?1.6:1),'liberationGun');
            addMode('liberate',f.firework*(c>=3?1.6:1),'firework');
            // 塔的频率未列在技能表：参考按每秒一发、14秒计，不把队友重击深化计入自身。
            addMode('other',14*f.turret,'turret');
            add('other',f.response*10000/(2500*2*2.44)*1.4*amplification*2/(2-fullIgnore),{fixed:true,tag:'hackingResponse',count:1});
        } else if (id === 56) {
            const f=missingCharacterFacts.lucilla, echo=mode==='lucillaEcho'||mode==='lucillaEchoOpening';
            const opening=mode.endsWith('Opening'), converted=echo?'other':'normal';
            add('other',f.intro,{tag:'intro'});
            add('skill',f.skillSetup,{tag:'focusSetup'});
            if(c>=1)crit=1; // 参考面板80%加一链20%；只覆盖追光后的包。
            add('skill',f.chaseLight,{tag:'chaseLight'});
            const echoBonus=echo?.25+(c>=2?.4:0):0;
            const convertedBonus=bonus+echoBonus+.3;
            const zoomCD=stacks=>echo?stacks*.1:0;
            add(converted,f.liberation,{tag:'convertedLiberation',echoSkill:echo,bonus:convertedBonus,cd:cd+zoomCD(opening?1:4)});
            add('normal',f.memoryFirst+f.memorySecond,{tag:'memoryNormal',bonus:bonus+(echo?0:.3)});
            for(let i=1;i<=3;i++) {
                // 第三段8次攻击按3/3/2分布在三张照片期间，明确近似交错的四链攻击覆盖。
                add('normal',f.memoryThird/8*(i===3?2:3),{tag:'memoryThird'+i,attack:attack+(c>=4?i*100:0),bonus:bonus+(echo?0:.3)});
                add(converted,f.forget*(c>=5?1.5:1),{tag:'forget'+i,echoSkill:echo,
                    attack:attack+(c>=4?i*100:0),bonus:convertedBonus,cd:cd+zoomCD(opening?i+1:4)});
            }
            add(converted,f.departure*(c>=3?2:1),{tag:'departure',echoSkill:echo,attack:attack+(c>=4?300:0),
                bonus:convertedBonus,cd:cd+zoomCD(4),multiplier:c>=6?7:1});
            // 霜渐／胶卷的队伍归属及层数未确定；此分支只统计自身直接伤害，不捏造队伍异常总量。
        } else if (id === 57 || id === 58) {
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
        } else if (id === 64) {
            const f = suomingFacts;
            const contract = mode === 'contract' || mode === 'contractOpening';
            const opening = mode === 'unisonOpening' || mode === 'contractOpening';
            if(c>=2) cd += .4;
            if(c>=4) attack += 200; // 20% of the assumed 1000 base ATK.
            bonus += .5; // Intro passive; expires on switching (thunder uses bonus 2).
            const intro = c>=1?1.6:1;
            const deepen = c>=3?1.3:1;
            const before = opening?1:deepen;
            const finisher = c>=6?1.5:1;
            // Standalone regular intro grants one C3 stack before activation consumes all stacks.
            // Unison's common, equally covered final multiplier cancels in relative scoring.
            const preUnison = contract && c>=3 ? 1+(c>=6?.045:.03) : 1;
            add('normal',f.introClosed*intro,{tag:'introClosed',multiplier:before*preUnison});
            add('normal',f.openThird+f.openFourth,{tag:'beforeLiberation',multiplier:before*preUnison});
            add('skill',f.skill,{tag:'basicSkill',multiplier:preUnison});
            add('liberate',f.liberation*(c>=5?1.4:1),{tag:'liberationMain',multiplier:preUnison});
            if(contract) {
                const contractCD = cd+1+(c>=6?2:0);
                add('skill',f.skill,{tag:'contractActivation',cd:contractCD});
                // Two full open-umbrella chains; only these attacks receive the 100% multiplier increase.
                const combo = f.openFirst+f.openSecond+f.openThird+f.openFourth;
                add('normal',2*combo*2,{tag:'contractCombo',cd:contractCD,multiplier:deepen});
                add('normal',f.noAbandon,{tag:'noAbandon',cd:contractCD,multiplier:deepen});
                add('normal',f.finisher*finisher,{tag:'finisher',cd:contractCD,multiplier:deepen});
                add('normal',f.finisherHold*finisher,{tag:'finisherHold',cd:contractCD,multiplier:deepen});
                add('other',f.echo,{tag:'echo',cd:contractCD});
                // The same Unison was consumed by activation: no outro thunder, no Pact buff.
            } else {
                add('normal',f.introOpen*intro,{tag:'introOpen',multiplier:deepen});
                add('normal',f.noAbandon,{tag:'noAbandon',multiplier:deepen});
                add('normal',f.finisher*finisher,{tag:'finisher',multiplier:deepen});
                add('normal',f.finisherHold*finisher,{tag:'finisherHold',multiplier:deepen});
                add('liberate',6*f.thunder,{tag:'thunder',bonus:2});
                add('other',f.echo,{tag:'echo'}); // All hits assumed before switching / retaining the passive.
            }
        }
        return parts.map(p=>({...p,damage:p.fixed?p.budget:p.budget*(p.health?1:p.attack/2500)*(p.bonus/2)*(1+p.crit*(p.cd-1))/2.44*(p.multiplier||1)}));
    }
    function reference(role) {
        const id=Number(role.roleListId), support=id===60&&modeFor(role)==='support';
        const names=['暴击','暴伤','大攻击','小攻击','共鸣效率','普攻伤害','技能伤害','重击伤害','解放伤害','大生命','小生命','大防御','小防御'];
        let values=[52.5,105,58,120,37.2,0,0,0,0,0,0,0,0];
        if(id===57||id===58||id===63) values[6]=46.4;
        if(id===64) values[5]=46.4;
        if(id===54)values[7]=46.4;
        if(id===55)values[5]=46.4;
        if(id===56){values[4]=0;if(modeFor(role).startsWith('lucillaFrost'))values[5]=46.4;else values[3]=240;}
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
        if(id===56)weights.echoSkillShare=round(parts.filter(p=>p.echoSkill).reduce((s,p)=>s+p.damage,0)/total);
        const rule={ruleId:clamp(parseInt(role.ming)||0,0,6),attack01:2500*weighted(p=>p.health?0:1/p.attack),attack02:250*weighted(p=>p.health?0:1/p.attack),
            crit:2.5*weighted(p=>p.guaranteed||p.crit>=1?0:(p.cd-1)/(1+p.crit*(p.cd-1))),critDamage:2.5*weighted(p=>p.crit/(1+p.crit*(p.cd-1))),
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
        // 洛瑟菈共鸣能量上限为0：共鸣效率不产生输出评分。
        if(id===56)Object.assign(rule,{efficiency01:0,efficiency02:0,defenseLimit:0});
        for(const key of Object.keys(rule)) if(typeof rule[key]==='number') rule[key]=round(rule[key]);
        for(const e of Object.keys(rule.elements)) rule.elements[e]=round(rule.elements[e]);
        // Per-type sensitivity matters for packets with innate bonus, fixed damage or HP scaling.
        rule.typeCoefficients=Object.fromEntries(types.slice(0,4).map(t=>[t,round(id===60&&modeFor(role)==='support'?0:2.5*weighted(p=>p.type===t?(p.typeScale||1)/p.bonus:0))]));
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
    return {ids,settings,missingCharacterFacts,suomingFacts,modeFor,packets,profile,reference,install};
}
module.exports = {createNewCharacterModels};
