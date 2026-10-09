/* 角色图统一从目录读取，仅使用 characters 目录下的本地图片，不访问角色存档。 */
(function(root,factory){
    if(typeof module==='object'&&module.exports)module.exports=factory();
    else {root.CharacterPortraits=factory();document.addEventListener('DOMContentLoaded',()=>root.CharacterPortraits.mountClassic(roleList,document));}
})(typeof globalThis!=='undefined'?globalThis:this,function(){
    function resolve(entry){
        if(!entry)return null;
        if(typeof entry.portrait==='string'&&/^image\/characters\/[\w-]+\.(?:png|webp|jpe?g|avif)$/i.test(entry.portrait))return entry.portrait;
        return typeof entry.cls==='string'&&/^mcr-[\w-]+$/.test(entry.cls)?'image/characters/'+entry.cls.slice(4)+'.png':null;
    }
    function classicStyles(catalog){
        return catalog.filter(r=>/^mcr-[\w-]+$/.test(r.cls)).map(r=>{
            const selector='.mc-role.'+r.cls;
            return selector+'{background-image:url('+JSON.stringify(resolve(r))+');background-repeat:no-repeat;background-position:center top;background-size:cover}'+selector+'::after{content:'+JSON.stringify(String(r.name||''))+'}';
        }).join('\n');
    }
    function mountClassic(catalog,doc){
        if(doc.getElementById('classic-character-portraits'))return;
        const style=doc.createElement('style');style.id='classic-character-portraits';style.textContent=classicStyles(catalog);doc.head.append(style);
    }
    return {resolve,classicStyles,mountClassic};
});
