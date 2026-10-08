(function(root,factory){
    if(typeof module==='object'&&module.exports)module.exports=factory(require('./i18n-dictionaries.js'));
    else root.RoleRegisterRenderer=factory(root.EchoDictionaries);
})(typeof globalThis!=='undefined'?globalThis:this,function(messages){
    'use strict';
    const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const asset=url=>typeof url==='string'&&(/^(?:image\/|https?:\/\/)/.test(url))?url:null;
    // 只生成语义结构，不读取存档或绑定槽位事件。
    function render(model,i18n,{legacyUrl='index.html',error=null}={}) {
        const usedKeys=new Set();
        function t(key,params){
            if(!Object.hasOwn(messages[i18n.locale],key))throw new Error('Missing page translation: '+i18n.locale+'/'+key);
            usedKeys.add(key);return escape(i18n.t(key,params));
        }
        const f=i18n.format;
        function entity(key,generic,id){return key&&Object.hasOwn(messages[i18n.locale],key)?t(key):t(generic,{id:id==null?f.decimal(null):escape(id)});}
        function statName(stat){return stat?.key?t('stats.'+stat.key):t('register.unknownStat');}
        function value(stat){return escape(stat?.value==null?f.decimal(null):stat.unit==='percent'?f.percentage(stat.value,1):f.decimal(stat.value));}
        const navigation=`<header class="rr-top"><a class="rr-brand" href="index.html"><span class="rr-brandmark" aria-hidden="true"><i></i><i></i><i></i></span><span>${t('register.brand')}<small>${t('register.brandLatin')}</small></span></a><nav aria-label="${t('register.navigation')}"><a href="index.html" aria-current="page">${t('nav.characters')}</a><a href="unusedEchoes.html">${t('nav.echoLibrary')}</a><a href="compare.html">${t('nav.compare')}</a><a href="probability.html">${t('nav.tools')}</a></nav><label class="rr-language">${t('common.language')}<select data-rr-locale aria-label="${t('common.language')}">${['zh-TW','zh-CN','en'].map(locale=>`<option value="${locale}"${locale===i18n.locale?' selected':''}>${t('register.locale.'+locale)}</option>`).join('')}</select></label></header>`;
        const footer=`<footer class="rr-footer"><span>${t('register.checkpoint')}</span><a href="${escape(legacyUrl)}">${t('register.legacy')}</a></footer>`;
        if(error||!model)return {html:`${navigation}<main class="rr-error"><h1>${t('register.noRecord')}</h1><p>${t('register.error.'+(error||'missing'))}</p><a href="index.html">${t('register.backCharacters')}</a></main>${footer}`,usedKeys:[...usedKeys]};
        const roleName=entity(model.role.nameKey,'register.characterId',model.role.catalogId);
        const complete=model.summary.status==='complete';
        const issues=model.issues.map(issue=>`<li>${t('issues.'+issue.code,Object.fromEntries(Object.entries(issue.params).map(([k,v])=>[k,typeof v==='number'?f.integer(v):v])))}</li>`).join('');
        const portrait=model.role.catalogId===1?'image/register/jinhsi.webp':asset(model.role.portrait);
        const scales=model.scale;
        function slotMarkup(slot){
            const echo=slot.echo;
            if(!echo)return `<section class="rr-slot rr-empty" data-slot-position="${slot.position}" aria-label="${t('loadout.slot',{position:f.integer(slot.position)})}"><div class="rr-slot-index">${escape(f.integer(slot.position).padStart(2,'0'))}</div><div class="rr-echo-image rr-placeholder" aria-hidden="true">—</div><h3>${t('loadout.empty')}</h3><div class="rr-main-stat"><span>${t('state.missing')}</span><b>—</b></div><div class="rr-score">—</div><div class="rr-scale rr-scale-empty" aria-hidden="true"></div><div class="rr-effective">—</div><span class="rr-slot-status">${t('state.empty')}</span></section>`;
            const name=entity(echo.nameKey,'register.echoId',echo.catalogId);
            const localImages={59:'059',51:'051',52:'052',35:'035',39:'039'};
            const image=localImages[echo.catalogId]?'image/register/echo-'+echo.catalogId+'.png':asset(echo.image);
            const score=echo.score.value;
            const width=score===null?0:Math.min(100,Math.max(0,(score-scales.min)/(scales.max-scales.min)*100));
            const weakest=model.summary.weakestPositions.includes(slot.position);
            return `<section class="rr-slot${weakest?' rr-weakest':''}" data-slot-position="${slot.position}" aria-label="${t('loadout.slot',{position:f.integer(slot.position)})}"><div class="rr-slot-index"><span>${escape(f.integer(slot.position).padStart(2,'0'))}</span><small>${echo.cost==null?t('register.unknownCost'):t('loadout.cost',{cost:f.integer(echo.cost)})}</small></div><div class="rr-echo-image">${image?`<img src="${escape(image)}" alt="${name}" onerror="this.hidden=true">`:'<span aria-hidden="true">—</span>'}</div><h3>${name}</h3><div class="rr-main-stat"><span>${statName(echo.mainStat)}</span><b>${value(echo.mainStat)}</b></div><div class="rr-score">${escape(f.decimal(score,2))}<small>${t('register.points')}</small></div><div class="rr-scale" role="img" aria-label="${t('register.scaleValue',{value:f.decimal(score,2),min:f.decimal(scales.min),max:f.decimal(scales.max)})}"><span style="width:${width}%"></span><i></i><i></i><i></i><i></i><i></i></div><div class="rr-effective"><strong>${escape(f.integer(echo.effectiveCount))}<small>${t('register.outOfFive')}</small></strong></div><span class="rr-slot-status">${weakest?t('register.lowestShort'):slot.status==='incomplete'?t('state.incomplete'):''}</span></section>`;
        }
        const totals=new Map(model.summary.substatTotals.map(stat=>[stat.key,stat]));
        const railKeys=['crit_rate','crit_damage','atk_percent','resonance_efficiency'];
        const rail=railKeys.map(key=>{
            // 配置不完整时，缺少的属性不能自动补成零。
            const stat=totals.get(key)||{key,value:complete?0:null,unit:'percent'};
            return `<div class="rr-reading"><dt>${t('stats.'+key)}</dt><dd>${value(stat)}</dd></div>`;
        }).join('');
        const positions=model.summary.weakestPositions.map(p=>f.integer(p)).join(i18n.locale==='en'?', ':'、');
        const problemTitle=complete?t('register.problemLowest',{positions}):t('analysis.noConclusion');
        const ignored=model.summary.weakestPositions.flatMap(p=>model.slots[p-1].echo.substats.filter(s=>s.scoreStatus==='not-scored'));
        const problemDescription=complete?(ignored.length?t('register.ignoredCount',{count:f.integer(ignored.length)}):t('register.relativeOnly')):t('register.incompleteExplanation');
        const condition=model.model.parameters||{};
        const conditions=[t('role.chain',{chain:f.integer(model.model.chain)}),model.model.status==='unavailable'?t('issues.model-unavailable'):t('register.mode.'+(condition.mode||'default'))];
        if(condition.extraEnergy!=null)conditions.push(t('register.extraEnergy',{value:f.percentage(condition.extraEnergy)}));
        if(condition.referenceHealth!=null)conditions.push(t('register.referenceHealth',{value:f.integer(condition.referenceHealth)}));
        const html=`${navigation}<div class="rr-context"><span>${t('nav.characters')} <span aria-hidden="true">/</span> ${roleName} <span aria-hidden="true">/</span> ${t('role.currentLoadout')}</span><span>${t('role.source.'+model.role.source)}</span></div><main class="rr-main"><aside class="rr-identity"><p class="rr-eyebrow">${t('register.identity')}</p><h1>${roleName}</h1><p>${model.role.level==null?t('register.levelUnknown'):t('role.level',{level:f.integer(model.role.level)})} <span aria-hidden="true">·</span> ${t('role.chain',{chain:f.integer(model.model.chain)})}</p>${portrait?`<div class="rr-portrait"><img src="${escape(portrait)}" alt="${roleName}" onerror="this.hidden=true"></div>`:''}<div class="rr-identity-caption"><strong>${t('role.currentLoadout')}</strong><p>${t('register.configCount',{count:f.integer(model.slots.filter(s=>s.echo).length),cost:f.integer(model.summary.costTotal)})}</p><p>${t('register.baseline')}</p></div></aside><div class="rr-workspace"><div class="rr-loadout-heading"><h2>${t('loadout.title')}</h2><span>${t('register.positionsFixed')}</span></div><div class="rr-loadout" aria-label="${t('loadout.title')}"><div class="rr-row-labels"><span>${t('loadout.mainStat')}</span><span>${t('loadout.contribution')}<small>${t('loadout.sharedScale',{min:f.decimal(scales.min),max:f.decimal(scales.max)})}</small></span><span>${t('loadout.effectiveCount')}</span></div>${model.slots.map(slotMarkup).join('')}</div><section class="rr-inline-analysis" aria-label="${t('analysis.title')}" hidden></section><section class="rr-rail" aria-label="${t('summary.substatTotals')}"><div><h2>${t('summary.substatTotals')}</h2><p>${t('summary.scope')}</p>${!complete?`<p>${t('register.partialTotals')}</p>`:''}</div><dl>${rail}</dl></section><section class="rr-evaluation"><div class="rr-overall"><h2>${t('summary.score')}</h2><strong>${escape(f.decimal(model.summary.score,2))}</strong><p>${t('state.'+model.summary.status)}</p></div><div class="rr-problem"><p class="rr-eyebrow">${t('register.problemHeading')}</p><h2>${problemTitle}</h2><p>${problemDescription}</p><p>${t('analysis.notReplacementAdvice')}</p><button type="button" disabled aria-describedby="rr-action-status">${complete&&model.summary.weakestPositions.length?t('analysis.inspect',{position:f.integer(model.summary.weakestPositions[0])}):t('register.completeData')}</button><small id="rr-action-status">${t('register.eventsPending')}</small></div></section><div class="rr-conditions"><h2>${t('role.model')}</h2><p>${conditions.join(' · ')}</p><p>${t('loadout.effectiveScope')}</p><dl><div><dt>${t('summary.knownSubtotal')}</dt><dd>${escape(f.score(model.summary.knownContribution))}</dd></div><div><dt>${t('summary.energyCorrection')}</dt><dd>${escape(f.score(model.summary.energyCorrection))}</dd></div></dl>${issues?`<ul>${issues}</ul>`:''}</div></div></main>${footer}`;
        return {html,usedKeys:[...usedKeys]};
    }
    return {render};
});
