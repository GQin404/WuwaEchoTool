/* 历史清理只在用户明确操作时写入，失败时恢复已写入的独立命名空间。 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./role-draft-storage.js'),require('./role-local-configuration.js'),require('./register-metadata.js'));else root.RoleHistory=factory(root.RoleDraftStorage,root.RoleLocalConfiguration,root.RegisterMetadata);})(typeof globalThis!=='undefined'?globalThis:this,function(Drafts,Local,Meta){
    function create(storage){
        function change(id){
            const drafts=Drafts.create(storage).load(),local=Local.create(storage).load();if(!drafts.ok||!local.ok)return {ok:false};
            if(id!==null){drafts.data.drafts=drafts.data.drafts.filter(d=>d.id!==id);drafts.data.baselines=drafts.data.baselines.filter(b=>drafts.data.drafts.some(d=>d.baseline.id===b.id));drafts.data.revision++;}
            local.data.items=local.data.items.filter(i=>drafts.data.drafts.some(d=>d.id===i.draftId&&d.baseline.id===i.baselineId));
            const keys=[Drafts.KEY,Local.KEY],before=keys.map(k=>storage.getItem(k));
            let metadata=null;
            if(typeof Meta!=='undefined'){metadata=Meta.create(storage).load();if(!metadata.ok)return {ok:false};if(metadata.raw!==null){metadata.data.drafts=Object.fromEntries(Object.entries(metadata.data.drafts).filter(([key])=>drafts.data.drafts.some(d=>d.id===key)));metadata.data.revision++;keys.push(Meta.KEY);before.push(metadata.raw);}}
            const changes={[Drafts.KEY]:JSON.stringify(drafts.data),[Local.KEY]:JSON.stringify(local.data)};if(metadata?.raw!==null&&metadata)changes[Meta.KEY]=JSON.stringify(metadata.data);
            if(Meta)return Meta.atomic(storage,changes,Object.fromEntries(keys.map((k,i)=>[k,before[i]])));
            try{storage.setItem(Drafts.KEY,JSON.stringify(drafts.data));storage.setItem(Local.KEY,JSON.stringify(local.data));return {ok:true};}catch(_){try{keys.forEach((k,i)=>before[i]===null?storage.removeItem(k):storage.setItem(k,before[i]));}catch(_){return {ok:false,code:'ROLLBACK_FAILED'};}return {ok:false};}
        }
        return {remove:id=>change(id),prune:()=>change(null)};
    }
    return {create};
});
