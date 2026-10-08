/* 本地采用记录引用草稿快照，不回写角色，也不改变 v1 草稿结构。 */
(function(root,factory){
    if(typeof module==='object'&&module.exports)module.exports=factory(require('./role-draft-model.js'));
    else root.RoleLocalConfiguration=factory(root.RoleDraftModel);
})(typeof globalThis!=='undefined'?globalThis:this,function(model){
    'use strict';
    const KEY='wuwa.echoTool.localConfigurations.v1';
    function create(storage){
        function load(){try{
            const raw=storage.getItem(KEY),data=raw===null?{schemaVersion:1,items:[]}:JSON.parse(raw);
            if(!data||data.schemaVersion!==1||Object.keys(data).sort().join(',')!=='items,schemaVersion'||!Array.isArray(data.items)||data.items.some(i=>!i||Object.keys(i).sort().join(',')!=='adoptedAt,baselineId,conditions,draftId,signature'||typeof i.draftId!=='string'||typeof i.baselineId!=='string'||typeof i.signature!=='string'||!Number.isFinite(i.adoptedAt)||i.adoptedAt<0||!i.conditions||Object.entries(i.conditions).some(([k,v])=>!['equipment','energy','tradeoffs'].includes(k)||typeof v!=='boolean'))||new Set(data.items.map(i=>i.draftId)).size!==data.items.length)throw Error('INVALID_STORAGE');
            return {ok:true,data};
        }catch(_){return {ok:false};}}
        function find(b,d){const loaded=load();return loaded.ok?loaded.data.items.find(i=>i.draftId===d.id&&i.baselineId===b.id&&i.signature===model.canonical({baseline:b,draft:d}))||null:null;}
        function adopt(b,d,current,conditions,result,now){
            if(model.assess(b,d,current,now).status!=='valid'||result.conclusion!=='recommended')return {ok:false};
            const loaded=load();if(!loaded.ok)return loaded;
            const item={draftId:d.id,baselineId:b.id,signature:model.canonical({baseline:b,draft:d}),conditions:{...conditions},adoptedAt:now};
            loaded.data.items=loaded.data.items.filter(i=>i.draftId!==d.id);loaded.data.items.push(item);
            try{storage.setItem(KEY,JSON.stringify(loaded.data));return {ok:true};}catch(_){return {ok:false};}
        }
        return {load,find,adopt};
    }
    return {KEY,create};
});
