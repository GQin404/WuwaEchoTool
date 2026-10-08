/* 沿用原服务地址、请求签名和转换器；网络成功不等于用户已确认保存。 */
(function(root){
    'use strict';
    function create(api){
        const request=(index,data,headers)=>new Promise((resolve,reject)=>api.ajax({url:api.host+api.methods[index],type:'POST',headers,data,dataType:'json',success:resolve,error:()=>reject(Error('IMPORT_FAILED'))}));
        const parse=r=>{if(!r||![200,10902].includes(r.code))throw Error('IMPORT_FAILED');return typeof r.data==='string'?JSON.parse(r.data):r.data;};
        async function bind(token){const result=await request(2,'',api.tokenHeaders(token));if(!result?.success)throw Error('IMPORT_FAILED');api.storage.setItem('kjq_token',token);}
        async function list(uid){
            if(!/^\d{9}$/.test(uid))throw Error('INVALID_UID');
            if(!api.storage.getItem('kjq_token'))throw Error('TOKEN_REQUIRED');
            const params={gameId:3,roleId:uid,serverId:'76402e5b20be2c39f095a152090afddc'};
            const auth=await request(6,{roleId:uid,serverId:params.serverId,forceRefresh:true},api.headers());
            const data=typeof auth.data==='string'?JSON.parse(auth.data):auth.data;if(!data?.accessToken)throw Error('IMPORT_FAILED');
            api.storage.setItem('kjq_bat',data.accessToken);
            const headers=api.headers(data.accessToken,false),refreshHeaders={...headers};delete refreshHeaders.token;
            await request(3,params,refreshHeaders);
            const result=parse(await request(0,params,headers));if(!Array.isArray(result?.roleList))throw Error('IMPORT_FAILED');return result.roleList;
        }
        async function detail(uid,record){
            if(!/^\d{9}$/.test(uid))throw Error('INVALID_UID');
            const params={gameId:3,roleId:uid,serverId:'76402e5b20be2c39f095a152090afddc',channelId:19,countryCode:1,id:record.gameRoleId};
            const headers=api.headers(api.storage.getItem('kjq_bat'),false);await request(3,params,headers);
            const data=parse(await request(1,params,headers));if(!Array.isArray(data?.chainList)||!Array.isArray(data?.phantomData?.equipPhantomList))throw Error('IMPORT_FAILED');
            const role=JSON.parse(JSON.stringify(record));role.level=data.level;role.ming=data.chainList.filter(c=>c.unlocked).length;
            if(data.weaponData?.weapon){role.weaponImg=data.weaponData.weapon.weaponIcon;role.weaponStar=data.weaponData.weapon.weaponStarLevel;role.weaponlevel=data.weaponData.level;role.weaponReson=data.weaponData.resonLevel;}
            role.skillList=(data.skillList||[]).slice(0,5).map(s=>({img:s.skill.iconUrl,level:s.level}));
            role.costList=(data.phantomData?.equipPhantomList||[]).filter(Boolean).map(e=>api.convert(e,role));return role;
        }
        return {bind,list,detail};
    }
    root.ImportService={create};
})(typeof globalThis!=='undefined'?globalThis:this);
