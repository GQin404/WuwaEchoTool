/* Register presentation 只收集输入；核心操作通过共享服务显式提交。 */
document.addEventListener('DOMContentLoaded',function(){
    'use strict';
    if(UiView.redirecting)return;
    const i18n=EchoI18n.createBrowser(window),params=new URL(location.href).searchParams;
    const mode=['create','echo','import','library','backup','compare','tools'].includes(params.get('mode'))?params.get('mode'):'library',roleId=params.get('roleid'),echoId=params.get('costid');
    const normalize=RoleViewModel.createAdapter({roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection});
    const core=CharacterCore.create({read:()=>getDataFromCache('mcData'),write:saveDataToCache,normalize});
    const importer=ImportService.create({ajax:$.ajax,host:hostName,methods:methodName,headers:completeHeaders,tokenHeaders:completeHeaders2,storage:localStorage,convert:(e,r)=>RoleImportCore.convertPhantomData(e,r,{countMainAttr2,sumCostScores,catalog:costList})});
    const host=document.createElement('main');host.id='register-workspace';document.body.append(host);
    const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const t=(key,p)=>esc(i18n.t('workspace.'+key,p)),tr=(key,p)=>esc(i18n.t(key,p));
    const url=(m,extra={})=>'register-workspace.html?'+new URLSearchParams({view:'register',mode:m,lang:i18n.locale,...extra});
    const navigation=RegisterNavigation.create(sessionStorage),librarySaved=navigation.load('library'),historySaved=navigation.load('history');
    let formGuard=null;
    const historyState={search:historySaved.search||'',status:historySaved.status||'all',names:{}},nameExpectations={};
    const name=(kind,id)=>esc(i18n.entity(kind,id,(kind==='characters'?roleList:costList).find(e=>String(e.id)===String(id))?.name||i18n.t(kind==='characters'?'register.characterId':'register.echoId',{id})));
    let data,expected,record,echo,fields={},notice=mode==='library'?navigation.takeNotice('library')||'':'',busy=false,historyRows=[],historyReady=false,sourceRaw=null,backupText={};
    let fullBackupPending=null;
    function reset(){sourceRaw=localStorage.getItem('mcData');data=core.load();expected=JSON.stringify(data);record=data.role.find(r=>String(r.roleId)===roleId);echo=(record?record.costList:MultiConfig.entities(data)).find(e=>e&&String(e.costId)===echoId);}
    try{reset();}catch(_){notice='INVALID_DATA';data={role:[],unusedEchoes:[]};}
    function roleLink(r,pos,id){const u=new URLSearchParams({view:'register',roleid:r.roleId,lang:i18n.locale});if(r.activeConfigurationId)u.set('configuration',r.activeConfigurationId);if(pos){u.set('selectedPosition',pos);u.set('selectedEcho',id);}return (r.isImport?'mccost-readonly.html':'mccost.html')+'?'+u;}
    function back(){const safe=RegisterNavigation.safeReturn(params.get('returnTo')||(mode==='library'?librarySaved.returnTo:null),location.href);if(safe){const u=new URL(safe,location.href),target=u.searchParams.get('roleid');if(target&&!data.role.some(r=>String(r.roleId)===target))return 'index.html?view=register&lang='+i18n.locale;if(!record||!target||target===String(record.roleId)){u.searchParams.set('lang',i18n.locale);return u.pathname+u.search;}}if(mode==='echo'&&!record)return url('library');
                const pos=echo?record?.costList.findIndex(e=>e&&String(e.costId)===echoId)+1:Number(params.get('selectedPosition'));return record?roleLink(record,pos,echo?.costId||params.get('selectedEcho')):'index.html?view=register&lang='+i18n.locale;}
    if(mode==='import'){
        RegisterImportWorkbench.mount({host,i18n,core,service:importer,normalize,catalog:roleList,mapRole:mappingOfficialRoleId,record,params,roleLink,back});return;
    }
    const mains={Cost1:['攻击18%','生命22.8%','防御18%'],Cost3:['攻击力30%','生命30%','防御38%','共鸣效率32%','属伤30%',...['导电','衍射','湮灭','气动','热熔','冷凝'].map(x=>x+'伤害30%')],Cost4:['暴击22%','暴伤44%','攻击力33%','生命33%','防御41.8%','治疗26.4%']};
    function mainLabel(raw,type){const dummy={roleId:1,roleListId:1,costList:[{type,mainAtrri:raw,propertyList:[]}]};const stat=normalize(dummy).slots[0].echo.mainStat;return tr('stats.'+stat.key)+' '+esc(i18n.format.percentage(stat.value));}
    function initFields(){
        fields={catalog:echo?.costListId||(mode==='create'?roleList[0].id:''),main:typeof echo?.mainAtrri==='string'?echo.mainAtrri:echo?.mainAtrri?({大攻击:echo.type==='Cost1'?'攻击':'攻击力',大生命:'生命',大防御:'防御'}[echo.mainAtrri.property]||echo.mainAtrri.property)+echo.mainAtrri.value:'',suite:echo?.suite||'',stats:Array.from({length:5},(_,i)=>({key:StatKeys.fromLegacy(echo?.propertyList?.[i]?.property)||'',value:echo?.propertyList?.[i]?.value==null?'':String(echo.propertyList[i].value).replace('%','')}))};
    }
    initFields();
    // 只映射词条类别，具体档位始终读取 Classic 共用的 fctValue。
    const rollTypes={crit_rate:0,crit_damage:1,atk_percent:2,hp_percent:2,basic_attack_damage:2,heavy_attack_damage:2,resonance_skill_damage:2,resonance_liberation_damage:2,def_percent:3,resonance_efficiency:4,hp_flat:5,atk_flat:6,def_flat:7};
    function rollSelect(s,i){
        const values=(fctValue[rollTypes[s.key]]?.values||[]).map(v=>String(parseFloat(v)));
        const current=s.value!==''?String(Number(s.value)):'';
        const label=v=>esc(RoleCandidates.unit(s.key)==='percent'?i18n.format.percentage(Number(v)):i18n.format.decimal(Number(v)));
        const original=current&&!values.includes(current)?`<option value="${esc(current)}" selected>${label(current)} · ${t('storedValue')}</option>`:'';
        return `<select name="value${i}"${s.key?'':' disabled'}><option value="">${tr('candidate.unset')}</option>${original}${values.map(v=>`<option value="${v}"${v===current?' selected':''}>${label(v)}</option>`).join('')}</select>`;
    }
    const catalogSelect=(kind,value)=>`<select name="catalog" required>${kind==='echoes'?`<option value="">${t('chooseEcho')}</option>`:''}${(kind==='characters'?roleList:costList).map(e=>`<option value="${esc(e.id)}"${String(e.id)===String(value)?' selected':''}>${name(kind,e.id)}${kind==='echoes'?' · '+esc(e.type):''}</option>`).join('')}</select>`;
    const action=label=>`<div class="rw-actions"><button class="rw-primary" type="submit"${busy?' disabled':''}>${t(label)}</button><a href="${back()}">${t('cancel')}</a></div>`;
    function echoForm(){
        if(roleId&&!record||echoId&&!echo)return '<p>'+t('SOURCE_CHANGED')+'</p>';
        if(!data.loadoutVersion&&(record?.isImport||echo&&typeof echo.mainAtrri==='object'&&echo.mainAtrri!==null))return '<p>'+t('READ_ONLY')+'</p>';
        const cat=costList.find(e=>String(e.id)===String(fields.catalog));if(!cat)return '<form data-action="echo"><label>'+tr('candidate.echo')+catalogSelect('echoes',fields.catalog)+'</label><p>'+t('chooseEcho')+'</p>'+action('save')+'</form>';
        // 旧存档可能包含不同的小数精度，保留当前值作为可见选项，避免打开即隐式改写。
        if(fields.main&&!mains[cat.type].includes(fields.main))mains[cat.type].push(fields.main);
        return `${echo?`<p class="rw-edit-impact">${esc(window.MultiConfigUI?.impact(echo.costId)||'')}</p>`:''}<div class="rw-echo-preview"><img src="${esc(cat.imgCode)}" alt="${name('echoes',cat.id)}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span hidden>${t('previewUnavailable')}</span><div><strong>${name('echoes',cat.id)}</strong><p>${esc(cat.type)}</p></div></div><form data-action="echo"><label>${tr('candidate.echo')}${catalogSelect('echoes',fields.catalog)}</label><label>${tr('loadout.mainStat')}<select name="main"><option value="">${tr('candidate.unset')}</option>${mains[cat.type].map(v=>`<option value="${esc(v)}"${v===fields.main?' selected':''}>${mainLabel(v,cat.type)}</option>`).join('')}</select></label><label>${t('suite')}<select name="suite"><option value="">${tr('candidate.unset')}</option>${Object.entries(suiteAttributeMap).map(([legacy,id])=>`<option value="${esc(legacy)}"${fields.suite===legacy?' selected':''}>${esc(i18n.entity('sets',id,legacy))}</option>`).join('')}</select></label><p>${t('incompleteAllowed')}</p>${fields.stats.map((s,i)=>`<div class="rw-stat"><label>${tr('candidate.substatIndex',{position:i+1})}<select name="key${i}"><option value="">${tr('candidate.unset')}</option>${RoleCandidates.SUB.map(k=>`<option value="${k}"${s.key===k?' selected':''}>${tr('stats.'+k)}</option>`).join('')}</select></label><label>${tr('analysis.actualValue')}${rollSelect(s,i)}</label></div>`).join('')}${action('save')}</form>${echo&&record?`<button data-unequip>${t('unequip')}</button> <button data-delete-equipped>${t('delete')}</button>`:''}${!echo&&record?`<button type="button" data-open-inventory>${t('equipLibrary')}</button><p>${t('appendSlot',{position:record.costList.length+1})}</p>`:''}`;
    }
    const libraryState={selected:null,detailOpen:false,search:'',cost:'',suite:'',main:'',completeness:'',sort:'recent',favorite:false,equipRole:'',compareRole:'',contextRole:'',position:'',...librarySaved};
    if(mode==='library'&&roleId){if(record){libraryState.contextRole=libraryState.compareRole=String(record.roleId);libraryState.position=record.costList[Number(params.get('selectedPosition'))-1]?params.get('selectedPosition'):'';}else notice='SOURCE_CHANGED';libraryState.returnTo=RegisterNavigation.safeReturn(params.get('returnTo'),location.href);}
    if(mode==='library'){
        for(const key of ['contextRole','compareRole','equipRole'])if(libraryState[key]&&!data.role.some(r=>String(r.roleId)===libraryState[key])){libraryState[key]='';libraryState.position='';notice='SOURCE_CHANGED';}
        if(libraryState.selected&&!MultiConfig.entities(data).some(e=>String(e.costId)===libraryState.selected)){libraryState.selected=null;libraryState.detailOpen=false;notice='SOURCE_CHANGED';}
        if(!libraryState.contextRole&&libraryState.sort==='contribution')libraryState.sort='recent';
    }
    let libraryIndexSignature=null,retainedIndex=null,inspectorObserver=null;
    function indexSignature(){return JSON.stringify({echoes:MultiConfig.entities(data),references:data.role.map(r=>({roleId:r.roleId,roleListId:r.roleListId,active:r.activeConfigurationId,configurations:r.configurations?.map(c=>({id:c.id,name:c.name,slots:c.slots}))})),reference:data.role.find(r=>String(r.roleId)===String(libraryState.contextRole)),locale:i18n.locale,filters:Object.fromEntries(['search','cost','suite','main','completeness','sort','favorite','contextRole'].map(k=>[k,libraryState[k]])),favorites:libraryState.favorite?localStorage.getItem('wuwa.register.echoMeta.v1'):null});}
    function sizeInspector(){const inspector=host.querySelector('.rw-inspector');if(!inspector)return;const title=inspector.querySelector('#rw-inspector-title'),back=inspector.querySelector('[data-library-close]');if(title&&innerWidth<=960&&!back){const button=document.createElement('button');button.type='button';button.className='rw-inspector-close';button.setAttribute('data-library-close','');button.textContent=i18n.t('ops.backList');title.before(button);}else if(back&&innerWidth>960){if(document.activeElement===back)title?.focus({preventScroll:true});back.remove();}const nav=document.querySelector('#register-shell nav'),bottom=nav&&getComputedStyle(nav).position==='fixed'?nav.getBoundingClientRect().height:0;inspector.classList.toggle('rw-sticky',innerWidth>960&&inspector.getBoundingClientRect().height<=innerHeight-bottom-32);}
    window.addEventListener('resize',sizeInspector);
    function rememberLibrary(){navigation.save('library',{...libraryState,scroll:scrollY,listScroll:host.querySelector('.rw-echo-index')?.scrollTop||0,inspectorScroll:host.querySelector('.rw-inspector')?.scrollTop||0});}
    function savedDestination(r,pos,id){const safe=RegisterNavigation.safeReturn(params.get('returnTo'),location.href);if(safe){const u=new URL(safe,location.href);u.searchParams.set('lang',i18n.locale);if(u.pathname.endsWith('/register-workspace.html')){navigation.save('library',{...navigation.load('library'),selected:String(id),detailOpen:true});navigation.notify('library','saved');return u.pathname+u.search;}if(r&&u.searchParams.get('roleid')===String(r.roleId)){navigation.notify('role:'+r.roleId,'saved');if(pos){u.searchParams.set('selectedPosition',pos);u.searchParams.set('selectedEcho',id);}return u.pathname+u.search;}}if(!r)navigation.save('library',{...navigation.load('library'),selected:String(id),detailOpen:true});navigation.notify(r?'role:'+r.roleId:'library','saved');return r?roleLink(r,pos,id):url('library');}
    if(mode==='echo'||mode==='create'){formGuard=RegisterUnsaved.create({scope:'workspace:'+mode+':'+(roleId||'library')+':'+(record?.activeConfigurationId||'legacy')+':'+(echoId||'new'),get:()=>fields,apply:value=>fields=value,revision:expected,serialize:v=>JSON.stringify({...v,catalog:String(v.catalog)}),i18n});formGuard.recover();}

    const ECHO_META_KEY='wuwa.register.echoMeta.v1';
    function updateEchoMeta(id,patch){try{const raw=localStorage.getItem(ECHO_META_KEY),meta=JSON.parse(raw||'{}');if(!meta||Array.isArray(meta)||typeof meta!=='object')throw Error('INVALID_DATA');meta[String(id)]={...(meta[String(id)]||{}),...patch};if(localStorage.getItem(ECHO_META_KEY)!==raw)throw Error('SOURCE_CHANGED');localStorage.setItem(ECHO_META_KEY,JSON.stringify(meta));notice=patch.favorite?'favoriteSaved':'favoriteRemoved';}catch(error){notice=error.message==='SOURCE_CHANGED'?'SOURCE_CHANGED':'SAVE_FAILED';}}
    const secondary=RegisterSecondaryViews.create({i18n,esc,name,url,normalize,roleLink,catalog:costList,suites:suiteAttributeMap});
    // 列表、选中项和预检共用实体集合；“已使用”仅是可重设的显示筛选。
    function openInventory(){
        if(mode!=='echo'||echoId||!record||!data.loadoutVersion&&record.isImport)return;
        const opener=document.activeElement,dialog=document.createElement('dialog');
        dialog.className='rw-inventory-dialog';dialog.setAttribute('aria-labelledby','rw-inventory-title');
        const filterSelect=(key,label)=>`<label>${label}<select data-picker-${key}><option value="">${tr('secondary.all')}</option></select></label>`;
        dialog.innerHTML=`<header><h2 id="rw-inventory-title">${t('inventoryTitle')}</h2><button type="button" data-picker-close>${tr('common.close')}</button></header><p data-picker-target></p><div class="rw-picker-sources"><a data-picker-manual href="${url('echo',{roleid:roleId,selectedPosition:params.get('selectedPosition')||'',returnTo:back()})}" target="_top">${t('addManual')}</a><a data-picker-screenshot href="${url('library',{screenshot:'1',returnTo:back(),roleid:roleId,inventoryReturn:'1',selectedPosition:params.get('selectedPosition')||''})}" target="_top">${tr('screenshot.screenshot')}</a></div><label class="rw-picker-position">${tr('secondary.position')}<select data-picker-position><option value="">${t('inventoryAutoSlot')}</option>${Array.from({length:5},(_,i)=>`<option value="${i+1}">${tr('loadout.slot',{position:i+1})}</option>`).join('')}</select></label><section class="rw-picker-search"><label>${tr('secondary.search')}<input type="search" data-picker-search></label><button type="button" data-picker-toggle aria-expanded="false" aria-controls="rw-picker-panel">${t('inventoryFilters')} ▾</button><div id="rw-picker-panel" class="rw-picker-panel" hidden><label class="rw-picker-hide"><input type="checkbox" data-picker-hide-used>${t('inventoryHideUsed')}</label>${filterSelect('cost',tr('secondary.cost'))}${filterSelect('suite',t('suite'))}${filterSelect('main',tr('secondary.main'))}<div class="rw-picker-panel-actions"><button type="button" data-picker-reset>${tr('ops.reset')}</button><button type="button" data-picker-collapse>${t('inventoryCollapse')}</button></div></div></section><p role="status" data-picker-count></p><p role="alert" data-picker-error></p><p role="status" data-picker-feedback></p><div class="rw-picker-list"></div><footer><span data-picker-choice aria-live="polite"></span><button type="button" data-picker-done>${t('finishEquip')}</button><button type="button" data-picker-refresh>${t('inventoryRefresh')}</button><button type="button" class="rw-primary" data-picker-confirm disabled>${t('inventoryConfirm')}</button></footer>`;
        host.append(dialog);
        const defaults={search:'',cost:'',suite:'',main:'',hideUsed:false},pickerKey='picker:'+roleId+':'+record.activeConfigurationId,state={...defaults,...navigation.load(pickerKey),selected:null},availability=new Map();
        let snapshot,revision,target,saving=false,position=/^[1-5]$/.test(params.get('selectedPosition')||'')?Number(params.get('selectedPosition')):undefined,initialized=false;
        dialog.querySelector('[data-picker-position]').value=position||'';
        const error=dialog.querySelector('[data-picker-error]'),confirmButton=dialog.querySelector('[data-picker-confirm]'),toggle=dialog.querySelector('[data-picker-toggle]'),panel=dialog.querySelector('.rw-picker-panel');
        const message=e=>i18n.t('workspace.'+(e.message==='INVALID_CONFIG'?'INVALID_DATA':(['SOURCE_CHANGED','INVALID_DATA','INVALID_ECHO','READ_ONLY','IDENTITY','COST_LIMIT'].includes(e.message)?e.message:'SAVE_FAILED')));
        const entities=()=>snapshot?MultiConfig.entities(snapshot):[];
        function expand(open){panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.classList.toggle('is-active',open);}
        function preflight(){
            availability.clear();
            if(!target)return;
            const slot=position||(MultiConfig.active(target).slots.findIndex(id=>id==null)+1);
            const active=MultiConfig.active(target),used=active.slots.filter(id=>id!=null).length,total=target.costList.reduce((n,e)=>n+(e?Number(e.type.replace('Cost','')):0),0),full=used===5&&!position,complete=full&&total<=12&&target.costList.filter(Boolean).length===used;
            dialog.dataset.complete=String(complete);
            dialog.querySelector('#rw-inventory-title').textContent=i18n.t(full?(complete?'workspace.configurationComplete':'workspace.configurationAttention'):'workspace.inventoryTitle');
            dialog.querySelector('[data-picker-target]').textContent=(full?'5/5':i18n.t('workspace.inventoryTarget',{name:i18n.entity('characters',target.roleListId,target.name),position:slot}))+' · '+(active.name||i18n.t('mc.defaultName'))+' · Cost '+(Number.isFinite(total)?total:'—')+' / 12 · '+i18n.t('workspace.remainingCost',{n:Number.isFinite(total)?12-total:'—'});
            dialog.querySelector('[data-picker-done]').classList.toggle('rw-primary',complete);
            confirmButton.hidden=full;
            dialog.querySelector('[data-picker-manual]').href=url('echo',{roleid:roleId,selectedPosition:slot||'',returnTo:back()});
            dialog.querySelector('[data-picker-screenshot]').href=url('library',{screenshot:'1',roleid:roleId,inventoryReturn:'1',selectedPosition:slot||'',returnTo:back()});
            for(const item of entities()){
                const usedAt=active.slots.findIndex(id=>id!=null&&String(id)===String(item.costId));
                if(usedAt>=0){availability.set(String(item.costId),i18n.t('workspace.equippedAt',{position:usedAt+1}));continue;}
                if(complete){availability.set(String(item.costId),i18n.t('workspace.selectReplacement'));continue;}
                try{core.equip(JSON.parse(revision),roleId,item.costId,position);}catch(e){availability.set(String(item.costId),message(e));}
            }
        }
        function draw(){
            const records=entities(),context={data:snapshot,roleId,configurationId:target?.activeConfigurationId};
            const result=secondary.inventory(records,state,availability,context);
            dialog.querySelector('.rw-picker-list').innerHTML=result.html;
            dialog.querySelector('[data-picker-count]').textContent=i18n.t('ops.count',{matched:result.count,total:records.length});
            const chosen=records.find(e=>String(e.costId)===state.selected);
            dialog.querySelector('[data-picker-choice]').textContent=chosen?i18n.entity('echoes',chosen.costListId,chosen.name):'';
            confirmButton.disabled=saving||!chosen||availability.has(state.selected);
            const n=['search','cost','suite','main'].filter(k=>!!state[k]).length+Number(!state.hideUsed);
            toggle.textContent=i18n.t('workspace.inventoryFilters')+(n?' ('+n+')':'')+(panel.hidden?' ▾':' ▴');
        }
        function refresh(){
            error.textContent='';availability.clear();
            try{
                snapshot=core.load();revision=JSON.stringify(snapshot);target=snapshot.role.find(r=>String(r.roleId)===roleId);
                if(!target||target.activeConfigurationId!==record.activeConfigurationId)throw Error('SOURCE_CHANGED');
                if(!initialized){state.selected=position&&MultiConfig.active(target).slots[position-1]!=null?String(MultiConfig.active(target).slots[position-1]):null;initialized=true;}
                if(!entities().some(e=>String(e.costId)===state.selected))state.selected=null;
                for(const [key,values,label] of [
                    ['cost',['Cost1','Cost3','Cost4'],v=>v],
                    ['suite',[...new Set(entities().map(e=>e.suite).filter(Boolean))],v=>i18n.entity('sets',suiteAttributeMap[v],v)],
                    ['main',[...new Set(entities().map(e=>normalize({roleId:'inventory',roleListId:0,costList:[e]}).slots[0].echo?.mainStat.key).filter(Boolean))],v=>i18n.t('stats.'+v)]
                ]){dialog.querySelector('[data-picker-'+key+']').innerHTML=`<option value="">${tr('secondary.all')}</option>`+values.map(v=>`<option value="${esc(v)}">${esc(label(v))}</option>`).join('');dialog.querySelector('[data-picker-'+key+']').value=state[key];}
                preflight();
            }catch(e){snapshot=null;target=null;error.textContent=message(e);}
            draw();
        }
        function rememberPicker(){navigation.save(pickerKey,{...state,scroll:dialog.querySelector('.rw-picker-list').scrollTop,expanded:!panel.hidden});}
        window.addEventListener('pagehide',rememberPicker,{once:true});
        function close(){window.removeEventListener('pagehide',rememberPicker);navigation.save(pickerKey,{...state,scroll:dialog.querySelector('.rw-picker-list').scrollTop,expanded:!panel.hidden});if(params.get('embedded')==='1'&&parent!==window){parent.postMessage({type:'wuwa-picker-close'},location.origin);return;}dialog.close();dialog.remove();if(params.get('inventory')==='1'){location.replace(back());return;}opener?.focus();}
        dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
        dialog.querySelector('[data-picker-close]').onclick=close;dialog.querySelector('[data-picker-done]').onclick=close;
        dialog.querySelector('[data-picker-refresh]').onclick=refresh;
        toggle.onclick=()=>{expand(panel.hidden);draw();};
        dialog.querySelector('[data-picker-collapse]').onclick=()=>{expand(false);draw();toggle.focus();};
        dialog.querySelector('[data-picker-reset]').onclick=()=>{Object.assign(state,defaults);for(const k of ['search','cost','suite','main'])dialog.querySelector('[data-picker-'+k+']').value='';dialog.querySelector('[data-picker-hide-used]').checked=true;draw();};
        dialog.querySelector('[data-picker-search]').oninput=e=>{state.search=e.target.value;draw();};
        for(const k of ['cost','suite','main'])dialog.querySelector('[data-picker-'+k+']').onchange=e=>{state[k]=e.target.value;draw();};
        dialog.querySelector('[data-picker-hide-used]').onchange=e=>{state.hideUsed=e.target.checked;draw();};
        dialog.querySelector('[data-picker-position]').onchange=e=>{position=e.target.value?Number(e.target.value):undefined;preflight();draw();};
        dialog.querySelector('.rw-picker-list').onclick=e=>{const b=e.target.closest('[data-picker-select]');if(!b||b.disabled)return;state.selected=b.dataset.pickerSelect;draw();dialog.querySelector(`[data-picker-select="${CSS.escape(state.selected)}"]`)?.focus({preventScroll:true});};
        confirmButton.onclick=()=>{
            if(confirmButton.disabled||saving)return;saving=true;confirmButton.disabled=true;error.textContent='';dialog.querySelector('[data-picker-feedback]').textContent='';
            try{let equippedPosition;const selected=state.selected,scroll=dialog.querySelector('.rw-picker-list').scrollTop;core.transact(revision,d=>equippedPosition=core.equip(d,roleId,selected,position));formGuard?.markSaved();reset();state.selected=null;saving=false;position=MultiConfig.active(record).slots.findIndex(v=>v==null)+1||undefined;dialog.querySelector('[data-picker-position]').value=position||'';refresh();dialog.querySelector('[data-picker-feedback]').textContent=i18n.t(position?'workspace.equippedNext':'workspace.equippedComplete');dialog.querySelector('.rw-picker-list').scrollTop=scroll;if(params.get('embedded')==='1'&&parent!==window)parent.postMessage({type:'wuwa-picker-saved'},location.origin);}
            catch(e){error.textContent=message(e);saving=false;if(e.message==='SOURCE_CHANGED'){state.selected=null;snapshot=null;}draw();}
        };
        refresh();dialog.querySelector('[data-picker-search]').value=state.search;dialog.querySelector('[data-picker-hide-used]').checked=state.hideUsed;expand(!!state.expanded);draw();dialog.showModal();dialog.querySelector('.rw-picker-list').scrollTop=state.scroll||0;dialog.querySelector('[data-picker-search]').focus();
    }
    host.addEventListener('click',e=>{if(e.target.closest('[data-open-inventory]'))openInventory();});
    function backupPreview(summary,raw){const box=host.querySelector('[data-full-backup-preview]');box.innerHTML='<dl>'+Object.entries(summary).map(([k,v])=>'<div><dt>'+tr('backupCount.'+k)+'</dt><dd>'+esc(v)+'</dd></div>').join('')+'</dl><details><summary>'+tr('secondary.json')+'</summary><pre></pre></details>';box.querySelector('pre').textContent=raw;}
    function drawCurrentCounts(){const box=host.querySelector('[data-complete-counts]');if(!box)return;const current=RegisterBackup.summary(RegisterBackup.exportData({storage:localStorage,coreData:data}).sections);box.innerHTML='<dl>'+Object.entries(current).map(([k,v])=>'<div><dt>'+tr('backupCount.'+k)+'</dt><dd>'+esc(v)+'</dd></div>').join('')+'</dl>';const ticket=expected;(conveneBackupStore||(conveneBackupStore=ConveneStore.create())).read().then(d=>{if(ticket!==expected||!box.isConnected)return;box.insertAdjacentHTML('beforeend','<p>'+tr('backupCount.conveneAccounts')+' '+d.accounts.length+' · '+tr('backupCount.convenePulls')+' '+d.accounts.reduce((n,a)=>n+a.records.length,0)+'</p>');}).catch(()=>{});}
    function backupCounts(){const drafts=RoleDraftStorage.create(localStorage).load(),adoptions=RoleLocalConfiguration.create(localStorage).load();return {core:data.role.length+(MultiConfig.entities(data)).length,drafts:drafts.ok?drafts.data.drafts.length:null,adoptions:adoptions.ok?adoptions.data.items.length:null};}
    let showScreenshots=params.get('screenshot')==='1',showAddChoice=false;
    const screenshots=mode==='library'&&notice!=='INVALID_DATA'?RegisterScreenshotImport.create({i18n,catalog:costList,suites:suiteAttributeMap,core,roleId:null,onSaved:({complete})=>{reset();if(complete&&params.get('inventoryReturn')==='1'&&record){location.replace(url('echo',{roleid:roleId,inventory:'1',selectedPosition:params.get('selectedPosition')||'',returnTo:back()}));return;}if(complete){showScreenshots=false;screenshots.clear();queueMicrotask(()=>host.querySelector('[data-library-add]')?.focus());}},rollValues:Object.fromEntries(Object.entries(rollTypes).map(([key,index])=>[key,fctValue[index].values.map(parseFloat)])),mainValues:Object.fromEntries(Object.entries(mains).map(([type,values])=>[type,values.map(raw=>{const stat=normalize({roleId:1,roleListId:1,costList:[{type,mainAtrri:raw,propertyList:[]}]}).slots[0].echo.mainStat;return {key:stat.key,value:stat.value,raw};})]))}):null;
    function body(){
        host.setAttribute('aria-busy',String(busy));
        if(mode==='create')return `<form data-action="create"><label>${t('character')}${catalogSelect('characters',fields.catalog)}</label>${action('create')}</form>`;
        if(mode==='echo')return params.get('inventory')==='1'&&record&&!echo?`<p>${name('characters',record.roleListId)}</p><button type="button" data-open-inventory>${t('addInventory')}</button> <a href="${back()}">${t('cancel')}</a>`:echoForm();
        if(mode==='library')return showScreenshots?'<button type="button" data-library-screenshot-back>'+tr('screenshot.backLibrary')+'</button>'+(screenshots?screenshots.render():'<p>'+t('INVALID_DATA')+'</p>'):secondary.library(data,libraryState,{omitList:!!retainedIndex,mobileDetail:innerWidth<=960})+(showAddChoice?`<dialog class="rw-add-choice" aria-labelledby="rw-add-choice-title"><h2 id="rw-add-choice-title">${t('addEcho')}</h2><p>${tr('screenshot.chooseMethod')}</p><div><a href="${url('echo')}">${tr('screenshot.manual')}</a><button type="button" data-library-screenshot>${tr('screenshot.screenshot')}</button></div><button type="button" data-add-choice-close>${tr('common.cancel')}</button></dialog>`:'');
        if(mode==='backup')return secondary.backup(backupCounts(),backupText);
        if(mode==='compare')return secondary.history(historyRows,historyReady,historyState);
        return '<div id="rw-tools"></div>';
    }
    function render(){const sig=mode==='library'&&!showScreenshots?indexSignature():null;retainedIndex=sig&&sig===libraryIndexSignature?host.querySelector('.rw-echo-index'):null;const pageScroll=scrollY,active=document.activeElement,selector=active?.dataset.libraryFavorite?'.'+(active.classList.contains('rw-inspector-favorite')?'rw-inspector-favorite':'rw-favorite-toggle')+'[data-library-favorite="'+CSS.escape(active.dataset.libraryFavorite)+'"]':active?.dataset.libraryFilter?'[data-library-filter="'+active.dataset.libraryFilter+'"]':active?.dataset.libraryField?'[data-library-field="'+active.dataset.libraryField+'"]':active?.dataset.historyFilter?'[data-history-filter="'+active.dataset.historyFilter+'"]':active?.dataset.historyName?'[data-history-name="'+CSS.escape(active.dataset.historyName)+'"]':null,cursor=active?.selectionStart,listScroll=host.querySelector('.rw-echo-index')?.scrollTop??librarySaved.listScroll??0,inspectorScroll=host.querySelector('.rw-inspector')?.scrollTop??librarySaved.inspectorScroll??0;document.title=i18n.t(mode==='compare'?'nav.compare':mode==='echo'&&!echoId?'workspace.addEcho':'workspace.'+mode);host.innerHTML=`${['echo','create'].includes(mode)?`<a class="op-back" href="${back()}">${tr('ops.backList')}</a>`:''}${['echo','create'].includes(mode)?`<nav class="rw-editor-breadcrumb" aria-label="${tr('shell.breadcrumb')}"><a href="index.html?view=register&lang=${i18n.locale}">${tr('nav.characters')}</a><span>/</span><a href="${record?roleLink(record):url('library')}">${record?name('characters',record.roleListId):tr('nav.echoLibrary')}</a><span>/</span><span aria-current="page">${mode==='echo'&&!echoId?t('addEcho'):t(mode)}</span></nav>`:''}<header class="register-page-heading"><h1>${mode==='compare'?tr('nav.compare'):t(mode==='echo'&&!echoId?'addEcho':mode)}</h1>${mode==='library'&&!showScreenshots?`<div class="dock-create-actions"><button type="button" data-library-add${busy?' disabled':''}>${t('addEcho')}</button></div>`:''}</header><p role="${['saved','deleted','historyUpdated','favoriteSaved','favoriteRemoved'].includes(notice)?'status':'alert'}" class="rw-notice">${notice?(typeof notice==='object'?esc(ImportService.formatError(notice,(key,p)=>i18n.t(key,p))):t(notice)):''}</p>${body()}`;if(retainedIndex){host.querySelector('.rw-echo-index')?.replaceWith(retainedIndex);retainedIndex.querySelectorAll('[data-library-select]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.librarySelect===libraryState.selected)));}libraryIndexSignature=sig;retainedIndex=null;host.querySelectorAll('[data-library-favorite]').forEach(b=>{let favorite=false;try{favorite=!!JSON.parse(localStorage.getItem(ECHO_META_KEY)||'{}')[b.dataset.libraryFavorite]?.favorite;}catch(_){}b.setAttribute('aria-pressed',String(favorite));if(b.classList.contains('rw-favorite-toggle')){b.textContent=favorite?'★':'☆';b.setAttribute('aria-label',i18n.t('secondary.'+(favorite?'unfavorite':'favorite'))+' · '+(b.closest('.rw-echo-entry')?.querySelector('strong')?.textContent||''));}});globalThis.RegisterSearchUI?.enhance(host,i18n);sizeInspector();inspectorObserver?.disconnect();if(typeof ResizeObserver!=='undefined'){inspectorObserver=inspectorObserver||new ResizeObserver(sizeInspector);const inspector=host.querySelector('.rw-inspector');if(inspector)inspectorObserver.observe(inspector);}host.querySelector('.rw-add-choice')?.showModal();if(mode==='backup')drawCurrentCounts();if(mode==='tools')RegisterTools.mount(host.querySelector('#rw-tools'),i18n);if(selector){const next=host.querySelector(selector);next?.focus({preventScroll:true});if(cursor!=null&&next?.type==='search')next.setSelectionRange(cursor,cursor);}if(host.querySelector('.rw-echo-index'))host.querySelector('.rw-echo-index').scrollTop=listScroll;if(host.querySelector('.rw-inspector'))host.querySelector('.rw-inspector').scrollTop=inspectorScroll;scrollTo(0,pageScroll);}
    screenshots?.mount(host,render);
    function closeAddChoice(){showAddChoice=false;render();host.querySelector('[data-library-add]')?.focus();}
    host.addEventListener('cancel',e=>{if(e.target.matches('.rw-add-choice')){e.preventDefault();closeAddChoice();}},true);
    host.addEventListener('click',e=>{if(e.target.closest('[data-library-add]')){showAddChoice=true;render();}if(e.target.closest('[data-add-choice-close]'))closeAddChoice();if(e.target.closest('[data-library-screenshot]')){screenshots?.start();showAddChoice=false;showScreenshots=true;render();}if(e.target.closest('[data-library-screenshot-back]')){screenshots?.clear();showScreenshots=false;refreshWorkspace(true);host.querySelector('[data-library-add]')?.focus();}});
    host.addEventListener('input',e=>{
        const key=e.target.dataset.libraryFilter;if(key){const start=e.target.selectionStart;libraryState[key]=e.target.type==='checkbox'?e.target.checked:e.target.value;rememberLibrary();render();const input=host.querySelector('[data-library-filter="'+key+'"]');input?.focus();if(key==='search')input?.setSelectionRange(start,start);}
    });
    host.addEventListener('change',e=>{
        const key=e.target.dataset.libraryField;if(key){libraryState[key]=e.target.value;if(key==='compareRole')libraryState.position='';if(key==='contextRole'){libraryState.compareRole=e.target.value;libraryState.position='';if(!e.target.value&&libraryState.sort==='contribution')libraryState.sort='recent';}rememberLibrary();render();host.querySelector('[data-library-field="'+key+'"]')?.focus();}
    });
    host.addEventListener('click',e=>{
        const fav=e.target.closest('[data-library-favorite]');if(fav){e.stopPropagation();updateEchoMeta(fav.dataset.libraryFavorite,{favorite:fav.getAttribute('aria-pressed')!=='true'});rememberLibrary();render();return;}
        const row=e.target.closest('[data-library-select]');if(row){libraryState.listReturnScroll=scrollY;libraryState.selected=row.dataset.librarySelect;libraryState.detailOpen=true;rememberLibrary();render();host.querySelector('#rw-inspector-title')?.focus({preventScroll:true});if(innerWidth<=960||!host.querySelector('.rw-inspector').classList.contains('rw-sticky'))scrollTo(0,host.querySelector('.rw-inspector').getBoundingClientRect().top+scrollY-16);}
        if(e.target.closest('[data-library-close]')){libraryState.detailOpen=false;rememberLibrary();render();host.querySelector('[data-library-select="'+CSS.escape(libraryState.selected)+'"]')?.focus({preventScroll:true});scrollTo(0,libraryState.listReturnScroll||0);}
        if(e.target.closest('[data-library-compare]')){
            if(JSON.stringify(core.load())!==expected){notice='SOURCE_CHANGED';reset();render();return;}
            const latest=core.load(),target=latest.role.find(r=>String(r.roleId)===libraryState.compareRole),position=Number(libraryState.position),original=target?.costList[position-1];
            const matches=MultiConfig.entities(latest).filter(e=>String(e.costId)===libraryState.selected);
            if(!original||matches.length!==1){notice='SOURCE_CHANGED';render();return;}
            rememberLibrary();location.assign(roleLink(target,position,original.costId)+'&from=library&libraryCandidate='+encodeURIComponent(libraryState.selected));
        }
    });
    host.addEventListener('keydown',e=>{const fav=e.target.closest('[data-library-favorite]');if(fav&&(e.key==='Enter'||e.key===' ')){e.preventDefault();updateEchoMeta(fav.dataset.libraryFavorite,{favorite:fav.getAttribute('aria-pressed')!=='true'});rememberLibrary();render();return;}if(e.key==='Escape'&&libraryState.detailOpen){libraryState.detailOpen=false;rememberLibrary();render();host.querySelector('[data-library-select="'+CSS.escape(libraryState.selected)+'"]')?.focus({preventScroll:true});scrollTo(0,libraryState.listReturnScroll||0);}});
    host.addEventListener('input',e=>{if(e.target.dataset.json)backupText[e.target.dataset.json]=e.target.value;const n=e.target.name;if(n==='catalog')fields.catalog=e.target.value;if(n==='main')fields.main=e.target.value;if(n==='suite')fields.suite=e.target.value;for(let i=0;i<5;i++){if(n==='key'+i&&fields.stats[i].key!==e.target.value){fields.stats[i].key=e.target.value;fields.stats[i].value='';}if(n==='value'+i)fields.stats[i].value=e.target.value;}});
    host.addEventListener('change',e=>{if(/^key[0-4]$/.test(e.target.name)&&mode==='echo'){const n=e.target.name;render();host.querySelector('[name='+n+']')?.focus();return;}if(e.target.name==='catalog'&&mode==='echo'){fields.catalog=e.target.value;fields.main='';const cat=costList.find(c=>String(c.id)===String(fields.catalog));if(cat&&fields.suite&&!cat.suite?.includes?.(fields.suite))fields.suite='';render();host.querySelector('[name=catalog]')?.focus();}});
    host.addEventListener('submit',async e=>{
        e.preventDefault();if(busy)return;const form=e.target,values=new FormData(form),kind=form.dataset.action;if(!kind)return;busy=true;notice='';render();
        try{
            if(kind==='create'){const entry=roleList.find(r=>String(r.id)===values.get('catalog'));if(!entry)throw Error('INVALID_DATA');const r=CharacterCore.createRole(entry,Date.now());core.transact(expected,d=>{d.role.push(r);});formGuard?.markSaved();location.assign(roleLink(r));return;}
            if(kind==='echo'){
                const entry=costList.find(c=>String(c.id)===String(fields.catalog));if(!entry)throw Error('INVALID_ECHO');const next=echo?JSON.parse(JSON.stringify(echo)):CharacterCore.createEcho(entry,Date.now());
                Object.assign(next,{costListId:entry.id,name:echo&&String(echo.costListId)===String(entry.id)?echo.name:entry.name,type:entry.type,imgCode:entry.imgCode,mainAtrri:fields.main||null,suite:fields.suite||null});
                next.propertyList=fields.stats.filter(s=>s.key||s.value!=='').map(s=>{if(!s.key||s.value===''||!Number.isFinite(Number(s.value))||Number(s.value)<0)throw Error('INVALID_ECHO');return {property:StatKeys.keyToLegacy[s.key],value:String(Number(s.value))+(RoleCandidates.unit(s.key)==='percent'?'%':'')};});
if(new Set(next.propertyList.map(s=>s.property)).size!==next.propertyList.length||fields.stats.some(s=>s.key&&s.value!==''&&!(fctValue[rollTypes[s.key]]?.values||[]).some(v=>parseFloat(v)===Number(s.value))&&!echo?.propertyList?.some(v=>StatKeys.fromLegacy(v.property)===s.key&&parseFloat(v.value)===Number(s.value))))throw Error('INVALID_ECHO');
                const pos=echo?record?.costList.findIndex(e=>e&&String(e.costId)===echoId)+1:(/^[1-5]$/.test(params.get('selectedPosition')||'')?Number(params.get('selectedPosition')):(record?.configurations?MultiConfig.active(record).slots.findIndex(v=>v==null):(record?.costList.length||0))+1);
                core.transact(expected,d=>core.saveEcho(d,roleId,echoId,next,pos));formGuard?.markSaved();location.assign(savedDestination(record,pos,next.costId));return;
            }
        }catch(error){notice=error.importFailure?error:['SOURCE_CHANGED','INVALID_DATA','INVALID_ECHO','READ_ONLY','IDENTITY','COST_LIMIT','INVALID_UID','TOKEN_REQUIRED','IMPORT_FAILED'].includes(error.message)?error.message:'SAVE_FAILED';}
        finally{busy=false;render();}
    });
    host.addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(!b)return;if(confirm(i18n.t('workspace.confirmDelete')+(window.MultiConfigUI?.impact(b.dataset.remove,true)||''))){try{core.transact(expected,d=>{core.removeEcho(d,null,b.dataset.remove);});reset();libraryState.selected=null;libraryState.detailOpen=false;notice='deleted';rememberLibrary();}catch(_){notice='SOURCE_CHANGED';}render();}});
    host.addEventListener('change',async e=>{const kind=e.target.dataset.restoreFile;if(!kind||!e.target.files?.length)return;try{const value=await e.target.files[0].text();backupText[kind]=value;host.querySelector('[data-json="'+kind+'"]').value=value;host.querySelector('[data-restore="'+kind+'"]').click();}catch(_){host.querySelector('[data-status="'+kind+'"]').textContent=i18n.t('dock.backupError');}finally{e.target.value='';}});
    function fullBackupDownload(value){const blob=new Blob([value],{type:'application/json'}),link=document.createElement('a'),href=URL.createObjectURL(blob);link.href=href;link.download='wuwa-register-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(href),60000);}
    let fullBackupBusy=false,conveneBackupStore=null;
    host.addEventListener('click',async e=>{
        const exportButton=e.target.closest('[data-full-backup-export]'),restoreButton=e.target.closest('[data-full-backup-restore]');
        if(!exportButton&&!restoreButton||fullBackupBusy||restoreButton?.disabled)return;
        fullBackupBusy=true;
        try{conveneBackupStore=conveneBackupStore||ConveneStore.create();
            if(exportButton){const value=JSON.stringify(await RegisterBackup.exportComplete({storage:localStorage,coreData:core.load()},conveneBackupStore),null,2);fullBackupPending=value;backupPreview(RegisterBackup.inspect(value,{validateCore:CharacterCore.validate}).summary,value);host.querySelector('[data-full-backup-restore]').disabled=true;fullBackupDownload(value);host.querySelector('[data-full-backup-status]').textContent=i18n.t('secondary.fullBackupReady');}
            else {if(!confirm(i18n.t('secondary.fullBackupConfirm')))return;const result=await RegisterBackup.restoreComplete(fullBackupPending,{storage:localStorage,validateCore:CharacterCore.validate},conveneBackupStore);if(!result.ok)throw Error();reset();historyReady=false;fullBackupPending=null;render();host.querySelector('[data-full-backup-preview]').innerHTML='<nav class="rw-restore-links"><a href="index.html?view=register">'+tr('nav.characters')+'</a><a href="'+url('library')+'">'+tr('nav.echoLibrary')+'</a><a href="convene.html?view=register">'+tr('nav.convene')+'</a></nav>';host.querySelector('[data-full-backup-status]')?.replaceChildren(document.createTextNode(i18n.t('secondary.fullBackupRestored')));}
        }catch(_){host.querySelector('[data-full-backup-status]')?.replaceChildren(document.createTextNode(i18n.t('secondary.fullBackupError')));}
        finally{fullBackupBusy=false;}
    });
    host.addEventListener('change',async e=>{if(!e.target.matches('[data-full-backup-file]')||!e.target.files?.length)return;try{const value=await e.target.files[0].text(),checked=RegisterBackup.inspect(value,{validateCore:CharacterCore.validate}),status=host.querySelector('[data-full-backup-status]');if(!checked.ok){fullBackupPending=null;host.querySelector('[data-full-backup-preview]').textContent='';host.querySelector('[data-full-backup-restore]').disabled=true;status.textContent=i18n.t('secondary.fullBackupInvalid');return;}fullBackupPending=value;backupPreview(checked.summary,value);host.querySelector('[data-full-backup-restore]').disabled=false;status.textContent=i18n.t('secondary.fullBackupValidated');}catch(_){host.querySelector('[data-full-backup-status]').textContent=i18n.t('secondary.fullBackupInvalid');}finally{e.target.value='';}});
    host.addEventListener('click',e=>{const button=e.target.closest('[data-download]');if(!button)return;const kind=button.dataset.download;backupText[kind]='';host.querySelector('[data-export="'+kind+'"]').click();const value=backupText[kind];if(!value)return;const blob=new Blob([value],{type:'application/json'}),link=document.createElement('a'),href=URL.createObjectURL(blob);link.href=href;link.download='wuwa-'+kind+'-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(href),60000);host.querySelector('[data-status="'+kind+'"]').textContent=i18n.t('secondary.ready');});
    host.addEventListener('click',e=>{
        const button=e.target.closest('[data-export],[data-restore]');if(!button)return;
        const kind=button.dataset.export||button.dataset.restore,input=host.querySelector('[data-json="'+kind+'"]'),status=host.querySelector('[data-status="'+kind+'"]');
        try{
            const service=kind==='drafts'?RoleDraftStorage.create(localStorage):kind==='adoptions'?RoleLocalConfiguration.create(localStorage):null;
            if(button.hasAttribute('data-export')){const result=service?service.exportData():{ok:true,json:JSON.stringify(core.load())};if(!result.ok)throw Error();input.value=result.json;backupText[kind]=result.json;status.textContent=i18n.t('dock.exported');}
            else if(confirm(i18n.t('workspace.confirmRestore'))){
                if(service){const loaded=service.load();if(!loaded.ok||!service.restore(input.value,loaded.data.revision).ok)throw Error();}
                else {CharacterCore.restoreData({json:input.value,expectedRaw:sourceRaw,readRaw:()=>localStorage.getItem('mcData'),write:saveDataToCache});reset();}
                render();host.querySelector('[data-status="'+kind+'"]').textContent=i18n.t('dock.restored');
            }
        }catch(_){status.textContent=i18n.t('dock.backupError');}
    });
    host.addEventListener('click',e=>{
        const button=e.target.closest('[data-equip],[data-unequip],[data-delete-equipped]');if(!button)return;
        if(!confirm(i18n.t('workspace.confirmCoreChange')+(button.hasAttribute('data-delete-equipped')?window.MultiConfigUI?.impact(echoId,true)||'':'')))return;
        try{if(button.hasAttribute('data-equip')){const target=host.querySelector('[data-equip-target="'+CSS.escape(button.dataset.equip)+'"]').value;let position;core.transact(expected,d=>position=core.equip(d,target,button.dataset.equip,libraryState.equipPosition?Number(libraryState.equipPosition):undefined));location.assign(roleLink(data.role.find(r=>String(r.roleId)===target),position,button.dataset.equip));}
            else {core.transact(expected,d=>core.removeEcho(d,roleId,echoId,button.hasAttribute('data-unequip')));location.assign(roleLink(record));}
        }catch(error){notice=['IDENTITY','SOURCE_CHANGED','READ_ONLY','COST_LIMIT','INVALID_ECHO'].includes(error.message)?error.message:'SAVE_FAILED';render();}
    });
    let historyTicket=0;
    async function refreshHistory(){
        if(mode!=='compare')return;const ticket=++historyTicket;
        try{const loaded=RoleDraftStorage.create(localStorage).load();if(!loaded.ok)throw Error();
        const source=JSON.stringify(core.load()),snapshot=JSON.parse(source),roles=new Map(snapshot.role.map(r=>[String(r.roleId),r])),currentByRole=new Map();
            // 同一角色的多个方案共用摘要与模型；并发刷新只接受最后一次结果。
            const storageRevision=[RoleDraftStorage.KEY,RoleLocalConfiguration.KEY].map(key=>localStorage.getItem(key));
            const rows=await Promise.all(loaded.data.drafts.map(async draft=>{
                const baseline=loaded.data.baselines.find(b=>b.id===draft.baseline.id),record=roles.get(baseline.role.identity);
                let validity='incompatible',current=null;
                if(record){if(!currentByRole.has(record))currentByRole.set(record,(async()=>{const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(RoleDraftModel.canonical(RoleDraftModel.source(record)))),revision=Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');return RoleDraftModel.createBaseline(normalize(record),{id:'history-current',createdAt:Date.now(),sourceRevision:revision,modelVersion:'legacy-scoring-2026-10-08'});})());current=await currentByRole.get(record);validity=RoleDraftModel.assess(baseline,draft,current,Date.now()).status;}
                let delta=null;
                if(validity==='valid'&&record){const result=RoleCompare.evaluate({baseline,draft,current,role:record,normalize});delta=result.rows.find(r=>r.key==='score')?.delta??null;}
                if(validity==='valid'&&record&&RoleCandidates.createAdapter(normalize).assessSource(draft,MultiConfig.entities(snapshot),record).status!=='valid'){validity='stale';delta=null;}
                return {baseline,draft,record,validity,delta,adopted:validity==='valid'&&!!RoleLocalConfiguration.create(localStorage).find(baseline,draft)};
            }));
            if(ticket!==historyTicket)return;if(JSON.stringify(core.load())!==source||[RoleDraftStorage.KEY,RoleLocalConfiguration.KEY].some((key,i)=>localStorage.getItem(key)!==storageRevision[i])){refreshHistory();return;}historyRows=rows;historyReady=true;
        }catch(_){if(ticket!==historyTicket)return;notice='INVALID_DATA';historyRows=[];historyReady=true;}render();
    }
    host.addEventListener('click',e=>{const button=e.target.closest('[data-delete-draft],[data-prune]');if(!button||!confirm(i18n.t('workspace.confirmHistory')))return;const service=RoleHistory.create(localStorage),result=button.hasAttribute('data-prune')?service.prune():service.remove(button.dataset.deleteDraft);notice=result.ok?'historyUpdated':'SAVE_FAILED';refreshHistory();});
    host.addEventListener('input',e=>{if(e.target.dataset.historyFilter){historyState[e.target.dataset.historyFilter]=e.target.value;navigation.save('history',{search:historyState.search,status:historyState.status,scroll:scrollY});render();}if(e.target.dataset.historyName){const id=e.target.dataset.historyName;if(!Object.hasOwn(nameExpectations,id))nameExpectations[id]=RegisterMetadata.create(localStorage).load().raw;historyState.names[id]=e.target.value;}});
    host.addEventListener('change',e=>{if(e.target.dataset.historyFilter){historyState[e.target.dataset.historyFilter]=e.target.value;navigation.save('history',{search:historyState.search,status:historyState.status,scroll:scrollY});render();}});
    host.addEventListener('click',e=>{if(e.target.closest('[data-library-reset]')){Object.assign(libraryState,{search:'',cost:'',suite:'',main:'',completeness:'',favorite:false,sort:'recent',contextRole:''});rememberLibrary();render();}if(e.target.closest('[data-history-reset]')){historyState.search='';historyState.status='all';render();}if(e.target.closest('a')){if(mode==='library')rememberLibrary();if(mode==='compare')navigation.save('history',{search:historyState.search,status:historyState.status,scroll:scrollY});}});
    host.addEventListener('submit',e=>{const id=e.target.dataset.historyRename;if(!id)return;e.preventDefault();const drafts=RoleDraftStorage.create(localStorage).load();if(!drafts.ok||!drafts.data.drafts.some(d=>d.id===id)){e.target.querySelector('[role=status]').textContent=i18n.t('workspace.SOURCE_CHANGED');return;}const meta=RegisterMetadata.create(localStorage),loaded=meta.load(),result=meta.rename('drafts',id,historyState.names[id]??e.target.querySelector('input').value,Object.hasOwn(nameExpectations,id)?nameExpectations[id]:loaded.raw);e.target.querySelector('[role=status]').textContent=i18n.t(result.ok?'ops.renamed':'workspace.'+(result.code==='SOURCE_CHANGED'?'SOURCE_CHANGED':'SAVE_FAILED'));nameExpectations[id]=meta.load().raw;if(result.ok)delete historyState.names[id];});
    if(mode==='compare')RegisterUnsaved.create({scope:'history-names',get:()=>historyState.names,apply:value=>historyState.names=value,revision:expected,i18n}).recover();
    window.addEventListener('pagehide',()=>{if(mode==='library')rememberLibrary();if(mode==='compare')navigation.save('history',{search:historyState.search,status:historyState.status,scroll:scrollY});});
    window.addEventListener('pageshow',()=>{const saved=mode==='library'?librarySaved:mode==='compare'?historySaved:null;if(saved?.scroll)setTimeout(()=>scrollTo(0,saved.scroll),160);});
    refreshHistory();
    function refreshWorkspace(force=false){
        if(!['library','compare','echo','create'].includes(mode))return;
        // 原生文件选择器返回时先触发 focus；不能替换仍在等待 change 的上传节点。
        // OCR 会话保留自己的来源快照，保存时仍由 Core 检查冲突。
        if(mode==='library'&&showScreenshots)return;
        try{
            let changed=false;
            if(localStorage.getItem('mcData')!==sourceRaw){
                changed=true;
                if(mode==='echo'||mode==='create'){notice='SOURCE_CHANGED';render();return;}
                const previous=data;reset();
                if(mode==='library'){
                    if(libraryState.selected&&!MultiConfig.entities(data).some(e=>String(e.costId)===libraryState.selected)){libraryState.selected=null;libraryState.detailOpen=false;notice='SOURCE_CHANGED';}
                    for(const key of ['contextRole','compareRole','equipRole'])if(libraryState[key]&&!data.role.some(r=>String(r.roleId)===libraryState[key])){libraryState[key]='';libraryState.position='';notice='SOURCE_CHANGED';}
                    const before=previous.role.find(r=>String(r.roleId)===libraryState.compareRole)?.costList[Number(libraryState.position)-1],after=data.role.find(r=>String(r.roleId)===libraryState.compareRole)?.costList[Number(libraryState.position)-1];
                    if(libraryState.position&&String(before?.costId)!==String(after?.costId)){libraryState.position='';notice='SOURCE_CHANGED';}
                    if(!libraryState.contextRole&&libraryState.sort==='contribution')libraryState.sort='recent';rememberLibrary();
                }
            }
            if(mode==='compare')refreshHistory();else if(changed||force===true)render();
        }catch(_){notice='INVALID_DATA';if(mode==='library'){data={role:[],unusedEchoes:[]};libraryState.selected=null;libraryState.detailOpen=false;}render();}
    }
    window.addEventListener('pageshow',refreshWorkspace);
    window.addEventListener('focus',refreshWorkspace);
    window.addEventListener('storage',e=>{if(e.key===null||['mcData',RoleDraftStorage.KEY,RoleLocalConfiguration.KEY,RegisterMetadata.KEY,ECHO_META_KEY].includes(e.key))refreshWorkspace(true);});
    window.addEventListener('wuwa-core-updated',refreshWorkspace);
    window.addEventListener('wuwa-locale',e=>i18n.setLocale(e.detail));i18n.subscribe(render);if(params.get('embedded')==='1'){document.documentElement.classList.add('rw-embedded');}render();
    if(params.get('inventory')==='1')openInventory();
});
