/* 两种界面共用建立、校验与保存入口；调用方只能在明确保存时提交副本。 */
(function(root,factory){
    if(typeof module==='object'&&module.exports)module.exports=factory(require('./multi-config.js'));else root.CharacterCore=factory(root.MultiConfig);
})(typeof globalThis!=='undefined'?globalThis:this,function(Multi){
    'use strict';
    const copy=x=>JSON.parse(JSON.stringify(x));
    const COMPATIBILITY_BACKUP='wuwa.multiconfig.compatibilityBackups.v1';
    const RAW_KEYS=['mcData',Multi.JOURNAL,'wuwa.echoTool.drafts.v1','wuwa.echoTool.localConfigurations.v1','wuwa.register.names.v1','wuwa.register.echoMeta.v1'];
    // 原始字符串不经解析即可导出；不包含登录凭证。备份与诊断共用此白名单。
    function rawBackup(storage){return {format:'wuwa-raw-storage',version:1,values:Object.fromEntries([...RAW_KEYS,COMPATIBILITY_BACKUP].map(k=>[k,storage.getItem(k)]))};}
    // 只识别报告中实际出现的外部配装结构，不把未知数组当作本工具存档。
    function foreignSummary(raw){
        try{
            const data=JSON.parse(raw);
            if(!Array.isArray(data)||!data.length||!data.every(r=>r&&typeof r.Name==='string'&&r.Name.trim()&&Array.isArray(r.list)&&r.list.length<=5&&r.list.every(e=>e&&['1','3','4'].includes(String(e.Cost))&&Array.isArray(e.AllEchoAffix))))return null;
            return {roles:data.length,echoes:data.reduce((n,r)=>n+r.list.length,0)};
        }catch(_){return null;}
    }
    function preserveSnapshot(storage,raw){
        const values=Object.fromEntries(RAW_KEYS.map(k=>[k,storage.getItem(k)]));
        if(values.mcData!==raw)throw Error('SOURCE_CHANGED');
        const saved=storage.getItem(COMPATIBILITY_BACKUP),backup=saved===null?{version:1,snapshots:[]}:JSON.parse(saved);
        if(backup?.version!==1||!Array.isArray(backup.snapshots))throw Error('INVALID_STORAGE');
        if(!backup.snapshots.some(s=>JSON.stringify(s.values)===JSON.stringify(values))){
            backup.snapshots.push({createdAt:Date.now(),values});
            storage.setItem(COMPATIBILITY_BACKUP,JSON.stringify(backup));
        }
    }
    // 只在用户明确确认后，隔离已识别外部资料并建立新存档；不猜声骸身份或复用外部评分。
    function restartForeign(storage,expectedRaw){
        if(storage.getItem('mcData')!==expectedRaw)throw Error('SOURCE_CHANGED');
        if(!foreignSummary(expectedRaw))throw Error('INVALID_DATA');
        const check=()=>{if(RAW_KEYS.slice(1).some(k=>storage.getItem(k)!==null))throw Error('INVALID_STORAGE');};
        check();preserveSnapshot(storage,expectedRaw);check();
        const data=validate(Multi.migrate({role:[],unusedEchoes:[]}));
        Multi.commit(storage,data,{expectedCore:JSON.stringify(JSON.parse(expectedRaw))});
        return data;
    }
    function archivedForeignSummary(storage){
        try{const backup=JSON.parse(storage.getItem(COMPATIBILITY_BACKUP));
            for(const snapshot of (backup?.snapshots||[]).slice().reverse()){const summary=foreignSummary(snapshot.values?.mcData);if(summary)return summary;}
        }catch(_){}return null;
    }
    function initialize(storage,metadata){
        Multi.recover(storage);
        const raw=storage.getItem('mcData'),original=raw===null?null:JSON.parse(raw);
        let data=validate(Multi.prepare(original===null?{role:[],unusedEchoes:[]}:original)),migrateConfigurations=null;
        if(data.loadoutVersion!==2){
            const names=metadata.load();if(!names.ok)throw Error('INVALID_STORAGE');
            data=validate(Multi.migrate(data,names.data.roles));
            migrateConfigurations=Object.fromEntries(data.role.map(r=>[r.roleId,r.activeConfigurationId]));
        }
        if(JSON.stringify(original)===JSON.stringify(data))return data;
        // 每种原始状态只保留一次；备份写入失败时不得覆盖核心存档。
        if(raw!==null)preserveSnapshot(storage,raw);
        if(storage.getItem('mcData')!==raw)throw Error('SOURCE_CHANGED');
        Multi.commit(storage,data,{migrateConfigurations,expectedCore:JSON.stringify(original)});
        return data;
    }
    const IMPORT_SERVER='76402e5b20be2c39f095a152090afddc';
    async function accountKey(uid,server=IMPORT_SERVER){const bytes=await globalThis.crypto.subtle.digest('SHA-256',new TextEncoder().encode(server+':'+uid));return Array.from(new Uint8Array(bytes),x=>x.toString(16).padStart(2,'0')).join('');}
    async function importSource(uid,gameRoleId){return {version:1,server:IMPORT_SERVER,accountKey:await accountKey(uid),gameRoleId:String(gameRoleId)};}
    function createRole(entry,id){return {roleId:id,isImport:false,level:0,roleListId:entry.id,totalScore:0,name:entry.name,cls:entry.cls,dbCritNum:0,attackNum:0,costList:[]};}
    function createEcho(entry,id){return {costId:id,costListId:entry.id,name:entry.name,type:entry.type,imgCode:entry.imgCode,suite:null,mainAtrri:null,sumScores:0,propertyList:[]};}
    function removeRole(data,id){
        const matches=data.role.filter(r=>String(r.roleId)===String(id));
        if(matches.length!==1)throw Error('IDENTITY');
        data.role=data.role.filter(r=>String(r.roleId)!==String(id));
        if(data.loadoutVersion===2)Multi.project(data);
    }
    function validate(data){
        if(!data||Array.isArray(data)||!Array.isArray(data.role)||!Array.isArray(data.unusedEchoes||[]))throw Error('INVALID_DATA');
        function safeKeys(value){if(value&&typeof value==='object'){for(const [key,item]of Object.entries(value)){if(['__proto__','prototype','constructor'].includes(key))throw Error('INVALID_DATA');safeKeys(item);}}}
        safeKeys(data);
        const roleIds=new Set();
        for(const r of data.role){if(!r||r.roleId==null||roleIds.has(String(r.roleId))||!Array.isArray(r.costList)||r.costList.length>5)throw Error('INVALID_DATA');
            if(r.importSource){const s=r.importSource;if(s.version!==1||!/^[a-f0-9]{64}$/.test(s.accountKey)||typeof s.server!=='string'||!s.server||typeof s.gameRoleId!=='string'||!s.gameRoleId||Object.keys(s).sort().join(',')!=='accountKey,gameRoleId,server,version')throw Error('INVALID_DATA');}
            roleIds.add(String(r.roleId));}
        Multi?.validate(data);return data;
    }
    function create({read,write,normalize}){
        const load=()=>validate(copy(read()||{pjLevel:0,tzmId:null,role:[],unusedEchoes:[]}));
        function transact(expected,change,options={}){
            let data=load();if(JSON.stringify(data)!==expected)throw Error('SOURCE_CHANGED');
            const previous=copy(data),result=change(data);
            if(data.loadoutVersion===2){data=Multi.reconcile(data,previous);data.role.forEach(r=>{if(JSON.stringify(r)!==JSON.stringify(previous.role.find(p=>String(p.roleId)===String(r.roleId))))score(r);});}
            validate(data);
            const removedEchoIds=(previous.echoes||[]).filter(e=>!(data.echoes||[]).some(x=>String(x.costId)===String(e.costId))).map(e=>e.costId);
            write(data,{...options,expectedCore:expected,removedEchoIds});return result;
        }
        function score(role){
            const vm=normalize(role);
            vm.slots.forEach(s=>{if(s.echo&&Number.isFinite(s.echo.score.value))role.costList[s.position-1].sumScores=s.echo.score.value.toFixed(2);});
            if(Number.isFinite(vm.summary.score))role.totalScore=vm.summary.score.toFixed(2);
            else role.totalScore=vm.summary.knownContribution.toFixed(2);
            return role;
        }
        function saveEcho(data,roleId,originalId,echo,position){
            if(data.loadoutVersion===2){
                if(![1,3,4].includes(Number(String(echo.type).replace('Cost','')))||!Array.isArray(echo.propertyList)||echo.propertyList.length>5||new Set(echo.propertyList.map(s=>s.property)).size!==echo.propertyList.length||echo.propertyList.some(s=>!s.property||!/^\d+(?:\.\d+)?%?$/.test(String(s.value))||!Number.isFinite(parseFloat(s.value))))throw Error('INVALID_ECHO');
                if(originalId!=null&&String(originalId)!==String(echo.costId))throw Error('IDENTITY');Multi.edit(data,echo);if(roleId!=null)Multi.equip(data,roleId,echo.costId,position);return echo.costId;
            }
            const role=roleId==null?null:data.role.find(r=>String(r.roleId)===String(roleId));
            if(roleId!=null&&!role)throw Error('SOURCE_CHANGED');
            if(role?.isImport)throw Error('READ_ONLY');
            const list=role?role.costList:(data.unusedEchoes||(data.unusedEchoes=[]));
            if(![1,3,4].includes(Number(String(echo.type).replace('Cost','')))||!Array.isArray(echo.propertyList)||echo.propertyList.length>5||new Set(echo.propertyList.map(s=>s.property)).size!==echo.propertyList.length||echo.propertyList.some(s=>!s.property||!/^\d+(?:\.\d+)?%?$/.test(String(s.value))||!Number.isFinite(parseFloat(s.value))))throw Error('INVALID_ECHO');
            if(originalId!=null){const indexes=list.map((e,i)=>e&&String(e.costId)===String(originalId)?i:-1).filter(i=>i>=0);if(indexes.length!==1)throw Error('IDENTITY');list[indexes[0]]=copy(echo);}
            else {if(list.some(e=>e&&String(e.costId)===String(echo.costId)))throw Error('IDENTITY');if(role){if(position!==list.length+1||list.length>=5)throw Error('SOURCE_CHANGED');}list.push(copy(echo));}
            if(role){if(list.reduce((n,e)=>n+Number(e.type.replace('Cost','')),0)>12)throw Error('COST_LIMIT');score(role);}
            return echo.costId;
        }
        function removeEcho(data,roleId,echoId,toLibrary=false){
            if(data.loadoutVersion===2){if(roleId!=null&&toLibrary)Multi.unlink(data,roleId,echoId);else Multi.destroy(data,echoId);return;}
            const role=roleId==null?null:data.role.find(r=>String(r.roleId)===String(roleId));
            if(roleId!=null&&!role)throw Error('SOURCE_CHANGED');if(role?.isImport)throw Error('READ_ONLY');
            const list=role?role.costList:data.unusedEchoes||[],matches=list.filter(e=>String(e.costId)===String(echoId));
            if(matches.length!==1)throw Error('IDENTITY');
            if(toLibrary){if(!role||(data.unusedEchoes||[]).some(e=>String(e.costId)===String(echoId)))throw Error('IDENTITY');(data.unusedEchoes||(data.unusedEchoes=[])).push(copy(matches[0]));}
            const remaining=list.filter(e=>String(e.costId)!==String(echoId));if(role){role.costList=remaining;score(role);}else data.unusedEchoes=remaining;
        }
        function equip(data,roleId,echoId,position){
            if(data.loadoutVersion===2)return Multi.equip(data,roleId,echoId,position);
            const role=data.role.find(r=>String(r.roleId)===String(roleId)),matches=(data.unusedEchoes||[]).filter(e=>String(e.costId)===String(echoId));
            if(!role)throw Error('SOURCE_CHANGED');if(matches.length!==1)throw Error('IDENTITY');
            saveEcho(data,roleId,null,matches[0],role.costList.length+1);removeEcho(data,null,echoId);return role.costList.length;
        }
        return {load,transact,score,saveEcho,removeEcho,equip};
    }
    function restoreData({json,expectedRaw,readRaw,write}){const incoming=validate(JSON.parse(json));if(readRaw()!==expectedRaw)throw Error('SOURCE_CHANGED');write(copy(incoming));return incoming;}
    return {COMPATIBILITY_BACKUP,rawBackup,foreignSummary,restartForeign,archivedForeignSummary,initialize,IMPORT_SERVER,accountKey,importSource,createRole,createEcho,removeRole,validate,create,restoreData};
});
