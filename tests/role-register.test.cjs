const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const {createAdapter}=require('../js/role-view-model.js');
const renderer=require('../js/role-register-renderer.js');
const i18n=require('../js/i18n.js');
const messages=require('../js/i18n-dictionaries.js');
const context={$:()=>{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/base.js'),'utf8')+'\n;globalThis.api={roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection};',context);
const normalize=createAdapter(context.api);
function fixture(imported=false){
    const mains=[['暴击22%','暴击','22%'],['属伤30%','属伤','30%'],['共鸣效率32%','共鸣效率','32%'],['攻击18%','大攻击','18%'],['攻击18%','大攻击','18%']];
    return {roleId:imported?102:101,roleListId:1,level:90,ming:0,isImport:imported,totalScore:'999',costList:mains.map((m,i)=>({costId:600+i,imgCode:String([59,51,52,35,39][i]),costListId:[59,51,52,35,39][i],type:['Cost4','Cost3','Cost3','Cost1','Cost1'][i],mainAtrri:imported?{property:m[1],value:m[2]}:m[0],suite:'光套',sumScores:'999',propertyList:(i===2?[['小防御','50'],['大防御','8.1%'],['小生命','320'],['暴击','6.3%'],['共鸣效率','8.4%']]:[['暴击','8.1%'],['暴伤','16.2%'],['大攻击','8.6%'],['技能伤害','8.6%'],['共鸣效率','8.4%']]).map(([property,value])=>({property,value}))}))};
}
const manual=fixture(),imported=fixture(true),before=JSON.stringify([manual,imported]);
const models=[normalize(manual),normalize(imported),normalize({...manual,costList:[]}),normalize({...manual,roleListId:999}),normalize({...manual,costList:manual.costList.slice(0,3)})];
const used=new Set();
for(const locale of ['zh-TW','zh-CN','en']){
    const translator=i18n.create({url:'https://test.invalid/?lang='+locale});
    for(const model of models){
        const result=renderer.render(model,translator);
        assert.equal((result.html.match(/class="rr-slot(?: |")/g)||[]).length,5);
        assert.equal((result.html.match(/class="rr-inline-analysis"/g)||[]).length,1);
        assert.match(result.html,/class="rr-inline-analysis"[^>]+hidden/);
        assert.doesNotMatch(result.html,/mc-cost-list|\{(?:value|position|count)\}/);
        result.usedKeys.forEach(key=>{used.add(key);assert.ok(Object.hasOwn(messages[locale],key));});
        if(model.summary.status==='incomplete')assert.ok(!result.html.includes(translator.t('register.lowestShort')));
    }
    for(const error of ['missing','unreadable'])renderer.render(null,translator,{error}).usedKeys.forEach(k=>used.add(k));
    for(const id of [49,51,53,...context.api.newCharacterModels.ids]){
        const modes=context.api.newCharacterModels.settings[id]?.modes.map(x=>x[0])||['fusion','harmony','tune'];
        for(const damageMode of modes)renderer.render(normalize({...manual,roleListId:id,damageMode,referenceHealth:999999,extraEnergy:999}),translator).usedKeys.forEach(k=>used.add(k));
    }
}
assert.equal(JSON.stringify([manual,imported]),before);
assert.equal(models[0].summary.score,models[1].summary.score);
assert.deepEqual(models[0].slots.map(s=>s.echo.score.value),models[1].slots.map(s=>s.echo.score.value));
assert.notEqual(models[0].summary.score,999);
assert.deepEqual(models[0].summary.weakestPositions,[3]);
const expanded=structuredClone(models[0]);expanded.scale.max=150;
const html=renderer.render(expanded,i18n.create({language:'en'})).html;
for(const slot of expanded.slots)assert.ok(html.includes('width:'+(slot.echo.score.value/150*100)+'%'));
const unknown=structuredClone(models[0]);unknown.role.catalogId='<script>';unknown.role.nameKey=null;
assert.doesNotMatch(renderer.render(unknown,i18n.create()).html,/<script>/);
assert.equal(normalize({...manual,roleListId:62,referenceHealth:999999}).model.parameters.referenceHealth,70000);
assert.equal(normalize({...manual,roleListId:51,extraEnergy:999}).model.parameters.extraEnergy,200);
// 模拟两个正式入口，语言切换只能写入语言偏好，不能写角色存档。
for(const input of [manual,imported]){
    let ready,change,title='',contents='';const writes=[];
    const storage={getItem:key=>key==='mcData'?JSON.stringify({role:[input]}):null,setItem:(...args)=>writes.push(args)};
    const host={id:'',set innerHTML(v){contents=v;},addEventListener:(event,fn)=>{change=fn;},querySelector:()=>null};
    const doc={documentElement:{},addEventListener:(event,fn)=>{ready=fn;},createElement:()=>host,body:{append(){}},set title(v){title=v;}};
    const location={href:'http://localhost/mccost.html?view=register&roleid='+input.roleId,search:'?view=register&roleid='+input.roleId};
    const env={...context.api,document:doc,location,localStorage:storage,URL,URLSearchParams,RoleViewModel:{createAdapter},RoleRegisterRenderer:renderer,RoleRegisterController:require('../js/role-register-controller.js'),EchoI18n:i18n};env.window={RoleRegisterMode:true,addEventListener(){},document:doc,location,localStorage:storage,navigator:{language:'en'}};
    // 候选界面在独立测试中覆盖；本例只验证角色入口与语言写入边界。
    env.RoleCandidateSurface={mount:()=>({render(){},restore(){},invalidate(){}})};
    vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/role-register-page.js'),'utf8'),env);ready();
    assert.equal(writes.length,0);assert.ok(contents.includes('rr-workspace'));assert.ok(title.includes('Character'));
    change({target:{matches:()=>true,value:'zh-CN'}});
    assert.deepEqual(writes,[[i18n.STORAGE_KEY,'zh-CN']]);assert.equal(doc.documentElement.lang,'zh-CN');
}
for(const [search,wide,expected] of [['?view=register',true,true],['?view=register',false,false],['',true,false]]){
    const env={window:{},location:{search},URLSearchParams,matchMedia:()=>({matches:wide}),document:{documentElement:{classList:{add(){}}}}};
    vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/role-register-mode.js'),'utf8'),env);assert.equal(env.window.RoleRegisterMode,expected);
}
// 预览不能进入旧版初始化中的 DOM 查询、排序或存档流程。
for(const file of ['mccost.js','mccost2.js']){
    const callbacks=[];const env={window:{RoleRegisterMode:true},$:fn=>{assert.equal(typeof fn,'function');callbacks.push(fn);}};
    vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/'+file),'utf8'),env);
    callbacks.forEach(fn=>fn());
}
for(const key of used)for(const locale of ['zh-TW','zh-CN','en'])assert.ok(Object.hasOwn(messages[locale],key),locale+'/'+key);
if(process.argv[2]){
    fs.mkdirSync(process.argv[2],{recursive:true});
    // 独立 QA 来源仅由显式按钮写入合成测试配置，不进入产品入口。
    fs.writeFileSync(path.join(process.argv[2],'seed.html'),'<!doctype html><meta charset="utf-8"><title>QA fixture</title><button id="seed">Load synthetic QA fixtures</button><p><a href="/mccost.html?roleid=101&view=register&lang=en">Manual</a> <a href="/mccost-readonly.html?roleid=102&view=register&lang=en">Imported</a></p><script>document.querySelector("button").onclick=()=>{localStorage.setItem("mcData",JSON.stringify('+JSON.stringify({role:[manual,imported]})+'));document.querySelector("button").textContent="Fixtures ready";};</script>');
}
console.log('PASS: shared rendering, '+used.size+' complete trilingual keys, five positions/one hidden analysis host, common scale, missing/unknown models, manual/import parity, locale-only writes and Desktop opt-in.');
