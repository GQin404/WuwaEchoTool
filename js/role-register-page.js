/* 两个角色入口共用此初始化逻辑；只读存档，不调用旧排序或保存函数。 */
document.addEventListener('DOMContentLoaded',function(){
    'use strict';
    if(!window.RoleRegisterMode)return;
    const i18n=EchoI18n.createBrowser(window);
    const adapter=RoleViewModel.createAdapter({roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection});
    const host=document.createElement('div');host.id='role-register';document.body.append(host);
    const url=new URL(location.href);url.searchParams.delete('view');
    let model=null,error=null;
    try{
        const data=JSON.parse(localStorage.getItem('mcData')||'null');
        const id=new URLSearchParams(location.search).get('roleid');
        const role=Array.isArray(data?.role)?data.role.find(r=>String(r.roleId)===id):null;
        if(role)model=adapter(role);else error='missing';
    }catch(_){error='unreadable';}
    function render(){
        host.innerHTML=RoleRegisterRenderer.render(model,i18n,{error,legacyUrl:url.pathname+url.search}).html;
        document.title=i18n.t('register.pageTitle');
    }
    render();
    // 1B 只接语言切换，槽位选择和分析展开留到 1C。
    host.addEventListener('change',event=>{
        if(event.target.matches('[data-rr-locale]')){
            i18n.setLocale(event.target.value);
            host.querySelector('[data-rr-locale]')?.focus();
        }
    });
    i18n.subscribe(render);
});
