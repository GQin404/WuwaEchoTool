/* 两个角色入口共用状态控制器；选择和模型预览不调用旧保存流程。 */
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
    function render(focusSelector){
        const state=controller?.snapshot(),model=state?.model;
        const catalogId=Number(model?.role.catalogId);
        const modes=newCharacterModels.settings[catalogId]?.modes.map(m=>m[0])||(catalogId===49?['tune','fusion']:catalogId===53?['fusion','harmony']:[]);
        const html=RoleRegisterRenderer.render(model,i18n,{error,interaction:state||{},modelModes:modes,legacyUrl:legacy.pathname+legacy.search}).html;
        if(!host.querySelector('.rr-workspace')||!model||error)host.innerHTML=html;
        else {
            const template=document.createElement('template');template.innerHTML=html;
            const next=template.content;
            // 保留五槽节点和唯一分析宿主，连接线的 left 可在原节点上平滑更新。
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
        if(focusSelector)focus(focusSelector);
    }
    function refresh(force=false){
        try{
            const record=read();
            if(!record){controller=null;error='missing';candidateSurface?.invalidate();render();return;}
            const serialized=JSON.stringify(record);
            if(serialized===lastRecord&&controller&&!force)return;
            if(lastRecord!==null&&serialized!==lastRecord)candidateSurface?.invalidate();
            if(controller)controller.refresh(record);else controller=RoleRegisterController.create(record,normalize);
            lastRecord=serialized;error=null;render();
        }catch(_){controller=null;error='unreadable';candidateSurface?.invalidate();render();}
    }
    host.addEventListener('click',event=>{if(event.target.closest('[data-rr-share]')&&controller)RegisterShare.open(controller.snapshot().model,i18n);});
    refresh();
    candidateSurface=RoleCandidateSurface.mount({host,i18n,normalize,getController:()=>controller,refresh,catalog:costList});
    if(controller&&params.has('selectedEcho')){
        controller.restore(Number(params.get('selectedPosition')),params.get('selectedEcho'));render();
        params.delete('selectedEcho');params.delete('selectedPosition');history.replaceState(null,'',url.pathname+url.search);
    }
    host.addEventListener('click',event=>{
        const button=event.target.closest('button');if(!button||!controller)return;
        if(button.hasAttribute('data-rr-select')){
            if(candidateSurface.active())candidateSurface.close();
            const position=Number(button.dataset.rrSelect),identity=button.dataset.rrIdentity||null;
            controller.select(position,identity);render('.rr-slot[data-slot-position="'+position+'"] .rr-slot-trigger');
            if(button.hasAttribute('data-rr-problem')&&controller.snapshot().selection)focus('#rr-analysis-title',true);
        }else if(button.hasAttribute('data-rr-collapse')){
            if(candidateSurface.active())candidateSurface.close();
            const position=controller.snapshot().selection?.position;controller.collapse();render('.rr-slot[data-slot-position="'+position+'"] .rr-slot-trigger');
        }else if(button.hasAttribute('data-rr-evidence')){
            controller.evidence();render('[data-rr-evidence]');
            if(controller.snapshot().evidenceOpen)focus('#rr-evidence',true);
        }else if(button.hasAttribute('data-rr-reset')){controller.resetModel();candidateSurface.invalidate('incompatible');render('[data-rr-reset]');}
    });
    let touchOrigin=null;
    host.addEventListener('touchstart',event=>{if(event.target.closest('.rr-loadout')){const point=event.touches[0];touchOrigin={x:point.clientX,y:point.clientY};}},{passive:true});
    host.addEventListener('touchend',event=>{
        if(!touchOrigin||!controller)return;const point=event.changedTouches[0],dx=point.clientX-touchOrigin.x,dy=point.clientY-touchOrigin.y;touchOrigin=null;
        if(Math.abs(dx)<60||Math.abs(dx)<Math.abs(dy))return;
        const state=controller.snapshot(),position=Math.min(5,Math.max(1,(state.selection?.position||1)+(dx<0?1:-1)));
        if(state.selection?.position===position)return;
        candidateSurface.close();controller.select(position,state.identities[position]||null);render();
    },{passive:true});
    host.addEventListener('keydown',event=>{
        if(event.key==='Escape'&&controller?.snapshot().selection){
            event.preventDefault();const position=controller.snapshot().selection.position;controller.collapse();render('.rr-slot[data-slot-position="'+position+'"] .rr-slot-trigger');
        }
    });
    host.addEventListener('change',event=>{
        if(event.target.matches('[data-rr-locale]')){i18n.setLocale(event.target.value);if(window.dispatchEvent)window.dispatchEvent(new CustomEvent('wuwa-locale',{detail:event.target.value}));}
        else if(event.target.matches('[data-rr-model]')&&controller){
            const field=event.target.dataset.rrModel;controller.updateModel(field,event.target.value);render('[data-rr-model="'+field+'"]');
            candidateSurface.invalidate('incompatible');
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
    window.addEventListener('storage',event=>{if(event.key==='mcData'||event.key===null)refresh();});
});
