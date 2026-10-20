(function(root){
'use strict';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset=x=>typeof x==='string'&&/^(?:image\/|https?:\/\/)/.test(x)?esc(x):'';
function mount({host,i18n,core,service,normalize,catalog,mapRole,record,params,roleLink,back}){
    const t=(k,p)=>esc(i18n.t('official.'+k,p)),tr=(k,p)=>esc(i18n.t(k,p));
    let initial;
    try{initial=core.load();}catch(_){host.innerHTML='<h1>'+t('title')+'</h1><p role="alert">'+tr('workspace.INVALID_DATA')+'</p><a href="register-workspace.html?view=register&mode=backup&lang='+esc(i18n.locale)+'">'+tr('workspace.backup')+'</a>';return null;}
    let uid=String(initial.tzmId||''),token=localStorage.getItem('kjq_token')||'',visible=false,openRows=new Set(),guideOpen=false;
    let savedToken=token,model;
    const roleName=r=>r.entry?esc(i18n.entity('characters',r.entry.id,r.entry.name)):esc(r.info.roleName||i18n.t('register.characterId',{id:r.info.roleId??'—'}));
    function failure(error){if(!error)return '';if(error.message==='ACCOUNT_MISMATCH')return t('accountMismatch');if(error.message==='CANCELLED')return t('cancelledHelp');if(error.message==='IDENTITY')return t('identityHelp');if(error.message==='SOURCE_CHANGED')return t('localChanged');return esc(ImportService.formatError(error,(k,p)=>i18n.t(k,p)));}
    function summary(c){return ['add','update','skip','failed'].map(k=>'<span>'+(initial.loadoutVersion===2&&k==='update'?tr('mc.overwrite'):initial.loadoutVersion===2&&k==='skip'?tr('mc.keep'):t(k))+' <b>'+c[k]+'</b></span>').join('');}
    function rowStatus(r){return !r.known?'unknown':r.status==='idle'?(r.action==='resolve'?'uncertain':r.action==='update'||initial.loadoutVersion===2&&r.candidates.length?'existing':'new'):r.status;}
    function stat(s){if(!s)return '—';return (s.key?tr('stats.'+s.key):tr('register.unknownStat'))+' '+esc(s.value==null?'—':s.unit==='percent'?i18n.format.percentage(s.value):i18n.format.decimal(s.value));}
    function changes(r){
        if(!r.original)return '';
        const old=r.original,next=r.commit,rows=[];
        for(const key of ['level','ming'])if(old[key]!==next[key])rows.push(t(key)+': '+esc(old[key]??'—')+' → '+esc(next[key]??'—'));
        const weapon=x=>[x.weaponGameId,x.weaponImg,x.weaponName,x.weaponlevel,x.weaponReson];
        if(JSON.stringify(weapon(old))!==JSON.stringify(weapon(next)))rows.push(t('weaponChanged'));
        const echoes=x=>x.costList.map(e=>e&&({type:e.type,name:e.name,main:e.mainAtrri,stats:e.propertyList,suite:e.suite}));
        if(JSON.stringify(echoes(old))!==JSON.stringify(echoes(next)))rows.push(t('echoChanged'));
        const a=r.previous,b=r.view;
        if(a?.summary.status==='complete'&&b.summary.status==='complete'&&JSON.stringify(a.model)===JSON.stringify(b.model))rows.push(t('scoreDelta')+': '+esc(i18n.format.score(b.summary.score-a.summary.score)));
        else rows.push(t('deltaUnavailable'));
        return '<div class="ri-changes"><h3>'+t('changes')+'</h3><ul>'+rows.map(x=>'<li>'+x+'</li>').join('')+'</ul><p>'+t('draftWarning')+'</p></div>';
    }
    function preview(r){
        const v=r.view,p=r.commit;if(!v||!p)return '';
        return '<div class="ri-detail"><p>'+t('level')+' '+esc(p.level??'—')+' · '+t('ming')+' '+esc(p.ming??'—')+'</p><div class="ri-metrics"><span>'+tr('summary.score')+'<strong>'+esc(i18n.format.score(v.summary.score))+'</strong></span><span>'+tr('state.'+v.summary.status)+'<small>'+t('scoreScope')+'</small></span></div>'+
            (v.summary.status!=='complete'?'<ul class="ri-issues">'+v.issues.map(issue=>'<li>'+tr('issues.'+issue.code,issue.params)+'</li>').join('')+'</ul>':'')+
            '<h3>'+t('weapon')+'</h3>'+(p.weaponImg||p.weaponName||p.weaponlevel!=null||p.weaponStar!=null?'<p>'+(p.weaponImg?'<img class="ri-weapon" src="'+asset(p.weaponImg)+'" alt="">':'')+esc(p.weaponName||i18n.t('official.providedWeapon'))+' · '+t('level')+' '+esc(p.weaponlevel??'—')+' · '+t('resonance')+' '+esc(p.weaponReson??'—')+' · '+t('rarity')+' '+esc(p.weaponStar??'—')+'</p>':'<p>'+t('notProvided')+'</p>')+
            '<h3>'+t('skills')+'</h3>'+(p.skillList?.length?'<ul>'+p.skillList.map(s=>'<li>'+esc(s.name||i18n.t('official.skill'))+' · '+t('level')+' '+esc(s.level??'—')+'</li>').join('')+'</ul>':'<p>'+t('notProvided')+'</p>')+
            '<h3>'+tr('loadout.title')+'</h3><div class="ri-slots">'+v.slots.map(s=>'<section><h4>'+tr('loadout.slot',{position:s.position})+'</h4>'+(s.echo?'<p>'+esc(s.echo.legacy?.name||i18n.entity('echoes',s.echo.catalogId,''))+'</p><p>'+stat(s.echo.mainStat)+'</p><ul>'+s.echo.substats.map(x=>'<li>'+stat(x)+'</li>').join('')+'</ul><small>'+tr('state.'+(s.status==='complete'?'complete':'incomplete'))+'</small>':'<p>'+tr('loadout.empty')+'</p>')+'</section>').join('')+'</div>'+changes(r)+'</div>';
    }
    function decisions(r,disabled){
        if(initial.loadoutVersion===2){
            if(!r.candidates.length)return '<p>'+t('new')+'</p>';
            return '<label class="ri-decision">'+tr('mc.existing',{count:r.candidates.reduce((n,c)=>n+(c.configurations?.length||1),0)})+'<select data-ri-decision="'+r.key+'"'+disabled+'><option value="skip"'+(r.action==='skip'?' selected':'')+'>'+tr('mc.keep')+'</option>'+r.candidates.map(c=>'<option value="update:'+esc(c.roleId)+'"'+(r.action==='update'&&r.target===String(c.roleId)?' selected':'')+'>'+tr('mc.overwrite')+(r.candidates.length>1?' · #'+esc(c.roleId):'')+'</option>').join('')+'</select></label>'+(r.action==='update'?'<p class="ri-reset-warning">'+tr('mc.overwriteWarning')+'</p>':'');
        }
        const selected=r.action==='update'?'update:'+r.target:r.action;
        const existing=r.candidates.some(c=>RegisterImportModel.sameSource(c.importSource,r.source));
        return '<label class="ri-decision">'+t('saveAs')+'<select data-ri-decision="'+r.key+'"'+disabled+'><option value="resolve"'+(selected==='resolve'?' selected':'')+' disabled>'+t('resolve')+'</option>'+['add','skip'].map(k=>'<option value="'+k+'"'+(selected===k?' selected':'')+(k==='add'&&existing?' disabled':'')+'>'+t(k)+'</option>').join('')+r.candidates.map(c=>'<option value="update:'+esc(c.roleId)+'"'+(selected==='update:'+c.roleId?' selected':'')+'>'+t('update')+' · #'+esc(c.roleId)+' · '+t('level')+' '+esc(c.level??'—')+(c.importSource?'':' · '+t('legacyIdentity'))+'</option>').join('')+'</select></label>';
    }
    function rows(){
        const s=model.snapshot(),disabled=s.busy||s.phase==='result'?' disabled':'';
        const visible=model.visible(),pages=Math.max(1,Math.ceil(visible.length/6));s.page=Math.min(s.page,pages-1);
        return visible.slice(s.page*6,s.page*6+6).map(r=>{
            const p=r.entry?asset(CharacterPortraits.resolve(r.entry)):'';
            return '<article class="ri-row" data-ri-row="'+r.key+'"><div class="ri-row-heading"><label class="ri-select"><input type="checkbox" data-ri-select="'+r.key+'"'+(s.selected.has(r.key)?' checked':'')+(!r.known?' disabled':disabled)+'>'+(p?'<img src="'+p+'" alt="">':'<span class="ri-no-image" aria-hidden="true">?</span>')+'<span><strong>'+roleName(r)+'</strong><small>'+t(rowStatus(r))+(r.info.level!=null?' · '+t('level')+' '+esc(r.info.level):'')+'</small></span></label></div>'+(!r.known?'<p>'+t('unknownHelp')+'</p>':s.selected.has(r.key)&&s.phase!=='result'?decisions(r,disabled):'')+(r.error?'<p role="alert">'+failure(r.error)+'</p>':'')+(r.preview?'<details data-ri-details="'+r.key+'"'+(openRows.has(r.key)?' open':'')+'><summary>'+t('inspect')+'</summary>'+preview(r)+'</details>':'')+(r.savedId?'<a href="'+esc(roleLink({...r.commit,roleId:r.savedId}))+'">'+t('analyze')+' ↗</a>':'')+'</article>';
        }).join('')+(pages>1?'<nav class="ri-pagination"><button data-ri-action="previous"'+(s.page===0?' disabled':'')+'>'+tr('mc.previous')+'</button><span>'+tr('mc.page',{page:s.page+1,pages})+'</span><button data-ri-action="next"'+(s.page===pages-1?' disabled':'')+'>'+tr('mc.next')+'</button></nav>':'')||'<p>'+t(s.rows.length?'noMatch':'empty')+'</p>';
    }
    function draw(){
        if(!model)return;const s=model.snapshot(),c=model.counts();
        const previousLive=host.querySelector('#ri-live');
        const active=document.activeElement,focusId=host.contains(active)?active.id:'',selection=active?.selectionStart!=null?[active.selectionStart,active.selectionEnd]:null;
        const actionFocus=host.contains(active)?['riSelect','riDecision','riAction'].map(k=>active.dataset[k]?{k,v:active.dataset[k]}:null).find(Boolean):null;
        const step=s.phase==='connect'?0:s.phase==='select'?1:s.phase==='result'?4:s.operation==='read'?2:3;
        document.title=i18n.t('official.title');host.classList.add('ri-workbench');
        host.innerHTML='<header class="ri-header"><a href="'+esc(back())+'">← '+t('back')+'</a><p class="ri-eyebrow">'+t('scope')+'</p><h1>'+t('title')+'</h1><p>'+t('purpose')+'</p><ol class="ri-progress" aria-label="'+t('progress')+'">'+['connect','select','read','confirm','result','analyze'].map((k,i)=>'<li'+(i===step?' aria-current="step"':'')+'><span>'+(i+1)+'</span>'+t('step.'+k)+'</li>').join('')+'</ol></header><div class="ri-layout"><div class="ri-main">'+
            '<section class="ri-connect"><h2>'+t('step.connect')+'</h2><p>'+t('credentialsHelp')+'</p><form data-ri-connect novalidate><label for="ri-uid">'+tr('workspace.uid')+'</label><input id="ri-uid" name="uid" inputmode="numeric" autocomplete="off" pattern="[0-9]{9}" value="'+esc(uid)+'" required><div class="rw-token-heading"><label for="ri-token">'+tr('workspace.token')+'</label><a href="https://www.bilibili.com/video/BV1hpWLe2EHS/" target="_blank" rel="noopener noreferrer">'+tr('workspace.tokenGuide')+'</a></div><div class="rw-token-field"><input id="ri-token" name="token" type="'+(visible?'text':'password')+'" autocomplete="off" spellcheck="false" required><button type="button" data-ri-action="toggle" aria-pressed="'+visible+'" aria-controls="ri-token">'+tr('workspace.'+(visible?'hideToken':'showToken'))+'</button></div><p id="ri-credential-state" role="status">'+t('credential.'+(s.phase==='connect'?s.credential:'usable'))+'</p><div class="ri-buttons"><button class="rw-primary"'+(s.busy?' disabled':'')+'>'+t('verify')+'</button><button type="button" data-ri-action="clear"'+(s.busy?' disabled':'')+'>'+t('clearCredentials')+'</button></div></form></section>'+
            (s.phase!=='connect'?'<section class="ri-roster"><h2>'+tr('mc.batchTitle')+'</h2>'+(s.phase==='result'?'<div class="ri-result-summary">'+summary(s.result)+'</div><p>'+t('savedHelp')+'</p>':'')+'<label for="ri-search">'+t('search')+'</label><input id="ri-search" type="search" value="'+esc(s.search)+'"><div class="ri-buttons"><button data-ri-action="all"'+(s.busy||s.phase==='result'?' disabled':'')+'>'+t('selectAll')+'</button><button data-ri-action="none"'+(s.busy||s.phase==='result'?' disabled':'')+'>'+t('clearSelection')+'</button></div>'+(initial.loadoutVersion===2&&s.phase==='select'?'<div class="ri-batch-actions"><button data-ri-action="keep-all">'+tr('mc.keepAll')+'</button><button data-ri-action="overwrite-all">'+tr('mc.overwriteAll')+'</button></div><p>'+tr('mc.keepHelp')+'</p>':'')+'<p>'+t('allScope')+'</p><div id="ri-rows">'+rows()+'</div></section>':'')+
            '</div><aside class="ri-aside"><h2>'+t('queue')+'</h2><p class="ri-selected">'+t('selected',{count:s.selected.size})+'</p><div class="ri-counts">'+summary(c)+'</div><p id="ri-live" role="status" aria-live="polite" aria-atomic="true">'+(s.total?t('completed',{done:s.completed,total:s.total})+(s.current?' · '+roleName(s.rows.find(r=>r.key===s.current)):''):'')+'</p><p id="ri-error" role="alert">'+failure(s.error)+'</p>'+(c.resolve?'<p>'+t('resolveHelp',{count:c.resolve})+'</p>':'')+'<div class="ri-primary-actions">'+
            (s.phase==='connect'&&s.busy?'<button data-ri-action="cancel">'+t('cancel')+'</button>':'')+
            (s.phase==='select'?'<button class="rw-primary" data-ri-action="read"'+(!s.selected.size||s.busy?' disabled':'')+'>'+t('readSelected')+'</button>':'')+
            (s.phase==='preview'?s.operation==='save'?'<button class="rw-primary" disabled>'+t('saving')+'</button>':s.busy?'<button data-ri-action="cancel">'+t('cancel')+'</button>':(initial.loadoutVersion===2&&c.update?'<p class="ri-reset-warning">'+tr('mc.overwriteWarning')+'</p><label><input type="checkbox" data-ri-overwrite-ack'+(s.overwriteAcknowledged?' checked':'')+'>'+tr('mc.ack')+'</label>':'')+'<button class="rw-primary" data-ri-action="save"'+(c.resolve||initial.loadoutVersion===2?(c.resolve||c.failed||c.update&&!s.overwriteAcknowledged?' disabled':''):!c.add&&!c.update?' disabled':'')+'>'+t('confirmImport')+'</button><button data-ri-action="review">'+t('editSelection')+'</button>':'')+
            (c.failed&&!s.busy?'<button data-ri-action="retry">'+t('retry')+'</button>':'')+
            (s.phase==='result'&&record?'<a class="ri-primary-link" href="'+esc(back())+'">'+t('backOriginal')+'</a>':'')+
            '<a href="index.html?view=register&lang='+esc(i18n.locale)+'">'+t('overview')+'</a></div><details data-ri-guide'+(guideOpen?' open':'')+'><summary>'+t('guide')+'</summary><p>'+t('guideText')+'</p><p>'+t('identityHelp')+'</p><p>'+t('draftWarning')+'</p></details></aside></div>';
        if(s.phase!=='connect'&&s.phase!=='result'&&s.selected.size){
            const action=s.phase==='select'?'read':s.busy?'cancel':c.update&&!s.overwriteAcknowledged?'impact':'save';
            host.insertAdjacentHTML('beforeend','<section class="ri-mobile-summary" aria-label="'+tr('mc.batchTitle')+'"><div>'+['add','skip','update'].map(k=>'<span>'+(k==='add'?t('add'):tr(k==='skip'?'mc.keep':'mc.overwrite'))+' <b>'+c[k]+'</b></span>').join('')+'</div><button type="button" data-ri-mobile="'+action+'"'+(action==='save'&&(c.failed||c.resolve)?' disabled':'')+'>'+(action==='impact'?tr('mc.reviewImpact'):t(action==='read'?'readSelected':action==='cancel'?'cancel':'confirmImport'))+'</button></section>');
        }
        host.querySelector('#ri-token').value=token;
        globalThis.RegisterSearchUI?.enhance(host,i18n,{importTotal:s.rows.length});
        if(previousLive){const next=host.querySelector('#ri-live'),text=next.textContent;next.replaceWith(previousLive);if(previousLive.textContent!==text)previousLive.textContent=text;}
        if(focusId){const input=document.getElementById(focusId);input?.focus({preventScroll:true});if(selection&&['text','search','password'].includes(input?.type))input.setSelectionRange(...selection);}
        else if(actionFocus)host.querySelector('[data-'+actionFocus.k.replace(/[A-Z]/g,x=>'-'+x.toLowerCase())+'="'+CSS.escape(actionFocus.v)+'"]')?.focus({preventScroll:true});
    }
    model=RegisterImportModel.create({service,core,catalog,mapRole,normalize,storage:localStorage,searchName:entry=>Object.values(EchoDictionaries).map(messages=>messages['characters.'+entry.id]||entry.name).join(' '),onChange:draw,lock:fn=>navigator.locks?navigator.locks.request('wuwa-mcData',fn):fn()});
    model.snapshot().credential=token?'saved':'empty';
    // Inputs and their cursor remain mounted during typing; search only replaces the result list.
    host.addEventListener('input',event=>{
        if(event.target.id==='ri-search'){model.snapshot().search=event.target.value;model.snapshot().page=0;host.querySelector('#ri-rows').innerHTML=rows();globalThis.RegisterSearchUI?.enhance(host,i18n,{importTotal:model.snapshot().rows.length});}
        if(['ri-uid','ri-token'].includes(event.target.id)){
            const id=event.target.id,value=event.target.value;
            if(id==='ri-uid')uid=value;else token=value;
            if(model.snapshot().phase!=='connect'||model.snapshot().busy)model.invalidate();
            const status=token?'modified':'empty';model.snapshot().credential=status;
            host.querySelector('#ri-credential-state').textContent=i18n.t('official.credential.'+status);
        }
    });
    host.addEventListener('change',event=>{
        if(event.target.hasAttribute('data-ri-overwrite-ack')){model.snapshot().overwriteAcknowledged=event.target.checked;draw();}
        if(event.target.dataset.riSelect)model.select(event.target.dataset.riSelect,event.target.checked);
        if(event.target.dataset.riDecision){const value=event.target.value,index=value.indexOf(':');model.choose(event.target.dataset.riDecision,index<0?value:value.slice(0,index),index<0?null:value.slice(index+1));}
    });
    host.addEventListener('toggle',event=>{const key=event.target.dataset.riDetails;if(key!==undefined)event.target.open?openRows.add(key):openRows.delete(key);if(event.target.hasAttribute('data-ri-guide'))guideOpen=event.target.open;},true);
    host.addEventListener('submit',async event=>{if(!event.target.matches('[data-ri-connect]'))return;event.preventDefault();visible=false;const ok=await model.connect(uid,token);savedToken=localStorage.getItem('kjq_token')||'';if(ok){const key=record?.gameRoleId??record?.importSource?.gameRoleId;const rows=model.snapshot().rows.filter(r=>r.known&&String(r.info.roleId)===String(key));if(rows.length===1){model.select(rows[0].key,true);if(record?.importSource && record.importSource.accountKey!==rows[0].source.accountKey){model.snapshot().error=Error("ACCOUNT_MISMATCH");draw();}}host.querySelector('#ri-search')?.focus();}});
    host.addEventListener('click',async event=>{
        const mobile=event.target.closest('[data-ri-mobile]')?.dataset.riMobile;if(mobile){if(mobile==='impact')host.querySelector('[data-ri-overwrite-ack]')?.scrollIntoView({block:'center',behavior:'smooth'});else host.querySelector('[data-ri-action="'+mobile+'"]')?.click();return;}
        const action=event.target.closest('[data-ri-action]')?.dataset.riAction;if(!action)return;
        if(action==='previous'||action==='next'){model.snapshot().page+=action==='next'?1:-1;draw();return;}
        if(action==='keep-all'||action==='overwrite-all'){for(const row of model.snapshot().rows)if(row.known&&row.candidates.length&&model.snapshot().selected.has(row.key))model.choose(row.key,action==='keep-all'?'skip':'update',row.candidates[0].roleId);return;}
        if(action==='toggle'){visible=!visible;const input=host.querySelector('#ri-token');input.type=visible?'text':'password';event.target.closest('button').textContent=i18n.t('workspace.'+(visible?'hideToken':'showToken'));event.target.closest('button').setAttribute('aria-pressed',visible);return;}
        if(action==='clear'){token='';savedToken='';visible=false;model.clearCredentials();if(model.snapshot().error){try{token=savedToken=localStorage.getItem('kjq_token')||'';}catch(_){}draw();}return;}
        if(action==='all')model.selectAll();if(action==='none')model.clearSelection();if(action==='read')await model.read();if(action==='retry')await model.retry();if(action==='cancel')model.cancel();if(action==='review')model.review();
        if(action==='save'){const ok=await model.save();if(ok){window.dispatchEvent(new Event('wuwa-core-updated'));host.querySelector('.ri-roster h2')?.setAttribute('tabindex','-1');host.querySelector('.ri-roster h2')?.focus();}}
    });
    window.addEventListener('pagehide',()=>model.dispose());
    function keyboardViewport(){const active=document.activeElement,compact=innerWidth<700&&(window.visualViewport?.height||innerHeight)<560&&host.contains(active)&&active.matches('input,textarea');host.classList.toggle('ri-keyboard',compact);if(compact)active.scrollIntoView({block:'center',behavior:'auto'});}
    window.visualViewport?.addEventListener('resize',keyboardViewport);window.addEventListener('resize',keyboardViewport);
    host.addEventListener('focusin',()=>queueMicrotask(keyboardViewport));host.addEventListener('focusout',()=>queueMicrotask(keyboardViewport));
    window.addEventListener('wuwa-locale',event=>i18n.setLocale(event.detail));i18n.subscribe(draw);draw();
    return model;
}
root.RegisterImportWorkbench={mount};
})(typeof globalThis!=='undefined'?globalThis:this);
