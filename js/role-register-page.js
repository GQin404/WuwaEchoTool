/* 两个角色入口共用状态控制器；模型变更通过共享事务保存。 */
document.addEventListener('DOMContentLoaded',function(){
    'use strict';
    if(!window.RoleRegisterMode)return;
    const i18n=EchoI18n.createBrowser(window);
    const normalize=RoleViewModel.createAdapter({roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection});
    const host=document.createElement('div');host.id='role-register';document.body.append(host);
    const url=new URL(location.href),params=url.searchParams,id=params.get('roleid');
    const legacy=new URL(url);legacy.searchParams.set('view','classic');legacy.searchParams.delete('selectedPosition');legacy.searchParams.delete('selectedEcho');
    legacy.searchParams.delete('draft');
    let controller=null,error=null,lastRecord=null,candidateSurface=null;
    let modelPersistence='modelAutoSave';
    let modelGuard=null,modelRevision=null;
    const navigation=RegisterNavigation.create(sessionStorage),analysisKey='analysis:'+id+':'+(new URL(location.href).searchParams.get('configuration')||'active');
    const operationNotice=navigation.takeNotice('role:'+id);
    function rememberAnalysis(){const selection=controller?.snapshot().selection;if(!controller)return;navigation.save(analysisKey,{position:selection?.position||null,echo:selection?.kind==='echo'?controller.snapshot().model.slots[selection.position-1].echo?.id:null,scroll:scrollY});}
    let planTicket=0;
    const escapeOps=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    function decorate(){
        if(typeof RegisterMetadata==='undefined'||!controller)return;
        const loaded=RegisterMetadata.create(localStorage).load(),record=read();if(!record)return;
        const label=record.configurations?MultiConfig.active(record).name||i18n.t('mc.defaultName'):RegisterMetadata.roleName({role:JSON.parse(localStorage.getItem('mcData')).role},record,i18n,loaded.data);
        host.querySelector('.rr-identity h1')?.insertAdjacentHTML('afterend','<p class="op-current-config">'+escapeOps(label)+'</p>');
        host.querySelector('[data-summary-config]')?.replaceChildren(document.createTextNode(label));
        const back=host.querySelector('.rr-breadcrumb a');if(back)back.href=RegisterNavigation.back(new URL(location.href).searchParams,i18n.locale);
        const ticket=++planTicket;
        crypto.subtle.digest('SHA-256',new TextEncoder().encode(RoleDraftModel.canonical(RoleDraftModel.source(record)))).then(bytes=>{
            if(ticket!==planTicket||RoleDraftModel.canonical(RoleDraftModel.source(read()))!==RoleDraftModel.canonical(RoleDraftModel.source(record)))return;
            const revision=Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join(''),current=RoleDraftModel.createBaseline(controller.snapshot().model,{id:'plans-current',createdAt:Date.now(),sourceRevision:revision,modelVersion:'legacy-scoring-2026-10-08'}),drafts=RoleDraftStorage.create(localStorage).load();if(!drafts.ok)return;
            const rows=drafts.data.drafts.filter(d=>{const b=drafts.data.baselines.find(b=>b.id===d.baseline.id);return b?.role.identity===String(record.roleId)&&(!b.role.configurationId||b.role.configurationId===record.activeConfigurationId);});
            const inventory=MultiConfig.entities(JSON.parse(localStorage.getItem('mcData'))),adapter=RoleCandidates.createAdapter(normalize),activeDraft=new URL(location.href).searchParams.get('draft');
            const html=rows.map(d=>{const baseline=drafts.data.baselines.find(b=>b.id===d.baseline.id),valid=RoleDraftModel.assess(baseline,d,current,Date.now()).status==='valid'&&adapter.assessSource(d,inventory,record).status==='valid',adopted=valid&&RoleLocalConfiguration.create(localStorage).find(baseline,d),u=new URL(location.href);u.searchParams.set('draft',d.id);return '<p><a'+(d.id===activeDraft?' aria-current="true"':'')+' href="'+escapeOps(u.pathname+u.search)+'">'+escapeOps(RegisterMetadata.draftName(d,i18n,loaded.data))+'</a><small> · '+escapeOps(i18n.t(valid?(adopted?'ops.adopted':'ops.saved'):'ops.recompare'))+'</small></p>';}).join('');
            host.querySelector('[data-op-plans]')?.replaceChildren();if(host.querySelector('[data-op-plans]'))host.querySelector('[data-op-plans]').innerHTML=html;const plans=host.querySelector('.rr-saved-plans');if(plans)plans.hidden=!rows.length;
        }).catch(()=>{});
    }
    window.MultiConfigLeave=fn=>modelGuard?modelGuard.leave(()=>candidateSurface?.active()?candidateSurface.close(fn):fn()):fn();
    function saveModel(){
        if(!controller?.snapshot().modelChanged)return;
        if(modelPersistence==='modelSaveConflict')return;
        try{
            const core=CharacterCore.create({read:()=>JSON.parse(localStorage.getItem('mcData')),write:saveDataToCache,normalize});
            const data=core.load(),current=data.role.find(r=>String(r.roleId)===id);
            if(JSON.stringify(current)!==lastRecord)throw Error('SOURCE_CHANGED');
            let saved;
            core.transact(JSON.stringify(data),next=>{
                saved=next.role.find(r=>String(r.roleId)===id);
                Object.assign(saved,controller.modelChanges());core.score(saved);
            });
            controller.acceptSaved(saved);lastRecord=JSON.stringify(saved);modelRevision=lastRecord;modelGuard?.markSaved();modelPersistence='modelSaved';
        }catch(e){modelPersistence=e.message==='SOURCE_CHANGED'?'modelSaveConflict':'modelSaveFailed';}
        candidateSurface?.invalidate('incompatible');
    }
    const motion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
    function read(){
        const data=JSON.parse(localStorage.getItem('mcData')||'null');
        const matches=Array.isArray(data?.role)?data.role.filter(r=>String(r.roleId)===id):[];
        return matches.length===1?matches[0]:null;
    }
    function focus(selector,scroll=false){
        const element=host.querySelector(selector);
        element?.focus({preventScroll:true});
        if(scroll)element?.scrollIntoView({block:'nearest',behavior:motion()});
    }
    // 只量测展示文本；不依赖 subgrid，不调用评分或存储入口。
    function alignCards(){
        const loadout=host.querySelector('.rr-loadout');if(!loadout)return;
        loadout.style.removeProperty('--rr-name-height');loadout.style.removeProperty('--rr-label-height');
        const cards=Array.from(loadout.querySelectorAll('.rr-slot'));
        const names=cards.map(card=>card.querySelector('h3')?.scrollHeight||0),labels=cards.map(card=>card.querySelector('.rr-main-stat span')?.scrollHeight||0);
        loadout.style.setProperty('--rr-name-height',Math.max(38,...names)+'px');
        loadout.style.setProperty('--rr-label-height',Math.max(20,...labels)+'px');
    }
    function render(focusSelector){
        const pageScroll=typeof scrollY==='number'?scrollY:0;
        const oldPanel=host.querySelector('.rr-inline-analysis'),anchorTop=oldPanel&&!oldPanel.hidden?oldPanel.getBoundingClientRect().top:null;
        const observationOpen=host.querySelector('.rr-observation-details')?.open,expanded=host.querySelector('.rr-substats-details')?.open,active=document.activeElement,cursor=active?.selectionStart;let rememberedFocus=null;if(active?.dataset?.rcFilter)rememberedFocus='[data-rc-filter="'+active.dataset.rcFilter+'"]';if(active?.hasAttribute?.('data-rc-stat'))rememberedFocus='[data-rc-stat="'+active.dataset.rcStat+'"][data-rc-field="'+active.dataset.rcField+'"]';if(active?.hasAttribute?.('data-rc-plan-name'))rememberedFocus='[data-rc-plan-name]';
        const state=controller?.snapshot(),model=state?.model;
        const catalogId=Number(model?.role.catalogId);
        const modes=newCharacterModels.settings[catalogId]?.modes.map(m=>m[0])||(catalogId===49?['tune','fusion']:catalogId===53?['fusion','harmony']:[]);
        const html=RoleRegisterRenderer.render(model,i18n,{error,interaction:{...state,modelPersistence},modelModes:modes,legacyUrl:legacy.pathname+legacy.search}).html;
        if(!host.querySelector('.rr-workspace')||!model||error)host.innerHTML=html;
        else {
            const template=document.createElement('template');template.innerHTML=html;
            const next=template.content;
            // 保留五槽节点与唯一分析宿主，只更新展示内容和状态。
            for(const slot of model.slots){
                const selector='.rr-slot[data-slot-position="'+slot.position+'"]';
                const current=host.querySelector(selector),fresh=next.querySelector(selector);
                current.className=fresh.className;current.innerHTML=fresh.innerHTML;current.setAttribute('aria-label',fresh.getAttribute('aria-label'));
            }
            host.querySelector('.rr-loadout').setAttribute('aria-label',next.querySelector('.rr-loadout').getAttribute('aria-label'));
            const panel=host.querySelector('.rr-inline-analysis'),freshPanel=next.querySelector('.rr-inline-analysis');
            panel.hidden=freshPanel.hidden;panel.setAttribute('aria-label',freshPanel.getAttribute('aria-label'));
            panel.querySelector('.rr-connector').setAttribute('style',freshPanel.querySelector('.rr-connector').getAttribute('style'));
            panel.querySelector('.rr-analysis-content').innerHTML=freshPanel.querySelector('.rr-analysis-content').innerHTML;
            for(const selector of ['.rr-context','.rr-identity','.rr-loadout-heading','.rr-row-labels','.rr-rail','.rr-evaluation','.rr-conditions','.rr-announcement','.rr-footer']){
                const current=host.querySelector(selector),fresh=next.querySelector(selector);
                current.innerHTML=fresh.innerHTML;
                if(fresh.hasAttribute('aria-label'))current.setAttribute('aria-label',fresh.getAttribute('aria-label'));
            }
        }
        document.title=i18n.t('register.pageTitle');
        candidateSurface?.render();
        decorate();if(observationOpen!==undefined&&host.querySelector('.rr-observation-details'))host.querySelector('.rr-observation-details').open=observationOpen;if(operationNotice&&!state?.notice){host.querySelector('.rr-announcement').textContent=i18n.t('workspace.'+operationNotice);}if(expanded!==undefined&&host.querySelector('.rr-substats-details'))host.querySelector('.rr-substats-details').open=expanded;
        alignCards();if(typeof scrollTo==='function'){
            const panel=host.querySelector('.rr-inline-analysis');
            // 语言换行改变上方高度时保留分析阅读位置，而非固定失去语义的像素偏移。
            scrollTo(0,anchorTop!==null&&panel&&!panel.hidden?scrollY+panel.getBoundingClientRect().top-anchorTop:pageScroll);
        }
        if(focusSelector)focus(focusSelector);else if(rememberedFocus){const next=host.querySelector(rememberedFocus);next?.focus({preventScroll:true});if(next?.type==='text'&&cursor!=null)next.setSelectionRange(cursor,cursor);}
    }
    function refresh(force=false){
        try{
            const record=read();
            if(!record){controller=null;error='missing';candidateSurface?.invalidate();render();return;}
            const serialized=JSON.stringify(record);
            if(serialized===lastRecord&&controller&&!force)return;
            if(lastRecord!==null&&serialized!==lastRecord)candidateSurface?.invalidate();
            if(controller){if(controller.snapshot().modelChanged){controller.refresh(record);if(serialized!==lastRecord)modelPersistence='modelSaveConflict';}else {controller.acceptSaved(record);modelPersistence='modelAutoSave';}}else controller=RoleRegisterController.create(record,normalize);
            lastRecord=serialized;error=null;render();
        }catch(_){controller=null;error='unreadable';candidateSurface?.invalidate();render();}
    }
    host.addEventListener('click',event=>{if(event.target.closest('[data-rr-share]')&&controller)RegisterShare.open(controller.snapshot().model,i18n);});
    // 新增入口先选择来源；背包复用现有选择器，不进入通用声骸库。
    host.addEventListener('click',event=>{
        const link=event.target.closest('a[href]');if(!link||!controller)return;
        const destination=new URL(link.href,location.href);
        if(!destination.pathname.endsWith('/register-workspace.html')||destination.searchParams.get('mode')!=='echo'||destination.searchParams.has('costid'))return;
        event.preventDefault();
        const dialog=document.createElement('dialog');dialog.className='rr-dialog rr-add-source';dialog.setAttribute('aria-labelledby','rr-add-source-title');
        const heading=document.createElement('h2');heading.id='rr-add-source-title';heading.textContent=i18n.t('workspace.addEcho');dialog.append(heading);
        const choices=document.createElement('div');choices.className='rr-share-choices';
        for(const [label,inventory] of [['workspace.addManual',false],['workspace.addInventory',true]]){
            const button=document.createElement('button');button.type='button';button.textContent=i18n.t(label);
            button.onclick=()=>{const next=new URL(destination);if(inventory)next.searchParams.set('inventory','1');location.assign(next.href);};choices.append(button);
        }
        const close=document.createElement('button');close.type='button';close.textContent=i18n.t('common.cancel');
        const finish=()=>{dialog.close();dialog.remove();link.focus();};close.onclick=finish;dialog.oncancel=e=>{e.preventDefault();finish();};
        const actions=document.createElement('div');actions.className='rr-dialog-actions';actions.append(close);
        dialog.append(choices,actions);document.body.append(dialog);dialog.showModal();choices.querySelector('button').focus();
    });
    refresh();
    modelRevision=lastRecord;
    modelGuard=RegisterUnsaved.create({scope:'model:'+id+':'+(read()?.activeConfigurationId||'legacy'),get:()=>controller?.modelChanges()||{},apply:changes=>{if(controller&&changes&&typeof changes==='object')for(const [field,value]of Object.entries(changes))controller.updateModel(field,value);},revision:()=>modelRevision,i18n});
    if(modelGuard.recover()&&controller?.snapshot().modelChanged){modelPersistence='modelSaveFailed';render();}
    candidateSurface=RoleCandidateSurface.mount({host,i18n,normalize,getController:()=>controller,refresh,catalog:costList});
    if(controller&&params.has('selectedEcho')){
        controller.restore(Number(params.get('selectedPosition')),params.get('selectedEcho'));render();
        params.delete('selectedEcho');params.delete('selectedPosition');history.replaceState(null,'',url.pathname+url.search);
    }else if(controller&&!params.has('draft')){
        const saved=navigation.load(analysisKey),position=Number(saved.position);if(saved.echo!=null){controller.restore(position,saved.echo);render();}else if(position>=1&&position<=5&&!controller.snapshot().model.slots[position-1].echo){controller.select(position,null);render();}
    }
    host.addEventListener('click',event=>{
        const button=event.target.closest('button');if(!button||!controller)return;
        if(button.hasAttribute('data-rr-select')){
            const position=Number(button.dataset.rrSelect),identity=button.dataset.rrIdentity||null;
            if(candidateSurface.active()){candidateSurface.close(()=>{controller.select(position,identity);render('.rr-slot[data-slot-position="'+position+'"] .rr-slot-trigger');});return;}
            controller.select(position,identity);render('.rr-slot[data-slot-position="'+position+'"] .rr-slot-trigger');
            if(button.hasAttribute('data-rr-problem')&&controller.snapshot().selection)focus('#rr-analysis-title',true);
        }else if(button.hasAttribute('data-rr-collapse')){
            const position=controller.snapshot().selection?.position,finish=()=>{controller.collapse();render('.rr-slot[data-slot-position="'+position+'"] .rr-slot-trigger');};
            if(candidateSurface.active())candidateSurface.close(finish);else finish();
        }else if(button.hasAttribute('data-rr-evidence')){
            controller.evidence();render('[data-rr-evidence]');
            if(controller.snapshot().evidenceOpen){host.querySelector('.rr-conditions').open=true;focus('#rr-evidence',true);}
        }else if(button.hasAttribute('data-rr-reset')){controller.resetModel();modelRevision=lastRecord;modelGuard.markSaved();modelPersistence='modelAutoSave';candidateSurface.invalidate('incompatible');refresh(true);focus('[data-rr-reset]');}
        else if(button.hasAttribute('data-rr-save-model')){saveModel();render('[data-rr-reset]');}
    });
    // 横向滑动交给原生滚动容器，不把滑动误当作下一槽选择。
    host.addEventListener('keydown',event=>{
        if(event.key==='Escape'&&controller?.snapshot().selection){
            event.preventDefault();const position=controller.snapshot().selection.position;controller.collapse();render('.rr-slot[data-slot-position="'+position+'"] .rr-slot-trigger');
        }
    });
    host.addEventListener('change',event=>{
        if(event.target.matches('[data-rr-locale]')){i18n.setLocale(event.target.value);if(window.dispatchEvent)window.dispatchEvent(new CustomEvent('wuwa-locale',{detail:event.target.value}));}
        else if(event.target.matches('[data-rr-model]')&&controller){
            const field=event.target.dataset.rrModel;controller.updateModel(field,event.target.value);saveModel();render('[data-rr-model="'+field+'"]');
        }
    });
    window.addEventListener('wuwa-locale',event=>{if(i18n.locale!==event.detail)i18n.setLocale(event.detail);});
    i18n.subscribe(()=>render());
    // 编辑返回、其他标签页更新和页面恢复都从存档重读，不触发写入。
    if(params.has('libraryCandidate')){
        const candidate=params.get('libraryCandidate');params.delete('libraryCandidate');history.replaceState(null,'',url.pathname+url.search);
        candidateSurface.fromLibrary(candidate);
    }else candidateSurface.restore();
    window.addEventListener('pageshow',()=>refresh());
    window.addEventListener('focus',()=>refresh());
    window.addEventListener('storage',event=>{if(event.key==='mcData'||event.key===null){refresh();candidateSurface.render();}else if([RoleDraftStorage.KEY,RoleLocalConfiguration.KEY,RegisterMetadata.KEY].includes(event.key))render();});
    window.addEventListener('resize',alignCards);
    document.fonts?.ready.then(alignCards);
    window.addEventListener('pagehide',rememberAnalysis);
    window.addEventListener('wuwa-core-updated',()=>refresh());
});
