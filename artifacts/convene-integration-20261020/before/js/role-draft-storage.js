/* 草稿使用独立命名空间；读取失败或未知版本时禁止覆盖原始内容。 */
(function(root,factory){
    if(typeof module==='object'&&module.exports)module.exports=factory(require('./role-draft-model.js'));
    else root.RoleDraftStorage=factory(root.RoleDraftModel);
})(typeof globalThis!=='undefined'?globalThis:this,function(model){
    'use strict';
    const KEY='wuwa.echoTool.drafts.v1';
    const empty=()=>({schemaVersion:1,revision:0,baselines:[],drafts:[]});
    const copy=x=>JSON.parse(JSON.stringify(x));
    function validate(data){
        if(!data||data.schemaVersion!==1)throw Error('UNSUPPORTED_SCHEMA');
        if(!Number.isSafeInteger(data.revision)||data.revision<0||!Array.isArray(data.baselines)||!Array.isArray(data.drafts)||
            Object.keys(data).sort().join(',')!=='baselines,drafts,revision,schemaVersion')throw Error('INVALID_STORAGE');
        data.baselines.forEach(model.validateBaseline);
        for(const items of [data.baselines,data.drafts])if(new Set(items.map(x=>x.id)).size!==items.length)throw Error('DUPLICATE_ID');
        data.drafts.forEach(d=>model.validateDraft(d,data.baselines.find(b=>b.id===d.baseline?.id)));
        return data;
    }
    function create(storage){
        function load(){
            try{
                const raw=storage.getItem(KEY);
                return {ok:true,data:raw===null?empty():validate(JSON.parse(raw))};
            }catch(error){return {ok:false,code:error.message==='UNSUPPORTED_SCHEMA'?'UNSUPPORTED_SCHEMA':'STORAGE_UNREADABLE',data:null};}
        }
        function change(expectedRevision,mutate){
            const current=load();if(!current.ok)return current;
            if(current.data.revision!==expectedRevision)return {ok:false,code:'STORAGE_CONFLICT'};
            try{
                const next=copy(current.data);mutate(next);next.revision++;
                validate(next);
                try{storage.setItem(KEY,JSON.stringify(next));}catch(_){return {ok:false,code:'STORAGE_WRITE_FAILED'};}
                return {ok:true,data:copy(next)};
            }catch(error){return {ok:false,code:/^[A-Z_]+$/.test(error.message)?error.message:'INVALID_STORAGE'};}
        }
        function save(b,d,expectedRevision){
            return change(expectedRevision,data=>{
                model.validateDraft(d,b);
                const baseline=data.baselines.find(x=>x.id===b.id);
                if(baseline&&model.canonical(baseline)!==model.canonical(b))throw Error('IMMUTABLE_BASELINE_CONFLICT');
                if(!baseline)data.baselines.push(copy(b));
                const index=data.drafts.findIndex(x=>x.id===d.id);
                if(index>=0){
                    const old=data.drafts[index];
                    if(old.baseline.id!==d.baseline.id||old.targetSlot!==d.targetSlot||old.createdAt!==d.createdAt||d.updatedAt<old.updatedAt)throw Error('DRAFT_ID_CONFLICT');
                    data.drafts[index]=copy(d);
                }else data.drafts.push(copy(d));
            });
        }
        function remove(id,expectedRevision){
            return change(expectedRevision,data=>{
                data.drafts=data.drafts.filter(d=>d.id!==id);
                data.baselines=data.baselines.filter(b=>data.drafts.some(d=>d.baseline.id===b.id));
            });
        }
        function exportData(){const result=load();return result.ok?{ok:true,json:JSON.stringify(result.data)}:result;}
        function restore(json,expectedRevision){
            let incoming;try{incoming=validate(JSON.parse(json));}catch(_){return {ok:false,code:'INVALID_BACKUP'};}
            // 显式恢复独立草稿备份；恢复后仍需与当前来源重新 assess，不能视为有效。
            return change(expectedRevision,data=>{data.baselines=copy(incoming.baselines);data.drafts=copy(incoming.drafts);});
        }
        return {load,save,remove,exportData,restore};
    }
    return {KEY,SCHEMA_VERSION:1,create};
});
