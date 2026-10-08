/* 交互状态独立于 DOM 和存档，模型条件只在当前预览中生效。 */
(function(root,factory){
    if(typeof module==='object'&&module.exports)module.exports=factory();
    else root.RoleRegisterController=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
    'use strict';
    const copy=value=>JSON.parse(JSON.stringify(value));
    const validId=id=>typeof id==='number'?Number.isFinite(id):typeof id==='string'&&id.trim()!=='';
    function create(input,normalize){
        let source=copy(input),overrides={},model,identities={},selection=null,notice=null,evidenceOpen=false;
        const transient=new WeakMap();let sequence=0;
        function rebuild(){
            model=normalize({...source,...overrides});
            const counts=new Map();
            (Array.isArray(source.costList)?source.costList:[]).forEach(e=>{if(validId(e?.costId)){const id=String(e.costId);counts.set(id,(counts.get(id)||0)+1);}});
            identities={};
            model.slots.forEach(slot=>{
                if(!slot.echo){identities[slot.position]=null;return;}
                const id=slot.echo.id;
                if(validId(id)&&counts.get(String(id))===1){identities[slot.position]='instance:'+String(id);return;}
                // 缺失或重复 ID 只能在当前源对象生命周期内选择，不跨载入猜测身份。
                const record=source.costList[slot.position-1];
                if(!transient.has(record))transient.set(record,'session:'+ ++sequence);
                identities[slot.position]=transient.get(record);
            });
        }
        function reconcile(){
            if(!selection)return;
            const matching=model.slots.filter(s=>selection.kind==='empty'?s.position===selection.position&&!s.echo:identities[s.position]===selection.echoIdentity);
            if(matching.length===1)selection={...selection,position:matching[0].position};
            else {selection=null;notice='configurationUpdated';}
        }
        function snapshot(){return {model,selection:selection?{...selection}:null,identities:{...identities},notice,evidenceOpen,modelChanged:Object.keys(overrides).length>0};}
        function select(position,identity){
            const slot=model.slots.find(s=>s.position===position);
            if(!slot||identities[position]!==identity)return snapshot();
            const next={position,echoIdentity:identity,kind:slot.echo?'echo':'empty'};
            selection=selection?.position===position&&selection.echoIdentity===identity?null:next;
            notice=null;return snapshot();
        }
        function refresh(record){
            if(String(record.roleId)!==String(source.roleId)){selection=null;overrides={};notice='configurationUpdated';}
            source=copy(record);rebuild();reconcile();return snapshot();
        }
        function updateModel(field,value){
            if(field==='ming')overrides.ming=Math.max(0,Math.min(6,Math.trunc(Number(value)||0)));
            else if(field==='damageMode')overrides.damageMode=String(value);
            else if(field==='extraEnergy'&&Number(source.roleListId)===51)overrides.extraEnergy=Math.max(0,Math.min(200,Number(value)||0));
            else if(field==='referenceHealth'&&Number(source.roleListId)===62)overrides.referenceHealth=Math.max(15000,Math.min(70000,Number(value)||40000));
            else return snapshot();
            rebuild();reconcile();return snapshot();
        }
        function restore(position,id){
            if(!Number.isInteger(position)||position<1||position>5||id==null)return snapshot();
            const matches=model.slots.filter(s=>s.echo&&identities[s.position]==='instance:'+String(id));
            if(matches.length===1)selection={position:matches[0].position,echoIdentity:identities[matches[0].position],kind:'echo'};
            else {selection=null;notice='configurationUpdated';}
            return snapshot();
        }
        rebuild();
        return {snapshot,select,refresh,updateModel,restore,
            collapse(){selection=null;return snapshot();},
            evidence(){evidenceOpen=!evidenceOpen;return snapshot();},
            resetModel(){overrides={};rebuild();reconcile();return snapshot();}};
    }
    function editorReturn(search,roleId,echoId){
        const params=new URLSearchParams(search);
        const url=new URLSearchParams({roleid:String(roleId)});
        if(params.get('returnRegister')==='1'){
            url.set('view','register');url.set('selectedPosition',params.get('rrPosition')||'');url.set('selectedEcho',String(echoId));
        }else if(params.get('view')==='classic')url.set('view','classic');
        return './mccost.html?'+url;
    }
    return {create,editorReturn};
});
