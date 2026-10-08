/* 删除确认保留来源快照；只有显式确认才调用共享核心事务。 */
document.addEventListener('DOMContentLoaded',()=>{
    if(UiView.state.effective!=='register')return;
    const i18n=EchoI18n.createBrowser(window),dialog=document.createElement('dialog');dialog.className='rr-dialog';document.body.append(dialog);
    let expected=null,identity=null,opener=null;
    const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    function close(){dialog.close();opener?.focus();}
    document.addEventListener('click',event=>{
        const button=event.target.closest('[data-delete-role]');if(!button)return;
        opener=button;identity=button.dataset.deleteRole;
        try{
            const data=CharacterCore.validate(JSON.parse(localStorage.getItem('mcData'))),role=data.role.filter(r=>String(r.roleId)===identity);
            if(role.length!==1)throw Error();expected=JSON.stringify(data);
            const name=i18n.entity('characters',role[0].roleListId,role[0].name);
            dialog.innerHTML='<h2>'+esc(i18n.t('role.delete'))+'</h2><p>'+esc(i18n.t('role.deleteConfirm',{name}))+'</p><p role="alert"></p><div class="rr-dialog-actions"><button data-cancel>'+esc(i18n.t('common.cancel'))+'</button><button data-confirm>'+esc(i18n.t('role.delete'))+'</button></div>';
            dialog.showModal();dialog.querySelector('[data-cancel]').focus();
        }catch(_){dialog.innerHTML='<p>'+esc(i18n.t('workspace.SOURCE_CHANGED'))+'</p><button data-cancel>'+esc(i18n.t('common.close'))+'</button>';dialog.showModal();}
    });
    dialog.addEventListener('click',event=>{
        if(event.target.closest('[data-cancel]'))close();
        if(!event.target.closest('[data-confirm]'))return;
        try{
            const core=CharacterCore.create({read:()=>JSON.parse(localStorage.getItem('mcData')),write:saveDataToCache});
            core.transact(expected,data=>CharacterCore.removeRole(data,identity));
            location.assign('index.html?view=register');
        }catch(_){dialog.querySelector('[role=alert]').textContent=i18n.t('workspace.SOURCE_CHANGED');}
    });
    dialog.addEventListener('cancel',()=>opener?.focus());
    window.addEventListener('wuwa-locale',e=>{if(i18n.locale!==e.detail)i18n.setLocale(e.detail);});
});
