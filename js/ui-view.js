/* 界面偏好与角色数据分离；URL 只覆盖当前导航，不持久化。 */
(function(root,factory){
    if(typeof module==='object'&&module.exports)module.exports=factory();
    else {
        root.UiView=factory();
        let preference=null;try{preference=localStorage.getItem(root.UiView.KEY);}catch(_){}
        const state=root.UiView.resolve({url:location.href,preference,desktop:matchMedia('(min-width: 1100px)').matches});
        root.UiView.state=state;
        const index=/\/(?:index.html)?$/.test(location.pathname);
        if(index&&state.effective!=='classic')document.documentElement.classList.add('dock-page');
        document.addEventListener('DOMContentLoaded',()=>root.UiView.mount(root));
    }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
    'use strict';
    const KEY='wuwa.ui.view',RECENT='wuwa.ui.recentRoles.v1';
    const valid=x=>['register','classic'].includes(x);
    function resolve({url,preference,desktop=true}){
        const override=new URL(url,'https://local.invalid').searchParams.get('view');
        const requested=valid(override)?override:valid(preference)?preference:null;
        return {requested,effective:requested==='register'&&!desktop?'classic':requested,fallback:requested==='register'&&!desktop,source:valid(override)?'url':valid(preference)?'preference':'choice'};
    }
    function url(href,view,locale){const u=new URL(href,'https://local.invalid');u.searchParams.set('view',view);if(locale)u.searchParams.set('lang',locale);return u.pathname+u.search+u.hash;}
    function recent(storage,id){try{const old=JSON.parse(storage.getItem(RECENT)||'[]');const ids=Array.isArray(old)?old.filter(x=>typeof x==='string'):[];if(id!=null){const next=[String(id),...ids.filter(x=>x!==String(id))].slice(0,20);storage.setItem(RECENT,JSON.stringify(next));return next;}return ids;}catch(_){return [];}}
    function mount(env){
        const api=env.UiView,i18n=env.EchoI18n.createBrowser(env),state=api.state,index=/\/(?:index.html)?$/.test(env.location.pathname);
        const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const t=k=>esc(i18n.t('entry.'+k));
        const bar=document.createElement('div');bar.id='ui-view-controls';document.body.prepend(bar);
        function choose(view){
            try{env.localStorage.setItem(KEY,view);}catch(_){}
            const rolePage=/\/mccost(?:-readonly)?\.html$/.test(location.pathname);
            const target=index||rolePage?location.href:'index.html';
            const next=new URL(url(target,view,i18n.locale),location.href);
            if(view==='classic')for(const k of ['draft','selectedPosition','selectedEcho'])next.searchParams.delete(k);
            location.assign(next.href);
        }
        function render(){
            bar.innerHTML=`<span>${t('interface')}</span><button type="button" data-ui-view="register" aria-pressed="${state.requested==='register'}">Resonance Register</button><button type="button" data-ui-view="classic" aria-pressed="${state.requested==='classic'}">Classic View</button><small>${t('savedSwitch')}</small>${!env.RoleRegisterMode?`<label>${esc(i18n.t('common.language'))}<select data-ui-locale>${['zh-TW','zh-CN','en'].map(l=>`<option value="${l}"${l===i18n.locale?' selected':''}>${esc(i18n.t('register.locale.'+l))}</option>`).join('')}</select></label>`:''}`;
            if(state.fallback){let seen=false;try{seen=sessionStorage.getItem('wuwa.ui.mobileNotice')==='1';sessionStorage.setItem('wuwa.ui.mobileNotice','1');}catch(_){}if(!seen)bar.insertAdjacentHTML('beforeend',`<p role="status">${t('mobileFallback')}</p>`);}
            if(index&&!state.effective){
                document.title=i18n.t('entry.welcome');
                let chooser=document.getElementById('ui-view-choice');if(!chooser){chooser=document.createElement('main');chooser.id='ui-view-choice';document.body.append(chooser);}
                chooser.innerHTML=`<h1>${t('welcome')}</h1><p>${t('choose')}</p><section><h2>Resonance Register</h2><p>${t('registerDescription')}</p><button type="button" data-ui-view="register">${t('useRegister')}</button></section><section><h2>Classic View</h2><p>${t('classicDescription')}</p><button type="button" data-ui-view="classic">${t('useClassic')}</button></section><p>${t('shared')}</p>`;
            }
        }
        document.addEventListener('click',e=>{
            const button=e.target.closest('[data-ui-view]');if(button){choose(button.dataset.uiView);return;}
            const link=e.target.closest('a[href]');if(!link)return;
            const target=new URL(link.href,location.href);
            if(target.origin===location.origin&&/\/(?:index.html|mccost(?:-readonly)?\.html)?$/.test(target.pathname)&&!target.searchParams.has('view'))link.href=url(target.href,state.requested||'classic',i18n.locale);
        });
        bar.addEventListener('change',e=>{if(e.target.matches('[data-ui-locale]')){i18n.setLocale(e.target.value);env.dispatchEvent(new CustomEvent('wuwa-locale',{detail:e.target.value}));}});
        env.addEventListener('wuwa-locale',e=>{if(i18n.locale!==e.detail)i18n.setLocale(e.detail);});
        i18n.subscribe(render);render();
        const roleId=new URL(location.href).searchParams.get('roleid');if(roleId)recent(env.localStorage,roleId);
        matchMedia('(min-width: 1100px)').addEventListener('change',e=>{if(!e.matches&&state.effective==='register'&&(index||env.RoleRegisterMode))location.reload();});
        if(index&&state.effective==='classic'&&new URL(location.href).searchParams.get('action')==='create')env.jQuery?.('#mc-addrole').modal('show');
    }
    return {KEY,RECENT,resolve,url,recent,mount};
});
