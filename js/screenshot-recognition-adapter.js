/* 截图适配器只生成待确认数据；不访问 DOM、存储或评分入口。 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./stat-keys.js'),require('./role-candidates.js'),require('./i18n-dictionaries.js'),require('./screenshot-name-aliases.js'));else root.ScreenshotRecognitionAdapter=factory(root.StatKeys,root.RoleCandidates,root.EchoDictionaries,root.ScreenshotNameAliases);})(typeof globalThis!=='undefined'?globalThis:this,function(keys,candidates,messages,nameAliases){
    'use strict';
    const traditional='鳴響迴傷擊禦電熱氣動療護衛淵絕靈獸夢獵戰槍諧聲骸屬強復滅棱稜龜鱷輝鷺雲無鋒雙頭燼螢劍轟蠍喚覓針朽軀鎧騎淚樂夢殘異變驚嘆覺聖詠霧隱鎖禍龍怨';
    const simplified='鸣响回伤击御电热气动疗护卫渊绝灵兽梦猎战枪谐声骸属强复灭棱棱龟鳄辉鹭云无锋双头烬萤剑轰蝎唤觅针朽躯铠骑泪乐梦残异变惊叹觉圣咏雾隐锁祸龙怨';
    const folding=Object.fromEntries([...traditional].map((ch,i)=>[ch,simplified[i]]));
    const clean=value=>String(value||'').normalize('NFKC').normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/./gu,ch=>folding[ch]||ch).replace(/[^\p{L}\p{N}]/gu,'');
    const blank=()=>({key:'',value:'',confidence:0,needsReview:true});
    // 单字差异只提供待确认候选，不自动设置目录身份。
    function suggestions(title,cost,catalog){
        const input=clean(title);if(input.length<5)return [];
        return Array.from(catalog).filter(e=>e.type==='Cost'+cost&&[e.name,...(nameAliases?.[e.name]||[])].some(name=>{const value=clean(name);return value.length===input.length&&[...value].filter((ch,i)=>ch!==input[i]).length===1;})).map(e=>e.id).slice(0,3);
    }
    function empty(sourceImage){return {sourceImage,detectedName:'',catalogId:'',detectedCost:'',detectedMainStat:blank(),detectedSubstats:Array.from({length:5},blank),suite:'',confidence:{name:0,cost:0},needsReview:true,status:'needsReview'};}
    // 游戏显示名称是输入别名，输出始终使用既有 StatKeys。
    const aliases={crit_rate:['暴击','Crit. Rate'],crit_damage:['暴击伤害','Crit. DMG'],resonance_efficiency:['共鸣效率','Energy Regen'],basic_attack_damage:['普攻伤害加成','Basic Attack DMG Bonus'],heavy_attack_damage:['重击伤害加成','Heavy Attack DMG Bonus'],resonance_skill_damage:['共鸣技能伤害加成','Resonance Skill DMG Bonus'],resonance_liberation_damage:['共鸣解放伤害加成','Resonance Liberation DMG Bonus'],healing_bonus:['治疗效果加成','Healing Bonus'],electro_damage:['导电伤害加成','Electro DMG Bonus'],spectro_damage:['衍射伤害加成','Spectro DMG Bonus'],havoc_damage:['湮灭伤害加成','Havoc DMG Bonus'],aero_damage:['气动伤害加成','Aero DMG Bonus'],fusion_damage:['热熔伤害加成','Fusion DMG Bonus'],glacio_damage:['冷凝伤害加成','Glacio DMG Bonus']};
    function stat(line){
        if(!line)return blank();
        const raw=String(line.text).normalize('NFKC').trim();
        const number=raw.match(/(\d+(?:[.,]\d+)?)\s*(%?)\s*$/);
        const label=clean(number?raw.slice(0,number.index):raw),percent=number?.[2]==='%';
        let key='';
        for(const [base,names] of Object.entries({atk:['攻击','攻击力','攻击加成','ATK','ATK Bonus'],hp:['生命','生命值','生命加成','HP','HP Bonus'],def:['防御','防御力','防御加成','DEF','DEF Bonus']}))if(names.some(n=>label.endsWith(clean(n))))key=base+(percent?'_percent':'_flat');
        if(!key){const found=Object.keys(keys.keyToLegacy).filter(k=>k!=='hp_flat_legacy').map(k=>({key:k,names:[keys.keyToLegacy[k],...(aliases[k]||[]),...Object.values(messages).map(d=>d['stats.'+k])].filter(Boolean).map(clean)})).filter(e=>e.names.some(n=>label.endsWith(n))).sort((a,b)=>Math.max(...b.names.map(n=>n.length))-Math.max(...a.names.map(n=>n.length)));key=found[0]?.key||'';}
        const compatible=key&&number&&(candidates.unit(key)==='percent')===percent;
        const value=compatible?Number(number[1].replace(',','.')):'';
        const confidence=Math.max(0,Math.min(1,(line.confidence||0)/100));
        return {key,value,confidence,needsReview:!key||value===''||confidence<.85};
    }
    function parse(lines,{catalog,suites={},rollValues,mainValues,sourceImage='',alternate=[]}={}){
        const result=empty(sourceImage),costIndex=lines.findIndex(l=>/\bC[O0]ST\s*[:：]?\s*[134]\b/i.test(l.text));
        if(costIndex<0)return result;
        const costLine=lines[costIndex];result.detectedCost=Number(costLine.text.match(/C[O0]ST\s*[:：]?\s*([134])/i)[1]);result.confidence.cost=(costLine.confidence||0)/100;
        const title=lines.slice(0,costIndex).slice(-1).map(l=>l.text.replace(/\+\s*\d+.*/, '')).join(' ').trim();result.detectedName=title;
        // 多语名称只映射至现有简体目录；不以部分名称匹配其他变体。
        const titleKey=clean(title),matches=catalog.filter(e=>[e.name,...(nameAliases?.[e.name]||[]),...Object.values(messages).map(d=>d['echoes.'+e.id])].filter(Boolean).some(n=>titleKey===clean(n)));
        const longest=matches.sort((a,b)=>b.name.length-a.name.length);
        if(longest.length&&(!longest[1]||longest[0].name.length>longest[1].name.length)&&Number(longest[0].type.replace('Cost',''))===result.detectedCost){result.catalogId=longest[0].id;result.confidence.name=Math.min(...lines.slice(Math.max(0,costIndex-1),costIndex).map(l=>(l.confidence||0)/100));}
        result.suggestedCatalogIds=result.catalogId?[]:suggestions(title,result.detectedCost,catalog);
        const end=lines.findIndex((l,i)=>i>costIndex&&/声骸技能|聲骸技能|echo\s*skill/i.test(l.text));
        const rows=lines.slice(costIndex+1,end<0?undefined:end).filter(l=>l.text.trim());
        const altEnd=alternate.findIndex(l=>/声骸技能|聲骸技能|echo\s*skill/i.test(l.text));
        const altCost=alternate.findIndex(l=>/C[O0]ST\s*[:：]?\s*[134]/i.test(l.text));
        const altRows=altCost<0?[]:alternate.slice(altCost+1,altEnd<0?undefined:altEnd).filter(l=>l.text.trim());
        function checked(s,index){if(index>=2&&rollValues&&s.value!==''&&!rollValues[s.key]?.includes(Number(s.value)))return {...s,value:'',needsReview:true};return s;}
        function reading(index){const primary=checked(stat(rows[index]),index),secondary=checked(stat(altRows[index]),index);if(altRows.length!==rows.length)return primary;return (!primary.key||primary.value==='')&&secondary.key&&secondary.value!==''?{...secondary,needsReview:true}:primary;}
        result.detectedMainStat=reading(0);
        if(!candidates.MAIN[result.detectedCost]?.includes(result.detectedMainStat.key))result.detectedMainStat=blank();
        if(mainValues&&result.detectedMainStat.value!==''&&!mainValues['Cost'+result.detectedCost]?.some(s=>s.key===result.detectedMainStat.key&&s.value===result.detectedMainStat.value))result.detectedMainStat={...result.detectedMainStat,value:'',needsReview:true};
        // 第二行是固定属性，不作为副词条导入；结构不足时保留空白。
        const fixed=reading(1),fixedValid=['atk_flat','hp_flat','def_flat'].includes(fixed.key)&&fixed.value!=='';
        if(fixedValid)result.detectedSubstats=Array.from({length:5},(_,i)=>{const s=reading(i+2);return candidates.SUB.includes(s.key)?s:blank();});
        const setText=clean(lines.slice(end<0?lines.length:end).map(l=>l.text).join(' '));
        const setMatches=Object.entries(suites).filter(([legacy,id])=>[legacy,...Object.values(messages).map(d=>d['sets.'+id])].filter(Boolean).some(n=>setText.includes(clean(n))));
        if(setMatches.length===1)result.suite=setMatches[0][0];
        result.status=result.catalogId&&result.detectedMainStat.value!==''&&result.detectedSubstats.every(s=>s.key&&s.value!=='')?'review':'needsReview';
        return result;
    }
    function toEcho(result,{catalog,createEcho,id,suites={},rollValues,mainValues}){
        const entry=catalog.find(e=>String(e.id)===String(result.catalogId)),cost=Number(result.detectedCost);
        if(!entry||entry.type!=='Cost'+cost||!candidates.MAIN[cost]?.includes(result.detectedMainStat.key))throw Error('INVALID_ECHO');
        const convert=(s,allowed)=>{if(!allowed.includes(s.key)||s.value===''||s.value==null||!Number.isFinite(Number(s.value))||Number(s.value)<=0)throw Error('INVALID_ECHO');return {property:keys.keyToLegacy[s.key],value:String(Number(s.value))+(candidates.unit(s.key)==='percent'?'%':'')};};
        const main=convert(result.detectedMainStat,candidates.MAIN[cost]);
        const mainMatch=mainValues?.['Cost'+cost]?.find(s=>s.key===result.detectedMainStat.key&&s.value===Number(result.detectedMainStat.value));
        if(mainValues&&!mainMatch)throw Error('INVALID_ECHO');
        const stats=result.detectedSubstats.filter(s=>s.key||s.value!=='');
        if(rollValues&&stats.some(s=>!rollValues[s.key]?.includes(Number(s.value))))throw Error('INVALID_ECHO');
        if(stats.length>5||new Set(stats.map(s=>s.key)).size!==stats.length)throw Error('INVALID_ECHO');
        if(result.suite&&!Object.hasOwn(suites,result.suite))throw Error('INVALID_ECHO');
        const echo=createEcho(entry,id);
        // 复用手动声骸的主词条字符串格式，保持既有编辑与计分兼容。
        const mainNames={atk_percent:'攻击力',hp_percent:'生命',def_percent:'防御'};
        echo.mainAtrri=mainMatch?.raw||(mainNames[result.detectedMainStat.key]||main.property)+main.value;
        echo.propertyList=stats.map(s=>convert(s,candidates.SUB));echo.suite=result.suite||null;return echo;
    }
    return {clean,stat,empty,parse,toEcho};
});
