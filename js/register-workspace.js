/* Register presentation 只收集输入；核心操作通过共享服务显式提交。 */
document.addEventListener('DOMContentLoaded',function(){
    'use strict';
    if(UiView.redirecting)return;
    const i18n=EchoI18n.createBrowser(window),params=new URL(location.href).searchParams;
    const mode=['create','echo','import','library','backup','compare','tools'].includes(params.get('mode'))?params.get('mode'):'library',roleId=params.get('roleid'),echoId=params.get('costid');
    const normalize=RoleViewModel.createAdapter({roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection});
    const core=CharacterCore.create({read:()=>getDataFromCache('mcData'),write:saveDataToCache,normalize});
    const importer=ImportService.create({ajax:$.ajax,host:hostName,methods:methodName,headers:completeHeaders,tokenHeaders:completeHeaders2,storage:localStorage,convert:(e,r)=>RoleImportCore.convertPhantomData(e,r,{countMainAttr2,sumCostScores})});
    const host=document.createElement('main');host.id='register-workspace';document.body.append(host);
    const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const t=(key,p)=>esc(i18n.t('workspace.'+key,p)),tr=(key,p)=>esc(i18n.t(key,p));
    const url=(m,extra={})=>'register-workspace.html?'+new URLSearchParams({view:'register',mode:m,lang:i18n.locale,...extra});
    const name=(kind,id)=>esc(i18n.entity(kind,id,(kind==='characters'?roleList:costList).find(e=>String(e.id)===String(id))?.name||i18n.t(kind==='characters'?'register.characterId':'register.echoId',{id})));
    let data,expected,record,echo,fields={},notice='',busy=false,remote=[],importUid='',pendingImport=null,historyRows=[],historyReady=false,sourceRaw=null,backupText={};
    function reset(){sourceRaw=localStorage.getItem('mcData');data=core.load();expected=JSON.stringify(data);record=data.role.find(r=>String(r.roleId)===roleId);echo=(record?record.costList:data.unusedEchoes||[]).find(e=>String(e.costId)===echoId);}
    try{reset();}catch(_){notice='INVALID_DATA';data={role:[],unusedEchoes:[]};}
    function roleLink(r,pos,id){const u=new URLSearchParams({view:'register',roleid:r.roleId,lang:i18n.locale});if(pos){u.set('selectedPosition',pos);u.set('selectedEcho',id);}return (r.isImport?'mccost-readonly.html':'mccost.html')+'?'+u;}
    function back(){if(mode==='echo'&&!record)return url('library');const pos=echo?record?.costList.findIndex(e=>String(e.costId)===echoId)+1:Number(params.get('selectedPosition'));return record?roleLink(record,pos,echo?.costId||params.get('selectedEcho')):'index.html?view=register&lang='+i18n.locale;}
    const mains={Cost1:['攻击18%','生命22.8%','防御18%'],Cost3:['攻击力30%','生命30%','防御38%','共鸣效率32%','属伤30%',...['导电','衍射','湮灭','气动','热熔','冷凝'].map(x=>x+'伤害30%')],Cost4:['暴击22%','暴伤44%','攻击力33%','生命33%','防御41.8%','治疗26.4%']};
    function mainLabel(raw,type){const dummy={roleId:1,roleListId:1,costList:[{type,mainAtrri:raw,propertyList:[]}]};const stat=normalize(dummy).slots[0].echo.mainStat;return tr('stats.'+stat.key)+' '+esc(i18n.format.percentage(stat.value));}
    function initFields(){
        fields={catalog:echo?.costListId||costList[0].id,main:typeof echo?.mainAtrri==='string'?echo.mainAtrri:'',suite:echo?.suite||'',stats:Array.from({length:5},(_,i)=>({key:StatKeys.fromLegacy(echo?.propertyList?.[i]?.property)||'',value:echo?.propertyList?.[i]?.value==null?'':String(echo.propertyList[i].value).replace('%','')}))};
    }
    initFields();
    const catalogSelect=(kind,value)=>`<select name="catalog">${(kind==='characters'?roleList:costList).map(e=>`<option value="${esc(e.id)}"${String(e.id)===String(value)?' selected':''}>${name(kind,e.id)}${kind==='echoes'?' · '+esc(e.type):''}</option>`).join('')}</select>`;
    const action=label=>`<div class="rw-actions"><button class="rw-primary" type="submit"${busy?' disabled':''}>${t(label)}</button><a href="${back()}">${t('cancel')}</a></div>`;
    function echoForm(){
        if(roleId&&!record||echoId&&!echo)return '<p>'+t('SOURCE_CHANGED')+'</p>';
        if(record?.isImport||echo&&typeof echo.mainAtrri==='object'&&echo.mainAtrri!==null)return '<p>'+t('READ_ONLY')+'</p>';
        const cat=costList.find(e=>String(e.id)===String(fields.catalog));if(!cat)return '<p>'+t('INVALID_ECHO')+'</p>';
        // 旧存档可能包含不同的小数精度，保留当前值作为可见选项，避免打开即隐式改写。
        if(fields.main&&!mains[cat.type].includes(fields.main))mains[cat.type].push(fields.main);
        return `<div class="rw-echo-preview"><img src="${esc(cat.imgCode)}" alt="${name('echoes',cat.id)}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span hidden>${t('previewUnavailable')}</span><div><strong>${name('echoes',cat.id)}</strong><p>${esc(cat.type)}</p></div></div><form data-action="echo"><label>${tr('candidate.echo')}${catalogSelect('echoes',fields.catalog)}</label><label>${tr('loadout.mainStat')}<select name="main"><option value="">${tr('candidate.unset')}</option>${mains[cat.type].map(v=>`<option value="${esc(v)}"${v===fields.main?' selected':''}>${mainLabel(v,cat.type)}</option>`).join('')}</select></label><label>${t('suite')}<select name="suite"><option value="">${tr('candidate.unset')}</option>${Object.entries(suiteAttributeMap).map(([legacy,id])=>`<option value="${esc(legacy)}"${fields.suite===legacy?' selected':''}>${esc(i18n.entity('sets',id,i18n.t('workspace.setId',{id})))}</option>`).join('')}</select></label><p>${t('incompleteAllowed')}</p>${fields.stats.map((s,i)=>`<div class="rw-stat"><label>${tr('candidate.substatIndex',{position:i+1})}<select name="key${i}"><option value="">${tr('candidate.unset')}</option>${RoleCandidates.SUB.map(k=>`<option value="${k}"${s.key===k?' selected':''}>${tr('stats.'+k)}</option>`).join('')}</select></label><label>${tr('analysis.actualValue')}<input name="value${i}" type="number" step="any" min="0" value="${esc(s.value)}"></label></div>`).join('')}${action('save')}</form>${echo&&record?`<button data-unequip>${t('unequip')}</button> <button data-delete-equipped>${t('delete')}</button>`:''}${!echo&&record?`<a href="${url('library',{roleid:record.roleId})}">${t('equipLibrary')}</a><p>${t('appendSlot',{position:record.costList.length+1})}</p>`:''}`;
    }
    function echoSummary(e){
        const slot=normalize({roleId:'library',roleListId:0,costList:[e]}).slots[0],item=slot.echo;
        if(!item)return '<p>'+tr('state.missing')+'</p>';
        const value=s=>s&&Number.isFinite(s.value)?tr('stats.'+s.key)+' '+esc(s.unit==='percent'?i18n.format.percentage(s.value):i18n.format.decimal(s.value)):'—';
        const complete=item.mainStat.status==='valid'&&item.substats.length===5&&item.substats.every(s=>s.status==='valid')&&new Set(item.substats.map(s=>s.key)).size===5;
        return '<p>'+value(item.mainStat)+'</p><p>'+item.substats.filter(s=>s.key).map(value).join(' · ')+'</p><p>'+tr('interaction.completeness',{state:i18n.t('state.'+(complete?'complete':'incomplete'))})+'</p>';
    }
    function body(){
        if(mode==='create')return `<form data-action="create"><label>${t('character')}${catalogSelect('characters',fields.catalog)}</label>${action('create')}</form>`;
        if(mode==='echo')return echoForm();
        if(mode==='import')return `<p>${t('importScope')}</p><form data-action="bind"><label>${t('token')}<input name="token" type="password" autocomplete="off" required></label><button${busy?' disabled':''}>${t('bind')}</button></form><form data-action="fetch"><label>${t('uid')}<input name="uid" inputmode="numeric" pattern="[0-9]{9}" value="${esc(importUid||data.tzmId||'')}" required></label><button${busy?' disabled':''}>${t('fetch')}</button></form>${remote.length?`<form data-action="import"><label>${t('character')}<select name="remote">${remote.map((r,i)=>`<option value="${i}">${name('characters',mappingRoleId(r.roleId,r.roleName))}</option>`).join('')}</select></label>${action('import')}</form>`:''}<a href="${back()}">${t('cancel')}</a>`;
        if(mode==='library')return `<p>${t('libraryScope')}</p><a href="${url('echo')}">${t('addEcho')}</a><ul class="rw-list">${(data.unusedEchoes||[]).map(e=>`<li><div class="rw-description"><strong>${name('echoes',e.costListId)}</strong><p>${esc(e.type)} · ${tr('interaction.instance',{id:e.costId})}</p>${echoSummary(e)}</div><a href="${url('echo',{costid:e.costId})}">${t('edit')}</a><select aria-label="${t('equipTarget')}" data-equip-target="${esc(e.costId)}">${data.role.filter(r=>!r.isImport&&r.costList.length<5).map(r=>`<option value="${esc(r.roleId)}"${String(r.roleId)===roleId?' selected':''}>${name('characters',r.roleListId)} · ${esc(r.roleId)}</option>`).join('')}</select><button data-equip="${esc(e.costId)}"${data.role.some(r=>!r.isImport&&r.costList.length<5)?'':' disabled'}>${t('equip')}</button><button data-remove="${esc(e.costId)}">${t('delete')}</button></li>`).join('')}</ul>${data.unusedEchoes?.length?'':'<p>'+t('emptyLibrary')+'</p>'}`;
        if(mode==='backup')return '<p>'+t('backupScope')+'</p>'+['core','drafts','adoptions'].map(kind=>`<section><h2>${kind==='core'?t('core'):tr('dock.'+kind)}</h2><button data-export="${kind}">${tr('dock.export')}</button><label>${tr('dock.backupJson')}<textarea rows="6" data-json="${kind}">${esc(backupText[kind]||'')}</textarea></label><button data-restore="${kind}">${tr('dock.restore')}</button><p role="status" data-status="${kind}"></p></section>`).join('');
        if(mode==='compare')return '<p>'+t('continueCompare')+'</p><a href="'+back()+'">'+tr('nav.characters')+'</a><h2>'+tr('dock.drafts')+'</h2>'+(historyReady?'<ul class="rw-list">'+historyRows.map(x=>'<li><span>'+name('characters',x.baseline.role.catalogId)+' · '+tr('loadout.slot',{position:x.draft.targetSlot})+' · '+tr('candidate.'+x.validity)+'</span>'+(x.record?'<a href="'+roleLink(x.record)+(x.validity==='valid'?'&draft='+encodeURIComponent(x.draft.id):'')+'">'+tr(x.validity==='valid'?'dock.continue':'dock.recompare')+'</a>':'')+'<button data-delete-draft="'+esc(x.draft.id)+'">'+t('delete')+'</button></li>').join('')+'</ul>':tr('compare.checking'))+'<button data-prune>'+t('prune')+'</button>';
        return '<p>'+t('toolScope')+'</p><div id="rw-tools"></div>';
    }
    function render(){document.title=i18n.t(mode==='compare'?'nav.compare':mode==='echo'&&!echoId?'workspace.addEcho':'workspace.'+mode);host.innerHTML=`<h1>${mode==='compare'?tr('nav.compare'):t(mode==='echo'&&!echoId?'addEcho':mode)}</h1><p role="alert">${notice?t(notice):''}</p>${body()}`;if(mode==='tools')RegisterTools.mount(host.querySelector('#rw-tools'),i18n);}
    host.addEventListener('input',e=>{if(e.target.dataset.json)backupText[e.target.dataset.json]=e.target.value;const n=e.target.name;if(n==='catalog')fields.catalog=e.target.value;if(n==='main')fields.main=e.target.value;if(n==='suite')fields.suite=e.target.value;for(let i=0;i<5;i++){if(n==='key'+i)fields.stats[i].key=e.target.value;if(n==='value'+i)fields.stats[i].value=e.target.value;}if(n==='uid')importUid=e.target.value;});
    host.addEventListener('change',e=>{if(e.target.name==='catalog'&&mode==='echo'){fields.catalog=e.target.value;fields.main='';render();host.querySelector('[name=catalog]')?.focus();}});
    host.addEventListener('submit',async e=>{
        e.preventDefault();if(busy)return;const form=e.target,values=new FormData(form),kind=form.dataset.action;if(!kind)return;busy=true;notice='';render();
        try{
            if(kind==='create'){const entry=roleList.find(r=>String(r.id)===values.get('catalog'));if(!entry)throw Error('INVALID_DATA');const r=CharacterCore.createRole(entry,Date.now());core.transact(expected,d=>{d.role.push(r);});location.assign(roleLink(r));return;}
            if(kind==='echo'){
                const entry=costList.find(c=>String(c.id)===String(fields.catalog));const next=echo?JSON.parse(JSON.stringify(echo)):CharacterCore.createEcho(entry,Date.now());
                Object.assign(next,{costListId:entry.id,name:entry.name,type:entry.type,imgCode:entry.imgCode,mainAtrri:fields.main||null,suite:fields.suite||null});
                next.propertyList=fields.stats.filter(s=>s.key||s.value!=='').map(s=>{if(!s.key||s.value===''||!Number.isFinite(Number(s.value))||Number(s.value)<0)throw Error('INVALID_ECHO');return {property:StatKeys.keyToLegacy[s.key],value:String(Number(s.value))+(RoleCandidates.unit(s.key)==='percent'?'%':'')};});
                const pos=echo?record?.costList.findIndex(e=>String(e.costId)===echoId)+1:(record?.costList.length||0)+1;
                core.transact(expected,d=>core.saveEcho(d,roleId,echoId,next,pos));location.assign(record?roleLink(record,pos,next.costId):url('library'));return;
            }
            if(kind==='bind'){await importer.bind(values.get('token'));notice='bound';}
            if(kind==='fetch'){importUid=values.get('uid');remote=await importer.list(importUid);notice=remote.length?'chooseImport':'emptyRemote';}
            if(kind==='import'){
                const info=remote[Number(values.get('remote'))];if(!info)throw Error('INVALID_DATA');
                const catalogId=mappingRoleId(info.roleId,info.roleName),entry=roleList.find(r=>String(r.id)===String(catalogId));if(!entry)throw Error('INVALID_DATA');
                const base=record||CharacterCore.createRole(entry,Date.now());if(record&&String(record.roleListId)!==String(catalogId))throw Error('IDENTITY');
                pendingImport=await importer.detail(importUid,{...base,isImport:true,gameRoleId:info.roleId});core.score(pendingImport);
                core.transact(expected,d=>{d.tzmId=importUid;const index=d.role.findIndex(r=>String(r.roleId)===String(pendingImport.roleId));if(index<0)d.role.push(pendingImport);else d.role[index]=pendingImport;});location.assign(roleLink(pendingImport,Number(params.get('selectedPosition')),params.get('selectedEcho')));return;
            }
        }catch(error){notice=['SOURCE_CHANGED','INVALID_DATA','INVALID_ECHO','READ_ONLY','IDENTITY','COST_LIMIT','INVALID_UID','TOKEN_REQUIRED','IMPORT_FAILED'].includes(error.message)?error.message:'SAVE_FAILED';}
        finally{busy=false;render();}
    });
    host.addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(!b)return;if(confirm(i18n.t('workspace.confirmDelete'))){try{core.transact(expected,d=>{core.removeEcho(d,null,b.dataset.remove);});reset();}catch(_){notice='SOURCE_CHANGED';}render();}});
    host.addEventListener('click',e=>{
        const button=e.target.closest('[data-export],[data-restore]');if(!button)return;
        const kind=button.dataset.export||button.dataset.restore,input=host.querySelector('[data-json="'+kind+'"]'),status=host.querySelector('[data-status="'+kind+'"]');
        try{
            const service=kind==='drafts'?RoleDraftStorage.create(localStorage):kind==='adoptions'?RoleLocalConfiguration.create(localStorage):null;
            if(button.hasAttribute('data-export')){const result=service?service.exportData():{ok:true,json:JSON.stringify(core.load())};if(!result.ok)throw Error();input.value=result.json;backupText[kind]=result.json;status.textContent=i18n.t('dock.exported');}
            else if(confirm(i18n.t('workspace.confirmRestore'))){
                if(service){const loaded=service.load();if(!loaded.ok||!service.restore(input.value,loaded.data.revision).ok)throw Error();}
                else {CharacterCore.restoreData({json:input.value,expectedRaw:sourceRaw,readRaw:()=>localStorage.getItem('mcData'),write:saveDataToCache});reset();}
                status.textContent=i18n.t('dock.restored');
            }
        }catch(_){status.textContent=i18n.t('dock.backupError');}
    });
    host.addEventListener('click',e=>{
        const button=e.target.closest('[data-equip],[data-unequip],[data-delete-equipped]');if(!button)return;
        if(!confirm(i18n.t('workspace.confirmCoreChange')))return;
        try{if(button.hasAttribute('data-equip')){const target=host.querySelector('[data-equip-target="'+CSS.escape(button.dataset.equip)+'"]').value;let position;core.transact(expected,d=>position=core.equip(d,target,button.dataset.equip));location.assign(roleLink(data.role.find(r=>String(r.roleId)===target),position,button.dataset.equip));}
            else {core.transact(expected,d=>core.removeEcho(d,roleId,echoId,button.hasAttribute('data-unequip')));location.assign(roleLink(record));}
        }catch(error){notice=['IDENTITY','SOURCE_CHANGED','READ_ONLY','COST_LIMIT','INVALID_ECHO'].includes(error.message)?error.message:'SAVE_FAILED';render();}
    });
    async function refreshHistory(){
        if(mode!=='compare')return;
        try{const loaded=RoleDraftStorage.create(localStorage).load();if(!loaded.ok)throw Error();
            const source=JSON.stringify(core.load());
            historyRows=await Promise.all(loaded.data.drafts.map(async draft=>{
                const baseline=loaded.data.baselines.find(b=>b.id===draft.baseline.id),record=JSON.parse(source).role.find(r=>String(r.roleId)===baseline.role.identity);
                let validity='incompatible';
                if(record){const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(RoleDraftModel.canonical(record)));const revision=Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');const current=RoleDraftModel.createBaseline(normalize(record),{id:'history-current',createdAt:Date.now(),sourceRevision:revision,modelVersion:'legacy-scoring-2026-10-08'});validity=RoleDraftModel.assess(baseline,draft,current,Date.now()).status;}
                return {baseline,draft,record,validity};
            }));
            if(JSON.stringify(core.load())!==source){refreshHistory();return;}historyReady=true;
        }catch(_){notice='INVALID_DATA';historyRows=[];historyReady=true;}render();
    }
    host.addEventListener('click',e=>{const button=e.target.closest('[data-delete-draft],[data-prune]');if(!button||!confirm(i18n.t('workspace.confirmHistory')))return;const service=RoleHistory.create(localStorage),result=button.hasAttribute('data-prune')?service.prune():service.remove(button.dataset.deleteDraft);notice=result.ok?'historyUpdated':'SAVE_FAILED';refreshHistory();});
    refreshHistory();
    window.addEventListener('wuwa-locale',e=>i18n.setLocale(e.detail));i18n.subscribe(render);render();
});
