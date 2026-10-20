/* Register batch workflow. Preview is memory only; one shared-core transaction commits mcData. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./character-core.js'),require('./multi-config.js'));else root.RegisterImportModel=factory(root.CharacterCore,root.MultiConfig);})(typeof globalThis!=='undefined'?globalThis:this,function(Core,MultiConfig){
'use strict';
const SERVER=Core.IMPORT_SERVER,copy=x=>JSON.parse(JSON.stringify(x));
function uniqueId(){const bytes=new Uint32Array(2);globalThis.crypto.getRandomValues(bytes);return (bytes[0]&0xffff)*4294967296+bytes[1];}
const accountKey=Core.accountKey;
function sameSource(a,b){return a?.version===1&&a.server===b.server&&a.accountKey===b.accountKey&&String(a.gameRoleId)===String(b.gameRoleId);}
function create({service,core,catalog,mapRole,normalize,storage,searchName=()=>'',onChange=()=>{},lock=fn=>fn()}){
    let epoch=0,controller=null,baseline=core.load(),credential=null;
    const state={phase:'connect',credential:'empty',busy:false,operation:null,rows:[],selected:new Set(),search:'',page:0,overwriteAcknowledged:false,completed:0,total:0,current:null,error:null,result:null};
    const emit=()=>onChange(state),snapshot=()=>state;
    function stop(){epoch++;controller?.abort();controller=null;state.busy=false;state.operation=null;state.current=null;for(const row of state.rows)if(['pending','loading'].includes(row.status))row.status='cancelled';}
    function invalidate(){stop();credential=null;state.rows=[];state.selected.clear();state.result=null;state.phase='connect';state.error=null;state.credential='modified';emit();}
    function clearCredentials(){
        invalidate();let previous;
        try{previous=['kjq_token','kjq_bat'].map(key=>[key,storage.getItem(key)]);for(const [key]of previous)storage.removeItem(key);state.credential='empty';}
        catch(_){try{for(const [key,value]of previous||[])if(value!==null)storage.setItem(key,value);}catch(_){}state.error=Error('SAVE_FAILED');state.credential='saved';}emit();
    }
    function matches(row,data=baseline){
        const exact=data.role.filter(r=>r.isImport&&sameSource(r.importSource,row.source));
        const legacy=data.role.filter(r=>r.isImport&&!r.importSource&&String(r.roleListId)===String(row.entry.id));
        return {exact,candidates:[...exact,...legacy]};
    }
    function propose(row){const {exact,candidates}=matches(row);row.candidates=candidates.map(copy);row.target=null;row.original=null;
        if(exact.length===1){row.action=baseline.loadoutVersion===2?'skip':'update';row.target=String(exact[0].roleId);row.original=copy(exact[0]);}
        else row.action=candidates.length?(baseline.loadoutVersion===2?'skip':'resolve'):'add';
    }
    async function connect(uid,token){
        if(state.busy)return false;
        stop();const ticket=epoch;controller=new AbortController();const signal=controller.signal;
        state.error=null;state.rows=[];state.selected.clear();state.search='';state.completed=state.total=0;state.result=null;state.busy=true;state.operation='connect';state.credential='validating';state.phase='connect';emit();
        try{
            if(!/^\d{9}$/.test(uid))throw Error('INVALID_UID');if(!token.trim())throw Error('TOKEN_REQUIRED');
            // Saved credentials remain unverified until the existing authorization chain succeeds.
            if(storage.getItem('kjq_token')!==token)await service.bind(token,{signal});
            const list=await service.list(uid,{signal}),key=await accountKey(uid);
            if(ticket!==epoch)return false;
            baseline=core.load();credential={uid,key};
            const counts=new Map();for(const item of list)counts.set(String(item?.roleId),(counts.get(String(item?.roleId))||0)+1);
            state.rows=list.map((item,index)=>{
                let entry=null;try{const id=mapRole(item?.roleId,item?.roleName);entry=catalog.find(r=>String(r.id)===String(id))||null;}catch(_){}
                const known=!!entry&&item?.roleId!=null&&String(item.roleId)!=='0'&&counts.get(String(item.roleId))===1;
                const row={key:String(index),info:copy(item||{}),entry,known,status:known?'idle':'unknown',error:null,preview:null,view:null,source:{version:1,server:SERVER,accountKey:key,gameRoleId:String(item?.roleId??'')},action:'skip'};
                if(known)propose(row);return row;
            });
            state.phase='select';state.credential='usable';return true;
        }catch(error){if(ticket===epoch){state.error=error;state.credential=error.importFailure?.reason==='credential'?'invalid':'saved';}return false;}
        finally{if(ticket===epoch){state.busy=false;state.operation=null;emit();}}
    }
    function visible(){return state.rows.filter(r=>(r.info.roleName+' '+(r.entry?.name||'')+' '+(r.entry?searchName(r.entry):'')).toLowerCase().includes(state.search.toLowerCase()));}
    function select(key,value){if(state.busy||state.phase==='result')return;const row=state.rows.find(r=>r.key===key);if(!row?.known)return;value?state.selected.add(key):state.selected.delete(key);emit();}
    function selectAll(){if(state.busy)return;for(const row of visible())if(row.known)state.selected.add(row.key);emit();}
    function clearSelection(){if(state.busy)return;state.selected.clear();emit();}
    function choose(key,action,target){
        if(state.busy||state.phase==='result')return;
        const row=state.rows.find(r=>r.key===key);if(!row?.known)return;
        if(action==='update'){
            const record=row.candidates.find(r=>String(r.roleId)===String(target));if(!record)throw Error('IDENTITY');
            row.target=String(record.roleId);row.original=copy(record);
        }else if(!['add','skip','resolve'].includes(action))throw Error('IDENTITY');
        else {row.target=null;row.original=null;}
        row.action=action;state.overwriteAcknowledged=false;if(row.preview)prepare(row);emit();
    }
    function prepare(row){
        const next=copy(row.preview);
        if(row.original){
            next.roleId=row.original.roleId;
            // Preserve local scoring conditions. Chain and official equipment come from detail.
            if(baseline.loadoutVersion!==2)for(const key of ['damageMode','extraEnergy','referenceHealth'])if(Object.hasOwn(row.original,key))next[key]=row.original[key];
        }
        next.importSource=copy(row.source);row.commit=core.score(next);row.view=normalize(next);
        row.previous=row.original?normalize(row.original):null;
    }
    async function read(retry=false){
        if(state.busy||!credential)return false;
        const rows=state.rows.filter(r=>r.known&&state.selected.has(r.key)&&(baseline.loadoutVersion!==2||r.action!=='skip')&&(retry?['failed','cancelled'].includes(r.status):r.status!=='done'));
        if(!rows.length&&baseline.loadoutVersion===2&&state.selected.size){state.phase='preview';emit();return true;}
        if(!rows.length)return false;
        stop();const ticket=epoch;controller=new AbortController();const signal=controller.signal;
        state.busy=true;state.operation='read';state.phase='preview';state.error=null;state.total=rows.length;state.completed=0;
        for(const row of rows){row.status='pending';row.error=null;}emit();
        // Serial queue deliberately bounds requests to one official detail chain at a time.
        for(const row of rows){
            if(ticket!==epoch)break;
            row.status='loading';state.current=row.key;emit();
            try{
                const base=Core.createRole(row.entry,uniqueId());base.isImport=true;base.gameRoleId=row.info.roleId;
                const role=await service.detail(credential.uid,base,{signal});if(ticket!==epoch)break;
                row.preview=role;prepare(row);row.status='done';
            }catch(error){if(ticket!==epoch)break;row.error=error;row.status='failed';}
            state.completed++;emit();
        }
        if(ticket===epoch){state.busy=false;state.operation=null;state.current=null;emit();}return true;
    }
    function cancel(){const verifying=state.credential==='validating';stop();if(verifying){try{state.credential=storage.getItem('kjq_token')?'saved':'modified';}catch(_){state.credential='modified';}}state.error=Error('CANCELLED');emit();}
    function counts(){const rows=state.rows.filter(r=>state.selected.has(r.key));return {add:rows.filter(r=>(baseline.loadoutVersion===2||r.status==='done')&&r.action==='add').length,update:rows.filter(r=>(baseline.loadoutVersion===2||r.status==='done')&&r.action==='update').length,skip:rows.filter(r=>r.action==='skip').length,failed:rows.filter(r=>['failed','cancelled'].includes(r.status)&&r.action!=='skip').length,resolve:rows.filter(r=>r.action==='resolve'&&r.status==='done').length};}
    function reconcile(latest){
        for(const row of state.rows.filter(r=>r.known)){
            const previousMatches=matches(row,baseline),freshMatches=matches(row,latest);
            const old=row.target?baseline.role.find(r=>String(r.roleId)===row.target):null;
            const fresh=row.target?latest.role.find(r=>String(r.roleId)===row.target):null;
            const changed=JSON.stringify(old)!==JSON.stringify(fresh)||JSON.stringify(previousMatches.candidates)!==JSON.stringify(freshMatches.candidates);
            row.candidates=freshMatches.candidates.map(copy);
            if(changed&&row.action!=='skip'){row.action='resolve';row.target=null;row.original=null;if(row.preview)prepare(row);}
        }
        baseline=latest;
    }
    async function save(){
        if(state.busy||state.result)return false;
        const totals=counts();if(totals.resolve||baseline.loadoutVersion!==2&&!totals.add&&!totals.update)return false;
        if(baseline.loadoutVersion===2){
            const selected=state.rows.filter(r=>r.known&&state.selected.has(r.key)&&r.action!=='skip');
            if(selected.some(r=>r.status!=='done')||totals.update&&!state.overwriteAcknowledged)return false;
            if(!selected.length){state.result={...totals,roles:[]};state.phase='result';emit();return true;}
        }
        const rows=state.rows.filter(r=>state.selected.has(r.key)&&r.status==='done'&&['add','update'].includes(r.action));
        const ticket=epoch;state.busy=true;state.operation='save';state.error=null;emit();
        try{return await lock(()=>{
            if(ticket!==epoch)throw Error('CANCELLED');
            const latest=core.load();if(JSON.stringify(latest)!==JSON.stringify(baseline)){reconcile(latest);throw Error('SOURCE_CHANGED');}
            const targetIds=new Set();for(const row of rows){const id=String(row.commit.roleId);if(targetIds.has(id))throw Error('IDENTITY');targetIds.add(id);}
            const savedIds=new Map();
            core.transact(JSON.stringify(latest),data=>{
                data.tzmId=credential.uid;
                const ids=new Set([...data.role.flatMap(r=>[r.roleId,...r.costList.filter(Boolean).map(e=>e.costId)]),...(data.unusedEchoes||[]).map(e=>e.costId)].map(String));
                for(const row of rows){
                    const next=copy(row.commit);if(row.action==='add'){
                        if(data.role.some(r=>r.isImport&&sameSource(r.importSource,row.source)))throw Error('IDENTITY');
                        while(ids.has(String(next.roleId)))next.roleId=uniqueId();ids.add(String(next.roleId));
                    }
                    for(const echo of next.costList){while(ids.has(String(echo.costId)))echo.costId=uniqueId();ids.add(String(echo.costId));}
                    if(row.action==='add')data.role.push(next);
                    else {const index=data.role.findIndex(r=>String(r.roleId)===row.target);if(index<0||!data.role[index].isImport)throw Error('IDENTITY');if(data.loadoutVersion===2)MultiConfig.overwrite(data,row.target,next);else data.role[index]=next;}
                    savedIds.set(row.key,next.roleId);
                }
            },{resetRoles:rows.filter(r=>r.action==='update').map(r=>r.target)});
            for(const row of rows)row.savedId=savedIds.get(row.key);
            state.result={...totals,roles:rows.map(r=>({key:r.key,id:r.savedId,action:r.action}))};state.phase='result';baseline=core.load();return true;
        });}catch(error){if(ticket===epoch)state.error=['SOURCE_CHANGED','IDENTITY','CANCELLED','INVALID_DATA'].includes(error.message)?error:Error('SAVE_FAILED');return false;}
        finally{if(ticket===epoch){state.busy=false;state.operation=null;emit();}}
    }
    function retry(){if(state.result){state.result=null;for(const row of state.rows)if(row.savedId){propose(row);row.action='skip';}}return read(true);}
    function review(){if(!state.busy){state.phase='select';emit();}}
    function refreshLocal(){reconcile(core.load());emit();}
    return {snapshot,connect,read,retry,cancel,save,select,selectAll,clearSelection,choose,visible,counts,review,refreshLocal,invalidate,clearCredentials,dispose:stop};
}
return {SERVER,uniqueId,accountKey,sameSource,create};
});
