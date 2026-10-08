/* Dock 只读取共享角色数据；最近使用和草稿状态保存在独立命名空间。 */
(function(root,factory){
    if(typeof module==='object'&&module.exports)module.exports=factory(require('./role-draft-model.js'));
    else {root.CharacterDock=factory(root.RoleDraftModel);document.addEventListener('DOMContentLoaded',()=>root.CharacterDock.mount(root));}
})(typeof globalThis!=='undefined'?globalThis:this,function(drafts){
    'use strict';
    const MODEL_VERSION='legacy-scoring-2026-10-08';
    function select(records,recent){return recent.map(id=>records.find(r=>String(r.roleId)===id)).find(Boolean)||records[0]||null;}
    async function assess(record,baseline,draft,normalize,digest,now=Date.now()){
        const current=drafts.createBaseline(normalize(record),{id:'dock-current',createdAt:now,sourceRevision:await digest(record),modelVersion:MODEL_VERSION});
        return drafts.assess(baseline,draft,current,now);
    }
    function mount(env){
        if(env.UiView?.state.effective!=='register')return;
        const normalize=RoleViewModel.createAdapter({roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection});
        const i18n=EchoI18n.createBrowser(env),store=RoleDraftStorage.create(localStorage),adoptions=RoleLocalConfiguration.create(localStorage);
        const host=document.createElement('main');host.id='character-dock';document.body.append(host);
        let records=[],selected=null,models=new Map(),statuses=[],generation=0,backupNotice=null,filter='',source='all',error=null;
        const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const t=(key,params)=>esc(i18n.t('dock.'+key,params)),tr=(key,params)=>esc(i18n.t(key,params));
        const roleName=m=>esc(i18n.entity('characters',m.role.catalogId,i18n.t('register.characterId',{id:m.role.catalogId})));
        const echoName=e=>esc(i18n.entity('echoes',e.catalogId,i18n.t('register.echoId',{id:e.catalogId})));
        const asset=s=>typeof s==='string'&&/^(image\/|https?:\/\/)/.test(s)?esc(s):'';
        function roleUrl(record,draft){const u=new URL(record.isImport?'mccost-readonly.html':'mccost.html',location.href);u.searchParams.set('roleid',record.roleId);u.searchParams.set('view','register');u.searchParams.set('lang',i18n.locale);if(draft)u.searchParams.set('draft',draft);return esc(u.pathname+u.search);}
        async function digest(record){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(drafts.canonical(record)));return Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join('');}
        async function refresh(){
            const ticket=++generation;error=null;statuses=[];
            try{
                const raw=JSON.parse(localStorage.getItem('mcData')||'null');
                if(raw!==null&&(!Array.isArray(raw.role)||raw.role.some(r=>!r||r.roleId==null)||new Set(raw.role.map(r=>String(r.roleId))).size!==raw.role.length))throw Error('data');
                records=raw?.role||[];models=new Map(records.map(r=>[String(r.roleId),normalize(r)]));
                selected=records.find(r=>String(r.roleId)===String(selected?.roleId))||select(records,UiView.recent(localStorage));
                render();
                const loaded=store.load();if(!loaded.ok){error='draftError';render();return;}
                const results=await Promise.all(loaded.data.drafts.map(async draft=>{
                    const baseline=loaded.data.baselines.find(b=>b.id===draft.baseline.id),record=records.find(r=>String(r.roleId)===baseline.role.identity);
                    if(!record)return null;
                    let validity;try{validity=await assess(record,baseline,draft,normalize,digest);}catch(_){validity={status:'incompatible'};}
                    return {draft,baseline,validity,adopted:!!adoptions.find(baseline,draft)};
                }));
                if(ticket!==generation)return;
                // 异步摘要期间来源变化时重新读取，避免把旧结果标成可继续。
                if(drafts.canonical(JSON.parse(localStorage.getItem('mcData')||'null'))!==drafts.canonical(raw)){refresh();return;}
                statuses=results.filter(Boolean);render();
            }catch(_){if(ticket===generation){records=[];selected=null;error='dataError';render();}}
        }
        function roster(){
            const list=records.filter(r=>{const m=models.get(String(r.roleId));return (source==='all'||m.role.source===source)&&i18n.entity('characters',m.role.catalogId,String(m.role.catalogId)).toLowerCase().includes(filter.toLowerCase());});
            return `<ul class="dock-roster">${list.map(r=>`<li><span>${roleName(models.get(String(r.roleId)))}</span><button type="button" data-dock-role="${esc(r.roleId)}">${t('select')}</button></li>`).join('')}</ul>${list.length?'':'<p>'+t('noMatch')+'</p>'}`;
        }
        function render(){
            document.title=i18n.t('dock.title');
            const open=host.querySelector('[data-dock-picker]')?.open;
            const actions=`<a href="index.html?view=classic&action=import&lang=${i18n.locale}">${t('import')}</a> · <a href="index.html?view=classic&action=create&lang=${i18n.locale}">${t('create')}</a>`;
            let body='';
            if(error==='dataError')body=`<p role="alert">${t(error)}</p>`;
            else if(!selected)body=`<section><h2>${t('emptyTitle')}</h2><p>${t('emptyBody')}</p>${actions}</section>`;
            else {
                const m=models.get(String(selected.roleId)),score=m.summary.score;
                const slots=m.slots.map(s=>`<div class="dock-slot"><span>${String(s.position).padStart(2,'0')}</span>${s.echo?`<span> · ${tr('loadout.cost',{cost:s.echo.cost??'—'})}</span><img src="${asset(s.echo.image)}" alt=""><h3>${echoName(s.echo)}</h3><p>${s.echo.mainStat.key?tr('stats.'+s.echo.mainStat.key):tr('register.unknownStat')}<br>${esc(s.echo.mainStat.unit==='percent'?i18n.format.percentage(s.echo.mainStat.value):i18n.format.decimal(s.echo.mainStat.value))}</p><strong>${esc(i18n.format.decimal(s.echo.score.value))}</strong><div class="dock-scale"><i style="width:${Math.max(0,Math.min(100,(s.echo.score.value||0)/m.scale.max*100))}%"></i></div>`:`<h3>${tr('loadout.empty')}</h3><p>${tr('state.empty')}</p><strong>—</strong><div class="dock-scale"></div>`}</div>`).join('');
                const own=statuses.filter(x=>x.baseline.role.identity===String(selected.roleId)).sort((a,b)=>b.draft.updatedAt-a.draft.updatedAt).slice(0,1);
                body=`<div class="dock-stage"><aside class="dock-identity"><p>${t('recent')}</p><h2>${roleName(m)}</h2><p>${tr('role.chain',{chain:m.model.chain})}</p><img src="${asset(Number(m.role.catalogId)===1?'image/register/jinhsi.webp':m.role.portrait)}" alt="${roleName(m)}"><a class="dock-primary" href="${roleUrl(selected)}">${t('continue')}</a></aside><section><h2>${tr('loadout.title')}</h2><p>${t('scale',{max:m.scale.max})}</p><div class="dock-slots">${slots}</div><div class="dock-summary"><span>${tr('summary.score')}</span><strong>${esc(i18n.format.decimal(score))}</strong><span>${tr('state.'+m.summary.status)}</span></div><ul>${m.issues.map(i=>'<li>'+tr('issues.'+i.code,i.params)+'</li>').join('')}</ul>${m.summary.weakestPositions.length?'<p>'+t('weakest',{positions:m.summary.weakestPositions.join(', ')})+'</p>':''}<div class="dock-drafts"><h3>${t('drafts')}</h3>${error==='draftError'?'<p>'+t(error)+'</p>':own.length?'<ul>'+own.map(x=>`<li>${t(x.validity.status==='valid'?(x.adopted?'adopted':'pending'):'invalid',{position:x.draft.targetSlot})} · ${x.validity.status!=='valid'?tr('candidate.'+x.validity.status):''} <a href="${roleUrl(selected,x.validity.status==='valid'?x.draft.id:null)}">${t(x.validity.status==='valid'?'continue':'recompare')}</a></li>`).join('')+'</ul>':'<p>'+t('noDraft')+'</p>'}</div></section></div><details data-dock-picker${open?' open':''}><summary>${t('allRoles',{count:records.length})}</summary><label>${t('search')}<input data-dock-search value="${esc(filter)}"></label><label>${t('source')}<select data-dock-source>${['all','manual','imported'].map(v=>`<option value="${v}"${v===source?' selected':''}>${t(v)}</option>`).join('')}</select></label><div data-dock-roster>${roster()}</div>${actions}</details>`;
            }
            host.innerHTML=`<header><h1>${t('title')}</h1><a href="unusedEchoes.html">${tr('nav.echoLibrary')}</a></header>${body}${backupNotice?'<p role="status">'+t(backupNotice)+'</p>':''}<details><summary>${t('backup')}</summary><p>${t('backupBoundary')}</p>${['drafts','adoptions'].map(kind=>`<section><h3>${t(kind)}</h3><button type="button" data-dock-export="${kind}">${t('export')}</button><label>${t('backupJson')}<textarea data-dock-json="${kind}"></textarea></label><button type="button" data-dock-restore="${kind}">${t('restore')}</button><p role="status" data-dock-backup-status="${kind}"></p></section>`).join('')}</details>`;
        }
        host.addEventListener('click',async e=>{
            const b=e.target.closest('button');if(!b)return;
            if(b.dataset.dockRole){selected=records.find(r=>String(r.roleId)===b.dataset.dockRole);UiView.recent(localStorage,selected.roleId);render();host.querySelector('.dock-primary')?.focus();}
            const kind=b.dataset.dockExport||b.dataset.dockRestore;if(!kind)return;
            const api=kind==='drafts'?store:adoptions,area=host.querySelector('[data-dock-json="'+kind+'"]'),status=host.querySelector('[data-dock-backup-status="'+kind+'"]');
            if(b.dataset.dockExport){const result=api.exportData();if(result.ok)area.value=result.json;status.textContent=i18n.t('dock.'+(result.ok?'exported':'backupError'));}
            else {const loaded=api.load();const result=loaded.ok?api.restore(area.value,loaded.data.revision):{ok:false};status.textContent=i18n.t('dock.'+(result.ok?'restored':'backupError'));if(result.ok){backupNotice='restored';refresh();}}
        });
        host.addEventListener('input',e=>{if(e.target.matches('[data-dock-search]')){filter=e.target.value;host.querySelector('[data-dock-roster]').innerHTML=roster();}});
        host.addEventListener('change',e=>{if(e.target.matches('[data-dock-source]')){source=e.target.value;host.querySelector('[data-dock-roster]').innerHTML=roster();}});
        env.addEventListener('wuwa-locale',e=>i18n.setLocale(e.detail));i18n.subscribe(render);
        env.addEventListener('pageshow',refresh);env.addEventListener('focus',refresh);env.addEventListener('storage',refresh);refresh();
    }
    return {select,assess,mount};
});
