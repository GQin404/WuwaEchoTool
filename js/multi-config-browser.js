/* 使用既有工作台、详情与对话框；所有写入均经过共享核心快照事务。 */
(function(){
'use strict';if(window.UiView?.state.effective!=='register')return;
let bootError=null;
try{
 CharacterCore.initialize(localStorage,RegisterMetadata.create(localStorage));
 let cid=new URL(location.href).searchParams.get('configuration');const rid=new URL(location.href).searchParams.get('roleid');
 if(rid&&!cid&&/\/mccost(?:-readonly)?\.html$/.test(location.pathname)){const r=JSON.parse(localStorage.getItem('mcData')).role.find(r=>String(r.roleId)===rid);if(r)cid=r.defaultConfigurationId;}
 if(cid&&rid){const d=JSON.parse(localStorage.getItem('mcData'));if(MultiConfig.role(d,rid).activeConfigurationId!==cid){MultiConfig.select(d,rid,cid);MultiConfig.commit(localStorage,d);}}
}catch(e){bootError=e;}
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let i18n,dialog,dialogOpener;
const read=()=>JSON.parse(localStorage.getItem('mcData'));
const label=c=>c.name||i18n.t('mc.defaultName');
const t=(k,p)=>esc(i18n.t('mc.'+k,p));
function core(){return CharacterCore.create({read:()=>read(),write:saveDataToCache,normalize:RoleViewModel.createAdapter({roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection})});}
function change(fn,options={}){if(bootError)throw Error('INVALID_STORAGE');const c=core(),d=c.load();c.transact(JSON.stringify(d),fn,options);window.dispatchEvent(new Event('wuwa-core-updated'));}
function usage(id){const d=read();return d?.loadoutVersion===2?MultiConfig.references(d,id):[];}
function impact(id,remove=false){const rows=usage(id);return rows.length?'\n'+i18n.t(remove?'mc.deleteImpact':'mc.editImpact',{count:rows.length})+'\n'+rows.map(r=>i18n.entity('characters',r.roleListId,r.roleName)+' · '+(r.name||i18n.t('mc.defaultName'))).join('\n'):'';}
function rename(id,name){try{change(d=>MultiConfig.rename(d,id,MultiConfig.role(d,id).activeConfigurationId,name));return {ok:true};}catch(e){return {ok:false,code:e.message==='INVALID_CONFIG'?'INVALID_METADATA':e.message};}}
function clearSessions(ids){try{for(const id of ids){const prefixes=['config-name:','model:','candidate:','workspace:echo:'].map(p=>'wuwa.register.edit.'+p+id+':');for(const k of Object.keys(sessionStorage))if(prefixes.some(p=>k.startsWith(p))||k==='wuwa.register.edit.model:'+id)sessionStorage.removeItem(k);const raw=sessionStorage.getItem(RegisterNavigation.KEY);if(raw){const nav=JSON.parse(raw);for(const k of Object.keys(nav))if(k==='analysis:'+id||k.startsWith('analysis:'+id+':'))delete nav[k];sessionStorage.setItem(RegisterNavigation.KEY,JSON.stringify(nav));}}}catch(_){/* 会话缓存不影响已提交的核心数据；旧配置ID与修订仍阻止恢复。 */}}
window.MultiConfigUI={change,rename,impact,usage,clearSessions,bootError};
function leave(fn){if(window.MultiConfigLeave)window.MultiConfigLeave(fn);else fn();}
function go(rid,cid){const d=read(),r=MultiConfig.role(d,rid),u=new URL(r.isImport?'mccost-readonly.html':'mccost.html',location.href);u.search=new URLSearchParams({view:'register',roleid:rid,configuration:cid,lang:i18n.locale});location.assign(u.href);}
function close(restore=true){const previous=dialog;dialog=null;previous?.close();previous?.remove();if(restore){const target=dialogOpener?.isConnected?dialogOpener:document.querySelector('[data-mc-manage]');target?.focus({preventScroll:true});}}
function open(title,body){
 const active=document.activeElement;dialogOpener=active?.closest('.mc-dialog')?document.querySelector('[data-mc-manage]'):active;close(false);
 dialog=document.createElement('dialog');dialog.className='rr-dialog mc-dialog';dialog.setAttribute('aria-labelledby','mc-dialog-title');
 dialog.innerHTML='<header class="mc-dialog-header"><h2 id="mc-dialog-title">'+t(title)+'</h2><button type="button" data-mc-close aria-label="'+esc(i18n.t('common.close'))+'">'+esc(i18n.t('common.close'))+'</button></header><div class="mc-dialog-body">'+body+'<p class="mc-error" role="alert"></p></div>';
 document.body.append(dialog);dialog.querySelector('[data-mc-close]').onclick=()=>close();dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 let outside=false;const backdrop=e=>{const b=dialog?.getBoundingClientRect();return b&&e.target===dialog&&(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom);};
 dialog.addEventListener('pointerdown',e=>outside=backdrop(e));dialog.addEventListener('click',e=>{if(outside&&backdrop(e))close();outside=false;});
 dialog.showModal();dialog.querySelector('[data-mc-close]').focus();return dialog;
}
function manage(rid){
 const box=open('manage','<div data-mc-manager></div>');
 function draw(focusId=null){
  box.querySelector('.mc-error').textContent='';
  const r=MultiConfig.role(read(),rid);
  box.querySelector('[data-mc-manager]').innerHTML='<ul class="mc-config-list">'+r.configurations.map(c=>{
   const current=c.id===r.activeConfigurationId,standard=c.id===r.defaultConfigurationId;
   return '<li data-mc-row="'+esc(c.id)+'"><details class="mc-config-menu"><summary><span class="mc-config-info"><strong>'+esc(label(c))+'</strong><span class="mc-config-status">'+(current?'<span>'+t('current')+'</span>':'')+(standard?'<span>★ '+t('default')+'</span>':'')+'<small>'+t('slots',{count:c.slots.filter(v=>v!=null).length})+'</small></span></span><span class="mc-row-action">'+(current?'':'<button type="button" data-mc-select="'+esc(c.id)+'">'+t('switch')+'</button>')+'</span><span class="mc-menu-trigger">'+t('menu')+' ▾</span></summary><div class="mc-menu-panel"><form data-mc-rename="'+esc(c.id)+'"><label>'+t('name')+'<input maxlength="80" required value="'+esc(label(c))+'"></label><button type="submit">'+t('rename')+'</button></form><div class="mc-menu-actions">'+(standard?'':'<button type="button" data-mc-default="'+esc(c.id)+'">'+t('setDefault')+'</button>')+'<button type="button" class="mc-danger" data-mc-delete="'+esc(c.id)+'"'+(r.configurations.length===1?' disabled':'')+'>'+t('delete')+'</button></div></div></details></li>';
  }).join('')+'</ul><div class="mc-actions mc-management-actions"><button type="button" data-mc-add>'+t('add')+'</button><button type="button" data-mc-copy>'+t('copy')+'</button><button type="button" data-mc-compare'+(r.configurations.length<2?' disabled':'')+'>'+t('compare')+'</button></div>';
  if(focusId){const row=box.querySelector('[data-mc-row="'+CSS.escape(focusId)+'"]');if(row){row.querySelector('details').open=true;row.querySelector('summary').focus({preventScroll:true});}}
 }
 draw();box.addEventListener('toggle',e=>{if(e.target.matches('.mc-config-menu')&&e.target.open)box.querySelectorAll('.mc-config-menu').forEach(d=>{if(d!==e.target)d.open=false;});},true);
 box.addEventListener('submit',e=>{if(!e.target.matches('[data-mc-rename]'))return;e.preventDefault();try{change(d=>MultiConfig.rename(d,rid,e.target.dataset.mcRename,e.target.querySelector('input').value));draw(e.target.dataset.mcRename);}catch(error){box.querySelector('[role=alert]').textContent=i18n.t(error.message==='INVALID_CONFIG'?'ops.nameInvalid':'workspace.SAVE_FAILED');}});
 box.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!box.contains(b))return;try{
  if(b.dataset.mcSelect){leave(()=>{change(d=>MultiConfig.select(d,rid,b.dataset.mcSelect));go(rid,b.dataset.mcSelect);});}
  else if(b.dataset.mcDefault){change(d=>MultiConfig.role(d,rid).defaultConfigurationId=b.dataset.mcDefault);draw(b.dataset.mcDefault);}
  else if(b.dataset.mcDelete){if(!confirm(i18n.t('mc.deleteConfigConfirm')))return;const wasActive=MultiConfig.role(read(),rid).activeConfigurationId===b.dataset.mcDelete;change(d=>MultiConfig.remove(d,rid,b.dataset.mcDelete),{resetConfigurations:[b.dataset.mcDelete]});if(wasActive)go(rid,MultiConfig.role(read(),rid).activeConfigurationId);else draw();}
  else if(b.hasAttribute('data-mc-add')||b.hasAttribute('data-mc-copy')){let cid;leave(()=>{change(d=>cid=MultiConfig.add(d,rid,b.hasAttribute('data-mc-copy'),i18n.t(b.hasAttribute('data-mc-copy')?'mc.copyName':'mc.newName')));go(rid,cid);});}
  else if(b.hasAttribute('data-mc-compare'))compare(rid);
 }catch(error){box.querySelector('[role=alert]').textContent=i18n.t('workspace.'+(['SOURCE_CHANGED','SAVE_FAILED'].includes(error.message)?error.message:'SAVE_FAILED'));}});
}
function compare(rid){
 const r=MultiConfig.role(read(),rid),normalize=RoleViewModel.createAdapter({roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection});
 const options=selected=>r.configurations.map(c=>'<option value="'+esc(c.id)+'"'+(c.id===selected?' selected':'')+'>'+esc(label(c))+'</option>').join('');
 const box=open('compare','<div class="mc-compare-controls"><label>'+t('first')+'<select data-mc-first>'+options(r.activeConfigurationId)+'</select></label><label>'+t('second')+'<select data-mc-second>'+options(r.configurations.find(c=>c.id!==r.activeConfigurationId)?.id||r.activeConfigurationId)+'</select></label></div><div data-mc-comparison></div>');
 function draw(){
  const data=read(),role=MultiConfig.role(data,rid),configs=[box.querySelector('[data-mc-first]').value,box.querySelector('[data-mc-second]').value].map(id=>role.configurations.find(c=>c.id===id));
  if(configs.some(c=>!c)){box.querySelector('[role=alert]').textContent=i18n.t('workspace.SOURCE_CHANGED');return;}
  const models=configs.map(c=>{const clone=MultiConfig.copy(data);MultiConfig.select(clone,rid,c.id);return normalize(MultiConfig.role(clone,rid));});
  const radar=models.map(RegisterShare.radarData),max=Math.max(...radar.map(v=>v.max)),point=(v,i,radius=84)=>[160+Math.sin(i*2*Math.PI/5)*radius*v/max,140-Math.cos(i*2*Math.PI/5)*radius*v/max];
  const chart=(v,index)=>'<svg class="mc-radar" viewBox="0 0 320 280" role="img" aria-label="'+t('radar')+'"><title>'+t('radar')+'</title><desc>'+t('radarScope',{max})+'</desc><polygon points="'+Array.from({length:5},(_,i)=>point(max,i).join(',')).join(' ')+'" fill="none" stroke="#45615c"/>'+Array.from({length:5},(_,i)=>{const p=point(max,i),l=point(max,i,113);return '<line x1="160" y1="140" x2="'+p[0]+'" y2="'+p[1]+'" stroke="#45615c"/><text x="'+l[0]+'" y="'+(l[1]+4)+'" fill="#c7dcd7" text-anchor="middle">'+esc(i18n.t('loadout.slot',{position:i+1}))+'</text>';}).join('')+(v.filled?'<polygon points="'+v.entries.map((e,i)=>point(e.value,i).join(',')).join(' ')+'" fill="'+(index?'#d2b67a33':'#79c5b533')+'" stroke="'+(index?'#d2b67a':'#79c5b5')+'"/>':'')+v.entries.map((e,i)=>{if(e.value===null||e.value<0)return '';const p=point(e.value,i);return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3" fill="'+(index?'#d2b67a':'#79c5b5')+'"/>';}).join('')+'</svg>';
  const stat=s=>s?.key?esc(i18n.t('stats.'+s.key))+' '+esc(s.unit==='percent'?i18n.format.percentage(s.value):i18n.format.decimal(s.value)):'—';
  const reading=m=>m.summary.score??(m.model.status==='available'?m.summary.knownContribution:null),partial=models.some(m=>m.summary.score===null),values=models.map(reading),difference=values.every(Number.isFinite)?values[1]-values[0]:null;
  const delta=difference===null?'—':(difference>0?'+':'')+i18n.format.score(difference);
  const echoName=e=>{const catalog=costList.find(c=>String(c.id)===String(e.catalogId)),fallback=[e.legacy?.name,e.name,catalog?.name].find(v=>typeof v==='string'&&v.trim()&&!/^\[[^\]]+\]$/.test(v.trim()));return i18n.entity('echoes',e.catalogId,fallback||i18n.t('register.echoId',{id:e.catalogId??'—'}));};
  box.querySelector('[data-mc-comparison]').innerHTML='<p class="mc-delta">'+t(partial?'partialDelta':'delta')+' <strong data-mc-delta>'+esc(delta)+'</strong></p><div class="mc-compare-grid">'+models.map((m,i)=>'<section data-mc-side="'+i+'"><h3>'+esc(label(configs[i]))+'</h3><p class="mc-total-label">'+esc(i18n.t(m.summary.score===null?'summary.knownSubtotal':'summary.score'))+'</p><strong class="mc-total">'+esc(i18n.format.score(values[i]))+'</strong>'+chart(radar[i],i)+'<p class="mc-radar-scope">'+t('radarScope',{max})+'</p>'+m.slots.map((s,n)=>{
   const ids=configs.map(c=>c.slots[n]),relation=ids.every(id=>id==null)?'bothEmpty':ids[0]==null?'firstEmpty':ids[1]==null?'secondEmpty':String(ids[0])===String(ids[1])?'same':'different',equal=relation==='same'||relation==='bothEmpty';
   const suite=s.echo?.suite,rawSet=suite?.legacy?.name,set=suite?.id?i18n.entity('sets',suite.id,rawSet):rawSet;
   return '<div data-mc-slot="'+(n+1)+'" data-mc-relation="'+relation+'" class="mc-compare-slot '+(equal?'mc-same':'mc-different')+'"><div class="mc-slot-heading"><b>'+esc(i18n.t('loadout.slot',{position:n+1}))+'</b><small>'+t(relation)+'</small></div>'+(s.echo?'<h4>'+esc(echoName(s.echo))+'</h4><p class="mc-echo-cost">'+t('cost',{cost:s.echo.cost??'—'})+(set?' · '+esc(set):'')+'</p><p class="mc-main-stat">'+stat(s.echo.mainStat)+'</p><p class="mc-slot-score"><small>'+esc(i18n.t('loadout.contribution'))+'</small><strong>'+esc(i18n.format.score(s.echo.score.value))+'</strong></p>':'<p>'+t('empty')+'</p>')+'</div>';
  }).join('')+'<h4 class="mc-substats-title">'+esc(i18n.t('summary.substatTotals'))+'</h4><dl class="mc-substats">'+m.summary.substatTotals.map(s=>'<div><dt>'+esc(i18n.t('stats.'+s.key))+'</dt><dd>'+esc(s.unit==='percent'?i18n.format.percentage(s.value):i18n.format.decimal(s.value))+'</dd></div>').join('')+'</dl></section>').join('')+'</div>';
 }
 box.addEventListener('change',draw);draw();
}

function decorate(){
 const data=read();if(!data||data.loadoutVersion!==2)return;
 const host=document.querySelector('#role-register'),r=data.role.find(r=>String(r.roleId)===new URL(location.href).searchParams.get('roleid'));
 if(host&&r&&host.querySelector('.rr-identity')&&!host.querySelector('.mc-switcher')){
  const c=MultiConfig.active(r),el=document.createElement('section');el.className='mc-switcher';el.innerHTML='<label>'+t('current')+'<select data-mc-switch>'+r.configurations.map(c=>'<option value="'+esc(c.id)+'"'+(c.id===r.activeConfigurationId?' selected':'')+'>'+esc(label(c))+(c.id===r.defaultConfigurationId?' ★':'')+'</option>').join('')+'</select></label><div class="mc-actions"><button data-mc-new>'+t('add')+'</button><button data-mc-manage>'+t('manage')+'</button></div>';host.querySelector('.rr-identity-hero').after(el);
  el.querySelector('select').onchange=e=>{const cid=e.target.value;leave(()=>{change(d=>MultiConfig.select(d,r.roleId,cid));go(r.roleId,cid);});};
  el.querySelector('[data-mc-manage]').onclick=()=>manage(r.roleId);el.querySelector('[data-mc-new]').onclick=()=>leave(()=>{let cid;change(d=>cid=MultiConfig.add(d,r.roleId,false,i18n.t('mc.newName')));go(r.roleId,cid);});
  const missing=c.slots.filter(id=>id!=null&&!data.echoes.some(e=>String(e.costId)===String(id))).length;if(missing)el.insertAdjacentHTML('beforeend','<p role="alert">'+t('missing',{count:missing})+'</p>');
 }

}
document.addEventListener('DOMContentLoaded',()=>{
 i18n=EchoI18n.createBrowser(window);
 function downloadRaw(){
  const value=JSON.stringify(CharacterCore.rawBackup(localStorage),null,2),blob=new Blob([value],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='wuwa-raw-backup-'+Date.now()+'.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 if(bootError){
  const alert=document.createElement('section');alert.className='mc-boot-error';alert.setAttribute('role','alert');
  let foreignRaw=null,foreign=null;try{foreignRaw=localStorage.getItem('mcData');foreign=CharacterCore.foreignSummary(foreignRaw);}catch(_){}
  let messageKey=foreign?'mc.foreignStorage':'mc.migrationError';
  const message=document.createElement('p');message.textContent=i18n.t(messageKey,foreign||{});alert.append(message);
  const download=document.createElement('button');download.type='button';download.textContent=i18n.t('mc.rawBackup');alert.append(download);
  download.onclick=()=>{try{downloadRaw();}catch(_){messageKey='mc.rawBackupFailed';message.textContent=i18n.t(messageKey);}};
  let restart;
  if(foreign){
   restart=document.createElement('button');restart.type='button';restart.dataset.mcRestartForeign='';restart.textContent=i18n.t('mc.foreignRestart');alert.append(restart);
   restart.onclick=()=>{
    if(!confirm(i18n.t('mc.foreignConfirm',foreign)))return;
    restart.disabled=true;
    try{CharacterCore.restartForeign(localStorage,foreignRaw);location.assign('index.html?view=register&lang='+i18n.locale);}
    catch(error){messageKey=error.message==='SOURCE_CHANGED'?'workspace.SOURCE_CHANGED':'mc.foreignRestartFailed';message.textContent=i18n.t(messageKey);restart.disabled=false;}
   };
  }
  window.addEventListener('wuwa-locale',e=>{i18n.setLocale(e.detail);message.textContent=i18n.t(messageKey,foreign||{});download.textContent=i18n.t('mc.rawBackup');if(restart)restart.textContent=i18n.t('mc.foreignRestart');});
  document.body.prepend(alert);
  document.body.classList.add('mc-storage-blocked');
  // 失败状态只允许导航与原始备份；禁止在空白占位数据上继续编辑或还原。
  document.querySelectorAll('main,#role-register').forEach(el=>el.inert=true);
  return;
 }
 const archived=CharacterCore.archivedForeignSummary(localStorage);
 if(archived&&/\/(?:index(?:\.html)?)?$/.test(location.pathname)){
  const notice=document.createElement('section');notice.className='mc-boot-error';notice.setAttribute('role','status');
  const message=document.createElement('p'),download=document.createElement('button');download.type='button';
  const draw=()=>{message.textContent=i18n.t('mc.foreignArchived',archived);download.textContent=i18n.t('mc.rawBackup');};draw();
  download.onclick=()=>{try{downloadRaw();}catch(_){message.textContent=i18n.t('mc.rawBackupFailed');}};
  window.addEventListener('wuwa-locale',e=>{i18n.setLocale(e.detail);draw();});notice.append(message,download);document.body.prepend(notice);
 }
 decorate();let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;decorate();});}).observe(document.body,{childList:true,subtree:true});
 document.addEventListener('submit',e=>{if(!e.target.matches('[data-action=echo]'))return;const id=new URL(location.href).searchParams.get('costid');if(id&&usage(id).length>1&&!confirm(i18n.t('mc.editConfirm')+impact(id))){e.preventDefault();e.stopImmediatePropagation();}},true);
 window.addEventListener('wuwa-locale',e=>{i18n.setLocale(e.detail);close();document.querySelectorAll('.mc-switcher').forEach(e=>e.remove());decorate();});
});
})();
