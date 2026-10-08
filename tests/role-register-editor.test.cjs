const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const controller=require('../js/role-register-controller.js');
// 使用真实编辑器保存回调与评分函数，DOM 仅替换为无副作用的查询桩。
for(const preview of [false,true]){
    const callbacks=[],events=new Map(),values=new Map(),writes=[],navigations=[];
    let confirmation=false;
    const role={roleId:101,roleListId:1,ming:0,costList:[35,59].map((id,i)=>({costId:600+i,costListId:id,imgCode:String(id),type:i?'Cost4':'Cost1',mainAtrri:i?'暴击22%':'攻击18%',suite:null,sumScores:0,propertyList:[{property:'暴击',value:'8.1%'}]}))};
    const saved={role:[role],unusedEchoes:[]},before=JSON.stringify(saved);
    function jquery(selector){
        if(typeof selector==='function'){callbacks.push(selector);return;}
        let node;
        node=new Proxy({length:1},{get(target,key){
            if(key==='length')return 1;
            return (...args)=>{
                if(['click','change','on'].includes(key))events.set(String(selector)+'/'+key,args.at(-1));
                if(['html','val','attr'].includes(key)){
                    const field=String(selector)+'/'+key;
                    if(!args.length)return values.get(field)||'0';
                    values.set(field,args.at(-1));
                }
                return node;
            };
        }});return node;
    }
    const context={$:()=>{},document:{},console:{log(){}},URLSearchParams,confirm:()=>confirmation,alert:message=>{throw Error(message);},location:{search:preview?'?returnRegister=1&rrPosition=2':''},window:{open:url=>navigations.push(url)},RoleRegisterController:controller};
    vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/base.js'),'utf8'),context);
    Object.assign(context,{$:jquery,getQueryString:key=>({roleid:'101',costid:'601'})[key],getDataFromCache:()=>JSON.parse(before),saveDataToCache:data=>writes.push(JSON.parse(JSON.stringify(data)))});
    vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/costedit.js'),'utf8'),context);
    callbacks.forEach(fn=>fn());assert.equal(writes.length,0);
    events.get('.mc-cost-savebtn/click')();assert.equal(writes.length,0);assert.equal(navigations.length,0);
    confirmation=true;events.get('.mc-cost-savebtn/click')();assert.equal(writes.length,1);
    assert.deepEqual(writes[0].role[0].costList.map(e=>e.costId),[600,601]);
    const url=new URL(navigations[0],'http://local.test');
    assert.equal(url.searchParams.get('roleid'),'101');
    assert.equal(url.searchParams.get('view'),preview?'register':null);
    assert.equal(url.searchParams.get('selectedEcho'),preview?'601':null);
    assert.equal(url.searchParams.get('selectedPosition'),preview?'2':null);
    assert.equal(JSON.stringify(saved),before);
    if(preview){
        callbacks.length=0;events.clear();writes.length=0;navigations.length=0;
        context.getQueryString=key=>({roleid:'101',registerAdd:'1'})[key];
        vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/mccost.js'),'utf8'),context);
        callbacks.forEach(fn=>fn());
        assert.equal(writes.length,0);
        assert.deepEqual(Array.from(context.curRole.costList,e=>e.costId),[600,601]);
        context.currentCostId='39';events.get('#qd-btn2/click')();
        assert.equal(writes.length,1);
        assert.deepEqual(writes[0].role[0].costList.slice(0,2).map(e=>e.costId),[600,601]);
        const target=new URL(navigations[0],'http://local.test');
        assert.equal(target.searchParams.get('view'),'register');
        assert.equal(target.searchParams.get('selectedPosition'),'3');
        assert.equal(target.searchParams.get('selectedEcho'),String(writes[0].role[0].costList[2].costId));
    }
}
console.log('PASS: real legacy edit/add callbacks; no initialization/cancel writes, explicit save/add only, original and preview return routes, unchanged Echo order, new instance restoration.');
