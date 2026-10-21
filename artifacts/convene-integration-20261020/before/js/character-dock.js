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
        const navigation=env.RegisterNavigation?.create(env.sessionStorage||localStorage),savedView=navigation?.load('roles')||{};
        let statusFilter=savedView.status||'all',sort=savedView.sort||'recent';
        let records=[],selected=null,models=new Map(),statuses=[],generation=0,backupNotice=null,filter=savedView.search||'',source=savedView.source||'all',error=null,activeView=env.location.hash==='#cultivation-overview'?'overview':['overview','roles'].includes(savedView.view)?savedView.view:'overview';
        const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const t=(key,params)=>esc(i18n.t('dock.'+key,params)),tr=(key,params)=>esc(i18n.t(key,params));
        const roleName=m=>esc(i18n.entity('characters',m.role.catalogId,m.role.legacy?.name||i18n.t('register.characterId',{id:m.role.catalogId})));
        const echoName=e=>esc(i18n.entity('echoes',e.catalogId,e.legacy?.name||i18n.t('register.echoId',{id:e.catalogId})));
        const asset=s=>typeof s==='string'&&/^(image\/|https?:\/\/)/.test(s)?esc(s):'';
        function roleUrl(record,draft){const u=new URL(record.isImport?'mccost-readonly.html':'mccost.html',location.href);u.searchParams.set('roleid',record.roleId);u.searchParams.set('view','register');u.searchParams.set('lang',i18n.locale);if(draft)u.searchParams.set('draft',draft);return esc(u.pathname+u.search);}
        async function digest(record){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(drafts.canonical(drafts.source(record))));return Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join('');}
        async function refresh(){
            const ticket=++generation;error=null;statuses=[];
            try{
                const raw=JSON.parse(localStorage.getItem('mcData')||'null');
                if(raw!==null&&(!Array.isArray(raw.role)||raw.role.some(r=>!r||r.roleId==null)||new Set(raw.role.map(r=>String(r.roleId))).size!==raw.role.length))throw Error('data');
                records=raw?.role||[];models=new Map(records.map(r=>[String(r.roleId),normalize(r)]));
                selected=select(records,UiView.recent(localStorage));
                render();
                const loaded=store.load();if(!loaded.ok){error='draftError';render();return;}
                const results=await Promise.all(loaded.data.drafts.map(async draft=>{
                    const baseline=loaded.data.baselines.find(b=>b.id===draft.baseline.id),record=records.find(r=>String(r.roleId)===baseline.role.identity);
                    if(!record)return null;
                    let validity;try{validity=await assess(record,baseline,draft,normalize,digest);}catch(_){validity={status:'incompatible'};}
                    if(validity.status==='valid'&&env.RoleCandidates)validity=env.RoleCandidates.createAdapter(normalize).assessSource(draft,raw?.unusedEchoes||[],record);
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
        function metadata(){return env.RegisterMetadata?.create(localStorage).load().data||{roles:{},drafts:{}};}
        function configName(r){return env.RegisterMetadata?env.RegisterMetadata.roleName({role:records},r,i18n,metadata()):i18n.t('ops.configuration',{number:records.filter(x=>String(x.roleListId)===String(r.roleListId)).findIndex(x=>String(x.roleId)===String(r.roleId))+1});}
        function remember(){navigation?.save('roles',{view:activeView,search:filter,source,status:statusFilter,sort,scroll:env.scrollY||0});}
        function matching(){const rows=records.map(r=>{const m=models.get(String(r.roleId)),own=statuses.filter(x=>x.baseline.role.identity===String(r.roleId));return {record:r,name:i18n.entity('characters',m.role.catalogId,r.name||'')+' '+configName(r),source:m.role.source,score:m.summary.score,complete:env.RegisterCollections?m.slots.every(env.RegisterCollections.completeData)&&!m.issues.some(x=>!['model-unavailable','slot-incomplete'].includes(x.code)):m.summary.status==='complete',filled:m.slots.filter(s=>s.echo).length,validDraft:own.some(x=>x.validity.status==='valid'),invalidDraft:own.some(x=>x.validity.status!=='valid')};});return env.RegisterCollections?env.RegisterCollections.roles(rows,{search:filter,source,status:statusFilter,sort}).map(x=>x.record):records.filter(r=>(source==='all'||models.get(String(r.roleId)).role.source===source)&&i18n.entity('characters',r.roleListId,r.name||'').toLowerCase().includes(filter.toLowerCase()));}
        function plans(r){const own=statuses.filter(x=>x.baseline.role.identity===String(r.roleId));return '<span class="dock-plans">'+own.map(x=>'<a href="'+roleUrl(r,x.draft.id)+'">'+esc(env.RegisterMetadata?env.RegisterMetadata.draftName(x.draft,i18n,metadata()):i18n.t('ops.planDefault',{slot:x.draft.targetSlot,date:i18n.format.dateTime(x.draft.createdAt)}))+' · '+tr(x.validity.status==='valid'?(x.adopted?'ops.adopted':'ops.saved'):'ops.recompare')+'</a>').join('')+'</span>';}
        function roster(){
            const list=matching();
            return '<p class="op-count">'+tr('ops.count',{matched:list.length,total:records.length})+' <button data-dock-reset>'+tr('ops.reset')+'</button></p><ul class="dock-roster">'+list.map(r=>{
                const m=models.get(String(r.roleId)),count=m.slots.filter(s=>s.echo).length;
                return '<li><a class="dock-character-link" href="'+roleUrl(r)+'"><span class="dock-portrait"><img src="'+asset(m.role.portrait)+'" alt=""></span><span class="dock-character-name"><strong>'+roleName(m)+'</strong><small>'+tr('role.source.'+m.role.source)+'</small><span class="dock-config-name">'+esc(configName(r))+'</span></span><span class="dock-completeness"><span>'+tr('loadout.title')+'</span><b>'+count+' / 5</b><span class="dock-presence" aria-hidden="true">'+m.slots.map(s=>'<i'+(s.echo?' class="filled"':'')+'></i>').join('')+'</span></span><span class="dock-reading"><b>'+esc(i18n.format.score(m.summary.score))+'</b><small>'+tr('state.'+m.summary.status)+'</small></span><span class="dock-row-context">'+draftStatus(r)+'</span><span class="dock-enter" aria-hidden="true">↗</span></a><div class="dock-row-actions"><button type="button" data-delete-role="'+esc(r.roleId)+'">'+tr('role.delete')+'</button></div>'+plans(r)+'</li>';
            }).join('')+'</ul>'+(list.length?'':'<p>'+t('noMatch')+'</p>');
        }
        function render(){
            const focused=env.document?.activeElement,focusKey=focused?.matches?.('[data-dock-search]')?'search':focused?.matches?.('[data-dock-source]')?'source':focused?.matches?.('[data-dock-status]')?'status':focused?.matches?.('[data-dock-sort]')?'sort':null,cursor=focused?.selectionStart;
            document.title=i18n.t('dock.title');
            const open=host.querySelector('[data-dock-picker]')?.open;
            const actions='<div class="dock-create-actions"><a href="register-workspace.html?view=register&mode=import&lang='+i18n.locale+'">'+t('import')+'</a><a href="register-workspace.html?view=register&mode=create&lang='+i18n.locale+'">'+t('create')+'</a></div>';
            let body='',index='';
            if(error==='dataError')body='<p role="alert">'+t(error)+'</p>';
            else if(!selected)body='';
            else {
                const m=models.get(String(selected.roleId)),own=statuses.filter(x=>x.baseline.role.identity===String(selected.roleId)).sort((a,b)=>b.draft.updatedAt-a.draft.updatedAt)[0];
                const resume=own?.validity.status==='valid'?own.draft.id:null;
                const slots=m.slots.map(s=>{
                    // 只消费现有槽位状态；提示浮层不参与布局，也不修改完整度判断。
                    const warning=s.echo&&s.status==='incomplete';
                    const reasons=warning?[s.echo.mainStat.status!=='valid'?tr('dock.missingMain'):null,s.echo.substats.length!==5||s.echo.substats.some(stat=>stat.status!=='valid')?tr('dock.missingSubstats'):null].filter(Boolean):[];
                    const label=tr('issues.slot-incomplete',{position:s.position});
                    const hint=warning?'<details class="dock-slot-warning"><summary aria-label="'+label+'" title="'+label+'"><span aria-hidden="true">!</span></summary><span class="dock-slot-tooltip">'+label+'<br>'+ (reasons.length?reasons.join('<br>'):tr('dock.checkEcho'))+'<a href="'+roleUrl(selected)+'&selectedPosition='+s.position+'&selectedEcho='+esc(s.echo.id??'')+'">'+tr('dock.inspectEcho')+' ↗</a></span></details>':'';
                    return '<span class="dock-recent-slot" data-slot-status="'+s.status+'"><small>'+String(s.position).padStart(2,'0')+'</small>'+hint+(s.echo?'<img src="'+asset(s.echo.image)+'" alt="'+echoName(s.echo)+'">':'<span aria-label="'+tr('loadout.empty')+'">—</span>')+'</span>';
                }).join('');
                body='<section class="dock-recent"><div class="dock-recent-identity">'+(m.role.portrait?'<img class="dock-recent-portrait" src="'+asset(m.role.portrait)+'" alt="">':'')+'<div><p>'+t('recent')+'</p><h2>'+roleName(m)+'</h2><p>'+tr('role.chain',{chain:m.model.chain})+'</p><a href="'+roleUrl(selected,resume)+'">'+t(own&&own.validity.status!=='valid'?'recompare':'continue')+' ↗</a></div></div><div class="dock-recent-loadout"><h3>'+tr('loadout.title')+'</h3><div class="dock-recent-slots">'+slots+'</div></div><div class="dock-recent-reading"><span>'+tr('summary.score')+'</span><strong>'+esc(i18n.format.decimal(m.summary.score))+'</strong><p>'+tr('state.'+m.summary.status)+'</p>'+draftStatus(selected)+'</div></section>';

                index+='<section class="dock-index"><div class="dock-index-heading"><h2>'+t('allRoles',{count:records.length})+'</h2><details data-dock-picker'+(open?' open':'')+'><summary>'+t('filter')+'</summary><div class="dock-filters op-filters"><label>'+t('search')+'<input data-dock-search value="'+esc(filter)+'"></label><label>'+t('source')+'<select data-dock-source>'+['all','manual','imported'].map(v=>'<option value="'+v+'"'+(v===source?' selected':'')+'>'+t(v)+'</option>').join('')+'</select></label><label>'+tr('ops.status')+'<select data-dock-status>'+['all','complete','incomplete','draft','review'].map(v=>'<option value="'+v+'"'+(v===statusFilter?' selected':'')+'>'+tr('ops.'+v)+'</option>').join('')+'</select></label><label>'+tr('ops.sort')+'<select data-dock-sort>'+['recent','name','high','low','complete'].map(v=>'<option value="'+v+'"'+(v===sort?' selected':'')+'>'+tr('ops.'+(v==='name'?'nameSort':v==='complete'?'completeSort':v))+'</option>').join('')+'</select></label></div></details></div><div data-dock-roster>'+roster()+'</div></section>';
                if(error==='draftError')body+='<p role="alert">'+t(error)+'</p>';
            }
            if(error!=='dataError'){
                const tabs=['overview','roles'].map(view=>'<button type="button" role="tab" id="dock-tab-'+view+'" data-dock-view="'+view+'" aria-controls="dock-panel-'+view+'" aria-selected="'+(activeView===view)+'" tabindex="'+(activeView===view?0:-1)+'">'+tr(view==='overview'?'overview.title':'overview.roles')+'</button>').join('');
                body='<div class="dock-view-tabs" role="tablist" aria-label="'+tr('overview.views')+'">'+tabs+'</div><div id="dock-panel-overview" role="tabpanel" aria-labelledby="dock-tab-overview"'+(activeView==='overview'?'':' hidden')+'>'+body+RegisterOverview.render(RegisterOverview.prepare(records,normalize,getCultivationOverview),i18n)+'</div><div id="dock-panel-roles" role="tabpanel" aria-labelledby="dock-tab-roles"'+(activeView==='roles'?'':' hidden')+'>'+(index||'<p class="dock-view-empty">'+t('emptyBody')+'</p>')+'</div>';
            }
            host.innerHTML='<header class="register-page-heading"><h1>'+t('title')+'</h1>'+actions+'</header>'+body;globalThis.RegisterSearchUI?.enhance(host,i18n);if(focusKey){const next=host.querySelector('[data-dock-'+focusKey+']');next?.focus({preventScroll:true});if(focusKey==='search'&&cursor!=null)next?.setSelectionRange(cursor,cursor);}
        }
        // 切换只改变可见性，保留搜索、筛选、选择及管理区域的 DOM 状态。
        function switchView(view,focus=false){
            globalThis.RegisterSearchUI?.enhance(host,i18n);
            if(!['overview','roles'].includes(view))return;
            activeView=view;remember();
            host.querySelectorAll('[data-dock-view]').forEach(button=>{const selected=button.dataset.dockView===view;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;if(selected&&focus)button.focus();});
            ['overview','roles'].forEach(key=>{const panel=host.querySelector('#dock-panel-'+key);if(panel)panel.hidden=key!==view;});
        }
        host.addEventListener('click',e=>{const tab=e.target.closest('[data-dock-view]');if(tab)switchView(tab.dataset.dockView);});
        host.addEventListener('keydown',e=>{const tab=e.target.closest('[data-dock-view]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();switchView(e.key==='Home'?'overview':e.key==='End'?'roles':activeView==='overview'?'roles':'overview',true);});
        env.addEventListener('hashchange',()=>{if(env.location.hash==='#cultivation-overview'){switchView('overview');host.querySelector('#cultivation-overview')?.scrollIntoView();}});
        host.addEventListener('error',e=>{if(e.target.tagName==='IMG')e.target.style.visibility='hidden';},true);
        host.addEventListener('input',e=>{if(e.target.matches('[data-dock-search]')){filter=e.target.value;remember();host.querySelector('[data-dock-roster]').innerHTML=roster();globalThis.RegisterSearchUI?.enhance(host,i18n);}});
        host.addEventListener('change',e=>{if(e.target.matches('[data-dock-source]')){source=e.target.value;remember();host.querySelector('[data-dock-roster]').innerHTML=roster();globalThis.RegisterSearchUI?.enhance(host,i18n);}});
        host.addEventListener('change',e=>{if(e.target.matches('[data-dock-status]'))statusFilter=e.target.value;else if(e.target.matches('[data-dock-sort]'))sort=e.target.value;else return;remember();host.querySelector('[data-dock-roster]').innerHTML=roster();globalThis.RegisterSearchUI?.enhance(host,i18n);});
        host.addEventListener('click',e=>{if(e.target.closest('[data-dock-reset]')){filter='';source='all';statusFilter='all';sort='recent';remember();render();host.querySelector('[data-dock-search]')?.focus();}if(e.target.closest('a'))remember();});
        env.addEventListener('pagehide',remember);
        let restoredScroll=false;env.addEventListener('pageshow',()=>{if(!restoredScroll&&savedView.scroll){restoredScroll=true;setTimeout(()=>env.scrollTo?.(0,savedView.scroll),150);}});
        env.addEventListener('wuwa-locale',e=>i18n.setLocale(e.detail));i18n.subscribe(render);
        env.addEventListener('pageshow',refresh);env.addEventListener('focus',refresh);env.addEventListener('storage',refresh);env.addEventListener('wuwa-core-updated',refresh);refresh();
    }
    return {select,assess,mount};
});
