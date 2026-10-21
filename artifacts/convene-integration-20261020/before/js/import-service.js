/* 沿用原服务地址、请求签名和转换器；网络成功不等于用户已确认保存。 */
(function(root){
    'use strict';
    function create(api){
        const stages={0:'list',1:'detail',2:'bind',3:'refresh',6:'auth'};
        // 只保留阶段、分类及数字状态码，不把服务器原文或凭证带入错误对象。
        function failure(stage,reason,response,status){
            const error=Error('IMPORT_FAILED');
            error.importFailure={stage,reason,code:/^\d{1,8}$/.test(String(response?.code))?String(response.code):'',status:Number.isInteger(status)&&status>0?status:null};
            return error;
        }
        function check(response,stage,status){
            let data=response?.data;
            if(typeof data==='string'){try{data=JSON.parse(data);}catch(_){data=null;}}
            const msg=typeof response?.msg==='string'?response.msg:'';
            let reason;
            if(data?.geeTest===true||/验证码|驗證碼|captcha|geetest/i.test(msg))reason='verification';
            else if(/维护|維護|停机|停機|升级中|系統升級|系统升级/.test(msg))reason='maintenance';
            else if(/数据令牌.*失效|資料憑證.*失效/.test(msg))reason='dataToken';
            else if(/令牌.*(失效|过期|過期|为空)|token.*(expired|invalid)|登录.*(失效|过期)|未登录/i.test(msg))reason='credential';
            if(reason)throw failure(stage,reason,response,status);
            if(response?.success===false||(response?.code!=null&&![200,10902].includes(Number(response.code))))throw failure(stage,'rejected',response,status);
        }
        let did=null;
        const request=(index,data,headers,options={})=>new Promise((resolve,reject)=>{
            const stage=stages[index];
            const signal=options.signal;
            if(signal?.aborted){reject(Error('CANCELLED'));return;}
            headers={...headers};if(headers.did){did=did||headers.did;headers.did=did;}
            let xhr,settled=false;
            const finish=(fn,value)=>{if(settled)return;settled=true;signal?.removeEventListener('abort',abort);fn(value);};
            const abort=()=>{finish(reject,Error('CANCELLED'));xhr?.abort?.();};
            signal?.addEventListener('abort',abort,{once:true});
            xhr=api.ajax({url:api.host+api.methods[index],type:'POST',headers,data,dataType:'json',timeout:30000,
                success:response=>{try{check(response,stage);finish(resolve,response);}catch(error){finish(reject,error);}},
                error:(xhr,state)=>{
                    try{if(xhr?.responseJSON)check(xhr.responseJSON,stage,xhr.status);}catch(error){finish(reject,error);return;}
                    finish(reject,failure(stage,state==='timeout'?'timeout':state==='parsererror'?'format':xhr?.status?'http':'network',null,xhr?.status));
                }
            });
        });
        const parse=(r,stage)=>{
            try{
                const data=typeof r?.data==='string'?JSON.parse(r.data):r?.data;
                if(!data||typeof data!=='object')throw Error();
                return data;
            }catch(_){throw failure(stage,'format',r);}
        };
        function store(key,value){try{api.storage.setItem(key,value);}catch(_){throw Error('SAVE_FAILED');}}
        async function bind(token,options={}){if(!String(token||'').trim())throw Error('TOKEN_REQUIRED');const result=await request(2,'',api.tokenHeaders(token),options);if(!result?.success)throw failure('bind','format',result);if(options.signal?.aborted)throw Error('CANCELLED');store('kjq_token',token);}
        async function authorize(uid,options){
            const auth=await request(6,{roleId:uid,serverId:'76402e5b20be2c39f095a152090afddc',forceRefresh:true},api.headers(),options);
            const data=parse(auth,'auth');if(!data?.accessToken)throw failure('auth','format',auth);
            if(options?.signal?.aborted)throw Error('CANCELLED');store('kjq_bat',data.accessToken);return data.accessToken;
        }
        async function list(uid,options={}){
            if(!/^\d{9}$/.test(uid))throw Error('INVALID_UID');
            if(!api.storage.getItem('kjq_token'))throw Error('TOKEN_REQUIRED');
            const params={gameId:3,roleId:uid,serverId:'76402e5b20be2c39f095a152090afddc'};
            for(let attempt=0;attempt<2;attempt++){
                const accessToken=await authorize(uid,options),headers=api.headers(accessToken,false),refreshHeaders={...headers};delete refreshHeaders.token;
                try{await request(3,params,refreshHeaders,options);
                    const result=parse(await request(0,params,headers,options),'list');if(!Array.isArray(result?.roleList))throw failure('list','format');return result.roleList;
                }catch(error){if(attempt||error.importFailure?.reason!=='dataToken')throw error;}
            }
        }
        async function detail(uid,record,options={}){
            if(!/^\d{9}$/.test(uid))throw Error('INVALID_UID');
            const params={gameId:3,roleId:uid,serverId:'76402e5b20be2c39f095a152090afddc',channelId:19,countryCode:1,id:record.gameRoleId};
            let data;
            for(let attempt=0;attempt<2;attempt++){
                const headers=api.headers(api.storage.getItem('kjq_bat'),false);
                try{await request(3,params,headers,options);data=parse(await request(1,params,headers,options),'detail');break;}
                catch(error){if(attempt||error.importFailure?.reason!=='dataToken')throw error;await authorize(uid,options);}
            }
            if(!Array.isArray(data?.chainList)||!Array.isArray(data?.phantomData?.equipPhantomList)||data.phantomData.equipPhantomList.filter(Boolean).length>5)throw failure('detail','format');
            const role=JSON.parse(JSON.stringify(record));role.level=data.level;role.ming=data.chainList.filter(c=>c.unlocked).length;
            for(const key of ['weaponImg','weaponStar','weaponlevel','weaponReson','weaponName','weaponGameId'])delete role[key];
            if(data.weaponData?.weapon){role.weaponImg=data.weaponData.weapon.weaponIcon;role.weaponStar=data.weaponData.weapon.weaponStarLevel;role.weaponlevel=data.weaponData.level;role.weaponReson=data.weaponData.resonLevel;role.weaponName=data.weaponData.weapon.weaponName||data.weaponData.weapon.name||null;role.weaponGameId=data.weaponData.weapon.weaponId??null;}
            if(data.skillList!=null&&!Array.isArray(data.skillList))throw failure('detail','format');
            role.skillList=(data.skillList||[]).slice(0,5).map(s=>({img:s?.skill?.iconUrl||null,name:s?.skill?.name||null,level:s?.level??null}));
            try{role.costList=(data.phantomData?.equipPhantomList||[]).filter(Boolean).map(e=>api.convert(e,role));}catch(_){throw failure('detail','mapping');}
            if(root.CharacterCore?.importSource)role.importSource=await root.CharacterCore.importSource(uid,record.gameRoleId);
            if(options.signal?.aborted)throw Error('CANCELLED');return role;
        }
        return {bind,list,detail};
    }
    function formatError(error,t){
        const info=error.importFailure;
        if(!info)return t('workspace.'+(['INVALID_UID','TOKEN_REQUIRED','SOURCE_CHANGED','INVALID_DATA','INVALID_ECHO','READ_ONLY','IDENTITY','COST_LIMIT','SAVE_FAILED'].includes(error.message)?error.message:'IMPORT_FAILED'));
        return t('workspace.importFailure',{stage:t('workspace.importStage.'+info.stage),reason:t('workspace.importReason.'+info.reason)})
            +(info.code?' '+t('workspace.importCode',{code:info.code}):'')
            +(info.status?' HTTP '+info.status:'');
    }
    root.ImportService={create,formatError};
})(typeof globalThis!=='undefined'?globalThis:this);
