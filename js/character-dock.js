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
        if(env.UiView?.state.effective!=='register'||new URL(env.location.href).searchParams.get('guide')==='1')return;
        const normalize=RoleViewModel.createAdapter({roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection});
        const i18n=EchoI18n.createBrowser(env),store=RoleDraftStorage.create(localStorage),adoptions=RoleLocalConfiguration.create(localStorage);
        const host=document.createElement('main');host.id='character-dock';document.body.append(host);
        let records=[],selected=null,models=new Map(),statuses=[],generation=0,backupNotice=null,filter='',source='all',error=null;
        const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const t=(key,params)=>esc(i18n.t('dock.'+key,params)),tr=(key,params)=>esc(i18n.t(key,params));
        const roleName=m=>esc(i18n.entity('characters',m.role.catalogId,m.role.legacy?.name||i18n.t('register.characterId',{id:m.role.catalogId})));
        const echoName=e=>esc(i18n.entity('echoes',e.catalogId,e.legacy?.name||i18n.t('register.echoId',{id:e.catalogId})));
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
        function draftStatus(record){
            const own=statuses.filter(x=>x.baseline.role.identity===String(record.roleId)).sort((a,b)=>b.draft.updatedAt-a.draft.updatedAt)[0];
            if(!own)return '';
            return '<span class="dock-draft-state">'+t(own.validity.status==='valid'?(own.adopted?'adopted':'pending'):'invalid',{position:own.draft.targetSlot})+(own.validity.status==='valid'?'':' · '+tr('candidate.'+own.validity.status))+'</span>';
        }
        function roster(){
            const list=records.filter(r=>{const m=models.get(String(r.roleId));return (source==='all'||m.role.source===source)&&i18n.entity('characters',m.role.catalogId,String(m.role.catalogId)).toLowerCase().includes(filter.toLowerCase());});
            return '<ul class="dock-roster">'+list.map(r=>{
                const m=models.get(String(r.roleId)),count=m.slots.filter(s=>s.echo).length;
                return '<li><a class="dock-character-link" href="'+roleUrl(r)+'"><img src="'+asset(m.role.portrait)+'" alt=""><span class="dock-character-name"><strong>'+roleName(m)+'</strong><small>'+tr('role.source.'+m.role.source)+'</small></span><span class="dock-completeness"><span>'+tr('loadout.title')+'</span><b>'+count+' / 5</b><span class="dock-presence" aria-hidden="true">'+m.slots.map(s=>'<i'+(s.echo?' class="filled"':'')+'></i>').join('')+'</span></span><span class="dock-reading"><b>'+esc(i18n.format.score(m.summary.score))+'</b><small>'+tr('state.'+m.summary.status)+'</small></span><span class="dock-row-context">'+draftStatus(r)+'</span><span class="dock-enter" aria-hidden="true">↗</span></a><button type="button" data-delete-role="'+esc(r.roleId)+'">'+tr('role.delete')+'</button></li>';
            }).join('')+'</ul>'+(list.length?'':'<p>'+t('noMatch')+'</p>');
        }
        function render(){
            document.title=i18n.t('dock.title');
            const open=host.querySelector('[data-dock-picker]')?.open;
            const actions='<div class="dock-create-actions"><a href="register-workspace.html?view=register&mode=import&lang='+i18n.locale+'">'+t('import')+'</a><a href="register-workspace.html?view=register&mode=create&lang='+i18n.locale+'">'+t('create')+'</a></div>';
            let body='';
            if(error==='dataError')body='<p role="alert">'+t(error)+'</p>';
            else if(!selected)body='<section class="dock-empty"><h2>'+t('emptyTitle')+'</h2><p>'+t('emptyBody')+'</p></section>';
            else {
                const m=models.get(String(selected.roleId)),own=statuses.filter(x=>x.baseline.role.identity===String(selected.roleId)).sort((a,b)=>b.draft.updatedAt-a.draft.updatedAt)[0];
                const resume=own?.validity.status==='valid'?own.draft.id:null;
                const slots=m.slots.map(s=>'<span class="dock-recent-slot"><small>'+String(s.position).padStart(2,'0')+'</small>'+(s.echo?'<img src="'+asset(s.echo.image)+'" alt="'+echoName(s.echo)+'">':'<span aria-label="'+tr('loadout.empty')+'">—</span>')+'</span>').join('');
                body='<section class="dock-recent"><div class="dock-recent-identity">'+(m.role.portrait?'<img class="dock-recent-portrait" src="'+asset(m.role.portrait)+'" alt="">':'')+'<div><p>'+t('recent')+'</p><h2>'+roleName(m)+'</h2><p>'+tr('role.chain',{chain:m.model.chain})+'</p><a href="'+roleUrl(selected,resume)+'">'+t(own&&own.validity.status!=='valid'?'recompare':'continue')+' ↗</a></div></div><div class="dock-recent-loadout"><h3>'+tr('loadout.title')+'</h3><div class="dock-recent-slots">'+slots+'</div></div><div class="dock-recent-reading"><span>'+tr('summary.score')+'</span><strong>'+esc(i18n.format.decimal(m.summary.score))+'</strong><p>'+tr('state.'+m.summary.status)+'</p>'+draftStatus(selected)+'</div></section>';
                if(m.issues.length)body+='<p class="dock-findings">'+tr('issues.'+m.issues[0].code,m.issues[0].params)+'</p>';
                body+='<section class="dock-index"><div class="dock-index-heading"><h2>'+t('allRoles',{count:records.length})+'</h2><details data-dock-picker'+(open?' open':'')+'><summary>'+t('filter')+'</summary><div class="dock-filters"><label>'+t('search')+'<input data-dock-search value="'+esc(filter)+'"></label><label>'+t('source')+'<select data-dock-source>'+['all','manual','imported'].map(v=>'<option value="'+v+'"'+(v===source?' selected':'')+'>'+t(v)+'</option>').join('')+'</select></label></div></details></div><div data-dock-roster>'+roster()+'</div></section>';
                if(error==='draftError')body+='<p role="alert">'+t(error)+'</p>';
            }
            host.innerHTML='<header class="register-page-heading"><h1>'+t('title')+'</h1>'+actions+'</header>'+body;
        }
        host.addEventListener('error',e=>{if(e.target.tagName==='IMG')e.target.style.visibility='hidden';},true);
        host.addEventListener('input',e=>{if(e.target.matches('[data-dock-search]')){filter=e.target.value;host.querySelector('[data-dock-roster]').innerHTML=roster();}});
        host.addEventListener('change',e=>{if(e.target.matches('[data-dock-source]')){source=e.target.value;host.querySelector('[data-dock-roster]').innerHTML=roster();}});
        env.addEventListener('wuwa-locale',e=>i18n.setLocale(e.detail));i18n.subscribe(render);
        env.addEventListener('pageshow',refresh);env.addEventListener('focus',refresh);env.addEventListener('storage',refresh);refresh();
    }
    return {select,assess,mount};
});
