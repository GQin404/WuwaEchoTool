/* 使用既有工作台、详情与对话框；所有写入均经过共享核心快照事务。 */
(function(){
'use strict';if(window.UiView?.state.effective!=='register')return;
let bootError=null;
try{
 MultiConfig.recover(localStorage);
 const raw=localStorage.getItem('mcData');{const data=CharacterCore.validate(raw?JSON.parse(raw):{role:[],unusedEchoes:[]});if(data.loadoutVersion!==2){const meta=RegisterMetadata.create(localStorage).load();if(!meta.ok)throw Error('INVALID_STORAGE');const migrated=MultiConfig.migrate(data,meta.data.roles);if(localStorage.getItem('mcData')!==raw)throw Error('SOURCE_CHANGED');MultiConfig.commit(localStorage,migrated,{migrateConfigurations:Object.fromEntries(migrated.role.map(r=>[r.roleId,r.activeConfigurationId]))});}}
 let cid=new URL(location.href).searchParams.get('configuration');const rid=new URL(location.href).searchParams.get('roleid');
 if(rid&&!cid&&/\/mccost(?:-readonly)?\.html$/.test(location.pathname)){const r=JSON.parse(localStorage.getItem('mcData')).role.find(r=>String(r.roleId)===rid);if(r)cid=r.defaultConfigurationId;}
 if(cid&&rid){const d=JSON.parse(localStorage.getItem('mcData'));if(MultiConfig.role(d,rid).activeConfigurationId!==cid){MultiConfig.select(d,rid,cid);MultiConfig.commit(localStorage,d);}}
}catch(e){bootError=e;}
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let i18n,dialog;
const read=()=>JSON.parse(localStorage.getItem('mcData'));
const label=c=>c.name||i18n.t('mc.defaultName');
const t=(k,p)=>esc(i18n.t('mc.'+k,p));
function core(){return CharacterCore.create({read:()=>read(),write:saveDataToCache,normalize:RoleViewModel.createAdapter({roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection})});}
function change(fn,options={}){if(bootError)throw Error('INVALID_STORAGE');const c=core(),d=c.load();c.transact(JSON.stringify(d),fn,options);window.dispatchEvent(new Event('wuwa-core-updated'));}
function usage(id){const d=read();return d?.loadoutVersion===2?MultiConfig.references(d,id):[];}
function impact(id,remove=false){const rows=usage(id);return rows.length?'\n'+i18n.t(remove?'mc.deleteImpact':'mc.editImpact',{count:rows.length})+'\n'+rows.map(r=>i18n.entity('characters',r.roleListId,r.roleName)+' · '+(r.name||i18n.t('mc.defaultName'))).join('\n'):'';}
function rename(id,name){try{change(d=>MultiConfig.rename(d,id,MultiConfig.role(d,id).activeConfigurationId,name));return {ok:true};}catch(e){return {ok:false,code:e.message==='INVALID_CONFIG'?'INVALID_METADATA':e.message};}}
function clearSessions(ids){try{for(const id of ids){const prefixes=['config-name:','model:','candidate:','workspace:echo:'].map(p=>'wuwa.register.edit.'+p+id+':');for(const k of Object.keys(sessionStorage))if(prefixes.some(p=>k.startsWith(p))||k==='wuwa.register.edit.model:'+id)sessionStorage.removeItem(k);const raw=sessionStorage.getItem(RegisterNavigation.KEY);if(raw){const nav=JSON.parse(raw);for(const k of Object.keys(nav))if(k==='analysis:'+id||k.startsWith('analysis:'+id+':'))delete nav[k];sessionStorage.setItem(RegisterNavigation.KEY,JSON.stringify(nav));}}}catch(_){/* 会话缓存不影响已提交的核心数据；旧配置ID与修订仍阻止恢复。 */}}
window.MultiConfigUI={change,rename,impact,usage,clearSessions};
function leave(fn){if(window.MultiConfigLeave)window.MultiConfigLeave(fn);else fn();}
function go(rid,cid){const d=read(),r=MultiConfig.role(d,rid),u=new URL(r.isImport?'mccost-readonly.html':'mccost.html',location.href);u.search=new URLSearchParams({view:'register',roleid:rid,configuration:cid,lang:i18n.locale});location.assign(u.href);}
function close(){dialog?.close();dialog?.remove();dialog=null;}
function open(title,body){close();dialog=document.createElement('dialog');dialog.className='rr-dialog mc-dialog';dialog.innerHTML='<h2>'+t(title)+'</h2>'+body+'<p class="mc-error" role="alert"></p><div class="rr-dialog-actions"><button data-mc-close>'+esc(i18n.t('common.close'))+'</button></div>';document.body.append(dialog);dialog.querySelector('[data-mc-close]').onclick=close;dialog.showModal();return dialog;}
function manage(rid){
 const r=MultiConfig.role(read(),rid);
 open('manage','<ul class="mc-config-list">'+r.configurations.map(c=>'<li><span><strong>'+(c.id===r.defaultConfigurationId?'★ ':'')+esc(label(c))+'</strong><small>'+t('slots',{count:c.slots.filter(v=>v!=null).length})+'</small></span><div><button data-mc-select="'+esc(c.id)+'">'+t('switch')+'</button><button data-mc-default="'+esc(c.id)+'"'+(c.id===r.defaultConfigurationId?' disabled':'')+'>'+t('setDefault')+'</button><button class="mc-danger" data-mc-delete="'+esc(c.id)+'"'+(r.configurations.length===1?' disabled':'')+'>'+t('delete')+'</button></div></li>').join('')+'</ul><form data-mc-rename><label>'+t('name')+'<input maxlength="80" required value="'+esc(label(MultiConfig.active(r)))+'"></label><button>'+t('rename')+'</button></form><div class="mc-actions"><button data-mc-add>'+t('add')+'</button><button data-mc-copy>'+t('copy')+'</button><button data-mc-compare'+(r.configurations.length<2?' disabled':'')+'>'+t('compare')+'</button></div>');
 dialog.addEventListener('submit',e=>{if(!e.target.matches('[data-mc-rename]'))return;e.preventDefault();const result=rename(rid,e.target.querySelector('input').value);if(result.ok){close();location.reload();}else dialog.querySelector('[role=alert]').textContent=i18n.t('ops.nameInvalid');});
 dialog.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;try{
  if(b.dataset.mcSelect){leave(()=>{change(d=>MultiConfig.select(d,rid,b.dataset.mcSelect));go(rid,b.dataset.mcSelect);});}
  else if(b.dataset.mcDefault){change(d=>MultiConfig.role(d,rid).defaultConfigurationId=b.dataset.mcDefault);manage(rid);}
  else if(b.dataset.mcDelete){if(!confirm(i18n.t('mc.deleteConfigConfirm')))return;const wasActive=MultiConfig.role(read(),rid).activeConfigurationId===b.dataset.mcDelete;change(d=>MultiConfig.remove(d,rid,b.dataset.mcDelete),{resetConfigurations:[b.dataset.mcDelete]});if(wasActive)go(rid,MultiConfig.role(read(),rid).activeConfigurationId);else manage(rid);}
  else if(b.hasAttribute('data-mc-add')||b.hasAttribute('data-mc-copy')){let cid;leave(()=>{change(d=>cid=MultiConfig.add(d,rid,b.hasAttribute('data-mc-copy'),i18n.t(b.hasAttribute('data-mc-copy')?'mc.copyName':'mc.newName')));go(rid,cid);});}
  else if(b.hasAttribute('data-mc-compare'))compare(rid);
 }catch(error){dialog.querySelector('[role=alert]').textContent=i18n.t('workspace.'+(['SOURCE_CHANGED','SAVE_FAILED'].includes(error.message)?error.message:'SAVE_FAILED'));}});
}
function compare(rid){
 const data=read(),r=MultiConfig.role(data,rid),normalize=RoleViewModel.createAdapter({roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection});
 const options=selected=>r.configurations.map(c=>'<option value="'+esc(c.id)+'"'+(c.id===selected?' selected':'')+'>'+esc(label(c))+'</option>').join('');
 open('compare','<div class="mc-compare-controls"><label>'+t('first')+'<select data-mc-first>'+options(r.activeConfigurationId)+'</select></label><label>'+t('second')+'<select data-mc-second>'+options(r.configurations.find(c=>c.id!==r.activeConfigurationId).id)+'</select></label></div><div data-mc-comparison></div>');
 function draw(){
  const configs=[dialog.querySelector('[data-mc-first]').value,dialog.querySelector('[data-mc-second]').value].map(id=>r.configurations.find(c=>c.id===id));
  const models=configs.map(c=>{const clone=MultiConfig.copy(data);MultiConfig.select(clone,rid,c.id);return normalize(MultiConfig.role(clone,rid));});
  const radar=models.map(RegisterShare.radarData),max=Math.max(...radar.map(r=>r.max)),point=(v,i)=>[120+Math.sin(i*2*Math.PI/5)*90*v/max,120-Math.cos(i*2*Math.PI/5)*90*v/max];
  const chart=(v,index)=>'<svg class="mc-radar" viewBox="0 0 240 240" role="img" aria-label="'+t('radar')+'">'+Array.from({length:5},(_,i)=>{const p=point(max,i);return '<line x1="120" y1="120" x2="'+p[0]+'" y2="'+p[1]+'" stroke="#45615c"/><text x="'+(120+(p[0]-120)*1.12)+'" y="'+(124+(p[1]-120)*1.12)+'" fill="#c7dcd7" text-anchor="middle">'+(i+1)+'</text>';}).join('')+(v.filled?'<polygon points="'+v.entries.map((e,i)=>point(e.value,i).join(',')).join(' ')+'" fill="'+(index?'#d2b67a33':'#79c5b533')+'" stroke="'+(index?'#d2b67a':'#79c5b5')+'"/>':'')+'</svg>';
  const stat=s=>s?.key?esc(i18n.t('stats.'+s.key))+' '+esc(s.unit==='percent'?i18n.format.percentage(s.value):i18n.format.decimal(s.value)):'—';
  const delta=models[0].summary.score!=null&&models[1].summary.score!=null?i18n.format.score(models[1].summary.score-models[0].summary.score):'—';
  dialog.querySelector('[data-mc-comparison]').innerHTML='<p class="mc-delta">'+t('delta')+' <strong>'+esc(delta)+'</strong></p><div class="mc-compare-grid">'+models.map((m,i)=>'<section><h3>'+esc(label(configs[i]))+'</h3><strong class="mc-total">'+esc(i18n.format.score(m.summary.score))+'</strong>'+chart(radar[i],i)+'<p>'+t('radarScope',{max})+'</p>'+m.slots.map((s,n)=>{const equal=configs[0].slots[n]===configs[1].slots[n];return '<div class="mc-compare-slot '+(equal?'mc-same':'mc-different')+'"><b>'+esc(i18n.t('loadout.slot',{position:n+1}))+' · '+t(equal?'same':'different')+'</b><p>'+(s.echo?esc(i18n.entity('echoes',s.echo.catalogId,s.echo.name)):t('empty'))+'</p><p>'+stat(s.echo?.mainStat)+'</p><span>'+esc(i18n.format.score(s.echo?.score.value))+'</span></div>';}).join('')+'<h4>'+esc(i18n.t('summary.substatTotals'))+'</h4>'+m.summary.substatTotals.map(s=>'<p>'+stat(s)+'</p>').join('')+'</section>').join('')+'</div>';
 }dialog.addEventListener('change',draw);draw();
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
 if(bootError){const alert=document.createElement('p');alert.className='mc-boot-error';alert.setAttribute('role','alert');alert.textContent=i18n.t('mc.migrationError');document.body.prepend(alert);return;}
 decorate();let pending=false;new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;decorate();});}).observe(document.body,{childList:true,subtree:true});
 document.addEventListener('submit',e=>{if(!e.target.matches('[data-action=echo]'))return;const id=new URL(location.href).searchParams.get('costid');if(id&&usage(id).length>1&&!confirm(i18n.t('mc.editConfirm')+impact(id))){e.preventDefault();e.stopImmediatePropagation();}},true);
 window.addEventListener('wuwa-locale',e=>{i18n.setLocale(e.detail);close();document.querySelectorAll('.mc-switcher').forEach(e=>e.remove());decorate();});
});
})();
