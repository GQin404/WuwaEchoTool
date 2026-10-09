/* 角色图片由 base.css 维护；浏览器启动时读取展示路径，不访问角色存档。 */
(function(root,factory){
    if(typeof module==='object'&&module.exports)module.exports=factory();
    else {root.CharacterPortraits=factory();root.CharacterPortraits.readStyles(roleList,document);document.addEventListener('DOMContentLoaded',()=>root.CharacterPortraits.mountClassic(roleList,document));}
})(typeof globalThis!=='undefined'?globalThis:this,function(){
    function resolve(entry){
        if(!entry)return null;
        if(typeof entry.portrait==='string'&&/^image\/characters\/[\w-]+\.(?:png|webp|jpe?g|avif)$/i.test(entry.portrait))return entry.portrait;
        return typeof entry.cls==='string'&&/^mcr-[\w-]+$/.test(entry.cls)?'image/characters/'+entry.cls.slice(4)+'.png':null;
    }
    function classicStyles(catalog){
        return catalog.filter(r=>/^mcr-[\w-]+$/.test(r.cls)).map(r=>{
            const selector='.mc-role.'+r.cls;
            return selector+'::after{content:'+JSON.stringify(String(r.name||''))+'}';
        }).join('\n');
    }
    function readStyles(catalog,doc){
        // 仅补充静态目录的展示字段，view model 仍是纯数据转换。
        const probe=doc.createElement('div');probe.style.cssText='position:absolute;visibility:hidden;pointer-events:none';doc.body.append(probe);
        for(const entry of catalog){
            probe.className=entry.cls;
            const background=doc.defaultView.getComputedStyle(probe).backgroundImage;
            const match=/url\(["']?([^"')]+)["']?\)/.exec(background);
            const local=match?.[1].match(/(?:^|\/)image\/characters\/([\w-]+\.(?:png|webp|jpe?g|avif))(?:[?#].*)?$/i);
            entry.portrait=local?'image/characters/'+local[1]:null;
        }
        probe.remove();
    }
    function mountClassic(catalog,doc){
        if(doc.getElementById('classic-character-portraits'))return;
        const style=doc.createElement('style');style.id='classic-character-portraits';style.textContent=classicStyles(catalog);doc.head.append(style);
    }
    return {resolve,classicStyles,readStyles,mountClassic};
});
