const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const controller=require('../js/role-register-controller.js');
const {createAdapter}=require('../js/role-view-model.js');
const renderer=require('../js/role-register-renderer.js');
const i18n=require('../js/i18n.js');
const context={$:()=>{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/base.js'),'utf8')+'\n;globalThis.api={roleList,costList,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection};',context);
const normalize=createAdapter(context.api);
function fixture(imported=false){
    return {roleId:501,roleListId:1,ming:0,isImport:imported,costList:[35,59,52,51,39].map((id,n)=>({costId:900+n,costListId:id,type:['Cost1','Cost4','Cost3','Cost3','Cost1'][n],imgCode:String(id),mainAtrri:imported?{property:'大攻击',value:'18%'}:'攻击18%',propertyList:[{property:'暴击',value:'8.1%'},{property:'暴伤',value:'16.2%'},{property:'大攻击',value:'8.6%'},{property:'小防御',value:'50'},{property:'共鸣效率',value:'8.4%'}]}))};
}
let renders=0;
for(const imported of [false,true]){
    const input=fixture(imported),before=JSON.stringify(input);let calculations=0;
    const c=controller.create(input,role=>{calculations++;return normalize(role);});
    const order=c.snapshot().model.slots.map(s=>s.echo.id);
    for(let position=1;position<=5;position++){
        const token=c.snapshot().identities[position];c.select(position,token);
        assert.deepEqual(c.snapshot().selection,{position,echoIdentity:token,kind:'echo'});
        assert.deepEqual(c.snapshot().model.slots.map(s=>s.echo.id),order);
        for(const locale of ['zh-TW','zh-CN','en']){
            const beforeCalculations=calculations,translator=i18n.create({language:locale});
            const state=c.snapshot(),result=renderer.render(state.model,translator,{interaction:state});renders++;
            assert.equal((result.html.match(/class="rr-inline-analysis"/g)||[]).length,1);
            assert.equal((result.html.match(/aria-pressed="true"/g)||[]).length,1);
            assert.ok(result.html.includes('data-rr-collapse'));
            assert.ok(result.html.includes('rr-substats'));
            assert.doesNotMatch(result.html,/\{(?:state|id|value|position)\}/);
            assert.equal(calculations,beforeCalculations);
            assert.equal(c.snapshot().selection.position,position);
            assert.equal(result.html.includes('mode=echo'),!imported);
        }
        c.select(position,token);assert.equal(c.snapshot().selection,null);
    }
    assert.equal(calculations,1);
    c.select(3,c.snapshot().identities[3]);c.updateModel('ming',3);
    assert.equal(c.snapshot().selection.position,3);assert.equal(c.snapshot().model.model.chain,3);
    c.updateModel('costList',[]);assert.deepEqual(c.snapshot().model.slots.map(s=>s.echo.id),order);
    c.resetModel();assert.equal(c.snapshot().model.model.chain,0);
    const moved=structuredClone(input);[moved.costList[2],moved.costList[4]]=[moved.costList[4],moved.costList[2]];
    c.refresh(moved);assert.equal(c.snapshot().selection.position,5);
    assert.deepEqual(c.snapshot().model.slots.map(s=>s.echo.id),moved.costList.map(e=>e.costId));
    const removed=structuredClone(moved);removed.costList[4].costId=9999;c.refresh(removed);
    assert.equal(c.snapshot().selection,null);assert.equal(c.snapshot().notice,'configurationUpdated');
    c.select(5,'instance:902');assert.equal(c.snapshot().selection,null);
    assert.equal(JSON.stringify(input),before);
}
for(const change of ['missing','duplicate','outsideVisible']){
    const input=fixture();if(change==='missing')delete input.costList[0].costId;else if(change==='duplicate')input.costList[1].costId=input.costList[0].costId;else input.costList.push(structuredClone(input.costList[0]));
    const c=controller.create(input,normalize);c.select(1,c.snapshot().identities[1]);
    assert.match(c.snapshot().selection.echoIdentity,/^session:/);
    c.updateModel('ming',2);assert.equal(c.snapshot().selection.position,1);
    c.refresh(input);assert.equal(c.snapshot().selection,null);
    c.restore(1,input.costList[0].costId);assert.equal(c.snapshot().selection,null);
}
const input=fixture();const c=controller.create(input,normalize);
c.restore(3,902);assert.equal(c.snapshot().selection.position,3);
c.restore(3,9999);assert.equal(c.snapshot().selection,null);
assert.equal(controller.editorReturn('',501,902),'./mccost.html?roleid=501');
assert.equal(controller.editorReturn('?returnRegister=1&rrPosition=3',501,902),'./mccost.html?roleid=501&view=register&selectedPosition=3&selectedEcho=902');
assert.ok(!controller.editorReturn('?returnRegister=1&return=https://evil.test',501,902).includes('evil'));
for(const type of ['empty','incomplete','unknown']){
    const input=fixture();if(type==='empty')input.costList=[];if(type==='incomplete')input.costList[2].propertyList=[];if(type==='unknown')input.roleListId=999;
    const c=controller.create(input,normalize);c.select(3,c.snapshot().identities[3]);
    for(const locale of ['zh-TW','zh-CN','en']){
        const tr=i18n.create({language:locale}),state=c.snapshot(),html=renderer.render(state.model,tr,{interaction:state}).html;
        if(type==='empty'){assert.ok(html.includes(tr.t('loadout.add')));assert.ok(!html.includes('rr-substats'));}
        if(type==='incomplete')assert.ok(html.includes(tr.t('interaction.incomplete')));
        if(type==='unknown'){assert.ok(html.includes(tr.t('interaction.reason.unknownModel')));assert.ok(!html.includes('NaN'));}
        assert.ok(!html.includes(tr.t('register.lowestShort')));
    }
}
for(const id of [49,51,53,...context.api.newCharacterModels.ids]){
    const c=controller.create({...fixture(),roleListId:id},normalize);c.select(4,c.snapshot().identities[4]);
    const modes=context.api.newCharacterModels.settings[id]?.modes.map(m=>m[0])||(id===49?['tune','fusion']:id===53?['fusion','harmony']:[]);
    for(const mode of modes){c.updateModel('damageMode',mode);assert.equal(c.snapshot().model.model.parameters.mode,mode);assert.equal(c.snapshot().selection.position,4);}
    if(id===51){c.updateModel('extraEnergy',250);assert.equal(c.snapshot().model.model.parameters.extraEnergy,200);}
    if(id===62){c.updateModel('referenceHealth',1);assert.equal(c.snapshot().model.model.parameters.referenceHealth,15000);}
    for(const locale of ['zh-TW','zh-CN','en'])renderer.render(c.snapshot().model,i18n.create({language:locale}),{interaction:c.snapshot(),modelModes:modes});
}
// 无槽位目标的依据披露不应改变已有选择。
c.select(2,c.snapshot().identities[2]);const selected=c.snapshot().selection;c.evidence();assert.deepEqual(c.snapshot().selection,selected);
console.log('PASS: '+renders+' localized selected renders; all five slots, toggle/collapse, stable ordering, model refresh, removed/moved/ambiguous IDs, return URLs, empty/incomplete/unknown models, no input mutation or selection/locale recalculation.');
