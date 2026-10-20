/* 删除确认保留来源快照；只有显式确认才调用共享核心事务。 */
document.addEventListener('DOMContentLoaded',()=>{
    if(UiView.state.effective!=='register')return;
    const i18n=EchoI18n.createBrowser(window),dialog=document.createElement('dialog');dialog.className='rr-dialog';document.body.append(dialog);
    let expected=null,identity=null,opener=null,coreRaw=null,namesRaw=null;
    const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    function close(){dialog.close();opener?.focus();}
    document.addEventListener('click',event=>{
        const button=event.target.closest('[data-delete-role]');if(!button)return;
        opener=button;identity=button.dataset.deleteRole;
        try{
            const data=CharacterCore.validate(JSON.parse(localStorage.getItem('mcData'))),role=data.role.filter(r=>String(r.roleId)===identity);
            if(role.length!==1)throw Error();expected=JSON.stringify(data);
            coreRaw=localStorage.getItem('mcData');if(typeof RegisterMetadata!=='undefined'){const names=RegisterMetadata.create(localStorage).load();if(!names.ok)throw Error();namesRaw=names.raw;}
            const name=i18n.entity('characters',role[0].roleListId,role[0].name);
            dialog.innerHTML='<h2>'+esc(i18n.t('role.delete'))+'</h2><p>'+esc(i18n.t(data.loadoutVersion===2?'role.deleteSharedConfirm':'role.deleteConfirm',{name}))+'</p><p role="alert"></p><div class="rr-dialog-actions"><button data-cancel>'+esc(i18n.t('common.cancel'))+'</button><button data-confirm>'+esc(i18n.t('role.delete'))+'</button></div>';
            dialog.showModal();dialog.querySelector('[data-cancel]').focus();
        }catch(_){dialog.innerHTML='<p>'+esc(i18n.t('workspace.SOURCE_CHANGED'))+'</p><button data-cancel>'+esc(i18n.t('common.close'))+'</button>';dialog.showModal();}
    });
    dialog.addEventListener('click',event=>{
        if(event.target.closest('[data-cancel]'))close();
        if(!event.target.closest('[data-confirm]'))return;
        try{
            const write=(data,options)=>{if(typeof RegisterMetadata==='undefined'){saveDataToCache(data);return;}const names=RegisterMetadata.create(localStorage).load();if(!names.ok||names.raw!==namesRaw)throw Error('SOURCE_CHANGED');if(data.loadoutVersion===2){saveDataToCache(data,options);return;}delete names.data.roles[identity];names.data.revision++;const result=RegisterMetadata.atomic(localStorage,{mcData:JSON.stringify(data),[RegisterMetadata.KEY]:JSON.stringify(names.data)},{mcData:coreRaw,[RegisterMetadata.KEY]:namesRaw});if(!result.ok)throw Error(result.code);};
            const core=CharacterCore.create({read:()=>JSON.parse(localStorage.getItem('mcData')),write});
            core.transact(expected,data=>CharacterCore.removeRole(data,identity),{resetRoles:[identity]});
            location.assign('index.html?view=register&lang='+i18n.locale);
        }catch(error){dialog.querySelector('[role=alert]').textContent=i18n.t(error.message==='SOURCE_CHANGED'?'workspace.SOURCE_CHANGED':'workspace.SAVE_FAILED');}
    });
    dialog.addEventListener('cancel',()=>opener?.focus());
    window.addEventListener('wuwa-locale',e=>{if(i18n.locale!==e.detail)i18n.setLocale(e.detail);});
});
