/* 界面偏好与角色数据分离；URL 只覆盖当前导航，不持久化。 */
(function(root,factory){
    if(typeof module==='object'&&module.exports)module.exports=factory();
    else {
        root.UiView=factory();
        let preference=null;try{preference=localStorage.getItem(root.UiView.KEY);}catch(_){}
        const state=root.UiView.resolve({url:location.href,preference,desktop:matchMedia('(min-width: 1100px)').matches});
        root.UiView.state=state;
        const index=/\/(?:index.html)?$/.test(location.pathname);
        const destination=root.UiView.nativeUrl(location.href,state.requested);
        if(destination){root.UiView.redirecting=true;location.replace(destination);}
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
        return {requested,effective:requested,fallback:false,source:valid(override)?'url':valid(preference)?'preference':'choice'};
    }
    function nativeUrl(href,view){
        const u=new URL(href,'https://local.invalid'),page=u.pathname.split('/').pop();
        if(page==='register-workspace.html'&&view==='classic'){
            const mode=u.searchParams.get('mode'),pages={echo:'costedit.html',library:'unusedEchoes.html',compare:'compare.html',tools:'probability.html'};
            u.pathname=u.pathname.replace(/[^/]+$/,pages[mode]||'index.html');u.searchParams.delete('mode');u.searchParams.set('view','classic');
            if(mode==='create')u.searchParams.set('action','create');
            if(mode==='echo'&&!u.searchParams.has('roleid'))u.searchParams.set('roleid','0');
            return u.pathname+u.search;
        }
        if(view!=='register')return null;
        const modes={'costedit.html':'echo','unusedEchoes.html':'library','compare.html':'compare','probability.html':'tools','imitate.html':'tools','rule.html':'tools'};
        if(!modes[page])return null;
        if(page==='costedit.html'&&u.searchParams.get('roleid')==='0')u.searchParams.delete('roleid');
        u.pathname=u.pathname.replace(/[^/]+$/,'register-workspace.html');u.searchParams.set('view','register');u.searchParams.set('mode',modes[page]);
        return u.pathname+u.search;
    }
    function url(href,view,locale){const u=new URL(href,'https://local.invalid');u.searchParams.set('view',view);if(locale)u.searchParams.set('lang',locale);return u.pathname+u.search+u.hash;}
    function recent(storage,id){try{const old=JSON.parse(storage.getItem(RECENT)||'[]');const ids=Array.isArray(old)?old.filter(x=>typeof x==='string'):[];if(id!=null){const next=[String(id),...ids.filter(x=>x!==String(id))].slice(0,20);storage.setItem(RECENT,JSON.stringify(next));return next;}return ids;}catch(_){return [];}}
    function mount(env){
        const state=env.UiView.state,index=/\/(?:index.html)?$/.test(location.pathname);
        const guide=index&&(!state.effective||new URL(location.href).searchParams.get('guide')==='1');
        const i18n=EchoI18n.createBrowser(env),esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const t=(k)=>esc(i18n.t(k));
        const target=document.createElement(guide?'main':state.effective==='register'?'header':'div');
        target.id=guide?'ui-view-choice':state.effective==='register'?'register-shell':'classic-interface-switch';
        if(guide){document.documentElement.classList.add('guide-page');document.body.append(target);}
        else if(state.effective==='register'){document.documentElement.classList.add('register-shell-page');document.body.prepend(target);}
        else (document.querySelector('.mc-main-page')||document.body).append(target);
        const brand=()=>'<span class="rs-symbol" aria-hidden="true"><i></i><i></i><i></i></span><span>'+t('register.brand')+'<small>'+t('register.brandLatin')+'</small></span>';
        const language=()=>'<label>'+t('common.language')+'<select data-ui-locale>'+['zh-TW','zh-CN','en'].map(l=>'<option value="'+l+'"'+(l===i18n.locale?' selected':'')+'>'+t('register.locale.'+l)+'</option>').join('')+'</select></label>';
        const guideUrl='index.html?guide=1&return='+encodeURIComponent(location.pathname+location.search);
        function render(){
            if(guide){
                document.title=i18n.t('entry.welcome');
                target.innerHTML='<div class="chooser-brand">'+brand()+'</div><h1>'+t('entry.welcome')+'</h1><p>'+t('entry.shared')+'</p><div class="guide-options">'+['register','classic'].map(v=>'<section><button class="chooser-entry" data-ui-view="'+v+'" aria-describedby="chooser-'+v+'"><span>'+t('entry.'+v+'Entrance')+'</span><strong>'+(v==='register'?'Resonance Register':'Classic View')+'</strong><span>'+t('entry.'+v+'Description')+'</span><b>'+t(v==='register'?'entry.useRegister':'entry.useClassic')+' ↗</b></button><div class="chooser-preview" id="chooser-'+v+'"><img src="image/register/guide-'+v+'.png" alt="'+t('entry.'+v+'Preview')+'"><ul>'+(v==='register'?['integrated','inline','compare','drafts','future']:['familiar','supported','sameCore']).map(k=>'<li>'+t('entry.'+k)+'</li>').join('')+'</ul></div></section>').join('')+'</div><footer><p>'+t('entry.switchLater')+'</p>'+language()+'</footer>';
                return;
            }
            if(state.effective!=='register'){target.innerHTML='<button type="button" data-ui-view="register">'+t('entry.switchRegister')+'</button>';return;}
            const modes=[['characters','index.html?view=register'],['echoLibrary','register-workspace.html?view=register&mode=library'],['compare','register-workspace.html?view=register&mode=compare'],['backup','register-workspace.html?view=register&mode=backup'],['tools','register-workspace.html?view=register&mode=tools']];
            const mode=new URL(location.href).searchParams.get('mode');const active=index||/mccost/.test(location.pathname)||mode==='create'||mode==='import'?'characters':mode==='library'||mode==='echo'?'echoLibrary':mode==='compare'?'compare':mode==='backup'?'backup':'tools';
            target.innerHTML='<a class="rs-brand" href="index.html?view=register">'+brand()+'</a><nav aria-label="'+t('register.navigation')+'">'+modes.map(([key,href])=>'<a href="'+href+'"'+(key===active?' aria-current="page"':'')+' aria-label="'+t(key==='backup'?'workspace.backup':'nav.'+key)+'"><span class="rs-nav-full">'+t(key==='backup'?'workspace.backup':'nav.'+key)+'</span><span class="rs-nav-short" aria-hidden="true">'+t('shell.mobile.'+key)+'</span></a>').join('')+'</nav><details class="rs-settings"><summary>'+t('shell.settings')+'</summary><div>'+language()+'<a href="'+guideUrl+'">'+t('entry.guide')+'</a><button data-ui-view="classic">'+t('entry.switchClassic')+'</button></div></details>';
        }
        function choose(view){
            try{env.localStorage.setItem(KEY,view);}catch(_){}
            const back=new URL(location.href).searchParams.get('return');
            const safe=back&&/^\/(?:index|mccost|mccost-readonly|register-workspace)\.html(?:\?|$)/.test(back)?back:null;
            const next=new URL(url(safe||(index||/mccost/.test(location.pathname)?location.href:'index.html'),view,i18n.locale),location.href);
            next.searchParams.delete('guide');next.searchParams.delete('return');
            if(view==='classic'){for(const k of ['draft','selectedPosition','selectedEcho','lang'])next.searchParams.delete(k);}
            location.assign(next.href);
        }
        document.addEventListener('click',e=>{
            const button=e.target.closest('[data-ui-view]');if(button){choose(button.dataset.uiView);return;}
            const link=e.target.closest('a[href]');if(!link)return;
            const next=new URL(link.href,location.href);if(next.origin!==location.origin)return;
            const selected=valid(next.searchParams.get('view'))?next.searchParams.get('view'):state.requested;
            const native=nativeUrl(next.href,selected);
            if(native){link.href=url(native,selected,i18n.locale);return;}
            if(/\/(?:index.html|mccost(?:-readonly)?\.html)?$/.test(next.pathname)&&!next.searchParams.has('view')&&!next.searchParams.has('guide'))link.href=url(next.href,state.requested||'classic',i18n.locale);
        });
        target.addEventListener('change',e=>{if(e.target.matches('[data-ui-locale]')){i18n.setLocale(e.target.value);env.dispatchEvent(new CustomEvent('wuwa-locale',{detail:e.target.value}));}});
        env.addEventListener('wuwa-locale',e=>{if(i18n.locale!==e.detail)i18n.setLocale(e.detail);});
        i18n.subscribe(render);render();
        const roleId=new URL(location.href).searchParams.get('roleid');if(roleId&&!guide)recent(env.localStorage,roleId);
        if(index&&state.effective==='classic'&&!guide&&new URL(location.href).searchParams.get('action')==='create')env.jQuery?.('#mc-addrole').modal('show');
    }
    return {KEY,RECENT,resolve,nativeUrl,url,recent,mount};
});
